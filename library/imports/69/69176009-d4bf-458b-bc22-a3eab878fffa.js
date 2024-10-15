"use strict";
cc._RF.push(module, '69176AJ1L9Fi7wio+q4eP/6', 'RocketRecord');
// rocket/Scripts/RocketRecord.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    prefabPoint: cc.Prefab,
    sprites: [cc.SpriteFrame]
  },
  // onLoad () {},
  start: function start() {// this.node.on("touchstart", () => {
    //     this.node.destroy();
    // }, this);
  },

  /**
   * 初始化走势图
   * @param {Array[Point]} data 
   */
  init: function init(data) {
    this.node.removeAllChildren();
    var dataArray = this.dealData(data);
    this.initPoint(dataArray);
  },

  /**
   * 初始化走势图点
   * @param {Array[[]]} dataArray 
   */
  initPoint: function initPoint(dataArray) {
    this.node.removeAllChildren();
    var data = null;

    if (dataArray.length > 39) {
      data = dataArray.slice(dataArray.length - 39, dataArray.length);
    } else {
      data = dataArray;
    }

    var originalX = -608,
        originalY = 65,
        offsetX = 32,
        offsetY = 32;

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (j >= 5) {
          break;
        }

        var element = data[i][j];
        var posx = originalX + offsetX * i,
            posy = originalY - offsetY * j;
        var node = cc.instantiate(this.prefabPoint);
        node.setPosition(cc.v2(posx, posy));
        node.getComponent(cc.Sprite).spriteFrame = this.getPointSpriteFrame(element.colorType);
        this.node.addChild(node);
      }
    }
  },
  dealData: function dealData(array) {
    var len = array.length;

    for (var index = 0; index < array.length; index++) {
      var element = array[index];

      if (element.mul > 0 && element.mul < 3000) {
        element.colorType = 'green';
      } else if (element.mul >= 3000 && element.mul < 6000) {
        element.colorType = 'blue';
      } else if (element.mul >= 6000 && element.mul < 12000) {
        element.colorType = 'purple';
      } else if (element.mul >= 12000) {
        element.colorType = 'orange';
      }
    } // LoggerUtil.getInstance().log("添加完颜色的数组", array);


    var i = 0,
        j = -1,
        defaultNum = null,
        resultArr = [];

    while (i < len) {
      if (defaultNum != array[i].colorType) {
        defaultNum = array[i].colorType;
        resultArr.push(new Array());
        j++;
        resultArr[j].push(array[i]);
      } else {
        if (resultArr[j].length == 5) {
          resultArr.push(new Array());
          j++;
        }

        resultArr[j].push(array[i]);
      }

      i++;
    }

    return resultArr;
  },
  getPointSpriteFrame: function getPointSpriteFrame(colorType) {
    var sp = null;

    switch (colorType) {
      case 'green':
        sp = this.sprites[0];
        break;

      case 'blue':
        sp = this.sprites[1];
        break;

      case 'purple':
        sp = this.sprites[2];
        break;

      case 'orange':
        sp = this.sprites[3];
        break;

      default:
        break;
    }

    return sp;
  } // update (dt) {},

});

cc._RF.pop();