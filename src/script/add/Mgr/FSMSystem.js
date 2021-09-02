import Tools from "../UIFrame/Tools";

export default class FSMSystem{
    constructor(){
        this._state=-1;
        this._stateData=new Object();
        this._isStart=false;
    }


    /**
     * 添加状态
     * @param {}} state 
     * @param {*} fun 
     */
    addState(state,fun,isLoop=false){
        let obj=new Object();
        this._stateData[state]=obj;
        obj.exeFun=fun;
        obj.isLoop=isLoop;
    }

    startFSM(){
        this._isStart=true;
    }

    endFsm(){
        this._isStart=false;
    }

    removeState(state){
        this._stateData[state]=null;
    }

    /**
     * 状态执行
     */
    stateUpdate(){

        if(!this._isStart){
            return;
        }

        if(this._state!=-1){
            let stateData=this._stateData[this._state];
            if(stateData){
                if(stateData.isLoop){
                    Tools.getIns().handlerFun(stateData.exeFun);
                }
            }
        }
        
    }

    /**
     * 状态切换
     * @param {*} state 
     */
    changeState(state){
        if(this._state!=state){
            this._state=state;
            
            //直接执行 非循环
            let stateData=this._stateData[state];
            if(!stateData.isLoop){
                Tools.getIns().handlerFun(stateData.exeFun);
            }
        }
    }


    getState(){
        return this._state;
    }
}