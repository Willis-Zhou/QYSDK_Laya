/*
* 音乐音效管理
*/
export default class AudioBaseHelper {
	constructor() {
		this._isInited = false
		this._playingContexts = []
		this._backupContexts = []
		this._bgAudioContext = null
		this._bgMusicUrl = ""
		this._bgNativeAudio = null
	}

	init() {
		if (this._isInited) {
			return
		}

		// mark
		this._isInited = true

		if (this._isSupportAudioContext()) {
			// get bg audio context
			this._bgAudioContext = this._getAudioContext()
			if (this._bgAudioContext) {
				this._bgAudioContext._bgSrc = ""
			}
		}
	}

	_isSupportAudioContext() {
		return true
	}

	_isSupportNativeUrl() {
		return true
	}

	_getAudioContext() {
		let audioContext = null

		if (this._isSupportAudioContext()) {
			if (this._backupContexts.length > 0) {
				audioContext = this._backupContexts[0]
				this._backupContexts.splice(0, 1)
			}
			else {
				audioContext = G_PlatHelper.getPlat().createInnerAudioContext()
				audioContext.onError(err => {
					console.log("play error:", err)
				})
			}
		}

		this._playingContexts.push(audioContext)

		return audioContext
	}

	_recycleAudioContext(context) {
		let playingIndex = this._playingContexts.indexOf(context)
		if (playingIndex !== -1) {
			this._playingContexts.splice(playingIndex, 1)
		}

		this._backupContexts.push(context)
	}

	loadSound(url, cb) {
		this.init()

		if (!this._checkUrl(url)) {
			if (typeof cb === "function") {
				cb(null)
			}
			return
		}

		if (url.indexOf("http") < 0 && !this._isSupportNativeUrl()) {
			if (typeof cb === "function") {
				cb(null)
			}
			return
		}

		if (this._isSupportAudioContext()) {
			let audioContext = this._getAudioContext()

			// check
			if(audioContext.src == url) {
				if (typeof cb === "function") {
					cb(audioContext)
				}
				return
			}

			// set
			audioContext.src = url
			audioContext.loop = false
			audioContext.autoplay = false
			
			let canPlayCb = () => {
				// off
				audioContext.offCanplay(canPlayCb)

				if (typeof cb === "function") {
					cb(audioContext)
				}
			}
			
			// on
			audioContext.onCanplay(canPlayCb)
		}
		else {
			if (typeof cb === "function") {
				cb(null)
			}
		}
	}

	loadMusic(url, isLoop, cb) {
		this.init()

		if (!this._checkUrl(url)) {
			if (typeof cb === "function") {
				cb(null)
			}
			return
		}

		if (url.indexOf("http") < 0 && !this._isSupportNativeUrl()) {
			if (typeof cb === "function") {
				cb(null)
			}
			return
		}

		if(this._isSupportAudioContext()) {
			// check
			if(this._bgAudioContext.src == url) {
				// set
				this._bgAudioContext._bgSrc = url
				this._bgAudioContext.loop = isLoop

				if (typeof cb === "function") {
					cb(this._bgAudioContext)
				}
				return
			}

			// set
			this._bgAudioContext.src = url
			this._bgAudioContext._bgSrc = url
			this._bgAudioContext.loop = isLoop
			this._bgAudioContext.autoplay = false
			
			let canPlayCb = () => {
				this._bgAudioContext.offCanplay(canPlayCb)

				if (typeof cb === "function") {
					cb(this._bgAudioContext)
				}
			}
			
			this._bgAudioContext.onCanplay(canPlayCb)
		}
		else {
			if (typeof cb === "function") {
				cb(null)
			}
		}
	}

