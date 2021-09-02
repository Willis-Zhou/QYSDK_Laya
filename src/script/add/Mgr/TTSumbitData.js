export default class TTSumbitData {
    constructor() {
        this.subMgr = null;
        /**
         * 1 微信 2 oppo 3 vivo 4头条
         */
        this.plat = 0;
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new TTSumbitData();
        }

        return this.instance;
    }

    init() {

        if (G_PlatHelper.isVIVOPlatform()) {
            this.plat = 3;
        } else if (G_PlatHelper.isOPPOPlatform()) {//oppo
            this.plat = 2;
        } else if (G_PlatHelper.isWXPlatform()) {
            this.plat = 1;
        } else if (G_PlatHelper.isTTPlatform()) {
            this.plat = 4;
        }
        else {
            this.plat = 0;
        }
    }

    setMgr(subMgr) {
        this.subMgr = subMgr;
    }

    /**
     * 视频来源用户数
     */
    Aufromvidio() {
        if (!this.checkPlat()) {
            return;
        }

        if (this.plat == 4) {
            let options = tt.getLaunchOptionsSync();
            let mid = '';
            if (options.group_id) {
                mid = options.group_id;
            }


            if (options.scene == '023001' || options.scene == '023002') {
                this.reportAnalytics('aufromvideo', {
                    videoid: mid,
                })
            }
        }


    }

    /**
     * 首页各入口点击
     * @param {*} set_value 接待客人 暂不接待 打卡上班 领取金币 领取体力 彩蛋
     */
    Enter_click(set_value) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.appOnce({ actionNumber: set_value });
    }

    EnterAction(set_value, para1) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.action({ actionNumber: set_value, actionType: para1 });
    }

    /**
     * 视频入口展示
     * @param {*} set_value 
     */
    Video_show(set_value) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.adVideo({
            type: set_value,
            subType: 7,
        });
    }



    /**
     * 视频播放情况
     */
    Video_broadcast(set_value, type) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.adVideo({
            type: set_value,
            subType: type,
        });
    }

    /**
     * 关卡展示情况
     * @param {*} set_value 
     */
    Level_show(set_value) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.battle({
            logType: 1,
            battleType: 100,
            battleId: (set_value.lv + 100) + ""
        })
    }

    /**
     * 关卡成功
     * @param {*} set_value 
     */
    Level_win(set_value) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.battle({
            logType: 2,
            battleType: 100,
            battleId: (set_value.lv + 100) + ""
        })
    }

    /**
     * 关卡失败
     * @param {*} set_value 
     */
    Level_fail(set_value) {
        if (!this.checkPlat()) {
            return;
        }

        this.subMgr.battle({
            logType: 3,
            battleType: 100,
            battleId: (set_value.lv + 100) + ""
        })
    }

    /**
     * 录屏展示
     */
    Screen_show(set_value) {
        if (!this.checkPlat()) {
            return;
        }
    }

    /**
     * 录屏点击
     */
    Screenc_click(set_value) {
        if (!this.checkPlat()) {
            return;
        }
    }

    /**
     * 录屏拉起
     * @param {*} set_value 
     */
    Screen_get(set_value) {
        if (!this.checkPlat()) {
            return;
        }
    }

    /**
     * 录屏成功
     * @param {*} set_value 
     */
    Screen_over(set_value) {
        this.reportAnalytics('screen_over', {
            user: set_value,
        })
    }

    /**
     * 录屏失败
     */
    Screen_fail(set_value, type) {

        let obj = {};
        if (type == 1) {
            obj.get_fail = set_value;
        } else if (type == 2) {
            obj.publish_fail = set_value;
        } else {
            console.error("提交失败", type);
            return;
        }

        this.reportAnalytics('screen_fail', type)
    }

    reportAnalytics(key, obj) {

        if (!this.checkPlat()) {
            return;
        }


        // if (tt.reportAnalytics) {
        //     tt.reportAnalytics(key, obj);
        // }
    }

    checkPlat() {
        return this.subMgr;
    }
}