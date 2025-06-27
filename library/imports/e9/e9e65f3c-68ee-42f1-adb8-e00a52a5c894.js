"use strict";
cc._RF.push(module, 'e9e6588aO5C8a244ApSpciU', 'OwnRechargeTipCtrl');
// tpGame/RechargeToast/OwnRechargeTipCtrl.ts

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
var OwnRechargeTipCtrl = /** @class */ (function (_super) {
    __extends(OwnRechargeTipCtrl, _super);
    function OwnRechargeTipCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_time = null;
        _this.sprite_time = null;
        _this._ownRechargeTipTimer = null;
        return _this;
    }
    OwnRechargeTipCtrl.prototype.onDestroy = function () {
        this._clearOwnRechargeTipTimer();
    };
    /**
     * 设置充值倒计时
     * @param time
     */
    OwnRechargeTipCtrl.prototype.setOwnRechargeTipTime = function (time) {
        var _this = this;
        //@ts-ignore
        LoggerUtil.getInstance().error("setOwnRechargeTipTime time = " + time);
        this._clearOwnRechargeTipTimer();
        if (time <= 0) {
            this.lab_time.string = "";
            this.sprite_time.fillRange = 0;
            this.node.active = false;
        }
        else {
            this.node.active = true;
            this.lab_time.string = "" + time;
            this.sprite_time.fillRange = time / 300;
            var actFun = function () {
                time -= 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_time, true) && cc.isValid(_this.sprite_time, true)) == false) {
                    clearInterval(localOwnRechargeTipTimer_1);
                    localOwnRechargeTipTimer_1 = null;
                    return;
                }
                ;
                if (time <= 0) {
                    _this._clearOwnRechargeTipTimer();
                    _this.lab_time.string = "";
                    _this.sprite_time.fillRange = 0;
                    _this.node.active = false;
                    return;
                }
                ;
                _this.lab_time.string = "" + time;
                _this.sprite_time.fillRange = time / 300;
            };
            var localOwnRechargeTipTimer_1 = setInterval(actFun, 1000);
            this._ownRechargeTipTimer = localOwnRechargeTipTimer_1;
        }
        ;
    };
    OwnRechargeTipCtrl.prototype._clearOwnRechargeTipTimer = function () {
        if (this._ownRechargeTipTimer !== null) {
            clearInterval(this._ownRechargeTipTimer);
            this._ownRechargeTipTimer = null;
        }
    };
    __decorate([
        property(cc.Label)
    ], OwnRechargeTipCtrl.prototype, "lab_time", void 0);
    __decorate([
        property(cc.Sprite)
    ], OwnRechargeTipCtrl.prototype, "sprite_time", void 0);
    OwnRechargeTipCtrl = __decorate([
        ccclass,
        menu('tpGame/OwnRechargeTipCtrl')
    ], OwnRechargeTipCtrl);
    return OwnRechargeTipCtrl;
}(cc.Component));
exports.default = OwnRechargeTipCtrl;

cc._RF.pop();