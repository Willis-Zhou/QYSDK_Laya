import PlatBaseHelper from "./plat_base_helper";

class WINPlatHelper extends PlatBaseHelper {
    constructor() {
        super()
        
        this._platType = "WIN"
        this._platDesc = "Windows小游戏平台"
    }

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return false
	}

	/**
	 * 显示提示框
	 * @param {String} title 提示框内容
	 * @param {String} icon 只支持"success", "loading", "none"三种模式，默认为"none"
	 */
	showToast(title, icon) {
		// body...
		this._clearToastAndLoading()

		console.log("show toast: " + title)
		G_Event.dispatchEvent(G_EventName.EN_SHOW_LOCAL_TIPS, title)
	}

	/**
	 * 隐藏提示框
	 */
	hideToast() {
		// body...
		G_Event.dispatchEvent(G_EventName.EN_HIDE_LOCAL_TIPS)
	}
}

class WXPlatHelper extends PlatBaseHelper {
    constructor() {
        super()

        this._plat = window.wx
        this._platType = "WX"
        this._platDesc = "微信小游戏平台"

        this._recogniseSceneIDs.push({sceneIDs: [1007], eventName: G_EventName.EN_LAUNCH_APP_FROM_SINGLE_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_GROUP_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1007, 1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1089], eventName: G_EventName.EN_LAUNCH_APP_FROM_RECENT})
		this._recogniseSceneIDs.push({sceneIDs: [1038], eventName: G_EventName.EN_LAUNCH_APP_BACK_FROM_OTHER_APP})
		this._recogniseSceneIDs.push({sceneIDs: [1104], eventName: G_EventName.EN_LAUNCH_APP_FROM_FAVOURITE})
    }

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return true
	}
}

class QQPlatHelper extends PlatBaseHelper {
    constructor() {
        super()

        this._plat = window.qq
        this._platType = "QQ"
        this._platDesc = "QQ小游戏平台"

        this._recogniseSceneIDs.push({sceneIDs: [1007], eventName: G_EventName.EN_LAUNCH_APP_FROM_SINGLE_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_GROUP_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1007, 1008], eventName: G_EventName.EN_LAUNCH_APP_FROM_SHARE})
		this._recogniseSceneIDs.push({sceneIDs: [1038], eventName: G_EventName.EN_LAUNCH_APP_BACK_FROM_OTHER_APP})
    }

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return true
	}
}

class OPPOPlatHelper extends PlatBaseHelper {
    constructor() {
        super()

        this._plat = window.qg
        this._platType = "OPPO"
        this._platDesc = "OPPO小游戏平台"
    }

    /**
	 * 退出游戏
	 */
	exitApp() {
		// body...
		if (this._plat && this._plat.exitApplication) {
			this._plat.exitApplication({
				fail: function () {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				}
			})
		}
    }
    
    // 获取平台sdk版本
	getSDKVersion() {
		// body...
		let sysInfo = this.getSysInfo()

		if (sysInfo && typeof sysInfo.platformVersion !== "undefined") {
			return sysInfo.platformVersion.toString()
		}
		else {
			return '0'
		}
	}

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return false
	}

	/**
	 * 手机震动
	 * @param {Boolean} bLong 长/短
	 */
	vibratePhone( bLong ) {
		// body...
		if (bLong) {
			if (this._plat && this._plat.vibrateLong) {
				this._plat.vibrateLong({
					success: null,
					fail: null,
					complete: null
				})
			}
		}
		else {
			if (this._plat && this._plat.vibrateShort) {
				this._plat.vibrateShort({})
			}
		}
	}

	/**
	 * 显示提示框
	 * @param {String} title 提示框内容
	 * @param {String} icon 只支持"success", "loading", "none"三种模式，默认为"none"
	 */
	showToast(title, icon) {
		// body...
		this._clearToastAndLoading()

		console.log("show toast: " + title)
		G_Event.dispatchEvent(G_EventName.EN_SHOW_LOCAL_TIPS, title)
	}

	/**
	 * 隐藏提示框
	 */
	hideToast() {
		// body...
		G_Event.dispatchEvent(G_EventName.EN_HIDE_LOCAL_TIPS)
	}

	/**
	 * 生成桌面图标
	 */
	installShortcut( succCb ) {
		// body...
		this._plat.hasShortcutInstalled({
			success: res => {
				if(res == false) {
					this._plat.installShortcut({
						success: () => {
							if (typeof succCb === "function") {
								succCb()
							}
						}
					})
				}
			}
		})
	}

	_toGetLoginCode( res ) {
		return res.data.token
	}
}

