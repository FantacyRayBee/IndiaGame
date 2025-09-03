"use strict";
cc._RF.push(module, '7707d2caVNOVaIt9iLGj2kL', 'ActivitySignCtrl');
// ResourcesBundle/NewPlan/Activity/ActivitySignCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_sign: cc.Button,
    lab_day7: cc.Label,
    lab_day7Reward: cc.Label,
    node_day7Signed: cc.Node,
    node_day7Unsigned: cc.Node
  },
  ctor: function ctor() {
    this.itemPosArr = [cc.v2(-90, 55), cc.v2(7, 55), cc.v2(100, 55), cc.v2(-90, -75), cc.v2(7, -75), cc.v2(100, -75), cc.v2(85, -77)];
    this.signItemCtrlMap = new Map();
  },
  onLoad: function onLoad() {
    this.btn_sign.node.on('click', CommonFun.getInstance().debounce(this.onSignClick, 1), this);
    this.btn_sign.node.active = false;
    this.node_day7Signed.active = false;
    this.node_day7Unsigned.active = false;
  },
  start: function start() {
    var _this = this;
    Promise.all([this.getSignList(), this.getSignItemPrefab()]).then(function (arr) {
      _this.setSignListItem(arr);
    })["catch"](function (err) {
      LoggerUtil.getInstance().error(err);
    });
  },
  onSignClick: function onSignClick() {
    var _this2 = this;
    var timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
    if (GlobalCfg.USER_DATAS.userVip.level == false || GlobalCfg.USER_DATAS.userVip.level == 0 || GlobalCfg.USER_DATAS.userVip.level > 0 && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time) {
      GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
      var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/sign";
      CommonFun.getInstance().httpPost(httpUrl, {}, function (msg) {
        if (msg.result == 0 && msg.data) {
          var data = msg.data;
          if (data && CommonFun.getInstance().isValidForScr(_this2)) {
            CommonFun.getInstance().showRewardsTips([{
              id: 10,
              amount: data.gift / 100
            }]);
            if (GlobalCfg.USER_DATAS.signInfo) {
              GlobalCfg.USER_DATAS.signInfo.today = data.today;
              GlobalCfg.USER_DATAS.signInfo.done = true;
            }
            ;
            if (_this2.signItemCtrlMap.has(data.today)) {
              var signItemCtrl = _this2.signItemCtrlMap.get(data.today);
              signItemCtrl.setSignItemSigned();
            }
            ;
            if (data.today == 7) {
              _this2.node_day7Signed.active = true;
              _this2.node_day7Unsigned.active = false;
            }
            ;
            _this2.btn_sign.interactable = false;
            _this2.btn_sign.enableAutoGrayEffect = true;
          }
          ;
        } else {
          CommonFun.getInstance().showTips(msg.msg);
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    } else {
      CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', function () {
        CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
      }, false);
    }
  },
  getSignList: function getSignList() {
    return new Promise(function (resolve, reject) {
      if (GlobalCfg.USER_DATAS.signInfo != null) {
        resolve(GlobalCfg.USER_DATAS.signInfo);
        return;
      }
      ;
      var url = GlobalCfg.HTTP_SERVER + "/v1/signlist";
      CommonFun.getInstance().httpGet(url, function (strInfo) {
        if (strInfo.result == 0) {
          GlobalCfg.USER_DATAS.signInfo = strInfo.data;
          resolve(GlobalCfg.USER_DATAS.signInfo);
        } else {
          CommonFun.getInstance().showTips(strInfo.msg);
          reject(strInfo.msg);
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  getSignItemPrefab: function getSignItemPrefab() {
    return new Promise(function (resolve, reject) {
      var prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYSIGNITEM;
      var arr = prefabPath.split("/");
      var bundleName = arr[0];
      var path = prefabPath.substring(bundleName.length + 1);
      CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
        bundle.load(path, cc.Prefab, function (error, prefab) {
          if (!error) {
            resolve(prefab);
          } else {
            reject(error);
          }
          ;
        });
      }, function (err) {
        reject(err);
      });
    });
  },
  setSignListItem: function setSignListItem(arr) {
    var _this3 = this;
    if (!Array.isArray(arr)) {
      return;
    }
    ;
    var signData = arr[0];
    var itemPrefab = arr[1];
    if (!itemPrefab) {
      return;
    }
    ;
    if (!signData) {
      LoggerUtil.getInstance().log("No check-in data available");
      return;
    }
    ;
    if (!signData.gifts || !Array.isArray(signData.gifts)) {
      LoggerUtil.getInstance().log("The check-in list data is empty or not in array format");
      return;
    }
    ;
    if (signData.gifts.length != 7) {
      LoggerUtil.getInstance().log("Check in list data length error");
      return;
    }
    ;
    var len = signData.gifts.length;
    var index = 0;
    var addSignItem = function addSignItem() {
      var gift = signData.gifts[index];
      if (index <= 5) {
        var signItemPos = _this3.itemPosArr[index];
        var signItemNode = cc.instantiate(itemPrefab);
        signItemNode.scale = 0.862;
        var activitySignItemCtrl = signItemNode.getComponent("ActivitySignItemCtrl");
        if (activitySignItemCtrl) {
          activitySignItemCtrl.setSignItemData(gift, signData.today, signData.done, index + 1);
          _this3.signItemCtrlMap.set(index + 1, activitySignItemCtrl);
        }
        ;
        signItemNode.name = "signItemDay" + (index + 1);
        signItemNode.setPosition(signItemPos);
        _this3.node.addChild(signItemNode);
      } else if (index == 6) {
        _this3.lab_day7.string = "Day7";
        _this3.lab_day7Reward.string = "\u20B9" + gift / 100;
        if (signData.today > 7) {
          _this3.node_day7Signed.active = true;
          _this3.node_day7Unsigned.active = false;
        } else if (signData.today == 7 && signData.done == true) {
          _this3.node_day7Signed.active = true;
          _this3.node_day7Unsigned.active = false;
        } else if (signData.today == 7 && signData.done == false) {
          _this3.node_day7Signed.active = false;
          _this3.node_day7Unsigned.active = true;
        } else {
          _this3.node_day7Signed.active = false;
          _this3.node_day7Unsigned.active = false;
        }
        ;
      }
      ;
      index += 1;
      if (index == len) {
        _this3.btn_sign.node.active = true;
        if (signData.done == true) {
          _this3.btn_sign.interactable = false;
          _this3.btn_sign.enableAutoGrayEffect = true;
        }
        ;
        _this3.unschedule(addSignItem);
        return;
      }
      ;
    };
    this.schedule(addSignItem, 2 / cc.game.getFrameRate(), len - 1, 0);
  }
});

cc._RF.pop();