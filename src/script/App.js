import {QYSDK} from "./sdk/qysdk";
import {APP_CONST} from "./game/global/app_const";

import { } from "./game/global/adv_mgr";
import { } from "./game/global/switch";
import { } from "./game/global/free_get_mgr";
import { } from "./game/global/node_pool_mgr";
import { } from "./game/global/player_info";
import { } from "./game/global/server_info";
import { } from "./game/global/sound_mgr";
import { } from "./game/global/mistake_mgr";
import { } from "./game/global/ui_mgr";
import { } from "./game/global/red_package_mgr";
import { } from "./game/global/video_rank_mgr";

import qysdk from "./db/proto/qysdk_db.js"

// extend
import {FW_EXTEND} from "./extend/framework_extend";

export default class App extends Laya.Script {

    constructor() { 
        super(); 
        
        this._serverCheckFinishedCb = null
        this._showLoadingFunc = null
        this._hideLoadingFunc = null
        
        // for banner
        this._isBannerOnShow = false
        this._isForceMaxBanner = false

        // for report
        this._isFirstStartGame = false

        // start app
        this._startApp()
    }
    
    _startApp() {
        // 初始化游戏常量（可能会覆盖部分sdk的常量）
        APP_CONST.init()

        // 初始化SDK...
        QYSDK.init()

        // 注册lodash工具
        if (typeof lodash !== "undefined") {
            G_Utils.registerLodash(lodash)
        }

        // register all uis
        G_UIManager.registerAllUIs()

        // GameDB
        G_GameDB.load(qysdk)
        G_GameDB.registerAll(G_GameDBConfigs)
        G_GameDB.onLoad(function () {
            // body...
            // 框架扩展
            FW_EXTEND.init()

            // init Reportor
            G_Reportor.registerAllEvents(G_ReportEventName)

            // load Server Time
            G_ServerInfo.load(function () {
                // body...
                // register server time into Http Helper
                G_HttpHelper.registerGetServerTimeFunc(function () {
                    // body...
                    return G_ServerInfo.getServerTime()
                })

                // check finished
                this._doServerCheckFinishedCb()
            }.bind(this))
        }.bind(this))

        // register global app events
        this._onAppEventRegistered()

        // register global banner events
        this._onBannerEventRegistered()

        // register global insert events
        this._onInsertEventRegistered()
    }

