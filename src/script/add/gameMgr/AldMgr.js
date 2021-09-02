import TTSumbitData from "../Mgr/TTSumbitData";

export default class AldMgr {
    constructor(){

    }

    static getIns(){
        if (!this.instance) {
            this.instance=new AldMgr();
            this.instance.init();
        }

        return this.instance;
    }

    init(){

    }

    gameStartSumbit(lv){
        let wx=window.wx;
        if(wx&&wx.aldStage&&window.wx.onStart){
            wx.aldStage.onStart({
                stageId   : lv, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
                stageName : "第{0}关".format(lv),//关卡名称，该字段必传
            })
        }

        G_Reportor.report(G_ReportEventName.EN_GAMESTART,{
            stageId   : lv+"", //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName : "第{0}关".format(lv),//关卡名称，该字段必传
        });

        TTSumbitData.getIns().Level_show({lv:lv});
    }

    gameEndSumbit(obj){
    
        let sgin="complete";
        let des="通关成功";
        if(!obj.isWin){
            sgin="fail";
            des="通关失败";
        }

        let wx=window.wx;
        if(wx&&wx.aldStage&&wx.aldStage.onEnd){
            wx.aldStage.onEnd({
                stageId   : obj.lv,    //关卡ID 该字段必传
                stageName : "第{0}关".format(obj.lv), //关卡名称  该字段必传
                event     : sgin,   //关卡完成  关卡进行中，用户触发的操作    该字段必传
                params    : {
                  desc    : des  //描述
                }
              })
        }

        G_Reportor.report(G_ReportEventName.EN_GAMEEND,{
            stageId   : ""+obj.lv,    //关卡ID 该字段必传
            stageName : "第{0}关".format(obj.lv), //关卡名称  该字段必传
            event     : sgin,   //关卡完成  关卡进行中，用户触发的操作    该字段必传
        })

        if(obj.isWin){
            TTSumbitData.getIns().Level_win(obj);
        }else{
            TTSumbitData.getIns().Level_fail(obj);
        }
    }
}