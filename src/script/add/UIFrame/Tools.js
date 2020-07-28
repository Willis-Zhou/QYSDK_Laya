import AutoRecycleMgr from "../Mgr/AutoRecycleMgr"
import { Dictionary } from "./Dictionary";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
export default class Tools {

    constructor() { 
        this.init();
        this.btnTweens=new Dictionary();
        this.stopTween=[];
        this.showBanner=true;
    }

    init(){
       this.log("Tools init");
    }

    log(message, ...optionalParams){
        if(!Laya.Browser.onPC){
            return;
        }

        console.log(message,optionalParams);
    }

    error(message, ...optionalParams){
        console.error(message,optionalParams);
    }
    

    /**
     * 函数执行
     * @param {function} fun 
     */
    handlerFun(fun){
        if(fun!=null){
            fun();
        }
    }

    handlerFun(fun,...any){
        if(fun!=null){
            fun(...any);
        }
    }

    /**
     * 转化3维坐标
     * @param {String} vec x&y&z
     */
    getVector3(vec){
        if(vec){
            let temp=vec.split('&');
            let v=new Laya.Vector3(-parseFloat(temp[0]),parseFloat(temp[1]),parseFloat(temp[2]));

            return v;
            
        }else{
            this.error("vec输入错误:",vec);
            return null;
        }
    }

    getVector4(vec){
        if(vec){
            let temp=vec.split('&');
            let v=new Laya.Vector4(parseFloat(temp[0]),parseFloat(temp[1]),parseFloat(temp[2]),parseFloat(temp[3]));

            return v;
            
        }else{
            this.error("vec输入错误:",vec);
            return null;
        }
    }

    /**
     * 转化四元数
     * @param {String} rot x&y&z&w
     */
    getRot(rot){
        if(rot){
            let temp=rot.split('&');
            let rota=this.eularToQuaternion(parseFloat(temp[0]),parseFloat(temp[1]),parseFloat(temp[2]))
            rota.x=-rota.x;
            rota.w=-rota.w;
            return rota;
            
        }else{
            this.log("rot输入错误:",rot);
            return null;
        }
    }

