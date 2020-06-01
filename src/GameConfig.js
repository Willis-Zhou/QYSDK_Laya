/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Game from "./script/game/Game"
import WidgetMgr from "./script/game/ctrl/WidgetMgr"
import GameTest from "./script/game/GameTest"
import AutoShake from "./script/game/ctrl/AutoShake"
import AutoScale from "./script/game/ctrl/AutoScale"
import Loading from "./script/game/Loading"
import AdvLoadMgr from "./script/game/ctrl/AdvLoadMgr"
import BannerPopup from "./script/game/ui/popup/BannerPopup"
import Flow from "./script/game/ui/popup/Flow"
import Finish from "./script/game/ui/popup/Finish"
import MoreGamePopup from "./script/game/ui/popup/MoreGamePopup"
import NativeFlow from "./script/game/ui/popup/NativeFlow"
import InsertPopup from "./script/game/ui/popup/InsertPopup"
import ExitPopup from "./script/game/ui/popup/ExitPopup"
import ExitBtnPopup from "./script/game/ui/popup/ExitBtnPopup"
import FullScenePopup from "./script/game/ui/popup/FullScenePopup"
import NewGameExitPopup from "./script/game/ui/popup/NewGameExitPopup"
import ScrollPopup from "./script/game/ui/popup/ScrollPopup"
import SettingPopup from "./script/game/ui/popup/SettingPopup"
import Tips from "./script/game/ui/popup/Tips"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/game/Game.js",Game);
		reg("script/game/ctrl/WidgetMgr.js",WidgetMgr);
		reg("script/game/GameTest.js",GameTest);
		reg("script/game/ctrl/AutoShake.js",AutoShake);
		reg("script/game/ctrl/AutoScale.js",AutoScale);
		reg("script/game/Loading.js",Loading);
		reg("script/game/ctrl/AdvLoadMgr.js",AdvLoadMgr);
		reg("script/game/ui/popup/BannerPopup.js",BannerPopup);
		reg("script/game/ui/popup/Flow.js",Flow);
		reg("script/game/ui/popup/Finish.js",Finish);
		reg("script/game/ui/popup/MoreGamePopup.js",MoreGamePopup);
		reg("script/game/ui/popup/NativeFlow.js",NativeFlow);
		reg("script/game/ui/popup/InsertPopup.js",InsertPopup);
		reg("script/game/ui/popup/ExitPopup.js",ExitPopup);
		reg("script/game/ui/popup/ExitBtnPopup.js",ExitBtnPopup);
		reg("script/game/ui/popup/FullScenePopup.js",FullScenePopup);
		reg("script/game/ui/popup/NewGameExitPopup.js",NewGameExitPopup);
		reg("script/game/ui/popup/ScrollPopup.js",ScrollPopup);
		reg("script/game/ui/popup/SettingPopup.js",SettingPopup);
		reg("script/game/ui/popup/Tips.js",Tips);
    }
}
GameConfig.width = 750;
GameConfig.height = 1334;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "vertical";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "loading/LoadingScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
