import ExportAdMgr from "../Mgr/ExportAdMgr";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class PopupView extends PageBase {

    constructor() { 
        super(); 
        this._closeCb=null;
        this.viewType=0;//1为设置
        this.closeBtn=null;
        this.isOpenMoreGame=false;
    }

    pageInit(){
        super.pageInit();
        this.initAllPopups();
    }
    
    showSetting(){
        this.hideAllPopups();
        G_UIManager.showUI("setting", () => {
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().PopupView);
        });
    }

    showMoreGame(){
        this.hideAllPopups();
        this.isOpenMoreGame=true;

        ExportAdMgr.getIns().showMoreAd(()=>{
            this.isOpenMoreGame=false;
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().PopupView);
        })

    }

    pageOpen(vals){
        this.viewType=vals.viewType;
        this.isOpenMoreGame=false;
        // if(this.viewType==2){
        //     this.adObj=null;
        // }else{
         
        //     this.adObj=new Object();
        //     this.adObj.num=2;
        // }
        super.pageOpen(vals);
        this.closeCb=vals.closeCb;
        
        this.refershView();
        
    }

    refershView(){
        switch(this.viewType){
            case 1:
            this.showSetting();
            break;
            case 2:
            this.showMoreGame();
            break;
        }
    }
    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeCb);
        if(this.isOpenMoreGame){
            G_UIManager.hideUI("moreGameAd");
        }
       
    }

    hideAllPopups(){
    }

    initAllPopups(){
    }
}