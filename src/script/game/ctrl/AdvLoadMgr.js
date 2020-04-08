import AdvList from "../ui/view/AdvList";
import ImageAnimation from "../ui/view/ImageAnimation";

var TAG_OF_NEW = "New"
var TAG_OF_HOT = "Hot"

export default class AdvLoadMgr extends Laya.Script {
    constructor() {
        super()

        /** @prop {name:advType, tips:"展示类型，btn代表是按钮，list代表是列表", type:Option, option:"btn,list", default:"btn"}*/
        this.advType = "btn";

        /** @prop {name:newTagPath, tips:"new标签图片地址", type:String, default:"ad/new_tag.png"}*/
        this.newTagPath = "ad/new_tag.png";

        /** @prop {name:hotTagPath, tips:"hot标签图片地址", type:String, default:"ad/hot_tag.png"}*/
        this.hotTagPath = "ad/hot_tag.png";

        /** @prop {name:sweepEffectPath, tips:"扫光图片地址", type:String, default:"ad/sweep_effect.png"}*/
        this.sweepEffectPath = "ad/sweep_effect.png";

        /** @prop {name:needMask, tips:"是否无扫光也启动边角弧形遮罩", type:Bool, default:false}*/
        this.needMask = false;

        /** @prop {name:nameCfg, tips:"小程序的名称的配置，格式为：字体大小||与图片的间隔||(文字颜色代码不要#号-By:Hmok)，当advType为list有效", type:String, default:""}*/
        this.nameCfg = "";

        /** @prop {name:framePath, tips:"外框图片地址，当advType为list有效", type:String, default:""}*/
        this.framePath = "";

        /** @prop {name:framePathCount, tips:"外框图片资源数量，当advType为list有效", type:Number, default:1}*/
        this.framePathCount = 1;

        /** @prop {name:isHorizontal, tips:"是否水平滚动，当advType为list有效", type:Bool, default:false}*/
        this.isHorizontal = false;

        /** @prop {name:maxOnShowCells, tips:"屏幕内可显示的最大单元数，当advType为list有效", type:Number, default:0}*/
        this.maxOnShowCells = 0

        /** @prop {name:cellWidth, tips:"单元的宽度，当advType为list有效", type:Number, default:0}*/
        this.cellWidth = 0

        /** @prop {name:cellHeight, tips:"单元的高度，当advType为list有效", type:Number, default:0}*/
        this.cellHeight = 0

        /** @prop {name:imgWidth, tips:"单元中图片的宽度，当advType为list有效", type:Number, default:0}*/
        this.imgWidth = 0

        /** @prop {name:imgHeight, tips:"单元中图片的高度，当advType为list有效", type:Number, default:0}*/
        this.imgHeight = 0

        /** @prop {name:isTween, tips:"是否缓动，开启后自动滚动展示所有的广告，当advType为list有效", type:Bool, default:false}*/
        this.isTween = false;

        /** @prop {name:tweenSpeed, tips:"缓动速度，滚动一格消耗的时间（毫秒），速度越大越慢，当advType为list，且isTween为true有效", type:Number, default:1000}*/
        this.tweenSpeed = 1000;

        /** @prop {name:autoExtend, tips:"是否自动扩展，开启后根据适配自动扩展滚动条长度，当advType为list和isHorizontal为false有效", type:Bool, default:false}*/
        this.autoExtend = false;

        /** @prop {name:advCount, tips:"当advType为btn时，表示广告节点数量，每个广告节点的命名为'adv_索引'，当advType为list时，表示最大广告数量", type:Number, default:0}*/
        this.advCount = 0;

        /** @prop {name:delayToLoad, tips:"延迟加载的毫秒数", type:Number, default:0}*/
        this.delayToLoad = 0;

        /** @prop {name:advKey, tips:"后羿系统中的广告位置中生成，是32位数字与字母组成的字符串，该位置对应运营上线的广告列表", type:String, default:""}*/
        this.advKey = "";

        /** @prop {name:nameNeedPos, tips:"游戏名称显示的位置是否需要特殊定位", type:Bool, default:false}*/
        this.nameNeedPos = false;

        /** @prop {name:namePos, tips:"游戏名称显示的定位,定位方式:x坐标|y坐标|文字对齐方式0-左对齐,0.5中间对齐,1右对齐,锚点亦会按照此设置,文字框宽度固定为400", type:String, default:"0|0|0"}*/
        this.namePos = "0|0|0";

        /** @prop {name:iconNeedPos, tips:"游戏ICon是否需要特殊定位", type:Bool, default:false}*/
        this.iconNeedPos = false;

        /** @prop {name:iconPos, tips:"游戏ICon的定位,x坐标|y坐标", type:String, default:"0|0"}*/
        this.iconPos = "0|0";

        // privates
        this._advList = null
        this._advBtns = []
        this._originalAdvInfos = null
        this._advInfos = null
        this._onShowAdvImgs = []
    }

