export default class MoreGamePopup extends Laya.Script {

    constructor() {
        super()

        // privates
        this._isFirstShow = true
        this._closeBtn = null

        // cb
        this._closeCb = null
    }

    onEnable() {
        // init ui
        this._initUI()
    }

    _initUI() {
        let closeBtn = G_UIHelper.seekNodeByName(this.owner, "closeBtn")
        if (closeBtn) {
            // save
            this._closeBtn = closeBtn

            closeBtn.on("click", null, function () {
                this.onCloseTouched(closeBtn)
            }.bind(this))
        }
    }

    doShow() {
        if (this._closeBtn) {
            G_UIHelper.delayShow(this._closeBtn)
        }
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, function () {
            this._doCloseCallback()
        }.bind(this), 0.7)
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    registerCloseCallback( cb ) {
        if (typeof cb === "function") {
            this._closeCb = cb
        }
    }

    _doCloseCallback() {
        if (this._closeCb) {
            this._closeCb()
        }
    }
}