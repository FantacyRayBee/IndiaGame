"use strict";
cc._RF.push(module, '989d0AjOghGc7O1eCtd1a2E', 'RoundInfoCtrl');
// tpGame/RoundInfo/RoundInfoCtrl.ts

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
var RoundInfoCtrl = /** @class */ (function (_super) {
    __extends(RoundInfoCtrl, _super);
    function RoundInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_content = null;
        return _this;
    }
    /**
     * 设置轮次信息轮次次数
     * @param round 轮次
     */
    RoundInfoCtrl.prototype.setRoundInfoRound = function (round) {
        this.lab_content.string = "Round " + round + "/50";
    };
    __decorate([
        property(cc.Label)
    ], RoundInfoCtrl.prototype, "lab_content", void 0);
    RoundInfoCtrl = __decorate([
        ccclass,
        menu('tpGame/RoundInfoCtrl')
    ], RoundInfoCtrl);
    return RoundInfoCtrl;
}(cc.Component));
exports.default = RoundInfoCtrl;

cc._RF.pop();