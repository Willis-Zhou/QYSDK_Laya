import Tools from "../UIFrame/Tools";

export default class RedBagMgr  {

    constructor() { 
        this.resetTimer=5*60;//五分钟一次
        this.loginMaxDay=0;
     
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new RedBagMgr();
        }

        return this.instance;
    }

    setLoginDay(day){
        this.loginMaxDay=day;
    }
    
   /**
     * 是否有红包
     */
    hasRedBag(){

        return false;

        if(!G_MistakeMgr.isMoveMistakeEnabledAsync()){
			
			return false;
        }


        if(G_PlayerInfo.getLoginDays()>this.loginMaxDay){//大于88不显示
            return false;
        }

        if(G_PlayerInfo.getCurGetRedTimers()>=3){
            return false;
        }

        return true;
    }

    showRedRewardBar(){

        return false;

        if(!G_MistakeMgr.isMoveMistakeEnabledAsync()){
			
			return false;
        }

        if(G_PlayerInfo.getLoginDays()>this.loginMaxDay){//活动结束
            return false;
        }
        
        return true;
    }

    /**
     * 红包是否冷却
     */
    hasCoolDown(){
        let supTime=G_ServerInfo.getServerTime()/1000-G_PlayerInfo.getLastGetRedTimers();
        
        if(supTime>=this.resetTimer){
            return true;
        }

        return false;
    }
    
    /**
     * 拿到剩余时间
     */
    getSupTime(){
        let supTime=G_PlayerInfo.getLastGetRedTimers()+this.resetTimer-G_ServerInfo.getServerTime()/1000;
        if(supTime<=0){
            return "00:00";
        }
        return G_Utils.convertSecondToHourMinuteSecond(Math.floor(supTime), true)
    }

    getCoolDownTip(){
        switch(G_PlayerInfo.getCurGetRedTimers()){
            case 0:
            return "免费获得";
            case 1:
            return"分享获得";
            case 2:
            return "视屏获得";
            default:
            return "";
        }
    }

    toGetRedBag(callback){
        if(G_PlayerInfo.getCurGetRedTimers()==0){
            Tools.getIns().handlerFun(callback);
            return;
        }else if(G_PlayerInfo.getCurGetRedTimers()==1){
            Tools.getIns().onShareTouched(null,function(){
                Tools.getIns().handlerFun(callback);
            },G_ShareScene.SS_FREE_TRY);
            return;
        }else if(G_PlayerInfo.getCurGetRedTimers()==2){
            Tools.getIns().shareOrAd(null,function(){
                Tools.getIns().handlerFun(callback);
            });
        }else{
            G_WXHelper.showToast("红包不能领取");
        }
    }

    /**
     * 拿到这一次的红包金额
     */
    getRedBagReward(){
        let day=G_PlayerInfo.getLoginDays();
        let redBagData=G_GameDB.getRedBagByID(day);
        console.log("登陆天数:",day);
        if(redBagData){
            let temp=redBagData.rang.split('-');
            let min=parseFloat(temp[0]);
            let max=parseFloat(temp[1]);

            return min+(max-min)*Math.random();
        }

        return 0.01;
    }
}