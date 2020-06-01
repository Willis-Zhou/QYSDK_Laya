/*
* 全局基础开关
*/
export default class SwitchBase {
	constructor() {
		this._cfgs = null
		this._initedCbs = {}
		this._isAdvStateNormal = null
		this._isExportAdvEnabled = null

		// log
		console.log("Init G_Switch Instance...")
	}

	__add( key, value ) {
		// body...
		if (!this._cfgs) {
			this._cfgs = {}
		}

		if (typeof this._cfgs[key] !== "undefined") {
			console.error("G_Switch.addCfg: key: {0} has registered before...".format(key))
			return
		}

		this._cfgs[key] = value
	}

	_add( cfgs ) {
		// body...
		if (cfgs) {
			for (let key in cfgs) {
				this.__add(key, cfgs[key])
			}
		}
	}

	_checkString(string) {
		// body...
		if (typeof string !== "string" || string === "") {
			return false
		}

		return true
	}

	_getCfgByKey(key, cb) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (!this._checkString(key)) {
			cb(false, "")
		}

		if (this._cfgs) {
			if (typeof this._cfgs[key] !== "undefined") {
				cb(true, this._cfgs[key])
			}
			else {
				cb(false, "")
			}
		}
		else {
			this._initedCbs[key] = cb
		}
	}

	addCfgs( cfgs ) {
		// body...
		this._add(cfgs)
	}

	addCfg( key, cfg ) {
		// body...
		this.__add(key, cfg)
	}

	// 初始化完成
	inited() {
		// body...
		for (let key in this._initedCbs) {
    		this._initedCbs[key](true, this._cfgs[key])
		}

		this._initedCbs = {}

		if (typeof this.onInited === "function") {
            this.onInited()
        }
	}

	// 获取提审版本，默认0
	getCommitVersion( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_COMMIT_VERSION, function (bSucc, sCfg) {
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
	}

	// 每次最大领奖次数，默认走本地配置
	getRewardTimesOfEachDay( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_REWARD_TIMES_OF_EACH_DAY, function (bSucc, sCfg) {
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
	}

	// 分享概率，默认100
	getRateOfShare( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_RATE_OF_SHARE, function (bSucc, sCfg) {
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
	}

	// 开启分享前的广告次数，默认0
	getAdvTimesBeforeShare( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_ADV_TIMES_BEFORE_SHARE, function (bSucc, sCfg) {
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
	}

	// 获取上报到Ald的百分比，默认100
	getPercentOfReportToAld( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_PERCENT_OF_REPORT_TO_ALD, function (bSucc, sCfg) {
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
	}

	// 分享成功的最小间隔时间，默认3000
	getMinDurationBetweenShare( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_MIN_DURATION_BETWEEN_SHARE, function (bSucc, sCfg) {
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
	}

	// 是否正在提审，默认false
	isPublishing( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_IS_PUBLISHING, function (bSucc, sCfg) {
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
	}

	// 是否新游戏，默认false
	isNewGame( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_IS_NEW_GAME, function (bSucc, sCfg) {
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
	}

	// 导出商业广告是否可用，默认false
	isExportAdvEnabled( key, cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		let isKeyInited = false
		if (typeof G_ADCfg[key] === "string" && G_ADCfg[key] !== "") {
			isKeyInited = true
		}

		if (G_PlatHelper.isWXPlatform()) {
			if (this._isExportAdvEnabled === null) {
				this._getCfgByKey(G_SwitchName.SN_DISABLE_EXPORT_ADV_CHIDS, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						let channelID = G_PlatHelper.getChannelID()

						if (channelID !== "") {
							console.log("current channelID: ", channelID)

							let disabledChIDs = sCfg.split("||")
							if (Array.isArray(disabledChIDs)) {
								for (let i = 0; i < disabledChIDs.length; i++) {
									if (disabledChIDs[i].toString() === channelID) {
										this._isExportAdvEnabled = false
										break
									}
								}
							}

							if (this._isExportAdvEnabled === null) {
								this._isExportAdvEnabled = true
							}
						}
						else {
							this._isExportAdvEnabled = true
						}
					}
					else {
						this._isExportAdvEnabled = true
					}

					// cb
					cb(this._isExportAdvEnabled && isKeyInited)
				}.bind(this))
			}
			else {
				cb(this._isExportAdvEnabled && isKeyInited)
			}
		}
		else if (G_PlatHelper.isWINPlatform() || G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isTTPlatform()) {
			cb(isKeyInited)
		}
		else {
			cb(false)
		}
	}

	// 是否正常显示广告，默认False
	// True代表允许误触
	// False代表不允许误触
	isAdvStateNormal( forceReload, cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat() && typeof G_PlatHelper.getPlat().h_JudgeRegion === 'function') {
			if (forceReload) {
				this._isAdvStateNormal = null
			}

			if (this._isAdvStateNormal === null) {
				var self = this

				let scene = undefined
				if (!G_PlatHelper.isOVPlatform()) {
					scene = G_PlatHelper.getLaunchOptions().scene
				}

				G_PlatHelper.getPlat().h_JudgeRegion({
					scene: scene,
					success: function (res) {
						if (res.Status === 200) {
							self._isAdvStateNormal = res.Result.Status === 0
							cb(self._isAdvStateNormal)
						}
						else {
							cb(false)
						}
					}
				})
			}
			else {
				cb(this._isAdvStateNormal)
			}
		}
		else {
			console.warn('plat.h_JudgeRegion 方法不存在，请检查 qy(-plat).js');
			cb(false)
		}
	}

	// 误触相关接口
	// 是否点击误触可用
	isClickMistakeEnabled( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this.getCommitVersion(function ( commitVersion ) {
				if (commitVersion === G_SDKCfg.getAppVersion()) {
					// commit
					this._getCfgByKey(G_SwitchName.SN_CV_CLICK_STATUS, function (bSucc, sCfg) {
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
					// online
					this._getCfgByKey(G_SwitchName.SN_OV_CLICK_STATUS, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10) === 1)
						}
						else {
							cb(false)
						}
					})
				}
			}.bind(this))
		}
		else {
			cb(false)
		}
	}

	// 误触相关接口
	// 是否移动误触可用
	isMoveMistakeEnabled( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this.getCommitVersion(function ( commitVersion ) {
				if (commitVersion === G_SDKCfg.getAppVersion()) {
					// commit
					this._getCfgByKey(G_SwitchName.SN_CV_MOVE_STATUS, function (bSucc, sCfg) {
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
					// online
					this._getCfgByKey(G_SwitchName.SN_OV_MOVE_STATUS, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10) === 1)
						}
						else {
							cb(false)
						}
					})
				}
			}.bind(this))
		}
		else {
			cb(false)
		}
	}

	// 误触相关接口
	// 是否按钮误触可用
	isBtnMistakeEnabled( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this.getCommitVersion(function ( commitVersion ) {
				if (commitVersion === G_SDKCfg.getAppVersion()) {
					// commit
					this._getCfgByKey(G_SwitchName.SN_CV_BTN_STATUS, function (bSucc, sCfg) {
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
					// online
					this._getCfgByKey(G_SwitchName.SN_OV_BTN_STATUS, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10) === 1)
						}
						else {
							cb(false)
						}
					})
				}
			}.bind(this))
		}
		else {
			cb(false)
		}
	}

	// 误触相关接口
	// 是否退出误触可用
	isExitMistakeEnabled( cb ) {
		// body...
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this.getCommitVersion(function ( commitVersion ) {
				if (commitVersion === G_SDKCfg.getAppVersion()) {
					// commit
					this._getCfgByKey(G_SwitchName.SN_CV_EXIT_STATUS, function (bSucc, sCfg) {
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
					// online
					this._getCfgByKey(G_SwitchName.SN_OV_EXIT_STATUS, function (bSucc, sCfg) {
						// body...
						if (bSucc) {
							cb(parseInt(sCfg, 10) === 1)
						}
						else {
							cb(false)
						}
					})
				}
			}.bind(this))
		}
		else {
			cb(false)
		}
	}

	// 误触接口相关
	// 今天最大误触数量，默认全部9999
	getTodayMaxMistakeCounts( cb ) {
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_TODAY_MAX_MISTAKE_COUNTS, function (bSucc, sCfg) {
				// body...
				if (bSucc) {
					cb(sCfg)
				}
				else {
					cb(9999)
				}
			})
		}
		else {
			cb(9999)
		}
	}

	// 误触接口相关
	// 误触触发概率，默认100
	getInvokeMistakeRate( cb ) {
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			this._getCfgByKey(G_SwitchName.SN_INVOKE_MISTAKE_RATE, function (bSucc, sCfg) {
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
	}

	// 误触接口相关
	// 触发间隔，默认0
	getIntervalOfMistakes( type, cb ) {
		if (typeof cb !== "function") {
			return
		}

		if (G_PlatHelper.getPlat()) {
			let getCommonInterval = function ( _cb ) {
				this._getCfgByKey(G_SwitchName.SN_INTERVAL_OF_MISTAKES, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						_cb(parseInt(sCfg, 10))
					}
					else {
						_cb(0)
					}
				})
			}.bind(this)

			if (type === "move") {
				this._getCfgByKey(G_SwitchName.SN_INTERVAL_OF_MOVE_MISTAKES, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						cb(parseInt(sCfg, 10))
					}
					else {
						getCommonInterval(cb)
					}
				})
			}
			else if (type === "click") {
				this._getCfgByKey(G_SwitchName.SN_INTERVAL_OF_CLICK_MISTAKES, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						cb(parseInt(sCfg, 10))
					}
					else {
						getCommonInterval(cb)
					}
				})
			}
			else if (type === "btn") {
				this._getCfgByKey(G_SwitchName.SN_INTERVAL_OF_BTN_MISTAKES, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						cb(parseInt(sCfg, 10))
					}
					else {
						getCommonInterval(cb)
					}
				})
			}
			else if (type === "exit") {
				this._getCfgByKey(G_SwitchName.SN_INTERVAL_OF_EXIT_MISTAKES, function (bSucc, sCfg) {
					// body...
					if (bSucc) {
						cb(parseInt(sCfg, 10))
					}
					else {
						getCommonInterval(cb)
					}
				})
			}
			else {
				getCommonInterval(cb)
			}
		}
		else {
			cb(0)
		}
	}

	//根据key名获取配置_无本配置就返回null
	getConfigByKey(key) {
		if (this._cfgs) {
			if (typeof this._cfgs[key] !== "undefined") {
				return this._cfgs[key]
			}
			else {
				return null;
			}
		}
		return null;
	}
}