import CameraRecordMgr from "../Mgr/CameraRecordMgr";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class ShareView extends PageBase{
    constructor(){
        super();
        this.closeFun=null;
        this.isInShare=false;
        this.shareRewardCount=10;
        this.isNeedTween=true;
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_close.on(Laya.Event.CLICK,this,function(){
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ShareView);
        });

        this.viewProp.m_to_share.on(Laya.Event.CLICK,this,function(){
             this.doShare();
        });

        this.viewProp.m_icon.on(Laya.Event.CLICK,this,function(){
            this.doShare();
        });
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.isInShare=false;
        this.closeFun=vals.closeFun;
    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }

    doShare(){

        if(this.isInShare){
            return;
        }
        this.isInShare=true;

        CameraRecordMgr.getIns().shareVideo(function(succ){

            if(succ){
                GameMgr.getPlayerInfo().addItemByType(1,this.shareRewardCount,0);
                G_PlatHelper.showToast("恭喜获得{0}钻石!".format(this.shareRewardCount));
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ShareView);
            }

            this.isInShare=false;
           
        }.bind(this))
    }
}