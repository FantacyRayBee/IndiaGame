"use strict";
cc._RF.push(module, 'c356a6k3O5F66RDRi4v8Gk2', 'teenPattiCardCtrl');
// teenPatti/src/teenPattiCardCtrl.js

"use strict";

/*
 * @Author: 李康
 * @Date: 2021-11-30 21:59:03
 * @LastEditTime: 2021-12-21 11:24:17
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiCardCtrl.js
 */

cc.Class({
  "extends": cc.Component,
  properties: {},
  setTeenPattiCardRoomCtrl: function setTeenPattiCardRoomCtrl(roomCtrl) {
    this.roomCtrl = roomCtrl;
  },
  setTeenPattiCardSprite: function setTeenPattiCardSprite(cardValue) {
    var cardSprite = this.node.getComponent(cc.Sprite);
    var cardSpriteFrame = this.roomCtrl.spritAtlas_card.getSpriteFrame(cardValue);
    cardSprite.spriteFrame = cardSpriteFrame;
  },
  setTeenPattiCardScale: function setTeenPattiCardScale(scale) {
    this.cardScale = scale;
    this.node.scale = scale;
  },
  setTeenPattiCardPosition: function setTeenPattiCardPosition(pos) {
    if (!pos) {
      return;
    }
    ;
    this.node.setPosition(pos);
  },
  playTeenPattiCardRollingOverAnima: function playTeenPattiCardRollingOverAnima(cardValue) {
    var self = this;
    cc.tween(self.node).to(0.08, {
      scaleX: 0
    }).call(function () {
      self.setTeenPattiCardSprite(cardValue);
    }).to(0.08, {
      scaleX: self.cardScale
    }).start();
  },
  setTeenPattiCardGrayEffect: function setTeenPattiCardGrayEffect() {
    var button = this.node.getComponent(cc.Button);
    button.interactable = false;
    button.enableAutoGrayEffect = true;
  },
  clearTeenPattiCardGrayEffect: function clearTeenPattiCardGrayEffect() {
    var button = this.node.getComponent(cc.Button);
    button.interactable = true;
    button.enableAutoGrayEffect = false;
  }
});

cc._RF.pop();