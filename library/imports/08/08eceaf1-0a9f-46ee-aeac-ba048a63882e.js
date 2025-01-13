"use strict";
cc._RF.push(module, '08ecerxCp9G7q6sugSKY4gu', 'teenPattiChipCtrl');
// teenPatti/src/teenPattiChipCtrl.js

"use strict";

/*
 * @Author: 李康
 * @Date: 2021-12-01 15:17:38
 * @LastEditTime: 2021-12-01 15:37:05
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiChipCtrl.js
 */

cc.Class({
  "extends": cc.Component,
  properties: {
    sprite_chip: cc.Sprite,
    lab_num: cc.Label,
    fontArr: [cc.Font],
    spriteFrameArr: [cc.SpriteFrame]
  },
  ctor: function ctor() {
    // "blue", "green", "yellow", "orange"
    this.chipAmountArr = [["0.1", "0.2", "0.3", "0.4", "0.6", "1.2", "1", "2", "4", "3", "6", "12", "10", "20", "50", "100"], ["0.8", "1.6", "2.4", "4.8", "8", "16", "24", "48", "80", "160"], ["6.4", "9.6", "12.8", "19.2", "38.4", "64", "128", "192", "384", "320", "640", "2560", "1280", "1600"], ["400", "800", "3200", "6400", "3.2", "32", "9.6", "96", "40", "200"]];
  },
  setTeenPattiChipAmount: function setTeenPattiChipAmount(amount) {
    var index = 0;
    for (var i = 0, len = this.chipAmountArr.length; i < len; i++) {
      var chipAmountArr = this.chipAmountArr[i];
      if (chipAmountArr.indexOf("" + amount) != -1) {
        index = i;
        break;
      }
      ;
    }
    ;
    this.lab_num.string = amount;
    this.lab_num.font = this.fontArr[index];
    this.sprite_chip.spriteFrame = this.spriteFrameArr[index];
  }
});

cc._RF.pop();