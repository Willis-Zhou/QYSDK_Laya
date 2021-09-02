
import CameraMgr from "./CameraMgr";
import RecycleMgr from "../gameMgr/RecycleMgr";
import PlayerCtrol from "../ctrol/PlayerCtrol";
import Tools from "../UIFrame/Tools";
import GameView from "../Page/GameView";
import KeyCorl from "../ctrol/KeyCorl";
import MapPart from "../gameMgr/MapPart";
import NavMeshMgr from "../gameMgr/NavMeshMgr";
import Bea from "../Ob/Bea";
import OutDoor from "../Ob/OutDoor";
import GameMgr from "./GameMgr";
import BeeMgr from "../gameMgr/BeeMgr";
import LevelMgr from "./LevelMgr";
import LoadingView from "../Page/LoadingView";
export default class MapMgr extends Laya.Script3D {

    constructor() {
        super();
        this.isLoadPlayer = false;
        this.cameraMgr;
        this.light = null;
        this.roadDis = 0;
        this.recycleMgr = new RecycleMgr();
        this.recycleNode = null;
        this.gameView = null;
        this.playerMgr = null;
        this.isInChangeMap = false;
        this.mapPart = {};
        this.curMap = null;
        this.loadingView=null;
    }

    static getIns() {
        if (!this.instance) {
            console.error("地图类不存在!");
        }



        return this.instance;
    }

    static setIns(ins) {
        if (ins instanceof MapMgr) {
            this.instance = ins;
            if (G_PlatHelper.isWINPlatform()) {
                window.G_MapMgr = ins;
            }
        }

    }

    /**
     * 初实话地图
     * @param {*} callBack 
     */
    init() {
        this.initCamera();
        this.light = G_UIHelper.seekNodeByName(this.owner, "light");

        this.initLight(this.light);
        this.model_pos = G_UIHelper.seekNodeByName(this.owner, "model_pos");
        let sp = new Laya.Sprite3D("recycleNode");
        this.owner.addChild(sp);
        Tools.getIns().resetTransform(sp);
        this.recycleNode = sp;

       
    }


    initLight(light) {
        if (light instanceof Laya.DirectionLight) {

            // Use soft shadow.
            light.shadowMode = Laya.ShadowMode.None;
            // Set shadow max distance from camera.
            // light.shadowDistance = 50;
            // // Set shadow resolution.
            // light.shadowResolution = 1024;
            // //light.intensity=
            // // Set shadow cascade mode.
            // light.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;
            // // 阴影强度
            // light.shadowStrength = 0.8;


        }
    }

    initCamera() {
        let gameCamera = G_UIHelper.seekNodeByName(this.owner, "gameCamera");
        let ca = gameCamera.addComponent(CameraMgr);
        if (ca instanceof CameraMgr) {
            this.cameraMgr = ca;
            ca.init();
        }

    }

    setLoadingView(view){
        if (view instanceof LoadingView) {
            this.loadingView = view;
        }
    }

    setGameView(view) {
        if (view instanceof GameView) {
            this.gameView = view;
        }
    }


    isReady() {
        return this.isLoadPlayer && this.isOtherLoadOver;
    }

    /**
     * 加载场景(首次启动)
     * @param {} callBack 
     */
    initMap(callBack) {
        this.init();
        Tools.getIns().handlerFun(callBack);
    }

    /**
     * 切换小地图
     * @param {*} levelData 
     * @param {*} callBack 
     */
    changeMinMap(levelData, callBack) {
        console.log("levelid:",levelData.id);
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().LodingView);
        GameMgr.getIns().levelData=levelData;
        LevelMgr.getIns().setLevelData(levelData);
        this.isInChangeMap = true;

       

