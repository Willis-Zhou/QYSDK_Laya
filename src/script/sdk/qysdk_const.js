var QYSDK_CONST = {}
QYSDK_CONST.init = function () {
	// 全局事件名
	// 务必保证键和值相等且全局唯一
	let _EventName = {
		// 系统错误（严重错误）
		EN_SYSTEM_ERROR: "EN_SYSTEM_ERROR",
		// SDK版本太低
		EN_SDK_NOT_SUPPORT: "EN_SDK_NOT_SUPPORT",
		// 网络连接丢失
		EN_NET_CONNECTION_LOST: "EN_NET_CONNECTION_LOST",
		// 网络连接恢复
		EN_NET_CONNECTION_RECOVER: "EN_NET_CONNECTION_RECOVER",
		// 退出前
		EN_WILL_EXIT: "EN_WILL_EXIT",
		// App进入前台后
		EN_APP_AFTER_ONSHOW: "EN_APP_AFTER_ONSHOW",
		// App进入后台前
		EN_APP_BEFORE_ONHIDE: "EN_APP_BEFORE_ONHIDE",
		// 当前banner广告无法展示
		EN_BANNER_NOT_SUPPORT_RIGHT_NOW: "EN_BANNER_NOT_SUPPORT_RIGHT_NOW",
		// 当前奖励视频无法播放
		EN_VIDEO_NOT_SUPPORT_RIGHT_NOW: "EN_VIDEO_NOT_SUPPORT_RIGHT_NOW",
		// 当前插屏广告无法播放
		EN_INTERSTITIAL_NOT_SUPPORT_RIGHT_NOW: "EN_INTERSTITIAL_NOT_SUPPORT_RIGHT_NOW",
		// 拉起App未知方式（无需特别处理的）
		EN_LAUNCH_APP_FROM_UNKNOW: "EN_LAUNCH_APP_FROM_UNKNOW",
		// 拉起APP（通用方式）
		EN_LAUNCH_APP_FROM_EVERYWHERE: "EN_LAUNCH_APP_FROM_EVERYWHERE",
		// 拉起App---从最近使用 1089
		EN_LAUNCH_APP_FROM_RECENT: "EN_LAUNCH_APP_FROM_RECENT",
		// 拉起App---从我的小程序 1104
		EN_LAUNCH_APP_FROM_FAVOURITE: "EN_LAUNCH_APP_FROM_FAVOURITE",
		// 拉起App---从单人分享 1007
		EN_LAUNCH_APP_FROM_SINGLE_SHARE: "EN_LAUNCH_APP_FROM_SINGLE_SHARE",
		// 拉起App---从群聊分享 1008
		EN_LAUNCH_APP_FROM_GROUP_SHARE: "EN_LAUNCH_APP_FROM_GROUP_SHARE",
		// 拉起App---从分享 1007和1008
		EN_LAUNCH_APP_FROM_SHARE: "EN_LAUNCH_APP_FROM_SHARE",
		// 拉起App---从其他APP返回 1038
		EN_LAUNCH_APP_BACK_FROM_OTHER_APP: "EN_LAUNCH_APP_BACK_FROM_OTHER_APP",

		// 显示提示框
		EN_SHOW_LOCAL_TIPS: "EN_SHOW_LOCAL_TIPS",
		// 隐藏提示框
		EN_HIDE_LOCAL_TIPS: "EN_HIDE_LOCAL_TIPS"
	}

	// global
	window.G_EventName = _EventName

	// 继续传播的事件名
	let _NotPropagationEventName = {
	}

	// global
	window.G_NotPropagationEventName = _NotPropagationEventName

	// 判断全局事件是否吞噬，不继续传播
	// true代表不继续传播
	window.G_IsGlobalEventPropagation = function (eventName) {
		// body...
		if (typeof eventName !== "string") {
			return true
		}

		if (G_EventName[eventName] && _NotPropagationEventName[eventName]) {
			return false
		}

		return true
	}

	// var 开放域操作命令
	// 此处变量名定义必须与开放域内的定义完全相同
	var _OpenDataOperation = {
		ODO_PRELOAD: "preload",
		ODO_SHOW_RANK: "show_rank"
	}

	// global
	window.G_OpenDataOperation = _OpenDataOperation
	
	// 上报事件名
	// 需要先注册，才能正确上报完成
	let _ReportEventName = {
		REN_NAVIGATION_TO_MINIPROGRAM: "navigation_to_miniprogram",
		REN_NAVIGATION_TO_MINIPROGRAM_SUCCESS: "navigation_to_miniprogram_success",
		REN_NAVIGATION_TO_MINIPROGRAM_CANCEL: "navigation_to_miniprogram_cancel",
		REN_NAVIGATION_TO_MINIPROGRAM_ERROR: "navigation_to_miniprogram_error",
		REN_RECEIVED_MEMORY_WARNING: "received_memory_warning"
	}

	// global
	window.G_ReportEventName = _ReportEventName

	// 全局常量
	let _Const = {
		// 登录超时时限
		C_TIMEOUT_OF_LOGIN: 10000,
		// 最大定时回调次数
		C_SCHEDULE_REPEAT_FOREVER: 1561963389461,
	}

	// global
	window.G_Const = _Const

	// 全局配置文件列表
	let _Dbs = []

	// global
	window.G_Dbs = _Dbs

    // 登录按钮图片地址
    window.G_LoginBtnPath = "resources/***.png"

    // global
	// 以下配置只在window端生效
	// 是否每次新用户
	window.G_IsAlwaysNewPlayer = false

	// openID未设定随机生成32位的字符代替
	window.G_OpenID = null

	// sessID未设定随机生成26位的字符代替
	window.G_SessID = null

	// nickname未设定使用空字符代替
	window.G_Nickname = ""

	// sex中0未未知，1为男性，2为女性，默认为0
	window.G_Sex = 0

	// headUrl头像网络地址，未设定使用空字符代替
	window.G_HeadUrl = ""
}

// export
export {QYSDK_CONST}