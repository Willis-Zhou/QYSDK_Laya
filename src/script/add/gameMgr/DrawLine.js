import Tools from "../UIFrame/Tools";

/**
 * 划区域
 */
export default class DrawLine {


    constructor() {
        this.drawPar = null;
        this.sp = null;
        this.y=0.5;
    }

    /**
     * 初始化父物体
     * @param {*} tagert 
     */
    init(target) {
        if (target instanceof Laya.Sprite3D) {
            this.drawPar = target;
        }

        this.sp = new Laya.PixelLineSprite3D(50);
        this.drawPar.addChild(this.sp);
        Tools.getIns().resetTransform(this.sp);
        this.sp.transform.scale=new Laya.Vector3(1,1,1);
    }

    /**
     * 话举行
     * @param {*} rang 
     */
    drawBox(width, height,color=new Laya.Color()) {
        let minX = -width ;
        let maxX = width ;
        let minY = -height ;
        let maxY = height ;

        let lt=new Laya.Vector3(minX,this.y,maxY);
        let lb=new Laya.Vector3(minX,this.y,minY);

        let rt=new Laya.Vector3(maxX,this.y,maxY);
        let rb=new Laya.Vector3(maxX,this.y,minY);

        let array=[];
        let up=new Laya.PixelLineData();
        up.startPosition=lt;
        up.endPosition=rt;
        up.endColor=color;
        up.startColor=color;

        let bottom=new Laya.PixelLineData();
        bottom.startPosition=lb;
        bottom.endPosition=rb;
        bottom.endColor=color;
        bottom.startColor=color;

        let left=new Laya.PixelLineData();
        left.startPosition=lt;
        left.endPosition=lb;
        left.endColor=color;
        left.startColor=color;

        let right=new Laya.PixelLineData();
        right.startPosition=rt;
        right.endPosition=rb;
        right.endColor=color;
        right.startColor=color;

        array.push(up,bottom,left,right);

        this.sp.addLines(array);
    }

    drawBox3D(){
        
    }
}