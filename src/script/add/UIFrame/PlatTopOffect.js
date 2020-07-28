import WidgetMgr from "../../game/ctrl/WidgetMgr";

export default class PlatTopOffect extends Laya.Script {

    constructor() { 
        super(); 
         /** @prop {name:wxOffect, tips:"顶部的校准位置", type:Number, default:0}*/
         this.wxOffect=0;
          /** @prop {name:oppoOffect, tips:"顶部的校准位置", type:Number, default:0}*/
          this.oppoOffect=0;
           /** @prop {name:vivoOffect, tips:"顶部的校准位置", type:Number, default:0}*/
           this.vivoOffect=0;
         /** @prop {name:qqOffect, tips:"顶部的校准位置", type:Number, default:0}*/
         this.qqOffect=0;
          /** @prop {name:ttOffect, tips:"顶部的校准位置", type:Number, default:0}*/
          this.ttOffect=0;
           /** @prop {name:winOffect, tips:"顶部的校准位置", type:Number, default:0}*/
           this.winOffect=0;
 
           this.offect=0;
    }
   

    init(){
        
        if(G_PlatHelper.isWXPlatform()){
            this.offect=this.wxOffect;
        }else if(G_PlatHelper.isQQPlatform()){
            this.offect=this.qqOffect;
        }else if(G_PlatHelper.isOPPOPlatform()){
            this.offect=this.oppoOffect;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.offect=this.vivoOffect;
        }else if(G_PlatHelper.isTTPlatform()){
            this.offect=this.ttOffect;
        }else if(G_PlatHelper.isWINPlatform()){
            this.offect=this.winOffect;
        }

    }

    onAwake(){
       this.init();
        
       let win=this.owner.getComponent(WidgetMgr);
       if(win){
           win.top=this.offect;
           //win.onLayout();
       }else{
           this.owner.top=this.offect;
       }
    }
}