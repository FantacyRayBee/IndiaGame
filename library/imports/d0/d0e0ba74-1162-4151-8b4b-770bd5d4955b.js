"use strict";
cc._RF.push(module, 'd0e0bp0EWJBUYtLdwvV1JVb', 'andeerActionCtrl');
// andaerGame/andeerScr/andeerActionCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_crad: cc.Prefab
  },
  ctor: function ctor() {
    this.cardPosArr = [cc.v2(-192, 61), cc.v2(192, 61)]; // 左右牌的位置

    this.cardPabArr = []; // 存放牌的数组
  },
  onLoad: function onLoad() {},
  faMidPosCard: function faMidPosCard(cardValue, isTween) {
    if (isTween === void 0) {
      isTween = true;
    }

    var nodePos = cc.v2(0, 61);
    var cardNew = cc.instantiate(this.pab_crad);
    this.cardPabArr.push(cardNew);
    var andeerCardCtrl = cardNew.getComponent('andeerCardCtrl');
    cardNew.scale = 0;
    cardNew.setPosition(0, 215);
    this.node.addChild(cardNew);
    GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("faPai");

    if (!isTween) {
      andeerCardCtrl.setCardInfo(cardValue);
      cardNew.setPosition(nodePos);
      cardNew.scale = 0.85;
    } else {
      cc.tween(cardNew).to(0.3, {
        scale: 0.85,
        position: nodePos,
        angle: -360
      }, {
        easing: "quadOut"
      }).call(function () {
        andeerCardCtrl.setCardInfo(cardValue);
      }).start();
    }

    ;
  },
  faLeftRightPosCard: function faLeftRightPosCard(cardValueArr, isTween, winType) {
    var _this = this;

    if (isTween === void 0) {
      isTween = true;
    }

    if (winType === void 0) {
      winType = null;
    }

    if (!Array.isArray(cardValueArr)) {
      LoggerUtil.getInstance().error("设置左右牌时, 牌值错误!");
      return;
    }

    ;

    if (isTween) {
      console.time("faLeftRightPosCard");
      var index = 0;
      var repeat = cardValueArr.length;
      this.schedule(function () {
        var cardnew = cc.instantiate(_this.pab_crad);

        _this.cardPabArr.push(cardnew);

        var andeerCardCtrl = cardnew.getComponent('andeerCardCtrl');
        cardnew.scale = 0;
        cardnew.setPosition(0, 215);
        var nodePos = _this.cardPosArr[index % 2];

        _this.node.addChild(cardnew);

        GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("faPai");
        cc.tween(cardnew).to(0.3, {
          scale: 0.85,
          position: nodePos,
          angle: -360
        }, {
          easing: "quadOut"
        }).call(function () {
          andeerCardCtrl.setCardInfo(cardValueArr[index]);
          index++;

          if (index == repeat) {
            if (winType == "A" || winType == "B") {
              ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: "AndarDealingCardsEnd",
                msgData: {
                  winType: winType
                }
              });
            }

            console.timeEnd("faLeftRightPosCard");
          }
        }).start();
      }, 0.5, repeat - 1, 0);
    } else {
      for (var i = 0, len = cardValueArr.length; i < len; i++) {
        var cardValue = cardValueArr[i];
        var cardNew = cc.instantiate(this.pab_crad);
        this.cardPabArr.push(cardNew);
        var andeerCardCtrl = cardNew.getComponent('andeerCardCtrl');
        andeerCardCtrl.setCardInfo(cardValue);
        cardNew.scale = 0.85;
        cardNew.setPosition(this.cardPosArr[i % 2]);
        this.node.addChild(cardNew);
      }

      ;
    }
  },
  deleteAllCard: function deleteAllCard() {
    this.unscheduleAllCallbacks();

    for (var i = 0, len = this.cardPabArr.length; i < len; i++) {
      var cardNode = this.cardPabArr[i];
      cardNode && cardNode.destroy();
    }

    ;
    this.cardPabArr = [];
  }
});

cc._RF.pop();