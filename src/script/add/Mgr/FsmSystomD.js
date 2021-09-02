import Tools from "../UIFrame/Tools";
import FSMSystem from "./FSMSystem";

/**
 * 两层的状态机
 */
export default class FsmSystomD {
    constructor(){
        this._stateArray=new Object();
        this._isStart=false;
        this._curLayer=-1;
        this._curState=-1;
    }

    /**
     * 
     * @param {*} layer 层
     * @param {*} state 状态
     * @param {*} fun 
     * @param {*} isLoop 
     */
    addState(layer,state,fun,loopFun){
        let stateData=null;
        if(!this._stateArray[layer]){
            this._stateArray[layer]=new Object();
        }

        stateData=this._stateArray[layer];

        if(!stateData[state]){
            stateData[state]=new Object();
        }

        stateData[state].exeFun=fun;
        stateData[state].exeLoopFun=loopFun;
    }

    startFSM(){
        this._isStart=true;
    }

    endFsm(){
        this._isStart=false;
    }

    removeState(layer){
        if(this._stateArray[layer]){
            this._stateArray[layer]=null;
        }
        
    }

    stateUpdate(){

        if(!this._isStart){
            return;
        }

        if(this._curState!=-1&&this._curLayer!=-1){//执行当前状态
            let stateData=this._stateArray[this._curLayer][this._curState];
            if(stateData){
                if(stateData.exeLoopFun){
                    Tools.getIns().handlerFun(stateData.exeLoopFun);
                }
            }
        }

    }

     /**
     * 状态切换
     * @param {*} state 
     */
    changeState(state){
        let stateData =this._stateArray[this._curLayer];
        if(stateData){
            stateData=stateData[state];
            this._curState=state;
            Tools.getIns().handlerFun(stateData.exeFun);
        }else{
            console.error("{0}不存在{1}状态",this._curLayer,state)
        }
    }

    setLayer(layer){
        this._curLayer=layer;
    }

    getLayer(){
        return this._curLayer;
    }

    getState(){
        return this._curState;
    }
}