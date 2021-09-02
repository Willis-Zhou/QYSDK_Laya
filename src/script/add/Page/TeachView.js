import GameMgr from "../Mgr/GameMgr";
import MapMgr from "../Mgr/MapMgr";
import TeachMgr from "../teach/TeachMgr";

import PageBase from "../UIFrame/PageBase";
import TweenPoolMgr from "../UIFrame/TweenPoolMgr";


export default class TeachView extends PageBase {

    constructor() {
        super();
        this.autoDepth = false;
        this.teachTarget = null;
        this.teachData = null;
        this.fingerTween = TweenPoolMgr.getIns().getTween();
        let vals = [];
        vals.push({ time: 500, prop: { scaleX: 1, scaleY: 1 }, ease: Laya.Ease.circOut });
        vals.push({ time: 500, prop: { scaleX: 1.1, scaleY: 1.1 }, ease: Laya.Ease.circOut });
        this.fingerTween.setTweenVals(vals);
        this.fingerTween.setLoop(true);

        this.otherTarget = null;

    }

    pageInit() {
        super.pageInit();
        this.fingerTween.setTarget(this.viewProp.m_finger);

        this.viewProp.m_bg.on(Laya.Event.CLICK, this, () => {
            if (!this.teachData || this.teachData.clickMaskToNext != 1) {
                return;
            }

            this.closeFun();
        });


    }

    pageOpen(vals) {
        super.pageOpen(vals);
        this.fingerTween.play();

        this.teachTarget = vals.target;
        this.initTarget(this.teachTarget.owner);

        //是否有同时出现的按钮
        let teachData = G_GameDB.getTeachByID(TeachMgr.getIns().getCurTeachId());
        let otherKey = teachData.otherKey;
        if (otherKey != "0") {
            this.otherTarget = TeachMgr.getIns().getTeachBtn(otherKey);
            this.initTarget(this.otherTarget.owner);
        }

        this.setUi(teachData);
    }


    actionStart(teachData) {
        //buff类型
        if (teachData.btnKey.indexOf("yx_buff_") >= 0) {

            let buffId = parseInt(teachData.btnKey.split('_')[2]);
            if (buffId == 1) {
                //玩家位置重置
                let startPoint = MapMgr.getIns().configMgr.getStartPoint();
                MapMgr.getIns().playerMgr.setStartPos(startPoint.transform.position, startPoint.transform.rotationEuler);
            }

            let sBuff = MapMgr.getIns().configMgr.getBuffById(buffId);
            if (sBuff) {
                let pos = MapMgr.getIns().cameraMgr.worldPosToScreenPos(sBuff.owner.transform.position);
                pos.y -= 80;
                this.setFingerPos(this.owner, this.viewProp.m_finger, pos, this.teachData.fingerRot);
            } else {
                console.error("buff不存在:", sBuff);
            }

        } else if (teachData.btnKey.indexOf("yx_kill_enemy") >= 0) {//击杀玩家
            let enemy = MapMgr.getIns().configMgr.getTeachEnemy();
            if (enemy) {
                let pos = MapMgr.getIns().cameraMgr.worldPosToScreenPos(enemy.owner.transform.position);
                pos.y -= 90;
                this.setFingerPos(this.owner, this.viewProp.m_finger, pos, this.teachData.fingerRot);
            }
        }
    }

    actionEnd(teachData) {
        if(teachData.id==11){
            MapMgr.getIns().configMgr.loadEnemys(GameMgr.getIns().levelData, () => {
                TeachMgr.getIns().enableTeachStep(13)
            });
        }
        
    }

    initTarget(target) {
        target.lastX = target.x;
        target.lastY = target.y;

        target.lastParent = target.parent;
        let point = new Laya.Point();
        point = target.localToGlobal(new Laya.Point(target.width / 2, target.height / 2), true);
        target.point = point;
        target.centerY = NaN;
        target.centerX = NaN;
        this.owner.addChild(target);
        target.pos(point.x, point.y);
    }

    hintMask() {
        this.viewProp.m_mask.visible = false;
        this.viewProp.m_teach_bg_right.visible = false;
        this.viewProp.m_teach_bg_left.visible = false;
        this.viewProp.m_teach_bg_min.visible = false;
    }


