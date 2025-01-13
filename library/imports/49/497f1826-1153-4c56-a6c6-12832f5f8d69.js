"use strict";
cc._RF.push(module, '497f1gmEVNMVqbGEoMvX41p', 'node_scoreCtrl');
// 7up7downGame/7upScript/node_scoreCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    atlas: cc.SpriteAtlas
  },
  onLoad: function onLoad() {},
  start: function start() {},
  setScore: function setScore(score) {
    this.lab = this.node.getChildByName("lab").getComponent(cc.Label);
    this.spriteBg = this.node.getComponent(cc.Sprite);
    this.lab.string = score;
    if (score < 7) {
      this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("red_bg");
    } else if (score == 7) {
      this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("blue_bg");
    } else if (score > 7) {
      this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("yel_bg");
    }
  },
  setNewState: function setNewState(state) {
    this.node.getChildByName("NEW").active = state;
  }
});

cc._RF.pop();