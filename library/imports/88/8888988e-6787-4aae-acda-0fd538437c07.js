"use strict";
cc._RF.push(module, '88889iOZ4dKrqzaD9U4Q3wH', 'horseRacePlayerListCtrl');
// horseRaceGame/horseScr/horseRacePlayerListCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_player: cc.Prefab,
    content: cc.Node,
    allPlayer: cc.Label,
    lab_page: cc.Label
  },
  ctor: function ctor() {
    this.page = 1;
    this.isONE = 0;
  },
  // 实例化玩家列表
  setPlayerDate: function setPlayerDate(notify) {
    this.isONE++;
    var playerlist = notify.playerlist;
    this.allcount = notify.allcount;
    this.content.removeAllChildren();
    for (var i = 0; i < playerlist.length; i++) {
      var pab_player = cc.instantiate(this.pab_player);
      var ctrl = pab_player.getComponent("horseRacePlayerItemCtrl");
      ctrl.setPlayDate(playerlist[i]);
      this.content.addChild(pab_player);
    }
    // if(this.isONE == 1){
    this.allPlayer.string = this.allcount;
    this.allPage = Math.ceil(this.allcount / 12);
    this.lab_page.string = this.page + "/" + this.allPage;
    // }
  },
  onLoad: function onLoad() {
    this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
    this.btn_Prev = this.node.getChildByName("btn_Prev").getComponent(cc.Button);
    this.btn_next = this.node.getChildByName("btn_next").getComponent(cc.Button);
    this.btn_close.node.on("click", this.clickBtn, this);
    this.btn_Prev.node.on("click", this.clickBtn, this);
    this.btn_next.node.on("click", this.clickBtn, this);
    this.btn_next.target.color = new cc.color(255, 255, 255, 255);
    this.btn_Prev.target.color = new cc.color(106, 123, 172, 255);
    this.btn_Prev.interactable = false;
    this.btn_Prev.enableAutoGrayEffect = true;
    this.btn_next.interactable = true;
    this.btn_next.enableAutoGrayEffect = true;
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
        this.btn_next.target.color = new cc.color(255, 255, 255, 255);
        this.btn_Prev.target.color = new cc.color(106, 123, 172, 255);
        this.btn_Prev.interactable = false;
        this.btn_Prev.enableAutoGrayEffect = false;
        this.btn_next.interactable = true;
        this.btn_next.enableAutoGrayEffect = false;
        this.page = 1;
        this.lab_page.string = "1/" + this.allPage;
        GlobalCfg.ACT_SCENE_CTRL.sendReqCtrl.playerlistReq(1, 12);
      } else {
        GlobalCfg.ACT_SCENE_CTRL.sendReqCtrl.playerlistReq(this.page, 12);
        this.lab_page.string = this.page + "/" + this.allPage;
        this.btn_next.target.color = new cc.color(255, 255, 255, 255);
        this.btn_next.interactable = true;
        this.btn_next.enableAutoGrayEffect = false;
      }
    } else if (btnName == "btn_next") {
      this.page++;
      if (this.page >= this.allPage) {
        this.btn_Prev.target.color = new cc.color(255, 255, 255, 255);
        this.btn_next.target.color = new cc.color(106, 123, 172, 255);
        this.btn_Prev.interactable = true;
        this.btn_Prev.enableAutoGrayEffect = false;
        this.btn_next.interactable = false;
        this.btn_next.enableAutoGrayEffect = false;
        this.page = this.allPage;
        this.lab_page.string = this.page + "/" + this.allPage;
        GlobalCfg.ACT_SCENE_CTRL.sendReqCtrl.playerlistReq(this.page, 12);
      } else {
        GlobalCfg.ACT_SCENE_CTRL.sendReqCtrl.playerlistReq(this.page, 12);
        this.lab_page.string = this.page + "/" + this.allPage;
        this.btn_Prev.target.color = new cc.color(255, 255, 255, 255);
        this.btn_Prev.interactable = true;
        this.btn_Prev.enableAutoGrayEffect = false;
      }
    }
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();