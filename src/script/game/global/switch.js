/*
* 全局开关
*/
var _Switch = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Switch Instance...")

		// const
		var _cfgs = null
		var _initedCbs = {}
		var _isAdvStateNormal = null
		var _isExportAdvEnabled = null

		var __add = function ( key, value ) {
			// body...
			if (!_cfgs) {
				_cfgs = {}
			}

			if (typeof _cfgs[key] !== "undefined") {
				console.error("G_Switch.addCfg: key: {0} has registered before...".format(key))
				return
			}

			_cfgs[key] = value
		}

		var _add = function ( cfgs ) {
			// body...
			if (cfgs) {
				for (let key in cfgs) {
					__add(key, cfgs[key])
				}
			}
		}

		var _getCfgByKey = function (key, cb) {
			// body...
			if (typeof cb !== "function") {
				return
			}

			if (!_checkString(key)) {
				cb(false, "")
			}

			if (_cfgs) {
				if (typeof _cfgs[key] !== "undefined") {
					cb(true, _cfgs[key])
				}
				else {
					cb(false, "")
				}
			}
			else {
				_initedCbs[key] = cb
			}
		};

		var _checkString = function (string) {
			// body...
			if (typeof string !== "string" || string === "") {
				return false
			}

			return true
		};

		return {
			addCfgs: function ( cfgs ) {
				// body...
				_add(cfgs)
			},

			addCfg: function ( key, cfg ) {
				// body...
				__add(key, cfg)
			},

			// 初始化完成
			inited: function () {
				// body...
				for (let key in _initedCbs) {
            		_initedCbs[key](true, _cfgs[key])
        		}

        		_initedCbs = {}
			},

			// 每次最大领奖次数，默认走本地配置
			getRewardTimesOfEachDay: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_REWARD_TIMES_OF_EACH_DAY, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10))
						}
						else {
							cb(G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_ADV_TIMES_OF_ONE_DAY"]).num)
						}
					})
				}
				else {
					cb(G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_ADV_TIMES_OF_ONE_DAY"]).num)
				}
			},

			// 分享概率，默认100
			getRateOfShare: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_RATE_OF_SHARE, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10))
						}
						else {
							cb(100)
						}
					})
				}
				else {
					cb(100)
				}
			},

			// 开启分享前的广告次数，默认0
			getAdvTimesBeforeShare: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_ADV_TIMES_BEFORE_SHARE, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10))
						}
						else {
							cb(0)
						}
					})
				}
				else {
					cb(0)
				}
			},

			// 获取上报到Ald的百分比，默认100
			getPercentOfReportToAld: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_PERCENT_OF_REPORT_TO_ALD, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10))
						}
						else {
							cb(100)
						}
					})
				}
				else {
					cb(100)
				}
			},

			// 分享成功的最小间隔时间，默认3000
			getMinDurationBetweenShare: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_MIN_DURATION_BETWEEN_SHARE, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10))
						}
						else {
							cb(3000)
						}
					})
				}
				else {
					cb(3000)
				}
			},

			// 导出商业广告是否可用，默认false
			isExportAdvEnabled: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.qq) {
					cb(false)
				}
				else if (window.wx) {
					if (_isExportAdvEnabled === null) {
						_getCfgByKey(G_SwitchName.SN_DISABLE_EXPORT_ADV_CHIDS, function (bSucc, sCfg) {
							// body...
							if (bSucc) {
								let channelID = G_WXHelper.getChannelID()

								if (channelID !== "") {
									console.log("current channelID: ", channelID)

									let disabledChIDs = sCfg.split("||")
									if (Array.isArray(disabledChIDs)) {
										for (let i = 0; i < disabledChIDs.length; i++) {
											if (disabledChIDs[i].toString() === channelID) {
												_isExportAdvEnabled = false
												break
											}
										}
									}

									if (_isExportAdvEnabled === null) {
										_isExportAdvEnabled = true
									}
								}
								else {
									_isExportAdvEnabled = true
								}
							}
							else {
								_isExportAdvEnabled = true
							}

							// cb
							cb(_isExportAdvEnabled)
						})
					}
					else {
						cb(_isExportAdvEnabled)
					}
				}
				else {
					cb(false)
				}
			},

			// 是否正在提审，默认false
			isPublishing: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx) {
					_getCfgByKey(G_SwitchName.SN_IS_PUBLISHING, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10) === 1)
						}
						else {
							cb(false)
						}
					})
				}
				else {
					cb(false)
				}
			},

			// 是否正常显示广告，默认False
			// True代表允许误触
			// False代表不允许误触
			isAdvStateNormal: function ( forceReload, cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (window.wx && typeof wx.h_JudgeRegion === 'function') {
					if (forceReload) {
						_isAdvStateNormal = null
					}

					if (_isAdvStateNormal === null) {
						wx.h_JudgeRegion({
							scene: G_WXHelper.getLaunchOptions().scene,
							success: function (res) {
								if (res.Status === 200) {
									_isAdvStateNormal = res.Result.Status === 0
									cb(_isAdvStateNormal)
								}
								else {
									cb(false)
								}
							}
						})
					}
					else {
						cb(_isAdvStateNormal)
					}
				}
				else {
					console.warn('wx.h_JudgeRegion 方法不存在，请检查 qy.js');
					cb(false)
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

// global
window.G_Switch = _Switch.getInstance()