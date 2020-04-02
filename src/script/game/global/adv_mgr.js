let _ADVMgr = (function () {
  let _instance;

  function init() {
     let _AllAdvInfos = {};
     let _isIconAdv = 0;
     let _tryTimes = {};
     let _otherInfoKey = ['Count',]

     let _checkString = function (string) {
        if (typeof string !== "string" || string === "") {
           return false
        }
        return true
     }
     let _isObject = function (data) {
        if (!data) return false;
        return Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === 'object'
     }

     let _getOneInfoArr = function (keyName) {
        let result = null;
        if (keyName in _AllAdvInfos) {
           result = _AllAdvInfos[keyName];
        }
        return result;
     }

     let _getOtherInfo = function (AdvInfos, keyName) {
        for (let i = 0; i < _otherInfoKey.length; i++) {
           let key = _otherInfoKey[i];
           if (!_AllAdvInfos[key]) {
              continue;
           }
           if (_isObject(AdvInfos[key])) {
              AdvInfos[key][keyName] = _AllAdvInfos[key][keyName]
           } else {
              AdvInfos[key] = {};
              AdvInfos[key][keyName] = _AllAdvInfos[key][keyName]
           }
        }
     }

     let _getInfos = function (AdvNames) {
        let AdvInfos = {};
        let len = AdvNames.length;
        for (let i = len - 1; i >= 0; i--) {
           let item = AdvNames[i];
           let keyName = Object.keys(item)[0];
           AdvInfos[keyName] = _getOneInfoArr(keyName);
           _getOtherInfo(AdvInfos, item[keyName]);
           if (AdvInfos[keyName]) {
              AdvNames.splice(i, 1);
           }
        }
        return AdvInfos;
     }

     let _toArr = function (arr) {
        let AdvNames = [];
        arr.forEach(item => {
           if (_checkString(item)) {
              let result = {};
              result[item] = item;
              AdvNames.push(result);
           } else if (_isObject(item)) {
              AdvNames.push(item);
           }
        });
        return AdvNames;
     }

     let _disposeAdvName = function (advName) {
        if (_checkString(advName)) {
           let arr = advName.split(',');
           return _toArr(arr);
        } else if (Array.isArray(advName)) {
           return _toArr(advName);
        } else {
           return [];
        }
     }

     let _doAdvInfos = function (res, AdvInfos, AdvNames) {
        let info = res.Result.Info;
        let len = AdvNames.length - 1
        for (let i = len; i >= 0; i--) {
           let advNameObj = AdvNames.splice(i, 1)[0];
           let keyName = Object.keys(advNameObj)[0];
           let advArr = info[advNameObj[keyName]];
           if (Array.isArray(advArr)) {
              _AllAdvInfos[keyName] = advArr;
              AdvInfos[keyName] = advArr;
           }
        }
        AdvInfos.Status = 200;
        // 将后端返回的其他参数也一并提供出去
        let oLen = _otherInfoKey.length;
        for (let i = 0; i < oLen; i++) {
           const key = _otherInfoKey[i];
           let ele = res.Result[key];
           if (!ele) continue;
           let advProp = AdvInfos[key];
           advProp = _isObject(advProp) ? advProp : {};
           let allProp = _AllAdvInfos[key];
           allProp = _isObject(allProp) ? allProp : {};
           Object.assign && Object.assign(allProp, ele);
           Object.assign && Object.assign(advProp, ele);
           _AllAdvInfos[key] = allProp;
           AdvInfos[key] = advProp;
        }
     }

     let _finishTry = function (advKey, ret, advInfos) {
        let tryObj = _tryTimes[advKey]
        if (tryObj) {
           let cbs = null

           if (tryObj.cbs) {
              cbs = tryObj.cbs
           }

           // delete
           delete _tryTimes[advKey]

           // cb
           if (cbs) {
              cbs.forEach(cb => {
                 if (ret && advInfos) {
                    advInfos.ret = true;
                    cb(advInfos);
                 }
                 else {
                    cb({ ret: false });
                 }
              });
           }
        }
     }

     let _doTry = function (advKey, AdvInfos, AdvNames) {
        let tryObj = _tryTimes[advKey]
        if (tryObj) {
           tryObj.tryTimes += 1

           if (tryObj.tryTimes > 3) {
              _finishTry(advKey, false)
              return
           }

           if (G_PlatHelper.getPlat() && typeof G_PlatHelper.getPlat().h_GetAdvListPlat === "function") {
              G_PlatHelper.getPlat().h_GetAdvListPlat({
                 adv_key: advKey,
                 success: res => {
                    if (res.Status === 200) {
                       _doAdvInfos(res, AdvInfos, AdvNames);
                       _finishTry(advKey, true, AdvInfos);
                    } else {
                       console.warn('广告数据请求失败', res);
                       AdvInfos.Status = res.Status;
                       AdvInfos.Result = res.Result;
                       _finishTry(advKey, false)
                    }
                 },
                 fail: res => {
                    console.warn('广告数据请求失败', res);
                    AdvInfos.Status = 413;
                    AdvInfos.msg = '请求服务器失败';
                    _doTry(advKey, AdvInfos, AdvNames)
                 }
              });
           } else {
              console.warn('wx(qg).h_GetAdvListPlat 方法不存在，请检查 qy(-ov).js');
              _finishTry(advKey, false)
           }
        }
     }

     let _requsetAdvInfos = function (cb, AdvInfos, AdvNames) {
        let advKey = AdvNames.map(item => {
           let keys = Object.keys(item);
           return item[keys[0]];
        }).join();

        let isNew = false;

        if (typeof _tryTimes[advKey] === "undefined") {
           _tryTimes[advKey] = {
              tryTimes: 0,
              cbs: []
           }
           // new
           isNew = true
        }

        if (typeof cb === "function") {
           _tryTimes[advKey].cbs.push(cb)
        }

        // new and try
        if (isNew) {
           _doTry(advKey, AdvInfos, AdvNames);
        }
     }

     let _checkName = function (advName) {
        let result = {};
        if (Array.isArray(advName)) {
           let str = '';
           for (let i = 0; i < advName.length; i++) {
              const ele = advName[i];
              let isObj = _isObject(ele);
              if (!isObj) continue;
              let key = Object.keys(ele)[0];
              if (_otherInfoKey.indexOf(key) != -1) {
                 str += key + ',';
              }
           }
           if (str != '') {
              result.Status = 412;
              result.msg = '广告位置 key 按对象方式传递时不能使用下列键名：' + str;
           } else {
              result.Status = 200;
           }
        } else if (_checkString(advName)) {
           result.Status = 200;
        } else {
           result.Status = 411;
           result.msg = '广告位置 key 参数类型错误:' + advName;
        }
        return result;
     }

     return {
        getIconButtons(advName, cb) {
           _isIconAdv = 1;
           this.getEasyButtons(advName, cb);
        },
        getEasyButtons(advName, cb) {
           let checkRes = _checkName(advName);
           if (checkRes.Status !== 200) {
              typeof cb === 'function' && cb(checkRes);
              return;
           }
           let AdvNames = _disposeAdvName(advName);
           let AdvInfos = _getInfos(AdvNames);
          
           if (AdvNames.length > 0) {
              _requsetAdvInfos(cb, AdvInfos, AdvNames);
           } else {
              AdvInfos.Status = 200;
              AdvInfos.ret = true;
              typeof cb === 'function' && cb(AdvInfos);
           }
        },
        // 获得所有广告数据
        getAllAdvData() {
           return _AllAdvInfos;
        },

     };
  }

  return {
     getInstance: function () {
        if (!_instance) {
           _instance = init();
        }
        return _instance;
     }
  };
})();

// global
window.G_ADVMgr = _ADVMgr.getInstance()