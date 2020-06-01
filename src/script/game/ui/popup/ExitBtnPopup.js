import BaseUI from "../base/BaseUI"
import AdvLoadMgr from "../../ctrl/AdvLoadMgr"

export default class ExitBtnPopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() {
        super()

        // privates
        this._advLoadMgr = null
        this._exitBtn = null
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
        let adLoader = G_UIHelper.seekNodeByName(this.owner, "adLoader")
        if (adLoader) {
            // fix pos
            if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().getMenuButtonBoundingClientRect()) {
                let rect = G_PlatHelper.getPlat().getMenuButtonBoundingClientRect()
                let worldPt = G_UIHelper.convertToWorldPt({x: rect.left, y: rect.top})
                let worldSize = G_UIHelper.convertToWorldSize({width: rect.width, height: rect.height})

                // fix pos
                adLoader.x = worldPt.x
                adLoader.y = worldPt.y + worldSize.height + 10

                // fix size
                adLoader.width = worldSize.width
                adLoader.height = worldSize.height
            }

            // save
            this._advLoadMgr = adLoader.getComponent(AdvLoadMgr)
        }

        let exitBtn = G_UIHelper.seekNodeByName(this.owner, "exitBtn")
        if (exitBtn) {
            // save
            this._exitBtn = exitBtn

            exitBtn.on("click", null, function () {
                this.onExitTouched(exitBtn)
            }.bind(this))
        }
    }

    onExitTouched() {
        if (this._advLoadMgr) {
            this._advLoadMgr.randomNavigate()
        }
    }
}