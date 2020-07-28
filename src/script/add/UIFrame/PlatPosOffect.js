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
 
           this.offect=0;

           this.maxScreenOffect=60;

           this.moveOffect=0;
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
        }

        
    }

    onAwake(){
       this.init();
       let win=this.owner.getComponent(WidgetMgr);
       if(win){
            let initBottom=0;
           initBottom=win.bottom;
           win.bottom=this.offect;
           let h=Laya.stage.height;
            if(h>1450){
                win.bottom+=this.maxScreenOffect;
            }

            this.moveOffect=win.bottom-initBottom;
       }

       

       
    }
    

    getOffect(){
        return this.moveOffect;
    }
}