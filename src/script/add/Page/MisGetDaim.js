import GameMgr from "../Mgr/GameMgr";

import MistakePageBase from "../UIFrame/MistakePageBase";
import Tools from "../UIFrame/Tools";

export default class MisGetDaim extends MistakePageBase{

    constructor() { 
        super(); 
       
       this.adObj=new Object();
       this.adObj.num=2;

       this.pageVals=null;
    }
    

    pageInit(){
        super.pageInit();

       this.setMisBar(this.viewProp.m_mistake_bar);
        this.viewProp.m_click.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_click);
            this.onClickBtn();
        });

        this.viewProp.m_close.on(Laya.Event.CLICK,this,function(){
            this.boxCloseCallBack();
        })

    }


    mistakeOpenFun(vals){
        vals.rewardData=[];
        vals.rewardData.push({id:3,count:100});
        this.pageVals=vals;
        
    }

    mistakeEndFun(vals){
        this.viewProp.m_close.visible=true;
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.viewProp.m_close.visible=false;
    }


   showAd(){
       this.showBox();
   }
    

   boxCloseCallBack(){
    GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView,this.pageVals);
       
   }

}