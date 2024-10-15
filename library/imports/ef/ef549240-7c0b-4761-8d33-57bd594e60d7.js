"use strict";
cc._RF.push(module, 'ef549JAfAtHYY0zV71ZTmDX', 'ActBtnsCtrl');
// tpGame/ActBtns/ActBtnsCtrl.ts

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
exports.ActBtnsCtrl = void 0;
var DataDef_1 = require("../DataDef");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var ActBtnsCtrl = /** @class */ (function (_super) {
    __extends(ActBtnsCtrl, _super);
    function ActBtnsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_pack = null;
        _this.btn_add = null;
        _this.btn_reduce = null;
        _this.btn_bet = null;
        _this.btn_show = null;
        _this.lab_btnBet = null;
        _this.lab_btnShow = null;
        _this.lab_selectChipAmount = null;
        _this.node_recharge = null;
        _this.btn_recharge = null;
        _this.lab_rechargeTip = null;
        _this.sp_betScan = null;
        _this._isAddChipAmount = false;
        _this._chipAmount = 0;
        _this._nodeActive = false;
        _this._rechargeTimer = null;
        _this._rechargeActTime = 0;
        _this._rechargeProduct = null;
        _this._tpGameCtrl = null;
        _this._winRate = null;
        _this._betScaneTimer = null;
        return _this;
    }
    ActBtnsCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_add.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_reduce.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_bet.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_show.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_recharge.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    ActBtnsCtrl.prototype.onDestroy = function () {
        this._clearRechargeActTimer();
        this._clearBetScaneTimer();
    };
    ActBtnsCtrl.prototype.initActBtns = function (tpGameCtrl) {
        this._tpGameCtrl = tpGameCtrl;
        this.setActBtnsBetBtnString(DataDef_1.EnumBetBtnStr.BLIND);
        this.setActBtnsShowBtnString(DataDef_1.EnumShowBtnStr.SIDESHOW);
    };
    ActBtnsCtrl.prototype.btnClickCall = function (btn) {
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_pack.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnPackEvent();
                break;
            case this.btn_add.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnAddEvent();
                break;
            case this.btn_reduce.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnReduceEvent();
                break;
            case this.btn_bet.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnBetEvent();
                break;
            case this.btn_show.node.name:
                this._tpGameCtrl.tpGameAudioCtrl.playClickBtnShowEffect();
                this.dealBtnShowEvent();
                break;
            case this.btn_recharge.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnRechargeEvent();
                break;
            default:
                break;
        }
    };
    ActBtnsCtrl.prototype.dealBtnPackEvent = function () {
        if (this._winRate === null) {
            //@ts-ignore
            GameServerManager.send("gameservice.drop", "DropReq", {});
        }
        else {
            this._tpGameCtrl.hintCtrl.setHitWinRate(this._winRate);
            this._tpGameCtrl.hintCtrl.setHintActive(true);
        }
        ;
    };
    ActBtnsCtrl.prototype.dealBtnAddEvent = function () {
        this._isAddChipAmount = true;
        this._chipAmount = this._chipAmount * 2;
        this.lab_selectChipAmount.string = "" + this._chipAmount / 100;
        this._setAddBtnInteractable(false);
        this._setReduceBtnInteractable(true);
    };
    ActBtnsCtrl.prototype.dealBtnReduceEvent = function () {
        this._isAddChipAmount = false;
        this._chipAmount = this._chipAmount / 2;
        this.lab_selectChipAmount.string = "" + this._chipAmount / 100;
        this._setAddBtnInteractable(true);
        this._setReduceBtnInteractable(false);
    };
    ActBtnsCtrl.prototype.dealBtnBetEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.chip", "ChipReq", { add: this._isAddChipAmount });
    };
    ActBtnsCtrl.prototype.dealBtnShowEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.launchcompare", "LaunchCompareReq", {});
    };
    ActBtnsCtrl.prototype.dealBtnRechargeEvent = function () {
        this._tpGameCtrl.rechargeToastCtrl.setRechargeToastActive(true);
        this._tpGameCtrl.rechargeToastCtrl.setRechargeToastData(this._rechargeProduct, this._rechargeActTime);
    };
    /**
     * 设置ActBtns的节点是否显示
     * @param active 是否显示
     */
    ActBtnsCtrl.prototype.setActBtnsNodeActive = function (active) {
        this._nodeActive = active;
        this.node.active = active;
    };
    /**
     * 获取ActBtns的节点是否显示
     * @returns 节点是否显示
     */
    ActBtnsCtrl.prototype.getActBtnsNodeActive = function () {
        return this._nodeActive;
    };
    /**
     * 根据动作码数组设置对应的按钮是否可点击
     * @param canActValueArr 可进行的动作码数组
     */
    ActBtnsCtrl.prototype.setActBtnsInteractableByActValueArr = function (canActValueArr) {
        this._setBetBtnInteractable(canActValueArr.indexOf(2) != -1);
        this._setAddBtnInteractable(canActValueArr.indexOf(4) != -1);
        this._setShowBtnInteractable(canActValueArr.indexOf(8) != -1);
        this._setPackBtnInteractable(canActValueArr.indexOf(16) != -1);
        this._setReduceBtnInteractable(false);
        this._isAddChipAmount = false;
    };
    /**
     * 设置下注按钮文字显示
     * @param str
     */
    ActBtnsCtrl.prototype.setActBtnsBetBtnString = function (str) {
        this.lab_btnBet.string = str;
    };
    /**
     * 设置比牌按钮文字显示
     * @param str
     */
    ActBtnsCtrl.prototype.setActBtnsShowBtnString = function (str) {
        this.lab_btnShow.string = str;
    };
    /**
     * 设置当前欲投筹码的额度
     * @param amount
     */
    ActBtnsCtrl.prototype.setActBtnsChipAmount = function (amount) {
        this._chipAmount = amount;
        this.lab_selectChipAmount.string = "" + this._chipAmount / 100;
    };
    /**
     * 正好是自己玩家操作时，期间看牌了，筹码要翻倍。
     */
    ActBtnsCtrl.prototype.updateActBtnsChipAmountBySeen = function () {
        this._chipAmount = this._chipAmount * 2;
        this.lab_selectChipAmount.string = "" + this._chipAmount / 100;
    };
    ActBtnsCtrl.prototype._setPackBtnInteractable = function (interactable) {
        this.btn_pack.interactable = interactable;
        this.btn_pack.enableAutoGrayEffect = !interactable;
    };
    ActBtnsCtrl.prototype._setAddBtnInteractable = function (interactable) {
        this.btn_add.interactable = interactable;
        this.btn_add.enableAutoGrayEffect = !interactable;
    };
    ActBtnsCtrl.prototype._setReduceBtnInteractable = function (interactable) {
        this.btn_reduce.interactable = interactable;
        this.btn_reduce.enableAutoGrayEffect = !interactable;
    };
    ActBtnsCtrl.prototype._setBetBtnInteractable = function (interactable) {
        var _this = this;
        this.btn_bet.interactable = interactable;
        this.btn_bet.enableAutoGrayEffect = !interactable;
        this._clearBetScaneTimer();
        if (interactable) {
            var actFun = function () {
                if ((cc.isValid(_this, true) && cc.isValid(_this.sp_betScan, true)) == false) {
                    clearInterval(localBetScaneTimer_1);
                    localBetScaneTimer_1 = null;
                    return;
                }
                ;
                _this.sp_betScan.node.active = true;
                _this.sp_betScan.clearTrack(0);
                _this.sp_betScan.setAnimation(0, "animation", true);
            };
            var localBetScaneTimer_1 = setTimeout(actFun, 5000);
            this._betScaneTimer = localBetScaneTimer_1;
        }
        else {
            this.sp_betScan.clearTrack(0);
            this.sp_betScan.node.active = false;
        }
        ;
    };
    ActBtnsCtrl.prototype._clearBetScaneTimer = function () {
        if (this._betScaneTimer !== null) {
            clearTimeout(this._betScaneTimer);
            this._betScaneTimer = null;
        }
        ;
    };
    ActBtnsCtrl.prototype._setShowBtnInteractable = function (interactable) {
        this.btn_show.interactable = interactable;
        this.btn_show.enableAutoGrayEffect = !interactable;
    };
    /**
    * 设置充值相关数据，显示其内容并启动倒计时。
    * @param data 充电产品信息，类型为IPaymentProduct。
    * @param time 剩余的充电时间，单位为秒。
    * @param winRate 充值后获得的胜率。
    * 该函数不返回任何内容。
    */
    ActBtnsCtrl.prototype.setActBtnsRechargeData = function (data, time, winRate) {
        var _this = this;
        if (data == null) {
            this._clearRechargeActTimer();
            this.node_recharge.active = false;
            this._rechargeProduct = null;
            this._rechargeActTime = 0;
            this._winRate = null;
        }
        else {
            this._clearRechargeActTimer();
            this.lab_rechargeTip.string = "You have " + time + "s to recharge";
            this.node_recharge.active = true;
            this._rechargeProduct = data;
            this._rechargeActTime = time;
            this._winRate = winRate;
            var actTime = 0.5;
            this.btn_recharge.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1, 1), cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1, 1))));
            var actFun = function () {
                time -= 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_rechargeTip, true)) == false) {
                    clearInterval(loaclRechargeActTimer_1);
                    loaclRechargeActTimer_1 = null;
                    return;
                }
                ;
                if (time <= 0) {
                    _this._clearRechargeActTimer();
                    _this.lab_rechargeTip.string = "";
                    _this.node_recharge.active = false;
                    _this._rechargeProduct = null;
                    _this._rechargeActTime = 0;
                    _this._winRate = null;
                    return;
                }
                ;
                _this.lab_rechargeTip.string = "You have " + time + "s to recharge";
                _this._rechargeActTime = time;
            };
            var loaclRechargeActTimer_1 = setInterval(actFun, 1000);
            this._rechargeTimer = loaclRechargeActTimer_1;
        }
    };
    ActBtnsCtrl.prototype._clearRechargeActTimer = function () {
        if (this._rechargeTimer !== null) {
            clearInterval(this._rechargeTimer);
            this._rechargeTimer = null;
        }
        ;
    };
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_pack", void 0);
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_add", void 0);
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_reduce", void 0);
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_bet", void 0);
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_show", void 0);
    __decorate([
        property(cc.Label)
    ], ActBtnsCtrl.prototype, "lab_btnBet", void 0);
    __decorate([
        property(cc.Label)
    ], ActBtnsCtrl.prototype, "lab_btnShow", void 0);
    __decorate([
        property(cc.Label)
    ], ActBtnsCtrl.prototype, "lab_selectChipAmount", void 0);
    __decorate([
        property(cc.Node)
    ], ActBtnsCtrl.prototype, "node_recharge", void 0);
    __decorate([
        property(cc.Button)
    ], ActBtnsCtrl.prototype, "btn_recharge", void 0);
    __decorate([
        property(cc.Label)
    ], ActBtnsCtrl.prototype, "lab_rechargeTip", void 0);
    __decorate([
        property(sp.Skeleton)
    ], ActBtnsCtrl.prototype, "sp_betScan", void 0);
    ActBtnsCtrl = __decorate([
        ccclass,
        menu('tpGame/ActBtnsCtrl')
    ], ActBtnsCtrl);
    return ActBtnsCtrl;
}(cc.Component));
exports.ActBtnsCtrl = ActBtnsCtrl;

cc._RF.pop();