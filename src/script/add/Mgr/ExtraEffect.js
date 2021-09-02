/**
 * 额外数据存储
 */
export default class ExtraEffect{
    constructor(){
        this.hasMedicalCase=false;//是否有医疗箱
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new ExtraEffect();
            this.instance.init();
        }

        return this.instance;
    }


    init(){

    }

   
    clearExtraData(){
     
        this.hasMedicalCase=false;
    }
}