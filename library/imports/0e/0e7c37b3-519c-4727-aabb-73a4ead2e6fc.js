"use strict";
cc._RF.push(module, '0e7c3ezUZxHJ6q7c6Tq0ub8', 'AddCashCtrl');
// tpGame/AddCash/AddCashCtrl.ts

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
var DataDef_1 = require("../DataDef");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var AddCashCtrl = /** @class */ (function (_super) {
    __extends(AddCashCtrl, _super);
    function AddCashCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spriteFrame_cash = null;
        _this.spriteFrame_practice = null;
        _this.sprite_bg = null;
        _this._currentType = DataDef_1.EnumAddCashType.NONE;
        _this._curRoomConfig = null;
        return _this;
    }
    AddCashCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    AddCashCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (this._currentType == DataDef_1.EnumAddCashType.PRACTICE) {
            //@ts-ignore
            CommonFun.getInstance().showSmallAddExperience();
        }
        else if (this._currentType == DataDef_1.EnumAddCashType.CASH) {
            //@ts-ignore
            CommonFun.getInstance().showSmallAddCash("tpGame", this._curRoomConfig ? this._curRoomConfig.cellScore : 0);
        }
        ;
    };
    AddCashCtrl.prototype.setAddCashStyle = function (type, roomConfig) {
        if (type == DataDef_1.EnumAddCashType.CASH) {
            this.sprite_bg.spriteFrame = this.spriteFrame_cash;
            this.node.active = true;
        }
        else if (type == DataDef_1.EnumAddCashType.PRACTICE) {
            this.sprite_bg.spriteFrame = this.spriteFrame_practice;
            this.node.active = true;
        }
        else {
            this.node.active = false;
        }
        ;
        this._curRoomConfig = roomConfig;
        this._currentType = type;
    };
    __decorate([
        property(cc.SpriteFrame)
    ], AddCashCtrl.prototype, "spriteFrame_cash", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], AddCashCtrl.prototype, "spriteFrame_practice", void 0);
    __decorate([
        property(cc.Sprite)
    ], AddCashCtrl.prototype, "sprite_bg", void 0);
    AddCashCtrl = __decorate([
        ccclass,
        menu('tpGame/AddCashCtrl')
    ], AddCashCtrl);
    return AddCashCtrl;
}(cc.Component));
exports.default = AddCashCtrl;

cc._RF.pop();