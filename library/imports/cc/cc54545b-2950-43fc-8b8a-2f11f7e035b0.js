"use strict";
cc._RF.push(module, 'cc545RbKVBD/IuKLxH34DWw', 'VIPCtrl');
// baccarat3PattiGame/src/VIPCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas
  },
  ctor: function ctor() {
    this.userSeatSort = [cc.v2(566, -184), cc.v2(566, -6), cc.v2(566, 171), cc.v2(-566, 171), cc.v2(-566, -6), cc.v2(-566, -184)];
  },
  onDestroy: function onDestroy() {
    if (GlobalCfg.ACT_SCENE_CTRL && this.vipPos == GlobalCfg.ACT_SCENE_CTRL.myVipPos) {
      GlobalCfg.ACT_SCENE_CTRL.myVipPos = -1;
    }
  },
  onLoad: function onLoad() {
    var _this = this;
    this.bg_js = cc.find('bg_js', this.node);
    this.btn_gift = cc.find('btn_gift', this.node).getComponent(cc.Button);
    this.headSp = cc.find('mask/wj_tx', this.node).getComponent(cc.Sprite);
    this.lab_VIPName = cc.find('lab_VIPName', this.node).getComponent(cc.Label);
    this.lab_VIPCoin = cc.find('lab_VIPCoin', this.node).getComponent(cc.Label);
    this.lab_score = cc.find('lab_score', this.bg_js).getComponent(cc.Label);
    this.VIPBGArr = [cc.find('Canvas/node_vip/btn_Vip_0'), cc.find('Canvas/node_vip/btn_Vip_1'), cc.find('Canvas/node_vip/btn_Vip_2'), cc.find('Canvas/node_vip/btn_Vip_3'), cc.find('Canvas/node_vip/btn_Vip_4'), cc.find('Canvas/node_vip/btn_Vip_5')];
    this.btn_gift.node.on('click', function () {
      var self = GlobalCfg.ACT_SCENE_CTRL;
      var myVipPos = self.getPlayerInfoByUserId(self.myVipPos);
      if (myVipPos) {
        CommonFun.getInstance().showGameGifInteraction(_this.seatid);
      } else {
        CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
      }
    }, this);
  },
  /**
   * 设置玩家信息
   * @param {玩家数据} date 
   */
  setVIPDate: function setVIPDate(date) {
    if (!date) {
      LoggerUtil.getInstance().log("设置玩家信息为空");
      return;
    }
    this.date = date;
    this.vipPos = date.vipPos;
    this.seatid = date.vipPos;
    this.vipPlayerId = date.playerId;
    this.loadHeadSp(this.date.imgUrl, 90, this.headSp);
    this.lab_VIPName.string = CommonFun.getInstance().getStrByLength(this.date.nickname, 8);
    this.lab_VIPCoin.string = CommonFun.getInstance().numberToShow(this.date.diamond / 100);
    this.setVIPSeat(this.date.vipPos);
    if (this.date.playerId == GlobalCfg.ACT_SCENE_CTRL.myPlayerId) {
      // 获取自己在Vip的座位
      GlobalCfg.ACT_SCENE_CTRL.myVipPos = this.vipPos;
    }
    ;
    if (date.vipLevel >= 1 && date.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + date.vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }
    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(date.vipLevel);
    if (isCanShowVIPFont) {
      this.lab_VIPName.node.color = new cc.Color(250, 225, 76);
    } else {
      this.lab_VIPName.node.color = new cc.Color(255, 255, 255);
    }
    ;
  },
  /**
   * 设置vip的位置
   * @param {vip的位置} pos 
   */
  setVIPSeat: function setVIPSeat(pos) {
    if (pos != 0) {
      this.nodePos = this.userSeatSort[pos - 1]; // 服务器VIP位置是从1开始
      this.node.setPosition(this.nodePos);
      if (this.nodePos.x > 0) {
        var pos1 = this.btn_gift.node.getPosition();
        var pos2 = this.sprite_vipLevelIcon.node.getPosition();
        this.btn_gift.node.setPosition(pos2);
        this.sprite_vipLevelIcon.node.setPosition(pos1);
      }
    }
  },
  /**
   * @param {根据pos来获取vip的位置坐标} pos 
   * 玩家下注时需要抖动 vip背景遮罩也需要一起抖动
   */
  vipHeadSpriteAct: function vipHeadSpriteAct(pos) {
    var node = this.VIPBGArr[pos - 1];
    var nodePos = this.userSeatSort[pos - 1];
    var startPos = cc.v2(nodePos.x, nodePos.y + 15);
    var endPos = cc.v2(nodePos.x, nodePos.y);
    cc.tween(this.node).to(0.1, {
      position: startPos
    }).to(0.1, {
      position: endPos
    }).start();
    cc.tween(node).to(0.1, {
      position: startPos
    }).to(0.1, {
      position: endPos
    }).start();
  },
  /**
  * 下注投注飞金币动作
  * @param {根据下注的类型来固定结束的坐标} betType 
  * @param {根据钱的多少来投注金币的个数} amount 
  */
  playerCoinAct: function playerCoinAct(betType, amount) {
    var index = [10, 50, 100, 1000, 2000].map(function (i) {
      return i;
    }).indexOf(amount);
    var coins = [1, 3, 5, 10, 12][index] || 3;
    for (var i = 0; i < coins; i++) {
      var pos = GlobalCfg.ACT_SCENE_CTRL.utils.setCoinEndPos(betType);
      var chouMa = GlobalCfg.ACT_SCENE_CTRL.utils.createEnemy(this.node.getPosition());
      chouMa.name = "" + betType;
      cc.tween(chouMa).delay((Math.random() * 0.2).toFixed(2)).to(0.3, {
        position: pos
      }, {
        easing: "quadIn"
      }).start();
    }
  },
  /**
   * 设置vip玩家的钱
   * @param {*} coin 
   */
  setVipCion: function setVipCion(coin) {
    this.lab_VIPCoin.string = CommonFun.getInstance().numberToShow(coin / 100);
  },
  // 显示玩家赢钱的漂分
  showPlayWinCion: function showPlayWinCion(coin, score) {
    var _this2 = this;
    if (this.bg_js) {
      this.setVipCion(coin);
      var scoreStr = this.getFloatNum(Number(score / 100).toFixed(2));
      this.lab_score.string = "+" + scoreStr;
      this.bg_js.setPosition(0, 40);
      this.bg_js.active = true;
      cc.tween(this.bg_js).to(1, {
        position: cc.v2(0, 90)
      }).delay(1).call(function () {
        _this2.bg_js.active = false;
      }).start();
    }
  },
  playWinCoin: function playWinCoin(arr) {
    var _this3 = this;
    if (!arr) return;
    var _loop = function _loop() {
      var chouMa = arr[i];
      if (chouMa) {
        cc.tween(chouMa).delay((Math.random() / 3).toFixed(2)).to(0.3, {
          position: _this3.nodePos
        }, {
          easing: "quadIn"
        }).call(function () {
          GlobalCfg.ACT_SCENE_CTRL.utils.onEnemyKilled(chouMa);
        }).start();
      }
    };
    for (var i = arr.length - 1; i >= 0; i--) {
      _loop();
    }
  },
  getFloatNum: function getFloatNum(num) {
    var numString = num.toString();
    if (numString.charAt(numString.length - 1) == '0') {
      numString = numString.substring(0, numString.length - 1);
      return this.getFloatNum(numString);
    } else {
      if (numString.charAt(numString.length - 1) == '.') {
        numString = numString.substring(0, numString.length - 1);
      }
      return numString;
    }
  }
});

cc._RF.pop();