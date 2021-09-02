import Tools from "../UIFrame/Tools";

export default class MusicList extends Laya.Script{
    constructor(){
        super();

        this.lastScrollVal=-1;
        this.midPos=Laya.stage.width/2;

        this.selectFun=null;
        this.moveEndFun=null;
        this.isSelect=false;
        this.selData=null;
        this.isMouseDown=false;

        this.datas=null;
        this.selectedIndex=-1;
    }

    init(){
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
    }


    setDatas(datas){
        this.datas=datas;
    }

    mouseDown(event){
        this.isMouseDown=true;
        this.selectedIndex=-1;
    }

    mouseUp(event){
        this.isMouseDown=false;
    }

    onDestroy(){
        Laya.stage.off(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP,this,this.mouseUp)
    }

    onUpdate(){
        if(this.lastScrollVal!=this.owner.scrollBar.value){
            this.isSelect=false;
            this.lastScrollVal=this.owner.scrollBar.value;
            let point=new Laya.Point();
            let dis=0;
            let val=0;
            let scale=0;
            let cell=0;
            let lastDis=10000;
            for(let i=0;i<this.owner.cells.length;i++){
                cell=this.owner.cells[i];
                point.x=cell.width/2;
                point.y=cell.height/2;
                point= cell.localToGlobal(point);
                
                 dis=Math.abs(point.x-this.midPos);
                 val=dis/200;
                 val=Math.min(val,1);
                 scale=1-0.15*val;
                 cell.scaleX=scale;
                 cell.scaleY=scale; 
                 
                 if(dis<lastDis){
                     lastDis=dis;
                     this.selData=cell;
                 }
                 
                 this.selectEnd();
            }
        }else{
            if(!this.isSelect&&!this.isMouseDown){
                this.isSelect=true;

                if(this.selData){
                    let dataSource=this.selData.dataSource;

                    let index=this.getIndex(dataSource.id);
                    if(index==this.selectedIndex){
                        return;
                    }

                    if(dataSource.id!=-1){
                        this.selectedIndex=index;
                        this.owner.tweenTo(this.selectedIndex,500);
                        Laya.timer.once(500,this,this.moveEnd);
                    }else{
                        this.moveEnd();
                    }
                }else{
                    this.moveEnd();
                } 
            }
        }
    }

    getIndex(id){
        if(!this.datas){
            return 0;
        }

        for(let i=0;i<this.datas.length;i++){
            if(this.datas[i].id==id){
                return i-1;
            }
        }

        return 0;
    }

    setSelectCallBack(fun){
        this.selectFun=fun;
    }

    setMoveEndCallBack(fun){
        this.moveEndFun=fun;
    }

    moveEnd(){
        
        Tools.getIns().handlerFun(this.moveEndFun,this.selData);
    }

    selectEnd(){
        Tools.getIns().handlerFun(this.selectFun,this.selData);
    }
}