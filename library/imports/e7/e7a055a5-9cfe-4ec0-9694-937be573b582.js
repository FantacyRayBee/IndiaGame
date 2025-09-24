"use strict";
cc._RF.push(module, 'e7a05WlnP5OwJaUk3vlc7WC', 'GameWordInteractionCtrl');
// ResourcesBundle/NewPlan/GameWordInteraction/GameWordInteractionCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    toggle_word: cc.Toggle,
    toggle_face: cc.Toggle,
    scrollView_word: cc.ScrollView,
    scrollView_face: cc.ScrollView
  },
  ctor: function ctor() {
    this.isLoadedWord = false;
    this.isLoadedFace = false;
    this.wordArr = ["Blind khelo", "I won", "Hi all", "Good luck", "It is your day", "Thanks", "Try next time", "Nice game", "Well played", "Kem cho", "Sara"];
    this.faceLimitNum = 24;
    this.targetSeat = -1;
  },
  onLoad: function onLoad() {
    var _this = this;

    this.node.on("click", CommonFun.getInstance().debounce(function () {
      _this.node.destroy();
    }, 1), this);
    this.toggle_word.node.on('toggle', this.toggleCallBack, this);
    this.toggle_face.node.on('toggle', this.toggleCallBack, this);
    this.showContentByToggleType(this.toggle_word.node.name);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONWORDITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONFACEITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTION);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_WORD_CLICK_ITEM) {
      this.dealGameWordClickItemEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_FACE_CLICK_ITEM) {
      this.dealGameFaceClickItemEvent(notify);
    }

    ;
  },
  toggleCallBack: function toggleCallBack(toggle) {
    var toggleName = toggle.node.name;
    this.showContentByToggleType(toggleName);
  },
  showContentByToggleType: function showContentByToggleType(toggleName) {
    if (toggleName == this.toggle_word.node.name) {
      this.scrollView_word.node.active = true;
      this.scrollView_face.node.active = false;

      if (this.isLoadedWord == false) {
        this.loadWordItems();
      }

      ;
      this.isLoadedWord = true;
    } else if (toggleName == this.toggle_face.node.name) {
      this.scrollView_word.node.active = false;
      this.scrollView_face.node.active = true;

      if (this.isLoadedFace == false) {
        this.loadFaceItems();
      }

      ;
      this.isLoadedFace = true;
    }

    ;
  },
  loadWordItems: function loadWordItems() {
    var _this2 = this;

    CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONWORDITEM).then(function (itemPrefab) {
      if (CommonFun.getInstance().isValidForScr(_this2)) {
        _this2.addWordItems(itemPrefab);
      } else {
        itemPrefab.addRef();
        itemPrefab.decRef();
        itemPrefab = null;
      }

      ;
    })["catch"](function (err) {});
  },
  addWordItems: function addWordItems(itemPrefab) {
    var _this3 = this;

    var len = this.wordArr.length;
    var index = 0;

    var addItem = function addItem() {
      var word = _this3.wordArr[index];
      var itemNode = cc.instantiate(itemPrefab);
      var itemCtrl = itemNode.getComponent('GameWordInteractionWordItemCtrl');
      itemCtrl.setWordItemContent(word);

      _this3.scrollView_word.content.addChild(itemNode);

      index += 1;

      if (index == len) {
        _this3.unschedule(addItem);

        return;
      }

      ;
    };

    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  },
  loadFaceItems: function loadFaceItems() {
    var _this4 = this;

    CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONFACEITEM).then(function (itemPrefab) {
      if (CommonFun.getInstance().isValidForScr(_this4)) {
        _this4.addFaceItems(itemPrefab);
      } else {
        itemPrefab.addRef();
        itemPrefab.decRef();
        itemPrefab = null;
      }

      ;
    })["catch"](function (err) {});
  },
  addFaceItems: function addFaceItems(itemPrefab) {
    var _this5 = this;

    var len = this.faceLimitNum;
    var index = 0;

    var addItem = function addItem() {
      var faceName = index + 1;
      var itemNode = cc.instantiate(itemPrefab);
      var itemCtrl = itemNode.getComponent('GameWordInteractionFaceItemCtrl');
      itemCtrl.setFaceItemFaceName(faceName);

      _this5.scrollView_face.content.addChild(itemNode);

      index += 1;

      if (index == len) {
        _this5.unschedule(addItem);

        return;
      }

      ;
    };

    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  },
  setTargetSeat: function setTargetSeat(targetSeat) {
    this.targetSeat = targetSeat;
  },
  dealGameWordClickItemEvent: function dealGameWordClickItemEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    var itemData = notify.itemData;
    var name = itemData.name; // 0短语 1表情 2礼物

    GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
      msgType: 0,
      name: "" + name,
      target: this.targetSeat
    });
    this.node.destroy();
  },
  dealGameFaceClickItemEvent: function dealGameFaceClickItemEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    var itemData = notify.itemData;
    var name = itemData.name; // 0短语 1表情 2礼物

    GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
      msgType: 1,
      name: "" + name,
      target: this.targetSeat
    });
    this.node.destroy();
  }
});

cc._RF.pop();