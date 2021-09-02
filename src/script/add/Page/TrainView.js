import TrainItem from "../item/TrainItem";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class TrainView extends PageBase {
    constructor() {
        super();
        this.isShowTop = true;
        this.isToGame = false;
        this.isTweenOpen = false;
        this.adObj=new Object();
    }

    pageInit() {
        super.pageInit();

        if(G_PlatHelper.isOVPlatform()){
            this.adObj.num=2;
        }else{
            this.adObj.num=-1;
        }

        this.viewProp.m_back.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_back, () => {
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TrainView);
            })
        });

        this.viewProp.m_list.renderHandler = new Laya.Handler(this, this.trainRender);

        let data = DriverLicense.getIns().getAllLicense();

        let array = [];
        let keys = Object.keys(data);
        let key = 0;
        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            array.push(data[key]);
        }
        this.viewProp.m_list.array = array;
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.isTweenOpen = true;
        this.refreshList();
        this.isToGame = false;
    }

    refreshList() {
        this.viewProp.m_list.refresh();
    }

    trainRender(cell, index) {
        let mgr = cell.getComponent(TrainItem);
        if (!mgr) {
            mgr = cell.addComponent(TrainItem);
            mgr.init();
        }

        if (this.isTweenOpen) {
            let len = this.viewProp.m_list.array.length
            if (index == len - 1) {
                this.isTweenOpen = false;
            }


            if (!cell.toX && cell.toX != 0) {
                cell.toX = cell.x;

            }
            let toX = cell.toX;
            cell.x = toX + 500;
            if (cell.lTween) {
                cell.lTween.clear();
                cell.lTween = null;
            }

            cell.lTween = Laya.Tween.to(cell, { x: toX }, 500 + (len - index) * 40, Laya.Ease.quintOut, null, 40 * index, true, false);


        }

        mgr.setData(this.viewProp.m_list.getItem(index));
    }

    toGame(data, useItem = true) {
        if (this.isToGame) {
            return;
        }

        this.isToGame = true;
        //花费
        if (useItem) {
            let temp = data.useMat.split('&');
            let type = parseInt(temp[0]);
            let count = parseInt(temp[1]);
            if (!Tools.getIns().canUseItem(count, type)) {
                this.isToGame = false;
                return;
            }
            Tools.getIns().useItem(count, type);
        }

        GameMgr.getIns().toGame(data.id, 2);
    }
}