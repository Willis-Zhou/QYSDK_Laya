import MapMgr from "../Mgr/MapMgr";
import  Dictionary  from "../UIFrame/Dictionary";

export default class RecycleMgr  {

    constructor() { 
       
        this.pool=new Dictionary();
    }
    

    recycle(path,ob){
        if(!ob||ob.destroyed){
            return;
        }

        if(!MapMgr.getIns()&&MapMgr.getIns().recycleNode){
            ob.destroy();
            return ;
        }

        if(ob.parent!= MapMgr.getIns().recycleNode){
            MapMgr.getIns().recycleNode.addChild(ob);
        }

       
        ob.active=false;
        if(!this.pool.hasKey(path)){
            this.pool.addKey(path,[]); 
        }

        

        let gos=this.pool.getValue(path);

        if(gos.length>10){
            ob.destroy();
            return;
        }

        gos.push(ob);
    }
  

    getGo(path){
        if(!this.pool.hasKey(path)){
            return null;
        }

        let gos=this.pool.getValue(path);
        if(gos.length==0){
            return null;
        }
        
        let go=gos[0];
        gos.splice(0,1);
        go.active=true;
        return go;
    }

    clearGo(){

        let vals=this.pool.getValues();
        for(let i=0;i<vals.length;i++){
            for(let j=0;j<vals[i].length;j++){
                let go=vals[i][j];
                if(go){
                    go.destroy();
                }
            }
        }

        this.pool.clear();
    }
}