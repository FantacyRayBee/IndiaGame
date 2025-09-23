"use strict";
cc._RF.push(module, '39145q+CDlKYbqx0eO14prJ', 'GameWordInteractionWordItemCtrl');
// notBundle/GameWordInteraction/GameWordInteractionWordItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_content: cc.Label
  },
  ctor: function ctor() {
    this.itemData = {};
  },
  onLoad: function onLoad() {
    this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_WORD_CLICK_ITEM,
      msgData: {
        itemData: this.itemData
      }
    });
  },
  setWordItemContent: function setWordItemContent(word) {
    this.itemData.name = word;
    this.lab_content.string = word;
  }
});

cc._RF.pop();