import SettingPopup from "./popup/SettingPopup.js";
import MoreGamePopup from "./popup/MoreGamePopup.js";
import AdvLoadMgr from "./ctrl/AdvLoadMgr.js";

import ImageAnimation from "./view/ImageAnimation.js";

/**
 * 主游戏场景View
 */
export default class Game extends Laya.Scene {
    constructor() {
        super();

        // privates
        this._gameScene = null

        // 加载场景文件
        this.loadScene("game/GameScene.scene")
        
        // init UI
        this._initUI()

        // register events
        this._onEventRegistered()

        // 加载场景
        // Laya.Scene3D.load('res/scenes/Game/MainGame.ls', Laya.Handler.create(null, function (scene) {
        //     this.onLoadSceneComplete(scene)
        // }.bind(this)))

        // default
        if (this.readyView) {
            this.readyView.doShow()
        }

        if (this.popupView) {
            this.popupView.doHide()
        }

        if (this.testBtn) {
            let animation = new ImageAnimation({width: this.testBtn.width, height: this.testBtn.height})

            if (animation) {
                animation.onSizeChanged(function () {
                    animation.pivotX = animation.width / 2
                    animation.pivotY = animation.height / 2
                    animation.x = this.testBtn.width / 2
                    animation.y = this.testBtn.height / 2
                    animation.scaleX = this.testBtn.width / animation.width
                    animation.scaleY = this.testBtn.height / animation.height
                }.bind(this))

                // add
                this.testBtn.addChild(animation)

                // set animation
                let imgData = {
                    width: 96,
                    height: 96,
                    path: "https://image.game.hnquyou.com/loading_gif.png",
                    frame_count: 12
                }
                animation.setImage(imgData)

                // G_Scheduler.schedule("Delay_Set_Image_Animation", function () {
                //     // body...
                //     animation.setImage("game/white.jpg")
                // }.bind(this), false, 1000)
            }
        }

        if (this.testImage) {
            this.testImage.dark = true
        }
    }

