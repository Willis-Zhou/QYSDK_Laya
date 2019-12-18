/*
* 音乐音效管理
*/
var _SoundMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_SoundMgr Instance...")

		return {
			playSound: function ( url, isLoop ) {
				if (G_PlayerInfo.isSoundEnable()) {
					if (typeof url === "string" && url !== "") {
						if (isLoop) {
							Laya.SoundManager.playSound(url, 0)
						}
						else {
							Laya.SoundManager.playSound(url, 1)
						}
					}
				}
			},

			stopSound: function (url) {
				if (typeof url === "string" && url !== "") {
					Laya.SoundManager.stopSound(url)
				}
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