import GameMgr from "../Mgr/GameMgr";
import TeachBtn from "../teach/TeachBtn";
import TweenType from "../UIFrame/TweenType";
import PlatAction from "./PlatAction";
import Tools from "./Tools";
export default class PageBase extends Laya.Script {

    constructor() {
        super();
        this.chineseName = "基类";
        this.isOpen = false;
        this.pageName = null;
        this.viewProp = {};
        this.isAddListerener = false;
        this.adObj = null;
        this.showMore = false;
        this.isPartPage = false;//是否是界面的一部分
        this.pageOpenCallBack = null;//界面开启的回调
        this.isAutoExeOpenCallBack = true;
        this.isAutoDestroy = true;
        this.isNeedTween = false;
        this.isDealAdView = true;//是否自动处理广告界面
        this.nodeTween = [];
        this.tweenBg = null;
        this.autoDepth = true;//自动设置深度
        this.teachBtns = [];
        this.isShowTop = false;
        this.isShowLeftBar = false;//是否显示左边的积木
        this.useNodeTween = false;//是否使用子节点的动画
        //动画数据
        this.tweenOpenVals = [];
        this.tweenOpenVals.push({ time: 300, prop: { scaleX: 0.3, scaleY: 0.3 }, ease: Laya.Ease.expoOut });
        this.tweenOpenVals.push({ time: 300, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.expoOut });

        this.tweenCloseVals = [];
        this.tweenCloseVals.push({ time: 150, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.backIn });
        this.tweenCloseVals.push({ time: 150, prop: { scaleX: 0, scaleY: 0 }, ease: Laya.Ease.backIn });
    }

    /**
     * 记录m_开头的节点
     */
    insertVal() {
        //插入值
        let p = [];
        Tools.getIns().getChildBySgin(this.owner, GameMgr.getUIName().nodeSgin, p);

        for (var i = 0; i < p.length; i++) {
            this.viewProp[p[i].name] = p[i];
            let tweenType = p[i].getComponent(TweenType);
            if (tweenType) {
                tweenType.init();
                this.nodeTween.push(tweenType);
            }

            let teactBtn = p[i].getComponent(TeachBtn);
            if (teactBtn) {
                teactBtn.init();
                this.teachBtns.push(teactBtn);
            }
        }
    }

    /**
     * 界面初始化
     */
    pageInit() {
        this.insertVal();
        this.tweenBg = G_UIHelper.seekNodeByName(this.owner, "m_tween_bg");
    }

    /**
     * 添加监听
     */
    addListerner() {
        this.isAddListerener = true;
    }

    pagePreload(callBack) {
        Tools.getIns().handlerFun(callBack);
    }


    tweenClose(callback) {
        if (this.isNeedTween && this.tweenCloseVals.length > 0) {
            let node = this.tweenBg ? this.tweenBg : this.owner;
            GameMgr.getUIMgr().tweenScale(node, this, false, callback);
        } else {
            Tools.getIns().handlerFun(callback);
        }
    }

    tweenOpen(callback) {
        if (this.isNeedTween && this.tweenCloseVals.length > 0) {
            let node = this.tweenBg ? this.tweenBg : this.owner;
            GameMgr.getUIMgr().tweenScale(node, this, true, callback);
        } else {
            Tools.getIns().handlerFun(callback);
        }
    }

    /**
     * 上层界面关闭(回调)
     */
    hightPageClose(pageName) {

    }

    /**
     * 上层界面开启
     * @param {*} pageName 
     */
    hightPageOpen(pageName) {

    }

    /**
     * 界面开启(界面从关闭到开启调用这个方法)
     */
    pageOpen(vals) {
        this.owner.visible = true;
        if (!this.isAddListerener) {
            this.addListerner();
        }
        this.isOpen = true;
        this.playNodeTween();

    }

    /**
     * 开启动画播放结束回调
     */
    pageOpenTweenOver() {
        this.resigstBtn();
        Tools.getIns().handlerFun(this.pageOpenCallBack, this);
    }

    /**
     * 注册教程事件
     */
    resigstBtn() {
        for (let i = 0; i < this.teachBtns.length; i++) {
            this.teachBtns[i].resigstBtn();
        }
    }

    /**
     * 注销教程事件
     */
    unResigstBtn() {
        for (let i = 0; i < this.teachBtns.length; i++) {
            this.teachBtns[i].unResigstBtn();
        }
    }

    /**
     * 播放节点的动画
     */
    playNodeTween() {
        for (var i = 0; i < this.nodeTween.length; i++) {
            this.nodeTween[i].playTween();
        }
    }

    /**
     * 关闭节点的动画
     */
    closeNodeTween() {
        for (var i = 0; i < this.nodeTween.length; i++) {
            this.nodeTween[i].endTween();
        }
    }

    /**
     * 广告显示回调
     */
    showAdCallBack(){
        //清除格子广告
        PlatAction.getIns().destoryCustomAd();
    }

    /**
     * 界面关闭
     */
    pageClose() {

        if (this.isAddListerener) {
            this.removeListerner();
        }
        this.isOpen = false;
        this.owner.visible = false;
        this.closeNodeTween();
        this.unResigstBtn();
    }

    /**
     * 移除监听
     */
    removeListerner() {
        this.isAddListerener = false;
    }

    /**
     * 界面摧毁
     */
    pageDestroy() {
        if (!this.isOpen) {//不能重复关闭
            return;
        }
        this.pageClose();
    }

    /**
     * 设置界面开启的回调
     * @param {*} callBack 
     */
    setPageOpenCallBack(callBack) {
        this.pageOpenCallBack = callBack;
    }


    /**
     * 深度改变回调
     */
    depChangeCallBack() {

    }
}