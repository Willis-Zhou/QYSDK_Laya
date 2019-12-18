var KEY_OF_SCHEDULE_OF_DOWNLOADER = "Schedule_Of_Downloader"

/*
* 下载器
*
*/
var _Downloader = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Downloader Instance...")

		var _downloadingList = {count: 0}
		var _waitingList = []
		var _inited = false

		return {
			init: function () {
				// body...
				if (window.wx) {
					let rootDir = this._getDownloadRootDir()
					let fs = wx.getFileSystemManager()
		
					try {
						fs.accessSync(rootDir)
						_inited = true
					}
					catch (e) {
						try {
							fs.mkdirSync(rootDir, true)
							_inited = true
						}
						catch (e) {
							// notify
							G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
						}
					}
				}
			},
		
			// @param fileBody 存储路径（不含后缀）,无效则随机生成
			// @param url 网络路径
			// @param cb 回调
			download: function ( fileBody, url, cb ) {
				// body...
				if (window.wx) {
					if (!this._isUrlValid(url)) {
						return
					}
		
					let taskInfo = {
						fileBody: fileBody,
						url: url,
						task: null,
						cbs: []
					}
					taskInfo.cbs.push(cb)
		
					// push into wait list
					_waitingList.push(taskInfo)
		
					// schedule
					if (!this._isScheduled()) {
						this._schedule()
					}
				}
			},
		
			_isUrlValid: function ( url ) {
				// body...
				if (typeof url !== "string" || url.indexOf("https://") !== 0) {
					console.error("Download Url Error, Check Input!")
					return false
				}
		
				return true
			},
		
			_doDownload: function ( taskInfo ) {
				// body...
				if (taskInfo) {
					let _taskInfo = _downloadingList[taskInfo.url]
		
					if (typeof _taskInfo !== "undefined") {
						for (let i = 0; i < taskInfo.cbs.length; i++) {
							_taskInfo.cbs.push(taskInfo.cbs[i])
						}
		
						return
					}
					else {
						if (window.wx) {
							let saveFilePath = this._makeSaveFilePath(taskInfo.fileBody, taskInfo.url)
		
							if (this._isTargetFileExist(saveFilePath)) {
								// succ
								this._doCallback(taskInfo, 1, undefined, saveFilePath)
							}
							else {
								var self = this
		
								taskInfo.task = window.wx.downloadFile({
									url: taskInfo.url,
									filePath: saveFilePath,
									success: function ( res ) {
										// body...
										if (res.statusCode === 200) {
											// succ
											self._doCallback(taskInfo, 1, undefined, saveFilePath)
										}
										else {
											// fail
											self._doCallback(taskInfo, -1)
										}
									},
									fail: function ( res ) {
										// body...
										// fail
										self._doCallback(taskInfo, -1)
									},
									complete: function (res) {
										// body...
										if (typeof self._downloadingList[taskInfo.url] !== "undefined") {
											delete self._downloadingList[taskInfo.url]
											self._downloadingList.count -= 1
										}
									}
								})
		
								taskInfo.task.onProgressUpdate(function (res) {
									// body...
									// progress
									self._doCallback(taskInfo, 0, res.progress)
								})
		
								// add into downloading list
								_downloadingList[taskInfo.url] = taskInfo
								_downloadingList.count += 1
							}
						}
						else {
							this._doCallback(taskInfo, -1)
						}
					}
				}
			},
		
			// @param statusCode -1: 失败, 0: 正在下载, 1: 成功
			// @param progress 进度 statusCode为0时有效
			// @param savePath 存储路径
			_doCallback: function ( taskInfo, statusCode, progress, relativePath ) {
				// body...
				if (taskInfo) {
					for (let i = 0; i < taskInfo.cbs.length; i++) {
						let cb = taskInfo.cbs[i]
		
						if (typeof cb === "function") {
							cb(statusCode, progress, relativePath)
						}
					}
				}
			},
		
			_update: function () {
				// body...
				if (!_inited) {
					return
				}
		
				if (_downloadingList.count >= MAX_DOWNLOADING_COUNT) {
					console.warn("Max Download Connections, Waiting...")
					return
				}
		
				if (_waitingList.length > 0) {
					this._doDownload(_waitingList[0])
					_waitingList.splice(0, 1)
				}
				else {
					// unschedule
					this._unschedule()
				}
			},
		
			_isTargetFileExist: function ( filePath ) {
				// body...
				if (window.wx) {
					if (typeof filePath === "string" && filePath !== "") {
						try {
							let fs = wx.getFileSystemManager()
							fs.accessSync(filePath)
		
							return true
						}
						catch (e) {
							return false
						}
					}
					else {
						return false
					}
				}
				else {
					return false
				}
			},
		
			_makeSaveFilePath: function ( body, url ) {
				// body...
				if (window.wx) {
					let ext = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2)
		
					if (typeof body === "string" && body !== "") {
						return this._getDownloadRootDir() + "/" + body + "." + ext
					}
					else {
						return this._getDownloadRootDir() + "/" + hex_md5(url) + "." + ext
					}
				}
				else {
					return url
				}
			},
		
			_getDownloadRootDir: function () {
				// body...
				if (window.wx) {
					return window.wx.env.USER_DATA_PATH + "/" + DIR_NAME_OF_DOWNLOAD
				}
				else {
					return url
				}
			},
		
			_schedule: function () {
				// body...
				if (this._isScheduled()) {
					return
				}
		
				G_Scheduler.schedule(KEY_OF_SCHEDULE_OF_DOWNLOADER, function () {
					this._update()
				}.bind(this), true)
			},
		
			_isScheduled: function () {
				// body...
				return G_Scheduler.isScheduled(KEY_OF_SCHEDULE_OF_DOWNLOADER)
			},
		
			_unschedule: function () {
				// body...
				G_Scheduler.unschedule(KEY_OF_SCHEDULE_OF_DOWNLOADER)
			},
		}
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
}();

// export
export {_Downloader}