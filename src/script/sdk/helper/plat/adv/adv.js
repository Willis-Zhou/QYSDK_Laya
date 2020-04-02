import AdvBase from "./adv_base";

class UnSupportAdv extends AdvBase {
    constructor() {
		super()
    }
}

class WXAdv extends AdvBase {
    constructor() {
		super()
    }

	_registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs) {
		if (bannerAdUnitIDs.length === 0) {
			bannerAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_BANNER_AD_UNIT_IDS"]).str.split("||")
		}

		if (videoAdUnitIDs.length === 0) {
			videoAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_VIDEO_AD_UNIT_IDS"]).str.split("||")
		}

		if (interstitialAdUnitIDs.length === 0) {
			interstitialAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_INTERSTITIAL_AD_UNIT_IDS"]).str.split("||")
		}

		// register
		super._registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs)
	}

	// 内部接口
	_doCreateBannerAdObj(platformStyle, loadCb, errCb) {
		// default platform style
		let bannerAdObj = super._doCreateBannerAdObj(platformStyle, loadCb, errCb)

		return bannerAdObj
	}

	_getDefaultPlatformStyle() {
		return {
			left: 0,
			top: 0,
			width: 300
		}
	}

	_getBannerOriginalSize() {
		return {
			width: 960,
			height: 334
		}
	}

	_fixedStyle( style ) {
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
}

class QQAdv extends AdvBase {
    constructor() {
		super()
	}
	
	_registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs) {
		if (bannerAdUnitIDs.length === 0) {
			bannerAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_BANNER_AD_UNIT_IDS"]).str.split("||")
		}

		if (videoAdUnitIDs.length === 0) {
			videoAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_VIDEO_AD_UNIT_IDS"]).str.split("||")
		}

		if (interstitialAdUnitIDs.length === 0) {
			interstitialAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_INTERSTITIAL_AD_UNIT_IDS"]).str.split("||")
		}

		// register
		super._registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs)
	}

	// 内部接口
	_doCreateBannerAdObj(platformStyle, loadCb, errCb) {
		// default platform style
		let bannerAdObj = super._doCreateBannerAdObj(platformStyle, loadCb, errCb)

		return bannerAdObj
	}

	_getDefaultPlatformStyle() {
		return {
			left: 0,
			top: 0,
			width: 300
		}
	}

	_getBannerOriginalSize() {
		return {
			width: 960,
			height: 223
		}
	}

	_fixedStyle( style ) {
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
}

class TTAdv extends AdvBase {
    constructor() {
		super()
	}
	
	_registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs) {
		if (bannerAdUnitIDs.length === 0) {
			bannerAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_BANNER_AD_UNIT_IDS"]).str.split("||")
		}

		if (videoAdUnitIDs.length === 0) {
			videoAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_VIDEO_AD_UNIT_IDS"]).str.split("||")
		}

		if (interstitialAdUnitIDs.length === 0) {
			interstitialAdUnitIDs = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_INTERSTITIAL_AD_UNIT_IDS"]).str.split("||")
		}

		// register
		super._registerAdUnitIDs(bannerAdUnitIDs, videoAdUnitIDs, interstitialAdUnitIDs)
	}

	// 内部接口
	_doCreateBannerAdObj(platformStyle, loadCb, errCb) {
		let bannerAdObj = super._doCreateBannerAdObj(platformStyle, loadCb, errCb)

		const { windowWidth, windowHeight } = tt.getSystemInfoSync()
		bannerAdObj.onResize(size => {
			bannerAdObj.style.top = windowHeight - size.height
			bannerAdObj.style.left = (windowWidth - size.width) / 2
		})

		return bannerAdObj
	}

	_getDefaultPlatformStyle() {
		return {
			left: 0,
			top: 0,
			width: 128
		}
	}

	_caculateRealWidth( bannerWidth ) {
		return bannerWidth / 208 * 300
	}

	_getBannerOriginalSize() {
		return {
			width: 960,
			height: 336
		}
	}

	_fixedStyle( style ) {
		// body...
		if (style) {
			if (typeof style.width !== "number") {
				// default
				style.width = 128
			}

			if (style.width < 128) {
				// at least 128
				style.width = 128
			}
		}
	}
}

var _Adv = null

if (typeof window.qq !== "undefined") {
    _Adv = QQAdv
}
else if (typeof window.tt !== "undefined") {
    _Adv = TTAdv
}
else if (typeof window.wx !== "undefined") {
    _Adv = WXAdv
}
else {
    _Adv = UnSupportAdv
}

export {_Adv}