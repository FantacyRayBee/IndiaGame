"use strict";
cc._RF.push(module, 'f56ba4pvbZGC7XXKiXH/yPf', 'SmallAddExperienceCtrl');
// notBundle/SmallAddExperience/SmallAddExperienceCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btns: [cc.Button],
    lab_wz: cc.Label
  },
  onLoad: function onLoad() {
    for (var i = 0; i < this.btns.length; i++) {
      var btn = this.btns[i];
      btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    }
    var width = cc.winSize.width;
    if (width > 1335) {
      this.node.scale = 1.3;
    } else {
      this.node.scale = 1;
    }
    this.lab_wz.string = otherLanguage.dailyBonusTisp[language];
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var scene = cc.director.getScene();
    if (btnName == "btn_get") {
      if (scene.name == "rummy") {
        GameServerManager.send("gameservice.receivefreetrial", "ReceiveFreeTrialReq", {
          times: 1
        });
      } else if (scene.name == "TpGame") {
        GameServerManager.send("gameservice.receivefreetrial", "ReceiveFreeTrialReq", {
          userid: GlobalCfg.USER_DATAS.userId,
          times: 1
        });
      } else if (scene.name == "Andeer") {
        GameServerManager.send("gameservice.asktrial", "AskTrialReq", {
          times: 1
        });
      } else {
        GameServerManager.send("gameservice.getchips", "FreeChipsReq", {
          userid: GlobalCfg.USER_DATAS.userId,
          times: 1
        });
      }
    } else if (btnName == "btn_get_X2") {
      if (GlobalCfg.USER_DATAS.phone.length == 0) {
        CommonFun.getInstance().showTips("Need to fill in vour mobile number");
        return;
      }
      ;
      if (scene.name == "rummy") {
        GameServerManager.send("gameservice.receivefreetrial", "ReceiveFreeTrialReq", {
          times: 2
        });
      } else if (scene.name == "TpGame") {
        GameServerManager.send("gameservice.receivefreetrial", "ReceiveFreeTrialReq", {
          userid: GlobalCfg.USER_DATAS.userId,
          times: 2
        });
      } else if (scene.name == "Andeer") {
        GameServerManager.send("gameservice.asktrial", "AskTrialReq", {
          times: 2
        });
      } else {
        GameServerManager.send("gameservice.getchips", "FreeChipsReq", {
          userid: GlobalCfg.USER_DATAS.userId,
          times: 2
        });
      }
    }
    ;
    this.node.destroy();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SMALLADDEXPERIENCE);
  }
});

cc._RF.pop();