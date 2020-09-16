/**
 * 主游戏场景View
 */
export default class GameBase extends Laya.Scene {
    constructor(scenePath, scene3DPath) {
        super();

        // privates
        this._gameScene = null

        // 加载场景文件
        this.loadScene(scenePath)
        
        // init UI
        this._onInitUI()

        // register events
        this._onRegisterEvent()

        // 加载场景
        if (typeof scene3DPath === "string" && scene3DPath !== "") {
            Laya.Scene3D.load(scene3DPath, Laya.Handler.create(null, function (scene) {
                this._onLoadSceneCompleted(scene)
            }.bind(this)))
        }
    }

    onOpened() {
        // body...
        G_Event.dispatchEvent(G_EventName.EN_FIRST_OPEN_MAIN_SCENE)
    }

    _onInitUI() {
        // body...
        if (typeof this.onInitUI === "function") {
            this.onInitUI()
        }
    }

    _onRegisterEvent() {
        // 商业banner广告相关
        G_Event.addEventListerner(G_EventName.EN_SHOW_OWN_BANNER_AD, () => {
            if (typeof this.onShowOwnBanner === "function") {
                this.onShowOwnBanner()
            }
        })

        G_Event.addEventListerner(G_EventName.EN_HIDE_OWN_BANNER_AD, () => {
            if (typeof this.onHideOwnBanner === "function") {
                this.onHideOwnBanner()
            }
        })

        // 原生插屏广告相关
        G_Event.addEventListerner(G_EventName.EN_SHOW_OWN_INSERT_AD, function ( closeCb ) {
            if (typeof this.onShowOwnInsertAd === "function") {
                this.onShowOwnInsertAd(closeCb)
            }
            
        }.bind(this))

        // 本地提示相关
        G_Event.addEventListerner(G_EventName.EN_SHOW_LOCAL_TIPS, function ( content ) {
            if (typeof this.onShowLocalTips === "function") {
                this.onShowLocalTips(content)
            }
            else {
                G_UIManager.showUI("tips", null, content)
            }
        }.bind(this))

        G_Event.addEventListerner(G_EventName.EN_HIDE_LOCAL_TIPS, function () {
            if (typeof this.onHideLocalTips === "function") {
                this.onHideLocalTips()
            }
            else {
                G_UIManager.hideUI("tips")
            }
        }.bind(this))

        // 本地提示相关
        G_Event.addEventListerner(G_EventName.EN_SHOW_LOCAL_MODAL, function ( obj ) {
            if (typeof this.onShowLocalModal === "function") {
                this.onShowLocalModal(obj)
            }
            else {
                G_UIManager.showUI("modal", null, obj)
            }
        }.bind(this))

        G_Event.addEventListerner(G_EventName.EN_CANCEL_NAVIGATION_FROM_AD, function (advKey) {
            if (advKey !== "Popup" && advKey !== "FullScene" && advKey !== "FullSceneScroll" && advKey !== "Exit") {
                if (typeof this.onShowFullSceneAd === "function") {
                    this.onShowFullSceneAd()
                }
            }
        }.bind(this))

        if (typeof this.onRegisterEvent === "function") {
            this.onRegisterEvent()
        }
    }

    /**
     * 加载场景完成
     */
    _onLoadSceneCompleted( scene ) {
        // 将场景加到舞台上
        Laya.stage.addChildAt(scene, 0)

        // save
        this._gameScene = scene

        if (typeof this.onLoadSceneCompleted === "function") {
            this.onLoadSceneCompleted(scene)
        }
    }
}