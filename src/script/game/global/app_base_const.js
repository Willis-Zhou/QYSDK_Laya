var APP_BASE_CONST = {}

APP_BASE_CONST.init = function () {
	// Event Name For App
	let _EventName = {
		// 第一次打开主场景
		EN_FIRST_OPEN_MAIN_SCENE: "EN_FIRST_OPEN_MAIN_SCENE",
		// 第一次打开主场景
		EN_FIRST_START_GAME: "EN_FIRST_START_GAME",
		// 显示banner广告
		EN_SHOW_BANNER_AD: "EN_SHOW_BANNER_AD",
		// 隐藏banner广告
		EN_HIDE_BANNER_AD: "EN_HIDE_BANNER_AD",
		// 显示自己的banner广告
		EN_SHOW_OWN_BANNER_AD: "EN_SHOW_OWN_BANNER_AD",
		// 隐藏自己的banner广告
		EN_HIDE_OWN_BANNER_AD: "EN_HIDE_OWN_BANNER_AD",
		// 显示插屏广告
		EN_SHOW_INSERT_AD: "EN_SHOW_INSERT_AD",
		// 显示自己的插屏广告
		EN_SHOW_OWN_INSERT_AD: "EN_SHOW_OWN_INSERT_AD",
		// 刷新悬浮广告
		EN_REFRESH_FLOW_AD: "EN_REFRESH_FLOW_AD",
		// 取消跳转
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
		REN_NAVIGATE_SUCC_ON_TT_PLAT: "navigate_succ_on_tt_plat"
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
	let _Dbs = [
		"res/conf/db/TBBaseConfig.txt",
		"res/conf/db/TBUIWord.txt",
		"res/conf/db/TBNetError.txt"
	]

	_Dbs.forEach(function( _Db ) {
		G_Dbs.push(_Db)
	})

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

	// wx/qq/tt流量主广告配置
	let _advConfigs = {
		bannerAdUnitIDs: null,
		videoAdUnitIDs: null,
		interstitialAdUnitIDs: null
	}

	// global
	window.G_advConfigs = _advConfigs

	// Oppo/Vivo流量主广告配置
	let _OVAdvConfigs = []

	// global
	window.G_OVAdvConfigs = _OVAdvConfigs

	// 推荐广告配置
	window.G_RecommendAdUnitIDs = null

	// 盒子广告配置
	window.G_BoxAdUnitIDs = null

	// 商业广告位配置
	let _ADCfg = {
		"Popup": "",
		"Flow": "",
		"Banner": "",
		"Scroll": "",
		"FullScene": "",
		"FullSceneScroll": "",
		"Exit": "",
		"Finish": ""
	}

	// global
	window.G_ADCfg = _ADCfg

	// 预加载资源配置
	let _PreloadAssets = []

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
		// 屏蔽导出的渠道（wx专用）
		SN_DISABLE_EXPORT_ADV_CHIDS: "disable_export_adv_chids",
		// 提审开关
		SN_IS_PUBLISHING: "is_publishing",
		// 提审版本
		SN_COMMIT_VERSION: "commitVersion",
		// 线上版本狂点类误触开关
		SN_OV_CLICK_STATUS: "onlineMistakeStatusOfClick",
		// 线上版本位移类误触开关
		SN_OV_MOVE_STATUS: "onlineMistakeStatusOfMove",
		// 线上版本按钮类误触开关
		SN_OV_BTN_STATUS: "onlineMistakeStatusOfBtn",
		// 线上版本退出类误触开关
		SN_OV_EXIT_STATUS: "onlineMistakeStatusOfExit",
		// 提审版本狂点类误触开关
		SN_CV_CLICK_STATUS: "commitMistakeStatusOfClick",
		// 提审版本位移类误触开关
		SN_CV_MOVE_STATUS: "commitMistakeStatusOfMove",
		// 提审版本按钮类误触开关
		SN_CV_BTN_STATUS: "commitMistakeStatusOfBtn",
		// 提审版本退出类误触开关
		SN_CV_EXIT_STATUS: "commitMistakeStatusOfExit",
		// 今天最大误触触发数
		SN_TODAY_MAX_MISTAKE_COUNTS: "todayMaxMistakeCounts",
		// 误触的触发概率
		SN_INVOKE_MISTAKE_RATE: "invokeMistakeRate",
		// 误触的触发间隔
		SN_INTERVAL_OF_MISTAKES: "intervalOfMistakes",
		// 误触的触发间隔 --- 狂点
		SN_INTERVAL_OF_CLICK_MISTAKES: "intervalOfClickMistakes",
		// 误触的触发间隔 --- 位移
		SN_INTERVAL_OF_MOVE_MISTAKES: "intervalOfMoveMistakes",
		// 误触的触发间隔 --- 按钮
		SN_INTERVAL_OF_BTN_MISTAKES: "intervalOfBtnMistakes",
		// 误触的触发间隔 --- 退出
		SN_INTERVAL_OF_EXIT_MISTAKES: "intervalOfExitMistakes",
		// 是否新游戏
		SN_IS_NEW_GAME: "isNewGame",
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
		// 客服界面默认分享
		SS_CUSTOMER_SERVER: "CustomerServer",
	}

	// global
	window.G_ShareScene = _ShareScene

	// 为""时不启动
	let _SoundName = {
        SN_CLICK: "res/sounds/click.mp3",
    }

	// global
	window.G_SoundName = _SoundName

	// 远程资源的基础地址，为空时不设定
	window.G_BaseUrlPath = ""

	// 开启远程资源的本地白名单的地址(支持文件，文件夹）
	window.G_AppNativefiles = [
		"res/atlas/",
		"res/conf/",
		"ad/"
	]

	// 是否允许离线登录（登录失败转成离线状态）
	window.G_IsAllowLoginOffline = true

	// 是否使用自己的插屏广告
	window.G_IsUseOwnInsertAd = false

	// ov平台使用自己的插屏广告
	if (typeof window.qg !== "undefined") {
		G_IsUseOwnInsertAd = true
	}
}

// export
export {APP_BASE_CONST}