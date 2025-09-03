"use strict";
cc._RF.push(module, '81a86DcQEtFrJMWiQhC75U4', 'SettingCtrl');
// ResourcesBundle/NewPlan/Setting/SettingCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    BtnYY: {
      "default": null,
      type: cc.Button
    },
    BtnYX: {
      "default": null,
      type: cc.Button
    },
    BtnTuiChu: {
      "default": null,
      type: cc.Button
    },
    BtnGuiZe: {
      "default": null,
      type: cc.Button
    },
    BtnWaFa: {
      "default": null,
      type: cc.Button
    },
    TogTab: [],
    BtnClose: {
      "default": null,
      type: cc.Button
    },
    BtnClearCache: cc.Button,
    BtnYS: cc.Button,
    BtnZC: cc.Button,
    toggle_English: cc.Toggle,
    toggle_Hindi: cc.Toggle,
    toggle_Urdu: cc.Toggle,
    toggle_Bengali: cc.Toggle,
    lab_appV: cc.Label
  },
  ctor: function ctor() {},
  onLoad: function onLoad() {
    var _this = this;
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.underLayout = this.node.getChildByName("underLayout");
    var width = cc.view.getVisibleSize().width;
    this.underLayout.setPosition((573 + width) / 2, 0);
    this.BtnGuiZe.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnGuiZe.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnTuiChu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnYY.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.BtnYX.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.BtnZC.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnYS.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnWaFa.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.BtnClearCache.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    var mask = this.node.getChildByName("mask");
    mask.on("click", function () {
      _this.outAct();
    }, this);
    var languagesType = I18NUtil.getInstance().getLanguageType();
    this.setLabelsByLanguageType(languagesType);
    this.setToggleLanguage(languagesType);
    this.toggle_English.node.on('click', this.toggleClick, this);
    this.toggle_Hindi.node.on('click', this.toggleClick, this);
    this.toggle_Urdu.node.on('click', this.toggleClick, this);
    this.toggle_Bengali.node.on('click', this.toggleClick, this);
    this.TogTab[1] = this.BtnYX;
    this.TogTab[2] = this.BtnYY;
    this.InitToggle("toggle_yinxiao", 1);
    this.InitToggle("toggle_yinyun", 2);
    this.statiAct();
  },
  setToggleLanguage: function setToggleLanguage(languagesType) {
    this.toggle_English.isChecked = languagesType == I18NLanguagesEnum.English;
    this.toggle_Hindi.isChecked = languagesType == I18NLanguagesEnum.Hindi;
    this.toggle_Urdu.isChecked = languagesType == I18NLanguagesEnum.Urdu;
    this.toggle_Bengali.isChecked = languagesType == I18NLanguagesEnum.Bengali;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
      self.dealChangeLanguageEvent(notify);
    }
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SETTING);
  },
  btnClick: function btnClick(sender) {
    var senderName = sender.node.name;
    if (senderName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.outAct();
      return;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (senderName === "btn_tuichu") {
      this.node.destroy();
      GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
      GlobalCfg.IS_FROM_LOBBY_TO_LOGIN = true;
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.EXIT_GAME,
        msgData: {}
      });
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_LOGOUT_BUTTON);
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.UPDATE);
      GlobalCfg.BANKRUPT_CD = 0;
    } else if (senderName == "btn_confacf") {
      CommonFun.getInstance().showContactUs();
    } else if (senderName == "btn_rateUs") {
      CommonFun.getInstance().showRateUs();
    } else if (senderName == "btn_yy") {
      this.SetToggle("toggle_yinyun", 2);
    } else if (senderName == "btn_yx") {
      this.SetToggle("toggle_yinxiao", 1);
    } else if (senderName == "btn_ys") {
      CommonFun.getInstance().addVerticalAcc();
      CommonFun.getInstance().showPrivacyPolicy(2);
    } else if (senderName == "btn_zc") {
      CommonFun.getInstance().addVerticalAcc();
      CommonFun.getInstance().showPrivacyPolicy(1);
    } else if (senderName == "btn_wanFa") {
      CommonFun.getInstance().showRule("allGame");
    }
    ;
  },
  SetToggle: function SetToggle(senderName, index) {
    if (false === GlobalCfg.G_COMPONENTS.Audio.checkState(senderName)) {
      if (index == 1) {
        GlobalCfg.G_COMPONENTS.Audio.openSound();
      } else if (index == 2) {
        GlobalCfg.G_COMPONENTS.Audio.openMusic();
      }
    } else {
      if (index == 1) {
        GlobalCfg.G_COMPONENTS.Audio.closeSound();
      } else if (index == 2) {
        GlobalCfg.G_COMPONENTS.Audio.closeMusic();
      }
    }
    this.InitToggle(senderName, index);
  },
  InitToggle: function InitToggle(senderName, index) {
    if (true === GlobalCfg.G_COMPONENTS.Audio.checkState(senderName)) {
      this.TogTab[index].node.getChildByName("Background").getChildByName("btn_guan").active = false;
      this.TogTab[index].node.getChildByName("Background").getChildByName("btn_kai").active = true;
    } else {
      this.TogTab[index].node.getChildByName("Background").getChildByName("btn_guan").active = true;
      this.TogTab[index].node.getChildByName("Background").getChildByName("btn_kai").active = false;
    }
  },
  setBtnTuiChui: function setBtnTuiChui() {
    this.BtnTuiChu.node.active = false;
  },
  setLobbyBgType: function setLobbyBgType(type) {
    ClientNotify.send("ChangLobbyBg", {
      msgCode: "ChangLobbyBg",
      msgData: {
        type: type
      }
    });
  },
  toggleClick: function toggleClick(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var name = toggle.node.name;
    var languageType = I18NLanguagesEnum.English;
    switch (name) {
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
  // 出场动画
  statiAct: function statiAct() {
    var width = cc.view.getVisibleSize().width;
    var underLayout = this.node.getChildByName('underLayout');
    cc.tween(underLayout).to(0.3, {
      position: cc.v2((width - 573) / 2, 0)
    }, {
      easing: 'smooth'
    }).start();
  },
  // 退出动画
  outAct: function outAct() {
    var _this2 = this;
    var width = cc.view.getVisibleSize().width;
    var underLayout = this.node.getChildByName('underLayout');
    cc.tween(underLayout).to(0.3, {
      position: cc.v2((width + 600) / 2, 0)
    }, {
      easing: 'smooth'
    }).call(function () {
      _this2.node.destroy();
    }).start();
  },
  dealChangeLanguageEvent: function dealChangeLanguageEvent(notify) {
    var languagesType = notify.languagesType;
    this.setLabelsByLanguageType(languagesType);
  },
  setLabelsByLanguageType: function setLabelsByLanguageType(languagesType) {
    var versionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Lobby_Version']);
    this.lab_appV.string = versionStr + ": " + GlobalCfg.APP_VERSION;
  }
});

cc._RF.pop();