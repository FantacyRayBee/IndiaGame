"use strict";
cc._RF.push(module, '9b15eSh5E5EZKtcxIlWhrOS', 'cradCtrl');
// baccarat3PattiGame/src/cradCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  /**
   * 翻牌动画
   * @param {牌权} paiValueArr 
   */
  cradAct: function cradAct(paiValueArr, fun, isFlip) {
    var _this = this;
    if (paiValueArr === void 0) {
      paiValueArr = null;
    }
    if (isFlip === void 0) {
      isFlip = null;
    }
    var self = GlobalCfg.ACT_SCENE_CTRL;
    var arr = [2, 1, 0, 5, 4, 3];
    var timeArr = [0.1, 0.2, 0.3, 0.1, 0.2, 0.3];
    var arr01 = self.node_CradBlue.children;
    var arr02 = self.node_CradRed.children;
    var newArr = arr01.concat(arr02);
    var _loop = function _loop(i) {
      var crad = newArr[arr[i]];
      crad.scale = 0.58;
      if (isFlip) {
        _this.setCradValue("" + paiValueArr[i], crad);
        if (fun) fun();
      } else {
        cc.tween(crad).delay(timeArr[i]).to(0.2, {
          scaleX: 0
        }).call(function () {
          _this.setCradValue("" + paiValueArr[i], crad);
          if (i == 5 && fun) {
            fun();
          }
        }).to(0.2, {
          scaleX: 0.58
        }).start();
      }
    };
    for (var i = 0; i < arr.length; i++) {
      _loop(i);
    }
  },
  /**
   * 设置牌值
   * @param {根据牌权来设置牌的精灵} paiValue 
   * @param {牌的节点} node 
   */
  setCradValue: function setCradValue(paiValue, node) {
    if (paiValue === void 0) {
      paiValue = null;
    }
    if (node === void 0) {
      node = null;
    }
    var self = GlobalCfg.ACT_SCENE_CTRL;
    if (paiValue) {
      node.getComponent(cc.Sprite).spriteFrame = self.pokseAtlas.getSpriteFrame(paiValue);
    } else {
      var arr01 = self.node_CradBlue.children;
      var arr02 = self.node_CradRed.children;
      var newArr = arr01.concat(arr02);
      for (var i = 0; i < newArr.length; i++) {
        var crad = newArr[i];
        crad.scale = 0.58;
        crad.getComponent(cc.Sprite).spriteFrame = self.pokseBei;
      }
    }
  },
  /**
   * 展示牌类型的动画
   * @param {牌的类型} side 
   * @param {红或蓝胜利} winBlueRed 
   */
  playCradAct: function playCradAct(side, winBlueRed) {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    var cradDefaultSkinArr = ["set", "pureseq", "sequence", "color", "pair", "highcard"];
    var node = winBlueRed == 6 ? self.node_blue : self.node_red;
    node.active = true;
    var ske = node.getChildByName("paixing_zi").getComponent(sp.Skeleton);
    ;
    var skinName = cradDefaultSkinArr[side];
    ske.setSkin(skinName);
    ske.setAnimation(1, "chuxian", false);
  },
  /**
   * 初始化牌的动画
   */
  inOfCradAim: function inOfCradAim() {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    if (self.node) {
      if (self.node_blue && self.node_blue.active) self.node_blue.active = false;
      if (self.node_red && self.node_red.active) self.node_red.active = false;
    }
  }
});

cc._RF.pop();