	playSound(url, loops = 1) {
		this.init()

		if (!this._checkUrl(url)) {
			return
		}

		if (url.indexOf("http") < 0 && !this._isSupportNativeUrl()) {
			Laya.SoundManager.playSound(url, loops, null, 0)
			return
		}

		if(this._isSupportAudioContext()) {
			this.loadSound(url, audioContext => {
				if (audioContext) {
					let endCb = () => {
						loops -= 1

						if (loops === 0) {
							audioContext.offEnded(endCb)

							// recycle
							this._recycleAudioContext(audioContext)
						}
						else {
							audioContext.seek(0)
							audioContext.play()
						}
					}
	
					audioContext.loop = false
					audioContext.seek(0)
					audioContext.play()
					audioContext.onEnded(endCb)
				}
			})
		}
		else {
			Laya.SoundManager.playSound(url, loops, null, 0)
		}
	}

	stopSound(url) {
		if (!this._checkUrl(url)) {
			return
		}

		if (url.indexOf("http") < 0 && !this._isSupportNativeUrl()) {
			Laya.SoundManager.stopSound(url)
			return
		}

		if(this._isSupportAudioContext()) {
			for (let index = 0; index < this._playingContexts.length; index++) {
				let audioContext = this._playingContexts[index]
				if (audioContext.src === url) {
					audioContext.stop()

					// recycle
					this._recycleAudioContext(audioContext)
				}
			}
		}
		else {
			Laya.SoundManager.stopSound(url)
		}
	}

	playMusic(url) {
		this.init()

		if (!this._checkUrl(url)) {
			return
		}

		if (url.indexOf("http") < 0 && !this._isSupportNativeUrl()) {
			this._bgMusicUrl = url
			this._bgNativeAudio = Laya.SoundManager.playMusic(url, 0)
			this._bgNativeAudio.volume = 1
			return
		}
		
		if (this._isSupportAudioContext()) {
			this.loadMusic(url, true, bgAudioContext => {
				if (bgAudioContext) {
					let endCb = () => {
						bgAudioContext.offEnded(endCb)
						this._recycleAudioContext(bgAudioContext)
					}
	
					bgAudioContext.volume = 1
					bgAudioContext.seek(0)
					bgAudioContext.play()
					bgAudioContext.onEnded(endCb)
				}
			})
		}
		else { 
			this._bgMusicUrl = url
			this._bgNativeAudio = Laya.SoundManager.playMusic(url, 0)
			this._bgNativeAudio.volume = 1
		}
	}

	stopMusic() {
		if (this._bgMusicUrl !== "") {
			this._bgMusicUrl = ""
			if (this._bgNativeAudio) {
				this._bgNativeAudio.stop()
				this._bgNativeAudio.volume = 0
				this._bgNativeAudio = null
			}
		}
		else if (this._bgAudioContext) {
			this._bgAudioContext.stop()
			this._bgAudioContext.volume = 0
			this._bgAudioContext._bgSrc = ""
		}
	}

	resumeMusic() {
		if (this._bgMusicUrl !== "") {
			if (this._bgNativeAudio) {
				this._bgNativeAudio.volume = 1
				this._bgNativeAudio.resume()
			}
		}
		else if (this._bgAudioContext && this._bgAudioContext._bgSrc !== "") {
			this._bgAudioContext.volume = 1
			this._bgAudioContext.play()
		}
	}

	pauseMusic() {
		if (this._bgMusicUrl !== "") {
			if (this._bgNativeAudio) {
				this._bgNativeAudio.volume = 0
				this._bgNativeAudio.pause()
			}
		}
		else if (this._bgAudioContext) {
			this._bgAudioContext.pause()
			this._bgAudioContext.volume = 0
		}
	}

	getCurMusicTime() {
		if (this._bgMusicUrl !== "") {
			if (this._bgNativeAudio) {
				return this._bgNativeAudio.position
			}
		}
		else if (this._bgAudioContext) {
			return this._bgAudioContext.currentTime
		}

		return null
	}

	isMusicUrlValid() {
		if (this._bgMusicUrl !== "" || this._bgAudioContext && this._bgAudioContext._bgSrc !== "") {
			return true
		}
		else {
			return false
		}
	}

	setMusicUrl( url ) {
		if (this._bgAudioContext) {
			this._bgAudioContext._bgSrc = url
		}
		else {
			this._bgMusicUrl = url
		}
	}

	_checkUrl( url ) {
		if (typeof url === "string" && url !== "") {
			return true
		}
		else {
			return false
		}
	}
}