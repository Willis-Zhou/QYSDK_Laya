var SK_FORMAT_OF_KEY_OF_PLAYER_INFO = "storage_key_of_player_info_{0}"
var INTERVER_OF_AUTO_SAVE = 180 * 1000

/*
* 用户信息
*/
var _PlayerInfo = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_PlayerInfo Instance...")

		// 用户信息
		var _playerInfo = null;
		var _isNewPlayer = false;
		var _isBlocked = false;
		var _lockedReason = "";
		var _outlineTime = 0;
		var _coinBigNumber = null;
		var _totalCoinBigNumber = null;

		var _serializePlayerInfoIntoLocal = function () {
			// body...
			if (_playerInfo) {
				let serialize_btyes = _playerInfo.constructor.encode(_playerInfo).finish()
				let serialize_text = G_Utils.Uint8Array2HexString(serialize_btyes)

				let save_json = {
					saveTime: Math.floor(G_ServerInfo.getServerTime() / 1000.0),
					data: serialize_text
				}

				// save
				G_WXHelper.setStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(_playerInfo.openID), JSON.stringify(save_json))
			}
		}

		var _checkPlayerInfoFromLocal = function (sessID) {
			// body...
			if (_playerInfo) {
				let save_json_str = G_WXHelper.getStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(_playerInfo.openID))

				if (save_json_str && save_json_str !== "") {
					let save_json = JSON.parse(save_json_str)

					if (typeof save_json["saveTime"] !== "undefined" && typeof save_json["data"] !== "undefined") {
						if (save_json["saveTime"] > _playerInfo.lastSaveTime) {
							let serialize_btyes = G_Utils.HexString2Uint8Array(save_json["data"])
							let playerInfo = new db["PlayerInfo"].decode(serialize_btyes)

							// replace
							_playerInfo = playerInfo
							_playerInfo.sessID = sessID

							return true
						}
					}
				}
			}

			_playerInfo.sessID = sessID
			return false
		}

		var _loadPlayerInfoFromLocal = function (openID, sessID) {
			let save_json_str = G_WXHelper.getStorage(SK_FORMAT_OF_KEY_OF_PLAYER_INFO.format(openID))

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

		var _fixOptionalDataInPlayerInfo = function () {
			// body...
			let isNeedSave = false

			if (_playerInfo) {
			}

			return isNeedSave
		}

		var _caculateOutlineTime = function (argument) {
			// body...
			if (_playerInfo && _playerInfo.lastSaveTime !== 0) {
				_outlineTime = Math.floor(G_ServerInfo.getServerTime() / 1000.0) - _playerInfo.lastSaveTime

				if (_outlineTime < 0) {
					_outlineTime = 0
				}
			}
			else {
				_outlineTime = 0
			}

			if (_outlineTime > 0) {
				console.log("Outline From Last Login: {0} seconds.".format(_outlineTime.toString()))
			}
		}

		var _loadCoin = function () {
			// body...
			if (_playerInfo && !_coinBigNumber) {
				_coinBigNumber = BigNumber(_playerInfo.coin)
			}
		}
		
		var _saveCoin = function () {
			// body...
			if (_playerInfo && _coinBigNumber) {
				_playerInfo.coin = _coinBigNumber.toFixed(0)
				_serializePlayerInfoIntoLocal()
			}

			// event
			G_Event.dispatchEvent(G_EventName.EN_COIN_CHANGED)
		}
	
		var _loadTotalCoin = function () {
			// body...
			if (_playerInfo && !_totalCoinBigNumber) {
				_totalCoinBigNumber = BigNumber(_playerInfo.totalCoin)
			}
		}

		var _saveTotalCoin = function () {
			// body...
			if (_playerInfo && _totalCoinBigNumber) {
				_playerInfo.totalCoin = _totalCoinBigNumber.toFixed(0)
			}
		}

		return {
			// 登陆后自动调用
			load: function ( openID, sessID, cb ) {
				// body...
				var self = this
				let bSave = false

				let _toDoAfterGetPlayerInfo = function () {
					// coin
					_loadCoin()
					_loadTotalCoin()

					// outline
					_caculateOutlineTime()

					// save or not
					if (bSave) {
						console.log("Local PlayerInfo Is Newest...")
						self.save()
					}

					if (typeof cb === "function") {
						cb(_playerInfo)
					}

					if (window.wx) {
						// only auto save on wx/qq platform
						G_Scheduler.schedule("Auto_Save_Player_Info", function () {
							// body...
							self.save()
						}, false, INTERVER_OF_AUTO_SAVE)
					}
				}

				if (window.wx) {
					G_NetHelper.reqLoadPlayerInfo(sessID, function (jsonData) {
						// body...
						console.log(jsonData)

						if (jsonData && jsonData.code === 0) {
							if (jsonData.data.selfStore !== "") {
								let serialize_btyes = G_Utils.HexString2Uint8Array(jsonData.data.selfStore)
								_playerInfo = new db["PlayerInfo"].decode(serialize_btyes)
								_isNewPlayer = false

								// check local
								bSave = _checkPlayerInfoFromLocal(sessID)

								// check optional
								bSave = bSave || _fixOptionalDataInPlayerInfo()
							}
							else {
								// new player
								_playerInfo = self._generateNewPlayerInfo(openID, sessID)
								_playerInfo.userID = jsonData.data.userId
								_isNewPlayer = true
								bSave = true
							}

							// update nickname and head url
							_playerInfo.nickname = jsonData.data.nickname
							_playerInfo.headUrl = jsonData.data.avatarurl

							// update lock state
							_isBlocked = jsonData.data.isLock == 1
							if (_isBlocked) {
								_lockedReason = jsonData.data.lockMessage
							}

							// switch
							// common switches
							G_Switch.addCfgs(jsonData.data.config.base)
							// Custom switches
							G_Switch.addCfgs(jsonData.data.config.custom)
							// publish switch
							if (parseInt(jsonData.data.config.base.commitVersion, 10) === G_SDKCfg.getAppVersion()) {
								G_Switch.addCfg(G_SwitchName.SN_IS_PUBLISHING, jsonData.data.config.base.commitVersionStatus)
							}
							else {
								G_Switch.addCfg(G_SwitchName.SN_IS_PUBLISHING, "0")
							}
							// inited
							G_Switch.inited()

							// share
							G_Share.addCfgs(jsonData.data.config.sense)

							_toDoAfterGetPlayerInfo()
						}
						else {
							// notify
							G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
						}
					})
				}
				else {
					// check local player info
					_playerInfo = _loadPlayerInfoFromLocal(openID, sessID)

					if (_playerInfo) {
						// check optional
						bSave = bSave || _fixOptionalDataInPlayerInfo()
					}
					else {
						// new player
						_playerInfo = this._generateNewPlayerInfo(openID, sessID)
						_isNewPlayer = true
					}

					_toDoAfterGetPlayerInfo()
				}
			},

			_generateNewPlayerInfo: function (openID, sessID) {
				// body...
				let playerInfo = new db["PlayerInfo"]
				playerInfo.openID = openID
				playerInfo.sessID = sessID
				playerInfo.userID = 0
				playerInfo.lastSaveTime = 0
				playerInfo.nickname = G_Nickname || ""
				playerInfo.sex = G_Sex || 0
				playerInfo.headUrl = G_HeadUrl || ""
				playerInfo.coin = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_BORN_COIN_NUM"]).num.toString()
				playerInfo.totalCoin = playerInfo.coin
				playerInfo.shareTimesOfToday = 0
				playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
				playerInfo.advTimesOfToday = 0
				playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
				playerInfo.setting = new db["SettingConfig"]
				playerInfo.setting.isSoundOn = true
				playerInfo.setting.isMuteOn = true

				return playerInfo
			},

			// 主动保存
			save: function () {
				// body...
				if (window.wx && _playerInfo) {
					var self = this

					let serialize_btyes = _playerInfo.constructor.encode(_playerInfo).finish()
					let serialize_text = G_Utils.Uint8Array2HexString(serialize_btyes)
					G_NetHelper.reqSavePlayerInfo(_playerInfo.sessID, serialize_text, function () {
						// body...
						_playerInfo.lastSaveTime = Math.floor(G_ServerInfo.getServerTime() / 1000.0)

						// save to wx
						self.saveToWX()
					})
				}
			},

			// 主动保存到微信
			saveToWX: function () {
				// body...
				if (G_OpenHelper) {
					G_OpenHelper.saveSelfInfo({
						totalCoin: _playerInfo.totalCoin,
					}, function () {
						// body...
						console.log("Upload To WX Cloud Succ.")
					})
				}
			},

			getOpenID: function () {
				// body...
				if (_playerInfo) {
					return _playerInfo.openID
				}
				else {
					return ""
				}
			},

			getSessID: function () {
				// body...
				if (_playerInfo) {
					return _playerInfo.sessID
				}
				else {
					return ""
				}
			},

			getUserID: function () {
				// body...
				if (_playerInfo) {
					return _playerInfo.userID
				}
				else {
					return ""
				}
			},

			// 获取是否是新玩家
			isNewPlayer: function () {
				// body...
				if (_playerInfo) {
					return _isNewPlayer
				}
				else {
					return false
				}
			},

			// 获取是否被封锁
			isBlocked: function () {
				// body...
				if (_playerInfo) {
					return _isBlocked
				}
				else {
					return false
				}
			},

			// 获取封锁原因
			getLockedReason: function () {
				// body...
				return _lockedReason
			},

			// 获取离线时长（重新登录才会计算）
			getOutlineTime: function () {
				// body...
				return _outlineTime
			},

			// 获取玩家金币数
			// 返回类型BigNumber
			getCoin: function () {
				// body...
				return _coinBigNumber
			},

			// 获取玩家总金币数
			// 返回类型BigNumber
			getTotalCoin: function () {
				// body...
				return _totalCoinBigNumber
			},

			// 增加玩家金币数
			// num必须是number类型或BigNumber类型
			plusCoin: function ( num ) {
				// body...
				if (!_coinBigNumber || !_totalCoinBigNumber) {
					console.error("PlayerInfo.plusCoin: can not operation coin data before login...")
					return
				}

				if (typeof num !== "number" && !BigNumber.isBigNumber(num)) {
					console.error("PlayerInfo.plusCoin: param num must be a type of number or BigNumber...")
					return
				}

				_coinBigNumber = _coinBigNumber.plus(num)
				_totalCoinBigNumber = _totalCoinBigNumber.plus(num)
				_saveTotalCoin()
				_saveCoin()
			},

			// 减少玩家金币数
			// num必须是number类型或BigNumber类型
			minusCoin: function ( num ) {
				// body...
				if (!_coinBigNumber) {
					console.error("PlayerInfo.minusCoin: can not operation coin data before login...")
					return
				}

				if (typeof num !== "number" && !BigNumber.isBigNumber(num)) {
					console.error("PlayerInfo.minusCoin: param num must be a type of number or BigNumber...")
					return
				}

				_coinBigNumber = _coinBigNumber.minus(num)
				_saveCoin()
			},

			setSoundEnable: function ( isOn ) {
				if (_playerInfo) {
					_playerInfo.setting.isSoundOn = isOn

					// save
					_serializePlayerInfoIntoLocal()
				}
			},

			isSoundEnable: function () {
				if (_playerInfo) {
					return _playerInfo.setting.isSoundOn
				}
				else {
					return false
				}
			},

			setMuteEnable: function ( isOn ) {
				if (_playerInfo) {
					_playerInfo.setting.isMuteOn = isOn

					// save
					_serializePlayerInfoIntoLocal()
				}
			},

			isMuteEnable: function () {
				if (_playerInfo) {
					return _playerInfo.setting.isMuteOn
				}
				else {
					return false
				}
			},

			getTodayShareTimes: function () {
				// body...
				if (_playerInfo) {
					// check first
					this._checkShareTimesValid()

					return _playerInfo.shareTimesOfToday
				}
				else {
					return 0
				}
			},

			plusTodayShareTimes: function () {
				// body...
				if (_playerInfo) {
					// check first
					this._checkShareTimesValid()
					
					_playerInfo.shareTimesOfToday += 1
					_playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
					_serializePlayerInfoIntoLocal()
				}
			},

			_checkShareTimesValid: function () {
				// body...
				if (_playerInfo.recordDayOfShareTimes !== G_ServerInfo.getCurServerDayOfYear()) {
					_playerInfo.shareTimesOfToday = 0
					_playerInfo.recordDayOfShareTimes = G_ServerInfo.getCurServerDayOfYear()
					_serializePlayerInfoIntoLocal()
				}
			},

			// 奖励广告次数，部分分享也会记入广告次数
			getTodayAdvTimes: function () {
				// body...
				if (_playerInfo) {
					// check first
					this._checkAdvTimesValid()

					return _playerInfo.advTimesOfToday
				}
				else {
					return 0
				}
			},

			plusTodayAdvimes: function () {
				// body...
				if (_playerInfo) {
					// check first
					this._checkAdvTimesValid()

					_playerInfo.advTimesOfToday += 1
					_playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
					_serializePlayerInfoIntoLocal()

					// event
					G_Event.dispatchEvent(G_EventName.EN_ADV_TIMES_CHANGED)
				}
			},

			isNoMoreAdvTimesToday: function ( cb ) {
				// body...
				G_Switch.getRewardTimesOfEachDay(function ( maxAdvTimes ) {
					if (typeof cb === "function") {
						cb((this.getTodayAdvTimes() >= maxAdvTimes))
					}
				}.bind(this))
			},

			_checkAdvTimesValid: function () {
				// body...
				if (_playerInfo.recordDayOfAdvTimes !== G_ServerInfo.getCurServerDayOfYear()) {
					_playerInfo.advTimesOfToday = 0
					_playerInfo.recordDayOfAdvTimes = G_ServerInfo.getCurServerDayOfYear()
					_serializePlayerInfoIntoLocal()
				}
			},

			_joinStrArr: function ( arr ) {
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
window.G_PlayerInfo = _PlayerInfo.getInstance()