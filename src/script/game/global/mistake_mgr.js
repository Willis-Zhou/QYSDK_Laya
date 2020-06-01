var SK_KEY_OF_MISTAKE_INFO = "storage_key_of_mistake_info"

/*
* 误触管理
*/
var _MistakeMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_MistakeMgr Instance...")

		// 今日误触已检查次数 --- 狂点
		var _todayCheckedCount_click = 0
		// 今日误触已触发次数 --- 狂点
		var _todayInvokedCount_click = 0
		// 今日误触已检查次数 --- 位移
		var _todayCheckedCount_move = 0
		// 今日误触已触发次数 --- 位移
		var _todayInvokedCount_move = 0
		// 今日误触已检查次数 --- 按钮
		var _todayCheckedCount_btn = 0
		// 今日误触已触发次数 --- 按钮
		var _todayInvokedCount_btn = 0
		// 今日误触已检查次数 --- 退出
		var _todayCheckedCount_exit = 0
		// 今日误触已触发次数 --- 退出
		var _todayInvokedCount_exit = 0

		// 以下为开关配置，初始化读取
		// 是否在屏蔽区域
		var _isEnabled = false
		// 狂点误触是否开启
		var _isClickEnabled = false
		// 位移误触是否开启
		var _isMoveEnabled = false
		// 按钮误触是否开启
		var _isBtnEnabled = false
		// 退出误触是否开启
		var _isExitEnabled = false
		// 误触最大触发次数
		var _maxInvokeCount = {
			click: 0,
			move: 0,
			btn: 0,
			exit: 0
		}
		// 误触触发概率
		var _invokeRate = 0
		// 误触触发间隔 --- 狂点
		var _invokeInterval_click = 0
		// 误触触发间隔 --- 位移
		var _invokeInterval_move = 0
		// 误触触发间隔 --- 按钮
		var _invokeInterval_btn = 0
		// 误触触发间隔 --- 退出
		var _invokeInterval_exit = 0

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
					_todayCheckedCount_click = getSavedValue("checkedCount_click")
					_todayInvokedCount_click = getSavedValue("invokedCount_click")
					_todayCheckedCount_move = getSavedValue("checkedCount_move")
					_todayInvokedCount_move = getSavedValue("invokedCount_move")
					_todayCheckedCount_btn = getSavedValue("checkedCount_btn")
					_todayInvokedCount_btn = getSavedValue("invokedCount_btn")
					_todayCheckedCount_exit = getSavedValue("checkedCount_exit")
					_todayInvokedCount_exit = getSavedValue("invokedCount_exit")
					isRefreshed = true
				}
			}

			if (!isRefreshed) {
				_todayCheckedCount_click = 0
				_todayInvokedCount_click = 0
				_todayCheckedCount_move = 0
				_todayInvokedCount_move = 0
				_todayCheckedCount_btn = 0
				_todayInvokedCount_btn = 0
				_todayCheckedCount_exit = 0
				_todayInvokedCount_exit = 0
			}
		}

		var _save = function () {
			let save_json = {
				saveDay: G_ServerInfo.getCurServerDayOfYear(),
				checkedCount_click: _todayCheckedCount_click,
				invokedCount_click: _todayInvokedCount_click,
				checkedCount_move: _todayCheckedCount_move,
				invokedCount_move: _todayInvokedCount_move,
				checkedCount_btn: _todayCheckedCount_btn,
				invokedCount_btn: _todayInvokedCount_btn,
				checkedCount_exit: _todayCheckedCount_exit,
				invokedCount_exit: _todayInvokedCount_exit,
			}

			// save
			G_PlatHelper.setStorage(SK_KEY_OF_MISTAKE_INFO, JSON.stringify(save_json))
		}

		return {
			init: function ( cb ) {
				// load
				_load()

				console.log("click checked count: ", _todayCheckedCount_click)
				console.log("click invoked count: ", _todayInvokedCount_click)
				console.log("move checked count: ", _todayCheckedCount_move)
				console.log("move invoked count: ", _todayInvokedCount_move)
				console.log("btn checked count: ", _todayCheckedCount_btn)
				console.log("btn invoked count: ", _todayInvokedCount_btn)
				console.log("exit checked count: ", _todayCheckedCount_exit)
				console.log("exit invoked count: ", _todayInvokedCount_exit)

				let p0 = new Promise(function (resolve, reject) {
					G_Switch.isAdvStateNormal(false, function( isEnabled ) {
						console.log("is in enable area:", isEnabled)
						_isEnabled = isEnabled
						resolve(isEnabled)
					});
				})

				let p1 = new Promise(function (resolve, reject) {
					G_Switch.isClickMistakeEnabled(function( isEnabled ) {
						console.log("is click eanbled:", isEnabled)
						_isClickEnabled = isEnabled
						resolve(isEnabled)
					});
				})

				let p2 = new Promise(function (resolve, reject) {
					G_Switch.isMoveMistakeEnabled(function( isEnabled ) {
						console.log("is move eanbled:", isEnabled)
						_isMoveEnabled = isEnabled
						resolve(isEnabled)
					});
				})

				let p3 = new Promise(function (resolve, reject) {
					G_Switch.isBtnMistakeEnabled(function( isEnabled ) {
						console.log("is btn eanbled:", isEnabled)
						_isBtnEnabled = isEnabled
						resolve(isEnabled)
					});
				})

				let p4 = new Promise(function (resolve, reject) {
					G_Switch.isExitMistakeEnabled(function( isEnabled ) {
						console.log("is exit eanbled:", isEnabled)
						_isExitEnabled = isEnabled
						resolve(isEnabled)
					});
				})

				let p5 = new Promise(function (resolve, reject) {
					G_Switch.getTodayMaxMistakeCounts(function( count ) {
						if (typeof count === "string" && count.indexOf("||") !== -1) {
							let counts = count.split("||")

							for (let i = 0; i < counts.length; i++) {
								if (counts[i].split(":")[0] === "click") {
									let _count = parseInt(counts[i].split(":")[1], 10)
									_maxInvokeCount.click = _count
									console.log("today max invoke count of click:", _count)
								}
								else if (counts[i].split(":")[0] === "move") {
									let _count = parseInt(counts[i].split(":")[1], 10)
									_maxInvokeCount.move = _count
									console.log("today max invoke count of move:", _count)
								}
								else if (counts[i].split(":")[0] === "btn") {
									let _count = parseInt(counts[i].split(":")[1], 10)
									_maxInvokeCount.btn = _count
									console.log("today max invoke count of btn:", _count)
								}
								else if (counts[i].split(":")[0] === "exit") {
									let _count = parseInt(counts[i].split(":")[1], 10)
									_maxInvokeCount.exit = _count
									console.log("today max invoke count of exit:", _count)
								}
							}
						}
						else {
							_maxInvokeCount.click = _maxInvokeCount.move = _maxInvokeCount.btn = _maxInvokeCount.exit = parseInt(count, 10)
							console.log("today max invoke count:", parseInt(count, 10))
						}
						resolve(count)
					});
				})

				let p6 = new Promise(function (resolve, reject) {
					G_Switch.getInvokeMistakeRate(function( rate ) {
						console.log("invoke rate:", rate)
						_invokeRate = rate
						resolve(rate)
					});
				})

				let p7 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("click", function( inverval ) {
						console.log("click invoke inverval:", inverval)
						_invokeInterval_click = inverval
						resolve(inverval)
					});
				})

				let p8 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("move", function( inverval ) {
						console.log("move invoke inverval:", inverval)
						_invokeInterval_move = inverval
						resolve(inverval)
					});
				})

				let p9 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("btn", function( inverval ) {
						console.log("btn invoke inverval:", inverval)
						_invokeInterval_btn = inverval
						resolve(inverval)
					});
				})

				let p10 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("btn", function( inverval ) {
						console.log("exit invoke inverval:", inverval)
						_invokeInterval_exit = inverval
						resolve(inverval)
					});
				})

				Promise.all([p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]).then(function() {
					console.log("init mistake mgr succ...")
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
				if (type === "click") {
					return _todayInvokedCount_click < _maxInvokeCount.click
				}
				else if (type === "move") {
					return _todayInvokedCount_move < _maxInvokeCount.move
				}
				else if (type === "btn") {
					return _todayCheckedCount_btn < _maxInvokeCount.btn
				}
				else if (type === "exit") {
					return _todayInvokedCount_exit < _maxInvokeCount.exit
				}

				return false
			},

			_checkInvokeRate: function () {
				return G_Utils.random(1, 100) <= _invokeRate
			},

			_checkClickInvokeInterval: function () {
				if (_invokeInterval_click === 0) {
					return true
				}
				else {
					return (_todayCheckedCount_click % (_invokeInterval_click + 1) === 1)
				}
			},

			_checkMoveInvokeInterval: function () {
				if (_invokeInterval_move === 0) {
					return true
				}
				else {
					return (_todayCheckedCount_move % (_invokeInterval_move + 1) === 1)
				}
			},

			_checkBtnInvokeInterval: function () {
				if (_invokeInterval_btn === 0) {
					return true
				}
				else {
					return (_todayCheckedCount_btn % (_invokeInterval_btn + 1) === 1)
				}
			},

			_checkExitInvokeInterval: function () {
				if (_invokeInterval_exit === 0) {
					return true
				}
				else {
					return (_todayCheckedCount_exit % (_invokeInterval_exit + 1) === 1)
				}
			},

			isClickMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				let isEnabled = this.isClickMistakeEnabledAsync()

				// cb
				cb(isEnabled)
			},

			isClickMistakeEnabledAsync: function () {
				if (!_isEnabled) {
					return false
				}

				if (!_isClickEnabled) {
					return false
				}

				// add checked count
				_todayCheckedCount_click += 1

				let isEnabled = this._checkMaxkInvokeCount("click") && this._checkInvokeRate() && this._checkClickInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_click += 1
				}
				
				// save
				_save()

				// cb
				return isEnabled
			},

			isMoveMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				let isEnabled = this.isMoveMistakeEnabledAsync()

				// cb
				cb(isEnabled)
			},

			isMoveMistakeEnabledAsync: function () {
				if (!_isEnabled) {
					return false
				}

				if (!_isMoveEnabled) {
					return false
				}

				// add checked count
				_todayCheckedCount_move += 1

				let isEnabled = this._checkMaxkInvokeCount("move") && this._checkInvokeRate() && this._checkMoveInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_move += 1
				}
				
				// save
				_save()

				// cb
				return isEnabled
			},

			isBtnMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				let isEnabled = this.isBtnMistakeEnabledAsync()

				// cb
				cb(isEnabled)
			},

			isBtnMistakeEnabledAsync: function () {
				if (!_isEnabled) {
					return false
				}

				if (!_isBtnEnabled) {
					return false
				}

				// add checked count
				_todayCheckedCount_btn += 1

				let isEnabled = this._checkMaxkInvokeCount("btn") && this._checkInvokeRate() && this._checkBtnInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_btn += 1
				}
				
				// save
				_save()

				// cb
				return isEnabled
			},

			isExitMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				let isEnabled = this.isExitMistakeEnabledAsync()

				// cb
				cb(isEnabled)
			},

			isExitMistakeEnabledAsync: function () {
				if (!_isEnabled) {
					return false
				}

				if (!_isExitEnabled) {
					return false
				}

				// add checked count
				_todayCheckedCount_exit += 1

				let isEnabled = this._checkMaxkInvokeCount("exit") && this._checkInvokeRate() && this._checkExitInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_exit += 1
				}
				
				// save
				_save()

				// cb
				return isEnabled
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