        //先关闭当前的
        this.curMap && this.hideMap(this.curMap);
        if (this.mapPart[levelData.config]) {
            this.showMap(this.mapPart[levelData.config]);
            this.isInChangeMap = false;
            Tools.getIns().handlerFun(callBack, this.mapPart[levelData.config]);
        } else {
            let path = G_ResPath.resPath.format(levelData.config);
            G_NodePoolMgr.preload([path], () => {
                let scene = G_NodePoolMgr.getNode(path);
                if (scene instanceof Laya.Sprite3D) {
                    this.owner.addChild(scene);
                
                    Tools.getIns().resetTransform(scene);
                    let mgr = scene.addComponent(MapPart);
                    mgr.init(levelData.config);
                    this.mapPart[levelData.config] = mgr;
                    this.showMap(mgr);
                    //创建mesh组
                    NavMeshMgr.getIns().loadMap(levelData.config, () => {
                        this.isInChangeMap = false;
                        Tools.getIns().handlerFun(callBack, mgr);
                    })


                }

            })

        }
    }


    /**
     * 进图一扇门
     * @param {*} doorMgr 
     */
    inDoor(doorMgr) {
        GameMgr.getPlayerInfo().setToNextLevelID();
        let levelData = G_GameDB.getLevelConfigByID(GameMgr.getPlayerInfo().getCurLevelId());
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().LodingView,null,()=>{
            this.loadingView.closeBgTween();
        });

        this.changeMinMap(levelData, (mgr) => {
            
           
            //设置玩家的位置
            let standPos = mgr.getStartPoint();
            this.playerMgr.setStartPos(standPos.transform.position, standPos.transform.rotationEuler);
            mgr.createNavMeshGroup(this.playerMgr.owner.transform.position);
            this.playerMgr.changeMapCallback();
            this.loadingView.openBgTwen()
        })
        
    }

    /**
     * 是否在切换地图
     * @returns 
     */
    inChangeMap() {
        return this.isInChangeMap;
    }

    /**
     * 开启地图
     * @param {*} map 
     */
    showMap(map) {
        if (map instanceof MapPart) {
            map.openMap();
            this.curMap = map;
        }

    }

    /**
     * 隐藏地图
     * @param {*} map 
     */
    hideMap(map) {
        if (map instanceof MapPart) {
            map.closeMap();
        }
        this.curMap = null;
    }

    /**
     * 加在玩家
     * @param {*} skinId 
     * @param {*} callBack 
     */
    loadMainPlayer(skinId, pos, rot, callBack) {
        this.isLoadPlayer = false;
        let playerData = G_GameDB.getPlayerConfigByID(skinId);
        let path = G_ResPath.resPath.format(playerData.model);
        this.curPlayerId = skinId;
        G_NodePoolMgr.preload([path], () => {
            if (!this || !this.owner || this.owner.destroyed) {
                return;
            }
            if (this.curPlayerId != skinId) {
                console.error("玩家不对应");
                return;
            }

            let playerModel = G_NodePoolMgr.getNode(path);
            this.owner.addChild(playerModel);

            //设置位置
            let mgr = playerModel.addComponent(PlayerCtrol);
            if (mgr instanceof PlayerCtrol) {
                this.playerMgr = mgr;
            }

            mgr.init();
            mgr.setPlayerData(playerData);
            mgr.setStartPos(pos, rot);
            
            mgr.enablePeople();

            if (G_PlatHelper.isWINPlatform()) {
                let keyCorl = playerModel.addComponent(KeyCorl);
                keyCorl.init();
                keyCorl.resgistLis();
                keyCorl.setActor(mgr);
            }

            BeeMgr.getIns().initBee(() => {
                this.isLoadPlayer = true;
                Tools.getIns().handlerFun(callBack);
            })

        })
    }

    /**
     * 加载蜜蜂
     * @param {*} name 
     * @param {*} callBack 
     */
    loadBee(name, callBack) {
        let path = G_ResPath.resPath.format(name);
        G_NodePoolMgr.preload([path], () => {
            let bee = G_NodePoolMgr.getNode(path);
            this.owner.addChild(bee);
            let mgr = bee.addComponent(Bea);
            mgr.init();

            Tools.getIns().handlerFun(callBack, mgr);
        })
    }


}