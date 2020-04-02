var SK_KEY_OF_MISTAKE_INFO = "storage_key_of_mistake_info"

/*
* 误触管理
*/
var _MistakeMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_MistakeMgr Instance...")

		// 今日误触已检查次数
		var _todayCheckedCount_click = 0
		// 今日误触已触发次数
		var _todayInvokedCount_click = 0
		// 今日误触已检查次数
		var _todayCheckedCount_move = 0
		// 今日误触已触发次数
		var _todayInvokedCount_move = 0

		// 以下为开关配置，初始化读取
		// 是否在屏蔽区域
		var _isEnabled = false
		// 狂点误触是否开启
		var _isClickEnabled = false
		// 位移误触是否开启
		var _isMoveEnabled = false
		// 误触最大触发次数
		var _maxInvokeCount = 0
		// 误触触发概率
		var _invokeRate = 0
		// 误触触发间隔 --- 狂点
		var _invokeInterval_click = 0
		// 误触触发间隔 --- 位移
		var _invokeInterval_move = 0

		var _load = function () {
			let save_json_str = G_PlatHelper.getStorage(SK_KEY_OF_MISTAKE_INFO)

			let isRefreshed = false
			if (save_json_str && save_json_str !== "") {
				let save_json = JSON.parse(save_json_str)

				if (typeof save_json["saveDay"] !== "undefined" 
					&& typeof save_json["checkedCount_click"] !== "undefined" 
					&& typeof save_json["invokedCount_click"] !== "undefined"
					&& typeof save_json["checkedCount_move"] !== "undefined"
					&& typeof save_json["invokedCount_move"] !== "undefined") {
					if (save_json["saveDay"] === G_ServerInfo.getCurServerDayOfYear()) {
						_todayCheckedCount_click = save_json["checkedCount_click"]
						_todayInvokedCount_click = save_json["invokedCount_click"]
						_todayCheckedCount_move = save_json["checkedCount_move"]
						_todayInvokedCount_move = save_json["invokedCount_move"]
						isRefreshed = true
					}
				}
			}

			if (!isRefreshed) {
				_todayCheckedCount_click = 0
				_todayInvokedCount_click = 0
				_todayCheckedCount_move = 0
				_todayInvokedCount_move = 0
			}
		}

		var _save = function () {
			let save_json = {
				saveDay: G_ServerInfo.getCurServerDayOfYear(),
				checkedCount_click: _todayCheckedCount_click,
				invokedCount_click: _todayInvokedCount_click,
				checkedCount_move: _todayCheckedCount_move,
				invokedCount_move: _todayInvokedCount_move,
			}

			console.log(save_json)

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
					G_Switch.getTodayMaxMistakeCount(function( count ) {
						console.log("today max invoke count:", count)
						_maxInvokeCount = count
						resolve(count)
					});
				})

				let p4 = new Promise(function (resolve, reject) {
					G_Switch.getInvokeMistakeRate(function( rate ) {
						console.log("invoke rate:", rate)
						_invokeRate = rate
						resolve(rate)
					});
				})

				let p5 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("click", function( inverval ) {
						console.log("click invoke inverval:", inverval)
						_invokeInterval_click = inverval
						resolve(inverval)
					});
				})

				let p6 = new Promise(function (resolve, reject) {
					G_Switch.getIntervalOfMistakes("move", function( inverval ) {
						console.log("move invoke inverval:", inverval)
						_invokeInterval_move = inverval
						resolve(inverval)
					});
				})

				Promise.all([p0, p1, p2, p3, p4, p5, p6]).then(function() {
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

			_checkMaxkInvokeCount: function () {
				return (_todayInvokedCount_click + _todayInvokedCount_move) < _maxInvokeCount
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

			isClickMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				if (!_isEnabled) {
					cb(false)
					return
				}

				if (!_isClickEnabled) {
					cb(false)
					return
				}

				// add checked count
				_todayCheckedCount_click += 1

				let isEnabled = this._checkMaxkInvokeCount() && this._checkInvokeRate() && this._checkClickInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_click += 1
				}
				
				// save
				_save()

				// cb
				cb(isEnabled)
			},

			isMoveMistakeEnabled: function ( cb ) {
				if (typeof cb !== "function") {
					return
				}

				if (!_isEnabled) {
					cb(false)
					return
				}

				if (!_isMoveEnabled) {
					cb(false)
					return
				}

				// add checked count
				_todayCheckedCount_move += 1

				let isEnabled = this._checkMaxkInvokeCount() && this._checkInvokeRate() && this._checkMoveInvokeInterval()
				if (isEnabled) {
					// add invoked count
					_todayInvokedCount_move += 1
				}
				
				// save
				_save()

				// cb
				cb(isEnabled)
			},
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