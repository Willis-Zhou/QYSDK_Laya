
declare class G_ResPath {
    static resPath: string;
    static itemPath: string;
    static skinPath: string;
    static peoplePath: string;
    static scenePath: string;
    static trainTitle: string;
    static trainIcon: string;
    static minMapPoint: string;
    static skinChip:string;
    static rareBoxPath:string;
    static starPath:string;
    static scenePart:string;
}



declare class G_ColGroup {
    static item: number;
    static player: number;
    static ray: number;
    static enemy:number;
    static enemyEye: number;
    static playerLeg: number;
    static enemyLeg: number;
    static ob:number;
    static wall:number;
}


declare class GG_ShareScene extends G_ShareScene {
    // 领取金币
    static SS_GET_COIN: string;
    // 双倍金币
    static SS_DOUBLE_COIN: string;
    // 复活
    static SS_REVIVE_BACK: string;
}

declare class GG_SoundName extends G_SoundName {
    static SN_BG: string;
    static SN_FAIL: string;
    static SN_SUCC: string;
    static SN_Mp3: string;
}


declare class G_GameLayer {
    static hint: number;
    static ShowModel: number;
    static player: number;
    
}

declare class GG_EventName extends G_EventName {
    static EN_GAMEGOLD_CHANGE: string;
    static EN_CLICKEND: string;
    static EN_ENEMY_WATCHBACK:string;
    static EN_ENEMY_WATCHFORWARD:string;
}

declare class PropKey {

    static hurt: string;
    static hp: string;
    static def: string;
    static speed: string;
    static defRate: string;
    static bounceHurt: string;

}

declare class  BigNumber{


    constructor(parameters);

    plus(val:any):BigNumber;
    minus(val:any):BigNumber;
    times(val:any):BigNumber;
    idiv(val:any):BigNumber;
    toFixed(num):string;
    toString():string;

    /**
     * 等于
     */
    eq(any:any):boolean;

    /**
     * 大于
     */
    gt(any:any):boolean;

    /**
     * 大于或等于
     * @param any 
     */
    gte(any:any):boolean;

    /**
     * 
     * @param any 小于
     */
    lt(any:any):boolean;

    /**
     * 小于等于
     * @param any 
     */
    lte(any:any):boolean;
}





