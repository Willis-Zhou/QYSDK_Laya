import PlayerActor from "./PlayerActor";
import MapMgr from "../Mgr/MapMgr";
import PlayerState from "../data/PlayerState";
import GameMgr from "../Mgr/GameMgr";
import Tools from "../UIFrame/Tools";
import DrawLine from "../gameMgr/DrawLine";
import Constant from "../data/Constant";
import BeeMgr from "../gameMgr/BeeMgr";
import AnimName from "../gameMgr/AnimName";
import GrowUp from "../gameMgr/GrowUp";

/**
 * 玩家控制类
 */
export default class PlayerCtrol extends PlayerActor {
    constructor() {
        super();
        this.isPlayer = true;
        this.cam_pos = null;

        this.moveSpeed = 0.18;
        this.moveVec = new Laya.Vector3();
        this.tempV1 = new Laya.Vector3();
        this.tempV2 = new Laya.Vector3();
        this.tempArray = [];
        this.tempRot = new Laya.Quaternion();

        this.cam_pos_offect = new Laya.Vector3();

        //蜜蜂的中心位置
        this.bea_center = null;

        //拥有的蜜蜂
        this.ownerBeas = [];

        this.playerPoss = [];
        this.curPosIndex = 0;
        this.speedVal = 1;//速度的增值
        this.speedAdd=0;
        this.isSpeedUp=false;

        //玩家的计算范围
        this.colRang = 1.2;
        this.colRangSquare = this.colRang * this.colRang;

        this.kangRang = 4;
        this.kangRangSquare = this.kangRang * this.kangRang;
        this.kangIndex = 0;//抗击动画的播放index

        //砍击的伤害
        this.kangHurt = 20;
        //镰刀的砍击区域
        this.kang_center = null;
        this.lastKangPos = new Laya.Vector3();

        this.kangTimer = 0;
        this.kangMinTime = 1.223 * 0.3 * 1000;
        this.kangMaxTime = 1.223 * 0.72 * 1000;

        this.capcityContain = 100;
        this.curCapcityContain = 0;

        this.inisSpeed= 0.15 ;


        this.speedUpEf=null;
        this.isShowSpeedEf=false;
        this.isInLoadSpeedUp=false;

        this.hand_ef_pos=null;

        this.strongeEf=null;
        this.isShowStrongeEf=false;
        this.isInLoadStrongeEf=false;

        this.walkSpeed=1;

        this.contain_pos=null;
    }


    init() {
        super.init();
        this.contain_pos=Tools.getIns().findSprite3D(this.owner,"contain_pos");
        this.hand_ef_pos=Tools.getIns().findSprite3D(this.owner,"hand_ef_pos");
        this.cam_pos = Tools.getIns().returnSprite3D(G_UIHelper.seekNodeByName(this.owner, "cam_pos"));
        this.bea_center = Tools.getIns().returnSprite3D(G_UIHelper.seekNodeByName(this.owner, "bea_center"));
        this.kang_center = Tools.getIns().findSprite3D(this.owner, "kang_center");
        for (let i = 0; i < 9; i++) {
            this.playerPoss.push({ vec: new Laya.Vector3(0, 0, 0), speedVal: 1 });
        }


        //初始化检测范围
        if (G_PlatHelper.isWINPlatform()) {
            let drawLine = new DrawLine();
            drawLine.init(this.node);
            //碰撞范围
            let colRang = this.colRang;
            drawLine.drawBox(colRang, colRang);
            //砍击范围
            let kangRang = this.kangRang;
            drawLine.drawBox(kangRang, kangRang, new Laya.Color(0, 0, 0, 1));

            //砍击范围
            let beaRang = Constant.getIns().beaRang;
            drawLine.drawBox(beaRang, beaRang);

        }


    }

    setPlayerData(playerData) {
        this.upContain();
        this.upHurt();
        this.changeSpeedUpState();
        this.changeStrongeState();
        this.curCapcityContain = 0;//先不记录当前容量
    }



