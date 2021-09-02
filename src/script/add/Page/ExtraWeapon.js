import PageBase from "../UIFrame/PageBase";
import ExtraWeaponItem from "../item/ExtraWeaponItem";
import Tools from "../UIFrame/Tools";


import ExtraEffect from "../Mgr/ExtraEffect";
import GameMgr from "../Mgr/GameMgr";

export default class ExtraWeapon extends PageBase{
    constructor(){
        super();
        this.adObj=new Object();
        this.adObj.num=2;
        this.closeFun=null;
        this.isNeedTween=true;
        this.weapons=[
            {
                id:1,
                name:"三级头",
                ef:"减免伤害",
                efvalT:"减少30%",
                efval:0.3,
                icon:"ep1",
                isAD:false,
                isUse:false,
            },
            {
                id:2,
                name:"三级甲",
                ef:"玩家血量增加",
                efvalT:"150血量",
                efval:150,
                icon:"ep2",
                isAD:false,
                isUse:false,
            },
            {
                id:3,
                name:"扩容弹夹",
                ef:"弹夹容量增加",
                efvalT:"20发",
                efval:150,
                icon:"ep3",
                isAD:false,
                isUse:false,
            },
            {
                id:4,
                name:"医疗箱",
                ef:"使用回复血量",
                efvalT:"100血量",
                efval:100,
                icon:"ep4",
                isAD:false,
                isUse:false,
            },
            {
                id:5,
                name:"火力加强",
                ef:"枪械伤害翻倍",
                efvalT:"伤害X2",
                efval:2,
                icon:"ep5",
                isAD:false,
                isUse:false,
            }
        ];

        this.curWeapon=[];
    }

    pageInit(){
        super.pageInit();
        this.viewProp.m_weapon_list.renderHandler=new Laya.Handler(this, this.renderHandler);
        //this.viewProp.m_weapon_list.vScrollBarSkin="";

        this.viewProp.m_getAll.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_getAll);
            this.getAll();
        });

        this.viewProp.m_cancel.on(Laya.Event.CLICK,this,function(){
            Tools.getIns().btnAction(this.viewProp.m_cancel);
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ExtraWeapon);
        })
    }

    resetData(){
        for(let i=0;i<this.weapons.length;i++){
            this.weapons[i].isAD=false;
            this.weapons[i].isUse=false;
        }
    }

    initList(data){
        this.viewProp.m_weapon_list.array=data;
        this.viewProp.m_weapon_list.refresh();
    }

    renderHandler(cell,index){
        this.setCell(cell,index);
    }

    setCell(cell,index){
        let mgr=cell.getComponent(ExtraWeaponItem);
        if(!mgr){
            mgr=cell.addComponent(ExtraWeaponItem);
            mgr.init();
            mgr.setSelFun(function(mgr){
                this.selItem(mgr);
            }.bind(this));
        }
        mgr.setData(this.viewProp.m_weapon_list.getItem(index));
    }

    moveBtn(){
        let start=this.viewProp.m_cancel.parent.height/2+Laya.stage.height/2-100;
        Tools.getIns().bottomDoMove(this.viewProp.m_cancel,start,998.5,function(move){
            if(!move){
                Tools.getIns().playBtnShow(this.viewProp.m_cancel,null,G_BtnDoShowTime);
            }
        }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.closeFun=vals.closeFun;
        this.resetData();
        this.curWeapon=Tools.getIns().getRandomArrayElements(this.weapons,3);
        this.initList(this.curWeapon);
        Tools.getIns().setAdBtnIcon(this.viewProp.m_getAll);
        
        this.viewProp.m_getAll.visible=false;
        this.viewProp.m_cancel.visible=false;
    }

    enableVal(id){
        switch(id){
            case 1:
                ExtraEffect.getIns().setReduceHurtPrecent(0.3);
                break;
            case 2:
                ExtraEffect.getIns().extraHp=150;
                break;
            case 3:
                ExtraEffect.getIns().setExtraMagazines(20);
                break;
            case 4:
                ExtraEffect.getIns().hasMedicalCase=true;
                break;
            case 5:
                ExtraEffect.getIns().hurtMul=2;
                break;
        }
    }

    selItem(mgr){
        if(mgr.itemData.isAD){
            Tools.getIns().shareOrAd(mgr.viewProp.m_adBtn,function(){
                this.enableVal(mgr.itemData.id);
                mgr.itemData.isUse=true;
                this.checkNotUse();
                this.viewProp.m_weapon_list.refresh();
            }.bind(this))
        }else{
            this.enableVal(mgr.itemData.id);
            mgr.itemData.isUse=true;
            this.setUseAd(true);
            this.viewProp.m_getAll.visible=true;
            this.viewProp.m_cancel.visible=true;
            this.moveBtn();
            this.viewProp.m_weapon_list.refresh();
        }
        
    }

    checkNotUse(){
        for(let i=0;i<this.curWeapon.length;i++){
            if(!this.curWeapon[i].isUse){
                return ;
            }
        }
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().ExtraWeapon);
        
    }

    getAll(){
        Tools.getIns().shareOrAd(this.viewProp.m_getAll,function(){
           this.useAll();
        }.bind(this))
    }

    setUseAd(ad){
        for(let i=0;i<this.weapons.length;i++){
            this.weapons[i].isAD=ad;
        }
    }

    useAll(){
        for(let i=0;i<this.curWeapon.length;i++){
            this.enableVal(this.curWeapon[i].id);
            this.curWeapon[i].isUse=true;
        }
        
        this.checkNotUse();
    }

    pageClose(){
        super.pageClose();
        Tools.getIns().handlerFun(this.closeFun);
        this.closeFun=null;
    }
}