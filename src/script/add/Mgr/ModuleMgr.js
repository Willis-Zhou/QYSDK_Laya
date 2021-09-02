import GameMgr from "./GameMgr";

export default class ModuleMgr{
    constructor(){
        this.notLimitOpenLv=5;
        this.driverOpenLevel=5;
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new ModuleMgr();
            this.instance.init();
        }

        return this.instance;
    }


    init(){

    }

    isOpen(){
        if(G_PlatHelper.isWINPlatform()){
            return true;
        }

        return false;
    }

    isOpenNotLimit(){
        if(this.isOpen()){
            return true;
        }
        return GameMgr.getPlayerInfo().getShowLevelCount()>=this.notLimitOpenLv;
    }

    getNotLimitOpenTips(){
        return "通关第{0}关开启!".format(this.notLimitOpenLv);
    }
  
    isOpenDriver(){
        if(this.isOpen()){
            return true;
        }

        return GameMgr.getPlayerInfo().getShowLevelCount()>=this.driverOpenLevel;
    }

    getDriverOpenTips(){
        return "通关第{0}关开启!".format(this.driverOpenLevel);
    }
}