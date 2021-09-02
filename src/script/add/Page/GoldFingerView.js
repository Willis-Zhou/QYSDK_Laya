import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

/**
 * 金手指
 */
export default class GoldFingerView extends PageBase{
    constructor(){
        super();
        this.getType=-1;
    }
    

    pageInit(){
        super.pageInit();
        this.viewProp.m_input_view.visible=false;
        this.viewProp.m_comfrim_view.visible=false;
        this.viewProp.m_tab.selectHandler = new Laya.Handler(this, this.onSelect);

        this.viewProp.m_input_ok_btn.on(Laya.Event.CLICK,this,()=>{
             Tools.getIns().btnAction(this.viewProp.m_input_ok_btn);
             this.inputOk();
        });

        this.viewProp.m_close.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_close);
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GoldFingerView);
        });

        this.viewProp.m_comfrim_view.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_comfrim_view);
            GameMgr.getPlayerInfo().resetSginDay();
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GoldFingerView);
        });
        
    }



    onSelect(index) {
        this.getType=index;
        this.viewProp.m_input_view.visible=false;
        this.viewProp.m_comfrim_view.visible=false;
        if(index==0||index==1){
            this.viewProp.m_input_view.visible=true;
        }else if(index==2){
            this.viewProp.m_comfrim_view.visible=true;
        }
    }
    
    inputOk(){
        let num=parseInt(this.viewProp.m_input.text);
        if(this.getType==0){
            GameMgr.getPlayerInfo().addItemByType(3,num);
        }else if(this.getType==1){
            GameMgr.getPlayerInfo().addItemByType(5,num);
        }
    }
}