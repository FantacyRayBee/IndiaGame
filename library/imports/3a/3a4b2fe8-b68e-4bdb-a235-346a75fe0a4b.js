"use strict";
cc._RF.push(module, '3a4b2/oto5L26I1NGp1/gpL', 'DataDef');
// tpGame/DataDef.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCatchChip = exports.EnumPrefabPath = exports.EnumBattleStatus = exports.EnumCardSuit = exports.EnumPlayStatus = exports.EnumPlayAct = exports.EnumSetFinishReason = exports.EnumLeaveReason = exports.EnumTableStatus = exports.EnumShowBtnStr = exports.EnumBetBtnStr = exports.EnumMsgToastStyle = exports.EnumPlayerKuangType = exports.EnumAddCashType = void 0;
var EnumAddCashType;
(function (EnumAddCashType) {
    EnumAddCashType[EnumAddCashType["NONE"] = 0] = "NONE";
    EnumAddCashType[EnumAddCashType["PRACTICE"] = 1] = "PRACTICE";
    EnumAddCashType[EnumAddCashType["CASH"] = 2] = "CASH";
})(EnumAddCashType = exports.EnumAddCashType || (exports.EnumAddCashType = {}));
var EnumPlayerKuangType;
(function (EnumPlayerKuangType) {
    EnumPlayerKuangType[EnumPlayerKuangType["WITHCOIN"] = 0] = "WITHCOIN";
    EnumPlayerKuangType[EnumPlayerKuangType["WITHOUTCOIN"] = 1] = "WITHOUTCOIN";
})(EnumPlayerKuangType = exports.EnumPlayerKuangType || (exports.EnumPlayerKuangType = {}));
var EnumMsgToastStyle;
(function (EnumMsgToastStyle) {
    EnumMsgToastStyle[EnumMsgToastStyle["YES"] = 0] = "YES";
    EnumMsgToastStyle[EnumMsgToastStyle["NO"] = 1] = "NO";
    EnumMsgToastStyle[EnumMsgToastStyle["YES_NO"] = 2] = "YES_NO";
})(EnumMsgToastStyle = exports.EnumMsgToastStyle || (exports.EnumMsgToastStyle = {}));
var EnumBetBtnStr;
(function (EnumBetBtnStr) {
    EnumBetBtnStr["BLIND"] = "Blind";
    EnumBetBtnStr["CHAAL"] = "Chaal";
})(EnumBetBtnStr = exports.EnumBetBtnStr || (exports.EnumBetBtnStr = {}));
var EnumShowBtnStr;
(function (EnumShowBtnStr) {
    EnumShowBtnStr["SHOW"] = "Show";
    EnumShowBtnStr["SIDESHOW"] = "Side Show";
})(EnumShowBtnStr = exports.EnumShowBtnStr || (exports.EnumShowBtnStr = {}));
/**
 * 游戏场馆状态
 */
var EnumTableStatus;
(function (EnumTableStatus) {
    /**
     * 游戏准备阶段
     */
    EnumTableStatus[EnumTableStatus["WAIT"] = 0] = "WAIT";
    /**
     * 游戏中
     */
    EnumTableStatus[EnumTableStatus["RUNNING"] = 1] = "RUNNING";
    /**
     * 结算阶段
     */
    EnumTableStatus[EnumTableStatus["CALCULATE"] = 2] = "CALCULATE";
})(EnumTableStatus = exports.EnumTableStatus || (exports.EnumTableStatus = {}));
;
/**
 * 离开原因
 */
var EnumLeaveReason;
(function (EnumLeaveReason) {
    /**
     * 正常离开
     */
    EnumLeaveReason[EnumLeaveReason["NORMAL"] = 0] = "NORMAL";
    /**
     * 离线踢出
     */
    EnumLeaveReason[EnumLeaveReason["OFFLINE"] = 1] = "OFFLINE";
    /**
     * 破产踢出
     */
    EnumLeaveReason[EnumLeaveReason["BROKE"] = 2] = "BROKE";
    /**
     * 超时踢出
     */
    EnumLeaveReason[EnumLeaveReason["TIMEOUT"] = 3] = "TIMEOUT";
    /**
     * 房间解散踢出
     */
    EnumLeaveReason[EnumLeaveReason["ROOMCLOSE"] = 4] = "ROOMCLOSE";
    /**
     * 换桌
     */
    EnumLeaveReason[EnumLeaveReason["CHANGETABLE"] = 5] = "CHANGETABLE";
    /**
     * 强制转场
     */
    EnumLeaveReason[EnumLeaveReason["JUMPSPACE"] = 6] = "JUMPSPACE";
    /**
     * 首充剧情补偿
     */
    EnumLeaveReason[EnumLeaveReason["PLOTOFFSET"] = 7] = "PLOTOFFSET";
})(EnumLeaveReason = exports.EnumLeaveReason || (exports.EnumLeaveReason = {}));
;
/**
 * 小局结算原因
 */
