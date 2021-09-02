import PlayerState from "../data/PlayerState";
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import Actor from "./Actor";

export default class PlayerActor extends Actor {

    constructor() {
        super();
        this.ownerMgr = null;
        this.isPlayer = false;
        this.node = null;
        /**
         * -1无状态 0待机 1走路
         */
        this.state=PlayerState.None;
    }

    init() {
        super.init();
        
        if (this.owner instanceof Laya.Sprite3D) {
            this.node = this.owner;
        }
        this.owner.ownerMgr = this;
        this.resgistEvent();
    }

    toRunPos(){
        let pos= this.owner.transform.position;
        pos.z=MapMgr.getIns().configMgr.runPos.transform.position.z;
        this.owner.transform.position=pos;
    }

    resgistEvent() {
        G_Event.addEventListerner(GG_EventName.GAMESTART, this.gameStart, this);
        G_Event.addEventListerner(GG_EventName.END_CHECK_OVER, this.gameOver, this);
    }


    removeEvent() {
        G_Event.removeEventListerner(GG_EventName.GAMESTART, this.gameStart, this);
        G_Event.removeEventListerner(GG_EventName.END_CHECK_OVER, this.gameOver, this);
    }

    changeState(state) {
        if (state == this.state) {
            return;
        }

        this.state = state;
        this.changeStateAction(state);
    }

    changeStateAction(state) {
        
    }

    onDestroy() {
        super.onDestroy();
        this.removeEvent();
    }

    gameStart() {

    }

    gameOver() {

    }


}