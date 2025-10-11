"use strict";
cc._RF.push(module, '08230KYbR5NoIfE1jnG2j7n', 'cricketMainCtrl');
// cricketGame/scripts/cricketMainCtrl.js

"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var Team = cc.Enum({
  None: 0,
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  T5: 5,
  T6: 6,
  T7: 7,
  T8: 8
});
cc.Class({
  "extends": cc.Component,
  properties: {
    betBtns: {
      "default": [],
      type: cc.Button,
      tooltip: "Bet按钮"
    },
    teamSpriteFrames: {
      "default": [],
      type: cc.SpriteFrame,
      tooltip: "队伍图标"
    },
    pabfabCoin: cc.Prefab,
    pabfabHistory: {
      "default": null,
      type: cc.Prefab,
      tooltip: "历史记录预制节点"
    },
    prefabPlayerList: {
      "default": null,
      type: cc.Prefab,
      tooltip: "玩家列表预制节点"
    },
    resultNode: {
      "default": null,
      type: cc.Prefab,
      tooltip: "结束记录预制节点"
    },
    clockNode: {
      "default": null,
      type: cc.Node,
      tooltip: "闹钟节点"
    },
    selfPlayerNode: {
      "default": null,
      type: cc.Node,
      tooltip: "玩家自己节点"
    },
    betButtonsNode: cc.Node,
    recordNode: {
      "default": null,
      type: cc.Node,
      tooltip: "历史记录管理节点"
    },
    playerSeatNode: {
      "default": null,
      type: cc.Node,
      tooltip: "玩家座位管理"
    },
    rouletteNode: {
      "default": null,
      type: cc.Node,
      tooltip: "转盘节点"
    },
    coinParentNode: {
      "default": null,
      type: cc.Node,
      tooltip: "金币父节点"
    },
    recordParentNode: {
      "default": null,
      type: cc.Node,
      tooltip: "历史记录父节点"
    },
    btnRecord: {
      "default": null,
      type: cc.Button,
      tooltip: "记录按钮"
    },
    btnAllWj: {
      "default": null,
      type: cc.Button,
      tooltip: "所有玩家"
    },
    btnAddCash: {
      "default": null,
      type: cc.Button,
      tooltip: "充值按钮"
    },
    btnRepeat: {
      "default": null,
      type: cc.Button,
      tooltip: "重复下注"
    },
    btnOpenMenu: {
      "default": null,
      type: cc.Button,
      tooltip: "菜单按钮"
    },
    endAnimationNode: {
      "default": null,
      type: cc.Node,
      tooltip: "游戏结束结算动画节点"
    },
    endAnimationResultNode: {
      "default": null,
      type: cc.Node,
      tooltip: "游戏结束结算动画结果"
    },
    spineSkeletonData: {
      "default": null,
      type: sp.SkeletonData,
      tooltip: "游戏结束结算动画数据"
    },
    betStartEndAnimationNode: {
      "default": null,
      type: cc.Node,
      tooltip: "开始结束Bet动画节点"
    },
    startEndSkeletonData: {
      "default": [],
      type: sp.SkeletonData,
      tooltip: "开始结束Spine动画数据"
    },
    vipSpriteAtlas: {
      "default": null,
      type: cc.SpriteAtlas,
      tooltip: "vip图标"
    },
    isInHide: {
      get: function get() {
        return this._isInHide;
      },
      set: function set(value) {
        this._isInHide = value;
      },
      type: cc.Boolean,
      visible: false
    }
  },
  ctor: function ctor() {
    this._isInHide = false;
    this.betDuration = 0; // 下注时长
    this.calcDuration = 0; // 结算时长
    this.betRates = [40, 30, 25, 20, 15, 10, 5, 2];
    this.betPoolsLabel = [null];
    this.selfBetPoolsLabel = [null];
    this.gameEndServerMsg = null; // 游戏结束消息        
    this.preRoundBetData = []; // 上一局下注数据
    this.curRoundBetData = []; // 当局下注数据
    this.gameState = null; // 游戏状态, 0 下注中，1转动+结算
    this.tableCoinsList = [null]; // 8个table的金币列表
    for (var i = 1; i <= 8; i++) {
      this.tableCoinsList.push(new Array());
    }
  },
  onLoad: function onLoad() {
    var _this = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRICKET_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this;
    CommonFun.getInstance().checkShiPei(this.node);
    this.serverMsgManager = this.node.getComponent("cricketServerMsgManager");
    this.curBetCtrl = this.betButtonsNode.getComponent('cricketCurBetCtrl');
    this.seatManager = this.playerSeatNode.getComponent('cricketSeatManager');
    this.recordCtrl = this.recordNode.getComponent('cricketRecordCtrl');
    this.rouletteManager = this.rouletteNode.getComponent('cricketRouletteManager');
    this.audioManager = this.node.getComponent('cricketAudioManager');
    this.audioManager.inite();
    var _loop = function _loop(i) {
      var btnNode = _this.betBtns[i].node;
      btnNode.getChildByName('labRate').getComponent(cc.Label).string = _this.betRates[i] + 'x';
      btnNode.getChildByName('num').getComponent(cc.Label).string = 0;
      btnNode.getChildByName('selfNum').getComponent(cc.Label).string = 0;
      btnNode.getChildByName('fg_01').active = false;
      _this.betPoolsLabel.push(btnNode.getChildByName('num').getComponent(cc.Label));
      _this.selfBetPoolsLabel.push(btnNode.getChildByName('selfNum').getComponent(cc.Label));
      btnNode.on('click', CommonFun.getInstance().debounce(function () {
        _this.btnBetClick(i + 1);
      }, 0), _this);
    };
    for (var i = 0; i < this.betBtns.length; i++) {
      _loop(i);
    }
    this.btnRecord.node.on('click', CommonFun.getInstance().debounce(this.btnClick), this);
    this.labAllPlayer = this.btnAllWj.node.getChildByName('playersNum').getChildByName('Label').getComponent(cc.Label);
    this.btnAllWj.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnAddCash.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnRepeat.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnOpenMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnRepeat.interactable = false;
    this.vipSprite = this.selfPlayerNode.getChildByName('txk').getChildByName('VIP').getComponent(cc.Sprite);
    if (CommonFun.getInstance().isOpenVipModule() == false) {
      this.vipSprite.node.active = false;
    }
    this.selfPlayerNode.getChildByName('WinLabel').active = false;
    this.btnAddCash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.clockNode.active = false;
    this.initJbPool();
    this.endAnimationNode.active = false;
    this.betStartEndAnimationNode.active = false;
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onCustomEventMsg, this);
  },
  start: function start() {
    var _this2 = this;
    this.serverMsgManager.sendLoginMsg();
    this.audioManager.playGameMusic('BgMusic');
    this.eventHide = function () {
      LoggerUtil.getInstance().log("Cricket Game: 切入到后台", _this2);
      if (_this2.isValid) {
        _this2.isInHide = true;
        _this2.rouletteManager.stopRotate();
        _this2.unscheduleAll();
      } else {
        _this2.destroy();
      }
    };
    cc.game.on(cc.game.EVENT_HIDE, this.eventHide);
    this.eventShow = function () {
      LoggerUtil.getInstance().log("Cricket Game: 切入到前台", _this2);
      if (_this2.isValid) {
        _this2.isInHide = false;
        _this2.serverMsgManager.sendFreshSceneMsg();
      } else {
        _this2.destroy();
      }
    };
    cc.game.on(cc.game.EVENT_SHOW, this.eventShow);
  },
  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    cc.game.off(cc.game.EVENT_HIDE, this.eventHide);
    cc.game.off(cc.game.EVENT_SHOW, this.eventShow);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_CRICKET_GAME);
  },
  // update (dt) {},
  unscheduleAll: function unscheduleAll() {
    this.unschedule(this.scheduleUpdateEndCoinCallback);
    this.unschedule(this.scheduleTime1Callback);
    this.unschedule(this.scheduleTime2Callback);
    this.unschedule(this.scheduleTimeCallback);
  },
  refreshScene: function refreshScene() {
    for (var i = 1; i < this.tableCoinsList.length; i++) {
      var tableCoins = this.tableCoinsList[i];
      for (var j = 0; j < tableCoins.length; j++) {
        var jbNode = tableCoins[j];
        if (jbNode.isValid == true) {
          this.removeJbNode(jbNode);
        }
      }
      tableCoins.length = 0;
    }
    this.closeTableLight();
  },
  closeTableLight: function closeTableLight() {
    for (var i = 0; i < this.betBtns.length; i++) {
      var node = this.betBtns[i].node;
      var lightNode = node.getChildByName('fg_01');
      lightNode.active = false;
      var lightAnimation = lightNode.getComponent(cc.Animation);
      if (lightAnimation) {
        lightAnimation.stop();
      }
      lightNode.opacity = 255;
    }
  },
  btnBetClick: function btnBetClick(ani) {
    if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minicricket"] == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        CommonFun.getInstance().showSmallAddCash();
      }, false);
      return;
    }
    this.serverMsgManager.sendBetMsg([{
      ani: ani,
      amount: this.curBetCtrl.curBetNum
    }]);
  },
  btnClick: function btnClick(Button) {
    var name = Button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (name == this.btnRecord.node.name) {
      var history = cc.instantiate(this.pabfabHistory);
      history.parent = this.node;
      var data = this.recordCtrl.getHistoryData();
      history.getComponent('cricketHistoryCtrl').initHistory(data);
    } else if (name == this.btnAllWj.node.name) {
      this.serverMsgManager.sendGetPlayerListMsg(0, 12);
    } else if (name == this.btnAddCash.node.name) {
      CommonFun.getInstance().showSmallAddCash();
    } else if (name == this.btnRepeat.node.name) {
      var arr = this.preRoundBetData.slice();
      this.serverMsgManager.sendBetMsg(arr);
      this.preRoundBetData.length = 0;
      this.btnRepeat.interactable = false;
    } else if (name == this.btnOpenMenu.node.name) {
      CommonFun.getInstance().showGameMenu(false);
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (self.isInHide == true) {
      LoggerUtil.getInstance().log('当前处于后台！！');
      return;
    }
    if (msgId == 'gameservice.login') {
      CommonFun.getInstance().hidProgress();
      self.dealLoginData(notify);
      CommonFun.getInstance().hidProgress();
    } else if (msgId == 'gameservice.loadwhole') {
      // 刷新游戏场景
      LoggerUtil.getInstance().log("刷新游戏场景>>>>", notify);
      self.dealLoginData(notify);
    } else if (msgId == 'gameservice.exit') {
      // 退出游戏通知
      self.unscheduleAll();
      self.rouletteManager.unscheduleAll();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == 'gameservice.playerlist') {
      // 获取玩家列表
      LoggerUtil.getInstance().log("获取玩家列表>>>>", notify);
      self.dealPlayerList(notify);
    } else if (msgId == 'gameservice.playernumberchangednotify') {
      // 人数变化通知
      LoggerUtil.getInstance().log("人数变化通知>>>>", notify);
      var num = notify.num;
      self.labAllPlayer.string = num;
    } else if (msgId == 'gameservice.bet') {
      // 下注通知
    } else if (msgId == 'gameservice.betnotify') {
      // 下注通知
      self.dealBetNotify(notify);
    } else if (msgId == 'gameservice.bettingupdatenotify') {
      // 下注过程update
      // LoggerUtil.getInstance().log("下注过程update>>>>", notify);
      if (notify) {
        var betPool = notify.betPool;
        var isPlaySound = false;
        for (var i = 0; i < betPool.length; i++) {
          var element = betPool[i];
          if (self.betPoolsLabel[i]) {
            var amount = Number(self.betPoolsLabel[i].string) * 100;
            if (element > amount) {
              if (!isPlaySound) {
                self.audioManager.playGameSound('otherCoin');
                var pos = self.btnAllWj.node.getPosition();
                cc.tween(self.btnAllWj.node).to(0.1, {
                  position: cc.v2(pos.x, 20)
                }).to(0.1, {
                  position: cc.v2(pos.x, 0)
                }).start();
                isPlaySound = true;
              }
              self.dealBetInfo(i, null, self.btnAllWj.node);
            }
          }
        }
        self.dealTableBetPoolData(betPool, false);
      }
    } else if (msgId == 'gameservice.startbettingnotify') {
      // 开始下注阶段通知
      LoggerUtil.getInstance().log("开始下注阶段通知>>>>", notify);
      self.audioManager.playGameMusic('BgMusic');
      self.gameState = 0;
      if (notify) {
        var diamond = notify.diamond;
        GlobalCfg.USER_DATAS.userDiamond = diamond;
      }
      self.updateSelfCoin();
      self.timeSound();
      self.dealStartEndBet(true);
      self.refreshScene();
      if (self.preRoundBetData.length > 0) {
        self.btnRepeat.interactable = true;
      } else {
        self.btnRepeat.interactable = false;
      }
    } else if (msgId == 'gameservice.startflynotify') {
      // 开始转动阶段通知, 结束
      self.audioManager.pauseMusic();
      self.gameState = 1;
      LoggerUtil.getInstance().log("开始转动阶段通知>>>>", notify);
      self.curRoundBet = 0;
      for (var _i = 0; _i < self.curRoundBetData.length; _i++) {
        var betData = self.curRoundBetData[_i];
        self.curRoundBet = self.curRoundBet + Number(betData.amount);
      }
      if (self.curRoundBetData.length > 0) {
        self.preRoundBetData = self.curRoundBetData.slice();
        self.curRoundBetData.length = 0;
      } else {
        self.curRoundBetData.length = 0;
        self.preRoundBetData.length = 0;
      }
      self.btnRepeat.interactable = false;
      self.dealStartEndBet(false);
      if (notify) {
        var openInfo = notify.openInfo;
        var targetNum = openInfo.ani;
        self.rouletteManager.startRotate(targetNum);
        self.gameEndServerMsg = openInfo;
      }
    } else if (msgId == 'gameservice.updatecoinnotify') {
      // 货币更新广播
    } else if (msgId == 'gameservice.joinvip') {
      //vip入座
    } else if (msgId == 'gameservice.joinvipnotify') {
      //vip入座广播
      LoggerUtil.getInstance().log("vip入座广播>>>>", notify);
    } else if (msgId == "gameservice.shortmessagenotify") {
      self.shortmessagenotify(notify); // 发送表情
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      self.updateSelfCoin();
    }
    // else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
    // self.unscheduleAll();
    // self.rouletteManager.unscheduleAll();
    // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
    // }
  },
  onCustomEventMsg: function onCustomEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (self.isInHide == true) {
      LoggerUtil.getInstance().log('当前处于后台！！');
      return;
    }
    if (msgId == "GAME_CRICKET_ROULETTEE_END") {
      LoggerUtil.getInstance().warn("轮盘转动结束", notify, self.gameEndServerMsg);
      LoggerUtil.getInstance().timeEnd('GAME_CRICKET_ROULETTEE_END');
      if (!self.gameEndServerMsg) {
        return;
      }
      self.audioManager.playGameSound('settlementBGM');
      // 轮盘转动结束
      /**
       * 播放动效, 更新历史记录
       * 回收金币、散金币、发放到个人，飘加钱数值
       *
       */
      var ani = self.gameEndServerMsg.ani;
      var endNode = notify.endNode;
      self.playEndAnimation(ani, self.gameEndServerMsg, endNode);
      this.showWinAreaLight(ani);
      self.dealGameFinishData(self.gameEndServerMsg);
    } else if (msgId == "GAME_CRICKET_GIFT_SEND_COIN_UPDATE") {
      // 自己发送表情，更新金币值
      self.updateSelfCoin();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      self.serverMsgManager.sendExitMsg();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("cricket");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    var result = notify.result;
    LoggerUtil.getInstance().error(notify);
    var msg = result.message ? result.message : "SERVICE ERROR";
    if (msgId == 'gameservice.joinvip') {
      ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
        msgCode: "GAME_CRICKET_SEAT_JOINVIP_ERROR",
        msgData: {
          result: result
        }
      });
      CommonFun.getInstance().showTips(msg);
    } else if (msgId == 'gameservice.bet') {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            GameServerManager.send("gameservice.exit", "ExitReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(result.message);
      }
      ;
    } else if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    } else {
      CommonFun.getInstance().showTips(msg);
    }
    ;
  },
  shortmessagenotify: function shortmessagenotify(notify) {
    if (!notify) {
      return;
    }
    ;
    var msgType = notify.msgType; // 消息类型 0短语 1表情 2礼物
    var target = notify.target; // 接收者seat (-1表示群发)
    var sender = notify.sender; // 发送者seat
    var price = notify.price; // 消息价格
    var senderAfter = notify.senderAfter; // 发送者扣价后货币
    var name = notify.name; // 表情名/短语内容

    if (msgType != 2) {// 1表情
    } else {
      var targetNodeArr = [];
      var senderCtrl = this.seatManager.getPlayerCtrlBySeatId(sender);
      if (!senderCtrl || !senderCtrl.node) {
        return;
      } else {
        senderCtrl.setUserCoinLabel(senderAfter);
      }
      if (target == -1) {
        for (var i = 0; i < this.seatManager.seatNodeList.length; i++) {
          var seatNode = this.seatManager.seatNodeList[i];
          var seatNodeCtrl = seatNode.getComponent('cricketSeatCtrl');
          if (seatNodeCtrl.isSelf == false && seatNodeCtrl.node.childrenCount > 0) {
            targetNodeArr.push(seatNode);
          }
          ;
        }
        ;
      } else {
        var playersCtrl = this.seatManager.getPlayerCtrlBySeatId(target);
        if (playersCtrl) {
          targetNodeArr.push(playersCtrl.node);
        }
        ;
      }
      ;
      CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
    }
    ;
  },
  /**
   * 开始/结束下注
   * @param {boolean} bool true 开始，false 结束
   */
  dealStartEndBet: function dealStartEndBet(bool) {
    var _this3 = this;
    this.rouletteManager.offEndNodeLight();
    this.betStartEndAnimationNode.active = true;
    var spine = this.betStartEndAnimationNode.getComponent(sp.Skeleton);
    if (bool) {
      this.audioManager.playGameSound('start');
      spine.skeletonData = this.startEndSkeletonData[1];
      var arr = new Array(9).fill(0, 0, 9);
      this.dealTableBetPoolData(arr, false);
      this.dealTableBetPoolData(arr, true);
    } else {
      this.audioManager.playGameSound('Sotpbeting');
      spine.skeletonData = this.startEndSkeletonData[0];
    }
    spine.setAnimation(0, "animation", false);
    spine.setCompleteListener(function () {
      _this3.betStartEndAnimationNode.active = false;
    });
  },
  /**
   * 登录
   * @param {*} notify 
   */
  dealLoginData: function dealLoginData(notify) {
    this.rouletteManager.stopRotate();
    if (!notify) {
      LoggerUtil.getInstance().warn("dealLoginData:notify is Error", notify);
      return;
    }
    var allInfo = notify.whole;
    this.dealWholeInfo(allInfo);
  },
  /**
   * 处理场景所有信息
   * @param {WholeInfo} WholeInfo 
   */
  dealWholeInfo: function dealWholeInfo(WholeInfo) {
    if (!WholeInfo) {
      return;
    }
    this.gameEndServerMsg = null;
    var config = WholeInfo.config;
    var chips = config.chipOption; // 下注选项
    this.curBetCtrl.initBetNum(chips);
    this.betDuration = config.betDuration;
    this.calcDuration = config.calcDuration;
    var requester = WholeInfo.requester; // 玩家信息
    var userInfo = requester.userInfo;
    var chiped = requester.chip; // 已下注的，下标为Animal
    this.setSelfUserInfo(userInfo);
    this.dealTableBetPoolData(chiped, true);
    var sceneInfo = WholeInfo.scene;
    var status = sceneInfo.status;
    var playerNum = sceneInfo.playerNum; // 总玩家人数
    this.labAllPlayer.string = playerNum;
    var currentStatusLeftMs = sceneInfo.currentStatusLeftMs; // 当前状态剩余时间
    // LoggerUtil.getInstance().warn("当前状态剩余时间", currentStatusLeftMs + "ms", currentStatusLeftMs / 1000 + "s");
    var openInfo = sceneInfo.openInfo; // 延时开奖信息
    var betPool = sceneInfo.betPool; // 下注池 Array
    this.dealTableBetPoolData(betPool, false);
    var openRecord = sceneInfo.openRecord; // 开奖记录
    this.recordCtrl.initItem(openRecord);
    var vips = sceneInfo.vip;
    this.seatManager.initAllPlayer(vips);
    this.gameState = status;
    this.updateClockTime(-1);
    this.closeTableLight();
    switch (status) {
      case 0:
        // 下注状态
        // LoggerUtil.getInstance().log('下注状态');
        this.timeSound(currentStatusLeftMs);
        break;
      case 1:
        // 转动中
        // LoggerUtil.getInstance().log('转动中');
        var targetNum = openInfo.ani;
        this.rouletteManager.startRotate(targetNum, currentStatusLeftMs);
        this.gameEndServerMsg = openInfo;
        break;
      case 2:
        // 结算中
        // LoggerUtil.getInstance().log('结算中');
        break;
      default:
        break;
    }
  },
  /**
   * 倒计时 ， 
   * @param {Number} time ms
   */
  timeSound: function timeSound(timeMs) {
    var _this4 = this;
    if (timeMs) {
      var time_S_1 = timeMs % 1000 / 1000;
      var time_S_2 = Math.floor(timeMs / 1000);
      if (time_S_2 >= 1) {
        var count = time_S_2;
        this.updateClockTime(count);
        this.scheduleTime2Callback = function () {
          count--;
          _this4.updateClockTime(count);
          if (count <= 3 && count > 0) {
            _this4.audioManager.playGameSound('time3-2');
          }
          if (count <= 0) {
            _this4.updateClockTime(-1);
          }
        };
        this.scheduleTime1Callback = function () {
          _this4.schedule(_this4.scheduleTime2Callback, 1, count - 1);
        };
        this.scheduleOnce(this.scheduleTime1Callback, time_S_1);
      } else {
        this.updateClockTime(time_S_2);
        this.scheduleTime1Callback = function () {
          _this4.updateClockTime(-1);
        };
        this.scheduleOnce(this.scheduleTime1Callback, time_S_1);
      }
    } else {
      var _count = Math.floor(this.betDuration / 1000);
      this.updateClockTime(_count);
      this.scheduleTimeCallback = function () {
        _count--;
        _this4.updateClockTime(_count);
        if (_count <= 3 && _count > 0) {
          _this4.audioManager.playGameSound('time3-2');
        }
        if (_count <= 0) {
          _this4.updateClockTime(-1);
        }
      };
      this.schedule(this.scheduleTimeCallback, 1, Math.floor(this.betDuration / 1000) - 1);
    }
  },
  /**
   * 
   * @param {*} time 闹钟内的时间，单位：s
   */
  updateClockTime: function updateClockTime(time) {
    if (time >= 0) {
      var lab = this.clockNode.getChildByName('time').getComponent(cc.Label);
      lab.string = time.toFixed(0);
      this.clockNode.active = true;
    } else {
      this.clockNode.active = false;
    }
  },
  /**
   * 玩家自己信息
   * @param {*} UserInfo 用户信息
   */
  setSelfUserInfo: function setSelfUserInfo(UserInfo) {
    if (!UserInfo) {
      return;
    }
    GlobalCfg.USER_DATAS.userId = UserInfo.uid;
    GlobalCfg.USER_DATAS.userName = UserInfo.nickname;
    GlobalCfg.USER_DATAS.userDiamond = UserInfo.diamond;
    GlobalCfg.USER_DATAS.userHeadimgurl = UserInfo.imgUrl;
    this.selfPid = UserInfo.playerId; // 当前游戏玩家唯一标识
    var pos = UserInfo.pos;
    var vipLevel = UserInfo.vipLevel;
    this.selfPlayerNode.getChildByName('userName').getComponent(cc.Label).string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 8);
    this.updateSelfCoin();
    var tx = cc.find('txk/mask/tx', this.selfPlayerNode);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 80, tx.getComponent(cc.Sprite));
    if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.vipSprite.node.active = true;
      this.vipSprite.spriteFrame = this.vipSpriteAtlas.getSpriteFrame("" + vipLevel);
    } else {
      this.vipSprite.node.active = false;
    }
    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
    if (isCanShowVIPFont) {
      this.selfPlayerNode.getChildByName('userName').color = new cc.Color(250, 225, 76);
    } else {
      this.selfPlayerNode.getChildByName('userName').color = new cc.Color(255, 255, 255);
    }
    ;
    if (pos > -1) {
      // 自己在座位上
    }
  },
  /**
  * 更新自己的金币
  */
  updateSelfCoin: function updateSelfCoin() {
    this.selfPlayerNode.getChildByName('wj_jb_bg').getChildByName('labCoin').getComponent(cc.Label).string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
  },
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this5 = this;
    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this5) && cc.isValid(heaSprite)) {
          heaSprite.spriteFrame = new cc.SpriteFrame(texture);
          heaSprite.node.setScale(realWidth / heaSprite.node.width);
        }
      });
    }
  },
  /**
   * 处理桌面下注池数据
   * @param {Array} betPools 稀疏数组, 数组下标为类型
   * @param {boolean} isSelfBet 是否是自己下注
   */
  dealTableBetPoolData: function dealTableBetPoolData(betPools, isSelfBet) {
    if (isSelfBet === void 0) {
      isSelfBet = false;
    }
    for (var i = 0; i < betPools.length; i++) {
      var element = betPools[i];
      if (isSelfBet) {
        if (this.selfBetPoolsLabel[i]) {
          this.selfBetPoolsLabel[i].string = Number(element) / 100;
        }
      } else {
        if (this.betPoolsLabel[i]) {
          this.betPoolsLabel[i].string = Number(element) / 100;
        }
      }
    }
  },
  /**
   * 处理下注信息
   * @param {BetNotify} notify 
   */
  dealBetNotify: function dealBetNotify(notify) {
    if (!notify) {
      LoggerUtil.getInstance().warn("dealBetNotify:notify is Error", notify);
      return;
    }
    var playerid = notify.pid;
    var pos = notify.pos;
    var after = notify.after;
    if (pos == -1 || playerid == this.selfPid) {
      // 自己
      this.audioManager.playGameSound('mytouCoin');
      this.selfBetCoinAction();
      var chip = notify.chip;
      this.updateCurRoundBetInfo(chip);
      var selfAllChip = notify.allChip;
      GlobalCfg.USER_DATAS.userDiamond = after;
      this.updateSelfCoin();
      this.dealTableBetPoolData(selfAllChip, true);
      for (var i = 0; i < chip.length; i++) {
        this.dealBetInfo(chip[i].ani, chip[i].amount, this.selfPlayerNode);
        this.showBetAreaClickAction(chip[i].ani);
      }
      if (pos !== -1) {
        var playerCtrl = this.seatManager.getPlayerCtrlBySeatId(pos);
        playerCtrl.setUserCoinLabel(after);
      }
    } else {
      this.audioManager.playGameSound('otherCoin');
      var _playerCtrl = this.seatManager.getPlayerCtrlBySeatId(pos);
      var seatNode = this.seatManager.getSeatNodeBySeatId(pos);
      if (_playerCtrl) {
        _playerCtrl.setUserCoinLabel(after);
      }
      this.seatManager.seatNodePlayerBet(pos);
      var _chip = notify.chip;
      for (var _i2 = 0; _i2 < _chip.length; _i2++) {
        this.dealBetInfo(_chip[_i2].ani, _chip[_i2].amount, seatNode);
      }
    }
  },
  selfBetCoinAction: function selfBetCoinAction() {
    var txNode = this.selfPlayerNode.getChildByName('txk');
    cc.tween(txNode).to(0.1, {
      position: cc.v2(0, 20)
    }).to(0.1, {
      position: cc.v2(0, 0)
    }).start();
  },
  showBetAreaClickAction: function showBetAreaClickAction(ani) {
    if (ani > 8 || ani == 0) {
      LoggerUtil.getInstance().error("ani 类型超出范围", ani);
      return;
    }
    var btnAreaNode = this.betBtns[ani - 1].node;
    var selfBetLab = btnAreaNode.getChildByName('selfNum');
    if (selfBetLab) {
      cc.tween(selfBetLab).to(0.1, {
        scale: 1.2
      }).to(0.1, {
        scale: 1
      }).start();
    }
  },
  /**
   * 更新当前回合下注信息
   * @param {Array<{ani, amount}>} arr 
   */
  updateCurRoundBetInfo: function updateCurRoundBetInfo(arr) {
    for (var i = 0; i < arr.length; i++) {
      var ani = arr[i].ani;
      var isAdd = false;
      for (var j = 0; j < this.curRoundBetData.length; j++) {
        var element = this.curRoundBetData[j];
        if (ani == element.ani) {
          element.amount += arr[i].amount;
          isAdd = true;
          break;
        }
      }
      if (isAdd == false) {
        this.curRoundBetData.push({
          ani: ani,
          amount: arr[i].amount
        });
      }
    }
    // LoggerUtil.getInstance().warn('我当前的下注：', this.curRoundBetData);
  },
  /**
   * 设置总下注值
   * @param {Array} betPools 
   */
  setTotalBetNum: function setTotalBetNum(betPools) {
    var all = 0;
    for (var i = 0; i < betPools.length; i++) {
      var element = betPools[i];
      all += element;
    }
    this.labTotalBet.string = all / 100;
  },
  /**
  * 处理下注信息
  * @param {Team} ani Team {1~8}
  * @param {number} num
  * @param {cc.Node} betNode
  * @returns
  */
  dealBetInfo: function dealBetInfo(ani, num, betNode) {
    if (ani > 8 || ani == 0) {
      LoggerUtil.getInstance().error("ani 类型超出范围", ani);
      return;
    }
    var pos = betNode.getPosition();
    var betArea = this.betBtns[ani - 1].node;
    var count = 3; // 每次下注个数
    for (var i = 0; i < count; i++) {
      this.moveCoinToBetArea(pos, betArea, betNode, ani);
    }
  },
  /**
   * 玩家列表
   * @param {*} notify 
   * @returns 
   */
  dealPlayerList: function dealPlayerList(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("PlayerList Data Error!");
      return;
    }
    var node = this.node.getChildByName('playerList');
    if (node) {
      var nodeCtrl = node.getComponent('cricketPlayerList');
      if (nodeCtrl) {
        nodeCtrl.setPlayerData(notify);
      }
    } else {
      var nodePlayerList = cc.instantiate(this.prefabPlayerList);
      var _nodeCtrl = nodePlayerList.getComponent('cricketPlayerList');
      this.node.addChild(nodePlayerList);
      if (_nodeCtrl) {
        _nodeCtrl.setPlayerData(notify);
      }
    }
  },
  /**
   * 游戏结束
   * @param {OpenInfo} notify 
   */
  dealGameFinishData: function dealGameFinishData(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("GameFinish Data Error!", notify);
      return;
    }
  },
  /**
   * 播放结束动画
   * @param {Number} ani Animal
   */
  playEndAnimation: function playEndAnimation(ani, notify, endNode) {
    var _this6 = this;
    if (ani == 0 || ani > 8) {
      LoggerUtil.getInstance().error("ani is Error", ani);
      return;
    }
    var spine = this.endAnimationNode.getChildByName('spine').getComponent(sp.Skeleton);
    this.endAnimationNode.active = true;
    this.endAnimationResultNode.getComponent(cc.Sprite).spriteFrame = this.teamSpriteFrames[ani - 1];
    var animationName = "animation";
    spine.skeletonData = this.spineSkeletonData;
    spine.setAnimation(0, animationName, false);
    spine.setCompleteListener(function () {
      LoggerUtil.getInstance().warn('动画播放一次循环结束后的事件监听');
      _this6.endAnimationNode.active = false;
      _this6.dealGameEndCoin(notify);
      _this6.scheduleUpdateEndCoinCallback = function () {
        var selfInfo = notify.self;
        _this6.showEndRecordTween(ani, endNode);
        _this6.selfSettlement(selfInfo);
        _this6.updateGameEndPlayersCoin(notify);
      };
      _this6.scheduleOnce(_this6.scheduleUpdateEndCoinCallback, 0.5);
    });
  },
  showEndRecordTween: function showEndRecordTween(ani, endNode) {
    var _this7 = this;
    var pos1 = endNode.getPosition();
    // 游戏结束，生成节点至历史记录位置
    var node = cc.instantiate(this.resultNode);
    var worldPos = endNode.parent.convertToWorldSpaceAR(pos1);
    var nodePos = this.recordCtrl.nodeList.convertToNodeSpaceAR(worldPos);
    node.getComponent(cc.Sprite).spriteFrame = this.teamSpriteFrames[ani - 1];
    node.parent = this.recordCtrl.node.getChildByName('New Node');
    node.setPosition(nodePos);
    var pos = this.recordCtrl.getEndNodePos();
    cc.tween(node).to(1, {
      scale: 0.14,
      position: pos
    }, {
      easing: 'quadInOut'
    }).call(function () {
      _this7.recordCtrl.updateRecord(ani);
      node.destroy();
    }).start();
  },
  /**
   * 展示赢的区域金色光效
   * @param {Team} ani 
   */
  showWinAreaLight: function showWinAreaLight(ani) {
    var winNode = this.betBtns[ani - 1].node;
    var lightNode = winNode.getChildByName('fg_01');
    var lightAnimation = lightNode.getComponent(cc.Animation);
    lightNode.active = true;
    lightAnimation.play();
  },
  /**
   * 自己结算
   * @param {*} Player 
   */
  selfSettlement: function selfSettlement(Player) {
    if (!Player) {
      LoggerUtil.getInstance().error('结算玩家自己数据错误！');
      return;
    }
    var pos = Player.pos; // 座位号
    var playerid = Player.pid;
    var after = Player.after; // 结算过后
    var take = Player.take; // 输赢积分
    GlobalCfg.USER_DATAS.userDiamond = after;
    this.updateSelfCoin();
    this.curRoundAddCoinFinish();
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    var minLimit = this.curBetCtrl.betNumList[0] || 0;
    CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
    CommonFun.getInstance().showWithdrawToastInGame();
  },
  /**
   * 处理游戏结束金币动画
   * @param {OpenInfo} notify 
   */
  dealGameEndCoin: function dealGameEndCoin(notify) {
    var ani = notify.ani;
    if (ani > 8 || ani == 0) {
      LoggerUtil.getInstance().error("服务器消息错误!!ani 类型超出范围", ani);
      return;
    }
    var winAreaJbNodeList = this.tableCoinsList[ani];
    for (var i = 1; i < this.tableCoinsList.length; i++) {
      if (i == ani) {
        continue;
      }
      var array = this.tableCoinsList[i];
      for (var j = 0; j < array.length; j++) {
        var coinNode = array[j];
        this.funcMoveCoin(coinNode, this.btnAllWj.node, 0.35);
      }
    }
    this.sendCoinToWiner(winAreaJbNodeList, notify);
  },
  funcMoveCoin: function funcMoveCoin(coin, toNode, delayTime, isLastNode) {
    var _this8 = this;
    if (isLastNode === void 0) {
      isLastNode = false;
    }
    var localToPos = toNode.getPosition();
    var worldPos = toNode.parent.convertToWorldSpaceAR(localToPos);
    var toPos = this.coinParentNode.convertToNodeSpaceAR(worldPos);
    cc.tween(coin).delay(Math.random() * delayTime + 0.1).to(0.5, {
      position: toPos
    }, {
      easing: 'quadInOut'
    }).call(function () {
      _this8.removeJbNode(coin);
      if (isLastNode) {
        LoggerUtil.getInstance().warn('发金币到赢家发放完毕===========');
      }
    }).start();
  },
  /**
   * 发金币到赢家
   */
  sendCoinToWiner: function sendCoinToWiner(arr, notify) {
    var _this9 = this;
    LoggerUtil.getInstance().warn('发金币到赢家>>>>>');
    this.audioManager.playGameSound("jbrecover", false);
    var func = function func(coin, toNode, delayTime, isLastNode) {
      if (isLastNode === void 0) {
        isLastNode = false;
      }
      var localToPos = toNode.getPosition();
      var worldPos = toNode.parent.convertToWorldSpaceAR(localToPos);
      var toPos = _this9.coinParentNode.convertToNodeSpaceAR(worldPos);
      cc.tween(coin).delay(Math.random() * delayTime + 0.1).to(0.5, {
        position: toPos
      }, {
        easing: 'quadInOut'
      }).call(function () {
        _this9.removeJbNode(coin);
        if (isLastNode) {
          LoggerUtil.getInstance().warn('发金币到赢家发放完毕===========');
        }
      }).start();
    };
    var self = notify.self;
    var vips = notify.vips;
    if (self.take > 0) {
      var arr1 = arr.splice(-5, 5);
      for (var i = 0; i < arr1.length; i++) {
        var coinNode = arr1[i];
        this.funcMoveCoin(coinNode, this.selfPlayerNode, 0.45);
      }
    }
    // VIP 座位有人赢 
    if (vips.length > 0) {
      for (var _i3 = 0; _i3 < vips.length; _i3++) {
        var Player = vips[_i3];
        var playerSeatNode = this.seatManager.getSeatNodeBySeatId(Player.pos);
        if (Player.take > 0) {
          var _arr = arr.splice(-5, 5);
          for (var j = 0; j < _arr.length; j++) {
            var _coinNode = _arr[j];
            this.funcMoveCoin(_coinNode, playerSeatNode, 0.55);
          }
        }
      }
    }
    for (var _i4 = 0; _i4 < arr.length; _i4++) {
      var _coinNode2 = arr[_i4];
      this.funcMoveCoin(_coinNode2, this.btnAllWj.node, 0.55, false);
      if (_i4 == arr.length - 1) {
        this.funcMoveCoin(_coinNode2, this.btnAllWj.node, 0.55, true);
      }
    }
  },
  /**
   * 更新游戏结束的玩家金币
   * @param {Object} notify 
   */
  updateGameEndPlayersCoin: function updateGameEndPlayersCoin(notify) {
    var self = notify.self;
    var selfWin = self.take;
    if (selfWin > 0) {
      var winLabel = this.selfPlayerNode.getChildByName('WinLabel').getComponent(cc.Label);
      winLabel.node.setPosition(cc.v2(0, 0));
      winLabel.string = "+" + parseFloat((selfWin / 100).toFixed(2));
      winLabel.node.active = true;
      cc.tween(winLabel.node).to(1, {
        position: cc.v2(0, 100)
      }).delay(0.5).call(function () {
        winLabel.node.active = false;
      }).start();
    }
    var vips = notify.vips;
    if (vips.length > 0) {
      for (var i = 0; i < vips.length; i++) {
        var Player = vips[i];
        var vipPlayerCtrl = this.seatManager.getPlayerCtrlBySeatId(Player.pos);
        var take = Player.take;
        var after = Player.after;
        if (CommonFun.getInstance().isValidForScr(vipPlayerCtrl)) {
          vipPlayerCtrl.setUserCoinLabel(after);
          if (take > 0) {
            vipPlayerCtrl.showWinLabel(take);
          }
        }
      }
    }
  },
  /**
   * 发金币
   * @param {Array} arr 
   */
  sendOutCoin: function sendOutCoin(arr, winArea) {
    var _this10 = this;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              for (var i = 0; i < arr.length; i++) {
                var areaWidth = winArea.width - 40;
                var areaHeight = winArea.height - 60;
                var areaPos = winArea.getPosition();
                var worldAreaPos = winArea.parent.convertToWorldSpaceAR(areaPos);
                var nodeAreaPos = winArea.convertToNodeSpaceAR(worldAreaPos);
                var pos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
                var worldToPos = winArea.parent.convertToWorldSpaceAR(pos);
                var nodeToPos = _this10.coinParentNode.convertToNodeSpaceAR(worldToPos);
                var coinNode = arr[i];
                cc.tween(coinNode).to(1, {
                  position: nodeToPos
                }, {
                  easing: 'quadInOut'
                }).delay(0.5).call(function () {
                  resolve(true);
                }).start();
              }
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  //******************************************************************************* */
  /**
   * 生成各个区域的金币，并返回存储金币节点数组
   * @returns [cc.Node]
   */
  creatCoin: function creatCoin() {
    var _this11 = this;
    for (var i = 0; i < this.coinParentNode.children.length; i++) {
      var coin = this.coinParentNode.children[i];
      this.removeJbNode(coin);
    }
    var coinNodeList = [];
    var func = function func(betArea) {
      var areaWidth = betArea.width - 40;
      var areaHeight = betArea.height - 60;
      var areaPos = betArea.getPosition();
      var worldAreaPos = betArea.parent.convertToWorldSpaceAR(areaPos);
      var nodeAreaPos = betArea.convertToNodeSpaceAR(worldAreaPos);
      var pos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
      var worldToPos = betArea.parent.convertToWorldSpaceAR(pos);
      var nodeToPos = _this11.coinParentNode.convertToNodeSpaceAR(worldToPos);
      var coin = _this11.createJbNode();
      coin.setPosition(nodeToPos);
      _this11.coinParentNode.addChild(coin);
      coinNodeList.push(coin);
    };
    for (var key in this.btnBetButtons) {
      var betNode = this.btnBetButtons[key].node;
      for (var _i5 = 0; _i5 < 10; _i5++) {
        func(betNode);
      }
    }
    return coinNodeList;
  },
  /**
  * 移动金币去指定区域
  * @param {cc.Vec2} fromPos 
  * @param {cc.Node} betArea 下注区域节点
  * @param {cc.Node} fromNode 来自节点
  * @param {number} ani Team
  */
  moveCoinToBetArea: function moveCoinToBetArea(fromPos, betArea, fromNode, ani) {
    var areaNode = betArea.getChildByName('areaNode');
    var areaWidth = areaNode.width - 65;
    var areaHeight = areaNode.height - 65;
    var areaPos = areaNode.getPosition();
    var worldAreaPos = betArea.convertToWorldSpaceAR(areaPos);
    var nodeAreaPos = this.coinParentNode.convertToNodeSpaceAR(worldAreaPos);
    var toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight);
    var worldFromPos = fromNode.parent.convertToWorldSpaceAR(fromPos);
    var nodeFromPos = this.coinParentNode.convertToNodeSpaceAR(worldFromPos);
    var feijbNode = this.createJbNode();
    feijbNode.setPosition(nodeFromPos);
    this.coinParentNode.addChild(feijbNode);
    if (this.tableCoinsList[ani].length > 50) {
      var jbNode = this.tableCoinsList[ani].shift();
      this.removeJbNode(jbNode);
    }
    this.tableCoinsList[ani].push(feijbNode);
    cc.tween(feijbNode).delay(Number((Math.random() / 3).toFixed(2))).to(0.5, {
      position: toPos
    }).start();
  },
  initJbPool: function initJbPool() {
    this.jbPool = new cc.NodePool();
    var initCount = 150;
    for (var i = 0; i < initCount; i++) {
      this.jbPool.put(cc.instantiate(this.pabfabCoin)); //放入对象池
    }
  },

  createJbNode: function createJbNode() {
    var feijbNode = null;
    if (this.jbPool.size() > 0) {
      //通过size接口判断对象池中是否有空闲的对象
      feijbNode = this.jbPool.get();
    } else {
      //对象池中的备用对象不够时，通过cc.instantiate 重新创建
      feijbNode = cc.instantiate(this.pabfabCoin);
    }
    return feijbNode;
  },
  removeJbNode: function removeJbNode(feijbNode) {
    if (feijbNode == null) {
      LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
      return;
    }
    feijbNode.setPosition(0, 0);
    feijbNode.opacity = 255;
    this.jbPool.put(feijbNode);
  },
  /**
   * 获取VIP座位控制脚本
   * @param {*} seatId 座位ID
   * @return {seatCtrl}
   */
  getPlayerInfoByUserId: function getPlayerInfoByUserId(seatId) {
    var playerCtrl = null;
    playerCtrl = this.seatManager.getSeatNodeCtrlBySeatId(seatId);
    return playerCtrl;
  }
});

cc._RF.pop();