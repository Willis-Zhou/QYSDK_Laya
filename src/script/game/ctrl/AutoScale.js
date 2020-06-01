export default class AutoScale extends Laya.Script {
    constructor() {
        super()

        /** @prop {name:miniScale, tips:"最小缩放比", type:Number, default:1.0}*/
        this.miniScale = 1.0;

        /** @prop {name:maxScale, tips:"最大缩放比", type:Number, default:1.1}*/
        this.maxScale = 1.1;

        /** @prop {name:duration, tips:"缩放耗时（毫秒）", type:Number, default:800}*/
        this.duration = 800;

        // private
        this._tween = null
    }

    onEnable() {
        let doScale = null
        doScale = () => {
            if (this.owner && !this.owner.destroyed) {
                if (this.owner.scaleX < this.maxScale) {
                    this._scaleToMax(doScale)
                }
                else {
                    this._scaleToMini(doScale)
                }
            }
        }

        // start
        doScale()
    }

    _scaleToMini( cb ) {
        // clear
        this._clearTween()

        if (this.owner && this.owner.scaleX > this.miniScale) {
            let realDuation = (this.owner.scaleX - this.miniScale) / (this.maxScale - this.miniScale) * this.duration

            // tween
            this._tween = Laya.Tween.to(this.owner, {scaleX: this.miniScale, scaleY: this.miniScale}, realDuation, null, Laya.Handler.create(null, () => {
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

    _scaleToMax( cb ) {
        // clear
        this._clearTween()

        if (this.owner && this.owner.scaleX < this.maxScale) {
            let realDuation = (this.maxScale - this.owner.scaleX) / (this.maxScale - this.miniScale) * this.duration

            // tween
            this._tween = Laya.Tween.to(this.owner, {scaleX: this.maxScale, scaleY: this.maxScale}, realDuation, null, Laya.Handler.create(null, () => {
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