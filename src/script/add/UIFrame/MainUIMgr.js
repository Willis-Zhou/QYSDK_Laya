import PageBase from "./PageBase";
import Dictionary from "./Dictionary";
import TweenPoolMgr from "./TweenPoolMgr";
import Tools from "./Tools";
import MistakeMgr from "../Mgr/MistakeMgr";
import GameMgr from "../Mgr/GameMgr";

/**
 * 界面应该遵循列表操作 即开启关闭有一定的顺序
 */
export default class MainUIMgr extends Laya.Script {

    constructor() {
        super();
        this.allPages = new Dictionary();//所有界面
        this.activePages = [];//激活的界面(可能会有重复的)
        this.curPageDepth = 0;//当前界面深度
        this.uiPagePath = "prefab/page/{0}.json";
        this.maxPageCount = 100;//最大的存在界面数量
        this.spaceDepth = 20;//每层之间间隔多少
        this.openPageOrderArray = [];//开启界面顺序(可以存储重复的名字)
        this.inOpenPageArray = [];//正在开启的界面
        this.box = null;
        this.adPagesName = [];//广告的name
        this.adPagesName.push(GameMgr.getUIName().AdFullView);
        this.adPagesName.push(GameMgr.getUIName().AdView);
        this.actionTween = [];
        this.openWaitFun = new Object();
    }

 

   

    preLoad(callBack) {


        let preLoadUiArray = [];
        preLoadUiArray.push(GameMgr.getUIName().AdView);
        //preLoadUiArray.push(GameMgr.getUIName().LodingView);

        if (preLoadUiArray.length == 0) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        let index = 0;
        let loadFun = () => {
            index++;
            if (preLoadUiArray.length == index) {

                Tools.getIns().handlerFun(callBack);
            }
        }

        for (let i = 0; i < preLoadUiArray.length; i++) {
            this.openUI(preLoadUiArray[i], null, () => {
                loadFun();
            },true)
        }
    }




    createMask() {
        if (!this.box) {
            this.box = new Laya.Box();
            this.owner.addChild(this.box);
            this.box.width = 10000;
            this.box.height = 10000;
            this.box.centerX = 0;
            this.box.centerY = 0;
            this.box.zOrder = 10000;
            this.box.mouseThrough = false;
            this.box.mouseEnabled = true;

        }
    }

    cretaActivePageData(pageBase, vals) {
        let obj = new Object();
        obj.pageBase = pageBase;
        obj.vals = vals;
        return obj;
    }

 

    /**
     * 初始化
     */
    init() {
        this.createMask();

        Tools.getIns().log("mainUI init");
    }

    setBoxMask() {
        this.showMask(this.inOpenPageArray.length > 0);
    }

    showMask(show) {
        if (this.box) {
            this.box.visible = show;
        }

    }

    addInOpen(pageName, callBack=null) {
        if (this.inOpenPageArray.indexOf(pageName) < 0) {
            this.inOpenPageArray.push(pageName);
            this.setBoxMask();
        }

        if (callBack) {
            if (!this.openWaitFun[pageName]) {
                this.openWaitFun[pageName] = [];
            }

            this.openWaitFun[pageName].push(callBack);
        }



    }

    removeInOpen(pageName) {
        let index = this.inOpenPageArray.indexOf(pageName);

        if (index >= 0) {
            this.inOpenPageArray.splice(index, 1);
            this.setBoxMask();
        }


        if (this.openWaitFun[pageName]) {
            let array = this.openWaitFun[pageName];

            for (let i = 0; i < array.length; i++) {
                if (array[i]) {
                    array[i]();
                }
            }
            this.openWaitFun[pageName] = null;
        }
    }

    hasInOpen(pageName) {
        return this.inOpenPageArray.indexOf(pageName) >= 0;
    }