    onEnable() {
        // init
        this._initUI()

        G_Scheduler.schedule("Delay_To_Load_Ad_" + this.advKey, function () {
            // init from data
            let _advKey = G_ADCfg[this.advKey]
            if (typeof _advKey === "string" && _advKey !== "") {
                console.log("start load ad, key:", _advKey)
            }
            else {
                console.error("fail to load ad, tag:", this.advKey)
                return
            }

            let onGotDatas = function (res) {
                if (res && res.ret && res[_advKey]) {
                    // adv infos
                    let advInfos = res[_advKey]

                    // adv count
                    if (!this.autoExtend && this.advType === "list") {
                        if (typeof res.Count !== "undefined" && res.Count[_advKey] !== 0) {
                            this.advCount = parseInt(res.Count[_advKey], 10) 
                        }
                    }

                    // log
                    console.log("adv: ", this.advKey, ", count: ", this.advCount)

                    // save
                    this._originalAdvInfos = advInfos

                    // refresh
                    this._refreshAdv()
                }
            }.bind(this)

            if(Laya.Browser.onPC) {
                _advKey = "ee2a98b3ba79d62950534db9641ee913"

                G_HttpHelper.getJson("https://image.game.hnquyou.com/upload/opId10.txt", function(succ, res) {
                    if (succ) {
                        onGotDatas(res) 
                    }
                })
            }
            else {
                let arr = [_advKey]
                G_ADVMgr.getIconButtons(arr, function (res) {
                    console.log(res)
                    onGotDatas(res)
                }.bind(this))
            }
        }.bind(this), false, this.delayToLoad, 0)
    }

