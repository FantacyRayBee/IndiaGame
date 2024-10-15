"use strict";
cc._RF.push(module, 'ed666nmDr9KPYOV8KNsheGw', 'CompareCardLineCtrl');
// tpGame/CompareCard/CompareCardLineCtrl.ts

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
var CompareCardLineCtrl = /** @class */ (function (_super) {
    __extends(CompareCardLineCtrl, _super);
    function CompareCardLineCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sp_line = null;
        return _this;
    }
    CompareCardLineCtrl.prototype.setCompareCardLinePosition = function (pos) {
        this.sp_line.node.setPosition(pos);
    };
    CompareCardLineCtrl.prototype.setCompareCardLineRotation = function (angle) {
        this.sp_line.node.angle = angle - 90;
    };
    CompareCardLineCtrl.prototype.setCompareCardLinDistance = function (distance) {
        var scale = distance / 185;
        this.sp_line.node.setScale(2, scale);
    };
    CompareCardLineCtrl.prototype.setCompareCardLineAnim = function () {
        this.sp_line.clearTracks();
        this.sp_line.setAnimation(0, "duan", true);
    };
    __decorate([
        property(sp.Skeleton)
    ], CompareCardLineCtrl.prototype, "sp_line", void 0);
    CompareCardLineCtrl = __decorate([
        ccclass,
        menu('tpGame/CompareCardLineCtrl')
    ], CompareCardLineCtrl);
    return CompareCardLineCtrl;
}(cc.Component));
exports.default = CompareCardLineCtrl;

cc._RF.pop();