var _Share = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_Share Instance...')

		// all remote configs
		var _cfgs = {}
		var _initedCbs = {}
		var _inited = false

		var _shareFailTips = null
		var _sharingSceneInfo = null
		var _minDurationBetweenShare = 3000

		var _init = function () {
			// body...
			if (_inited) {
				return
			}
			_inited = true

			G_Switch.getMinDurationBetweenShare(function ( duration ) {
				// body...
				_minDurationBetweenShare = duration
			})

			G_Event.addEventListerner(G_EventName.EN_APP_AFTER_ONSHOW, function () {
				// body...
				// only schedule once
				G_Scheduler.schedule("Auto_Share_Callback", function () {
		            // body...
					console.log("Auto_Share_Callback")

		            if (_sharingSceneInfo) {
						let bSucc = _checkShareResult(_sharingSceneInfo)

						if (typeof _sharingSceneInfo.cb === "function") {
							_sharingSceneInfo.cb(bSucc)
						}

						if (!bSucc && _sharingSceneInfo.showFailTips) {
							G_WXHelper.showRandomToast(_getShareFailTips())
						}

						_sharingSceneInfo = null
					}
		        }, false, 10, 0)
			})

			if (window.wx) {
				let registerOnShareFunc = function (onShareFunc) {
					if (onShareFunc) {
						if (window.wx.showShareMenu) {
							window.wx.showShareMenu({
								// body...
								withShareTicket: true
							})
						}

						onShareFunc(function (info) {
							// body...
							let cfg = _getDoShareCfg(_getShareInfo(G_ShareScene.SS_SYSTEM_MENU))
	
							if (cfg) {
								return _makeAndSaveShareInfo(G_ShareScene.SS_SYSTEM_MENU, cfg, null, false, null)
							}
							else {
								return {}
							}
						})
					}
				}

				G_SDKCfg.isAldReportEnabled(function (isEnabled) {
					if (isEnabled) {
						registerOnShareFunc(window.wx.aldOnShareAppMessage)
					}
					else {
						G_SDKCfg.isQyReportEnabled(function (isEnabled) {
							if (isEnabled) {
								registerOnShareFunc(window.wx.h_OnShareAppMessage)
							}
							else {
								registerOnShareFunc(window.wx.onShareAppMessage)
							}
						})
					}
				})
			}
		};

		var _add = function ( cfgs ) {
			// body...
			if (cfgs) {
				for (let key in cfgs) {
					_cfgs[key] = cfgs[key]
				}
			}
		}

		var _getShareInfo = function ( _scene_name ) {
			// body...
			if (!_cfgs || !_cfgs[_scene_name]) {
				return null
			}

			return _cfgs[_scene_name]
		};

		var _getDoShareCfg = function ( _shareInfo ) {
			// body...
			if (!_shareInfo || !_shareInfo.cfgs) {
				return null
			}

			let cfgs = _shareInfo.cfgs
			let all_weights = 0

			for (let i = 0; i < cfgs.length; i++) {
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
		};

		var _doShare = function (_scene_name, _customQueryObj, _showFailTips, _cb) {
			// body...
			let cfg = _getDoShareCfg(_getShareInfo(_scene_name))

			if (cfg) {
				if(window.wx) {
					let shareFunc = null

					if (G_SDKCfg.isAldReportEnabledSync()) {
						shareFunc = window.wx.aldShareAppMessage
					}
					else if (G_SDKCfg.isQyReportEnabledSync()) {
						shareFunc = window.wx.h_ShareAppMessage
					}
					else {
						shareFunc = window.wx.shareAppMessage
					}

					if (shareFunc) {
						shareFunc(_makeAndSaveShareInfo(_scene_name, cfg, _customQueryObj, _showFailTips, _cb))
					}
		        }
		        else {
		        	if (typeof _cb === "function") {
						_cb(false)
					}
		        }
			}
			else {
				if (typeof _cb === "function") {
					_cb(false)
				}
			}
		};

		var _makeAndSaveShareInfo =  function ( _scene_name, _cfg, _customQueryObj, _showFailTips, _cb ) {
			// body...
			_sharingSceneInfo = null

			if (_cfg) {
				_sharingSceneInfo = {
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

				return {
					title: _cfg.title,
					imageUrl: _cfg.img_url,
					query: queryStr,
					success: function () {
						// body...
						console.log("share success!!!")

						if (_sharingSceneInfo) {
							let bSucc = _checkShareResult(_sharingSceneInfo)

							if (!bSucc && _sharingSceneInfo.showFailTips) {
								G_WXHelper.showRandomToast(_getShareFailTips())
							}
							
							if (typeof _sharingSceneInfo.cb === "function") {
								_sharingSceneInfo.cb(bSucc)
							}

							_sharingSceneInfo = null
						}
					},
					fail: function () {
						// body...
						console.log("share fail!!!")

						if (_sharingSceneInfo) {
							if (_sharingSceneInfo.showFailTips) {
								G_WXHelper.showRandomToast(_getShareFailTips())
							}

							if (typeof _sharingSceneInfo.cb === "function") {
								_sharingSceneInfo.cb(false)
							}

							_sharingSceneInfo = null
						}
					}
				}
			}
			else {
				return {}
			}
		};

		var _checkShareResult = function ( sharingInfo ) {
			// body...
			if (sharingInfo) {
				if ((new Date().getTime() - sharingInfo.startTime) >= _minDurationBetweenShare) {
					if (sharingInfo.scene !== G_ShareScene.SS_SYSTEM_MENU) {
						// 除来自系统菜单的分享，则增加有效分享次数
						G_PlayerInfo.plusTodayShareTimes()

						if (sharingInfo.scene !== G_ShareScene.SS_CUSTOMER_SERVER
							&& sharingInfo.scene !== G_ShareScene.SS_INVITE) {
							G_PlayerInfo.plusTodayAdvimes()
						}
					}

					return true
				}
			}
			
			return false
		};

		var _getShareFailTips = function () {
			// body...
			if (!_shareFailTips) {
				_shareFailTips = []
				_shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_ONE"]).word)
				_shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_TWO"]).word)
				_shareFailTips.push(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SHARE_FAIL_TIPS_THREE"]).word)
			}

			return _shareFailTips
		}

		return {
			init: function () {
				// body...
				_init()
			},

			addCfgs: function ( cfgs ) {
				// body...
				_add(cfgs)
			},

			// 初始化完成
			inited: function () {
				// body...
				for (let key in _initedCbs) {
					_doShare(key, _initedCbs[key].customQueryObj, _initedCbs[key].showFailTips, _initedCbs[key].cb)
				}

				_initedCbs = {}
			},

			canShare: function () {
				// body...
				return (_cfgs !== null)
			},

			isSharing: function () {
				// body...
				return (_sharingSceneInfo !== null)
			},

			// showFailTips 默认为true
			share: function (scene_name, customQueryObj, showFailTips, cb) {
				// body...
				if (!scene_name || scene_name === "") {
					if (typeof cb === "function") {
						cb(false)
					}
				}

				if (typeof showFailTips === "undefined" || showFailTips === null) {
					showFailTips = true
				}

				if (window.wx) {
					if (!this.canShare()) {
						_initedCbs[scene_name] = {
							customQueryObj: customQueryObj,
							showFailTips: showFailTips,
							cb: cb
						}
					}
					else {
						_doShare(scene_name, customQueryObj, showFailTips, cb)
					}
				}
				else {
					if (typeof cb === "function") {
						cb(true)
					}
				}
			},

			getShareInfo: function ( scene_name ) {
				// body...
				return _getShareInfo(scene_name)
			},

			getDoShareCfg: function ( shareInfo ) {
				// body...
				return _getDoShareCfg(shareInfo)
			}
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
})();

// export
export {_Share}