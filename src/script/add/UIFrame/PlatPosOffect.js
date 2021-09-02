import WidgetMgr from "../../game/ctrl/WidgetMgr"
export default class PlatPosOffect extends Laya.Script {

    constructor() { 
        super(); 
         /** @prop {name:wxBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
         this.wxBottomOffect=0;
          /** @prop {name:oppoBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
          this.oppoBottomOffect=0;
           /** @prop {name:vivoBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
           this.vivoBottomOffect=0;
         /** @prop {name:qqBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
         this.qqBottomOffect=0;
          /** @prop {name:ttBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
          this.ttBottomOffect=0;
           /** @prop {name:winBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
           this.winBottomOffect=0;
             /** @prop {name:hwBottomOffect, tips:"底部的校准位置", type:Number, default:0}*/
             this.hwBottomOffect=0;
           this.offect=0;
    }
   

    init(){
        
        if(G_PlatHelper.isWXPlatform()){
            this.offect=this.wxBottomOffect;
        }else if(G_PlatHelper.isQQPlatform()){
            this.offect=this.qqBottomOffect;
        }else if(G_PlatHelper.isOPPOPlatform()){
            this.offect=this.oppoBottomOffect;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.offect=this.vivoBottomOffect;
        }else if(G_PlatHelper.isTTPlatform()){
            this.offect=this.ttBottomOffect;
        }else if(G_PlatHelper.isWINPlatform()){
            this.offect=this.winBottomOffect;
        }else if(G_PlatHelper.isHWPlatform()){
            this.offect=this.hwBottomOffect;
        }

    }

    onAwake(){
       this.init();
        
       let win=this.owner.getComponent(WidgetMgr);
       if(win){
           win.bottom=this.offect;
           //win.onLayout();
       }else{
           this.owner.bottom=this.offect;
       }
    }
    
}