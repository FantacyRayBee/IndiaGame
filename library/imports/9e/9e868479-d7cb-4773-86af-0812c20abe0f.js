"use strict";
cc._RF.push(module, '9e868R518tHc4avCBLCCr4P', 'VipLuckyDrawCtrl');
// ResourcesBundle/NewPlan/MyVip/VipLuckyDrawCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_spin: cc.Button,
    btn_reduce: cc.Button,
    btn_add: cc.Button,
    lab_spinLeft: cc.Label,
    lab_selectSpinNum: cc.Label,
    node_content: cc.Node,
    spine_niuDan: sp.Skeleton,
    spine_poDan: sp.Skeleton,
    prefab_item: cc.Prefab
  },
  ctor: function ctor() {
    this.niuDanSkinArr = ["qiu1", "qiu2", "qiu3", "qiu4", "qiu5", "qiu6", "qiu7"];
    this.selectSpinNum = 0;
    this.customMsgEventHandle = null;
    this.isPlayingNiuDan = false;
  },
  onLoad: function onLoad() {
    this.spine_niuDan.setSkin("default");
    this.spine_niuDan.animation = null;
    this.spine_poDan.setSkin("default");
    this.spine_poDan.animation = null;
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_spin.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_reduce.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  start: function start() {
    this.setItems();
    this.setSpinLeft();
    this.setSelectSpinNum(GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPLUCKYDRAW);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
      self.setSpinLeft();
    }

    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnCloseEvent();
        return;

      case "btn_spin":
        this.dealBtnSpinEvent();
        break;

      case "btn_reduce":
        this.dealBtnReduceEvent();
        break;

      case "btn_add":
        this.dealBtnAddEvent();
        break;

      default:
        break;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealBtnReduceEvent: function dealBtnReduceEvent() {
    this.setSelectSpinNum(this.selectSpinNum - 1);
  },
  dealBtnAddEvent: function dealBtnAddEvent() {
    this.setSelectSpinNum(this.selectSpinNum + 1);
  },
  setItems: function setItems() {
    var _this = this;

    var index = 0;
    var len = GlobalCfg.USER_DATAS.gacha.length;

    var addItemFun = function addItemFun() {
      if (index >= len) {
        _this.unschedule(addItemFun);

        return;
      }

      ;
      var itemData = GlobalCfg.USER_DATAS.gacha[index];
      var itemNode = cc.instantiate(_this.prefab_item);
      var scr = itemNode.getComponent("VipLuckyDrawItemCtrl");
      scr.setVipLuckyDrawItemData(itemData);

      _this.node_content.addChild(itemNode);

      index += 1;
    };

    this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
  },
  setSelectSpinNum: function setSelectSpinNum(spinNum) {
    var miniSpinNum = GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0;

    if (spinNum <= miniSpinNum) {
      this.selectSpinNum = miniSpinNum;
      this.btn_reduce.interactable = false;
      this.btn_reduce.enableAutoGrayEffect = true;
    } else {
      this.selectSpinNum = spinNum;
      this.btn_reduce.interactable = true;
      this.btn_reduce.enableAutoGrayEffect = false;
    }

    ;

    if (spinNum >= GlobalCfg.USER_DATAS.userVip.gacha_quota) {
      this.selectSpinNum = GlobalCfg.USER_DATAS.userVip.gacha_quota;
      this.btn_add.interactable = false;
      this.btn_add.enableAutoGrayEffect = true;
    } else {
      this.selectSpinNum = spinNum;
      this.btn_add.interactable = true;
      this.btn_add.enableAutoGrayEffect = false;
    }

    ;
    this.lab_selectSpinNum.string = this.selectSpinNum;
  },
  setSpinLeft: function setSpinLeft() {
    this.lab_spinLeft.string = GlobalCfg.USER_DATAS.userVip.gacha_quota;
  },
  dealBtnSpinEvent: function dealBtnSpinEvent() {
    var _this2 = this;

    if (this.selectSpinNum == 0) {
      CommonFun.getInstance().showTips("Insufficient number of lucky");
      return;
    }

    ;

    if (GlobalCfg.USER_DATAS.userVip.gacha_quota <= 0) {
      CommonFun.getInstance().showTips("Insufficient number of lucky");
      return;
    }

    ;

    if (this.selectSpinNum > GlobalCfg.USER_DATAS.userVip.gacha_quota) {
      CommonFun.getInstance().showTips("Exceeded the number of lucky times");
      return;
    }

    ;

    if (this.isPlayingNiuDan) {
      return;
    }

    ;
    this.isPlayingNiuDan = true;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/gacha";
    var httpParam = {
      count: this.selectSpinNum
    };
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (strInfo) {
      if (strInfo && strInfo.data) {
        var takeArr = strInfo.data.take ? strInfo.data.take : [];

        if (CommonFun.getInstance().isValidForScr(_this2)) {
          GlobalCfg.USER_DATAS.userVip.gacha_quota -= _this2.selectSpinNum;

          _this2.setSpinLeft();

          _this2.setSelectSpinNum(GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0);

          _this2.playNiuDanAnimation(takeArr);
        }

        ;
      } else {
        _this2.isPlayingNiuDan = false;
        CommonFun.getInstance().showTips(strInfo.msg);
      }

      ;
    }, function () {
      _this2.isPlayingNiuDan = false;
    }, GlobalCfg.USER_DATAS.BearerToken);
  },
  playNiuDanAnimation: function playNiuDanAnimation(takeArr) {
    var _this3 = this;

    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/btnNiu", false);
    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/qiuNiu", false);
    var randomIndex = Math.floor(Math.random() * this.niuDanSkinArr.length);
    var randomSkin = this.niuDanSkinArr[randomIndex];
    LoggerUtil.getInstance().log("Default Skin: ", randomSkin);
    this.spine_niuDan.setCompleteListener(function () {
      if (CommonFun.getInstance().isValidForScr(_this3)) {
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/qiuOut", false);

        _this3.spine_niuDan.setSkin("default");

        _this3.spine_niuDan.animation = null;

        _this3.spine_poDan.setSkin(randomSkin);

        _this3.spine_poDan.setAnimation(0, "animation", false);
      }

      ;
    });
    this.spine_poDan.setCompleteListener(function () {
      if (CommonFun.getInstance().isValidForScr(_this3)) {
        _this3.spine_poDan.setSkin("default");

        _this3.spine_poDan.animation = null;
        _this3.isPlayingNiuDan = false;

        for (var i = 0, len = takeArr.length; i < len; i++) {
          var element = takeArr[i];
          var id = element.id;
          var amount = element.amount;

          if (id == 10) {
            GlobalCfg.USER_DATAS.deposit += amount;
            GlobalCfg.USER_DATAS.userDiamond += amount;
            CommonFun.getInstance().showVipRewardToast(amount / 100, false);
          } else if (id == 11) {
            GlobalCfg.USER_DATAS.winnings += amount;
            GlobalCfg.USER_DATAS.userDiamond += amount;
            CommonFun.getInstance().showVipRewardToast(amount / 100, false);
          } else if (id == 12) {
            GlobalCfg.USER_DATAS.bonus += amount;
            CommonFun.getInstance().showVipRewardToast(amount / 100, true);
          }

          ;
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
            msgData: {}
          });
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
            msgData: {}
          });
        }

        ;
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_REWARD,
          msgData: {}
        });
      }

      ;
    });
    this.spine_niuDan.setSkin(randomSkin);
    this.spine_niuDan.setAnimation(0, "animation", false);
  }
});

cc._RF.pop();