"use strict";
cc._RF.push(module, 'efa951HzlFHzoi/j+w8gFjo', 'lhdCradCtrl');
// lhdGame/lhdScr/lhdCradCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pokseAtlas: cc.SpriteAtlas,
    Sprite_crad_Right: cc.Sprite,
    Sprite_crad_left: cc.Sprite,
    Sprite_crad_bei: cc.SpriteFrame
  },
  ctor: function ctor() {
    this.cardtype = 0;
    this.cardgrade = 0;
    this.lord = false;
    this.initCardInfo = null;
  },
  onLoad: function onLoad() {},
  // 0 ~ 51; 52, 53;获取牌的精灵资源
  setCardInfo: function setCardInfo(paiValue) {
    var paiType = this.getPaiType(paiValue); // let paiNum = this.getPaiNum(paiValue);

    var getNum = function getNum(paiValue) {
      var paiNum = (paiValue + 12) % 13;

      if (paiValue == 52) {
        paiNum = "d";
      } else if (paiValue == 53) {
        paiNum = "x";
      }

      return paiNum;
    };

    var paiNum = getNum(paiValue);

    if (paiNum == 0) {
      paiNum = 13;
    }

    var cardSpriteFrameName = paiType + paiNum;
    return cardSpriteFrameName;
  },
  getPaiNum: function getPaiNum(paiValue) {
    var paiNum = paiValue % 13;

    if (paiValue == 52) {
      paiNum = "d";
    } else if (paiValue == 53) {
      paiNum = "x";
    }

    return paiNum;
  },
  getPaiType: function getPaiType(paiValue) {
    var paiType = "";

    if (paiValue <= 12) {
      paiType = "fangkuai";
    } else if (paiValue > 12 && paiValue <= 25) {
      paiType = "meihua";
    } else if (paiValue > 25 && paiValue <= 38) {
      paiType = "hongxin";
    } else if (paiValue > 38 && paiValue <= 51) {
      paiType = "heitao";
    } else if (paiValue == 52) {
      paiType = "w_";
    } else if (paiValue == 53) {
      paiType = "w_";
    }

    return paiType;
  },
  // 游戏结束牌翻转动画
  showCradEngAct: function showCradEngAct(cradArr) {
    var _this = this;

    var _long = this.setCardInfo(cradArr[0]);

    var hu = this.setCardInfo(cradArr[1]);
    cc.tween(this.Sprite_crad_left.node).to(0.1, {
      scale: 1.2
    }).to(0.1, {
      scale: 1
    }).to(0.15, {
      scaleX: 0
    }).call(function () {
      _this.Sprite_crad_left.spriteFrame = _this.pokseAtlas.getSpriteFrame(_long);
      cc.tween(_this.Sprite_crad_Right.node).to(0.1, {
        scale: 1.2
      }).to(0.1, {
        scale: 1
      }).to(0.15, {
        scaleX: 0
      }).call(function () {
        _this.Sprite_crad_Right.spriteFrame = _this.pokseAtlas.getSpriteFrame(hu);
      }).to(0.2, {
        scaleX: 1
      }).delay(0.1).call(function () {
        if (GlobalCfg.ACT_SCENE_CTRL.winorlose == 1 || GlobalCfg.ACT_SCENE_CTRL.winorlose == 2) {
          GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
        }
      }).start();
    }).to(0.2, {
      scaleX: 1
    }).call(function () {
      GlobalCfg.ACT_SCENE_CTRL.endGameAim();
    }).delay(0.1).call(function () {
      if (GlobalCfg.ACT_SCENE_CTRL.winorlose == 0 || GlobalCfg.ACT_SCENE_CTRL.winorlose == 2) {
        GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
      }
    }).start();
  },
  // 游戏开始是牌出场动画
  showCradStartAct: function showCradStartAct() {
    cc.tween(this.Sprite_crad_left.node).to(0.6, {
      position: cc.v2(0, 0)
    }, {
      easing: "quadOut"
    }).call(function () {
      GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = true;
    }).start();
    cc.tween(this.Sprite_crad_Right.node).to(0.6, {
      position: cc.v2(0, 0)
    }, {
      easing: "quadOut"
    }).call(function () {
      GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = true;
    }).start();
  },
  // 初始化牌的位置
  initCardPos: function initCardPos() {
    this.Sprite_crad_left.node.scale = 1;
    this.Sprite_crad_Right.node.scale = 1;
    this.Sprite_crad_left.node.setPosition(200, 0);
    this.Sprite_crad_Right.node.setPosition(-200, 0);
    this.Sprite_crad_left.spriteFrame = this.Sprite_crad_bei;
    this.Sprite_crad_Right.spriteFrame = this.Sprite_crad_bei;
  },
  // 进入游戏初始化牌的状态
  gameStartInItCrad: function gameStartInItCrad(start, cards) {
    var leftCrad = this.node.getChildByName("node_maskCrad_left").getChildByName("back_left");
    var RightCrad = this.node.getChildByName("node_maskCrad_Right").getChildByName("back_right");

    if (start == 4) {
      //结算
      // leftCrad.setPosition(200,0);
      // RightCrad.setPosition(-200,0);
      leftCrad.setPosition(0, 0);
      RightCrad.setPosition(0, 0); // if(cards){
      //     this.setCardInfo(cards[0]);
      //     this.setCardInfo(cards[1]);
      // }
    } else {
      leftCrad.setPosition(0, 0);
      RightCrad.setPosition(0, 0);
      GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = true;
      GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = true;
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = false;
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = false;
      this.Sprite_crad_left.spriteFrame = this.Sprite_crad_bei;
      this.Sprite_crad_Right.spriteFrame = this.Sprite_crad_bei;
    }
  },
  initCard: function initCard(cards, winorlose) {
    var leftCrad = this.node.getChildByName("node_maskCrad_left").getChildByName("back_left");
    var RightCrad = this.node.getChildByName("node_maskCrad_Right").getChildByName("back_right");
    leftCrad.setPosition(0, 0);
    RightCrad.setPosition(0, 0); // this.Sprite_crad_left.node.scale = 1;
    // this.Sprite_crad_Right.node.scale = 1;

    var _long2 = this.setCardInfo(cards[0]);

    var hu = this.setCardInfo(cards[1]);
    this.Sprite_crad_left.spriteFrame = this.pokseAtlas.getSpriteFrame(_long2);
    this.Sprite_crad_Right.spriteFrame = this.pokseAtlas.getSpriteFrame(hu);

    if (winorlose == 1) {
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = false;
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
    } else if (winorlose == 2) {
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = false;
    } else if (winorlose == 3) {
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_hu.active = true;
      GlobalCfg.ACT_SCENE_CTRL.ske_guang_long.active = true;
    }

    GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = false;
    GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = false;
  }
});

cc._RF.pop();