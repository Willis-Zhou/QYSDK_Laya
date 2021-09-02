import GameMgr from "../Mgr/GameMgr";

export default class GrowUp{

    constructor(){
        this.maxId=1;
    }

    static getIns(){
        if(!this.ins){
            this.ins=new GrowUp();
            this.ins.init();
        }

        return this.ins;
    }

    init(){
        this.maxId=G_GameDB.getGrowUpByID(G_GameDB.getAllGrowUps().length-1).id;
    }


    getBeeSpeedGold(id){
        return BigNumber(G_GameDB.getGrowUpByID(id).beeSpeedCutGold);
    }

    getBeeBuyTimesGold(id){
        return BigNumber(G_GameDB.getGrowUpByID(id).beeBuy);
    }

    getCapacityGold(id){
        return BigNumber(G_GameDB.getGrowUpByID(id).pCapacityGold);
    }

    getHurtGold(id){
        return BigNumber(G_GameDB.getGrowUpByID(id).pHurtGold);
    }

    getNextLvGold(id){
        return BigNumber(G_GameDB.getGrowUpByID(id).toNextLvGold);
    }
}