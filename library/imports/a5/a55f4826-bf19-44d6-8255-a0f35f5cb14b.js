"use strict";
cc._RF.push(module, 'a55f4gmvxlE1oJVoPNfXLFL', 'winTepyCtrl');
// sscGame/sscScr/winTepyCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_winColor: cc.Node,
    node_redDot: cc.Node,
    Atlas_lobby: cc.SpriteAtlas
  },
  // onLoad () {},
  // 显示红点还是显示输赢
  showNode: function showNode(str, type) {
    if (str == "redDot") {
      this.node_redDot.active = true;
      this.node_winColor.active = false;

      if (type == 5) {
        this.node.y = 88;
      } else if (type == 4) {
        this.node.y = 52;
      } else if (type == 3) {
        this.node.y = 17;
      } else if (type == 2) {
        this.node.y = -18;
      } else if (type == 1) {
        this.node.y = -53;
      } else if (type == 0) {
        this.node.y = -88;
      }
    } else {
      this.node_redDot.active = false;
      this.node_winColor.active = true;
      var cardspritename = '';
      var sprite = this.node_winColor.getComponent(cc.Sprite);
      var lab_cradTpye = this.node_winColor.getChildByName("lab_cradTpye").getComponent(cc.Label);

      if (type == 5) {
        cardspritename = 'btn_high';
        lab_cradTpye.string = ["lab_highCard", "HIGH", "उच्च", "بلند ", "বড়"][language];
      } else if (type == 4) {
        cardspritename = 'btn_pair';
        lab_cradTpye.string = loToLanguage.lab_pair[language];
      } else if (type == 3) {
        cardspritename = 'btn_color';
        lab_cradTpye.string = loToLanguage.lab_color[language];
      } else if (type == 2) {
        cardspritename = 'btn_seq';
        lab_cradTpye.string = loToLanguage.lab_Seq[language];
      } else if (type == 1) {
        cardspritename = 'btn_pure';
        lab_cradTpye.string = loToLanguage.lab_pureSeq[language];
      } else if (type == 0) {
        cardspritename = 'btn_set';
        lab_cradTpye.string = loToLanguage.lab_set[language];
      }

      sprite.spriteFrame = this.Atlas_lobby.getSpriteFrame(cardspritename);

      if (str == "lobbyRecord") {
        this.node_winColor.width = 88;
        this.node_winColor.height = 42;
      } else if (str == "record") {
        this.node_winColor.width = 94;
        this.node_winColor.height = 38;
      }
    }
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();