    _initUI() {
        if (this.advType === "btn") {
            for (let adIndex = 1; adIndex <= this.advCount; adIndex++) {
                let nodeName = "adv_" + adIndex.toString()
                let btn = G_UIHelper.seekNodeByName(this.owner, nodeName)
                if (btn) {
                    // add img
                    let originalSize = null

                    let icon = G_UIHelper.seekNodeByName(btn, "icon")
                    if (icon) {
                        originalSize = {width: icon.width, height: icon.height}
                    }
                    else {
                        originalSize = {width: btn.width, height: btn.height}
                    }

                    let imgAnimation = new ImageAnimation(originalSize)

                    if (imgAnimation) {
                        imgAnimation.onSizeChanged(function () {
                            if (imgAnimation.destroyed) {
                                return
                            }

                            imgAnimation.pivotX = imgAnimation.width / 2
                            imgAnimation.pivotY = imgAnimation.height / 2
                            imgAnimation.x = originalSize.width / 2
                            imgAnimation.y = originalSize.height / 2
                            imgAnimation.scaleX = originalSize.width / imgAnimation.width
                            imgAnimation.scaleY = originalSize.height / imgAnimation.height
                        })
            
                        // add
                        if (icon) {
                            icon.addChild(imgAnimation)
                        }
                        else {
                            btn.addChild(imgAnimation)
                        }
            
                        // save
                        btn._advImg = imgAnimation
                    }

                    // add tag
                    this._addTagIntoBtn(btn, TAG_OF_NEW)
                    this._addTagIntoBtn(btn, TAG_OF_HOT)

                    // add mask
                    if (this.needMask) {
                        Laya.loader.load("ad/ad_mask.png", Laya.Handler.create(null, function () {
                            let sMask = new Laya.Image()
                            sMask.skin = "ad/ad_mask.png"
                            sMask.sizeGrid = "30,30,30,30"
                            sMask.width = btn.width
                            sMask.height = btn.height
                            btn.mask = sMask
                        }))
                    }
					btn.offAll("click")
                    btn.on("click", null, function () {
                        this.onAdvTouched(btn)
                    }.bind(this))
    
                    btn.registerAdvInfo = function( advInfo ) {
                        if (btn.destroyed) {
                            return
                        }

                        if (advInfo) {
                            btn._advInfo = advInfo

                            if (btn._advImg) {
                                btn._advImg.setImage(advInfo.logo_url)
                            }
                            
                            let name =  G_UIHelper.seekNodeByName(btn, "name")
                            if (name) {
                                name.text = advInfo.title
                            }

                            // tag
                            btn["set" + TAG_OF_NEW + "TagStatu"](advInfo.flag_type === "1")
                            btn["set" + TAG_OF_HOT + "TagStatu"](advInfo.flag_type === "2")

                            // effect
                            this._setSweepEffectStatu(btn, advInfo.effect_type === "1")
                        }
                    }.bind(this)
    
                    // default
                    btn._advInfo = null
    
                    // save
                    this._advBtns.push(btn)
                }
            }
        }
        else if (this.advType === "list") {
            let extendTimes = 0
            let designHeight = Laya.stage.designHeight

            if (this.autoExtend && !this.isHorizontal) {
                if (Laya.stage.height - designHeight > this.cellHeight) {
                    extendTimes = Math.floor((Laya.stage.height - designHeight) / this.cellHeight)
                }

                console.log("extendTimes: ", extendTimes)
            }

            let list = G_UIHelper.seekNodeByName(this.owner, "list")

            if (list) {
                // save
                this._advList = list

                if (extendTimes > 0) {
                    this.maxOnShowCells += (list.repeatX * extendTimes)
                    this.advCount += (list.repeatX * extendTimes)
                    this.owner.height += (Laya.stage.height - designHeight)
                    list.height += (Laya.stage.height - designHeight)
                }

                let advList = list.addComponent(AdvList)
                advList.registerSelectCallback(function ( advInfo, cb ) {
                    if (advInfo) {
                        this._toMiniProgram(advInfo, function ( bSucc ) {
                            let nextAdvInfo = this._getNextAdvInfo(advInfo.adv_id)

                            if (nextAdvInfo !== null) {
                                this._removeOnShowAdvImg(advInfo.logo_url)
                                this._addOnShowAdvImg(nextAdvInfo.logo_url)
                            }

                            if (typeof cb === "function") {
                                cb(nextAdvInfo)
                            }

                            if (!bSucc) {
                                G_Event.dispatchEvent(G_EventName.EN_CANCEL_NAVIGATION_FROM_AD, this.advKey)
                            }
                        }.bind(this))
                    }
                }.bind(this))
            }
        }

        if (this.isTween) {
            let doTween = null

            doTween = function () {
                if (!this._advList || this._advList.destroyed) {
                    return
                }

                let startIndex = this._advList.startIndex
                let maxIndexID = this._getMaxScrollIndex()
                let endIndex = maxIndexID
                let realEndIndex = endIndex
                let duration = 0

                if (startIndex < maxIndexID) {
                    endIndex = maxIndexID

                    if (this.isHorizontal) {
                        realEndIndex = endIndex + this._advList.repeatY
                    }
                    else {
                        realEndIndex = endIndex + this._advList.repeatX
                    }
                }
                else {
                    endIndex = 0
                    realEndIndex = 0
                }

                if (this.isHorizontal) {
                    duration = this._getScrollDuration(Math.floor(startIndex / this._advList.repeatY), Math.floor(endIndex / this._advList.repeatY))
                }
                else {
                    duration = this._getScrollDuration(Math.floor(startIndex / this._advList.repeatX), Math.floor(endIndex / this._advList.repeatX))
                }

                // tween
                this._advList.tweenTo(realEndIndex, duration)

                // schedule
				G_Scheduler.unschedule("Next_Tween_of_Ad_" + this.advKey)
                G_Scheduler.schedule("Next_Tween_of_Ad_" + this.advKey, function () {
                    doTween()
                }, false, duration + 2000)
            }.bind(this)

			G_Scheduler.unschedule("Auto_Start_Tween_Show_Of_Ad_" + this.advKey)
            G_Scheduler.schedule("Auto_Start_Tween_Show_Of_Ad_" + this.advKey, function () {
                if (this._advList && this._advList.length > 0) {
                    G_Scheduler.unschedule("Auto_Start_Tween_Show_Of_Ad_" + this.advKey)

                    if (this._getMaxScrollIndex() - this._advList.startIndex > 0) {
                        // start first tween
                        doTween()
                    }
                }
            }.bind(this), true)
        }
    }

