import GameMgr from "../Mgr/GameMgr";
import Tools from "../UIFrame/Tools";

/**
 * 鼠标控制器
 */
export default class MouseCorl extends Laya.Script {



    constructor() {
        super();

        /** @prop {name:teachFinger, tips:"教程手指", type:Node, default:null}*/
        this.teachFinger = null;

        this.movePath = [];
        this.mouseUpFun = null;
        this.lastAddPos = null;

        //两点之间最小的长度
        this.minDis = 30;
        this.minDis *= this.minDis;
        this.tempV1 = new Laya.Vector3();

        this.xMin = 0;
        this.xMax = 0;

        this.yMin = 0;
        this.yMax = 0;
        this.tempP1=new Laya.Point();
        this.tempP2=new Laya.Point();
       
        this.isDownArea = false;
        this.isStartTeach = false;
        this.roads=[
            {x:107,y:99},
            {x:154,y:99},
            {x:201,y:99},
            {x:232,y:99},
            {x:274,y:99},
            {x:301,y:99},
            {x:370,y:99},
            {x:432,y:171},
            {x:460,y:200},
            {x:531,y:231}
        ];
        this.roadsIndex=0;
    }

    init() {



        let tW = this.owner
        if (tW instanceof Laya.Image) {



            let point = new Laya.Point(0, 0);
            tW.localToGlobal(point, false);

            this.xMin = point.x;
            this.xMax = point.x + tW.width;

            this.yMin = point.y;
            this.yMax = Laya.stage.height - tW.bottom;

        }


        let sp = new Laya.Sprite();
        this.owner.parent.addChild(sp);
        this.sp = sp;
        this.teachFinger.visible=false;
        this.endTeach();
    }

    resgistEvent() {
        this.owner.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.owner.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    unResgistEvent() {
        this.owner.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.owner.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    clearPlaint() {

        this.sp.graphics.clear(true);

    }

    drawCurves(start, end) {
        this.sp.graphics.drawLine(start.x, start.y, end.x, end.y, "#000000", 15);
    }

    mouseDown(event) {
        
        this.endTeach();
        Laya.timer.scale = 0.2;
        this.isDownArea = true;
        this.movePath.splice(0, this.movePath.length);
        //this.movePath=[];
        let vec = new Laya.Vector3(event.stageX, event.stageY, 0);
        this.addPos(vec);
    }

    mouseUp(event) {
        if (!this.isDownArea) {
            return;
        }
        Laya.timer.scale = 1;
        this.isDownArea = false;
        this.offectPos(this.movePath);
        Tools.getIns().handlerFun(this.mouseUpFun, this.movePath);
        this.clearPlaint();
        this.lastAddPos = null;
    }

    /**
     * 移除相邻
     * @param {*} paths 
     */
    offectPos(paths) {


        return paths;
    }


    addPos(pos) {

        //判断是否超出区域
        pos.x = pos.x > this.xMax ? this.xMax : pos.x;
        pos.x = pos.x < this.xMin ? this.xMin : pos.x;

        pos.y = pos.y > this.yMax ? this.yMax : pos.y;
        pos.y = pos.y < this.yMin ? this.yMin : pos.y;

        //防止相邻的两个点相等
        if (this.lastAddPos) {

            Laya.Vector3.subtract(pos, this.lastAddPos, this.tempV1);

            if (Laya.Vector3.scalarLengthSquared(this.tempV1) < this.minDis) {
                return;
            }
        }

        if (this.lastAddPos) {
            this.drawCurves(this.lastAddPos, pos);
        }

        this.lastAddPos = pos;
        this.movePath.push(pos);
    }

    mouseMove(event) {
        let vec = new Laya.Vector3(event.stageX, event.stageY, 0);
        this.addPos(vec);
        GameMgr.getIns().mobileShakeSgin();
    }

    /**
    * 开始教程
    */
    startTeach() {

        if (!this.teachFinger) {
            return;
        }

        if (this.isStartTeach) {
            return;
        }

        
        this.isStartTeach = true;
        this.roadsIndex=0;
        Laya.timer.loop(200,this,this.toTeachDraw)
    }

    toTeachDraw(){
        this.teachFinger.visible = true;
        if(this.roadsIndex<this.roads.length-1){
            let start=this.roads[this.roadsIndex];
            let end=this.roads[this.roadsIndex+1];
            

            this.tempP1.setTo(start.x,start.y);
            this.owner.localToGlobal(this.tempP1, false);

            this.tempP2.setTo(end.x, end.y);
            this.owner.localToGlobal(this.tempP2, false);
            this.teachFinger.pos(this.tempP2.x,this.tempP2.y);
            this.drawCurves(this.tempP1,this.tempP2);
        }

       

        this.roadsIndex++;

        if(this.roadsIndex>=this.roads.length){
            this.roadsIndex=0;
            this.clearPlaint();
        }
    }

    /**
     * 教程结束(游戏开始第一帧)
     */
    endTeach() {

        if (!this.teachFinger) {
            return;
        }

        if (!this.isStartTeach) {
            return;
        }

        this.teachFinger.visible = false;

        this.isStartTeach = false;
        this.clearPlaint();
        Laya.timer.clear(this,this.toTeachDraw)
    }

    

}