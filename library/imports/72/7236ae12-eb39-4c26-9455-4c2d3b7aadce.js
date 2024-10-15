"use strict";
cc._RF.push(module, '7236a4S6zlMJpRVTC07eq3O', 'CompareCardToastCtrl');
// tpGame/CompareCard/CompareCardToastCtrl.ts

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
var CompareCardToastCtrl = /** @class */ (function (_super) {
    __extends(CompareCardToastCtrl, _super);
    function CompareCardToastCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lab_pkName = null;
        _this.lab_user01Name = null;
        _this.lab_user02Name = null;
        _this.lab_refuseTime = null;
        _this.sprite_user01Tx = null;
        _this.sprite_user02Tx = null;
        _this.btn_refuse = null;
        _this.btn_agree = null;
        _this._waitAnswerTimer = null;
        return _this;
    }
    CompareCardToastCtrl.prototype.onLoad = function () {
        //@ts-ignore
        this.btn_refuse.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_agree.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    };
    CompareCardToastCtrl.prototype.onDestroy = function () {
        this.clearCompareCardToastTimer();
    };
    CompareCardToastCtrl.prototype.btnClickCall = function (btn) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var btnName = btn.node.name;
        switch (btnName) {
            case this.btn_refuse.node.name:
                this.dealBtnRefuseEvent();
                break;
            case this.btn_agree.node.name:
                this.dealBtnAgreeEvent();
                break;
        }
    };
    CompareCardToastCtrl.prototype.dealBtnRefuseEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", { agree: false });
    };
    CompareCardToastCtrl.prototype.dealBtnAgreeEvent = function () {
        //@ts-ignore
        GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", { agree: true });
    };
    /**
     * 设置比较卡牌的时间。
     * @param time 需要设置的时间，单位为秒。
     * 该函数首先检查时间是否大于0。如果是，它将清除现有的计时器，
     * 更新显示的时间，并启动一个新的计时器来递减时间。
     * 当时间减少到0或以下时，函数会发送一个拒绝比较的答案请求给游戏服务器。
     * 如果传入的时间不大于0，函数会直接清除计时器，更新显示，并发送拒绝比较的答案请求。
     */
    CompareCardToastCtrl.prototype.setCompareCardToastTime = function (time) {
        var _this = this;
        if (time > 0) {
            this.clearCompareCardToastTimer();
            this.lab_refuseTime.string = "Refuse " + time + "s";
            var actTimerCall = function () {
                time -= 1;
                if ((cc.isValid(_this, true) && cc.isValid(_this.lab_refuseTime, true)) == false) {
                    clearInterval(loaclWaitAnswerTimer_1);
                    loaclWaitAnswerTimer_1 = null;
                    //@ts-ignore
                    GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", { agree: false });
                    return;
                }
                ;
                if (time <= 0) {
                    _this.clearCompareCardToastTimer();
                    _this.lab_refuseTime.string = "Refuse";
                    loaclWaitAnswerTimer_1 = null;
                    //@ts-ignore
                    GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", { agree: false });
                    return;
                }
                ;
                _this.lab_refuseTime.string = "Refuse " + time + "s";
            };
            var loaclWaitAnswerTimer_1 = setInterval(actTimerCall, 1000);
            this._waitAnswerTimer = loaclWaitAnswerTimer_1;
        }
        else {
            this.clearCompareCardToastTimer();
            this.lab_refuseTime.string = "Refuse";
            //@ts-ignore
            GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", { agree: false });
        }
        ;
    };
    /**
     * 清除比较卡牌的计时器。
     * 该函数检查是否存在等待答案的计时器，如果存在，则清除该计时器并将内部计时器引用设置为null。
     */
    CompareCardToastCtrl.prototype.clearCompareCardToastTimer = function () {
        if (this._waitAnswerTimer !== null) {
            clearInterval(this._waitAnswerTimer);
            this._waitAnswerTimer = null;
        }
        ;
    };
    /**
     * 设置比较卡牌玩家信息
     * @param info 包含发动比牌信息和被比牌信息的对象，每个信息包含玩家名称和头像URL
     */
    CompareCardToastCtrl.prototype.setCompareCardToastPlayersInfo = function (info) {
        var _this = this;
        var launchInfo = info.launchInfo;
        var targetInfo = info.targetInfo;
        this.lab_pkName.string = launchInfo.name;
        this.lab_user01Name.string = launchInfo.name;
        cc.assetManager.loadRemote(launchInfo.headUrl, { ext: '.png' }, function (err, texture) {
            if (!err && cc.isValid(_this, true) && cc.isValid(_this.sprite_user01Tx, true)) {
                var spriteFrame = new cc.SpriteFrame(texture);
                _this.sprite_user01Tx.spriteFrame = spriteFrame;
                _this.sprite_user01Tx.node.setContentSize(cc.size(120, 120));
            }
            ;
        });
        this.lab_user02Name.string = targetInfo.name;
        cc.assetManager.loadRemote(targetInfo.headUrl, { ext: '.png' }, function (err, texture) {
            if (!err && cc.isValid(_this, true) && cc.isValid(_this.sprite_user02Tx, true)) {
                var spriteFrame = new cc.SpriteFrame(texture);
                _this.sprite_user02Tx.spriteFrame = spriteFrame;
                _this.sprite_user02Tx.node.setContentSize(cc.size(120, 120));
            }
            ;
        });
    };
    __decorate([
        property(cc.Label)
    ], CompareCardToastCtrl.prototype, "lab_pkName", void 0);
    __decorate([
        property(cc.Label)
    ], CompareCardToastCtrl.prototype, "lab_user01Name", void 0);
    __decorate([
        property(cc.Label)
    ], CompareCardToastCtrl.prototype, "lab_user02Name", void 0);
    __decorate([
        property(cc.Label)
    ], CompareCardToastCtrl.prototype, "lab_refuseTime", void 0);
    __decorate([
        property(cc.Sprite)
    ], CompareCardToastCtrl.prototype, "sprite_user01Tx", void 0);
    __decorate([
        property(cc.Sprite)
    ], CompareCardToastCtrl.prototype, "sprite_user02Tx", void 0);
    __decorate([
        property(cc.Button)
    ], CompareCardToastCtrl.prototype, "btn_refuse", void 0);
    __decorate([
        property(cc.Button)
    ], CompareCardToastCtrl.prototype, "btn_agree", void 0);
    CompareCardToastCtrl = __decorate([
        ccclass,
        menu('tpGame/CompareCardToastCtrl')
    ], CompareCardToastCtrl);
    return CompareCardToastCtrl;
}(cc.Component));
exports.default = CompareCardToastCtrl;

cc._RF.pop();