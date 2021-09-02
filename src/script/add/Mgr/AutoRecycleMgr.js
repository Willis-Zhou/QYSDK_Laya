import MapMgr from "./MapMgr";

export default class AutoRecycleMgr extends Laya.Script3D {

    constructor() {
        super();
        this.isAutoRecycle = false;
        this.key = null;
    }

    recycle(time) {
        Laya.timer.once(time * 1000, this, function () {
            if (!this || !this.owner||this.owner.destroyed) {
                return;
            }

            if (this.isAutoRecycle) {
                MapMgr.getIns().recycleMgr.recycle(this.key, this.owner)
            } else {

                this.owner.destroy();
            }

        })
    }

    setRecycleKey(key) {
        this.key = key;
    }

    setAutoRecycle(auto) {
        this.isAutoRecycle = auto;
    }

}