import ExportAdMgr from "../Mgr/ExportAdMgr";
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import TTSumbitData from "../Mgr/TTSumbitData";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class SensibilitySettingView extends PageBase {
    constructor() {
        super();
        this.closeFun = null;
        this.adObj = Object();
        this.adObj.num = 2;
        this.isExit = false;
    }

    pageInit() {
        super.pageInit();
        this.viewProp.m_resume.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_resume, () => {
                if (this.isExit) {
                    return;
                }
                this.isExit = true;
                GameMgr.getIns().gameResume();
                GameMgr.getUIMgr().closeUI(this.pageName);
            })
        });

        this.viewProp.m_restart.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_restart, () => {
                if (this.isExit) {
                    return;
                }
                this.isExit = true;
                GameMgr.getIns().outGame();
                GameMgr.getIns().rePlay();
            })
        });

        this.viewProp.m_menu.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_menu, () => {
                if (this.isExit) {
                    return;
                }

                if(GameMgr.getIns().levelType==1){
                    GameMgr.getPlayerInfo().setLevelPlayTime(4,GameMgr.getPlayerInfo().getShowLevelCount())
                }

                this.isExit = true;
                GameMgr.getIns().outGame();
                MapMgr.getIns().cleanScenes();
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().SensibilitySettingView);
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().ReadyView);
            })
        });

        this.viewProp.m_more_game.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_more_game, () => {
                ExportAdMgr.getIns().showFullMatrix();
            })
        });
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.isExit = false;
     
    }



}