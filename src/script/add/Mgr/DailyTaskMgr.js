import Tools from "../UIFrame/Tools";
import GameMgr from "./GameMgr";


/**
 * 日常任务
 */
export default class DailyTaskMgr {

    constructor() {
        this.curTaskData = null;
        this.curTaskConfig = null;

        this.startTaskId = 1;

        this.taskLine = [];
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new DailyTaskMgr();
            this.instance.init();
        }

        return this.instance;
    }
    

    init() {

    }

    setTaskLine(taskLine) {
        this.taskLine = taskLine;
    }

    getIdInLineIndex(id) {
        return this.taskLine.indexOf(id);
    }

    getRewardData(taskReward) {
        let objs = [];
        let temp = taskReward.split(',');
        let temp1 = [];
        for (let i = 0; i < temp.length; i++) {
            let obj={};
            temp1 = temp[i].split('&');
            obj.type=parseInt(temp1[0]);
            obj.count=parseInt(temp1[1])
            if(temp1[2]){
                obj.paraId=parseInt(temp1[2]);
            }
            objs.push(obj);
        }

        return objs;
    }

    initTaskLine() {
        //初始化任务主线
        this.taskLine = [];
        let id = this.startTaskId;
        let index=0;
        while (true) {
            index++;
            let taskData = G_GameDB.getDailyTaskByID(id);
            if (taskData) {
                this.taskLine.push(taskData.id);
            } else {
                break;
            }
            let temp = taskData.nextTask.split('&');
            if (temp[0] != "0") {
                let index = Tools.getIns().randomNum(0, temp.length - 1)
                id = parseInt(temp[index]);
            } else {
                break;
            }

            if(index>100){
                console.error("任务线存在死循环")
                break;
            }
        }
        GameMgr.getPlayerInfo().setTaskLine(this.taskLine.concat())

    }

    isOpen() {
        return true;
    }

    canGetReward(taskId) {
        let taskData = GameMgr.getPlayerInfo().getTaskData(taskId);

        return taskData.state == 1;
    }

    getTaskReward(taskId) {
        let taskData = G_GameDB.getDailyTaskByID(taskId);
        let rewardObj = this.getRewardData(taskData.taskReward);

        //设置当前奖励已经领取
        let curTaskData = GameMgr.getPlayerInfo().getTaskData(taskId);
        curTaskData.state = 2;

        //设置下一步任务
        this.toNextTask();

        let obj = new Object();
        obj.rewardData = rewardObj;
       
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetRewardView, obj);
    }

    getTaskId() {
        let curTaskId = GameMgr.getPlayerInfo().getTaskId();
        if (curTaskId <= 0) {//默认初始任务为1
            curTaskId = 1;
            GameMgr.getPlayerInfo().setTaskId(curTaskId);
        }

        return curTaskId;
    }

    hasTask() {
        let curTaskId = this.getTaskId();
        let taskData = GameMgr.getPlayerInfo().getTaskData(curTaskId);
        if (!taskData) {
            console.error("任务不存在:", curTaskId);
            return false;
        }
        return taskData.state == 0;
    }

    toNextTask() {
        let curTaskId = this.getTaskId();
        let index = this.taskLine.indexOf(curTaskId);
        if (index + 1 < this.taskLine.length) {
            index++;
            GameMgr.getPlayerInfo().setTaskId(this.taskLine[index]);
        }
    }

    /**
     * 获得击杀的个数
     * @param {*} taskId 
     * @returns 
     */
    getTaskData(taskId) {
        let taskData = G_GameDB.getDailyTaskByID(taskId);

        if (taskData) {
            return taskData;
        } else {
            console.error("任务不存在:", taskId);
            return 0;
        }
    }

    getCurTaskKillCount(taskId) {
        let taskData = GameMgr.getPlayerInfo().getTaskData(taskId);

        if (taskData) {
            return taskData.killCount;
        } else {
            console.error("任务不存在:", taskId);
            return 0;
        }
    }

    addKillCount(diePlayerMgr, killPlayer, count) {

    
        if (GameMgr.getIns().levelType != 1) {
            return;
        }

        if (this.taskHasOutData()) {//任务已经过时
            return;
        }

        let curTaskId = this.getTaskId();
        let taskData = this.getTaskData(curTaskId);
        let temp = taskData.para2.split('&');
        let type = parseInt(temp[0]);
        //拿到条件
        if (type == 0) {
            this.setTaskKillCount(curTaskId, count);
        } else if (type == 1) {//敌人id
            let id = parseInt(temp[1]);
            if (id == diePlayerMgr.playerData.id) {
                this.setTaskKillCount(curTaskId, count);
            }
        } else if (type == 2) {//品质
            let quality = parseInt(temp[1]);
            if (quality == diePlayerMgr.playerData.quality) {
                this.setTaskKillCount(curTaskId, count);
            }
        } else if (type == 3) {//buff
            if (diePlayerMgr.skillMgr.getAllBuffId().length != 0) {
                this.setTaskKillCount(curTaskId, count);
            }

        } else if (type == 4) {//携带buff
            if (killPlayer.skillMgr.getAllBuffId().length != 0) {
                this.setTaskKillCount(curTaskId, count);
            }
        }


    }

    setTaskKillCount(taskId, count) {
        let taskData = GameMgr.getPlayerInfo().getTaskData(taskId);
        if (taskData) {
            taskData.killCount += count;
            
        } else {
            console.error("不存在任务数据:", taskId);
        }

        this.save();
    }

    checkTaskOver() {
        let taskId = this.getTaskId();
        let taskData = GameMgr.getPlayerInfo().getTaskData(taskId);
        if (taskData) {
            if (taskData.state == 0) {
                let taskConfig = G_GameDB.getDailyTaskByID(taskId);
                if (taskConfig.para1 <= taskData.killCount) {//设置任务完成
                    taskData.state = 1;
                }
            }
        }
    }

    hasTime() {
        let taskData = GameMgr.getPlayerInfo().getTaskData(this.getTaskId());
        return taskData.taskTime;
    }

    taskHasOutData() {
        let taskData = GameMgr.getPlayerInfo().getTaskData(this.getTaskId());

        return taskData.taskTime == 0;
    }

    /**
     * 是否有奖励可以领取
     */
    hasReward() {

        let taskId = this.getTaskId();
        //判断是一个是否可以领取
        let index = this.taskLine.indexOf(taskId);
        if (index > 0) {
            let lastTaskId = this.taskLine[index - 1];

            if (this.canGetReward(lastTaskId)) {
                return true;
            }
        }

        return this.canGetReward(this.getTaskId());

    }

    refershTaskTime(save = false) {
        if (!this.curTaskData) {
            this.curTaskData = G_GameDB.getDailyTaskByID(this.getTaskId());
            this.curTaskConfig = GameMgr.getPlayerInfo().getTaskData(this.getTaskId());
        }

        if (this.curTaskData.taskTime == -1) {
            return;
        }

        if (this.curTaskConfig.taskTime == 0) {

            return "任务已经过时!";
        }

        let time = GameMgr.getIns().gameStartTime ;
        let spaceTime = this.curTaskConfig.taskTime * 60 * 1000;


        if (save || spaceTime - time < 0) {
            this.curTaskConfig.taskTime -= time * 0.001 / 60;//取整
            this.curTaskConfig.taskTime = Math.max(0, this.curTaskConfig.taskTime);
            this.curTaskConfig = null;
            this.curTaskData = null;
            this.save();
        }


        return "任务剩余时间:" + G_Utils.convertSecondToHourMinuteSecond(Math.floor((spaceTime - time) / 1000), true);
    }

    save() {
        GameMgr.getPlayerInfo()._serializePlayerInfoIntoLocal();
    }

    getTaskDecs(decs, para1, para2) {
        let temp = para2.split('&');
        switch (temp[0]) {
            case "0":
                return decs.format(para1);
            case "1":
                let enemyData = G_GameDB.getPlayerConfigByID(parseInt(temp[1]));
                return decs.format(para1, enemyData.name);
            case "2":
                let qualityData = G_GameDB.getQualityByID(parseInt(temp[1]));
                return decs.format(para1, qualityData.name);
            case "3":
                return decs.format(para1);
            case "4":
                return decs.format(para1);
        }
    }
}