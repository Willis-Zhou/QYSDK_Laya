import BaseUI from "../base/BaseUI"

export default class NativeFlow extends BaseUI {
    constructor() { 
        super();

        // privates
        this._closeBtn = null
        this._clickBtn = null
        this._insertAdObj = null
        this._insertAdInfo = null
    }
    
    onEnable() {
        // init ui
        this._initUI()

        // init event
        this._initEvent()

        // refresh
        this._refreshNativeAd()
    }

    onDisable() {
        // uninit event
        this._unInitEvent()
    }

    _initUI() {
        // body...
        let closeBtn = G_UIHelper.seekNodeByName(this.owner, "closeBtn")
        if (closeBtn) {
            // save
            this._closeBtn = closeBtn

            closeBtn.on("click", null, function () {
                this.onCloseTouched(closeBtn)
            }.bind(this))
        }

        let clickBtn = G_UIHelper.seekNodeByName(this.owner, "clickBtn")
        if (clickBtn) {
            // save
            this._clickBtn = clickBtn

            clickBtn.on("click", null, function () {
                this.onClickTouched(clickBtn)
            }.bind(this))
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
        this._refreshNativeAd()
    }

    onInit() {
        // refresh
        this._refreshNativeAd()
    }

    onHide() {
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, function () {
            G_OVAdv.reportNativeAdHide()
            
            // hide
            this.hideUI()
        }.bind(this))
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    onClickTouched( btn ) {
        if (this._insertAdObj && this._insertAdInfo) {
            G_OVAdv.reportNativeAdClick(this._insertAdObj, this._insertAdInfo.adId, this._insertAdInfo.localAdID)
        }

        // hide
        this.hideUI()
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    _refreshNativeAd() {
        if (!G_PlatHelper.isOVPlatform()) {
            // hide
            this.hideUI()
            return
        }

        let ret = G_OVAdv.getNextNativeAdInfo()
        if (ret) {
            let insertAdObj = ret[0]
            let insertAdInfo = ret[1]

            if (insertAdObj && insertAdInfo) {
                // save
                this._insertAdObj = insertAdObj
                this._insertAdInfo = insertAdInfo

                if (this._clickBtn && insertAdInfo.imgUrlList.length > 0) {
                    this._clickBtn.skin = insertAdInfo.imgUrlList[0]
                }
    
                // report ad show
                G_OVAdv.reportNativeAdShow(insertAdObj, insertAdInfo.adId)
            }
        }
        else {
            // hide
            this.hideUI()
        }
    }
}