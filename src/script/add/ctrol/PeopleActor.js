import Actor from "./Actor";

export default class PeopleActor extends Actor{
    constructor(){
        super();
    }

    init(){
        this._anim = this.owner.getComponent(Laya.Animator);
        this.stopAnim();
        this.initAnimEvent();
    }
}