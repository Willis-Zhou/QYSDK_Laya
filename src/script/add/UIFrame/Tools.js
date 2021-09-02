import AutoRecycleMgr from "../Mgr/AutoRecycleMgr"
import Dictionary from "./Dictionary";
import MainUIMgr from "./MainUIMgr";
import List from "./List";
import TweenPoolMgr from "./TweenPoolMgr";
import MapMgr from "../Mgr/MapMgr";
import GameMgr from "../Mgr/GameMgr";
export default class Tools {

    constructor() {
        this.init();
        this.btnTweens = new Dictionary();
        this.showBanner = false;
        this.oneVec = new Laya.Vector3(1, 1, 1);
        this.zeroVec = new Laya.Vector3(0, 0, 0);
        this.forwardTemp = new Laya.Vector3();
        this.upVec = new Laya.Vector3(0, 1, 0);
        this.downVec = new Laya.Vector3(0, -1, 0);
        this.inVec = new Laya.Vector3(-1, 0, 0);
        this.targetTemp = new Laya.Vector3();

        this.showBannerDelay = 70 * 1000;//70秒不显示
        this.showBannerTimer = 0;
        this.forwardVec = new Laya.Vector3(0, 0, 1);
        this.backVec = new Laya.Vector3(0, 0, -1);
        this.angleBase = 180 / Math.PI;

        this.tempV1 = new Laya.Vector3();
        this.tempV2 = new Laya.Vector3();
        this.tempV3 = new Laya.Vector3();
    }

    static getIns() {
        if (!this.instance) {
            this.instance = new Tools();
        }

        return this.instance;
    }

    init() {
        this.log("Tools init");
    }

    log(message, ...optionalParams) {
        if (!Laya.Browser.onPC) {
            return;
        }

        console.log(message, optionalParams);
    }

    error(message, ...optionalParams) {
        console.error(message, optionalParams);
    }


    /**
     * 函数执行
     * @param {function} fun 
     */
    handlerFun(fun, ...any) {
        if (fun != null) {
            fun(...any);
        }
    }

