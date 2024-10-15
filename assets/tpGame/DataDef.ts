export enum EnumAddCashType {
    NONE = 0,
    PRACTICE = 1,
    CASH = 2,
}

export enum EnumPlayerKuangType {
    WITHCOIN = 0,
    WITHOUTCOIN = 1,
}

export enum EnumMsgToastStyle {
    YES = 0,
    NO = 1,
    YES_NO = 2,
}

export enum EnumBetBtnStr {
    BLIND = "Blind",
    CHAAL = "Chaal",
}


export enum EnumShowBtnStr {
    SHOW = "Show",
    SIDESHOW = "Side Show",
}

/**
 * 游戏场馆状态
 */
export enum EnumTableStatus {
    /**
     * 游戏准备阶段
     */
    WAIT = 0, 
    /**
     * 游戏中
     */
    RUNNING = 1,
    /**
     * 结算阶段
     */
    CALCULATE = 2,
};


/**
 * 离开原因
 */
export enum EnumLeaveReason {
    /**
     * 正常离开
     */
    NORMAL = 0,
    /**
     * 离线踢出
     */
    OFFLINE = 1,
    /**
     * 破产踢出
     */
    BROKE = 2,
    /**
     * 超时踢出
     */
    TIMEOUT = 3,
    /**
     * 房间解散踢出
     */
    ROOMCLOSE = 4,
    /**
     * 换桌
     */
    CHANGETABLE = 5,
    /**
     * 强制转场
     */
    JUMPSPACE = 6,
    /**
     * 首充剧情补偿
     */
    PLOTOFFSET = 7,
};


/**
 * 小局结算原因
 */
export enum EnumSetFinishReason {
    /**
     * 弃牌
     */
    DROP = 0,
    /**
     * 比牌
     */
    COMPARE = 1,
    /**
     * 回合数封顶
     */
    ROUNDLIMIT = 2,
    /**
     * 注池封顶
     */
    CHIPPOOLLIMIT = 3,
};


/**
 * 玩家动作
 */
export enum EnumPlayAct {
    /**
     * 空
     */
    NONE = 0,
    /**
     * 看牌
     */
    LOOK = 1,
    /**
     * 跟注
     */
    FOLL = 2,
    /**
     * 加注
     */
    ADD = 4,
    /**
     * 比牌
     */
    COMP = 8,
    /**
     * 弃牌
     */
    DROP = 16,
    /**
     * 应答加注
     */
    ANSCOMP = 32,
};


/**
 * 玩家状态
 */
export enum EnumPlayStatus {
    /**
     * 正常
     */
    NORMAL = 0,
    /**
     * 弃牌
     */
    DROP = 1,
    /**
     * 比牌输了
     */
    LOST = 2,
    /**
     * 旁观
     */
    WATCH = 3,
};


/**
 * 牌的类型
 */
export enum EnumCardSuit {
    /**
     * 空
     */
    NONE = 0,
    /**
     * 点数
     */
    POINT = 1,
    /**
     * 对子
     */
    TWO = 2,
    /**
     * 金花
     */
    FLUSH = 3,
    /**
     * 顺子
     */
    STRAIGHT = 4,
    /**
     * 金顺
     */
    STRAIGHT_FLUSH = 5,
    /**
     * 豹子
     */
    THREE = 6,
};

/**
 * 比牌状态
 */
export enum EnumBattleStatus {
    /**
     * 无比牌
     */
    NONE = 0,
    /**
     * 同意比牌
     */
    AGREE = 1,
    /**
     * 拒绝比牌
     */
    REFUSE = 2,
}


