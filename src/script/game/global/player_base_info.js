var SK_FORMAT_OF_KEY_OF_PLAYER_INFO = "storage_key_of_player_info_{0}"
var INTERVER_OF_AUTO_SAVE = 180 * 1000

export default class PlayerBaseInfo {
	constructor() {
		this._playerInfo = null;
		this._isNewPlayer = false;
		this._isBlocked = false;
		this._lockedReason = "";
		this._outlineTime = 0;
	}

	_serializePlayerInfoIntoLocal() {
		// body...
		if (this._playerInfo) {
			let serialize_btyes = this._playerInfo.constructor.encode(this._playerInfo).finish()
			let serialize_text = G_Utils.Uint8Array2HexString(serialize_btyes)

			let save_json = {
				saveTime: Math.floor(G_ServerInfo.getServerTime() / 1000.0),
				data: serialize_text
			}

			// save
			G_PlatHelper.setStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(this._playerInfo.openID), JSON.stringify(save_json))
		}
	}

	_checkPlayerInfoFromLocal(sessID) {
		// body...
		if (this._playerInfo) {
			let save_json_str = G_PlatHelper.getStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(this._playerInfo.openID))

			if (save_json_str && save_json_str !== "") {
				let save_json = JSON.parse(save_json_str)

				if (typeof save_json["saveTime"] !== "undefined" && typeof save_json["data"] !== "undefined") {
					if (save_json["saveTime"] > this._playerInfo.lastSaveTime) {
						let serialize_btyes = G_Utils.HexString2Uint8Array(save_json["data"])
						let playerInfo = new db["PlayerInfo"].decode(serialize_btyes)

						// replace
						this._playerInfo = playerInfo
						this._playerInfo.sessID = sessID

						return true
					}
				}
			}
		}

		this._playerInfo.sessID = sessID
		return false
	}

	_loadPlayerInfoFromLocal(openID, sessID) {
		let save_json_str = G_PlatHelper.getStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(openID))

		if (save_json_str && save_json_str !== "") {
			let save_json = JSON.parse(save_json_str)

			if (typeof save_json["data"] !== "undefined") {
				let serialize_btyes = G_Utils.HexString2Uint8Array(save_json["data"])
				let playerInfo = new db["PlayerInfo"].decode(serialize_btyes)

				// replace
				playerInfo.sessID = sessID

				return playerInfo
			}
		}

		return null
	}

	_fixOptionalDataInPlayerInfo() {
		// body...
		let isNeedSave = false

		if (typeof this.onFixOptionalDataInPlayerInfo === "function") {
            isNeedSave = isNeedSave || this.onFixOptionalDataInPlayerInfo()
        }

		return isNeedSave
	}

	// 登陆后自动调用
	load( openID, sessID, cb ) {
		// body...
		var self = this
		let bSave = false

		let _initWebConfigs = function (jsonData) {
			// switch
			// common switches
			G_Switch.addCfgs(jsonData.data.config.base)
			// Custom switches
			G_Switch.addCfgs(jsonData.data.config.custom)
			// publish switch
			if (parseInt(jsonData.data.config.base.commitVersion, 10) === G_SDKCfg.getAppVersion()) {
				G_Switch.addCfg(G_SwitchName.SN_IS_PUBLISHING, jsonData.data.config.base.commitVersionStatus)
				if (jsonData.data.config.base.commitVersionStatus.toString() === "1") {
					console.log("app ver: ", G_SDKCfg.getAppVersion(), " ispublishing: true")
				}
				else {
					console.log("app ver: ", G_SDKCfg.getAppVersion(), " ispublishing: false")
				}
			}
			else {
				G_Switch.addCfg(G_SwitchName.SN_IS_PUBLISHING, "0")
				console.log("app ver: ", G_SDKCfg.getAppVersion(), " ispublishing: false")
			}
			// inited
			G_Switch.inited()

			// business ads
			if (jsonData.data.config.busAd) {
				let adCfgs = jsonData.data.config.busAd

				// 添加为全局（重复则覆盖）
				for (let key in adCfgs) {
					G_ADCfg[key] = adCfgs[key]
				}
			}

			// flow ads
			if (Array.isArray(jsonData.data.config.flowAd)) {
				let adCfgs = jsonData.data.config.flowAd

				adCfgs.forEach(adCfg => {
					if (G_PlatHelper.isOVPlatform()) {
						if (adCfg.flows_type === "banner") {
							G_OVAdvConfigs.push({
								key: "Common",
								posId: adCfg.flows_id,
								type: "Banner"
							})
						}
						else if (adCfg.flows_type === "video") {
							G_OVAdvConfigs.push({
								key: "Common",
								posId: adCfg.flows_id,
								type: "Video"
							})
						}
						else if (adCfg.flows_type === "insert") {
							G_OVAdvConfigs.push({
								key: "Common",
								posId: adCfg.flows_id,
								type: "Insert"
							})
						}
						else if (adCfg.flows_type === "native") {
							G_OVAdvConfigs.push({
								key: "Common",
								posId: adCfg.flows_id,
								type: "Native"
							})
						}
					}
					else {
						if (adCfg.flows_type === "banner") {
							G_advConfigs.bannerAdUnitIDs = adCfg.flows_id.split("||")
						}
						else if (adCfg.flows_type === "video") {
							G_advConfigs.videoAdUnitIDs = adCfg.flows_id.split("||")
						}
						else if (adCfg.flows_type === "insert") {
							G_advConfigs.interstitialAdUnitIDs = adCfg.flows_id.split("||")
						}
						else if (adCfg.flows_type === "recommend") {
							G_RecommendAdUnitIDs = adCfg.flows_id.split("||")
						}
						else if (adCfg.flows_type === "box") {
							G_BoxAdUnitIDs = adCfg.flows_id.split("||")
						}
					}
				})
			}

			// share
			G_Share.addCfgs(jsonData.data.config.sense)
		}

		let _toDoAfterGetPlayerInfo = function () {
			// do special for player info
			self._initAfterGetPlayerInfo()

			// save or not
			if (bSave) {
				console.log("Local PlayerInfo Is Newest...")
				self.save()
			}

			if (typeof cb === "function") {
				cb(self._playerInfo)
			}

			if (G_PlatHelper.canSaveOnline()) {
				// only auto save on wx/qq platform
				G_Scheduler.schedule("Auto_Save_Player_Info", function () {
					// body...
					self.save()
				}, false, INTERVER_OF_AUTO_SAVE)
			}
		}

		if (G_PlatHelper.canSaveOnline()) {
			let onGotPlayerInfo = (jsonData) => {
				console.log(jsonData)

				if (jsonData && jsonData.code === 0) {
					if (jsonData.data.selfStore !== "") {
						let serialize_btyes = G_Utils.HexString2Uint8Array(jsonData.data.selfStore)
						self._playerInfo = new db["PlayerInfo"].decode(serialize_btyes)
						self._isNewPlayer = false

						// check local
						bSave = self._checkPlayerInfoFromLocal(sessID)

						// check optional
						bSave = self._fixOptionalDataInPlayerInfo() || bSave
					}
					else {
						// new player
						self._playerInfo = self._generateNewPlayerInfo(openID, sessID)
						self._playerInfo.userID = jsonData.data.userId
						self._isNewPlayer = true
						bSave = true
					}

					// update nickname and head url
					self._playerInfo.nickname = jsonData.data.nickname
					self._playerInfo.headUrl = jsonData.data.avatarurl

					// update lock state
					self._isBlocked = jsonData.data.isLock == 1
					if (self._isBlocked) {
						self._lockedReason = jsonData.data.lockMessage
					}

					// web configs
					_initWebConfigs(jsonData)

					_toDoAfterGetPlayerInfo()
				}
				else {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				}
			}

			if (G_PlatHelper.canLoginOnline()) {
				G_NetHelper.reqLoadPlayerInfo(sessID, onGotPlayerInfo)
			}
			else {
				G_NetHelper.reqLoadPlayerInfo_WithOpenID(openID, onGotPlayerInfo)
			}
		}
		else {
			// check local player info
			this._playerInfo = this._loadPlayerInfoFromLocal(openID, sessID)

			if (this._playerInfo) {
				// check optional
				bSave = this._fixOptionalDataInPlayerInfo() || bSave
			}
			else {
				// new player
				this._playerInfo = this._generateNewPlayerInfo(openID, sessID)
				this._isNewPlayer = true
			}

			G_NetHelper.reqGetWebConfig(function (jsonData) {
				console.log(jsonData)

				if (jsonData && jsonData.code === 0) {
					// web configs
					_initWebConfigs(jsonData)

					_toDoAfterGetPlayerInfo()
				}
				else {
					// notify
					G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
				}
			})
		}
	}

	_generateNewPlayerInfo(openID, sessID) {
		// body...
		let playerInfo = new db["PlayerInfo"]
		playerInfo.openID = openID
		playerInfo.sessID = sessID
		playerInfo.userID = 0
		playerInfo.lastSaveTime = 0
		playerInfo.nickname = G_Nickname || ""
		playerInfo.sex = G_Sex || 0
		playerInfo.headUrl = G_HeadUrl || ""
		playerInfo.shareTimesOfToday = 0
		playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
		playerInfo.advTimesOfToday = 0
		playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
		playerInfo.setting = new db["SettingConfig"]
		playerInfo.setting.isSoundOn = true
		playerInfo.setting.isMuteOn = true

		if (typeof this.onGeneratedNewPlayerInfo === "function") {
            this.onGeneratedNewPlayerInfo(playerInfo)
        }

		return playerInfo
	}

	_initAfterGetPlayerInfo() {
		// outline
		this._caculateOutlineTime()

		if (typeof this.onInitAfterGetPlayerInfo === "function") {
            this.onInitAfterGetPlayerInfo()
        }
	}

	// 主动保存
	save() {
		// body...
		if (G_PlatHelper.canSaveOnline() && this._playerInfo) {
			var self = this

			let serialize_btyes = this._playerInfo.constructor.encode(this._playerInfo).finish()
			let serialize_text = G_Utils.Uint8Array2HexString(serialize_btyes)

			if (G_PlatHelper.canLoginOnline()) {
				G_NetHelper.reqSavePlayerInfo(this._playerInfo.sessID, serialize_text, function () {
					// body...
					self._playerInfo.lastSaveTime = Math.floor(G_ServerInfo.getServerTime() / 1000.0)
	
					// save to wx
					self.saveToWX()
				})
			}
			else {
				G_NetHelper.reqSavePlayerInfo_WithOpenID(this._playerInfo.openID, serialize_text, function () {
					// body...
					self._playerInfo.lastSaveTime = Math.floor(G_ServerInfo.getServerTime() / 1000.0)
	
					// save to wx
					self.saveToWX()
				})
			}
		}
	}

	// 主动保存到微信
	saveToWX() {
		// body...
		if (typeof G_OpenHelper !== "undefined") {
			let selfInfo = {}

			if (typeof this.onFillSaveToWXData === "function") {
	            this.onFillSaveToWXData(selfInfo)
	        }

			G_OpenHelper.saveSelfInfo(selfInfo, function () {
				// body...
				console.log("Upload To WX Cloud Succ.")
			})
		}
	}

	getOpenID() {
		// body...
		if (this._playerInfo) {
			return this._playerInfo.openID
		}
		else {
			return ""
		}
	}

	getSessID() {
		// body...
		if (this._playerInfo) {
			return this._playerInfo.sessID
		}
		else {
			return ""
		}
	}

	getUserID() {
		// body...
		if (this._playerInfo) {
			return this._playerInfo.userID
		}
		else {
			return ""
		}
	}

	getNickName() {
		// body...
		if (this._playerInfo) {
			return this._playerInfo.nickname
		}
		else {
			return ""
		}
	}

	getHeadUrl() {
		// body...
		if (this._playerInfo) {
			return this._playerInfo.headUrl
		}
		else {
			return ""
		}
	}

	// 获取是否是新玩家
	isNewPlayer() {
		// body...
		if (this._playerInfo) {
			return this._isNewPlayer
		}
		else {
			return false
		}
	}

	// 获取是否被封锁
	isBlocked() {
		// body...
		if (this._playerInfo) {
			return this._isBlocked
		}
		else {
			return false
		}
	}

	// 获取封锁原因
	getLockedReason() {
		// body...
		return this._lockedReason
	}

	// 获取离线时长（重新登录才会计算）
	getOutlineTime() {
		// body...
		return this._outlineTime
	}

	setSoundEnable( isOn ) {
		if (this._playerInfo) {
			this._playerInfo.setting.isSoundOn = isOn

			// save
			this._serializePlayerInfoIntoLocal()
		}
	}

	isSoundEnable() {
		if (this._playerInfo) {
			return this._playerInfo.setting.isSoundOn
		}
		else {
			return false
		}
	}

	setMuteEnable( isOn ) {
		if (this._playerInfo) {
			this._playerInfo.setting.isMuteOn = isOn

			// save
			this._serializePlayerInfoIntoLocal()
		}
	}

	isMuteEnable() {
		if (this._playerInfo) {
			return this._playerInfo.setting.isMuteOn
		}
		else {
			return false
		}
	}

	getTodayShareTimes() {
		// body...
		if (this._playerInfo) {
			// check first
			this._checkShareTimesValid()

			return this._playerInfo.shareTimesOfToday
		}
		else {
			return 0
		}
	}

	plusTodayShareTimes() {
		// body...
		if (this._playerInfo) {
			// check first
			this._checkShareTimesValid()
			
			this._playerInfo.shareTimesOfToday += 1
			this._playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
			this._serializePlayerInfoIntoLocal()
		}
	}

	_checkShareTimesValid() {
		// body...
		if (this._playerInfo.recordDayOfShareTimes !== G_ServerInfo.getCurServerDayOfYear()) {
			this._playerInfo.shareTimesOfToday = 0
			this._playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
			this._serializePlayerInfoIntoLocal()
		}
	}

	// 奖励广告次数，部分分享也会记入广告次数
	getTodayAdvTimes() {
		// body...
		if (this._playerInfo) {
			// check first
			this._checkAdvTimesValid()

			return this._playerInfo.advTimesOfToday
		}
		else {
			return 0
		}
	}

	plusTodayAdvimes() {
		// body...
		if (this._playerInfo) {
			// check first
			this._checkAdvTimesValid()

			this._playerInfo.advTimesOfToday += 1
			this._playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
			this._serializePlayerInfoIntoLocal()

			// event
			G_Event.dispatchEvent(G_EventName.EN_ADV_TIMES_CHANGED)
		}
	}

	isNoMoreAdvTimesToday( cb ) {
		// body...
		G_Switch.getRewardTimesOfEachDay(function ( maxAdvTimes ) {
			if (typeof cb === "function") {
				cb((this.getTodayAdvTimes() >= maxAdvTimes))
			}
		}.bind(this))
	}

	_checkAdvTimesValid() {
		// body...
		if (this._playerInfo.recordDayOfAdvTimes !== G_ServerInfo.getCurServerDayOfYear()) {
			this._playerInfo.advTimesOfToday = 0
			this._playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
			this._serializePlayerInfoIntoLocal()
		}
	}

	_joinStrArr( arr ) {
		// body...
		let str = ""

		if (arr) {
			for (let i = 0; i < arr.length; i++) {
				str += arr[i]
				if (i !== (arr.length - 1)) {
					str += ','
				}
			}
		}
		
		return str
	}

	_caculateOutlineTime() {
		// body...
		if (this._playerInfo && this._playerInfo.lastSaveTime !== 0) {
			this._outlineTime = Math.floor(G_ServerInfo.getServerTime() / 1000.0) - this._playerInfo.lastSaveTime

			if (this._outlineTime < 0) {
				this._outlineTime = 0
			}
		}
		else {
			this._outlineTime = 0
		}

		if (this._outlineTime > 0) {
			console.log("Outline From Last Login: {0} seconds.".format(this._outlineTime.toString()))
		}
	}
}