import OpenBoxItem from "../item/OpenBoxItem";
import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

export default class OpenBoxView extends PageBase {
    constructor() {
        super();

        this.closeFun = null;

        this.boxData = [];

        this.openCount=0;
        this.showMore=true;
       
    }


    pageInit() {
        super.pageInit();
        this.viewProp.m_close.on(Laya.Event.CLICK, this, () => {
            Tools.getIns().btnAction(this.viewProp.m_close, () => {
              MistakeMgr.getIns().clickMistake(this.viewProp.m_close,()=>{
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().OpenBoxView);
              })
            })
        });

        this.viewProp.m_box_list.renderHandler = new Laya.Handler(this, this.boxRender);
        this.initList();

        this.viewProp.m_key_list.renderHandler=new Laya.Handler(this,this.keyRender);

        let data=[1,2,3];
        this.viewProp.m_key_list.array=data;
    }


    keyRender(cell,index){
        cell.getChildAt(0).visible=(3-this.openCount-1)>=index;
    }

    initList() {
        for(let i=1;i<=9;i++){
            let index=i;
            this.boxData.push({id:index,isOpen:false,count:0,isAd:false});
        }

        
    }

    resetList(){
        for(let i=0;i<this.boxData.length;i++){
            this.boxData[i].isOpen=false;

            this.boxData[i].isAd=false;
        }

        //是否显示视频宝箱
        if(MistakeMgr.getIns().showAdBox()||G_PlatHelper.isWINPlatform()){
           let arr= Tools.getIns().getRandomArrayElements(this.boxData,3);
           for(let i=0;i<arr.length;i++){
               arr[i].isAd=true;
           }

         
        }



        this.viewProp.m_box_list.array=this.boxData;
    }

    boxRender(cell, index) {
        let mgr = cell.getComponent(OpenBoxItem);
        if (!mgr) {
            mgr = cell.addComponent(OpenBoxItem);
            mgr.init();
        }

        mgr.setData(cell.dataSource);
    }

    pageOpen(vals) {
        super.pageOpen(vals);
        if (vals) {
            this.closeFun = vals.callBack;
        }
        this.openCount=0;
        this.viewProp.m_close.visible=this.openCount>=3;
        this.resetList();
        MistakeMgr.getIns().resetMisByNode(this.viewProp.m_close);
    }

    pageClose() {
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }

    openBox(id,isAd){

        if(!isAd&&!this.hasTimes()){
            G_PlatHelper.showToast("次数不足!");
            return;
        }

        let boxData=null;
        for(let i=0;i<this.boxData.length;i++){
            if(id==this.boxData[i].id){
                boxData=this.boxData[i];
                break;
            }
        }

        if(boxData){
            boxData.count=Tools.getIns().randomNum(20,200)*(isAd?2:1);
            boxData.isOpen=true;

            this.viewProp.m_box_list.changeItem(boxData.id-1,boxData);
        }

        this.openCount++;
        this.viewProp.m_close.visible=this.openCount>=3;
        this.viewProp.m_key_list.refresh();
    }

    /**
     * 判断是否有次数
     */
    hasTimes(){
        return this.openCount<3;
    }
}