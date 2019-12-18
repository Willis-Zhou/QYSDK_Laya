/*
* 事件中心
* 支持事件冒泡
*/
var _Event = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_Event Instance...")

		var _listerners = {}

		return {
			addEventListerner: function (event_name, listerner) {
				// body...
				if (!this._checkEventName(event_name)
					|| !this._checkListerner(listerner))
				{
					return
				}

				if (_listerners[event_name] === undefined) 
				{
					_listerners[event_name] = []
				}

				_listerners[event_name].push(listerner)
			},

			removeEventListerner: function (event_name, listerner) {
				// body...
				if (!this._checkEventName(event_name))
				{
					return
				}

				if (typeof listerner !== "undefined" && !this._checkListerner(listerner)) 
				{
					return
				}

				if (_listerners[event_name] !== undefined) 
				{
					if (typeof listerner === "undefined") {
						_listerners[event_name] = undefined
					}
					else {
						for (let i = 0; i < _listerners[event_name].length; i++) {
							let cb = _listerners[event_name][i]

							if (cb === listerner) {
								_listerners[event_name].splice(i, 1)
								return
							}
						}
					}
				}
			},

			removeAllEventListerners: function () {
				// body...
				_listerners = {}
			},

			hasEventListerner: function (event_name) {
				// body...
				if (!this._checkEventName(event_name))
				{
					return false
				}

				return _listerners[event_name] !== undefined
			},

			dispatchEvent: function (event_name) {
				// body...
				if (!this._checkEventName(event_name))
				{
					return
				}

				// 参数
				let args = Array.prototype.slice.call(arguments)
				args.shift()

				if (!window.wx) {
					if (args.length > 0) {
						console.log("dispatch EventName: {0}, Params: {1}".format(event_name, args.toString()))
					}
					else {
						console.log("dispatch EventName: {0}".format(event_name))
					}
				}
				
				// 是否继续传播
				let bPropagation = null

				for (let index in _listerners[event_name]) {
					let _listerner = _listerners[event_name][index]
					let bValue = false

					// 回调
					bValue = _listerner.apply(null, args)

					if (bValue === undefined) {
						bValue = null
					}

					bPropagation = bPropagation || bValue
				}

				if (bPropagation === null) {
					bPropagation = G_IsGlobalEventPropagation(event_name)
				}

				if (!bPropagation) {
					let parent_event_name = this._getParentEventName(event_name)

					if (parent_event_name !== "") {
						// 添加参数
						args.splice(0, 0, parent_event_name)

						// 递归调用
						this.dispatchEvent.apply(this, args)
					}
				}
			},

			_checkEventName: function (event_name) {
				// body...
				if (event_name === undefined
					|| typeof(event_name) !== "string"
					|| event_name === "") 
				{
					return false
				}

				return true
			},

			_checkListerner: function (listerner) {
				// body...
				if (listerner === undefined
					|| typeof(listerner) !== "function")
				{
					return false
				}

				return true
			},

			_getParentEventName: function (event_name) {
				// body...
				if (!this._checkEventName(event_name))
				{
					return ""
				}

				let nameArr = event_name.split('_')
				let parent_event_name = ''

				for (let i = 0; i < nameArr.length - 1; i++) {
					parent_event_name += parent_event_name === '' ? nameArr[i] : ('_' + nameArr[i])
				}

				return parent_event_name
			}
		}
	}

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
export {_Event}