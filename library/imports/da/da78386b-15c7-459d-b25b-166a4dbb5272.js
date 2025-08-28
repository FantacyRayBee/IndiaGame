"use strict";
cc._RF.push(module, 'da783hrFcdFnbJbFmpNu1Jy', 'APPManager');
// Main/SDK/APPManager.js

"use strict";

var APPManager = {};
APPManager.faceBookLogEvent = function (json) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.faceBookLogEvent, "(Ljava/lang/String;)V", json);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.faceBookLogEvent, "(Ljava/lang/String;)V", json);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.faceBookLogEvent, "(Ljava/lang/String;)V", json);
  }
};

//WhatsApp 客服
APPManager.chatInWhatsApp = function (str) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.chatInWhatsApp, "(Ljava/lang/String;)V", str);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.chatInWhatsApp, "(Ljava/lang/String;)V", str);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.chatInWhatsApp, "(Ljava/lang/String;)V", str);
  }
};

/**
 * 跳转到其他APP
 * @param {String} packageName 应用包名 com.whatsapp  org.telegram.messenger   com.twitter.android
 * @param {String} url 
 */
APPManager.skipToOtherApp = function (packageName, url) {
  LoggerUtil.getInstance().log("Skip To APP", packageName, url);
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.skipToOtherApp, "(Ljava/lang/String;Ljava/lang/String;)V", packageName, url);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.skipToOtherApp, "(Ljava/lang/String;Ljava/lang/String;)V", packageName, url);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.skipToOtherApp, "(Ljava/lang/String;Ljava/lang/String;)V", packageName, url);
  }
};
APPManager.setFaceBookID = function (fbid) {
  if (GlobalCfg.UNUSE_FACEBOOK == 1) {
    return;
  }
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    LoggerUtil.getInstance().log("\u8BBE\u7F6E\u7684Facebook\u7684ID\u662F: " + fbid);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.setFaceBookID, "(Ljava/lang/String;)V", fbid);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.setFaceBookID, "(Ljava/lang/String;)V", fbid);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.setFaceBookID, "(Ljava/lang/String;)V", fbid);
  }
};
APPManager.copyToPasteBoard = function (str) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.copyToPasteBoard, "(Ljava/lang/String;)V", str);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.copyToPasteBoard, "(Ljava/lang/String;)V", str);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.copyToPasteBoard, "(Ljava/lang/String;)V", str);
  }
};

//银联商务支付
APPManager.YLPay = function (orderJson) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.YLPay, "(Ljava/lang/String;)V", orderJson);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.YLPay, "(Ljava/lang/String;)V", orderJson);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.YLPay, "(Ljava/lang/String;)V", orderJson);
  }
};

//获取手机中的图片
APPManager.SelectImg = function (strObjec) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.SelectImg, "(Ljava/lang/String;)V", strObjec);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.SelectImg, "(Ljava/lang/String;)V", strObjec);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.SelectImg, "(Ljava/lang/String;)V", strObjec);
  }
};

//异步回调监听
APPManager.appCallBack = function (dataType, data1, data2, data3) {
  if (dataType == "UNZIP") {
    LoggerUtil.getInstance().log("UNZIP>>>>>>>>>>>>>>>>>>>", data1, window.GameDownloader.getInstance());
    window.GameDownloader.getInstance().loadGameCompleteByZip(data1);
  } else if (dataType == "IOSPAYERR") {
    CommonFun.getInstance().showMsgBox(data1, "YES", function () {}, false);
  } else if (dataType == 'IOSPAYSUS') {
    var jsonStr = JSON.parse(data1);
    if (jsonStr.result !== 1000) {
      CommonFun.getInstance().showMsgBox(jsonStr.msg, "YES", function () {}, false);
    }
  } else if (dataType == "SELECTIMG") {
    GlobalCfg.USER_DATAS.userHeadimgurl = data1;
    CommonFun.getInstance().showTips("Avatar modified successfully");
    var byteData = jsb.fileUtils.getDataFromFile(data1);
    var imgBase64Data = CommonFun.getInstance().arrayBufferToBase64(byteData);
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/uploadicon";
    var httpParam = {
      "icon": imgBase64Data
    };
    clearTimeout(this.changeTime);
    this.changeTime = null;
    this.changeTime = setTimeout(function () {
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
        if (msg.result == 0) {
          GlobalCfg.USER_DATAS.userHeadimgurl = msg.data.url;
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_HEADIMG,
            msgData: {}
          });
        } else {
          CommonFun.getInstance().showMsgBox(msg.msg);
        }
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    }, 500);
  }
};

//安卓原生分享
APPManager.Share = function (Url) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.Share, "(Ljava/lang/String;)V", Url);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.Share, "(Ljava/lang/String;)V", Url);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.Share, "(Ljava/lang/String;)V", Url);
  }
};

//安卓内嵌网页调起
APPManager.showWebView = function (Url, isPortrait) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.closeMusic(); //关闭背景音乐
    var data = {
      url: Url,
      isPortrait: isPortrait
    };
    jsb.reflection.callStaticMethod("com/gugu/bloomthreerummy/JSCallJavaByBloom3Rummy", "showWebViewByBloom3Rummy", "(Ljava/lang/String;)V", JSON.stringify(data));
  }
};