    /**
     * 开启界面
     * @param {*} pageName 
     * @param {Object} vals 
     * @param {function} callBack 
     * @param {bool} isPreLoad 为true是 不会开启界面 只会预加载
     * @returns 
     */
    openUI(pageName, vals, callBack, isPreLoad = false) {

        if (!pageName) {
            Tools.getIns().error("界面name不为空");
            return;
        }

        //判断界面是否存在
        if (isPreLoad && this.getPageByName(pageName)) {
            Tools.getIns().handlerFun(callBack);
            console.log("界面已经存在 不需要预加载!");
            return;
        }

        if (this.hasInOpen(pageName)) {
            if (isPreLoad) {//预加载
                this.addInOpen(pageName, callBack);
            } else {//直接开启
                this.addInOpen(pageName, () => {
                    this.openUI(pageName, vals, callBack, false);
                })
            }
            console.log("界面正在创建:", pageName);
            return;
        }




        if (!this.canOperate(pageName, vals)) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        this.addInOpen(pageName, callBack);

        let endFun = () => {
            this.removeInOpen(pageName);
        }

        let pageBase = this.getPageByName(pageName);

        let pageInitFun = () => {
            if (!pageBase) {
                Tools.getIns().error("请添加界面脚本到", pageName);
                return;
            }
            pageBase.owner.visible = false;
            pageBase.pageName = pageName;
            this.changePage(true, pageBase);
            pageBase.pageInit();
        };

        let pageOpenFun = () => {
            let endPage = this.getEndActivePage();
            if (endPage && !pageBase.isPartPage) {
                endPage.hightPageOpen(pageName);
            }
            //判断是否加入广告
            this.changeActivePage(true, pageBase, vals);
            this.changePageOrder(true, pageName);
            this.offectPageDepth();
            pageBase.setPageOpenCallBack(endFun);
            pageBase.pageOpen(vals);

            if (pageBase.isDealAdView) {//显示广告界面
                this.showAdView(pageBase);
            }

            let tweenEndFun = () => {
                pageBase.pageOpenTweenOver();
            };

            pageBase.tweenOpen(tweenEndFun)
        };


        if (!pageBase) {
            this.createUI(pageName, (pg) => {
                pageBase = pg.getComponent(PageBase);
                pageInitFun();
                pageBase.pagePreload(() => {
                    if (isPreLoad) {//预加载直接跳出循环
                        console.log("预加载界面成功:",pageName);
                        endFun();
                    } else {
                        pageOpenFun();
                    }

                })
            })
        } else {
            pageOpenFun();
        }
    }



    tweenScale(target, pageBase, isOpen, callBack) {
        let tween = TweenPoolMgr.getIns().getTween();
        tween.setLoop(false);
        if (isOpen) {
            tween.setTweenVals(pageBase.tweenOpenVals);
        } else {
            tween.setTweenVals(pageBase.tweenCloseVals);
        }


        tween.setTarget(target);
        tween.setEndCallBack(() => {
            Tools.getIns().handlerFun(callBack);
            TweenPoolMgr.getIns().recycleTween(tween);
        });
        tween.play();
    }


    /**
     * 给外部调用
     */
    reShowAd(){
        let pageBase=this.getEndActivePage();
        if(pageBase){
            this.showAdView(pageBase,null);
        }
    }


    /**
    * 显示广告界面
    */
    showAdView(pageBase, callBack) {

        if (pageBase.pageName == GameMgr.getUIName().AdView) {
            Tools.getIns().handlerFun(callBack);
            return;
        }


        let adPage = null;

        let adFun = () => {
            adPage.showMoreBtn(pageBase.showMore);
            adPage.showTop(pageBase.isShowTop);
            adPage.showjuggleAD(pageBase.isShowLeftBar);
            if (pageBase.adObj) {
                adPage.setBottomType(pageBase.adObj);
            } else {
                adPage.setBottomType({num:3});
            }
            pageBase.showAdCallBack();
            Tools.getIns().handlerFun(callBack);
        }


        this.openUI(GameMgr.getUIName().AdView, null, () => {
            adPage = this.getPageByName(GameMgr.getUIName().AdView);
            adFun();
        })

    }



    /**
     * 
     * @param {bool} isAdd 
     * @param {PageBase} pageBase 
     */
    changeActivePage(isAdd, pageBase, vals) {

        if (!pageBase) {
            Tools.getIns().error("添加的激活页面不为空");
            return;
        }

        let removeIndex = this.getActivePageIndexByName(pageBase.pageName);
        if (isAdd) {

            if (removeIndex >= 0) {//移除之前的
                this.activePages.splice(removeIndex, 1);
            }

            this.activePages.push(this.cretaActivePageData(pageBase, vals));
        } else {

            if (removeIndex < 0) {
                return;
            }

            this.activePages.splice(removeIndex, 1);
        }
    }

