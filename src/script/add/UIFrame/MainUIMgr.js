import UIName from "./UIName";
import Tools from "./Tools";
import { Dictionary } from "./Dictionary";
import PageBase from "./PageBase";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";

/**
 * 界面应该遵循列表操作 即开启关闭有一定的顺序
 */
export default class MainUIMgr extends Laya.Script {

    constructor() { 
        super(); 
        window.G_UIName=new UIName();
        this.allPages=new Dictionary();//所有界面
        this.activePages=[];//激活的界面(可能会有重复的)
        this.curPageDepth=0;//当前界面深度
        this.uiPagePath="prefab/page/{0}.json";
        this.maxPageCount=100;//最大的存在界面数量
        this.spaceDepth=20;//每层之间间隔多少
        this.openPageOrderArray=[];//开启界面顺序(可以存储重复的名字)
        this.inOpenPageArray=[];//正在开启的界面
        this.box=null;
        this.adPagesName=[];//广告的name
        this.adPagesName.push(G_UIName.AdFullView);
        this.adPagesName.push(G_UIName.AdView);
        this.actionTween=[];



    }

    setBackCallBack(){
        if(G_PlatHelper.isWXPlatform()){
            if(wx&&wx.onShow){
                wx.onShow(function(){
                    G_SoundMgr.resumeMusic();
                }.bind(this));
            }
        }
    }
    
    createMask(){
        if(!this.box){
            this.box=new Laya.Box();
            this.owner.addChild(this.box);
            this.box.width=10000;
            this.box.height=10000;
            this.box.centerX=0;
            this.box.centerY=0;
            this.box.zOrder=10000;
            this.box.mouseThrough=false;
            this.box.mouseEnabled=true;
            
        }
    }

    cretaActivePageData(pageBase,vals){
        let obj=new Object();
        obj.pageBase=pageBase;
        obj.vals=vals;
        return obj;
    }

    /**
     * 初始化
     */
    init(){
        window.G_UIName=new UIName();
        this.createMask();
        this.setBackCallBack();
        G_Tools.log("mainUI init");
    }

    setBoxMask(){
        if(this.box){
            this.box.visible=this.inOpenPageArray.length>0;
        }
    }

    addInOpen(pageName){
        if(this.inOpenPageArray.indexOf(pageName)>=0){
            return;
        }

        this.inOpenPageArray.push(pageName);
        this.setBoxMask();
    }

    removeInOpen(pageName){
        let index=this.inOpenPageArray.indexOf(pageName);

        if(index>=0){
            this.inOpenPageArray.splice(index,1);
        }
        this.setBoxMask();
    }

    hasInOpen(pageName){
        return this.inOpenPageArray.indexOf(pageName)>=0;
    }

    /**
     * 开启界面
     * @param {String} pageName 界面名字
     */
    openUI(pageName,vals,callBack){

        if(!pageName){
            G_Tools.error("界面name不为空");
            return ;
        }

        if(this.hasInOpen(pageName)){
            G_Tools.error("界面正在创建:",pageName);
            return;
        }

        if(!this.canOperate(pageName,vals)){
            G_Tools.handlerFun(callBack);
            return ;
        }

        this.addInOpen(pageName);
        let pageBase=this.getPageByName(pageName);

        

        let pageInitFun=function(){
            if(!pageBase){
                G_Tools.error("请添加界面脚本到",pageName);
                return;
            }
            pageBase.pageName=pageName;
            this.changePage(true,pageBase);
            pageBase.pageInit();
        }.bind(this);

        let pageOpenFun=function(){
            let endPage=this.getEndActivePage();
            if(endPage&&!pageBase.isPartPage){
                endPage.pageBase.hightPageOpen(pageName);
            }
            //判断是否加入广告
            this.changeActivePage(true,pageBase,vals);
            this.changePageOrder(true,pageName);
            this.offectPageDepth();
            pageBase.setPageOpenCallBack(callBack);
            pageBase.pageOpen(vals);
            this.removeInOpen(pageName);
            if(pageBase.isDealAdView){
                this.showAdView(pageBase);
            }
           
            if(pageBase.isAutoExeOpenCallBack){
                pageBase.exeOpenCallBack();
            }

            let tweenEnfFun=function(){
                pageBase.pageOpenTweenOver();
            }

            if(pageBase.isNeedTween){
                if(!pageBase.tweenBg){
                    this.tweenScale(pageBase.owner,pageBase.tweenEaseOut,tweenEnfFun);
                }else{
                    this.tweenScale(pageBase.tweenBg,pageBase.tweenEaseOut,tweenEnfFun);
                }
            }else{
                tweenEnfFun();
            }

        }.bind(this);

        if(!pageBase){
            this.createUI(pageName,function(pg){
                pageBase=pg.getComponent(PageBase);
                pageInitFun();
                pageOpenFun();
            })
        }else{
            pageOpenFun();
        }
    }

   

