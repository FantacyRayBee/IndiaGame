cc.Class({
    extends: cc.Component,

    properties: {
        btnList: [cc.Button],
        btnRepeat: cc.Button,
        lab_danzhu: cc.Label,
        lab_dizhuList: [cc.Label],      //左、右、中的自己、其他人的底注
        lab_rateList: [cc.Label],       //左、右、中的比率
        atlasPlist: cc.SpriteAtlas,
        pab_jb: cc.Prefab,
        pab_historyScore: cc.Prefab,     //历史记录（上几局的骰子数目）
        pab_playerlist: cc.Prefab,          //同场玩家列表
        vipPlayers: [cc.Node],
        winCheckMaskArr: [cc.Sprite],
        saizhong: cc.Node,
        saizi: cc.Node,
        skeletonDataList: [sp.SkeletonData],
        saiziAtlas: cc.SpriteAtlas,
        node_tip: cc.Node,
        nodeJb: cc.Node,
        btn_openMenu: cc.Button,
    },

    ctor() {
        this.isPlayAudio = true                                // 是否播放下注英语
        this.myBetCion = false                                   // 自己下注金额 用于退出游戏提示
        this.danzhuNum = 0;
        this.danzhuNumArr = [];                             //单注金额数组
        this.historiesScoreArr = [];                        //存放历史记录
        this.vipPlayerScriptArr = [];                       // 所有vip座位的脚本
        this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
            "Sorry, there are not enough gold coins.", //金币不足请充值
            "In the game, unable to exit",                              // 游戏中无法退出
            "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
            "non betting stage",                     //请选择下注的范围
            "Upper limit of betting amount！"  //投注金额上限！
        ];
        this.currentBetNum = 0;
        this.limitMaxBetNum = 3000000;          //下注上限
        this.gameTime = 0;                                // 游戏时长
        this.settlementTime = 0;                          // 结算时长
        this.leftGoldArr = [];
        this.midGoldArr = [];
        this.rightGoldArr = [];
        this.winGoldArr = [];
        this.choiceState = "";
        this.moveToZhuangState = false;
        this.xiaZhuState = true;
        this.hasDown = false;           //已经坐下（true），未上座（false）
        this.downSite = 0;
        this.moveJbNumber = 10;
        this.leftAllamount = 0;
        this.midAllamount = 0;
        this.rightAllamount = 0;
        this.jbAudioState = true;
        this.tempTime = 0;          //用来甄别是不是同一秒钟的两次消息
        this.isGameEndStatus = false;
        this.roundBet = 0;         // 自己当前回合下注值
        this.repeatData = {};         // 重复下注数据
        this.curRoundBetData = {};    // 当前回合下注数据
    },

    onLoad() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_UPDOWN_GAME);


        GlobalCfg.ACT_SCENE_CTRL = this;
        GlobalCfg.SMALL_GAME_DATAS.upDownData.upThisCtrl = this;
        this.lab_playerCount = this.btnList[3].node.getChildByName("playerCount").getChildByName("lab").getComponent(cc.Label);
        this.historyLayout = this.node.getChildByName("historyLayout");                         //历史记录，最多放 9 个
        this.saizi1 = this.node.getChildByName("saizi1");
        this.saizi2 = this.node.getChildByName("saizi2");
        this.saiziSprite_1 = this.saizi1.getComponent(cc.Sprite);
        this.saiziSprite_2 = this.saizi2.getComponent(cc.Sprite);
        this.saiziSprite_1.node.active = false;
        this.saiziSprite_2.node.active = false;
        this.saizhongSke = this.saizhong.getComponent(sp.Skeleton);
        this.saiziSke = this.saizi.getComponent(sp.Skeleton);
        this.beginSke = this.node.getChildByName("beginGame").getComponent(sp.Skeleton);
        this.beginSke.node.active = false;
        this.paymentSwitch = false
        this.lab_tip = this.node_tip.getChildByName("lab_djs").getComponent(cc.Label);
        this.initAll();
        for (let i = 0, j = this.btnList.length; i < j; i++) {
            this.btnList[i].node.on("click", this.btnClick, this);
        }
        this.btnRepeat.node.on("click", this.btnClick, this);
        this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.cashSwitch();
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    
        this.scheduleOnce(() => {
            this.upDownAudioCtrl.playGameMusic("7up");
        },0.1)
    },

    start() {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: GlobalCfg.PRODUCT_ID //平台ID
        });
    },

    initAll: function () {
        this.initLabState();
        this.initLabDanzhu();
        this.initJbPool();
        this.initAudioScript();
        this.initScript();
        this.initBtnState();                                //获胜的区域发光效果取消
        this.setXiaZhuBtn(false);                           //设置下注的按钮不交互
    },

    freshState: function () {
        this.leftGoldArr = [];
        this.midGoldArr = [];
        this.rightGoldArr = [];
        this.winGoldArr = [];
        this.initBtnState();
        this.saiziSprite_1.node.active = false;
        this.saiziSprite_2.node.active = false;
        this.historyLayout.removeAllChildren();
        this.nodeJb.removeAllChildren();
        this.clearSchedule();
        this.initScript();
        this.initLabDanzhu();
        for (let i = 0; i < this.vipPlayerScriptArr.length; i++) {
            this.vipPlayerScriptArr[i].vipLeave();
        }
        this.hasDown = false;
        this.reqRecordList();           //请求历史记录
    },

    clearSchedule: function () {
        this.unschedule(this.otherPlayer);
        this.unschedule(this.moveShaizi);
        this.unschedule(this.feiJbCallBack)
    },

    initScript: function () {
        this.vipPlayerScriptArr = [];
        this.userInfoCtrl = this.node.getChildByName('node_userinfo').getComponent('7upUserInfoCtrl');
        for (let i = 0, len = this.vipPlayers.length; i < len; i++) {
            let vipPlayerNode = this.vipPlayers[i];
            if (vipPlayerNode) {
                let vipPlayerScript = vipPlayerNode.getComponent("7upVIPUserCtrl");
                vipPlayerScript.setSiteID(i + 1);
                this.vipPlayerScriptArr.push(vipPlayerScript);
            }

        }
    },

    initAudioScript: function () {
        this.upDownAudioCtrl = this.node.getChildByName('bg').getComponent("7upAudioCtrl");
        this.upDownAudioCtrl.inite();
        GlobalCfg.SMALL_GAME_DATAS.upDownData.audioCtrl = this.upDownAudioCtrl;
    },

    initBtnState: function () {
        this.checkmark_left = this.btnList[10].node.getChildByName("checkmark");
        this.checkmark_mid = this.btnList[11].node.getChildByName("checkmark");
        this.checkmark_right = this.btnList[12].node.getChildByName("checkmark");
        this.checkmark_left.active = false;
        this.checkmark_mid.active = false;
        this.checkmark_right.active = false;
        this.node_tip.active = false;
        this.lab_tip = this.node_tip.getChildByName("lab_djs").getComponent(cc.Label);
    },

    initLabDanzhu: function () {
        if (this.danzhuNumArr.length !== 0) {
            this.lab_danzhu.string = parseInt(this.danzhuNumArr[0] / 100);
            this.danzhuNum = 0;
            this.btnList[4].interactable = false;
            this.btnList[5].interactable = true;
        }
    },

    initLabState: function () {
        //底注
        for (let i = 0, j = this.lab_dizhuList.length; i < j; i++) {
            this.lab_dizhuList[i].string = "0";
        }
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_addcash") {
            CommonFun.getInstance().showSmallAddCash()
        } else if (btnName === "btn_reduce") {
            this.btnList[5].interactable = true;
            if (this.danzhuNum === 0) {
                this.btnList[4].interactable = false;
            } else {
                this.btnList[4].interactable = true;
                this.danzhuNum -= 1;
                this.lab_danzhu.string = parseInt(this.danzhuNumArr[this.danzhuNum] / 100);    //设置单注的金额
                if (this.danzhuNum === 0) {
                    this.btnList[4].interactable = false;
                }
            }
        } else if (btnName === "btn_plus") {
            this.btnList[4].interactable = true;
            if (this.danzhuNum === this.danzhuNumArr.length - 1) {
                this.btnList[5].interactable = false;
            } else {
                this.btnList[5].interactable = true;
                this.danzhuNum += 1;
                this.lab_danzhu.string = parseInt(this.danzhuNumArr[this.danzhuNum] / 100);
                if (this.danzhuNum === this.danzhuNumArr.length - 1) {
                    this.btnList[5].interactable = false;
                }
            }
        } else if (btnName === "btn_userlist") {
            // this.reqPlayerlist();
            let playList = cc.instantiate(this.pab_playerlist);
            let ctrl = playList.getComponent("7upPlayerListFabCtrl")
            ctrl.reqPlayerlist(0, 12);
            this.node.addChild(playList);
        } else if (btnName === "btn_26" || btnName === "left_btn") {
            //下注2-6之间
            if (this.xiaZhuState == false) {
                if (this.beginSke.node.active == false) {
                    CommonFun.getInstance().showTips(this.tipsLabel[4]);
                }
                return
            }
            if(GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
                return
            }
            this.choiceState = "left";
            let playerID = this.userInfoCtrl.getPlayerid();
            let couldHit = this.checkCoin(GlobalCfg.USER_DATAS.userDiamond, this.danzhuNumArr[this.danzhuNum]);
            if (couldHit) {
                this.callHitBullet(playerID, this.danzhuNumArr[this.danzhuNum], 0);             //ID ,单注的金额，0(左)、4(中)、1(右)
            }
        } else if (btnName === "btn_7" || btnName === "mid_btn") {
            //下注7
            if (this.xiaZhuState == false) {
                if (this.beginSke.node.active == false) {
                    CommonFun.getInstance().showTips(this.tipsLabel[4]);
                }
                return
            }
            if(GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
                return
            }
            this.choiceState = "mid";
            let playerID = this.userInfoCtrl.getPlayerid();
            let couldHit = this.checkCoin(GlobalCfg.USER_DATAS.userDiamond, this.danzhuNumArr[this.danzhuNum]);
            if (couldHit) {
                this.callHitBullet(playerID, this.danzhuNumArr[this.danzhuNum], 4);
            }
        } else if (btnName === "btn_812" || btnName == "right_btn") {
            //下注8-12
            if (this.xiaZhuState == false) {
                if (this.beginSke.node.active == false) {
                    CommonFun.getInstance().showTips(this.tipsLabel[4]);
                }
                return
            }
            if(GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
                return
            }
            this.choiceState = "right";
            let playerID = this.userInfoCtrl.getPlayerid();
            let couldHit = this.checkCoin(GlobalCfg.USER_DATAS.userDiamond, this.danzhuNumArr[this.danzhuNum]);
            if (couldHit) {
                this.callHitBullet(playerID, this.danzhuNumArr[this.danzhuNum], 1);
            }

        } else if (btnName === "btn_chat") {

        }
        else if (btnName === this.btnRepeat.node.name){
            if (this.xiaZhuState == false) {
                if (this.beginSke.node.active == false) {
                    CommonFun.getInstance().showTips(this.tipsLabel[4]);
                }
                return
            }
            // 重复投注
            let playerID = this.userInfoCtrl.getPlayerid();
            let allRepeatBet = 0;
            for (let i = 0; i < Object.values(this.repeatData).length; i++) {
                const element = Object.values(this.repeatData)[i];
                allRepeatBet += element;
            }
            let couldHit = this.checkCoin(GlobalCfg.USER_DATAS.userDiamond, allRepeatBet);
            if (couldHit) {
                for (const key in this.repeatData) {
                    const element = this.repeatData[key];
                    this.callHitBullet(playerID, element, Number(key));
                }
                this.repeatData = {};
                this.btnRepeat.interactable = false;
            }
        }
        else if (btnName == "btn_openMenu") {
            CommonFun.getInstance().showGameMenu(false);
        }
    },

    checkCoin: function (coin, danzhu) {
        if (coin < danzhu) {
            if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
            else {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
            }
            return false;
        } else {
            return true;
        }
    },

    leaveVipSite() {
        if (this.hasDown == true) {
            GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
                Site: this.downSite,
                Act: 2
            });
        }
    },


    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_UPDOWN_GAME);

        // CommonFun.getInstance().releaseBundle("7up7downGame");
    },

    // ---------------------------------------------处理服务器的消息 Start----------------------------------------
    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.login") {                                // 登录游戏
            self.setDownPlayerInfo(notify);
            CommonFun.getInstance().hidProgress();
            // self.userInfoCtrl && self.userInfoCtrl.setVipSiteState(false);
        } else if (msgId === "gameservice.gameconfig") {                    // 游戏配置
            self.setGameConfig(notify);
        }
        // else if (msgId === "gameservice.sceneinit") {                     // 登录以后有一个加入房间的过程
        //     self.setSceneInit(notify);
        // }
        else if (msgId === "gameservice.gamescene") {                     // 刚进入游戏后游戏场景信息
            self.setGameScene(notify);
        } else if (msgId === "gameservice.callnotify") {                    // vip发射广播，这里普通用户就自己ack vip用户就广播
            self.setCallNotify(notify);
        } else if (msgId === "gameservice.call") {
            self.setCall(notify);
        } else if (msgId === "gameservice.gamestartnotify") {               // 游戏开始
            self.isGameEndStatus = false;
            self.roundBet = 0;
            self.setGameStartNotify(notify);
        } else if (msgId === "gameservice.gameendnotify") {                 // 游戏结果
            self.isGameEndStatus = true;
            self.setGameEndNotify(notify);
        } else if (msgId === "gameservice.joinvipnotify") {                 // vip入座进入
            self.setJoinVipNotify(notify);
        } else if (msgId === "gameservice.leavevipnotify") {                // 玩家离开
            self.setLeaveVipNotify(notify);
        } else if (msgId === "gameservice.updatebalance") {                 // 刷新金币
            // self.setUpdateBalance(notify);
        } else if (msgId === "gameservice.vipchangefortnotify") {           // 切换单注
            // self.setVipChangeFortNotify(notify);
        } else if (msgId === "gameservice.exitgamereq") {                   //退出游戏
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);
        } else if (msgId === "gameservice.vipplayerlist") {                   //VIP列表
            self.updataVipPlayerCoin(notify);
        } else if (msgId === "gameservice.gamerecordlist") {                  //历史记录列表
            self.setHistoryScore(notify);
        } else if (msgId === "gameservice.playerlist") {
            LoggerUtil.getInstance().log("palyerList", notify);
            self.lab_playerCount.string = notify.total;
        } else if (msgId === "gameservice.querygameendinfo") {
            self.setGameEndInfo(notify);
        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let coin = notify.deposit + notify.winnings;
            self.userInfoCtrl.setCoin(coin);
        } else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);
        } else if (msgId == "gameservice.shortmessagenotify") {
            self.shortmessagenotify(notify);
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            let curSceneName = cc.director.getScene().name;
            if (self.myBetCion && self.isGameEndStatus == false) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", () => {
                    self.leaveVipSite();
                    self.reqExitGame();
                }, false);
            } 
            else {
                self.leaveVipSite();
                self.reqExitGame();
            }
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("7up7downGame");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);
        }
    },


    shortmessagenotify: function(notify) {
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
            
        }
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = this.getVipPlayerScriptBySiteID(sender);
            if (!senderCtrl || !senderCtrl.node || senderCtrl.getVipSiteState() == true) {
                return;
            }else{
                senderCtrl.setCoin(senderAfter);
                if(senderCtrl.checkSelfIsVip()){
                    this.userInfoCtrl.setCoin(senderAfter);
                }
            }
            
            if (target == -1) {
                let playersCtrlArr = this.vipPlayerScriptArr;
                for (let i = 0; i < playersCtrlArr.length; i++) {
                    let playersCtrl = playersCtrlArr[i];
                    if (playersCtrl && playersCtrl.getVipSiteState() == false && playersCtrl !== senderCtrl) {
                        targetNodeArr.push(playersCtrl.node);
                    };
                };
            }
            else {
                let playersCtrl = this.getVipPlayerScriptBySiteID(target);
                if (playersCtrl && playersCtrl.getVipSiteState() == false) {
                    targetNodeArr.push(playersCtrl.node);
                };
            };
            CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
        };
    },

    checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData; 
        if (!notify) {
            let info = {
                errorMessage: `7Up7Down游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
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
                        GameServerManager.send("gameservice.exitgamereq", "ExitGameReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);
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
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);           
            }, false);
        }
    },

    cashSwitch: function () {
        this.node.getChildByName("btn_addcash").active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

    setCall: function (notify) {
        if (notify.Result == null) {
            // LoggerUtil.getInstance().log("此时的callAck发送的result为空");
            return
        } else {
            CommonFun.getInstance().showMsgBox("Cash ceiling！Unable to continue betting", "YES", () => { }, false);
        }
    },

    //vip玩家入座广播
    setJoinVipNotify: function (notify) {
        let act = notify.Act;       //Vip 进出的标识，1/2/3，进/出/换座
        let userinfo = notify.Userinfo;
        let vipSite = userinfo.VipSite;
        let playerid = userinfo.PlayerId;
        let selfid = this.userInfoCtrl.getPlayerid();
        LoggerUtil.getInstance().log("VIP玩家Join广播", act, vipSite);
        let oldSite = notify.OldSite;
        let oldScript = null
        if (oldSite && oldSite != 0) {
            oldScript = this.getVipPlayerScriptBySiteID(oldSite);
        } else {
            oldScript = this.getVipPlayerScriptBySiteID(vipSite);
        }

        // let vipScript = this.getVipPlayerScriptBySiteID(vipSite);
        switch (act) {
            case 1:
                if (playerid == selfid) {
                    this.hasDown = true;
                    this.downSite = vipSite;
                }
                this.checkSiteList(userinfo.PlayerId);
                oldScript.setVipPlayerInfo(userinfo);
                break;
            case 2:
                if (playerid == selfid) {
                    this.hasDown = false;
                }
                oldScript.vipLeave();
                break;
            case 3:
                let vipScript = this.getVipPlayerScriptBySiteID(vipSite);
                oldScript.vipLeave();
                this.checkSiteList(userinfo.PlayerId);
                if (playerid == selfid) {
                    this.hasDown = true;
                    this.downSite = vipSite;
                }
                vipScript.setVipPlayerInfo(userinfo);
                break;
            default:
                break;
        }
    },

    checkSiteList: function (id) {
        for (let i = 0; i < this.vipPlayerScriptArr.length; i++) {
            let sitePlayerId = this.vipPlayerScriptArr[i].getPlayerID();
            if (id == sitePlayerId) {
                this.vipPlayerScriptArr[i].vipLeave();
            }
        }
    },

    setLeaveVipNotify: function () {
        if (notify == null) {
            LoggerUtil.getInstance().error("7上7下-服务器返回的LeaveVipNotify的数据为空！");
            return;
        }
    },

    // 游戏开始广播
    setGameStartNotify: function (notify) {
        this.leftGoldArr = [];
        this.midGoldArr = [];
        this.rightGoldArr = [];
        this.winGoldArr = [];
        this.leftAllamount = 0;
        this.midAllamount = 0;
        this.rightAllamount = 0;
        this.nodeJb.removeAllChildren();
        this.myBetCion = false;
        this.initLabState();
        this.initBtnState();
        this.lab_playerCount.string = notify.playerNumber;
        for (let i = 0; i < this.nodeJb.children.length; i++) {
            this.removeJbNode(this.nodeJb.children[i]);
        };

        if (this.saiziSprite_1.node.active == true && this.saiziSprite_2.node.active == true) {
            this.setShoushaizi();       //收色子的动画
        };
        this.jbPool.clear();
        this.gameStartState = true;             //true表示游戏即将开始，false为结算阶段
    },

    setGameEndNotify: function (notify) {
        if (notify == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameEndNotify的数据为空！");
            return;
        }
        this.gameEndNotify = notify;
        this.gameresult = notify.GameResult;
        if(this.roundBet == 0){
            this.repeatData = {};
        }else{
            this.repeatData = {...this.curRoundBetData};
        }
        this.curRoundBetData = {};
        this.selfGameresult = notify.SelfGameResult;
        this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Billing...")
        LoggerUtil.getInstance().log("setGameEndNotify中的gameresult", this.gameresult);
        this.win = notify.Win;
        this.setGameEndSke(notify, false);       //摇出的两个色子的结果num1 num2
        this.gameStartState = false;
        LoggerUtil.getInstance().log("GameEndNotify返回的数据win", this.win);
        this.reqPlayerlist(0, 12);

    },

    setGameEndInfo: function (notify) {
        if (notify == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的querygameendinfo的数据为空！");
            return;
        }
        this.gameresult = notify.GameResult;
        this.selfGameresult = notify.SelfGameResult;
        // this.userInfoCtrl.setCoin(notify.Gold);
        this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Billing...")
        this.win = notify.Win;
        // this.setGameEndSke(notify, true);       //摇出的两个色子的结果num1 num2
        let num1 = notify.LeftDicePoints;
        let num2 = notify.RightDicePoints;
        let isGoldDice = notify.GoldDice;
        this.setSaiziSprite(num1, num2, isGoldDice);
    },

    setResult: function () {
        switch (this.win) {
            case 0:
                this.checkmark_left.active = true;
                this.checkmark_mid.active = false;
                this.checkmark_right.active = false;
                break;
            case 1:
                this.checkmark_left.active = false;
                this.checkmark_mid.active = false;
                this.checkmark_right.active = true;
                break;
            case 4:
                this.checkmark_left.active = false;
                this.checkmark_mid.active = true;
                this.checkmark_right.active = false;
                break;
            default:
                break;
        }
    },

    setGameEndSke: function (notify, isfirst) {
        let num1 = notify.LeftDicePoints;
        let num2 = notify.RightDicePoints;
        let score = num1 + num2;
        let isGoldDice = notify.GoldDice;
        let winScore = 0;
        for (let i = 0, len = this.gameresult.length; i < len; i++) {
            winScore += this.gameresult[i].Score;

        }
        if (this.selfGameresult !== null) {
            winScore += this.selfGameresult.Score;
        }
        LoggerUtil.getInstance().log("游戏结算setGameEndSke", winScore);
        this.winGold = winScore / 100;                      //赢的部分所有的金币数量
        // 播放摇色盅的动画
        this.saizhongSke.skeletonData = this.skeletonDataList[0];
        this.saiziSke.skeletonData = this.skeletonDataList[1];
        this.saizhongSke.setAnimation(0, "yaokai", false);
        this.upDownAudioCtrl.playGameSound("shake", false);         //播放色盅的音效

        this.saizhongSke.setCompleteListener((trackEntry, loopCount) => {
            var name = trackEntry.animation.name;
            let self = this
            if (name == "yaokai") {
                self.saizi.active = true;
                self.saiziSke.setAnimation(0, "feitouzi", false);
                self.saiziSke.setAnimation(0, "feitouzi", false);
                self.setSaiziSprite(num1, num2, isGoldDice);

            }
            // else if(name == "daiji"){
            //     self.saizhongSke.setAnimation(0, "shoutouzi", false);
            //     self.saiziSprite_1.node.active = false;
            //     self.saiziSprite_2.node.active = false;
            // }
        })

        //色子飞出来之后，结算
        this.moveShaizi = ()=> {
            LoggerUtil.getInstance().log("色子飞出来了，结算飞金币，设置历史记录");
            this.myBetCion = false;
            this.settlementFeiGold(notify);
            if (notify.Gold != 0) {
                this.userInfoCtrl.setCoin(notify.Gold);
            }
            if (!isfirst) {
                this.updateHistoryScore(score);
            }
            this.curRoundAddCoinFinish();
        }
        this.scheduleOnce(this.moveShaizi, 3.5);
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.danzhuNumArr[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.roundBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    // 播放爆炸的动画
    setAnimationBomb: function (num1, num2) {
        let sprite_1_yellow = this.saiziAtlas.getSpriteFrame(num1 + "-2");
        let sprite_2_yellow = this.saiziAtlas.getSpriteFrame(num2 + "-2");
        this.scheduleOnce(() => {
            this.saiziSprite_1.spriteFrame = sprite_1_yellow;
            this.saiziSprite_2.spriteFrame = sprite_2_yellow;
            this.saiziSprite_1.node.active = true;
            this.saiziSprite_2.node.active = true;
            this.saizi.active = false;
        }, 0.4);
        this.node_baozhaSke = this.node.getChildByName("node_baozhaSke").getComponent(sp.Skeleton);
        this.node_baozhaSke.active = true;
        this.node_baozhaSke.skeletonData = this.skeletonDataList[3];
        this.node_baozhaSke.setAnimation(0, "baodian", false);
        this.upDownAudioCtrl.playGameSound("baozha", false);
        this.node_baozhaSke.setCompleteListener((trackEntry, loopCount) => {
            var name = trackEntry.animation.name;
            let self = this
            if (name == "baodian") {
                self.moveLab_double();
            }
        })

    },

    // 播放收色子的动画
    setShoushaizi: function () {
        this.saizhongSke.setAnimation(1, "shoutouzi", false);
        this.upDownAudioCtrl.playGameSound("shou", false);
        this.saiziSprite_1.node.active = false;
        this.saiziSprite_2.node.active = false;


    },

    //结算飞金币
    settlementFeiGold: function (notify) {
        this.reqVipplayerlist();
        let score = notify.LeftDicePoints + notify.RightDicePoints;
        this.selfGameresult = notify.SelfGameResult;
        LoggerUtil.getInstance().log("settlementFeiGold中的gameresult", this.gameresult, score, notify.Win);
        if (score < 7) {                //先将金币飞到庄家的位置，再从庄家的位置发放金币到赢得台桌位置，发放给赢的玩家
            this.moveToZhuang(notify.Win)
        } else if (score == 7) {
            this.moveToZhuang(notify.Win);
        } else if (score > 7) {
            this.moveToZhuang(notify.Win);
        }
        this.myBetCion = false;
        //VIP玩家连续三局未下注，踢下VIP座
        for (let i = 0, len = this.vipPlayerScriptArr.length; i < len; i++) {
            let vipPlayerScript = this.vipPlayerScriptArr[i];
            vipPlayerScript.roundCount++
            if (vipPlayerScript.roundCount > 3) {
                GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
                    Site: vipPlayerScript.getVipSite(),
                    Act: 2
                });
                vipPlayerScript.freshVipPlayerView();
            }
        }
    },

    moveToPlayer: function () {
        let bool = false;
        let sortameresult = [];
        sortameresult.length = 7;
        for (let i = 0, len = this.gameresult.length; i < len; i++) {
            let item = this.gameresult[i];
            switch (item.Site) {
                case 1:
                    sortameresult[4] = item
                    break;
                case 2:
                    sortameresult[5] = item
                    break;
                case 3:
                    sortameresult[1] = item
                    break;
                case 4:
                    sortameresult[0] = item
                    break;
                case 5:
                    sortameresult[3] = item
                    break;
                case 6:
                    sortameresult[2] = item
                    break;
                case 99999:
                    sortameresult[6] = item
                    break;
                default:
                    break;
            }
        }
        for (let i = sortameresult.length - 1; i >= 0; i--) {
            let element = sortameresult[i];
            if (!element) {
                sortameresult.splice(i, 1);
            }
        }
        if (this.selfGameresult && Object.keys(this.selfGameresult).length !== 0 && this.selfGameresult.Score > 0) {                      //自己下注了，而且赢了
            let posSelf = cc.v2(-11, -216);
            // var selfCount = parseInt(this.selfGameresult.Score / 100);Object.keys(dataObject).length == 0
            this.userInfoCtrl.setWinNum(this.selfGameresult.Score);
            let selfWinJbArr = this.winGoldArr.splice(0, 20);
            for (let i = selfWinJbArr.length - 1; i >= 0; i--) {
                let tempIndex = i;
                cc.tween(selfWinJbArr[tempIndex])
                    .delay(Math.random() * 0.3)
                    .to(0.3, { scale: 1, position: posSelf })
                    .call(() => {
                        this.removeJbNode(selfWinJbArr[tempIndex])
                    })
                    .start();
            }


            for (let i = 0, len = sortameresult.length; i < len; i++) {   //此处的i为notify中的玩家数目，
                let score = sortameresult[i].Score;
                let afterGold = sortameresult[i].After;
                let palyersite = sortameresult[i].Site;
                // LoggerUtil.getInstance().log("!!!!!!!!!!!!!", palyersite, i);
                this.scheduleOnce(() => {
                    for (let j = 0; j < this.vipPlayerScriptArr.length; j++) {
                        let vipsite = this.vipPlayerScriptArr[j].getVipSite();
                        // LoggerUtil.getInstance().log("JJJJJJJJJJJJJJJ", vipsite);
                        if (palyersite == vipsite && score > 0) {       //VIP 玩家
                            // LoggerUtil.getInstance().log("有VIP玩家赢钱", palyersite);
                            let vipWinJbArr = this.winGoldArr.splice(0, 20);
                            this.vipPlayerScriptArr[j].setWinNum(score);
                            this.vipPlayerScriptArr[j].setCoin(afterGold);
                            this.vipPlayerScriptArr[j].winGoldMoveAnim(this.moveJbNumber, vipWinJbArr, this);
                        }
                    }
                    if (palyersite == "99999") {
                        bool = true;
                        let pos = this.btnList[3].node.position;
                        for (let k = this.winGoldArr.length - 1; k >= 0; k--) {
                            let tempArr = this.winGoldArr.splice(k, 1);
                            cc.tween(tempArr[0])
                                .delay(Math.random() * 0.3)
                                .to(0.3, { scale: 1, position: pos })
                                .call(() => {
                                    this.removeJbNode(tempArr[0]);
                                })
                                .start();
                        }
                    }
                }, 0.2 * i)
            }
        } else {                                      //自己没下注 || 下注了没赢
            for (let i = 0, len = sortameresult.length; i < len; i++) {   //此处的i为notify中的玩家数目
                let palyersite = sortameresult[i].Site;
                let afterGold = sortameresult[i].After;
                let score = sortameresult[i].Score;
                // LoggerUtil.getInstance().log("---------------!!!!!!!!!!!!!-------------", palyersite, i);
                this.scheduleOnce(() => {
                    for (let j = 0; j < this.vipPlayerScriptArr.length; j++) {
                        let vipsite = this.vipPlayerScriptArr[j].getVipSite();
                        // LoggerUtil.getInstance().log("JJJJJJJJJJJJJJJ", vipsite);
                        if (palyersite == vipsite && score > 0) {       //VIP 玩家
                            LoggerUtil.getInstance().log("有VIP玩家赢钱", palyersite, "此时notify中的I", i);
                            let vipWinJbArr = this.winGoldArr.splice(0, 20);
                            let script = this.vipPlayerScriptArr[j];
                            script.setWinNum(score);
                            script.setCoin(afterGold);
                            script.winGoldMoveAnim(this.moveJbNumber, vipWinJbArr, this);
                        }
                    }
                    if (palyersite == "99999") {
                        bool = true;
                        let pos = this.btnList[3].node.position;
                        this.upDownAudioCtrl.playGameSound("jbrecover", false);
                        for (let k = this.winGoldArr.length - 1; k >= 0; k--) {
                            let tempArr = this.winGoldArr.splice(k, 1);
                            cc.tween(tempArr[0])
                                .delay(Math.random() * 0.3)
                                .to(0.3, { scale: 1, position: pos })
                                .call(() => {
                                    this.removeJbNode(tempArr[0]);
                                })
                                .start();
                        }
                    }
                }, 0.2 * i)
            }
        }

    },


    moveToZhuang: function (win) {          //0/1/4    左/右/中
        this.upDownAudioCtrl.playGameSound("jbrecover", false);
        this.arge1 = false;
        this.arge2 = false;                     //判断两个移动到庄家的区域是否都移动完毕
        switch (win) {
            case 0:
                /**
                 * 一堆金币飞过去的效果
                 */

                for (let i = this.midGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.midGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.3, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.midGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge1 = true;
                                this.midGoldArr.length = 0;
                                this.trasTomove(this.leftGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                };
                for (let i = this.rightGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.rightGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.4, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.rightGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge2 = true;
                                this.rightGoldArr.length = 0;
                                this.trasTomove(this.leftGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                }

                break;
            case 1:
                for (let i = this.midGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.midGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.3, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.midGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge1 = true;
                                this.midGoldArr.length = 0;
                                this.trasTomove(this.rightGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                };
                for (let i = this.leftGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.leftGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.3, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.leftGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge2 = true;
                                this.leftGoldArr.length = 0;
                                this.trasTomove(this.rightGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                }
                break;
            case 4:
                for (let i = this.rightGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.rightGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.3, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.rightGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge1 = true;
                                this.rightGoldArr.length = 0;
                                this.trasTomove(this.midGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                };
                for (let i = this.leftGoldArr.length - 1; i >= 0; i--) {
                    let jbnode = this.leftGoldArr[i];
                    cc.tween(jbnode)
                        .delay(Math.random() * 0.45)
                        .to(0.3, { position: cc.v2(0, 210) })
                        .call(() => {
                            this.removeJbNode(jbnode)
                            this.leftGoldArr.splice(i, 1);
                            if (i == 0) {
                                this.arge2 = true;
                                this.leftGoldArr.length = 0;
                                this.trasTomove(this.midGoldArr, win, this.winGold);
                            }
                        })
                        .delay(1.5)
                        .start();
                }
                break;
            default:
                break;
        }


    },

    trasTomove: function (goldArr, win, winGold) {
        if (this.arge1 == true && this.arge2 == true) {
            this.moveToWinArea(goldArr, win, winGold);
        }
    },

    moveToWinArea: function (winArr, win, winGold) {
        this.upDownAudioCtrl.playGameSound("moveToArea", false);
        LoggerUtil.getInstance().log("移动金币到获胜区域");
        if (winGold == 0) {
            LoggerUtil.getInstance().log("winGold为0，不执行下面语句");
            return;
        }
        if (this.gameStartState == true) {
            LoggerUtil.getInstance().log("gameStartState为true，非结算状态，不执行移动到获胜区域金币");
            return;
        }
        let len = winArr.length;        //获胜区域的存放金币的数组长度
        LoggerUtil.getInstance().log("moveToWinArea///////////////", this.gameresult.length, winGold, len, this.nodeJb);
        let index = 0;
        let numf = 0;
        if (this.selfGameresult != null) {
            numf = this.moveJbNumber * (this.gameresult.length + 1);
        } else {
            numf = this.moveJbNumber * (this.gameresult.length)
        }
        for (let i = 0; i < 30; i++) {
            let jbnode = this.createJbNode();
            jbnode.setPosition(0, 210);
            jbnode.parent = this.nodeJb;
            let toPos = cc.v2(0, 0);
            switch (win) {
                case 0:
                    toPos = this.randomPosLeft();
                    break;
                case 1:
                    toPos = this.randomPosRight();
                    break;
                case 4:
                    toPos = this.randomPosMid();
                    break;
                default:
                    LoggerUtil.getInstance().error("win的值未传递");
                    break;
            }
            cc.tween(jbnode)
                .delay(Math.random() * 0.5)
                .to(0.3, { scale: 1, position: toPos }, { easing: 'quartOut' })
                .call(() => {
                    winArr.push(jbnode);
                    index++;
                    if (index == 30) {
                        this.winGoldArr = winArr;         //获胜方的存放金币数组
                        LoggerUtil.getInstance().log("移动到获胜区域的金币移动完毕", index, winArr.length);
                        this.moveToPlayer();
                    }
                })
                .start();
        }


    },

    //下注消息
    setCallNotify: function (notify) {

        let amount = notify.Amount;
        let allamount = notify.AllAmount;
        let userInfo = notify.Userinfo;
        let playerid = userInfo.PlayerId;
        let call = notify.Call;                   //下注区域：0/1/4,左/右/中
        let vipsite = userInfo.VipSite;
        let selfplayID = this.userInfoCtrl.getPlayerid();
        let count = this.setCount(amount);
        if (playerid === selfplayID) {     //玩家自己
            this.roundBet = this.roundBet + Number(amount);
            // if(this.curRoundBetData.hasOwnProperty(call)){
            //     this.curRoundBetData[call] += amount;
            // }else{
            //     this.curRoundBetData[call] = amount;
            // }
            LoggerUtil.getInstance().warn("玩家自己下注", JSON.stringify(this.curRoundBetData));
            this.myBetCion = true;
            this.contrastAllamount(call, allamount);
            this.userInfoCtrl.betAction();
            this.userInfoCtrl.setCoin(userInfo.Diamond);
            this.playFeiJinBiXiazhu(count, this.choiceState, cc.v2(0, -210), true);
            if (this.hasDown) {
                let script = this.getVipPlayerScriptBySiteID(vipsite);
                script.setCoin(userInfo.Diamond);
                script.roundCount = 0;
            }
        } else {
            let script = this.getVipPlayerScriptBySiteID(vipsite);
            if (script.getPlayerID() == null) {
                // LoggerUtil.getInstance().log("此时的座位为空！");
            } else {
                if (script.getPlayerID() == playerid) {
                    script.setCoin(userInfo.Diamond);
                    this.contrastAllamount(call, allamount);
                    if (this.jbAudioState == true) {
                        this.upDownAudioCtrl.playGameSound("otherCoin", false);
                        // this.jbAudioState = false;
                        // setTimeout(() => { this.jbAudioState = true }, 1000);
                    }
                    script.betAction();
                    script.vipBetting(8, call, this);
                } else {
                    // LoggerUtil.getInstance().log("此时座位上的VIP不是之前下注的VIP玩家");
                }
            }
        }
    },

    //对比收到callnotify之后各区域的allamount
    contrastAllamount: function (areaType, allamount) {
        switch (areaType) {
            case 0:
                if (allamount > this.leftAllamount) {
                    this.leftAllamount = allamount;
                }
                break;
            case 1:
                if (allamount > this.rightAllamount) {
                    this.rightAllamount = allamount;
                }
                break;
            case 4:
                if (allamount > this.midAllamount) {
                    this.midAllamount = allamount;
                }
                break;

            default:
                break;
        }
    },

    //设置历史记录
    setHistoryScore: function (notify) {
        let list = notify.List;
        let len = list.length;
        if (len <= 9) {
            for (let i = 0; i < len; i++) {
                this.historiesScoreArr[i] = list[i].LeftDicePoints + list[i].RightDicePoints;
            }
        } else if (len > 9) {
            for (let i = 0; i < 9; i++) {
                this.historiesScoreArr[i] = list[len - 9 + i].LeftDicePoints + list[len - 9 + i].RightDicePoints;
            }
        }
        this.historyLayout.removeAllChildren();
        LoggerUtil.getInstance().log("this.historiesScoreArr:", this.historiesScoreArr);
        for (let i = 0; i < this.historiesScoreArr.length; i++) {
            let scoreNode = cc.instantiate(this.pab_historyScore);
            let scoreNodeCtrl = scoreNode.getComponent("node_scoreCtrl");
            scoreNodeCtrl.setScore(this.historiesScoreArr[i]);
            this.historyLayout.addChild(scoreNode);
            this.historyLayout.children[i].getChildByName("NEW").active = false;
            if (i == this.historiesScoreArr.length - 1) {
                this.historyLayout.children[i].getChildByName("NEW").active = true;
            }
        }
    },

    // 更新历史记录
    updateHistoryScore: function (score) {
        if (this.historyLayout.childrenCount < 9) {
            this.historyLayout.removeAllChildren();
            for (let i = 0; i < this.historiesScoreArr.length; i++) {
                let scoreNode = cc.instantiate(this.pab_historyScore);
                let scoreNodeCtrl = scoreNode.getComponent("node_scoreCtrl");
                scoreNodeCtrl.setScore(this.historiesScoreArr[i]);
                this.historyLayout.addChild(scoreNode);
                this.historyLayout.children[i].getChildByName("NEW").active = false;
                if (i == this.historiesScoreArr.length - 1) {
                    this.historyLayout.children[i].getChildByName("NEW").active = true;
                }
            }
        }
        this.checkLayout(this.historyLayout);           //确保layout中的节点永远 <= 9
        if (this.historiesScoreArr.length == 0 || this.historiesScoreArr.length < 9) {
            this.historiesScoreArr.push(score);
        } else {
            LoggerUtil.getInstance().log("历史记录数组", this.historiesScoreArr);
            this.historiesScoreArr.shift();
            this.historyLayout.removeChild(this.historyLayout.children[0], true);
            LoggerUtil.getInstance().log("历史记录数组", this.historiesScoreArr);
            this.historiesScoreArr.push(score);
        }
        let scoreNode = cc.instantiate(this.pab_historyScore);
        let scoreNodeCtrl = scoreNode.getComponent("node_scoreCtrl");
        scoreNodeCtrl.setScore(score);
        this.historyLayout.addChild(scoreNode);
        for (let i = 0; i < this.historyLayout.childrenCount; i++) {
            this.historyLayout.children[i].getChildByName("NEW").active = false;
            if (i == this.historyLayout.childrenCount - 1) {
                this.historyLayout.children[i].getChildByName("NEW").active = true;
            }
        }
    },

    checkLayout: function (node) {
        if (node.childrenCount > 9) {
            node.removeChild(node.children[0], true);
            this.checkLayout(node);
        } else {
            return
        }
    },

    // 更新场景状态
    setGameScene: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameScene的数据为空！");
            return;
        }
        if (notify.status == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameScene的status游戏状态的数据为空！");
            return;
        }
        if (notify.Remaining == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameScene的remaining数据为空！");
            return;
        }
        if (notify.CurGameState == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameScene的curgamestate数据为空！");
            return;
        }
        if (notify.CurGameState.VipPlayerList == null) {
            LoggerUtil.getInstance().error("7UP7DOWN-设置vip座位的值为空！");
            return;
        }
        if (notify.First == true) {
            this.freshState();
            this.initTableGlod(this.initTableGlodCount(notify.CurGameState.LeftBoss.AllAmount), "left");
            this.initTableGlod(this.initTableGlodCount(notify.CurGameState.MidBoss.AllAmount), "mid");
            this.initTableGlod(this.initTableGlodCount(notify.CurGameState.RightBoss.AllAmount), "right");
            this.leftAllamount = notify.CurGameState.LeftBoss.AllAmount;
            this.midAllamount = notify.CurGameState.MidBoss.AllAmount;
            this.rightAllamount = notify.CurGameState.RightBoss.AllAmount;
            this.lab_playerCount.string = notify.playerNumber;
        }
        let vipplayerlist = notify.CurGameState.VipPlayerList;
        for (let i = 0, len = vipplayerlist.length; i < len; i++) {
            let userinfo = vipplayerlist[i];
            let vipsite = userinfo.VipSite;
            let playerid = userinfo.PlayerId;
            LoggerUtil.getInstance().log("gameScene广播中有VIP入座消息", vipsite, userinfo);
            let vipPlayerCtrl = this.getVipPlayerScriptBySiteID(vipsite);
            vipPlayerCtrl.setVipPlayerInfo(userinfo);
            if (playerid == this.userInfoCtrl.getPlayerid()) {
                this.userInfoCtrl.setVipSiteState(false);
            }
        }
        if (notify.status == 0) {                   //未结算状态
            this.setGameReadyStatus(notify);
        }
        else if (notify.status == 1) {            //结算状态
            LoggerUtil.getInstance().log("结算状态");
            this.gameStartState = false;
            this.setGameResultStatus(notify);
            if (notify.First == true) {
                this.reqGameEndInfo();
            }
        }
        let requester = notify.requester
        if(requester) {
            GlobalCfg.USER_DATAS.userDiamond = requester.Diamond;
            this.lab_danzhu.string = CommonFun.getInstance().numberToShow(requester.Diamond/100);
        }
    },

    setGameReadyStatus: function (notify) {
        let isFirstTime = false;
        let remaining = notify.Remaining;
        if (this.tempTime == remaining) {
            isFirstTime = false
        } else {
            isFirstTime = true
        }
        this.tempTime = remaining;
        let curgamestate = notify.CurGameState;
        this.palyerListPos = this.btnList[3].node.position;
        if (remaining > 15 && remaining < 20 && isFirstTime == true) {
            this.isPlayAudio = true;
            // this.myBetCion = true;
            this.setXiaZhuBtn(false);
            this.initBtnState();
            this.leftGoldArr = [];
            this.midGoldArr = [];
            this.rightGoldArr = [];
            this.winGoldArr = [];
            this.initBtnState();
            this.initLabState();
            this.nodeJb.removeAllChildren();
            this.node_tip.active = true;
            this.saiziSprite_1.node.active = false;
            this.saiziSprite_2.node.active = false;
            let time = remaining - 16;
            if (time == 0) {

                // this.saizhongSke.setCompleteListener((trackEntry, loopCount) => {
                //     var name = trackEntry.animation.name;
                //     if (name == "kaishi") {
                //         this.beginSke.setAnimation(0, "daiji", false);
                //     }
                // });
            }
            this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Betting starts in " + time + " seconds",)
        } else if (remaining == 15 && isFirstTime == true) {
            this.isPlayAudio = false;
            this.tipAnimation(remaining);
            this.upDownAudioCtrl.playGameSound("start", false);
            this.beginSke.skeletonData = this.skeletonDataList[2];
            this.beginSke.node.active = true;
            this.beginSke.setAnimation(0, "animation", false);
            this.setXiaZhuBtn(true);
            if(Object.keys(this.repeatData).length > 0){
                this.btnRepeat.interactable = true;
            }else{
                this.btnRepeat.interactable = false;
            }
        } else if (remaining < 15) {
            this.beginSke.node.active = false;
            if (this.isPlayAudio && isFirstTime == true) {
                if (remaining < 15) {
                    this.isPlayAudio = false;
                }
            }
            this.setTip(remaining);
            this.setXiaZhuBtn(true);
            if (isFirstTime == true) {
                if (curgamestate.LeftBoss.AllAmount > this.leftAllamount) {
                    this.leftAllamount = curgamestate.LeftBoss.AllAmount;
                    let posY = this.palyerListPos.y;
                    let posX = this.palyerListPos.x;
                    cc.tween(this.btnList[3].node)
                        .to(0.1, { position: cc.v2(posX, posY + 15) })
                        .to(0.1, { position: cc.v2(posX, posY) })
                        .start();
                    this.playFeiJinBiXiazhu(5, "left", this.palyerListPos, false);
                }
                if (curgamestate.MidBoss.AllAmount > this.midAllamount) {
                    this.midAllamount = curgamestate.MidBoss.AllAmount;
                    let posY = this.palyerListPos.y;
                    let posX = this.palyerListPos.x;
                    cc.tween(this.btnList[3].node)
                        .to(0.1, { position: cc.v2(posX, posY + 15) })
                        .to(0.1, { position: cc.v2(posX, posY) })
                        .start();
                    this.playFeiJinBiXiazhu(5, "mid", this.palyerListPos, false);
                }
                if (curgamestate.RightBoss.AllAmount > this.rightAllamount) {
                    this.rightAllamount = curgamestate.RightBoss.AllAmount;
                    let posY = this.palyerListPos.y;
                    let posX = this.palyerListPos.x;
                    cc.tween(this.btnList[3].node)
                        .to(0.1, { position: cc.v2(posX, posY + 15) })
                        .to(0.1, { position: cc.v2(posX, posY) })
                        .start();
                    this.playFeiJinBiXiazhu(5, "right", this.palyerListPos, false);
                }
            }
            this.setLabeldizhu(notify);
            if (remaining < 1) {
                this.setXiaZhuBtn(false);
            }
            if (remaining < 3 && remaining > 0 && isFirstTime == true) {
                this.upDownAudioCtrl.playGameSound("countDown", false);
            }
            if (remaining == 0 && isFirstTime == true) {
                LoggerUtil.getInstance().log("此时倒计时为0");
                this.upDownAudioCtrl.playGameSound("stopBet", false);
                this.beginSke.skeletonData = this.skeletonDataList[4];
                this.beginSke.node.active = true;
                this.beginSke.setAnimation(0, "animation", false);
                this.beginSke.setCompleteListener((trackEntry, loopCount) => {
                    var name = trackEntry.animation.name;
                    if (name == "animation") {
                        this.beginSke.node.active = false;
                    }
                });
            }
        }
    },

    // 设置下注按钮
    setXiaZhuBtn: function (boolean) {
        // this.btnList[6].interactable = boolean;
        // this.btnList[7].interactable = boolean;
        // this.btnList[8].interactable = boolean;
        this.xiaZhuState = boolean;
    },

    // 提示框出来的动画
    tipAnimation: function (time) {
        this.node_tip.active = true;
        cc.tween(this.node_tip)
            .to(0, { scale: 0 })
            .call(() => {
                this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Betting end in " + time + " seconds",)
            })
            .to(0.5, { scale: 1.2 }, { easing: 'sineOutIn' })
            .to(0.3, { scale: 1 })
            .start();
    },

    setTip: function (time) {
        this.node_tip.active = true;
        this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Betting end in " + time + " seconds")
    },

    //桌面的金币
    initTableGlod: function (allamount, areaType) {
        let number = allamount;
        if (areaType == "left" && number != this.leftGoldArr.length) {
            let len = this.leftGoldArr.length;
            for (let i = 0; i < number - len; i++) {
                let jbnode = this.createJbNode();
                let posV2 = this.randomPosLeft();
                jbnode.setPosition(posV2);
                jbnode.parent = this.nodeJb;
                this.leftGoldArr.push(jbnode);
            }
        } else if (areaType == "mid" && number != this.midGoldArr.length) {
            let len = this.midGoldArr.length;
            for (let i = 0; i < number - len; i++) {
                let jbnode = this.createJbNode();
                let posV2 = this.randomPosMid();
                jbnode.setPosition(posV2);
                jbnode.parent = this.nodeJb;
                this.midGoldArr.push(jbnode);
            }
        } else if (areaType == "right" && number != this.rightGoldArr.length) {
            let len = this.rightGoldArr.length;
            for (let i = 0; i < number - len; i++) {
                let jbnode = this.createJbNode();
                let posV2 = this.randomPosRight();
                jbnode.setPosition(posV2);
                jbnode.parent = this.nodeJb;
                this.rightGoldArr.push(jbnode);
            }
        }

    },

    randomPosLeft: function () {
        let posx = Math.random() * 170 - 395;
        let posy = Math.random() * 160 - 80;
        var v2 = cc.v2(posx, posy);
        return v2
    },

    randomPosMid: function () {
        let posx = Math.random() * 340 - 170;
        let posy = Math.random() * 60 - 80;
        var v2 = cc.v2(posx, posy);
        return v2
    },

    randomPosRight: function () {
        let posx = Math.random() * 165 + 225;
        let posy = Math.random() * 160 - 80;
        var v2 = cc.v2(posx, posy);
        return v2
    },

    // 设置游戏结算
    setGameResultStatus: function (notify) {
        let self = this;
        let remaining = notify.Remaining;
        // this.gameresult = notify.GameResult;
        this.win = notify.Win;
        this.setXiaZhuBtn(false);
        // this.setResult();
        this.node_tip.active = true;
        this.lab_tip.string = CommonFun.getInstance().showLabelLanguage("Billing...")
        this.setLabeldizhu(notify);

    },


    // 设置文字底注
    setLabeldizhu: function (notify) {
        let leftBoss = notify.CurGameState.LeftBoss;
        let leftBossAllamount = leftBoss.AllAmount;
        let leftBossAmount = Number(leftBoss.Amount);
        this.lab_dizhuList[0].string = parseInt(leftBossAmount / 100);
        this.lab_dizhuList[3].string = parseInt(leftBossAllamount / 100);
        let midBoss = notify.CurGameState.MidBoss;
        let midBossAllamount = midBoss.AllAmount;
        let midBossAmount = Number(midBoss.Amount);
        this.lab_dizhuList[1].string = parseInt(midBossAmount / 100);
        this.lab_dizhuList[4].string = parseInt(midBossAllamount / 100);
        let rightBoss = notify.CurGameState.RightBoss;
        let rightBossAllamount = rightBoss.AllAmount;
        let rightBossAmount = Number(rightBoss.Amount);
        this.lab_dizhuList[2].string = parseInt(rightBossAmount / 100);
        this.lab_dizhuList[5].string = parseInt(rightBossAllamount / 100);
        this.currentBetNum = leftBossAmount + midBossAmount + rightBossAmount;
        if (midBossAmount > 0 || leftBossAmount > 0 || rightBossAmount > 0) {
            this.myBetCion = true;
        }
        if(leftBossAmount > 0){
            if(this.curRoundBetData.hasOwnProperty('0') && this.curRoundBetData['0'] < leftBossAmount) {
                cc.tween(this.lab_dizhuList[0].node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
            this.curRoundBetData['0'] = leftBossAmount;
        }
        if(midBossAmount > 0){
            if(this.curRoundBetData.hasOwnProperty('4') && this.curRoundBetData['4'] < midBossAmount) {
                cc.tween(this.lab_dizhuList[1].node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
            this.curRoundBetData['4'] = midBossAmount;
        }
        if(rightBossAmount > 0){
            if(this.curRoundBetData.hasOwnProperty('1') && this.curRoundBetData['1'] < rightBossAmount) {
                cc.tween(this.lab_dizhuList[2].node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
            this.curRoundBetData['1'] = rightBossAmount;
        }        
    },

    // 设置色子的点数
    setSaiziSprite: function (num1, num2, type) {
        let stringType = "-1"
        let sprite_1 = this.saiziAtlas.getSpriteFrame(num1 + stringType);
        let sprite_2 = this.saiziAtlas.getSpriteFrame(num2 + stringType);
        this.scheduleOnce(() => {
            this.upDownAudioCtrl.playGameSound("throw", false);
            this.saiziSprite_1.spriteFrame = sprite_1;
            this.saiziSprite_2.spriteFrame = sprite_2;
            this.saiziSprite_1.node.active = true;
            this.saiziSprite_2.node.active = true;
            this.saizi.active = false;
            this.setResult();           //根据结果，显示哪个区域亮起
            if (type == true) {
                this.setAnimationBomb(num1, num2);
            }
        }, 0.7);
    },

    moveLab_double: function () {
        this.lab_double = this.node.getChildByName("lab_bei");
        this.lab_double.opacity = 255;
        this.lab_double.setPosition(0, 120);
        this.lab_double.active = true;
        cc.tween(this.lab_double)
            .to(1, { position: cc.v2(0, 220), opacity: 0 })
            .start()
    },

    setBeginSke: function () {
        this.beginSke.skeletonData = this.skeletonDataList[2];
        this.beginSke.node.active = true;
        this.beginSke.setAnimation(1, "kaishi", false);
        this.beginSke.setEndListener(() => {
            this.beginSke.setAnimation(1, "daiji", false);
        })
    },

    // 更新VIP玩家的信息
    updataVipPlayerCoin: function (notify) {
        let tempArr = [1, 2, 3, 4, 5, 6];
        for (let i = 0, len = notify.List.length; i < len; i++) {
            let vipsite = notify.List[i].VipSite;
            for (let j = 0; j < 6; j++) {
                if (tempArr[j] == vipsite) {
                    tempArr.splice(j, 1);
                }
            }
            let vipScript = this.getVipPlayerScriptBySiteID(vipsite);
            vipScript.setVipPlayerInfo(notify.List[i]);
        }
        for (let index = 0; index < tempArr.length; index++) {
            let vipScript = this.getVipPlayerScriptBySiteID(tempArr[index])
            vipScript.vipLeave();

        }
    },

    setDownPlayerInfo: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的Login的数据为空！");
            return;
        }

        if(notify.Result) {
            CommonFun.getInstance().showMsgBox("Connection error " + "\n" + "403", "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SEVENUPDOWN, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
            return
        }


        this.userInfoCtrl.setPlayerInfo(notify.userinfo);

        if (this.danzhuNumArr[0]) {
            this.lab_danzhu.string = parseInt(this.danzhuNumArr[0] / 100);
        } else {
            this.lab_danzhu.string = "10";
        }
        this.reqRecordList();           //请求历史记录
    },

    setGameConfig: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的GameConfig的数据为空！");
            GameServerManager.send("gameservice.gamestartnotify", "GameStartNotifyReq", {});
            return;
        }
        this.danzhuNumArr = notify.FortSize;                //存放单注金额的数组
        if(GlobalCfg.USER_DATAS.gamePattern == 1){
            this.danzhuNumArr = [100, 1000, 2000, 5000, 10000, 100000, 200000];
        }
        this.gameTime = notify.GameTime;                    //
        this.settlementTime = notify.SettlementTime;
        this.vipLimit = notify.VipLimit;
        this.reqVipplayerlist();
        
        // this.userInfoCtrl.setFortSizeArr(notify.fortsize);
    },

    setSceneInit: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("7UP7DOWN-服务器返回的sceneinit的数据为空！");
            return;
        }
    },


    // ----------------------------------------------处理服务器消息 End------------------------------------------

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~向服务器发送请求 Start----------------------------------------------
    // 登录7上7下游戏
    Up7LoginReq: function () {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,	    //用户ID
            token: GlobalCfg.USER_DATAS.token,	    //登录服拿到的token
            fromid: GlobalCfg.PRODUCT_ID       //平台
        });
    },

    // 发射
    callHitBullet: function (_playerid, _amount, _call) {
        if(this.currentBetNum + _amount > this.limitMaxBetNum){
            LoggerUtil.getInstance().log("当前下注数目：",this.currentBetNum);
            CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "YES", () => { }, false);
            return
        }
        GameServerManager.send("gameservice.call", "CallReq", {
            PlayerId: _playerid,
            Amount: _amount,
            Call: _call
        });
    },

    //历史记录列表
    reqRecordList: function () {
        GameServerManager.send("gameservice.gamerecordlist", "GameRecordListReq", {});
    },

    reqExitGame: function () {
        GameServerManager.send("gameservice.exitgamereq", "ExitGameReq", {});
    },

    reqVipplayerlist: function () {
        GameServerManager.send("gameservice.vipplayerlist", "VipPlayerListReq", {});
    },

    reqPlayerlist: function (pageIndex, num) {
        GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
            page: pageIndex,
            size: num
        });
        LoggerUtil.getInstance().log("send请求playerlist");
    },

    reqGameEndInfo: function () {
        GameServerManager.send("gameservice.querygameendinfo", "QueryGameEndInfoReq", {});
    },
    //---------------------------------------------------向服务器发送请求 End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    setSpriteFrame: function (spriteFrame) {
        var frame = this.atlasPlist.getSpriteFrame(spriteFrame);
        return frame;
    },

    initJbPool: function () {
        this.jbPool = new cc.NodePool();
        let initCount = 150;
        for (let i = 0; i < initCount; i++) {
            this.jbPool.put(cc.instantiate(this.pab_jb));    //放入对象池
        }
    },

    createJbNode: function () {
        let feijbNode = null;
        if (this.jbPool.size() > 0) {       //通过size接口判断对象池中是否有空闲的对象
            feijbNode = this.jbPool.get();
        } else {                          //对象池中的备用对象不够时，通过cc.instantiate 重新创建
            feijbNode = cc.instantiate(this.pab_jb);
        }
        return feijbNode;
    },

    removeJbNode: function (feijbNode) {
        if (feijbNode == null) {
            LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
            return;
        }
        feijbNode.setPosition(0, 0);
        this.jbPool.put(feijbNode);
    },

    setSceneJb: function () {

    },


    //自己下注飞金币
    playFeiJinBiXiazhu: function (count, areaType, fromPos, isSelf) {
        if (this.jbAudioState == true) {
            if (isSelf) {
                this.upDownAudioCtrl.playGameSound("touCoin", false);
            } else {
                this.upDownAudioCtrl.playGameSound("otherCoin", false);
            }

            // this.jbAudioState = false;
            // setTimeout(() => { this.jbAudioState = true }, 1000);
        }
        this.feiJbCallBack = () => {
            let jbnode = this.createJbNode();
            jbnode.setPosition(fromPos);

            if (areaType == 'left') {
                var posx = Math.random() * 170 - 395;
                var posy = Math.random() * 160 - 80;
                if (this.leftGoldArr.length > 100) {
                    this.nodeJb.removeChild(this.leftGoldArr[0], true);
                    this.leftGoldArr.splice(0, 1);
                }
                this.leftGoldArr.push(jbnode);
            } else if (areaType == 'mid') {
                var posx = Math.random() * 340 - 170;
                var posy = Math.random() * 60 - 80;
                if (this.midGoldArr.length > 100) {
                    this.nodeJb.removeChild(this.midGoldArr[0], true);
                    this.midGoldArr.splice(0, 1);
                }
                this.midGoldArr.push(jbnode);
            } else if (areaType == 'right') {
                var posx = Math.random() * 165 + 225;
                var posy = Math.random() * 160 - 80;
                if (this.rightGoldArr.length > 100) {
                    this.nodeJb.removeChild(this.rightGoldArr[0], true);
                    this.rightGoldArr.splice(0, 1);
                }
                this.rightGoldArr.push(jbnode);
            }
            jbnode.parent = this.nodeJb;
            let jbPos = cc.v2(posx, posy);
            this.posMove(jbnode, jbPos, false, 0.2);
        }
        this.schedule(this.feiJbCallBack, 0.07, count - 1, 0);
        // for (let i = 0; i < count; i++) {
        //     let jbnode = this.createJbNode();
        //     jbnode.setPosition(fromPos);

        //     if (areaType == 'left') {
        //         var posx = Math.random() * 170 - 395;
        //         var posy = Math.random() * 160 - 80;
        //         if (this.leftGoldArr.length > 100) {
        //             this.nodeJb.removeChild(this.leftGoldArr[0], true);
        //             this.leftGoldArr.splice(0, 1);
        //         }
        //         this.leftGoldArr.push(jbnode);
        //     } else if (areaType == 'mid') {
        //         var posx = Math.random() * 340 - 170;
        //         var posy = Math.random() * 60 - 80;
        //         if (this.midGoldArr.length > 100) {
        //             this.nodeJb.removeChild(this.midGoldArr[0], true);
        //             this.midGoldArr.splice(0, 1);
        //         }
        //         this.midGoldArr.push(jbnode);
        //     } else if (areaType == 'right') {
        //         var posx = Math.random() * 165 + 225;
        //         var posy = Math.random() * 160 - 80;
        //         if (this.rightGoldArr.length > 100) {
        //             this.nodeJb.removeChild(this.rightGoldArr[0], true);
        //             this.rightGoldArr.splice(0, 1);
        //         }
        //         this.rightGoldArr.push(jbnode);
        //     }
        //     jbnode.parent = this.nodeJb;
        //     let jbPos = cc.v2(posx, posy);
        //     this.posMove(jbnode, jbPos, false, 0.2);
        // }

    },


    getVipPlayerScriptBySiteID: function (siteID) {
        for (let i = 0, len = this.vipPlayerScriptArr.length; i < len; i++) {
            let vipPlayerCtrl = this.vipPlayerScriptArr[i];
            if (vipPlayerCtrl && siteID === vipPlayerCtrl.getVipSite()) {
                return vipPlayerCtrl;
            }
        }
        return null;
    },

    getPlayerInfoByUserId: function (userID) {
        let playerInfo = null;
        let userInfoCtrl = null;
        if (userID == 0) {
            playerInfo = this.userInfoCtrl;
            return playerInfo
        }
        for (let i = 0; i < this.vipPlayerScriptArr.length; i++) {
            userInfoCtrl = this.vipPlayerScriptArr[i];
            if (userInfoCtrl && userInfoCtrl.vipSite === userID) {
                playerInfo = userInfoCtrl;
                break;
            }
        }
        return playerInfo

    },

    //--------------------------------------------------------------------------------------------------------------------
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

    posMove: function (node, pos, isHuishou, time) {
        if (!time) {
            time = 0.5;
        }
        cc.tween(node)
            .to(time, { position: pos })
            .call(() => {
                if (isHuishou == true && node != null) {
                    this.removeJbNode(node);
                }
            })
            .start();
    },

    // update (dt) {},
});