    /**
     * 转化3维坐标
     * @param {String} vec x&y&z
     */
    getVector3(vec) {
        if (vec) {
            let temp = vec.split('&');
            let v = new Laya.Vector3(-parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[2]));

            return v;

        } else {
            this.error("vec输入错误:", vec);
            return null;
        }
    }

    getVector4(vec) {
        if (vec) {
            let temp = vec.split('&');
            let v = new Laya.Vector4(parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[2]), parseFloat(temp[3]));

            return v;

        } else {
            this.error("vec输入错误:", vec);
            return null;
        }
    }

    /**
     * 转化四元数
     * @param {String} rot x&y&z&w
     */
    getRot(rot) {
        if (rot) {
            let temp = rot.split('&');
            let rota = this.eularToQuaternion(parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[2]))
            rota.x = -rota.x;
            rota.w = -rota.w;
            return rota;

        } else {
            this.log("rot输入错误:", rot);
            return null;
        }
    }

    eularToQuaternion(xx, yy, zz) {

        let X = xx / 180 * Math.PI;
        let Y = yy / 180 * Math.PI;
        let Z = zz / 180 * Math.PI;
        let x = Math.cos(Y / 2) * Math.sin(X / 2) * Math.cos(Z / 2) + Math.sin(Y / 2) * Math.cos(X / 2) * Math.sin(Z / 2);
        let y = Math.sin(Y / 2) * Math.cos(X / 2) * Math.cos(Z / 2) - Math.cos(Y / 2) * Math.sin(X / 2) * Math.sin(Z / 2);
        let z = Math.cos(Y / 2) * Math.cos(X / 2) * Math.sin(Z / 2) - Math.sin(Y / 2) * Math.sin(X / 2) * Math.cos(Z / 2);
        let w = Math.cos(Y / 2) * Math.cos(X / 2) * Math.cos(Z / 2) + Math.sin(Y / 2) * Math.sin(X / 2) * Math.sin(Z / 2);
        let quataion = new Laya.Quaternion(x, y, z, w);
        return quataion;
    }

    /**
     * 重置坐标
     * @param {Sprite3D} ob 
     */
    resetTransform(ob) {
        if (ob) {
            let temp = ob.transform.localScale;
            this.oneVec.cloneTo(temp);
            ob.transform.localScale = temp;

            temp = ob.transform.localPosition;
            this.zeroVec.cloneTo(temp);
            ob.transform.localPosition = temp;

            this.resetRot(ob);
        }
    }

    resetRot(ob) {
        if (ob) {
            let temp = ob.transform.localRotationEuler;
            this.zeroVec.cloneTo(temp);
            ob.transform.localRotationEuler = temp;
        }
    }

    /**
     * 移除子项
     * @param {Node} node 
     */
    removeChild(node) {
        if (node) {
            if (node._children.length != 0) {
                // for(var i=0;i<node._children.length;i++){
                //     node.getChildAt(0).destroy();
                // }
                node.destroyChildren();
            }
        }
    }



    lookAtTarget(toPos, owner) {

        toPos = toPos.clone();
        toPos.y = 0;

        Laya.Vector3.subtract(toPos, owner.transform.position, this.forwardTemp);
        this.forwardTemp.y = 0;

        Laya.Vector3.subtract(owner.transform.position, this.forwardTemp, this.targetTemp);

        owner.transform.lookAt(this.targetTemp, Laya.Vector3._Up);
    }

    /**
     * 通过标记拿到子物体
     * @param {*} sgin 
     */
    getChildBySgin(go, sgin, nodes) {

        let tempChild = null;
        for (var i = 0; i < go._children.length; i++) {
            tempChild = go._children[i];
            if (tempChild.name.indexOf(sgin) == 0) {
                nodes.push(tempChild);
            }
            this.getChildBySgin(tempChild, sgin, nodes)
        }
    }

    /**
     * 拿到第一子物体
     * @param {*} go 
     * @param {*} sgin 
     * @param {*} nodes 
     */
    getChildBySginInFirstChild(go, sgin, nodes){
        let tempChild = null;
        for (var i = 0; i < go._children.length; i++) {
            tempChild = go._children[i];
            if (tempChild.name.indexOf(sgin) == 0) {
                nodes.push(tempChild);
            }
           
        }
    }


    /**
     * 拿到mesh组件
     * @param {*} go 
     * @param {*} coms 
     */
    getMatInChild(go, coms) {
        for (var i = 0; i < go._children.length; i++) {

            if (go._children[i].meshRenderer) {
                let mats = go._children[i].meshRenderer.materials;
                for (var j = 0; j < mats.length; j++) {
                    coms.push(mats[j]);
                }
            }

            this.getMatInChild(go._children[i], coms)
        }

    }

    /**
     * 设置和批
     * @param {[]} array Laya.MeshSprite3d
     */
    setEnableInstancing(array) {
        let mat = null;
        for (var i = 0; i < array.length; i++) {
            mat = array[i];
            if (mat) {
                mat._shader._enableInstancing = true;
            }
        }
    }

    /**
     * 移除碰撞器
     * @param {*} go 
     */
    removeCollder(go) {
        let collder = go.getComponent(Laya.PhysicsCollider);
        if (collder) {
            collder.destroy();
        }
    }

    /**
     * 播放特效
     * @param {*} go 
     */
    playEffect(go) {
        go.active=false;
        go.active=true;
    }



    compileShader(array, callBack) {
        if (array.length == 0) {
            this.handlerFun(callBack);
        }
        let maxCount = 6;
        let obj = null;
        let loopFun = () => {
            if (array.length == 0) {
                console.log("shder编译完成");
                this.handlerFun(callBack);
                Laya.timer.clear(this, loopFun);
                return;
            }
            for (let i = 0; i < maxCount && i < array.length; i++) {
                obj = array.shift();
                Laya.Shader3D.compileShaderByDefineNames(obj.shaderName,
                    obj.subShaderIndex, obj.passIndex, obj.defineNames);
            }
        }

        Laya.timer.loop(20, this, loopFun);


    }


    /**
    * 分享
    */
    onShareTouched(btn, callbcak, type) {
        Tools.getIns().btnAction(btn);
        let qu = {};
        // share
        G_Share.share(type, qu, false, function (bSucc) {
            // body...
            if (bSucc) {
                // succ
                G_WXHelper.showToast("分享成功");
                this.handlerFun(callbcak);
            } else {
                G_WXHelper.showToast("分享失败");
            }
        }.bind(this))
    }

    /**
     * 查看文件
     * @param {*} btn 
     * @param {*} succCb 
     * @param {*} failCb 
     * @param {*} type 
     * @returns 
     */
    shareOrAd(btn, succCb, failCb, type = G_ShareScene.SS_FREE_TRY) {

        // if(this.isPlayAd){
        //     G_PlatHelper.showToast("正在拉取视频");
        //     return;
        // }

        if (G_PlatHelper.isWINPlatform()) {
            this.handlerFun(succCb);
            return;
        }

        if (btn) {
            this.isPlayAd = true;
            if (!btn.doTouch) {
                this.setAdBtnIcon(btn);
            }

            let scb = function () {
                this.isPlayAd = false;
                Tools.getIns().handlerFun(succCb);
            }.bind(this);

            let fcb = function () {
                this.isPlayAd = false;
                Tools.getIns().handlerFun(failCb);
            }.bind(this);
            btn.doTouch(type, scb, fcb);
        }

    }

    /**
     * 自动创建banner
     */
    createBanner(errorCb, succCb) {
        this.showBanner = true;
        let loadFun = () => {
            if (!this.showBanner) {
                return;
            }

            G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD);
            Tools.getIns().handlerFun(succCb);
        }

        if (G_PlatHelper.isQQPlatform() || G_PlatHelper.isWXPlatform()) {
            Laya.timer.once(1000, this, () => {
                loadFun();
            })

        } else {
            loadFun();
        }

    }

    hintBanner() {
        this.hintBannerNotSgin();
        this.showBanner = false;
    }

    hintBannerNotSgin() {
        G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD);
    }

    reShowBanner() {
        if (!this.showBanner) {
            return;
        }

        Tools.getIns().createBanner();
    }


    cretaeBannerAyn() {
        G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD);
    }

    /**
  * 设置按钮视屏分享图片
  * @param {*} btn 
  */
    setAdBtnIcon(btn) {

        if (btn) {
            if (!btn.refreshWay) {
                G_UIHelper.refreshFreeWayOfBtn(btn);
            } else {
                btn.refreshWay();
            }
        }



    }

    getColor(color) {
        if (!color) {
            return null;
        }
        let array = color.split('&');
        let v4 = new Laya.Vector4(0, 0, 0, 0);
        v4.x = parseFloat(array[0]) / 255;
        v4.y = parseFloat(array[1]) / 255;
        v4.z = parseFloat(array[2]) / 255;
        v4.w = 1;
        return v4;
    }

    /**
     * 停止子项和自己的动画
     * @param {*} go 
     */
    stopAnim(go) {
        if (!go) {
            return;
        }
        let anim = go.getComponent(Laya.Animator);
        if (anim) {
            anim.speed = 0;
        }

        for (var i = 0; i < go._children.length; i++) {
            anim = go._children[i].getComponent(Laya.Animator);
            if (anim) {
                anim.speed = 0;
            }
        }
    }


    /**
     * 按钮延时显示
     * @param {*} btn 
     * @param {*} callback 
     * @param {*} durationScale 
     */
    playBtnShow(btn, callback, durationScale) {
        if (G_PlatHelper.isVIVOPlatform() || G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isTTPlatform() || G_PlatHelper.isWINPlatform()) {
            Tools.getIns().handlerFun(callback);
            return;
        }
        this.playBtnShowNotLimit(btn, callback, durationScale)
    }

    playBtnShowNotLimit(btn, callback, durationScale = G_BtnDoShowTime) {

        if (btn && !btn.destroyed) {
            btn.visible = false;
            let time = 100 * durationScale;
            btn._tween = Laya.Tween.to(btn, { visible: true }, time);
            Laya.timer.once(time, null, function () {
                if (btn && !btn.destroyed) {
                    btn._tween = null
                    btn.visible = true;
                    this.handlerFun(callback);
                }
            }.bind(this));
        }
    }

    /**
     * 弹性运动
     * @param {*} target 
     * @param {*} t1 
     * @param {*} t2 
     * @param {*} delay 
     */
    bounceScale(target, t1, t2, callBack, startScale = 1, endScale = 1.2) {
        target.scaleX = startScale;
        target.scaleY = startScale;
        Laya.Tween.to(target, { scaleX: endScale, scaleY: endScale }, t1, Laya.Ease.bounceOut);
        Laya.timer.once(t1, this, function () {
            if (!target || target.destroyed) {
                return;
            }
            Laya.Tween.to(target, { scaleX: startScale, scaleY: startScale }, t2, Laya.Ease.linearIn);
            Laya.timer.once(t2, null, function () {
                Tools.getIns().handlerFun(callBack);
            })
        });

    }

    /**
     * 包装toast
     * @param {*} uIWordID 
     * @param {*} str 
     */
    showToast(uIWordID, str) {
        if (!uIWordID) {
            return;
        }
        if (!str) {
            str = "";
        }
        G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs[uIWordID]).word.format(str))
    }



    /**
   * 创建3x3的九宫格
   * @param {array} boxs 容纳数组
   * @param {string} itemName 预制item名字
   * @param {node} par 父物体
   * @param {Object} countData line 行 row 列 
   * @param {number} boxSpace 上下间距 v h
   * @param {function} callback 创建成功回调
   */
    createMatrix(boxs, itemName, par, countData, boxSpace, callback) {
        boxs.splice(0, boxs.length);
        countData.count = countData.line * countData.row;
        let boxPath = G_ResPath.itemPath.format(itemName);
        for (var i = 0; i < countData.count; i++) {
            Laya.loader.create(boxPath, Laya.Handler.create(this, function (obj) {
                this.createOne(boxs, obj, par, countData, boxSpace, callback);
            }));
        }
    }

    createOne(boxs, obj, par, countData, boxSpace, callback) {
        let json = new Laya.Prefab();
        json.json = obj;
        let go = json.create();
        par.addChild(go);
        boxs.push(go);
        if (boxs.length == countData.count) {
            this.setBoxPos(boxs, boxSpace, countData);
            this.handlerFun(callback);
        }
    }

    setBoxPos(boxs, boxSpace, countData) {

        let startX = 0;
        let startY = 0;

        if (countData.row % 2 == 0) {
            startX -= (countData.row / 2 - 0.5) * boxSpace.h;
        } else {
            startX -= (countData.row - 1) / 2 * boxSpace.h;
        }




        for (var i = 0; i < countData.line; i++) {

            for (var j = 0; j < countData.row; j++) {
                let index = i * countData.row + j;
                boxs[index].centerX = startX + boxSpace.h * j;
                boxs[index].centerY = startY + boxSpace.v * i;
            }
        }
    }

    createG0ByPrefabs(path, callBack, hasCache = false) {
        let json = new Laya.Prefab();
        let endFun = function (obj) {
            json.json = obj;
            let go = json.create();
            Tools.getIns().handlerFun(callBack, go);
        }
        if (hasCache) {
            endFun(Laya.loader.getRes(path));
        } else {
            Laya.loader.create(path, Laya.Handler.create(this, (obj) => {
                endFun(obj);
            }));
        }

    }


    gteUiJson(path) {

        return Laya.loader.getRes(path)
    }

    loadUiJson(path, callBack) {
        Laya.loader.create(path, Laya.Handler.create(this, function (obj) {
            Tools.getIns().handlerFun(callBack);
        }));
    }


    /**
     * 差值
     * @param {*} min 
     * @param {*} max 
     * @param {*} val 
     */
    lerp(min, max, val) {
        if (val <= 0) {
            return min;
        }

        if (val >= 1) {
            return max;
        }

        return min + (max - min) * val;
    }

    /**
     * 按钮移动
     * @param {*} move 
     * @param {*} startY 
     * @param {*} endY 
     * @param {*} endFun 
     * @param {*} btntoUpTimeDelay 
     * @param {*} btntoUptime 
     */
    bottomDoMove(move, startY, endY, endFun, btntoUpTimeDelay, btntoUptime) {
        if (!G_MistakeMgr.isMoveMistakeEnabledAsync() || G_PlatHelper.isTTPlatform()) {
            move.y = endY;
            this.handlerFun(endFun, false);
            return;
        }
        let ease = function (t, b, c, d) {
            if (t < d * 0.55) return Laya.Ease.bounceIn(t * 2, 0, c, d) * .5 + b;
            else return Laya.Ease.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
        move.y = startY;
        Laya.timer.once(btntoUpTimeDelay * 1000, this, function () {
            Laya.timer.once(btntoUptime * 1000, this, function () {
                this.handlerFun(endFun, true);
            })
            Laya.Tween.to(move, { y: endY }, btntoUptime * 1000, ease);
        })
    }

    /**
    * 是否能够使用物品 
    * 
    */
    canUseItem(count, type) {
        let canUse = this.canUseItemNotTips(count, type);
        if (type == 1) {//钻石
            if (!canUse) {
               // GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetDiamView);
                G_WXHelper.showToast("钻石不足");
            }
        } else if (type == 2) {//推杆皮肤

        } else if (type == 3) {//金币
            if (!canUse) {
               // GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetGoldView);
                G_WXHelper.showToast("金币不足");
            }
        } else if (type == 4) {//人物皮肤

        } else if (type == 5) {//体力
            if (!canUse) {
                G_WXHelper.showToast("体力不足");
               // GameMgr.getUIMgr().openUI(GameMgr.getUIName().GetPowerView);
            }
        }

        return canUse;
    }

    canUseItemNotTips(count, type) {
        // if (!G_PlatHelper.getPlat()) {
        //     return true;
        // }


        if (type == 1) {//钻石
            return G_PlayerInfo.getDiamCount().gte(count)
        } else if (type == 2) {//推杆皮肤

        } else if (type == 3) {//金币
            return G_PlayerInfo.getCoin().gte(count);
        } else if (type == 4) {//人物皮肤

        } else if (type == 5) {//体力
            return count <= G_PlayerInfo.getPower()
        }

        return false;
    }

    useItem(count, type, para1) {
        if (type == 1) {//1是钻石
            G_PlayerInfo.changeDiam(count, false);

        } else if (type == 2) {//钻石
            GameMgr.getPlayerInfo().useSkinChip(para1, count);
        } else if (type == 3) {//金币
            G_PlayerInfo.minusCoin(count);

        } else if (type == 5) {//体力
            G_PlayerInfo.usePower(count);
        }

    }



    isNumber(obj) {
        return obj === +obj
    }

    isString(obj) {
        return obj === obj + ''
    }


    timestampToTime(timestamp) {
        let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = this.changeNum(date.getDate());
        // let h = this.change(date.getHours()) + ':';
        // let m = this.change(date.getMinutes()) + ':';
        // let s = this.change(date.getSeconds());
        return Y + "年" + M + "月" + D + "日";//+ h + m + s;
    }



    changeNum(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;

        }
    }

    btnAction(btn, callBack) {
        if (!btn) {
            Tools.getIns().handlerFun(callBack);
            return;
        }

        G_SoundMgr.playSound(G_SoundName.SN_CLICK);

        this.btnTween(btn, callBack);

    }

    btnTween(btn, callBack) {
        if (!btn) {
            return;
        }
        btn.scaleX = 0.8;
        btn.scaleY = 0.8;
        let nodeTween = btn.nodeTween;
        if (nodeTween) {
            nodeTween.clear();
        }
        btn.nodeTween = Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(null, () => {
            btn.nodeTween.clear();
            Tools.getIns().handlerFun(callBack);
        }), 0, true, false);

    }

    createEf(name, pos, par, recycleTime, isAutoRecycle = false, rot = this.zeroVec, islocal = false, scale = this.oneVec) {

        if (!recycleTime && recycleTime != 0) {
            recycleTime = 1;
        }


        let pName = G_ResPath.resPath.format(name);

        let loadEnd = (go) => {
            if (!par) {
                go.destroy();
                return;
            }

            if (recycleTime != 0) {
                let ar = go.getComponent(AutoRecycleMgr);
                if (!ar) {
                    ar = go.addComponent(AutoRecycleMgr);
                }

                ar.setAutoRecycle(isAutoRecycle);
                ar.setRecycleKey(pName);
                ar.recycle(recycleTime);
            }

            par.addChild(go);
            this.resetTransform(go);

            if (!islocal) {
                let rPos = go.transform.position;
                pos.cloneTo(rPos);
                go.transform.position = rPos;
                rPos = go.transform.rotationEuler;
                rot.cloneTo(rPos);
                go.transform.rotationEuler = rPos;
            } else {
                go.transform.localPosition = pos;
                let rPos = go.transform.localRotationEuler;
                rot.cloneTo(rPos);
                go.transform.localRotationEuler = rPos;
            }
            go.transform.localScale = scale;
            this.playEffect(go);
        }

        let recycleGo = MapMgr.getIns().recycleMgr.getGo(pName);

        if (recycleGo) {
            recycleGo.active = true;
            loadEnd(recycleGo);
            return;
        }

        let assets = [];
        assets.push(pName);
        G_NodePoolMgr.preload(assets, () => {
            if (!par || par.destroyed) {
                return;
            }
            let go = G_NodePoolMgr.getNode(pName);
            loadEnd(go);
        });
    }

    showChild(node, show) {
        if (node) {
            for (var i = 0; i < node._children.length; i++) {
                node._children[i].active = show;
            }
        }
    }

    setBtnScaleTween(btn) {
        if (this.btnTweens.hasKey(btn)) {
            return;
        } else {

            let tween = TweenPoolMgr.getIns().getTween();
            let tVals = [];
            tVals.push({ time: 300, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearNone })
            tVals.push({ time: 300, prop: { scaleX: 1.1, scaleY: 1.1 }, ease: Laya.Ease.linearNone });
            tVals.push({ time: 300, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearNone });
            tween.setTweenVals(tVals);
            tween.setDelayTime(1000);
            tween.setTarget(btn);
            tween.setLoop(true);

            tween.play();
            this.btnTweens.addKey(btn, tween);
        }
    }

    setBtnShake(btn) {
        if (this.btnTweens.hasKey(btn)) {
            return;
        } else {

            let tween = TweenPoolMgr.getIns().getTween();

            tween.setLoop(true);
            tween.setTarget(btn);
            let tVals = [];
            tVals.push({ time: 100, prop: { rotation: 5, scaleX: 1.1, scaleY: 1.1 }, ease: Laya.Ease.linearNone });
            tVals.push({ time: 200, prop: { rotation: -5 }, ease: Laya.Ease.linearNone });
            tVals.push({ time: 100, prop: { rotation: 0, scaleX: 1, scaleY: 1 }, ease: Laya.Ease.linearNone });
            tween.setTweenVals(tVals);

            tween.play();
            this.btnTweens.addKey(btn, tween);
        }
    }


    closeBtnTween(btn) {
        if (this.btnTweens.hasKey(btn)) {
            let tween = this.btnTweens.getValue(btn);
            tween.end();
            this.btnTweens.removeKey(btn);
            TweenPoolMgr.getIns().recycleTween(tween);
        }
    }

    setImgPercent(maskImg, percent) {
        if (maskImg) {
            if (percent > 0) {
                if (!maskImg.mask) {
                    maskImg.mask = new Laya.Sprite()
                }
                maskImg.mask.graphics.clear()
                maskImg.mask.graphics.drawPie(maskImg.width / 2, maskImg.height / 2, maskImg.width / 2, 360 * percent - 90, 270, "#ffffff")
            }
            else {
                maskImg.mask = null
            }
        }
    }

    minBigNumber(bigNumber) {
        if (bigNumber.lte(0)) {
            bigNumber = BigNumber(1);
        }
        return bigNumber;
    }

    getRandomArrayElements(arr, count) {
        let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }


    createUiRoot(par, callBack) {
        let gameUIRoot = G_UIHelper.seekNodeByName(Laya.stage,"gameUIRoot");
        if(!gameUIRoot){
            gameUIRoot = new Laya.Box();
        }else{
            console.log("uiRoot 已经存在!");
        }

        gameUIRoot.name = "gameUIRoot";
        par.addChild(gameUIRoot);
        gameUIRoot.zOrder = 10;
        gameUIRoot.anchorX = 0.5;
        gameUIRoot.anchorY = 0.5;
        gameUIRoot.bottom = 0;
        gameUIRoot.top = 0;
        gameUIRoot.left = 0;
        gameUIRoot.right = 0;
        gameUIRoot.updateZOrder();

        let mainGui = gameUIRoot.addComponent(MainUIMgr);
        //设置单利
        GameMgr.setUIMgr(mainGui);
        mainGui.init();
        mainGui.preLoad(callBack);

        console.log("maingui init");
    }

    getRandArrayIndex(itemData) {
        let tempBoxRateData = new List();
        for (var i = 0; i < itemData.length; i++) {
            tempBoxRateData.add(itemData[i]);
        }

        tempBoxRateData.sort(function (v1, v2) {
            if (v1.rate < v2.rate) {
                return -1;
            } else if (v1.rate > v2.rate) {
                return 1;
            }

            return 0;
        });
        let rateSummary = 0;

        for (var i = 0; i < tempBoxRateData.getCount(); i++) {
            rateSummary += tempBoxRateData.getValue(i).rate;
        }

        let seed = Math.floor(Math.random() * rateSummary);//获得rateSummary以内的随机数
        let count = tempBoxRateData.getCount();
        for (var i = 0; i < count; i++) {
            seed -= tempBoxRateData.getValue(i).rate;
            if (seed <= 0) {
                return i;
            }
        }

        return tempBoxRateData.getCount() - 1;
    }

    setUINode(node, sgin, viewProp) {
        let p = [];
        Tools.getIns().getChildBySgin(node, sgin, p);
        for (var i = 0; i < p.length; i++) {
            viewProp[p[i].name] = p[i];
        }
    }



    setLayer(node, layer) {
        if (node) {

            node.layer = layer;
            if (node._children && node._children.length == 0) {
                return;
            }

            for (let i = 0; i < node._children.length; i++) {
                this.setLayer(node._children[i], layer);
            }
        }
    }

    insertVec(temp, val) {
        temp.x = val.x;
        temp.y = val.y;
        temp.z = val.z;

        return temp;
    }

    getNodeInAnim(anim, gos, sgin) {
        if (!anim) {
            return;
        }
        let mapArray = anim._keyframeNodeOwners;
        for (let i = 0; i < mapArray.length; i++) {
            let node = mapArray[i];
            if (node.propertyOwner._owner.name.indexOf(sgin) >= 0) {
                gos.push(node.propertyOwner._owner);
            }
        }

        return gos;
    }

    getNodeInGo(node, gos, sgin, depth = 2) {
        if (!node) {
            return;
        }

        if (depth <= 0) {
            return gos;
        }
        depth--;
        let mapArray = node._children;

        for (let i = 0; i < mapArray.length; i++) {
            let child = mapArray[i];
            if (child.name.indexOf(sgin) >= 0) {
                gos.push(child);
            }

            this.getNodeInGo(child, gos, sgin, depth);
        }

        return gos;
    }

    offectLevel(lv) {
        let count = G_GameDB.getAllLevelConfigCount();
        if (lv > count) {//重新回到第一关
            lv = lv % count;

            if (lv == 0) {
                lv = count;
            }
        }

        return lv;
    }

    bottomToMove(node, bottomVal, callBack, ease = Laya.Ease.linearOut) {
        if (!G_MistakeMgr.isMoveMistakeEnabledAsync() && !G_PlatHelper.isWINPlatform()) {

            node.bottom = bottomVal;
            Tools.getIns().handlerFun(callBack);
            return;
        }

        node.bottom = 0;
        Laya.timer.once(G_BtnDelayTime * 1000, null, () => {
            Laya.Tween.to(node, { bottom: bottomVal }, G_BrnMoveTimer * 1000, ease, new Laya.Handler(null, () => {
                Tools.getIns().handlerFun(callBack);
            }), 0, true, false);
        })

    }

    getArrayRaadomVal(array) {
        let index = Math.floor(Math.random() * (array.length - 0.1));
        return array[index];
    }

    randomNum(min, max) {
        return Math.floor(min + (max - min + 0.9) * Math.random())
    }

    //旋转z轴
    changeRot(node, toRot, maxRotSpeed = 50) {
        //找一个最近的方向旋转
        let temp = toRot - node.transform.localRotationEulerY;
        let tempAbs = temp >= 0 ? temp : -temp;
        if (tempAbs >= 180) {//切换到小角度旋转
            let sgin = temp / tempAbs;
            if (temp > 0) {
                temp = 360 - temp;
            } else {
                temp = 360 + temp;
            }
            //反方向
            temp *= -sgin;
        }

        if (temp != 0) {
            let sgin = temp / tempAbs;
            temp = tempAbs < maxRotSpeed ? tempAbs : maxRotSpeed;
            temp *= sgin;
        }

        node.transform.localRotationEulerY += temp;

        //校准角度(限制在绝对值180以内)
        if (node.angle > 180) {
            node.transform.localRotationEulerY -= 360;
        } else if (node.angle < -180) {
            node.transform.localRotationEulerY += 360;
        }
    }

    //旋转z轴
    changeRotLerp(node, rot, lerpVal = 0.8) {
        let tempRot = node.transform.rotation;
        Laya.Quaternion.lerp(node.transform.rotation, rot, lerpVal, tempRot);
        node.transform.rotation = tempRot;
    }

    getEquipByLv(lv, name) {
        if (lv < 3) {
            return null;
        } else if (lv >= 3 && lv < 6) {
            return name + 1;
        } else if (lv >= 6 && lv < 9) {
            return name + 2;
        } else {
            return name + 3;
        }
    }

    setColor(node, enougth) {
        if (node) {
            if (enougth) {
                if (node.color != "#00ff1e") {
                    node.color = "#00ff1e";
                }
            } else {
                if (node.color != "#ff0400") {
                    node.color = "#ff0400";
                }
            }
        }
    }

    canShowBanner() {
        if (G_PlatHelper.isOPPOPlatform()) {//oppo开局1分钟不显示banner
            if (Tools.getIns().showBannerTimer == 0 || Laya.timer.currTimer - Tools.getIns().showBannerTimer < Tools.getIns().showBannerDelay) {

                return false;
            }

        }

        return true;
    }

    returnSprite3D(node) {
        if (node instanceof Laya.Sprite3D) {
            return node;
        }

        return null;
    }

    findSprite3D(owner, name) {
        let node = G_UIHelper.seekNodeByName(owner, name);
        return this.returnSprite3D(node);
    }


    cretaeMesh(vertices, indices) {
        let vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
        return Laya.PrimitiveMesh._createMesh(vertexDeclaration, new Float32Array(vertices), new Uint16Array(indices));
    }

    loadTxt(path, callBack) {
        if (G_PlatHelper.getPlat() && G_PlatHelper.getPlat().getFileSystemManager) {
            let fs = G_PlatHelper.getPlat().getFileSystemManager();
            fs.readFile({
                filePath: path,
                encoding: "latin1",
                success: res => {
                    Tools.getIns().handlerFun(callBack, res.data);
                }
            })
        } else {
            Laya.loader.load(path, Laya.Handler.create(this, (jsonData) => {
                Tools.getIns().handlerFun(callBack, jsonData);
            }), null, Laya.loader.TEXT);
        }
    }

    changeAlpha(mat, alpha) {
        if (mat instanceof Laya.PBRStandardMaterial) {
            let tex = mat.albedoColor;
            tex.w = alpha;
            mat.albedoColor = tex;
        }
    }

    closeMesh(meshSp) {
        if (meshSp && meshSp.meshRenderer) {
            meshSp.meshRenderer.enable = false;
        }
    }

    /**
     * 拿到两个人物去除半径的平方根
     * @param {*} vec1 
     * @param {*} vec2 
     * @returns 
     */
    static getVecSquared(vec1, vec2,r1,r2) {

        if (!this.vecTemp) {
            this.vecTemp = new Laya.Vector3();
        }

        //两个半径的平方根
        let rq=(r1+r2);
        rq*=rq;

        //两点之间的距离
        Laya.Vector3.subtract(vec2, vec1, this.vecTemp);
        let dis=this.vecTemp.x * this.vecTemp.x + this.vecTemp.z * this.vecTemp.z;

       

        return dis-rq;
    }

    /**
     * 判断点vec是否在三角形内
     * @param {*} vecs 
     * @param {*} vec 
     */
    static vecInTriangle(a, b, c, p) {

        if (!this.tempV1) {
            this.tempV1 = new Laya.Vector3();
        }

        if (!this.tempV2) {
            this.tempV2 = new Laya.Vector3();
        }

        if (!this.tempV3) {
            this.tempV3 = new Laya.Vector3();
        }


        //判断ab边
        Laya.Vector3.subtract(b, a, this.tempV1);
        Laya.Vector3.subtract(p, a, this.tempV2);

        let sideA = this.getCrossForward(this.tempV1, this.tempV2, this.tempV3);

        //判断bc边
        Laya.Vector3.subtract(c, b,  this.tempV1);
        Laya.Vector3.subtract(p, b, this.tempV2);
        let sideB = this.getCrossForward(this.tempV1, this.tempV2, this.tempV3);

        //判断是否同向
        if((sideA>0&&sideB<0)||(sideA<0&&sideB>0)){
            return false;
        }

        //判断ca边
        Laya.Vector3.subtract(a, c, this.tempV1);
        Laya.Vector3.subtract(p, c, this.tempV2);
        let sideC=this.getCrossForward(this.tempV1, this.tempV2, this.tempV3);

        if((sideA>0&&sideC<0)||(sideA<0&&sideC>0)){
            return false;
        }

        return true;
    }


    /**
     * 拿到两个向量差值积
     * @param {*} v1 
     * @param {*} v2 
     * @param {*} temp 
     * @returns 
     */
    static getCrossForward(v1, v2, temp) {
        v1.y = 0;
        v2.y = 0;
        Laya.Vector3.cross(v1, v2, temp);
        return temp.y;
    }



}

