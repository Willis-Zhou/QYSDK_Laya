export default class RangCheck  {

    constructor() { 
       this.TL=null;
       this.TR=null;
       this.BL=null;
       this.BR=null;

       this.sideVal=new Object();
    }
    
 



    /**
     * 设置四边
     * @param {*} TL 
     * @param {*} TR 
     * @param {*} BL 
     * @param {*} BR 
     */
    setSide(TL,TR,BL,BR){
            this.TL=TL;
            this.TR=TR;
            this.BL=BL;
            this.BR=BR;
    }


    logSide(){
        console.log(this.TL.transform.position.clone(),this.TR.transform.position.clone(),this.BL.transform.position.clone(),this.BR.transform.position.clone())
    }
    

    /**
     * 从小到大
     * @param {*} array 
     */
    sort(array){
        
        for(var i=0;i<array.length;i++){
            for(var j=i+1;j<array.length;j++){
                if(array[j]<array[i]){
                    let temp=array[j];
                    array[j]=array[i];
                    array[i]=temp;
                }
            }
        }
    }


    



    /**
     * 穿件边缘函数
     */
    creatSideFun(){
        
        this.sideVal.bottom=this.createFunData(this.BL.transform.position,this.BR.transform.position);
        this.sideVal.left=this.createFunData(this.BL.transform.position,this.TL.transform.position);
        this.sideVal.right=this.createFunData(this.BR.transform.position,this.TR.transform.position);
        this.sideVal.top=this.createFunData(this.TL.transform.position,this.TR.transform.position);
    }

    /**
     * 创建函数数据
     * @param {*} pos1 
     * @param {*} pos2 
     */
    createFunData(pos1,pos2){//k=(y1-y2)/(x1-x2)   b=(x1y2-x2y1)/(x1-x2)
    
        // let pos1= this.fixedPos(p1);
        // let pos2= this.fixedPos(p2);
        //top函数
        let funData=new Object();
        funData.isX=false;
        funData.xFun=0;
        if(pos1.x==pos2.x){
            funData.isX=true;
            funData.xFun=pos1.x;
            
        }else{
           
            funData.k=(pos1.z-pos2.z)/(pos1.x-pos2.x);
            funData.b=(pos1.x*pos2.z-pos2.x*pos1.z)/(pos1.x-pos2.x);
        }

        funData.maxX=Math.max(pos1.x,pos2.x);
        funData.minX=Math.min(pos1.x,pos2.x);

        funData.minY=Math.min(pos1.z,pos2.z);
        funData.maxY=Math.max(pos1.z,pos2.z);

        return funData;
        
    }

    fixedPos(pos){
        let posTemp=new Laya.Vector3();
        posTemp.x=this.getFloatVal(pos.x);
        posTemp.z=this.getFloatVal(pos.z);

        return posTemp;
    }

    getFloatVal(val){
        return parseFloat(val.toFixed(3));
    }

    /**
     * 检测是否有相交点
     */
    checkHasWithPoint(f1,f2,withPoint){


        if(f1.isX){//x轴函数
            if(f2.isX){//两个函数都为x轴函数 没有交点(不考虑边缘情况)
               
            }else{//判断
                 this.checkOneXFunWithPoint(f1,f2,withPoint);
            }
        }else if(f2.isX){
             this.checkOneXFunWithPoint(f2,f1,withPoint);
        }else{
             this.checkNoXFunWithPoint(f1,f2,withPoint);
        }

    }

    /**
     * 校准重复点
     * @param {*} withPoint 
     */
    offectPos(withPoint){
        for(var i=withPoint.length-1;i>=0;i--){
            for(var k=i-1;k>=0;k--){
                if(withPoint[i].x==withPoint[k].x&&withPoint[i].z==withPoint[k].z){
                    withPoint.splice(i,1);
                }
            }
        }
    }

    /**
     * 判断有一个函数是x轴函数
     * @param {*} f1 x轴函数
     * @param {*} f2 普通函数
     */
    checkOneXFunWithPoint(f1,f2,withPoint){

        if(f1.k==f2.k){//平行没有交点
            return ;
        }

        let withY=f1.xFun*f2.k+f2.b;

        if(f2.minY<=withY&&f2.maxY>=withY){
            withPoint.push(new Laya.Vector3(f1.xFun,0,withY))
            return ;
        }else{
            return ;
        }
    }

    /**
     * 判断两个普通函数是否有交点
     * @param {*} f1 
     * @param {*} f2 
     */
    checkNoXFunWithPoint(f1,f2,withPoint){
        let withX=(f2.b-f1.b)/(f1.k-f2.k);

        if(withX>=f1.minX&&withX<=f1.maxX){
            if(withX>=f2.minX&&withX<=f2.maxX){
                withPoint.push(new Laya.Vector3(withX,0,f1.k*withX+f1.b));
                return ;
            }
        }

    }

    /**
     * 判断是否在四边形区域内
     * @param {*} pos1 
     * @param {*} pos2 
     */
    checkHasInRangNew(pos1,pos2){
        let funData=this.createFunData(pos1,pos2);

        let withPoint=[]

        this.checkHasWithPoint(funData,this.sideVal.top,withPoint);
        this.checkHasWithPoint(funData,this.sideVal.bottom,withPoint);
        this.checkHasWithPoint(funData,this.sideVal.left,withPoint);
        this.checkHasWithPoint(funData,this.sideVal.right,withPoint);
        this.offectPos(withPoint);
        return withPoint.length%2!=0;
    }


    /**
     * 判断是否在圆形范围内
     * @param {*} point 
     * @param {*} r 
     * @param {*} pos 
     */
    checkHasInRound(point,r,pos){
        return Laya.Vector3.distance(point,pos)<=r;
    }
}