export default class AutoShake extends Laya.Script {
    constructor() {
        super()

        /** @prop {name:gap, tips:"缩放耗时（毫秒）", type:Number, default:3000}*/
        this.gap = 3000;

        // private
        this._tween = null
        this._shakeTimes = 0
    }

    onEnable() {
        let doShake = null
        doShake = () => {
            if (this.owner && !this.owner.destroyed) {
                if (this._shakeTimes > 0 && this._shakeTimes % 2 === 0) {
                    this._shakeTimes = 0
                    this._shakeToMiddle(() => {
                        G_Scheduler.schedule("auto_shake_" + G_Utils.generateString(32), doShake, false, this.gap, 0)
                    })
                }
                else {
                    if (this.owner.rotation < 15) {
                        this._shakeTimes += 1
                        this._shakeToRight(doShake)
                    }
                    else {
                        this._shakeTimes += 1
                        this._shakeToLeft(doShake)
                    }
                }
            }
        }

        // start
        doShake()
    }

    _shakeToLeft( cb ) {
        // clear
        this._clearTween()

        if (this.owner && this.owner.rotation > -15) {
            let realDuation = (this.owner.rotation + 15) / 30 * 50

            // tween
            this._tween = Laya.Tween.to(this.owner, {rotation: -15}, realDuation, null, Laya.Handler.create(null, () => {
                this._tween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
        else {
            if (typeof cb === "function") {
                cb()
            }
        }
    }

    _shakeToRight( cb ) {
        // clear
        this._clearTween()

        if (this.owner && this.owner.rotation < 15) {
            let realDuation = (15 - this.owner.rotation) / 30 * 50

            // tween
            this._tween = Laya.Tween.to(this.owner, {rotation: 15}, realDuation, null, Laya.Handler.create(null, () => {
                this._tween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
        else {
            if (typeof cb === "function") {
                cb()
            }
        }
    }

    _shakeToMiddle( cb ) {
        // clear
        this._clearTween()

        if (this.owner && this.owner.rotation != 0) {
            let realDuation = Math.abs(this.owner.rotation) / 30 * 50

            // tween
            this._tween = Laya.Tween.to(this.owner, {rotation: 0}, realDuation, null, Laya.Handler.create(null, () => {
                this._tween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
        else {
            if (typeof cb === "function") {
                cb()
            }
        }
    }

    _clearTween() {
        if (this.owner && this._tween) {
            this._tween.clear()
            this._tween = null
        }
    }
}