"use strict";
cc._RF.push(module, '1e562ny1CBLrb5lbxMeksiz', 'SignItemCtrl');
// ResourcesBundle/NewPlan/Sign/SignItemCtrl.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SignItemCtrl = /** @class */ (function (_super) {
    __extends(SignItemCtrl, _super);
    function SignItemCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_reward = null;
        _this.lab_day = null;
        _this.node_signed = null;
        _this.node_unsigned = null;
        return _this;
    }
    SignItemCtrl.prototype.setSignItemData = function (gift, today, done, day) {
        this.lab_reward.string = "\u20B9" + gift / 100;
        this.lab_day.string = "Day" + day;
        if (today > day) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == true) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == false) {
            this.node_signed.active = false;
            this.node_unsigned.active = true;
        }
        else {
            this.node_signed.active = false;
            this.node_unsigned.active = false;
        }
        ;
    };
    SignItemCtrl.prototype.setSignItemSigned = function () {
        this.node_signed.active = true;
        this.node_unsigned.active = false;
    };
    __decorate([
        property(cc.Label)
    ], SignItemCtrl.prototype, "lab_reward", void 0);
    __decorate([
        property(cc.Label)
    ], SignItemCtrl.prototype, "lab_day", void 0);
    __decorate([
        property(cc.Node)
    ], SignItemCtrl.prototype, "node_signed", void 0);
    __decorate([
        property(cc.Node)
    ], SignItemCtrl.prototype, "node_unsigned", void 0);
    SignItemCtrl = __decorate([
        ccclass
    ], SignItemCtrl);
    return SignItemCtrl;
}(cc.Component));
exports.default = SignItemCtrl;

cc._RF.pop();