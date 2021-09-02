import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class TTGetItemView extends PageBase {

    constructor() { 
        super(); 
        this.getGold=100;
        this.adObj=new Object();
        this.adObj.num=2;
        this.canClick=true;
        this.closeFun=null;
        this.isNeedTween=true;
        this.type=1;
    }
    
   pageInit(){
       super.pageInit();

       if(G_PlatHelper.isOPPOPlatform()){
           this.adObj.num=3;
       }

       this.viewProp.m_n_get.on(Laya.Event.CLICK,this,function(){
        Tools.getIns().btnAction(this.viewProp.m_n_get);
           if(!this.canClick){
               return;
           }
           this.toGetGold(false);
       });


       this.viewProp.m_d_get.on(Laya.Event.CLICK,this,function(){
        Tools.getIns().btnAction(this.viewProp.m_d_get);
        Tools.getIns().shareOrAd(this.viewProp.m_d_get,function(){
            this.toGetGold(true);
        }.bind(this),function(){

        }.bind(this),G_ShareScene.SS_FREE_TRY);
       });

   }

   toGetGold(d){
    let gold=this.getGold;
    if(d){
        
         gold*=2;
         
    }
        G_PlayerInfo.plusCoin(gold);
        G_WXHelper.showToast("获得金币X"+gold);
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TTGetItemView);
    }

    pageOpen(vals){
        super.pageOpen(vals);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_d_get);
        if(vals){
            this.closeFun=vals.closeFun;
        }else{
            this.closeFun=null;
        }
        this.type=vals.type;
        this.getGold=vals.count;

        this.canClick=false;
        this.viewProp.m_count.text="X"+this.getGold;

        let start=this.viewProp.m_n_get.parent.height/2+Laya.stage.height/2-100;
        Tools.getIns().bottomDoMove(this.viewProp.m_n_get,start,990,function(move){
            if(!move){
                Tools.getIns().playBtnShow(this.viewProp.m_n_get,null,G_BtnDoShowTime);
            }
            this.canClick=true;
        }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);


    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;

    }
}