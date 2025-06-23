"use strict";
cc._RF.push(module, '64d7evSdr9PvJSu0ahxJIi3', 'zooPlayerCtrl');
// zooGame/Scripts/zooPlayerCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    labName: cc.Label,
    labCoin: cc.Label,
    tx: cc.Sprite,
    btnGift: cc.Button,
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas,
    winLabel: cc.Label
  },
  ctor: function ctor() {
    this.userId = null; // 用户id 
  },
  // onLoad () {},
  start: function start() {
    var _this = this;
    this.winLabel.node.active = false;
    this.btnGift.node.on('click', CommonFun.getInstance().debounce(function () {
      var seatId = _this.node.parent.getComponent('zooSeatCtrl').seatId;
      if (GlobalCfg.ACT_SCENE_CTRL.zooSeatManager.selfSeatId != -1) {
        CommonFun.getInstance().showGameGifInteraction(seatId);
      } else {
        CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
      }
      ;
    }, 1), this);
  },
  setPlayerInfo: function setPlayerInfo(UserInfo) {
    // LoggerUtil.getInstance().log("PlayerCtrl中设置用户信息", UserInfo);
    this.userId = UserInfo.uid;
    var userName = UserInfo.nickname;
    var diamond = UserInfo.diamond;
    var imgUrl = UserInfo.imgUrl;
    var vipLevel = UserInfo.vipLevel;
    var pos = UserInfo.pos;
    this.loadHeadSp(imgUrl, 95, this.tx);
    this.labName.string = CommonFun.getInstance().getStrByLength(userName, 8);
    this.labCoin.string = diamond / 100;
    var giftPos = this.btnGift.node.getPosition();
    var vipPos = this.sprite_vipLevelIcon.node.getPosition();
    if (pos >= 3) {
      this.sprite_vipLevelIcon.node.setPosition(giftPos.x, giftPos.y);
      this.btnGift.node.setPosition(vipPos.x, vipPos.y);
    }
    if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }
    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
    if (isCanShowVIPFont) {
      this.labName.node.color = new cc.Color(250, 225, 76);
    } else {
      this.labName.node.color = new cc.Color(255, 255, 255);
    }
    ;
  },
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this2 = this;
    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this2) && cc.isValid(heaSprite)) {
          heaSprite.spriteFrame = new cc.SpriteFrame(texture);
          heaSprite.node.setScale(realWidth / heaSprite.node.width);
        }
      });
    }
  },
  setUserCoinLabel: function setUserCoinLabel(diamond) {
    this.labCoin.string = diamond / 100;
    if (this.userId == GlobalCfg.USER_DATAS.userId) {
      // 玩家自己
      GlobalCfg.USER_DATAS.userDiamond = diamond;
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: "GAME_ZOO_GIFT_SEND_COIN_UPDATE",
        msgData: {}
      });
    }
  },
  /**
   * 展示胜利的奖励
   * @param {Number} win 
   */
  showWinLabel: function showWinLabel(win) {
    var _this3 = this;
    if (win > 0) {
      this.winLabel.node.setPosition(cc.v2(0, 0));
      this.winLabel.string = "+" + parseFloat((win / 100).toFixed(2));
      this.winLabel.node.active = true;
      cc.tween(this.winLabel.node).to(1, {
        position: cc.v2(0, 100)
      }).delay(0.5).call(function () {
        _this3.winLabel.node.active = false;
      }).start();
    }
  } // update (dt) {},
});

cc._RF.pop();