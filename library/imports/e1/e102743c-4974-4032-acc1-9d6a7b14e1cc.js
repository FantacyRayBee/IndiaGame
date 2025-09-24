"use strict";
cc._RF.push(module, 'e1027Q8SXRAMqzBnWp7FOHM', 'rummyUserInfoCtrl');
// Rummy/rummyScript/rummyUserInfoCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    bqAtlas: cc.SpriteAtlas,
    win: sp.Skeleton,
    lab_01: cc.Label,
    lab_02: cc.Label,
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas
  },
  onLoad: function onLoad() {
    var _this = this;

    this.lab_jb = this.node.getChildByName("score_bg").getChildByName("lab_jb").getComponent(cc.Label); //金币

    this.lab_score = this.node.getChildByName("score_bg").getChildByName("lab_score").getComponent(cc.Label); //分数

    this.lab_scoreName = this.node.getChildByName("score_bg").getChildByName("lab_Score").getComponent(cc.Label);
    this.tx = this.node.getChildByName("tx_k").getChildByName("tx").getComponent(cc.Sprite); //头像

    this.time_green = this.node.getChildByName("time_sprite_green").getComponent(cc.Sprite); //绿色时间圈

    this.lab_roundTime = this.time_green.node.getChildByName("ovel_green").getChildByName("lab_roundTime").getComponent(cc.Label); //回合的20秒时间

    this.time_yellow = this.node.getChildByName("time_sprite_yellow").getComponent(cc.Sprite); //黄色时间圈

    this.lab_time_yellow = this.time_yellow.node.getChildByName("ovel_yellow").getChildByName("lab_overTime").getComponent(cc.Label); //超时之后的30秒时间，以lab_allTime时间为准

    this.overTimeNode = this.node.getChildByName("over_time");
    this.lab_allTime = this.overTimeNode.getChildByName("lab_allTime").getComponent(cc.Label); //剩余的时间

    this.sprite_my_qph = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("node_face").getChildByName("node_myFace").getChildByName("sprite_my_qph");
    this.sprite_myEmotion = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("node_face").getChildByName("node_myFace").getChildByName("sprite_myEmotion");
    this.lab_my_qph = this.sprite_my_qph.getChildByName("lab_my_qph");
    this.time_green.fillRange = 0;
    this.time_yellow.fillRange = 0;
    this.time_green.node.active = false;
    this.time_yellow.node.active = false;
    this.overTimeNode.active = false;
    this.nodePos = this.node.getPosition();
    this.coinBG = this.node.getChildByName('coinMask').getChildByName('coin'); //金币图片类型

    if (GlobalCfg.ACT_SCENE_CTRL.entrycondition == 0) {
      this.coinBG.active = false;
    } //点击玩家弹出图像


    this.node.on(cc.Node.EventType.TOUCH_START, function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showUserIU(_this.imgUrl, _this.nickname, _this.coin, GlobalCfg.ACT_SCENE_CTRL.entrycondition);
    }, this);
  },
  onDestroy: function onDestroy() {
    clearInterval(this.myVar);
  },
  //倒计时
  countDown: function countDown(isShow, roundTime, extraTime, isGameOver, playerstatus) {
    var _this2 = this;

    if (roundTime === void 0) {
      roundTime = 0;
    }

    if (extraTime === void 0) {
      extraTime = 0;
    }

    if (isGameOver === void 0) {
      isGameOver = false;
    }

    clearInterval(this.myVar);
    this.myVar = null;
    this.callback = null;

    if (playerstatus == 5) {
      //已完成摆牌
      return;
    }

    this.shouZhiCount = true;
    var tempRoundTime = roundTime;
    var tempExtraTime = extraTime ? extraTime : 0;
    var roundTimelememt = roundTime == 0 ? 0 : (1 / 20).toFixed(3); //0.1 为下方计时器的刷新时间

    var extraTimelememt = extraTime == 0 ? 0 : (1 / 30).toFixed(3);
    var time = roundTime + 1;
    var time01 = tempExtraTime;

    if (isShow) {
      this.time_green.node.active = true;
      this.time_yellow.node.active = false;
      this.overTimeNode.active = true;
      this.lab_roundTime.string = tempRoundTime;
      this.lab_allTime.string = tempExtraTime;
      this.time_green.fillRange = roundTimelememt * tempRoundTime;
      this.time_yellow.fillRange = extraTimelememt * tempExtraTime;

      if (roundTime == 0) {
        this.time_green.node.active = false;
      }

      if (isGameOver == true) {
        this.time_green.node.getChildByName("ovel_green").active = false;
        this.time_yellow.node.getChildByName("ovel_yellow").active = false;
        this.overTimeNode.active = false;
        this.lab_roundTime.node.active = false;
        this.lab_allTime.node.active = false;
      } else {
        this.time_green.node.getChildByName("ovel_green").active = true;
        this.time_yellow.node.getChildByName("ovel_yellow").active = true;
        this.overTimeNode.active = true;
        this.lab_roundTime.node.active = true;
        this.lab_allTime.node.active = true;
      }
    } else {
      this.time_green.node.active = false;
      this.time_yellow.node.active = false;
      this.overTimeNode.active = false;
      return;
    }

    this.callback = function () {
      if (tempRoundTime <= 0) {
        if (tempExtraTime > 0) {
          //还有额外时间
          _this2.time_green && (_this2.time_green.node.active = false);
          _this2.time_yellow && (_this2.time_yellow.node.active = true);

          if (_this2.time_yellow && _this2.time_yellow.fillRange >= extraTimelememt) {
            _this2.time_yellow.fillRange = extraTimelememt * time01;

            _this2.fillRangeRoundTime(extraTimelememt, 2);
          }

          _this2.lab_time_yellow && (_this2.lab_time_yellow.string = tempExtraTime.toFixed(0));
          _this2.lab_allTime && (_this2.lab_allTime.string = tempExtraTime.toFixed(0));
          tempExtraTime && (tempExtraTime -= 1);
          time01--;
        } else {
          if (_this2.myVar != null) {
            //判断计时器是否为空
            clearInterval(_this2.myVar);
            _this2.myVar = null;
            _this2.callback = null;
            _this2.lab_time_yellow && (_this2.lab_time_yellow.string = 0);
            _this2.lab_allTime && (_this2.lab_allTime.string = 0);
            _this2.time_green && (_this2.time_green.node.active = false);
            _this2.time_yellow && (_this2.time_yellow.node.active = true);
            _this2.overTimeNode && (_this2.overTimeNode.active = true);
          }
        }
      } else {
        time--;
        _this2.time_green && (_this2.time_green.fillRange = roundTimelememt * time);

        _this2.fillRangeRoundTime(roundTimelememt, 1);

        _this2.lab_roundTime && (_this2.lab_roundTime.string = tempRoundTime.toFixed(0));
        tempRoundTime && (tempRoundTime -= 1);

        if (tempRoundTime && tempRoundTime <= 8 && _this2.shouZhiCount && !GlobalCfg.ACT_SCENE_CTRL.isPickOneCard) {
          _this2.shouZhiCount = false;
          GlobalCfg.ACT_SCENE_CTRL.showLobbyUI("shouZhi", true);
        }
      }
    };

    this.myVar = setInterval(this.callback, 1000);
  },
  fillRangeRoundTime: function fillRangeRoundTime(roundTimelememt0, nodeNum) {
    var roundTimelememt = Number(roundTimelememt0) / 5;
    var num = 0;
    this.unschedule(this.callbackCion);

    this.callbackCion = function () {
      num++;

      if (num >= 5) {
        num = 0;
        this.unschedule(this.callbackCion);
      } else {
        if (nodeNum == 1) {
          this.time_green.fillRange -= roundTimelememt;
        } else {
          this.time_yellow.fillRange -= roundTimelememt;
        }
      }
    };

    this.schedule(this.callbackCion, 0.2);
  },
  setUserInfo: function setUserInfo(userinfo, seat) {
    if (seat === void 0) {
      seat = 0;
    }

    var relativeSeatId = 0;

    if (GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6) {
      relativeSeatId = GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(seat);
    } else {
      relativeSeatId = seat;
    }

    this.setPlayerState(userinfo.playerStatus);
    this.displayName = userinfo.displayName;
    this.sex = userinfo.sex;
    this.setCoin(userinfo.diamond);
    this.setPlayerId(userinfo.playerId);
    this.nickname = userinfo.nickname;

    if (relativeSeatId >= 0) {
      this.setSeatId(relativeSeatId);
    }

    if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
      this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 76, this.tx);
    } else {
      LoggerUtil.getInstance().log("收到的头像URL为空！");
      this.loadHeadSp(userinfo.imgUrl, 76, this.tx);
    }

    this.imgUrl = userinfo.imgUrl;
    this.setScore(0);

    if (userinfo.vipLevel >= 1 && userinfo.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + userinfo.vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }

    ;
  },
  getNickName: function getNickName() {
    LoggerUtil.getInstance().log("自己的NickName", this.nickname);
    var lab_string = CommonFun.getInstance().getStrByLength(this.nickname, 8);
    return lab_string;
  },
  //设置玩家的状态 0正常,1弃牌, 2胡,3炸胡,4观战
  setPlayerState: function setPlayerState(state) {
    this.playerStatus = state;
    this.checkPlayerState(state);
  },
  getPlayerState: function getPlayerState() {
    return this.playerStatus;
  },
  //根据不同的状态设置
  checkPlayerState: function checkPlayerState(state) {
    switch (state) {
      case 0:
        // this.state_mask.active = false;
        break;

      case 1:
        // this.state_mask.active = true;
        break;

      case 2:
        break;

      case 3:
        break;

      case 4:
        break;

      default:
        // this.state_mask.active = false;
        break;
    }
  },
  setPlayerId: function setPlayerId(playerid) {
    this.playerid = playerid;
  },
  getPlayerId: function getPlayerId() {
    if (!this.playerid) {
      return null;
    }

    return this.playerid;
  },
  setSeatId: function setSeatId(data) {
    LoggerUtil.getInstance().log("设置自己座位号！", data);
    this.seatId = data;
  },
  getSeatId: function getSeatId() {
    return this.seatId;
  },
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this3 = this;

    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this3) && cc.isValid(heaSprite)) {
          heaSprite.spriteFrame = new cc.SpriteFrame(texture);
          heaSprite.node.setScale(realWidth / heaSprite.node.width);
        }
      });
    }
  },
  getTxUrl: function getTxUrl() {
    return this.imgUrl;
  },
  setCoin: function setCoin(coin) {
    this.coin = coin / 100;

    if (this.lab_jb && coin != null) {
      this.lab_jb.string = CommonFun.getInstance().numberToShow(this.coin); // this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);

      if (GlobalCfg.ACT_SCENE_CTRL.entrycondition != 0) {
        GlobalCfg.USER_DATAS.userDiamond = coin;
      }
    }
  },
  setScore: function setScore(score) {
    this.score = score;
    this.lab_score.string = score;
  },
  getScore: function getScore() {
    return this.score;
  },
  start: function start() {},
  // 处理弃牌或者摆牌的广播
  gameDropOrFinalcards: function gameDropOrFinalcards(notify, isDrop) {
    var curSeat = GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(notify.seat);

    if (curSeat == this.seatId) {
      if (isDrop) {
        //弃牌
        this.setPlayerState(1);
      }

      this.setCoin(notify.afterCalc);
      var coinMask = this.node.getChildByName("coinMask");
      coinMask.setPosition(0, 0);
      var lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label);
      lab_coin.string = Math.abs(notify.calc) / 100;
      coinMask.opacity = 0;
      coinMask.active = true;
      cc.tween(coinMask).tag(10 + this.seatId).to(0.3, {
        opacity: 255
      }, {
        easing: 'fade'
      }).to(0.7, {
        position: cc.v2(0, 250)
      }, {
        easing: 'cubicIn'
      }).start();
      this.countDown(false);
    }
  },
  gameover: function gameover(notify, score) {
    var _this4 = this;

    var winSeat = notify.singleEventSeat;
    var newScore = Math.abs(score);
    var win_anim = this.node.getChildByName("win_anim");
    var img_winner = win_anim.getChildByName("img_winner");
    var star = win_anim.getChildByName("star");
    star.active = false;
    img_winner.setPosition(0, -43);
    var coinMask = this.node.getChildByName("coinMask"); // coinMask.setPosition(0,0)

    var lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label);
    lab_coin.string = newScore / 100; // 炸胡

    if (notify.reason == 1) {
      var settleMent;

      if (GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement")) {
        settleMent = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement");
      } else {
        settleMent = cc.instantiate(GlobalCfg.ACT_SCENE_CTRL.prefab_jiesuan);
      }

      var settleMentCtrl = null;

      if (GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6) {
        settleMentCtrl = settleMent.getComponent("settlementCtrl_6");
        settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl);
      } else {
        settleMentCtrl = settleMent.getComponent("settlementCtrl");
        settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl, GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl);
      }

      LoggerUtil.getInstance().log("当前的singleEventSeat座位ID：", this.seatId, settleMentCtrl);
      settleMent.parent = GlobalCfg.ACT_SCENE_CTRL.node;
    } else {
      LoggerUtil.getInstance().log("执行UserCtrl的 GAMEOVER ！");

      if (winSeat == GlobalCfg.ACT_SCENE_CTRL.selfAbsoluteSeatId) {
        this.lab_01.string = "";
        this.lab_02.string = "";
        GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("rummyWin");
        var spine = GlobalCfg.ACT_SCENE_CTRL.skeleDataMap.get("winner_zj");
        this.win.skeletonData = spine;
        this.win.setAnimation(0, "star", false);
        this.win.setCompleteListener(function (trackEntry, loopCount) {
          var name = trackEntry.animation.name;

          if (name == "star") {
            _this4.win.setAnimation(0, "loop", true);

            _this4.scheduleOnce(function () {
              this.win.setAnimation(0, "out", false);
            }, 1);
          } else if (name == "out") {
            coinMask.active = false;

            var _settleMent;

            if (GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement")) {
              _settleMent = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement");
            } else {
              _settleMent = cc.instantiate(GlobalCfg.ACT_SCENE_CTRL.prefab_jiesuan);
            }

            var _settleMentCtrl = null;

            if (GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6) {
              _settleMentCtrl = _settleMent.getComponent("settlementCtrl_6");

              _settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl);
            } else {
              _settleMentCtrl = _settleMent.getComponent("settlementCtrl");

              _settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl, GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl);
            }

            LoggerUtil.getInstance().log("当前的singleEventSeat座位ID：", _this4.seatId, _settleMentCtrl);
            _settleMent.parent = GlobalCfg.ACT_SCENE_CTRL.node;
          }
        });
      } else {
        coinMask.active = true;
        var pos = GlobalCfg.ACT_SCENE_CTRL.getOtherNodeCtrlBySeat(winSeat).getPosition();
        var posToWorld = GlobalCfg.ACT_SCENE_CTRL.node.convertToWorldSpaceAR(pos);
        LoggerUtil.getInstance().log("=======未转换前赢家的位置：", pos, "posToWorld:" + posToWorld);
        var pos_end = this.node.convertToNodeSpaceAR(posToWorld);
        LoggerUtil.getInstance().log("UserInfo----赢家的位置：", pos_end);

        if (coinMask.x == 0 && coinMask.y == 0) {
          cc.Tween.stopAllByTag(10 + this.seatId);
          cc.tween(coinMask).to(0.3, {
            opacity: 255
          }, {
            easing: 'fade'
          }).to(0.7, {
            position: cc.v2(0, 250)
          }, {
            easing: 'cubicIn'
          }).to(0.7, {
            position: pos_end
          }, {
            easing: 'cubicIn'
          }).to(0.5, {
            opacity: 0
          }, {
            easing: 'fade'
          }).start();
        } else {
          coinMask.opacity = 255;
          coinMask.setPosition(0, 250);
          cc.tween(coinMask) // .to(0.5, { opacity:255 },{easing: 'fade'})
          // .to(0.7, { position: cc.v2(0, 130)},{easing: 'cubicIn'})
          .delay(1).to(0.7, {
            position: pos_end
          }, {
            easing: 'cubicIn'
          }).to(0.5, {
            opacity: 0
          }, {
            easing: 'fade'
          }).start();
        }
      }
    }
  },
  // 发送表情  消息类型 0短语 1表情
  face: function face(notify) {
    var _this5 = this;

    var data = notify;
    var msgtype = notify.msgType;
    var msgid = data.name;

    if (msgtype == 0) {
      this.lab_my_qph.stopAllActions();
      this.sprite_my_qph.active = true;
      this.lab_my_qph.setPosition(156, 6);
      this.lab_my_qph.getComponent(cc.Label).string = msgid;
      cc.tween(this.lab_my_qph).to(3, {
        position: cc.v2(-105, 6)
      }).call(function () {
        _this5.sprite_my_qph.active = false;
      }).start();
    } else if (msgtype == 1) {
      this.sprite_myEmotion.stopAllActions();
      this.sprite_myEmotion.active = true;
      this.sprite_myEmotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
      cc.tween(this.sprite_myEmotion).repeat(4, cc.tween().by(0.5, {
        position: cc.v2(0, -5)
      }).by(0.5, {
        position: cc.v2(0, 5)
      })).call(function () {
        _this5.sprite_myEmotion.getComponent(cc.Sprite).spriteFrame = null;
      }).start();
    }
  } // update (dt) {},

});

cc._RF.pop();