"use strict";
cc._RF.push(module, '3d074wD6iBBc7Uckbpsinme', 'SpriteTrans');
// Main/Script/i18n/SpriteTrans.ts

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
var SpriteTrans = /** @class */ (function (_super) {
    __extends(SpriteTrans, _super);
    function SpriteTrans() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spriteTransId = i18nUtil_1.I18NSpriteTransIdEnum.default;
        _this.isChangeById = true; // 是否根据 spriteTransId 填写 sprite 默认值
        _this._customMsgEventHandle = null;
        _this._loadSpriteFrameMap = new Map();
        return _this;
    }
    SpriteTrans.prototype.onLoad = function () {
        this._customMsgEventHandle = window["ClientNotify"].register(window["GlobalCfg"].MSG_TYPE.clientMsg, this.onEventMsg, this);
        var languagesType = i18nUtil_1.I18NUtil.getInstance().getLanguageType();
        this.translate(languagesType);
    };
    ;
    SpriteTrans.prototype.onDestroy = function () {
        var spriteFrame = null;
        if (this._loadSpriteFrameMap.has(i18nUtil_1.I18NLanguagesEnum.English)) {
            spriteFrame = this._loadSpriteFrameMap.get(i18nUtil_1.I18NLanguagesEnum.English);
            this._loadSpriteFrameMap.delete(i18nUtil_1.I18NLanguagesEnum.English);
            spriteFrame.decRef();
            spriteFrame = null;
        }
        ;
        if (this._loadSpriteFrameMap.has(i18nUtil_1.I18NLanguagesEnum.Bengali)) {
            spriteFrame = this._loadSpriteFrameMap.get(i18nUtil_1.I18NLanguagesEnum.Bengali);
            this._loadSpriteFrameMap.delete(i18nUtil_1.I18NLanguagesEnum.Bengali);
            spriteFrame.decRef();
            spriteFrame = null;
        }
        ;
        if (this._loadSpriteFrameMap.has(i18nUtil_1.I18NLanguagesEnum.Hindi)) {
            spriteFrame = this._loadSpriteFrameMap.get(i18nUtil_1.I18NLanguagesEnum.Hindi);
            this._loadSpriteFrameMap.delete(i18nUtil_1.I18NLanguagesEnum.Hindi);
            spriteFrame.decRef();
            spriteFrame = null;
        }
        ;
        if (this._loadSpriteFrameMap.has(i18nUtil_1.I18NLanguagesEnum.Urdu)) {
            spriteFrame = this._loadSpriteFrameMap.get(i18nUtil_1.I18NLanguagesEnum.Urdu);
            this._loadSpriteFrameMap.delete(i18nUtil_1.I18NLanguagesEnum.Urdu);
            spriteFrame.decRef();
            spriteFrame = null;
        }
        ;
        window["ClientNotify"].removeByHandle(window["GlobalCfg"].MSG_TYPE.clientMsg, this._customMsgEventHandle);
    };
    ;
    SpriteTrans.prototype.onEventMsg = function (webData, target) {
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == window["GlobalCfg"].CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            this.dealChangeLanguageEvent(notify);
        }
    };
    ;
    SpriteTrans.prototype.dealChangeLanguageEvent = function (notify) {
        var languagesType = notify.languagesType;
        this.translate(languagesType);
    };
    ;
    SpriteTrans.prototype.translate = function (languagesType) {
        var _this = this;
        if (this.node.getComponent(cc.Sprite)) {
            i18nUtil_1.I18NUtil.getInstance().loadSpriteFrame(languagesType, this.spriteTransId, function (spriteFrame) {
                if (window["CommonFun"].getInstance().isValidForScr(_this)) {
                    if (_this._loadSpriteFrameMap.has(languagesType) == false) {
                        spriteFrame.addRef();
                        _this._loadSpriteFrameMap.set(languagesType, spriteFrame);
                    }
                    ;
                    _this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                else {
                    spriteFrame.addRef();
                    spriteFrame.decRef();
                    spriteFrame = null;
                }
                ;
            });
        }
        else {
            console.error("error Sprite: ", i18nUtil_1.I18NSpriteTransIdEnum[this.spriteTransId], "error LanguageType:", i18nUtil_1.I18NLanguagesEnum[languagesType]);
        }
        ;
    };
    ;
    __decorate([
        property({
            type: cc.Enum(i18nUtil_1.I18NSpriteTransIdEnum),
        })
    ], SpriteTrans.prototype, "spriteTransId", void 0);
    SpriteTrans = __decorate([
        ccclass,
        menu('多语言翻译/SpriteTrans')
    ], SpriteTrans);
    return SpriteTrans;
}(cc.Component));
exports.default = SpriteTrans;

cc._RF.pop();