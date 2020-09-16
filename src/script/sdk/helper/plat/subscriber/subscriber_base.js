var SK_FORMAT_OF_SUBSCRIBE_FOREVER_DAY = "subscribe_forever_day_of_player_{0}"

var getSubscribeForeverDay = function () {
    let save_str = G_PlatHelper.getStorage(SK_FORMAT_OF_SUBSCRIBE_FOREVER_DAY.format(G_PlayerInfo.getOpenID()))

	if (save_str && save_str !== "") {
        return parseInt(save_str, 10)
    }

    return 0
}

var setSubscribeForeverDay = function ( day ) {
    G_PlatHelper.setStorage(SK_FORMAT_OF_SUBSCRIBE_FOREVER_DAY.format(G_PlayerInfo.getOpenID()), day.toString())
}

/*
* 订阅管理
*/
export default class SubscriberBase {
	constructor() {
		// log
		console.log('Init G_Subscriber Instance...')

		this._onceTmplIds = {}
		this._foreverTmplIds = {}
	}

	// 添加一次性订阅模板ID
	addOnceTmplId( key, value ) {
		// body...
		if (typeof this._onceTmplIds[key] === "undefined") {
			this._onceTmplIds[key] = value
		}
		else {
			console.error("once tmplId: {0} has been added before...".format(key))
		}
	}

	// 添加长期订阅模板ID
	addForeverTmplId( key, value ) {
		// body...
		if (typeof this._foreverTmplIds[key] === "undefined") {
			this._foreverTmplIds[key] = value
		}
		else {
			console.error("forever tmplId: {0} has been added before...".format(key))
		}
	}

	// 是否支持一次性订阅
	isSupportOnce() {
		return false
	}

	// 是否支持长期订阅
	isSupportForever() {
		return false
	}

	reqSubscribeOnceMsgs( keys, cb ) {
		let doCb = bSucc => {
			if (typeof cb === "function") {
				cb(bSucc)
			}
		}

		if (!this.isSupportOnce()) {
			console.warn("reqSubscribeOnceMsgs fail, not support on this plat...")
			doCb(false)
			return
		}

		let tmplIds = []
		if (typeof keys === "string" && typeof this._onceTmplIds[keys] !== "undefined") {
			tmplIds.push(this._onceTmplIds[keys])
		}
		else if (Array.isArray(keys)) {
			keys.forEach(key => {
				if (typeof this._onceTmplIds[key] !== "undefined") {
					if (tmplIds.length < 3) {
						tmplIds.push(this._onceTmplIds[key])
					}
				}
			})
		}

		if (tmplIds.length === 0) {
			console.error("reqSubscribeOnceMsgs fail, check web config...")
			doCb(false)
			return
		}
		else {
			let func = this._getSubscribeFunc()
			func(this._fillSubscribeOnceObj(tmplIds, doCb))
		}
	}

	reqSubscribeAllForeverMsgs( cb ) {
		let doCb = bSucc => {
			if (typeof cb === "function") {
				cb(bSucc)
			}
		}

		if (!this.isSupportForever()) {
			console.warn("reqSubscribeAllForeverMsgs fail, not support on this plat...")
			doCb(false)
			return
		}

		if (G_ServerInfo.getCurServerDayOfYear() === getSubscribeForeverDay()) {
			console.warn("reqSubscribeAllForeverMsgs fail, has been subscribed today...")
			doCb(false)
			return
		}

		let func = this._getSubscribeFunc()
		func(this._fillSubscribeForeverObj(cb))
	}

	_fillSubscribeOnceObj( tmplIds, cb ) {
		let obj = {
			tmplIds: tmplIds,
			subscribe: true,
			success: (res) => {
				let isAllAccept = true
				let accpetTmplIds = []
				if (tmplIds && tmplIds.length > 0) {
					for (let i = 0; i < tmplIds.length; i++) {
						const tmplId = tmplIds[i]
						if (res[tmplId] === "reject") {
							isAllAccept = false
						}
						else if (res[tmplId] === "accept") {
							accpetTmplIds.push(tmplId)
						}
					}
				}

				if (accpetTmplIds.length > 0) {
					G_NetHelper.reqNotifyAllOnceSubscribers(G_PlayerInfo.getSessID(), accpetTmplIds, jsonData => {
						if (jsonData.code === 0) {
							console.log("notify all once subscribers succ...")
						}
						else {
							console.log("notify all once subscribers fail...")
						}
					})
				}

				if (typeof cb === "function") {
					cb(isAllAccept)
				}
			},
			fail: () => {
				this._doCheckSetting(tmplIds, isNeedOpenSetting => {
					if (isNeedOpenSetting) {
						this._doTryOpenSetting(cb)
					}
					else {
						if (typeof cb === "function") {
							cb(false)
						}
					}
				})
			}
		}

		return obj
	}

	_fillSubscribeForeverObj( cb ) {
		let obj = {
			subscribe: true,
			success: () => {
				// save
				setSubscribeForeverDay(G_ServerInfo.getCurServerDayOfYear())

				if (typeof cb === "function") {
					cb(true)
				}
			},
			fail: () => {
				this._doCheckSetting(null, isNeedOpenSetting => {
					if (isNeedOpenSetting) {
						this._doTryOpenSetting(cb)
					}
					else {
						if (typeof cb === "function") {
							cb(false)
						}
					}
				})
			}
		}

		return obj
	}

	_getSubscribeFunc() {
		return null
	}

	_doCheckSetting(tmplIds, cb) {
		if (typeof cb === "function") {
			cb(false)
		}
	}

	_doTryOpenSetting( cb ) {
		G_PlatHelper.showModal(
			null,
			G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SUBSCRIBE_FAIL_CONTENT"]).word,
			true,
			function ( bOK ) {
				// body...
				if (bOK) {
					if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().openSetting) {
						G_PlatHelper.getPlat().openSetting({
							complete: () => {
								if (typeof cb === "function") {
									cb(true)
								}
							}
						})
					}
				}
				else {
					if (typeof cb === "function") {
						cb(false)
					}
				}
			}, {
				confirmText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SUBSCRIBE_FAIL_CONFIRM_TEXT"]).word, 
				cancelText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SUBSCRIBE_FAIL_CANCEL_TEXT"]).word
			}
		)
	}
}