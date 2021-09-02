/*
* 音乐音效管理
*/

import Tools from "../UIFrame/Tools";

export default class AudioContextMgr{
	constructor(){
		 this.plat = null;
		 this._loadMusicCallBack = null;
		 this._playMusicCB = null;
		 this.isInit = false;
		 this._wx_audio_bg=null;
		 this.soundMgrArray=[];
		 this._sound_audio=null;
	}

	

	
	 init(){
		if(this.isInit)return;
		this.isInit = true;
		if (typeof window["tt"] !== "undefined") {
			this.plat = window["tt"];
		}else if (typeof window["wx"] !== "undefined") {
			this.plat = window["wx"];
		}else if (typeof window["qg"] !== "undefined") {
			this.plat = window["qg"];
		}
		if(this.plat){
			this._wx_audio_bg=this.getAudioContext();
			this._wx_audio_bg.onError(function(err){
				console.log("背景音效问题:",err);
			})
		}
	}


	getAudioContext(){
		let audioConx=null;
		if(this.plat){
			
			if(this.soundMgrArray.length>0){
				audioConx=this.soundMgrArray[0];
				this.soundMgrArray.splice(0,1);
			}else{
				audioConx= this.plat.createInnerAudioContext();
				audioConx.onError(function(err){
					console.log("音效问题:",err);
				})
			}

			
		}

		return audioConx;
	}

	soundRecycle(context){
		if(this.soundMgrArray.indexOf(context)<0){
			this.soundMgrArray.push(context);
		}
	}

	 loadSound(url ,cb){
		this.init();
		if(this.plat){
			url=G_BaseUrlPath+url;

			let _wx_audio=this.getAudioContext();

			if(_wx_audio.src==url){
				Tools.getIns().handlerFun(cb,_wx_audio);
				return;
			}

			_wx_audio.src = url;
			_wx_audio.loop = false;
			_wx_audio.autoplay = false;
			let _loadMusicCallBack = function(){

				_wx_audio.offCanplay(_loadMusicCallBack);
				Tools.getIns().handlerFun(cb,_wx_audio);
			};
			
			_wx_audio.onCanplay(_loadMusicCallBack);
		}else{
			
			Tools.getIns().handlerFun(cb,_wx_audio);
		}
	}

	loadMusicBG(url ,isLoop,cb){
		this.init();
		if(this.plat){
			url=G_BaseUrlPath+url;
			// 防止同url时onCanplay不调用
			
			

			if(this._wx_audio_bg.src==url){
				Tools.getIns().handlerFun(cb);
				return;
			}
			
			this._wx_audio_bg.src = url;
			this._wx_audio_bg.loop = true;
			this._wx_audio_bg.autoplay = false;
			let _loadMusicCallBackBG = function(){
				this._wx_audio_bg.offCanplay(_loadMusicCallBackBG);
				Tools.getIns().handlerFun(cb);
			}.bind(this);
			
			this._wx_audio_bg.onCanplay(_loadMusicCallBackBG);
		}else{
			
			Tools.getIns().handlerFun(cb);
		}
	}


	 offPlay(cb){
		if(this.plat){
			this._wx_audio.offPlay(cb);
		}
	}

	setvolume(val){
		if(this._wx_audio_bg){
			this._wx_audio_bg.volume=val;
		}
	}

	 playSound( url) {
		this.init();
		if(this.plat){
			let self=this;
			this.loadSound(url,function(_wx_audio){
				let endFun=function(){
					_wx_audio.offEnded(endFun);
					self._sound_audio=null;
					self.soundRecycle(_wx_audio);
				};
				_wx_audio.loop=false;
				_wx_audio.seek(0);
				
				_wx_audio.play();
				self._sound_audio=_wx_audio;
				_wx_audio.onEnded(endFun);
				

			})
	
		}else{
			Laya.SoundManager.playMusic(url,1,null,0);
		}
		
	}

	 playBGMusic ( url) {
		this.init();
		
		if (typeof url === "string" && url !== "") {
			if (this.plat) {
				this.setvolume(1);
				this._wx_audio_bg.seek(0);
				this._wx_audio_bg.play();
			}else{
				Laya.SoundManager.playMusic(url,0);
			}
			
		}
	}

	 continue (){
		if (this.plat) {
			this._wx_audio_bg.play();
			
		}
	}

	 stopMusic () {
		if (this.plat) {
			this.setvolume(0);
			this._wx_audio_bg.pause();
			if(this._sound_audio){
				this._sound_audio.pause();
			}
		}else{
			Laya.SoundManager.stopMusic();
		}
	}
}

