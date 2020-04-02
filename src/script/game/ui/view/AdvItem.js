import ImageAnimation from "./ImageAnimation";

var TAG_OF_NEW = "New"
var TAG_OF_HOT = "Hot"
    
export default class AdvItem extends Laya.Box {
	constructor( index, cellSize, cfg ) {
        super()

        // privates
        this._index = index

        this._advID = 0
        this._advImgUrls = ""
        this._advTitle = ""
        this._advPath = ""
        this._effectType = "0"
        this._flagType = "0"
        this._itemCfg = cfg

        this._advImg = null
        this._advFrame = null
        this._advName = null

        // set size
        this.size(cellSize.width, cellSize.height)

        // init ui
        this._initUI(cellSize.width, cellSize.height)
    }

    _initUI( cellWidth, cellHeight ) {
        let originalSize = null

        if (this._itemCfg.imgWidth > 0 && this._itemCfg.imgHeight > 0) {
            originalSize = {width: this._itemCfg.imgWidth, height: this._itemCfg.imgHeight, iconNeedPos: this._itemCfg.iconNeedPos, iconPos: this._itemCfg.iconPos}
        }
        else {
            originalSize = {width: cellWidth, height: cellHeight, iconNeedPos: this._itemCfg.iconNeedPos, iconPos: this._itemCfg.iconPos}
        }

        let imgAnimation = new ImageAnimation(originalSize)

        if (imgAnimation) {
            imgAnimation.onSizeChanged(function () {
                if (imgAnimation.destroyed) {
                    return
                }

                if (originalSize.iconNeedPos) {
                    let datas = originalSize.iconPos.split("|");
                  
                    imgAnimation.pivotX = 0
                    imgAnimation.pivotY = 0
                    imgAnimation.x = Number.parseInt(datas[0])
                    imgAnimation.y = Number.parseInt(datas[1])
                    imgAnimation.scaleX = originalSize.width / imgAnimation.width
                    imgAnimation.scaleY = originalSize.height / imgAnimation.height

                } else {
                    imgAnimation.pivotX = imgAnimation.width / 2
                    imgAnimation.pivotY = imgAnimation.height / 2
                    imgAnimation.x = originalSize.width / 2
                    imgAnimation.y = originalSize.height / 2
                    imgAnimation.scaleX = originalSize.width / imgAnimation.width
                    imgAnimation.scaleY = originalSize.height / imgAnimation.height
                }
            })

            // add
            this.addChild(imgAnimation)

            // save
            this._advImg = imgAnimation

            // add tag
            this._addTagIntoImg(TAG_OF_NEW)
            this._addTagIntoImg(TAG_OF_HOT)
        }

        // add frame if needed
        if (typeof this._itemCfg.framePath === "string" && this._itemCfg.framePath !== "") {
            this._advFrame = new Laya.Image()
            if (this._itemCfg.framePathCount > 1) {
                let imgIndex = this._index % this._itemCfg.framePathCount
                if (imgIndex === 0) {
                    imgIndex = this._itemCfg.framePathCount
                }

                this._advFrame.skin = this._itemCfg.framePath.format(imgIndex.toString())
            }
            else {
                this._advFrame.skin = this._itemCfg.framePath
            }
            //this._advFrame.sizeGrid = "30,30,30,30"
            this._advFrame.width = cellWidth
            this._advFrame.height = cellHeight
            this._advFrame.pivotX = this._advFrame.width / 2
            this._advFrame.pivotY = this._advFrame.height / 2
            this._advFrame.x = this._advFrame.width / 2
            this._advFrame.y = this._advFrame.height / 2
            this.addChild(this._advFrame)
        }

        // add mask if needed
        if (this._itemCfg.needMask) {
            Laya.loader.load("ad/ad_mask.png", Laya.Handler.create(null, function () {
                let sMask = new Laya.Image()
                sMask.skin = "ad/ad_mask.png"
                sMask.sizeGrid = "30,30,30,30"
                sMask.width = this._advImg.width + 2
                sMask.height = this._advImg.height + 2
                sMask.pivotX = sMask.width / 2
                sMask.pivotY = sMask.height / 2
                sMask.x = sMask.width / 2
                sMask.y = sMask.height / 2
                this._advImg.mask = sMask
            }.bind(this)))
        }

        // add name if needed
        if (this._itemCfg.nameCfg !== "") {
            let attrs = this._itemCfg.nameCfg.split("||")

            this._advName = new Laya.Text()
            this._advName.fontSize = parseInt(attrs[0], 10)
            
            if(attrs.length>=3){
                this._advName.color=("#"+attrs[2]);
            }else{
                this._advName.color = "#ffffff"
            }
            
            this._advName.valign = "top"
            this._advName.height = parseInt(attrs[0], 10)

            if (this._itemCfg.nameNeedPos && this._itemCfg.namePos !== "") {
                //分拆namePos数据
                let datas = this._itemCfg.namePos.split("|")

                let align = Number.parseFloat(datas[2])
                this._advName.align = (align == 0.5 ? "center" : (align == 1 ? "right" : "left"))
                this._advName.width = cellWidth
                this._advName.pivotX = this._advName.width * align
                this._advName.pivotY = 0
                this._advName.x = parseInt(datas[0], 10)
                this._advName.y = parseInt(datas[1], 10)
            } else {
                this._advName.align = "center"
                this._advName.width = cellWidth
                this._advName.pivotX = this._advName.width / 2
                this._advName.pivotY = 0
                this._advName.x = cellWidth / 2
                this._advName.y = this._advImg.height + parseInt(attrs[1], 10)
            }

            this.addChild(this._advName)
        }
    }

