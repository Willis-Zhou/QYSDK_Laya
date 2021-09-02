import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import GameMgr from "../Mgr/GameMgr";

import PageBase from "../UIFrame/PageBase";
import Tools from "../UIFrame/Tools";

export default class GameOverFirst extends PageBase{
    constructor(){
        super();

        this.leftTween=new ContinuousTweenMgr();
        let vals=[];
        vals.push({time:400,prop:{centerX:-800},ease:Laya.Ease.quartOut});
        vals.push({time:400,prop:{centerX:-168},ease:Laya.Ease.quartOut});
        this.leftTween.setTweenVals(vals);

        this.rightTween=new ContinuousTweenMgr();
        let vals1=[];
        vals1.push({time:400,prop:{centerX:800},ease:Laya.Ease.quartOut});
        vals1.push({time:400,prop:{centerX:191},ease:Laya.Ease.quartOut});
        this.rightTween.setTweenVals(vals1);
        

        this.succTween=new ContinuousTweenMgr();
        let vals2=[];
        vals2.push({time:300,prop:{scaleX:2,scaleY:2},ease:Laya.Ease.linearOut});
        vals2.push({time:300,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearOut});
        vals2.push({time:120,prop:{scaleX:1.2,scaleY:1.2},ease:Laya.Ease.quadOut});
        vals2.push({time:100,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.quadIn});
        this.succTween.setTweenVals(vals2);

        this.failTween=new ContinuousTweenMgr();
        let vals3=[];
        vals3.push({time:400,prop:{scaleX:2,scaleY:2},ease:Laya.Ease.linearOut});
        vals3.push({time:400,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearOut});
        this.failTween.setTweenVals(vals3);

        this.isWin=false;
        this.isTeach=false;
        this.closeFun=null;

        
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_bg.on(Laya.Event.CLICK,null,()=>{

        });

        this.leftTween.setTarget(this.viewProp.m_left);
        this.rightTween.setTarget(this.viewProp.m_right);
        this.succTween.setTarget(this.viewProp.m_succ_icon);
        this.failTween.setTarget(this.viewProp.m_fail_icon);
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.isWin=vals.isWin;
        this.isTeach=vals.isTeach;
        this.closeFun=vals.closeFun;
    }

    pageOpenTweenOver(){
        super.pageOpenTweenOver();
        this.showBorderTween(this.isWin);
        Laya.timer.once(1500,null,()=>{
            GameMgr.getUIMgr().closeUI(this.pageName);
        })


    }

    showBorderTween(isWin){
        this.viewProp.m_succ_icon.visible=false;
        this.viewProp.m_fail_icon.visible=false;
        this.viewProp.m_teach_icon.visible=this.isTeach;
        this.viewProp.m_game.visible=!this.isTeach;
        //教程结束
        if(this.isTeach){
            this.leftTween.end();
            this.rightTween.end();
            let teachNode=this.viewProp.m_teach_icon;
            if(teachNode.tween){
                teachNode.tween.clear();
                teachNode.tween=null;
            }
            teachNode.centerX=-1000;
            teachNode.tween=Laya.Tween.to(teachNode,{centerX:0},400,Laya.Ease.quintOut,null,0,true,false);
        }else{
            this.leftTween.end();
            this.leftTween.play();
            this.rightTween.end();
            this.rightTween.play();
    
            Laya.timer.once(250,null,()=>{
                if(isWin){
                    this.viewProp.m_teach_icon.visible=this.isTeach;
                    this.viewProp.m_succ_icon.visible=true;
                    this.succTween.end();
                    this.succTween.play();
                }else{
                    this.viewProp.m_fail_icon.visible=true;
                    this.failTween.end();
                    this.failTween.play();
                }
              
            })
        }

      
      
       
    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }
    
}