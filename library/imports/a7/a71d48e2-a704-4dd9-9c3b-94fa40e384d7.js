"use strict";
cc._RF.push(module, 'a71d4jipwRN2Zw7lPpA44TX', 'GameWordInteractionFaceItemCtrl');
// ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteractionFaceItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    sprite_face: cc.Sprite
  },
  ctor: function ctor() {
    this.itemData = {};
    this.face_spriteFrame = null;
  },
  onDestroy: function onDestroy() {
    if (this.face_spriteFrame) {
      this.face_spriteFrame.decRef();
      this.face_spriteFrame = null;
    }
    ;
  },
  onLoad: function onLoad() {
    this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_FACE_CLICK_ITEM,
      msgData: {
        itemData: this.itemData
      }
    });
  },
  setFaceItemFaceName: function setFaceItemFaceName(faceName) {
    var _this = this;
    faceName = faceName >= 10 ? "emotion_0" + faceName : "emotion_00" + faceName;
    this.itemData.name = faceName;
    ResourcesBundle.load("NewPlan/GameWordInteraction/face/" + faceName, cc.SpriteFrame, function (err, spriteFrame) {
      if (!err) {
        if (CommonFun.getInstance().isValidForScr(_this)) {
          spriteFrame.addRef();
          _this.face_spriteFrame = spriteFrame;
          _this.sprite_face.spriteFrame = spriteFrame;
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
  }
});

cc._RF.pop();