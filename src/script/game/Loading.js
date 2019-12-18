import App from "../App";

/**
 * 主游戏场景View
 */
export default class Loading extends Laya.Scene {
    constructor() {
        super();

        this._app = null
        this._isLogined = false
        this._isLoaded = false

        // 加载场景文件
        this.loadScene("loading/LoadingScene.scene")

        // init UI
        this._initUI()
    }

    onEnable() {
        // 开始检查服务端
        this._startCheckServer()
    }

    _initUI() {
    }

    _startCheckServer() {
        // body...
        this._app = this.getComponent(App)

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
                self._startLogin()
                self._startLoad()
            })
        }
    }

    _startLogin() {
        // body...
        var self = this

        console.log("auto login...")
        G_WXHelper.autoLogin(function ( playerInfo ) {
            // body...
            if (playerInfo) {
                self._onLogined(playerInfo)
            }
            else {
                console.log("manual login...")
                G_WXHelper.login(null, function ( playerInfo ) {
                    // body...
                    self._onLogined(playerInfo)
                })
            }
        })
    }

    _onLogined( playerInfo ) {
        // body...
        console.log("login successfully...")
        console.log(playerInfo)

        this._isLogined = true

        // init reportor
        G_Reportor.init(G_PlayerInfo.getOpenID())
        // init share
        G_Share.init()
        // init adv
        G_Adv.init(function () {
            this._openGameScene()
        }.bind(this))
    }

    _startLoad() {
        // white names if on wx platform
        if (G_BaseUrlPath !== "" && (Laya.MiniAdpter || Laya.QQMiniAdapter || Laya.VVMiniAdapter || Laya.QGMiniAdapter)) {
            Laya.URL.basePath = G_BaseUrlPath

            // white names
            let appNativefiles = [
                "res/atlas",
                "res/conf"
            ]

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
        }
        else {
            this._onLoadProgress(1)
            this._onLoadComplete()
        }
    }

    _onLoadProgress( percent ) {
        if (this.loadingProgress) {
            this.loadingProgress.value = percent
        }
    }

    _onLoadComplete() {
        this._isLoaded = true
        this._openGameScene()
    }

    _openGameScene() {
        // body...
        if (this._isLogined && this._isLoaded) {
            G_Scheduler.schedule("delay_open_game_scene", function () {
                console.log("open game scene...")
                Laya.Scene.open("game/GameScene.scene")
            }, false, 100, 0)
        }
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
            G_WXHelper.showLoading(title)

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
            G_WXHelper.hideLoading()
        }
    }
}