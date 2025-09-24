"use strict";
cc._RF.push(module, '154e0ug5/BH8p9m+yyElNVu', 'zooPlayerList');
// zooGame/Scripts/zooPlayerList.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_player: cc.Prefab,
    content: cc.Node,
    allPlayer: cc.Label,
    lab_page: cc.Label,
    lab_playerTotal: cc.Label,
    lab_prev: cc.Label,
    lab_next: cc.Label
  },
  ctor: function ctor() {
    this.page = 1;
    this.isONE = 0;
  },
  // 实例化玩家列表
  setPlayerData: function setPlayerData(notify) {
    this.isONE++;
    var playerlist = notify.list;
    this.allcount = notify.total;
    this.content.removeAllChildren();

    for (var i = 0; i < playerlist.length; i++) {
      var pab_player = cc.instantiate(this.pab_player);
      var ctrl = pab_player.getComponent("zooPlayerItem");
      ctrl.setPlayData(playerlist[i]);
      this.content.addChild(pab_player);
    }

    this.allPlayer.string = this.allcount;
    this.allPage = Math.ceil(this.allcount / 12);
    this.lab_page.string = this.page + "/" + this.allPage;

    if (this.page == this.allPage) {
      this.btn_next.interactable = false;
      this.btn_next.target.getChildByName('lab_next').color = new cc.Color(106, 123, 172, 255);
    } else {
      this.btn_next.interactable = true;
      this.btn_next.target.getChildByName('lab_next').color = new cc.Color(255, 255, 255, 255);
    }
  },
  onLoad: function onLoad() {
    this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
    this.btn_Prev = this.node.getChildByName("btn_Prev").getComponent(cc.Button);
    this.btn_next = this.node.getChildByName("btn_next").getComponent(cc.Button);
    this.btn_close.node.on("click", this.clickBtn, this);
    this.btn_Prev.node.on("click", this.clickBtn, this);
    this.btn_next.node.on("click", this.clickBtn, this);
    this.btn_next.target.getChildByName('lab_next').color = new cc.Color(255, 255, 255, 255);
    this.btn_Prev.target.getChildByName('lab_prev').color = new cc.Color(106, 123, 172, 255);
    this.btn_Prev.interactable = false;
    this.btn_Prev.enableAutoGrayEffect = true;
    this.btn_next.interactable = true;
    this.btn_next.enableAutoGrayEffect = true; // this.lab_playerTotal.string = lhdLanguage.lab_playerTotal[language];
    // this.lab_prev.string = lhdLanguage.lab_prev[language];
    // this.lab_next.string = lhdLanguage.lab_next[language];
  },
  clickBtn: function clickBtn(button) {
    var btnName = button.node.name;

    if (btnName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
      return;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_Prev") {
      this.page--;

      if (this.page <= 1) {
        this.btn_next.target.getChildByName('lab_next').color = new cc.Color(255, 255, 255, 255);
        this.btn_Prev.target.getChildByName('lab_prev').color = new cc.Color(106, 123, 172, 255);
        this.btn_Prev.interactable = false;
        this.btn_Prev.enableAutoGrayEffect = false;
        this.btn_next.interactable = true;
        this.btn_next.enableAutoGrayEffect = false;
        this.page = 1;
        this.lab_page.string = "1/" + this.allPage;
        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendGetPlayerListMsg(this.page - 1, 12);
      } else {
        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendGetPlayerListMsg(this.page - 1, 12);
        this.lab_page.string = this.page + "/" + this.allPage;
        this.btn_next.target.getChildByName('lab_next').color = new cc.Color(255, 255, 255, 255);
        this.btn_next.interactable = true;
        this.btn_next.enableAutoGrayEffect = false;
      }
    } else if (btnName == "btn_next") {
      this.page++;

      if (this.page >= this.allPage) {
        this.btn_Prev.target.getChildByName('lab_prev').color = new cc.Color(255, 255, 255, 255);
        this.btn_next.target.getChildByName('lab_next').color = new cc.Color(106, 123, 172, 255);
        this.btn_Prev.interactable = true;
        this.btn_Prev.enableAutoGrayEffect = false;
        this.btn_next.interactable = false;
        this.btn_next.enableAutoGrayEffect = false;
        this.page = this.allPage;
        this.lab_page.string = this.page + "/" + this.allPage;
        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendGetPlayerListMsg(this.page - 1, 12);
      } else {
        GlobalCfg.ACT_SCENE_CTRL.serverMsgManager.sendGetPlayerListMsg(this.page - 1, 12);
        this.lab_page.string = this.page + "/" + this.allPage;
        this.btn_Prev.target.getChildByName('lab_prev').color = new cc.Color(255, 255, 255, 255);
        this.btn_Prev.interactable = true;
        this.btn_Prev.enableAutoGrayEffect = false;
      }
    }
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();