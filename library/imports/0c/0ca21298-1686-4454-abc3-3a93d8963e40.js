"use strict";
cc._RF.push(module, '0ca21KYFoZEVKvDOpPYlj5A', 'Update');
// Main/Update.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_test1: cc.Button,
    btn_testLogin: cc.Button,
    editBox_invited_test: cc.EditBox,
    editBox_chanel_test: cc.EditBox,
    editBox_account: cc.EditBox,
    editBox_password: cc.EditBox,
    editBox_confirm: cc.EditBox,
    node_editBox_confirm: cc.Node
  },
  ctor: function ctor() {
    this.reqComparisonMainMD5InfoAcount = 0; // 请求远程assets下的manifest文件的次数（请求次数超过3次，判定为异常）
    this.needUpdateFileArr = []; // 存放需要更新的文件的容器
    this.simulationCheckFileAcount = 0; // 模拟远程和本地文件比较差异的次数
    this.totalNumberOfRemoteMainFiles = 0; // 远程assets下的manifest文件中记录的文件总数
    this.totalNumberOfFilesDownloaded = 0; // 已更新完成的文件数量
    this.curNumberOfJoinedDownloader = 0; // 当前添加到下载器的需下载文件数量
    this.updateStatusPoints = 0; // 更新状态圆点的个数  
    this.downloaderArr = []; // 热更新下载器容器（实现多管道下载）
    this.testButtonIsActive = false; // 测试按钮是否激活
    this.testIndexNum = 0; // 测试按钮点击次数
    this.sendVerifyCodeReqAcount = 0;
    this.verifyTimer = null;
    this.or_sprite_pos = cc.v2(326, -160);
    this.btn_facebookLogin_pos = cc.v2(209, -274);
    this.btn_guestLogin_pos = cc.v2(326, -225);
    this.or_sprite_pos1 = cc.v2(326, -76);
    this.btn_facebookLogin_pos1 = cc.v2(209, -144);
    this.btn_guestLogin_pos1 = cc.v2(326, -144);
    this.protoFiles = ["proto/baseproto", "proto/lobbyservice", "proto/gamebase", "proto/benz/gameservice", "proto/fruitMachine/gameservice", "proto/mayaMachine/gameservice", "proto/jokerMachine/gameservice", "proto/indiaMachine/gameservice", "proto/vampireMachine/gameservice", "proto/bullMachine/gameservice", "proto/updown/gameservice", "proto/andeer/gameservice", "proto/baccarat3Patti/gameservice", "proto/horseRace/gameservice", "proto/lhd/gameservice", "proto/munda/gameservice", "proto/multiTeenPatti/gameservice", "proto/ssc/gameservice", "proto/tpGame/gameservice", "proto/rummy/gameservice", "proto/rocket/gameservice", "proto/aviator/gameservice", "proto/chickenroad/gameservice", "proto/zoo/gameservice", "proto/cricket/gameservice", "proto/zeus/gameservice"];
    this.baseBundlesCheckUpdateArr = ['ResourcesBundle'];
    this.baseBundlesNeedUpdateArr = [];
    this.baseBundlesUpdateCompleteArr = [];
    this.updateStartTime = 0;
    this.btnWenZiClickTimes = 0;
    this.loadDiffFilesStartTime = 0;
    this.loadBundlesStartTime = 0;
    this.isHaveUpdateForResources = false;
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_UPDATE_VIEW);
    CommonFun.getInstance().initVerticalAcc();
    CommonFun.getInstance().hidProgress();
    CommonFun.getInstance().removeCarouselStrip();
    CommonFun.getInstance().removeSidebar();

    // Update节点部分
    this.progressBar = this.node.getChildByName("updateLayer").getComponent(cc.ProgressBar);
    this.lab_updateContentTips = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_up").getComponent(cc.Label);
    this.lab_updatePoint = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_point").getComponent(cc.Label);
    this.lab_updateProgress = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_%").getComponent(cc.Label);

    // login节点部分
    this.node_loginLayer = this.node.getChildByName("loginLayer");
    // this.editBox_account = this.node_loginLayer.getChildByName("editBox_account").getComponent(cc.EditBox);
    // this.editBox_password = this.node_loginLayer.getChildByName("editBox_password").getComponent(cc.EditBox);
    // this.node_btn_reqVerify = this.node_loginLayer.getChildByName("btn_reqVerify");
    // this.btn_reqVerify = this.node_btn_reqVerify.getComponent(cc.Button);
    this.node_btn_accountLogin = this.node_loginLayer.getChildByName("btn_accountLogin");
    this.node_btn_register = this.node_loginLayer.getChildByName("btn_register");
    // this.node_btn_quickLogin = this.node_loginLayer.getChildByName("btn_quickLogin");
    // this.node_btn_facebookLogin = this.node_loginLayer.getChildByName("btn_facebookLogin");
    this.node_btn_guestLogin = this.node_loginLayer.getChildByName("btn_guestLogin");
    this.node_bg_title = this.node_loginLayer.getChildByName("bg_title");
    this.node_lab_accountTips = this.editBox_account.node.getChildByName("lab_accountTips");
    this.node_lab_passwordTips = this.editBox_password.node.getChildByName("lab_passwordTips");
    this.node_lab_confirmTips = this.editBox_confirm.node.getChildByName("lab_confirmTips");
    this.node_btn_wenZi = this.node_loginLayer.getChildByName("btn_wenZi");
    // this.lab_otpTips = this.node_loginLayer.getChildByName("btn_reqVerify").getChildByName("Background").getChildByName("lab_otpTips").getComponent(cc.Label);

    this.progressBar.node.active = false;
    this.lab_updateContentTips.node.active = false;
    this.lab_updatePoint.node.active = false;
    this.lab_updateProgress.node.active = false;
    this.node_loginLayer.active = false;
    this.editBox_account.node.on('editing-did-began', this.editBoxCallback, this);
    this.editBox_password.node.on('editing-did-began', this.editBoxCallback, this);
    this.editBox_confirm.node.on('editing-did-began', this.editBoxCallback, this);
    this.editBox_invited_test.node.on('editing-did-began', this.editBoxCallback, this);
    this.editBox_chanel_test.node.on('editing-did-began', this.editBoxCallback, this);

    // this.node_btn_reqVerify.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
    this.node_btn_accountLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
    this.node_btn_register.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);

    // this.node_btn_quickLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
    // this.node_btn_facebookLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
    this.node_btn_guestLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
    this.node_btn_wenZi.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);
    this.btn_test1.node.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);
    this.btn_testLogin.node.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO) {
      CommonFun.getInstance().hidProgress();
      CommonFun.getInstance().showTips(notify.msgTips);
      self.progressBar.node.active = false;
      self.node_loginLayer.active = true;
      self.sendVerifyCodeReqAcount = 0;
      // self.btn_reqVerify.interactable = true;
      // self.btn_reqVerify.enableAutoGrayEffect = false;
      self.lab_updatePoint.node.active = false;
      self.lab_updateProgress.node.active = false;
      // clearInterval(self.verifyTimer);
      // self.verifyTimer = null;
      // self.lab_otpTips.string = 'OTP';
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS) {
      self.setZipFileLoadProgress(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE) {
      self.setZipFileLoadComplete(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_ERROR) {
      var subpackgeName = notify.subpackgeName;
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_ERROR + "-" + subpackgeName);
    }
  },
  setZipFileLoadProgress: function setZipFileLoadProgress(notify) {
    if (!notify) {
      return;
    }
    ;
    LoggerUtil.getInstance().log("\u6B63\u5728\u4E0B\u8F7D\u7684BUNDLE\u662F: " + notify.subpackgeName);
    var baseBundle = notify.subpackgeName;
    var progress = Number(notify.progress);
    var allProgress = 0;
    var len = this.baseBundlesNeedUpdateArr.length;
    for (var i = 0; i < len; i++) {
      var tempObj = this.baseBundlesNeedUpdateArr[i];
      if (tempObj.baseBundle == baseBundle) {
        tempObj.progress = progress;
      }
      ;
      allProgress += tempObj.progress;
    }
    ;
    var tempProgress = allProgress / (len * 100);
    this.setLabUpdateProgressStr((80 + tempProgress * 20).toFixed(2) + "%");
    this.setUpdateProgressBarProgress(Number(((80 + tempProgress * 20) / 100).toFixed(2)));
    this.setLabUpdateContentTipsStr("Downloading files");
  },
  setZipFileLoadComplete: function setZipFileLoadComplete(notify) {
    if (!notify) {
      return;
    }
    ;
    var baseBundle = notify.subpackgeName;
    if (!this.baseBundlesUpdateCompleteArr.includes(baseBundle)) {
      this.baseBundlesUpdateCompleteArr.push(baseBundle);
    }
    ;
    if (this.baseBundlesUpdateCompleteArr.length == this.baseBundlesNeedUpdateArr.length) {
      var endTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_WITH_LOADED_END, endTime - this.loadBundlesStartTime);
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_END, endTime - this.updateStartTime);
      this.unscheduleAllCallbacks();
      this.setLabUpdateProgressStr("100%");
      this.setUpdateProgressBarProgress(1);
      this.scheduleOnce(function () {
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var storagePath1 = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
        Array.prototype.unshift.apply(searchPaths, [storagePath1]);
        searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);
        GlobalCfg.G_COMPONENTS.Audio.stopAll();
        cc.game.restart();
      }, 1);
    }
    ;
  },
  editBoxCallback: function editBoxCallback(editBox) {
    var editBoxName = editBox.node.name;
    if (editBoxName === "editBox_account") {
      this.node_lab_accountTips.active = false;
    } else if (editBoxName === "editBox_password") {
      this.node_lab_passwordTips.active = false;
    } else if (editBoxName === "editBox_confirm") {
      this.node_lab_confirmTips.active = false;
    }
    ;
  },
  clickCallBack: function clickCallBack(btn) {
    var btnName = btn.node.name;
    // if (btnName == "btn_accountDelete") {
    //     GlobalCfg.G_COMPONENTS.Audio.playButton();
    //     this.editBox_account.string = "";
    //     this.node_lab_accountTips.active = false;
    //     this.sendVerifyCodeReqAcount = 0;
    //     this.btn_reqVerify.interactable = true;
    //     this.btn_reqVerify.enableAutoGrayEffect = false;
    //     clearInterval(this.verifyTimer);
    //     this.verifyTimer = null;
    //     this.lab_otpTips.string = 'OTP';
    //     this.showCommonLoginView();
    // }
    // else if (btnName == "btn_passwordDelete") {
    //     GlobalCfg.G_COMPONENTS.Audio.playButton();
    //     this.editBox_password.string = "";
    //     this.node_lab_passwordTips.active = false;
    // }
    if (btnName == "btn_accountLogin") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.dealAccountLoginEvent();
    } else if (btnName == "btn_register") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.dealRegisterEvent();
    }
    // else if (btnName == "btn_quickLogin") {
    //     GlobalCfg.G_COMPONENTS.Audio.playButton();
    //     this.dealQuickLoginEvent();
    // }
    // else if (btnName === "btn_facebookLogin") {
    //     GlobalCfg.G_COMPONENTS.Audio.playButton();
    //     CommonFun.getInstance().showProgress();
    //     this.dealFacebookLoginEvent();
    // }
    // else if (btnName === "btn_reqVerify") {
    //     GlobalCfg.G_COMPONENTS.Audio.playButton();
    //     let accountOrPhoneStr = this.editBox_account.string;
    //     if (accountOrPhoneStr.length == 0) {
    //         this.node_lab_accountTips.active = true;
    //         return;
    //     };
    //     if (!this.isPhoneAvailable('91' + accountOrPhoneStr)) {
    //         this.node_lab_accountTips.active = true;
    //         return;
    //     };
    //     CommonFun.getInstance().showProgress("Sending SMS request ...");
    //     this.dealReqVerifyEvent(accountOrPhoneStr);
    // }
    else if (btnName === "btn_guestLogin") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showProgress();
      this.dealGuestLoginEvent();
    } else if (btnName === "btn_wenZi") {
      this.dealBtnWenZiEvent();
    } else if (btnName === "btn_test1") {
      this.testIndexNum++;
      if (this.testIndexNum > 2) {
        var packageChannel = cc.sys.localStorage.getItem("PackageChannel");
        if (packageChannel && packageChannel.indexOf("_") != -1) {
          var packageChannelArr = packageChannel.split("_");
          var server = packageChannelArr[0];
          if (server == "0") {
            //只有测试服才能打开测试按钮
            this.testButtonIsActive = true;
            this.editBox_invited_test.node.active = true;
            this.editBox_chanel_test.node.active = true;
          }
        }
      }
    } else if (btnName === "btn_testLogin") {
      var _packageChannel = cc.sys.localStorage.getItem("PackageChannel");
      if (_packageChannel && _packageChannel.indexOf("_") != -1) {
        var _packageChannelArr = _packageChannel.split("_");
        var _server = _packageChannelArr[0];
        if (_server == "0") {
          //只有测试服才能打开测试按钮
          if (this.editBox_account.string == "") {
            return;
          }
          GlobalCfg.G_COMPONENTS.Audio.playButton();
          CommonFun.getInstance().showProgress();
          this.dealTestLoginEvent();
        }
      }
    }
  },
  toggleLanguageCallback: function toggleLanguageCallback(toggle) {
    var toggleName = toggle.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var languageType = I18NLanguagesEnum.English;
    switch (toggleName) {
      case "toggle_English":
        languageType = I18NLanguagesEnum.English;
        break;
      case "toggle_Hindi":
        languageType = I18NLanguagesEnum.Hindi;
        break;
      case "toggle_Urdu":
        languageType = I18NLanguagesEnum.Urdu;
        break;
      case "toggle_Bengali":
        languageType = I18NLanguagesEnum.Bengali;
        break;
      default:
        languageType = I18NLanguagesEnum.English;
        break;
    }
    ;
    I18NUtil.getInstance().setLanguageType(languageType);
  },
  dealBtnWenZiEvent: function dealBtnWenZiEvent() {
    if (!cc.sys.isNative) {
      return;
    }
    ;
    this.btnWenZiClickTimes += 1;
    if (this.btnWenZiClickTimes >= 3) {
      this.btnWenZiClickTimes = 0;
      var loggerStatus = LoggerUtil.getInstance().getLoggerStatus();
      console.log("caojun  LoggerUtil Status Set as " + !loggerStatus);
      LoggerUtil.getInstance().setLoggerStatus(!loggerStatus);
      cc.sys.localStorage.setItem("LOGGERUTIL_STATUS", loggerStatus ? 0 : 1);
    }
    ;
  },
  dealReqVerifyEvent: function dealReqVerifyEvent(accountOrPhoneStr) {
    var _this = this;
    if (this.sendVerifyCodeReqAcount == 3) {
      this.sendVerifyCodeReqAcount = 0;
      // this.btn_reqVerify.interactable = true;
      // this.btn_reqVerify.enableAutoGrayEffect = false;
      // clearInterval(this.verifyTimer);
      // this.verifyTimer = null;
      // this.lab_otpTips.string = 'OTP';
      CommonFun.getInstance().showTips("Server SMS interface exception");
      return;
    }
    ;
    this.sendVerifyCodeReqAcount += 1;
    if (this.sendVerifyCodeReqAcount == 1) {
      // this.btn_reqVerify.interactable = false;
      // this.btn_reqVerify.enableAutoGrayEffect = true;
      // if (this.verifyTimer) {
      //     clearInterval(this.verifyTimer);
      //     this.verifyTimer = null;
      // };
      // let waitTime = 180;
      // this.lab_otpTips.string = `${waitTime}S`;
      // this.verifyTimer = setInterval(() => {
      //     waitTime -= 1;
      //     if (waitTime == 0) {
      //         if (this && this.verifyTimer) {
      //             clearInterval(this.verifyTimer);
      //             this.verifyTimer = null;
      //         };
      //         // if (this && this.btn_reqVerify) {
      //         //     this.btn_reqVerify.interactable = true;
      //         //     this.btn_reqVerify.enableAutoGrayEffect = false;
      //         // }
      //         if (this && this.lab_otpTips) {
      //             this.lab_otpTips.string = 'OTP';
      //         }
      //         return;
      //     }
      //     if (this && this.lab_otpTips) {
      //         this.lab_otpTips.string = `${waitTime}S`;
      //     }
      // }, 1000);
    }
    ;
    var packageChannel = cc.sys.localStorage.getItem("PackageChannel");
    var channel = 0;
    if (packageChannel && packageChannel.indexOf("_") != -1) {
      var packageChannelArr = packageChannel.split("_");
      channel = packageChannelArr[1];
    }
    var device = CommonFun.getInstance().getDeviceId();
    var reqVerifyCodeParamObj = {
      phone: "",
      device: device,
      channel: channel
    };
    reqVerifyCodeParamObj.phone = '91' + accountOrPhoneStr;
    var url = GlobalCfg.HTTP_USER_LOGIN + "/v1/sendverificationcode";
    CommonFun.getInstance().httpPost(url, reqVerifyCodeParamObj, function (msg) {
      CommonFun.getInstance().hidProgress();
      if (msg.result != 0) {
        CommonFun.getInstance().showTips(msg.msg);
      }
      ;
    }, function () {
      _this.dealReqVerifyEvent(accountOrPhoneStr);
    });
  },
  dealRegisterEvent: function dealRegisterEvent() {
    var _this2 = this;
    if (this.node_editBox_confirm.active == false) {
      this.node_editBox_confirm.active = true;
      this.node_lab_accountTips.active = false;
      this.node_lab_passwordTips.active = false;
      this.node_lab_confirmTips.active = false;
      this.editBox_account.string = "";
      this.editBox_password.string = "";
      this.editBox_confirm.string = "";
      return;
    }
    var accountStr = this.editBox_account.string;
    if (accountStr.length < 6) {
      this.node_lab_accountTips.active = true;
      this.node_lab_accountTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
      return;
    }
    ;
    var passwordStr = this.editBox_password.string;
    if (passwordStr.length < 6) {
      this.node_lab_passwordTips.active = true;
      this.node_lab_passwordTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
      return;
    }
    ;
    var confirmStr = this.editBox_confirm.string;
    if (confirmStr.length < 6) {
      this.node_lab_confirmTips.active = true;
      this.node_lab_confirmTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
      return;
    }
    ;
    if (passwordStr != confirmStr) {
      this.node_lab_confirmTips.active = true;
      this.node_lab_confirmTips.getComponent(cc.Label).string = "The two passwords are inconsistent";
      return;
    }
    CommonFun.getInstance().showProgress();
    var obj = {
      loginType: "ACCOUNT",
      account: accountStr,
      password: passwordStr,
      isRegister: true
    };
    var promise = SceneManager.getInstance().reqTokenInfo(obj);
    promise.then(function () {
      CommonFun.getInstance().showProgress();
      var obj = {
        loginType: "ACCOUNT",
        account: accountStr,
        password: passwordStr,
        isRegister: false
      };
      var promise = SceneManager.getInstance().reqTokenInfo(obj);
      promise.then(function () {
        return SceneManager.getInstance().reqBearerToken();
      }).then(function () {
        return SceneManager.getInstance().reqUserDataInfo();
      }).then(function () {
        CommonFun.getInstance().showProgress();
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
      })["catch"](function (error) {
        LoggerUtil.getInstance().log(error);
      });
    })["catch"](function (error) {
      LoggerUtil.getInstance().log(error);
      _this2.editBox_account.string = "";
      _this2.editBox_password.string = "";
      _this2.editBox_confirm.string = "";
    });
  },
  dealAccountLoginEvent: function dealAccountLoginEvent() {
    if (this.node_editBox_confirm.active == true) {
      this.node_editBox_confirm.active = false;
      this.editBox_password.string = "";
      this.editBox_confirm.string = "";
      this.node_lab_accountTips.active = false;
      this.node_lab_passwordTips.active = false;
      this.node_lab_confirmTips.active = false;
      return;
    }
    var accountOrPhoneStr = this.editBox_account.string;
    if (accountOrPhoneStr.length < 6) {
      this.node_lab_accountTips.active = true;
      this.node_lab_accountTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
      return;
    }
    ;
    var passwordOrVerCodeStr = this.editBox_password.string;
    if (passwordOrVerCodeStr.length < 6) {
      this.node_lab_passwordTips.active = true;
      this.node_lab_passwordTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
      return;
    }
    ;

    // if (this.isCustomAccount(accountOrPhoneStr)) {
    CommonFun.getInstance().showProgress();
    var obj = {
      loginType: "ACCOUNT",
      account: accountOrPhoneStr,
      password: passwordOrVerCodeStr,
      isRegister: false
    };
    var promise = SceneManager.getInstance().reqTokenInfo(obj);
    promise.then(function () {
      return SceneManager.getInstance().reqBearerToken();
    }).then(function () {
      return SceneManager.getInstance().reqUserDataInfo();
    }).then(function () {
      CommonFun.getInstance().showProgress();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
    })["catch"](function (error) {
      LoggerUtil.getInstance().log(error);
    });
    // }
    // else if (this.isPhoneAvailable('91' + accountOrPhoneStr)) {
    //     CommonFun.getInstance().showProgress();
    //     let obj = {
    //         loginType: "PHONE",
    //         phone: '91' + accountOrPhoneStr,
    //         code: passwordOrVerCodeStr,
    //         token: "",
    //     };
    //     let promise = SceneManager.getInstance().reqTokenInfo(obj);
    //     promise.then(() => {
    //         return SceneManager.getInstance().reqBearerToken();
    //     }).then(() => {
    //         return SceneManager.getInstance().reqUserDataInfo();
    //     }).then(() => {
    //         CommonFun.getInstance().showProgress();
    //         SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
    //     }).catch(error => {

    //         LoggerUtil.getInstance().log(error);
    //     });
    // }
    // else {
    //     this.node_lab_accountTips.active = true;
    // };
  },

  dealQuickLoginEvent: function dealQuickLoginEvent() {
    var _this3 = this;
    GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
    var accountOrPhoneStr = this.editBox_account.string;
    if (accountOrPhoneStr.length == 0) {
      this.node_lab_accountTips.active = true;
      return;
    }
    ;
    if (this.isPhoneAvailable('91' + accountOrPhoneStr)) {
      CommonFun.getInstance().showProgress();
      var phoneToken = cc.sys.localStorage.getItem("phone_token");
      var obj = {
        loginType: "PHONE",
        phone: '91' + accountOrPhoneStr,
        code: "",
        token: phoneToken
      };
      var promise = SceneManager.getInstance().reqTokenInfo(obj);
      promise.then(function () {
        return SceneManager.getInstance().reqBearerToken();
      }).then(function () {
        return SceneManager.getInstance().reqUserDataInfo();
      }).then(function () {
        CommonFun.getInstance().showProgress();
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
      })["catch"](function (error) {
        _this3.showCommonLoginView();
        LoggerUtil.getInstance().log(error);
      });
    } else {
      this.node_lab_accountTips.active = true;
    }
    ;
  },
  dealFacebookLoginEvent: function dealFacebookLoginEvent() {
    GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
    WXManager.login();
  },
  dealTestLoginEvent: function dealTestLoginEvent() {
    var obj = {
      loginType: "USERID",
      userid: this.editBox_account.string
    };
    GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
    var promise = SceneManager.getInstance().reqTokenInfo(obj);
    promise.then(function () {
      return SceneManager.getInstance().reqBearerToken();
    }).then(function () {
      return SceneManager.getInstance().reqUserDataInfo();
    }).then(function () {
      CommonFun.getInstance().showProgress();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
    })["catch"](function (error) {
      LoggerUtil.getInstance().log(error);
    });
  },
  dealGuestLoginEvent: function dealGuestLoginEvent() {
    if (this.testButtonIsActive) {
      GlobalCfg.OPENINSTALL_INVITE_CODE = this.editBox_invited_test.string;
      GlobalCfg.CHANNEL_INFO = this.editBox_chanel_test.string;
      console.log("dealGuestLoginEvent: ", "xiaowei");
    }
    GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
    var obj = {
      loginType: "GUEST"
    };
    var promise = SceneManager.getInstance().reqTokenInfo(obj);
    promise.then(function () {
      console.log("caojun dealGuestLoginEvent 1");
      return SceneManager.getInstance().reqBearerToken();
    }).then(function () {
      console.log("caojun dealGuestLoginEvent 2");
      return SceneManager.getInstance().reqUserDataInfo();
    }).then(function () {
      console.log("caojun dealGuestLoginEvent 3");
      CommonFun.getInstance().showProgress();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
    })["catch"](function (error) {
      LoggerUtil.getInstance().log(error);
    });
  },
  isPhoneAvailable: function isPhoneAvailable(phone) {
    var myreg = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/;
    return myreg.test(phone);
  },
  isCustomAccount: function isCustomAccount(account) {
    var str = account.substring(0, 5);
    if (str == "00000") {
      return true;
    }
    ;
    return false;
  },
  onRegisterSuccess: function onRegisterSuccess() {
    CommonFun.getInstance().showTips("Register Success");
    CommonFun.getInstance().hidProgress();
    this.node_editBox_confirm.active = false;
    this.editBox_password.string = "";
    this.editBox_confirm.string = "";
  },
  start: function start() {
    if (GlobalCfg.SERVERRELOAD == true) {
      CommonFun.getInstance().loadBundle('ResourcesBundle', function (bundle) {
        window.ResourcesBundle = bundle;
        CommonFun.getInstance().showMsgBox(GlobalCfg.SERVERRELOAD_Descr, "YES", function () {
          cc.game.end();
        }, false);
      }, function (err) {
        LoggerUtil.getInstance().error("\u52A0\u8F7DResourcesBundle-Bundle\u5F02\u5E38: " + JSON.stringify(err));
        cc.game.end();
      });
      return;
    }
    ;
    if (cc.sys.isNative) {
      this.updateStartTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_START);
      this.runUpdateProcess();
    } else if (GlobalCfg.isH5) {
      // H5 环境
      this.preloadMainH5();
      // //预加载软键盘
      // let kb = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SOFTKEYBORAD);
      // kb.then((prefab) => {
      //     let node = cc.instantiate(prefab);
      //     CommonFun.getInstance().addToPointParent(node, GlobalCfg.PREFAB_PARENT.SOFTKEYBORAD);
      //     kb.active = false;
      // });
    } else {
      this.changeSceneToLobby();
    }
  },
  onDestroy: function onDestroy() {
    this.downloaderArr = null;
    // clearInterval(this.verifyTimer);
    // this.verifyTimer = null;
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
  },
  runUpdateProcess: function runUpdateProcess() {
    this.node_loginLayer.active = false;
    this.progressBar.node.active = true;
    this.lab_updatePoint.node.active = true;
    this.lab_updateProgress.node.active = true;
    this.lab_updateContentTips.node.active = true;
    this.setLabUpdatePointAnim(true);
    this.setLabUpdateProgressStr("0%");
    this.setUpdateProgressBarProgress(0);
    this.setLabUpdateContentTipsStr("Getting Version Information");
    this.comparisonVersionInfo();
  },
  comparisonVersionInfo: function comparisonVersionInfo() {
    var localVersion = Number(cc.sys.localStorage.getItem("localVersion"));
    console.log("caojun Remote resource file version\uFF1A" + GlobalCfg.ASSETS_VERSION + ", Local resource file version\uFF1A" + localVersion);
    if (localVersion != GlobalCfg.ASSETS_VERSION && GlobalCfg.is_need_update) {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_RESOURCES_UPDATE);
      console.log("caojun The remote version that needs to be updated is\uFF1A" + GlobalCfg.ASSETS_VERSION);
      this.reqMainManifestInfo();
    } else {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
      console.log("caojun Remote versions that are consistent and do not require updates at this time!");
      this.baseBundlesHotUpdate();
    }
    ;
  },
  reqMainManifestInfo: function reqMainManifestInfo() {
    var _this4 = this;
    if (this.reqComparisonMainMD5InfoAcount == 5) {
      console.log("Exception in requesting manifest file under remote resource file assets!");
      this.setLabUpdateContentTipsStr("Getting Assets Manifest File Error");
      return;
    }
    ;
    var startTime = cc.sys.now();
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_START);
    this.reqComparisonMainMD5InfoAcount += 1;
    var mainMD5Url = GlobalCfg.ASSETS_UPDATE_URL + "/assets/project.manifest?version=" + GlobalCfg.ASSETS_VERSION;
    CommonFun.getInstance().httpGet(mainMD5Url, function (json) {
      var endTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_SUCCESS, endTime - startTime);
      LoggerUtil.getInstance().log("httpGet has requested data from manifest!");
      _this4.comparisonFilesByMainManifestInfo(json);
    }, function () {
      var endTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_FAIL, endTime - startTime);
      _this4.reqMainManifestInfo();
    });
  },
  comparisonFilesByMainManifestInfo: function comparisonFilesByMainManifestInfo(json) {
    var startTime = cc.sys.now();
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_COMPARE_FILES_START);
    this.setLabUpdateProgressStr("0%");
    this.setUpdateProgressBarProgress(0);
    this.setLabUpdateContentTipsStr("Compare Version Files");
    this.needUpdateFileArr = [];
    this.simulationCheckFileAcount = 0;
    this.totalNumberOfRemoteMainFiles = json.length;
    this.storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
    for (var i = 1; i <= this.totalNumberOfRemoteMainFiles; i++) {
      var item = json[i + ""];
      if (!item) {
        continue;
      }
      ;
      var itemArr = item.filename.split("/");
      var serverMd5 = item.md5;
      var fileDir = "";
      for (var k = 0, itemArrLen = itemArr.length; k < itemArrLen - 1; k++) {
        fileDir = fileDir + itemArr[k] + "/";
      }
      ;
      var sourceName = jsb.fileUtils.fullPathForFilename(item.filename);
      var localMd5 = jsb.extensFunction.getMd5File(sourceName);
      if (localMd5 !== serverMd5) {
        LoggerUtil.getInstance().log("The file that need to be updated is\uFF1A" + item.filename);
        var isExist = jsb.fileUtils.isDirectoryExist(this.storagePath + fileDir);
        if (!isExist) {
          jsb.fileUtils.createDirectory(this.storagePath + fileDir);
        }
        ;
        this.needUpdateFileArr.push(item);
      }
      ;
      this.simulationCheckFileAcount += 1;

      // 模拟校验文件数据的进度过程
      if (this.simulationCheckFileAcount >= this.totalNumberOfRemoteMainFiles) {
        var endTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_COMPARE_FILES_END, endTime - startTime);
        this.setLabUpdateProgressStr("100%");
        this.setUpdateProgressBarProgress(1);
        this.prepareDownDifferenceFiles();
      }
      ;
    }
    ;
  },
  setUpdateProgressBarProgress: function setUpdateProgressBarProgress(progress) {
    if (progress === void 0) {
      progress = 0;
    }
    this.progressBar.progress = progress;
  },
  setLabUpdateContentTipsStr: function setLabUpdateContentTipsStr(str) {
    if (str === void 0) {
      str = "";
    }
    this.lab_updateContentTips.string = str;
  },
  setLabUpdateProgressStr: function setLabUpdateProgressStr(str) {
    this.lab_updateProgress.string = str;
  },
  setLabUpdatePointAnim: function setLabUpdatePointAnim(isAct) {
    if (isAct === void 0) {
      isAct = false;
    }
    if (isAct == false) {
      this.unschedule(this.setDianTipsAnima);
      this.updateStatusPoints = 0;
      this.lab_updatePoint.string = "";
    } else {
      this.updateStatusPoints = 0;
      this.schedule(this.setDianTipsAnima, 0.5);
    }
    ;
  },
  setDianTipsAnima: function setDianTipsAnima() {
    if (this.updateStatusPoints == 5) {
      this.updateStatusPoints = 0;
    }
    ;
    var updateStatusPoints = ["", ".", "..", "...", "...."][this.updateStatusPoints];
    this.lab_updatePoint.string = updateStatusPoints;
    this.updateStatusPoints += 1;
  },
  prepareDownDifferenceFiles: function prepareDownDifferenceFiles() {
    this.loadDiffFilesStartTime = cc.sys.now();
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_START);
    var needUpdateFileArrLen = this.needUpdateFileArr.length;
    console.log("caojun Starting to download differentiated files, the number of files that need to be downloaded is " + needUpdateFileArrLen);
    if (needUpdateFileArrLen == 0) {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_WITH_NO_LOADED_END);
      this.setLabUpdatePointAnim(false);
      this.setLabUpdateProgressStr("80%");
      this.setUpdateProgressBarProgress(0.8);
      cc.sys.localStorage.setItem("localVersion", GlobalCfg.ASSETS_VERSION);
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
      this.baseBundlesHotUpdate();
    } else {
      this.setLabUpdateProgressStr("0%");
      this.setUpdateProgressBarProgress(0);
      this.setLabUpdateContentTipsStr("Update Version Files");
      for (var i = 0; i < 30; i++) {
        var downloader = new jsb.Downloader();
        downloader.storagePath = '';
        downloader.setOnFileTaskSuccess(this.setOnFileTaskSuccess.bind(this));
        downloader.setOnTaskError(this.setOnTaskError.bind(this));
        this.downloaderArr.push(downloader);
      }
      ;
      this.downDifferenceFiles();
    }
    ;
  },
  downDifferenceFiles: function downDifferenceFiles() {
    for (var i = 0, len = this.downloaderArr.length; i < len; i++) {
      var downloader = this.downloaderArr[i];
      if (downloader.storagePath.length == 0) {
        var fileInfo = this.needUpdateFileArr[this.curNumberOfJoinedDownloader];
        if (fileInfo) {
          console.log("caojun The file being updated is " + fileInfo.filename);
          var md5 = fileInfo.md5;
          var url = GlobalCfg.ASSETS_UPDATE_URL + "/" + fileInfo.filename + "?md5=" + md5;
          downloader.storagePath = this.storagePath + fileInfo.filename;
          downloader.createDownloadFileTask(url, this.storagePath + fileInfo.filename);
          this.curNumberOfJoinedDownloader += 1;
        }
        ;
      }
      ;
    }
    ;
  },
  getDownLoaderByStoragePath: function getDownLoaderByStoragePath(storagePath) {
    for (var i = 0, len = this.downloaderArr.length; i < len; i++) {
      var downloader = this.downloaderArr[i];
      if (downloader.storagePath == storagePath) {
        return downloader;
      }
      ;
    }
    ;
  },
  setOnFileTaskSuccess: function setOnFileTaskSuccess(task) {
    this.totalNumberOfFilesDownloaded += 1;
    var needUpdateFileArrLen = this.needUpdateFileArr.length;
    console.log("caojun The number of successful file updates is: " + this.totalNumberOfFilesDownloaded + ", The total number of updates needed is: " + needUpdateFileArrLen);
    var downloader = this.getDownLoaderByStoragePath(task.storagePath);
    if (downloader) {
      downloader.storagePath = '';
    }
    ;
    if (this.totalNumberOfFilesDownloaded >= needUpdateFileArrLen) {
      var endTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_WITH_LOADED_END, endTime - this.loadDiffFilesStartTime);
      this.setLabUpdatePointAnim(false);
      this.setLabUpdateProgressStr("80%");
      this.setUpdateProgressBarProgress(0.8);
      cc.sys.localStorage.setItem("localVersion", GlobalCfg.ASSETS_VERSION);
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
      this.isHaveUpdateForResources = true;
      this.baseBundlesHotUpdate();
    } else {
      var percent = this.totalNumberOfFilesDownloaded / needUpdateFileArrLen;
      this.setLabUpdateProgressStr((Math.floor(percent * 100) * 0.8).toFixed(2) + "%");
      this.setUpdateProgressBarProgress(Number((percent * 0.8).toFixed(2)));
      this.downDifferenceFiles();
    }
    ;
  },
  setOnTaskError: function setOnTaskError(task, errorCode, errorCodeInternal, errorStr) {
    LoggerUtil.getInstance().log("An error occurred while updating the file, and the error code is " + errorCode + ", The reason for the error is " + errorStr);
    var downloader = this.getDownLoaderByStoragePath(task.storagePath);
    if (downloader) {
      downloader.createDownloadFileTask(task.requestURL, task.storagePath);
    }
    ;
  },
  preloadMainH5: function preloadMainH5() {
    var _this5 = this;
    this.node_loginLayer.active = false;
    this.progressBar.node.active = true;
    this.lab_updatePoint.node.active = true;
    this.lab_updateProgress.node.active = true;
    this.lab_updateContentTips.node.active = true;
    this.setLabUpdatePointAnim(true);
    this.setLabUpdateProgressStr("0%");
    this.setUpdateProgressBarProgress(0);
    this.setLabUpdateContentTipsStr("Getting Version Information");
    var packgeName = "MustBundle";
    this.checkDownloadH5Main(function () {
      _this5.startRealPreload(packgeName); // 开始预加载必要资源
    });
  },

  // ====== 真正的预加载逻辑（80% → 100%） ======
  startRealPreload: function startRealPreload(packgeName) {
    var _this6 = this;
    cc.assetManager.loadBundle(packgeName, function (_, bundle) {
      bundle.preloadDir("/", function (completedCount, totalCount) {
        var rawProgress = completedCount / totalCount;
        _this6.setLabUpdateProgressStr((rawProgress * 100).toFixed(2) + "%");
        _this6.setUpdateProgressBarProgress(rawProgress);
        _this6.setLabUpdateContentTipsStr("Downloading files");
      }, function (err) {
        if (err) {
          console.error(packgeName + " 资源加载失败:", err);
        } else {
          _this6.setLabUpdateProgressStr("100%");
          _this6.setUpdateProgressBarProgress(1);
          _this6.setLabUpdateContentTipsStr("Please Enjoy The Game");
          _this6.scheduleOnce(function () {
            _this6.changeSceneToLobby();
          }, 1);
        }
      });
    });
  },
  checkDownloadH5Main: function checkDownloadH5Main(callback) {
    if (callback === void 0) {
      callback = null;
    }
    cc.assetManager.loadBundle('LanguageEnglish', function (err, bundle) {
      if (err) {
        console.error("加载 LanguageEnglish 失败:", err);
        return;
      }
      callback && callback();
    });
  },
  changeSceneToLobby: function changeSceneToLobby() {
    LoggerUtil.getInstance().log("Update completed, now enter Login-view");
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_LOGIN_VIEW);
    this.node_lab_accountTips.active = false;
    this.node_lab_passwordTips.active = false;
    this.progressBar.node.active = false;
    GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
    this.loadBundleAndRunScene();
  },
  loadBundleAndRunScene: function loadBundleAndRunScene() {
    var _this7 = this;
    var downAfter = function downAfter() {
      GlobalCfg.USER_DATAS.token = cc.sys.localStorage.getItem("login_token");
      GlobalCfg.USER_DATAS.userId = cc.sys.localStorage.getItem("login_userid");
      if (!GlobalCfg.USER_DATAS.token) {
        _this7.node_loginLayer.active = true;
        // let phoneToken = cc.sys.localStorage.getItem("phone_token");
        // if (phoneToken) {
        //     this.showMemoryPhoneView();
        // }
        // else {
        _this7.showCommonLoginView();
        // };
      } else {
        CommonFun.getInstance().showProgress('Memory login ...');
        _this7.node_loginLayer.active = false;
        var promise = SceneManager.getInstance().reqBearerToken();
        promise.then(function () {
          return SceneManager.getInstance().reqUserDataInfo();
        }).then(function () {
          CommonFun.getInstance().showProgress();
          SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
        })["catch"](function (error) {
          LoggerUtil.getInstance().log(error);
          _this7.node_loginLayer.active = true;
          _this7.showCommonLoginView();
        });
      }
    };
    if (GlobalCfg.isH5) {
      Promise.all([ProtobufManager.proloadProtoFiles(this.protoFiles), CommonFun.getInstance().proloadProgress()]).then(function (arr) {
        var packgeName = "Activity";
        cc.assetManager.loadBundle('ResourcesBundle', function (_, bundle) {
          window.ResourcesBundle = bundle;
          bundle.preloadDir(packgeName, null, function (err) {
            downAfter();
          });
        });
      })["catch"](function (err) {
        LoggerUtil.getInstance().error(err);
      });
    } else {
      Promise.all([ProtobufManager.proloadProtoFiles(this.protoFiles), CommonFun.getInstance().proloadProgress()]).then(function (arr) {
        cc.assetManager.loadBundle('ResourcesBundle', function (_, bundle) {
          window.ResourcesBundle = bundle;
          downAfter();
        });
      })["catch"](function (err) {
        LoggerUtil.getInstance().error(err);
      });
    }
  },
  showMemoryPhoneView: function showMemoryPhoneView() {
    this.editBox_password.node.active = false;
    this.node_btn_reqVerify.active = false;
    this.node_btn_accountLogin.active = false;
    this.node_btn_quickLogin.active = true;
    this.editBox_account.string = cc.sys.localStorage.getItem("login_phone").slice(2);
    this.node_btn_facebookLogin.setPosition(this.btn_facebookLogin_pos1);
    this.node_btn_guestLogin.setPosition(this.btn_guestLogin_pos1);
    if (GlobalCfg.CHANNEL_INFO == "2023" || GlobalCfg.UNUSE_FACEBOOK > 0) {
      this.node_btn_facebookLogin.active = false;
      this.node_btn_guestLogin.setPosition(326, this.btn_guestLogin_pos1.y);
      this.node_btn_guestLogin.setContentSize(512, 79);
    }
    ;
  },
  showCommonLoginView: function showCommonLoginView() {
    this.editBox_password.node.active = true;
    this.node_btn_accountLogin.active = true;
    this.editBox_account.string = "";
  },
  baseBundlesHotUpdate: function baseBundlesHotUpdate() {
    var _this8 = this;
    this.loadBundlesStartTime = cc.sys.now();
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_START);
    console.log("caojun Start downloading baseBundles zip files!");
    if (GlobalCfg.is_need_update) {
      this.baseBundlesCheckUpdateArr.forEach(function (baseBundle) {
        if (CommonFun.getInstance().isNeedUpdata(baseBundle)) {
          var tempObj = {
            baseBundle: baseBundle,
            progress: 0
          };
          _this8.baseBundlesNeedUpdateArr.push(tempObj);
        }
        ;
      });
    }
    console.log("caojun baseBundlesHotUpdate this.baseBundlesNeedUpdateArr.length :" + this.baseBundlesNeedUpdateArr.length);
    console.log("caojun baseBundlesHotUpdate this.isHaveUpdateForResources :" + this.isHaveUpdateForResources);
    if (this.baseBundlesNeedUpdateArr.length == 0) {
      var endTime = cc.sys.now();
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_WITH_NO_LOADED_END);
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_END, endTime - this.updateStartTime);
      this.setLabUpdateProgressStr("100%");
      this.setUpdateProgressBarProgress(1);
      this.setLabUpdateContentTipsStr("Please Enjoy The Game");
      this.scheduleOnce(function () {
        if (_this8.isHaveUpdateForResources) {
          GlobalCfg.G_COMPONENTS.Audio.stopAll();
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var storagePath1 = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/';
          Array.prototype.unshift.apply(searchPaths, [storagePath1]);
          searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
          cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          cc.game.restart();
        } else {
          _this8.changeSceneToLobby();
        }
        ;
      }, 1);
    } else {
      this.baseBundlesNeedUpdateArr.forEach(function (tempObj) {
        GameDownloader.getInstance().priorLoadGame(tempObj.baseBundle);
      });
    }
    ;
  }
});

cc._RF.pop();