"use strict";
cc._RF.push(module, '7637dWmZm9EMbZUGAOOwxjW', 'TableInfoCtrl');
// tpGame/TableInfo/TableInfoCtrl.ts

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
exports.TableInfoCtrl = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
var TableInfoCtrl = /** @class */ (function (_super) {
    __extends(TableInfoCtrl, _super);
    function TableInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_bootAmount = null;
        _this.lab_chaalLimit = null;
        _this.lab_maxBlinds = null;
        _this.lab_potLimit = null;
        _this.btn_changeTable = null;
        _this._tpGameCtrl = null;
        _this._changeTableTimer = null;
        return _this;
    }
    TableInfoCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_changeTable.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 2), this);
    };
    TableInfoCtrl.prototype.onDestroy = function () {
        this._clearChangeTableTimer();
    };
    TableInfoCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_changeTable.node.name:
                this._dealBtnChangeTableEvent();
                break;
            default:
                break;
        }
    };
    TableInfoCtrl.prototype._dealBtnChangeTableEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.changeroom", "ChangeRoomAck", {});
        this._setBtnChangeAnim(false);
    };
    TableInfoCtrl.prototype.initTpGameCtrl = function (tpGameCtrl) {
        this._tpGameCtrl = tpGameCtrl;
    };
    /**
     * 设置牌桌信息
     * @param data 牌桌信息
     */
    TableInfoCtrl.prototype.setTableInfoData = function (data) {
        this.lab_bootAmount.string = "" + data.bootAmount;
        this.lab_chaalLimit.string = "" + data.chaalLimit;
        this.lab_maxBlinds.string = "" + data.maxBlinds;
        this.lab_potLimit.string = "" + data.potLimit;
    };
    /**
     * 设置牌桌信息的节点是否显示
     * @param active 是否显示
     */
    TableInfoCtrl.prototype.setTableInfoNodeActive = function (active) {
        this.node.active = active;
    };
    TableInfoCtrl.prototype._setBtnChangeAnim = function (isClear) {
        var _this = this;
        var fillRange = 0;
        var sprite_btn_changeTable = this.btn_changeTable.node.getChildByName("Background").getComponent(cc.Sprite);
        if (isClear) {
            this._clearChangeTableTimer();
            sprite_btn_changeTable.fillRange = 0;
            this.btn_changeTable.interactable = true;
        }
        else {
            this._clearChangeTableTimer();
            this.btn_changeTable.interactable = false;
            var actFun = function () {
                fillRange += -0.05;
                if ((cc.isValid(_this, true) && cc.isValid(sprite_btn_changeTable, true)) == false) {
                    clearInterval(localChangeTableTimer_1);
                    localChangeTableTimer_1 = null;
                    return;
                }
                ;
                if (fillRange <= -1) {
                    _this._clearChangeTableTimer();
                    sprite_btn_changeTable.fillRange = 0;
                    _this.btn_changeTable.interactable = true;
                    return;
                }
                ;
                sprite_btn_changeTable.fillRange = fillRange;
            };
            var localChangeTableTimer_1 = setInterval(actFun, 100);
            this._changeTableTimer = localChangeTableTimer_1;
        }
        ;
    };
    TableInfoCtrl.prototype._clearChangeTableTimer = function () {
        if (this._changeTableTimer !== null) {
            clearInterval(this._changeTableTimer);
            this._changeTableTimer = null;
        }
    };
    __decorate([
        property(cc.Label)
    ], TableInfoCtrl.prototype, "lab_bootAmount", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoCtrl.prototype, "lab_chaalLimit", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoCtrl.prototype, "lab_maxBlinds", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoCtrl.prototype, "lab_potLimit", void 0);
    __decorate([
        property(cc.Button)
    ], TableInfoCtrl.prototype, "btn_changeTable", void 0);
    TableInfoCtrl = __decorate([
        ccclass,
        menu('tpGame/TableInfoCtrl')
    ], TableInfoCtrl);
    return TableInfoCtrl;
}(cc.Component));
exports.TableInfoCtrl = TableInfoCtrl;
;
;

cc._RF.pop();