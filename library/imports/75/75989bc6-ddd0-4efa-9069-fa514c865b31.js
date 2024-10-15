"use strict";
cc._RF.push(module, '75989vG3dBO+pBp+lFMhlsx', 'HintCtrl');
// tpGame/Hint/HintCtrl.ts

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
var HintCtrl = /** @class */ (function (_super) {
    __extends(HintCtrl, _super);
    function HintCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_content = null;
        _this.btn_pack = null;
        _this.btn_continue = null;
        return _this;
    }
    HintCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_continue.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    HintCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_pack.node.name:
                this.dealBtnPackEvent();
                break;
            case this.btn_continue.node.name:
                this.setHintActive(false);
                break;
            default:
                break;
        }
    };
    HintCtrl.prototype.dealBtnPackEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.drop", "DropReq", {});
        this.setHintActive(false);
    };
    /**
     * 设置Hint界面是否显示
     * @param active 是否显示
     */
    HintCtrl.prototype.setHintActive = function (active) {
        this.node.active = active;
    };
    /**
     * 设置Hint界面胜率
     * @param winRate 胜率
     */
    HintCtrl.prototype.setHitWinRate = function (winRate) {
        this.lab_content.string = "Your probability of winning this round is " + (winRate / 100).toFixed(2) + "%\nAre yor sure to pack?";
    };
    __decorate([
        property(cc.Label)
    ], HintCtrl.prototype, "lab_content", void 0);
    __decorate([
        property(cc.Button)
    ], HintCtrl.prototype, "btn_pack", void 0);
    __decorate([
        property(cc.Button)
    ], HintCtrl.prototype, "btn_continue", void 0);
    HintCtrl = __decorate([
        ccclass,
        menu('tpGame/HintCtrl')
    ], HintCtrl);
    return HintCtrl;
}(cc.Component));
exports.default = HintCtrl;

cc._RF.pop();