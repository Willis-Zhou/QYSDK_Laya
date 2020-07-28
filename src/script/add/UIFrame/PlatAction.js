export default class PlatAction {

    constructor() { 

        this.isinLoadAppBox=false;//是否在加载盒子广告
        this.boxad=null;
        this.todayShowColorTimes=0;
    }
    
   init(){
        
   }

   cretaeBoxAd(callBack){
       G_Adv.createBoxAdv(callBack);
   }

   addColorSign(){
    if(G_PlatHelper.isQQPlatform()&&this.canShowColorSgin()){
        G_Adv.addColorSign();
        this.addColorTimes()
    }
        
    }

    canShowColorSgin(){
        return this.todayShowColorTimes<1;
    }

    addColorTimes(){
        this.todayShowColorTimes++;
        //this._serializePlayerInfoIntoLocal();
    }
}