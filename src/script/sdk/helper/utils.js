var _Utils = (function () {
	var _instance;
	var _lodash;

	function init() {
		// body...
		console.log('Init G_Utils Instance...')

		var formatNumberWithFilling = function(number, len, filling)
		{
			var sRet = number.toString()
			if(!filling)
			{
				filling = '0'
			}
			while(sRet.length < len)
			{
				sRet = filling + sRet
			}
			return sRet
		}

		return {
			/**
			 * 注册lodash工具
			 * QQ平台不支持
			 * 
			 */
			registerLodash( lodash ) {
				_lodash = lodash
			},

			/**
			 * 获取注册的lodash工具
			 * QQ平台不支持
			 * 
			 */
			getLodash() {
				return _lodash
			},

			/**
			 * Convert a hex string into a Uint8Array.
			 *
			 * @returns {Uint8Array}
			 */
			HexString2Uint8Array: function ( string ) {
				// body...
				if (string === '' || string.length % 2 != 0) {
					return (new Uint8Array())
				}

				let numArr = []

				for (let i = 0; i < string.length; i = i + 2) {
					numArr[numArr.length] = parseInt(string[i] + string[i + 1], 16)
				}

				return (new Uint8Array(numArr))
			},

			/**
			 * Convert an Uint8Array into a hex string.
			 *
			 * @returns {Hex String}
			 */
			Uint8Array2HexString: function ( uint8Arr ) {
				// body...
				let str = ''

				for (let i = 0; i < uint8Arr.length; i++) {
					let hex = uint8Arr[i].toString(16).toUpperCase()
					str += hex.length == 1 ? ('0' + hex) : hex
				}

				return str
			},

			/**
			 * 格式化时间, 默认格式 2018年1月1日 01:02:03,当first = 2时日期格式为 2018/01/01 23:45:08
			 * @param {Date} date 目标时间结构
			 * @param {Boolean} first 是否需要年月日
			 * @param {Boolean} last 是否需要当日时间
			 */
			formatDate: function(date, first, last) {
				// body...
				var sDate = ''
				var sTime = ''

				if(!first && !last)
				{
					first = last = true
				}

				if( first ) {
					var y = date.getFullYear()
					var m = date.getMonth() + 1
					var d = date.getDate()
					if(first == 2)
					{
						sDate = y + '/' + formatNumberWithFilling(m, 2) + '/' + formatNumberWithFilling(d, 2)
					}
					else
					{
						sDate = y + '年' + m + '月' + d + '日'
					}
				}

				if( last ) {
					var h = date.getHours()
					var m = date.getMinutes()
					var s = date.getSeconds()

					sTime = formatNumberWithFilling(h, 2) + ':' + formatNumberWithFilling(m, 2) + ':' + formatNumberWithFilling(s, 2)
				}

				if(first && last)
				{
					return sDate + ' ' + sTime
				}
				else if(first)
				{
					return sDate
				}
				else if(last)
				{
					return sTime
				}

				return sDate + ' ' + sTime
			},

			/**
			 * 拷贝数据
			 * 支持对象或数据的拷贝
			 * 
			 */
			clone: function (dataObj) {
				// body...
				if (_lodash) {
					return _lodash.clone(dataObj)
				}
				else {
					if (!G_PlatHelper.isQQPlatform()) {
						console.warn("can not use clone utils before register lodash tools...")
					}
					
					return this.deepClone(dataObj)
				}
			},

			/**
			 * 深拷贝数据
			 * 支持对象或数据的拷贝
			 * 
			 */
			cloneDeep: function (dataObj) {
				// body...
				if (_lodash) {
					return _lodash.cloneDeep(dataObj)
				}
				else {
					if (!G_PlatHelper.isQQPlatform()) {
						console.warn("can not use cloneDeep utils before register lodash tools...")
					}
					
					return this.deepClone(dataObj)
				}
			},

			/**
			 * 拷贝数据
			 * 支持对象或数据的拷贝
			 * 不依赖第三方库
			 * 
			 */
			deepClone: function (item) {
				// body...
				if (!item) { return item; } // null, undefined values check

				var types = [ Number, String, Boolean ], result;

				// normalizing primitives if someone did new String('aaa'), or new Number('444');
				types.forEach(function(type) {
					if (item instanceof type) {
						result = type( item );
					}
				});

				if (typeof result == "undefined") {
					var self = this

					if (Object.prototype.toString.call( item ) === "[object Array]") {
						result = [];
						item.forEach(function(child, index, array) {
							result[index] = self.deepClone( child );
						});
					} else if (typeof item == "object") {
						// testing that this is DOM
						if (item.nodeType && typeof item.cloneNode == "function") {
							result = item.cloneNode( true );    
						} else if (!item.prototype) { // check that this is a literal
							if (item instanceof Date) {
								result = new Date(item);
							} else {
								// it is an object literal
								result = {};
								for (var i in item) {
									result[i] = self.deepClone( item[i] );
								}
							}
						} else {
							// depending what you would like here,
							// just keep the reference, or create new object
							if (false && item.constructor) {
								// would not advice to do that, reason? Read below
								result = new item.constructor();
							} else {
								result = item;
							}
						}
					} else {
						result = item;
					}
				}

				return result;
			},

			/**
			 * 生成从min到max之间的随机数，其中min和max都必须大于0的整数
			 * 若为一个参数，则生成1到min之间的随机数
			 * 若为两个参数，则生成min到max之间的随机数
			 * 其他参数个数，返回错误0
			 */
			random: function (min, max) {
				// body...
				if (min < 0 || max <= 0) {
					return 0;
				}

				switch(arguments.length) {
					case 1:
						return Math.floor(Math.random() * min + 1);
					case 2:
						return Math.floor(Math.random() * (max - min + 1) + min); 
					default: 
						return 0;
				}
			},

			/**
			 * 生成指定位数的随机字符串
			 * 
			 */
			generateString: function ( count ) {
				// body...
				let str = ''

				if (typeof count === "number") {
					for (let i = 0; i < count; i++) {
						if (Math.random() < 0.5) {
							str += String.fromCharCode(this.random('0'.charCodeAt(), '0'.charCodeAt() + 9))
						}
						else {
							str += String.fromCharCode(this.random('a'.charCodeAt(), 'a'.charCodeAt() + 25))
						}
					}
				}

				return str
			},

      		/**
			 * 将大数字转换为字符数字
			 * k = 3个0, m = 6个0, b = 9个0, t = 12个0, aa = 15个0, bb = 18个0, cc = 21个0 ... zz = 246个0
			 * bigNum 需要转换的数字
			 * roundNum 转换后数据的有效位数
			 */
			bigNumber2StrNumber( bigNum, roundNum ) {
				if (!bigNum) {
					return ""
				}
				else {
					if (typeof bigNum === "number") {
						bigNum = BigNumber(bigNum)
					}

					if (!(bigNum instanceof BigNumber)) {
						return ""
					}

					if (bigNum.e <= 4) {
						return bigNum.toFixed()
					}

					let unit = "k"

					if (bigNum.e >= 6) {
						for (let bit = 6; bit <= 246; bit = bit + 3) {
							if (bigNum.e >= bit && bigNum.e < (bit + 3)) {
								if (bit === 6) {
									unit = "m"
								}
								else if (bit === 9) {
									unit = "b"
								}
								else if (bit === 12) {
									unit = 't'
								}
								else {
									unit = String.fromCharCode("a".charCodeAt() + (bit - 15) / 3)
									unit += unit
								}

								break
							}
						}
					}

					// roundNum default 3
					if (typeof roundNum !== "number") {
						roundNum = 3
					}
					let exp = bigNum.toExponential(roundNum - 1)
					let valid = BigNumber(exp.substring(0, exp.indexOf("e"))).times(Math.pow(10, bigNum.e % 3))
					return valid.toString() + unit
				}
			},

			/**
			 * 将数字转化为中文
			 * 支持数字1-7
			 */
			convertNumberToChinese: function ( num ) {
		        // body...
		        if (typeof num === "number") {
		            switch (num) {
		                case 1:
		                    return "一"
		                case 2:
		                    return "二"
		                case 3:
		                    return "三"
		                case 4:
		                    return "四"
		                case 5:
		                    return "五"
		                case 6:
		                    return "六"
		                case 7:
		                    return "日"
		                default:
		                    return "一"
		            }
		        }
		        else {
		            return "一"
		        }
		    },

		    /**
			 * 将秒数转化为时分制
			 * 
			 */
			convertSecondToHourMinute: function ( seconds ) {
		        // body...
		        if (!G_GameDB.isLoaded()) {
		        	return ""
		        }

		        let strHour = G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_UNIT_HOUR"]).word
		        let strMinute = G_GameDB.getUIWordByID(UIWordIDs["UIWORD_ID_UNIT_MINUTE"]).word

		        if (typeof seconds === "number") {
		            if (seconds >= 3600) {
		            	let hours = Math.floor(seconds / 3600)
		            	let minutes = Math.floor((seconds - 3600 * hours) / 60)

		            	if (minutes > 0) {
		            		return hours.toString() + strHour + minutes.toString() + strMinute
		            	}
		            	else {
		            		return hours.toString() + strHour
		            	}
		            }
		            else if (seconds >= 60) {
		            	let minutes = Math.floor(seconds / 60)
		            	return minutes.toString() + strMinute
		            }
		            else if (seconds > 0) {
		            	return "1" + strMinute
					}
					else {
						return "0" + strMinute
					}
		        }
		        
		        return ""
			},
			
			/**
			 * 将秒数转化为时分秒制
			 * 
			 */
			convertSecondToHourMinuteSecond: function ( seconds, isAutoHideHour ) {
				// body...
				let ret = ""

				if (seconds >= 3600) {
					let hours = Math.floor(seconds / 3600)
					if (hours >= 10) {
						ret += hours.toString()
					}
					else {
						ret += "0" + hours.toString()
					}
				}
				else {
					if (!isAutoHideHour) {
						ret += "00"
					}
				}

				if (ret !== "") {
					ret += ":"
				}

				let minutes = Math.floor((seconds % 3600) / 60)
				if (minutes > 0) {
					if (minutes >= 10) {
						ret += minutes.toString()
					}
					else {
						ret += "0" + minutes.toString()
					}
				}
				else {
					ret += "00"
				}

				ret += ":"

				let secs = seconds % 60
				if (secs > 0) {
					if (secs >= 10) {
						ret += secs.toString()
					}
					else {
						ret += "0" + secs.toString()
					}
				}
				else {
					ret += "00"
				}

		        return ret
			},

			/**
			 * 判断是否为对象
			 * 
			 */
		    isObject: function ( value ) {
				return value && typeof value === "object"
			},

			/**
			 * 打乱数组（影响原数组对象）
			 * 
			 */
			shuffleArray (arr) {
				if (Array.isArray(arr)) {
					for (let i = 0; i < arr.length; i++) {
						let randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
						let temp = arr[randomIndex]
						arr[randomIndex] = arr[i]
						arr[i] = temp
					}
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
export {_Utils}