      eularToQuaternion( xx, yy, zz) {

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
    resetTransform(ob){
        if(ob){
            ob.transform.localScale=new Laya.Vector3(1,1,1);
            ob.transform.localPosition=new Laya.Vector3(0,0,0);
            ob.transform.localRotationEuler=new Laya.Vector3(0,0,0);
        }
    }

    /**
     * 移除子项
     * @param {Node} node 
     */
    removeChild(node){
        if(node){
        if(node._children.length!=0){
                for(var i=0;i<node._children.length;i++){
                    node._children[i].destroy(true);
                }
            }
        }
    }

 

    lookAtTarget(toPos,owner){

        toPos=toPos.clone();
        toPos.y=0;

        let forward=new Laya.Vector3();
        Laya.Vector3.subtract(toPos,owner.transform.position,forward);
        forward.y=0;
       
        let target=new Laya.Vector3();
        Laya.Vector3.subtract(owner.transform.position,forward,target);

        owner.transform.lookAt(target,Laya.Vector3._Up);
    }

    /**
     * 通过标记拿到子物体
     * @param {*} sgin 
     */
    getChildBySgin(go,sgin,nodes){

        let tempChild=null;
        for(var i=0;i<go._children.length;i++){
            tempChild=go._children[i];
            if(tempChild.name.indexOf(sgin)==0){
                nodes.push(tempChild);
            }
            nodes.concat(this.getChildBySgin(tempChild,sgin,nodes));
        }
    }

    /**
     * 拿到mesh组件
     * @param {*} go 
     * @param {*} coms 
     */
    getMatInChild(go,coms){
        for(var i=0;i<go._children.length;i++){

            if(go._children[i].meshRenderer){
                let mats=go._children[i].meshRenderer.materials;
                for(var j=0;j<mats.length;j++){
                    coms.push(mats[j]);
                }
            }

            this.getMatInChild(go._children[i],coms)
        }

    }

    /**
     * 设置和批
     * @param {[]} array Laya.MeshSprite3d
     */
    setEnableInstancing(array){
        let mat=null;
        for(var i=0;i<array.length;i++){
            mat=array[i];
            if(mat){
                mat._shader._enableInstancing=true;
            }
        }
    }

    /**
     * 移除碰撞器
     * @param {*} go 
     */
    removeCollder(go){
        let collder=go.getComponent(Laya.PhysicsCollider);
        if(collder){
            collder.destroy();
        }
    }

    /**
     * 播放特效
     * @param {*} go 
     */
    playEffect(go){
        if(go.particleSystem){
            go.particleSystem.play();
        }

        for(let i=0;i<go._children.length;i++){
            this.playEffect(go._children[i]);
        }
    }

     /**
     * 分享
     */
    onShareTouched( btn ,callbcak,type) {
        G_Tools.btnAction(btn);
        let qu={};
        // share
        G_Share.share(type, qu, false, function (bSucc) {
            // body...
            if (bSucc) {
                // succ
                G_WXHelper.showToast("分享成功");
                this.handlerFun(callbcak);
            }else{
                G_WXHelper.showToast("分享失败");
            }
        }.bind(this))
    }

    shareOrAd(btn,succCb,failCb,type=G_ShareScene.SS_FREE_TRY){

        if(G_PlatHelper.isWINPlatform()){
            this.handlerFun(succCb);
            return;
        }
     
        let self=this;
        if(G_PlatHelper.isWXPlatform()){
          // video
          if (btn._way === G_FreeGetWay.FGW_ADV) {
            G_Adv.createVideoAdv(function ( isEnded ) {
                if (isEnded) {
                    self.handlerFun(succCb);
                }
                else {
                    // no finish
                    G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_FAIL"]).word)
                    self.handlerFun(failCb);
                }
            })
        }
        else {
            // share
            G_Share.share(type, null, true, function (bSucc) {
                // body...
                if (bSucc) {
                    if (btn._way === G_FreeGetWay.FGW_SHARE) {
                        self.handlerFun(succCb);
                    }
                    else {
                        // no more
                        G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_NO_MORE_REWARD"]).word)

                        self.handlerFun(failCb);
                    }
                }
                else {
                    if (typeof failCb === "function") {
                        failCb()
                    }
                    console.log("分享失败");
                }
            })
        }
        }else if(G_PlatHelper.isQQPlatform()){
            G_Adv.createVideoAdv(function ( isEnded ) {
                if (isEnded) {

                    self.handlerFun(succCb);
                }
                else {
                    // no finish
                    G_WXHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_FAIL"]).word)
                    self.handlerFun(failCb);
                }
            })
        }else if(G_PlatHelper.isVIVOPlatform()){
            G_OVAdv.showRandomVideoAd(function(isEnded){
                if(isEnded){
                    self.handlerFun(succCb);
                }else{
                    self.handlerFun(failCb);
                }
            },function(res){
                G_WXHelper.showToast("{0}s可再次观看视频".format(res));
                self.handlerFun(failCb);
            })
        }else if(G_PlatHelper.isOPPOPlatform()){
            G_OVAdv.showRandomVideoAd(function(isEnded){
                if(isEnded){
                    self.handlerFun(succCb);
                }else{
                    self.handlerFun(failCb);
                }
            },function(res){
                G_WXHelper.showToast("视频拉取失败");
                self.handlerFun(failCb);
            })
        }else{
            G_Adv.createVideoAdv(function ( isEnded ) {
                if (isEnded) {
                    self.handlerFun(succCb);
                }
                else {
                    // no finish

                    G_WXHelper.showToast("视频拉取失败");
                    self.handlerFun(failCb);
                }
            })
        }


      
    }
    
    /**
	 * 自动创建banner
	 */
	createBanner(errorCb,succCb){

        let self=this;
        self.showBanner=true;
        let loadFun=function(){
            if(!self.showBanner){
                return;
            }

            G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD);
            G_Tools.handlerFun(succCb);
        }

        if(G_PlatHelper.isQQPlatform()||G_PlatHelper.isWXPlatform()){
            Laya.timer.once(1000,null,function(){
                loadFun();
            })
            
        }else{
            loadFun();
        }
      
	}

