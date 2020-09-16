import BaseUI from "../base/BaseUI"

export default class Modal extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() { 
        super();

        // privates
        this._bg = null
        this._title = null
        this._content = null
        this._cancelBtn = null
        this._confirmBtn = null
        this._singleConfirmBtn = null
        this._cb = null
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
        let bg = G_UIHelper.seekNodeByName(this.owner, "bg")
        if (bg) {
            // save
            this._bg = bg
        }

        let title = G_UIHelper.seekNodeByName(this.owner, "title")
        if (title) {
            // save
            this._title = title
        }

        let content = G_UIHelper.seekNodeByName(this.owner, "content")
        if (content) {
            // save
            this._content = content
        }

        let cancelBtn = G_UIHelper.seekNodeByName(this.owner, "cancelBtn")
        if (cancelBtn) {
            cancelBtn.on("click", null, function () {
                this.onCancelTouched(cancelBtn)
            }.bind(this))

            // save
            this._cancelBtn = cancelBtn
        }

        let confirmBtn = G_UIHelper.seekNodeByName(this.owner, "confirmBtn")
        if (confirmBtn) {
            confirmBtn.on("click", null, function () {
                this.onConfirmTouched(confirmBtn)
            }.bind(this))

            // save
            this._confirmBtn = confirmBtn
        }

        let singleConfirmBtn = G_UIHelper.seekNodeByName(this.owner, "singleConfirmBtn")
        if (singleConfirmBtn) {
            singleConfirmBtn.on("click", null, function () {
                this.onConfirmTouched(singleConfirmBtn)
            }.bind(this))

            // save
            this._singleConfirmBtn = singleConfirmBtn
        }
    }

    onInit( obj ) {
        console.log(obj)

        // cb
        this._cb = obj.cb

        // title
        if (this._title) {
            if (obj.title) {
                this._title.visible = true
                this._title.text = obj.title

                if (this._bg) {
                    this._bg.height = 266
                }
            }
            else {
                this._title.visible = false

                if (this._bg) {
                    this._bg.height = 226
                }
            }
        }

        // content
        if (this._content && obj.content) {
            this._content.text = obj.content
        }

        // cancel
        if (this._cancelBtn) {
            if (obj.cancelText) {
                this._cancelBtn.label = obj.cancelText
            }
            else {
                this._cancelBtn.label = "取消"
            }

            if (obj.cancelColor) {
                this._cancelBtn.labelColors = obj.cancelColor + "," + obj.cancelColor + "," + obj.cancelColor
            }
            else {
                this._cancelBtn.labelColors = "#000000,#000000,#000000"
            }
        }

        // confirm
        let confirmBtns = [this._confirmBtn, this._singleConfirmBtn]
        confirmBtns.forEach(confirmBtn => {
            if (obj.confirmText) {
                confirmBtn.label = obj.confirmText
            }
            else {
                confirmBtn.label = "确定"
            }

            if (obj.confirmColor) {
                confirmBtn.labelColors = obj.confirmColor + "," + obj.confirmColor + "," + obj.confirmColor
            }
            else {
                confirmBtn.labelColors = "#576B95,#576B95,#576B95"
            }
        })

        if (obj.showCancel) {
            this._cancelBtn.visible = this._confirmBtn.visible = true
            this._singleConfirmBtn.visible = false
        }
        else {
            this._cancelBtn.visible = this._confirmBtn.visible = false
            this._singleConfirmBtn.visible = true
        }
    }

    onCancelTouched() {
        G_UIManager.hideUI("modal")

        // cb
        if (typeof this._cb === "function") {
            this._cb(false)
        }
    }

    onConfirmTouched() {
        G_UIManager.hideUI("modal")

        // cb
        if (typeof this._cb === "function") {
            this._cb(true)
        }
    }
}