    _onAppEventRegistered() {
        // body...
        G_Event.addEventListerner(G_EventName.EN_APP_AFTER_ONSHOW, function () {
            // body...
            
            if (G_PlatHelper.isOVPlatform()) {
                if (!G_OVAdv.isWatchingVideoAdv()) {
                    G_SoundMgr.resumeMusic()
                }
            }
            else {
                if (!G_Adv.isWatchingVideoAdv()) {
                    G_SoundMgr.resumeMusic()
                }
            }
        })

        G_Event.addEventListerner(G_EventName.EN_APP_BEFORE_ONHIDE, function () {
            // body...
            G_SoundMgr.pauseMusic()
        })

        G_Event.addEventListerner(G_EventName.EN_SYSTEM_ERROR, function () {
            // body...
            G_PlatHelper.showModal(
                G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_TITLE"]).word,
                G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_CONTENT"]).word,
                true,
                function ( bOK ) {
                    // body...
                    if (bOK) {
                        // restart
                        console.error("restart")
                        G_PlatHelper.restartApp()
                    }
                    else {
                        // exit
                        console.error("exit")
                        G_PlatHelper.exitApp()
                    }
                }, {
                    confirmText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_RELOAD_GAME"]).word, 
                    cancelText: G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_EXIT_GAME"]).word
                })
        })

        G_Event.addEventListerner(G_EventName.EN_SDK_NOT_SUPPORT, function () {
            // body...
            let formatStr = G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SDK_NOT_SUPPORT_FORMAT"]).word
            let content = ""
            if (G_PlatHelper.isQQPlatform()) {
                content = formatStr.format(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_QQ_PLATFORM_NAME"]).word)
            }
            else {
                content = formatStr.format(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_WX_PLATFORM_NAME"]).word)
            }
            G_PlatHelper.showToast(content)
        })

        G_Event.addEventListerner(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW, function () {
            // body...
            G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_VIDEO_NOT_SUPPORT"]).word)
        })

        G_Event.addEventListerner(G_EventName.EN_FIRST_OPEN_MAIN_SCENE, function () {
            // body...
            // preload adv
            G_Adv.preload()

            // install shortcut on ov platform
            if (G_PlatHelper.isOVPlatform()) {
                if (G_PlatHelper.isOPPOPlatform()) {
                    // report to oppo
                    if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().reportMonitor) {
                        G_PlatHelper.getPlat().reportMonitor('game_scene', 0)
                    }

                    G_PlatHelper.installShortcut(function () {
                        console.log("install shortcut succ...")
                        // G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_INSTALL_SHORTCUT_SUCCESS"]).word)
                    })
                }

                G_OVAdv.preload()
            }

            if (G_PlatHelper.isQTTPlatform() && G_PlatHelper.getPlat().reportData) {
                G_PlatHelper.getPlat().reportData({
                    type: 'load',
                    open_id: G_PlayerInfo.getOpenID(),
                    app_id: G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_ID"]).str,
                    game_name: G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_NAME"]).str,
                    extend_info: {}
                })

                console.log("report qtt load event succ...")
            }

            if (G_PlatHelper.isTTPlatform()) {
                // 刷新过去已上报的视频信息（点赞数，封面图）
                G_VideoRankMgr.refreshAndReport()
            }
        })

        G_Event.addEventListerner(G_EventName.EN_FIRST_START_GAME, () => {
            // body...
            if (this._isFirstStartGame) {
                return
            }

            // mark
            this._isFirstStartGame = true

            if (G_PlatHelper.isQTTPlatform() && G_PlatHelper.getPlat().reportData) {
                G_PlatHelper.getPlat().reportData({
                    type: 'start',
                    open_id: G_PlayerInfo.getOpenID(),
                    app_id: G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_ID"]).str,
                    game_name: G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_NAME"]).str,
                    extend_info: {}
                })

                console.log("report qtt start event succ...")
            }
        })
    }

    _onBannerEventRegistered() {
        let doShowBanner = function ( isForceMaxBanner = false, cb = null ) {
            // body...
            console.log("do show banner...")

            if (G_Adv.isSupportBannerAd()) {
                var self = this

                G_Switch.isPublishing(function ( isPublishing ) {
                    // mark
                    self._isBannerOnShow = true
                    self._isForceMaxBanner = isForceMaxBanner

                    let sysInfo = G_PlatHelper.getSysInfo()
                    let bannerWidth = 300

                    if (G_PlatHelper.isTTPlatform()) {
                        bannerWidth = 128
                    }
                    else if (G_PlatHelper.isWXPlatform()) {
                        if (!isForceMaxBanner) {
                            let originalSize = G_Adv.getBannerOriginalSize()
                            let bannerHeight = bannerWidth / originalSize.width * originalSize.height
                            let height = bannerHeight
                            if (G_PlatHelper.isIPhoneX()) {
                                height += G_Adv.getMiniGapFromBottom()
                            }
                            let heightOnStage = height / sysInfo.screenHeight * Laya.stage.height

                            if (heightOnStage > 280) {
                                let _heightOnStage = 280
                                let _height = _heightOnStage / Laya.stage.height * sysInfo.screenHeight
                                let _bannerHeight = _height
                                if (G_PlatHelper.isIPhoneX()) {
                                    _bannerHeight -= G_Adv.getMiniGapFromBottom()
                                }
                                let _bannerWidth = _bannerHeight / originalSize.height * originalSize.width

                                // fix
                                if (_bannerWidth < 300) {
                                    _bannerWidth = 300
                                }

                                // change
                                bannerWidth = _bannerWidth
                            }
                        }
                        else {
                            bannerWidth = sysInfo.screenWidth
                        }
                    }
                    
                    if (isPublishing) {
                        G_Adv.createBannerAdv({centerX: 0, bottom: 0, width: bannerWidth}, function () {
                            console.log("show own banner...")
                            if (self._isBannerOnShow) {
                                self._onShowOwnBanner()
                            }
                        }, function () {
                            if (self._isBannerOnShow) {
                                G_Adv.showBannerAdv()
                            }
                        })
                    }
                    else {
                        G_Adv.createBannerAdv({centerX: 0, bottom: 0, width: bannerWidth}, function () {
                            console.log("show own banner...")
                            if (self._isBannerOnShow) {
                                self._onShowOwnBanner()
                            }
                        }, function () {
                            if (self._isBannerOnShow) {
                                G_Adv.showBannerAdv()
                            }
                        })
                    }

                    if (G_PlatHelper.isWXPlatform()) {
                        if (typeof cb === "function") {
                            let originalSize = G_Adv.getBannerOriginalSize()
                            let bannerHeight = bannerWidth / originalSize.width * originalSize.height
                            let height = bannerHeight
                            if (G_PlatHelper.isIPhoneX()) {
                                height += G_Adv.getMiniGapFromBottom()
                            }
                            let heightOnStage = height / sysInfo.screenHeight * Laya.stage.height
                            
                            // cb
                            cb(heightOnStage)
                        }
                    }
                })
                
            }
            else {
                console.log("direct show own banner...")
                this._onShowOwnBanner()
            }               
        }.bind(this)

        let doHideBanner = function () {
            console.log("do hide banner...")

            // mark
            this._isBannerOnShow = false
            this._isForceMaxBanner = false

            // wx banner
            G_Adv.hideBannerAdv()

            // own banner
            this._onHideOwnBanner()
        }.bind(this)

        G_Event.addEventListerner(G_EventName.EN_SHOW_BANNER_AD, function (isForceMaxBanner = false, cb = null) {
            // body...
            if (G_PlatHelper.isQQPlatform()) {
                // fix banner can not be destory
                G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
            }

            if (G_PlatHelper.isOVPlatform() || G_PlatHelper.isMZPlatform()) {
                // mark
                this._isBannerOnShow = true
                this._isForceMaxBanner = isForceMaxBanner

                let funcName = "showRandomBannerAd"
                let func = G_OVAdv[funcName]

                if (func) {
                    func.call(G_OVAdv, bannerObj => {
                        if (bannerObj && this._isBannerOnShow) {
                            bannerObj.show()
                        }
                    })
                }
                else {
                    console.warn("there is no target func in G_OVAdv: " + funcName)
                }
            }
            else if (G_PlatHelper.isQTTPlatform()) {
                // mark
                this._isBannerOnShow = true
                this._isForceMaxBanner = isForceMaxBanner

                G_PlatHelper.getPlat().showBanner()
            }
            else if (G_PlatHelper.getPlat()) {
                doShowBanner(isForceMaxBanner, cb)
            }
        }.bind(this))

        G_Event.addEventListerner(G_EventName.EN_HIDE_BANNER_AD, function () {
            // body...
            if (G_PlatHelper.isOVPlatform() || G_PlatHelper.isMZPlatform()) {
                // mark
                this._isBannerOnShow = false
                this._isForceMaxBanner = false

                G_OVAdv.hideOnShowBannerAd()
            }
            else if (G_PlatHelper.isQTTPlatform()) {
                // mark
                this._isBannerOnShow = false
                this._isForceMaxBanner = false

                G_PlatHelper.getPlat().hideBanner()
            }
            else if (G_PlatHelper.getPlat()) {
                doHideBanner()
            }
        }.bind(this))
    }

    _onInsertEventRegistered() {
        G_Event.addEventListerner(G_EventName.EN_SHOW_INSERT_AD, function (closeCb, ov_key = "Random") {
            // body...
            if (G_PlatHelper.isOVPlatform() || G_PlatHelper.isMZPlatform()) {
                if (G_IsUseOwnInsertAd && G_OVAdv.isSupportNative()) {
                    // hide banner
                    G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)

                    G_Event.dispatchEvent(G_EventName.EN_SHOW_OWN_INSERT_AD, () => {
                        G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
                    })
                }
                else {
                    if (G_IsUseOwnInsertAd && !G_OVAdv.isSupportNative()) {
                        G_OVAdv.preload()
                    }

                    let funcName = "show" + ov_key + "InsertAd"
                    let func = G_OVAdv["show" + ov_key + "InsertAd"]

                    if (func) {
                        if (G_PlatHelper.isOVPlatform()) {
                            G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
                        }

                        func.call(G_OVAdv, () => {
                            if (G_PlatHelper.isOVPlatform()) {
                                G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
                            }

                            if (typeof closeCb === "function") {
                                closeCb()
                            }
                        })
                    }
                    else {
                        console.warn("there is no target func in G_OVAdv: " + funcName)
                    }
                }
            }
            else if (G_PlatHelper.isQTTPlatform()) {
                G_PlatHelper.getPlat().showHDReward({rewardtype: 1})
            }
            else if (G_Adv.isSupportInterstitialAd()) {
                G_Adv.createInterstitialAdv(() => {
                    console.log("just shutdown the interstitial ad...")
                }, () => {
                    G_Adv.showInterstitialAdv()
                }, () => {
                    console.log("create interstitial ad fail...")
                })
            }
        }.bind(this))
    }

