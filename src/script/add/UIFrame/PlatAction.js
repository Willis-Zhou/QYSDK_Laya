import Tools from "./Tools";

export default class PlatAction {

    constructor() {
        this.isinLoadAppBox = false;//是否在加载盒子广告
        this.boxad = null;
        this.todayShowColorTimes = 0;
        this.isShowNetworkErrorWindow = false;

        this.blockAds = [];
        this.inCreateBlockAds = [];//正在创建的积木广告

        this.customAds = [];
        this.inCreateCustomAds = [];

        this.inCreateGamePortalAd = false;//九宫格盒子是否在加载
        this.gamePortalAd = null;

        this.isShowCustomAd = false;
        this.customObj=new Object();

        this.oneCustomId="adunit-3ca653512f9dbf5c";
        this.vecCustomId="adunit-bb87c546e56e2ab1";

        this.cusOneWidth=68;
        this.cusOneHeight=106;

        this.cusMulWidth=72*0.8;
        this.cusMulHeight=410*0.8;
    }

   
    static getIns(){
        if (!this.instance) {
            this.instance=new PlatAction();
            this.instance.init();
        }

        return this.instance;
    }
    
    init() {
        
    }

    /**
     * 盒子广告
     * @param {*} callBack 
     */
    cretaeBoxAd(callBack) {
        if (G_PlatHelper.isOPPOPlatform()) {

            if (qg.getSystemInfoSync().platformVersionCode >= 1076) {

                if (this.gamePortalAd) {
                    G_PlatHelper.showToast("拉取广告太频繁哦!");
                }

                let toDes = (cb) => {
                    if (this.gamePortalAd) {
                        this.gamePortalAd.destroy().then(() => {
                            this.gamePortalAd = null;
                            Tools.getIns().handlerFun(cb);

                        }).catch(() => {
                            this.gamePortalAd = null;
                            Tools.getIns().handlerFun(cb);
                        });
                    } else {
                        Tools.getIns().handlerFun(cb);
                    }
                }

                let toLoadAd = () => {

                    let gamePortalAd = qg.createGamePortalAd({
                        adUnitId: '314196'
                    });

                    this.gamePortalAd = gamePortalAd;

                    let loadFun = () => {
                        gamePortalAd.offLoad(loadFun);
                        gamePortalAd.show();
                    }

                    let errorFun = (err) => {
                        if (gamePortalAd) {
                            gamePortalAd.offError(errFun);
                        }
                        toDes();
                        Tools.getIns().handlerFun(callBack);
                        G_PlatHelper.showToast("拉取广告失败");
                        console.error("err:", err);
                    }

                    let closeFun = () => {
                        gamePortalAd.offClose(closeFun);
                        toDes();
                        Tools.getIns().handlerFun(callBack);
                    }


                    gamePortalAd.onClose(closeFun);
                    gamePortalAd.onError(errorFun);
                    gamePortalAd.onLoad(loadFun);

                }


                toDes(() => {
                    toLoadAd();
                })
            } else {
                G_PlatHelper.showToast("快应用平台版本号低于1076，暂不支持互推盒子!");
            }

        } else {
            G_Adv.createBoxAdv(callBack);
        }
    }

    /**
     * 添加彩铅
     */
    addColorSign() {
        if (G_PlatHelper.isQQPlatform() && this.canShowColorSgin()) {
            G_Adv.addColorSign();
            this.addColorTimes()
        }

    }

