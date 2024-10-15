"use strict";
cc._RF.push(module, '81aaaZeoV5PTJqlzq4voH0V', 'zeusLeftAreaCtrl');
// zeusGame/src/zeusLeftAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_statusNoFree: cc.Node,
    node_statusFree: cc.Node,
    node_records: cc.Node,
    btn_buyFree: cc.Button,
    lab_freePrice: cc.Label,
    lab_multiPrice: cc.Label,
    tog_doubleMulti: cc.Toggle,
    node_notPurchased: cc.Node,
    node_purchased: cc.Node,
    lab_freeAllMulti: cc.Label,
    lab_freeAllMultiX: cc.Label,
    lab_freeCount: cc.Label,
    node_itemsParent: cc.Node,
    node_item: cc.Node
  },
  ctor: function ctor() {
    this.addRecordItemInterval = 0.2;
    this.freeCount = 0;
    this.itemNodeStartPos = cc.v2(0, 105);
    this.itemNodePosArr = [cc.v2(0, -70), cc.v2(0, -35), cc.v2(0, 0), cc.v2(0, 35), cc.v2(0, 70)];
    this.recordItemNodesArr = [];
    this.toBeRecordItemDataArr = [];
    this.bet = 0;
  },
  checkShiPei: function checkShiPei() {
    var w = cc.view.getVisibleSize().width;
    var x = -(w / 2 - 470) / 2 - 470;
    this.node.x = x;
  },
  onLoad: function onLoad() {
    var _this = this;

    this.checkShiPei();
    this.initRecordItemNodePool();
    this.startRecordItemsListen();
    this.tog_doubleMulti.node.on("toggle", function () {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClick125TimesEffect();
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_DOUBLE_TOGGLE,
        msgData: {
          isDoubleMulti: _this.tog_doubleMulti.isChecked
        }
      });
    }, this);
    this.btn_buyFree.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
  },
  initRecordItemNodePool: function initRecordItemNodePool() {
    this.recordItemNodePool = new cc.NodePool();

    for (var i = 0; i < 8; i++) {
      var recordItemNode = cc.instantiate(this.node_item);
      this.recordItemNodePool.put(recordItemNode);
    }

    ;
  },
  getRecordItemNode: function getRecordItemNode() {
    var recordItemNode = null;

    if (this.recordItemNodePool.size() > 0) {
      recordItemNode = this.recordItemNodePool.get();
    } else {
      recordItemNode = cc.instantiate(this.node_item);
    }

    ;
    return recordItemNode;
  },
  putRecordItemNodePool: function putRecordItemNodePool(recordItemNode) {
    if (recordItemNode) {
      this.recordItemNodePool.put(recordItemNode);
    }

    ;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SELECTED_BET_FRESH) {
      self.dealSelectedBetEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
      self.dealOnceEraseFinishedEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED) {
      self.dealSingleSpinFinishedEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
      self.dealAllSpinFinishedEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING) {
      self.dealSpinStartingEvent(notify);
    }
  },
  dealSpinStartingEvent: function dealSpinStartingEvent(notify) {
    if (!notify) {
      return;
    }

    ;

    if (this.freeCount > 0) {
      var addFree = notify.addFree;
      this.addFreeCount(addFree);
    }

    ;
  },
  dealAllSpinFinishedEvent: function dealAllSpinFinishedEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    this.setFreeCount(0);
  },
  dealSelectedBetEvent: function dealSelectedBetEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    this.bet = notify.bet;
    this.setMutilPrice(this.bet * 1.25 / 100);
    this.setFreePrice(this.bet * 100 / 100);
  },
  dealSingleSpinFinishedEvent: function dealSingleSpinFinishedEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    var spin = notify.spin;
    var bet = spin.bet;
    var remainFree = spin.remainFree;
    this.removeAllRecordItems();
    this.setFreeCount(remainFree);
  },
  dealOnceEraseFinishedEvent: function dealOnceEraseFinishedEvent(notify) {
    if (!notify) {
      return;
    }

    ;
    var erase = notify.erase;
    var bet = erase.bet;
    var addFree = erase.addFree;
    var currentXMul = erase.currentXMul;

    if (erase.elf == 12) {
      this.setMutil(currentXMul);
    }

    ;
    this.addFreeCount(addFree);

    if (erase.elf != 0 && erase.elf != 2 && erase.elf != 12) {
      var tempObj = {
        erase: erase,
        bet: bet
      };
      this.toBeRecordItemDataArr = this.toBeRecordItemDataArr.concat([tempObj]);
    }

    ;
  },
  startRecordItemsListen: function startRecordItemsListen() {
    var _this2 = this;

    var addRecordItemNodeFun = function addRecordItemNodeFun() {
      if (_this2.toBeRecordItemDataArr.length > 0) {
        var recordItemData = _this2.toBeRecordItemDataArr.shift();

        _this2.addRecordItemNode(recordItemData);
      }

      ;
    };

    this.schedule(addRecordItemNodeFun, 0.5);
  },
  addRecordItemNode: function addRecordItemNode(recordItemData) {
    var _this3 = this;

    var len = this.recordItemNodesArr.length;

    if (len == 5) {
      var _loop = function _loop(i) {
        var itemNode = _this3.recordItemNodesArr[i];
        cc.tween(itemNode).to(_this3.addRecordItemInterval, {
          position: cc.v2(0, _this3.itemNodePosArr[i].y - 35)
        }).call(function () {
          if (i == 0) {
            var firstNode = _this3.recordItemNodesArr.shift();

            _this3.putRecordItemNodePool(firstNode);

            _this3.createRecordItemNode(recordItemData);
          }

          ;
        }).start();
      };

      for (var i = 0; i < len; i++) {
        _loop(i);
      }

      ;
    } else {
      this.createRecordItemNode(recordItemData);
    }

    ;
  },
  removeAllRecordItems: function removeAllRecordItems() {
    this.toBeRecordItemDataArr = [];
    var len = this.recordItemNodesArr.length;

    for (var i = 0; i < len; i++) {
      var itemNode = this.recordItemNodesArr[i];
      this.putRecordItemNodePool(itemNode);
    }

    ;
    this.recordItemNodesArr = [];
  },
  createRecordItemNode: function createRecordItemNode(recordItemData) {
    var i = this.recordItemNodesArr.length;
    var itemNode = this.getRecordItemNode();
    itemNode.setPosition(this.itemNodeStartPos);
    this.node_itemsParent.addChild(itemNode);
    this.recordItemNodesArr.push(itemNode);
    var recordItemCtrl = itemNode.getComponent("zeusRecordItemCtrl");
    recordItemCtrl.setRecordItemData(recordItemData);
    cc.tween(itemNode).to(this.addRecordItemInterval, {
      position: this.itemNodePosArr[i]
    }, cc.easeBounceOut()).start();
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case this.btn_buyFree.node.name:
        this.dealBtnBuyFreeEvent();
        break;

      default:
        break;
    }
  },
  dealBtnBuyFreeEvent: function dealBtnBuyFreeEvent() {
    this.setBtnBuyFreeInteractableStatus(false);
    this.setTogDoubleMultiInteractableStatus(false);
    this.playBtnFreeAnim(false);
    this.setBuyFreeState(false);
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SHOW_BUY_FREE_TIPS,
      msgData: {
        bet: this.bet
      }
    });
  },
  playBtnFreeAnim: function playBtnFreeAnim(isShow) {
    cc.tween(this.btn_buyFree.node).to(0.2, {
      scale: isShow ? 1 : 0,
      opacity: isShow ? 255 : 0
    }).start();
  },
  setBuyFreeState: function setBuyFreeState(isBuy) {
    this.node_purchased.active = isBuy;
    this.node_notPurchased.active = !isBuy;
    this.node_notPurchased.opacity = !isBuy ? 255 : 190;
  },
  setFreeStatus: function setFreeStatus(isFree) {
    this.node_statusFree.active = isFree;
    this.node_statusNoFree.active = !isFree;
  },
  setFreePrice: function setFreePrice(freePriceStr) {
    this.lab_freePrice.string = "$" + freePriceStr;
  },
  setMutilPrice: function setMutilPrice(score) {
    this.lab_multiPrice.string = "$" + score;
  },
  setMutil: function setMutil(mutil) {
    if (typeof mutil != "number") {
      LoggerUtil.getInstance().warn("setMutil: mutil is not a number");
      this.lab_freeAllMulti.string = '';
      this.lab_freeAllMultiX.string = '';
      return;
    }

    ;

    if (mutil <= 0) {
      this.lab_freeAllMulti.string = '';
      this.lab_freeAllMultiX.string = '';
    } else {
      this.lab_freeAllMulti.string = "" + mutil;
      this.lab_freeAllMultiX.string = 'X';
    }

    ;
  },
  getTogDoubleMultiCheckedStatus: function getTogDoubleMultiCheckedStatus() {
    return this.tog_doubleMulti.isChecked;
  },
  setTogDoubleMultiCheckedStatus: function setTogDoubleMultiCheckedStatus(bool) {
    this.tog_doubleMulti.isChecked = bool;
  },
  addFreeCount: function addFreeCount(addCount) {
    this.freeCount += addCount;
    this.setFreeCount(this.freeCount);
  },
  setFreeCount: function setFreeCount(freeCount) {
    this.freeCount = freeCount;
    this.setFreeCountLab(this.freeCount);
  },
  setFreeCountLab: function setFreeCountLab(freeCount) {
    if (freeCount < 0) {
      freeCount = 0;
    }

    ;
    this.lab_freeCount.string = "" + freeCount;
  },
  setBtnBuyFreeInteractableStatus: function setBtnBuyFreeInteractableStatus(bool) {
    this.btn_buyFree.interactable = bool;
    this.btn_buyFree.node.opacity = bool ? 255 : 190;
    this.node_notPurchased.opacity = bool ? 255 : 190;
  },
  setTogDoubleMultiInteractableStatus: function setTogDoubleMultiInteractableStatus(bool) {
    this.tog_doubleMulti.interactable = bool;
    this.tog_doubleMulti.node.opacity = bool ? 255 : 190;
  },
  getFreeAllMultLabNode: function getFreeAllMultLabNode() {
    return this.lab_freeAllMulti.node;
  },
  getFreeAllMult: function getFreeAllMult() {
    return Number(this.lab_freeAllMulti.string);
  }
});

cc._RF.pop();