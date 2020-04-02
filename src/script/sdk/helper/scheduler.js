/*
* 定时器
*
*/
var _Scheduler = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Scheduler Instance...")

		var _scheduledInfos = {}

		return {
			/**
			 * 创建定时器
			 * @param {String} key 标识符(全局唯一)
			 * @param {Function} cb 回调
			 * @param {Boolean} useFrame 是否帧循环
			 * @param {Number} interval useFrame为true时，单位为帧，默认为0; useFrame为false时，单位为毫秒，默认为0
			 * @param {Number} repeat 重复次数（默认G_Const.C_SCHEDULE_REPEAT_FOREVER), 传0和1都是回调一次，但0次无法取消
			 * @returns {Boolean} 成功或失败
			 */
			schedule: function ( key, cb, useFrame, interval, repeat ) {
				// body...
				if (!this._checkKey(key) || !this._checkCallback(cb)) {
					return false
				}

				if (_scheduledInfos[key]) {
					return false
				}

				// default
				if (typeof interval === "undefined" || interval === null) {
					if (useFrame) {
						interval = 1
					}
					else {
						interval = 0
					}
				}

				if (typeof repeat === "undefined" || repeat === null) {
					repeat = G_Const.C_SCHEDULE_REPEAT_FOREVER
				}

				let scheduleCb = repeat === 0 ? cb : function ( dt ) {
					// body...
					let _info = _scheduledInfos[key]
					if (_info) {
						_info.invokeTimes += 1

						if (_info.invokeTimes >= repeat) {
							// temp save
							let _cb = _info.cb

							// unschedule
							this.unschedule(key)

							// callback
							_cb()
						}
						else {
							// callback
							_info.cb(dt)
						}
					}
				}.bind(this)

				if (repeat === 0) {
					if (useFrame) {
						Laya.timer.frameOnce(interval, this, scheduleCb)
					}
					else {
						Laya.timer.once(interval, this, scheduleCb)
					}
				}
				else {
					_scheduledInfos[key] = {
						invokeTimes: 0,
						cb: cb,
						scheduleCb: scheduleCb
					}

					if (useFrame) {
						Laya.timer.frameLoop(interval, this, scheduleCb)
					}
					else {
						Laya.timer.loop(interval, this, scheduleCb)
					}
				}

				return true
			},

			/**
			 * 取消定时器
			 * @param {String} key 标识符(全局唯一)
			 * @returns {Boolean} 成功或失败
			 */
			unschedule: function (key) {
				// body...
				if (!this._checkKey(key)) {
					return false
				}

				if (!_scheduledInfos[key]) {
					return false
				}

				Laya.timer.clear(this, _scheduledInfos[key].scheduleCb)

				// reset
				delete _scheduledInfos[key]

				return true
			},

			/**
			 * 是否存在此定时器
			 * @param {String} key 标识符(全局唯一)
			 * @returns {Boolean} 存在与否
			 */
			isScheduled: function (key) {
				// body...
				if (!this._checkKey(key)) {
					return false
				}

				if (!_scheduledInfos[key]) {
					return false
				}

				return true
			},

			/**
			 * 取消所有定时器
			 */
			unscheduleAll: function () {
				// body...
				for( let key in _scheduledInfos ) {
					Laya.timer.clear(this, _scheduledInfos[key].cb)
				}

				_scheduledInfos = {}
			},

			_checkKey: function ( key ) {
				// body...
				if ((typeof key === "string") && key !== "") {
					return true
				}
		
				return false
			},
		
			_checkCallback: function ( cb ) {
				// body...
				if (typeof cb === "function") {
					return true
				}
		
				return false
			}
		}
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
}();

// export
export {_Scheduler}