const DEPOSIT_MONEY_FROM_RED_PACKAGE = 1

/*
* 红包管理
*/
var _RedPackageMgr = function() {
	var _instance;

	function init() {
		// body ...
		console.log("Init G_RedPackageMgr Instance...")

		var _cfgs = null

		var _getWithdrawEveryMoney = () => {
			if (_cfgs && _cfgs.everydayWithdraw.minMoney <= _cfgs.everydayWithdraw.maxMoney) {
				return G_Utils.random(_cfgs.everydayWithdraw.minMoney, _cfgs.everydayWithdraw.maxMoney)
			}
			else {
				return 0
			}
		}

		var _getNextRedPackageMoney = () => {
			if (_cfgs && _cfgs.redPack.length > 0) {
				let redPackageIndex = G_PlayerInfo.getTotalGotRedPackageCount() + 1
				let minMoney = -1
				let maxMoney = -1

				for (let i = 0; i < _cfgs.redPack.length; i++) {
					const cfg = _cfgs.redPack[i];
					if (cfg.redPackStartNum <= redPackageIndex && cfg.redPackEndNum >= redPackageIndex) {
						minMoney = cfg.redPackMinMoney
						maxMoney = cfg.redPackMaxMoney
					}
				}

				if (minMoney === -1) {
					let lastCfg = _cfgs.redPack[_cfgs.redPack.length - 1]
					minMoney = lastCfg.redPackMinMoney
					maxMoney = lastCfg.redPackMaxMoney
				}

				console.log("{0} time to deposit money, min: {1}, max: {2}".format(redPackageIndex.toString(), minMoney.toString(), maxMoney.toString()))

				return G_Utils.random(minMoney, maxMoney)
			}
			else {
				return 0
			}
		}

		return {
			iniCfgs( cfgs ) {
				console.log("init red package config: ", cfgs)
				_cfgs = cfgs
			},

			// 存钱
			depositMoney( cb ) {
				if (typeof cb !== "function") {
					return
				}

				if (!_cfgs) {
					console.error("depositMoney fail, check web config...")

					cb(false, "未检查到相应红包网络配置")
					return
				}

				// request
				let willDepositMoney = _getNextRedPackageMoney()
				if (willDepositMoney === 0) {
					console.error("depositMoney fail, check web config...")

					cb(false, "未检查到相应红包网络配置")
					return
				}
				else {
					G_NetHelper.reqDepositMoney(G_PlayerInfo.getSessID(), DEPOSIT_MONEY_FROM_RED_PACKAGE, willDepositMoney, jsonData => {
						if (jsonData && jsonData.code === 0) {
							// save into local
							G_PlayerInfo.depositMoney(willDepositMoney)
							G_PlayerInfo.addTotalGotRedPackageCount()

							cb(true, willDepositMoney)
						}
						else {
							cb(false, "当前网络异常，请稍后重试")
						}
					})
				}
			},

			// 取钱
			withdrawMoney( money, cb ) {
				if (typeof cb !== "function") {
					return
				}

				if (!_cfgs) {
					console.error("withdrawMoney fail, check web config...")

					cb(false, "未检查到相应提取网络配置")
					return
				}

				if (typeof money !== "number") {
					console.error("withdrawMoney fail, check input...", money)

					cb(false, "提取金额错误")
					return
				}

				let restMoney = G_PlayerInfo.getMoney()

				if (restMoney < money) {
					console.warn("withdrawMoney fail, not enough money...")

					cb(false, "余额不足")
					return
				}

				// request
				G_NetHelper.reqWithdrawMoney(G_PlayerInfo.getSessID(), money, G_PlayerInfo.getTodayAdvTimes(), G_PlayerInfo.getTotalAdvTimes(), jsonData => {
					if (jsonData && jsonData.code === 0) {
						// save into local
						G_PlayerInfo.withdrawMoney(money)

						cb(true, money)
					}
					else {
						cb(false, "当前提取人数过多，请稍后尝试")
					}
				})
			},

			// 提现每日金钱
			withdrawEverydayMoney( cb ) {
				if (typeof cb !== "function") {
					return
				}

				if (!_cfgs) {
					console.error("withdrawEverydayMoney fail, check web config...")

					cb(false, "未检查到相应提取网络配置")
					return
				}

				if (G_PlayerInfo.isWithdrawEverydayMoneyToday()) {
					console.warn("withdrawEverydayMoney fail, withdrawed before...")

					cb(false, "您今天已经提取过了")
					return
				}

				if (G_PlayerInfo.getTodayAdvTimes() < _cfgs.everydayWithdraw.currentDayVideoNum) {
					console.warn("withdrawEverydayMoney fail, need more adv times...")

					cb(false, "当前广告观看次数不够")
					return
				}

				// request
				let willWithdrawMoney = _getWithdrawEveryMoney()
				if (willWithdrawMoney === 0) {
					console.error("withdrawEverydayMoney fail, check web config...")

					cb(false, "未检查到相应提取网络配置")
					return
				}
				else {
					G_NetHelper.reqWithdrawEverydayMoney(G_PlayerInfo.getSessID()
					, willWithdrawMoney
					, G_PlayerInfo.getTodayAdvTimes()
					, G_PlayerInfo.getTotalAdvTimes()
					, G_ServerInfo.getCurServerDayOfYear()
					, jsonData => {
						if (jsonData && jsonData.code === 0) {
							// save into local
							G_PlayerInfo.withdrawEverydayMoney(willWithdrawMoney)
	
							cb(true, willWithdrawMoney)
						}
						else {
							cb(false, "当前提取人数过多，请稍后尝试")
						}
					})
				}
			},

			// 查询剩余的钱（红包内）
			getMoney() {
				return G_PlayerInfo.getMoney()
			},

			// 查询领过的钱（从红包）
			getTotalWithdrawMoney() {
				return G_PlayerInfo.getTotalWithdrawMoney()
			},

			// 查询取过几次钱（从红包）
			getTotalWithdrawMoneyTimes() {
				return G_PlayerInfo.getTotalWithdrawMoneyTimes()
			},

			// 今天是否已经提取了每日现金
			isWithdrawEverydayMoneyToday() {
				return G_PlayerInfo.isWithdrawEverydayMoneyToday()
			},

			// 获取提取每日现金需要的视频次数
			getNeedAdvTimesOfEverydayMoney() {
				if (_cfgs) {
					return _cfgs.everydayWithdraw.currentDayVideoNum
				}
				else {
					return 0
				}
			},

			// 获取所有提现选项
			getAllDepositOptions() {
				let options = []

				if (_cfgs && _cfgs.withdraw.length > 0) {
					for (let i = 0; i < _cfgs.withdraw.length; i++) {
						const cfg = _cfgs.withdraw[i]
						options.push(cfg.withdrawMoney)
					}
				}

				if (options.length > 0) {
					options.sort((a, b) => {
						return a - b
					})

					if (this.getTotalWithdrawMoney() > 0 || this.getTotalWithdrawMoneyTimes() > 0) {
						options.splice(0, 1)
					}
				}
				
				return options
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
window.G_RedPackageMgr = _RedPackageMgr.getInstance()