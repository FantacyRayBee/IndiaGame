"use strict";
cc._RF.push(module, '9cec7MCIzpP86Ac00ttYE3y', 'PersonalCtrl');
// ResourcesBundle/NewPlan/Personal/PersonalCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_blind: cc.Label,

    /**
     * VIP等级图标
     */
    sprite_vipLevelIcon: cc.Sprite,

    /**
     * VIP等级图标图集
     */
    atlas_levelIcon: cc.SpriteAtlas
  },
  getNode: function getNode() {
    var _this = this;

    var mask = this.node.getChildByName("mask");
    var node = this.node.getChildByName("node");
    node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
    var node_user = node.getChildByName("bg").getChildByName("node_user");
    this.lab_deposited = node_user.getChildByName("lab_deposited").getComponent(cc.Label);
    this.lab_winnings = node_user.getChildByName("lab_winnings").getComponent(cc.Label);
    this.lab_totalCash = node_user.getChildByName("lab_totalCash").getComponent(cc.Label);
    this.lab_bonus = node_user.getChildByName("lab_bonus").getComponent(cc.Label);
    this.node_totalCash = node_user.getChildByName("node_totalCash").getComponent(cc.Label);
    this.lab_bnode_bonusonus = node_user.getChildByName("node_bonus").getComponent(cc.Label);
    this.lab_mobile = node_user.getChildByName("lab_Mobile").getComponent(cc.Label);
    this.lab_name = node_user.getChildByName("lab_name").getComponent(cc.Label);
    this.lab_email = node_user.getChildByName("lab_email").getComponent(cc.Label);
    this.lab_user_name = node_user.getChildByName("lab_user_name").getComponent(cc.Label);
    this.lab_ID = node_user.getChildByName("lab_ID").getComponent(cc.Label);
    this.headSp = node_user.getChildByName("node_txt").getChildByName("tx").getComponent(cc.Sprite);
    this.bg = node.getChildByName("bg");
    this.node_user = node.getChildByName("bg").getChildByName("node_user");
    this.spr_bg01 = node_user.getChildByName("spr_bg01").getComponent(cc.Sprite);
    this.spr_bg02 = node_user.getChildByName("spr_bg02").getComponent(cc.Sprite);
    this.spr_bg03 = node_user.getChildByName("spr_bg03").getComponent(cc.Sprite);
    this.spr_bg04 = node_user.getChildByName("spr_bg04").getComponent(cc.Sprite);
    this.tx_k01 = node_user.getChildByName("tx_k01").getComponent(cc.Sprite);
    this.tx_k02 = node_user.getChildByName("tx_k02").getComponent(cc.Sprite);
    this.tx_k03 = node_user.getChildByName("tx_k03").getComponent(cc.Sprite);
    this.bg_name01 = node_user.getChildByName("bg_name01").getComponent(cc.Sprite);
    this.bg_name02 = node_user.getChildByName("bg_name02").getComponent(cc.Sprite);
    this.Background01 = node_user.getChildByName("btn_change").getChildByName("Background01").getComponent(cc.Sprite);
    this.Background02 = node_user.getChildByName("btn_change").getChildByName("Background01").getComponent(cc.Sprite);
    this.Background03 = node_user.getChildByName("btn_change").getChildByName("Background03").getComponent(cc.Sprite);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 110, this.headSp);
    this.lab_ID.string = cc.js.formatStr("ID:  %s", GlobalCfg.USER_DATAS.userId);
    this.lab_user_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 12);
    this.initVipCard(Number(GlobalCfg.USER_DATAS.voucherCard));
    mask.on(cc.Node.EventType.TOUCH_START, function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();

      _this.outAct(function () {
        _this.node.destroy();
      });
    }, this);
  },
  onLoad: function onLoad() {
    this.statiAct();
    this.getNode();
    this.initDataLobby();
    this.showPlayerInFo();
    this.showVipLevelIcon();
    var btnArr = this.node.getComponentsInChildren(cc.Button);

    for (var i = 0; i < btnArr.length; i++) {
      btnArr[i].node.on("click", this.btnClick, this);
    }

    ;
    this.sprite_vipLevelIcon.node.on("click", this.btnClick, this); // 奖券兑换活动

    var NodebtnToBonus = cc.find('node/bg/node_user/btnToBonus', this.node);

    if (GlobalCfg.USER_DATAS.openModules.includes(12)) {
      NodebtnToBonus.active = true;
    } else {
      NodebtnToBonus.active = false;
    } // 充值


    var NodebtnToShop = cc.find('node/bg/node_user/btnToShop', this.node);

    if (GlobalCfg.USER_DATAS.openModules.includes(4)) {
      NodebtnToShop.active = true;
    } else {
      NodebtnToShop.active = false;
    } // 提现


    var NodebtnToWithdraw = cc.find('node/bg/node_user/btnToWithdraw', this.node);

    if (GlobalCfg.USER_DATAS.openModules.includes(4)) {
      NodebtnToWithdraw.active = true;
    } else {
      NodebtnToWithdraw.active = false;
    }

    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  initDataLobby: function initDataLobby() {
    if (!cc.isValid(this.node)) {
      return;
    }

    this.lab_deposited.string = GlobalCfg.USER_DATAS.deposit ? "₹" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100)) : "₹" + 0;

    if (GlobalCfg.USER_DATAS.recharged > 0) {
      this.lab_winnings.string = GlobalCfg.USER_DATAS.winnings ? "₹" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.winnings, 100)) : "₹0";
    } else {
      this.lab_winnings.string = GlobalCfg.USER_DATAS.deposit ? "₹" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100)) : "₹0";
    }

    ;
    this.lab_totalCash.string = GlobalCfg.USER_DATAS.userDiamond ? "₹" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100)) : "₹0";
    this.lab_bonus.string = GlobalCfg.USER_DATAS.bonus ? "₹" + GlobalCfg.USER_DATAS.bonus / 100 : "₹" + 0;

    if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.USER_DATAS.isNotCharge) {
      this.lab_bnode_bonusonus.string = language == 1 ? "Chips" : "बोनास";
      this.node_totalCash.string = language == 1 ? "Total Chips" : "कुल नकद";
    } else {
      this.lab_bnode_bonusonus.string = playerCenterLanguage.node_bonus[language];
      this.node_totalCash.string = playerCenterLanguage.node_totalCash[language];
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO) {
      self.lab_user_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 12);
      self.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 110, self.headSp);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.BINDPHONE_SUCCESS) {
      var data = notify.data;
      self.lab_name.string = CommonFun.getInstance().getStrByLength(data.realname, 10);
      self.lab_mobile.string = data.phone.slice(2, data.phone.length);
      self.lab_email.string = CommonFun.getInstance().getStrByLength(data.mail, 15);
      self.lab_bonus.string = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.bonus, 100);
    } else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
      self.showVipLevelIcon();
    }

    ;
  },
  btnClick: function btnClick(button) {
    var _this2 = this;

    var btnName = button.node.name;

    if (btnName === "btn_exit") {
      GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LOGIN);
      return;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName === "btn_change") {
      CommonFun.getInstance().showChangeName();
    } else if (btnName === "btn_bind") {
      CommonFun.getInstance().showBindPhone('Personal');
    } else if (btnName == "node_txt") {
      CommonFun.getInstance().showChangeHead();
    } else if (btnName == "btn_add") {
      this.node_checkClick.active = true;
    } else if (btnName == "btn_photograph") {
      APPManager.SelectImg(JSON.stringify({
        needClip: true,
        size: 120.0,
        imageType: 'PAI_ZHAO'
      }));
      this.node.destroy();
    } else if (btnName == "btn_photo") {
      APPManager.SelectImg(JSON.stringify({
        needClip: true,
        size: 120.0,
        imageType: 'ZHAO_PIAN'
      }));
      this.node.destroy();
    } else if (btnName == "btn_cancel") {
      this.node_checkClick.active = false;
    } else if (btnName == "btnToShop") {
      this.outAct(function () {
        CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.PersonalToShop);

        _this2.node.destroy();
      });
    } else if (btnName == "btnToWithdraw") {
      this.outAct(function () {
        _this2.showWithDraw();

        _this2.node.destroy();
      });
    } else if (btnName == "btnToBonus") {
      this.outAct(function () {
        CommonFun.getInstance().showBonusTransfer();

        _this2.node.destroy();
      });
    } else if (btnName == "vipLevelIcon") {
      if (CommonFun.getInstance().isOpenVipModule()) {
        this.outAct(function () {
          CommonFun.getInstance().showMyVip();

          _this2.node.destroy();
        });
      }
    }
  },
  // 显示玩家名字 邮箱 root
  showPlayerInFo: function showPlayerInFo() {
    var name = GlobalCfg.USER_DATAS.realname ? GlobalCfg.USER_DATAS.realname : "null";
    var mobile = GlobalCfg.USER_DATAS.phone ? GlobalCfg.USER_DATAS.phone : "null";
    var email = GlobalCfg.USER_DATAS.mail ? GlobalCfg.USER_DATAS.mail : "null";
    this.lab_mobile.string = mobile == "null" ? mobile : mobile.slice(2, mobile.length);
    this.lab_name.string = CommonFun.getInstance().getStrByLength(name, 10);
    this.lab_email.string = CommonFun.getInstance().getStrByLength(email, 15);
  },
  // 出场动画
  statiAct: function statiAct() {
    var _this3 = this;

    var node = this.node.getChildByName('node');
    cc.tween(node).to(0.3, {
      position: cc.v2(0, 0)
    }, {
      easing: 'smooth'
    }).call(function () {
      if (_this3.lab_mobile.string == "null" && _this3.lab_name.string == "null" && _this3.lab_email.string == "null") {// this.lab_blind.string = teenPattiLanguage.lobby[2][language];
      } else {// this.lab_blind.string = otherLanguage.modify[language];
      }

      ;
    }).start();
  },
  // 退出动画  只有玩家换图像的界面不存在时，才能退出整个界面
  outAct: function outAct(callback) {
    var w = cc.view.getVisibleSize().width;
    var node = this.node.getChildByName('node');
    cc.tween(node).to(0.3, {
      position: cc.v2(-w, 0)
    }, {
      easing: 'smooth'
    }).call(function () {
      callback();
    }).start();
  },
  initVipCard: function initVipCard(vipType) {
    this.spr_bg01.node.active = false;
    this.spr_bg02.node.active = false;
    this.spr_bg03.node.active = false;
    this.spr_bg04.node.active = false;
    this.tx_k01.node.active = false;
    this.tx_k02.node.active = false;
    this.tx_k03.node.active = false;
    this.bg_name01.node.active = false;
    this.bg_name02.node.active = false;
    this.Background01.node.active = false;
    this.Background02.node.active = false;
    this.Background03.node.active = false;

    if (vipType == 101) {
      this.spr_bg02.node.active = true;
      this.tx_k02.node.active = true;
      this.bg_name02.node.active = true;
      this.Background02.node.active = true; // this.lab_ID.node.color = new cc.color(255,255,255,255)

      this.lab_user_name.node.color = new cc.color(255, 255, 255, 255);
    } else if (vipType == 102) {
      this.spr_bg03.node.active = true;
      this.tx_k03.node.active = true;
      this.bg_name02.node.active = true;
      this.Background03.node.active = true; // this.lab_ID.node.color = new cc.color(255,255,255,255)

      this.lab_user_name.node.color = new cc.color(255, 255, 255, 255);
    } else if (vipType == 103) {
      this.spr_bg04.node.active = true;
      this.tx_k03.node.active = true;
      this.bg_name02.node.active = true;
      this.Background03.node.active = true; // this.lab_ID.node.color = new cc.color(255,255,255,255)

      this.lab_user_name.node.color = new cc.color(255, 255, 255, 255);
    } else {
      this.spr_bg01.node.active = true;
      this.tx_k01.node.active = true;
      this.bg_name01.node.active = true;
      this.Background01.node.active = true; // this.lab_ID.node.color = new cc.color(153,94,39,255)
    }
  },
  showWithDraw: function showWithDraw() {
    CommonFun.getInstance().showWithDrawPreData();
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CHANGEHEAD);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CHANGEHEADITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PERSONAL);
  },
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this4 = this;

    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this4) && cc.isValid(heaSprite)) {
          heaSprite.spriteFrame = new cc.SpriteFrame(texture);
          heaSprite.node.setScale(realWidth / heaSprite.node.width);
        }
      });
    }
  },
  showVipLevelIcon: function showVipLevelIcon() {
    if (CommonFun.getInstance().isOpenVipModule() && GlobalCfg.USER_DATAS.userVip.level > 0 && GlobalCfg.USER_DATAS.userVip.level <= 10) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_levelIcon.getSpriteFrame(GlobalCfg.USER_DATAS.userVip.level);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }

    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);

    if (isCanShowVIPFont) {
      this.lab_name.node.color = new cc.Color(250, 225, 76);
    } else {
      this.lab_name.node.color = new cc.Color(255, 255, 255);
    }

    ;
  }
});

cc._RF.pop();