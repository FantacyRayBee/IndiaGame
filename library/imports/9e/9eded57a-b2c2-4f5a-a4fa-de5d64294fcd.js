"use strict";
cc._RF.push(module, '9ededV6ssJPWqT63l1kKU/N', 'rummy_6');
// Rummy/rummyScript/rummy_6.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    prefab_pai: cc.Prefab,
    spriteAtlas_pai: cc.SpriteAtlas,
    poke_back: cc.SpriteFrame,
    prefab_tishi: cc.Prefab,
    prefab_tishi_finish: cc.Prefab,
    prefab_jiesuan: cc.Prefab,
    pab_chat: cc.Prefab,
    prefab_bar: cc.Prefab,
    spriteAtlas_colorBar: cc.SpriteAtlas,
    btn_openMenu: cc.Button,
    btn_tableInfo: cc.Button
  },
  ctor: function ctor() {
    this.isCCGameEventHideStutas = false;
    this.selfAbsoluteSeatId = 0; //自己的绝对座位ID

    this.huSeat = true; // 是否胡牌

    this.isChange = false; // 游戏结算动画播完才能换桌

    this.isTuiChu = true; // ture 是直接退出游戏  falae是投降

    this.dealCount = 13; //发牌的数目

    this.groupObject = {
      group: "",
      type: "",
      node: cc.Node
    };
    this.isSelfTurn = false; //是否是自己操作的回合      

    this.isPickOneCard = false; //是否已经摸了一张牌

    this.barCount = 0; //记录bar的数量

    this.isKicked = false; // 结算超时被踢

    /**
     * 是自己回合，点击摸牌，发送起牌的消息请求，收到牌之后，isPickOneCard = true,再点击弹消息          【"you have already picked a card"】
     * 不是自己回合，点击摸牌，this.isSelfTurn = false，弹消息                                       【"please wait for your turn"】
     */

    this.paiZIndexArr = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73];
    this.continueCount = 0;
    this.paiGroupArr = []; //存放手牌的数组

    this.userArryNode = []; //发送表情使用的数组，存放所有玩家节点

    this.clickPaiArr = []; //点击起来的牌组

    this.textArr = [otherLanguage.rummyTisp_01[language], otherLanguage.rummyTisp_02[language], //从关闭或者公开的牌库中拾取
    otherLanguage.rummyTisp_03[language], //你已经选了一张牌    
    otherLanguage.rummyTisp_04[language], //你确定要申报嘛？
    otherLanguage.rummyTisp_06[language], //xxx已经宣布将您的卡分组并申报
    "Please wait for all the players to declare.", //请等待所有玩家申报
    otherLanguage.rummyTisp_05[language], //请等待你的回合
    otherLanguage.rummyTisp_07[language], //等待玩家加入游戏（下一局时，对方未准备时）
    otherLanguage.rummyTisp_01[language], // 等待其他玩家加入游戏
    "Your balance is under min Entry"];
    this.tempOpenSpriteFrame = null; //存放右边open区域牌的精灵

    this.tidyFinalCardsAck = false; //是否收到最后摆牌的ACK

    this.tweenTagArr = [1, //actionFirstPai  1054
    2, //OutCard   1326
    3, //对家出牌   1406
    4, //设置坐标   1565
    5, //按钮从下方滑上来 1776
    6, //发牌  1813
    7, //翻转扑克牌 1842
    8, //移动至close的位置 1863
    9, //移动至close的位置 1922
    10];
    this.lastGameLifeCount = 0; //上一次组牌的生命序列数目

    this.nowGameLifeCount = 0; //这一次组牌的生命序列数目

    this.paiDistance = 60;
    this.groupDistance = 25;
    this.upClickDistance = 20;
    this.upLimitDistance = 112.3;
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().checkShiPei(this.node);
    LoggerUtil.getInstance().log("执行 6 人场脚本 onLoad() ");
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.rummyBundle = cc.assetManager.getBundle('Rummy');
    this.rummyRoomData = JSON.parse(cc.sys.localStorage.getItem('rummyRoomData'));
    this.entrycondition = this.rummyRoomData.entrycondition;
    this.isPractice = this.entrycondition == 0 ? true : false;
    this.initNode();
    this.loadSkeleData();
    this.initCardPool();
    this.paymentSwitch = false;
    this.cashSwitch();
    this.pushpaysuccess = ClientNotify.register("PUSHPAYSUCCESS", this.onEventMsg, this);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onPaiEventMsg, this);
  },
  start: function start() {
    LoggerUtil.getInstance().log("执行 6 人场脚本 start() ");
    GlobalCfg.ACT_SCENE_CTRL = this;
    cc.game.on(cc.game.EVENT_HIDE, function () {
      LoggerUtil.getInstance().log("游戏进入后台");
      this.isCCGameEventHideStutas = true;
      window.isNeedShowRoomList = "rummy";
      GameServerManager.hideFilterMag(1);
      this.unscheduleAllCallbacks(); // this.tsetCrad();

      this.paiGroupArr = [];
      this.putSelfCardToPool();
      this.openNode.active = false;
      this.closeNode.active = false;
      this.initNodeState(false);
      this.userInfoCtrl && this.userInfoCtrl.countDown(false);

      for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
        var otherUserNode = this.playersNode.children[i];
        var otherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
        otherUserCtrl && otherUserCtrl.countDown(false);
      }
    }, this);
    var self = this;
    cc.game.on(cc.game.EVENT_SHOW, function () {
      LoggerUtil.getInstance().log("重新返回游戏"); // if (GameServerManager.socket == null) {
      //     GameServerManager.connectServer();
      // }

      if (this.isCCGameEventHideStutas == false) {
        return;
      }

      ;
      GameServerManager.hideFilterMag(2, function () {
        self.isCCGameEventHideStutas = false;
        GameServerManager.send("gameservice.refreshgamescene", "RefreshGameSceneReq", {});
      });
    }, this);

    if (this.node && GlobalCfg.SMALL_GAME_DATAS.rummyData.notify) {
      this.check_newPlayerJoinData(GlobalCfg.SMALL_GAME_DATAS.rummyData.notify);
    }

    this.enterRoomReq();
  },
  initNode: function initNode() {
    this.node_recorderCard_6 = this.node.getChildByName("node_recorderCard_6");
    this.btn_cardListShow = this.node.getChildByName("btn_cardListShow").getComponent(cc.Button);
    this.ske_shouZhi_close = this.node.getChildByName("close").getChildByName("ske_shouzhi"); // 左边手指动画

    this.ske_shouZhi_open = this.node.getChildByName("open").getChildByName("ske_shouzhi"); // 右边手指动画

    this.ske_close_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_01"); // 左边牌发光动画

    this.ske_cardLib_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_02"); // 中间牌发光动画

    this.ske_open_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_03"); // 右边手指动画

    this.anim_sanjiao_01 = this.ske_close_guang.getChildByName("arri_01");
    this.anim_sanjiao_02 = this.ske_cardLib_guang.getChildByName("arri_01");
    this.anim_sanjiao_03 = this.ske_open_guang.getChildByName("arri_01");
    this.animArr = [this.anim_sanjiao_01, this.anim_sanjiao_02, this.anim_sanjiao_03];

    for (var i = 0; i < this.animArr.length; i++) {
      this.animArr[i].setPosition(0, 114);
      cc.tween(this.animArr[i]).tag(1).repeat(1000000, cc.tween().tag(1).by(0.5, {
        position: cc.v2(0, -10)
      }).by(0.5, {
        position: cc.v2(0, 10)
      })).start();
    }

    this.recorderCardCtrl_6 = this.node_recorderCard_6.getComponent('recorderCardCtrl_6'); // 记牌器的脚本

    this.rummyAudioCtrl = this.node.getChildByName("rummyAudio").getComponent('rummyAudio'); //播放声音脚本

    this.btn_wf = this.node.getChildByName("btn_wanfa").getComponent(cc.Button);
    this.btn_shop = this.node.getChildByName("btn_shop").getComponent(cc.Button);
    this.btn_chat = this.node.getChildByName("btn_chat").getComponent(cc.Button);
    this.btnNode = this.node.getChildByName("btnNode");
    this.btn_drop = this.btnNode.getChildByName("btn_drop").getComponent(cc.Button);
    this.btn_finish = this.btnNode.getChildByName("btn_finish").getComponent(cc.Button);
    this.btn_group = this.btnNode.getChildByName("btn_group").getComponent(cc.Button);
    this.btn_discard = this.btnNode.getChildByName("btn_discard").getComponent(cc.Button);
    this.userNode = this.node.getChildByName("userNode"); //玩家自己

    this.userInfoCtrl = this.userNode.getComponent("rummyUserInfoCtrl"); //玩家信息控制脚本

    this.userInfoCtrl.setSeatId(0);
    this.btn_gift = this.userNode.getChildByName("btn_gift").getComponent(cc.Button);
    this.lab_jb = this.userNode.getChildByName("score_bg").getChildByName("lab_jb").getComponent(cc.Label);
    this.playersNode = this.node.getChildByName("players"); //存放除自己以外玩家节点

    for (var _i = 0, len = this.playersNode.children.length; _i < len; _i++) {
      var otherUserNode = this.playersNode.children[_i];
      otherUserNode.active = true;
      var otherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
      otherUserCtrl.setSeatId(_i + 1); //初始化座位号 1-5

      var btn_gift_other = otherUserNode.getChildByName("tx_k").getChildByName("btn_gift_other").getComponent(cc.Button);
      btn_gift_other.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    } // this.otherNode = this.playersNode.getChildByName("otherNode");     //对战玩家
    // otherUserCtrl     //对战玩家信息控制脚本


    this.closeNode = this.node.getChildByName("close"); //扣着的牌，待发的牌

    this.btn_close = this.closeNode.getChildByName("btn_pickCard").getComponent(cc.Button);
    this.lab_close = this.closeNode.getChildByName("lab_close").getComponent(cc.Label);
    this.bg_lab_close = this.closeNode.getChildByName("text_bg");
    this.laizi_closeNode = this.closeNode.getChildByName("universal_card");
    this.openNode = this.node.getChildByName("open"); //玩家出的牌

    this.btn_open = this.openNode.getChildByName("btn_open").getComponent(cc.Button);
    this.lab_open = this.openNode.getChildByName("lab_open").getComponent(cc.Label);
    this.bg_lab_open = this.openNode.getChildByName("text_bg"); // 区别

    this.bg_lab_close.active = false;
    this.lab_close.node.active = false;
    this.bg_lab_open.active = false;
    this.lab_open.node.active = false;
    this.openPaiNode = this.openNode.getChildByName("open_card");
    this.cardMask = this.openPaiNode.getChildByName('mask');
    this.selfCardNode = this.node.getChildByName("card"); //手牌

    this.cardLibNode = this.node.getChildByName("cardLib"); //牌库，开始时发牌

    this.line = this.node.getChildByName("line");
    this.node_prop = this.node.getChildByName('node_prop').getChildByName('prop').getChildByName("node_all"); // 是否显示聊天动画

    var array = [this.btn_wf, this.btn_shop, this.btn_chat, this.btn_drop, this.btn_finish, this.btn_group, this.btn_discard, this.btn_gift, this.btn_close, this.btn_open, this.btn_cardListShow];

    for (var _i2 = 0; _i2 < array.length; _i2++) {
      var btn = array[_i2]; // btn.node.on('click', this.btnClick, this);

      btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    }

    ;
    this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_tableInfo.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.initNodeState(false);
  },
  //  下载骨骼动画
  loadSkeleData: function loadSkeleData() {
    var _this = this;

    this.skeleDataMap = new Map();
    this.assetBundle = cc.assetManager.getBundle('Rummy');

    if (this.assetBundle) {
      var skeleArr = ['rummySke/winner_zj', 'rummySke/winner_dj'];

      for (var index = 0; index < skeleArr.length; index++) {
        var url = skeleArr[index];
        this.assetBundle.load(url, sp.SkeletonData, function (err, asset) {
          if (!err) {
            if (asset._name && _this.skeleDataMap) {
              _this.skeleDataMap.set(asset._name, asset);
            }
          }
        });
      }
    }
  },
  //初始化节点状态
  initNodeState: function initNodeState(bool) {
    // this.round = 0;
    this.node_recorderCard_6.active = false;
    this.openNode.active = false;
    this.closeNode.active = false;
    this.cardLibNode.active = false; //开始时显示，做发牌动作

    this.line.active = false; //出牌线

    this.btnNode.setPosition(0, -120);
    this.cardLibNode.getComponent(cc.Sprite).spriteFrame = this.poke_back;
    this.clickPaiArr.length = 0;

    if (!bool) {
      this.tableStatus = 0;
      this.putSelfCardToPool();
    }

    this.setDropScore(this.round);
    this.isPickOneCard = false;
    this.tidyFinalCardsAck = false;

    if (this.node.getChildByName("pai")) {
      this.node.getChildByName("pai").destroy();
    }

    if (this.node.getChildByName('tishi_finish')) {
      this.node.getChildByName('tishi_finish').destroy();
    }

    for (var i = 0; i < this.node.children.length; i++) {
      var childNode = this.node.children[i];

      if (childNode.name == "pai") {
        this.onCardRemoved(childNode);
      }
    }
  },
  //初始化对象池
  initCardPool: function initCardPool() {
    this.cardPool = new cc.NodePool();
    var initCount = 17;

    for (var i = 0; i < initCount; i++) {
      var card = cc.instantiate(this.prefab_pai);
      this.paiWidth = card.width;
      this.cardPool.put(card);
    }
  },
  createPaiNode: function createPaiNode() {
    var card = null;

    if (this.cardPool.size > 0) {
      card = this.cardPool.get();
    } else {
      card = cc.instantiate(this.prefab_pai);
    }

    return card;
  },
  //将对象返回对象池
  onCardRemoved: function onCardRemoved(card) {
    if (card) {
      if (this.cardPool) {
        this.cardPool.put(card);
      } else {
        card.destroy();
      }
    }
  },
  btnClick: function btnClick(button) {
    var _this2 = this;

    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_tableInfo") {
      //添加玩法的预制体
      var self = this;
      this.rummyBundle.load('rummyPab/roomInfo', function (err, prefab) {
        if (err) {
          LoggerUtil.getInstance().error("玩法预制体生成错误！！");
          return;
        } else {
          var pab_rule = cc.instantiate(prefab);
          var roomInfoCtrl = pab_rule.getComponent('roomInfoCtrl');
          roomInfoCtrl.setValue(); //此处传参（房间底分）

          cc.director.getScene().getChildByName("Canvas_rummy").addChild(pab_rule);
        }
      });
    } else if (btnName == "btn_shop") {
      if (this.entrycondition == 0) {
        // 体验场充值
        CommonFun.getInstance().showSmallAddExperience();
      } else {
        // 真金场充值
        CommonFun.getInstance().showSmallAddCash("rummy", this.cellScore * 100);
      }

      ;
    } else if (btnName == "btn_chat") {
      var pab_chat = cc.instantiate(this.pab_chat);
      var ctrl = pab_chat.getComponent("chatCtrl");
      ctrl.setPlayerSeat(this.changeRelativeSeatIdToAbsolute(this.userInfoCtrl.getSeatId()));
      this.node.addChild(pab_chat);
    } else if (btnName == "btn_drop") {
      this.isTuiChu = false;
      CommonFun.getInstance().showMsgBox("Are you sure you want to drop?", "YES_NO", function () {
        // 发送结算消息
        _this2.dropReq();
      }, false);
    } else if (btnName == "btn_finish") {
      // LoggerUtil.getInstance().log("finish按钮时的clickArr", this.clickPaiArr);
      this.finishCardData = {
        groupTag: this.clickPaiArr[0].groupTag,
        paiIndex: this.clickPaiArr[0].groupIndex,
        paiValue: this.clickPaiArr[0].paiValue
      };
      var value = this.clickPaiArr[0].paiValue;
      this.finishAction(this.clickPaiArr[0]);
      this.checkScore(value);
    } else if (btnName == "btn_group") {
      this.clickPaiArr.sort(function (a, b) {
        return a.groupIndex - b.groupIndex;
      });
      var group = [];

      for (var i = this.clickPaiArr.length - 1; i >= 0; i--) {
        var data = this.clickPaiArr[i];

        if (!this.paiGroupArr[data.groupTag]) {
          this.setPaiNodeIndex(this.paiGroupArr);
          return;
        }

        for (var j = 0, len = this.paiGroupArr[data.groupTag].length; j < len; j++) {
          var paiNode = this.paiGroupArr[data.groupTag][j];

          if (paiNode) {
            var src = paiNode.getComponent("paiCtrl");
            var paiValue = src.getPaiValue();

            if (paiValue == data.paiValue) {
              var tempArr = this.paiGroupArr[data.groupTag].splice(j, 1);
              group.push(tempArr[0]);
            }
          }
        }

        continue; // let tempArr = this.paiGroupArr[data.groupTag].splice(data.groupIndex, 1);
        // group.push(tempArr[0]);
      }

      for (var _i3 = 0; _i3 < group.length; _i3++) {
        var _paiNode = group[_i3];

        if (_paiNode) {
          var _src = _paiNode.getComponent("paiCtrl");

          var _paiValue = _src.getPaiValue();

          LoggerUtil.getInstance().log(_i3 + "选择组牌的牌值为：" + this.getPaiNum(_paiValue) + " , paiValue = " + _paiValue);
        }
      }

      group.sort(function (a, b) {
        if (a && b) {
          var paiValueA = a.getComponent("paiCtrl").getPaiValue();
          var paiValueB = b.getComponent("paiCtrl").getPaiValue();

          var paiNumA = _this2.getPaiNum(paiValueA);

          var paiNumB = _this2.getPaiNum(paiValueB);

          if (paiNumA < paiNumB) {
            // 按某种排序标准进行比较, a 小于 b
            return -1;
          }

          if (paiNumA > paiNumB) {
            return 1;
          }

          return 0;
        }
      });
      var type = this.checkGroupLiftBar(group); // 防止数组中有空值

      for (var _i4 = 0; _i4 < this.paiGroupArr.length; _i4++) {
        var arr = this.paiGroupArr[_i4];

        if (arr) {
          if (arr.length == 0) {
            this.paiGroupArr.splice(_i4, 1);
          }
        } else {
          this.paiGroupArr.splice(_i4, 1);
        }
      }

      if (type == 1 || type == 2 || type == 3) {
        GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zupaichenggong");
      } else {
        GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zupai");
      }

      this.paiGroupArr.splice(0, 0, group);

      if (this.paiGroupArr.length > 6) {
        this.clickPaiArr.sort(function (a, b) {
          return a.groupTag - b.groupTag;
        });
        var a = this.clickPaiArr[0].groupTag;

        if (a == this.paiGroupArr.length - 2) {
          //点起来的是最后面一个组的几张牌
          var aArr = this.paiGroupArr[a].concat(this.paiGroupArr[a + 1]);
          this.paiGroupArr[a] = aArr;
          this.paiGroupArr.length -= 1;
        } else if (a == 0) {
          //点起的是最左边的组
          var _aArr = this.paiGroupArr[a + 1].concat(this.paiGroupArr[a + 2]);

          this.paiGroupArr[a + 1] = _aArr;

          for (var _i5 = a + 2; _i5 < this.paiGroupArr.length; _i5++) {
            this.paiGroupArr[_i5] = this.paiGroupArr[_i5 + 1];

            if (_i5 + 1 == this.paiGroupArr.length - 1) {
              this.paiGroupArr.length -= 1;
              LoggerUtil.getInstance().log("合并数组完毕");
              break;
            }
          }
        } else {
          var _aArr2 = this.paiGroupArr[a + 1].concat(this.paiGroupArr[a + 2]);

          this.paiGroupArr[a + 1] = _aArr2;

          for (var _i6 = a + 2; _i6 < this.paiGroupArr.length; _i6++) {
            this.paiGroupArr[_i6] = this.paiGroupArr[_i6 + 1];

            if (_i6 + 1 == this.paiGroupArr.length - 1) {
              this.paiGroupArr.length -= 1;
              LoggerUtil.getInstance().log("合并数组完毕");
              break;
            }
          }
        }
      }

      for (var _i7 = 0; _i7 < this.paiGroupArr.length; _i7++) {
        var _arr = this.paiGroupArr[_i7];

        if (_arr) {
          if (_arr.length == 0) {
            this.paiGroupArr.splice(_i7, 1);
          }
        } else {
          this.paiGroupArr.splice(_i7, 1);
        }
      } // this.setPaiNodeIndex(this.paiGroupArr);


      this.lifeBar(this.paiGroupArr, true);
      this.clickPaiArr.length = 0;
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
      var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
      this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr, true);
      this.reqMovehandgroup(this.paiGroupArr);
    } else if (btnName == "btn_discard") {
      if (this.clickPaiArr.length == 1) {
        var _data = this.clickPaiArr[0];
        var index = [1, _data.groupTag, _data.groupIndex].join('');
        this.outCardReq(_data.paiValue, parseInt(index));
      }
    } else if (btnName == "btn_gift") {
      CommonFun.getInstance().showGameGifInteraction(this.selfAbsoluteSeatId);
    } else if (btnName == "btn_gift_other") {
      var otherUserNode = this.recursionFindParent(button.node, "otherNode");
      var otherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
      var seatId = otherUserCtrl.getSeatId();
      var launchID = this.changeRelativeSeatIdToAbsolute(seatId);
      CommonFun.getInstance().showGameGifInteraction(launchID);
    } else if (btnName == "btn_pickCard") {
      if (this.isSelfTurn == true) {
        //是自己回合，发送起牌的请求
        if (this.isPickOneCard == true) {
          //已经起了一张牌
          if (this.node.getChildByName("tishi")) {
            LoggerUtil.getInstance().log("当前提示存在！！");
            return;
          }

          var tishi = cc.instantiate(this.prefab_tishi);
          var tishiCtrl = tishi.getComponent("tishiCtrl");
          tishiCtrl.setTishi(this.textArr[2]);
          tishi.parent = this.node;
          setTimeout(function () {
            tishiCtrl.removeFromParentNode(_this2.node);
          }, 3000);
        } else {
          this.pickCardReq(0);
        }
      } else {
        if (this.node.getChildByName("tishi")) {
          LoggerUtil.getInstance().log("当前提示存在！！");
          return;
        }

        var _tishi = cc.instantiate(this.prefab_tishi);

        var _tishiCtrl = _tishi.getComponent("tishiCtrl");

        _tishiCtrl.setTishi(this.textArr[6]);

        _tishi.parent = this.node;
        setTimeout(function () {
          _tishiCtrl.removeFromParentNode(_this2.node);
        }, 3000);
      }
    } else if (btnName == "btn_open") {
      if (this.isSelfTurn == true) {
        //是自己回合，发送起牌的请求
        if (this.isPickOneCard == true) {
          //已经起了一张牌
          if (this.node.getChildByName("tishi")) {
            LoggerUtil.getInstance().log("当前提示存在！！");
            return;
          }

          var _tishi2 = cc.instantiate(this.prefab_tishi);

          var _tishiCtrl2 = _tishi2.getComponent("tishiCtrl");

          _tishiCtrl2.setTishi(this.textArr[2]);

          _tishi2.parent = this.node;
          setTimeout(function () {
            _tishiCtrl2.removeFromParentNode(_this2.node);
          }, 3000);
        } else {
          this.pickCardReq(1);
        }
      } else {
        if (this.node.getChildByName("tishi")) {
          LoggerUtil.getInstance().log("当前提示存在！！");
          return;
        }

        var _tishi3 = cc.instantiate(this.prefab_tishi);

        var _tishiCtrl3 = _tishi3.getComponent("tishiCtrl");

        _tishiCtrl3.setTishi(this.textArr[6]);

        _tishi3.parent = this.node;
        setTimeout(function () {
          _tishiCtrl3.removeFromParentNode(_this2.node);
        }, 3000);
      }
    } else if (btnName == "btn_cardListShow") {
      GameServerManager.send("gameservice.lookoutpool", "LookOutPoolReq", {});
    } else if (btnName == "btn_openMenu") {
      CommonFun.getInstance().showGameMenu();
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var _this3 = this;

    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId === "gameservice.enterroom") {
      // 进入房间
      self.RefreshGameSceneReq();
    } else if (msgId === "gameservice.changetable") {
      //换桌
      self.changetable();
    } else if (msgId === "gameservice.exitgame") {
      //退出游戏
      window.isNeedShowRoomList = "rummy";
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId === "gameservice.ready") {//准备
    } else if (msgId === "gameservice.shortmessage") {//短消息
    } else if (msgId === "gameservice.onstartgametimer") {
      //游戏开始倒计时
      self.userInfoCtrl.lab_scoreName.string = "Score:";
      self.userInfoCtrl.lab_score.string = "0";
      self.isChange = false;
      self.tableStatus = 1;
      self.TipsLab();
      var settlement = self.node.getChildByName("settlement");

      if (settlement) {
        return;
      }

      var time = notify.time;
      LoggerUtil.getInstance().log("倒计时：：：：", time);
      var tishi = cc.instantiate(self.prefab_tishi);
      var tishiCtrl = tishi.getComponent("tishiCtrl");
      var arr = [otherLanguage.rummyTisp_11, otherLanguage.rummyTisp_10, otherLanguage.rummyTisp_09, otherLanguage.rummyTisp_08, otherLanguage.rummyTisp_13, otherLanguage.rummyTisp_12];
      tishiCtrl.setTishi(arr[time][language]);
      var myVar = setInterval(function () {
        if (!tishi) {
          clearInterval(myVar);
          return;
        }

        time--;

        if (time == 1) {
          _this3.tableStatus = 3;
        }

        tishiCtrl.setTishi(arr[time][language]);

        if (time == 0) {
          clearInterval(myVar);
          tishi.destroy();
          return;
        }
      }, 1000);
      tishi.parent = self.node;
    } else if (msgId === "gameservice.pickcard") {
      //起牌
      LoggerUtil.getInstance().log("起牌消息ACK", notify);
    } else if (msgId === "gameservice.outcard") {//出牌
    } else if (msgId == "gameservice.onplayerout") {
      //出牌广播(依据)
      LoggerUtil.getInstance().log("出牌广播，当前出牌玩家：", notify.seat, "nextSeat:", notify.nextSeat);
      self.OutCard(notify); // self.tsetCrad(notify, "outCrad");
    } else if (msgId === "gameservice.choosehu") {
      //胡牌，显示信息弹框  Please wait for all the players to declare
      if (self.node.getChildByName("settlement")) {
        if (self.node.getChildByName("tishi")) {
          self.node.getChildByName("tishi").destroy();
        }
      } else {// let tishi = cc.instantiate(self.prefab_tishi);
        // let tishiCtrl = tishi.getComponent("tishiCtrl");
        // tishiCtrl.setTishi(self.textArr[5]);
        // tishi.parent = self.node;
      } // self.finishAction(self.finishCardData);

    } else if (msgId === "gameservice.ongamecalc") {
      //游戏结算  展示结算界面
      if (self.node.getChildByName("tishi")) {
        self.node.getChildByName("tishi").destroy();
      }

      if (self.node.getChildByName("tishi_finish")) {
        self.node.getChildByName("tishi_finish").destroy();
      }

      self.check_onGamecalcData(notify); // self.tsetCrad(notify, "jieSuan")

      self.showLobbyUI("offCradGuang");
    } else if (msgId === "gameservice.ongamestart") {
      //游戏开始广播
      self.check_GameStartData(notify);
    } else if (msgId === "gameservice.onplayerpick") {
      //玩家起牌广播
      LoggerUtil.getInstance().log("起牌广播，当前起牌操作的座位号", notify.seat);
      self.check_PickCardData(notify); // self.tsetCrad(notify, "moCrad")
    } else if (msgId === "gameservice.onchoosehu") {
      //选择胡牌广播
      self.check_ChooseHuData(notify);
    } else if (msgId == "gameservice.refreshgamescene") {
      //游戏场景刷新,发牌也是根据这个
      self.unscheduleAllCallbacks();
      self.paiGroupArr = [];
      self.putSelfCardToPool();
      self.userInfoCtrl && self.userInfoCtrl.countDown(false);
      self.getAbsoluteSelfSeatId(notify);

      for (var i = 0, len = self.playersNode.children.length; i < len; i++) {
        var otherUserNode = self.playersNode.children[i];
        var otherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
        otherUserCtrl && otherUserCtrl.countDown(false);
      }

      self.userArryNode = self.getUserArrayNode(notify.players); // self.tsetCrad();

      self.check_GameSceneData(notify);
      var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100); // self.tsetCrad(notify, "gameStart");
    } else if (msgId == "gameservice.onplayerjoin") {
      //新玩家进入
      self.check_newPlayerJoinData(notify);
    } else if (msgId == "gameservice.onplayerleave") {
      //玩家退出广播
      var selfID = self.userInfoCtrl.getPlayerId();
      LoggerUtil.getInstance().log("selfID", selfID); //6人场其他玩家开局，将自己踢出游戏

      if (notify.uid == selfID && notify.reason == 3) {
        self.isKicked = true;
      } // for (let i = 0,len = this.playersNode.children.length; i < len; i++) {
      //     let otherNode = this.playersNode.children[i];
      //     let otherUserCtrl = otherNode.getComponent("rummyOtherUserCtrl");
      //     let otherID = otherUserCtrl.getPlayerId();
      //     if (otherID == notify.uid) {
      //         if(notify.reason == 0 || notify.reason == 2){
      //             self.otherUserCtrl.freshUser();
      //             let settlement = self.node.getChildByName("settlement_6")
      //             if (notify.reason != 2 && settlement == null) { self.TipsLab(8); }
      //         }
      //         return 
      //     }
      // }


      if (selfID == notify.uid && (notify.reason == 2 || notify.reason == 0)) {
        // let settlement = self.node.getChildByName("settlement_6");
        // if(settlement !== null){
        //     CommonFun.getInstance().showMsgBox(self.textArr[9], "YES", () => {
        //         settlement.destroy();
        //         window.isNeedShowRoomList = "rummy";
        //         SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        //     }, false);
        // } else {
        self.exitGame(); // }
      } else {
        var _otherUserCtrl = self.getOtherNodeCtrlByPlayerId(notify.uid);

        if (notify.reason == 0 || notify.reason == 2) {
          _otherUserCtrl.freshUser();

          var _settlement = self.node.getChildByName("settlement_6");

          if (notify.reason != 2 && _settlement == null) {
            self.TipsLab(8);
          }
        }
      }
    } else if (msgId == "gameservice.drop") {
      //弃牌
      LoggerUtil.getInstance().log("玩家已弃牌");
      self.exitGame(); // self.playdrop();
    } else if (msgId == "gameservice.setcontinue") {
      //继续下一局
      LoggerUtil.getInstance().log("继续下一局！！！");

      if (self.node.getChildByName("settlement")) {
        self.node.getChildByName("settlement").destroy();
        self.userInfoCtrl.lab_scoreName.string = "Score:";
        self.userInfoCtrl.lab_score.string = "0";
      } else {
        window.isNeedShowRoomList = "rummy";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
      }

      var isShowTips = false;

      for (var _i8 = 0, _len = self.playersNode.children.length; _i8 < _len; _i8++) {
        var otherNode = self.playersNode.children[_i8];

        var _otherUserCtrl2 = otherNode.getComponent("rummyOtherUserCtrl");

        if (_otherUserCtrl2.isUserGame) {
          self.TipsLab(8);
          isShowTips = true;
          break;
        }
      }

      if (!isShowTips) {
        self.TipsLab(7);
      }
    } else if (msgId === "gameservice.shortmessagenotify") {
      self.shortmessagenotify(notify);
    } else if (msgId == "gameservice.lookoutpool") {
      self.node_recorderCard_6.active = true;
      self.recorderCardCtrl_6.setRecorderData(notify, true);
    } else if (msgId == "gameservice.onflowrefresh") {
      //流局，刷新牌库
      self.freshNotifyCallback = function () {
        self.flowPaiAction(notify);
      };

      self.scheduleOnce(self.freshNotifyCallback, 1);
    } else if (msgId == "gameservice.tidyfinalcards") {
      LoggerUtil.getInstance().log("最后自己的摆牌的回调");

      if (self.node.getChildByName("tishi_finish")) {
        self.node.getChildByName("tishi_finish").destroy();
        self.userInfoCtrl.countDown(false);
      }

      self.tidyFinalCardsAck = true;
    } else if (msgId == "gameservice.movehandgroup") {
      self.check_moveHandGroup(notify);
    } else if (msgId == "gameservice.ondiamondupdate") {
      var playerId = notify.playerId;
      var after = notify.after;

      if (self.userInfoCtrl.playerid == playerId) {
        self.userInfoCtrl.setCoin(after);
      } else {
        var _otherUserCtrl3 = self.getOtherNodeCtrlByPlayerId(playerId);

        _otherUserCtrl3.setCoin(after);
      }
    } else if (msgId == "lobbyservice.pushcurrencychanged") {
      GlobalCfg.USER_DATAS.userDiamond = notify.deposit + notify.winnings;
      GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, 0);
      var coin = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
      self.lab_jb.string = CommonFun.getInstance().numberToShow(coin);
    } else if (msgId == "gameservice.ontidyfinalcards") {
      if (notify.seat !== self.selfAbsoluteSeatId) {
        var _otherUserCtrl4 = self.getOtherNodeCtrlBySeat(notify.seat);

        _otherUserCtrl4.gameDropOrFinalcards(notify, false);
      } else {
        //自己的广播
        self.userInfoCtrl.gameDropOrFinalcards(notify, false);
        self.tidyFinalCardsAck = true;
      }
    } else if (msgId == "gameservice.ondrop") {
      if (notify.seat !== self.selfAbsoluteSeatId) {
        //自己的广播，忽略
        var _otherUserCtrl5 = self.getOtherNodeCtrlBySeat(notify.seat);

        _otherUserCtrl5.gameDropOrFinalcards(notify, true);
      }
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      self.isTuiChu = true;
      var lab_drop = self.btn_drop.node.getChildByName("lab").getComponent(cc.Label);

      if (self.tableStatus == 0 || self.tableStatus == 1) {
        self.exitGame();
      } else if (self.tableStatus == 2 || self.tableStatus == 3 || self.tableStatus == 4) {
        var _arr2 = ["You will lose " + lab_drop.string + " .Are you sure you want to leave self table?", "\u0906\u092A " + lab_drop.string + "\"\u0916\u094B \u0926\u0947\u0902\u0917\u0947\u0964 \u0915\u094D\u092F\u093E \u0906\u092A \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0939\u0948\u0902 \u0915\u093F \u0906\u092A \u0907\u0938 \u091F\u0947\u092C\u0932 \u0915\u094B \u091B\u094B\u0921\u093C\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?", " \u06A9\u06BE\u0648 \u062F\u06CC\u06BA \u06AF\u06D2\u06D4 \u06A9\u06CC\u0627 \u0622\u067E \u0648\u0627\u0642\u0639\u06CC \u06CC\u06C1 \u0679\u06CC\u0628\u0644 \u0686\u06BE\u0648\u0691\u0646\u0627 \u0686\u0627\u06C1\u062A\u06D2 \u06C1\u06CC\u06BA\u061F " + lab_drop.string + " \u0622\u067E", "\u0986\u09AA\u09A8\u09BF " + lab_drop.string + " \u09B9\u09BE\u09B0\u09BE\u09AC\u09C7\u09A8\u0964 \u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0986\u09AA\u09A8\u09BF \u098F\u0987 \u099F\u09C7\u09AC\u09BF\u09B2 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A5\u09BE\u09A8 \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8?"];
        CommonFun.getInstance().showMsgBox(_arr2[language - 1], "YES_NO", function () {
          // 发送结算消息
          self.dropReq();
        }, false);
      } else {
        self.dropReq();
      }
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("rummy");
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE) {
      self.changeRoomReq();
    }
  },
  cashSwitch: function cashSwitch() {
    this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);

    if (this.entrycondition == 0) {
      this.node.getChildByName("btn_shop").active = true;
    }
  },
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (!notify) {
      var info = {
        errorMessage: "\u62C9\u7C73\u516D\u4EBA\u573A\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
      };
      CommonFun.getInstance().reportToTelegram(info);
      return;
    }

    ;
    var result = notify.result;

    if (notify.Result) {
      result = notify.Result;
    }

    ;

    if (msgId === "gameservice.outcard") {
      LoggerUtil.getInstance().error("出牌消息ACK", notify.result.message);

      if (notify.result.result == 20523) {
        // 找不到该牌
        self.RefreshGameSceneReq();
      }
    } else if (msgId === "gameservice.changetable") {
      if (notify.result.result == 20529) {
        // 游戏不存在
        self.changetable();
        self.enterRoomReq();
      } else {
        var msg = notify.result.message;
        CommonFun.getInstance().showTips(msg);
      }
    } else if (msgId == "gameservice.receivefreetrial") {
      var _msg = notify.result.message; // CommonFun.getInstance().showTips("Daily bonus Limit Exceeded. Please retry tomorrow");

      CommonFun.getInstance().showTips(_msg);
    } else if (msgId === "gameservice.enterroom") {
      if (notify.result.result == 20519) {
        // 已在房间中
        self.RefreshGameSceneReq();
      } else {
        var _msg2 = notify.result.message;
        CommonFun.getInstance().showMsgBox(_msg2, "YES", function () {
          // 接口服务繁忙，未曾登录，弹出至选场界面
          window.isNeedShowRoomList = "rummy";
          SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        }, false);
      }
    } else if (msgId == "gameservice.refreshgamescene") {
      var _msg3 = notify.result.message;

      if (notify.result.result == 20529) {
        // 不在游戏中
        CommonFun.getInstance().showMsgBox("Connection error " + "\n" + "403", "YES", function () {
          window.isNeedShowRummyList = "rummy";
          SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        }, false);
      } else {
        CommonFun.getInstance().showTips(_msg3);
      }
    } else if (msgId === "gameservice.exitgame") {
      var _msg4 = notify.result.message;

      if (notify.result.result == 20515) {
        // 不允许退出
        CommonFun.getInstance().showTips(_msg4);
      } else {
        window.isNeedShowRummyList = "rummy";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
      }
    } else if (msgId == "gameservice.setcontinue") {
      if (notify.result.result == 20529) {
        // 不在游戏中
        if (self.node.getChildByName("settlement")) {
          self.node.getChildByName("settlement").destroy();
          self.userInfoCtrl.lab_scoreName.string = "Score:";
          self.userInfoCtrl.lab_score.string = "0";
        }

        self.isChange = false;
        self.changeRoomReq();
      }
    } else if (msgId === "gameservice.shortmessage") {
      var _msg5 = notify.result.message;
      CommonFun.getInstance().showTips(_msg5);
    } else if (msgId == "gameservice.movehandgroup") {
      self.check_moveHandGroup(notify);
      var cards = notify.handCards;
      self.reConnectGame(cards);
    } else {
      var _msg6 = notify.result.message;
      CommonFun.getInstance().showTips(_msg6);
    }
  },
  onPaiEventMsg: function onPaiEventMsg(Data, target) {
    var self = target;
    var msgId = Data.msgCode;
    var notify = Data.msgData;
    LoggerUtil.getInstance().log(">>>>>>>>>>onPaiEventMsg666666666>>>>>>>", msgId);

    if (msgId == "limitTips") {
      //牌超出限制线，设置 open部分的牌值
      if (self.isSelfTurn == true && self.isPickOneCard == true) {
        self.line.active = true;
        self.limitTipsCallBack(notify);
      }
    } else if (msgId == "underLimitTips") {
      //牌在限制线下，设置 open 部分的牌值
      if (self.isSelfTurn == true && self.isPickOneCard == true) {
        self.line.active = true;
        self.underLimitTipsCallBack(notify);
      }
    } else if (msgId == "clickPai") {
      //点击牌
      // LoggerUtil.getInstance().log("点击！！", notify)
      self.clickPaiCallBack(notify);
    } else if (msgId == "insertPai") {
      //插入牌组
      self.insertPaiCallBack(notify);
    } else if (msgId == "outPai") {
      //移动出牌
      LoggerUtil.getInstance().log("自定义事件 outPai ");

      if (self.isSelfTurn && self.isPickOneCard) {
        self.outPaiCallBack(notify);
      }

      var tempPaiGroup = self.paiGroupArr[notify.groupTag];

      if (tempPaiGroup) {
        var tempPaiNode = tempPaiGroup[notify.groupIndex];

        if (tempPaiNode) {
          var src = tempPaiNode.getComponent("paiCtrl");
          src && src.setOrignStatus(); //不是自己回合，设置恢复原位
        }
      }
    } else if (msgId == "finisPai") {
      //结算
      if (self.isSelfTurn == true && self.isPickOneCard == true) {
        self.changeOpenAreaSpriteFrame(notify.paiValue, false);
        self.finishCardData = {
          groupTag: notify.groupTag,
          paiIndex: notify.groupIndex,
          paiValue: notify.paiValue
        };
        var value = notify.paiValue;
        self.finishAction(notify);
        self.checkScore(value);
      } else {
        var _tempPaiGroup = self.paiGroupArr[notify.groupTag];

        if (_tempPaiGroup) {
          var _tempPaiNode = _tempPaiGroup[notify.groupIndex];

          if (_tempPaiNode) {
            var _src2 = _tempPaiNode.getComponent("paiCtrl");

            _src2 && _src2.setOrignStatus(); //不是自己回合，设置恢复原位
          }
        }
      }
    } else if (msgId == "agreeDeclare") {
      //同意结算，发送牌型至服务端，服务端发送结算广播
      self.TidyFinalCardsReq(self.getPaiValueArr(), +self.userInfoCtrl.getScore());
    } else if (msgId == "touchEnd") {
      if (self.isSelfTurn == true && self.isPickOneCard == true) {
        self.line.active = false;
      }
    }
  },
  // ==================================== 检测数据  start ============================================
  check_EnterRoomData: function check_EnterRoomData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("进入房间的数据为空！！！");
      return;
    }
  },
  check_ChangeTacleData: function check_ChangeTacleData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("换桌的数据为空！！！");
      return;
    }
  },
  check_ReadyData: function check_ReadyData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("玩家准备的数据为空！！");
      return;
    }
  },
  check_moveHandGroup: function check_moveHandGroup(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("游戏开始的数据为空！！！");
      return;
    }

    if (notify.result && notify.result.message == "成功") {
      // LoggerUtil.getInstance().log("啦啦啦啦啦啦啦啦绿绿绿绿绿绿绿");
      return;
    }

    if (notify.result && (notify.result.message == "牌组与服务数据不一致" || notify.result.result == 20527)) {
      var cards = notify.handCards;
      this.reConnectGame(cards);
    }
  },
  check_GameStartData: function check_GameStartData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("游戏开始的数据为空！！！");
      return;
    } // this.isChange = false;


    this.initNodeState(false);
    this.TipsLab();
    this.tableStatus = 2;
    this.setRecorderCard(true);
    var banker = notify.banker;
    var firstCards = notify.firstPickCard; //第一张牌比大小的

    var firstPickWinSeat = notify.firstPickWinSeat;

    for (var i = 0; i < firstCards.length; i++) {
      var element = firstCards[i];

      if (element < 0) {
        continue;
      }

      if (this.selfAbsoluteSeatId == i) {
        //自己的牌，用来确认谁是庄家
        LoggerUtil.getInstance().log("自己的第一张牌的数组下标：", i);
        this.actionFirstPai(element, {
          scale: 0.6,
          position: cc.v2(0, 20)
        });
      } else {
        var otherUserCtrl = this.getOtherNodeCtrlBySeat(i);
        var toPos = otherUserCtrl.getPosition();
        var toPosChangeToWorld = this.selfCardNode.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(toPos));
        this.actionFirstPai(element, {
          scale: 0.6,
          position: toPosChangeToWorld
        });
      }
    }

    if (this.selfAbsoluteSeatId == firstPickWinSeat) {
      //自己是庄家
      this.isSelfTurn = true;
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    } else {
      this.isSelfTurn = false;
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    }

    this.btn_close.node.active = true;
    this.btn_open.node.active = true;
  },
  check_ShortMsgData: function check_ShortMsgData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("短消息的数据为空！！");
      return;
    }
  },
  check_PickCardData: function check_PickCardData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("起牌的数据为空！！");
      return;
    }

    if (notify.side == 1) {
      this.recorderCardCtrl_6.pickCrad(notify.card);
    }

    if (this.selfSeat == notify.seat) {
      //自己的起牌广播
      LoggerUtil.getInstance().log("自己起牌广播");
      this.isPickOneCard = true;
      this.round += 1;
      this.setDropScore(this.round);
      this.showLobbyUI("outCard");
    } else {
      this.round += 1;
      this.setDropScore(this.round);
      GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("yipai");
    }

    this.showLobbyUI("shouZhi", false);
    this.fapaiAction(notify, this.selfSeat == notify.seat);
  },
  check_ChooseHuData: function check_ChooseHuData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("选择胡牌的数据为空！！！");
      return;
    }

    LoggerUtil.getInstance().log("报胡的广播");
    this.huSeat = false;

    if (notify.huSeat == this.selfSeat) {
      //自己胡牌
      for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
        var otherNode = this.playersNode.children[i];
        var otherUserCtrl = otherNode.getComponent("rummyOtherUserCtrl");
        otherUserCtrl.countDown(true, notify.simpleTimeout - 1, 0, true);
      }

      this.userInfoCtrl.countDown(false);

      if (notify.isHu) {
        var tishi;

        if (this.node.getChildByName("tishi")) {
          tishi = this.node.getChildByName("tishi");
        } else {
          tishi = cc.instantiate(this.prefab_tishi);
        }

        var tishiCtrl = tishi.getComponent("tishiCtrl");
        tishiCtrl.setTishi(this.textArr[5]);
        tishi.parent = this.node;
      }
    } else {
      var tishi_finish = cc.instantiate(this.prefab_tishi_finish);
      var tishi_finishCtrl = tishi_finish.getComponent("tishi_finishCtrl");
      var otherWinUserCtrl = this.getOtherNodeCtrlBySeat(notify.huSeat);
      tishi_finishCtrl.setDeClareContent(otherWinUserCtrl.getNickName() + " has declared" + "\n" + "Group your cards and declare");
      tishi_finish.parent = this.node;
      this.userInfoCtrl.countDown(true, notify.simpleTimeout - 1, 0, true);
      var huSeatRelative = this.changeAbsoluteSeatIdToRelative(notify.huSeat);

      for (var _i9 = 0, _len2 = this.playersNode.children.length; _i9 < _len2; _i9++) {
        var _otherNode = this.playersNode.children[_i9];

        var otherNodeCtrl = _otherNode.getComponent("rummyOtherUserCtrl");

        if (otherNodeCtrl.getSeatId() != huSeatRelative) {
          otherNodeCtrl.countDown(true, notify.simpleTimeout - 1, 0, true);
        } else {
          otherNodeCtrl.countDown(false);
        }
      }

      var tidyfinalcards = function tidyfinalcards() {
        this.TidyFinalCardsReq(this.getPaiValueArr(), +this.userInfoCtrl.getScore());
      };

      this.scheduleOnce(tidyfinalcards, notify.simpleTimeout - 1);

      if (this.tidyFinalCardsAck == true) {
        this.unschedule(tidyfinalcards);
        this.tidyFinalCardsAck = false;
      }
    }

    this.cardLibNode.getComponent(cc.Sprite).spriteFrame = this.getPaiSpriteFrameByValue(notify.outCard);
    this.cardLibNode.active = true;
    this.btn_close.node.active = false;
    this.btn_open.node.active = false;
  },
  //结算
  check_onGamecalcData: function check_onGamecalcData(notify) {
    this.tableStatus = 6;
    this.isChange = true;

    if (!notify) {
      LoggerUtil.getInstance().error("结算的数据为空！！！");
      return;
    }

    for (var i = 0, len = this.tweenTagArr.length; i < len; i++) {
      var tag = this.tweenTagArr[i];
      cc.Tween.stopAllByTag(tag);
    } // cc.Tween.stopAll();


    this.unschedule(this.dealCallback);
    this.unschedule(this.fapaiCallBack1);
    this.unschedule(this.fapaiCallBack2);
    this.unschedule(this.freshNotifyCallback);
    this.unschedule(this.flowPaiCallBack);
    clearTimeout(this.dealTimeOutID);
    this.setRecorderCard(false);
    this.userInfoCtrl.countDown(false);

    for (var _i10 = 0, _len3 = this.playersNode.children.length; _i10 < _len3; _i10++) {
      var otherNode = this.playersNode.children[_i10];
      var otherUserCtrl = otherNode.getComponent("rummyOtherUserCtrl");
      otherUserCtrl.countDown(false);
    }

    this.initNodeState(false);
    this.putSelfCardToPool();
    var players = notify.players;

    for (var _i11 = 0; _i11 < players.length; _i11++) {
      var seat = players[_i11].seat;

      if (seat == this.selfSeat) {
        this.userInfoCtrl.gameover(notify, players[_i11].calc);
      } else {
        // for (let i = 0,len = this.playersNode.children.length; i < len; i++) {
        //     let otherNode = this.playersNode.children[i];
        //     let otherUserCtrl = otherNode.getComponent("rummyOtherUserCtrl");
        //     otherUserCtrl.gameover(notify, players[i].calc);
        // }
        var _otherUserCtrl6 = this.getOtherNodeCtrlBySeat(seat);

        _otherUserCtrl6.gameover(notify, players[_i11].calc);
      }
    }
  },
  //换桌
  changetable: function changetable() {
    CommonFun.getInstance().showGameStartMask();

    for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
      var otherNode = this.playersNode.children[i];
      var otherUserCtrl = otherNode.getComponent("rummyOtherUserCtrl");
      otherUserCtrl.freshUser();
    }

    this.initNodeState(false); // this.RefreshGameSceneReq();
  },
  check_GameSceneData: function check_GameSceneData(notify) {
    var _this4 = this;

    var playerList = notify.players;
    var status = notify.status; //牌桌状态

    this.tableStatus = notify.status;
    this.cellScore = (notify.cellScore / 100).toFixed(2); //底分

    var laiId = notify.laiId; //癞子的牌,左侧区域展示的癞子牌的value

    var roomType = notify.roomType; //房间类型

    var dissolveSeat = notify.dissolveSeat; //解散的座位号,默认为-1

    var banker = notify.banker; //庄家

    this.round = notify.round; //回合数 

    var step = notify.step; //当前阶段

    var curSeat = notify.curSeat; //当前操作的座位号

    var leftRemain = notify.leftRemain; //左侧剩余张数

    var rightFace = notify.rightFace; //右侧展示的牌

    var rightRemain = notify.rightRemain; //右-剩余张数

    LoggerUtil.getInstance().log("GameScene消息执行了-----", "当前操作的座位号" + curSeat);
    this.initNodeState(true);
    this.laiValue = notify.laiId;
    this.laiNumber = this.getPaiNum(laiId); //癞子的牌值

    this.setDropScore(this.round);

    for (var i = 0; i < playerList.length; i++) {
      var item = playerList[i];
      var userinfo = item.user;

      if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {
        this.userInfoCtrl.setUserInfo(userinfo, item.seat);
        this.selfSeat = item.seat;
      } else {
        var otherUserCtrl = this.getOtherNodeCtrlBySeat(item.seat);
        otherUserCtrl.setUserInfo(userinfo, item.seat);
      }
    }

    if (status == 0) {
      this.TipsLab(8);
    } else {
      this.TipsLab();
    }

    switch (status) {
      case 0:
        //游戏准备阶段
        LoggerUtil.getInstance().log("游戏状态为准备阶段");
        break;

      case 1:
        //开局(开局倒计时的3秒内)
        LoggerUtil.getInstance().log("游戏阶段：开局预备");
        break;

      case 2:
        //(游戏正式开始但未发牌)
        LoggerUtil.getInstance().log("游戏阶段：开局比牌中");
        break;

      case 3:
        //发牌中
        LoggerUtil.getInstance().log("游戏阶段为：发牌中");
        this.setRecorderCard(true);

        var _loop = function _loop(_i12) {
          var item = playerList[_i12];
          var userinfo = item.user;

          if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {
            _this4.startSetPai(item.cards, laiId, leftRemain, rightFace, rightRemain);

            _this4.selfSeat = item.seat;

            if (_this4.selfSeat == curSeat) {
              _this4.isSelfTurn = true;

              if (item.cards.length == 14) {
                _this4.isPickOneCard = true;

                _this4.showLobbyUI("outCard");
              } else {
                _this4.scheduleOnce(function () {
                  _this4.showLobbyUI("qiCrad");
                }, 2.5);
              }

              _this4.fapaiCallBack1 = function () {
                _this4.controlButton(_this4.isSelfTurn, _this4.isPickOneCard, _this4.clickPaiArr.length);

                _this4.userInfoCtrl.countDown(true, 20, item.extraCountdown);
              };

              _this4.scheduleOnce(_this4.fapaiCallBack1, 2);
            } else {
              _this4.isSelfTurn = false;
              _this4.isPickOneCard = false;
            }
          } else if (item.seat == curSeat) {
            _this4.fapaiCallBack2 = function () {
              _this4.controlButton(_this4.isSelfTurn, _this4.isPickOneCard, _this4.clickPaiArr.length);

              var otherUserCtrl = _this4.getOtherNodeCtrlBySeat(curSeat);

              otherUserCtrl.countDown(true, 20, item.extraCountdown);
            };

            _this4.scheduleOnce(_this4.fapaiCallBack2, 2);
          }
        };

        for (var _i12 = 0; _i12 < playerList.length; _i12++) {
          _loop(_i12);
        }

        LoggerUtil.getInstance().log("是不是自己回合：" + this.isSelfTurn, '是否已经摸了一张牌' + this.isPickOneCard);
        break;

      case 4:
        //游戏中
        LoggerUtil.getInstance().log("游戏阶段为：游戏中"); //用于断线重连

        this.setRecorderCard(true);

        for (var _i13 = 0; _i13 < playerList.length; _i13++) {
          var _item = playerList[_i13]; // PlayerInfo

          var _userinfo = _item.user;
          var handGroup = _item.handGroup;

          if (GlobalCfg.USER_DATAS.userId == _userinfo.displayName) {
            //自己
            this.userInfoCtrl.setUserInfo(_userinfo, _item.seat);
            this.selfSeat = _item.seat;

            if (handGroup.length > 0) {
              LoggerUtil.getInstance().log("需要牌组》》》》》》》》》》");
              this.reConnectGameByGroup(handGroup);
            } else {
              LoggerUtil.getInstance().log("不需要牌组》》》》》》》》》》");
              this.reConnectGame(_item.cards);
            }

            if (this.selfSeat == curSeat) {
              this.isSelfTurn = true;

              if (_item.cards.length == 14) {
                this.isPickOneCard = true;
                this.showLobbyUI("outCard");
              } else {
                this.showLobbyUI("qiCrad");
              }

              this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
              this.userInfoCtrl.countDown(true, _item.simpleCountdown, _item.extraCountdown);
            } else {
              this.isSelfTurn = false;
              this.isPickOneCard = false; // this.otherUserCtrl.countDown(true, simpleCountdown, extraCountdown);
            }
          } else {
            // 此处需确保第一个数据为玩家自己
            if (_item.seat == curSeat) {
              //当前操作的玩家
              var _otherUserCtrl7 = this.getOtherNodeCtrlBySeat(_item.seat);

              _otherUserCtrl7.setUserInfo(_userinfo, _item.seat);

              _otherUserCtrl7.countDown(true, _item.simpleCountdown, _item.extraCountdown);
            } else {
              var _otherUserCtrl8 = this.getOtherNodeCtrlBySeat(_item.seat);

              _otherUserCtrl8.setUserInfo(_userinfo, _item.seat);

              _otherUserCtrl8.countDown(false);
            }
          }

          this.setNodeActive(laiId, leftRemain, rightFace, rightRemain);
        }

        LoggerUtil.getInstance().log("是不是自己回合：" + this.isSelfTurn);
        break;

      case 5:
        //报胡中 (等待下家应答胡)
        LoggerUtil.getInstance().log("游戏阶段为：报胡中");
        window.isNeedShowRoomList = "rummy";
        var winSeat = curSeat;

        for (var _i14 = 0; _i14 < playerList.length; _i14++) {
          var _item2 = playerList[_i14];
          var _userinfo2 = _item2.user;
          var _handGroup = _item2.handGroup;

          if (GlobalCfg.USER_DATAS.userId == _userinfo2.displayName) {
            //自己
            this.userInfoCtrl.setUserInfo(_userinfo2, _item2.seat);
            this.selfSeat = _item2.seat;

            if (_handGroup.length > 0) {
              LoggerUtil.getInstance().log("需要牌组》》》》》》》》》》");
              this.reConnectGameByGroup(_handGroup);
            } else {
              LoggerUtil.getInstance().log("不需要牌组》》》》》》》》》》");
              this.reConnectGame(_item2.cards);
            }

            if (this.selfSeat == curSeat) {
              //当前操作的玩家，即赢家
              // this.isSelfTurn = true;
              // if (item.cards.length == 14) {
              //     this.isPickOneCard = true;
              //     this.showLobbyUI("outCard");
              // } else {
              //     this.showLobbyUI("qiCrad");
              // }
              // this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
              this.userInfoCtrl.countDown(false);
            } else {
              this.isSelfTurn = false;
              this.isPickOneCard = false;
              var tishi_finish = cc.instantiate(this.prefab_tishi_finish);
              var tishi_finishCtrl = tishi_finish.getComponent("tishi_finishCtrl");
              var otherWinUserCtrl = this.getOtherNodeCtrlBySeat(curSeat);
              tishi_finishCtrl.setDeClareContent(otherWinUserCtrl.getNickName() + " has declared" + "\n" + "Group your cards and declare");
              tishi_finish.parent = this.node;
              this.userInfoCtrl.countDown(true, _item2.simpleCountdown - 1, _item2.extraCountdown, true, _item2.playerStatus);
            }
          } else {
            // this.otherUserCtrl.setUserInfo(userinfo, item.seat);
            var _otherUserCtrl9 = this.getOtherNodeCtrlBySeat(_item2.seat);

            _otherUserCtrl9 && _otherUserCtrl9.setUserInfo(_userinfo2, _item2.seat);

            if (curSeat == _item2.seat) {
              _otherUserCtrl9.countDown(false);
            } else {
              LoggerUtil.getInstance().log("\u62A5\u80E1\u4E2D\uFF0C\u5F53\u524Dfor\u5FAA\u73AF\u7684i\u4E3A" + _i14 + ",simpleCountdown\u4E3A\uFF0C" + _item2.simpleCountdown + "\u989D\u5916\u65F6\u95F4\u4E3A\uFF1A" + _item2.extraCountdown);

              _otherUserCtrl9.countDown(true, _item2.simpleCountdown - 1, _item2.extraCountdown, true, _item2.playerStatus);
            }
          }
        }

        this.setNodeActive(laiId, leftRemain, rightFace, rightRemain); // let deat = {
        //     huSeat: winSeat,
        //     isHu: this.selfSeat == curSeat,
        //     simpleTimeout: Number(simpleCountdown) + Number(extraCountdown),
        // }
        // this.check_ChooseHuData(deat)

        break;

      case 6:
        //结算阶段
        LoggerUtil.getInstance().log("游戏阶段为：结算阶段"); // this.tsetCrad();

        window.isNeedShowRoomList = "rummy";
      // if(this.node.getChildByName("settlement")){
      //     break;
      // }else{
      //     let settleMent = cc.instantiate(this.prefab_jiesuan);
      //     let settleMentCtrl = settleMent.getComponent("settlementCtrl");
      //     // settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl, GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl);
      //     settleMent.parent = this.node;
      //     break;
      // }

      default:
        LoggerUtil.getInstance().log("switch默认结果");
        break;
    }
  },
  check_newPlayerJoinData: function check_newPlayerJoinData(notify) {
    var userInfo = notify.userInfo;
    var seatId = notify.seatId;
    var isReconnect = notify.isReconnect;

    if (userInfo.displayName == GlobalCfg.USER_DATAS.userId) {
      this.selfSeat = seatId;
      this.userInfoCtrl.setUserInfo(userInfo, notify.seatId);
    } else {
      var otherUserCtrl = this.getOtherNodeCtrlBySeat(seatId);
      otherUserCtrl.setUserInfo(userInfo, notify.seatId);
    }
  },
  // ==================================== 检测数据  end ============================================
  // ===========================================================
  //断线重连按服务器发的牌组信息展示牌
  reConnectGameByGroup: function reConnectGameByGroup(groups) {
    this.paiGroupArr = [];

    for (var i = 0, len = groups.length; i < len; i++) {
      var group = groups[i].cards;
      this.paiGroupArr[i] = [];

      if (group) {
        for (var k = 0, len1 = group.length; k < len1; k++) {
          var paiValue = group[k];
          var paiNode = this.createPaiNode();
          var spriteFrame = this.getPaiSpriteFrameByValue(paiValue);
          var src = paiNode.getComponent("paiCtrl");

          if (src) {
            src.setLaiActive(false);
            src.setUpClickDistance(this.upClickDistance);
            src.setUpLimitDistance(this.upLimitDistance);
            src.setPaiDistance(this.paiDistance);
            src.setPaiSpriteFrame(spriteFrame);
            src.setPaiValue(paiValue);
            src.setIsCanMove(true);
            src.setGroupTag(i, k);
          }

          this.paiGroupArr[i][k] = paiNode;
          this.selfCardNode.addChild(paiNode);
        }
      }
    }

    var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
    this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
    this.btnAction();
  },
  //断线重连
  reConnectGame: function reConnectGame(valueArr, notify) {
    LoggerUtil.getInstance().log("断线重连&游戏中加入");
    valueArr.sort(function (a, b) {
      return a - b;
    });
    this.putSelfCardToPool();

    for (var i = 0; i < valueArr.length; i++) {
      var element = valueArr[i];

      if (element == 53 || element == 52) {
        valueArr.splice(i, 1);
        valueArr.splice(0, 0, element);
      }
    }

    var paiNodeArr = [];
    var initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;

    for (var _i15 = 0; _i15 < valueArr.length; _i15++) {
      var paiNode = this.createPaiNode();
      var spriteFrame = this.getPaiSpriteFrameByValue(valueArr[_i15]);
      var src = paiNode.getComponent("paiCtrl");

      if (src) {
        src.setLaiActive(false);
        src.setUpClickDistance(this.upClickDistance);
        src.setUpLimitDistance(this.upLimitDistance);
        src.setPaiDistance(this.paiDistance);
        src.setPaiSpriteFrame(spriteFrame);
        src.setPaiValue(valueArr[_i15]);
        src.setIsCanMove(true);
      }

      paiNode.setPosition(-initPaiTotalWidth / 2 + this.paiDistance / 2 + _i15 * this.paiDistance, 0);
      this.selfCardNode.addChild(paiNode);
      paiNodeArr.push(paiNode);
    }

    this.paiGroupArr = this.initPaiGroupArr(paiNodeArr);
    var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
    this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
    this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
    this.btnAction();
  },
  setNodeActive: function setNodeActive(laiId, leftRemain, rightFace, rightRemain) {
    this.cardMask.active = false;
    this.laiNumber = this.getPaiNum(laiId);
    var spriteFrame = this.getPaiSpriteFrameByValue(laiId);
    this.laizi_closeNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    this.showUniversalCard(spriteFrame, leftRemain);
    this.lab_close.string = "(" + leftRemain + ")";
    var openValue;

    if (rightFace.length > 0) {
      openValue = rightFace[0] && rightFace[0].card;
      this.lab_open.string = "OPEN(" + rightRemain + ")";
      var openSpriteFrame = this.getPaiSpriteFrameByValue(openValue);
      this.openPaiNode.getComponent(cc.Sprite).spriteFrame = openSpriteFrame;
      var paiNum = this.getPaiNum(openValue);

      if (paiNum == this.laiNumber) {
        this.openPaiNode.getChildByName("lai").active = true;
      }

      this.openNode.active = true;
    }
  },
  actionFirstPai: function actionFirstPai(value, arg) {
    var _this5 = this;

    // LoggerUtil.getInstance().log("第一张牌比大小");
    var spriteFrame = this.getPaiSpriteFrameByValue(value);
    var paiNode = this.createPaiNode();
    paiNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    paiNode.parent = this.selfCardNode;
    cc.tween(paiNode).tag(1).to(0.3, arg).start();
    setTimeout(function () {
      _this5.onCardRemoved(paiNode);
    }, 1000);
  },
  startSetPai: function startSetPai(valueArr, laiId, leftRemain, rightFace, rightRemain) {
    // 初始化牌,处理牌组数据排列顺序
    // let valueArr = [3, 4, 5, 13, 16, 19, 26, 27, 28, 50, 51, 52, 53];
    valueArr.sort(function (a, b) {
      return a - b;
    });

    for (var i = 0; i < valueArr.length; i++) {
      var element = valueArr[i];

      if (element == 53 || element == 52) {
        valueArr.splice(i, 1);
        valueArr.splice(0, 0, element);
      }
    }

    this.deal(valueArr, laiId, leftRemain, rightFace, rightRemain);
  },
  clickPaiCallBack: function clickPaiCallBack(data) {
    LoggerUtil.getInstance().log("clickPaiCallBack>>>>>>>>>>>", data);

    if (!data) {
      return;
    }

    var paiValue = data.paiValue;
    var groupTag = data.groupTag;
    var isCancal = data.isCancal;

    if (isCancal) {
      for (var i = 0, len = this.clickPaiArr.length; i < len; i++) {
        var clickPai = this.clickPaiArr[i];
        var clickPaiTag = clickPai.groupTag;
        var clickPaiValue = clickPai.paiValue;

        if (clickPaiTag == groupTag && clickPaiValue == paiValue) {
          this.clickPaiArr.splice(i, 1);
          break;
        }
      }
    } else {
      this.clickPaiArr.push(data);
    }

    if (this.clickPaiArr.length >= 2) {
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    } else {
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    }

    LoggerUtil.getInstance().log("点击牌的数组是：", this.clickPaiArr);
  },
  insertPaiCallBack: function insertPaiCallBack(data) {
    if (!data) {
      return;
    }

    LoggerUtil.getInstance().log("insertPaiCallBack>>>>>>>>>>>", data);
    var paiValue = data.paiValue;
    var groupTag = data.groupTag;
    var groupIndex = data.groupIndex;
    var posX = data.posX;
    var movePaiNode = null;
    LoggerUtil.getInstance().log("从这个组中删除元素：", this.paiGroupArr[groupTag], "长度" + this.paiGroupArr[groupTag].length); // 从原来的组中删除

    movePaiNode = this.paiGroupArr[groupTag][groupIndex];
    var tempArr = [];

    if (movePaiNode) {
      var src = movePaiNode.getComponent("paiCtrl"); //再次确定一下当前位置的牌跟拖动的牌是不是一张

      if (src.getPaiValue() == paiValue) {
        tempArr = this.paiGroupArr[groupTag].splice(groupIndex, 1);
      } else {
        LoggerUtil.getInstance().error("当前位置的牌跟拖动的牌是不是同一张，根据牌值来此牌组中寻找");

        for (var i = this.paiGroupArr[groupTag].length - 1; i >= 0; i--) {
          var paiNode = this.paiGroupArr[groupTag][i];

          if (paiNode) {
            var _src3 = paiNode.getComponent("paiCtrl");

            if (_src3.getPaiValue() == paiValue) {
              tempArr = this.paiGroupArr[groupTag].splice(i, 1);
              break;
            }
          }
        }
      }
    }

    movePaiNode = tempArr[0]; // 加入到新的组中

    var isFinishJoin = false;

    for (var _i16 = 0, len = this.paiGroupArr.length; _i16 < len; _i16++) {
      if (isFinishJoin) {
        break;
      }

      if (this.paiGroupArr[_i16].length == 0) {
        continue;
      }

      for (var k = 0, len1 = this.paiGroupArr[_i16].length; k < len1; k++) {
        var _paiNode2 = this.paiGroupArr[_i16][k];

        if (!_paiNode2) {
          continue;
        }

        var paiNodeLeftX = _paiNode2.x - this.paiWidth / 2;

        if (k == 0) {
          if (_i16 == 0 && posX <= paiNodeLeftX) {
            LoggerUtil.getInstance().log("牌插入最左面");

            this.paiGroupArr[_i16].unshift(movePaiNode);

            isFinishJoin = true;
            break;
          } else if (posX >= paiNodeLeftX - this.groupDistance && posX < paiNodeLeftX) {
            LoggerUtil.getInstance().log("牌插入组最前面");

            this.paiGroupArr[_i16].unshift(movePaiNode);

            isFinishJoin = true;
            break;
          } else if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiDistance) {
            LoggerUtil.getInstance().log("牌插入组第一位");

            this.paiGroupArr[_i16].splice(1, 0, movePaiNode);

            isFinishJoin = true;
            break;
          }
        } else if (k == len1 - 1) {
          if (_i16 == len - 1) {
            if (posX > _paiNode2.x + this.paiWidth / 2) {
              LoggerUtil.getInstance().log("牌插入组最右面");

              this.paiGroupArr[_i16].push(movePaiNode);

              isFinishJoin = true;
              break;
            }
          }

          if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiWidth) {
            LoggerUtil.getInstance().log("牌插入组最后面");

            this.paiGroupArr[_i16].push(movePaiNode);

            isFinishJoin = true;
            break;
          }
        } else {
          if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiDistance) {
            LoggerUtil.getInstance().log("牌插入组的第" + (k + 1) + "位");

            this.paiGroupArr[_i16].splice(k + 1, 0, movePaiNode);

            isFinishJoin = true;
            break;
          }
        }
      }
    }

    if (isFinishJoin == false) {
      this.paiGroupArr[groupTag].splice(groupIndex, 0, movePaiNode);
    } else {
      for (var _i17 = 0, _len4 = this.paiGroupArr.length; _i17 < _len4; _i17++) {
        if (this.paiGroupArr[_i17].length == 0) {
          LoggerUtil.getInstance().log("组已消失，需要删除", _i17);
          this.paiGroupArr.splice(_i17, 1);
          break;
        }
      }
    }

    this.setPaiNodeIndex(this.paiGroupArr); // 更新组的信息

    this.clickPaiArr.length = 0;
    this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
    this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
    this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
  },
  outPaiCallBack: function outPaiCallBack(data) {
    // LoggerUtil.getInstance().log("outPaiCallBack>>>>>>>>>>>", data);
    var index = [1, data.groupTag, data.groupIndex].join('');
    this.outCardReq(data.paiValue, parseInt(index));
  },
  //牌超过限制的线，open区域的牌切换
  limitTipsCallBack: function limitTipsCallBack(data) {
    // LoggerUtil.getInstance().log("limitTipsCallBack>>>>>>>>>>>", data);
    this.changeOpenAreaSpriteFrame(data.paiValue, true);
  },
  underLimitTipsCallBack: function underLimitTipsCallBack(data) {
    // LoggerUtil.getInstance().log("underlimitTipsCallBack---------------", data);
    this.changeOpenAreaSpriteFrame(data.paiValue, false);
  },
  printPaiGroupValue: function printPaiGroupValue(tipsStr, paiGroupArr) {
    if (tipsStr === void 0) {
      tipsStr = "";
    }

    if (paiGroupArr === void 0) {
      paiGroupArr = [];
    }

    var t = [];

    for (var i = 0, len = paiGroupArr.length; i < len; i++) {
      var paiGroup = paiGroupArr[i];
      var t1 = [];

      for (var k = 0, len1 = paiGroup.length; k < len1; k++) {
        var paiNode = paiGroup[k];

        if (paiNode) {
          var src = paiNode.getComponent("paiCtrl");
          var paiValue = src.getPaiValue();
          t1.push(paiValue);
        }
      }

      t.push(t1);
    }

    LoggerUtil.getInstance().log(tipsStr, t);
  },
  changeOpenAreaSpriteFrame: function changeOpenAreaSpriteFrame(paiValue, bool) {
    if (bool == true) {
      var spriteFrameNew = this.getPaiSpriteFrameByValue(paiValue);
      this.openPaiNode.getComponent(cc.Sprite).spriteFrame = spriteFrameNew;
      this.cardMask.active = true;
    } else {
      this.openPaiNode.getComponent(cc.Sprite).spriteFrame = this.tempOpenSpriteFrame;
      this.cardMask.active = false;
    }
  },
  //出牌
  OutCard: function OutCard(notify) {
    var _this6 = this;

    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
    this.recorderCardCtrl_6.outCard(notify.card);

    if (notify.seat == this.selfSeat) {
      this.showLobbyUI("offCradGuang");

      if (notify.index == -1) {
        //超时自动出牌
        var isDel = false;

        for (var i = this.paiGroupArr.length - 1; i >= 0; i--) {
          var childArr = this.paiGroupArr[i];

          for (var j = 0; j < childArr.length; j++) {
            var node = childArr[j];
            var src = node.getComponent("paiCtrl");
            var paiValue = src.getPaiValue(); // LoggerUtil.getInstance().log("超时自动出牌的节点牌值", paiValue, "收到的出牌值", notify.card)

            if (paiValue == notify.card) {
              this.paiGroupArr[i].splice(j, 1);
              this.onCardRemoved(node);
              isDel = true; //删除出牌之后导致的空数组

              for (var _i18 = 0; _i18 < this.paiGroupArr.length; _i18++) {
                var element = this.paiGroupArr[_i18];

                if (element.length == 0) {
                  this.paiGroupArr.splice(_i18, 1);
                }
              }
            }

            if (isDel == true) {
              break;
            }
          }

          if (isDel == true) {
            break;
          }
        }

        var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
      } else {
        var groupData = this.getSliceNum(notify.index); // LoggerUtil.getInstance().log("________________", groupData);

        if (this.clickPaiArr.length != 0 && this.clickPaiArr.length == 1) {
          var paiNode = this.paiGroupArr[groupData.groupTag][groupData.groupIndex];

          var _src4 = paiNode.getComponent("paiCtrl");

          LoggerUtil.getInstance().log("点击出牌~~~~", _src4.getPaiValue(), notify.card);

          if (notify.card == _src4.getPaiValue()) {
            cc.tween(paiNode).tag(2).to(0.2, {
              position: cc.v2(195.8, 195),
              scale: 0.8
            }).call(function () {
              _this6.paiGroupArr[groupData.groupTag] && _this6.paiGroupArr[groupData.groupTag].splice(groupData.groupIndex, 1);

              var openSpriteFrame = _this6.getPaiSpriteFrameByValue(notify.card);

              _this6.openPaiNode && _this6.openPaiNode.getComponent(cc.Sprite) && (_this6.openPaiNode.getComponent(cc.Sprite).spriteFrame = openSpriteFrame);

              _this6.onCardRemoved(paiNode); //删除出牌之后导致的空数组


              for (var _i19 = 0; _i19 < _this6.paiGroupArr.length; _i19++) {
                var _element = _this6.paiGroupArr[_i19];

                if (_element.length == 0) {
                  _this6.paiGroupArr.splice(_i19, 1);
                }
              }

              _this6.clickPaiArr = [];

              var totalWidth = _this6.getPaiTotalWidthByPaiGroupArr(_this6.paiGroupArr);

              _this6.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, _this6.paiGroupArr);

              _this6.openPaiNode && _this6.openPaiNode.getComponent(cc.Sprite) && (_this6.tempOpenSpriteFrame = _this6.openPaiNode.getComponent(cc.Sprite).spriteFrame);

              _this6.reqMovehandgroup(_this6.paiGroupArr);
            }).start();
          }
        } else {
          var _paiNode3 = this.paiGroupArr[groupData.groupTag][groupData.groupIndex];

          var _src5 = _paiNode3.getComponent("paiCtrl");

          if (notify.card == _src5.getPaiValue()) {
            this.paiGroupArr[groupData.groupTag].splice(groupData.groupIndex, 1); // this.onCardRemoved(paiNode);

            _paiNode3.destroy(); //删除出牌之后导致的空数组


            for (var _i20 = 0; _i20 < this.paiGroupArr.length; _i20++) {
              var _element2 = this.paiGroupArr[_i20];

              if (_element2.length == 0) {
                this.paiGroupArr.splice(_i20, 1);
              }
            }

            var _totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);

            this.setPaiPosByTotalWidthAndpaiGroupArr(_totalWidth, this.paiGroupArr);
          }
        }
      } //出完牌更新牌的 index


      this.setPaiNodeIndex(this.paiGroupArr); // let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
      // this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

      this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
      this.isSelfTurn = false;
      this.isPickOneCard = false;
      this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
      this.userInfoCtrl.countDown(false); // m默认自己出完牌轮右手边下家，seatId = 5

      var otherUserCtrl = this.getOtherNodeCtrlBySeat(notify.nextSeat);
      otherUserCtrl.countDown(true, notify.simpleTimeout, notify.extraTimeout);
    } else {
      //其他玩家出牌
      if (notify.nextSeat == this.selfSeat) {
        // 自己
        this.showLobbyUI("qiCrad");

        var _paiNode4 = this.createPaiNode();

        var paiSprite = this.getPaiSpriteFrameByValue(notify.card);

        var _otherUserCtrl10 = this.getOtherNodeCtrlBySeat(notify.seat);

        var fromPos = _otherUserCtrl10.getPosition();

        _paiNode4.getComponent(cc.Sprite).spriteFrame = paiSprite;

        _paiNode4.setPosition(fromPos); //出牌玩家的位置， 需赋值


        _paiNode4.scale = 0.8;
        _paiNode4.parent = this.node;
        cc.tween(_paiNode4).tag(3).to(0.2, {
          scale: 0.8,
          position: cc.v2(195.8, 22)
        }).call(function () {
          _this6.openPaiNode && _this6.openPaiNode.getComponent(cc.Sprite) && (_this6.openPaiNode.getComponent(cc.Sprite).spriteFrame = paiSprite);
          _paiNode4 && _this6.onCardRemoved(_paiNode4);
        }).start();
        this.isSelfTurn = true; //对家出完牌，轮到自己

        this.isPickOneCard = false;
        this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
        this.userInfoCtrl.countDown(true, notify.simpleTimeout, notify.extraTimeout);
        var curOtherUserCtrl = this.getOtherNodeCtrlBySeat(notify.seat);
        curOtherUserCtrl.countDown(false);
      } else {
        var _paiNode5 = this.createPaiNode();

        var _paiSprite = this.getPaiSpriteFrameByValue(notify.card);

        var _curOtherUserCtrl = this.getOtherNodeCtrlBySeat(notify.seat);

        var _fromPos = _curOtherUserCtrl.getPosition();

        _paiNode5.getComponent(cc.Sprite).spriteFrame = _paiSprite;

        _paiNode5.setPosition(_fromPos); //出牌玩家的位置， 需赋值


        _paiNode5.scale = 0.8;
        _paiNode5.parent = this.node;
        cc.tween(_paiNode5).tag(3).to(0.2, {
          scale: 0.8,
          position: cc.v2(195.8, 22)
        }).call(function () {
          _this6.openPaiNode && _this6.openPaiNode.getComponent(cc.Sprite) && (_this6.openPaiNode.getComponent(cc.Sprite).spriteFrame = _paiSprite);
          _paiNode5 && _this6.onCardRemoved(_paiNode5);
        }).start();

        _curOtherUserCtrl.countDown(false);

        var _otherUserCtrl11 = this.getOtherNodeCtrlBySeat(notify.nextSeat);

        _otherUserCtrl11.countDown(true, notify.simpleTimeout, notify.extraTimeout);
      }
    }

    this.showOpenAreaCard(notify.rightFace, notify.rightRemain);
  },
  // 0 ~ 51; 
  // 52, 53;
  // 获取牌的精灵资源
  getPaiSpriteFrameByValue: function getPaiSpriteFrameByValue(paiValue) {
    if (paiValue < 0) {
      return;
    }

    var paiType = this.getPaiType(paiValue); // let paiNum = this.getPaiNum(paiValue);

    var getNum = function getNum(paiValue) {
      var paiNum = (paiValue + 12) % 13;

      if (paiValue == 52) {
        paiNum = "d";
      } else if (paiValue == 53) {
        paiNum = "x";
      }

      return paiNum;
    };

    var paiNum = getNum(paiValue);

    if (paiNum == 0) {
      paiNum = 13;
    }

    var spriteFrame = this.spriteAtlas_pai.getSpriteFrame(paiType + paiNum);
    return spriteFrame;
  },
  getPaiNum: function getPaiNum(paiValue) {
    var paiNum = paiValue % 13;

    if (paiValue == 52) {
      paiNum = "d";
    } else if (paiValue == 53) {
      paiNum = "x";
    }

    return paiNum;
  },
  getPaiType: function getPaiType(paiValue) {
    var paiType = "";

    if (paiValue <= 12) {
      paiType = "fangkuai";
    } else if (paiValue > 12 && paiValue <= 25) {
      paiType = "meihua";
    } else if (paiValue > 25 && paiValue <= 38) {
      paiType = "hongxin";
    } else if (paiValue > 38 && paiValue <= 51) {
      paiType = "heitao";
    } else if (paiValue == 52) {
      paiType = "w_";
    } else if (paiValue == 53) {
      paiType = "w_";
    }

    return paiType;
  },
  initPaiGroupArr: function initPaiGroupArr(paiNodeArr) {
    var heiTaoGroup = [];
    var hongXinGroup = [];
    var meiHuaGroup = [];
    var fangKuaiGroup = [];
    var wangGroup = [];

    for (var i = 0, len = paiNodeArr.length; i < len; i++) {
      var paiNode = paiNodeArr[i];
      var src = paiNode.getComponent("paiCtrl");
      var paiValue = src.getPaiValue();

      if (paiValue == 52 || paiValue == 53) {
        wangGroup.push(paiNode);
      } else if (paiValue <= 12) {
        fangKuaiGroup.push(paiNode);
      } else if (paiValue <= 25) {
        meiHuaGroup.push(paiNode);
      } else if (paiValue <= 38) {
        hongXinGroup.push(paiNode);
      } else if (paiValue <= 51) {
        heiTaoGroup.push(paiNode);
      }
    }

    var paiGroupArr = []; // let groupTag = 0;

    if (wangGroup.length > 0) {
      paiGroupArr.push(wangGroup);
    }

    if (fangKuaiGroup.length > 0) {
      paiGroupArr.push(fangKuaiGroup);
    }

    if (meiHuaGroup.length > 0) {
      paiGroupArr.push(meiHuaGroup);
    }

    if (hongXinGroup.length > 0) {
      paiGroupArr.push(hongXinGroup);
    }

    if (heiTaoGroup.length > 0) {
      paiGroupArr.push(heiTaoGroup);
    }

    for (var _i21 = 0; _i21 < paiGroupArr.length; _i21++) {
      var tempArr = paiGroupArr[_i21];

      for (var j = 0; j < tempArr.length; j++) {
        var _paiNode6 = tempArr[j];

        var _src6 = _paiNode6.getComponent("paiCtrl");

        _src6.setGroupTag(_i21, j);
      }
    }

    LoggerUtil.getInstance().log("Push之后的数组", paiGroupArr);
    return paiGroupArr;
  },
  getPaiTotalWidthByPaiGroupArr: function getPaiTotalWidthByPaiGroupArr(paiGroupArr) {
    var totalWidth = 0;

    for (var i = 0, len = paiGroupArr.length; i < len; i++) {
      var paiGroup = paiGroupArr[i];
      var paiGroupLen = paiGroup.length;
      var tempWidth = (paiGroupLen - 1) * this.paiDistance + this.paiWidth;
      totalWidth += tempWidth;
    }

    return totalWidth;
  },
  setPaiPosByTotalWidthAndpaiGroupArr: function setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, paiGroupArr, isBtnGroup, isFirstFaPai) {
    var _this7 = this;

    isBtnGroup = isBtnGroup ? isBtnGroup : false;
    LoggerUtil.getInstance().log("是否是按钮组牌：" + isBtnGroup);
    var qiPos = totalWidth / 2;
    var tempX = 0;
    var handGroup = [];

    var _loop2 = function _loop2(i, len) {
      var paiGroup = paiGroupArr[i];
      handGroup[i] = [];

      var _loop3 = function _loop3(k, len1) {
        var paiNode = paiGroup[k];

        if (!paiNode) {
          return "continue";
        }

        if (i == 0) {
          tempX = -qiPos + _this7.paiWidth / 2 + _this7.paiDistance * k;
        } else {
          if (k == 0) {
            tempX = tempX + _this7.groupDistance + _this7.paiWidth;
          } else {
            tempX = tempX + _this7.paiDistance;
          }
        }

        var paiValue = paiNode.getComponent("paiCtrl").getPaiValue();
        handGroup[i][k] = paiValue;

        if (isFirstFaPai) {
          cc.tween(paiNode).tag(4).to(0.1, {
            position: cc.v2(tempX, 0)
          }).to(0.1).call(function () {
            if (i == len - 1 && k == len1 - 1) {
              for (var j = 0; j < paiGroupArr.length; j++) {
                var element = paiGroupArr[j];

                for (var l = 0; l < element.length; l++) {
                  var _paiNode7 = element[l];

                  if (_paiNode7) {
                    var src = _paiNode7.getComponent("paiCtrl");

                    src.setIsCanMove(true);
                  }
                }
              }

              _this7.lifeBar(paiGroupArr, isBtnGroup);
            }
          }).start();
        } else {
          paiNode.setPosition(tempX, 0);
          var src = paiNode.getComponent("paiCtrl");
          src.setIsCanMove(true);
        }
      };

      for (var k = 0, len1 = paiGroup.length; k < len1; k++) {
        var _ret = _loop3(k, len1);

        if (_ret === "continue") continue;
      }
    };

    for (var i = 0, len = paiGroupArr.length; i < len; i++) {
      _loop2(i, len);
    }

    if (!isFirstFaPai) {
      this.lifeBar(paiGroupArr, isBtnGroup);
    }

    this.setPaiNodeIndex(paiGroupArr);
    this.clickPaiArr.length = 0;
    this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
  },
  lifeBar: function lifeBar(paiGroupArr, isBtnGroup) {
    isBtnGroup = isBtnGroup ? isBtnGroup : false; // LoggerUtil.getInstance().log("lifeBar中的isBtnGroup" + isBtnGroup);

    for (var j = 0; j < this.barCount; j++) {
      // LoggerUtil.getInstance().log("bar========>:", "bar" + j)
      // LoggerUtil.getInstance().log("this.selfCardNode.name:", this.selfCardNode.name)
      var node = this.selfCardNode.getChildByName("bar" + j);

      if (node != null) {
        // LoggerUtil.getInstance().log("node.name:", node.name)
        // node.destroy();
        this.selfCardNode && this.selfCardNode.removeChild(node);
      } else {
        break;
      }
    }

    this.barCount = 0;
    this.lifeArr = [];

    for (var _j = 0, len = paiGroupArr.length; _j < len; _j++) {
      var childArr = paiGroupArr[_j];

      if (childArr && Array.isArray(childArr)) {
        for (var _i22 = 0; _i22 < childArr.length; _i22++) {
          var element = childArr[_i22];

          if (element == undefined) {
            childArr.splice(_i22, 1);
            LoggerUtil.getInstance().error("当前数组" + _j + "的第" + _i22 + "个元素为undefined");
          }
        }

        if (childArr.length != 0) {
          var type = this.checkGroupLiftBar(childArr);
          this.lifeArr.push({
            type: type,
            childArr: childArr
          });
        }
      } else {
        continue;
      }
    }

    var groupPai = this.lifeArr[0]; //点击button  group组的牌组

    LoggerUtil.getInstance().log("!!!!!!!!!!groupPai", groupPai);

    for (var _i23 = 0; _i23 < this.lifeArr.length; _i23++) {
      var _element3 = this.lifeArr[_i23];
      LoggerUtil.getInstance().log("lifeArr 的第" + _i23 + "个节点", _element3);
    }

    this.lifeArr.sort(function (a, b) {
      return a.type - b.type;
    });

    if (isBtnGroup == true) {
      LoggerUtil.getInstance().log("~~~~~~~~~~groupPai", groupPai);

      if (groupPai.type == 1 || groupPai.type == 2 || groupPai.type == 3) {
        LoggerUtil.getInstance().log("当前组的牌成序列");
      } else {
        for (var _i24 = 1; _i24 < paiGroupArr.length; _i24++) {
          var _type = this.checkGroupLiftBar(paiGroupArr[_i24]);

          LoggerUtil.getInstance().log("type" + _type, paiGroupArr[_i24]);

          if (_type == 1 || _type == 2 || _type == 3) {
            var temp = paiGroupArr[_i24];
            paiGroupArr[_i24] = paiGroupArr[_i24 - 1];
            paiGroupArr[_i24 - 1] = temp;
          } else {
            LoggerUtil.getInstance().log("组的牌组跟第" + _i24 + "个一样不成序列");
            break;
          }
        }
      }
    } // LoggerUtil.getInstance().log("存放生命序列的数组：", this.lifeArr);


    var _1StCount = 0;
    var _2ndCount = 0;
    var _3rdCount = 0;
    var scoreCount = 0; //分数

    var i = 0;

    for (var _j2 = 0, _len5 = this.lifeArr.length; _j2 < _len5; _j2++) {
      var _element4 = this.lifeArr[_j2];

      if (_element4.type == 0) {
        scoreCount += this.getGameScore(_element4.childArr);
        continue;
      } else if (_element4.type == 4) {
        this.setBar(_element4.childArr, _element4.type);
        scoreCount += this.getGameScore(_element4.childArr);
        continue;
      } else if (_element4.type == 1) {
        _1StCount++;
      } else if (_element4.type == 2) {
        _2ndCount++;
      } else if (_element4.type == 3) {
        _3rdCount++;
      }

      if (_1StCount == 1) {
        if (_element4.type == 1) {
          this.setBar(_element4.childArr, _element4.type);
        } else if (_element4.type == 2) {
          if (_2ndCount == 1) {
            this.setBar(_element4.childArr, _element4.type);
          } else if (_2ndCount >= 2) {
            this.setBar(_element4.childArr, 8); //Sequence
          }
        } else if (_element4.type == 3) {
          if (_2ndCount >= 1) {
            this.setBar(_element4.childArr, _element4.type);
          } else {
            this.setBar(_element4.childArr, 6); //2nd Need

            scoreCount += this.getGameScore(_element4.childArr);
          }
        }
      } else if (_1StCount == 2) {
        if (_element4.type == 1) {
          this.setBar(_element4.childArr, 2); //2nd
        } else if (_element4.type == 2) {
          this.setBar(_element4.childArr, 8); //Sequence
        } else if (_element4.type == 3) {
          this.setBar(_element4.childArr, 3); //Set
        }
      } else if (_1StCount > 2) {
        if (_element4.type == 1) {
          this.setBar(_element4.childArr, 7); //Pure Sequence
        } else if (_element4.type == 2) {
          this.setBar(_element4.childArr, 8); //Sequence
        } else if (_element4.type == 3) {
          this.setBar(_element4.childArr, 3); //Set
        }
      } else {
        //无第一序列
        if (_element4.type == 2) {
          this.setBar(_element4.childArr, 5); //1st Need

          scoreCount += this.getGameScore(_element4.childArr);
        } else if (_element4.type == 3) {
          this.setBar(_element4.childArr, 5); //1st Need

          scoreCount += this.getGameScore(_element4.childArr);
        }
      }
    }

    this.nowGameLifeCount = _1StCount + _2ndCount + _3rdCount;

    if (this.nowGameLifeCount > this.lastGameLifeCount && isBtnGroup == false) {
      GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zupaichenggong");
    }

    this.lastGameLifeCount = this.nowGameLifeCount;
    this.nowGameLifeCount = 0;
    LoggerUtil.getInstance().log("此时的牌分数：", scoreCount);

    if (scoreCount >= 80) {
      scoreCount = 80;
    }

    this.userInfoCtrl.setScore(scoreCount);
  },
  // =====================================================================================
  //检查分数是不是等于 0
  checkScore: function checkScore(paiValue) {
    var _this8 = this;

    var score = this.userInfoCtrl.getScore();

    if (score == 0) {
      // 发送结算消息
      this.finishReq(paiValue, this.getPaiValueArr());
    } else {
      CommonFun.getInstance().showMsgBox("Are you sure you want to declare?", "YES_NO", function (code) {
        // 发送结算消息
        _this8.finishReq(paiValue, _this8.getPaiValueArr());
      }, false, null, "Declare", function () {
        //取消结算
        LoggerUtil.getInstance().log("finishCardData", _this8.finishCardData);

        if (_this8.paiGroupArr[_this8.finishCardData.groupTag] && Array.isArray(_this8.paiGroupArr[_this8.finishCardData.groupTag])) {
          _this8.paiGroupArr[_this8.finishCardData.groupTag].splice(_this8.finishCardData.paiIndex, 0, _this8.finishCrad);
        } else {
          _this8.paiGroupArr.splice(_this8.finishCardData.groupTag, 0, []);

          _this8.paiGroupArr[_this8.finishCardData.groupTag].splice(_this8.finishCardData.paiIndex, 0, _this8.finishCrad);
        }

        _this8.finishCrad.active = true;

        _this8.setPaiNodeIndex(_this8.paiGroupArr);

        _this8.cardLibNode.getComponent(cc.Sprite).spriteFrame = null;
        _this8.cardLibNode.active = false;
        _this8.clickPaiArr = [];

        var totalWidth = _this8.getPaiTotalWidthByPaiGroupArr(_this8.paiGroupArr);

        _this8.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, _this8.paiGroupArr);
      });
    }
  },
  //根据回合数来设置弃牌的分数
  setDropScore: function setDropScore(round) {
    LoggerUtil.getInstance().log("当前回合：", round);
    var lab_dropScore = this.btn_drop.node.getChildByName("lab").getComponent(cc.Label);

    if (round <= 1) {
      lab_dropScore.string = 20 * this.cellScore;
    } else {
      lab_dropScore.string = 40 * this.cellScore;
    }
  },
  //finish，发送paiValue组到服务器
  getPaiValueArr: function getPaiValueArr() {
    var paiValueArr = [];

    for (var i = 0; i < this.paiGroupArr.length; i++) {
      var groupArr = this.paiGroupArr[i];
      var groupValueArr = [];

      for (var j = 0; j < groupArr.length; j++) {
        var paiNode = groupArr[j];
        var src = paiNode.getComponent("paiCtrl");
        var value = src.getPaiValue();
        groupValueArr.push(value);
      }

      paiValueArr.push({
        cards: groupValueArr
      });
    }

    return paiValueArr;
  },
  //finish出牌
  finishAction: function finishAction(notify) {
    this.finishCrad = this.paiGroupArr[notify.groupTag][notify.groupIndex];
    this.paiGroupArr[notify.groupTag].splice(notify.groupIndex, 1); // this.onCardRemoved(paiNode);

    this.finishCrad.active = false; // this.onCardRemoved(this.finishCrad);

    for (var i = 0, len = this.paiGroupArr.length; i < len; i++) {
      var childArr = this.paiGroupArr[i];

      if (childArr && childArr.length == 0) {
        this.paiGroupArr.splice(i, 1);
      }
    }

    var spriteFrame = this.getPaiSpriteFrameByValue(notify.paiValue);
    this.cardLibNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    this.cardLibNode.active = true;
    var totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
    this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
    this.clickPaiArr.length = 0;
    this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
  },
  // ----------------------------------------- 发牌 动作   start------------------------------------------------------------------
  //按钮从下方滑上来
  btnAction: function btnAction() {
    cc.tween(this.btnNode).tag(5).to(0.2, {
      position: cc.v2(0, 0)
    }).start();
    this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length); //全部禁止
  },
  // 发牌
  deal: function deal(valueArr, laiId, leftRemain, rightFace, rightRemain) {
    this.cardLibNode.active = true;
    var interval = 0.05; // 以秒为单位的时间间隔

    var repeat = 12; // 重复次数

    var delay = 0; // 开始延时

    var time = -1; //发牌的次数
    // let spaceX = 70;            //每个牌之间的间距

    var paiNodeArr = [];
    var initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;

    this.dealCallback = function () {
      var _this9 = this;

      time += 1;

      if (time == 0 || time == 3 || time == 7 || time == 10) {
        GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("fapai");
      } // let posX = (-410 + (spaceX * time))


      var paiNode = this.createPaiNode();
      var src = paiNode.getComponent("paiCtrl");

      if (src) {
        src.setLaiActive(false);
        src.setUpClickDistance(this.upClickDistance);
        src.setUpLimitDistance(this.upLimitDistance);
        src.setPaiDistance(this.paiDistance); // src.setPaiSpriteFrame(spriteFrame);

        src.setPaiValue(valueArr[time]);
      }

      paiNode.parent = this.selfCardNode;
      paiNode.setPosition(1, 194.5);
      paiNode.scale = 0.8;
      cc.tween(paiNode).tag(6).to(0.1, {
        scale: 1,
        position: cc.v2(-initPaiTotalWidth / 2 + this.paiDistance / 2 + time * this.paiDistance, 0, 0)
      }).call(function () {
        paiNodeArr.push(paiNode);

        if (paiNodeArr.length == 13) {
          _this9.dealTimeOutID = setTimeout(function () {
            _this9.setCardNum(paiNodeArr, valueArr, laiId, leftRemain, rightFace, rightRemain);
          }, 500);
        }
      }).start();
    }; // for (let i = 0; i < 13; i++) {
    //     this.dealCallback(i);
    // }


    this.schedule(this.dealCallback, interval, repeat, delay);
  },
  //翻转扑克牌，赋值
  setCardNum: function setCardNum(array, valueArr, laiId, leftRemain, rightFace, rightRemain) {
    this.turnCard = function (node, spriteFrame) {
      cc.tween(node).tag(7).to(0.07, {
        scaleX: 0
      }).call(function () {
        node && node.getComponent(cc.Sprite) && (node.getComponent(cc.Sprite).spriteFrame = spriteFrame);
      }).to(0.07, {
        scaleX: 1
      }).start();
    };

    for (var i = 0; i < array.length; i++) {
      var spriteFrame = this.getPaiSpriteFrameByValue(valueArr[i]);
      this.turnCard(array[i], spriteFrame);
    }

    this.paiGroupArr = this.initPaiGroupArr(array);
    this.moveCard(laiId, leftRemain, rightFace, rightRemain);
  },
  //移动至close的位置
  moveCard: function moveCard(laiId, leftRemain, rightFace, rightRemain) {
    var _this10 = this;

    var img = this.getPaiSpriteFrameByValue(laiId); //获取癞子牌的图片资源

    cc.tween(this.cardLibNode).tag(8).to(0.5, {
      position: cc.v2(-195.74, 20)
    }).to(0.1).call(function () {
      GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");

      _this10.showUniversalCard(img, leftRemain); //传入


      _this10.showOpenAreaCard(rightFace, rightRemain);

      var totalWidth = _this10.getPaiTotalWidthByPaiGroupArr(_this10.paiGroupArr);

      _this10.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, _this10.paiGroupArr, false, true);

      _this10.openPaiNode && _this10.openPaiNode.getComponent(cc.Sprite) && (_this10.tempOpenSpriteFrame = _this10.openPaiNode.getComponent(cc.Sprite).spriteFrame);

      _this10.btnAction();
    }).start();
  },
  //展示OPEN区域的牌
  showOpenAreaCard: function showOpenAreaCard(rightFace, rightRemain) {
    // GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
    if (rightFace.length == 0) {
      this.openPaiNode.getComponent(cc.Sprite).spriteFrame = null;
      this.openPaiNode.getChildByName("lai").active = false;
    } else {
      var value = rightFace[0].card;
      var openPai = this.getPaiSpriteFrameByValue(value);
      this.openPaiNode.getComponent(cc.Sprite).spriteFrame = openPai;
      var paiNum = this.getPaiNum(value);
      LoggerUtil.getInstance().log("当前阶段右边展示的牌", value, paiNum);

      if (paiNum == this.laiNumber || paiNum == "d" || paiNum == "x") {
        this.openPaiNode.getChildByName("lai").active = true;

        if (paiNum == "d" || paiNum == "x") {
          this.openPaiNode.getChildByName("lai").getChildByName("img_hat").active = false;
        } else {
          this.openPaiNode.getChildByName("lai").getChildByName("img_hat").active = true;
        }
      } else {
        this.openPaiNode.getChildByName("lai").active = false;
      }
    }

    this.lab_open.string = "OPEN(" + rightRemain + ")";
    this.cardMask.active = false;
    this.openNode.active = true;
  },
  //展示癞子牌
  showUniversalCard: function showUniversalCard(img, leftRemain) {
    var countScore = 0;
    this.closeNode.active = true;
    this.cardLibNode.active = false;
    this.lab_close.string = "(" + leftRemain + ")";
    this.cardLibNode.setPosition(1, 20);
    this.laizi_closeNode = this.closeNode.getChildByName("universal_card");
    this.laizi_closeNode.getComponent(cc.Sprite).spriteFrame = img;
    cc.tween(this.laizi_closeNode).tag(9).to(0, {
      position: cc.v2(0, 0),
      angle: 0
    }).to(0.15, {
      position: cc.v2(-29.407, 0.436),
      angle: 12
    }).start();

    for (var i = 0; i < this.paiGroupArr.length; i++) {
      var childArr = this.paiGroupArr[i];

      for (var j = 0; j < childArr.length; j++) {
        var paiNode = childArr[j];
        var src = paiNode.getComponent("paiCtrl");
        var paiValue = src.getPaiValue();
        var paiNum = this.getPaiNum(paiValue);
        src.setIsCanMove(true);
        src.setLaiActive(paiNum == this.laiNumber || paiNum == "d" || paiNum == "x");
      }
    }
  },
  //起牌动作
  fapaiAction: function fapaiAction(notify, isSelf) {
    var _this11 = this;

    if (isSelf) {
      if (this.paiGroupArr.length == 0) {
        return;
      }

      var spriteFrame = this.getPaiSpriteFrameByValue(notify.card);
      var paiNode = this.createPaiNode();
      var src = paiNode.getComponent("paiCtrl");
      var lastPosX = this.getLastPaiPosX();
      var paiNum = this.getPaiNum(notify.card);
      var childArr = this.paiGroupArr[this.paiGroupArr.length - 1];
      childArr.push(paiNode);
      LoggerUtil.getInstance().log("起牌：", notify.card);

      if (src) {
        src.setLaiActive(paiNum == this.laiNumber || paiNum == "d" || paiNum == "x");
        src.setUpClickDistance(this.upClickDistance);
        src.setUpLimitDistance(this.upLimitDistance);
        src.setPaiDistance(this.paiDistance);
        src.setPaiSpriteFrame(spriteFrame);
        src.setPaiValue(notify.card);
      }

      if (notify.side == 0) {
        paiNode.scale = 0.8;
        paiNode.parent = this.selfCardNode;
        paiNode.setPosition(-195, 195);
        cc.tween(paiNode).tag(1).to(0.3, {
          scale: 1,
          position: cc.v2(lastPosX + this.paiDistance, 0)
        }).call(function () {
          // 更新组的信息
          _this11.setPaiNodeIndex(_this11.paiGroupArr);

          src.setIsCanMove(true);

          var totalWidth = _this11.getPaiTotalWidthByPaiGroupArr(_this11.paiGroupArr);

          _this11.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, _this11.paiGroupArr);

          _this11.openPaiNode && _this11.openPaiNode.getComponent(cc.Sprite) && (_this11.tempOpenSpriteFrame = _this11.openPaiNode.getComponent(cc.Sprite).spriteFrame);
        }).start();
      } else {
        paiNode.scale = 0.8;
        paiNode.parent = this.selfCardNode;
        paiNode.setPosition(195.8, 195);
        cc.tween(paiNode).tag(1).to(0.3, {
          scale: 1,
          position: cc.v2(lastPosX + this.paiDistance, 0)
        }).call(function () {
          // 更新组的信息
          _this11.setPaiNodeIndex(_this11.paiGroupArr);

          src.setIsCanMove(true);

          var totalWidth = _this11.getPaiTotalWidthByPaiGroupArr(_this11.paiGroupArr);

          _this11.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, _this11.paiGroupArr);

          _this11.openPaiNode && _this11.openPaiNode.getComponent(cc.Sprite) && (_this11.tempOpenSpriteFrame = _this11.openPaiNode.getComponent(cc.Sprite).spriteFrame);
        }).start();
      }
    } else {
      var otherUserCtrl = this.getOtherNodeCtrlBySeat(notify.seat);
      var toPostion = otherUserCtrl.getPosition();
      var _spriteFrame = this.poke_back;

      var _paiNode8 = this.createPaiNode();

      _paiNode8.getComponent(cc.Sprite).spriteFrame = _spriteFrame;
      _paiNode8.scale = 0.8;
      _paiNode8.parent = this.node;

      if (notify.side == 0) {
        _paiNode8.setPosition(-194.2, 22);

        cc.tween(_paiNode8).tag(1).to(0.2, {
          scale: 0.8,
          position: toPostion
        }).call(function () {
          setTimeout(function () {
            _this11.onCardRemoved(_paiNode8);
          }, 500);
        }).start();
      } else {
        var openSpriteFrame = this.getPaiSpriteFrameByValue(notify.card);
        _paiNode8.getComponent(cc.Sprite).spriteFrame = openSpriteFrame;

        _paiNode8.setPosition(195.8, 22);

        cc.tween(_paiNode8).to(0, {
          scale: 0.8,
          position: cc.v2(195.8, 22)
        }).to(0.2, {
          scale: 0.8,
          position: toPostion
        }).call(function () {
          setTimeout(function () {
            _this11.onCardRemoved(_paiNode8);
          }, 500);
        }).start();
      }
    }

    this.lab_open.string = "(" + notify.rightRemain + ")";
    this.lab_close.string = "(" + notify.leftRemain + ")";
    this.showOpenAreaCard(notify.rightFace, notify.rightRemain);
  },
  setPaiNodeIndex: function setPaiNodeIndex(paiGroupArr) {
    // 更新组的信息
    var t = 0;

    for (var i = 0, len = paiGroupArr.length; i < len; i++) {
      if (Array.isArray(paiGroupArr[i])) {
        for (var k = 0, len1 = paiGroupArr[i].length; k < len1; k++) {
          var paiNode = paiGroupArr[i][k];

          if (paiNode) {
            paiNode.setSiblingIndex(this.paiZIndexArr[t]);
            var src = paiNode.getComponent("paiCtrl");
            src.setGroupTag(i, k);
          } else {
            LoggerUtil.getInstance().error("当前组" + i + "位" + k + "节点不存在");
          }

          t++;
        }
      }
    }
  },
  getLastPaiPosX: function getLastPaiPosX() {
    LoggerUtil.getInstance().log("获取牌组DASdsadas坐标", this.paiGroupArr.length);

    if (this.paiGroupArr.length == 0) {
      return 0;
    }

    var tempArr = [];

    for (var i = 0, len = this.paiGroupArr.length; i < len; i++) {
      var group = this.paiGroupArr[i];

      if (group) {
        var tempArr1 = [];

        for (var k = 0, len1 = group.length; k < len1; k++) {
          var node = group[k];

          if (node) {
            tempArr1.push(node);
          }
        }

        if (tempArr1.length > 0) {
          tempArr.push(tempArr1);
        }
      }
    }

    this.paiGroupArr = tempArr;
    var childArr = this.paiGroupArr[this.paiGroupArr.length - 1];
    LoggerUtil.getInstance().log("获取牌组最后一个组", childArr);
    var lastNode = Array.isArray(childArr) ? childArr[childArr.length - 1] : childArr;

    if (!lastNode) {
      LoggerUtil.getInstance().error("lastNode不存在！");
      return 0;
    }

    return lastNode.x;
  },
  //流局牌型动画
  flowPaiAction: function flowPaiAction(notify) {
    var _this12 = this;

    for (var j = 0; j < this.barCount; j++) {
      LoggerUtil.getInstance().log("bar========>:", "bar" + j);
      var node = this.selfCardNode.getChildByName("bar" + j);

      if (node != null) {
        // node.destroy();
        this.selfCardNode && this.selfCardNode.removeChild(node);
      } else {
        break;
      }
    }

    this.barCount = 0;

    for (var i = 0; i < this.paiGroupArr.length; i++) {
      var childArr = this.paiGroupArr[i];

      var _loop4 = function _loop4(k) {
        var paiNode = childArr[k];
        var originPos = paiNode.getPosition();

        if (paiNode) {
          var src = paiNode.getComponent("paiCtrl");

          var paiNum = _this12.getPaiNum(src.getPaiValue());

          src.setLaiActive(false);
          var tempSpriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
          src.setIsCanMove(false);
          cc.tween(paiNode).tag(10).to(0.2, {
            position: cc.v2(0, 0)
          }).call(function () {
            paiNode.getComponent(cc.Sprite).spriteFrame = _this12.poke_back;
          }).delay(0.5).to(0.3, {
            position: originPos
          }).delay(0.2).to(0.1, {
            scaleX: 0
          }).call(function () {
            paiNode.getComponent(cc.Sprite).spriteFrame = tempSpriteFrame;
          }).to(0.1, {
            scaleX: 1
          }).call(function () {
            _this12.lab_close.string = "(" + notify.leftRemain + ")";

            _this12.showOpenAreaCard(notify.rightFace, notify.rightRemain);

            src.setLaiActive(paiNum == _this12.laiNumber || paiNum == "d" || paiNum == "x");
            src.setIsCanMove(true);
          }).start();
        }
      };

      for (var k = 0; k < childArr.length; k++) {
        _loop4(k);
      }
    }

    this.flowPaiCallBack = function () {
      _this12.lifeBar(_this12.paiGroupArr);
    };

    this.scheduleOnce(this.flowPaiCallBack, 2);
  },
  // ----------------------------------- 发牌    end----------------------------------------------------
  // ======================================= 牌组 start=========================================================
  // 小组的生命序列是什么
  // 1 同花顺， 2 软顺，  3 AAA或AAAA， 4 错误组，5 无 
  checkGroupLiftBar: function checkGroupLiftBar(group) {
    if (group && group.length <= 2) {
      // LoggerUtil.getInstance().log("传入的数组长度小于2");
      return 0;
    }

    var laiZiNum = 0;
    var laiZiArr = [];
    var heiTaoGroup = [];
    var hongXinGroup = [];
    var meiHuaGroup = [];
    var fangKuaiGroup = [];
    var paivalueArr = [];

    for (var i = 0, len = group.length; i < len; i++) {
      var paiNode = group[i];

      if (paiNode) {
        var src = paiNode.getComponent("paiCtrl");
        var paiValue = src.getPaiValue();

        if (paiValue == 52 || paiValue == 53 || this.getPaiNum(paiValue) == this.laiNumber) {
          // 癞子牌
          laiZiNum++;
          laiZiArr.push(paiValue);
        } else {
          if (paiValue <= 12) {
            fangKuaiGroup.push(paiValue);
          } else if (paiValue <= 25) {
            meiHuaGroup.push(paiValue);
          } else if (paiValue <= 38) {
            hongXinGroup.push(paiValue);
          } else if (paiValue <= 51) {
            heiTaoGroup.push(paiValue);
          }

          paivalueArr.push(paiValue);
        }
      }
    }

    ;
    var huaSeNum = 0;

    if (fangKuaiGroup.length > 0) {
      huaSeNum++;
    }

    if (meiHuaGroup.length > 0) {
      huaSeNum++;
    }

    if (hongXinGroup.length > 0) {
      huaSeNum++;
    }

    if (heiTaoGroup.length > 0) {
      huaSeNum++;
    } // LoggerUtil.getInstance().log("GroupLiftBar花色-=----------------", huaSeNum);


    if (huaSeNum == 0) {
      return 2;
    } else if (huaSeNum == 1) {
      var chaNum = 0;
      var nary = paivalueArr.sort(function (a, b) {
        return a - b;
      }); //先判断是不是QKA，

      if (this.getPaiNum(nary[0]) == 0) {
        //第一张为A
        var exceptA_Arr = nary.slice(1, nary.length);

        if (this.getPaiNum(exceptA_Arr[0]) == 0) {
          //第二张也为 A
          return 4;
        } else if (exceptA_Arr.length == 1) {
          var cha = this.containA(nary[0], exceptA_Arr[0]);

          if (cha == 0) {
            //含有同一张牌
            return 4;
          } else {
            chaNum += cha - 1;
          }
        } else {
          for (var _i25 = 0; _i25 < exceptA_Arr.length - 1; _i25++) {
            if (this.getPaiNum(exceptA_Arr[_i25]) == 0) {
              return 4;
            }

            var _cha = exceptA_Arr[_i25 + 1] - exceptA_Arr[_i25];

            if (_cha == 0) {
              //含有同一张牌
              return 4;
            } else {
              chaNum += _cha - 1;
            }
          }

          var diff = this.containA(nary[0], exceptA_Arr[0]) >= this.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) ? this.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) : this.containA(nary[0], exceptA_Arr[0]);
          chaNum += diff - 1;
        }
      } else {
        for (var _i26 = 0, _len6 = nary.length; _i26 < _len6 - 1; _i26++) {
          var _cha2 = nary[_i26 + 1] - nary[_i26];

          if (_cha2 == 0) {
            //含有同一张牌
            return 4;
          } else {
            chaNum += _cha2 - 1;
          }
        }
      }

      var isSameType = this.isSameType(nary, laiZiArr); //是不是同一个花色

      var isContinuity = this.isContinuity(nary, laiZiArr); //是不是连续的

      if (chaNum == 0) {
        if (laiZiNum > 0) {
          if (isSameType && isContinuity) {
            return 1;
          } else {
            return 2;
          }
        } else {
          return 1;
        }
      } else if (chaNum != 0) {
        if (chaNum > laiZiNum) {
          return 4;
        } else if (chaNum <= laiZiNum) {
          if (isSameType && isContinuity) {
            return 1;
          } else {
            return 2;
          }
        }
      }
    } else if (huaSeNum == 2 || huaSeNum == 3 || huaSeNum == 4) {
      var isRepeat = this.isRepeat(paivalueArr);

      if (isRepeat) {
        return 4;
      } else {
        var paiTotal = 0;
        var paiNumArr = [];

        var _nary = paivalueArr.sort(function (a, b) {
          return a - b;
        });

        for (var _i27 = 0, _len7 = _nary.length; _i27 < _len7; _i27++) {
          var pai = this.getPaiNum(_nary[_i27]);
          paiNumArr.push(pai);
          paiTotal += pai;
        }

        paiNumArr.sort(function (a, b) {
          return a - b;
        });

        if (paiTotal == paiNumArr[0] * _nary.length && laiZiNum + _nary.length <= 4) {
          return 3;
        } else {
          return 4;
        }
      }
    } else {
      return 4;
    }
  },

  /**
   * 
   * @param {Number} A 牌A的值
   * @param {Number} indexValue 某一个 index 的值
   * @returns 两者之间的差值
   */
  containA: function containA(A, indexValue) {
    var cha = 0,
        diff = indexValue - A;

    switch (diff) {
      case 12:
        //最后一张为K
        cha = 1;
        break;

      case 11:
        //最后一张为Q
        cha = 2;
        break;

      case 10:
        //最后一张为J
        cha = 3;
        break;

      case 9:
        //最后一张为10
        cha = 4;
        break;

      case 8:
        //最后一张为9
        cha = 5;
        break;

      case 7:
        //最后一张为8
        cha = 6;
        break;

      case 6:
        //最后一张为7
        cha = 6;
        break;

      case 5:
        //最后一张为6
        cha = 5;
        break;

      case 4:
        //最后一张为5
        cha = 4;
        break;

      case 3:
        //最后一张为4
        cha = 3;
        break;

      case 2:
        //最后一张为3
        cha = 2;
        break;

      case 1:
        //最后一张为2
        cha = 1;
        break;

      default:
        break;
    }

    return cha;
  },
  isRepeat: function isRepeat(arr) {
    var hash = {};

    for (var i in arr) {
      if (hash[arr[i]]) {
        return true;
      }

      hash[arr[i]] = true;
    }

    return false;
  },
  isSameType: function isSameType(a, b) {
    if (a === void 0) {
      a = [];
    }

    if (b === void 0) {
      b = [];
    }

    var paiValue = a[0];
    var a_paiType = this.getPaiType(paiValue);

    for (var i = 0, len = b.length; i < len; i++) {
      var value = b[i];
      var b_paiType = this.getPaiType(value);

      if (a_paiType == b_paiType) {
        continue;
      } else {
        return false;
      }
    }

    return true;
  },
  //是不是连续
  isContinuity: function isContinuity(a, b) {
    if (a === void 0) {
      a = [];
    }

    if (b === void 0) {
      b = [];
    }

    var c = a.concat(b);
    c = c.sort(function (a, b) {
      return a - b;
    });

    for (var i = 0, len = c.length; i < len - 1; i++) {
      if (c[i + 1] == c[i]) {
        return false;
      } //有两张相同的癞子牌


      if (c[i + 1] - c[i] != 1) {
        //第一张牌为 A，最后一张为 K
        if (this.getPaiNum(c[i]) == 0 && this.getPaiNum(c[len - 1]) == 12) {
          continue;
        }

        return false;
      }
    }

    return true;
  },

  /**
   * 设置牌型底部的颜色条
   * temp = [x1,x2,x3,x4],length = n
   * width = (n-1)*牌间距 + card.width
   * X 坐标: 中间的某两张牌坐标和/2    或者 最中间的一张牌的 X 坐标
   */
  //使用setBar之前清空 bar
  setBar: function setBar(paiGroup, type, isShowText, parentNode) {
    isShowText = isShowText ? false : true;
    parentNode = parentNode ? parentNode : this.selfCardNode;
    LoggerUtil.getInstance().log("获得的牌组的生命序列type：" + type, "isShowText", isShowText, "parentNode", parentNode);

    if (type == 0) {
      // LoggerUtil.getInstance().log("数组长度小于2，type不存在，跳过，数组为", paiGroup);
      return;
    }

    var barNode = this.setBarColor(type, isShowText);
    var barArea = this.setBarArea(paiGroup); // LoggerUtil.getInstance().log("底部条的区域===========:", barArea);

    barNode.x = barArea.posX;
    barNode.width = barArea.width;
    barNode.y = -68;
    LoggerUtil.getInstance().log("this.barCount===============>", this.barCount);
    barNode.name = "bar" + this.barCount;
    this.barCount = this.barCount + 1;
    barNode.parent = parentNode; // barNode.setSiblingIndex(74);

    barNode.zIndex = 74; // LoggerUtil.getInstance().log("当前生命条的index：",barNode.getSiblingIndex());
  },
  setBarArea: function setBarArea(group) {
    LoggerUtil.getInstance().log("group==================>", group.length);
    var width = 0;
    var posX = 0;
    var posY = 0;
    width = (group.length - 1) * this.paiDistance + group[0].width;

    if (group.length % 2 == 1) {
      var index = Math.floor(group.length / 2);
      posX = group[index].x;
    } else {
      var index1 = Math.floor(group.length / 2) - 1;
      var index2 = Math.floor(group.length / 2);
      posX = (group[index1].x + group[index2].x) / 2;
    }

    return {
      width: width,
      posX: posX
    };
  },
  setBarColor: function setBarColor(type, isShowText) {
    var barNode = cc.instantiate(this.prefab_bar);
    var spriteFrame = null;
    var barCtrl = barNode.getComponent("barCtrl");
    var lab = barNode.getChildByName("lab_life").getComponent(cc.Label); // lab.string = ""
    //1 同花顺， 2 软顺，  3 AAA或AAAA， 4 错误组，5 无 
    // 1st Life  2nd Life  Not Correct  Pure Sequence  Sequenc  1st Life Needed  2nd Life Needed  Set

    switch (type) {
      case 1:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_green');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(6, 66, 0);

        if (isShowText == true) {
          // lab.string = "1st Life";
          barCtrl.setBarLabel("1st Life");
        }

        break;

      case 2:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_green');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(6, 66, 0);

        if (isShowText == true) {
          // lab.string = "2nd Life";
          barCtrl.setBarLabel("2nd Life");
        }

        break;

      case 3:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_green');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(6, 66, 0);

        if (isShowText == true) {
          // lab.string = "Set";
          barCtrl.setBarLabel("Set");
        }

        break;

      case 4:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_red');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(128, 1, 1); //红

        if (isShowText == true) {
          // lab.string = "Not Correct";
          barCtrl.setBarLabel("Not Correct");
        }

        break;

      case 5:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_yellow');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(139, 95, 1); //黄

        if (isShowText == true) {
          // lab.string = "1st Life Needed";
          barCtrl.setBarLabel("1st Life Needed");
        }

        break;

      case 6:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_yellow');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(139, 95, 1); //黄

        if (isShowText == true) {
          // lab.string = "2nd Life Needed";
          barCtrl.setBarLabel("2nd Life Needed");
        }

        break;

      case 7:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_green');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(6, 66, 0);

        if (isShowText == true) {
          // lab.string = "Pure Sequence";
          barCtrl.setBarLabel("Pure Sequence");
        }

        break;

      case 8:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_green');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(6, 66, 0);

        if (isShowText == true) {
          // lab.string = "Sequence";
          barCtrl.setBarLabel("Sequence");
        }

        break;

      default:
        spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_red');
        barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        lab.node.color = new cc.Color(128, 1, 1); //红

        if (isShowText == true) {
          // lab.string = "Not Correct";
          barCtrl.setBarLabel("Not Correct");
        }

        break;
    }

    return barNode;
  },
  getGameScore: function getGameScore(group) {
    var countScore = 0;

    for (var j = 0; j < group.length; j++) {
      var paiNode = group[j];

      if (paiNode) {
        var src = paiNode.getComponent("paiCtrl");
        var paiValue = src.getPaiValue();
        var paiNum = this.getPaiNum(paiValue);

        if (paiNum == this.laiNumber || paiNum == "d" || paiNum == "x") {
          continue;
        } else {
          // 牌面 10_________J______________Q_______________K_______________A
          if (paiNum == 9 || paiNum == 10 || paiNum == 11 || paiNum == 12 || paiNum == 0) {
            countScore += 10;
            continue;
          }

          countScore += paiNum + 1;
        }
      } else {
        LoggerUtil.getInstance().error("获取当前组" + group + "的第" + j + "个节点不存在");
      }
    }

    return countScore;
  },
  // 玩家发送表情
  shortmessagenotify: function shortmessagenotify(notify) {
    if (!notify) {
      return;
    }

    ;
    var msgType = notify.msgType; // 消息类型 0短语 1表情 2礼物

    var target = notify.target; // 接收者seat (-1表示群发)

    var sender = notify.sender; // 发送者seat

    var price = notify.price; // 消息价格

    var senderAfter = notify.senderAfter; // 发送者扣价后货币

    var name = notify.name; // 表情名/短语内容

    if (msgType == 0 || msgType == 1) {
      var playScript = this.getPlayerInfoByUserId(target);
      if (playScript) playScript.face(notify);
    } else if (msgType == 2) {
      var targetNodeArr = [];
      var senderCtrl = this.getPlayerInfoByUserId(sender);

      if (!senderCtrl || !senderCtrl.node) {
        return;
      }

      ;

      if (target == -1) {
        for (var i = 0; i < this.userArryNode.length; i++) {
          var userNode = this.userArryNode[i];
          var userInfoCtrl = null;

          if (userNode.name == 'userNode') {
            userInfoCtrl = userNode.getComponent('rummyUserInfoCtrl');
          } else if (userNode.name == 'otherNode') {
            userInfoCtrl = userNode.getComponent('rummyOtherUserCtrl');
          }

          ;

          if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
            targetNodeArr.push(userNode);
          }

          ;
        }
      } else {
        var playersCtrl = this.getPlayerInfoByUserId(target);

        if (playersCtrl) {
          targetNodeArr.push(playersCtrl.node);
        }

        ;
      }

      ;
      CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
    }
  },

  /**
   * 根据用户ID获取用户控制脚本
   * @param {*} userID 绝对座位ID
   * @returns 
   */
  getPlayerInfoByUserId: function getPlayerInfoByUserId(userID) {
    var playerInfo = null;
    var userInfoCtrl = null;

    if (userID == this.selfAbsoluteSeatId) {
      userInfoCtrl = this.userInfoCtrl;
    } else {
      userInfoCtrl = this.getOtherNodeCtrlBySeat(userID);
    }

    var relativeSeatId = this.changeAbsoluteSeatIdToRelative(userID);

    if (userInfoCtrl && userInfoCtrl.seatId === relativeSeatId) {
      playerInfo = userInfoCtrl;
    }

    return playerInfo;
  },
  getUserArrayNode: function getUserArrayNode(players) {
    var arr = [];

    for (var i = 0; i < players.length; i++) {
      var item = players[i];
      var nodeCtrl = this.getOtherNodeCtrlBySeat(item.seat);
      var node = nodeCtrl && nodeCtrl.node;
      node && arr.push(node);
    }

    return arr;
  },
  // ====================================== 牌组  end ==============================================================
  //控制下半部分的几个按钮的交互  type 分别为 0(点起0张牌) 1(点起 1 张牌) 2(点起超过 2 张牌) default
  controlButton: function controlButton(isSelfTurn, isPickOneCard, length) {
    if (isSelfTurn == false) {
      if (length >= 2) {
        this.changButtonSprite(this.btn_group, true, "group");
      } else {
        this.changButtonSprite(this.btn_group, false, "group");
      }

      this.changButtonSprite(this.btn_drop, false, "drop");
      this.changButtonSprite(this.btn_discard, false, "discord");
      this.changButtonSprite(this.btn_finish, false, "finish");
    } else {
      if (isPickOneCard == false) {
        this.changButtonSprite(this.btn_drop, true, "drop");

        if (length >= 2) {
          this.changButtonSprite(this.btn_group, true, "group");
        } else {
          this.changButtonSprite(this.btn_group, false, "group");
        }

        this.changButtonSprite(this.btn_discard, false, "discord");
        this.changButtonSprite(this.btn_finish, false, "finish");
      } else {
        this.changButtonSprite(this.btn_drop, false, "drop");

        if (length == 1) {
          this.changButtonSprite(this.btn_discard, true, "discord");
          this.changButtonSprite(this.btn_finish, true, "finish");
          this.changButtonSprite(this.btn_group, false, "group");
        } else if (length >= 2) {
          this.changButtonSprite(this.btn_discard, false, "discord");
          this.changButtonSprite(this.btn_finish, false, "finish");
          this.changButtonSprite(this.btn_group, true, "group");
        } else {
          this.changButtonSprite(this.btn_discard, false, "discord");
          this.changButtonSprite(this.btn_finish, false, "finish");
          this.changButtonSprite(this.btn_group, false, "group");
        }
      }
    }
  },
  //删除手牌，放置到对象池
  putSelfCardToPool: function putSelfCardToPool() {
    var children = this.selfCardNode.children || [];

    for (var i = children.length - 1; i >= 0; i--) {
      var item = children[i]; // LoggerUtil.getInstance().log(`手牌的第${i}个子节点：`,item);

      if (item && item.name == 'pai') {
        this.onCardRemoved(item);
      } else {
        this.selfCardNode.removeChild(item);
      }
    }
  },
  //玩家弃牌
  playdrop: function playdrop() {
    if (this.isTuiChu = true && (this.tableStatus == 2 || this.tableStatus == 3 || this.tableStatus == 4)) {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      window.isNeedShowRoomList = "rummy";
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  //改变下半部分的几个按钮Sprite
  changButtonSprite: function changButtonSprite(btnComponent, bool, name) {
    btnComponent.interactable = bool;
  },
  //切割 number，第二位 + 后面的N位
  getSliceNum: function getSliceNum(number) {
    var str = number.toString();
    var arr = str.split("");
    LoggerUtil.getInstance().log("~~~~~~", arr, number);
    var last = arr[2];

    if (arr.length >= 4) {
      last = [arr[2], arr[3]].join('');
    }

    return {
      groupTag: arr[1],
      groupIndex: last
    };
  },
  deepClone: function deepClone(obj) {
    var objClone = Array.isArray(obj) ? [] : {};

    if (obj && typeof obj === "object") {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          //判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            //如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }

    return objClone;
  },
  getAbsoluteSelfSeatId: function getAbsoluteSelfSeatId(notify) {
    if (Array.isArray(notify.players) == false) {
      return;
    }

    for (var i = 0; i < notify.players.length; i++) {
      var player = notify.players[i];

      if (player.user.displayName == GlobalCfg.USER_DATAS.userId) {
        this.selfAbsoluteSeatId = player.seat;
        break;
      }
    }
  },
  //将绝对的座位ID转换为相对座位ID
  changeAbsoluteSeatIdToRelative: function changeAbsoluteSeatIdToRelative(changeID) {
    var relativeSeatId = (changeID + 6 - this.selfAbsoluteSeatId) % 6;
    LoggerUtil.getInstance().log("\u8F6C\u6362\u524D\u7684\u7EDD\u5BF9\u5750\u6807\uFF1A" + changeID + "\u8F6C\u6362\u540E\u7684\u76F8\u5BF9\u5750\u6807\uFF1A" + relativeSeatId);
    return relativeSeatId;
  },
  //将相对的座位ID转换为绝对座位ID
  changeRelativeSeatIdToAbsolute: function changeRelativeSeatIdToAbsolute(relativeSeatId) {
    var absoluteSeatId = (relativeSeatId + 6 + this.selfAbsoluteSeatId) % 6;
    return absoluteSeatId;
  },
  //通过 seat 获取其他玩家节点脚本，错误返回 false
  getOtherNodeCtrlBySeat: function getOtherNodeCtrlBySeat(seat) {
    var relativeSeatId = this.changeAbsoluteSeatIdToRelative(seat);

    for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
      var otherUserNode = this.playersNode.children[i];
      var rummyOtherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
      var otherSeat = rummyOtherUserCtrl.getSeatId();

      if (otherSeat == relativeSeatId) {
        return rummyOtherUserCtrl;
      }
    }

    if (relativeSeatId == this.userInfoCtrl.getSeatId()) {
      return this.userInfoCtrl;
    }

    return false;
  },
  //通过 playerId 获取其他玩家节点脚本，错误返回 false
  getOtherNodeCtrlByPlayerId: function getOtherNodeCtrlByPlayerId(playerId) {
    for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
      var otherUserNode = this.playersNode.children[i];
      var rummyOtherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
      var otherPlayerId = rummyOtherUserCtrl.getPlayerId();

      if (otherPlayerId == playerId) {
        return rummyOtherUserCtrl;
      }
    }

    return false;
  },

  /**
   * 
   * @param {cc.Node} parentNode 传入的节点
   * @param {String} nodeName 寻找的父节点 name
   * @returns {String}
   */
  recursionFindParent: function recursionFindParent(parentNode, nodeName) {
    if (parentNode.name == nodeName) {
      return parentNode;
    } else {
      var parent = parentNode.parent;
      return this.recursionFindParent(parent, nodeName);
    }
  },
  // 设置记牌器按钮的状态
  setRecorderCard: function setRecorderCard(bool) {
    this.btn_cardListShow.node.active = bool;
  },
  // 显示一些界面的东西  
  showLobbyUI: function showLobbyUI(str, bool) {
    if (!this.node) {
      return;
    }

    if (str == "shouZhi" && this.huSeat) {
      this.ske_shouZhi_close.active = bool;
      this.ske_shouZhi_open.active = bool;

      if (!bool) {
        this.ske_close_guang.active = false;
        this.ske_cardLib_guang.active = false;
        this.ske_open_guang.active = false;
      }
    } else if (str == "qiCrad") {
      this.ske_close_guang.active = true;
      this.ske_cardLib_guang.active = false;
      this.ske_open_guang.active = true;
    } else if (str == "outCard") {
      this.ske_close_guang.active = false;
      this.ske_cardLib_guang.active = true;
      this.ske_open_guang.active = true;
    } else if (str == "offCradGuang") {
      this.huSeat = true;
      this.ske_close_guang.active = false;
      this.ske_cardLib_guang.active = false;
      this.ske_open_guang.active = false;
    }
  },
  // ========================================= 向服务器发送请求 START ====================================================================
  // //获取房间列表
  // getRoomListReq: function (type) {
  //     GameServerManager.send("gameservice.queryroomlist", "QueryRoomListReq", {
  //         gameType: type,	    //游戏类型
  //     });
  // },
  //进入房间
  enterRoomReq: function enterRoomReq() {
    // let roomid = cc.sys.localStorage.getItem("rummyID");
    LoggerUtil.getInstance().log("进入房间id", GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID);
    GameServerManager.send("gameservice.enterroom", "EnterRoomReq", {
      id: GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID //游戏类型

    });
  },
  //换桌
  changeRoomReq: function changeRoomReq() {
    if (!this.isChange) {
      GameServerManager.send("gameservice.changetable", "ChangeTableReq", {});
    } else {
      CommonFun.getInstance().showTips("No changing tables in the game");
    }
  },
  //退出游戏
  exitGame: function exitGame() {
    GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
  },
  //游戏准备 
  gameReadReq: function gameReadReq(bool) {
    GameServerManager.send("gameservice.ready", "ReadyReq", {
      ready: bool
    });
  },
  //短消息    num: 0短语, 1表情
  shortMsgReq: function shortMsgReq(num, str) {
    GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
      msgtype: num,
      msgid: str
    });
  },
  //起牌  
  pickCardReq: function pickCardReq(num) {
    GameServerManager.send("gameservice.pickcard", "PickCardReq", {
      side: num // 起牌方位 0左1右

    });
  },
  //出牌 
  outCardReq: function outCardReq(num, groupIndex) {
    this.line.active = false;
    GameServerManager.send("gameservice.outcard", "OutCardReq", {
      card: num,
      // 牌
      index: groupIndex //牌组

    });
  },
  //弃牌 
  dropReq: function dropReq() {
    GameServerManager.send("gameservice.drop", "DropReq", {});
  },
  //选择胡 
  finishReq: function finishReq(num, arr) {
    GameServerManager.send("gameservice.choosehu", "ChooseHuReq", {
      outCard: num,
      // 牌
      groups: arr
    });
  },
  //最后的摆牌
  TidyFinalCardsReq: function TidyFinalCardsReq(arr, score) {
    GameServerManager.send("gameservice.tidyfinalcards", "TidyFinalCardsReq", {
      groups: arr,
      score: score
    });
  },
  //主动拉取游戏场景
  RefreshGameSceneReq: function RefreshGameSceneReq() {
    GameServerManager.send("gameservice.refreshgamescene", "RefreshGameSceneReq", {});
  },
  SetContinueReq: function SetContinueReq(settlement) {
    this.settlement = settlement;
    LoggerUtil.getInstance().log("this.isKicked: ", this.isKicked);

    if (this.isKicked == true) {
      this.settlement.destroy(); // this.userInfoCtrl.lab_scoreName.string = "Score:";
      // this.userInfoCtrl.lab_score.string = "0";

      this.initNodeState(false);

      for (var i = 0, len = this.playersNode.children.length; i < len; i++) {
        var otherUserNode = this.playersNode.children[i];
        var otherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
        otherUserCtrl && otherUserCtrl.freshUser();
      }

      this.enterRoomReq();
    } else {
      GameServerManager.send("gameservice.setcontinue", "SetContinueReq", {});
    }
  },
  // ========================================= 向服务器发送请求 END ====================================================================
  // update (dt) {},
  onDestroy: function onDestroy() {
    if (this.node.getChildByName("pai")) {
      this.node.getChildByName("pai").destroy();
    }

    this.cardPool.clear();
    cc.Tween.stopAll();
    this.unschedule(this.dealCallback);
    this.unschedule(this.fapaiCallBack1);
    this.unschedule(this.fapaiCallBack2);
    this.unschedule(this.freshNotifyCallback);
    this.unschedule(this.flowPaiCallBack);
    clearTimeout(this.dealTimeOutID);
    ClientNotify.removeByHandle("PUSHPAYSUCCESS", this.pushpaysuccess);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    GlobalCfg.ACT_SCENE_CTRL = null;
  },
  // 提示
  TipsLab: function TipsLab(num) {
    if (num) {
      var gameStartTips = this.node.getChildByName("gameStartTips");

      if (gameStartTips) {
        var tishiCtrl = gameStartTips.getComponent("tishiCtrl");
        tishiCtrl.setTishi(this.textArr[num]);
      } else {
        var Tips = cc.instantiate(this.prefab_tishi);
        Tips.name = "gameStartTips";

        var _tishiCtrl4 = Tips.getComponent("tishiCtrl");

        this.node.addChild(Tips);

        _tishiCtrl4.setTishi(this.textArr[num]);
      }
    } else {
      for (var i = 0; i < 3; i++) {
        var _gameStartTips = this.node.getChildByName("gameStartTips");

        if (_gameStartTips) {
          _gameStartTips.destroy();
        }
      }
    }
  },
  // 摆牌
  reqMovehandgroup: function reqMovehandgroup(paiNodeArr) {
    var groups = [];

    for (var i = 0; i < paiNodeArr.length; i++) {
      var paiGroup = paiNodeArr[i];
      groups[i] = [];

      for (var k = 0; k < paiGroup.length; k++) {
        var paiNode = paiGroup[k];

        if (!paiNode) {
          continue;
        }

        var paiValue = paiNode.getComponent("paiCtrl").getPaiValue();
        groups[i][k] = paiValue;
      }
    }

    if (!groups) {
      return;
    }

    var tempGroups = [];

    for (var _i28 = 0, len = groups.length; _i28 < len; _i28++) {
      var group = groups[_i28];

      if (!group || group.length <= 0) {
        return;
      }

      tempGroups.push({
        cards: group
      });
    }

    LoggerUtil.getInstance().log("向服务器发送的手牌的数据是：", tempGroups);
    GameServerManager.send("gameservice.movehandgroup", "MoveHandGroupReq", {
      groups: tempGroups
    });
  }
});

cc._RF.pop();