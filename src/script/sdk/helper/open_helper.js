/*
* 开放域帮助
*/
var _OpenHelper = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_OpenHelper Instance...')

		var _isSupport = false

		return {
			init: function () {
				// body...
				if (G_PlatHelper.isQQPlatform()) {
					_isSupport = true
				}
				else if (G_PlatHelper.isWXPlatform()) {
					if (G_PlatHelper.getSDKVersion() >= '1.9.92') {
						_isSupport = true
					}
					else {
						_isSupport = false

						// notify
						G_Event.dispatchEvent(G_EventName.EN_SDK_NOT_SUPPORT, G_PlatHelper.getSDKVersion())
					}
				}
			},

			isSupport: function () {
				// body...
				return _isSupport
			},

			saveSelfInfo: function ( info, cb ) {
				// body...
				if (!_isSupport) {
					return
				}

				if (Object.keys(info).length === 0) {
					return
				}

				if (window.wx && window.wx.setUserCloudStorage) {
					let dataList = []

					for (let key in info) {
						dataList.push({
							key: key,
							value: info[key].toString()
						})
					}

					var self = this
					wx.setUserCloudStorage({
    					KVDataList: dataList,
    					success: function () {
    						// body...
    						if (typeof cb === "function") {
    							cb()
    						}
    					}
    				})
				}
			},

			clearSelfInfo: function ( keys, cb ) {
				// body...
				if (!_isSupport) {
					return
				}

				if (window.wx && window.wx.removeUserCloudStorage) {
					wx.removeUserCloudStorage({
    					KVDataList: keys,
    					success: function () {
    						// body...
    						if (typeof cb === "function") {
    							cb()
    						}
    					}
    				})
				}
			},

			preload: function ( params ) {
				// body...
				if (!_isSupport) {
					return
				}

				this._doOperation(G_OpenDataOperation.ODO_PRELOAD, params)
			},

			showRank: function ( params ) {
				// body...
				if (!_isSupport) {
					return
				}

				this._doOperation(G_OpenDataOperation.ODO_SHOW_RANK, params)
			},

			_doOperation: function ( operation, params ) {
				// body...
				if (window.wx && window.wx.getOpenDataContext) {
					let openDataContext = window.wx.getOpenDataContext()

					let message = {
						operation: operation
					}

					if (typeof params !== "undefined" && params !== null) {
						message.params = JSON.stringify(params)
					}

					console.log("post message!!!")
					console.log(message)

					// post
					openDataContext.postMessage(message)
				}
			}
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();

				// init...
				_instance.init()
			}

			return _instance;
		}
	};
})();

// export
export {_OpenHelper}