import BaseUI from "../base/BaseUI"

export default class InsertPopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() { 
        super();

        // privates
        this._title = null
        this._desc = null
        this._advBtn = null
        this._closeBtn = null
        this._clickBtn = null
        this._insertAdObj = null
        this._insertAdInfo = null
    }

    onAwake() {
        this._rootNode = this.rootNode
        this._openType = this.openType
        this._closeType = this.closeType
    }
    
    onEnable() {
        // init ui
        this._initUI()
    }

    _initUI() {
        // body...
        let title = G_UIHelper.seekNodeByName(this.owner, "title")
        if (title) {
            // save
            this._title = title
        }

        let desc = G_UIHelper.seekNodeByName(this.owner, "desc")
        if (desc) {
            // save
            this._desc = desc
        }

        let advBtn = G_UIHelper.seekNodeByName(this.owner, "adv")
        if (advBtn) {
            // save
            this._advBtn = advBtn

            advBtn.on("click", null, function () {
                this.onAdvTouched(advBtn)
            }.bind(this))
        }

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

    onInit() {
        let ret = G_OVAdv.getNextNativeAdInfo()
        if (ret) {
            let insertAdObj = ret[0]
            let insertAdInfo = ret[1]

            if (insertAdObj && insertAdInfo) {
                // save
                this._insertAdObj = insertAdObj
                this._insertAdInfo = insertAdInfo
    
                if (this._title) {
                    this._title.text = insertAdInfo.title
                }
    
                if (this._advBtn && insertAdInfo.imgUrlList.length > 0) {
                    this._advBtn.skin = insertAdInfo.imgUrlList[0]
                }
    
                if (this._desc) {
                    this._desc.text = insertAdInfo.desc
                }
    
                // report ad show
                G_OVAdv.reportNativeAdShow(insertAdObj, insertAdInfo.adId)
            }

            G_MistakeMgr.isBtnMistakeEnabled(isEnabled => {
                if (isEnabled) {
                    this._clickBtn.skin = "ad/ov/insert_ad_check_btn.png"
                }
                else {
                    this._clickBtn.skin = "ad/ov/insert_ad_shutdown_btn.png"
                }
            })
        }
    }

    onHide() {
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, function () {
            G_OVAdv.reportNativeAdHide()
            G_UIManager.hideUI("insertAd")
        }.bind(this))
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    onClickTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, function () {
            if (btn.skin === "ad/ov/insert_ad_check_btn.png") {
                // click
                this._clickAdv()
            }
            else {
                // close
                G_OVAdv.reportNativeAdHide()
            }

            G_UIManager.hideUI("insertAd")
        }.bind(this))
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    onAdvTouched( btn ) {
        // click
        this._clickAdv()

        G_UIManager.hideUI("insertAd")

        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    _clickAdv() {
        if (this._insertAdObj && this._insertAdInfo) {
            G_OVAdv.reportNativeAdClick(this._insertAdObj, this._insertAdInfo.adId, this._insertAdInfo.localAdID)
        }
    }
}