    _initUI() {
        // body...
        if (this.settingBtn) {
            this.settingBtn.on("click", null, function () {
                G_UIHelper.playBtnTouchAction(this.settingBtn, function () {
                    // this.onSettingTouched()
                    // this.onMoreGameTouched()

                    // if (this.fullSceneAd) {
                    //     this.fullSceneAd.doShow()
                    // }

                    G_Adv.createVideoAdv(function (isEnded) {
                        console.log("show video isEnded: ", isEnded)
                    })
                }.bind(this))

                G_SoundMgr.playSound(G_SoundName.SN_CLICK)
            }.bind(this))
        }

        if (this.readyView) {
            this._initBaseMenu(this.readyView)
        }

        if (this.popupView) {
            let popupView = this.popupView
            this._initBaseMenu(popupView)

            popupView._registeredPopups = []
            popupView._registeredPopups.push({
                name: "settingView",
                cls: SettingPopup
            })
            popupView._registeredPopups.push({
                name: "moreGameView",
                cls: MoreGamePopup
            })

            popupView._popups = {}

            popupView.doShow = function ( closeCb ) {
                popupView.visible = true
                popupView._closeCb = closeCb
            }

            popupView.doHide = function () {
                popupView._hideAllPopups()
                popupView.visible = false

                if (typeof popupView._closeCb === "function") {
                    let cb = popupView._closeCb
                    popupView._closeCb = null

                    // cb
                    cb()
                }
            }

            popupView._initAllPopups = function () {
                if (popupView._registeredPopups.length > 0) {
                    popupView._registeredPopups.forEach(popup => {
                        if (popup.name) {
                            let view = popupView.getChildByName(popup.name)
                            if (view) {
                                if (popup.cls) {
                                    let cls = view.getComponent(popup.cls)
                                    if (cls) {
                                        if (cls.registerCloseCallback) {
                                            cls.registerCloseCallback(function () {
                                                // close all
                                                popupView.doHide()
                                            })
                                        }

                                        // save
                                        view._cls = cls
                                    }
                                }

                                // save
                                popupView._popups[popup.name] = view
                            }
                        }
                    })
                }
            }

            popupView._hideAllPopups = function () {
                if (popupView._registeredPopups.length > 0) {
                    popupView._registeredPopups.forEach(popup => {
                        if (popup.name) {
                            if (popupView._popups[popup.name]) {
                                popupView._popups[popup.name].visible = false
                            }
                        }
                    })
                }
            }

            popupView.showSetting = function ( closeCb ) {
                popupView.doHide()
                popupView.doShow(closeCb)

                let settingView = popupView._popups["settingView"]
                if (settingView) {
                    settingView.visible = true

                    // run action
                    G_UIHelper.playOpenPopupAction(settingView)
                }
            }

            popupView.showMoreGame = function ( closeCb ) {
                popupView.doHide()
                popupView.doShow(closeCb)

                let moreGameView = popupView._popups["moreGameView"]
                if (moreGameView) {
                    moreGameView.visible = true

                    let adLoader = moreGameView.getChildByName("adLoader")
                    if (adLoader) {
                        let advLoadMgr = adLoader.getComponent(AdvLoadMgr)
                        if (advLoadMgr) {
                            advLoadMgr.refreshAdv()
                        }
                    }

                    if (moreGameView._cls) {
                        moreGameView._cls.doShow()
                    }

                    // run action
                    G_UIHelper.playOpenPopupAction(moreGameView)
                }
            }

            // init
            popupView._initAllPopups()
        }

        if (this.bannerAd) {
            this._initBaseMenu(this.bannerAd)

            let bannerAd = this.bannerAd
            bannerAd.doShow = function () {
                // body...
                bannerAd.visible = true

                let adLoader = bannerAd.getChildByName("bannerAdLoader")
                if (adLoader) {
                    let advLoadMgr = adLoader.getComponent(AdvLoadMgr)
                    if (advLoadMgr) {
                        advLoadMgr.refreshAdv()
                    }
                }
            }
        }

        if (this.fullSceneAd) {
            let fullSceneAd = this.fullSceneAd
            this._initBaseMenu(fullSceneAd)

            // init
            fullSceneAd._closeBtn = G_UIHelper.seekNodeByName(fullSceneAd, "closeBtn")
            fullSceneAd._closeCb = null
            
            fullSceneAd.doShow = function ( closeCb ) {
                // body...
                fullSceneAd._closeCb = closeCb
                fullSceneAd.visible = true

                // delay show
                G_UIHelper.delayShow(fullSceneAd._closeBtn)

                let scrollAdvLoader = fullSceneAd.getChildByName("scrollAdvLoader")
                if (scrollAdvLoader) {
                    let advLoadMgr = scrollAdvLoader.getComponent(AdvLoadMgr)
                    if (advLoadMgr) {
                        advLoadMgr.refreshAdv()
                    }
                }

                let bannerAdvLoader = fullSceneAd.getChildByName("bannerAdvLoader")
                if (bannerAdvLoader) {
                    let advLoadMgr = bannerAdvLoader.getComponent(AdvLoadMgr)
                    if (advLoadMgr) {
                        advLoadMgr.refreshAdv()
                    }
                }
            }.bind(this)

            let closeBtn = fullSceneAd._closeBtn
            closeBtn.on("click", null, function () {
                G_UIHelper.playBtnTouchAction(closeBtn, function () {
                    // body...
                    fullSceneAd.doHide()

                    if (fullSceneAd._closeCb) {
                        let closeCb = fullSceneAd._closeCb
                        fullSceneAd._closeCb = null

                        // cb
                        closeCb()
                    }
                }.bind(this))
                
                G_SoundMgr.playSound(G_SoundName.SN_CLICK)
            }.bind(this))
        }
    }

    _onEventRegistered() {
        // banner
        this._onBannerEventRegistered()
    }

    _onBannerEventRegistered() {
        let doShowBanner = function () {
            // body...
            console.log("do show banner...")

            // wx banner
            // let _doShowBanner = function () {
            //     let sysInfo = G_WXHelper.getSysInfo()

            //     let style = {
            //         left: (sysInfo.screenWidth - 300) / 2,
            //         top: sysInfo.screenHeight - 105,
            //         width: 300
            //     }

            //     if (G_WXHelper.isIPhoneX()) {
            //         style.top -= 40
            //     }

            //     G_Adv.createBannerAdv(style, function () {
            //         // body...
            //         console.log("create or show banner error...")
            //     })
            // }

            // own banner
            let _doShowBanner = function () {
                if (this.bannerAd) {
                    this.bannerAd.doShow()
                }
            }.bind(this)

            // do show
            _doShowBanner()                
        }.bind(this)

        let doHideBanner = function () {
            console.log("do hide banner...")

            // wx banner
            // G_Adv.destroyBannerAdv()

            // own banner
            if (this.bannerAd) {
                this.bannerAd.doHide()
            }
        }.bind(this)

        G_Event.addEventListerner(G_EventName.EN_SHOW_BANNER_AD, function () {
            // body...
            doShowBanner()
        }.bind(this))

        G_Event.addEventListerner(G_EventName.EN_HIDE_BANNER_AD, function () {
            // body...
            doHideBanner()
        }.bind(this))
    }

