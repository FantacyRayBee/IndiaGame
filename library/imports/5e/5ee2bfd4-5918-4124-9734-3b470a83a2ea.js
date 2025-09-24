"use strict";
cc._RF.push(module, '5ee2b/UWRhBJJc0O0cKg6Lq', 'andeerCardCtrl');
// andaerGame/andeerScr/andeerCardCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pokseAtlas: cc.SpriteAtlas
  },
  ctor: function ctor() {
    this.cardgrade = 0;
    this.lord = false;
    this.initCardInfo = null;
  },
  onLoad: function onLoad() {},
  setCardInfo: function setCardInfo(cardValue) {
    var cardSpriteName = "";
    var num = this.getNum(cardValue);

    if (cardValue >= 0 && cardValue <= 12) {
      cardSpriteName = "fangkuai" + num;
    } else if (cardValue >= 13 && cardValue <= 25) {
      cardSpriteName = "meihua" + num;
    } else if (cardValue >= 26 && cardValue <= 38) {
      cardSpriteName = "hongxin" + num;
    } else if (cardValue >= 39 && cardValue <= 51) {
      cardSpriteName = "heitao" + num;
    } else if (cardValue == 52) {
      cardSpriteName = "w_x";
    } else if (cardValue == 53) {
      cardSpriteName = "w_d";
    } else {
      LoggerUtil.getInstance().error("\u724C\u503C\u6709\u9519\u8BEF, \u6B63\u5E38\u7684\u724C\u503C\u4E3A\uFF1A0 ~ 53. \u6B64\u724C\u503C\u4E3A: " + cardValue);
      return;
    }

    ;
    this.node.getComponent(cc.Sprite).spriteFrame = this.pokseAtlas.getSpriteFrame(cardSpriteName);
    this.node.width = 143;
    this.node.height = 186;
  },
  getNum: function getNum(cardValue) {
    var m = cardValue % 13;

    if (m == 0) {
      return 12;
    } else if (m == 1) {
      return 13;
    } else if (m == 2) {
      return 1;
    } else if (m == 3) {
      return 2;
    } else if (m == 4) {
      return 3;
    } else if (m == 5) {
      return 4;
    } else if (m == 6) {
      return 5;
    } else if (m == 7) {
      return 6;
    } else if (m == 8) {
      return 7;
    } else if (m == 9) {
      return 8;
    } else if (m == 10) {
      return 9;
    } else if (m == 11) {
      return 10;
    } else if (m == 12) {
      return 11;
    }

    ;
  }
});

cc._RF.pop();