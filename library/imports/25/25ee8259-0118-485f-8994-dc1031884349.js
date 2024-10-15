"use strict";
cc._RF.push(module, '25ee8JZARhIX4mU3BAxiENJ', 'HandCardsCtrl');
// tpGame/HandCards/HandCardsCtrl.ts

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
var HandCardsCtrl = /** @class */ (function (_super) {
    __extends(HandCardsCtrl, _super);
    function HandCardsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprite_card0 = null;
        _this.sprite_card1 = null;
        _this.sprite_card2 = null;
        _this.atlas_card = null;
        _this.node_staticCardSuit = null;
        _this.lab_staticCardSuitTip = null;
        _this.node_dynamicCardSuit = null;
        _this.sp_dynamicCardSuit = null;
        _this.sp_catchChipType = null;
        _this.pb_cardPower = null;
        _this.node_cardSeen = null;
        _this.btn_see = null;
        _this.node_winScore = null;
        _this.lab_winScore = null;
        _this._handCardsValueArr = [];
        _this._cardSeenValue = false;
        _this._handCardsSuitValue = DataDef_1.EnumCardSuit.NONE;
        _this._winScoreTweenY = 0;
        return _this;
    }
    HandCardsCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_see.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    HandCardsCtrl.prototype.btnClickCall = function (btn) {
        var btnName = btn.node.name;
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        //@ts-ignore
        GameServerManager.send("gameservice.look", "LookReq", {});
    };
    HandCardsCtrl.prototype.initHandCards = function () {
        this.unscheduleAllCallbacks();
        this.setHandCardsValueArr([]);
        this.setHandCardsBackPerformance();
        this.setHandCardsSeenValue(false);
        this.setHandCardsSuitValue(DataDef_1.EnumCardSuit.NONE);
        this.setHandCardsStaticSuitPerformance();
        this.setHandCardsDynamicSuitPerformance();
        this.setHandCardsCatchChipPerformance(DataDef_1.EnumCatchChip.NONE);
        this.setHandCardsSeenPerformanceActive(false);
        this.setHandCardsGrayPerfomanceActive(false);
        this.setHandCardsPowerPerformance(0);
        this.setHandCardsBtnSeeActive(false);
        this.setHandCardsStyle(false);
        this.setHandCardsWinScorePerformance(0);
    };
    /**
     * 设置手牌牌值数组
     * @param valueArr 牌值数组
     */
    HandCardsCtrl.prototype.setHandCardsValueArr = function (valueArr) {
        if (valueArr.length != 3) {
            return;
        }
        ;
        valueArr = this._cardValueArrSort(valueArr);
        this._handCardsValueArr = valueArr;
    };
    /**
     * 获取手牌牌值数组
     * @returns 返回手牌牌值数组
     */
    HandCardsCtrl.prototype.getHandCardsValueArr = function () {
        return this._handCardsValueArr;
    };
    /**
     * 设置手牌牌型值
     * @param suitValue 牌型值
     */
    HandCardsCtrl.prototype.setHandCardsSuitValue = function (suitValue) {
        this._handCardsSuitValue = suitValue;
    };
    /**
     * 获取手牌牌型值
     * @returns 返回手牌牌型值
     */
    HandCardsCtrl.prototype.getHandCardsSuitValue = function () {
        return this._handCardsSuitValue;
    };
    /**
     * 设置手牌牌型表现（黑框+文字形式）
     * @param suit 牌型
     */
    HandCardsCtrl.prototype.setHandCardsStaticSuitPerformance = function () {
        var suitValue = this.getHandCardsSuitValue();
        switch (suitValue) {
            case DataDef_1.EnumCardSuit.NONE:
                this.node_staticCardSuit.active = false;
                this.lab_staticCardSuitTip.string = "";
                break;
            case DataDef_1.EnumCardSuit.POINT:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "High Card";
                break;
            case DataDef_1.EnumCardSuit.TWO:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Pair";
                break;
            case DataDef_1.EnumCardSuit.FLUSH:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Color";
                break;
            case DataDef_1.EnumCardSuit.STRAIGHT:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Sequence";
                break;
            case DataDef_1.EnumCardSuit.STRAIGHT_FLUSH:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Pure Seq";
                break;
            case DataDef_1.EnumCardSuit.THREE:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Set";
                break;
            default:
                this.node_staticCardSuit.active = false;
                this.lab_staticCardSuitTip.string = "";
                break;
        }
    };
    /**
     * 设置手牌牌型表现（spine动效形式）
     */
    HandCardsCtrl.prototype.setHandCardsDynamicSuitPerformance = function () {
        var suitValue = this.getHandCardsSuitValue();
        var skinName = "";
        switch (suitValue) {
            case DataDef_1.EnumCardSuit.NONE:
                skinName = "";
                break;
            case DataDef_1.EnumCardSuit.POINT:
                skinName = "highcard";
                break;
            case DataDef_1.EnumCardSuit.TWO:
                skinName = "pair";
                break;
            case DataDef_1.EnumCardSuit.FLUSH:
                skinName = "color";
                break;
            case DataDef_1.EnumCardSuit.STRAIGHT:
                skinName = "sequence";
                break;
            case DataDef_1.EnumCardSuit.STRAIGHT_FLUSH:
                skinName = "pureseq";
                break;
            case DataDef_1.EnumCardSuit.THREE:
                skinName = "set";
                break;
            default:
                skinName = "";
                break;
        }
        ;
        this.sp_dynamicCardSuit.clearTrack(0);
        if (skinName.length == 0) {
            this.node_dynamicCardSuit.active = false;
            return;
        }
        ;
        this.node_dynamicCardSuit.active = true;
        this.sp_dynamicCardSuit.setSkin(skinName);
        this.sp_dynamicCardSuit.setAnimation(0, "chuxian", false);
    };
    /**
     * 设置手牌下注的操作类型表现
     * @param catchChipType 下注的操作类型
     */
    HandCardsCtrl.prototype.setHandCardsCatchChipPerformance = function (catchChipType) {
        var skinName = "";
        switch (catchChipType) {
            case DataDef_1.EnumCatchChip.NONE:
                skinName = "";
                break;
            case DataDef_1.EnumCatchChip.BLIND:
                skinName = "blind";
                break;
            case DataDef_1.EnumCatchChip.BLINDx2:
                skinName = "blindx2";
                break;
            case DataDef_1.EnumCatchChip.CHAAL:
                skinName = "chaal";
                break;
            case DataDef_1.EnumCatchChip.CHAALx2:
                skinName = "chaalx2";
                break;
            default:
                skinName = "";
                break;
        }
        ;
        this.sp_catchChipType.clearTracks();
        if (skinName.length == 0) {
            this.sp_catchChipType.node.active = false;
            return;
        }
        ;
        this.sp_catchChipType.node.active = true;
        this.sp_catchChipType.setSkin(skinName);
        this.sp_catchChipType.setAnimation(0, "chuxian", false);
    };
    /**
     * 设置手牌是否已看牌
     * @param seenValue 是否已看牌
     */
    HandCardsCtrl.prototype.setHandCardsSeenValue = function (seenValue) {
        this._cardSeenValue = seenValue;
    };
    /**
     * 获取手牌是否已看牌
     * @returns 是否已看牌
     */
    HandCardsCtrl.prototype.getHandCardsSeenValue = function () {
        return this._cardSeenValue;
    };
    /**
     * 设置是否显示“SEEN”文字的表现
     * @param active
     */
    HandCardsCtrl.prototype.setHandCardsSeenPerformanceActive = function (active) {
        this.node_cardSeen.active = active;
    };
    /**
     * 设置手牌是否显示灰色表现
     * @param active
     */
    HandCardsCtrl.prototype.setHandCardsGrayPerfomanceActive = function (active) {
        if (active) {
            this.sprite_card0.node.color = new cc.Color(139, 139, 122, 255);
            this.sprite_card1.node.color = new cc.Color(139, 139, 122, 255);
            this.sprite_card2.node.color = new cc.Color(139, 139, 122, 255);
        }
        else {
            this.sprite_card0.node.color = new cc.Color(255, 255, 255, 255);
            this.sprite_card1.node.color = new cc.Color(255, 255, 255, 255);
            this.sprite_card2.node.color = new cc.Color(255, 255, 255, 255);
        }
        ;
    };
    /**
     * 设置手牌进行翻牌表现
     */
    HandCardsCtrl.prototype.setHandCardsFlopPerformance = function () {
        var _this = this;
        var cardVauleArr = this.getHandCardsValueArr();
        var _loop_1 = function (i) {
            var cardValue = cardVauleArr[i];
            var spriteCard = this_1["sprite_card" + i];
            cc.tween(spriteCard.node)
                .to(0.1, { scaleX: 0 })
                .call(function () {
                spriteCard.spriteFrame = _this.atlas_card.getSpriteFrame("" + cardValue);
            })
                .to(0.1, { scaleX: 1 })
                .start();
        };
        var this_1 = this;
        for (var i = 0; i < 3; i++) {
            _loop_1(i);
        }
        ;
    };
    /**
     * 设置手牌正面显示表现
     */
    HandCardsCtrl.prototype.setHandCardsFrontPerformance = function () {
        var cardVauleArr = this.getHandCardsValueArr();
        for (var i = 0; i < 3; i++) {
            var cardValue = cardVauleArr[i];
            var spriteCard = this["sprite_card" + i];
            spriteCard.spriteFrame = this.atlas_card.getSpriteFrame("" + cardValue);
        }
        ;
    };
    /**
     * 设置手牌背面显示表现
     */
    HandCardsCtrl.prototype.setHandCardsBackPerformance = function () {
        for (var i = 0; i < 3; i++) {
            var spriteCard = this["sprite_card" + i];
            spriteCard.node.stopAllActions();
            spriteCard.node.scaleX = 1;
            spriteCard.spriteFrame = this.atlas_card.getSpriteFrame("52");
        }
        ;
    };
    /**
     * 设置手牌样式
     * @param isOwn 是否是自己玩家的手牌
     */
    HandCardsCtrl.prototype.setHandCardsStyle = function (isOwn) {
        if (isOwn) {
            for (var i = 0; i < 3; i++) {
                var spriteCard = this["sprite_card" + i];
                spriteCard.node.setContentSize(cc.size(128.7, 166.1));
                spriteCard.node.setPosition(cc.v3(50 * (i - 1), 0));
            }
            ;
            this.node_dynamicCardSuit.setPosition(cc.v3(0, -38));
            this.sp_catchChipType.node.setPosition(cc.v3(0, 110));
            this._winScoreTweenY = 110;
        }
        else {
            for (var i = 0; i < 3; i++) {
                var spriteCard = this["sprite_card" + i];
                spriteCard.node.setContentSize(cc.size(109.4, 141.2));
                spriteCard.node.setPosition(cc.v3(40 * (i - 1), 0));
            }
            ;
            this.node_dynamicCardSuit.setPosition(cc.v3(0, -38));
            this.sp_catchChipType.node.setPosition(cc.v3(0, 100));
            this._winScoreTweenY = 100;
        }
        ;
    };
    HandCardsCtrl.prototype._cardValueArrSort = function (cardVauleArr) {
        /**
         * 如果第一个参数应该位于第二个之前则返回一个负数;
         * 如果两个参数相等则返回0;
         * 如果第一个参数应该位于第二个参数之后则返回一个正数。
         **/
        cardVauleArr = cardVauleArr.sort(function (a, b) {
            if (a % 13 == 0 && b % 13 == 0) {
                return a - b;
            }
            else if (a % 13 == 0 && b % 13 > 0) {
                return 1;
            }
            else if (a % 13 > 0 && b % 13 == 0) {
                return -1;
            }
            else {
                return a % 13 - b % 13;
            }
            ;
        });
        if (cardVauleArr[0] % 13 == 1 && cardVauleArr[1] % 13 == 2 && cardVauleArr[2] % 13 == 0) {
            var temp0 = cardVauleArr[0];
            var temp1 = cardVauleArr[1];
            var temp2 = cardVauleArr[2];
            cardVauleArr[0] = temp2;
            cardVauleArr[1] = temp0;
            cardVauleArr[2] = temp1;
        }
        ;
        return cardVauleArr;
    };
    /**
     * 设置牌力显示表现，若power<=0，则不显示。
     * @param power 牌力值
     */
    HandCardsCtrl.prototype.setHandCardsPowerPerformance = function (power) {
        var _this = this;
        if (power <= 0) {
            this.pb_cardPower.node.active = false;
            this.pb_cardPower.progress = 0;
        }
        else {
            this.pb_cardPower.node.active = true;
            var progress_1 = 0.0;
            var repeat = Math.ceil(power / 10) - 1;
            var step_1 = power / 100 / (repeat + 1);
            this.pb_cardPower.progress = progress_1;
            this.pb_cardPower.schedule(function () {
                progress_1 += step_1;
                _this.pb_cardPower.progress = progress_1;
            }, 0.02, repeat, 0);
        }
        ;
    };
    /**
     * 设置看牌按钮是否显示
     * @param active
     */
    HandCardsCtrl.prototype.setHandCardsBtnSeeActive = function (active) {
        this.btn_see.node.active = active;
    };
    /**
     * 设置玩家赢分飘分表现
     * @param score
     */
    HandCardsCtrl.prototype.setHandCardsWinScorePerformance = function (score) {
        var _this = this;
        this.lab_winScore.node.stopAllActions();
        if (score <= 0) {
            this.node_winScore.setPosition(cc.v3(0, -40));
            this.node_winScore.active = false;
        }
        else {
            this.node_winScore.active = true;
            this.node_winScore.setPosition(cc.v3(0, -40));
            this.lab_winScore.string = "j" + score / 100;
            cc.tween(this.node_winScore)
                .to(0.5, { position: cc.v3(0, this._winScoreTweenY) })
                .delay(1)
                .call(function () {
                _this.setHandCardsWinScorePerformance(0);
            })
                .start();
        }
        ;
    };
    __decorate([
        property(cc.Sprite)
    ], HandCardsCtrl.prototype, "sprite_card0", void 0);
    __decorate([
        property(cc.Sprite)
    ], HandCardsCtrl.prototype, "sprite_card1", void 0);
    __decorate([
        property(cc.Sprite)
    ], HandCardsCtrl.prototype, "sprite_card2", void 0);
    __decorate([
        property(cc.SpriteAtlas)
    ], HandCardsCtrl.prototype, "atlas_card", void 0);
    __decorate([
        property(cc.Node)
    ], HandCardsCtrl.prototype, "node_staticCardSuit", void 0);
    __decorate([
        property(cc.Label)
    ], HandCardsCtrl.prototype, "lab_staticCardSuitTip", void 0);
    __decorate([
        property(cc.Node)
    ], HandCardsCtrl.prototype, "node_dynamicCardSuit", void 0);
    __decorate([
        property(sp.Skeleton)
    ], HandCardsCtrl.prototype, "sp_dynamicCardSuit", void 0);
    __decorate([
        property(sp.Skeleton)
    ], HandCardsCtrl.prototype, "sp_catchChipType", void 0);
    __decorate([
        property(cc.ProgressBar)
    ], HandCardsCtrl.prototype, "pb_cardPower", void 0);
    __decorate([
        property(cc.Node)
    ], HandCardsCtrl.prototype, "node_cardSeen", void 0);
    __decorate([
        property(cc.Button)
    ], HandCardsCtrl.prototype, "btn_see", void 0);
    __decorate([
        property(cc.Node)
    ], HandCardsCtrl.prototype, "node_winScore", void 0);
    __decorate([
        property(cc.Label)
    ], HandCardsCtrl.prototype, "lab_winScore", void 0);
    HandCardsCtrl = __decorate([
        ccclass,
        menu('tpGame/HandCardsCtrl')
    ], HandCardsCtrl);
    return HandCardsCtrl;
}(cc.Component));
exports.default = HandCardsCtrl;

cc._RF.pop();