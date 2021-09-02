import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";



export default class UnLockItemView extends PageBase {

    constructor() { 
        super(); 
        this.itemId=0;
        this.closeCallBack=null;
        this.adObj=new Object();
        this.adObj.num=2;
        this.isNeedTween=true;
        this.moveEnd=true;
    }
    
    pageInit(){
        super.pageInit();
        this.viewProp.m_close.on(Laya.Event.CLICK,this,function(){
            if(!this.moveEnd){
                return;
            }
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().UnLockItemView)
        })
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.itemId=vals.itemId;
        this.closeCallBack=vals.closeCallBack;
        this.showItem();
        this.btnToMove();
      
    }

    btnToMove(){
        this.moveEnd=false;
        Tools.getIns().bottomDoMove(this.viewProp.m_close,Laya.stage.height-100,Laya.stage.height/2+230,function(move){
           
            this.moveEnd=true;
        }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
    }

    showItem(){
        let prefabDats=G_GameDB.getPrefabsConfigByID(this.itemId);

        if(prefabDats){
            this.viewProp.m_item.skin="game/obs/{0}.png".format(prefabDats.name);
        }
    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeCallBack);
        this.closeCallBack=null;
    }
}