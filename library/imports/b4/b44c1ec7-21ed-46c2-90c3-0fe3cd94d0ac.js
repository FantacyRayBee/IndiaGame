"use strict";
cc._RF.push(module, 'b44c17HIe1GwpDDD+PNlNCs', 'ChipCtrl');
// tpGame/Chip/ChipCtrl.ts

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
var ChipCtrl = /** @class */ (function (_super) {
    __extends(ChipCtrl, _super);
    function ChipCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprite_icon = null;
        _this.spriteFrame_blue = null;
        _this.spriteFrame_green = null;
        _this.spriteFrame_orange = null;
        _this.spriteFrame_yellow = null;
        _this.font_blue = null;
        _this.font_green = null;
        _this.font_orange = null;
        _this.font_yellow = null;
        _this.lab_amount = null;
        _this._chipAmountArr = [
            ["0.1", "0.2", "0.3", "0.4", "0.6", "1.2", "1", "2", "4", "3", "6", "12", "10", "20", "50", "100"],
            ["0.8", "1.6", "2.4", "4.8", "8", "16", "24", "48", "80", "160"],
            ["6.4", "9.6", "12.8", "19.2", "38.4", "64", "128", "192", "384", "320", "640", "2560", "1280", "1600"],
            ["400", "800", "3200", "6400", "3.2", "32", "9.6", "96", "40", "200"]
        ];
        return _this;
    }
    /**
     * 设置下注额度
     * @param amount 下注额度
     */
    ChipCtrl.prototype.setChipAmount = function (amount) {
        var chipAmount = amount / 100;
        var index = 0;
        for (var i = 0, len_1 = this._chipAmountArr.length; i < len_1; i++) {
            var chipAmountArr = this._chipAmountArr[i];
            if (chipAmountArr.indexOf("" + chipAmount) != -1) {
                index = i;
                break;
            }
            ;
        }
        ;
        var len = ("" + chipAmount).length;
        if (len == 1 || len == 2) {
            this.lab_amount.fontSize = 26;
            this.lab_amount.lineHeight = 26;
            this.lab_amount.spacingX = -2;
        }
        else if (len == 3) {
            this.lab_amount.fontSize = 19;
            this.lab_amount.lineHeight = 19;
            this.lab_amount.spacingX = -2;
        }
        else if (len == 4) {
            this.lab_amount.fontSize = 17;
            this.lab_amount.lineHeight = 17;
            this.lab_amount.spacingX = -2;
        }
        else if (len > 4) {
            this.lab_amount.fontSize = 15;
            this.lab_amount.lineHeight = 15;
            this.lab_amount.spacingX = -2;
        }
        ;
        this.lab_amount.string = "" + chipAmount;
        switch (index) {
            case 0:
                this.lab_amount.font = this.font_blue;
                this.sprite_icon.spriteFrame = this.spriteFrame_blue;
                break;
            case 1:
                this.lab_amount.font = this.font_green;
                this.sprite_icon.spriteFrame = this.spriteFrame_green;
                break;
            case 2:
                this.lab_amount.font = this.font_orange;
                this.sprite_icon.spriteFrame = this.spriteFrame_orange;
                break;
            case 3:
                this.lab_amount.font = this.font_yellow;
                this.sprite_icon.spriteFrame = this.spriteFrame_yellow;
                break;
            default:
                break;
        }
        ;
    };
    __decorate([
        property(cc.Sprite)
    ], ChipCtrl.prototype, "sprite_icon", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], ChipCtrl.prototype, "spriteFrame_blue", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], ChipCtrl.prototype, "spriteFrame_green", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], ChipCtrl.prototype, "spriteFrame_orange", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], ChipCtrl.prototype, "spriteFrame_yellow", void 0);
    __decorate([
        property(cc.Font)
    ], ChipCtrl.prototype, "font_blue", void 0);
    __decorate([
        property(cc.Font)
    ], ChipCtrl.prototype, "font_green", void 0);
    __decorate([
        property(cc.Font)
    ], ChipCtrl.prototype, "font_orange", void 0);
    __decorate([
        property(cc.Font)
    ], ChipCtrl.prototype, "font_yellow", void 0);
    __decorate([
        property(cc.Label)
    ], ChipCtrl.prototype, "lab_amount", void 0);
    ChipCtrl = __decorate([
        ccclass,
        menu('tpGame/ChipCtrl')
    ], ChipCtrl);
    return ChipCtrl;
}(cc.Component));
exports.default = ChipCtrl;

cc._RF.pop();