    refreshAdv() {
        console.log("refresh adv: ", this.advKey)
        this._refreshAdv()
    }

    randomNavigate( cb ) {
        if (!this._originalAdvInfos) {
            if (typeof cb === "function") {
                cb(false, false)
                return
            }
        }

        let advInfos = this._convertToLocalAdvInfos(this._originalAdvInfos)
        let randomIndex = G_Utils.random(0, advInfos.length - 1)
        let advInfo = advInfos[randomIndex]

        this._toMiniProgram(advInfo, bSucc => {
            if (typeof cb === "function") {
                cb(true, bSucc)
            }
        })
    }

    _refreshAdv() {
        if (!this._originalAdvInfos) {
            return
        }

        this._onShowAdvImgs = []
        this._advInfos = this._convertToLocalAdvInfos(this._originalAdvInfos)

        if (Array.isArray(this._advInfos)) {
            if (this.advType === "btn") {
                for (let index = 0; index < this._advInfos.length; index++) {
                    if (index >= this.advCount) {
                        break
                    }

                    let advInfo = this._advInfos[index]
                    let btn = this._advBtns[index]
                    this._addOnShowAdvImg(advInfo.logo_url)
                    if(btn&&btn.registerAdvInfo){
                        btn.registerAdvInfo(advInfo)
                    }
                    
                }
            }
            else if (this.advType === "list") {
                let advList = this._advList.getComponent(AdvList)
                if (advList) {
                    let cloneAdvInfos = []

                    for (let index = 0; index < this._advInfos.length; index++) {
                        if (index >= this.advCount) {
                            break
                        }

                        this._addOnShowAdvImg(this._advInfos[index].logo_url)
                        cloneAdvInfos.push(this._advInfos[index])
                    }

                    advList.setList(this.isHorizontal
                        , {
                            width: this.cellWidth,
                            height: this.cellHeight
                        }, {
                            imgWidth: this.imgWidth,
                            imgHeight: this.imgHeight,
                            nameCfg: this.nameCfg,
                            needMask: this.needMask,
                            newTagPath: this.newTagPath,
                            hotTagPath: this.hotTagPath,
                            sweepEffectPath: this.sweepEffectPath,
                            framePath: this.framePath,
                            framePathCount: this.framePathCount,
                            nameNeedPos: this.nameNeedPos,
                            namePos: this.namePos,
                            iconNeedPos: this.iconNeedPos,
                            iconPos: this.iconPos
                        }, cloneAdvInfos)
                }
            }
        }
    }

    onAdvTouched( btn ) {
        if (btn._advInfo) {
            let touchCb = function ( bSucc ) {
                let nextAdvInfo = this._getNextAdvInfo(btn._advInfo.adv_id)

                if (nextAdvInfo !== null) {
                    this._removeOnShowAdvImg(btn._advInfo.logo_url)
                    this._addOnShowAdvImg(nextAdvInfo.logo_url)

                    btn.registerAdvInfo(nextAdvInfo)
                }

                if (!bSucc) {
                    G_Event.dispatchEvent(G_EventName.EN_CANCEL_NAVIGATION_FROM_AD, this.advKey)
                }
            }.bind(this)

            this._toMiniProgram(btn._advInfo, touchCb)
        }
        else {
            G_Event.dispatchEvent(G_EventName.EN_CANCEL_NAVIGATION_FROM_AD, this.advKey)
        }
    }

