import WidgetMgr from "../../game/ctrl/WidgetMgr"
export default class IponeXTopOffect extends Laya.Script {

    constructor() { 
        super(); 
       /** @prop {name:offectCount, tips:"", type:Number, default:50}*/
       this.offectCount=50;

    }
    
    onAwake(){

        let h=Laya.stage.height;
        if(h>1450){
            let win=this.owner.getComponent(WidgetMgr);
            if(win){
                this.owner.top=NaN;
                win.top+=this.offectCount;
            }else{
                this.owner.top+=this.offectCount;
            }
           
        }
    }
   
    getOffect(){
        return this.offectCount;
    }
}