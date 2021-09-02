import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";
import ModuleMgr from "../Mgr/ModuleMgr";
import TTSumbitData from "../Mgr/TTSumbitData";
import TeachMgr from "../teach/TeachMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class SelectLevelModel extends PageBase {
    constructor() {
        super();

        this.adObj = new Object();
        this.adObj.num = 2;
        this.isShowTop = true;

        this.canStartGame = true;
        this.isNeedTween = true;
        this.passTween = new ContinuousTweenMgr();
        let vals = [];
        vals.push({ time: 500, prop: { centerX: -800 }, ease: Laya.Ease.quintOut });
        vals.push({ time: 500, prop: { centerX: -244 }, ease: Laya.Ease.quintOut });
        this.passTween.setTweenVals(vals);

        this.examTween = new ContinuousTweenMgr();
        let vals1 = [];
        vals1.push({ time: 800, prop: { centerX: 800 }, ease: Laya.Ease.quintOut });
        vals1.push({ time: 800, prop: { centerX: 257 }, ease: Laya.Ease.quintOut });
        this.examTween.setTweenVals(vals1);

        this.notLimitTween = new ContinuousTweenMgr();
        let vals2 = [];
        vals2.push({ time: 1000, prop: { centerX: 800 }, ease: Laya.Ease.quintOut });
        vals2.push({ time: 1000, prop: { centerX: 288 }, ease: Laya.Ease.quintOut });
        this.notLimitTween.setTweenVals(vals2);
        this.notLimitTween.setDelayTime(100);


    }

    pageInit() {
        super.pageInit();
        this.viewProp.m_bg.on(Laya.Event.CLICK, null, () => {

        });

        this.viewProp.m_back.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_back, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().SelectLevelModel);
            })
        });

        this.viewProp.m_pass_lv.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_pass_lv, () => {
                this.clickToStart();
            })
        });

        this.viewProp.m_exam.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_exam, () => {

                if (!ModuleMgr.getIns().isOpenDriver()) {
                    G_PlatHelper.showToast(ModuleMgr.getIns().getDriverOpenTips());
                    return;
                }
                this.selectSumbit(2, GameMgr.getPlayerInfo().getShowLevelCount())
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().TrainView);
            })
        });

        this.viewProp.m_notLimit.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_notLimit, () => {
                if (!ModuleMgr.getIns().isOpenNotLimit()) {
                    G_PlatHelper.showToast(ModuleMgr.getIns().getNotLimitOpenTips());
                    return;
                }
                this.clickToDontLimit();
            })
        });

        this.passTween.setTarget(this.viewProp.m_pass_lv);
        this.examTween.setTarget(this.viewProp.m_exam);
        this.notLimitTween.setTarget(this.viewProp.m_notLimit);



    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.canStartGame = true;
        this.viewProp.m_lv_count.text = "当前关卡:第{0}关".format(GameMgr.getPlayerInfo().getShowLevelCount())
        this.refershModule();
    }

    refershModule() {
        if (ModuleMgr.getIns().isOpenDriver()) {
            this.viewProp.m_exam_icon.gray = false;
            this.viewProp.m_exam_limit.visible = false;
            this.viewProp.m_exam_lv.visible = true;
            let licenseId = GameMgr.getPlayerInfo().getCurLicenseId();
            if (licenseId > 0) {
                let licenseData = G_GameDB.getDriverLicenseByID(licenseId);
                this.viewProp.m_exam_lv_count.text = "当前驾照:" + licenseData.name;
            } else {
                this.viewProp.m_exam_lv_count.text = "当前驾照:无";
            }
        } else {
            this.viewProp.m_exam_icon.gray = true;
            this.viewProp.m_exam_limit.visible = true;
            this.viewProp.m_exam_limit_tips.text = ModuleMgr.getIns().getDriverOpenTips();
            this.viewProp.m_exam_limit_tips.gray = false;
            this.viewProp.m_exam_lv.visible = false;
        }

        if (ModuleMgr.getIns().isOpenNotLimit()) {
            this.viewProp.m_notLimit_icon.gray = false;
            this.viewProp.m_notLimit_limit.visible = false;
            this.viewProp.m_notLimit_lv.visible = true;
            this.viewProp.m_notLimit_lv_count.text = "历史最高:第{0}波".format(GameMgr.getPlayerInfo().getNotLimitRound());
        } else {
            this.viewProp.m_notLimit_icon.gray = true;
            this.viewProp.m_notLimit_limit.visible = true;
            this.viewProp.m_notLimit_limit_tips.text = ModuleMgr.getIns().getNotLimitOpenTips();
            this.viewProp.m_notLimit_lv.visible = false;
        }


    }


    tweenOpen(callBack) {
        this.passTween.setReverse(false);
        this.passTween.end();
        this.passTween.play();
        this.examTween.setReverse(false);
        this.examTween.end();
        this.examTween.play();
        //this.notLimitTween.clearEndFun();
        this.notLimitTween.setReverse(false);
        this.notLimitTween.end();
        this.notLimitTween.play();
        // this.notLimitTween.setEndCallBack(()=>{
        //     Tools.getIns().handlerFun(callBack);
        // })

        Laya.timer.once(500, this, () => {
            Tools.getIns().handlerFun(callBack);
        })
    }

    tweenClose(callBack) {
        this.passTween.setReverse(true);
        this.passTween.end();
        this.passTween.play();
        this.examTween.setReverse(true);
        this.examTween.end();
        this.examTween.play();
        this.notLimitTween.setReverse(true);
        this.notLimitTween.end();
        this.notLimitTween.play();
        Laya.timer.once(200, this, () => {
            Tools.getIns().handlerFun(callBack);
        })
    }



    clickToStart() {
        if (!this.canStartGame) {
            return;
        }
        this.canStartGame = false;
        let showLvId = GameMgr.getPlayerInfo().getCurLevelId();
        if (TeachMgr.getIns().waitEnableTeachId == 12) {//下一步是前进按钮 直接进入教程
            GameMgr.getIns().toGame(showLvId, 4);
        } else {
            this.selectSumbit(1,showLvId);
            //点击闯关
            let toGame = () => {
                GameMgr.getIns().toGame(showLvId, 1);
            }

            let skinId = GameMgr.getIns().getRandomSkinIds();
            GameMgr.getIns().trySkinId = null;
            if (!skinId) {
                toGame();
            } else {
                let tryObj = {};
                tryObj.skinId = skinId;
                tryObj.closeFun = (succ, trySkinId) => {
                    if (succ) {
                        GameMgr.getIns().trySkinId = trySkinId;
                    }
                    toGame();
                }
                GameMgr.getIns().trySkinSumbit(skinId, showLvId);
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().TryUseSkinView, tryObj)
            }


        }
    }

    clickToDontLimit() {
        if (!this.canStartGame) {
            return;
        }
        this.canStartGame = false;
        this.selectSumbit(3, GameMgr.getPlayerInfo().getShowLevelCount())
        GameMgr.getIns().toGame(1, 3);
    }

    /**
     * 
     * @param {*} type 1闯关模式 2 驾照 3 无尽 4 教程
     * @param {*} lv 
     */
    selectSumbit(type, lv) {
        if (type == 1) {
            if (lv <= GameMgr.getIns().sumbitLvCount) {
                let levelData = GameMgr.getPlayerInfo().getLevelDataById(lv);
                if (levelData.playTimes == 0) {
                    TTSumbitData.getIns().Enter_click(3 + lv * 8);
                }
            }
        } else if (type == 2) {
            TTSumbitData.getIns().Enter_click(44);
        } else if (type == 3) {
            TTSumbitData.getIns().Enter_click(46);
        }


    }
}