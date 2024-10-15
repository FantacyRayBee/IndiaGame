"use strict";
cc._RF.push(module, 'a2090V0zBNC5p2fsCAbO0Tx', 'DiversionFreeTPCtrl');
// ResourcesBundle/NewPlan/DiversionFreeTP/DiversionFreeTPCtrl.ts

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
var DiversionFreeTPCtrl = /** @class */ (function (_super) {
    __extends(DiversionFreeTPCtrl, _super);
    function DiversionFreeTPCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_close = null;
        _this.btn_addCash = null;
        _this.btn_playNow = null;
        _this._clickBtnPlayNowCallback = null;
        return _this;
    }
    DiversionFreeTPCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
        //@ts-ignore
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
        //@ts-ignore
        this.btn_playNow.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
    };
    DiversionFreeTPCtrl.prototype.onDestroy = function () {
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.DIVERSIONFREETP);
        //@ts-ignore
        GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW = false;
    };
    DiversionFreeTPCtrl.prototype._btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this._dealBtnCloseEvent();
                break;
            case this.btn_addCash.node.name:
                this._dealBtnAddCashEvent();
                break;
            case this.btn_playNow.node.name:
                this._dealBtnPlayNowEvent();
                break;
            default:
                break;
        }
    };
    DiversionFreeTPCtrl.prototype._dealBtnCloseEvent = function () {
        this.node.destroy();
    };
    DiversionFreeTPCtrl.prototype._dealBtnAddCashEvent = function () {
        var _a;
        //@ts-ignore
        var commodity = GlobalCfg.USER_DATAS.first_pay_product.sort(function (a, b) {
            return a.amount - b.amount;
        });
        //@ts-ignore
        CommonFun.getInstance().rechargeByCommodityId((_a = commodity[0]) === null || _a === void 0 ? void 0 : _a.id, GlobalCfg.SHOP_RECHARGE_FROM.DiversionFreeTP, function () { });
        this.node.destroy();
    };
    DiversionFreeTPCtrl.prototype._dealBtnPlayNowEvent = function () {
        if (this._clickBtnPlayNowCallback) {
            this._clickBtnPlayNowCallback();
        }
        ;
        this.tryEnterMinScoreTP();
    };
    DiversionFreeTPCtrl.prototype.setDiversionFreeTPBtnPlayNowCallback = function (callback) {
        this._clickBtnPlayNowCallback = callback;
    };
    DiversionFreeTPCtrl.prototype.tryEnterMinScoreTP = function () {
        var _this = this;
        //@ts-ignore
        if (CommonFun.getInstance().isNeedUpdata("tpGame") == false) {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.openModules.includes(100)) {
                //@ts-ignore
                var teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
                teenPattiRoomInfo = teenPattiRoomInfo.sort(function (a, b) {
                    return a.entrycondition - b.entrycondition;
                });
                teenPattiRoomInfo = teenPattiRoomInfo.filter(function (item) {
                    return item.trial == false && item.isblind == false;
                });
                var itemData_1 = null;
                for (var i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                    //@ts-ignore
                    if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
                        itemData_1 = teenPattiRoomInfo[i];
                        break;
                    }
                    ;
                }
                ;
                if (!itemData_1) {
                    //@ts-ignore
                    window.isNeedShowRoomList = "tpGame";
                    //@ts-ignore
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
                    this.node.destroy();
                    return;
                }
                ;
                //@ts-ignore
                GameServerManager.clientCloseServer();
                //@ts-ignore
                CommonFun.getInstance().showProgress();
                this.scheduleOnce(function () {
                    _this.node.destroy();
                    //@ts-ignore
                    GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData_1.id;
                    //@ts-ignore
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
                }, 2);
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips("TeenPatti is not open yet!");
            }
            ;
        }
        else {
            //@ts-ignore
            GameDownloader.getInstance().priorLoadGame("tpGame");
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            this.node.destroy();
        }
        ;
    };
    __decorate([
        property(cc.Button)
    ], DiversionFreeTPCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Button)
    ], DiversionFreeTPCtrl.prototype, "btn_addCash", void 0);
    __decorate([
        property(cc.Button)
    ], DiversionFreeTPCtrl.prototype, "btn_playNow", void 0);
    DiversionFreeTPCtrl = __decorate([
        ccclass
    ], DiversionFreeTPCtrl);
    return DiversionFreeTPCtrl;
}(cc.Component));
exports.default = DiversionFreeTPCtrl;

cc._RF.pop();