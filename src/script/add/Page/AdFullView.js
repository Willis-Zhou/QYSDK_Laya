
import GameMgr from "../Mgr/GameMgr";
import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


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
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().AdFullView);
        })
    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }
}