import Tools from "../UIFrame/Tools";
import TTSumbitData from "./TTSumbitData";

/**
 * 平台登录 初始化处理
 */
export default class XiYouMgr {

    constructor() {
        this.gameServerName = "游戏服";
        this.gameServerId = "1";
        this.userId = null;
        this.token = null;
        this.isLogin = false;
        this.isInit = false;
        this.gameId=2211;
        this.appId="";
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new XiYouMgr();
            this.instance.init();
        }

        return this.instance;
    }

    /**
     * 初始化
     * @param {*} callBack 
     */
    init(callBack) {
        this.isInit = true;

        if (G_PlatHelper.isQQPlatform()) {
            this.appId= G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QQ_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isTTPlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_TT_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isOPPOPlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_OPPO_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isVIVOPlatform()) {
            this.appId= G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_VIVO_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isQTTPlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_QTT_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isMZPlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MZ_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isHWPlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_HW_MINI_PROGRAM_APP_ID"]).str
        }
        else if (G_PlatHelper.isNativePlatform()) {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NATIVE_MINI_PROGRAM_APP_ID"]).str
        }
        else {
            this.appId = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MINI_PROGRAM_APP_ID"]).str
        }

        Tools.getIns().handlerFun(callBack);
    }

    /**
     * 登录
     * @param {*} callBack 
     * @returns 
     */
    login(callBack) {

        if (!this.isInit || this.isLogin) {
            Tools.getIns().handlerFun(callBack);
            return;
        }
        Tools.getIns().handlerFun(callBack);
        return;

        let loadEnd = (mgr, uid) => {
            this.isLogin = true;
            this.userId = uid;
            TTSumbitData.getIns().setMgr(mgr);
            Tools.getIns().handlerFun(callBack);
        }

        if (G_PlatHelper.isOPPOPlatform()) {//oppo
           
        } else if (G_PlatHelper.isWXPlatform()) {
          
        }
        else {
            Tools.getIns().handlerFun(callBack);
        }
    }



    /**
     * 拿到用户id
     */
    getUId() {

        if (!this.isLogin) {
            return "";
        }

        return this.userId;
    }

    getAppId(){

        if(!this.isInit){
            console.error("xiyou 没有初始化!")
            return;
        }

        return this.appId;
    }
}