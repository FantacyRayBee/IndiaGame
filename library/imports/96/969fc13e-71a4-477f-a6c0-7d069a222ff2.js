"use strict";
cc._RF.push(module, '969fcE+caRHf6bAfQaaIi/y', 'SuperDiscountCtrl');
// ResourcesBundle/NewPlan/SuperDiscount/SuperDiscountCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnClose: cc.Button,
    btnShop: cc.Button,
    labBefore: cc.Label,
    labAfter: cc.Label
  },
  ctor: function ctor() {
    this.curData = {};
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    var _this = this;
    this.btnClose.node.on('click', function () {
      _this.node.destroy();
    });
    this.btnShop.node.on('click', function () {
      _this.clickToRecharge("pay");
    });
  },
  /**
   * 
   * @param {String} type 默认 Lobby ，百人游戏 MorePeople，TP_Rummy
   */
  initByType: function initByType(type) {
    GlobalCfg.USER_DATAS.discoList = GlobalCfg.USER_DATAS.discoList.sort(function (a, b) {
      return a.amount - b.amount;
    });
    var getIndexByLastRecharged = function getIndexByLastRecharged(curMax) {
      var index = GlobalCfg.USER_DATAS.discoList.length - 1;
      for (var i = 0; i < GlobalCfg.USER_DATAS.discoList.length; i++) {
        /**
         * amount:number
         * gift:number
         * id:number
         * show:boolean
         */
        var item = GlobalCfg.USER_DATAS.discoList[i];
        if (item.amount > curMax) {
          index = i;
          break;
        }
        ;
      }
      ;
      return index;
    };
    var getIndexByAllRecharged = function getIndexByAllRecharged() {
      var index = -1;
      var all_recharged = GlobalCfg.USER_DATAS.recharged / 100;
      if (all_recharged <= 5000) {
        if (GlobalCfg.USER_DATAS.discoList.length >= 1) {
          index = 0;
        } else {
          index = GlobalCfg.USER_DATAS.discoList.length - 1;
        }
      } else if (all_recharged >= 5001 && all_recharged <= 10000) {
        if (GlobalCfg.USER_DATAS.discoList.length >= 2) {
          index = 1;
        } else {
          index = GlobalCfg.USER_DATAS.discoList.length - 1;
        }
      } else if (all_recharged >= 10001 && all_recharged <= 20000) {
        if (GlobalCfg.USER_DATAS.discoList.length >= 3) {
          index = 2;
        } else {
          index = GlobalCfg.USER_DATAS.discoList.length - 1;
        }
      } else if (all_recharged >= 20001 && all_recharged <= 60000) {
        if (GlobalCfg.USER_DATAS.discoList.length >= 4) {
          index = 3;
        } else {
          index = GlobalCfg.USER_DATAS.discoList.length - 1;
        }
      } else if (all_recharged >= 60001) {
        if (GlobalCfg.USER_DATAS.discoList.length >= 5) {
          index = 4;
        } else {
          index = GlobalCfg.USER_DATAS.discoList.length - 1;
        }
      }
      return index;
    };
    var curIndex = getIndexByLastRecharged(GlobalCfg.USER_DATAS.lastRecharged);
    var curIndex2 = getIndexByAllRecharged();
    curIndex = curIndex2 > curIndex ? curIndex2 : curIndex;
    var defaultIndex = 0;
    if (curIndex > defaultIndex) {
      defaultIndex = curIndex;
    }
    ;
    this.curData = GlobalCfg.USER_DATAS.discoList[defaultIndex];
    if (this.curData) {
      this.setData(Number(this.curData.amount), Number(this.curData.amount) + Number(this.curData.gift));
    } else {
      this.setData(0, 0);
    }
    ;
  },
  setData: function setData(before, after) {
    this.labBefore.string = '₹' + Number(before / 100);
    this.labAfter.string = '₹' + Number(after / 100);
    this.btnShop.target.getChildByName('Label').getComponent(cc.Label).string = '₹' + Number(before / 100);
  },
  // 点击去充值
  clickToRecharge: function clickToRecharge(type) {
    var _this2 = this;
    var arr = SceneManager.getInstance().curSceneType.split("/");
    var curScene = arr[arr.length - 1];
    if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.SSC) {
      curScene = 'ssc';
    }
    ;
    SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.SuperDiscount + "/" + curScene + "/" + type;
    var _cb = function _cb() {
      if (CommonFun.getInstance().isValidForScr(_this2)) {
        _this2.node.destroy();
      }
      ;
    };
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        CommonFun.getInstance().rechargeByCommodityId(this.curData.id, SHOPPING.from, _cb);
      } else {
        CommonFun.getInstance().showBindPhone('AddCash');
      }
      ;
    } else {
      CommonFun.getInstance().rechargeByCommodityId(this.curData.id, SHOPPING.from, _cb);
    }
    ;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT);
  }
});

cc._RF.pop();