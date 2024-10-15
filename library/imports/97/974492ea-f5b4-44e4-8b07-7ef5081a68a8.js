"use strict";
cc._RF.push(module, '97449Lq9bRE5IsHfvUIGmio', 'WaitStartTipCtrl');
// tpGame/WaitStartTip/WaitStartTipCtrl.ts

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
var WaitStartTipCtrl = /** @class */ (function (_super) {
    __extends(WaitStartTipCtrl, _super);
    function WaitStartTipCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_content = null;
        _this._pointArr = [".", "..", "..."];
        _this._pointTimer = null;
        _this._defaultContent = "Waiting for other players join the game";
        return _this;
    }
    WaitStartTipCtrl.prototype.onDestroy = function () {
        this._clearPointTimer();
    };
    /**
     * 设置等待开始提示框是否显示
     * @param active 是否显示
     */
    WaitStartTipCtrl.prototype.setWaitStartTipActive = function (active) {
        var _this = this;
        this._clearPointTimer();
        if (active) {
            var pointIndex_1 = 0;
            this.lab_content.string = this._defaultContent + " " + this._pointArr[pointIndex_1];
            this.node.active = true;
            var actFun = function () {
                pointIndex_1 += 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_content, true)) == false) {
                    clearInterval(loaclPointTimer_1);
                    loaclPointTimer_1 = null;
                    return;
                }
                ;
                _this.lab_content.string = _this._defaultContent + " " + _this._pointArr[pointIndex_1 % 3];
            };
            var loaclPointTimer_1 = setInterval(actFun, 1000);
            this._pointTimer = loaclPointTimer_1;
        }
        else {
            this.node.active = false;
        }
        ;
    };
    WaitStartTipCtrl.prototype._clearPointTimer = function () {
        if (this._pointTimer !== null) {
            clearInterval(this._pointTimer);
            this._pointTimer = null;
        }
        ;
    };
    __decorate([
        property(cc.Label)
    ], WaitStartTipCtrl.prototype, "lab_content", void 0);
    WaitStartTipCtrl = __decorate([
        ccclass,
        menu('tpGame/WaitStartTipCtrl')
    ], WaitStartTipCtrl);
    return WaitStartTipCtrl;
}(cc.Component));
exports.default = WaitStartTipCtrl;

cc._RF.pop();