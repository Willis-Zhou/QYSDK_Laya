/*
* QYSDK全局配置
*/
var _SDKCfg = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_SDKCfg Instance...")

		// 是否支持Open Data
		var _enableOpenData = true;

		// 是否支持网络连接（WebSocket连接）
		var _enableNetword = false;

		// 服务器网络地址（_enableNetword为true时有效）
		var _netAddr = null;

		// 网络连接配置（_enableNetword为true时有效）
		var _netCfgs = {
			max_connect_times: 3,
			timeout_of_connect: 5.0 * 1000,
			max_try_send_times: 3
		};

		// 是否支持HTTP/HTTPS访问
		var _enableHttps = true;

		// HTTP/HTTPS访问配置（_enableHttps为true时有效）
		var _httpsfgs = {
			timeout_of_request: 10.0 * 1000,
			max_try_send_times: 3
		};

		// 基础WebUrl
		var _baseWebUrl = null;

		// 资源版本
		var _appVersion = -1;
		var _patchVersion = -1;

		// 是否开启ald上报
		var _enableAldReport = null;
		var _checkAldReportCbs = [];
		// 是否开启qy上报
		var _enableQyReport = null;
		var _checkQyReportCbs = [];

		return {
			// 初始化
			init: function () {
				G_Switch.getPercentOfReportToAld(function (percent) {
					if (_enableAldReport === null) {
						if (G_Utils.random(1, 100) <= percent) {
							_enableAldReport = true
						}
						else {
							_enableAldReport = false
						}
					}

					if (_checkAldReportCbs.length > 0) {
						for (let i = 0; i < _checkAldReportCbs.length; i++) {
							let cb = _checkAldReportCbs[i]
							cb(_enableAldReport)
						}
	
						_checkAldReportCbs = []
					}
				})

				_enableQyReport = true
				if (_checkQyReportCbs.length > 0) {
					for (let i = 0; i < _checkQyReportCbs.length; i++) {
						let cb = _checkQyReportCbs[i]
						cb(_enableQyReport)
					}

					_checkQyReportCbs = []
				}
			},

			// 是否支持网络连接
			isOpenDataEnabled: function () {
				// body...
				return _enableOpenData;
			},

			// 是否支持网络连接
			isNetwordEnabled: function () {
				// body...
				return _enableNetword;
			},

			// 获取服务器网络地址
			getNetAddr: function () {
				// body...
				if(!this.isNetwordEnabled()) {
					return "";
				}
				else {
					if (!_netAddr) {
						_netAddr = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NET_ADDR"]).str
					}

					return _netAddr;
				}
			},

			// 获取服务器网络配置
			getNetCfgs: function () {
				// body...
				if(!this.isNetwordEnabled()) {
					return {};
				}
				else {
					return _netCfgs;
				}
			},

			// 是否支持HTTP/HTTPS访问
			isHttpsEnabled: function () {
				// body...
				return _enableHttps;
			},

			// 获取HTTP/HTTPS访问配置
			getHttpsCfgs: function () {
				// body...
				if(!this.isHttpsEnabled()) {
					return {};
				}
				else {
					return _httpsfgs;
				}
			},

			// 获取基础WebUrl
			getBaseWebUrl: function () {
				// body...
				if (!_baseWebUrl) {
					_baseWebUrl = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_BASE_WEB_URL"]).str
				}

				return _baseWebUrl;
			},

			// 获取patch版本
			getAppVersion: function () {
				// body...
				if (_appVersion === -1) {
					_appVersion = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_APP_VERSION"]).num
				}

				return _appVersion;
			},

			// 获取patch版本
			getPatchVersion: function () {
				// body...
				if (_patchVersion === -1) {
					_patchVersion = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_PATCH_VERSION"]).num
				}

				return _patchVersion;
			},

			// 是否支持ald上报
			isAldReportEnabled: function ( cb ) {
				// body...
				if (_enableAldReport === null) {
					// save cb
					_checkAldReportCbs.push(cb)
				}
				else {
					if (typeof cb === "function") {
						cb(_enableAldReport)
					}
				}
			},

			isAldReportEnabledSync: function () {
				if (_enableAldReport === null) {
					console.error("Can not call func: isAldReportEnabledSync before func: isAldReportEnabled")
					return false
				}
				else {
					return _enableAldReport
				}
			},

			// 是否支持qy上报
			isQyReportEnabled: function ( cb ) {
				// body...
				if (_enableQyReport === null) {
					// save cb
					_checkQyReportCbs.push(cb)
				}
				else {
					if (typeof cb === "function") {
						cb(_enableQyReport)
					}
				}
			},

			isQyReportEnabledSync: function () {
				if (_enableQyReport === null) {
					console.error("Can not call func: isQyReportEnabledSync before func: isQyReportEnabled")
					return false
				}
				else {
					return _enableQyReport
				}
			},
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
export {_SDKCfg}