export default class DrawBirthmark  {

    constructor() { 
       
        this.lastLeftPos=null;
        this.lastRightPos=null;

        this.vertexDeclaration= Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
    }
    
    /**
     * 填下一个点
     * @param {*} left 
     * @param {*} right 
     */
    setStartPos(left,right){
        this.lastLeftPos=left;
        this.lastRightPos=right;
    }
    
    createMesh(left,right){
        if(this.lastLeftPos==null){
            return null;
        }

        let v1=this.lastLeftPos.clone();
        let v2=left.clone();
        let v3=this.lastRightPos.clone();
        let v4=right.clone();

        

        

        let vertices=[];//添加顶点
        let nor=new Laya.Vector3(0,1,0);
        let uv=new Laya.Vector3(0,1);
        vertices.push(
            v1.x,v1.y,v1.z,nor.x,nor.y,nor.z,uv.x,uv.y,
            v2.x,v2.y,v2.z,nor.x,nor.y,nor.z,uv.x,uv.y,
            v3.x,v3.y,v3.z,nor.x,nor.y,nor.z,uv.x,uv.y,
            v4.x,v4.y,v4.z,nor.x,nor.y,nor.z,uv.x,uv.y,
        )

        //设置下标
        let indices=[];
        indices.push(
            0,1,2,2,1,3
        )

        this.lastLeftPos=left.clone();
        this.lastRightPos=right.clone();
        return Laya.PrimitiveMesh._createMesh(this.vertexDeclaration,new Float32Array(vertices),new Uint16Array(indices));
    }

   
}