"use strict";
cc._RF.push(module, '37373oMgoZMb4G9S/Paeo/G', 'noVIPPlayerCtrl');
// baccarat3PattiGame/src/noVIPPlayerCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  /**
   * 设置自己信息
   * @param {自己的信息} requester 
   */
  setMyDate: function setMyDate(requester) {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    if (requester) {
      self.myVipPos = requester.vipPos;
      GlobalCfg.USER_DATAS.userDiamond = requester.diamond;
      self.myPlayerId = requester.playerId;
      self.lab_myCoin.string = CommonFun.getInstance().numberToShow(requester.diamond / 100);
      self.utils.loadHeadSp(requester.imgUrl, 90, self.headSp);
      if (requester.vipLevel >= 1 && requester.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
        self.sprite_vipLevelIcon.node.active = true;
        self.sprite_vipLevelIcon.spriteFrame = self.atlas_icon.getSpriteFrame("" + requester.vipLevel);
      } else {
        self.sprite_vipLevelIcon.node.active = false;
      }
      ;
    } else {
      LoggerUtil.getInstance().error("服务器数据错误：requester");
    }
  },
  /**
   * 设置自己的钱
   * @param {自己的钱} coin 
   */
  setMyCoin: function setMyCoin(coin) {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    GlobalCfg.USER_DATAS.userDiamond = coin;
    self.lab_myCoin.string = CommonFun.getInstance().numberToShow(coin / 100);
    var myVipPos = self.getPlayerInfoByUserId(self.myVipPos);
    if (myVipPos) {
      myVipPos.setVipCion(coin);
    }
  },
  /**
   * 自己投注抖动
   */
  myHeadSpriteShake: function myHeadSpriteShake() {
    var node = GlobalCfg.ACT_SCENE_CTRL.myUser;
    cc.tween(node).to(0.1, {
      position: cc.v2(-344, -287)
    }).to(0.1, {
      position: cc.v2(-344, -302)
    }).start();
  },
  /**
   * 除自己外的普通玩家下注
   * @param {普通玩家下注奖池} newArr 
   */
  noVIPPlayerAct: function noVIPPlayerAct(newArr) {
    var arr = this.unique(newArr);
    var btn_playerNum = GlobalCfg.ACT_SCENE_CTRL.btn_playerNum;
    for (var i = 0; i < arr.length; i++) {
      var betType = arr[i];
      for (var _i = 0; _i < 4; _i++) {
        var pos = GlobalCfg.ACT_SCENE_CTRL.utils.setCoinEndPos(betType);
        var chouMa = GlobalCfg.ACT_SCENE_CTRL.utils.createEnemy(cc.v2(-538, -321));
        chouMa.name = "" + betType;
        cc.tween(chouMa).delay((Math.random() * 0.2).toFixed(2)).to(0.3, {
          position: pos
        }, {
          easing: "quadIn"
        }).start();
      }
    }
    if (btn_playerNum && arr.length > 0) {
      cc.tween(btn_playerNum).to(0.1, {
        position: cc.v2(-538, -306)
      }).to(0.1, {
        position: cc.v2(-538, -325)
      }).start();
    }
    GlobalCfg.ACT_SCENE_CTRL.puTongBetArr = [];
  },
  /**
   * 下注投注飞金币动作
   * @param {根据下注的类型来固定结束的坐标} betType 
   * @param {根据钱的多少来投注金币的个数} amount 
   */
  myCoinAct: function myCoinAct(betType, amount) {
    var index = [10, 50, 100, 1000, 2000].map(function (i) {
      return i;
    }).indexOf(amount / 100);
    var coins = [1, 3, 5, 10, 12][index] || 3;
    for (var i = 0; i < coins; i++) {
      var pos = GlobalCfg.ACT_SCENE_CTRL.utils.setCoinEndPos(betType);
      var chouMa = GlobalCfg.ACT_SCENE_CTRL.utils.createEnemy(cc.v2(-344, -302));
      chouMa.name = "" + betType;
      cc.tween(chouMa).delay((Math.random() * 0.2).toFixed(2)).to(0.3, {
        position: pos
      }, {
        easing: "quadIn"
      }).start();
    }
  },
  playWinCoin: function playWinCoin(arr) {
    if (!arr) return;
    var _loop = function _loop() {
      var chouMa = arr[i];
      if (chouMa) {
        cc.tween(chouMa).delay((Math.random() / 3).toFixed(2)).to(0.3, {
          position: cc.v2(-344, -302)
        }, {
          easing: "quadIn"
        }).call(function () {
          GlobalCfg.ACT_SCENE_CTRL.utils.onEnemyKilled(chouMa);
        }).start();
      } else {
        LoggerUtil.getInstance().error("错误======>>>>,chouMa", chouMa);
      }
    };
    for (var i = arr.length - 1; i >= 0; i--) {
      _loop();
    }
  },
  // 显示玩家赢钱的漂分
  showPlayWinCion: function showPlayWinCion(coin, score) {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    if (self.my_bg_js) {
      this.setMyCoin(coin);
      var scoreStr = this.getFloatNum(Number(score / 100).toFixed(2));
      self.my_lab_score.string = "+" + scoreStr;
      self.my_bg_js.setPosition(0, 40);
      self.my_bg_js.active = true;
      cc.tween(self.my_bg_js).to(1, {
        position: cc.v2(0, 90)
      }).delay(1).call(function () {
        self.my_bg_js.active = false;
      }).start();
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
  },
  /**
   * 数组去重
   */
  unique: function unique(a) {
    var res = [];
    for (var i = 0, len = a.length; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        // 这一步十分巧妙
        // 如果发现相同元素
        // 则 i 自增进入下一个循环比较
        if (a[i] === a[j]) j = ++i; //j = i = i + 1;
      }

      res.push(a[i]);
    }
    return res;
  }
});

cc._RF.pop();