    setCorl() {
        MapMgr.getIns().gameView.dragCrol.mouseDownFun = () => {
            this.changeState(PlayerState.getIns().Run);
            this.moveVec.setValue(0, 0, 0);
        }

        MapMgr.getIns().gameView.dragCrol.mouseUpFun = () => {

            this.mouseUp();
        }


        MapMgr.getIns().gameView.dragCrol.mouseMoveFun = (x, z) => {
            this.moveVec.x = -x;
            this.moveVec.z = z;
            this.moveVec.y = 0;

            let len = Math.abs(x) + Math.abs(z);

            let val = len * 0.01;
            val = val > 1 ? 1 : val;
            this.speedVal = val;
            this.moveSpeed =(this.inisSpeed+this.speedAdd)* val;
            this.walkSpeed=val;
            Laya.Vector3.normalize(this.moveVec, this.moveVec);
            Laya.Vector3.scale(this.moveVec, this.moveSpeed, this.moveVec);
        }
    }

    mouseUp() {

        this.checkHasInKangPlants(true);
    }

    /**
     * 开始砍击
     * @param {*} find 是否重新寻找 
     */
    checkHasInKangPlants(find = false) {
        if (!MapMgr.getIns().curMap) {
            this.changeState(PlayerState.getIns().Idle);
            return;
        }
        let array = MapMgr.getIns().curMap.getInHurtRangFlowers(this, find);

        if (array && array.length != 0) {
            this.changeState(PlayerState.getIns().kang);
            find && MapMgr.getIns().curMap.walkToIdle(this);
        } else {
            this.changeState(PlayerState.getIns().Idle);
        }
    }

    showSpeedEf(show){
        this.isShowSpeedEf=show;
        if(this.speedUpEf){
            this.speedUpEf.active=false;
            this.speedUpEf.active=show;
        }else{

            if(this.isInLoadSpeedUp){
                return;
            }

            this.isInLoadSpeedUp=true;

            let path=G_ResPath.resPath.format("Fx_Speedup");
            G_NodePoolMgr.preload([path],()=>{
                let ef=G_NodePoolMgr.getNode(path);
                this.owner.addChild(ef);
                Tools.getIns().resetTransform(ef);
                this.isInLoadSpeedUp=false;
                this.speedUpEf=ef;
                this.showSpeedEf(this.isShowSpeedEf);
            })
        }
    }


    canHurtFlower(minHurt){
        if(this.isShowStrongeEf){
            return true;
        }

        return this.kangHurt>=minHurt;
    }

    /**
     * 显示手臂的特效
     * @param {*} show 
     * @returns 
     */
    showStrongeEf(show){
        this.isShowStrongeEf=show;
        if(this.strongeEf){
            this.strongeEf.active=false;
            this.strongeEf.active=show;
        }else{

            if(this.isInLoadStrongeEf){
                return;
            }

            this.isInLoadStrongeEf=true;
            let path=G_ResPath.resPath.format("Fx_Onthehand");
            G_NodePoolMgr.preload([path],()=>{
                let ef=G_NodePoolMgr.getNode(path);
                this.hand_ef_pos.addChild(ef);
                Tools.getIns().resetTransform(ef);
                this.isInLoadStrongeEf=false;
                this.strongeEf=ef;
                this.showStrongeEf(this.isShowStrongeEf);
            })
        }
    }

    changeStrongeState(){
        let skillData=GameMgr.getPlayerInfo().getPlayerSkillDataById(2);
        let show=false;
        if(skillData.toTime>G_ServerInfo.getServerTime()){
            show=true;
            
        }
        this.showStrongeEf(show);
    }



    changeSpeedUpState(){
        let skillData=GameMgr.getPlayerInfo().getPlayerSkillDataById(1);
        if(skillData.toTime>G_ServerInfo.getServerTime()){
            this.speedUp();
        }else{
            this.cancelSpeedUp();
        }
    }

    speedUp(){
        if(this.isSpeedUp){
            return;
        }

        this.isSpeedUp=true;
        this.speedAdd=this.inisSpeed;
        this.showSpeedEf(true);
    }


    cancelSpeedUp(){
        if(!this.isSpeedUp){
            return;
        }

        this.isSpeedUp=false;
        this.speedAdd=0;
        this.showSpeedEf(false);
    }

    changeStateAction(state) {
        if (state == PlayerState.getIns().Idle) {
            //行走之后停下
            this.playAnim(AnimName.getIns().Idle);
            //告诉蜜蜂采蜜
            MapMgr.getIns().curMap && MapMgr.getIns().curMap.walkToIdle(this);
            GameMgr.getPlayerInfo().savePlayerPos(GameMgr.getIns().levelData.id, this.node.transform.position);
        } else if (state == PlayerState.getIns().Run) {
            this.playAnim(AnimName.getIns().Run);
        } else if (state == PlayerState.getIns().kang) {
            this.kangIndex++;
            let index = this.kangIndex;
            this.clearKangData();
            this.playAnim(AnimName.getIns().kang, () => {
                if (this.state != PlayerState.getIns().kang || this.kangIndex != index) {
                    return;
                }
                this.changeState(PlayerState.getIns().Idle)
                this.checkHasInKangPlants(true);
            });
        }
    }

