"use strict";
cc._RF.push(module, 'bae31VlJDpHl5JljCrUtER4', 'GameGifInteractionItemCtrl');
// notBundle/GameGifInteraction/GameGifInteractionItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    sprite_icon: cc.Sprite,
    lab_price: cc.Label
  },
  ctor: function ctor() {
    this.icon_spriteFrame = null;
    this.itemData = {};
  },
  onLoad: function onLoad() {
    this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  onDestroy: function onDestroy() {
    if (this.icon_spriteFrame) {
      this.icon_spriteFrame.decRef();
      this.icon_spriteFrame = null;
    }
    ;
  },
  btnClick: function btnClick() {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_GIF_CLICK_ITEM,
      msgData: {
        itemData: this.itemData
      }
    });
  },
  setGameGiftItemData: function setGameGiftItemData(data) {
    var _this = this;
    var price = data.price;
    var name = data.name;
    this.itemData = data;
    this.lab_price.string = "$" + price;
    ResourcesBundle.load("NewPlan/GameGifInteraction/res/item/" + name, cc.SpriteFrame, function (err, spriteFrame) {
      if (!err) {
        if (CommonFun.getInstance().isValidForScr(_this)) {
          spriteFrame.addRef();
          _this.icon_spriteFrame = spriteFrame;
          _this.sprite_icon.spriteFrame = spriteFrame;
          _this.node.active = true;
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