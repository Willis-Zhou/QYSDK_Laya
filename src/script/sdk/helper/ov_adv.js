// for vivo
var G_GapOfEachBanner = 10000
var G_GapOfEachVideo = 60000

/*
* oppo或vivo广告管理类
* 
*/
var _OVAdv = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_OVAdv Instance...')

        var _isSupport = false
        var _configs = null

        // banner
        var _bannerConfigs = null
        var _onShowBannerObj = null

        // video
        var _videoConfigs = null
        var _onShowVideoObj = null

        // insert
        var _insertConfigs = null
        var _onShowInsertObj = null

        // native
        var _nativeConfigs = null
        var _unClickNativeObjs = []
        var _lastUsedAdID = ""

		return {
			init: function () {
                // body...
				if(window.qg && G_PlatHelper.isOPPOPlatform() && window.qg.initAdService) {
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
                else if (G_PlatHelper.isVIVOPlatform()) {
                    _isSupport = true
                }
			},

			isSupport: function () {
				// body...
				return (_isSupport && _configs.length > 0)
            },

            isSupportBanner: function () {
                return (_isSupport && _bannerConfigs.length > 0)  
            },

            isSupportVideo: function () {
                return (_isSupport && _videoConfigs.length > 0)  
            },

            isSupportInsert: function () {
                return (_isSupport && _insertConfigs.length > 0)  
            },

            isSupportNative: function () {
                return (_isSupport && _nativeConfigs.length > 0 && _unClickNativeObjs.length > 0)  
            },

            preload: function () {
                console.log("start preload ov adv...")

                this.loadRandomNativeAd(obj => {
                    if (obj) {
                        console.log("preload native ad succ...")
                        _unClickNativeObjs.push(obj)
                    }
                    else {
                        console.log("preload native ad fail...")
                    }
                })
            },

            registerAll: function (configs) {
				// body...
				if (configs) {
                    _configs = configs
                    _bannerConfigs = []
                    _videoConfigs = []
                    _insertConfigs = []
                    _nativeConfigs = []
                    
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
                                    if (!G_PlatHelper.isOVPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doShowBanner(info.posId)
                                }.bind(this)
                                
                                // push into banner cfgs
                                _bannerConfigs.push(info)
                            }

                            if (info.type === "Video") {
                                let funcName = "show" + info.key + "VideoAd"
                                this[funcName] = function ( closeCb, errCb ) {
                                    // body...
                                    if (!G_PlatHelper.isOVPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }

									return this._doShowVideo(info.posId, closeCb, errCb)
                                }.bind(this)
                                
                                // push into video cfgs
                                _videoConfigs.push(info)
                            }

                            if (info.type === "Insert") {
                                let funcName = "show" + info.key + "InsertAd"
                                this[funcName] = function ( cb ) {
                                    // body...
                                    if (!G_PlatHelper.isOVPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doShowInsertAd(info.posId, cb)
                                }.bind(this)
                                
                                // push into insert cfgs
                                _insertConfigs.push(info)
                            }

                            if (info.type === "Native") {
                                let funcName = "load" + info.key + "NativeAd"
                                this[funcName] = function ( cb ) {
                                    // body...
                                    if (!G_PlatHelper.isOVPlatform()) {
                                        console.log("call {0} func...".format(funcName))
                                    }
									return this._doLoadNativeAd(info.posId, cb)
                                }.bind(this)
                                
                                // push into insert cfgs
                                _nativeConfigs.push(info)
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
                            func.call(this)
                        }
                    }
                }
            },

            showRandomVideoAd: function ( closeCb, errCb ) {
                if (_videoConfigs && _videoConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _videoConfigs.length - 1)
                    let info = _videoConfigs[randomIndex]

                    if (info) {
                        let funcName = "show" + info.key + "VideoAd"
                        let func = this[funcName]

                        if (func) {
                            func.call(this, closeCb, errCb)
                        }
                    }
                }
            },

            showRandomInsertAd: function ( cb ) {
                if (_insertConfigs && _insertConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _insertConfigs.length - 1)
                    let info = _insertConfigs[randomIndex]

                    if (info) {
                        let funcName = "show" + info.key + "InsertAd"
                        let func = this[funcName]

                        if (func) {
                            func.call(this, cb)
                        }
                    }
                }
            },
            
            loadRandomNativeAd: function ( cb ) {
                if (_nativeConfigs && _nativeConfigs.length > 0) {
                    let randomIndex = G_Utils.random(0, _nativeConfigs.length - 1)
                    let info = _nativeConfigs[randomIndex]

                    if (info) {
                        let funcName = "load" + info.key + "NativeAd"
                        let func = this[funcName]

                        if (func) {
                            func.call(this, cb)
                        }
                    }
                }
            },

            _doShowBanner: function ( _posId ) {
                if (!_isSupport) {
                    return null
                }

                console.log("show banner: ", _posId)

                if (_onShowBannerObj) {
                    if (G_PlatHelper.isOPPOPlatform()) {
                        _onShowBannerObj.destroy()
                        _onShowBannerObj = null
                    }
                    else {
                        if ((G_ServerInfo.getServerTime() - _onShowBannerObj._lastCreatedTime) > G_GapOfEachBanner) {
                            _onShowBannerObj.destroy()
                            _onShowBannerObj = null
                        }
                        else {
                            let needTime = G_GapOfEachBanner / 1000 - Math.floor((G_ServerInfo.getServerTime() - _onShowBannerObj._lastCreatedTime) / 1000)
                            console.log("banner广告还未准备好，请{0}秒后重新尝试".format(needTime.toString()))
                        }
                    }
                }

                if (_onShowBannerObj === null) {
                    let bannerObj = null

                    if (G_PlatHelper.isOPPOPlatform()) {
                        bannerObj = window.qg.createBannerAd({posId: _posId})
                    }
                    else {
                        bannerObj = window.qg.createBannerAd({
                            posId: _posId,
                            style: {}
                        })
                    }

                    bannerObj.onError(function( err ) {
                        console.error(err)

                        if (G_PlatHelper.isVIVOPlatform()) {
                            _onShowBannerObj = null
                        }
                    })

                    if (G_PlatHelper.isVIVOPlatform()) {
                        bannerObj.onClose(function () {
                            _onShowBannerObj = null
                        })
                    }

                    // save to on show
                    _onShowBannerObj = bannerObj
                    _onShowBannerObj._lastCreatedTime = G_ServerInfo.getServerTime()
                }

                // show
                _onShowBannerObj.show()
        
                return _onShowBannerObj
            },
        
            _doShowVideo: function ( _posId, _closeCb, _errCb ) {
                if (!_isSupport) {
                    return null
                }

                console.log("show video: ", _posId)
                
                if (_onShowVideoObj) {
                    if (G_PlatHelper.isOPPOPlatform()) {
                        _onShowVideoObj.destroy()
                        _onShowVideoObj = null
                    }
                }
        
                if (_onShowVideoObj === null) {
                    let videoObj = window.qg.createRewardedVideoAd({posId: _posId})

                    videoObj.onLoad(function () {
                        videoObj.show()
                    })
                
                    videoObj.onClose(function(res) {
                        videoObj._lastShowedTime = G_ServerInfo.getServerTime()

                        if(res.isEnded) {
                            console.log('激励视频广告完成，发放奖励')
                        } else {
                            console.log('激励视频广告取消关闭，不发放奖励')
                        }

                        let __closeCb = videoObj.closeCb

                        if(__closeCb) {
                            __closeCb(res.isEnded)
                        }
                    })

                    videoObj.onError(function () {
                        let __errCb = videoObj.errCb

                        if(__errCb) {
                            __errCb(-1)
                        }
                    })

                    // save to on show
                    _onShowVideoObj = videoObj
                }

                if (typeof _closeCb === "function") {
                    _onShowVideoObj.closeCb = _closeCb
                }

                if (typeof _errCb === "function") {
                    _onShowVideoObj.errCb = _errCb
                }
        
                if (G_PlatHelper.isOPPOPlatform()) {
                    _onShowVideoObj.load()
                }
                else {
                    if (_onShowVideoObj._lastShowedTime) {
                        console.log(G_ServerInfo.getServerTime(), "-", _onShowVideoObj._lastShowedTime)
                        if ((G_ServerInfo.getServerTime() - _onShowVideoObj._lastShowedTime) > G_GapOfEachVideo) {
                            _onShowVideoObj.load()
                        }
                        else {
                            let __errCb = _onShowVideoObj.errCb

                            if(__errCb) {
                                __errCb(G_GapOfEachVideo / 1000 - Math.floor((G_ServerInfo.getServerTime() - _onShowVideoObj._lastShowedTime) / 1000))
                            }
                        }
                    }
                    else {
                        _onShowVideoObj.load()
                    }
                }

                return _onShowVideoObj
            },
        
            _doShowInsertAd: function ( _posId, _cb ) {
                if (!_isSupport) {
                    return null
                }

                console.log("show insert: ", _posId)
        
                let insertObj = null

                if (window.qg.createInsertAd) {
                    insertObj = window.qg.createInsertAd({posId: _posId})
                }
                else {
                    insertObj = window.qg.createInterstitialAd({posId: _posId})
                }
        
                if (G_PlatHelper.isOPPOPlatform()) {
                    insertObj.onLoad(function() {
                        if (_onShowBannerObj) {
                            _onShowBannerObj.hide()
                        }
                        insertObj.show()
                    })
                }

                insertObj.onClose(function() {
                    _onShowInsertObj = null

                    if(typeof _cb === "function") {
                        _cb()
                    }
                })

                insertObj.onError(function ( err ) {
                    console.error(err)
                })

                // save to on show
                _onShowInsertObj = insertObj
        
                // load
                if (G_PlatHelper.isOPPOPlatform()) {
                    insertObj.load()
                }
                else {
                    insertObj.show().then(() => {
                        console.log("show insert ad succ...")

                        if (_onShowBannerObj) {
                            _onShowBannerObj.hide()
                        }
                    })
                }
        
                return insertObj
            },

            _doLoadNativeAd: function ( _posId, _cb ) {
                if (!_isSupport) {
                    return null
                }

                console.log("load native: ", _posId)
        
                let nativeObj = window.qg.createNativeAd({posId: _posId})

                let onLoadHander = null
                onLoadHander = function(res) {
                    nativeObj.offLoad(onLoadHander)
                    nativeObj.offError(onErrorHander)
                    if (res.adList.length > 0) {
                        nativeObj._adList = res.adList

                        if(typeof _cb === "function") {
                            _cb(nativeObj)
                        }
                    }
                }

                let onErrorHander = null
                onErrorHander = function(err) {
                    nativeObj.offLoad(onLoadHander)
                    nativeObj.offError(onErrorHander)
                    console.error(err)

                    if(typeof _cb === "function") {
                        _cb(null)
                    }
                }

                nativeObj.onLoad(onLoadHander)
                nativeObj.onError(onErrorHander)
        
                // load
                nativeObj.load()
        
                return nativeObj
            },

            getNextNativeAdInfo() {
                if (_unClickNativeObjs.length > 0) {
                    let candidateObjs = _unClickNativeObjs

                    console.log("last used ad id: ", _lastUsedAdID)

                    if (_unClickNativeObjs.length > 1 && _lastUsedAdID !== "") {
                        candidateObjs = []

                        for (let i = 0; i < _unClickNativeObjs.length; i++) {
                            let adID = _unClickNativeObjs[i]._adList[_unClickNativeObjs[i]._adList.length - 1].adId
                            if (adID !== _lastUsedAdID) {
                                candidateObjs.push(_unClickNativeObjs[i])
                            }
                        }
                    }

                    let randomIndex = G_Utils.random(0, candidateObjs.length - 1)
                    let unClickNativeObj = candidateObjs[randomIndex]
                    let unClickNativeInfo = unClickNativeObj._adList[unClickNativeObj._adList.length - 1]

                    // save
                    _lastUsedAdID = unClickNativeInfo.adId

                    return [unClickNativeObj, unClickNativeInfo]
                }
                
                return null
            },

            reportNativeAdShow: function ( nativeAdObj, adID ) {
                if (nativeAdObj) {
                    console.log("show native ad: ", adID)
                    nativeAdObj.reportAdShow({
                        adId: adID
                    })
                }
            },

            reportNativeAdHide: function () {
                this.loadRandomNativeAd(obj => {
                    if (obj) {
                        console.log("auto preload next native ad succ...")
                        _unClickNativeObjs.push(obj)
                    }
                    else {
                        console.log("auto preload next native ad fail...")
                    }
                })
            },

            reportNativeAdClick: function ( nativeAdObj, adID ) {
                if (nativeAdObj) {
                    console.log("click native ad: ", adID)
                    nativeAdObj.reportAdClick({
                        adId: adID
                    })

                    // pop
                    nativeAdObj._adList.pop()

                    // check
                    if (nativeAdObj._adList.length === 0) {
                        // no more ad in this obj
                        for (let i = 0; i < _unClickNativeObjs.length; i++) {
                            if (_unClickNativeObjs[i] === nativeAdObj) {
                                _unClickNativeObjs.splice(i, 1)
                            }
                        }

                        // destory
                        nativeAdObj.destroy()
                    }

                    // preload more
                    this.reportNativeAdHide()
                }
            },
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
export {_OVAdv}