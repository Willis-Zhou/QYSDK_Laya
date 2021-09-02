import Tools from "../UIFrame/Tools";
import GameMgr from "./GameMgr";
import MapMgr from "./MapMgr";

export default class CameraMgr extends Laya.Script {

     constructor() {
          super();
          this.camrera = null;
          this.modelCamera = null;
          this.rotTemp = new Laya.Vector3();
          this.isCanmeraPosToReset = false;//摄像机位置重置
          this.idVec = new Laya.Vector3(0, 0, 0);
          this.camreraCanShake = false;
          this.shakeVal = 0.05;

          this.isUpdatePos = false;

          this.worldPosTemp = new Laya.Vector3();
          this.screenPosTemp = new Laya.Vector2();
          this.upVec = new Laya.Vector3(0, 1, 0);
          this.cur_ca_move_time = 0;
          this.ca_move_time = 0;
          this.moveStartPos = null;
          this.moveEndPos = null;
          this.rPoint = new Laya.Vector3();
          this.moveTarget = null;

          this.rayOb=new Laya.Ray();
          this.obRayResult=new Laya.HitResult();
          this.tempV1=new Laya.Vector3();
          
          this.lastToPos=new Laya.Vector3();
          this.moveSpeed=0.5;
          this.tempV2=new Laya.Vector3();
          this.lookAtCallBack=null;
          //this.sp=new Laya.PixelLineSprite3D(3);

          this.lastAngle=0;
     }

     init() {
          this.camrera = G_UIHelper.seekNodeByName(this.owner, "Camera");
          let modelNode = G_UIHelper.seekNodeByName(MapMgr.getIns().owner, "modelCamera");
          this.modelCamera = modelNode.getChildAt(0);
          this.camrera.farPlane = 1000;
          this.camrera.nearPlane = 0.01;
          this.camrera.removeLayer(G_GameLayer.ShowModel);
          this.camrera.removeLayer(G_GameLayer.hint);
          this.closeCameraHDR(this.camrera, false);
          this.closeCameraHDR(this.modelCamera, false);
          this.camrera.clearFlag = Laya.CameraClearFlags.Sky;
          //this.setCameraField(60);
          this.modelCamera.removeAllLayers();
          this.modelCamera.addLayer(G_GameLayer.ShowModel);
          if(GameMgr.getIns().canshow3DImage()){
               this.modelCamera.active = true;
               this.modelCamera.clearFlag = Laya.CameraClearFlags.SolidColor;
               this.modelCamera.clearColor = new Laya.Vector4(0, 0, 0, 0);
               this.modelCamera.renderTarget = new Laya.RenderTexture(512, 512, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_24_8);
               this.modelCamera.renderingOrder = -1;
               this.modelCamera.farPlane = 100;
               this.modelCamera.nearPlane = 0.01;
          }else{
               this.modelCamera.active=false;
          }
        
          this.rayOb.origin=this.owner.transform.position.clone();
          this.rayOb.direction=new Laya.Vector3(0,0,0);
         
         // MapMgr.getIns().owner.addChild(this.sp);
     }

     /**
      * 创建后摄像机
      */
     getBackMirror(){
          if(this.backCamera){
               return this.backCamera;
          }
          let cam = new Laya.Camera(1, 0.01, 300);
          this.closeCameraHDR(cam,false);
          cam.clearFlag = Laya.CameraClearFlags.SolidColor;
          cam.fieldOfView = 60;
          cam.removeLayer(G_GameLayer.ShowModel);
          cam.removeLayer(G_GameLayer.hint);
          cam.removeLayer(G_GameLayer.player);
          cam.renderTarget=new Laya.RenderTexture(512, 512, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_24_8);
          this.owner.parent.addChild(cam);
          this.backCamera = cam;
          return this.backCamera;
     }

     recycleBackMirror(backCamera){
          this.owner.parent.addChild(backCamera);
          this.backCamera=backCamera;
          this.setBackMirror(false);
          
     }

     setBackMirror(show){
          if(this.backCamera){
               this.backCamera.active=show;
          }
     }

     /**
      * 设置摄像机视角
      */
     setCameraField(val) {
          this.camrera.fieldOfView = val;
     }

     easeCameraField(val){
          Laya.Tween.to(this.camrera,{fieldOfView:val},1000,Laya.Ease.linearOut);
     }

     checkOb(){
          this.rayOb.origin=this.owner.transform.position;
          Laya.Vector3.subtract(MapMgr.getIns().playerMgr.owner.transform.position,this.owner.transform.position,this.tempV1);
          this.tempV1.cloneTo(this.rayOb.direction);
         
          //this.sp.clear();
          //this.sp.addLine(this.owner.transform.position,MapMgr.getIns().playerMgr.owner.transform.position);

          GameMgr.getIns().gameScene.physicsSimulation.raycastFromTo(this.owner.transform.position,MapMgr.getIns().playerMgr.owner.transform.position.clone(),this.obRayResult,G_ColGroup.ray,G_ColGroup.rayTarget);
        
          if(this.obRayResult.succeeded){
               return this.obRayResult.collider;
          }

          return null;
     }

     getModelCamera() {
          return this.modelCamera;
     }

     showModelCamera(show) {

          if(!GameMgr.getIns().canshow3DImage()){
               this.modelCamera.active=false;
               return;
          }

          if (this.modelCamera.active != show) {
               this.modelCamera.active = show;
          }
     }

     closeCameraHDR(ca, enable) {
          if (ca) {
               ca.enableHDR = enable;
          }
     }



