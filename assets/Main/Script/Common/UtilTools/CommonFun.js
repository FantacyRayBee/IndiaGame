let EnumOrientation = cc.Enum({
    HORIZONTAL: 0,
    VERTICAL: 1,
});

let CommonFun = cc.Class({

    statics: {
        _instance: null
    },

    ctor: function () {
        this._layerNodeMap = new Map();
        this._progressTimer = null;
        this._progressNode = null;
        this._selectRoomNode = null;
        this._loadedPrefabMap = new Map();
        this._verticalAcc = 0;
        this._curOrientation = EnumOrientation.HORIZONTAL;

        this.gameBundleOpenList = {}
    },

    checkShiPei: function (node) {
        let _canvas = cc.Canvas.instance;
        //获取硬件分辨率
        let frameSize = cc.view.getFrameSize();
        let w = frameSize.width;
        let h = frameSize.height;
        GlobalCfg.DEVICE_MODEL = h;
        let bi = w / h;
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
    encrypt: function (str, pwd) {
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
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
            prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
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
            encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
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
    decrypt: function (str, pwd) {
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
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
            prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
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
            encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
            encStr += String.fromCharCode(encChr);
            prand = (mult * prand + incr) % modu;
        }
        return decodeURIComponent(encStr);
    },

    /**
     * 处理App的配置信息数据
     * @param {Object} json App配置信息的数据对象
     */
    dealAppInfoJson: function (json) {
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
        GlobalCfg.ASSETS_UPDATE_URL = `${GlobalCfg.ASSETS_URL}${GlobalCfg.ASSETS_VERSION}`;
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
        GlobalCfg.HTTP_USER_LOGIN = `${json["HTTP_ROOT_URL"]}/login`;
        /**
         * 用户登录相关的路由
         */
        GlobalCfg.Forced_Migration = json["ForcedMigration"];
        /**
         * 暂定（配合服务器的定义）
         */
        GlobalCfg.HTTP_SERVER = `${json["HTTP_ROOT_URL"]}/httpserver`;
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
        if (GlobalCfg.isH5) { //H5渠道
            GlobalCfg.CHANNEL_INFO = this.getChannelIdV1();
        }
        else {
            GlobalCfg.CHANNEL_INFO = json["CHANNEL_INFO"];
        }
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
        let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
        if (packageChannel && packageChannel.indexOf("_") != -1) {
            let packageChannelArr = packageChannel.split("_");
            let channel = packageChannelArr[1];
            if (!channel) {
                LoggerUtil.getInstance().error(`Incorrect channel configuration during packaging!`);
                return;
            }
            ;

            if (Reflect.has(json, "PACKAGE_CONFIG_DICT") == false) {
                LoggerUtil.getInstance().error(`AppInfo configuration file without "PACKAGE_CONFIG_DICT" parameter!`);
                return;
            }
            ;

            let packageConfigDict = json["PACKAGE_CONFIG_DICT"];
            if (Reflect.has(packageConfigDict, channel) == false) {
                LoggerUtil.getInstance().error(`AppInfo configuration file, channel "${channel}" information not configured!`);
                return;
            }
            ;

            let packageConfig = packageConfigDict[channel];
            if (Reflect.has(packageConfig, "CHANNEL_INFO") == true) {
                if (GlobalCfg.isH5) { //H5渠道
                    GlobalCfg.CHANNEL_INFO = this.getChannelIdV1();
                }
                else {
                    GlobalCfg.CHANNEL_INFO = packageConfig["CHANNEL_INFO"];
                }
            }
            if (Reflect.has(packageConfig, "GOOGLE_ID") == true) {
                GlobalCfg.GOOGLE_ID = packageConfig["GOOGLE_ID"];
            }
            ;
            if (Reflect.has(packageConfig, "FACEBOOK_ID") == true) {
                GlobalCfg.FACEBOOK_ID = packageConfig["FACEBOOK_ID"];
                if (GlobalCfg.FACEBOOK_ID && GlobalCfg.FACEBOOK_ID.length > 0) {
                    APPManager.setFaceBookID(GlobalCfg.FACEBOOK_ID);
                }
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
     * // UploadGameErrorReq 上报游戏错误消息 POST v1/upload/gameerror
     type UploadGameErrorReq struct {
     Product string `json:"product"` // 游戏项目appID(对应small_game/list接口product)
     Event   int    `json:"event"`   // 错误事件枚举(前后端对应，0:未知错误，1:未充值拒绝游戏)
     Message string `json:"message"` // 其他附带信息
     }
     */
    UploadGameErrorReq: function (params) {

    },

    httpGet: function (url, callFun, outCallFun, Authorization) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            let responseText = xhr.responseText;
            if (url == GlobalCfg.APP_INFO_URL || url == GlobalCfg.APP_CONFIG_URL
                || url == GlobalCfg.APP_INFO_URL_SPARE || url == GlobalCfg.APP_CONFIG_URL_SPARE
            ) {
                try {
                    let enCode = responseText;
                    responseText = CommonFun.getInstance().decrypt(enCode, GlobalCfg.STR_KEY);
                } catch (error) {

                }
                ;
            }
            ;
            let responseJson = null;
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

            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
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
                    outCallFun && outCallFun({result: 0, msg: responseText});
                }
                ;
            } else {
                let reason = "";
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
                LoggerUtil.getInstance().log("HttpGet ===> Respone: ", cc.sys.isNative ? (responseJson ? JSON.stringify(responseJson) : responseText) : (responseJson ? responseJson : responseText));
                outCallFun && outCallFun({result: 0, msg: reason});
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

    httpPost: function (url, params, callFun, outCallFun, Authorization) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = () => {
            let responseText = xhr.responseText;
            let responseJson = null;
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

            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
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
                    outCallFun && outCallFun({result: 0, msg: responseText});
                }
                ;
            } else {
                let reason = "";
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
                LoggerUtil.getInstance().log("HttpPost ===> Respone: ", cc.sys.isNative ? (responseJson ? JSON.stringify(responseJson) : responseText) : (responseJson ? responseJson : responseText));
                outCallFun && outCallFun({result: 0, msg: reason});
            }
            ;
        };
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Content-Type", "application/json");
        if (Authorization) {
            LoggerUtil.getInstance().log(`BearerToken情况下, Post请求的地址：${url}`);
            xhr.setRequestHeader("Authorization", Authorization);
        }
        ;
        xhr.send(JSON.stringify(params));
    },
    
    //h5之类的短考虑生成
    generateUUID: function () {
        if (window.location) {
            const urlParams = new URLSearchParams(window.location.search);
            const uuid = urlParams.get('uuid');
            if (uuid && uuid.length > 0) { // 检查 uuid 是否有效
                return uuid;
            }
        }
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    fixed: function (num) {
        // let result = Math.floor(num * 100) / 100; // 截断两位小数
        // return result.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        let result = Math.floor(num * 100) / 100; // 截断两位小数
        return result.toFixed(2); // 始终保留 2 位
    },

    /**
     * 检测小游戏是需要版本更新
     * @param {string} subpackgeName 小游戏bundle名
     * @returns
     */
    isNeedUpdata: function (subpackgeName) {
        if(GlobalCfg.isH5){
            if (this.gameBundleOpenList[subpackgeName]) { // 如果已经下载过，则直接返回
                return false;
            }
            return true;
        }
        else{
            if (cc.sys.os != cc.sys.OS_ANDROID || !GlobalCfg.IS_SMALL_GAME_UPDATE || cc.sys.isBrowser) {
                return false;
            };
            let serverVersionNum = Number(GlobalCfg.SUB_GAME_VERSION_INFO[subpackgeName]);
            let localVersionNum = Number(cc.sys.localStorage.getItem(subpackgeName));
            LoggerUtil.getInstance().log(`${subpackgeName}版本号对比===> 远程版本号: ${serverVersionNum}, 本地版本号: ${localVersionNum}`);
            if (serverVersionNum !== localVersionNum) {
                return true;
            } 
            else {
                return false;
            };
        }
    },

    gameLoadBundleByH5: function (subpackgeName, callback) {
        // 加载资源包
        cc.assetManager.loadBundle(subpackgeName, (err, bundle) => {
            if (err) {
                callback && callback();  // 调用失败回调
                return;
            }
            // 预加载资源包中的目录并获取进度
            bundle.preloadDir("/", (completedCount, totalCount) => {
                let progress = completedCount / totalCount;  // [0,1]
                if (progress >= 1) {
                    progress = 1;
                }
                ;
                let progressStr = (progress * 100).toFixed(2);
                let msgData = {
                    progress: progressStr,
                    subpackgeName: subpackgeName,
                };
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS,
                    msgData: msgData
                });
            }, (err) => {
                if (err) {
                    callback && callback();  // 调用失败回调
                    return;
                }
                this.gameBundleOpenList[subpackgeName] = true;  // 保存已经下载过的bundle
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE,
                    msgData: {subpackgeName: subpackgeName}
                });
                callback && callback();  // 调用成功回调
            });
        });
    },

    checkBundleIsDownloadedByH5: function (packageName, callback) {
        if (!GlobalCfg.isH5) { // 非h5平台，直接返回
            callback && callback();
            return;
        }
        this.showProgress("Downloading Resources", 120);  // 显示进度, 120秒超时
        // 加载资源包
        cc.assetManager.loadBundle("ResourcesBundle", (err, bundle) => {
            if (err) {
                clearTimeout(timeout);  // 发生错误时清除定时器
                this.hidProgress();  // 隐藏进度条
                if (!isCallbackCalled) {
                    callback && callback(err);  // 调用失败回调
                    isCallbackCalled = true;  // 标记回调已被调用
                }
                return;
            }
            // 预加载资源包中的目录并获取进度
            bundle.preloadDir("NewPlan/" + packageName, (completedCount, totalCount) => {
                let rawProgress = completedCount / totalCount;  // 计算进度
                if (rawProgress >= 1) {
                    rawProgress = 1;
                }
                let progressStr = (rawProgress * 100).toFixed(2);
                let msgData = {
                    progress: progressStr,
                    packageName: packageName,
                };
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.GD_LOBBY_LOAD_PROGRESS,
                    msgData: msgData
                });

            }, (err) => {
                if (err) {
                } else {
                    this.hidProgress();  // 隐藏进度
                    callback && callback();  // 执行回调
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.GD_LOBBY_LOAD_COMPLETE,
                        msgData: {packageName: packageName}
                    });
                }
            });
        });
    },

    // 预加载H5模块资源
    perloadResByH5: function (packageName, callback) {
        if (!GlobalCfg.isH5) { // 非h5平台，直接返回
            callback && callback();
            return;
        }
        cc.assetManager.loadBundle("ResourcesBundle", (err, bundle) => {
            if (err) {
                clearTimeout(timeout);  // 发生错误时清除定时器
                this.hidProgress();  // 隐藏进度条
                return;
            }
            // 预加载资源包中的目录并获取进度
            bundle.preloadDir("NewPlan/" + packageName, () => {
            }, (err) => {
                if (err) {
                } else {
                    this.hidProgress();  // 隐藏进度
                }
            });
        });
    },

    /**
     * 判断脚本是否有效
     * @param {cc.Script} target 脚本实例化的对象
     */
    isValidForScr: function (target) {
        if (target && target.node && cc.isValid(target.node)) {
            return true;
        } else {
            return false;
        }
    },

    // 补0位 num传入的数字，n需要的字符长度
    prefixInteger: function (num, n) {
        return (Array(n).join(0) + num).slice(-n);
    },

    random: function (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },

    // 货币显示规范
    numberToShow: function (number, entrycondition) {
        if (entrycondition == 0) {
            return number;
        } else {
            let coin = parseInt(number) + '';
            if (coin.length >= 8) {
                let tcoin1 = (coin / 10000000 + '').split('.');
                coin = tcoin1[0] + (tcoin1[1] ? '.' + tcoin1[1].substring(0, 2) : '') + 'C';
                return coin;
            } else if (coin.length >= 6) {
                let tcoin2 = (coin / 100000 + '').split('.');
                coin = tcoin2[0] + (tcoin2[1] ? '.' + tcoin2[1].substring(0, 2) : '') + 'L';
                return coin;
            }
            return number;
        }
        ;
    },

    // 货币显示规范美术字 需要把.替换成x,美术字没有.
    numberToShow_byColor: function (label, num) {
        let cash = num / 100
        let str = CommonFun.getInstance().numberToShow(cash);
        label.string = str.toString().replace(".", "x");
    },

    // 货币显示规范 超过100万显示为xx.xM 超过1000显示为xx.xK
    numberToShow2: function (number, entrycondition) {
        if (entrycondition == 0) {
            return number; // 如果 entrycondition 为 0，直接返回原数字
        }
        let coin = parseInt(number); // 将输入转换为整数
        if (isNaN(coin)) {
            return number; // 如果转换失败，返回原数字
        }
        if (coin >= 1000000) {
            // 大于等于 100 万，转换为 "M" 单位
            let tcoin1 = (coin / 1000000).toFixed(2); // 保留两位小数
            return tcoin1.replace(/\.?0+$/, '') + 'M'; // 去掉末尾的 0 和小数点
        } else if (coin >= 1000) {
            // 大于等于 1000，转换为 "K" 单位
            let tcoin2 = (coin / 1000).toFixed(1); // 保留一位小数
            return tcoin2.replace(/\.?0+$/, '') + 'K'; // 去掉末尾的 0 和小数点
        }
        return number; // 其他情况返回原数字
    },

    getStrLength: function (str) {
        let realLength = 0,
            len = str.length,
            charCode = -1;
        for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
    },

    getStrByLength: function (str, length) {
        let realLength = 0, len = str.length, charCode = -1;
        let newStr = "";
        for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
            newStr += str[i];
            if (realLength >= length) {
                if (i !== len - 1)
                    newStr = newStr + "...";
                break;
            }
        }
        return newStr;
    },

    deleteLoginLocalStorage: function () {
        cc.sys.localStorage.removeItem("login_token");
        cc.sys.localStorage.removeItem("login_userid");
        GlobalCfg.USER_DATAS.userId = null;
        GlobalCfg.USER_DATAS.token = null;
    },

    showLabelLanguage: function (str, str1, str2) {
        let strName = '';
        for (let i = 0; i < dynamicChangeLabel.length; i++) {
            let arr = dynamicChangeLabel[i]
            let name = arr[1];
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
        return strName
    },

    /**
     * 展示商城
     * @param {Boolean} isFromFirstRecharge 直接展示商城
     * @returns
     */
    showNewShop: function (isFromFirstRecharge, from = '') {
        if (GlobalCfg.IS_CLUB_MODE == 1) {  //代理模式不跳转商城
            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {
            }, false);
            return;
        }
        if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
            CommonFun.getInstance().showMsgBox("Not yet open", "NO", () => {
            }, false);
            return
        }
        ;
        this._showShop(from);
    },

    debounce: function (action, delayTime) {
        if (!delayTime) {
            return action;
        }
        ;

        let fn = function () {
            let btnNode = arguments[0].node;
            if (!btnNode.timeOut && action) {
                action.apply(this, arguments);
                btnNode.timeOut = setTimeout(() => {
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

    getAllChildrensNodeList: function (root, path, viewList = {}) {
        for (let i = 0, len = root.childrenCount; i < len; i++) {
            viewList[path + root.children[i].name] = root.children[i];
            this.getAllChildrensNodeList(root.children[i], path + root.children[i].name + "/", viewList);
        }
        return viewList;
    },

    deepCopy: function (o) {
        // 判断如果不是引用类型，直接返回数据即可
        if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
            return o;
        } else if (Array.isArray(o)) { // 如果是数组，则定义一个新数组，完成复制后返回
            // 注意，这里判断数组不能用typeof，因为typeof Array 返回的是object
            // LoggerUtil.getInstance().log(typeof [])  // --> object
            let _arr = []
            o.forEach(item => {
                _arr.push(item)
            })
            return _arr;
        } else if (typeof o === 'object') {
            let _o = {}
            for (let key in o) {
                _o[key] = this.deepCopy(o[key])
            }
            return _o;
        }
    },

    arrayBufferToBase64: function (array) {
        array = new Uint8Array(array);
        let length = array.byteLength;
        let table = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/'
        ];
        let base64Str = '';
        let i = 0;
        for (i = 0; length - i >= 3; i += 3) {
            let num1 = array[i];
            let num2 = array[i + 1];
            let num3 = array[i + 2];
            base64Str += table[num1 >>> 2] +
                table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
                table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
                table[num3 & 0b111111];
        }
        let lastByte = length - i;
        if (lastByte === 1) {
            let lastNum1 = array[i];
            base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 0b11) << 4)] + '==';
        } else if (lastByte === 2) {
            let lastNum1 = array[i];
            let lastNum2 = array[i + 1];
            base64Str += table[lastNum1 >>> 2] +
                table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
                table[(lastNum2 & 0b1111) << 2] +
                '=';
        }
        return base64Str;
    },

    localConvertWorldPointAR: function (node) {
        if (!node) {
            return null;
        }
        ;
        return node.convertToWorldSpaceAR(cc.v2(0, 0));
    },

    localConvertWorldPoint: function (node) {
        if (!node) {
            return null;
        }
        return node.convertToWorldSpace(cc.v2(0, 0));
    },

    worldConvertLocalPointAR: function (node, worldPoint) {
        if (!node || !worldPoint) {
            return null;
        }
        return node.convertToNodeSpaceAR(worldPoint);
    },

    convertOtherNodeSpaceAR: function (node, targetNode) {
        if (!node || !targetNode) {
            return null;
        }
        let worldPos = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPos);
    },

    getCurTimeFormatByProof: function () {
        let nowdate = new Date();
        let month = nowdate.getMonth() + 1;
        let date = nowdate.getDate();
        let hour = nowdate.getHours();
        let minutes = nowdate.getMinutes();
        let seconds = nowdate.getSeconds();
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

        return `${date}/${month} ${hour}:${minutes}:${seconds}`;
    },

    /**
     * 加载预制体
     * @param {String} prefabPath 预制体路径
     */
    loadPrefabByPromise: function (prefabPath) {
        let arr = prefabPath.split("/");
        let bundleName = arr[0];
        let path = prefabPath.substring(bundleName.length + 1);
        LoggerUtil.getInstance().log(`Loading prefab ===> ${prefabPath}`);

        let assetBundle = cc.assetManager.getBundle(bundleName);
        return new Promise((resolve, reject) => {
            let doLoad = (bundle) => {
                bundle.load(path, cc.Prefab, (error, prefab) => {
                    if (!error) {
                        if (this._loadedPrefabMap.has(prefabPath) == false) {
                            prefab.addRef();
                            this._loadedPrefabMap.set(prefabPath, prefab);
                        }
                        ;

                        // ✅ 实例化一次，挂桥接脚本
                        let tempNode = cc.instantiate(prefab);
                        this._attachBridgeToEditBox(tempNode);
                        tempNode.destroy(); // 只是为了挂脚本，不留实例

                        resolve(prefab);
                    } else {
                        reject(error);
                    }
                });
            };

            if (assetBundle) {
                doLoad(assetBundle);
            } else {
                CommonFun.getInstance().loadBundle(bundleName, (bundle) => {
                    doLoad(bundle);
                }, (err) => reject(err));
            }
        });
    },

    /**
     * 扫描节点树，给所有 EditBox 挂上 EditBoxSoftKeyboardBridge
     */
    _attachBridgeToEditBox(rootNode) {
        if (!rootNode) return;
        const EditBoxSoftKeyboardBridge = require("EditBoxSoftKeyboardBridge");
        rootNode.walk((node) => {
            let editBox = node.getComponent(cc.EditBox);
            if (editBox && !node.getComponent(EditBoxSoftKeyboardBridge)) {
                node.addComponent(EditBoxSoftKeyboardBridge);
                let comp = node.addComponent(EditBoxSoftKeyboardBridge);
                cc.log("挂载结果", node.name, comp)
                cc.log('[Bridge Attached]', node.name);
            }
        });
    },

    /**
     * 释放预制体及其资源
     * @param {String} prefabPath 预制体路径
     */
    releasePrefab: function (prefabPath) {
        if (this._loadedPrefabMap.has(prefabPath)) {
            let prefab = this._loadedPrefabMap.get(prefabPath);
            if (prefab) {
                this._loadedPrefabMap.delete(prefabPath);
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
    addToPointParent(child, parentTag) {
        let parentNode = this.getLayerNode(parentTag);
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
    setLayerNode(tag, layerNode) {
        let has = this._layerNodeMap.has(tag);
        if (has) {
            this._layerNodeMap.delete(tag);
        }
        ;
        this._layerNodeMap.set(tag, layerNode);
    },

    /**
     * 获取LayerNode节点
     * @param {string} tag
     * @returns
     */
    getLayerNode(tag) {
        let layerNode = this._layerNodeMap.get(tag);
        return layerNode;
    },

    /**
     * 检测节点是否在父节点中
     * @param {string} path 节点路径
     * @param {*} parentTag 父节点Tag
     * @returns Boolean true:存在 false:不存在
     */
    checkNodeInParentNode(path, parentTag) {
        let parentNode = this.getLayerNode(parentTag);
        let arr = path.split("/");
        let nodeName = arr[arr.length - 1];
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
    showTips: function (content, direction = "horizontal") {
        let tipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TIPS);
        tipsPrefabPromise.then((prefab) => {
            let tipsNode = cc.instantiate(prefab);
            tipsNode.angle = direction == "horizontal" ? 0 : -90;
            let tipsCtrl = tipsNode.getComponent('TipsCtrl');
            tipsCtrl.setContent(content);
            this.addToPointParent(tipsNode, GlobalCfg.PREFAB_PARENT.TIPS);
        });
    },

    proloadProgress: function () {
        return new Promise((resolve, reject) => {
            let progressPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROGRESS);
            progressPrefabPromise.then((prefab) => {
                this._progressNode = cc.instantiate(prefab);
                this._progressNode.active = false;
                this.addToPointParent(this._progressNode, GlobalCfg.PREFAB_PARENT.PROGRESS);
                resolve();
            })
                .catch(() => {
                    reject();
                })
        });
    },

    /**
     * 显示进度框
     * @param {string} content 内容
     * @param {number} lastTime 持续时间
     */
    showProgress: function (content, lastTime = 15) {
        if (this._progressNode) {
            let progressCtrl = this._progressNode.getComponent('ProgressCtrl');
            progressCtrl.setContent(content);
            this._progressNode.active = true;

            this._progressTimer = setTimeout(() => {
                this.hidProgress();
            }, lastTime * 1000);
        }
        ;
    },

    /**
     * 隐藏进度框
     */
    hidProgress: function () {
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
    showMsgBox: function (content, msgBoxType, callFun, isShowCloseBtn, isNet, title, callFun2, horizontal = cc.Label.HorizontalAlign.CENTER, scale = 1) {
        let msgBoxPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.MSGBOX);
        msgBoxPrefabPromise.then((prefab) => {
            let msgBoxNode = cc.instantiate(prefab);
            msgBoxNode.scale = scale;
            let msgBoxCtrl = msgBoxNode.getComponent('MsgBoxCtrl');
            msgBoxCtrl.setContent(content, msgBoxType, callFun, isShowCloseBtn, title, callFun2, horizontal);
            this.addToPointParent(msgBoxNode, GlobalCfg.PREFAB_PARENT.MSGBOX);
        });
    },

    /**
     * 显示设置界面
     */
    showSetting: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Setting", () => {
            let settingPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SETTING);
            settingPrefabPromise.then((prefab) => {
                let settingNode = cc.instantiate(prefab);
                this.addToPointParent(settingNode, GlobalCfg.PREFAB_PARENT.SETTING);
            });
        });
    },

    /**
     * 打开游戏列表界面
     */
    showGameIconList: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameIconList", () => {
            let PrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEICONLIST);
            PrefabPromise.then((prefab) => {
                CommonFun.getInstance().addVerticalAcc();
                let Node = cc.instantiate(prefab);
                this.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.GAMEICONLIST);
            });
        });
    },

    /**
     * 小游戏中显示加金币
     * @param {string} gameName 游戏名称
     * @param {number} gameCoin 游戏底分
     */
    showSmallAddCash: function (gameName = null, gameCoin = null) {
        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        // if (rechargeNeedInfo) {
        //     if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        //         this.showNewShop();
        //     }
        //     else {
        //         // CommonFun.getInstance().showFirstRecharge();
        //         this.showBindPhone('AddCash');
        //     };
        // }
        // else {
        this.showNewShop();
        // };
    },

    /**
     * 小游戏中显示加经验
     */
    showSmallAddExperience: function () {
        let smallAddExperiencePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SMALLADDEXPERIENCE);
        smallAddExperiencePrefabPromise.then((prefab) => {
            let smallAddExperienceNode = cc.instantiate(prefab);
            let smallAddExperienceCtrl = smallAddExperienceNode.getComponent('SmallAddExperienceCtrl');
            this.addToPointParent(smallAddExperienceNode, GlobalCfg.PREFAB_PARENT.SMALLADDEXPERIENCE);
        });
    },

    /**
     * 小游戏中显示用户头像
     * @param {string} headUrl 用户头像地址
     * @param {string} playerName 用户昵称
     * @param {number} playerCoin 用户金币
     * @param {boolean} trial 是否是体验用户
     */
    showUserIU: function (headUrl = "", playerName = "", playerCoin = 0, trial = true) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("UserHead", () => {
            let userHeadPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.USERHEAD);
            userHeadPrefabPromise.then((prefab) => {
                let userHeadNode = cc.instantiate(prefab);
                let userHeadCtrl = userHeadNode.getComponent('UserHeadCtrl');
                userHeadCtrl.setUserDate(headUrl, playerName, playerCoin, trial);
                this.addToPointParent(userHeadNode, GlobalCfg.PREFAB_PARENT.USERHEAD);
            });
        });
    },

    /**
     * 显示金币散落动画
     */
    scatterGoldCoinsAim: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("ScatterCoin", () => {
            let scatterCoinPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SCATTERCOIN);
            scatterCoinPrefabPromise.then((prefab) => {
                let scatterCoinNode = cc.instantiate(prefab);
                let scatterCoinCtrl = scatterCoinNode.getComponent('ScatterCoinCtrl');
                this.addToPointParent(scatterCoinNode, GlobalCfg.PREFAB_PARENT.SCATTERCOIN);
            });
        });
    },

    /**
     * 显示领取奖励提示界面，点击领取按钮默认播放撒金币特效
     * @param {Array[{id,amount}]} coin 奖励金币
     */
    showRewardsTips: function (coin) {
        let count = 0;
        for (let i = 0; i < coin.length; i++) {
            count += coin[i].amount;
        }
        if (count <= 0) {
            return;
        }
        let rewardsTipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.REWARDSTIPS);
        rewardsTipsPrefabPromise.then((prefab) => {
            CommonFun.getInstance().scatterGoldCoinsAim();
            let rewardsTipsNode = cc.instantiate(prefab);
            let rewardsTipsCtrl = rewardsTipsNode.getComponent('RewardsTipsCtrl');
            rewardsTipsCtrl.setRewards(coin);
            this.addToPointParent(rewardsTipsNode, GlobalCfg.PREFAB_PARENT.REWARDSTIPS);
        });
    },

    /**
     * 发送文字，微表情
     * @param {string} notify 服务器下发的信息
     * @param {cc.Vec2} pos 位置
     */
    sendFace: function (notify, pos) {
        let chatActPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHATACT);
        chatActPrefabPromise.then((prefab) => {
            let chatActNode = cc.instantiate(prefab);
            let chatActCtrl = rewardsTipsNode.getComponent('ChatActCtrl');
            chatActCtrl.face(notify, pos);
            this.addToPointParent(chatActNode, GlobalCfg.PREFAB_PARENT.CHATACT);
        });
    },

    /**
     * 显示活动界面
     */
    showActivity: function (pointView = null) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Activity", () => {
            let activityPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY);
            activityPrefabPromise.then((prefab) => {
                let activityNode = cc.instantiate(prefab);
                let activityCtrl = activityNode.getComponent('ActivityCtrl');
                pointView && activityCtrl.setPointView(pointView);
                this.addToPointParent(activityNode, GlobalCfg.PREFAB_PARENT.ACTIVITY);
            });
        });
    },

    /**
     * 显示首充界面
     */
    showFirstRecharge: function () {
        let path = GlobalCfg.PREFAB_PATH.FIRSTRECHARGE;
        // if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
        //     path = GlobalCfg.PREFAB_PATH.FIRSTRECHARGE_V;
        // }
        let firstRechargePrefabPromise = this.loadPrefabByPromise(path);
        firstRechargePrefabPromise.then((prefab) => {
            let firstRechargeNode = cc.instantiate(prefab);
            let firstRechargeCtrl = firstRechargeNode.getComponent('FirstRechargeCtrl');
            this.addToPointParent(firstRechargeNode, GlobalCfg.PREFAB_PARENT.FIRSTRECHARGE);
        });
    },

    /**
     * 显示诱导充值界面
     */
    showInducement: function () {
        let isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.INDUCEMENT, GlobalCfg.PREFAB_PARENT.INDUCEMENT);
        if (isExist) {
            return;
        }
        ;

        CommonFun.getInstance().checkBundleIsDownloadedByH5("Inducement", () => {
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/RechargeInducement/GetInfo";
            CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
                if (msg.result == 0) {
                    GlobalCfg.USER_DATAS.inducement = msg.data;
                    let prefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.INDUCEMENT);
                    prefabPromise.then((prefab) => {
                        let node = cc.instantiate(prefab);
                        this.addToPointParent(node, GlobalCfg.PREFAB_PARENT.INDUCEMENT);
                    });
                }
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },

    /**
     * 显示联系我们界面
     */
    showContactUs: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("ContactUs", () => {
            let contactUsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CONTACTUS);
            contactUsPrefabPromise.then((prefab) => {
                let contactUsNode = cc.instantiate(prefab);
                let contactUsCtrl = contactUsNode.getComponent('ContactUsCtrl');
                this.addToPointParent(contactUsNode, GlobalCfg.PREFAB_PARENT.CONTACTUS);
            });
        });
    },

    showGameLoading: function(isVertical, callback) {
        let gameLoadingPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMELOADING);
        gameLoadingPrefabPromise.then((prefab) => {
            let gameLoadingNode = cc.instantiate(prefab);
            let gameLoadingCtrl = gameLoadingNode.getComponent('GameLoadingViewCtrl');
            if (isVertical){
                this._curOrientation = EnumOrientation.VERTICAL;
                APPManager.setOrientation('V');
            }
            gameLoadingCtrl.init(isVertical, callback);
            this.addToPointParent(gameLoadingNode, GlobalCfg.PREFAB_PARENT.GAMELOADING);
        });
    },

    /**
     * 显示内嵌网页界面
     */
    showGameWebview: function (gameId, isVertical, parentIndex) {
        if (GlobalCfg.USER_DATAS.isNotCharge == true) {   //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return;
        }
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/pg/game_url";
        let httpParam = {
            game_id: gameId,
        };
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
                APPManager.showWebView(msg.data.Url, isVertical);
            } else {
                GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.closeMusic(); //关闭背景音乐
                if (!isVertical) { //横板要切回横板
                    CommonFun.getInstance().decVerticalAcc();
                }
                let PrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWEBVIEW);
                PrefabPromise.then((prefab) => {
                    let Node = cc.instantiate(prefab);
                    let Ctrl = Node.getComponent('gameWebview');
                    Ctrl.setURL(msg.data.Url, isVertical, parentIndex, gameId)
                    this.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.CONTACTUS);
                });
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    /**
     * 获取俱乐部信息
     */
    getClubData: function (callback) {
        CommonFun.getInstance().showProgress();
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_club_info`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
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
    showWalletPanel: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("wallet", () => {
            this.getClubData(() => {
                let prefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WALLET);
                prefabPromise.then((prefab) => {
                    let Node = cc.instantiate(prefab);
                    this.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.WALLET);
                });
            })
        });
    },

    /**
     * 打开俱乐部
     */
    showClub: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("club", () => {
            this.getClubData(() => {
                let prefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CLUB);
                prefabPromise.then((prefab) => {
                    let Node = cc.instantiate(prefab);
                    this.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.CLUB);
                });
            })
        });
    },

    /**
     * 打开注册界面
     */
    showRegister: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("register", () => {
            let prefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.REGISTER);
            prefabPromise.then((prefab) => {
                let Node = cc.instantiate(prefab);
                this.addToPointParent(Node, GlobalCfg.PREFAB_PARENT.REGISTER);
            });
        });
    },

    /**
     * 添加跑马灯
     */
    addCarouselStrip: function () {
        this.removeCarouselStrip();
        let carouselStripPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CAROUSELSTRIP);
        carouselStripPrefabPromise.then((prefab) => {
            let carouselStripNode = cc.instantiate(prefab);
            let carouselStripCtrl = carouselStripNode.getComponent('CarouselStripCtrl');
            this.addToPointParent(carouselStripNode, GlobalCfg.PREFAB_PARENT.CAROUSELSTRIP);
        });
    },

    /**
     * 删除跑马灯
     */
    removeCarouselStrip: function () {
        try {
            let parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.CAROUSELSTRIP);
            let children = parentNode.children;
            for (let i = 0, len = children.length; i < len; i++) {
                let node = children[i];
                node.destroy();
            }
            ;
        } catch (error) {

        }
        ;
    },

    /**
     * 添加侧边栏
     */
    addSidebar: function () {
        let node = this.getSidebar();
        if (node) {
            return
        }
        let sideBarPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SIDEBAR);
        sideBarPrefabPromise.then((prefab) => {
            let sideBarNode = cc.instantiate(prefab);
            let activityModulesCtrl = sideBarNode.getComponent('activityModulesCtrl');
            this.addToPointParent(sideBarNode, GlobalCfg.PREFAB_PARENT.SIDEBAR);
        });
    },

    /**
     * 删除侧边栏
     */
    removeSidebar: function () {
        let node = this.getSidebar();
        if (node) {
            node.destroy();
        }
    },

    /**
     * 更新侧边栏数据
     * @param {Boolean} bool 是否展开
     */
    updateSidebarData: function (bool) {
        let node = this.getSidebar();
        if (node) {
            let activityModulesCtrl = node.getComponent('activityModulesCtrl');
            activityModulesCtrl.setShowState(bool);
            activityModulesCtrl.checkActivity();
        }
    },

    /**
     * 隐藏侧边栏
     */
    hideSidebarData: function () {
        let node = this.getSidebar();
        if (node) {
            let activityModulesCtrl = node.getComponent('activityModulesCtrl');
            activityModulesCtrl.setHideActivity();
        }
        ;
    },


    getSidebar: function () {
        let resultNode = null;
        let name = GlobalCfg.PREFAB_PATH.SIDEBAR.split("/").pop();
        let parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.SIDEBAR);
        let children = parentNode.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.name == name) {
                resultNode = node;
                break
            }
        }
        ;
        return resultNode;
    },

    /**
     * 显示评分界面
     */
    showRateUs: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("RateUs", () => {
            let rateUsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RATEUS);
            rateUsPrefabPromise.then((prefab) => {
                let rateUsNode = cc.instantiate(prefab);
                let rateUsCtrl = rateUsNode.getComponent('RateUsCtrl');
                this.addToPointParent(rateUsNode, GlobalCfg.PREFAB_PARENT.RATEUS);
            });
        });
    },

    /**
     * 显示绑定手机奖励界面
     */
    showBindPhoneRewards: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("BindPhoneRewards", () => {
            let bindPhoneRewardsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BINDPHONEREWARDS);
            bindPhoneRewardsPrefabPromise.then((prefab) => {
                let bindPhoneRewardsNode = cc.instantiate(prefab);
                let bindPhoneRewardsCtrl = bindPhoneRewardsNode.getComponent('BindPhoneRewardsCtrl');
                this.addToPointParent(bindPhoneRewardsNode, GlobalCfg.PREFAB_PARENT.BINDPHONEREWARDS);
            });
        });
    },

    /**
     * 强制引导弹窗
     */
    showHallTip: function () {
        LoggerUtil.getInstance().log("showHallTip GlobalCfg.Forced_Migration: ", GlobalCfg.Forced_Migration);
        // //需求：强制引导用户点击跳转
        let NeedShowForceVersion = cc.sys.localStorage.getItem("NeedShowForceVersion");
        if (NeedShowForceVersion == null) {
            NeedShowForceVersion = 0
        }
        LoggerUtil.getInstance().log("showHallTip NeedShowForceVersion: ", NeedShowForceVersion);
        let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
        let Channel = ""
        if (packageChannel && packageChannel.indexOf("_") != -1) {
            let packageChannelArr = packageChannel.split("_");
            Channel = Number(packageChannelArr[1]);
        }
        LoggerUtil.getInstance().log("showHallTip Channel: ", Channel);
        if (GlobalCfg.Forced_Migration && Channel != "") {
            let data = GlobalCfg.Forced_Migration[Channel] //指定渠道号
            LoggerUtil.getInstance().log("showHallTip data: ", data);
            if (data && data.version >= NeedShowForceVersion) { //低于服务器设定的需要弹窗的版本号 则弹窗
                let hallTipPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.HALLTIP);
                hallTipPrefabPromise.then((prefab) => {
                    let bhallTipNode = cc.instantiate(prefab);
                    let bhallTipCtrl = bhallTipNode.getComponent('HallTipCtrl');
                    bhallTipCtrl.setHallTipData(data);
                    this.addToPointParent(bhallTipNode, GlobalCfg.PREFAB_PARENT.HALLTIP);
                });
            }
        }
    },

    /**
     * 显示绑定手机界面
     * @param {String} str  Lobby (大厅) Personal (个人中心) AddCash (充值填写)
     */
    showBindPhone: function (str = 'Lobby') {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("BindPhone", () => {
            let bindPhonePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BINDPHONE);
            bindPhonePrefabPromise.then((prefab) => {
                CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MOBILE_VIEW);
                let bindPhoneNode = cc.instantiate(prefab);
                let bindPhoneCtrl = bindPhoneNode.getComponent('BindPhoneCtrl');
                bindPhoneCtrl.setNodeStateStr(str);
                this.addToPointParent(bindPhoneNode, GlobalCfg.PREFAB_PARENT.BINDPHONE);
            });
        });
    },

    /**
     * 显示推广员界面
     */
    showPromoter: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("promoter", () => {
            let promoterPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTER);
            promoterPrefabPromise.then((prefab) => {
                let promoterNode = cc.instantiate(prefab);
                let promoterCtrl = promoterNode.getComponent('PromoterCtrl');
                this.addToPointParent(promoterNode, GlobalCfg.PREFAB_PARENT.PROMOTER);
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
    promoterSkipToOtherApp: function (btnName) {
        let inviteCode = `?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
        let shareStrtmp = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！";
        let shareUrls = GlobalCfg.APP_SHARE_URL + inviteCode;
        if (btnName == 'btn_telegram') {
            let str = "https://t.me/share/url?text=" + encodeURIComponent(shareStrtmp) + "&url=" + encodeURIComponent(shareUrls);
            cc.sys.openURL(str);
        }
        if (btnName == 'btn_fb') {
            let str = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrls);
            LoggerUtil.getInstance().log("promoterSkipToOtherApp shareStr", str);
            cc.sys.openURL(str);
        }
        if (btnName == 'btn_whatsapp') {
            let str = "https://wa.me/?text=" + encodeURIComponent(shareStrtmp + "    " + shareUrls);
            cc.sys.openURL(str);
        }
        if (btnName == 'btn_share') {
            let shareUrl = `Your cash will expire in three hours, download the No.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.copyToPasteBoard(shareUrl);
            CommonFun.getInstance().showTips("Copy successful!");
            APPManager.Share(shareUrl);
        }
    },


    /**
     * 显示推广员左侧界面
     * @param {string} typeStr 显示类型
     */
    showPromoterLeftView: function (typeStr) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("promoter", () => {
            let promoterLeftViewPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTERLEFTVIEW);
            promoterLeftViewPrefabPromise.then((prefab) => {
                let promoterLeftViewNode = cc.instantiate(prefab);
                let promoterLeftViewCtrl = promoterLeftViewNode.getComponent('PromoterLeftViewCtrl');
                promoterLeftViewCtrl.showLeftViewByTypeStr(typeStr);
                this.addToPointParent(promoterLeftViewNode, GlobalCfg.PREFAB_PARENT.PROMOTERLEFTVIEW);
            });
        });
    },

    /**
     * 显示救济金界面
     */
    showRelief: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Relief", () => {
            let reliefPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RELIEF);
            reliefPrefabPromise.then((prefab) => {
                let reliefNode = cc.instantiate(prefab);
                let reliefCtrl = reliefNode.getComponent('ReliefCtrl');
                this.addToPointParent(reliefNode, GlobalCfg.PREFAB_PARENT.RELIEF);
            });
        });
    },

    /**
     * 显示邮箱界面
     */
    showEmail: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Email", () => {
            let emailPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.EMAIL);
            emailPrefabPromise.then((prefab) => {
                let emailNode = cc.instantiate(prefab);
                let emailCtrl = emailNode.getComponent('EmailCtrl');
                this.addToPointParent(emailNode, GlobalCfg.PREFAB_PARENT.EMAIL);
            });
        });
    },

    /**
     * 显示反馈邮件界面
     */
    showFeedbackMail: function (dataContent, emailCtrl) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Feedback", () => {
            let feedbackMailPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FEEDBACKEMAIL);
            feedbackMailPrefabPromise.then((prefab) => {
                let feedbackMailNode = cc.instantiate(prefab);
                let feedbackMailCtrl = feedbackMailNode.getComponent('FeedbackMailCtrl');
                feedbackMailCtrl.setState(dataContent, emailCtrl);
                this.addToPointParent(feedbackMailNode, GlobalCfg.PREFAB_PARENT.FEEDBACKEMAIL);
            });
        });
    },

    /**
     * 显示超级折扣界面
     */
    showSuperDiscount: function () {
        let isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT, GlobalCfg.PREFAB_PARENT.SUPERDISCOUNT);
        if (isExist) {
            return;
        }
        ;
        CommonFun.getInstance().checkBundleIsDownloadedByH5("SuperDiscount", () => {
            let superDiscountPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT);
            superDiscountPrefabPromise.then((prefab) => {
                let superDiscountNode = cc.instantiate(prefab);
                let superDiscountCtrl = superDiscountNode.getComponent('SuperDiscountCtrl');
                superDiscountCtrl.initByType();
                this.addToPointParent(superDiscountNode, GlobalCfg.PREFAB_PARENT.SUPERDISCOUNT);
            });
        });
    },

    /**
     * 显示客服界面
     */
    showCustomerService: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("CustomerService", () => {
            let customerServicePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CUSTOMERSERVICE);
            customerServicePrefabPromise.then((prefab) => {
                let customerServiceNode = cc.instantiate(prefab);
                let customerServiceCtrl = customerServiceNode.getComponent('CustomerServiceCtrl');
                this.addToPointParent(customerServiceNode, GlobalCfg.PREFAB_PARENT.CUSTOMERSERVICE);
            });
        });
    },

    /**
     * 显示快速反馈界面
     */
    showFastFeedBack: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("FastFeedBack", () => {
            let fastFeedBackPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FASTFEEDBACK);
            fastFeedBackPrefabPromise.then((prefab) => {
                let fastFeedBackNode = cc.instantiate(prefab);
                let fastFeedBackCtrl = fastFeedBackNode.getComponent('FastFeedBackCtrl');
                this.addToPointParent(fastFeedBackNode, GlobalCfg.PREFAB_PARENT.FASTFEEDBACK);
            });
        });
    },

    /**
     * 显示个人中心界面
     */
    showPersonal: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Personal", () => {
            // this.getClubData(() => {
                let personalPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PERSONAL);
                personalPrefabPromise.then((prefab) => {
                    let personalNode = cc.instantiate(prefab);
                    let personalCtrl = personalNode.getComponent('PersonalCtrl');
                    this.addToPointParent(personalNode, GlobalCfg.PREFAB_PARENT.PERSONAL);
                });
            // });
        });
    },

    /**
     * 显示个人中心修改昵称界面
     */
    showChangeName: function () {

        let changeNamePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGENAME);
        changeNamePrefabPromise.then((prefab) => {
            let changeNameNode = cc.instantiate(prefab);
            let changeNameCtrl = changeNameNode.getComponent('ChangeNameCtrl');
            this.addToPointParent(changeNameNode, GlobalCfg.PREFAB_PARENT.CHANGENAME);
        });
    },

    /**
     * 显示个人中心修改头像界面
     */
    showChangeHead: function () {
        let changeHeadPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGEHEAD);
        changeHeadPrefabPromise.then((prefab) => {
            let changeHeadNode = cc.instantiate(prefab);
            let changeHeadCtrl = changeHeadNode.getComponent('ChangeHeadCtrl');
            this.addToPointParent(changeHeadNode, GlobalCfg.PREFAB_PARENT.CHANGEHEAD);
        });
    },
    /**
     * 显示奖励转移界面
     */
    showBonusTransfer: function () {
        let bonusTransferPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BONUSTRANSFER);
        bonusTransferPrefabPromise.then((prefab) => {
            let bonusTransferNode = cc.instantiate(prefab);
            let bonusTransferCtrl = bonusTransferNode.getComponent('BonusTransferCtrl');
            this.addToPointParent(bonusTransferNode, GlobalCfg.PREFAB_PARENT.BONUSTRANSFER);
        });
    },

    /**
     * 预加载选择房间界面
     */
    proloadSelectRoom: function () {
        return new Promise((resolve, reject) => {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("SelectRoom", () => {
            let selectRoomPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SELECTROOM);
            selectRoomPrefabPromise.then((prefab) => {
                this._selectRoomNode = cc.instantiate(prefab);
                this._selectRoomNode.active = false;
                this.addToPointParent(this._selectRoomNode, GlobalCfg.PREFAB_PARENT.SELECTROOM);
                resolve();
            })
            .catch(() => {
                reject();
            })});
        });
    },

    /**
     * 显示选择房间界面
     */
    showSelectRoom: function () {
        if (this._selectRoomNode) {
            CommonFun.getInstance().updateSidebarData(false);
            this._selectRoomNode.active = true;
            let selectRoomCtrl = this._selectRoomNode.getComponent('selectRoomCtrl');
            if (selectRoomCtrl) {
                selectRoomCtrl && selectRoomCtrl.showPointGameRoom();
            } else {
                LoggerUtil.getInstance().log("3333333333 selectRoomCtrl is null");
            }
        }
        else{
            CommonFun.getInstance().checkBundleIsDownloadedByH5("SelectRoom", () => {
                let selectRoomPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SELECTROOM);
                selectRoomPrefabPromise.then((prefab) => {
                    this._selectRoomNode = cc.instantiate(prefab);
                    this.addToPointParent(this._selectRoomNode, GlobalCfg.PREFAB_PARENT.SELECTROOM);
                    let selectRoomCtrl = this._selectRoomNode.getComponent('selectRoomCtrl');
                    if (selectRoomCtrl) {
                        selectRoomCtrl && selectRoomCtrl.showPointGameRoom();
                    } else {
                        LoggerUtil.getInstance().log("3333333333 selectRoomCtrl is null");
                    }
                })
            })
        }
    },

    /**
     * 隐藏选择房间界面
     */
    hideSelectRoom: function () {
        if (this._selectRoomNode) {
            CommonFun.getInstance().updateSidebarData(true);
            this._selectRoomNode.active = false;
        }
        ;
    },

    /**
     * 显示每日奖励卡片
     */
    showDailyBonusCard: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("DailyBonusCard", () => {
            let dailyBonusCardPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.DAILYBONUSCARD);
            dailyBonusCardPrefabPromise.then((prefab) => {
                let dailyBonusCardNode = cc.instantiate(prefab);
                let dailyBonusCardCtrl = dailyBonusCardNode.getComponent('DailyBonusCardCtrl');
                this.addToPointParent(dailyBonusCardNode, GlobalCfg.PREFAB_PARENT.DAILYBONUSCARD);
            });
        });
    },

    /**
     * 显示新人礼品界面
     */
    showFirstGiftDiamond: function () {
        let firstGiftDiamondPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.FIRSTGIFTDIAMOND);
        firstGiftDiamondPrefabPromise.then((prefab) => {
            let firstGiftDiamondNode = cc.instantiate(prefab);
            let firstGiftDiamondCtrl = firstGiftDiamondNode.getComponent('FirstGiftDiamondCtrl');
            this.addToPointParent(firstGiftDiamondNode, GlobalCfg.PREFAB_PARENT.FIRSTGIFTDIAMOND);
        });
    },

    /**
     * 显示规则界面
     * @param {string} typeStr
     */
    showRule: function (typeStr) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Rule", () => {
            let rulePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.RULE);
            rulePrefabPromise.then((prefab) => {
                let ruleNode = cc.instantiate(prefab);
                let ruleCtrl = ruleNode.getComponent('RuleCtrl');
                ruleCtrl.SmallGameRule(typeStr);
                this.addToPointParent(ruleNode, GlobalCfg.PREFAB_PARENT.RULE);
            });
        });
    },

    /**
     * 显示隐私政策/隐私政策界面
     * @param {number} urlType 1: 用户协议 2: 隐私政策
     */
    showPrivacyPolicy: function (urlType) {
        let privacyPolicyPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PRIVACYPOLICY);
        privacyPolicyPrefabPromise.then((prefab) => {
            let privacyPolicyNode = cc.instantiate(prefab);
            let privacyPolicyCtrl = privacyPolicyNode.getComponent('PrivacyPolicyCtrl');
            privacyPolicyCtrl.setUrlType(urlType);
            this.addToPointParent(privacyPolicyNode, GlobalCfg.PREFAB_PARENT.PRIVACYPOLICY);
        });
    },

    _showShop: function (from) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Shop", () => {
            this.getPayChannel((payData) => {
                let shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOP);
                shopPrefabPromise.then((prefab) => {
                    CommonFun.getInstance().addVerticalAcc();
                    let shopNode = cc.instantiate(prefab);
                    let shopCtrl = shopNode.getComponent("ShopCtrl");
                    shopCtrl.setPayChannel(payData);
                    shopCtrl.setJumpFrom(from);
                    this.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOP);
                });
            });
        });
    },

    showPayChannel: function (infos, callback) {
        LoggerUtil.getInstance().log('callback =', callback);
        this.getPayChannel((payData) => {
            let shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPCHANNEL);
            shopPrefabPromise.then((prefab) => {
                let shopNode = cc.instantiate(prefab);
                let shopChannel = shopNode.getComponent("shopChannel");
                shopChannel.setData(payData, infos, callback);
                this.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPCHANNEL);
            });
        });
    },

    _showShopNewTip: function (changed, coin, bonus, is10Precent, remind) {
        LoggerUtil.getInstance().error('changed:' + changed + ' coin:' + coin + ' bonus:' + bonus);
        if (is10Precent) {
            let shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPNEWTIP10);
            shopPrefabPromise.then((prefab) => {
                let shopNode = cc.instantiate(prefab);
                let shopCtrl = shopNode.getComponent("ShopNewTip10Ctrl");
                shopCtrl.setStartCoin(changed, coin, bonus, remind);
                this.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPNEWTIP10);
            });
        } else {
            let shopPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPNEWTIP);
            shopPrefabPromise.then((prefab) => {
                let shopNode = cc.instantiate(prefab);
                let shopCtrl = shopNode.getComponent("ShopNewTipCtrl");
                shopCtrl.setStartCoin(changed, coin, bonus);
                this.addToPointParent(shopNode, GlobalCfg.PREFAB_PARENT.SHOPNEWTIP);
            });
        }
    },

    /**
     * 显示充值说明界面
     */
    showShopInstructions: function () {
        let shopInstructionsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPINSTRUCTIONS);
        shopInstructionsPrefabPromise.then((prefab) => {
            let shopInstructionsNode = cc.instantiate(prefab);
            this.addToPointParent(shopInstructionsNode, GlobalCfg.PREFAB_PARENT.SHOPINSTRUCTIONS);
        });
    },

    /**
     * 展示提现界面
     * @param {Function} callback
     */
    showWithDraw: function (callback) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Withdraw", () => {
            let withdrawPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAW);
            withdrawPrefabPromise.then((prefab) => {
                CommonFun.getInstance().addVerticalAcc();
                let withdrawNode = cc.instantiate(prefab);
                callback && callback();
                this.addToPointParent(withdrawNode, GlobalCfg.PREFAB_PARENT.WITHDRAW);
            });
        });
    },


    /**
     * 展示提现界面回调的提示框
     * @param {string} btnTipsType
     * @param {string} content
     * @param {Function} callFun
     */
    showWithDrawTips: function (btnTipsType, content, callFun) {
        let withdrawTipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWTIPS);
        withdrawTipsPrefabPromise.then((prefab) => {
            let withDrawTipsNode = cc.instantiate(prefab);
            let withDrawTipsCtrl = withDrawTipsNode.getComponent("WithDrawTipsCtrl");
            withDrawTipsCtrl.setWithDrawTipsData(btnTipsType, content, callFun);
            this.addToPointParent(withDrawTipsNode, GlobalCfg.PREFAB_PARENT.WITHDRAWTIPS);
        });
    },

    /**
     * 显示交易记录界面
     */
    showTransactionRecord: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", () => {
            let transactionRecordPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORD);
            transactionRecordPrefabPromise.then((prefab) => {
                CommonFun.getInstance().addVerticalAcc();
                let transactionRecordNode = cc.instantiate(prefab);
                this.addToPointParent(transactionRecordNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORD);
            });
        });
    },


    /**
     * 显示交易记录界的说明提示框
     */
    showTransactionRecordTips: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", () => {
            let transactionRecordTipsPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDTIPS);
            transactionRecordTipsPrefabPromise.then((prefab) => {
                let transactionRecordTipsNode = cc.instantiate(prefab);
                this.addToPointParent(transactionRecordTipsNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORDTIPS);
            });
        });
    },

    /**
     * 显示交易记录界面的“help”提示框
     */
    showTransactionRecordHelp: function (data) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("TransactionRecord", () => {
            let transactionRecordHelpPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDHELP);
            transactionRecordHelpPrefabPromise.then((prefab) => {
                let transactionRecordHelpNode = cc.instantiate(prefab);
                let transactionRecordHelpCtrl = transactionRecordHelpNode.getComponent('TransactionRecordHelpCtrl');
                transactionRecordHelpCtrl.setTransactionRecordHelpData(data);
                this.addToPointParent(transactionRecordHelpNode, GlobalCfg.PREFAB_PARENT.TRANSACTIONRECORDHELP);
            });
        });
    },

    /**
     * 显示提现诱导弹框
     */
    showPopUpWithDraw: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("PopUpWithDraw", () => {
            let popUpWithDrawPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.POPUPWITHDRAW);
            popUpWithDrawPrefabPromise.then((prefab) => {
                let popUpWithDrawNode = cc.instantiate(prefab);
                this.addToPointParent(popUpWithDrawNode, GlobalCfg.PREFAB_PARENT.POPUPWITHDRAW);
            });
        });
    },

    /**
     * 展示填写提现资料界面
     */
    showWithDrawPreData: function () {
        this.showProgress();
        let withdrawPreDataPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWPREDATA);
        withdrawPreDataPrefabPromise.then((prefab) => {
            let withdrawalPreDataNode = cc.instantiate(prefab);
            let data = GlobalCfg.USER_DATAS.transferAddress;
            let withDrawPreDataCtrl = withdrawalPreDataNode.getComponent('WithDrawPreDataCtrl');
            withDrawPreDataCtrl.setData(data);
            this.addToPointParent(withdrawalPreDataNode, GlobalCfg.PREFAB_PARENT.WITHDRAWPREDATA);
            this.hidProgress();
        })
    },

    /**
     * 展示提现错误弹窗提示
     * @param {Object} data { }
     */
    showWithDrawError: function (data) {
        let orderId = data.orderId;
        let amount = Number(data.amount);
        let createTime = Number(data.createTime);
        let func = (time) => {
            let date = new Date(time);
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()

            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            return year + "/" + month + "/" + day + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        };
        let time = func(createTime * 1000);
        let msg = data.errMsg;
        let withdrawPreDataPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWERRORTIPS);
        withdrawPreDataPrefabPromise.then((prefab) => {
            let withDrawErrorTipsNode = cc.instantiate(prefab);
            let WithDrawErrorTipsCtrl = withDrawErrorTipsNode.getComponent("WithDrawErrorTipsCtrl");
            WithDrawErrorTipsCtrl.setErrData(orderId, amount, time, msg);
            this.addToPointParent(withDrawErrorTipsNode, GlobalCfg.PREFAB_PARENT.WITHDRAWERRORTIPS);
        });
    },


    /**
     * 展示提现分享界面
     */
    showWithDrawShare: function () {
        let withdrawSharePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWSHARE);
        withdrawSharePrefabPromise.then((prefab) => {
            let withdrawShareNode = cc.instantiate(prefab);
            this.addToPointParent(withdrawShareNode, GlobalCfg.PREFAB_PARENT.WITHDRAWSHARE);
        });
    },


    /**
     * 首充之后，清空金币弹窗提示
     * @param {Boolean} bool 是否可以直接关闭
     */
    showAdvancedMode: function (bool) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("AdvancedMode", () => {
            let path = GlobalCfg.PREFAB_PATH.ADVANCEDMODE;
            let parentNode = GlobalCfg.PREFAB_PARENT.ADVANCEDMODE;
            if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
                path = GlobalCfg.PREFAB_PATH.ADVANCEDMODE_V;
                parentNode = GlobalCfg.PREFAB_PARENT.ADVANCEDMODE;
            }
            let advancedModePrefabPromise = this.loadPrefabByPromise(path);
            advancedModePrefabPromise.then((prefab) => {
                let advancedModeNode = cc.instantiate(prefab);
                let advancedModeCtrl = advancedModeNode.getComponent("AdvancedModeCtrl");
                this.addToPointParent(advancedModeNode, parentNode);
                advancedModeCtrl.show(bool);
            });
        });
    },

    /**
     *
     */
    showNewRechargeTip: function () {
        let path = GlobalCfg.PREFAB_PATH.NEW_FIRSTRECHARGETIPS;
        let parentNode = GlobalCfg.PREFAB_PARENT.FIRSTRECHARGETIPS;
        if (GlobalCfg.CURSCENE_DIRECTION == "vertical") {
            let shopParentNode = CommonFun.getInstance().getLayerNode(GlobalCfg.PREFAB_PARENT.SHOP);
            if (cc.isValid(shopParentNode.getChildByName("newshop"))) {
                shopParentNode.getChildByName("newshop").destroy();
            }
            if (cc.isValid(shopParentNode.getChildByName("newWithdrawal"))) {
                shopParentNode.getChildByName("newWithdrawal").destroy();
            }
        }
        APPManager.setOrientation("H");
        let firstRechargePrefabPromise = this.loadPrefabByPromise(path);
        firstRechargePrefabPromise.then((prefab) => {
            let firstRechargeTipsNode = cc.instantiate(prefab);
            this.addToPointParent(firstRechargeTipsNode, parentNode);
        });
    },

    /**
     * 展示Go Betting活动
     */
    showGoBetting: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("ConsumerActivities", () => {
            let goBettingPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_GOBETTING);
            goBettingPrefabPromise.then((prefab) => {
                let goBettingNode = cc.instantiate(prefab);
                let consumerActivities = goBettingNode.getComponent("ConsumerActivities");
                this.addToPointParent(goBettingNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_GOBETTING);
            });
        });
    },

    showPddActivity: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("PDD", () => {
            let pddPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_PDD_FIRST);
            pddPrefabPromise.then((prefab) => {
                let pddFirstNode = cc.instantiate(prefab);
                let firstCtrl = pddFirstNode.getComponent("firstCtrl");
                this.addToPointParent(pddFirstNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_PDD);
            });
        });
    },

    // 服务器重启
    showServerReload: function (data) {
        let title = data.title;
        let content = data.content;
        let kind = data.kind;
        this.showMsgBox(content, "YES", null, false, false, title);
    },

    /**
     * 游戏中显示破产充值
     * @param {Number} curGameMinEnter 当前游戏最小准入
     * @param {Number} curGameCurRoundBetNum 当前游戏当前局下注金额
     * @param {Function} callback 回调函数
     */
    gameShowSecondRecharge: function (curGameMinEnter, curGameCurRoundBetNum = 0, callback) {
        let BrokeGift_ShowInGame_Rate = parseFloat(CommonFun.getInstance().getAppConfigValueByKey('BrokeGift_ShowInGame_Rate', 0.2));
        // let rate = GlobalCfg.USER_DATAS.recharged * BrokeGift_ShowInGame_Rate
        let rate = 20 // 固定0.2
        if (GlobalCfg.USER_DATAS.openModules.includes(23) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0 && GlobalCfg.USER_DATAS.only_pay_time == 0) {
            if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < rate) {
                this.checkCanShowOnlyPay(callback, () => {
                    if (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0) {
                        if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < rate) {
                            this.showBankruptcy();
                            if (callback) {
                                callback();
                            }
                        }
                    }
                });
            }
        } else if (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged && curGameCurRoundBetNum > 0) {
            if (GlobalCfg.USER_DATAS.userDiamond < curGameMinEnter || GlobalCfg.USER_DATAS.userDiamond < rate) {
                this.showBankruptcy();
                if (callback) {
                    callback();
                }
            }
        }
    },

    updateToastLocalStorageByHours: function (toastType, hours) {
        /**
         * 当前毫秒级的时间戳
         */
        let curTimeStamp = new Date().getTime();
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                    toastLocalData.showTag = `${curTimeStamp}`;
                    cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
                }
                ;

            } catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
            }
            ;
        } else {
            let toastLocalData = {
                showTag: curTimeStamp
            };
            cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`, JSON.stringify(toastLocalData));
        }
        ;
    },

    /**
     * 根据本地缓存判断是否需要显示弹框
     * @param {*} toastType 弹框类型
     * @param {*} hours 间隔几个小时
     */
    isNeedShowPointToastByHours: function (toastType, hours) {
        /**
         * 当前毫秒级的时间戳
         */
        let curTimeStamp = new Date().getTime();
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                    return true;
                } else {
                    return false;
                }
                ;
            } catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
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
    reportToTelegram: function (info) {
        let appInfo = {
            UserId: GlobalCfg.USER_DATAS.userId,
            Channel: GlobalCfg.CHANNEL_INFO,
            PackageName: GlobalCfg.GOOGLE_ID,
            AppVersion: GlobalCfg.ASSETS_VERSION
        };
        let url = "https://api.telegram.org/bot6678922305:AAEBmVbT_O-jkzCOpR-pCKWnabi6cV-U6TY/sendMessage";
        let params = {
            chat_id: "-4071072256",
            text: `【基本信息】:\n ${JSON.stringify(appInfo)}\n【异常信息】:\n ${JSON.stringify(info)}`
        };
        this.httpPost(url, params, (msg) => {
        });
    },

    /**
     * 显示我的VIP
     */
    showMyVip: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let myVipPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.MYVIP);
            myVipPrefabPromise.then((prefab) => {
                let myVipNode = cc.instantiate(prefab);
                this.addToPointParent(myVipNode, GlobalCfg.PREFAB_PARENT.MYVIP);
            });
        });
    },

    /**
     * 显示VIP幸运抽奖
     */
    showVipLuckyDraw: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipLuckyDrawPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPLUCKYDRAW);
            vipLuckyDrawPrefabPromise.then((prefab) => {
                let vipLuckyDrawNode = cc.instantiate(prefab);
                this.addToPointParent(vipLuckyDrawNode, GlobalCfg.PREFAB_PARENT.VIPLUCKYDRAW);
            });
        });
    },

    /**
     * 显示VIP规则
     */
    showVipRules: function (childViewType = "vipRules") {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipRulesPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULES);
            vipRulesPrefabPromise.then((prefab) => {
                let vipRulesNode = cc.instantiate(prefab);
                let scr = vipRulesNode.getComponent("VipRulesCtrl");
                scr.setVipRulesChildViewType(childViewType);
                this.addToPointParent(vipRulesNode, GlobalCfg.PREFAB_PARENT.VIPRULES);
            });
        });
    },


    /**
     * 显示VIP奖励弹框
     * @param {number} amount
     * @param {boolean} isBonus
     */
    showVipRewardToast: function (amount, isBonus) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipRewardToastPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPREWARDTOAST);
            vipRewardToastPrefabPromise.then((prefab) => {
                let vipRewardToastNode = cc.instantiate(prefab);
                let vipRewardToastCtrl = vipRewardToastNode.getComponent("VipRewardToastCtrl");
                this.addToPointParent(vipRewardToastNode, GlobalCfg.PREFAB_PARENT.VIPREWARDTOAST);
                vipRewardToastCtrl.setVipRewardToastAmount(amount, isBonus);
            });
        });
    },

    /**
     * 显示VIP充值弹框
     */
    showVipRechargeToast: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipRechargeToastPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRECHARGETOAST);
            vipRechargeToastPrefabPromise.then((prefab) => {
                let vipRechargeToastNode = cc.instantiate(prefab);
                this.addToPointParent(vipRechargeToastNode, GlobalCfg.PREFAB_PARENT.VIPRECHARGETOAST);
            });
        });
    },

    /**
     * 显示VIP升级弹框
     */
    showVipUpgradeToast: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipUpgradeToastPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPUPGRADETOAST);
            vipUpgradeToastPrefabPromise.then((prefab) => {
                let vipUpgradeToastNode = cc.instantiate(prefab);
                this.addToPointParent(vipUpgradeToastNode, GlobalCfg.PREFAB_PARENT.VIPUPGRADETOAST);
            });
        });
    },

    /**
     * 显示VIP快充弹框
     */
    showVipForOnceToast: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("MyVip", () => {
            let vipForOnceToastPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPFORONCETOAST);
            vipForOnceToastPrefabPromise.then((prefab) => {
                let vipForOnceToastNode = cc.instantiate(prefab);
                this.addToPointParent(vipForOnceToastNode, GlobalCfg.PREFAB_PARENT.VIPFORONCETOAST);
            });
        });
    },

    /**
     * 判断是否可以坐在VIP座位
     * @param {number} level VIP等级
     */
    isCanSitVipSeatByLevel: function (level) {
        for (let i = 0, len = GlobalCfg.USER_DATAS.vipLevels.length; i < len; i++) {
            const element = GlobalCfg.USER_DATAS.vipLevels[i];
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
    isCanShowVIPFontByLevel: function (level) {
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
    isOpenVipModule: function () {
        if (GlobalCfg.USER_DATAS.openModules.includes(21)) {
            return true;
        }
        ;
        return false;
    },

    encryptByRSA: function (str) {
        let JSEncrypt = require('./jsencrypt.min.js');
        /**
         * 公钥，勿动！！！
         */
        let publicKey = `-----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAssbvb8tFKSeAruFDokaF
        AkCxcPL+5zNeJUXQgciH8lhx31Gdhnmbka6MlyNcCypSGN7u0F+CLgZ+HU7mgSsr
        jnXYG50d9jJlVU2ga0PoC7FGHIDzbTSEUhsCUP8KGZtP2gVm44je4aocU+FShgHv
        FXpblrxxMXi/FKS3cPPsNLdfE03IOb1mUjyIrjRUIftC2vqfQjTZXvV5iSHH6VDi
        JTIGsIftcu+MY4uz6n0UId8jrV292g6ca5gvc1InUgQvKTu+JrnOHeh3i/LqKkSC
        QHBrEPng0WrrsbSB0SCENRHyFw0PctyRyGAOkfRzarTvIQpH5OxYx+zfIrgE0GJq
        hwIDAQAB
        -----END PUBLIC KEY-----`;

        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        let encryptStr = encrypt.encrypt(str);
        return encryptStr;
    },

    /**
     * 数组去重
     * @param {Array} arr
     */
    arrayDeduplication: function (arr) {
        const map = new Map();
        const newArr = [];
        arr.forEach(item => {
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
    loadBundle: function (bundleName, succCallback, failCallback) {
        cc.assetManager.loadBundle(`${bundleName}`, (err, bundle) => {
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
    releaseBundle: function (bundleName) {
        let bundle = cc.assetManager.getBundle(`${bundleName}`);
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
    limitFreePlayerEnterGameByDays: function (days = 7) {
        let createTime = GlobalCfg.USER_DATAS.registerTime * 1000;
        if (createTime == 0 || GlobalCfg.USER_DATAS.recharged > 0) {
            return true;
        }
        let now = new Date();
        let nowTime = now.getTime();
        let duringTime = nowTime - createTime;
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
    getDeviceId: function () {
        //安卓系统尝试系统获取
        let device = APPManager.getUUID();
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
    behaviorReporting: function (eventName, duration = 0) {
        // if (!eventName) {
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
    },

    /**
     * 获取服务器类型. 0: 测试服，1: 1服，2: 2服， 3:3服，6:J服
     * @returns {number}
     */
    getServerType: function () {
        let type = 0;
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
    rechargeByCommodityId: function (commodityId, from, callback, PAY_CHANNEL = 0) {
        if (PAY_CHANNEL == 0) {
            //如果传进来的支付渠道ID为0，则获取支付渠道ID
            this.getPayChannel((payData) => {
                GlobalCfg.PAY_CHANNEL = payData.pay_channels[0]
                this.PayHttp(commodityId, from, callback);
            });
            return;
        }
        ;
        this.PayHttp(commodityId, from, callback);
    },

    PayHttp: function (commodityId, from, callback) {
        let url = GlobalCfg.HTTP_SERVER + "/v1/payment/h5pay";
        url += "?user_mobile=" + GlobalCfg.USER_DATAS.phone;
        url += "&user_email=" + GlobalCfg.USER_DATAS.mail;
        url += "&id=" + commodityId;
        url += "&from=" + from;
        url += "&pay_channel=" + GlobalCfg.PAY_CHANNEL;
        url += "&types=" + GlobalCfg.PAY_CHANNEL2;
        // url += "&server_id=" + GlobalCfg.server_id;
        CommonFun.getInstance().showProgress();
        CommonFun.getInstance().httpGet(url, (strInfo) => {
            CommonFun.getInstance().hidProgress();
            if (strInfo && strInfo.result == 0) {
                if (strInfo.data.pay_url && strInfo.data.pay_url.length > 0) {
                    if (cc.sys.os === cc.sys.OS_IOS) {
                        console.log("ios xiaowei");
                        CommonFun.getInstance().showMsgBox("Go to the top-up page", "YES", () => {
                            window.open(strInfo.data.pay_url);
                        }, false)
                    } else {
                        cc.sys.openURL(strInfo.data.pay_url);
                    }
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
    formatToHMS: function (ms) {
        if (ms <= 0) return "00:00:00"; // 倒计时结束
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // 补零显示（如 1 → "01"）
        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },

    /**
     * 获取商场角标
     */
    getPayChannel: function (callback) {
        let url = GlobalCfg.HTTP_SERVER + "/v1/payment/GetPayChannel";
        CommonFun.getInstance().showProgress();
        CommonFun.getInstance().httpGet(url, (strInfo) => {
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
    showGameStartMask: function () {
        let gameStartMaskPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMESTARTMASK);
        gameStartMaskPrefabPromise.then((prefab) => {
            let gameStartMaskNode = cc.instantiate(prefab);
            this.addToPointParent(gameStartMaskNode, GlobalCfg.PREFAB_PARENT.GAMESTARTMASK);
        });
    },

    /**
     * 播放文字滚动动画
     */
    startTextAnimation: function (label, currentNumber, targetNumber, callback, duration = 1) {
        const difference = targetNumber - currentNumber;
        const frames = Math.ceil(duration * 60);
        let frameCounter = 0;

        const updateValue = () => {
            if (frameCounter <= frames) {
                let newValue = Math.round(currentNumber + (difference / frames * frameCounter));
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
    showGameGifInteraction: function (targetSeat = -1) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", () => {
            let gameGifInteractionPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTION);
            gameGifInteractionPrefabPromise.then((prefab) => {
                let gameGifInteractionNode = cc.instantiate(prefab);
                let gameGifInteractionCtrl = gameGifInteractionNode.getComponent('GameGifInteractionCtrl');
                gameGifInteractionCtrl.setTargetSeat(targetSeat);
                this.addToPointParent(gameGifInteractionNode, GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTION);
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
    playGameGifInteraction: function (skeletonName, senderNode, targetNodeArr) {
        if (!Array.isArray(targetNodeArr) || targetNodeArr.length === 0) {
            return;
        }
        ;

        if (cc.isValid(senderNode) == false) {
            return;
        }
        ;

        let targetNodeArrLen = targetNodeArr.length;
        if (targetNodeArrLen > 0) {
            for (let i = 0; i < targetNodeArrLen; i++) {
                let targetNode = targetNodeArr[i];
                let gameGifInteractionSkePrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONSKE);
                gameGifInteractionSkePrefabPromise.then((prefab) => {
                    let gameGifInteractionSkeNode = cc.instantiate(prefab);
                    this.addToPointParent(gameGifInteractionSkeNode, GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTIONSKE);

                    let gameGifInteractionSkeCtrl = gameGifInteractionSkeNode.getComponent('GameGifInteractionSkeCtrl');
                    let parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.GAMEGIFINTERACTIONSKE);
                    gameGifInteractionSkeCtrl.playGameGifSkeleton(skeletonName, senderNode, targetNode, parentNode);
                })
            }
            ;
        }
        ;
    },

    /**
     * 显示游戏文字/Face互动界面
     * @param {Number} targetSeat 默认-1，表示群发
     */
    showGameWordInteraction: function (targetSeat) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", () => {
            let gameWordInteractionPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTION);
            gameWordInteractionPrefabPromise.then((prefab) => {
                let gameWordInteractionNode = cc.instantiate(prefab);
                let gameWordInteractionCtrl = gameWordInteractionNode.getComponent('GameWordInteractionCtrl');
                gameWordInteractionCtrl.setTargetSeat(targetSeat);
                this.addToPointParent(gameWordInteractionNode, GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTION);
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
    playGameWordInteraction: function (type, name, targetNode, offset) {
        if (cc.isValid(targetNode) == false) {
            return;
        }
        ;
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameGifInteraction", () => {
            let gameWordInteractionShowrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONSHOW);
            gameWordInteractionShowrefabPromise.then((prefab) => {
                let gameWordInteractionShowNode = cc.instantiate(prefab);
                let gameWordInteractionShowCtrl = gameWordInteractionShowNode.getComponent('GameWordInteractionShowCtrl');
                let parentNode = this.getLayerNode(GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTIONSHOW);
                gameWordInteractionShowCtrl.setGameWordInteraction(type, name, targetNode, offset, parentNode);
                this.addToPointParent(gameWordInteractionShowNode, GlobalCfg.PREFAB_PARENT.GAMEWORDINTERACTIONSHOW);
            });
        });
    },

    /**
     * 显示游戏中的设置界面
     */
    showGameSetting: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameSetting", () => {
            let gameSettingPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMESETTING);
            gameSettingPrefabPromise.then((prefab) => {
                let gameSettingNode = cc.instantiate(prefab);
                let gameSettingCtrl = gameSettingNode.getComponent('GameSettingCtrl');
                this.addToPointParent(gameSettingNode, GlobalCfg.PREFAB_PARENT.GAMESETTING);
            });
        });
    },

    setEditBoxEvent: function (editBox, node) {
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            // 保存原始位置
            let _originalY = node.y;

            // 计算合适的键盘高度（可根据需要调整）
            var KEYBOARD_HEIGHT = cc.view.getVisibleSize().height * 0.4;

            editBox.node.on('editing-did-began', function () {
                // 获取输入框底部位置
                var pos = editBox.node.convertToWorldSpaceAR(cc.v2(0, -editBox.node.height / 2));
                var screenHeight = cc.view.getVisibleSize().height;

                // 计算需要上移的距离（只移动必要距离）
                var moveDistance = Math.max(0, (pos.y - KEYBOARD_HEIGHT));

                // 限制最大上移距离（例如不超过屏幕的50%）
                moveDistance = Math.min(moveDistance, screenHeight * 0.5);

                cc.tween(node)
                    .to(0.2, {y: _originalY + moveDistance})
                    .start();
            }.bind(this));

            editBox.node.on('editing-did-ended', function () {
                cc.tween(node)
                    .to(0.2, {y: _originalY})
                    .start();
            }.bind(this));
        }
    },


    /**
     * 显示游戏的菜单界面
     * @param {boolean} isShowSwitchBtn 是否显示换桌按钮
     */
    showGameMenu: function (isShowSwitchBtn = true) {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("GameMenu", () => {
            let gameMenuPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEMENU);
            gameMenuPrefabPromise.then((prefab) => {
                let gameSettingNode = cc.instantiate(prefab);
                let gameMenuCtrl = gameSettingNode.getComponent('GameMenuCtrl');
                gameMenuCtrl.setSwitchTableBtnActive(isShowSwitchBtn);
                this.addToPointParent(gameSettingNode, GlobalCfg.PREFAB_PARENT.GAMEMENU);
            });
        });
    },

    // 设置昵称
    setNickname: function (nickname) {
        const MAX_LENGTH = 9; // 昵称最大长度
        const DISPLAY_LENGTH = 7; // 超过最大长度时显示的长度
        let name = ""
        if (nickname.length > MAX_LENGTH) {
            // 超过 7 位，截取前 5 位并加上省略号
            name = nickname.substring(0, DISPLAY_LENGTH) + "...";
        } else {
            // 不超过 7 位，直接显示
            name = nickname;
        }
        return name
    },

    /**
     * 初始化竖屏次数
     */
    initVerticalAcc: function () {
        this._verticalAcc = 0;
        if (this._curOrientation == EnumOrientation.VERTICAL) {
            this._curOrientation = EnumOrientation.HORIZONTAL;
            APPManager.setOrientation("H");
        }
        ;
    },

    /**
     * 累加竖屏次数，当累加次数大于0，则竖屏
     */
    addVerticalAcc: function () {
        this._verticalAcc += 1;
        if (this._verticalAcc > 0 && this._curOrientation == EnumOrientation.HORIZONTAL) {
            this._curOrientation = EnumOrientation.VERTICAL;
            APPManager.setOrientation("V");
        }
        ;
    },
    /**
     * 减少竖屏次数，当累加次数等于0，则横屏
     */
    decVerticalAcc: function () {
        this._verticalAcc -= 1;
        if (this._verticalAcc <= 0 && this._curOrientation == EnumOrientation.VERTICAL) {
            this._curOrientation = EnumOrientation.HORIZONTAL;
            APPManager.setOrientation('H');
        };
    },

    checkVerticalAcc: function () {
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
    dealShopList(couldWithdraw, commoditys) {
        let btnListData = commoditys.sort((a, b) => {
            let value1 = a["amount"];
            let value2 = b["amount"];
            return value1 - value2;
        });
        /**
         * 配置1: 无论诱导金额是多少，始终显示所有的充值额度（所有商品）
         * 配置2：根据诱导金额显示商城支付最低充值额度（部分商品）
         */
        let shopModel = this.getAppConfigValueByKey('SHOP_MODEL', 1);
        if (GlobalCfg.USER_DATAS.recharged > 0 || shopModel == 1) {
            return btnListData;
        }
        let index = 0, startIndex = 0;
        let mixShowAmounts = [
            [10000, 20000],
            [30000, 20000],
            [50000, 30000],
            [150000, 50000],
        ];
        let length = mixShowAmounts.length, limitShow = mixShowAmounts[0][1];
        while (index < length - 1) {
            if (couldWithdraw > mixShowAmounts[length - 1][0]) {
                limitShow = 100000;
                for (let i = 0, len = btnListData.length; i < len; i++) {
                    if (btnListData[i].amount == limitShow) {
                        startIndex = i;
                    }
                }
                break
            } else {
                if (couldWithdraw > mixShowAmounts[index][0] && couldWithdraw <= mixShowAmounts[index + 1][0]) {
                    limitShow = mixShowAmounts[index + 1][1];
                    for (let i = 0, len = btnListData.length; i < len; i++) {
                        if (btnListData[i].amount == limitShow) {
                            startIndex = i;
                        }
                    }
                    break
                }
                index++;
            }
        }
        let arr = btnListData.slice(startIndex, btnListData.length);
        LoggerUtil.getInstance().log(">>>>>ShopList>>>>>>>>", arr);
        return arr;
    },

    /**
     * 根据本地缓存判断是否需要显示弹框
     * @param {*} toastType 弹框类型
     * @param {*} hours 间隔几个小时
     */
    isNeedShowPointToastByHours: function (toastType, hours) {
        /**
         * 当前毫秒级的时间戳
         */
        let curTimeStamp = new Date().getTime();
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                    return true;
                } else {
                    return false;
                }
                ;
            } catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
                return false;
            }
            ;
        } else {
            return true;
        }
        ;
    },

    /**
     * 根据key获取APP_CONFIG中的值
     * @param {string} key
     * @param {any} defaultValue
     * @returns
     */
    getAppConfigValueByKey: function (key, defaultValue) {
        for (let i = 0; i < GlobalCfg.APP_CONFIG_DATAS.length; i++) {
            const element = GlobalCfg.APP_CONFIG_DATAS[i];
            if (element.key == key) {
                return element.value;
            }
        }
        LoggerUtil.getInstance().warn("APP_CONFIG doesn`t have " + key);
        return defaultValue;
    },

    /**
     * 当日倒计时
     * @returns {string}
     */
    getTodayCountdown: function () {
        let padZero = (num) => {
            return num < 10 ? `0${num}` : num;
        }
        // 获取当前时间
        const now = new Date();
        // 设置今天的结束时间为 23:59:59
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        // 计算剩余时间（毫秒数）
        const timeRemaining = todayEnd - now;

        // 计算时、分、秒
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // 格式化输出
        const formattedCountdown = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        return formattedCountdown;
    },

    /**
     * 显示免费玩家百人类游戏赶场到免费TP弹框
     * @param {Function} clickBtnPlayNowCallback 点击“Play Now”按钮的回调
     */
    showDiversionFreeTP: function (clickBtnPlayNowCallback) {
        if (GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW) {
            return;
        }
        ;
        GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW = true;
        let diversionFreeTPPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.DIVERSIONFREETP);
        diversionFreeTPPrefabPromise.then((prefab) => {
            let diversionFreeTPNode = cc.instantiate(prefab);
            let diversionFreeTPCtrl = diversionFreeTPNode.getComponent('DiversionFreeTPCtrl');
            diversionFreeTPCtrl.setDiversionFreeTPBtnPlayNowCallback(clickBtnPlayNowCallback);
            this.addToPointParent(diversionFreeTPNode, GlobalCfg.PREFAB_PARENT.DIVERSIONFREETP);
        });
    },

    /**
     * 是否是免费玩家被定向到免费TP
     * @returns {boolean}
     */
    isFreePlayerDirectedToFreeTP: function () {
        if (this.getAppConfigValueByKey("FREE_PLAYER_DIRECTED_TO_FREE_TP", false) == true) {
            return true;
        }
        return false;
    },

    /**
     * 在游戏中显示提现提示弹窗
     */
    showWithdrawToastInGame: function () {
        if (this.isNeedShowWithdrawToastInGame() == false) {
            return;
        }
        ;
        let defaultPopupWithdrawLimit = this.getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 30);    // 提现弹窗限制默认值
        let func = (date) => {
            let _date = date * 1000;
            let _curDate = new Date().getTime();
            let _differ = _curDate - _date;
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
        let isNeedShowPointToastByHours = (toastType, hours) => {
            /**
             * 当前毫秒级的时间戳
             */
            let curTimeStamp = new Date().getTime();
            let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${toastType}_LocalStorage`);
            if (toastLocalStorage) {
                try {
                    let toastLocalData = JSON.parse(toastLocalStorage);
                    let showTag = toastLocalData.showTag;
                    if (curTimeStamp > (parseInt(showTag) + hours * 60 * 60 * 1000)) {
                        return true;
                    } else {
                        return false;
                    }
                    ;
                } catch (error) {
                    LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
                    return false;
                }
                ;
            } else {
                return true;
            }
            ;
        };
        let toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
        console.log("toastWithDrawFrequency1: ", GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(5))
        console.log("toastWithDrawFrequency2: ", GlobalCfg.USER_DATAS.userDiamond > (defaultPopupWithdrawLimit * 100))
        console.log("toastWithDrawFrequency3: ", isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency));
        if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > (defaultPopupWithdrawLimit * 100)
            && isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
            this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
            CommonFun.getInstance().showPopUpWithDraw();
        }
        ;
    },

    /**
     * 是否显示提现提示弹窗关闭按钮
     * @returns
     */
    isShowWithdrawToastCloseBtn: function () {
        if (this.getAppConfigValueByKey("SHOW_WITHDRAW_TOAST_CLOSE_BTN", false) == true) {
            return true;
        }
        ;
        return false;
    },

    isNeedShowWithdrawToastInGame: function () {
        if (this.getAppConfigValueByKey("SHOW_WITHDRAW_TOAST_IN_GAME", false) == true) {
            return true;
        }
        return false;
    },


    checkShowWithDrawToast: function () {
        if (GlobalCfg.USER_DATAS.isNotCharge == false) {   //充值过则不弹出
            return true;
        }
        ;
        let func = (date) => {
            let _date = date * 1000;
            let _curDate = new Date().getTime();
            let _differ = _curDate - _date;
            if (_differ < 24 * 60 * 60 * 1000) {
                return Number(30 / 60).toFixed(1);
            } else if (_differ < 3 * 24 * 60 * 60 * 1000) {
                return Number(20 / 60).toFixed(1);
            } else if (_differ < 5 * 24 * 60 * 60 * 1000) {
                return Number(10 / 60).toFixed(1);
            } else {
                return Number(5 / 60).toFixed(1);
            }
        }
        // let toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
        let toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
        LoggerUtil.getInstance().log("checkShowWithDrawToast toastWithDrawFrequency:", toastWithDrawFrequency);
        let defaultPopupWithdrawLimit = this.getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 30);    // 提现弹窗限制默认值
        if (GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > (defaultPopupWithdrawLimit * 100)
            && this.isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
            this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
            this.showPopUpWithDraw();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'STOP_GAME', msgData: {}});
            return true;
        }
        return false;
    },

    /**
     * 是否需要签到弹窗的获取按钮改变
     * @returns {boolean}
     */
    isNeedSignToastGetBtnChange: function () {
        if (this.getAppConfigValueByKey("SIGN_TOAST_GET_BTN_CHANGE", false) == true) {
            return true;
        }
        return false;
    },

    /**
     * 是否显示签到弹窗
     * @returns {boolean}
     */
    isNeewShowSignToast: function () {
        if (this.getAppConfigValueByKey("SHOW_SIGN_TOAST", false) == true) {
            return true;
        }
        return false;
    },

    /**
     * 显示签到弹窗
     */
    showSignToast: function () {
        CommonFun.getInstance().checkBundleIsDownloadedByH5("Sign", () => {
            let signPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SIGN);
            signPrefabPromise.then((prefab) => {
                let signNode = cc.instantiate(prefab);
                let gameMenuCtrl = signNode.getComponent('SignCtrl');
                this.addToPointParent(signNode, GlobalCfg.PREFAB_PARENT.SIGN);
            });
        });
    },

    /**
     * 是否是进入过TP游戏
     * @returns {boolean}
     */
    isEnteredTPGame: function () {
        let state = cc.sys.localStorage.getItem(`ENTERED_TP_GAME_${GlobalCfg.USER_DATAS.userId}`);
        if (state == null) {
            return false;
        }
        ;
        return true;
    },

    /**
     * 购买之前显示提示框
     */
    ShowTipsBeforeBuy: function (msg, callback) {
        let str = 'Go to Recharge $ ' + msg + '?'
        CommonFun.getInstance().showMsgBox(str, "SHOP", () => {
            if (callback) {
                callback()
            }
        }, false);
    },

    /**
     * 是否需要显示TP手指提示
     * @returns {boolean}
     */
    isNeedShowTPFingerTip: function () {
        if (this.getAppConfigValueByKey("SHOW_TP_FINGER_TIP", false) == true) {
            return true;
        }
        return false;
    },

    /**
     * 显示破产弹窗
     */
    showBankruptcy: function (isClick = false, isPlotPlay = false) {
        LoggerUtil.getInstance().log("caojun showBankruptcy GlobalCfg.BANKRUPT_CD:", GlobalCfg.BANKRUPT_CD);
        if (isClick == false) { //手动点击的时候不需要加入破产cd
            if (GlobalCfg.BANKRUPT_CD == 0) {
                GlobalCfg.BANKRUPT_CD = new Date().getTime();
            } else {
                let shengyuTime = (new Date().getTime() - GlobalCfg.BANKRUPT_CD) / 1000;
                if (shengyuTime < 1800) {//半小时CD才会弹出破产面板
                    return;
                } else {
                    GlobalCfg.BANKRUPT_CD = new Date().getTime();
                }
            }
        }
        let isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT, GlobalCfg.PREFAB_PARENT.BANKRUPTCY_GIFT);
        LoggerUtil.getInstance().log("caojun showBankruptcy isExist:", isExist);
        if (isExist) {
            return;
        }
        CommonFun.getInstance().checkBundleIsDownloadedByH5("BankruptcyGift", () => {
            GlobalCfg.IS_SHOW_BANKRUPT = true;
            let curScene = SceneManager.getInstance().curSceneType;
            let bankruptcyPrefabPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT);
            bankruptcyPrefabPromise.then((prefab) => {
                let bankruptcyNode = cc.instantiate(prefab);
                if (curScene == SceneManager.getInstance().sceneType.BENZ) {
                    bankruptcyNode.setScale(0.7);
                }
                let BankruptcyGiftCtrl = bankruptcyNode.getComponent("BankruptcyGiftCtrl");
                BankruptcyGiftCtrl.init(isPlotPlay);
                this.addToPointParent(bankruptcyNode, GlobalCfg.PREFAB_PARENT.BANKRUPTCY_GIFT);
            });
        });
    },

    checkCanShowOnlyPay: function (callback, callback2) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/payment/useonlypay`;
        let httpParam = {};
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (strInfo) => {
            CommonFun.getInstance().hidProgress();
            if (strInfo && strInfo.data) {
                if (strInfo.data.code == 0) {
                    GlobalCfg.USER_DATAS.only_pay_time = strInfo.data.timer;
                    GlobalCfg.USER_DATAS.only_pay_countDownTime = strInfo.data.timer + Date.now();
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: 'show_Only_Pay', msgData: {}});
                    this.showOnlyPay();
                    callback && callback();
                } else {
                    callback2 && callback2();
                }
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    /**
     * 显示onlypay
     */
    showOnlyPay: function () {
        let isExist = this.checkNodeInParentNode(GlobalCfg.PREFAB_PATH.ONLY_PAY, GlobalCfg.PREFAB_PARENT.ONLY_PAY);
        if (isExist) {
            return;
        }
        ;
        if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.BENZ) {
            return;
        }

        CommonFun.getInstance().checkBundleIsDownloadedByH5("Onlypay", () => {
            GlobalCfg.IS_SHOW_BANKRUPT = true;
            let OnlyPayPromise = this.loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ONLY_PAY);
            OnlyPayPromise.then((prefab) => {
                let OnlyPayNode = cc.instantiate(prefab);
                let OnlyPayCtrl = OnlyPayNode.getComponent("OnlyPayCtrl");
                OnlyPayCtrl.init();
                this.addToPointParent(OnlyPayNode, GlobalCfg.PREFAB_PARENT.ONLY_PAY);
            });
        });
    },

    getChannelId: function () {
        let channelId = cc.sys.localStorage.getItem("channelId");
        if (!channelId) {
            channelId = "unknown";
        }
        return channelId;
    },


    /**
     * 获取所有 cookie（返回对象形式）
     */
    cookieGetAll() {
        const cookies = {};
        const all = document.cookie;
        if (!all) return cookies;

        all.split(';').forEach(pair => {
            const [name, value] = pair.split('=');
            if (name && value !== undefined) {
                cookies[name.trim()] = decodeURIComponent(value);
            }
        });
        return cookies;
    },

    /**
     * 获取指定名称的 cookie 值
     */
    cookieGet(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },

    /**
     * 设置（写入或覆盖）cookie
     */
    cookieSet(name, value, days = 7, path = "/") {
        const exp = new Date();
        exp.setDate(exp.getDate() + days);
        document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}; expires=${exp.toUTCString()}`;
    },

    /**
     * 添加 cookie（若已存在则忽略）
     */
    cookieAdd(name, value, days = 7, path = "/") {
        const existing = this.cookieGet(name);
        if (existing === null) {
            this.cookieSet(name, value, days, path);
        } else {
            console.warn(`[CookieManager] '${name}' 已存在，跳过添加`);
        }
    },

    /**
     * 删除指定名称的 cookie
     */
    cookieRemove(name, path = "/") {
        document.cookie = `${name}=; path=${path}; max-age=0`;
    },


    //获取channelId  (h5专用 用于获取渠道id)
    getChannelIdV1() {
        //首先尝试用 cookie获取
        let id = this.cookieGet("PackageChannel");
        if (!id) {
            id = cc.sys.localStorage.getItem("PackageChannel");
        }
        if (!id) {
            id = "5_7001";
        }
        cc.sys.localStorage.setItem("PackageChannel", id);
        return id.split("_")[1];
    },

    //getInviteCodeV1  (h5专用 用于获取推广码)
    getInviteCodeV1() {
        //首先尝试用 cookie获取
        let id = this.cookieGet("invite_code");
        if (!id) {
            id = cc.sys.localStorage.getItem("invite_code");
        }
        console.log("获取InviteCode", id);
        return id;
    },

});

CommonFun.getInstance = function () {
    if (!CommonFun._instance) {
        CommonFun._instance = new CommonFun();
    }
    return CommonFun._instance;
};


window.CommonFun = CommonFun;