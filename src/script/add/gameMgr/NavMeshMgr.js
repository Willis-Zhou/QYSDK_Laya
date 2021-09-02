import Tools from "../UIFrame/Tools";
export default class NavMeshMgr{


    constructor(){
        this.mapNav={}
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new NavMeshMgr();
        }

        return this.instance;
    }


    /**
     * 加载网格
     * @param {*} name 
     * @param {*} callBack 
     * @returns 
     */
    loadMap(name,callBack){
        if(this.mapNav[name]){
            Tools.getIns().handlerFun(callBack,this.mapNav[name]);
            return;
        }

        let navUrl="res/online/Sprites/Conventional/{0}.nav".format(name);
        Laya.loader.load(navUrl,Laya.Handler.create(this,(json)=>{
            let zoneNodes=NevMesh.buildNodesByJson(json);
            NevMesh.setZoneData(name,zoneNodes);
            this.mapNav[name]=zoneNodes;
            Tools.getIns().handlerFun(callBack);
        }),null,"json");

    }

   
   
    
}