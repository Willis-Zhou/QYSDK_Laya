import BaseUI from "../base/BaseUI"
import AdvLoadMgr from "../../ctrl/AdvLoadMgr"

export default class NewGameExitPopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() {
        super()

        // privates
        this._closeBtn = null
        this._advLoadMgr = null
        this._isMoveMistakeEnabled = false
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
        let closeBtn = G_UIHelper.seekNodeByName(this.owner, "closeBtn")
        if (closeBtn) {
            // reset
            closeBtn._isTouching = false

            // save
            this._closeBtn = closeBtn

            closeBtn.on("click", null, function () {
                this.onCloseTouched(closeBtn)
            }.bind(this))
        }

        let advLoader = G_UIHelper.seekNodeByName(this.owner, "advLoader")
        if (advLoader) {
            // save
            this._advLoadMgr = advLoader.getComponent(AdvLoadMgr)
        }
    }

    onInit() {
        // check mistake state
        this._isMoveMistakeEnabled = false
        G_MistakeMgr.isMoveMistakeEnabled(isEnabled => {
            this._isMoveMistakeEnabled = isEnabled

            if (!isEnabled) {
                G_UIHelper.delayShow(this._closeBtn)
            }
        })

        if (this._advLoadMgr) {
            this._advLoadMgr.refreshAdv()
        }

        // hide banner
        G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, () => {
            if (btn._isTouching) {
                return
            }

            if (!this._isMoveMistakeEnabled) {
                G_UIManager.hideUI("newGameExitAd")
            }
            else {
                // mark
                btn._isTouching = true

                G_UIHelper.autoMove(btn, 0, 1000, 1000, 0, false, new Laya.Vector2(0, 0), step => {
                    if (step === "hold_finished_1") {
                        // show banner
                        G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
                    }
                    else if (step === "move_finished") {
                        // reset
                        btn._isTouching = false

                        G_UIManager.hideUI("newGameExitAd")
                    }
                })
            }
        })
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }
}