    _toMiniProgram( advInfo, touchCb ) {
        if (!G_PlatHelper.getPlat()) {
            if (typeof touchCb === "function") {
                touchCb(false)
            }
            return
        }

        if (advInfo) {
            G_Reportor.report(G_ReportEventName.REN_NAVIGATION_TO_MINIPROGRAM)

            let toMin = {
                adv_id: advInfo.adv_id,
                appId: advInfo.appid,
                pkgName: advInfo.appid,
                path: advInfo.path,
            }

            toMin.success = function () {
                G_Reportor.report(G_ReportEventName.REN_NAVIGATION_TO_MINIPROGRAM_SUCCESS)

                if (typeof touchCb === "function") {
                    touchCb(true)
                }
            }

            toMin.fail = function ( err ) {
                if (err && err.errMsg.indexOf("fail cancel") !== -1) {
                    G_Reportor.report(G_ReportEventName.REN_NAVIGATION_TO_MINIPROGRAM_CANCEL)
                }
                else {
                    G_Reportor.report(G_ReportEventName.REN_NAVIGATION_TO_MINIPROGRAM_ERROR)
                }

                if (typeof touchCb === "function") {
                    touchCb(false)
                }
            }


            if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().h_ToMinProgram) {
                G_PlatHelper.getPlat().h_ToMinProgram(toMin)
            }
        }
    }

    _getMaxScrollIndex() {
        if (this._advList) {
            let maxScrollIndexID = this._advList.length
            if (this.isHorizontal) {
                maxScrollIndexID = Math.ceil(this._advList.length / this._advList.repeatY) - Math.ceil(this.maxOnShowCells / this._advList.repeatY)
                maxScrollIndexID = maxScrollIndexID * this._advList.repeatY
            }
            else {
                maxScrollIndexID = Math.ceil(this._advList.length / this._advList.repeatX) - Math.ceil(this.maxOnShowCells / this._advList.repeatX)
                maxScrollIndexID = maxScrollIndexID * this._advList.repeatX
            }

            return maxScrollIndexID
        }
        else {
            return 0
        }
    }

    _getScrollDuration( start, end ) {
        return Math.abs(end - start) * this.tweenSpeed
    }

    _getNextAdvInfo( curAdvID ) {
        if (this._advInfos && this._advInfos.length > this.advCount) {
            let backupAdvInfos = []

            for (let i = 0; i < this._advInfos.length; i++) {
                let logoUrl = this._advInfos[i].logo_url
                if (this._onShowAdvImgs.indexOf(logoUrl) === -1) {
                    backupAdvInfos.push(this._advInfos[i])
                }
            }

            if (backupAdvInfos.length > 0) {
                let randomIndex = G_Utils.random(0, backupAdvInfos.length - 1)
                let nextAdvInfo = backupAdvInfos[randomIndex]

                return nextAdvInfo
            }
            else {
                console.error(this._onShowAdvImgs)
                console.error(this._advInfos)
            }
        }

        return null
    }

    _addOnShowAdvImg( logoUrl ) {
        if (this._onShowAdvImgs.indexOf(logoUrl) === -1) {
            this._onShowAdvImgs.push(logoUrl)
        }
    }

    _removeOnShowAdvImg( logoUrl ) {
        let foundIndex = this._onShowAdvImgs.indexOf(logoUrl)
        if (foundIndex !== -1) {
            this._onShowAdvImgs.splice(foundIndex, 1)
        }
    }

    _convertToLocalAdvInfos( advInfos ) {
        let localAdvInfos = []
        let backupAdvInfos = []

        if (Array.isArray(advInfos)) {
            for (let i = 0; i < advInfos.length; i++) {
                let advInfo = advInfos[i]

                if (Array.isArray(advInfo.logo_attr)) {
                    let randomIndex = G_Utils.random(0, advInfo.logo_attr.length - 1)

                    for (let j = 0; j < advInfo.logo_attr.length; j++) {
                        let cloneAdvInfo = G_Utils.cloneDeep(advInfo)
                        let each = advInfo.logo_attr[j]
                        if (each && typeof each === "object") {
                            cloneAdvInfo.logo_url = G_Utils.cloneDeep(each)
                        }
                        else {
                            cloneAdvInfo.logo_url = each
                        }

                        if (j === randomIndex) {
                            localAdvInfos.push(cloneAdvInfo)
                        }
                        else {
                            backupAdvInfos.push(cloneAdvInfo)
                        }
                    }
                }
                else {
                    if (typeof advInfo.logo_url === "string") {
                        localAdvInfos.push(advInfo)
                    }
                    else if (Array.isArray(advInfo.logo_url)) {
                        let randomIndex = G_Utils.random(0, advInfo.logo_url.length - 1)
    
                        for (let j = 0; j < advInfo.logo_url.length; j++) {
                            let cloneAdvInfo = G_Utils.cloneDeep(advInfo)
                            let each = advInfo.logo_url[j]
                            if (each && typeof each === "object") {
                                cloneAdvInfo.logo_url = G_Utils.cloneDeep(each)
                            }
                            else {
                                cloneAdvInfo.logo_url = each
                            }
    
                            if (j === randomIndex) {
                                localAdvInfos.push(cloneAdvInfo)
                            }
                            else {
                                backupAdvInfos.push(cloneAdvInfo)
                            }
                        }
                    }
                }
            }
        }

        G_Utils.shuffleArray(localAdvInfos)

        if (backupAdvInfos.length > 0) {
            G_Utils.shuffleArray(backupAdvInfos)
            localAdvInfos = localAdvInfos.concat(backupAdvInfos)
        }
        
        return localAdvInfos
    }

    _addTagIntoBtn( btn, tag ) {
        if (btn) {
            btn["set" + tag + "TagStatu"] = function ( bShow ) {
                let attrName = "_is" + tag + "TagOnShow"
                btn[attrName] = bShow

                let tagName = "_" + tag + "Tag"
                if (bShow) {
                    if (!btn[tagName]) {
                        let tagImg = new Laya.Image()
                        if (tag === TAG_OF_NEW) {
                            tagImg.skin = this.newTagPath
                        }
                        else {
                            tagImg.skin = this.hotTagPath
                        }
    
                        if (btn.getChildByName("tag")) {
                            tagImg.pivotX = 0
                            tagImg.pivotY = 0
                            tagImg.x = 0
                            tagImg.y = 0
    
                            // add
                            btn.getChildByName("tag").addChild(tagImg)
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
                                tagImg.x = btn.width - 1.5
                                tagImg.y = 1.5
                            }
    
                            // add
                            btn.addChild(tagImg)
                        }
    
                        // save
                        btn[tagName] = tagImg
                    }

                    btn[tagName].visible = true
                }
                else {
                    if (btn[tagName]) {
                        btn[tagName].visible = false
                    }
                }
            }.bind(this)

            btn["get" + tag + "TagStatu"] = function () {
                let attrName = "_is" + tag + "TagOnShow"
                return btn[attrName]
            }.bind(this)

            // default
            btn["set" + tag + "TagStatu"](false)
        }
    }

    _setSweepEffectStatu( btn, bShow ) {
        if (btn) {
            if (bShow) {
                if (!btn._sweepImg) {
                    let sweepImg = new Laya.Image()
                    sweepImg.skin = this.sweepEffectPath
                    sweepImg.scaleY = btn.height / sweepImg.height
                    sweepImg.scaleX = sweepImg.scaleY
                    sweepImg.pivotX = 0
                    sweepImg.pivotY = 0

                    // add
                    btn.addChild(sweepImg)

                    // save
                    btn._sweepImg = sweepImg
                }

                btn._sweepImg.visible = true
                if (!btn._tween) {
                    let doSweep = function ( delayTime ) {
                        // sweep
                        btn._sweepImg.x = 0 - btn._sweepImg.width * btn._sweepImg.scaleX
    
                        btn._tween = Laya.Tween.to(btn._sweepImg, {x: btn.width}, 1000, null, Laya.Handler.create(null, function () {
                            btn._tween = null
    
                            // forever
                            doSweep(2000)
                        }), delayTime)
                    }
    
                    doSweep(0)
                }

                // auto add mask
                if (!btn.mask) {
                    Laya.loader.load("ad/ad_mask.png", Laya.Handler.create(null, function () {
                        let sMask = new Laya.Image()
                        sMask.skin = "ad/ad_mask.png"
                        sMask.sizeGrid = "30,30,30,30"
                        sMask.width = btn.width
                        sMask.height = btn.height
                        btn.mask = sMask
                    }.bind(this)))
                }
            }
            else {
                if (btn._sweepImg) {
                    btn._sweepImg.visible = false
                }
                
                if (btn._tween) {
                    btn._tween.clear()
                    btn._tween = null
                }

                if (btn.mask && !this.needMask) {
                    btn.mask = null
                }
            }
        }
    }
}