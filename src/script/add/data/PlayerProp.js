export default class PlayerProp {
    constructor() {
        //伤害
        this.initHurt = 10;
        this.curHurtMax=10;
        this.hurtProp = 10;
        //防御值
        this.initDef = 0;
        this.curDefMax=0;
        this.defProp = 0;
        //血量
        this.initHp = 15;
        this.curHpMax=15;
        this.hpProp = 15;
        this.initSpeed = 12;
        this.speedProp = 12;
        this.curSpeedMax=12;

        //免伤百分比
        this.initDefRate=0;
        this.defRate=0;

        //反伤
        this.initBounceHurt=0;
        this.bounceHurt=0;

        //怒气值
        this.curAnger=0;
        this.angerMax=100

        //隐藏值
        this.curHide=0;
        this.hideMax=100;

        this.isDebug=false;
    }

    setBounceHurt(bounceHurt){
        this.bounceHurt=bounceHurt;
        this.initBounceHurt=bounceHurt;
    }

    setHp(hp) {
        this.hpProp = hp;
        this.initHp = hp;
        this.curHpMax=hp;
    }

    getHpPro(){
        return this.hpProp/this.initHp;
    }

    setDef(def) {
        this.defProp = def;
        this.initDef=def;
        this.curDefMax=def;
    }

    setHurt(hurt) {
        this.hurtProp = hurt;
        this.initHurt=hurt;
        this.curHurtMax=hurt;
    }

    setSpeed(speed) {
        this.speedProp = speed;
        this.initSpeed=speed;
        this.curSpeedMax=speed;
    }

    setDefRate(defRate){
        this.initDefRate=defRate;
        this.defRate=defRate;
    }

    changeDef(def){
        this.defProp+=def;
        this.defProp=this.defProp<=0?0:this.defProp;
        this.isDebug&&console.log("防御:",this.defProp);
    }

    changeHurt(hurt){
        this.hurtProp+=hurt;
        this.hurtProp=this.hurtProp<=0?0:this.hurtProp;
        this.isDebug&&console.log("伤害:",this.hurtProp);
    }

    changeHp(hp){
        this.hpProp+=hp;
        this.hpProp=this.hpProp<=0?0:this.hpProp;
        this.hpProp=this.hpProp>this.curHpMax?this.curHpMax:this.hpProp;
        this.isDebug&&console.log("血量:",this.hpProp);
    }

    changeDefRate(rate){
        this.defRate+=rate;
        this.isDebug&&console.log("减伤:",this.defRate);
    }
   

    /**
     * 计算最终伤害
     */
    culHurt(val) {
        val=val*(1-this.defRate-this.defProp/(this.defProp+120));
        val = val < 0 ? 0 : val;
        return val;
    }

    culHp(val) {
        this.hpProp += val;
        this.hpProp = this.hpProp < 0 ? 0 : this.hpProp;

        return this.hpProp;
    }

    getHpPro() {
        return this.hpProp / this.curHpMax;
    }

    getHurtProp() {
        return this.hurtProp;
    }

    getDefProp() {
        return this.defProp;
    }

    getHpProp() {
        return this.hpProp;
    }

    getInitHpProp() {
        return this.curHpMax;
    }

    getSpeedProp() {
        return this.speedProp;
    }

    getBounceHurt(){
        return this.bounceHurt;
    }

    changeAnger(val){
        this.curAnger+=val;
        this.curAnger=this.curAnger<0?0:this.curAnger;
        this.curAnger=thi.curAnger>this.angerMax?100:this.curAnger;
    }

    getAnger(){
        return this.curAnger;
    }
}