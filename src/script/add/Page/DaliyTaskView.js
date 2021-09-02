import NativeInsert from "../gameMgr/NativeInsert";
import DaliyTaskItem from "../item/DaliyTaskItem";
import DailyTaskMgr from "../Mgr/DailyTaskMgr";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import PlatAction from "../UIFrame/PlatAction";
import Tools from "../UIFrame/Tools";


export default class DaliyTaskView extends PageBase {
    constructor() {
        super();
        this.isNeedTween = true;
        this.adObj = new Object();
        this.adObj.num = 2;
    }


    pageInit() {
        super.pageInit();
        this.m_oppo_native=this.viewProp.m_oppo_native.getComponent(NativeInsert);
        this.m_oppo_native.init();
        if (G_PlatHelper.isOPPOPlatform()) {
            this.adObj.num = -1;
        }else if(G_PlatHelper.isVIVOPlatform()){
            this.adObj.num = 2;
        } else {
            this.adObj.num = -1;
        }

        this.viewProp.m_close.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().DaliyTaskView);
            });
        });
        this.m_oppo_native.refershNative();
        //初始化所有任务
        this.initTask();
    }

    initTask() {
        let data = [];

        let taskLine = DailyTaskMgr.getIns().taskLine;
        for (let i = 0; i < taskLine.length; i++) {
            let taskData = G_GameDB.getDailyTaskByID(taskLine[i]);
            if (taskData) {
                data.push(taskData);
            } else {
                console.error("任务id错误:", taskLine[i]);
            }

        }


        this.viewProp.m_list.array = data;
        this.viewProp.m_list.renderHandler = new Laya.Handler(this, this.taskRender);
        this.viewProp.m_list.repeatY = data.length;
    }


    taskRender(cell, index) {
        let mgr = cell.getComponent(DaliyTaskItem);
        if (!mgr) {
            mgr = cell.addComponent(DaliyTaskItem);
            mgr.init();
        }

        mgr.setData(this.viewProp.m_list.getItem(index));
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.refreshList();
        this.autoToTraget();
        this.refershNative();
    }

    refershNative() {
        this.m_oppo_native.hideUI()
        if(G_PlatHelper.isOPPOPlatform()){
            this.m_oppo_native.showUI();
        }
    }


    showAdCallBack(){
        super.showAdCallBack();
        PlatAction.getIns().createTwoCustomAd();
    }


    refreshList() {
        this.viewProp.m_list.refresh();
    }

    autoToTraget() {
        let index = 0;
        let curTaskId = DailyTaskMgr.getIns().getTaskId();
        let taskLine = DailyTaskMgr.getIns().taskLine;
        for (let i = 0; i < taskLine.length; i++) {
            if (taskLine[i] == curTaskId) {
                index = i;
                break;
            }
        }
        this.viewProp.m_list.tweenTo(index, 500);
    }

}