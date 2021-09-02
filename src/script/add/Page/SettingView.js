import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class SettingView extends PageBase{
    constructor(){
        super();
        this.adObj=new Object();
        this.adObj.num=2;
        this.isNeedTween=true;
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_closeBtn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_closeBtn,()=>{
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().SettingView);
            })
        });

        this.viewProp.m_soundSwitchBtn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_soundSwitchBtn,()=>{
                this.setSettingState();
            })
        })

        this.viewProp.m_muteSwitchBtn.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_muteSwitchBtn,()=>{
                this.setMuteState();
            })
        })

        this.viewProp.m_bg.on(Laya.Event.CLICK,this,()=>{
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().SettingView);
        })

        //判断是否显示
        this.viewProp.m_sound.visible=true;
        this.viewProp.m_mute.visible=G_PlatHelper.isSupportVibratePhone();
    }


    pageOpen(vals){
        super.pageOpen(vals);
        this.setSwitch(this.viewProp.m_muteSwitchBtn,G_PlayerInfo.isMuteEnable());
        this.setSwitch(this.viewProp.m_soundSwitchBtn,G_SoundMgr.isSoundEnable());
    }

    setMuteState(){
        if (G_PlayerInfo.isMuteEnable()) {
            G_PlayerInfo.setMuteEnable(false)
        }
        else {
            G_PlayerInfo.setMuteEnable(true)
        }
        this.setSwitch(this.viewProp.m_muteSwitchBtn,G_PlayerInfo.isMuteEnable());
    }


    setSettingState(){
        if (G_SoundMgr.isSoundEnable()) {
            G_SoundMgr.setSoundEnable(false)
        }
        else {
            G_SoundMgr.setSoundEnable(true)
        }

        this.setSwitch(this.viewProp.m_soundSwitchBtn,G_SoundMgr.isSoundEnable());
    }

    setSwitch(btn,open){
        if (open) {
            btn.skin = "game/popup/setting/on_btn.png"
        }
        else {
            btn.skin = "game/popup/setting/off_btn.png"
        }
    }
}