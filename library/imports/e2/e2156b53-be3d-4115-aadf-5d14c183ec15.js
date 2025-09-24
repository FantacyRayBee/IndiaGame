"use strict";
cc._RF.push(module, 'e2156tTvj1BFarfXRTBg+wV', 'sscCradCtrl');
// sscGame/sscScr/sscCradCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pokseAtlas: cc.SpriteAtlas,
    cradMask: cc.Node
  },
  ctor: function ctor() {
    this.cardtype = 0;
    this.cardgrade = 0;
    this.lord = false;
    this.initCardInfo = null;
  },
  onLoad: function onLoad() {},
  setCardInfo: function setCardInfo(crad) {
    var paiValue = crad;
    var num = "" + paiValue % 13;
    var cardspritename = "";

    if (paiValue <= 12) {
      cardspritename = "fangkuai";
    } else if (paiValue > 12 && paiValue <= 25) {
      cardspritename = "meihua";
    } else if (paiValue > 25 && paiValue <= 38) {
      cardspritename = "hongxin";
    } else if (paiValue > 38 && paiValue <= 51) {
      cardspritename = "heitao";
    } else if (paiValue == 52) {
      cardspritename = "w_";
    } else if (paiValue == 53) {
      cardspritename = "w_";
    }

    if (num == "0") {
      cardspritename += 12;
    } else if (num == "1") {
      cardspritename += 13;
    } else if (num == "2") {
      cardspritename += 1;
    } else if (num == "3") {
      cardspritename += 2;
    } else if (num == "4") {
      cardspritename += 3;
    } else if (num == "5") {
      cardspritename += 4;
    } else if (num == "6") {
      cardspritename += 5;
    } else if (num == "7") {
      cardspritename += 6;
    } else if (num == "8") {
      cardspritename += 7;
    } else if (num == "9") {
      cardspritename += 8;
    } else if (num == "10") {
      cardspritename += 9;
    } else if (num == "11") {
      cardspritename += 10;
    } else if (num == "12") {
      cardspritename += 11;
    }

    this.node.getComponent(cc.Sprite).spriteFrame = this.pokseAtlas.getSpriteFrame(cardspritename);
  },
  valueTransTypeAndNum: function valueTransTypeAndNum(crad) {
    var data = {};
    var cradStr = Number(crad) % 13;

    if (cradStr.length == 1) {
      data.num = cradStr.substr(0, 2);
      data.type = "0";
    } else {
      data.num = cradStr.substr(1, 2);
      data.type = cradStr.substr(0, 1);
    }

    return data;
  }
});

cc._RF.pop();