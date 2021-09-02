export default class AnimName {
    constructor() {
        this.kang="kai";
        this.Idle = "Idle";
        this.kanbao = "kanbao";
        this.Run = "Run";
        this.Walk = "Walk";
        this.Cast_Spell = "Cast Spell";
    }

    static getIns() {
        if (!this.instance) {
            this.instance = new AnimName();
        }

        return this.instance;
    }
}