"use strict";
cc._RF.push(module, '26320FP3IFKRptGeOHGkC7h', 'TpGameCtrl');
// tpGame/TpGameCtrl.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ActBtnsCtrl_1 = require("./ActBtns/ActBtnsCtrl");
var TableInfoCtrl_1 = require("./TableInfo/TableInfoCtrl");
var TotalChipsCtrl_1 = require("./TotalChips/TotalChipsCtrl");
var DataDef_1 = require("./DataDef");
var PlayerCtrl_1 = require("./Player/PlayerCtrl");
var HandCardsCtrl_1 = require("./HandCards/HandCardsCtrl");
var CompareCardToastCtrl_1 = require("./CompareCard/CompareCardToastCtrl");
var CompareCardVSCtrl_1 = require("./CompareCard/CompareCardVSCtrl");
var BetInfoCtrl_1 = require("./BetInfo/BetInfoCtrl");
var ChipCtrl_1 = require("./Chip/ChipCtrl");
var CompareCardLineCtrl_1 = require("./CompareCard/CompareCardLineCtrl");
var RechargeToastCtrl_1 = require("./RechargeToast/RechargeToastCtrl");
var HintCtrl_1 = require("./Hint/HintCtrl");
var RoundInfoCtrl_1 = require("./RoundInfo/RoundInfoCtrl");
var OwnRechargeTipCtrl_1 = require("./RechargeToast/OwnRechargeTipCtrl");
var MsgToastCtrl_1 = require("./MsgToast/MsgToastCtrl");
var TableInfoToastCtrl_1 = require("./TableInfo/TableInfoToastCtrl");
var WaitStartTipCtrl_1 = require("./WaitStartTip/WaitStartTipCtrl");
var TpGameAudioCtrl_1 = require("./TpGameAudioCtrl");
var AddCashCtrl_1 = require("./AddCash/AddCashCtrl");
var LuckyPlayerCtrl_1 = require("./LuckyPlayer/LuckyPlayerCtrl");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var TpGameCtrl = /** @class */ (function (_super) {
    __extends(TpGameCtrl, _super);
    function TpGameCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.serverMsgHandle = null;
        _this.clientMsgHandle = null;
        /**
         * 音频控制
         */
        _this.tpGameAudioCtrl = null;
        /**
         * 发牌父节点
         */
        _this.sendCardParent = null;
        /**
         * 筹码父节点
         */
        _this.chipParent = null;
        /**
         * 充值按钮
         */
        _this.btn_recharge = null;
        /**
         * 总下注池位置坐标
         */
        _this.totalChipsPos = cc.v2(0, 150);
        /**
         * 总下注池控制脚本
         */
        _this.totalChipsCtrl = null;
        /**
         * 等待开始提示框的控制脚本
         */
        _this.waitStartTipCtrl = null;
        /**
         * 轮次信息控制脚本
         */
        _this.roundInfoCtrl = null;
        /**
         * 牌桌信息控制脚本
         */
        _this.tableInfoCtrl = null;
        /**
         * 牌桌信息弹框控制脚本
         */
        _this.tableInfoToastCtrl = null;
        /**
         * 自己玩家操作按钮控制脚本
         */
        _this.actBtnsCtrl = null;
        /**
         * 充值弹框的控制脚本
         */
        _this.rechargeToastCtrl = null;
        /**
         * Hint界面的控制脚本
         */
        _this.hintCtrl = null;
        /**
         * 自己充值提示的控制脚本
         */
        _this.ownRechargeTipCtrl = null;
        /**
         * 消息提示框的控制脚本
         */
        _this.msgToastCtrl = null;
        /**
         * 幸运玩家控制脚本
         */
        _this.luckyPlayerCtrl = null;
        /**
         * 充值界面的控制脚本
         */
        _this.addCashCtrl = null;
        /**
         * 比牌弹框的节点
         */
        _this.compareCardToastNode = null;
        /**
         * 比牌连线的节点
         */
        _this.compareCardLineNode = null;
        /**
         * 比牌VS的节点
         */
        _this.compareCardVSNode = null;
        /**
         * 自己玩家的pid
         */
        _this.ownPlayerPid = -1;
        /**
         * 自己玩家的座位号
         */
        _this.ownPlayerSeat = -1;
        /**
         * 玩家位置节点数组
         */
        _this.posNodeArr = [];
        /**
         * 玩家座位号和玩家位置索引映射表
         */
        _this.seatPosNodeIndexMap = new Map();
        /**
         * 预设体映射表
         */
        _this.prefabMap = new Map();
        /**
         * 玩家节点池
         */
        _this.playerNodePool = new cc.NodePool();
        /**
         * 手牌节点池
         */
        _this.handCardsNodePool = new cc.NodePool();
        /**
         * 玩家下注信息节点池
         */
        _this.betInfoNodePool = new cc.NodePool();
        /**
         * 筹码节点池
         */
        _this.chipNodePool = new cc.NodePool();
        /**
         * 发牌节点池
         */
        _this.singleCardPool = new cc.NodePool();
        /**
         * 游戏是否切入到后台
         */
        _this.isGameEventHideStutas = false;
        /**
         * 当前操作玩家的座位号
         */
        _this.curOptPlayerSeat = -1;
        /**
         * 正常状态玩家的数量
         */
        _this.normalPlayerNumber = 0;
        /**
         * 默认的操作时间
         */
        _this.defaultOptTime = 15;
        /**
         * 是否充值状态
         */
        _this.isRechargeStatus = false;
        return _this;
    }
    TpGameCtrl.prototype.onLoad = function () {
        var _this = this;
        this.setPosNodeArr();
        this.setChipParent();
        this.setSendCardParent();
        this.setAudioCtrl();
        this.setPrefabMap()
            .then(function (prefabArr) {
            _this.addTableInfo();
            _this.addActBtns();
            _this.addTotalChips();
            _this.addWaitStartTip();
            _this.addOwnRechargeTip();
            _this.addRechargeToast();
            _this.addHintToast();
            _this.addRoundInfo();
            _this.addMsgToast();
            _this.addTableInfoToast();
            // this.addAddCash();
            _this.addLuckyPlayer();
            _this.initPlayerNodePool();
            _this.initHandCardsNodePool();
            _this.initBetInfoNodePool();
            _this.initChipNodePool();
            _this.initSingleCardPool();
            _this.setOnGameEvent();
        })
            .then(function () {
            //@ts-ignore
            GameServerManager.send("gameservice.login", "LoginReq", {
                //@ts-ignore
                userid: GlobalCfg.USER_DATAS.userId,
                //@ts-ignore
                token: GlobalCfg.USER_DATAS.token,
                //@ts-ignore
                fromid: GlobalCfg.PRODUCT_ID
            });
        });
        //@ts-ignore
        this.serverMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        //@ts-ignore
        this.clientMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        //@ts-ignore
        this.node.getChildByName("btn_back").on("click", CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.node.getChildByName("btn_tableInfo").on("click", CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.node.getChildByName("btn_chat").on("click", CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        CommonFun.getInstance().hideSelectRoom();
        //@ts-ignore
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_TP_GAME);
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.stopMusic();
        //@ts-ignore
        CommonFun.getInstance().hidProgress();
        //@ts-ignore
        GlobalCfg.ACT_SCENE_CTRL = this;
        //@ts-ignore
        cc.sys.localStorage.setItem("ENTERED_TP_GAME_" + GlobalCfg.USER_DATAS.userId, "true");
        this.btn_recharge = this.node.getChildByName("btn_recharge");
        //@ts-ignore
        this.btn_recharge.on("click", CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.btn_recharge.getComponent(cc.Animation).play("drop");
    };
    TpGameCtrl.prototype.onDestroy = function () {
        //@ts-ignore
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.serverMsgHandle);
        //@ts-ignore
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.clientMsgHandle);
        //@ts-ignore
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_TP_GAME);
        //@ts-ignore
        GlobalCfg.ACT_SCENE_CTRL = null;
    };
    /**
     * 设置监听游戏切入后台/前台事件
     */
    TpGameCtrl.prototype.setOnGameEvent = function () {
        var _this = this;
        /**
         * 游戏切入后台事件
         */
        cc.game.on(cc.game.EVENT_HIDE, function () {
            _this.isGameEventHideStutas = true;
            _this.unscheduleAllCallbacks();
            _this.destroyAllSendCard();
            _this.destroyAllChips();
            _this.destroyAllPlayers();
            _this.destroyCompareCardLine();
            _this.destroyCompareCardToast();
            _this.destroyCompareCardVS();
            _this.hintCtrl.setHintActive(false);
            _this.rechargeToastCtrl.setRechargeToastActive(false);
            _this.tableInfoCtrl.setTableInfoNodeActive(false);
            _this.actBtnsCtrl.setActBtnsNodeActive(false);
            _this.totalChipsCtrl.setTotalChipsAmount(0);
            _this.roundInfoCtrl.setRoundInfoRound(0);
            _this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            _this.msgToastCtrl.setMsgToastActive(false);
            _this.tableInfoToastCtrl.setTableInfoToastActive(false);
            _this.setOwnPlayerSeat(-1);
            _this.setCurOptPlayerSeat(-1);
            _this.setNormalPlayerNumber(0);
            _this.waitStartTipCtrl.setWaitStartTipActive(false);
            _this.luckyPlayerCtrl.setLuckyPlayerActive(false);
            _this.btn_recharge.active = false;
        }, this);
        /**
         * 游戏切回前台事件
         */
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if (_this.isGameEventHideStutas === false) {
                return;
            }
            ;
            _this.isGameEventHideStutas = false;
            //@ts-ignore
            GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
        }, this);
    };
    TpGameCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case "btn_back":
                //@ts-ignore
                CommonFun.getInstance().showGameMenu();
                break;
            case "btn_tableInfo":
                this.tableInfoToastCtrl.setTableInfoToastActive(true);
                break;
            case "btn_chat":
                this.dealBtnChatEvent();
                break;
            case "btn_recharge":
                this.dealBtnRechargeEvent();
                break;
            default:
                break;
        }
    };
    TpGameCtrl.prototype.dealBtnChatEvent = function () {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == -1) {
            //@ts-ignore
            CommonFun.getInstance().showTips("not in table");
            return;
        }
        ;
        //@ts-ignore
        CommonFun.getInstance().showGameWordInteraction(ownPlayerSeat);
    };
    TpGameCtrl.prototype.dealBtnRechargeEvent = function () {
        //@ts-ignore
        CommonFun.getInstance().showBankruptcy(true, true);
    };
    /**
     * 实例化玩家节点对象池
     */
    TpGameCtrl.prototype.initPlayerNodePool = function () {
        var playerPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.PLAYER);
        for (var i = 0; i < 5; i++) {
            var playerNode = cc.instantiate(playerPrefab);
            this.playerNodePool.put(playerNode);
        }
        ;
    };
    /**
     * 从玩家节点对象池中获取玩家节点
     * @returns 玩家节点
     */
    TpGameCtrl.prototype.getPlayerNodeFromPool = function () {
        var playerNode = null;
        if (this.playerNodePool.size() > 0) {
            playerNode = this.playerNodePool.get();
        }
        else {
            var playerPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.PLAYER);
            playerNode = cc.instantiate(playerPrefab);
        }
        ;
        playerNode.getComponent(PlayerCtrl_1.default).initPlayer();
        return playerNode;
    };
    /**
     * 将玩家节点回收到玩家节点对象池中
     * @param playerNode 玩家节点
     */
    TpGameCtrl.prototype.putPlayerNodePool = function (playerNode) {
        playerNode.getComponent(PlayerCtrl_1.default).initPlayer();
        this.playerNodePool.put(playerNode);
    };
    /**
     * 初始化手牌节点对象池
     */
    TpGameCtrl.prototype.initHandCardsNodePool = function () {
        var handCardsPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.HANDCARDS);
        for (var i = 0; i < 5; i++) {
            var handCardsNode = cc.instantiate(handCardsPrefab);
            this.handCardsNodePool.put(handCardsNode);
        }
        ;
    };
    /**
     * 从手牌节点对象池中获取手牌节点
     * @returns 手牌节点
     */
    TpGameCtrl.prototype.getHandCardsNodeFromPool = function () {
        var handCardsNode = null;
        if (this.handCardsNodePool.size() > 0) {
            handCardsNode = this.handCardsNodePool.get();
        }
        else {
            var handCardsPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.HANDCARDS);
            handCardsNode = cc.instantiate(handCardsPrefab);
        }
        ;
        handCardsNode.getComponent(HandCardsCtrl_1.default).initHandCards();
        return handCardsNode;
    };
    /**
     * 将手牌节点回收到手牌节点对象池中
     * @param handCardsNode 手牌节点
     */
    TpGameCtrl.prototype.putHandCardsNodePool = function (handCardsNode) {
        this.handCardsNodePool.put(handCardsNode);
    };
    /**
     * 初始化下注信息节点对象池
     */
    TpGameCtrl.prototype.initBetInfoNodePool = function () {
        var betInfoPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.BETINFO);
        for (var i = 0; i < 5; i++) {
            var betInfoNode = cc.instantiate(betInfoPrefab);
            this.betInfoNodePool.put(betInfoNode);
        }
        ;
    };
    /**
     * 从下注信息节点对象池中获取下注信息节点
     * @returns 下注信息节点
     */
    TpGameCtrl.prototype.getBetInfoNodeFromPool = function () {
        var betInfoNode = null;
        if (this.betInfoNodePool.size() > 0) {
            betInfoNode = this.betInfoNodePool.get();
        }
        else {
            var betInfoPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.BETINFO);
            betInfoNode = cc.instantiate(betInfoPrefab);
        }
        ;
        betInfoNode.getComponent(BetInfoCtrl_1.default).initBetInfo();
        return betInfoNode;
    };
    /**
     * 将下注信息节点回收到下注信息节点对象池中
     * @param betInfoNode 下注信息节点
     */
    TpGameCtrl.prototype.putBetInfoNodePool = function (betInfoNode) {
        this.betInfoNodePool.put(betInfoNode);
    };
    /**
     * 初始化筹码节点对象池
     */
    TpGameCtrl.prototype.initChipNodePool = function () {
        var chipPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.CHIP);
        for (var i = 0; i < 25; i++) {
            var chipNode = cc.instantiate(chipPrefab);
            this.chipNodePool.put(chipNode);
        }
        ;
    };
    /**
     * 从筹码节点对象池中获取筹码节点
     * @returns 获取筹码节点
     */
    TpGameCtrl.prototype.getChipNodeFromPool = function () {
        var chipNode = null;
        if (this.chipNodePool.size() > 0) {
            chipNode = this.chipNodePool.get();
        }
        else {
            var chipPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.CHIP);
            chipNode = cc.instantiate(chipPrefab);
        }
        ;
        return chipNode;
    };
    /**
     * 获取筹码节点坐标
     * @returns 筹码节点坐标
     */
    TpGameCtrl.prototype.getChipNodePosition = function () {
        var posX = 0;
        var posY = 50;
        var randomX = Math.random() * (360) - 180;
        var randomY = Math.random() * (100) - 50;
        return cc.v3(posX + randomX, posY + randomY);
    };
    /**
     * 将筹码节点回收到筹码节点对象池中
     * @param chipNode 筹码节点
     */
    TpGameCtrl.prototype.putChipNodePool = function (chipNode) {
        this.chipNodePool.put(chipNode);
    };
    TpGameCtrl.prototype.initSingleCardPool = function () {
        var singleCardPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.SINGLECARD);
        for (var i = 0; i < 15; i++) {
            var singleCardNode = cc.instantiate(singleCardPrefab);
            this.singleCardPool.put(singleCardNode);
        }
        ;
    };
    /**
     * 获取单张牌节点
     * @returns 单张牌节点
     */
    TpGameCtrl.prototype.getSingleCardNodeFromPool = function () {
        var singleCardNode = null;
        if (this.singleCardPool.size() > 0) {
            singleCardNode = this.singleCardPool.get();
        }
        else {
            var singleCardPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.SINGLECARD);
            singleCardNode = cc.instantiate(singleCardPrefab);
        }
        ;
        return singleCardNode;
    };
    /**
     * 将单张牌节点回收到单张牌节点对象池中
     * @param singleCardNode 单张牌节点
     */
    TpGameCtrl.prototype.putSingleCardNodePool = function (singleCardNode) {
        this.singleCardPool.put(singleCardNode);
    };
    TpGameCtrl.prototype.setPrefabMap = function () {
        var _this = this;
        var prefabPathArr = [
            DataDef_1.EnumPrefabPath.TABLEINFO,
            DataDef_1.EnumPrefabPath.TABLEINFOTOAST,
            DataDef_1.EnumPrefabPath.ACTBTNS,
            DataDef_1.EnumPrefabPath.TOTALCHIPS,
            DataDef_1.EnumPrefabPath.PLAYER,
            DataDef_1.EnumPrefabPath.HANDCARDS,
            DataDef_1.EnumPrefabPath.COMPARECARDTOAST,
            DataDef_1.EnumPrefabPath.COMPARECARDVS,
            DataDef_1.EnumPrefabPath.COMPARECARDLINE,
            DataDef_1.EnumPrefabPath.BETINFO,
            DataDef_1.EnumPrefabPath.CHIP,
            DataDef_1.EnumPrefabPath.RECHARGETOAST,
            DataDef_1.EnumPrefabPath.OWNRECHARGETIP,
            DataDef_1.EnumPrefabPath.HINT,
            DataDef_1.EnumPrefabPath.ROUNDLINFO,
            DataDef_1.EnumPrefabPath.MSGTOAST,
            DataDef_1.EnumPrefabPath.WAITSTARTTIP,
            DataDef_1.EnumPrefabPath.SINGLECARD,
            DataDef_1.EnumPrefabPath.ADDCASH,
            DataDef_1.EnumPrefabPath.LUCKYPLAYER,
        ];
        var promiseArr = [];
        for (var i = 0, len = prefabPathArr.length; i < len; i++) {
            var prefabPath = prefabPathArr[i];
            var loadPrefabPromise = this.loadPrefabByPromise(prefabPath);
            promiseArr.push(loadPrefabPromise);
        }
        ;
        return Promise.all(promiseArr)
            .then(function (prefabArr) {
            for (var i = 0, len = prefabPathArr.length; i < len; i++) {
                var prefabPath = prefabPathArr[i];
                _this.prefabMap.set(prefabPath, prefabArr[i]);
            }
            ;
            return prefabArr;
        });
    };
    /**
     * 根据路径获取预置体对象。
     *
     * 该函数通过给定的路径从预置映射中检索预置对象。如果路径存在于映射中，
     * 则返回对应的预置对象；如果路径不存在，则返回null。
     *
     * @param path 使用EnumPrefabPath枚举类型的路径参数，指定要获取的预置对象的路径。
     * @returns 返回从给定路径获取到的预置对象，如果路径不存在则返回null。
     */
    TpGameCtrl.prototype.getPrefabByPath = function (path) {
        if (!this.prefabMap.has(path)) {
            return null;
        }
        ;
        return this.prefabMap.get(path);
    };
    /**
     * 根据玩家动作掩码获取可以操作的动作码数组。
     * 0空，1看牌，2跟注，4加注，8比牌，16弃牌，32同意比牌。
     * @param actMask 玩家动作掩码
     * @returns 返回可以操作的动作码数组
     */
    TpGameCtrl.prototype.getCanActValueArrByActMask = function (actMask) {
        var havedActionArr = [];
        var actionArr = [1, 2, 4, 8, 16, 32];
        for (var i = 0, len = actionArr.length; i < len; i++) {
            var tempAct = actionArr[i];
            var canAction = actMask & tempAct;
            if (actionArr.indexOf(canAction) != -1 && havedActionArr.indexOf(canAction) == -1) {
                havedActionArr.push(canAction);
            }
            ;
        }
        ;
        return havedActionArr;
    };
    TpGameCtrl.prototype.setChipParent = function () {
        this.chipParent = this.node.getChildByName("ChipParent");
    };
    /**
     * 获取筹码父节点
     * @returns 筹码父节点
     */
    TpGameCtrl.prototype.getChipParent = function () {
        return this.chipParent;
    };
    TpGameCtrl.prototype.setSendCardParent = function () {
        this.sendCardParent = this.node.getChildByName("SendCardParent");
    };
    TpGameCtrl.prototype.setAudioCtrl = function () {
        this.tpGameAudioCtrl = this.node.getComponent(TpGameAudioCtrl_1.default);
    };
    /**
     * 获取发牌父节点
     * @returns 发牌父节点
     */
    TpGameCtrl.prototype.getSendCardParent = function () {
        return this.sendCardParent;
    };
    /**
     * 设置玩家位置节点数组
     */
    TpGameCtrl.prototype.setPosNodeArr = function () {
        for (var i = 0; i < 5; i++) {
            var posNode = this.node.getChildByName("Pos" + i);
            this.posNodeArr.push(posNode);
        }
        ;
    };
    /**
     * 通过位置索引获取位置节点
     * @param index 位置节点的索引
     * @returns 返回对应的位置节点
     */
    TpGameCtrl.prototype.getPosNodeByIndex = function (index) {
        return this.posNodeArr[index];
    };
    /**
     * 添加玩家节点到对应的位置节点上
     * @param index 位置索引
     * @returns 返回对应的玩家节点
     */
    TpGameCtrl.prototype.addPlayerNodeByPosIndex = function (index) {
        this.destroyPlayerNodeByPosIndex(index);
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var playerParent = posNode.getChildByName("PlayerParent");
            var playerNode = this.getPlayerNodeFromPool();
            playerNode.name = "Player";
            playerParent.addChild(playerNode);
            return playerNode;
        }
        ;
        return null;
    };
    /**
     * 获取对应位置索引的玩家节点
     * @param index 位置索引
     * @returns 返回对应的玩家节点
     */
    TpGameCtrl.prototype.getPlayerNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var playerParent = posNode.getChildByName("PlayerParent");
            var playerNode = playerParent.getChildByName("Player");
            return playerNode;
        }
        ;
        return null;
    };
    /**
     * 删除对应的位置节点上的玩家节点
     * @param index 位置索引
     */
    TpGameCtrl.prototype.destroyPlayerNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var playerParent = posNode.getChildByName("PlayerParent");
            var playerNode = playerParent.getChildByName("Player");
            if (playerNode) {
                this.putPlayerNodePool(playerNode);
            }
            ;
        }
        ;
    };
    /**
     * 添加手牌节点到对应的位置节点上
     * @param index 位置索引
     * @returns 返回对应的手牌节点
     */
    TpGameCtrl.prototype.addHandCardsNodeByPosIndex = function (index) {
        this.destroyHandCardsNodeByPosIndex(index);
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var handCardsParent = posNode.getChildByName("HandCardsParent");
            var handCardsNode = this.getHandCardsNodeFromPool();
            handCardsNode.name = "HandCards";
            handCardsParent.addChild(handCardsNode);
            return handCardsNode;
        }
        ;
        return null;
    };
    /**
     * 获取对应位置索引的手牌节点
     * @param index 位置索引
     * @returns 返回对应的手牌节点
     */
    TpGameCtrl.prototype.getHandCardsNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var handCardsParent = posNode.getChildByName("HandCardsParent");
            var HandCardsNode = handCardsParent.getChildByName("HandCards");
            return HandCardsNode;
        }
        ;
        return null;
    };
    /**
     * 删除对应的位置节点上的手牌节点
     * @param index 位置索引
     */
    TpGameCtrl.prototype.destroyHandCardsNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var handCardsParent = posNode.getChildByName("HandCardsParent");
            var handCardsNode = handCardsParent.getChildByName("HandCards");
            if (handCardsNode) {
                this.putHandCardsNodePool(handCardsNode);
            }
            ;
        }
        ;
    };
    /**
     * 根据位置索引添加赌注信息节点。
     * 首先尝试销毁该位置上已存在的赌注信息节点，然后根据索引获取位置节点。
     * 如果找到位置节点，会在其下创建一个新的赌注信息节点，并返回该新节点。
     *
     * @param index 位置索引，用于标识要添加赌注信息节点的具体位置。
     * @return 返回新创建的赌注信息节点，如果未成功创建则返回null。
     */
    TpGameCtrl.prototype.addBetInfoNodeByPosIndex = function (index) {
        this.destroyBetInfoNodeByPosIndex(index);
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var betInfoParent = posNode.getChildByName("BetInfoParent");
            var betInfoNode = this.getBetInfoNodeFromPool();
            betInfoNode.name = "BetInfo";
            betInfoParent.addChild(betInfoNode);
            return betInfoNode;
        }
        ;
        return null;
    };
    /**
     * 根据位置索引获取投注信息节点。
     * @param index 位置索引，用于定位到具体的投注信息。
     * @returns 返回找到的投注信息节点，如果未找到则返回null。
     */
    TpGameCtrl.prototype.getBetInfoNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var betInfoParent = posNode.getChildByName("BetInfoParent");
            var betInfoNode = betInfoParent.getChildByName("BetInfo");
            return betInfoNode;
        }
        ;
        return null;
    };
    /**
     * 根据位置索引销毁投注信息节点。
     * 该方法寻找指定索引位置的节点，并销毁该位置上投注信息父节点的所有子节点。
     * @param index 位置索引
     */
    TpGameCtrl.prototype.destroyBetInfoNodeByPosIndex = function (index) {
        var posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            var betInfoParent = posNode.getChildByName("BetInfoParent");
            var betInfoNode = betInfoParent.getChildByName("BetInfo");
            if (betInfoNode) {
                this.putBetInfoNodePool(betInfoNode);
            }
            ;
        }
        ;
    };
    /**
     * 添加牌桌信息到当前节点。
     */
    TpGameCtrl.prototype.addTableInfo = function () {
        var tableInfoPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.TABLEINFO);
        var tableInfoNode = cc.instantiate(tableInfoPrefab);
        this.node.addChild(tableInfoNode);
        this.tableInfoCtrl = tableInfoNode.getComponent(TableInfoCtrl_1.TableInfoCtrl);
        this.tableInfoCtrl.initTpGameCtrl(this);
    };
    /**
     * 添加自己玩家动作按钮到当前节点。
     */
    TpGameCtrl.prototype.addActBtns = function () {
        var actBtnsPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.ACTBTNS);
        var actBtnsNode = cc.instantiate(actBtnsPrefab);
        this.node.addChild(actBtnsNode);
        this.actBtnsCtrl = actBtnsNode.getComponent(ActBtnsCtrl_1.ActBtnsCtrl);
        this.actBtnsCtrl.initActBtns(this);
        this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
    };
    /**
     * 添加总计筹码组件到当前节点
     */
    TpGameCtrl.prototype.addTotalChips = function () {
        var totalChipsPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.TOTALCHIPS);
        var totalChipsNode = cc.instantiate(totalChipsPrefab);
        totalChipsNode.setPosition(this.totalChipsPos);
        this.node.addChild(totalChipsNode);
        this.totalChipsCtrl = totalChipsNode.getComponent(TotalChipsCtrl_1.TotalChipsCtrl);
        this.totalChipsCtrl.setTotalChipsAmount(0);
    };
    /**
     * 添加等待开始提示框组件到当前节点
     */
    TpGameCtrl.prototype.addWaitStartTip = function () {
        var waitStartTipPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.WAITSTARTTIP);
        var waitStartTipNode = cc.instantiate(waitStartTipPrefab);
        this.node.addChild(waitStartTipNode);
        this.waitStartTipCtrl = waitStartTipNode.getComponent(WaitStartTipCtrl_1.default);
        this.waitStartTipCtrl.setWaitStartTipActive(false);
    };
    /**
     * 添加充值提示框组件到当前节点
     */
    TpGameCtrl.prototype.addRechargeToast = function () {
        var rechargeToastPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.RECHARGETOAST);
        var rechargeToastNode = cc.instantiate(rechargeToastPrefab);
        this.node.addChild(rechargeToastNode);
        this.rechargeToastCtrl = rechargeToastNode.getComponent(RechargeToastCtrl_1.default);
        this.rechargeToastCtrl.setRechargeToastActive(false);
    };
    /**
     * 添加Hint提示框组件到当前节点
     */
    TpGameCtrl.prototype.addHintToast = function () {
        var hintToastPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.HINT);
        var hintToastNode = cc.instantiate(hintToastPrefab);
        this.node.addChild(hintToastNode);
        this.hintCtrl = hintToastNode.getComponent(HintCtrl_1.default);
        this.hintCtrl.setHintActive(false);
    };
    /**
     * 添加轮次信息组件到当前节点
     */
    TpGameCtrl.prototype.addRoundInfo = function () {
        var roundInfoPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.ROUNDLINFO);
        var roundInfoNode = cc.instantiate(roundInfoPrefab);
        this.node.addChild(roundInfoNode);
        this.roundInfoCtrl = roundInfoNode.getComponent(RoundInfoCtrl_1.default);
        this.roundInfoCtrl.setRoundInfoRound(0);
    };
    /**
     * 添加自己充值提示框组件到当前节点
     */
    TpGameCtrl.prototype.addOwnRechargeTip = function () {
        var ownRechargeTipPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.OWNRECHARGETIP);
        var ownRechargeTipNode = cc.instantiate(ownRechargeTipPrefab);
        this.node.addChild(ownRechargeTipNode);
        this.ownRechargeTipCtrl = ownRechargeTipNode.getComponent(OwnRechargeTipCtrl_1.default);
        this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
    };
    /**
     * 添加消息提示框组件到当前节点
     */
    TpGameCtrl.prototype.addMsgToast = function () {
        var msgToastPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.MSGTOAST);
        var msgToastNode = cc.instantiate(msgToastPrefab);
        this.node.addChild(msgToastNode);
        this.msgToastCtrl = msgToastNode.getComponent(MsgToastCtrl_1.default);
        this.msgToastCtrl.setMsgToastActive(false);
    };
    /**
     * 添加牌桌信息提示框组件到当前节点
     */
    TpGameCtrl.prototype.addTableInfoToast = function () {
        var tableInfoToastPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.TABLEINFOTOAST);
        var tableInfoToastNode = cc.instantiate(tableInfoToastPrefab);
        this.node.addChild(tableInfoToastNode);
        this.tableInfoToastCtrl = tableInfoToastNode.getComponent(TableInfoToastCtrl_1.default);
        this.tableInfoToastCtrl.setTableInfoToastActive(false);
    };
    TpGameCtrl.prototype.addAddCash = function () {
        var addCashPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.ADDCASH);
        var addCashNode = cc.instantiate(addCashPrefab);
        this.node.addChild(addCashNode);
        this.addCashCtrl = addCashNode.getComponent(AddCashCtrl_1.default);
        this.addCashCtrl.setAddCashStyle(DataDef_1.EnumAddCashType.NONE, null);
    };
    TpGameCtrl.prototype.addLuckyPlayer = function () {
        var luckyPlayerPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.LUCKYPLAYER);
        var luckyPlayerNode = cc.instantiate(luckyPlayerPrefab);
        this.node.addChild(luckyPlayerNode);
        this.luckyPlayerCtrl = luckyPlayerNode.getComponent(LuckyPlayerCtrl_1.default);
        this.luckyPlayerCtrl.setLuckyPlayerActive(false);
    };
    /**
     * 显示比牌提示框
     * @param playersInfo 比牌相关的玩家信息
     */
    TpGameCtrl.prototype.showCompareCardToast = function (playersInfo) {
        this.destroyCompareCardToast();
        var compareCardToastPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.COMPARECARDTOAST);
        this.compareCardToastNode = cc.instantiate(compareCardToastPrefab);
        this.node.addChild(this.compareCardToastNode);
        var compareCardToastCtrl = this.compareCardToastNode.getComponent(CompareCardToastCtrl_1.default);
        compareCardToastCtrl.setCompareCardToastTime(this.defaultOptTime);
        compareCardToastCtrl.setCompareCardToastPlayersInfo(playersInfo);
    };
    /**
     * 销毁比牌提示框
     */
    TpGameCtrl.prototype.destroyCompareCardToast = function () {
        if (this.compareCardToastNode) {
            this.compareCardToastNode.destroy();
            this.compareCardToastNode = null;
        }
        ;
    };
    /**
     * 显示比牌VS动画
     */
    TpGameCtrl.prototype.showCompareCardVS = function () {
        this.destroyCompareCardVS();
        var compareCardVSPrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.COMPARECARDVS);
        this.compareCardVSNode = cc.instantiate(compareCardVSPrefab);
        this.node.addChild(this.compareCardVSNode);
        var compareCardVSCtrl = this.compareCardVSNode.getComponent(CompareCardVSCtrl_1.default);
        compareCardVSCtrl.setCompareCardVSAnim();
    };
    /**
     * 销毁比牌VS动画
     */
    TpGameCtrl.prototype.destroyCompareCardVS = function () {
        if (this.compareCardVSNode) {
            this.compareCardVSNode.destroy();
            this.compareCardVSNode = null;
        }
        ;
    };
    /**
     * 显示发起比牌的连线动画
     * @param launch 发起比牌玩家的座位号
     * @param target 待接受比牌玩家的座位号
     */
    TpGameCtrl.prototype.showCompareCardLine = function (launch, target) {
        var launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        var targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
        var launchPosNode = this.getPosNodeByIndex(launchPosNodeIndex);
        var targetPosNode = this.getPosNodeByIndex(targetPosNodeIndex);
        var launchPosNodeWorldPos = launchPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(launchPosNode.x, launchPosNode.y));
        var targetPosNodeWorldPos = targetPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(targetPosNode.x, targetPosNode.y));
        var launchConvert = this.node.convertToNodeSpaceAR(launchPosNodeWorldPos);
        var targetConvert = this.node.convertToNodeSpaceAR(targetPosNodeWorldPos);
        var temp = launchConvert.sub(targetConvert);
        var dis = Math.abs(temp.mag());
        var midPointPos = cc.v3((launchConvert.x + targetConvert.x) / 2, (launchConvert.y + targetConvert.y) / 2);
        var angle = this.getLiangPosAngle(launchConvert, targetConvert);
        this.destroyCompareCardLine();
        var compareCardLinePrefab = this.getPrefabByPath(DataDef_1.EnumPrefabPath.COMPARECARDLINE);
        this.compareCardLineNode = cc.instantiate(compareCardLinePrefab);
        this.node.addChild(this.compareCardLineNode);
        var compareCardLineCtrl = this.compareCardLineNode.getComponent(CompareCardLineCtrl_1.default);
        compareCardLineCtrl.setCompareCardLinePosition(midPointPos);
        compareCardLineCtrl.setCompareCardLineRotation(angle);
        compareCardLineCtrl.setCompareCardLinDistance(dis);
        compareCardLineCtrl.setCompareCardLineAnim();
    };
    TpGameCtrl.prototype.getLiangPosAngle = function (start, end) {
        //计算出朝向
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var dir = cc.v3(dx, dy);
        //根据朝向计算出夹角弧度
        var angle = dir.signAngle(cc.v2(1, 0));
        //将弧度转换为欧拉角
        var degree = angle / Math.PI * 180;
        return -degree;
    };
    TpGameCtrl.prototype.destroyCompareCardLine = function () {
        if (this.compareCardLineNode) {
            this.compareCardLineNode.destroy();
            this.compareCardLineNode = null;
        }
        ;
    };
    /**
     * 获取预制体对象
     * @param prefabPath 预制体路径
     * @returns 返回对应的预制体对象
     */
    TpGameCtrl.prototype.loadPrefabByPromise = function (prefabPath) {
        return new Promise(function (resolve, reject) {
            var bundleName = "tpGame";
            var assetBundle = cc.assetManager.getBundle(bundleName);
            if (assetBundle) {
                assetBundle.load(prefabPath, cc.Prefab, function (err, prefab) {
                    if (!err) {
                        resolve(prefab);
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
            else {
                cc.assetManager.loadBundle("" + bundleName, function (err, bundle) {
                    if (!err) {
                        bundle.load(prefabPath, cc.Prefab, function (err, prefab) {
                            if (!err) {
                                resolve(prefab);
                            }
                            else {
                                reject(err);
                            }
                            ;
                        });
                    }
                    else {
                        reject(err);
                    }
                    ;
                });
            }
            ;
        });
    };
    TpGameCtrl.prototype.onEventMsg = function (webData, target) {
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        /**
         * 如果当前是切入到后台状态，则不处理消息
         */
        // if (this.isGameEventHideStutas) {
        //     return;
        // };
        switch (msgId) {
            case "gameservice.login":
                this.dealLoginMsg(notify);
                break;
            case "gameservice.exitgame":
                this.dealExitGameMsg(notify);
                break;
            case "gameservice.enterlv":
                this.dealEnterTableMsg(notify);
                break;
            case "gameservice.gamescene":
                this.dealGameSceneMsg(notify);
                break;
            case "gameservice.gamestartnotify":
                this.dealGameStartNotifyMsg(notify);
                break;
            case "gameservice.askchipnotify":
                this.dealAskChipNotifyMsg(notify);
                break;
            case "gameservice.playerchipnotify":
                this.dealPlayerChipNotifyMsg(notify);
                break;
            case "gameservice.playerdropnotify":
                this.dealPlayerDropNotifyMsg(notify);
                break;
            case "gameservice.playerlooknotify":
                this.dealPlayerLookNotifyMsg(notify);
                break;
            case "gameservice.playerluanchcomparenotify":
                this.dealPlayerLuanchCompareNotifyMsg(notify);
                break;
            case "gameservice.playeranswercomparenotify":
                this.dealPlayerAnswerCompareNotifyMsg(notify);
                break;
            case "gameservice.gameovernotify":
                this.dealGameOverNotifyMsg(notify);
                break;
            case "gameservice.destroyandmatchingnotify":
                this.dealDestroyAndMatchingNotifyMsg(notify);
                break;
            case "gameservice.playerleavenotify":
                this.dealPlayerLeaveNotifyMsg(notify);
                break;
            case "gameservice.playerjoinnotify":
                this.dealPlayerJoinNotifyMsg(notify);
                break;
            case "gameservice.playerofflinenotify":
                this.dealPlayerOfflineNotifyMsg(notify);
                break;
            case "gameservice.changeroom":
                this.dealChangeRoomMsg(notify);
                break;
            case "gameservice.preparepaymentnotify":
                this.dealPreparePaymentNotifyMsg(notify);
                break;
            case "gameservice.paymentfinishnotify":
                this.dealPaymentFinishNotifyMsg(notify);
                break;
            case "gameservice.shortmessagenotify":
                this.dealShortMessageNotifyMsg(notify);
                break;
            case "gameservice.updatecoinnotify":
                this.dealUpdateCoinNotifyMsg(notify);
                break;
            case "lobbyservice.kicktolobby":
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
                break;
            //@ts-ignore
            case GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY:
                this.dealMenuClickOutToLobbyMsg(notify);
                break;
            //@ts-ignore
            case GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE:
                this.dealMenuClickSwitchTableMsg(notify);
                break;
            //@ts-ignore
            case GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY:
                this.dealMenuClickHowToPlayMsg(notify);
                break;
            //@ts-ignore
            case GlobalCfg.CLIENT_MSG_ID.TPGAME_CLICK_LUCKYPLAYER_GET:
                this.dealLuckyPlayerClickGetMsg(notify);
                break;
            //@ts-ignore
            case GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS:
                if (this.isRechargeStatus == false) {
                    //@ts-ignore
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
                }
                else {
                    this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
                    this.btn_recharge.active = false;
                    this.isRechargeStatus = false;
                    this.refreshOwnDiamond();
                    //@ts-ignore
                    var global = GlobalCfg;
                    if (global.FIRST_RECHARGE_REWARD_SHOW == true) { //首次充值奖励 直接显示奖励弹窗
                        var coin = global.USER_DATAS.lastRecharged / 100; //本次充值获得的金币
                        var getBouns = global.USER_DATAS.firstGetBonus / 100; //本次充值获得的代金券
                        global.FIRST_RECHARGE_REWARD_SHOW = false;
                        if (getBouns > 0) {
                            //@ts-ignore
                            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: coin }, { id: 12, amount: getBouns }]);
                        }
                        else {
                            //@ts-ignore
                            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: coin }]);
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    // 监听错误消息
    TpGameCtrl.prototype.checkWebMsgError = function (webData, target) {
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (!notify) {
            var info = {
                errorMessage: "TP\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
            };
            //@ts-ignore
            CommonFun.getInstance().reportToTelegram(info);
            return;
        }
        ;
        var result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        }
        ;
        if (msgId === "gameservice.changeroom") {
            var matching = notify.matching;
            if (matching) {
                return;
            }
            ;
            this.waitStartTipCtrl.setWaitStartTipActive(false);
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(DataDef_1.EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(function () {
                //@ts-ignore
                window.isNeedShowRummyList = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId == "gameservice.login") {
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(DataDef_1.EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(function () {
                //@ts-ignore
                window.isNeedShowRummyList = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId == "gameservice.enterlv") {
            var matching = notify.matching;
            if (matching) {
                return;
            }
            ;
            var roomId_1 = notify.forceJump;
            var content = "The gold coins you carry do not meet the event requirements, please enter another event!";
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(DataDef_1.EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(function () {
                //@ts-ignore
                GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
                    id: roomId_1
                });
            });
        }
        else if (msgId == "gameservice.receivefreetrial") {
            //@ts-ignore
            CommonFun.getInstance().showTips(result.message);
        }
        else if (msgId == "gameservice.chip") {
            //@ts-ignore
            CommonFun.getInstance().showTips(result.message);
        }
        else if (msgId == "gameservice.gamescene") {
            var inQueue = notify.inQueue;
            if (inQueue) {
                return;
            }
            ;
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(DataDef_1.EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(function () {
                //@ts-ignore
                window.isNeedShowRummyList = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId == "gameservice.shortmessage") {
            //@ts-ignore
            CommonFun.getInstance().showTips(result.message);
        }
        else if (msgId == "gameservice.receivefreetrial") {
            //@ts-ignore
            CommonFun.getInstance().showTips(result.message);
        }
    };
    TpGameCtrl.prototype.dealLoginMsg = function (notify) {
        /**
         * 防止服务重启后，ui表现错误，需要重新初始化
         */
        this.unscheduleAllCallbacks();
        this.destroyAllSendCard();
        this.destroyAllChips();
        this.destroyAllPlayers();
        this.destroyCompareCardLine();
        this.destroyCompareCardToast();
        this.destroyCompareCardVS();
        if (!this.hintCtrl) {
            return;
        }
        ;
        this.hintCtrl.setHintActive(false);
        this.rechargeToastCtrl.setRechargeToastActive(false);
        this.tableInfoCtrl.setTableInfoNodeActive(false);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
        this.totalChipsCtrl.setTotalChipsAmount(0);
        this.roundInfoCtrl.setRoundInfoRound(0);
        this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
        this.msgToastCtrl.setMsgToastActive(false);
        this.tableInfoToastCtrl.setTableInfoToastActive(false);
        this.setOwnPlayerSeat(-1);
        this.setCurOptPlayerSeat(-1);
        this.setNormalPlayerNumber(0);
        this.waitStartTipCtrl.setWaitStartTipActive(false);
        this.luckyPlayerCtrl.setLuckyPlayerActive(false);
        this.btn_recharge.active = false;
        var pid = notify.pid;
        var diamond = notify.diamond;
        var totalPay = notify.totalPay;
        /**
         * roomId为-1表示不在房间中，须用选场的roomId; roomId不为-1表示已在房间中，须用此roomId;
         */
        var roomId = notify.roomId;
        if (roomId == -1) {
            //@ts-ignore
            roomId = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId;
        }
        ;
        if (roomId === undefined || roomId === null) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            return;
        }
        ;
        this.setOwnPlayerPid(pid);
        //@ts-ignore
        LoggerUtil.getInstance().error("caojun GlobalCfg.USER_DATAS.userDiamond = " + GlobalCfg.USER_DATAS.userDiamond);
        //@ts-ignore
        var playerNode = this.addPlayerNodeByPosIndex(0);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerKuang(DataDef_1.EnumPlayerKuangType.WITHCOIN);
            playerCtrl.setPlayerStyle(0);
            playerCtrl.setPlayerPid(pid);
            //@ts-ignore
            playerCtrl.setPlayerName(GlobalCfg.USER_DATAS.userName);
            //@ts-ignore
            playerCtrl.setPlayerCoin(diamond);
            //@ts-ignore
            playerCtrl.setPlayerHead(GlobalCfg.USER_DATAS.userHeadimgurl);
        }
        ;
        //@ts-ignore
        GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
            id: roomId
        });
    };
    TpGameCtrl.prototype.dealExitGameMsg = function (notify) {
        window["isNeedShowRoomList"] = "tpGame";
        //@ts-ignore
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
    };
    TpGameCtrl.prototype.dealEnterTableMsg = function (notify) {
        var conf = notify.conf;
        var forceJump = notify.forceJump;
        var matching = notify.matching;
        var scene = notify.scene;
        this.waitStartTipCtrl.setWaitStartTipActive(true);
        var maxBlinds = conf.blind ? "Always Blind" : "4";
        var tableInfo = {
            bootAmount: conf.cellScore / 100,
            chaalLimit: conf.maxJetton / 100,
            maxBlinds: maxBlinds,
            potLimit: conf.maxTableJetton / 100,
        };
        this.tableInfoCtrl.setTableInfoData(tableInfo);
        this.tableInfoToastCtrl.setTableInfoToastData(tableInfo);
        // //@ts-ignore
        // if (GlobalCfg.server_id == "2" || GlobalCfg.server_id == "22" || GlobalCfg.server_id == "0" || GlobalCfg.server_id == "21") {
        //     this.addCashCtrl.setAddCashStyle(conf.trial ? EnumAddCashType.PRACTICE : EnumAddCashType.CASH, conf);
        // };
        if (matching == false && scene) {
            this.dealGameSceneMsg(scene);
        }
        ;
    };
    TpGameCtrl.prototype.dealGameSceneMsg = function (notify) {
        var setFlag = notify.setFlag;
        var players = notify.players;
        var chipPool = notify.chipPool;
        var round = notify.round;
        var curSeat = notify.curSeat;
        var matchFinish = notify.matchFinish;
        if (matchFinish) {
            this.tpGameAudioCtrl.playPlayerJoinEffect();
        }
        ;
        this.waitStartTipCtrl.setWaitStartTipActive(players.length >= 2 ? false : true);
        this.setCurOptPlayerSeat(curSeat);
        this.roundInfoCtrl.setRoundInfoRound(round);
        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        this.setOwnPlayerSeatByPlayersInfo(players);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        this.setSeatPosNodeIndexMapByOwnPlayerSeat(ownPlayerSeat);
        this.setPlayerCharacterInfoByPlayersInfo(players);
        this.setGameSceneInfo(notify);
    };
    TpGameCtrl.prototype.setChipList = function (chipList) {
        var chipParent = this.getChipParent();
        for (var i = 0, len = chipList.length; i < len; i++) {
            var chip = chipList[i];
            var chipNode = this.getChipNodeFromPool();
            if (chipNode) {
                var chipNodePos = this.getChipNodePosition();
                var chipCtrl = chipNode.getComponent(ChipCtrl_1.default);
                chipCtrl.setChipAmount(chip);
                chipNode.setPosition(chipNodePos);
                chipParent.addChild(chipNode);
            }
            ;
        }
        ;
    };
    TpGameCtrl.prototype.refreshOwnDiamond = function () {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(ownPlayerSeat);
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            var betInfoNode = this.getBetInfoNodeByPosIndex(posNodeIndex);
            var betInfo = "0";
            if (betInfoNode) {
                var betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl_1.default);
                betInfo = betInfoCtrl.getBetInfoTotalBet();
            }
            ;
            //@ts-ignore
            var userDiamond = GlobalCfg.USER_DATAS.userDiamond - (parseFloat(betInfo) * 100);
            playerCtrl.setPlayerCoin(userDiamond);
        }
        ;
    };
    /**
     * 设置自己玩家PlayerId
     * @param pid 玩家PlayerId
     */
    TpGameCtrl.prototype.setOwnPlayerPid = function (pid) {
        this.ownPlayerPid = pid;
    };
    /**
     * 获取自己玩家PlayerId
     * @returns 自己玩家PlayerId
     */
    TpGameCtrl.prototype.getOwnPlayerPid = function () {
        return this.ownPlayerPid;
    };
    /**
     * 设置当前操作玩家的座位号
     * @param seat 座位号
     */
    TpGameCtrl.prototype.setCurOptPlayerSeat = function (seat) {
        this.curOptPlayerSeat = seat;
    };
    /**
     * 获取当前操作玩家的座位号，若返回值为-1，则表示没有当前操作玩家的座位号。
     * @returns 当前操作玩家的座位号
     */
    TpGameCtrl.prototype.getCurOptPlayerSeat = function () {
        return this.curOptPlayerSeat;
    };
    /**
     * 设置正常状态的玩家数量
     * @param number
     */
    TpGameCtrl.prototype.setNormalPlayerNumber = function (number) {
        this.normalPlayerNumber = number;
    };
    /**
     * 获取正常状态的玩家数量
     * @returns 正常状态的玩家数量
     */
    TpGameCtrl.prototype.getNormalPlayerNumber = function () {
        return this.normalPlayerNumber;
    };
    /**
     * 通过玩家信息数组设置自己玩家的座位号
     * @param players 场景数据中的玩家信息数组
     */
    TpGameCtrl.prototype.setOwnPlayerSeatByPlayersInfo = function (players) {
        var ownPlayerPid = this.getOwnPlayerPid();
        for (var i = 0, len = players.length; i < len; i++) {
            var scenePlayerInfo = players[i];
            var seat = scenePlayerInfo.seat;
            var userInfo = scenePlayerInfo.user;
            var playerId = userInfo.playerId;
            if (ownPlayerPid === playerId) {
                this.setOwnPlayerSeat(seat);
                return;
            }
            ;
        }
        ;
    };
    /**
     * 设置自己玩家的座位号
     * @param seat 玩家座位号
     */
    TpGameCtrl.prototype.setOwnPlayerSeat = function (seat) {
        this.ownPlayerSeat = seat;
    };
    /**
     * 获取自己玩家的座位号
     * @returns 自己玩家的座位号，若返回值为-1，则表示没有自己玩家的座位号。
     */
    TpGameCtrl.prototype.getOwnPlayerSeat = function () {
        return this.ownPlayerSeat;
    };
    /**
     * 通过自己玩家的座位号设置座位号和其对应的位置节点索引的映射关系表
     * @param ownPlayerSeat 自己玩家的座位号
     */
    TpGameCtrl.prototype.setSeatPosNodeIndexMapByOwnPlayerSeat = function (ownPlayerSeat) {
        this.seatPosNodeIndexMap.clear();
        for (var posIndex = 0; posIndex < 5; posIndex++) {
            this.seatPosNodeIndexMap.set((ownPlayerSeat + posIndex) % 5, posIndex);
        }
        ;
    };
    /**
     * 通过玩家的座位号获取对应的位置节点索引
     * @param seat 玩家的座位号
     * @returns 对应的位置节点索引, 若返回值为-1，则表示没有找到对应的位置节点索引。
     */
    TpGameCtrl.prototype.getPosNodeIndexByPlayerSeat = function (seat) {
        if (this.seatPosNodeIndexMap.has(seat) == false) {
            return -1;
        }
        ;
        return this.seatPosNodeIndexMap.get(seat);
    };
    /**
     * 通过玩家信息数组设置玩家的基本信息。如：头像，昵称，金币...
     * @param players 场景数据中的玩家信息数组
     */
    TpGameCtrl.prototype.setPlayerCharacterInfoByPlayersInfo = function (players) {
        for (var i = 0, len = players.length; i < len; i++) {
            var scenePlayerInfo = players[i];
            var seat = scenePlayerInfo.seat;
            var userInfo = scenePlayerInfo.user;
            var nickname = userInfo.nickname;
            var headUrl = userInfo.imgUrl;
            var diamond = userInfo.diamond;
            var vipLevel = userInfo.vipLevel;
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            var playerNode = this.addPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
                playerCtrl.setPlayerKuang(posNodeIndex == 0 ? DataDef_1.EnumPlayerKuangType.WITHCOIN : DataDef_1.EnumPlayerKuangType.WITHOUTCOIN);
                playerCtrl.setPlayerStyle(posNodeIndex);
                playerCtrl.setPlayerSeat(seat);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(headUrl);
                playerCtrl.setPlayerCoin(diamond);
            }
            ;
        }
        ;
    };
    /**
     * 通过场景数据设置场景表现
     * @param notify 服务器下发的场景数据
     */
    TpGameCtrl.prototype.setGameSceneInfo = function (notify) {
        var status = notify.status;
        switch (status) {
            case DataDef_1.EnumTableStatus.WAIT:
                this.setGameSceneInfoForWaitStatus(notify);
                break;
            case DataDef_1.EnumTableStatus.RUNNING:
                this.setGameSceneInfoForRunningStatus(notify);
                break;
            case DataDef_1.EnumTableStatus.CALCULATE:
                this.setGameSceneInfoForCalculateStatus(notify);
                break;
            default:
                break;
        }
        ;
    };
    /**
     * 设置场景状态为准备时的场景信息
     * @param notify 服务器下发的场景数据
     */
    TpGameCtrl.prototype.setGameSceneInfoForWaitStatus = function (notify) {
        this.setNormalPlayerNumber(0);
        this.tableInfoCtrl.setTableInfoNodeActive(true);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
    };
    /**
     * 设置场景状态为运行时的场景信息
     * @param notify 服务器下发的场景数据
     */
    TpGameCtrl.prototype.setGameSceneInfoForRunningStatus = function (notify) {
        var players = notify.players;
        //@ts-ignore
        LoggerUtil.getInstance().error("setGameSceneInfoForRunningStatus notplayersify = ", players);
        var banker = notify.banker;
        var curChip = notify.curChip;
        var selfBaseChip = notify.selfBaseChip;
        var curSeat = notify.curSeat;
        var actTime = notify.actTime;
        var duringPaymentSeat = notify.duringPaymentSeat;
        var sourceCompSeat = notify.sourceCompSeat;
        var targetCompSeat = notify.targetCompSeat;
        var plotPayment = notify.plotPayment;
        var plotWinRate = notify.plotWinRate;
        var chipList = notify.chipList;
        var time = Math.floor(actTime / 1000);
        this.setChipList(chipList);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var ownPlayerActionMask = 0;
        var ownPlayerLookValue = false;
        var ownPlayerStatus = DataDef_1.EnumPlayStatus.NORMAL;
        var normalPlayerNumber = 0;
        for (var i = 0, len = players.length; i < len; i++) {
            var scenePlayerInfo = players[i];
            var seat = scenePlayerInfo.seat;
            var status = scenePlayerInfo.status;
            var hand = scenePlayerInfo.hand;
            var allChip = scenePlayerInfo.allChip;
            var actionMask = scenePlayerInfo.actionMask;
            var look = scenePlayerInfo.look;
            var lastAct = scenePlayerInfo.lastAct;
            var user = scenePlayerInfo.user;
            if (status == DataDef_1.EnumPlayStatus.NORMAL) {
                normalPlayerNumber += 1;
            }
            ;
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                var playerId = user.playerId;
                var displayName = user.displayName;
                var imgUrl = user.imgUrl;
                var nickname = user.nickname;
                var sex = user.sex;
                var diamond = user.diamond;
                var vipLevel = user.vipLevel;
                var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
                playerCtrl.setPlayerPid(playerId);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(imgUrl);
                playerCtrl.setPlayerCoin(diamond);
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
            }
            ;
            if (status != DataDef_1.EnumPlayStatus.WATCH) {
                var handCardsNode = this.addHandCardsNodeByPosIndex(posNodeIndex);
                if (handCardsNode) {
                    var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
                    handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                    handCardsCtrl.setHandCardsSeenValue(look);
                    if (ownPlayerSeat == seat) {
                        if (look) {
                            var cards = hand.cards;
                            var suit = hand.suit;
                            var score = hand.score;
                            handCardsCtrl.setHandCardsBtnSeeActive(false);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsPowerPerformance(score);
                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                            handCardsCtrl.setHandCardsFrontPerformance();
                        }
                        else {
                            handCardsCtrl.setHandCardsBtnSeeActive(status == DataDef_1.EnumPlayStatus.NORMAL ? true : false);
                        }
                        ;
                    }
                    else {
                        if (look) {
                            var cards = hand.cards;
                            var suit = hand.suit;
                            var score = hand.score;
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsSeenPerformanceActive(true);
                        }
                        else {
                        }
                        ;
                    }
                    ;
                    handCardsCtrl.setHandCardsGrayPerfomanceActive(status == DataDef_1.EnumPlayStatus.NORMAL ? false : true);
                    if (status == DataDef_1.EnumPlayStatus.NORMAL && (lastAct == 2 || lastAct == 4) && curSeat != seat) {
                        if (look) {
                            handCardsCtrl.setHandCardsCatchChipPerformance(lastAct == 2 ? DataDef_1.EnumCatchChip.CHAAL : DataDef_1.EnumCatchChip.CHAALx2);
                        }
                        else {
                            handCardsCtrl.setHandCardsCatchChipPerformance(lastAct == 2 ? DataDef_1.EnumCatchChip.BLIND : DataDef_1.EnumCatchChip.BLINDx2);
                        }
                        ;
                    }
                    ;
                }
                ;
                var betInfoNode = this.addBetInfoNodeByPosIndex(posNodeIndex);
                if (betInfoNode) {
                    var betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl_1.default);
                    betInfoCtrl.setBetInfoTotalBet(allChip);
                }
                ;
            }
            ;
            if (ownPlayerSeat == seat) {
                ownPlayerActionMask = actionMask;
                ownPlayerLookValue = look;
                ownPlayerStatus = status;
            }
            ;
        }
        ;
        this.setNormalPlayerNumber(normalPlayerNumber);
        if (ownPlayerSeat !== curSeat) {
            if (ownPlayerStatus == DataDef_1.EnumPlayStatus.NORMAL) {
                this.tableInfoCtrl.setTableInfoNodeActive(false);
                this.actBtnsCtrl.setActBtnsNodeActive(true);
                this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
                this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
                this.actBtnsCtrl.setActBtnsBetBtnString(ownPlayerLookValue ? DataDef_1.EnumBetBtnStr.CHAAL : DataDef_1.EnumBetBtnStr.BLIND);
            }
            else {
                this.tableInfoCtrl.setTableInfoNodeActive(true);
                this.actBtnsCtrl.setActBtnsNodeActive(false);
            }
            ;
        }
        else {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            var actValueArr = this.getCanActValueArrByActMask(ownPlayerActionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
            this.actBtnsCtrl.setActBtnsBetBtnString(ownPlayerLookValue ? DataDef_1.EnumBetBtnStr.CHAAL : DataDef_1.EnumBetBtnStr.BLIND);
        }
        ;
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? DataDef_1.EnumShowBtnStr.SHOW : DataDef_1.EnumShowBtnStr.SIDESHOW);
        if (duringPaymentSeat != -1) {
            var paymentPosNodeIndex = this.getPosNodeIndexByPlayerSeat(duringPaymentSeat);
            if (paymentPosNodeIndex == -1) {
                console.log("setGameSceneInfoForRunningStatus\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! duringPaymentSeat: " + duringPaymentSeat);
                return;
            }
            ;
            var paymentPlayerNode = this.getPlayerNodeByPosIndex(paymentPosNodeIndex);
            if (paymentPlayerNode) {
                var paymentPlayerCtrl = paymentPlayerNode.getComponent(PlayerCtrl_1.default);
                paymentPlayerCtrl.setPlayerActTime(time);
                paymentPlayerCtrl.setPlayerShopActive(true);
            }
            ;
            if (ownPlayerSeat == duringPaymentSeat) {
                this.actBtnsCtrl.setActBtnsRechargeData(plotPayment, time, plotWinRate);
                this.ownRechargeTipCtrl.setOwnRechargeTipTime(time);
                this.btn_recharge.active = time > 0;
                this.isRechargeStatus = time > 0;
            }
            ;
        }
        else if (sourceCompSeat != -1 && targetCompSeat != -1) {
            var sourceCompPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sourceCompSeat);
            if (sourceCompPosNodeIndex == -1) {
                console.log("setGameSceneInfoForRunningStatus\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! sourceCompSeat: " + sourceCompSeat);
                return;
            }
            ;
            var targetCompPosNodeIndex = this.getPosNodeIndexByPlayerSeat(targetCompSeat);
            if (targetCompPosNodeIndex == -1) {
                console.log("setGameSceneInfoForRunningStatus\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! targetCompSeat: " + targetCompSeat);
                return;
            }
            ;
            var launchInfo = {
                name: "",
                headUrl: "",
            };
            var launchPlayerNode = this.getPlayerNodeByPosIndex(sourceCompPosNodeIndex);
            if (launchPlayerNode) {
                var launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl_1.default);
                launchPlayerCtrl.setPlayerActTime(0);
                launchInfo.name = launchPlayerCtrl.getPlayerName();
                launchInfo.headUrl = launchPlayerCtrl.getPlayerHeadUrl();
            }
            ;
            var targetInfo = {
                name: "",
                headUrl: "",
            };
            var targetPlayerNode = this.getPlayerNodeByPosIndex(targetCompPosNodeIndex);
            if (targetPlayerNode) {
                var targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl_1.default);
                targetPlayerCtrl.setPlayerActTime(time);
                targetInfo.name = targetPlayerCtrl.getPlayerName();
                targetInfo.headUrl = targetPlayerCtrl.getPlayerHeadUrl();
            }
            ;
            this.showCompareCardLine(sourceCompSeat, targetCompSeat);
            if (targetCompSeat == ownPlayerSeat) {
                var playersInfo = {
                    launchInfo: launchInfo,
                    targetInfo: targetInfo
                };
                this.showCompareCardToast(playersInfo);
            }
            ;
        }
        else {
            var curPosNodeIndex = this.getPosNodeIndexByPlayerSeat(curSeat);
            if (curPosNodeIndex == -1) {
                console.log("setGameSceneInfoForRunningStatus\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! curSeat: " + curSeat);
                return;
            }
            ;
            var curOptPlayerNode = this.getPlayerNodeByPosIndex(curPosNodeIndex);
            if (curOptPlayerNode) {
                var curOptPlayerCtrl = curOptPlayerNode.getComponent(PlayerCtrl_1.default);
                curOptPlayerCtrl.setPlayerActTime(time);
            }
            ;
        }
        ;
    };
    /**
     * 设置场景状态为结算时的场景信息
     * @param notify 服务器下发的场景数据
     */
    TpGameCtrl.prototype.setGameSceneInfoForCalculateStatus = function (notify) {
        var players = notify.players;
        var actTime = notify.actTime;
        var lastGameCalc = notify.lastGameCalc;
        var chipList = notify.chipList;
        if (actTime <= 3500) {
            var plotOffset = lastGameCalc.plotOffset;
            if (plotOffset) {
                this.luckyPlayerCtrl.setLuckyPlayerActive(true);
                this.luckyPlayerCtrl.setLuckyPlayerPlotOffset(plotOffset);
            }
            ;
            return;
        }
        ;
        this.setChipList(chipList);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        for (var i = 0, len = players.length; i < len; i++) {
            var scenePlayerInfo = players[i];
            var seat = scenePlayerInfo.seat;
            var status = scenePlayerInfo.status;
            var hand = scenePlayerInfo.hand;
            var allChip = scenePlayerInfo.allChip;
            var actionMask = scenePlayerInfo.actionMask;
            var look = scenePlayerInfo.look;
            var lastAct = scenePlayerInfo.lastAct;
            var user = scenePlayerInfo.user;
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                var playerId = user.playerId;
                var displayName = user.displayName;
                var imgUrl = user.imgUrl;
                var nickname = user.nickname;
                var sex = user.sex;
                var diamond = user.diamond;
                var vipLevel = user.vipLevel;
                var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
                playerCtrl.setPlayerPid(playerId);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(imgUrl);
                playerCtrl.setPlayerCoin(diamond);
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
            }
            ;
            if (status != DataDef_1.EnumPlayStatus.WATCH && hand) {
                var handCardsNode = this.addHandCardsNodeByPosIndex(posNodeIndex);
                if (handCardsNode) {
                    var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
                    handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                    handCardsCtrl.setHandCardsSeenValue(look);
                    if (ownPlayerSeat == seat) {
                        if (look) {
                            var cards = hand.cards;
                            var suit = hand.suit;
                            var score = hand.score;
                            handCardsCtrl.setHandCardsBtnSeeActive(false);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsPowerPerformance(score);
                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                            handCardsCtrl.setHandCardsFrontPerformance();
                        }
                        else {
                            handCardsCtrl.setHandCardsBtnSeeActive(status == DataDef_1.EnumPlayStatus.NORMAL ? true : false);
                        }
                        ;
                    }
                    else {
                        if (look) {
                            var cards = hand.cards;
                            var suit = hand.suit;
                            var score = hand.score;
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsSeenPerformanceActive(true);
                        }
                        else {
                        }
                        ;
                    }
                    ;
                    handCardsCtrl.setHandCardsGrayPerfomanceActive(status == DataDef_1.EnumPlayStatus.NORMAL ? false : true);
                }
                ;
                var betInfoNode = this.addBetInfoNodeByPosIndex(posNodeIndex);
                if (betInfoNode) {
                    var betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl_1.default);
                    betInfoCtrl.setBetInfoTotalBet(allChip);
                }
                ;
            }
            ;
        }
        ;
        this.dealGameOverNotifyMsg(lastGameCalc);
    };
    TpGameCtrl.prototype.dealGameStartNotifyMsg = function (notify) {
        var _this = this;
        var banker = notify.banker;
        var curChip = notify.curChip;
        var chipPool = notify.chipPool;
        var players = notify.players;
        this.waitStartTipCtrl.setWaitStartTipActive(false);
        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var normalPlayerNumber = 0;
        for (var i = 0, len = players.length; i < len; i++) {
            var gameStartPlayer = players[i];
            var seat = gameStartPlayer.seat;
            var status = gameStartPlayer.status;
            var diamond = gameStartPlayer.diamond;
            if (status == DataDef_1.EnumPlayStatus.NORMAL) {
                normalPlayerNumber += 1;
            }
            ;
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
                playerCtrl.resetPlayerPerformance();
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
                playerCtrl.setPlayerCoin(diamond);
            }
            ;
        }
        ;
        this.setNormalPlayerNumber(normalPlayerNumber);
        this.playSendCardAnim(players, function () {
            _this.scheduleOnce(function () {
                for (var i = 0, len = players.length; i < len; i++) {
                    var gameStartPlayer = players[i];
                    var seat = gameStartPlayer.seat;
                    var posNodeIndex = _this.getPosNodeIndexByPlayerSeat(seat);
                    var playerNode = _this.getPlayerNodeByPosIndex(posNodeIndex);
                    if (!playerNode) {
                        return;
                    }
                    ;
                    var handCardsNode = _this.addHandCardsNodeByPosIndex(posNodeIndex);
                    if (handCardsNode) {
                        var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
                        handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                        handCardsCtrl.setHandCardsBtnSeeActive(ownPlayerSeat == seat);
                    }
                    ;
                    var betInfoNode = _this.addBetInfoNodeByPosIndex(posNodeIndex);
                    if (betInfoNode) {
                        var betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl_1.default);
                        betInfoCtrl.setBetInfoTotalBet(0);
                    }
                    ;
                }
                ;
                _this.destroyAllSendCard();
            }, 0.5);
        });
        this.tableInfoCtrl.setTableInfoNodeActive(false);
        this.actBtnsCtrl.setActBtnsNodeActive(true);
        this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
        this.actBtnsCtrl.setActBtnsChipAmount(curChip);
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? DataDef_1.EnumShowBtnStr.SHOW : DataDef_1.EnumShowBtnStr.SIDESHOW);
    };
    TpGameCtrl.prototype.playSendCardAnim = function (players, finishedCall) {
        var _this = this;
        var sendCardParent = this.getSendCardParent();
        var playersLen = players.length;
        var finishedNum = 0;
        for (var i = 0; i < playersLen; i++) {
            var gameStartPlayer = players[i];
            var seat = gameStartPlayer.seat;
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("playSendCardAnim\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            var posNode = this.getPosNodeByIndex(posNodeIndex);
            var handCardsParent = posNode.getChildByName("HandCardsParent");
            var contentSize = void 0;
            var cardDis = void 0;
            if (posNodeIndex == 0) {
                contentSize = cc.size(128.7, 166.1);
                cardDis = 50;
            }
            else {
                contentSize = cc.size(109.4, 141.2);
                cardDis = 40;
            }
            ;
            for (var k = 0; k < 3; k++) {
                var worldPos = handCardsParent.convertToWorldSpaceAR(cc.v3(cardDis * (k - 1), 0));
                var localPos = sendCardParent.convertToNodeSpaceAR(worldPos);
                var singleCardNode = this.getSingleCardNodeFromPool();
                singleCardNode.setPosition(cc.v3(0, 250));
                sendCardParent.addChild(singleCardNode);
                singleCardNode.setContentSize(cc.size(0, 0));
                cc.tween(singleCardNode)
                    .delay(0.2 * k)
                    .call(function () {
                    _this.tpGameAudioCtrl.playFaCardEffect();
                })
                    .to(0.2, { position: localPos, width: contentSize.width, height: contentSize.height })
                    .call(function () {
                    finishedNum += 1;
                    if (finishedNum == playersLen) {
                        finishedCall && finishedCall();
                    }
                    ;
                })
                    .start();
            }
            ;
        }
        ;
    };
    TpGameCtrl.prototype.destroyAllSendCard = function () {
        var sendCardParent = this.getSendCardParent();
        var children = sendCardParent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var singleCardNode = children[i];
            this.putSingleCardNodePool(singleCardNode);
        }
        ;
    };
    TpGameCtrl.prototype.dealAskChipNotifyMsg = function (notify) {
        var seat = notify.seat;
        var round = notify.round;
        var curChip = notify.curChip;
        var selfBaseChip = notify.selfBaseChip;
        var allowAction = notify.allowAction;
        var timeout = notify.timeout;
        var first = notify.first;
        this.setCurOptPlayerSeat(seat);
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("\u5728\u547C\u53EB\u73A9\u5BB6\u4E0B\u6CE8\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        this.roundInfoCtrl.setRoundInfoRound(round);
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerActTime(timeout);
        }
        ;
        var handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
            handCardsCtrl.setHandCardsCatchChipPerformance(DataDef_1.EnumCatchChip.NONE);
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            var actValueArr = this.getCanActValueArrByActMask(allowAction);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
            if (handCardsNode) {
                var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
                var seenValue = handCardsCtrl.getHandCardsSeenValue();
                this.actBtnsCtrl.setActBtnsBetBtnString(seenValue ? DataDef_1.EnumBetBtnStr.CHAAL : DataDef_1.EnumBetBtnStr.BLIND);
            }
            ;
        }
        else {
            var active = this.actBtnsCtrl.getActBtnsNodeActive();
            if (active) {
                this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
            }
            ;
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerChipNotifyMsg = function (notify) {
        var seat = notify.seat;
        var add = notify.add;
        var chip = notify.chip;
        var allChip = notify.allChip;
        var after = notify.after;
        var chipPool = notify.chipPool;
        var curChip = notify.curChip;
        this.tpGameAudioCtrl.playCatchChipEffect();
        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u4E0B\u6CE8\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerActTime(0);
            playerCtrl.setPlayerCoin(after);
            playerCtrl.setPlayerShopActive(false);
        }
        ;
        var handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
            if (chip != allChip) {
                var seenValue = handCardsCtrl.getHandCardsSeenValue();
                var opt = DataDef_1.EnumCatchChip.BLIND;
                if (seenValue == false && add == true) {
                    opt = DataDef_1.EnumCatchChip.BLINDx2;
                }
                else if (seenValue == true && add == false) {
                    opt = DataDef_1.EnumCatchChip.CHAAL;
                }
                else if (seenValue == true && add == true) {
                    opt = DataDef_1.EnumCatchChip.CHAALx2;
                }
                ;
                handCardsCtrl.setHandCardsCatchChipPerformance(opt);
            }
            ;
        }
        ;
        var betInfoNode = this.getBetInfoNodeByPosIndex(posNodeIndex);
        if (betInfoNode) {
            var betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl_1.default);
            betInfoCtrl.setBetInfoTotalBet(allChip);
        }
        ;
        var chipNode = this.getChipNodeFromPool();
        if (chipNode && playerNode) {
            var chipCtrl = chipNode.getComponent(ChipCtrl_1.default);
            chipCtrl.setChipAmount(chip);
            var chipNodePos = this.getChipNodePosition();
            var chipParent = this.getChipParent();
            var playerNodeWorldPos = playerNode.parent.convertToWorldSpaceAR(new cc.Vec2(playerNode.x, playerNode.y));
            var converPos = chipParent.convertToNodeSpaceAR(playerNodeWorldPos);
            chipNode.setPosition(converPos);
            chipParent.addChild(chipNode);
            cc.tween(chipNode)
                .to(0.3, { position: chipNodePos }, { easing: 'circOut' })
                .start();
        }
        ;
        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerDropNotifyMsg = function (notify) {
        var seat = notify.seat;
        this.tpGameAudioCtrl.playDropCardEffect();
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u68CB\u724C\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerActTime(0);
            playerCtrl.setPlayerStateValue(DataDef_1.EnumPlayStatus.DROP);
            playerCtrl.setPlayerStatePerformance();
            playerCtrl.setPlayerShopActive(false);
        }
        ;
        var handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            var handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl_1.default);
            handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
            if (ownPlayerSeat == seat) {
                var seenValue = handCardsCtrl.getHandCardsSeenValue();
                if (seenValue == false) {
                    handCardsCtrl.setHandCardsBtnSeeActive(false);
                }
                ;
            }
            ;
        }
        ;
        var normalPlayerNumber = this.getNormalPlayerNumber();
        normalPlayerNumber -= 1;
        this.setNormalPlayerNumber(normalPlayerNumber);
        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(true);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.actBtnsCtrl.setActBtnsNodeActive(false);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        }
        ;
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? DataDef_1.EnumShowBtnStr.SHOW : DataDef_1.EnumShowBtnStr.SIDESHOW);
    };
    TpGameCtrl.prototype.dealPlayerLookNotifyMsg = function (notify) {
        var seat = notify.seat;
        var hand = notify.hand;
        var cards = hand.cards;
        var suit = hand.suit;
        var score = hand.score;
        var actionMask = notify.actionMask;
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u770B\u724C\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            var handCardsCtrl_1 = handCardsNode.getComponent(HandCardsCtrl_1.default);
            handCardsCtrl_1.setHandCardsValueArr(cards);
            handCardsCtrl_1.setHandCardsSeenValue(true);
            if (ownPlayerSeat == seat) {
                this.tpGameAudioCtrl.playRollOverCardEffect();
                handCardsCtrl_1.setHandCardsBtnSeeActive(false);
                handCardsCtrl_1.setHandCardsFlopPerformance();
                handCardsCtrl_1.setHandCardsSuitValue(suit);
                handCardsCtrl_1.scheduleOnce(function () {
                    handCardsCtrl_1.setHandCardsPowerPerformance(score);
                    handCardsCtrl_1.setHandCardsStaticSuitPerformance();
                }, 0.3);
            }
            else {
                handCardsCtrl_1.setHandCardsSeenPerformanceActive(true);
            }
            ;
        }
        ;
        if (ownPlayerSeat == seat) {
            var curOptPlayerSeat = this.getCurOptPlayerSeat();
            this.actBtnsCtrl.updateActBtnsChipAmountBySeen();
            var actValueArr = this.getCanActValueArrByActMask(actionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(curOptPlayerSeat == ownPlayerSeat ? actValueArr : []);
            this.actBtnsCtrl.setActBtnsBetBtnString(DataDef_1.EnumBetBtnStr.CHAAL);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLuanchCompareNotifyMsg = function (notify) {
        var launch = notify.launch;
        var target = notify.target;
        this.tpGameAudioCtrl.playCompareCardLineEffect();
        this.setCurOptPlayerSeat(target);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        var launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        if (launchPosNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u53D1\u8D77\u6BD4\u8F83\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! launch: " + launch);
            return;
        }
        ;
        var targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
        if (targetPosNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u53D1\u8D77\u6BD4\u8F83\u7684\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! target: " + target);
            return;
        }
        ;
        var launchInfo = {
            name: "",
            headUrl: "",
        };
        var launchPlayerNode = this.getPlayerNodeByPosIndex(launchPosNodeIndex);
        if (launchPlayerNode) {
            var launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl_1.default);
            launchPlayerCtrl.setPlayerActTime(0);
            launchPlayerCtrl.setPlayerShopActive(false);
            launchInfo.name = launchPlayerCtrl.getPlayerName();
            launchInfo.headUrl = launchPlayerCtrl.getPlayerHeadUrl();
        }
        ;
        var targetInfo = {
            name: "",
            headUrl: "",
        };
        var targetPlayerNode = this.getPlayerNodeByPosIndex(targetPosNodeIndex);
        if (targetPlayerNode) {
            var targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl_1.default);
            targetPlayerCtrl.setPlayerActTime(this.defaultOptTime);
            targetPlayerCtrl.setPlayerShopActive(false);
            targetInfo.name = targetPlayerCtrl.getPlayerName();
            targetInfo.headUrl = targetPlayerCtrl.getPlayerHeadUrl();
        }
        ;
        this.showCompareCardLine(launch, target);
        if (target == ownPlayerSeat) {
            var playersInfo = {
                launchInfo: launchInfo,
                targetInfo: targetInfo
            };
            this.showCompareCardToast(playersInfo);
        }
        ;
        if (target == ownPlayerSeat || ownPlayerSeat == launch) {
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerAnswerCompareNotifyMsg = function (notify) {
        var _this = this;
        var agree = notify.agree;
        var launch = notify.launch;
        var target = notify.target;
        var launcherWin = notify.launcherWin;
        var autoAnswer = notify.autoAnswer;
        var launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        if (launchPosNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u53D1\u8D77\u6BD4\u8F83\u7684\u7ED3\u679C\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! launch: " + launch);
            return;
        }
        ;
        var targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
        if (targetPosNodeIndex == -1) {
            console.log("\u5728\u73A9\u5BB6\u53D1\u8D77\u6BD4\u8F83\u7684\u7ED3\u679C\u901A\u77E5\u65F6\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! target: " + target);
            return;
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        this.destroyCompareCardLine();
        this.destroyCompareCardToast();
        var launchPlayerNode = this.getPlayerNodeByPosIndex(launchPosNodeIndex);
        if (launchPlayerNode) {
            var launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl_1.default);
            launchPlayerCtrl.setPlayerActTime(0);
        }
        ;
        var targetPlayerNode = this.getPlayerNodeByPosIndex(targetPosNodeIndex);
        if (targetPlayerNode) {
            var targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl_1.default);
            targetPlayerCtrl.setPlayerActTime(0);
            if (!autoAnswer) {
                targetPlayerCtrl.setPlayerBattlePerformance(agree ? DataDef_1.EnumBattleStatus.AGREE : DataDef_1.EnumBattleStatus.REFUSE);
            }
            ;
        }
        ;
        if (agree) {
            var normalPlayerNumber_1 = this.getNormalPlayerNumber();
            normalPlayerNumber_1 -= 1;
            this.setNormalPlayerNumber(normalPlayerNumber_1);
            this.showCompareCardVS();
            this.tpGameAudioCtrl.playCompareCardVSEffect();
            this.scheduleOnce(function () {
                _this.destroyCompareCardVS();
                var lostPosIndex = launcherWin ? targetPosNodeIndex : launchPosNodeIndex;
                var lostPlayerNode = _this.getPlayerNodeByPosIndex(lostPosIndex);
                var lostHandsCardNode = _this.getHandCardsNodeByPosIndex(lostPosIndex);
                if (lostPlayerNode) {
                    _this.tpGameAudioCtrl.playCompareCardLostEffect();
                    var lostPlayerCtrl_1 = lostPlayerNode.getComponent(PlayerCtrl_1.default);
                    lostPlayerCtrl_1.setPlayerStateValue(DataDef_1.EnumPlayStatus.LOST);
                    lostPlayerCtrl_1.setPlayerLostPerformance();
                    lostPlayerCtrl_1.scheduleOnce(function () {
                        lostPlayerCtrl_1.setPlayerStatePerformance();
                        if (lostHandsCardNode) {
                            var lostHandsCardsCtrl = lostHandsCardNode.getComponent(HandCardsCtrl_1.default);
                            lostHandsCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                            lostHandsCardsCtrl.setHandCardsBtnSeeActive(false);
                        }
                        ;
                    }, 1);
                }
                ;
                if ((launcherWin && ownPlayerSeat == target) || (!launcherWin && ownPlayerSeat == launch)) {
                    _this.tableInfoCtrl.setTableInfoNodeActive(true);
                    _this.actBtnsCtrl.setActBtnsNodeActive(false);
                }
                ;
                _this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber_1 == 2 ? DataDef_1.EnumShowBtnStr.SHOW : DataDef_1.EnumShowBtnStr.SIDESHOW);
            }, 1);
        }
        ;
    };
    TpGameCtrl.prototype.dealGameOverNotifyMsg = function (notify) {
        var _this = this;
        var players = notify.players;
        var winSeat = notify.winSeat;
        var chipPool = notify.chipPool;
        var finishReason = notify.finishReason;
        var nextTimeout = notify.nextTimeout;
        var plotOffset = notify.plotOffset;
        this.setCurOptPlayerSeat(-1);
        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        var ownPlayerSeat = this.getOwnPlayerSeat();
        this.setNormalPlayerNumber(0);
        var winPlayerAfter = 0;
        var winPlayerCalc = 0;
        var _loop_1 = function (i, len) {
            var gameOverPlayer = players[i];
            var seat = gameOverPlayer.seat;
            var cards = gameOverPlayer.cards;
            var suit = gameOverPlayer.suit;
            var calc = gameOverPlayer.calc;
            var after = gameOverPlayer.after;
            var status = gameOverPlayer.status;
            var handledCompare = gameOverPlayer.handledCompare;
            if (seat == ownPlayerSeat) {
                //@ts-ignore
                GlobalCfg.USER_DATAS.userDiamond = after;
            }
            ;
            var posNodeIndex = this_1.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealGameOverNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return "continue";
            }
            ;
            var playerNode = this_1.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                var playerCtrl_1 = playerNode.getComponent(PlayerCtrl_1.default);
                playerCtrl_1.setPlayerActTime(0);
                if (winSeat != seat) {
                    playerCtrl_1.setPlayerCoin(after);
                }
                else {
                    winPlayerAfter = after;
                    winPlayerCalc = calc;
                }
                ;
                var playerStateValue = playerCtrl_1.getPlayerStateValue();
                if (finishReason == DataDef_1.EnumSetFinishReason.ROUNDLIMIT || finishReason == DataDef_1.EnumSetFinishReason.CHIPPOOLLIMIT) {
                    if (winSeat == seat) {
                        this_1.scheduleOnce(function () {
                            _this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl_1.setPlayerWinDynamicPerformance();
                        }, 1);
                    }
                    else {
                        if (playerStateValue == DataDef_1.EnumPlayStatus.NORMAL) {
                            this_1.tpGameAudioCtrl.playCompareCardLostEffect();
                            playerCtrl_1.setPlayerStateValue(DataDef_1.EnumPlayStatus.LOST);
                            playerCtrl_1.setPlayerLostPerformance();
                            playerCtrl_1.scheduleOnce(function () {
                                playerCtrl_1.setPlayerStatePerformance();
                            }, 1);
                        }
                        ;
                    }
                    ;
                    if (seat == winSeat || seat == ownPlayerSeat || handledCompare || playerStateValue == DataDef_1.EnumPlayStatus.NORMAL) {
                        var handCardsNode = this_1.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            var handCardsCtrl_2 = handCardsNode.getComponent(HandCardsCtrl_1.default);
                            handCardsCtrl_2.setHandCardsValueArr(cards);
                            handCardsCtrl_2.setHandCardsSuitValue(suit);
                            handCardsCtrl_2.setHandCardsCatchChipPerformance(DataDef_1.EnumCatchChip.NONE);
                            var seenValue = handCardsCtrl_2.getHandCardsSeenValue();
                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_2.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_2.setHandCardsFlopPerformance();
                                        handCardsCtrl_2.scheduleOnce(function () {
                                            handCardsCtrl_2.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_2.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_2.setHandCardsFlopPerformance();
                                    handCardsCtrl_2.scheduleOnce(function () {
                                        handCardsCtrl_2.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_2.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_2.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl_2.setHandCardsFlopPerformance();
                                        handCardsCtrl_2.scheduleOnce(function () {
                                            handCardsCtrl_2.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_2.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_2.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl_2.setHandCardsFlopPerformance();
                                    handCardsCtrl_2.scheduleOnce(function () {
                                        handCardsCtrl_2.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                else if (finishReason == DataDef_1.EnumSetFinishReason.DROP) {
                    if (winSeat == seat) {
                        this_1.scheduleOnce(function () {
                            _this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl_1.setPlayerWinDynamicPerformance();
                        }, 1);
                    }
                    ;
                    if (seat == ownPlayerSeat || handledCompare) {
                        var handCardsNode = this_1.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            var handCardsCtrl_3 = handCardsNode.getComponent(HandCardsCtrl_1.default);
                            handCardsCtrl_3.setHandCardsValueArr(cards);
                            handCardsCtrl_3.setHandCardsSuitValue(suit);
                            handCardsCtrl_3.setHandCardsCatchChipPerformance(DataDef_1.EnumCatchChip.NONE);
                            var seenValue = handCardsCtrl_3.getHandCardsSeenValue();
                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_3.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_3.setHandCardsFlopPerformance();
                                        handCardsCtrl_3.scheduleOnce(function () {
                                            handCardsCtrl_3.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_3.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_3.setHandCardsFlopPerformance();
                                    handCardsCtrl_3.scheduleOnce(function () {
                                        handCardsCtrl_3.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_3.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_3.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl_3.setHandCardsFlopPerformance();
                                        handCardsCtrl_3.scheduleOnce(function () {
                                            handCardsCtrl_3.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_3.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_3.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl_3.setHandCardsFlopPerformance();
                                    handCardsCtrl_3.scheduleOnce(function () {
                                        handCardsCtrl_3.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                else if (finishReason == DataDef_1.EnumSetFinishReason.COMPARE) {
                    if (winSeat == seat) {
                        this_1.scheduleOnce(function () {
                            _this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl_1.setPlayerWinDynamicPerformance();
                        }, 1);
                    }
                    ;
                    if (seat == winSeat || seat == ownPlayerSeat || handledCompare) {
                        var handCardsNode = this_1.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            var handCardsCtrl_4 = handCardsNode.getComponent(HandCardsCtrl_1.default);
                            handCardsCtrl_4.setHandCardsValueArr(cards);
                            handCardsCtrl_4.setHandCardsSuitValue(suit);
                            handCardsCtrl_4.setHandCardsCatchChipPerformance(DataDef_1.EnumCatchChip.NONE);
                            var seenValue = handCardsCtrl_4.getHandCardsSeenValue();
                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_4.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_4.setHandCardsFlopPerformance();
                                        handCardsCtrl_4.scheduleOnce(function () {
                                            handCardsCtrl_4.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_4.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_4.setHandCardsFlopPerformance();
                                    handCardsCtrl_4.scheduleOnce(function () {
                                        handCardsCtrl_4.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl_4.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl_4.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl_4.setHandCardsFlopPerformance();
                                        handCardsCtrl_4.scheduleOnce(function () {
                                            handCardsCtrl_4.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    }
                                    ;
                                }
                                else {
                                    this_1.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl_4.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl_4.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl_4.setHandCardsFlopPerformance();
                                    handCardsCtrl_4.scheduleOnce(function () {
                                        handCardsCtrl_4.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
        };
        var this_1 = this;
        for (var i = 0, len = players.length; i < len; i++) {
            _loop_1(i, len);
        }
        ;
        this.tableInfoCtrl.setTableInfoNodeActive(true);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
        var winPosNodeIndex = this.getPosNodeIndexByPlayerSeat(winSeat);
        if (winPosNodeIndex == -1) {
            console.log("dealGameOverNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! winSeat: " + winSeat);
            return;
        }
        ;
        this.scheduleOnce(function () {
            _this.tpGameAudioCtrl.playRecycleChipEffect();
            var winPosNode = _this.getPosNodeByIndex(winPosNodeIndex);
            var chipParent = _this.getChipParent();
            var children = chipParent.children;
            var _loop_2 = function (i, len) {
                var chipNode = children[i];
                var winPosNodeWorldPos = winPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(winPosNode.x, winPosNode.y));
                var endPos = chipNode.parent.convertToNodeSpaceAR(winPosNodeWorldPos);
                cc.tween(chipNode)
                    .delay(0.05 * i)
                    .to(0.2, { position: endPos })
                    .call(function () {
                    _this.putChipNodePool(chipNode);
                })
                    .start();
            };
            for (var i = 0, len = children.length; i < len; i++) {
                _loop_2(i, len);
            }
            ;
            _this.scheduleOnce(function () {
                var winPlayerNode = _this.getPlayerNodeByPosIndex(winPosNodeIndex);
                if (winPlayerNode) {
                    var playerCtrl = winPlayerNode.getComponent(PlayerCtrl_1.default);
                    playerCtrl.setPlayerCoin(winPlayerAfter);
                }
                ;
                var winHandCardsNode = _this.getHandCardsNodeByPosIndex(winPosNodeIndex);
                if (winHandCardsNode) {
                    var winHandCardsCtrl = winHandCardsNode.getComponent(HandCardsCtrl_1.default);
                    winHandCardsCtrl.setHandCardsWinScorePerformance(winPlayerCalc);
                }
                ;
            }, 0.5);
            _this.scheduleOnce(function () {
                if (plotOffset) {
                    _this.luckyPlayerCtrl.setLuckyPlayerActive(true);
                    _this.luckyPlayerCtrl.setLuckyPlayerPlotOffset(plotOffset);
                }
                ;
            }, 0.8);
        }, 2);
        //@ts-ignore
        CommonFun.getInstance().showWithdrawToastInGame();
    };
    TpGameCtrl.prototype.dealDestroyAndMatchingNotifyMsg = function (notify) {
        this.destroyAllPlayers();
        this.waitStartTipCtrl.setWaitStartTipActive(true);
    };
    TpGameCtrl.prototype.destroyAllChips = function () {
        var chipParent = this.getChipParent();
        var children = chipParent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var chipNode = children[i];
            if (chipNode) {
                this.putChipNodePool(chipNode);
            }
            else {
                console.log("destroyAllChips\uFF0CchipNode\u4E3A\u7A7A!\uFF0C i: " + i);
            }
            ;
        }
        ;
    };
    /**
     * 清除玩家信息，手牌，下注信息等
     */
    TpGameCtrl.prototype.destroyAllPlayers = function () {
        for (var i = 0; i < 5; i++) {
            if (i == 0) {
                var playerNode = this.getPlayerNodeByPosIndex(i);
                if (playerNode) {
                    var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
                    playerCtrl.resetPlayerPerformance();
                }
                ;
            }
            else {
                this.destroyPlayerNodeByPosIndex(i);
            }
            ;
            this.destroyHandCardsNodeByPosIndex(i);
            this.destroyBetInfoNodeByPosIndex(i);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveNotifyMsg = function (notify) {
        var seat = notify.seat;
        var reason = notify.reason;
        var forceJump = notify.forceJump;
        switch (reason) {
            case DataDef_1.EnumLeaveReason.NORMAL:
                this.dealPlayerLeaveForNormal(seat);
                break;
            case DataDef_1.EnumLeaveReason.OFFLINE:
                this.dealPlayerLeaveForOffline(seat);
                break;
            case DataDef_1.EnumLeaveReason.BROKE:
                this.dealPlayerLeaveForBroke(seat);
                break;
            case DataDef_1.EnumLeaveReason.TIMEOUT:
                this.dealPlayerLeaveForTimeout(seat);
                break;
            case DataDef_1.EnumLeaveReason.ROOMCLOSE:
                this.dealPlayerLeaveForRoomClose(seat);
                break;
            case DataDef_1.EnumLeaveReason.CHANGETABLE:
                this.dealPlayerLeaveForChangeTable(seat);
                break;
            case DataDef_1.EnumLeaveReason.JUMPSPACE:
                this.dealPlayerLeaveForJumpSpace(seat, forceJump);
                break;
            case DataDef_1.EnumLeaveReason.PLOTOFFSET:
                this.dealPlayerLeaveForPlotOffset(seat);
                break;
            default:
                break;
        }
    };
    TpGameCtrl.prototype.dealPlayerLeaveForNormal = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForNormal\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForOffline = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForOffline\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForBroke = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForBroke\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForTimeout = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForTimeout\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForRoomClose = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForRoomClose\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForChangeTable = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat != ownPlayerSeat) {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForChangeTable\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForJumpSpace = function (seat, roomId) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            this.destroyAllPlayers();
            var content = "The gold coins you carry do not meet the event requirements, please enter another event!";
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(content);
            this.msgToastCtrl.setMsgToastStyle(DataDef_1.EnumMsgToastStyle.YES_NO);
            this.msgToastCtrl.setMsgToastYesCall(function () {
                //@ts-ignore
                GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
                    id: roomId
                });
            });
            this.msgToastCtrl.setMsgToastNoCall(function () {
                window["isNeedShowRoomList"] = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForJumpSpace\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerLeaveForPlotOffset = function (seat) {
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat !== ownPlayerSeat) {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log("dealPlayerLeaveForRoomClose\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
                return;
            }
            ;
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerJoinNotifyMsg = function (notify) {
        var userInfo = notify.userInfo;
        var seat = notify.seat;
        var status = notify.status;
        this.tpGameAudioCtrl.playPlayerJoinEffect();
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("dealPlayerJoinNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var playerNode = this.addPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerId = userInfo.playerId;
            var displayName = userInfo.displayName;
            var imgUrl = userInfo.imgUrl;
            var nickname = userInfo.nickname;
            var sex = userInfo.sex;
            var diamond = userInfo.diamond;
            var vipLevel = userInfo.vipLevel;
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerKuang(posNodeIndex == 0 ? DataDef_1.EnumPlayerKuangType.WITHCOIN : DataDef_1.EnumPlayerKuangType.WITHOUTCOIN);
            playerCtrl.setPlayerStyle(posNodeIndex);
            playerCtrl.setPlayerSeat(seat);
            playerCtrl.setPlayerPid(playerId);
            playerCtrl.setPlayerName(nickname);
            playerCtrl.setPlayerHead(imgUrl);
            playerCtrl.setPlayerCoin(diamond);
            playerCtrl.setPlayerStateValue(DataDef_1.EnumPlayStatus.WATCH);
            playerCtrl.setPlayerStatePerformance();
        }
        ;
    };
    TpGameCtrl.prototype.dealPlayerOfflineNotifyMsg = function (notify) {
        var seat = notify.seat;
        var offline = notify.offline;
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("dealPlayerOfflineNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerOffLineActive(offline);
        }
        ;
    };
    TpGameCtrl.prototype.dealChangeRoomMsg = function (notify) {
        var conf = notify.conf;
        var forceJump = notify.forceJump;
        var matching = notify.matching;
        var scene = notify.scene;
        this.unscheduleAllCallbacks();
        this.destroyAllSendCard();
        this.destroyAllChips();
        this.destroyAllPlayers();
        this.destroyCompareCardLine();
        this.destroyCompareCardToast();
        this.destroyCompareCardVS();
        this.hintCtrl.setHintActive(false);
        this.rechargeToastCtrl.setRechargeToastActive(false);
        this.tableInfoCtrl.setTableInfoNodeActive(false);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
        this.totalChipsCtrl.setTotalChipsAmount(0);
        this.roundInfoCtrl.setRoundInfoRound(0);
        this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
        this.msgToastCtrl.setMsgToastActive(false);
        this.tableInfoToastCtrl.setTableInfoToastActive(false);
        this.setOwnPlayerSeat(-1);
        this.setCurOptPlayerSeat(-1);
        this.setNormalPlayerNumber(0);
        this.luckyPlayerCtrl.setLuckyPlayerActive(false);
        this.btn_recharge.active = false;
        var maxBlinds = conf.blind ? "Always Blind" : "4";
        var tableInfo = {
            bootAmount: conf.cellScore / 100,
            chaalLimit: conf.maxJetton / 100,
            maxBlinds: maxBlinds,
            potLimit: conf.maxTableJetton / 100,
        };
        this.tableInfoCtrl.setTableInfoData(tableInfo);
        this.tableInfoCtrl.setTableInfoNodeActive(true);
        this.tableInfoToastCtrl.setTableInfoToastData(tableInfo);
        this.waitStartTipCtrl.setWaitStartTipActive(true);
        // //@ts-ignore
        // if (GlobalCfg.server_id == "2" || GlobalCfg.server_id == "22" || GlobalCfg.server_id == "0" || GlobalCfg.server_id == "21") {
        //     this.addCashCtrl.setAddCashStyle(conf.trial ? EnumAddCashType.PRACTICE : EnumAddCashType.CASH, conf);
        // };
        if (scene) {
            this.dealGameSceneMsg(scene);
        }
        ;
    };
    TpGameCtrl.prototype.dealPreparePaymentNotifyMsg = function (notify) {
        var timeoutMs = notify.timeoutMs;
        var seat = notify.seat;
        var payment = notify.payment;
        var winRate = notify.winRate;
        //@ts-ignore
        cc.sys.localStorage.setItem("TP_winRate", notify.winRate);
        var time = Math.floor(timeoutMs / 1000);
        this.setCurOptPlayerSeat(seat);
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("dealPreparePaymentNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerActTime(time);
            playerCtrl.setPlayerShopActive(true);
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == seat) {
            this.actBtnsCtrl.setActBtnsRechargeData(payment, time, winRate);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(time);
            this.btn_recharge.active = time > 0;
            this.isRechargeStatus = true;
        }
        ;
    };
    TpGameCtrl.prototype.dealPaymentFinishNotifyMsg = function (notify) {
        var seat = notify.seat;
        var timeoutMs = notify.timeoutMs;
        var actionMask = notify.actionMask;
        var time = Math.floor(timeoutMs / 1000);
        this.setCurOptPlayerSeat(seat);
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("dealPaymentFinishNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == seat) {
            var actValueArr = this.getCanActValueArrByActMask(actionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        }
        ;
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerActTime(time);
            playerCtrl.setPlayerShopActive(false);
        }
        ;
    };
    TpGameCtrl.prototype.dealShortMessageNotifyMsg = function (notify) {
        var msgType = notify.msgType;
        switch (msgType) {
            case 0:
                this.dealShortMessageForWord(notify);
                break;
            case 1:
                this.dealShortMessageForFace(notify);
                break;
            case 2:
                this.dealShortMessageForGift(notify);
                break;
            default:
                break;
        }
    };
    TpGameCtrl.prototype.dealUpdateCoinNotifyMsg = function (notify) {
        var seat = notify.seat;
        var diamond = notify.diamond;
        var reason = notify.reason;
        var posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log("dealUpdateCoinNotifyMsg\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! seat: " + seat);
            return;
        }
        ;
        var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            var playerCtrl = playerNode.getComponent(PlayerCtrl_1.default);
            playerCtrl.setPlayerCoin(diamond);
        }
        ;
    };
    TpGameCtrl.prototype.dealShortMessageForWord = function (notify) {
        var target = notify.target;
        var sender = notify.sender;
        var price = notify.price;
        var senderAfter = notify.senderAfter;
        var name = notify.name;
        var senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log("dealShortMessageForWord\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! sender: " + sender);
            return;
        }
        ;
        var senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            var senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl_1.default);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        }
        ;
        //@ts-ignore
        CommonFun.getInstance().playGameWordInteraction(0, name, senderPlayerNode, cc.v2(120, 110));
    };
    TpGameCtrl.prototype.dealShortMessageForFace = function (notify) {
        var target = notify.target;
        var sender = notify.sender;
        var price = notify.price;
        var senderAfter = notify.senderAfter;
        var name = notify.name;
        var senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log("dealShortMessageForFace\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! sender: " + sender);
            return;
        }
        ;
        var senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            var senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl_1.default);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        }
        ;
        //@ts-ignore
        CommonFun.getInstance().playGameWordInteraction(1, name, senderPlayerNode, cc.v2(0, 120));
    };
    TpGameCtrl.prototype.dealShortMessageForGift = function (notify) {
        var target = notify.target;
        var sender = notify.sender;
        var price = notify.price;
        var senderAfter = notify.senderAfter;
        var name = notify.name;
        var targetNodeArr = [];
        var senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log("dealShortMessageForGift\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! sender: " + sender);
            return;
        }
        ;
        var senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            var senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl_1.default);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        }
        ;
        if (target == -1) {
            for (var i = 0; i < 5; i++) {
                if (sender != i) {
                    var posNodeIndex = this.getPosNodeIndexByPlayerSeat(i);
                    var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
                    if (playerNode) {
                        targetNodeArr.push(playerNode);
                    }
                    ;
                }
                ;
            }
        }
        else {
            var posNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
            if (posNodeIndex == -1) {
                console.log("dealShortMessageForGift\uFF0C\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u73A9\u5BB6\u5EA7\u4F4D\u53F7\u4E0D\u5B58\u5728! target: " + target);
                return;
            }
            ;
            var playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                targetNodeArr.push(playerNode);
            }
            ;
        }
        ;
        //@ts-ignore
        CommonFun.getInstance().playGameGifInteraction(name, senderPlayerNode, targetNodeArr);
    };
    TpGameCtrl.prototype.dealMenuClickOutToLobbyMsg = function (notify) {
        //@ts-ignore
        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
    };
    TpGameCtrl.prototype.dealMenuClickSwitchTableMsg = function (notify) {
        //@ts-ignore
        GameServerManager.send("gameservice.changeroom", "ChangeRoomAck", {});
    };
    TpGameCtrl.prototype.dealMenuClickHowToPlayMsg = function (notify) {
        //@ts-ignore
        CommonFun.getInstance().showRule("tpGame");
    };
    TpGameCtrl.prototype.dealLuckyPlayerClickGetMsg = function (notify) {
        if (!notify) {
            return;
        }
        ;
        var plotOffset = notify.plotOffset;
        var after = plotOffset.after;
        var roomId = plotOffset.jumpSpace;
        var ownPlayerNode = this.getPlayerNodeByPosIndex(0);
        if (ownPlayerNode) {
            var ownPlayerCtrl = ownPlayerNode.getComponent(PlayerCtrl_1.default);
            ownPlayerCtrl.setPlayerCoin(after);
        }
        ;
        if (roomId == -1) {
            //@ts-ignore
            GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
        }
        ;
        this.destroyAllPlayers();
        //@ts-ignore
        GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
            id: roomId
        });
    };
    TpGameCtrl = __decorate([
        ccclass,
        menu('tpGame/TpGameCtrl')
    ], TpGameCtrl);
    return TpGameCtrl;
}(cc.Component));
exports.default = TpGameCtrl;
;

cc._RF.pop();