/*
 * @Author: 李康
 * @Date: 2021-11-29 20:23:42
 * @LastEditTime: 2023-11-02 17:50:15
 * @LastEditors: 李康
 */
cc.Class({
    extends: cc.Component,

    properties: {
        prefab_card: cc.Prefab,
        prefab_chip: cc.Prefab,
        prefab_wfTips: cc.Prefab,
        prefab_battleCard: cc.Prefab,
        prefab_biaoQing: cc.Prefab,
        prefab_recharge: cc.Prefab,
        prefab_hint: cc.Prefab,
        spritAtlas_card: cc.SpriteAtlas,
        nodeWaitTips: cc.Node,
    },

    ctor: function () {
        this.viewList = {};
        this.playersCtrlArr = [];
        this.joinedPlayerSeatObj = [];

        //玩家在游戏中的状态描述列表
        this.playerStatusDescArr = [
            "", "PACKED", "LOST", "WATCH"
        ];

        // 退出提示
        this.outGameTips = [
            "Your game is not finished yet. If you wish to exit the table, you will lose your money. Do you want to leave table?",
            "आपका खेल अभी खत्म नहीं हुआ है, टेबल में पैसा होगा| वापस न किया जाए। क्या आपका जाना निश्चित है?",
            "آپ کا گیم ابھی تک ختم نہیں ہوا ہے۔ اگر آپ ٹیبل سے باہر نکلنا چاہتے ہیں، تو آپ کی رقم ڈوب جائے گی۔ کیا آپ ٹیبل چھوڑنا چاہتے ہیں؟",
            "আপনার খেলা এখনও শেষ হয়নি। আপনি টেবিলে পয়সা থাকবে, যা ফেরত দেওয়া হবে না। আপনি কি প্রস্থান করতে নিশ্চিত?",
        ]

        //玩家在游戏中的状态描述列表
        this.playerCardPosArr = [
            [cc.v2(-47, 0), cc.v2(0, 0), cc.v2(47, 0)],
            [cc.v2(-29, 0), cc.v2(0, 0), cc.v2(29, 0)],
            [cc.v2(-29, 0), cc.v2(0, 0), cc.v2(29, 0)],
            [cc.v2(-29, 0), cc.v2(0, 0), cc.v2(29, 0)],
            [cc.v2(-29, 0), cc.v2(0, 0), cc.v2(29, 0)]
        ];

        this.playerCardScaleArr = [
            0.82, 0.58, 0.58, 0.58, 0.58
        ];

        this.playerResultScorePosArr = [
            cc.v2(184, 130), cc.v2(-145, 100), cc.v2(-145, 100), cc.v2(145, 100), cc.v2(145, 100)
        ];

        this.isAddChipAmount = false;

        this.curOptingPlayerSeat = null;

        this.isCCGameEventHideStutas = false;

        this.totalPay = 0;
        this.myPlayerCanChipAmount = 0;
        this.RoomConfig = {};       // 房间配置信息
        
        this.showWaitNode = false;      // 展示等待其他玩家进入文字
        this.waitTipsTime = 0;
        this.waitTipsIndex = 0;

        this.curTableConfig = {
            cellScore: 0,
        };

        this.isHavaMySeat = false;

        this.isCanExitDirectly = true;

        this.myPlayerBaseInfo = {};

        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
    },

    ///////////////////////////////////////////////////////// 脚本生命周期函数处理 Start //////////////////////////////////////////
    onLoad: function () {
        CommonFun.getInstance().hideSelectRoom();

        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_TP_GAME);

        GlobalCfg.G_COMPONENTS.Audio.stopMusic();

        CommonFun.getInstance().hidProgress();

        GlobalCfg.ACT_SCENE_CTRL = this;

        this.pushpaysuccess = ClientNotify.register("PUSHPAYSUCCESS", this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        this.createChipsPool();
        this.createCardsPool();

        this.node.on('touchstart', this.touchNodeCall, this);

        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");
        //发牌官节点
        this.node_faPaiRole = this.viewList["girl"];

        //玩家比牌表现的节点
        this.node_player_pk = this.viewList["yindu_pk"];
        this.skele_player_pk = this.node_player_pk.getComponent(sp.Skeleton);
        this.skele_player_pk.clearTracks();
        this.skele_player_pk.setCompleteListener((trackEntry, loopCount) => {
            this.clearPlayerBattleDisplay();
            this.showBattleWinAndFailPlayerDisplay();
        });
        this.node_player_pk.active = false;

        //牌局信息
        this.node_info_bg = this.viewList["info_bg"];
        this.lab_bootAmount = this.viewList["info_bg/lab_bootAmount"].getComponent(cc.Label);
        this.lab_chaalLimit = this.viewList["info_bg/lab_chaalLimit"].getComponent(cc.Label);
        this.lab_maxBlinds = this.viewList["info_bg/lab_maxBlinds"].getComponent(cc.Label);
        this.lab_potLimit = this.viewList["info_bg/lab_potLimit"].getComponent(cc.Label);

        //总下注数
        this.lab_tableAmount = this.viewList["jc_input/lab_tableAmount"].getComponent(cc.Label);

        //常规按钮
        this.node_btn_chat = this.viewList["btn_chat"];
        this.node_btn_changeTable = this.viewList["btn_changeTable"];
        this.sprite_btn_changeTable = this.viewList["btn_changeTable/cd"].getComponent(cc.Sprite);
        this.node_btn_cz = this.viewList["btn_cz"];
        this.node_btn_wf = this.viewList["btn_wf"];
        this.node_btn_tc = this.viewList["btn_tc"];
        this.node_btn_cz_mf = this.viewList["btn_cz/Background/btn_mfjf"];
        this.node_btn_cz_cz = this.viewList["btn_cz/Background/btn_cz"];
        this.node_btn_chat.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_changeTable.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 2), this);
        this.node_btn_cz.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_wf.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_tc.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_cz.active = false;

        //游戏逻辑操作按钮
        this.node_act_btns = this.viewList["act_btns"];
        this.node_btn_show = this.viewList["act_btns/btn_show"];
        this.node_btn_reduce = this.viewList["act_btns/btn_reduce"];
        this.node_btn_blind = this.viewList["act_btns/btn_blind"];
        this.node_btn_add = this.viewList["act_btns/btn_add"];
        this.node_btn_pack = this.viewList["act_btns/btn_pack"];
        this.btn_show = this.node_btn_show.getComponent(cc.Button);
        this.btn_reduce = this.node_btn_reduce.getComponent(cc.Button);
        this.btn_blind = this.node_btn_blind.getComponent(cc.Button);
        this.btn_add = this.node_btn_add.getComponent(cc.Button);
        this.btn_pack = this.node_btn_pack.getComponent(cc.Button);
        this.lab_chipAmount = this.viewList["act_btns/bg_k/lab_chipAmount"].getComponent(cc.Label);
        this.lab_catchChipType = this.viewList["act_btns/btn_blind/Background/lab"].getComponent(cc.Label);
        this.lab_lab_Pack = this.viewList["act_btns/btn_pack/Background/lab_Pack"].getComponent(cc.Label);
        this.lab_btn_show = this.viewList["act_btns/btn_show/show_lab"].getComponent(cc.Label);
        this.node_btn_show.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_reduce.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.1), this);
        this.node_btn_blind.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.node_btn_add.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.1), this);
        this.node_btn_pack.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.setShowBtnString(teenPattiLanguage.lobby[0][language]);
        let str = this.getShowBtnString();
        this.setShowBtnLabStr(str);

        this.node_btn_openMenu = this.viewList["btn_openMenu"];
        this.node_btn_tableInfo = this.viewList["btn_tableInfo"];
        this.node_btn_openMenu.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
        this.node_btn_tableInfo.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);

        //自己牌型显示
        this.node_myPlayerLookCardSuit = this.viewList["px_bg_big"];
        this.lab_myPlayerLookCard = this.viewList["px_bg_big/lab_myPlayerLookCard"].getComponent(cc.Label);
        this.progressBar_cardStrength = this.viewList["px_bg_big/progressBar"].getComponent(cc.ProgressBar);
        this.node_myPlayerLookCardSuit.active = false;

        //玩家控制脚本
        for (let i = 0; i < 5; i++) {
            this["playerCtrl" + i] = this.viewList["player" + i].getComponent("teenPattiPlayerCtrl");
            let playerCtrl = this["playerCtrl" + i];
            if (playerCtrl) {
                playerCtrl.setTeenPattiPlayerRoomCtrl(this);
                playerCtrl.setTeenPattiPlayerResultScorePos(this.playerResultScorePosArr[i]);
                playerCtrl.setTeenPattiPlayerStatusDescArr(this.playerStatusDescArr, this);
                playerCtrl.setTeenPattiPlayerCardPosArr(this.playerCardPosArr[i]);
                playerCtrl.setTeenPattiPlayerCardScale(this.playerCardScaleArr[i]);
            };
        };

        //表情使用
        this.userArryNode = [
            this.viewList["player0"],
            this.viewList["player1"],
            this.viewList["player2"],
            this.viewList["player3"],
            this.viewList["player4"],
        ];

        //玩法父节点
        this.node_wanFa = this.viewList["wanFaNode"];

        this.node_hintParent = this.viewList["hintParentNode"];
        this.node_rechargeParent = this.viewList["rechargeParentNode"];

        //筹码的父节点
        this.node_chips = this.viewList["chipsParentNode"];

        //比牌界面的父节点
        this.node_battleCard = this.viewList["battleCardNode"];

        //比牌连线动画的jiedian
        this.node_lianXian = this.viewList["lianXianNode"];

        //免费玩家充值提示相关
        this.node_rechagerBtnTips = this.viewList["chongZhiBtnTips"];
        this.node_btn_recharge = this.viewList["chongZhiBtnTips/btn_recharge"];
        this.node_rechagerBtnTips_tipBg = this.viewList["chongZhiBtnTips/tipBg"];
        this.lab_btnRechargeTip = this.node_rechagerBtnTips_tipBg.getChildByName("lab2").getComponent(cc.Label);
        this.node_btn_recharge.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);

        //有免费玩家充值提示
        this.node_userChongZhiTips = this.viewList["chongZhiDaoJiShiTips"];
        this.node_richTextTips = this.viewList["chongZhiDaoJiShiTips/richTextTips"];
        this.node_daoJiShiBar = this.viewList["chongZhiDaoJiShiTips/bar"];
        this.node_labTime = this.viewList["chongZhiDaoJiShiTips/lab_time"];
        this.richText_rechargeTips = this.node_richTextTips.getComponent(cc.RichText);
        this.sprite_rechargeDaoJiShi = this.node_daoJiShiBar.getComponent(cc.Sprite);
        this.lab_rechargeDaoJiShi = this.node_labTime.getComponent(cc.Label);

        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;

        //轮次节点
        this.lab_round = this.viewList["round/lab_round"].getComponent(cc.Label);
        this.lab_round.string = `Round 0/20`;
        
        // 游戏信息
        this.lab_bootAmountTips = this.viewList["info_bg/lab_bootAmountTips"].getComponent(cc.Label);
        this.lab_chaalLimitTips = this.viewList["info_bg/lab_chaalLimitTips"].getComponent(cc.Label);
        this.lab_maxBlindsTips = this.viewList["info_bg/lab_maxBlindsTips"].getComponent(cc.Label);
        this.lab_potLimitTips = this.viewList["info_bg/lab_potLimitTips"].getComponent(cc.Label);

        this.node.getChildByName('node_ganChang').active = false;
        this.node.getChildByName('node_ganChang').getChildByName('btn_inGameName').on('click',()=>{
            this.sendEnterTableReq();
        });
        this.node.getChildByName('node_ganChang').getChildByName('btn_no').on('click',()=>{
            window.isNeedShowRoomList = "teenpatti";
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        });

        this.nodeWaitTips.active = false;

        //监听后台切换事件
        cc.game.on(cc.game.EVENT_HIDE, () => {
            LoggerUtil.getInstance().log("退入游戏后台！！！！！");
            this.isCCGameEventHideStutas = true;
            this.unscheduleAllCallbacks();
            this.clearPlayerBattleDisplay();
            this.clearBattleCardFangDianAnim();
            this.hideMyPlayerBattleCardView();

            this.setReduceBtnInteractable(false);
            this.setBlindBtnInteractable(false);
            this.setAddBtnInteractable(false);
            this.setShowBtnInteractable(false);
            this.setPackBtnInteractable(false);

            // 清理玩家信息
            let playersCtrlArr = this.getPlayersCtrlArr();
            for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
                const playerCtr = playersCtrlArr[i];
                if (playerCtr) {
                    playerCtr.setTeenPattiPlayerGameOver();
                };
            };

            // 清理桌上筹码
            let chipNodes = this.node_chips.children;
            for (let i = 0, len = chipNodes.length; i < len; i++) {
                let chipNode = chipNodes[i];
                chipNode.destroy();
            };

            this.clearJoinedPlayerSeatObj();

            this.curOptingPlayerSeat = null;
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, () => {
            LoggerUtil.getInstance().log("切回游戏前台！！！！！");
            if (this.isCCGameEventHideStutas == false) {
                return;
            };
            this.isCCGameEventHideStutas = false;
            GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
        }, this);


        this.myPlayerBaseInfo = {
            nickname: GlobalCfg.USER_DATAS.userName,
            sex: GlobalCfg.USER_DATAS.sex,
            diamond: GlobalCfg.USER_DATAS.userDiamond,
            vipLevel: GlobalCfg.USER_DATAS.userVip.level,
            imgUrl: GlobalCfg.USER_DATAS.userHeadimgurl
        };

    },

    resetSceneUI: function () {
        this.unscheduleAllCallbacks();
        this.clearPlayerBattleDisplay();
        this.clearBattleCardFangDianAnim();
        this.hideMyPlayerBattleCardView();

        this.node_myPlayerLookCardSuit.active = false;

        let chipNodes = this.node_chips.children;
        for (let i = 0, len = chipNodes.length; i < len; i++) {
            let chipNode = chipNodes[i];
            if (chipNode) {
                chipNode.destroy();
            };
        };

        let playersCtrlArr = this.getPlayersCtrlArr();
        for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
            const playersCtrl = playersCtrlArr[i];
            if (playersCtrl) {
                playersCtrl.setTeenPattiPlayerLeaveTable();
                if (playersCtrl === this["playerCtrl" + 0]) {
                    playersCtrl.setTeenPattiPlayerJoinedStatus();
                    playersCtrl.setTeenPattiPlayerName(this.myPlayerBaseInfo.nickname);
                    playersCtrl.setTeenPattiPlayerCoin(this.myPlayerBaseInfo.diamond, true);
                    playersCtrl.setTeenPattiPlayerTX(this.myPlayerBaseInfo.imgUrl);
                    playersCtrl.setTeenPattiPlayerVipLevel(this.myPlayerBaseInfo.vipLevel);
                    playersCtrl.setTeenPattiPlayerSex(this.myPlayerBaseInfo.sex);
                    playersCtrl.setTeenPattiPlayerPid(-1);
                }
            };
        };

        this.clearPlayersCtrlArr();
        this.clearJoinedPlayerSeatObj();

        this.curOptingPlayerSeat = null;
    },

    start: function () { 
        // CommonFun.getInstance().updateSidebarData(false);
        CommonFun.getInstance().removeSidebar();
        this.sendLoginReq();

        const playersCtrl = this["playerCtrl" + 0];
        if (playersCtrl) {
            playersCtrl.setTeenPattiPlayerLeaveTable();
            if (playersCtrl === this["playerCtrl" + 0]) {
                playersCtrl.setTeenPattiPlayerJoinedStatus();
                playersCtrl.setTeenPattiPlayerName(this.myPlayerBaseInfo.nickname);
                playersCtrl.setTeenPattiPlayerCoin(this.myPlayerBaseInfo.diamond, true);
                playersCtrl.setTeenPattiPlayerTX(this.myPlayerBaseInfo.imgUrl);
                playersCtrl.setTeenPattiPlayerVipLevel(this.myPlayerBaseInfo.vipLevel);
                playersCtrl.setTeenPattiPlayerSex(this.myPlayerBaseInfo.sex);
                playersCtrl.setTeenPattiPlayerPid(-1);
            }
        };
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        this.clearCardsPool();
        this.clearChipsPool();
        this.clearPlayerChongZhiActTimer();
        GameServerManager.clientCloseServer();
        ClientNotify.removeByHandle("PUSHPAYSUCCESS", this.pushpaysuccess);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_TP_GAME);
    },

    ///////////////////////////////////////////////////////// 脚本生命周期函数处理 End //////////////////////////////////////////





    ///////////////////////////////////////////////////////// 筹码 手牌 对象池 Start //////////////////////////////////
    createChipsPool: function () {
        this.chipsPool = new cc.NodePool();
        for (let i = 0; i < 40; i++) {
            let teenPattiChip = cc.instantiate(this.prefab_chip);
            this.chipsPool.put(teenPattiChip);
        };
    },

    clearChipsPool: function () {
        this.chipsPool.clear();
    },

    putChipsPool: function (teenPattiChip) {
        this.chipsPool.put(teenPattiChip);
    },

    getChipNodeFromChipsPool: function () {
        let teenPattiChip = null;
        if (this.chipsPool.size() > 0) {
            teenPattiChip = this.chipsPool.get();
        }
        else {
            teenPattiChip = cc.instantiate(this.prefab_chip);
        };
        return teenPattiChip;
    },

    createCardsPool: function () {
        this.cardsPool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let cardNode = cc.instantiate(this.prefab_card);
            this.cardsPool.put(cardNode);
        };
    },

    clearCardsPool: function () {
        this.cardsPool.clear();
    },

    putCardsPool: function (cardNode) {
        this.cardsPool.put(cardNode);
    },

    getCardNodeFromCardsPool: function () {
        let cardNode = null;
        if (this.cardsPool.size() > 0) {
            cardNode = this.cardsPool.get();
        }
        else {
            cardNode = cc.instantiate(this.prefab_card);
        };
        return cardNode;
    },
    ///////////////////////////////////////////////////////// 筹码 手牌 对象池 End //////////////////////////////////





    ///////////////////////////////////////////////////////// 按钮，网络，自定义事件监听回调 Start //////////////////////////////////
    touchNodeCall: function () {
        
    },

    btnClickCall: function (btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_chat") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showBiaoQingView();
        }
        else if (btnName == "btn_cz") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.isTrialRoom) {
                CommonFun.getInstance().showSmallAddExperience();
            }
            else {
                CommonFun.getInstance().showSmallAddCash("teenPatti",  this.curTableConfig ? this.curTableConfig.cellScore : 0);
            };
        }
        else if (btnName == "btn_show") {
            this.playTeenPattiEffect("sideshow");
            this.sendLaunchCompareReq();
        }
        else if (btnName == "btn_blind") {
            this.sendBlindReq();
        }
        else if (btnName == "btn_add") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealBtnBlindOpt("add");
        }
        else if (btnName == "btn_reduce") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealBtnBlindOpt("reduce");
        }
        else if (btnName == "btn_pack") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.isCompleteFaPai == false) {
                return;
            };
            if (this.node_rechagerBtnTips.active == true) {
                let children = this.node_rechargeParent.children;
                for (let i = 0, len = children.length; i < len; i++) {
                    let node = children[i];
                    node.destroy();
                };
                let hintViewNode = cc.instantiate(this.prefab_hint);
                let ctrl = hintViewNode.getComponent("teenPattiHintCtrl");
                ctrl.setTeenPattiWinRate(this.teenPattiRechargeWinRate);
                this.node_rechargeParent.addChild(hintViewNode);
            }
            else {
                this.sendDropCardReq();
            };
        }
        else if (btnName == "btn_recharge") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealBtnRecharge();
        }
        else if (btnName == "btn_private") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().addVerticalAcc();
            CommonFun.getInstance().showPrivacyPolicy(2);
        }
        else if (btnName == "btn_service") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().addVerticalAcc();
            CommonFun.getInstance().showPrivacyPolicy(1);
        }
        else if (btnName == "btn_changeTable") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let self = this;
            self.node_btn_changeTable.getComponent(cc.Button).interactable = false;
            self.sendChangeTableReq();
            let fillRange = 0;
            self.sprite_btn_changeTable.schedule(() => {
                fillRange += -0.05;
                self.sprite_btn_changeTable.fillRange = fillRange;
                if (fillRange <= -1) {
                    self.sprite_btn_changeTable.unscheduleAllCallbacks();
                    self.node_btn_changeTable.getComponent(cc.Button).interactable = true;
                    self.sprite_btn_changeTable.fillRange = 0;
                };
            }, 0.05, 19, 0);
        }
        else if (btnName == "btn_openMenu") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showGameMenu();
        }
        else if (btnName == "btn_tableInfo") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealShowWanFaOpt();
        };
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == 'gameservice.login') {
            self.dealLoginEvent(notify);
        }
        else if (msgId == "gameservice.enterlv") {
            self.dealEnterlvEvent(notify);
        }
        else if (msgId == "gameservice.playerjoinnotify") {
            self.dealPlayerJoinNotifyEvent(notify);
        }
        else if (msgId == "gameservice.playerleavenotify") {
            self.dealPlayerLeaveNotifyEvent(notify);
        }
        else if (msgId == "gameservice.playerofflinenotify") {
            self.dealPlayerOffLineNotifyEvent(notify);
        }
        else if (msgId == "gameservice.gamescene") {
            self.dealGameSceneEvent(notify);
        }
        else if (msgId == "gameservice.gamestartnotify") {
            self.dealGameStartNotifyEvent(notify);
        }
        else if (msgId == 'gameservice.destroyandmatchingnotify') {
            self.dealDestroyAndMatchingNotifyEvent(notify);
        }
        else if (msgId == "gameservice.look") {
            self.dealLookEvent();
        }
        else if (msgId == "gameservice.playerlooknotify") {
            self.dealPlayerLookNotifyEvent(notify);
        }
        else if (msgId == "gameservice.askchipnotify") {
            self.dealAskChipNotifyEvent(notify);
        }
        else if (msgId == "gameservice.chip") {
            self.dealChipEvent();
        }
        else if (msgId == "gameservice.playerchipnotify") {
            self.dealPlayerChipNotifyEvent(notify);
        }
        else if (msgId == "gameservice.drop") {
            self.dealDropCardEvent();
        }
        else if (msgId == "gameservice.playerdropnotify") {
            self.dealDropCardNotifyEvent(notify);
        }
        else if (msgId == "gameservice.launchcompare") {
            self.dealLaunchCompareEvent();
        }
        else if (msgId == "gameservice.playerluanchcomparenotify") {
            self.dealLaunchCompareNotifyEvent(notify);
        }
        else if (msgId == "gameservice.answercompare") {
            self.dealAnswerCompareEvent(notify);
        }
        else if (msgId == "gameservice.playeranswercomparenotify") {
            self.dealAnswerCompareNotifyEvent(notify);
        }
        else if (msgId == "gameservice.exitgame") {
            self.dealExitGameEvent();
        }
        else if (msgId == "gameservice.changeroom") {
            self.dealChangeTableEvent(notify);
        }
        else if (msgId == "gameservice.updatecoinnotify") {
            self.dealUpdateCoinNotifyEvent(notify);
        }
        else if (msgId == "gameservice.gameovernotify") {
            self.dealGameOverNotifyEvent(notify);
        }
        else if (msgId == "gameservice.shortmessagenotify") {
            self.dealShortMessage(notify);
        }
        else if (msgId == "teenPattiPlayerActTime") {
            self.dealPlayerActTime(notify);
        }
        else if (msgId == "gameservice.preparepayment") {
            self.dealPreparepayment();
        }
        else if (msgId == "gameservice.preparepaymentnotify") {
            self.dealPreparepaymentnotify(notify);
        }
        else if (msgId == "gameservice.paymentfinishnotify") {
            self.dealPaymentfinishnotify(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN) {
            if (notify <= 4 ) {
                for (let i = 0; i < self.userArryNode.length; i++) {
                    let gameCtrl = self.userArryNode[i].getComponent("teenPattiPlayerCtrl")
                    if (gameCtrl.node_wanJia && !gameCtrl.node_wanJia.active) {continue}
                    gameCtrl.setLabelStatus();  
                }
                let show = ["","Show","साइड शो","دکھائیں","প্রদর্শন করুন"][language];
                let SideShow = ["","Side Show","साइड शो","سلائیڈ شو","সাইড শো"][language];
                self.lab_catchChipType.string =  ["","Blind","अंधा","بلائنڈ","ব্লাইন্ড"][language];
                self.lab_lab_Pack.string = ["","Pack","पैक","پیک","প্যাক"][language];
                self.lab_bootAmountTips.string = xuanChangLanguage.lab_bootAmountTips[language];
                self.lab_chaalLimitTips.string = xuanChangLanguage.lab_chaalLimitTips[language];
                self.lab_maxBlindsTips.string = xuanChangLanguage.lab_maxBlindsTips[language];
                self.lab_potLimitTips.string = xuanChangLanguage.lab_potLimitTips[language];
                
              
                if (self.lab_btn_show.string == show) {
                    self.lab_btn_show.string = show
                } else {
                    self.lab_btn_show.string =  SideShow
                }
            }
        }
        else if (msgId == "gameservice.receivefreetrial") {
            if (notify.result && notify.result.result == 216) {
                CommonFun.getInstance().showTips("Daily bonus Limit Exceeded. Please retry tomorrow");
            }
        }
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isCanExitDirectly == false) {
                CommonFun.getInstance().showMsgBox("If you wish to exit the table, you will lose your money. Do you want to leave table?", "YES_NO", () => {
                    self.sendExitGameReq();
                }, false);
            }
            else {
                self.sendExitGameReq();
            };
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE) {
            let myPlayerSeat = self.getMyPlayerSeat();
            let playerCtrl = self.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat); 
            if (playerCtrl) {
                let playerStatus = playerCtrl.getTeenPattiPlayerStatusValue();
                let joinedPlayerSeatObj = self.getJoinedPlayerSeatObj();
                if (playerStatus == 0 && joinedPlayerSeatObj.length > 1) {
                    CommonFun.getInstance().showMsgBox(self.outGameTips[0], "YES_NO", () => {
                        self.sendChangeTableReq();
                    }, false);
                }
                else {
                    self.sendChangeTableReq();
                };
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("teenPatti");
        }
    },


    // 监听错误消息
    checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `TP游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.changeroom") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                window.isNeedShowRummyList = "teenPatti";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
        else if (msgId == "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                window.isNeedShowRummyList = "teenPatti";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
        else if (msgId == "gameservice.enterlv") {
            let jump = notify.forceJump;
            GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = jump;
            let labContent = self.node.getChildByName('node_ganChang').getChildByName('lab_content').getComponent(cc.Label);
            labContent.string = `The gold coins you carry do not meet the event requirements, please enter another event!`;
            self.node.getChildByName('node_ganChang').active = true;
        }
        else if (msgId == "gameservice.receivefreetrial") {
            let msg = notify.result.message;
            CommonFun.getInstance().showTips(msg);
        };
    },
    ///////////////////////////////////////////////////////// 按钮，网络，自定义事件监听回调 End //////////////////////////////////





    ///////////////////////////////////////////////////////// 网络事件监听回调处理函数 Start //////////////////////////////////

    dealLoginEvent: function (notify) {
        if (!notify) {
            return;
        };

        let pid = notify.pid;                   //游戏中玩家ID
        this.pid = notify.pid;
        let diamond = notify.diamond;           //钻石数量
        let roomId = notify.roomId;             //房间ID -1表示不在房间中

        this.totalPay = notify.totalPay;        //总充值金额

        this.resetSceneUI();

        if (roomId != -1) {
            GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = roomId;
        };

        this.sendEnterTableReq();
    },

    //进入桌子的请求结果
    dealEnterlvEvent: function (notify) {
        if (!notify) {
            return;
        };

        this.showWaitNode = true;
        this.node.getChildByName('node_ganChang').active = false;
        let playersCtrlArr = this.getPlayersCtrlArr();
        for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
            const playersCtrl = playersCtrlArr[i];
            if (playersCtrl) {
                playersCtrl.setTeenPattiPlayerLeaveTable();
                if (playersCtrl === this["playerCtrl" + 0]) {
                    playersCtrl.setTeenPattiPlayerJoinedStatus();
                    playersCtrl.setTeenPattiPlayerName(this.myPlayerBaseInfo.nickname);
                    playersCtrl.setTeenPattiPlayerCoin(this.myPlayerBaseInfo.diamond, true);
                    playersCtrl.setTeenPattiPlayerTX(this.myPlayerBaseInfo.imgUrl);
                    playersCtrl.setTeenPattiPlayerVipLevel(this.myPlayerBaseInfo.vipLevel);
                    playersCtrl.setTeenPattiPlayerSex(this.myPlayerBaseInfo.sex);
                    playersCtrl.setTeenPattiPlayerPid(-1);
                }
            };
        };

        this.clearPlayersCtrlArr();
        this.clearJoinedPlayerSeatObj();

        let tableConfig = notify.conf;
        this.RoomConfig = tableConfig;

       
        this.setTableConfig(tableConfig);
        this.setTableInfoNodeActive(true);
        this.setActBtnsNodeActive(false);
        this.setPackBtnInteractable(false);
        this.setAddBtnInteractable(false);
        this.setReduceBtnInteractable(false);
        this.setShowBtnInteractable(false);

        let matching = notify.matching;
        let scene = notify.scene;
        if (matching == false) {
            this.dealGameSceneEvent(scene);
        };
    },

    //有玩家加入桌子的广播
    dealPlayerJoinNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };
        this.showWaitNode = false;

        let seat = notify.seat;             // 座位
        let status = notify.status;         // 状态
        let userInfo = notify.userInfo;     // 新加入的玩家信息
        let displayName = userInfo.displayName;
        let nickname = userInfo.nickname;
        let diamond = userInfo.diamond;
        let imgUrl = userInfo.imgUrl;
        let sex = userInfo.sex;
        let vipLevel = userInfo.vipLevel;

        this.playTeenPattiEffect("playerJoin");

        this.pushJoinedPlayerSeatObj(seat);

        // 通过玩家id判断是否是自己玩家加入了桌子
        if (displayName == GlobalCfg.USER_DATAS.userId) {
            this.setMyPlayerSeat(seat);
            this.setPlayersCtrlArr(seat);
            if (this.isTrialRoom == false) {
                GlobalCfg.USER_DATAS.userDiamond = diamond;
            };
        };

        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (playerCtrl) {
            let myPlayerSeat = this.getMyPlayerSeat();
            playerCtrl.setTeenPattiPlayerJoinedStatus();
            playerCtrl.setTeenPattiPlayerIsOffLine(false);
            playerCtrl.setTeenPattiPlayerName(nickname);
            playerCtrl.setTeenPattiPlayerCoin(diamond, myPlayerSeat == seat);
            playerCtrl.setTeenPattiPlayerStatusValue(status);
            playerCtrl.setTeenPattiPlayerStatusDisplay();
            playerCtrl.setTeenPattiPlayerTX(imgUrl);
            playerCtrl.setTeenPattiPlayerVipLevel(vipLevel);
            playerCtrl.setTeenPattiPlayerSex(sex);

            if (myPlayerSeat == seat) {
                this.myPlayerBaseInfo = {
                    nickname: nickname,
                    sex: sex,
                    diamond: diamond,
                    vipLevel: vipLevel,
                    imgUrl: imgUrl,
                };
            };
        };
    },

    //有玩家离开桌子的广播
    dealPlayerLeaveNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let reason = notify.reason;

        this.removeSeatFromJoinedPlayerSeatObj(seat);

        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        let myPlayerSeat = this.getMyPlayerSeat();
        if (playerCtrl) {
            if (myPlayerSeat == seat) {
                GlobalCfg.SMALL_GAME_DATAS.teenPattiData.leaveRoomReason = reason;
                switch (reason) {
                    // 换桌 5 
                    case 5:
                        
                        break;
                    // 强制转场 6
                    case 6:
                        let _forJump = notify.forceJump;
                        LoggerUtil.getInstance().log("强制赶场。。。。。", _forJump);
                        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = _forJump;
                        let labContent = this.node.getChildByName('node_ganChang').getChildByName('lab_content').getComponent(cc.Label);
                        if(GlobalCfg.USER_DATAS.userDiamond < this.RoomConfig.entryCondition){
                            labContent.string = `Your balance is less than ${Math.floor(this.RoomConfig.entryCondition / 100)}, please go to another session`;
                        }else{
                            labContent.string = `Your balance exceeds ${Math.floor(this.RoomConfig.entryConditionMax / 100)}, please go to other sessions`;
                        }
                        this.node.getChildByName('node_ganChang').active = true;

                        this.resetSceneUI();
                        break;
                    default:
                        window.isNeedShowRoomList = "teenpatti";
                        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
                        break;
                }

            }
            else {
                playerCtrl.setTeenPattiPlayerLeaveTable();
            };
        };
    },

    //有玩家离线的广播
    dealPlayerOffLineNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;             // 座位
        let isOffLine = notify.offline;     // 是否离线

        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (playerCtrl) {
            playerCtrl.setTeenPattiPlayerIsOffLine(isOffLine);
        };
    },

    //游戏场景信息的广播
    dealGameSceneEvent: function (notify) {
        if (!notify) {
            return;
        };

       
        this.showWaitNode = false;
        this.node_myPlayerLookCardSuit.active = false;
        this.unscheduleAllCallbacks();
        this.clearPlayerChongZhiActTimer();

        let setFlag = notify.setFlag;                       
        let curPlayers = notify.players;                   // 玩家信息
        let curTableStatus = notify.status;                // 牌桌状态
        let banker = notify.banker;                        // 庄家座位(首次操作的人)
        let curChip = notify.curChip;                      // 基础筹码
        let selfBaseChip = notify.selfBaseChip;            // 当前玩家能下的注
        let curChipPool = notify.chipPool;                 // 下注的总筹码
        let curChipList = notify.chipList;                 // 筹码列表
        let curSeat = notify.curSeat;                      // 当前该谁操作的座位号
        let curActTime = notify.actTime;                   // 当前倒计时
        let round = notify.round;                          // 当前轮数
        let curSourceCompSeat = notify.sourceCompSeat;     // 发起比牌的玩家
        let curTargetCompSeat = notify.targetCompSeat;     // 被比牌的玩家
        let lastGameCalc = notify.lastGameCalc;
        let duringPaymentSeat = notify.duringPaymentSeat;  // 支付中的玩家

        this.curOptingPlayerSeat = curSeat;

        this.selfBaseChip = selfBaseChip;

        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;

        this.lab_round.string = `Round ${round}/20`;

        let myPlayerSeat = this.getMyPlayerSeatByCurPlayers(curPlayers);
        this.setMyPlayerSeat(myPlayerSeat);
        this.setPlayersCtrlArr(myPlayerSeat);
        this.pushJoinedPlayerSeatObj(myPlayerSeat);
        this.setGameSceneChipList(curChipList);
        this.setCurChipAmount(curChip);
        this.setChipPoolAllAmount(curChipPool / 100);

        this.setPlayerRoleInfoByCurPlayers(curPlayers);

        this.setSceneState(notify, myPlayerSeat);
        this.isHavaMySeat = true;
    },

    /**
     * 根据玩家列表获取我的座位
     * @param {*} curPlayers 
     */
    getMyPlayerSeatByCurPlayers: function(curPlayers) {
        for (let i = 0, len = curPlayers.length; i < len; i++) {
            let playerInfo = curPlayers[i];
            let userInfo = playerInfo.user;
            let seat = playerInfo.seat;
            let playerId = userInfo.playerId;
            if (this.pid == playerId) {
                return seat;
            }
        };
    },

    /**
     * 设置玩家的基础信息
     * @param {*} curPlayers 
     */
    setPlayerRoleInfoByCurPlayers: function(curPlayers) {
        for (let i = 0, len = curPlayers.length; i < len; i++) {
            const playerInfo = curPlayers[i];
            let seat = playerInfo.seat;                 // 座位
            let user = playerInfo.user;
            let nickname = user.nickname;
            let diamond = user.diamond;
            let imgUrl = user.imgUrl;
            let sex = user.sex;
            let vipLevel = user.vipLevel;
            let playerId = user.playerId;

            this.pushJoinedPlayerSeatObj(seat);

            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
            if (playerCtrl) {
                let myPlayerSeat = this.getMyPlayerSeat();
                playerCtrl.setTeenPattiPlayerLeaveTable();
                playerCtrl.setTeenPattiPlayerJoinedStatus();
                playerCtrl.setTeenPattiPlayerName(nickname);
                playerCtrl.setTeenPattiPlayerCoin(diamond, myPlayerSeat == seat);
                playerCtrl.setTeenPattiPlayerTX(imgUrl);
                playerCtrl.setTeenPattiPlayerVipLevel(vipLevel);
                playerCtrl.setTeenPattiPlayerSex(sex);
                playerCtrl.setTeenPattiPlayerPid(playerId);

                if (myPlayerSeat == seat) {
                    this.myPlayerBaseInfo = {
                        nickname: nickname,
                        sex: sex,
                        diamond: diamond,
                        vipLevel: vipLevel,
                        imgUrl: imgUrl,
                    };
                };
            };
        };
    },


    setSceneState: function(notify, myPlayerSeat) {
        let curTableStatus = notify.status;   // 牌桌状态[0游戏准备阶段(主要是展示玩家信息), 1游戏中, 2结算阶段]
        if (curTableStatus == 0) {
            this.isCanExitDirectly = true;
        }
        else if (curTableStatus == 1) {
            this.isCanExitDirectly = false;
            this.setSceneInGameState(notify, myPlayerSeat);
        }
        else if (curTableStatus == 2) {
            this.isCanExitDirectly = true;
            this.setSceneGameEndState(notify, myPlayerSeat);
        };  
    },


    setSceneInGameState: function(notify, myPlayerSeat) {
        let curPlayers = notify.players;                   // 玩家信息
        let curTableStatus = notify.status;                // 牌桌状态
        let banker = notify.banker;                        // 庄家座位(首次操作的人)
        let curChip = notify.curChip;                      // 基础筹码
        let selfBaseChip = notify.selfBaseChip;            // 当前玩家能下的注
        let curChipPool = notify.chipPool;                 // 下注的总筹码
        let curChipList = notify.chipList;                 // 筹码列表
        let curSeat = notify.curSeat;                      // 当前该谁操作的座位号
        let curActTime = notify.actTime;                   // 当前倒计时
        let curSourceCompSeat = notify.sourceCompSeat;     // 发起比牌的玩家
        let curTargetCompSeat = notify.targetCompSeat;     // 被比牌的玩家
        let lastGameCalc = notify.lastGameCalc;
        let duringPaymentSeat = notify.duringPaymentSeat;  // 支付中的玩家
        let plotPayment = notify.plotPayment;
        let plotWinRate = notify.plotWinRate;


        for (let i = 0, len = curPlayers.length; i < len; i++) {
            let playerInfo = curPlayers[i];
            let seat = playerInfo.seat;                 // 座位  
            let status = playerInfo.status;             // 玩家的状态
            let hand = playerInfo.hand;                 // 手牌信息
            hand = hand ? hand : {
                cards: [],
                suit: 0,
                score: 0
            };
            let cardValues = hand.cards;                // 牌值
            let cardSuit = hand.suit;                   // 牌型
            let cardScore = hand.score;                 // 牌力（1~100）
            let allChip = playerInfo.allChip;           // 下的注
            let after = playerInfo.after;               // 下注后的货币
            let actionMask = playerInfo.actionMask;     // 当前可以进行的操作
            let look = playerInfo.look;                 // 是否看牌了
    
            let lastAct = playerInfo.lastAct;           // 最近的操作(2跟注, 4加注)

            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
            if (playerCtrl) {
                playerCtrl.clearTeenPattiPlayerCardsNode();
                playerCtrl.setTeenPattiPlayerCoin(after, myPlayerSeat == seat);
                
                playerCtrl.setTeenPattiPlayerStatusValue(status);
                playerCtrl.setTeenPattiPlayerStatusDisplay();

                if (status == 0) {           // 正常状态
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);
                    if (seat == myPlayerSeat) {
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;  
                        };
                        this.myPlayerBaseInfo.diamond = after;
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                    };

                    let opt = 0;
                    let isAdd = lastAct == 4 ? true : false;
                    if (look == false && isAdd == true) {
                        opt = 1;
                    }
                    else if (look == true && isAdd == false) {
                        opt = 2;
                    }
                    else if (look == true && isAdd == true) {
                        opt = 3;
                    };
                    playerCtrl.setTeenPattiPlayerCatchChipDisplay(true, opt);

                }
                else if (status == 1) {      // 弃牌
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);
                   
                    if (seat == myPlayerSeat) {
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;
                        };
                        this.myPlayerBaseInfo.diamond = after;
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    };
                }
                else if (status == 2) {      // 比牌输了
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);

                    if (seat == myPlayerSeat) {
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;
                        };
                        this.myPlayerBaseInfo.diamond = after;
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    };
                }
                else if (status == 3) {      // 旁观状态
    
                }
            };
        };  
        
        
        let myPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat);
        if (myPlayerCtrl) {
            let status = myPlayerCtrl.getTeenPattiPlayerStatusValue();
            if (status == 0 && curSeat == myPlayerSeat) {
                this.setTableInfoNodeActive(false);
                this.setActBtnsNodeActive(true);
            }
            else {
                this.setTableInfoNodeActive(true);
                this.setActBtnsNodeActive(false);
            };
        };

        // 设置当前操作的玩家可以操作的动作
        let curOptPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(curSeat);
        if (curOptPlayerCtrl) {
            curOptPlayerCtrl.setTeenPattiPlayerCatchChipDisplay(false);
            curOptPlayerCtrl.setTeenPattiPlayerActTime(parseInt(curActTime / 1000));
            // 0空，1看牌，2跟注，4加注，8比牌，16弃牌，32被请求比牌
            let actionMaskValue = curOptPlayerCtrl.getTeenPattiPlayerActionMaskValue();
            let canActArr = this.getActListByActMask(actionMaskValue);
            if (curSeat == myPlayerSeat) {
                this.setBlindAmountLab(selfBaseChip);
                if (canActArr.indexOf(1) != -1) {
                    curOptPlayerCtrl.setTeenPattiPlayerLookBtnActive(true);
                };
                if (canActArr.indexOf(2) != -1) {
                    this.setBlindBtnInteractable(true);
                };
                if (canActArr.indexOf(4) != -1) {
                    this.setAddBtnInteractable(true);
                };
                if (canActArr.indexOf(8) != -1) {
                    this.setShowBtnInteractable(true);
                    let str = this.getShowBtnString();
                    this.setShowBtnLabStr(str);
                };
                if (canActArr.indexOf(16) != -1) {
                    this.setPackBtnInteractable(true);
                };
                if (canActArr.indexOf(32) != -1) {
                    this.setBattleCardFangDianAnim(launchPlayerCtrl, targetPlayerCtrl);
                    this.showReqMyPlayerBattleCardView(launchPlayerCtrl, targetPlayerCtrl);
                };
            }
            else {
                if (canActArr.indexOf(32) != -1) {
                    this.setBattleCardFangDianAnim(launchPlayerCtrl, targetPlayerCtrl);
                };
            };
        };

        if (curActTime > 1000 && duringPaymentSeat != -1) {
            let _time = parseInt(curActTime / 1000);
            let duringPaymentPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(duringPaymentSeat);
            duringPaymentPlayerCtrl.setTeenPattiPlayerActTime(_time, true);
            duringPaymentPlayerCtrl.teenPattiPlayerShoppingCar(true);
            if (myPlayerSeat == duringPaymentSeat) {
                this.node_rechagerBtnTips.active = true;

                let actTime = 0.5;
                this.node_btn_recharge.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1,1), cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1, 1))));

                this.teenPattiRechargeViewData = plotPayment;
                this.teenPattiRechargeAcTime = _time + Math.floor(new Date().getTime() / 1000);
                this.teenPattiRechargeWinRate = plotWinRate;

                this.node_userChongZhiTips.active = true;
                this.setPlayerChongZhiActTime(_time);
                let name = duringPaymentPlayerCtrl.getTeenPattiPlayerName();
                this.richText_rechargeTips.string = `Your cash is not enough, please recharge in time!`;
            };
        };


        if (curSourceCompSeat != -1 && curTargetCompSeat != -1) {
            this.curOptingPlayerSeat = curSourceCompSeat;

            this.playTeenPattiEffect("shanDian");
    
            let launchPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(curSourceCompSeat);
            let targetPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(curTargetCompSeat);
            let myPlayerSeat = this.getMyPlayerSeat();
    
            if (launchPlayerCtrl && targetPlayerCtrl) {
                launchPlayerCtrl.setTeenPattiPlayerActTime(10);
                if (curSourceCompSeat == myPlayerSeat) {
                    this.setShowBtnInteractable(false);
                };
                if (curTargetCompSeat == myPlayerSeat) {
                    this.showReqMyPlayerBattleCardView(launchPlayerCtrl, targetPlayerCtrl);
                };
                this.setBattleCardFangDianAnim(launchPlayerCtrl, targetPlayerCtrl);
            };
        };

        this.refreshMyPlayerShowBtnLabStr("下发场景信息的时候");
    },


    setSceneGameEndState: function(notify, myPlayerSeat) {
        let curPlayers = notify.players;                   // 玩家信息
        let curTableStatus = notify.status;                // 牌桌状态
        let banker = notify.banker;                        // 庄家座位(首次操作的人)
        let curChip = notify.curChip;                      // 基础筹码
        let selfBaseChip = notify.selfBaseChip;            // 当前玩家能下的注
        let curChipPool = notify.chipPool;                 // 下注的总筹码
        let curChipList = notify.chipList;                 // 筹码列表
        let curSeat = notify.curSeat;                      // 当前该谁操作的座位号
        let curActTime = notify.actTime;                   // 当前倒计时
        let curSourceCompSeat = notify.sourceCompSeat;     // 发起比牌的玩家
        let curTargetCompSeat = notify.targetCompSeat;     // 被比牌的玩家
        let lastGameCalc = notify.lastGameCalc;
        let duringPaymentSeat = notify.duringPaymentSeat;  // 支付中的玩家


        for (let i = 0, len = curPlayers.length; i < len; i++) {
            let playerInfo = curPlayers[i];
            let seat = playerInfo.seat;                 // 座位  
            let status = playerInfo.status;             // 玩家的状态
            let hand = playerInfo.hand;                 // 手牌信息
            hand = hand ? hand : {
                cards: [],
                suit: 0,
                score: 0
            };
            let cardValues = hand.cards;                // 牌值
            let cardSuit = hand.suit;                   // 牌型
            let cardScore = hand.score;                 // 牌力（1~100）
            let allChip = playerInfo.allChip;           // 下的注
            let after = playerInfo.after;               // 下注后的货币
            let actionMask = playerInfo.actionMask;     // 当前可以进行的操作
            let look = playerInfo.look;                 // 是否看牌了
    
            let lastAct = playerInfo.lastAct;           // 最近的操作(2跟注, 4加注)

            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
            if (playerCtrl) {
                playerCtrl.clearTeenPattiPlayerCardsNode();
                playerCtrl.setTeenPattiPlayerCoin(after, myPlayerSeat == seat);
                
                playerCtrl.setTeenPattiPlayerStatusValue(status);
                playerCtrl.setTeenPattiPlayerStatusDisplay();

                if (status == 0) {           // 正常状态
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);
                    if (seat == myPlayerSeat) {
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;
                        };
                        this.myPlayerBaseInfo.diamond = after;
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                    };

                    let opt = 0;
                    let isAdd = lastAct == 4 ? true : false;
                    if (look == false && isAdd == true) {
                        opt = 1;
                    }
                    else if (look == true && isAdd == false) {
                        opt = 2;
                    }
                    else if (look == true && isAdd == true) {
                        opt = 3;
                    };
                    playerCtrl.setTeenPattiPlayerCatchChipDisplay(true, opt);

                }
                else if (status == 1) {      // 弃牌
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);
                   
                    if (seat == myPlayerSeat) {
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;
                        };
                        this.myPlayerBaseInfo.diamond = after;
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    };
                }
                else if (status == 2) {      // 比牌输了
                    playerCtrl.setTeenPattiPlayerCardsValueArr(cardValues);
                    playerCtrl.createTeenPattiPlayerCardsNode();

                    playerCtrl.setTeenPattiPlayerActionMaskValue(actionMask);
                    playerCtrl.setTeenPattiPlayerAllChipNodeActive(true);
                    playerCtrl.setTeenPattiPlayerAllChip(allChip);

                    playerCtrl.setTeenPattiPlayerLookValue(look);

                    if (seat == myPlayerSeat) {
                        this.setBlindBtnString(look ? "Chaal" : "Blind");
                        if (this.isTrialRoom == false) {
                            GlobalCfg.USER_DATAS.userDiamond = after;
                        };
                        this.myPlayerBaseInfo.diamond = after;
                        playerCtrl.setTeenPattiPlayerCardsLookCardDisplay(look, cardValues);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    }
                    else {
                        playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(look);
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        playerCtrl.setTeenPattiPlayerCardsGrayEffect();
                    };
                }
                else if (status == 3) {      // 旁观状态
    
                }
            };
        };  

        let myPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat); 
        if (myPlayerCtrl) {
            let status = myPlayerCtrl.getTeenPattiPlayerStatusValue();
            if (status == 0 && curSeat == myPlayerSeat) {
                this.setTableInfoNodeActive(false);
                this.setActBtnsNodeActive(true);
            }
            else {
                this.setTableInfoNodeActive(true);
                this.setActBtnsNodeActive(false);
            };
        };
    },


    //游戏开始的广播
    dealGameStartNotifyEvent: function (notify) {
        this.showWaitNode = false;
        if (!notify) {
            return;
        };

        let curChip = notify.curChip;                    // 默认先投放的底注
        let chipPool = notify.chipPool;                  // 总注池
        let players = notify.players;                    // 玩家状态

        this.isCanExitDirectly = false;

        this.lab_round.string = `Round 0/20`;

        this.setGameStartPlayerInfo(players);
        this.setCurChipAmount(curChip);
        this.setChipPoolAllAmount(chipPool / 100);

        this.setTableInfoNodeActive(false);
        this.setActBtnsNodeActive(true);
        this.setReduceBtnInteractable(false);
        this.setBlindBtnInteractable(false);
        this.setAddBtnInteractable(false);
        this.setShowBtnInteractable(false);
        this.setPackBtnInteractable(false);

        //设置玩家手牌节点(播放发牌动画)
        let joinedPlayerSeatObj = this.getJoinedPlayerSeatObj();
        for (let k = 0, len = joinedPlayerSeatObj.length; k < len; k++) {
            let joinSeat = joinedPlayerSeatObj[k];
            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(joinSeat);
            if (playerCtrl) {
                playerCtrl.clearTeenPattiPlayerCardsNode();
            };
        };

        let myPlayerSeat = this.getMyPlayerSeat();

        this.isCompleteFaPai = false;
        for (let i = 0; i < 3; i++) {
            this.scheduleOnce(() => {
                for (let k = 0, len1 = joinedPlayerSeatObj.length; k < len1; k++) {
                    let joinSeat = joinedPlayerSeatObj[k];
                    let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(joinSeat);
                    if (playerCtrl && playerCtrl.getTeenPattiPlayerStatusValue() === 0) {
                        this.playTeenPattiEffect("faCard");
                        let cardNode = this.getCardNodeFromCardsPool();
                        playerCtrl.playTeenPattiPlayerFaCardAnim(cardNode, i);
                        playerCtrl.setTeenPattiPlayerAllChip(curChip);
                        if (i == 2 && joinSeat == myPlayerSeat && this.isBlindRoom == false) {
                            playerCtrl.setTeenPattiPlayerLookBtnActive(true);
                        };
                    };
                };
            }, 0.2 * i);
        };

        this.scheduleOnce(() => {
            this.isCompleteFaPai = true;
        }, 1);
    },

    dealDestroyAndMatchingNotifyEvent: function() {
        this.isCanExitDirectly = true;
        this.isHavaMySeat = false;
        this.showWaitNode = true;
        this.lab_round.string = `Round 0/20`;
        this.node_myPlayerLookCardSuit.active = false;
        this.node.getChildByName('node_ganChang').active = false;
        let playersCtrlArr = this.getPlayersCtrlArr();
        for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
            let playersCtrl = playersCtrlArr[i];
            if (playersCtrl) {
                playersCtrl.setTeenPattiPlayerLeaveTable();
                if (playersCtrl === this["playerCtrl" + 0]) {
                    playersCtrl.setTeenPattiPlayerJoinedStatus();
                    playersCtrl.setTeenPattiPlayerName(this.myPlayerBaseInfo.nickname);
                    playersCtrl.setTeenPattiPlayerCoin(this.myPlayerBaseInfo.diamond, true);
                    playersCtrl.setTeenPattiPlayerTX(this.myPlayerBaseInfo.imgUrl);
                    playersCtrl.setTeenPattiPlayerVipLevel(this.myPlayerBaseInfo.vipLevel);
                    playersCtrl.setTeenPattiPlayerSex(this.myPlayerBaseInfo.sex);
                    playersCtrl.setTeenPattiPlayerPid(-1);
                };
            };
        };
        let chipNodes = this.node_chips.children;
        for (let i = 0, len = chipNodes.length; i < len; i++) {
            let chipNode = chipNodes[i];
            if (chipNode) {
                chipNode.destroy();
            };
        };
        this.clearPlayersCtrlArr();
        this.clearJoinedPlayerSeatObj();
        this.setTableConfig(this.RoomConfig);
        this.setTableInfoNodeActive(true);
        this.setActBtnsNodeActive(false);
        this.setPackBtnInteractable(false);
        this.setAddBtnInteractable(false);
        this.setReduceBtnInteractable(false);
        this.setShowBtnInteractable(false);
    },

    //自己玩家看牌的操作反馈
    dealLookEvent: function () { },

    //有玩家看牌的广播
    dealPlayerLookNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let hand = notify.hand;
        let cards = hand.cards;
        let suit = hand.suit;
        let score = hand.score;
        let actionMask = notify.actionMask;

        this.playTeenPattiEffect("rollOverCard");

        let myPlayerSeat = this.getMyPlayerSeat();

        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (playerCtrl) {
            playerCtrl.setTeenPattiPlayerLookValue(true);
            if (seat == myPlayerSeat) {
                this.setBlindBtnString("Chaal");
                playerCtrl.setTeenPattiPlayerCardsValueArr(cards);
                playerCtrl.setTeenPattiPlayerLookBtnActive(false);
                playerCtrl.playTeenPattiPlayerCardsRollingOverAnima();
                this.scheduleOnce(() => {
                    this.setMyPlayerLookCardAnim(suit, score);
                }, 0.25);

                this.setBlindAmountLab(this.selfBaseChip * 2);
            }
            else {
                playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(true);
            };
        };

        let canActArr = this.getActListByActMask(actionMask);
        if (canActArr.indexOf(8) != -1) {
            if (this.curOptingPlayerSeat === myPlayerSeat) {
                this.setShowBtnInteractable(true);
                let str = this.getShowBtnString();
                this.setShowBtnLabStr(str);
            };
        };
    },

    //有玩家被呼叫下注的广播
    dealAskChipNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let curChip = notify.curChip;                   // 当前注
        let selfBaseChip = notify.selfBaseChip;         // 自己基础注
        let allowAction = notify.allowAction;           // 允许的操作
        let timeout = notify.timeout;                   // 超时
        let round = notify.round;                     // 第几轮


        this.curOptingPlayerSeat = seat;
        this.selfBaseChip = selfBaseChip;

        this.setCurChipAmount(curChip);

        this.lab_round.string = `Round ${round}/20`;

        let myPlayerSeat = this.getMyPlayerSeat();
        let curOptPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (curOptPlayerCtrl) {
            curOptPlayerCtrl.setTeenPattiPlayerActTime(timeout);
            curOptPlayerCtrl.setTeenPattiPlayerCatchChipDisplay(false);
            // 0空，1看牌，2跟注，4加注，8比牌，16弃牌
            let canActArr = this.getActListByActMask(allowAction);
            if (seat == myPlayerSeat) {
                this.setTableInfoNodeActive(false);
                this.setActBtnsNodeActive(true);
                this.setBlindAmountLab(selfBaseChip);
                if (canActArr.indexOf(1) != -1) {
                    curOptPlayerCtrl.setTeenPattiPlayerLookBtnActive(true);
                };
                if (canActArr.indexOf(2) != -1) {
                    this.setBlindBtnInteractable(true);
                };
                if (canActArr.indexOf(4) != -1) {
                    this.setAddBtnInteractable(true);
                };
                if (canActArr.indexOf(8) != -1) {
                    this.setShowBtnInteractable(true);
                    let str = this.getShowBtnString();
                    this.setShowBtnLabStr(str);
                };
                if (canActArr.indexOf(16) != -1) {
                    this.setPackBtnInteractable(true);
                };
            };
        };

        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;
        this.clearPlayerChongZhiActTimer();

        this.refreshMyPlayerShowBtnLabStr("有玩家被呼叫下注的时候");
    },

    //自己玩家下注的操作反馈
    dealChipEvent: function () { },

    //有玩家下注的广播
    dealPlayerChipNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let isAdd = notify.add;             // 是否加注
        let chip = notify.chip;             // 下注额
        let allChip = notify.allChip;       // 该玩家总下注
        let after = notify.after;           // 该玩家下注后
        let chipPool = notify.chipPool;     // 总注池
        let curChip = notify.curChip;       // 当前注

        this.playTeenPattiEffect("addChip");
        this.setChipPoolAllAmount(chipPool / 100);

        let myPlayerSeat = this.getMyPlayerSeat();
        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (playerCtrl) {
            playerCtrl.clearTeenPatiiPlayerActTimer();
            playerCtrl.setTeenPattiPlayerAllChip(allChip);
            playerCtrl.setTeenPattiPlayerAfter(after, myPlayerSeat == seat);
            playerCtrl.playTeenPattiPlayerCatchChipAnim(chip / 100);
            let isLook = playerCtrl.getTeenPattiPlayerLookValue();
            if (chip != allChip) {
                let opt = 0;
                if (isLook == false && isAdd == true) {
                    opt = 1;
                }
                else if (isLook == true && isAdd == false) {
                    opt = 2;
                }
                else if (isLook == true && isAdd == true) {
                    opt = 3;
                };
                playerCtrl.setTeenPattiPlayerCatchChipDisplay(true, opt);
            };

            if (seat == myPlayerSeat) {
                if (this.isTrialRoom == false) {
                    GlobalCfg.USER_DATAS.userDiamond = after;
                };
                this.myPlayerBaseInfo.diamond = after;
                this.setReduceBtnInteractable(false);
                this.setBlindBtnInteractable(false);
                this.setAddBtnInteractable(false);
                this.setShowBtnInteractable(false);
                this.setPackBtnInteractable(false);               
            };
        };
    },

    //自己玩家弃牌的操作反馈
    dealDropCardEvent: function () {
        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;
        this.clearPlayerChongZhiActTimer();
    },

    //有玩家弃牌的广播
    dealDropCardNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;

        this.playTeenPattiEffect("dropCard");

        let myPlayerSeat = this.getMyPlayerSeat();
        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (playerCtrl) {
            playerCtrl.clearTeenPatiiPlayerActTimer();
            playerCtrl.setTeenPattiPlayerStatusValue(1);
            playerCtrl.setTeenPattiPlayerStatusDisplay();
            playerCtrl.setTeenPattiPlayerLookBtnActive(false);
            let isLook = playerCtrl.getTeenPattiPlayerLookValue();
            if (isLook) {
                playerCtrl.setTeenPattiPlayerCardsGrayMask();
            }
            else {
                playerCtrl.setTeenPattiPlayerCardsGrayEffect();
            };
            if (myPlayerSeat == seat) {
                this.isCanExitDirectly = true;
                this.setTableInfoNodeActive(true);
                this.setActBtnsNodeActive(false);
                this.setReduceBtnInteractable(false);
                this.setBlindBtnInteractable(false);
                this.setAddBtnInteractable(false);
                this.setShowBtnInteractable(false);
                this.setPackBtnInteractable(false);
            };
        };

        this.refreshMyPlayerShowBtnLabStr("有玩家弃牌的时候");
    },

    //自己玩家比牌的操作反馈
    dealLaunchCompareEvent: function () { },

    //有玩家发起比牌的广播
    dealLaunchCompareNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let launch = notify.launch;
        let target = notify.target;

        this.curOptingPlayerSeat = launch;

        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;

        this.playTeenPattiEffect("shanDian");

        let launchPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(launch);
        let targetPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(target);
        let myPlayerSeat = this.getMyPlayerSeat();

        if (launchPlayerCtrl && targetPlayerCtrl) {
            launchPlayerCtrl.setTeenPattiPlayerActTime(10);
            if (launch == myPlayerSeat) {
                this.setShowBtnInteractable(false);
            };
            if (target == myPlayerSeat) {
                this.showReqMyPlayerBattleCardView(launchPlayerCtrl, targetPlayerCtrl);
            };
            this.setBattleCardFangDianAnim(launchPlayerCtrl, targetPlayerCtrl);
        };
    },

    //自己玩家应答比牌的反馈
    dealAnswerCompareEvent: function (notify) {
        if (!notify) {
            return;
        };

    },

    //有玩家应答比牌的广播
    dealAnswerCompareNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };
        //处理有人应答比牌广播

        let agree = notify.agree;
        let launch = notify.launch;
        let target = notify.target;
        let launcherWin = notify.launcherWin;
        let autoAnswer = notify.autoAnswer;

        this.clearBattleCardFangDianAnim();
        this.hideMyPlayerBattleCardView();

        let launchPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(launch);
        let targetPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(target);

        if (launchPlayerCtrl) {
            launchPlayerCtrl.clearTeenPatiiPlayerActTimer();
        };

        if (agree) {
            LoggerUtil.getInstance().time("比牌动画播放时间");
            this.launcherWin = launcherWin ? launch : target;
            this.launcherFail = launcherWin ? target : launch;
            if (targetPlayerCtrl && !autoAnswer) {
                targetPlayerCtrl.setTeenPattiPlayerAgreeActive(true);
            };
            this.showPlayerBattleDisplay();
        }
        else {
            if (targetPlayerCtrl) {
                targetPlayerCtrl.setTeenPattiPlayerRefuseActive(true);
            };
        };

        let myPlayerSeat = this.getMyPlayerSeat();
        if (myPlayerSeat == launcherWin) {
            this.isCanExitDirectly = true;
        };
    },

    //自己玩家退出游戏的操作反馈
    dealExitGameEvent: function () {
        window.isNeedShowRoomList = "teenpatti";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
    },

    //自己玩家换桌的操作反馈
    dealChangeTableEvent: function (notify) {
        if (!notify) {
            return;
        };
        this.isCanExitDirectly = true;
        this.isHavaMySeat = false;
        this.showWaitNode = true;
        this.node_myPlayerLookCardSuit.active = false;
        this.lab_round.string = `Round 0/20`;

        this.unscheduleAllCallbacks();
        this.clearPlayerBattleDisplay();
        this.clearBattleCardFangDianAnim();
        this.hideMyPlayerBattleCardView();
        this.setBlindAmountLab(0);
        this.setChipPoolAllAmount(0);

        let chipNodes = this.node_chips.children;
        for (let i = 0, len = chipNodes.length; i < len; i++) {
            let chipNode = chipNodes[i];
            if (chipNode) {
                chipNode.destroy();
            };
        };

        let playersCtrlArr = this.getPlayersCtrlArr();
        for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
            const playersCtrl = playersCtrlArr[i];
            if (playersCtrl) {
                playersCtrl.setTeenPattiPlayerLeaveTable();
                if (playersCtrl === this["playerCtrl" + 0]) {
                    playersCtrl.setTeenPattiPlayerJoinedStatus();
                    playersCtrl.setTeenPattiPlayerName(this.myPlayerBaseInfo.nickname);
                    playersCtrl.setTeenPattiPlayerCoin(this.myPlayerBaseInfo.diamond, true);
                    playersCtrl.setTeenPattiPlayerTX(this.myPlayerBaseInfo.imgUrl);
                    playersCtrl.setTeenPattiPlayerVipLevel(this.myPlayerBaseInfo.vipLevel);
                    playersCtrl.setTeenPattiPlayerSex(this.myPlayerBaseInfo.sex);
                    playersCtrl.setTeenPattiPlayerPid(-1);
                }
            };
        };

        this.clearPlayersCtrlArr();
        this.clearJoinedPlayerSeatObj();

        this.curOptingPlayerSeat = null;

        let tableConfig = notify.conf;
        this.RoomConfig = tableConfig;
        let forceJump = notify.forceJump;

        GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = forceJump;

        this.setTableConfig(tableConfig);
        this.setTableInfoNodeActive(true);
        this.setActBtnsNodeActive(false);
        this.setReduceBtnInteractable(false);
        this.setBlindBtnInteractable(false);
        this.setAddBtnInteractable(false);
        this.setShowBtnInteractable(false);
        this.setPackBtnInteractable(false);

        this.dealGameSceneEvent(notify.scene);
    },

    //有玩家的金币刷新的广播
    dealUpdateCoinNotifyEvent: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let diamond = notify.diamond;

        let myPlayerSeat = this.getMyPlayerSeat();
        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        
        if (playerCtrl) {
            playerCtrl.setTeenPattiPlayerCoin(diamond, myPlayerSeat == seat);
        };

        if (myPlayerSeat == seat) {
            if (this.isTrialRoom == false) {
                GlobalCfg.USER_DATAS.userDiamond = diamond;
            };
        };
    },

    //游戏结局的广播
    dealGameOverNotifyEvent: function(notify) {
        if (!notify) {
            return;
        };

        let players = notify.players;
        let winSeat = notify.winSeat;                  // 赢家
        let chipPool = notify.chipPool;                // 注池
        let finishReason = notify.finishReason;        // 结束原因 (0弃牌，1比牌，2回合数封顶，3注池封顶)
        let nextTimeout = notify.nextTimeout;          // 下局倒计时(ms)

        this.isCanExitDirectly = true;
        this.setReduceBtnInteractable(false);
        this.setBlindBtnInteractable(false);
        this.setAddBtnInteractable(false);
        this.setShowBtnInteractable(false);
        this.setPackBtnInteractable(false);

        this.setChipPoolAllAmount(chipPool / 100);
        this.setGameOverPlayerStatus(players, winSeat, finishReason);

        this.curRoundAddCoinFinish();

        this.scheduleOnce(() => {
            this.node_myPlayerLookCardSuit.active = false;
            let playersCtrlArr = this.getPlayersCtrlArr();
            for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
                let playerCtrl = playersCtrlArr[i];
                if (playerCtrl) {
                    playerCtrl.setTeenPattiPlayerGameOver();
                };
            };

            this.launcherWin = null;
            this.launcherFail = null;

            this.curOptingPlayerSeat = null;

            this.setChipPoolAllAmount(0);
            this.setBlindAmountLab(0);
            this.setBlindBtnString("Blind");
            this.setShowBtnString(teenPattiLanguage.lobby[0][language]);
            let str = this.getShowBtnString();
            this.setShowBtnLabStr(str);
        }, 6);
    },

    curRoundAddCoinFinish(){
        LoggerUtil.getInstance().log("caojun curRoundAddCoinFinish");
        if(cc.isValid(this)){
            let minLimit = this.RoomConfig.entryCondition || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    dealShortMessage: function (notify) {
        if (!notify) {
            return;
        };

        let msgType = notify.msgType;               // 消息类型 0短语 1表情 2礼物
        let target = notify.target;                 // 接收者seat (-1表示群发)
        let sender = notify.sender;                 // 发送者seat
        let price = notify.price;                   // 消息价格
        let senderAfter = notify.senderAfter;       // 发送者扣价后货币
        let name = notify.name;                     // 表情名/短语内容

        if (msgType == 0 || msgType == 1) {
            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(target);
            if(playerCtrl) playerCtrl.face(notify);
        }
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = this.getPlayerCtrlFromPlayersCtrlArr(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            };

            if (target == -1) {
                let playersCtrlArr = this.getPlayersCtrlArr();
                for (let i = 0; i < playersCtrlArr.length; i++) {
                    let playersCtrl = playersCtrlArr[i];
                    if (playersCtrl && playersCtrl.isHavePlayer == true && playersCtrl !== senderCtrl) {
                        targetNodeArr.push(playersCtrl.node);
                    };
                };
            }
            else {
                let playersCtrl = this.getPlayerCtrlFromPlayersCtrlArr(target);
                if (playersCtrl) {
                    targetNodeArr.push(playersCtrl.node);
                };
            };
            CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
        };
    },

    dealPlayerActTime: function (notify) {
        if (!notify) {
            return;
        };

        let actTime = notify.actTime;
        let seatid = notify.seatid;

        let myPlayerSeat = this.getMyPlayerSeat();
        if (myPlayerSeat === seatid && this.node_rechagerBtnTips.active == true) {
            if (actTime <= 0) {
                this.teenPattiRechargeViewData = null;
                this.teenPattiRechargeAcTime = 0;
                this.teenPattiRechargeWinRate = 0;
                this.node_rechagerBtnTips.active = false;
                return;
            };
        };
    },

    dealPreparepayment: function () {
        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.node_rechagerBtnTips.active = false;
        CommonFun.getInstance().showSmallAddCash("teenPatti",  this.curTableConfig ? this.curTableConfig.cellScore : 0);
    },

    dealPreparepaymentnotify: function (notify) {
        if (!notify) {
            return;
        };

        let timeoutMs = notify.timeoutMs;
        let seat = notify.seat;
        let payment = notify.payment;
        let winRate = notify.winRate;       // 赢的概率 1298表示12.98%

        let _time = parseInt(timeoutMs / 1000);
        let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        playerCtrl.setTeenPattiPlayerActTime(_time, true);
        playerCtrl.teenPattiPlayerShoppingCar(true);
        let myPlayerSeat = this.getMyPlayerSeat();
        if (myPlayerSeat == seat) {
            this.node_rechagerBtnTips.active = true;

            let actTime = 0.5;
            this.node_btn_recharge.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1,1), cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1, 1))));

            this.teenPattiRechargeViewData = payment;
            this.teenPattiRechargeAcTime = _time + Math.floor(new Date().getTime() / 1000);
            this.teenPattiRechargeWinRate = winRate;

            this.node_userChongZhiTips.active = true;
            this.setPlayerChongZhiActTime(_time);
            let name = playerCtrl.getTeenPattiPlayerName();
            this.richText_rechargeTips.string = `Your cash is not enough, please recharge in time!`;
        };
    },

    dealPaymentfinishnotify: function (notify) {
        if (!notify) {
            return;
        };

        let seat = notify.seat;
        let timeoutMs = notify.timeoutMs;      // 修正超时
        let actionMask = notify.actionMask;    // 当前可以进行的操作

        this.node_rechagerBtnTips.active = false;
        this.node_userChongZhiTips.active = false;
        this.teenPattiRechargeViewData = null;
        this.teenPattiRechargeAcTime = 0;
        this.teenPattiRechargeWinRate = 0;
        this.clearPlayerChongZhiActTimer();

        let curOptPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
        if (curOptPlayerCtrl) {
            curOptPlayerCtrl.setTeenPattiPlayerCatchChipDisplay(false);
            curOptPlayerCtrl.setTeenPattiPlayerActTime(parseInt(timeoutMs / 1000));
            // 0空，1看牌，2跟注，4加注，8比牌，16弃牌
            let canActArr = this.getActListByActMask(actionMask);
            let myPlayerSeat = this.getMyPlayerSeat();
            if (seat == myPlayerSeat) {
                if (canActArr.indexOf(1) != -1) {
                    curOptPlayerCtrl.setTeenPattiPlayerLookBtnActive(true);
                };
                if (canActArr.indexOf(2) != -1) {
                    this.setBlindBtnInteractable(true);
                };
                if (canActArr.indexOf(4) != -1) {
                    this.setAddBtnInteractable(true);
                };
                if (canActArr.indexOf(8) != -1) {
                    this.setShowBtnInteractable(true);
                    let str = this.getShowBtnString();
                    this.setShowBtnLabStr(str);
                };
                if (canActArr.indexOf(16) != -1) {
                    this.setPackBtnInteractable(true);
                };
            };
        };
    },

    setPlayerChongZhiActTime: function (actTime) {
        if (actTime > 0) {
            this.clearPlayerChongZhiActTimer();
            this.lab_btnRechargeTip.string = `You have ${actTime}s to recharge`;
            this.lab_rechargeDaoJiShi.string = actTime;
            this.sprite_rechargeDaoJiShi.fillRange = actTime / 300;
            actTime--;
            let self = this;
            let actTimerCall = () => {
                if (self && self.lab_rechargeDaoJiShi) {
                    if (actTime < 0 && self) {
                        self.clearPlayerChongZhiActTimer();
                        self.teenPattiRechargeViewData = null;
                        self.teenPattiRechargeAcTime = 0;
                        self.teenPattiRechargeWinRate = 0;
                        self.node_rechagerBtnTips.active = false;
                        self.node_userChongZhiTips.active = false;
                        self.sprite_rechargeDaoJiShi.fillRange = 0;
                        return;
                    };
                    self.lab_btnRechargeTip.string = `You have ${actTime}s to recharge`;
                    self.lab_rechargeDaoJiShi.string = actTime;
                    self.sprite_rechargeDaoJiShi.fillRange = actTime / 300;
                    actTime--;
                };
            };
            this.playerChongZhiActTimer = setInterval(actTimerCall, 1000);
        };
    },

    //清除玩家操作的倒计时显示
    clearPlayerChongZhiActTimer: function () {
        let self = this
        if (self.playerChongZhiActTimer) {
            clearInterval(self.playerChongZhiActTimer);
            self.playerChongZhiActTimer = null;
        };

        let playersCtrlArr = this.getPlayersCtrlArr();
        for (let i = 0, len = playersCtrlArr.length; i < len; i++) {
            let playersCtrl = playersCtrlArr[i];
            if (playersCtrl) {
                playersCtrl.teenPattiPlayerShoppingCar(false);
            };
        };
    },

    ///////////////////////////////////////////////////////// 网络事件监听回调处理函数 End //////////////////////////////////
    refreshMyPlayerShowBtnLabStr: function (type) {
        let NormalPlayerNum = 0;
        let joinedPlayerSeatObj = this.getJoinedPlayerSeatObj();
        for (let i = 0, len = joinedPlayerSeatObj.length; i < len; i++) {
            const joinSeat = joinedPlayerSeatObj[i];
            let joinPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(joinSeat);
            if (joinPlayerCtrl) {
                let status = joinPlayerCtrl.getTeenPattiPlayerStatusValue();
                if (status == 0) {
                    NormalPlayerNum++;
                };
            };
        };

        if (NormalPlayerNum == 2) { 
            this.setShowBtnString(teenPattiLanguage.lobby[1][language]);
        }
        else {
            this.setShowBtnString(teenPattiLanguage.lobby[0][language]);
        }
        let str = this.getShowBtnString();
        this.setShowBtnLabStr(str);

        LoggerUtil.getInstance().log(`在${type}, 可以继续操作的玩家数量是：${NormalPlayerNum}`);
    },

    setMyPlayerSeat: function (myPlayerSeat) {
        this.myPlayerSeat = myPlayerSeat;
    },

    getMyPlayerSeat: function () {
        return this.myPlayerSeat ? this.myPlayerSeat : 0;
    },

    getActListByActMask: function (actMask) {
        LoggerUtil.getInstance().log("actionMask:",actMask);
        // 0空，1看牌，2跟注，4加注，8比牌，16弃牌，32同意比牌
        let havedActionArr = [];
        let actionArr = [1, 2, 4, 8, 16, 32];
        for (let i = 0, len = actionArr.length; i < len; i++) {
            let tempAct = actionArr[i];
            let canAction = actMask & tempAct;
            if (actionArr.indexOf(canAction) != -1 && havedActionArr.indexOf(canAction) == -1) {
                havedActionArr.push(canAction);
            };
        };

        return havedActionArr;
    },

    setGameOverPlayerStatus: function (players, winSeat, finishReason) {
        let myPlayerSeat = this.getMyPlayerSeat();

        let packedPlayerNum = 0;
        let allPlayerPacked = false;
        for (let i = 0, len = players.length; i < len; i++) {
            const player = players[i];
            let seat = player.seat;
            let status = player.status;
            if (status != 0 && winSeat != seat) {
                packedPlayerNum++;
            };
            if (packedPlayerNum == len - 1) {
                allPlayerPacked = true;
            };
        };

        for (let i = 0, len = players.length; i < len; i++) {
            const player = players[i];
            let seat = player.seat;                         // 位置信息
            let cards = player.cards;                       // 牌
            let suit = player.suit;                         // 牌型
            let calc = player.calc;                         // 输赢分数
            let after = player.after;                       // 结算后货币
            let handledCompare = player.handledCompare;     // 执行过比牌
            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
            if (playerCtrl) {
                playerCtrl.clearTeenPatiiPlayerActTimer();
                playerCtrl.setTeenPattiPlayerCardsValueArr(cards);
                playerCtrl.setTeenPattiPlayerCardsLookLabDisplay(false);
                playerCtrl.setTeenPattiPlayerCatchChipDisplay(false);
                playerCtrl.setTeenPattiPlayerLookBtnActive(false);
                playerCtrl.setTeenPattiPlayerAfter(after, myPlayerSeat == seat);

                let status = playerCtrl.getTeenPattiPlayerStatusValue();
                let isLook = playerCtrl.getTeenPattiPlayerLookValue();
                if (finishReason == 1) {
                    if (myPlayerSeat === seat && isLook == false) {
                        playerCtrl.playTeenPattiPlayerCardsRollingOverAnima();
                        playerCtrl.clearTeenPattiPlayerCardsGrayEffect();
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        this.scheduleOnce(() => {
                            playerCtrl.setTeenPattiPlayerCardSuitDisplay(suit);
                        }, 1);
                    }
                    else if (myPlayerSeat !== seat && (this.launcherWin === seat || this.launcherFail === seat || handledCompare == true)) {
                        playerCtrl.playTeenPattiPlayerCardsRollingOverAnima();
                        playerCtrl.clearTeenPattiPlayerCardsGrayEffect();
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        this.scheduleOnce(() => {
                            playerCtrl.setTeenPattiPlayerCardSuitDisplay(suit);
                        }, 1);
                    };
                }
                else {
                    if (myPlayerSeat === seat && isLook == false) {
                        playerCtrl.playTeenPattiPlayerCardsRollingOverAnima();
                        playerCtrl.clearTeenPattiPlayerCardsGrayEffect();
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        this.scheduleOnce(() => {
                            playerCtrl.setTeenPattiPlayerCardSuitDisplay(suit);
                        }, 1);
                    }
                    else if (myPlayerSeat !== seat && ((allPlayerPacked == false && status == 0) || handledCompare == true)) {
                        playerCtrl.playTeenPattiPlayerCardsRollingOverAnima();
                        playerCtrl.clearTeenPattiPlayerCardsGrayEffect();
                        playerCtrl.setTeenPattiPlayerCardsGrayMask();
                        this.scheduleOnce(() => {
                            playerCtrl.setTeenPattiPlayerCardSuitDisplay(suit);
                        }, 1);
                    };
                };

                if (winSeat == seat) {
                    this.scheduleOnce(() => {
                        this.playTeenPattiEffect("gz");
                        playerCtrl.setTeenPattiPlayerWinSkeletonDisplay();
                    }, 2.2);

                    this.scheduleOnce(() => {
                        let txNode = playerCtrl.node;
                        let txNodePos = txNode.getPosition();
                        let targetPosX = txNodePos.x;
                        let targetPosY = txNodePos.y - 60;
                        let chipNodes = this.node_chips.children;
                        this.playTeenPattiEffect("shouCoin");
                        for (let i = 0, len = chipNodes.length; i < len; i++) {
                            let chipNode = chipNodes[i];
                            cc.tween(chipNode)
                                .to(0.3 + i * 0.03, { position: cc.v2(targetPosX, targetPosY) }, { easing: "expoInOut" })
                                .call(() => {
                                    chipNode.destroy();
                                })
                                .start();
                        };
                    }, 3);

                    this.scheduleOnce(() => {
                        if (calc > 0) {
                            playerCtrl.setTeenPattiPlayerGameWinResultScore(calc / 100);
                            playerCtrl.setTeenPattiPlayerAfter(after, myPlayerSeat == seat);
                        };
                    }, 3.5);
                };
            };

            if (myPlayerSeat == seat) {
                if (this.isTrialRoom == false) {
                    GlobalCfg.USER_DATAS.userDiamond = after;
                };
            };
        };
    },

    setPlayersCtrlArr: function (myPlayerSeat) {
        this.playersCtrlArr = [];
        for (let seat = 0; seat < 5; seat++) {
            this.playersCtrlArr[(myPlayerSeat + seat) % 5] = this["playerCtrl" + seat];
            this["playerCtrl" + seat].setTeenPattiPlayerSeat((myPlayerSeat + seat) % 5, myPlayerSeat);
        };
    },

    getPlayersCtrlArr: function () {
        return this.playersCtrlArr;
    },

    clearPlayersCtrlArr: function () {
        this.playersCtrlArr = [];
    },

    getPlayerCtrlFromPlayersCtrlArr: function (seat) {
        return this.playersCtrlArr[seat];
    },

    getPlayersPosList: function () {
        return this.playersPosList ? this.playersPosList : [];
    },

    setTableConfig: function (conf) {
        if (!conf) {
            return;
        };
        this.curTableConfig = conf;

        let cellScore = conf.cellScore;
        let blind = conf.blind;                          // 是否是闷牌场
        this.maxJetton = conf.maxJetton;                 // 最大筹码
        let maxTableJetton = conf.maxTableJetton;        // 桌面奖池最大筹码
        let trial = conf.trial;

        this.isBlindRoom = blind;

        this.isTrialRoom = trial;                       // true: 体验场，false: 金币场

        if (this && this.node_btn_cz_mf && this.node_btn_cz_cz) {
            this.node_btn_cz_mf.active = trial ? true : false;
            this.node_btn_cz_cz.active = trial ? false : true;
        };

        this.cashSwitch();

        this.lab_bootAmount.string = cellScore / 100;
        this.lab_chaalLimit.string = conf.maxJetton / 100;
        this.lab_maxBlinds.string = blind ? "Always Blind" : 4;
        this.lab_potLimit.string = maxTableJetton / 100;

        for (let i = 0; i < 5; i++) {
            let playerCtrl = this["playerCtrl" + i];
            if (playerCtrl) {
                playerCtrl.setTeenPattiPlayerChipIsTrialType(trial);
            };
        };
    },

    cashSwitch: function () {
        if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = cc.find('Canvas/btn_cz/Background/icon_chipsshop');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        this.node_btn_cz.active = false;//GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

    setGameSceneChipList: function (chipList) {
        for (let i = 0, len = chipList.length; i < len; i++) {
            let verDistance = 30;
            let HorDistance = 120;
            let randomPos = cc.v2(Math.random() * HorDistance * (Math.random() > 0.5 ? 1 : -1), Math.random() * verDistance * (Math.random() > 0.5 ? 1 : -1));
            const chipAmount = chipList[i];
            let chipNode = this.getChipNodeFromChipsPool();
            chipNode.setPosition(randomPos);
            let scr = chipNode.getComponent("teenPattiChipCtrl");
            scr.setTeenPattiChipAmount(chipAmount / 100);
            this.node_chips.addChild(chipNode);
        };
    },

    setCurChipAmount: function (baseChip) {
        this.curBaseChipAmount = baseChip;
    },

    setGameStartPlayerInfo: function (players) {
        for (let i = 0, len = players.length; i < len; i++) {
            let player = players[i];
            let seat = player.seat;                             // 座位
            let status = player.status;                         // 游戏状态
            let diamond = player.diamond;                       // 金币数量
            let playerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(seat);
            if (playerCtrl) {
                let myPlayerSeat = this.getMyPlayerSeat();
                playerCtrl.setTeenPattiPlayerCoin(diamond, myPlayerSeat == seat);
                playerCtrl.setTeenPattiPlayerStatusValue(status);
                playerCtrl.setTeenPattiPlayerStatusDisplay();
            };
        };

        this.refreshMyPlayerShowBtnLabStr("游戏开始的时候");
    },

    setChipPoolAllAmount: function (chipPool) {
        this.lab_tableAmount.string = chipPool;
    },

    setMyPlayerLookCardAnim: function (suit, score) {
        let str = ["", "High Card", "Pair", "Color", "Sequence", "Pure SEQ", "SET"][suit]
        this.lab_myPlayerLookCard.string = this.showLable(str);
        
       
        let progress = 0.0;
        let repeat = Math.ceil(score/10) - 1;
        let step = score/100/(repeat + 1);

        this.progressBar_cardStrength.progress = progress;
        this.progressBar_cardStrength.schedule(() => {
            progress += step;
            this.progressBar_cardStrength.progress = progress;
        }, 0.05, repeat, 0);

        this.node_myPlayerLookCardSuit.active = true;
    },

    setBlindBtnString: function (str) {
        // this.lab_catchChipType.string = str;
        this.lab_catchChipType.string = this.showLable(str);

    },

    setShowBtnString: function (str) {
        this.labBtnShowString = str;
    },

    getShowBtnString: function () {
        return this.labBtnShowString;
    },

    setShowBtnLabStr: function (str) {
        // this.lab_btn_show.string = str;
        this.lab_btn_show.string = this.showLable(str);
    },

    ////////////////////////////////////////////////////////////// 比牌展示 Start ////////////////////////////////
    showReqMyPlayerBattleCardView: function (launchPlayerCtrl, targetPlayerCtrl) {
        if (!launchPlayerCtrl || !targetPlayerCtrl) {
            return;
        };
        if (this.isLoadingBattleCardView) {
            return;
        };
        let launchPlayerName = launchPlayerCtrl.getTeenPattiPlayerName();
        let launchPlayerTXUrl = launchPlayerCtrl.getTeenPattiPlayerTX();
        let targetPlayerName = targetPlayerCtrl.getTeenPattiPlayerName();
        let targetPlayerTXUrl = targetPlayerCtrl.getTeenPattiPlayerTX();
        this.isLoadingBattleCardView = true;
        let teenPattiBattleCardNode = cc.instantiate(this.prefab_battleCard);
        let scr = teenPattiBattleCardNode.getComponent("teenPattiBattleCardCtrl");
        scr.setTeenPattiBattleCardPKName(launchPlayerName);
        scr.setTeenPattiBattleCardLaunchPlayerName(launchPlayerName);
        scr.setTeenPattiBattleCardTargetPlayerName(targetPlayerName);
        scr.setTeenPattiBattleCardLaunchPlayerTX(launchPlayerTXUrl);
        scr.setTeenPattiBattleCardTargetPlayerTX(targetPlayerTXUrl);
        scr.setTeenPattiBattleCardRefuseTime(10);
        this.node_battleCard.addChild(teenPattiBattleCardNode);
        this.isLoadingBattleCardView = false;
    },

    hideMyPlayerBattleCardView: function () {
        this.node_battleCard.removeAllChildren();
    },

    showPlayerBattleDisplay: function () {
        this.playTeenPattiEffect("cmpBomb");
        this.skele_player_pk.setAnimation(0, "chuxian", false);
        this.node_player_pk.active = true;
    },

    clearPlayerBattleDisplay: function () {
        this.skele_player_pk.clearTracks();
        this.node_player_pk.active = false;
    },

    showBattleWinAndFailPlayerDisplay: function () {
        this.playTeenPattiEffect("bipaibaozha");
        let launcherWin = this.launcherWin;
        let launcherFail = this.launcherFail;
        let launcherWinPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(launcherWin);
        let launcherFailPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(launcherFail);
        if (launcherWinPlayerCtrl) {
            launcherWinPlayerCtrl.clearTeenPatiiPlayerActTimer();
        };
        if (launcherFailPlayerCtrl) {
            launcherFailPlayerCtrl.clearTeenPatiiPlayerActTimer();
            launcherFailPlayerCtrl.setTeenPattiPlayerBaoZhaSkeletonDisplay();
            this.scheduleOnce(() => {
                if (!launcherFailPlayerCtrl) {
                    return;
                };
                let isLook = launcherFailPlayerCtrl.getTeenPattiPlayerLookValue();
                launcherFailPlayerCtrl.clearTeenPattiPlayerBaoZhaSkeletonDisplay();
                launcherFailPlayerCtrl.setTeenPattiPlayerStatusValue(2);
                launcherFailPlayerCtrl.setTeenPattiPlayerStatusDisplay();
                if (isLook) {
                    launcherFailPlayerCtrl.setTeenPattiPlayerCardsGrayMask();
                }
                else {
                    launcherFailPlayerCtrl.setTeenPattiPlayerCardsGrayEffect();
                };

                let myPlayerSeat = this.getMyPlayerSeat();
                if (myPlayerSeat == launcherFail) {
                    this.setTableInfoNodeActive(true);
                    this.setActBtnsNodeActive(false);
                };
                LoggerUtil.getInstance().timeEnd("比牌动画播放时间");
            }, 0.5);
        };

        this.refreshMyPlayerShowBtnLabStr("比牌结果的时候");
    },

    setBattleCardFangDianAnim: function (launchPlayerCtrl, targetPlayerCtrl) {
        if (launchPlayerCtrl && targetPlayerCtrl) {
            let launchPlayerTXNode = launchPlayerCtrl.getTeenPattiPlayerTXNode();
            let targetPlayerTXNode = targetPlayerCtrl.getTeenPattiPlayerTXNode();
            let pos1 = CommonFun.getInstance().convertOtherNodeSpaceAR(launchPlayerTXNode, this.node);
            let pos2 = CommonFun.getInstance().convertOtherNodeSpaceAR(targetPlayerTXNode, this.node);
            let temp = pos1.sub(pos2);
            let dis = Math.abs(temp.mag());
            let midPointPos = cc.v2((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
            let angle = this.getLiangPosAngle(pos1, pos2);
            this.node_lianXian.width = dis;
            this.node_lianXian.angle = angle;
            this.node_lianXian.setPosition(midPointPos);
            this.node_lianXian.active = true;
        };
    },

    clearBattleCardFangDianAnim: function () {
        this.node_lianXian.active = false;
    },

    //根据用户Seat获取用户控制脚本
    getPlayerInfoByUserSeat: function (userID) {
        let playerInfo = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if (userNode.name != '') {
                let userInfoCtrl = userNode.getComponent('teenPattiPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.seatid === userID) {
                    playerInfo = userInfoCtrl;
                    break;
                }
            }
        }
        return playerInfo;
    },

    getLiangPosAngle: function (start, end) {
        //计算出朝向
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dir = cc.v2(dx, dy);
        //根据朝向计算出夹角弧度
        let angle = dir.signAngle(cc.v2(1, 0));
        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;
        return -degree;
    },

    ////////////////////////////////////////////////////////////// 比牌展示 End ////////////////////////////////


    ////////////////////////////////////////////// 进入房价的玩家座位统计数组 Start ///////////////////////////////
    pushJoinedPlayerSeatObj: function (seat) {
        if (this.joinedPlayerSeatObj.indexOf(seat) == -1) {
            this.joinedPlayerSeatObj.push(seat);
        };
    },

    removeSeatFromJoinedPlayerSeatObj: function (seat) {
        this.joinedPlayerSeatObj.forEach(function (item, index, arr) {
            if (item == seat) {
                arr.splice(index, 1);
            };
        });
    },

    clearJoinedPlayerSeatObj: function () {
        this.joinedPlayerSeatObj = [];
    },

    getJoinedPlayerSeatObj: function () {
        return this.joinedPlayerSeatObj;
    },
    ////////////////////////////////////////////// 进入房价的玩家座位统计数组 End ///////////////////////////////


    ////////////////////////////////////////////// 设置操作按钮的状态 Start ////////////////////////////////////
    setActBtnsNodeActive: function (active) {
        this.node_act_btns.active = active;
        if (active) this.isShowHindi(cc.director.getScene())
    },

    setShowBtnInteractable: function (isInteract) {
        this.btn_show.interactable = isInteract;
        this.btn_show.enableAutoGrayEffect = !isInteract;
    },

    setReduceBtnInteractable: function (isInteract) {
        this.btn_reduce.interactable = isInteract;
        this.btn_reduce.enableAutoGrayEffect = !isInteract;
    },

    setBlindBtnInteractable: function (isInteract) {
        this.btn_blind.interactable = isInteract;
        this.btn_blind.enableAutoGrayEffect = !isInteract;
    },

    setAddBtnInteractable: function (isInteract) {
        this.btn_add.interactable = isInteract;
        this.btn_add.enableAutoGrayEffect = !isInteract;
    },

    setPackBtnInteractable: function (isInteract) {
        this.btn_pack.interactable = isInteract;
        this.btn_pack.enableAutoGrayEffect = !isInteract;
    },
    ///////////////////////////////////////////// 设置操作按钮的状态 End //////////////////////////////



    /////////////////////////////////////////////////////////// 不需要向服务器发送操作请求的按钮事件 Start ////////////////////////////
    dealBtnBlindOpt: function (optType) {
        let btn_add = this.node_btn_add.getComponent(cc.Button);
        let btn_reduce = this.node_btn_reduce.getComponent(cc.Button);
        if (optType == "add") {
            btn_add.interactable = false;
            btn_add.enableAutoGrayEffect = true;
            btn_reduce.interactable = true;
            btn_reduce.enableAutoGrayEffect = false;

            this.isAddChipAmount = true;
            this.lab_chipAmount.string = (this.myPlayerCanChipAmount * 2) / 100;

            let myPlayerSeat = this.getMyPlayerSeat();
            let myPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat);
            if (!myPlayerCtrl) {
                return;
            };
            let coin = myPlayerCtrl.getTeenPattiPlayerCoin();
            if (this.isTrialRoom == false && this.totalPay == 0 && (this.myPlayerCanChipAmount * (this.isAddChipAmount ? 2 : 1)) > coin) {
                CommonFun.getInstance().showSmallAddCash("teenPatti",  this.curTableConfig ? this.curTableConfig.cellScore : 0);
            };
        }
        else if (optType == "reduce") {
            btn_add.interactable = true;
            btn_add.enableAutoGrayEffect = false;
            btn_reduce.interactable = false;
            btn_reduce.enableAutoGrayEffect = true;

            this.isAddChipAmount = false;
            this.lab_chipAmount.string = this.myPlayerCanChipAmount / 100;
        };
    },

    dealShowWanFaOpt: function () {
        let wanFaNode = cc.instantiate(this.prefab_wfTips);
        this.node_wanFa.addChild(wanFaNode);
        let src = wanFaNode.getComponent("teenPattiWanFaCtrl");
        src.setTeenPattiWaFanView(this.curTableConfig);
    },

    showBiaoQingView: function () {
        let prefab_biaoQing = cc.instantiate(this.prefab_biaoQing);
        let ctrl = prefab_biaoQing.getComponent("chatCtrl");
        let myPlayerSeat = this.getMyPlayerSeat();
        ctrl.setPlayerSeat(myPlayerSeat);
        this.node.addChild(prefab_biaoQing);
    },

    dealBtnRecharge: function() {
        let children = this.node_hintParent.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            node.destroy();
        };
        let rechargeViewNode = cc.instantiate(this.prefab_recharge);
        let ctrl = rechargeViewNode.getComponent("teenPattiRechargeCtrl");
        ctrl.setTeenPattiRechargeData(this.teenPattiRechargeViewData);
        ctrl.setTeenPattiRechargeTime(this.teenPattiRechargeAcTime);
        this.node_hintParent.addChild(rechargeViewNode);
    },

    setTableInfoNodeActive: function (active) {
        this.node_info_bg.active = active;
        this.node_btn_changeTable.active = active;

        if (active == false) {
            this.node_btn_changeTable.getComponent(cc.Button).interactable = true;
            this.sprite_btn_changeTable.unscheduleAllCallbacks();
            this.sprite_btn_changeTable.fillRange = 0;
        };
    },

    setBlindAmountLab: function (chipAmount) {
        this.isAddChipAmount = false;
        this.myPlayerCanChipAmount = chipAmount;
        this.lab_chipAmount.string = chipAmount / 100;
    },
    /////////////////////////////////////////////////////////// 不需要向服务器发送操作请求的按钮事件 End /////////////////////////////////////////


    /////////////////////////////////////////////////////////// 需要向服务器发送操作请求的按钮事件 Start //////////////////////////////////////////

    sendLoginReq: function () {
        let proroID = "gameservice.login";
        let message = "LoginReq";
        GameServerManager.send(proroID, message, {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: GlobalCfg.PRODUCT_ID
        });
    },

    sendEnterTableReq: function () {
        if (GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId == -1) {
            window.isNeedShowRoomList = "teenpatti";
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            return;
        };
        let proroID = "gameservice.enterlv";
        let message = "EnterLvReq";
        GameServerManager.send(proroID, message, {
            id: GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId
        });
    },

    sendExitGameReq: function () {
        let proroID = "gameservice.exitgame";
        let message = "ExitGameReq";
        GameServerManager.send(proroID, message, {});
    },

    sendChangeTableReq: function() {
        if (this.isHavaMySeat == false) {
            return;
        };
        let proroID = "gameservice.changeroom";
        let message = "ChangeRoomAck";
        GameServerManager.send(proroID, message, {});
    },

    sendDropCardReq: function () {
        let proroID = "gameservice.drop";
        let message = "DropReq";
        GameServerManager.send(proroID, message, {});
    },

    sendBlindReq: function () {
        let myPlayerSeat = this.getMyPlayerSeat();
        let myPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat);
        if (!myPlayerCtrl) {
            return;
        };
        let coin = myPlayerCtrl.getTeenPattiPlayerCoin();
        if (this.isTrialRoom == false) {
            if (this.totalPay == 0 && (this.myPlayerCanChipAmount * (this.isAddChipAmount ? 2 : 1)) > coin) {
                CommonFun.getInstance().showSmallAddCash("teenPatti",  this.curTableConfig ? this.curTableConfig.cellScore : 0);
                return;
            }
            else if (this.totalPay > 0 && (this.myPlayerCanChipAmount * (this.isAddChipAmount ? 2 : 1)) > coin) {
                CommonFun.getInstance().showTips("Insufficient gold coins！");
                return;
            };
        }
        else if (this.isTrialRoom) {
            if ((this.myPlayerCanChipAmount * (this.isAddChipAmount ? 2 : 1)) > coin) {
                CommonFun.getInstance().showTips("Insufficient experience coins！");
                return;
            };
        }

        let proroID = "gameservice.chip";
        let message = "ChipReq";
        GameServerManager.send(proroID, message, { add: this.isAddChipAmount });
    },

    sendLaunchCompareReq: function () {
        let proroID = "gameservice.launchcompare";
        let message = "LaunchCompareReq";
        GameServerManager.send(proroID, message, {});
    },

    sendLookReq: function () {
        let proroID = "gameservice.look";
        let message = "LookReq";
        GameServerManager.send(proroID, message, {});
    },
    /////////////////////////////////////////////////////////// 需要向服务器发送操作请求的按钮事件 End //////////////////////////////////////////


    ////////////////////////////////////////////////////////// 播放音效 Start ////////////////////////////////////////


    loadAudioClip: function (name = "", func = null, target = null) {
        if (!name || name.length == 0) {
            return;
        };
        CommonFun.getInstance().loadBundle("teenPatti", (bundle) => {
            bundle.load("sound/" + name, cc.AudioClip, (err1, audioClip) => {
                if (!err1) {
                    func && func(audioClip, target);
                }
                else {
                    LoggerUtil.getInstance().error(err1);
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    playTeenPattiEffect: function (name) {
        this.loadAudioClip(name, (audioClip, target) => {
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }, this);
    },

    ////////////////////////////////////////////////////////// 播放音效 End ////////////////////////////////////////

    //  显示印地语 还是显示英语
    isShowHindi: function (scene) {
        let sprites = scene.getComponentsInChildren(cc.Label);
        for (let i = 0; i < sprites.length; i++) {
            let str = sprites[i].string;
            for (let k = 0; k < teenPattiLanguage.lobby.length; k++) {
                let arr = teenPattiLanguage.lobby[k];
                if (str == arr[1] || str == arr[2]) {
                    sprites[i].string = arr[language];
                }
            }
        }
    },

    // 动态显示文字
    showLable: function (str) {
        for (let k = 0; k < teenPattiLanguage.lobby.length; k++) {
            let arr = teenPattiLanguage.lobby[k];
            if (str == arr[1] || str == arr[2] || str == arr[3] || str == arr[4]) {
                return arr[language];
            }
        }

        return str
    },
    

    isCanSendGift: function() {
        let myPlayerSeat = this.getMyPlayerSeat();
        let myPlayerCtrl = this.getPlayerCtrlFromPlayersCtrlArr(myPlayerSeat);
        if (!myPlayerCtrl) {
            return;
        };
        let coin = myPlayerCtrl.getTeenPattiPlayerCoin();
        if (this.isTrialRoom == false && (this.myPlayerCanChipAmount * (this.isAddChipAmount ? 2 : 1)) > coin) {
            return false;
        };
        return true;
    },

    update(dt) {
        if (this.showWaitNode == true) {
            this.waitTipsTime += dt;
            if (this.waitTipsTime > 1) {
                this.showWaitTips(this.waitTipsIndex);
                this.waitTipsIndex++;
                if(this.waitTipsIndex > 2){
                    this.waitTipsIndex = 0;
                };
                this.waitTipsTime = 0;
            };
        }
        else {
            this.nodeWaitTips.active = false;
        }
    },

    showWaitTips(index){
        let arr = ['.', '..', '...'];
        let str = 'Waiting for other players join the game';
        this.nodeWaitTips.getChildByName('Label').getComponent(cc.Label).string = str + arr[index];
        this.nodeWaitTips.active = true;
    },
});