export enum EnumPrefabPath {
    /**
     * 牌桌信息
     */
    TABLEINFO = "TableInfo/TableInfo",
    /**
     * 牌桌信息弹框
     */
    TABLEINFOTOAST = "TableInfo/TableInfoToast",
    /**
     * 自己玩家操作的按钮
     */
    ACTBTNS = "ActBtns/ActBtns",
    /**
     * 下注池的信息
     */
    TOTALCHIPS = "TotalChips/TotalChips",
    /**
     * 玩家信息
     */
    PLAYER = "Player/Player",
    /**
     * 玩家手牌
     */
    HANDCARDS = "HandCards/HandCards",
    /**
     * 比牌请求弹框
     */
    COMPARECARDTOAST = "CompareCard/CompareCardToast",
    /**
     * 比牌VS动画
     */
    COMPARECARDVS = "CompareCard/CompareCardVS",
    /**
     * 比牌连线动画
     */
    COMPARECARDLINE = "CompareCard/CompareCardLine",
    /**
     * 玩家下注的总金额
     */
    BETINFO = "BetInfo/BetInfo",
    /**
     * 筹码
     */
    CHIP = "Chip/Chip",
    /**
     * 充值弹框
     */
    RECHARGETOAST = "RechargeToast/RechargeToast",
    /**
     * 自己的充值提示
     */
    OWNRECHARGETIP = "RechargeToast/OwnRechargeTip",
    /**
     * Hint提示界面
     */
    HINT = "Hint/Hint",
    /**
     * 轮次信息
     */
    ROUNDLINFO = "RoundInfo/RoundInfo",
    /**
     * 消息提示
     */
    MSGTOAST = "MsgToast/MsgToast",
    /**
     * 等待开始提示
     */
    WAITSTARTTIP = "WaitStartTip/WaitStartTip",
    /**
     * 单张牌
     */
    SINGLECARD = "SingleCard/SingleCard",
    /**
     * 充值按钮
     */
    ADDCASH = "AddCash/AddCash",
    /**
     * 幸运玩家
     */
    LUCKYPLAYER = "LuckyPlayer/LuckyPlayer",
}

export enum EnumCatchChip {
    NONE = 0,
    BLIND = 1,
    BLINDx2 = 2,
    CHAAL = 3,
    CHAALx2 = 4,
}


/**
 * 用户信息接口
 */
export interface IUserInfo {
    playerId: number;
    displayName : string;
    imgUrl: string;
    nickname: string;
    sex: number;
    diamond: number;
    vipLevel: number;
};

/**
 * 异常结果数据接口
 */
export interface IResponseBase{
    result: number;
    message: string;
};


/**
 * 登录请求数据接口
 */
export interface ILoginReq {
    /**
     * 用户ID
     */
    userid: string;//用户ID
    /**
     * 登录服拿到的token
     */
    token: string;
    /**
     * 来源平台ID
     */
    fromid: number;
};


/**
 * 登录响应数据接口
 */
export interface ILoginAck {
    result: IResponseBase;
    /**
     * pid
     */
    pid: number; 
    /**
     * 钻石
     */
    diamond: number;
    /**
     * 总充值金额
     */
    totalPay: number ; // 总充值金额
    /**
     * 房间ID -1表示不在房间中
     */
    roomId: number;
};


/**
 * 获取免费积分请求数据接口
 */
export interface IReceiveFreeTrialReq {
    /**
     * 用户ID
     */
    userid: string;
    /**
     * 倍数
     */
    times: number;
};


/**
 * 获取免费积分响应数据接口
 */
export interface IReceiveFreeTrialAck{
    result: IResponseBase;
};

/**
 * 房间配置数据接口
 */
export interface IRoomConfig {
    id: number;
    level: number;
    entryCondition: number;
    entryConditionMax: number;
    cellScore: number;
    icon: string;
    /**
     * 是否是闷牌场
     */
    blind: boolean;    
    /**
     * 最大筹码
     */             
    maxJetton: number;
    /**
     * 桌面奖池最大筹码
     */
    maxTableJetton: number;
    /**
     * 是否是体验场
     */
    trial: boolean;
};


/**
 * 进入房间请求数据接口
 */
export interface IEnterLvReq {
    /**
     * 房间ID
     */
    id: number;
};


/**
 * 进入房间响应数据接口
 */
export interface IEnterLvAck {
    result: IResponseBase;
    conf: IRoomConfig;
    /**
     * 强制转场，-1表示不需要
     */
    forceJump: number;
    /**
     * 是否是匹配中，若不是，则scene有对应的数据；若是，则scene为空
     */
    matching: boolean;
    /**
     * 场景数据
     */
    scene: IGameSceneNotify
};


