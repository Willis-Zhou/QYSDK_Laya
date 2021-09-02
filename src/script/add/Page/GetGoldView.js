import GameMgr from "../Mgr/GameMgr";
import TTSumbitData from "../Mgr/TTSumbitData";


import WindowBase from "./WindowBase";

export default class GetGoldView extends WindowBase {

    constructor() {
        super();
        this.chineseName = "领取金币";
        this.diamNum = 10000;
        this.dayLimit = 10;
    }



    pageInit() {
        super.pageInit();
        this.viewProp.m_gold_count.text = "+" + G_Utils.bigNumber2StrNumber(BigNumber(this.diamNum));


    }

    canViewVideo() {
        if (!this.canGetGold()) {
            G_PlatHelper.showToast("今日次数已经用完!");
            return false;
        }

        return true;
    }

    canGetGold() {
        return this.dayLimit - GameMgr.getPlayerInfo().getAdGoldTimes() > 0;
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.refershLimit();
        TTSumbitData.getIns().Video_show(10004);
    }

    refershLimit() {
        this.viewProp.m_limit.text = "每日限制次数 {0}/{1}".format(this.dayLimit - GameMgr.getPlayerInfo().getAdGoldTimes(), this.dayLimit);
    }

    startGetVideo() {
        super.startGetVideo();
        TTSumbitData.getIns().Video_broadcast(10004, 2);
    }

    getVideoEnd(succ) {
        super.getVideoEnd(succ);

        if (succ) {
            TTSumbitData.getIns().Video_broadcast(10004, 4);
        } else {
            TTSumbitData.getIns().Video_broadcast(10004, 3);
        }
    }

    toGetReward() {
        super.toGetReward();
        GameMgr.getPlayerInfo().addGoldTimes();
        G_SoundMgr.playSound(GG_SoundName.SN_Mp3.format("revivecoin"));
        let obj = new Object();
        obj.rewardData = [];
        obj.rewardData.push({ type: 3, count: this.diamNum });
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj);
        this.refershLimit();
        
    }

}