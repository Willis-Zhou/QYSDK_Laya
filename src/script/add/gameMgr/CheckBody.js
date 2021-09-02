import Tools from "../UIFrame/Tools";

export default class CheckBody extends Laya.Script{
    constructor(){
        super();
        this.isShoot=false;

        this.p1=null;//左上
        this.p2=null;//右上
        this.p3=null;//左下
        this.p4=null;//右下
    }

    init(){
        Tools.getIns().setLayer(this.owner,G_GameLayer.hint);
        let max=this.owner.meshRenderer.bounds.getMax();
        let extent=this.owner.meshRenderer.bounds.getExtent();
        let center=this.owner.meshRenderer.bounds.getCenter();

        //算出包围盒
        this.p1=new Laya.Vector3(center.x-extent.x,max.y,center.z+extent.z);
        this.p2=new Laya.Vector3(center.x+extent.x,max.y,center.z+extent.z);

        this.p3=new Laya.Vector3(center.x-extent.x,max.y,center.z-extent.z);
        this.p4=new Laya.Vector3(center.x+extent.x,max.y,center.z-extent.z);
    }

    reSet(){
        this.isShoot=false;
    }

   

    checkInRang(target){
        if(target.transform.position.y>this.p1.y){//没有到达高度
            return false;
        }

        if(target.transform.position.x>this.p1.x&&target.transform.position.x<this.p2.x)//x轴
        {
            if(target.transform.position.z>this.p3.z&&target.transform.position.z<this.p1.z){
                return true;
            }
        }

        return false;
    }
}