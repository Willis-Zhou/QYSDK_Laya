import BaseUI from "../base/BaseUI"
import AdvLoadMgr from "../../ctrl/AdvLoadMgr"

export default class BannerPopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() {
        super()

        // privates
        this._advLoadMgr = null
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
        let bannerAdLoader = G_UIHelper.seekNodeByName(this.owner, "bannerAdLoader")
        if (bannerAdLoader) {
            // save
            this._advLoadMgr = bannerAdLoader.getComponent(AdvLoadMgr)
        }
    }

    onInit() {
        if (this._advLoadMgr) {
            this._advLoadMgr.refreshAdv()
        }
    }
}