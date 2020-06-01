var TAG_OF_SCHEDULE_SERVER_TIME = "Server_Time_Tick"

/*
* 服务器信息
*/
var _ServerInfo = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_ServerInfo Instance...")

		var _loaded = false
		var _serverTime = 0
		var _startedAppTime = 0
		var _startedServerTime = 0
		var _passedDays = 0

		return {
			// 登陆前自动调用
			load: function ( cb ) {
				// body...
				_loaded = false

				if (G_PlatHelper.canLoginOnline() && G_NetHelper) {
					G_NetHelper.reqGetServerTime(function ( jsonData ) {
						// body...
						if (jsonData && jsonData.code === 0) {
							_loaded = true
	
							this._registerServerTime(parseInt(jsonData.time, 10))
	
							if (typeof cb === "function") {
								cb()
							}
						}
						else {
							// notify
							G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
						}
					}.bind(this))
				}
				else {
					this._registerServerTime(Math.round(new Date() / 1000))

					if (typeof cb === "function") {
						cb()
					}
				}
			},

			// 此方法只能用作测试
			passedOneDay: function () {
				_passedDays += 1

				console.log("have passed {0} days".format(_passedDays.toString()))
			},

			// 每次从后台重新切入游戏主动调用
			// 只有服务器正常才会回调
			reload: function ( cb ) {
				// body...
				this._unregisterServerTime()

				// reload
				this.load(function () {
					// body...
					if (typeof cb === "function") {
						cb()
					}
				})
			},

			// 注册的时间来自于登录从服务端获取
			// serverTime 为时间戳，单位精确到秒
			_registerServerTime: function ( serverTime ) {
				// body...
				console.log("server time: ", serverTime)

				_startedAppTime = Date.now()
				_serverTime = serverTime * 1000
				_startedServerTime = _serverTime

				// schedule forever
				G_Scheduler.schedule(TAG_OF_SCHEDULE_SERVER_TIME, function () {
		            // body...
		            if (_loaded) {
						_serverTime = _startedServerTime + Date.now() - _startedAppTime
					}
		        }, true)
			},

			_unregisterServerTime: function () {
				// body...
				if (_loaded) {
					_loaded = false
					_serverTime = 0
					_startedAppTime = 0
					_startedServerTime = 0

					// unschedule server tick
					G_Scheduler.unschedule(TAG_OF_SCHEDULE_SERVER_TIME)
				}
			},

			getServerTime: function () {
				// body...
				if (!_loaded) {
					return Date.now()
				}
				else {
					return _serverTime
				}
			},

			getServerDate: function () {
				// body...
				if (!_loaded) {
					return new Date()
				}
				else {
					return new Date(_serverTime)
				}
			},

			getCurServerDayOfWeek: function () {
				// body...
				let day = this.getServerDate().getDay()

				if (day === 0) {
					// set sunday to 7
					day = 7
				}

				return day
			},

			getCurServerDayOfMonth: function () {
				return this.getServerDate().getDate()
			},

			getCurServerDayOfYear: function () {
				// body...
				let now = this.getServerDate()
				let start = new Date(now.getFullYear(), 0, 0)
				let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
				let oneDay = 1000 * 60 * 60 * 24
				let dayNo = Math.floor(diff / oneDay)

				return dayNo + _passedDays
			},

			getCurServerWeekOfYear: function () {
				// body...
				var instance = this.getServerDate()

				// Create a copy of this date object
				var target = new Date(instance.valueOf())

				// ISO week date weeks start on monday
				// so correct the day number
				var dayNr = (instance.getDay() + 6) % 7

				// ISO 8601 states that week 1 is the week
				// with the first thursday of that year.
				// Set the target date to the thursday in the target week
				target.setDate(target.getDate() - dayNr + 3)

				// Store the millisecond value of the target date
				var firstThursday = target.valueOf()

				// Set the target to the first thursday of the year
				// First set the target to january first
				target.setMonth(0, 1)
				// Not a thursday? Correct the date to the next thursday
				if (target.getDay() !== 4) {
					target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
				}

				// The weeknumber is the number of weeks between the
				// first thursday of the year and the thursday in the target week
				var weekNo = 1 + Math.ceil((firstThursday - target) / 604800000);

				return weekNo;
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
window.G_ServerInfo = _ServerInfo.getInstance()