    /**
     * 拿到激活界面
     * @param {*} pageName 
     */
    getActivePageIndexByName(pageName) {

        for (var i = 0; i < this.activePages.length; i++) {
            if (this.activePages[i].pageBase.pageName == pageName) {
                return i;
            }
        }

        return -1;
    }

    getActivePageByName(pageName) {
        for (var i = 0; i < this.activePages.length; i++) {
            if (this.activePages[i].pageBase.pageName == pageName) {
                return this.activePages[i].pageBase;
            }
        }

        return null;
    }

    /**
     * 
     * @param {bool} isAdd 是否添加
     * @param {PageBase} pageBase 
     */
    changePage(isAdd, pageBase) {
        if (!pageBase) {
            Tools.getIns().error("添加的页面不存在");
            return;
        }


        let temp = this.getPageByName(pageBase.pageName);
        if (isAdd) {
            if (!temp) {

                this.allPages.addKey(pageBase.pageName, pageBase);
            }
        } else {
            if (temp) {
                this.allPages.removeKey(pageBase.pageName);
            } else {
                Tools.getIns().error("界面不存在", pageBase);
            }
        }
    }

    /**
     * 调整界面层级
     */
    offectPageDepth() {
        let pageBase = null;
        let minDepth = 0;
        let loadingView = null;
        for (let i = 0; i < this.activePages.length; i++) {
            pageBase = this.activePages[i].pageBase;
            if (pageBase.autoDepth) {
                pageBase.owner.zOrder = minDepth + i * this.spaceDepth;
                this.curPageDepth = pageBase.owner.zOrder;
            }

            if (pageBase.pageName == GameMgr.getUIName().LodingView) {
                loadingView = pageBase;
            }
        }

        //loading界面永远在最上层
        if (loadingView) {
            loadingView.owner.zOrder = this.curPageDepth + this.spaceDepth;
        }

        for (let i = 0; i < this.activePages.length; i++) {
            this.activePages[i].pageBase.depChangeCallBack();
        }
    }

    /**
     * 调整页面数量
     */
    offectPageCount() {
        let pageCount = this.allPages.getCount();
        if (pageCount > this.maxPageCount) {
            let delCount = pageCount - this.maxPageCount;
            let pageBase = null;
            let keys = this.allPages.getKeys();
            for (var i = 0; i < keys.length; i++) {
                pageBase = this.allPages.getValue(keys[i]);
                if (this.isActivePage(pageBase.pageName) || !pageBase.isAutoDestroy || this.hasInOpen(pageBase.pageName)) {//是显示界面 不能自动摧毁 正在开启
                    continue;
                }

                this.changePage(false, pageBase);
                this.changeActivePage(false, pageBase);
                pageBase.pageDestroy();//摧毁执行
                pageBase.owner.destroy();
                delCount--;
                if (delCount <= 0) {
                    break;
                }
            }
        }

    }

    /**
     * 是否是激活界面
     * @param {*} pageName 
     */
    isActivePage(pageName) {
        for (var i = 0; i < this.activePages.length; i++) {
            if (pageName == this.activePages[i].pageBase.pageName) {
                return true;
            }
        }

        return false;
    }

    /**
     * 通过界面名字查找界面
     * @param {*} pageName 
     */
    getPageByName(pageName) {
        return this.allPages.getValue(pageName);
    }

    /**
     * 拿到最后一个激活界面
     */
    getEndActivePage() {

        if (this.activePages.length == 0) {
            return null;
        }

        for (var i = this.activePages.length - 1; i >= 0; i--) {
            if (this.activePages[i].pageBase.isPartPage) {
                continue;
            }

            return this.activePages[i].pageBase;
        }

        return null;
    }


    /**
     * 创建ui
     * @param {string} pageName 
     * @param {function} 创建回调
     */
    createUI(pageName, callBack) {
        let path = this.uiPagePath.format(pageName);
        let createFun = (go) => {
            go.name = pageName;
            go.width=this.owner.width;
            go.height=this.owner.height;
            go.centerX=0;
            go.centerY=0;
            Tools.getIns().handlerFun(callBack, go);
        }
        let go=this.owner.getChildByName(pageName);
        if(!go){
            Laya.loader.create(path, Laya.Handler.create(this, (obj)=>{
                let pref = new Laya.Prefab();
                pref.json = obj;
                let go = pref.create();
                this.owner.addChild(go);
                createFun(go);
            }));
        }else{
            console.log(pageName,"已经存在!");
            createFun(go);
        }

       
    }

