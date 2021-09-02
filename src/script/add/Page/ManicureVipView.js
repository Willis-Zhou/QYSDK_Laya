import CameraRecordMgr from "../Mgr/CameraRecordMgr";
import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

/**
 * vip美甲的专用界面
 */
export default class ManicureVipView extends PageBase{
    constructor(){
        super();
        this.chineseName="彩蛋图片领取";
        this.adObj=new Object();
        this.adObj.num=2;
        this.closeFun=null;
        this.imgUrl=null;
        this.nailData=null;
        this.tGold=1000;//通关金币
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_get_icon.on(Laya.Event.CLICK,null,()=>{
            Tools.getIns().btnAction(this.viewProp.m_get_icon,()=>{
                Tools.getIns().shareOrAd(this.viewProp.m_get_icon,()=>{

                   
                    GameMgr.getPlayerInfo().addNailSkinById(this.nailData.id);
                    if(G_PlatHelper.isTTPlatform()){
                        this.toShare(true);
                    }else{
                        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ManicureVipView);
                    }
                    
                },()=>{
                   
                })
            })
        });

        this.viewProp.m_back.on(Laya.Event.CLICK,null,()=>{
            Tools.getIns().btnAction(this.viewProp.m_back,()=>{
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ManicureVipView);
            })
        });

        this.viewProp.m_share.on(Laya.Event.CLICK,null,()=>{
            Tools.getIns().btnAction(this.viewProp.m_share,()=>{
                CameraRecordMgr.getIns().shareVideo((isWin)=>{
                    if(isWin){ 
                        //分享成功
                        GameMgr.getPlayerInfo().addItemByType(3,this.tGold,0);
                        G_PlatHelper.showToast("获得{0}钞票".format(this.tGold));
                        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ManicureVipView);
                    }
                   
                },this.imgUrl)
                
            })
        })

        Tools.getIns().setAdBtnIcon(this.viewProp.m_get_icon);

        this.viewProp.m_gold.text="+"+this.tGold;
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.closeFun=vals.closeFun;
        let nailId=vals.nailId;
        if(MistakeMgr.getIns().getBtnDelayShow()){
            Tools.getIns().playBtnShowNotLimit(this.viewProp.m_back);
        }
        
        let data=this.getData(nailId);
        this.nailData=data;
        this.imgUrl=G_ResPath.nailVipIconPath.format(data.icon)
        this.viewProp.m_icon.skin=this.imgUrl;
        this.toShare(false);
    }

    toShare(show){
        this.viewProp.m_share.visible=show;
        this.viewProp.m_get_icon.visible=!show;
    }

    pageClose(){
        super.pageClose();
        GameMgr.getPlayerInfo().addItemByType(3,this.tGold,0);//把金币加上去
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }

    getData(nailId){
        for(let i=0;i<G_NailSkin.length;i++){
            if(G_NailSkin[i].id==nailId){//找到指甲
                return G_NailSkin[i];
            }
        }

        return null;
    }
}