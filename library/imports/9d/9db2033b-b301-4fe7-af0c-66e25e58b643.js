"use strict";
cc._RF.push(module, '9db20M7swFP568MZuJeWLZD', 'recorderCardCtrl_6');
// Rummy/rummyScript/recorderCardCtrl_6.js

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
    pab_valueStrLab: cc.Prefab
  },
  // LIFE-CYCLE CALLBACKS:
  ctor: function ctor() {
    this.cardArr = []; //存放 value 原始值
    this.pos = cc.v2(-138, 85);
    this.offset = 27; //偏移量，X、Y 相同
    // this.minY = -104;
    this.maxY = 85;
    this.minX = -138;
    // this.maxX = 186;
  },
  onLoad: function onLoad() {
    this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
    this.btn_close.node.on('click', this.btnClick, this);
    this.bg = this.node.getChildByName("bg");
  },
  start: function start() {},
  btnClick: function btnClick(button) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    this.cardArr.length = 0;
    this.node.active = false;
    this.bg.removeAllChildren();
  },
  /**
   * 对协议 lookoutpool 的数据处理
   * @param {Object} data 
   * @param {Boolean} bool 
   */
  setRecorderData: function setRecorderData(data, bool) {
    if (bool) {
      this.cardArr = [];
      this.bg.removeAllChildren();
    }
    var paiValue = data && data.outs;
    for (var i = 0; i < paiValue.length; i++) {
      var element = paiValue[i].card;
      if (paiValue[i].isPicked == false) {
        this.setValueStrNodePos(element);
      }
    }
    this.node.active = true;
  },
  //设置字符节点的位置，添加到父节点
  setValueStrNodePos: function setValueStrNodePos(value) {
    if (value == 52 || value == 53) {
      return;
    }
    var labNode = cc.instantiate(this.pab_valueStrLab);
    var cradValue = GlobalCfg.ACT_SCENE_CTRL.getPaiNum(value); // 牌的值
    var cradColor = GlobalCfg.ACT_SCENE_CTRL.getPaiType(value); // 牌的花色
    var pos = cc.v2(0, 0),
      str = "";
    switch (cradColor) {
      case "heitao":
        pos.y = this.maxY;
        break;
      case "hongxin":
        pos.y = this.maxY - this.offset * 2;
        break;
      case "meihua":
        pos.y = this.maxY - this.offset * 4;
        break;
      case "fangkuai":
        pos.y = this.maxY - this.offset * 6;
        break;
      default:
        break;
    }
    pos.x = this.minX + cradValue * this.offset;
    switch (cradValue) {
      case 0:
        str = "A";
        break;
      case 12:
        str = "K";
        break;
      case 11:
        str = "Q";
        break;
      case 10:
        str = "J";
        break;
      default:
        str = cradValue + 1;
        break;
    }
    labNode.getComponent(cc.Label).string = str;
    if (this.compareValue(value) == true) {
      pos.y -= this.offset;
    }
    labNode.position = pos;
    this.bg.addChild(labNode);
    this.cardArr.push(value);
  },
  //起牌，删除节点
  pickCrad: function pickCrad(value) {
    if (this.node.active == false) {
      return;
    }
    var children = this.bg.children;
    var removeStr = children[children.length - 1];
    this.bg.removeChild(removeStr);
    removeStr.destroy();
  },
  //出牌，添加节点
  outCard: function outCard(value) {
    if (this.node.active == false) {
      return;
    }
    this.setValueStrNodePos(value);
  },
  /**
   * 有相同值返回 true
   * @param {Number} value 
   * @returns 
   */
  compareValue: function compareValue(value) {
    for (var i = 0; i < this.cardArr.length; i++) {
      var element = this.cardArr[i];
      if (value == element) {
        return true;
      }
    }
    return false;
  }
  // update (dt) {},
});

cc._RF.pop();