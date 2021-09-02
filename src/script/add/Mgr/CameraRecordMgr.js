import Tools from "../UIFrame/Tools";

export default class CameraRecordMgr {

    constructor() { 
        
       this.isStart=false;
       this.videoPath=null;
    }

    init(){
        if(window.tt){
            let recorder=tt.getGameRecorderManager();
            recorder.onError(function(errMsg){
                console.log(errMsg);
            })
        }
    }

    static getIns(){
        if (!this.instance) {
            this.instance=new CameraRecordMgr();
            this.instance.init();
        }

        return this.instance;
    }
    
    start(){

        if(this.isStart){
            return;
        }

        if(window.tt){
            let recorder = tt.getGameRecorderManager();
            recorder.onStart(res => {
            console.log("录屏开始");
            
            });
            this.isStart=true;
            recorder.start({
                duration: 300
            });
        }
    }

    stop(callBack){

        if(!this.isStart){
            Tools.getIns().handlerFun(callBack);
            return;
        }

        if(window.tt){
            let recorder = tt.getGameRecorderManager();
            recorder.onStop(res => {
            console.log("录屏暂停:",res.videoPath);
            this.videoPath=res.videoPath;
            Tools.getIns().handlerFun(callBack);
            });
            this.isStart=false;
            recorder.stop();
        }else{
            Tools.getIns().handlerFun(callBack);
        }
    }

    /**
     * 拿到记录状态
     */
    getIsStart(){
        return this.isStart;
    }

    shareVideo(callBack,imageUrl=null){
        if(window.tt){
            if(this.videoPath==null){
                G_PlatHelper.showToast("视屏分享失败");
                Tools.getIns().handlerFun(callBack,false,1);//拉起失败
                return;
            }
            G_PlatHelper.showLoading();
            let self=this;
            let imUrl="";
            if(imageUrl){
               imUrl= G_BaseUrlPath.replace("image.game.hnquyou.com","r.game.hnquyou.com")+imageUrl;
               
            }
           // console.error(imUrl);
            tt.shareAppMessage(
                {
                    channel: "video",
                    title: "马杀鸡了解一下",
                    desc: "抖音小游戏#马杀鸡了解一下",
                    imageUrl: imUrl,
                    templateId: "", // 替换成通过审核的分享ID
                    query: "",
                    extra: {
                      videoPath: self.videoPath, // 可替换成录屏得到的视频地址
                      videoTopics: ["抖音小游戏#马杀鸡了解一下"],
                      hashtag_list:["抖音小游戏#马杀鸡了解一下"],
                      video_title:"你的技艺有我高吗？"
                    },
                    success() {
                     G_PlatHelper.hideLoading();
                      //G_PlatHelper.showToast("分享成功");
                      Tools.getIns().handlerFun(callBack,true,0);
                    },
                    fail(e) {
                      G_PlatHelper.showToast("分享失败");
                      Tools.getIns().handlerFun(callBack,false,2);//分享失败
                    }
                  }
            );
        }else{
            Tools.getIns().handlerFun(callBack,false,0);
        }
    }
}