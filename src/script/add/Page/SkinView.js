import NativeInsert from "../gameMgr/NativeInsert";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import TTSumbitData from "../Mgr/TTSumbitData";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class SkinView extends PageBase {

    constructor() {
        super();
        this.adObj = new Object();
        this.adObj.num = 2;

        this.isShowTop = true;
        this.maxSkinId = 0;
        this.curSkinId = 0;
        this.rightTween = new ContinuousTweenMgr();
        let vals = [];
        vals.push({ time: 800, prop: { right: -500 }, ease: Laya.Ease.quintOut });
        vals.push({ time: 800, prop: { right: 0 }, ease: Laya.Ease.quintOut });
        this.rightTween.setTweenVals(vals);

        this.nameTween = new ContinuousTweenMgr();
        let vals1 = [];
        vals1.push({ time: 500, prop: { right: -500 }, ease: Laya.Ease.quintOut });
        vals1.push({ time: 500, prop: { right: 143 }, ease: Laya.Ease.quintOut });
        this.nameTween.setTweenVals(vals1);

        this.carTween = new ContinuousTweenMgr();
        let vals2 = [];
        vals2.push({ time: 500, prop: { left: -400 }, ease: Laya.Ease.quintOut });
        vals2.push({ time: 500, prop: { left: 0 }, ease: Laya.Ease.quintOut });
        this.carTween.setTweenVals(vals2);
    }

    pageInit() {
        super.pageInit();
        this.m_oppo_native=this.viewProp.m_oppo_native.getComponent(NativeInsert);
        this.m_oppo_native.init();
        this.m_oppo_native.refershNative();
        if (G_PlatHelper.isOPPOPlatform()) {
            this.adObj.num = -1;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.adObj.num = 2;
        } else {
            this.adObj.num = -1;
        }

        this.viewProp.m_close.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
                GameMgr.getUIMgr().closeUI(this.pageName);
            })
        });


        this.viewProp.m_left_array.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_left_array, () => {
                this.leftClick();
            })
        });

        this.viewProp.m_right_array.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_right_array, () => {
                this.rightClick();
            })
        });

        this.viewProp.m_ad_buy.on(Laya.Event.CLICK, null, () => {
            this.toBuy(this.viewProp.m_ad_buy, 6);
        });

        this.viewProp.m_diam_buy.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_diam_buy, () => {
                this.toBuy(this.viewProp.m_diam_buy, 1);
            })
        });

        this.viewProp.m_equipUp.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_equipUp, () => {
                this.toEquip();
            })
        });

        this.viewProp.m_UpStar_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_UpStar_btn, () => {
                this.toUpStar();
            })
        });
        this.carTween.setTarget(this.viewProp.m_left);
        this.rightTween.setTarget(this.viewProp.m_right);
        this.nameTween.setTarget(this.viewProp.m_carName_bg);
        this.carTween.setEndCallBack(() => {
            this.viewProp.m_left_array.visible = true;
            this.viewProp.m_right_array.visible = true;
        })
        this.viewProp.m_hp_prop_list.renderHandler = new Laya.Handler(this, this.propRender);
        this.viewProp.m_hurt_prop_list.renderHandler = new Laya.Handler(this, this.propRender);
        this.viewProp.m_def_prop_list.renderHandler = new Laya.Handler(this, this.propRender);
        this.viewProp.m_star.renderHandler = new Laya.Handler(this, this.starRender);
        if (GameMgr.getIns().canshow3DImage()) {
            this.viewProp.m_skin_icon.source = new Laya.Texture(MapMgr.getIns().cameraMgr.getModelCamera().renderTarget, Laya.Texture.DEF_UV);
        }



        //视频按钮先不显示
        this.viewProp.m_ad_buy.visible = false;
        //this.viewProp.m_diam_buy.centerX = 0;
    }


    pageOpen(vals) {
        super.pageOpen(vals);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_ad_buy);
        this.maxSkinId = G_GameDB.getAllPlayerConfigCount();
        this.curSkinId = GameMgr.getPlayerInfo().getSkinId();
        this.refershPlayer(this.curSkinId);
        this.refershNative();
    }

    // showAdCallBack() {
    //     super.showAdCallBack();
    //     PlatAction.getIns().createTwoCustomAd();
    // }

    pageOpenTweenOver() {
        super.pageOpenTweenOver();

        this.rightTween.end();
        this.rightTween.play();
        this.nameTween.end();
        this.nameTween.play();
        this.carTween.end();
        this.viewProp.m_left_array.visible = false;
        this.viewProp.m_right_array.visible = false;
        this.carTween.play();
    }

    hightPageClose(pageName) {
        super.hightPageClose(pageName);
        if (pageName == GameMgr.getUIName().GetGoldView || pageName == GameMgr.getUIName().GetDiamView) {
            this.refershBtn(G_GameDB.getPlayerConfigByID(this.curSkinId));
        }
    }

    leftClick() {
        this.curSkinId--;
        if (this.curSkinId <= 0) {
            this.curSkinId = this.maxSkinId;
        }

        this.refershPlayer(this.curSkinId);

    }

    rightClick() {
        this.curSkinId++;
        if (this.curSkinId > this.maxSkinId) {
            this.curSkinId = 1;
        }

        this.refershPlayer(this.curSkinId);
    }

    refershNative() {
        this.m_oppo_native.hideUI()
        if(G_PlatHelper.isOPPOPlatform()){
            this.m_oppo_native.showUI();
        }
    }


    hightPageClose(pageName){
        super.hightPageClose(pageName);
        if(pageName==GameMgr.getUIName().GetDiamView){
            this.refershPlayer(this.curSkinId);
        }
    }

    /**
     * 刷新玩家
     */
    refershPlayer(skinId) {
        let hasOwner = GameMgr.getPlayerInfo().hasSkinById(skinId);
        let playerData = G_GameDB.getPlayerConfigByID(skinId);
        let qualityData = G_GameDB.getQualityByID(playerData.quality);
        let equipId = GameMgr.getPlayerInfo().getSkinId();
        this.viewProp.m_has_equip.visible = false;
        this.viewProp.m_canBuy.visible = false;
        this.viewProp.m_UpStar.visible = false;
        this.viewProp.m_chip_box.skin = G_ResPath.rareBoxPath.format(qualityData.rareBg);
        this.viewProp.m_chip_count.text = GameMgr.getPlayerInfo().getSkinChipById(skinId) + "/" + playerData.combineChip;
        this.viewProp.m_chip_skin.skin = G_ResPath.skinPath.format(playerData.icon);
        this.viewProp.m_equipUp.visible = false;
        //显示星级
        let maxStar = G_MaxStar;
        let skinData = GameMgr.getPlayerInfo().getSkinDataById(skinId);
        let supStar = skinData.star % 5;
        if (skinData.star != 0 && supStar == 0) {
            supStar = 5;
        }
        let starIndex = StarMgr.getIns().getStarIcon(skinData.star);
        let array = [];
        for (let i = 0; i < supStar; i++) {
            array.push(starIndex);
        }
        this.viewProp.m_star.array = array;

        if (hasOwner) {
            let hasEquip= equipId == skinId;
            this.viewProp.m_owner_icon.skin = "game/skin/yiyongyou.png";
            //this.viewProp.m_has_equip.visible = equipId == skinId;
            this.viewProp.m_equipUp.visible = !hasEquip;
            this.viewProp.m_UpStar.visible = true;
            //显示升星消耗
            if (skinData.star >= maxStar) {
                this.viewProp.m_UpStar_btn.gray = true;
                this.viewProp.m_upStar_chip_bg.visible = false;
                this.viewProp.m_upStar_diam_bg.visible = false;
            } else {


                this.viewProp.m_upStar_chip_bg.visible = true;
                this.viewProp.m_upStar_diam_bg.visible = true;

                this.viewProp.m_upStar_chip_bg.skin = G_ResPath.rareBoxPath.format(qualityData.rareBg);
                this.viewProp.m_upStar_chip_icon.skin = G_ResPath.skinPath.format(playerData.icon);
                let mats = StarMgr.getIns().getStarUseMat(skinId, skinData.star + 1);
                this.viewProp.m_upStar_chip_count.text = "x" + mats.chip;
                this.viewProp.m_upStar_diam_count.text = "x" + mats.diam;
                //let canUpStar = skinData.skinChip >= mats.chip && Tools.getIns().canUseItemNotTips(mats.diam, 1);
                //this.viewProp.m_UpStar_btn.gray = !canUpStar;
                Tools.getIns().setColor(this.viewProp.m_upStar_chip_count, skinData.skinChip >= mats.chip);
                Tools.getIns().setColor(this.viewProp.m_upStar_diam_count, Tools.getIns().canUseItemNotTips(mats.diam, 1));
            }

            //移动位置
            if(hasEquip){
                this.m_oppo_native.owner.right=375;
                this.viewProp.m_UpStar.right=60;
                this.viewProp.m_equipUp.centerX=157;
            }else{
                this.viewProp.m_equipUp.centerX=157;
                this.viewProp.m_UpStar.right=286;
                this.m_oppo_native.owner.right=602;
            }

        } else {
            this.viewProp.m_combine_chip_bg.skin = G_ResPath.rareBoxPath.format(qualityData.rareBg);
            this.viewProp.m_combine_chip_icon.skin = G_ResPath.skinPath.format(playerData.icon);
            this.viewProp.m_combine_chip_count.text = playerData.combineChip;
            Tools.getIns().setColor(this.viewProp.m_combine_chip_count, skinData.skinChip >= playerData.combineChip);
            this.viewProp.m_owner_icon.skin = "game/skin/weiyongyou.png";
            this.viewProp.m_canBuy.visible = true;
        }



        if (GameMgr.getIns().canshow3DImage()) {
            MapMgr.getIns().showUIModel(skinId);
        } else {
            this.viewProp.m_skin_icon.skin = G_ResPath.skinPath.format(playerData.icon);
        }
        this.viewProp.m_pName.text = playerData.name;

        let viewData=StarMgr.getIns().getPropViewData(skinId,skinData.star);

       
        this.viewProp.m_hp_prop_list.repeatX = viewData.hpCount;
        this.viewProp.m_hp_prop_list.array = viewData.hpData;

       
        this.viewProp.m_hurt_prop_list.repeatX = viewData.hurtCount;
        this.viewProp.m_hurt_prop_list.array = viewData.hurtData;

        

        this.viewProp.m_def_prop_list.repeatX = viewData.defCount;
        this.viewProp.m_def_prop_list.array = viewData.defData;

        this.refershBtn(playerData);
    }


    refershBtn(playerData) {
        if (!playerData) {
            console.error("皮肤数据错误:", playerData, this.curSkinId);
            return;
        }

        //设置价格
        let obj = this.getSkinSaleData(playerData.unLockCount);
        //let skinData = GameMgr.getPlayerInfo().getSkinDataById(playerData.id);
        //设置金币价格
        let count = BigNumber(obj["1"]);
        this.viewProp.m_combine_diam_count.text = "x" + G_Utils.bigNumber2StrNumber(count);
        //判断金币是否足够购买
        //this.viewProp.m_diam_buy.gray =!(Tools.getIns().canUseItemNotTips(count, 1) && skinData.skinChip >= playerData.combineChip);
        Tools.getIns().setColor(this.viewProp.m_combine_diam_count, Tools.getIns().canUseItemNotTips(count, 1));

    }

    getSkinSaleData(unLockCount) {
        let obj = new Object();
        let unLockTemp = unLockCount.split(',');
        let lockTemp = null;
        for (let i = 0; i < unLockTemp.length; i++) {
            lockTemp = unLockTemp[i].split('&');
            obj[lockTemp[0]] = parseInt(lockTemp[1]);
        }

        return obj;
    }

    /**
     * 购买
     * @param {*} type 
     */
    toBuy(btn, type) {

        let playerData = G_GameDB.getPlayerConfigByID(this.curSkinId);

        //判断碎片是否足够
        if (GameMgr.getPlayerInfo().getSkinChipById(this.curSkinId) < playerData.combineChip) {
            G_PlatHelper.showToast("请收集足够的碎片!");
            return;
        }

        let buyOver = () => {
            let subId = this.getSumbitId(this.curSkinId);
            TTSumbitData.getIns().EnterAction(subId, subId);
            GameMgr.getPlayerInfo().addItemByType(4, 1, this.curSkinId);
            GameMgr.getPlayerInfo().setCurSelectSkinId(this.curSkinId);
            GameMgr.getPlayerInfo().combineSkin(this.curSkinId);
            this.refershPlayer(this.curSkinId);
            MapMgr.getIns().showChangeEf();
        }

        if (type == 6) {//视频
            Tools.getIns().shareOrAd(btn, () => {
                buyOver();
            })
        } else if (type == 3) {//金币
            let saleData = this.getSkinSaleData(playerData.unLockCount);
            let gold = BigNumber(saleData["3"]);
            if (!Tools.getIns().canUseItem(gold, type)) {
                return;
            }

            Tools.getIns().useItem(gold, type);
            buyOver();
        } else if (type == 1) {
            let saleData = this.getSkinSaleData(playerData.unLockCount);
            let diam = BigNumber(saleData["1"]);
            if (!Tools.getIns().canUseItem(diam, type)) {
                return;
            }

            Tools.getIns().useItem(diam, type);
            buyOver();
        }
    }


    getSumbitId(skinId) {
        switch (skinId) {
            case 2:
                return 1004;
            case 3:
                return 1005;
            case 4:
                return 1006;
            case 5:
                return 2001;
            case 6:
                return 2002;
            case 7:
                return 2003;
            default:
                return 2004;
        }
    }

    /**
     * 装备
     */
    toEquip() {
        if (!GameMgr.getPlayerInfo().hasSkinById(this.curSkinId)) {
            G_PlatHelper.showToast("皮肤尚未获得!");
            return;
        }
        MapMgr.getIns().showChangeEf();
        GameMgr.getPlayerInfo().setCurSelectSkinId(this.curSkinId);
        this.refershPlayer(this.curSkinId);
        G_PlatHelper.showToast("装备成功!");
    }

    propRender(cell, index) {
        let data = cell.parent.parent.getItem(index);
        cell.value = data.pro;
    }

    /**
     * 升星
     * @returns 
     */
    toUpStar() {
        //判断是否满星
        let maxStar = G_MaxStar;
        let skinData = GameMgr.getPlayerInfo().getSkinDataById(this.curSkinId);
        if (skinData.star >= maxStar) {
            G_PlatHelper.showToast("已达最高星级!");
            return;
        }

        let mats = StarMgr.getIns().getStarUseMat(this.curSkinId, skinData.star + 1);
        if (skinData.skinChip < mats.chip) {
            G_PlatHelper.showToast("碎片不足!");
            return;
        }

        if (!Tools.getIns().canUseItem(mats.diam, 1)) {
            return;
        }
        Tools.getIns().useItem(mats.chip, 2, this.curSkinId);
        Tools.getIns().useItem(mats.diam, 1);
        GameMgr.getPlayerInfo().upSkinStarById(this.curSkinId);
        this.refershPlayer(this.curSkinId);
        G_PlatHelper.showToast("升星成功!");
    }

    starRender(cell, index) {
        cell.skin = G_ResPath.starPath.format(this.viewProp.m_star.getItem(index));
    }
}
