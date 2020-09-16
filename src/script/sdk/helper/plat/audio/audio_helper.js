import AudioBaseHelper from "./audio_base_helper";

class CommonAudioHelper extends AudioBaseHelper {
    constructor() {
		super()
	}
	
	_isSupportAudioContext() {
		if (G_PlatHelper.isMZPlatform()) {
			return false
		}
		else {
			return G_PlatHelper.getPlat()
		}
	}

	_isSupportNativeUrl() {
		return true
	}
}

class OPPOAudioHelper extends AudioBaseHelper {
    constructor() {
		super()
	}

	_isSupportAudioContext() {
		return true
	}

	_isSupportNativeUrl() {
		return false
	}
}

class VIVOAudioHelper extends AudioBaseHelper {
    constructor() {
		super()
	}

	_isSupportAudioContext() {
		return true
	}

	_isSupportNativeUrl() {
		return false
	}
	
	_recycleAudioContext(context) {
		let playingIndex = this._playingContexts.indexOf(context)
		if (playingIndex !== -1) {
			this._playingContexts.splice(playingIndex, 1)
		}

		if (context) {
			context.destroy()
		}
	}
}

var _AudioHelper = null

if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("oppo") > -1)) {
	_AudioHelper = OPPOAudioHelper
}
else if (typeof window.qg !== "undefined" && (window.qg.getProvider().toLowerCase().indexOf("vivo") > -1)) {
    _AudioHelper = VIVOAudioHelper
}
else {
    _AudioHelper = CommonAudioHelper
}

export {_AudioHelper}