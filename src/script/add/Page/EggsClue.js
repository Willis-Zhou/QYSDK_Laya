import Tools from "../UIFrame/Tools";
import WindowBase from "./WindowBase";

export default class EggsClue extends WindowBase{
    constructor(){
        super();
      
    }

    pageInit(){
        super.pageInit();
        
        this.viewProp.m_ok.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_ok);
            this.closeWindow();
        });
      
    }

    toGetReward(){
        super.toGetReward();
    }

    pageOpen(vals){
        super.pageOpen(vals);

        this.viewProp.m_tips.text=vals.eggData.tips;
       
    }
}