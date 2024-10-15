cc.Class({
    extends: cc.Component,

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
        btn_tableInfo: cc.Button,
    },

    ctor() {
        this.isCCGameEventHideStutas = false;
        this.selfAbsoluteSeatId = 0; //自己的绝对座位ID
        this.huSeat = true;       // 是否胡牌
        this.isChange = false;       // 游戏结算动画播完才能换桌
        this.isTuiChu = true;       // ture 是直接退出游戏  falae是投降
        this.dealCount = 13;        //发牌的数目
        this.groupObject = { group: "", type: "", node: cc.Node };
        this.isSelfTurn = false;            //是否是自己操作的回合      
        this.isPickOneCard = false;         //是否已经摸了一张牌
        this.barCount = 0;                  //记录bar的数量
        /**
         * 是自己回合，点击摸牌，发送起牌的消息请求，收到牌之后，isPickOneCard = true,再点击弹消息          【"you have already picked a card"】
         * 不是自己回合，点击摸牌，this.isSelfTurn = false，弹消息                                       【"please wait for your turn"】
         */

        this.paiZIndexArr = [
            60, 61, 62, 63, 64, 65, 66,
            67, 68, 69, 70, 71, 72, 73
        ];

        this.continueCount = 0;

        this.paiGroupArr = [];      //存放手牌的数组

        this.clickPaiArr = [];  //点击起来的牌组
        this.textArr = [
            otherLanguage.rummyTisp_01[language],
            otherLanguage.rummyTisp_02[language],//从关闭或者公开的牌库中拾取
            otherLanguage.rummyTisp_03[language],   //你已经选了一张牌    
            otherLanguage.rummyTisp_04[language],    //你确定要申报嘛？
            otherLanguage.rummyTisp_06[language],      //xxx已经宣布将您的卡分组并申报
            "Please wait for all the players to declare.",           //请等待所有玩家申报
            otherLanguage.rummyTisp_05[language],                           //请等待你的回合
            otherLanguage.rummyTisp_07[language],                  //等待玩家加入游戏（下一局时，对方未准备时）
            otherLanguage.rummyTisp_01[language],          // 等待其他玩家加入游戏
            `Your balance is under min Entry`,
        ];

        this.tempOpenSpriteFrame = null;                //存放右边open区域牌的精灵
        this.tidyFinalCardsAck = false;                 //是否收到最后摆牌的ACK
        this.tweenTagArr = [1,                             //actionFirstPai  1054
            2,                              //OutCard   1326
            3,                              //对家出牌   1406
            4,                              //设置坐标   1565
            5,                              //按钮从下方滑上来 1776
            6,                              //发牌  1813
            7,                              //翻转扑克牌 1842
            8,                              //移动至close的位置 1863
            9,                              //移动至close的位置 1922
            10,
        ];
        this.lastGameLifeCount = 0;         //上一次组牌的生命序列数目
        this.nowGameLifeCount = 0;          //这一次组牌的生命序列数目

        this.paiDistance = 60;
        this.groupDistance = 25;
        this.upClickDistance = 20;
        this.upLimitDistance = 112.3;
    },

    onLoad() {
        CommonFun.getInstance().checkShiPei(this.node);
        LoggerUtil.getInstance().log("执行2人场脚本 onload() ");
        GlobalCfg.ACT_SCENE_CTRL = this;
        this.rummyBundle = cc.assetManager.getBundle('Rummy');
        this.rummyRoomData = JSON.parse(cc.sys.localStorage.getItem('rummyRoomData'));
        this.entrycondition = this.rummyRoomData && this.rummyRoomData.entrycondition;
        this.isPractice = this.entrycondition == 0 ? true : false;
        this.initNode();
        this.loadSkeleData();
        this.initCardPool();
        this.paymentSwitch = false;
        this.cashSwitch();
        
        this.msgHandleOpen = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.pushpaysuccess =  ClientNotify.register("PUSHPAYSUCCESS",this.onEventMsg,this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    },

    start() {
        GlobalCfg.ACT_SCENE_CTRL = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            LoggerUtil.getInstance().log("游戏进入后台");
            this.isCCGameEventHideStutas = true;
            window.isNeedShowRoomList = "rummy";
            GameServerManager.hideFilterMag(1);
            this.unscheduleAllCallbacks();
            this.tsetCrad();
            this.paiGroupArr = [];
            this.putSelfCardToPool();
            this.openNode.active = false;
            this.closeNode.active = false;
            this.userInfoCtrl && this.userInfoCtrl.countDown(false);
            this.otherUserCtrl && this.otherUserCtrl.countDown(false);
        }, this);

        let self = this;
        cc.game.on(cc.game.EVENT_SHOW, function () {
            LoggerUtil.getInstance().log("重新返回游戏");
            if (this.isCCGameEventHideStutas == false) {
                return;
            };
            GameServerManager.hideFilterMag(2, () => {
                self.isCCGameEventHideStutas = false;
                GameServerManager.send("gameservice.refreshgamescene", "RefreshGameSceneReq", {});
            })
            // if (GameServerManager.socket == null) {
            //     GameServerManager.connectServer();
            // }
        }, this);

        if (this.node && GlobalCfg.SMALL_GAME_DATAS.rummyData.notify ) { 
            this.check_newPlayerJoinData( GlobalCfg.SMALL_GAME_DATAS.rummyData.notify);
        };
        this.enterRoomReq();
    },

    

    initNode: function () {   
        this.node_recorderCard = this.node.getChildByName("node_recorderCard");
        this.btn_cardListShow = this.node.getChildByName("btn_cardListShow").getComponent(cc.Button);
        this.btn_cardListClose = this.node_recorderCard.getChildByName("btn_cardListClose").getComponent(cc.Button);
        this.ske_shouZhi_close = this.node.getChildByName("close").getChildByName("ske_shouzhi");   // 左边手指动画
        this.ske_shouZhi_open = this.node.getChildByName("open").getChildByName("ske_shouzhi");     // 右边手指动画
        this.ske_close_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_01");     // 左边牌发光动画
        this.ske_cardLib_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_02");     // 中间牌发光动画
        this.ske_open_guang = this.node.getChildByName("node_crad_guang").getChildByName("pai_guang_03");     // 右边手指动画

        this.anim_sanjiao_01 = this.ske_close_guang.getChildByName("arri_01")
        this.anim_sanjiao_02 = this.ske_cardLib_guang.getChildByName("arri_01")
        this.anim_sanjiao_03 = this.ske_open_guang.getChildByName("arri_01")
        this.animArr = [this.anim_sanjiao_01, this.anim_sanjiao_02, this.anim_sanjiao_03]

        for (let i = 0; i < this.animArr.length; i++) {
            this.animArr[i].setPosition(0, 114)
            cc.tween(this.animArr[i])
                .tag(1)
                .repeat(1000000, cc.tween().tag(1).by(0.5, { position: cc.v2(0, -10) })
                    .by(0.5, { position: cc.v2(0, 10) }))
                .start()
        }

        this.recorderCardCtrl = this.node_recorderCard.getComponent('recorderCardCtrl') // 记牌器的脚本
        this.rummyAudioCtrl = this.node.getChildByName("rummyAudio").getComponent('rummyAudio'); //播放声音脚本

        this.btn_wf = this.node.getChildByName("btn_wanfa").getComponent(cc.Button);
        this.btn_shop = this.node.getChildByName("btn_shop").getComponent(cc.Button);
        this.btn_chat = this.node.getChildByName("btn_chat").getComponent(cc.Button);

        this.btnNode = this.node.getChildByName("btnNode");
        this.btn_drop = this.btnNode.getChildByName("btn_drop").getComponent(cc.Button);
        this.btn_finish = this.btnNode.getChildByName("btn_finish").getComponent(cc.Button);
        this.btn_group = this.btnNode.getChildByName("btn_group").getComponent(cc.Button);
        this.btn_discard = this.btnNode.getChildByName("btn_discard").getComponent(cc.Button);


        this.userNode = this.node.getChildByName("userNode");                   //玩家自己
        this.userInfoCtrl = this.userNode.getComponent("rummyUserInfoCtrl");    //玩家信息控制脚本

        this.btn_gift = this.userNode.getChildByName("btn_gift").getComponent(cc.Button);
        this.lab_jb = this.userNode.getChildByName("score_bg").getChildByName("lab_jb").getComponent(cc.Label);

        this.otherNode = this.node.getChildByName("players").getChildByName("otherNode");     //对战玩家
        this.otherUserCtrl = this.otherNode.getComponent("rummyOtherUserCtrl");     //对战玩家信息控制脚本
        this.tx_k = this.otherNode.getChildByName("tx_k");
                 //其他人头像
        this.btn_gift_other = this.tx_k.getChildByName("btn_gift_other").getComponent(cc.Button);
        this.lab_jb_other = this.tx_k.getChildByName("lab_jb").getComponent(cc.Label);
        this.lab_name_other = this.tx_k.getChildByName("lab_name").getComponent(cc.Label);

        this.closeNode = this.node.getChildByName("close");                     //扣着的牌，待发的牌
        this.btn_close = this.closeNode.getChildByName("btn_pickCard").getComponent(cc.Button);
        this.lab_close = this.closeNode.getChildByName("lab_close").getComponent(cc.Label);
        this.laizi_closeNode = this.closeNode.getChildByName("universal_card");

        this.openNode = this.node.getChildByName("open");                      //玩家出的牌
        this.btn_open = this.openNode.getChildByName("btn_open").getComponent(cc.Button);
        this.lab_open = this.openNode.getChildByName("lab_open").getComponent(cc.Label);
        this.openPaiNode = this.openNode.getChildByName("open_card");
        this.cardMask = this.openPaiNode.getChildByName('mask');

        this.selfCardNode = this.node.getChildByName("card");                       //手牌
        this.cardLibNode = this.node.getChildByName("cardLib");                     //牌库，开始时发牌

        this.line = this.node.getChildByName("line");

        this.userArryNode = [this.userNode, this.otherNode]

        let array = [this.btn_wf, this.btn_shop, this.btn_chat, this.btn_drop, this.btn_finish, this.btn_group, this.btn_discard,
        this.btn_gift, this.btn_gift_other, this.btn_close, this.btn_open, this.btn_cardListClose, this.btn_cardListShow];
        for (let i = 0; i < array.length; i++) {
            let btn = array[i];
            // btn.node.on('click', this.btnClick, this);
            btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        };

        this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_tableInfo.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.initNodeState(false);
    },

    //  下载骨骼动画
    loadSkeleData: function () {
        this.skeleDataMap = new Map();
        this.assetBundle = cc.assetManager.getBundle('Rummy');
        if (this.assetBundle) {
            var skeleArr = ['rummySke/winner_zj', 'rummySke/winner_dj']
            for (let index = 0; index < skeleArr.length; index++) {
                var url = skeleArr[index];
                this.assetBundle.load(url, sp.SkeletonData, (err, asset) => {
                    if (!err) {
                        if (asset._name && this.skeleDataMap) {
                            this.skeleDataMap.set(asset._name, asset);
                        }
                    }
                });
            }
        }
    },

    //初始化节点状态
    initNodeState(bool) {
        // this.round = 0;
        this.node_recorderCard.active = false;
        this.openNode.active = false;
        this.closeNode.active = false;
        this.cardLibNode.active = false;            //开始时显示，做发牌动作
        this.line.active = false;                   //出牌线
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
    },

    //初始化对象池
    initCardPool: function () {
        this.cardPool = new cc.NodePool();
        let initCount = 17;
        for (let i = 0; i < initCount; i++) {
            let card = cc.instantiate(this.prefab_pai);
            this.paiWidth = card.width;
            this.cardPool.put(card);
        }
    },

    createPaiNode: function () {
        let card = null;
        if (this.cardPool.size > 0) {
            card = this.cardPool.get();
        } else {
            card = cc.instantiate(this.prefab_pai);
        }
        return card;
    },

    //将对象返回对象池
    onCardRemoved: function (card) {
        if (card) {
            if(this.cardPool){
                this.cardPool.put(card);
            }else{
                card.destroy();
            }
        }
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_tableInfo" ) {
            //添加玩法的预制体
            let self = this;
            this.rummyBundle.load('rummyPab/roomInfo', function (err, prefab) {
                if (err) {
                    LoggerUtil.getInstance().error("玩法预制体生成错误！！");
                    return
                } else {
                    let pab_rule = cc.instantiate(prefab);
                    let roomInfoCtrl = pab_rule.getComponent('roomInfoCtrl');
                    roomInfoCtrl.setValue();      //此处传参（房间底分）
                    cc.director.getScene().getChildByName("Canvas_rummy").addChild(pab_rule);
                }
            });
        } else if (btnName == "btn_huanZuo") {
            this.changeRoomReq();
        } else if (btnName == "btn_shop") {
            if (this.entrycondition == 0) {                                         // 体验场充值
                CommonFun.getInstance().showSmallAddExperience();
            } 
            else {                                                           // 真金场充值
                CommonFun.getInstance().showSmallAddCash("rummy",this.cellScore * 100);
            };
        } else if (btnName == "btn_chat") {
            let pab_chat = cc.instantiate(this.pab_chat);
            let ctrl = pab_chat.getComponent("chatCtrl");
            ctrl.setPlayerSeat(this.selfAbsoluteSeatId);
            this.node.addChild(pab_chat);

        } else if (btnName == "btn_drop") {
            this.isTuiChu = false;
            CommonFun.getInstance().showMsgBox("Are you sure you want to drop?", "YES_NO", () => {
                // 发送结算消息
                this.dropReq();
            }, false);
        } else if (btnName == "btn_finish") {
            // LoggerUtil.getInstance().log("finish按钮时的clickArr", this.clickPaiArr);
            this.finishCardData = { groupTag: this.clickPaiArr[0].groupTag, paiIndex: this.clickPaiArr[0].groupIndex, paiValue: this.clickPaiArr[0].paiValue };
            let value = this.clickPaiArr[0].paiValue;
            this.finishAction(this.clickPaiArr[0]);
            this.checkScore(value);
        } else if (btnName == "btn_group") {
            this.clickPaiArr.sort(function (a, b) { return a.groupIndex - b.groupIndex })
            let group = [];
            for (let i = this.clickPaiArr.length - 1; i >= 0; i--) {
                let data = this.clickPaiArr[i];
                if (!this.paiGroupArr[data.groupTag]) {
                    this.setPaiNodeIndex(this.paiGroupArr);
                    return
                }
                for (let j = 0, len = this.paiGroupArr[data.groupTag].length; j < len; j++) {
                    let paiNode = this.paiGroupArr[data.groupTag][j];
                    if (paiNode) {
                        let src = paiNode.getComponent("paiCtrl");
                        let paiValue = src.getPaiValue();
                        if (paiValue == data.paiValue) {
                            let tempArr = this.paiGroupArr[data.groupTag].splice(j, 1);
                            group.push(tempArr[0]);
                        }
                    }
                }
                continue
                // let tempArr = this.paiGroupArr[data.groupTag].splice(data.groupIndex, 1);
                // group.push(tempArr[0]);
            }
            for (let i = 0; i < group.length; i++) {
                let paiNode = group[i];
                if (paiNode) {
                    let src = paiNode.getComponent("paiCtrl");
                    let paiValue = src.getPaiValue();
                    LoggerUtil.getInstance().log(i + "选择组牌的牌值为：" + this.getPaiNum(paiValue) + " , paiValue = " + paiValue);
                }
            }
            group.sort((a, b) => {
                if (a && b) {
                    let paiValueA = a.getComponent("paiCtrl").getPaiValue();
                    let paiValueB = b.getComponent("paiCtrl").getPaiValue();
                    let paiNumA = this.getPaiNum(paiValueA)
                    let paiNumB = this.getPaiNum(paiValueB)
                    if (paiNumA < paiNumB) {           // 按某种排序标准进行比较, a 小于 b
                        return -1;
                    }
                    if (paiNumA > paiNumB) {
                        return 1;
                    }
                    return 0;
                }
            })
            let type = this.checkGroupLiftBar(group);
            // 防止数组中有空值
            for (let i = 0; i < this.paiGroupArr.length; i++) {
                let arr = this.paiGroupArr[i];
                if (arr) {
                    if (arr.length == 0) {
                        this.paiGroupArr.splice(i, 1);
                    }
                } else {
                    this.paiGroupArr.splice(i, 1);
                }
            }
            if (type == 1 || type == 2 || type == 3) {
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zupaichenggong");
            } else {
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zupai");
            }
            this.paiGroupArr.splice(0, 0, group);
            if (this.paiGroupArr.length > 6) {
                this.clickPaiArr.sort(function (a, b) { return a.groupTag - b.groupTag })
                let a = this.clickPaiArr[0].groupTag;
                if (a == this.paiGroupArr.length - 2) {         //点起来的是最后面一个组的几张牌
                    let aArr = this.paiGroupArr[a].concat(this.paiGroupArr[a + 1]);
                    this.paiGroupArr[a] = aArr;
                    this.paiGroupArr.length -= 1;
                } else if (a == 0) {                            //点起的是最左边的组
                    let aArr = this.paiGroupArr[a + 1].concat(this.paiGroupArr[a + 2]);
                    this.paiGroupArr[a + 1] = aArr;
                    for (let i = a + 2; i < this.paiGroupArr.length; i++) {
                        this.paiGroupArr[i] = this.paiGroupArr[i + 1];
                        if (i + 1 == this.paiGroupArr.length - 1) {
                            this.paiGroupArr.length -= 1;
                            LoggerUtil.getInstance().log("合并数组完毕");
                            break
                        }
                    }
                } else {
                    let aArr = this.paiGroupArr[a + 1].concat(this.paiGroupArr[a + 2]);
                    this.paiGroupArr[a + 1] = aArr;
                    for (let i = a + 2; i < this.paiGroupArr.length; i++) {
                        this.paiGroupArr[i] = this.paiGroupArr[i + 1];
                        if (i + 1 == this.paiGroupArr.length - 1) {
                            this.paiGroupArr.length -= 1;
                            LoggerUtil.getInstance().log("合并数组完毕");
                            break
                        }
                    }
                }
            }
            for (let i = 0; i < this.paiGroupArr.length; i++) {
                let arr = this.paiGroupArr[i];
                if (arr) {
                    if (arr.length == 0) {
                        this.paiGroupArr.splice(i, 1);
                    }
                } else {
                    this.paiGroupArr.splice(i, 1);
                }
            }

            // this.setPaiNodeIndex(this.paiGroupArr);
            this.lifeBar(this.paiGroupArr, true);
            this.clickPaiArr.length = 0;
            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
            let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
            this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr, true);
            this.reqMovehandgroup(this.paiGroupArr);
        } else if (btnName == "btn_discard") {
            if (this.clickPaiArr.length == 1) {
                let data = this.clickPaiArr[0];
                let index = [1, data.groupTag, data.groupIndex].join('');
                this.outCardReq(data.paiValue, parseInt(index));
            }
        } 
        else if (btnName == "btn_gift") {
            CommonFun.getInstance().showGameGifInteraction(this.userInfoCtrl.getSeatId());
        } 
        else if (btnName == "btn_gift_other") {
            CommonFun.getInstance().showGameGifInteraction(this.otherUserCtrl.getSeatId());
        } else if (btnName == "btn_pickCard") {
            if (this.isSelfTurn == true) {
                //是自己回合，发送起牌的请求
                if (this.isPickOneCard == true) {     //已经起了一张牌
                    if (this.node.getChildByName("tishi")) {
                        LoggerUtil.getInstance().log("当前提示存在！！");
                        return
                    }
                    let tishi = cc.instantiate(this.prefab_tishi);
                    let tishiCtrl = tishi.getComponent("tishiCtrl");
                    tishiCtrl.setTishi(this.textArr[2]);
                    tishi.parent = this.node;
                    setTimeout(() => {
                        tishiCtrl.removeFromParentNode(this.node);
                    }, 3000);
                } else {
                    this.pickCardReq(0);
                }
            } else {
                if (this.node.getChildByName("tishi")) {
                    LoggerUtil.getInstance().log("当前提示存在！！");
                    return
                }
                let tishi = cc.instantiate(this.prefab_tishi);
                let tishiCtrl = tishi.getComponent("tishiCtrl");
                tishiCtrl.setTishi(this.textArr[6]);
                tishi.parent = this.node;
                setTimeout(() => {
                    tishiCtrl.removeFromParentNode(this.node);
                }, 3000);
            }
        } else if (btnName == "btn_open") {
            if (this.isSelfTurn == true) {
                //是自己回合，发送起牌的请求
                if (this.isPickOneCard == true) {     //已经起了一张牌
                    if (this.node.getChildByName("tishi")) {
                        LoggerUtil.getInstance().log("当前提示存在！！");
                        return
                    }
                    let tishi = cc.instantiate(this.prefab_tishi);
                    let tishiCtrl = tishi.getComponent("tishiCtrl");
                    tishiCtrl.setTishi(this.textArr[2]);
                    tishi.parent = this.node;
                    setTimeout(() => {
                        tishiCtrl.removeFromParentNode(this.node);
                    }, 3000);
                } else {
                    this.pickCardReq(1);
                }
            } else {
                if (this.node.getChildByName("tishi")) {
                    LoggerUtil.getInstance().log("当前提示存在！！");
                    return
                }
                let tishi = cc.instantiate(this.prefab_tishi);
                let tishiCtrl = tishi.getComponent("tishiCtrl");
                tishiCtrl.setTishi(this.textArr[6]);
                tishi.parent = this.node;
                setTimeout(() => {
                    tishiCtrl.removeFromParentNode(this.node);
                }, 3000);
            }
        } else if (btnName == "btn_cardListClose") {
            this.node_recorderCard.active = false;
        } else if (btnName == "btn_cardListShow") {
            GameServerManager.send("gameservice.lookoutpool", "LookOutPoolReq", {});
        } else if (btnName == "btn_openMenu") {
            CommonFun.getInstance().showGameMenu();
        }
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.enterroom") {                    // 进入房间
            self.RefreshGameSceneReq();
        } else if (msgId === "gameservice.changetable") {                   //换桌
            self.changetable();

        } else if (msgId === "gameservice.exitgame") {                      //退出游戏
            window.isNeedShowRoomList = "rummy";
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        } else if (msgId === "gameservice.ready") {                         //准备

        } else if (msgId === "gameservice.shortmessage") {                  //短消息

        } else if (msgId === "gameservice.onstartgametimer") {              //游戏开始倒计时
            self.userInfoCtrl.lab_scoreName.string = "Score:"
            self.userInfoCtrl.lab_score.string = "0"
            self.isChange = false;
            self.tableStatus = 1;
            self.TipsLab()
            let settlement = self.node.getChildByName("settlement");
            if (settlement) {
                settlement.destroy();
            }
            let time = notify.time;
            LoggerUtil.getInstance().log("倒计时：：：：", time);
            let tishi = cc.instantiate(self.prefab_tishi);
            let tishiCtrl = tishi.getComponent("tishiCtrl");
            let arr = [
                otherLanguage.rummyTisp_11,otherLanguage.rummyTisp_10,otherLanguage.rummyTisp_09,otherLanguage.rummyTisp_08,
                otherLanguage.rummyTisp_13,otherLanguage.rummyTisp_12
            ]
            tishiCtrl.setTishi(arr[time][language]);
            let myVar = setInterval(() => {
                if (!tishi) {
                    clearInterval(myVar);
                    return
                }
                time--
                if (time == 1) {
                    this.tableStatus = 3;
                }
                tishiCtrl.setTishi(arr[time][language]);
                if (time == 0) {
                    clearInterval(myVar);
                    tishi.destroy();
                    return
                }
            }, 1000);
            tishi.parent = self.node;
        } else if (msgId === "gameservice.pickcard") {                      //起牌
            LoggerUtil.getInstance().log("起牌消息ACK", notify);
        } else if (msgId === "gameservice.outcard") {                        //出牌


        } else if (msgId == "gameservice.onplayerout") {                        //出牌广播(依据)
            LoggerUtil.getInstance().log("出牌广播，当前是不是轮到自己", notify.seat !== self.selfSeat);
            self.OutCard(notify);
            self.tsetCrad(notify, "outCrad");
        } else if (msgId === "gameservice.choosehu") {                       //胡牌，显示信息弹框  Please wait for all the players to declare
            if (self.node.getChildByName("settlement")) {
                if (self.node.getChildByName("tishi")) {
                    self.node.getChildByName("tishi").destroy();
                }
            } else {
                // let tishi = cc.instantiate(self.prefab_tishi);
                // let tishiCtrl = tishi.getComponent("tishiCtrl");
                // tishiCtrl.setTishi(self.textArr[5]);
                // tishi.parent = self.node;
            }
            // self.finishAction(self.finishCardData);
        } else if (msgId === "gameservice.ongamecalc") {                       //游戏结算  展示结算界面
            if (self.node.getChildByName("tishi")) {
                self.node.getChildByName("tishi").destroy();
            }
            if (self.node.getChildByName("tishi_finish")) {
                self.node.getChildByName("tishi_finish").destroy();
            }
            self.check_onGamecalcData(notify);
            self.tsetCrad(notify, "jieSuan")
            self.showLobbyUI("offCradGuang")
        } else if (msgId === "gameservice.ongamestart") {                      //游戏开始广播
            self.check_GameStartData(notify);
        } else if (msgId === "gameservice.onplayerpick") {                        //玩家起牌广播
            LoggerUtil.getInstance().log("起牌广播，当前起牌操作的座位号", notify.seat, self.selfSeat);
            self.check_PickCardData(notify);
            self.tsetCrad(notify, "moCrad")
        } else if (msgId === "gameservice.onchoosehu") {                        //选择胡牌广播
            self.check_ChooseHuData(notify);
        } else if (msgId == "gameservice.refreshgamescene") {                          //游戏场景刷新,发牌也是根据这个
            self.unscheduleAllCallbacks();
            self.paiGroupArr = [];
            self.putSelfCardToPool();
            self.userInfoCtrl && self.userInfoCtrl.countDown(false);
            self.otherUserCtrl && self.otherUserCtrl.countDown(false);

            self.tsetCrad();
            self.check_GameSceneData(notify);
            self.tsetCrad(notify, "gameStart");
        } else if (msgId == "gameservice.onplayerjoin") {                              //新玩家进入
            self.check_newPlayerJoinData(notify);
        } else if (msgId == "gameservice.onplayerleave") {                                //玩家退出广播
            let otherID = self.otherUserCtrl.getPlayerId();
            let selfID = self.userInfoCtrl.getPlayerId();;
            LoggerUtil.getInstance().log("otherID" + otherID,'selfID', selfID);
            if (otherID == notify.uid && (notify.reason == 0 || notify.reason == 2)) {
                self.otherUserCtrl.freshUser();
                let settlement = self.node.getChildByName("settlement")
                if (notify.reason != 2 && settlement == null) { self.TipsLab(8); }
            } else if(selfID == notify.uid && (notify.reason == 0 || notify.reason == 2)){ 
                self.exitGame();
            }
        } else if (msgId == "gameservice.drop") {                           //弃牌
            LoggerUtil.getInstance().log("玩家已弃牌");
            self.playdrop();
        } else if (msgId == "gameservice.setcontinue") {                     //继续下一局
            LoggerUtil.getInstance().log("继续下一局！！！",);
            if (self.node.getChildByName("settlement")) {
                self.node.getChildByName("settlement").destroy();
                self.userInfoCtrl.lab_scoreName.string = "Score:"
                self.userInfoCtrl.lab_score.string = "0"
            } else {
                window.isNeedShowRoomList = "rummy";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
            }
            if (self.otherUserCtrl.isUserGame) {
                self.TipsLab(8)
            } else {
                self.TipsLab(7)
            }

        } else if (msgId === "gameservice.shortmessagenotify") {
            self.shortmessagenotify(notify);
        } else if (msgId == "gameservice.lookoutpool") {
            self.node_recorderCard.active = true;
            self.recorderCardCtrl.setCradListInOf(notify, true)
        } else if (msgId == "gameservice.onflowrefresh") {                         //流局，刷新牌库
            self.freshNotifyCallback = () => {
                self.flowPaiAction(notify);
            }
            self.scheduleOnce(self.freshNotifyCallback, 1);
        } else if (msgId == "gameservice.tidyfinalcards") {
            LoggerUtil.getInstance().log("最后的摆牌的回调");
            self.tidyFinalCardsAck = true;
            if (self.tidyFinalCardsAck == true) {
                self.unschedule(self.tidyfinalcardsSchedule);
                self.tidyFinalCardsAck = false;
            }
        } else if (msgId == "gameservice.movehandgroup") {
            self.check_moveHandGroup(notify);
        } else if (msgId == "gameservice.ondiamondupdate") {
            let playerId = notify.playerId;
            let after = notify.after;
            if (self.userInfoCtrl.playerid == playerId) {
                self.userInfoCtrl.setCoin(after)
            } else if (self.otherUserCtrl.playerid == playerId) {
                self.otherUserCtrl.setCoin(after)
            }
        } else if (msgId == "lobbyservice.pushcurrencychanged") { 
            GlobalCfg.USER_DATAS.userDiamond = notify.deposit + notify.winnings;
            GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, 0);
            self.userInfoCtrl.setCoin(GlobalCfg.USER_DATAS.userDiamond);
        } else if(msgId == "gameservice.ondrop") {
            if(notify.seat == self.selfSeat){
                self.userInfoCtrl.gameDropOrFinalcards(notify,true);
            }
        } else if (msgId == "gameservice.ontidyfinalcards"){
            if(notify.seat !== self.selfAbsoluteSeatId){ 
                self.otherUserCtrl.gameDropOrFinalcards(notify,false);
            }else{                                          
                //自己的广播
                self.userInfoCtrl.gameDropOrFinalcards(notify,false);
                self.tidyFinalCardsAck = true;
            }
        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN) {

        }

        else if (msgId == "limitTips") {           //牌超出限制线，设置 open部分的牌值
            if (self.isSelfTurn == true && self.isPickOneCard == true) {
                self.line.active = true;
                self.limitTipsCallBack(notify);
            }
        } else if (msgId == "underLimitTips") {   //牌在限制线下，设置 open 部分的牌值
            if (self.isSelfTurn == true && self.isPickOneCard == true) {
                self.line.active = true;
                self.underLimitTipsCallBack(notify);
            }
        } else if (msgId == "clickPai") {     //点击牌
            // LoggerUtil.getInstance().log("点击！！", notify)
            self.clickPaiCallBack(notify);
        } else if (msgId == "insertPai") {    //插入牌组
            self.insertPaiCallBack(notify);
        } else if (msgId == "outPai") {       //移动出牌
            LoggerUtil.getInstance().log("自定义事件 outPai ");
            if (self.isSelfTurn && self.isPickOneCard) {
                self.outPaiCallBack(notify);
            }
            let tempPaiGroup = self.paiGroupArr[notify.groupTag];
            if (tempPaiGroup) {
                let tempPaiNode = tempPaiGroup[notify.groupIndex];
                if (tempPaiNode) {
                    let src = tempPaiNode.getComponent("paiCtrl");
                    src && src.setOrignStatus();               //不是自己回合，设置恢复原位
                }
            }
        } else if (msgId == "finisPai") {                  //结算
            if (self.isSelfTurn == true && self.isPickOneCard == true) {
                self.changeOpenAreaSpriteFrame(notify.paiValue, false);
                self.finishCardData = { groupTag: notify.groupTag, paiIndex: notify.groupIndex, paiValue: notify.paiValue };
                let value = notify.paiValue;
                self.finishAction(notify);
                self.checkScore(value);
            } else {
                let tempPaiGroup = self.paiGroupArr[notify.groupTag];
                if (tempPaiGroup) {
                    let tempPaiNode = tempPaiGroup[notify.groupIndex];
                    if (tempPaiNode) {
                        let src = tempPaiNode.getComponent("paiCtrl");
                        src && src.setOrignStatus();               //不是自己回合，设置恢复原位
                    }
                }
            }
        } else if (msgId == "agreeDeclare") {       //同意结算，发送牌型至服务端，服务端发送结算广播
            self.TidyFinalCardsReq(self.getPaiValueArr(), +self.userInfoCtrl.getScore());
        } else if (msgId == "touchEnd") {
            if (self.isSelfTurn == true && self.isPickOneCard == true) {
                self.line.active = false;
            }
        } 
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            self.isTuiChu = true;
            let lab_drop = self.btn_drop.node.getChildByName("lab").getComponent(cc.Label);
            if (self.tableStatus == 0 || self.tableStatus == 1) {
                self.exitGame();
            } 
            else if (self.tableStatus == 2 || self.tableStatus == 3 || self.tableStatus == 4) {
                let arr = [
                    `You will lose ${lab_drop.string} .Are you sure you want to leave self table?`,
                    `आप ${lab_drop.string}"खो देंगे। क्या आप निश्चित हैं कि आप इस टेबल को छोड़ना चाहते हैं?`,
                    ` کھو دیں گے۔ کیا آپ واقعی یہ ٹیبل چھوڑنا چاہتے ہیں؟ ${lab_drop.string} آپ`,
                    `আপনি ${lab_drop.string} হারাবেন। আপনি কি নিশ্চিত আপনি এই টেবিল প্রস্থান করতে চান?`,
                ];
                
                CommonFun.getInstance().showMsgBox(arr[language-1], "YES_NO", () => {
                    // 发送结算消息
                    self.dropReq();
                }, false);
            } 
            else {
                self.dropReq();
            }
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("rummy");
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE) {
            self.changeRoomReq();
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    cashSwitch: function () {
        this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
        if (this.entrycondition == 0) {
            this.node.getChildByName("btn_shop").active = true;
        }
    },


    checkWebMsgError: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `拉米二人场游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.outcard") {
            LoggerUtil.getInstance().error("出牌消息ACK", notify.result.message);
            if (notify.result.result == 20523) {        // 找不到该牌
                self.RefreshGameSceneReq();
            }
        } else if (msgId === "gameservice.changetable") {
            if(notify.result.result == 20529){        // 游戏不存在
                self.changetable();
                self.enterRoomReq();
            }else {
                let msg = notify.result.message;
                CommonFun.getInstance().showTips(msg);
            }
        } else if (msgId == "gameservice.receivefreetrial") {
            let msg = notify.result.message;
            CommonFun.getInstance().showTips(msg);
        } else if (msgId === "gameservice.enterroom") {
            if (notify.result.result == 20519) {    // 已在房间中
                self.RefreshGameSceneReq();
            }
            else{
                let msg = notify.result.message;
                CommonFun.getInstance().showMsgBox(msg, "YES", () => {
                    // 接口服务繁忙，未曾登录，弹出至选场界面
                    window.isNeedShowRoomList = "rummy";
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
                }, false);
            }
        } else if (msgId == "gameservice.refreshgamescene") {   
            let msg = notify.result.message; 
            if(notify.result.result == 20529) {        // 不在游戏中
                CommonFun.getInstance().showMsgBox(msg, "YES", () => {
                    window.isNeedShowRummyList = "rummy";
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
                }, false);
            }else{
                CommonFun.getInstance().showTips(msg);
            }
        }else if(msgId === "gameservice.exitgame"){
            let msg = notify.result.message; 
            if(notify.result.result == 20515) {      // 不允许退出
                CommonFun.getInstance().showTips(msg);
            }else{
                window.isNeedShowRummyList = "rummy";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
            }
        } else if (msgId == "gameservice.setcontinue"){
            if(notify.result.result == 20529) {        // 不在游戏中
                if (self.node.getChildByName("settlement")) {
                    self.node.getChildByName("settlement").destroy();
                    self.userInfoCtrl.lab_scoreName.string = "Score:"
                    self.userInfoCtrl.lab_score.string = "0"
                }
                self.isChange = false
                self.changeRoomReq();
            }
        } else if (msgId === "gameservice.shortmessage") {
            let msg = notify.result.message;
            CommonFun.getInstance().showTips(msg);
        }
        else if (msgId == "gameservice.movehandgroup") {
            self.check_moveHandGroup(notify);
        }else{
            let msg = notify.result.message;
            CommonFun.getInstance().showTips(msg);
        }
    },
    // ==================================== 检测数据  start ============================================
    check_EnterRoomData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("进入房间的数据为空！！！");
            return
        }

    },

    check_ChangeTacleData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("换桌的数据为空！！！");
            return
        }
    },

    check_ReadyData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("玩家准备的数据为空！！");
            return
        }
    },

    check_moveHandGroup: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("游戏开始的数据为空！！！");
            return
        }

        if (notify.result && notify.result.message == "成功") {
            // LoggerUtil.getInstance().log("啦啦啦啦啦啦啦啦绿绿绿绿绿绿绿");
            return
        }
        if (notify.result && (notify.result.message == "牌组与服务数据不一致" || notify.result.result == 10035)) {
            LoggerUtil.getInstance().error("牌组与服务数据不一致,此时客户端的牌组为：" + this.getPaiValueArr());
            let cards = notify.handCards;
            this.reConnectGame(cards);
        }
    },

    check_GameStartData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("游戏开始的数据为空！！！");
            return
        }
        // this.isChange = false;
        this.initNodeState(false);
        this.TipsLab()
        this.tableStatus = 2;
        this.setRecorderCard(true)
        let banker = notify.banker;
        let firstCards = notify.firstPickCard;
        let firstPickWinSeat = notify.firstPickWinSeat;
        let selfSeat = this.userInfoCtrl.getSeatId();
        for (let i = 0; i < firstCards.length; i++) {
            let element = firstCards[i];
            if (selfSeat == i) {          //自己的牌，用来确认谁是庄家
                this.actionFirstPai(element, { scale: 0.8, position: cc.v2(0, 20) });
            } else {
                this.actionFirstPai(element, { scale: 0.8, position: cc.v2(0, 300) });
            }
        }
        if (selfSeat == firstPickWinSeat) {           //自己是庄家
            this.isSelfTurn = true;
            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
        } else {
            this.isSelfTurn = false;
            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
        }
        this.btn_close.node.active = true;
        this.btn_open.node.active = true;

    },

    check_ShortMsgData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("短消息的数据为空！！");
            return
        }
    },

    check_PickCardData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("起牌的数据为空！！");
            return
        }
        this.recorderCardCtrl.playTouchCrad(notify)
        if (this.selfSeat == notify.seat) {       //自己的起牌广播
            LoggerUtil.getInstance().log("自己起牌广播")
            this.isPickOneCard = true;
            this.round += 1;
            this.setDropScore(this.round);
            this.showLobbyUI("outCard")
        } else {
            this.round += 1;
            this.setDropScore(this.round);
            GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("yipai");
        }
        this.showLobbyUI("shouZhi", false)
        this.fapaiAction(notify, this.selfSeat == notify.seat);
    },

    check_ChooseHuData: function (notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("选择胡牌的数据为空！！！");
            return
        }
        LoggerUtil.getInstance().log("报胡的广播");
        this.huSeat = false;
        if (notify.huSeat == this.selfSeat) {         //自己胡牌
            this.otherUserCtrl.countDown(true, notify.simpleTimeout - 1, 0, true);
            this.userInfoCtrl.countDown(false);
            if (notify.isHu) {
                let tishi = cc.instantiate(this.prefab_tishi);
                let tishiCtrl = tishi.getComponent("tishiCtrl");
                tishiCtrl.setTishi(this.textArr[5]);
                tishi.parent = this.node;
            }
        } else {
            let tishi_finish = cc.instantiate(this.prefab_tishi_finish);
            let tishi_finishCtrl = tishi_finish.getComponent("tishi_finishCtrl");
            tishi_finishCtrl.setDeClareContent(this.otherUserCtrl.getNickName() + " has declared" + "\n" + "Group your cards and declare");
            tishi_finish.parent = this.node;
            this.userInfoCtrl.countDown(true, notify.simpleTimeout - 1, 0, true);
            this.otherUserCtrl.countDown(false);
            this.tidyfinalcardsSchedule = function () {
                this.TidyFinalCardsReq(this.getPaiValueArr(), +this.userInfoCtrl.getScore());
            };
            this.scheduleOnce(this.tidyfinalcardsSchedule, notify.simpleTimeout - 1);
        }
        this.cardLibNode.getComponent(cc.Sprite).spriteFrame = this.getPaiSpriteFrameByValue(notify.outCard);
        this.cardLibNode.active = true;
        this.btn_close.node.active = false;
        this.btn_open.node.active = false;
    },

    //结算
    check_onGamecalcData: function (notify) {
        this.tableStatus = 6
        this.isChange = true;
        if (!notify) {
            LoggerUtil.getInstance().error("结算的数据为空！！！");
            return
        }
        for (let i = 0, len = this.tweenTagArr.length; i < len; i++) {
            let tag = this.tweenTagArr[i];
            cc.Tween.stopAllByTag(tag);
        }
        // cc.Tween.stopAll();
        this.unschedule(this.dealCallback);
        this.unschedule(this.fapaiCallBack1);
        this.unschedule(this.fapaiCallBack2);
        this.unschedule(this.freshNotifyCallback);
        this.unschedule(this.flowPaiCallBack);
        clearTimeout(this.dealTimeOutID);
        this.setRecorderCard(false)
        this.userInfoCtrl.countDown(false);
        this.otherUserCtrl.countDown(false);
        this.initNodeState(false);

        this.putSelfCardToPool();
        let players = notify.players;
        for (let i = 0; i < players.length; i++) {
            let seat = players[i].seat
            if (seat == this.selfSeat) {
                this.userInfoCtrl.gameover(notify, players[i].calc)
            } else {
                this.otherUserCtrl.gameover(notify, players[i].calc)
            }
        }
    },

    //换桌
    changetable: function () {
        CommonFun.getInstance().showGameStartMask();        
        this.otherUserCtrl.freshUser();
        this.initNodeState(false);
    },

    check_GameSceneData: function (notify) {
        let playerList = notify.players;
        let status = notify.status;                  //牌桌状态
        this.tableStatus = notify.status;
        this.cellScore = (notify.cellScore / 100).toFixed(2);           //底分
        let laiId = notify.laiId;                   //癞子的牌,左侧区域展示的癞子牌的value
        let roomType = notify.roomType;             //房间类型
        let dissolveSeat = notify.dissolveSeat;      //解散的座位号,默认为-1
        let banker = notify.banker;                     //庄家
        this.round = notify.round;                       //回合数 
        let step = notify.step;                         //当前阶段
        let curSeat = notify.curSeat;                   //当前操作的座位号
        let leftRemain = notify.leftRemain;                 //左侧剩余张数
        let rightFace = notify.rightFace;                   //右侧展示的牌
        let rightRemain = notify.rightRemain;               //右-剩余张数
        // let simpleCountdown = notify.simpleCountdown;       //牌权倒计时(默认20)
        // let extraCountdown = notify.extraCountdown;         //牌权额外超时(默认30)
        LoggerUtil.getInstance().log("GameScene消息执行了-----", "当前操作的座位号" + curSeat);
        this.initNodeState(true);
        this.laiValue = notify.laiId;
        this.laiNumber = this.getPaiNum(laiId);               //癞子的牌值
        this.setDropScore(this.round);
        for (let i = 0; i < playerList.length; i++) {
            let item = playerList[i];
            let userinfo = item.user;
            if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {
                this.userInfoCtrl.setUserInfo(userinfo, item.seat);
                this.selfSeat = item.seat;
                this.selfAbsoluteSeatId = item.seat;
            } else {
                this.otherUserCtrl.setUserInfo(userinfo, item.seat);
            }
        }
        if (status == 0) { this.TipsLab(8) } else { this.TipsLab() }

        switch (status) {
            case 0:                                     //游戏准备阶段
                LoggerUtil.getInstance().log("游戏状态为准备阶段");
                break;
            case 1:                                     //开局(开局倒计时的3秒内)
                LoggerUtil.getInstance().log("游戏阶段：开局预备");
                break
            case 2:                                     //(游戏正式开始但未发牌)
                LoggerUtil.getInstance().log("游戏阶段：开局比牌中");
                break
            case 3:                                     //发牌中
                LoggerUtil.getInstance().log("游戏阶段为：发牌中");
                this.setRecorderCard(true)
                for (let i = 0; i < playerList.length; i++) {
                    let item = playerList[i];
                    let userinfo = item.user;
                    if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {
                        this.startSetPai(item.cards, laiId, leftRemain, rightFace, rightRemain);
                        this.selfSeat = item.seat;
                        if (this.selfSeat == curSeat) {
                            this.isSelfTurn = true;
                            if (item.cards.length == 14) {
                                this.isPickOneCard = true;
                                this.showLobbyUI("outCard");
                            } else {
                                this.scheduleOnce(() => {
                                    this.showLobbyUI("qiCrad");
                                }, 2.5)
                            }
                            this.fapaiCallBack1 = () => {
                                this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
                                this.userInfoCtrl.countDown(true, 20, item.extraCountdown);
                            }
                            this.scheduleOnce(this.fapaiCallBack1, 2);
                        } else {
                            this.isSelfTurn = false;
                            this.isPickOneCard = false;
                            
                        }
                    }else if(item.seat == curSeat) {
                        this.fapaiCallBack2 = () => {
                            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
                            this.otherUserCtrl.countDown(true, 20, item.extraCountdown);
                        }
                        this.scheduleOnce(this.fapaiCallBack2, 2);
                    }
                }
                LoggerUtil.getInstance().log("是不是自己回合：" + this.isSelfTurn, '是否已经摸了一张牌' + this.isPickOneCard);
                break;
            case 4:                                     //游戏中
                LoggerUtil.getInstance().log("游戏阶段为：游戏中");              //用于断线重连
                this.setRecorderCard(true)
                for (let i = 0; i < playerList.length; i++) {
                    let item = playerList[i];
                    let userinfo = item.user;
                    let handGroup = item.handGroup;
                    if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {     //自己
                        this.userInfoCtrl.setUserInfo(userinfo, item.seat);
                        this.selfSeat = item.seat;
                        if (handGroup.length > 0) {
                            LoggerUtil.getInstance().log("需要牌组》》》》》》》》》》");
                            this.reConnectGameByGroup(handGroup);
                        } else {
                            LoggerUtil.getInstance().log("不需要牌组》》》》》》》》》》");
                            this.reConnectGame(item.cards);
                        }
                        if (this.selfSeat == curSeat) {
                            this.isSelfTurn = true;
                            if (item.cards.length == 14) {
                                this.isPickOneCard = true;
                                this.showLobbyUI("outCard");
                            } else {
                                this.showLobbyUI("qiCrad");
                            }
                            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
                            this.userInfoCtrl.countDown(true, item.simpleCountdown, item.extraCountdown);
                        } else {
                            this.isSelfTurn = false;
                            this.isPickOneCard = false;
                        }
                    } else {
                        if(item.seat == curSeat){
                            this.otherUserCtrl.setUserInfo(userinfo, item.seat);
                            this.otherUserCtrl.countDown(true, item.simpleCountdown, item.extraCountdown);
                        }else{
                            this.otherUserCtrl.setUserInfo(userinfo, item.seat);
                            this.otherUserCtrl.countDown(false);
                        }
                    }
                    this.setNodeActive(laiId, leftRemain, rightFace, rightRemain);
                }
                LoggerUtil.getInstance().log("是不是自己回合：" + this.isSelfTurn);
                break;
            case 5:                                      //报胡中 (等待下家应答胡)
                LoggerUtil.getInstance().log("游戏阶段为：报胡中");
                window.isNeedShowRoomList = "rummy";
                let winSeat = curSeat;
                for (let i = 0; i < playerList.length; i++) {
                    let item = playerList[i];
                    let userinfo = item.user;
                    let handGroup = item.handGroup;
                    if (GlobalCfg.USER_DATAS.userId == userinfo.displayName) {     //自己
                        this.userInfoCtrl.setUserInfo(userinfo, item.seat);
                        this.selfSeat = item.seat;
                        if (handGroup.length > 0) {
                            LoggerUtil.getInstance().log("需要牌组》》》》》》》》》》");
                            this.reConnectGameByGroup(handGroup);
                        } else {
                            LoggerUtil.getInstance().log("不需要牌组》》》》》》》》》》");
                            this.reConnectGame(item.cards);
                        }
                        if (this.selfSeat == curSeat) {             //当前操作的玩家，即赢家
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
                            winSeat = item.seat;
                            this.isSelfTurn = false;
                            this.isPickOneCard = false;
                            let tishi_finish = cc.instantiate(this.prefab_tishi_finish);
                            let tishi_finishCtrl = tishi_finish.getComponent("tishi_finishCtrl");
                            let otherWinUserCtrl = this.getOtherNodeCtrlBySeat(curSeat);
                            tishi_finishCtrl.setDeClareContent(otherWinUserCtrl.getNickName() + " has declared" + "\n" + "Group your cards and declare");
                            tishi_finish.parent = this.node;
                            this.userInfoCtrl.countDown(true, item.simpleCountdown, item.extraCountdown);
                        }
                    } else {
                        this.otherUserCtrl.setUserInfo(userinfo, item.seat);
                        if(curSeat == item.seat){
                            this.otherUserCtrl.countDown(false);
                        } else {
                            this.otherUserCtrl.countDown(true, item.simpleCountdown - 1, item.extraCountdown, true, item.playerStatus);
                        }
                    }
                    this.setNodeActive(laiId, leftRemain, rightFace, rightRemain);
                }
                // let deat = {
                //     huSeat: winSeat,
                //     isHu: false,
                //     simpleTimeout: 10,
                // }
                // this.check_ChooseHuData(deat)
                break;
            case 6:                                     //结算阶段
                LoggerUtil.getInstance().log("游戏阶段为：结算阶段");
                this.tsetCrad();
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

    check_newPlayerJoinData(notify) {
        let userInfo = notify.userInfo;
        let seatId = notify.seatId;
        let isReconnect = notify.isReconnect;
        if (userInfo.displayName == GlobalCfg.USER_DATAS.userId) {
            this.selfSeat = seatId;
            this.userInfoCtrl.setUserInfo(userInfo, notify.seatId);
        } else {
            this.otherUserCtrl.setUserInfo(userInfo, notify.seatId);
        }
    },

    // ==================================== 检测数据  end ============================================


    // ===========================================================
    //断线重连按服务器发的牌组信息展示牌
    reConnectGameByGroup: function (groups) {
        this.paiGroupArr = [];
        for (let i = 0, len = groups.length; i < len; i++) {
            let group = groups[i].cards;
            this.paiGroupArr[i] = [];
            if (group) {
                for (let k = 0, len1 = group.length; k < len1; k++) {
                    let paiValue = group[k];
                    let paiNode = this.createPaiNode();
                    let spriteFrame = this.getPaiSpriteFrameByValue(paiValue);
                    let src = paiNode.getComponent("paiCtrl");
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
        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
        this.btnAction();
    },

    //断线重连
    reConnectGame(valueArr, notify) {
        LoggerUtil.getInstance().log("断线重连&游戏中加入");
        valueArr.sort((a, b) => a - b);
        this.putSelfCardToPool();
        for (let i = 0; i < valueArr.length; i++) {
            let element = valueArr[i];
            if (element == 53 || element == 52) {
                valueArr.splice(i, 1);
                valueArr.splice(0, 0, element);
            }
        }
        let paiNodeArr = [];
        let initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;
        for (let i = 0; i < valueArr.length; i++) {
            let paiNode = this.createPaiNode();
            let spriteFrame = this.getPaiSpriteFrameByValue(valueArr[i]);
            let src = paiNode.getComponent("paiCtrl");
            if (src) {
                src.setLaiActive(false);
                src.setUpClickDistance(this.upClickDistance);
                src.setUpLimitDistance(this.upLimitDistance);
                src.setPaiDistance(this.paiDistance);
                src.setPaiSpriteFrame(spriteFrame);
                src.setPaiValue(valueArr[i]);
                src.setIsCanMove(true);
            }
            paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + i * this.paiDistance, 0);
            this.selfCardNode.addChild(paiNode);

            paiNodeArr.push(paiNode);
        }

        this.paiGroupArr = this.initPaiGroupArr(paiNodeArr);

        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

        this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
        this.btnAction();
    },

    setNodeActive: function (laiId, leftRemain, rightFace, rightRemain) {
        this.cardMask.active = false;
        this.laiNumber = this.getPaiNum(laiId);
        let spriteFrame = this.getPaiSpriteFrameByValue(laiId);
        this.laizi_closeNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.showUniversalCard(spriteFrame, leftRemain);
        this.lab_close.string = "(" + leftRemain + ")";
        let openValue;
        if(rightFace.length > 0){
            openValue = rightFace[0] && rightFace[0].card;
            this.lab_open.string = "(" + rightRemain + ")";
            let openSpriteFrame = this.getPaiSpriteFrameByValue(openValue);
            this.openPaiNode.getComponent(cc.Sprite).spriteFrame = openSpriteFrame;
            let paiNum = this.getPaiNum(openValue);
            if (paiNum == this.laiNumber) {
                this.openPaiNode.getChildByName("lai").active = true;
            }
            this.openNode.active = true;
        }
        

    },

    actionFirstPai: function (value, arg) {
        // LoggerUtil.getInstance().log("第一张牌比大小");
        let spriteFrame = this.getPaiSpriteFrameByValue(value);
        let paiNode = this.createPaiNode();
        paiNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        paiNode.parent = this.selfCardNode;
        cc.tween(paiNode)
            .tag(1)
            .to(0.3, arg)
            .start();
        setTimeout(() => {
            this.onCardRemoved(paiNode);
        }, 1000);
    },

    startSetPai: function (valueArr, laiId, leftRemain, rightFace, rightRemain) {
        // 初始化牌,处理牌组数据排列顺序

        // let valueArr = [3, 4, 5, 13, 16, 19, 26, 27, 28, 50, 51, 52, 53];
        valueArr.sort((a, b) => a - b);
        for (let i = 0; i < valueArr.length; i++) {
            let element = valueArr[i];
            if (element == 53 || element == 52) {
                valueArr.splice(i, 1);
                valueArr.splice(0, 0, element);
            }
        }
        this.deal(valueArr, laiId, leftRemain, rightFace, rightRemain);
    },

    clickPaiCallBack: function (data) {
        LoggerUtil.getInstance().log("clickPaiCallBack>>>>>>>>>>>", data);
        if (!data) {
            return;
        }

        let paiValue = data.paiValue;
        let groupTag = data.groupTag;
        let isCancal = data.isCancal;
        if (isCancal) {
            for (let i = 0, len = this.clickPaiArr.length; i < len; i++) {
                let clickPai = this.clickPaiArr[i];
                let clickPaiTag = clickPai.groupTag;
                let clickPaiValue = clickPai.paiValue;
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

    insertPaiCallBack: function (data) {
        if (!data) {
            return;
        }
        LoggerUtil.getInstance().log("insertPaiCallBack>>>>>>>>>>>", data);
        let paiValue = data.paiValue;
        let groupTag = data.groupTag;
        let groupIndex = data.groupIndex;
        let posX = data.posX;
        let movePaiNode = null;

        LoggerUtil.getInstance().log("从这个组中删除元素：", this.paiGroupArr[groupTag], "长度" + this.paiGroupArr[groupTag].length);
        // 从原来的组中删除
        movePaiNode = this.paiGroupArr[groupTag][groupIndex];
        let tempArr = [];
        if (movePaiNode) {
            let src = movePaiNode.getComponent("paiCtrl");
            //再次确定一下当前位置的牌跟拖动的牌是不是一张
            if (src.getPaiValue() == paiValue) {
                tempArr = this.paiGroupArr[groupTag].splice(groupIndex, 1);
            } else {
                LoggerUtil.getInstance().error("当前位置的牌跟拖动的牌是不是同一张，根据牌值来此牌组中寻找");
                for (let i = this.paiGroupArr[groupTag].length - 1; i >= 0; i--) {
                    let paiNode = this.paiGroupArr[groupTag][i];
                    if (paiNode) {
                        let src = paiNode.getComponent("paiCtrl");
                        if (src.getPaiValue() == paiValue) {
                            tempArr = this.paiGroupArr[groupTag].splice(i, 1);
                            break;
                        }
                    }

                }
            }
        }
        movePaiNode = tempArr[0];

        // 加入到新的组中
        let isFinishJoin = false
        for (let i = 0, len = this.paiGroupArr.length; i < len; i++) {
            if (isFinishJoin) {
                break;
            }
            if (this.paiGroupArr[i].length == 0) { continue }
            for (let k = 0, len1 = this.paiGroupArr[i].length; k < len1; k++) {
                let paiNode = this.paiGroupArr[i][k];
                if (!paiNode) {
                    continue;
                }
                let paiNodeLeftX = paiNode.x - this.paiWidth / 2;
                if (k == 0) {
                    if (i == 0 && posX <= paiNodeLeftX) {

                        LoggerUtil.getInstance().log("牌插入最左面");
                        this.paiGroupArr[i].unshift(movePaiNode);
                        isFinishJoin = true;
                        break;

                    } else if (posX >= paiNodeLeftX - this.groupDistance && posX < paiNodeLeftX) {
                        LoggerUtil.getInstance().log("牌插入组最前面");
                        this.paiGroupArr[i].unshift(movePaiNode);
                        isFinishJoin = true;
                        break;
                    } else if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiDistance) {
                        LoggerUtil.getInstance().log("牌插入组第一位");
                        this.paiGroupArr[i].splice(1, 0, movePaiNode);
                        isFinishJoin = true;
                        break;
                    }
                } else if (k == len1 - 1) {
                    if (i == len - 1) {
                        if (posX > paiNode.x + this.paiWidth / 2) {
                            LoggerUtil.getInstance().log("牌插入组最右面");
                            this.paiGroupArr[i].push(movePaiNode);
                            isFinishJoin = true;
                            break;
                        }
                    }
                    if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiWidth) {
                        LoggerUtil.getInstance().log("牌插入组最后面");
                        this.paiGroupArr[i].push(movePaiNode);
                        isFinishJoin = true;
                        break;
                    }
                } else {
                    if (posX >= paiNodeLeftX && posX < paiNodeLeftX + this.paiDistance) {
                        LoggerUtil.getInstance().log("牌插入组的第" + (k + 1) + "位");
                        this.paiGroupArr[i].splice(k + 1, 0, movePaiNode);
                        isFinishJoin = true;
                        break;
                    }
                }
            }
        }
        if (isFinishJoin == false) {
            this.paiGroupArr[groupTag].splice(groupIndex, 0, movePaiNode);
        } else {
            for (let i = 0, len = this.paiGroupArr.length; i < len; i++) {
                if (this.paiGroupArr[i].length == 0) {
                    LoggerUtil.getInstance().log("组已消失，需要删除", i);
                    this.paiGroupArr.splice(i, 1);
                    break;
                }
            }
        }

        this.setPaiNodeIndex(this.paiGroupArr);         // 更新组的信息

        this.clickPaiArr.length = 0;
        this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

        this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
    },

    outPaiCallBack: function (data) {
        // LoggerUtil.getInstance().log("outPaiCallBack>>>>>>>>>>>", data);
        let index = [1, data.groupTag, data.groupIndex].join('');
        this.outCardReq(data.paiValue, parseInt(index));
    },

    //牌超过限制的线，open区域的牌切换
    limitTipsCallBack: function (data) {
        // LoggerUtil.getInstance().log("limitTipsCallBack>>>>>>>>>>>", data);
        this.changeOpenAreaSpriteFrame(data.paiValue, true);
    },

    underLimitTipsCallBack: function (data) {
        // LoggerUtil.getInstance().log("underlimitTipsCallBack---------------", data);
        this.changeOpenAreaSpriteFrame(data.paiValue, false);
    },

    printPaiGroupValue: function (tipsStr = "", paiGroupArr = []) {
        let t = [];
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            let paiGroup = paiGroupArr[i];
            let t1 = [];
            for (let k = 0, len1 = paiGroup.length; k < len1; k++) {
                let paiNode = paiGroup[k];
                if (paiNode) {
                    let src = paiNode.getComponent("paiCtrl");
                    let paiValue = src.getPaiValue();
                    t1.push(paiValue);
                }
            }
            t.push(t1);
        }
        LoggerUtil.getInstance().log(tipsStr, t);
    },

    changeOpenAreaSpriteFrame: function (paiValue, bool) {
        if (bool == true) {
            let spriteFrameNew = this.getPaiSpriteFrameByValue(paiValue);
            this.openPaiNode.getComponent(cc.Sprite).spriteFrame = spriteFrameNew;
            this.cardMask.active = true;
        } else {
            this.openPaiNode.getComponent(cc.Sprite).spriteFrame = this.tempOpenSpriteFrame;
            this.cardMask.active = false;
        }

    },

    //出牌
    OutCard: function (notify) {
        GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
        this.recorderCardCtrl.playOutCrad(notify)
        if (notify.seat == this.selfSeat) {
            this.showLobbyUI("offCradGuang")
            if (notify.index == -1) {             //超时自动出牌
                let isDel = false;
                for (let i = this.paiGroupArr.length - 1; i >= 0; i--) {
                    let childArr = this.paiGroupArr[i];
                    for (let j = 0; j < childArr.length; j++) {
                        let node = childArr[j];
                        let src = node.getComponent("paiCtrl");
                        let paiValue = src.getPaiValue();
                        // LoggerUtil.getInstance().log("超时自动出牌的节点牌值", paiValue, "收到的出牌值", notify.card)
                        if (paiValue == notify.card) {
                            this.paiGroupArr[i].splice(j, 1);
                            this.onCardRemoved(node);
                            isDel = true
                            //删除出牌之后导致的空数组
                            for (let i = 0; i < this.paiGroupArr.length; i++) {
                                let element = this.paiGroupArr[i];
                                if (element.length == 0) {
                                    this.paiGroupArr.splice(i, 1);
                                }
                            }
                        }
                        if (isDel == true) {
                            break
                        }
                    }
                    if (isDel == true) {
                        break
                    }
                }
                let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
            } else {
                let groupData = this.getSliceNum(notify.index);
                // LoggerUtil.getInstance().log("________________", groupData);
                if (this.clickPaiArr.length != 0 && this.clickPaiArr.length == 1) {
                    let paiNode = this.paiGroupArr[groupData.groupTag][groupData.groupIndex];
                    let src = paiNode.getComponent("paiCtrl");
                    LoggerUtil.getInstance().log("点击出牌~~~~", src.getPaiValue(), notify.card);
                    if (notify.card == src.getPaiValue()) {
                        cc.tween(paiNode)
                            .tag(2)
                            .to(0.2, { position: cc.v2(195.8, 195), scale: 0.8 })
                            .call(() => {
                                this.paiGroupArr[groupData.groupTag] && this.paiGroupArr[groupData.groupTag].splice(groupData.groupIndex, 1);
                                let openSpriteFrame = this.getPaiSpriteFrameByValue(notify.card);

                                this.openPaiNode && (this.openPaiNode.getComponent(cc.Sprite))
                                    && (this.openPaiNode.getComponent(cc.Sprite).spriteFrame = openSpriteFrame);

                                this.onCardRemoved(paiNode);
                                //删除出牌之后导致的空数组
                                for (let i = 0; i < this.paiGroupArr.length; i++) {
                                    let element = this.paiGroupArr[i];
                                    if (element.length == 0) {
                                        this.paiGroupArr.splice(i, 1);
                                    }
                                }
                                this.clickPaiArr = [];
                                let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                                this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

                                this.openPaiNode && (this.openPaiNode.getComponent(cc.Sprite))
                                    && (this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame);
                                this.reqMovehandgroup(this.paiGroupArr);
                            })
                            .start();
                    }
                } else {
                    let paiNode = this.paiGroupArr[groupData.groupTag][groupData.groupIndex];
                    let src = paiNode.getComponent("paiCtrl");
                    if (notify.card == src.getPaiValue()) {
                        this.paiGroupArr[groupData.groupTag].splice(groupData.groupIndex, 1);
                        // this.onCardRemoved(paiNode);
                        paiNode.destroy();
                        //删除出牌之后导致的空数组
                        for (let i = 0; i < this.paiGroupArr.length; i++) {
                            let element = this.paiGroupArr[i];
                            if (element.length == 0) {
                                this.paiGroupArr.splice(i, 1);
                            }
                        }
                        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

                    }
                }
            }
            //出完牌更新牌的 index
            this.setPaiNodeIndex(this.paiGroupArr);

            // let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
            // this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

            this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame;
            this.isSelfTurn = false;
            this.isPickOneCard = false;
            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
            this.userInfoCtrl.countDown(false);
            this.otherUserCtrl.countDown(true, notify.simpleTimeout, notify.extraTimeout);

        } else {                //对家出牌
            this.showLobbyUI("qiCrad")
            let paiNode = this.createPaiNode();
            let paiSprite = this.getPaiSpriteFrameByValue(notify.card);
            paiNode.getComponent(cc.Sprite).spriteFrame = paiSprite;
            paiNode.setPosition(0, 250);
            paiNode.scale = 0.8;
            paiNode.parent = this.node;
            cc.tween(paiNode)
                .tag(3)
                .to(0.2, { scale: 0.8, position: cc.v2(195.8, 22) })
                .call(() => {
                    this.openPaiNode && (this.openPaiNode.getComponent(cc.Sprite))
                        && (this.openPaiNode.getComponent(cc.Sprite).spriteFrame = paiSprite);

                    paiNode && (this.onCardRemoved(paiNode));
                })
                .start();

            this.isSelfTurn = true;     //对家出完牌，轮到自己
            this.isPickOneCard = false;
            this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
            this.otherUserCtrl.countDown(false);
            this.userInfoCtrl.countDown(true, notify.simpleTimeout, notify.extraTimeout);
        }
        this.showOpenAreaCard(notify.rightFace, notify.rightRemain);
    },

    // 0 ~ 51; 
    // 52, 53;
    // 获取牌的精灵资源
    getPaiSpriteFrameByValue: function (paiValue) {
        let paiType = this.getPaiType(paiValue);
        // let paiNum = this.getPaiNum(paiValue);
        let getNum = function (paiValue) {
            let paiNum = ((paiValue + 12) % 13);
            if (paiValue == 52) {
                paiNum = "d";
            } else if (paiValue == 53) {
                paiNum = "x";
            }
            return paiNum;
        }
        let paiNum = getNum(paiValue);
        if (paiNum == 0) {
            paiNum = 13;
        }
        let spriteFrame = this.spriteAtlas_pai.getSpriteFrame(paiType + paiNum);
        return spriteFrame;
    },

    getPaiNum: function (paiValue) {
        let paiNum = (paiValue % 13);
        if (paiValue == 52) {
            paiNum = "d";
        } else if (paiValue == 53) {
            paiNum = "x";
        }
        return paiNum;
    },

    getPaiType: function (paiValue) {
        let paiType = "";
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

    initPaiGroupArr: function (paiNodeArr) {
        let heiTaoGroup = [];
        let hongXinGroup = [];
        let meiHuaGroup = [];
        let fangKuaiGroup = [];
        let wangGroup = [];
        for (let i = 0, len = paiNodeArr.length; i < len; i++) {
            let paiNode = paiNodeArr[i];
            let src = paiNode.getComponent("paiCtrl");
            let paiValue = src.getPaiValue();
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

        let paiGroupArr = [];
        // let groupTag = 0;
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
        for (let i = 0; i < paiGroupArr.length; i++) {
            let tempArr = paiGroupArr[i];
            for (let j = 0; j < tempArr.length; j++) {
                let paiNode = tempArr[j];
                let src = paiNode.getComponent("paiCtrl");
                src.setGroupTag(i, j);
            }

        }
        LoggerUtil.getInstance().log("Push之后的数组", paiGroupArr);


        return paiGroupArr;
    },

    getPaiTotalWidthByPaiGroupArr: function (paiGroupArr) {
        let totalWidth = 0;
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            let paiGroup = paiGroupArr[i];
            let paiGroupLen = paiGroup.length;
            let tempWidth = (paiGroupLen - 1) * this.paiDistance + this.paiWidth;
            totalWidth += tempWidth
        }
        return totalWidth;
    },

    setPaiPosByTotalWidthAndpaiGroupArr: function (totalWidth, paiGroupArr, isBtnGroup, isFirstFaPai) {
        isBtnGroup = isBtnGroup ? isBtnGroup : false;
        LoggerUtil.getInstance().log("是否是按钮组牌：" + isBtnGroup);
        let qiPos = totalWidth / 2;
        let tempX = 0;
        let handGroup = [];
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            let paiGroup = paiGroupArr[i];
            handGroup[i] = [];
            for (let k = 0, len1 = paiGroup.length; k < len1; k++) {
                let paiNode = paiGroup[k];
                if (!paiNode) {
                    continue;
                }
                if (i == 0) {
                    tempX = -qiPos + this.paiWidth / 2 + this.paiDistance * k;
                } else {
                    if (k == 0) {
                        tempX = tempX + this.groupDistance + this.paiWidth;
                    } else {
                        tempX = tempX + this.paiDistance;
                    }
                }
                let paiValue = paiNode.getComponent("paiCtrl").getPaiValue();
                handGroup[i][k] = paiValue;
                if (isFirstFaPai) {
                    cc.tween(paiNode)
                        .tag(4)
                        .to(0.1, { position: cc.v2(tempX, 0) })
                        .to(0.1)
                        .call(() => {
                            if (i == len - 1 && k == len1 - 1) {
                                for (let j = 0; j < paiGroupArr.length; j++) {
                                    let element = paiGroupArr[j];
                                    for (let l = 0; l < element.length; l++) {
                                        let paiNode = element[l];
                                        if (paiNode) {
                                            let src = paiNode.getComponent("paiCtrl");
                                            src.setIsCanMove(true);
                                        }
                                    }
                                }
                                this.lifeBar(paiGroupArr, isBtnGroup);

                            }
                        })
                        .start();
                } else {
                    paiNode.setPosition(tempX, 0);
                    let src = paiNode.getComponent("paiCtrl");
                    src.setIsCanMove(true);
                }


            }
        }
        if (!isFirstFaPai) {
            this.lifeBar(paiGroupArr, isBtnGroup);
        }
        this.setPaiNodeIndex(paiGroupArr);
        this.clickPaiArr.length = 0;
        this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);

    },

    lifeBar(paiGroupArr, isBtnGroup) {
        isBtnGroup = isBtnGroup ? isBtnGroup : false;
        // LoggerUtil.getInstance().log("lifeBar中的isBtnGroup" + isBtnGroup);
        for (let j = 0; j < this.barCount; j++) {
            // LoggerUtil.getInstance().log("bar========>:", "bar" + j)
            // LoggerUtil.getInstance().log("this.selfCardNode.name:", this.selfCardNode.name)

            let node = this.selfCardNode.getChildByName("bar" + j);
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
        for (let j = 0, len = paiGroupArr.length; j < len; j++) {
            let childArr = paiGroupArr[j];
            if (childArr && Array.isArray(childArr)) {
                for (let i = 0; i < childArr.length; i++) {
                    let element = childArr[i];
                    if (element == undefined) {
                        childArr.splice(i, 1);
                        LoggerUtil.getInstance().error("当前数组" + j + "的第" + i + "个元素为undefined")
                    }
                }
                if (childArr.length != 0) {
                    let type = this.checkGroupLiftBar(childArr);
                    this.lifeArr.push({ type, childArr });
                }
            } else {
                continue
            }
        }
        let groupPai = this.lifeArr[0];  //点击button  group组的牌组
        LoggerUtil.getInstance().log("!!!!!!!!!!groupPai", groupPai);
        for (let i = 0; i < this.lifeArr.length; i++) {
            let element = this.lifeArr[i];
            LoggerUtil.getInstance().log("lifeArr 的第" + i + "个节点", element);

        }
        this.lifeArr.sort((a, b) => { return a.type - b.type });
        if (isBtnGroup == true) {
            LoggerUtil.getInstance().log("~~~~~~~~~~groupPai", groupPai);
            if (groupPai.type == 1 || groupPai.type == 2 || groupPai.type == 3) {
                LoggerUtil.getInstance().log("当前组的牌成序列");
            } else {
                for (let i = 1; i < paiGroupArr.length; i++) {
                    let type = this.checkGroupLiftBar(paiGroupArr[i]);
                    LoggerUtil.getInstance().log("type" + type, paiGroupArr[i]);
                    if (type == 1 || type == 2 || type == 3) {
                        let temp = paiGroupArr[i];
                        paiGroupArr[i] = paiGroupArr[i - 1];
                        paiGroupArr[i - 1] = temp;
                    } else {
                        LoggerUtil.getInstance().log("组的牌组跟第" + i + "个一样不成序列");
                        break
                    }
                }
            }
        }
        // LoggerUtil.getInstance().log("存放生命序列的数组：", this.lifeArr);
        let _1StCount = 0;
        let _2ndCount = 0;
        let _3rdCount = 0;
        let scoreCount = 0;         //分数
        let i = 0;
        for (let j = 0, len = this.lifeArr.length; j < len; j++) {
            let element = this.lifeArr[j];
            if (element.type == 0) {
                scoreCount += this.getGameScore(element.childArr);
                continue
            } else if (element.type == 4) {
                this.setBar(element.childArr, element.type);
                scoreCount += this.getGameScore(element.childArr);
                continue
            } else if (element.type == 1) {
                _1StCount++
            } else if (element.type == 2) {
                _2ndCount++
            } else if (element.type == 3) {
                _3rdCount++
            }

            if (_1StCount == 1) {
                if (element.type == 1) {
                    this.setBar(element.childArr, element.type);
                } else if (element.type == 2) {
                    if (_2ndCount == 1) {
                        this.setBar(element.childArr, element.type);
                    } else if (_2ndCount >= 2) {
                        this.setBar(element.childArr, 8);       //Sequence
                    }
                } else if (element.type == 3) {
                    if (_2ndCount >= 1) {
                        this.setBar(element.childArr, element.type);
                    } else {
                        this.setBar(element.childArr, 6);       //2nd Need
                        scoreCount += this.getGameScore(element.childArr);
                    }
                }
            } else if (_1StCount == 2) {
                if (element.type == 1) {
                    this.setBar(element.childArr, 2);       //2nd
                } else if (element.type == 2) {
                    this.setBar(element.childArr, 8);       //Sequence
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 3);       //Set
                }
            } else if (_1StCount > 2) {
                if (element.type == 1) {
                    this.setBar(element.childArr, 7);       //Pure Sequence
                } else if (element.type == 2) {
                    this.setBar(element.childArr, 8);       //Sequence
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 3);       //Set
                }
            } else {                                          //无第一序列
                if (element.type == 2) {
                    this.setBar(element.childArr, 5);       //1st Need
                    scoreCount += this.getGameScore(element.childArr);
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 5);       //1st Need
                    scoreCount += this.getGameScore(element.childArr);
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
    checkScore: function (paiValue) {
        let score = this.userInfoCtrl.getScore();
        if (score == 0) {
            // 发送结算消息
            this.finishReq(paiValue, this.getPaiValueArr());
        } else {
            CommonFun.getInstance().showMsgBox(otherLanguage.rummyTisp_04[language], "YES_NO", (code) => {
                // 发送结算消息
                this.finishReq(paiValue, this.getPaiValueArr());
            }, false, null, "Declare", () => { //取消结算
                LoggerUtil.getInstance().log("finishCardData", this.finishCardData);
                if(this.paiGroupArr[this.finishCardData.groupTag] && Array.isArray(this.paiGroupArr[this.finishCardData.groupTag]) ){
                    this.paiGroupArr[this.finishCardData.groupTag].splice(this.finishCardData.paiIndex, 0, this.finishCrad);
                }else{
                    this.paiGroupArr.splice(this.finishCardData.groupTag, 0, []);
                    this.paiGroupArr[this.finishCardData.groupTag].splice(this.finishCardData.paiIndex, 0, this.finishCrad);
                }
                this.finishCrad.active = true;
                this.setPaiNodeIndex(this.paiGroupArr);

                this.cardLibNode.getComponent(cc.Sprite).spriteFrame = null;
                this.cardLibNode.active = false;
                this.clickPaiArr = [];
                let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);
            });
        }
    },

    //根据回合数来设置弃牌的分数
    setDropScore: function (round) {
        LoggerUtil.getInstance().log("当前回合：",round);
        let lab_dropScore = this.btn_drop.node.getChildByName("lab").getComponent(cc.Label);
        if (round <= 1) {
            lab_dropScore.string = 20 * this.cellScore;
        } else {
            lab_dropScore.string = 40 * this.cellScore;
        }
    },

    //finish，发送paiValue组到服务器
    getPaiValueArr() {
        let paiValueArr = [];
        for (let i = 0; i < this.paiGroupArr.length; i++) {
            let groupArr = this.paiGroupArr[i];
            let groupValueArr = [];
            for (let j = 0; j < groupArr.length; j++) {
                let paiNode = groupArr[j];
                let src = paiNode.getComponent("paiCtrl");
                let value = src.getPaiValue();
                groupValueArr.push(value);
            }
            paiValueArr.push({ cards: groupValueArr });
        }
        return paiValueArr;
    },

    //finish出牌
    finishAction(notify) {
        this.finishCrad = this.paiGroupArr[notify.groupTag][notify.groupIndex];
        this.paiGroupArr[notify.groupTag].splice(notify.groupIndex, 1);
        // this.onCardRemoved(paiNode);
        this.finishCrad.active = false;
        // this.onCardRemoved(this.finishCrad);
        for (let i = 0, len = this.paiGroupArr.length; i < len; i++) {
            let childArr = this.paiGroupArr[i];
            if (childArr && childArr.length == 0) {
                this.paiGroupArr.splice(i, 1);
            }
        }
        let spriteFrame = this.getPaiSpriteFrameByValue(notify.paiValue);
        this.cardLibNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.cardLibNode.active = true;

        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

        this.clickPaiArr.length = 0;
        this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);
    },

    // ----------------------------------------- 发牌 动作   start------------------------------------------------------------------

    //按钮从下方滑上来
    btnAction() {
        cc.tween(this.btnNode)
            .tag(5)
            .to(0.2, { position: cc.v2(0, 0) })
            .start();
        this.controlButton(this.isSelfTurn, this.isPickOneCard, this.clickPaiArr.length);          //全部禁止
    },
    // 发牌
    deal: function (valueArr, laiId, leftRemain, rightFace, rightRemain) {
        this.cardLibNode.active = true
        let interval = 0.05;         // 以秒为单位的时间间隔
        let repeat = 12;            // 重复次数
        let delay = 0;              // 开始延时
        let time = -1;               //发牌的次数
        // let spaceX = 70;            //每个牌之间的间距

        let paiNodeArr = [];
        let initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;
        this.dealCallback = function () {
            time += 1;
            if (time == 0 || time == 3 || time == 7 || time == 10) {
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("fapai")
            }
            // let posX = (-410 + (spaceX * time))
            let paiNode = this.createPaiNode();
            let src = paiNode.getComponent("paiCtrl");
            if (src) {
                src.setLaiActive(false);
                src.setUpClickDistance(this.upClickDistance);
                src.setUpLimitDistance(this.upLimitDistance);
                src.setPaiDistance(this.paiDistance);
                // src.setPaiSpriteFrame(spriteFrame);
                src.setPaiValue(valueArr[time]);
            }
            paiNode.parent = this.selfCardNode;
            paiNode.setPosition(1, 194.5);
            paiNode.scale = 0.8;
            cc.tween(paiNode)
                .tag(6)
                .to(0.1, { scale: 1, position: cc.v2(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + time * this.paiDistance, 0, 0) })
                .call(() => {
                    paiNodeArr.push(paiNode);
                    if (paiNodeArr.length == 13) {
                        this.dealTimeOutID = setTimeout(() => {
                            this.setCardNum(paiNodeArr, valueArr, laiId, leftRemain, rightFace, rightRemain);
                        }, 500)
                    }
                })
                .start();
        }
        // for (let i = 0; i < 13; i++) {
        //     this.dealCallback(i);
        // }
        this.schedule(this.dealCallback, interval, repeat, delay);

    },


    //翻转扑克牌，赋值
    setCardNum: function (array, valueArr, laiId, leftRemain, rightFace, rightRemain) {
        this.turnCard = function (node, spriteFrame) {
            cc.tween(node)
                .tag(7)
                .to(0.07, { scaleX: 0 })
                .call(() => {
                    node && node.getComponent(cc.Sprite)
                        && (node.getComponent(cc.Sprite).spriteFrame = spriteFrame);
                })
                .to(0.07, { scaleX: 1 })
                .start();
        }
        for (let i = 0; i < array.length; i++) {
            let spriteFrame = this.getPaiSpriteFrameByValue(valueArr[i]);
            this.turnCard(array[i], spriteFrame);
        }
        this.paiGroupArr = this.initPaiGroupArr(array);
        this.moveCard(laiId, leftRemain, rightFace, rightRemain);
    },

    //移动至close的位置
    moveCard: function (laiId, leftRemain, rightFace, rightRemain) {
        let img = this.getPaiSpriteFrameByValue(laiId);          //获取癞子牌的图片资源
        cc.tween(this.cardLibNode)
            .tag(8)
            .to(0.5, { position: cc.v2(-195.74, 20) })
            .to(0.1)
            .call(() => {
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
                this.showUniversalCard(img, leftRemain);                   //传入
                this.showOpenAreaCard(rightFace, rightRemain);
                let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr, false, true);

                this.openPaiNode && this.openPaiNode.getComponent(cc.Sprite)
                    && (this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame);

                this.btnAction();

            })
            .start();
    },

    //展示OPEN区域的牌
    showOpenAreaCard: function (rightFace, rightRemain) {
        // GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("selectCard");
        if (rightFace.length == 0) {
            this.openPaiNode.getComponent(cc.Sprite).spriteFrame = null;
            this.openPaiNode.getChildByName("lai").active = false;
        } else {
            let value = rightFace[0].card;
            let openPai = this.getPaiSpriteFrameByValue(value);
            this.openPaiNode.getComponent(cc.Sprite).spriteFrame = openPai;
            let paiNum = this.getPaiNum(value);
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
        this.lab_open.string = "(" + rightRemain + ")";
        this.cardMask.active = false;
        this.openNode.active = true;
    },

    //展示癞子牌
    showUniversalCard: function (img, leftRemain) {
        let countScore = 0;
        this.closeNode.active = true;
        this.cardLibNode.active = false;
        this.lab_close.string = "(" + leftRemain + ")";
        this.cardLibNode.setPosition(1, 20);
        this.laizi_closeNode = this.closeNode.getChildByName("universal_card");
        this.laizi_closeNode.getComponent(cc.Sprite).spriteFrame = img;
        cc.tween(this.laizi_closeNode)
            .tag(9)
            .to(0, { position: cc.v2(0, 0), angle: 0 })
            .to(0.15, { position: cc.v2(-29.407, 0.436), angle: 12 })
            .start();

        for (let i = 0; i < this.paiGroupArr.length; i++) {
            let childArr = this.paiGroupArr[i];
            for (let j = 0; j < childArr.length; j++) {
                let paiNode = childArr[j];
                let src = paiNode.getComponent("paiCtrl");
                let paiValue = src.getPaiValue();
                let paiNum = this.getPaiNum(paiValue);
                src.setIsCanMove(true);
                src.setLaiActive(paiNum == this.laiNumber || paiNum == "d" || paiNum == "x");
            }
        }

    },

    //起牌动作
    fapaiAction: function (notify, isSelf) {
        if (isSelf) {
            if(this.paiGroupArr.length == 0){
                return
            }
            let spriteFrame = this.getPaiSpriteFrameByValue(notify.card);
            let paiNode = this.createPaiNode();
            let src = paiNode.getComponent("paiCtrl");
            let lastPosX = this.getLastPaiPosX();
            let paiNum = this.getPaiNum(notify.card);
            let childArr = this.paiGroupArr[this.paiGroupArr.length - 1];
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
                cc.tween(paiNode)
                    .tag(1)
                    .to(0.3, { scale: 1, position: cc.v2(lastPosX + this.paiDistance, 0) })
                    .call(() => {
                        // 更新组的信息
                        this.setPaiNodeIndex(this.paiGroupArr);

                        src.setIsCanMove(true);
                        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

                        this.openPaiNode && this.openPaiNode.getComponent(cc.Sprite)
                            && (this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame);
                    })
                    .start();

            } else {
                paiNode.scale = 0.8;
                paiNode.parent = this.selfCardNode;
                paiNode.setPosition(195.8, 195);
                cc.tween(paiNode)
                    .tag(1)
                    .to(0.3, { scale: 1, position: cc.v2(lastPosX + this.paiDistance, 0) })
                    .call(() => {
                        // 更新组的信息
                        this.setPaiNodeIndex(this.paiGroupArr);

                        src.setIsCanMove(true);
                        let totalWidth = this.getPaiTotalWidthByPaiGroupArr(this.paiGroupArr);
                        this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, this.paiGroupArr);

                        this.openPaiNode && this.openPaiNode.getComponent(cc.Sprite)
                            && (this.tempOpenSpriteFrame = this.openPaiNode.getComponent(cc.Sprite).spriteFrame);
                    })
                    .start();
            }
        } else {
            let spriteFrame = this.poke_back;
            let paiNode = this.createPaiNode();
            paiNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;

            paiNode.scale = 0.8;

            paiNode.parent = this.node;
            if (notify.side == 0) {
                paiNode.setPosition(-194.2, 22);
                cc.tween(paiNode)
                    .tag(1)
                    .to(0.2, { scale: 0.8, position: cc.v2(0, 250) })
                    .call(() => {
                        setTimeout(() => {
                            this.onCardRemoved(paiNode);
                        }, 500)
                    })
                    .start();
            } else {
                let openSpriteFrame = this.getPaiSpriteFrameByValue(notify.card);
                paiNode.getComponent(cc.Sprite).spriteFrame = openSpriteFrame;
                paiNode.setPosition(195.8, 22);
                cc.tween(paiNode)
                    .to(0, { scale: 0.8, position: cc.v2(195.8, 22) })
                    .to(0.2, { scale: 0.8, position: cc.v2(0, 250) })
                    .call(() => {
                        setTimeout(() => {
                            this.onCardRemoved(paiNode);
                        }, 500)
                    })
                    .start();
            }

        }
        this.lab_open.string = "(" + notify.rightRemain + ")";
        this.lab_close.string = "(" + notify.leftRemain + ")";
        this.showOpenAreaCard(notify.rightFace, notify.rightRemain);

    },

    setPaiNodeIndex: function (paiGroupArr) {
        // 更新组的信息
        let t = 0;
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            if (Array.isArray(paiGroupArr[i])) {
                for (let k = 0, len1 = paiGroupArr[i].length; k < len1; k++) {
                    let paiNode = paiGroupArr[i][k];
                    if (paiNode) {
                        paiNode.setSiblingIndex(this.paiZIndexArr[t]);
                        let src = paiNode.getComponent("paiCtrl");
                        src.setGroupTag(i, k);
                    } else {
                        LoggerUtil.getInstance().error("当前组" + i + "位" + k + "节点不存在");
                    }
                    t++;
                }
            }
        }
    },

    getLastPaiPosX() {
        LoggerUtil.getInstance().log("获取牌组DASdsadas坐标", this.paiGroupArr.length);
        let tempArr = [];
        for (let i = 0, len = this.paiGroupArr.length; i < len; i++) {
            let group = this.paiGroupArr[i];
            if (group) {
                let tempArr1 = [];
                for (let k = 0, len1 = group.length; k < len1; k++) {
                    let node = group[k];
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
        let childArr = this.paiGroupArr[this.paiGroupArr.length - 1];
        LoggerUtil.getInstance().log("获取牌组最后一个组", childArr);
        let lastNode = Array.isArray(childArr) ? childArr[childArr.length - 1] : childArr;
        if (!lastNode) {
            LoggerUtil.getInstance().error("lastNode不存在！");
            return 0;
        }
        return lastNode.x;
    },

    //流局牌型动画
    flowPaiAction(notify) {
        for (let j = 0; j < this.barCount; j++) {
            LoggerUtil.getInstance().log("bar========>:", "bar" + j)
            let node = this.selfCardNode.getChildByName("bar" + j);
            if (node != null) {
                // node.destroy();
                this.selfCardNode && this.selfCardNode.removeChild(node);
            } else {
                break;
            }
        }
        this.barCount = 0;
        for (let i = 0; i < this.paiGroupArr.length; i++) {
            let childArr = this.paiGroupArr[i];
            for (let k = 0; k < childArr.length; k++) {
                let paiNode = childArr[k];
                let originPos = paiNode.getPosition();
                if (paiNode) {
                    let src = paiNode.getComponent("paiCtrl");
                    let paiNum = this.getPaiNum(src.getPaiValue());
                    src.setLaiActive(false);
                    let tempSpriteFrame = paiNode.getComponent(cc.Sprite).spriteFrame;
                    src.setIsCanMove(false);
                    cc.tween(paiNode)
                        .tag(1)
                        .tag(10)
                        .to(0.2, { position: cc.v2(0, 0) })
                        .call(() => {
                            paiNode.getComponent(cc.Sprite).spriteFrame = this.poke_back;
                        })
                        .delay(0.5)
                        .to(0.3, { position: originPos })
                        .delay(0.2)
                        .to(0.1, { scaleX: 0 })
                        .call(() => {
                            paiNode.getComponent(cc.Sprite).spriteFrame = tempSpriteFrame;
                        })
                        .to(0.1, { scaleX: 1 })
                        .call(() => {
                            this.lab_close.string = "(" + notify.leftRemain + ")";
                            this.showOpenAreaCard(notify.rightFace, notify.rightRemain);
                            src.setLaiActive(paiNum == this.laiNumber || paiNum == "d" || paiNum == "x");
                            src.setIsCanMove(true);
                        })
                        .start();
                }

            }

        }
        this.flowPaiCallBack = () => {
            this.lifeBar(this.paiGroupArr);
        }
        this.scheduleOnce(this.flowPaiCallBack, 2);


    },

    // ----------------------------------- 发牌    end----------------------------------------------------

    // ======================================= 牌组 start=========================================================

    // 小组的生命序列是什么
    // 1 同花顺， 2 软顺，  3 AAA或AAAA， 4 错误组，5 无 
    checkGroupLiftBar: function (group) {
        if (group && group.length <= 2) {
            // LoggerUtil.getInstance().log("传入的数组长度小于2");
            return 0;
        }
        let laiZiNum = 0;
        let laiZiArr = [];
        let heiTaoGroup = [];
        let hongXinGroup = [];
        let meiHuaGroup = [];
        let fangKuaiGroup = [];
        let paivalueArr = [];
        for (let i = 0, len = group.length; i < len; i++) {
            let paiNode = group[i];
            if (paiNode) {
                let src = paiNode.getComponent("paiCtrl");
                let paiValue = src.getPaiValue();
                if (paiValue == 52 || paiValue == 53 || this.getPaiNum(paiValue) == this.laiNumber) {       // 癞子牌
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
        };

        let huaSeNum = 0;
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
        }
        // LoggerUtil.getInstance().log("GroupLiftBar花色-=----------------", huaSeNum);
        if (huaSeNum == 0) {
            return 2;
        } else if (huaSeNum == 1) {
            let chaNum = 0;
            let nary = paivalueArr.sort((a, b) => a - b);
            //先判断是不是QKA，
            if(this.getPaiNum(nary[0]) == 0){   //第一张为A
                let exceptA_Arr = nary.slice(1,nary.length);
                if(this.getPaiNum(exceptA_Arr[0]) == 0){       //第二张也为 A
                    return 4
                }else if(exceptA_Arr.length == 1){
                    let cha = this.containA(nary[0],exceptA_Arr[0]);
                    if(cha == 0){   //含有同一张牌
                        return 4
                    }else{
                        chaNum += cha - 1;
                    }
                }else{
                    for (let i = 0; i < exceptA_Arr.length-1; i++) {
                        if(this.getPaiNum(exceptA_Arr[i]) == 0){    
                            return 4
                        }
                        let cha = exceptA_Arr[i + 1] - exceptA_Arr[i];
                        if(cha == 0){   //含有同一张牌
                            return 4
                        }else{
                            chaNum += cha - 1;
                        }
                    }
                    let diff = this.containA(nary[0], exceptA_Arr[0]) >= this.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) ? this.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) : this.containA(nary[0], exceptA_Arr[0]);
                    chaNum += diff - 1;
                }
            }else{
                for (let i = 0, len = nary.length; i < len - 1; i++) {
                    let cha = nary[i + 1] - nary[i];
                    if (cha == 0) {             //含有同一张牌
                        return 4;
                    }else{
                        chaNum += cha - 1;
                    }
                }
            }
            let isSameType = this.isSameType(nary, laiZiArr);     //是不是同一个花色
            let isContinuity = this.isContinuity(nary, laiZiArr);   //是不是连续的
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
            let isRepeat = this.isRepeat(paivalueArr);
            if (isRepeat) {
                return 4;
            } else {
                let paiTotal = 0;
                let paiNumArr = [];
                let nary = paivalueArr.sort((a, b) => {
                    return a - b
                });
                for (let i = 0, len = nary.length; i < len; i++) {
                    let pai = this.getPaiNum(nary[i]);
                    paiNumArr.push(pai);
                    paiTotal += pai;
                }
                paiNumArr.sort((a, b) => a - b);
                if (paiTotal == paiNumArr[0] * nary.length && laiZiNum + nary.length <= 4) {
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
     * @param {Number} indexValue 某一个 index 的值
     * @param {Number} A 牌A的值
     * @returns 两者之间的差值
     */
    containA:function(A, indexValue){
        let cha = 0,diff = indexValue - A;
        switch (diff) {
            case 12:    //最后一张为K
                cha = 1;
                break
            case 11:    //最后一张为Q
                cha = 2;
                break
            case 10:     //最后一张为J
                cha = 3;
                break
            case 9:      //最后一张为10
                cha = 4;
                break
            case 8:      //最后一张为9
                cha = 5;
                break
            case 7:      //最后一张为8
                cha = 6;
                break
            case 6:      //最后一张为7
                cha = 6;
                break
            case 5:      //最后一张为6
                cha = 5;
                break
            case 4:      //最后一张为5
                cha = 4;
                break
            case 3:      //最后一张为4
                cha = 3;
                break
            case 2:      //最后一张为3
                cha = 2;
                break
            case 1:      //最后一张为2
                cha = 1;
                break
            default:
                break;
        }
        return cha
    },

    isRepeat: function (arr) {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i]]) {
                return true;
            }
            hash[arr[i]] = true;
        }
        return false;
    },

    isSameType: function (a = [], b = []) {
        let paiValue = a[0];
        let a_paiType = this.getPaiType(paiValue);
        for (let i = 0, len = b.length; i < len; i++) {
            let value = b[i];
            let b_paiType = this.getPaiType(value);
            if (a_paiType == b_paiType) {
                continue
            } else {
                return false
            }
        }
        return true;

    },

    //是不是连续
    isContinuity: function (a = [], b = []) {
        let c = a.concat(b);
        c = c.sort((a, b) => {
            return a - b
        });
        for (let i = 0, len = c.length; i < len - 1; i++) {
            if (c[i + 1] - c[i] != 1) {
                //第一张牌为 A，最后一张为 K
                if (this.getPaiNum(c[i]) == 0 && this.getPaiNum(c[len - 1]) == 12) {
                    continue
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
    setBar(paiGroup, type, isShowText, parentNode) {
        isShowText = isShowText ? false : true;
        parentNode = parentNode ? parentNode : this.selfCardNode;
        LoggerUtil.getInstance().log("获得的牌组的生命序列type：" + type, "isShowText", isShowText, "parentNode", parentNode);
        if (type == 0) {
            // LoggerUtil.getInstance().log("数组长度小于2，type不存在，跳过，数组为", paiGroup);
            return
        }
        let barNode = this.setBarColor(type, isShowText);
        let barArea = this.setBarArea(paiGroup);
        // LoggerUtil.getInstance().log("底部条的区域===========:", barArea);
        barNode.x = barArea.posX;
        barNode.width = barArea.width;
        barNode.y = -68;
        LoggerUtil.getInstance().log("this.barCount===============>", this.barCount)
        barNode.name = "bar" + this.barCount;
        this.barCount = this.barCount + 1;
        barNode.parent = parentNode;
        // barNode.setSiblingIndex(74);
        barNode.zIndex = 74;
        // LoggerUtil.getInstance().log("当前生命条的index：",barNode.getSiblingIndex());
    },

    setBarArea: function (group) {
        LoggerUtil.getInstance().log("group==================>", group.length)
        let width = 0;
        let posX = 0;
        let posY = 0;
        width = (group.length - 1) * this.paiDistance + group[0].width;
        if (group.length % 2 == 1) {
            let index = Math.floor(group.length / 2);
            posX = group[index].x;
        } else {
            let index1 = Math.floor(group.length / 2) - 1;
            let index2 = Math.floor(group.length / 2);
            posX = (group[index1].x + group[index2].x) / 2
        }
        return { width: width, posX: posX }
    },

    setBarColor: function (type, isShowText) {
        let barNode = cc.instantiate(this.prefab_bar);
        let spriteFrame = null;
        let barCtrl = barNode.getComponent("barCtrl");
        let lab = barNode.getChildByName("lab_life").getComponent(cc.Label);
        // lab.string = ""
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
                lab.node.color = new cc.Color(128, 1, 1);   //红
                if (isShowText == true) {
                    // lab.string = "Not Correct";
                    barCtrl.setBarLabel("Not Correct");
                }
                break;
            case 5:
                spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_yellow');
                barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                lab.node.color = new cc.Color(139, 95, 1);  //黄
                if (isShowText == true) {
                    // lab.string = "1st Life Needed";
                    barCtrl.setBarLabel("1st Life Needed");
                    
                }
                break;
            case 6:
                spriteFrame = this.spriteAtlas_colorBar.getSpriteFrame('bar_yellow');
                barNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                lab.node.color = new cc.Color(139, 95, 1);  //黄
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
                lab.node.color = new cc.Color(128, 1, 1);   //红
                if (isShowText == true) {
                    // lab.string = "Not Correct";
                    barCtrl.setBarLabel("Not Correct");
                }
                break;
        }
        return barNode;
    },

    getGameScore: function (group) {
        let countScore = 0;
        for (let j = 0; j < group.length; j++) {
            let paiNode = group[j];
            if (paiNode) {
                let src = paiNode.getComponent("paiCtrl");
                let paiValue = src.getPaiValue();
                let paiNum = this.getPaiNum(paiValue);
                if (paiNum == this.laiNumber || paiNum == "d" || paiNum == "x") {
                    continue
                } else {
                    // 牌面 10_________J______________Q_______________K_______________A
                    if (paiNum == 9 || paiNum == 10 || paiNum == 11 || paiNum == 12 || paiNum == 0) {
                        countScore += 10;
                        continue
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
            if(playScript) playScript.face(notify);
        }
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = this.getPlayerInfoByUserId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            }else{
                senderCtrl.setCoin(senderAfter);
            }

            if (target == -1) {
                for (let i = 0; i < this.userArryNode.length; i++) {
                    let userNode = this.userArryNode[i];
                    let userInfoCtrl = null;
                    if (userNode.name == 'userNode') {
                        userInfoCtrl = userNode.getComponent('rummyUserInfoCtrl');
                    } 
                    else if (userNode.name == 'otherNode') {
                        userInfoCtrl = userNode.getComponent('rummyOtherUserCtrl');
                    };
        
                    if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
                        targetNodeArr.push(userNode);
                    };
                }
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

    //根据用户ID获取用户控制脚本
    getPlayerInfoByUserId: function (userID) {
        let playerInfo = null;
        let userInfoCtrl = null;
        for (let i = 0; i < this.userArryNode.length; i++) {
            let userNode = this.userArryNode[i];
            if (userNode.name == 'userNode') {
                userInfoCtrl = userNode.getComponent('rummyUserInfoCtrl');
            } else if (userNode.name == 'otherNode') {
                userInfoCtrl = userNode.getComponent('rummyOtherUserCtrl');

            }

            if (userInfoCtrl && userInfoCtrl.seatId === userID) {
                playerInfo = userInfoCtrl;
                break;
            }
        }
        return playerInfo

    },
    // ====================================== 牌组  end ==============================================================

    //控制下半部分的几个按钮的交互  type 分别为 0(点起0张牌) 1(点起 1 张牌) 2(点起超过 2 张牌) default
    controlButton: function (isSelfTurn, isPickOneCard, length) {
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
    putSelfCardToPool:function(){
        let children = this.selfCardNode?.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let item = children[i];
            // LoggerUtil.getInstance().log(`手牌的第${i}个子节点：`,item);
            if(item && item.name == 'pai'){
                this.onCardRemoved(item);
            }else{
                this.selfCardNode.removeChild(item);
            }
        }
    },

    //玩家弃牌
    playdrop: function () {
        if (this.isTuiChu = true && (this.tableStatus == 2 || this.tableStatus == 3 || this.tableStatus == 4)) {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            window.isNeedShowRoomList = "rummy";
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    //改变下半部分的几个按钮Sprite
    changButtonSprite: function (btnComponent, bool, name) {
        btnComponent.interactable = bool;

    },

    //切割 number，第二位 + 后面的N位
    getSliceNum(number) {
        let str = number.toString();
        let arr = str.split("");
        LoggerUtil.getInstance().log("~~~~~~", arr, number);
        let last = arr[2];
        if (arr.length >= 4) {
            last = [arr[2], arr[3]].join('');
        }
        return { groupTag: arr[1], groupIndex: last }
    },

    deepClone: function (obj) {
        let objClone = Array.isArray(obj) ? [] : {};
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

    // 设置记牌器的状态
    setRecorderCard: function (bool) {
        this.btn_cardListShow.node.active = bool;
    },

    // 显示一些界面的东西  
    showLobbyUI: function (str, bool) {
        if (!this.node) { return }
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

    getAbsoluteSelfSeatId: function(notify){
        if(Array.isArray(notify.players) == false) { return }
        for (let i = 0; i < notify.players.length; i++) {
            let player = notify.players[i];
            if(player.user.displayName == GlobalCfg.USER_DATAS.userId){
                this.selfAbsoluteSeatId = player.seat;
                break
            }
        }
    },

    //将绝对的座位ID转换为相对座位ID
    changeAbsoluteSeatIdToRelative: function(changeID) {
        let relativeSeatId = (changeID + 6 - this.selfAbsoluteSeatId) % 6;
        LoggerUtil.getInstance().log(`转换前的绝对坐标：${changeID}转换后的相对坐标：${relativeSeatId}`);
        return relativeSeatId
    },

    //将相对的座位ID转换为绝对座位ID
    changeRelativeSeatIdToAbsolute: function(relativeSeatId){
        let absoluteSeatId = (relativeSeatId + 6 + this.selfAbsoluteSeatId) % 6;
        return absoluteSeatId
    },

    //通过 seat 获取其他玩家节点脚本，错误返回 false
    getOtherNodeCtrlBySeat: function(seat) {
        this.playersNode = this.node.getChildByName("players");
        for (let i = 0,len = this.playersNode.children.length; i < len; i++) {
            let otherUserNode = this.playersNode.children[i];
            let rummyOtherUserCtrl = otherUserNode.getComponent("rummyOtherUserCtrl");
            let otherSeat = rummyOtherUserCtrl.getSeatId();
            if(otherSeat == seat){
                return rummyOtherUserCtrl
            }
        }
        return false
    },

    // ========================================= 向服务器发送请求 START ====================================================================


    // //获取房间列表
    // getRoomListReq: function (type) {
    //     GameServerManager.send("gameservice.queryroomlist", "QueryRoomListReq", {
    //         gameType: type,	    //游戏类型
    //     });
    // },

    //进入房间
    enterRoomReq: function () {
        // let roomid = cc.sys.localStorage.getItem("rummyID");
        LoggerUtil.getInstance().log("进入房间id", GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID)
        GameServerManager.send("gameservice.enterroom", "EnterRoomReq", {
            id: GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID,	    //游戏类型
        });
    },

    //换桌
    changeRoomReq: function () {
        if (!this.isChange) {
            GameServerManager.send("gameservice.changetable", "ChangeTableReq", {});
        } else {
            CommonFun.getInstance().showTips("No changing tables in the game");
        }
    },

    //退出游戏
    exitGame: function () {
        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
    },

    //游戏准备 
    gameReadReq: function (bool) {
        GameServerManager.send("gameservice.ready", "ReadyReq", {
            ready: bool
        });
    },

    //短消息    num: 0短语, 1表情
    shortMsgReq: function (num, str) {
        GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
            msgtype: num,
            msgid: str
        });
    },

    //起牌  
    pickCardReq: function (num) {
        GameServerManager.send("gameservice.pickcard", "PickCardReq", {
            side: num       // 起牌方位 0左1右
        });
    },

    //出牌 
    outCardReq: function (num, groupIndex) {
        this.line.active = false;
        GameServerManager.send("gameservice.outcard", "OutCardReq", {
            card: num,       // 牌
            index: groupIndex   //牌组
        });
    },

    //弃牌 
    dropReq() {
        GameServerManager.send("gameservice.drop", "DropReq", {});
    },

    //选择胡 
    finishReq: function (num, arr) {
        GameServerManager.send("gameservice.choosehu", "ChooseHuReq", {
            outCard: num,       // 牌
            groups: arr
        });
    },

    //最后的摆牌
    TidyFinalCardsReq: function (arr, score) {
        GameServerManager.send("gameservice.tidyfinalcards", "TidyFinalCardsReq", {
            groups: arr,
            score: score
        });
    },

    //主动拉取游戏场景
    RefreshGameSceneReq: function () {
        GameServerManager.send("gameservice.refreshgamescene", "RefreshGameSceneReq", {});
    },

    SetContinueReq: function (settlement) {
        this.settlement = settlement
        if(this.isKicked == true){
            this.enterRoomReq();
        }else{
            GameServerManager.send("gameservice.setcontinue", "SetContinueReq", {});
        }
    },

    // ========================================= 向服务器发送请求 END ====================================================================
    // update (dt) {},
    onDestroy() {
        LoggerUtil.getInstance().log("执行2人场脚本 onDestroy() ");
        if (this.node.getChildByName("pai")) {
            this.node.getChildByName("pai").destroy();
        }
        this.cardPool?.clear();
        cc.Tween.stopAll();
        this.unschedule(this.dealCallback);
        this.unschedule(this.fapaiCallBack1);
        this.unschedule(this.fapaiCallBack2);
        this.unschedule(this.freshNotifyCallback);
        this.unschedule(this.flowPaiCallBack);
        clearTimeout(this.dealTimeOutID);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandleOpen);
        ClientNotify.removeByHandle("PUSHPAYSUCCESS", this.pushpaysuccess);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        GlobalCfg.ACT_SCENE_CTRL = null;
    },

    // 提示
    TipsLab: function (num) {
        if (num) {
            let gameStartTips = this.node.getChildByName("gameStartTips")
            if (gameStartTips) {
                let tishiCtrl = gameStartTips.getComponent("tishiCtrl");
                tishiCtrl.setTishi(this.textArr[num]);
            } else {
                let Tips = cc.instantiate(this.prefab_tishi);
                Tips.name = "gameStartTips"
                let tishiCtrl = Tips.getComponent("tishiCtrl");
                this.node.addChild(Tips)
                tishiCtrl.setTishi(this.textArr[num]);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                let gameStartTips = this.node.getChildByName("gameStartTips")
                if (gameStartTips) { gameStartTips.destroy() }
            }
        }
    },


    // 测试牌的显示
    tsetCrad: function (notify, cradName) {
        
    },

    // 摆牌
    reqMovehandgroup: function (paiNodeArr) {
        let groups = [];
        for (let i = 0; i < paiNodeArr.length; i++) {
            let paiGroup = paiNodeArr[i];
            groups[i] = [];
            for (let k = 0; k < paiGroup.length; k++) {
                let paiNode = paiGroup[k];
                if (!paiNode) {
                    continue;
                }
                let paiValue = paiNode.getComponent("paiCtrl").getPaiValue();
                groups[i][k] = paiValue;
            }
        }
        if (!groups) {
            return;
        }
        let tempGroups = [];
        for (let i = 0, len = groups.length; i < len; i++) {
            let group = groups[i];
            if (!group || group.length <= 0) {
                return;
            }
            tempGroups.push({ cards: group });
        }
        LoggerUtil.getInstance().log("向服务器发送的手牌的数据是：", tempGroups);
        GameServerManager.send("gameservice.movehandgroup", "MoveHandGroupReq", {
            groups: tempGroups
        });
    }
});
