const SK_KEY_OF_MISTAKE_INFO = "storage_key_of_mistake_info"

/*
* 误触管理
*/
var _MistakeMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_MistakeMgr Instance...")

		// 是否在屏蔽区域
		var _isAreaEnabled = false

		// 今日误触已检查次数
		var _todayCheckedCount = {}

		// 今日误触已触发次数
		var _todayInvokedCount = {}

		// 误触是否开启
		var _isEnabled = {}

		// 误触最大触发次数
		var _maxInvokeCount = {}

		// 误触触发概率
		var _invokeRate = 0

		// 误触触发间隔
		var _invokeInterval = {}

		var _load = function () {
			let save_json_str = G_PlatHelper.getStorage(SK_KEY_OF_MISTAKE_INFO)

			let isRefreshed = false
			if (save_json_str && save_json_str !== "") {
				let save_json = JSON.parse(save_json_str)

				let getSavedValue = function (key, def = 0) {
					if (typeof save_json[key] !== "undefined") {
						return save_json[key]
					}
					else {
						return def
					}
				}

				if (getSavedValue("saveDay") === G_ServerInfo.getCurServerDayOfYear()) {
					if (G_SupportMistakeTypes.length > 0) {
						G_SupportMistakeTypes.forEach(type => {
							_todayCheckedCount[type] = getSavedValue("checkedCount_{0}".format(type))
							_todayInvokedCount[type] = getSavedValue("invokedCount_{0}".format(type))
						})

						isRefreshed = true
					}
				}
			}

			if (!isRefreshed) {
				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						_todayCheckedCount[type] = 0
						_todayInvokedCount[type] = 0
					})
				}
			}
		}

		var _save = function () {
			let save_json = {
				saveDay: G_ServerInfo.getCurServerDayOfYear(),
			}

			if (G_SupportMistakeTypes.length > 0) {
				G_SupportMistakeTypes.forEach(type => {
					save_json["checkedCount_{0}".format(type)] = _todayCheckedCount[type]
					save_json["invokedCount_{0}".format(type)] = _todayInvokedCount[type]
				})
			}

			// save
			G_PlatHelper.setStorage(SK_KEY_OF_MISTAKE_INFO, JSON.stringify(save_json))
		}

		return {
			init: function ( cb ) {
				// init variables
				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						_todayCheckedCount[type] = 0
						_todayInvokedCount[type] = 0
						_isEnabled[type] = false
						_maxInvokeCount[type] = 0
						_invokeInterval[type] = 0
					})
				}

				// init functions
				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						let asyncFuncName = "is" + type.charAt(0).toUpperCase() + type.slice(1) + "MistakeEnabledAsync"
						this[asyncFuncName] = () => {
							if (!_isAreaEnabled) {
								return false
							}
			
							if (!_isEnabled[type]) {
								return false
							}
			
							// add checked count
							_todayCheckedCount[type] += 1
			
							let isEnabled = this._checkMaxkInvokeCount(type) && this._checkInvokeRate() && this._checkInvokeInterval(type)
							if (isEnabled) {
								// add invoked count
								_todayInvokedCount[type] += 1
							}
							
							// save
							_save()
			
							// cb
							return isEnabled
						}

						let funcName = "is" + type.charAt(0).toUpperCase() + type.slice(1) + "MistakeEnabled"
						this[funcName] = ( cb ) => {
							if (typeof cb !== "function") {
								return
							}
			
							let isEnabled = this[asyncFuncName]()
			
							// cb
							cb(isEnabled)
						}
					})
				}

				// load
				_load()

				// log
				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						console.log("{0} checked count: ".format(type), _todayCheckedCount[type])
						console.log("{0} invoked count: ".format(type), _todayInvokedCount[type])
					})
				}

				let pArr = []

				pArr.push(new Promise(function (resolve, reject) {
					G_Switch.isAdvStateNormal(false, function( isEnabled ) {
						console.log("is in enable area:", isEnabled)
						_isAreaEnabled = isEnabled
						resolve(isEnabled)
					})
				}))

				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						let funcName = "isMistakeEnabled"
						let func = G_Switch[funcName]
						if (func) {
							pArr.push(new Promise(function (resolve, reject) {
								func.call(G_Switch, type, isEnabled => {
									console.log("is {0} eanbled:".format(type), isEnabled)
									_isEnabled[type] = isEnabled
									resolve(isEnabled)
								})
							}))
						}
					})

					pArr.push(new Promise(function (resolve, reject) {
						G_Switch.getTodayMaxMistakeCounts(function( count ) {
							if (typeof count === "string" && count.indexOf("||") !== -1) {
								// default
								G_SupportMistakeTypes.forEach(type => {
									_maxInvokeCount[type] = 999
								})
	
								let counts = count.split("||")
	
								for (let i = 0; i < counts.length; i++) {
									let countType = counts[i].split(":")[0]
									let isSupport = false

									G_SupportMistakeTypes.forEach(type => {
										if (countType === type) {
											isSupport = true
										}
									})

									if (isSupport) {
										_maxInvokeCount[countType] = parseInt(counts[i].split(":")[1], 10)
										console.log("today max invoke count of {0}:".format(countType), _maxInvokeCount[countType])
									}
								}
							}
							else {
								G_SupportMistakeTypes.forEach(type => {
									_maxInvokeCount[type] = parseInt(count, 10)
								})
								console.log("today max invoke count:", parseInt(count, 10))
							}
							resolve(count)
						})
					}))
				}

				pArr.push(new Promise(function (resolve, reject) {
					G_Switch.getInvokeMistakeRate(function( rate ) {
						console.log("invoke rate:", rate)
						_invokeRate = rate
						resolve(rate)
					})
				}))

				if (G_SupportMistakeTypes.length > 0) {
					G_SupportMistakeTypes.forEach(type => {
						pArr.push(new Promise(function (resolve, reject) {
							G_Switch.getIntervalOfMistakes(type, function( inverval ) {
								console.log("{0} invoke inverval:".format(type), inverval)
								_invokeInterval[type] = inverval
								resolve(inverval)
							});
						}))
					})
				}

				Promise.all(pArr).then(function() {
					console.log("init mistake mgr state succ...")
					if (typeof cb === "function") {
						cb()
					}
				}).catch(function(err) {
					console.error(err)

					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				});
			},

			_checkMaxkInvokeCount: function ( type ) {
				if (typeof _todayInvokedCount[type] !== "undefined" && typeof _maxInvokeCount[type] !== "undefined") {
					return _todayInvokedCount[type] < _maxInvokeCount[type]
				}

				return false
			},

			_checkInvokeRate: function () {
				return G_Utils.random(1, 100) <= _invokeRate
			},

			_checkInvokeInterval: function ( type ) {
				if (typeof _invokeInterval[type] !== "undefined" && typeof _todayCheckedCount[type] !== "undefined") {
					let invokeInterval = _invokeInterval[type]
					let todayCheckedCount = _todayCheckedCount[type]

					if (invokeInterval === 0) {
						return true
					}
					else {
						return (todayCheckedCount % (invokeInterval + 1) === 1)
					}
				}
				else {
					return false
				}
			}
		};
	};

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
}();

// global
window.G_MistakeMgr = _MistakeMgr.getInstance()