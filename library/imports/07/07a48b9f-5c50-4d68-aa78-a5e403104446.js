"use strict";
cc._RF.push(module, '07a48ufXFBNaKp4peQDEERG', 'SmallAddCashCtrl');
// ResourcesBundle/NewPlan/SmallAddCash/SmallAddCashCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btns: [cc.Button],
    lab_cion: cc.Label,
    lab_addCash: cc.Label,
    lab_OtherAmiount: cc.Label
  },
  ctor: function ctor() {
    this.selectCoin = 0;
  },
  onLoad: function onLoad() {
    for (var i = 0, len = this.btns.length; i < len; i++) {
      this.btns[i].node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    }

    ;
    this.lab_addCash.string = "Add Cash";
    this.lab_OtherAmiount.string = "Other Amount>>";
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_addCash" && this.selectCoin != 0) {
      CommonFun.getInstance().showNewShop();
    } else if (btnName == 'btn_otherAmount') {
      CommonFun.getInstance().showNewShop(true);
    }

    this.node.destroy();
  },
  setAddCashCion: function setAddCashCion(gameName, cellScore) {
    var typeUpperCase = gameName ? gameName.toUpperCase() : "";
    LoggerUtil.getInstance().log("setAddCashCion- gameName: " + gameName + ", cellScore: " + cellScore);
    var commodity = CommonFun.getInstance().dealShopList(GlobalCfg.USER_DATAS.userDiamond, GlobalCfg.USER_DATAS.store);
    var coin = commodity[0] ? commodity[0].amount : 0;

    var func = function func(curMax) {
      var index = commodity.length - 1;

      for (var i = 0; i < commodity.length; i++) {
        var item = commodity[i];

        if (item.amount > curMax) {
          index = i;
          break;
        }
      }

      return index;
    };

    var last_recharged = GlobalCfg.USER_DATAS.lastRecharged;
    var curIndex = func(last_recharged);
    coin = commodity[curIndex].amount;

    if (typeUpperCase == "TEENPATTI") {
      var teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti.sort(function (a, b) {
        return a.entrycondition - b.entrycondition;
      });

      for (var i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
        if (teenPattiRoomInfo[i].cellscore == cellScore) {
          var entrycondition = teenPattiRoomInfo[i].entrycondition;

          for (var k = 0, len1 = commodity.length; k < len1; k++) {
            if (commodity[k].amount >= entrycondition) {
              coin = commodity[k].amount;
              break;
            }

            ;
          }

          ;
        }

        ;
      }

      ;
    } else if (typeUpperCase == "RUMMY") {
      var rummyRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.rummy.sort(function (a, b) {
        return a.entrycondition - b.entrycondition;
      });

      for (var _i = 0, _len = rummyRoomInfo.length; _i < _len; _i++) {
        if (rummyRoomInfo[_i].cellscore == cellScore) {
          var _entrycondition = rummyRoomInfo[_i].entrycondition;

          for (var _k = 0, _len2 = commodity.length; _k < _len2; _k++) {
            if (commodity[_k].amount >= _entrycondition) {
              coin = commodity[_k].amount;
              break;
            }

            ;
          }

          ;
        }

        ;
      }

      ;
    }

    ;
    coin = Math.floor(coin / 100);
    this.selectCoin = coin;
    this.lab_cion.string = "\u20B9" + coin;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SMALLADDCASH);
  }
});

cc._RF.pop();