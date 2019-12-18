var APP_CONST = {}

APP_CONST.init = function () {
	// Event Name For App
	let _EventName = {
		EN_COIN_CHANGED: "EN_COIN_CHANGED",
		EN_LACK_OF_COIN: "EN_LACK_OF_COIN",
		EN_SHOW_BANNER_AD: "EN_SHOW_BANNER_AD",
		EN_HIDE_BANNER_AD: "EN_HIDE_BANNER_AD",
		EN_CANCEL_NAVIGATION_FROM_AD: "EN_CANCEL_NAVIGATION_FROM_AD"
	}

	for (let key in _EventName) {
		if (typeof G_EventName[key] === "undefined") {
			G_EventName[key] = _EventName[key]
		}
		else {
			console.error("Event Name: {0} Conflicted, It's Used By SDK...".format(key))
		}
	}

	// Not Propagation Event Name For App
	let _NotPropagationEventName = {
	}

	for (let key in _NotPropagationEventName) {
		if (typeof G_NotPropagationEventName[key] === "undefined") {
			G_NotPropagationEventName[key] = _NotPropagationEventName[key]
		}
		else {
			console.error("Event Name: {0} Conflicted, It's Used By SDK...".format(key))
		}
	}

	// 免费获取方式
	let _FreeGetWay = {
		// 都不支持
		FGW_NONE: "none",
		// 分享
		FGW_SHARE: "share",
		// 广告
		FGW_ADV: "adv",
	}

	// global
	window.G_FreeGetWay = _FreeGetWay

	// 上报事件名
	// 需要先注册，才能正确上报完成
	let _ReportEventName = {
	}
	
	for (let key in _ReportEventName) {
		if (typeof G_ReportEventName[key] === "undefined") {
			G_ReportEventName[key] = _ReportEventName[key]
		}
		else {
			console.error("Report Name: {0} Conflicted, It's Used By SDK...".format(key))
		}
	}

	// 全局配置文件列表
	// 如有新的配置文件，Laya版本的需手动添加
	// G_Dbs.push("res/conf/db/TBLevelConfig.txt")

	// GameDB配置
	let _GameDBConfigs = [
		{
			// 关键字
			key: "BaseConfig",
			// 若为true，则会创建get{*}ByID的方法，参数为id(其中{*}代表key值)
			getFunc: true,
			// 若为true，则会创建getAll{*}s的方法，无参数(其中{*}代表key值)
			getAllFunc: true,
			// 若为true，则会创建getAll{*}Count的方法，无参数(其中{*}代表key值)
			getCountFunc: false
		},
		{
			key: "UIWord",
			getFunc: true,
			getAllFunc: true,
			getCountFunc: false
		},
		{
			key: "NetError",
			getFunc: true,
			getAllFunc: true,
			getCountFunc: false
		}
	]

	// global
	window.G_GameDBConfigs = _GameDBConfigs

	// Oppo广告配置
	let _OppoAdvConfigs = [
		// Banner Ad
		{
			// 关键字
			key: "Skin",
			// 广告的posId
			posId: "146764",
			// 广告的类型，Banner创建create{*}BannerAd方法，Video创建show{*}VideoAd(cb)方法，Insert创建show{*}InsertAd(cb)方法，其中{*}为对应Key值
			type: "Banner"
		},

		// Video Ad
		{
			key: "Revive",
			posId: "146766",
			type: "Video"
		},

		// Insert Ad
		{
			key: "Fail",
			posId: "146737",
			type: "Insert"
		}
	]

	// global
	window.G_OppoAdvConfigs = _OppoAdvConfigs

	// 预加载资源配置
	let _PreloadAssets = []
	// _PreloadAssets.push("")

	// global
	window.G_PreloadAssets = _PreloadAssets

	// 全局开关名
	let _SwitchName = {
		// 每日领取奖励次数
		SN_REWARD_TIMES_OF_EACH_DAY: "reward_times_of_each_day",
		// 开启分享前的广告次数
		SN_ADV_TIMES_BEFORE_SHARE: "adv_times_before_share",
		// 分享概率（100最多）
		SN_RATE_OF_SHARE: "rate_of_share",
		// 最小分享所用时间（单位：毫秒）
		SN_MIN_DURATION_BETWEEN_SHARE: "min_duration_between_share",
		// 上报到阿拉丁后台的百分比
		SN_PERCENT_OF_REPORT_TO_ALD: "percent_of_report_to_ald",
		// 提审开关
		SN_IS_PUBLISHING: "is_publishing",
		// 屏蔽导出的渠道
		SN_DISABLE_EXPORT_ADV_CHIDS: "disable_export_adv_chids",
	}

	// global
	window.G_SwitchName = _SwitchName

	// 全局分享场景名
	// 场景名应该在后台分享配置中有对应的配置
	let _ShareScene = {
		// 系统菜单
		SS_SYSTEM_MENU: "SystemMenu",
		// 分享App
		SS_SHARE_APP: "ShareApp",
	}

	// global
	window.G_ShareScene = _ShareScene

	// 为""时不启动
	let _SoundName = {
        SN_CLICK: "res/sounds/click.mp3",
    }

	// global
	window.G_SoundName = _SoundName

	// 广告位配置
	// A
	let _ADCfg = {
		"Popup": "468e9620668b4154b01a9a150ceb9810",
		"Flow": "afed066b6427c0e22fb8ed4f0a89bb3d",
		"Banner": "9f27da0db6accd5a30c668d0a918d440",
		"FullScene": "f68b3f165d7d5cb1ef537abbb63f8ec3",
		"FullSceneScroll": "4e92adf9fe3adf844800c42bfc9072b1"
	}

	// B
	// let _ADCfg = {
	// 	"Popup": "",
	// 	"Flow": "",
	// 	"Banner": "26cc3b2ce8d4ff6640a7c8600e1867eb",
	// 	"FullScene": "",
	// 	"FullSceneScroll": ""
	// }

	// QQ
	if (typeof window.qq !== "undefined") {
		_ADCfg = {
			"Popup": "",
			"Flow": "",
			"Banner": "",
			"FullScene": "",
			"FullSceneScroll": ""
		}
	}

	window.G_ADCfg = _ADCfg

	// 远程资源的基础地址，为空时不设定
	// window.G_BaseUrlPath = "https://image.game.hnquyou.com/upload/"
	window.G_BaseUrlPath = ""
	
	// 登录按钮图片地址
	G_LoginBtnPath = "resources/***.png"
	
	// 是否每次新用户
	G_IsAlwaysNewPlayer = true

    // openID未设定随机生成32位的字符代替
	G_OpenID = null

	// sessID未设定随机生成26位的字符代替
	G_SessID = null

	// nickname未设定使用空字符代替
	G_Nickname = ""

	// sex中0未未知，1为男性，2为女性，默认为0
	G_Sex = 0

	// headUrl头像网络地址，未设定使用空字符代替
	G_HeadUrl = ""

	// 非windows环境，配置重置
	if (Laya.MiniAdpter || Laya.QQMiniAdapter || Laya.VVMiniAdapter || Laya.QGMiniAdapter) {
		G_IsAlwaysNewPlayer = false
		G_OpenID = null
		G_SessID = null
		G_Nickname = ""
		G_Sex = 0
		G_HeadUrl = ""
	}
}

// export
export {APP_CONST}