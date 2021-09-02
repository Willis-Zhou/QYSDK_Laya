import MistakeMgr from "../Mgr/MistakeMgr";

export default class VivoAdHint extends Laya.Script {

    constructor() { 
        super(); 
       
    }
    
   onStart(){
       if(G_PlatHelper.isVIVOPlatform()){
           if(!MistakeMgr.getIns().getIsOpenId()){
               if(this.owner){
                this.owner.visible=false;
               }
              
           }
       }
   }
}