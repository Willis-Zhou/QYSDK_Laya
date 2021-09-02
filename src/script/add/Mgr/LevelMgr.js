export default class LevelMgr{
    constructor(){
        this.levelData=null;

        this.hurtPoint={};
        this.fallHoney={};
    }

    static getIns(){
        if(!this.ins){
            this.ins=new LevelMgr();
        }

        return this.ins;
    }


    init(){

    }

    /**
     * 设置关卡数据
     * @param {*} levelData 
     */
    setLevelData(levelData){
        this.levelData=levelData;

        //赋值
        let hurtPoint=levelData.hurtPoint.split(',');
        let temp=null;
        for(let i=0;i<hurtPoint.length;i++){
            temp=hurtPoint[i].split('&');
            this.hurtPoint[temp[0]]=parseInt(temp[1]);
        }

        let fallHoney=levelData.fallHoney.split(',');
        for(let i=0;i<fallHoney.length;i++){
            temp=fallHoney[i].split('&');
            this.fallHoney[temp[0]]=parseFloat(temp[1]);
        }
    }
}