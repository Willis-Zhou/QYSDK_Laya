import MistakePageBase from "../UIFrame/MistakePageBase";
import Tools from "../UIFrame/Tools";
export default class FightBoxView extends MistakePageBase{

    constructor() { 
        super(); 
    }
    

    pageInit(){
        super.pageInit();
        this.setMisBar(this.viewProp.m_mistake_bar);
        this.viewProp.m_mis_btn.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_mis_btn);
            this.onClickBtn();
        });
    }

    pageOpen(vals){
        super.pageOpen(vals);
      
    }


   
    mistakeEndFun(vals){
        vals.closeFun();
    }

    showAd(){
        this.showBanner();
    }
    
}