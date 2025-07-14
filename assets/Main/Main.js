cc.Class({
    extends: cc.Component,

    properties: {},

    ctor: function() {
        this.reqRemoteVersionUrlAcount = 0;
        this.loadPrecess = 0;

        this.reqAppInfoCount = 0;
        this.reqAppConfigCount = 0;
    },

    onLoad: function() {
        /**
         * 首次进入上报
         */
        if (cc.sys.isNative) {
            let firstEnterStatus = Number(cc.sys.localStorage.getItem("FIRST_ENTER_STATUS"));
            if (firstEnterStatus == 0) {
                cc.sys.localStorage.setItem("FIRST_ENTER_STATUS", 1);
                CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.FIRST_ENTER);  
            };
        };
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.LAUNCH_GAME);  
        /**
         * 日志开关
         */
        if (cc.sys.isNative) {
            let loggerUtilStatus = Number(cc.sys.localStorage.getItem("LOGGERUTIL_STATUS"));
            LoggerUtil.getInstance().setLoggerStatus(loggerUtilStatus == 1 ? true : false);
        }
        else {
            LoggerUtil.getInstance().setLoggerStatus(true);
        };
        console.log(`LoggerUtil Status is: ${LoggerUtil.getInstance().getLoggerStatus()}`);
        console.log(`APP_CONFIG_URL: ${GlobalCfg.APP_CONFIG_URL}`);
        console.log(`APP_INFO_URL: ${GlobalCfg.APP_INFO_URL}`);
        console.log(`APP_VERSION: ${GlobalCfg.APP_VERSION}`);
        console.log(`UpdateVersion: ${cc.sys.localStorage.getItem("UpdateVersion")}`);
        console.log(`PackageName: ${APPManager.getPackageName()}`);
        console.log(`PackageChannel: ${cc.sys.localStorage.getItem("PackageChannel")}`);

        /**
         * 常驻节点
         */
        let persistNode = cc.find("PersistNode");
        cc.game.addPersistRootNode(persistNode);


        let carouselLayer = persistNode.getChildByName("CarouselLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.CAROUSELLAYER, carouselLayer);
        let firstLayer = persistNode.getChildByName("FirstLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.FIRSTLAYER, firstLayer);
        let secondLayer = persistNode.getChildByName("SecondLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.SECONDLAYER, secondLayer);
        let thirdLayer = persistNode.getChildByName("ThirdLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.THIRDLAYER, thirdLayer);
        let toastLayer = persistNode.getChildByName("ToastLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.TOASTLAYER, toastLayer);
        let shopLayer = persistNode.getChildByName("ShopLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.SHOPLAYER, shopLayer);
        let progressLayer = persistNode.getChildByName("ProgressLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.PROGRESSLAYER, progressLayer);
        let tipsLayer = persistNode.getChildByName("TipsLayer");
        CommonFun.getInstance().setLayerNode(GlobalCfg.LAYER_TAG.TIPSLAYER, tipsLayer);

        GlobalCfg.G_COMPONENTS.Audio = persistNode.getComponent('AudioManager');

        this.node_loadTipsLayer = this.node.getChildByName('loadTipsLayer');
        this.lab_loadTips = this.node_loadTipsLayer.getChildByName('lab_loadTips').getComponent(cc.Label);
        this.node_loadMark = this.node_loadTipsLayer.getChildByName('loadMark');

        this.playLoadTipsAct();

        let UnUseFacebook = Number(cc.sys.localStorage.getItem("UnUseFacebook"));
        LoggerUtil.getInstance().log("UnUseFacebook: ", UnUseFacebook);
        GlobalCfg.UNUSE_FACEBOOK = UnUseFacebook;

        let clubMode = Number(cc.sys.localStorage.getItem("IsClubMode")); //是否是代理模式 0:不是 1:是
        GlobalCfg.IS_CLUB_MODE = clubMode;
        let needToLogEncrypt = false;
        if(needToLogEncrypt) {
            let appConfigPathObj = {
                "0":"json/AppConfig_test",
                "1":"json/AppConfig_1",
                "2":"json/AppConfig_2",
                "3":"json/AppConfig_3",
                "4":"json/AppConfig_4",
            }
            let appConfigPath = appConfigPathObj[GlobalCfg.server_id];
            // appConfigPath = appConfigPathObj['2'];
            cc.loader.loadRes(appConfigPath, (err, asset)=> {
                let enStrb = CommonFun.getInstance().encrypt(JSON.stringify(asset.json)); 
                LoggerUtil.getInstance().log("appConfig加密后的值：\n", enStrb);
                let deStrb = CommonFun.getInstance().decrypt(enStrb);
                LoggerUtil.getInstance().log("appConfig解密后的值：", JSON.parse(deStrb));
            });

            let appInfoPathObj = {
                "0":"json/AppInfo_test",
                "1":"json/AppInfo_1",
                "2":"json/AppInfo_2",
                "3":"json/AppInfo_3",
                "4":"json/AppInfo_4",
                "5":"json/AppInfo_5",
            }
            let appInfoPath = appInfoPathObj[GlobalCfg.server_id];
            // appInfoPath = appInfoPathObj['5'];
            cc.loader.loadRes(appInfoPath, (err, asset)=> {
                let enStr = CommonFun.getInstance().encrypt(JSON.stringify(asset.json)); 
                LoggerUtil.getInstance().log("appInfo加密后的值：\n", enStr);
                let deStr = CommonFun.getInstance().decrypt(enStr);
                LoggerUtil.getInstance().log("appInfo解密后的值：", JSON.parse(deStr));
            });
        }
    },

    playLoadTipsAct: function() {
        let dt = 0;
        let pointArr = ['.', '..', '...'];
        this.schedule(() => {
            this.lab_loadTips.string = `Resource loading ${pointArr[dt%3]} ${this.loadPrecess}%`;
            dt += 1;
        }, 0.5);

        cc.tween(this.node_loadMark)
        .by(1, {angle: -360})
        .repeatForever()
        .start()
    },

    start: function() {
        APPManager.getFirebaseToken();
        let packageChannel = "";
        let channel = 0;

        if(window.parent && window.parent.uni){// H5端
            packageChannel = cc.sys.localStorage.getItem("PackageChannel");
            window.postMessage({
                action: 'getChannel',  // 动作类型，可以根据需要传递不同的 action
                data: {}  // 发送的数据
            }, '*');

            // window.addEventListener('message', function(event) {
            //     if (event.data.action === 'sendChannel') {
            //         console.log('Received channel:', channel);
            //     }
            // });
        }
        else{
            packageChannel = cc.sys.localStorage.getItem("PackageChannel");
        }

        if (packageChannel && packageChannel.indexOf("_") != -1) {
            let packageChannelArr = packageChannel.split("_"); 
            channel = packageChannelArr[1];
        }
        if(channel == "7001"){
            GlobalCfg.PACKAGE_REPORT_METHOD = 4;
        }

        if(channel == "4001"){
            this.reqAppInfo(() => {
                Promise.all([this.getAdvertisingId()])
                .then((arr) => {
                    this.loadUpdateScene();
                });
            }, GlobalCfg.APP_INFO_URL);
        }
        else if (GlobalCfg.PACKAGE_REPORT_METHOD == 2 ||  
            GlobalCfg.isPattiHunt == 1 || 
            GlobalCfg.ISPackage2019 == 1) {

            this.reqAppInfo(() => {
                Promise.all([this.getAppsFlyerId(), this.getAdvertisingId()])
                .then((arr) => {
                    this.loadUpdateScene();
                });
            }, GlobalCfg.APP_INFO_URL);
        }
        else if (GlobalCfg.PACKAGE_REPORT_METHOD == 3 ||
            GlobalCfg.ISPackage2009 == 1 || 
            GlobalCfg.isPackage2010 == 1 || 
            GlobalCfg.isPackage2014 == 1 ||
            GlobalCfg.ISPackage2018 == 1 || 
            GlobalCfg.isBloom3Rummy == 1 || 
            GlobalCfg.isPackage2020 == 1) {
            // Jsut need AppInfo, PIX上报(UA+IP)
            this.reqAppInfo(() => {
                this.loadUpdateScene();
            }, GlobalCfg.APP_INFO_URL);
        }
        else if (GlobalCfg.PACKAGE_REPORT_METHOD == 4 || channel == "2058" ||
            channel == "4003" || channel == "4004" ||
            channel == "6019" || channel == "6020" || channel == "6021" || channel == "7001"|| channel == "7002") {

            this.reqAppInfo(() => {
                Promise.all([this.getAdjustId(), this.getAdvertisingId()])
                .then((arr) => {
                    this.loadUpdateScene();
                });
            }, GlobalCfg.APP_INFO_URL);
        }
        else {
            this.reqAppInfo(() => {
                Promise.all([this.getAdjustId()])
                .then((arr) => {
                    this.loadUpdateScene();
                })
            }, GlobalCfg.APP_INFO_URL);
        };  
    
        this.reqAppConfig(GlobalCfg.APP_CONFIG_URL);
    },

    getAdjustId: function() {
        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADJUSTID_START);
        return new Promise((resolve, reject) => {
            let getAdjustIDCallback = () =>  {
                let adjustId_tmp = cc.sys.localStorage.getItem(`adjustId_local`);
                if (!adjustId_tmp) {
                    let endTime = cc.sys.now();
                    let adjustId = APPManager.getAdjustID();
                    if (adjustId && adjustId != '' && adjustId.length > 0) {
                        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADJUSTID_SUCCESS, endTime - startTime);
                        GlobalCfg.ADJUST_ID = adjustId;
                        cc.sys.localStorage.setItem(`adjustId_local`, adjustId);
                        this.unschedule(getAdjustIDCallback);
                        resolve(adjustId);
                        return;
                    }
                    else if (endTime - startTime > 10000) {
                        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADJUSTID_FAIL, endTime - startTime);
                        GlobalCfg.ADJUST_ID = "test01";
                        this.unschedule(getAdjustIDCallback);
                        cc.sys.localStorage.setItem(`adjustId_local`, "test01");
                        resolve("");
                        return;
                    };
                }
                else{
                    GlobalCfg.ADJUST_ID = adjustId_tmp;
                    this.unschedule(getAdjustIDCallback);
                    resolve(adjustId_tmp);
                }
            };
            this.schedule(getAdjustIDCallback, 0.5);
        });
    },

    getAppsFlyerId: function() {
        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPSFLYID_START);
        return new Promise((resolve, reject) => {
            let getAppsFlyerIdCallback = () =>  {
                let endTime = cc.sys.now();
                let appsFlyerId = APPManager.getAppsFlyerId();
                if (appsFlyerId && appsFlyerId.length > 0) {    
                    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPSFLYID_SUCCESS, endTime - startTime);
                    GlobalCfg.APPSFLYER_ID = appsFlyerId;
                    LoggerUtil.getInstance().log("appsFlyerId:", GlobalCfg.APPSFLYER_ID);
                    this.unschedule(getAppsFlyerIdCallback);
                    resolve(appsFlyerId);
                    return;
                }
                else if (endTime - startTime > 10000) {
                    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPSFLYID_FAIL, endTime - startTime);
                    GlobalCfg.APPSFLYER_ID = "";   
                    LoggerUtil.getInstance().log("appsFlyerId is empty");
                    this.unschedule(getAppsFlyerIdCallback);
                    resolve("");
                    return;
                };
            };
            this.schedule(getAppsFlyerIdCallback, 0.5); 
        });
    },

    getAdvertisingId: function() {
        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_START);
        return new Promise((resolve, reject) => {
            let getAdvertisingIdCallback = () =>  {
                //只有第一次打开APP的时候 需要获取广告ID ，获取成功后保存到本地
                let advertisingId_tmp = cc.sys.localStorage.getItem(`advertisingId_local`);
                if (!advertisingId_tmp) {
                    let endTime = cc.sys.now();
                    let advertisingId = APPManager.getAdvertisingId();
                    if (advertisingId && advertisingId.length > 0) {
                        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_SUCCESS, endTime - startTime);
                        GlobalCfg.ADVERTISING_ID = advertisingId;
                        cc.sys.localStorage.setItem(`advertisingId_local`, advertisingId);
                        this.unschedule(getAdvertisingIdCallback);
                        resolve(advertisingId);
                        this.installApp();
                        return;
                    }
                    else if (endTime - startTime > 20000) {
                        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_FAIL, endTime - startTime);
                        GlobalCfg.ADVERTISING_ID = "test01";
                        cc.sys.localStorage.setItem(`advertisingId_local`, "test01");
                        this.unschedule(getAdvertisingIdCallback);
                        resolve("");
                        this.installApp();
                        return;
                    };
                }
                else{
                    GlobalCfg.ADVERTISING_ID = advertisingId_tmp;
                    this.unschedule(getAdvertisingIdCallback);
                    resolve(advertisingId_tmp);
                    this.installApp();
                }
            };
            this.schedule(getAdvertisingIdCallback, 0.5);
        });
    },

    installApp: function() {
        if (!cc.sys.localStorage.getItem("install")) {
            let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
            let channel = '';
            if (packageChannel && packageChannel.indexOf("_") != -1) {
                let packageChannelArr = packageChannel.split("_"); 
                channel = packageChannelArr[1];
            }
            let httpParam = {
                "adv": GlobalCfg.ADVERTISING_ID,
                "channel": channel,
            };
            let httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/install";
            CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {});
            cc.sys.localStorage.setItem("install", "1");
        }
    },

    reqAppConfig: function(url) {
        this.reqAppConfigCount++;
        CommonFun.getInstance().httpGet(url,(jsonObj)=>{
            LoggerUtil.getInstance().log("APP Config Datas", jsonObj);
            GlobalCfg.APP_CONFIG_DATAS = jsonObj.list;
        },
        ()=>{
            LoggerUtil.getInstance().warn("APPCONFIG GET ERROR!");
            if(this.reqAppConfigCount < 5){
                this.reqAppConfig(url);
            }else{
                if(url == GlobalCfg.APP_CONFIG_URL){
                    this.reqAppConfigCount = 0;
                    this.reqAppConfig(GlobalCfg.APP_CONFIG_URL_SPARE);
                }else{
                    GlobalCfg.APP_CONFIG_DATAS = [];
                }
            }
        });
    },

    reqAppInfo: function(finishCallback, url) {
        if(url.length == 0){
            console.error("reqAppInfo url is empty");
            return ;
        }
        this.reqAppInfoCount++;
        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPINFO_START);
        CommonFun.getInstance().httpGet(url, (json) => {
            let endTime = cc.sys.now();
            CommonFun.getInstance().dealAppInfoJson(json);
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPINFO_SUCCESS, endTime - startTime);
            finishCallback && finishCallback(); 
        },
        () => {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_APPINFO_FAIL, endTime - startTime);
            if(this.reqAppInfoCount < 5){
                this.reqAppInfo(finishCallback, url);
            }else{
                LoggerUtil.getInstance().warn("APPINFO GET ERROR!!");
                if(url == GlobalCfg.APP_INFO_URL){
                    this.reqAppInfoCount = 0;
                    this.reqAppInfo(finishCallback, GlobalCfg.APP_INFO_URL_SPARE);
                }else{
                    this.reqAppInfo(finishCallback, url);
                }
            }
        });
    },

    loadUpdateScene: function() {
        let localAppVersion = Number(cc.sys.localStorage.getItem("LocalAppVersion"));
        let isCanDownApp = Number(cc.sys.localStorage.getItem("IsCanDownApp"));
        // LoggerUtil.getInstance().log("localAppVersion: ", localAppVersion);
        // LoggerUtil.getInstance().log("isCanDownApp: ", isCanDownApp);
        if (cc.sys.isNative && isCanDownApp == 1 && GlobalCfg.REMOTE_APP_UPDATE && GlobalCfg.REMOTE_APP_VERSION != localAppVersion) {
            this.node_loadTipsLayer.active = false;
            APPManager.downloadApkByApkUrl(GlobalCfg.REMOTE_APP_URL);
        }
        else {
            this.loadPrecess = 100.00;
            cc.director.loadScene("Update");
        };
    },
});
