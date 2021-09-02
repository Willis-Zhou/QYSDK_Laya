import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import MainUIMgr from "../UIFrame/MainUIMgr";

import PageBase from "../UIFrame/PageBase";


export default class ToolsView extends PageBase{
    constructor(){
        super();

        this.isEnter=false;
        
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_lv_ok.on(Laya.Event.CLICK,this,()=>{
            this.toGame();
        });

        this.viewProp.m_close.on(Laya.Event.CLICK,this,()=>{
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ToolsView);
        });

        this.viewProp.m_CompileShader.on(Laya.Event.CLICK,this,()=>{
            MistakeMgr.getIns().debugModeShader();
        });

        this.viewProp.m_viewOpen.on(Laya.Event.CLICK,this,()=>{
            MistakeMgr.getIns().openBoxView();
        })

    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.isEnter=false;
    }

    toGame(){
        if(this.isEnter){
            return;
        }
        this.isEnter=true;
        MapMgr.getIns().cleanScenes();
        GameMgr.getIns().toGame(parseInt(this.viewProp.m_lv_input.text),1);
    }
}