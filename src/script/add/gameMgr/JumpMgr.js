import Tools from "../UIFrame/Tools";

export default class JumpMgr {

    constructor() {
        this.initSpeedY = 0.5;
        this.curMoveY = 0;
        this.startJumpTime = 0;
        this.target = null;
        this.grivity = -1;
        this.minY = 0;
        this.callBack = null;
        this.isJump = false;

        this.minX = -10;
        this.maxX = 10;

        this.isFall = false;//是否要掉下去
        this.tempV1=new Laya.Vector3();
    }

    setRang(minX, maxX) {
        this.minX = minX;
        this.maxX = maxX;
    }

    setJumpData(target, initSpeedY, grivity, minY, callBack) {
        this.target = target;
        this.initSpeedY = initSpeedY;
        this.grivity = grivity;
        this.startJumpTime = Laya.timer.currTimer;
        this.minY = minY;
        this.curMoveY = 0;
        this.callBack = callBack;
        this.isJump = true;
        this.isFall = false;
    }

    update() {
        if (this.isJump) {
            this.tempV1.y=this.curMoveY;
            this.target.transform.translate(this.tempV1, false);
            this.culY();
        }

    }

    culY() {

        let delta = Laya.timer.delta / 1000;
        let moveTime = (Laya.timer.currTimer - this.startJumpTime) / 1000;
        this.curMoveY = 0.5 * this.grivity * delta * delta + (this.initSpeedY + this.grivity * moveTime) * delta;

        if (this.target.transform.position.y + 0.01 < this.minY) {


            let pos = this.target.transform.position;
            pos.y=this.minY;
            this.target.transform.position =pos;
            this.jumpEndBack();
            this.isJump = false;

        }
    }

    jumpEndBack() {
        Tools.getIns().handlerFun(this.callBack);
    }

    checkOutRang() {
        if (this.target.transform.position.x > this.maxX || this.target.transform.position.x < this.minX) {
            return true;
        }

        return false;
    }
}