    _onShowOwnBanner() {
        // mark
        this._isBannerOnShow = true
        this._isForceMaxBanner = false

        G_Switch.isExportAdvEnabled("Banner", isEnabled => {
            if (isEnabled) {
                G_Event.dispatchEvent(G_EventName.EN_SHOW_OWN_BANNER_AD)
            }
        })
    }

    _onHideOwnBanner() {
        G_Switch.isExportAdvEnabled("Banner", isEnabled => {
            if (isEnabled) {
                G_Event.dispatchEvent(G_EventName.EN_HIDE_OWN_BANNER_AD)
            }
        })
    }

    onServerCheckFinished(cb) {
        // body...
        if (typeof cb === "function") {
            this._serverCheckFinishedCb = cb
        }
    }

    _doServerCheckFinishedCb() {
        // body...
        if (typeof this._serverCheckFinishedCb === "function") {
            this._serverCheckFinishedCb()
        }
    }

    registerShowLoadingFunc(func) {
        // body...
        if (typeof func === "function") {
            this._showLoadingFunc = func
        }
    }

    _doShowLoading( title ) {
        // body...
        if (typeof this._showLoadingFunc === "function") {
            this._showLoadingFunc(title)
        }
    }

    registerHideLoadingFunc(func) {
        // body...
        if (typeof func === "function") {
            this._hideLoadingFunc = func
        }
    }

    _doHideLoading() {
        // body...
        if (typeof this._hideLoadingFunc === "function") {
            this._hideLoadingFunc()
        }
    }
}