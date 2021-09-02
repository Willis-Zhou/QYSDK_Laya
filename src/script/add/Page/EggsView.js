import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class EggsView extends PageBase {
    constructor() {
        super();
        this.chineseName = "彩蛋";
        this.adObj = new Object();
        this.adObj.num = 2;
        this.isShowTop = true;

        this.m_low_Tween = new ContinuousTweenMgr();
        let vals = [];
        vals.push({ time: 350, prop: { centerX: -600, ease: Laya.Ease.quintOut } });
        vals.push({ time: 350, prop: { centerX: -271, ease: Laya.Ease.quintOut } });
        this.m_low_Tween.setTweenVals(vals);

        this.m_height_Tween = new ContinuousTweenMgr();
        let vals1 = [];
        vals1.push({ time: 350, prop: { centerX: 600, ease: Laya.Ease.quintOut } });
        vals1.push({ time: 350, prop: { centerX: 271, ease: Laya.Ease.quintOut } });
        this.m_height_Tween.setTweenVals(vals1);

        this.lowPool = [];
        this.heightPool = [];

        this.lowRateMax = 0;
        this.heightPoolMax = 0;
        this.oneUseDiam = 50;
        this.isInDraw = false;
        this.viewAdTenTimes = 5;
    }

    pageInit() {
        super.pageInit();

        if(G_PlatHelper.isOVPlatform()){
            this.adObj.num=2;
        }else{
            this.adObj.num=-1;
        }

        this.initPool();

        this.viewProp.m_low_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_low_btn, () => {
                this.oneDraw();
            })
        });

        this.viewProp.m_height_ad_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_height_ad_btn, () => {
                
                if (this.hasAdTenLuckTimes()) {
                    G_PlatHelper.showToast("今日次数已经用完!");
                    return;
                }
        

                Tools.getIns().shareOrAd(this.viewProp.m_height_ad_btn, () => {
                    this.tenDraw();
                    GameMgr.getPlayerInfo().addViewAdTenLuckTimes();
                    this.refershLimit();
                }, () => {
                    this.isInDraw = false;
                })

            })
        });

        this.viewProp.m_height_diam_btn.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_height_diam_btn, () => {
                let useDiam=this.oneUseDiam*10*0.9;
                if(!Tools.getIns().canUseItem(useDiam,1)){
                    return;
                }
                Tools.getIns().useItem(useDiam,1);
                this.tenDraw();
            })
        });

        this.viewProp.m_close.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().EggsView);
            })
        });

        this.m_low_Tween.setTarget(this.viewProp.m_low);
        this.m_height_Tween.setTarget(this.viewProp.m_height);
        this.viewProp.m_ten_diam.text = this.oneUseDiam * 10 * 0.9;
        this.viewProp.m_one_diam.text = G_Utils.bigNumber2StrNumber(BigNumber(this.oneUseDiam));
    }

    initPool() {
        //初始化池子
        let datas = G_GameDB.getAllEggss();
        let poolTemp = null;
        let type = 0;
        let rate = 0;
        let rateTemp = 0;
        this.lowRateMax = 0;
        this.heightPoolMax = 0;
        let countTemp = null;
        let array = null;
        for (let i = 0; i < datas.length; i++) {
            poolTemp = datas[i].pool.split('&');
            rateTemp = datas[i].poolRate.split('&');
            countTemp = datas[i].count.split('-');
            for (let j = 0; j < poolTemp.length; j++) {
                type = parseInt(poolTemp[j]);
                rate = parseInt(rateTemp[j]);
                if (type == 1) {
                    array = this.lowPool;
                    this.lowRateMax += rate;
                } else if (type == 2) {
                    array = this.heightPool;
                    this.heightPoolMax += rate;
                }

                array.push({ data: datas[i], realRate: rate, countMin: parseInt(countTemp[0]), countMax: parseInt(countTemp[1]) });
            }
        }

    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.refershLimit();
        Tools.getIns().setAdBtnIcon(this.viewProp.m_height_diam_btn)
        Tools.getIns().setAdBtnIcon(this.viewProp.m_height_ad_btn);
    }

    /**
     * 单抽
     */
    oneDraw() {
        if (!Tools.getIns().canUseItem(this.oneUseDiam, 1)) {
            return;
        }

        if (this.isInDraw) {
            return;
        }
        Tools.getIns().useItem(this.oneUseDiam, 1);
        this.isInDraw = true;
        let obj = new Object();
        obj.rewardData = this.getDrawData(this.lowPool, 1, this.lowRateMax);
        obj.closeFun = () => {
            this.isInDraw = false;
        }

        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj)
    }

    refershLimit() {
        this.viewProp.m_height_limit.text = "剩余视频次数:{0}/{1}".format(this.viewAdTenTimes - GameMgr.getPlayerInfo().getViewAdTenLuckTimes(), this.viewAdTenTimes)
    }

    /**
     * 十连抽
     */
    tenDraw() {

      
        if (this.isInDraw) {
            return;
        }
        this.isInDraw=true;


        let obj = new Object();
        obj.rewardData = this.getDrawData(this.heightPool, 10, this.heightPoolMax)
        obj.closeFun = () => {
            this.isInDraw = false;
        }
        
       
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj)



    }

    hasAdTenLuckTimes() {
        return GameMgr.getPlayerInfo().getViewAdTenLuckTimes() >= this.viewAdTenTimes;
    }

    getDrawData(pool, round, maxRate) {
        let rewards = [];

        //随机固定次数
        let rams = [];
        for (let i = 0; i < round; i++) {
            rams.push(Math.random() * maxRate);
        }

        rams.sort((a, b) => {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        })

        let curRate = 0;
        let ramIndex = 0;
        let data = null;
        for (let i = 0; i < pool.length; i++) {
            //随机完成
            if (ramIndex == rams.length) {
                break;
            }
            curRate += pool[i].realRate;
            //判断是否有该区域内的随机数
            for (let j = ramIndex; j < rams.length; j++) {
                if (curRate >= rams[j]) {//该区域内
                    ramIndex = j + 1;
                    data = pool[i].data;
                    rewards.push({
                        eggsId: data.id,
                        type: data.itemType,
                        paraId: data.itemId,
                        count: Tools.getIns().randomNum(pool[i].countMin, pool[i].countMax)
                    });
                } else {//小于直接跳出
                    break;
                }
            }
        }

        rewards.sort(function (a, b) { return 0.5 - Math.random() });
        return rewards;
    }



    tweenOpen(callBack) {

        this.m_height_Tween.setReverse(false);
        this.m_height_Tween.end();

        this.m_low_Tween.setReverse(false);
        this.m_low_Tween.clearEndFun();
        this.m_low_Tween.end();
        this.m_low_Tween.setEndCallBack(() => {
            Tools.getIns().handlerFun(callBack);
        })

        this.m_low_Tween.play();
        this.m_height_Tween.play();

    }

    tweenClose(callBack) {

        this.m_height_Tween.setReverse(true);
        this.m_height_Tween.end();

        this.m_low_Tween.setReverse(true);
        this.m_low_Tween.clearEndFun();
        this.m_low_Tween.end();


        this.m_low_Tween.play();
        this.m_height_Tween.play();

        Laya.timer.once(100, this, () => {
            Tools.getIns().handlerFun(callBack);
        })
    }
}