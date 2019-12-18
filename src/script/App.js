// import {QYSDK} from "./sdk_release/qysdk";
import {QYSDK} from "./sdk/qysdk";
import {APP_CONST} from "./game/global/app_const";

import { } from "./game/global/adv_mgr";
import { } from "./game/global/switch";
import { } from "./game/global/free_get_mgr";
import { } from "./game/global/node_pool_mgr";
import { } from "./game/global/player_info";
import { } from "./game/global/server_info";
import { } from "./game/global/sound_mgr";

// qq和oppo平台不要导入
import lodash from "./external/lodash/lodash.min.js"
import {qysdk} from "./db/proto/qysdk_db.js"
    
export default class App extends Laya.Script {

    constructor() { 
        super(); 
        
        this._serverCheckFinishedCb = null
        this._showLoadingFunc = null
        this._hideLoadingFunc = null
    }
    
    onEnable() {
        // 初始化游戏常量（可能会覆盖部分sdk的常量）
        APP_CONST.init()

        // 初始化SDK...
        QYSDK.init()

        // check...
        if (G_WXHelper.isQQPlatform() && typeof lodash !== "undefined") {
            console.error("qq平台暂不支持lodash第三方库...")
            return
        }

        // 注册lodash工具
        if (typeof lodash !== "undefined") {
            G_Utils.registerLodash(lodash)
        }

        // GameDB
        G_GameDB.load(qysdk)
        G_GameDB.registerAll(window.G_GameDBConfigs)
        G_GameDB.onLoad(function () {
            // body...
            // init Reportor
            G_Reportor.registerAllEvents(window.G_ReportEventName)

            // Oppo Adv
            G_OppoAdv.registerAll(window.G_OppoAdvConfigs)

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
    }

    _onAppEventRegistered() {
        // body...
        G_Event.addEventListerner(G_EventName.EN_SYSTEM_ERROR, function () {
            // body...
            G_WXHelper.showModal(
                G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_TITLE"]).word,
                G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_SYSTEM_ERROR_CONTENT"]).word,
                true,
                function ( bOK ) {
                    // body...
                    if (bOK) {
                        // restart
                        G_WXHelper.restartApp()
                    }
                    else {
                        // exit
                        G_WXHelper.exitApp()
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
            if (G_WXHelper.isQQPlatform()) {
                content = formatStr.format(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_QQ_PLATFORM_NAME"]).word)
            }
            else {
                content = formatStr.format(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_WX_PLATFORM_NAME"]).word)
            }
            G_WXHelper.showToast(content)
        })

        G_Event.addEventListerner(G_EventName.EN_VIDEO_NOT_SUPPORT_RIGHT_NOW, function () {
            // body...
            G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_VIDEO_NOT_SUPPORT"]).word)
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