    tweenScale(target,ease,callBack){
        let tween=new ContinuousTweenMgr()//this.getTween();
        tween.setLoop(false);
        let vals=[];
        vals.push({time:300,prop:{scaleX:0.3,scaleY:0.3},ease:ease});
        vals.push({time:300,prop:{scaleX:1,scaleY:1},ease:ease});
        tween.setTweenVals(vals);
        tween.setTarget(target);
        tween.setEndCallBack(function(){
            this.recycleTween(tween);
            G_Tools.handlerFun(callBack);
        }.bind(this));
        tween.play();
    }

    backScaleTween(target,ease,callBack){
        let tween=new ContinuousTweenMgr()//this.getTween();
        tween.setLoop(false);
        let vals=[];
        vals.push({time:150,prop:{scaleX:1,scaleY:1},ease:ease});
        vals.push({time:150,prop:{scaleX:0,scaleY:0},ease:ease});
        tween.setTweenVals(vals);
        tween.setTarget(target);
        tween.setEndCallBack(function(){
            this.recycleTween(tween);
            G_Tools.handlerFun(callBack);
        }.bind(this));
        tween.play();
    }

    getTween(){
        let ten=null;
        if(this.actionTween.length==0){
            ten=this.actionTween[0];
            this.actionTween.splice(0,1);
        }else{
            ten= new ContinuousTweenMgr();
        }

        return ten;
    }

    recycleTween(ten){

        if(ten){
            ten.clearEndFun();
            ten.end();
            ten.clearTarget();
        }

        if(this.actionTween.indexOf(ten)<0){
            this.actionTween.push(ten);
        }
    }

     /**
     * 显示广告界面
     */
    showAdView(pageBase){

        let showAd=true;

        if(!G_MistakeHelp.getIsExportAdvEnabled()){
            showAd=false;
        }

        let adView=G_MainGui.getPageByName(G_UIName.AdFullView);
        if(adView&&adView.isOpen){

            showAd=false;
        }

        if(!pageBase.adObj){
            showAd=false;
            let adPage=this.getPageByName(G_UIName.AdView);
            if(adPage){
                adPage.setBottomType(3,0);
                if(adPage.isOpen){
                    this.closeUI(G_UIName.AdView);
                }
                
            }

        }else{
            let adObj=pageBase.adObj;
            this.openUI(G_UIName.AdView,null,function(){
                let adView=this.getPageByName(G_UIName.AdView);
                if(adView){
                    adView.setBottomType(adObj.num,adObj.enFun);
                    adView.showMoreBtn(pageBase.showMore);
                }
               
            }.bind(this));
        }

       
    }



    /**
     * 
     * @param {bool} isAdd 
     * @param {PageBase} pageBase 
     */
    changeActivePage(isAdd,pageBase,vals){

        if(!pageBase){
            G_Tools.error("添加的激活页面不为空");
            return;
        }

        let removeIndex=this.getActivePageIndexByName(pageBase.pageName);
        if(isAdd){

            if(removeIndex>=0){//移除之前的
               this.activePages.splice(removeIndex,1);
            }

            this.activePages.push(this.cretaActivePageData(pageBase,vals));
        }else{

         if(removeIndex<0){
             return;
         }

         this.activePages.splice(removeIndex,1);
       }
    }

    /**
     * 拿到激活界面
     * @param {*} pageName 
     */
    getActivePageIndexByName(pageName){

        for(var i=0;i<this.activePages.length;i++){
            if(this.activePages[i].pageBase.pageName==pageName){
                return i;
            }
        }

        return -1;
    }

    /**
     * 
     * @param {bool} isAdd 是否添加
     * @param {PageBase} pageBase 
     */
    changePage(isAdd,pageBase){
        if(!pageBase){
            G_Tools.error("添加的页面不存在");
            return;
        }


        let temp=this.getPageByName(pageBase.pageName);
        if(isAdd){
            if(!temp){
                
                this.allPages.addKey(pageBase.pageName,pageBase);
            }
        }else{
            if(temp){
                this.allPages.removeKey(pageBase.pageName);
            }else{
                G_Tools.error("界面不存在",pageBase);
            }
        }
    }

    /**
     * 调整界面层级
     */
    offectPageDepth(){
        let pageBase=null;
        let minDepth=0;
        for(let i=0;i<this.activePages.length;i++){
            pageBase=this.activePages[i].pageBase;
            if(pageBase.autoDepth){
                pageBase.owner.zOrder=minDepth+i*this.spaceDepth;
                this.curPageDepth=pageBase.owner.zOrder;
            }
            
        }

        for(let i=0;i<this.activePages.length;i++){
            this.activePages[i].pageBase.depChangeCallBack();
        }
    }

