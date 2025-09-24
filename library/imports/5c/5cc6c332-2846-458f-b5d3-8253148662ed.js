"use strict";
cc._RF.push(module, '5cc6cMyKEZFj7XTglMUhmLt', 'popUpWithDrawCtrl');
// ResourcesBundle/NewPlan/PopUpWithDraw/popUpWithDrawCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnWithDraw: cc.Button,
    labNum: cc.Label,
    labNum2: cc.Label,
    btn_close: cc.Button
  },
  onLoad: function onLoad() {
    var _this = this;

    var defaultWithDrawNum = 100;
    var curDiamond = GlobalCfg.USER_DATAS.userDiamond;

    if (curDiamond > 10000) {
      defaultWithDrawNum = Math.floor(curDiamond / 10000) * 100;
    }

    ;
    this.setConfig(defaultWithDrawNum);
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(function () {
      _this.node.destroy();
    }, 1), this);
    this.btn_close.node.active = CommonFun.getInstance().isShowWithdrawToastCloseBtn();
  },
  start: function start() {
    var _this2 = this;

    this.btnWithDraw.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();

      _this2.showWithDraw();
    }, this);
  },
  setConfig: function setConfig(num) {
    this.labNum.string = "" + num;
    this.labNum2.string = "₹" + num;
  },
  showWithDraw: function showWithDraw() {
    if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.LOBBY) {
      CommonFun.getInstance().showWithDrawPreData();
    } else {
      window["isNeedShowWithDrawPreData"] = true;
      SceneManager.getInstance().changeScene(SceneManager.getInstance().curSceneType, SceneManager.getInstance().sceneType.LOBBY);
    }

    ;
    this.node.destroy();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.POPUPWITHDRAW);
  }
});

cc._RF.pop();