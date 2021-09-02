import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";

export default class TweenPoolMgr{
    constructor(){
        this.tweenPool=[];
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new TweenPoolMgr();
        }

        return this.instance;
    }

    getTween(){
        let ten=null;
        if(this.tweenPool.length!=0){
            ten=this.tweenPool[0];
            this.tweenPool.splice(0,1);
        }else{
            ten= new ContinuousTweenMgr();
        }
        return ten;
    }

    recycleTween(ten){
        if(ten){
            ten.setLoop(false);
            ten.setDelayTime(0);
            ten.clearEndFun();
            ten.end();
            ten.clearTarget();
        }

        if(this.tweenPool.indexOf(ten)<0){
            this.tweenPool.push(ten);
        }
    }
}