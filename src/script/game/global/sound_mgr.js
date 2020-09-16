/*
* 音乐音效管理
*/
var _SoundMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_SoundMgr Instance...")

		var _bgmUrl = ""

		return {
			playSound: function ( url, loops = 1 ) {
				if (G_PlayerInfo.isSoundEnable()) {
					// fix
					url = this._fixSoundUrl(url)

					G_AudioHelper.playSound(url, loops)
				}
			},

			stopSound: function ( url ) {
				// fix
				url = this._fixSoundUrl(url)

				G_AudioHelper.stopSound(url)
			},

			playMusic: function ( url ) {
				// fix
				url = this._fixSoundUrl(url)

				if (G_PlayerInfo.isSoundEnable()) {
					G_AudioHelper.playMusic(url)
				}
				else {
					G_AudioHelper.setMusicUrl(url)
				}
			},

			stopMusic: function () {
				G_AudioHelper.stopMusic()
			},

			pauseMusic: function () {
				G_AudioHelper.pauseMusic()
			},

			resumeMusic: function () {
				if (G_PlayerInfo.isSoundEnable()) {
					G_AudioHelper.resumeMusic()
				}
			},

			getCurMusicTime() {
				return G_AudioHelper.getCurMusicTime()
			},

			setSoundEnable: function ( isEnabled ) {
				// body...
				if (G_PlayerInfo.isSoundEnable() !== isEnabled) {
					G_PlayerInfo.setSoundEnable(isEnabled)

					if (isEnabled && G_AudioHelper.isMusicUrlValid()) {
						G_AudioHelper.resumeMusic()
					}
					else if (!isEnabled && G_AudioHelper.isMusicUrlValid()) {
						G_AudioHelper.pauseMusic()
					}
				}
			},

			isSoundEnable: function () {
				return G_PlayerInfo.isSoundEnable()
			},

			_fixSoundUrl( url ) {
				if (G_BaseUrlPath !== "") {
					let isLocal = false

					if (G_AppNativefiles.length > 0) {
						for (let i = 0; i < G_AppNativefiles.length; i++) {
							let each = G_AppNativefiles[i]
							if (url.indexOf(each) !== -1) {
								isLocal = true
								break
							}
						}
					}

					if (!isLocal) {
						url = G_BaseUrlPath + url
					}
				}

				return url
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
window.G_SoundMgr = _SoundMgr.getInstance()