    onUpdate() {
        if (!GameMgr.getIns().isGameStart()) {
            return;
        }


        if (MapMgr.getIns().inChangeMap()) {
            return;
        }

        this.doAction();
        this.cameraFollow();

    }

    doAction() {
        switch (this.state) {
            case PlayerState.getIns().Idle:
                break;
            case PlayerState.getIns().Run:
                this.toMove();
                break;
            case PlayerState.getIns().kang:
                this.toKang();
                break;
        }
    }


    toMove() {
        Laya.Vector3.add(this.node.transform.position, this.moveVec, this.tempV1);
        //出了地图的区域
        if (!MapMgr.getIns().curMap.hasInMap(this.tempV1)) {
            return;
        }
        this.playerPoss[this.curPosIndex].speedVal = this.speedVal;
        this.node.transform.position.cloneTo(this.playerPoss[this.curPosIndex].vec);
        this.curPosIndex++;
        if (this.curPosIndex >= this.playerPoss.length) {
            this.curPosIndex = 0;
        }
        this.node.transform.translate(this.moveVec, false);
        this.playerFollow();
        this._anim.speed=this.walkSpeed;
        MapMgr.getIns().curMap.checkColloder(this);
    }

    /**
     * 清除砍击的数据
     */
    clearKangData() {
        // this.lastKangFlowers.splice(0, this.lastKangFlowers.length);
        this.lastKangPos = null;
        this.kangTimer = 0;
    }

    /**
     * 抗击
     */
    toKang() {

        this.kangTimer += Laya.timer.delta;

        if (this.kangTimer < this.kangMinTime || this.kangTimer > this.kangMaxTime) {
            return;
        }

        if (!this.lastKangPos) {
            this.lastKangPos = new Laya.Vector3();
            this.kang_center.transform.position.cloneTo(this.lastKangPos);
            return;
        }



        let array = MapMgr.getIns().curMap.getInHurtRangFlowers(this, false);
        let curPos = this.kang_center.transform.position;
        for (let i = 0; i < array.length; i++) {
            if (Tools.vecInTriangle(this.lastKangPos, curPos, this.node.transform.position, array[i].getPos())) {
                array[i].daoEnter(this);
            }
        }

        curPos.cloneTo(this.lastKangPos);
    }

    /**
     * 增加蜂蜜
     * @param {*} val 
     */
    addHoney(val) {
        this.curCapcityContain += val;
        if (this.curCapcityContain > this.capcityContain) {
            this.curCapcityContain = this.capcityContain;
        }
        
        this.refershContainView();
    }

    useHoney(count){
        this.curCapcityContain-=count;
        this.refershContainView();
    }

    clearHoney() {
        this.curCapcityContain = 0;
        this.refershContainView();
    }

    getHoney() {
        return this.curCapcityContain;
    }

    refershContainView() {
        if (MapMgr.getIns().gameView) {
            MapMgr.getIns().gameView.setContain(this.curCapcityContain, this.capcityContain);
        }
    }

    /**
     * 蜂蜜是否装满
     * @returns 
     */
    isHoneyFull() {
        return this.curCapcityContain >= this.capcityContain;
    }

    /**
     * 玩家朝向
     * @returns 
     */
    playerFollow() {
        if (this.moveVec.x == 0 && this.moveVec.z == 0) {
            return;
        }

        this.moveVec.cloneTo(this.tempV1);
        this.tempV1.z = -this.tempV1.z;
        this.tempV1.y = 0;
        Laya.Quaternion.rotationLookAt(this.tempV1, Tools.getIns().upVec, this.tempRot);
        Laya.Quaternion.lerp(this.node.transform.rotation, this.tempRot, 0.1, this.tempRot);
        let rot = this.node.transform.rotation;
        this.tempRot.cloneTo(rot);
        this.node.transform.rotation = rot;
    }

