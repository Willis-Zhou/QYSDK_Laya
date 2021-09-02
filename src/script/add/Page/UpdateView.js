import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";


export default class UpdateView extends PageBase{

    constructor() { 
        super(); 
       
       this.isNeedTween=true;
    //    this.adObj=new Object();
    //    this.adObj.num=3;
       this.showMore=false;
    }
    
   pageInit(){
       super.pageInit();

       this.viewProp.m_Update_btn.on(Laya.Event.CLICK,this,function(){
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().UpdateView);
        if(window.wx&&window.wx.getUpdateManager){
            let updateManager = wx.getUpdateManager();
            if(updateManager&&updateManager.applyUpdate){
                updateManager.applyUpdate();
            }else{
                G_PlatHelper.showToast("更新失败，请手动重启游戏更新!");
            }
        }else{
            G_PlatHelper.showToast("更新失败，请手动重启游戏更新!");
        }
       
        
       })
   }

   pageOpen(){
       super.pageOpen();
       this.owner.zOrder=100000;//强制调层级
   }

}