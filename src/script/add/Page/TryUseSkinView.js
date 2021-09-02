
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class TryUseSkinView extends PageBase {

    constructor() {
        super();
        this.closeFun = null;
        this.showSkinId = null;
        this.adObj = new Object();
        this.adObj.num = 2;
        this.canClick = true;
        this.isNeedTween = true;

        this.succ = false;
    }

    pageInit() {
        super.pageInit();

        if (G_PlatHelper.isOVPlatform()) {
            this.adObj.num = 2;
        } else {
            this.adObj.num = -1;
        }

        this.viewProp.m_close.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TryUseSkinView);
            })
        })

        this.viewProp.m_try.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_try, () => {
                if (!this.canClick) {
                    return;
                }
                this.canClick = false;
                Tools.getIns().shareOrAd(this.viewProp.m_try, () => {
                    this.toUse();
                }, () => {
                    this.canClick = true;
                })
            })
        });

        this.viewProp.m_free_try.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_free_try, () => {
                if(!this.canClick){
                    return;
                }
                this.toUse();
            })
        })


        this.viewProp.m_hp_prop_list.renderHandler = new Laya.Handler(this, this.propRender);
        this.viewProp.m_hurt_prop_list.renderHandler = new Laya.Handler(this, this.propRender);
        this.viewProp.m_def_prop_list.renderHandler = new Laya.Handler(this, this.propRender);

        if (GameMgr.getIns().canshow3DImage()) {
            this.viewProp.m_skin.source = new Laya.Texture(MapMgr.getIns().cameraMgr.getModelCamera().renderTarget, Laya.Texture.DEF_UV);
        }

    }

    propRender(cell, index) {
        let data = cell.parent.parent.getItem(index);
        cell.value = data.pro;
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.viewProp.m_free_try.visible = false;
        this.viewProp.m_try.visible = false;
        //前两关免费试用皮肤
        if (GameMgr.getPlayerInfo().getShowLevelCount() <= 2) {
            this.viewProp.m_free_try.visible = true;
            this.showSkinId = 6;
        } else {
            this.viewProp.m_try.visible = true;
            this.showSkinId = vals.skinId;
        }

        GameMgr.getIns().trySkinId = null;
        this.succ = false;
        Tools.getIns().setAdBtnIcon(this.viewProp.m_try);
        
        this.closeFun = vals.closeFun;
        this.canClick = true;
        this.showData(this.showSkinId);
    }

    showData(skinId) {
        let playerConfig = G_GameDB.getPlayerConfigByID(skinId);
        let skinData = GameMgr.getPlayerInfo().getSkinDataById(skinId);

        this.viewProp.m_playerName.text = playerConfig.name;
        if (GameMgr.getIns().canshow3DImage()) {
            MapMgr.getIns().showUIModel(skinId);
        } else {
            this.viewProp.m_skin.skin = G_ResPath.skinPath.format(playerConfig.icon);
        }


        let viewData = StarMgr.getIns().getPropViewData(skinId, skinData.star);

        this.viewProp.m_hp_prop_list.repeatX = viewData.hpCount;
        this.viewProp.m_hp_prop_list.array = viewData.hpData;


        this.viewProp.m_hurt_prop_list.repeatX = viewData.hurtCount;
        this.viewProp.m_hurt_prop_list.array = viewData.hurtData;



        this.viewProp.m_def_prop_list.repeatX = viewData.defCount;
        this.viewProp.m_def_prop_list.array = viewData.defData;

    }

    toUse() {
        this.succ = true;
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TryUseSkinView);
    }

    pageClose() {
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun, this.succ,this.showSkinId);
        this.closeFun = null;
    }

}