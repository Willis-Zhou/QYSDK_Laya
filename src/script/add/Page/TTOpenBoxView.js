import PageBase from "../UIFrame/PageBase";
import BoxItem from "../item/BoxItem";
import Tools from "../UIFrame/Tools";


import MistakeMgr from "../Mgr/MistakeMgr";
import GameMgr from "../Mgr/GameMgr";
export default class TTOpenBoxView extends PageBase {

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.adObj.num=2;

        this.viewAd=true;
        this.clickTimes=3;
        this.curClickTimes=0;

        this.useAd=false;
        this.isNeedTween=true;

        this.boxItems=[];

        this.rewards=[//type 1金币 3 钻石    
            {
                id:1,
                type:1,
                count:20,//数量
                rate:30,
                showT:"获得20钻石",
            },
            {
                id:2,
                type:3,
                count:4,//收益小时
                rate:30,
                showT:"获得4小时收益",            
            },
            {
                id:3,
                type:1,
                count:40,//数量
                rate:5,
                showT:"获得40钻石",
            },
            {
                id:4,
                type:3,
                count:24,//收益小时
                rate:5,
                showT:"获得24小时收益",            
            },
            {
                id:4,
                type:7,
                count:150,//加速秒数
                rate:5,
                showT:"获得加速时间150s",            
            }
        ]
    }
    
   pageInit(){
       super.pageInit();
    
       this.viewProp.m_cancel.on(Laya.Event.CLICK,this,function(){
           Tools.getIns().btnAction(this.viewProp.m_cancel);
            this.clickBtn(false,this.viewProp.m_cancel);
       });

       this.viewProp.m_ad_btn.on(Laya.Event.CLICK,this,function(){
        Tools.getIns().btnAction(this.viewProp.m_ad_btn);
         this.clickBtn(true,this.viewProp.m_ad_btn);
        });

       this.viewProp.m_viewAd.on(Laya.Event.CLICK,this,function(){
            this.viewAd=!this.viewAd;
            this.setViewAdBtn(this.viewAd);
       });

       this.viewProp.m_back.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_back);
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TTOpenBoxView);
       });


       this.viewProp.m_box_list.renderHandler=new Laya.Handler(this, this.renderHandler);

       this.initList();
   }

   initList(){
        for(let i=0;i<9;i++){
            this.boxItems.push({id:i,isOpen:false,type:0,valT:"",isAdBox:false});
        }

        this.viewProp.m_box_list.array=this.boxItems;
   }

   reSetList(){
        for(let i=0;i<this.boxItems.length;i++){
            this.boxItems[i].isOpen=false;
            this.boxItems[i].type=0;
            this.boxItems[i].isAdBox=false;
        }

        if(MistakeMgr.getIns().getForeceSelect()){//随机几个视屏
            let adArray=Tools.getIns().getRandomArrayElements(this.boxItems,3);
            for(let i=0;i<adArray.length;i++){
                adArray[i].isAdBox=true;
            }
        }
   }

   renderHandler(cell,index){
        this.setData(cell,index);
   }

   setData(cell,index){
       let mgr=cell.getComponent(BoxItem);
       if(!mgr){
           mgr=cell.addComponent(BoxItem);
           mgr.init();
           mgr.setClickFun(function(mgr){
                this.itemClick(mgr);
           }.bind(this))
       }

       mgr.setData(this.viewProp.m_box_list.getItem(index));
   }

   pageOpen(vals){
       super.pageOpen(vals);
       this.curClickTimes=0;
       this.useAd=false;
       this.viewProp.m_back.visible=false;
       this.viewProp.m_viewAd.visible=false;
       this.viewProp.m_ad_btn.visible=false;
       this.viewProp.m_cancel.visible=false;
       this.viewAd=MistakeMgr.getIns().getForeceSelect();
       this.checkBtn();
      
       this.setViewAdBtn(this.viewAd);
       this.reSetList();
       this.viewProp.m_box_list.refresh();
   }
   
   setViewAdBtn(viewAd){
        this.viewProp.m_view_ad_check.visible=viewAd;
        this.checkBtn();
    }

   clickBtn(viewAd,btn){
        if(viewAd){
            Tools.getIns().shareOrAd(btn,function(){
                this.useAd=true;
                this.curClickTimes=0;
                this.checkBtn();
            }.bind(this));
        }else{
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TTOpenBoxView);
        }
   }

   checkBtn(){
        if(this.useAd){
            this.viewProp.m_ad_btn.visible=false;
            this.viewProp.m_cancel.visible=false;
            this.viewProp.m_viewAd.visible=false;
            if(this.curClickTimes>=this.clickTimes){
               this.viewProp.m_back.visible=true;
            }else{
              
            }
        }else{
            if(this.curClickTimes>=this.clickTimes){
                this.viewProp.m_ad_btn.visible=this.viewAd;
                this.viewProp.m_cancel.visible=!this.viewAd;
                this.viewProp.m_viewAd.visible=true;
            }else{
                this.viewProp.m_ad_btn.visible=false;
                this.viewProp.m_cancel.visible=false;
                this.viewProp.m_viewAd.visible=false;
            }
        }

        let isAllOpen=true;

        for(let i=0;i<this.boxItems.length;i++){
            if(!this.boxItems[i].isOpen){
                isAllOpen=false;
                break;
            }
           
        }

        if(isAllOpen){//全部开启
            this.viewProp.m_back.visible=true;
        }
   }

   canOpen(){
       return this.curClickTimes<this.clickTimes;
   }

   itemClick(mgr){

        if(!this.canOpen()){
            G_PlatHelper.showToast("次数已经用完");
            return;
        }

        let index=mgr.boxData.id;
        let itenData=this.boxItems[index];
        itenData.isOpen=true;

        let randomIndex=Tools.getIns().getRandArrayIndex(this.rewards);
        let rewardItem=this.rewards[randomIndex];
        itenData.type=rewardItem.type;
        itenData.valT=rewardItem.showT;
        this.getReward(rewardItem);
        this.refreshItem(index);
        if(!mgr.boxData.isAdBox){
            this.curClickTimes++;
        }
        
        this.checkBtn();
   }

   refreshItem(index){
        this.viewProp.m_box_list.changeItem(index,this.viewProp.m_box_list.getItem(index));
   }

   getReward(rewardData){
        switch(rewardData.type){
            case 1:
                GameMgr.getPlayerInfo().addItemByType(1,rewardData.count,0);
                G_PlatHelper.showToast("获得{0}钻石".format(rewardData.count));
                break;
            case 3:
                let speed=G_PlayerInfo.getAllEffect();
                let val=speed.times(rewardData.count*60*60);
                GameMgr.getPlayerInfo().addItemByType(3,val,0);
                G_PlatHelper.showToast("获得{0}金币".format(G_Utils.bigNumber2StrNumber(val)));
                break;
            case 7:
                G_PlayerInfo.setSpeedToTime(rewardData.count*1000);
                break;
        }
   }
}