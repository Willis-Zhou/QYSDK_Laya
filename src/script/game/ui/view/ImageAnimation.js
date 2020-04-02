export default class ImageAnimation extends Laya.Sprite {
    constructor( originalSize ) { 
        super()

        // properties
        this._originalSize = originalSize

        this._imgUrl = ""
        this._singleImgSize = null
        this._totalFrames = 0
        this._curentFrame = 0
        this._rowCount = 0
        this._colCount = 0
        this._offsetTexture = new Laya.Point()
        this._tag = ""

        // privates
        this._imgTexture = null

        // cbs
        this._onSizeChangedCb = null

        // set size
        this.size(originalSize.width, originalSize.height)
    }

    setImage( imgUrl ) {
        if (this._imgUrl !== imgUrl) {
            if (typeof imgUrl === "object") {
                let imgData = imgUrl

                // set img animation
                this._setImageAnimation(imgData.path, {width: imgData.width, height: imgData.height}, imgData.frame_count)
            }
            else {
                // set img
                this._setImg(imgUrl)
            }
        }
    }

    _setImg( imgUrl ) {
        this._imgUrl = imgUrl
        this._totalFrames = 1

        if (this._imgTexture !== null) {
            this._imgTexture = null
            this._singleImgSize = null
            this._totalFrames = 0
            this._curentFrame = 0
            this._rowCount = 0
            this._colCount = 0
            this._offsetTexture = new Laya.Point()
            this._endAnimate()
            this.graphics.clear(true)
        }

        let imgPath = ""

        if (typeof imgUrl === "string" && imgUrl !== "") {
            imgPath = imgUrl
        }
        else if (Array.isArray(imgUrl) && imgUrl.length > 0) {
            let randomIndex = G_Utils.random(0, imgUrl.length - 1)
            imgPath = imgUrl[randomIndex]
        }
        else {
            imgPath = "ad/default_ad.png"
        }

        this.loadImage(imgPath, Laya.Handler.create(this, function () {
            if (this._imgUrl !== imgUrl) {
                return
            }

            if (this.texture) {
                // if (this.width !== this.texture.width && this.height !== this.texture.height) {
                //     // reset size
                //     this.size(this.texture.width, this.texture.height)

                //     if (this._onSizeChangedCb) {
                //         this._onSizeChangedCb()
                //     }
                // }
                
                //修复可能显示不了广告图片的bug-20191219 by:hmok
                this.size(this.texture.width, this.texture.height)

                if (this._onSizeChangedCb) {
                    this._onSizeChangedCb()
                }
            }
        }.bind(this)))
    }

    _setImageAnimation( imgUrl, singleImgSize, totalFrames ) {
        if (totalFrames > 1) {
            this._imgUrl = imgUrl
            this._singleImgSize = singleImgSize
            this._totalFrames = totalFrames

            // set size
            this.size(singleImgSize.width, singleImgSize.height)

            if (this._onSizeChangedCb) {
                this._onSizeChangedCb()
            }

            this._loadImg(function () {
                if (imgUrl !== this._imgUrl) {
                    return
                }

                // clear texture if needed
                if (this.texture !== null) {
                    this.texture = null
                }

                if (this._imgTexture !== null) {
                    this._curentFrame = 0
                    this._rowCount = this._imgTexture.height / this._singleImgSize.height
                    this._colCount = this._imgTexture.width / this._singleImgSize.width

                    // start
                    this._startAnimate()
                }
            }.bind(this))
        }
        else {
            this._setImg(imgUrl)
        }
    }

    _loadImg( cb ) {
        if (typeof this._imgUrl === "string" && this._imgUrl !== "") {
            Laya.loader.load(this._imgUrl, Laya.Handler.create(this, function()
            {
                this._imgTexture = Laya.loader.getRes(this._imgUrl)

                if (typeof cb === "function") {
                    cb()
                }
            }.bind(this)))
        }
    }

    _updateFrame() {
        this._curentFrame += 1

        if (this._curentFrame > this._totalFrames) {
            this._curentFrame = 1
        }

        let offsetX = ((this._curentFrame - 1) % this._colCount) * this._singleImgSize.width
        let offsetY = Math.floor((this._curentFrame - 1) / this._colCount) * this._singleImgSize.height
        this._offsetTexture.x = -offsetX
        this._offsetTexture.y = -offsetY
        this.graphics.clear(true)
        this.graphics.fillTexture(this._imgTexture, 0, 0, this.width, this.height, "no-repeat", this._offsetTexture)
    }

    _startAnimate() {
        this._endAnimate()

        // new tag
        this._tag = G_Utils.generateString(32)

        G_Scheduler.schedule("Update_Image_Animation_" + this._tag, function () {
            // body...
            if (this._checkIsOnShow(this)) {
                this._updateFrame()
            }
        }.bind(this), false, 100)

        // first update
        this._updateFrame()
    }
    
    _endAnimate() {
        if (this._tag !== "") {
            G_Scheduler.unschedule("Update_Image_Animation_" + this._tag)
            this._tag = ""
        }
    }

    onSizeChanged( cb ) {
        if (typeof cb === "function") {
            this._onSizeChangedCb = cb
        }
    }

    offSizeChanged() {
        this._onSizeChangedCb = null
    }

    _checkIsOnShow( node ) {
        return (node === null) || (node && node.visible && this._checkIsOnShow(node.parent))
    }
}
