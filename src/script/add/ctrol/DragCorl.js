import Tools from "../UIFrame/Tools";

export default class DragCorl extends Laya.Script {
    init() {
        this.isRes = false;
        this.touchId = 0;
        this.isMouseDwon = false;
        this.mouseDownPos = new Laya.Vector3();

        this.mouseMoveFun = null;
        this.mouseDownFun = null;
        this.mouseUpFun = null;

        this.tempVec1 = new Laya.Vector3();

        this.resginst();
    }

    resginst() {
        if (this.isRes) {
            return;
        }
        this.isRes = true;

        this.owner.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
    }

    mouseMove(event) {
        if (!this.isMouseDwon) {
            this.isMouseDwon = true;
            this.touchId = event.touchId;
            this.mouseDownPos.x = event.stageX;
            this.mouseDownPos.z = event.stageY;
            Tools.getIns().handlerFun(this.mouseDownFun);
            return;
        }

        this.tempVec1.x = event.stageX;
        this.tempVec1.z = event.stageY;
        Laya.Vector3.subtract(this.tempVec1, this.mouseDownPos, this.tempVec1);
        Tools.getIns().handlerFun(this.mouseMoveFun, this.tempVec1.x, -this.tempVec1.z);

    }

    mouseUp(event) {
        if (!this.isMouseDwon) {
            return;
        }

        if (event.touchId != this.touchId) {
            return;
        }

        this.isMouseDwon = false;
        Tools.getIns().handlerFun(this.mouseUpFun);
    }

    unResginst() {
        if (!this.isRes) {
            return;
        }
        this.isRes = false;
        this.owner.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
    }

    onDestroy() {
        this.unResginst();
    }

    clearCallBackFun() {
        this.mouseDownFun = null;
        this.mouseUpFun = null;
        this.mouseMoveFun = null;
    }
}