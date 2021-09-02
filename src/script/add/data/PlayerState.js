export default class PlayerState {
    constructor() {
        this.None = -1;
        this.Idle = 0;
        this.Run = 1;
        this.kang=2;
    }


    static getIns() {
        if (!this.instance) {
            this.instance = new PlayerState();
        }

        return this.instance;
    }
}