"use strict";
cc._RF.push(module, '7a825H+oe9IIL5cj418Dy3i', 'propCtrl');
// ResourcesBundle/NewPlan/GameGifInteraction/propCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_daoJu: cc.Node,
    node_liWu: cc.Node,
    node_all: cc.Node,
    node_sendAll: cc.Button,
    btn_mask: cc.Button,
    toggs: [cc.Toggle],
    pab_propSke: cc.Prefab,
    sf_jb: cc.SpriteFrame
  },
  ctor: function ctor() {
    // 0番茄 12 宝箱
    this.is_can_click = true;
    this.skeName = "hd_jidan01", this.propArr = ["番茄", "hd_jidan01", "hd_mtb01", "hd_dapao01", "hd_cangyingpai01", "hd_shuaibiti01", "hd_xianbing01", "hd_bingtong01", "hd_huojian01", "hd_woshou01", "hd_ganbei01", "hd_meigui01", "宝箱", "hd_daocha01", "puke01_xipai02", "qf_xishou01"];
    this.liWuArr = ["0", "Free", "Free", "1", "Free", "Free", "Free", "Free", "2"];
    this.daoJuArr = ["Free", "Free", "Free", "0", "Free", "Free", "Free"];
  },
  onLoad: function onLoad() {
    for (var i = 0; i < this.toggs.length; i++) {
      var tog = this.toggs[i];
      tog.node.on('click', this.toggleClick, this);
    }
    this.btn_mask.node.on('click', this.btnClick, this);
    this.node_sendAll.node.on('click', this.btnClick, this);
    var node_daoJuArr = this.node_daoJu.children;
    var node_liWuArr = this.node_liWu.children;
    for (var _i = 0; _i < node_daoJuArr.length; _i++) {
      var node = node_daoJuArr[_i].children;
      for (var j = 0; j < node.length; j++) {
        var str = node[j].name.split("_");
        if (str && str[0] == "btn") {
          var btn = node[j].getComponent(cc.Button);
          btn.node.on('click', this.btnClick, this);
        }
      }
    }
    for (var _i2 = 0; _i2 < node_liWuArr.length; _i2++) {
      var _node = node_liWuArr[_i2].children;
      for (var _j = 0; _j < _node.length; _j++) {
        var _str = _node[_j].name.split("_");
        if (_str && _str[0] == "btn") {
          var _btn = _node[_j].getComponent(cc.Button);
          _btn.node.on('click', this.btnClick, this);
        }
      }
    }
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.eventHide();
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId === "gameservice.shortmessagenotify") {
      var msgType = notify.msgType; // 消息类型 0短语 1表情 2礼物
      var name = notify.name; // 表情名/短语内容
      var sender = notify.sender; // 发送者seat
      var _target = notify.target; // 接收者seat (-1表示群发)
      var price = notify.price; // 价格
      var senderAfter = notify.senderAfter; // 发送者扣价后货币

      if (msgType == 2) {
        var ctrlName = self.getgameName(senderAfter, sender, price);
        if (_target == -1) {
          var players = GlobalCfg.ACT_SCENE_CTRL.userArryNode || GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr;
          for (var _i3 = 0; _i3 < players.length; _i3++) {
            if (players[_i3]) {
              var gameCtrl = players[_i3].getComponent(ctrlName) || players[_i3].getComponent("rummyOtherUserCtrl");
              if (gameCtrl.node_wanJia && !gameCtrl.node_wanJia.active) {
                continue;
              }
              if (gameCtrl.vipSiteState) {
                continue;
              }
              var seatid = gameCtrl.seatid || gameCtrl.seatid == 0 ? gameCtrl.seatid : gameCtrl.seatId;
              var pab_propSke = cc.instantiate(self.pab_propSke);
              self.node.addChild(pab_propSke);
              var ctrl = pab_propSke.getComponent('propSkeCtrl');
              ctrl.shortmessagenotify(notify, seatid, self.node);
            }
          }
        } else {
          var _pab_propSke = cc.instantiate(self.pab_propSke);
          self.node.addChild(_pab_propSke);
          var _ctrl = _pab_propSke.getComponent('propSkeCtrl');
          _ctrl.shortmessagenotify(notify, _target, self.node);
        }
      }
    } else if (msgId === "gameservice.changeroom") {
      var children = self.node.children;
      self.unscheduleAllCallbacks();
      for (var i = 0; i < children.length; ++i) {
        if (children[i].name != 'node_all') {
          children[i].destroy();
        }
      }
    }
  },
  btnClick: function btnClick(button) {
    var _this = this;
    var newCoin = 0;
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_mask") {
      this.node_all.active = false;
    } else {
      this.node_all.active = false;
      if (!this.is_can_click) {
        CommonFun.getInstance().showTips("Skill cooling...");
        return;
      }
      this.is_can_click = false;
      this.btnTime = setTimeout(function () {
        _this.is_can_click = true;
      }, 4000);
      var str = btnName.split("_");
      var name = Number(str[1]);
      this.skeName = this.propArr[name] + "";
      var coin = button.node.parent.getChildByName("lab_jb").getComponent(cc.Label).string;
      var LanguageStr = otherLanguage.prop[language];
      if (coin != LanguageStr) {
        // 获取玩家发送表情的钱
        newCoin = this.isAllSend == "YES" ? Number(coin) * 200 : Number(coin) * 100;
      }

      // 玩家发送的钱不足时 提示玩家
      if (coin == LanguageStr || GlobalCfg.USER_DATAS.userDiamond >= newCoin) {
        GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
          msgType: 2,
          name: this.propArr[name] + "",
          target: this.isAllSend == "YES" ? -1 : this.targetID
        });
      } else {
        CommonFun.getInstance().showTips("Insufficient cash to send");
      }
    }
  },
  toggleClick: function toggleClick(toggle) {
    var togName = toggle.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (togName == "toggle_daoJu") {
      this.node_daoJu.active = false;
      this.node_liWu.active = true;
    } else if (togName == "toggle_liWu") {
      this.node_daoJu.active = true;
      this.node_liWu.active = false;
    } else if (togName == "Toggle_all") {
      this.isAllSend = toggle.isChecked ? "NO" : "YES";
    }
  },
  /**
   * 
   * @param {*} targetID 目标
   * @param {*} launchID 使用者
   * @param {*} curSeat 
   * @param {String} gameName 游戏名称
   * @param {Boolean} isPractice 是否收费
   */
  setPlayData: function setPlayData(targetID, launchID, curSeat, gameName, isPractice) {
    this.gameName = gameName;
    this.launchID = launchID;
    this.targetID = targetID;
    this.curSeat = curSeat;
    this.isAllSend = "NO";
    this.toggs[2].isChecked = false;
    this.node_sendAll.node.active = true;
    if (!isPractice) {
      // 是否是体验场  false是体验场
      var liWu = this.node_liWu.children;
      var daoJu = this.node_daoJu.children;
      this.liWuArr[1] = otherLanguage.prop[language];
      this.daoJuArr[0] = otherLanguage.prop[language];
      for (var i = 1; i < liWu.length; i++) {
        liWu[i].getChildByName("lab_jb").getComponent(cc.Label).string = this.liWuArr[i];
        var node = liWu[i].getChildByName("img_cm");
        node.getComponent(cc.Sprite).spriteFrame = this.sf_jb;
      }
      for (var _i4 = 0; _i4 < daoJu.length; _i4++) {
        daoJu[_i4].getChildByName("lab_jb").getComponent(cc.Label).string = this.daoJuArr[_i4];
        var _node2 = daoJu[_i4].getChildByName("img_cm");
        _node2.getComponent(cc.Sprite).spriteFrame = this.sf_jb;
      }
    }
  },
  /**
   * 更新发送者金币
   * @param {玩家发送表情后的金币} senderAfter 
   * @param {表情发送者} sender 
   * @returns {String}
   */
  getgameName: function getgameName(senderAfter, sender) {
    var sceneName = cc.director.getScene().name;
    if (sceneName == "rummy") {
      var ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
      if (CommonFun.getInstance().isValidForScr(ctrl)) {
        ctrl.setCoin && ctrl.setCoin(senderAfter);
      }
      ;
      return "rummyUserInfoCtrl";
    } else if (sceneName == "tpGame") {
      var _ctrl2 = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
      if (CommonFun.getInstance().isValidForScr(_ctrl2)) {
        _ctrl2.setTeenPattiPlayerCoin && _ctrl2.setTeenPattiPlayerCoin(senderAfter);
      }
      ;
      return "teenPattiPlayerCtrl";
    } else if (sceneName == "Andeer") {
      var _ctrl3 = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
      if (CommonFun.getInstance().isValidForScr(_ctrl3)) {
        _ctrl3.setCoin && _ctrl3.setCoin(senderAfter);
      }
      ;
      return "andeerPalyerCtrl";
    } else if (sceneName == "7up7down") {
      var _ctrl4 = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
      if (GlobalCfg.ACT_SCENE_CTRL && GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl && GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.setCoin) {
        GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.setCoin(senderAfter);
      }
      ;
      if (CommonFun.getInstance().isValidForScr(_ctrl4)) {
        _ctrl4.setCoin && _ctrl4.setCoin(senderAfter);
      }
      ;
      return "7upVIPUserCtrl";
    } else if (sceneName == "LHD") {
      return "lhdPlayerCtrl";
    } else if (sceneName == "horseRace") {
      return "horseRacePlayerCtrl";
    } else if (sceneName == "mundaLobby") {
      return "playerCtrl";
    } else if (sceneName == "baccarat3Patti") {
      var _ctrl5 = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
      if (CommonFun.getInstance().isValidForScr(_ctrl5)) {
        _ctrl5.setVipCion && _ctrl5.setVipCion(senderAfter);
        GlobalCfg.ACT_SCENE_CTRL.noVIPPlayerCtrl.setMyCoin(senderAfter);
      }
      ;
      return "VIPCtrl";
    } else if (sceneName == 'zoo') {
      var _ctrl6 = GlobalCfg.ACT_SCENE_CTRL.zooSeatManager.getPlayerCtrlBySeatId(sender);
      if (CommonFun.getInstance().isValidForScr(_ctrl6)) {
        _ctrl6.setUserCoinLabel && _ctrl6.setUserCoinLabel(senderAfter);
      }
      return 'zooPlayerCtrl';
    } else if (sceneName == 'cricket') {
      var _ctrl7 = GlobalCfg.ACT_SCENE_CTRL.seatManager.getPlayerCtrlBySeatId(sender);
      if (CommonFun.getInstance().isValidForScr(_ctrl7)) {
        _ctrl7.setUserCoinLabel && _ctrl7.setUserCoinLabel(senderAfter);
      }
      return 'cricketPlayerCtrl';
    }
  },
  eventHide: function eventHide() {
    cc.game.on(cc.game.EVENT_HIDE, function () {
      var children = this.node.children;
      for (var i = 0; i < children.length; ++i) {
        var name = children[i].name;
        if (name == "propSke") {
          children[i].destroy();
        }
      }
    }, this);
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();