/**
 * 踢人响应数据接口
 */
export interface IKickOutAck {
    kicktype: number;
};


/**
 * 退出房间请求数据接口
 */
export interface IExitGameReq {
};


/**
 * 退出房间响应数据接口
 */
export interface IExitGameAck {
    result: IResponseBase;
};


/**
 * 换桌请求数据接口
 */
export interface IChangeRoomReq {
};


/**
 * 换桌响应数据接口
 */
export interface IChangeRoomAck {
    result: IResponseBase;
    conf: IRoomConfig;
    /**
     * 强制转场，-1表示不需要
     */
    forceJump: number;
    /**
     *  匹配中(P2无意义) 
     */
    matching: boolean;
    /**
     * 场景数据
     */
    scene: IGameSceneNotify;
};


/**
 * 短消息请求数据接口
 */
export interface IShortMessageReq {
    /**
     * 消息类型 0短语 1表情 2礼物
     */
    msgType: number;
    /**
     * 表情名/短语内容
     */
    name: string;
    /**
     * 接收者seat (-1表示群发)
     */
    target: number;
};


/**
 * 短消息响应数据接口
 */
export interface IShortMessageAck {
    result: IResponseBase;
};


/**
 * 短消息通知数据接口
 */
export interface IShortMessageNotify {
    /**
     * 消息类型 0短语 1表情 2礼物
     */
    msgType: number;
    /**
     * 表情名/短语内容
     */
    name: string;
    /**
     * 发送者seat
     */
    sender: number;
    /**
     * 接收者seat (-1表示群发)
     */
    target: number;
    /**
     * 价格
     */
    price: number;
    /**
     * 发送者扣价后货币
     */
    senderAfter: number;
};


/**
 * 玩家金币更新通知数据接口
 */
export interface IUpdateCoinNotify {
    /**
     * 玩家seat
     */
    seat: number;
    /**
     * 剩余数量
     */
    diamond: number;
    /**
     * 原因 1:支付; 其他：未知
     */
    reason: number;
};


/**
 * 游戏场景请求数据接口
 */
export interface IGameSceneReq {
};


/**
 * 手牌数据接口
 */
export interface IHand {
    cards: number[];
    suit: EnumCardSuit;
    /**
     * 牌力 0~100
     */
    score: number;
}

export interface IScenePlayerInfo {
    user: IUserInfo;
    seat: number;
    status: EnumPlayStatus; 
    /**
     * 手牌信息
     */
    hand: IHand;
    /**
     * 下的总注
     */
    allChip: number;
    /**
     * 下注后的货币
     */
    after: number;
    /**
     * 当前可以进行的操作
     */
    actionMask: number;      // 当前可以进行的操作
    /**
     * 是否准备
     */
    ready: boolean;
    /**
     * 是否看牌了
     */
    look: boolean;
    /**
     * 最近的操作(2跟注, 4加注)
     */
    lastAct: EnumPlayAct;
};

/**
 * 商品数据接口
 */
export interface IPaymentProduct {
    /**
     * 商品ID(支付接口用)
     */
    id: number;
    /**
     * 金额
     */
    amount: number;
    /**
     * 额外赠送-dep
     */
    add: number;
    /**
     * 额外赠送-bonus
     */
    bonus: number;
    /**
     * 是否是剧情
     */
    plot: boolean
}

/**
 * 游戏场景响应数据接口
 */
