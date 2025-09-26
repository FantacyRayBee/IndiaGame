"use strict";
cc._RF.push(module, 'f2a864ZfdxEV4dzaQtpfstU', 'SceneManager');
// Main/Script/Common/UtilTools/SceneManager.js

"use strict";

var protoCfgObj = require("ProtoCfg");
var ProtoObj = new protoCfgObj();
var SceneManager = cc.Class({
  ctor: function ctor() {
    this.sceneType = {
      UPDATE: 'resources/Update',
      LOBBY: 'ResourcesBundle/Lobby',
      SEVENUPDOWN: '7up7downGame/7up7down',
      ANDAER: 'andaerGame/Andeer',
      BACCARAT: 'baccarat3PattiGame/baccarat3Patti',
      BENZ: 'Benz/benz',
      SGJ: 'fruitMachine/fruitMachine',
      MAYA: 'mayaMachine/mayaMachine',
      MTP: 'multiTeenPatti/mtpLobby',
      JOKER: 'jokerMachine/jokerMachine',
      INDIA: 'indiaMachine/indiaMachine',
      VAMPIRE: 'vampireMachine/vampireMachine',
      BULL: 'bullMachine/bullMachine',
      HORSERACE: 'horseRaceGame/horseRace',
      LHD: 'lhdGame/LHD',
      MUNDA: 'munda/mundaLobby',
      SSC: 'sscGame/',
      TEENPATTI: 'tpGame/TpGame',
      RUMMY: 'Rummy/rummy',
      ROCKET: 'rocket/rocket',
      AVIATOR: 'aviator/aviator',
      ZOO: 'zooGame/zoo',
      CRICKET: 'cricketGame/cricket',
      ZEUS: "zeusGame/zeus",
      WEBVIEW: 'webview'
    };
    this.curSceneType = null;
    this.isLoadingScene = false;
  },
  statics: {
    _instance: null
  },
  /**
   * 跳转场景
   * @param {string} fromSceneName 起始场景
   * @param {string} toSceneName 目的场景
   * @returns 
   */
  changeScene: function changeScene(fromSceneName, toSceneName) {
    var _this = this;
    if (this.isLoadingScene) {
      LoggerUtil.getInstance().error("Loading scene......");
      return;
    }
    ;
    this.isLoadingScene = true;
    if (!toSceneName) {
      this.isLoadingScene = false;
      LoggerUtil.getInstance().error("Please specify the target scene!");
      return;
    }
    ;
    CommonFun.getInstance().showProgress();

    // this.proloadBundleScene(toSceneName);
    // 从更新登录场景跳转到大厅场景
    if (fromSceneName === this.sceneType.UPDATE && toSceneName === this.sceneType.LOBBY) {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.LOGIN_LOBBY_START);
      this.dealEnterLobbyScene(toSceneName);
    }
    // 从大厅场景跳转到更新登录场景
    else if (fromSceneName === this.sceneType.LOBBY && toSceneName === this.sceneType.UPDATE) {
      LobbyServerManager.clientCloseServer();
      GameServerManager.clientCloseServer();
      CommonFun.getInstance().deleteLoginLocalStorage();
      cc.director.loadScene("Update");
      CommonFun.getInstance().hidProgress();
      this.isLoadingScene = false;
    }
    // 从大厅场景跳转到小游戏场景
    else if (fromSceneName === this.sceneType.LOBBY && toSceneName !== this.sceneType.UPDATE) {
      this.dealEnterGameScene(toSceneName);
    }
    // 从内嵌小游戏网页场景跳转到大厅场景 刷新玩家身上的数据
    else if (fromSceneName == this.sceneType.WEBVIEW && toSceneName === this.sceneType.LOBBY) {
      Promise.all([this.reqUserDataInfo()]).then(function (arr) {
        _this.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.CLOSE_SSCGAME_REFRESH_LOBBY,
          msgData: {}
        });
      })["catch"](function (err) {
        _this.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
        CommonFun.getInstance().showTips(err);
      });
    }
    // 从小游戏场景跳转到大厅场景
    else if (fromSceneName !== this.sceneType.UPDATE && fromSceneName !== this.sceneType.LOBBY && toSceneName === this.sceneType.LOBBY) {
      GameServerManager.clientCloseServer();
      Promise.all([this.reqUserDataInfo(), this.loadBundleScene(toSceneName)]).then(function (arr) {
        var scene = arr[1];
        _this.curSceneType = toSceneName;
        cc.director.runScene(scene, function () {}, function () {
          _this.isLoadingScene = false;
          CommonFun.getInstance().hidProgress();
        });
      })["catch"](function (err) {
        _this.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
        CommonFun.getInstance().showTips(err);
      });
    }
    // 从小游戏场景跳转到更新登录场景
    else if (fromSceneName !== this.sceneType.UPDATE && fromSceneName !== this.sceneType.LOBBY && toSceneName === this.sceneType.UPDATE) {
      LobbyServerManager.clientCloseServer();
      GameServerManager.clientCloseServer();
      CommonFun.getInstance().deleteLoginLocalStorage();
      cc.director.loadScene("Update");
      CommonFun.getInstance().hidProgress();
      this.isLoadingScene = false;
    } else {
      LoggerUtil.getInstance().error("Scene jump specified error ===>, FromSceneName: " + fromSceneName + ".  ToSceneName: " + toSceneName);
      CommonFun.getInstance().hidProgress();
      this.isLoadingScene = false;
    }
    ;
  },
  dealEnterLobbyScene: function dealEnterLobbyScene(toSceneName) {
    var _this2 = this;
    var protoPathArr = ["proto/baseproto", "proto/lobbyservice"];
    var protoCfg = ProtoObj.getProto("LOBBY");
    var websocketUrl = GlobalCfg.WEB_SOCKET_LOBBY;
    if (!protoCfg) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding protocol configuration was not found");
      return;
    }
    ;
    if (!protoPathArr) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding protocol bundle path was not found");
      return;
    }
    ;
    if (!websocketUrl) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding websocket URL was not found");
      return;
    }
    ;
    var isSuccess = ProtobufManager.loadProtoFiles(protoPathArr);
    if (!isSuccess) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("Failed to load the corresponding proto file");
      return;
    }
    ;
    LobbyServerManager.setProtoCfgAndUrl(protoCfg, websocketUrl);
    Promise.all([LobbyServerManager.connectServer(true), this.loadBundleScene(toSceneName)]).then(function (arr) {
      var scene = arr[1];
      _this2.curSceneType = toSceneName;
      cc.director.runScene(scene, function () {}, function () {
        _this2.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
      });
    })["catch"](function (err) {
      LoggerUtil.getInstance().error(err);
      _this2.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LobbyServerManager.clientCloseServer();
      CommonFun.getInstance().showTips(err);
    });
  },
  dealEnterGameScene: function dealEnterGameScene(toSceneName) {
    var _this3 = this;
    var protoCfg = null;
    var protoPathArr = null;
    var websocketUrl = null;
    switch (toSceneName) {
      case this.sceneType.BENZ:
        protoCfg = ProtoObj.getProto("Benz");
        protoPathArr = ["proto/benz/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.benZData.endpoint;
        break;
      case this.sceneType.SGJ:
        protoCfg = ProtoObj.getProto("SGJ");
        protoPathArr = ["proto/fruitMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.endpoint;
        break;
      case this.sceneType.MAYA:
        protoCfg = ProtoObj.getProto("MAYA");
        protoPathArr = ["proto/mayaMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.endpoint;
        break;
      case this.sceneType.JOKER:
        protoCfg = ProtoObj.getProto("JOKER");
        protoPathArr = ["proto/jokerMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.jokerMachineData.endpoint;
        break;
      case this.sceneType.INDIA:
        protoCfg = ProtoObj.getProto("INDIA");
        protoPathArr = ["proto/indiaMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.indiaMachineData.endpoint;
        break;
      case this.sceneType.VAMPIRE:
        protoCfg = ProtoObj.getProto("VAMPIRE");
        protoPathArr = ["proto/vampireMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.vampireMachineData.endpoint;
        break;
      case this.sceneType.BULL:
        protoCfg = ProtoObj.getProto("BULL");
        protoPathArr = ["proto/bullMachine/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.bullMachineData.endpoint;
        break;
      case this.sceneType.SEVENUPDOWN:
        protoCfg = ProtoObj.getProto("UPDOWN");
        protoPathArr = ["proto/updown/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.upDownData.endpoint;
        break;
      case this.sceneType.ANDAER:
        protoCfg = ProtoObj.getProto("ANDEER");
        protoPathArr = ["proto/andeer/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.andeerData.endpoint;
        break;
      case this.sceneType.BACCARAT:
        protoCfg = ProtoObj.getProto("baccarat3Patti");
        protoPathArr = ["proto/baccarat3Patti/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.baccaratData.endpoint;
        break;
      case this.sceneType.HORSERACE:
        protoCfg = ProtoObj.getProto("HORSERACE");
        protoPathArr = ["proto/horseRace/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.horseRaceData.endpoint;
        break;
      case this.sceneType.LHD:
        protoCfg = ProtoObj.getProto("LHD");
        protoPathArr = ["proto/lhd/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.lhdData.endpoint;
        break;
      case this.sceneType.MUNDA:
        protoCfg = ProtoObj.getProto("Munda");
        protoPathArr = ["proto/munda/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.mundaData.endpoint;
        break;
      case this.sceneType.MTP:
        protoCfg = ProtoObj.getProto("MTP");
        protoPathArr = ["proto/multiTeenPatti/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.mtpData.endpoint;
        break;
      case this.sceneType.SSC:
        protoCfg = ProtoObj.getProto("SSC");
        protoPathArr = ["proto/ssc/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.sscData.endpoint;
        break;
      case this.sceneType.TEENPATTI:
        protoCfg = ProtoObj.getProto("tpGame");
        protoPathArr = ["proto/tpGame/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.endpoint;
        break;
      case this.sceneType.RUMMY:
        protoCfg = ProtoObj.getProto("Rummy");
        protoPathArr = ["proto/rummy/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.rummyData.endpoint;
        break;
      case this.sceneType.ROCKET:
        protoCfg = ProtoObj.getProto("rocket");
        protoPathArr = ["proto/rocket/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.rocketData.endpoint;
        break;
      case this.sceneType.AVIATOR:
        protoCfg = ProtoObj.getProto("aviator");
        protoPathArr = ["proto/aviator/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.aviatorData.endpoint;
        break;
      case this.sceneType.ZOO:
        protoCfg = ProtoObj.getProto("zooGame");
        protoPathArr = ["proto/zoo/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.zooData.endpoint;
        break;
      case this.sceneType.CRICKET:
        protoCfg = ProtoObj.getProto("cricketGame");
        protoPathArr = ["proto/cricket/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.cricketData.endpoint;
        break;
      case this.sceneType.ZEUS:
        protoCfg = ProtoObj.getProto("zeusGame");
        protoPathArr = ["proto/zeus/gameservice"];
        websocketUrl = GlobalCfg.SMALL_GAME_DATAS.zeusData.endpoint;
        break;
      default:
        break;
    }
    if (!protoCfg) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding protocol configuration was not found");
      return;
    }
    ;
    if (!protoPathArr) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding protocol bundle path was not found");
      return;
    }
    ;
    if (!websocketUrl) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("When jumping to the scene, the corresponding websocket URL was not found");
      return;
    }
    ;
    var isSuccess = ProtobufManager.loadProtoFiles(protoPathArr);
    if (!isSuccess) {
      this.isLoadingScene = false;
      CommonFun.getInstance().hidProgress();
      LoggerUtil.getInstance().error("Failed to load the corresponding proto file");
      CommonFun.getInstance().showTips("Failed to load the corresponding proto file!");
      return;
    }
    ;
    GameServerManager.setProtoCfgAndUrl(protoCfg, websocketUrl);
    if (toSceneName == this.sceneType.SSC) {
      Promise.all([GameServerManager.connectServer(true), this.loadSSCBundlePab(toSceneName)]).then(function (arr) {
        var prefab = arr[1];
        _this3.curSceneType = toSceneName;
        var pab_ssc = cc.instantiate(prefab);
        cc.Canvas.instance.node.addChild(pab_ssc);
        _this3.isLoadingScene = false;
        CommonFun.getInstance().showGameStartMask();
        CommonFun.getInstance().hidProgress();
        CommonFun.getInstance().hideSidebarData();
      })["catch"](function (err) {
        LoggerUtil.getInstance().error(err);
        _this3.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
        GameServerManager.clientCloseServer();
        CommonFun.getInstance().showTips(err);
      });
    } else {
      Promise.all([GameServerManager.connectServer(true), this.loadBundleScene(toSceneName)]).then(function (arr) {
        var scene = arr[1];
        _this3.curSceneType = toSceneName;
        cc.director.runScene(scene, function () {}, function () {
          _this3.isLoadingScene = false;
          // CommonFun.getInstance().showGameStartMask();
          CommonFun.getInstance().hidProgress();
          CommonFun.getInstance().hideSidebarData();
        });
      })["catch"](function (err) {
        LoggerUtil.getInstance().error(err);
        _this3.isLoadingScene = false;
        CommonFun.getInstance().hidProgress();
        GameServerManager.clientCloseServer();
        CommonFun.getInstance().showTips(err);
      });
    }
    ;
  },
  loadSSCBundlePab: function loadSSCBundlePab(toSceneName) {
    return new Promise(function (resolve, reject) {
      if (toSceneName && toSceneName.indexOf("/") == -1) {
        LoggerUtil.getInstance().error("toSceneName format error: " + toSceneName);
        reject("toSceneName format error: " + toSceneName);
        return;
      }
      ;
      var arr = toSceneName.split("/");
      var bundleName = arr[0];
      CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
        bundle.load("sscPab/pab_ssc", cc.Prefab, function (err, prefab) {
          if (!err) {
            resolve(prefab);
          } else {
            reject("loading to pab_ssc-Prefab failed: " + err);
          }
          ;
        });
      }, function (err) {
        reject("failed to load " + bundleName + "-bundle: " + err);
      });
    });
  },
  loadBundleScene: function loadBundleScene(toSceneName) {
    return new Promise(function (resolve, reject) {
      if (toSceneName && toSceneName.indexOf("/") == -1) {
        LoggerUtil.getInstance().error("toSceneName format error: " + toSceneName);
        reject("toSceneName format error: " + toSceneName);
        return;
      }
      ;
      var arr = toSceneName.split("/");
      var bundleName = arr[0];
      var sceneName = arr[1];
      CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
        bundle.loadScene(sceneName, function (err1, scene) {
          if (!err1) {
            resolve(scene);
          } else {
            reject("Jumping to " + sceneName + "-Scene failed: " + err1);
          }
          ;
        });
      }, function (err) {
        reject("failed to load " + bundleName + "-bundle: " + err);
      });
    });
  },
  proloadBundleScene: function proloadBundleScene(toSceneName) {
    if (toSceneName == this.sceneType.UPDATE || toSceneName == this.sceneType.SSC) {
      return;
    }
    ;
    if (toSceneName && toSceneName.indexOf("/") == -1) {
      LoggerUtil.getInstance().error("toSceneName format error: " + toSceneName);
      return;
    }
    ;
    var arr = toSceneName.split("/");
    var bundleName = arr[0];
    var sceneName = arr[1];
    CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
      bundle.preloadScene(sceneName);
    }, function (err) {
      LoggerUtil.getInstance().log(err);
    });
  },
  reqTokenInfo: function reqTokenInfo(notify) {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_TOKEN_INFO_START);
    CommonFun.getInstance().showProgress();
    var httpUrl = "";
    var httpParam = {};
    var device = CommonFun.getInstance().getDeviceId();
    var gaid = APPManager.getGAID();
    var conversionListener = APPManager.getAppsFlyerConversionListener();
    // LoggerUtil.getInstance().log(`登录 device: ${device} 广告id gaid: ${gaid}`)

    console.log("广告id gaid:" + gaid);
    var googleId = APPManager.getPackageName();
    if (notify.loginType == "PHONE") {
      httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/phonelogin";
      httpParam = {
        "phone": notify.phone,
        "code": notify.code,
        "login_product": GlobalCfg.PRODUCT_ID,
        "channel_info": GlobalCfg.CHANNEL_INFO,
        "googleId": googleId,
        "admin_mode": 0,
        "device": device,
        "adv": GlobalCfg.ADVERTISING_ID,
        "adid": GlobalCfg.ADJUST_ID,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "afid": GlobalCfg.APPSFLYER_ID,
        "fcmtoken": GlobalCfg.FIREBASE_TOKEN,
        "token": notify.token,
        "gaid": gaid,
        "sign": CommonFun.getInstance().encryptByRSA(device)
      };
    } else if (notify.loginType == "FACEBOOK") {
      httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/facebooklogin";
      if (notify.code.Sex == "") {
        notify.code.Sex = 1;
      } else if (notify.code.Sex == "male") {
        notify.code.Sex = 1;
      } else {
        notify.code.Sex = 2;
      }
      ;
      httpParam = {
        "mobile": "",
        "login_product": GlobalCfg.PRODUCT_ID,
        "channel_info": GlobalCfg.CHANNEL_INFO,
        "googleId": googleId,
        "admin_mode": 0,
        "device": device,
        "headImgUrl": notify.code.HeadImgUrl,
        "sex": notify.code.Sex,
        "userName": notify.code.UserName,
        "userId": notify.code.UserId,
        "token": notify.code.Token,
        "gaid": gaid,
        "adv": GlobalCfg.ADVERTISING_ID,
        "adid": GlobalCfg.ADJUST_ID,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "afid": GlobalCfg.APPSFLYER_ID,
        "fcmtoken": GlobalCfg.FIREBASE_TOKEN,
        "sign": CommonFun.getInstance().encryptByRSA(notify.code.UserId)
      };
    } else if (notify.loginType == "ACCOUNT") {
      httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/accountloginv1";
      httpParam = {
        "device": device,
        "account": notify.account,
        "password": notify.password,
        "admin_mode": 0,
        "channel_info": GlobalCfg.CHANNEL_INFO,
        "googleId": googleId,
        "adv": GlobalCfg.ADVERTISING_ID,
        "adid": GlobalCfg.ADJUST_ID,
        "gaid": gaid,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "afid": GlobalCfg.APPSFLYER_ID,
        "fcmtoken": GlobalCfg.FIREBASE_TOKEN,
        "sign": CommonFun.getInstance().encryptByRSA(notify.account),
        "cl": conversionListener,
        "isRegister": notify.isRegister
      };
    } else if (notify.loginType == "GUEST") {
      // httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/visitorlogin"
      httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/visitorlogin";
      httpParam = {
        "login_product": GlobalCfg.PRODUCT_ID,
        "device": device,
        "admin_mode": 0,
        "channel_info": GlobalCfg.CHANNEL_INFO,
        "googleId": googleId,
        "adv": GlobalCfg.ADVERTISING_ID,
        "adid": GlobalCfg.ADJUST_ID,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "afid": GlobalCfg.APPSFLYER_ID,
        "gaid": gaid,
        "fcmtoken": GlobalCfg.FIREBASE_TOKEN,
        "sign": CommonFun.getInstance().encryptByRSA(device),
        "packageSdkType": GlobalCfg.PACKAGE_REPORT_METHOD,
        "cl": conversionListener
      };
    } else if (notify.loginType == "USERID") {
      // httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/visitorlogin"
      httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/v1/in/testxiaowei";
      httpParam = {
        "login_product": GlobalCfg.PRODUCT_ID,
        "device": device,
        "admin_mode": 0,
        "channel_info": GlobalCfg.CHANNEL_INFO,
        "googleId": googleId,
        "adv": GlobalCfg.ADVERTISING_ID,
        "adid": GlobalCfg.ADJUST_ID,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "afid": GlobalCfg.APPSFLYER_ID,
        "gaid": gaid,
        "fcmtoken": GlobalCfg.FIREBASE_TOKEN,
        "sign": CommonFun.getInstance().encryptByRSA(device),
        "packageSdkType": GlobalCfg.PACKAGE_REPORT_METHOD,
        "user_id": notify.userid,
        "cl": conversionListener
      };
    }
    ;
    return new Promise(function (resolve, reject) {
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
        if (msg && msg.result == 0 && msg.data) {
          var msgData = msg.data;
          /**
           * 是否是新用户。0: 不是， 1: 是。
           */
          var isNew = msgData.is_new;
          GlobalCfg.USER_DATAS.userId = msgData.userid;
          GlobalCfg.USER_DATAS.token = msgData.token;
          if (!notify.isRegister) {
            //非注册消息，需要保存token
            cc.sys.localStorage.setItem("login_token", msgData.token);
            cc.sys.localStorage.setItem("login_userid", msgData.userid);
          }
          if (notify.loginType == "PHONE" && notify.phone) {
            cc.sys.localStorage.setItem("login_phone", notify.phone);
            cc.sys.localStorage.setItem("phone_token", msgData.token);
          }
          ;
          if (msgData.is_google_white == 1) {
            GlobalCfg.SWITCH_TYPE = 1;
          }
          ;
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_TOKEN_INFO_SUCCESS);
          resolve();
        } else {
          CommonFun.getInstance().hidProgress();
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
            msgData: {
              msgTips: msg.msg
            }
          });
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_TOKEN_INFO_FAIL);
          reject("/V1/xxxxlogin interface, server data exception!");
        }
        ;
      }, function (msg) {
        console.log("xxxxlogin interface, server data exception!", msg);
        CommonFun.getInstance().hidProgress();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
          msgData: {
            msgTips: msg.msg
          }
        });
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_TOKEN_INFO_FAIL);
        reject("/V1/xxxxlogin interface, request for server data timeout!");
      });
    });
  },
  reqBearerToken: function reqBearerToken() {
    var _this4 = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_BEARER_INFO_START);
    CommonFun.getInstance().showProgress();
    var device = CommonFun.getInstance().getDeviceId();
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/login";
    var httpParam = {
      "invite_code": GlobalCfg.OPENINSTALL_INVITE_CODE ? GlobalCfg.OPENINSTALL_INVITE_CODE : "",
      "userid": GlobalCfg.USER_DATAS.userId,
      "token": GlobalCfg.USER_DATAS.token,
      "device": device,
      "channel_info": GlobalCfg.CHANNEL_INFO,
      "login_product": GlobalCfg.PRODUCT_ID
    };
    LoggerUtil.getInstance().error("caojun httpParam: " + JSON.stringify(httpParam));
    return new Promise(function (resolve, reject) {
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
        if (msg && msg.result == 0 && msg.data) {
          var msgData = msg.data;
          var token = msgData.token;
          LoggerUtil.getInstance().error("v1/login msgData: " + JSON.stringify(msgData));
          var login_way = msgData.login_way;
          /**
           * 用户token的有效时间截点
           */
          var expires_at = msgData.expires_at;
          /**
           * 后台的配置
           */
          var config = msgData.config;
          /**
           * 默认头像列表
           */
          var avatar_list = config.avatar_list ? config.avatar_list : [];
          /**
           * 客服信息
           */
          var customer_service = config.customer_service ? config.customer_service : ""; // 旧字段
          var support = config.support ? config.support : {
            whatsApp: '',
            email: '',
            facebook: '',
            telegram: '',
            cloud: '',
            landingPage: ''
          };
          /**
           *  游戏模式，特殊渠道百人加一分场，另一套数值
           */
          var game_pattern = config.game_pattern ? config.game_pattern : 0;
          /**
           * 子游戏列表
           */
          var games = config.games ? config.games : [];
          /**
           * 开放的模块
           */
          var open_modules = config.open_modules ? config.open_modules : [];
          /**
           * 凭证支付开启
           */
          var proof_payment_opened = config.proof_payment_opened ? config.proof_payment_opened : false;
          /**
           * 拒绝未充值玩家玩百人
           */
          var refuse_unpay_hundred = config.refuse_unpay_hundred ? config.refuse_unpay_hundred : false;
          /**
           * 三方支付开启
           */
          var third_payment_opened = config.third_payment_opened ? config.third_payment_opened : false;
          /**
           * 首充商品列表
           */
          var first_pay_product = config.first_pay_product ? config.first_pay_product : [];
          /**
           * 首充清空钱包
           */
          var first_recharge_reset_wallet = config.first_recharge_reset_wallet ? config.first_recharge_reset_wallet : false;
          /**
           * VIP
           */
          var vip_levels = config.vip_levels ? config.vip_levels : [];
          /**
           * 
           */
          var vip_expires_day = config.vip_expires_day ? config.vip_expires_day : 0;
          var IP_URL = config.ipUrl ? config.ipUrl : "";
          /**
           * VIP扭蛋机商品列表
           * 二维数组  下标0表示物品id， 1表示数量
           * 物品id说明：10:dep, 11:winnings, 12:bonus
           */
          var gacha = config.gacha ? config.gacha : [];
          GlobalCfg.USER_DATAS.BearerToken = token;
          GlobalCfg.USER_DATAS.loginWay = login_way;
          GlobalCfg.USER_DATAS.games = games;
          GlobalCfg.USER_DATAS.avatarList = avatar_list;
          GlobalCfg.USER_DATAS.customerService = support;
          GlobalCfg.USER_DATAS.refuseUnpayHundred = refuse_unpay_hundred;
          GlobalCfg.USER_DATAS.gamePattern = game_pattern;
          GlobalCfg.USER_DATAS.thirdPaymentOpened = third_payment_opened;
          GlobalCfg.USER_DATAS.proofPaymentOpened = proof_payment_opened;
          GlobalCfg.USER_DATAS.first_pay_product = first_pay_product;
          GlobalCfg.USER_DATAS.openModules = open_modules;
          GlobalCfg.USER_DATAS.firstRechargeResetWallet = first_recharge_reset_wallet;
          GlobalCfg.USER_DATAS.vipLevels = vip_levels;
          GlobalCfg.USER_DATAS.vipExpiresDay = vip_expires_day;
          GlobalCfg.USER_DATAS.gacha = gacha;
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_BEARER_INFO_SUCCESS);
          if (IP_URL && IP_URL != "") {
            _this4.dealIpUrl(IP_URL);
          }
          resolve();
        } else {
          CommonFun.getInstance().hidProgress();
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
            msgData: {
              msgTips: msg.msg
            }
          });
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_BEARER_INFO_FAIL);
          reject("/V1/login interface, server returned abnormal data!");
        }
        ;
      }, function (msg) {
        CommonFun.getInstance().hidProgress();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
          msgData: {
            msgTips: msg.msg
          }
        });
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_BEARER_INFO_FAIL);
        reject("/V1/login interface, request for server data timeout!");
      });
    });
  },
  reqUserDataInfo: function reqUserDataInfo() {
    var _this5 = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_USERDATA_INFO_START);
    CommonFun.getInstance().showProgress();
    var userinfoUrl = GlobalCfg.HTTP_SERVER + "/v1/userinfo?version=" + GlobalCfg.ASSETS_VERSION;
    return new Promise(function (resolve, reject) {
      CommonFun.getInstance().httpGet(userinfoUrl, function (msg) {
        if (msg && msg.result == 0 && msg.data) {
          var msgData = msg.data;
          /**
           * 用户长ID
           */
          var user_id = msgData.user_id ? msgData.user_id : "";
          /**
           * 用户短ID
           */
          var display_name = msgData.display_name ? msgData.display_name : "";
          /**
           * 用户性别。0：男，1：女
           */
          var sex = msgData.sex ? msgData.sex : 0;
          /**
           * 玩家昵称
           */
          var nickname = msgData.nickname ? msgData.nickname : "";
          /**
           * 玩家头像url
           */
          var image_url = msgData.image_url ? msgData.image_url : "";
          /**
           * 玩家手机号，仅用于登录
           */
          var phone = msgData.phone ? msgData.phone : "";
          /**
           * 玩家邮箱号
           */
          var mail = msgData.mail ? msgData.mail : "";
          /**
           * 玩家实名的名字
           */
          var real_name = msgData.real_name ? msgData.real_name : "";
          /**
           * 玩家正在哪个小游戏中。例如：["minirummy"]表示在拉米游戏
           */
          var in_game = msgData.in_game ? msgData.in_game : [];
          var wallet = msgData.wallet;
          var channel = msgData.channel ? msgData.channel : "";
          /**
           * 玩家钻石总值
           */
          var amount = wallet ? wallet.amount ? wallet.amount : 0 : 0;
          /**
           * 玩家钻石deposit
           */
          var deposit = wallet ? wallet.deposit ? wallet.deposit : 0 : 0;
          /**
           * 玩家钻石winnings
           */
          var winnings = wallet ? wallet.winnings ? wallet.winnings : 0 : 0;
          /**
           * 玩家bonus
           */
          var bonus = wallet ? wallet.voucher ? wallet.voucher : 0 : 0;
          /**
           * 代金券卡待领取的奖励
           */
          var undraw = wallet ? wallet.undraw ? wallet.undraw : 0 : 0;
          /**
           * 玩家积分(体验币)，用于体验场
           */
          var trial = msgData.trial ? msgData.trial : 0;
          /**
           * 是否有新邮件, 用于大厅邮件按钮红点显示
           */
          var new_email = msgData.new_email ? msgData.new_email : false;
          /**
           * 玩家充值总金额, 可以用来判断是否是首充玩家。
           */
          var recharged = msgData.recharged ? msgData.recharged : 0;
          /**
           * 邀请码信息
           */
          var code = msgData.code ? msgData.code.code ? msgData.code.code : "" : "";
          /**
           * 玩家提现总额
           */
          var withdraw = msgData.withdraw ? msgData.withdraw : 0;
          /**
           * 玩家剩余提现次数
           */
          var remain_withdraw_count = msgData.remain_withdraw_count ? msgData.remain_withdraw_count : 0;
          /**
           * 判断是否已购买代金券卡
           * 0: 没有购买，100 ~103: lucky、银、金、钻
           */
          var voucher_card = msgData.voucher_card ? msgData.voucher_card : 0;
          /**
           * 钻卡购买后每日赠送
           */
          var voucher_day_gift = msgData.voucher_day_gift ? msgData.voucher_day_gift : [];
          /**
           * 代金券卡购买的时间
           */
          var voucher_card_created = msgData.voucher_card_created ? msgData.voucher_card_created : 0;
          /**
           * lucky、银、金、钻信息列表
           */
          var series_card = msgData.series_card ? msgData.series_card : [];
          /**
           * 推广员待领取的奖励
           */
          var promoter_unclaimed = msgData.promoter_unclaimed ? msgData.promoter_unclaimed : 0;
          /**
           * 拼多多是否有新活动
           */
          var pdd_newly = msgData.pdd_newly ? msgData.pdd_newly : false;
          /**
           * 拼多多剩余转盘次数
           */
          var pdd_remain_count = msgData.pdd_remain_count ? msgData.pdd_remain_count : 0;
          /**
           * 总游戏局数
           */
          var innings = msgData.innings ? msgData.innings : 0;
          /**
           * 挑战任务是否有待领取
           */
          var challenge_unclaimed = msgData.challenge_unclaimed ? msgData.challenge_unclaimed : false;
          /**
           * 挑战任务是否在进行中
           */
          var challenge_running = msgData.challenge_running ? msgData.challenge_running : false;
          /**
           * 首次赠送钻石
           */
          var first_gift_diamond = msgData.first_gift_diamond ? msgData.first_gift_diamond : 0;
          /**
           * 救济赠送钻石
           */
          var relief_gift_diamond = msgData.relief_gift_diamond ? msgData.relief_gift_diamond : 0;
          /**
           * 最高充值金额(分)
           */
          var highest_recharged = msgData.highest_recharged ? msgData.highest_recharged : 0;
          /**
           * 是否有PDD任务
           */
          var have_pdd_activity = msgData.have_pdd_activity ? msgData.have_pdd_activity : false;
          var inducement = msgData.get_recharge_inducement_info_ack ? msgData.get_recharge_inducement_info_ack : {};

          // LoggerUtil.getInstance().log("caojun inducement", inducement);
          /**
           * 签到信息。同v1/signlist接口数据
           */
          var sign_info = msgData.sign_info ? msgData.sign_info : null;
          /**
           * 转盘活动剩余次数。同v1/turntableremaincount接口数据
           */
          var turntable_remain_count = msgData.turntable_remain_count ? msgData.turntable_remain_count : 0;
          /**
           * 邮件信息。同v1/mailbox/mail接口数据
           */
          var mails = msgData.mails ? msgData.mails : [];
          /**
           * 充值选项。同v1/payment/commodity/list接口数据
           */
          var commodity = msgData.commodity ? msgData.commodity : []; // 旧商品列表
          var store = msgData.store ? msgData.store : []; // 新商品列表
          if (store.length <= 0) {
            store = commodity;
          }
          /**
           * 最近一次充值金额
           */
          var last_recharged = msgData.last_recharged ? msgData.last_recharged : 0;
          /**
           * 提现选项。同transferoption/list + take_profit_address/list接口数据
           */
          var transfer_config = msgData.transfer_config ? msgData.transfer_config : null;
          /**
           * 个人提现地址。同/v1/payment/india_address接口数据
           */
          var transfer_address = msgData.transfer_address ? msgData.transfer_address : null;
          /**
           * 小游戏房间列表。同/v1/small_game/roomlist接口数据
           */
          var game_room_list = msgData.game_room_list ? msgData.game_room_list : {
            andarbahar: [],
            rummy: [],
            teenpatti: []
          };
          var next_disco = msgData.next_disco ? msgData.next_disco : {
            id: null,
            amount: null,
            gift: null,
            show: false
          };
          // 用户注册时间
          var register_time = msgData.register_time ? msgData.register_time : 0;
          /**
           * superDiscount 活动列表
           */
          var disco_list = msgData.disco_list ? msgData.disco_list : [];
          var plot_pay = msgData.plot_pay ? msgData.plot_pay : [];
          LoggerUtil.getInstance().error("plot_pay", msgData.plot_pay);
          var only_pay = msgData.only_pay ? msgData.only_pay : [];
          var only_pay_time = msgData.only_pay_time ? msgData.only_pay_time : 0;
          /**
           * VIP信息
           */
          var user_vip = msgData.user_vip ? msgData.user_vip : {};
          var user_level = msgData.user_level ? msgData.user_level : 0; // 用户特殊身份 默认为0，100 代表不清模式下被首清了
          /**
           * Go Betting 活动
           */
          var betrebate = msgData.betrebate ? msgData.betrebate : {
            bet: 0,
            item: []
          };
          GlobalCfg.USER_DATAS.userId = display_name;
          GlobalCfg.USER_DATAS.sex = sex;
          GlobalCfg.USER_DATAS.userName = nickname;
          GlobalCfg.USER_DATAS.userHeadimgurl = image_url;
          GlobalCfg.USER_DATAS.phone = phone;
          GlobalCfg.USER_DATAS.mail = mail;
          GlobalCfg.USER_DATAS.realname = real_name;
          GlobalCfg.USER_DATAS.inGame = in_game;
          GlobalCfg.USER_DATAS.userDiamond = amount;
          GlobalCfg.USER_DATAS.deposit = deposit;
          GlobalCfg.USER_DATAS.winnings = winnings;
          GlobalCfg.USER_DATAS.trial = trial;
          GlobalCfg.USER_DATAS.bonus = bonus;
          GlobalCfg.USER_DATAS.undraw = undraw;
          GlobalCfg.USER_DATAS.new_email = new_email;
          GlobalCfg.USER_DATAS.recharged = recharged;
          GlobalCfg.USER_DATAS.inviteCode = code;
          GlobalCfg.USER_DATAS.remainWithdrawCount = remain_withdraw_count;
          GlobalCfg.USER_DATAS.voucherCard = voucher_card;
          GlobalCfg.USER_DATAS.voucherDayGift = voucher_day_gift;
          GlobalCfg.USER_DATAS.voucherCardCreated = voucher_card_created;
          GlobalCfg.USER_DATAS.seriesCard = series_card;
          GlobalCfg.USER_DATAS.promoterUnclaimed = promoter_unclaimed;
          GlobalCfg.USER_DATAS.pddNewly = pdd_newly;
          GlobalCfg.USER_DATAS.pddRemainCount = pdd_remain_count;
          GlobalCfg.USER_DATAS.innings = innings;
          GlobalCfg.USER_DATAS.challengeUnclaimed = challenge_unclaimed;
          GlobalCfg.USER_DATAS.challengeRunning = challenge_running;
          GlobalCfg.USER_DATAS.firstGiftDiamond = first_gift_diamond;
          GlobalCfg.USER_DATAS.reliefGiftDiamond = relief_gift_diamond;
          GlobalCfg.USER_DATAS.highestRecharged = highest_recharged;
          GlobalCfg.USER_DATAS.havePddActivity = have_pdd_activity;
          GlobalCfg.USER_DATAS.signInfo = sign_info;
          GlobalCfg.USER_DATAS.turntableRemainCount = turntable_remain_count;
          GlobalCfg.USER_DATAS.mails = mails;
          GlobalCfg.USER_DATAS.commodity = commodity;
          GlobalCfg.USER_DATAS.store = store;
          GlobalCfg.USER_DATAS.transferConfig = transfer_config;
          GlobalCfg.USER_DATAS.transferAddress = transfer_address;
          GlobalCfg.USER_DATAS.gameRoomList = game_room_list;
          GlobalCfg.USER_DATAS.isNotCharge = recharged == 0 ? true : false;
          GlobalCfg.USER_DATAS.nextDisco = next_disco;
          GlobalCfg.USER_DATAS.registerTime = register_time;
          GlobalCfg.USER_DATAS.discoList = disco_list;
          GlobalCfg.USER_DATAS.plotPay = plot_pay;
          GlobalCfg.USER_DATAS.onlyPay = only_pay;
          GlobalCfg.USER_DATAS.only_pay_countDownTime = only_pay_time + Date.now();
          GlobalCfg.USER_DATAS.only_pay_time = only_pay_time;
          GlobalCfg.USER_DATAS.userVip = user_vip;
          GlobalCfg.USER_DATAS.userLevel = user_level;
          GlobalCfg.USER_DATAS.betrebate = betrebate;
          GlobalCfg.USER_DATAS.lastRecharged = last_recharged;
          GlobalCfg.USER_DATAS.is_club = msgData.is_club;
          GlobalCfg.USER_DATAS.service_help_url = msgData.service_help_url;
          GlobalCfg.USER_DATAS.web_customer_service = msgData.web_customer_service;
          GlobalCfg.USER_DATAS.inducement = inducement;
          LoggerUtil.getInstance().log("GlobalCfg.USER_DATAS.userVip == ", GlobalCfg.USER_DATAS.userVip);
          if (channel.length > 0) {
            GlobalCfg.USER_DATAS.CHANNEL_INFO = channel.replace('_01', '');
          }
          ;
          // LoggerUtil.getInstance().log('caojun GlobalCfg.USER_DATAS.lastRecharged :', GlobalCfg.USER_DATAS.lastRecharged);
          // LoggerUtil.getInstance().log('caojun GlobalCfg.USER_DATAS.recharged :', GlobalCfg.USER_DATAS.recharged);
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_USERDATA_INFO_SUCCESS);
          _this5.updateShopSelectRechargeAmount(last_recharged);
          resolve();
        } else {
          CommonFun.getInstance().hidProgress();
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
            msgData: {
              msgTips: msg.msg
            }
          });
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_USERDATA_INFO_FAIL);
          reject("/V1/userinfo interface, server returned abnormal data!");
        }
        ;
      }, function (msg) {
        CommonFun.getInstance().hidProgress();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO,
          msgData: {
            msgTips: msg.msg
          }
        });
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_USERDATA_INFO_FAIL);
        reject("/V1/userinfo interface, request for server data timeout!");
      }, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  //发送给服务器 无需处理
  dealIpUrl: function dealIpUrl(IP_URL) {
    IP_URL = IP_URL + "?userId=" + GlobalCfg.USER_DATAS.userId;
    CommonFun.getInstance().httpGet(IP_URL, function (jsonObj) {});
  },
  /**
   * 更新商城商品默认选中值
   * @param {Number} lastRecharged 
   */
  updateShopSelectRechargeAmount: function updateShopSelectRechargeAmount(lastRecharged) {
    LoggerUtil.getInstance().log('11 GlobalCfg.SELECT_RECHARGE_ACOUNT:', GlobalCfg.SELECT_RECHARGE_ACOUNT);
    if (GlobalCfg.USER_DATAS.recharged > 0) {
      var index = 0,
        length = GlobalCfg.USER_DATAS.store.length;
      while (index < length) {
        if (GlobalCfg.USER_DATAS.store[index].amount == lastRecharged) {
          index++;
          if (index >= length) {
            index = length - 1;
          }
          GlobalCfg.SELECT_RECHARGE_ACOUNT = GlobalCfg.USER_DATAS.store[index].amount;
          break;
        }
        index++;
      }
    }
    LoggerUtil.getInstance().log('22 GlobalCfg.SELECT_RECHARGE_ACOUNT:', GlobalCfg.SELECT_RECHARGE_ACOUNT);
  },
  getAdvertisingId: function getAdvertisingId() {
    var _this6 = this;
    var startTime = cc.sys.now();
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_START);
    return new Promise(function (resolve, reject) {
      var getAdvertisingIdCallback = function getAdvertisingIdCallback() {
        var endTime = cc.sys.now();
        var advertisingId = APPManager.getAdvertisingId();
        if (advertisingId && advertisingId.length > 0) {
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_SUCCESS, endTime - startTime);
          GlobalCfg.ADVERTISING_ID = advertisingId;
          _this6.unschedule(getAdvertisingIdCallback);
          resolve(advertisingId);
          return;
        } else if (endTime - startTime > 20000) {
          CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.REQ_ADVERTISINGID_FAIL, endTime - startTime);
          GlobalCfg.ADVERTISING_ID = "test01";
          _this6.unschedule(getAdvertisingIdCallback);
          resolve("");
          return;
        }
        ;
      };
      _this6.schedule(getAdvertisingIdCallback, 0.5);
    });
  }
});
SceneManager.getInstance = function () {
  if (!SceneManager._instance) {
    SceneManager._instance = new SceneManager();
  }
  ;
  return SceneManager._instance;
};
module.exports = SceneManager;
window.SceneManager = SceneManager;

cc._RF.pop();