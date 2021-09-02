import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";


import WindowBase from "./WindowBase";

export default class GetEggsCube extends WindowBase{
    constructor(){
        super();
        this.rewardData=null;

        let vals=[];
        this.eggTween=new ContinuousTweenMgr();
        vals.push({time:1000,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearNone});
        vals.push({time:1000,prop:{scaleX:1.2,scaleY:1.2},ease:Laya.Ease.quadOut});
        vals.push({time:1000,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.quadIn});
        this.eggTween.setTweenVals(vals);
        this.eggTween.setLoop(true);
    }

    pageInit(){
        super.pageInit();
        this.eggTween.setTarget(this.viewProp.m_egg);
        this.eggTween.play();
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.rewardData=vals.eggData;
        this.viewProp.m_egg.skin="game/Eggs/c{0}.png".format(this.rewardData.id+1);
    }

    toGetReward(){
        GameMgr.getPlayerInfo().setEggsCube(this.rewardData.id+1);
        let obj=new Object();
        obj.eggData=this.rewardData;
        GameMgr.getUIMgr().openUI(GameMgr.getUIName().EggsClue,obj);
        this.closeWindow();
    }
}