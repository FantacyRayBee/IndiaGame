"use strict";
cc._RF.push(module, '9d2d8X0hNRL+InYndyGG15x', 'BankruptcyGiftCtrl');
// ResourcesBundle/NewPlan/BankruptcyGift/BankruptcyGiftCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnClose: {
      "default": null,
      type: cc.Button
    },
    item1: {
      "default": null,
      type: cc.Node
    },
    item2: {
      "default": null,
      type: cc.Node
    }
  },
  // onLoad () {},
  start: function start() {
    var _this = this;
    this.btnClose.node.on('click', function () {
      _this.node.destroy();
    });
  },
  update: function update(dt) {},
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT);
    GlobalCfg.IS_SHOW_BANKRUPT = false; //破产界面关闭时 置为false
  },

  /**
   * 获取当前低商品 Index 通过用户总充值金额
   * @param {Array<PaymentProduct>} arr 
   * @param {Number} allRecharged 
   */
  getLowerOptionIndexByAllRecharge: function getLowerOptionIndexByAllRecharge(arr, allRecharged) {
    var index = -1;
    var all_recharged = allRecharged / 100;
    var putAmount = 300;
    if (all_recharged <= 5000) {
      putAmount = 300;
    } else if (all_recharged <= 10000) {
      putAmount = 500;
    } else if (all_recharged <= 20000) {
      putAmount = 1000;
    } else {
      putAmount = 2000;
    }
    for (var i = 0; i < arr.length; i++) {
      var element = arr[i];
      if (element && element.amount == putAmount * 100) {
        index = i;
        break;
      }
    }
    return index;
  },
  /**
   * 获取当前低商品 Index 通过用户最后一次充值金额
   * @param {*} arr 
   * @param {*} lastRecharged 
   * @returns 
   */
  getLowerOptionIndexByLastRecharge: function getLowerOptionIndexByLastRecharge(arr, lastRecharged) {
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
      var element = arr[i];
      if (element && element.amount > lastRecharged) {
        index = i;
        break;
      }
      if (i == arr.length - 1) {
        index = arr.length - 1;
      }
    }
    return index;
  },
  /**
   * 
   * @param {Array<PaymentProduct>} options 
   * message PaymentProduct {
          int32 id = 1;       // 商品ID(支付接口用)
          int32 amount = 2;   // 金额
          int32 add = 3;      // 额外赠送-dep
          int32 bonus = 4;    // 额外赠送-bonus
          bool plot = 5;      // 暂无意义，默认false
      }
   */
  init: function init(isPLotPlay) {
    var list = GlobalCfg.USER_DATAS.discoList;
    if (isPLotPlay) {
      //需要处理一下数据
      var winRate = cc.sys.localStorage.getItem("TP_winRate", 0);
      list = this.dealData(GlobalCfg.USER_DATAS.plotPay, winRate);
    }
    list = list.sort(function (a, b) {
      return a.amount - b.amount;
    });
    LoggerUtil.getInstance().log('3 dealData list:', list);
    var options = [].concat(list);
    var curIndex = this.getLowerOptionIndexByLastRecharge(options, GlobalCfg.USER_DATAS.lastRecharged);
    var curIndex2 = this.getLowerOptionIndexByAllRecharge(options, GlobalCfg.USER_DATAS.recharged);
    curIndex = curIndex2 > curIndex ? curIndex2 : curIndex;
    LoggerUtil.getInstance().log('4 dealData options:', options);
    if (curIndex + 2 >= options.length) {
      curIndex2 = options.length - 1;
    } else {
      curIndex2 = curIndex + 2;
    }
    if (curIndex == options.length - 1) {
      curIndex -= 1;
    }
    var option_1 = options[curIndex];
    var option_2 = options[curIndex2];
    this.initItem(option_1, this.item1);
    this.initItem(option_2, this.item2);
  },
  initItem: function initItem(data, node) {
    var _this2 = this;
    if (!data) {
      LoggerUtil.getInstance().error('BankruptcyGiftCtrl.initItem Data error');
      this.node.destroy();
      return;
    }
    var id = data.id;
    var cash = data.amount;
    var extraCash = data.add;
    var bonus = data.bonus;
    var rate = Math.round((extraCash + bonus) * 100 / cash);
    var labelRate = node.getChildByName('LabelRate').getComponent(cc.Label);
    var labelCash = node.getChildByName('LabelCash').getComponent(cc.Label);
    var labelExtraCash = node.getChildByName('LabelExtraCash').getComponent(cc.Label);
    var labelBonus = node.getChildByName('LabelBonus').getComponent(cc.Label);
    var labelTotalGet = node.getChildByName('LabelTotalGet').getComponent(cc.Label);
    var button = node.getChildByName('Button').getComponent(cc.Button);
    var buttonLabelNum = button.node.getChildByName('LabelNum').getComponent(cc.Label);
    labelRate.string = rate + '%';
    labelCash.string = Math.round(cash / 100);
    labelExtraCash.string = Math.round(extraCash / 100);
    labelBonus.string = Math.round(bonus / 100);
    labelTotalGet.string = Math.round((cash + extraCash + bonus) / 100);
    buttonLabelNum.string = Math.round(cash / 100);
    button.node.on('click', function () {
      var callback = function callback() {
        CommonFun.getInstance().rechargeByCommodityId(id, GlobalCfg.SHOP_RECHARGE_FROM.BankruptcyGift, function () {
          button.node.off('click');
          _this2.node.destroy();
        }, GlobalCfg.PAY_CHANNEL);
      };
      var data1 = {
        price: Math.round((data.amount + data.add) / 100),
        bonus: Math.round(data.bonus / 100)
      };
      CommonFun.getInstance().showPayChannel(data1, callback);
    });
  },
  dealData: function dealData(data, winRate) {
    LoggerUtil.getInstance().log('1 dealData data:', data);
    if (!Array.isArray(data)) return []; // 防御：非数组直接返回空数组
    var tmp = JSON.parse(JSON.stringify(data)); // 深拷贝
    var ret = [];
    if (winRate == 1) {
      for (var i = 0; i < tmp.length; i++) {
        if (i > 0) {
          // 跳过第一个元素（如需保留全部元素，移除此判断）
          ret.push(tmp[i]); // 将元素推入数组
        }
      }
    } else {
      for (var _i = 0; _i < tmp.length - 1; _i++) {
        ret.push(tmp[_i]); // 将元素推入数组
      }
    }

    LoggerUtil.getInstance().log('2 dealData ret:', ret);
    return ret; // 返回数组
  }
});

cc._RF.pop();