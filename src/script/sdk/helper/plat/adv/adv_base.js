var G_MaxTimesOfCreateBanner = 3;
var G_MaxTimesOfCreateInterstitial = 3;

/*
* 平台广告
* 主要通过各个平台提供的基础sdk实现对应平台的广告功能
*/
export default class AdvBase {
	constructor() {
		// log
		console.log("Init G_Adv Instance...")

		// banner
		this._bannerAdUnitIDIndex = -1
		this._bannerAdUnitIDs = []
		this._bannerAdObj = null
		this._preloadBannerAdObj = null
		this._preloadingBannerAd = false
		this._failCountOfCreateBanner = 0
		this._passedTimeFromLastRefresh = 0
		this._bannerOnShow = false
		this._bannerLoadOver = true		// banner是否加载完成

		// video
		this._videoAdUnitIDIndex = -1
		this._videoAdUnitIDs = []
		this._videoAdIns = null;

		// interstitial
		this._interstitialAdUnitIDIndex = -1
		this._interstitialAdUnitIDs = []
		this._interstitialAdObj = null
		this._preloadInterstitialAdObj = null
		this._preloadingInterstitialAd = false
		this._failCountOfCreateInterstitial = 0
	}

	_checkString(str) {
		// body...
		if (typeof str === "string" && str !== "" && str !== "none") {
			return true
		}
		else {
			return false
		}
	}

