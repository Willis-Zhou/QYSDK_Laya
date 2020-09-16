import BaseUI from "../base/BaseUI"
import AdvLoadMgr from "../../ctrl/AdvLoadMgr"

export default class FullScenePopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() {
        super()

        // privates
        this._closeBtn = null
        this._advLoadMgrs = []
        this._isMoveMistakeEnabled = false
        this._isCanClose = false
        this._scheduleKey = null
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

        let scrollAdvLoader = G_UIHelper.seekNodeByName(this.owner, "scrollAdvLoader")
        if (scrollAdvLoader) {
            // save
            this._advLoadMgrs.push(scrollAdvLoader.getComponent(AdvLoadMgr))
        }

        let bannerAdvLoader = G_UIHelper.seekNodeByName(this.owner, "bannerAdvLoader")
        if (bannerAdvLoader) {
            // save
            this._advLoadMgrs.push(bannerAdvLoader.getComponent(AdvLoadMgr))
        }
    }

    onInit() {
        // check mistake state
        this._isMoveMistakeEnabled = false
        G_MistakeMgr.isMoveMistakeEnabled(isEnabled => {
            this._isMoveMistakeEnabled = isEnabled

            if (!isEnabled) {
                this._isCanClose = true
                G_UIHelper.delayShow(this._closeBtn)
            }
            else {
                // disable close btn
                this._isCanClose = false

                // load cfg then invoke mistake
                G_Switch.getExportMoveMistakeConfig(cfg => {
                    if (this._scheduleKey) {
						G_Scheduler.unschedule(this._scheduleKey)
						this._scheduleKey = null
                    }
                    
                    this._scheduleKey = G_Utils.generateString(32)
                    G_Scheduler.schedule(this._scheduleKey, () => {
                        this._scheduleKey = null
                        
                        // show banner
                        G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)

                        this._scheduleKey = G_Utils.generateString(32)
                        G_Scheduler.schedule(this._scheduleKey, () => {
                            this._scheduleKey = null

                            // hide banner
                            G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)

                            // enable close btn
                            this._isCanClose = true
                        }, false, cfg.stay, 1)
                    }, false, cfg.delay, 1)
                })
            }
        })

        if (this._advLoadMgrs.length > 0) {
            this._advLoadMgrs.forEach(advLoadMgr => {
                advLoadMgr.refreshAdv()
            })
        }

        // hide banner
        G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, () => {
            if (this._isCanClose) {
                G_UIManager.hideUI("fullSceneAd")
                return
            }

            // if (btn._isTouching) {
            //     return
            // }

            // if (!this._isMoveMistakeEnabled) {
            //     G_UIManager.hideUI("fullSceneAd")
            // }
            // else {
            //     // mark
            //     btn._isTouching = true

            //     G_UIHelper.autoMoveWithDefaultConfig(btn, new Laya.Vector2(0, 0), step => {
            //         if (step === "hold_finished_1") {
            //             // show banner
            //             G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
            //         }
            //         else if (step === "move_finished") {
            //             // reset
            //             btn._isTouching = false
            //             this._isCanClose = true

            //             // hide banner
            //             G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)
            //         }
            //     })
            // }
        })
        
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }
}