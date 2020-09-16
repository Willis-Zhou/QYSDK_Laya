/*
* 平台分享
* 主要通过各个平台提供的基础sdk实现对应平台的分享功能
*/
export default class ShareBase {
	constructor() {
		// log
		console.log('Init G_Share Instance...')

		this._cfgs = null
		this._initedCbs = {}
		this._inited = false

		this._shareFailTips = null
		this._sharingSceneInfo = null
		this._minDurationBetweenShare = 3000
	}

	init() {
		// body...
		if (this._inited) {
			return
		}
		this._inited = true

		G_Switch.getMinDurationBetweenShare(function ( duration ) {
			// body...
			this._minDurationBetweenShare = duration
		}.bind(this))

		if (!this.isSupportCallback()) {
			G_Event.addEventListerner(G_EventName.EN_APP_AFTER_ONSHOW, function () {
				// body...
				// only schedule once
				G_Scheduler.schedule("Auto_Share_Callback", function () {
					// body...
					console.log("Auto_Share_Callback")
	
					if (this._sharingSceneInfo) {
						let bSucc = this._checkShareResult(this._sharingSceneInfo)
	
						if (typeof this._sharingSceneInfo.cb === "function") {
							this._sharingSceneInfo.cb(bSucc)
						}
	
						if (!bSucc && this._sharingSceneInfo.showFailTips) {
							G_PlatHelper.showRandomToast(this._getShareFailTips())
						}
	
						this._sharingSceneInfo = null
					}
				}.bind(this), false, 10, 0)
			}.bind(this))
		}

		if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().showShareMenu) {
			this._getOnMenuShareFunc(func => {
				let registerOnMenuShareFunc = onMenuShareFunc => {
					if (onMenuShareFunc) {
						G_PlatHelper.getPlat().showShareMenu({
							// body...
							withShareTicket: true
						})
			
						onMenuShareFunc(shareOption => {
							// body...
							let cfg = this._getDoShareCfg(this._getShareInfo(G_ShareScene.SS_SYSTEM_MENU))
			
							if (cfg) {
								return this._makeAndSaveShareInfo(G_ShareScene.SS_SYSTEM_MENU, null, cfg, null, false, null)
							}
							else {
								return {}
							}
						})
					}
				}
	
				// register
				registerOnMenuShareFunc(func)
			})
		}
	}

	// 添加分享配置
	addCfgs( cfgs ) {
		// body...
		if (cfgs && this._cfgs) {
			for (let key in cfgs) {
				this._cfgs[key] = cfgs[key]
			}
		}
	}

	// 初始化完成
	inited() {
		// body...
		for (let key in this._initedCbs) {
			this._doShare(key, this._initedCbs[key].extendParams, this._initedCbs[key].customQueryObj, this._initedCbs[key].showFailTips, this._initedCbs[key].cb)
		}

		this._initedCbs = {}
	}

	// 是否支持分享
	isSupport() {
		return false
	}

	// 是否支持分享回调
	isSupportCallback() {
		return false
	}

	// 是否准备好分享
	isReady() {
		// body...
		return (this._cfgs && Object.keys(this._cfgs).length > 0)
	}

	// 是否分享中
	isSharing() {
		// body...
		return (this._sharingSceneInfo !== null)
	}

	/**
	 * 分享
	 * @param {String} scene_name 场景名，必须属于G_ShareScene
	 * @param {Object} customQueryObj 自定义参数
	 * @param {Boolean} showFailTips 是否显示失败提示，默认true
	 * @param {Function} cb 回调函数
	 */
	share(scene_name, customQueryObj, showFailTips = true, cb = null) {
		// body...
		if (!this._checkString(scene_name)) {
			if (typeof cb === "function") {
				cb(false)
			}
			return
		}

		if (this.isSupport()) {
			if (!this.isReady()) {
				this._initedCbs[scene_name] = {
					customQueryObj: customQueryObj,
					showFailTips: showFailTips,
					cb: cb
				}
			}
			else {
				this._doShare(scene_name, null, customQueryObj, showFailTips, cb)
			}
		}
		else {
			if (typeof cb === "function") {
				cb(G_PlatHelper.isWINPlatform())
			}
		}
	}

	/**
	 * 分享视频
	 * @param {String} scene_name 场景名，必须属于G_ShareScene
	 * @param {String} videoPath 视频地址
	 * @param {Object} customQueryObj 自定义参数
	 * @param {Boolean} showFailTips 是否显示失败提示，默认true
	 * @param {Function} cb 回调函数
	 */
	shareVideo(scene_name, videoPath, customQueryObj, showFailTips = true, cb = null) {
		// body...
	}

	// 获取分享信息
	getShareInfo( scene_name ) {
		// body...
		return this._getShareInfo(scene_name)
	}

	// 获取分享配置
	getDoShareCfg( shareInfo ) {
		// body...
		return this._getDoShareCfg(shareInfo)
	}

	_getShareInfo( _scene_name ) {
		// body...
		if (!this._cfgs || !this._cfgs[_scene_name]) {
			return null
		}

		return this._cfgs[_scene_name]
	}

	_getDoShareCfg( _shareInfo ) {
		// body...
		if (!_shareInfo || !_shareInfo.cfgs) {
			return null
		}

		let cfgs = _shareInfo.cfgs
		let all_weights = 0

		for (let i = 0; i < cfgs.length; i++) {
			if (typeof cfgs[i].weight === "undefined") {
				cfgs[i].weight = "10"
			}

			all_weights += parseInt(cfgs[i].weight, 10)
		}

		let random_weight = 0
		while(random_weight === 0) {
			random_weight = G_Utils.random(all_weights)
		}

		let start_weight = 0
		let end_weight = 0

		for (let i = 0; i < cfgs.length; i++) {
			start_weight = end_weight
			end_weight += parseInt(cfgs[i].weight, 10)
			
			if (random_weight >= start_weight && random_weight <= end_weight) {
				return cfgs[i]
			}
		}

		return null
	}

	_doShare(_scene_name, _extendParams, _customQueryObj, _showFailTips, _cb) {
		// body...
		let cfg = this._getDoShareCfg(this._getShareInfo(_scene_name))

		if (cfg && this.isSupport()) {
			let shareFunc = this._getShareAppFunc()

			if (shareFunc) {
				shareFunc(this._makeAndSaveShareInfo(_scene_name, _extendParams, cfg, _customQueryObj, _showFailTips, _cb))
			}
		}
		else {
			if (typeof _cb === "function") {
				_cb(false)
			}
		}
	}

	_makeAndSaveShareInfo( _scene_name, _extendParams, _cfg, _customQueryObj, _showFailTips, _cb ) {
		// body...
		this._sharingSceneInfo = null

		if (_cfg) {
			this._sharingSceneInfo = {
				scene: _scene_name,
				customQueryObj: _customQueryObj,
				showFailTips: _showFailTips,
				startTime: new Date().getTime(),
				cb: _cb
			}

			let queryStr = "scene={0}&tag={1}".format(_scene_name, _cfg.tag)
			if (_customQueryObj) {
				for(let key in _customQueryObj) {
					queryStr += "&" + key + "=" + _customQueryObj[key]
				}
			}

			var self = this

			let shareInfo = {
				query: queryStr,
				success: function () {
					// body...
					console.log("share success!!!")

					if (self._sharingSceneInfo) {
						let bSucc = self._checkShareResult(self._sharingSceneInfo)

						if (!bSucc && self._sharingSceneInfo.showFailTips) {
							G_PlatHelper.showRandomToast(self._getShareFailTips())
						}
						
						if (typeof self._sharingSceneInfo.cb === "function") {
							self._sharingSceneInfo.cb(bSucc)
						}

						self._sharingSceneInfo = null
					}
				},
				fail: function ( err ) {
					// body...
					console.log("share fail!!!")

					if (self._sharingSceneInfo) {
						if (self._sharingSceneInfo.showFailTips) {
							G_PlatHelper.showRandomToast(self._getShareFailTips(_extendParams))
						}

						if (typeof self._sharingSceneInfo.cb === "function") {
							self._sharingSceneInfo.cb(false)
						}

						self._sharingSceneInfo = null
					}
				}
			}
			
			return shareInfo
		}
		else {
			return {}
		}
	}

	_checkShareResult( sharingInfo ) {
		// body...
		if (sharingInfo) {
			if ((new Date().getTime() - sharingInfo.startTime) >= this._minDurationBetweenShare) {
				if (sharingInfo.scene !== G_ShareScene.SS_SYSTEM_MENU && sharingInfo.scene !== G_ShareScene.SS_CUSTOMER_SERVER) {
					// 除来自系统菜单的分享，则增加有效分享次数
					G_PlayerInfo.plusTodayShareTimes()
				}

				return true
			}
		}
		
		return false
	}

	_getShareFailTips() {
		// body...
		if (!this._shareFailTips) {
			this._shareFailTips = []
			this._shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_ONE"]).word)
			this._shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_TWO"]).word)
			this._shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_THREE"]).word)
		}

		return this._shareFailTips
	}

	_getOnMenuShareFunc( cb ) {
		if (typeof cb !== "function") {
			return
		}

		cb(null)
	}

	_getShareAppFunc() {
		return null
	}

	_checkString( str ) {
		// body...
		if (typeof str === "string" && str !== "") {
			return true
		}
		else {
			return false
		}
	}
}