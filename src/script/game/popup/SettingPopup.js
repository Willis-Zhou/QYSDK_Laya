export default class SettingPopup extends Laya.Script {

    constructor() {
        super()

        // privates

        // cb
        this._closeCb = null
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
        }

        let soundSwitchBtn = G_UIHelper.seekNodeByName(this.owner, "soundSwitchBtn")
        if (soundSwitchBtn) {
            soundSwitchBtn.on("click", null, function () {
                this.onSoundSwitchTouched(soundSwitchBtn)
            }.bind(this))

            // init
            this._initSwitchBtn(soundSwitchBtn)
            soundSwitchBtn.setWitchState(G_PlayerInfo.isSoundEnable())
        }

        let muteSwitchBtn = G_UIHelper.seekNodeByName(this.owner, "muteSwitchBtn")
        if (muteSwitchBtn) {
            muteSwitchBtn.on("click", null, function () {
                this.onMuteSwitchTouched(muteSwitchBtn)
            }.bind(this))

            // init
            this._initSwitchBtn(muteSwitchBtn)
            muteSwitchBtn.setWitchState(G_PlayerInfo.isMuteEnable())
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
            this._doCloseCallback()
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
        
        if (G_PlayerInfo.isSoundEnable()) {
            G_PlayerInfo.setSoundEnable(false)
        }
        else {
            G_PlayerInfo.setSoundEnable(true)
        }
        btn.setWitchState(G_PlayerInfo.isSoundEnable())
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

    registerCloseCallback( cb ) {
        if (typeof cb === "function") {
            this._closeCb = cb
        }
    }

    _doCloseCallback() {
        if (this._closeCb) {
            this._closeCb()
        }
    }
}