    _addTagIntoImg( tag ) {
        let img = this._advImg
        if (img) {
            img["set" + tag + "TagStatu"] = function ( bShow ) {
                let attrName = "_is" + tag + "TagOnShow"
                img[attrName] = bShow
    
                let tagName = "_" + tag + "Tag"
                if (bShow) {
                    if (!img[tagName]) {
                        let tagImg = new Laya.Image()
                        if (tag === TAG_OF_NEW) {
                            tagImg.skin = this._itemCfg.newTagPath
                        }
                        else {
                            tagImg.skin = this._itemCfg.hotTagPath
                        }
        
                        if (img.getChildByName("tag")) {
                            tagImg.pivotX = 0
                            tagImg.pivotY = 0
                            tagImg.x = 0
                            tagImg.y = 0
        
                            // add
                            img.getChildByName("tag").addChild(tagImg)
                        }
                        else {
                            if (tagImg.skin.indexOf("2") !== -1) {
                                tagImg.pivotX = 0
                                tagImg.pivotY = 0
                                tagImg.x = 1.5
                                tagImg.y = 1.5
                            }
                            else {
                                tagImg.pivotX = tagImg.width
                                tagImg.pivotY = 0
                                tagImg.x = img.width - 1.5
                                tagImg.y = 1.5
                            }
        
                            // add
                            img.addChild(tagImg)
                        }
        
                        // save
                        img[tagName] = tagImg
                    }
    
                    img[tagName].visible = true
                }
                else {
                    if (img[tagName]) {
                        img[tagName].visible = false
                    }
                }
            }.bind(this)
    
            img["get" + tag + "TagStatu"] = function () {
                let attrName = "_is" + tag + "TagOnShow"
                return img[attrName]
            }
    
            // default
            img["set" + tag + "TagStatu"](false)
        }
    }

    _setSweepEffectStatu( bShow ) {
        let img = this._advImg
        if (img) {
            if (bShow) {
                if (!img._sweepImg) {
                    let sweepImg = new Laya.Image()
                    sweepImg.skin = this._itemCfg.sweepEffectPath
                    sweepImg.scaleY = (img.height - 2) / sweepImg.height
                    sweepImg.scaleX = sweepImg.scaleY
                    sweepImg.pivotX = 0
                    sweepImg.pivotY = sweepImg.height / 2
                    sweepImg.y = img.height / 2
    
                    // add
                    img.addChild(sweepImg)
    
                    // save
                    img._sweepImg = sweepImg
                }
    
                img._sweepImg.visible = true
                if (!img._tween) {
                    let doSweep = function ( delayTime ) {
                        // sweep
                        img._sweepImg.x = 0 - img._sweepImg.width * img._sweepImg.scaleX
    
                        img._tween = Laya.Tween.to(img._sweepImg, {x: img.width}, 1000, null, Laya.Handler.create(null, function () {
                            img._tween = null

                            // forever
                            doSweep(2000)
                        }), delayTime)
                    }
    
                    doSweep(0)
                }

                // auto add mask
                if (!img.mask) {
                    Laya.loader.load("ad/ad_mask.png", Laya.Handler.create(null, function () {
                        let sMask = new Laya.Image()
                        sMask.skin = "ad/ad_mask.png"
                        sMask.sizeGrid = "30,30,30,30"
                        sMask.width = img.width + 2
                        sMask.height = img.height + 2
                        sMask.pivotX = sMask.width / 2
                        sMask.pivotY = sMask.height / 2
                        sMask.x = sMask.width / 2
                        sMask.y = sMask.height / 2
                        img.mask = sMask
                    }.bind(this)))
                }
            }
            else {
                if (img._sweepImg) {
                    img._sweepImg.visible = false
                }
                
                if (img._tween) {
                    img._tween.clear()
                    img._tween = null
                }

                if (img.mask && !this._itemCfg.needMask) {
                    img.mask = null
                }
            }
        }
    }

    setAdvInfo( advID, advImgUrls, advTitle, advPath, effectType, flagType ) {
        if (this._advID !== advID
            || this._advImgUrls !== advImgUrls
            || this._advTitle !== advTitle
            || this._advPath !== advPath
            || this._effectType !== effectType
            || this._flagType !== flagType) {
            this._advID = advID
            this._advImgUrls = advImgUrls
            this._advTitle = advTitle
            this._advPath = advPath
            this._effectType = effectType
            this._flagType = flagType
            
            // set skin
            this._advImg.setImage(this._advImgUrls)

            // set title
            if (this._advName) {
                this._advName.text = this._advTitle
            }

            // tag
            this._advImg["set" + TAG_OF_NEW + "TagStatu"](this._flagType === "1")
            this._advImg["set" + TAG_OF_HOT + "TagStatu"](this._flagType === "2")

            // effect
            this._setSweepEffectStatu(this._effectType === "1")
        }
    }
}