    onOpened() {
        // preload adv
        G_Adv.preload()

        if (window.wx) {
            // let bannerAd = wx.createBannerAd({
            //     adUnitId: 'adunit-492c72acf993478a',
            //     style: {
            //         left: 0,
            //         top: 0,
            //         width: 300
            //     }
            // })

            // bannerAd.onError(function ( err ) {
            //     // body...
            //     console.error(err)

            //     console.error(bannerAd)
            //     bannerAd.destroy()
            //     bannerAd = null
            // })

            // bannerAd.style.left = 10
    
            // // show
            // bannerAd.show()

            // // log
            // console.error(bannerAd)

            // G_Scheduler.schedule("Delay_Move_Banner", function () {
            //     // body...
            //     bannerAd.style.left = 20
            //     bannerAd.style.width = 360
            // }.bind(this), false, 10000)

            // // video
            // let videoAd = wx.createRewardedVideoAd({
            //     adUnitId: 'adunit-490fc5b2fd156482'
            // })

            // videoAd.onError(function (err) {
            //     console.log(videoAd)
            //     videoAd.destroy()
            //     videoAd.destroy()
            // })

            // G_Scheduler.schedule("Delay_Show_Video", function () {
            //     // body...
            //     videoAd.show().catch(() => {
            //         // 失败重试
            //         videoAd.load()
            //         .then(() => videoAd.show())
            //         .catch(err => {
            //             console.log('激励视频 广告显示失败')
            //         })
            //     })
            // }.bind(this), false, 10000, 0)

            G_Switch.isPublishing(function ( isPublishing ) {
                console.log("isPublishing: ", isPublishing)
            })

            console.log("isSupportBannerAd: ", G_Adv.isSupportBannerAd())
            console.log("isSupportVideoAd: ", G_Adv.isSupportVideoAd())

            G_FreeGetMgr.getNextFreeGetWay(function ( way ) {
                console.log("next free get way: ", way)
            })

            G_Switch.isAdvStateNormal(false, function ( isNormal ) {
                // body...
                console.log("is adv normal: ", isNormal)

                let sysInfo = G_WXHelper.getSysInfo();
                if (isNormal) {
                    G_Adv.createAutoRefreshBannerAdv(10, {centerX: 0, bottom: 0, width: sysInfo.screenWidth}, null, function () {
                        G_Adv.showBannerAdv()
                    })
                }
                else {
                    G_Adv.createAutoRefreshBannerAdv(10, {centerX: 0, bottom: 0, width: sysInfo.screenWidth}, null, function () {
                        G_Adv.showBannerAdv()
                    })
                }
            })

            // G_Scheduler.schedule("Cancel_Auto_Refresh_Banner", function () {
            //     // body...
            //     // G_Adv.destoryAutoRefreshBannerAdv()
            // }.bind(this), false, 5000, 0)

            // G_Scheduler.schedule("Delay_Auto_Show_Video", function () {
            //     // body...
            //     G_Adv.createVideoAdv(function (isEnded) {
            //         // body...
            //         console.log("Watch Video Finished: ", isEnded)
            //     })
            // }.bind(this), false, 15000, 1)
        }

        // let test = {
        //     arr: [0, 1, 2],
        //     boolean: true,
        //     date: new Date(0),
        //     err: new Error('我是一个错误'),     // not support
        //     func: function() {
        //         console.log('我是一个函数')
        //     },      // not support
        //     nul: null,
        //     num: 0,
        //     obj: {
        //         name: '我是一个对象',
        //         id: 1
        //     },
        //     reg: new RegExp('/我是一个正则/ig'),
        //     str: '123aa',
        //     unf: undefined,
        // }
        
        // let deepClone_result = G_Utils.deepClone(test)

        // console.log(test)
        // console.log(deepClone_result)
        // console.log(deepClone_result.err) // print fail
        // deepClone_result.func()   // error

        // let cloneDeep_result = G_Utils.cloneDeep(test)
        // console.log(cloneDeep_result)
        // console.log(cloneDeep_result.err) // print succ
        // cloneDeep_result.func()   // succ
    }

    /**
     * 加载场景完成
     */
    onLoadSceneComplete(scene) {
        // 将场景加到舞台上
        Laya.stage.addChildAt(scene, 0)

        // save
        this._gameScene = scene
    }

    /**
     * 设置
     */
    onSettingTouched( btn ) {
        if (this.popupView) {
            this.popupView.showSetting(function () {
                G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
            })

            G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
        }
    }

    /**
     * 更多游戏
     */
    onMoreGameTouched() {
        if (this.popupView) {
            this.popupView.showMoreGame(function () {
                console.log("close more game popup...")
            })
        }
    }

    _initBaseMenu( menu ) {
        if (menu) {
            menu.doShow = function () {
                menu.visible = true
            }

            menu.doHide = function () {
                menu.visible = false
            }

            // default
            menu.doHide()
        }
    }
}