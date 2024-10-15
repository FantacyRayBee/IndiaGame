"use strict";
cc._RF.push(module, 'a772dyWfdxOXptoxQgxbeNW', 'CompareCardVSCtrl');
// tpGame/CompareCard/CompareCardVSCtrl.ts

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
var CompareCardVSCtrl = /** @class */ (function (_super) {
    __extends(CompareCardVSCtrl, _super);
    function CompareCardVSCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sp_vs = null;
        return _this;
    }
    CompareCardVSCtrl.prototype.setCompareCardVSAnim = function () {
        this.sp_vs.clearTracks();
        this.sp_vs.setAnimation(0, "chuxian", false);
    };
    __decorate([
        property(sp.Skeleton)
    ], CompareCardVSCtrl.prototype, "sp_vs", void 0);
    CompareCardVSCtrl = __decorate([
        ccclass,
        menu('tpGame/CompareCardVSCtrl')
    ], CompareCardVSCtrl);
    return CompareCardVSCtrl;
}(cc.Component));
exports.default = CompareCardVSCtrl;

cc._RF.pop();