    /**
     * 
     * @param {*} align 1上 2下 3左 4右 5居中
     * @param {*} offect 校准位置
     * @param {*} size 范围是1~5，积木广告的个数（展示以实际拉取广告数量为准）
     * @param {*} orientation landscape 或者 vertical，积木广告横向展示或者竖向展示
     */
    createBlockAd(align = 2, offect = 20, size = 5, orientation = "landscape") {

        if (window.qq && qq.createBlockAd) {
            let blockAd = qq.createBlockAd({
                style: {
                    left: 20,
                    top: 32
                },
                adUnitId: "d9dabf021c3f23308e8cdd304f0eb730",
                size: size,
                orientation: orientation
            });
            blockAd.isShowAd = true;
            let self = this;
            this.addInCreateBlockAd(blockAd);
            let reSizeFun = (res) => {

                if (!blockAd) {
                    return;
                }

                let sysInfo = G_PlatHelper.getPlat().getSystemInfoSync();
                if (align == 2) {//向下对齐
                    blockAd.style.top = sysInfo.screenHeight - res.height - offect;
                    blockAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                } else if (align == 3) {
                    blockAd.style.top = (sysInfo.screenHeight - res.height) / 2
                    blockAd.style.left = offect;
                } else if (align == 4) {
                    blockAd.style.top = (sysInfo.screenHeight - res.height) / 2
                    blockAd.style.left = sysInfo.screenWidth - res.width - offect;
                } else if (align == 5) {
                    blockAd.style.top = (sysInfo.screenHeight - res.height) / 2 - offect
                    blockAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                }
            }

            blockAd.onResize(reSizeFun);

            let errFun = (err) => {
                if (!blockAd) {
                    return;
                }
                console.error("积木广告创建失败:", err);
                blockAd.offError(errFun);
                blockAd.offResize(reSizeFun);
                blockAd.destroy();//直接摧毁
            }

            blockAd.onError(errFun);

            let onLoadFun = () => {
                if (!blockAd) {
                    return;
                }
                blockAd.offLoad(onLoadFun);
                self.removeInCreateBlockAd(blockAd);//移除正在加载
                if (blockAd.isShowAd) {
                    blockAd.show();
                    self.addblockAd(blockAd);
                } else {
                    blockAd.offError(errFun);
                    blockAd.offResize(reSizeFun);
                    blockAd.destroy();//直接摧毁
                }
            }

            blockAd.onLoad(onLoadFun);
        }
    }

    //创建左右两边的积木广告
    createTwoBlockAd(offect = 100, size = 4, orientation = "vertical") {
        //创建左边
        this.createBlockAd(3, offect, size, orientation);

        //创建右边
        this.createBlockAd(4, offect, size, orientation);
    }

    /**
     * 创建正中心的积木
     */
    cretaeCenterBlockAd(offect = 0, size = 5, orientation = "landscape") {
        this.createBlockAd(5, offect, size, orientation);
    }

    addInCreateBlockAd(blockAd) {
        let index = this.inCreateBlockAds.indexOf(blockAd);
        if (index < 0) {
            this.inCreateBlockAds.push(blockAd);
        }

    }

    removeInCreateBlockAd(blockAd) {
        let index = this.inCreateBlockAds.indexOf(blockAd);
        if (index >= 0) {
            this.inCreateBlockAds.splice(index, 1);
        }
    }

    addblockAd(blockAd) {
        let index = this.blockAds.indexOf(blockAd);
        if (index < 0) {
            this.blockAds.push(blockAd);
        }
    }

    destoryBlockAd() {
        if (this.blockAds.length > 0) {
            for (let i = 0; i < this.blockAds.length; i++) {
                this.blockAds[i].destroy();
            }
            this.blockAds.splice(0, this.blockAds.length);
        }

        if (this.inCreateBlockAds.length > 0) {
            for (let i = 0; i < this.inCreateBlockAds.length; i++) {
                this.inCreateBlockAds[i].isShowAd = false;
            }
        }
    }

    canShowColorSgin() {
        return this.todayShowColorTimes < 1;
    }

    addColorTimes() {
        this.todayShowColorTimes++;
    }

    isWatchingVideoAdv() {
        if (G_PlatHelper.isOVPlatform()) {
            return G_OVAdv.isWatchingVideoAdv();
        } else {
            return G_Adv.isWatchingVideoAdv();
        }
    }

    checkNetworkType() {
        if (window.qg) {
            if (qg.getNetworkType) {
                qg.getNetworkType({
                    success: (res) => {
                        if (!res || res.networkType == 'none') {
                            this.showNetworkError();
                        }
                    },
                    fail: () => {
                        this.showNetworkError();
                    },
                    complete: null
                });
            }

            if (qg.onNetworkStatusChange) {
                qg.onNetworkStatusChange((res) => {
                    if (!res || !res.isConnected) {
                        this.showNetworkError();
                    }
                }
                );
            }

        }
    }

    showNetworkError() {
        if (this.isShowNetworkErrorWindow) {
            return;
        }

        this.showModal("网络错误", "请重启游戏!", false, (isConfirm) => {
            this.exitApp();

        })
    }

    showModal(title, content, showCancel, callBack) {
        if (window.qg && qg.showModal) {
            qg.showModal({
                title: title,
                content: content,
                showCancel: showCancel,
                success(res) {
                    if (res) {
                        if (callBack) {
                            callBack(true);
                        }
                    } else {
                        if (callBack) {
                            callBack(false);
                        }
                    }
                }
            })
        }
    }