export interface IGameSceneNotify {
    result: IResponseBase;
    /**
     * 小局标识(索引小局日志)
     */
    setFlag: string;
    /**
     * 玩家信息
     */
    players: IScenePlayerInfo[];
    /**
     * 牌桌状态
     */
    status: EnumTableStatus;
    /**
     * 庄家的座位号
     */
    banker: number;
    /**
     * 当前基础筹码
     */
    curChip: number;
    /**
     * 当前玩家跟注金额
     */
    selfBaseChip: number;
    /**
     * 下注的总筹码
     */
    chipPool: number;
    /**
     * 筹码列表
     */
    chipList: number[];
    /**
     * 当前该谁操作的座位号
     */
    curSeat: number;
    /**
     * 当前轮数
     */
    round: number;
    /**
     * 当前可动作的时间
     */
    actTime: number;
    /**
     * 支付中的玩家, -1表示为没有玩家在支付中
     */
    duringPaymentSeat: number;
    /**
     * 发起比牌的玩家seat
     */
    sourceCompSeat: number;
    /**
     * 被比牌的玩家seat
     */
    targetCompSeat: number;
    /**
     * 最近一次的游戏结算
     */
    lastGameCalc: IGameOverNotify;
    /**
     * 支付商品
     */
    plotPayment: IPaymentProduct;
    /**
     * 赢的概率, 1298表示12.98%
     */
    plotWinRate: number;
    /**
     * 是否在队列中
     */
    inQueue: boolean;
    /**
     * 匹配完成（玩家加入的音效播放点）
     */
    matchFinish: boolean;
};


/**
 * 房间销毁并开始匹配通知数据接口
 */
export interface IDestroyAndMatchingNotify {
};


/**
 * 玩家进入通知数据接口
 */
export interface IPlayerJoinNotify {
    /**
     * 玩家信息
     */
    userInfo: IUserInfo;
    /**
     * 座位
     */
    seat: number;
    /**
     * 玩家状态
     */
    status: EnumPlayStatus;
};


/**
 * 玩家离开通知数据接口
 */
export interface IPlayerLeaveNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 离开原因
     */
    reason: EnumLeaveReason;
    /**
     * 强制转场-转场ID,此时reason=6.LeaveJumpSpace
     */
    forceJump: number;
}


/**
 * 玩家离线通知数据接口
 */
export interface IPlayerOfflineNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 是否离线
     */
    offline: boolean;
};


/**
 * 游戏开始通知的玩家数据接口
 */
export interface IGameStartPlayer {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 玩家状态
     */
    status: EnumPlayStatus;
    /**
     * 玩家携带的钻石
     */
    diamond: number;
};


/**
 * 游戏开始通知数据接口
 */
export interface IGameStartNotify {
    /**
     * 庄家seat
     */
    banker: number;
    /**
     * 当前底注
     */
    curChip: number;
    /**
     * 当前总注池
     */
    chipPool: number;
    /**
     * 玩家
     */
    players: IGameStartPlayer[];
};


/**
 * 呼叫下注通知数据接口
 */
export interface IAskChipNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 轮数
     */
    round: number;
    /**
     * 当前注
     */
    curChip: number;
    /**
     * 自己基础注
     */
    selfBaseChip: number;
    /**
     * 允许的操作
     */
    allowAction: number;
    /**
     * 允许操作的时间
     */
    timeout: number;
    /**
     * 是否是第一次
     */
    first: boolean;
};


/**
 * 下注请求数据接口
 */
export interface IChipReq{
    /**
     * 是否加注
     */
    add: boolean;
};


/**
 * 下注响应数据接口
 */
export interface IChipAck {
    result: IResponseBase;
};


/**
 * 玩家下注通知数据接口
 */
export interface IPlayerChipNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 是否加注
     */
    add: boolean;
    /**
     * 下注额
     */
    chip: number;
    /**
     * 该玩家总下注
     */
    allChip: number;
    /**
     * 该玩家下注后剩余金额
     */
    after: number;
    /**
     * 总注池
     */
    chipPool: number;
    /**
     * 当前注
     */
    curChip: number;
};


/**
 * 弃牌请求数据接口
 */
export interface IDropReq {};


/**
 * 弃牌响应数据接口
 */
export interface DropAck {
    result: IResponseBase;
};


/**
 * 弃牌通知数据接口
 */
export interface IPlayerDropNotify {
    /**
     * 玩家座位
     */
    seat: number;
};


/**
 * 看牌请求数据接口
 */
export interface ILookReq {};


/**
 * 看牌响应数据接口
 */
export interface ILookAck {
    result: IResponseBase;
};


