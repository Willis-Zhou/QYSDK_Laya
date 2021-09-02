import GameMgr from "../Mgr/GameMgr";

import Tools from "../UIFrame/Tools";

import WindowBase from "./WindowBase";

export default class GetPowerView extends WindowBase{
    constructor(){
        super();
        this.chineseName="领取体力";
        this.powerNum=1;
        this.useGold=5000;
    }

    pageInit(){
        super.pageInit();

        this.viewProp.m_get_gold.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_get_gold);
            if(!Tools.getIns().canUseItem(this.useGold,3)){
                G_PlatHelper.showToast("钱不够了!");
                return;
            }
            GameMgr.getPlayerInfo().minusCoin(this.useGold);
            this.toGetReward();
        })

        this.viewProp.m_diam_count.text="体力+"+this.powerNum;
    }

    pageOpen(vals){
        super.pageOpen(vals);

    }

    startGetVideo(){
        super.startGetVideo();

    }

    getVideoEnd(succ){
        super.getVideoEnd(succ);

        if(succ){
           
        }else{
            
        }
    }

    toGetReward(){
        super.toGetReward();

        let obj=new Object();
        obj.rewardData=[];
        obj.rewardData.push({id:5,count:this.powerNum});
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView,obj);  
    }
  
    pageClose(){
        super.pageClose();
        let readView=GameMgr.getUIMgr().getPageByName(GameMgr.getUIName().ReadyView);
        if(readView){
            readView.refershAdTime();
        }
    }
}