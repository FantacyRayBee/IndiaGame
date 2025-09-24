"use strict";
cc._RF.push(module, '4ccc6ZJmsJNfoNkKsNaHWu6', 'WXManager');
// Main/SDK/WXManager.js

"use strict";

var WXManager = {}; //WXLOGIN; XLLOGIN

WXManager.login = function () {
  if (cc.sys.os == cc.sys.OS_ANDROID) {
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL, GlobalCfg.NATIVE_CALL_NAME_OBJ.login, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL1, GlobalCfg.NATIVE_CALL_NAME_OBJ1.login, "()V");
    jsb.reflection.callStaticMethod(GlobalCfg.NATIVE_CALL_URL2, GlobalCfg.NATIVE_CALL_NAME_OBJ2.login, "()V");
  }
};

WXManager.wxCallBack = function (wxKey, wxState, wxValue) {
  if (!wxValue || wxValue == "") {
    CommonFun.getInstance().showTips("获取第三方应用授权登录失败，请重新登录");
    return;
  }

  ;

  if (wxState == "0" && wxKey == "FB") {
    //第三方平台FB登录成功回调
    LoggerUtil.getInstance().log("WXManager.wxCallBack  FB---->", wxValue);
    var data = {
      loginType: "FACEBOOK",
      code: JSON.parse(wxValue)
    };
    var promise = SceneManager.getInstance().reqTokenInfo(data);
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
  }

  ;
}; // Firebase Token 返回


WXManager.firebaseTokenCallBack = function (token) {
  LoggerUtil.getInstance().log("Firebase", token);

  if (token) {
    GlobalCfg.FIREBASE_TOKEN = token;
  }
};

window.WXManager = WXManager;

cc._RF.pop();