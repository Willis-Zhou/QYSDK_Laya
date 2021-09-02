import Tools from "../UIFrame/Tools";
import MapMgr from "../Mgr/MapMgr";
import Plant from "../Ob/Plant";
import Constant from "../data/Constant";
import OutDoor from "../Ob/OutDoor";
import BeeStore from "../Ob/BeeStore";
import HoneySellStore from "../Ob/HoneySellStore";
import CapacityStore from "../Ob/CapacityStore";
import BeeConbineStore from "../Ob/BeeConbineStore";
export default class MapPart extends Laya.Script {

    constructor() {
        super();
        this.startPos = null;
        this.playerNavMeshGroup = null;
        this.mapKey = null;

        this.plants = [];


        this.curNearPlane;
        this.tmepV1 = new Laya.Vector3();
        this.tempV2 = new Laya.Vector3();
        this.curColPlayers = [];
        this.floweArray = [];
        //在砍击范围
        this.inKangFlowers = [];

        //检查地板的帧数
        this.curFrame = 0;
        this.checkFrame = 5;//检测帧数

        this.outDoor = null;

        this.isInDoor = false;

        this.stores = [];

    }

    init(key) {
        this.mapKey = key;
        this.startPos =this.owner.getChildByName("startPos");
        let outMap = [];
        outMap.push(this.owner.getChildByName("staticObj").getChildByName("end").getChildByName("outMap_1"));
        if (outMap.length != 0) {
            let door = outMap[0].addComponent(OutDoor);
            door.init();
            this.outDoor = door;
        } else {
            console.error("没有出去点")
        }



        let plants = [];
        Tools.getIns().getChildBySginInFirstChild(this.owner, "plant_", plants);
        for (let i = 0; i < plants.length; i++) {
            let mgr = plants[i].addComponent(Plant);
            mgr.init();
            this.plants.push(mgr);
        }

        let hint_nav =this.owner.getChildByName("NavObj").getChildByName("hint_nav");
        if (hint_nav) {
            hint_nav.active = false;
        }

        let stores = [];
        Tools.getIns().getChildBySginInFirstChild(this.owner, "Store_", stores);
        for (let i = 0; i < stores.length; i++) {
            let mgr;

            let type = parseInt(stores[i].name.split('_')[1]);
            if (type == 2) {
                mgr = stores[i].addComponent(BeeStore);

            } else if (type == 1) {
                mgr = stores[i].addComponent(HoneySellStore);

            } else if (type == 3) {
                mgr = stores[i].addComponent(CapacityStore);

            } else if (type == 5) {
                mgr = stores[i].addComponent(BeeConbineStore);
            }

            mgr.init();
            this.stores.push(mgr);
        }


    }





    /**
     * 检查碰撞（玩家移动的时候才会执行）
     * @param {*} node 
     */
    checkColloder(playerMgr) {
        //判断是否到达了出口点
        let dis = Tools.getVecSquared(this.outDoor.getPos(), playerMgr.owner.transform.position, this.outDoor.buildRang, playerMgr.colRang);
        if (dis <= 0) {
            if (!this.isInDoor) {
                this.outDoor.addCols(playerMgr);
                this.isInDoor = true;
            }
        } else {
            if (this.isInDoor) {
                this.outDoor.removeCols(playerMgr);
                this.isInDoor = false;
            }
        }


        this.curFrame++
        if (!this.curNearPlane || this.curFrame > this.checkFrame) {
            dis = 1000;//1000以外的地方不计算
            this.curFrame = 0;
            let curPlane = null;
            for (let i = 0; i < this.plants.length; i++) {
                let tempDis = Tools.getVecSquared(playerMgr.owner.transform.position, this.plants[i].getPos(), 0, 0)
                if (tempDis < dis) {
                    curPlane = this.plants[i];
                    dis = tempDis;
                }
            }


            //清除碰撞信息
            if (curPlane && curPlane != this.curNearPlane) {
                this.curNearPlane && this.curNearPlane.closePlane();
                playerMgr.changePlantCallback();
                if (curPlane instanceof Plant) {
                    this.curNearPlane = curPlane;
                }

                curPlane.openPlane();
            }


        }

        if (!this.curNearPlane) {
            return;
        }

        let temp;
         //检查店铺
         for (let i = 0; i < this.stores.length; i++) {
            temp = this.stores[i];
            temp.toPlayerDis = Tools.getVecSquared(playerMgr.owner.transform.position, temp.getPos(), temp.buildRang, playerMgr.colRang);
            if (temp.toPlayerDis < 0) {
                if (!temp.isInLastArray) {
                    temp.isInLastArray = true;
                    temp.addCols(playerMgr);
                }
            } else {
                if (temp.isInLastArray) {
                    temp.isInLastArray = false;
                    temp.removeCols(playerMgr);
                }
            }
        }


        //拿到碰撞范围内的物体
        this.curNearPlane.checkCol(playerMgr.owner, playerMgr.colRangSquare, playerMgr.colRang,playerMgr);
    }