//横竖屏切换
APPManager.setOrientation = function (dir) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.setOrientation, '(Ljava/lang/String;)V', dir);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.setOrientation, '(Ljava/lang/String;)V', dir);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.setOrientation, '(Ljava/lang/String;)V', dir);
  }
  var frameSize = cc.view.getFrameSize();
  if (dir == 'V') {
    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    if (frameSize.width > frameSize.height) {
      cc.view.setFrameSize(frameSize.height, frameSize.width);
      cc.Canvas.instance.designResolution = cc.size(750, 1625);
    }
    GlobalCfg.CURSCENE_DIRECTION = "vertical";
  } else {
    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    if (frameSize.height > frameSize.width) {
      cc.view.setFrameSize(frameSize.height, frameSize.width);
      cc.Canvas.instance.designResolution = cc.size(1625, 750);
    }
    GlobalCfg.CURSCENE_DIRECTION = "horizontal";
  }
  if (CC_JSB) {
    window.dispatchEvent(new cc.Event.EventCustom('resize', true));
  }
};
APPManager.getConcactsArrStr = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getConcactsArrStr, '()V');
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getConcactsArrStr, '()V');
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getConcactsArrStr, '()V');
  }
};
APPManager.getConcactsArrStrCallback = function (concactsArrStr) {
  if (concactsArrStr) {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: "ConcactsArrStr",
      msgData: {
        concacts: concactsArrStr
      }
    });
  }
};
APPManager.closeWebViewCallBack = function () {
  // APPManager.setOrientation("H");
  GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.openMusic();
  SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.WEBVIEW, SceneManager.getInstance().sceneType.LOBBY);
};
APPManager.checkSendSmsPermission = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = 0;
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.checkSendSmsPermission, "()I");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.checkSendSmsPermission, "()I");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.checkSendSmsPermission, "()I");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  }
};
APPManager.sendSmsMessage = function (message) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.sendSmsMessage, '(Ljava/lang/String;)V', message);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.sendSmsMessage, '(Ljava/lang/String;)V', message);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.sendSmsMessage, '(Ljava/lang/String;)V', message);
  }
};
APPManager.getNetWorkType = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = 0;
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getNetWorkType, "()I");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getNetWorkType, "()I");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getNetWorkType, "()I");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  }
};
APPManager.getUUID = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getUUID, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getUUID, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getUUID, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  }
};
APPManager.getGAID = function () {
  var result = "";
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getGAID, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getGAID, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getGAID, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
  }
  return result;
};
APPManager.getPackageName = function () {
  var result = "";
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    result = jsb.reflection.callStaticMethod("com/gugu/bloomthreerummy/JSCallJavaByBloom3Rummy", "getPackageName", "()Ljava/lang/String;");
  }
  return result;
};
APPManager.getAdjustID = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getAdjustId, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getAdjustId, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getAdjustId, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  } else {
    return "55555444445";
  }
  ;
};
APPManager.getAdjustAttribution = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getAdjustAttribution, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getAdjustAttribution, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getAdjustAttribution, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  } else {
    return JSON.stringify({
      "network": "OfflineDeve",
      "adid": "55555444445"
    });
  }
  ;
};
APPManager.selectPhoto = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.selectPhoto, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.selectPhoto, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.selectPhoto, "()V");
  }
};
APPManager.selectPhotoCallBack = function (photoPath) {
  console.log("caojun selectPhotoCallBack:", photoPath);
  APPManager.appCallBack("SELECTIMG", photoPath);
};
APPManager.getOpenInstallData = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getOpenInstallData, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getOpenInstallData, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getOpenInstallData, "()V");
    if (cc.sys.localStorage.getItem("launch") == "") {
      //每次只有首次安装会发送
      var device = CommonFun.getInstance().getDeviceId();
      var gaid = APPManager.getGAID();
      var googleId = APPManager.getPackageName();
      var channel = cc.sys.localStorage.getItem("AppChannel");
      var httpParam = {
        "device": device,
        "channel": channel,
        "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
        "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
        "gaid": gaid,
        "googleId": googleId
      };
      /**
       * APP启动事件上报
       */
      var httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/launch";
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
        if (msg) {
          cc.sys.localStorage.setItem("launch", "1");
          LoggerUtil.getInstance().log("launch=========>", JSON.stringify(msg));
        }
        ;
      });
    }
  }
};
APPManager.getOpenInstallDataCallBack = function (channelCode, bindData) {
  LoggerUtil.getInstance().log("getOpenInstallDataCallBack ===> channelCode: " + channelCode + ", bindData: " + bindData);
  try {
    bindData = JSON.parse(bindData);
    var inviteCode = bindData["inviteCode"];
    var inviteCodeArr = [];
    if (inviteCode && inviteCode.indexOf("_") != -1) {
      inviteCodeArr = inviteCode.split("_");
    }
    ;
    if (inviteCodeArr[0] && inviteCodeArr[0].length > 0) {
      GlobalCfg.CHANNEL_INFO = inviteCodeArr[0];
    }
    ;
    if (inviteCodeArr[1] && inviteCodeArr[1].length > 0) {
      GlobalCfg.OPENINSTALL_INVITE_CODE = inviteCodeArr[1];
    }
    ;

    /**
     * 处理广告链接的商户事件的相关信息
     */
    if (bindData["fbpixid"] && bindData["fbpixid"].length > 0) {
      GlobalCfg.OPENINSTALL_FB_CLID = bindData["fbpixid"];
    } else if (bindData["ggpixid"] && bindData["ggpixid"].length > 0) {
      GlobalCfg.OPENINSTALL_FB_CLID = bindData["ggpixid"];
    } else if (bindData["kwpixid"] && bindData["kwpixid"].length > 0) {
      GlobalCfg.OPENINSTALL_FB_CLID = bindData["kwpixid"];
    } else if (bindData["ttpixid"] && bindData["ttpixid"].length > 0) {
      GlobalCfg.OPENINSTALL_FB_CLID = bindData["ttpixid"];
    } else if (bindData["fbclid"] && bindData["fbclid"].length > 0) {
      GlobalCfg.OPENINSTALL_FB_CLID = bindData["fbclid"];
    }
    ;
    if (bindData["adsid"] && bindData["adsid"].length > 0) {
      GlobalCfg.OPENINSTALL_ADS_ID = bindData["adsid"];
    }
    ;
    var device = CommonFun.getInstance().getDeviceId();
    var gaid = APPManager.getGAID();
    var httpParam = {
      "device": device,
      "channel": GlobalCfg.CHANNEL_INFO,
      "fbclid": GlobalCfg.OPENINSTALL_FB_CLID,
      "adsid": GlobalCfg.OPENINSTALL_ADS_ID,
      "gaid": gaid,
      "googleId": GlobalCfg.GOOGLE_ID
    };
    /**
     * APP启动事件上报
     */
    var httpUrl = GlobalCfg.HTTP_USER_LOGIN + "/launch";
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
      if (msg) {
        LoggerUtil.getInstance().log("launch=========>", JSON.stringify(msg));
      }
      ;
    });
  } catch (error) {}
  ;
};

