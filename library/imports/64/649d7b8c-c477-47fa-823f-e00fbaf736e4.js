"use strict";
cc._RF.push(module, '649d7uMxHdH+oI/4A+69zbk', 'PlayerCtrl');
// tpGame/Player/PlayerCtrl.ts

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
var DataDef_1 = require("../DataDef");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var PlayerCtrl = /** @class */ (function (_super) {
    __extends(PlayerCtrl, _super);
    function PlayerCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_name = null;
        _this.lab_coin = null;
        _this.node_state = null;
        _this.lab_stateTip = null;
        _this.node_offLine = null;
        _this.lab_time = null;
        _this.sprite_head = null;
        _this.node_actTime = null;
        _this.sp_time = null;
        _this.sp_win = null;
        _this.sp_lost = null;
        _this.node_battleAgree = null;
        _this.node_battleRefuse = null;
        _this.node_shop = null;
        _this.btn_gift = null;
        _this.sprite_kuang = null;
        _this.spriteF_withCoin = null;
        _this.spriteF_withoutCoin = null;
        _this._playerActTimer = 0;
        _this._playerPid = -1;
        _this._playerName = "";
        _this._playerHeadUrl = "";
        _this._playerCoin = 0;
        _this._playerState = DataDef_1.EnumPlayStatus.NORMAL;
        _this._playerSeat = -1;
        return _this;
    }
    PlayerCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_gift.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    PlayerCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        //@ts-ignore
        CommonFun.getInstance().showGameGifInteraction(this._playerSeat);
    };
    PlayerCtrl.prototype.onDestroy = function () {
        this._clearPlayerActTimer();
    };
    PlayerCtrl.prototype.initPlayer = function () {
        this._clearPlayerActTimer();
        this.unscheduleAllCallbacks();
        this.setPlayerSeat(-1);
        this.setPlayerPid(-1);
        this.setPlayerName("");
        this.setPlayerCoin(-1);
        this.setPlayerStateValue(DataDef_1.EnumPlayStatus.NORMAL);
        this.setPlayerStatePerformance();
        this.setPlayerActTime(0);
        this._setPlayerWinPerformanceNodeActive(false);
        this._setPlayerLostPerformanceNodeActive(false);
        this.setPlayerBattlePerformance(DataDef_1.EnumBattleStatus.NONE);
        this.setPlayerOffLineActive(false);
        this.setPlayerShopActive(false);
        this.setPlayerStyle(0);
        this.setPlayerKuang(DataDef_1.EnumPlayerKuangType.WITHCOIN);
    };
    /**
     * 重置玩家表现(除玩家名字和金币以外)
     */
    PlayerCtrl.prototype.resetPlayerPerformance = function () {
        this.unscheduleAllCallbacks();
        this.setPlayerStateValue(DataDef_1.EnumPlayStatus.NORMAL);
        this.setPlayerStatePerformance();
        this.setPlayerActTime(0);
        this._setPlayerWinPerformanceNodeActive(false);
        this._setPlayerLostPerformanceNodeActive(false);
        this.setPlayerBattlePerformance(DataDef_1.EnumBattleStatus.NONE);
        this.setPlayerShopActive(false);
    };
    /**
     * 设置玩家框的类型
     * @param type
     */
    PlayerCtrl.prototype.setPlayerKuang = function (type) {
        switch (type) {
            case DataDef_1.EnumPlayerKuangType.WITHCOIN:
                this.lab_coin.node.active = true;
                this.sprite_kuang.spriteFrame = this.spriteF_withCoin;
                break;
            case DataDef_1.EnumPlayerKuangType.WITHOUTCOIN:
                this.lab_coin.node.active = false;
                this.sprite_kuang.spriteFrame = this.spriteF_withoutCoin;
                break;
            default:
                break;
        }
    };
    /**
     * 设置玩家PlayerId
     * @param pid 玩家PlayerId
     */
    PlayerCtrl.prototype.setPlayerPid = function (pid) {
        this._playerPid = pid;
    };
    /**
     * 获取玩家PlayerId
     * @returns 玩家PlayerId
     */
    PlayerCtrl.prototype.getPlayerPid = function () {
        return this._playerPid;
    };
    /**
     * 设置玩家座位号
     * @param seat 座位号
     */
    PlayerCtrl.prototype.setPlayerSeat = function (seat) {
        this._playerSeat = seat;
    };
    /**
     * 设置玩家昵称
     * @param name 玩家昵称
     */
    PlayerCtrl.prototype.setPlayerName = function (name) {
        //@ts-ignore
        this.lab_name.string = CommonFun.getInstance().getStrByLength(name, 8);
        this._playerName = name;
    };
    /**
     * 获取玩家昵称
     * @returns 玩家昵称
     */
    PlayerCtrl.prototype.getPlayerName = function () {
        return this._playerName;
    };
    /**
     * 设置玩家金币，会进行单位转化，除以100。
     * @param coin 玩家金币
     */
    PlayerCtrl.prototype.setPlayerCoin = function (coin) {
        if (coin >= 0) {
            //@ts-ignore
            this.lab_coin.string = "" + CommonFun.getInstance().numberToShow(coin / 100);
        }
        else {
            this.lab_coin.string = "";
        }
        ;
        this._playerCoin = coin;
    };
    /**
     * 获取玩家金币
     * @returns 玩家金币
     */
    PlayerCtrl.prototype.getPlayerCoin = function () {
        return this._playerCoin;
    };
    /**
     * 设置玩家头像
     * @param headUrl 玩家头像地址
     */
    PlayerCtrl.prototype.setPlayerHead = function (headUrl) {
        var _this = this;
        cc.assetManager.loadRemote(headUrl, { ext: '.png' }, function (err, texture) {
            if (!err && cc.isValid(_this, true) && cc.isValid(_this.sprite_head, true)) {
                var spriteFrame = new cc.SpriteFrame(texture);
                _this.sprite_head.spriteFrame = spriteFrame;
                _this.sprite_head.node.setContentSize(cc.size(105, 105));
            }
            ;
        });
        this._playerHeadUrl = headUrl;
    };
    /**
     * 获取玩家头像地址
     * @returns 玩家头像地址
     */
    PlayerCtrl.prototype.getPlayerHeadUrl = function () {
        return this._playerHeadUrl;
    };
    /**
     * 设置玩家状态的值。
     * @param state 指定的播放状态，来自EnumPlayStatus枚举。
     */
    PlayerCtrl.prototype.setPlayerStateValue = function (state) {
        this._playerState = state;
    };
    /**
     * 获取玩家状态的值。
     * @returns 玩家状态的值。
     */
    PlayerCtrl.prototype.getPlayerStateValue = function () {
        return this._playerState;
    };
    /**
     * 设置玩家状态表现
     */
    PlayerCtrl.prototype.setPlayerStatePerformance = function () {
        var state = this.getPlayerStateValue();
        switch (state) {
            case DataDef_1.EnumPlayStatus.NORMAL:
                this.lab_stateTip.string = "";
                this.node_state.active = false;
                break;
            case DataDef_1.EnumPlayStatus.DROP:
                this.lab_stateTip.string = "PACKED";
                this.node_state.active = true;
                break;
            case DataDef_1.EnumPlayStatus.LOST:
                this.lab_stateTip.string = "LOST";
                this.node_state.active = true;
                break;
            case DataDef_1.EnumPlayStatus.WATCH:
                this.lab_stateTip.string = "WATCH";
                this.node_state.active = true;
                break;
            default:
                this.lab_stateTip.string = "";
                this.node_state.active = false;
                break;
        }
        ;
        this._playerState = state;
    };
    /**
     * 设置玩家的可操作时间。当时间减少到 0 时，玩家操作将被禁用，界面相应元素将被隐藏。单位为秒
     * @param time 玩家可操作的时间，以秒为单位。如果此值小于等于 0，则立即禁用玩家操作并隐藏相关界面元素。
     */
    PlayerCtrl.prototype.setPlayerActTime = function (time) {
        var _this = this;
        if (time > 0) {
            this._clearPlayerActTimer();
            this.node_actTime.active = true;
            this.lab_time.string = "" + time;
            this.sp_time.clearTrack(0);
            this.sp_time.setAnimation(0, 'animation', true);
            var actFun = function () {
                time -= 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_time, true)) == false) {
                    clearInterval(loaclPlayerActTimer_1);
                    loaclPlayerActTimer_1 = null;
                    return;
                }
                ;
                if (time <= 0) {
                    _this._clearPlayerActTimer();
                    _this.sp_time.clearTrack(0);
                    _this.lab_time.string = "";
                    _this.node_actTime.active = false;
                    return;
                }
                ;
                _this.lab_time.string = "" + time;
            };
            var loaclPlayerActTimer_1 = setInterval(actFun, 1000);
            this._playerActTimer = loaclPlayerActTimer_1;
        }
        else {
            this._clearPlayerActTimer();
            this.sp_time.clearTrack(0);
            this.lab_time.string = "";
            this.node_actTime.active = false;
            this.lab_time.node.color = new cc.Color(255, 255, 255, 255);
            this.sp_time.node.color = new cc.Color(255, 255, 255, 255);
        }
        ;
    };
    PlayerCtrl.prototype._clearPlayerActTimer = function () {
        if (this._playerActTimer !== null) {
            clearInterval(this._playerActTimer);
            this._playerActTimer = null;
        }
        ;
    };
    PlayerCtrl.prototype._setPlayerWinPerformanceNodeActive = function (active) {
        this.sp_win.clearTracks();
        this.sp_win.node.active = active;
    };
    ;
    /**
     * 设置玩家赢牌动画表现（静态的）
     */
    PlayerCtrl.prototype.setPlayerWinStaticPerformance = function () {
        this._setPlayerWinPerformanceNodeActive(true);
        this.sp_win.setAnimation(0, 'loop', true);
    };
    /**
     * 设置玩家赢牌动画表现（动态的）
     */
    PlayerCtrl.prototype.setPlayerWinDynamicPerformance = function () {
        var _this = this;
        this._setPlayerWinPerformanceNodeActive(true);
        this.sp_win.setAnimation(0, 'star', false);
        this.sp_win.setCompleteListener(function (trackEntry, loopCount) {
            var name = trackEntry.animation.name;
            if (name === "star") {
                _this.sp_win.setAnimation(0, 'loop', true);
            }
            ;
        });
    };
    PlayerCtrl.prototype._setPlayerLostPerformanceNodeActive = function (active) {
        this.sp_lost.clearTracks();
        this.sp_lost.node.active = active;
    };
    /**
     * 设置玩家输牌动画表现
     */
    PlayerCtrl.prototype.setPlayerLostPerformance = function () {
        var _this = this;
        this._setPlayerLostPerformanceNodeActive(true);
        this.sp_lost.setAnimation(0, 'animation', false);
        this.sp_lost.setCompleteListener(function (trackEntry, loopCount) {
            var name = trackEntry.animation.name;
            if (name === "animation") {
                _this._setPlayerLostPerformanceNodeActive(false);
            }
            ;
        });
    };
    /**
     * 设置玩家比牌状态
     * @param battleStatus 比牌状态
     */
    PlayerCtrl.prototype.setPlayerBattlePerformance = function (battleStatus) {
        this.unschedule(this._setPlayerBattleActiveFalse);
        switch (battleStatus) {
            case DataDef_1.EnumBattleStatus.NONE:
                this.node_battleAgree.active = false;
                this.node_battleRefuse.active = false;
                break;
            case DataDef_1.EnumBattleStatus.AGREE:
                this.node_battleAgree.active = true;
                this.node_battleRefuse.active = false;
                this.scheduleOnce(this._setPlayerBattleActiveFalse, 2);
                break;
            case DataDef_1.EnumBattleStatus.REFUSE:
                this.node_battleAgree.active = false;
                this.node_battleRefuse.active = true;
                this.scheduleOnce(this._setPlayerBattleActiveFalse, 2);
                break;
        }
        ;
    };
    PlayerCtrl.prototype._setPlayerBattleActiveFalse = function () {
        this.node_battleAgree.active = false;
        this.node_battleRefuse.active = false;
    };
    /**
     * 设置玩家是否显示离线
     * @param active 是否显示
     */
    PlayerCtrl.prototype.setPlayerOffLineActive = function (active) {
        this.node_offLine.active = active;
    };
    /**
     * 设置玩家是否显示充值
     * @param active 是否显示
     */
    PlayerCtrl.prototype.setPlayerShopActive = function (active) {
        this.node_shop.active = active;
    };
    PlayerCtrl.prototype.setPlayerStyle = function (posIndex) {
        this.btn_gift.node.setPosition(cc.v2((posIndex == 1 || posIndex == 2) ? 54 : -54, 0));
    };
    __decorate([
        property(cc.Label)
    ], PlayerCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Label)
    ], PlayerCtrl.prototype, "lab_coin", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_state", void 0);
    __decorate([
        property(cc.Label)
    ], PlayerCtrl.prototype, "lab_stateTip", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_offLine", void 0);
    __decorate([
        property(cc.Label)
    ], PlayerCtrl.prototype, "lab_time", void 0);
    __decorate([
        property(cc.Sprite)
    ], PlayerCtrl.prototype, "sprite_head", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_actTime", void 0);
    __decorate([
        property(sp.Skeleton)
    ], PlayerCtrl.prototype, "sp_time", void 0);
    __decorate([
        property(sp.Skeleton)
    ], PlayerCtrl.prototype, "sp_win", void 0);
    __decorate([
        property(sp.Skeleton)
    ], PlayerCtrl.prototype, "sp_lost", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_battleAgree", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_battleRefuse", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerCtrl.prototype, "node_shop", void 0);
    __decorate([
        property(cc.Button)
    ], PlayerCtrl.prototype, "btn_gift", void 0);
    __decorate([
        property(cc.Sprite)
    ], PlayerCtrl.prototype, "sprite_kuang", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], PlayerCtrl.prototype, "spriteF_withCoin", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], PlayerCtrl.prototype, "spriteF_withoutCoin", void 0);
    PlayerCtrl = __decorate([
        ccclass,
        menu('tpGame/PlayerCtrl')
    ], PlayerCtrl);
    return PlayerCtrl;
}(cc.Component));
exports.default = PlayerCtrl;
;

cc._RF.pop();