     /**
      * 摄像机位置重置
      * @param {*} time mm
      */
     cameraToResetPos(pos,rot, time, fun = null, ease = Laya.Ease.expoOut, moveTarget = MapMgr.getIns().playerMgr.owner) {

          this.startPos = this.owner.transform.position.clone();
          this.startRot = this.owner.transform.rotationEuler.clone();
          this.cur_ca_move_time = 0;
          this.ca_move_time = time;
          this.moveTarget = moveTarget;
          let endPos = pos;
          let endRot = rot;
          this.moveStartPos = this.startPos.clone();
          this.moveEndPos = endPos.clone();

          Laya.Vector3.add(this.startPos, endPos, this.rPoint);
          Laya.Vector3.scale(this.rPoint, 0.5, this.rPoint);

          Laya.Tween.to(this.startRot, { x: endRot.x, y: endRot.y, z: endRot.z }, time, ease, null, 0, false, false);
          Laya.Tween.to(this.startPos, { x: endPos.x, y: endPos.y, z: endPos.z }, time, ease, Laya.Handler.create(this, () => {
               Tools.getIns().handlerFun(fun);
               this.isUpdatePos = false;
          }), 0, false, false);

          this.isUpdatePos = true;

     }

     onUpdate() {

          if (this.isUpdatePos) {
               let pos = this.owner.transform.position;
               this.cycleRot(this.moveStartPos, this.moveEndPos, pos, this.rPoint);
               this.owner.transform.position = pos;
               let start = this.owner.transform.localRotationEuler;
               this.owner.transform.lookAt(this.moveTarget.transform.position, this.upVec, false);
               this.rotTemp.y = this.owner.transform.localRotationEulerY + 180;
               start.setValue(this.rotTemp.x, this.rotTemp.y, this.rotTemp.z);
               this.owner.transform.localRotationEuler = start;
          }

          if (this.camreraCanShake) {
               let pos = this.camrera.transform.localPosition;
               pos.setValue(this.shakeVal * Math.random(), this.shakeVal * Math.random(), 0);
               this.camrera.transform.localPosition = pos;
          }
     }

     /**
      * 做圆周运动到某个点
      * @param {*} formPos 开始位置
      * @param {*} toPos 到达位置
      * @param {*} outPos 输出位置
      * @param {*} rPoint 圆心位置
      * @returns 
      */
     cycleRot(formPos, toPos, outPos, rPoint) {
          this.cur_ca_move_time += Laya.timer.delta;
          this.cur_ca_move_time = this.cur_ca_move_time < 0 ? 0 : this.cur_ca_move_time;
          let val = this.cur_ca_move_time / this.ca_move_time;

          let angle = -Math.PI * val;

          outPos.y = toPos.y;
          let pos = outPos;
          let sinVal = Math.sin(angle);
          let cosVal = Math.cos(angle);
          pos.x = (formPos.x - rPoint.x) * cosVal - (formPos.z - rPoint.z) * sinVal + rPoint.x;
          pos.z = (formPos.x - rPoint.x) * sinVal + (formPos.z - rPoint.z) * cosVal + rPoint.z;
          return pos;
     }





     setCameraAngle(angle) {
          let start = this.owner.transform.localRotationEuler;
        
          angle.cloneTo(start);
          this.owner.transform.localRotationEuler=start;
     }

     setLookAtCallBack(callback){
          this.lookAtCallBack=callback;
     }

     lookAtTarget(player){
          let start = this.owner.transform.localRotationEuler;
          this.rotTemp.setValue(start.x, start.y, start.z);

          this.owner.transform.lookAt(player.transform.position, this.upVec, false);
          this.rotTemp.y = this.owner.transform.localRotationEulerY + 180;

          if(Math.abs(this.lastAngle-this.rotTemp.y)<1){
               this.lookAtCallBack&&Tools.getIns().handlerFun(this.lookAtCallBack);
               this.lookAtCallBack=null;
          }

          start.setValue(this.rotTemp.x, this.rotTemp.y, this.rotTemp.z);
          this.owner.transform.localRotationEuler = start;
     }

     setCameraPos(toPos, val = 0.5) {
          let pos = this.owner.transform.position;
          Laya.Vector3.lerp(pos, toPos, val, pos);
          this.owner.transform.position = pos;
     }

     setCameraMove(toPos){
          toPos.cloneTo(this.lastToPos);
          
          Laya.Vector3.subtract(this.lastToPos,this.owner.transform.position,this.tempV2);
          let len=Laya.Vector3.scalarLength(this.tempV2);
          if(len>this.moveSpeed){
               Laya.Vector3.normalize(this.tempV2,this.tempV2);
               Laya.Vector3.scale(this.tempV2,this.moveSpeed,this.tempV2);
          }
          

          this.owner.transform.translate(this.tempV2,false) ;
     }

     setCameraRot(toRot) {
          let rot= this.owner.transform.rotation;
          toRot.cloneTo(rot);
          this.owner.transform.rotation = rot;
     }

     setColor(color) {
          this.camrera.clearColor = color.clone();//new Laya.Vector4(0.78,0.62,0.95,0);
     }

     worldPosToScreenPos(pos) {
          this.camrera.viewport.project(pos, this.camrera.projectionViewMatrix, this.worldPosTemp);
          this.screenPosTemp.x = this.worldPosTemp.x / Laya.stage.clientScaleX;
          this.screenPosTemp.y = this.worldPosTemp.y / Laya.stage.clientScaleY;
          return this.screenPosTemp;
     }

     //摄像机抖动
     cameraShake(shake, val = this.shakeVal) {
          this.camreraCanShake = shake;
          this.shakeVal = val;
          if (!shake) {
               let pos = this.camrera.transform.localPosition;
               pos.setValue(0, 0, 0);
               this.camrera.transform.localPosition = pos;
          }
     }

    
}