import GameMgr from "../Mgr/GameMgr";
import MistakeMgr from "../Mgr/MistakeMgr";
import PageBase from "./PageBase";
import PlatAction from "./PlatAction";
import Tools from "./Tools";
export default class MistakePageBase extends PageBase {

    constructor() { 
        super(); 
       
        this.showMore=false;
        this.onckickCount=8;//点击三次
        this.isOpenBox=false;
        this.closeFun=null;
        this.lastOnclickTime=0;//上次点击的时间

        this.updateSpace=500;//更新间隔
        this.downValMin=0.008;//下降最小增值
        this.downValMax=0.008;//下降最大增值
        this.onclickAdd=0.06;//点击增值
        
        
        this.curOnclick=0;//当前点击的次数
        this.tarVar=0.65;//指定值
        this.enableVal=this.tarVar;//产生ad点
        this.minClickVal=7;
        this.maxClickVal=4;
        this.enableClick=this.minClickVal;

        this.isNeedTween=true;

        this.vals=null;

        this.m_mistake_bar=null;


       
    }
    
    setMisBar(bar){
        this.m_mistake_bar=bar;
    }

    pageInit(){
        super.pageInit();


        let mistakeData=MistakeMgr.getIns().getMistakeData();
        if(mistakeData!=null){
            let temp=mistakeData.split('||');
            this.updateSpace=parseInt(temp[0]);
            this.downValMin=parseFloat(temp[1]);
            this.downValMax=parseFloat(temp[2]);
            this.onclickAdd=parseFloat(temp[3]);
            this.tarVar=parseFloat(temp[4])/100;
            let temp01=temp[5].split('-');

            this.minClickVal=parseInt(temp01[0]);
            this.maxClickVal=parseInt(temp01[1]);
        }
    }



    pageOpen(vals){
        super.pageOpen(vals);
        this.vals=vals;
        this.resetBar();
        this.getAdVal();
        if(vals){
            this.closeFun=vals.closeFun;
        }else{
            this.closeFun=null;
        }
 
        G_Scheduler.schedule("mistake_bar_update"+this.id,function(){
            this.barUpdate();
        }.bind(this),false,100,G_Const.C_SCHEDULE_REPEAT_FOREVER);

    }
    

    resetBar(){
        this.m_mistake_bar.value=0;
        this.isOpenBox=false;
    }

    getAdVal(){
        this.enableVal=this.tarVar;
        this.enableVal+=0.05*Math.random();
 
        if(this.enableVal>0.9){//边值处理
            this.enableVal=0.9;
        }
 
        this.enableClick=this.minClickVal;
        this.enableClick+=(this.maxClickVal-this.minClickVal)*Math.random();
        this.curOnclick=0;
    }

    barUpdate(){
        if(this.m_mistake_bar){
            let val=this.m_mistake_bar.value;
            let down=this.downValMin;
            if(G_ServerInfo.getServerTime()-this.lastOnclickTime>this.updateSpace){
                 down=this.downValMax;
            }
            val-=down;
            this.setBarVal(val);
        }
    }

    setBarVal(val){
        val=Math.max(0,val);
        val=Math.min(val,0.95);
        this.m_mistake_bar.value=val;
    }

    onClickBtn(){

        let val=this.m_mistake_bar.value;
        val+=this.onclickAdd;
        if(val>=0.95){
            val=0.95;
        }
        this.setBarVal(val);
        this.lastOnclickTime=G_ServerInfo.getServerTime();
        this.curOnclick++;
        if(this.isOpenBox){
            return;
        }
    
            if(val>this.enableVal&&this.curOnclick>=this.enableClick){
    
                this.isOpenBox=true;
                let self=this;

                let vals=new Object();
                vals.closeFun=function(){
                    GameMgr.getUIMgr().closeUI(self.pageName);
                    
                };

                let openGetFun=function(){
                    Laya.timer.once(2000,this,function(){//延时显示goldview
                        self.mistakeEndFun(vals);
                    })
                }

                openGetFun();
                self.mistakeOpenFun(vals)
                self.showAd();
                return;//开启宝箱
            }else{
                if(val<=this.enableVal){
                    this.curOnclick=0;
                }
               
            }
       }


       pageClose(){
            super.pageClose();
            Tools.getIns().handlerFun(this.closeFun);
            this.closeFun=null;
            G_Scheduler.unschedule("mistake_bar_update"+this.id);
        }

    
        mistakeEndFun(vals){
            
        }

        mistakeOpenFun(vals){

        }
     
        showAd(){

        }

        showBanner(){
            Tools.getIns().cretaeBannerAyn();
        }


        showBox(){
            let self =this;
            PlatAction.getIns().cretaeBoxAd(function(){
                if(!self||!self.isOpen){
                    return;
                }
                self.boxCloseCallBack();
            });
        }
   

        boxCloseCallBack(){

        }
}