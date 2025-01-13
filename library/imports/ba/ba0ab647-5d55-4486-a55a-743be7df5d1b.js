"use strict";
cc._RF.push(module, 'ba0abZHXVVEhqVadDvn310b', 'UserHeadCtrl');
// ResourcesBundle/NewPlan/UserHead/UserHeadCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    lab_playerName: cc.Label,
    lab_playerCoin: cc.Label,
    node_bgJB: cc.Node,
    node_head: cc.Sprite
  },
  onLoad: function onLoad() {
    var _this = this;
    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this.node.destroy();
    }, this);
  },
  setUserDate: function setUserDate(headUrl, name, diamond, trial) {
    if (headUrl) this.loadHeadSp(headUrl, 110);
    if (name) this.lab_playerName.string = CommonFun.getInstance().getStrByLength(name, 12);
    if (diamond) this.lab_playerCoin.string = CommonFun.getInstance().numberToShow(diamond / 100);
    if (trial) this.node_bgJB.active = trial ? false : true;
  },
  loadHeadSp: function loadHeadSp(spriteurl, realWidth) {
    var _this2 = this;
    if (spriteurl && spriteurl.length > 0) {
      cc.assetManager.loadRemote(spriteurl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this2) && cc.isValid(_this2.node_head)) {
          _this2.node_head.spriteFrame = new cc.SpriteFrame(texture);
          _this2.node_head.node.setScale(realWidth / _this2.node_head.node.width);
        }
        ;
      });
    }
    ;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.USERHEAD);
  }
});

cc._RF.pop();