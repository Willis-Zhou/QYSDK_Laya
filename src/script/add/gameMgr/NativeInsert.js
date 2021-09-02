import Tools from "../UIFrame/Tools";

/**
 * 嵌入式 带按钮的原生
 */
export default class NativeInsert extends Laya.Script {

    constructor() {
        super();
        this.decs = null;
        this.title = null;
        this.icon = null;
        this.clickBtn = null;
        this.close = null;

        this._insertAdObj = null;
        this._insertAdInfo = null;
        this.c_icon=null;

        this.canRefersh=true;
    }

    init() {
        this.decs = G_UIHelper.seekNodeByName(this.owner, "decs");
        this.icon = G_UIHelper.seekNodeByName(this.owner, "icon");
        this.c_icon=G_UIHelper.seekNodeByName(this.owner,"c_icon");
        this.clickBtn = G_UIHelper.seekNodeByName(this.owner, "clickBtn");
        this.close = G_UIHelper.seekNodeByName(this.owner, "close");
        this.title = G_UIHelper.seekNodeByName(this.owner, "title");
        this.cArea=G_UIHelper.seekNodeByName(this.owner,"cArea");
        this.clickBtn && this.clickBtn.on(Laya.Event.CLICK, this, () => {
            this.doClick();
        })

        this.icon && this.icon.on(Laya.Event.CLICK, this, () => {
            this.doClick();
        })

        this.close && this.close.on(Laya.Event.CLICK, this, () => {

            this.hideUI();
        })

        this.cArea&&this.cArea.on(Laya.Event.CLICK, this, () => {
            this.doClick();
        })

        this.addListener();
    }

    doClick() {
        if (this._insertAdObj && this._insertAdInfo) {
            G_OVAdv.reportNativeAdClick(this._insertAdObj, this._insertAdInfo.adId, this._insertAdInfo.localAdID)
        }
        G_Event.dispatchEvent(G_EventName.EN_REFRESH_FLOW_AD)
        this.hideUI();
        //刷新一条
        this.setCanRefersh();
    }

    addListener(){
        G_Event.addEventListerner(G_EventName.EN_REFRESH_FLOW_AD, this.setCanRefersh, this)
    }

    setCanRefersh(){
        if(this.owner.visible){
            this.refershNative();
        }else{
            this.canRefersh=true;
        }
    }

    refershNative() {
        if (!G_PlatHelper.isOPPOPlatform()) {
            this.hideUI();
            return;
        }

        if(!Tools.getIns().canShowBanner()){
            this.hideUI();
            return;
        }

        let ret = G_OVAdv.getNextNativeAdInfo();
        if (ret) {
            let insertAdObj = ret[0]
            let insertAdInfo = ret[1]
            if (insertAdObj && insertAdInfo) {
                // save
                this._insertAdObj = insertAdObj
                this._insertAdInfo = insertAdInfo;
                if (this.decs) {
                    this.decs.text = insertAdInfo.desc;
                }

                if (this.title) {
                    this.title.text = insertAdInfo.title;
                }

                

                if (insertAdInfo.imgUrlList.length > 0) {
                   
                    this.setIcon(this.icon,insertAdInfo.imgUrlList[0]);
                    this.setIcon(this.c_icon,insertAdInfo.imgUrlList[0]);
                    
                } else if (insertAdInfo.iconUrlList.length > 0) {
                    this.setIcon(this.icon,insertAdInfo.iconUrlList[0]);
                    this.setIcon(this.c_icon,insertAdInfo.iconUrlList[0]);
                } else {
                    this.hideUI();
                }
                this.canRefersh=false;

                // report ad show
                G_OVAdv.reportNativeAdShow(insertAdObj, insertAdInfo.adId)
            } else {
                this.hideUI();
            }
        }
        else {
            // hideUI
            this.hideUI();
        }
    }


    setIcon(icon,url){
        if(icon){
            icon.skin=url;
        }
    }

    hideUI() {
        this.owner.visible = false;
        G_OVAdv.reportNativeAdHide();
    }

    showUI(){
        this.owner.visible=true;
        this.canRefersh&&this.refershNative();
        if(this._insertAdObj&&this._insertAdInfo){
            G_OVAdv.reportNativeAdShow(this._insertAdObj, this._insertAdInfo.adId)
        }
    }
}