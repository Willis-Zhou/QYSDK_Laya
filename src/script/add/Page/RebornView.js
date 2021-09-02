
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class RebornView extends PageBase{
    constructor(){
        super();
        this.callBack=null;
        this.downTime=5;
        this.curDownTime=0;
        this.isPause=false;
        this.succ=false;
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
        this.viewProp.m_reborn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_reborn,()=>{
                this.toReborn();
            })
            
        });

        
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.beginTime();
        Tools.getIns().setAdBtnIcon(this.viewProp.m_reborn);
        this.callBack=vals.callBack;
    }

    toReborn(){

        if(this.isPause){
            return;
        }

        this.stopTime();
        Tools.getIns().shareOrAd(this.viewProp.m_reborn,()=>{
            this.succ=true;
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().RebornView);
            
        },()=>{
            this.succ=false;
            this.continueTime();
        })
    }

    beginTime(){
        this.continueTime();
        this.succ=false;
        this.curDownTime=0;
        this.viewProp.m_time.text=this.downTime;
        Tools.getIns().setImgPercent(this.viewProp.m_rang,0);
        Laya.timer.loop(1000,this,this.timeDownFun);
    }

    closeTime(){
        Laya.timer.clear(this,this.timeDownFun);
    }

    timeDownFun(){
        if(this.isPause){
            return ;
        }

        this.curDownTime+=1;
        this.viewProp.m_time.text=this.downTime-this.curDownTime;
        G_SoundMgr.playSound(GG_SoundName.SN_Mp3.format("timeDown"));
        Tools.getIns().setImgPercent(this.viewProp.m_rang,this.curDownTime/this.downTime);

        if(this.downTime-this.curDownTime<=0){
            this.closeTime();
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().RebornView);
        }
    }

    stopTime(){
        this.isPause=true;
    }

    continueTime(){
        this.isPause=false;
    }

    pageClose(){
        super.pageClose();
        this.closeTime();
        Tools.getIns().handlerFun(this.callBack,this.succ);
        this.callBack=null;
    }
}