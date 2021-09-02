import GameMgr from "../Mgr/GameMgr";
import PageBase from "../UIFrame/PageBase";
import MapMgr from "../Mgr/MapMgr";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
export default class LoadingView extends PageBase {

    constructor() {
        super();


        this.openRightTween = new ContinuousTweenMgr();
        this.openLeftTween = new ContinuousTweenMgr();


    }

    pageInit() {
        super.pageInit();
        MapMgr.getIns().setLoadingView(this);
        this.viewProp.m_bg.on(Laya.Event.CLICK, this, function () {

        });

        this.openRightTween.setTarget(this.viewProp.m_right);
        this.openLeftTween.setTarget(this.viewProp.m_left);

        let vals = [];
        vals.push({ time: 500, prop: { right: 0 }, ease: Laya.Ease.linearOut });
        vals.push({ time: 500, prop: { right: -600 }, ease: Laya.Ease.linearOut });
        this.openRightTween.setTweenVals(vals);


        let vals1 = [];
        vals1.push({ time: 500, prop: { left: 0 }, ease: Laya.Ease.linearOut });
        vals1.push({ time: 500, prop: { left: -600 }, ease: Laya.Ease.linearOut });
        this.openLeftTween.setTweenVals(vals1);
    }




    openBgTwen() {
        this.openRightTween.clearEndFun();
        this.openRightTween.end();
        this.openLeftTween.end();

        this.openRightTween.setReverse(false);
        this.openLeftTween.setReverse(false);

        this.openRightTween.play();
        this.openLeftTween.play();
        this.openRightTween.setEndCallBack(() => {
            GameMgr.getUIMgr().closeUI(GameMgr.getUIName().LodingView);
        })
    }


    closeBgTween() {
        this.openRightTween.clearEndFun();
        this.openRightTween.end();
        this.openLeftTween.end();

        this.openRightTween.setReverse(true);
        this.openLeftTween.setReverse(true);

        this.openRightTween.play();
        this.openLeftTween.play();
    }


}