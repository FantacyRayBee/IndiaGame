"use strict";
cc._RF.push(module, '17f74czrZxGD5euKbFPT6mM', 'LuckyPlayerCtrl');
// tpGame/LuckyPlayer/LuckyPlayerCtrl.ts

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
var LuckyPlayerCtrl = /** @class */ (function (_super) {
    __extends(LuckyPlayerCtrl, _super);
    function LuckyPlayerCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_get = null;
        _this._plotOffset = null;
        return _this;
    }
    LuckyPlayerCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_get.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 1), this);
    };
    LuckyPlayerCtrl.prototype._btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this._dealBtnGetEvent();
    };
    LuckyPlayerCtrl.prototype._dealBtnGetEvent = function () {
        var _this = this;
        if (this._plotOffset) {
            //@ts-ignore
            CommonFun.getInstance().scatterGoldCoinsAim();
            //@ts-ignore
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.TPGAME_CLICK_LUCKYPLAYER_GET, msgData: { plotOffset: this._plotOffset } });
            this.scheduleOnce(function () {
                _this.setLuckyPlayerActive(false);
            }, 1);
        }
        else {
            this.setLuckyPlayerActive(false);
        }
        ;
    };
    /**
     * 设置幸运玩家首充剧情补偿数据
     * @param plotOffset 首充剧情补偿
     */
    LuckyPlayerCtrl.prototype.setLuckyPlayerPlotOffset = function (plotOffset) {
        this._plotOffset = plotOffset;
    };
    /**
     * 设置幸运玩家界面是否显示
     * @param active 是否显示
     */
    LuckyPlayerCtrl.prototype.setLuckyPlayerActive = function (active) {
        this.unscheduleAllCallbacks();
        this.node.active = active;
    };
    LuckyPlayerCtrl.prototype.getLuckyPlayerActive = function () {
        return this.node.active;
    };
    __decorate([
        property(cc.Button)
    ], LuckyPlayerCtrl.prototype, "btn_get", void 0);
    LuckyPlayerCtrl = __decorate([
        ccclass,
        menu('tpGame/LuckyPlayerCtrl')
    ], LuckyPlayerCtrl);
    return LuckyPlayerCtrl;
}(cc.Component));
exports.default = LuckyPlayerCtrl;

cc._RF.pop();