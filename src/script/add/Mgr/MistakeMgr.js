import Tools from "../UIFrame/Tools";
import ExportAdMgr from "./ExportAdMgr";
import GameMgr from "./GameMgr";
import TTSumbitData from "./TTSumbitData";
import XiYouMgr from "./XiYouMgr";
export default class MistakeMgr {

    constructor() {
        this.isExportAdvEnabled = true;//商业广告是否可以导出
        this.mistakeData = null;//误触数据

        this.sceneId = 0;

        this.ttData = null;
        this.nativeSpace = -1;//是否开启原生误触

        this.shaderCompiled = false;

        this.wxSdkVesion = "1.00.00";//微信版本号

        this.mistake_boxtype = 0;//0 不弹宝箱 1开始弹 2结束弹
    }

    static getIns() {
        if (!this.instance) {
            this.instance = new MistakeMgr();

            
        }

        return this.instance;
    }

    init(successFun) {
        /**
         * 初始化数据上报
         */
        TTSumbitData.getIns().init();

        ExportAdMgr.getIns();

        let loadArray = [];

        let p1 = (resolve, reject) => {

            if (G_PlatHelper.getPlat()) {
                G_Switch._getCfgByKey(G_SwitchName.SN_MISTAKE_DATA, (bSucc, sCfg) => {
                    // body...
                    if (bSucc) {
                        this.mistakeData = sCfg;
                    }
                    else {
                        this.mistakeData = null;
                    }
                    console.log("mistakeData ", this.mistakeData);
                    resolve();
                })
            }
            else {
                this.mistakeData = null;
                resolve();
            }


        }

        // let p2 = (resolve) => {
        //     G_Switch._getCfgByKey("mistake_boxtype", (bSucc, sCfg) => {
        //         // body...
        //         if (bSucc) {
        //             this.mistake_boxtype = parseInt(sCfg);
        //         }
        //         else {
        //             this.mistake_boxtype = 0;
        //         }
        //         console.log("mistake_boxtype ", this.mistake_boxtype);
        //         resolve();
        //     })

        // }



        // let p10 = (resolve, reject) => {
        //     XiYouMgr.getIns().login(() => {
        //         resolve();
        //     })
        // }


        if (G_PlatHelper.isWXPlatform()) {
            loadArray.push(new Promise(p1));
        } else if (G_PlatHelper.isQQPlatform()) {
            loadArray.push(new Promise(p1));
        } else if (G_PlatHelper.isVIVOPlatform()) {

        } else if (G_PlatHelper.isOPPOPlatform()) {
            //loadArray.push(new Promise(p10));
        } else if (G_PlatHelper.isTTPlatform()) {
            TTSumbitData.getIns().Aufromvidio();
        } else if (G_PlatHelper.isHWPlatform()) {

        } else if (G_PlatHelper.isWINPlatform()) {

        }

        let loadOver = () => {
            this.disLog();
            this.loadOverConfig();
            Tools.getIns().handlerFun(successFun);
        }

        if (loadArray.length == 0) {
            loadOver();
            return;
        }

        Promise.all(loadArray).then((result) => {
            loadOver();
        }).catch(function (e) {
            Tools.getIns().error(e)
            Tools.getIns().handlerFun(successFun);
        });
    }

    disLog() {
        if (G_PlatHelper.getPlat()) {
            console.log = function (str) {

            }
        }
    }

    loadOverConfig() {

    }