/**
 * 玩家看牌通知数据接口
 */
export interface IPlayerLookNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 手牌信息
     */
    hand: IHand;
    /**
     * 当前可以进行的操作
     */
    actionMask: number;
};


/**
 * 发起比牌请求数据接口
 */
export interface ILaunchCompareReq {};


/**
 * 发起比牌响应数据接口
 */
export interface ILaunchCompareAck {
    result: IResponseBase;
};


/**
 * 有人发起比牌通知数据接口
 */
export interface ILaunchCompareNotify {
    launch: number;
    target: number;
};


/**
 * 应答比牌请求数据接口
 */
export interface IAnswerCompareReq {
    agree: boolean;
};


/**
 * 应答比牌响应数据接口
 */
export interface IAnswerCompareAck {
    result: IResponseBase;
};


/**
 * 应答比牌通知数据接口
 */
export interface IAnswerCompareNotify {
    /**
     * 是否同意
     */
    agree: boolean;
    /**
     * 发起人的seat
     */
    launch: number;
    /**
     * 目标人的seat
     */
    target: number;
    /**
     * 发起人是否赢
     */
    launcherWin: boolean;
    /**
     * 自动应答, 一般最后两个玩家比牌，系统默认为自动应答。
     */
    autoAnswer: boolean;
};


/**
 * 游戏结束时的玩家数据接口
 */
export interface IGameOverPlayer {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 玩家手牌
     */
    cards: number[];
    /**
     * 玩家牌型
     */
    suit: EnumCardSuit;
    /**
     * 输赢分数
     */
    calc: number;
    /**
     * 结算后货币
     */
    after: number;
    /**
     * 玩家状态
     */
    status: EnumPlayStatus;
    /**
     * 玩家是否比过牌
     */
    handledCompare: boolean;
};

/**
 * 首充剧情补偿的数据接口
 */
export interface IPlotOffset {
    /**
     * 补偿金
     */
    offset: number;
    /**
     * 补偿后剩余
     */
    after: number;
    /**
     * 转场roomId
     */
    jumpSpace: number;
}

/**
 * 游戏结束通知数据接口
 */
export interface IGameOverNotify {
    /**
     * 玩家信息
     */
    players: IGameOverPlayer[];
    /**
     * 赢家座位
     */
    winSeat: number;
    /**
     * 注池
     */
    chipPool: number;
    /**
     * 结束原因(0弃牌，1比牌，2回合数封顶，3注池封顶)
     */
    finishReason: EnumSetFinishReason;
    /**
     * 下局倒计时(ms)
     */
    nextTimeout: number;
    /**
     * 首充剧情补偿
     */
    plotOffset: IPlotOffset;
};


/**
 * 准备充值请求数据接口
 */
export interface IPreparePaymentReq {};


/**
 * 准备充值响应数据接口
 */
export interface IPreparePaymentAck {
    result: IResponseBase;
};


/**
 * 准备充值通知数据接口
 */
export interface IPreparePaymentNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 修正超时
     */
    timeoutMs: number;
    /**
     * 支付商品
     */
    payment: IPaymentProduct;
    /**
     * 赢的概率 1298表示12.98%
     */
    winRate: number;
};


/**
 * 充值成功通知数据接口
 */
export interface IPaymentFinishNotify {
    /**
     * 玩家座位
     */
    seat: number;
    /**
     * 修正超时
     */
    timeoutMs: number;
    /**
     * 当前可以进行的操作
     */
    actionMask: number;
};


/**
 * 强制跳场通知数据接口
 */
export interface IForceJumpSpace {
    /**
     * 房间ID, 强制跳转的场id
     */
    id: number; // 强制跳转的场id
    /**
     * 强制跳场的原因
     */
    reason: string;
};

/**
 * 比牌弹框数据接口
 */
export interface ICompareCardToastInfo {
    /**
     * 发起者信息
     */
    launchInfo: {
        name: string,
        headUrl: string,
    };
    /**
     * 被发起者信息
     */
    targetInfo: {
        name: string,
        headUrl: string,
    };
}
