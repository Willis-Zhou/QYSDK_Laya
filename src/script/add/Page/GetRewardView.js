
import RewardItem from "../item/RewardItem";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class GetRewardView extends PageBase {
    constructor() {
        super();
        this.rewardData = [];
        this.adObj = new Object();
        this.adObj.num = 2;
        this.cellSize = { x: 150, y: 150 };
        this.startPosX = 0;
        this.startPosY = 0;

        this.closeFun = null;
        this.itemList=[];
        this.curItemIndex=0;
        this.isPlay=false;
    }

    pageInit() {
        super.pageInit();
      

        this.viewProp.m_ok.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_ok);
            this.toGetReward();
        });

        this.viewProp.m_reward_list.renderHandler = new Laya.Handler(this, this.rewardRender);
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.rewardData = vals.rewardData;
        this.closeFun = vals.closeFun;
        this.refershNative();
        //计算开始x
        if (this.rewardData.length == 10) {//长度为10 显示两行
            this.viewProp.m_reward_list.repeatY = 2;
            this.viewProp.m_reward_list.repeatX = 5;

            this.startPosX = 0//this.cellSize.x/2;
            this.startPosY = 0//this.cellSize.y/2;

        } else {

            let maxLenX = 5 * this.cellSize.x + 4 * this.viewProp.m_reward_list.spaceX;

            this.viewProp.m_reward_list.repeatY = 1;
            this.viewProp.m_reward_list.repeatX = this.rewardData.length;
            if (this.rewardData.length >= 5) {
                this.startPosX = 0//this.cellSize.x/2;
            } else {
                this.startPosX = this.rewardData.length * this.cellSize.x + (this.rewardData.length - 1) * this.viewProp.m_reward_list.spaceX;
                this.startPosX = (maxLenX - this.startPosX) / 2;

            }

            this.startPosY = this.viewProp.m_reward_list.height / 2 - this.cellSize.y / 2;
        }
        this.itemList.splice(0,this.itemList.length);
        this.curItemIndex=0;
        this.isPlay=false;
        this.viewProp.m_reward_list.array = this.rewardData;
        
    }

    refershNative() {
      
    }

    showItemTween(){
        if(this.curItemIndex>=this.itemList.length){
            return;
        }

        if(!this.isOpen){
            return;
        }

        let cell=this.itemList[this.curItemIndex];
        let type=this.rewardData[this.curItemIndex].type;
        let scale=1.2;

        //皮肤
        if(type==2){
           scale=1.5;
        }
        this.curItemIndex++;

        

        if (cell.tween) {
            cell.tween.clear();
            cell.tween = null;
        }
       
        G_SoundMgr.playSound(GG_SoundName.SN_Mp3.format("collect_item_11_1"))
        cell.tween = Laya.Tween.to(cell, { scaleX: scale, scaleY: scale }, 200, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
            if (cell.tween) {
                cell.tween.clear();
                cell.tween = null;
            }

            cell.tween = Laya.Tween.to(cell, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearIn, null, 0, true, false);
        }), 0, true, false);

        Laya.timer.once(350,this,()=>{
            this.showItemTween();
        })
    }

    rewardRender(cell, index) {

        if (index >= this.rewardData.length) {
            return;
        }
        cell.scaleX = 0;
        cell.scaleY = 0;
        if(index>=this.itemList.length){
            this.itemList.push(cell);
        }

        if(this.itemList.length==this.rewardData.length){
            if(!this.isPlay){
                this.isPlay=true;
                this.showItemTween();
                
            }
        }
        
       
      
        let rY = Math.floor(index / this.viewProp.m_reward_list.repeatX);

        let indexX = index - rY * this.viewProp.m_reward_list.repeatX;
        cell.x = this.startPosX + indexX * (this.cellSize.x + this.viewProp.m_reward_list.spaceX);
        cell.y = this.startPosY + rY * (this.cellSize.y + this.viewProp.m_reward_list.spaceY);
        let rewardMgr = cell.getComponent(RewardItem);
        if (!rewardMgr) {
            rewardMgr = cell.addComponent(RewardItem);
            rewardMgr.init();
        }

        rewardMgr.setData(this.viewProp.m_reward_list.getItem(index));

    }

    pageClose() {
        super.pageClose();
        Laya.timer.clearAll(this);
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun = null;
    }

    toGetReward() {

        for (let i = 0; i < this.rewardData.length; i++) {
            GameMgr.getPlayerInfo().addItemByType(this.rewardData[i].type, this.rewardData[i].count, this.rewardData[i].paraId);
        }

        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().GetRewardView);
    }
}