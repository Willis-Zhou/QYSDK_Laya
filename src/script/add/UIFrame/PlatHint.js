export default class PlatHint extends Laya.Script {

    

    constructor() { 
        super(); 

        /** @prop {name:wxPlat, tips:"vivo平台", type:Bool, default:false}*/
        this.wxPlat=false;
        /** @prop {name:oppoPlat, tips:"vivo平台", type:Bool, default:false}*/
        this.oppoPlat=false;
        /** @prop {name:vivoPlat, tips:"vivo平台", type:Bool, default:false}*/
        this.vivoPlat=false;
        /** @prop {name:qqPlat, tips:"vivo平台", type:Bool, default:false}*/
        this.qqPlat=false;
        /** @prop {name:ttPlat, tips:"vivo平台", type:Bool, default:false}*/
        this.ttPlat=false;
         /** @prop {name:winPlat, tips:"Win平台", type:Bool, default:true}*/
         this.winPlat=true;

        /** @prop {name:autoInit, tips:"是否自动初始化", type:Bool, default:true}*/
        this.autoInit=true;

           /** @prop {name:autoDes, tips:"是否自动摧毁", type:Bool, default:false}*/
           this.autoDes=false;

        this.isAction=true;
    }
    
    init(){
        
        if(G_PlatHelper.isWXPlatform()){
            this.isAction=this.wxPlat;
        }else if(G_PlatHelper.isQQPlatform()){
            this.isAction=this.qqPlat;
        }else if(G_PlatHelper.isOPPOPlatform()){
            this.isAction=this.oppoPlat;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.isAction=this.vivoPlat;
        }else if(G_PlatHelper.isTTPlatform()){
            this.isAction=this.ttPlat;
        }else if(G_PlatHelper.isWINPlatform()){
            this.isAction=this.winPlat;
        }

    }

    onAwake(){
        if(this.autoInit){
            this.init();
        }
        
        if(this.autoDes){
            if(!this.isAction){
                this.owner.destroy();
            }
        }else{
            this.owner.visible=this.isAction;
        }

        
    }
   
    setAutoInit(autoInit){
        this.autoInit=autoInit;
    }

    getIsAction(){
        return this.isAction;
    }
}