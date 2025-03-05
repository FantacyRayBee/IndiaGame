

cc.Class({
    extends: require('UINode'),

    properties: {
        pab_waFa : cc.Prefab,
        pab_winCion : cc.Prefab,
        pab_record : cc.Prefab,
        pab_winTepy : cc.Prefab,
        pab_historyRecords : cc.Prefab,
        Atlas_lobby: cc.SpriteAtlas,
        spite_cradBei : cc.SpriteFrame,
    
    },

    ctor: function () {
        this.hideBet = false;          // 记录切后台是否有下注
        this.bigWinnerPlayerId = null; // 大赢家ID
        this.isOneInGame = 0;       // 是否第一次进入游戏 
        this.betTime = 0;           // 记录切后台回来时 重复下注按钮是否显示 
        this.isRepeatBet = false;   // 是否可以重复下注
        this.remaining = -1;       // 等待游戏开始的时间 
        this.startBetTime  = 0;     // 下注时间
        this.isBackStage = true;   // 是否切后台进入游戏
        this.LotteryRecord = null; // 开奖记录f
        this.betIndex = 0;     //玩家下注的下标
        this.betCion = 1;     //玩家下注的金额
        this.myBetCoinAll = 0   //统计自己下注全部金额
        this.paymentSwitch = false;

        this.betCionArr = [10, 50, 100, 200, 500, 1000];  //下注的钱的数组
        this.recordArr = [];                        //大厅历史记录数组
        this.recordBet = [0,0,0,0,0,0];             //记录自己上局下注金额 
        this.recordBetAll = [0,0,0,0,0,0];  
        this.hideBetArr = [0,0,0,0,0,0];            //记录切后台自己上局下注金额 

        this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
        "Sorry, there are not enough gold coins.", //金币不足请充值
        "In the game, unable to exit",                              // 游戏中无法退出
        "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
        "Your cash is insufficient, Please recharge in time!"
        ];
        this.isGameEndStatus = false;
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_SSC_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        this.initNode();
        this.showBetCion();
        this.eventShow();
        this.eventHide();
        this.cashSwitch()
        this.pushpaysuccess =  ClientNotify.register("PUSHPAYSUCCESS",this.onEventMsg,this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg,this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    start () {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: GlobalCfg.PRODUCT_ID,
            isFree: GlobalCfg.GAME_ENTER_ISFREE,       //是否进入免费场
        });
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle("PUSHPAYSUCCESS", this.pushpaysuccess);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().updateSidebarData(true);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_SSC_GAME);
    },

    onEventMsg:function(webData, target){
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if( msgId == "gameservice.login" ){
            self.setLogin(notify)
        } else if ( msgId == "gameservice.gamescene" ) { 
            self.gamescene(notify);
        } else if ( msgId == "gameservice.gamestartnotify" ) {
            self.isGameEndStatus = false;
            self.gamestartnotify()
        } else if ( msgId == "gameservice.callnotify" ) {
            self.callnotify(notify);
        } else if ( msgId == "gameservice.gameendnotify" ) {
            self.isGameEndStatus = true;
            self.gameendnotify(notify,"endGame");
        } else if ( msgId == "gameservice.querymyrecord" ) {
            self.setRecord(notify,1)
        }  else if ( msgId == "gameservice.queryjackpotrecord" ) {
            self.setRecord(notify,0)
        }  else if ( msgId == "gameservice.querybigwinnerrecord" ) {
            self.setRecord(notify,2)
        } else if( msgId == "gameservice.exitgame") {
            SceneManager.getInstance().curSceneType = SceneManager.getInstance().sceneType.LOBBY;
            GameServerManager.clientCloseServer();
            let promise = SceneManager.getInstance().reqUserDataInfo();
            promise.then(() => {
                GlobalCfg.G_COMPONENTS.Audio.playLobby('lobby');
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.CLOSE_SSCGAME_REFRESH_LOBBY, 
                    msgData: {}
                });
                if (CommonFun.getInstance().isValidForScr(self)) {
                    self.node.destroy();
                };   
            }).catch((error) => {
                LoggerUtil.getInstance().log(error);
            });
        } else if (msgId =="gameservice.queryopenrecord") {
            let pab_record = self.node.getChildByName("pab_record");
            if(pab_record) {
                let ctrl = pab_record.getComponent("recordCtrl")
                ctrl.setRecordDate(notify)
            } else {
                let pab_newRecord = cc.instantiate(self.pab_record);
                self.node.addChild(pab_newRecord);
                let ctrl = pab_newRecord.getComponent("recordCtrl")
                ctrl.setRecordDate(notify)
            }
        } else if (msgId == "gameservice.querygameendinfo") {
            if(self.remaining >=5 ) {
                self.gameendnotify(notify,'querygame');
            } else if (self.remaining >= 1) {
                self.cradAct(notify.cards);
                self.showCradTypeAct(notify.winSide);
                self.node_cradKuang.runAction(cc.blink(1, 2));
                self.node_winKuang.runAction(cc.blink(1, 2)) 
            } else {
                self.cradAct(notify.cards);
                self.showCradTypeAct(notify.winSide);
                self.sprite_cradType.node.active = false;
                self.node_cradKuang.active = true;
                self.node_winKuang.active = true;
                for (let i = 0; i < self.node_cradArr.length; i++) {
                    self.node_cradArr[i].scale = 0.63;
                    self.node_cradArr[i].getComponent(cc.Sprite).spriteFrame =  self.spite_cradBei;
                }
                self.betCionAct(6,notify.score/100)
            }
        } else if (msgId == "lobbyservice.pushcurrencychanged") { 
            GlobalCfg.USER_DATAS.userDiamond = notify.deposit + notify.winnings;
            GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, 0);
            let coin = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
            self.lab_coin.string = CommonFun.getInstance().numberToShow(coin);
        } else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SSC, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SSC, SceneManager.getInstance().sceneType.LOBBY);
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
        let msg = result.message;
        if (msgId == "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SSC, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    CommonFun.getInstance().showTips(result.message);
                };
            }
            else {
                CommonFun.getInstance().showTips(result.message);
            };
        }
        else {
            CommonFun.getInstance().showTips(result.message);
        };
    },
    

    cashSwitch: function () {
        if(GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = this.btn_shop.getChildByName('Background').getChildByName('btn_shop');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        this.btn_shop.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch =  GlobalCfg.USER_DATAS.openModules.includes(4);
    }, 

    setLogin:function(notify) {
        LoggerUtil.getInstance().log("notify",notify)
        if(!notify) {return}
        if(!notify.Result){
            this.myId = notify.playerId;
            let diamond = FloatCalculation.accDiv(notify.diamond,100);
            this.lab_coin.string = CommonFun.getInstance().numberToShow(diamond);
            GlobalCfg.USER_DATAS.userDiamond = notify.diamond;
        } else {
            CommonFun.getInstance().showMsgBox("Connection error " + "\n" + "403", "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SSC, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
        
    },

    gamescene:function(notify){
        let status = notify.status;
        let remaining = notify.remaining;
        let jackpot = notify.jackpot;
        let openRecord = notify.openRecord;
        let bigWinner = notify.bigWinner;
        let requester = notify.requester;
        let lastJackpotTime = notify.lastJackpotTime;
        this.bigWinnerPlayerId = bigWinner.bigWinner.playerId;

        this.lab_Jackpot.string = FloatCalculation.accDiv(jackpot,100);
        this.lab_bigWinnerName.string = CommonFun.getInstance().getStrByLength(bigWinner.bigWinner.nickname, 14);
        this.lab_bigWinnerCoin.string = FloatCalculation.accDiv(bigWinner.win,100);
        this.loadHeadSp(bigWinner.bigWinner.imgUrl, 89, this.node_bigWinnerImage);
        if( status == 1 ) {
            this.node_betBtn.active = false;
            this.remaining =  notify.remaining;
            if(this.isBackStage) {
                this.isBackStage = false;
                GameServerManager.send("gameservice.querygameendinfo","QueryGameEndInfoReq",{});
            }

        } else if(status == 0){
            this.startBetTime = remaining;
            this.countDown(remaining,status);
            this.node_betBtn.active = true;
            this.sprite_cradType.node.active = false;
            this.node_cradKuang.active = false;
            this.node_winKuang.active = false;
            for (let i = 0; i < this.node_cradArr.length; i++) {
                this.node_cradArr[i].scale = 0.63;
                this.node_cradArr[i].getComponent(cc.Sprite).spriteFrame =  this.spite_cradBei;
            }
        }

        if (requester) {
            let diamond = FloatCalculation.accDiv(requester.diamond,100);
            this.lab_coin.string = CommonFun.getInstance().numberToShow(diamond);
            GlobalCfg.USER_DATAS.userDiamond = requester.diamond;
        }

        this.jackpotTime(lastJackpotTime)
        this.setSidePool(notify.pools);
        this.insHistoricalRecords(openRecord);
    },

    // 游戏开始
    gamestartnotify:function(){
        this.playAnimation('StartBet');
        this.node_betBtn.active = true;
        this.node_cradKuang.active = false;
        this.node_winKuang.active = false;
    
        for (let i = 0; i < this.myBetLabArr.length; i++) {
           this.myBetLabArr[i].string = "0";
        }

        for (let i = 0; i < this.betLabArr.length; i++) {
            this.betLabArr[i].string = "0";
        }

        for (let i = 0; i < this.node_cradArr.length; i++) {
            this.node_cradArr[i].getComponent(cc.Sprite).spriteFrame =  this.spite_cradBei;
        }

        if( this.myBetCoinAll > 0){
            this.btn_repeat.active = true;
        } else {
            this.btn_repeat.active = false;
        }
        this.myBetCoinAll = 0;
    },

    // 游戏结束
    gameendnotify:function(notify,str){
        let winSide = notify.winSide;
        let cards = notify.cards;
        let after = notify.after;
        let score = notify.score;
        let bigWinner = notify.bigWinner

        this.playAnimation('StopBet');
        this.isBackStage = false;
        this.btn_repeat.active = false;
        this.node_betBtn.active = false;
        this.node_cradKuang.active = true;
        this.node_cradKuang.runAction(cc.blink(4, 10));
        this.cradAct(cards,"isAct");
        this.lab_betTime.string = "Waitting...";
        this.curRoundBet = 0;
        this.scheduleOnce(function() { 
            this.lab_betTime.string = "";
            this.showCradTypeAct(winSide) 
            if( score > 0 && str == "endGame") {
                this.betCionAct(6,Math.floor(score/100))
                this.sscAudioCtrl.playGameSound("touCoin")
                GlobalCfg.USER_DATAS.userDiamond = after;
                this.lab_coin.string = CommonFun.getInstance().numberToShow(after/100);
            }
            this.curRoundAddCoinFinish();
        }, 1.5);
      
    
        if( this.bigWinnerPlayerId != bigWinner.bigWinner.playerId) {
            this.loadHeadSp(bigWinner.bigWinner.imgUrl, 89, this.node_bigWinnerImage);
            this.lab_bigWinnerName.string = CommonFun.getInstance().getStrByLength(bigWinner.bigWinner.nickname, 14);
            this.lab_bigWinnerCoin.string = FloatCalculation.accDiv(bigWinner.win,100);
        }
      

        let pab_record = this.node.getChildByName("pab_record");
        if(pab_record){
            GameServerManager.send("gameservice.queryopenrecord","QueryOpenRecordReq",{});
        }

        if(!this.isRepeatBet) {
            this.recordBet = [0,0,0,0,0,0];                  
            this.recordBetAll = [0,0,0,0,0,0];
        } else {
            this.recordBet = [0,0,0,0,0,0];
            for (let i = 0; i < this.recordBetAll.length; i++) {
                this.recordBet[i] = this.recordBetAll[i];
                this.recordBetAll[i] = 0 ;
            }
        }
        this.isRepeatBet = false;
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betCionArr[0] || 0;
            minLimit *= 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.myBetCoinAll);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    //下注通知
    callnotify:function(notify) {
        let playerId = notify.playerId;
        let side = notify.side;
        let allAmount = notify.allAmount/100;
        let amount = notify.amount/100;
        let after = FloatCalculation.accDiv(notify.after,100);
        this.betLabArr[side].string = allAmount;
       
        if( this.myId == playerId){
            this.hideBet = true;
            this.isRepeatBet = true;
            this.sscAudioCtrl.playGameSound("otherCoin")
            this.lab_coin.string = CommonFun.getInstance().numberToShow(after);
            GlobalCfg.USER_DATAS.userDiamond = notify.after;
            this.betCionAct(side,amount);
            this.recordBetAll[side] = notify.selfAll;
            this.myBetCoinAll += notify.amount;
            this.hideBetArr[side] = notify.selfAll;
        } 
    },

    btnClick:function(button){
        let btnName = button.node.name;
        
        if( btnName == "btn_close") { 
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            if (this.myBetCoinAll > 0 && this.isGameEndStatus == false) {
                CommonFun.getInstance().showMsgBox( this.tipsLabel[0],"YES_NO",()=>{
                    GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
                },false);
            } else { 
                GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
            }
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton(); 
        if ( btnName == "btn_shop") {
            CommonFun.getInstance().showSmallAddCash();
        } else if ( btnName == "btn_waFa") {
            let pab_waFa = cc.instantiate(this.pab_waFa);
            this.node.addChild(pab_waFa);
        } else if ( btnName == "btn_zhanJi" ||  btnName == "btn_jackpot") {
            GameServerManager.send("gameservice.queryjackpotrecord","QueryJackpotRecordReq",{});

        }else if (btnName == "btn_bigWinner"){ 
            GameServerManager.send("gameservice.querybigwinnerrecord","QueryBigWinnerRecordReq",{});
        } else if ( btnName == "btn_jia") {
            this.showBetCion("jia")
            this.sscAudioCtrl.playGameSound("start")
        } else if ( btnName == "btn_jian") {
            this.showBetCion("jian");

        } else if ( btnName == "btn_max") {
            this.showBetCion("max");
        } else if (btnName == "btn_set") {
            this.callReq(0)
        } else if (btnName == "btn_10X") {
            this.callReq(1)
        } else if (btnName == "btn_6X") {
            this.callReq(2)
        } else if (btnName == "btn_5X") {
            this.callReq(3)
        } else if (btnName == "btn_4X") {
            this.callReq(4)
        } else if (btnName == "btn_3X") {
            this.callReq(5)
        } else if ( btnName == "btn_record") {
            GameServerManager.send("gameservice.queryopenrecord","QueryOpenRecordReq",{});
        } else if ( btnName == "btn_repeat") {
            this.repeatBet();
        }
    },

    initNode:function(){
        CommonFun.getInstance().hidProgress();
        this.btn_jian = this.node.getChildByName("btn_jian");
        this.btn_jia = this.node.getChildByName("btn_jia");
        this.node_score = this.node.getChildByName("node_score");
        this.node_betBtn =  this.node.getChildByName("node_betBtn");
        this.btn_shop = this.node.getChildByName("btn_shop");
        this.StartBetting =  this.node.getChildByName("StartBetting").getComponent(sp.Skeleton);
        this.StopBetting =  this.node.getChildByName("StopBetting").getComponent(sp.Skeleton);
        this.btn_repeat = this.node.getChildByName("btn_repeat");
        this.node_crad01 = this.node.getChildByName("node_crad").getChildByName("back_01");
        this.node_crad02 = this.node.getChildByName("node_crad").getChildByName("back_02");
        this.node_crad03 = this.node.getChildByName("node_crad").getChildByName("back_03");
        this.node_cradKuang = this.node.getChildByName("bg").getChildByName("node_cradKuang");
        this.node_winKuang = this.node.getChildByName("bg").getChildByName("node_winKuang");
        this.node_bigWinner = this.node.getChildByName("node_bigWinner").getChildByName("node_user");
        this.node_HistoricalRecords = this.node.getChildByName("node_HistoricalRecords");
        this.node_new = this.node.getChildByName("bq_new");
        this.node_bigWinnerImage = this.node_bigWinner.getChildByName("node_mask").getChildByName("tx").getComponent(cc.Sprite);
        this.sprite_cradType = this.node.getChildByName("sprite_cradType").getComponent(cc.Sprite);


        this.node_labAll = this.node.getChildByName("node_labAll");
        this.lab_Jackpot = this.node.getChildByName("node_jackpot").getChildByName("lab_Jackpot").getComponent(cc.Label);
        this.lab_bigWinnerCoin = this.node_bigWinner.getChildByName("lab_bigWinnerCoin").getComponent(cc.Label);
        this.lab_bigWinnerName = this.node_bigWinner.getChildByName("lab_bigWinnerName").getComponent(cc.Label);
        this.lab_betCion = this.node.getChildByName("lab_betCion").getComponent(cc.Label);
        this.lab_coin = this.node.getChildByName("lab_coin").getComponent(cc.Label);
        this.lab_betTime = this.node.getChildByName("node_crad").getChildByName("lab_betTime").getComponent(cc.Label);


        this.sscAudioCtrl = this.node.getChildByName("sscAudioCtrl").getComponent("sscAudioCtrl");
        this.sscAudioCtrl.playGameSound("touCoin");

        this.node_cradArr = [ this.node_crad01, this.node_crad02, this.node_crad03];

        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            let btn =  btnArr[i].node
            if (btn.name != "btn_mask") {
                if (btn.name == "btn_close") {
                    btnArr[i].node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this); 
                }
                else {
                    btnArr[i].node.on("click", this.btnClick, this); 
                };
            }
        }

        this.betLabArr = [ 
            this.FindNode('lab_setAll'),this.FindNode('lab_pureSeqAll'),this.FindNode('lab_seqAll'),
            this.FindNode('lab_colorAll'),this.FindNode('lab_pailAll'),this.FindNode('lab_hifhCardAll')
        ]
       
        this.myBetLabArr = [ 
            this.FindNode('lab_mySet'),this.FindNode('lab_myPureSeq'),this.FindNode('lab_mySeq'),
            this.FindNode('lab_myColor'),this.FindNode('lab_myPail'),this.FindNode('lab_myHifhCard')
        ]

    },

    // 拉取我的记录数据
    setRecord : function (notify,num) {
        let nameArr = ['jackpot','myhistory','bigWinner']
        let pab_historyRecords = this.node.getChildByName("pab_historyRecords");
        if(pab_historyRecords) {
            let Ctrl = pab_historyRecords.getComponent("historyRecordsCtrl");
            Ctrl.showUI(nameArr[num]);
            Ctrl.showDate(nameArr[num],notify.list)
        } else {
            let newPab = cc.instantiate(this.pab_historyRecords);
            let Ctrl = newPab.getComponent("historyRecordsCtrl");
            this.node.addChild(newPab);
            Ctrl.showUI(nameArr[num]);
            Ctrl.showDate(nameArr[num],notify.list);
        }
    },

    // 重复下注
    repeatBet:function(){
        let myBetCoinAll = 0
        for (let i = 0; i < this.recordBet.length; i++) {
            myBetCoinAll += this.recordBet[i] 
        }

        if( myBetCoinAll <= GlobalCfg.USER_DATAS.userDiamond) {
            for (let i = 0; i < this.recordBet.length; i++) {
                let  coin = this.recordBet[i];
                if( coin >0 ){
                    this.callReq(i,coin)
                }
            }
        } else {
            CommonFun.getInstance().showMsgBox( this.tipsLabel[4],"SHOP",()=>{
                CommonFun.getInstance().showSmallAddCash();
            },false);
        }
    },

    //显示离上一次头奖时间
    jackpotTime:function(lastJackpotTime){
        let time = Math.floor(lastJackpotTime/1000)
        let h  = Math.floor(time/3600);  
        let f =  (Math.floor(time/60))%60;
        let s = time%60;
        if(h<10){ h = h <= 0 ? "00" : "0" + h;}
        if(f<10){ f = f <= 0 ? "00" : "0" + f; }
        if(s<10){ s = s <= 0 ? "00" : "0" + s; }
        this.FindNode("lab_time").string = h + ":" + f + ":" + s;
    },

    //设置玩家下注的金额
    setSidePool:function(SidePool){
        let myCion = 0;
        let play = 0;
        let arr  = SidePool;
        for (let i = 0; i < arr.length; i++) {
            let date = arr[i];
            let coin = this.betLabArr[i].string;
            myCion = date.self/100;
            let betCion = Math.abs(Number(coin) - date.all/100);
           
            if( this.isOneInGame > 0 ){
                this.betCionAct(date.side,betCion,"play");
            }

            if(betCion > 0 ) {
                play++
            }

            this.betLabArr[i].string = date.all/100;
            this.myBetLabArr[i].string = myCion;
        }
        this.isOneInGame++;
        if (play > 0) {
            this.sscAudioCtrl.playGameSound("otherCoin")
        }
    },

    //倒计时
    countDown:function(time,status){
        let newTime = time;
        if( status==1 ) {
            this.lab_betTime.string = "Waitting:" + newTime;
        } {
            if(newTime<14) {
                this.lab_betTime.string = loToLanguage.Betting[language] + newTime;
            } else {
                this.lab_betTime.string = "Flipping card...";
            }
        }
    },

    // 玩家下注金币向上的动作
    betCionAct:function(num,coin,str){ 
        if( coin > 0){
            if(str != "play"){this.sscAudioCtrl.playGameSound("otherCoin")}
            let betPosArr =  [cc.v2(-483,-83),cc.v2(-287,-83),cc.v2(-92,-83),cc.v2(102,-83),cc.v2(295,-83),cc.v2(490,-83),cc.v2(-450,-288)]   
            let pos = betPosArr[num];
            let time = num == 6 ? 1 :0.6;
            let pab_winCion = cc.instantiate(this.pab_winCion);
            pab_winCion.setPosition(pos);
            this.node_score.addChild(pab_winCion);
            pab_winCion.getChildByName("lab_coin").getComponent(cc.Label).string = "+" + coin
    
            cc.tween(pab_winCion)
            .tag(1)
            .to(time, {  position: cc.v2(pos.x, pos.y+55)})
            .call(() => { 
                pab_winCion.destroy()
             })
            .start()
        }
    },

    //显示那个牌型赢的动画
    showCradTypeAct:function(winType){
        let ctarType = [
            ["SET","PURE SEQ","SEQ","COLOR","PAIR","HIGH CARD"],
            ["सेट","शुद्ध","अनुक्रम","रंग","जोड़ा","उच्च कार्ड"],
            ["سیٹ","خالص","ترتیب","رنگ","جوڑا","بلند کارڈ"],
            ["সেট","শুদ্ধ","ক্রম","রং","জোড়া","বড় তাস"],
        ]
        let sprite_cradTypeArr = ["bg_set","bg_pure","bg_seq","bg_color","bg_pair","bg_high"]
        let cradTypeArr = [cc.v2(-488,-85),cc.v2(-294,-85),cc.v2(-100,-85),cc.v2(94,-85),cc.v2(290,-85),cc.v2(486,-85)]
        let pos = cradTypeArr[winType];

        this.node_winKuang.active = true;
        this.node_winKuang.setPosition(pos);
        this.node_winKuang.runAction(cc.blink(4, 6)) 

        this.sprite_cradType.node.active = true;
        this.FindNode("lab_cradType").string = ctarType[language-1][winType];
        this.sprite_cradType.spriteFrame = this.Atlas_lobby.getSpriteFrame(sprite_cradTypeArr[winType]);
    },

    //游戏结束后显示牌型
    cradAct:function(cards,str) {
        let arr = cards;
        for (let i = 0; i < this.node_cradArr.length; i++) {
            let cradNode = this.node_cradArr[i];
            cradNode.scale = 0.63;
            cradNode.getComponent(cc.Sprite).spriteFrame =  this.spite_cradBei;
            let cradScrpit = cradNode.getComponent("sscCradCtrl");
            if(str == "isAct") {
                cc.tween(cradNode)
                .tag(1)
                .delay(i*0.5)
                .to(0.25, { scaleX:0})
                .call(() => {  
                    cradScrpit.setCardInfo(arr[i])
                })
                .to(0.25,{ scaleX:0.63})
                .start()
            }else{
                cradScrpit.setCardInfo(arr[i])
            }
        }
    },

    //播放开始停止下注动画
    playAnimation:function(str) {
        if( str == 'StartBet') {
            this.sprite_cradType.node.active = false;
            this.sscAudioCtrl.playGameSound("start")
            this.StopBetting.node.active = false;
            this.StartBetting.node.active = true;
            this.StartBetting.addAnimation(0, "animation", false); 
        } else if ( str == 'StopBet') {
            this.sscAudioCtrl.playGameSound("stopBet")
            this.StopBetting.node.active = true;
            this.StartBetting.node.active = false;
            this.StopBetting.addAnimation(0, "animation", false); 
        }
    },

    //实例化历史记录
    insHistoricalRecords:function(list){
        if(this.LotteryRecord) {
            if(JSON.stringify(this.LotteryRecord) == JSON.stringify(list)) {
                this.LotteryRecord = list;
                return
             }
        } 
        this.LotteryRecord = list;

        this.node_HistoricalRecords.destroyAllChildren();
        let len = list.length >10 ? list.length -10 : 0;
        let count  = 0
        for (let i = len; i < list.length; i++) {
            count++
            if(count<=10) {
                let pab_winTepy = cc.instantiate(this.pab_winTepy);
                this.node_HistoricalRecords.addChild(pab_winTepy);
                let Ctrl = pab_winTepy.getComponent('winTepyCtrl');
                Ctrl.showNode("lobbyRecord",list[i])
                this.recordArr.push(pab_winTepy);
            }
        }
        if(this.recordArr.length > 0){
            this.recordArr[this.recordArr.length-1].getChildByName("bq_new").active = true;
        }
    },

    //查找组件
    FindNode:function(nodeName){
        let labArr = this.node.getComponentsInChildren(cc.Label);
        for (let i = 0; i < labArr.length; i++) {
            let node =  labArr[i].node
            if(nodeName == node.name){
                return labArr[i]
            }
        }
    },

    // 显示下注的金币 
    showBetCion:function(str){
        if(GlobalCfg.USER_DATAS.gamePattern == 1){
            this.betCionArr = [1, 10, 50, 100, 200, 500];
        }
        let len = this.betCionArr.length-1;
        if(str == "jia") {
            this.betIndex++;
            if( this.betIndex >= len){
                this.btn_jia.active = false;
            }else {
                this.btn_jia.active = true;
                this.btn_jian.active = true;
            }

        } else if ( str == "jian") {
            this.betIndex--;
            if(this.betIndex <=0 ) {
                this.btn_jian.active = false;
            } else {
                this.btn_jia.active = true;
                this.btn_jian.active = true;
            }

        } else if (str == "max") {
            this.betIndex =  len;
            this.btn_jia.active = false;
            this.btn_jian.active = true;

        } else {
            this.btn_jia.active = true;
            this.btn_jian.active = false;
        }

        if(this.betIndex >= 0 && this.betIndex <= len) {
            this.lab_betCion.string = this.betCionArr[this.betIndex]; 
            this.betCion = this.betCionArr[this.betIndex]; 
        }
    },

    LoginReq:function(){
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId, 
            token : GlobalCfg.USER_DATAS.token,  
            fromid: GlobalCfg.PRODUCT_ID,
            isFree: GlobalCfg.GAME_ENTER_ISFREE,       //是否进入免费场
        });
    },

    callReq:function(CardType,coin){
        //playnow模式下 首充玩家 弹VIP弹框
        if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
            CommonFun.getInstance().showVipRechargeToast();
            return false;
        }
        let amount = 0
        if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {   //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players. Add cash now to become a premium player.", "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash();
            }, false);
            return
        };
        if (coin) {
            amount = coin;
        } 
        else {
            amount = this.betCion * 100;
            if (amount > GlobalCfg.USER_DATAS.userDiamond) {
                CommonFun.getInstance().showMsgBox(this.tipsLabel[4], "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash();
                }, false);
                return
            }
        };
        GameServerManager.send("gameservice.call", "CallReq", {
            amount: amount, 
            side : CardType,  
        });
    },


     // 游戏切回到前台
     eventShow:function(){
        cc.game.on(cc.game.EVENT_SHOW, function () {  
            GameServerManager.hideFilterMag(2,function () {
                GameServerManager.send("gameservice.gamescene","GameSceneReq",{});
            })
                this.isBackStage = true;
            this.inGameShowchongFuBtn()
        }, this);
    },

    //游戏切入到后台
    eventHide:function(){
        cc.game.on(cc.game.EVENT_HIDE, function () {   
            // cc.Tween.stopAll();
            cc.Tween.stopAllByTag(1);
            this.node_score.destroyAllChildren();
            GameServerManager.hideFilterMag(1)
            this.inGameShowchongFuBtn("HT")
        }, this);
    },
    
    inGameShowchongFuBtn:function(str){  // 切后台进入游戏是否可以重复下注（客户端处理服务器没空）
        if(str == "HT") {
            this.betTime = this.startBetTime;
            let timeStamp = Date.parse(new Date());
            cc.sys.localStorage.setItem("timeStamp", timeStamp);
        } else {
            let timeStamp = Date.parse(new Date());
            let newTimeStamp = cc.sys.localStorage.getItem("timeStamp"); 
            let time = (timeStamp - newTimeStamp)/1000;
            if( time > this.betTime+6) {  
                if( time < 21 + this.betTime+6) {     // 下局
                    if(this.hideBet) {
                        this.recordBet = [0,0,0,0,0,0];
                        for (let i = 0; i < this.hideBetArr.length; i++) {
                            this.recordBet[i] = this.hideBetArr[i];
                        }
                        this.hideBet = false;
                        this.isRepeatBet = true;
                        this.btn_repeat.active = true;
                    } else {
                        this.isRepeatBet = false;
                        this.btn_repeat.active = false;
                    }
                } else {   //下下局
                    this.isRepeatBet = false;
                    this.btn_repeat.active = false;
                    this.recordBet = [0,0,0,0,0,0];     
                    this.recordBetAll = [0,0,0,0,0,0];   
                    this.myBetCoinAll = 0;  
                }
            }
        }
    },


    



    // start () {},
    // update (dt) {},
});