	_registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs) {
		// body...
		let bOK = true

		if (Array.isArray(bannerAdUnitIDs) && bannerAdUnitIDs.length > 0) {
			// shuffle
			G_Utils.shuffleArray(bannerAdUnitIDs)

			bannerAdUnitIDs.forEach(bannerAdUnitID => {
				if (!this._checkString(bannerAdUnitID)) {
					bOK = false
					console.error("Register Banner Ad Unit ID Fail, Check Input!")
				}
				else {
					this._bannerAdUnitIDs.push(bannerAdUnitID)
				}
			})
		}
		else {
			bOK = false
		}

		if (Array.isArray(videoAdUnitIDs) && videoAdUnitIDs.length === 1) {
			videoAdUnitIDs.forEach(videoAdUnitID => {
				if (!this._checkString(videoAdUnitID)) {
					bOK = false
					console.error("Register Video Ad Unit ID Fail, Check Input!")
				}
				else {
					this._videoAdUnitIDs.push(videoAdUnitID)
				}
			})
		}
		else {
			bOK = false
		}

		if (Array.isArray(interstitialAdUnitIDs)) {
			// shuffle
			G_Utils.shuffleArray(interstitialAdUnitIDs)

			interstitialAdUnitIDs.forEach(interstitialAdUnitID => {
				if (!this._checkString(interstitialAdUnitID)) {
					bOK = false
					console.error("Register Interstitial Ad Unit ID Fail, Check Input!")
				}
				else {
					this._interstitialAdUnitIDs.push(interstitialAdUnitID)
				}
			})
		}
		else {
			bOK = false
		}

		// log
		if (bOK) {
			console.log("Register All Ad Unit IDs Succ!")
		}
		else {
			console.error("Register Ad Unit IDs Fail!")
		}
	}

	init(initedCb) {
		// body...
		if (G_PlatHelper.isWXPlatform() || G_PlatHelper.isQQPlatform()) {
			if (typeof G_PlatHelper.getPlat().h_GetAppFlowAdList === 'function') {
				G_PlatHelper.getPlat().h_GetAppFlowAdList({
					success: res => {
						let bannerAdUnitIDs = []
						let videoAdUnitIDs = []
						let interstitialAdUnitIDs = []

						if (res.Status === 200 && res.Result.List.length > 0) {
							let adList = res.Result.List

							for (let i = 0; i < adList.length; i++) {
								if (adList[i].type === "1") {
									bannerAdUnitIDs.push(adList[i].ad_id)
								}
								else if (adList[i].type === "2") {
									videoAdUnitIDs.push(adList[i].ad_id)
								}
								else if (adList[i].type === "3") {
									interstitialAdUnitIDs.push(adList[i].ad_id)
								}
							}
						}

						this._registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs)

						if (typeof initedCb === "function") {
							initedCb()
						}
					}
				})
			}
			else {
				console.warn('wx(qq).h_GetAppFlowAdList 方法不存在，请检查 qy.js');

				this._registerAdUnitIDs([], [], [])

				if (typeof initedCb === "function") {
					initedCb()
				}
			}
		}
		else {
			this._registerAdUnitIDs([], [], [])

			if (typeof initedCb === "function") {
				initedCb()
			}
		}
	}

	isSupportBannerAd() {
		// body...
		return (this._bannerAdUnitIDs.length > 0)
	}

	_stopSupportBannerAd() {
		// body...
		console.log("stop support banner ad...")

		this._bannerAdUnitIDs = []

		// notify
		G_Event.dispatchEvent(G_EventName.EN_BANNER_NOT_SUPPORT_RIGHT_NOW)
	}

	isSupportVideoAd() {
		// body...
		return (this._videoAdUnitIDs.length > 0)
	}

	_stopSupportVideoAd() {
		// body...
		console.log("stop support video ad...")

		this._videoAdUnitIDs = []

		// notify
		G_Event.dispatchEvent(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW)
	}

	isSupportInterstitialAd() {
		// body...
		return (this._interstitialAdUnitIDs.length > 0)
	}

	_stopSupportInterstitialAd() {
		// body...
		console.log("stop support interstitial ad...")

		this._interstitialAdUnitIDs = []

		// notify
		G_Event.dispatchEvent(G_EventName.EN_INTERSTITIAL_NOT_SUPPORT_RIGHT_NOW)
	}

	preload() {
		// preload banner
		this._preloadBannerAd()

		// preload video
		this._preloadVideoAd()

		// preload interstitial
		this._preloadInterstitialAd()
	}

	/**
	 * 创建自动刷新banner广告 同一时间只能操作一个，创建完后默认隐藏，需要主动显示，c创建新banner广告时，会主动释放旧的banner广告（若存在）
	 * @param {Function} gap 刷新间隔
	 * @param {Object} style 布局样式
	 * @param {Number} style.centerX 广告中间相对于屏幕中间的偏移量，与left和right属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.left 广告左边相对于屏幕左边的偏移量，与centerX和right属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.right 广告右边相对于屏幕右边的偏移量，与left和centerX属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.centerY 广告中间相对于屏幕中间的偏移量，与top和bottom属性互斥，优先顺序centerY, top, bottom
	 * @param {Number} style.top 广告上边相对于屏幕上边的偏移量，与centerY和bottom属性互斥，优先顺序centerY, top, bottom
	 * @param {Number} style.bottom 广告下边相对于屏幕下边的偏移量，与top和centerY属性互斥，优先顺序centerY, top, bottom
	 * @param {Function} errCb 错误回调
	 * @param {Function} loadCb 加载完成回调
	 * 
	 */
	createAutoRefreshBannerAdv(gap, style, errCb, loadCb) {
		let doRefreshBannerAdv = function () {
			// create
			this.createBannerAdv(style, function () {
				G_Scheduler.unschedule("Schedule_Of_Auto_Refresh_Banner")
				this._handlerFun(errCb)
			}.bind(this), loadCb)
		}.bind(this)

		let autoCreateAdFun = function() {
			// body...
			this._passedTimeFromLastRefresh += 1

			if (this._passedTimeFromLastRefresh >= gap && !this.isWatchingVideoAdv() && this._bannerOnShow) {
				this._passedTimeFromLastRefresh = 0
				doRefreshBannerAdv()
			}
		}.bind(this)

		G_Scheduler.schedule("Schedule_Of_Auto_Refresh_Banner", function () {
			// body...
			autoCreateAdFun()
		}.bind(this), false, 1000)

		// first
		this._passedTimeFromLastRefresh = 0
		doRefreshBannerAdv()
	}

	/**
	 * 销毁自动刷新banner广告
	 * 
	 */
	destoryAutoRefreshBannerAdv() {
		this.destroyBannerAdv()
		G_Scheduler.unschedule("Schedule_Of_Auto_Refresh_Banner");
	}

	/**
	 * 创建banner广告 同一时间只能操作一个，创建完后默认隐藏，需要主动显示，c创建新banner广告时，会主动释放旧的banner广告（若存在）
	 * @param {Object} style 布局样式
	 * @param {Number} style.centerX 广告中间相对于屏幕中间的偏移量，与left和right属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.left 广告左边相对于屏幕左边的偏移量，与centerX和right属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.right 广告右边相对于屏幕右边的偏移量，与left和centerX属性互斥，优先顺序centerX, left, right
	 * @param {Number} style.centerY 广告中间相对于屏幕中间的偏移量，与top和bottom属性互斥，优先顺序centerY, top, bottom
	 * @param {Number} style.top 广告上边相对于屏幕上边的偏移量，与centerY和bottom属性互斥，优先顺序centerY, top, bottom
	 * @param {Number} style.bottom 广告下边相对于屏幕下边的偏移量，与top和centerY属性互斥，优先顺序centerY, top, bottom
	 * @param {Function} errCb 错误回调
	 * @param {Function} loadCb 加载完成回调
	 * 
	 * @returns {Object}
	 */
	createBannerAdv(style, errCb, loadCb) {
		// body...
		if(!this._bannerLoadOver) {
			console.error("banner is creating")
			return;
		}

		console.log("begin load banner")
		this._bannerLoadOver = false

		let ecb = function() {
			this._bannerLoadOver = true
			console.log("create banner fail")

			// cb
			this._handlerFun(errCb)
		}.bind(this)

		let lcb = function(obj) {
			this._bannerLoadOver = true
			console.log("create banner success")

			// cb
			this._handlerFun(loadCb)
		}.bind(this)

		if (!this.isSupportBannerAd()) {
			// notify
			G_Event.dispatchEvent(G_EventName.EN_BANNER_NOT_SUPPORT_RIGHT_NOW)
			ecb()
			return
		}

		// 重置获取失败次数
		this._failCountOfCreateBanner = 0

		// destory old banner obj
		if (this._bannerAdObj) {
			let needDestroyObj = this._bannerAdObj

			//延时销毁之前的旧banner-by:hmok20191231
			G_Scheduler.schedule("Destroy_old_Banner", function () {
				// body...
				console.log("destory old banner...")

				if(needDestroyObj){
					needDestroyObj.destroy()
				}
			}.bind(this), false, 60, 0);

			this._bannerAdObj = null
		}

		// get banner ad obj
		this._bannerAdObj = this._getBannerAdObj(style, ecb, function(obj) {
			if (!this._bannerOnShow) {
				this._hideBannerAdv()
			}

			if (obj) {
				lcb()
			} else {
				ecb()
			}
		}.bind(this))

		// keep show or hide
		if (this._bannerOnShow) {
			this._showBannerAdv()
		}
	}

	// 内部接口
	_getBannerAdObj(style, errCb, loadCb) {
		let bannerAdObj = null

		let doPreloadBannerAdObj = function () {
			this._preloadingBannerAd = true

			G_Scheduler.schedule("Delay_Preload_Banner", function () {
				// body...
				console.log("Delay preload next banner...");
				this._preloadBannerAd(() => {
					this._preloadingBannerAd = false
					console.log("Delay preload create banner success");
				}, () => {
					this._preloadingBannerAd = false
					console.log("Delay preload create banner fail")
				});

			}.bind(this), false, 30, 0);
		}.bind(this)

		if (this._preloadBannerAdObj != null) {
			bannerAdObj = this._preloadBannerAdObj;
			this._preloadBannerAdObj = null;
			
			// auto preload next banner
			doPreloadBannerAdObj()
		}
		else {
			if (!this._preloadingBannerAd) {
				// auto preload next banner
				doPreloadBannerAdObj()
			}
		}

		if (!bannerAdObj) {
			bannerAdObj = this._doCreateBannerAdObj(this._convertToPlatformStyle(style), loadCb, errCb)
		}
		else if (style) {
			console.log("use preloaded banner obj...")

			let platformStyle = this._convertToPlatformStyle(style)
			bannerAdObj.style.left = platformStyle.left
			bannerAdObj.style.top = platformStyle.top
			bannerAdObj.style.width = platformStyle.width
			loadCb(bannerAdObj);
		}
		
		return bannerAdObj
	}

	// 内部接口
	_preloadBannerAd( loadCb, errCb) {
		// body...
		if (!this.isSupportBannerAd()) {
			this._handlerFun(errCb)
			return
		}

		if (this._preloadBannerAdObj === null) {
			this._doCreateBannerAdObj(null, bannerAdObj => {
				console.log("preload banner finished...")

				this._preloadBannerAdObj = bannerAdObj

				if (typeof loadCb === "function") {
					loadCb(bannerAdObj)
				}
			}, errCb);
		}
		else {
			if (typeof loadCb === "function") {
				loadCb(this._preloadBannerAdObj)
			}
		}
	}

	// 内部接口
	_doCreateBannerAdObj(platformStyle, loadCb, errCb) {
		if (!platformStyle) {
			platformStyle = this._getDefaultPlatformStyle()
		}

		this._bannerAdUnitIDIndex += 1

		if (this._bannerAdUnitIDIndex >= this._bannerAdUnitIDs.length) {
			this._bannerAdUnitIDIndex = 0
		}

		let bannerAdObj = G_PlatHelper.getPlat().createBannerAd({
			adUnitId: this._bannerAdUnitIDs[this._bannerAdUnitIDIndex],
			style: platformStyle
		})

		if (typeof loadCb === "function") {
			bannerAdObj.loadCb = loadCb
		}

		if (typeof errCb === "function") {
			bannerAdObj.errCb = errCb
		}

		var self = this

		bannerAdObj.onLoad(function () {
			// callback
			let _loadCb = bannerAdObj.loadCb
			bannerAdObj.loadCb = undefined
			
			if (_loadCb) {
				_loadCb(bannerAdObj)
			}
		})

		bannerAdObj.onError(function ( err ) {
			// body...
			console.log("show banner fail...")

			let _errCb = null

			// destory
			if (bannerAdObj) {
				// destroy
				//bannerAdObj.destroy()

				// record
				_errCb = bannerAdObj.errCb

				// reset null
				bannerAdObj = null
			}

			// record
			self._failCountOfCreateBanner += 1

			// recreate banner
			if (self._failCountOfCreateBanner >= G_MaxTimesOfCreateBanner) {
				// stop support banner
				//self._stopSupportBannerAd()

				// callback
				if (_errCb) {
					_errCb()
				}
			}
			else {
				G_Scheduler.schedule("Delay_Recreate_Banner", function () {
					// body...
					console.log("retry preload banner...")

					self._doCreateBannerAdObj(platformStyle, loadCb, errCb)
				}, false, 200, 0)
			}
		})

		return bannerAdObj
	}

	showBannerAdv() {
		if (!this._bannerOnShow) {
			this._bannerOnShow = true

			// show
			this._showBannerAdv()
		}
	}

	_showBannerAdv() {
		// body...
		if (this._bannerAdObj) {
			this._bannerAdObj.show()
		}
	}

	hideBannerAdv() {
		if (this._bannerOnShow) {
			this._bannerOnShow = false

			// hide
			this._hideBannerAdv()
		}
	}

	_hideBannerAdv() {
		// body...
		if (this._bannerAdObj) {
			this._bannerAdObj.hide()
		}
	}

	destroyBannerAdv() {
		// body...
		if (this._bannerAdObj) {
			this._bannerAdObj.destroy()
			this._bannerAdObj = null
		}
	}

	/**
	 * 创建激励视频广告
	 * @param {Function} closeCb 关闭回调
	 * @param {Function} errCb 错误回调
	 * 
	 * @returns {Object}
	 */
	createVideoAdv(closeCb, errCb) {
		// body...
		if (!this.isSupportVideoAd()) {
			// notify
			G_Event.dispatchEvent(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW)

			if (typeof errCb === "function") {
				errCb()
			}
			return
		}

		// windows平台
		if (!G_PlatHelper.getPlat()) {
			if (typeof closeCb === "function") {
				closeCb(true)
			}
			return
		}

		if (typeof errCb === "undefined") {
			errCb = null
		}

		if (this._videoAdIns !== null) {
			var self = this

			if (typeof closeCb === "function") {
				this._videoAdIns.closeCb = closeCb
			}

			if (typeof errCb === "function") {
				this._videoAdIns.errCb = errCb
			}

			// show
			this._videoAdIns.show().catch(() => {
				// fail then try again
				  this._videoAdIns.load()
					.then(() => this._videoAdIns.show())
					.catch(err => {
						console.log("show videoAd fail...")

						// stop support video
						self._stopSupportVideoAd()

						if (this._videoAdIns) {
							let _errCb = this._videoAdIns.errCb

							if (_errCb) {
								_errCb()
							}

							// reset null
							this._videoAdIns = null
						}
					})
			})
		}
		else {
			// stop support video
			this._stopSupportVideoAd()

			if (typeof errCb === "function") {
				errCb()
			}
		}
	}

	_preloadVideoAd( errCb ) {
		if (!this.isSupportVideoAd()) {
			this._handlerFun(errCb)
			return
		}

		if (this._videoAdIns === null) {
			this._videoAdIns = this._doCreateVideoAdObj(function () {
				console.log("preload video finished...")
			})
		}

		// no need manual load
		// this._videoAdIns.load()
	}

	// 内部接口
	_doCreateVideoAdObj( loadCb ) {
		// body...
		if (this._videoAdIns) {
			return this._videoAdIns
		}

		this._videoAdUnitIDIndex += 1

		if (this._videoAdUnitIDIndex >= this._videoAdUnitIDs.length) {
			this._videoAdUnitIDIndex = 0
		}

		this._videoAdIns = G_PlatHelper.getPlat().createRewardedVideoAd({
			adUnitId: this._videoAdUnitIDs[this._videoAdUnitIDIndex]
		})

		if (this._videoAdIns) {
			var self = this

			this._videoAdIns.onLoad(function () {
				if (typeof loadCb === "function") {
					loadCb()
				}
			})

			this._videoAdIns.onClose(function (result) {
				// body...
				if (result && result.isEnded) {
					G_PlayerInfo.plusTodayAdvimes()
				}
				else if (!result) {
					G_PlayerInfo.plusTodayAdvimes()
				}

				if (self._videoAdIns) {
					let _closeCb = self._videoAdIns.closeCb
					let _errCb = self._videoAdIns.errCb

						// reset
						self._videoAdIns.closeCb = null
						self._videoAdIns.errCb = null

					if (!result || result.isEnded) {
						if (_closeCb) {
							_closeCb(true)
						}
					}
					else {
						G_Switch.isPublishing(function ( isPublishing ) {
							// body...
							if (isPublishing) {
								// show watch video fail tips
								G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_FAIL"]).word)

								if (_closeCb) {
									_closeCb(false)
								}
							}
							else {
								self._showConfirm(_closeCb, _errCb)
							}
						})
					}

					// preload
					self._preloadVideoAd()
				}
			})

			this._videoAdIns.onError(function (result) {
				// body...
				console.log("show videoAd fail...")

				// stop support video
				self._stopSupportVideoAd()

				if (self._videoAdIns) {
					let _errCb = self._videoAdIns.errCb

					if (_errCb) {
						_errCb()
					}

					// reset null
					self._videoAdIns = null
				}
			})
		}

		return this._videoAdIns
	}

	_showConfirm( closeCb, errCb ) {
		// body...
		var self = this

		G_PlatHelper.showModal(
			null,
			G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_NOT_FINISH_CONTENT"]).word,
			true,
			function ( bOK ) {
				// body...
				if (bOK) {
					// rewatch adv
					self.createVideoAdv(closeCb, errCb)
				}
				else {
					if (typeof closeCb === "function") {
						closeCb(false)
					}
				}
			}, {
				confirmText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_NOT_FINISH_CONFIRM_TEXT"]).word, 
				cancelText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_NOT_FINISH_CANCEL_TEXT"]).word
			}
		)
	}

	isWatchingVideoAdv() {
		// body...
		if (this._videoAdIns && this._videoAdIns.closeCb) {
			return true
		}
		else {
			return false
		}
	}

	/**
	 * 创建插屏广告 同一时间只能操作一个，创建完后默认隐藏，需要主动显示，创建新插屏广告时，会主动释放旧的插屏广告（若存在）
	 * @param {Function} closeCb 关闭回调
	 * @param {Function} loadCb 加载完成回调
	 * @param {Function} errCb 错误回调
	 */
	createInterstitialAdv(closeCb, loadCb, errCb) {
		// body...
		if (!this.isSupportInterstitialAd()) {
			// notify
			G_Event.dispatchEvent(G_EventName.EN_INTERSTITIAL_NOT_SUPPORT_RIGHT_NOW)
			this._handlerFun(errCb)
			return
		}

		// 重置获取失败次数
		this._failCountOfCreateInterstitial = 0

		// destory old interstitial obj
		if (this._interstitialAdObj) {
			let needDestroyObj = this._interstitialAdObj

			G_Scheduler.schedule("Destroy_old_Interstitial", function () {
				// body...
				console.log("destory old interstitial...")

				if(needDestroyObj){
					needDestroyObj.destroy()
				}
			}.bind(this), false, 60, 0);

			this._interstitialAdObj = null
		}

		// get interstitial ad obj
		this._getInterstitialAdObj(closeCb, function(obj) {
			if (obj) {
				this._handlerFun(loadCb)
			} else {
				this._handlerFun(errCb)
			}
		}.bind(this), errCb)
	}

	// 内部接口
	_getInterstitialAdObj(closeCb, loadCb, errCb) {
		let interstitialAdObj = null

		let doPreloadInterstitialAdObj = function () {
			this._preloadingInterstitialAd = true

			G_Scheduler.schedule("Delay_Preload_Interstitial", function () {
				// body...
				console.log("Delay preload next interstitial...");
				this._preloadInterstitialAd(() => {
					this._preloadingInterstitialAd = false
					console.log("Delay preload create interstitial success");
				}, () => {
					this._preloadingInterstitialAd = false
					console.log("Delay preload create interstitial fail")
				});

			}.bind(this), false, 30, 0);
		}.bind(this)

		if (this._preloadInterstitialAdObj != null) {
			interstitialAdObj = this._preloadInterstitialAdObj;
			this._preloadInterstitialAdObj = null;
			
			// auto preload next interstitial
			doPreloadInterstitialAdObj()
		}
		else {
			if (!this._preloadingInterstitialAd) {
				// auto preload next interstitial
				doPreloadInterstitialAdObj()
			}
		}

		if (!interstitialAdObj) {
			this._interstitialAdObj = this._doCreateInterstitialAdObj(closeCb, loadCb, errCb)
		}
		else {
			if (typeof closeCb === "function") {
				interstitialAdObj.closeCb = closeCb
			}
			// save
			this._interstitialAdObj = interstitialAdObj

			// load cb
			loadCb(interstitialAdObj)
		}
	}

	// 内部接口
	_preloadInterstitialAd(loadCb, errCb) {
		// body...
		if (!this.isSupportInterstitialAd()) {
			this._handlerFun(errCb)
			return
		}

		if (this._preloadInterstitialAdObj === null) {
			this._doCreateInterstitialAdObj(null, interstitialAdObj => {
				console.log("preload interstitial finished...")

				this._preloadInterstitialAdObj = interstitialAdObj

				if (typeof loadCb === "function") {
					loadCb(interstitialAdObj)
				}
			}, errCb);
		}
		else {
			if (typeof loadCb === "function") {
				loadCb(this._preloadInterstitialAdObj)
			}
		}
	}

	// 内部接口
	_doCreateInterstitialAdObj(closeCb, loadCb, errCb) {
		if (!G_PlatHelper.getPlat().createInterstitialAd) {
			this._handlerFun(errCb)
			this._stopSupportInterstitialAd()
			return
		}

		this._interstitialAdUnitIDIndex += 1

		if (this._interstitialAdUnitIDIndex >= this._interstitialAdUnitIDs.length) {
			this._interstitialAdUnitIDIndex = 0
		}

		let interstitialAdObj = G_PlatHelper.getPlat().createInterstitialAd({
			adUnitId: this._interstitialAdUnitIDs[this._interstitialAdUnitIDIndex]
		})

		if (typeof closeCb === "function") {
			interstitialAdObj.closeCb = closeCb
		}

		if (typeof loadCb === "function") {
			interstitialAdObj.loadCb = loadCb
		}

		if (typeof errCb === "function") {
			interstitialAdObj.errCb = errCb
		}

		var self = this

		interstitialAdObj.onClose(function () {
			// callback
			let _closeCb = interstitialAdObj.closeCb
			interstitialAdObj.closeCb = undefined
			
			if (_closeCb) {
				_closeCb()
			}
		})

		interstitialAdObj.onLoad(function () {
			// callback
			let _loadCb = interstitialAdObj.loadCb
			interstitialAdObj.loadCb = undefined
			
			if (_loadCb) {
				_loadCb(interstitialAdObj)
			}
		})

		interstitialAdObj.onError(function ( err ) {
			// body...
			console.log("show interstitial fail...")

			let _errCb = null

			// destory
			if (interstitialAdObj) {
				// destroy
				//interstitialAdObj.destroy()

				// record
				_errCb = interstitialAdObj.errCb

				// reset null
				interstitialAdObj = null
			}

			// record
			self._failCountOfCreateInterstitial += 1

			// recreate interstitial
			if (self._failCountOfCreateInterstitial >= G_MaxTimesOfCreateInterstitial) {
				// stop support interstitial
				//self._stopSupportInterstitialAd()

				// callback
				if (_errCb) {
					_errCb()
				}
			}
			else {
				G_Scheduler.schedule("Delay_Recreate_Interstitial", function () {
					// body...
					console.log("retry preload interstitial...")

					self._doCreateInterstitialAdObj(closeCb, loadCb, errCb)
				}, false, 200, 0)
			}
		})

		return interstitialAdObj
	}

	showInterstitialAdv() {
		// body...
		if (this._interstitialAdObj) {
			this._interstitialAdObj.show().catch((err) => {
				console.error(err)
			})
		}
	}

	_convertToPlatformStyle( style ) {
		// body...
		let platformStyle = this._getDefaultPlatformStyle()

		if ( style ) {
			let sysInfo = G_PlatHelper.getSysInfo();
			this._fixedStyle(style)

			// width
			platformStyle.width = style.width

			// real width
			let realWidth = this._caculateRealWidth(style.width)

			// left
			if (typeof style.centerX === "number") {
				platformStyle.left = (sysInfo.screenWidth - realWidth) / 2 + style.centerX
			}
			else if (typeof style.left === "number") {
				platformStyle.left = style.left
			}
			else if (typeof style.right === "number") {
				platformStyle.left = sysInfo.screenWidth - realWidth - style.right
			}

			// top
			let bannerHeight = this._getBannerOriginalSize().height / this._getBannerOriginalSize().width * realWidth
			let bottom = style.bottom
			if (G_PlatHelper.isIPhoneX()) {
				if (typeof bottom === "number") {
					if (G_PlatHelper.isQQPlatform() && bottom < 20) {
						// at least 20
						bottom = 20
					}
					else if (bottom < 40) {
						// at least 40
						bottom = 40
					}
				}
			}
			if (typeof style.centerY === "number") {
				platformStyle.top = (sysInfo.screenHeight - bannerHeight) / 2 + style.centerY
			}
			else if (typeof style.top === "number") {
				platformStyle.top = style.top
			}
			else if (typeof bottom === "number") {
				platformStyle.top = sysInfo.screenHeight - bannerHeight - bottom
			}
		}

		return platformStyle
	}

	_getDefaultPlatformStyle() {
		return {}
	}

	_caculateRealWidth( bannerWidth ) {
		return bannerWidth
	}

	_fixedStyle( style ) {
		// body...
	}

	_getBannerOriginalSize() {
		return {
			width: 960,
			height: 334
		}
	}

	_handlerFun(fun){
		if (typeof fun === "function") {
			fun()
		}
	}
}
