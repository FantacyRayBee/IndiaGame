"use strict";
cc._RF.push(module, 'bb2fddNXu9O8r2nxkvX+6EA', 'SignCtrl');
// notBundle/Sign/SignCtrl.ts

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
var SignItemCtrl_1 = require("./SignItemCtrl");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SignCtrl = /** @class */ (function (_super) {
    __extends(SignCtrl, _super);
    function SignCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_sign = null;
        _this.btn_close = null;
        _this.lab_day7 = null;
        _this.lab_day7Reward = null;
        _this.lab_btnGetTip = null;
        _this.node_day7Signed = null;
        _this.node_day7Unsigned = null;
        _this.itemPosArr = [
            cc.v2(-165, 84), cc.v2(-40, 84), cc.v2(85, 84),
            cc.v2(-165, -77), cc.v2(-40, -77), cc.v2(85, -77), cc.v2(85, -77),
        ];
        _this.signItemCtrlMap = new Map();
        _this.btn_sign_type = 0;
        return _this;
    }
    SignCtrl.prototype.onLoad = function () {
        var _this = this;
        //@ts-ignore
        this.btn_sign.node.on('click', CommonFun.getInstance().debounce(function () {
            if (_this.btn_sign_type == 0) {
                _this.onSignClick();
            }
            else {
                _this.tryEnterMinScoreTP();
            }
            ;
        }, 1), this);
        //@ts-ignore
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(function () {
            _this.node.destroy();
        }, 1), this);
        this.btn_sign.node.active = false;
        this.node_day7Signed.active = false;
        this.node_day7Unsigned.active = false;
    };
    SignCtrl.prototype.start = function () {
        var _this = this;
        Promise.all([this.getSignList(), this.getSignItemPrefab()])
            .then(function (arr) {
            _this.setSignListItem(arr);
        })
            .catch(function (err) {
            //@ts-ignore
            LoggerUtil.getInstance().error(err);
        });
    };
    SignCtrl.prototype.onDestroy = function () {
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SIGNITEM);
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SIGN);
    };
    SignCtrl.prototype.onSignClick = function () {
        var _this = this;
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
        //@ts-ignore
        var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/sign";
        //@ts-ignore
        CommonFun.getInstance().httpPost(httpUrl, {}, function (msg) {
            if (msg.result == 0 && msg.data) {
                var data = msg.data;
                //@ts-ignore
                if (data && CommonFun.getInstance().isValidForScr(_this)) {
                    //@ts-ignore
                    CommonFun.getInstance().showRewardsTips([{ id: 10, amount: data.gift / 100 }]);
                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.signInfo) {
                        //@ts-ignore
                        GlobalCfg.USER_DATAS.signInfo.today = data.today;
                        //@ts-ignore
                        GlobalCfg.USER_DATAS.signInfo.done = true;
                    }
                    ;
                    if (_this.signItemCtrlMap.has(data.today)) {
                        var signItemCtrl = _this.signItemCtrlMap.get(data.today);
                        signItemCtrl.setSignItemSigned();
                    }
                    ;
                    if (data.today == 7) {
                        _this.node_day7Signed.active = true;
                        _this.node_day7Unsigned.active = false;
                    }
                    ;
                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.recharged == 0 && CommonFun.getInstance().isNeedSignToastGetBtnChange()) {
                        _this.btn_close.node.active = true;
                        _this.btn_sign_type = 1;
                        _this.lab_btnGetTip.string = "Play Now";
                        var actTime = 0.5;
                        _this.btn_sign.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1), cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1))));
                    }
                    else {
                        _this.btn_sign_type = 0;
                        _this.btn_sign.interactable = false;
                        _this.btn_sign.enableAutoGrayEffect = true;
                        _this.btn_close.node.active = true;
                    }
                    ;
                }
                ;
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips(msg.msg);
            }
            ;
        }, null, 
        //@ts-ignore
        GlobalCfg.USER_DATAS.BearerToken);
    };
    SignCtrl.prototype.getSignList = function () {
        return new Promise(function (resolve, reject) {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.signInfo != null) {
                //@ts-ignore
                resolve(GlobalCfg.USER_DATAS.signInfo);
                return;
            }
            ;
            //@ts-ignore
            var url = GlobalCfg.HTTP_SERVER + "/v1/signlist";
            //@ts-ignore
            CommonFun.getInstance().httpGet(url, function (strInfo) {
                if (strInfo.result == 0) {
                    //@ts-ignore
                    GlobalCfg.USER_DATAS.signInfo = strInfo.data;
                    //@ts-ignore
                    resolve(GlobalCfg.USER_DATAS.signInfo);
                }
                else {
                    //@ts-ignore
                    CommonFun.getInstance().showTips(strInfo.msg);
                    reject(strInfo.msg);
                }
                ;
            }, null, 
            //@ts-ignore
            GlobalCfg.USER_DATAS.BearerToken);
        });
    };
    SignCtrl.prototype.getSignItemPrefab = function () {
        return new Promise(function (resolve, reject) {
            //@ts-ignore
            var prefabPath = GlobalCfg.PREFAB_PATH.SIGNITEM;
            var arr = prefabPath.split("/");
            var bundleName = arr[0];
            var path = prefabPath.substring(bundleName.length + 1);
            //@ts-ignore
            CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
                bundle.load(path, cc.Prefab, function (error, prefab) {
                    if (!error) {
                        resolve(prefab);
                    }
                    else {
                        reject(error);
                    }
                    ;
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    SignCtrl.prototype.setSignListItem = function (arr) {
        var _this = this;
        if (!Array.isArray(arr)) {
            return;
        }
        ;
        var signData = arr[0];
        var itemPrefab = arr[1];
        if (!itemPrefab) {
            return;
        }
        ;
        if (!signData) {
            //@ts-ignore
            LoggerUtil.getInstance().log("No check-in data available");
            return;
        }
        ;
        if (!signData.gifts || !Array.isArray(signData.gifts)) {
            //@ts-ignore
            LoggerUtil.getInstance().log("The check-in list data is empty or not in array format");
            return;
        }
        ;
        if (signData.gifts.length != 7) {
            //@ts-ignore
            LoggerUtil.getInstance().log("Check in list data length error");
            return;
        }
        ;
        var len = signData.gifts.length;
        var index = 0;
        var addSignItem = function () {
            var gift = signData.gifts[index];
            if (index <= 5) {
                var signItemPos = _this.itemPosArr[index];
                var signItemNode = cc.instantiate(itemPrefab);
                var signItemCtrl = signItemNode.getComponent(SignItemCtrl_1.default);
                if (signItemCtrl) {
                    signItemCtrl.setSignItemData(gift, signData.today, signData.done, index + 1);
                    _this.signItemCtrlMap.set(index + 1, signItemCtrl);
                }
                ;
                signItemNode.name = "signItemDay" + (index + 1);
                signItemNode.setPosition(signItemPos);
                _this.node.addChild(signItemNode);
            }
            else if (index == 6) {
                _this.lab_day7.string = "Day7";
                _this.lab_day7Reward.string = "$" + gift / 100;
                if (signData.today > 7) {
                    _this.node_day7Signed.active = true;
                    _this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == true) {
                    _this.node_day7Signed.active = true;
                    _this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == false) {
                    _this.node_day7Signed.active = false;
                    _this.node_day7Unsigned.active = true;
                }
                else {
                    _this.node_day7Signed.active = false;
                    _this.node_day7Unsigned.active = false;
                }
                ;
            }
            ;
            index += 1;
            if (index == len) {
                _this.btn_sign.node.active = true;
                _this.btn_close.node.active = false;
                if (signData.done == true) {
                    //@ts-ignore
                    if (GlobalCfg.USER_DATAS.recharged == 0 && CommonFun.getInstance().isNeedSignToastGetBtnChange()) {
                        _this.btn_sign_type = 1;
                        _this.lab_btnGetTip.string = "Play Now";
                        _this.btn_close.node.active = true;
                        var actTime = 0.5;
                        _this.btn_sign.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1), cc.scaleTo(actTime, 1.3, 0.7), cc.scaleTo(actTime, 1, 1))));
                    }
                    else {
                        _this.btn_sign_type = 0;
                        _this.btn_sign.interactable = false;
                        _this.btn_sign.enableAutoGrayEffect = true;
                        _this.btn_close.node.active = true;
                    }
                    ;
                }
                ;
                _this.unschedule(addSignItem);
                return;
            }
            ;
        };
        this.schedule(addSignItem, 2 / cc.game.getFrameRate(), len - 1, 0);
    };
    SignCtrl.prototype.tryEnterMinScoreTP = function () {
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
                var itemData = null;
                for (var i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                    //@ts-ignore
                    if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
                        itemData = teenPattiRoomInfo[i];
                        break;
                    }
                    ;
                }
                ;
                if (!itemData) {
                    //@ts-ignore
                    window.isNeedShowRoomList = "tpGame";
                    //@ts-ignore
                    CommonFun.getInstance().showSelectRoom();
                    this.node.destroy();
                    return;
                }
                ;
                //@ts-ignore
                CommonFun.getInstance().showProgress();
                this.node.destroy();
                //@ts-ignore
                GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
                //@ts-ignore
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
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
            this.node.destroy();
        }
        ;
    };
    __decorate([
        property(cc.Button)
    ], SignCtrl.prototype, "btn_sign", void 0);
    __decorate([
        property(cc.Button)
    ], SignCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Label)
    ], SignCtrl.prototype, "lab_day7", void 0);
    __decorate([
        property(cc.Label)
    ], SignCtrl.prototype, "lab_day7Reward", void 0);
    __decorate([
        property(cc.Label)
    ], SignCtrl.prototype, "lab_btnGetTip", void 0);
    __decorate([
        property(cc.Node)
    ], SignCtrl.prototype, "node_day7Signed", void 0);
    __decorate([
        property(cc.Node)
    ], SignCtrl.prototype, "node_day7Unsigned", void 0);
    SignCtrl = __decorate([
        ccclass
    ], SignCtrl);
    return SignCtrl;
}(cc.Component));
exports.default = SignCtrl;

cc._RF.pop();