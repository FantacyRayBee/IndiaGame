"use strict";
cc._RF.push(module, '090b6oYdARPbI2oa9YPQV7S', 'GameWordInteractionShowCtrl');
// notBundle/GameWordInteraction/GameWordInteractionShowCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_content: cc.Label,
    sprite_face: cc.Sprite,
    node_word: cc.Node,
    node_face: cc.Node
  },
  ctor: function ctor() {
    this.face_spriteFrame = null;
  },
  onDestroy: function onDestroy() {
    if (this.face_spriteFrame) {
      this.face_spriteFrame.decRef();
      this.face_spriteFrame = null;
    }
    ;
  },
  setGameWordInteraction: function setGameWordInteraction(type, name, targetNode, offset, parentNode) {
    var _this = this;
    if (type == 0) {
      this.dealWordShow(name, targetNode, offset, parentNode);
    } else if (type == 1) {
      this.dealFaceShow(name, targetNode, offset, parentNode);
    }
    ;
    var checkIsValid = function checkIsValid() {
      if (cc.isValid(targetNode, true) == false) {
        _this.unschedule(checkIsValid);
        _this.node.destroy();
        return;
      }
      ;
    };
    this.schedule(checkIsValid, 0.05);
  },
  dealWordShow: function dealWordShow(name, targetNode, offset, parentNode) {
    var _this2 = this;
    this.node_face.active = false;
    this.node_word.active = true;
    this.lab_content.string = name;
    var targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
    var targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);
    this.node_word.setPosition(targetNodePos.x + offset.x, targetNodePos.y + offset.y);
    var labWidth = this.lab_content.node.width;
    this.lab_content.node.setPosition(cc.v2(155, 7));
    cc.tween(this.lab_content.node).to(3, {
      position: cc.v2(-155 - labWidth, 7)
    }).call(function () {
      _this2.node.destroy();
    }).start();
  },
  dealFaceShow: function dealFaceShow(name, targetNode, offset, parentNode) {
    var _this3 = this;
    this.node_face.active = true;
    this.node_word.active = false;
    var targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
    var targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);
    this.node_face.setPosition(targetNodePos.x + offset.x, targetNodePos.y + offset.y);
    ResourcesBundle.load("NewPlan/GameWordInteraction/face/" + name, cc.SpriteFrame, function (err, spriteFrame) {
      if (!err) {
        if (CommonFun.getInstance().isValidForScr(_this3)) {
          spriteFrame.addRef();
          _this3.face_spriteFrame = spriteFrame;
          _this3.sprite_face.spriteFrame = spriteFrame;
        } else {
          spriteFrame.addRef();
          spriteFrame.decRef();
          spriteFrame = null;
        }
        ;
      } else {
        LoggerUtil.getInstance().error(err);
      }
      ;
    });
    cc.tween(this.node_face).repeat(4, cc.tween().by(0.5, {
      position: cc.v2(0, -5)
    }).by(0.5, {
      position: cc.v2(0, 5)
    })).call(function () {
      _this3.node.destroy();
    }).start();
  }
});

cc._RF.pop();