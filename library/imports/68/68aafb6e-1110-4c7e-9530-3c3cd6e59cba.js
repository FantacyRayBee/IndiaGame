"use strict";
cc._RF.push(module, '68aaftuERBMfpUwPDzW5Zy6', 'TotalChipsCtrl');
// tpGame/TotalChips/TotalChipsCtrl.ts

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
exports.TotalChipsCtrl = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var TotalChipsCtrl = /** @class */ (function (_super) {
    __extends(TotalChipsCtrl, _super);
    function TotalChipsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_totalChips = null;
        return _this;
    }
    /**
     * 设置总下注池金额
     * @param amount 总下注池金额。
     */
    TotalChipsCtrl.prototype.setTotalChipsAmount = function (amount) {
        //@ts-ignore
        this.lab_totalChips.string = "" + CommonFun.getInstance().numberToShow(amount / 100);
    };
    ;
    __decorate([
        property(cc.Label)
    ], TotalChipsCtrl.prototype, "lab_totalChips", void 0);
    TotalChipsCtrl = __decorate([
        ccclass,
        menu('tpGame/TotalChipsCtrl')
    ], TotalChipsCtrl);
    return TotalChipsCtrl;
}(cc.Component));
exports.TotalChipsCtrl = TotalChipsCtrl;
;

cc._RF.pop();