    /**
     * 调整页面数量
     */
    offectPageCount(){
        let pageCount=this.allPages.getCount();
        if(pageCount>this.maxPageCount){
            let delCount=pageCount-this.maxPageCount;
            let pageBase=null;
            let keys=this.allPages.getKeys();
            for(var i=0;i<keys.length;i++){
                pageBase=this.allPages.getValue(keys[i]);
                if(this.isActivePage(pageBase.pageName)||!pageBase.isAutoDestroy||this.hasInOpen(pageBase.pageName)){//是显示界面 不能自动摧毁 正在开启
                    continue;
                }

                this.changePage(false,pageBase);
                this.changeActivePage(false,pageBase);
                pageBase.pageDestroy();//摧毁执行
                pageBase.owner.destroy();
                delCount--;
                if(delCount<=0){
                    break;
                }
            }
        }

    }

    /**
     * 是否是激活界面
     * @param {*} pageName 
     */
    isActivePage(pageName){
        for(var i=0;i<this.activePages.length;i++){
            if(pageName==this.activePages[i].pageBase.pageName){
                return true;
            }
        }

        return false;
    }

    getPageByName(pageName){
        return this.allPages.getValue(pageName);
    }

    /**
     * 拿到最后一个激活界面
     */
    getEndActivePage(){

        if(this.activePages.length==0){
            return null;
        }

        for(var i=this.activePages.length-1;i>=0;i--){
            if(this.activePages[i].pageBase.isPartPage){
                continue;
            }

            return this.activePages[i];
        }

        return null;
    }

    /**
     * 创建ui
     * @param {string} pageName 
     * @param {function} 创建回调
     */
    createUI(pageName,callBack){
        let path=this.uiPagePath.format(pageName);
        let createFun=function(obj){
            let pref=new Laya.Prefab();
            pref.json=obj;
            let go=pref.create();
            this.owner.addChild(go);
            go.name=pageName;
            G_Tools.handlerFun(callBack,go);
        }
        Laya.loader.create(path,Laya.Handler.create(this,createFun));
    }

    /**
     * 关闭界面
     * @param {*} pageName 
     */
    closeUI(pageName){

        if(!this.canOperate(pageName)){
            G_Tools.handlerFun(callBack);
            return ;
        }

        let pageBase=this.getPageByName(pageName);
        if(pageBase){
            let closeFun=function(){
                this.changePageOrder(false,pageName);
                this.changeActivePage(false,pageBase);
                pageBase.pageClose();
                if(!pageBase.isPartPage){//不是部分界面关闭
                    let endPage=this.getEndActivePage();//拿到当前开启的最顶层界面
                    
                    if(endPage){
                        endPage.pageBase.hightPageClose(pageName);
                        if(endPage.pageBase.isDealAdView){//不为广告界面
                            this.showAdView(endPage.pageBase);
                        }
                        
                    }
                }
    
                this.offectPageCount();//先校准界面数量
            }.bind(this);
    
            if(pageBase.isNeedTween){
                if(!pageBase.tweenBg){
                    this.backScaleTween(pageBase.owner,pageBase.tweenEasein,closeFun);
                }else{
                    this.backScaleTween(pageBase.tweenBg,pageBase.tweenEasein,closeFun);
                }
        
            }else{
                closeFun();
            }
    
        }else{
            G_Tools.error("关闭的界面不存在:",pageName);
        }
    }

    printActivePage(){
        for(var i=0;i<this.activePages.length;i++){
            console.log(i+"",this.activePages[i].pageBase);
        }
    }

    /**
     * 存储界面开启的顺序
     * @param {bool} isAdd 是否添加界面名字到列表
     * @param {string} pageName 
     */
    changePageOrder(isAdd,pageName){
        if(isAdd){

            let endIndex=this.openPageOrderArray.length-1;
            if(endIndex>=0){
                if(pageName==this.openPageOrderArray[endIndex]){//防止两层界面相邻
                    return;
                }
            }

            this.openPageOrderArray.push(pageName);
        }else{
            let removeIndex=this.openPageOrderArray.length-1;
            if(removeIndex<0){
                return;
            }
            this.openPageOrderArray.splice(removeIndex,1);
        }
    }

    /**
     * 
     * @param {是否能够操作界面} pageName 
     * @param {*} vals 
     */
    canOperate(pageName,vals){
        if(!G_MistakeHelp.getIsExportAdvEnabled()){

            if(pageName==G_UIName.AdFullView){
                if(vals){
                    G_Tools.handlerFun(vals.closeFun);
                }
            }

            return this.adPagesName.indexOf(pageName)<0;
        }else if(G_PlatHelper.isWXPlatform()||G_PlatHelper.isQQPlatform()||G_PlatHelper.isVIVOPlatform()||G_PlatHelper.isOPPOPlatform()||G_PlatHelper.isTTPlatform()){
            if(pageName==G_UIName.AdFullView){
                if(vals){
                    G_Tools.handlerFun(vals.closeFun);
                }
                return false;
            } 
        }

        return true;
    }

   hintAllUI(ingore){
        for(var i=0;i<this.activePages.length;i++){
            if(this.activePages[i].pageBase.pageName==ingore){
                continue;
            }else{
                this.activePages[i].pageBase.owner.visible=false;
            }
        }
   }

   showAllUI(){
    for(var i=0;i<this.activePages.length;i++){
        this.activePages[i].pageBase.owner.visible=true;
    }
   }
}