import List from "../UIFrame/List";
import Tools from "../UIFrame/Tools";
import AldMgr from "../gameMgr/AldMgr";
import CameraRecordMgr from "./CameraRecordMgr";
import DailyTaskMgr from "./DailyTaskMgr";
import ExtraEffect from "./ExtraEffect";
import MapMgr from "./MapMgr";
import TTSumbitData from "./TTSumbitData";
import ExportAdMgr from "./ExportAdMgr";
import { PlayerInfo } from "../../game/global/player_info";
import MainUIMgr from "../UIFrame/MainUIMgr";
import UIName from "../UIFrame/UIName";
import MultiplePassOutlineMaterial from "../Shader/MultiplePassOutlineMaterial";
import MistakeMgr from "./MistakeMgr";

export default class GameMgr {

    constructor() {

        this.gameScene = null;
        this.levelData = null;
        this.notLimitConfig = null;
        this.trainConfig = null;
        /**
         * 1正常模式 2驾照模式 3无尽模式 4教程
         */
        this.levelType = 1;
        this.isPause = false;
        this.lastIsFail = false;
        this.isTest = false;
        this.isPauseMusic = false;
        this.isShowLoadingPage = false;
        this.mapInit = false;
        this.gameMul = 1;//游戏结束金币倍数
        this.gameState = -1;//游戏的状态 1

        this.enableHDR = false;
        this.task01 = 0;//击杀任务

        this.gameStartTime = 0;
        //是否第一次复活
        this.isFirstReborn = true;
        this.teachConfig = {
            config: "TeachLv1",
            startBuffCount: 0,
        }
        this.trySkinId = null;
        this.isTryUseSkin = false;//是否试用皮肤
        this.curFloorId = 1;
    }

    /**
     * 实例
     * @returns 
     */
    static getIns() {
        if (!this.instance) {
            this.instance = new GameMgr();
            MultiplePassOutlineMaterial.initShader();
        }

        return this.instance;
    }

    /**
     * 玩家数据对象
     * @returns 
     */
    static getPlayerInfo() {
        let pf = window.G_PlayerInfo
        if (pf instanceof PlayerInfo) {
            this.playerInfo = pf;
        }
        return this.playerInfo;
    }

    /**
     * 界面对象
     * @returns 
     */
    static getUIMgr() {
        if (!this.uiMgr) {
            console.error("不存在ui管理类!");
        }

        return this.uiMgr;
    }

    /**
     * 界面名字类
     * @returns 
     */
    static getUIName() {
        if (!this.uiName) {
            this.uiName = new UIName();
        }

        return this.uiName;
    }

    /**
     * 赋值界面类
     * @param {*} uiMgr 
     */
    static setUIMgr(uiMgr) {
        if (uiMgr instanceof MainUIMgr) {
            this.uiMgr = uiMgr;
            if (G_PlatHelper.isWINPlatform()) {
                window.G_MainGui = uiMgr;
            }
        }
    }

    init(scene) {
        this.gameScene = scene;
        this.checkHdR();
        if (G_PlatHelper.getPlat()) {
            this.isTest = false;
        }

    }

    /**
     * 是否可以显示3d物体在image
     * @returns 
     */
    canshow3DImage() {
        return true;
    }

    /**
     * 判断是否支持dhr
     */
    checkHdR() {
        this.enableHDR = Laya.SystemUtils.supportRenderTextureFormat(Laya.RenderTextureFormat.R16G16B16A16);
    }

    isEnableHDR() {
        return this.enableHDR;
    }



    initMap() {
        if (this.mapInit) {
            console.error("地图已经初始化!");
            return;
        }
        this.mapInit = true;
        let map = G_UIHelper.seekNodeByName(this.gameScene, "map");
        let mapMgr = map.addComponent(MapMgr);
        MapMgr.setIns(mapMgr);
        mapMgr.initMap(() => {
            this.mapInit = false;
        })
    }

    /**
     * 初始化游戏
     */
    initGame(callBack) {
        //进入默认场景
        let levelData = G_GameDB.getLevelConfigByID(GameMgr.getPlayerInfo().getLastLevelId());
        MapMgr.getIns().changeMinMap(levelData, (mgr) => {
            let lastPos = GameMgr.getPlayerInfo().getLastPlayerPos();
            let pos;
            let rot=new Laya.Vector3(0,0,0);

            if(!lastPos){
                pos=MapMgr.getIns().curMap.getStartPoint().transform.position;
                rot=MapMgr.getIns().curMap.getStartPoint().transform.rotationEuler;
            }else{
                let temp=lastPos.split('&');
                pos=new Laya.Vector3(parseFloat(temp[0]),parseFloat(temp[1]),parseFloat(temp[2]));
            }

            MapMgr.getIns().loadMainPlayer(1, pos, rot, () => {
                mgr.createNavMeshGroup(MapMgr.getIns().playerMgr.owner.transform.position);
                this.setGameState(0);
                Tools.getIns().handlerFun(callBack);
                
                //游戏开始
                GameMgr.getIns().gameStart();

                MapMgr.getIns().loadingView.openBgTwen();
            })
        })
    }

    /**
     * 游戏开始
     */
    gameStart() {
        this.setGameState(2);
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ReadyView);
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GameView);
    }


    //游戏暂停
    gamePause() {
        this.isPause = true;
        G_Event.dispatchEvent(GG_EventName.EN_GAMEPAUSE)
    }

    gameResume() {
        this.isPause = false;
    }



    isGameStart() {
        return this.gameState == 2 && !this.isPause;
    }

    setGameState(state) {
        this.gameState = state;
    }

    isGameReady() {
        return this.gameState == 0;
    }

    isGameOver() {
        return this.gameState == 3 || this.gameState == 4;
    }

}