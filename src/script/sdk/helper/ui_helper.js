/*
* 全局UI帮助
*/
var _UIHelper = (function () {
	var _instance;

	function init() {
		// body...
		console.log('Init G_UIHelper Instance...')

		return {
			/**
			 * 遍历查找指定名称的节点
			 * @param {Laya.Node} node 
			 * @param {string} name 
			 */
			seekNodeByName: function (node, name) {
				// body...
			    if (node.name === name) return node

                let target = undefined
                node._children.forEach(child => {
                    if (!target) target = this.seekNodeByName(child, name)
                })

                return target
			},

            playBtnTouchAction: function (btn, cb, originalScale = 1, scaleExternal = 1, durationScale = 1) {
				// body...
				if (btn) {
					if (btn._tween) {
						btn._tween.clear()
						btn._tween = null
					}
	
					btn.scaleX = originalScale
					btn.scaleY = originalScale
	
					btn._tween = Laya.Tween.to(btn, {scaleX: (originalScale * 1.1 * scaleExternal), scaleY: (originalScale * 1.1 * scaleExternal)}, 100 * durationScale, null, Laya.Handler.create(null, function () {
						btn._tween = Laya.Tween.to(btn, {scaleX: originalScale, scaleY: originalScale}, 50 * durationScale, null, Laya.Handler.create(null, function () {
							btn._tween = null
	
							if (typeof cb === "function") {
								cb()
							}
						}))
					}))
				}
			},
			
			playOpenPopupAction: function (popup, cb) {
				// body...
				this.playUIScaleAction(popup, 0.8, 1.0, 500, cb)
			},

			playUIScaleAction: function (ui, fromScale, endScale, duration, cb) {
				// body...
				if (ui) {
					if (ui._tween) {
						ui._tween.clear()
						ui._tween = null
					}
	
					ui.scaleX = fromScale
					ui.scaleY = fromScale
	
					ui._tween = Laya.Tween.to(ui, {scaleX: endScale, scaleY: endScale}, duration, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
						ui._tween = null
	
						if (typeof cb === "function") {
							cb()
						}
					}))
				}
			},

			playOpenPopupAction_FromLeft: function (popup, cb) {
				// body...
				if (popup) {
					if (popup._tween) {
						popup._tween.clear()
						popup._tween = null
					}
	
					popup.x = 240
	
					popup._tween = Laya.Tween.to(popup, {x: 360}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
						popup._tween = null
	
						if (typeof cb === "function") {
							cb()
						}
					}))
				}
			},

			playOpenPopupAction_FromBottom: function (popup, cb) {
				// body...
				if (popup) {
					if (popup._tween) {
						popup._tween.clear()
						popup._tween = null
					}
	
					popup.y = Laya.stage.height / 4
	
					popup._tween = Laya.Tween.to(popup, {y: Laya.stage.height - popup.height}, 500, Laya.Ease.elasticOut, Laya.Handler.create(null, function () {
						popup._tween = null
	
						if (typeof cb === "function") {
							cb()
						}
					}))
				}
			},
			
			layoutItemsInContent: function ( content, nodeArr, gap ) {
				// body...
				if (content && nodeArr && nodeArr.length > 0 && (typeof gap === "number")) {
					let totalWidth = 0
					for (let i = 0; i < nodeArr.length; i++) {
						totalWidth += nodeArr[i].width * nodeArr[i].scaleX 
						if (i !== 0) {
							totalWidth += gap
						}
					}

					let firstPosX = (content.width - totalWidth) / 2

					for (let i = 0; i < nodeArr.length; i++) {
						if (i === 0) {
							nodeArr[i].x = firstPosX + nodeArr[i].width * nodeArr[i].scaleX * (nodeArr[i].pivotX / nodeArr[i].width)
						}
						else {
							let leftPosX = nodeArr[i - 1].x + nodeArr[i - 1].width * nodeArr[i - 1].scaleX * (1 - (nodeArr[i - 1].pivotX / nodeArr[i - 1].width)) + gap
							nodeArr[i].x = leftPosX + nodeArr[i].width * nodeArr[i].scaleX * (nodeArr[i].pivotX / nodeArr[i].width)
						}
					}
				}
			},

			refreshFreeWayOfBtn: function (btn, videoIconPath = "comm/video_icon.png", shareIconPath = "comm/share_icon.png") {
				if (btn) {
					if (!btn.getWay) {
						// default
						btn._way = G_FreeGetWay.FGW_NONE

						btn.getWay = function () {
							return btn._way
						}
					}

					if (!btn.refreshWay) {
						btn.refreshWay = function () {
							G_FreeGetMgr.getNextFreeGetWay(function ( way ) {
								console.log("next free get way:", way)
								btn._way = way
				
								let icon = G_UIHelper.seekNodeByName(btn, "icon")
								if (icon) {
									if (way === G_FreeGetWay.FGW_ADV) {
										icon.skin = videoIconPath
									}
									else {
										icon.skin = shareIconPath
									}
								}

								if (way === G_FreeGetWay.FGW_NONE && !G_Share.isSupport()) {
									btn.visible = false
								}
							})
						}
					}

					if (!btn.doTouch) {
						btn.doTouch = function ( shareScene, succCb, failCb, ov_key ) {
							G_UIHelper.playBtnTouchAction(btn, function () {
								// video
								if (btn.getWay() === G_FreeGetWay.FGW_ADV) {
									// pause bgm
									G_SoundMgr.pauseMusic()

									let checkVideoRet = function ( isEnded ) {
										// resume bgm
										G_SoundMgr.resumeMusic()

										if (isEnded) {
											// succ cb
											if (typeof succCb === "function") {
												succCb()
											}
										}
										else {
											// no finish
											G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_ADV_FAIL"]).word)
										}
									}

									if (G_PlatHelper.isOPPOPlatform() || G_PlatHelper.isVIVOPlatform()) {
										if (typeof ov_key !== "string" || ov_key === "") {
											ov_key = "Random"
										}

										let funcName = "show" + ov_key + "VideoAd"
										let func = G_OVAdv[funcName]
										if (func) {
											let adObj = func.call(G_OVAdv, function (isEnded) {
												checkVideoRet(isEnded)
											}, function (cdTime) {
												// resume bgm
												G_SoundMgr.resumeMusic()

												if (cdTime === -1) {
													// retry later
													G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_VIDEO_NOT_READY_YET"]).word)
												}
												else {
													// not ready yet
													let formatStr = G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_FORMAT_OF_VIDEO_NOT_READY_YET"]).word
													G_PlatHelper.showToast(formatStr.format(cdTime.toString()))
												}

												// fail cb
												if (typeof failCb === "function") {
													failCb()
												}
											})

											if (!adObj) {
												// resume bgm
												G_SoundMgr.resumeMusic()

												// fail cb
												if (typeof failCb === "function") {
													failCb()
												}
											}
										}
									}
									else if (G_PlatHelper.isQTTPlatform()) {
										G_PlatHelper.getPlat().showVideo(res => {
											if (res === 1 || res === 0) {
												checkVideoRet(true)
											}
											else if (res === 2) {
												checkVideoRet(false)
											}
											else {
												// retry later
												G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_VIDEO_NOT_READY_YET"]).word)
												
												// fail cb
												if (typeof failCb === "function") {
													failCb()
												}
											}
										})
									}
									else {
										G_Adv.createVideoAdv(function ( isEnded ) {
											checkVideoRet(isEnded)
										}, function () {
											// not support video anymore
											
											// resume bgm
											G_SoundMgr.resumeMusic()

											// refresh
											btn.refreshWay()

											// fail cb
											if (typeof failCb === "function") {
												failCb()
											}
										})
									}
								}
								else {
									// share
									G_Share.share(shareScene, null, true, function (bSucc) {
										// body...
										if (bSucc) {
											if (btn.getWay() === G_FreeGetWay.FGW_SHARE) {
												// succ cb
												if (typeof succCb === "function") {
													succCb()
												}

												return
											}
											else {
												// no more
												G_PlatHelper.showToast(G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_NO_MORE_REWARD"]).word)
											}
										}
										
										// fail cb
										if (typeof failCb === "function") {
											failCb()
										}
									})
								}
							}, btn._originalScale)
					
							G_SoundMgr.playSound(G_SoundName.SN_CLICK)
						}
					}

					// init
					btn._originalScale = btn.scaleX

					// refresh
					btn.refreshWay()
				}
			},

			delayShow: function ( node, delay = 3000 ) {
				if (node && !G_PlatHelper.isOPPOPlatform()) {
					node.visible = false

					G_Scheduler.schedule("Delay_Show_Of_" + G_Utils.generateString(32), function () {
						node.visible = true
					}, false, delay, 0)
				}
				else {
					node.visible = true
				}
			},

			autoMove: function ( node, hideDuration, holdDuration_1, holdDuration_2, moveDuration, isTween, offsetPos, cb ) {
				if (node) {
					if (!node._originalPos) {
						node._originalPos = {x: node.x, y: node.y}
					}

					// clear
					if (node._tween) {
						node._tween.clear()
						node._tween = null
					}
					if (node._scheduleKey) {
						G_Scheduler.unschedule(node._scheduleKey)
						node._scheduleKey = null
					}
					
					// move to target pos
					node.visible = false
					node.x = node._originalPos.x + offsetPos.x
					node.y = node._originalPos.y + offsetPos.y

					node._scheduleKey = G_Utils.generateString(32)
					G_Scheduler.schedule(node._scheduleKey, function () {
						node._scheduleKey = null

						if (typeof cb === "function") {
							cb("hide_finished")
						}

						node.visible = true

						node._scheduleKey = G_Utils.generateString(32)
						G_Scheduler.schedule(node._scheduleKey, function () {
							node._scheduleKey = null

							if (typeof cb === "function") {
								cb("hold_finished_1")
							}

							node._scheduleKey = G_Utils.generateString(32)
							G_Scheduler.schedule(node._scheduleKey, function () {
								node._scheduleKey = null

								if (typeof cb === "function") {
									cb("hold_finished_2")
								}

								if (isTween) {
									node._tween = Laya.Tween.to(node, {x: node._originalPos.x, y: node._originalPos.y}, moveDuration, null, Laya.Handler.create(null, function () {
										node._tween = null

										// move to default pos
										node.x = node._originalPos.x
										node.y = node._originalPos.y
					
										if (typeof cb === "function") {
											cb("move_finished")
										}
									}))
								}
								else {
									node._scheduleKey = G_Utils.generateString(32)
									G_Scheduler.schedule(node._scheduleKey, function () {
										node._scheduleKey = null
			
										// move to default pos
										node.x = node._originalPos.x
										node.y = node._originalPos.y
			
										if (typeof cb === "function") {
											cb("move_finished")
										}
									}, false, moveDuration, 1)
								}
							}, false, holdDuration_2, 1)
							
						}, false, holdDuration_1, 1)
					}, false, hideDuration, 1)
				}	
			},
			
			changeSkin: function ( mesh, texturePath ) {
				let node = this.seekNodeByName(mesh, "mesh")
				if (!node) {
					node = mesh
				}

                if (typeof texturePath === "string" && texturePath !== node._texturePath) {
					node._texturePath = texturePath
                    
                    Laya.Texture2D.load(texturePath, Laya.Handler.create(null, function (texture) {
                        node.meshRenderer.sharedMaterial.albedoTexture = texture
                    }))
                }
			},
			
			changeColor: function ( mesh, R, G, B ) {
				let node = this.seekNodeByName(mesh, "mesh")
				if (!node) {
					node = mesh
				}

				node.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(R / 255, G / 255, B / 255, 1)
            },

			tweenMoveCamera: function (camera, duration, isLocal, start, end, disableEffects, cb) {
				if (camera) {
					if (camera._scheduleKey) {
						G_Scheduler.unschedule(camera._scheduleKey)
						camera._scheduleKey = ""
					}

					if (isLocal) {
						let targetPos = start.position.clone()
						if (disableEffects.posX === true) {
							targetPos.x = camera.transform.localPosition.x
						}
						if (disableEffects.posY === true) {
							targetPos.y = camera.transform.localPosition.y
						}
						if (disableEffects.posZ === true) {
							targetPos.z = camera.transform.localPosition.z
						}
						camera.transform.localPosition = targetPos

						camera.transform.localRotationEuler = start.rotationEuler.clone()
					}
					else {
						let targetPos = start.position.clone()
						if (disableEffects.posX === true) {
							targetPos.x = camera.transform.position.x
						}
						if (disableEffects.posY === true) {
							targetPos.y = camera.transform.position.y
						}
						if (disableEffects.posZ === true) {
							targetPos.z = camera.transform.position.z
						}
						camera.transform.position = targetPos
						camera.transform.rotationEuler = start.rotationEuler.clone()
					}
					camera.fieldOfView = start.fieldOfView

					// schedule
					camera._scheduleKey = "key_of_tween_move_camera"
					camera._passedTime = 0
					camera._totalTime = duration
					camera._isLocal = isLocal
					camera._start = start
					camera._end = end
					camera._disableEffects = disableEffects
					camera._cb = cb
					G_Scheduler.schedule(camera._scheduleKey, function () {
						camera._passedTime += Laya.timer.delta

						let progress = camera._passedTime / camera._totalTime
						if (progress > 1.0) {
							progress = 1.0
						}

						// update
						if (camera._isLocal) {
							let targetPos = this.getMidVec3(camera._start.position, camera._end.position, progress)
							if (camera._disableEffects.posX === true) {
								targetPos.x = camera.transform.localPosition.x
							}
							if (camera._disableEffects.posY === true) {
								targetPos.y = camera.transform.localPosition.y
							}
							if (camera._disableEffects.posZ === true) {
								targetPos.z = camera.transform.localPosition.z
							}
							camera.transform.localPosition = targetPos
							camera.transform.localRotationEuler = this.getMidVec3(camera._start.rotationEuler, camera._end.rotationEuler, progress)
						}
						else {
							let targetPos = this.getMidVec3(camera._start.position, camera._end.position, progress)
							if (camera._disableEffects.posX === true) {
								targetPos.x = camera.transform.position.x
							}
							if (camera._disableEffects.posY === true) {
								targetPos.y = camera.transform.position.y
							}
							if (camera._disableEffects.posZ === true) {
								targetPos.z = camera.transform.position.z
							}
							camera.transform.position = targetPos
							camera.transform.rotationEuler = this.getMidVec3(camera._start.rotationEuler, camera._end.rotationEuler, progress)
						}
						camera.fieldOfView = camera._start.fieldOfView + (camera._end.fieldOfView - camera._start.fieldOfView) * progress

						if (progress === 1.0) {
							G_Scheduler.unschedule(camera._scheduleKey)
							camera._scheduleKey = ""

							let _cb = camera._cb
							camera._cb = null
							if (typeof _cb === "function") {
								_cb()
							}
						}
					}.bind(this), true)
				}
			},

			getMidVec3: function(fromPos, endPos, progress) {
				let midPos = new Laya.Vector3()
				midPos.x = fromPos.x + this._caculateMultiply((endPos.x - fromPos.x), progress)
				midPos.y = fromPos.y + this._caculateMultiply((endPos.y - fromPos.y), progress)
				midPos.z = fromPos.z + this._caculateMultiply((endPos.z - fromPos.z), progress)
		
				return midPos
			},

			// 将世界坐标转化为OpenGL坐标
			// Window端不会有变化
			convertToOpenGLPt: function ( worldPt ) {
				// body...
				let openGLPt = new Laya.Vector2(0, 0)

				if (typeof worldPt.x === "undefined" || worldPt.x === null
					|| typeof worldPt.y === "undefined" || worldPt.y === null) {
					return openGLPt
				}

				let sysInfo = G_PlatHelper.getSysInfo()
				
				openGLPt.x = worldPt.x / Laya.stage.width * sysInfo.screenWidth
				openGLPt.y = worldPt.y / Laya.stage.height * sysInfo.screenHeight

				return openGLPt
			},

			// 将世界Size转化为OpenGL的Size
			// Window端不会有变化
			convertToOpenGLSize: function ( worldSize ) {
				// body...
				let openGLSize = new Laya.Vector2(0, 0)

				if (typeof worldSize.width === "undefined" || worldSize.width === null
					|| typeof worldSize.height === "undefined" || worldSize.height === null) {
					return openGLSize
				}

				let sysInfo = G_PlatHelper.getSysInfo()
				
				openGLSize.width = worldSize.width / Laya.stage.width * sysInfo.screenWidth
				openGLSize.height = worldSize.height / Laya.stage.height * sysInfo.screenHeight

				return openGLSize
			},

			// 将OpenGL坐标转化为世界坐标
			// Window端不会有变化
			convertToWorldPt: function ( openGLPt ) {
				// body...
				let worldPt = new Laya.Vector2(0, 0)

				if (typeof openGLPt.x === "undefined" || openGLPt.x === null
					|| typeof openGLPt.y === "undefined" || openGLPt.y === null) {
					return worldPt
				}

				let sysInfo = G_PlatHelper.getSysInfo()
				
				worldPt.x = openGLPt.x / sysInfo.screenWidth * Laya.stage.width
				worldPt.y = openGLPt.y / sysInfo.screenHeight * Laya.stage.height

				return worldPt
			},

			// 将OpenGL的Size转化为世界Size
			// Window端不会有变化
			convertToWorldSize: function ( openGLSize ) {
				// body...
				let worldSize = new Laya.Vector2(0, 0)

				if (typeof openGLSize.width === "undefined" || openGLSize.width === null
					|| typeof openGLSize.height === "undefined" || openGLSize.height === null) {
					return worldSize
				}

				let sysInfo = G_PlatHelper.getSysInfo()
				
				worldSize.width = openGLSize.width / sysInfo.screenWidth * Laya.stage.width
				worldSize.height = openGLSize.height / sysInfo.screenHeight * Laya.stage.height

				return worldSize
			},
		
			_caculateMultiply: function(first, second) {
				return (first * 10000) * (second * 10000) / (100000000)
			},

			_checkString: function (title) {
				// body...
				if (typeof title === "string" && title !== "") {
					return true
				}
				else {
					return false
				}
			}
		};
	}

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
})();

// export
export {_UIHelper}