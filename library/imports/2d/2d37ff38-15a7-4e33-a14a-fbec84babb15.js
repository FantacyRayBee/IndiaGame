"use strict";
cc._RF.push(module, '2d37f84FadOM6FK++yEursV', 'ChatActCtrl');
// ResourcesBundle/NewPlan/ChatAct/ChatActCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    bqAtlas: cc.SpriteAtlas,
    lab_chat: cc.Label
  },
  // 发送表情  消息类型 0短语 1表情
  face: function face(notify, pos) {
    var _this = this;

    var data = notify;
    var msgtype = notify.msgType;
    var msgid = data.name;
    this.emotion = this.node.getChildByName("emotion");
    this.chat_bg = this.node.getChildByName("chat_bg");

    if (msgtype == 0) {
      this.setUserPos(pos);
      this.chat_bg.active = true;
      this.lab_chat.string = msgid;
      cc.tween(this.lab_chat.node).to(3, {
        position: cc.v2(-260, 0)
      }).call(function () {
        _this.node.destroy();
      }).start();
    } else if (msgtype == 1) {
      this.emotion.setPosition(pos);
      this.emotion.active = true;
      this.emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
      cc.tween(this.emotion).repeat(4, cc.tween().by(0.5, {
        position: cc.v2(0, -5)
      }).by(0.5, {
        position: cc.v2(0, 5)
      })).call(function () {
        _this.node.destroy();
      }).start();
    }
  },
  setUserPos: function setUserPos(pos) {
    var X = 0;
    var Y = pos.y + 50;

    if (pos.x > 0) {
      X = pos.x - 230;
      this.chat_bg.scaleX = -1;
      this.lab_chat.node.scaleX = -1;
    } else {
      X = pos.x + 230;
      this.chat_bg.scaleX = 1;
      this.lab_chat.node.scaleX = 1;
    }

    ;
    this.chat_bg.setPosition(X, Y);
  }
});

cc._RF.pop();