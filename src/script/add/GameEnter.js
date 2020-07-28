import MistakeMgr from "./MistakeMgr"
import Tools from "./UIFrame/Tools"
import UIName from "./UIFrame/UIName"
    export default class GameEnter  {

    constructor() { 
      
    }
    
    /**
     * 游戏入口初始化
     * @param {*} callBack 
     */
    init(){
        //APP_CONST

        //G_EventName

        //resPath
        window.G_ResPath={
            resPath:"res/Sprites/{0}.lh",
            itemPath:"prefab/item/{0}.json",
            skinPath:"game/skin/icon/{0}.png",
        }

        G_GameDBConfigs.push({
			key: "LevelConfig",
			getFunc: true,
			getAllFunc: true,
			getCountFunc: false
        });

        G_ADCfg = {
            "Popup":"b5d38b8f47cf0d7aef0065597a9dbd03",//伸缩栏
            "botton_list":"5dff3f86ff3617f924f5536f7c95eac0",//底部list
            "botton_banner":"3c66825bf2f218436caccb6b93c17a73",//底部banner
            "GameOver":"1546d52e00daa5d51296c22a64c41749",//结束
            "reborn":"5dff3f86ff3617f924f5536f7c95eac0",//复活界面
            "FullSceneScroll":"0cff036de78b046b81e2b8520fae8360",//好友在玩
            "FullScene":"ee2a98b3ba79d62950534db9641ee913",//导出页
        }
        
        G_Dbs.push("res/conf/db/TBLevelConfig.txt")

        //
        window.G_Tools=new Tools();
        window.G_UIName=new UIName();
        window.G_MistakeHelp=new MistakeMgr();

        window.G_BtnDelayTime=1.2;
	    window.G_BrnMoveTimer=0.3;
	    window.G_SkinId=1;
        window.G_ShowWantdUseSkin=true;
        window.G_levelID=0;
	    window.G_BtnDoShowTime=25;

        window.G_AdData=null;//广告数据
	    window.G_AdTestUrl="https://image.game.hnquyou.com/upload/opId10.txt";//测试广告url


        //注册switch函数
        G_Switch.getVal=function(key,cb){
            // body...
            if (typeof cb !== "function") {
                return
            }

            if (window.wx) {
                G_Switch._getCfgByKey(key, function (bSucc, sCfg) {
                    // body...
                    if (bSucc) {
                        cb(sCfg)
                    }
                    else {
                        cb(null)
                    }
                })
            }
            else {
                cb(null)
            }
        };

    }
}