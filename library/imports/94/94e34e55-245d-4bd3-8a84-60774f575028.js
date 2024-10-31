"use strict";
cc._RF.push(module, '94e345VJF1L04qEYHdPV1Ao', 'Lobby');
// ResourcesBundle/Scene/Lobby.js

"use strict";

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var GameDownloader = require("GameDownloader");

cc.Class({
  "extends": cc.Component,
  properties: {
    /**
     * 用户名字
     */
    lab_userName: cc.Label,

    /**
     * 用户Id
     */
    lab_userId: cc.Label,

    /**
     * 用户金币
     */
    lab_userDiamond: cc.Label,

    /**
     * 用户Bonus
     */
    lab_userBonus: cc.Label,

    /**
     * 用户头像精灵
     */
    sprite_tx: cc.Sprite,

    /**
     * 头像按钮
     */
    btn_tx: cc.Button,

    /**
     * 安达尔
     */
    btn_miniandar: cc.Button,

    /**
     * 奔驰宝马
     */
    btn_minibenzbmw: cc.Button,

    /**
     * 6个骰子
     */
    btn_minijhandimunda: cc.Button,

    /**
     * 龙虎斗
     */
    btn_minilonghu: cc.Button,

    /**
     * 时时猜
     */
    btn_miniluckyloto: cc.Button,

    /**
     * 拉米
     */
    btn_minirummy: cc.Button,

    /**
     * 赛马
     */
    btn_minisaima: cc.Button,

    /**
     * 七上七下
     */
    btn_miniseven: cc.Button,

    /**
     * 水果机
     */
    btn_minishuiguo: cc.Button,

    /**
     * 玛雅机台
     */
    btn_minimaya: cc.Button,

    /**
     * TP
     */
    btn_miniteenpatti: cc.Button,

    /**
     * TP2
     */
    btn_miniteenpatti2: cc.Button,

    /**
     * 百人TP
     */
    btn_miniteenpattibaccarat: cc.Button,

    /**
     * 火箭
     */
    btn_minirocket: cc.Button,

    /**
     * 动物园
     */
    btn_minizoo: cc.Button,

    /**
     * 板球
     */
    btn_minicricket: cc.Button,

    /**
     * 宙斯
     */
    btn_minizeus: cc.Button,

    /**
     * 轮播
     */
    node_banner: cc.Node,

    /**
     * 轮播-->推广员
     */
    btn_referEarn: cc.Button,

    /**
     * 轮播-->充值
     */
    btn_quickRecharge: cc.Button,

    /**
     * 轮播-->活动挑战
     */
    btn_getNow: cc.Button,

    /**
     * 充值
     */
    btn_add: cc.Button,
    btn_addCash: cc.Button,

    /**
     * 提现
     */
    btn_withDarw: cc.Button,

    /**
     * 将券兑换活动
     */
    btn_bonusTransfer: cc.Button,
    node_bonusTransferBg: cc.Node,

    /**
     * 客服
     */
    btn_service: cc.Button,

    /**
     * 设置
     */
    btn_setting: cc.Button,

    /**
     * 邮箱
     */
    btn_mail: cc.Button,

    /**
     * VIP
     */
    btn_vip: cc.Button,
    node_gameScollview: cc.Node,

    /**
     * 中间部分父节点
     */
    node_middles: cc.Node,

    /**
     * VIP等级图标
     */
    sprite_vipLevel: cc.Sprite,

    /**
     * VIP等级图标图集
     */
    atlas_levelIcon: cc.SpriteAtlas,

    /**
     * 活动 Go Betting
     */
    btn_goBetiing: cc.Button,

    /**
     * 拼多多
     */
    btn_pdd: cc.Button,

    /**
     * tp引导手指
     */
    node_tpFinger: cc.Node
  },
  ctor: function ctor() {
    this.isShowGameBtn = false;
    this.is_can_click = true;
    this.is_can_click1 = true;
    this.isLoadHead = false;
    this.updateInval = 0;
    this.teenPatti2Endpoint = "";
  },
  checkShiPei: function checkShiPei() {
    cc.game.setFrameRate(60);
    var w = cc.view.getVisibleSize().width;
    this.node_middles.setContentSize(w, 480);
    this.node_middles.setPosition(0, -20);
    this.node_banner.setPosition(-(w / 2) + 337.83, 0);
    this.node_gameScollview.setPosition(-(w / 2) + 510, 20);
    this.node_gameScollview.setContentSize(w - 510 - 30, 480);
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_LOBBY);

    if (CommonFun.getInstance().isNeewShowSignToast() && GlobalCfg.USER_DATAS.signInfo && GlobalCfg.USER_DATAS.signInfo.done == false && GlobalCfg.USER_DATAS.signInfo.gifts && GlobalCfg.USER_DATAS.signInfo.gifts.length > 0) {
      CommonFun.getInstance().showSignToast();
    }

    ;
    /**
     * 配合服务器处理
     */

    if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
      GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.reliefGiftDiamond;
    }

    ;

    if (GlobalCfg.USER_DATAS.firstGiftDiamond > 0) {
      GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.firstGiftDiamond;
    }

    ;
    this.checkShiPei();
    this.setBtnsClick();
    this.setGameOrder();
    this.showUserInfo();
    this.showBanner();
    this.showOtherModules();
    this.showVipLevelIcon();
    this.showSmallGameBtns();
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.playLobby();
  },
  start: function start() {
    CommonFun.getInstance().addCarouselStrip();
    CommonFun.getInstance().addSidebar();
    CommonFun.getInstance().updateSidebarData(true); // LoggerUtil.getInstance().log("GlobalCfg.Forced_Migration: ", GlobalCfg.Forced_Migration);
    // // //需求：强制引导用户点击跳转
    // if  (GlobalCfg.Forced_Migration){
    //     CommonFun.getInstance().showHallTip();
    // }

    if (window.isNeedShowRoomList) {
      this.showGameRoomList();
    }

    ;

    if (GlobalCfg.USER_DATAS.inGame.length > 0) {
      LoggerUtil.getInstance().log("当前处于其他游戏中：", JSON.stringify(GlobalCfg.USER_DATAS.inGame));
      var gameMap = {
        "minirummy": SceneManager.getInstance().sceneType.RUMMY,
        "miniteenpatti": SceneManager.getInstance().sceneType.TEENPATTI
      };
      var gameTypeMap = {
        "minirummy": GlobalCfg.SMALL_GAME_DATAS.rummyData.product,
        "miniteenpatti": GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product
      };
      var curInGame = String(GlobalCfg.USER_DATAS.inGame[0]);

      if (Reflect.has(gameMap, curInGame) == true) {
        var toGame = gameMap[curInGame];
        GlobalCfg.CUR_GAME_TYPE = gameTypeMap[curInGame];
        LoggerUtil.getInstance().warn("Reconnect:", toGame);
        CommonFun.getInstance().showProgress();
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, toGame);
      }
    } else {
      this.showTransBounsRedPoint();

      if (GlobalCfg.FIRST_RECHARGE_TIPS_SHOW == true) {
        var shopParentNode = CommonFun.getInstance().getLayerNode(GlobalCfg.PREFAB_PARENT.SHOP);

        if (cc.isValid(shopParentNode.getChildByName("newshop"))) {
          shopParentNode.getChildByName("newshop").destroy();
        }

        ;

        if (cc.isValid(shopParentNode.getChildByName("newWithdrawal"))) {
          shopParentNode.getChildByName("newWithdrawal").destroy();
        }

        ;
        this.showFirstRechargeTipPopup();
      }

      ;

      if (window["isNeedShowWithDrawPreData"]) {
        window["isNeedShowWithDrawPreData"] = false;
        CommonFun.getInstance().showWithDrawPreData();
      } else {
        this.showToastViews();
        this.showActivityGoBetting();
      }

      ;
    }
  },
  setGameOrder: function setGameOrder() {
    // 默认游戏按钮顺序
    var defaultGameSiblingIndexObj = {
      "minirocket": 1,
      "minijhandimunda": 2,
      "miniteenpatti": 3,
      "miniteenpattibaccarat": 4,
      "miniandar": 5,
      "minilonghu": 6,
      "minishuiguo": 7,
      "minimaya": 8,
      "minisaima": 9,
      "minibenzbmw": 10,
      "minirummy": 11,
      "miniseven": 12,
      "minizoo": 13,
      "minicricket": 14,
      "miniluckyloto": 15,
      "minizeus": 16
    };
    var getAppConfigValue = CommonFun.getInstance().getAppConfigValueByKey("GAME_LOBBY_BTN_SIBLING_INDEX_DATA", defaultGameSiblingIndexObj);

    if (getAppConfigValue != defaultGameSiblingIndexObj) {
      defaultGameSiblingIndexObj = _extends({}, getAppConfigValue);
    }

    var arr = Object.entries(defaultGameSiblingIndexObj);
    arr.sort(function (a, b) {
      return a[1] - b[1];
    });
    this.gameUpdateDownloadOrder = [].concat(arr.map(function (item) {
      return item[0];
    })); // 小游戏下载更新顺序 

    var btnsMap = {
      "minirocket": this.btn_minirocket,
      "minijhandimunda": this.btn_minijhandimunda,
      "miniteenpatti": this.btn_miniteenpatti,
      "miniteenpattibaccarat": this.btn_miniteenpattibaccarat,
      "miniandar": this.btn_miniandar,
      "minilonghu": this.btn_minilonghu,
      "minishuiguo": this.btn_minishuiguo,
      "minimaya": this.btn_minimaya,
      "minisaima": this.btn_minisaima,
      "minibenzbmw": this.btn_minibenzbmw,
      "minirummy": this.btn_minirummy,
      "miniseven": this.btn_miniseven,
      "minizoo": this.btn_minizoo,
      "minicricket": this.btn_minicricket,
      "minizeus": this.btn_minizeus
    };

    var func = function func(indexArr, object) {
      for (var i = 0; i < indexArr.length; i++) {
        var key = indexArr[i][0];
        var index = indexArr[i][1];
        object[key] && object[key].node.setSiblingIndex(index);
      }

      ;
    };

    func(arr, btnsMap);
  },

  /**
   * 设置按钮点击事件监听
   */
  setBtnsClick: function setBtnsClick() {
    this.btn_tx.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_withDarw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_bonusTransfer.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_service.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_setting.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_mail.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_vip.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_goBetiing.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_pdd.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_getNow.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_referEarn.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_quickRecharge.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_miniandar.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minibenzbmw.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minijhandimunda.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minilonghu.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_miniluckyloto.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minirummy.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minisaima.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_miniseven.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minishuiguo.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minimaya.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_miniteenpatti.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_miniteenpatti2.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_miniteenpattibaccarat.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minirocket.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minizoo.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minicricket.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
    this.btn_minizeus.node.on("click", CommonFun.getInstance().debounce(this.btnClickGame, 2), this);
  },

  /**
   * 显示玩家信息内容
   */
  showUserInfo: function showUserInfo() {
    this.loadHeadSp();
    this.lab_userId.string = "ID: " + GlobalCfg.USER_DATAS.userId;
    this.lab_userName.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 10);
    this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    this.lab_userBonus.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.bonus / 100);
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);

    if (isCanShowVIPFont) {
      this.lab_userName.node.color = new cc.Color(250, 225, 76);
    } else {
      this.lab_userName.node.color = new cc.Color(255, 255, 255);
    }

    ;
  },

  /**
   * 显示轮播图内容
   */
  showBanner: function showBanner() {
    if (GlobalCfg.USER_DATAS.openModules.includes(18)) {
      this.node_banner.active = true;
      var pageView_ads = this.node_banner.getComponent(cc.PageView);
      this.schedule(function () {
        var pageIndex = pageView_ads.getCurrentPageIndex();
        pageIndex += 1;

        if (pageIndex > 2) {
          pageIndex = 0;
        }

        ;
        pageView_ads.scrollToPage(pageIndex);
      }, 3);
    } else {
      this.node_banner.active = false;
    }

    ;
  },

  /**
   * 显示其他模块内容
   */
  showOtherModules: function showOtherModules() {
    /**
     * 充值系统
     */
    if (GlobalCfg.USER_DATAS.openModules.includes(4)) {
      this.btn_add.node.active = true;
      this.btn_addCash.node.active = true;
      this.btn_quickRecharge.node.active = true;
      var languagesType = I18NUtil.getInstance().getLanguageType();
      this.setAddCashBtnByLanguageType(languagesType);
    } else {
      this.btn_add.node.active = false;
      this.btn_addCash.node.active = false;
      this.btn_quickRecharge.node.active = false;
    }

    ;
    /**
     * 提现
     */

    if (GlobalCfg.USER_DATAS.openModules.includes(5)) {
      this.btn_withDarw.node.active = true;
    } else {
      this.btn_withDarw.node.active = false;
    }

    ;
    /**
     * 奖券兑换活动
     */

    if (GlobalCfg.USER_DATAS.openModules.includes(12)) {
      this.btn_bonusTransfer.node.active = true;
      this.node_bonusTransferBg.active = true;
    } else {
      this.btn_bonusTransfer.node.active = false;
      this.node_bonusTransferBg.active = false;
    }

    ;
    /**
     * 客服
     */

    if (Object.values(GlobalCfg.USER_DATAS.customerService).length > 0 && Object.values(GlobalCfg.USER_DATAS.customerService).join("").length > 0) {
      this.btn_service.node.active = true;
    } else {
      this.btn_service.node.active = false;
    }

    ;
    /**
     * 拼多多
     */

    if (GlobalCfg.USER_DATAS.pddRemainCount != -1 && GlobalCfg.USER_DATAS.openModules.includes(14)) {// this.btn_pdd.node.active = true;
    } else {
      this.btn_pdd.node.active = false;
    }

    ;
    /**
     * 邮箱
     */

    if (GlobalCfg.USER_DATAS.openModules.includes(13)) {
      this.btn_mail.node.active = true;
      this.showNewEmailRedDot(GlobalCfg.USER_DATAS.new_email);
    } else {
      this.btn_mail.node.active = false;
    }

    ;
    /**
     * VIP系统按钮
     */

    if (GlobalCfg.USER_DATAS.recharged > 0 && GlobalCfg.USER_DATAS.userVip.level > 0 && CommonFun.getInstance().isOpenVipModule()) {
      this.btn_vip.node.active = true;
    } else {
      this.btn_vip.node.active = false;
    }

    ;
    var w = cc.view.getVisibleSize().width;
    this.node_middles.setPosition(cc.v2(-132, -20));
    this.node_gameScollview.setContentSize(w - 510 - 30 + 132, 480);
    this.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30 + 132, 480);
  },

  /**
   * 处理小游戏按钮逻辑
   */
  showSmallGameBtns: function showSmallGameBtns() {
    this.btn_miniandar.node.active = false;
    this.btn_minibenzbmw.node.active = false;
    this.btn_minijhandimunda.node.active = false;
    this.btn_minilonghu.node.active = false;
    this.btn_miniluckyloto.node.active = false;
    this.btn_minirummy.node.active = false;
    this.btn_minisaima.node.active = false;
    this.btn_miniseven.node.active = false;
    this.btn_minishuiguo.node.active = false;
    this.btn_minimaya.node.active = false;
    this.btn_miniteenpatti.node.active = false;
    this.btn_miniteenpatti2.node.active = false;
    this.btn_miniteenpattibaccarat.node.active = false;
    this.btn_minirocket.node.active = false;
    this.btn_minizoo.node.active = false;
    this.btn_minicricket.node.active = false;
    this.btn_minizeus.node.active = false;

    if (!Array.isArray(GlobalCfg.USER_DATAS.games) || GlobalCfg.USER_DATAS.games.length == 0) {
      return;
    }

    ;
    /**
     * 既要判断对应的小游戏模块是否开启，还要判断对应的小游戏参数是否存在
     */

    var needUpdataArr = [];
    LoggerUtil.getInstance().log("22222 GlobalCfg.USER_DATAS.openModules == ", GlobalCfg.USER_DATAS.openModules);

    for (var i = 0, len = GlobalCfg.USER_DATAS.games.length; i < len; i++) {
      var gameData = GlobalCfg.USER_DATAS.games[i];
      var gameProduct = gameData.product;
      var gameHost = gameData.host;

      switch (gameProduct) {
        case "miniandar":
          if (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105)) {
            this.btn_miniandar.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.andeerData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.andeerData.product = gameProduct;
            var isNeedUpdata = CommonFun.getInstance().isNeedUpdata("andaerGame");

            if (isNeedUpdata && cc.sys.isNative) {
              needUpdataArr.push("andaerGame");
            }
          }

          ;
          break;

        case "minibenzbmw":
          if (GlobalCfg.USER_DATAS.openModules.includes(110)) {
            this.btn_minibenzbmw.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.benZData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.benZData.product = gameProduct;

            var _isNeedUpdata = CommonFun.getInstance().isNeedUpdata("Benz");

            if (_isNeedUpdata && cc.sys.isNative) {
              needUpdataArr.push("Benz");
            }
          }

          ;
          break;

        case "minijhandimunda":
          if (GlobalCfg.USER_DATAS.openModules.includes(111)) {
            this.btn_minijhandimunda.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.mundaData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.mundaData.product = gameProduct;

            var _isNeedUpdata2 = CommonFun.getInstance().isNeedUpdata("munda");

            if (_isNeedUpdata2 && cc.sys.isNative) {
              needUpdataArr.push("munda");
            }
          }

          ;
          break;

        case "minilonghu":
          if (GlobalCfg.USER_DATAS.openModules.includes(109)) {
            this.btn_minilonghu.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.lhdData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.lhdData.product = gameProduct;

            var _isNeedUpdata3 = CommonFun.getInstance().isNeedUpdata("lhdGame");

            if (_isNeedUpdata3 && cc.sys.isNative) {
              needUpdataArr.push("lhdGame");
            }
          }

          ;
          break;

        case "miniluckyloto":
          if (GlobalCfg.USER_DATAS.openModules.includes(107)) {
            this.btn_miniluckyloto.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.sscData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.sscData.product = gameProduct;

            var _isNeedUpdata4 = CommonFun.getInstance().isNeedUpdata("sscGame");

            if (_isNeedUpdata4 && cc.sys.isNative) {
              needUpdataArr.push("sscGame");
            }
          }

          ;
          break;

        case "minirummy":
          if (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103)) {
            this.btn_minirummy.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.rummyData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.rummyData.product = gameProduct;

            var _isNeedUpdata5 = CommonFun.getInstance().isNeedUpdata("Rummy");

            if (_isNeedUpdata5 && cc.sys.isNative) {
              needUpdataArr.push("Rummy");
            }
          }

          ;
          break;

        case "minisaima":
          if (GlobalCfg.USER_DATAS.openModules.includes(112)) {
            this.btn_minisaima.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.horseRaceData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.horseRaceData.product = gameProduct;

            var _isNeedUpdata6 = CommonFun.getInstance().isNeedUpdata("horseRaceGame");

            if (_isNeedUpdata6 && cc.sys.isNative) {
              needUpdataArr.push("horseRaceGame");
            }
          }

          ;
          break;

        case "miniseven":
          if (GlobalCfg.USER_DATAS.openModules.includes(106)) {
            this.btn_miniseven.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.upDownData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.upDownData.product = gameProduct;

            var _isNeedUpdata7 = CommonFun.getInstance().isNeedUpdata("7up7downGame");

            if (_isNeedUpdata7 && cc.sys.isNative) {
              needUpdataArr.push("7up7downGame");
            }

            ;
          }

          ;
          break;

        case "minishuiguo":
          if (GlobalCfg.USER_DATAS.openModules.includes(113)) {
            this.btn_minishuiguo.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.product = gameProduct;

            var _isNeedUpdata8 = CommonFun.getInstance().isNeedUpdata("fruitMachine");

            if (_isNeedUpdata8 && cc.sys.isNative) {
              needUpdataArr.push("fruitMachine");
            }

            ;
          }

          ;
          break;

        case "minimaya":
          if (GlobalCfg.USER_DATAS.openModules.includes(119)) {
            this.btn_minimaya.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.product = gameProduct;

            var _isNeedUpdata9 = CommonFun.getInstance().isNeedUpdata("mayaMachine");

            if (_isNeedUpdata9 && cc.sys.isNative) {
              needUpdataArr.push("mayaMachine");
            }

            ;
          }

          ;
          break;

        case "miniteenpatti":
          if (GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
            this.btn_miniteenpatti.node.active = true;

            if (CommonFun.getInstance().isNeedShowTPFingerTip() && CommonFun.getInstance().isEnteredTPGame() == false && GlobalCfg.USER_DATAS.recharged == 0) {
              this.node_tpFinger.active = true;
            } else {
              this.node_tpFinger.active = false;
            }

            ;

            if (GlobalCfg.server_id == "0" || GlobalCfg.server_id == "21") {
              this.btn_miniteenpatti2.node.active = true;
              this.teenPatti2Endpoint = GlobalCfg.WEB_SOCKET_GAME + "teenpattip2" + "/echo";
            }

            ;
            GlobalCfg.SMALL_GAME_DATAS.teenPattiData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product = gameProduct;

            var _isNeedUpdata10 = CommonFun.getInstance().isNeedUpdata("tpGame");

            if (_isNeedUpdata10 && cc.sys.isNative) {
              needUpdataArr.push("tpGame");
            }

            ;
          }

          ;
          break;

        case "miniteenpattibaccarat":
          if (GlobalCfg.USER_DATAS.openModules.includes(108)) {
            this.btn_miniteenpattibaccarat.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.baccaratData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.baccaratData.product = gameProduct;

            var _isNeedUpdata11 = CommonFun.getInstance().isNeedUpdata("baccarat3PattiGame");

            if (_isNeedUpdata11 && cc.sys.isNative) {
              needUpdataArr.push("baccarat3PattiGame");
            }
          }

          ;
          break;

        case "minirocket":
          if (GlobalCfg.USER_DATAS.openModules.includes(115)) {
            this.btn_minirocket.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.rocketData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.rocketData.product = gameProduct;

            var _isNeedUpdata12 = CommonFun.getInstance().isNeedUpdata("rocket");

            if (_isNeedUpdata12 && cc.sys.isNative) {
              needUpdataArr.push("rocket");
            }
          }

          break;

        case "minizoo":
          if (GlobalCfg.USER_DATAS.openModules.includes(116)) {
            this.btn_minizoo.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.zooData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.zooData.product = gameProduct;

            var _isNeedUpdata13 = CommonFun.getInstance().isNeedUpdata("zooGame");

            if (_isNeedUpdata13 && cc.sys.isNative) {
              needUpdataArr.push("zooGame");
            }
          }

          break;

        case "minicricket":
          if (GlobalCfg.USER_DATAS.openModules.includes(117)) {
            this.btn_minicricket.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.cricketData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.cricketData.product = gameProduct;

            var _isNeedUpdata14 = CommonFun.getInstance().isNeedUpdata("cricketGame");

            if (_isNeedUpdata14 && cc.sys.isNative) {
              needUpdataArr.push("cricketGame");
            }
          }

          break;

        case "minizeus":
          if (GlobalCfg.USER_DATAS.openModules.includes(118)) {
            this.btn_minizeus.node.active = true;
            GlobalCfg.SMALL_GAME_DATAS.zeusData.endpoint = GlobalCfg.WEB_SOCKET_GAME + gameHost + "/echo";
            GlobalCfg.SMALL_GAME_DATAS.zeusData.product = gameProduct;

            var _isNeedUpdata15 = CommonFun.getInstance().isNeedUpdata("zeusGame");

            if (_isNeedUpdata15 && cc.sys.isNative) {
              needUpdataArr.push("zeusGame");
            }
          }

          break;

        default:
          break;
      }
    }

    ;

    if (needUpdataArr.length > 0) {
      var gameSubPackageNames = {
        "minirocket": "rocket",
        "minijhandimunda": "munda",
        "miniteenpatti": "tpGame",
        "miniteenpattibaccarat": "baccarat3PattiGame",
        "miniandar": "andaerGame",
        "minilonghu": "lhdGame",
        "minishuiguo": "fruitMachine",
        "minimaya": "mayaMachine",
        "minisaima": "horseRaceGame",
        "minibenzbmw": "Benz",
        "minirummy": "Rummy",
        "miniseven": "7up7downGame",
        "minizoo": "zooGame",
        "minicricket": "cricketGame",
        "miniluckyloto": "sscGame",
        "minizeus": "zeusGame"
      };

      for (var _i = 0, _len = this.gameUpdateDownloadOrder.length; _i < _len; _i++) {
        var element = this.gameUpdateDownloadOrder[_i];

        if (gameSubPackageNames[element] && needUpdataArr.indexOf(gameSubPackageNames[element]) != -1) {
          GameDownloader.getInstance().commonLoadGame(gameSubPackageNames[element]);
        }

        ;
      }

      ;
    }

    ;
    var languagesType = I18NUtil.getInstance().getLanguageType();
    this.setSmallGameBtnByLanguageType(languagesType);
  },
  showVipLevelIcon: function showVipLevelIcon() {
    if (CommonFun.getInstance().isOpenVipModule() && GlobalCfg.USER_DATAS.userVip.level > 0) {
      this.sprite_vipLevel.node.active = true;
      this.sprite_vipLevel.spriteFrame = this.atlas_levelIcon.getSpriteFrame(GlobalCfg.USER_DATAS.userVip.level);
    } else {
      this.sprite_vipLevel.node.active = false;
    }

    ;
  },
  showTransBounsRedPoint: function showTransBounsRedPoint() {
    if (GlobalCfg.USER_DATAS.recharged <= 0) {
      this.btn_bonusTransfer.node.getChildByName('redDot').active = false;
      return;
    }

    var curRecharged = Math.round(GlobalCfg.USER_DATAS.recharged / 100);
    var curCanGet = Math.round(GlobalCfg.USER_DATAS.undraw / 100);
    var arr = [[100, 200], [200, 500], [500, 2000], [2000, 5000], [5000, 10000], [10000, 20000], [20000, Number.MAX_SAFE_INTEGER]];
    var canGetArr = [9, 15, 30, 40, 50, 100, 200];
    var i = 0,
        len = arr.length;

    while (i < len) {
      var _arr$i = arr[i],
          begin = _arr$i[0],
          end = _arr$i[1];

      if (i == 0) {
        if (curRecharged >= begin && curRecharged <= end) {
          break;
        }
      } else {
        if (curRecharged > begin && curRecharged <= end) {
          break;
        }
      }

      i++;
    }

    if (curCanGet >= canGetArr[i]) {
      this.btn_bonusTransfer.node.getChildByName('redDot').active = true;
    } else {
      this.btn_bonusTransfer.node.getChildByName('redDot').active = false;
    }

    LoggerUtil.getInstance().log("CurIndex:" + i + ",range:" + arr[i] + "\uFF0CcurCanGet:" + curCanGet + ",compare Value:" + canGetArr[i]);
  },

  /**
   * 处理弹框逻辑
   */
  showToastViews: function showToastViews() {
    if (GlobalCfg.USER_DATAS.recharged == 0) {
      this.dealNotRechargeToast();
    } else {
      this.dealRechargeToast();
    }

    ;
  },
  showActivityGoBetting: function showActivityGoBetting() {
    if (GlobalCfg.USER_DATAS.openModules.includes(22) == false) {
      this.btn_goBetiing.node.active = false;
      return;
    }

    function checkActivityGoBettingData() {
      var selfbet = GlobalCfg.USER_DATAS.betrebate.bet;
      var item = GlobalCfg.USER_DATAS.betrebate.item;
      item = item.sort(function (a, b) {
        return a.bet - b.bet;
      });

      for (var i = 0; i < item.length; i++) {
        if (selfbet >= item[i].bet && item[i].received == false) {
          return true;
        }
      }

      return false;
    }

    ;

    if (GlobalCfg.USER_DATAS.recharged == 0) {
      this.btn_goBetiing.node.active = false;
    } else {
      if (GlobalCfg.USER_DATAS.betrebate.item.length == 0) {
        this.btn_goBetiing.node.active = false;
        return;
      }

      this.btn_goBetiing.node.active = true;
      var time = this.btn_goBetiing.node.getChildByName('time').getComponent(cc.Label);
      time.string = CommonFun.getInstance().getTodayCountdown();

      this.scheduleGetTodayTimeCountdown = function () {
        time.string = CommonFun.getInstance().getTodayCountdown();
      };

      this.schedule(this.scheduleGetTodayTimeCountdown, 1);
      var spine = this.btn_goBetiing.node.getChildByName('Background').getComponent(sp.Skeleton);

      if (checkActivityGoBettingData.call(this) == true) {
        spine.setAnimation(0, 'animation2', true);
      } else {
        spine.setAnimation(0, 'animation', true);
      }
    }
  },
  dealNotRechargeToast: function dealNotRechargeToast() {
    var _this = this;

    /**
     * 新人奖励
     */
    if (GlobalCfg.USER_DATAS.firstGiftDiamond > 0) {
      this.showFirstGiftToast();
      return;
    }

    ;
    var defaultPopupWithdrawLimit = CommonFun.getInstance().getAppConfigValueByKey('POPUP_WITHDRAW_DATA', 100); // 提现弹窗限制默认值

    var func = function func(date) {
      var _date = date * 1000;

      var _curDate = new Date().getTime();

      var _differ = _curDate - _date;

      if (_differ < 24 * 60 * 60 * 1000) {
        return Number(30 / 60).toFixed(1);
      } else if (_differ < 3 * 24 * 60 * 60 * 1000) {
        return Number(20 / 60).toFixed(1);
      } else if (_differ < 5 * 24 * 60 * 60 * 1000) {
        return Number(10 / 60).toFixed(1);
      } else {
        return Number(5 / 60).toFixed(1);
      }
    };

    var toastWithDrawFrequency = Number(func(GlobalCfg.USER_DATAS.registerTime));
    var popup_BonusCard_Time = CommonFun.getInstance().getAppConfigValueByKey('POPUP_BonusCard_FREQUENCY_TIME_MINUTE', 0);
    var BonusCardFrequency = Number((popup_BonusCard_Time / 60).toFixed(1));
    /**
     * 拼多多
     */

    if (GlobalCfg.USER_DATAS.openModules.includes(14) && GlobalCfg.USER_DATAS.pddNewly && this.isNeedShowPointToastByHours("Pdd", 72)) {
      this.updateToastLocalStorageByHours("Pdd", 72);
      this.showPddToast();
    }
    /**
     * 提现
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(5) && GlobalCfg.USER_DATAS.userDiamond > defaultPopupWithdrawLimit * 100 && this.isNeedShowPointToastByHours("WithDraw", toastWithDrawFrequency)) {
      this.updateToastLocalStorageByHours("WithDraw", toastWithDrawFrequency);
      this.showWithDrawToast();
    }
    /** 
     * 首充
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(10) && this.isNeedShowPointToastByHours("FirstRecharge", 1)) {
      this.updateToastLocalStorageByHours("FirstRecharge", 1);
      this.showFirstRechargeToast();
    }
    /**
     * 金钻卡
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(11) && GlobalCfg.USER_DATAS.voucherCard == 0 && this.isNeedShowPointToastByHours("BonusCard", BonusCardFrequency)) {
      this.updateToastLocalStorageByHours("BonusCard", BonusCardFrequency);
      this.showBonusCardToast();
    }
    /**
     * 推广员
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(15) && this.isNeedShowPointToastByHours("Promoter", 1)) {
      this.updateToastLocalStorageByHours("Promoter", 1);
      this.showPromoterToast();
    }

    ;
    /**
     * 救济金
     * 
     */

    if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
      this.scheduleOnce(function () {
        _this.showReliefToast();
      }, 0.5);
    }

    ;
  },
  dealRechargeToast: function dealRechargeToast() {
    var popup_BonusCard_Time = CommonFun.getInstance().getAppConfigValueByKey('POPUP_BonusCard_FREQUENCY_TIME_MINUTE', 0);
    var BonusCardFrequency = Number((popup_BonusCard_Time / 60).toFixed(1));

    if (GlobalCfg.USER_DATAS.openModules.includes(14) && GlobalCfg.USER_DATAS.pddNewly && this.isNeedShowPointToastByHours("Pdd", 72)) {
      this.updateToastLocalStorageByHours("Pdd", 72);
      this.showPddToast();
    }
    /**
     * 二次充值
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(20) && this.checkShowSuperDiscount() == true) {
      // this.showSecondRechargeToast();
      CommonFun.getInstance().showBankruptcy();
    }
    /**
     * 金钻卡
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(11) && GlobalCfg.USER_DATAS.voucherCard == 0 && this.isNeedShowPointToastByHours("BonusCard", BonusCardFrequency)) {
      this.updateToastLocalStorageByHours("BonusCard", BonusCardFrequency);
      this.showBonusCardToast();
    }
    /**
     * 有可领取的Bonus
     */
    else if (GlobalCfg.USER_DATAS.openModules.includes(12) && GlobalCfg.USER_DATAS.userDiamond < 1000 && GlobalCfg.USER_DATAS.undraw >= 100) {
      CommonFun.getInstance().showBonusTransfer();
    }

    if (GlobalCfg.USER_DATAS.voucherDayGift.length > 0) {
      var voucherDayGift = [].concat(GlobalCfg.USER_DATAS.voucherDayGift);
      voucherDayGift.forEach(function (element) {
        element.amount = element.amount / 100;
      });
      CommonFun.getInstance().showRewardsTips(voucherDayGift);
      GlobalCfg.USER_DATAS.voucherDayGift = [];
    }
  },

  /**
   * 检测是否需要显示SuperDiscount
   * @returns {boolean}
   */
  checkShowSuperDiscount: function checkShowSuperDiscount() {
    var superDiscount_Show_In_Lobby = CommonFun.getInstance().getAppConfigValueByKey('SuperDiscount_Show_In_Lobby', false);
    var superDiscount_Show_Rate = parseFloat(CommonFun.getInstance().getAppConfigValueByKey('SuperDiscount_Show_Rate', 0.4));

    if (superDiscount_Show_In_Lobby == true) {
      if (GlobalCfg.USER_DATAS.userDiamond < GlobalCfg.USER_DATAS.recharged * superDiscount_Show_Rate && this.isNeedShowPointToastByHours("SecondRecharge", Number((30 / 60).toFixed(1)))) {
        this.updateToastLocalStorageByHours("SecondRecharge", Number((30 / 60).toFixed(1)));
        return true;
      }

      return false;
    }

    return false;
  },

  /**
   * 根据本地缓存判断是否需要显示弹框
   * @param {*} toastType 弹框类型
   * @param {*} frequency 每日显示的次数
   */
  isNeedShowPointToastByDay: function isNeedShowPointToastByDay(toastType, frequency) {
    /**
     * 今日零点毫秒级的时间戳
     */
    var todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");

    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;

        if (showTag != todayZeroTimeStamp + "_" + frequency) {
          return true;
        } else {
          return false;
        }

        ;
      } catch (error) {
        return false;
      }

      ;
    } else {
      return true;
    }

    ;
  },
  updateToastLocalStorageByDay: function updateToastLocalStorageByDay(toastType, frequency) {
    /**
     * 今日零点毫秒级的时间戳
     */
    var todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");

    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;
        var showTagArr = showTag.split("_");
        var showTimes = showTagArr[1];

        if (showTag != todayZeroTimeStamp + "_" + frequency) {
          if (showTagArr[0] != "" + todayZeroTimeStamp) {
            showTimes = 0;
          }

          ;

          if (showTagArr[0] != "" + todayZeroTimeStamp) {
            showTimes = 0;
          }

          ;
          showTimes = parseInt(showTimes) + 1;
          toastLocalData.showTag = todayZeroTimeStamp + "_" + showTimes;
          cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(toastLocalData));
        }

        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
      }

      ;
    } else {
      var _toastLocalData = {
        showTag: todayZeroTimeStamp + "_1"
      };
      cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(_toastLocalData));
    }

    ;
  },

  /**
   * 根据本地缓存判断是否需要显示弹框
   * @param {*} toastType 弹框类型
   * @param {*} hours 间隔几个小时
   */
  isNeedShowPointToastByHours: function isNeedShowPointToastByHours(toastType, hours) {
    /**
     * 当前毫秒级的时间戳
     */
    var curTimeStamp = new Date().getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");

    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;

        if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
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
  updateToastLocalStorageByHours: function updateToastLocalStorageByHours(toastType, hours) {
    /**
     * 当前毫秒级的时间戳
     */
    var curTimeStamp = new Date().getTime();
    var toastLocalStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage");

    if (toastLocalStorage) {
      try {
        var toastLocalData = JSON.parse(toastLocalStorage);
        var showTag = toastLocalData.showTag;

        if (curTimeStamp > parseInt(showTag) + hours * 60 * 60 * 1000) {
          toastLocalData.showTag = "" + curTimeStamp;
          cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(toastLocalData));
        }

        ;
      } catch (error) {
        LoggerUtil.getInstance().error(toastType + "\u672C\u5730\u7F13\u5B58\u7684\u6570\u636E\u5F02\u5E38\uFF1A", cc.sys.isNative ? JSON.stringify(error) : error);
      }

      ;
    } else {
      var _toastLocalData2 = {
        showTag: curTimeStamp
      };
      cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_" + toastType + "_LocalStorage", JSON.stringify(_toastLocalData2));
    }

    ;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    LoggerUtil.getInstance().log("msgId === ", msgId);

    if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS) {
      self.setSmallGameLoadProgress(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE) {
      self.setSmallGameLoadComplete(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_TGY_REWARD || msgId == GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD) {
      var price = notify.price;
      GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, price);
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD) {
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.HIDE_TGY_REDPOINT) {} else if (msgId == GlobalCfg.CLIENT_MSG_ID.CHALLENGES_ACT) {
      self.dealChallengesAct(notify);
    } else if (msgId == 'lobbyservice.marquee') {
      if (notify) {
        if (notify.isRobot == true) {
          GlobalCfg.MAR_QUEE_DATA_ROBOT.push(notify);
        } else {
          GlobalCfg.MAR_QUEE_DATA.push(notify);
        }

        ;
      }

      ;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_FIRST_GIFT_REWARD) {
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_RELIEF_REWARD) {
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO) {
      GlobalCfg.USER_DATAS.userName = notify.nickname;
      GlobalCfg.USER_DATAS.userHeadimgurl = notify.userHeadimgurl;
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CLOSE_SSCGAME_REFRESH_LOBBY) {
      // 救济金
      if (GlobalCfg.USER_DATAS.reliefGiftDiamond > 0) {
        GlobalCfg.USER_DATAS.userDiamond -= GlobalCfg.USER_DATAS.reliefGiftDiamond;
      }

      ;
      self.showUserInfo();
      self.showBanner();
      self.showOtherModules();
      self.showSmallGameBtns();
      self.showToastViews();
      self.showTransBounsRedPoint();
      CommonFun.getInstance().hidProgress();
    } else if (msgId == 'lobbyservice.newmail') {
      // 新邮件通知，消息体无内容
      self.showNewEmailRedDot(true);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.READ_EMAIL) {
      // 读取邮件，更新邮件按钮状态
      var bool = notify.state;
      self.showNewEmailRedDot(bool);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
      self.showFirstRechargeTipPopup();
    } else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
      self.showVipLevelIcon();

      if (GlobalCfg.USER_DATAS.recharged > 0 && GlobalCfg.USER_DATAS.userVip.level > 0 && CommonFun.getInstance().isOpenVipModule()) {
        self.btn_vip.node.active = true;
      } else {
        self.btn_vip.node.active = false;
      }

      ;
      var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);

      if (isCanShowVIPFont) {
        self.lab_userName.node.color = new cc.Color(250, 225, 76);
      } else {
        self.lab_userName.node.color = new cc.Color(255, 255, 255);
      }

      ;
    } else if (GlobalCfg.CLIENT_MSG_ID.VIP_REWARD === msgId) {
      self.showUserInfo();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED) {
      var isShow = notify.isShow;
      self.dealToggleModules(isShow);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.BINDPHONE_SUCCESS) {
      self.lab_userBonus.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.bonus / 100);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_BOUND_UNDRAW) {
      self.showTransBounsRedPoint();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
      self.dealChangeLanguageEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ACTIVITY_GOBETTING_GET) {
      self.showActivityGoBetting();
      self.showUserInfo();
    }
  },
  showNewEmailRedDot: function showNewEmailRedDot(bool) {
    var redDot = this.btn_mail.node.getChildByName('redDot');
    redDot.active = bool;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_setting") {
      CommonFun.getInstance().showSetting();
    } else if (btnName == "btn_add" || btnName == 'btn_quickRecharge' || btnName == "btn_addCash") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ADD_BUTTON);
      this.dealBtnRechargeEvent();
    } else if (btnName == "btn_withDarw") {
      this.dealBtnWithDrawEvent();
    } else if (btnName == "btn_tx") {
      this.dealBtnTxEvent();
    } else if (btnName == 'btn_getNow') {
      this.dealBtnActivityEvent(btnName);
    } else if (btnName == "btn_bonusTransfer") {
      this.dealBtnBonusTransferEvent();
    } else if (btnName == 'btn_service') {
      this.dealBtnServiceEvent();
    } else if (btnName == 'btn_mail') {
      this.dealBtnMailEvent();
    } else if (btnName == 'btn_referEarn') {
      this.showPromoterToast();
    } else if (btnName == 'btn_pdd') {
      this.dealPddBtnEvent();
    } else if (btnName == "btn_vip") {
      CommonFun.getInstance().showMyVip();
    } else if (btnName == this.btn_goBetiing.node.name) {
      CommonFun.getInstance().showGoBetting();
    }
  },
  dealBtnRechargeEvent: function dealBtnRechargeEvent() {
    if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
      CommonFun.getInstance().showMsgBox("Not yet open", "YES_ON", function () {}, false);
      return;
    }

    ; // 首充 且 首充活动模块开关开启
    // if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.openModules.includes(10)) {
    //     // CommonFun.getInstance().showActivity("Bonus");
    //     this.showFirstRechargeToast();
    // } 
    // else {

    CommonFun.getInstance().showNewShop(true); // };
  },
  dealBtnWithDrawEvent: function dealBtnWithDrawEvent() {
    CommonFun.getInstance().showWithDrawPreData();
  },
  dealBtnTxEvent: function dealBtnTxEvent() {
    CommonFun.getInstance().showPersonal();
  },
  dealBtnActivityEvent: function dealBtnActivityEvent(btnName) {
    if (btnName == 'btn_getNow') {
      GlobalCfg.clickBtnGetNow = true;
    }

    ;
    CommonFun.getInstance().showActivity();
  },
  dealBtnBonusTransferEvent: function dealBtnBonusTransferEvent() {
    CommonFun.getInstance().showBonusTransfer();
  },
  dealBtnServiceEvent: function dealBtnServiceEvent() {
    CommonFun.getInstance().showCustomerService();
  },
  dealBtnMailEvent: function dealBtnMailEvent() {
    CommonFun.getInstance().showEmail();
  },
  showPromoter: function showPromoter() {
    CommonFun.getInstance().showPromoter();
  },
  dealPddBtnEvent: function dealPddBtnEvent() {
    Promise.all([APIManager.getInstance().get_pdd_api_data(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.ACTIVITY_PDD_FIRST)]).then(function (_ref) {
      var pdd_api_data = _ref[0],
          prefab = _ref[1];
      var pddFirstNode = cc.instantiate(prefab);
      var firstCtrl = pddFirstNode.getComponent("firstCtrl");
      firstCtrl.setData(pdd_api_data);
      CommonFun.getInstance().addToPointParent(pddFirstNode, GlobalCfg.PREFAB_PARENT.ACTIVITY_PDD);
    });
  },
  dealToggleModules: function dealToggleModules(isShow) {
    var _this2 = this;

    var isChecked = isShow;
    var w = cc.view.getVisibleSize().width;

    if (isChecked) {
      cc.tween(this.node_middles).to(0.2, {
        position: cc.v2(0, -20)
      }, {
        easing: 'smooth'
      }).call(function () {
        _this2.node_gameScollview.setContentSize(w - 510 - 30, 480);

        _this2.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30, 480);
      }).start();
    } else {
      cc.tween(this.node_middles).to(0.2, {
        position: cc.v2(-132, -20)
      }, {
        easing: 'smooth'
      }).call(function () {
        _this2.node_gameScollview.setContentSize(w - 510 - 30 + 132, 480);

        _this2.node_gameScollview.getChildByName("view").setContentSize(w - 510 - 30 + 132, 480);
      }).start();
    }

    ;
  },
  dealChallengesAct: function dealChallengesAct(notify) {
    var _this3 = this;

    var actName = notify.actName;

    if (actName == "recharge") {
      /**
       * 前往充值
       */
      CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.ChallengeTasks);
    } else if (actName == SceneManager.getInstance().sceneType.TEENPATTI) {
      this.checkUpdate("tpGame", function () {
        window.isNeedShowRoomList = "tpGame";

        _this3.showGameRoomList();
      });
    } else if (actName == SceneManager.getInstance().sceneType.RUMMY) {
      this.checkUpdate("Rummy", function () {
        window.isNeedShowRoomList = "rummy";

        _this3.showGameRoomList();
      });
    } else if (actName == SceneManager.getInstance().sceneType.LHD) {
      this.checkUpdate("lhdGame", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LHD);
      });
    } else if (actName == SceneManager.getInstance().sceneType.SEVENUPDOWN) {
      this.checkUpdate("7up7downGame", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SEVENUPDOWN);
      });
    } else if (actName == SceneManager.getInstance().sceneType.HORSERACE) {
      this.checkUpdate("horseRaceGame", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.HORSERACE);
      });
    } else if (actName == SceneManager.getInstance().sceneType.MUNDA) {
      this.checkUpdate("munda", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MUNDA);
      });
    } else if (actName == SceneManager.getInstance().sceneType.BACCARAT) {
      this.checkUpdate("baccarat3PattiGame", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BACCARAT);
      });
    } else if (actName == SceneManager.getInstance().sceneType.ANDAER) {
      this.checkUpdate("andaerGame", function () {
        window.isNeedShowRoomList = "andar";

        _this3.showGameRoomList();
      });
    } else if (actName == SceneManager.getInstance().sceneType.BENZ) {
      this.checkUpdate("Benz", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BENZ);
      });
    }

    ;
  },
  loadHeadSp: function loadHeadSp() {
    var _this4 = this;

    if (GlobalCfg.USER_DATAS.userHeadimgurl.length === 0) {
      return;
    }

    ;
    cc.loader.load({
      url: GlobalCfg.USER_DATAS.userHeadimgurl,
      type: 'png'
    }, function (err, img) {
      if (!err && cc.isValid(_this4) && cc.isValid(_this4.sprite_tx)) {
        var spriteFrame = new cc.SpriteFrame(img);
        _this4.sprite_tx.spriteFrame = spriteFrame;

        _this4.sprite_tx.node.setContentSize(100, 100);
      }

      ;
    });
  },
  btnClickGame: function btnClickGame(button) {
    var _this5 = this;

    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_zjh") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_BUTTON);

      if (CommonFun.getInstance().isNeedShowTPFingerTip() && CommonFun.getInstance().isEnteredTPGame() == false && GlobalCfg.USER_DATAS.recharged == 0) {
        this.tryEnterMinScoreTP();
      } else {
        this.checkUpdate("tpGame", function () {
          window.isNeedShowRoomList = "tpGame";
          GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product;

          _this5.showGameRoomList();
        });
      }

      ;
    } else if (btnName == "btn_zjh2") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_BUTTON);
      this.checkUpdate("tpGame", function () {
        window.isNeedShowRoomList = "tpGame";
        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.endpoint = _this5.teenPatti2Endpoint;
        console.log("teenPatti2Endpoint:", _this5.teenPatti2Endpoint);
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.product;

        _this5.showGameRoomList();
      });
    } else if (btnName == "btn_andeer") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ANDAR_BUTTON);
      this.checkUpdate("andaerGame", function () {
        window.isNeedShowRoomList = "andar";
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.andeerData.product;

        _this5.showGameRoomList();
      });
    } else if (btnName == "btn_rummy") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_RUMMY_BUTTON);
      this.checkUpdate("Rummy", function () {
        window.isNeedShowRoomList = "rummy";
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.rummyData.product;

        _this5.showGameRoomList();
      });
    } else if (btnName == "btn_upDown") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_UPDOWN_GAME);
      this.checkUpdate("7up7downGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.upDownData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SEVENUPDOWN);
      });
    } else if (btnName == "btn_lhd") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_LHD_GAME);
      this.checkUpdate("lhdGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.lhdData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LHD);
      });
    } else if (btnName == "btn_munda") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MUNDA_GAME);
      this.checkUpdate("munda", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.mundaData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MUNDA);
      });
    } else if (btnName == "btn_horseRace") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_HORSE_GAME);
      this.checkUpdate("horseRaceGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.horseRaceData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.HORSERACE);
      });
    } else if (btnName == "btn_fruitMachine") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_FRUIT_GAME);
      this.checkUpdate("fruitMachine", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.fruitMachineData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SGJ);
      });
    } else if (btnName == "btn_mayaMachine") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_MAYA_GAME);
      this.checkUpdate("mayaMachine", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.mayaMachineData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.MAYA);
      });
    } else if (btnName == "btn_Benz") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_BENZ_GAME);
      this.checkUpdate("Benz", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.benZData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BENZ);
      });
    } else if (btnName == "btn_baccarat3Patti") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_3PATTI_GAME);
      this.checkUpdate("baccarat3PattiGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.baccaratData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.BACCARAT);
      });
    } else if (btnName == "btn_ssc") {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_SSC_GAME);
      this.checkUpdate("sscGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.sscData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.SSC);
      });
    } else if (btnName == 'btn_rocket') {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_CRASH_GAME);
      this.checkUpdate("rocket", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.rocketData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ROCKET);
      });
    } else if (btnName == 'btn_zoo') {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ZOO_GAME);
      this.checkUpdate("zooGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.zooData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ZOO);
      });
    } else if (btnName == 'btn_cricket') {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_CRICKET_GAME);
      this.checkUpdate("cricketGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.cricketData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.CRICKET);
      });
    } else if (btnName == 'btn_zeus') {
      CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ZEUS_GAME);
      this.checkUpdate("zeusGame", function () {
        CommonFun.getInstance().showProgress();
        GlobalCfg.CUR_GAME_TYPE = GlobalCfg.SMALL_GAME_DATAS.zeusData.product;
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ZEUS);
      });
    }
  },
  tryEnterMinScoreTP: function tryEnterMinScoreTP() {
    //@ts-ignore
    if (CommonFun.getInstance().isNeedUpdata("tpGame") == false) {
      //@ts-ignore
      if (GlobalCfg.USER_DATAS.openModules.includes(100)) {
        //@ts-ignore
        var teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
        teenPattiRoomInfo = teenPattiRoomInfo.sort(function (a, b) {
          return a.entrycondition - b.entrycondition;
        });
        teenPattiRoomInfo = teenPattiRoomInfo.filter(function (item) {
          return item.trial == false && item.isblind == false;
        });
        var itemData = null;

        for (var i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
          //@ts-ignore
          if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
            itemData = teenPattiRoomInfo[i];
            break;
          }

          ;
        }

        ;

        if (!itemData) {
          //@ts-ignore
          window.isNeedShowRoomList = "tpGame"; //@ts-ignore

          CommonFun.getInstance().showSelectRoom();
          return;
        }

        ; //@ts-ignore

        CommonFun.getInstance().showProgress(); //@ts-ignore

        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id; //@ts-ignore

        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
      } else {
        //@ts-ignore
        CommonFun.getInstance().showTips("TeenPatti is not open yet!");
      }

      ;
    } else {
      //@ts-ignore
      GameDownloader.getInstance().priorLoadGame("tpGame");
    }

    ;
  },
  showGameRoomList: function showGameRoomList() {
    CommonFun.getInstance().showSelectRoom();
  },
  checkUpdate: function checkUpdate(subpackgeName, callFun) {
    if (cc.sys.os != cc.sys.OS_ANDROID || !GlobalCfg.IS_SMALL_GAME_UPDATE || cc.sys.isBrowser) {
      callFun();
      return;
    }

    ;

    if (CommonFun.getInstance().isNeedUpdata(subpackgeName)) {
      CommonFun.getInstance().showTips("Download the game now!");
      GameDownloader.getInstance().priorLoadGame(subpackgeName);
    } else {
      callFun();
    }

    ;
  },
  setSmallGameLoadProgress: function setSmallGameLoadProgress(notify) {
    if (!notify) {
      return;
    }

    ;
    var progress = notify.progress;
    var subpackgeName = notify.subpackgeName;
    var upDateMaskNode = null;

    switch (subpackgeName) {
      case "7up7downGame":
        upDateMaskNode = this.btn_miniseven.node.getChildByName("upDateMask");
        break;

      case "andaerGame":
        upDateMaskNode = this.btn_miniandar.node.getChildByName("upDateMask");
        break;

      case "tpGame":
        upDateMaskNode = this.btn_miniteenpatti.node.getChildByName("upDateMask");
        break;

      case "Rummy":
        upDateMaskNode = this.btn_minirummy.node.getChildByName("upDateMask");
        break;

      case "lhdGame":
        upDateMaskNode = this.btn_minilonghu.node.getChildByName("upDateMask");
        break;

      case "munda":
        upDateMaskNode = this.btn_minijhandimunda.node.getChildByName("upDateMask");
        break;

      case "horseRaceGame":
        upDateMaskNode = this.btn_minisaima.node.getChildByName("upDateMask");
        break;

      case "sscGame":
        upDateMaskNode = this.btn_miniluckyloto.node.getChildByName("upDateMask");
        break;

      case "fruitMachine":
        upDateMaskNode = this.btn_minishuiguo.node.getChildByName("upDateMask");
        break;

      case "mayaMachine":
        upDateMaskNode = this.btn_minimaya.node.getChildByName("upDateMask");
        break;

      case "baccarat3PattiGame":
        upDateMaskNode = this.btn_miniteenpattibaccarat.node.getChildByName("upDateMask");
        break;

      case "Benz":
        upDateMaskNode = this.btn_minibenzbmw.node.getChildByName("upDateMask");
        break;

      case "rocket":
        upDateMaskNode = this.btn_minirocket.node.getChildByName("upDateMask");
        break;

      case "zooGame":
        upDateMaskNode = this.btn_minizoo.node.getChildByName("upDateMask");
        break;

      case "cricketGame":
        upDateMaskNode = this.btn_minicricket.node.getChildByName("upDateMask");
        break;

      case "zeusGame":
        upDateMaskNode = this.btn_minizeus.node.getChildByName("upDateMask");
        break;

      default:
        break;
    }

    ;

    if (upDateMaskNode) {
      upDateMaskNode.active = true;
      var updateProgressBar = upDateMaskNode.getChildByName("progressBar").getComponent(cc.ProgressBar);
      updateProgressBar.node.active = true;
      updateProgressBar.progress = progress / 100;
      var updateLab = upDateMaskNode.getChildByName("lab_xz").getComponent(cc.Label);
      updateLab.string = progress + "%";
    }

    ;
  },
  setSmallGameLoadComplete: function setSmallGameLoadComplete(notify) {
    if (!notify) {
      return;
    }

    ;
    var subpackgeName = notify.subpackgeName;

    switch (subpackgeName) {
      case "7up7downGame":
        this.btn_miniseven.node.getChildByName("upDateMask").active = false;
        break;

      case "andaerGame":
        this.btn_miniandar.node.getChildByName("upDateMask").active = false;
        break;

      case "tpGame":
        this.btn_miniteenpatti.node.getChildByName("upDateMask").active = false;
        break;

      case "Rummy":
        this.btn_minirummy.node.getChildByName("upDateMask").active = false;
        break;

      case "lhdGame":
        this.btn_minilonghu.node.getChildByName("upDateMask").active = false;
        break;

      case "munda":
        this.btn_minijhandimunda.node.getChildByName("upDateMask").active = false;
        break;

      case "horseRaceGame":
        this.btn_minisaima.node.getChildByName("upDateMask").active = false;
        break;

      case "sscGame":
        this.btn_miniluckyloto.node.getChildByName("upDateMask").active = false;
        break;

      case "fruitMachine":
        this.btn_minishuiguo.node.getChildByName("upDateMask").active = false;
        break;

      case "mayaMachine":
        this.btn_minimaya.node.getChildByName("upDateMask").active = false;
        break;

      case "baccarat3PattiGame":
        this.btn_miniteenpattibaccarat.node.getChildByName("upDateMask").active = false;
        break;

      case "Benz":
        this.btn_minibenzbmw.node.getChildByName("upDateMask").active = false;
        break;

      case "rocket":
        this.btn_minirocket.node.getChildByName("upDateMask").active = false;
        break;

      case "zooGame":
        this.btn_minizoo.node.getChildByName("upDateMask").active = false;
        break;

      case "cricketGame":
        this.btn_minicricket.node.getChildByName("upDateMask").active = false;
        break;

      case "zeusGame":
        this.btn_minizeus.node.getChildByName("upDateMask").active = false;
        break;

      default:
        break;
    }

    ;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().removeCarouselStrip();
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  },
  // 提现弹窗
  showWithDrawToast: function showWithDrawToast() {
    CommonFun.getInstance().showPopUpWithDraw();
  },
  showFirstRechargeToast: function showFirstRechargeToast() {
    CommonFun.getInstance().showFirstRecharge();
  },
  showSecondRechargeToast: function showSecondRechargeToast() {
    CommonFun.getInstance().showSuperDiscount('Lobby');
  },
  showPromoterToast: function showPromoterToast() {
    CommonFun.getInstance().showPromoter();
  },
  showBonusCardToast: function showBonusCardToast() {
    CommonFun.getInstance().showDailyBonusCard();
  },
  showReliefToast: function showReliefToast() {
    CommonFun.getInstance().showRelief();
  },
  showFirstGiftToast: function showFirstGiftToast() {
    CommonFun.getInstance().showFirstGiftDiamond();
  },
  showPddToast: function showPddToast() {},
  dealChangeLanguageEvent: function dealChangeLanguageEvent(notify) {
    var languagesType = notify.languagesType;
    this.setSmallGameBtnByLanguageType(languagesType);
    this.setAddCashBtnByLanguageType(languagesType);
  },
  setSmallGameBtnByLanguageType: function setSmallGameBtnByLanguageType(languagesType) {
    var skinName = '';

    switch (languagesType) {
      case I18NLanguagesEnum.English:
        skinName = 'yuyan1';
        break;

      case I18NLanguagesEnum.Hindi:
        skinName = 'yuyan2';
        break;

      case I18NLanguagesEnum.Urdu:
        skinName = 'yuyan3';
        break;

      case I18NLanguagesEnum.Bengali:
        skinName = 'yuyan4';
        break;

      default:
        skinName = 'yuyan1';
        break;
    }

    ;
    var skeleton = null;

    if (this.btn_miniandar.node.active) {
      skeleton = this.btn_miniandar.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minibenzbmw.node.active) {
      skeleton = this.btn_minibenzbmw.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minijhandimunda.node.active) {
      skeleton = this.btn_minijhandimunda.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minilonghu.node.active) {
      skeleton = this.btn_minilonghu.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minirummy.node.active) {
      skeleton = this.btn_minirummy.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      var temp1 = "";

      if (skinName == 'yuyan2') {
        temp1 = 'yuyan4';
      } else if (skinName == 'yuyan4') {
        temp1 = 'yuyan2';
      } else {
        temp1 = skinName;
      }

      ;
      skeleton.setSkin(temp1);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minisaima.node.active) {
      skeleton = this.btn_minisaima.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_miniseven.node.active) {
      skeleton = this.btn_miniseven.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minishuiguo.node.active) {
      skeleton = this.btn_minishuiguo.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minimaya.node.active) {
      skeleton = this.btn_minimaya.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_miniteenpatti.node.active) {
      skeleton = this.btn_miniteenpatti.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      var _temp = "";

      if (skinName == 'yuyan2') {
        _temp = 'yuyan4';
      } else if (skinName == 'yuyan4') {
        _temp = 'yuyan2';
      } else {
        _temp = skinName;
      }

      ;
      skeleton.setSkin(_temp);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_miniteenpatti2.node.active) {
      skeleton = this.btn_miniteenpatti2.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      var _temp2 = "";

      if (skinName == 'yuyan2') {
        _temp2 = 'yuyan4';
      } else if (skinName == 'yuyan4') {
        _temp2 = 'yuyan2';
      } else {
        _temp2 = skinName;
      }

      ;
      skeleton.setSkin(_temp2);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_miniteenpattibaccarat.node.active) {
      skeleton = this.btn_miniteenpattibaccarat.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minirocket.node.active) {
      skeleton = this.btn_minirocket.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minicricket.node.active) {
      skeleton = this.btn_minicricket.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minizeus.node.active) {
      skeleton = this.btn_minizeus.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;

    if (this.btn_minizoo.node.active) {
      skeleton = this.btn_minizoo.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;
  },
  setAddCashBtnByLanguageType: function setAddCashBtnByLanguageType(languagesType) {
    var skinName = '';

    switch (languagesType) {
      case I18NLanguagesEnum.English:
        skinName = 'yuyan1';
        break;

      case I18NLanguagesEnum.Hindi:
        skinName = 'yuyan2';
        break;

      case I18NLanguagesEnum.Urdu:
        skinName = 'yuyan3';
        break;

      case I18NLanguagesEnum.Bengali:
        skinName = 'yuyan4';
        break;

      default:
        skinName = 'yuyan1';
        break;
    }

    ;
    var skeleton = null;

    if (this.btn_addCash.node.active) {
      skeleton = this.btn_addCash.node.getChildByName('Background').getComponent(sp.Skeleton);
      skeleton.clearTrack(0);
      skeleton.setSkin(skinName);
      skeleton.setAnimation(0, 'animation', true);
    }

    ;
  },

  /**
   * 显示首次充值清除金币提示
   */
  showFirstRechargeTipPopup: function showFirstRechargeTipPopup() {
    var defaultType = CommonFun.getInstance().getAppConfigValueByKey('POPUP_RechargeTip_Type', 1);

    switch (defaultType) {
      case 1:
        CommonFun.getInstance().showAdvancedMode(false);
        break;

      case 2:
        CommonFun.getInstance().showNewRechargeTip();
        break;

      default:
        break;
    }
  }
});

cc._RF.pop();