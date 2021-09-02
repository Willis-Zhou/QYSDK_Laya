import Tools from "../UIFrame/Tools";

/**
 * 玩家配置
 */
export default class LevelConfigMgr extends Laya.Script {

    constructor() {
        super();
        this.startPos = null;
        this.endPos = null;
        this.roadDis = 0;
        this.enemyStartPos = null;
        this.enemyMgr = null;
        this.tVec2 = new Laya.Vector3();


        this.xiaoSanCorl;

        this.enemyWatchBackFun = null;
        this.enemWatchForwardFun = null;
        this.bePunchFun = null;

        this.endP = new Map();
        this.endX = new Map();

        this.curEndIndex = 1;
        this.endPlane = null;
        this.isEndPunch = false;

        this.waitTime = 10000;
        this.curWaitTime = 10000;

        //是否亲热
        this.isQingRe = false;
    }


    init() {
        this.startPos = G_UIHelper.seekNodeByName(this.owner, "startPos");
        this.enemyStartPos = Tools.getIns().returnSprite3D(G_UIHelper.seekNodeByName(this.owner, "enemyStartPos"));
    
        this.enemyEndPos = Tools.getIns().returnSprite3D(G_UIHelper.seekNodeByName(this.owner, "enemyEndPos"));
    }



   

    /**
     * 拿到最后的乘积
     * @param {*} pos 
     */
    checkEndX(pos) {
        for (let i = this.curEndIndex + 1; i <= 15; i++) {
            if (pos.z + 1 >= this.endX.get(i).transform.position.z) {
                this.curEndIndex = i;
                this.setEndColor(this.endP.get(i));
            }
        }

        return this.curEndIndex;
    }


    onDestroy() {
        Laya.timer.clearAll(this);
    }


    getStartPoint() {
        return this.startPos;
    }

    getEnemtPoint() {
        return this.enemyStartPos;
    }

    getRoadDis() {
        return this.roadDis;
    }

    getEndPos() {
        return this.endPos;
    }

   
    preLoadAsset(assets, callBack) {

        Tools.getIns().handlerFun(callBack);
    }

   

    onDestroy() {
        if (this.enemyMgr) {
            this.enemyMgr.owner.destroy();
            this.enemyMgr = null;
        }
    }




}