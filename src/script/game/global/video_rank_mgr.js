/*
* 视频排行管理
*/
var _VideoRankMgr = function() {
	var _instance;

	var SK_FORMAT_OF_MY_VIDEO_IDS = "my_video_ids_of_player_{0}"

	var getAllMyVideoIds = function () {
		let save_list_str = G_PlatHelper.getStorage(SK_FORMAT_OF_MY_VIDEO_IDS.format(G_PlayerInfo.getOpenID()))
		if (save_list_str && save_list_str !== "") {
			let save_list = JSON.parse(save_list_str)
			return save_list
		}

		return []
	}

	var addNewVideoIds = function ( videoId ) {
		let save_list_str = G_PlatHelper.getStorage(SK_FORMAT_OF_MY_VIDEO_IDS.format(G_PlayerInfo.getOpenID()))

		let save_list = null
		if (save_list_str && save_list_str !== "") {
			save_list = JSON.parse(save_list_str)
		}
		else {
			save_list = []
		}

		// add
		save_list.push(videoId)
		
		// save
		G_PlatHelper.setStorage(SK_FORMAT_OF_MY_VIDEO_IDS.format(G_PlayerInfo.getOpenID()), JSON.stringify(save_list))
	}

	function init() {
		// body ...
		console.log("Init G_VideoRankMgr Instance...")

		return {
			refreshAndReport() {
				if (!G_PlatHelper.isTTPlatform()) {
					return
				}

				let myVideoIds = getAllMyVideoIds()

				if (myVideoIds.length > 0) {
					G_PlatHelper.getPlat().request({
						url: "https://gate.snssdk.com/developer/api/get_video_info",
						method: "POST",
						data: {
							alias_ids: myVideoIds,
						},
						success: res => {
							if (res.data && res.data.data && res.data.data.length > 0) {
								let allVideoInfos = []
								res.data.data.forEach(each => {
									allVideoInfos.push({
										videoId: each.alias_id,
										digg: each.video_info.digg_count,
										coverUrl: each.video_info.cover_url
									})
								})

								// request report
								G_NetHelper.reqReportMyVideoRankInfos(allVideoInfos, jsonData => {
									if (jsonData.code === 0) {
										console.log("report my video infos succ...")
									}
									else {
										console.log("report my video infos fail...")
									}
								})
							}
						}
					})
				}
			},

			recordMyNewVideoId( videoId ) {
				if (!G_PlatHelper.isTTPlatform()) {
					return
				}

				// record
				addNewVideoIds(videoId)

				// refresh and report
				this.refreshAndReport()
			},

			getAllVideoRankInfo( cb ) {
				if (!G_PlatHelper.isTTPlatform()) {
					return
				}

				if (typeof cb === "function") {
					G_NetHelper.reqAllVideoRankInfos(jsonData => {
						if (jsonData.code === 0) {
							cb(jsonData.data)
						}
						else {
							cb([])
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
window.G_VideoRankMgr = _VideoRankMgr.getInstance()