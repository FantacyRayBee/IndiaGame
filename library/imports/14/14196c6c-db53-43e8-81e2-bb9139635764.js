"use strict";
cc._RF.push(module, '14196xs21ND6IHiu5E5Y1dk', 'winningHistoryCtrll');
// baccarat3PattiGame/src/winningHistoryCtrll.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    pab_cradType: cc.Node,
    node_cradType: cc.Node,
    node_BlueRed: cc.Node,
    lab_red: cc.Label,
    lab_blue: cc.Label,
    lab_redNun: cc.Label,
    lab_blueNun: cc.Label,
    node_blue: cc.Node,
    sprites: [cc.SpriteFrame]
  },
  onLoad: function onLoad() {
    var _this = this;

    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();

      _this.node.destroy();
    }, this);
    this.setCradType();
    this.setBlueRed();
    this.redORblue();
  },

  /**
   * 设置牌的类型记录
   */
  setCradType: function setCradType() {
    var openRecord = GlobalCfg.ACT_SCENE_CTRL.openRecord,
        list = [];
    var len = openRecord.length;

    if (len <= 60) {
      list = openRecord.slice();
    } else {
      list = openRecord.slice(len - 60, len);
    }

    ;

    for (var i = 0; i < list.length; i++) {
      var side = list[i];
      var pab_cradType = cc.instantiate(this.pab_cradType);
      pab_cradType.parent = this.node_cradType;
      var SET = pab_cradType.getChildByName("SET");
      SET.active = true;
      SET.getComponent(cc.Sprite).spriteFrame = this.sprites[side];

      if (side == 5) {
        var bg_hige = pab_cradType.getChildByName("bg_hige");
        if (bg_hige) bg_hige.active = true;
      } else {
        var bg_cradType = pab_cradType.getChildByName("bg_cradType");
        if (bg_cradType) bg_cradType.active = true;
      }

      ;

      if (i == list.length - 1) {
        var bq_new = pab_cradType.getChildByName("bq_new");
        if (bq_new) bq_new.active = true;
      }
    }
  },

  /**
   * 设置红蓝记录
   */
  setBlueRed: function setBlueRed() {
    //33
    var list = GlobalCfg.ACT_SCENE_CTRL.openBlueRed;
    var newList = this.reorganizeOpenBlueRed(list);
    var count = 0;
    var newListLen = newList.length;

    for (var i = 0; i < newListLen; i++) {
      var sideArr = newList[i];
      var posX = 0;
      var posY = 0;

      for (var k = 0, len = sideArr.length; k < len; k++) {
        posX = -472 + i * 29;
        posY = 72 + k * -29;
        var side = sideArr[k];
        var node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
        node.setPosition(cc.v2(posX, posY));
        this.node_BlueRed.addChild(node);
      }

      ;
    }

    ; // for (let i = newListLen - 1; i >= 0; i--) {
    //     let sideArr = newList[i];
    //     let len = sideArr.length;
    //     let posX = 0;
    //     let posY = 0;
    //     if (len >= 6 && len <= 8) {
    //         for (let j = len -1; j >= 0; j--) {
    //             if (j > 5) {
    //                 posX = 455 - count * 29;
    //                 posY = -72;
    //                 count++
    //             }
    //             else {
    //                 posX = 455 - count * 29;
    //                 posY = 73 + j * (-29);
    //             };
    //             let side = sideArr[j];
    //             let node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
    //             node.parent = this.node_BlueRed;
    //             node.setPosition(posX,posY);
    //         }
    //         count++
    //     }
    //     else {
    //         for (let j = 0; j < len; j++) {
    //             posX = 455 - count * 29;
    //             posY = 73 + j * (-29);
    //             let side = sideArr[j];
    //             let node = GlobalCfg.ACT_SCENE_CTRL.utils.installWinIcon(side);
    //             node.parent = this.node_BlueRed;
    //             node.setPosition(posX,posY);
    //         }
    //         count++
    //     }
    // }
  },

  /**
   * 红蓝比
   */
  redORblue: function redORblue() {
    var list = GlobalCfg.ACT_SCENE_CTRL.openBlueRed;
    var count = 0;

    for (var i = 0; i < list.length; i++) {
      var date = list[i];

      if (date == 6) {
        count++;
      }
    }

    this.lab_red.string = count + "%";
    this.lab_blue.string = 100 - count + "%";
    this.node_blue.scaleX = (100 - count) / 100;
    this.lab_redNun.string = "red  \uFF1A" + count;
    this.lab_blueNun.string = "blue  \uFF1A" + (100 - count);
  },

  /**
   * 剔除牌型保留红蓝类型
   * @param {所有牌型} list 
   * @returns 
   */
  splitBlueRed: function splitBlueRed(list) {
    var allArr = [],
        redArr = [],
        blueArr = [];
    var cutArrCount = 33;

    for (var i = 0; i < list.length; i++) {
      var side = list[i];

      if (side == 6) {
        blueArr.push(side);

        if (redArr.length > 0) {
          allArr.push(redArr);
          redArr = [];
        }

        if (blueArr.length == 8) {
          allArr.push(blueArr);
          blueArr.length = 0;
        }
      } else {
        redArr.push(side);

        if (blueArr.length > 0) {
          allArr.push(blueArr);
          blueArr = [];
        }

        if (redArr.length == 8) {
          allArr.push(redArr);
          redArr.length = 0;
        }
      }

      ;

      if (i == list.length - 1) {
        if (blueArr.length > 0) {
          allArr.push(blueArr);
        }

        if (redArr.length > 0) {
          allArr.push(redArr);
        }
      }
    }

    ;

    if (allArr.length > cutArrCount) {
      return allArr.slice(allArr.length - cutArrCount, allArr.length);
    } else {
      return allArr;
    }
  },
  reorganizeOpenBlueRed: function reorganizeOpenBlueRed(list) {
    if (!Array.isArray(list)) {
      return [];
    }

    ;
    var allArr = [];
    var redArr = [];
    var blueArr = [];

    for (var i = 0, len = list.length; i < len; i++) {
      var side = list[i];

      if (side == 6) {
        blueArr.push(side);

        if (blueArr.length == 6) {
          allArr.push(blueArr);
          blueArr = [];
        }

        ;

        if (redArr.length > 0) {
          allArr.push(redArr);
          redArr = [];
        }

        ;

        if (i == len - 1 && blueArr.length > 0) {
          allArr.push(blueArr);
        }

        ;
      } else if (side == 7) {
        redArr.push(side);

        if (redArr.length == 6) {
          allArr.push(redArr);
          redArr = [];
        }

        ;

        if (blueArr.length > 0) {
          allArr.push(blueArr);
          blueArr = [];
        }

        ;

        if (i == len - 1 && redArr.length > 0) {
          allArr.push(redArr);
        }

        ;
      }

      ;
    }

    ;
    var maxCount = 33;

    if (allArr.length > maxCount) {
      return allArr.slice(allArr.length - maxCount, allArr.length);
    } else {
      return allArr;
    }

    ;
  }
});

cc._RF.pop();