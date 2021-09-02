import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import PlayerCtrol from "./PlayerCtrol";

export default class KeyCorl extends Laya.Script {
    constructor() {
        super();

        this.playerActor = null;
        this.isAddLis = false;
    }

    init() {

    }

    setActor(actor) {
        if (actor instanceof PlayerCtrol) {
            this.playerActor = actor;
        }

    }

    resgistLis() {
        if (this.isAddLis) {
            return;
        }
        console.error("添加键位监听");
        this.isAddLis = true;
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.keyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.keyUp);
    }

    removeLis() {
        if (!this.isAddLis) {
            return;
        }
        this.isAddLis = false;
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.keyDown);
        Laya.stage.off(Laya.Event.KEY_UP, this, this.keyUp);
    }



    onDestroy() {
        this.removeLis();
    }

    keyDown(event) {

        if (event.keyCode == Laya.Keyboard.W) {
           // this.playerActor.doMove(-1);
           GameMgr.getIns().gameFail();
        } else if (event.keyCode == Laya.Keyboard.S) {
            this.playerActor.changeCameraView(1);
        }

        if (event.keyCode == Laya.Keyboard.A) {
            this.playerActor.toRunPos();
        }  

        if (event.keyCode == Laya.Keyboard.D) {
            MapMgr.getIns().configMgr.enemyMgr.toRunPos();
        }

        if (event.keyCode == Laya.Keyboard.SHIFT) {
            this.playerActor.speedUp(this.playerActor.boneDis+1);
            //this.playerActor.changeBodyScale(2);
        }

        if (event.keyCode == Laya.Keyboard.SPACE) {
            this.playerActor.addBodyBone(2);
        }

        if (event.keyCode == Laya.Keyboard.C) {
            this.playerActor.changeBodySpace(this.playerActor.boneDis-1);
            //this.playerActor.changeBodyScale(2);
        }

        if (event.keyCode == Laya.Keyboard.X) {
            this.playerActor.punchOneMan();
        }

        if (event.keyCode == Laya.Keyboard.Z) {
            this.playerActor.punchMan(0.5);
        }


        if (event.keyCode == Laya.Keyboard.V) {
            this.playerActor.punchMan(1);
        }
        if (event.keyCode == Laya.Keyboard.P) {
            this.playerActor.punchMan(0.2);
        }

        if (event.keyCode == Laya.Keyboard.T) {
            Laya.timer.scale=5;
        }
        
    }

    keyUp(event) {

        // if (event.keyCode == Laya.Keyboard.W) {
        //    this.playerActor.toForward(false);
        // } else if (event.keyCode == Laya.Keyboard.S) {
        //     this.playerActor.toBack(false);
        // }
        // if (event.keyCode == Laya.Keyboard.A) {
        //     this.playerActor.endRot();
        // } 
        
        // if (event.keyCode == Laya.Keyboard.D) {
        //     this.playerActor.endRot();
        // }

        if(event.keyCode==Laya.Keyboard.SHIFT){
            this.playerActor.speedEnd();
        }else if(event.keyCode==Laya.Keyboard.SPACE){
            this.playerActor.cancelBrake();
        }

        if (event.keyCode == Laya.Keyboard.T) {
            Laya.timer.scale=1;
        }
        // if(event.keyCode==Laya.Keyboard.K){
        //     MapMgr.getIns().configMgr.killAllEnemy();
        // }


    }
}