import WidgetMgr from "../../game/ctrl/WidgetMgr"
export default class IponeXTopOffect extends Laya.Script {

    constructor() { 
        super(); 
       /** @prop {name:offectCount, tips:"", type:Number, default:50}*/
       this.offectCount=50;

    }
    
    onAwake(){
        if(G_PlatHelper.isIPhoneX()){

            let win=this.owner.getComponent(WidgetMgr);
            if(win){
                win.bottom+=this.offectCount;
            }else{
                this.owner.top+=this.offectCount;
            }
            
           
        }
    }
   
    getOffect(){
        return this.offectCount;
    }
}