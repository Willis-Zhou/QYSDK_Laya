export default class TweenType extends Laya.Script {

    constructor() { 
        super(); 
        this.tweenAnimType="none";
         /** @prop {name:ttType, tips:"头条, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"shake"}*/
        this.ttType="scale";
        /** @prop {name:wxType, tips:"微信, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"scale"}*/
        this.wxType="scale";
         /** @prop {name:oppoType, tips:"oppo, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"scale"}*/
         this.oppoType="scale";
         /** @prop {name:vivoType, tips:"vivo, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"scale"}*/
         this.vivoType="scale";
        /** @prop {name:qqType, tips:"qq, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"scale"}*/
        this.qqType="scale";
        /** @prop {name:winType, tips:"windows, scale为缩放，none为无,摇换", type:Option, option:"none,scale,shake", default:"scale"}*/
        this.winType="scale";
         
    }
    
    onAwake(){
       this.init();
    }

    init(){
        if(G_PlatHelper.isWXPlatform()){
            this.tweenAnimType=this.wxType;
        }else if(G_PlatHelper.isQQPlatform()){
            this.tweenAnimType=this.qqType;
        }else if(G_PlatHelper.isOPPOPlatform()){
            this.tweenAnimType=this.oppoType;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.tweenAnimType=this.vivoType;
        }else if(G_PlatHelper.isTTPlatform()){
            this.tweenAnimType=this.ttType;
        }else if(G_PlatHelper.isWINPlatform()){
            this.tweenAnimType=this.winType;
        }
        //console.log("动画类型:",this.ttType);
    }

    playTween(){
        if(this.tweenAnimType=="scale"){
            G_Tools.setBtnScaleTween(this.owner);
        }else if(this.tweenAnimType=="shake"){
            G_Tools.setBtnShake(this.owner);
        }
    }

    endTween(){
        G_Tools.closeBtnTween(this.owner);
    }
}