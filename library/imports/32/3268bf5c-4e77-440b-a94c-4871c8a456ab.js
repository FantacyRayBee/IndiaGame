"use strict";
cc._RF.push(module, '3268b9cTndEC6lMSHHIpFar', 'zooRecordItem');
// zooGame/Scripts/zooRecordItem.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    bgSprite: {
      "default": null,
      type: cc.Sprite,
      tooltip: '背景'
    },
    curSprite: {
      "default": null,
      type: cc.Sprite,
      visible: true
    },
    curSpriteTypeId: {
      get: function get() {
        return this._curSpriteTypeId;
      },
      set: function set(value) {
        if (value < 9) {
          this._curSpriteTypeId = value;
        } else {
          if (value == 12) {
            // 炸弹,全杀
            this._curSpriteTypeId = 9;
          } else if (value == 13) {
            // 宝箱, 全赢
            this._curSpriteTypeId = 10;
          } else if (value == 11) {
            // 金鲨
            this._curSpriteTypeId = 11;
          } else {
            LoggerUtil.getInstance().error("设置的类型ID不正确", value);
          }
        }
      },
      type: cc.Integer,
      tooltip: '当前使用的精灵类型ID'
    },
    spriteFrameList: {
      "default": [],
      type: cc.SpriteFrame,
      tooltip: '精灵列表'
    }
  },
  ctor: function ctor() {
    this._curSpriteTypeId = 0; //默认值

    this.spritesNameObject = {
      0: "shark_01",
      // 鲨鱼
      1: "beast_03",
      // 猴子
      2: "beast_04",
      // 兔子
      3: "beast_01",
      // 狮子
      4: "beast_02",
      // 熊猫
      5: "bird_01",
      // 喜鹊
      6: "bird_02",
      // 白鸽
      7: "bird_04",
      // 孔雀  
      8: "bird_03",
      // 老鹰

      /**  
      9: "Beast",     // 走兽
      10: "Bird",     // 飞禽
       */
      9: "ZD",
      // 炸弹,全杀
      10: "bx",
      // 宝箱, 全赢
      11: "shark_02" // 金鲨鱼

    };
  },
  onLoad: function onLoad() {},
  start: function start() {},
  setData: function setData(data) {
    var spriteType = data;
    this.curSpriteTypeId = spriteType;
    this.curSprite.spriteFrame = this.spriteFrameList[this.curSpriteTypeId];
    this.setNodeContentSize();
  },
  setNodeContentSize: function setNodeContentSize() {
    var spriteName = this.spritesNameObject[this.curSpriteTypeId];

    if (spriteName == "bx" || spriteName == "ZD" || spriteName == "shark_01" || spriteName == "shark_02") {
      var size = this.curSprite.node.getContentSize();
      this.curSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      this.curSprite.node.setContentSize(size.width * 0.75, size.height * 0.75); // this.curSprite.node.setContentSize(size.width, size.height);
    } else {
      this.curSprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
    }
  },
  showBg: function showBg(bool) {
    this.bgSprite.enabled = bool;
  } // LIFE-CYCLE CALLBACKS:
  // update (dt) {},

});

cc._RF.pop();