    /**
     * 行走之后停下
     */
    walkToIdle(playerMgr) {
        if (!this.curNearPlane) {
            return;
        }

        //拿到蜜蜂的寻花范围
        let array = this.curNearPlane.getFlowers();
        this.floweArray.splice(0, this.floweArray.length);
        //拿到在方位内的
        this.curNearPlane.addColInNewRang(Constant.getIns().beaRangSquare, array, this.floweArray);
        playerMgr.hasPlantsInBeaRang(this.floweArray);


    }

    /**
     * 拿到砍击范围能的花朵(重新计算角度)
     * @returns 
     */
    getInHurtRangFlowers(playerMgr, find) {

        if (!this.curNearPlane) {
            this.inKangFlowers.splice(0, this.inKangFlowers.length);
            return null;
        }

        if (!find) {
            for (let i = this.inKangFlowers.length - 1; i >= 0; i--) {
                if (this.inKangFlowers[i].isDeath()) {
                    this.inKangFlowers.splice(i, 1);
                }
            }
        } else {
            let array = this.curNearPlane.getFlowers();
            this.inKangFlowers.splice(0, this.inKangFlowers.length);
            this.curNearPlane.addColInNewRang(playerMgr.kangRangSquare, array, this.inKangFlowers);

            //判断角度
            for (let i = this.inKangFlowers.length - 1; i >= 0; i--) {
                if (this.inKangFlowers[i].isDeath()) {
                    this.inKangFlowers.splice(i, 1);
                } else {
                    // playerMgr.owner.transform.getForward(this.tempV2);
                    // Laya.Vector3.subtract(this.inKangFlowers[i].getPos(),playerMgr.owner.transform.position,this.tmepV1);

                    // if(Laya.Vector3.dot(this.tempV2,this.tmepV1)>0){
                    //     this.inKangFlowers.splice(i, 1);
                    // }
                }



            }
        }




        return this.inKangFlowers;
    }

    /**
     * 拿到上一次砍击的花朵
     */
    getLastKangFlowers() {
        return this.inKangFlowers;
    }

    toStartPos() {
        MapMgr.getIns().playerMgr.backStartPos(this.startPos.transform.position, this.startPos.transform.rotationEuler);
    }

    /**
     * 拿到上一次在范围内的花朵
     */
    getLastFlowers() {

        return this.floweArray;
    }



    openMap() {
        this.owner.active = true;
    }

    closeMap() {
        this.owner.active = false;
    }



    /**
     * 拿到默认的开始点
     */
    getStartPoint() {
        return this.startPos;
    }

    /**
     * 创建组
     * @param {*} vec 
     */
    createNavMeshGroup(vec) {
        if (this.playerNavMeshGroup) {
            return;
        }

        this.playerNavMeshGroup = NevMesh.getGroup(this.mapKey, vec);
    }

    /**
     * 判断点是否在区域内
     * @param {*} vec 
     */
    hasInMap(vec) {

        let allNodes = NevMesh.zoneNodes[this.mapKey].groups[this.playerNavMeshGroup];
        let vertices = NevMesh.zoneNodes[this.mapKey].vertices;
        if (MapMgr.getIns().isInChangeMap) {
            return false;
        }

        if (!vertices || !allNodes) {
            return false;
        }

        for (let i = 0; i < allNodes.length; i++) {
            if (NevMesh.Vector3.isVectorInPolygon(vec, allNodes[i], vertices)) {
                return true;
            }
        }

        return false;
    }
}