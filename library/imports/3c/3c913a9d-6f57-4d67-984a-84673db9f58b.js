"use strict";
cc._RF.push(module, '3c913qdb1dNZ5hKhGc9ufWL', 'CommonFun');
// Main/Script/Common/UtilTools/CommonFun.js

"use strict";

var _cc$Class;
var EnumOrientation = cc.Enum({
  HORIZONTAL: 0,
  VERTICAL: 1
});
var CommonFun = cc.Class((_cc$Class = {
  statics: {
    _instance: null
  },
  ctor: function ctor() {
    this._layerNodeMap = new Map();
    this._progressTimer = null;
    this._progressNode = null;
    this._selectRoomNode = null;
    this._loadedPrefabMap = new Map();
    this._verticalAcc = 0;
    this._curOrientation = EnumOrientation.HORIZONTAL;
    this.resoucesBundleOpenList = {};
    this.gameBundleOpenList = {};
  },
  checkShiPei: function checkShiPei(node) {
    var _canvas = cc.Canvas.instance;
    //获取硬件分辨率
    var frameSize = cc.view.getFrameSize();
    var w = frameSize.width;
    var h = frameSize.height;
    GlobalCfg.DEVICE_MODEL = h;
    var bi = w / h;
    if (cc.sys.isBrowser) {
      if (bi > 1.7 && bi < 2.1) {
        node.setContentSize(1334, 750);
      } else if (bi >= 2.1 && bi < 2.3) {
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1625, 750);
      } else {
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1835, 750);
      }
      ;
    } else {
      if (w == 2436 && h == 1125) {
        //Iphone X 
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1625, 750);
      } else if (w == 2265 && h == 1080) {
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1625, 750);
      } else if (bi >= 2.4) {
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1835, 750);
      } else if (bi >= 2.1 && bi < 2.4) {
        GlobalCfg.DEVICE_MODEL = "iphone X";
        node.setContentSize(1625, 750);
      } else {
        node.setContentSize(1334, 750);
      }
      ;
    }
    ;
    if (_canvas) {
      _canvas.fitHeight = true;
      _canvas.fitWidth = false;
    }
    ;
  },
  // 加密
  encrypt: function encrypt(str, pwd) {
    if (str == '') {
      return '';
    }
    str = encodeURIComponent(str);
    if (!pwd || pwd == '') {
      pwd = 'kb1234';
    }
    pwd = encodeURIComponent(pwd);
    if (pwd == '' || pwd.length <= 0) {
      return '';
    }
    ;
    var prand = '';
    for (var i = 0, len = pwd.length; i < len; i += 1) {
      prand += pwd.charCodeAt(i).toString();
    }
    ;
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
      return '';
    }
    ;
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    ;
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for (var i = 0, len = str.length; i < len; i += 1) {
      encChr = parseInt(str.charCodeAt(i) ^ Math.floor(prand / modu * 255));
      if (encChr < 16) {
        encStr += '0' + encChr.toString(16);
      } else {
        encStr += encChr.toString(16);
      }
      prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) {
      salt = "0" + salt;
    }
    encStr += salt;
    return encStr;
  },
  // 解密
  decrypt: function decrypt(str, pwd) {
    if (str == '') {
      return '';
    }
    if (!pwd || pwd == '') {
      pwd = 'kb1234';
    }
    pwd = encodeURIComponent(pwd);
    if (str == undefined || str.length < 8) {
      return '';
    }
    if (pwd == undefined || pwd.length <= 0) {
      return '';
    }
    var prand = '';
    for (var i = 0, len = pwd.length; i < len; i += 1) {
      prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for (var i = 0, len = str.length; i < len; i += 2) {
      encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor(prand / modu * 255));
      encStr += String.fromCharCode(encChr);
      prand = (mult * prand + incr) % modu;
    }
    return decodeURIComponent(encStr);
  },
  /**
   * 处理App的配置信息数据
   * @param {Object} json App配置信息的数据对象 
   */
  dealAppInfoJson: function dealAppInfoJson(json) {
    /**
     * 服务器重启中
     */
    GlobalCfg.SERVERRELOAD = Reflect.has(json, "ServerReload") == true ? json["ServerReload"] : false;
    GlobalCfg.SERVERRELOAD_Descr = Reflect.has(json, "ServerReloadDescribe") == true ? json["ServerReloadDescribe"] : "";
    /**
     * App的落地页地址（主要是OpenInstall的功能）
     */
    GlobalCfg.APP_SHARE_URL = json["APP_SHARE_URL"];
    /**
     * 是否检查热更
     */
    GlobalCfg.IS_UPDATE = json["IS_UPDATE"];
    /**
     * 资源的版本
     */
    GlobalCfg.ASSETS_VERSION = json["ASSETS_VERSION"];
    /**
     * 远程资源的根路径（ftp的路径：/home/ubuntu/august/www/download/whwh/）
     */
    GlobalCfg.ASSETS_URL = json["ASSETS_URL"];
    /**
     * 资源的父路径
     */
    GlobalCfg.ASSETS_UPDATE_URL = "" + GlobalCfg.ASSETS_URL + GlobalCfg.ASSETS_VERSION;
    /**
     * 子包资源的版本信息
     */
    GlobalCfg.SUB_GAME_VERSION_INFO = json["SUB_GAME_VERSION_INFO"];
    /**
     * Http根路由 
     */
    GlobalCfg.HTTP_ROOT_URL = json["HTTP_ROOT_URL"];

    /**
     * 用户登录相关的路由
     */
    GlobalCfg.HTTP_USER_LOGIN = json["HTTP_ROOT_URL"] + "/login";
    /**
     * 用户登录相关的路由
     */
    GlobalCfg.Forced_Migration = json["ForcedMigration"];
    /**
     * 暂定（配合服务器的定义）
     */
    GlobalCfg.HTTP_SERVER = json["HTTP_ROOT_URL"] + "/httpserver";
    /**
     * 小游戏的ws路由
     */
    GlobalCfg.WEB_SOCKET_GAME = json["WEB_SOCKET_GAME"];
    /**
     * 大厅的ws路由
     */
    GlobalCfg.WEB_SOCKET_LOBBY = json["WEB_SOCKET_LOBBY"];
    /**
     * 渠道标识
     */
    GlobalCfg.CHANNEL_INFO = json["CHANNEL_INFO"];
    /**
     * 谷歌ID
     */
    GlobalCfg.GOOGLE_ID = json["GOOGLE_ID"];
    /**
     * Facebook ID
     */
    GlobalCfg.FACEBOOK_ID = json["FACEBOOK_ID"];
    /**
     * 远程App版本更新
     */
    GlobalCfg.REMOTE_APP_UPDATE = json["REMOTE_APP_UPDATE"];
    /**
     * 远程App版本
     */
    GlobalCfg.REMOTE_APP_VERSION = json["REMOTE_APP_VERSION"];
    /**
     * 远程App地址
     */
    GlobalCfg.REMOTE_APP_URL = json["REMOTE_APP_URL"];

    /**
     * 获取OpenInstall的数据
     */
    APPManager.getOpenInstallData();

    /**
     * 设置Facebook ID
     */
    if (GlobalCfg.FACEBOOK_ID && GlobalCfg.FACEBOOK_ID.length > 0) {
      APPManager.setFaceBookID(GlobalCfg.FACEBOOK_ID);
    }
    ;

    /**
     * 新的渠道模式
     */
    var packageChannel = cc.sys.localStorage.getItem("PackageChannel");
    if (packageChannel && packageChannel.indexOf("_") != -1) {
      var packageChannelArr = packageChannel.split("_");
      var channel = packageChannelArr[1];
      if (!channel) {
        LoggerUtil.getInstance().error("Incorrect channel configuration during packaging!");
        return;
      }
      ;
      if (Reflect.has(json, "PACKAGE_CONFIG_DICT") == false) {
        LoggerUtil.getInstance().error("AppInfo configuration file without \"PACKAGE_CONFIG_DICT\" parameter!");
        return;
      }
      ;
      var packageConfigDict = json["PACKAGE_CONFIG_DICT"];
      if (Reflect.has(packageConfigDict, channel) == false) {
        LoggerUtil.getInstance().error("AppInfo configuration file, channel \"" + channel + "\" information not configured!");
        return;
      }
      ;
      var packageConfig = packageConfigDict[channel];
      if (Reflect.has(packageConfig, "CHANNEL_INFO") == true) {
        GlobalCfg.CHANNEL_INFO = packageConfig["CHANNEL_INFO"];
      }
      ;
      if (Reflect.has(packageConfig, "GOOGLE_ID") == true) {
        GlobalCfg.GOOGLE_ID = packageConfig["GOOGLE_ID"];
      }
      ;
      if (Reflect.has(packageConfig, "FACEBOOK_ID") == true) {
        GlobalCfg.FACEBOOK_ID = packageConfig["FACEBOOK_ID"];
        if (GlobalCfg.FACEBOOK_ID && GlobalCfg.FACEBOOK_ID.length > 0) {
          APPManager.setFaceBookID(GlobalCfg.FACEBOOK_ID);
        }
        ;
      }
      ;
      if (Reflect.has(packageConfig, "REMOTE_APP_UPDATE") == true) {
        GlobalCfg.REMOTE_APP_UPDATE = packageConfig["REMOTE_APP_UPDATE"];
      }
      ;
      if (Reflect.has(packageConfig, "REMOTE_APP_VERSION") == true) {
        GlobalCfg.REMOTE_APP_VERSION = packageConfig["REMOTE_APP_VERSION"];
      }
      ;
      if (Reflect.has(packageConfig, "REMOTE_APP_URL") == true) {
        GlobalCfg.REMOTE_APP_URL = packageConfig["REMOTE_APP_URL"];
      }
      ;
      if (Reflect.has(packageConfig, "APP_SHARE_URL") == true) {
        GlobalCfg.APP_SHARE_URL = packageConfig["APP_SHARE_URL"];
      }
      ;
    }
    ;
  },
  /**
   * 
   * @param {String} prefabPath 预制体路径
   * @param {cc.Node} parent 父节点
   * @param {Number} siblingIndex 设置在父节点上的层级
   * @param {Number} zIndex cc.Node.zIndex 的值，不推荐使用，设置 zIndex 后，siblingIndex会失效
   */
  showViewByPath: function showViewByPath(prefabPath, parent, siblingIndex, zIndex) {
    if (prefabPath && prefabPath.length != 0) {
      var viewName = prefabPath.split("/").pop();
      var curScene = cc.director.getScene();
      var curTips = null;
      if (parent && cc.isValid(parent)) {
        curTips = parent.getChildByName(viewName);
      }
      if (curTips) {
        curTips.active = true;
        var _siblingIndex = curTips.getSiblingIndex();
        curTips.setSiblingIndex(++_siblingIndex);
      } else {
        this.creatPreAndShowViewAction(prefabPath, parent, viewName, zIndex, siblingIndex);
      }
      ;
    }
  },
  creatPreAndShowViewAction: function creatPreAndShowViewAction(prefabPath, parentNode, name, index, siblingIndex) {
    if (!prefabPath) {
      return;
    }
    ;
    this.creatPrefab(prefabPath, parentNode, name, index, siblingIndex);
  },
  creatPrefab: function creatPrefab(url, parentNode, name, index, siblingIndex) {
    var prefab = cc.loader.getRes(url, cc.Prefab);
    var curScene = cc.director.getScene();
    if (!cc.isValid(parentNode)) {
      parentNode = curScene;
    }
    if (prefab != null && typeof prefab != "undefined") {
      var prefabNode = cc.instantiate(prefab);
      if (parentNode && prefabNode) {
        prefabNode.parent = parentNode;
        prefabNode.name = name ? name : "";
        if (index) {
          prefabNode.zIndex = index;
        }
        if (siblingIndex) {
          prefabNode.setSiblingIndex(siblingIndex);
        }
      }
      return prefabNode;
    } else {
      ResourcesBundle.load(url, function (err, prefab) {
        if (!err) {
          var _prefabNode = cc.instantiate(prefab);
          if (!cc.isValid(parentNode)) {
            parentNode = curScene;
          }
          if (cc.isValid(parentNode) && _prefabNode) {
            _prefabNode.parent = parentNode;
            _prefabNode.name = name ? name : "";
            if (index) {
              _prefabNode.zIndex = index;
            }
            if (siblingIndex) {
              _prefabNode.setSiblingIndex(siblingIndex);
            }
          }
          return _prefabNode;
        } else {
          LoggerUtil.getInstance().log("creatPrefab-获取预制体预制体异常：", err);
          return null;
        }
      });
    }
    ;
  },
  loadPrefab: function loadPrefab(url, callFun, params) {
    ResourcesBundle.load(url, function (err, prefab) {
      if (!err && callFun) {
        callFun(prefab, params);
      }
      ;
    });
  },
  /**
   * // UploadGameErrorReq 上报游戏错误消息 POST v1/upload/gameerror
      type UploadGameErrorReq struct {
      Product string `json:"product"` // 游戏项目appID(对应small_game/list接口product)
      Event   int    `json:"event"`   // 错误事件枚举(前后端对应，0:未知错误，1:未充值拒绝游戏)
      Message string `json:"message"` // 其他附带信息
      }
  */
  UploadGameErrorReq: function UploadGameErrorReq(params) {},
  httpGet: function httpGet(url, callFun, outCallFun, Authorization) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      var responseText = xhr.responseText;
      if (url == GlobalCfg.APP_INFO_URL || url == GlobalCfg.APP_CONFIG_URL || url == GlobalCfg.APP_INFO_URL_SPARE || url == GlobalCfg.APP_CONFIG_URL_SPARE) {
        try {
          var enCode = responseText;
          responseText = CommonFun.getInstance().decrypt(enCode, GlobalCfg.STR_KEY);
        } catch (error) {}
        ;
      }
      ;
      var responseJson = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (error) {
        responseJson = null;
      }
      ;
      if (xhr.readyState !== 4) {
        return;
      }
      ;
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
        LoggerUtil.getInstance().log("HttpGet ===> Url: ", url);
        LoggerUtil.getInstance().log("HttpGet ===> Readystate: 4, Status[(>= 200 && < 300) || 304]: ", xhr.status, "statusText: ", xhr.statusText);
        if (responseJson) {
          LoggerUtil.getInstance().log("HttpGet ===> ResponseJson: ", cc.sys.isNative ? JSON.stringify(responseJson) : responseJson);
          if (responseJson.result === 5) {
            CommonFun.getInstance().showTips(responseJson.msg);
            LobbyServerManager.clientCloseServer();
            GameServerManager.clientCloseServer();
            CommonFun.getInstance().deleteLoginLocalStorage();
            cc.director.loadScene("Update");
          } else if (responseJson.result === 33) {
            // 提示版本更新
            CommonFun.getInstance().showTips(responseJson.msg);
            LobbyServerManager.clientCloseServer();
            GameServerManager.clientCloseServer();
            CommonFun.getInstance().deleteLoginLocalStorage();
            cc.director.loadScene("Update");
          } else {
            callFun && callFun(responseJson);
          }
          ;
        } else {
          LoggerUtil.getInstance().log("HttpGet ===> ResponseText: ", cc.sys.isNative ? JSON.stringify(responseText) : responseText);
          outCallFun && outCallFun({
            result: 0,
            msg: responseText
          });
        }
        ;
      } else {
        var reason = "";
        if (xhr.responseText) {
          reason = xhr.responseText;
        } else if (xhr.statusText) {
          reason = xhr.statusText;
        } else {
          reason = xhr.status;
        }
        ;
        LoggerUtil.getInstance().log("HttpGet ===> Url: ", url);
        LoggerUtil.getInstance().log("HttpGet ===> Readystate: ", xhr.readyState, ", Status: ", xhr.status, "statusText: ", xhr.statusText);
        LoggerUtil.getInstance().log("HttpGet ===> Respone: ", cc.sys.isNative ? responseJson ? JSON.stringify(responseJson) : responseText : responseJson ? responseJson : responseText);
        outCallFun && outCallFun({
          result: 0,
          msg: reason
        });
      }
      ;
    };
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    if (Authorization) {
      xhr.setRequestHeader("Authorization", Authorization);
    }
    ;
    xhr.send();
  },
  httpPost: function httpPost(url, params, callFun, outCallFun, Authorization) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function () {
      var responseText = xhr.responseText;
      var responseJson = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (error) {
        responseJson = null;
      }
      ;
      if (xhr.readyState !== 4) {
        return;
      }
      ;
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
        LoggerUtil.getInstance().log("HttpPost ===> Url: ", url);
        LoggerUtil.getInstance().log("HttpPost ===> Params: ", cc.sys.isNative ? JSON.stringify(params) : params);
        LoggerUtil.getInstance().log("HttpPost ===> Readystate: 4, Status[(>= 200 && < 300) || 304]: ", xhr.status, "statusText: ", xhr.statusText);
        if (responseJson) {
          LoggerUtil.getInstance().log("HttpPost ===> ResponseJson: ", cc.sys.isNative ? JSON.stringify(responseJson) : responseJson);
          if (responseJson.result === 5) {
            CommonFun.getInstance().showTips(responseJson.msg);
            LobbyServerManager.clientCloseServer();
            GameServerManager.clientCloseServer();
            CommonFun.getInstance().deleteLoginLocalStorage();
            cc.director.loadScene("Update");
          } else {
            callFun && callFun(responseJson);
          }
          ;
        } else {
          LoggerUtil.getInstance().log("HttpPost ===> ResponseText: ", cc.sys.isNative ? JSON.stringify(responseText) : responseText);
          outCallFun && outCallFun({
            result: 0,
            msg: responseText
          });
        }
        ;
      } else {
        var reason = "";
        if (xhr.responseText) {
          reason = xhr.responseText;
        } else if (xhr.statusText) {
          reason = xhr.statusText;
        } else {
          reason = xhr.status;
        }
        ;
        LoggerUtil.getInstance().log("HttpPost ===> Url: ", url);
        LoggerUtil.getInstance().log("HttpPost ===> Params: ", cc.sys.isNative ? JSON.stringify(params) : params);
        LoggerUtil.getInstance().log("HttpPost ===> Readystate: ", xhr.readyState, "Status: ", xhr.status, "statusText: ", xhr.statusText);
        LoggerUtil.getInstance().log("HttpPost ===> Respone: ", cc.sys.isNative ? responseJson ? JSON.stringify(responseJson) : responseText : responseJson ? responseJson : responseText);
        outCallFun && outCallFun({
          result: 0,
          msg: reason
        });
      }
      ;
    };
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Content-Type", "application/json");
    if (Authorization) {
      LoggerUtil.getInstance().log("BearerToken\u60C5\u51B5\u4E0B, Post\u8BF7\u6C42\u7684\u5730\u5740\uFF1A" + url);
      xhr.setRequestHeader("Authorization", Authorization);
    }
    ;
    xhr.send(JSON.stringify(params));
  },
  generateUUID: function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    ;
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  },
  fixed: function fixed(num) {
    // let result = Math.floor(num * 100) / 100; // 截断两位小数
    // return result.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
    var result = Math.floor(num * 100) / 100; // 截断两位小数
    return result.toFixed(2); // 始终保留 2 位
  },

  /**
   * 检测小游戏是需要版本更新
   * @param {string} subpackgeName 小游戏bundle名
   * @returns 
   */
  isNeedUpdata: function isNeedUpdata(subpackgeName) {
    if (cc.sys.os == cc.sys.OS_ANDROID || !cc.sys.isBrowser) {
      return false;
    }
    if (this.gameBundleOpenList[subpackgeName]) {
      // 如果已经下载过，则直接返回
      return false;
    }
    return true;
  },
  gameLoadBundleByH5: function gameLoadBundleByH5(subpackgeName, callback) {
    var _this = this;
    // 加载资源包
    cc.assetManager.loadBundle(subpackgeName, function (err, bundle) {
      if (err) {
        callback && callback(); // 调用失败回调
        return;
      }
      // 预加载资源包中的目录并获取进度
      bundle.preloadDir("/", function (completedCount, totalCount) {
        var progress = completedCount / totalCount; // [0,1]
        if (progress >= 1) {
          progress = 1;
        }
        ;
        var progressStr = (progress * 100).toFixed(2);
        var msgData = {
          progress: progressStr,
          subpackgeName: subpackgeName
        };
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS,
          msgData: msgData
        });
      }, function (err) {
        if (err) {
          callback && callback(); // 调用失败回调
          return;
        }
        _this.gameBundleOpenList[subpackgeName] = true; // 保存已经下载过的bundle
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE,
          msgData: {
            subpackgeName: subpackgeName
          }
        });
        callback && callback(); // 调用成功回调
      });
    });
  },

  checkBundleIsDownloadedByH5: function checkBundleIsDownloadedByH5(packageName, callback) {
    var _this2 = this;
    if (cc.sys.os == cc.sys.OS_ANDROID || !cc.sys.isBrowser) {
      callback && callback();
      return;
    }
    if (this.resoucesBundleOpenList[packageName]) {
      // 如果已经下载过，则直接返回
      LoggerUtil.getInstance().log("ResourcesBundle\u4E0B\u8F7D\u5B8C\u6BD5");
      callback && callback();
      return;
    }
    this.showProgress(); // 显示进度
    // 加载资源包
    cc.assetManager.loadBundle("ResourcesBundle", function (err, bundle) {
      if (err) {
        clearTimeout(timeout); // 发生错误时清除定时器
        _this2.hidProgress(); // 隐藏进度条
        if (!isCallbackCalled) {
          callback && callback(err); // 调用失败回调
          isCallbackCalled = true; // 标记回调已被调用
        }

        return;
      }
      // 预加载资源包中的目录并获取进度
      bundle.preloadDir(packageName, function (completedCount, totalCount) {
        var rawProgress = completedCount / totalCount; // 计算进度
        LoggerUtil.getInstance().log("packageName \u4E0B\u8F7D\u8FDB\u5EA6 \uFF1A " + (rawProgress * 100).toFixed(2) + "%");
      }, function (err) {
        if (err) {} else {
          _this2.hidProgress(); // 隐藏进度
          _this2.resoucesBundleOpenList[packageName] = true; // 标记该资源包已打开
          callback && callback(); // 执行回调
        }
      });
    });
  },

  /**
   * 判断脚本是否有效
   * @param {cc.Script} target 脚本实例化的对象
   */
  isValidForScr: function isValidForScr(target) {
    if (target && target.node && cc.isValid(target.node)) {
      return true;
    } else {
      return false;
    }
  },
  // 补0位 num传入的数字，n需要的字符长度
  prefixInteger: function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },
  random: function random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  },
  // 货币显示规范
  numberToShow: function numberToShow(number, entrycondition) {
    if (entrycondition == 0) {
      return number;
    } else {
      var coin = parseInt(number) + '';
      if (coin.length >= 8) {
        var tcoin1 = (coin / 10000000 + '').split('.');
        coin = tcoin1[0] + (tcoin1[1] ? '.' + tcoin1[1].substring(0, 2) : '') + 'C';
        return coin;
      } else if (coin.length >= 6) {
        var tcoin2 = (coin / 100000 + '').split('.');
        coin = tcoin2[0] + (tcoin2[1] ? '.' + tcoin2[1].substring(0, 2) : '') + 'L';
        return coin;
      }
      return number;
    }
    ;
  },
  // 货币显示规范美术字 需要把.替换成x,美术字没有.
  numberToShow_byColor: function numberToShow_byColor(label, num) {
    var cash = num / 100;
    var str = CommonFun.getInstance().numberToShow(cash);
    label.string = str.toString().replace(".", "x");
  },
  // 货币显示规范 超过100万显示为xx.xM 超过1000显示为xx.xK
  numberToShow2: function numberToShow2(number, entrycondition) {
    if (entrycondition == 0) {
      return number; // 如果 entrycondition 为 0，直接返回原数字
    }

    var coin = parseInt(number); // 将输入转换为整数
    if (isNaN(coin)) {
      return number; // 如果转换失败，返回原数字
    }

    if (coin >= 1000000) {
      // 大于等于 100 万，转换为 "M" 单位
      var tcoin1 = (coin / 1000000).toFixed(2); // 保留两位小数
      return tcoin1.replace(/\.?0+$/, '') + 'M'; // 去掉末尾的 0 和小数点
    } else if (coin >= 1000) {
      // 大于等于 1000，转换为 "K" 单位
      var tcoin2 = (coin / 1000).toFixed(1); // 保留一位小数
      return tcoin2.replace(/\.?0+$/, '') + 'K'; // 去掉末尾的 0 和小数点
    }

    return number; // 其他情况返回原数字
  },

  getStrLength: function getStrLength(str) {
    var realLength = 0,
      len = str.length,
      charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
    }
    return realLength;
  },
  getStrByLength: function getStrByLength(str, length) {
    var realLength = 0,
      len = str.length,
      charCode = -1;
    var newStr = "";
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
      newStr += str[i];
      if (realLength >= length) {
        if (i !== len - 1) newStr = newStr + "...";
        break;
      }
    }
    return newStr;
  },
  deleteLoginLocalStorage: function deleteLoginLocalStorage() {
    cc.sys.localStorage.removeItem("login_token");
    cc.sys.localStorage.removeItem("login_userid");
    GlobalCfg.USER_DATAS.userId = null;
    GlobalCfg.USER_DATAS.token = null;
  },
  showLabelLanguage: function showLabelLanguage(str, str1, str2) {
    var strName = '';
    for (var i = 0; i < dynamicChangeLabel.length; i++) {
      var arr = dynamicChangeLabel[i];
      var name = arr[1];
      if (name == str) {
        if (str.length > 0) {
          strName = arr[language];
        }
        if (str1) {
          strName = arr[language] + str1;
        }
        if (str2) {
          strName = arr[language] + str2;
        }
      }
    }
    return strName;
  },
  /**
   * 展示商城
   * @param {Boolean} isFromFirstRecharge 直接展示商城
   * @returns 
   */
  showNewShop: function showNewShop(isFromFirstRecharge, from) {
    if (from === void 0) {
      from = '';
    }
    if (GlobalCfg.IS_CLUB_MODE == 1) {
      //代理模式不跳转商城
      CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
      return;
    }
    if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
      CommonFun.getInstance().showMsgBox("Not yet open", "NO", function () {}, false);
      return;
    }
    ;
    // 首充 且 首充活动模块开关开启
    if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(10)) {
      // if (isFromFirstRecharge == true) {
      // 展示商城
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        this._showShop(from);
      } else {
        this.showBindPhone('AddCash');
      }
      // }
      // else {
      //     this.showFirstRecharge();
      // }
    } else {
      this._showShop(from);
    }
  },
  debounce: function debounce(action, delayTime) {
    if (!delayTime) {
      return action;
    }
    ;
    var fn = function fn() {
      var btnNode = arguments[0].node;
      if (!btnNode.timeOut && action) {
        action.apply(this, arguments);
        btnNode.timeOut = setTimeout(function () {
          if (btnNode) {
            clearTimeout(btnNode.timeOut);
            btnNode.timeOut = null;
          }
          ;
        }, delayTime * 1000);
      }
      ;
    };
    return fn;
  },
  getAllChildrensNodeList: function getAllChildrensNodeList(root, path, viewList) {
    if (viewList === void 0) {
      viewList = {};
    }
    for (var i = 0, len = root.childrenCount; i < len; i++) {
      viewList[path + root.children[i].name] = root.children[i];
      this.getAllChildrensNodeList(root.children[i], path + root.children[i].name + "/", viewList);
    }
    return viewList;
  },
  deepCopy: function deepCopy(o) {
    // 判断如果不是引用类型，直接返回数据即可
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
      return o;
    } else if (Array.isArray(o)) {
      // 如果是数组，则定义一个新数组，完成复制后返回
      // 注意，这里判断数组不能用typeof，因为typeof Array 返回的是object
      // LoggerUtil.getInstance().log(typeof [])  // --> object
      var _arr = [];
      o.forEach(function (item) {
        _arr.push(item);
      });
      return _arr;
    } else if (typeof o === 'object') {
      var _o = {};
      for (var key in o) {
        _o[key] = this.deepCopy(o[key]);
      }
      return _o;
    }
  },
  arrayBufferToBase64: function arrayBufferToBase64(array) {
    array = new Uint8Array(array);
    var length = array.byteLength;
    var table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
    var base64Str = '';
    var i = 0;
    for (i = 0; length - i >= 3; i += 3) {
      var num1 = array[i];
      var num2 = array[i + 1];
      var num3 = array[i + 2];
      base64Str += table[num1 >>> 2] + table[(num1 & 3) << 4 | num2 >>> 4] + table[(num2 & 15) << 2 | num3 >>> 6] + table[num3 & 63];
    }
    var lastByte = length - i;
    if (lastByte === 1) {
      var lastNum1 = array[i];
      base64Str += table[lastNum1 >>> 2] + table[(lastNum1 & 3) << 4] + '==';
    } else if (lastByte === 2) {
      var _lastNum = array[i];
      var lastNum2 = array[i + 1];
      base64Str += table[_lastNum >>> 2] + table[(_lastNum & 3) << 4 | lastNum2 >>> 4] + table[(lastNum2 & 15) << 2] + '=';
    }
    return base64Str;
  },
  localConvertWorldPointAR: function localConvertWorldPointAR(node) {
    if (!node) {
      return null;
    }
    ;
    return node.convertToWorldSpaceAR(cc.v2(0, 0));
  },
  localConvertWorldPoint: function localConvertWorldPoint(node) {
    if (!node) {
      return null;
    }
    return node.convertToWorldSpace(cc.v2(0, 0));
  },
  worldConvertLocalPointAR: function worldConvertLocalPointAR(node, worldPoint) {
    if (!node || !worldPoint) {
      return null;
    }
    return node.convertToNodeSpaceAR(worldPoint);
  },
  convertOtherNodeSpaceAR: function convertOtherNodeSpaceAR(node, targetNode) {
    if (!node || !targetNode) {
      return null;
    }
    var worldPos = this.localConvertWorldPointAR(node);
    return this.worldConvertLocalPointAR(targetNode, worldPos);
  },
  getCurTimeFormatByProof: function getCurTimeFormatByProof() {
    var nowdate = new Date();
    var month = nowdate.getMonth() + 1;
    var date = nowdate.getDate();
    var hour = nowdate.getHours();
    var minutes = nowdate.getMinutes();
    var seconds = nowdate.getSeconds();
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    ;
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    ;
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    ;
    return date + "/" + month + " " + hour + ":" + minutes + ":" + seconds;
  },
  /**
   * 加载预制体
   * @param {String} prefabPath 预制体路径
  */
  loadPrefabByPromise: function loadPrefabByPromise(prefabPath) {
    var _this3 = this;
    var arr = prefabPath.split("/");
    var bundleName = arr[0];
    var path = prefabPath.substring(bundleName.length + 1);
    LoggerUtil.getInstance().log("Loading prefab ===> " + prefabPath);
    var assetBundle = cc.assetManager.getBundle(bundleName);
    return new Promise(function (resolve, reject) {
      if (assetBundle) {
        assetBundle.load(path, cc.Prefab, function (error, prefab) {
          if (!error) {
            if (_this3._loadedPrefabMap.has(prefabPath) == false) {
              prefab.addRef();
              _this3._loadedPrefabMap.set(prefabPath, prefab);
            }
            ;
            resolve(prefab);
          } else {
            reject(error);
          }
          ;
        });
      } else {
        CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
          bundle.load(path, cc.Prefab, function (error, prefab) {
            if (!error) {
              if (_this3._loadedPrefabMap.has(prefabPath) == false) {
                prefab.addRef();
                _this3._loadedPrefabMap.set(prefabPath, prefab);
              }
              ;
              resolve(prefab);
            } else {
              reject(error);
            }
            ;
          });
        }, function (err) {
          reject(err);
        });
      }
      ;
    });
  },
  /**
   * 释放预制体及其资源
   * @param {String} prefabPath 预制体路径
   */
  releasePrefab: function releasePrefab(prefabPath) {
    if (this._loadedPrefabMap.has(prefabPath)) {
      var prefab = this._loadedPrefabMap.get(prefabPath);
      if (prefab) {
        this._loadedPrefabMap["delete"](prefabPath);
        prefab.decRef();
        prefab = null;
      }
      ;
    }
    ;
  },
  /**
   * 将指定的节点加入到指定的父节点
   * @param {cc.Node} child
   * @param {string} parentTag
   */
  addToPointParent: function addToPointParent(child, parentTag) {
    var parentNode = this.getLayerNode(parentTag);
    if (parentNode) {
      parentNode.addChild(child);
    }
    ;
  },
  /**
   * 将指定的LayerNode节点加入到layerNodeMap中
   * @param {string} tag
   * @param {cc.Node} layerNode
   */
  setLayerNode: function setLayerNode(tag, layerNode) {
    var has = this._layerNodeMap.has(tag);
    if (has) {
      this._layerNodeMap["delete"](tag);
    }
    ;
    this._layerNodeMap.set(tag, layerNode);
  },
  /**
   * 获取LayerNode节点
   * @param {string} tag
   * @returns 
   */
  getLayerNode: function getLayerNode(tag) {
    var layerNode = this._layerNodeMap.get(tag);
    return layerNode;
  },
  /**
   * 检测节点是否在父节点中
   * @param {string} path 节点路径
   * @param {*} parentTag 父节点Tag
   * @returns Boolean true:存在 false:不存在
   */
  checkNodeInParentNode: function checkNodeInParentNode(path, parentTag) {
    var parentNode = this.getLayerNode(parentTag);
    var arr = path.split("/");
    var nodeName = arr[arr.length - 1];
    if (parentNode.getChildByName(nodeName)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 显示提示框
   * @param {string} content 内容
   * @param {string} direction 方向
   */
  showTips: function showTips(content, direction) {
    var _this4 = this;
    if (direction === void 0) {
      direction = "horizontal";
    }
    var tipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TIPS);
    tipsPrefabPromise.then(function (prefab) {
      var tipsNode = cc.instantiate(prefab);
      tipsNode.angle = direction == "horizontal" ? 0 : -90;
      var tipsCtrl = tipsNode.getComponent('TipsCtrl');
      tipsCtrl.setContent(content);
      _this4.addToPointParent(tipsNode, GlobalCfg.PREFAB_PARENT.TIPS);
    });
  },
  proloadProgress: function proloadProgress() {
    var _this5 = this;
    return new Promise(function (resolve, reject) {
      var progressPrefabPromise = _this5.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROGRESS);
      progressPrefabPromise.then(function (prefab) {
        _this5._progressNode = cc.instantiate(prefab);
        _this5._progressNode.active = false;
        _this5.addToPointParent(_this5._progressNode, GlobalCfg.PREFAB_PARENT.PROGRESS);
        resolve();
      })["catch"](function () {
        reject();
      });
    });
  },
  /**
   * 显示进度框
   * @param {string} content 内容
   * @param {number} lastTime 持续时间
   */
  showProgress: function showProgress(content, lastTime) {
    var _this6 = this;
    if (lastTime === void 0) {
      lastTime = 15;
    }
    if (this._progressNode) {
      var progressCtrl = this._progressNode.getComponent('ProgressCtrl');
      progressCtrl.setContent(content);
      this._progressNode.active = true;
      this._progressTimer = setTimeout(function () {
        _this6.hidProgress();
      }, lastTime * 1000);
    }
    ;
  },
  /**
   * 隐藏进度框
   */
  hidProgress: function hidProgress() {
    clearTimeout(this._progressTimer);
    if (this._progressNode) {
      this._progressNode.active = false;
    }
    ;
  },
  /**
   * 显示消息框
   * @param {string} content 内容
   * @param {string} msgBoxType 类型
   * @param {function} callFun 回调函数
   * @param {boolean} isShowCloseBtn 是否显示关闭按钮
   * @param {boolean} isNet 是否是网络错误
   * @param {string} title 标题
   * @param {function} callFun2 回调函数
   */
  showMsgBox: function showMsgBox(content, msgBoxType, callFun, isShowCloseBtn, isNet, title, callFun2, horizontal, scale) {
    var _this7 = this;
    if (horizontal === void 0) {
      horizontal = cc.Label.HorizontalAlign.CENTER;
    }
    if (scale === void 0) {
      scale = 1;
    }
    var msgBoxPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.MSGBOX);
    msgBoxPrefabPromise.then(function (prefab) {
      var msgBoxNode = cc.instantiate(prefab);
      msgBoxNode.scale = scale;
      var msgBoxCtrl = msgBoxNode.getComponent('MsgBoxCtrl');
      msgBoxCtrl.setContent(content, msgBoxType, callFun, isShowCloseBtn, title, callFun2, horizontal);
      _this7.addToPointParent(msgBoxNode, GlobalCfg.PREFAB_PARENT.MSGBOX);
    });
  },
  /**
   * 显示设置界面
   */
  showSetting: function showSetting() {
    var _this8 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Setting", function () {
      var settingPrefabPromise = _this8.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SETTING);
      settingPrefabPromise.then(function (prefab) {
        var settingNode = cc.instantiate(prefab);
        _this8.addToPointParent(settingNode, GlobalCfg.PREFAB_PARENT.SETTING);
      });
    });
  },
  /**
   * 打开游戏列表界面
   */
  showGameIconList: function showGameIconList() {
    var _this9 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameIconList", function () {
      var PrefabPromise = _this9.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEICONLIST);
      PrefabPromise.then(function (prefab) {
        CommonFun.getInstance().addVerticalAcc();
        var Node = cc.instantiate(prefab);
        _this9.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.GAMEICONLIST);
      });
    });
  },
  /**
   * 小游戏中显示加金币
   * @param {string} gameName 游戏名称
   * @param {number} gameCoin 游戏底分
   */
  showSmallAddCash: function showSmallAddCash(gameName, gameCoin) {
    if (gameName === void 0) {
      gameName = null;
    }
    if (gameCoin === void 0) {
      gameCoin = null;
    }
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        this.showNewShop();
      } else {
        // CommonFun.getInstance().showFirstRecharge();
        this.showBindPhone('AddCash');
      }
      ;
    } else {
      this.showNewShop();
    }
    ;
  },
  /**
   * 小游戏中显示加经验
   */
  showSmallAddExperience: function showSmallAddExperience() {
    var _this10 = this;
    var smallAddExperiencePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SMALLADDEXPERIENCE);
    smallAddExperiencePrefabPromise.then(function (prefab) {
      var smallAddExperienceNode = cc.instantiate(prefab);
      var smallAddExperienceCtrl = smallAddExperienceNode.getComponent('SmallAddExperienceCtrl');
      _this10.addToPointParent(smallAddExperienceNode, GlobalCfg.PREFAB_PARENT.SMALLADDEXPERIENCE);
    });
  },
  /**
   * 小游戏中显示用户头像
   * @param {string} headUrl 用户头像地址
   * @param {string} playerName 用户昵称
   * @param {number} playerCoin 用户金币
   * @param {boolean} trial 是否是体验用户
   */
  showUserIU: function showUserIU(headUrl, playerName, playerCoin, trial) {
    var _this11 = this;
    if (headUrl === void 0) {
      headUrl = "";
    }
    if (playerName === void 0) {
      playerName = "";
    }
    if (playerCoin === void 0) {
      playerCoin = 0;
    }
    if (trial === void 0) {
      trial = true;
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("UserHead", function () {
      var userHeadPrefabPromise = _this11.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.USERHEAD);
      userHeadPrefabPromise.then(function (prefab) {
        var userHeadNode = cc.instantiate(prefab);
        var userHeadCtrl = userHeadNode.getComponent('UserHeadCtrl');
        userHeadCtrl.setUserDate(headUrl, playerName, playerCoin, trial);
        _this11.addToPointParent(userHeadNode, GlobalCfg.PREFAB_PARENT.USERHEAD);
      });
    });
  },
  /**
   * 显示金币散落动画
   */
  scatterGoldCoinsAim: function scatterGoldCoinsAim() {
    var _this12 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("ScatterCoin", function () {
      var scatterCoinPrefabPromise = _this12.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SCATTERCOIN);
      scatterCoinPrefabPromise.then(function (prefab) {
        var scatterCoinNode = cc.instantiate(prefab);
        var scatterCoinCtrl = scatterCoinNode.getComponent('ScatterCoinCtrl');
        _this12.addToPointParent(scatterCoinNode, GlobalCfg.PREFAB_PARENT.SCATTERCOIN);
      });
    });
  },
  /**
   * 显示领取奖励提示界面，点击领取按钮默认播放撒金币特效
   * @param {Array[{id,amount}]} coin 奖励金币
   */
  showRewardsTips: function showRewardsTips(coin) {
    var _this13 = this;
    var count = 0;
    for (var i = 0; i < coin.length; i++) {
      count += coin[i].amount;
    }
    if (count <= 0) {
      return;
    }
    var rewardsTipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.REWARDSTIPS);
    rewardsTipsPrefabPromise.then(function (prefab) {
      CommonFun.getInstance().scatterGoldCoinsAim();
      var rewardsTipsNode = cc.instantiate(prefab);
      var rewardsTipsCtrl = rewardsTipsNode.getComponent('RewardsTipsCtrl');
      rewardsTipsCtrl.setRewards(coin);
      _this13.addToPointParent(rewardsTipsNode, GlobalCfg.PREFAB_PARENT.REWARDSTIPS);
    });
  },
  /**
   * 发送文字，微表情
   * @param {string} notify 服务器下发的信息
   * @param {cc.Vec2} pos 位置
   */
  sendFace: function sendFace(notify, pos) {
    var _this14 = this;
    var chatActPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHATACT);
    chatActPrefabPromise.then(function (prefab) {
      var chatActNode = cc.instantiate(prefab);
      var chatActCtrl = rewardsTipsNode.getComponent('ChatActCtrl');
      chatActCtrl.face(notify, pos);
      _this14.addToPointParent(chatActNode, GlobalCfg.PREFAB_PARENT.CHATACT);
    });
  },
  /**
   * 显示活动界面
   */
  showActivity: function showActivity(pointView) {
    var _this15 = this;
    if (pointView === void 0) {
      pointView = null;
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Activity", function () {
      var activityPrefabPromise = _this15.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY);
      activityPrefabPromise.then(function (prefab) {
        var activityNode = cc.instantiate(prefab);
        var activityCtrl = activityNode.getComponent('ActivityCtrl');
        pointView && activityCtrl.setPointView(pointView);
        _this15.addToPointParent(activityNode, GlobalCfg.PREFAB_PARENT.ACTIVITY);
      });
    });
  },
  /**
   * 显示首充界面
   */
  showFirstRecharge: function showFirstRecharge() {
    var _this16 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("FirstRecharge", function () {
      var path = GlobalCfg.PREFAB_PATH.FIRSTRECHARGE;
      if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
        path = GlobalCfg.PREFAB_PATH.FIRSTRECHARGE_V;
      }
      var firstRechargePrefabPromise = _this16.loadPrefabByPromise(path);
      firstRechargePrefabPromise.then(function (prefab) {
        var firstRechargeNode = cc.instantiate(prefab);
        var firstRechargeCtrl = firstRechargeNode.getComponent('FirstRechargeCtrl');
        _this16.addToPointParent(firstRechargeNode, GlobalCfg.PREFAB_PARENT.FIRSTRECHARGE);
      });
    });
  },
  /**
   * 显示诱导充值界面
   */
  showInducement: function showInducement() {
    var _this17 = this;
    var isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.INDUCEMENT, GlobalCfg.PREFAB_PARENT.INDUCEMENT);
    if (isExist) {
      return;
    }
    ;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Inducement", function () {
      var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/GetInfo";
      CommonFun.getInstance().httpPost(httpUrl, {}, function (msg) {
        if (msg.result == 0) {
          GlobalCfg.USER_DATAS.inducement = msg.data;
          var prefabPromise = _this17.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.INDUCEMENT);
          prefabPromise.then(function (prefab) {
            var node = cc.instantiate(prefab);
            _this17.addToPointParent(node, GlobalCfg.PREFAB_PARENT.INDUCEMENT);
          });
        }
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  /**
   * 显示联系我们界面
   */
  showContactUs: function showContactUs() {
    var _this18 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("ContactUs", function () {
      var contactUsPrefabPromise = _this18.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CONTACTUS);
      contactUsPrefabPromise.then(function (prefab) {
        var contactUsNode = cc.instantiate(prefab);
        var contactUsCtrl = contactUsNode.getComponent('ContactUsCtrl');
        _this18.addToPointParent(contactUsNode, GlobalCfg.PREFAB_PARENT.CONTACTUS);
      });
    });
  },
  /**
   * 显示内嵌网页界面
   */
  showGameWebview: function showGameWebview(gameId, isVertical) {
    var _this19 = this;
    if (GlobalCfg.USER_DATAS.isNotCharge == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        CommonFun.getInstance().showSmallAddCash();
      }, false);
      return;
    }
    ;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/pg/game_url";
    var httpParam = {
      game_id: gameId
    };
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
      if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        APPManager.showWebView(msg.data.Url, isVertical);
      } else {
        var PrefabPromise = _this19.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWEBVIEW);
        PrefabPromise.then(function (prefab) {
          var Node = cc.instantiate(prefab);
          var Ctrl = Node.getComponent('gameWebview');
          Ctrl.setURL(msg.data.Url);
          _this19.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.CONTACTUS);
        });
      }
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  /**
   * 获取俱乐部信息
   */
  getClubData: function getClubData(callback) {
    CommonFun.getInstance().showProgress();
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/club/get_club_info";
    CommonFun.getInstance().httpPost(httpUrl, {}, function (msg) {
      CommonFun.getInstance().hidProgress();
      if (msg.result == 0) {
        GlobalCfg.USER_DATAS.clubInfo = msg.data;
        callback && callback();
      }
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  /**
   * 打开钱包
   */
  showWalletPanel: function showWalletPanel() {
    var _this20 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("wallet", function () {
      _this20.getClubData(function () {
        var prefabPromise = _this20.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WALLET);
        prefabPromise.then(function (prefab) {
          var Node = cc.instantiate(prefab);
          _this20.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.WALLET);
        });
      });
    });
  },
  /**
   * 打开俱乐部
   */
  showClub: function showClub() {
    var _this21 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("club", function () {
      _this21.getClubData(function () {
        var prefabPromise = _this21.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CLUB);
        prefabPromise.then(function (prefab) {
          var Node = cc.instantiate(prefab);
          _this21.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.CLUB);
        });
      });
    });
  },
  /**
   * 添加跑马灯
   */
  addCarouselStrip: function addCarouselStrip() {
    var _this22 = this;
    this.removeCarouselStrip();
    var carouselStripPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CAROUSELSTRIP);
    carouselStripPrefabPromise.then(function (prefab) {
      var carouselStripNode = cc.instantiate(prefab);
      var carouselStripCtrl = carouselStripNode.getComponent('CarouselStripCtrl');
      _this22.addToPointParent(carouselStripNode, GlobalCfg.PREFAB_PARENT.CAROUSELSTRIP);
    });
  },
  /**
   * 删除跑马灯
   */
  removeCarouselStrip: function removeCarouselStrip() {
    try {
      var parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.CAROUSELSTRIP);
      var children = parentNode.children;
      for (var i = 0, len = children.length; i < len; i++) {
        var node = children[i];
        node.destroy();
      }
      ;
    } catch (error) {}
    ;
  },
  /**
   * 添加侧边栏
   */
  addSidebar: function addSidebar() {
    var _this23 = this;
    var node = this.getSidebar();
    if (node) {
      return;
    }
    var sideBarPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SIDEBAR);
    sideBarPrefabPromise.then(function (prefab) {
      var sideBarNode = cc.instantiate(prefab);
      var activityModulesCtrl = sideBarNode.getComponent('activityModulesCtrl');
      _this23.addToPointParent(sideBarNode, GlobalCfg.PREFAB_PARENT.SIDEBAR);
    });
  },
  /**
   * 删除侧边栏
   */
  removeSidebar: function removeSidebar() {
    var node = this.getSidebar();
    if (node) {
      node.destroy();
    }
  },
  /**
   * 更新侧边栏数据
   * @param {Boolean} bool 是否展开
   */
  updateSidebarData: function updateSidebarData(bool) {
    var node = this.getSidebar();
    if (node) {
      var activityModulesCtrl = node.getComponent('activityModulesCtrl');
      activityModulesCtrl.setShowState(bool);
      activityModulesCtrl.checkActivity();
    }
  },
  /**
   * 隐藏侧边栏
   */
  hideSidebarData: function hideSidebarData() {
    var node = this.getSidebar();
    if (node) {
      var activityModulesCtrl = node.getComponent('activityModulesCtrl');
      activityModulesCtrl.setHideActivity();
    }
    ;
  },
  getSidebar: function getSidebar() {
    var resultNode = null;
    var name = GlobalCfg.PREFAB_PATH.SIDEBAR.split("/").pop();
    var parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.SIDEBAR);
    var children = parentNode.children;
    for (var i = 0, len = children.length; i < len; i++) {
      var node = children[i];
      if (node.name == name) {
        resultNode = node;
        break;
      }
    }
    ;
    return resultNode;
  },
  /**
   * 显示评分界面
   */
  showRateUs: function showRateUs() {
    var _this24 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("rateUs", function () {
      var rateUsPrefabPromise = _this24.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RATEUS);
      rateUsPrefabPromise.then(function (prefab) {
        var rateUsNode = cc.instantiate(prefab);
        var rateUsCtrl = rateUsNode.getComponent('RateUsCtrl');
        _this24.addToPointParent(rateUsNode, GlobalCfg.PREFAB_PARENT.RATEUS);
      });
    });
  },
  /**
   * 显示绑定手机奖励界面
   */
  showBindPhoneRewards: function showBindPhoneRewards() {
    var _this25 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("bindPhoneRewards", function () {
      var bindPhoneRewardsPrefabPromise = _this25.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BINDPHONEREWARDS);
      bindPhoneRewardsPrefabPromise.then(function (prefab) {
        var bindPhoneRewardsNode = cc.instantiate(prefab);
        var bindPhoneRewardsCtrl = bindPhoneRewardsNode.getComponent('BindPhoneRewardsCtrl');
        _this25.addToPointParent(bindPhoneRewardsNode, GlobalCfg.PREFAB_PARENT.BINDPHONEREWARDS);
      });
    });
  },
  /**
   * 强制引导弹窗
   */
  showHallTip: function showHallTip() {
    var _this26 = this;
    LoggerUtil.getInstance().log("showHallTip GlobalCfg.Forced_Migration: ", GlobalCfg.Forced_Migration);
    // //需求：强制引导用户点击跳转
    var NeedShowForceVersion = cc.sys.localStorage.getItem("NeedShowForceVersion");
    if (NeedShowForceVersion == null) {
      NeedShowForceVersion = 0;
    }
    LoggerUtil.getInstance().log("showHallTip NeedShowForceVersion: ", NeedShowForceVersion);
    var packageChannel = cc.sys.localStorage.getItem("PackageChannel");
    var Channel = "";
    if (packageChannel && packageChannel.indexOf("_") != -1) {
      var packageChannelArr = packageChannel.split("_");
      Channel = Number(packageChannelArr[1]);
    }
    LoggerUtil.getInstance().log("showHallTip Channel: ", Channel);
    if (GlobalCfg.Forced_Migration && Channel != "") {
      var data = GlobalCfg.Forced_Migration[Channel]; //指定渠道号
      LoggerUtil.getInstance().log("showHallTip data: ", data);
      if (data && data.version >= NeedShowForceVersion) {
        //低于服务器设定的需要弹窗的版本号 则弹窗
        var hallTipPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.HALLTIP);
        hallTipPrefabPromise.then(function (prefab) {
          var bhallTipNode = cc.instantiate(prefab);
          var bhallTipCtrl = bhallTipNode.getComponent('HallTipCtrl');
          bhallTipCtrl.setHallTipData(data);
          _this26.addToPointParent(bhallTipNode, GlobalCfg.PREFAB_PARENT.HALLTIP);
        });
      }
    }
  },
  /**
   * 显示绑定手机界面
   * @param {String} str  Lobby (大厅) Personal (个人中心) AddCash (充值填写) 
   */
  showBindPhone: function showBindPhone(str) {
    var _this27 = this;
    if (str === void 0) {
      str = 'Lobby';
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("bindPhone", function () {
      var bindPhonePrefabPromise = _this27.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BINDPHONE);
      bindPhonePrefabPromise.then(function (prefab) {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MOBILE_VIEW);
        var bindPhoneNode = cc.instantiate(prefab);
        var bindPhoneCtrl = bindPhoneNode.getComponent('BindPhoneCtrl');
        bindPhoneCtrl.setNodeStateStr(str);
        _this27.addToPointParent(bindPhoneNode, GlobalCfg.PREFAB_PARENT.BINDPHONE);
      });
    });
  },
  /**
   * 显示推广员界面
   */
  showPromoter: function showPromoter() {
    var _this28 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("promoter", function () {
      var promoterPrefabPromise = _this28.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTER);
      promoterPrefabPromise.then(function (prefab) {
        var promoterNode = cc.instantiate(prefab);
        var promoterCtrl = promoterNode.getComponent('PromoterCtrl');
        _this28.addToPointParent(promoterNode, GlobalCfg.PREFAB_PARENT.PROMOTER);
      });
    });
  },
  // /**
  //  * 显示推广员界面
  //  */
  // showPromoter: function() {
  //     CommonFun.getInstance().showProgress();
  //     let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/layerincomerank";
  //     CommonFun.getInstance().httpGet(httpUrl, (msg) => {

  //         if (msg.result == 0) {
  //             GlobalCfg.USER_DATAS.promoterMainData = msg.data
  //             let promoterPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
  //             promoterPrefabPromise.then((prefab) => {
  //                 let promoterNode = cc.instantiate(prefab);
  //                 this.addToPointParent(promoterNode, GlobalCfg.PREFAB_PARENT.PROMOTERMAIN);  
  //                 CommonFun.getInstance().hidProgress();
  //             });
  //         }
  //         else {
  //             CommonFun.getInstance().showTips(msg.msg);
  //             CommonFun.getInstance().hidProgress();
  //         }
  //     }, null, GlobalCfg.USER_DATAS.BearerToken);
  // },
  /**
   * 推广员界面分享
   */
  promoterSkipToOtherApp: function promoterSkipToOtherApp(btnName) {
    var inviteCode = "?inviteCode=" + GlobalCfg.CHANNEL_INFO + "_" + GlobalCfg.USER_DATAS.inviteCode;
    var shareStrtmp = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！";
    var shareUrls = GlobalCfg.APP_SHARE_URL + inviteCode;
    if (btnName == 'btn_telegram') {
      var str = "https://t.me/share/url?text=" + encodeURIComponent(shareStrtmp) + "&url=" + encodeURIComponent(shareUrls);
      cc.sys.openURL(str);
    }
    if (btnName == 'btn_fb') {
      var _str = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrls);
      LoggerUtil.getInstance().log("promoterSkipToOtherApp shareStr", _str);
      cc.sys.openURL(_str);
    }
    if (btnName == 'btn_whatsapp') {
      var _str2 = "https://wa.me/?text=" + encodeURIComponent(shareStrtmp + "    " + shareUrls);
      cc.sys.openURL(_str2);
    }
    if (btnName == 'btn_share') {
      var shareUrl = "Your cash will expire in three hours, download the No.1 card game in India to receive your cash, do not let it go\uFF01 " + GlobalCfg.APP_SHARE_URL + "?inviteCode=" + GlobalCfg.CHANNEL_INFO + "_" + GlobalCfg.USER_DATAS.inviteCode;
      APPManager.copyToPasteBoard(shareUrl);
      CommonFun.getInstance().showTips("Copy successful!");
      APPManager.Share(shareUrl);
    }
  },
  /**
   * 显示推广员左侧界面
   * @param {string} typeStr 显示类型
   */
  showPromoterLeftView: function showPromoterLeftView(typeStr) {
    var _this29 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("promoter", function () {
      var promoterLeftViewPrefabPromise = _this29.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTERLEFTVIEW);
      promoterLeftViewPrefabPromise.then(function (prefab) {
        var promoterLeftViewNode = cc.instantiate(prefab);
        var promoterLeftViewCtrl = promoterLeftViewNode.getComponent('PromoterLeftViewCtrl');
        promoterLeftViewCtrl.showLeftViewByTypeStr(typeStr);
        _this29.addToPointParent(promoterLeftViewNode, GlobalCfg.PREFAB_PARENT.PROMOTERLEFTVIEW);
      });
    });
  },
  /**
   * 显示救济金界面
   */
  showRelief: function showRelief() {
    var _this30 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("relief", function () {
      var reliefPrefabPromise = _this30.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RELIEF);
      reliefPrefabPromise.then(function (prefab) {
        var reliefNode = cc.instantiate(prefab);
        var reliefCtrl = reliefNode.getComponent('ReliefCtrl');
        _this30.addToPointParent(reliefNode, GlobalCfg.PREFAB_PARENT.RELIEF);
      });
    });
  },
  /**
   * 显示邮箱界面
   */
  showEmail: function showEmail() {
    var _this31 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Email", function () {
      var emailPrefabPromise = _this31.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.EMAIL);
      emailPrefabPromise.then(function (prefab) {
        var emailNode = cc.instantiate(prefab);
        var emailCtrl = emailNode.getComponent('EmailCtrl');
        _this31.addToPointParent(emailNode, GlobalCfg.PREFAB_PARENT.EMAIL);
      });
    });
  },
  /**
   * 显示反馈邮件界面
   */
  showFeedbackMail: function showFeedbackMail(dataContent, emailCtrl) {
    var _this32 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Feedback", function () {
      var feedbackMailPrefabPromise = _this32.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FEEDBACKEMAIL);
      feedbackMailPrefabPromise.then(function (prefab) {
        var feedbackMailNode = cc.instantiate(prefab);
        var feedbackMailCtrl = feedbackMailNode.getComponent('FeedbackMailCtrl');
        feedbackMailCtrl.setState(dataContent, emailCtrl);
        _this32.addToPointParent(feedbackMailNode, GlobalCfg.PREFAB_PARENT.FEEDBACKEMAIL);
      });
    });
  },
  /**
   * 显示超级折扣界面
   */
  showSuperDiscount: function showSuperDiscount() {
    var _this33 = this;
    var isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT, GlobalCfg.PREFAB_PARENT.SUPERDISCOUNT);
    if (isExist) {
      return;
    }
    ;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("SuperDiscount", function () {
      var superDiscountPrefabPromise = _this33.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT);
      superDiscountPrefabPromise.then(function (prefab) {
        var superDiscountNode = cc.instantiate(prefab);
        var superDiscountCtrl = superDiscountNode.getComponent('SuperDiscountCtrl');
        superDiscountCtrl.initByType();
        _this33.addToPointParent(superDiscountNode, GlobalCfg.PREFAB_PARENT.SUPERDISCOUNT);
      });
    });
  },
  /**
   * 显示客服界面
   */
  showCustomerService: function showCustomerService() {
    var _this34 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("CustomerService", function () {
      var customerServicePrefabPromise = _this34.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CUSTOMERSERVICE);
      customerServicePrefabPromise.then(function (prefab) {
        var customerServiceNode = cc.instantiate(prefab);
        var customerServiceCtrl = customerServiceNode.getComponent('CustomerServiceCtrl');
        _this34.addToPointParent(customerServiceNode, GlobalCfg.PREFAB_PARENT.CUSTOMERSERVICE);
      });
    });
  },
  /**
   * 显示快速反馈界面
   */
  showFastFeedBack: function showFastFeedBack() {
    var _this35 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("FastFeedBack", function () {
      var fastFeedBackPrefabPromise = _this35.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FASTFEEDBACK);
      fastFeedBackPrefabPromise.then(function (prefab) {
        var fastFeedBackNode = cc.instantiate(prefab);
        var fastFeedBackCtrl = fastFeedBackNode.getComponent('FastFeedBackCtrl');
        _this35.addToPointParent(fastFeedBackNode, GlobalCfg.PREFAB_PARENT.FASTFEEDBACK);
      });
    });
  },
  /**
   * 显示个人中心界面
   */
  showPersonal: function showPersonal() {
    var _this36 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Personal", function () {
      _this36.getClubData(function () {
        var personalPrefabPromise = _this36.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PERSONAL);
        personalPrefabPromise.then(function (prefab) {
          var personalNode = cc.instantiate(prefab);
          var personalCtrl = personalNode.getComponent('PersonalCtrl');
          _this36.addToPointParent(personalNode, GlobalCfg.PREFAB_PARENT.PERSONAL);
        });
      });
    });
  },
  /**
   * 显示个人中心修改昵称界面
   */
  showChangeName: function showChangeName() {
    var _this37 = this;
    var changeNamePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGENAME);
    changeNamePrefabPromise.then(function (prefab) {
      var changeNameNode = cc.instantiate(prefab);
      var changeNameCtrl = changeNameNode.getComponent('ChangeNameCtrl');
      _this37.addToPointParent(changeNameNode, GlobalCfg.PREFAB_PARENT.CHANGENAME);
    });
  },
  /**
   * 显示个人中心修改头像界面
   */
  showChangeHead: function showChangeHead() {
    var _this38 = this;
    var changeHeadPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGEHEAD);
    changeHeadPrefabPromise.then(function (prefab) {
      var changeHeadNode = cc.instantiate(prefab);
      var changeHeadCtrl = changeHeadNode.getComponent('ChangeHeadCtrl');
      _this38.addToPointParent(changeHeadNode, GlobalCfg.PREFAB_PARENT.CHANGEHEAD);
    });
  },
  /**
   * 显示奖励转移界面
   */
  showBonusTransfer: function showBonusTransfer() {
    var _this39 = this;
    var bonusTransferPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BONUSTRANSFER);
    bonusTransferPrefabPromise.then(function (prefab) {
      var bonusTransferNode = cc.instantiate(prefab);
      var bonusTransferCtrl = bonusTransferNode.getComponent('BonusTransferCtrl');
      _this39.addToPointParent(bonusTransferNode, GlobalCfg.PREFAB_PARENT.BONUSTRANSFER);
    });
  },
  /**
   * 预加载选择房间界面
   */
  proloadSelectRoom: function proloadSelectRoom() {
    var _this40 = this;
    return new Promise(function (resolve, reject) {
      var selectRoomPrefabPromise = _this40.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SELECTROOM);
      selectRoomPrefabPromise.then(function (prefab) {
        _this40._selectRoomNode = cc.instantiate(prefab);
        _this40._selectRoomNode.active = false;
        _this40.addToPointParent(_this40._selectRoomNode, GlobalCfg.PREFAB_PARENT.SELECTROOM);
        resolve();
      })["catch"](function () {
        reject();
      });
    });
  },
  /**
   * 显示选择房间界面
   */
  showSelectRoom: function showSelectRoom() {
    if (this._selectRoomNode) {
      CommonFun.getInstance().updateSidebarData(false);
      var selectRoomCtrl = this._selectRoomNode.getComponent('selectRoomCtrl');
      this._selectRoomNode.active = true;
      if (selectRoomCtrl) {
        selectRoomCtrl && selectRoomCtrl.showPointGameRoom();
      } else {
        LoggerUtil.getInstance().log("3333333333 selectRoomCtrl is null");
      }
    }
    ;
  },
  /**
   * 隐藏选择房间界面
   */
  hideSelectRoom: function hideSelectRoom() {
    if (this._selectRoomNode) {
      CommonFun.getInstance().updateSidebarData(true);
      this._selectRoomNode.active = false;
    }
    ;
  },
  /**
   * 显示每日奖励卡片
   */
  showDailyBonusCard: function showDailyBonusCard() {
    var _this41 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("dailyBonusCard", function () {
      var dailyBonusCardPrefabPromise = _this41.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.DAILYBONUSCARD);
      dailyBonusCardPrefabPromise.then(function (prefab) {
        var dailyBonusCardNode = cc.instantiate(prefab);
        var dailyBonusCardCtrl = dailyBonusCardNode.getComponent('DailyBonusCardCtrl');
        _this41.addToPointParent(dailyBonusCardNode, GlobalCfg.PREFAB_PARENT.DAILYBONUSCARD);
      });
    });
  },
  /**
   * 显示新人礼品界面
   */
  showFirstGiftDiamond: function showFirstGiftDiamond() {
    var _this42 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("firstGiftDiamond", function () {
      var firstGiftDiamondPrefabPromise = _this42.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FIRSTGIFTDIAMOND);
      firstGiftDiamondPrefabPromise.then(function (prefab) {
        var firstGiftDiamondNode = cc.instantiate(prefab);
        var firstGiftDiamondCtrl = firstGiftDiamondNode.getComponent('FirstGiftDiamondCtrl');
        _this42.addToPointParent(firstGiftDiamondNode, GlobalCfg.PREFAB_PARENT.FIRSTGIFTDIAMOND);
      });
    });
  },
  /**
   * 显示规则界面
   * @param {string} typeStr 
   */
  showRule: function showRule(typeStr) {
    var _this43 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Rule", function () {
      var rulePrefabPromise = _this43.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RULE);
      rulePrefabPromise.then(function (prefab) {
        var ruleNode = cc.instantiate(prefab);
        var ruleCtrl = ruleNode.getComponent('RuleCtrl');
        ruleCtrl.SmallGameRule(typeStr);
        _this43.addToPointParent(ruleNode, GlobalCfg.PREFAB_PARENT.RULE);
      });
    });
  },
  /**
   * 显示隐私政策/隐私政策界面
   * @param {number} urlType 1: 用户协议 2: 隐私政策
   */
  showPrivacyPolicy: function showPrivacyPolicy(urlType) {
    var _this44 = this;
    var privacyPolicyPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PRIVACYPOLICY);
    privacyPolicyPrefabPromise.then(function (prefab) {
      var privacyPolicyNode = cc.instantiate(prefab);
      var privacyPolicyCtrl = privacyPolicyNode.getComponent('PrivacyPolicyCtrl');
      privacyPolicyCtrl.setUrlType(urlType);
      _this44.addToPointParent(privacyPolicyNode, GlobalCfg.PREFAB_PARENT.PRIVACYPOLICY);
    });
  },
  _showShop: function _showShop(from) {
    var _this45 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Shop", function () {
      _this45.getPayChannel(function (payData) {
        var shopPrefabPromise = _this45.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOP);
        shopPrefabPromise.then(function (prefab) {
          CommonFun.getInstance().addVerticalAcc();
          var shopNode = cc.instantiate(prefab);
          var shopCtrl = shopNode.getComponent("ShopCtrl");
          shopCtrl.setPayChannel(payData);
          shopCtrl.setJumpFrom(from);
          _this45.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOP);
        });
      });
    });
  },
  showPayChannel: function showPayChannel(infos, callback) {
    var _this46 = this;
    LoggerUtil.getInstance().log('callback =', callback);
    this.getPayChannel(function (payData) {
      var shopPrefabPromise = _this46.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPCHANNEL);
      shopPrefabPromise.then(function (prefab) {
        var shopNode = cc.instantiate(prefab);
        var shopChannel = shopNode.getComponent("shopChannel");
        shopChannel.setData(payData, infos, callback);
        _this46.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPCHANNEL);
      });
    });
  },
  _showShopNewTip: function _showShopNewTip(changed, coin, bonus, is10Precent, remind) {
    var _this47 = this;
    LoggerUtil.getInstance().error('changed:' + changed + ' coin:' + coin + ' bonus:' + bonus);
    if (is10Precent) {
      var shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPNEWTIP10);
      shopPrefabPromise.then(function (prefab) {
        var shopNode = cc.instantiate(prefab);
        var shopCtrl = shopNode.getComponent("ShopNewTip10Ctrl");
        shopCtrl.setStartCoin(changed, coin, bonus, remind);
        _this47.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPNEWTIP10);
      });
    } else {
      var _shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPNEWTIP);
      _shopPrefabPromise.then(function (prefab) {
        var shopNode = cc.instantiate(prefab);
        var shopCtrl = shopNode.getComponent("ShopNewTipCtrl");
        shopCtrl.setStartCoin(changed, coin, bonus);
        _this47.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPNEWTIP);
      });
    }
  },
  /**
   * 显示充值说明界面
   */
  showShopInstructions: function showShopInstructions() {
    var _this48 = this;
    var shopInstructionsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPINSTRUCTIONS);
    shopInstructionsPrefabPromise.then(function (prefab) {
      var shopInstructionsNode = cc.instantiate(prefab);
      _this48.addToPointParent(shopInstructionsNode, GlobalCfg.PREFAB_PARENT.SHOPINSTRUCTIONS);
    });
  },
  /**
   * 展示提现界面
   * @param {Function} callback 
   */
  showWithDraw: function showWithDraw(callback) {
    var _this49 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Withdraw", function () {
      var withdrawPrefabPromise = _this49.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAW);
      withdrawPrefabPromise.then(function (prefab) {
        CommonFun.getInstance().addVerticalAcc();
        var withdrawNode = cc.instantiate(prefab);
        callback && callback();
        _this49.addToPointParent(withdrawNode, GlobalCfg.PREFAB_PARENT.WITHDRAW);
      });
    });
  },
  /**
   * 展示提现界面回调的提示框
   * @param {string} btnTipsType
   * @param {string} content 
   * @param {Function} callFun 
   */
  showWithDrawTips: function showWithDrawTips(btnTipsType, content, callFun) {
    var _this50 = this;
    var withdrawTipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWTIPS);
    withdrawTipsPrefabPromise.then(function (prefab) {
      var withDrawTipsNode = cc.instantiate(prefab);
      var withDrawTipsCtrl = withDrawTipsNode.getComponent("WithDrawTipsCtrl");
      withDrawTipsCtrl.setWithDrawTipsData(btnTipsType, content, callFun);
      _this50.addToPointParent(withDrawTipsNode, GlobalCfg.PREFAB_PARENT.WITHDRAWTIPS);
    });
  },
  /**
   * 显示交易记录界面
   */
  showTransactionRecord: function showTransactionRecord() {
    var _this51 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", function () {
      var transactionRecordPrefabPromise = _this51.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORD);
      transactionRecordPrefabPromise.then(function (prefab) {
        CommonFun.getInstance().addVerticalAcc();
        var transactionRecordNode = cc.instantiate(prefab);
        _this51.addToPointParent(transactionRecordNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORD);
      });
    });
  },
  /**
   * 显示交易记录界的说明提示框
   */
  showTransactionRecordTips: function showTransactionRecordTips() {
    var _this52 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", function () {
      var transactionRecordTipsPrefabPromise = _this52.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDTIPS);
      transactionRecordTipsPrefabPromise.then(function (prefab) {
        var transactionRecordTipsNode = cc.instantiate(prefab);
        _this52.addToPointParent(transactionRecordTipsNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORDTIPS);
      });
    });
  },
  /**
   * 显示交易记录界面的“help”提示框
   */
  showTransactionRecordHelp: function showTransactionRecordHelp(data) {
    var _this53 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", function () {
      var transactionRecordHelpPrefabPromise = _this53.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDHELP);
      transactionRecordHelpPrefabPromise.then(function (prefab) {
        var transactionRecordHelpNode = cc.instantiate(prefab);
        var transactionRecordHelpCtrl = transactionRecordHelpNode.getComponent('TransactionRecordHelpCtrl');
        transactionRecordHelpCtrl.setTransactionRecordHelpData(data);
        _this53.addToPointParent(transactionRecordHelpNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORDHELP);
      });
    });
  },
  /**
   * 显示提现诱导弹框
   */
  showPopUpWithDraw: function showPopUpWithDraw() {
    var _this54 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("PopUpWithDraw", function () {
      var popUpWithDrawPrefabPromise = _this54.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.POPUPWITHDRAW);
      popUpWithDrawPrefabPromise.then(function (prefab) {
        var popUpWithDrawNode = cc.instantiate(prefab);
        _this54.addToPointParent(popUpWithDrawNode, GlobalCfg.PREFAB_PARENT.POPUPWITHDRAW);
      });
    });
  },
  /**
   * 展示填写提现资料界面
   */
  showWithDrawPreData: function showWithDrawPreData() {
    var _this55 = this;
    this.showProgress();
    var withdrawPreDataPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWPREDATA);
    withdrawPreDataPrefabPromise.then(function (prefab) {
      var withdrawalPreDataNode = cc.instantiate(prefab);
      var data = GlobalCfg.USER_DATAS.transferAddress;
      var withDrawPreDataCtrl = withdrawalPreDataNode.getComponent('WithDrawPreDataCtrl');
      withDrawPreDataCtrl.setData(data);
      _this55.addToPointParent(withdrawalPreDataNode, GlobalCfg.PREFAB_PARENT.WITHDRAWPREDATA);
      _this55.hidProgress();
    });
  },
  /**
   * 展示提现错误弹窗提示
   * @param {Object} data { }
   */
  showWithDrawError: function showWithDrawError(data) {
    var _this56 = this;
    var orderId = data.orderId;
    var amount = Number(data.amount);
    var createTime = Number(data.createTime);
    var func = function func(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return year + "/" + month + "/" + day + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    };
    var time = func(createTime * 1000);
    var msg = data.errMsg;
    var withdrawPreDataPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWERRORTIPS);
    withdrawPreDataPrefabPromise.then(function (prefab) {
      var withDrawErrorTipsNode = cc.instantiate(prefab);
      var WithDrawErrorTipsCtrl = withDrawErrorTipsNode.getComponent("WithDrawErrorTipsCtrl");
      WithDrawErrorTipsCtrl.setErrData(orderId, amount, time, msg);
      _this56.addToPointParent(withDrawErrorTipsNode, GlobalCfg.PREFAB_PARENT.WITHDRAWERRORTIPS);
    });
  },
  /**
   * 展示提现分享界面
   */
  showWithDrawShare: function showWithDrawShare() {
    var _this57 = this;
    var withdrawSharePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWSHARE);
    withdrawSharePrefabPromise.then(function (prefab) {
      var withdrawShareNode = cc.instantiate(prefab);
      _this57.addToPointParent(withdrawShareNode, GlobalCfg.PREFAB_PARENT.WITHDRAWSHARE);
    });
  },
  /**
   * 首充之后，清空金币弹窗提示
   * @param {Boolean} bool 是否可以直接关闭
   */
  showAdvancedMode: function showAdvancedMode(bool) {
    var _this58 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("advancedMode", function () {
      var path = GlobalCfg.PREFAB_PATH.ADVANCEDMODE;
      var parentNode = GlobalCfg.PREFAB_PARENT.ADVANCEDMODE;
      if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
        path = GlobalCfg.PREFAB_PATH.ADVANCEDMODE_V;
        parentNode = GlobalCfg.PREFAB_PARENT.ADVANCEDMODE;
      }
      var advancedModePrefabPromise = _this58.loadPrefabByPromise(path);
      advancedModePrefabPromise.then(function (prefab) {
        var advancedModeNode = cc.instantiate(prefab);
        var advancedModeCtrl = advancedModeNode.getComponent("AdvancedModeCtrl");
        _this58.addToPointParent(advancedModeNode, parentNode);
        advancedModeCtrl.show(bool);
      });
    });
  },
  /**
   * 
   */
  showNewRechargeTip: function showNewRechargeTip() {
    var _this59 = this;
    var path = GlobalCfg.PREFAB_PATH.NEW_FIRSTRECHARGETIPS;
    var parentNode = GlobalCfg.PREFAB_PARENT.FIRSTRECHARGETIPS;
    if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
      var shopParentNode = CommonFun.getInstance().getLayerNode(GlobalCfg.PREFAB_PARENT.SHOP);
      if (cc.isValid(shopParentNode.getChildByName("newshop"))) {
        shopParentNode.getChildByName("newshop").destroy();
      }
      if (cc.isValid(shopParentNode.getChildByName("newWithdrawal"))) {
        shopParentNode.getChildByName("newWithdrawal").destroy();
      }
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("RechargeTip", function () {
      APPManager.setOrientation("H");
      var firstRechargePrefabPromise = _this59.loadPrefabByPromise(path);
      firstRechargePrefabPromise.then(function (prefab) {
        var firstRechargeTipsNode = cc.instantiate(prefab);
        _this59.addToPointParent(firstRechargeTipsNode, parentNode);
      });
    });
  },
  /**
   * 展示Go Betting活动
   */
  showGoBetting: function showGoBetting() {
    var _this60 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GoBetting", function () {
      var goBettingPrefabPromise = _this60.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_GOBETTING);
      goBettingPrefabPromise.then(function (prefab) {
        var goBettingNode = cc.instantiate(prefab);
        var consumerActivities = goBettingNode.getComponent("ConsumerActivities");
        _this60.addToPointParent(goBettingNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_GOBETTING);
      });
    });
  },
  showPddActivity: function showPddActivity() {
    var _this61 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("PDD", function () {
      var pddPrefabPromise = _this61.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_PDD_FIRST);
      pddPrefabPromise.then(function (prefab) {
        var pddFirstNode = cc.instantiate(prefab);
        var firstCtrl = pddFirstNode.getComponent("firstCtrl");
        _this61.addToPointParent(pddFirstNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_PDD);
      });
    });
  },
  // 服务器重启
  showServerReload: function showServerReload(data) {
    var title = data.title;
    var content = data.content;
    var kind = data.kind;
    this.showMsgBox(content, "YES", null, false, false, title);
  },
  /**
   * 游戏中显示破产充值
   * @param {Number} curGameMinEnter 当前游戏最小准入
   * @param {Number} curGameCurRoundBetNum 当前游戏当前局下注金额
   * @param {Function} callback 回调函数
   */
  gameShowSecondRecharge: function gameShowSecondRecharge(curGameMinEnter, curGameCurRoundBetNum, callback) {
    var _this62 = this;
    if (curGameCurRoundBetNum === void 0) {
      curGameCurRoundBetNum = 0;
    }
    var BrokeGift_ShowInGame_Rate = parseFloat(CommonFun.getInstance().getAppConfigValueByKey('BrokeGift_ShowInGame_Rate', 0.2));
    var rate = GlobalCfg.USER_DATAS.recharged * BrokeGift_ShowInGame_Rate;
    if (GlobalCfg.USER_DATAS.openModules.includes(23) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0 && GlobalCfg.USER_DATAS.only_pay_time == 0) {
      if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < rate) {
        this.checkCanShowOnlyPay(callback, function () {
          if (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0) {
            if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < rate) {
              _this62.showBankruptcy();
              if (callback) {
                callback();
              }
            }
          }
        });
      }
    } else if (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0) {
      if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < GlobalCfg.USER_DATAS.recharged * BrokeGift_ShowInGame_Rate) {
        this.showBankruptcy();
        if (callback) {
          callback();
        }
      }
    }
  },
  updateToastLocalStorageByHours: function updateToastLocalStorageByHours(toastType, hours) {
    /**
     * 当前毫秒级的时间戳
     */
    var curTimeStamp = new Date().getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");
    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
          toastLocalData.showTag = "" + curTimeStamp;
          cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(toastLocalData));
        }
        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
      }
      ;
    } else {
      var _toastLocalData = {
        showTag: curTimeStamp
      };
      cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(_toastLocalData));
    }
    ;
  },
  /**
   * 根据本地缓存判断是否需要显示弹框
   * @param {*} toastType 弹框类型
   * @param {*} hours 间隔几个小时
   */
  isNeedShowPointToastByHours: function isNeedShowPointToastByHours(toastType, hours) {
    /**
     * 当前毫秒级的时间戳
     */
    var curTimeStamp = new Date().getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");
    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
          return true;
        } else {
          return false;
        }
        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
        return false;
      }
      ;
    } else {
      return true;
    }
    ;
  },
  /**
   * 上报错误至 Telegram
   * @param {String} info 
   */
  reportToTelegram: function reportToTelegram(info) {
    var appInfo = {
      UserId: GlobalCfg.USER_DATAS.userId,
      Channel: GlobalCfg.CHANNEL_INFO,
      PackageName: GlobalCfg.GOOGLE_ID,
      AppVersion: GlobalCfg.ASSETS_VERSION
    };
    var url = "https://api.telegram.org/bot6678922305:AAEBmVbT_O-jkzCOpR-pCKWnabi6cV-U6TY/sendMessage";
    var params = {
      chat_id: "-4071072256",
      text: "\u3010\u57FA\u672C\u4FE1\u606F\u3011:\n " + JSON.stringify(appInfo) + "\n\u3010\u5F02\u5E38\u4FE1\u606F\u3011:\n " + JSON.stringify(info)
    };
    this.httpPost(url, params, function (msg) {});
  },
  /**
   * 显示我的VIP
   */
  showMyVip: function showMyVip() {
    var _this63 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var myVipPrefabPromise = _this63.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.MYVIP);
      myVipPrefabPromise.then(function (prefab) {
        var myVipNode = cc.instantiate(prefab);
        _this63.addToPointParent(myVipNode, GlobalCfg.PREFAB_PARENT.MYVIP);
      });
    });
  },
  /**
   * 显示VIP幸运抽奖
   */
  showVipLuckyDraw: function showVipLuckyDraw() {
    var _this64 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipLuckyDrawPrefabPromise = _this64.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPLUCKYDRAW);
      vipLuckyDrawPrefabPromise.then(function (prefab) {
        var vipLuckyDrawNode = cc.instantiate(prefab);
        _this64.addToPointParent(vipLuckyDrawNode, GlobalCfg.PREFAB_PARENT.VIPLUCKYDRAW);
      });
    });
  },
  /**
   * 显示VIP规则
   */
  showVipRules: function showVipRules(childViewType) {
    var _this65 = this;
    if (childViewType === void 0) {
      childViewType = "vipRules";
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipRulesPrefabPromise = _this65.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULES);
      vipRulesPrefabPromise.then(function (prefab) {
        var vipRulesNode = cc.instantiate(prefab);
        var scr = vipRulesNode.getComponent("VipRulesCtrl");
        scr.setVipRulesChildViewType(childViewType);
        _this65.addToPointParent(vipRulesNode, GlobalCfg.PREFAB_PARENT.VIPRULES);
      });
    });
  },
  /**
   * 显示VIP奖励弹框
   * @param {number} amount 
   * @param {boolean} isBonus 
   */
  showVipRewardToast: function showVipRewardToast(amount, isBonus) {
    var _this66 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipRewardToastPrefabPromise = _this66.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPREWARDTOAST);
      vipRewardToastPrefabPromise.then(function (prefab) {
        var vipRewardToastNode = cc.instantiate(prefab);
        var vipRewardToastCtrl = vipRewardToastNode.getComponent("VipRewardToastCtrl");
        _this66.addToPointParent(vipRewardToastNode, GlobalCfg.PREFAB_PARENT.VIPREWARDTOAST);
        vipRewardToastCtrl.setVipRewardToastAmount(amount, isBonus);
      });
    });
  },
  /**
   * 显示VIP充值弹框
   */
  showVipRechargeToast: function showVipRechargeToast() {
    var _this67 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipRechargeToastPrefabPromise = _this67.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRECHARGETOAST);
      vipRechargeToastPrefabPromise.then(function (prefab) {
        var vipRechargeToastNode = cc.instantiate(prefab);
        _this67.addToPointParent(vipRechargeToastNode, GlobalCfg.PREFAB_PARENT.VIPRECHARGETOAST);
      });
    });
  },
  /**
   * 显示VIP升级弹框
   */
  showVipUpgradeToast: function showVipUpgradeToast() {
    var _this68 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipUpgradeToastPrefabPromise = _this68.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPUPGRADETOAST);
      vipUpgradeToastPrefabPromise.then(function (prefab) {
        var vipUpgradeToastNode = cc.instantiate(prefab);
        _this68.addToPointParent(vipUpgradeToastNode, GlobalCfg.PREFAB_PARENT.VIPUPGRADETOAST);
      });
    });
  },
  /**
   * 显示VIP快充弹框
   */
  showVipForOnceToast: function showVipForOnceToast() {
    var _this69 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("Vip", function () {
      var vipForOnceToastPrefabPromise = _this69.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPFORONCETOAST);
      vipForOnceToastPrefabPromise.then(function (prefab) {
        var vipForOnceToastNode = cc.instantiate(prefab);
        _this69.addToPointParent(vipForOnceToastNode, GlobalCfg.PREFAB_PARENT.VIPFORONCETOAST);
      });
    });
  },
  /**
   * 判断是否可以坐在VIP座位
   * @param {number} level VIP等级
   */
  isCanSitVipSeatByLevel: function isCanSitVipSeatByLevel(level) {
    for (var i = 0, len = GlobalCfg.USER_DATAS.vipLevels.length; i < len; i++) {
      var element = GlobalCfg.USER_DATAS.vipLevels[i];
      if (element.level == level) {
        return element.vipSeats > 0;
      }
      ;
    }
    ;
    return false;
  },
  /**
   * 判断是否可以显示VIP字体
   * @param {number} level VIP等级
   */
  isCanShowVIPFontByLevel: function isCanShowVIPFontByLevel(level) {
    if (level >= 3 && level <= 10 && this.isOpenVipModule()) {
      return true;
    }
    ;
    return false;
  },
  /**
   * vip模块是否开启
   * @returns boolean 
   */
  isOpenVipModule: function isOpenVipModule() {
    if (GlobalCfg.USER_DATAS.openModules.includes(21)) {
      return true;
    }
    ;
    return false;
  },
  encryptByRSA: function encryptByRSA(str) {
    var JSEncrypt = require('./jsencrypt.min.js');
    /**
     * 公钥，勿动！！！
     */
    var publicKey = "-----BEGIN PUBLIC KEY-----\n        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAssbvb8tFKSeAruFDokaF\n        AkCxcPL+5zNeJUXQgciH8lhx31Gdhnmbka6MlyNcCypSGN7u0F+CLgZ+HU7mgSsr\n        jnXYG50d9jJlVU2ga0PoC7FGHIDzbTSEUhsCUP8KGZtP2gVm44je4aocU+FShgHv\n        FXpblrxxMXi/FKS3cPPsNLdfE03IOb1mUjyIrjRUIftC2vqfQjTZXvV5iSHH6VDi\n        JTIGsIftcu+MY4uz6n0UId8jrV292g6ca5gvc1InUgQvKTu+JrnOHeh3i/LqKkSC\n        QHBrEPng0WrrsbSB0SCENRHyFw0PctyRyGAOkfRzarTvIQpH5OxYx+zfIrgE0GJq\n        hwIDAQAB\n        -----END PUBLIC KEY-----";
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var encryptStr = encrypt.encrypt(str);
    return encryptStr;
  },
  /**
   * 数组去重
   * @param {Array} arr 
   */
  arrayDeduplication: function arrayDeduplication(arr) {
    var map = new Map();
    var newArr = [];
    arr.forEach(function (item) {
      if (!map.has(item)) {
        map.set(item, true);
        newArr.push(item);
      }
      ;
    });
    return newArr;
  },
  /**
   * 加载bundle
   * @param {string} bundleName 
   * @param {function} succCallback
   * @param {function} failCallback 
   */
  loadBundle: function loadBundle(bundleName, succCallback, failCallback) {
    cc.assetManager.loadBundle("" + bundleName, function (err, bundle) {
      if (!err) {
        succCallback && succCallback(bundle);
      } else {
        failCallback && failCallback(err);
      }
      ;
    });
  },
  /**
   * 释放所有属于该Bundle的资源并移除该Bundle
   * @param {string} bundleName bundle名称
   */
  releaseBundle: function releaseBundle(bundleName) {
    var bundle = cc.assetManager.getBundle("" + bundleName);
    if (bundle) {
      bundle.releaseAll();
      cc.assetManager.removeBundle(bundle);
    }
  },
  /**
   * 指定免费玩家几天后无法进入游戏
   * @param {number} days 天数，默认7天
   * @return {boolean} true:可以进入游戏，false:不可以进入游戏
   */
  limitFreePlayerEnterGameByDays: function limitFreePlayerEnterGameByDays(days) {
    if (days === void 0) {
      days = 7;
    }
    var createTime = GlobalCfg.USER_DATAS.registerTime * 1000;
    if (createTime == 0 || GlobalCfg.USER_DATAS.recharged > 0) {
      return true;
    }
    var now = new Date();
    var nowTime = now.getTime();
    var duringTime = nowTime - createTime;
    LoggerUtil.getInstance().log("limitFreePlayerEnterGameByDays", createTime, duringTime);
    if (duringTime > days * 24 * 60 * 60 * 1000) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 获取设备ID
   * @returns string 设备id
   */
  getDeviceId: function getDeviceId() {
    var device = APPManager.getUUID();
    if (!device) {
      device = cc.sys.localStorage.getItem("LOGIN_DEVICE");
      if (!device) {
        device = CommonFun.getInstance().generateUUID();
        cc.sys.localStorage.setItem("LOGIN_DEVICE", device);
      }
      ;
    }
    ;
    return device;
  },
  /**
   * 事件埋点上报
   * @param {string} eventName 事件名称
   * @param {number} duration 事件持续时间，单位毫秒
   */
  behaviorReporting: function behaviorReporting(eventName, duration) {
    if (duration === void 0) {
      duration = 0;
    }
  } // if (!eventName) {
  //     return;
  // };
  // if (!cc.sys.isNative) {
  //     return;
  // };
  // let url = "";
  // let device = CommonFun.getInstance().getDeviceId();
  // let serverType = CommonFun.getInstance().getServerType();
  // LoggerUtil.getInstance().info(`behaviorReporting: serverType ${serverType}`);
  // switch (serverType) {
  //     case 0:
  //         url = `https://svrtest.tpgame.in/login/uievent`;
  //         break;
  //     case 1:
  //         url = `https://svr.tpgame.in/login/uievent`;
  //         break;
  //     case 2:
  //         url = `https://svr2.tpgame.in/login/uievent`;
  //         break;
  //     case 3:
  //         url = `https://svr.tp-game.com/login/uievent`;
  //         break;
  //     case 6:
  //         url = `https://svr.teengatti.in/login/uievent`;
  //         break;
  //     default:
  //         url = `https://svrtest.tpgame.in/login/uievent`;
  //         break;
  // };
  // let httpParam = {
  //     device: `${device}`,
  //     uid: `${GlobalCfg.USER_DATAS.userId ? GlobalCfg.USER_DATAS.userId : ""}`,
  //     triggerTime: cc.sys.now(),
  //     duration: duration,
  //     event: `${eventName}`,
  //     sign: CommonFun.getInstance().encryptByRSA(device) 
  // };
  // CommonFun.getInstance().httpPost(url, httpParam, (json) => {}, (json) => {});
  ,

  /**
   * 获取服务器类型. 0: 测试服，1: 1服，2: 2服， 3:3服，6:J服
   * @returns {number}
   */
  getServerType: function getServerType() {
    var type = 0;
    if (GlobalCfg.server_id == "0" || GlobalCfg.server_id == "21") {
      type = 0;
    } else if (GlobalCfg.server_id == "1" || GlobalCfg.server_id == "11") {
      type = 1;
    } else if (GlobalCfg.server_id == "2" || GlobalCfg.server_id == "4" || GlobalCfg.server_id == "22") {
      type = 2;
    } else if (GlobalCfg.server_id == "3") {
      type = 3;
    } else if (GlobalCfg.server_id == "6") {
      type = 6;
    }
    ;
    return type;
  },
  /**
   * 直接通过商品ID跳转H5充值
   * @param {Number} commodityId 商品ID
   * @param {Function} callback 
   */
  rechargeByCommodityId: function rechargeByCommodityId(commodityId, from, callback, PAY_CHANNEL) {
    var _this70 = this;
    if (PAY_CHANNEL === void 0) {
      PAY_CHANNEL = 0;
    }
    if (PAY_CHANNEL == 0) {
      //如果传进来的支付渠道ID为0，则获取支付渠道ID
      this.getPayChannel(function (payData) {
        GlobalCfg.PAY_CHANNEL = payData.pay_channels[0];
        _this70.PayHttp(commodityId, from, callback);
      });
      return;
    }
    ;
    this.PayHttp(commodityId, from, callback);
  },
  PayHttp: function PayHttp(commodityId, from, callback) {
    var url = GlobalCfg.HTTP_SERVER + "/v1/payment/h5pay";
    url += "?user_mobile=" + GlobalCfg.USER_DATAS.phone;
    url += "&user_email=" + GlobalCfg.USER_DATAS.mail;
    url += "&id=" + commodityId;
    url += "&from=" + from;
    url += "&pay_channel=" + GlobalCfg.PAY_CHANNEL;
    url += "&types=" + GlobalCfg.PAY_CHANNEL2;
    // url += "&server_id=" + GlobalCfg.server_id;
    CommonFun.getInstance().showProgress();
    CommonFun.getInstance().httpGet(url, function (strInfo) {
      CommonFun.getInstance().hidProgress();
      if (strInfo && strInfo.result == 0) {
        if (strInfo.data.pay_url && strInfo.data.pay_url.length > 0) {
          cc.sys.openURL(strInfo.data.pay_url);
          callback && callback();
        } else {
          CommonFun.getInstance().showTips("Payment link is empty!");
          callback && callback();
        }
        ;
      } else {
        CommonFun.getInstance().showTips(strInfo.msg);
      }
      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  /**
   * 将毫秒转换为 HH:MM:SS 格式
   * @param {number} ms 剩余毫秒数
   * @returns {string} 格式化后的时间字符串
   */
  formatToHMS: function formatToHMS(ms) {
    if (ms <= 0) return "00:00:00"; // 倒计时结束
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor(totalSeconds % 3600 / 60);
    var seconds = totalSeconds % 60;

    // 补零显示（如 1 → "01"）
    var pad = function pad(num) {
      return num.toString().padStart(2, '0');
    };
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  },
  /**
   * 获取商场角标
   */
  getPayChannel: function getPayChannel(callback) {
    var url = GlobalCfg.HTTP_SERVER + "/v1/payment/GetPayChannel";
    CommonFun.getInstance().showProgress();
    CommonFun.getInstance().httpGet(url, function (strInfo) {
      CommonFun.getInstance().hidProgress();
      if (strInfo && strInfo.result == 0) {
        callback && callback(strInfo.data);
      } else {
        CommonFun.getInstance().showTips(strInfo.msg);
      }
      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  /**
   * 显示游戏开始遮罩
   */
  showGameStartMask: function showGameStartMask() {
    var _this71 = this;
    var gameStartMaskPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMESTARTMASK);
    gameStartMaskPrefabPromise.then(function (prefab) {
      var gameStartMaskNode = cc.instantiate(prefab);
      _this71.addToPointParent(gameStartMaskNode, GlobalCfg.PREFAB_PARENT.GAMESTARTMASK);
    });
  },
  /**
   * 播放文字滚动动画
   */
  startTextAnimation: function startTextAnimation(label, currentNumber, targetNumber, callback, duration) {
    if (duration === void 0) {
      duration = 1;
    }
    var difference = targetNumber - currentNumber;
    var frames = Math.ceil(duration * 60);
    var frameCounter = 0;
    var updateValue = function updateValue() {
      if (frameCounter <= frames) {
        var newValue = Math.round(currentNumber + difference / frames * frameCounter);
        label.string = newValue.toString();
        frameCounter++;
        requestAnimationFrame(updateValue);
      } else {
        callback && callback();
      }
    };
    requestAnimationFrame(updateValue);
  },
  /**
   * 显示游戏动画互动界面
   * @param {Number} targetSeat 默认-1，表示群发
   */
  showGameGifInteraction: function showGameGifInteraction(targetSeat) {
    var _this72 = this;
    if (targetSeat === void 0) {
      targetSeat = -1;
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", function () {
      var gameGifInteractionPrefabPromise = _this72.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTION);
      gameGifInteractionPrefabPromise.then(function (prefab) {
        var gameGifInteractionNode = cc.instantiate(prefab);
        var gameGifInteractionCtrl = gameGifInteractionNode.getComponent('GameGifInteractionCtrl');
        gameGifInteractionCtrl.setTargetSeat(targetSeat);
        _this72.addToPointParent(gameGifInteractionNode, GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTION);
      });
    });
  },
  /**
   * 
   * @param {String} skeletonName 动画名称
   * @param {cc.Node} senderNode 发送者的节点
   * @param {[cc.Node]} targetNodeArr 接收者的节点
   * @returns 
   */
  playGameGifInteraction: function playGameGifInteraction(skeletonName, senderNode, targetNodeArr) {
    var _this73 = this;
    if (!Array.isArray(targetNodeArr) || targetNodeArr.length === 0) {
      return;
    }
    ;
    if (cc.isValid(senderNode) == false) {
      return;
    }
    ;
    var targetNodeArrLen = targetNodeArr.length;
    if (targetNodeArrLen > 0) {
      var _loop = function _loop() {
        var targetNode = targetNodeArr[i];
        var gameGifInteractionSkePrefabPromise = _this73.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONSKE);
        gameGifInteractionSkePrefabPromise.then(function (prefab) {
          var gameGifInteractionSkeNode = cc.instantiate(prefab);
          _this73.addToPointParent(gameGifInteractionSkeNode, GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTIONSKE);
          var gameGifInteractionSkeCtrl = gameGifInteractionSkeNode.getComponent('GameGifInteractionSkeCtrl');
          var parentNode = _this73.getLayerNode(GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTIONSKE);
          gameGifInteractionSkeCtrl.playGameGifSkeleton(skeletonName, senderNode, targetNode, parentNode);
        });
      };
      for (var i = 0; i < targetNodeArrLen; i++) {
        _loop();
      }
      ;
    }
    ;
  },
  /**
   * 显示游戏文字/Face互动界面
   * @param {Number} targetSeat 默认-1，表示群发
   */
  showGameWordInteraction: function showGameWordInteraction(targetSeat) {
    var _this74 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", function () {
      var gameWordInteractionPrefabPromise = _this74.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTION);
      gameWordInteractionPrefabPromise.then(function (prefab) {
        var gameWordInteractionNode = cc.instantiate(prefab);
        var gameWordInteractionCtrl = gameWordInteractionNode.getComponent('GameWordInteractionCtrl');
        gameWordInteractionCtrl.setTargetSeat(targetSeat);
        _this74.addToPointParent(gameWordInteractionNode, GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTION);
      });
    });
  },
  /**
   * 显示文字/Face互动内容
   * @param {number} type 
   * @param {string} name 
   * @param {cc.Node} targetNode 
   * @param {cc.Vec2} offset 
   * @returns 
   */
  playGameWordInteraction: function playGameWordInteraction(type, name, targetNode, offset) {
    var _this75 = this;
    if (cc.isValid(targetNode) == false) {
      return;
    }
    ;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", function () {
      var gameWordInteractionShowrefabPromise = _this75.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONSHOW);
      gameWordInteractionShowrefabPromise.then(function (prefab) {
        var gameWordInteractionShowNode = cc.instantiate(prefab);
        var gameWordInteractionShowCtrl = gameWordInteractionShowNode.getComponent('GameWordInteractionShowCtrl');
        var parentNode = _this75.getLayerNode(GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTIONSHOW);
        gameWordInteractionShowCtrl.setGameWordInteraction(type, name, targetNode, offset, parentNode);
        _this75.addToPointParent(gameWordInteractionShowNode, GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTIONSHOW);
      });
    });
  },
  /**
   * 显示游戏中的设置界面
   */
  showGameSetting: function showGameSetting() {
    var _this76 = this;
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameSetting", function () {
      var gameSettingPrefabPromise = _this76.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMESETTING);
      gameSettingPrefabPromise.then(function (prefab) {
        var gameSettingNode = cc.instantiate(prefab);
        var gameSettingCtrl = gameSettingNode.getComponent('GameSettingCtrl');
        _this76.addToPointParent(gameSettingNode, GlobalCfg.PREFAB_PARENT.GAMESETTING);
      });
    });
  },
  setEditBoxEvent: function setEditBoxEvent(editBox, node) {
    if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
      // 保存原始位置
      var _originalY = node.y;

      // 计算合适的键盘高度（可根据需要调整）
      var KEYBOARD_HEIGHT = cc.view.getVisibleSize().height * 0.4;
      editBox.node.on('editing-did-began', function () {
        // 获取输入框底部位置
        var pos = editBox.node.convertToWorldSpaceAR(cc.v2(0, -editBox.node.height / 2));
        var screenHeight = cc.view.getVisibleSize().height;

        // 计算需要上移的距离（只移动必要距离）
        var moveDistance = Math.max(0, pos.y - KEYBOARD_HEIGHT);

        // 限制最大上移距离（例如不超过屏幕的50%）
        moveDistance = Math.min(moveDistance, screenHeight * 0.5);
        cc.tween(node).to(0.2, {
          y: _originalY + moveDistance
        }).start();
      }.bind(this));
      editBox.node.on('editing-did-ended', function () {
        cc.tween(node).to(0.2, {
          y: _originalY
        }).start();
      }.bind(this));
    }
  },
  /**
   * 显示游戏的菜单界面
   * @param {boolean} isShowSwitchBtn 是否显示换桌按钮
   */
  showGameMenu: function showGameMenu(isShowSwitchBtn) {
    var _this77 = this;
    if (isShowSwitchBtn === void 0) {
      isShowSwitchBtn = true;
    }
    CommonFun.getInstance().checkBundleIsDownloadedByH5("GameMenu", function () {
      var gameMenuPrefabPromise = _this77.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEMENU);
      gameMenuPrefabPromise.then(function (prefab) {
        var gameSettingNode = cc.instantiate(prefab);
        var gameMenuCtrl = gameSettingNode.getComponent('GameMenuCtrl');
        gameMenuCtrl.setSwitchTableBtnActive(isShowSwitchBtn);
        _this77.addToPointParent(gameSettingNode, GlobalCfg.PREFAB_PARENT.GAMEMENU);
      });
    });
  },
  // 设置昵称
  setNickname: function setNickname(nickname) {
    var MAX_LENGTH = 9; // 昵称最大长度
    var DISPLAY_LENGTH = 7; // 超过最大长度时显示的长度
    var name = "";
    if (nickname.length > MAX_LENGTH) {
      // 超过 7 位，截取前 5 位并加上省略号
      name = nickname.substring(0, DISPLAY_LENGTH) + "...";
    } else {
      // 不超过 7 位，直接显示
      name = nickname;
    }
    return name;
  },
  /**
   * 初始化竖屏次数
   */
  initVerticalAcc: function initVerticalAcc() {
    this._verticalAcc = 0;
    if (this._curOrientation == EnumOrientation.VERTICAL) {
      this._curOrientation = EnumOrientation.HORIZONTAL;
      APPManager.setOrientation('H');
    }
    ;
  },
  /**
   * 累加竖屏次数，当累加次数大于0，则竖屏
   */
  addVerticalAcc: function addVerticalAcc() {
    this._verticalAcc += 1;
    if (this._verticalAcc > 0 && this._curOrientation == EnumOrientation.HORIZONTAL) {
      this._curOrientation = EnumOrientation.VERTICAL;
      APPManager.setOrientation('V');
    }
    ;
  },
  /**
   * 减少竖屏次数，当累加次数等于0，则横屏
   */
  decVerticalAcc: function decVerticalAcc() {
    this._verticalAcc -= 1;
    if (this._verticalAcc <= 0 && this._curOrientation == EnumOrientation.VERTICAL) {
      this._curOrientation = EnumOrientation.HORIZONTAL;
      APPManager.setOrientation('H');
    }
    ;
  },
  checkVerticalAcc: function checkVerticalAcc() {
    if (this._curOrientation == EnumOrientation.VERTICAL) {
      return true;
    }
    return false;
  },
  /**
   * 处理商品列表
   * @param {number} couldWithdraw 
   * @param {Array} commoditys 商品列表 
   * @returns 处理后的商品列表
   */
  dealShopList: function dealShopList(couldWithdraw, commoditys) {
    var btnListData = commoditys.sort(function (a, b) {
      var value1 = a["amount"];
      var value2 = b["amount"];
      return value1 - value2;
    });
    /**
     * 配置1: 无论诱导金额是多少，始终显示所有的充值额度（所有商品）
     * 配置2：根据诱导金额显示商城支付最低充值额度（部分商品）
     */
    var shopModel = this.getAppConfigValueByKey('SHOP_MODEL', 1);
    if (GlobalCfg.USER_DATAS.recharged > 0 || shopModel == 1) {
      return btnListData;
    }
    var index = 0,
      startIndex = 0;
    var mixShowAmounts = [[10000, 20000], [30000, 20000], [50000, 30000], [150000, 50000]];
    var length = mixShowAmounts.length,
      limitShow = mixShowAmounts[0][1];
    while (index < length - 1) {
      if (couldWithdraw > mixShowAmounts[length - 1][0]) {
        limitShow = 100000;
        for (var i = 0, len = btnListData.length; i < len; i++) {
          if (btnListData[i].amount == limitShow) {
            startIndex = i;
          }
        }
        break;
      } else {
        if (couldWithdraw > mixShowAmounts[index][0] && couldWithdraw <= mixShowAmounts[index + 1][0]) {
          limitShow = mixShowAmounts[index + 1][1];
          for (var _i = 0, _len = btnListData.length; _i < _len; _i++) {
            if (btnListData[_i].amount == limitShow) {
              startIndex = _i;
            }
          }
          break;
        }
        index++;
      }
    }
    var arr = btnListData.slice(startIndex, btnListData.length);
    LoggerUtil.getInstance().log(">>>>>ShopList>>>>>>>>", arr);
    return arr;
  }
}, _cc$Class["isNeedShowPointToastByHours"] = function isNeedShowPointToastByHours(toastType, hours) {
  /**
   * 当前毫秒级的时间戳
   */
  var curTimeStamp = new Date().getTime();
  var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");
  if (toastLocalStorage) {
    try {
      var toastLocalData = JSON.parse(toastLocalStorage);
      var showTag = toastLocalData.showTag;
      if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
        return true;
      } else {
        return false;
      }
      ;
    } catch (error) {
      LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
      return false;
    }
    ;
  } else {
    return true;
  }
  ;
}, _cc$Class.getAppConfigValueByKey = function getAppConfigValueByKey(key, defaultValue) {
  for (var i = 0; i < GlobalCfg.APP_CONFIG_DATAS.length; i++) {
    var element = GlobalCfg.APP_CONFIG_DATAS[i];
    if (element.key == key) {
      return element.value;
    }
  }
  LoggerUtil.getInstance().warn("APP_CONFIG doesn`t have " + key);
  return defaultValue;
}, _cc$Class.getTodayCountdown = function getTodayCountdown() {
  var padZero = function padZero(num) {
    return num < 10 ? "0" + num : num;
  };
  // 获取当前时间
  var now = new Date();
  // 设置今天的结束时间为 23:59:59
  var todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  // 计算剩余时间（毫秒数）
  var timeRemaining = todayEnd - now;

  // 计算时、分、秒
  var hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  var minutes = Math.floor(timeRemaining % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(timeRemaining % (1000 * 60) / 1000);

  // 格式化输出
  var formattedCountdown = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
  return formattedCountdown;
}, _cc$Class.showDiversionFreeTP = function showDiversionFreeTP(clickBtnPlayNowCallback) {
  var _this78 = this;
  if (GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW) {
    return;
  }
  ;
  GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW = true;
  var diversionFreeTPPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.DIVERSIONFREETP);
  diversionFreeTPPrefabPromise.then(function (prefab) {
    var diversionFreeTPNode = cc.instantiate(prefab);
    var diversionFreeTPCtrl = diversionFreeTPNode.getComponent('DiversionFreeTPCtrl');
    diversionFreeTPCtrl.setDiversionFreeTPBtnPlayNowCallback(clickBtnPlayNowCallback);
    _this78.addToPointParent(diversionFreeTPNode, GlobalCfg.PREFAB_PARENT.DIVERSIONFREETP);
  });
}, _cc$Class.isFreePlayerDirectedToFreeTP = function isFreePlayerDirectedToFreeTP() {
  if (this.getAppConfigValueByKey("FREE_PLAYER_DIRECTED_TO_FREE_TP", false) == true) {
    return true;
  }
  return false;
}, _cc$Class.showWithdrawToastInGame = function showWithdrawToastInGame() {
  if (this.isNeedShowWithdrawToastInGame() == false) {
    return;
  }
  ;
  var defaultPopupWithdrawLimit = this.getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 100); // 提现弹窗限制默认值
  var func = function func(date) {
    var _date = date * 1000;
    var _curDate = new Date().getTime();
    var _differ = _curDate - _date;
    if (_differ < 24 * 60 * 60 * 1000) {
      return Number(30 / 60).toFixed(1);
    } else if (_differ < 3 * 24 * 60 * 60 * 1000) {
      return Number(20 / 60).toFixed(1);
    } else if (_differ < 5 * 24 * 60 * 60 * 1000) {
      return Number(10 / 60).toFixed(1);
    } else {
      return Number(5 / 60).toFixed(1);
    }
    ;
  };
  var isNeedShowPointToastByHours = function isNeedShowPointToastByHours(toastType, hours) {
    /**
     * 当前毫秒级的时间戳
     */
    var curTimeStamp = new Date().getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");
    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
          return true;
        } else {
          return false;
        }
        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
        return false;
      }
      ;
    } else {
      return true;
    }
    ;
  };
  var toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
  console.log("toastWithDrawFrequency1: ", GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(5));
  console.log("toastWithDrawFrequency2: ", GlobalCfg.USER_DATAS.userDiamond > defaultPopupWithdrawLimit * 100);
  console.log("toastWithDrawFrequency3: ", isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency));
  if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > defaultPopupWithdrawLimit * 100 && isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
    this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
    CommonFun.getInstance().showPopUpWithDraw();
  }
  ;
}, _cc$Class.isShowWithdrawToastCloseBtn = function isShowWithdrawToastCloseBtn() {
  if (this.getAppConfigValueByKey("SHOW_WITHDRAW_TOAST_CLOSE_BTN", false) == true) {
    return true;
  }
  ;
  return false;
}, _cc$Class.isNeedShowWithdrawToastInGame = function isNeedShowWithdrawToastInGame() {
  if (this.getAppConfigValueByKey("SHOW_WITHDRAW_TOAST_IN_GAME", false) == true) {
    return true;
  }
  return false;
}, _cc$Class.checkShowWithDrawToast = function checkShowWithDrawToast() {
  if (GlobalCfg.USER_DATAS.isNotCharge == false) {
    //充值过则不弹出
    return true;
  }
  ;
  var func = function func(date) {
    var _date = date * 1000;
    var _curDate = new Date().getTime();
    var _differ = _curDate - _date;
    if (_differ < 24 * 60 * 60 * 1000) {
      return Number(30 / 60).toFixed(1);
    } else if (_differ < 3 * 24 * 60 * 60 * 1000) {
      return Number(20 / 60).toFixed(1);
    } else if (_differ < 5 * 24 * 60 * 60 * 1000) {
      return Number(10 / 60).toFixed(1);
    } else {
      return Number(5 / 60).toFixed(1);
    }
  };
  // let toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
  var toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
  LoggerUtil.getInstance().log("checkShowWithDrawToast toastWithDrawFrequency:", toastWithDrawFrequency);
  var defaultPopupWithdrawLimit = this.getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 100); // 提现弹窗限制默认值
  if (GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > defaultPopupWithdrawLimit * 100 && this.isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
    this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
    this.showPopUpWithDraw();
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: 'STOP_GAME',
      msgData: {}
    });
    return true;
  }
  return false;
}, _cc$Class.isNeedSignToastGetBtnChange = function isNeedSignToastGetBtnChange() {
  if (this.getAppConfigValueByKey("SIGN_TOAST_GET_BTN_CHANGE", false) == true) {
    return true;
  }
  return false;
}, _cc$Class.isNeewShowSignToast = function isNeewShowSignToast() {
  if (this.getAppConfigValueByKey("SHOW_SIGN_TOAST", false) == true) {
    return true;
  }
  return false;
}, _cc$Class.showSignToast = function showSignToast() {
  var _this79 = this;
  CommonFun.getInstance().checkBundleIsDownloadedByH5("Sign", function () {
    var signPrefabPromise = _this79.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SIGN);
    signPrefabPromise.then(function (prefab) {
      var signNode = cc.instantiate(prefab);
      var gameMenuCtrl = signNode.getComponent('SignCtrl');
      _this79.addToPointParent(signNode, GlobalCfg.PREFAB_PARENT.SIGN);
    });
  });
}, _cc$Class.isEnteredTPGame = function isEnteredTPGame() {
  var state = cc.sys.localStorage.getItem("ENTERED_TP_GAME_" + GlobalCfg.USER_DATAS.userId);
  if (state == null) {
    return false;
  }
  ;
  return true;
}, _cc$Class.ShowTipsBeforeBuy = function ShowTipsBeforeBuy(msg, callback) {
  var str = 'Go to Recharge $ ' + msg + '?';
  CommonFun.getInstance().showMsgBox(str, "SHOP", function () {
    if (callback) {
      callback();
    }
  }, false);
}, _cc$Class.isNeedShowTPFingerTip = function isNeedShowTPFingerTip() {
  if (this.getAppConfigValueByKey("SHOW_TP_FINGER_TIP", false) == true) {
    return true;
  }
  return false;
}, _cc$Class.showBankruptcy = function showBankruptcy(isClick, isPlotPlay) {
  var _this80 = this;
  if (isClick === void 0) {
    isClick = false;
  }
  if (isPlotPlay === void 0) {
    isPlotPlay = false;
  }
  LoggerUtil.getInstance().log("caojun showBankruptcy GlobalCfg.BANKRUPT_CD:", GlobalCfg.BANKRUPT_CD);
  if (isClick == false) {
    //手动点击的时候不需要加入破产cd
    if (GlobalCfg.BANKRUPT_CD == 0) {
      GlobalCfg.BANKRUPT_CD = new Date().getTime();
    } else {
      var shengyuTime = (new Date().getTime() - GlobalCfg.BANKRUPT_CD) / 1000;
      if (shengyuTime < 1800) {
        //半小时CD才会弹出破产面板
        return;
      } else {
        GlobalCfg.BANKRUPT_CD = new Date().getTime();
      }
    }
  }
  var isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT, GlobalCfg.PREFAB_PARENT.BANKRUPTCY_GIFT);
  LoggerUtil.getInstance().log("caojun showBankruptcy isExist:", isExist);
  if (isExist) {
    return;
  }
  ;
  CommonFun.getInstance().checkBundleIsDownloadedByH5("Bankruptcy", function () {
    GlobalCfg.IS_SHOW_BANKRUPT = true;
    var curScene = SceneManager.getInstance().curSceneType;
    var bankruptcyPrefabPromise = _this80.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT);
    bankruptcyPrefabPromise.then(function (prefab) {
      var bankruptcyNode = cc.instantiate(prefab);
      if (curScene == SceneManager.getInstance().sceneType.BENZ) {
        bankruptcyNode.setScale(0.7);
      }
      var BankruptcyGiftCtrl = bankruptcyNode.getComponent("BankruptcyGiftCtrl");
      BankruptcyGiftCtrl.init(isPlotPlay);
      _this80.addToPointParent(bankruptcyNode, GlobalCfg.PREFAB_PARENT.BANKRUPTCY_GIFT);
    });
  });
}, _cc$Class.checkCanShowOnlyPay = function checkCanShowOnlyPay(callback, callback2) {
  var _this81 = this;
  var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/useonlypay";
  var httpParam = {};
  CommonFun.getInstance().httpPost(httpUrl, httpParam, function (strInfo) {
    CommonFun.getInstance().hidProgress();
    if (strInfo && strInfo.data) {
      if (strInfo.data.code == 0) {
        GlobalCfg.USER_DATAS.only_pay_time = strInfo.data.timer;
        GlobalCfg.USER_DATAS.only_pay_countDownTime = strInfo.data.timer + Date.now();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: 'show_Only_Pay',
          msgData: {}
        });
        _this81.showOnlyPay();
        callback && callback();
      } else {
        callback2 && callback2();
      }
    }
  }, null, GlobalCfg.USER_DATAS.BearerToken);
}, _cc$Class.showOnlyPay = function showOnlyPay() {
  var _this82 = this;
  var isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.ONLY_PAY, GlobalCfg.PREFAB_PARENT.ONLY_PAY);
  if (isExist) {
    return;
  }
  ;
  if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.BENZ) {
    return;
  }
  CommonFun.getInstance().checkBundleIsDownloadedByH5("Onlypay", function () {
    GlobalCfg.IS_SHOW_BANKRUPT = true;
    var OnlyPayPromise = _this82.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ONLY_PAY);
    OnlyPayPromise.then(function (prefab) {
      var OnlyPayNode = cc.instantiate(prefab);
      var OnlyPayCtrl = OnlyPayNode.getComponent("OnlyPayCtrl");
      OnlyPayCtrl.init();
      _this82.addToPointParent(OnlyPayNode, GlobalCfg.PREFAB_PARENT.ONLY_PAY);
    });
  });
}, _cc$Class));
CommonFun.getInstance = function () {
  if (!CommonFun._instance) {
    CommonFun._instance = new CommonFun();
  }
  return CommonFun._instance;
};
window.CommonFun = CommonFun;

cc._RF.pop();