    /**
     * 关闭界面
     * @param {*} pageName 
     */
    closeUI(pageName) {

        if (this.hasInOpen(pageName)) {
            console.error("正在关闭")
            return;
        }

        if (!this.canOperate(pageName)) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        let pageBase = this.getPageByName(pageName);
        if (pageBase) {
            //已经关闭
            if (!pageBase.isOpen) {
                return;
            }

            //先执行广告逻辑（先将界面从显示界面里面移除）
            this.changePageOrder(false, pageName);
            this.changeActivePage(false, pageBase);
            let endPage = null;
            

            let closeFun = () => {

                if (!pageBase.isPartPage) {//不是部分界面关闭
                    endPage = this.getEndActivePage();//拿到当前开启的最顶层界面
                }

                if (endPage) {
                    endPage.hightPageClose(pageName);
                    if (endPage.isDealAdView) {//不为广告界面
                        this.showAdView(endPage);
                    }

                }
                pageBase.pageClose();
                this.offectPageCount();//先校准界面数量
                this.removeInOpen(pageName);
            };

            this.addInOpen(pageName);
            //执行动画逻辑
            pageBase.tweenClose(closeFun);

        } else {
            Tools.getIns().error("关闭的界面不存在:", pageName);
        }
    }


    printActivePage() {
        for (var i = 0; i < this.activePages.length; i++) {
            console.log(i + "", this.activePages[i].pageBase);
        }
    }

    /**
     * 存储界面开启的顺序
     * @param {bool} isAdd 是否添加界面名字到列表
     * @param {string} pageName 
     */
    changePageOrder(isAdd, pageName) {
        if (isAdd) {

            let endIndex = this.openPageOrderArray.length - 1;
            if (endIndex >= 0) {
                if (pageName == this.openPageOrderArray[endIndex]) {//防止两层界面相邻
                    return;
                }
            }

            this.openPageOrderArray.push(pageName);
        } else {
            let removeIndex = this.openPageOrderArray.length - 1;
            if (removeIndex < 0) {
                return;
            }
            this.openPageOrderArray.splice(removeIndex, 1);
        }
    }

    /**
     * 
     * @param {是否能够操作界面} pageName 
     * @param {*} vals 
     */
    canOperate(pageName, vals) {
        if (!MistakeMgr.getIns().getIsExportAdvEnabled()) {

            if (pageName == GameMgr.getUIName().AdFullView) {
                if (vals) {
                    Tools.getIns().handlerFun(vals.closeFun);
                }
            }

            return this.adPagesName.indexOf(pageName) < 0;
        } else if (G_PlatHelper.isQQPlatform() || G_PlatHelper.isVIVOPlatform() || G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isTTPlatform()) {
            if (pageName == GameMgr.getUIName().AdFullView) {
                if (vals) {
                    Tools.getIns().handlerFun(vals.closeFun);
                }
                return false;
            }
        }

        return true;
    }

    /**
     * 隐藏所有ui
     * @param {*} ingore 
     */
    hintAllUI(ingore) {
        for (var i = 0; i < this.activePages.length; i++) {
            if (this.activePages[i].pageBase.pageName == ingore) {
                continue;
            } else {
                this.activePages[i].pageBase.owner.visible = false;
            }
        }
    }

    /**
     * 关闭所有界面
     * @param {*} list 忽视的界面名字
     */
    closeAllPage(list) {
        let pageBase = null;
        let pages = [];
        pages = pages.concat(this.activePages);

        for (let i = 0; i < pages.length; i++) {
            pageBase = pages[i].pageBase;
            if (list && list.indexOf(pageBase.pageName) >= 0) {
                continue;
            }

            this.closeUI(pageBase.pageName);
        }
    }

    /**
     * 显示所UI
     */
    showAllUI() {
        for (var i = 0; i < this.activePages.length; i++) {
            this.activePages[i].pageBase.owner.visible = true;
        }
    }

    hintUIByName(pageName) {
        let pageBase = this.getActivePageByName(pageName);
        if (pageBase) {
            pageBase.owner.visible = false;
        }
    }

    reShowHintUIByName(pageName) {
        let pageBase = this.getActivePageByName(pageName);
        if (pageBase) {
            pageBase.owner.visible = true;
        }
    }

    pageIsOpen(pageName) {
        let page = this.getPageByName(pageName);

        if (page && page.isOpen) {

            return true;
        }

        return false;
    }
}