class VIVOPlatHelper extends PlatBaseHelper {
    constructor() {
        super()

        this._plat = window.qg
        this._platType = "VIVO"
        this._platDesc = "VIVO小游戏平台"
    }

    /**
	 * 退出游戏
	 */
	exitApp() {
		// body...
		if (this._plat && this._plat.exitApplication) {
			this._plat.exitApplication()
		}
    }
    
    // 获取平台sdk版本
	getSDKVersion() {
		// body...
		let sysInfo = this.getSysInfo()

		if (sysInfo && typeof sysInfo.platformVersion !== "undefined") {
			return sysInfo.platformVersion.toString()
		}
		else {
			return '0'
		}
	}

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return false
	}

	/**
	 * 显示提示框
	 * @param {String} title 提示框内容
	 * @param {String} icon 只支持"success", "loading", "none"三种模式，默认为"none"
	 */
	showToast(title, icon) {
		// body...
		this._clearToastAndLoading()

		console.log("show toast: " + title)
		G_Event.dispatchEvent(G_EventName.EN_SHOW_LOCAL_TIPS, title)
	}

	/**
	 * 隐藏提示框
	 */
	hideToast() {
		// body...
		G_Event.dispatchEvent(G_EventName.EN_HIDE_LOCAL_TIPS)
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

		if (this._plat && this._plat.showDialog && this._checkString(content)) {
			let obj = {
				message: content,
				buttons: [
					{
						text: "确认"
					}
				],
				success: res => {
					this._isModalOnShow = false
					if (typeof cb === "function") {
						if (res.index === 0) {
							cb(true)
						}
						else if (res.index === 1) {
							cb(false)
						}
					}
				},
				cancel: () => {
					this._isModalOnShow = false
					if (typeof cb === "function") {
						cb(false)
					}
				},
				fail: () => {
					this._isModalOnShow = false
					if (typeof cb === "function") {
						cb(false)
					}
				}
			}

			if (showCancel) {
				obj.buttons.push({
					text: "取消"
				})
			}

			if (custom) {
				if (this._checkString(title)) { obj.title = title; }
				if (custom.confirmText) {
					obj.buttons[0].text = custom.confirmText
				}
				if (custom.confirmColor) {
					obj.buttons[0].color = custom.confirmColor
				}
				if (showCancel) {
					if (custom.cancelText) {
						obj.buttons[1].text = custom.cancelText
					}
					if (custom.cancelColor) {
						obj.buttons[1].color = custom.cancelColor
					}
				}
			}

			this._isModalOnShow = true
			this._plat.showDialog(obj)
		}
		else {
			if (typeof cb === "function") {
				cb(false)
			}
		}
	}

	/**
	 * 生成桌面图标
	 */
	installShortcut( succCb ) {
		// body...
		this._plat.hasShortcutInstalled({
			success: res => {
				if(res == false) {
					this._plat.installShortcut({
						success: () => {
							if (typeof succCb === "function") {
								succCb()
							}
						}
					})
				}
			}
		})
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

		Laya.LocalStorage.setItem(key, data)
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

		return Laya.LocalStorage.getItem(key)
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

		Laya.LocalStorage.removeItem(key)
	}
}

class TTPlatHelper extends PlatBaseHelper {
    constructor() {
        super()

        this._plat = window.tt
        this._platType = "TT"
		this._platDesc = "TT小游戏平台"
		this._onNavigateSuccCb = null
		this._onNavigateFailCb = null
	}
	
