/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Game from "./script/game/Game"
import WidgetMgr from "./script/game/ctrl/WidgetMgr"
import SettingPopup from "./script/game/popup/SettingPopup"
import AdvLoadMgr from "./script/game/ctrl/AdvLoadMgr"
import MoreGamePopup from "./script/game/popup/MoreGamePopup"
import Loading from "./script/game/Loading"
import App from "./script/App"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/game/Game.js",Game);
		reg("script/game/ctrl/WidgetMgr.js",WidgetMgr);
		reg("script/game/popup/SettingPopup.js",SettingPopup);
		reg("script/game/ctrl/AdvLoadMgr.js",AdvLoadMgr);
		reg("script/game/popup/MoreGamePopup.js",MoreGamePopup);
		reg("script/game/Loading.js",Loading);
		reg("script/App.js",App);
    }
}
GameConfig.width = 720;
GameConfig.height = 1280;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "loading/LoadingScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
