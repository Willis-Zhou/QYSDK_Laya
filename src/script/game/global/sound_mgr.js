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
					if (typeof url === "string" && url !== "") {
						Laya.SoundManager.playSound(url, loops)
					}
				}
			},

			stopSound: function ( url ) {
				if (typeof url === "string" && url !== "") {
					Laya.SoundManager.stopSound(url)
				}
			},

			playMusic: function ( url ) {
				if (G_PlayerInfo.isSoundEnable()) {
					if (typeof url === "string" && url !== "") {
						_bgmUrl = url
						Laya.SoundManager.playMusic(url, 0)
					}
				}
			},

			stopMusic: function () {
				if (_bgmUrl !== "") {
					_bgmUrl = ""
					Laya.SoundManager.stopMusic()
				}
			},

			pauseMusic: function () {
				Laya.SoundManager.stopMusic()
			},

			resumeMusic: function () {
				if (G_PlayerInfo.isSoundEnable()) {
					if (_bgmUrl !== "") {
						this.playMusic(_bgmUrl)
					}
				}
			},

			setSoundEnable: function ( isEnabled ) {
				// body...
				if (G_PlayerInfo.isSoundEnable() !== isEnabled) {
					G_PlayerInfo.setSoundEnable(isEnabled)

					if (isEnabled && _bgmUrl !== "") {
						this.playMusic(_bgmUrl)
					}
					else if (!isEnabled && _bgmUrl !== "") {
						Laya.SoundManager.stopMusic()
					}
				}
			},

			isSoundEnable: function () {
				return G_PlayerInfo.isSoundEnable()
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