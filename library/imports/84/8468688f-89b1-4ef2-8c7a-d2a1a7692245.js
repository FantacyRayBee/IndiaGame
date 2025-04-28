"use strict";
cc._RF.push(module, '84686iPibFO8ox60qGnaSJF', '7upVIPUserCtrl');
// 7up7downGame/7upScript/7upVIPUserCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas
  },
  ctor: function ctor() {
    this.vipSiteState = true;
    this.roundCount = 0; //大于3自动踢下VIP
    this.curSeat = 0;
  },
  onLoad: function onLoad() {
    this.posX = this.node.x;
    this.posY = this.node.y;
    this.bg = this.node.getChildByName("btn_bg");
    this.btn_bg = this.bg.getComponent(cc.Button);
    this.userTx = this.bg.getChildByName("user_tx").getComponent(cc.Sprite); //用户的头像
    this.img_dx = this.bg.getChildByName("duanxian"); //断线中的图标
    this.userName = this.bg.getChildByName("lab_userName").getComponent(cc.Label); //用户名
    this.labGold = this.bg.getChildByName("lab_gold").getComponent(cc.Label); //金币数量
    this.textBg = this.node.getChildByName("bg");
    this.lab_num = this.textBg.getChildByName("lab_num").getComponent(cc.Label); //赢得的数目
    this.textBg.active = false;
    this.btn_gift = this.node.getChildByName("btn_gift").getComponent(cc.Button);
    this.btn_gift.node.on("click", this.btnClickEvent, this);
    this.nodePos = this.node.getPosition(); //送礼物时需要的参数
    this.userTx.node.active = false;
    this.btn_bg.node.on("click", this.btnClick, this);
    this.freshVipPlayerView();
    this.upCtrl = this.node.parent.getComponent("7upCtrl");
  },
  btnClick: function btnClick() {
    var _this = this;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var selfplayID = this.upCtrl.userInfoCtrl.getPlayerid();
    if (this.vipSiteState == false && selfplayID == this.playerid) {
      CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", function () {
        GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
          Site: _this.vipSite,
          Act: 2
        });
      }, false);
      return;
    }
    if (this.vipSiteState == false) {
      CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!");
      return;
    }
    ;
    var act = this.upCtrl.hasDown == false ? 1 : 3;
    if (CommonFun.getInstance().isOpenVipModule()) {
      if (GlobalCfg.USER_DATAS.userVip.level == 0) {
        CommonFun.getInstance().showFirstRecharge();
        return;
      }
      ;
      var isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
      if (isCanSitVipSeat) {
        GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
          Site: this.vipSite,
          Act: act
        });
        return;
      }
      ;
      CommonFun.getInstance().showVipUpgradeToast();
      return;
    }
    ;
    if (GlobalCfg.USER_DATAS.userDiamond <= 10000) {
      if (GlobalCfg.IS_CLUB_MODE == 1) {
        //代理模式不跳转商城
        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
      } else {
        CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
      }
      return;
    }
    ;
    GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
      Site: this.vipSite,
      Act: act
    });
  },
  btnClickEvent: function btnClickEvent(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_gift") {
      if (this.checkSelfIsVip() == true) {
        CommonFun.getInstance().showGameGifInteraction(this.vipSite);
      } else {
        CommonFun.getInstance().showMsgBox("VIP players can use this function", "YES", function () {}, false);
      }
      ;
    }
    ;
  },
  checkSelfIsVip: function checkSelfIsVip() {
    var playerid = GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.getPlayerid();
    for (var i = 0, len = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr.length; i < len; i++) {
      var vipPlayerScript = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr[i];
      if (playerid == vipPlayerScript.getPlayerID()) {
        return true;
      }
    }
    return false;
  },
  setVipPlayerInfo: function setVipPlayerInfo(data) {
    this.node.active = true;
    // LoggerUtil.getInstance().log("设置当前VIP座位", data.VipSite);
    this.disPlayName = data.DisplayName;
    this.nickname = data.Nickname;
    this.coin = data.Diamond;
    this.playerid = data.PlayerId;
    this.vipSite = data.VipSite;
    this.seatid = data.VipSite;
    this.setCoin(this.coin);
    this.setNickName(this.nickname);
    this.setVipPlayerImg(data.ImgUrl); //vip玩家的头像url
    this.userTx.node.active = true;
    this.btn_gift.node.active = true;
    this.setVipSiteState(false);
    if (data.vipLevel >= 1 && data.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + data.vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }
    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(data.vipLevel);
    if (isCanShowVIPFont) {
      this.userName.node.color = new cc.Color(250, 225, 76);
    } else {
      this.userName.node.color = new cc.Color(255, 255, 255);
    }
    ;
  },
  vipLeave: function vipLeave() {
    this.freshVipPlayerView();
  },
  freshVipPlayerView: function freshVipPlayerView() {
    this.userName.string = "";
    this.labGold.string = "";
    this.coin = 0;
    this.playerid = null;
    this.disPlayName = null;
    this.userTx.node.active = false;
    this.btn_gift.node.active = false;
    this.setVipSiteState(true);
    this.sprite_vipLevelIcon.node.active = false;
    this.roundCount = 0;
  },
  setNickName: function setNickName(name) {
    this.name = name;
    if (this.userName) {
      this.userName.string = CommonFun.getInstance().getStrByLength(name, 8);
      ;
    }
  },
  setWinNum: function setWinNum(num) {
    var _this2 = this;
    if (num <= 0 || this.vipSiteState == true) {
      return;
    }
    ;
    var number = FloatCalculation.accDiv(num, 100);
    this.lab_num.string = "+" + number;
    this.textBg.active = true;
    cc.tween(this.textBg).to(1, {
      position: cc.v2(0, 60)
    }).delay(0.5).call(function () {
      _this2.textBg.position = cc.v2(0, 30);
      _this2.textBg.active = false;
    }).start();
  },
  betAction: function betAction() {
    var posY = this.posY;
    var posX = this.posX;
    cc.tween(this.node).to(0.1, {
      position: cc.v2(posX, posY + 15)
    }).to(0.1, {
      position: cc.v2(posX, posY)
    }).start();
  },
  //设置该座位能否入座
  setVipSiteState: function setVipSiteState(state) {
    this.vipSiteState = state;
    // this.nodeTxmask.getComponent(cc.Button).interactable = state;       //true时可用，false不可用
  },

  getVipSiteState: function getVipSiteState() {
    return this.vipSiteState;
  },
  setCoin: function setCoin(coin) {
    // LoggerUtil.getInstance().log("VIP设置金币```````````````", coin)
    this.coin = FloatCalculation.accDiv(coin, 100);
    if (this.labGold && coin != null) {
      this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);
    }
  },
  getCoin: function getCoin() {
    return this.coin;
  },
  setVipPlayerImg: function setVipPlayerImg(url) {
    this.loadHeadSp(url, 90, this.userTx);
  },
  // loadHeadSp: function (spriteurl, realWidth) {
  //     let self = this;
  //     if (spriteurl == null || spriteurl.length === 0) {
  //         self.userTx.spriteFrame = null;
  //         return;
  //     }
  //     cc.loader.load({ url: spriteurl, type: 'png' }, function (err, img) {
  //         if (err == null && cc.isValid(self) && cc.isValid(self.userTx)) {
  //             self.userTx.spriteFrame = new cc.SpriteFrame(img);
  //             self.userTx.node.setScale(realWidth / self.userTx.node.width);
  //         }
  //     });
  // },

  getPlayerID: function getPlayerID() {
    if (this.playerid) {
      return this.playerid;
    } else {
      return null;
    }
  },
  getVipPlayerPos: function getVipPlayerPos() {
    this.pos = this.node.getPosition(); //cc.Vec2/cc.Vec3
    // LoggerUtil.getInstance().log("VIP玩家的坐标：", this.pos);
    return this.pos;
  },
  setSiteID: function setSiteID(site) {
    this.vipSite = site;
    this.curSeat = site;
  },
  getVipSite: function getVipSite() {
    return this.vipSite;
  },
  // 下注
  vipBetting: function vipBetting(count, areaType, mainScript) {
    this.roundCount = 0;
    var pos = this.getVipPlayerPos();
    var betCallBack = function betCallBack() {
      var jbnode = mainScript.createJbNode();
      jbnode.setPosition(pos);
      if (areaType == 0) {
        var posx = Math.random() * 170 - 395;
        var posy = Math.random() * 160 - 80;
        if (mainScript.leftGoldArr.length > 100) {
          mainScript.nodeJb.removeChild(mainScript.leftGoldArr[0], true);
          mainScript.leftGoldArr.splice(0, 1);
        }
        mainScript.leftGoldArr.push(jbnode);
        jbnode.parent = mainScript.nodeJb;
      } else if (areaType == 4) {
        var posx = Math.random() * 340 - 170;
        var posy = Math.random() * 60 - 80;
        if (mainScript.midGoldArr.length > 100) {
          mainScript.nodeJb.removeChild(mainScript.midGoldArr[0], true);
          mainScript.midGoldArr.splice(0, 1);
        }
        mainScript.midGoldArr.push(jbnode);
        jbnode.parent = mainScript.nodeJb;
      } else if (areaType == 1) {
        var posx = Math.random() * 165 + 225;
        var posy = Math.random() * 160 - 80;
        if (mainScript.rightGoldArr.length > 100) {
          mainScript.nodeJb.removeChild(mainScript.rightGoldArr[0], true);
          mainScript.rightGoldArr.splice(0, 1);
        }
        mainScript.rightGoldArr.push(jbnode);
        jbnode.parent = mainScript.nodeJb;
      }
      cc.tween(jbnode).to(0.25, {
        scale: 1,
        position: cc.v2(posx, posy)
      }).start();
    };
    this.schedule(betCallBack, 0.05, count - 1, 0);
  },
  winGoldMoveAnim: function winGoldMoveAnim(count, vipWinJbArr, mainScript) {
    var pos = this.getVipPlayerPos();
    var _loop = function _loop() {
      var tempIndex = i;
      cc.tween(vipWinJbArr[tempIndex]).delay(Math.random() * 0.3).to(0.3, {
        scale: 1,
        position: pos
      }).call(function () {
        mainScript.upDownAudioCtrl.playGameSound("recover", false);
        if (vipWinJbArr[tempIndex] != null) {
          mainScript.removeJbNode(vipWinJbArr[tempIndex]);
        }
      }).start();
    };
    for (var i = vipWinJbArr.length - 1; i >= 0; i--) {
      _loop();
    }
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();