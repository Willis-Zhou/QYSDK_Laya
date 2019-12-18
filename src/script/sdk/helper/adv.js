var G_BannerSize = {
	width: 960,
	height: 334
}

// QQ
if (typeof window.qq !== "undefined") {
	G_BannerSize = {
		width: 960,
		height: 233
	}
}

var G_MaxTimesOfCreateBanner = 3;
	
var _Adv = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Adv Instance...")

		// banner
		var _bannerAdUnitIDIndex = -1
		var _bannerAdUnitIDs = []
		var _bannerAdObj = null
		var _preloadBannerAdObj = null
		var _failCountOfCreateBanner = 0
		var _passedTimeFromLastRefresh = 0

		// video
		var _videoAdUnitIDIndex = -1
		var _videoAdUnitIDs = []
		var _videoAdIns = null;
		var _bannerOnShow = false; //banner是否显示
		var _bannerLoadOver = true;
		var _getBannerFail = false;
		
		var _checkString = function (str) {
			// body...
			if (typeof str === "string" && str !== "" && str !== "none") {
				return true
			}
			else {
				return false
			}
		}

		var _registerAdUnitIDs = function (bannerAdUnitIDs, videoAdUnitIDs) {
			// body...
			if (Array.isArray(bannerAdUnitIDs)) {
				bannerAdUnitIDs.forEach(bannerAdUnitID => {
					if (!_checkString(bannerAdUnitID)) {
						console.error("Register Banner Ad Unit ID Fail, Check Input!")
					}
					else {
						_bannerAdUnitIDs.push(bannerAdUnitID)
					}
				})
			}

			if (Array.isArray(videoAdUnitIDs) && videoAdUnitIDs.length === 1) {
				videoAdUnitIDs.forEach(videoAdUnitID => {
					if (!_checkString(videoAdUnitID)) {
						console.error("Register Video Ad Unit ID Fail, Check Input!")
					}
					else {
						_videoAdUnitIDs.push(videoAdUnitID)
					}
				})
			}

			// log
			console.log("Register All Ad Unit IDs Succ!")
		}

		return {
			init: function (initedCb) {
				// body...
				if (window.wx && typeof wx.h_GetAppFlowAdList === 'function') {
					var self = this

					wx.h_GetAppFlowAdList({
                        success: function (res) {
							let bannerAdUnitIDs = []
							let videoAdUnitIDs = []

							if (res.Status === 200 && res.Result.List.length > 0) {
								let adList = res.Result.List

								for (let i = 0; i < adList.length; i++) {
									if (adList[i].type === "1") {
										bannerAdUnitIDs.push(adList[i].ad_id)
									}
									else if (adList[i].type === "2") {
										videoAdUnitIDs.push(adList[i].ad_id)
									}
								}
							}

							if (bannerAdUnitIDs.length === 0) {
								if (G_WXHelper.isQQPlatform()) {
									bannerAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_BANNER_AD_UNIT_IDS"]).str.split("||")
								}
								else {
									bannerAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_BANNER_AD_UNIT_IDS"]).str.split("||")
								}
							}

							if (videoAdUnitIDs.length === 0) {
								if (G_WXHelper.isQQPlatform()) {
									videoAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_VIDEO_AD_UNIT_IDS"]).str.split("||")
								}
								else {
									videoAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_VIDEO_AD_UNIT_IDS"]).str.split("||")
								}
							}

							// shuffle
							G_Utils.shuffleArray(bannerAdUnitIDs)
							G_Utils.shuffleArray(videoAdUnitIDs)

							_registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs)

							if (typeof initedCb === "function") {
								initedCb()
							}
                        }
                    })
				}
				else {
					console.warn('wx.h_GetAppFlowAdList 方法不存在，请检查 qy.js');

					if (typeof initedCb === "function") {
						initedCb()
					}
				}
			},

			isSupportBannerAd: function () {
				// body...
				return (_bannerAdUnitIDs.length > 0)
			},

			_stopSupportBannerAd: function () {
				// body...
				console.log("stop support banner ad...")

				_bannerAdUnitIDs = []

				// notify
				G_Event.dispatchEvent(G_EventName.EN_BANNER_NOT_SUPPORT_RIGHT_NOW)
			},

			isSupportVideoAd: function () {
				// body...
				return (_videoAdUnitIDs.length > 0)
			},

			_stopSupportVideoAd: function () {
				// body...
				console.log("stop support video ad...")

				_videoAdUnitIDs = []

				// notify
				G_Event.dispatchEvent(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW)
			},

			preload: function () {
				if (window.wx) {
					// preload banner
					this._preloadBannerAd()

					// preload video
					this._preloadVideoAd()
				}
			},

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
			createAutoRefreshBannerAdv: function (gap, style, errCb, loadCb) {
				let doRefreshBannerAdv = function () {
					// create
					G_Adv.createBannerAdv(style, errCb, loadCb)
				}

				let autoCreateAdFun = function() {
					if(_getBannerFail&&_bannerAdObj){
						_bannerAdObj.reTry();
						_passedTimeFromLastRefresh=0;
					}

					// body...
					_passedTimeFromLastRefresh += 1
	
					if (_passedTimeFromLastRefresh >= gap && !this.isWatchingVideoAdv() && _bannerOnShow) {
						_passedTimeFromLastRefresh = 0
						doRefreshBannerAdv()
					}
				}.bind(this)

				G_Scheduler.schedule("Schedule_Of_Auto_Refresh_Banner", function () {
					// body...
					autoCreateAdFun()
				}.bind(this), false, 1000)

				// first
				_passedTimeFromLastRefresh = 0
				doRefreshBannerAdv()
			},

			/**
			 * 销毁自动刷新banner广告
			 * 
			 */
			destoryAutoRefreshBannerAdv: function () {
				this.destroyBannerAdv()
				G_Scheduler.unschedule("Schedule_Of_Auto_Refresh_Banner");
				
			},

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
			createBannerAdv: function (style, errCb, loadCb) {
				if(!_bannerLoadOver){
					console.log("banner has create");
					return;
				}

				console.log("begin load banner");
				_bannerLoadOver = false;

				let ecb=function(){
					if (typeof errCb === "function") {
						errCb()
					}
					_bannerLoadOver = true;
					console.log("create banner fail")
				}

				let lcb=function(obj){
					if (typeof loadCb === "function") {
						loadCb()
					}
					_bannerLoadOver = true;
					console.log("create banner success");
				}

				if(!window.wx){
					ecb();
					return;
				}

				// body...
				if (!this.isSupportBannerAd()) {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_BANNER_NOT_SUPPORT_RIGHT_NOW)
					ecb();
					return
				}

				// 重置获取失败次数
				_failCountOfCreateBanner = 0;

				// destory old banner obj
				if (_bannerAdObj) {
					console.log("destory old banner...")
					
					_bannerAdObj.destroy()
					_bannerAdObj = null
				}

				// get banner ad obj
				_bannerAdObj = this._getBannerAdObj(style, ecb, function(obj) {
					if (!_bannerOnShow) {
						this._hideBannerAdv()
					}

					if (obj) {
						lcb()
					} else {
						ecb()
					}
				}.bind(this))

				// keep show or hide
				if (_bannerOnShow) {
					this._showBannerAdv()
				}
			},

			// 内部接口
			_getBannerAdObj(style, errCb,loadCb) {
				let bannerAdObj = null

				if (_preloadBannerAdObj != null) {
					bannerAdObj = _preloadBannerAdObj
					_preloadBannerAdObj = null

					// auto preload next banner
					this._preloadBannerAd(loadCb, errCb)
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
				}
				
				return bannerAdObj
			},

			handlerFun(fun){
				if (typeof fun === "function") {
					fun()
				}
			},

			// 内部接口
			_preloadBannerAd: function ( loadCb ,errCb) {
				// body...
				if (!this.isSupportBannerAd()) {
					this.handlerFun(errCb)
					return
				}

				if (_preloadBannerAdObj === null) {
					this._doCreateBannerAdObj(null, function ( bannerAdObj ) {
						_preloadBannerAdObj = bannerAdObj

						console.log("preload banner finished...")

						if (typeof loadCb === "function") {
							loadCb(bannerAdObj)
						}
					}, errCb);
				}
				else {
					if (typeof loadCb === "function") {
						loadCb(_preloadBannerAdObj)
					}
				}
			},

			// 内部接口
			_doCreateBannerAdObj(platformStyle, loadCb, errCb) {
				// default platform style
				if (!platformStyle) {
					platformStyle = {
						left: 0,
						top: 0,
						width: 300
					}
				}

				_bannerAdUnitIDIndex += 1

				if (_bannerAdUnitIDIndex >= _bannerAdUnitIDs.length) {
					_bannerAdUnitIDIndex = 0
				}

				let bannerAdObj = wx.createBannerAd({
					adUnitId: _bannerAdUnitIDs[_bannerAdUnitIDIndex],
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
				}),

				// onResize方法在qq平台有bug，放弃不用
				// bannerAdObj.onResize(function(val){
				// 	if(bannerAdObj && bannerAdObj.style.realWidth === bannerAdObj.style.width) {
				// 		//对广告重新调整位置
				// 		let sysInfo = G_WXHelper.getSysInfo();
				// 		let _style = bannerAdObj.style;
				// 		let bt = _style.offsetBottom ? _style.offsetBottom : 0;
				// 		bannerAdObj.style.left = (sysInfo.screenWidth - bannerAdObj.style.realWidth) / 2;
				// 		bannerAdObj.style.top = sysInfo.screenHeight - bannerAdObj.style.realHeight - bt;
				// 	}
				// });

				bannerAdObj.onError(function ( err ) {
					// body...
					console.log("show banner fail...")

					let _errCb = null

					// destory
					if (bannerAdObj) {
						// destroy
						bannerAdObj.destroy()

						// record
						_errCb = bannerAdObj.errCb

						// reset null
						bannerAdObj = null
					}

					// record
					_failCountOfCreateBanner += 1

					// recreate banner
					if (_failCountOfCreateBanner >= G_MaxTimesOfCreateBanner) {
						// stop support banner
						//self._stopSupportBannerAd()
						_getBannerFail=true;
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
						}.bind(this), false, 200, 0)
					}
				})

				bannerAdObj.reTry = function(){
					console.log("reTry load banner");
					_getBannerFail = false;
					_failCountOfCreateBanner = 0;
				}.bind(this);

				return bannerAdObj
			},

			showBannerAdv: function () {
				if (!_bannerOnShow) {
					_bannerOnShow = true

					// show
					this._showBannerAdv()
				}
			},

			_showBannerAdv: function () {
				// body...
				if (_bannerAdObj) {
					_bannerAdObj.show()
				}
			},

			hideBannerAdv: function () {
				if (_bannerOnShow) {
					_bannerOnShow = false

					// hide
					this._hideBannerAdv()
				}
			},

			_hideBannerAdv: function () {
				// body...
				if (_bannerAdObj) {
					_bannerAdObj.hide()
				}
			},

			destroyBannerAdv: function () {
				// body...
				if (_bannerAdObj) {
					_bannerAdObj.destroy()
					_bannerAdObj = null
				}
			},

			/**
			 * 创建激励视频广告
			 * @param {Function} closeCb 关闭回调
			 * @param {Function} errCb 错误回调
			 * 
			 * @returns {Object}
			 */
			createVideoAdv: function (closeCb, errCb) {
				// body...
				if (!this.isSupportVideoAd()) {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW)

					if (typeof errCb === "function") {
						errCb()
					}

					return
				}

				if (typeof errCb === "undefined") {
					errCb = null
				}

				if (_videoAdIns !== null) {
					var self = this

					if (typeof closeCb === "function") {
						_videoAdIns.closeCb = closeCb
					}

					if (typeof errCb === "function") {
						_videoAdIns.errCb = errCb
					}

					// show
					_videoAdIns.show().catch(() => {
						// fail then try again
						  _videoAdIns.load()
							.then(() => _videoAdIns.show())
							.catch(err => {
								console.log("show videoAd fail...")

								// stop support video
								self._stopSupportVideoAd()

								if (_videoAdIns) {
									let _errCb = _videoAdIns.errCb

									if (_errCb) {
										_errCb()
									}

									// reset null
									_videoAdIns = null
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
			},

			_preloadVideoAd: function ( errCb ) {
				if (!this.isSupportVideoAd()) {
					this.handlerFun(errCb)
					return
				}

				if (_videoAdIns === null) {
					_videoAdIns = this._doCreateVideoAdObj(function () {
						console.log("preload video finished...")
					})
				}

				// no need manual load
				// _videoAdIns.load()
			},

			// 内部接口
			_doCreateVideoAdObj( loadCb ) {
				// body...
				if (_videoAdIns) {
					return _videoAdIns
				}

				_videoAdUnitIDIndex += 1

				if (_videoAdUnitIDIndex >= _videoAdUnitIDs.length) {
					_videoAdUnitIDIndex = 0
				}

				_videoAdIns = window.wx.createRewardedVideoAd({
					adUnitId: _videoAdUnitIDs[_videoAdUnitIDIndex]
				})

				if (_videoAdIns) {
					var self = this

					_videoAdIns.onLoad(function () {
						if (typeof loadCb === "function") {
							loadCb()
						}
					})

					_videoAdIns.onClose(function (result) {
						// body...
						if (result && result.isEnded) {
							G_PlayerInfo.plusTodayAdvimes()
						}
						else if (!result) {
							G_PlayerInfo.plusTodayAdvimes()
						}

						if (_videoAdIns) {
							let _closeCb = _videoAdIns.closeCb
							let _errCb = _videoAdIns.errCb

								// reset
								_videoAdIns.closeCb = null
								_videoAdIns.errCb = null

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
										G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_FAIL"]).word)

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

					_videoAdIns.onError(function (result) {
						// body...
						console.log("show videoAd fail...")

						// stop support video
						self._stopSupportVideoAd()

						if (_videoAdIns) {
							let _errCb = _videoAdIns.errCb

							if (_errCb) {
								_errCb()
							}

							// reset null
							_videoAdIns = null
						}
					})
				}

				return _videoAdIns
			},

			_showConfirm: function ( closeCb, errCb ) {
				// body...
				var self = this

				G_WXHelper.showModal(
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
			},

			isWatchingVideoAdv: function () {
				// body...
				if (_videoAdIns && _videoAdIns.closeCb) {
					return true
				}
				else {
					return false
				}
			},

			_convertToPlatformStyle: function ( style ) {
				// body...
				let platformStyle = {
					left: 0,
					top: 0,
					width: 300
				}

				if ( style ) {
					let sysInfo = G_WXHelper.getSysInfo();
					this._fixedStyle(style)

					// width
					platformStyle.width = style.width

					// left
					if (typeof style.centerX === "number") {
						platformStyle.left = (sysInfo.screenWidth - style.width) / 2 + style.centerX
					}
					else if (typeof style.left === "number") {
						platformStyle.left = style.left
					}
					else if (typeof style.right === "number") {
						platformStyle.left = sysInfo.screenWidth - style.width - style.right
					}

					// top
					let bannerHeight = G_BannerSize.height / G_BannerSize.width * style.width
					let bottom = style.bottom
					if (G_WXHelper.isIPhoneX()) {
						if (typeof bottom === "number") {
							if (G_WXHelper.isQQPlatform() && bottom < 20) {
								// at least 20
								bottom = 20
							}
							else {
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
			},

			_fixedStyle: function ( style ) {
				// body...
				if (style) {
					if (typeof style.width !== "number") {
						// default
						style.width = 300
					}

					if (style.width < 300) {
						// at least 300
						style.width = 300
					}
				}
				
			}
		};
	};

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
}();

// export
export {_Adv}
