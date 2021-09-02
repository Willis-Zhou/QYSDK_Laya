

import PlatAction from "../UIFrame/PlatAction";
import Tools from "../UIFrame/Tools";
import GameMgr from "./GameMgr";

export default class ExportAdMgr {
    constructor() {
        this.isshowFullMatrix=false;
    }

    static getIns(){
        if(!this.instance){
            this.instance=new ExportAdMgr();
            this.instance.init();
        }
        
        return this.instance ;
    }

    init() {

    }

    showFullMatrix(callBack) {
        Tools.getIns().handlerFun(callBack);

    }

    registerNavigateToMiniCall() {
       

    }

    showExitView(callBack) {

        if (G_PlatHelper.isWXPlatform()) {
            G_UIManager.showUI("newGameExitAd", callBack);
            Tools.getIns().hintBanner();
        } else {
            Tools.getIns().handlerFun(callBack);
        }

       
    }

    showAdFullView(callBack){
        if (G_PlatHelper.isWXPlatform()||G_PlatHelper.isWINPlatform()) {

            G_UIManager.showUI("fullSceneAd", () => {
                Tools.getIns().handlerFun(callBack);
            })

           
        } else {
            Tools.getIns().handlerFun(callBack);
        }
    }


    showMoreAd(callBack){

        if (G_PlatHelper.isWXPlatform()||G_PlatHelper.isWINPlatform()) {
            G_UIManager.showUI("moreGameAd", () => {
              Tools.getIns().handlerFun(callBack);
            })
        } else {
            Tools.getIns().handlerFun(callBack);
        }

       
    }


    showNewFullAd(callBack){
        if (G_PlatHelper.isWXPlatform()) {
            G_UIManager.showUI("newFullSceneAd", () => {
                Tools.getIns().handlerFun(callBack);
            })
        } else {
            Tools.getIns().handlerFun(callBack);
        }
    }


    isOnShow(key){
        let ui= G_UIManager.getUI(key)[1];
        if(ui){
            return ui.isOnShow();
        }else{
            return false;
        }
    }


    showClickBtnView(callBack){
        if(G_PlatHelper.isWXPlatform()){
            G_UIManager.showUI("clickBtnMistake",()=>{
                Tools.getIns().handlerFun(callBack);
            })
        }else{
            Tools.getIns().handlerFun(callBack);
        }
    }
}