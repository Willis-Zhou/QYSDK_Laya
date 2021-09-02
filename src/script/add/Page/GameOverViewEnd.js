import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";
import NativeFlow from "../../game/ui/popup/NativeFlow";
import CameraRecordMgr from "../Mgr/CameraRecordMgr";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import TTSumbitData from "../Mgr/TTSumbitData";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class GameOverViewEnd extends PageBase {

    constructor() {
        super();
        this.chineseName = "结算成功";
        this.vals = null;
        this.adObj = new Object();
        this.adObj.num = 2;
        this.showMore = false;
        this.moveEnd = true;
        this.nativeFlow = null;

        this.downTime = 5;
        this.curDownTime = 0;

        this.pageVals = null;
        this.isViewAd = false;

        this.tGold = 750;//通关金币
        this.goldTimes = 2;//翻倍

        this.isToReborn = false;//是否在复活

        this.tweenOpenVals = [];
        this.tweenOpenVals.push({ time: 800, prop: { alpha: 0 }, ease: Laya.Ease.circOut });
        this.tweenOpenVals.push({ time: 800, prop: { alpha: 1 }, ease: Laya.Ease.circOut });

        this.tweenCloseVals = [];
        this.tweenCloseVals.push({ time: 100, prop: { alpha: 1 }, ease: Laya.Ease.linearIn });
        this.tweenCloseVals.push({ time: 100, prop: { alpha: 0 }, ease: Laya.Ease.linearIn });

        let vals1 = [];
        vals1.push({ time: 200, prop: { scaleX: 3, scaleY: 3 }, ease: Laya.Ease.quadOut });
        vals1.push({ time: 200, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.quadIn });
        this.skilIconTweem = new ContinuousTweenMgr();
        this.skilIconTweem.setTweenVals(vals1);
        this.skilIconTweem.setLoop(false);

        this.isNeedTween = true;

        this.isInShare = false;
        this.shareRewardCount = 1000;
        this.isClickCheck = false;
        this.forceShowAd = false;//强制显示视屏
        this.foreceSelect = false;

        this.oppo_nativeAd = null;
        this.isOppoNativeMis = false;

        this.inPageCount = 0;//进入界面的次数
    }

    pageInit() {
        super.pageInit();

        if (G_PlatHelper.isOPPOPlatform()) {
            this.adObj.num = 3;
        }

        this.viewProp.m_replay_btn.on(Laya.Event.CLICK, this, () => {
            if (this.isToReborn) {
                return;
            }
            this.isToReborn = true;
            //Tools.getIns().btnAction(this.viewProp.m_replay_btn);
            Tools.getIns().shareOrAd(this.viewProp.m_replay_btn, () => {
                this.toReborn();
            }, () => {
                this.isToReborn = false;
            });
        });

        this.viewProp.m_toNext.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_toNext, () => {
                this.toGetGold(false);
            });

        });

        this.viewProp.m_to_get_oppo.on(Laya.Event.CLICK, this, () => {
            if (this.isOppoNativeMis) {
                this.isOppoNativeMis = false;
                this.oppo_nativeAd.onClickTouched(this.viewProp.m_to_get_oppo);
            }

            this.toGetGold(false);
        });

        this.viewProp.m_three_check.on(Laya.Event.CLICK, this, () => {
            this.isViewAd = !this.isViewAd;
            this.isClickCheck = true;
            this.refershSelect(this.isViewAd);

        });

        this.viewProp.m_reborn_check.on(Laya.Event.CLICK, this, () => {
            this.isViewAd = !this.isViewAd;
            this.isClickCheck = true;
            this.refershSelect(this.isViewAd);

        });

        this.viewProp.m_cacel_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_cacel_btn, () => {
                this.toNextView();
            });

        });



        this.viewProp.m_three_get.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_three_get);
            this.toGetGold(true, this.isViewAd && !this.isClickCheck);
        });

        this.viewProp.m_three_get_oppo.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_three_get_oppo);
            this.toGetGold(true, this.isViewAd && !this.isClickCheck);
        });

        this.viewProp.m_share_s_btn.on(Laya.Event.CLICK, null, () => {
            TTSumbitData.getIns().Screenc_click("结算成功");
            Tools.getIns().btnAction(this.m_share_s_btn, () => {
                this.doShare();
            })
        });

        this.viewProp.m_share_f_btn.on(Laya.Event.CLICK, null, () => {
            TTSumbitData.getIns().Screenc_click("结算失败");
            Tools.getIns().btnAction(this.m_share_f_btn, () => {
                this.doShare(() => {
                    this.toNextView();
                });
            })
        });

        this.viewProp.m_cancel_s_share.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_cancel_s_share, () => {
                this.setShareView(false, true);
            })
        });

        this.viewProp.m_cancel_f_share.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_cancel_f_share, () => {
                MapMgr.getIns().isReReception = true;
                this.toNextView();
            })
        });

        this.viewProp.m_reReception_oppo.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_reReception_oppo, () => {
                MapMgr.getIns().isReReception = true;
                this.toNextView();
            })
        })

        this.viewProp.m_cancel_f_oppo.on(Laya.Event.CLICK, null, () => {
            if (this.isOppoNativeMis) {
                this.isOppoNativeMis = false;
                this.oppo_nativeAd.onClickTouched(this.viewProp.m_cancel_f_oppo);
            }
            this.toNextView();
        });

        this.viewProp.m_check_oppo.on(Laya.Event.CLICK, null, () => {
            this.oppo_nativeAd.onClickTouched(this.viewProp.m_check_oppo);
        })


        this.skilIconTweem.setTarget(this.viewProp.m_skill_icon);


        this.oppo_nativeAd = this.viewProp.m_oppo_nativeAd.getComponent(NativeFlow);
    }





    doShare(callBack, isWin = true) {

        if (this.isInShare) {
            return;
        }
        this.isInShare = true;

        let sgin = isWin ? "结算成功" : "结算失败";

        CameraRecordMgr.getIns().shareVideo((succ, state) => {

            if (succ) {
                TTSumbitData.getIns().Screen_over(sgin);
                GameMgr.getPlayerInfo().addItemByType(3, this.shareRewardCount, 0);
                G_PlatHelper.showToast("恭喜获得{0}钞票!".format(this.shareRewardCount));
                this.setShareView(false, isWin);
                Tools.getIns().handlerFun(callBack);
            } else {
                TTSumbitData.getIns().Screen_fail(sgin, state)
            }

            if (state != 1) {//1 为拉起失败
                TTSumbitData.getIns().Screen_get(sgin);
            }

            this.isInShare = false;

        })
    }

    toReborn() {
        G_Scheduler.unschedule("reborn_time_down");
        this.isToReborn = false;
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GameOverViewEnd);
        GameMgr.getIns().gameReborn();
    }

    toNextView() {
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GameOverViewEnd);
        if (G_PlatHelper.isTTPlatform()) {
            this.toReadView();
        } else {

            GameMgr.getUIMgr().openUI(GameMgr.getUIName().GameOverView, this.pageVals);
        }

    }

    toReadView() {
        MapMgr.getIns().cleanScenes(MapMgr.getIns().isReReception);
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().ReadyView);
    }

    toGetGold(isViewAd, isMiss = false) {

        if (this.foreceSelect && this.forceShowAd) {//强制看一次视频
            isViewAd = true;
            isMiss = true;
            this.forceShowAd = false;
        }

        let gold = (this.tGold + GameMgr.getIns().gameGold) * GameMgr.getIns().gameMul;

        let getFun = function () {
            GameMgr.getPlayerInfo().addItemByType(3, gold, 0);
            G_PlatHelper.showToast("恭喜获得{0}钞票".format(gold));
            this.toNextView();
        }.bind(this);

        if (isViewAd) {

            Tools.getIns().shareOrAd(this.viewProp.m_toNext, () => {
                gold = gold * this.goldTimes;
                getFun();

                if (isMiss) {
                   
                } else {
                    
                }
            }, () => {

            });


        } else {
            getFun();
        }
    }



    refershAd() {
        this.oppo_nativeAd.hideUI();
        if (G_PlatHelper.isOPPOPlatform()) {
            this.oppo_nativeAd.showUI();
            this.oppo_nativeAd._refreshNativeAd();
        }
    }

    pageOpen(vals) {
        super.pageOpen(vals);

        this.isClickCheck = false;

        this.isToReborn = false;
        this.pageVals = vals;
        this.showTopView(vals.isWin);
        this.refershBottom(vals.isWin);

        if (vals.isWin) {
            TTSumbitData.getIns().Screen_show("结算成功");
        } else {
            TTSumbitData.getIns().Screen_show("结算失败");
        }

        this.refershAd();
        this.viewProp.m_gold.text = "+" + (this.tGold + GameMgr.getIns().gameGold) * GameMgr.getIns().gameMul;
        this.foreceSelect = MistakeMgr.getIns().getForeceSelect();
        this.isViewAd = this.foreceSelect;
        if (G_PlatHelper.isTTPlatform()) {
            this.forceShowAd = this.isViewAd;
        }

        this.refershSelect(this.isViewAd);
        this.viewProp.m_three_check.visible = true;


    }

    refershBottom(isWin) {

        this.viewProp.m_s_b.visible = false;
        this.viewProp.m_f_b.visible = false;
        this.viewProp.m_s_b_oppo.visible = false;
        this.viewProp.m_f_b_oppo.visible = false;
        if (G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isWINPlatform()) {//oppo特殊处理
            this.viewProp.m_s_b_oppo.visible = isWin;
            this.viewProp.m_f_b_oppo.visible = !isWin;

            //刷新底部banner
            let mis = false;
            if (this.inPageCount == 0) {
                mis = false;
            } else {
                if (MistakeMgr.getIns().getNatvieMisSpace() > 0) {
                    if (this.inPageCount >= MistakeMgr.getIns().getNatvieMisSpace()) {
                        this.inPageCount = -1;
                        mis = true;
                    }
                }
            }
            this.inPageCount++;

            //this.viewProp.m_nativeAd_close.visible=!mis;
            this.isOppoNativeMis = mis;

        } else {
            this.viewProp.m_s_b.visible = isWin;
            this.viewProp.m_f_b.visible = !isWin;
        }


        Tools.getIns().setAdBtnIcon(this.viewProp.m_three_get);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_three_get_oppo);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_replay_btn);

        this.setShareView(true, isWin);

    }

    setShareView(set, isWin) {
        //分享界面
        if (G_PlatHelper.isTTPlatform()) {

            this.viewProp.m_f_b.visible = false;
            this.viewProp.m_share_s_b.visible = false;
            this.viewProp.m_share_f_b.visible = false;
            if (isWin) {
                this.viewProp.m_share_s_b.visible = set;
                this.viewProp.m_s_b.visible = !set;
            } else {
                //this.viewProp.m_f_b.visible=false;
                this.viewProp.m_share_f_b.visible = set;
            }

            if (MistakeMgr.getIns().getBtnDelayShow()) {

                if (isWin) {
                    Tools.getIns().playBtnShowNotLimit(this.viewProp.m_cancel_s_share, null, 30);
                } else {
                    Tools.getIns().playBtnShowNotLimit(this.viewProp.m_cancel_f_share, null, 30);
                }
            }


        } else {
            this.viewProp.m_share_f_b.visible = false;
            this.viewProp.m_share_s_b.visible = false;
        }
    }

    refershSelect(isViewAd) {
        this.viewProp.m_three_check.selected = isViewAd;
        this.viewProp.m_reborn_check.selected = isViewAd;

        this.viewProp.m_cacel_btn.visible = !isViewAd;
        this.viewProp.m_replay_btn.visible = isViewAd;

        this.viewProp.m_toNext.visible = !isViewAd;
        this.viewProp.m_three_get.visible = isViewAd;
    }

    showTopView(isWin) {
        this.viewProp.m_f_top.visible = false;
        this.viewProp.m_s_top.visible = true;

        if (!isWin) {
            this.viewProp.m_gold.text = "+" + 0;
            G_SoundMgr.playSound(G_SoundName.SN_FAIL);
            this.viewProp.m_skill_icon.skin = "game/gameOver/sp22.png";
            this.skilIconTweem.end();
        } else {
            this.viewProp.m_skill_icon.skin = "game/gameOver/sp21.png";
            this.viewProp.m_gold.text = "+" + 800;
            G_SoundMgr.playSound(G_SoundName.SN_SUCC);
            this.skilIconTweem.play();
        }
    }


    refershTimeDown() {
        this.curDownTime++;
        this.viewProp.m_timeDown_Icon.skin = "game/gameOver/timeDow_{0}.png".format(this.curDownTime);
        this.viewProp.m_timeDown_Text.text = (this.downTime - this.curDownTime);
        if (this.curDownTime >= 5) {
            G_Scheduler.unschedule("reborn_time_down");
            this.toNextView();
        }
    }

    pageClose() {
        super.pageClose();
        G_Scheduler.unschedule("reborn_time_down");

    }

}