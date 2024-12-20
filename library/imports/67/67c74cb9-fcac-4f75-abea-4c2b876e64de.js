"use strict";
cc._RF.push(module, '67c74y5/KxPdavqTCuHbmTe', 'historyRecordsCtrl');
// sscGame/sscScr/historyRecordsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_jackpot: cc.Node,
    node_myHistory: cc.Node,
    node_bigWinner: cc.Node,
    node_jackpotContent: cc.Node,
    node_myHistoryContent: cc.Node,
    node_bigWinnerContent: cc.Node,
    toggle_jackpot: cc.Toggle,
    toggle_myHistory: cc.Toggle,
    toggle_bigWinner: cc.Toggle,
    pab_jackpot_index: cc.Prefab,
    pab_myhistory_index: cc.Prefab,
    pab_bigWinner_index: cc.Prefab,
    btn_close: cc.Button
  },
  onLoad: function onLoad() {
    this.toggle_jackpot.node.on('click', this.btnClick, this);
    this.toggle_myHistory.node.on('click', this.btnClick, this);
    this.toggle_bigWinner.node.on('click', this.btnClick, this);
    this.btn_close.node.on('click', this.btnClick, this);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    if (btnName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
      return;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "toggle1") {
      this.node_jackpot.active = true;
      this.node_myHistory.active = false;
      this.node_bigWinner.active = false;
      GameServerManager.send("gameservice.queryjackpotrecord", "QueryJackpotRecordReq", {});
    } else if (btnName == "toggle2") {
      this.node_jackpot.active = false;
      this.node_myHistory.active = true;
      this.node_bigWinner.active = false;
      GameServerManager.send("gameservice.querymyrecord", "QueryMyRecordReq", {});
    } else if (btnName == "toggle3") {
      this.node_jackpot.active = false;
      this.node_myHistory.active = false;
      this.node_bigWinner.active = true;
      GameServerManager.send("gameservice.querybigwinnerrecord", "QueryBigWinnerRecordReq", {});
    }
  },
  // 显示那个历史记录的那个界面
  showUI: function showUI(str) {
    if (str == "jackpot" || str == "btn_jackpot") {
      this.node_jackpot.active = true;
      this.node_myHistory.active = false;
      this.node_bigWinner.active = false;
    } else if (str == "bigWinner") {
      this.node_jackpot.active = false;
      this.node_myHistory.active = false;
      this.node_bigWinner.active = true;
      this.toggle_bigWinner.isChecked = true;
    }
  },
  showDate: function showDate(str, list) {
    if (str == "jackpot") {
      this.node_jackpotContent.destroyAllChildren();
      var newList = list.sort(this.compare("time"));
      var index = 0;
      if (newList.length > 0) {
        this.schedule(function () {
          var date = newList[index];
          var pab_jackpot_index = cc.instantiate(this.pab_jackpot_index);
          this.node_jackpotContent.addChild(pab_jackpot_index);
          var ctrl = pab_jackpot_index.getComponent('pab_jackpot_indexCtrl');
          ctrl.showDate(date);
          index++;
        }, 0.1, newList.length - 1, 0);
      }
    } else if (str == "bigWinner") {
      this.node_bigWinnerContent.destroyAllChildren();
      var _newList = list.sort(this.compare("time"));
      var _index = 0;
      if (_newList.length > 0) {
        this.schedule(function () {
          var date = _newList[_index];
          var pab_bigWinner_index = cc.instantiate(this.pab_bigWinner_index);
          this.node_bigWinnerContent.addChild(pab_bigWinner_index);
          var ctrl = pab_bigWinner_index.getComponent('bigWinner_indexCtrl');
          ctrl.setwinnerIndex(date);
          _index++;
        }, 0.1, _newList.length - 1, 0);
      }
    } else if (str == "myhistory") {
      this.node_myHistoryContent.destroyAllChildren();
      var _newList2 = list.sort(this.compare("time"));
      var _index2 = 0;
      if (_newList2.length > 0) {
        this.schedule(function () {
          var date = _newList2[_index2];
          var pab_myhistory_index = cc.instantiate(this.pab_myhistory_index);
          this.node_myHistoryContent.addChild(pab_myhistory_index);
          var ctrl = pab_myhistory_index.getComponent('pab_myhistory_indexCtrl');
          ctrl.showDate(date);
          _index2++;
        }, 0.1, _newList2.length - 1, 0);
      }
    }
  },
  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    };
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();