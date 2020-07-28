import PageBase from "../UIFrame/PageBase";
import DailyGiftItem from "../item/DailyGiftItem";

export default class GailyGift extends PageBase{

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.adObj.num=2;
        this.isNeedTween=true;
    }
    
    pageInit(){
        super.pageInit();
        this.viewProp.m_closeBtn.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_closeBtn);
            G_MainGui.closeUI(G_UIName.DailyGift);
        });


        this.viewProp.m_list.renderHandler=new Laya.Handler(this, this.renderHandler);
        this.viewProp.m_list.vScrollBarSkin="";

        this.initData();
    }

    initData(){
        let vals=G_GameDB.getAllDailyRewards();

        let data=[];
        for(let i=0;i<vals.length;i++){
            data.push(vals[i]);
        }

        this.viewProp.m_list.array=data;
    }


    initCell(cell,index){
        let mgr=cell.getComponent(DailyGiftItem);
        if(!mgr){
            mgr=cell.addComponent(DailyGiftItem);
            mgr.init();
            mgr.setBuyFun(function(mgr){
                this.buyFun(mgr);
            }.bind(this))
        }

        return mgr;
    }

    renderHandler(cell,index){
        let giftData=this.viewProp.m_list.getItem(index);
       let mgr= this.initCell(cell,index);
       mgr.setData(giftData);
    }

    buyFun(mgr){
        let getFun=function(){
            if(mgr.giftData.type==4||mgr.giftData.type==6){//枪
                let count=parseInt(mgr.giftData.para1);
                for(let i=0;i<count;i++){
                    G_PlayerInfo.setGunInPos(mgr.getVal);
                }
            }else{
                G_PlayerInfo.addItemByType(mgr.giftData.type,mgr.getVal,0);
            }
            G_PlatHelper.showToast("恭喜获得奖励");
            G_PlayerInfo.saveCurDailyRewardId(mgr.giftData.id);
            this.refershView();
        }.bind(this);

        G_Tools.shareOrAd(mgr.viewProp.m_ad_buy,function(){
            getFun();
        }.bind(this),null,G_ShareScene.SS_FREE_TRY);

       
    }

    pageOpen(vals){
        super.pageOpen(vals);
        let rewardId=G_PlayerInfo.getCurDailyRewardId();
        this.viewProp.m_list.tweenTo(rewardId,500);
    }

    refershView(){
        this.viewProp.m_list.refresh();
    }
}