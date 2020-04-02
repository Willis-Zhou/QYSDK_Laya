export default class BaseUI extends Laya.Script {
    constructor() {
        super()

        this._rootNode = undefined;
        this._callbacks = {}

        this._openType = "none";
        this._closeType = "none";
    }

    showUI() {
        // show
        this.owner.visible = true

        // init
        if (arguments.length > 0) {
            this._onInit(...arguments)
        }
        else {
            this._onInit()
        }

        if (this._openType === "scale") {
            this._runScaleOpenAction(() => {
                // body...
                this._onShow()
            })
        }
        else if (this._openType === "fromLeft") {
            this._runFromLeftOpenAction(() => {
                // body...
                this._onShow()
            })
        }
        else if (this._openType === "fromBottom") {
            this._runFromBottomOpenAction(() => {
                // body...
                this._onShow()
            })
        }
        else if (this._openType === "opacity") {
            this._runOpacityOpenAction(() => {
                // body...
                this._onShow()
            })
        }
        else {
            this._onShow()
        }
    }

    hideUI() {
        if (this._closeType === "scale") {
            this._runScaleCloseAction(() => {
                // body...
                this._onHide()
            })
        }
        else if (this._closeType === "opacity") {
            this._runOpacityCloseAction(() => {
                // body...
                this._onHide()
            })
        }
        else {
            this._onHide()
        }
    }

    isOnShow() {
        return this.owner.visible
    }

    _onInit() {
        if (this._rootNode) {
            this._rootNode.pivotX = this._rootNode.width / 2
            this._rootNode.pivotY = this._rootNode.height / 2

            if (this._rootNode.parent) {
                this._rootNode.x = this._rootNode.parent.width / 2
                this._rootNode.y = this._rootNode.parent.height / 2
            }
            else {
                this._rootNode.x = Laya.stage.width / 2
                this._rootNode.y = Laya.stage.height / 2
            }

            this._rootNode.alpha = 1.0
        }

        if (typeof this.onInit === "function") {
            if (arguments.length > 0) {
                this.onInit(...arguments)
            }
            else {
                this.onInit()
            }
        }
    }

    _onShow() {
        if (this._rootNode && this._rootNode._baseTween) {
            this._rootNode._baseTween.clear()
            this._rootNode._baseTween = null
        }

        if (typeof this.onShow === "function") {
            this.onShow()
        }
    }

    _onHide() {
        if (typeof this.onHide === "function") {
            this.onHide()
        }

        // hide
        this.owner.visible = false

        // cb
        this.invokeCallback("close")
    }

    _runScaleOpenAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.scaleX = 0.8
            ui.scaleY = 0.8

            ui._baseTween = Laya.Tween.to(ui, {scaleX: 1.0, scaleY: 1.0}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    _runFromLeftOpenAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.x = Laya.stage.width / 3

            ui._baseTween = Laya.Tween.to(ui, {x: Laya.stage.width / 2}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    _runFromBottomOpenAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.y = Laya.stage.height / 4

            ui._baseTween = Laya.Tween.to(ui, {y: Laya.stage.height - ui.height}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    _runOpacityOpenAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.alpha = 0.0;

            ui._baseTween = Laya.Tween.to(ui, {alpha: 1.0}, 400, null, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    _runScaleCloseAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.scaleX = 1.0
            ui.scaleY = 1.0

            ui._baseTween = Laya.Tween.to(ui, {scaleX: 0.1, scaleY: 0.1}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    _runOpacityCloseAction( cb ) {
        if (this._rootNode) {
            let ui = this._rootNode

            if (ui._baseTween) {
                ui._baseTween.clear()
                ui._baseTween = null
            }

            ui.alpha = 1.0;

            ui._baseTween = Laya.Tween.to(ui, {alpha: 0.0}, 400, null, Laya.Handler.create(null, function () {
                ui._baseTween = null

                if (typeof cb === "function") {
                    cb()
                }
            }))
        }
    }

    registerCallback(key, cb) {
        // body...
        if (!this._checkString(key)) {
            return
        }

        if (typeof this._callbacks[key] === "undefined") {
            this._callbacks[key] = []
        }

        // add cb
        this._callbacks[key].push(cb)
    }

    unregisterCallback(key, cb) {
        // body...
        if (!this._checkString(key)) {
            return
        }

        if (typeof this._callbacks[key] !== "undefined") {
            if (!cb) {
                this._callbacks[key] = []
            }
            else {
                let cbs = this._callbacks[key]

                let targetIndex = cbs.indexOf(cb)
                if (targetIndex > -1) {
                    cbs.splice(targetIndex, 1)
                }
            }
        }
    }

    invokeCallback(key) {
        // body...
        if (!this._checkString(key)) {
            return
        }

        if (typeof this._callbacks[key] !== "undefined") {
            let cbs = [].concat(this._callbacks[key])

            // arguments
            let args = Array.prototype.slice.call(arguments)
            args.shift()

            // callback
            for (let i = 0; i < cbs.length; i++) {
                let cb = cbs[i]
                cb.apply(null, args)
            }
        }
    }

    _checkString(string) {
        // body...
        if (typeof string !== "string" || string === "") {
            return false
        }

        return true
    }
}