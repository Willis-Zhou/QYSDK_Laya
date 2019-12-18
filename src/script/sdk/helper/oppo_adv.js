/*
* oppo广告管理类
* 
*/
var _OppoAdv = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_OppoAdv Instance...')

        var _isSupport = false
        var _configs = null
        var _bannerConfigs = null
        var _videoConfigs = null
        var _insertConfigs = null
        var _onShowBannerObj = null
        var _onShowInsertAd = null

		return {
			init: function () {
                // body...
				if(window.qg) {
                    let oppo_app_id = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_OPPO_MINI_PROGRAM_APP_ID"]).str

                    window.qg.initAdService({
                        appId: oppo_app_id,
                        isDebug: true,
                        success: function(res) {
                            _isSupport = true
                            console.log("initAdService success")
                        },
                        fail: function(res) {
                            console.log("initAdService fail, code: " + res.code + ", msg: " + res.msg)
                        },
                        complete: function(res) {
                            console.log("initAdService complete")
                        }
                    })
                }
			},

			isSupport: function () {
				// body...
				return _isSupport
            },

            registerAll: function (configs) {
				// body...
				if (configs) {
                    _configs = configs
                    _bannerConfigs = []
                    _videoConfigs = []
                    _insertConfigs = []
                    
                    let _checkString = function ( str ) {
                        if (typeof str === "string" && str !== "") {
                            return true
                        }

                        return false
                    }

					for (let i = 0; i < _configs.length; i++) {
						let info = _configs[i]
						if (info && _checkString(info.key) && _checkString(info.posId)) {
                            if (info.type === "Banner") {
                                let funcName = "show" + info.key + "BannerAd"
                                this[funcName] = function () {
                                    // body...
                                    if (!G_WXHelper.isOPPOPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doShowBanner(info.posId)
                                }.bind(this)
                                
                                // push into banner cfgs
                                _bannerConfigs.push(info)
                            }

                            if (info.type === "Video") {
                                let funcName = "show" + info.key + "VideoAd"
                                this[funcName] = function ( cb ) {
                                    // body...
                                    if (!G_WXHelper.isOPPOPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doShowVideo(info.posId, cb)
                                }.bind(this)
                                
                                // push into video cfgs
                                _videoConfigs.push(info)
                            }

                            if (info.type === "Insert") {
                                let funcName = "show" + info.key + "InsertAd"
                                this[funcName] = function ( cb ) {
                                    // body...
                                    if (!G_WXHelper.isOPPOPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doShowInsertAd(info.posId, cb)
                                }.bind(this)
                                
                                // push into insert cfgs
                                _insertConfigs.push(info)
                            }
						}
                    }
				}
            },

            hideOnShowBannerAd: function () {
                if (_onShowBannerObj) {
                    _onShowBannerObj.hide()
                }
            },

            destroyOnShowBannerAd: function () {
                if (_onShowBannerObj) {
                    _onShowBannerObj.destroy()
                    _onShowBannerObj = null
                }
            },
            
            showRandomBannerAd: function () {
                if (_bannerConfigs && _bannerConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _bannerConfigs.length - 1)
                    let info = _bannerConfigs[randomIndex]

                    if (info) {
                        let funcName = "show" + info.key + "BannerAd"
                        let func = this[funcName]

                        if (func) {
                            func()
                        }
                    }
                }
            },

            showRandomVideoAd: function ( cb ) {
                if (_videoConfigs && _videoConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _videoConfigs.length - 1)
                    let info = _videoConfigs[randomIndex]

                    if (info) {
                        let funcName = "show" + info.key + "VideoAd"
                        let func = this[funcName]

                        if (func) {
                            func(cb)
                        }
                    }
                }
            },

            showRandomInsertAd: function () {
                if (_insertConfigs && _insertConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _insertConfigs.length - 1)
                    let info = _insertConfigs[randomIndex]

                    if (info) {
                        let funcName = "show" + info.key + "InsertAd"
                        let func = this[funcName]

                        if (func) {
                            func()
                        }
                    }
                }
            },
            
            _doShowBanner: function ( _posId ) {
                if (!_isSupport) {
                    return null
                }
        
                if (_onShowBannerObj) {
                    _onShowBannerObj.destroy()
                    _onShowBannerObj = null
                }

                if (_onShowInsertAd) {
                    return null
                }

                let bannerObj = window.qg.createBannerAd({posId: _posId})

                bannerObj.onError(function() {
                    _onShowBannerObj = null
                })

                // save to on show
                _onShowBannerObj = bannerObj

                // show
                bannerObj.show()
        
                return bannerObj
            },
        
            _doShowVideo: function ( _posId, _cb ) {
                if (!_isSupport) {
                    return null
                }
        
                let videoObj = window.qg.createRewardedVideoAd({posId: _posId})
                
                videoObj.onLoad(function() {
                    videoObj.show()
                })
                videoObj.onClose(function(res) {
                    if(res.isEnded) {
                        console.log('激励视频广告完成，发放奖励')
                    } else {
                        console.log('激励视频广告取消关闭，不发放奖励')
                    }

                    if(typeof _cb === "function") {
                        _cb(res.isEnded)
                    }
                })
        
                // load
                videoObj.load()
        
                return videoObj
            },
        
            _doShowInsertAd: function ( _posId, _cb ) {
                if (!_isSupport) {
                    return null
                }
        
                let insertObj = window.qg.createInsertAd({posId: _posId})
        
                insertObj.onLoad(function() {
                    if (_onShowBannerObj) {
                        _onShowBannerObj.hide()
                    }
                    insertObj.show()
                })

                insertObj.onClose(function() {
                    _onShowInsertAd = null

                    if(typeof _cb === "function") {
                        _cb()
                    }
                })

                // save to on show
                _onShowInsertAd = insertObj
        
                // load
                insertObj.load()
        
                return insertObj
            }
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();

				// init...
				_instance.init()
			}

			return _instance;
		}
	};
})();

// export
export {_OppoAdv}