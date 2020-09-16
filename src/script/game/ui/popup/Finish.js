import BaseUI from "../base/BaseUI"
import AdvLoadMgr from "../../ctrl/AdvLoadMgr"

export default class Finish extends BaseUI {
    constructor() {
        super()

        // privates
        this._advLoadMgr = null
    }

    onEnable() {
        // init ui
        this._initUI()

        // init event
        this._initEvent()

        // refresh
        this._refreshAd()
    }

    onDisable() {
        // uninit event
        this._unInitEvent()
    }

    _initUI() {
        let advLoadMgr = this.owner.getComponent(AdvLoadMgr)
        if (advLoadMgr) {
            // save
            this._advLoadMgr = advLoadMgr
        }
    }

    _initEvent() {
        G_Event.addEventListerner(G_EventName.EN_REFRESH_FLOW_AD, this._doShowAndRefreshAd, this)
    }

    _unInitEvent() {
        G_Event.removeEventListerner(G_EventName.EN_REFRESH_FLOW_AD, this._doShowAndRefreshAd, this)
    }

    _doShowAndRefreshAd() {
        // show
        this.showUI()

        // refresh
        this._refreshAd()
    }

    onInit() {
        // refresh
        this._refreshAd()
    }

    _refreshAd() {
        if (G_PlatHelper.getPlat()) {
            if (!(G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isWXPlatform() || G_PlatHelper.isTTPlatform())) {
                // hide
                this.hideUI()
                return
            }
        }

        if (this._advLoadMgr) {
            this._advLoadMgr.refreshAdv()
        }
        else {
            // hide
            this.hideUI()
        }
    }
}