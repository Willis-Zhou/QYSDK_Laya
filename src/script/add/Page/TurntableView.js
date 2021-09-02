import PageBase from "../UIFrame/PageBase";
import List  from "../UIFrame/List";
import Tools from "../UIFrame/Tools";


import MistakeMgr from "../Mgr/MistakeMgr";
import GameMgr from "../Mgr/GameMgr";

export default class TurntableView extends PageBase {

    constructor() { 
        super(); 
        this.isStart=false;
        this.rotationRang=8*360;
        this.currotationRang=0;
        this.speedCut=0.01;//速度减值
        this.cutAngle=720;//倒数第几圈减速
        this.lerpVal=0;
        this.staticTime=3;
        this.itemData=new List();
        this.rewardData=0;
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

        this.viewProp.m_colse.on(Laya.Event.CLICK,this,function(){
            if(this.isStart){
                return;
            }
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TurntableView);
            Tools.getIns().btnAction(this.viewProp.m_colse);
        });

        this.viewProp.m_free.on(Laya.Event.CLICK,this,function(){
            if(this.isStart){
                return;
            }
           
            this.startRotation();
            Tools.getIns().btnAction(this.viewProp.m_free);
        });

        this.viewProp.m_ad.on(Laya.Event.CLICK,this,function(){
            if(this.isStart){
                return;
            }
            G_Reportor.report(G_ReportEventName.EN_TURNTABLEVIEW_AD);
            Tools.getIns().shareOrAd(this.viewProp.m_ad,function(){
                this.startRotation();
            }.bind(this),null,G_ShareScene.SS_FREE_TRY);
            Tools.getIns().btnAction(this.viewProp.m_ad);
        });

