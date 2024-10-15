"use strict";
cc._RF.push(module, '3d7ddjpvW1DaYSLhA5EP4bZ', 'TpGameAudioCtrl');
// tpGame/TpGameAudioCtrl.ts

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
var TpGameAudioCtrl = /** @class */ (function (_super) {
    __extends(TpGameAudioCtrl, _super);
    function TpGameAudioCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.audioClip_catchChip = null;
        _this.audioClip_clickBtnShow = null;
        _this.audioClip_compareCardLine = null;
        _this.audioClip_compareCardLost = null;
        _this.audioClip_compareCardVS = null;
        _this.audioClip_dropCard = null;
        _this.audioClip_faCard = null;
        _this.audioClip_playerJoin = null;
        _this.audioClip_recycleChip = null;
        _this.audioClip_rollOverCard = null;
        _this.audioClip_win = null;
        return _this;
    }
    /**
     * 播放下注筹码音效
     */
    TpGameAudioCtrl.prototype.playCatchChipEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_catchChip, false);
    };
    /**
     * 播放比牌输音效
     */
    TpGameAudioCtrl.prototype.playCompareCardLostEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardLost, false);
    };
    /**
     * 播放比牌VS音效
     */
    TpGameAudioCtrl.prototype.playCompareCardVSEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardVS, false);
    };
    /**
     * 播放比牌连线音效
     */
    TpGameAudioCtrl.prototype.playCompareCardLineEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardLine, false);
    };
    /**
     * 播放弃牌音效
     */
    TpGameAudioCtrl.prototype.playDropCardEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_dropCard, false);
    };
    /**
     * 播放发牌音效
     */
    TpGameAudioCtrl.prototype.playFaCardEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_faCard, false);
    };
    /**
     * 播放赢音效
     */
    TpGameAudioCtrl.prototype.playWinEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_win, false);
    };
    /**
     * 播放玩家加入音效
     */
    TpGameAudioCtrl.prototype.playPlayerJoinEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_playerJoin, false);
    };
    /**
     * 播放翻牌音效
     */
    TpGameAudioCtrl.prototype.playRollOverCardEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_rollOverCard, false);
    };
    /**
     * 播放回收筹码音效
     */
    TpGameAudioCtrl.prototype.playRecycleChipEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_recycleChip, false);
    };
    /**
     * 播放点击比牌按钮音效
     */
    TpGameAudioCtrl.prototype.playClickBtnShowEffect = function () {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_clickBtnShow, false);
    };
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_catchChip", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_clickBtnShow", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_compareCardLine", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_compareCardLost", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_compareCardVS", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_dropCard", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_faCard", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_playerJoin", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_recycleChip", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_rollOverCard", void 0);
    __decorate([
        property(cc.AudioClip)
    ], TpGameAudioCtrl.prototype, "audioClip_win", void 0);
    TpGameAudioCtrl = __decorate([
        ccclass,
        menu('tpGame/TpGameAudioCtrl')
    ], TpGameAudioCtrl);
    return TpGameAudioCtrl;
}(cc.Component));
exports.default = TpGameAudioCtrl;

cc._RF.pop();