var EnumSetFinishReason;
(function (EnumSetFinishReason) {
    /**
     * 弃牌
     */
    EnumSetFinishReason[EnumSetFinishReason["DROP"] = 0] = "DROP";
    /**
     * 比牌
     */
    EnumSetFinishReason[EnumSetFinishReason["COMPARE"] = 1] = "COMPARE";
    /**
     * 回合数封顶
     */
    EnumSetFinishReason[EnumSetFinishReason["ROUNDLIMIT"] = 2] = "ROUNDLIMIT";
    /**
     * 注池封顶
     */
    EnumSetFinishReason[EnumSetFinishReason["CHIPPOOLLIMIT"] = 3] = "CHIPPOOLLIMIT";
})(EnumSetFinishReason = exports.EnumSetFinishReason || (exports.EnumSetFinishReason = {}));
;
/**
 * 玩家动作
 */
var EnumPlayAct;
(function (EnumPlayAct) {
    /**
     * 空
     */
    EnumPlayAct[EnumPlayAct["NONE"] = 0] = "NONE";
    /**
     * 看牌
     */
    EnumPlayAct[EnumPlayAct["LOOK"] = 1] = "LOOK";
    /**
     * 跟注
     */
    EnumPlayAct[EnumPlayAct["FOLL"] = 2] = "FOLL";
    /**
     * 加注
     */
    EnumPlayAct[EnumPlayAct["ADD"] = 4] = "ADD";
    /**
     * 比牌
     */
    EnumPlayAct[EnumPlayAct["COMP"] = 8] = "COMP";
    /**
     * 弃牌
     */
    EnumPlayAct[EnumPlayAct["DROP"] = 16] = "DROP";
    /**
     * 应答加注
     */
    EnumPlayAct[EnumPlayAct["ANSCOMP"] = 32] = "ANSCOMP";
})(EnumPlayAct = exports.EnumPlayAct || (exports.EnumPlayAct = {}));
;
/**
 * 玩家状态
 */
var EnumPlayStatus;
(function (EnumPlayStatus) {
    /**
     * 正常
     */
    EnumPlayStatus[EnumPlayStatus["NORMAL"] = 0] = "NORMAL";
    /**
     * 弃牌
     */
    EnumPlayStatus[EnumPlayStatus["DROP"] = 1] = "DROP";
    /**
     * 比牌输了
     */
    EnumPlayStatus[EnumPlayStatus["LOST"] = 2] = "LOST";
    /**
     * 旁观
     */
    EnumPlayStatus[EnumPlayStatus["WATCH"] = 3] = "WATCH";
})(EnumPlayStatus = exports.EnumPlayStatus || (exports.EnumPlayStatus = {}));
;
/**
 * 牌的类型
 */
var EnumCardSuit;
(function (EnumCardSuit) {
    /**
     * 空
     */
    EnumCardSuit[EnumCardSuit["NONE"] = 0] = "NONE";
    /**
     * 点数
     */
    EnumCardSuit[EnumCardSuit["POINT"] = 1] = "POINT";
    /**
     * 对子
     */
    EnumCardSuit[EnumCardSuit["TWO"] = 2] = "TWO";
    /**
     * 金花
     */
    EnumCardSuit[EnumCardSuit["FLUSH"] = 3] = "FLUSH";
    /**
     * 顺子
     */
    EnumCardSuit[EnumCardSuit["STRAIGHT"] = 4] = "STRAIGHT";
    /**
     * 金顺
     */
    EnumCardSuit[EnumCardSuit["STRAIGHT_FLUSH"] = 5] = "STRAIGHT_FLUSH";
    /**
     * 豹子
     */
    EnumCardSuit[EnumCardSuit["THREE"] = 6] = "THREE";
})(EnumCardSuit = exports.EnumCardSuit || (exports.EnumCardSuit = {}));
;
/**
 * 比牌状态
 */
