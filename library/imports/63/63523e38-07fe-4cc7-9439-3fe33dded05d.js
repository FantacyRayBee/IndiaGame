"use strict";
cc._RF.push(module, '6352344B/5Mx5Q5P+M93tBd', 'recordCtrl');
// sscGame/sscScr/recordCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    pab_winTepy: cc.Prefab,
    node_content: cc.Node,
    node_redDot: cc.Node,
    labs: [cc.Label]
  },
  onLoad: function onLoad() {
    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    }, this);
  },
  setRecordDate: function setRecordDate(notify) {
    var index = 0;
    var posX = 0;
    var recordLen = 0;
    var list = notify.list;
    var unJackpotCount = notify.unJackpotCount;
    this.setLab(list, unJackpotCount);
    var len = list.length <= 55 ? list.length : list.length - 55;
    this.node_content.destroyAllChildren();
    this.node_redDot.destroyAllChildren();

    for (var i = len; i < list.length; i++) {
      var pab_winTepy = cc.instantiate(this.pab_winTepy);
      this.node_content.addChild(pab_winTepy);
      var Ctrl = pab_winTepy.getComponent('winTepyCtrl');
      Ctrl.showNode("record", list[i]);

      if (i == list.length - 1) {
        pab_winTepy.getChildByName("bq_new").active = true;
      }
    }

    if (list.length > 27) {
      //设置红点坐标
      posX = -390;
      recordLen = list.length > 27 ? list.length - 27 : 0;
    } else {
      recordLen = 0;
      posX = 520;
    }

    for (var _i = recordLen; _i < list.length; _i++) {
      var _pab_winTepy = cc.instantiate(this.pab_winTepy);

      this.node_redDot.addChild(_pab_winTepy);

      var _Ctrl = _pab_winTepy.getComponent('winTepyCtrl');

      _Ctrl.showNode("redDot", list[_i]);

      _pab_winTepy.x = posX + index * 35;
      index++;
    }
  },
  setLab: function setLab(list, unJackpotCount) {
    var SET = 0;
    var PURESEQ = 0;
    var SEQ = 0;
    var COLOR = 0;
    var PAIR = 0;
    var HIGHCARD = 0;

    for (var i = 0; i < list.length; i++) {
      var date = list[i];

      if (date == 0) {
        SET++;
      } else if (date == 1) {
        PURESEQ++;
      } else if (date == 2) {
        SEQ++;
      } else if (date == 3) {
        COLOR++;
      } else if (date == 4) {
        PAIR++;
      } else if (date == 5) {
        HIGHCARD++;
      }
    }

    this.labs[0].string = list.length;
    this.labs[1].string = SET;
    this.labs[2].string = PURESEQ;
    this.labs[3].string = SEQ;
    this.labs[4].string = COLOR;
    this.labs[5].string = PAIR;
    this.labs[6].string = HIGHCARD;
    this.labs[7].string = "JACKPOT  " + unJackpotCount + "  DRAWS LEFT";
  }
});

cc._RF.pop();