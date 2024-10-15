"use strict";
cc._RF.push(module, 'f3508XWS1ZGTI38l0uZwQdt', 'TransactionRecordCtrl');
// ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordCtrl.js

"use strict";

var EnumRecord = cc.Enum({
  RECHARGE: 0,
  WITHDRAW: 1
});
cc.Class({
  "extends": cc.Component,
  properties: {
    btn_back: cc.Button,
    btn_tips: cc.Button,
    toggle_recharge: cc.Toggle,
    toggle_withDraw: cc.Toggle,
    scrollView_recharge: cc.ScrollView,
    scrollView_withDraw: cc.ScrollView
  },
  ctor: function ctor() {
    this.rechargeRecordData = null;
    this.withDrawRecordData = null;
  },
  onLoad: function onLoad() {
    this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_tips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.toggle_recharge.node.on("toggle", this.toggleClick, this);
    this.toggle_withDraw.node.on("toggle", this.toggleClick, this);
  },
  start: function start() {
    this.dealToggleRechargeEvent();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORD);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDTIPS);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDHELP);
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case this.btn_back.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnBackEvent();
        break;

      case this.btn_tips.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnTipsEvent();
        break;

      default:
        break;
    }
  },
  toggleClick: function toggleClick(tog) {
    var togName = tog.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    switch (togName) {
      case this.toggle_recharge.node.name:
        this.dealToggleRechargeEvent();
        break;

      case this.toggle_withDraw.node.name:
        this.dealToggleWithDrawEvent();
        break;

      default:
        break;
    }
  },
  dealBtnBackEvent: function dealBtnBackEvent() {
    CommonFun.getInstance().decVerticalAcc();
    this.node.destroy();
  },
  dealBtnTipsEvent: function dealBtnTipsEvent() {
    CommonFun.getInstance().showTransactionRecordTips();
  },
  dealToggleRechargeEvent: function dealToggleRechargeEvent() {
    var _this = this;

    this.scrollView_recharge.node.active = true;
    this.scrollView_withDraw.node.active = false;

    if (this.rechargeRecordData === null) {
      Promise.all([this.getRechargeRecordData(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM)]).then(function (arr) {
        var rechargeList = arr[0];
        var itemPrefab = arr[1];

        if (CommonFun.getInstance().isValidForScr(_this)) {
          _this.rechargeRecordData = _this.sortDate(rechargeList);

          if (Array.isArray(_this.rechargeRecordData) && _this.rechargeRecordData.length > 0) {
            _this.addRecordItems(_this.rechargeRecordData, itemPrefab, _this.scrollView_recharge.content, EnumRecord.RECHARGE);
          }

          ;
        }

        ;
      });
    }

    ;
  },
  dealToggleWithDrawEvent: function dealToggleWithDrawEvent() {
    var _this2 = this;

    this.scrollView_recharge.node.active = false;
    this.scrollView_withDraw.node.active = true;

    if (this.withDrawRecordData === null) {
      Promise.all([this.getWithDrawRecordData(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM)]).then(function (arr) {
        var withDrawList = arr[0];
        var itemPrefab = arr[1];

        if (CommonFun.getInstance().isValidForScr(_this2)) {
          _this2.withDrawRecordData = _this2.sortDate(withDrawList, "TX");
          ;

          if (Array.isArray(_this2.withDrawRecordData) && _this2.withDrawRecordData.length > 0) {
            _this2.addRecordItems(_this2.withDrawRecordData, itemPrefab, _this2.scrollView_withDraw.content, EnumRecord.WITHDRAW);
          }

          ;
        }

        ;
      });
    }

    ;
  },
  getRechargeRecordData: function getRechargeRecordData() {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      if (_this3.rechargeRecordData) {
        resolve(_this3.rechargeRecordData);
        return;
      }

      ;
      CommonFun.getInstance().showProgress();
      var url = GlobalCfg.HTTP_SERVER + "/v1/payment/payment_record/list?page=1&size=20";
      CommonFun.getInstance().httpGet(url, function (msg) {
        CommonFun.getInstance().hidProgress();

        if (msg && msg.result == 0) {
          GlobalCfg.uncleaned = msg.data.uncleaned;
          resolve(msg.data.list);
        } else {
          CommonFun.getInstance().showTips(msg.msg);
        }

        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  sortDate: function sortDate(dataList, str) {
    if (dataList) {
      var created_at = null;
      var date = null;
      var time = null;

      for (var i = 0; i < dataList.length; i++) {
        if (str == "TX") {
          created_at = dataList[i].applytime;
          date = created_at.split("T");
          time = date[1].split("+");
        } else {
          created_at = dataList[i].created_at;
          date = created_at.split("T");
          time = date[1].split("+");
        }

        ;
        var newTime = date[0] + " " + time[0];
        newTime = newTime.substring(0, 19);
        newTime = newTime.replace(/-/g, '/'); //必须把日期'-'转为'/'

        var timestamp = new Date(newTime).getTime();
        dataList[i].timestamp = timestamp;
      }

      return dataList.sort(this.compare("timestamp"));
    } else {
      return [];
    }

    ;
  },
  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    };
  },
  getWithDrawRecordData: function getWithDrawRecordData() {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      if (_this4.withDrawRecordData) {
        resolve(_this4.withDrawRecordData);
        return;
      }

      ;
      CommonFun.getInstance().showProgress();
      var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/take_profit/list";
      var httpParam = {
        "start": "2021-03-27 00:00:00",
        "end": _this4.getCurDate(),
        "page": 1,
        "size": 20
      };
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
        CommonFun.getInstance().hidProgress();

        if (msg.result == 0) {
          resolve(msg.data.list);
        } else {
          CommonFun.getInstance().showTips(msg.msg);
          reject();
        }

        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  getCurDate: function getCurDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day + " 00:00:00";
  },
  addRecordItems: function addRecordItems(arr, itemPrefab, parentNode, recordType) {
    var _this5 = this;

    var children = parentNode.children;

    for (var i = 0, _len = children.length; i < _len; i++) {
      var node = children[i];
      node.destroy();
    }

    ;
    var index = 0;
    var len = arr.length;

    var addItem = function addItem() {
      var recordItemData = arr[index];
      var recordItemNode = cc.instantiate(itemPrefab);
      parentNode.addChild(recordItemNode);
      var ctrl = recordItemNode.getComponent("TransactionRecordItemCtrl");
      ctrl.setTransactionRecordItemData(recordItemData, recordType);
      index += 1;

      if (index == len) {
        _this5.unschedule(addItem);

        return;
      }

      ;
    };

    this.schedule(addItem, 2 / cc.game.getFrameRate(), len - 1, 0);
  }
});

cc._RF.pop();