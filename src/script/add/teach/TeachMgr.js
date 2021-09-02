import GameMgr from "../Mgr/GameMgr";
import TTSumbitData from "../Mgr/TTSumbitData";

import Tools from "../UIFrame/Tools";


export default class TeachMgr extends Laya.Script {

    constructor() {
        super();
        this.teachBtns = [];
        this.curTeachId = null;
        this.curTeachKey = null;
        this.waitEnableTeachId = null;
        this.waitEnableTeachKey = null;

        this.teachEnableFun = new Object();
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new TeachMgr();
            this.instance.init();
        }

        return this.instance;
    }


    init() {

    }

    checkStartTeach() {
        let lastTeachId=GameMgr.getPlayerInfo().getCurTeachId();
        if(lastTeachId==0){
            this.enableTeachStep(1);
            return;
        }

        // let teachData = G_GameDB.getTeachByID(lastTeachId);
        // if (teachData) {
        //     let nextId =teachData.nextId;
        //     if(nextId==-2){
        //         nextId=teachData.id+1;
        //     }else if(nextId==-1){
        //         return;
        //     }

        //     this.enableTeachStep(nextId);
               
        // }
    }

    addTeachFun(key, fun) {
        if (!this.teachEnableFun[key]) {
            this.teachEnableFun[key] = [];
        }

        this.teachEnableFun[key].push(fun);
    }

    exeTeachFun(key) {
        if (this.teachEnableFun[key]) {
            let eves = this.teachEnableFun[key];
            for (let i = 0; i < eves.length; i++) {
                Tools.getIns().handlerFun(eves[i]);
            }
        }
    }

    removeTeachFun(key, fun) {
        if (this.teachEnableFun[key]) {
            let index = this.teachEnableFun[key].indexOf(fun);
            if (index >= 0) {
                this.teachEnableFun[key].splice(index, 1);
            }
        }
    }

    addTeachBtn(teachBtn) {
        if (this.teachBtns.indexOf(teachBtn) < 0) {
            this.teachBtns.push(teachBtn);

            if (this.waitEnableTeachKey && this.waitEnableTeachKey == teachBtn.getStepKey()) {
                this.enableTeachStep(this.waitEnableTeachId);
                this.waitEnableTeachId = null;
                this.waitEnableTeachKey = null;
            }
        }
    }

    getCurTeachId() {
        return this.curTeachId;
    }

    getWaitEnableTeachKey(){
        return this.waitEnableTeachKey;
    }

    getCurTeachKey() {
        return this.curTeachKey;
    }

    removeTeachBtn(teachBtn) {
        let index = this.teachBtns.indexOf(teachBtn);
        if (index >= 0) {
            this.teachBtns.splice(index, 1);
        }
    }

    enableTeachStep(id) {
        
        let teachData = G_GameDB.getTeachByID(id);
        if (!teachData) {
            console.error("激活教程问题：", id);
            return;
        }
        let teachKey = teachData.btnKey;
        let teachBtn = this.getTeachBtn(teachKey);
        if (!teachBtn) {
            this.waitEnableTeachId = id;
            this.waitEnableTeachKey = teachKey;
            
            return;
        }

        if (teachData.isPause == 1) {
            GameMgr.getIns().gamePause();
        }
        this.curTeachId = id;
        this.curTeachKey = teachKey;
        let obj = new Object();
        obj.target = teachBtn;
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().TeachView, obj);
        this.exeTeachFun(teachKey);
    }

    getTeachBtn(key) {
        for (let i = 0; i < this.teachBtns.length; i++) {
            if (this.teachBtns[i].getStepKey() == key) {
                return this.teachBtns[i];
            }
        }

        return null;
    }

    closeTeachStep(key) {//关闭教程

        if (!this.curTeachId) {
            return;
        }
        let lastTeachId = this.curTeachId;
        G_PlayerInfo.setTeachId(lastTeachId);
        this.clearTeachCache();
        let lastTeachData = G_GameDB.getTeachByID(lastTeachId);
        if (lastTeachData.isPause == 1) {
            GameMgr.getIns().gameResume();
        }
        if (!lastTeachData || (lastTeachData && lastTeachData.btnKey != key)) {
            console.error("教程关闭问题:", key, lastTeachId);
            return;
        }
        this.teachSumbit(lastTeachId)
        let nextId = lastTeachData.nextId;
        if (nextId == -2) {
            nextId=lastTeachData.id+1;
        } else if (nextId == -1) {
            return;
        }

        let teachData = G_GameDB.getTeachByID(nextId);


        if (!teachData) {
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TeachView);
            return;
        }
        this.enableTeachStep(nextId);
    }

    /**
     * 教程上报
     * @param {} id 
     */
    teachSumbit(id){
        if(id==1){//点击开始游戏
            TTSumbitData.getIns().Enter_click(4);
        }else if(id==2){//点击闯关模式
            TTSumbitData.getIns().Enter_click(5);
        }else if(id==8){//完成方向引导
            TTSumbitData.getIns().Enter_click(6);
        }else if(id==13){//完成撞击引导
           
        }
    }

    clearTeachCache() {
        this.curTeachKey = null;
        this.curTeachId = null;
    }

    

    teachViewCloseStep() {
        let teachView = GameMgr.getUIMgr().getPageByName(GameMgr.getUIName().TeachView);
        if (teachView) {
            teachView.closeFun();
        } else {
            console.error("教程界面不存在");
        }
    }

    closeCurTeachStep() {
        if (this.curTeachKey) {
            this.teachViewCloseStep();
        }
    }

    hasTeach() {
        return this.curTeachId != null;
    }

    
}