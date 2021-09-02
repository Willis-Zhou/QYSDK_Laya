
import ScrollPopup from "../../game/ui/popup/ScrollPopup";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import ExportAdMgr from "../Mgr/ExportAdMgr";
import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import TTSumbitData from "../Mgr/TTSumbitData";
import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

export default class GameOverView extends PageBase {

    constructor() {
        super();
        this.pageVals = null;
        this.adObj = new Object();
        this.adObj.num = -1;
        this.canClick = true;
        this.tDaim = 50;


        this.isShowTop = true;

        this.tGold = 0;
        this.goldTimes = 3;

        this.scrollAd = null;

        this.isMisShowBanner = false;

        let vals = [];
        vals.push({ time: 800, prop: { rotation: 0 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 800, prop: { rotation: 12, scaleX: 1.2, scaleY: 1.2 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 800, prop: { rotation: 0, scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 1000, prop: { rotation: 0 }, ease: Laya.Ease.linearOut });

        this.flowAdTween = new ContinuousTweenMgr();
        this.flowAdTween.setTweenVals(vals);
        this.flowAdTween.setLoop(true);

    }

    pageInit() {
        super.pageInit();
        this.flowAdTween.setTarget(this.viewProp.m_flowAd2);
        this.flowAdTween.setTarget(this.viewProp.m_flowAd1);
        this.scrollAd = this.viewProp.m_scrollAd.getComponent(ScrollPopup);

        this.viewProp.m_three_get.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_three_get, () => {
                this.toGetGold(this.viewProp.m_three_get, true, () => {
                    this.toReadView();
                });

            })
        });

        this.viewProp.m_get.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_get, () => {
                MistakeMgr.getIns().clickMistake(this.viewProp.m_get, () => {
                    this.toGetGold(this.viewProp.m_get, false, () => {
                        this.toReadView();
                    });
                })

            })
        });

        this.viewProp.m_reborn_get.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_reborn_get, () => {
                this.toGetGold(this.viewProp.m_reborn_get, true, () => {
                    this.toReadView();
                });
            })
        });

        this.viewProp.m_cancel.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_cancel, () => {
                this.toGetGold(this.viewProp.m_cancel, false, () => {
                    this.toReadView();
                });
            })
        });

        this.viewProp.m_toNext.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_toNext, () => {
                this.toGetGold(this.viewProp.m_toNext, false, () => {
                    this.toNextLv();
                })
            })
        })



    }



    toReadView() {
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GameOverView);
        //初始化场景
        GameMgr.getIns().toGame(GameMgr.getPlayerInfo().getCurLevelId(), 1);
        ExportAdMgr.getIns().showAdFullView(() => {
            GameMgr.getIns().toReady(() => {

                let showLvId = GameMgr.getPlayerInfo().getShowLevelCount()
                //添加桌面图标
                if (showLvId == 4) {
                    G_PlatHelper.installShortcut(() => {
                        console.log("install shortcut succ...")
                    })
                }

                if (G_PlatHelper.isWXPlatform() && MistakeMgr.getIns().autoShowPop()) {
                    GameMgr.getUIMgr().openUI(GameMgr.getUIName().PopupView, { viewType: 2 });
                }

            });
        })


    }

    toNextLv() {
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GameOverView);

        GameMgr.getIns().toGame(GameMgr.getPlayerInfo().getCurLevelId(), 1)
    }





    toGetGold(btn, ad, callBack) {
        if (!this.canClick) {
            return;
        }
        this.canClick = false;

        let getOver = () => {
            let times = ad ? this.goldTimes : 1;
            let gold = BigNumber((GameMgr.getIns().gameGold + this.tGold) * GameMgr.getIns().gameMul * times);
            let rewards = [];



            if (gold.gt(0)) {
                rewards.push({ type: 3, count: gold })
            }



            if (rewards.length != 0) {
                let obj = new Object();
                obj.rewardData = rewards;
                obj.closeFun = () => {
                    this.canClick = true;
                    Tools.getIns().handlerFun(callBack);
                }
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj);
            } else {
                this.canClick = true;
                Tools.getIns().handlerFun(callBack);
            }




        }



        if (ad) {
            TTSumbitData.getIns().Video_broadcast(10001, 2);
            Tools.getIns().shareOrAd(btn, () => {
                TTSumbitData.getIns().Video_broadcast(10001, 4);
                getOver();
            }, () => {
                this.canClick = true;
                TTSumbitData.getIns().Video_broadcast(10001, 3);
            })
        } else {
            getOver();
        }


    }




    pageOpen(vals) {
        super.pageOpen(vals);
        MistakeMgr.getIns().resetMisByNode(this.viewProp.m_get);
        this.flowAdTween.play();
        this.canClick = true;
        this.pageVals = vals;
        this.refershAd();
        this.tGold = 20;
        if (!vals.isWin) {
            this.tGold = 0;
            GameMgr.getIns().gameGold = 0;
        }
        //MistakeMgr.getIns().preloadAsset();
        this.viewProp.m_t_gold.text = (GameMgr.getIns().gameGold + this.tGold) * GameMgr.getIns().gameMul;
        Tools.getIns().setAdBtnIcon(this.viewProp.m_three_get);
        // Tools.getIns().setAdBtnIcon(this.viewProp.m_reborn_get);
        //不显示三倍
        //this.viewProp.m_three_get.visible=false;
        this.setWin(vals.isWin, vals.slvId);
        TTSumbitData.getIns().Video_show(10001);


    }

    pageClose() {
        super.pageClose();
        this.misFun && Laya.timer.clear(this, this.misFun);
        this.flowAdTween.end();
    }

    refershAd() {
        this.scrollAd.showUI();
    }

    // showAdCallBack() {
    //     super.showAdCallBack();
    //     PlatAction.getIns().createTwoCustomAd();
    // }




    setWin(isWin, slvId) {
        this.viewProp.m_top_succ.visible = isWin;
        this.viewProp.m_top_fail.visible = !isWin;
        this.viewProp.m_b_succ.visible = isWin;
        this.viewProp.m_b_fail.visible = !isWin;

        if (isWin) {
            //延时显示按钮
            G_UIHelper.delayShow(this.viewProp.m_get, 2000);
        } else {
            //G_UIHelper.delayShow(this.viewProp.m_cancel);
        }

    }


}