    exitApp() {

        if (window.qg && qg.exitApplication) {
            qg.exitApplication({
                success: null,
                fail: null,
                complete: null
            });
        }
    }


    /**
    * 
    * @param {*} align 1上 2下 3左 4右 5居中 6左下 7右下 8左上 9右上
    * @param {*} offectX 校准位置 
    * @param {*} offectY 对齐对应的位置的偏移
    */
    createCustomAd(align = 2, offectX = 20, offectY = 0, adUnitId = this.vecCustomId) {
        this.isShowCustomAd = true;
        this.customObj.align=align;
        this.customObj.offectX=offectX;
        this.customObj.offectY=offectY;
        this.customObj.adUnitId=adUnitId;
        
        if (window.wx && wx.createCustomAd) {
            let top = 0;
            let left = 0;
            let sysInfo = G_PlatHelper.getPlat().getSystemInfoSync();
            if (align == 2) {//下
                top = sysInfo.screenHeight - offectY;
                left = (sysInfo.screenWidth) / 2;
            } else if (align == 3) {//左
                top = (sysInfo.screenHeight) / 2 - offectY
                left = offectX;
            } else if (align == 4) {//右
                top = (sysInfo.screenHeight) / 2 - offectY
                left = sysInfo.screenWidth - offectX;
            } else if (align == 5) {//中
                top = (sysInfo.screenHeight) / 2 - offectY;
                left = (sysInfo.screenWidth) / 2;
            } else if (align == 1) {//上
                top = offectY;
                left = (sysInfo.screenWidth) / 2 - offectX;
            } else if (align == 6) {//左下
                top = sysInfo.screenHeight - offectY;
                left = offectX;
            } else if (align == 7) {//右下
                top = sysInfo.screenHeight - offectY;
                left = sysInfo.screenWidth - offectX;
            } else if (align == 8) {//左上
                top = offectY;
                left = offectX;
            } else if (align == 9) {//右上
                top = offectY;
                left = sysInfo.screenWidth - offectX;
            }

            let cuesomAd = wx.createCustomAd({
                style: {
                    left: left,
                    top: top,
                    fixed: true // fixed 只适用于小程序环境
                },
                adIntervals: 60,
                adUnitId: adUnitId,
            });
            cuesomAd.isShowAd = true;
            this.addInCreateCustomAd(cuesomAd);

            let errFun = (err) => {
                if (!cuesomAd) {
                    return;
                }
                console.error("积木广告创建失败:", err);
                cuesomAd.offError(errFun);
                cuesomAd.destroy();//直接摧毁
            }

            cuesomAd.onError(errFun);

            let onLoadFun = () => {
                if (!cuesomAd) {
                    return;
                }
                cuesomAd.offLoad(onLoadFun);
                this.removeInCreateCustomAd(cuesomAd);//移除正在加载
                if (cuesomAd.isShowAd) {
                    cuesomAd.show();
                    this.addCustomAd(cuesomAd);
                } else {
                    cuesomAd.offError(errFun);
                    cuesomAd.destroy();//直接摧毁
                }
            }

            cuesomAd.onLoad(onLoadFun);
        }
    }

    createTwoCustomAd(){
        PlatAction.getIns().createCustomAd(3, 5, this.cusMulHeight/2, this.vecCustomId);
        PlatAction.getIns().createCustomAd(4, 5+this.cusMulWidth,  this.cusMulHeight/2, this.vecCustomId);
    }

    addInCreateCustomAd(customAd) {
        let index = this.inCreateCustomAds.indexOf(customAd);
        if (index < 0) {
            this.inCreateCustomAds.push(customAd);
        }
    }

    removeInCreateCustomAd(customAd) {
        let index = this.inCreateCustomAds.indexOf(customAd);
        if (index >= 0) {
            this.inCreateCustomAds.splice(index, 1);
        }
    }

    addCustomAd(customAd) {
        let index = this.customAds.indexOf(customAd);
        if (index < 0) {
            this.customAds.push(customAd);
        }
    }

    destoryCustomAd() {
        this.isShowCustomAd = false;
        this.destoryCustomAdNotSgin();
    }

    destoryCustomAdNotSgin(){
        if (this.customAds.length > 0) {
            for (let i = 0; i < this.customAds.length; i++) {
                this.customAds[i].destroy();
            }
            this.customAds.splice(0, this.customAds.length);
        }

        if (this.inCreateCustomAds.length > 0) {
            for (let i = 0; i < this.inCreateCustomAds.length; i++) {
                this.inCreateCustomAds[i].isShowAd = false;
            }
        }
    }

}