import PageBase from "../UIFrame/PageBase";

export default class AdFullView extends PageBase {

    constructor() { 
        super(); 
        this.closeFun=null;
        this.isAutoDestroy=false;
    }
   
    pageInit(){
        super.pageInit();
    }

    pageOpen(vals){
        super.pageOpen(vals);
        if(vals){
            this.closeFun=vals.closeFun;
        }else{
            this.closeFun=null;
        }
        
        G_UIManager.showUI("fullSceneAd", () => {
            G_MainGui.closeUI(G_UIName.AdFullView);
        })
    }

    pageClose(){
        super.pageClose();
        G_Tools.handlerFun(this.closeFun);
        this.closeFun=null;
    }
}