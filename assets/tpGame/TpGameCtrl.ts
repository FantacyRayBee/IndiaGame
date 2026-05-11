import { ActBtnsCtrl } from "./ActBtns/ActBtnsCtrl";
import { TableInfoCtrl, ITableInfo } from "./TableInfo/TableInfoCtrl";
import { TotalChipsCtrl } from "./TotalChips/TotalChipsCtrl";
import { EnumAddCashType, EnumBattleStatus, EnumBetBtnStr, EnumCatchChip, EnumLeaveReason, EnumMsgToastStyle, EnumPlayStatus, EnumPlayerKuangType, EnumPrefabPath, EnumSetFinishReason, EnumShowBtnStr, EnumTableStatus, IAnswerCompareNotify, IAskChipNotify, IChangeRoomAck, ICompareCardToastInfo, IDestroyAndMatchingNotify, IEnterLvAck, IExitGameAck, IGameOverNotify, IGameSceneNotify, IGameStartNotify, IGameStartPlayer, ILaunchCompareNotify, ILoginAck, IPaymentFinishNotify, IPlayerChipNotify, IPlayerDropNotify, IPlayerJoinNotify, IPlayerLeaveNotify, IPlayerLookNotify, IPlayerOfflineNotify, IPlotOffset, IPreparePaymentNotify, IReceiveFreeTrialAck, IScenePlayerInfo, IShortMessageNotify, IUpdateCoinNotify } from "./DataDef";
import PlayerCtrl from "./Player/PlayerCtrl";
import HandCardsCtrl from "./HandCards/HandCardsCtrl";
import CompareCardToastCtrl from "./CompareCard/CompareCardToastCtrl";
import CompareCardVSCtrl from "./CompareCard/CompareCardVSCtrl";
import BetInfoCtrl from "./BetInfo/BetInfoCtrl";
import ChipCtrl from "./Chip/ChipCtrl";
import CompareCardLineCtrl from './CompareCard/CompareCardLineCtrl';
import RechargeToastCtrl from "./RechargeToast/RechargeToastCtrl";
import HintCtrl from "./Hint/HintCtrl";
import RoundInfoCtrl from "./RoundInfo/RoundInfoCtrl";
import OwnRechargeTipCtrl from "./RechargeToast/OwnRechargeTipCtrl";
import MsgToastCtrl from "./MsgToast/MsgToastCtrl";
import TableInfoToastCtrl from "./TableInfo/TableInfoToastCtrl";
import WaitStartTipCtrl from "./WaitStartTip/WaitStartTipCtrl";
import TpGameAudioCtrl from "./TpGameAudioCtrl";
import AddCashCtrl from "./AddCash/AddCashCtrl";
import LuckyPlayerCtrl from "./LuckyPlayer/LuckyPlayerCtrl";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/TpGameCtrl')
export default class TpGameCtrl extends cc.Component {

    private serverMsgHandle = null;
    private clientMsgHandle = null;

    /**
     * 音频控制
     */
    public tpGameAudioCtrl: TpGameAudioCtrl = null;
    /**
     * 发牌父节点
     */
    private sendCardParent: cc.Node = null;
    /**
     * 筹码父节点
     */
    private chipParent: cc.Node = null;
    /**
     * 充值按钮
     */
    private btn_recharge: cc.Node = null;
    /**
     * 总下注池位置坐标
     */
    private totalChipsPos = cc.v2(0, 150);
    /**
     * 总下注池控制脚本
     */
    private totalChipsCtrl: TotalChipsCtrl = null;
    /**
     * 等待开始提示框的控制脚本
     */
    private waitStartTipCtrl: WaitStartTipCtrl = null;
    /**
     * 轮次信息控制脚本
     */
    private roundInfoCtrl: RoundInfoCtrl = null;
    /**
     * 牌桌信息控制脚本
     */
    private tableInfoCtrl: TableInfoCtrl = null;
    /**
     * 牌桌信息弹框控制脚本
     */
    private tableInfoToastCtrl: TableInfoToastCtrl = null;
    /**
     * 自己玩家操作按钮控制脚本
     */
    private actBtnsCtrl: ActBtnsCtrl = null;
    /**
     * 充值弹框的控制脚本
     */
    public rechargeToastCtrl: RechargeToastCtrl = null;
    /**
     * Hint界面的控制脚本
     */
    public hintCtrl: HintCtrl = null;
    /**
     * 自己充值提示的控制脚本
     */
    public ownRechargeTipCtrl: OwnRechargeTipCtrl = null;
    /**
     * 消息提示框的控制脚本
     */
    public msgToastCtrl: MsgToastCtrl = null;
    /**
     * 幸运玩家控制脚本
     */
    public luckyPlayerCtrl: LuckyPlayerCtrl = null;
    /**
     * 充值界面的控制脚本
     */
    public addCashCtrl: AddCashCtrl = null;
    /**
     * 比牌弹框的节点
     */
    private compareCardToastNode: cc.Node = null;
    /**
     * 比牌连线的节点
     */
    private compareCardLineNode: cc.Node = null;
    /**
     * 比牌VS的节点
     */
    private compareCardVSNode: cc.Node = null;
    /**
     * 自己玩家的pid
     */
    private ownPlayerPid = -1;
    /**
     * 自己玩家的座位号
     */
    private ownPlayerSeat = -1;
    /**
     * 玩家位置节点数组
     */
    private posNodeArr: cc.Node[] = [];
    /**
     * 玩家座位号和玩家位置索引映射表
     */
    private seatPosNodeIndexMap: Map<number, number> = new Map();
    /**
     * 预设体映射表
     */
    private prefabMap: Map<EnumPrefabPath, cc.Prefab> = new Map();
    /**
     * 玩家节点池
     */
    private playerNodePool: cc.NodePool = new cc.NodePool();
    /**
     * 手牌节点池
     */
    private handCardsNodePool: cc.NodePool = new cc.NodePool();
    /**
     * 玩家下注信息节点池
     */
    private betInfoNodePool: cc.NodePool = new cc.NodePool();
    /**
     * 筹码节点池
     */
    private chipNodePool: cc.NodePool = new cc.NodePool();
    /**
     * 发牌节点池
     */
    private singleCardPool: cc.NodePool = new cc.NodePool();
    /**
     * 游戏是否切入到后台
     */
    private isGameEventHideStutas: boolean = false;
    /**
     * 当前操作玩家的座位号
     */
    private curOptPlayerSeat: number = -1;
    /**
     * 正常状态玩家的数量
     */
    private normalPlayerNumber: number = 0;
    /**
     * 默认的操作时间
     */
    private defaultOptTime = 15;

    /**
     * 是否充值状态
     */
    private isRechargeStatus = false;

    onLoad() {
        this.setPosNodeArr();
        this.setChipParent();
        this.setSendCardParent();
        this.setAudioCtrl();

        this.setPrefabMap()
        .then((prefabArr) => {
            this.addTableInfo();
            this.addActBtns();
            this.addTotalChips();
            this.addWaitStartTip();
            this.addOwnRechargeTip();
            this.addRechargeToast();
            this.addHintToast();
            this.addRoundInfo();
            this.addMsgToast();
            this.addTableInfoToast();
            // this.addAddCash();
            this.addLuckyPlayer();

            this.initPlayerNodePool();
            this.initHandCardsNodePool();
            this.initBetInfoNodePool();
            this.initChipNodePool();
            this.initSingleCardPool();

            this.setOnGameEvent();
        })
        .then(() => {
            //@ts-ignore
            GameServerManager.send("gameservice.login", "LoginReq", {
                //@ts-ignore
                userid: GlobalCfg.USER_DATAS.userId,
                //@ts-ignore
                token: GlobalCfg.USER_DATAS.token,
                //@ts-ignore
                fromid: GlobalCfg.PRODUCT_ID
            });
        })

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
        CommonFun.getInstance().hideSelectRoom(true);
        //@ts-ignore
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_TP_GAME);
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.stopMusic();
        //@ts-ignore
        CommonFun.getInstance().hidProgress();
        //@ts-ignore
        GlobalCfg.ACT_SCENE_CTRL = this;
        //@ts-ignore
        cc.sys.localStorage.setItem(`ENTERED_TP_GAME_${GlobalCfg.USER_DATAS.userId}`, "true");

        this.btn_recharge = this.node.getChildByName("btn_recharge");
        //@ts-ignore
        this.btn_recharge.on("click", CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.btn_recharge.getComponent(cc.Animation).play("drop");
        //@ts-ignore
        GlobalCfg.isPayGame = false;
    }

