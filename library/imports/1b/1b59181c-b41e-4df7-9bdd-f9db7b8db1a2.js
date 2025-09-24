"use strict";
cc._RF.push(module, '1b591gctB5N95vd+dt7jbGi', 'dataConfig');
// Benz/BenzScript/dataConfig.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    autoAltas: cc.SpriteAtlas,
    logoSpriteArr: [cc.SpriteFrame]
  },
  ctor: function ctor() {
    this.showNodePos = [cc.v2(0, 247), cc.v2(80, 247), cc.v2(160, 247), cc.v2(240, 247), //上边
    cc.v2(240, 163), cc.v2(240, 83), cc.v2(240, 3), cc.v2(240, -77), cc.v2(240, -157), cc.v2(240, -237), //右边
    cc.v2(160, -237), cc.v2(80, -237), cc.v2(0, -237), cc.v2(-80, -237), cc.v2(-160, -237), cc.v2(-240, -237), //下边
    cc.v2(-240, -157), cc.v2(-240, -77), cc.v2(-240, 3), cc.v2(-240, 83), cc.v2(-240, 163), cc.v2(-240, 247), //左边
    cc.v2(-160, 247), cc.v2(-80, 247)];
    this.logoTypeArr = [8, 2, 3, 6, 1, 4, 7, 2, 3, 5, 1, 4, 8, 2, 3, 6, 1, 4, 7, 2, 3, 5, 1, 4];
  },
  onLoad: function onLoad() {},
  start: function start() {},
  initLogo: function initLogo(logoPab, parentNode) {
    this.logoArr = [];

    for (var i = 0; i < this.showNodePos.length; i++) {
      var pos = this.showNodePos[i];
      var logo = cc.instantiate(logoPab);
      var spriteLogo = logo.getChildByName("logo").getComponent(cc.Sprite); // let key = this.getLogoString(this.logoTypeArr[i]);
      // spriteLogo.spriteFrame = this.autoAltas.getSpriteFrame(key);

      spriteLogo.spriteFrame = this.logoSpriteArr[this.logoTypeArr[i] - 1]; // LoggerUtil.getInstance().log("精灵帧：",key,spriteLogo);

      var obj = {
        node: logo,
        logoType: this.logoTypeArr[i],
        index: i
      };
      this.logoArr.push(obj);
      logo.setPosition(pos);
      logo.setParent(parentNode);
    }
  },
  setLogoOpacity: function setLogoOpacity(index, opacity, blink) {
    if (blink === void 0) {
      blink = false;
    }

    this.logoArr[index].node.getComponent("selectedCtrl").setSelfOpacity(opacity, blink);
  },
  changeLogo: function changeLogo(index, bActive) {
    this.logoArr[index].node.getChildByName("spr_selected").active = bActive;
  },
  getType: function getType(index) {
    return this.logoArr[index].logoType;
  },
  getIndexOf: function getIndexOf(type) {
    var arr = [];

    for (var index = 0; index < this.logoTypeArr.length; index++) {
      if (this.logoTypeArr[index] == type) {
        arr.push(index);
      }
    }

    return arr[Math.ceil(Math.random() * arr.length) - 1];
  },
  getLogoString: function getLogoString(type) {
    var _str;

    switch (type) {
      case 1:
        _str = "logo_small_08";
        break;

      case 2:
        _str = "logo_small_07";
        break;

      case 3:
        _str = "logo_small_06";
        break;

      case 4:
        _str = "logo_small_05";
        break;

      case 5:
        _str = "logo_small_04";
        break;

      case 6:
        _str = "logo_small_03";
        break;

      case 7:
        _str = "logo_small_02";
        break;

      case 8:
        _str = "logo_small_01";
        break;

      default:
        break;
    }

    return _str;
  } // update (dt) {},

});

cc._RF.pop();