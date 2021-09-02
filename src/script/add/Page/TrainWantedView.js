import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class TrainWantedView extends PageBase{
    constructor(){
        super();
        this.callBack=null;
        this.licenseId=1;
        this.isNeedTween=true;
    }

    pageInit(){
        super.pageInit();

        this.viewProp.m_start_btn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_start_btn, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TrainWantedView);
            })
        })
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.callBack=vals.callBack;
        this.licenseId=vals.licenseId;
        let licenseData=G_GameDB.getDriverLicenseByID(this.licenseId);
        this.viewProp.m_decs.text=licenseData.decs;
        this.viewProp.m_icon.skin=G_ResPath.trainIcon.format(this.licenseId);
        this.viewProp.m_train_name.skin=G_ResPath.trainTitle.format(this.licenseId);
    }


    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.callBack);
        this.callBack=null;
    }

}