    onDestroy() {
        //@ts-ignore
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.serverMsgHandle);
        //@ts-ignore
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.clientMsgHandle);
        //@ts-ignore
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_TP_GAME);
        //@ts-ignore
        GlobalCfg.ACT_SCENE_CTRL = null;
        //@ts-ignore
        GlobalCfg.isPayGame = true;
    }

    /**
     * 设置监听游戏切入后台/前台事件
     */
    setOnGameEvent() {
        /**
         * 游戏切入后台事件
         */
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.isGameEventHideStutas = true;

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
            this.waitStartTipCtrl.setWaitStartTipActive(false);
            this.luckyPlayerCtrl.setLuckyPlayerActive(false);
            this.btn_recharge.active = false;
        }, this);

        /**
         * 游戏切回前台事件
         */
        cc.game.on(cc.game.EVENT_SHOW, () => {
            if (this.isGameEventHideStutas === false) {
                return;
            };
            this.isGameEventHideStutas = false;

            //@ts-ignore
            GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
        }, this);
    }

    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
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
    }

    dealBtnChatEvent() {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == -1) {
            //@ts-ignore
            CommonFun.getInstance().showTips(`not in table`);
            return;
        };
        //@ts-ignore
        CommonFun.getInstance().showGameWordInteraction(ownPlayerSeat);
    }

    dealBtnRechargeEvent() {
        //@ts-ignore
        CommonFun.getInstance().showBankruptcy(true, true);
    }

    /**
     * 实例化玩家节点对象池
     */
    initPlayerNodePool() {
        let playerPrefab = this.getPrefabByPath(EnumPrefabPath.PLAYER);
        for (let i = 0; i < 5; i++) {
            let playerNode = cc.instantiate(playerPrefab);
            this.playerNodePool.put(playerNode);
        };
    }

    /**
     * 从玩家节点对象池中获取玩家节点
     * @returns 玩家节点
     */
    getPlayerNodeFromPool() {
        let playerNode: cc.Node = null;
        if (this.playerNodePool.size() > 0) {
            playerNode = this.playerNodePool.get();
        } 
        else {
            let playerPrefab = this.getPrefabByPath(EnumPrefabPath.PLAYER);
            playerNode = cc.instantiate(playerPrefab);
        };
        playerNode.getComponent(PlayerCtrl).initPlayer();
        return playerNode;
    }

    /**
     * 将玩家节点回收到玩家节点对象池中
     * @param playerNode 玩家节点
     */
    putPlayerNodePool(playerNode: cc.Node) {
        playerNode.getComponent(PlayerCtrl).initPlayer();
        this.playerNodePool.put(playerNode);
    }

    /**
     * 初始化手牌节点对象池
     */
    initHandCardsNodePool() {
        let handCardsPrefab = this.getPrefabByPath(EnumPrefabPath.HANDCARDS);
        for (let i = 0; i < 5; i++) {
            let handCardsNode = cc.instantiate(handCardsPrefab);
            this.handCardsNodePool.put(handCardsNode);
        };
    }

    /**
     * 从手牌节点对象池中获取手牌节点
     * @returns 手牌节点
     */
    getHandCardsNodeFromPool() {
        let handCardsNode: cc.Node = null;
        if (this.handCardsNodePool.size() > 0) {
            handCardsNode = this.handCardsNodePool.get();
        } 
        else {
            let handCardsPrefab = this.getPrefabByPath(EnumPrefabPath.HANDCARDS);
            handCardsNode = cc.instantiate(handCardsPrefab);
        };
        handCardsNode.getComponent(HandCardsCtrl).initHandCards();
        return handCardsNode;
    }

    /**
     * 将手牌节点回收到手牌节点对象池中
     * @param handCardsNode 手牌节点
     */
    putHandCardsNodePool(handCardsNode: cc.Node) {
        this.handCardsNodePool.put(handCardsNode);
    }

    /**
     * 初始化下注信息节点对象池
     */
    initBetInfoNodePool() {
        let betInfoPrefab = this.getPrefabByPath(EnumPrefabPath.BETINFO);
        for (let i = 0; i < 5; i++) {
            let betInfoNode = cc.instantiate(betInfoPrefab);
            this.betInfoNodePool.put(betInfoNode);
        };
    }

    /**
     * 从下注信息节点对象池中获取下注信息节点
     * @returns 下注信息节点
     */
    getBetInfoNodeFromPool() {
        let betInfoNode: cc.Node = null;
        if (this.betInfoNodePool.size() > 0) {
            betInfoNode = this.betInfoNodePool.get();
        } 
        else {
            let betInfoPrefab = this.getPrefabByPath(EnumPrefabPath.BETINFO);
            betInfoNode = cc.instantiate(betInfoPrefab);
        };
        betInfoNode.getComponent(BetInfoCtrl).initBetInfo();
        return betInfoNode;
    }

    /**
     * 将下注信息节点回收到下注信息节点对象池中
     * @param betInfoNode 下注信息节点
     */
    putBetInfoNodePool(betInfoNode: cc.Node) {
        this.betInfoNodePool.put(betInfoNode);
    }

    /**
     * 初始化筹码节点对象池
     */
    initChipNodePool() {
        let chipPrefab = this.getPrefabByPath(EnumPrefabPath.CHIP);
        for (let i = 0; i < 25; i++) {
            let chipNode = cc.instantiate(chipPrefab);
            this.chipNodePool.put(chipNode);
        };
    }

    /**
     * 从筹码节点对象池中获取筹码节点
     * @returns 获取筹码节点
     */
    getChipNodeFromPool() {
        let chipNode: cc.Node = null;
        if (this.chipNodePool.size() > 0) {
            chipNode = this.chipNodePool.get();
        } 
        else {
            let chipPrefab = this.getPrefabByPath(EnumPrefabPath.CHIP);
            chipNode = cc.instantiate(chipPrefab);
        };
        return chipNode;
    }

    /**
     * 获取筹码节点坐标
     * @returns 筹码节点坐标
     */
    getChipNodePosition() {
        let posX = 0;
        let posY = 50;
        let randomX = Math.random() * (360) - 180;
        let randomY = Math.random() * (100) - 50;
        return cc.v3(posX + randomX, posY + randomY);
    }

    /**
     * 将筹码节点回收到筹码节点对象池中
     * @param chipNode 筹码节点
     */
    putChipNodePool(chipNode: cc.Node) {
        this.chipNodePool.put(chipNode);
    }


    initSingleCardPool() {
        let singleCardPrefab = this.getPrefabByPath(EnumPrefabPath.SINGLECARD);
        for (let i = 0; i < 15; i++) {
            let singleCardNode = cc.instantiate(singleCardPrefab);
            this.singleCardPool.put(singleCardNode);
        };
    }

    /**
     * 获取单张牌节点
     * @returns 单张牌节点
     */
    getSingleCardNodeFromPool() {
        let singleCardNode: cc.Node = null;
        if (this.singleCardPool.size() > 0) {
            singleCardNode = this.singleCardPool.get();
        } 
        else {
            let singleCardPrefab = this.getPrefabByPath(EnumPrefabPath.SINGLECARD);
            singleCardNode = cc.instantiate(singleCardPrefab);
        };
        return singleCardNode;
    }

    /**
     * 将单张牌节点回收到单张牌节点对象池中
     * @param singleCardNode 单张牌节点
     */
    putSingleCardNodePool(singleCardNode: cc.Node) {
        this.singleCardPool.put(singleCardNode);
    }


    setPrefabMap() {
        let prefabPathArr = [
            EnumPrefabPath.TABLEINFO,
            EnumPrefabPath.TABLEINFOTOAST,
            EnumPrefabPath.ACTBTNS,
            EnumPrefabPath.TOTALCHIPS,
            EnumPrefabPath.PLAYER,
            EnumPrefabPath.HANDCARDS,
            EnumPrefabPath.COMPARECARDTOAST,
            EnumPrefabPath.COMPARECARDVS,
            EnumPrefabPath.COMPARECARDLINE,
            EnumPrefabPath.BETINFO,
            EnumPrefabPath.CHIP,
            EnumPrefabPath.RECHARGETOAST,
            EnumPrefabPath.OWNRECHARGETIP,
            EnumPrefabPath.HINT,
            EnumPrefabPath.ROUNDLINFO,
            EnumPrefabPath.MSGTOAST,
            EnumPrefabPath.WAITSTARTTIP,
            EnumPrefabPath.SINGLECARD,
            EnumPrefabPath.ADDCASH,
            EnumPrefabPath.LUCKYPLAYER,
        ];
        let promiseArr: Promise<cc.Prefab>[] = [];
        for (let i = 0, len = prefabPathArr.length; i < len; i++) {
            let prefabPath = prefabPathArr[i];
            let loadPrefabPromise = this.loadPrefabByPromise(prefabPath);
            promiseArr.push(loadPrefabPromise);
        };
        return Promise.all(promiseArr)
        .then((prefabArr) => {
            for (let i = 0, len = prefabPathArr.length; i < len; i++) {
                let prefabPath = prefabPathArr[i];
                this.prefabMap.set(prefabPath, prefabArr[i]);
            };
            return prefabArr;
        });
    }

    /**
     * 根据路径获取预置体对象。
     * 
     * 该函数通过给定的路径从预置映射中检索预置对象。如果路径存在于映射中， 
     * 则返回对应的预置对象；如果路径不存在，则返回null。
     * 
     * @param path 使用EnumPrefabPath枚举类型的路径参数，指定要获取的预置对象的路径。
     * @returns 返回从给定路径获取到的预置对象，如果路径不存在则返回null。
     */
    getPrefabByPath(path: EnumPrefabPath) {
        if (!this.prefabMap.has(path)) {
            return null;
        };
        return this.prefabMap.get(path);
    }

    /**
     * 根据玩家动作掩码获取可以操作的动作码数组。
     * 0空，1看牌，2跟注，4加注，8比牌，16弃牌，32同意比牌。
     * @param actMask 玩家动作掩码
     * @returns 返回可以操作的动作码数组
     */
    getCanActValueArrByActMask(actMask: number) {
        let havedActionArr: number[] = [];
        let actionArr = [1, 2, 4, 8, 16, 32];
        for (let i = 0, len = actionArr.length; i < len; i++) {
            let tempAct = actionArr[i];
            let canAction = actMask & tempAct;
            if (actionArr.indexOf(canAction) != -1 && havedActionArr.indexOf(canAction) == -1) {
                havedActionArr.push(canAction);
            };
        };
        return havedActionArr;
    }

    setChipParent() {
        this.chipParent = this.node.getChildByName("ChipParent");
    }

    /**
     * 获取筹码父节点
     * @returns 筹码父节点
     */
    getChipParent() {
        return this.chipParent;
    }

    setSendCardParent() {
        this.sendCardParent = this.node.getChildByName("SendCardParent");
    }

    setAudioCtrl() {
        this.tpGameAudioCtrl = this.node.getComponent(TpGameAudioCtrl);
    }

    /**
     * 获取发牌父节点
     * @returns 发牌父节点
     */
    getSendCardParent() {
        return this.sendCardParent;
    }

    /**
     * 设置玩家位置节点数组
     */
    setPosNodeArr() {
        for (let i = 0; i < 5; i++) {
            let posNode = this.node.getChildByName(`Pos${i}`);
            this.posNodeArr.push(posNode);
        };
    }

    /**
     * 通过位置索引获取位置节点
     * @param index 位置节点的索引
     * @returns 返回对应的位置节点
     */
    getPosNodeByIndex(index: number) {
        return this.posNodeArr[index];
    }

    /**
     * 添加玩家节点到对应的位置节点上
     * @param index 位置索引
     * @returns 返回对应的玩家节点
     */
    addPlayerNodeByPosIndex(index: number) {
        this.destroyPlayerNodeByPosIndex(index);
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let playerParent = posNode.getChildByName("PlayerParent");
            let playerNode = this.getPlayerNodeFromPool();
            playerNode.name = "Player";
            playerParent.addChild(playerNode);
            return playerNode;
        };
        return null;
    }

    /**
     * 获取对应位置索引的玩家节点
     * @param index 位置索引
     * @returns 返回对应的玩家节点
     */
    getPlayerNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let playerParent = posNode.getChildByName("PlayerParent");
            let playerNode = playerParent.getChildByName("Player");
            return playerNode;
        };
        return null;
    }

    /**
     * 删除对应的位置节点上的玩家节点
     * @param index 位置索引
     */
    destroyPlayerNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let playerParent = posNode.getChildByName("PlayerParent");
            let playerNode = playerParent.getChildByName("Player");
            if (playerNode) {
                this.putPlayerNodePool(playerNode);
            };
        };
    }

    /**
     * 添加手牌节点到对应的位置节点上
     * @param index 位置索引
     * @returns 返回对应的手牌节点
     */
    addHandCardsNodeByPosIndex(index: number) {
        this.destroyHandCardsNodeByPosIndex(index);
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let handCardsParent = posNode.getChildByName("HandCardsParent");
            let handCardsNode = this.getHandCardsNodeFromPool();
            handCardsNode.name = "HandCards";
            handCardsParent.addChild(handCardsNode);
            return handCardsNode;
        };
        return null;
    }

    /**
     * 获取对应位置索引的手牌节点
     * @param index 位置索引
     * @returns 返回对应的手牌节点
     */
    getHandCardsNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let handCardsParent = posNode.getChildByName("HandCardsParent");
            let HandCardsNode = handCardsParent.getChildByName("HandCards");
            return HandCardsNode;
        };
        return null;
    }

    /**
     * 删除对应的位置节点上的手牌节点
     * @param index 位置索引
     */
    destroyHandCardsNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let handCardsParent = posNode.getChildByName("HandCardsParent");
            let handCardsNode = handCardsParent.getChildByName("HandCards");
            if (handCardsNode) {
                this.putHandCardsNodePool(handCardsNode);
            };
        };
    }

    /**
     * 根据位置索引添加赌注信息节点。
     * 首先尝试销毁该位置上已存在的赌注信息节点，然后根据索引获取位置节点。
     * 如果找到位置节点，会在其下创建一个新的赌注信息节点，并返回该新节点。
     * 
     * @param index 位置索引，用于标识要添加赌注信息节点的具体位置。
     * @return 返回新创建的赌注信息节点，如果未成功创建则返回null。
     */
    addBetInfoNodeByPosIndex(index: number) {
        this.destroyBetInfoNodeByPosIndex(index);
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let betInfoParent = posNode.getChildByName("BetInfoParent");
            let betInfoNode = this.getBetInfoNodeFromPool();
            betInfoNode.name = "BetInfo";
            betInfoParent.addChild(betInfoNode);
            return betInfoNode;
        };
        return null;
    }

    /**
     * 根据位置索引获取投注信息节点。
     * @param index 位置索引，用于定位到具体的投注信息。
     * @returns 返回找到的投注信息节点，如果未找到则返回null。
     */
    getBetInfoNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let betInfoParent = posNode.getChildByName("BetInfoParent");
            let betInfoNode = betInfoParent.getChildByName("BetInfo");
            return betInfoNode;
        };
        return null;
    }

    /**
     * 根据位置索引销毁投注信息节点。
     * 该方法寻找指定索引位置的节点，并销毁该位置上投注信息父节点的所有子节点。
     * @param index 位置索引
     */
    destroyBetInfoNodeByPosIndex(index: number) {
        let posNode = this.getPosNodeByIndex(index);
        if (posNode) {
            let betInfoParent = posNode.getChildByName("BetInfoParent");
            let betInfoNode = betInfoParent.getChildByName("BetInfo");
            if (betInfoNode) {
                this.putBetInfoNodePool(betInfoNode);
            };
        };
    }

    /**
     * 添加牌桌信息到当前节点。
     */
    addTableInfo() {
        let tableInfoPrefab = this.getPrefabByPath(EnumPrefabPath.TABLEINFO);
        let tableInfoNode = cc.instantiate(tableInfoPrefab);
        this.node.addChild(tableInfoNode);
        this.tableInfoCtrl = tableInfoNode.getComponent(TableInfoCtrl);
        this.tableInfoCtrl.initTpGameCtrl(this);
    }

    /**
     * 添加自己玩家动作按钮到当前节点。
     */
    addActBtns() {
        let actBtnsPrefab = this.getPrefabByPath(EnumPrefabPath.ACTBTNS);
        let actBtnsNode = cc.instantiate(actBtnsPrefab);
        this.node.addChild(actBtnsNode);
        this.actBtnsCtrl = actBtnsNode.getComponent(ActBtnsCtrl);
        this.actBtnsCtrl.initActBtns(this);
        this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
    }

    /**
     * 添加总计筹码组件到当前节点
     */
    addTotalChips() {
        let totalChipsPrefab = this.getPrefabByPath(EnumPrefabPath.TOTALCHIPS);
        let totalChipsNode = cc.instantiate(totalChipsPrefab);
        totalChipsNode.setPosition(this.totalChipsPos);
        this.node.addChild(totalChipsNode);
        this.totalChipsCtrl = totalChipsNode.getComponent(TotalChipsCtrl);
        this.totalChipsCtrl.setTotalChipsAmount(0);
    }

    /**
     * 添加等待开始提示框组件到当前节点
     */
    addWaitStartTip() {
        let waitStartTipPrefab = this.getPrefabByPath(EnumPrefabPath.WAITSTARTTIP);
        let waitStartTipNode = cc.instantiate(waitStartTipPrefab);
        this.node.addChild(waitStartTipNode);
        this.waitStartTipCtrl = waitStartTipNode.getComponent(WaitStartTipCtrl);
        this.waitStartTipCtrl.setWaitStartTipActive(false);
    }

    /**
     * 添加充值提示框组件到当前节点
     */
    addRechargeToast() {
        let rechargeToastPrefab = this.getPrefabByPath(EnumPrefabPath.RECHARGETOAST);
        let rechargeToastNode = cc.instantiate(rechargeToastPrefab);
        this.node.addChild(rechargeToastNode);
        this.rechargeToastCtrl = rechargeToastNode.getComponent(RechargeToastCtrl);
        this.rechargeToastCtrl.setRechargeToastActive(false);
    }

    /**
     * 添加Hint提示框组件到当前节点
     */
    addHintToast() {
        let hintToastPrefab = this.getPrefabByPath(EnumPrefabPath.HINT);
        let hintToastNode = cc.instantiate(hintToastPrefab);
        this.node.addChild(hintToastNode);
        this.hintCtrl = hintToastNode.getComponent(HintCtrl);
        this.hintCtrl.setHintActive(false);
    }

    /**
     * 添加轮次信息组件到当前节点
     */
    addRoundInfo() {
        let roundInfoPrefab = this.getPrefabByPath(EnumPrefabPath.ROUNDLINFO);
        let roundInfoNode = cc.instantiate(roundInfoPrefab);
        this.node.addChild(roundInfoNode);
        this.roundInfoCtrl = roundInfoNode.getComponent(RoundInfoCtrl);
        this.roundInfoCtrl.setRoundInfoRound(0);
    }

    /**
     * 添加自己充值提示框组件到当前节点
     */
    addOwnRechargeTip() {
        let ownRechargeTipPrefab = this.getPrefabByPath(EnumPrefabPath.OWNRECHARGETIP);
        let ownRechargeTipNode = cc.instantiate(ownRechargeTipPrefab);
        this.node.addChild(ownRechargeTipNode);
        this.ownRechargeTipCtrl = ownRechargeTipNode.getComponent(OwnRechargeTipCtrl);
        this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
    }

    /**
     * 添加消息提示框组件到当前节点
     */
    addMsgToast() {
        let msgToastPrefab = this.getPrefabByPath(EnumPrefabPath.MSGTOAST);
        let msgToastNode = cc.instantiate(msgToastPrefab);
        this.node.addChild(msgToastNode);
        this.msgToastCtrl = msgToastNode.getComponent(MsgToastCtrl);
        this.msgToastCtrl.setMsgToastActive(false);
    }

    /**
     * 添加牌桌信息提示框组件到当前节点
     */
    addTableInfoToast() {
        let tableInfoToastPrefab = this.getPrefabByPath(EnumPrefabPath.TABLEINFOTOAST);
        let tableInfoToastNode = cc.instantiate(tableInfoToastPrefab);
        this.node.addChild(tableInfoToastNode);
        this.tableInfoToastCtrl = tableInfoToastNode.getComponent(TableInfoToastCtrl);
        this.tableInfoToastCtrl.setTableInfoToastActive(false);
    }

    addAddCash() {
        let addCashPrefab = this.getPrefabByPath(EnumPrefabPath.ADDCASH);
        let addCashNode = cc.instantiate(addCashPrefab);
        this.node.addChild(addCashNode);
        this.addCashCtrl = addCashNode.getComponent(AddCashCtrl);
        this.addCashCtrl.setAddCashStyle(EnumAddCashType.NONE, null);
    }

    addLuckyPlayer() {
        let luckyPlayerPrefab = this.getPrefabByPath(EnumPrefabPath.LUCKYPLAYER);
        let luckyPlayerNode = cc.instantiate(luckyPlayerPrefab);
        this.node.addChild(luckyPlayerNode);
        this.luckyPlayerCtrl = luckyPlayerNode.getComponent(LuckyPlayerCtrl);
        this.luckyPlayerCtrl.setLuckyPlayerActive(false);
    }

    /**
     * 显示比牌提示框
     * @param playersInfo 比牌相关的玩家信息
     */
    showCompareCardToast(playersInfo: ICompareCardToastInfo) {
        this.destroyCompareCardToast();
        let compareCardToastPrefab = this.getPrefabByPath(EnumPrefabPath.COMPARECARDTOAST);
        this.compareCardToastNode = cc.instantiate(compareCardToastPrefab);
        this.node.addChild(this.compareCardToastNode);
        let compareCardToastCtrl = this.compareCardToastNode.getComponent(CompareCardToastCtrl);
        compareCardToastCtrl.setCompareCardToastTime(this.defaultOptTime);
        compareCardToastCtrl.setCompareCardToastPlayersInfo(playersInfo);
    }

    /**
     * 销毁比牌提示框
     */
    destroyCompareCardToast() {
        if (this.compareCardToastNode) {
            this.compareCardToastNode.destroy();
            this.compareCardToastNode = null;
        };
    }

    /**
     * 显示比牌VS动画
     */
    showCompareCardVS() {
        this.destroyCompareCardVS();
        let compareCardVSPrefab = this.getPrefabByPath(EnumPrefabPath.COMPARECARDVS);
        this.compareCardVSNode = cc.instantiate(compareCardVSPrefab);
        this.node.addChild(this.compareCardVSNode);
        let compareCardVSCtrl = this.compareCardVSNode.getComponent(CompareCardVSCtrl);
        compareCardVSCtrl.setCompareCardVSAnim();
    }

    /**
     * 销毁比牌VS动画
     */
    destroyCompareCardVS() {
        if (this.compareCardVSNode) {
            this.compareCardVSNode.destroy();
            this.compareCardVSNode = null;
        };
    }


    /**
     * 显示发起比牌的连线动画
     * @param launch 发起比牌玩家的座位号
     * @param target 待接受比牌玩家的座位号
     */
    showCompareCardLine(launch: number, target: number) {
        let launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        let targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);

        let launchPosNode = this.getPosNodeByIndex(launchPosNodeIndex);
        let targetPosNode = this.getPosNodeByIndex(targetPosNodeIndex);
        let launchPosNodeWorldPos = launchPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(launchPosNode.x, launchPosNode.y));
        let targetPosNodeWorldPos = targetPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(targetPosNode.x, targetPosNode.y));
        let launchConvert = this.node.convertToNodeSpaceAR(launchPosNodeWorldPos);
        let targetConvert = this.node.convertToNodeSpaceAR(targetPosNodeWorldPos);

        let temp = launchConvert.sub(targetConvert);
        let dis = Math.abs(temp.mag());
        let midPointPos = cc.v3((launchConvert.x + targetConvert.x) / 2, (launchConvert.y + targetConvert.y) / 2);
        let angle = this.getLiangPosAngle(launchConvert, targetConvert);

        this.destroyCompareCardLine();
        let compareCardLinePrefab = this.getPrefabByPath(EnumPrefabPath.COMPARECARDLINE);
        this.compareCardLineNode = cc.instantiate(compareCardLinePrefab);
        this.node.addChild(this.compareCardLineNode); 
        let compareCardLineCtrl = this.compareCardLineNode.getComponent(CompareCardLineCtrl); 
        compareCardLineCtrl.setCompareCardLinePosition(midPointPos); 
        compareCardLineCtrl.setCompareCardLineRotation(angle);
        compareCardLineCtrl.setCompareCardLinDistance(dis);
        compareCardLineCtrl.setCompareCardLineAnim();
    }


    getLiangPosAngle(start: cc.Vec3, end: cc.Vec3) {
        //计算出朝向
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dir = cc.v3(dx, dy);
        //根据朝向计算出夹角弧度
        let angle = dir.signAngle(cc.v2(1, 0));
        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;
        return -degree;
    }


    destroyCompareCardLine() {
        if (this.compareCardLineNode) {
            this.compareCardLineNode.destroy();
            this.compareCardLineNode = null;
        };
    }

    /**
     * 获取预制体对象
     * @param prefabPath 预制体路径
     * @returns 返回对应的预制体对象
     */
    loadPrefabByPromise(prefabPath: EnumPrefabPath) {
        return new Promise<cc.Prefab>((resolve, reject) => {
            let bundleName = "tpGame";
            let assetBundle = cc.assetManager.getBundle(bundleName);
            if (assetBundle) {
                assetBundle.load(prefabPath, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                    if (!err) {
                        resolve(prefab);
                    }
                    else {
                        reject(err);
                    };
                });
            } 
            else {
                cc.assetManager.loadBundle(`${bundleName}`, (err: Error, bundle: cc.AssetManager.Bundle) => {
                    if (!err) {
                        bundle.load(prefabPath, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                            if (!err) {
                                resolve(prefab);
                            }
                            else {
                                reject(err);
                            };
                        });
                    }
                    else {
                        reject(err);
                    };
                });
            };
        });
    }


    onEventMsg(webData, target) {
        let msgId = webData.msgCode;
        let notify = webData.msgData;
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
                else{
                    this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
                    this.btn_recharge.active = false;
                    this.isRechargeStatus = false;
                    this.refreshOwnDiamond();
                    //@ts-ignore
                    let global = GlobalCfg;
                    if (global.FIRST_RECHARGE_REWARD_SHOW == true){ //首次充值奖励 直接显示奖励弹窗
                        let coin = global.USER_DATAS.lastRecharged / 100; //本次充值获得的金币
                        let getBouns = global.USER_DATAS.firstGetBonus / 100 //本次充值获得的代金券
                        global.FIRST_RECHARGE_REWARD_SHOW = false;
                        if (getBouns > 0) {
                            //@ts-ignore
                            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: coin },{ id: 12, amount: getBouns }]);
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
    }


    // 监听错误消息
    checkWebMsgError(webData, target) {
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `TP游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            //@ts-ignore
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.changeroom") {
            let matching = notify.matching;
            if (matching) {
                return;
            };
            this.waitStartTipCtrl.setWaitStartTipActive(false);
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(() => {
                //@ts-ignore
                window.isNeedShowRummyList = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId == "gameservice.login") {
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(() => {
                //@ts-ignore
                window.isNeedShowRummyList = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId == "gameservice.enterlv") {
            let matching = notify.matching;
            if (matching) {
                return;
            };
            let roomId = notify.forceJump;
            let content = `The gold coins you carry do not meet the event requirements, please enter another event!`;
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(() => {
                //@ts-ignore
                GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
                    id: roomId
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
            let inQueue = notify.inQueue;
            if (inQueue) {
                return;
            };
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(result.message);
            this.msgToastCtrl.setMsgToastStyle(EnumMsgToastStyle.YES);
            this.msgToastCtrl.setMsgToastYesCall(() => {
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
    }

    dealLoginMsg(notify: ILoginAck) {
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
        };

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
        let pid = notify.pid;
        let diamond = notify.diamond;
        let totalPay = notify.totalPay;
        /**
         * roomId为-1表示不在房间中，须用选场的roomId; roomId不为-1表示已在房间中，须用此roomId;
         */
        let roomId = notify.roomId;

        if (roomId == -1) {
            //@ts-ignore
            roomId = GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId;
        };
        if (roomId === undefined || roomId === null) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            return;
        };

        this.setOwnPlayerPid(pid);
        //@ts-ignore
        LoggerUtil.getInstance().error(`caojun GlobalCfg.USER_DATAS.userDiamond = ${GlobalCfg.USER_DATAS.userDiamond}`);
        //@ts-ignore
        let playerNode = this.addPlayerNodeByPosIndex(0);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerKuang(EnumPlayerKuangType.WITHCOIN);
            playerCtrl.setPlayerStyle(0);
            playerCtrl.setPlayerPid(pid);
            //@ts-ignore
            playerCtrl.setPlayerName(GlobalCfg.USER_DATAS.userName);
            //@ts-ignore
            playerCtrl.setPlayerCoin(diamond);
            //@ts-ignore
            playerCtrl.setPlayerHead(GlobalCfg.USER_DATAS.userHeadimgurl);
        };

        //@ts-ignore
        GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
            id: roomId
        });
    }

    dealExitGameMsg(notify: IExitGameAck) {
        window["isNeedShowRoomList"] = "tpGame";
        //@ts-ignore
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
    }

    dealEnterTableMsg(notify: IEnterLvAck) {
        let conf = notify.conf; 
        let forceJump = notify.forceJump;
        let matching = notify.matching;
        let scene = notify.scene;

        this.waitStartTipCtrl.setWaitStartTipActive(true);

        let maxBlinds = conf.blind ? "Always Blind" : "4";
        let tableInfo: ITableInfo = {
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
        };
    }

    dealGameSceneMsg(notify: IGameSceneNotify) {
        let setFlag = notify.setFlag;
        let players = notify.players;
        let chipPool = notify.chipPool;
        let round = notify.round;
        let curSeat = notify.curSeat;
        let matchFinish = notify.matchFinish;

        if (matchFinish) {
            this.tpGameAudioCtrl.playPlayerJoinEffect();
        };

        this.waitStartTipCtrl.setWaitStartTipActive(players.length >= 2 ? false : true);

        this.setCurOptPlayerSeat(curSeat);
        this.roundInfoCtrl.setRoundInfoRound(round);
        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        this.setOwnPlayerSeatByPlayersInfo(players);
        let ownPlayerSeat = this.getOwnPlayerSeat();
        this.setSeatPosNodeIndexMapByOwnPlayerSeat(ownPlayerSeat);
        this.setPlayerCharacterInfoByPlayersInfo(players);
        this.setGameSceneInfo(notify);
    }

    setChipList(chipList: number[]) {
        let chipParent = this.getChipParent();
        for (let i = 0, len = chipList.length; i < len; i++) {
            let chip = chipList[i];
            let chipNode = this.getChipNodeFromPool();
            if (chipNode) {
                let chipNodePos = this.getChipNodePosition();
                let chipCtrl = chipNode.getComponent(ChipCtrl);
                chipCtrl.setChipAmount(chip);
                chipNode.setPosition(chipNodePos);
                chipParent.addChild(chipNode);
            };
        };
    }

    refreshOwnDiamond() {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(ownPlayerSeat);
        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            let betInfoNode = this.getBetInfoNodeByPosIndex(posNodeIndex);
            let betInfo = "0";
            if (betInfoNode) {
                let betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl);
                betInfo = betInfoCtrl.getBetInfoTotalBet();
            };
            //@ts-ignore
            let userDiamond = GlobalCfg.USER_DATAS.userDiamond - (parseFloat(betInfo) * 100);
            playerCtrl.setPlayerCoin(userDiamond);
        };
    }
    /**
     * 设置自己玩家PlayerId
     * @param pid 玩家PlayerId
     */
    setOwnPlayerPid(pid: number) {
        this.ownPlayerPid = pid
    }

    /**
     * 获取自己玩家PlayerId
     * @returns 自己玩家PlayerId
     */
    getOwnPlayerPid() {
        return this.ownPlayerPid;
    }

    /**
     * 设置当前操作玩家的座位号
     * @param seat 座位号
     */
    setCurOptPlayerSeat(seat: number) {
        this.curOptPlayerSeat = seat;
    }

    /**
     * 获取当前操作玩家的座位号，若返回值为-1，则表示没有当前操作玩家的座位号。
     * @returns 当前操作玩家的座位号
     */
    getCurOptPlayerSeat() {
        return this.curOptPlayerSeat;
    }

    /**
     * 设置正常状态的玩家数量
     * @param number 
     */
    setNormalPlayerNumber(number: number) {
        this.normalPlayerNumber = number;
    }

    /**
     * 获取正常状态的玩家数量
     * @returns 正常状态的玩家数量
     */
    getNormalPlayerNumber() {
        return this.normalPlayerNumber;
    }

    /**
     * 通过玩家信息数组设置自己玩家的座位号
     * @param players 场景数据中的玩家信息数组
     */
    setOwnPlayerSeatByPlayersInfo(players: IScenePlayerInfo[]) {
        let ownPlayerPid = this.getOwnPlayerPid();
        for (let i = 0, len = players.length; i < len; i++) {
            let scenePlayerInfo = players[i];
            let seat = scenePlayerInfo.seat;
            let userInfo = scenePlayerInfo.user;
            let playerId = userInfo.playerId;
            if (ownPlayerPid === playerId) {
                this.setOwnPlayerSeat(seat);
                return;
            };
        };
    }

    /**
     * 设置自己玩家的座位号
     * @param seat 玩家座位号
     */
    setOwnPlayerSeat(seat) {
        this.ownPlayerSeat = seat;
    }

    /**
     * 获取自己玩家的座位号
     * @returns 自己玩家的座位号，若返回值为-1，则表示没有自己玩家的座位号。
     */
    getOwnPlayerSeat() {
        return this.ownPlayerSeat;
    }

    /**
     * 通过自己玩家的座位号设置座位号和其对应的位置节点索引的映射关系表
     * @param ownPlayerSeat 自己玩家的座位号
     */
    setSeatPosNodeIndexMapByOwnPlayerSeat(ownPlayerSeat) {
        this.seatPosNodeIndexMap.clear();
        for (let posIndex = 0; posIndex < 5; posIndex++) {
            this.seatPosNodeIndexMap.set((ownPlayerSeat + posIndex) % 5, posIndex);
        };
    }

    /**
     * 通过玩家的座位号获取对应的位置节点索引
     * @param seat 玩家的座位号
     * @returns 对应的位置节点索引, 若返回值为-1，则表示没有找到对应的位置节点索引。
     */
    getPosNodeIndexByPlayerSeat(seat: number) {
        if (this.seatPosNodeIndexMap.has(seat) == false) {
            return -1;
        };
        return this.seatPosNodeIndexMap.get(seat);
    }

    /**
     * 通过玩家信息数组设置玩家的基本信息。如：头像，昵称，金币...
     * @param players 场景数据中的玩家信息数组
     */
    setPlayerCharacterInfoByPlayersInfo(players: IScenePlayerInfo[]) {
        for (let i = 0, len = players.length; i < len; i++) {
            let scenePlayerInfo = players[i];
            let seat = scenePlayerInfo.seat;

            let userInfo = scenePlayerInfo.user;
            let nickname = userInfo.nickname;
            let headUrl = userInfo.imgUrl;
            let diamond = userInfo.diamond;
            let vipLevel = userInfo.vipLevel;

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);

            let playerNode = this.addPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                let playerCtrl = playerNode.getComponent(PlayerCtrl);
                playerCtrl.setPlayerKuang(posNodeIndex == 0 ? EnumPlayerKuangType.WITHCOIN : EnumPlayerKuangType.WITHOUTCOIN);
                playerCtrl.setPlayerStyle(posNodeIndex);
                playerCtrl.setPlayerSeat(seat);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(headUrl);
                playerCtrl.setPlayerCoin(diamond);
            };
        };
    }

    /**
     * 通过场景数据设置场景表现
     * @param notify 服务器下发的场景数据
     */
    setGameSceneInfo(notify: IGameSceneNotify) {
        let status = notify.status;
        switch (status) {
            case EnumTableStatus.WAIT:
                this.setGameSceneInfoForWaitStatus(notify);
                break;
            case EnumTableStatus.RUNNING:
                this.setGameSceneInfoForRunningStatus(notify);
                break;
            case EnumTableStatus.CALCULATE:
                this.setGameSceneInfoForCalculateStatus(notify);
                break;
            default:
                break;
        };
    }

    /**
     * 设置场景状态为准备时的场景信息
     * @param notify 服务器下发的场景数据
     */
    setGameSceneInfoForWaitStatus(notify: IGameSceneNotify) {
        this.setNormalPlayerNumber(0);
        this.tableInfoCtrl.setTableInfoNodeActive(true);
        this.actBtnsCtrl.setActBtnsNodeActive(false);
    }

    /**
     * 设置场景状态为运行时的场景信息
     * @param notify 服务器下发的场景数据
     */
    setGameSceneInfoForRunningStatus(notify: IGameSceneNotify) {
        let players = notify.players;
        //@ts-ignore
        LoggerUtil.getInstance().error("setGameSceneInfoForRunningStatus notplayersify = ", players);
        let banker = notify.banker;
        let curChip = notify.curChip;
        let selfBaseChip = notify.selfBaseChip;
        let curSeat = notify.curSeat;
        let actTime = notify.actTime;
        let duringPaymentSeat = notify.duringPaymentSeat;
        let sourceCompSeat = notify.sourceCompSeat;
        let targetCompSeat = notify.targetCompSeat;
        let plotPayment = notify.plotPayment; 
        let plotWinRate = notify.plotWinRate;
        let chipList = notify.chipList;

        let time = Math.floor(actTime / 1000);

        this.setChipList(chipList);

        let ownPlayerSeat = this.getOwnPlayerSeat();

        let ownPlayerActionMask = 0;
        let ownPlayerLookValue = false;
        let ownPlayerStatus = EnumPlayStatus.NORMAL;
        let normalPlayerNumber = 0;
        for (let i = 0, len = players.length; i < len; i++) {
            let scenePlayerInfo = players[i];
            let seat = scenePlayerInfo.seat; 
            let status = scenePlayerInfo.status;
            let hand = scenePlayerInfo.hand;
            let allChip = scenePlayerInfo.allChip;
            let actionMask = scenePlayerInfo.actionMask;
            let look = scenePlayerInfo.look;
            let lastAct = scenePlayerInfo.lastAct;
            let user = scenePlayerInfo.user;

            if (status == EnumPlayStatus.NORMAL) {
                normalPlayerNumber += 1;
            };

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);

            let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                let playerId = user.playerId;
                let displayName = user.displayName;
                let imgUrl = user.imgUrl;
                let nickname = user.nickname;
                let sex = user.sex;
                let diamond = user.diamond;
                let vipLevel = user.vipLevel;
                let playerCtrl = playerNode.getComponent(PlayerCtrl);
                playerCtrl.setPlayerPid(playerId);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(imgUrl);
                playerCtrl.setPlayerCoin(diamond);
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
            };

            if (status != EnumPlayStatus.WATCH) {
                let handCardsNode = this.addHandCardsNodeByPosIndex(posNodeIndex);
                if (handCardsNode) {
                    let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                    handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                    handCardsCtrl.setHandCardsSeenValue(look);
                    if (ownPlayerSeat == seat) {
                        if (look) {
                            let cards = hand.cards;
                            let suit = hand.suit;
                            let score = hand.score;
                            handCardsCtrl.setHandCardsBtnSeeActive(false);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsPowerPerformance(score);
                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                            handCardsCtrl.setHandCardsFrontPerformance();
                        }
                        else {
                            handCardsCtrl.setHandCardsBtnSeeActive(status == EnumPlayStatus.NORMAL ? true : false);
                        };
                    }
                    else {
                        if (look) {
                            let cards = hand.cards;
                            let suit = hand.suit;
                            let score = hand.score;
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsSeenPerformanceActive(true);
                        }
                        else {
    
                        };
                    };
                    handCardsCtrl.setHandCardsGrayPerfomanceActive(status == EnumPlayStatus.NORMAL ? false : true);
    
                    if (status == EnumPlayStatus.NORMAL && (lastAct == 2 || lastAct == 4) && curSeat != seat) {
                        if (look) {
                            handCardsCtrl.setHandCardsCatchChipPerformance(lastAct == 2 ? EnumCatchChip.CHAAL : EnumCatchChip.CHAALx2);
                        }
                        else {
                            handCardsCtrl.setHandCardsCatchChipPerformance(lastAct == 2 ? EnumCatchChip.BLIND : EnumCatchChip.BLINDx2);
                        };
                    };
                };

                let betInfoNode = this.addBetInfoNodeByPosIndex(posNodeIndex);
                if (betInfoNode) {
                    let betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl);
                    betInfoCtrl.setBetInfoTotalBet(allChip);
                };
            };

            if (ownPlayerSeat == seat) {
                ownPlayerActionMask = actionMask;
                ownPlayerLookValue = look;
                ownPlayerStatus = status;
            };
        };

        this.setNormalPlayerNumber(normalPlayerNumber);

        if (ownPlayerSeat !== curSeat) {
            if (ownPlayerStatus == EnumPlayStatus.NORMAL) {
                this.tableInfoCtrl.setTableInfoNodeActive(false);
                this.actBtnsCtrl.setActBtnsNodeActive(true);
                this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
                this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
                this.actBtnsCtrl.setActBtnsBetBtnString(ownPlayerLookValue ? EnumBetBtnStr.CHAAL : EnumBetBtnStr.BLIND);
            }
            else {
                this.tableInfoCtrl.setTableInfoNodeActive(true);
                this.actBtnsCtrl.setActBtnsNodeActive(false);
            };
        }
        else {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            let actValueArr = this.getCanActValueArrByActMask(ownPlayerActionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
            this.actBtnsCtrl.setActBtnsBetBtnString(ownPlayerLookValue ? EnumBetBtnStr.CHAAL : EnumBetBtnStr.BLIND);
        };
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? EnumShowBtnStr.SHOW : EnumShowBtnStr.SIDESHOW);
       

        if (duringPaymentSeat != -1) {
            let paymentPosNodeIndex = this.getPosNodeIndexByPlayerSeat(duringPaymentSeat);
            if (paymentPosNodeIndex == -1) {
                console.log(`setGameSceneInfoForRunningStatus，服务器下发的玩家座位号不存在! duringPaymentSeat: ${duringPaymentSeat}`);
                return;
            };
            let paymentPlayerNode = this.getPlayerNodeByPosIndex(paymentPosNodeIndex);
            if (paymentPlayerNode) {
                let paymentPlayerCtrl = paymentPlayerNode.getComponent(PlayerCtrl);
                paymentPlayerCtrl.setPlayerActTime(time);
                paymentPlayerCtrl.setPlayerShopActive(true);
            };
            if (ownPlayerSeat == duringPaymentSeat) {
                this.actBtnsCtrl.setActBtnsRechargeData(plotPayment, time, plotWinRate);
                this.ownRechargeTipCtrl.setOwnRechargeTipTime(time);
                this.btn_recharge.active = time > 0;
                this.isRechargeStatus = time > 0;
            };
        }
        else if (sourceCompSeat != -1 && targetCompSeat != -1) {
            let sourceCompPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sourceCompSeat);
            if (sourceCompPosNodeIndex == -1) {
                console.log(`setGameSceneInfoForRunningStatus，服务器下发的玩家座位号不存在! sourceCompSeat: ${sourceCompSeat}`);
                return;
            };
            let targetCompPosNodeIndex = this.getPosNodeIndexByPlayerSeat(targetCompSeat);
            if (targetCompPosNodeIndex == -1) {
                console.log(`setGameSceneInfoForRunningStatus，服务器下发的玩家座位号不存在! targetCompSeat: ${targetCompSeat}`);
                return;
            };

            let launchInfo = {
                name: "",
                headUrl: "",
            };
            let launchPlayerNode = this.getPlayerNodeByPosIndex(sourceCompPosNodeIndex);
            if (launchPlayerNode) {
                let launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl);
                launchPlayerCtrl.setPlayerActTime(0);
                launchInfo.name = launchPlayerCtrl.getPlayerName();
                launchInfo.headUrl = launchPlayerCtrl.getPlayerHeadUrl();
            };
    
            let targetInfo = {
                name: "",
                headUrl: "",
            };
            let targetPlayerNode = this.getPlayerNodeByPosIndex(targetCompPosNodeIndex);
            if (targetPlayerNode) {
                let targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl);
                targetPlayerCtrl.setPlayerActTime(time);
                targetInfo.name = targetPlayerCtrl.getPlayerName();
                targetInfo.headUrl = targetPlayerCtrl.getPlayerHeadUrl();
            };
    
            this.showCompareCardLine(sourceCompSeat, targetCompSeat);
    
            if (targetCompSeat == ownPlayerSeat) {
                let playersInfo: ICompareCardToastInfo = {
                    launchInfo: launchInfo,
                    targetInfo:targetInfo
                };
                this.showCompareCardToast(playersInfo);
            };
        }
        else {
            let curPosNodeIndex = this.getPosNodeIndexByPlayerSeat(curSeat);
            if (curPosNodeIndex == -1) {
                console.log(`setGameSceneInfoForRunningStatus，服务器下发的玩家座位号不存在! curSeat: ${curSeat}`);
                return;
            };
            let curOptPlayerNode = this.getPlayerNodeByPosIndex(curPosNodeIndex);
            if (curOptPlayerNode) {
                let curOptPlayerCtrl = curOptPlayerNode.getComponent(PlayerCtrl);
                curOptPlayerCtrl.setPlayerActTime(time);
            };
        };
    }

    /**
     * 设置场景状态为结算时的场景信息
     * @param notify 服务器下发的场景数据
     */
    setGameSceneInfoForCalculateStatus(notify: IGameSceneNotify) {
        let players = notify.players;
        let actTime = notify.actTime;
        let lastGameCalc = notify.lastGameCalc;
        let chipList = notify.chipList;
    
        if (actTime <= 3500) {
            let plotOffset = lastGameCalc.plotOffset;
            if (plotOffset) {
                this.luckyPlayerCtrl.setLuckyPlayerActive(true);
                this.luckyPlayerCtrl.setLuckyPlayerPlotOffset(plotOffset);
            };
            return;
        };

        this.setChipList(chipList);

        let ownPlayerSeat = this.getOwnPlayerSeat();

        for (let i = 0, len = players.length; i < len; i++) {
            let scenePlayerInfo = players[i];
            let seat = scenePlayerInfo.seat; 
            let status = scenePlayerInfo.status;
            let hand = scenePlayerInfo.hand;
            let allChip = scenePlayerInfo.allChip;
            let actionMask = scenePlayerInfo.actionMask;
            let look = scenePlayerInfo.look;
            let lastAct = scenePlayerInfo.lastAct;
            let user = scenePlayerInfo.user;

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);

            let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                let playerId = user.playerId;
                let displayName = user.displayName;
                let imgUrl = user.imgUrl;
                let nickname = user.nickname;
                let sex = user.sex;
                let diamond = user.diamond;
                let vipLevel = user.vipLevel;
                let playerCtrl = playerNode.getComponent(PlayerCtrl);
                playerCtrl.setPlayerPid(playerId);
                playerCtrl.setPlayerName(nickname);
                playerCtrl.setPlayerHead(imgUrl);
                playerCtrl.setPlayerCoin(diamond);
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
            };

            if (status != EnumPlayStatus.WATCH && hand) {
                let handCardsNode = this.addHandCardsNodeByPosIndex(posNodeIndex);
                if (handCardsNode) {
                    let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                    handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                    handCardsCtrl.setHandCardsSeenValue(look);
                    if (ownPlayerSeat == seat) {
                        if (look) {
                            let cards = hand.cards;
                            let suit = hand.suit;
                            let score = hand.score;
                            handCardsCtrl.setHandCardsBtnSeeActive(false);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsPowerPerformance(score);
                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                            handCardsCtrl.setHandCardsFrontPerformance();
                        }
                        else {
                            handCardsCtrl.setHandCardsBtnSeeActive(status == EnumPlayStatus.NORMAL ? true : false);
                        };
                    }
                    else {
                        if (look) {
                            let cards = hand.cards;
                            let suit = hand.suit;
                            let score = hand.score;
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsSeenPerformanceActive(true);
                        }
                        else {
    
                        };
                    };
                    handCardsCtrl.setHandCardsGrayPerfomanceActive(status == EnumPlayStatus.NORMAL ? false : true);
                };
    
                let betInfoNode = this.addBetInfoNodeByPosIndex(posNodeIndex);
                if (betInfoNode) {
                    let betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl);
                    betInfoCtrl.setBetInfoTotalBet(allChip);
                };
            };
        };

        this.dealGameOverNotifyMsg(lastGameCalc);
    }


    dealGameStartNotifyMsg(notify: IGameStartNotify) {
        let banker = notify.banker;
        let curChip = notify.curChip;
        let chipPool = notify.chipPool;
        let players = notify.players;

        this.waitStartTipCtrl.setWaitStartTipActive(false);

        this.totalChipsCtrl.setTotalChipsAmount(chipPool);
        let ownPlayerSeat = this.getOwnPlayerSeat();

        let normalPlayerNumber = 0;
        for (let i = 0, len = players.length; i < len; i++) {
            let gameStartPlayer = players[i];
            let seat = gameStartPlayer.seat;
            let status = gameStartPlayer.status;
            let diamond = gameStartPlayer.diamond;

            if (status == EnumPlayStatus.NORMAL) {
                normalPlayerNumber += 1;
            };

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);

            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);

            let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                let playerCtrl = playerNode.getComponent(PlayerCtrl);
                playerCtrl.resetPlayerPerformance();
                playerCtrl.setPlayerStateValue(status);
                playerCtrl.setPlayerStatePerformance();
                playerCtrl.setPlayerCoin(diamond);
            };
        };

        this.setNormalPlayerNumber(normalPlayerNumber);

        this.playSendCardAnim(players, () => {
            this.scheduleOnce(() => {
                for (let i = 0, len = players.length; i < len; i++) {
                    let gameStartPlayer = players[i];
                    let seat = gameStartPlayer.seat;

                    let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat); 
                    
                    let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
                    if (!playerNode) {
                        return;
                    };

                    let handCardsNode = this.addHandCardsNodeByPosIndex(posNodeIndex);
                    if (handCardsNode) {
                        let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                        handCardsCtrl.setHandCardsStyle(seat == ownPlayerSeat);
                        handCardsCtrl.setHandCardsBtnSeeActive(ownPlayerSeat == seat);
                    };
        
                    let betInfoNode = this.addBetInfoNodeByPosIndex(posNodeIndex);
                    if (betInfoNode) {
                        let betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl);
                        betInfoCtrl.setBetInfoTotalBet(0);
                    };
                };
                this.destroyAllSendCard();
            }, 0.5);
        });

        this.tableInfoCtrl.setTableInfoNodeActive(false);
        this.actBtnsCtrl.setActBtnsNodeActive(true);
        this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
        this.actBtnsCtrl.setActBtnsChipAmount(curChip);
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? EnumShowBtnStr.SHOW : EnumShowBtnStr.SIDESHOW);
    }

    playSendCardAnim(players: IGameStartPlayer[], finishedCall: Function) {
        let sendCardParent = this.getSendCardParent();
        let playersLen = players.length;
        let finishedNum = 0;

        for (let i = 0; i < playersLen; i++) {
            let gameStartPlayer = players[i];
            let seat = gameStartPlayer.seat;

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`playSendCardAnim，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            let posNode = this.getPosNodeByIndex(posNodeIndex);
            let handCardsParent = posNode.getChildByName("HandCardsParent");

            let contentSize: cc.Size;
            let cardDis: number;
            if (posNodeIndex == 0) {
                contentSize = cc.size(128.7, 166.1);
                cardDis = 50;
            }
            else {
                contentSize = cc.size(109.4, 141.2);
                cardDis = 40;
            };

            for (let k = 0; k < 3; k++) {
                let worldPos = handCardsParent.convertToWorldSpaceAR(cc.v3(cardDis * (k - 1), 0));
                let localPos = sendCardParent.convertToNodeSpaceAR(worldPos);
                let singleCardNode = this.getSingleCardNodeFromPool();
                singleCardNode.setPosition(cc.v3(0, 250));
                sendCardParent.addChild(singleCardNode);
                singleCardNode.setContentSize(cc.size(0, 0));
                cc.tween(singleCardNode)
                .delay(0.2 * k)
                .call(() => {
                    this.tpGameAudioCtrl.playFaCardEffect();
                })
                .to(0.2, {position: localPos, width: contentSize.width, height: contentSize.height})
                .call(() => {
                    finishedNum += 1;
                    if (finishedNum == playersLen) {
                        finishedCall && finishedCall();
                    };
                })
                .start();
            };
        };
    }

    destroyAllSendCard() {
        let sendCardParent = this.getSendCardParent();
        let children = sendCardParent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let singleCardNode = children[i];
            this.putSingleCardNodePool(singleCardNode);
        };
    }

    dealAskChipNotifyMsg(notify: IAskChipNotify) {
        let seat = notify.seat;
        let round = notify.round;
        let curChip = notify.curChip;
        let selfBaseChip = notify.selfBaseChip;
        let allowAction = notify.allowAction;
        let timeout = notify.timeout;
        let first = notify.first;

        this.setCurOptPlayerSeat(seat);

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`在呼叫玩家下注的通知时，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        this.roundInfoCtrl.setRoundInfoRound(round);

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerActTime(timeout);
        };

        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
            handCardsCtrl.setHandCardsCatchChipPerformance(EnumCatchChip.NONE);
        };

        let ownPlayerSeat = this.getOwnPlayerSeat(); 
        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            let actValueArr = this.getCanActValueArrByActMask(allowAction);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsChipAmount(selfBaseChip);
            if (handCardsNode) {
                let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                let seenValue = handCardsCtrl.getHandCardsSeenValue();
                this.actBtnsCtrl.setActBtnsBetBtnString(seenValue ? EnumBetBtnStr.CHAAL : EnumBetBtnStr.BLIND);
            };
        }
        else {
            let active = this.actBtnsCtrl.getActBtnsNodeActive(); 
            if (active) {
                this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
            };
        };
    }

    dealPlayerChipNotifyMsg(notify: IPlayerChipNotify) {
        let seat = notify.seat;
        let add = notify.add;
        let chip = notify.chip;
        let allChip = notify.allChip;
        let after = notify.after; 
        let chipPool = notify.chipPool;
        let curChip = notify.curChip;

        this.tpGameAudioCtrl.playCatchChipEffect();

        this.totalChipsCtrl.setTotalChipsAmount(chipPool);

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`在玩家下注的通知时，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerActTime(0);
            playerCtrl.setPlayerCoin(after);
            playerCtrl.setPlayerShopActive(false);
        };

        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
            if (chip != allChip) {
                let seenValue = handCardsCtrl.getHandCardsSeenValue();
                let opt = EnumCatchChip.BLIND;
                if (seenValue == false && add == true) {
                    opt = EnumCatchChip.BLINDx2;
                }
                else if (seenValue == true && add == false) {
                    opt = EnumCatchChip.CHAAL;
                }
                else if (seenValue == true && add == true) {
                    opt = EnumCatchChip.CHAALx2;
                };
                handCardsCtrl.setHandCardsCatchChipPerformance(opt);
            };
        };

        let betInfoNode = this.getBetInfoNodeByPosIndex(posNodeIndex);
        if (betInfoNode) {
            let betInfoCtrl = betInfoNode.getComponent(BetInfoCtrl);
            betInfoCtrl.setBetInfoTotalBet(allChip);
        };

        let chipNode = this.getChipNodeFromPool();
        if (chipNode && playerNode) {
            let chipCtrl = chipNode.getComponent(ChipCtrl);
            chipCtrl.setChipAmount(chip)
            let chipNodePos = this.getChipNodePosition();
            let chipParent = this.getChipParent();
            let playerNodeWorldPos = playerNode.parent.convertToWorldSpaceAR(new cc.Vec2(playerNode.x, playerNode.y));
            let converPos = chipParent.convertToNodeSpaceAR(playerNodeWorldPos);
            chipNode.setPosition(converPos);
            chipParent.addChild(chipNode);
            cc.tween(chipNode)
            .to(0.3, {position: chipNodePos}, { easing: 'circOut'})
            .start();
        };

        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(false);
            this.actBtnsCtrl.setActBtnsNodeActive(true);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr([]);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        };
    }

    dealPlayerDropNotifyMsg(notify: IPlayerDropNotify) {
        let seat = notify.seat;

        this.tpGameAudioCtrl.playDropCardEffect();

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`在玩家棋牌的通知时，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerActTime(0);
            playerCtrl.setPlayerStateValue(EnumPlayStatus.DROP);
            playerCtrl.setPlayerStatePerformance();
            playerCtrl.setPlayerShopActive(false);
        };

        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
            handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
            if (ownPlayerSeat == seat) {
                let seenValue = handCardsCtrl.getHandCardsSeenValue();
                if (seenValue == false) {
                    handCardsCtrl.setHandCardsBtnSeeActive(false);
                };
            };
        };

        let normalPlayerNumber = this.getNormalPlayerNumber();
        normalPlayerNumber -= 1;
        this.setNormalPlayerNumber(normalPlayerNumber);
    
        if (ownPlayerSeat == seat) {
            this.tableInfoCtrl.setTableInfoNodeActive(true);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.actBtnsCtrl.setActBtnsNodeActive(false);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        };
        this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? EnumShowBtnStr.SHOW : EnumShowBtnStr.SIDESHOW);
    }

    dealPlayerLookNotifyMsg(notify: IPlayerLookNotify) {
        let seat = notify.seat;
        let hand = notify.hand;
        let cards = hand.cards;
        let suit = hand.suit;
        let score = hand.score;
        let actionMask = notify.actionMask;

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`在玩家看牌的通知时，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();

        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
        if (handCardsNode) {
            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
            handCardsCtrl.setHandCardsValueArr(cards);
            handCardsCtrl.setHandCardsSeenValue(true);
        
            if (ownPlayerSeat == seat) {
                this.tpGameAudioCtrl.playRollOverCardEffect();
                handCardsCtrl.setHandCardsBtnSeeActive(false);
                handCardsCtrl.setHandCardsFlopPerformance();
                handCardsCtrl.setHandCardsSuitValue(suit);
                handCardsCtrl.scheduleOnce(() => {
                    handCardsCtrl.setHandCardsPowerPerformance(score);
                    handCardsCtrl.setHandCardsStaticSuitPerformance();
                }, 0.3);
            }
            else {
                handCardsCtrl.setHandCardsSeenPerformanceActive(true); 
            };
        };

        if (ownPlayerSeat == seat) {
            let curOptPlayerSeat = this.getCurOptPlayerSeat();
            this.actBtnsCtrl.updateActBtnsChipAmountBySeen();
            let actValueArr = this.getCanActValueArrByActMask(actionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(curOptPlayerSeat == ownPlayerSeat ? actValueArr : []);
            this.actBtnsCtrl.setActBtnsBetBtnString(EnumBetBtnStr.CHAAL);
        };
    }

    dealPlayerLuanchCompareNotifyMsg(notify: ILaunchCompareNotify) {
        let launch = notify.launch;
        let target = notify.target;

        this.tpGameAudioCtrl.playCompareCardLineEffect();

        this.setCurOptPlayerSeat(target);

        let ownPlayerSeat = this.getOwnPlayerSeat();

        let launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        if (launchPosNodeIndex == -1) {
            console.log(`在玩家发起比较的通知时，服务器下发的玩家座位号不存在! launch: ${launch}`);
            return;
        };

        let targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
        if (targetPosNodeIndex == -1) {
            console.log(`在玩家发起比较的通知时，服务器下发的玩家座位号不存在! target: ${target}`);
            return;
        };

        let launchInfo = {
            name: "",
            headUrl: "",
        };
        let launchPlayerNode = this.getPlayerNodeByPosIndex(launchPosNodeIndex);
        if (launchPlayerNode) {
            let launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl);
            launchPlayerCtrl.setPlayerActTime(0);
            launchPlayerCtrl.setPlayerShopActive(false);
            launchInfo.name = launchPlayerCtrl.getPlayerName();
            launchInfo.headUrl = launchPlayerCtrl.getPlayerHeadUrl();
        };


        let targetInfo = {
            name: "",
            headUrl: "",
        };
        let targetPlayerNode = this.getPlayerNodeByPosIndex(targetPosNodeIndex);
        if (targetPlayerNode) {
            let targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl);
            targetPlayerCtrl.setPlayerActTime(this.defaultOptTime);
            targetPlayerCtrl.setPlayerShopActive(false);
            targetInfo.name = targetPlayerCtrl.getPlayerName();
            targetInfo.headUrl = targetPlayerCtrl.getPlayerHeadUrl();
        };

        this.showCompareCardLine(launch, target);

        if (target == ownPlayerSeat) {
            let playersInfo: ICompareCardToastInfo = {
                launchInfo: launchInfo,
                targetInfo:targetInfo
            };
            this.showCompareCardToast(playersInfo);
        };

        if (target == ownPlayerSeat || ownPlayerSeat == launch) {
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        };
    }


    dealPlayerAnswerCompareNotifyMsg(notify: IAnswerCompareNotify) {
        let agree = notify.agree;
        let launch = notify.launch;
        let target = notify.target;
        let launcherWin = notify.launcherWin;
        let autoAnswer = notify.autoAnswer;  

        let launchPosNodeIndex = this.getPosNodeIndexByPlayerSeat(launch);
        if (launchPosNodeIndex == -1) {
            console.log(`在玩家发起比较的结果通知时，服务器下发的玩家座位号不存在! launch: ${launch}`);
            return;
        };

        let targetPosNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
        if (targetPosNodeIndex == -1) {
            console.log(`在玩家发起比较的结果通知时，服务器下发的玩家座位号不存在! target: ${target}`);
            return;
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();

        this.destroyCompareCardLine();
        this.destroyCompareCardToast();

        let launchPlayerNode = this.getPlayerNodeByPosIndex(launchPosNodeIndex);
        if (launchPlayerNode) {
            let launchPlayerCtrl = launchPlayerNode.getComponent(PlayerCtrl);
            launchPlayerCtrl.setPlayerActTime(0);
        };

        let targetPlayerNode = this.getPlayerNodeByPosIndex(targetPosNodeIndex);
        if (targetPlayerNode) {
            let targetPlayerCtrl = targetPlayerNode.getComponent(PlayerCtrl);
            targetPlayerCtrl.setPlayerActTime(0);
            if (!autoAnswer) {
                targetPlayerCtrl.setPlayerBattlePerformance(agree ? EnumBattleStatus.AGREE : EnumBattleStatus.REFUSE);
            };
        };

        if (agree) {
            let normalPlayerNumber = this.getNormalPlayerNumber();
            normalPlayerNumber -= 1;
            this.setNormalPlayerNumber(normalPlayerNumber);

            this.showCompareCardVS();
            this.tpGameAudioCtrl.playCompareCardVSEffect();
            this.scheduleOnce(() => {
                this.destroyCompareCardVS();
                let lostPosIndex = launcherWin ? targetPosNodeIndex : launchPosNodeIndex; 
                let lostPlayerNode = this.getPlayerNodeByPosIndex(lostPosIndex);
                let lostHandsCardNode = this.getHandCardsNodeByPosIndex(lostPosIndex);
                if (lostPlayerNode) {
                    this.tpGameAudioCtrl.playCompareCardLostEffect();
                    let lostPlayerCtrl = lostPlayerNode.getComponent(PlayerCtrl);
                    lostPlayerCtrl.setPlayerStateValue(EnumPlayStatus.LOST);
                    lostPlayerCtrl.setPlayerLostPerformance();
                    lostPlayerCtrl.scheduleOnce(() => {
                        lostPlayerCtrl.setPlayerStatePerformance();
                        if (lostHandsCardNode) {
                            let lostHandsCardsCtrl = lostHandsCardNode.getComponent(HandCardsCtrl);
                            lostHandsCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                            lostHandsCardsCtrl.setHandCardsBtnSeeActive(false);
                        };
                    }, 1);
                };
                if ((launcherWin && ownPlayerSeat == target) || (!launcherWin && ownPlayerSeat == launch)) {
                    this.tableInfoCtrl.setTableInfoNodeActive(true);
                    this.actBtnsCtrl.setActBtnsNodeActive(false);
                };
                this.actBtnsCtrl.setActBtnsShowBtnString(normalPlayerNumber == 2 ? EnumShowBtnStr.SHOW : EnumShowBtnStr.SIDESHOW);
            }, 1);
        };
    }


    dealGameOverNotifyMsg(notify: IGameOverNotify) {
        let players = notify.players;
        let winSeat = notify.winSeat;
        let chipPool = notify.chipPool;
        let finishReason = notify.finishReason;
        let nextTimeout = notify.nextTimeout;
        let plotOffset = notify.plotOffset;

     

        this.setCurOptPlayerSeat(-1);

        this.totalChipsCtrl.setTotalChipsAmount(chipPool);

        let ownPlayerSeat = this.getOwnPlayerSeat();

        this.setNormalPlayerNumber(0);

        let winPlayerAfter = 0;
        let winPlayerCalc = 0;
        for (let i = 0, len = players.length; i < len; i++) {
            let gameOverPlayer = players[i];
            let seat = gameOverPlayer.seat;
            let cards = gameOverPlayer.cards;
            let suit = gameOverPlayer.suit;
            let calc = gameOverPlayer.calc;
            let after = gameOverPlayer.after;
            let status = gameOverPlayer.status;
            let handledCompare = gameOverPlayer.handledCompare;

            if (seat == ownPlayerSeat) {
                //@ts-ignore
                GlobalCfg.USER_DATAS.userDiamond = after;
            };

            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealGameOverNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
                continue;
            };

            let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                let playerCtrl = playerNode.getComponent(PlayerCtrl);
                playerCtrl.setPlayerActTime(0);
                
                if (winSeat != seat) {
                    playerCtrl.setPlayerCoin(after);
                }
                else {
                    winPlayerAfter = after;  
                    winPlayerCalc = calc;
                };

                let playerStateValue = playerCtrl.getPlayerStateValue();
                if (finishReason == EnumSetFinishReason.ROUNDLIMIT || finishReason == EnumSetFinishReason.CHIPPOOLLIMIT) {
                    if (winSeat == seat) {
                        this.scheduleOnce(() => {
                            this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl.setPlayerWinDynamicPerformance();
                        }, 1);
                    }
                    else {
                        if (playerStateValue == EnumPlayStatus.NORMAL) {
                            this.tpGameAudioCtrl.playCompareCardLostEffect();
                            playerCtrl.setPlayerStateValue(EnumPlayStatus.LOST);
                            playerCtrl.setPlayerLostPerformance();
                            playerCtrl.scheduleOnce(() => {
                                playerCtrl.setPlayerStatePerformance();
                            }, 1);
                        };
                    };

                    if (seat == winSeat || seat == ownPlayerSeat || handledCompare || playerStateValue == EnumPlayStatus.NORMAL) {
                        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsCatchChipPerformance(EnumCatchChip.NONE);
                            let seenValue = handCardsCtrl.getHandCardsSeenValue();
                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            };
                        };    
                    };
                }
                else if (finishReason == EnumSetFinishReason.DROP) {
                    if (winSeat == seat) {
                        this.scheduleOnce(() => {
                            this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl.setPlayerWinDynamicPerformance();
                        }, 1);
                    };

                    if (seat == ownPlayerSeat || handledCompare) {
                        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsCatchChipPerformance(EnumCatchChip.NONE);
                            let seenValue = handCardsCtrl.getHandCardsSeenValue();

                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            };
                        };    
                    };
                }
                else if (finishReason == EnumSetFinishReason.COMPARE) {
                    if (winSeat == seat) {
                        this.scheduleOnce(() => {
                            this.tpGameAudioCtrl.playWinEffect();
                            playerCtrl.setPlayerWinDynamicPerformance();
                        }, 1);
                    };

                    if (seat == winSeat || seat == ownPlayerSeat || handledCompare) {
                        let handCardsNode = this.getHandCardsNodeByPosIndex(posNodeIndex);
                        if (handCardsNode) {
                            let handCardsCtrl = handCardsNode.getComponent(HandCardsCtrl);
                            handCardsCtrl.setHandCardsValueArr(cards);
                            handCardsCtrl.setHandCardsSuitValue(suit);
                            handCardsCtrl.setHandCardsCatchChipPerformance(EnumCatchChip.NONE);
                            let seenValue = handCardsCtrl.getHandCardsSeenValue();
                            if (winSeat == seat) {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            }
                            else {
                                if (ownPlayerSeat == seat) {
                                    if (seenValue == false) {
                                        this.tpGameAudioCtrl.playRollOverCardEffect();
                                        handCardsCtrl.setHandCardsBtnSeeActive(false);
                                        handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                        handCardsCtrl.setHandCardsFlopPerformance();
                                        handCardsCtrl.scheduleOnce(() => {
                                            handCardsCtrl.setHandCardsStaticSuitPerformance();
                                            // handCardsCtrl.setHandCardsPowerPerformance(score);
                                        }, 0.3);
                                    };
                                }
                                else {
                                    this.tpGameAudioCtrl.playRollOverCardEffect();
                                    handCardsCtrl.setHandCardsSeenPerformanceActive(false);
                                    handCardsCtrl.setHandCardsGrayPerfomanceActive(true);
                                    handCardsCtrl.setHandCardsFlopPerformance();
                                    handCardsCtrl.scheduleOnce(() => {
                                        handCardsCtrl.setHandCardsDynamicSuitPerformance();
                                    }, 0.3);
                                };
                            };
                        };    
                    };
                }; 
            };
        };

        this.tableInfoCtrl.setTableInfoNodeActive(true);
        this.actBtnsCtrl.setActBtnsNodeActive(false);

        let winPosNodeIndex = this.getPosNodeIndexByPlayerSeat(winSeat);
        if (winPosNodeIndex == -1) {
            console.log(`dealGameOverNotifyMsg，服务器下发的玩家座位号不存在! winSeat: ${winSeat}`);
            return;
        };

        this.scheduleOnce(() => {
            this.tpGameAudioCtrl.playRecycleChipEffect();
            let winPosNode = this.getPosNodeByIndex(winPosNodeIndex);
            let chipParent = this.getChipParent();
            let children = chipParent.children;
            for (let i = 0, len = children.length; i < len; i++) {
                let chipNode = children[i];
                let winPosNodeWorldPos = winPosNode.parent.convertToWorldSpaceAR(new cc.Vec3(winPosNode.x, winPosNode.y));
                let endPos = chipNode.parent.convertToNodeSpaceAR(winPosNodeWorldPos);
                cc.tween(chipNode)
                .delay(0.05 * i)
                .to(0.2, {position: endPos})
                .call(() => {
                    this.putChipNodePool(chipNode);
                })
                .start();
            };
        
            this.scheduleOnce(() => {
                let winPlayerNode = this.getPlayerNodeByPosIndex(winPosNodeIndex);
                if (winPlayerNode) {
                    let playerCtrl = winPlayerNode.getComponent(PlayerCtrl);
                    playerCtrl.setPlayerCoin(winPlayerAfter);
                };
                let winHandCardsNode = this.getHandCardsNodeByPosIndex(winPosNodeIndex);
                if (winHandCardsNode) {
                    let winHandCardsCtrl = winHandCardsNode.getComponent(HandCardsCtrl);
                    winHandCardsCtrl.setHandCardsWinScorePerformance(winPlayerCalc);
                };
            }, 0.5);
            this.scheduleOnce(() => {
                if (plotOffset) {
                    this.luckyPlayerCtrl.setLuckyPlayerActive(true);
                    this.luckyPlayerCtrl.setLuckyPlayerPlotOffset(plotOffset);
                };
            }, 0.8);        
        }, 2);

        //@ts-ignore
        CommonFun.getInstance().showWithdrawToastInGame();
    }

    dealDestroyAndMatchingNotifyMsg(notify: IDestroyAndMatchingNotify) {
        this.destroyAllPlayers();
        this.waitStartTipCtrl.setWaitStartTipActive(true);
    }

    destroyAllChips() {
        let chipParent = this.getChipParent();
        let children = chipParent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let chipNode = children[i];
            if (chipNode) {
                this.putChipNodePool(chipNode);
            }
            else {
                console.log(`destroyAllChips，chipNode为空!， i: ${i}`);
            };
        };
    }

    /**
     * 清除玩家信息，手牌，下注信息等
     */
    destroyAllPlayers() {
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                let playerNode = this.getPlayerNodeByPosIndex(i);
                if (playerNode) {
                    let playerCtrl = playerNode.getComponent(PlayerCtrl);
                    playerCtrl.resetPlayerPerformance();
                };
            }
            else {
                this.destroyPlayerNodeByPosIndex(i);
            };

            this.destroyHandCardsNodeByPosIndex(i);
            this.destroyBetInfoNodeByPosIndex(i);
        };
    }

    dealPlayerLeaveNotifyMsg(notify: IPlayerLeaveNotify) {
        let seat = notify.seat;
        let reason = notify.reason;
        let forceJump = notify.forceJump;

        switch (reason) {
            case EnumLeaveReason.NORMAL:
                this.dealPlayerLeaveForNormal(seat);
                break;
            case EnumLeaveReason.OFFLINE:
                this.dealPlayerLeaveForOffline(seat);
                break;
            case EnumLeaveReason.BROKE:
                this.dealPlayerLeaveForBroke(seat);
                break;
            case EnumLeaveReason.TIMEOUT:
                this.dealPlayerLeaveForTimeout(seat);
                break;
            case EnumLeaveReason.ROOMCLOSE:
                this.dealPlayerLeaveForRoomClose(seat);
                break;
            case EnumLeaveReason.CHANGETABLE:
                this.dealPlayerLeaveForChangeTable(seat);
                break;
            case EnumLeaveReason.JUMPSPACE:
                this.dealPlayerLeaveForJumpSpace(seat, forceJump);
                break;
            case EnumLeaveReason.PLOTOFFSET:
                this.dealPlayerLeaveForPlotOffset(seat);
                break;
            default:
                break;
        }
    }

    dealPlayerLeaveForNormal(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForNormal，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForOffline(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForOffline，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForBroke(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForBroke，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForTimeout(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForTimeout，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForRoomClose(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            window["isNeedShowRoomList"] = "tpGame";
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForRoomClose，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForChangeTable(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat != ownPlayerSeat) {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForChangeTable，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForJumpSpace(seat: number, roomId: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat == ownPlayerSeat) {
            this.destroyAllPlayers();
            let content = "The gold coins you carry do not meet the event requirements, please enter another event!";
            this.msgToastCtrl.setMsgToastActive(true);
            this.msgToastCtrl.setMsgToastContent(content);
            this.msgToastCtrl.setMsgToastStyle(EnumMsgToastStyle.YES_NO);
            this.msgToastCtrl.setMsgToastYesCall(() => {
                //@ts-ignore
                GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
                    id: roomId
                });
            });
            this.msgToastCtrl.setMsgToastNoCall(() => {
                window["isNeedShowRoomList"] = "tpGame";
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForJumpSpace，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };

            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerLeaveForPlotOffset(seat: number) {
        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (seat !== ownPlayerSeat) {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
            if (posNodeIndex == -1) {
                console.log(`dealPlayerLeaveForRoomClose，服务器下发的玩家座位号不存在! seat: ${seat}`);
                return;
            };
            this.destroyBetInfoNodeByPosIndex(posNodeIndex);
            this.destroyHandCardsNodeByPosIndex(posNodeIndex);
            this.destroyPlayerNodeByPosIndex(posNodeIndex);
        };
    }

    dealPlayerJoinNotifyMsg(notify: IPlayerJoinNotify) {
        let userInfo = notify.userInfo;
        let seat = notify.seat;
        let status = notify.status;

        this.tpGameAudioCtrl.playPlayerJoinEffect();

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`dealPlayerJoinNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let playerNode = this.addPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerId = userInfo.playerId;
            let displayName = userInfo.displayName;
            let imgUrl = userInfo.imgUrl;
            let nickname = userInfo.nickname;
            let sex = userInfo.sex;
            let diamond = userInfo.diamond;
            let vipLevel = userInfo.vipLevel;
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerKuang(posNodeIndex == 0 ? EnumPlayerKuangType.WITHCOIN : EnumPlayerKuangType.WITHOUTCOIN);
            playerCtrl.setPlayerStyle(posNodeIndex);
            playerCtrl.setPlayerSeat(seat);
            playerCtrl.setPlayerPid(playerId);
            playerCtrl.setPlayerName(nickname);
            playerCtrl.setPlayerHead(imgUrl);
            playerCtrl.setPlayerCoin(diamond);
            playerCtrl.setPlayerStateValue(EnumPlayStatus.WATCH);
            playerCtrl.setPlayerStatePerformance();
        };
    }

    dealPlayerOfflineNotifyMsg(notify: IPlayerOfflineNotify) {
        let seat = notify.seat;          
        let offline = notify.offline;

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`dealPlayerOfflineNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerOffLineActive(offline);
        };
    }

    dealChangeRoomMsg(notify: IChangeRoomAck) {
        let conf = notify.conf;
        let forceJump = notify.forceJump;
        let matching = notify.matching;
        let scene = notify.scene;

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
        let maxBlinds = conf.blind ? "Always Blind" : "4";
        let tableInfo: ITableInfo = {
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
        };
    }


    dealPreparePaymentNotifyMsg(notify: IPreparePaymentNotify) {
        let timeoutMs = notify.timeoutMs;
        let seat = notify.seat;
        let payment = notify.payment;
        let winRate = notify.winRate;
        //@ts-ignore
        cc.sys.localStorage.setItem("TP_winRate", notify.winRate);

        let time = Math.floor(timeoutMs / 1000);

        this.setCurOptPlayerSeat(seat);

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`dealPreparePaymentNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerActTime(time);
            playerCtrl.setPlayerShopActive(true);
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == seat) {
            this.actBtnsCtrl.setActBtnsRechargeData(payment, time, winRate);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(time);
            this.btn_recharge.active = time > 0;
            this.isRechargeStatus = true;
        };
    }


    dealPaymentFinishNotifyMsg(notify: IPaymentFinishNotify) {
        let seat = notify.seat;
        let timeoutMs = notify.timeoutMs;
        let actionMask = notify.actionMask;

        let time = Math.floor(timeoutMs / 1000);

        this.setCurOptPlayerSeat(seat);

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`dealPaymentFinishNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let ownPlayerSeat = this.getOwnPlayerSeat();
        if (ownPlayerSeat == seat) {
            let actValueArr = this.getCanActValueArrByActMask(actionMask);
            this.actBtnsCtrl.setActBtnsInteractableByActValueArr(actValueArr);
            this.actBtnsCtrl.setActBtnsRechargeData(null, 0, null);
            this.ownRechargeTipCtrl.setOwnRechargeTipTime(0);
            this.btn_recharge.active = false;
        };

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerActTime(time);
            playerCtrl.setPlayerShopActive(false);
        };
    }

    dealShortMessageNotifyMsg(notify: IShortMessageNotify) {
        let msgType = notify.msgType;
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
    }

    dealUpdateCoinNotifyMsg(notify: IUpdateCoinNotify) {
        let seat = notify.seat;
        let diamond = notify.diamond;
        let reason = notify.reason;

        let posNodeIndex = this.getPosNodeIndexByPlayerSeat(seat);
        if (posNodeIndex == -1) {
            console.log(`dealUpdateCoinNotifyMsg，服务器下发的玩家座位号不存在! seat: ${seat}`);
            return;
        };

        let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
        if (playerNode) {
            let playerCtrl = playerNode.getComponent(PlayerCtrl);
            playerCtrl.setPlayerCoin(diamond);
        };
    }

    dealShortMessageForWord(notify: IShortMessageNotify) {
        let target = notify.target;
        let sender = notify.sender;
        let price = notify.price;
        let senderAfter = notify.senderAfter;
        let name = notify.name;

        let senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log(`dealShortMessageForWord，服务器下发的玩家座位号不存在! sender: ${sender}`);
            return;
        };

        let senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            let senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        };

        //@ts-ignore
        CommonFun.getInstance().playGameWordInteraction(0, name, senderPlayerNode, cc.v2(120, 110));
    }

    dealShortMessageForFace(notify: IShortMessageNotify) {
        let target = notify.target;
        let sender = notify.sender;
        let price = notify.price;
        let senderAfter = notify.senderAfter;
        let name = notify.name;

        let senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log(`dealShortMessageForFace，服务器下发的玩家座位号不存在! sender: ${sender}`);
            return;
        };

        let senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            let senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        };

        //@ts-ignore
        CommonFun.getInstance().playGameWordInteraction(1, name, senderPlayerNode, cc.v2(0, 120));
    }

    dealShortMessageForGift(notify: IShortMessageNotify) {
        let target = notify.target;
        let sender = notify.sender;
        let price = notify.price;
        let senderAfter = notify.senderAfter;
        let name = notify.name;

        let targetNodeArr = [];
        let senderPosNodeIndex = this.getPosNodeIndexByPlayerSeat(sender);
        if (senderPosNodeIndex == -1) {
            console.log(`dealShortMessageForGift，服务器下发的玩家座位号不存在! sender: ${sender}`);
            return;
        };

        let senderPlayerNode = this.getPlayerNodeByPosIndex(senderPosNodeIndex);
        if (senderPlayerNode) {
            let senderPlayerCtrl = senderPlayerNode.getComponent(PlayerCtrl);
            senderPlayerCtrl.setPlayerCoin(senderAfter);
        };

        if (target == -1) {
            for (let i = 0; i < 5; i++) {
                if (sender != i) {
                    let posNodeIndex = this.getPosNodeIndexByPlayerSeat(i);
                    let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
                    if (playerNode) {
                        targetNodeArr.push(playerNode);
                    };
                };
            } 
        }
        else {
            let posNodeIndex = this.getPosNodeIndexByPlayerSeat(target);
            if (posNodeIndex == -1) {
                console.log(`dealShortMessageForGift，服务器下发的玩家座位号不存在! target: ${target}`);
                return;
            };
            let playerNode = this.getPlayerNodeByPosIndex(posNodeIndex);
            if (playerNode) {
                targetNodeArr.push(playerNode);
            };
        };
        //@ts-ignore
        CommonFun.getInstance().playGameGifInteraction(name, senderPlayerNode, targetNodeArr);
    }

    dealMenuClickOutToLobbyMsg(notify) {
        //@ts-ignore
        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
    }

    dealMenuClickSwitchTableMsg(notify) {
        //@ts-ignore
        GameServerManager.send("gameservice.changeroom", "ChangeRoomAck", {});
    }

    dealMenuClickHowToPlayMsg(notify) {
        //@ts-ignore
        CommonFun.getInstance().showRule("tpGame");
    } 

    dealLuckyPlayerClickGetMsg(notify) {
        if (!notify) {
            return;
        };
        let plotOffset: IPlotOffset = notify.plotOffset;
        let after = plotOffset.after;
        let roomId = plotOffset.jumpSpace;

        let ownPlayerNode = this.getPlayerNodeByPosIndex(0);
        if (ownPlayerNode) {
            let ownPlayerCtrl = ownPlayerNode.getComponent(PlayerCtrl);
            ownPlayerCtrl.setPlayerCoin(after);
        };

        if (roomId == -1) {
            //@ts-ignore
            GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
        };

        this.destroyAllPlayers();
        //@ts-ignore
        GameServerManager.send("gameservice.enterlv", "EnterLvReq", {
            id: roomId
        });
    }
}; 
 