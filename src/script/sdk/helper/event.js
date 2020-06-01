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
			addEventListerner: function (event_name, listerner, caller = null) {
				// body...
				if (!this._checkString(event_name)
					|| !this._checkListerner(listerner))
				{
					return ""
				}

				if (_listerners[event_name] === undefined) 
				{
					_listerners[event_name] = []
				}

				let key = G_Utils.generateString(32)
				_listerners[event_name].push({key: key, method: listerner, caller: caller})

				return key
			},

			removeEventListernerByKey: function (event_name, key) {
				// body...
				if (!this._checkString(event_name) || !this._checkString(key))
				{
					return
				}

				if (_listerners[event_name] !== undefined) 
				{
					for (let i = 0; i < _listerners[event_name].length; i++) {
						let listernerInfo = _listerners[event_name][i]

						if (listernerInfo.key === key) {
							_listerners[event_name].splice(i, 1)
							return
						}
					}
				}
			},

			removeEventListerner: function (event_name, listerner, caller = null) {
				// body...
				if (!this._checkString(event_name) || !this._checkListerner(listerner))
				{
					return
				}

				if (_listerners[event_name] !== undefined) 
				{
					for (let i = 0; i < _listerners[event_name].length; i++) {
						let listernerInfo = _listerners[event_name][i]

						if (listernerInfo.method === listerner && listernerInfo.caller === caller) {
							_listerners[event_name].splice(i, 1)
							return
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
				if (!this._checkString(event_name))
				{
					return false
				}

				if (typeof _listerners[event_name] !== "undefined" && _listerners[event_name].length > 0) {
					return true
				}
				else {
					return false
				}
			},

			dispatchEvent: function (event_name) {
				// body...
				if (!this._checkString(event_name))
				{
					return
				}

				// 参数
				let args = Array.prototype.slice.call(arguments)
				args.shift()

				if (args.length > 0) {
					console.log("dispatch EventName: {0}, Params: {1}".format(event_name, args.toString()))
				}
				else {
					console.log("dispatch EventName: {0}".format(event_name))
				}
				
				// 是否继续传播
				let bPropagation = null

				for (let index in _listerners[event_name]) {
					let listernerInfo = _listerners[event_name][index]
					let bValue = false

					// method
					bValue = listernerInfo.method.apply(listernerInfo.caller, args)

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

			_checkString: function (event_name) {
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
				if (typeof listerner === "function")
				{
					return true
				}

				return false
			},

			_getParentEventName: function (event_name) {
				// body...
				if (!this._checkString(event_name))
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