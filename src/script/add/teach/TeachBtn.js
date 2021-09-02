import TeachMgr from "./TeachMgr";

export default class TeachBtn extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:stepKey, tips:"教程id", type:String, default:-1}*/
        this.stepKey = -1;

    }


    init() {


    }


    resigstBtn() {
        TeachMgr.getIns().addTeachBtn(this);

    }

    unResigstBtn() {
        TeachMgr.getIns().removeTeachBtn(this);
    }


    getStepKey() {
        return this.stepKey;
    }
}