/*
* 增加Image黑化功能
* 可以通过其dark属性设置
*/

// add dark function into Laya.UIUtils
let UIUtils = Laya.UIUtils;

UIUtils.darkFilter = new Laya.ColorFilter([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
UIUtils.dark = function (traget, isDark = true) {
	if (isDark) {
		UIUtils.addFilter(traget, UIUtils.darkFilter);
	}
	else {
		UIUtils.clearFilter(traget, Laya.ColorFilter);
	}
}

// add get/set(dark) funcs into Laya.UIComponent
Laya.UIComponent.prototype._dark = false
Object.defineProperty(Laya.UIComponent.prototype, "dark", {
	get: function() {
		return this._dark;
	},
	set: function(value) {
		if (value !== this._dark) {
			this._dark = value;
			Laya.UIUtils.dark(this, value);
		}
	}
})

/*
* 修复List组件，同一Item无法连续点击
*/
// fix Laya.ui.List bug: can not click the same item twice or more...
Laya.List.prototype.onCellMouse = function(e) {
	if (e.type === Laya.Event.MOUSE_DOWN)
		this._isMoved = false;
	var cell = e.currentTarget;
	var index = this._startIndex + this._cells.indexOf(cell);
	if (index < 0)
		return;
	if (e.type === Laya.Event.CLICK || e.type === Laya.Event.RIGHT_CLICK) {
		if (this.selectEnable && !this._isMoved)
			this.selectedIndex = index;
		else
			this.changeCellState(cell, true, 0);
	}
	else if (e.type === Laya.Event.MOUSE_OVER || e.type === Laya.Event.MOUSE_OUT) {
		this.changeCellState(cell, e.type === Laya.Event.MOUSE_OVER, 0);
	}
	this.mouseHandler && this.mouseHandler.runWith([e, index]);
}

Object.defineProperty(Laya.List.prototype, "selectedIndex", {
	get: function() {
		return this._selectedIndex;
	},
	set: function(value) {
		this._selectedIndex = value;
		this.changeSelectStatus();
		this.event(Laya.Event.CHANGE);
		this.selectHandler && this.selectHandler.runWith(value);
		this.startIndex = this._startIndex;
	}
})

/*
* 修复loader不支持nativefiles的bug
*/
// fix Laya.Loader bug: do not support nativefiles...
// Laya.Loader.prototype._loadImage = function(url, isformatURL = false) {
// 	var _this = this;
// 	if (isformatURL)
//   		url = Laya.URL.formatURL(url);
// 	var onLoaded;
// 	var onError = function () {
// 		_this.event(Laya.Event.ERROR, "Load image failed");
// 	};
// 	if (this._type === "nativeimage") {
// 		onLoaded = function (image) {
// 			_this.onLoaded(image);
// 		};
// 		this._loadHtmlImage(url, this, onLoaded, this, onError);
// 	}
// 	else {
// 		var ext = Laya.Utils.getFileExtension(url);
// 		if (ext === "ktx" || ext === "pvr") {
// 			onLoaded = function (imageData) {
// 				var format;
// 				switch (ext) {
// 					case "ktx":
// 						format = 5;
// 						break;
// 					case "pvr":
// 						format = 12;
// 						break;
// 				}
// 				var tex = new Laya.Texture2D(0, 0, format, false, false);
// 				tex.wrapModeU = Laya.BaseTexture.WARPMODE_CLAMP;
// 				tex.wrapModeV = Laya.BaseTexture.WARPMODE_CLAMP;
// 				tex.setCompressData(imageData);
// 				tex._setCreateURL(url);
// 				_this.onLoaded(tex);
// 			};
// 			this._loadHttpRequest(url, Laya.Loader.BUFFER, this, onLoaded, null, null, this, onError);
// 		}
// 		else {
// 			onLoaded = function (image) {
// 				var tex = new Laya.Texture2D(image.width, image.height, 1, false, false);
// 				tex.wrapModeU = Laya.BaseTexture.WARPMODE_CLAMP;
// 				tex.wrapModeV = Laya.BaseTexture.WARPMODE_CLAMP;
// 				tex.loadImageSource(image, true);
// 				tex._setCreateURL(url);
// 				_this.onLoaded(tex);
// 			};
// 			this._loadHtmlImage(url, this, onLoaded, this, onError);
// 		}
// 	}
// }