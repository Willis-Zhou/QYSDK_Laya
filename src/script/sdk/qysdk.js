import {} from "./extend/laya_extend.js";
import {} from "./extend/class_extend.js";
import {QYSDK_CONST} from "./qysdk_const";

import {_Scheduler} from "./helper/scheduler.js";
import {_Event} from "./helper/event.js";
import {_Utils} from "./helper/utils.js";
import {_UIHelper} from "./helper/ui_helper.js";
import {_Downloader} from "./helper/downloader.js";
import {_GameDB} from "./db/game_db.js";
import {_WXHelper} from "./helper/wx_helper.js";
import {_SDKCfg} from "./conf/sdk_conf.js";
import {_OpenHelper} from "./helper/open_helper.js";
import {_WSHelper} from "./net/ws_helper.js";
import {_HttpHelper} from "./net/http_helper.js";
import {_NetHelper} from "./helper/net_helper.js";
import {_Share} from "./helper/share.js";
import {_Adv} from "./helper/adv.js";
import {_OppoAdv} from "./helper/oppo_adv.js";
import {_Reportor} from "./helper/reportor.js";

var QYSDK = {}

var preload = function () {
    // body...
    console.log("开始预先初始化 QYSDK...")

    // Const
    QYSDK_CONST.init()
}

QYSDK.init = function () {
    // body...
    console.log("开始初始化 QYSDK...")

    // Schedule
    window.G_Scheduler = _Scheduler.getInstance()

    // Event
    window.G_Event = _Event.getInstance()

    // Utils
    window.G_Utils = _Utils.getInstance()

    // UIHelper
    window.G_UIHelper = _UIHelper.getInstance()

    // WX Helper
    window.G_WXHelper = _WXHelper.getInstance()

    // Downloader
    window.G_Downloader = _Downloader.getInstance()

    // GameDB
    window.G_GameDB = _GameDB.getInstance()

    // After GameDB Initialization
    G_GameDB.onLoad(function () {
        // body...
        console.log("GameDB 初始化完成...")

        // SDK Config
        window.G_SDKCfg = _SDKCfg.getInstance()
        G_SDKCfg.init()

        if (G_SDKCfg.isOpenDataEnabled()) {
            // Open Helper
            window.G_OpenHelper = _OpenHelper.getInstance()
        }

        if (G_SDKCfg.isNetwordEnabled()) {
            // WS Helper
            window.G_WSHelper = _WSHelper.getInstance()
        }

        if (G_SDKCfg.isHttpsEnabled()) {
            // Http Helper
            window.G_HttpHelper = _HttpHelper.getInstance()
        }

        // Net Helper
        window.G_NetHelper = _NetHelper.getInstance()
        // Net Address
        let arr = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_HTTP_ADDR_OF_SERVER"]).str.split("||")
        G_NetHelper.registerBaseUrl(arr[0], arr[1])

        // Share
        window.G_Share = _Share.getInstance()

        // Adv
        window.G_Adv = _Adv.getInstance()

        // open Adv
        window.G_OppoAdv = _OppoAdv.getInstance()

        // Reportor
        window.G_Reportor = _Reportor.getInstance()
    })
}

// preload
preload()

// export
export {QYSDK}