import gameServiceSendCtrl from "../src/gameServiceSendCtrl";
import buttonClickCtrl from "../src/buttonClickCtrl";
import skeAimPlayCtrl from "../src/skeAimPlayCtrl";
import soundPlayCtrl from "../src/soundPlayCtrl";


cc.Class({
    extends: cc.Component,

    properties: {
        pab_coin : cc.Prefab,
        winIcon: cc.Prefab,
        pab_VIPPlayer: cc.Prefab,
        pab_winningHistory : cc.Prefab,
        pab_playerList : cc.Prefab,
        pab_chat : cc. Prefab,
        pab_wanFa : cc. Prefab,
        pokseAtlas: cc.SpriteAtlas,
        pokseBei : cc.SpriteFrame,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
        // btn_openMenu: cc.Button,
        // btn_tableInfo: cc.Button,

        btnFreeGame: cc.Node,
    },

    ctor: function () {
        this.coinArr = [];            // 所有金币
        this.userArryNode = [];         // vip玩家
        this.openBlueRedArr = [];     // 大厅红蓝记录
        this.myRepeatArr = null;      // 自己重复下注记录
        this.newMyRepeatArr = [];     // 新的自己重复下注记录
        this.IsMyBet = false;

        this.interveneBetCion = true;  // 干预游戏开始动画不显示分数
        this.myBetStar =0;            //自己本场下注总金额
        this.myBetCoin = 50;        // 按钮自己下注金额
        this.stopBetState = 0;       // 玩家停止下注状态 0下注状态 1非下注状态

        this.puTongBetArr = [];      //普通玩家下注奖池
        this.gameEnd = true;         //进入游戏结算阶段只请求一次游戏结算结果
        this.openRecord = [];
        this.First = true;           // 是否第一次进入游戏
        this.limitBetPlaySound = true; //限制普通玩家吸住播放音效   
        this.limitMyBetCoinSound = true; //限自己播放音效 

        this.tipsLabel = [
            "Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
            "Sorry, there are not enough gold coins.", //金币不足请充值
            "In the game, unable to exit",                              // 游戏中无法退出
            "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
            "Can't bet temporarily",                    //请选择下注的范围
            "Your cash is insufficient, Please recharge in time!"
        ];
        this.isGameEndStatus = false;
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
        this.isHaveBet = false;    // 是否有下注
    },


    onLoad () {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_3PATTI_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        
        this.getNode();
        this.buttonClickCtrl = new buttonClickCtrl();
        this.buttonClickCtrl.initBetBtn(this);
        this.gameServiceSendCtrl = new gameServiceSendCtrl();
        this.skeAimPlayCtrl = new skeAimPlayCtrl();
        this.soundPlayCtrl = new soundPlayCtrl();

        this.gameServiceSendCtrl.LoginReq();
        this.soundPlayCtrl.initAudio();

        this.eventShow();
        this.eventHide();
    
        this.soundPlayCtrl.playGameMusic("lhd");
        this.buttonClickCtrl.monitorButton();
        this.utils.initCoinPool(this.pab_coin);

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        this.btnFreeGame.active = GlobalCfg.USER_DATAS.isNotCharge;
        this.btnFreeGame.getChildByName("lab").getComponent(cc.Label).string = "Free Games\n(" + GlobalCfg.USER_DATAS.freegameBetCount + ")";
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        this.unschedule(this.scheduleBetSpineTimeCallback);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_3PATTI_GAME);
    },

    onEventMsg:function(webData,target){
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if(msgId == "gameservice.login") {
            self.noVIPPlayerCtrl.setMyDate(notify.userinfo);
            
        } else if (msgId == "gameservice.gamescene") {
            self.gamescene(notify);                         //场景信息

        } else if (msgId == "gameservice.gamestartnotify") {
            self.isGameEndStatus = false;
            self.gamestartnotify();                         //游戏开始
        } else if (msgId == "gameservice.callnotify") {
            self.callnotify(notify);                        //下注通知
            self.stopBetState = 0;
        } else if (msgId == "gameservice.gameendnotify") {
            self.isGameEndStatus = true;
            self.gameendnotify(notify);                     //游戏结束
            self.stopBetState = 1;
        } else if (msgId == "gameservice.exitgame") {       //退出游戏
            cc.Tween.stopAll();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BACCARAT, SceneManager.getInstance().sceneType.LOBBY);           
        } else if (msgId == "gameservice.playerlist") {
            self.playerlist(notify);                       //玩家列表

        } else if (msgId == "gameservice.querygameendinfo") {
            self.querygameendinfo(notify);                 //查询最近的结算信息

        } else if (msgId == "gameservice.querymyrecord") {
            self.querymyrecord(notify);                    //我的记录

        } else if(msgId == "gameservice.joinvipnotify") { 
            self.joinvipnotify(notify);                 //加入vip座位广播

        } else if (msgId == "gameservice.shortmessagenotify") {  
            self.shortmessagenotify(notify);             // 发送表情

        } else if (msgId == "gameservice.vipplayerlist") {
            self.addVIPPlayer(notify.vipPlayerList);

        } else if(msgId == "gameservice.updatecoinnotify") {
            self.updatecoinnotify(notify);                      // vip玩家充值

        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let coin = notify.deposit + notify.winnings;
            self.noVIPPlayerCtrl.setMyCoin(coin);
        } else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BACCARAT, SceneManager.getInstance().sceneType.LOBBY);
        } else if (msgId == "gameservice.joinvippos") {
            let result = notify.result;
            if (notify.Result) {
                result = notify.Result;
            };
            if (result) {
                CommonFun.getInstance().showMsgBox(result.message, "YES", () => {}, false);
            };
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            self.gameServiceSendCtrl.ExitGameReq();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("baccarat3Patti");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BACCARAT, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "close_Only_Pay") {
            this.btnFreeGame.active = GlobalCfg.USER_DATAS.isNotCharge;
            this.buttonClickCtrl.refreshBetCoinBtn(!GlobalCfg.USER_DATAS.isNotCharge);
        }
    },

    // 监听错误消息
    checkWebMsgError: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `百人TP游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
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
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BACCARAT, SceneManager.getInstance().sceneType.LOBBY);           
            }, false);
        }
        else if (msgId === "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exitgame","ExitGameReq" ,{});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BACCARAT, SceneManager.getInstance().sceneType.LOBBY);
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

    /**
     * 场景推送
     * @param {场景数据} notify 
     */
    gamescene:function(notify){
        if(!notify) return;
        let status = notify.status;
        let remaining = notify.remaining;
        let pools =  notify.pools;
        let playerNumber = notify.playerNumber;
        let openRecord = notify.openRecord;
        let openBlueRed = notify.openBlueRed;
        let lastSuit = notify.lastSuit;
        let blueVsRed = notify.blueVsRed;
        let requester = notify.requester;
        let First = notify.First;

        let vipPlayerList = notify.vipPlayerList;

        this.pools = pools;
        this.stopBetState = status;
        this.openRecord = openRecord;
        this.openBlueRed = openBlueRed
        this.interveneBetCion = remaining < 16 ? true : false;
        this.lab_players.string = notify.playerNumber;
        this.utils.outTime(remaining,status);

        if(this.interveneBetCion) this.setSidePool(pools);
       
        if( First || this.First) { //true 是首次进入 
            this.First = false;
            this.setRecordIcon(openBlueRed);
            this.addVIPPlayer(vipPlayerList)
          
            if(status == 0) {
                this.utils.addCion(pools);
                if(this.skeAimPlayCtrl) this.skeAimPlayCtrl.setKuang();
                if(this.cradCtrl) {
                    this.cradCtrl.setCradValue();
                    this.cradCtrl.inOfCradAim();
                }

            } else if (status == 1) {
                this.gameServiceSendCtrl.QueryGameEndInfoReq();
            }

            if(this.my_bg_js && this.my_bg_js.active) {
                this.my_bg_js.x = 0;
                this.my_bg_js.active = false;
            }
        }

        if(status == 1) {
            this.remaining = remaining;
            this.btn_repeat.active = false;
        }
    },

    /**
     * 游戏开始
     */
    gamestartnotify:function() {
        this.interveneBetCion = false;
        this.ske_kuang.active = false;
        this.node_blue.active = false;
        this.node_red.active = false;
        this.setSidePool();
        this.cradCtrl.setCradValue()
        this.skeAimPlayCtrl.playStartAim();

        this.removeneCoinAll();
        this.myRepeatArr = null;
        
        this.myRepeatArr = this.newMyRepeatArr;
        this.btn_repeat.active = this.IsMyBet;
        this.IsMyBet = false;
    },

    /**
     * 下注通知
     */
    callnotify:function(notify){
        let playerId = notify.playerId;
        let pos = notify.pos   // 客户端
        let side = notify.side;
        let amount = notify.amount;
        let selfAll = notify.selfAll;
        let after = notify.after;

        if(pos == 0) {                         //普通玩家下注
            if(playerId == this.myPlayerId) {   // 自己下注
                this.IsMyBet = true;
                this.noVIPPlayerCtrl.setMyCoin(after,pos);
                this.noVIPPlayerCtrl.myCoinAct(side,amount);
                this.noVIPPlayerCtrl.myHeadSpriteShake();
                this.newMyRepeatArr = [];

                if(this.limitMyBetCoinSound) {
                    this.limitMyBetCoinSound = false;
                    this.soundPlayCtrl.playGameSound('mytouCoin');
                    setTimeout(()=>{ this.limitMyBetCoinSound = true;}, 300);
                }
                
            } else {
                this.puTongBetArr.push(side)
                if(this.limitBetPlaySound) {
                    this.limitBetPlaySound = false;
                    this.noVIPPlayerCtrl.noVIPPlayerAct(this.puTongBetArr);
                    this.soundPlayCtrl.playGameSound('otherCoin');
                    this.btnTime = setTimeout(()=>{ 
                        this.limitBetPlaySound = true;
                    }, 1000);
                }
            }
        } else {
            if(playerId == this.myPlayerId) {   // 自己下注
                this.IsMyBet = true;
                this.noVIPPlayerCtrl.setMyCoin(after,pos);
                this.noVIPPlayerCtrl.myCoinAct(side,amount);
                this.noVIPPlayerCtrl.myHeadSpriteShake();

            } else {                            // vip下注
                let VipCtrl = this.getPlayerInfoByUserId(pos);
                if(VipCtrl) {
                    VipCtrl.vipHeadSpriteAct(pos);
                    VipCtrl.playerCoinAct(side,amount);
                    VipCtrl.setVipCion(after)
                }
                this.soundPlayCtrl.playGameSound('otherCoin');
            }
        }
    },

    gameendnotify:function(notify) {
        if(!notify) {
            LoggerUtil.getInstance().error("服务器数据错误: gameendnotify")
        }
        if (this.isHaveBet) {
            CommonFun.getInstance().refreshFreeGameBetCount(this.btnFreeGame);
        }
        this.isHaveBet = false;

        let cards = notify.cards;   
        let winSide = notify.winSide
        let winBlueRed = notify.winBlueRed
        let after = notify.after;
        let score = notify.score;
        let calcResult = notify.calcResult;
        this.winBlueRed = winBlueRed;
        
        let myWin = {
            pos:7,
            after:after,
            score:score,
        }
        calcResult.push(myWin);
        this.infos = calcResult.sort(this.utils.compare("pos"));
       
        this.cradCtrl.cradAct(cards,()=>{
            this.cradCtrl.playCradAct(winSide,winBlueRed);
            this.huiShouCoin(winBlueRed,winSide);
        });

        this.noVIPPlayerCtrl.setMyCoin(after);

        
        this.setRecordIcon();

        this.skeAimPlayCtrl.kuangBlinkAct(winSide,winBlueRed,5);
        this.scheduleOnce(()=>{
            this.skeAimPlayCtrl.playKuangAim(winBlueRed);
            this.curRoundAddCoinFinish();
        },1.6)
    },

    playerlist:function(notify){
        let node = this.node.getChildByName("playerList");
        if(node) {
            let ctrl = node.getComponent("playersListCtrl");
            if(ctrl) ctrl.setPlayerDate(notify)
        } else {
            let pab_playerList = cc.instantiate(this.pab_playerList);
            this.node.addChild(pab_playerList);
            let ctrl = pab_playerList.getComponent("playersListCtrl");
            if(ctrl) ctrl.setPlayerDate(notify)
        }
    },

    joinvipnotify:function(notify) {
        if(!notify) {
            LoggerUtil.getInstance().error("服务器数据错误: joinvipnotify")
        }
        let Act = notify.Act;
        let userinfo = notify.userinfo || notify;

        if(Act == 1) {
            let pab_VIPPlayer = cc.instantiate(this.pab_VIPPlayer);
            this.node_palyers.addChild(pab_VIPPlayer);
            let VIPCtrl = pab_VIPPlayer.getComponent("VIPCtrl");
            VIPCtrl.setVIPDate(userinfo);
            this.userArryNode.push(pab_VIPPlayer);

        } else if(Act == 2){
            for (let i = 0; i < this.userArryNode.length; i++) {
                let VIPNode = this.userArryNode[i]
                let VIPCtrl = VIPNode.getComponent("VIPCtrl");
                if(VIPCtrl.vipPlayerId == userinfo.playerId) {
                    VIPCtrl.setVIPDate(userinfo)
                    break
                }
            }

        } else if (Act == 0) {
            for (let i = 0; i < this.userArryNode.length; i++) {
                let VIPNode = this.userArryNode[i]
                let VIPCtrl = VIPNode.getComponent("VIPCtrl");
                if(VIPCtrl.vipPlayerId == userinfo.playerId) {
                    this.userArryNode.splice(i,1);
                    VIPNode.destroy();
                    break
                }
            }
        }
    },

    shortmessagenotify:function(notify) {
        if (!notify) {
            return;
        };

        let msgType = notify.msgType;               // 消息类型 0短语 1表情 2礼物
        let target = notify.target;                 // 接收者seat (-1表示群发)
        let sender = notify.sender;                 // 发送者seat
        let price = notify.price;                   // 消息价格
        let senderAfter = notify.senderAfter;       // 发送者扣价后货币
        let name = notify.name;                     // 表情名/短语内容

        if (msgType != 2 ) {    // 1表情
            let ctrl = this.getPlayerInfoByUserId(sender);
            if (ctrl) {
                let pos = ctrl.node.getPosition();
                CommonFun.getInstance().sendFace(notify, pos)
            } 
        } 
        else {
            let targetNodeArr = [];
            let senderCtrl = this.getPlayerInfoByUserId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            }else{
                senderCtrl.setVipCion(senderAfter);
                if(senderCtrl.vipPlayerId == this.myPlayerId){
                    this.noVIPPlayerCtrl.setMyCoin(senderAfter);
                }
            }

            if (target == -1) {
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let VIPNode = this.userArryNode[i]
                    let VIPCtrl = VIPNode.getComponent("VIPCtrl");
                    if (VIPCtrl && VIPCtrl !== senderCtrl) {
                        targetNodeArr.push(VIPCtrl.node)
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


    querygameendinfo:function(notify) {
        this.gameEnd = false;
        let winBlueRed = notify.winBlueRed
        let winSide = notify.winSide;
        let calcResult = notify.calcResult;
        let pools = notify.pools;
        this.winBlueRed = winBlueRed;

        let myWin = {
            pos:7,
            after: notify.after,
            score: notify.score,
        }
        calcResult.push(myWin);
        this.infos = calcResult.sort(this.utils.compare("pos"));
        if(this.utils) this.utils.endGameAddCion(notify);


        if(this.remaining == 6) {
            this.gameendnotify(notify);
            return

        } else if (this.remaining == 5 || this.remaining == 4) {
            let endPos = winBlueRed == 6 ? cc.v2(-333,258):cc.v2(365,258);
            this.ZhuangShu(endPos,winBlueRed);
            this.ZhuangShu(endPos,winSide);
            this.skeAimPlayCtrl.playKuangAim(winBlueRed);
            this.utils.tuCion();
           
        } else if (this.remaining == 3 || this.remaining == 2) {
            this.utils.tuCion();

        } else if (this.remaining == 1 || this.remaining == 0) {
            // this.utils.endGameAddCion(notify);
        } 

        this.cradCtrl.cradAct(notify.cards,()=>{
            this.cradCtrl.playCradAct(winSide,winBlueRed)
        },true);
        this.skeAimPlayCtrl.kuangBlinkAct(notify.winSide,notify.winBlueRed,4);
        this.cradCtrl.playCradAct(winSide,winBlueRed)

    },

    

    /**
     * 加载大厅历史记录
     */
    setRecordIcon:function(openRecord){
        if(openRecord ) {
            this.openBlueRedArr = [];
            let last_15ItemArr = [];
            if(openRecord.length > 15){
                last_15ItemArr = openRecord.slice(openRecord.length - 15, openRecord.length);
            }else{
                last_15ItemArr = openRecord.slice();
            }
            if(this.node_historyRecord)this.node_historyRecord.removeAllChildren();
            for (let i = 0; i < last_15ItemArr.length; i++) {
                let type = last_15ItemArr[i];
                let node = this.utils.installWinIcon(type,"LOBBY");
                this.node_historyRecord.addChild(node);
                this.openBlueRedArr.push(node);
            }
        } else {            
            if (this.openBlueRedArr.length >= 15) {
                this.openBlueRedArr[0].destroy();
                this.openBlueRedArr.splice(0,1);
            };
            let node = this.utils.installWinIcon(this.winBlueRed,"LOBBY");
            this.node_historyRecord.addChild(node);
            this.openBlueRedArr.push(node);
            cc.tween(node).tag(1).blink(5,6)
            .start()
            
        }
    },

    /**
     *进入游戏加载vip玩家
     * @param {VIP列表} vipList 
     */
    addVIPPlayer(vipList){
        if(vipList && vipList.length>0) {
            this.userArryNode = [];
            this.node_palyers.removeAllChildren();
            for (let i = 0; i < vipList.length; i++) {
                let vip = vipList[i];
                vip.Act = 1;
                this.joinvipnotify(vip);
            }
        }
    },

    /**
     * 玩家充值
     */
    updatecoinnotify:function(notify) {
        let pos = notify.pos;
        let diamond = notify.diamond;
        let ctrl = this.getPlayerInfoByUserId(pos);
        if(ctrl) {
            ctrl.setVipCion(diamond);
        } 
    },


  
    /**
     * 根据用户ID获取用户控制脚本
     * @param {VIP的id} pos 
     * @returns 
     */
    getPlayerInfoByUserId: function(vipPos) {
        let playerInfo = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if(userNode.name != ''){
                let VIPCtrl = userNode.getComponent('VIPCtrl');
                if (VIPCtrl && VIPCtrl.date.vipPos === vipPos) {
                    playerInfo = VIPCtrl;
                    break;
                }
            }
        }
        return playerInfo;
    },

  

    /**
     * 根据金币的名字来回收对应的金币
     * @param {红蓝赢的类型} winBlueRed 
     * @param {牌的类型} winCradType 
     */
    huiShouCoin:function(winBlueRed,winCradType){
        this.soundPlayCtrl.playGameSound('jbrecover');
        let arr = ["0","1","2","3","4","5","6","7"];
        arr.splice(winBlueRed,1); 
        arr.splice(winCradType,1); 
        let endPos = winBlueRed == 6 ? cc.v2(-333,258):cc.v2(365,258);
        // this.coinArr = this.node_coinAll.children;

        for (let i = this.coinArr.length-1; i >= 0; i--) {
            let chouMa = this.coinArr[i];
            for (let k = 0; k < arr.length; k++) {
                if(arr[k] == chouMa.name) {
                    this.coinArr.splice(i,1);
                    cc.tween(chouMa)
                    .tag(1)
                    .delay((Math.random()*0.3).toFixed(2)) 
                    .to(0.5, { position: endPos},{ easing: "quadIn" })
                    .call(()=>{
                        this.utils.onEnemyKilled(chouMa);
                    })
                    .start(); 
                }
            }
        }

        this.scheduleOnce(()=>{
            this.ZhuangShu(endPos,winBlueRed);
            this.ZhuangShu(endPos,winCradType);
        },1.6)

        this.utils.tuCion();
    },

    /**
     * 庄吐金币的动作
     * @param {开始移动坐标} startPos 
     * @param {需要结束时的坐标下标} winType 
     */
    ZhuangShu:function(startPos,winType) {
        if(winType == 5 ) return  // 高牌直接忽略 
        this.soundPlayCtrl.playGameSound('shouCoin');
        for (let i = 0; i < 50; i++) {
            let newChouMa = this.utils.createEnemy(startPos);
            newChouMa.name = `${winType}`;
            let endPos = this.utils.setCoinEndPos(winType);

            if(newChouMa && endPos) {
                cc.tween(newChouMa) 
                .tag(1)
                .delay((Math.random()*0.3).toFixed(2)) 
                .to(0.5, { position: endPos},{ easing: "quadIn" })
                .start(); 
            }   
        }
    },

    playWinCoin:function(vipWinPos,arr){ // 
        this.soundPlayCtrl.playGameSound('shouCoin');
        for (let i = this.coinArr.length-1; i >=0; i--) {
            let chouMa = this.coinArr[i];
            this.coinArr.splice(i,1);
            if(chouMa) {
                let endPos = cc.v2(-538,-321);
                cc.tween(chouMa) 
                .tag(1)
                .delay((Math.random()*0.5).toFixed(2)) 
                .to(0.3, { position: endPos},{ easing: "quadIn" })
                .call(()=>{
                    this.utils.onEnemyKilled(chouMa);
                })
                .start(); 
            }
        }
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betCoinList[0] || 0;
            minLimit *= 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.myBetStar);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
        
    },

    /**
     * 
     * @param {根据pools来显示奖池数据} pools 
     */
    setSidePool:function(pools=null){
        if(pools) {
            this.myBetStar = 0;
            for (let i = 0; i < pools.length; i++) {
                if(pools[i]) {
                    let side = pools[i].side;
                    let all = pools[i].all/100;
                    let self = pools[i].self/100;
                    let lab = this.betLabArr[side];
                    this.myBetStar += self;
                    if(lab) {
                        // lab.string  = `${self}/${all}`;
                        lab.string  = `<color=#ffc705>${self}</c><color=#ffffff>/${all}</color>`;
                    }
                    if( this.curSelfBetNums[side] < self){
                        this.curSelfBetNums[side] = self;
                        cc.tween(lab.node)
                            .to(0.1, { scale: 1.2 })
                            .to(0.1, { scale: 1 })
                            .start();
                    }
                    if(self>0){
                        this.newMyRepeatArr[side] = self;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.betLabArr.length; i++) {
                if(i!=5){
                    let lab = this.betLabArr[i];
                    if(lab) lab.string  = "0/0";
                }
            }
            this.curSelfBetNums.fill(0, 0);
        }
    },

 
    /**
     * 下注投注飞金币动作
     * @param {根据玩家的座位ID来获取玩家节点坐标} betPlayerSeat 
     * @param {根据下注的类型来固定结束的坐标} betType 
     * @param {根据钱的多少来投注金币的个数} coin 
     */
    playerCoinAct:function(betPlayerSeat,betType,amount) {
        let index = this.betCoinList.map(i=>i).indexOf(this.myBetCoin);
        let coins = [1,3,5,10,12][index] || 3;

        for (let i = 0; i < coins; i++) { 
            let pos = this.utils.setCoinEndPos(betType);
            let chouMa = this.utils.createEnemy(cc.v2(-340,-300)); 
            chouMa.name = `${betType}`

            cc.tween(chouMa) 
            .tag(1)
            .delay((Math.random()*0.2).toFixed(2)) 
            .to(0.3, { position: pos},{ easing: "quadIn" })
            .start(); 
        }
    },

    //获取场景内的节点
    getNode:function() {
        this.node_blue = cc.find('Canvas/ske_cradType/node_blue');
        this.node_red = cc.find('Canvas/ske_cradType/node_red');
        this.prop =  cc.find('Canvas/node_prop/prop');
        this.node_all = cc.find('node_all',this.prop);
        this.my_bg_js =  cc.find('Canvas/myUser/bg_js');
        this.node_historyRecord = cc.find('Canvas/node_historyRecord');
        this.node_vip = cc.find('Canvas/node_vip');
        this.selectLight = cc.find('Canvas/node_betCoinBtn/selectLight');    
        this.wimAct_01 = cc.find('Canvas/node_bg/wimAct_01');     
        this.wimAct_02 = cc.find('Canvas/node_bg/wimAct_02');
        this.node_playerBet = cc.find('Canvas/node_playerBet');
        this.node_coinAll =  cc.find('Canvas/node_coinAll'); 
        this.node_palyers = cc.find('Canvas/node_palyers');
        this.myUser = cc.find('Canvas/myUser');
        this.node_CradBlue = cc.find('Canvas/node_CradBlue');
        this.node_CradRed = cc.find('Canvas/node_CradRed');
        this.node_labAll = cc.find('Canvas/node_labAll');
        this.node_djs = cc.find('Canvas/node_djs');
        this.btn_repeat = cc.find('Canvas/node_betCoinBtn/btn_repeat');
        this.headSp = cc.find('mask/wj_tx',this.myUser).getComponent(cc.Sprite);;

        this.ske_kuang = cc.find('Canvas/node_ske/ske_kuang');
        this.ske_start = cc.find('Canvas/node_ske/ske_start');

        this.my_lab_score = cc.find('lab_score',this.my_bg_js).getComponent(cc.Label);
        this.lab_time = cc.find('lab_time',this.node_djs).getComponent(cc.Label);
        this.lab_myCoin = cc.find('lab_myCoin',this.myUser).getComponent(cc.Label);

        this.lab_red = cc.find('Canvas/node_labAll/lab_red').getComponent(cc.RichText);
        this.lab_blue = cc.find('Canvas/node_labAll/lab_blue').getComponent(cc.RichText);
        this.lab_set = cc.find('Canvas/node_labAll/lab_set').getComponent(cc.RichText);
        this.lab_PureSEQ = cc.find('Canvas/node_labAll/lab_PureSEQ').getComponent(cc.RichText);
        this.lab_SEQ = cc.find('Canvas/node_labAll/lab_SEQ').getComponent(cc.RichText);
        this.lab_color = cc.find('Canvas/node_labAll/lab_color').getComponent(cc.RichText);
        this.lab_Palr = cc.find('Canvas/node_labAll/lab_Palr').getComponent(cc.RichText);
        this.lab_players = cc.find('Canvas/btn_playerNum/Background/lab_players').getComponent(cc.Label);

        this.betLabArr = [this.lab_set,this.lab_PureSEQ,this.lab_SEQ,this.lab_color,this.lab_Palr,"",this.lab_blue,this.lab_red]
        this.curSelfBetNums = new Array(this.betLabArr.length).fill(0);            // 当前玩家自己每个side下注的金额

        this.utils = cc.find('Canvas/node_bg').getComponent("utils");
        this.cradCtrl = cc.find('Canvas/node_bg').getComponent("cradCtrl");
        this.noVIPPlayerCtrl = cc.find('Canvas/node_bg').getComponent("noVIPPlayerCtrl");
    },


    /**
     * 游戏切到前台
     */
    eventShow:function(){
        cc.game.on(cc.game.EVENT_SHOW, function () {  
            // cc.Tween.stopAll();
            cc.Tween.stopAllByTag(1);
            this.unscheduleAllCallbacks();
            this.setRecordIcon(this.openBlueRed);
            this.First = true;
            this.ske_start.active = false;
            this.newMyRepeatArr = [];
            LoggerUtil.getInstance().log("游戏切回到前台")
            GameServerManager.hideFilterMag(2,()=>{
                this.gameServiceSendCtrl.VipPlayerListReq();
            })
        }, this);
    },

    /**
     * 游戏切后台
     */
    eventHide:function(){
        cc.game.on(cc.game.EVENT_HIDE, function () {  
            LoggerUtil.getInstance().log("游戏切入到后台") 
            this.First = true;
            this.ske_start.active = false;
            this.btn_playerNum.setPosition(-538,-325)
            GameServerManager.hideFilterMag(1)
        }, this);
    },

    /**
     * 删除金币节点
     */
    removeneCoinAll:function(){
        if(cc.isValid(this.node_coinAll)) {
            this.node_coinAll.removeAllChildren();
            this.coinArr = [];
        }
    },

    /**+
     * 
     */



    // start () {},
    showBtnBetSpine: function () {
        let animationName = 'animation';
        let betCoinBtn = this.node.getChildByName('node_betCoinBtn');
        let btnArr = ['btn_10', 'btn_50', 'btn_100', 'btn_1000', 'btn_2000'];
        let len = btnArr.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = betCoinBtn.getChildByName(btnArr[i]).getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        };
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },

    update: function (dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
    },

    choiceBetButton: function (button, selectLight){
        let scale = 1.1;
        let btnArr = ['btn_10', 'btn_50', 'btn_100', 'btn_1000', 'btn_2000'];
        let btnName = button.node.name;

        let betCoinBtn = this.node.getChildByName('node_betCoinBtn');

        selectLight.setScale(scale);
        for (let i = 0; i < btnArr.length; i++) {
            let name = btnArr[i];
            let nodeBtn = betCoinBtn.getChildByName(name);
            if(name == btnName){
                nodeBtn.setScale(scale);
            }else{
                nodeBtn.setScale(1);
            }
            let widget = nodeBtn.getComponent(cc.Widget);
            if(widget){
                widget.updateAlignment();
            }
        }
        let pos = button.node.getPosition();
        selectLight.setPosition(pos.x, pos.y + 3.5);
    },
});
