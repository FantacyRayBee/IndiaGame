"use strict";
cc._RF.push(module, '14a54A0G1JKdKwaGTGeCo7w', '7upPlayerListFabCtrl');
// 7up7downGame/7upScript/7upPlayerListFabCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_playerItem: cc.Prefab
  },
  ctor: function ctor() {
    this.pageNun = 1;
  },
  onLoad: function onLoad() {
    this.lab_playerNun = this.node.getChildByName('lab_playerNun').getComponent(cc.Label);
    this.btn_close = this.node.getChildByName('btn_close').getComponent(cc.Button);
    this.btn_Prev = this.node.getChildByName('btn_Prev').getComponent(cc.Button);
    this.btn_next = this.node.getChildByName('btn_next').getComponent(cc.Button);
    this.scrollView = this.node.getChildByName('scrollView');
    this.lab_total = this.node.getChildByName('lab_total').getComponent(cc.Label); //同场玩家总人数

    this.content = this.scrollView.getChildByName('view').getChildByName('content');
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.btn_close.node.on('click', this.btnClick, this);
    this.btn_Prev.node.on('click', this.btnClick, this);
    this.btn_next.node.on('click', this.btnClick, this);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;

    if (btnName === 'btn_close') {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    } else if (btnName === 'btn_Prev') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.showPageBtn(btnName);
    } else if (btnName === 'btn_next') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.showPageBtn(btnName);
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId === "gameservice.playerlist") {
      self.lab_total.string = notify.total;
      self.setTCWJData(notify.List, notify.total);
    }
  },
  setTCWJData: function setTCWJData(list, total) {
    if (!list) {
      LoggerUtil.getInstance().error("同场玩家的list为空");
      return;
    }

    ;
    this.playerListArr = [];
    this.playerTotal = total;
    this.content.removeAllChildren(true);

    for (var i = 0, len = list.length; i < len; i++) {
      var playerItem = cc.instantiate(this.pab_playerItem);
      var script = playerItem.getComponent('7upPlayerItemCtrl');
      script.setPlayerItemInfo(list[i]);
      this.playerListArr.push(playerItem);
      this.content.addChild(playerItem);
    }

    if (list.length > 0) {
      this.lab_playerNun.string = this.pageNun + "/" + Math.ceil(total / 12);
      this.showPageBtn();
    }

    ;
  },
  showPageBtn: function showPageBtn(str) {
    if (str == "btn_Prev") {
      this.pageNun--;
    } else if (str == "btn_next") {
      this.pageNun++;
    }

    if (this.pageNun == 1) {
      this.btn_Prev.interactable = false;
      this.btn_Prev.enableAutoGrayEffect = true;
      this.btn_next.interactable = true;
      this.btn_next.enableAutoGrayEffect = true;
      this.btn_next.target.color = new cc.color(255, 255, 255, 255);
      this.btn_Prev.target.color = new cc.color(106, 123, 172, 255);
    } else if (this.pageNun == Math.ceil(this.playerTotal / 12)) {
      this.btn_Prev.interactable = true;
      this.btn_Prev.enableAutoGrayEffect = false;
      this.btn_next.interactable = false;
      this.btn_next.enableAutoGrayEffect = true;
      this.btn_next.target.color = new cc.color(106, 123, 172, 255);
      this.btn_Prev.target.color = new cc.color(255, 255, 255, 255);
    } else {
      this.btn_Prev.interactable = true;
      this.btn_Prev.enableAutoGrayEffect = false;
      this.btn_next.interactable = true;
      this.btn_next.enableAutoGrayEffect = false;
      this.btn_next.target.color = new cc.color(255, 255, 255, 255);
      this.btn_Prev.target.color = new cc.color(255, 255, 255, 255);
    }

    this.lab_playerNun.string = this.pageNun + "/" + Math.ceil(this.playerTotal / 12);

    if (str) {
      this.reqPlayerlist(this.pageNun - 1, 12);
    }
  },
  reqPlayerlist: function reqPlayerlist(pageIndex, num) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: pageIndex,
      size: num
    });
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  }
});

cc._RF.pop();