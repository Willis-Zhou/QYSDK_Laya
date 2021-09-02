import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import ExportAdMgr from "../Mgr/ExportAdMgr";
import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import TTSumbitData from "../Mgr/TTSumbitData";
import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class ReadView extends PageBase {

    constructor() {
        super();
        this.adObj = new Object();
        this.adObj.num = 1;
        this.showMore = true;
        this.isShowTop = true;

        this.fingerTween = new ContinuousTweenMgr();
        this.fingerTween.setLoop(true);
        let vals = [];
        vals.push({ time: 500, prop: { centerX: 226 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 500, prop: { centerX: 120 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 500, prop: { centerX: 226 }, ease: Laya.Ease.linearOut });
        this.fingerTween.setTweenVals(vals);

        this.f1Mgr = null;
        this.f2Mgr = null;

        this.isStart=false;

    }

    pageInit() {
        super.pageInit();

        this.f1Mgr = this.viewProp.m_flowAd1.getComponent(AdvLoadMgr);
        this.f2Mgr = this.viewProp.m_flowAd2.getComponent(AdvLoadMgr);


        this.viewProp.m_btn_setting.on(Laya.Event.CLICK, null, () => {
            Tools.getIns().btnAction(this.viewProp.m_btn_setting, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().SettingView);
            })

        });



        this.viewProp.m_start.on(Laya.Event.CLICK, this, () => {
            this.clickToStart();

        });

        this.viewProp.m_gold_finger.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_gold_finger, () => {
                // GameMgr.getUIMgr().openUI(GameMgr.getUIName().GoldFingerView);
                MapMgr.getIns().changePlayer(1);
            });

        });



        this.viewProp.m_tools.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_tools, () => {
                GameMgr.getUIMgr().openUI(GameMgr.getUIName().ToolsView);
            });
        });

        if (this instanceof ReadView) {
            MapMgr.getIns().readView = this;
        }

        this.fingerTween.setTarget(this.viewProp.m_finger);
        this.fingerTween.play();

        if (G_PlatHelper.isWINPlatform()) {
           // Laya.Stat.show(0, 0);
        }

        if (G_PlatHelper.isWXPlatform()) {
            Laya.timer.loop(2000, this, () => {
                this.f2Mgr.refreshAdv();
                this.f1Mgr.refreshAdv();
            })
        }
    }

    md(event) {
        console.log(event.target);
    }



    pageOpen(val) {
        super.pageOpen(val);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_temp_icon);
        this.refershAdv();
        TTSumbitData.getIns().Video_show(10005);
        this.isStart=false;
        this.viewProp.m_lv_num.value = GameMgr.getPlayerInfo().getShowLevelCount();
    }

    refershAdv() {
        // if (G_PlatHelper.isWXPlatform() && MistakeMgr.getIns().autoShowPop()) {
        //     GameMgr.getUIMgr().openUI(GameMgr.getUIName().PopupView,{viewType:2});
        // }
    }

    clickToStart() {
        if (!GameMgr.getIns().isGameReady()) {
            G_PlatHelper.showToast("游戏正在初始化!");
            return;
        }

        if(this.isStart){
            return;
        }

        this.isStart=true;

        MistakeMgr.getIns().openBoxView(() => {
            if (MistakeMgr.getIns().showStartAd()) {
                Tools.getIns().shareOrAd(this.viewProp.m_temp_icon, () => {
                    this.toStart();
                }, () => {
                    this.toStart();
                })
            } else {
                this.toStart();
            }
        })




    }

    toStart() {
        this.isStart=false;
        this.showMistakeView(() => {
            GameMgr.getIns().gameStart();
        })

    }

    showMistakeView(callBack) {
        if (MistakeMgr.getIns().mistake_boxtype == 1) {
            ExportAdMgr.getIns().showClickBtnView(callBack)
        } else {
            Tools.getIns().handlerFun(callBack);
        }
    }

    pageClose() {
        super.pageClose();
        Laya.timer.clear(this, this.refershAdv);
    }


}