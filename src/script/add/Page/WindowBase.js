import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

export default class WindowBase extends PageBase{
    constructor(){
        super();

        this.adObj=new Object();
        this.adObj.num=2;
        this.isNeedTween=true;
    }

    pageInit(){
        super.pageInit();

        if(G_PlatHelper.isOVPlatform()){
            this.adObj.num=2;
        }else{
            this.adObj.num=-1;
        }

        this.viewProp.m_closeBtn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_closeBtn);
            this.closeWindow();
        });

        this.viewProp.m_bg.on(Laya.Event.CLICK,this,()=>{
            this.clickBg();
        });

        if(this.viewProp.m_get){
            this.viewProp.m_get.on(Laya.Event.CLICK,this,()=>{
                if(!this.canViewVideo()){
                    return;
                }
                this.startGetVideo();
                Tools.getIns().shareOrAd(this.viewProp.m_get,()=>{
                    this.toGetReward();
                    this.getVideoEnd(true);
                },()=>{
                    this.getVideoEnd(false);
                });
            });
        }
    }

    canViewVideo(){
        return true;
    }

    startGetVideo(){

    }

    getVideoEnd(succ){

    }

    pageOpen(vals){
        super.pageOpen(vals);

        if(this.viewProp.m_get){
            Tools.getIns().setAdBtnIcon(this.viewProp.m_get);
        }

       
        if(this.viewProp.m_ef){
            this.viewProp.m_ef.rotation=0;
        }
        
    }


    onUpdate(){
        if(this.viewProp.m_ef){
            this.viewProp.m_ef.rotation+=1;
        }
        
    }


    toGetReward(){
        GameMgr.getUIMgr().closeUI(this.pageName);
    }

    closeWindow(){
        GameMgr.getUIMgr().closeUI(this.pageName);
    }

    clickBg(){
        this.closeWindow();
    }
}