	init() {
		super.init()

		if (this._plat && this._plat.onNavigateToMiniProgram) {
			this._plat.onNavigateToMiniProgram(res => {
				if (res.errCode === 0) {
					console.log("跳转成功", res)

					if (typeof this._onNavigateSuccCb === "function") {
						this._onNavigateSuccCb()
					}
				}
				else {
					console.error("跳转失败", res)

					if (typeof this._onNavigateFailCb === "function") {
						this._onNavigateFailCb()
					}
				}
			})
		}

		if (this._plat && this._plat.onMoreGamesModalClose) {
			this._plat.onMoreGamesModalClose(() => {
				this._onNavigateSuccCb = null
				this._onNavigateFailCb = null
				let closeCb = this._onMoreGamesModalCloseCb
				this._onMoreGamesModalCloseCb = null

				if (typeof closeCb === "function") {
					closeCb()
				}
			})
		}
	}

    /**
	 * 退出游戏
	 */
	exitApp() {
		// body...
		if (this._plat && this._plat.exitApplication) {
			this._plat.exitApplication()
		}
	}

    /**
	 * 是否能远程登录（从后台拉取）
	 */
	canLoginOnline() {
		return false
	}

	/**
	 * 展示更多游戏弹出窗
	 */
	showMoreGamesModal( closeCb, succCb, failCb ) {
		// body...
		let sysInfo = this.getSysInfo()
		if (sysInfo.platform === "ios") {
			this.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_NOT_SUPPORT_ON_IOS_PLATFORM"]).word)
			return
		}

		if (this._plat.showMoreGamesModal) {
			this._plat.showMoreGamesModal({
				appLaunchOptions: []
			})

			this._onNavigateSuccCb = succCb
			this._onNavigateFailCb = failCb
			this._onMoreGamesModalCloseCb = closeCb
		}
	}

	_convertStyle(node, extendStyle) {
		let style = {
			textColor: "#000000",
			textAlign: "center",
			fontSize: 0,
			borderRadius: 0,
			borderWidth: 0,
			borderColor: "#000000"
		}

		if (extendStyle) {
			if (typeof extendStyle.backgroundColor !== "undefined") {
				style.backgroundColor = extendStyle.backgroundColor
			}

			if (typeof extendStyle.textColor !== "undefined") {
				style.textColor = extendStyle.textColor
			}

			if (typeof extendStyle.textAlign !== "undefined") {
				style.textAlign = extendStyle.textAlign
			}

			if (typeof extendStyle.fontSize !== "undefined") {
				style.fontSize = extendStyle.fontSize
			}

			if (typeof extendStyle.borderRadius !== "undefined") {
				style.borderRadius = extendStyle.borderRadius
			}

			if (typeof extendStyle.borderWidth !== "undefined") {
				style.borderWidth = extendStyle.borderWidth
			}

			if (typeof extendStyle.borderColor !== "undefined") {
				style.borderColor = extendStyle.borderColor
			}
		}

		let worldCenterPt = node.localToGlobal(new Laya.Vector2(node.width / 2, node.height / 2), true)
		let leftTopPosX = worldCenterPt.x - (node.width / 2 * node.scaleX)
		let leftTopPosY = worldCenterPt.y - (node.height / 2 * node.scaleY)

		let openGLPt = G_UIHelper.convertToOpenGLPt({x: leftTopPosX, y: leftTopPosY})
		let openGLSize = G_UIHelper.convertToOpenGLSize({width: (node.width * node.scaleX), height: (node.height * node.scaleY)})

		style.left = openGLPt.x
		style.top = openGLPt.y
		style.width = openGLSize.width
		style.height = openGLSize.height

		return style
	}
}

var _PlatHelper = null

if (typeof window.qq !== "undefined") {
    _PlatHelper = QQPlatHelper
}
else if (typeof window.tt !== "undefined") {
    _PlatHelper = TTPlatHelper
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("oppo") > -1)) {
    _PlatHelper = OPPOPlatHelper
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("vivo") > -1)) {
    _PlatHelper = VIVOPlatHelper
}
else if (typeof window.wx !== "undefined") {
    _PlatHelper = WXPlatHelper
}
else {
    _PlatHelper = WINPlatHelper
}

export {_PlatHelper}