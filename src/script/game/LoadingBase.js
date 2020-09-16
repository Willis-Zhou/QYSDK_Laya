import App from "../App";

/**
 * 主游戏场景View
 */
export default class LoadingBase extends Laya.Scene {
    constructor( scenePath ) {
        super();

        this._app = null
        this._isCfgChecked = false
        this._isLoaded = false

        // 加载场景文件
        this.loadScene(scenePath)

        // init UI
        this._onInitUI()

        // register events
        this._onRegisterEvent()
    }

    _onInitUI() {
        if (typeof this.onInitUI === "function") {
            this.onInitUI()
        }
    }

    _onRegisterEvent() {
        if (typeof this.onRegisterEvent === "function") {
            this.onRegisterEvent()
        }
    }

    _startCheckServer() {
        // body...
        this._app = this.addComponent(App)

        if (this._app) {
            var self = this

            this._app.registerShowLoadingFunc(function ( title ) {
                // body...
                // show loading
                self._autoShowLoading(title)
            })

            this._app.registerHideLoadingFunc(function () {
                // body...
                // hide loading
                self._cancelAutoShowLoading(true)
            })

            this._app.onServerCheckFinished(function () {
                // body...
                self.onServerChecked()
            })
        }
    }

    _onServerChecked() {
        if (typeof this.onServerChecked === "function") {
            this.onServerChecked()
        }
        else {
            // 开始登录
            this._startLogin()

            // 开始资源加载
            this._startLoad()
        }
    }

    _startLogin() {
        // body...
        var self = this

        console.log("auto login...")
        G_PlatHelper.autoLogin(function ( playerInfo ) {
            // body...
            if (playerInfo) {
                self._onLogined(playerInfo)
            }
            else {
                console.log("manual login...")
                G_PlatHelper.login(null, function ( playerInfo ) {
                    // body...
                    self._onLogined(playerInfo)
                })
            }
        })
    }

    _startLoad() {
        // white names if on wx platform
        if (G_BaseUrlPath !== "" && (Laya.MiniAdpter || Laya.QQMiniAdapter || Laya.VVMiniAdapter || Laya.QGMiniAdapter)) {
            Laya.URL.basePath = G_BaseUrlPath

            // white names
            let appNativefiles = G_AppNativefiles

            if (Laya.MiniAdpter) {
                Laya.MiniAdpter.nativefiles = Laya.MiniAdpter.nativefiles.concat(appNativefiles)
            }
            else if (Laya.QQMiniAdapter) {
                Laya.QQMiniAdapter.nativefiles = Laya.QQMiniAdapter.nativefiles.concat(appNativefiles)
            }
            else if (Laya.VVMiniAdapter) {
                Laya.VVMiniAdapter.nativefiles = Laya.VVMiniAdapter.nativefiles.concat(appNativefiles)
            }
            else if (Laya.QGMiniAdapter) {
                Laya.QGMiniAdapter.nativefiles = Laya.QGMiniAdapter.nativefiles.concat(appNativefiles)
            }
        }

        // start load
        if (G_PreloadAssets.length > 0) {
            Laya.loader.create(G_PreloadAssets, Laya.Handler.create(this, this._onLoadComplete), Laya.Handler.create(this, this._onLoadProgress));
            Laya.loader.on(Laya.Event.ERROR, null, function () {
                // notify
                G_Event.dispatchEvent(G_EventName.EN_SYSTEM_ERROR)
            })
        }
        else {
            this._onLoadProgress(1)
            this._onLoadComplete()
        }
    }

    _onLoadProgress( percent ) {
        if (typeof this.onLoadProgress === "function") {
            this.onLoadProgress(percent)
        }
    }

    _onLoadComplete() {
        if (typeof this.onLoadComplete === "function") {
            this.onLoadComplete()
        }
        else {
            this._openGameScene({isLoaded: true})
        }
    }

    _onLogined( playerInfo ) {
        // body...
        if (typeof this.onLogined === "function") {
            this.onLogined(playerInfo)
        }
        else{
            // 开始检查配置
            this._startCheckCfgs()
        }
    }

    _startCheckCfgs() {
        if (G_PlatHelper.isOVPlatform()) {
            // Oppo/Vivo Adv
            G_OVAdv.registerAll(G_OVAdvConfigs)

            if (G_PlatHelper.isVIVOPlatform()) {
                // stop support ov adv if is publishing
                G_Switch.isPublishing(function ( isPublishing ) {
                    if (isPublishing) {
                        G_OVAdv.stopSupport()
                    }
                })
            }
        }

        if (G_PlatHelper.isWXPlatform()) {
            G_Recommend.init()
        }

        // init reportor
        G_Reportor.init(G_PlayerInfo.getOpenID())
        // init share
        G_Share.init()
        // init adv
        G_Adv.init(function () {
            // init mistake
            G_MistakeMgr.init(function () {
                this._onCfgChecked()
            }.bind(this))
        }.bind(this))
    }

    _onCfgChecked() {
        if (typeof this.onCfgChecked === "function") {
            this.onCfgChecked()
        }
        else {
            // 打开场景
            this._openGameScene({cfgChecked: true})
        }
    }

    _openGameScene( flag ) {
        // body...
        if (flag && flag.cfgChecked) {
            this._isCfgChecked = true
        }
        if (flag && flag.isLoaded) {
            this._isLoaded = true
        }

        console.log("login state: cfgChecked: ", this._isCfgChecked, ", isLoaded: ", this._isLoaded)

        if (this._isCfgChecked && this._isLoaded) {
            G_Scheduler.schedule("delay_open_game_scene", () => {
                let sceneName = this.getGameSceneName()
                console.log("open scene: {0}...".format(sceneName))
                Laya.Scene.open(sceneName)
            }, false, 100, 0)
        }
    }

    getGameSceneName() {
        return "game/GameScene.scene"
    }

    _autoShowLoading( title ) {
        // body...
        // reset
        this._cancelAutoShowLoading(true)

        // mark
        this._isWillShowLoading = true

        // wait 1 seconds
        G_Scheduler.schedule("Loading_Auto_Show_Loading", function () {
            // body...
            G_PlatHelper.showLoading(title)

            // mark
            this._cancelAutoShowLoading(false)
        }.bind(this), false, 1000)
    }

    _cancelAutoShowLoading( bHide ) {
        // body...
        if (this._isWillShowLoading) {
            this._isWillShowLoading = false

            G_Scheduler.unschedule("Loading_Auto_Show_Loading")
        }

        if (bHide) {
            G_PlatHelper.hideLoading()
        }
    }
}