    setUi(teachData) {
        if (teachData.enableClick == 1) {
            this.addClick(this.teachTarget.owner);
        }

        this.teachData = teachData;
        this.viewProp.m_bg.visible = teachData.isForce == 1;
        this.viewProp.m_mask.visible = teachData.isMask == 1;

        this.viewProp.m_finger.visible = false;
        this.viewProp.m_finger2.visible = false;
        let tempFingerOffect = teachData.fingerOffect.split(',');
        let x = parseFloat(tempFingerOffect[0]);
        let y = parseFloat(tempFingerOffect[1]);
        if (teachData.isFinger == 1) {
            //设置第一个手指
            this.setFingerCenter(this.teachTarget.owner, this.viewProp.m_finger, { x: x, y: y }, teachData.fingerRot);

            //判断是否有第二个手指
            if (this.otherTarget) {
                this.setFingerCenter(this.otherTarget.owner, this.viewProp.m_finger2, { x: x, y: y }, teachData.fingerRot);
            }
        }


        this.viewProp.m_teach_bg_left.visible = false;
        this.viewProp.m_teach_bg_right.visible = false;
        this.viewProp.m_teach_bg_min.visible = false;

        let tempPos = teachData.tipsPos.split(',');
        if (teachData.needTipsBg == 1) {

            this.viewProp.m_tips_in_Bg_left.text = teachData.tips;
            this.viewProp.m_tips_in_Bg_right.text = teachData.tips;
            let tBg = this.viewProp.m_teach_bg_left;
            if (teachData.bgForward != 1) {
                tBg = this.viewProp.m_teach_bg_right;
            }

            tBg.visible = true;

            if (tBg.tween) {
                tBg.tween.clear();
                tBg.tween = null;
            }
            tBg.scaleX = 0.5;
            tBg.scaleY = 0.5;

            tBg.tween = Laya.Tween.to(tBg, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.linearOut, null, 0, true, false);

        } else if (teachData.needTipsBg == 0) {
            this.viewProp.m_teach_bg_min.visible = true;
            this.viewProp.m_tips.text = teachData.tips;
            this.viewProp.m_teach_bg_min.centerX = parseFloat(tempPos[0]);
            this.viewProp.m_teach_bg_min.centerY = parseFloat(tempPos[1]);
            this.teachTarget.owner.addChild(this.viewProp.m_teach_bg_min);
        } else {
            //不显示tips
        }

        this.actionStart(teachData);

    }

    setFingerCenter(par, finger, pos, rot) {
        finger.visible = true;
        par.addChild(finger);
        finger.centerX = pos.x;
        finger.centerY = pos.y;
        finger.rotation = rot;
    }

    setFingerPos(par, finger, pos, rot) {
        finger.visible = true;
        par.addChild(finger);
        finger.centerY = NaN;
        finger.centerX = NaN;
        finger.x = pos.x;
        finger.y = pos.y;
        finger.rotation = rot;
    }

    mouseDownFun() {
        if (!this.teachData) {
            return;
        }

        if (this.teachData.clickHintMask == 1) {
            this.hintMask();
        }

    }

    addClick(btn) {
        btn.on(Laya.Event.CLICK, this, this.closeFun);
        btn.on(Laya.Event.MOUSE_DOWN, this, this.mouseDownFun);
    }


    clearClick(btn) {

        if (!btn || !btn._events) {
            return;
        }
        btn.off(Laya.Event.CLICK, this, this.closeFun);
        btn.off(Laya.Event.MOUSE_DOWN, this, this.mouseDownFun);
    }

    closeFun() {

        let teachKey = this.teachTarget.getStepKey();
        this.clearTarget();
        GameMgr.getUIMgr().closeUI(GameMgr.getUIName().TeachView);
        TeachMgr.getIns().closeTeachStep(teachKey);
        this.actionEnd(this.teachData);
    }

    recycleFinger() {
        if (this.viewProp.m_finger.parent != this.owner) {
            this.owner.addChild(this.viewProp.m_finger);
        }

        if (this.viewProp.m_teach_bg_min.parent != this.owner) {
            this.owner.addChild(this.viewProp.m_teach_bg_min);
        }

        if (this.viewProp.m_finger2.parent != this.owner) {
            this.owner.addChild(this.viewProp.m_finger2);
        }
    }


    clearTarget() {
        if (this.teachTarget) {

            let target = this.teachTarget.owner;
            this.teachTarget = null;
            this.recycleFinger();
            this.clearClick(target);
            target.lastParent.addChild(target);
            target.x = target.lastX;
            target.y = target.lastY;
            this.viewProp.m_finger.visible = false;
            this.viewProp.m_finger2.visible = false;
            this.viewProp.m_mask.visible = false;
            this.viewProp.m_teach_bg_min.visible = false;

        }

        if (this.otherTarget) {
            let target = this.otherTarget.owner;
            this.otherTarget = null;
            //this.clearClick(target);
            target.lastParent.addChild(target);
            target.x = target.lastX;
            target.y = target.lastY;
        }
    }

    depChangeCallBack() {
        super.depChangeCallBack();
        this.owner.zOrder = GameMgr.getUIMgr().curPageDepth + 40;
    }

    pageClose() {
        super.pageClose();
        this.fingerTween.end();
    }
}