function isAddrValid( addr ) {
	// body...
	if (typeof addr !== "undefined" && (addr.startsWith('ws://') || addr.startsWith('wss://'))) {
		return true
	}
	else {
		return false
	}
}

class Web_Socket {
	constructor() {
		// inner properties
		this._ws = undefined
		this._addr = ""

		// outer properties
		this.onConnectOpen = undefined
		this.onConnectClose = undefined
		this.onConnectError = undefined
		this.onGotMessage = undefined
	}
	
	connect(addr) {
		// body...
		if (isAddrValid(addr)) {
			this._clear()

			this._addr = addr

			// start connect
			this._doConnect()
		}
		else {
			console.log(String.format("Invalid Addr: {0}", addr))
		}
	}

	close() {
		// body...
		if (typeof this._ws !== "undefined") {
			this._ws.close()
		}
	}

	send(data) {
		// body...
		if (!this.isConnected()) {
			console.log("Can Not Send Any Data Before Connect.")
			return
		}

		this._ws.send(data)
	}

	isConnected() {
		// body...
		if (window.WebSocket && typeof this._ws !== "undefined") {
			return this._ws.readyState === WebSocket.OPEN
		}

		return false
	}

	_doConnect() {
		// body...
		var self = this

		if (window.WebSocket) {
			console.log("Start Connect: {0}".format(this._addr))

			// create
			this._ws = new WebSocket(this._addr)

			this._ws.onopen = function (event) {
				if (self._ws.readyState === WebSocket.OPEN) {
					console.log("Connect Open...")

					// set data type
					self._ws.binaryType = 'arraybuffer'

					// cb
					self._doConnectOpenCb()
				}
			};

			this._ws.onmessage = function (event) {
				console.log("Got Message...")

				// cb
				self._doGotMessageCb(event.data)
			};

			this._ws.onerror = function (event) {
				console.error("Connect Error...")

				// reset
				if (self._ws.readyState === WebSocket.OPEN) {
					// cb
					self._doConnectErrorCb()
				}
			};

			this._ws.onclose = function (event) {
				console.log("Connect Close...")

				// reset
				if (typeof self._ws !== "undefined") {
					self._ws = undefined

					// temp save
					let closeCb = self.onConnectClose
					
					// clear
					self._clear()

					// cb
					self._doConnectCloseCb(closeCb)
				}
			};
		}
		else {
			console.log("Do Not Support On Current Platform.")
		}
	}

	_clear() {
		// body...
		console.log("Reset Connect Environment...")

		this._addr = ""
		this.onConnectOpen = undefined
		this.onConnectClose = undefined
		this.onConnectError = undefined
		this.onGotMessage = undefined
	}

	_doConnectOpenCb() {
		// body...
		if (typeof this.onConnectOpen === "function") {
			this.onConnectOpen()
		}
		else {
			console.log("Do Not Register Open Connect Callback.")
		}
	}

	_doConnectCloseCb( cb ) {
		// body...
		if (typeof cb === "function") {
			cb()
		}
		else {
			console.log("Do Not Register Close Connect Callback.")
		}
	}

	_doConnectErrorCb() {
		// body...
		if (typeof this.onConnectError === "function") {
			this.onConnectError()
		}
		else {
			console.log("Do Not Register Connect Error Callback.")
		}
	}

	_doGotMessageCb( data ) {
		// body...
		if (typeof this.onGotMessage === "function") {
			this.onGotMessage(data)
		}
		else {
			console.log("Do Not Register Got Message Callback.")
		}
	}
}

// export
export {Web_Socket}