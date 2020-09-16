import BaseUI from "../base/BaseUI"

export default class ClickPopup extends BaseUI {
    /** @prop {name:invokeType, tips:"触发方式, banner为显示banner，appBox为弹出广告盒子，none为无", type:Option, option:"none,banner,appBox", default:"none"}*/
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() { 
        super();

        // configs
        this._minusValue = 0.05
        this._addValue = 0.175
        this._targetValue = 0.5
        this._miniClickTimes = 1
        this._maxClickTimes = 3
        this._needClickTimes = 0
        this._curClickTimes = 0
        this._maxValue = 0.9
        this._miniValue = 0.0

        // privates
        this._clickProgress = null
        this._clickBtn = null

        // schedule
        this._scheduleKey = ""

        // invoke
        this._isInvoked = false
    }

    onAwake() {
        this._rootNode = this.rootNode
        this._openType = this.openType
        this._closeType = this.closeType
    }
    
    onEnable() {
        // init ui
        this._initUI()

        // get mistake config
        G_Switch.getClickMistakeConfig(cfg => {
            this._minusValue = cfg.mimus
            this._addValue = cfg.add
            this._targetValue = cfg.target
            this._miniClickTimes = cfg.miniClick
            this._maxClickTimes = cfg.maxClick

            console.log(cfg)
        })
    }

    _initUI() {
        // body...
        let clickProgress = G_UIHelper.seekNodeByName(this.owner, "clickProgress")
        if (clickProgress) {
            // save
            this._clickProgress = clickProgress
            this._clickProgress.value = 0
        }

        let clickBtn = G_UIHelper.seekNodeByName(this.owner, "clickBtn")
        if (clickBtn) {
            // save
            this._clickBtn = clickBtn

            clickBtn.on("click", null, () => {
                // action
                G_UIHelper.playBtnTouchAction(clickBtn)

                // sound
                G_SoundMgr.playSound(G_SoundName.SN_CLICK)

                // add clickProgress
                this.onAddclickProgress()
            })
        }
    }

    onInit() {
        // hide banner first
        G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD)

        // reset
        this._isInvoked = false
        this._needClickTimes = G_Utils.random(this._miniClickTimes, this._maxClickTimes)
        this._curClickTimes = 0

        if (this._clickProgress) {
            this._clickProgress.value = 0
        }

        // schedule
        this._schedule()
    }

    onHide() {
        // unschedule
        this._unschedule()
    }
    
    onAddclickProgress() {
        if (this._clickProgress) {
            this._clickProgress.value += this._addValue

            // fix
            if (this._clickProgress.value > this._maxValue) {
                this._clickProgress.value = this._maxValue
            }

            // match
            if (this._clickProgress.value > this._targetValue) {
                this._curClickTimes += 1

                if (this._curClickTimes === this._needClickTimes) {
                    // unschedule
                    this._unschedule()

                    // invoke
                    this.onTriggerInvoked()
                }
            }
        }
    }

    onMimusclickProgress() {
        if (this._clickProgress && this._clickProgress.value > this._miniValue) {
            this._clickProgress.value -= this._minusValue

            // fix
            if (this._clickProgress.value < this._miniValue) {
                this._clickProgress.value = this._miniValue
            }
        }
    }

    onTriggerInvoked() {
        if (this._isInvoked) {
            return
        }

        if (!this._isInvoked) {
            this._isInvoked = true
        }

        if (this.invokeType === "banner") {
            G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD)
            this.onDelayHide()
        }
        else if (this.invokeType === "appBox") {
            G_Adv.createBoxAdv(() => {
                this.onDelayHide()
            })
        }
    }

    onDelayHide() {
        G_Scheduler.schedule(G_Utils.generateString(32), () => {
            if (this.invokeType === "banner") {
                G_UIManager.hideUI("clickBtnMistake")
            }
            else if (this.invokeType === "appBox") {
                G_UIManager.hideUI("clickBoxMistake")
            }
        }, false, 1000, 0)
    }

    _schedule() {
        // unschedule first
        this._unschedule()

        this._scheduleKey = G_Utils.generateString(32)
        G_Scheduler.schedule(this._scheduleKey, () => {
            this.onMimusclickProgress()
        }, false, 100)
    }

    _unschedule() {
        if (this._scheduleKey !== "") {
            G_Scheduler.unschedule(this._scheduleKey)
            this._scheduleKey = ""
        }
    }
}