cc.Class({
    extends: cc.Component,

    properties: {
        pab_player: cc.Prefab,
        pab_jinbi: cc.Prefab,
        pab_rule: cc.Prefab,
        pab_chat: cc.Prefab,
        pab_playerlist: cc.Prefab,

        ske_start: sp.SkeletonData,
        ske_stop: sp.SkeletonData,

        sprites_jb: [cc.SpriteFrame],
        cardArr: [cc.Node],
        paixArr: [cc.Node],
        paixSFArr:[cc.SpriteFrame],
        
        content_trend: cc.Node,
        item_trend: cc.Node,
        sprites_trend: [cc.SpriteFrame],
    },

    ctor() {
        this.betRoundCount = 0;
        this.userArryNode = [];         //存放VIP玩家节点
        this.userBtnCion = 1;
        this.downSite = 0;              //自己的VIP座位ID
        this.hasDown = false;           //已经坐下（true），未上座（false）
        this.betBtnState = false;       //下注按钮能否使用
        this.goldAllArr = [[], [], [], [], [], []];           //存放所有金币的数组
        this.tempTime = 0;          //用来甄别是不是同一秒钟的两次消息
        this.selfBetAmount = [0, 0, 0, 0, 0, 0];        //自己下注的每个区域的数目，用来处理repeat bets
        this.betAllAmount = [0, 0, 0, 0, 0, 0];         //所有区域下注数目
        this.loseAreaCountArr = [];             //存放输的区域的金币移动完毕标识
        this.repeatBetArr = [];           //存放重复下注的数组
        this.currentBetNum = 0;                 //当前下注额
        this.limitMaxBetNum = 3000000;          //下注上限
        this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
            "Your cash is insufficient, Please recharge in time!", //您的现金不足，请及时充值！
            "non betting stage",                     //暂时不能下注
            "Upper limit of betting amount！"  //投注金额上限！
        ];
        this.paixStrArr = ["HIGH CARD","PAIR","COLOR","SEQ","PURE SEQ","SET"];
        this.isGameEndStatus = false;
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MUNDA_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
        this.initNode();
        this.initJbPool();
        this.sendReqCtrl = this.node.getComponent("mtpSendReq");
        this.mtpAudioCtrl = this.node.getComponent("mtpAudioCtrl");
        this.mtpAudioCtrl.inite();

        this.mtpBundle = cc.assetManager.getBundle('multiTeenPatti');
        this.EventHide();
        this.EventShow();
        this.paymentSwitch = false;
        
        this.cashSwitch();
        
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.msgHandle1 = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    initNode: function () {
        GlobalCfg.ACT_SCENE_CTRL = this;
        CommonFun.getInstance().hidProgress();
        this.jinbiParent = this.node.getChildByName("jinbiPool");
        this.startBettingSke = this.node.getChildByName("startBetting").getComponent(sp.Skeleton);
        this.startBettingSke.node.active = false;
        this.node_playersSeat = cc.find('Canvas_mtp/node_players/node_playersSeat');
        this.playerSelf = cc.find('Canvas_mtp/root_myinfo');
        this.selfNodeCtrl = this.playerSelf.getComponent("mtpPlayerSelfCtrl");
        this.zhuangNode = this.node.getChildByName("zhuangPos");
        this.zhuangPosX = this.zhuangNode.x;
        this.zhuangPosY = this.zhuangNode.y;
        this.playerSelfY = this.playerSelf.y;

        this.node_btnGuangQuan = cc.find('Canvas_mtp/node_playerBetBtn/node_btnGuangQuan');
        this.node_time = this.node.getChildByName("node_time");
        this.node_clock = this.node_time.getChildByName("node_clock");
        this.lab_clock = this.node_clock.getChildByName("lab_time").getComponent(cc.Label);
        this.node_clock.active = false;

        this.btn_playersAll = cc.find('Canvas_mtp/btn_playersAll').getComponent(cc.Button);
        this.lab_playerCount = this.btn_playersAll.node.getChildByName("playerCount").getChildByName("lab").getComponent(cc.Label);
        this.playListPosX = this.btn_playersAll.node.x;
        this.playListPosY = this.btn_playersAll.node.y;

        this.node_table = this.node.getChildByName("node_table");

        this.btn_area_1 = this.node_table.getChildByName("node_1").getComponent(cc.Button);
        this.btn_area_2 = this.node_table.getChildByName("node_2").getComponent(cc.Button);
        this.btn_area_3 = this.node_table.getChildByName("node_3").getComponent(cc.Button);
        this.btn_area_4 = this.node_table.getChildByName("node_4").getComponent(cc.Button);
        this.betAreaArr = [this.btn_area_1, this.btn_area_2, this.btn_area_3, this.btn_area_4];
        this.lab_1 = this.node_table.getChildByName("node_1").getChildByName("lab_1").getComponent(cc.RichText);
        this.lab_2 = this.node_table.getChildByName("node_2").getChildByName("lab_2").getComponent(cc.RichText);
        this.lab_3 = this.node_table.getChildByName("node_3").getChildByName("lab_3").getComponent(cc.RichText);
        this.lab_4 = this.node_table.getChildByName("node_4").getChildByName("lab_4").getComponent(cc.RichText);
        this.betLabArr = [this.lab_1, this.lab_2, this.lab_3, this.lab_4];
        this.selfBetNum = new Array(this.betLabArr.length).fill(0);

        this.lab_1_mine = this.node_table.getChildByName("node_1").getChildByName("lab_mine").getComponent(cc.RichText);
        this.lab_2_mine = this.node_table.getChildByName("node_2").getChildByName("lab_mine").getComponent(cc.RichText);
        this.lab_3_mine = this.node_table.getChildByName("node_3").getChildByName("lab_mine").getComponent(cc.RichText);
        this.lab_4_mine = this.node_table.getChildByName("node_4").getChildByName("lab_mine").getComponent(cc.RichText);
        this.betLabSelfArr = [this.lab_1_mine, this.lab_2_mine, this.lab_3_mine, this.lab_4_mine];
        
        this.btn_shop = cc.find('Canvas_mtp/btn_shop').getComponent(cc.Button);
        this.btn_wf = cc.find('Canvas_mtp/btn_wf').getComponent(cc.Button);
        this.btn_sound = cc.find('Canvas_mtp/btn_sound').getComponent(cc.Button);
        this.btn_openMenu = cc.find('Canvas_mtp/btn_openMenu').getComponent(cc.Button);
        this.btn_10 = cc.find('Canvas_mtp/node_playerBetBtn/btn_10').getComponent(cc.Button);
        this.btn_50 = cc.find('Canvas_mtp/node_playerBetBtn/btn_50').getComponent(cc.Button);
        this.btn_100 = cc.find('Canvas_mtp/node_playerBetBtn/btn_100').getComponent(cc.Button);
        this.btn_500 = cc.find('Canvas_mtp/node_playerBetBtn/btn_500').getComponent(cc.Button);
        this.btn_1000 = cc.find('Canvas_mtp/node_playerBetBtn/btn_1000').getComponent(cc.Button);
        this.btn_5000 = cc.find('Canvas_mtp/node_playerBetBtn/btn_5000').getComponent(cc.Button);
        this.betAmountList = [10, 50, 100, 500, 1000, 5000];
        this.userBtnCion = this.betAmountList[0];
        this.choiceBetButton(this.btn_10);

        this.btn_1 = cc.find('Canvas_mtp/node_players/btn_01').getComponent(cc.Button);
        this.btn_2 = cc.find('Canvas_mtp/node_players/btn_02').getComponent(cc.Button);
        this.btn_3 = cc.find('Canvas_mtp/node_players/btn_03').getComponent(cc.Button);
        this.btn_4 = cc.find('Canvas_mtp/node_players/btn_04').getComponent(cc.Button);
        this.btn_5 = cc.find('Canvas_mtp/node_players/btn_05').getComponent(cc.Button);
        this.btn_6 = cc.find('Canvas_mtp/node_players/btn_06').getComponent(cc.Button);
        
        this.img_wait = cc.find('Canvas_mtp/node_playerBetBtn/wait');
        this.img_bet = cc.find('Canvas_mtp/node_playerBetBtn/bet');
        this.btn_repeatBet = cc.find('Canvas_mtp/node_playerBetBtn/btn_repeatBet').getComponent(cc.Button);

        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].node.on("click", this.btnClick, this)
        }
    },

    start() {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            // fromid: GlobalCfg.PRODUCT_ID //平台ID
        });
    },

    EventHide: function () {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            LoggerUtil.getInstance().log("游戏进入后台");
            GameServerManager.hideFilterMag(1)
            this.reConnection();
            this.freshScene();
        }, this);
    },

    EventShow: function () {
        cc.game.on(cc.game.EVENT_SHOW, function () {
            LoggerUtil.getInstance().log("重新返回游戏");
            GameServerManager.hideFilterMag(2, function () {
                GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
            })
        }, this);
    },

    //重新开始刷新场景数据，重置
    freshScene: function () {
        this.selfBetNum.fill(0,0);
        for (let i = 0; i < this.betAreaArr.length; i++) {
            this.showWinAreaSke(false, i);
        }
        for (let i = 0, len = this.betLabArr.length; i < len; i++) {
            let lab = this.betLabArr[i];
            lab.string  = "0";
            this.betLabSelfArr[i].string = `<color=#ffc705>0</color>`;
        }
        for (let i = 0, len = this.goldAllArr.length; i < len; i++) {
            let arr = this.goldAllArr[i];
            for (let j = arr.length - 1; j >= 0; j--) {
                let jbNode = arr[j];
                this.removeJbNode(jbNode);
                arr.splice(j, 1);
            }
            arr.length = 0;
        }
        for (let i = 0; i < this.cardArr.length; i++) {
            for (let index = 0; index < 3; index++) {
                let cradNode = this.cardArr[i].getChildByName(""+ (index+1));
                let cradScrpit = cradNode.getComponent("mtpCradCtrl");
                cradScrpit.initCardInfo()
            }
            this.paixArr[i].active = false;
        }
        for (let i = 0; i < this.selfBetAmount.length; i++) {
            this.selfBetAmount[i] = 0;
        }
        for (let i = 0; i < this.betAllAmount.length; i++) {
            this.betAllAmount[i] = 0;
        }
        this.jinbiParent.removeAllChildren();
        this.loseAreaCountArr.length = 0;
        this.loseAreaCount = 0;
        // cc.Tween.stopAll();
        for (let i = 1; i < 11; i++) {
            cc.Tween.stopAllByTag(i);
        }
    },

    //断线重连
    reConnection: function () {
        this.clearSchedule();
        //删除之前的VIP节点
        for (let i = 0; i < this.userArryNode.length; i++) {
            let node = this.userArryNode[i];
            if (node) {
                node.destroy();
            }
        }
        this.hasDown = false;
        this.downSite = 0;
    },

    //清除计时器
    clearSchedule: function () {
        this.unschedule(this.selfBetCallBack);
        this.unschedule(this.vipBetCallBack);
        this.unschedule(this.otherBetCallBack);
    },

    initJbPool: function () {
        this.jbPool = new cc.NodePool();
        let initCount = 150;
        for (let i = 0; i < initCount; i++) {
            this.jbPool.put(cc.instantiate(this.pab_jinbi));    //放入对象池
        }
    },

    createJbNode: function () {
        let feijbNode = null;
        if (this.jbPool.size() > 0) {       //通过size接口判断对象池中是否有空闲的对象
            feijbNode = this.jbPool.get();
        } else {                          //对象池中的备用对象不够时，通过cc.instantiate 重新创建
            feijbNode = cc.instantiate(this.pab_jinbi);
        }
        // feijbNode.setPosition(0, 0);
        let randomFunc = function () {
            const random = Math.random() * 100; // 生成 0~99.999... 的随机数
            if (random < 40) return 0;      // 40% 概率返回 0
            if (random < 70) return 1;      // 30% 概率返回 1 (40+30=70)
            if (random < 90) return 2;      // 20% 概率返回 2 (70+20=90)
            if (random < 99) return 3;      // 9% 概率返回 3 (90+9=99)
            if (random < 99.95) return 4;   // 0.95% 概率返回 4 (99+0.95=99.95)
            return 5;   
        }
        feijbNode.getComponent(cc.Sprite).spriteFrame = this.sprites_jb[randomFunc()]
        return feijbNode;
    },

    removeJbNode: function (feijbNode) {
        if (feijbNode == null) {
            LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
            return;
        }
        // feijbNode.destroy();
        feijbNode.setPosition(0, 0);
        this.jbPool.put(feijbNode);
    },

    btnClick: function (button) {
        let pos = button.node.getPosition()
        let btnName = button.node.name;
        LoggerUtil.getInstance().log("点击的button节点名：", btnName);
        if (btnName == "btn_shop") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showSmallAddCash()
        } else if (btnName == "btn_wf") {
            let rule = this.node.getChildByName("rule");
            if(!rule) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                let pab_rule = cc.instantiate(this.pab_rule);
                this.node.addChild(pab_rule);
            }
        } else if(btnName == "btn_sound") {
            CommonFun.getInstance().showGameSetting(2);
        } 
        else if (btnName == "btn_playersAll") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let playList = cc.instantiate(this.pab_playerlist);
            let ctrl = playList.getComponent("mtpPlayerListCtrl")
            ctrl.reqPlayerlist(0, 12);
            this.node.addChild(playList);
        }
        else if ( btnName == "btn_openMenu") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {}});
        } 
        else if (btnName == "btn_10") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 10;
            this.choiceBetButton(button);
        } else if (btnName == "btn_50") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 50;
            this.choiceBetButton(button);
        } else if (btnName == "btn_100") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 100;
            this.choiceBetButton(button);
        } else if (btnName == "btn_500") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 500;
            this.choiceBetButton(button);
        } else if (btnName == "btn_1000") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 1000;
            this.choiceBetButton(button);
        } else if (btnName == "btn_5000") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.userBtnCion = 5000;
            this.choiceBetButton(button);
        } else if (btnName == "btn_01") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(1);
        } else if (btnName == "btn_02") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(2);
        } else if (btnName == "btn_03") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(3);
        } else if (btnName == "btn_04") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(4);
        } else if (btnName == "btn_05") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(5);
        } else if (btnName == "btn_06") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.clickVIPuP(6);
        } else if (btnName == "node_1") {                  //下注区域 0
            if (this.betBtnState == true) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            }
            this.betting(this.userBtnCion, 0);
        } else if (btnName == "node_2") {
            if (this.betBtnState == true) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            }
            this.betting(this.userBtnCion, 1);
        } else if (btnName == "node_3") {
            if (this.betBtnState == true) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            }
            this.betting(this.userBtnCion, 2);
        } else if (btnName == "node_4") {
            if (this.betBtnState == true) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            }
            this.betting(this.userBtnCion, 3);
        } else if (btnName == "btn_repeatBet") {          //重复上局下注
            if (this.betBtnState == true) {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.repeatBet();
            }

        }
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.login") {                                // 登录游戏
            self.setLoginInfo(notify);
        } else if (msgId === "gameservice.gamescene") {                     // 刚进入游戏后游戏场景信息
            self.setGameScene(notify);
        } else if (msgId === "gameservice.callnotify") {                    // vip发射广播，这里普通用户就自己ack vip用户就广播
            self.resolveCallNotify(notify);
        } else if (msgId === "gameservice.gamestartnotify") {               // 游戏开始
            self.isGameEndStatus = false;
            self.setGameStart(notify);
        } else if (msgId === "gameservice.gameendnotify") {                 // 游戏结果
            self.isGameEndStatus = true;
            self.resolveGameEndNotify(notify);
        } else if (msgId === "gameservice.joinvipnotify") {                 // vip入座进入
            self.setJoinVipNotify(notify);
        } else if (msgId === "gameservice.leavevipnotify") {                // 玩家离开

        } else if (msgId === "gameservice.exitgame") {                   //退出游戏
            LoggerUtil.getInstance().log("~~~~~~~~~~~~~~退出游戏");
            self.clearSchedule();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
        } else if (msgId === "gameservice.viplist") {                   //VIP列表
            self.updateVipList(notify);
        } 
        else if (msgId === "gameservice.playerlist") {
            LoggerUtil.getInstance().log("palyerList", notify);
            self.lab_playerCount.string = notify.total;
        }
        else if (msgId === "gameservice.playerlist") {
            LoggerUtil.getInstance().log("palyerList", notify);
        } else if (msgId === "gameservice.querygameendinfo") {
            self.setGameEndInfo(notify);
        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN && notify === "GAME_SERVER") {
            // self.sendReqCtrl.loginReq();
        } else if (msgId == "gameservice.shortmessagenotify") {
            self.shortmessagenotify(notify)
        }else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let coin = notify.deposit + notify.winnings;
            self.selfNodeCtrl.setCoin(coin);
        } 
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            let betCoinAll = 0;
            for (let i = 0; i < self.selfBetAmount.length; i++) {
                let element = self.selfBetAmount[i];
                betCoinAll += element
            };
            if (betCoinAll > 0 && self.isGameEndStatus == false) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", () => {
                    self.sendReqCtrl.ExitGameReq();
                }, false);
            } 
            else {
                self.sendReqCtrl.ExitGameReq();
            }
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("munda");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData; 
        if (!notify) {
            let info = {
                errorMessage: `Munda游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    if (result.result == 19) {
                        if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                        else {
                            CommonFun.getInstance().showMsgBox( "Your cash is insufficient, Please recharge in time！", "SHOP", () => {
                                CommonFun.getInstance().showSmallAddCash()
                            }, false);
                        }
                    }
                    else {
                        CommonFun.getInstance().showTips(result.message);
                    };
                };
            }
            else {
                if (result.result == 19) {
                    if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                    else {
                        CommonFun.getInstance().showMsgBox( "Your cash is insufficient, Please recharge in time！", "SHOP", () => {
                            CommonFun.getInstance().showSmallAddCash()
                        }, false);
                    }
                }
                else {
                    CommonFun.getInstance().showTips(result.message);
                };
            };
        }
        else if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
    },

    cashSwitch: function () {
        if(GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = cc.find('Canvas_mtp/btn_shop/Background/icon_chipsshop');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

    setLoginInfo: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("登录的消息为空！", notify);
            return
        }
        if (!notify.config) {
            LoggerUtil.getInstance().error("登录的config消息为空！");
            CommonFun.getInstance().showMsgBox("Connection error " + "\n" + "403", "YES", () => {
                this.sendReqCtrl.ExitGameReq();
            }, false);
            return
        }
        this.selfNodeCtrl.setPlayerInfo(notify.userinfo, true);
        this.mtpAudioCtrl.playGameMusic("bgm");
        // this.setGameConfig(notify.config);
    },

    //登录设置时间
    setGameConfig: function (config) {
        if (config.bettingTime > 0) {
            this.lab_clock.string = config.bettingTime;
            this.node_clock.active = true;
        } else {
            this.node_clock.active = false;
        }
        LoggerUtil.getInstance().log("结算后等待时间：", config.waitTime);
    },

    updateVipList: function (notify) {
        let vipList = notify.list;
        let vipSiteArr = []
        for (let i = 0; i < vipList.length; i++) {
            let userInfo = vipList[i];
            let seat = userInfo.seat;
            vipSiteArr.push(seat);
        }
        for (let i = 0; i < this.userArryNode.length; i++) {
            let playerNode = this.userArryNode[i];
            if (playerNode && playerNode.isValid == true) {
                let playerCtrl = playerNode.getComponent("mtpPlayerCtrl");
                let siteID = playerCtrl.siteID;
                if (vipSiteArr.indexOf(siteID) == -1) {
                    playerNode.destroy();
                }
            }
        }
        for (let i = 0; i < vipList.length; i++) {
            let userInfo = vipList[i];
            let seat = userInfo.seat;
            let playerNode = this.getPlayerNodeBySeatID(seat);
            if (playerNode && playerNode.isValid == true) {
                let playerCtrl = playerNode.getComponent("mtpPlayerCtrl");
                playerCtrl.setPlayerInfo(userInfo, false);
            } else {
                let vipNode = cc.instantiate(this.pab_player);
                let playerCtrl = vipNode.getComponent("mtpPlayerCtrl");
                playerCtrl.setPlayerInfo(userInfo, false);
                vipNode.parent = this.node_playersSeat;
                this.userArryNode[seat] = vipNode;
            }
        }

    },

    setGameScene: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("Munda-服务器返回的GameScene的数据为空！");
            return;
        };
        LoggerUtil.getInstance().log("gamescene===============================> ", notify.remaining);
        let vipList = notify.vipList;
        let requester = notify.requester;
        this.lab_playerCount.string = notify.playerNumber; //玩家数量
        if (requester) {
            GlobalCfg.USER_DATAS.userDiamond = requester.diamond;
            this.selfNodeCtrl.lab_coin.string = CommonFun.getInstance().numberToShow(requester.diamond/100);
        };
        if (notify.first) {
            LoggerUtil.getInstance().log("gamescene----------------------------->");
            this.freshScene();
            this.reConnection();
            let pools = notify.pools;
            if (notify.status == 0) {
                for (let i = 0, len = pools.length; i < len; i++) {
                    let BossPool = pools[i];
                    this.resolveBoosPool(BossPool, true, true);
                }
            }
            else {
                let pools = notify.pools;
                for (let i = 0; i < pools.length; i++) {
                    let BossPool = pools[i];
                    let boss = BossPool.boss?BossPool.boss:0;
                    this.betAllAmount[boss] = BossPool.all;
                    // this.betLabArr[boss].string = BossPool.self / 100 + " / " + BossPool.all / 100;
                    this.betLabArr[boss].string = `${BossPool.all / 100}`;
                    this.betLabSelfArr[boss].string  = `<color=#ffc705>${(BossPool.self?BossPool.self:0) / 100}</color>`;
                }
            };
            for (let i = 0, len = vipList.length; i < len; i++) {
                let item = vipList[i];
                let seat = item.seat;
                let vipNode = cc.instantiate(this.pab_player);
                let playerCtrl = vipNode.getComponent("mtpPlayerCtrl");
                playerCtrl.setPlayerInfo(item, false);
                vipNode.parent = this.node_playersSeat;
                this.userArryNode[seat] = vipNode;
            };
            LoggerUtil.getInstance().log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", vipList)
            this.selfNodeCtrl.setPlayerInfo(notify.requester, true);

            this.initTrend(notify.pools);
        };

        if (notify.status == 0) {
            this.setGameReadyStatus(notify);
        } else if (notify.status == 1) {
            this.setGameResultStatus(notify);
        }
    },

    //游戏中
    setGameReadyStatus: function (notify) {
        let isFirstTime = false;
        let remaining = notify.remaining;
        if (this.tempTime == remaining) {
            isFirstTime = false
        } else {
            isFirstTime = true
        }
        this.tempTime = remaining;
        if (remaining > 10 && remaining < 20 && isFirstTime == true) {
            this.betBtnState = false;
            let time = remaining - 11;
            if (time == 0) {
                this.mtpAudioCtrl.playGameSound("start", false);
                this.startBettingSke.skeletonData = this.ske_start;
                let curScene = cc.director.getScene();
                if (curScene.getChildByName("Tips")) {
                    LoggerUtil.getInstance().log("当前tips存在，执行 tipsCtrl.showConten();");
                    let tipsCtrl = curScene.getChildByName("Tips").getComponent("TipsCtrl");
                    tipsCtrl.showConten();
                }
                this.startBettingSke.node.active = true;
                this.startBettingSke.setAnimation(0, "animation", false);
                this.img_wait.active = false;
                this.img_bet.active = true;
            }
        } else if (remaining <= 10 && isFirstTime == true) {
            let self = this;
            LoggerUtil.getInstance().log("caojun222 ---------=========== this.repeatBetArr ", this.repeatBetArr);
            if (this.repeatBetArr.length > 0) {
                this.mtpBundle.load(`Res/repeat/btn_repeat`, cc.SpriteFrame, function (err, spriteFrame) {
                    if (!err) {
                        self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        self.btn_repeatBet.enabled = true;
                    } else {
                        LoggerUtil.getInstance().error(JSON.stringify(err));
                    }

                });
            } else {
                this.mtpBundle.load(`Res/repeat/btn_newOra_big`, cc.SpriteFrame, function (err, spriteFrame) {
                    if (!err) {
                        self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        self.btn_repeatBet.enabled = false;
                    } else {
                        LoggerUtil.getInstance().error(JSON.stringify(err));
                    }

                });
            }
            this.startBettingSke.node.active = false;
            // this.startBettingSke.skeletonData = null;
            this.betBtnState = true;
            this.lab_clock.string = remaining >=0 ? remaining : 0;
            this.node_clock.active = true;   
            if (remaining < 3 && remaining > 0 && isFirstTime == true) {
                this.mtpAudioCtrl.playGameSound("countDown", false);
            }
            if (remaining <= 1) {
                this.betBtnState = false;
            }
            if (remaining == 0 && isFirstTime == true) {
                LoggerUtil.getInstance().log("此时倒计时为0");
                this.startBettingSke.skeletonData = this.ske_stop;
                let curScene = cc.director.getScene();
                if (curScene.getChildByName("Tips")) {
                    let tipsCtrl = curScene.getChildByName("Tips").getComponent("TipsCtrl");
                    tipsCtrl.showConten();
                }
                this.startBettingSke.node.active = true;
                this.startBettingSke.setAnimation(0, "animation", false);
                this.mtpAudioCtrl.playGameSound("stopBet", false);
                this.img_wait.active = true;
                this.img_bet.active = false;
            }
            this.startBettingSke.setCompleteListener((trackEntry, loopCount) => {
                var name = trackEntry.animation.name;
                if (name == "animation") {
                    this.startBettingSke.node.active = false;
                }
            });
        }
        let pools = notify.pools;
        LoggerUtil.getInstance().log("gameScene中的pools下注信息", pools);
        let isPlaySound = false;
        for (let i = 0, len = pools.length; i < len; i++) {
            let BossPool = pools[i];
            let boss = BossPool.boss?BossPool.boss:0;
            if (BossPool.all > this.betAllAmount[boss] && isPlaySound == false){
                this.mtpAudioCtrl.playGameSound("otherCoin", false);
                isPlaySound = true;
            }
            this.resolveBoosPool(BossPool, false);
        }
        let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond,100)
    },

    //结算中
    setGameResultStatus: function (notify) {
        if (notify.first == true) {
            this.sendReqCtrl.QueryGameEndInfoReq();
        }
        this.node_clock.active = false; 
        let self = this;
        // if (this.repeatBetArr.length <= 0) {
        this.mtpBundle.load(`Res/repeat/btn_newOra_big`, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) {
                self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                self.btn_repeatBet.enabled = false;
            } else {
                LoggerUtil.getInstance().error(JSON.stringify(err));
            }

        });
    },

    //处于结算状态进入游戏显示当前局的骰子结果
    setGameEndInfo: function (notify) {
        let pools = notify.pools;
        for (let i = 0; i < pools.length; i++) {
            let BossPool = pools[i];
            let number = BossPool.number;
            // this.showWinAreaSke(true, boss, number);
            if (number > 0) {
                this.resolveBoosPool(BossPool, true, true);
            }
        }
    },

    /**
     * 处理服务器的BossPool数据，BossPool 即为下注数据
     * @param {Object} BossPool 
     * @param {Boolean} isGameEnd 是否游戏结束
     * @param {Boolean} isFirstEnter 是否第一次连接
     */
    resolveBoosPool: function (BossPool, isGameEnd, isFirstEnter = false) {
        let boss = BossPool.boss?BossPool.boss:0;
        this.selfBetAmount[boss] = BossPool.self;
        let goldCount = this.initTableGlodCount(BossPool.all);
        if (isFirstEnter == true) {
            for (let i = 0; i < goldCount; i++) {
                let jbnode = this.createJbNode();
                let pos = this.randomPos(boss);
                jbnode.setPosition(pos);
                jbnode.parent = this.jinbiParent;
                this.pushToArr(boss, jbnode);
            }
        }
        if (BossPool.all > this.betAllAmount[boss] && isFirstEnter == false) {
            this.playListAnimation();
            let startPos = cc.v2(this.btn_playersAll.node.x, this.btn_playersAll.node.y);
            this.otherBetCallBack = () => {
                let endPos = this.randomPos(boss)
                this.bettingCoin(startPos, endPos, boss, this.jinbiParent);
            }
            this.schedule(this.otherBetCallBack, 0.05, 2, 0);
        }
        this.selfBetNum[boss] = BossPool.self?BossPool.self:0;
        this.betAllAmount[boss] = BossPool.all;
        this.betLabArr[boss].string = `${BossPool.all / 100}`;
        this.betLabSelfArr[boss].string  = `<color=#ffc705>${this.selfBetNum[boss]/ 100}</color>`;
    },

    /**
     * 从数组头部删除数据至指定长度
     * @param {Array} arr 
     * @param {Number} amount 
     * @returns arr
     */
    deleteArrToAmount: function (arr, amount) {
        if (!arr || arr.length == 0) {
            return [];
        };
        if (arr.length > amount) {
            arr.splice(0, arr.length - amount);
            return arr;
        } else {
            return arr;
        }
    },


    // 处理下注消息
    resolveCallNotify: function (notify) {
        let playerid = notify.playerId;
        let seat = notify.seat;
        let boss = notify.boss;
        let afterGold = notify.after;       //下注之后的金币数目
        LoggerUtil.getInstance().log("caojun resolveCallNotify notify ", notify);
        if (playerid == this.selfNodeCtrl.getPlayerid()) {          //表示玩家自己
            this.mtpAudioCtrl.playGameSound("touCoin", false);
            this.upAnimation(this.selfNodeCtrl.node);
            let startPos = cc.v2(-650, -304);
            let count = this.setCount(notify.amount);
            this.selfBetCallBack = () => {
                let endPos = this.randomPos(boss);
                this.bettingCoin(startPos, endPos, boss, this.jinbiParent);
            }
            this.schedule(this.selfBetCallBack, 0.05, count - 1, 0);
            this.selfNodeCtrl.setCoin(afterGold, true);
            if (this.hasDown) {
                this.betRoundCount = 0;
                let playerCtrl = this.getPlayerInfoByUserId(this.downSite);
                playerCtrl && playerCtrl.setCoin(afterGold);
            }
        } else {                    //VIP 座位
            this.mtpAudioCtrl.playGameSound("otherCoin", false);
            let playerCtrl = this.getPlayerInfoByUserId(seat);
            if (playerCtrl) {
                this.upAnimation(playerCtrl.node, cc.find(`Canvas_mtp/node_players/btn_0${seat}`));
                let startPos = playerCtrl.getVipNodePos(seat);
                this.vipBetCallBack = () => {
                    let endPos = this.randomPos(boss);
                    this.bettingCoin(startPos, endPos, boss, this.jinbiParent);
                }
                this.schedule(this.vipBetCallBack, 0.05, 5, 0);
                playerCtrl.setCoin(afterGold);
            }
            
        }

    },

    // 玩家发送表情
    shortmessagenotify: function (notify) {
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
            let playScript = this.getPlayerInfoByUserId(target);
            playScript.face(notify);
        } 
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = this.getPlayerInfoByUserId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            }else{
                senderCtrl.setCoin(senderAfter)
                if(senderCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()){
                    this.selfNodeCtrl.setCoin(senderAfter, true);
                }
            }

            if (target == -1) {
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let userNode = this.userArryNode[i];
                    if (userNode) {
                        let userInfoCtrl = userNode.getComponent('mtpPlayerCtrl');
                        if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
                            targetNodeArr.push(userNode);
                        };
                    };
                };
            }
            else {
                let playersCtrl = this.getPlayerInfoByUserId(target);
                if (playersCtrl) {
                    targetNodeArr.push(playersCtrl.node);
                };
            };
            CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
        };
    },

    //游戏开始
    setGameStart: function (notify) {
        this.freshScene();
        LoggerUtil.getInstance().log("收到gamestartnotify，游戏开始");
        this.sendReqCtrl.VipListReq();
    },

    initTrend: function (pools) {
        this.content_trend.removeAllChildren();
        this.trendObjArr = []
        for (let i = 0; i < 8; i++) {
            let trendItem = cc.instantiate(this.item_trend);
            trendItem.active = false;
            trendItem.setPosition(0, 0);
            this.content_trend.addChild(trendItem);
            let trend = this.getTrendItem(trendItem);
            this.trendObjArr.push(trend)
        }
        this.setTrend(pools)
    },

    getTrendItem:function(node){
        let obj = {}
        obj.obj = node;
        obj.trendArr = []; //记录历史
        obj.setData = function(pools, index, sprites_trend){
            obj.obj.active = true;
            for (let i = 0; i < 4; i++) {
                let BossPool = pools[i];
                obj.obj.getChildByName("node" + i).getComponent(cc.Sprite).spriteFrame = BossPool.history[index] == 0 ? sprites_trend[1]: sprites_trend[0];
            }
        }
        return obj;
    },

    //设置历史记录
    setTrend: function (pools) {
        let length = pools[0].history.length > 8 ? 8 : pools[0].history.length;
        for (let i = 0; i < length; i++) {
            this.trendObjArr[i].setData(pools, i, this.sprites_trend);
        }
    },

    //游戏结果
    resolveGameEndNotify: function (notify) {
        LoggerUtil.getInstance().log("游戏结算---------===========", this.selfBetAmount);
        let betCount = 0;
        for (let i = 0; i < this.selfBetAmount.length; i++) {
            let element = this.selfBetAmount[i];
            betCount += element;
        }
        this.curRoundBet = betCount;
        if (this.hasDown) {
            if (betCount <= 0) {
                this.betRoundCount++;
            } else {
                this.betRoundCount = 0;
            }
        }
        if (this.betRoundCount > 3) {
            this.sendReqCtrl.JoinVipReq(this.downSite, 2);
        };

        LoggerUtil.getInstance().log("caojun---------=========== this.selfBetAmount ", this.selfBetAmount);

        this.repeatBetArr.length = 0;
        for (let i = 0; i < this.selfBetAmount.length; i++) {
            let element = this.selfBetAmount[i];
            if (element > 0) {
                this.repeatBetArr.push({ type: i, count: element });
            }
        }
        LoggerUtil.getInstance().log("caojun---------=========== this.repeatBetArr ", this.repeatBetArr);

        let self = this;
        this.scheduleOnce(()=>{
            self.cradAct(self.cardArr[0], self.paixArr[0], notify.zhuangCards, "isAct", notify.zhuangCardSuit);
            self.scheduleOnce(()=>{
                for (let i = 0; i < notify.pools.length; i++) {
                    self.cradAct(self.cardArr[i+1], self.paixArr[i+1], notify.pools[i].cards, "isAct", notify.pools[i].CardSuit);
                }
                //所有牌翻完之后，进入结算
                self.scheduleOnce(()=>{
                    self.settlement(notify);
                }, 1.5);
            }, 1.5);
            
        }, 1.5);
    },

    //结算
    settlement: function (notify) {
        let pools = notify.pools;                        //结算信息
        this.loseAreaCount = 0;
        this.mtpAudioCtrl.playGameSound("jbrecover", false);
        this.mtpAudioCtrl.playGameSound("win", false);
        this.loseAreaCount = 0;
        for (let i = 0; i < pools.length; i++) {
            let BossPool = pools[i];
            let boss = BossPool.boss?BossPool.boss:0;
            let number = BossPool.number;
            if (number && number > 0) {
                this.showWinAreaSke(true, boss, number);
            } else {
                this.loseAreaCount ++;
                this.moveToZhuang(this.goldAllArr[boss], notify);
            }
        }
        if (this.loseAreaCount == 0) { //全赢
            this.moveToPlayer(notify);
        }
        //显示牌型
        this.setTrend(pools);
    },

    //游戏结束后显示牌型
    cradAct:function(cardArr, paix, cards, str, paixIndex) {
        let arr = cards;
        for (let i = 0; i < 3; i++) {
            let cradNode = cardArr.getChildByName(""+ (i+1));
            let cradScrpit = cradNode.getComponent("mtpCradCtrl");
            // cradScrpit.initCardInfo();
            if(str == "isAct") {
                cc.tween(cradNode)
                .tag(1)
                .delay(i*0.2)
                .to(0.25, { scaleX:0})
                .call(() => {  
                    cradScrpit.setCardInfo(arr[i])
                    if (i == 2) {
                        paix.active = true;
                        paix.getChildByName("img_paix").getComponent(cc.Sprite).spriteFrame = this.paixSFArr[paixIndex - 1];
                    }
                })
                .to(0.25,{ scaleX:1})
                .start()
            }else{
                cradScrpit.setCardInfo(arr[i])
            }
        }
    },

    /**
     * 
     * @param {Boolean} isShow 是否展示
     * @param {Number} boss  区域编号
     * @returns 
     */
    showWinAreaSke: function (isShow, boss) {
        if (typeof isShow != "boolean" || typeof boss != "number") {
            LoggerUtil.getInstance().error("方法 showWinAreaSke 传入参数错误！！", typeof isShow, typeof boss);
            return
        }
        let win_light = this.betAreaArr[boss].node.getChildByName("win_light").getComponent(sp.Skeleton);
        let win = this.betAreaArr[boss].node.getChildByName("win").getComponent(sp.Skeleton);
        if (isShow == false) {
            win_light.node.active = false;
            win.node.active = false;
        } else {
            win_light.node.active = true;
            win_light.setAnimation(0, "animation", true);
            win.node.active = true;
            win.setAnimation(0, "open", false);
        }
    },

    //VIP 上下座相关消息处理
    setJoinVipNotify: function (notify) {
        let act = notify.act;       //Vip 进出的标识，1/2/3，进/出/换座
        let userinfo = notify.user;
        let vipSite = userinfo.seat;
        let oldSite = notify.oldSeat;
        let playerid = userinfo.playerId;
        let selfid = this.selfNodeCtrl.getPlayerid()
        LoggerUtil.getInstance().log("VIP玩家Join广播", `类型${act}`, `座位号${vipSite}`, `oldSite${oldSite}`);
        let playerNode = cc.instantiate(this.pab_player);
        let playerCtrl = playerNode.getComponent("mtpPlayerCtrl");
        // 1 上座  2 下座  3 换座
        switch (act) {
            case 1:
                if (playerid == selfid) {
                    this.hasDown = true;
                    this.downSite = vipSite;
                }
                this.leaveSiteList(userinfo.playerId);
                playerCtrl.setPlayerInfo(userinfo);
                playerNode.parent = this.node_playersSeat;
                this.userArryNode[vipSite] = playerNode;
                break;
            case 2:
                if (playerid == selfid) {
                    this.hasDown = false;
                }
                this.leaveSiteList(userinfo.playerId);
                break;
            case 3:
                this.leaveSiteList(userinfo.playerId);
                if (playerid == selfid) {
                    this.hasDown = true;
                    this.downSite = vipSite;
                }
                playerCtrl.setPlayerInfo(userinfo);
                playerNode.parent = this.node_playersSeat;
                this.userArryNode[vipSite] = playerNode;
                break;
            default:
                break;
        }

    },

    /**
     * 根据playerid删除VIP节点
     * @param {Number} id PlayerId
     */
    leaveSiteList: function (id) {
        for (let i = 0; i < this.userArryNode.length; i++) {
            let playerNode = this.userArryNode[i];
            if (playerNode && playerNode.isValid == true) {
                let playerCtrl = playerNode.getComponent("mtpPlayerCtrl");
                let sitePlayerId = playerCtrl.getPlayerid();
                if (id == sitePlayerId) {
                    this.userArryNode[i] = null;
                    playerNode.destroy();
                }
            }
        }
    },

    /**
     * 下注金币
     * @param {cc.v2()} startPos 
     * @param {cc.v2()} endPos 
     * @param {Number} boss 
     * @param {cc.Node} parentNode 
     */
    bettingCoin: function (startPos, endPos, boss, parentNode) {
        let jbnode = this.createJbNode();
        if (!jbnode) {
            LoggerUtil.getInstance().error("--------------下注金币-----");
            return;
        }
        // parentNode.addChild(jbnode);
        // LoggerUtil.getInstance().log(parentNode, "-----------------!!!!!!!", jbnode);
        jbnode.setPosition(startPos);
        jbnode.parent = parentNode;
        cc.tween(jbnode)
            .tag(2)
            .to(0.25, { position: endPos })
            .call(() => {
                this.pushToArr(boss, jbnode);
            })
            .start();
    },

    pushToArr(boss, node) {
        if (this.goldAllArr[boss].length >= 280) {
            // 限制每个区域最多280个金币（超出则移除最早的）
            let jbNode = this.goldAllArr[boss].shift();
            this.removeJbNode(jbNode); // 回收到对象池
        }
        this.goldAllArr[boss].push(node); // 存入新金币
    },

    moveToZhuang: function (loseArr, notify) {
        // let loseArr = this.goldAllArr[type];
        if (Array.isArray(loseArr) == false || loseArr.length == 0) {
            return
        }
        for (let i = loseArr.length - 1; i >= 0; i--) {
            let jbnode = loseArr[i];
            let index = i;
            cc.tween(jbnode)
                .tag(3)
                .delay(Math.random() * 0.45)
                .to(0.3, { position: cc.v2(this.zhuangPosX, this.zhuangPosY) })
                .call(() => {
                    this.removeJbNode(jbnode)
                    loseArr.splice(index, 1);
                    if (index == 0) {
                        loseArr.length = 0;
                        this.loseAreaCountArr.push(true);
                        this.moveToWinArea(notify);
                    }
                })
                .delay(1.5)
                .start();
        };
    },

    moveToWinArea(notify) {
        LoggerUtil.getInstance().log(`this.loseAreaCountArr.length: ${this.loseAreaCountArr.length}此时的  this.loseAreaCount：${this.loseAreaCount}`);
        if (this.loseAreaCountArr.length != this.loseAreaCount) {
            LoggerUtil.getInstance().log("金币尚未移动完毕-------等待------");
            return
        }
        this.mtpAudioCtrl.playGameSound("moveToArea", false);
        let pools = notify.pools;
        let moveFun = (boss) => {
            let count = 40;                 //从庄家飞往每个区域的金币数目
            let isMoveToPlayer = false;      // 是否调用移动到玩家方法
            let startPos = cc.v2(this.zhuangPosX, this.zhuangPosY);
            let index = 0;
            for (let j = 0; j < count; j++) {
                let jbnode = this.createJbNode();
                jbnode.setPosition(startPos);
                jbnode.parent = this.jinbiParent;
                let endPos = this.randomPos(boss);
                cc.tween(jbnode)
                    .tag(4)
                    .delay(Math.random() * 0.5)
                    .to(0.3, { position: endPos })
                    .call(() => {
                        this.goldAllArr[boss].push(jbnode);
                        // this.pushToArr(boss, jbnode);
                        index++;
                        if (index == count) {
                            if(isMoveToPlayer == false){
                                LoggerUtil.getInstance().log("======================", index);
                                this.moveToPlayer(notify);
                                isMoveToPlayer = true;
                            }
                        }
                    })
                    .start();
            }
        };
        for (let i = 0; i < pools.length; i++) {
            let BossPool = pools[i];
            let boss = BossPool.boss?BossPool.boss:0;
            let number = BossPool.number;
            if (number == null || number < 1) {
                continue
            } else {
                moveFun(boss);
            }

        }
    },

    moveToPlayer: function (notify) {
        let pools = notify.pools;
        for (let i = 0; i < pools.length; i++) {
            let BossPool = pools[i];
            if (BossPool.number > 0) {
                let boss = BossPool.boss?BossPool.boss:0;
                this.moveToPlayerByBoss(boss, notify);
            }
        }
        let selfResult = notify.selfResult;
        this.selfNodeCtrl.setCoin(selfResult.after, true);
        this.curRoundAddCoinFinish();
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betAmountList[0] || 0;
            minLimit *= 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    moveToPlayerByBoss: function (boss, notify) {
        let vipList = notify.vipResult;
        let selfResult = notify.selfResult;
        let goldArr = this.goldAllArr[boss];
        if (selfResult.score > 0) {
            LoggerUtil.getInstance().log("自己赢钱----------",selfResult.score);
            this.selfNodeCtrl.setWinNum(selfResult.score);
            let selfWinJbArr = goldArr.splice(0, 15);
            let posSelf = cc.v2(-343, -304);
            for (let i = selfWinJbArr.length - 1; i >= 0; i--) {
                let tempIndex = i;
                cc.tween(selfWinJbArr[tempIndex])
                    .tag(5)
                    .delay(Math.random() * 0.5)
                    .to(0.3, { scale: 1, position: posSelf })
                    .call(() => {
                        this.removeJbNode(selfWinJbArr[tempIndex])
                    })
                    .start();
            }
        }
        for (let i = 0; i < vipList.length; i++) {
            let calcResult = vipList[i];
            let seat = calcResult.seat;
            if (seat > 0) {
                let vipPlayerScript = this.getPlayerInfoByUserId(seat);
                vipPlayerScript && vipPlayerScript.setCoin(calcResult.after);
                if (calcResult.score > 0 && vipPlayerScript) {
                    vipPlayerScript.setWinNum(calcResult.score);
                    let endPos = vipPlayerScript.getVipNodePos(seat);
                    let tempArr = goldArr.splice(0, 15);
                    for (let i = tempArr.length - 1; i >= 0; i--) {
                        let jbNode = tempArr.pop();
                        cc.tween(jbNode)
                            .tag(6)
                            .delay(Math.random() * 0.5)
                            .to(0.3, { scale: 1, position: endPos })
                            .call(() => {
                                this.removeJbNode(jbNode)
                            })
                            .start();
                    }

                }
            } else {
                if (goldArr.length > 0) {
                    let pos = this.btn_playersAll.node.position;
                    this.mtpAudioCtrl.playGameSound("jbrecover", false);
                    let tempIndex = 0,len = goldArr.length;
                    for (let i = goldArr.length - 1; i >= 0; i--) {
                        let jbNode = goldArr.pop();
                        cc.tween(jbNode)
                            .tag(7)
                            .delay(Math.random() * 0.5)
                            .to(0.3, { scale: 1, position: pos })
                            .call(() => {
                                tempIndex++;
                                this.removeJbNode(jbNode)
                            })
                            .start();
                    }
                }
            }
        }
    },

    //重复上局下注
    repeatBet: function () {
        let amount = 0;
        for (let i = 0; i < this.repeatBetArr.length; i++) {
            let item = this.repeatBetArr[i];
            amount += parseInt(item.count / 100);
        }
        LoggerUtil.getInstance().log(`当前阶段重复下注金额: ${amount}`);
        if (GlobalCfg.USER_DATAS.userDiamond < amount * 100) {
            if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
            else {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
            }
        } else {
            this.currentBetNum = this.getCurrentBetNum();
            let repeatBetNum = 0;
            for (let i = 0; i < this.repeatBetArr.length; i++) {
                repeatBetNum += this.repeatBetArr[i].count;
            }
            if (this.currentBetNum + repeatBetNum > this.limitMaxBetNum) {
                CommonFun.getInstance().showMsgBox(this.tipsLabel[3], "YES", () => { }, false);
                    return
            }
            for (let i = 0; i < this.repeatBetArr.length; i++) {
                let item = this.repeatBetArr[i];
                this.sendReqCtrl.callReq(parseInt(item.count / 100), item.type);
            }
            this.repeatBetArr.length = 0;
            let self = this;
            this.mtpBundle.load(`Res/repeat/btn_newOra_big`, cc.SpriteFrame, function (err, spriteFrame) {
                if (!err) {
                    self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    self.btn_repeatBet.enabled = false;
                } else {
                    LoggerUtil.getInstance().error(JSON.stringify(err));
                }

            });
        }
    },
    

    //下注玩家头像跳动
    upAnimation: function (nodeplayer, nodeButton = null) {
        let ctrl = nodeplayer.getComponent("mtpPlayerCtrl");
        if (ctrl == null) {
            cc.tween(nodeplayer)
                .tag(8)
                .to(0.1, { position: cc.v2(nodeplayer.x, this.playerSelfY + 15) })
                .to(0.1, { position: cc.v2(nodeplayer.x, this.playerSelfY) })
                .start();
            if(nodeButton){
                cc.tween(nodeButton)
                .tag(9)
                .to(0.1, { position: cc.v2(nodeplayer.x, this.playerSelfY + 15) })
                .to(0.1, { position: cc.v2(nodeplayer.x, this.playerSelfY) })
                .start();
            }
            return;
        }
        let nodeX = ctrl.posX;
        let nodeY = ctrl.posY;
        cc.tween(nodeplayer)
            .tag(8)
            .to(0.1, { position: cc.v2(nodeX, nodeY + 15) })
            .to(0.1, { position: cc.v2(nodeX, nodeY) })
            .start();
        if(nodeButton){
            cc.tween(nodeButton)
            .tag(9)
            .to(0.1, { position: cc.v2(nodeX, nodeY + 15) })
            .to(0.1, { position: cc.v2(nodeX, nodeY) })
            .start();
        }
    },

    playListAnimation: function () {
        let nodeX = this.btn_playersAll.node.x;
        let nodeY = this.btn_playersAll.node.y;
        cc.tween(this.btn_playersAll.node)
            .tag(10)
            .to(0.1, { position: cc.v2(this.btn_playersAll.node.x, nodeY + 15) })
            .to(0.1, { position: cc.v2(nodeX, nodeY) })
            .start();
    },

    // 点击上VIP按钮
    clickVIPuP: function (siteID) {
        let mysiteID = null;
        this.hasDown = this.checkSelfInVip();
        mysiteID = this.downSite;

        LoggerUtil.getInstance().log("点击VIP按钮：", this.hasDown, `点击的siteID${siteID}`);


        if (this.hasDown && mysiteID == siteID) {
            CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", () => {
                this.sendReqCtrl.JoinVipReq(siteID, 2)
            }, false);
            return;
        };

        let ctrl = this.getPlayerInfoByUserId(siteID);
        if (ctrl && ctrl.siteID == siteID) {
            CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!"); 
            return;
        }; 

        let act = this.hasDown ? 3 : 1;

        if (CommonFun.getInstance().isOpenVipModule()) {
            if (GlobalCfg.USER_DATAS.userVip.level == 0) {
                CommonFun.getInstance().showFirstRecharge();
                return;
            };

            let isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
            if (isCanSitVipSeat) {
                this.sendReqCtrl.JoinVipReq(siteID, act);
                return;
            };
            
            CommonFun.getInstance().showVipUpgradeToast();
            return;
        };


        if (GlobalCfg.USER_DATAS.userDiamond <= 10000) {
            if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
            else {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", () => {          
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
            }
            return;
        };

        this.sendReqCtrl.JoinVipReq(siteID, act);
    },

    // 在VIP列表中找自己
    getVIPistMe:function(){
        let playerNode = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if (userNode ) {
                let playerCtrl = userNode.getComponent('mtpPlayerCtrl');
                if (playerCtrl && playerCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()) {
                    playerNode = playerCtrl.siteID;
                    break;
                }
            } 
        }
        return playerNode
    },

    /**
     * 再次判断VIP节点中有没有自己（playerID相等）
     * @returns 
     */
    checkSelfInVip: function () {
        for (let i = 0; i < this.userArryNode.length; i++) {
            let playerNode = this.userArryNode[i];
            if (playerNode && playerNode.isValid == true) {
                let playerCtrl = playerNode.getComponent("mtpPlayerCtrl");
                if (playerCtrl && playerCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()) {
                    this.downSite = playerCtrl.siteID;
                    return true
                }
            }
        }
        return false
    },

    /**
     * 根据用户座位ID获取用户控制脚本
     * @param {Number} siteID 
     * @returns 
     */
    getPlayerInfoByUserId: function (siteID) {
        let playerInfo = null;
        if (siteID == 0) { return this.selfNodeCtrl }
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if (userNode && userNode.name != '') {
                let userInfoCtrl = userNode.getComponent('mtpPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.siteID === siteID) {
                    playerInfo = userInfoCtrl;
                    break;
                }
            }
        }
        return playerInfo;
    },

    /**
     * 根据用户座位ID返回玩家节点
     * @param {Number} siteID 
     * @returns 
     */
    getPlayerNodeBySeatID: function (siteID) {
        let playerNode = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if (userNode && userNode.name != '') {
                let userInfoCtrl = userNode.getComponent('mtpPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.siteID === siteID) {
                    playerNode = userNode;
                    break;
                }
            }
        }
        return playerNode;
    },

    randomPos: function (boss) {
        let posx = 0;
        let posy = 0;
        let v2 = 0;
        let setRandom = function (min, max) {
            return Math.random() * (max - min) + min;
        }
        switch (boss) {
            case 0:
                posx = setRandom(-209, -427);
                posy = setRandom(69, -23);
                break;
            case 1:
                posx = setRandom(427, 209);
                posy = setRandom(69, -23);
                break;
            case 2:
                posx = setRandom(-209, -427);
                posy = setRandom(-118, -210);
                break;
            case 3:
                posx = setRandom(427, 209);
                posy = setRandom(-118, -210);
                break;
            default:
                break;
        }
        v2 = cc.v2(posx, posy);
        return v2

    },

    setCount: function (number) {
        if (number >= 1000 && number < 2000) {
            return 1;
        } else if (number >= 2000 && number < 5000) {
            return 2;
        } else if (number >= 5000 && number < 10000) {
            return 3;
        } else if (number >= 10000 && number < 20000) {
            return 5;
        } else if (number >= 20000 && number < 50000) {
            return 6;
        } else if (number >= 50000 && number < 100000) {
            return 8;
        } else if (number >= 100000 && number < 200000) {
            return 10;
        } else if (number >= 200000 && number < 500000) {
            return 12;
        } else if (number >= 500000) {
            return 15;
        } else {
            return 1;
        }
    },

    initTableGlodCount: function (number) {
        if (number < 100000) {
            return parseInt(number / 1000);
        } else {
            return 100;
        }
    },

    getCurrentBetNum: function () {
        let num = 0;
        for (let i = 0; i < this.selfBetAmount.length; i++) {
            num += Number(this.selfBetAmount[i]);
        }
        return num;
    },

    //下注
    betting: function (amount, type) {
        this.currentBetNum = this.getCurrentBetNum();
        LoggerUtil.getInstance().log("betting betBtnState：" + this.betBtnState);
        if (this.betBtnState == true) {
            if(GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
            } else if (GlobalCfg.USER_DATAS.userDiamond < amount * 100) {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
            } else {
                LoggerUtil.getInstance().log(`当前下注的数目：${this.currentBetNum}`);
                if (this.currentBetNum + amount * 100 > this.limitMaxBetNum) {
                    CommonFun.getInstance().showMsgBox(this.tipsLabel[3], "YES", () => { }, false);
                    return
                }
                this.sendReqCtrl.callReq(amount, type);
            }
        } else {
            if (this.startBettingSke.node.active == false) {
                CommonFun.getInstance().showTips(this.tipsLabel[2]);
            }
        }
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        this.unschedule(this.scheduleBetSpineTimeCallback);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandle1);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_MUNDA_GAME);
    },

    choiceBetButton: function (button){
        let scale = 1.1;
        let btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_500, this.btn_1000, this.btn_5000];
        let btnName = button.node.name;
        this.node_btnGuangQuan.setScale(scale);
        for (let i = 0; i < btnArr.length; i++) {
            let btn = btnArr[i];
            if(btn.node.name == btnName){
                btn.node.setScale(scale);
            }else{
                btn.node.setScale(1);
            }
            let widget = btn.node.getComponent(cc.Widget);
            if(widget){
                widget.updateAlignment();
            }
        }
        let pos = button.node.getPosition();
        this.node_btnGuangQuan.setPosition(pos.x, pos.y + 3.5);
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_500, this.btn_1000, this.btn_5000];
        let len = btnArr.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = btnArr[i].node.getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        }
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },

    update: function (dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
    },
});
