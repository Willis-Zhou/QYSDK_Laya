import BaseUI from "../base/BaseUI"

export default class SettingPopup extends BaseUI {
    /** @prop {name:rootNode, tips:"根节点，确保锚点在中心", type:Node, default:null}*/
    /** @prop {name:openType, tips:"打开方式, scale为缩放，fromLeft为从左进入，fromBottom为从下进入，opacity为淡入，none为无", type:Option, option:"none,scale,fromLeft,fromBottom,opacity", default:"none"}*/
    /** @prop {name:closeType, tips:"关闭方式, scale为缩放，opacity为淡出，none为无", type:Option, option:"none,scale,opacity", default:"none"}*/

    constructor() {
        super()

        // privates
    }

    onAwake() {
        this._rootNode = this.rootNode
        this._openType = this.openType
        this._closeType = this.closeType
    }

    onEnable() {
        // init ui
        this._initUI()
    }

    _initUI() {
        let closeBtn = G_UIHelper.seekNodeByName(this.owner, "closeBtn")
        if (closeBtn) {
            closeBtn.on("click", null, function () {
                this.onCloseTouched(closeBtn)
            }.bind(this))
        }

        let shareBtn = G_UIHelper.seekNodeByName(this.owner, "shareAppBtn")
        if (shareBtn) {
            shareBtn.on("click", null, function () {
                this.onShareTouched(shareBtn)
            }.bind(this))

            // visible
            shareBtn.visible = G_Share.isSupport()
            if (G_PlatHelper.isTTPlatform()) {
                shareBtn.visible = false
            }
        }

        let soundSwitchBtn = G_UIHelper.seekNodeByName(this.owner, "soundSwitchBtn")
        if (soundSwitchBtn) {
            soundSwitchBtn.on("click", null, function () {
                this.onSoundSwitchTouched(soundSwitchBtn)
            }.bind(this))

            // init
            this._initSwitchBtn(soundSwitchBtn)
            soundSwitchBtn.setWitchState(G_SoundMgr.isSoundEnable())
        }

        let muteSwitchBtn = G_UIHelper.seekNodeByName(this.owner, "muteSwitchBtn")
        if (muteSwitchBtn) {
            muteSwitchBtn.on("click", null, function () {
                this.onMuteSwitchTouched(muteSwitchBtn)
            }.bind(this))

            // init
            this._initSwitchBtn(muteSwitchBtn)
            muteSwitchBtn.setWitchState(G_PlayerInfo.isMuteEnable())

            // visible
            G_UIHelper.seekNodeByName(this.owner, "muteIcon").visible = G_PlatHelper.isSupportVibratePhone()
            G_UIHelper.seekNodeByName(this.owner, "muteText").visible = G_PlatHelper.isSupportVibratePhone()
            G_UIHelper.seekNodeByName(this.owner, "muteSwitchBtn").visible = G_PlatHelper.isSupportVibratePhone()
        }
    }

    _initSwitchBtn( switchBtn ) {
        switchBtn.setWitchState = function ( isOn ) {
            if (switchBtn._isOn !== isOn) {
                switchBtn._isOn = isOn

                if (isOn) {
                    switchBtn.skin = "game/popup/setting/on_btn.png"
                }
                else {
                    switchBtn.skin = "game/popup/setting/off_btn.png"
                }
            }
        }

        switchBtn.getWitchState = function () {
            return switchBtn._isOn
        }

        // default
        switchBtn.setWitchState(false)
    }

    onCloseTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn, function () {
            G_UIManager.hideUI("setting")
        }.bind(this))
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
    }

    onShareTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn)
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        
        // share
        G_Share.share(G_ShareScene.SS_SHARE_APP, null, false, function (bSucc) {
            // body...
            if (bSucc) {
                // succ
                console.log("share app succ...")
            }
        })
    }

    onSoundSwitchTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn)
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        
        if (G_SoundMgr.isSoundEnable()) {
            G_SoundMgr.setSoundEnable(false)
        }
        else {
            G_SoundMgr.setSoundEnable(true)
        }
        btn.setWitchState(G_SoundMgr.isSoundEnable())
    }

    onMuteSwitchTouched( btn ) {
        G_UIHelper.playBtnTouchAction(btn)
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        
        if (G_PlayerInfo.isMuteEnable()) {
            G_PlayerInfo.setMuteEnable(false)
        }
        else {
            G_PlayerInfo.setMuteEnable(true)
        }
        btn.setWitchState(G_PlayerInfo.isMuteEnable())
    }
}