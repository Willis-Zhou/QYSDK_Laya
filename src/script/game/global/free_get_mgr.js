/*
* 免费获取管理
*/
var _FreeGetMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_FreeGetMgr Instance...")

		return {
			getNextFreeGetWay: function ( cb ) {
				// body...
				if (typeof cb !== "function") {
					return
				}

				if (G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isVIVOPlatform()) {
					if (G_OVAdv.isSupportVideo()) {
						cb(G_FreeGetWay.FGW_ADV)
					}
					else {
						cb(G_FreeGetWay.FGW_NONE)
					}
				}
				else if (G_PlatHelper.isTTPlatform()) {
					if (G_Adv.isSupportVideoAd()) {
						cb(G_FreeGetWay.FGW_ADV)
					}
					else {
						cb(G_FreeGetWay.FGW_NONE)
					}
				}
				else {
					G_PlayerInfo.isNoMoreAdvTimesToday(function( isNoMore ) {
						if (isNoMore) {
							cb(G_FreeGetWay.FGW_NONE)
						}
						else {
							G_Switch.isPublishing(function ( isPublishing ) {
								if (isPublishing) {
									if (G_Adv.isSupportVideoAd()) {
										cb(G_FreeGetWay.FGW_ADV)
									}
									else {
										cb(G_FreeGetWay.FGW_NONE)
									}
								}
								else {
									G_Switch.getAdvTimesBeforeShare(function ( times ) {
										// body...
										if (G_PlayerInfo.getTodayAdvTimes() < times) {
											cb(G_FreeGetWay.FGW_ADV)
										}
										else {
											if (G_Adv.isSupportVideoAd()) {
												G_Switch.getRateOfShare(function ( rate ) {
													if (G_Utils.random(1, 100) <= rate) {
														cb(G_FreeGetWay.FGW_SHARE)
													}
													else {
														cb(G_FreeGetWay.FGW_ADV)
													}
												})
											}
											else {
												cb(G_FreeGetWay.FGW_SHARE)
											}
										}
									})
								}
							})
						}
					})
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
window.G_FreeGetMgr = _FreeGetMgr.getInstance()