import MapMgr from "../Mgr/MapMgr";
import NodeBase from "../Ob/NodeBase";

export default class TeachTargetPos extends NodeBase{
    constructor(){
        super();
        this.col=null;
        this.showPointName="huansedian5";
    }

    init(){
        this.col=this.owner.getComponent(Laya.PhysicsCollider);
        this.col.canCollideWith =G_ColGroup.player;
        this.col.collisionGroup = G_ColGroup.teach;
        this.col.isTrigger=true;
        this.reset();
    }

  

    onTriggerEnter(col){
        if(col.collisionGroup==G_ColGroup.player){
            if(col.owner.ownerMgr.isDie()){
                return;
            }
            this.recycle();
            MapMgr.getIns().configMgr.nextTeachPos();
        }
    }

}