var EnumBattleStatus;
(function (EnumBattleStatus) {
    /**
     * 无比牌
     */
    EnumBattleStatus[EnumBattleStatus["NONE"] = 0] = "NONE";
    /**
     * 同意比牌
     */
    EnumBattleStatus[EnumBattleStatus["AGREE"] = 1] = "AGREE";
    /**
     * 拒绝比牌
     */
    EnumBattleStatus[EnumBattleStatus["REFUSE"] = 2] = "REFUSE";
})(EnumBattleStatus = exports.EnumBattleStatus || (exports.EnumBattleStatus = {}));
var EnumPrefabPath;
(function (EnumPrefabPath) {
    /**
     * 牌桌信息
     */
    EnumPrefabPath["TABLEINFO"] = "TableInfo/TableInfo";
    /**
     * 牌桌信息弹框
     */
    EnumPrefabPath["TABLEINFOTOAST"] = "TableInfo/TableInfoToast";
    /**
     * 自己玩家操作的按钮
     */
    EnumPrefabPath["ACTBTNS"] = "ActBtns/ActBtns";
    /**
     * 下注池的信息
     */
    EnumPrefabPath["TOTALCHIPS"] = "TotalChips/TotalChips";
    /**
     * 玩家信息
     */
    EnumPrefabPath["PLAYER"] = "Player/Player";
    /**
     * 玩家手牌
     */
    EnumPrefabPath["HANDCARDS"] = "HandCards/HandCards";
    /**
     * 比牌请求弹框
     */
    EnumPrefabPath["COMPARECARDTOAST"] = "CompareCard/CompareCardToast";
    /**
     * 比牌VS动画
     */
    EnumPrefabPath["COMPARECARDVS"] = "CompareCard/CompareCardVS";
    /**
     * 比牌连线动画
     */
    EnumPrefabPath["COMPARECARDLINE"] = "CompareCard/CompareCardLine";
    /**
     * 玩家下注的总金额
     */
    EnumPrefabPath["BETINFO"] = "BetInfo/BetInfo";
    /**
     * 筹码
     */
    EnumPrefabPath["CHIP"] = "Chip/Chip";
    /**
     * 充值弹框
     */
    EnumPrefabPath["RECHARGETOAST"] = "RechargeToast/RechargeToast";
    /**
     * 自己的充值提示
     */
    EnumPrefabPath["OWNRECHARGETIP"] = "RechargeToast/OwnRechargeTip";
    /**
     * Hint提示界面
     */
    EnumPrefabPath["HINT"] = "Hint/Hint";
    /**
     * 轮次信息
     */
    EnumPrefabPath["ROUNDLINFO"] = "RoundInfo/RoundInfo";
    /**
     * 消息提示
     */
    EnumPrefabPath["MSGTOAST"] = "MsgToast/MsgToast";
    /**
     * 等待开始提示
     */
    EnumPrefabPath["WAITSTARTTIP"] = "WaitStartTip/WaitStartTip";
    /**
     * 单张牌
     */
    EnumPrefabPath["SINGLECARD"] = "SingleCard/SingleCard";
    /**
     * 充值按钮
     */
    EnumPrefabPath["ADDCASH"] = "AddCash/AddCash";
    /**
     * 幸运玩家
     */
    EnumPrefabPath["LUCKYPLAYER"] = "LuckyPlayer/LuckyPlayer";
})(EnumPrefabPath = exports.EnumPrefabPath || (exports.EnumPrefabPath = {}));
var EnumCatchChip;
(function (EnumCatchChip) {
    EnumCatchChip[EnumCatchChip["NONE"] = 0] = "NONE";
    EnumCatchChip[EnumCatchChip["BLIND"] = 1] = "BLIND";
    EnumCatchChip[EnumCatchChip["BLINDx2"] = 2] = "BLINDx2";
    EnumCatchChip[EnumCatchChip["CHAAL"] = 3] = "CHAAL";
    EnumCatchChip[EnumCatchChip["CHAALx2"] = 4] = "CHAALx2";
})(EnumCatchChip = exports.EnumCatchChip || (exports.EnumCatchChip = {}));
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;

cc._RF.pop();