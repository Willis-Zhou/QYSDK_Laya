import PageBase from "../UIFrame/PageBase";
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";

export default class AdView extends PageBase {

    constructor() { 
        super(); 
        this.showAdType=0;
        this.isPartPage=true;
        this.isAutoDestroy=false;
        this.showBannerDelay=60*1000;//70秒不显示
        this.showBannerTimer=0;
        this.isDealAdView=false;
        this.leftIsInOpen=false;
        this.leftIsOpen=false;
    }
    

    pageInit(){
        super.pageInit();
        this.showBannerTimer=Laya.timer.currTimer;
        this.viewProp.m_moreGameBtn.on(Laya.Event.CLICK,this,function(){
            // if(G_PlatHelper.isQQPlatform()){
            //     G_PlatAction.cretaeBoxAd();
            // }else{
            //       let obj=new Object();
            //     obj.viewType=2;
            //     G_MainGui.openUI(G_UIName.PopupView,obj,null);
            // }
          this.openLeft(!this.leftIsOpen);

        });

        this.viewProp.m_setting.on(Laya.Event.CLICK,this,function(){
            this.onSettingTouched(this.viewProp.m_setting);
        });

        this.viewProp.m_sgin.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_sgin_btn_icon);
             G_MainGui.openUI(G_UIName.SginView,null,null);
        });

        this.viewProp.m_task.on(Laya.Event.CLICK,this,function(){
             G_Tools.showToast("UIWORD_ID_NOT_FINISHED_YET");
        });

        this.viewProp.m_mask.on(Laya.Event.CLICK,this,function(){
            this.openLeft(!this.leftIsOpen);
        })

        //动画
        let moreGameBtn=this.viewProp.m_moreGameBtn;
        let doScale = function ( delay = 2000 ) {
            if(!moreGameBtn||moreGameBtn.destroyed){
                G_Scheduler.unschedule("Delay_Auto_Scale_moreGameBtn");
                return;
            }
            G_Scheduler.schedule("Delay_Auto_Scale_moreGameBtn", function () {
                G_UIHelper.playBtnTouchAction(moreGameBtn, doScale, 1, 1.1, 8)
            }, false, delay, 0)
        }

       // doScale();
        this.viewProp.m_mask.visible=false;
    }

    openLeft(open){

        if(this.leftIsInOpen){
            return;
        }
        this.leftIsOpen=open;
        this.leftIsInOpen=false;
        let tween=null;
        if(open){
            this.viewProp.m_moreGameBtn.left=-145;
            tween= Laya.Tween.to(this.viewProp.m_moreGameBtn,{left:0},200,Laya.Ease.circOut,null,0,true,false);

        }else
        {
            this.viewProp.m_moreGameBtn.left=0;
            tween= Laya.Tween.to(this.viewProp.m_moreGameBtn,{left:-145},200,Laya.Ease.circOut,null,0,true,false);
        }

        Laya.timer.once(200,this,function(){
            tween.clear();
            tween=null;
            this.leftIsInOpen=false;
            this.viewProp.m_mask.visible=this.leftIsOpen;
        })
    }

       /**
     * 设置
     */
    onSettingTouched( btn ) {
        let vals={
            closeCb:null,
            viewType:1
        }
        G_MainGui.openUI(G_UIName.PopupView,vals,function(pageBase){
            
        });

        G_Tools.btnAction(btn);
    }

   showMoreBtn(show){

    if(!G_MistakeHelp.getIsExportAdvEnabled()){
        this.viewProp.m_moreGameBtn.visible=false;
        return;
    }

    if(G_PlatHelper.isVIVOPlatform()||G_PlatHelper.isTTPlatform()){
        this.viewProp.m_moreGameBtn.visible=false;
    }else{
        this.viewProp.m_moreGameBtn.visible=show;
    }

   }


   setBottomType(num,endFun){//底部的显示类型

    this.showAdType=num;
    let bottomIcon=this.viewProp.m_bottomAdIcon;
    let bottomList=this.viewProp.m_bottomList;

    //摧毁之前的广告
    bottomIcon.visible=false;
    bottomList.visible=false;
    
    if(this.showAdType==1){//刷新广告
        G_Tools.hintBanner();
        bottomList.visible=true;
        let advLoadMgr = bottomList.getComponent(AdvLoadMgr)
            if (advLoadMgr) {
                advLoadMgr.refreshAdv()
            }
        G_Tools.handlerFun(endFun);
    }else if(this.showAdType==2){//创建banner

        if(G_PlatHelper.isOPPOPlatform()){//oppo开局1分钟不显示banner
            if(Laya.timer.currTimer-this.showBannerTimer<this.showBannerDelay){
                G_Tools.handlerFun(endFun);
                return;
            }
        
        }else if(G_PlatHelper.isQQPlatform()||G_PlatHelper.isWXPlatform()){
            G_Tools.hintBanner();
        }

        

        G_Tools.createBanner(function(){//创建失败判断显示banner
            if(this.showAdType==2){
                let advLoadMgr = bottomIcon.getComponent(AdvLoadMgr);//先刷新广告
                if (advLoadMgr) {
                    advLoadMgr.refreshAdv()
                }

                bottomIcon.visible=true;
            }else{
                bottomIcon.visible=false;
            }
            G_Tools.handlerFun(endFun);
        }.bind(this),function(){
            let fullView=G_MainGui.getPageByName(G_UIName.AdFullView);
            if(this.showAdType==2&&(!this.fullView||!this.fullView.isOpen)){//创建成功判断显示banner
                G_Adv.showBannerAdv();
            }else{
                G_Adv.hideBannerAdv();
            }
            G_Tools.handlerFun(endFun);
        }.bind(this));
        window.sgin="发生大家可发的撒开了就发来撒";

    }else{
        G_Tools.hintBanner();
    }
}
}