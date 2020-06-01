var SK_KEY_OF_OPENID_AND_SESSID = "storage_key_of_openID_And_SessID"

/*
* 平台全局帮助
* 主要通过各个平台提供的基础sdk接受实现常用的一些功能
*/
export default class PlatBaseHelper {
	constructor() {
		// log
		console.log('Init G_PlatHelper Instance...')

		this._plat = null
		this._platType = "None"
		this._platDesc = "未定义"
		this._sysInfo = null
		this._recogniseSceneIDs = []
		this._isModalOnShow = false
		this._isToastOnShow = false
		this._isLoadingOnShow = false
		this._hideAppTime = 0
		this._channelID = null
	}

	_checkLaunchOptions(sceneID, queryObj) {
		// body...
		let bHandle = false

		for (let index = 0; index < this._recogniseSceneIDs.length; ++index) 
		{
			let data = this._recogniseSceneIDs[index];

			for (let _index = 0; _index < data.sceneIDs.length; ++_index) 
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
	}

	/**
	 * 初始化
	 */
	init() {
		if (this._plat) {
			var self = this

			if (this._plat.getLaunchOptionsSync) {
				let launchInfo = this._plat.getLaunchOptionsSync()
				this._checkLaunchOptions(launchInfo.scene, launchInfo.query)
			}

			if (this._plat.onShow) {
				this._plat.onShow(function (info) {
					// notify
					G_ServerInfo.reload(function () {
						// body...
						if (self._hideAppTime !== 0) {
							G_Event.dispatchEvent(G_EventName.EN_APP_AFTER_ONSHOW, G_ServerInfo.getServerTime() - self._hideAppTime)
							self._hideAppTime = 0
						}
						else {
							G_Event.dispatchEvent(G_EventName.EN_APP_AFTER_ONSHOW)
						}
	
						self._checkLaunchOptions(info.scene, info.query)
					})
				})
			}

			if (this._plat.onHide) {
				this._plat.onHide(function (info) {
					// notify
					self._hideAppTime = G_ServerInfo.getServerTime()
					G_Event.dispatchEvent(G_EventName.EN_APP_BEFORE_ONHIDE)
				})
	
			}
			
			if (this._plat.onMemoryWarning) {
				this._plat.onMemoryWarning(function () {
					console.warn('On Memory Warning Received...')

					// report
					if (G_Reportor) {
						G_Reportor.report(G_ReportEventName.REN_RECEIVED_MEMORY_WARNING)
					}
				})
			}
		}
	}

	/**
	 * 获取平台sdk
	 */
	getPlat() {
		// body...
		return this._plat
	}

	/**
	 * 获取平台类型
	 */
	getPlatType() {
		// body...
		return this._platType
	}

	/**
	 * 获取平台描述
	 */
	getPlatDesc() {
		// body...
		return this._platDesc
	}

	/**
	 * 重启游戏
	 */
	restartApp() {
		// body...
		this.exitApp()
	}

	/**
	 * 退出游戏
	 */
	exitApp() {
		// body...
		if (this._plat && this._plat.exitMiniProgram) {
			this._plat.exitMiniProgram({
				fail: function () {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				}
			})
		}
	}

	/**
	 * 获取启动参数
	 */
	getLaunchOptions() {
		// body...
		if (this._plat && this._plat.getLaunchOptionsSync) {
			return this._plat.getLaunchOptionsSync()
		}
		else {
			return null
		}
	}

	/**
	 * 获取广告渠道ID
	 */
	getChannelID() {
		// body...
		if (this._channelID === null) {
			this._channelID = ""

			let launchInfo = this.getLaunchOptions()
			if (launchInfo) {
				for (let key in (launchInfo.query || {})) {
					if (key === "chid") {
						this._channelID = launchInfo.query[key].toString()
						break
					}
				}
			}
		}

		return this._channelID
	}

	/**
	 * 是否支持手机震动
	 */
	isSupportVibratePhone() {
		return true
	}

	/**
	 * 手机震动
	 * @param {Boolean} bLong 长/短
	 */
	vibratePhone( bLong ) {
		// body...
		if (!G_PlayerInfo.isMuteEnable()) {
			return
		}

		if (bLong) {
			if (this._plat && this._plat.vibrateLong) {
				this._plat.vibrateLong()
			}
		}
		else {
			if (this._plat && this._plat.vibrateShort) {
				this._plat.vibrateShort()
			}
		}
	}

	/**
	 * 生成桌面图标
	 */
	installShortcut( succCb ) {
		// body...
	}

	/**
	 * 展示更多游戏弹出窗
	 */
	showMoreGamesModal( closeCb, succCb, failCb ) {
		// body...
	}

	// 显示模态对话框
	// cb(true) 点击确认
	// cb(false) 点击取消
	// custom 定制(支持cancelText, cancelColor, confirmText, confirmColor)
	showModal(title, content, showCancel, cb, custom) {
		// body...
		if (this._isModalOnShow) {
			return
		}

		if (this._plat && this._plat.showModal && this._checkString(content)) {
			let obj = {
				content: content,
				showCancel: showCancel,
				success: function (res) {
					this._isModalOnShow = false

					if (typeof cb === "function") {
						if (res.confirm) {
							cb(true)
						} else if (res.cancel) {
							cb(false)
						}
					}
				}.bind(this)
			}

			if (custom) {
				if (this._checkString(title)) { obj.title = title; }
				if (custom.cancelText) { obj.cancelText = custom.cancelText; }
				if (custom.cancelColor) { obj.cancelColor = custom.cancelColor; }
				if (custom.confirmText) { obj.confirmText = custom.confirmText; }
				if (custom.confirmColor) { obj.confirmColor = custom.confirmColor; }
			}

			this._isModalOnShow = true
			this._plat.showModal(obj)
		}
		else {
			if (typeof cb === "function") {
				cb(false)
			}
		}
	}

	// 显示消息提示框
	// icon: 只支持success, loading, none三种模式，默认为none
	showToast(title, icon) {
		// body...
		this._clearToastAndLoading()

		if (this._plat && this._plat.showToast && this._checkString(title)) {
			let obj = {
				title: title,
				duration: 2000,
				success: function (res) {
					// body...
					this._isToastOnShow = true

					G_Scheduler.schedule("Auto_Reset_Toast_State", function () {
						// body...
						this._isToastOnShow = false
					}.bind(this), false, 2000, 0)
				}.bind(this)
			}

			if (icon) {
				obj.icon = icon
			}
			else {
				obj.icon = "none"
			}

			this._plat.showToast(obj)
		}
	}

	// 隐藏消息提示框
	hideToast() {
		// body...
		if (this._isToastOnShow) {
			this._isToastOnShow = false

			if (this._plat && this._plat.hideToast) {
				this._plat.hideToast()
			}
		}
	}

	// 显示随机消息提示框
	// 从Tips随机选择一个
	showRandomToast( tips ) {
		// body...
		if (tips) {
			let random_index = G_Utils.random(0, tips.length - 1)
			this.showToast(tips[random_index])
		}
	}

	// 显示loading提示框
	// title 标题
	showLoading( title ) {
		// body...
		this._clearToastAndLoading()

		if (this._plat && this._plat.showLoading) {
			let obj = {
				title: title,
				mask: true
			}

			this._isLoadingOnShow = true
			this._plat.showLoading(obj)
		}
		else {
			console.log("show loading: " + title)
		}
	}

	// 隐藏loading提示框
	hideLoading() {
		// body...
		if (this._isLoadingOnShow) {
			this._isLoadingOnShow = false

			if (this._plat && this._plat.hideLoading) {
				this._plat.hideLoading()
			}
		}
	}

	// 内部方法，关闭toast和loading
	_clearToastAndLoading() {
		// body...
		this.hideToast()
		this.hideLoading()
	}

	// 获取系统信息
	getSysInfo() {
		// body...
		if (this._sysInfo === null) {
			if (this._plat && this._plat.getSystemInfoSync) {
				try {
					this._sysInfo = G_Utils.deepClone(this._plat.getSystemInfoSync())
				}
				catch (e) {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				}
			}
			else {
				// windows
				this._sysInfo = {
					screenHeight: Math.round(Laya.stage.height),
					screenWidth: Math.round(Laya.stage.width),
					windowHeight: Math.round(Laya.stage.height),
					windowWidth: Math.round(Laya.stage.width),
					statusBarHeight: 0,
					brand: "microsoft",
					platform: "window",
					system: "Window 7",
					SDKVersion: "0.0.0"
				}
			}
		}

		return this._sysInfo
	}

	// 获取平台sdk版本
	getSDKVersion() {
		// body...
		let sysInfo = this.getSysInfo()

		if (sysInfo && typeof sysInfo.SDKVersion !== "undefined") {
			return sysInfo.SDKVersion
		}
		else {
			return '0.0.0'
		}
	}

	// 判断当前是否为iPhoneX(S/R)机型
	isIPhoneX() {
		let sysInfo = this.getSysInfo()

		if (sysInfo) {
			if (sysInfo.model && sysInfo.model.indexOf("iPhone X") !== -1) {
				return true
			}

			if (sysInfo.SDKVersion >= "1.1.0" && Laya.Browser.onIOS) {
				if (sysInfo.screenHeight / sysInfo.screenWidth > 2) {
					return true
				}
			}
		}
		
		return false
	}

	openCustomerService( showCard, cb ) {
		// body...
		if (this._plat) {
			if (this._plat.openCustomerServiceConversation) {
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

				this._plat.openCustomerServiceConversation(obj)
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
	}

	/**
	 * 存储本地数据
	 * @param {String} key 键名(全局唯一)，不能为空
	 * @param {Any} data 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象
	 */
	setStorage(key, data) {
		if (!this._checkString(key)) {
			console.error("PlatHelper.setStorage Fail, Check Input...")
			return
		}

		if (this._plat && this._plat.setStorageSync) {
			try {
				this._plat.setStorageSync(key, data)
			} catch (e) {
				console.error("PlatHelper.setStorage Fail, No Support This Kind Of Data: ", data)
			}
		}
		else {
			Laya.LocalStorage.setItem(key, data)
		}
	}

	/**
	 * 获取本地数据
	 * @param {String} key 键名(全局唯一)，不能为空
	 */
	getStorage(key, def) {
		if (!this._checkString(key)) {
			console.error("PlatHelper.getStorage Fail, Check Input...")
			return
		}

		if (this._plat && this._plat.getStorageSync) {
			try {
				return this._plat.getStorageSync(key)
			} catch (e) {
				return (typeof def !== "undefined")? def: null
			}
		}
		else {
			return Laya.LocalStorage.getItem(key)
		}
	}

	/**
	 * 清除本地数据
	 * @param {String} key 键名(全局唯一)，不能为空
	 */
	clearStorage( key ) {
		if (!this._checkString(key)) {
			console.error("PlatHelper.clearStorage Fail, Check Input...")
			return
		}

		if (this._plat && this._plat.removeStorageSync) {
			try {
				this._plat.removeStorageSync(key)
			} catch (e) {}
		}
		else {
			Laya.LocalStorage.removeItem(key)
		}
	}

	/**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return false
	}

	/**
	 * 是否能远程保存（从后台拉取）
	 */
	canSaveOnline() {
		return false
	}

	autoLogin( cb ) {
		// body...
		let doCb = function ( playerInfo ) {
			// body...
			if (typeof cb === "function") {
				cb(playerInfo)
			}
		}

		if (this.canLoginOnline()) {
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

					this._plat.checkSession({
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
	}

	// baseUserInfo 包含玩家的基础信息，如头像，性别，昵称
	login( baseUserInfo, cb ) {
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
	}

	_login( cb ) {
		// body...
		if (this.canLoginOnline()) {
			this.__login(cb)
		}
		else {
			if (G_IsAlwaysNewPlayer) {
				console.log("clear openid and sessid succ...")
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
	}

	__login( cb ) {
		// body...
		var self = this

		this._plat.login({
			timeout: G_Const.C_TIMEOUT_OF_LOGIN,
			success: function (res) {
				// body...
				G_NetHelper.reqLogin(self._toGetLoginCode(res), function ( jsonData ) {
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

	_toGetLoginCode( res ) {
		return res.code
	}

	isWINPlatform() {
		return (this._plat === null)
	}

	isWXPlatform() {
		if (typeof window.wx !== "undefined" && Laya.MiniAdpter) {
			return true
		}
		else {
			return false
		}
	}

	isQQPlatform() {
		// body...
		if (typeof window.qq !== "undefined") {
			return true
		}
		else {
			return false
		}
	}

	isOPPOPlatform() {
		// body...
		if (typeof window.qg !== "undefined" && !Laya.VVMiniAdapter) {
			return true
		}
		else {
			return false
		}
	}

	isVIVOPlatform() {
		// body...
		if (typeof window.qg !== "undefined" && Laya.VVMiniAdapter) {
			return true
		}
		else {
			return false
		}
	}

	isOVPlatform() {
		if (typeof window.qg !== "undefined") {
			return true
		}
		else {
			return false
		}
	}

	isTTPlatform() {
		// body...
		if (typeof window.tt !== "undefined") {
			return true
		}
		else {
			return false
		}
	}

	isQTTPlatform() {
		// body...
		if (typeof window.qttGame !== "undefined") {
			return true
		}
		else {
			return false
		}
	}

	_generateOpenID() {
		// body...
		return G_Utils.generateString(32)
	}

	_generateSessID() {
		// body...
		return G_Utils.generateString(26)
	}

	_checkString( title ) {
		// body...
		if (typeof title === "string" && title !== "") {
			return true
		}
		else {
			return false
		}
	}
}