"use strict";
cc._RF.push(module, '4202dFgyXJIzqxQMMLMzIg4', 'MsgToastCtrl');
// tpGame/MsgToast/MsgToastCtrl.ts

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
var MsgToastCtrl = /** @class */ (function (_super) {
    __extends(MsgToastCtrl, _super);
    function MsgToastCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_content = null;
        _this.btn_yes = null;
        _this.btn_no = null;
        _this._noBtnCall = null;
        _this._yesBtnCall = null;
        return _this;
    }
    MsgToastCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_yes.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_no.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
    };
    MsgToastCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_yes.node.name:
                this.dealBtnYesEvent();
                break;
            case this.btn_no.node.name:
                this.dealBtnNoEvent();
                break;
            default:
                break;
        }
    };
    MsgToastCtrl.prototype.dealBtnYesEvent = function () {
        if (this._yesBtnCall) {
            this._yesBtnCall();
        }
        ;
        this.setMsgToastActive(false);
    };
    MsgToastCtrl.prototype.dealBtnNoEvent = function () {
        if (this._noBtnCall) {
            this._noBtnCall();
        }
        ;
        this.setMsgToastActive(false);
    };
    /**
     * 设置提示框的回调
     * @param yesCall 点击确定按钮的回调
     * @param noCall 点击取消按钮的回调
     */
    MsgToastCtrl.prototype.setMsgToastYesCall = function (yesCall) {
        this._yesBtnCall = yesCall;
    };
    MsgToastCtrl.prototype.setMsgToastNoCall = function (noCall) {
        this._noBtnCall = noCall;
    };
    MsgToastCtrl.prototype.setMsgToastStyle = function (style) {
        switch (style) {
            case DataDef_1.EnumMsgToastStyle.NO:
                this.btn_yes.node.active = false;
                this.btn_no.node.active = true;
                this.btn_no.node.setPosition(cc.v3(0, -150));
                break;
            case DataDef_1.EnumMsgToastStyle.YES_NO:
                this.btn_yes.node.active = true;
                this.btn_no.node.active = true;
                this.btn_yes.node.setPosition(cc.v3(157, -150));
                this.btn_no.node.setPosition(cc.v3(-157, -150));
                break;
            case DataDef_1.EnumMsgToastStyle.YES:
                this.btn_yes.node.active = true;
                this.btn_no.node.active = false;
                this.btn_yes.node.setPosition(cc.v3(0, -150));
                break;
            default:
                break;
        }
    };
    /**
     * 设置提示框的内容
     * @param content 提示框的内容
     */
    MsgToastCtrl.prototype.setMsgToastContent = function (content) {
        this.lab_content.string = content;
    };
    /**
     * 设置提示框的显示
     * @param active 是否显示
     */
    MsgToastCtrl.prototype.setMsgToastActive = function (active) {
        this.node.active = active;
    };
    __decorate([
        property(cc.Label)
    ], MsgToastCtrl.prototype, "lab_content", void 0);
    __decorate([
        property(cc.Button)
    ], MsgToastCtrl.prototype, "btn_yes", void 0);
    __decorate([
        property(cc.Button)
    ], MsgToastCtrl.prototype, "btn_no", void 0);
    MsgToastCtrl = __decorate([
        ccclass,
        menu('tpGame/MsgToastCtrl')
    ], MsgToastCtrl);
    return MsgToastCtrl;
}(cc.Component));
exports.default = MsgToastCtrl;

cc._RF.pop();