var SK_KEY_OF_OPENID_AND_SESSID = "storage_key_of_openID_And_SessID"

/*
* 微信全局帮助
* 主要通过微信提供的接受实现一些功能
*/

var _WXHelper = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_WXHelper Instance...')

		var _sysInfo = null;
		var _recogniseSceneIDs = new Array();
		_recogniseSceneIDs.push({sceneIDs: [1007], eventName: G_EventName.EN_LAUNCH_APP_FROM_SINGLE_SHARE})
		_recogniseSceneIDs.push({sceneIDs: [1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_GROUP_SHARE})
		_recogniseSceneIDs.push({sceneIDs: [1007, 1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_SHARE})
		_recogniseSceneIDs.push({sceneIDs: [1089], eventName: G_EventName.EN_LAUNCH_APP_FROM_RECENT})
		_recogniseSceneIDs.push({sceneIDs: [1038], eventName: G_EventName.EN_LAUNCH_APP_BACK_FROM_OTHER_APP})
		_recogniseSceneIDs.push({sceneIDs: [1104], eventName: G_EventName.EN_LAUNCH_APP_FROM_FAVOURITE})

		var _isModalOnShow = false
		var _isToastOnShow = false
		var _isLoadingOnShow = false
		var _hideAppTime = 0

		var _channelID = null

		var _checkLaunchOptions =  function (sceneID, queryObj) {
			// body...
			var bHandle = false

			for (var index = 0; index < _recogniseSceneIDs.length; ++index) 
			{
				var data = _recogniseSceneIDs[index];

				for (var _index = 0; _index < data.sceneIDs.length; ++_index) 
				{
					if (sceneID === data.sceneIDs[_index]) {
						// handle
						bHandle = true;
						G_Event.dispatchEvent(data.eventName, queryObj);

						break;
					}
				}
			}

			// everywhere
			G_Event.dispatchEvent(G_EventName.EN_LAUNCH_APP_FROM_EVERYWHERE, sceneID, queryObj);

			if (!bHandle) {
				// unhandle
				G_Event.dispatchEvent(G_EventName.EN_LAUNCH_APP_FROM_UNKNOW, sceneID, queryObj);
			}
		};

		var _init = function () {
			// body...
			if (window.wx) {
				let launchInfo = window.wx.getLaunchOptionsSync()

				_checkLaunchOptions(launchInfo.scene, launchInfo.query)

				window.wx.onShow(function (info) {
					// notify
					G_ServerInfo.reload(function () {
						// body...
						if (_hideAppTime !== 0) {
							G_Event.dispatchEvent(G_EventName.EN_APP_AFTER_ONSHOW, G_ServerInfo.getServerTime() - _hideAppTime)
							_hideAppTime = 0
						}
						else {
							G_Event.dispatchEvent(G_EventName.EN_APP_AFTER_ONSHOW)
						}

			        	_checkLaunchOptions(info.scene, info.query)
					})
				})

				window.wx.onHide(function (info) {
					// notify
					_hideAppTime = G_ServerInfo.getServerTime()
			        G_Event.dispatchEvent(G_EventName.EN_APP_BEFORE_ONHIDE)
				})

				if (window.wx.onMemoryWarning) {
					wx.onMemoryWarning(function () {
						console.warn('On Memory Warning Received...')

						// report
						G_Reportor.report(G_ReportEventName.REN_RECEIVED_MEMORY_WARNING)
					})
				}
			}
		};

		var _checkAndCallback = function (_cb, _param) {
			// body...
			if (typeof _cb === "function") {
				_cb(_param)
			}
		};

		return {
			init: function () {
				// body...
				_init();
			},
			
			restartApp: function () {
				// body...
				this.exitApp()
			},

			exitApp: function () {
				// body...
				if (window.wx) {
					window.wx.exitMiniProgram({
						fail: function () {
							// notify
			                G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
						}
					})
				}
			},

			getLaunchOptions: function () {
				// body...
				if (window.wx) {
					return window.wx.getLaunchOptionsSync()
				}
				else {
					return null
				}
			},

			getChannelID: function () {
				if (_channelID === null) {
					if (window.wx) {
						let launchInfo = window.wx.getLaunchOptionsSync()
						_channelID = ""
	
						for (let key in (launchInfo.query || {})) {
							if (key === "chid") {
								_channelID = launchInfo.query[key].toString()
								break
							}
						}
					}
					else {
						_channelID = ""
					}
				}

				return _channelID
			},

			vibratePhone: function ( bLong ) {
				// body...
				if (window.wx) {
					if (bLong) {
						if (window.wx.vibrateLong) {
							window.wx.vibrateLong()
						}
					}
					else {
						if (window.wx.vibrateShort) {
							window.wx.vibrateShort()
						}
					}
				}
			},

			getSysInfo: function () {
				// body...
				if (_sysInfo === null) {
					if (window.wx) {
						try {
							_sysInfo = G_Utils.deepClone(window.wx.getSystemInfoSync())

							return _sysInfo
						}
						catch (e) {
							// notify
			                G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)

			                return null
						}
					}
					else {
						// 模拟windows环境
						_sysInfo = {
							screenHeight: Math.round(Laya.stage.height),
							screenWidth: Math.round(Laya.stage.width),
							windowHeight: Math.round(Laya.stage.height),
							windowWidth: Math.round(Laya.stage.width),
							statusBarHeight: 0
						}

						if (Laya.Browser.onPC) {
							// Window
							_sysInfo.brand = "microsoft"
							_sysInfo.platform = "window"
							_sysInfo.system = "Window 7"
						}
						else if (Laya.Browser.onIOS) {
							// IOS
							_sysInfo.brand = "apple"
							_sysInfo.platform = "ios"
							_sysInfo.system = "iOS 12.1"
						}
						else if (Laya.Browser.onAndroid) {
							// IOS
							_sysInfo.brand = "samsung"
							_sysInfo.platform = "and"
							_sysInfo.system = "Android 6.0"
						}
						else {
							// Unknow
							_sysInfo.brand = "microsoft"
							_sysInfo.platform = "window"
							_sysInfo.system = "Window 7"
						}

						return _sysInfo
					}
				}
				else {
					return _sysInfo
				}
			},

			getSystemPlatform: function () {
				// body...
				let sysInfo = this.getSysInfo()

				if (sysInfo) {
					if (sysInfo.platform.toLowerCase().indexOf("window") !== -1
						|| sysInfo.platform.toLowerCase().indexOf("devtools") !== -1) {
						return G_Const.C_WINDOW_PLATFORM
					}
					else if (sysInfo.platform.toLowerCase().indexOf("ios") !== -1) {
						return G_Const.C_IOS_PLATFORM
					}
					else if (sysInfo.platform.toLowerCase().indexOf("and") !== -1) {
						return G_Const.C_ANDROID_PLATFORM
					}
					else {
						return G_Const.C_UNKNOW_PLATFORM
					}
				}
				else {
					return G_Const.C_UNKNOW_PLATFORM
				}
			},

			getSDKVersion: function () {
				// body...
				let sysInfo = this.getSysInfo()

				if (sysInfo) {
					return sysInfo.SDKVersion
				}
				else {
					return '0.0.0'
				}
			},

			isQQPlatform: function () {
				// body...
				if (typeof window.qq !== "undefined") {
					return true
				}
				else {
					return false
				}
			},

			isOPPOPlatform: function () {
				// body...
				if (typeof window.qg !== "undefined") {
					return true
				}
				else {
					return false
				}
			},

			isWin: function () {
				// body...
				return (this.getSystemPlatform() === G_Const.C_WINDOW_PLATFORM)
			},

			isIOS: function () {
				// body...
				return (this.getSystemPlatform() === G_Const.C_IOS_PLATFORM)
			},

			isAnd: function () {
				// body...
				return (this.getSystemPlatform() === G_Const.C_ANDROID_PLATFORM)
			},

			// 显示模态对话框
			// cb(true) 点击确认
			// cb(false) 点击取消
			// custom 定制(支持cancelText, cancelColor, confirmText, confirmColor)
			showModal: function (title, content, showCancel, cb, custom) {
				// body...
				if (_isModalOnShow) {
					return
				}

				if (window.wx && this._checkString(content)) {
					let obj = {
						content: content,
						showCancel: showCancel,
						success (res) {
							_isModalOnShow = false

							if (typeof cb === "function") {
								if (res.confirm) {
	      							cb(true)
	    						} else if (res.cancel) {
	      							cb(false)
	    						}
							}
  						}
					}

					if (custom) {
						if (this._checkString(title)) { obj.title = title; }
						if (custom.cancelText) { obj.cancelText = custom.cancelText; }
						if (custom.cancelColor) { obj.cancelColor = custom.cancelColor; }
						if (custom.confirmText) { obj.confirmText = custom.confirmText; }
						if (custom.confirmColor) { obj.confirmColor = custom.confirmColor; }
					}

					_isModalOnShow = true
					window.wx.showModal(obj)
				}
			},

			// 显示消息提示框
			// icon: 只支持success, loading, none三种模式，默认为none
			showToast: function (title, icon) {
				// body...
				this._clearToastAndLoading()

				if (window.wx && this._checkString(title)) {
					let obj = {
						title: title,
						duration: 2000,
						success: function (res) {
							// body...
							_isToastOnShow = true

							G_Scheduler.schedule("Auto_Reset_Toast_State", function () {
					            // body...
					            _isToastOnShow = false
					        }, false, 2000, 0)
						}
					}

					if (icon) {
						obj.icon = icon
					}
					else {
						obj.icon = "none"
					}

					window.wx.showToast(obj)
				}
				else if (!window.wx) {
					console.log("show toast: " + title)
				}
			},

			// 隐藏消息提示框
			hideToast: function () {
				// body...
				if (_isToastOnShow) {
					_isToastOnShow = false

					if (window.wx) {
						window.wx.hideToast()
					}
				}
			},

			// 显示随机消息提示框
			// 从Tips随机选择一个
			showRandomToast: function (tips) {
				// body...
				if (tips) {
					let random_index = G_Utils.random(0, tips.length - 1)

					this.showToast(tips[random_index])
				}
			},

			// 显示loading提示框
			// title 标题（默认加载中）
			showLoading: function (title) {
				// body...
				this._clearToastAndLoading()

				if (window.wx) {
					if (window.wx.showLoading) {
						let obj = {
							title: (title || G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_UPDATE_TITLE"]).word),
							mask: true
						}

						_isLoadingOnShow = true
						window.wx.showLoading(obj)
					}
					else {
						// notify
						G_Event.dispatchEvent(G_EventName.EN_SDK_NOT_SUPPORT)
					}
				}
				else {
					console.log("show loading: " + title)
				}
			},

			// 隐藏loading提示框
			hideLoading: function () {
				// body...
				if (_isLoadingOnShow) {
					_isLoadingOnShow = false

					if (window.wx) {
						if (window.wx.hideLoading) {
							window.wx.hideLoading()
						}
						else {
							// notify
							G_Event.dispatchEvent(G_EventName.EN_SDK_NOT_SUPPORT)
						}
					}
				}
			},

			_clearToastAndLoading: function () {
				// body...
				this.hideToast()
				this.hideLoading()
			},

			isIPhoneX() {
				let sysInfo = this.getSysInfo()

				if (sysInfo) {
					if (sysInfo.model && sysInfo.model.indexOf("iPhone X") !== -1) {
						return true
					}

					if (sysInfo.SDKVersion >= "1.1.0") {
						if (sysInfo.screenHeight / sysInfo.screenWidth > 2) {
							return true
						}
					}
				}
				
				return false
            },

			openCustomerService: function ( showCard, cb ) {
				// body...
				if (window.wx) {
					if (window.wx.openCustomerServiceConversation) {
						let obj = {
							sessionFrom: "",
							showMessageCard: false,
							success: function () {
								// body...
								if (typeof cb === "function") {
									cb(true)
								}
							},
							fail: function () {
								// body...
								if (typeof cb === "function") {
									cb(false)
								}
							}
						}

						if (showCard) {
							let shareInfo = G_Share.getShareInfo(G_ShareScene.SS_CUSTOMER_SERVER)

							if (shareInfo) {
								let shareCfg = G_Share.getDoShareCfg(shareInfo)

								if (shareCfg) {
									obj.showMessageCard = true
									obj.sendMessageTitle = shareCfg.title
									obj.sendMessagePath = shareInfo.path
									obj.sendMessageImg = shareCfg.img_url
								}
							}
						}

						window.wx.openCustomerServiceConversation(obj)
					}
					else {
						// notify
						G_Event.dispatchEvent(G_EventName.EN_SDK_NOT_SUPPORT)
					}
				}
				else {
					if (typeof cb === "function") {
						cb(false)
					}
				}
			},

			/**
			 * 存储本地数据
			 * @param {String} key 键名(全局唯一)，不能为空
			 * @param {Any} data 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象
			 */
			setStorage: function (key, data) {
				if (!this._checkString(key)) {
					console.error("WXHelper.setStorage Fail, Check Input...")
					return
				}

				if (window.wx) {
					try {
						wx.setStorageSync(key, data)
					} catch (e) {
						console.error("WXHelper.setStorage Fail, No Support This Kind Of Data: ", data)
					}
				}
				else {
					Laya.LocalStorage.setItem(key, data)
				}
			},

			/**
			 * 获取本地数据
			 * @param {String} key 键名(全局唯一)，不能为空
			 */
			getStorage: function (key, def) {
				if (!this._checkString(key)) {
					console.error("WXHelper.getStorage Fail, Check Input...")
					return
				}

				if (window.wx) {
					try {
						return wx.getStorageSync(key)
					} catch (e) {
						return (typeof def !== "undefined")? def: null
					}
				}
				else {
					return Laya.LocalStorage.getItem(key)
				}
			},

			/**
			 * 清除本地数据
			 * @param {String} key 键名(全局唯一)，不能为空
			 */
			clearStorage: function ( key ) {
				if (!this._checkString(key)) {
					console.error("WXHelper.clearStorage Fail, Check Input...")
					return
				}

				if (window.wx) {
					try {
						wx.removeStorageSync(key)
					} catch (e) {}
				}
				else {
					Laya.LocalStorage.removeItem(key)
				}
			},

			autoLogin: function ( cb ) {
				// body...
				let doCb = function ( playerInfo ) {
					// body...
					if (typeof cb === "function") {
						cb(playerInfo)
					}
				}

				if (window.wx) {
					let openID_And_SessID = this.getStorage(SK_KEY_OF_OPENID_AND_SESSID)

					if (openID_And_SessID && openID_And_SessID !== "") {
						let arr = openID_And_SessID.split('&&')

						if (arr.length == 2) {
							console.log("Checked Local OpenID And PHP SessID Is Still In Storage...")

							let clearStorageAndCb = function () {
								// body...
								this.clearStorage(SK_KEY_OF_OPENID_AND_SESSID)

								// cb
								doCb(null)
							}.bind(this)

							window.wx.checkSession({
								success: function () {
									// body...
									console.log("Remote SessionKey Is Still Vailid...")

									let openID = arr[0]
									let sessID = arr[1]

									// check login
									G_NetHelper.reqCheckLogin(sessID, function (jsonData) {
										// body...
										if (jsonData && jsonData.code === 0) {
											// Succ
											console.log("Remote Login Status Is Still Vailid...")
											console.log("current openID: {0}".format(openID))
											console.log("current sessID: {0}".format(sessID))

											// Load Player Info
											G_PlayerInfo.load(openID, sessID, function ( playerInfo ) {
												// body...`
												doCb(playerInfo)
											})
										}
										else {
											clearStorageAndCb()
										}
									})
								},
								fail: function () {
									// body...
									clearStorageAndCb()
								}
							})
						}
						else {
							doCb(null)
						}
					}
					else {
						doCb(null)
					}
				}
				else {
					doCb(null)
				}
			},

			// baseUserInfo 包含玩家的基础信息，如头像，性别，昵称
			login: function ( baseUserInfo, cb ) {
				// body...
				this._login(function (openID, sessID) {
					// openID和sessID返回必定不为null
					console.log("current openID: {0}".format(openID))
					console.log("current sessID: {0}".format(sessID))

					if (openID && sessID) {
						G_PlayerInfo.load(openID, sessID, function ( playerInfo ) {
							// body...`
							if (baseUserInfo) {
								playerInfo.nickname = baseUserInfo.nickname || ""
								playerInfo.sex = baseUserInfo.sex || 1
								playerInfo.headUrl = baseUserInfo.headUrl || ""

								// upload baseInfo to server
								console.log("upload baseInfo to server...")
								G_PlayerInfo.save()
							}

							if (typeof cb === "function") {
								cb(playerInfo)
							}
						})
					}
				})
			},

			_login: function ( cb ) {
				// body...
				if (window.wx) {
					this.__login(cb)
				}
				else {
					if (G_IsAlwaysNewPlayer) {
						this.clearStorage(SK_KEY_OF_OPENID_AND_SESSID)
					}

					let openID_And_SessID = this.getStorage(SK_KEY_OF_OPENID_AND_SESSID)

					if (openID_And_SessID && openID_And_SessID !== "") {
						let arr = openID_And_SessID.split('&&')

						if (arr.length == 2) {
							console.log("Checked Local OpenID And PHP SessID Is Still In Storage...")

							let openID = arr[0]
							let sessID = arr[1]

							if (typeof cb === "function") {
								cb(openID, sessID)
							}

							return
						}
					}

					if (typeof cb === "function") {
						let openID = G_OpenID

						if (!openID || openID === "") {
							openID = this._generateOpenID()
						}

						let sessID = G_SessID

						if (!sessID || sessID === "") {
							sessID = this._generateSessID()
						}

						// save
						this.setStorage(SK_KEY_OF_OPENID_AND_SESSID, openID + '&&' + sessID)

						cb(openID, sessID)
					}
				}
			},

			__login: function ( cb ) {
				// body...
				if (window.wx) {
					var self = this

					window.wx.login({
						timeout: G_Const.C_TIMEOUT_OF_LOGIN,
						success: function (res) {
							// body...
							G_NetHelper.reqLogin(res.code, function ( jsonData ) {
								// body...
								console.log(jsonData)

								if (jsonData && jsonData.code === 0) {
									let openID = jsonData.data.openId
									let sessID = jsonData.data.javaSessionID

									// save
									self.setStorage(SK_KEY_OF_OPENID_AND_SESSID, openID + '&&' + sessID)

									if (typeof cb === "function") {
										cb(openID, sessID)
									}
								}
								else {
									// notify
									G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
								}
							})
						},
						fail: function () {
							// notify
							G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
						}
					})
				}
			},

			_generateOpenID: function () {
				// body...
				return G_Utils.generateString(32)
			},

			_generateSessID: function () {
				// body...
				return G_Utils.generateString(26)
			},

			_checkString: function (title) {
				// body...
				if (typeof title === "string" && title !== "") {
					return true
				}
				else {
					return false
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
export {_WXHelper}
