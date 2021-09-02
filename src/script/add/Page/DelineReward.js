import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";


export default class DelineReward extends PageBase{
    constructor(){
        super();
        this.chineseName="离线奖励";
        this.adObj=new Object();
        this.adObj.num=2;
        this.isNeedTween=true;
        this.count=0;
        this.isShowTop=false;

        this.isViewAd=false;

        this.isForceShowVideo=false;//是否强制显示视频
        this.isClickCheck=false;
        this.foreceSelect=false;
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_three_btn.on(Laya.Event.CLICK,this,()=>{

            Tools.getIns().btnAction(this.viewProp.m_three_btn,()=>{
                this.toGetReward(true,this.isViewAd&&!this.isClickCheck);
            });
            
        });

        this.viewProp.m_cancel.on(Laya.Event.CLICK,this,()=>{
            Tools.getIns().btnAction(this.viewProp.m_cancel,()=>{
                this.toGetReward(false);
            });
           
        });
      

        this.viewProp.m_check_box.on(Laya.Event.CLICK,null,()=>{

            this.isClickCheck=true;
            this.isViewAd=!this.isViewAd;
            this.setCheckBox(this.isViewAd);
        })


    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.count=vals.count;
        this.isClickCheck=false;
        this.viewProp.m_diam_count.text=G_Utils.bigNumber2StrNumber(this.count);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_three_btn);
        this.viewProp.m_ef.rotation=0;
        this.foreceSelect=MistakeMgr.getIns().getForeceSelect();
        this.isViewAd=this.foreceSelect;
        this.isForceShowVideo=this.isViewAd;

        this.viewProp.m_check_box.visible=this.isViewAd;
        
        
        this.setCheckBox(this.isViewAd);
    }

    toGetReward(ad,isMiss=false){
        if(this.foreceSelect&&this.isForceShowVideo){
            this.isForceShowVideo=false;
            ad=true;
            isMiss=true;
        }
        
        if(ad){
            Tools.getIns().shareOrAd(this.viewProp.m_three_btn,()=>{

                if(isMiss){
                
                }else{
                  
                }
                
                GameMgr.getPlayerInfo().addItemByType(3,this.count*3,0);
                GameMgr.getUIMgr().closeUI(GameMgr.getUIName().DelineReward);
            },()=>{

               
            });
        }else{
            GameMgr.getPlayerInfo().addItemByType(3,this.count);
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().DelineReward);
        }
    }

    onUpdate(){
        this.viewProp.m_ef.rotation+=1;
    }

    setCheckBox(show){
        this.viewProp.m_check_box.selected=show;


        if(show){

            this.viewProp.m_cancel.text="好的";
        }else{
            this.viewProp.m_cancel.text="普通领取";
        }
    }
}