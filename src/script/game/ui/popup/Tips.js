import BaseUI from "../base/BaseUI"

export default class Tips extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() { 
        super();

        // privates
        this._bg = null
        this._content = null
        this._maxContendWidth = Laya.stage.width * 0.8
    }

    onAwake() {
        this._rootNode = this.rootNode
        this._openType = this.openType
        this._closeType = this.closeType
    }
    
    onEnable() {
        // init ui
        this._initUI()

        // default
        this._doClean()
    }

    _initUI() {
        // body...
        let bg = G_UIHelper.seekNodeByName(this.owner, "bg")
        if (bg) {
            // save
            this._bg = bg
        }

        let content = G_UIHelper.seekNodeByName(this.owner, "content")
        if (content) {
            // save
            this._content = content
        }
    }

    onInit( content ) {
        // clean first
        this._doClean()

        // fill content
        this._content.x = 15
        this._content.y = 15
        this._content.width = 0
        this._content.wordWrap = false
        this._content.text = content
        if (this._content.width > this._maxContendWidth) {
            this._content.width = this._maxContendWidth
            this._content.wordWrap = true
        }

        // extend bg
        this._bg.width = this._content.width + 30
        this._bg.height = this._content.height + 30
        this._bg.pivotX = this._bg.width / 2
        this._bg.pivotY = this._bg.height / 2
        this._bg.x = this.owner.width / 2
        this._bg.y = this.owner.height / 2

        // delay
        this._bg._scheduleKey = G_Utils.generateString(32)
        G_Scheduler.schedule(this._bg._scheduleKey, () => {
            this._bg._scheduleKey = null

            // hide
            G_UIManager.hideUI("tips")
        }, false, 2000, 1)
    }

    onHide() {
        this._doClean()
    }

    _doClean() {
        if (this._bg._scheduleKey) {
            G_Scheduler.unschedule(this._bg._scheduleKey)
            this._bg._scheduleKey = ""
        }
    }
}