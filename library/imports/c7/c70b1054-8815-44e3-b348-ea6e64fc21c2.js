"use strict";
cc._RF.push(module, 'c70b1BUiBVE47NI6m5k/CHC', 'LabelTrans');
// Main/Script/i18n/LabelTrans.ts

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
var i18nUtil_1 = require("./i18nUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var LabelTrans = /** @class */ (function (_super) {
    __extends(LabelTrans, _super);
    function LabelTrans() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelTransId = i18nUtil_1.I18NLabelTransIdEnum.default;
        _this.textType = i18nUtil_1.componentTypeEnum.Label;
        _this.customMsgEventHandle = null;
        return _this;
    }
    LabelTrans.prototype.onLoad = function () {
        this.customMsgEventHandle = window["ClientNotify"].register(window["GlobalCfg"].MSG_TYPE.clientMsg, this.onEventMsg, this);
        var languagesType = i18nUtil_1.I18NUtil.getInstance().getLanguageType();
        this.translate(languagesType);
    };
    ;
    LabelTrans.prototype.onDestroy = function () {
        window["ClientNotify"].removeByHandle(window["GlobalCfg"].MSG_TYPE.clientMsg, this.customMsgEventHandle);
    };
    ;
    LabelTrans.prototype.onEventMsg = function (webData, target) {
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == window["GlobalCfg"].CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            this.dealChangeLanguageEvent(notify);
        }
    };
    ;
    LabelTrans.prototype.dealChangeLanguageEvent = function (notify) {
        var languagesType = notify.languagesType;
        this.translate(languagesType);
    };
    ;
    LabelTrans.prototype.translate = function (languagesType) {
        var str = i18nUtil_1.I18NUtil.getInstance().getLanguageStr(languagesType, this.labelTransId);
        if (!str) {
            return;
        }
        ;
        switch (this.textType) {
            case i18nUtil_1.componentTypeEnum.Label:
                if (this.node.getComponent(cc.Label)) {
                    this.node.getComponent(cc.Label).string = str;
                }
                else {
                    console.error("error Label: ", i18nUtil_1.I18NLabelTransIdEnum[this.labelTransId], "error LanguageType:", i18nUtil_1.I18NLanguagesEnum[languagesType]);
                }
                ;
                break;
            case i18nUtil_1.componentTypeEnum.RichText:
                if (this.node.getComponent(cc.RichText)) {
                    this.node.getComponent(cc.RichText).string = str;
                }
                else {
                    console.error("error RichText: ", i18nUtil_1.I18NLabelTransIdEnum[this.labelTransId], "error LanguageType:", i18nUtil_1.I18NLanguagesEnum[languagesType]);
                }
                ;
                break;
            default:
                break;
        }
    };
    ;
    __decorate([
        property({
            type: cc.Enum(i18nUtil_1.I18NLabelTransIdEnum),
        })
    ], LabelTrans.prototype, "labelTransId", void 0);
    __decorate([
        property({
            type: cc.Enum(i18nUtil_1.componentTypeEnum),
        })
    ], LabelTrans.prototype, "textType", void 0);
    LabelTrans = __decorate([
        ccclass,
        menu('多语言翻译/LabelTrans')
    ], LabelTrans);
    return LabelTrans;
}(cc.Component));
exports.default = LabelTrans;
;

cc._RF.pop();