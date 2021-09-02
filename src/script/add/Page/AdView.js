import PageBase from "../UIFrame/PageBase";
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import NativeFlow from "../../game/ui/popup/NativeFlow";
import Tools from "../UIFrame/Tools";


import PlatAction from "../UIFrame/PlatAction";
import GameMgr from "../Mgr/GameMgr";
import ScrollPopup from "../../game/ui/popup/ScrollPopup";
import ExportAdMgr from "../Mgr/ExportAdMgr";

export default class AdView extends PageBase {

    constructor() {
        super();
        this.showAdType = 0;
        this.isPartPage = true;
        this.isAutoDestroy = false;

        this.isDealAdView = false;
        this.leftIsInOpen = false;
        this.leftIsOpen = false;

        this.hasShowBanner = false;

        this.movePowerTween = new ContinuousTweenMgr();
        this.movePowerTween.setLoop(false);
        this.m_native_banner = null;

        this.scorllAd = null;
    }


    pageInit() {
        super.pageInit();
        Tools.getIns().showBannerTimer = Laya.timer.currTimer;

        this.scorllAd = this.viewProp.m_bottomList.getComponent(ScrollPopup);
        this.viewProp.m_ad_more.on(Laya.Event.CLICK, this, () => {

            Tools.getIns().btnAction(this.viewProp.m_ad_more, () => {

                if (G_PlatHelper.isWINPlatform() || G_PlatHelper.isWXPlatform()) {
                    let obj = new Object();
                    obj.viewType = 2;
                    GameMgr.getUIMgr().openUI(GameMgr.getUIName().PopupView, obj, null);
                } else if (G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isQQPlatform()) {
                    Tools.getIns().hintBanner();
                    //记录当前banner的状态
                    let showBanner = this.hasShowBanner;
                    this.hasShowBanner = false;
                    PlatAction.getIns().cretaeBoxAd(() => {
                        if (showBanner) {
                            Tools.getIns.createBanner();
                        }
                    });
                } else {
                    console.error("没有配置");
                }


            })

        })


        this.viewProp.m_power_add_btn_icon.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_power_add_btn_icon, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetPowerView);
            });
        });

        this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_gold_add_btn_icon, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetGoldView, null, null);
            });
        });

        this.viewProp.m_diam_add_btn_icon.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_diam_add_btn_icon, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetDiamView, null, null);
            });
        });

        this.viewProp.m_box.on(Laya.CLICK, null, () => {

        });
        this.m_native_banner = this.viewProp.m_native_banner.getComponent(NativeFlow);
        this.m_oppo_banner = this.viewProp.m_oppo_banner.getComponent(NativeFlow);

        this.movePowerTween.setTarget(this.viewProp.m_move_Power);


        this.viewProp.m_mask.visible = false;
        this.showTop(false);
        this.m_native_banner.hideUI();
        this.m_oppo_banner.hideUI();
        this.setBottomType({ num: 3 });
        this.showMoreBtn(false);
    }

    tweenPower(x, y, callback) {
        this.movePowerTween.clearEndFun();
        this.movePowerTween.clearVals();
        this.viewProp.m_move_Power.visible = true;
        this.viewProp.m_box.visible = true;
        let startPos = this.viewProp.m_power_icon.localToGlobal(new Laya.Point(this.viewProp.m_power_icon.width / 2, this.viewProp.m_power_icon.height / 2));

        let vals = [];
        vals.push({ time: 1000, prop: { x: startPos.x, y: startPos.y }, ease: Laya.Ease.cubicOut });
        vals.push({ time: 1000, prop: { x: x, y: y }, ease: Laya.Ease.cubicOut });
        this.movePowerTween.setTweenVals(vals);
        this.movePowerTween.setEndCallBack(() => {
            this.viewProp.m_move_Power.visible = false;
            this.viewProp.m_box.visible = false;//界面隐藏不显示
            Tools.getIns().handlerFun(callback);
        });

        this.movePowerTween.play();
    }



    showjuggleAD(show) {
        if (G_PlatHelper.isQQPlatform()) {
            if (show) {
                G_Adv.createBlockAd({ layout: "left", top: 150 }, 4, "vertical", null, null);
            } else {
                G_Adv.destoryBlockAd();
            }
        }

    }



    pageOpen(vals) {
        super.pageOpen(vals);
        this.viewProp.m_box.visible = false;
        this.viewProp.m_move_Power.visible = false;
        this.setPower(false);
        this.setGold(false);
        this.setDiam(false);
        this._showGetNextPowerTime();
    }



    showMoreBtn(show) {
        this.viewProp.m_ad_more.visible = show;//(G_PlatHelper.isOPPOPlatform()||G_PlatHelper.isWXPlatform())&&show&&MistakeMgr.getIns().getIsExportAdvEnabled();

    }

    showTop(show) {
        this.viewProp.m_top.visible = show;
    }

    setGold(showTween = false) {
        this.viewProp.m_gold_count.text = G_Utils.bigNumber2StrNumber(GameMgr.getPlayerInfo().getCoin());
        showTween && Tools.getIns().btnTween(this.viewProp.m_gold_icon);
    }


    setPower(showTween = false) {
        this.viewProp.m_power_count.text = GameMgr.getPlayerInfo().getPower();
        showTween && Tools.getIns().btnTween(this.viewProp.m_power_icon);
    }

    setDiam() {
        this.viewProp.m_diam_count.text = G_Utils.bigNumber2StrNumber(GameMgr.getPlayerInfo().getDiamCount());
    }


    setBottomType(adObj) {//底部的显示类型
        G_BannerCenterX = 0;
        this.showAdType = adObj.num;
        let bottomIcon = this.viewProp.m_bottomAdIcon;

        //摧毁之前的广告
        bottomIcon.visible = false;
        this.scorllAd.hideUI();
        if (G_PlatHelper.isHWPlatform()) {
            this.m_native_banner.hideUI();
        } else if (G_PlatHelper.isOPPOPlatform()) {
            this.m_oppo_banner.hideUI();
        }


        this.hasShowBanner = false;
        if (this.showAdType == 1) {//刷新广告
            Tools.getIns().hintBanner();
            this.scorllAd.showUI();
        } else if (this.showAdType == 2) {//创建banner


            if (!Tools.getIns().canShowBanner()) {
                return;
            }

        

          
            if (ExportAdMgr.getIns().isOnShow("fullSceneAd")) {
                return;
            }

            //头条不频繁刷新banner
            if (G_PlatHelper.isTTPlatform() && this.hasShowBanner) {
                return;
            } else if (G_PlatHelper.isHWPlatform()) {
                this.m_native_banner._doShowAndRefreshAd();
            } else if (G_PlatHelper.isOPPOPlatform()) {
                this.m_oppo_banner.showUI();
            } else if (G_PlatHelper.isWXPlatform()) {
                if (adObj.centerX) {
                    G_BannerCenterX = adObj.centerX;
                }
                Tools.getIns().createBanner(null, null);
            }
            else {
                Tools.getIns().createBanner(null, null);
            }

            this.hasShowBanner = true;

        } else {
            Tools.getIns().hintBanner();
            this.hasShowBanner = false;
        }

    }



    addListerner() {
        super.addListerner();

        this.refershGold = () => {
            this.setGold();
        };
        G_Event.addEventListerner(GG_EventName.EN_COIN_CHANGED, this.refershGold);

        this.refershPower = () => {
            this.setPower(true);
        };
        G_Event.addEventListerner(G_EventName.EN_POWER_CHANGED, this.refershPower);

        this.refershStar = () => {
            this.setStar(true);
        };
        G_Event.addEventListerner(GG_EventName.EN_CHANGE_STAR, this.refershStar);

        this.refershDiam = () => {
            this.setDiam(true);
        };
        G_Event.addEventListerner(GG_EventName.EN_DIAM_CHANGE, this.refershDiam);
    }



    removeListerner() {
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED, this.refershGold);
        G_Event.removeEventListerner(G_EventName.EN_POWER_CHANGED, this.refershPower);
        G_Event.removeEventListerner(G_EventName.EN_CHANGE_STAR, this.refershStar);
        G_Event.removeEventListerner(GG_EventName.EN_DIAM_CHANGE, this.refershDiam);
    }



    //体力
    restorePowerFromDeltaTime(deltaTime) {
        if (deltaTime > 0) {
            let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num + GameMgr.getPlayerInfo().getExtraPowerCount();
            let maxCanRestorePower = maxPower - G_PlayerInfo.getPower()
            if (maxCanRestorePower > 0) {
                let needTime = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NEED_TIME_TO_RESTORE_POWER"]).num

                if (deltaTime >= needTime) {
                    let canRestorePower = Math.floor(deltaTime / needTime)

                    if (canRestorePower <= maxCanRestorePower) {
                        G_PlayerInfo.addPower(canRestorePower, true)
                        console.log("Restore {0} Power From {1} DeltaTime".format(canRestorePower.toString(), deltaTime.toString()))
                    }
                    else {
                        G_PlayerInfo.addPower(maxCanRestorePower, true)
                        console.log("Restore {0} Power From {1} DeltaTime".format(maxCanRestorePower.toString(), deltaTime.toString()))
                    }
                }
            }
        }
    }


    _updateGetNextPowerTime() {
        if (this.viewProp.m_power_recover_tips) {
            let lastGetPowerTime = G_PlayerInfo.getLastGetPowerTime()
            let needTime = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NEED_TIME_TO_RESTORE_POWER"]).num

            // update ui
            let stillNeedTime = needTime - (Math.floor(G_ServerInfo.getServerTime() / 1000) - lastGetPowerTime)
            if (stillNeedTime === 0) {
                let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num + GameMgr.getPlayerInfo().getExtraPowerCount();
                if (maxPower - G_PlayerInfo.getPower() > 1) {
                    stillNeedTime = needTime
                }
            }
            this.viewProp.m_power_recover_tips.text = G_Utils.convertSecondToHourMinuteSecond(stillNeedTime, true)

            // check can restore or not
            let passedTime = Math.floor(G_ServerInfo.getServerTime() / 1000) - lastGetPowerTime
            if (passedTime >= needTime) {
                this.restorePowerFromDeltaTime(passedTime)
            }
        }
    }

    _showGetNextPowerTime() {
        if (this.viewProp.m_power_recover_bg) {
            this.viewProp.m_power_recover_bg.visible = true
        }

        if (!G_Scheduler.isScheduled("Auto_Update_Get_Next_Power_Time")) {
            // update first
            this._updateGetNextPowerTime()

            let power = G_PlayerInfo.getPower()
            let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num + GameMgr.getPlayerInfo().getExtraPowerCount();
            if (power < maxPower) {
                G_Scheduler.schedule("Auto_Update_Get_Next_Power_Time", function () {
                    this._updateGetNextPowerTime()
                }.bind(this), false, 1000)
            } else {
                this._hideGetNextPowerTime();
            }
        }
    }

    _hideGetNextPowerTime() {
        if (this.viewProp.m_power_recover_bg) {
            this.viewProp.m_power_recover_bg.visible = false
        }

        G_Scheduler.unschedule("Auto_Update_Get_Next_Power_Time")
    }




}