    cloneLevelConfig(obj, temp, keys) {
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = temp[keys[i]];
        }
    }



    getMistakeData() {
        return this.mistakeData;
    }

    getForceUpdate() {
        if (G_MistakeMgr.isForceUpdateMistakeEnabledAsync) {
            return G_MistakeMgr.isForceUpdateMistakeEnabledAsync();
        }

        return false;
    }

    showStartAd() {
        if (G_MistakeMgr.isStartAdMistakeEnabledAsync) {
            return G_MistakeMgr.isStartAdMistakeEnabledAsync();
        }

        return false;
    }

    isMisPunch(){
        
        if (G_MistakeMgr.isMisPunchMistakeEnabledAsync) {
            return G_MistakeMgr.isMisPunchMistakeEnabledAsync();
        }

        return false;
    }

    autoShowPop() {
        if (G_MistakeMgr.isAutoShowPopAdMistakeEnabledAsync) {
            return G_MistakeMgr.isAutoShowPopAdMistakeEnabledAsync();
        }

        return false;

    }

    autoShowGamePop() {

        if (G_MistakeMgr.isAutoShowGamePopAdMistakeEnabledAsync) {
            return G_MistakeMgr.isAutoShowGamePopAdMistakeEnabledAsync();
        }

        return false;
    }

    gameOverGetMis(){
        if (G_MistakeMgr.isGameOverGetMistakeEnabledAsync) {
            return G_MistakeMgr.isGameOverGetMistakeEnabledAsync();
        }
    
        return false;
    }
    
    ShowBoxView(){
        if (G_MistakeMgr.isShowBoxViewMistakeEnabledAsync) {
            return G_MistakeMgr.isShowBoxViewMistakeEnabledAsync();
        }
    
        return false;
    }



    getIsExportAdvEnabled() {
        return this.isExportAdvEnabled;
    }

    getIsOpenId() {

        if (G_MistakeMgr.isVivoOpenAdMistakeEnabledAsync) {
            return G_MistakeMgr.isVivoOpenAdMistakeEnabledAsync();
        }

        return false;
    }

    /**
     * 原始的广告间隔
     */
    getNatvieMisSpace() {
        return this.nativeSpace;
    }


    getForeceSelect() {

        //头条的额外控制
        if (G_PlatHelper.isTTPlatform()) {

            if (this.ttData.adSwitch == 0) {
                return false;
            }

            let isShow = (this.ttData.disFunc["1"].status == 1);
            if (!isShow) {
                return false;
            }

            //概率随机
            let rand = parseFloat(this.ttData.disFunc["1"].show_per);
            return Math.random() <= rand;
        } else {
            if (G_MistakeMgr.isForece_selectMistakeEnabledAsync) {
                return G_MistakeMgr.isForece_selectMistakeEnabledAsync();
            }

            return false;
        }


    }

    showSensitiveScene() {

        if (G_PlatHelper.isTTPlatform()) {
            // if(this.ttData.adSwitch==0){
            //     return false;
            // }

            // let isShow=(this.ttData.disFunc["3"].status==1);

            // return isShow

            return false;
        } else if (G_MistakeMgr.isSensitiveSceneMistakeEnabledAsync) {//其他平台开关控制
            return G_MistakeMgr.isSensitiveSceneMistakeEnabledAsync();
        }


        return true;
    }



    getBtnDelayShow() {
        if (G_PlatHelper.isTTPlatform()) {

            if (this.ttData.adSwitch == 0) {
                return false;
            }

            return this.ttData.disFunc["2"].status == 1;
        } else if (G_MistakeMgr.isBtnDelayShowMistakeEnabledAsync) {
            return G_MistakeMgr.isBtnDelayShowMistakeEnabledAsync();
        }

        return false;
    }

    showOppoEndAd() {
        if (G_MistakeMgr.isOppoEndAdMistakeEnabledAsync) {
            return G_MistakeMgr.isOppoEndAdMistakeEnabledAsync();
        }

        return false;
    }
    
    showAdBox() {
        if (G_MistakeMgr.isShowAdBoxMistakeEnabledAsync) {
            return G_MistakeMgr.isShowAdBoxMistakeEnabledAsync();
        }

        return false;
    }

    preloadAsset(callBack) {



        let assets = [];

         //关卡预制
         let levelId = G_PlayerInfo.getCurLevelId();
         let levelData = G_GameDB.getLevelConfigByID(levelId);
         assets.push(G_ResPath.resPath.format(levelData.config));
         let skinId = G_PlayerInfo.getSkinId();
         let playerData = G_GameDB.getPlayerConfigByID(skinId);
         assets.push(G_ResPath.resPath.format("Eve"+levelData.floorId));
         assets.push(G_ResPath.resPath.format(playerData.model));
        if (assets.length == 0) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        G_NodePoolMgr.preload(assets, () => {

            //先加载一份在内存
            // for (let i = 0; i < assets.length; i++) {
            //     let path = assets[i];
            //     let node = G_NodePoolMgr.getNode(path);

            //     G_NodePoolMgr.recycleNode(path, node);
            // }

            Tools.getIns().handlerFun(callBack);
        });
        
    }

    preCompileShader(callBack) {

        if (this.shaderCompiled) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        this.shaderCompiled = true;

        let loadEndFun = (data) => {
            let arr = JSON.parse(data);
            Tools.getIns().compileShader(arr, callBack);
        }

        Tools.getIns().loadTxt("res/tempConf/shaderCompile.txt", (data) => {
            loadEndFun(data);
        })




    }

    debugModeShader() {
        Laya.Shader3D.debugMode = true
        let arr = [];
        for (let i = 0; i < Laya.Shader3D.debugShaderVariantCollection.variantCount; i++) {
            let shadervariant = Laya.Shader3D.debugShaderVariantCollection.getByIndex(i);
            let obj = {};
            obj.shaderName = shadervariant.shader.name;
            obj.defineNames = shadervariant.defineNames;
            obj.passIndex = shadervariant.passIndex;
            obj.subShaderIndex = shadervariant.subShaderIndex;
            arr.push(obj);
        }
        //Laya.Shader3D.debugMode = false
        console.error(JSON.stringify(arr));
    }


    openBoxView(callBack){
        if((G_PlatHelper.isWXPlatform())&&this.ShowBoxView()){
            let obj=new Object();
            obj.callBack=callBack;
            GameMgr.getUIMgr().openUI(GameMgr.getUIName().OpenBoxView,obj);
        }else{
            Tools.getIns().handlerFun(callBack);
        }
    }

    resetMisByNode(node) {
        node.clickTimes = 0;
        node.isMisShowBanner = false;
        node.isCallBack=false;
    }

    clickMistake(node, callBack) {
        if (MistakeMgr.getIns().gameOverGetMis()) {
            node.clickTimes++;

            if (node.isMisShowBanner) {
                
                if(!node.isCallBack){
                    node.isCallBack=true;
                    Tools.getIns().handlerFun(callBack);
                }
               
                return;
            }

            if (node.clickTimes == 1) {

            } else if (node.clickTimes == 2) {//延时显示banner

                node.misFun = () => {
                    node.misFun = () => {
                        Tools.getIns().hintBanner();
                        node.isMisShowBanner = true;
                    }
                    Tools.getIns().createBanner();
                   
                    Laya.timer.once(2000, node, node.misFun)
                }

                Laya.timer.once(1500, node, node.misFun)

            }
        } else {
            Tools.getIns().handlerFun(callBack);
        }
    }
}