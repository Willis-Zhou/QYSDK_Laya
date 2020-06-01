var G_MaxTimesOfCreateIcon = 3

var _Recommend = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Recommend Instance...")

		// icon
		var _iconAdUnitIDs = []
		var _failCountOfCreateIcon = 0
		var _iconAdUnitIDIndex = 0
		
		var _checkString = function (str) {
			// body...
			if (typeof str === "string" && str !== "" && str !== "none") {
				return true
			}
			else {
				return false
			}
		}

		var _registerAdUnitIDs = function (iconAdUnitIDs) {
			// body...
			if (window.wx) {
				if (Array.isArray(iconAdUnitIDs)) {
					iconAdUnitIDs.forEach(iconAdUnitID => {
						if (!_checkString(iconAdUnitID)) {
							console.error("Register Recommend Icon Ad Unit ID Fail, Check Input!")
						}
						else {
							_iconAdUnitIDs.push(iconAdUnitID)
						}
					})
				}

				// log
				console.log("Register All Recommend Ad Unit IDs Succ!")
			}
		}

		return {
			init: function () {
				// body...
				if (G_RecommendAdUnitIDs && Array.isArray(G_RecommendAdUnitIDs) && G_RecommendAdUnitIDs.length > 0) {
					let iconAdUnitIDs = G_Utils.cloneDeep(G_RecommendAdUnitIDs)

					// shuffle
					G_Utils.shuffleArray(iconAdUnitIDs)

					// register
					_registerAdUnitIDs(iconAdUnitIDs)
				}
			},

			isSupportGameIconAd: function () {
				// body...
				return (_iconAdUnitIDs.length > 0)
			},

			createGameIcon: function (nodes, extendStyle, loadCb, errCb ) {
				// body...
				if (!this.isSupportGameIconAd()) {
					// notify
					this._doCallback(errCb)
					return
				}
				
				// reset
				_failCountOfCreateIcon = 0

				return this._doCreateGameIcon(this._convertStyles(nodes, extendStyle), loadCb, errCb)
			},

			_doCreateGameIcon( styles, loadCb, errCb ) {
				// body...
				console.log("styles: ", styles)

				if (typeof window.wx === "undefined" || typeof wx.createGameIcon !== "function") {
					this._doCallback(errCb)
					return null
				}

				_iconAdUnitIDIndex += 1

				if (_iconAdUnitIDIndex >= _iconAdUnitIDs.length) {
					_iconAdUnitIDIndex = 0
				}

				let iconAdObj = wx.createGameIcon({
					adUnitId: _iconAdUnitIDs[_iconAdUnitIDIndex],
					count: styles.length,
					style: styles
				})

				if (typeof loadCb === "function") {
					iconAdObj.loadCb = loadCb
				}

				if (typeof errCb === "function") {
					iconAdObj.errCb = errCb
				}

				var self = this

				iconAdObj.onLoad(function () {
					// callback
					let _loadCb = iconAdObj.loadCb
					iconAdObj.loadCb = undefined
					
					if (_loadCb) {
						_loadCb(iconAdObj)
					}
				})

				iconAdObj.onError(function ( err ) {
					let _errCb = null

					// destory
					if (iconAdObj) {
						// record
						_errCb = iconAdObj.errCb

						// reset null
						iconAdObj = null
					}

					// record
					_failCountOfCreateIcon += 1

					// recreate game icon
					if (_failCountOfCreateIcon >= G_MaxTimesOfCreateIcon) {
						// callback
						if (_errCb) {
							_errCb()
						}
					}
					else {
						G_Scheduler.schedule("Delay_Recreate_Recommend_Game_Icon", function () {
							// body...
							console.log("retry preload game icon...")
							self._doCreateGameIcon(styles, loadCb, errCb)
						}, false, 200, 0)
					}
				})

				return iconAdObj
			},

			_convertStyles(nodes, extendStyle) {
				let styles = []

				if (Array.isArray(nodes) && nodes.length > 0) {
					for (let index = 0; index < nodes.length; index++) {
						let node = nodes[index]
						
						if (node) {
							// hide
							node.visible = false

							let style = {
								appNameHidden: true,
								color: "#000000",
								size: 0,
								borderWidth: 0,
								borderColor: "#000000",
								left: 0,
								top: 0
							}

							if (extendStyle) {
								if (typeof extendStyle.appNameHidden !== "undefined") {
									style.appNameHidden = extendStyle.appNameHidden
								}

								if (typeof extendStyle.color !== "undefined") {
									style.color = extendStyle.color
								}

								if (typeof extendStyle.borderWidth !== "undefined") {
									style.borderWidth = extendStyle.borderWidth
								}

								if (typeof extendStyle.borderColor !== "undefined") {
									style.borderColor = extendStyle.borderColor
								}
							}

							let worldCenterPt = node.localToGlobal(new Laya.Vector2(node.width / 2, node.height / 2), true)
							let leftTopPosX = worldCenterPt.x - (node.width / 2 * node.scaleX)
							let leftTopPosY = worldCenterPt.y - (node.height / 2 * node.scaleY)

							let openGLPt = G_UIHelper.convertToOpenGLPt({x: leftTopPosX, y: leftTopPosY})
							let openGLSize = G_UIHelper.convertToOpenGLSize({width: (node.width * node.scaleX), height: (node.height * node.scaleY)})

							style.size = Math.min(openGLSize.width, openGLSize.height)
							style.left = openGLPt.x
							style.top = openGLPt.y

							// push
							styles.push(style)
						}
					}
				}

				return styles
			},

			_doCallback( cb ) {
				if (typeof cb === "function") {
					cb()
				}
			}
		};
	};

	return {
		getInstance: function () {
			if ( !_instance ) {
				_instance = init();
			}

			return _instance;
		}
	};
}();

// export
export {_Recommend}
