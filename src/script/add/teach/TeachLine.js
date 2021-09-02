import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";

export default class TeachLine extends Laya.Script {
    constructor() {
        super();
        this.tempPos1 = new Laya.Vector3();
        this.tempPos2 = new Laya.Vector3();
        this.rotTemp=new Laya.Vector3();
        this.upVec=new Laya.Vector3(0,1,0);
    }

    init() {

    }


    setPos(start, end) {

    }

    onUpdate() {
        if (!GameMgr.getIns().isGameStart()) {
            return;
        }

        if (MapMgr.getIns().playerMgr && MapMgr.getIns().configMgr.curTeachPos) {
            let start = this.owner.transform.localRotationEuler;
            this.rotTemp.setValue(start.x, start.y, start.z);
            this.owner.transform.lookAt(MapMgr.getIns().configMgr.curTeachPos.transform.position, this.upVec, false);
            this.rotTemp.y = this.owner.transform.localRotationEulerY + 180;
            start.setValue(this.rotTemp.x, this.rotTemp.y, this.rotTemp.z);
            this.owner.transform.localRotationEuler = start;
        }
    }
}