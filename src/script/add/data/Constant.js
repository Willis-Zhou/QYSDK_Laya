export default class Constant{
    
    static getIns(){
        if(!this.ins){
            this.ins=new Constant();
        }

        return this.ins;
    }


    constructor(){
        this.beaRang=8;
        this.beaRangSquare=this.beaRang*this.beaRang;

        this.tempV1=new Laya.Vector3();
    }

   
}