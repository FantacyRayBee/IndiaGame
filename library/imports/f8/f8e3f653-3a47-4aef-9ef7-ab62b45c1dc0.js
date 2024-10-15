"use strict";
cc._RF.push(module, 'f8e3fZTOkdK7573q2K0XB3A', 'zeusRecordItemCtrl');
// zeusGame/src/zeusRecordItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_num: cc.Label,
    lab_winCoin: cc.Label,
    sprite_icon: cc.Sprite,
    spriteFrame_icon1: cc.SpriteFrame,
    spriteFrame_icon3: cc.SpriteFrame,
    spriteFrame_icon4: cc.SpriteFrame,
    spriteFrame_icon5: cc.SpriteFrame,
    spriteFrame_icon6: cc.SpriteFrame,
    spriteFrame_icon7: cc.SpriteFrame,
    spriteFrame_icon8: cc.SpriteFrame,
    spriteFrame_icon9: cc.SpriteFrame,
    spriteFrame_icon10: cc.SpriteFrame,
    spriteFrame_icon11: cc.SpriteFrame
  },
  setRecordItemData: function setRecordItemData(recordItemData) {
    if (!recordItemData) {
      return;
    }

    ;
    var erase = recordItemData.erase;
    var bet = recordItemData.bet;
    var elf = erase.elf; // 消除元素

    var num = erase.num; // 元素个数

    var mul = erase.mul; // 倍数

    this.lab_num.string = "" + num;
    this.lab_winCoin.string = "$" + this.changeNumToK(bet * mul / 2000);
    this.sprite_icon.spriteFrame = this["spriteFrame_icon" + elf];
  },
  changeNumToK: function changeNumToK(num) {
    if (num < 1000) {
      return num;
    } else {
      var n = (num / 1000).toFixed(1);
      var res = n.toString() + 'K';
      return res;
    }
  }
});

cc._RF.pop();