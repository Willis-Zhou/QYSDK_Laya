export default class VivoAdHint extends Laya.Script {

    constructor() { 
        super(); 
       
    }
    
   onStart(){
       if(G_PlatHelper.isVIVOPlatform()){
           if(!G_MistakeHelp.getIsOpenId()){
               if(this.owner){
                this.owner.visible=false;
               }
              
           }
       }
   }
}