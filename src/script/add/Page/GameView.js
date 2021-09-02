import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";
import CameraRecordMgr from "../Mgr/CameraRecordMgr";
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import DragCorl from "../ctrol/DragCorl";
import GrowUp from "../gameMgr/GrowUp";
export default class GameView extends PageBase {

    constructor() {
        super();
        this.adObj = new Object();
        //this.adObj.num = 1;
        this.endFun = null;
        this.curDownTime = 0;
        this.downTime = 5;
        this.isShowTimer = false;
        this.timeDownCb = null;
        this.isShowTop = true;
        //this.showMore = true;

        this.isShowAd = false;
        this.isOpenAd = false;

        this.dragCrol = null;

        this.curStoreMgr = null;
        this.curStoreUI = null;

        this.storeTween = new ContinuousTweenMgr();
        let vals = [];
        vals.push({ time: 300, prop: { scaleX: 0.5, scaleY: 0.5 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 300, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearOut });
        this.storeTween.setTweenVals(vals);

        this.storeCloseTween = new ContinuousTweenMgr();
        let vals1 = [];
        vals1.push({ time: 300, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearIn })
        vals1.push({ time: 300, prop: { scaleX: 0, scaleY: 0 }, ease: Laya.Ease.linearIn })
        this.storeCloseTween.setTweenVals(vals1);

        this.containTween = null;

        this.speedUpData = null;
        this.strongeData = null;

        this.useTime = 30000;


    }


    pageInit() {
        super.pageInit();
        MapMgr.getIns().gameView = this;

        this.viewProp.m_btn_setting.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_btn_setting, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().SettingView);
            })

        });



        let dragCrol = this.viewProp.m_dragArea.getComponent(DragCorl);
        if (dragCrol instanceof DragCorl) {
            this.dragCrol = dragCrol;
            dragCrol.init();
        }

        this.viewProp.m_beeAdd.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_beeAdd, () => {
                if (!MapMgr.getIns().curMap) {
                    console.error("商店地域问题！");
                    return;
                }


                if (this.viewProp.m_beeAdd.isMax) {
                    G_PlatHelper.showToast("已经到达最大等级!");
                    return;
                }

                this.curStoreMgr.buyBee(this.viewProp.m_beeAdd_Ad,()=>{
                    this.refershBuyBeeStore();
                })
                
            })
        })

        this.viewProp.m_backStart.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_backStart, () => {
                this.backStartPos();
            })
        })

        this.viewProp.m_capacityAdd.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_capacityAdd, () => {


                if (this.viewProp.m_capacityAdd.isMax) {
                    G_PlatHelper.showToast("已经到达最大等级!");
                    return;
                }

                if (!MapMgr.getIns().curMap) {
                    console.error("商店地域问题！");
                    return;
                }

              
                this.curStoreMgr.capacityAdd(this.viewProp.m_capacityAdd_Ad,()=>{
                    this.refershCapacityStore();
                })
            })
        })

        this.viewProp.m_daoHurt.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_daoHurt, () => {

                if (this.viewProp.m_daoHurt.isMax) {
                    G_PlatHelper.showToast("已经到达最大等级!");
                    return;
                }

                if (!MapMgr.getIns().curMap) {
                    console.error("商店地域问题！");
                    return;
                }

                this.curStoreMgr.upHurt(this.viewProp.m_daoHurt_Ad,()=>{
                    this.refershCapacityStore();
                })
               
              

            })
        })

        this.viewProp.m_beeSpeed.on(Laya.Event.CLICK, this, () => {

            Tools.getIns().btnAction(this.viewProp.m_beeSpeed, () => {

                if (this.viewProp.m_beeSpeed.isMax) {
                    G_PlatHelper.showToast("已经到达最大等级!");
                    return;
                }

                if (!MapMgr.getIns().curMap) {
                    console.error("商店地域问题！");
                    return;
                }

                this.curStoreMgr.beeSpeedUp(this.viewProp.m_beeAdd_Ad,()=>{
                    this.refershBuyBeeStore();
                })

               
             
            })
        })

        this.viewProp.m_toNext_by_gold.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_toNext_by_gold, () => {
                if (this.viewProp.m_toNext_by_gold.isMax) {
                    G_PlatHelper.showToast("已经全部通关!");
                    return;
                }
            })

            this.curStoreMgr.toNextLvByGold();
        })

        this.viewProp.m_toNext_by_honey.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_toNext_by_honey, () => {
                if (this.viewProp.m_toNext_by_honey.isMax) {
                    G_PlatHelper.showToast("已经全部通关!");
                    return;
                }
            })
            this.curStoreMgr.toNextLvByHoney();
           
        })

        this.viewProp.m_speedUp_ad.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_speedUp_ad, () => {
                Tools.getIns().shareOrAd(this.viewProp.m_speedUp_ad, () => {
                    this.toSpeedUp();

                })
            })
        })

        this.viewProp.m_stronge_ad.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_stronge_ad, () => {
                Tools.getIns().shareOrAd(this.viewProp.m_stronge_ad, () => {

                    this.toStronge();
                })
            })
        })

        this.viewProp.m_bee_change_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_bee_change_btn, () => {

                this.curStoreMgr.combineBee(this.viewProp.m_bee_change_btn,()=>{
                    this.refershBuyBeeStore();
                });
                
            })
        })

    }

    toStronge() {
        let skillData = GameMgr.getPlayerInfo().getPlayerSkillDataById(2);

        let lastTime = skillData.toTime - G_ServerInfo.getServerTime();

        if (lastTime <= 0) {
            lastTime = G_ServerInfo.getServerTime() + this.useTime;
        } else {
            lastTime += (G_ServerInfo.getServerTime() + this.useTime);
        }

        GameMgr.getPlayerInfo().addSkillTime(2, lastTime);
        this.refershStrongeView();
    }

    toSpeedUp() {
        let skillData = GameMgr.getPlayerInfo().getPlayerSkillDataById(1);

        let lastTime = skillData.toTime - G_ServerInfo.getServerTime();

        if (lastTime <= 0) {
            lastTime = G_ServerInfo.getServerTime() + this.useTime;
        } else {
            lastTime += (G_ServerInfo.getServerTime() + this.useTime);
        }

        GameMgr.getPlayerInfo().addSkillTime(1, lastTime);
        this.refershSpeedUpView();
    }


    backStartPos() {
        if (MapMgr.getIns().curMap) {
            MapMgr.getIns().curMap.toStartPos();
        }
    }

    closeAllStore() {
        this.viewProp.m_beeStore.visible = false;
        this.viewProp.m_capacityStore.visible = false;
        this.viewProp.m_beeChange.visible = false;
        this.viewProp.m_next_lv.visible = false;
        this.viewProp.m_sellView.visible = false;
        G_Event.dispatchEvent(G_EventName.EN_CLOSEALLSTORE);
    }

    setContain(cur, max, isTween = true) {
        if (this.containTween) {
            this.containTween.clear();
        }

        let val = cur / max;
        if (isTween) {
            this.containTween = Laya.Tween.to(this.viewProp.m_contain, { value: val }, 500, Laya.Ease.linearOut, null, 0, true, false);
        } else {
            this.viewProp.m_contain.value = val;
        }

        this.viewProp.m_contain_val.text = G_Utils.bigNumber2StrNumber(BigNumber(cur), 2)
        this.viewProp.m_contain_Full.visible=val>=1
    }

    /**
     * 刷新加速
     */
    refershSpeedUpView() {
        let skillData = GameMgr.getPlayerInfo().getPlayerSkillDataById(1);
        this.viewProp.m_speedUp_ad.visible = false;
        this.viewProp.m_speedUp_use.visible = false;
        this.viewProp.m_speedUp_count.text = skillData.count;
        if (skillData.count > 0) {
            this.viewProp.m_speedUp_use.visible = true;
        } else {
            Tools.getIns().setAdBtnIcon(this.viewProp.m_speedUp_ad);
            this.viewProp.m_speedUp_ad.visible = true;

        }

        //判断是否在加速
        if (skillData.toTime > G_ServerInfo.getServerTime()) {
            this.speedUpData = skillData;
            this.openTimer();
            MapMgr.getIns().playerMgr.speedUp();
        } else {
            GameMgr.getPlayerInfo().addSkillTime(1, 0);
            this.viewProp.m_speedUp_time.text = "00:00:00";
            MapMgr.getIns().playerMgr.cancelSpeedUp();
        }
    }

    refershStrongeView() {
        let skillData = GameMgr.getPlayerInfo().getPlayerSkillDataById(2);
        this.viewProp.m_stronge_ad.visible = false;
        this.viewProp.m_stronge_use.visible = false;
        this.viewProp.m_stronge_time.text = skillData.count;
        if (skillData.count > 0) {
            this.viewProp.m_stronge_use.visible = true;
        } else {
            Tools.getIns().setAdBtnIcon(this.viewProp.m_stronge_ad);
            this.viewProp.m_stronge_ad.visible = true;

        }

        //判断是否在加速
        if (skillData.toTime > G_ServerInfo.getServerTime()) {
            this.strongeData = skillData;
            this.openTimer();
        } else {
            GameMgr.getPlayerInfo().addSkillTime(2, 0);
            this.viewProp.m_stronge_time.text = "00:00:00";
        }
    }

    openTimer() {
        this.refershTimer();
        Laya.timer.clear(this, this.refershTimer);
        Laya.timer.loop(1000, this, this.refershTimer);
    }


    closeTimer() {
        if (!this.speedUpData && !this.strongeData) {
            Laya.timer.clear(this, this.refershTimer);
        }
    }

    /**
     * 时间刷新
     */
    refershTimer() {
        let time = G_ServerInfo.getServerTime();
        if (this.speedUpData) {
            let sup = this.speedUpData.toTime - time;
            if (sup > 0) {

                this.viewProp.m_speedUp_time.text = G_Utils.convertSecondToHourMinuteSecond(Math.floor(sup * 0.001), false)
            } else {
                this.refershSpeedUpView();
            }
        }

        if (this.strongeData) {
            let sup = this.strongeData.toTime - time;
            if (sup > 0) {

                this.viewProp.m_stronge_time.text = G_Utils.convertSecondToHourMinuteSecond(Math.floor(sup * 0.001), false)
            } else {
                this.refershStrongeView();
            }
        }

    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.isOpenAd = false;
        this.isShowAd = false;
        this.refershNative();
        this.closeTimerDown();
        this.closeAllStore();
        this.refershSpeedUpView();
        this.refershStrongeView();
        MapMgr.getIns().playerMgr.refershContainView();
        CameraRecordMgr.getIns().start();
        if (vals && vals.endFun) {
            this.endFun = vals.endFun;
            this.endFun();
        }

        //设置监听
        MapMgr.getIns().playerMgr.setCorl();
    }

    /**
     * 刷新购买蜜蜂的商店
     */
    refershBuyBeeStore() {

        let speedLv = GameMgr.getPlayerInfo().getBeeSpeedLv();
        let max = GrowUp.getIns().maxId;
        if (speedLv < max) {
            let data = G_GameDB.getGrowUpByID(speedLv);
            this.viewProp.m_beeSpeed.isMax = false;
            let gold=data.beeSpeedCutGold;
            let enougth=Tools.getIns().canUseItemNotTips(gold,3);
            this.viewProp.m_beeSpeed.gray=!enougth;
            this.viewProp.m_beeSpeed_Ad.visible=!enougth;
            this.viewProp.m_beeSpeed_gold.text = G_Utils.bigNumber2StrNumber(BigNumber(gold));
        } else {
            this.viewProp.m_beeSpeed_gold.text = 0;
            this.viewProp.m_beeSpeed_Ad.visible=false;
            this.viewProp.m_beeSpeed.isMax = true;
            this.viewProp.m_beeSpeed.gray=true;
        }

        this.viewProp.m_beeSpeed_count.text = speedLv;

        //增加蜜蜂
        let times = GameMgr.getPlayerInfo().getBuyBeeTimes();
        
        

        if (times < max) {
            let data = G_GameDB.getGrowUpByID(times);
            this.viewProp.m_beeAdd.isMax = false;
            let gold=data.beeBuy;
            this.viewProp.m_beeAdd_gold.text = G_Utils.bigNumber2StrNumber(BigNumber(gold));
            let enougth=Tools.getIns().canUseItemNotTips(gold,3);
            this.viewProp.m_beeAdd.gray=!enougth;
            this.viewProp.m_beeAdd_Ad.visible=!enougth;
        } else {
            this.viewProp.m_beeAdd_Ad.visible=false;
            this.viewProp.m_beeAdd.isMax = true;
            this.viewProp.m_beeAdd_gold.text = 0;
            this.viewProp.m_beeAdd.gray=true;
        }

        this.viewProp.m_beeAdd_count.text = times;
    }


    refershCapacityStore() {
        let lv = GameMgr.getPlayerInfo().getContainLv();
        let max = GrowUp.getIns().maxId;
        if (lv < max) {
            let data = G_GameDB.getGrowUpByID(lv);
            this.viewProp.m_capacityAdd.isMax = false;
            let gold=data.pCapacityGold;
            let enougth=Tools.getIns().canUseItemNotTips(gold,3);
            this.viewProp.m_capacityAdd_Ad.visible=!enougth;
            this.viewProp.m_capacityAdd.gray=!enougth;
            this.viewProp.m_capacityAdd_gold.text = G_Utils.bigNumber2StrNumber(BigNumber(gold));
        } else {
            this.viewProp.m_capacityAdd_Ad.visible=false;
            this.viewProp.m_capacityAdd_gold.text = 0;
            this.viewProp.m_capacityAdd.gray = true;
            this.viewProp.m_capacityAdd.isMax = true;
        }

        this.viewProp.m_capacityAdd_count.text = lv;

        //增加蜜蜂
        lv = GameMgr.getPlayerInfo().getHurtLv();

        if (lv < max) {
            let data = G_GameDB.getGrowUpByID(lv);
            this.viewProp.m_daoHurt.isMax = false;
            let gold=data.pHurtGold;
            let enougth=Tools.getIns().canUseItemNotTips(gold,3);
            this.viewProp.m_daoHurt_Ad.visible=!enougth;
            this.viewProp.m_daoHurt.gray=!enougth;
            this.viewProp.m_daoHurt_gold.text = G_Utils.bigNumber2StrNumber(BigNumber(gold));
        } else {
            this.viewProp.m_daoHurt.isMax = true;
            this.viewProp.m_daoHurt_gold.text = 0;
            this.viewProp.m_daoHurt_Ad.visible=false;
            this.viewProp.m_daoHurt.gray=true;
        }

        this.viewProp.m_daoHurt_count.text = lv;
    }


    refershNextLvStroe() {
        let lv = GameMgr.getPlayerInfo().getShowLevelCount();
        let max = GrowUp.getIns().maxId;

        if (lv < max) {
            this.viewProp.m_toNext_by_honey.isMax = false;
            this.viewProp.m_toNext_by_gold.isMax = false;
            this.viewProp.m_to_next_gold.text = G_Utils.bigNumber2StrNumber(GrowUp.getIns().getNextLvGold(lv));
            this.viewProp.m_to_next_honey.text = this.viewProp.m_to_next_gold.text;
        } else {
            this.viewProp.m_toNext_by_gold.isMax = true;
            this.viewProp.m_toNext_by_honey.isMax = true;
            this.viewProp.m_to_next_gold.text = 0;
            this.viewProp.m_to_next_honey.text = this.viewProp.m_to_next_gold.text;
        }
    }


    refershBeeConBineStore() {

    }

    /**
     * 开启商店的ui
     * @param {*} type 
     */
    openStoreUI(type, storeMgr) {
        this.storeTween.end();
        this.storeTween.clearTarget();
        this.curStoreMgr = storeMgr;
        if (type == 2) {
            this.curStoreUI = this.viewProp.m_beeStore;
            this.refershBuyBeeStore();
        } else if (type == 3) {
            this.refershCapacityStore();
            this.curStoreUI = this.viewProp.m_capacityStore;
        } else if (type == 1) {
            this.curStoreUI = this.viewProp.m_sellView;
        } else if (type == 4) {
            this.curStoreUI = this.viewProp.m_next_lv;
            this.refershNextLvStroe();
        } else if (type == 5) {
            this.curStoreUI = this.viewProp.m_beeChange;
            this.refershBeeConBineStore();
        }


        if (this.curStoreUI) {
            this.curStoreUI.visible = true;
            this.storeTween.setTarget(this.curStoreUI);
            this.storeTween.play();
        }

    }

    /**
     * 隐藏商店
     */
    hideStore() {
        if (this.curStoreUI) {
            this.curStoreUI.visible = false;
        }
    }

    /**
     * 显示售出的金币
     * @param {*} val 
     */
    showSellGold(val) {
        this.viewProp.m_sellView_gold.text = G_Utils.bigNumber2StrNumber(val, 2);
    }

    /**
     * 关闭商店的ui
     * @param {*} type 
     */
    closeStoreUI(type, storeMgr) {
        this.curStoreMgr = null;
        if (this.curStoreUI) {
            this.storeCloseTween.clearEndFun();
            this.storeCloseTween.end();
            this.storeCloseTween.clearTarget();
            this.storeCloseTween.setTarget(this.curStoreUI);

            this.storeCloseTween.setEndCallBack(() => {
                if (this.curStoreUI) {
                    this.curStoreUI.visible = false;
                    this.curStoreUI = null;
                }
            })
            this.storeCloseTween.play();
        }

    }


    onUpdate() {
        if (this.curStoreMgr && this.curStoreUI) {
            let pos = this.curStoreMgr.owner.transform.position;
            let tempPos = MapMgr.getIns().cameraMgr.worldPosToScreenPos(pos);
            this.curStoreUI.pos(tempPos.x, tempPos.y - 200);
        }
    }

    pageClose() {
        super.pageClose();
        this.dragCrol.clearCallBackFun();
    }


    timeDownFun() {
        if (GameMgr.getIns().isPause) {
            return;
        }

        this.curDownTime += 1;
        let tIndex = this.downTime - this.curDownTime;
        if (tIndex > 0) {
            this.viewProp.m_timer_down.skin = "game/gameView/time{0}.png".format(tIndex);
        }

        G_SoundMgr.playSound(GG_SoundName.SN_Mp3.format("timeDown"));

        let node = this.viewProp.m_timer_down;
        let tween = node.tween;
        if (tween) {
            tween.clear();
            tween = null;
        }
        node.scaleX = 1;
        node.scaleY = 1;
        node.alpha = 1;
        tween = Laya.Tween.to(node, { scaleX: 2, scaleY: 2, alpha: 0 }, 400, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
            tween = node.tween;
            if (tween) {
                tween.clear();
                tween = null;
            }
            Laya.Tween.to(node, { scaleX: 1, scaleY: 1, alpha: 1 }, 100, Laya.Ease.linearOut);
            node.tween = tween;
        }), null, 0, true, false);
        node.tween = tween;
        if (this.downTime - this.curDownTime <= 0) {
            this.closeTimerDown();
        }
    }

    openTimeDown(time = 5, callBack) {

        if (this.isShowTimer) {
            return;
        }
        this.timeDownCb = callBack;
        this.isShowTimer = true;
        this.downTime = time;
        this.viewProp.m_timer_down.visible = true;
        this.curDownTime = 0;
        this.viewProp.m_timer_down.skin = "game/gameView/time{0}.png".format(this.downTime);

        Laya.timer.loop(1000, this, this.timeDownFun);
    }

    closeTimerDown() {
        Tools.getIns().handlerFun(this.timeDownCb);
        this.timeDownCb = null;
        this.isShowTimer = false;
        this.viewProp.m_timer_down.visible = false;
        Laya.timer.clear(this, this.timeDownFun);
    }






    addListerner() {
        super.addListerner();
        G_Event.addEventListerner(G_EventName.GAMESTART, this.gameStart, this);
        G_Event.addEventListerner(G_EventName.END_CHECK_OVER, this.gameOver, this);
    }

    removeListerner() {
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.GAMESTART, this.gameStart, this);
        G_Event.removeEventListerner(G_EventName.END_CHECK_OVER, this.gameOver, this);
    }

    refershNative() {

    }

    /**
     * 开始教程
     */
    startTeach() {
        if (this.isStartTeach) {
            return;
        }
        this.isStartTeach = true;
    }

    /**
     * 教程结束(游戏开始第一帧)
     */
    endTeach() {
        if (!this.isStartTeach) {
            return;
        }

        this.isStartTeach = false;

    }


}