/**
 * 获取AppsFlyerId
 * @returns {string}
 */
APPManager.getAppsFlyerId = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getAppsFlyerId, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getAppsFlyerId, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getAppsFlyerId, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  }
};

/**
 * 获取AppsFlyerConversionListener
 * @returns {string}
 */
APPManager.getAppsFlyerConversionListener = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";

    // 定义一个辅助函数，用于安全调用 Java 方法
    var callJavaMethod = function callJavaMethod(className, methodName, methodSignature) {
      try {
        return jsb.reflection.callStaticMethod(className, methodName, methodSignature);
      } catch (error) {
        console.error("\u8C03\u7528 Java \u65B9\u6CD5\u5931\u8D25: " + className + "." + methodName, error);
        return null; // 返回 null 表示调用失败
      }
    };

    // 依次调用 Java 方法
    var result1 = callJavaMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getAppsFlyerConversionListener, "()Ljava/lang/String;");
    var result2 = callJavaMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getAppsFlyerConversionListener, "()Ljava/lang/String;");
    var result3 = callJavaMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getAppsFlyerConversionListener, "()Ljava/lang/String;");

    // 处理结果
    if (result1) {
      result = result1;
    } else if (result2) {
      result = result2;
    } else if (result3) {
      result = result3;
    }
    return result;
  }
};

/**
 * 获取AdvertisingId
 * @returns {string}
 */
APPManager.getAdvertisingId = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    var result = "";
    var result1 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getAdvertisingId, "()Ljava/lang/String;");
    var result2 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getAdvertisingId, "()Ljava/lang/String;");
    var result3 = jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getAdvertisingId, "()Ljava/lang/String;");
    if (result1) {
      result = result1;
    }
    ;
    if (result2) {
      result = result2;
    }
    ;
    if (result3) {
      result = result3;
    }
    ;
    return result;
  } else {
    return "32131293129831-23312461278";
  }
  ;
};
APPManager.getFirebaseToken = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.getFirebaseToken, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.getFirebaseToken, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.getFirebaseToken, "()V");
  }
};
APPManager.downloadApkByApkUrl = function (apkUrl) {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.downloadApkByApkUrl, "(Ljava/lang/String;)V", apkUrl);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.downloadApkByApkUrl, "(Ljava/lang/String;)V", apkUrl);
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.downloadApkByApkUrl, "(Ljava/lang/String;)V", apkUrl);
  }
};
APPManager.adjustGoogleIdCallBack = function (googleAdId) {
  // console.log("adjustGoogleIdCallBack:", googleAdId);

  cc.log("adjustGoogleIdCallBack:", googleAdId);
  if (googleAdId && googleAdId.length > 0) {
    GlobalCfg.ADVERTISING_ID = googleAdId;
    LoggerUtil.getInstance().log("googleAdId:", GlobalCfg.ADVERTISING_ID);
  }
  ;
};

// 打开相册
APPManager.openAlbum = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.openPhotoAlbum, "()V");
  }
};
window.APPManager = APPManager;

cc._RF.pop();