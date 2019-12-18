/*
* 全局上报
* 支持多种后台同时上报
*/

import { qy } from "../../external/qy/qy";
import { ald } from "../../external/ald/ald-game";
import { ald_qq } from "../../external/ald/ald-qq-game";

var _Reportor = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_Reportor Instance...')

		var _eventNames = {}
		var _reportors = []

		return {
			// eventNames 为字符串数组
			registerAllEvents: function ( eventNames ) {
				// body...
				if (eventNames && G_Utils.isObject(eventNames)) {
					_eventNames = eventNames
				}
			},

			init: function (open_id) {
				var self = this

				G_SDKCfg.isAldReportEnabled(function ( isEnabled ) {
					console.log("G_SDKCfg.isAldReportEnabled: ", isEnabled)
		
					if (isEnabled) {
						// enable ald report
						self.enable("ald")

						// report to open_id to ald
						if (window.wx && window.wx.aldSendOpenid === "function") {
							// load ald sdk succ
							window.wx.aldSendOpenid(open_id)
						}
					}
				})
		
				G_SDKCfg.isQyReportEnabled(function ( isEnabled ) {
					console.log("G_SDKCfg.isQyReportEnabled: ", isEnabled)
		
					if (isEnabled) {
						// enable qy report
						self.enable("qy")
					}
				})
			},

			// 启用对应的上报
			enable: function ( type ) {
				// body...
				if (type === "ald") {
					if (window.wx) {
						if (!window.wx.aldSendEvent) {
							// load ald sdk
						if (G_WXHelper.isQQPlatform()) {
								ald_qq.init()
							}
							else {
								ald.init()
							}
						}

						if (window.wx.aldSendEvent) {
							// load ald sdk succ
							_reportors.push({
								type: type,
								sender: window.wx.aldSendEvent
							})
						}
					}
				}
				else if (type === "qy") {
					if (window.wx) {
						if (!window.wx.h_SendEvent) {
							// load qy sdk
							qy.init()
						}

						if (window.wx.h_SendEvent) {
							// load qy sdk succ
							_reportors.push({
								type: type,
								sender: window.wx.h_SendEvent
							})
						}
					}
				}
			},

			// 上报
			// jsonObj 参数格式必须为{'参数key' : '参数value'}
			report: function (eventName, jsonObj) {
				// body...
				if (!this._checkEventName(eventName)) {
					return
				}

				if (jsonObj && !(jsonObj instanceof Object)) {
					console.error("A Valid Param Must Be A Type Of Json Object.")
					return
				}

				if (!jsonObj) {
					jsonObj = undefined
				}

				this._doReport(eventName, jsonObj)
			},

			_doReport (eventName, jsonObj) {
				// body...
				for (let i = 0; i < _reportors.length; i++) {
					let reportor = _reportors[i]

					if (typeof reportor.sender === "function") {
						reportor.sender(eventName, jsonObj)
					}
				}

				console.log("Report Event {0} Succ!".format(eventName))
			},

			_checkEventName: function (eventName) {
				// body...
                for (let key in _eventNames) {
					if (typeof _eventNames[key] === "string" && _eventNames[key] === eventName) {
						return true
					}
					else if(typeof _eventNames[key] === "object") {
						if (eventName.indexOf(_eventNames[key].base) === 0) {
							return true
						}
					}
				}

				if (eventName) {
					console.error("Do Not Support Event Which Is Not Defined In Register EventNames, Event Name: {0}.".format(eventName))
				}
				else {
					console.error("Do Not Support Event Which Is Not Defined In Register EventNames, Event Name: undefined.")
				}
				
				return false
			}
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
})();

// export
export {_Reportor}