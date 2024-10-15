"use strict";
cc._RF.push(module, 'ccbb8v9f0JLsZHRy/99cXAj', 'GameGifInteractionCtrl');
// ResourcesBundle/NewPlan/GameGifInteraction/GameGifInteractionCtrl.js

"use strict";

var EnumGiftType = cc.Enum({
  Gift1: "Gift1",
  Gift2: "Gift2"
});
cc.Class({
  "extends": cc.Component,
  properties: {
    node_content: cc.Node,
    toggle_all: cc.Toggle,
    toggle_gift1: cc.Toggle,
    toggle_gift2: cc.Toggle
  },
  ctor: function ctor() {
    this.gift1DataArr = [{
      price: 0,
      name: "hd_jidan01"
    }, {
      price: 0,
      name: "hd_mtb01"
    }, {
      price: 1,
      name: "hd_dapao01"
    }, {
      price: 0,
      name: "hd_cangyingpai01"
    }, {
      price: 0,
      name: "hd_shuaibiti01"
    }, {
      price: 0,
      name: "hd_xianbing01"
    }, {
      price: 0,
      name: "hd_bingtong01"
    }, {
      price: 2,
      name: "hd_huojian01"
    }];
    this.gift2DataArr = [{
      price: 0,
      name: "hd_woshou01"
    }, {
      price: 0,
      name: "hd_ganbei01"
    }, {
      price: 1,
      name: "hd_meigui01"
    }, {
      price: 0,
      name: "hd_daocha01"
    }, {
      price: 0,
      name: "puke01_xipai02"
    }, {
      price: 0,
      name: "qf_xishou01"
    }];
    this.targetSeat = -1;
  },
  onLoad: function onLoad() {
    var _this = this;

    this.node.on("click", CommonFun.getInstance().debounce(function () {
      _this.node.destroy();
    }, 1), this);
    this.toggle_gift1.node.on('toggle', this.toggleCallBack, this);
    this.toggle_gift2.node.on('toggle', this.toggleCallBack, this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_GIF_CLICK_ITEM) {
      this.dealGameGifClickItemEvent(notify);
    }
  },
  start: function start() {
    this.addGifItemsByToggleType();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTION);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
  },
  toggleCallBack: function toggleCallBack(toggle) {
    var toggleName = toggle.node.name;
    this.addGifItemsByToggleType();
  },
  addGifItemsByToggleType: function addGifItemsByToggleType() {
    var _this2 = this;

    CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONITEM).then(function (itemPrefab) {
      if (CommonFun.getInstance().isValidForScr(_this2)) {
        var giftDataArr = _this2.toggle_gift1.isChecked ? _this2.gift1DataArr : _this2.gift2DataArr;

        _this2.addGiftItems(giftDataArr, itemPrefab);
      } else {
        itemPrefab.addRef();
        itemPrefab.decRef();
        itemPrefab = null;
      }

      ;
    })["catch"](function (err) {});
  },
  addGiftItems: function addGiftItems(giftDataArr, itemPrefab) {
    var _this3 = this;

    this.unscheduleAllCallbacks();

    for (var i = 0, _len = this.node_content.children.length; i < _len; i++) {
      var node = this.node_content.children[i];
      node.destroy();
    }

    ;

    if (Array.isArray(giftDataArr) == false || giftDataArr.length == 0) {
      return;
    }

    ;
    var len = giftDataArr.length;
    var index = 0;

    var addItem = function addItem() {
      var itemData = giftDataArr[index];
      var itemNode = cc.instantiate(itemPrefab);
      itemNode.active = false;
      var itemCtrl = itemNode.getComponent('GameGifInteractionItemCtrl');
      itemCtrl.setGameGiftItemData(itemData);

      _this3.node_content.addChild(itemNode);

      index += 1;

      if (index == len) {
        _this3.unschedule(addItem);

        return;
      }

      ;
    };

    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  },
  dealGameGifClickItemEvent: function dealGameGifClickItemEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    var itemData = notify.itemData;
    var name = itemData.name;
    var price = itemData.price;
    this.targetSeat = this.toggle_all.isChecked ? -1 : this.targetSeat;
    price = this.targetSeat == -1 ? price * 200 : price * 100;

    if (GlobalCfg.USER_DATAS.userDiamond >= price) {
      GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
        msgType: 2,
        name: name,
        target: this.targetSeat
      });
    } else {
      CommonFun.getInstance().showTips("Insufficient cash to send");
    }

    ;
    this.node.destroy();
  },
  setTargetSeat: function setTargetSeat(seat) {
    this.targetSeat = seat;
  }
});

cc._RF.pop();