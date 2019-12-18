var platAdaptor = {
	_plat: null,
	_inited: false,

	_init: function () {
		if (this._init) {
			return
		}

		_inited = true
	},

	getPlat: function () {
		if (!_plat) {
			this._init()
		}

		return this._plat
	},
}

// export
export {platAdaptor}