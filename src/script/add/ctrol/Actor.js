import Tools from "../UIFrame/Tools";


export default class Actor extends Laya.Script {
    constructor() {
        super();
        this._animData = new Object();
        this._body = null;
        this._anim = null;
        this.isAct = false;

        this._animName=null;

    }

    init() {
        this._body = Tools.getIns().returnSprite3D(this.owner.getChildByName("Mesh"));
        if (this._body) {
          
            let anim = this._body.getComponent(Laya.Animator);
            if(anim instanceof Laya.Animator){
                this._anim =anim;
            }
            this.stopAnim();
        }
      
        
        this.initAnimEvent();


    }

    initAnimEvent(){
        if(this._anim){
            this._animData=this._anim.getControllerLayer(0)._statesMap;
        }
        
    }

    setLvdata(data) {
        this.lvData = data;
    }

    enablePeople() {
        if (this.isAct) {
            return;
        }
        this.isAct = true;
        this.enPeople();
    }


    /**
    * 回收前调用一次
    */
    disablePeople(canRecycle = true) {
        if (!this.isAct) {
            return;
        }
        this.isAct = false;
        this.disPeople();
        if (canRecycle) {
            this.recycle();
        }

    }

    disPeople() {

    }

    enPeople() {

    }

    playAnim(name, callBack, isCorrss = false, speed = 1, layer = 0) {
        this._animName=name;
        if (this._anim) {
            this._anim.speed = speed;
            if (isCorrss) {
                this._anim.crossFade(name, 0.1, layer,0);
            } else {
                this._anim.play(name, layer, 0);
            }

            if (this._animData[name]) {
                Laya.timer.once(this._animData[name].clip.duration()*1000, this,  ()=> {
                    Tools.getIns().handlerFun(callBack);
                },null,true)
            }
        }
    }

    playAnimNotSave(name, callBack, isCorrss = true, speed = 1, layer = 0) {
        if(name==this._animName){
            return;
        }
       this.playAnim(name, callBack, isCorrss = true, speed = 1, layer = 0) ;
    }

    getCurAnimName(){
        return this._animName;
    }

    stopAnim(){
        if(this._anim){
            this._anim.speed=0;
        }
    }

    setAnimSpeed(speed) {
        if (this._anim) {
            this._anim.speed = speed;
        }
    }

    getAnimTime(name) {
        if (this._animData) {
            if (this._animData[name]) {
                return this._animData[name].time;
            }
        }

        return 0;
    }

    setStartPos(pos, rot) {
        this.owner.transform.position = pos.clone();
        this.owner.transform.rotationEuler = rot.clone();
        
    }

    getPos(){
        return this.owner.transform.position;
    }


    recycle() {

    }

    onDestroy() {
        this.disablePeople();
    }
}