        this.viewProp.m_mis_click.on(Laya.Event.CLICK,this,function(){
            if(this.isStart){
                return;
            }
            G_Reportor.report(G_ReportEventName.EN_TURNTABLEVIEW_AD);
            Tools.getIns().shareOrAd(this.viewProp.m_mis_click,function(){
                this.startRotation();
            }.bind(this),null,G_ShareScene.SS_FREE_TRY);
            Tools.getIns().btnAction(this.viewProp.m_mis_click);
        })
    }

    //初始化item数据
    initItemData(){

        this.itemData.clear();

        let speed=G_PlayerInfo.getAllEffect();

        //上
        this.itemData.add(this.createItemData(1,0,3,speed.times(24*60),10,24));//海量金币

        //左上
        this.itemData.add(this.createItemData(2,60,-2,300,20,150));

        //右上
        this.itemData.add(this.createItemData(3,300,1,20,10,0));

        //下
        this.itemData.add(this.createItemData(4,180,3,speed.times(4*60),20,4));

        //左下
        let skinId=G_PlayerInfo.getSelectGunId(); //GameMgr.getIns().getNextSkinId();
        let rate=0;
        if(!skinId){
            skinId=G_PlayerInfo.getSkinId();
            rate=0;
        }else{
            rate=5;
        }

        let skinData=G_GameDB.getSkinConfigByID(skinId);
        //this.viewProp.m_player_skin.skin=G_ResPath.skinPath.format(skinData.icon);
        if(rate!=0){
            this.itemData.add(this.createItemData(5,120,4,1,50,skinId));
        }

        //右下
        skinId=G_PlayerInfo.getSelectGunId();//GameMgr.getIns().getNextStaffSkinId();
        if(!skinId){
            skinId=G_PlayerInfo.getSkinId();
            rate=0;
        }else{
            rate=5;
        }

        skinData=G_GameDB.getSkinConfigByID(skinId);
        //this.viewProp.m_staff_skin.skin=G_ResPath.skinPath.format(skinData.icon);
        if(rate!=0){
            this.itemData.add(this.createItemData(6,240,4,1,20,skinId));
        }
    }

    /**
     * 
     * @param {*} id 唯一id
     * @param {*} angle 角度
     * @param {*} rewardType 奖励类型 
     * @param {*} count 数量
     * @param {*} rate 概率
     * @param {*} param 额外参数
     */
    createItemData(id,angle,rewardType,count,rate,param){
        let obj=new Object();
        obj.id=id;
        obj.angle=angle;
        obj.rewardType=rewardType;
        obj.count=count;
        obj.rate=rate;
        obj.param=param;
        return obj;
    }

    pageOpen(){
        super.pageOpen();
        this.initItemData();
        this.resetTurntable();
        this.isStart=false;
        this.refershBtn();
        Tools.getIns().setAdBtnIcon(this.viewProp.m_ad);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_mis_click);
    }



   

    onUpdate(){
        if(this.isStart){

            if(this.viewProp.m_turntable.rotation>this.currotationRang-this.cutAngle){

                let temp=this.currotationRang-this.viewProp.m_turntable.rotation;
                let val=temp/this.cutAngle;

                if(val<0.2){
                    val=0.2;
                }

                this.lerpVal+=this.speedCut*val;
            }else{
                this.lerpVal+=this.speedCut;
            }

            if(this.lerpVal>=1){
                this.lerpVal=1;
            }


            if(this.lerpVal==1){
                this.viewProp.m_turntable.rotation=this.currotationRang;
                this.isStart=false;
                this.getReward();
            }else{
                this.viewProp.m_turntable.rotation= Tools.getIns().lerp(0,this.currotationRang,this.lerpVal);
            }

            

        }
      
    }

    refershBtn(){
        let sup= G_PlayerInfo.getSupTurntableTimes();
        this.viewProp.m_ad.visible=false;
        this.viewProp.m_free.visible=false;
        this.viewProp.m_mis_click.visible=false;
        if(sup==5){
            this.viewProp.m_free.visible=true;
        }else if(sup>0){
            this.viewProp.m_ad.visible=true;
            this.viewProp.m_mis_click.visible=MistakeMgr.getIns().getForeceSelect();
        }

        this.reefershTips();
    }

    getReward(){
        this.refershBtn();
        if(this.rewardData.rewardType==4){//转到类型四 直接上枪
            if(this.rewardData.id==6){//为6上两把
                G_PlayerInfo.setGunInPos(this.rewardData.param);
                G_PlayerInfo.setGunInPos(this.rewardData.param);
            }else{
                G_PlayerInfo.setGunInPos(this.rewardData.param);
            }
            
        }else if(this.rewardData.rewardType==-2)//加速
        {
            G_PlayerInfo.setSpeedToTime(this.rewardData.param*1000);
        }
        else{
            G_PlayerInfo.addItemByType(this.rewardData.rewardType,this.rewardData.count,this.rewardData.param);
        }
       
        G_WXHelper.showToast("恭喜获得奖励");
    }

    resetTurntable(){
        this.viewProp.m_turntable.rotation=0;
        this.speedCut=1/(this.staticTime*60);
        this.lerpVal=0;
    }

    startRotation(){
        this.resetTurntable();
        this.isStart=true;
        this.rewardData=this.getRandBoxData();
        this.currotationRang=this.rotationRang+this.rewardData.angle;
        G_PlayerInfo.addTurntableTimes(1);
    }


    getRandBoxData(){
        let tempBoxRateData=new List();
        for(var i=0;i<this.itemData.getCount();i++){
            tempBoxRateData.add(this.itemData.getValue(i));
        }

        tempBoxRateData.sort(function(v1,v2){
            if(v1.rate<v2.rate){
                return -1;
            }else if(v1.rate>v2.rate){
                return 1;
            }
    
            return 0;
        });
        let rateSummary=0;

        for(var i=0;i<tempBoxRateData.getCount();i++){
            rateSummary+=tempBoxRateData.getValue(i).rate;
        }

        let seed=Math.floor(Math.random()*rateSummary);//获得rateSummary以内的随机数
        let count=tempBoxRateData.getCount();
        for(var i=0;i<count;i++){
            seed-=tempBoxRateData.getValue(i).rate;
            if(seed<=0){
                return tempBoxRateData.getValue(i);
            }
        }

        return tempBoxRateData.getValue(tempBoxRateData.getCount()-1);
    }
    

    reefershTips(){
        let sup=G_PlayerInfo.getSupTurntableTimes();
        this.viewProp.m_tips.text="剩余次数:"+sup;
    }
}