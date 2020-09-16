/*
* 全局UI帮助
* 主要用过微信提供的接受实现一些特性UI的功能
*/

var _NetHelper = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_NetHelper Instance...')

		var _baseUrls = {};
		var _openID = null;
		var _tag = "";

		// init callbacks
		var _netType = null
		var _initedCbs = []

		return {
			init: function () {
				// body...
				if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().onNetworkStatusChange) {
					G_PlatHelper.getPlat().onNetworkStatusChange(function (info) {
						// body...
						let originalNetType = _netType
						_netType = info.networkType

						if (!info.isConnected) {
							_netType = 'none'
						}

						if (_netType === 'none') {
							G_Event.dispatchEvent(G_EventName.EN_NET_CONNECTION_LOST)
						}
						else {
							if (originalNetType === 'none') {
								G_Event.dispatchEvent(G_EventName.EN_NET_CONNECTION_RECOVER)
							}
						}
					})

					var _invoteInitedCbs = function () {
						// body...
						for (let i = 0; i < _initedCbs.length; i++) {
							_initedCbs[i](_netType)
						}

						_initedCbs = []
					}

					if (G_PlatHelper.getPlat().getNetworkType) {
						G_PlatHelper.getPlat().getNetworkType({
							success: function (info) {
								// body...
								_netType = info.networkType

								// cb
								_invoteInitedCbs()
							},
							fail: function (info) {
								// body...
								_netType = 'none'

								// cb
								_invoteInitedCbs()
							}
						})
					}
				}
				else {
					_netType = 'wifi'
				}
			},

			getNetType: function ( cb ) {
				// body...
				if (typeof cb === "function") {
					if (_netType !== null) {
						cb(_netType)
					}
					else {
						_initedCbs.push(cb)
					}
				}
			},

			isConnected: function ( cb ) {
				// body...
				if (typeof cb === "function") {
					if (_netType !== null) {
						cb(_netType !== 'none')
					}
					else {
						_initedCbs.push(function (netType) {
							// body...
							cb(netType !== 'none')
						})
					}
				}
			},

			registerBaseUrl: function (key, baseUrl) {
				// body...
				if (!this._checkString(baseUrl) && !(baseUrl.indexOf("https://") === 0 || baseUrl.indexOf("http://") === 0)) {
					console.error("Register Base Url Fail, Check Input!")
					return
				}

				console.log("Register Base Url Succ!")

				_baseUrls[key] = baseUrl
			},

			// 此接口暂未开放
			registerOpenID: function (openID) {
				// body...
				if (!this._checkString(openID)) {
					console.error("Register OpenID Fail, Check Input!")
				}

				console.log("Register OpenID Succ!")

				_openID = openID
			},

			_getTag: function () {
				if (_tag === "") {
					_tag = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_SHOT_NAME"]).str
				}

				return _tag
			},

			_makeUrl: function (key, path) {
				// body...
				if (typeof _baseUrls[key] !== "undefined") {
					return _baseUrls[key] + path
				}
				else {
					return ""
				}
			},

			sendJsonOrForm: function (type, key, path, jsonData, cb) {
				// body...
				var self = this
				
				this.isConnected(function ( isConnected ) {
					// body...
					if (isConnected) {
						self._doRequest(self._makeObj(type, key, path, jsonData, cb))
					}
					else {
						if (typeof cb === "function") {
							cb(null)
						}
					}
				})
			},

			// 此接口暂未开放
			sendProto: function (key, path, protoData, cb) {
				// body...
				var self = this

				this.isConnected(function ( isConnected ) {
					// body...
					if (isConnected) {
						self._doRequest(self._makeObj("sendProto", key, path, protoData, cb))
					}
					else {
						if (typeof cb === "function") {
							cb(null)
						}
					}
				})
			},

			reqLogin: function ( code, cb ) {
				// body...
				let sendObj = {
					code: code
				}

				if (G_PlatHelper.isQQPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_MINI_PROGRAM_APP_ID"]).str
					this.sendJsonOrForm("sendForm", this._getTag(), "/qq/login", sendObj, cb)
				}
				else if (G_PlatHelper.isTTPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_MINI_PROGRAM_APP_ID"]).str
					this.sendJsonOrForm("sendForm", this._getTag(), "/tt/login", sendObj, cb)
				}
				else {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MINI_PROGRAM_APP_ID"]).str
					this.sendJsonOrForm("sendForm", this._getTag(), "/wx/login", sendObj, cb)
				}
			},

			reqCheckLogin: function ( sessid, cb ) {
				// body...
				let sendObj = {
					JavasessionId: sessid
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/wx/checkLogin", sendObj, cb)
			},

			reqLoadPlayerInfo: function ( sessID, cb ) {
				// body...
				let sendObj = {
					JavasessionId: sessID
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/wx/getWxUserInfo", sendObj, cb)
			},

			reqSavePlayerInfo: function ( sessID, szStatus, cb ) {
				// body...
				let sendObj = {
					JavasessionId: sessID,
					selfStore: szStatus
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/wx/setWxUserInfo", sendObj, cb)
			},

			reqLoadPlayerInfo_WithOpenID: function ( openID, cb ) {
				// body...
				let sendObj = {
					openId: openID
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/getUserInfo", sendObj, cb)
			},

			reqSavePlayerInfo_WithOpenID: function ( openID, szStatus, cb ) {
				// body...
				let sendObj = {
					openId: openID,
					selfStore: szStatus
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/setUserInfo", sendObj, cb)
			},

			reqGetServerTime: function ( cb ) {
				// body...
				this.sendJsonOrForm("sendForm", this._getTag(), "/wx/getTime", null, cb)
			},

			reqGetWebConfig: function ( cb ) {
				let sendObj = {}

				if (G_PlatHelper.isQQPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_MINI_PROGRAM_APP_ID"]).str
				}
				else if (G_PlatHelper.isTTPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_MINI_PROGRAM_APP_ID"]).str
				}
				else if (G_PlatHelper.isOPPOPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_OPPO_MINI_PROGRAM_APP_ID"]).str
				}
				else if (G_PlatHelper.isVIVOPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_VIVO_MINI_PROGRAM_APP_ID"]).str
				}
				else if (G_PlatHelper.isQTTPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_ID"]).str
				}
				else if (G_PlatHelper.isMZPlatform()) {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MZ_MINI_PROGRAM_APP_ID"]).str
				}
				else {
					sendObj.app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MINI_PROGRAM_APP_ID"]).str
				}

				// send
				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/earnGameCfg", sendObj, cb)
			},

			reqDepositMoney: function ( sessID, depositType, money, cb ) {
				let sendObj = {
					JavasessionId: sessID,
					money: money
				}

				let optionObj = {
					depositType: depositType
				}

				sendObj.opts = JSON.stringify(optionObj)

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/depositMoney", sendObj, cb)
			},

			reqWithdrawMoney: function ( sessID, money, advTimesOfToday, totalAdvTimes, cb ) {
				let sendObj = {
					JavasessionId: sessID,
					money: money
				}

				let optionObj = {
					advTimesOfToday: advTimesOfToday,
					totalAdvTimes: totalAdvTimes
				}

				sendObj.opts = JSON.stringify(optionObj)

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/withdrawMoney", sendObj, cb)
			},

			reqWithdrawEverydayMoney: function ( sessID, money, advTimesOfToday, totalAdvTimes, recordDayOfEverydayMoney, cb ) {
				let sendObj = {
					JavasessionId: sessID,
					money: money
				}

				let optionObj = {
					advTimesOfToday: advTimesOfToday,
					totalAdvTimes: totalAdvTimes,
					recordDayOfEverydayMoney: recordDayOfEverydayMoney
				}

				sendObj.opts = JSON.stringify(optionObj)

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/withdrawEverydayMoney", sendObj, cb)
			},

			reqReportMyVideoRankInfos: function (rankInfos, cb) {
				let sendObj = {
					opts: JSON.stringify(rankInfos)
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/rankingReport", sendObj, cb)
			},

			reqAllVideoRankInfos: function (cb) {
				let sendObj = {
					order_field: "digg",
					order_type: "desc"
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/pip/rankingSort", sendObj, cb)
			},

			reqNotifyAllOnceSubscribers: function (sessID, tmplIds, cb) {
				let sendObj = {
					JavasessionId: sessID,
					tmplIds: JSON.stringify(tmplIds)
				}

				this.sendJsonOrForm("sendForm", this._getTag(), "/gmsgcfg/pushBsis", sendObj, cb)
			},

			_makeObj: function (way, key, path, data, cb) {
				// body...
				let obj = {
					way: way,
					key: key,
					path: path,
					data: data,
					cb: cb,
					try_times: 0
				}

				return obj
			},

			_doRequest: function (obj) {
				// body...
				if (obj) {
					var self = this

					let callback = function (bSucc, data) {
						// body...
						if (bSucc) {
							if (typeof obj.cb === "function") {
								let temp_cb = obj.cb
								obj.cb = null

								temp_cb(data)
							}
						}
						else {
							console.log("Request {0} Fail, Reason: {1}".format(obj.path, data))

							if (obj.try_times >= G_SDKCfg.getHttpsCfgs().max_try_send_times) {
								if (typeof obj.cb === "function") {
									let temp_cb = obj.cb
									obj.cb = null

									temp_cb(null)
								}
							}
							else {
								self._doRequest(obj)
							}
						}
					}

					obj.try_times += 1

					// header
					let header = {}
					if (G_PlatHelper.isQQPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_MINI_PROGRAM_APP_ID"]).str
					}
					else if (G_PlatHelper.isTTPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_MINI_PROGRAM_APP_ID"]).str
					}
					else if (G_PlatHelper.isOPPOPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_OPPO_MINI_PROGRAM_APP_ID"]).str
					}
					else if (G_PlatHelper.isVIVOPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_VIVO_MINI_PROGRAM_APP_ID"]).str
					}
					else if (G_PlatHelper.isQTTPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_ID"]).str
					}
					else if (G_PlatHelper.isMZPlatform()) {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MZ_MINI_PROGRAM_APP_ID"]).str
					}
					else {
						header.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MINI_PROGRAM_APP_ID"]).str
					}

					if (obj.way === "sendJson") { 
						G_HttpHelper.sendJson(this._makeUrl(obj.key, obj.path), header, obj.data, callback)
					}
					else if (obj.way === "sendForm") {
						G_HttpHelper.sendForm(this._makeUrl(obj.key, obj.path), header, obj.data, callback)
					}
					else if (obj.way === "sendProto") {
						G_HttpHelper.sendProto(this._makeUrl(obj.key, obj.path), header, obj.data, callback)
					}
					else {
						console.error("Do Not Support This Kind Of Request Right Now, Way: {0}".format(obj.way))
						callback(false, null)
					}
				}
			},

			_checkString: function (title) {
				// body...
				if (typeof title === "string" && title !== "") {
					return true
				}
				else {
					return false
				}
			},

			_makeRequestProto: function (reqID) {
				// body...
				let requestProto = new db["RequestServer"]()

				if (requestProto) {
					requestProto.reqID = reqID

					if (_openID) {
						requestProto.openID = _openID
					}

					return requestProto
				}
				
				return null
			}
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();

				// init...
				_instance.init()
			}

			return _instance;
		}
	};
})();

// export
export {_NetHelper}