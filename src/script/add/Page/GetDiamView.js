import GameMgr from "../Mgr/GameMgr";
import TTSumbitData from "../Mgr/TTSumbitData";


import WindowBase from "./WindowBase";
export default class GetDiamView extends WindowBase {

    constructor() {
        super();
        this.diamNum = 100;
        this.dayLimit = 10;
    }

    pageInit() {
        super.pageInit();
        this.viewProp.m_diam_count.text = "+" + G_Utils.bigNumber2StrNumber(BigNumber(this.diamNum));

    }
    canViewVideo() {
        if (!this.canGetGold()) {
            G_PlatHelper.showToast("今日次数已经用完!");
            return false;
        }

        return true;
    }

    canGetGold() {
        return this.dayLimit - GameMgr.getPlayerInfo().getCurViewAdGetDaimTimes() > 0;
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.refershLimit();
        TTSumbitData.getIns().Video_show(10002);
    }


    refershLimit() {
        this.viewProp.m_limit.text = "每日限制次数 {0}/{1}".format(this.dayLimit - GameMgr.getPlayerInfo().getCurViewAdGetDaimTimes(), this.dayLimit);
    }

    startGetVideo() {
        super.startGetVideo();
        TTSumbitData.getIns().Video_broadcast(10002, 2);
    }

    getVideoEnd(succ) {
        super.getVideoEnd(succ);
        if (succ) {
            TTSumbitData.getIns().Video_broadcast(10002, 4);
        } else {
            TTSumbitData.getIns().Video_broadcast(10002, 3);
        }
    }

    toGetReward() {
        super.toGetReward();

        G_SoundMgr.playSound(GG_SoundName.SN_Mp3.format("revivecoin"));
        GameMgr.getPlayerInfo().addViewAdGetDianTimes();

        this.refershLimit();
        let obj = new Object();
        obj.rewardData = [];
        obj.rewardData.push({ type: 1, count: this.diamNum });
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj);
    }

}