

cc.Class({
    extends: require('UINode'),

    properties: {
        pab_coin : cc. Prefab,
        pab_player : cc. Prefab,
        pab_playersList : cc. Prefab,
        pab_winorlose : cc. Prefab,
        pab_chart : cc. Prefab,
        pab_chat : cc. Prefab,
        Sprite_winorlose : [cc.SpriteFrame],
        btn_openMenu: cc.Button,
    },

    ctor: function () {
        this.recordlist = [];           // 历史记录，length最大为100, 此数据只在当前脚本处理修改，其余使用均为引用
        this.my_playerId = null;
        this.myNodeCtrl = null;        // 自己脚本
        this.gameCount = 0;            //记录玩家3轮不下注踢出VIP
        this.myScore = 0;              // 结算自己输赢分数
        this.limitBetPlayAim = true;   //限制普通玩家吸住播放音效    
        this.betStatus = true;      //自己是否可以点击下注
        this.userBtnCion = 5000;   // 玩家默认下注的金额
        this.myDragonCoin = 0;      // 自己龙的金币
        this.mytieCoin = 0;         // 自己和的金币
        this.mytigerCoin = 0;       // 自己虎的金币
        this.dragonCoinAll = 0;     // 龙的总下注
        this.tieCoinAll = 0;        // 和的总下注
        this.tigerCoinAll = 0;      // 虎的总下注
        this.allPlayerWinArr = [];
        this.winorloseArr = [];      //存放输赢的走势图
        this.userArryNode = [];    // 存放玩家的数组(Vip)
        this.dragonChipArr = [];   // 存放龙的区域的筹码
        this.tieChipArr = [];      // 存放中间的区域的筹码
        this.tigerChipArr = [];     // 存放老虎的区域的筹码
        this.repeatBetArr = [0,0,0]      // 存放重复下注的数据
        this.coinAllArr = [this.dragonChipArr,this.tigerChipArr,this.tieChipArr];
        this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
        "Sorry, there are not enough gold coins.", //金币不足请充值
        "In the game, unable to exit",                              // 游戏中无法退出
        "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
        "Can't bet temporarily",                    //请选择下注的范围
        "Your cash is insufficient, Please recharge in time!"
        ];
        this.isGameEndStatus = false;
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
    },


    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_LHD_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        this.initLocalBtn();  // 实例化节点
        this.loadSkeleData();
        this.initCoinPool();  // 创建金币对象池
        this.eventShow();
        this.eventHide();
        this.cashSwitch();
        this.msgHandleOpen = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg,this); 

        this.sendReqCtrl.loginReq();
    },

    start () {
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        this.unschedule(this.scheduleBetSpineTimeCallback);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandleOpen);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_LHD_GAME);
    },

    onEventMsg:function(webData,target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if( msgId == "gameservice.login" ){
            self.dealLoginData(notify);
        } else if (msgId == "gameservice.joinvipnotify" ) {
            self.joinvipnotify(notify)
        } else if (msgId == "gameservice.shortmessagenotify" ) {
            self.chatnotify(notify) 
        } else if (msgId == "gameservice.callnotify") {
            self.callnotify(notify)    //下注通知
        } else if (msgId == "gameservice.call"){
            self.callAck(notify);
        } else if (msgId == "gameservice.gamesettlenotify") {
            self.isGameEndStatus = true;
            self.gameovernotify(notify);
        } else if (msgId == "gameservice.updatecoinnotify"){
            self.updateUserCoin(notify);
        }else if (msgId == "gameservice.exitroom") {
            self.outgamenotify();
        }else if (msgId == "gameservice.roomstatuschangednotify"){
            // 游戏状态改变 status ，0 可下注，1 不可下
            if (notify.status == 0) {
                self.betStatus = true;
                self.startgamenotify();
            }
            else if (notify.status == 1) {
                self.betStatus = false;
            }
        } else if( msgId == "gameservice.playerlist") {
            self.playerlist(notify)
        } else if (msgId == "gameservice.gamescene"){
            self.isGameEndStatus = false;
            let sceneInfo = notify.sceneInfo;
            let requester = notify.requester;
            self.GameSceneRefresh(sceneInfo, requester);
        } else if (msgId == "gameservice.playernumberchangednotify"){
            let totalPlayersNum = notify.num;
            self.lab_palyersAll.string = totalPlayersNum;
        }
        
         else if ( msgId == "gameservice.playerwinloseinfonotify") {
            self.playerwinloseinfonotify(notify)
        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN) {
            let lab_repeat = cc.find('Canvas/node_playerBetBtn/btn_repeat_grey/lab_repeat'); 
            let btn_repeatBet = cc.find('Canvas/node_playerBetBtn/btn_repeatBet/Background/lab_repeat'); 
            if(lab_repeat) lab_repeat.getComponent(cc.Label).string = lhdLanguage.lab_repeat[language];
            if(btn_repeatBet) btn_repeatBet.getComponent(cc.Label).string = lhdLanguage.lab_repeat[language];

        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let coin = notify.deposit + notify.winnings;
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.setNodeCtrl(self.my_playerId);
            ctrl && ctrl.shePlayCion(coin);
            self.myNodeCtrl.shePlayCion(coin);
        } 
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LHD, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            let betCoinAll = self.myDragonCoin + self.mytieCoin + self.mytigerCoin;
            if (betCoinAll > 0 && self.isGameEndStatus == false) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", () => {
                    if (CommonFun.getInstance().isValidForScr(self.sendReqCtrl) && self.sendReqCtrl.OutGameReq) {
                        self.sendReqCtrl.OutGameReq();
                    }
                }, false);
            } 
            else {
                if (CommonFun.getInstance().isValidForScr(self.sendReqCtrl) && self.sendReqCtrl.OutGameReq) {
                    self.sendReqCtrl.OutGameReq();
                }
            }
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("lhd");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LHD, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    cashSwitch:function(){
        if(GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = cc.find('Canvas/btn_shop/Background/icon_chipsshop');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        this.btn_shop.node.active = GlobalCfg.USER_DATAS.openModules.includes(4) && GlobalCfg.game_state == 0;
        this.btn_openMenu.node.active = GlobalCfg.game_state == 0;
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

      // 监听错误消息
      checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `龙虎斗游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LHD, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        } 
        else if (msgId === "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LHD, SceneManager.getInstance().sceneType.LOBBY);
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
        }
    },

    btnClick:function(button){
        let pos = button.node.getPosition()
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_chat") {  
            let ctrl = this.setNodeCtrl(this.my_playerId);
            if(ctrl){
                let pab_chat = cc.instantiate(this.pab_chat);
                let ctrl = pab_chat.getComponent("chatCtrl");
                ctrl.setPlayerSeat(this.getVIPistMe())
                this.node.addChild(pab_chat);
            } 
            else {
                CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
            }
        } 
        else if (btnName == "btn_playersAll") {
            this.sendReqCtrl.playerlistReq(1,12);
        } 
        else if (btnName == "btn_trendChart") {
            this.gamerecordlist();
        } 
        else if (btnName == "btn_shop") {
            CommonFun.getInstance().showSmallAddCash()
        } 
        else if (btnName == "btn_10") {
            let num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
            this.userBtnCion = num * 100;
            this.choiceBetButton(button);
        } 
        else if (btnName == "btn_50") {
            let num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
            this.userBtnCion = num * 100;
            this.choiceBetButton(button);

        } 
        else if (btnName == "btn_100") {
            let num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
            this.userBtnCion = num * 100;
            this.choiceBetButton(button);

        } 
        else if (btnName == "btn_1000") {
            let num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
            this.userBtnCion = num * 100;
            this.choiceBetButton(button);

        } 
        else if (btnName == "btn_2000") {
            let num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
            this.userBtnCion = num * 100;
            this.choiceBetButton(button);
        } 
        else if (btnName == "btn_01") {
            this.clickVIPuP(0);
        } 
        else if (btnName == "btn_02") {
            this.clickVIPuP(1);
        } 
        else if (btnName == "btn_03") {
            this.clickVIPuP(2);
        } 
        else if (btnName == "btn_04") {
            this.clickVIPuP(3);
        } 
        else if (btnName == "btn_05") {
            this.clickVIPuP(4);
        } 
        else if (btnName == "btn_06") {
            this.clickVIPuP(5);
        } 
        else if (btnName == "btn_repeatBet") {
            this.repeatPreviousRound("bet");
        } 
        else if (btnName == "btn_dw") {
            GameServerManager.clientCloseServer();
        } 
        else if (btnName == "btn_lw") {
            GameServerManager.connectServer();
        } 
        else if (btnName == "btn_openMenu") {
            CommonFun.getInstance().showGameMenu(false);
        }
    },

    choiceBetButton: function (button){
        let scale = 1.1;
        let btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_1000, this.btn_2000];
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

    dealLoginData(notify){
        let sceneInfo = notify.sceneInfo;           // 场景信息
        let configInfo = notify.configInfo;         // 配置信息
        let requester = notify.requester;           // 玩家信息
        this.lhdAudioCtrl.playGameMusic('lhd');

        this.GameSceneRefresh(sceneInfo, requester);
    },

    GameSceneRefresh:function(sceneInfo,requester){
        if(!sceneInfo){
            CommonFun.getInstance().reportToTelegram("LHDGAME"+"服务器下发的非正确消息中结构体异常, 内容为===>"+JSON.stringify(sceneInfo));
            return;
        }
        if(!requester){
            CommonFun.getInstance().reportToTelegram("LHDGAME"+"服务器下发的非正确消息中结构体异常, 内容为===>"+JSON.stringify(requester));
            return;
        }
        // 玩家信息
        let userInfo = requester.userInfo;
        this.my_playerId = userInfo.playerId;
        this.showBetScore(requester.betInfo,"me");
        this.myNodeCtrl = this.lhdPlayer.getComponent("lhdPlayerCtrl");
        this.myNodeCtrl.setUserData(userInfo, requester.pos);
        this.myCoin = userInfo.diamond;
        this.ske_endWin.skeletonData = null;
        this.ske_endWin.node.active = false;
        this.ske_vs_longhu.skeletonData = null;
        this.ske_vs_longhu.node.active = false;
        this.unscheduleAllCallbacks();

        // 场景
        let status = sceneInfo.status;                      // 当前状态
        let openRecord = sceneInfo.openRecord;              // 下注记录
        this.recordlist = openRecord;                       // 获取历史记录
        let runtime = sceneInfo.currentStatusLeftMs;        // 当前状态剩余时间
        let totalBet = sceneInfo.totalBet;                  // 总下注信息
        this.showBetScore(totalBet);
        this.lab_palyersAll.string = sceneInfo.playerNum;   // 总玩家人数
        let vipPlayer = sceneInfo.vipPlayer;                // vip玩家信息
        this.setVipPlayers(vipPlayer)
        this.lhdCradCtrl.gameStartInItCrad(status);
        this.inItHistoricalRecord(openRecord, status, runtime);


        this.ske_kuang_long.active = false; 
         this.ske_kuang_long.active = false; 
        this.ske_kuang_long.active = false; 
        this.ske_kuang_hu.active = false; 
         this.ske_kuang_hu.active = false; 
        this.ske_kuang_hu.active = false; 
        this.ske_kuang_ping.active = false;
         this.ske_kuang_ping.active = false; 
        this.ske_kuang_ping.active = false;

        if(status == 0){         // 可以下注
            LoggerUtil.getInstance().log("当前是可下注状态：",status);
            this.betStatus = true;
            this.showRuntime(runtime);
        } else if(status == 1){   // 结束
            LoggerUtil.getInstance().log("当前是 不可下注 状态：",status);
            this.betStatus = false;
            this.ske_huo_hu.active = false;
            this.ske_huo_long.active = false;
            this.lab_gameTime.string = 0;
            this.btn_repeatBet.node.active = false;
            this.endbetnotify();
            this.showRuntime(runtime);
        }
    },

    // 货币更新广播
    updateUserCoin:function(notify){
        let balance = notify.balance;   
        let playerId = notify.playerId;
        let reason = notify.reason;
        if(reason == 1 && playerId == this.myNodeCtrl.playerid){
            this.myNodeCtrl.showPlayCion(balance);
        }
    },

    // 查看历史记录信息  
    gamerecordlist:function() {
        let pab_chart = cc.instantiate(this.pab_chart);
        let ctrl = pab_chart.getComponent("lhdTrendChart");
        if(ctrl){
            ctrl.setChartDate(this.recordlist);
            this.node.addChild(pab_chart);
        } 
    },

    // 自己下注 ACK
    callAck:function(notify){
        let totalBet = notify.totalBet;
        let after = notify.after;
        let side = notify.side;
        this.lhdAudioCtrl.playGameSound("mytouCoin");
        let startNode = this.lhdPlayer;
        let endNode = null;
        this.showBetScore(totalBet,"me");
        this.myNodeCtrl.headAct("me");
        this.myNodeCtrl.showPlayCion(after);
        LoggerUtil.getInstance().log("//////////",GlobalCfg.USER_DATAS.userDiamond);
        endNode = this.betNodeArr[side];
        for (let i = 0; i < 4; i++) {  // vip透支规定4个币
            this.createEnemy(startNode,endNode,side,true);
        }
    },

    // 下注广播
    callnotify:function(notify){
        let vipBet = notify.vipBet;                 // vip下注
        let civilianBet = notify.civilianBet;       // 平民下注
        let poolBet = notify.poolBet;               // 总下注情况
        let betCoinByBetTypes = (type, pos)=>{
            let endNode = this.betNodeArr[type];
            // if(this.my_playerId != playerId){  // 自己在VIP座位上不显示投注金币动作
            for (let i = 0; i < 4; i++) {  // vip透支规定4个币
                this.createEnemy(this.getPlayNode(pos),endNode,type,true)  
            }
            
            // }
        };
        for (let i = 0; i < vipBet.length; i++) {
            const vipCall = vipBet[i];
            let after = vipCall.after;
            let pos = vipCall.pos;
            let bet = vipCall.bet;
            if(bet.dragon > 0){
                let type = 0;
                betCoinByBetTypes(type, pos);
            }
            if(bet.tiger > 0){
                let type = 1;
                betCoinByBetTypes(type, pos);
            }
            if(bet.tie > 0){
                let type = 2;
                betCoinByBetTypes(type, pos);
            }
            let cral = this.getPlayerInfoByUserId(pos);
            this.lhdAudioCtrl.playGameSound("otherCoin");
            if(cral){
                cral.showPlayCion(after);
                cral.headAct();
                
            }
        }
        
        
        // 总下注
        let dragonAllCoin = poolBet.dragon > 0 ? poolBet.dragon : 0;
        let tigerAllCoin = poolBet.tiger > 0 ? poolBet.tiger : 0;
        let tieAllCoin = poolBet.tie > 0 ? poolBet.tie : 0;
        this.lab_dragonAllCion.string = dragonAllCoin / 100;
        this.lab_tigerAllCion.string = tigerAllCoin / 100;
        this.lab_tieAllCion.string = tieAllCoin / 100;

        // 平民下注
        if(civilianBet && civilianBet.dragon > 0){
            this.lhdAudioCtrl.playGameSound("otherCoin");
            this.onVipBet(0);
        }
        if(civilianBet && civilianBet.tiger > 0){
            this.lhdAudioCtrl.playGameSound("otherCoin");
            this.onVipBet(1);
        }
        if(civilianBet && civilianBet.tie > 0){
            this.lhdAudioCtrl.playGameSound("otherCoin");
            this.onVipBet(2);
        }

    },

    // 模拟非vip下注
    onVipBet:function(type){
        let startNode =  this.btn_playersAll.node;
        startNode.setPosition(-539,-319);
        let endNode = this.betNodeArr[type];
        for (let k = 0; k <6; k++) {
            this.createEnemy(startNode,endNode,type,true)   
        }

        cc.tween(startNode)
        .tag(1)
        .to(0.1, { position: cc.v2(startNode.x, startNode.y+5)})
        .to(0.1, { position: cc.v2(-539, -319)})
        .start()

    },

    // 3轮不下注退出VIP座位
    outVIPSeat:function(){
        let betCoinAll = this.myDragonCoin + this.mytieCoin + this.mytigerCoin;
        let ctrl = this.setNodeCtrl(this.my_playerId);
        if(betCoinAll<=0 && ctrl){
            this.gameCount++;
            if(this.gameCount >=3 ){
                this.sendReqCtrl.JoinVipPosReq(-1)
                this.gameCount = 0;
            }
        } else {
            this.gameCount = 0;
        }

    },

    // 游戏开始 
    startgamenotify:function(){
        this.startBetAim();
        this.showCradGuangQuan(true);
        this.betStatus = false;
        this.tieCoinAll = 0;
        this.dragonCoinAll = 0;
        this.tigerCoinAll = 0;

        this.myDragonCoin = 0;     
        this.mytieCoin = 0;       
        this.mytigerCoin = 0;   
       
        this.lab_dragonAllCion.string = 0;
        this.lab_tigerAllCion.string = 0;
        this.lab_tieAllCion.string = 0;
        this.lab_dragaonBet.string  = "Click to bet";
        this.lab_tieBet.string  = "Click to bet";
        this.lab_tigerBet.string  = "Click to bet";

        this.coinAllArr[0] = [];
        this.coinAllArr[1] = [];
        this.coinAllArr[2] = [];
    },

    // 结束下注通知
    endbetnotify:function(){
        this.betStatus = false;
        this.lhdAudioCtrl.playGameSound("1s");
        let spine = this.skeleDataMap.get("Stop Betting");
        this.sek_stopBetig.skeletonData = spine;
        this.sek_stopBetig.addAnimation(0, "animation", false); 
        GlobalCfg.ACT_SCENE_CTRL.ske_huo_hu.active = false;
        GlobalCfg.ACT_SCENE_CTRL.ske_huo_long.active = false;
        this.btn_repeatBet.node.active = false;

        this.repeatBetArr[0] = this.myDragonCoin;     
        this.repeatBetArr[1] = this.mytigerCoin;       
        this.repeatBetArr[2] = this.mytieCoin;
    },

    // 玩家退出游戏
    outgamenotify:function() {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LHD, SceneManager.getInstance().sceneType.LOBBY);
    },

    // 获取普通玩家列表
    playerlist:function(notify) {
        this.lab_palyersAll.string = notify.total;
        let node = this.node.getChildByName("lhd_playerList");
        if(node) {
            let ctrl = node.getComponent("playerListCtrl");
            ctrl.setPlayerDate(notify)
        } else {
            let pab_playersList = cc.instantiate(this.pab_playersList);
            let ctrl = pab_playersList.getComponent("playerListCtrl");
            ctrl.setPlayerDate(notify)
            this.node.addChild(pab_playersList);
        } 
    },

     // 游戏自己结算
    playerwinloseinfonotify:function(notify){
        this.myScore = notify.score;
        this.myCoin = notify.coin;
        let ctrl = this.getVIPistMe();
        if(ctrl) {
            // ctrl.diamond = this.myCoin;
        }
    },

    // 游戏结束
    gameovernotify:function(notify){
        this.endbetnotify();
        let cards = notify.cards;       // 底牌下标 (0龙,1虎)
        let winSide = notify.winSide;   // 获胜位置 (0.龙, 1.虎, 2.平)
        let civilianWin = notify.civilianWin;   // 平民赢分
        let vipWin = notify.vipWin;     // vip赢分
        this.infos = vipWin.sort(this.compare("pos"));
        for (let i = 0; i < this.infos.length; i++) {
            const vip = this.infos[i];
            let score = vip.win;
            let pos = vip.pos;
            let coin = vip.after;
            if( score >0 ) {
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let userNode = this.userArryNode[i];
                    if(userNode.name != ''){
                        let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                        if (userInfoCtrl && userInfoCtrl.pos == pos ) {
                            if(score > 0) {
                                this.allPlayerWinArr.push(pos);
                            }
                            userInfoCtrl.setPlayerWinCion(score); // 设置每个VIP玩家是否赢
                        }
                    } 
                }
            }
            if(this.getVIPistMe() == pos) {
                this.myCoin = coin;
                this.myScore = score;
            }
        }

        this.myCoin = notify.selfAfter;
        this.myScore = notify.selfWin;
        this.winorlose = winSide;
        if(this.recordlist.length >= 100){
            this.recordlist.shift();
        }
        this.recordlist.push(winSide);
        this.allPlayerWinArr = [];

        if(this.myScore >0 ){
            this.allPlayerWinArr.push(6);
            let UserInfo = {
                pos : 6,
                win:this.myScore,
                after:this.myCoin
            }
            this.infos.push(UserInfo)
        } else {
            let lab_coin = cc.find('Canvas/node_players/lhdPlayer/lab_coin').getComponent(cc.Label);     
            if(lab_coin){
                lab_coin.string = CommonFun.getInstance().numberToShow(this.myCoin/100);
            }   
        } 

        this.lhdCradCtrl.showCradEngAct(cards);
        this.outVIPSeat()

        // 向趋势图添加输赢图标
        let lhdTrendChart = this.node.getChildByName('lhdTrendChart')
        if(lhdTrendChart){
            let ctrl = lhdTrendChart.getComponent('lhdTrendChart');
            LoggerUtil.getInstance().log(`获胜的是：${this.winorlose}`);
            ctrl.addWinOrLoseIcon(this.winorlose);
        }
    },

    

    //聊天广播
    chatnotify:function(notify){
        if (!notify) {
            return;
        };

        let msgType = notify.msgType;               // 消息类型 0短语 1表情 2礼物
        let target = notify.target;                 // 接收者seat (-1表示群发)
        let sender = notify.sender;                 // 发送者seat
        let price = notify.price;                   // 消息价格
        let senderAfter = notify.senderAfter;       // 发送者扣价后货币
        let name = notify.name;                     // 表情名/短语内容

        let senderPlayerCtrl = this.getPlayerInfoByUserId(sender);
        if(senderPlayerCtrl){
            senderPlayerCtrl.showPlayCion(senderAfter);
        }
        this.myNodeCtrl.shePlayCion(senderAfter);


        if (msgType == 0 || msgType == 1) {
            let playScript = this.getPlayerInfoByUserId(target);
            if(playScript) playScript.face(notify);
        } 
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = this.getPlayerInfoByUserId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            };

            if (target == -1) {
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let userNode = this.userArryNode[i];
                    let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                    if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
                        targetNodeArr.push(userNode);
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
        }
    },

    // 上下vip座位通知 
    joinvipnotify:function(notify){
        let curPos = notify.curPos;
        let oldPos = notify.oldPos;
        let userInfo = notify.userinfo;
        let playerId = userInfo.playerId;

        if(oldPos == -1){
            // 上座
            if (curPos >= 0) {
                let pab_player = cc.instantiate(this.pab_player);
                let lhdPlayerCtrl = pab_player.getComponent("lhdPlayerCtrl");
                lhdPlayerCtrl.setUserData(userInfo, curPos);
                this.userArryNode.push(pab_player);
                this.node_playersSeat.addChild(pab_player);
            }
        }else{
            // 下座
            if(curPos == -1){
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let userNode = this.userArryNode[i];
                    if(userNode.name != ''){
                        let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                        if (userInfoCtrl && userInfoCtrl.playerid == playerId) {
                            userNode.destroy();
                            this.userArryNode.splice(i,1);
                        }
                    }
                }
            }else{
                // 换座
                let ctrl = this.setNodeCtrl(playerId);
                if(ctrl){
                    ctrl.setUserData(userInfo, curPos);
                } else {
                    for (let i = 0; i < this.userArryNode.length; i++) {
                        let userNode = this.userArryNode[i];
                        if(userNode.name != ''){
                            let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                            if (userInfoCtrl && userInfoCtrl.playerid == playerId) {
                                userNode.destroy();
                                this.userArryNode.splice(i,1);
                            }
                        }
                    }

                    let pab_player = cc.instantiate(this.pab_player);
                    let lhdPlayerCtrl = pab_player.getComponent("lhdPlayerCtrl");
                    lhdPlayerCtrl.setUserData(userInfo, curPos);
                    this.userArryNode.push(pab_player);
                    this.node_playersSeat.addChild(pab_player);
                }
            }

        }
    },

    // 点击上VIP按钮
    clickVIPuP: function(pos) {
        let myPos = this.getVIPistMe();
        if (myPos == pos) {  //自己下VIP
            CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", () => { 
                this.sendReqCtrl.JoinVipPosReq(-1)
            }, false);
            return;
        };

        let ctrl = this.getPlayerInfoByUserId(pos);
        if (ctrl) {
            CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!"); 
            return;
        }; 

        if (CommonFun.getInstance().isOpenVipModule()) {
            if (GlobalCfg.USER_DATAS.userVip.level == 0) {
                CommonFun.getInstance().showFirstRecharge();
                return;
            };

            let isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
            if (isCanSitVipSeat) {
                this.sendReqCtrl.JoinVipPosReq(pos);
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

        this.sendReqCtrl.JoinVipPosReq(pos);
    },

    // 玩家点击下注
    touchstart:function(event){
        let name = event.currentTarget.name;
        let types = null;
        if( name == "node_dragonChip") {
            types = 0;
        } else if (name == "node_tieChip") {
            types = 2;
        } else if (name == "node_tigerChip") {
            types = 1;
        }
        if(this.betStatus){
            if(GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minilonghu"]== true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
                return
            } else if( this.userBtnCion > GlobalCfg.USER_DATAS.userDiamond){
                if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                    CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                else {
                    CommonFun.getInstance().showMsgBox( this.tipsLabel[5],"SHOP",()=>{          
                        CommonFun.getInstance().showSmallAddCash()
                    },false);
                }
            }else {
                let betCoinAll = this.myDragonCoin + this.mytieCoin + this.mytigerCoin + this.userBtnCion;
                if( betCoinAll > 2000000){   // 限制玩家下注
                    CommonFun.getInstance().showTips("Upper limit of betting amount!");
                } else {
                    this.sendReqCtrl.callReq(this.userBtnCion,types);
                }
            }
        } else {
            LoggerUtil.getInstance().log("游戏未开始")
            CommonFun.getInstance().showTips('non betting stage');
        }
    },

    // 上一局普通玩家下注
    UPGameAllBet:function(){
        let amount = "501"
        let arr = null;
        let endNode = null;
        let startNode  = null; 

        for (let i = 0; i < 3; i++) {
            startNode =  this.lhdPlayer;
            startNode.setPosition(-343,-304);
            endNode = this.betNodeArr[i];
            // arr =  this.coinAllArr[i];
            cc.tween(startNode)
            .tag(1)
            .to(0.1, { position: cc.v2(startNode.x, startNode.y+5)})
            .to(0.1, { position: cc.v2(startNode.x, startNode.y-5)})
            .start()
            if(startNode) {
                this.showcoinNumm(startNode,endNode,amount,i);
            }
        }
    },

    // 初始化节点
    initLocalBtn:function(){
        this.node_chat = cc.find('Canvas/node_chat');
        this.wj_kong_01 = cc.find('Canvas/node_players/wj_kong_01');
        this.wj_kong_02 = cc.find('Canvas/node_players/wj_kong_02');
        this.wj_kong_03 = cc.find('Canvas/node_players/wj_kong_03');
        this.wj_kong_04 = cc.find('Canvas/node_players/wj_kong_04');
        this.wj_kong_05 = cc.find('Canvas/node_players/wj_kong_05');
        this.wj_kong_06 = cc.find('Canvas/node_players/wj_kong_06');
      
        this.wj_kong_01.active = true;
        this.wj_kong_02.active = true;
        this.wj_kong_03.active = true;
        this.wj_kong_04.active = true;
        this.wj_kong_05.active = true;
        this.wj_kong_06.active = true;

        this.ske_huo_long = cc.find('Canvas/node_skeAll/ske_huo_long');
        this.ske_huo_hu = cc.find('Canvas/node_skeAll/ske_huo_hu');
        this.ske_guang_hu = cc.find('Canvas/node_skeAll/ske_guang_hu');
        this.ske_guang_long = cc.find('Canvas/node_skeAll/ske_guang_long');
        this.node_trendChart = cc.find('Canvas/node_trendChart');
        this.node_crad = cc.find('Canvas/node_crad');
        this.bg_djs = cc.find('Canvas/node_crad/bg_djs');
        this.vs = cc.find('Canvas/node_crad/vs');
        this.node_btnGuangQuan = cc.find('Canvas/node_playerBetBtn/node_btnGuangQuan');
        this.node_dragonChip = cc.find('Canvas/node_table/node_dragonChip');
        this.node_tieChip = cc.find('Canvas/node_table/node_tieChip');
        this.node_tigerChip = cc.find('Canvas/node_table/node_tigerChip');
        this.node_playersSeat =  cc.find('Canvas/node_players/node_playersSeat');
        this.lhdPlayer =  cc.find('Canvas/node_players/lhdPlayer'); 
        this.node_coinAll =  cc.find('Canvas/node_coinAll');

        this.lab_palyersAll =  cc.find('Canvas/btn_playersAll/Background/playersNum/lab_palyersAll').getComponent(cc.Label); 
        this.lab_gameTime = cc.find('Canvas/node_crad/bg_djs/lab_gameTime').getComponent(cc.Label);  //倒计时时间
        this.lab_dragonAllCion = cc.find('Canvas/node_table/lab_dragonAllCion').getComponent(cc.Label);//龙下分
        this.lab_tieAllCion = cc.find('Canvas/node_table/lab_tieAllCion').getComponent(cc.Label); // 平下分
        this.lab_tigerAllCion = cc.find('Canvas/node_table/lab_tigerAllCion').getComponent(cc.Label); // 虎下分
        this.lab_dragaonBet = cc.find('Canvas/node_table/lab_dragaonBet').getComponent(cc.Label); // 自己龙下分
        this.lab_tieBet = cc.find('Canvas/node_table/lab_tieBet').getComponent(cc.Label); // 自己和下分
        this.lab_tigerBet = cc.find('Canvas/node_table/lab_tigerBet').getComponent(cc.Label); // 自己虎下分

        this.sendReqCtrl = this.node.getComponent("lhdSendReq");  //跟服务器请求数据
        this.lhdCradCtrl =  cc.find("Canvas/node_crad").getComponent("lhdCradCtrl");  // 牌的脚本
        this.lhdAudioCtrl =  cc.find("Canvas/lhdAudioCtrl").getComponent("lhdAudioCtrl");  // 音效脚本

        this.btn_chat = cc.find('Canvas/btn_chat').getComponent(cc.Button);  
        this.btn_playersAll = cc.find('Canvas/btn_playersAll').getComponent(cc.Button);  
        this.btn_trendChart = cc.find('Canvas/btn_trendChart').getComponent(cc.Button);  
        this.btn_trendChart = cc.find('Canvas/btn_trendChart').getComponent(cc.Button);  
        this.btn_shop = cc.find('Canvas/btn_shop').getComponent(cc.Button);  
        this.btn_tc = cc.find('Canvas/btn_tc').getComponent(cc.Button);  
        this.btn_wf = cc.find('Canvas/btn_wf').getComponent(cc.Button);  
        this.btn_10 = cc.find('Canvas/node_playerBetBtn/btn_10').getComponent(cc.Button); 
        this.btn_50 = cc.find('Canvas/node_playerBetBtn/btn_50').getComponent(cc.Button); 
        this.btn_100 = cc.find('Canvas/node_playerBetBtn/btn_100').getComponent(cc.Button); 
        this.btn_1000 = cc.find('Canvas/node_playerBetBtn/btn_1000').getComponent(cc.Button); 
        this.btn_2000 = cc.find('Canvas/node_playerBetBtn/btn_2000').getComponent(cc.Button); 
        this.betAmountList = [10, 50, 100, 1000, 2000];
        if (GlobalCfg.USER_DATAS.gamePattern == 1) {
            this.betAmountList = [1, 10, 50, 100, 1000];            
        }
        this.userBtnCion = this.betAmountList[0] * 100;
        this.choiceBetButton(this.btn_10);

        this.btn_10.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[0];
        this.btn_50.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[1];
        this.btn_100.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[2];
        this.btn_1000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[3];
        this.btn_2000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[4];
        
        this.btn_repeatBet = cc.find('Canvas/node_playerBetBtn/btn_repeatBet').getComponent(cc.Button); 
        this.btn_1 = cc.find('Canvas/node_players/btn_01').getComponent(cc.Button); 
        this.btn_2 = cc.find('Canvas/node_players/btn_02').getComponent(cc.Button); 
        this.btn_3 = cc.find('Canvas/node_players/btn_03').getComponent(cc.Button); 
        this.btn_4 = cc.find('Canvas/node_players/btn_04').getComponent(cc.Button); 
        this.btn_5 = cc.find('Canvas/node_players/btn_05').getComponent(cc.Button); 
        this.btn_6 = cc.find('Canvas/node_players/btn_06').getComponent(cc.Button); 

        this.ske_vs_longhu = cc.find('Canvas/node_skeAll/ske_vs_longhu').getComponent(sp.Skeleton);
        this.ske_endWin = cc.find('Canvas/node_skeAll/ske_endWin').getComponent(sp.Skeleton);
        this.sek_stopBetig = cc.find('Canvas/node_skeAll/ske_StopBetting').getComponent(sp.Skeleton);
        this.ske_kuang_long = cc.find('Canvas/node_skeAll/ske_kuang_long');
        this.ske_kuang_hu = cc.find('Canvas/node_skeAll/ske_kuang_hu');
        this.ske_kuang_ping = cc.find('Canvas/node_skeAll/ske_kuang_ping');
        
        
        this.ruZuoBtnArr = [this.wj_kong_01,this.wj_kong_02,this.wj_kong_03,this.wj_kong_04,this.wj_kong_05,this.wj_kong_06]
        this.betNodeArr = [this.node_dragonChip,this.node_tigerChip,this.node_tieChip];
        var btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            let btn =  btnArr[i].node
            if (btn.name != "btn_openMenu"){
                btnArr[i].node.on("click", this.btnClick, this) 
            }
        };

        this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this)
        
        this.node_dragonChip.on(cc.Node.EventType.TOUCH_START,this.touchstart,this)
        this.node_tieChip.on(cc.Node.EventType.TOUCH_START,this.touchstart,this)
        this.node_tigerChip.on(cc.Node.EventType.TOUCH_START,this.touchstart,this)
    },

    //  下载骨骼动画
    loadSkeleData: function () {
        this.assetBundle = cc.assetManager.getBundle('lhdGame');
        this.skeleDataMap = new Map();
        if (this.assetBundle) {
            let self = this;
            var skeleArr = ['lhdSke/vs_longhu','lhdSke/Win-dragon',"lhdSke/win-tiger","lhdSke/win-tie","lhdSke/Stop Betting",
                            'lhdSke/pai_z1'] 
            for (let index = 0; index < skeleArr.length; index++) {
                var url = skeleArr[index];
                self.assetBundle.load(url, sp.SkeletonData, function (err, asset) {
                    if (!err) {
                        if (asset._name && self.skeleDataMap) {
                            self.skeleDataMap.set(asset._name, asset);
                        }
                    }
                });
            }
        }
    },

    //显示战绩 
    inItHistoricalRecord:function(recordlist,status,runtime){
        let list = []
        if(recordlist.length > 23){
            list = recordlist.slice(recordlist.length - 23, recordlist.length);
        }else{
            list = recordlist;
        }
        // let num = status==1 && runtime >= 4000 ? 1 : 0
        let index = 22;
        this.winorloseArr = [];
        this.node_trendChart.removeAllChildren();
        for (let i = 0; i < list.length; i++) {
            let X = i * 38 - 458;
            let pab_winorlose = cc.instantiate(this.pab_winorlose);
            let icon_t = pab_winorlose.getChildByName("icon_t").getComponent(cc.Sprite)
            icon_t.spriteFrame = this.Sprite_winorlose[list[i]];
            pab_winorlose.setPosition(X,195);
            this.winorloseArr.push(pab_winorlose);
            this.node_trendChart.addChild(pab_winorlose);
        }
    },

    // 显示桌上下注总筹码
    showBetScore:function(betscore,str){
        if(str == "me"){
            if(this.myDragonCoin < betscore.dragon){
                this.myDragonCoin = betscore.dragon;
                this.lab_dragaonBet.string = this.myDragonCoin > 0 ? this.myDragonCoin / 100 : "Click to bet";
                cc.tween(this.lab_dragaonBet.node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
            if(this.mytieCoin < betscore.tie){
                this.mytieCoin = betscore.tie;
                this.lab_tieBet.string = this.mytieCoin > 0 ? this.mytieCoin / 100 : "Click to bet";
                cc.tween(this.lab_tieBet.node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
            if(this.mytigerCoin < betscore.tiger){
                this.mytigerCoin = betscore.tiger;
                this.lab_tigerBet.string = this.mytigerCoin > 0 ? this.mytigerCoin / 100 : "Click to bet";
                cc.tween(this.lab_tigerBet.node)
                    .to(0.1, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start();
            }
        }else{
            let long = betscore.dragon;
            let hu = betscore.tiger;
            let ping = betscore.tie;
            let betscoreArr = [long,hu,ping]
            this.dragonCoinAll = betscore.dragon;
            this.tigerCoinAll =betscore.tiger;
            this.tieCoinAll = betscore.tie;
            this.lab_dragonAllCion.string = long/100; 
            this.lab_tieAllCion.string = ping/100; 
            this.lab_tigerAllCion.string = hu/100; 
            this.dragonChipArr = [];
            this.tigerChipArr = [];
            this.tieChipArr = [];
            
            this.node_coinAll.removeAllChildren();
            for (let i = 0; i < 3; i++) {     // 重连进来显示桌上金币
                let coinNum = 150;
                let type = i
                let endNode =  this.betNodeArr[i];
                if(betscoreArr[i] > 0){
                    for (let i = 0; i < coinNum; i++) {
                        this.createEnemy(null,endNode,type,false)  
                    }
                }
            }
        }
    },

    // 显示玩家VIP列表
    setVipPlayers:function(vipList){
        this.node_playersSeat.removeAllChildren();
        this.userArryNode = [];
        for (let i = 0; i < vipList.length; i++) {
            let vipUserData = vipList[i];
            if( vipUserData.pos !=-1 ) {
                let pab_player = cc.instantiate(this.pab_player);
                let ctrl = pab_player.getComponent("lhdPlayerCtrl");
                ctrl.setUserData(vipUserData.userInfo, vipUserData.pos);
                this.userArryNode.push(pab_player);
                this.node_playersSeat.addChild(pab_player);
            }
        }
    },

    // 显示玩家倒计时
    showRuntime:function(runtime){
        let time = parseInt(runtime / 1000)
        this.lab_gameTime.string = time;
        this.vs.active = false;
        this.bg_djs.active = true; 
        this.unschedule(this.RuntimeCallback);
        this.RuntimeCallback = function () {
            if (time < 0) {
                this.vs.active = true;
                this.bg_djs.active = false; 
                this.unschedule(this.RuntimeCallback);
            } else {
                time--
                if(time>=0){
                    this.lab_gameTime.string = time
                    if(time <=4){
                        if(time == 0){
                
                        }else{
                            this.lhdAudioCtrl.playGameSound("daojishi"); 
                        }
                    }
                }
            }
        }
        this.schedule(this.RuntimeCallback, 1);
    },

    // 根据玩家分数来显示筹码的个数
    showcoinNumm:function (startNode,endNode,amount,types) {
        let coinNum = 0;
        let betAmount = amount/100
        if( betAmount == 10) {
            coinNum = 1;
        } else if (betAmount == 50) {
            coinNum = 3;
        } else if (betAmount == 100) {
            coinNum = 5;
        } else if (betAmount == 1000) {
            coinNum = 10;
        } else if (betAmount == 2000) {
            coinNum = 12;
        } else {                                                                                                
            coinNum = Math.ceil(Math.random()*5);
        }

        for (let i = 0; i < coinNum; i++) {
            this.createEnemy(startNode,endNode,types,true)  
        }
    },

    // 从对象池请求对象筹码
     createEnemy: function (startNode,endNode,types,isMove,bool) {
        let chouMa = null;
        let coinCtrl = null;
        if (this.coinPool.size() > 0) { 
            chouMa = this.coinPool.get();
            this.node_coinAll.addChild(chouMa)
        } else { 
            chouMa = cc.instantiate(this.pab_coin);
            this.node_coinAll.addChild(chouMa)
        }

        if (chouMa && !chouMa.getComponent("betCoinCtrl")) {
            coinCtrl = chouMa.addComponent('betCoinCtrl');
        }

        if(chouMa){
            coinCtrl = chouMa.getComponent("betCoinCtrl")
            chouMa.active = true;
            // 是否移动坐标
            if(isMove){
                if(coinCtrl && startNode){
                    let pos = startNode.getPosition()
                    chouMa.setPosition(pos);
                    coinCtrl.setMovePos(endNode);
                } 
            } else {
                if(coinCtrl) coinCtrl.setStaticPos(endNode);
            }

            this.coinAllArr[types].unshift(chouMa);   
            if(!bool){
                for (let i = 0; i < 3; i++) {
                    if( this.coinAllArr[i].length > 150){
                        for (let k = this.coinAllArr[i].length-1; k >=150; k--) {
                            if(this.coinAllArr[i][k] !=""){
                                cc.isValid(this.coinAllArr[i][k]) && this.coinAllArr[i][k].destroy()
                                this.coinAllArr[i].splice(k,1)
                            }
                        }
                    }
                }
            }
        }
    },

    // 创造筹码的对象池
    initCoinPool: function () {
        this.coinPool = new cc.NodePool();
        for (var i = 0; i < 500; i++) {
            let pab_coin = cc.instantiate(this.pab_coin);
            this.coinPool.put(pab_coin);
        }
    },

    //根据用户ID获取用户控制脚本
    getPlayerInfoByUserId: function(pos) {
        let playerInfo = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.pos === pos) {
                    playerInfo = userInfoCtrl;
                    break;
                }
            }
        }
        return playerInfo;
    },

    //根据用户座位号来获取node
    getPlayNode:function(pos){
        let playerNode = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.pos === pos) {
                    playerNode = userNode;
                    break;
                }
            } 
        }
        return playerNode
    },

    setMyVIPPos : function () {
        let ctrl = GlobalCfg.ACT_SCENE_CTRL.setNodeCtrl(GlobalCfg.ACT_SCENE_CTRL.my_playerId);
        if (ctrl) {
            return ctrl.pos
        }
        return null
    },

    //根据 playerId 来找脚本
    setNodeCtrl:function (playerId) {
        let playerNodeCtrl = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.playerid === playerId) {
                    playerNodeCtrl = userInfoCtrl;
                    break;
                }
            } 
        }
        return playerNodeCtrl
    },

    // 在VIP列表中找自己
    getVIPistMe:function(){
        let playerNode = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.playerid === this.myNodeCtrl.playerid) {
                    playerNode = userInfoCtrl.pos;
                    break;
                }
            } 
        }
        return playerNode
    },

     // 在VIP列表中找脚本
     getVIPMeCtrl:function(){
        let playerNode = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let userInfoCtrl = userNode.getComponent('lhdPlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.playerid === this.myNodeCtrl.playerid) {
                    playerNode = userInfoCtrl;
                    break;
                }
            } 
        }
        return playerNode
    },


    // 庄家回收玩家输的筹码  0.龙, 1.虎, 2.平局 
    winorloseCoinAct:function(){
        this.lhdAudioCtrl.playGameSound("jbrecover") 
        let winorlose = this.winorlose;
        for (let k = 0; k < this.coinAllArr.length; k++) {
            if( k != winorlose ) {
                for (let j = this.coinAllArr[k].length-1; j >=0; j--) {
                    let node = this.coinAllArr[k][j];
                    cc.tween(node) 
                    .tag(1)
                    .delay((Math.random() * 0.2).toFixed(2)) 
                    .to(0.2, { position: cc.v2(0, 300)},{ easing: "quadIn" })
                    .delay(0.2)
                    .call(() => {
                        node.destroy(); 
                        this.coinAllArr[k].splice(j,1);
                    })
                    .start(); 
                }
            }
        }
        this.scheduleOnce(function() {
            this.addCoinNumber(winorlose);
        },1.1);
    },

    // 庄家发放玩家赢的筹码
    addCoinNumber:function(types){
        if(this.coinAllArr[types].length ==0){ return }  // 没有玩家下中输赢
        this.lhdAudioCtrl.playGameSound("moveToArea") 
        let endNode = this.betNodeArr[types];
        let coinNum = 50;
        let startNode = this.node_crad;
        let isMove = true;
        if( endNode.length < 100 ){
            coinNum = 160 - endNode.length
        }
    
        for (let i = 0; i < coinNum; i++) {
            this.createEnemy(startNode,endNode,types,isMove,true)  
        }

        this.scheduleOnce(function() {
            this.playerWincCionAct();  // 玩家飞金币
        }, 1);
    },

    // 庄家赔赢的玩家金币动作 
    playerWincCionAct:function() { //
        let self = this;
        let time  = 0;
        let winArr = self.coinAllArr[self.winorlose]; 
        self.showPlayerGameOve();

        for (let i = 0; i < winArr.length; i++) {
            let node = winArr[i];
            if(node.name != "" ){
                if(i<20){
                    node.name = "0"
                } else if (i<40) {
                    node.name = "1"
                } else if (i<60) {
                    node.name = "2"
                } else if (i<80) {
                    node.name = "3"
                } else if (i<100) {
                    node.name = "4"
                } else if (i<120) {
                    node.name = "5"
                }  else if (i<140) {
                    node.name = "6"
                } else {
                    node.name = "-1"
                }
            }
        }
       //
        for (let k = 0; k < self.allPlayerWinArr.length; k++) {
            let pos = self.allPlayerWinArr[k];
            let ctrl = this.getPlayerInfoByUserId(pos);
            if(ctrl || pos == 6){
                let nodePos = pos == 6 ? cc.v2(-343,-304) : ctrl.setNodePos();
                self.scheduleOnce(function() {
                    for (let i = winArr.length -1 ; i >=0; i--) {
                        if(winArr[i].name != "" && winArr[i].name == ""+pos){
                            cc.tween( winArr[i]) 
                            .tag(1)
                            .delay(Math.random()*0.3) 
                            .to(0.15, {position: cc.v2(nodePos)})
                            .to(0.01, { scale: 0})
                            .call(() => {
                                if( winArr[i]){
                                    winArr[i].destroy();
                                    winArr.splice(i,1)
                                }
                            })
                            .start();
                        }
                    }
                }, time);
            }
            time += 0.2; 
        }

        self.scheduleOnce(function() {
            self.lhdAudioCtrl.playGameSound("shouCoin");
            for (let i = 0; i < winArr.length; i++) {
                let node = winArr[i];
                if(node.name !=""){
                    cc.tween(node) 
                    .tag(1)
                    .delay((Math.random()/3).toFixed(2)) 
                    .to(0.3, { position: cc.v2(-539,-319)})
                    .call(() => {
                        node.destroy();
                        this.ske_kuang_long.active = false; 
                        this.ske_kuang_hu.active = false; 
                        this.ske_kuang_ping.active = false; 
                    })
                    .start();
                }
            }
        }, (self.allPlayerWinArr.length+1)*0.2);
    },

    // 显示玩家结算后的金币
    showPlayerGameOve:function(){
        for (let i = 0; i <  this.infos.length; i++) {
            let score = this.infos[i].win;
            let pos = this.infos[i].pos;
            let coin = this.infos[i].after;
            let ctrl = this.getPlayerInfoByUserId(pos);
            if(pos == 6){
                this.myNodeCtrl.showPlayWinCion(coin,score)
            } else {
                if(ctrl){
                    ctrl.showPlayWinCion(coin,score)
            
                }
            }
        }
        this.curRoundAddCoinFinish();
    },

    curRoundAddCoinFinish(){
        let betCoinAll = this.myDragonCoin + this.mytieCoin + this.mytigerCoin;

        if(cc.isValid(this)){
            let minLimit = this.betAmountList[0] || 0;
            minLimit *= 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, betCoinAll);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },
        
    // 游戏结算后飞走势图动作
    showWinLosesAct:function(callback){
        let winorlose = this.winorlose;
        this.lhdAudioCtrl.playGameSound("yxks");
        let arr = [cc.v2(-305,-35),cc.v2(305,-35),cc.v2(0,-35)];
        let nodePos = arr[winorlose];

        if(this.winorloseArr.length >= 23){   // 重置趋势图坐标
            let num = 0;
            let index = 0;
            this.winorloseArr[0].destroy();
            this.winorloseArr.shift();
            for (let i = 0; i < this.winorloseArr.length; i++) {
                let winOrLoseNode = this.winorloseArr[i];
                winOrLoseNode.x -= 38;
            }
        }
        let winorloseNode = this.winorloseArr[this.winorloseArr.length - 1];
        let endPoint_X = -458; 
        if(winorloseNode && winorloseNode.name != ""){
            endPoint_X = winorloseNode.x + 38;
        }
        if(endPoint_X >= 378){
            endPoint_X = 378
        }
        let pab_winorlose = cc.instantiate(this.pab_winorlose);
        let icon_t = pab_winorlose.getChildByName("icon_t").getComponent(cc.Sprite)
        // let lizi = pab_winorlose.getChildByName("lizi");
        // lizi.active = true;
        icon_t.spriteFrame = this.Sprite_winorlose[winorlose];

        pab_winorlose.setPosition(nodePos);
        this.winorloseArr.push(pab_winorlose);
        this.node_trendChart.addChild(pab_winorlose);
        let q1 = cc.v2(nodePos);
        let q2 = cc.v2(50,200);
        
        let endPoint = cc.v2(endPoint_X,195);
        pab_winorlose.runAction( cc.bezierTo(1.6, [q1, q2, endPoint]).easing(cc.easeSineInOut()));
        this.scheduleOnce(function() {
            // lizi.active = false;
            this.winorloseCoinAct();
            if (callback) {
                callback();
            }
        }, 1.6);
    },

    // 重复上一轮的下注
    repeatPreviousRound:function(str){
        let betCoinAll = this.repeatBetArr[0] + this.repeatBetArr[1] + this.repeatBetArr[2];
        LoggerUtil.getInstance().log("上一局下注情况",betCoinAll,this.repeatBetArr,GlobalCfg.USER_DATAS.userDiamond);
        if( str == "bet"){
            if( betCoinAll > GlobalCfg.USER_DATAS.userDiamond || GlobalCfg.USER_DATAS.userDiamond <= 0){
                if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                    CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                else {
                    CommonFun.getInstance().showMsgBox( this.tipsLabel[5],"SHOP",()=>{          
                        if(this.paymentSwitch){
                            CommonFun.getInstance().showSmallAddCash()
                        }
                    },false);
                }
            } else {
                let newBetCoinAll = this.myDragonCoin + this.mytieCoin + this.mytigerCoin;
                let allCoin = betCoinAll + newBetCoinAll;
                if( allCoin > 2000000){
                    CommonFun.getInstance().showTips("Upper limit of betting amount!");
                    return
                }else{
                    this.sendReqCtrl.callReq(this.repeatBetArr[0],0);
                    this.sendReqCtrl.callReq( this.repeatBetArr[1],1);
                    this.sendReqCtrl.callReq( this.repeatBetArr[2],2);
                    this.repeatBetArr[0] = 0 ;     
                    this.repeatBetArr[2] = 0;       
                    this.repeatBetArr[1] = 0;   
                }
            }
            this.btn_repeatBet.node.active = false;
        } else {
            if( betCoinAll>0 ) {
                this.btn_repeatBet.node.active = true;
            } else {
                this.btn_repeatBet.node.active = false;
            }
        }
    },
     
    eventShow:function(){
        let self = this;
        cc.game.on(cc.game.EVENT_SHOW, function () {  
            LoggerUtil.getInstance().log("游戏切回到前台")
            GameServerManager.hideFilterMag(2,function () {
                self.sendReqCtrl.GameSceneReq();
            })
        }, this);
    },

    eventHide:function(){
        cc.game.on(cc.game.EVENT_HIDE, function () {   
            LoggerUtil.getInstance().log("游戏切入到后台")
            this.ske_endWin.skeletonData = null;
            this.ske_endWin.node.active = false;
            this.ske_vs_longhu.skeletonData = null;
            this.ske_vs_longhu.node.active = false;
            // cc.Tween.stopAll();
            cc.Tween.stopAllByTag(1);
            this.unscheduleAllCallbacks();
            GameServerManager.hideFilterMag(1)
            if(this.lhdCradCtrl) {
                this.lhdCradCtrl.Sprite_crad_left.node.scale = 1;
                this.lhdCradCtrl.Sprite_crad_Right.node.scale = 1;
            }
        }, this);
    },

    //**************************************骨骼动画播放*********************************************/
    
    // 播放游戏开始下注动画
    startBetAim:function(){
        this.lhdAudioCtrl.playGameSound("VS");    
        let spine = this.skeleDataMap.get("vs_longhu");
        this.ske_vs_longhu.skeletonData = spine;
        this.ske_vs_longhu.node.active = true;
        this.ske_vs_longhu.addAnimation(0, "animation", false); 
        this.ske_vs_longhu.setCompleteListener((trackEntry, loopCount) => {
            var name = trackEntry.animation.name;
            if( name == "animation" ){
                this.betStatus = true;
                this.repeatPreviousRound();
                this.showRuntime(14000);
                this.lhdCradCtrl.showCradStartAct(()=>{
                    this.ske_vs_longhu.skeletonData = null;
                    this.ske_vs_longhu.node.active = false;
                });
            } 
        })

        this.dragonChipArr = [];   // 存放龙的区域的筹码
        this.tieChipArr = [];      // 存放中间的区域的筹码
        this.tigerChipArr = [];     // 存放老虎的区域的筹码
        this.ske_kuang_long.active = false; 
        this.ske_kuang_hu.active = false; 
        this.ske_kuang_ping.active = false; 
        this.node_coinAll.removeAllChildren();
    },

    //游戏结束输赢动画
    endGameAim:function(){
        let skeName = ''
        let animaNameArr = [["Win-dragon-star","Win-dragon-loop","Win-dragon-out"],
                            ["win-tiger-star","win-tiger-loop","win-tiger-out"],
                            ["win-tie-star","win-tie-loop","win-tie-out"]]
        let winType = this.winorlose;
        if (winType == 0){
            skeName = "Win-dragon";
            this.ske_kuang_long.active = true; 
            this.ske_endWin.node.setPosition(-305,-38);
            this.lhdAudioCtrl.playGameSound("long_win"); 
        } else if(winType == 1) {
            skeName = "win-tiger";
            this.ske_kuang_hu.active = true; 
            this.ske_endWin.node.setPosition(305,-38);
            this.lhdAudioCtrl.playGameSound("hu_win"); 
        } else if (winType == 2) {
            skeName = "win-tie";
            this.ske_kuang_ping.active = true; 
            this.ske_endWin.node.setPosition(0,-38);
            this.lhdAudioCtrl.playGameSound("he_win"); 
        }
        let spine = this.skeleDataMap.get(skeName);
        if (spine) {
            this.ske_endWin.node.active = true;
            this.ske_endWin.skeletonData = null;
            this.ske_endWin.skeletonData = spine;
            this.ske_endWin.skeletonData.timeScale = 0.5;
            this.ske_endWin.addAnimation(0, animaNameArr[winType][0], false);
            this.ske_endWin.setCompleteListener((trackEntry, loopCount) => {
                var name = trackEntry.animation.name;
                if( name == "Win-dragon-star"||name == "win-tiger-star"||name == "win-tie-star"){
                    this.ske_endWin.addAnimation(0, animaNameArr[winType][2], false); 
                } else if ( name == "Win-dragon-loop"||name == "win-tiger-loop"||name == "win-tie-loop") {
                    // this.ske_endWin.addAnimation(0, animaNameArr[winType][2], false); 
                } else if ( name == "Win-dragon-out"||name == "win-tiger-out"||name == "win-tie-out") {
                    this.showWinLosesAct(()=>{
                        this.ske_endWin.skeletonData = null;
                        this.ske_endWin.node.active = false;
                    });
                }
            })
        };
    },

    //游戏结束显示牌光圈
    showCradGuangQuan:function(bool){
        if(bool){
            this.lhdCradCtrl.initCardPos();
            this.ske_guang_long.active = false;
            this.ske_guang_hu.active = false;
        }else{
            if( this.winorlose == 0 ) {
                this.ske_guang_long.active = true;
                this.ske_guang_hu.active = false;
            } else if( this.winorlose == 1 ) {
                this.ske_guang_long.active = false;
                this.ske_guang_hu.active = true;
            } else if ( this.winorlose == 2 ) {
                this.ske_guang_long.active = true;
                this.ske_guang_hu.active = true;
            } 
        }
    },

    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_1000, this.btn_2000];
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
