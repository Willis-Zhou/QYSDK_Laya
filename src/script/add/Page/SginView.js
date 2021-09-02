import PageBase from "../UIFrame/PageBase"
import SginItem from "../item/SginItem";
import Tools from "../UIFrame/Tools";


import PlatAction from "../UIFrame/PlatAction";
import GameMgr from "../Mgr/GameMgr";
import NativeInsert from "../gameMgr/NativeInsert";
export default class SginView extends PageBase {

    constructor() {
        super();
        this.chineseName = "签到";
        this.adObj = new Object();
        this.adObj.num = 2;
        this.isNeedTween = true;

        this.isInSgin = false;
        this.sginTimes = 2;
    }

    pageInit() {
        super.pageInit();
        this.m_oppo_native = this.viewProp.m_oppo_native.getComponent(NativeInsert);
        this.m_oppo_native.init();
        this.m_oppo_native.refershNative();
        if (G_PlatHelper.isOPPOPlatform()) {
            this.adObj.num = -1;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.adObj.num = 2;
        } else {
            this.adObj.num = -1;
        }

        this.viewProp.m_sgin.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_sgin, () => {
                this.toSgin(this.viewProp.m_sgin, false);
            })
        });

        this.viewProp.m_sgin_ad.on(Laya.Event.CLICK, this, () => {
            this.toSgin(this.viewProp.m_sgin_ad, true);
        });

        this.viewProp.m_close.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
                GameMgr.getUIMgr().closeUI(this.pageName);
            })
        })

        //初始化签到数据
        let data = [];
        let weekCount = GameMgr.getPlayerInfo().getSginWeekCount();
        for (let i = 1; i <= 6; i++) {
            let sginData = G_GameDB.getSginConfigByID(i);
            let obj = this.getSginObj(sginData, weekCount);
            data.push({ day: i, sginData: obj });
        }
        this.viewProp.m_list.array = data;
        this.viewProp.m_list.renderHandler = new Laya.Handler(this, this.sginRender);
    }

    getSginObj(sginData, weekCount) {
        let obj = new Object();
        obj.id = sginData.id;

        //类型
        let temp = sginData.type.split('|');
        let index = weekCount % temp.length;
        obj.type = parseInt(temp[index]);

        //数量
        temp = sginData.count.split('|');
        index = weekCount % temp.length;
        obj.count = parseInt(temp[index]);

        //是否双倍
        temp = sginData.isDouble.split('|');
        index = weekCount % temp.length;
        obj.isDouble = parseInt(temp[index]);

        //额外字段
        temp = sginData.param1.split('|');
        index = weekCount % temp.length;
        obj.param1 = parseInt(temp[index]);

        //名字
        temp = sginData.name.split('|');
        index = weekCount % temp.length;
        obj.name = temp[index];

        return obj;
    }

    toSgin(btn, ad) {

        if (GameMgr.getPlayerInfo().hasSginByDay()) {
            G_PlatHelper.showToast("今日已经签到!");
            return;
        }

        if (this.isInSgin) {
            G_PlatHelper.showToast("正在签到的路上哦!");
            return;
        }

        this.isInSgin = true;

        let sginOver = (ad) => {

            //获得奖励
            let times = ad ? this.sginTimes : 1;
            let day = GameMgr.getPlayerInfo().getNextSginDay();
            let sginData = G_GameDB.getSginConfigByID(day);
            let weekCount = GameMgr.getPlayerInfo().getSginWeekCount();
            let sginObj = this.getSginObj(sginData, weekCount);

            let obj = new Object();
            obj.rewardData = [];
            obj.rewardData.push({ type: sginObj.type, count: sginObj.count * times, paraId: sginObj.param1 });
            GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj);


            this.isInSgin = false;
            GameMgr.getPlayerInfo().markSginToday();
            GameMgr.getUIMgr().closeUI(this.pageName);
        }

        if (!ad) {
            sginOver(false);
        } else {
            Tools.getIns().shareOrAd(btn, () => {
                sginOver(true);
            }, () => {
                this.isInSgin = false;
            })
        }
    }

    sginRender(cell, index) {
        let mgr = cell.getComponent(SginItem);
        if (!mgr) {
            mgr = cell.addComponent(SginItem);
            mgr.init();
        }

        mgr.setData(this.viewProp.m_list.getItem(index));
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.isInSgin = false;
        Tools.getIns().setAdBtnIcon(this.viewProp.m_sgin_ad);
        this.refershDay();
        this.refershView();
        this.refershNative();
    }

    refershNative() {
        this.m_oppo_native.hideUI()
        if (G_PlatHelper.isOPPOPlatform()) {
            this.m_oppo_native.showUI();
        }
    }

    showAdCallBack() {
        super.showAdCallBack();
        PlatAction.getIns().createTwoCustomAd();
    }


    refershDay() {
        this.viewProp.m_list.refresh();

        this.viewProp.m_server_sel.visible = GameMgr.getPlayerInfo().getSginDayCount() >= 7;
    }

    refershView() {
        this.viewProp.m_sgin_ad.visible = false;
        this.viewProp.m_sgin.visible = false;
        if (!GameMgr.getPlayerInfo().hasSginByDay()) {
            this.viewProp.m_sgin_ad.visible = true;
            this.viewProp.m_sgin.visible = true;
        } else {

        }
    }
}