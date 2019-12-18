/*
* 对象池
*/
var _NodePoolMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_NodePoolMgr Instance...")

		var _preloadedAssets = {}

		return {
			preload( assets, cb ) {
				for (let i = assets.length; i >= 0; i--) {
					if (typeof _preloadedAssets[assets[i]] !== "undefined") {
						assets.splice(i, 1)
					}
				}

				if (assets.length > 0) {
					this._preloadAll(assets, cb)
				}
				else {
					if (typeof cb === "function") {
						cb()
					}
				}
			},

			getNode( asset ) {
				let preloadedAsset = _preloadedAssets[asset]

				if (preloadedAsset) {
					if (preloadedAsset.backups.length > 0) {
						return preloadedAsset.backups.shift()
					}
					else {
						let node = Laya.Sprite3D.instantiate(preloadedAsset.origin, null, false)
						node._asset = asset

						return node
					}
				}
				else {
					return null
				}
			},

			recycleNode( node ) {
				if (node.parent) {
					console.error("Can Not Recycle The Node Which Its Parent Is Not Null...")
					return
				}

				if (!node._asset) {
					console.error("Can Not Recycle The Node Which Its Not Created By This Pool...")
					return
				}

				let preloadedAsset = _preloadedAssets[node._asset]

				if (preloadedAsset) {
					preloadedAsset.backups.push(node)
				}
			},

			canRecycle( node ) {
				if (node && node._asset) {
					return true
				}
				else {
					return false
				}
			},

			printAssets() {
				console.log(_preloadedAssets)
			},

			_preloadAll(assets, cb) {
				this._preload(1, assets, cb)
			},
		
			_preload(index, assets, cb) {
				let loadFunc = function (_asset, _cb) {
					if (typeof _preloadedAssets[_asset] === "undefined") {
						Laya.Sprite3D.load(_asset, Laya.Handler.create(null, function (sprite) {
							_preloadedAssets[_asset] = {
								origin: sprite,
								backups: []
							}
				
							if (typeof _cb === "function") {
								_cb()
							}
						}))
					}
					else {
						if (typeof _cb === "function") {
							_cb()
						}
					}
				}
		
				if (index <= assets.length) {
					let asset = assets[index - 1]
					loadFunc(asset, function () {
						this._preload(index + 1, assets, cb)
					}.bind(this))
				}
				else {
					if (typeof cb === "function") {
						cb()
					}
				}
			}
		}
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

// global
window.G_NodePoolMgr = _NodePoolMgr.getInstance()