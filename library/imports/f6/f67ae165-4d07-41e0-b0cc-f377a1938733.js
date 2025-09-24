"use strict";
cc._RF.push(module, 'f67aeFlTQdB4LDM83ehk4cz', '7upUserInfoCtrl');
// 7up7downGame/7upScript/7upUserInfoCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas
  },
  ctor: function ctor() {
    this.playerid = 0;
    this.downSiteState = true;
  },
  onLoad: function onLoad() {
    this.posX = this.node.x;
    this.posY = this.node.y;
    this.nodeTx = this.node.getChildByName("node_tx");
    this.nodeTxmask = this.nodeTx.getChildByName("node_txmask");
    this.userTx = this.nodeTxmask.getChildByName("user_tx").getComponent(cc.Sprite); //用户的头像

    this.img_dx = this.nodeTx.getChildByName("img_dx").getComponent(cc.Sprite); //断线中的图标

    this.img_dx.activr = false;
    this.nodeuserInfo = this.node.getChildByName("user_name_input");
    this.userName = this.nodeuserInfo.getChildByName("lab_userName").getComponent(cc.Label); //用户名

    this.labGold = this.nodeuserInfo.getChildByName("lab_gold").getComponent(cc.Label); //金币数量

    this.textBg = this.node.getChildByName("bg");
    this.lab_num = this.node.getChildByName("bg").getChildByName("lab_num").getComponent(cc.Label); //赢得的数目

    this.textBg.active = false;
    this.lab_num.node.active = false;
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.nodePos = this.node.getPosition();
    this.btn_gift = this.node.getChildByName("btn_gift").getComponent(cc.Button);
    this.btn_gift.node.on("click", this.btnClick, this);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    LoggerUtil.getInstance().log("发送自定义消息！！！！");

    if (btnName == "btn_gift") {
      if (this.checkSelfIsVip() == true) {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: "btn_gift",
          msgData: {
            SiteId: 0
          }
        });
      } else {
        CommonFun.getInstance().showMsgBox("VIP players can use this function", "YES", function () {}, false);
      }
    }
  },
  checkSelfIsVip: function checkSelfIsVip() {
    var playerid = this.playerid;

    for (var i = 0, len = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr.length; i < len; i++) {
      var vipPlayerScript = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr[i];

      if (playerid == vipPlayerScript.getPlayerID()) {
        return true;
      }
    }

    return false;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == "gameservice.currencycovert") {
      self.setDiamond(notify.srcCurrency.Remain);
      self.setCoin(notify.dstCurrency.Remain);
      GlobalCfg.USER_DATAS.userCoin = notify.dstCurrency.Remain;
      GlobalCfg.USER_DATAS.userDiamond = notify.srcCurrency.Remain;
    } // else if (msgId == "lobbyservice.updatesafe") {
    //     self.setCoin(notify.coin);
    //     GlobalCfg.USER_DATAS.userCoin = notify.coin;
    // } 
    else if (msgId == "gameservice.updatebalance" || msgId == "lobbyservice.updatebalance") {
      self.setCoin(notify.balance);
      GlobalCfg.USER_DATAS.userCoin = notify.balance;
    }
  },
  start: function start() {},
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  },
  setPlayerInfo: function setPlayerInfo(userinfo) {
    this.setName(GlobalCfg.USER_DATAS.userName);

    if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
      this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 90, this.userTx);
    } else {
      LoggerUtil.getInstance().log("收到的头像URL为空！");
    }

    this.setCoin(userinfo.Diamond);
    this.setPlayerid(userinfo.PlayerId);

    if (userinfo.vipLevel >= 1 && userinfo.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + userinfo.vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }

    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(userinfo.vipLevel);

    if (isCanShowVIPFont) {
      this.userName.node.color = new cc.Color(250, 225, 76);
    } else {
      this.userName.node.color = new cc.Color(255, 255, 255);
    }

    ;
  },
  setWinNum: function setWinNum(num) {
    var _this = this;

    if (num <= 0) {
      return;
    }

    ;
    var number = FloatCalculation.accDiv(num, 100);
    this.lab_num.string = "+" + number;
    this.textBg.active = true;
    this.lab_num.node.active = true;
    cc.tween(this.textBg).to(1, {
      position: cc.v2(0, 60)
    }).delay(0.5).call(function () {
      _this.textBg.position = cc.v2(0, 30);
      _this.textBg.active = false;
      _this.lab_num.node.active = false;
    }).start();
  },
  setName: function setName(name) {
    this.name = name;

    if (this.userName) {
      this.userName.string = CommonFun.getInstance().getStrByLength(name, 9);
      ;
    }
  },
  setCoin: function setCoin(coin) {
    this.coin = coin / 100;

    if (this.labGold && coin != null) {
      this.labGold.string = CommonFun.getInstance().numberToShow(this.coin); // this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);

      GlobalCfg.USER_DATAS.userDiamond = coin;
    }
  },
  betAction: function betAction() {
    var posY = this.posY;
    var posX = this.posX;
    cc.tween(this.node).to(0.1, {
      position: cc.v2(posX, posY + 15)
    }).to(0.1, {
      position: cc.v2(posX, posY)
    }).start();
  },
  setPlayerid: function setPlayerid(playerid) {
    if (!playerid) {
      LoggerUtil.getInstance().error("playerID为空");
      return;
    }

    this.playerid = playerid;
  },
  getPlayerid: function getPlayerid() {
    return this.playerid;
  },
  //设置该座位能否入座
  setVipSiteState: function setVipSiteState(state) {
    this.vipSiteState = state; // this.nodeTxmask.getComponent(cc.Button).interactable = state;       //true时可用，false不可用
  },
  getVipSiteState: function getVipSiteState() {
    return this.vipSiteState;
  },
  winGoldMoveAnim: function winGoldMoveAnim(count, winGoldArr) {
    var _this2 = this;

    var pos = this.getVipPlayerPos();

    var _loop = function _loop(i) {
      cc.tween(winGoldArr[i]).to(0.15, {
        scale: 1,
        position: pos
      }).call(function () {
        _this2.removeJbNode(winGoldArr[i]);
      }).start();
    };

    for (var i = 0; i < count; i++) {
      _loop(i);
    }
  }
});

cc._RF.pop();