	hintBanner(){
        G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD);
        this.showBanner=false;
    }

    cretaeBannerAyn(){
        G_Event.dispatchEvent(G_EventName.EN_SHOW_BANNER_AD);
    }

	   /**
     * 设置按钮视屏分享图片
     * @param {*} btn 
     */
    setAdBtnIcon(btn){
        btn._way = G_FreeGetWay.FGW_NONE

        G_FreeGetMgr.getNextFreeGetWay(function ( way ) {
            btn._way = way

            let icon = G_UIHelper.seekNodeByName(btn, "icon")

            if (icon) {
                if(G_PlatHelper.isWXPlatform()||G_PlatHelper.isVIVOPlatform()){
                    if (way === G_FreeGetWay.FGW_ADV) {
                        icon.skin = "comm/video_icon.png"
                    }
                    else {
                        icon.skin = "comm/share_icon.png"
                    }
                }else{
                    icon.skin = "comm/video_icon.png"
                }
                
            }
        })
    }

    getColor(color){
        if(!color){
            return null;
        }
        let array=color.split('&');
        let v4=new Laya.Vector4(0,0,0,0);
        v4.x=parseFloat(array[0])/255;
        v4.y=parseFloat(array[1])/255;
        v4.z=parseFloat(array[2])/255;
        v4.w=1;
        return v4;
    }

    /**
     * 停止子项和自己的动画
     * @param {*} go 
     */
    stopAnim(go){
        if(!go){
            return;
        }
        let anim=go.getComponent(Laya.Animator);
        if(anim){
            anim.speed=0;
        }

        for(var i=0;i<go._children.length;i++){
            anim=go._children[i].getComponent(Laya.Animator);
            if(anim){
                anim.speed=0;
            }
        }
    }


    /**
     * 按钮延时显示
     * @param {*} btn 
     * @param {*} callback 
     * @param {*} durationScale 
     */
    playBtnShow(btn,callback,durationScale){
        if(G_PlatHelper.isVIVOPlatform()||G_PlatHelper.isOPPOPlatform()||G_PlatHelper.isTTPlatform()||G_PlatHelper.isWINPlatform()){
            G_Tools.handlerFun(callback);
            return;
        }
        if(btn&&!btn.destroyed){
            btn.visible=false;
            let time=100 * durationScale;
            btn._tween = Laya.Tween.to(btn, {visible: true}, time, null);
            Laya.timer.once(time,null,function(){
                if(btn&&!btn.destroyed){
                    btn._tween = null
                    btn.visible=true;
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
    bounceScale(target,t1,t2,callBack,startScale=1,endScale=1.2){
        target.scaleX=startScale;
        target.scaleY=startScale;
        Laya.Tween.to(target,{scaleX:endScale,scaleY:endScale},t1,Laya.Ease.bounceOut);
        Laya.timer.once(t1,this,function(){
                if(!target||target.destroyed){
                    return;
                }
                Laya.Tween.to(target,{scaleX:startScale,scaleY:startScale},t2,Laya.Ease.linearIn);
                Laya.timer.once(t2,null,function(){
                    G_Tools.handlerFun(callBack);
                })
            });
       
    }

    /**
     * 包装toast
     * @param {*} uIWordID 
     * @param {*} str 
     */
    showToast(uIWordID,str){
		if(!uIWordID){
			return;
        }
        if(!str){
            str="";
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
    createMatrix(boxs,itemName,par,countData,boxSpace,callback){
        boxs.splice(0,boxs.length);
        countData.count=countData.line*countData.row;
        let boxPath=G_ResPath.itemPath.format(itemName);
        for(var i=0;i<countData.count;i++){
            Laya.loader.create(boxPath,Laya.Handler.create(this,function(obj){
                this.createOne(boxs,obj,par,countData,boxSpace,callback);
            }));
        }
     }
    
     createOne(boxs,obj,par,countData,boxSpace,callback){
         let json=new Laya.Prefab();
         json.json=obj;
         let go=json.create();
         par.addChild(go);
         boxs.push(go);
         if(boxs.length==countData.count){
             this.setBoxPos(boxs,boxSpace,countData);
             this.handlerFun(callback);
         }
     }
    
     setBoxPos(boxs,boxSpace,countData){
         
         let startX=0;
         let startY=0;
    
         if(countData.row%2==0){
             startX-=(countData.row/2-0.5)*boxSpace.h;
         }else{
             startX-=(countData.row-1)/2*boxSpace.h;
         }
    
        
    
         
         for(var i=0;i<countData.line;i++){
    
             for(var j=0;j<countData.row;j++){
                 let index=i*countData.row+j;
                 boxs[index].centerX=startX+boxSpace.h*j;
                 boxs[index].centerY=startY+boxSpace.v*i;
             }
         }
     }
    
     createG0ByPrefabs(path,callBack,hasCache=true){

        let json=new Laya.Prefab();

        let endFun=function(obj){
            json.json=obj;
            let go=json.create();
            G_Tools.handlerFun(callBack,go);
        }

         if(hasCache){
            endFun(Laya.loader.getRes(path));
         }else{
            Laya.loader.create(path,Laya.Handler.create(this,function(obj){
                    endFun(obj);
            }));
         }
        
     }

    /**
     * 差值
     * @param {*} min 
     * @param {*} max 
     * @param {*} val 
     */
    lerp(min,max,val){
        if(val<=0){
            return min;
        }

        if(val>=1){
            return max;
        }

        return min+(max-min)*val;
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
    bottomDoMove(move,startY,endY,endFun,btntoUpTimeDelay,btntoUptime){
		if(!G_MistakeMgr.isMoveMistakeEnabledAsync()||G_PlatHelper.isTTPlatform()){
			move.y=endY;
			this.handlerFun(endFun,false);
			return;
        }
        let ease=function(t,b,c,d){
            if (t < d *0.55)return Laya.Ease.bounceIn(t *2,0,c,d)*.5+b;
            else return Laya.Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
        }
		move.y=startY;
		Laya.timer.once(btntoUpTimeDelay*1000,this,function(){
            Laya.timer.once(btntoUptime*1000,this,function(){
                this.handlerFun(endFun,true);
            })
			Laya.Tween.to(move,{y:endY},btntoUptime*1000,ease);
		})
    }
    
     /**
     * 是否能够使用物品 
     * 
     */
    canUseItem(count,type){

        if(!G_PlatHelper.getPlat()){
            return true;
        }
       

        if(type==1){//钻石
            if(G_PlayerInfo.getDiamCount().lte(count)){
               // G_MainGui.openUI(G_UIName.GetDiamView);
               G_WXHelper.showToast("钻石不足");
                return false;
            }
        }else if(type==2){//推杆皮肤
           
        }else if(type==3){//金币
            if(G_PlayerInfo.getCoin().lte(count)){
                // if(G_PlatHelper.isVIVOPlatform()){
                //     if(G_MistakeHelp.getIsOpenId()){
                //         G_MainGui.openUI(G_UIName.GetGoldView,null,null);
                //     }
                // }
               
                G_WXHelper.showToast("金币不足");
                return false;
            }
            
           return true;
        }else if(type==4){//人物皮肤

        }else if(type==5){//体力
            if(count>G_PlayerInfo.getPower()){
                 G_WXHelper.showToast("体力不足");
                G_MainGui.openUI(G_UIName.GetPowerView);
                return false;
            }
        }

        return true;
    }
   
    useItem(count,type){
        if(type==1){//1是钻石
            G_PlayerInfo.changeDiam(count,false);
           
        }else if(type==2){//钻石
            
        }else if(type==3){//金币
            G_PlayerInfo.minusCoin(count);
            
        }else if(type==5){//体力
            G_PlayerInfo.usePower(count);
        }

    }

   

    isNumber(obj) {
        return obj === +obj
    }  
    
    isString(obj) {
        return obj === obj+''
    }    


    timestampToTime(timestamp) {
        let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() ;
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;
        let D = this.changeNum(date.getDate());
        // let h = this.change(date.getHours()) + ':';
        // let m = this.change(date.getMinutes()) + ':';
        // let s = this.change(date.getSeconds());
        return Y +"年"+ M+"月" + D+"日" ;//+ h + m + s;
    }

    

    changeNum(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
    
        }    
    }

    btnAction(btn){
        if(!btn){
            return;
        }
        G_UIHelper.playBtnTouchAction(btn);
        G_SoundMgr.playSound(G_SoundName.SN_CLICK);
    }

    createEf(name,pos,par,recycleTime,isAutoRecycle=false,rot=new Laya.Vector3(0,0,0),islocal=false){
        if(!recycleTime&&recycleTime!=0){
            recycleTime=1;
        }

        let self=this;

        let pName=G_ResPath.resPath.format(name);

        let loadEnd=function(go){
            if(!par){
                go.destroy();
                return;
            }

            if(recycleTime!=0){
                let ar=go.getComponent(AutoRecycleMgr);
                if(!ar){
                    ar=go.addComponent(AutoRecycleMgr);
                } 
                
                ar.setAutoRecycle(isAutoRecycle);
                ar.setRecycleKey(pName);
                ar.recycle(recycleTime);
            }

            par.addChild(go);
            self.resetTransform(go);
            
            if(!islocal){
                go.transform.position=pos.clone();
                go.transform.rotationEuler=rot.clone();
            }else{
                go.transform.localPosition=pos;
                go.transform.localRotationEuler=rot;
            }
            
            self.playEffect(go);
        }

        let recycleGo=G_MapMgr.recycleMgr.getGo(pName);

        if(recycleGo){
            recycleGo.active=true;
            loadEnd(recycleGo);
            return;
        }

        let assets=[];
        assets.push(pName);
        G_NodePoolMgr.preload(assets,function(){
            if(!par){
                return;
            }
           
            let go=G_NodePoolMgr.getNode(pName);
           
            loadEnd(go);
           
          
        });
    }

    showChild(node,show){
        if(node){
            for(var i=0;i<node._children.length;i++){
                node._children[i].active=show;
            }
        }
    }

    setBtnScaleTween(btn){
        if(this.btnTweens.hasKey(btn)){
            return;
        }else{

            let tween=null;
            
            if(this.stopTween.length>0){
                tween=this.stopTween[0];
                tween.setTarget(btn);
                this.stopTween.splice(0,1);
            }else{
                tween=new ContinuousTweenMgr();
                let tVals=[];
                let scaleVal=0.5
                tVals.push({time:500,prop:{scaleX:1.1,scaleY:1.1},ease:Laya.Ease.linearNone})
                tVals.push({time:500,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearNone});
                tween.setTweenVals(tVals);
                tween.setDelayTime(2000);
                tween.setTarget(btn);
                tween.setLoop(true);
            }
            tween.play();
            this.btnTweens.addKey(btn,tween);
        }
    }

    setBtnShake(btn){
        if(this.btnTweens.hasKey(btn)){
            return;
        }else{

            let tween=null;
            
            if(this.stopTween.length>0){
                tween=this.stopTween[0];
                
                this.stopTween.splice(0,1);
            }else{
                tween=new ContinuousTweenMgr();
                tween.setLoop(true);
            }

            tween.setTarget(btn);
            let tVals=[];
            tVals.push({time:100,prop:{rotation: 5, scaleX: 1.1, scaleY: 1.1},ease:Laya.Ease.linearNone});
            tVals.push({time:200,prop:{rotation: -5},ease:Laya.Ease.linearNone});
            tVals.push({time:100,prop: {rotation: 0, scaleX: 1, scaleY: 1},ease:Laya.Ease.linearNone});
            tween.setTweenVals(tVals);

            tween.play();
            this.btnTweens.addKey(btn,tween);
        }
    }


    closeBtnTween(btn){
        if(this.btnTweens.hasKey(btn)){
            let tween=this.btnTweens.getValue(btn);
            tween.end();
            this.btnTweens.removeKey(btn);
            this.stopTween.push(tween);
        }
    }

    setImgPercent(maskImg,percent){
         if (maskImg) {
             if (percent > 0) {
                 if (!maskImg.mask) {
                     maskImg.mask = new Laya.Sprite()
                 }
                 maskImg.mask.graphics.clear()
                 maskImg.mask.graphics.drawLines(176, 58, [0, 0, 39, -50, 78, 0, 117, 50, 156, 0], "#ff0000", 5);
             }
             else {
                 maskImg.mask = null
             }
         }
    }

    minBigNumber(bigNumber){
        if(bigNumber.lte(0)){
            bigNumber=BigNumber(1);
        }
        return bigNumber;
    }
}