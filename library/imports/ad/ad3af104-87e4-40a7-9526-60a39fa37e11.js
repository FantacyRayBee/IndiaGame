"use strict";
cc._RF.push(module, 'ad3afEEh+RAp5UmYKOfo34R', 'RechargeToastCtrl');
// tpGame/RechargeToast/RechargeToastCtrl.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var RechargeToastCtrl = /** @class */ (function (_super) {
    __extends(RechargeToastCtrl, _super);
    function RechargeToastCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_cash = null;
        _this.lab_extraCash = null;
        _this.lab_bonus = null;
        _this.lab_total = null;
        _this.lab_amount = null;
        _this.lab_timeTip = null;
        _this.btn_close = null;
        _this.btn_addCash = null;
        _this._rechargeProduct = null;
        _this._rechargeTimer = null;
        return _this;
    }
    RechargeToastCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_addCash.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    RechargeToastCtrl.prototype.onDestroy = function () {
        this._clearRechargeTimer();
    };
    RechargeToastCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this._clearRechargeTimer();
                this.setRechargeToastActive(false);
                break;
            case this.btn_addCash.node.name:
                this.dealBtnAddCashEvent();
                break;
            default:
                break;
        }
    };
    RechargeToastCtrl.prototype.dealBtnAddCashEvent = function () {
        var _this = this;
        if (!this._rechargeProduct) {
            return;
        }
        ;
        //@ts-ignore
        CommonFun.getInstance().rechargeByCommodityId(this._rechargeProduct.id, "TP\u5C40\u5185" + (this._rechargeProduct.plot ? "-剧情" : ""), function () {
            _this._clearRechargeTimer();
            _this.setRechargeToastActive(false);
        });
    };
    RechargeToastCtrl.prototype.setRechargeToastData = function (data, time) {
        this._rechargeProduct = data;
        var id = data.id;
        var amount = data.amount;
        var add = data.add;
        var bonus = data.bonus;
        this.lab_cash.string = "\u20B9" + amount / 100;
        this.lab_extraCash.string = "\u20B9" + add / 100;
        this.lab_bonus.string = "\u20B9" + bonus / 100;
        this.lab_total.string = "\u20B9" + (amount + add + bonus) / 100;
        this.lab_amount.string = "\u20B9" + amount / 100;
        this._setRechargeToastTime(time);
    };
    RechargeToastCtrl.prototype._setRechargeToastTime = function (time) {
        var _this = this;
        if (time <= 0) {
            this._clearRechargeTimer();
            this.setRechargeToastActive(false);
        }
        else {
            this._clearRechargeTimer();
            this.lab_timeTip.string = "You have " + time + "s to recharge";
            var actTimerCall = function () {
                time -= 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_timeTip, true)) == false) {
                    clearInterval(localRechargeTimer_1);
                    localRechargeTimer_1 = null;
                    return;
                }
                ;
                if (time <= 0) {
                    _this._clearRechargeTimer();
                    _this.setRechargeToastActive(false);
                    return;
                }
                ;
                _this.lab_timeTip.string = "You have " + time + "s to recharge";
            };
            var localRechargeTimer_1 = setInterval(actTimerCall, 1000);
            this._rechargeTimer = localRechargeTimer_1;
        }
        ;
    };
    RechargeToastCtrl.prototype._clearRechargeTimer = function () {
        if (this._rechargeTimer !== null) {
            clearInterval(this._rechargeTimer);
            this._rechargeTimer = null;
        }
        ;
    };
    /**
     * 设置是否显示充值弹框界面
     * @param active 是否显示
     */
    RechargeToastCtrl.prototype.setRechargeToastActive = function (active) {
        this.node.active = active;
    };
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_cash", void 0);
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_extraCash", void 0);
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_bonus", void 0);
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_total", void 0);
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_amount", void 0);
    __decorate([
        property(cc.Label)
    ], RechargeToastCtrl.prototype, "lab_timeTip", void 0);
    __decorate([
        property(cc.Button)
    ], RechargeToastCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Button)
    ], RechargeToastCtrl.prototype, "btn_addCash", void 0);
    RechargeToastCtrl = __decorate([
        ccclass,
        menu('tpGame/RechargeToastCtrl')
    ], RechargeToastCtrl);
    return RechargeToastCtrl;
}(cc.Component));
exports.default = RechargeToastCtrl;

cc._RF.pop();