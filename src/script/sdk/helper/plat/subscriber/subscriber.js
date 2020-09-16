import SubscriberBase from "./subscriber_base";

class UnSupportSubscriber extends SubscriberBase {
    constructor() {
		super()
    }

    // 是否支持一次性订阅
	isSupportOnce() {
		return false
	}

	// 是否支持长期订阅
	isSupportForever() {
		return false
	}
}

class WXSubscriber extends SubscriberBase {
    constructor() {
		super()
	}

    // 是否支持一次性订阅
	isSupportOnce() {
		return true
	}

	// 是否支持长期订阅
	isSupportForever() {
		return false
	}

	_doCheckSetting(tmplIds, cb) {
		G_PlatHelper.getPlat().getSetting({
			withSubscriptions: true,
			success: res => {
				if (typeof cb === "function") {
					if (tmplIds && tmplIds.length > 0) {
						for (let i = 0; i < tmplIds.length; i++) {
							const tmplId = tmplIds[i]
							if (res.subscriptionsSetting[tmplId] === "reject") {
								cb(true)
								return
							}
						}
					}

					// no need
					cb(false)
				}
			}
		})
	}

	_getSubscribeFunc() {
		return G_PlatHelper.getPlat().requestSubscribeMessage
	}
}

class QQSubscriber extends SubscriberBase {
    constructor() {
		super()
	}

    // 是否支持一次性订阅
	isSupportOnce() {
		return true
	}

	// 是否支持长期订阅
	isSupportForever() {
		return true
	}

	_doCheckSetting(tmplIds, cb) {
		G_PlatHelper.getPlat().getSetting({
			success: res => {
				if (typeof cb === "function") {
					if ((res.authSetting["setting.appMsgSubscribed"] === false) || (res.authSetting["scope.appMsgSubscribed"] === false)) {
						cb(true)
					}
					else {
						cb(false)
					}
				}
			}
		})
	}

	_getSubscribeFunc() {
		return G_PlatHelper.getPlat().subscribeAppMsg
	}
}

var _Subscriber = null

if (typeof window.qq !== "undefined") {
    _Subscriber = QQSubscriber
}
else if (typeof window.wx !== "undefined") {
    _Subscriber = WXSubscriber
}
else {
    _Subscriber = UnSupportSubscriber
}

export {_Subscriber}