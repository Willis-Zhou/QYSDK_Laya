import AdvItem from "./AdvItem";

export default class AdvList extends Laya.Script {

    constructor() {
        super()

        // privates
        this._inited = false
        this._selectCb = null
        this._isHorizontal = false
        this._cellSize = null
    }

    onEnable() {
        this._initUI()
    }

    _initUI() {
        this.owner.selectEnable = true
        this.owner.selectHandler = new Laya.Handler(this, this.onSelect)
        this.owner.renderHandler = new Laya.Handler(this, this.updateItem)
    }

    updateItem(cell, index) {
        let advInfo = cell.dataSource
        cell.setAdvInfo(advInfo.adv_id, advInfo.logo_url, advInfo.title, advInfo.path, advInfo.effect_type, advInfo.flag_type)
	}

	onSelect(index) {
        G_SoundMgr.playSound(G_SoundName.SN_CLICK)

        let cell = this.owner.selection
        let advInfo = cell.dataSource

        // cb
        this._doSelectCallback(advInfo, function (nextAdvInfo) {
            if (nextAdvInfo) {
                // change cell
                this.owner.setItem(this.owner.selectedIndex, nextAdvInfo)
            }
        }.bind(this))
    }
    
    registerSelectCallback( cb ) {
        if (typeof cb === "function") {
            this._selectCb = cb
        }
    }

    _doSelectCallback( advInfo, touchCb ) {
        if (this._selectCb) {
            this._selectCb(advInfo, touchCb)
        }
    }

    setList( isHorizontal, cellSize, cfg, list ) {
        if (!this._inited) {
            this._inited = true
            this._isHorizontal = isHorizontal
            this._cellSize = cellSize

            if (Array.isArray(list) && list.length > 0) {
                let index = 0

                this.owner.itemRender = function () {
                    index += 1
                    return new AdvItem(index, cellSize, cfg)
                }

                if (this._isHorizontal) {
                    this.owner.repeatX = Math.ceil(list.length / this.owner.repeatY)
                    this.owner.hScrollBarSkin = ""
                }
                else {
                    this.owner.repeatY = Math.ceil(list.length / this.owner.repeatX)
                    this.owner.vScrollBarSkin = ""
                }
            }
        }
        
        this.owner.array = list
    }
}