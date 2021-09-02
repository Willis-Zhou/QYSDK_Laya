import Tools from "../UIFrame/Tools";

export default class ContinuousTweenMgr {

    constructor() {
        this.initTweenVals=[];
        this.tweenVals = [];
        this.tweenIndex = 0;//动画播放的位置
        this.endBackFun = null;
        this.targets = [];
        this.isLoop = false;//是否循环
        this.isPlayTween = false;
        this.cTween = [];
        this.autoRet = false;
        this.delayTime = 0;//两次循环间隔

        this.playTimes=1;
        this.curPlayerTimes=0;
    }

    setLoop(loop) {
        this.isLoop = loop;
    }

    setTarget(target) {
        if (this.targets.indexOf(target)) {
            this.targets.push(target);
        }
    }

    clearTarget() {
        this.targets.splice(0, this.targets.length);
    }

    setTweenVals(vals) {
        this.initTweenVals = vals;
        this.tweenVals=vals;
    }

    setReverse(reverse){
        if(reverse){
            this.tweenVals=this.initTweenVals.slice(0).reverse();
        }else{
            this.tweenVals=this.initTweenVals;
        }
    }

    setEndCallBack(callBack) {
        this.endBackFun = callBack;
    }


    reset() {

        if (!this.checkTarget()) {
            return;
        }
        this.curPlayerTimes=0;
        this.tweenIndex = 0;
        let firstData = this.tweenVals[this.tweenIndex].prop;
        let firstDataKeys = Object.keys(firstData);

        for (let i = 0; i < firstDataKeys.length; i++) {
            let key = firstDataKeys[i];

            for (let j = 0; j < this.targets.length; j++) {
                this.targets[j][key] = firstData[key];
            }


        }
        this.tweenIndex++;
    }

    checkTarget() {
        let isExit = true;
        for (let i = this.targets.length - 1; i >= 0; i--) {
            let target = this.targets[i];
            if (!target || target.destroyed) {
                this.targets.splice(i, 1);
            }
        }
        isExit = this.targets.length != 0;

        if (!isExit) {
            isExit = this.tweenVals.length != 0;
        }

        return isExit;
    }

    play() {

        if (this.isPlayTween) {
            return;
        }

        if (!this.checkTarget()) {
            return;
        }
        this.reset();

        this.isPlayTween = true;
        if(this.delayTime!=0){
            Laya.timer.once(this.delayTime,this,()=>{
                this.doNext();
            })
        }else{
            this.doNext();
        }
        
    }

    autoReset(ret) {
        this.autoRet = ret;
    }

    setPlayTimes(times){
        this.playTimes=times;
    }

    doNext() {

        if (!this.checkTarget()) {
            return;
        }

        if (!this.isPlayTween) {
            return;
        }
        
        if (this.tweenIndex >= this.tweenVals.length) {
            this.curPlayerTimes++;
            if (this.isLoop||(this.curPlayerTimes<this.playTimes)) {

                if (!this.isPlayTween) {
                    return;
                }

                if (this.autoRet) {
                    this.reset();

                } else {
                    this.tweenIndex = 0;
                }



            } else {
                this.end();
                return;
            }

        }

        let time = this.tweenVals[this.tweenIndex].time;
        let prop = this.tweenVals[this.tweenIndex].prop;
        let ease = this.tweenVals[this.tweenIndex].ease;

        this.clearTween();
        for (let i = 0; i < this.targets.length; i++) {

            if(i==0){
                this.cTween.push(Laya.Tween.to(this.targets[i], prop, time, ease,Laya.Handler.create(this,this._doNext), 0, true, false));
            }else{
                this.cTween.push(Laya.Tween.to(this.targets[i], prop, time, ease, null, 0, true, false));
            }

            
        }

    }

    _doNext() {
        if (this.isPlayTween) {
            this.tweenIndex++;
            if (this.delayTime != 0 && this.tweenIndex >= this.tweenVals.length) {
                Laya.timer.once(this.delayTime, this, this.doNext);
            } else {
                this.doNext();
            }

        }
    }

    setDelayTime(time) {
        this.delayTime = time;
    }

    end() {
        this.isPlayTween = false;
        this.clearTween();
        Tools.getIns().handlerFun(this.endBackFun);
    }

    clearEndFun() {
        this.endBackFun = null;
    }

    clearTween() {
        for (let i = this.cTween.length - 1; i >= 0; i--) {
            if (this.cTween[i]) {
                this.cTween[i].clear();
            }
        }
        this.cTween.splice(0, this.cTween.length);
        Laya.timer.clear(this, this.doNext);
        Laya.timer.clear(this, this._doNext);
    }

    clearVals() {
        this.tweenVals.splice(0, this.tweenVals.length);
    }
}