"use strict";
cc._RF.push(module, 'e3d82or8GxAjK6qbFClSVdv', 'TableInfoToastCtrl');
// tpGame/TableInfo/TableInfoToastCtrl.ts

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
var TableInfoToastCtrl = /** @class */ (function (_super) {
    __extends(TableInfoToastCtrl, _super);
    function TableInfoToastCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_bootAmount = null;
        _this.lab_chaalLimit = null;
        _this.lab_maxBlinds = null;
        _this.lab_potLimit = null;
        _this.btn_ok = null;
        return _this;
    }
    TableInfoToastCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_ok.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    TableInfoToastCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.setTableInfoToastActive(false);
    };
    /**
     * 设置桌信息
     * @param data
     */
    TableInfoToastCtrl.prototype.setTableInfoToastData = function (data) {
        this.lab_bootAmount.string = "" + data.bootAmount;
        this.lab_chaalLimit.string = "" + data.chaalLimit;
        this.lab_maxBlinds.string = "" + data.maxBlinds;
        this.lab_potLimit.string = "" + data.potLimit;
    };
    /**
     * 设置桌信息弹框是否显示
     * @param active 是否显示
     */
    TableInfoToastCtrl.prototype.setTableInfoToastActive = function (active) {
        this.node.active = active;
    };
    __decorate([
        property(cc.Label)
    ], TableInfoToastCtrl.prototype, "lab_bootAmount", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoToastCtrl.prototype, "lab_chaalLimit", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoToastCtrl.prototype, "lab_maxBlinds", void 0);
    __decorate([
        property(cc.Label)
    ], TableInfoToastCtrl.prototype, "lab_potLimit", void 0);
    __decorate([
        property(cc.Button)
    ], TableInfoToastCtrl.prototype, "btn_ok", void 0);
    TableInfoToastCtrl = __decorate([
        ccclass,
        menu('tpGame/TableInfoToastCtrl')
    ], TableInfoToastCtrl);
    return TableInfoToastCtrl;
}(cc.Component));
exports.default = TableInfoToastCtrl;

cc._RF.pop();