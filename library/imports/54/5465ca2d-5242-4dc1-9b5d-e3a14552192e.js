"use strict";
cc._RF.push(module, '5465cotUkJNwZtd46FFUhku', 'selectRoomCtrl');
// ResourcesBundle/NewPlan/SelectRoom/selectRoomCtrl.js

"use strict";

exports.__esModule = true;
exports.btnState = void 0;
var btnState = cc.Enum({
  Grey: 1,
  AddCash: 2,
  EnterGame: 3
});
exports.btnState = btnState;
cc.Class({
  "extends": cc.Component,
  properties: {
    toggle_cash: cc.Toggle,
    toggle_practice: cc.Toggle,
    toggle_teenpatti: cc.Toggle,
    toggle_rummy: cc.Toggle,
    toggle_andar: cc.Toggle,
    toggle_patti3: cc.Toggle,
    toggle_potBlind: cc.Toggle,
    toggle_low: cc.Toggle,
    toggle_mid: cc.Toggle,
    toggle_high: cc.Toggle,
    toggle_player2: cc.Toggle,
    toggle_player6: cc.Toggle,
    node_containerCash: cc.Node,
    node_containerBlind: cc.Node,
    node_containerPlayer: cc.Node,
    node_containerLevel: cc.Node,
    node_containerGame: cc.Node,
    btn_setting: cc.Button,
    btn_add: cc.Button,
    btn_close: cc.Button,
    lab_userDiamond: cc.Label,
    node_gameRoomContent: cc.Node,
    node_titleTeenpatti: cc.Node,
    node_titleRummy: cc.Node,
    node_titleAndar: cc.Node,
    node_headerTeenpatti: cc.Node,
    node_headerRummy: cc.Node,
    node_headerAndar: cc.Node,
    prefab_RoomItem: cc.Prefab
  },
  ctor: function ctor() {
    this.gameRoomInfo = {
      teenpatti: {
        cash: {
          patti3: {
            mid: [],
            low: [],
            high: []
          },
          potBlind: {
            mid: [],
            low: [],
            high: []
          }
        },
        practice: []
      },
      andar: {
        cash: [],
        practice: []
      },
      rummy: {
        cash: {
          player2: [],
          player6: []
        },
        practice: []
      }
    };
    this.updateInterval = 0;
  },
  onLoad: function onLoad() {
    this.initGameRoomInfo();
    this.setBtnToggleClick();
    this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    this.clientMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
  },
  onEnable: function onEnable() {
    this.setOpenModules();
    this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
  },
  update: function update(dt) {
    this.updateInterval += dt;
    if (this.updateInterval >= 1) {
      this.updateInterval = 0;
      this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    }
    ;
  },
  initGameRoomInfo: function initGameRoomInfo() {
    var teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
    teenPattiRoomInfo = teenPattiRoomInfo.sort(function (a, b) {
      return a.entrycondition - b.entrycondition;
    });
    for (var i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
      var roomItem = teenPattiRoomInfo[i];
      var isBlind = roomItem.isblind;
      var isTrial = roomItem.trial;
      var level = roomItem.level;
      if (isTrial) {
        this.gameRoomInfo.teenpatti.practice.push(roomItem);
      } else {
        if (isBlind) {
          if (level == 1) {
            this.gameRoomInfo.teenpatti.cash.potBlind.low.push(roomItem);
          } else if (level == 2) {
            this.gameRoomInfo.teenpatti.cash.potBlind.mid.push(roomItem);
          } else if (level == 3) {
            this.gameRoomInfo.teenpatti.cash.potBlind.high.push(roomItem);
          }
          ;
        } else {
          if (level == 1) {
            this.gameRoomInfo.teenpatti.cash.patti3.low.push(roomItem);
          } else if (level == 2) {
            this.gameRoomInfo.teenpatti.cash.patti3.mid.push(roomItem);
          } else if (level == 3) {
            this.gameRoomInfo.teenpatti.cash.patti3.high.push(roomItem);
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    var rummyRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.rummy;
    var rummy2Count = 0,
      rummy6Count = 0;
    rummyRoomInfo = rummyRoomInfo.sort(function (a, b) {
      return a.entrycondition - b.entrycondition;
    });
    for (var _i = 0, _len = rummyRoomInfo.length; _i < _len; _i++) {
      var _roomItem = rummyRoomInfo[_i];
      var _isTrial = _roomItem.trial;
      var playerNum = _roomItem.num;
      if (_isTrial) {
        this.gameRoomInfo.rummy.practice.push(_roomItem);
      } else {
        if (playerNum == 2) {
          rummy2Count++;
          this.gameRoomInfo.rummy.cash.player2.push(_roomItem);
        } else if (playerNum == 6) {
          rummy6Count++;
          this.gameRoomInfo.rummy.cash.player6.push(_roomItem);
        }
        ;
      }
      ;
    }
    ;
    if (rummy2Count == 0 || rummy6Count == 0) {
      this.toggle_player2.node.active = false;
      this.toggle_player6.node.active = false;
    }
    var andarRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.andarbahar;
    andarRoomInfo = andarRoomInfo.sort(function (a, b) {
      return a.entrycondition - b.entrycondition;
    });
    for (var _i2 = 0, _len2 = andarRoomInfo.length; _i2 < _len2; _i2++) {
      var _roomItem2 = andarRoomInfo[_i2];
      var _isTrial2 = _roomItem2.trial;
      if (_isTrial2) {
        this.gameRoomInfo.andar.practice.push(_roomItem2);
      } else {
        this.gameRoomInfo.andar.cash.push(_roomItem2);
      }
      ;
    }
    ;
  },
  setOpenModules: function setOpenModules() {
    this.btn_setting.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.btn_add.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    if (CommonFun.getInstance().isNeedUpdata("Rummy") == false && (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103))) {
      this.toggle_rummy.node.active = true;
    } else {
      this.toggle_rummy.node.active = false;
    }
    ;
    if (CommonFun.getInstance().isNeedUpdata("tpGame") == false && GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
      this.toggle_teenpatti.node.active = true;
    } else {
      this.toggle_teenpatti.node.active = false;
    }
    ;
    if (CommonFun.getInstance().isNeedUpdata("andaerGame") == false && (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105))) {
      this.toggle_andar.node.active = true;
    } else {
      this.toggle_andar.node.active = false;
    }
    ;
  },
  setBtnToggleClick: function setBtnToggleClick() {
    this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_setting.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.toggle_cash.node.on("toggle", this.toggleClick, this);
    this.toggle_practice.node.on("toggle", this.toggleClick, this);
    this.toggle_teenpatti.node.on("toggle", this.toggleClick, this);
    this.toggle_rummy.node.on("toggle", this.toggleClick, this);
    this.toggle_andar.node.on("toggle", this.toggleClick, this);
    this.toggle_patti3.node.on("toggle", this.toggleClick, this);
    this.toggle_potBlind.node.on("toggle", this.toggleClick, this);
    this.toggle_low.node.on("toggle", this.toggleClick, this);
    this.toggle_mid.node.on("toggle", this.toggleClick, this);
    this.toggle_high.node.on("toggle", this.toggleClick, this);
    this.toggle_player2.node.on("toggle", this.toggleClick, this);
    this.toggle_player6.node.on("toggle", this.toggleClick, this);
  },
  showPointGameRoom: function showPointGameRoom() {
    LoggerUtil.getInstance().log("isNeedShowRoomList : ", window.isNeedShowRoomList);
    if (window.isNeedShowRoomList == "andar") {
      this.toggle_andar.isChecked = true;
    } else if (window.isNeedShowRoomList == "tpGame") {
      this.toggle_teenpatti.isChecked = true;
    } else if (window.isNeedShowRoomList == "rummy") {
      this.toggle_rummy.isChecked = true;
    }
    ;
    this.freshGameRoom();
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.clientMsgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.ENTER_GAME_FROM_SELECT_ROOM) {
      self.dealSelectRoomItemEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.EXIT_GAME) {
      window.isNeedShowRoomList = null;
      if (CommonFun.getInstance().isValidForScr(self)) {
        self.node.destroy();
      }
      ;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO || msgId == GlobalCfg.CLIENT_MSG_ID.GET_RELIEF_REWARD) {
      self.freshGameRoom();
    }
  },
  dealSelectRoomItemEvent: function dealSelectRoomItemEvent(notify) {
    var itemType = notify.itemType;
    var itemData = notify.itemData;
    if (itemType == "rummy") {
      this.dealRummyRoomItemEvent(itemData);
    } else if (itemType == "andar") {
      this.dealAndarRoomItemEvent(itemData);
    } else if (itemType == "teenpatti") {
      this.dealTeenpattiRoomItemEvent(itemData);
    }
  },
  dealRummyRoomItemEvent: function dealRummyRoomItemEvent(itemData) {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_RUMMY_PLAYNOW_BUTTON);
    CommonFun.getInstance().showProgress();
    GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID = itemData.id;
    GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum = itemData.num;
    cc.sys.localStorage.setItem("rummyRoomData", JSON.stringify(itemData));
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.RUMMY);
    CommonFun.getInstance().hideSelectRoom();
    return;
  },
  dealAndarRoomItemEvent: function dealAndarRoomItemEvent(itemData) {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ANDAR_PLAYNOW_BUTTON);
    CommonFun.getInstance().showProgress();
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ANDAER);
    GlobalCfg.SMALL_GAME_DATAS.andeerData.roomID = itemData.id;
    cc.sys.localStorage.setItem("AndeerData", JSON.stringify(itemData));
    CommonFun.getInstance().hideSelectRoom();
  },
  dealTeenpattiRoomItemEvent: function dealTeenpattiRoomItemEvent(itemData) {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_PLAYNOW_BUTTON);
    CommonFun.getInstance().showProgress();
    GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
    CommonFun.getInstance().hideSelectRoom();
    return;
  },
  isAvailableToUpRoom: function isAvailableToUpRoom(gameType) {
    var todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + gameType + "_UpRoom_LocalStorage");
    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        if (showTag != "" + todayZeroTimeStamp) {
          return true;
        } else {
          return false;
        }
        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
        return false;
      }
      ;
    } else {
      return true;
    }
    ;
  },
  updateToUpRoomLocalStorage: function updateToUpRoomLocalStorage(gameType) {
    var todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + gameType + "_UpRoom_LocalStorage");
    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        if (showTag != "" + todayZeroTimeStamp) {
          toastLocalData.showTag = "" + todayZeroTimeStamp;
          cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + gameType + "_UpRoom_LocalStorage", JSON.stringify(toastLocalData));
        }
        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
      }
      ;
    } else {
      var _toastLocalData = {
        showTag: "" + todayZeroTimeStamp
      };
      cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + gameType + "_UpRoom_LocalStorage", JSON.stringify(_toastLocalData));
    }
    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    if (btnName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      window.isNeedShowRoomList = null;
      CommonFun.getInstance().hideSelectRoom();
      return;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_add") {
      CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.SelectRoom);
    } else if (btnName == "btn_setting") {
      CommonFun.getInstance().showSetting();
    }
    ;
  },
  toggleClick: function toggleClick(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var toggleName = toggle.node.name;
    this.freshGameRoom();
  },
  getSmallGameType: function getSmallGameType() {
    if (this.toggle_teenpatti.isChecked) {
      return "teenpatti";
    } else if (this.toggle_rummy.isChecked) {
      return "rummy";
    } else if (this.toggle_andar.isChecked) {
      return "andar";
    } else {
      return "none";
    }
    ;
  },
  getCurrencyType: function getCurrencyType() {
    if (this.toggle_cash.isChecked) {
      return "cash";
    } else if (this.toggle_practice.isChecked) {
      return "practice";
    } else {
      return "none";
    }
    ;
  },
  getBlindType: function getBlindType() {
    if (this.toggle_patti3.isChecked) {
      return "patti3";
    } else if (this.toggle_potBlind.isChecked) {
      return "potBlind";
    } else {
      return "none";
    }
    ;
  },
  freshGameRoom: function freshGameRoom() {
    var _this = this;
    this.roomItemBtnState = [];
    var smallGameType = this.getSmallGameType();
    if (smallGameType == "none") {
      CommonFun.getInstance().showTips("There is currently no game room list data available!");
      return;
    }
    ;
    var currencyType = this.getCurrencyType();
    if (currencyType == "none") {
      CommonFun.getInstance().showTips("There is currently no game room list data available!");
      return;
    }
    ;
    this.node_titleTeenpatti.active = false;
    this.node_titleRummy.active = false;
    this.node_titleAndar.active = false;
    this.node_headerTeenpatti.active = false;
    this.node_headerRummy.active = false;
    this.node_headerAndar.active = false;
    this.node_containerBlind.active = false;
    this.node_containerLevel.active = false;
    this.node_containerPlayer.active = false;
    var smallGameRoomInfo = [];
    var checkToggleCashAndChips = function checkToggleCashAndChips() {
      if (_this.toggle_cash.node.active == true && _this.toggle_practice.node.active == false) {
        _this.toggle_cash.isChecked = true;
        _this.toggle_practice.isChecked = false;
        currencyType = "cash";
      }
      if (_this.toggle_cash.node.active == false && _this.toggle_practice.node.active == true) {
        _this.toggle_cash.isChecked = false;
        _this.toggle_practice.isChecked = true;
        currencyType = "practice";
      }
    };
    if (smallGameType == "teenpatti") {
      this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(100);
      this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(101);
      this.node_titleTeenpatti.active = true;
      this.node_headerTeenpatti.active = true;
      checkToggleCashAndChips();
      smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
      if (currencyType == "cash") {
        this.node_containerBlind.active = true;
        this.node_containerLevel.active = true;
        var blindType = this.getBlindType();
        if (blindType == "none") {
          CommonFun.getInstance().showTips("There is currently no game room list data available!");
          return;
        }
        ;
        var gameRoomInfo = smallGameRoomInfo[blindType];
        var lowArr = gameRoomInfo["low"];
        var midArr = gameRoomInfo["mid"];
        var highArr = gameRoomInfo["high"];
        var curRoomInfo = [];
        if (this.toggle_low.isChecked) {
          curRoomInfo = curRoomInfo.concat(lowArr);
        }
        ;
        if (this.toggle_mid.isChecked) {
          curRoomInfo = curRoomInfo.concat(midArr);
        }
        ;
        if (this.toggle_high.isChecked) {
          curRoomInfo = curRoomInfo.concat(highArr);
        }
        ;
        if (this.toggle_low.isChecked == false && this.toggle_mid.isChecked == false && this.toggle_high.isChecked == false) {
          curRoomInfo = [].concat(lowArr).concat(midArr).concat(highArr);
        }
        ;
        this.addGameRoomItem(curRoomInfo, smallGameType);
      } else if (currencyType == "practice") {
        var _curRoomInfo = [].concat(smallGameRoomInfo);
        this.addGameRoomItem(_curRoomInfo, smallGameType);
      }
      ;
    } else if (smallGameType == "rummy") {
      this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(102);
      this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(103);
      this.node_titleRummy.active = true;
      this.node_headerRummy.active = true;
      checkToggleCashAndChips();
      smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
      if (currencyType == "cash") {
        this.node_containerPlayer.active = true;
        var player2Arr = smallGameRoomInfo["player2"];
        var player6Arr = smallGameRoomInfo["player6"];
        var _curRoomInfo2 = [];
        if (this.toggle_player2.isChecked) {
          _curRoomInfo2 = _curRoomInfo2.concat(player2Arr);
        }
        ;
        if (this.toggle_player6.isChecked) {
          _curRoomInfo2 = _curRoomInfo2.concat(player6Arr);
        }
        ;
        if (this.toggle_player2.isChecked == false && this.toggle_player6.isChecked == false) {
          _curRoomInfo2 = [].concat(player2Arr).concat(player6Arr);
        }
        ;
        this.addGameRoomItem(_curRoomInfo2, smallGameType);
      } else if (currencyType == "practice") {
        var _curRoomInfo3 = [].concat(smallGameRoomInfo);
        this.addGameRoomItem(_curRoomInfo3, smallGameType);
      }
      ;
    } else if (smallGameType == "andar") {
      this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(104);
      this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(105);
      this.node_titleAndar.active = true;
      this.node_headerAndar.active = true;
      checkToggleCashAndChips();
      smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
      var _curRoomInfo4 = [].concat(smallGameRoomInfo);
      this.addGameRoomItem(_curRoomInfo4, smallGameType);
    }
    ;
  },
  addGameRoomItem: function addGameRoomItem(roomList, smallGameType) {
    var _this2 = this;
    if (!Array.isArray(roomList)) {
      return;
    }
    ;
    var children = this.node_gameRoomContent.children;
    for (var i = 0, _len3 = children.length; i < _len3; i++) {
      var node = children[i];
      node.destroy();
    }
    ;
    if (roomList.length == 0) {
      CommonFun.getInstance().showTips("There is currently no game room list data available!");
      return;
    }
    ;
    this.unscheduleAllCallbacks();
    var index = 0;
    var len = roomList.length;
    var addItemFun = function addItemFun() {
      if (index >= len) {
        _this2.unschedule(addItemFun);
        _this2.scrollToHideGrey([].concat(_this2.roomItemBtnState));
        return;
      }
      ;
      var roomItemData = roomList[index];
      var roomItemNode = cc.instantiate(_this2.prefab_RoomItem);
      var roomItemCtrl = roomItemNode.getComponent("selectRoomItemCtrl");
      var currencyType = _this2.getCurrencyType();
      roomItemCtrl.setGameData(roomItemData, {
        gameType: smallGameType,
        toggle: currencyType
      }, function (btnState) {
        var len = _this2.roomItemBtnState.length;
        _this2.roomItemBtnState[len] = btnState;
      });
      _this2.node_gameRoomContent.addChild(roomItemNode);
      index += 1;
    };
    this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
  },
  /**
   * 
   * @param {Array<btnState>} arr 
   */
  scrollToHideGrey: function scrollToHideGrey(arr) {
    var greyCount = 0;
    var roomItemHeight = this.node_gameRoomContent.children[0].height;
    var layout = this.node_gameRoomContent.getComponent(cc.Layout);
    for (var i = 0; i < arr.length; i++) {
      var element = arr[i];
      if (element == btnState.Grey) {
        greyCount += 1;
      }
    }
    if (greyCount == 0) {
      return;
    }
    var offset = greyCount * roomItemHeight + layout.spacingY * (greyCount - 1);
    var scrollNode = this.node_gameRoomContent.parent.parent;
    var scrollView = scrollNode.getComponent(cc.ScrollView);
    var max = scrollView.getMaxScrollOffset();
    if (offset > max.y) {
      scrollView.scrollToBottom(0.1);
    } else {
      scrollView.scrollToOffset(cc.v2(0, offset), 0.1);
    }
  }
});

cc._RF.pop();