    cameraFollow() {
        Laya.Vector3.add(this.node.transform.position, this.cam_pos_offect, this.tempV1);
        if(this.isSpeedUp){
            MapMgr.getIns().cameraMgr.setCameraPos(this.tempV1, 0.004 * Laya.timer.delta);
        }else{
            MapMgr.getIns().cameraMgr.setCameraPos(this.tempV1, 0.002 * Laya.timer.delta);
        }
        
    }

    resgistEvent() {
        super.resgistEvent();
        G_Event.addEventListerner(G_EventName.ENUPCONTAIN, this.upContain, this);
        G_Event.addEventListerner(G_EventName.EN_UPHURT, this.upHurt, this);
        G_Event.addEventListerner(G_EventName.EN_SPEEDUPCHANGE,this.changeSpeedUpState,this);
        G_Event.addEventListerner(G_EventName.EN_STRONGE_CHANGE,this.changeStrongeState,this);
    }

    upContain() {
        let lv=GameMgr.getPlayerInfo().getContainLv();
        let data=null;
        if(lv>GrowUp.getIns().maxId){
            data=G_GameDB.getGrowUpByID(GrowUp.getIns().maxId);
        }else{
            data=G_GameDB.getGrowUpByID(lv);
        }
        this.capcityContain = parseFloat(data.pCapacity);
        this.refershContainView();
    }

    upHurt() {

        let lv=GameMgr.getPlayerInfo().getHurtLv();
        let data=null;
        if(lv>GrowUp.getIns().maxId){
            data=G_GameDB.getGrowUpByID(GrowUp.getIns().maxId);
        }else{
            data=G_GameDB.getGrowUpByID(lv);
        }

        this.kangHurt = parseFloat(data.pHurt);
    }

    removeEvent() {
        super.removeEvent();
        G_Event.removeEventListerner(G_EventName.EN_STRONGE_CHANGE,this.changeStrongeState,this);
        G_Event.removeEventListerner(G_EventName.ENUPCONTAIN, this.upContain, this);
        G_Event.removeEventListerner(G_EventName.EN_UPHURT, this.upHurt, this);
        G_Event.removeEventListerner(G_EventName.EN_SPEEDUPCHANGE,this.changeSpeedUpState,this);
    }


    setStartPos(pos, rot) {
        super.setStartPos(pos, rot);
        //设置摄像机位置
        MapMgr.getIns().cameraMgr.setCameraPos(this.cam_pos.transform.position, 1);
        MapMgr.getIns().cameraMgr.setCameraRot(this.cam_pos.transform.rotation);
        Laya.Vector3.subtract(this.cam_pos.transform.position, this.node.transform.position, this.cam_pos_offect);
        this.changeState(PlayerState.getIns().Idle);
    }

    /**
     * 碰撞回调
     * @param {*} type 1是商铺 2是花朵
     * @param {*} mgr 
     */
    colliderEnterObj(type, mgr) {
        if (mgr.colType == 2) {//花朵
            mgr.toBorder(this.playerPoss);
        } else if (mgr.colType == 1) {//商店
            mgr.openStore();
        }
    }

    /**
     * 碰撞退出
     * @param {*} type 
     * @param {*} mgr 
     */
    collideExitObj(type, mgr) {
        if (mgr.colType == 1) {
            mgr.closeStore();
        }
    }





    isStand() {
        return this.state == PlayerState.getIns().Idle;
    }

    /**
     * 有物体在蜜蜂的范围内
     * @param {*} array 
     */
    hasPlantsInBeaRang(array) {
        this.checkHasBeeToCollect(null, array);
    }



    /**
     * 检查是否有蜜蜂可以收集
     * @param {*} bee 
     */
    checkHasBeeToCollect(overBee, array) {
        for (let i = 0; i < array.length; i++) {
            let flower = array[i];
            if (!flower.canBeingCollect()) {
                continue;
            }
            let bea = BeeMgr.getIns().getSpaceBee();
            if (!bea) {
                break;
            } else {
                bea.toFlower(flower);
            }
        }
    }


    /**
     * 地图切换
     */
    changeMapCallback() {
        BeeMgr.getIns().forceEndColloct();
    }


    /**
     * 切换植物快
     */
    changePlantCallback() {
        BeeMgr.getIns().endAllBeeCollectFlower();
    }

    backStartPos(pos,rot){
        this.setStartPos(pos,rot);
        BeeMgr.getIns().endAllBeeAction();
    }
}
