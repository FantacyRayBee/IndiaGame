"use strict";
cc._RF.push(module, '2409076HPJC9b8mh/CRsz/j', 'zooMain');
// zooGame/Scripts/zooMain.js

"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var zooAnimal = cc.Enum({
  Shark: 0,
  // 鲨鱼
  Monkey: 1,
  // 猴子
  Rabbit: 2,
  // 兔子
  Lion: 3,
  // 狮子
  Panda: 4,
  // 熊猫
  Swallow: 5,
  // 喜鹊
  Pigeon: 6,
  // 鸽子
  Peacock: 7,
  // 孔雀
  Eagle: 8,
  // 老鹰
  Beast: 9,
  // 走兽
  Bird: 10,
  // 飞禽
  // 以上是下注枚举, 以下包含额外开奖枚举
  GoldShark: 11,
  // 金鲨鱼
  AllKill: 12,
  // 全杀
  AllWin: 13 // 全赢
});

cc.Class({
  "extends": cc.Component,
  properties: {
    btnBetMonkey: cc.Button,
    btnBetRabbit: cc.Button,
    btnBetPanda: cc.Button,
    btnBetLion: cc.Button,
    btnBetSwallow: cc.Button,
    btnBetPigeon: cc.Button,
    btnBetPeacock: cc.Button,
    btnBetEagle: cc.Button,
    btnBetBeast: cc.Button,
    btnBetBird: cc.Button,
    btnBetShark: cc.Button,
    btnOpenMenu: cc.Button,
    labTotalBet: cc.Label,
    selfPlayerNode: cc.Node,
    betButtonsNode: cc.Node,
    recordNode: cc.Node,
    // 历史记录
    playerSeatNode: cc.Node,
    // 玩家座位
    rouletteNode: cc.Node,
    // 转盘节点
    coinParentNode: cc.Node,
    // 金币父节点

    pabfabCoin: cc.Prefab,
    prefabPlayerList: cc.Prefab,
    resultNode: cc.Prefab,
    btnAllWj: cc.Button,
    btnAddCash: cc.Button,
    endAnimationNode: cc.Node,
    // 结束动画
    spineSkeletonData: [sp.SkeletonData],
    // spine动画数据, 0 是Animal 1-8，1是鲨鱼，2是通吃，3是通赔
    betStartEndAnimationNode: cc.Node,
    // 开始结束动画节点
    startEndSkeletonData: [sp.SkeletonData],
    vipSpriteAtlas: cc.SpriteAtlas,
    btnRepeat: cc.Button,
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
    this.betPoolsLabel = {}; // 下注池,存放cc.Label
    this.selfBetPoolsLabel = {}; // 自己下注池,存放cc.Label
    this.gameEndServerMsg = null; // 游戏结束消息        
    this.preRoundBetData = []; // 上一局下注数据
    this.curRoundBetData = []; // 当局下注数据
    this.gameState = null; // 游戏状态, 0 下注中，1转动+结算
  },

  onLoad: function onLoad() {
    var _this = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ZOO_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.serverMsgManager = this.node.getComponent("zooServerMsgManager");
    this.zooCurBetCtrl = this.betButtonsNode.getComponent('zooCurBetCtrl');
    this.zooRecordCtrl = this.recordNode.getComponent('zooRecord');
    this.zooSeatManager = this.playerSeatNode.getComponent('zooSeatManager');
    this.zooRouletteManager = this.rouletteNode.getComponent('zooRouletteManager');
    this.zooAudioManager = this.node.getComponent('zooAudioManager');
    this.zooAudioManager.inite();
    this.btnBetButtons = {
      0: this.btnBetShark,
      // 鲨鱼
      1: this.btnBetMonkey,
      // 猴子
      2: this.btnBetRabbit,
      // 兔子
      3: this.btnBetLion,
      // 狮子
      4: this.btnBetPanda,
      // 熊猫
      5: this.btnBetSwallow,
      // 喜鹊
      6: this.btnBetPigeon,
      // 鸽子
      7: this.btnBetPeacock,
      // 孔雀
      8: this.btnBetEagle,
      // 老鹰
      9: this.btnBetBeast,
      // 走兽
      10: this.btnBetBird // 飞禽
    };
    var _loop = function _loop(key) {
      var btn = _this.btnBetButtons[key];
      btn.node.on('click', CommonFun.getInstance().debounce(function () {
        LoggerUtil.getInstance().log('点击了', key, zooAnimal[key], typeof key);
        _this.btnBetClick(Number(key));
      }, 0), _this);
    };
    for (var key in this.btnBetButtons) {
      _loop(key);
    }
    this.labBetMonkey = this.btnBetMonkey.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetRabbit = this.btnBetRabbit.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetPanda = this.btnBetPanda.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetLion = this.btnBetLion.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetSwallow = this.btnBetSwallow.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetPigeon = this.btnBetPigeon.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetPeacock = this.btnBetPeacock.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetEagle = this.btnBetEagle.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetBeast = this.btnBetBeast.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetBird = this.btnBetBird.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.labBetShark = this.btnBetShark.node.parent.getChildByName('lab').getComponent(cc.Label);
    this.betPoolsLabel = {
      0: this.labBetShark,
      // 鲨鱼
      1: this.labBetMonkey,
      // 猴子
      2: this.labBetRabbit,
      // 兔子
      3: this.labBetLion,
      // 狮子
      4: this.labBetPanda,
      // 熊猫
      5: this.labBetSwallow,
      // 喜鹊
      6: this.labBetPigeon,
      // 鸽子
      7: this.labBetPeacock,
      // 孔雀
      8: this.labBetEagle,
      // 老鹰
      9: this.labBetBeast,
      // 走兽
      10: this.labBetBird // 飞禽
    };

    this.labSelfBetMonkey = this.btnBetMonkey.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetRabbit = this.btnBetRabbit.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetLion = this.btnBetLion.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetPanda = this.btnBetPanda.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetSwallow = this.btnBetSwallow.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetPigeon = this.btnBetPigeon.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetPeacock = this.btnBetPeacock.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetEagle = this.btnBetEagle.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetBeast = this.btnBetBeast.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetBird = this.btnBetBird.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.labSelfBetShark = this.btnBetShark.node.parent.getChildByName('labSelf').getComponent(cc.Label);
    this.selfBetPoolsLabel = {
      0: this.labSelfBetShark,
      // 鲨鱼
      1: this.labSelfBetMonkey,
      // 猴子
      2: this.labSelfBetRabbit,
      // 兔子
      3: this.labSelfBetLion,
      // 狮子
      4: this.labSelfBetPanda,
      // 熊猫
      5: this.labSelfBetSwallow,
      // 喜鹊
      6: this.labSelfBetPigeon,
      // 鸽子
      7: this.labSelfBetPeacock,
      // 孔雀
      8: this.labSelfBetEagle,
      // 老鹰
      9: this.labSelfBetBeast,
      // 走兽
      10: this.labSelfBetBird // 飞禽
    };

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
    this.initJbPool();
    this.endAnimationNode.active = false;
    this.betStartEndAnimationNode.active = false;
    this.btnAddCash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onCustomEventMsg, this);
  },
  start: function start() {
    var _this2 = this;
    this.serverMsgManager.sendLoginMsg();
    this.zooAudioManager.playGameMusic('zooBgMusic');
    this.eventHide = function () {
      LoggerUtil.getInstance().log("ZooGame: 切入到后台", _this2);
      if (_this2.isValid) {
        _this2.isInHide = true;
        _this2.zooRouletteManager.stopRotate();
        _this2.unscheduleAll();
      } else {
        _this2.destroy();
      }
    };
    cc.game.on(cc.game.EVENT_HIDE, this.eventHide);
    this.eventShow = function () {
      LoggerUtil.getInstance().log("ZooGame: 切入到前台", _this2);
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
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ZOO_GAME);
  },
  unscheduleAll: function unscheduleAll() {
    this.unschedule(this.scheduleUpdateEndCoinCallback);
    this.unschedule(this.scheduleTime1Callback);
    this.unschedule(this.scheduleTime2Callback);
    this.unschedule(this.scheduleTimeCallback);
  },
  btnBetClick: function btnBetClick(ani) {
    this.serverMsgManager.sendBetMsg([{
      ani: ani,
      amount: this.zooCurBetCtrl.curBetNum
    }]);
  },
  btnClick: function btnClick(button) {
    var name = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (name == this.btnAllWj.node.name) {
      this.serverMsgManager.sendGetPlayerListMsg(0, 12);
    } else if (name == this.btnAddCash.node.name) {
      CommonFun.getInstance().showSmallAddCash();
    } else if (name == this.btnRepeat.node.name) {
      var arr = this.preRoundBetData.slice();
      this.serverMsgManager.sendBetMsg(arr);
      this.preRoundBetData.length = 0;
      this.btnRepeat.interactable = false;
    } else if (name == 'btnOpenMenu') {
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
      self.dealLoginData(notify);
    } else if (msgId == 'gameservice.loadwhole') {
      // 刷新游戏场景
      LoggerUtil.getInstance().log("刷新游戏场景>>>>", notify);
      self.dealLoginData(notify);
    } else if (msgId == 'gameservice.exit') {
      // 退出游戏通知
      self.unscheduleAll();
      self.zooRouletteManager.unscheduleAll();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
        var isShowAction = false;
        for (var i = 0; i < betPool.length; i++) {
          var element = betPool[i];
          if (Reflect.has(self.betPoolsLabel, i) == true) {
            var amount = Number(self.betPoolsLabel[i].string) * 100;
            if (element > amount) {
              self.dealBetInfo(i, null, self.btnAllWj.node);
              isShowAction = true;
            }
          }
        }
        if (isShowAction == true) {
          var pos = self.btnAllWj.node.getPosition();
          cc.tween(self.btnAllWj.node).to(0.1, {
            position: cc.v2(pos.x, 20)
          }).to(0.1, {
            position: cc.v2(pos.x, 0)
          }).start();
        }
        self.zooAudioManager.playGameSound('otherCoin');
        self.dealTableBetPoolData(betPool, false);
      }
    } else if (msgId == 'gameservice.startbettingnotify') {
      // 开始下注阶段通知
      LoggerUtil.getInstance().log("开始下注阶段通知>>>>", notify);
      self.zooAudioManager.playGameMusic('zooBgMusic');
      self.gameState = 0;
      if (notify) {
        var diamond = notify.diamond;
        GlobalCfg.USER_DATAS.userDiamond = diamond;
      }
      self.updateSelfCoin();
      self.timeSound();
      self.dealStartEndBet(true);
      if (self.preRoundBetData.length > 0) {
        self.btnRepeat.interactable = true;
      } else {
        self.btnRepeat.interactable = false;
      }
    } else if (msgId == 'gameservice.startflynotify') {
      // 开始转动阶段通知, 结束
      self.zooAudioManager.pauseMusic();
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
        self.zooRouletteManager.startRotate(targetNum);
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
    //     self.unscheduleAll();
    //     self.zooRouletteManager.unscheduleAll();
    //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
    if (msgId == "GAME_ZOO_ROULETTEE_END") {
      LoggerUtil.getInstance().warn("轮盘转动结束", notify, self.gameEndServerMsg);
      LoggerUtil.getInstance().timeEnd('GAME_ZOO_ROULETTEE_END');
      if (!self.gameEndServerMsg) {
        return;
      }
      self.zooAudioManager.playGameSound('showAnimal');
      // 轮盘转动结束
      /**
       * 更新历史记录，播放动效
       * 回收金币、散金币、发放到个人，飘加钱数值
       *
       */
      var ani = self.gameEndServerMsg.ani;
      var endNode = notify.endNode;
      var pos1 = endNode.getPosition();
      // 游戏结束，生成节点至历史记录位置
      var node = cc.instantiate(self.resultNode);
      node.getComponent('zooResultNodeCtrl').setSpriteFrame(ani);
      node.setPosition(pos1);
      node.parent = self.zooRouletteManager.node.parent;
      var pos = self.zooRecordCtrl.getEndNodePos();
      var worldPos = self.zooRecordCtrl.nodeList.convertToWorldSpaceAR(pos);
      var nodePos = self.zooRouletteManager.node.parent.convertToNodeSpaceAR(worldPos);
      cc.tween(node).to(1, {
        scale: 1,
        position: nodePos
      }, {
        easing: 'quadInOut'
      }).call(function () {
        self.zooRecordCtrl.updateRecord(ani);
        self.playEndAnimation(ani, self.gameEndServerMsg);
        node.destroy();
      }).start();
      self.dealGameFinishData(self.gameEndServerMsg);
    } else if (msgId == "GAME_ZOO_GIFT_SEND_COIN_UPDATE") {
      // 自己发送表情，更新金币值
      self.updateSelfCoin();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      self.serverMsgManager.sendExitMsg();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("zoo");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
        msgCode: "GAME_ZOO_SEAT_JOINVIP_ERROR",
        msgData: {
          result: result
        }
      });
    } else if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    } else if (msgId == "gameservice.bet") {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            GameServerManager.send("gameservice.exit", "ExitReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(result.message);
      }
      ;
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
      var senderCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(sender);
      if (!senderCtrl || !senderCtrl.node) {
        return;
      } else {
        senderCtrl.setUserCoinLabel(senderAfter);
      }
      if (target == -1) {
        for (var i = 0; i < this.zooSeatManager.seatNodeList.length; i++) {
          var seatNode = this.zooSeatManager.seatNodeList[i];
          var seatNodeCtrl = seatNode.getComponent('zooSeatCtrl');
          if (seatNodeCtrl.isSelf == false && seatNodeCtrl.node.childrenCount > 0) {
            targetNodeArr.push(seatNode);
          }
          ;
        }
        ;
      } else {
        var playersCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(target);
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
    this.zooRouletteManager.offEndNodeLight();
    this.betStartEndAnimationNode.active = true;
    var spine = this.betStartEndAnimationNode.getComponent(sp.Skeleton);
    if (bool) {
      this.zooAudioManager.playGameSound('time1');
      spine.skeletonData = this.startEndSkeletonData[1];
      var arr = new Array(11).fill(0, 0, 11);
      this.dealTableBetPoolData(arr, false);
      this.dealTableBetPoolData(arr, true);
      for (var i = 0; i < this.coinParentNode.children.length; i++) {
        var coinNode = this.coinParentNode.children[i];
        if (coinNode && coinNode.isValid) {
          this.removeJbNode(coinNode);
        }
      }
    } else {
      this.zooAudioManager.playGameSound('Sotpbeting');
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
    this.zooRouletteManager.stopRotate();
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
    this.zooCurBetCtrl.initBetNum(chips);
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
    LoggerUtil.getInstance().warn("当前状态剩余时间", currentStatusLeftMs + "ms", currentStatusLeftMs / 1000 + "s");
    var openInfo = sceneInfo.openInfo; // 延时开奖信息
    var betPool = sceneInfo.betPool; // 下注池 Array
    this.dealTableBetPoolData(betPool, false);
    var openRecord = sceneInfo.openRecord; // 开奖记录
    this.zooRecordCtrl.initItem(openRecord);
    var vips = sceneInfo.vip;
    this.zooSeatManager.initAllPlayer(vips);
    this.gameState = status;
    switch (status) {
      case 0:
        // 下注状态
        LoggerUtil.getInstance().warn('下注状态');
        this.timeSound(currentStatusLeftMs);
        break;
      case 1:
        // 转动中
        LoggerUtil.getInstance().warn('转动中');
        var targetNum = openInfo.ani;
        this.zooRouletteManager.startRotate(targetNum, currentStatusLeftMs);
        this.gameEndServerMsg = openInfo;
        break;
      case 2:
        // 结算中
        LoggerUtil.getInstance().warn('结算中');
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
        this.scheduleTime2Callback = function () {
          count--;
          if (count <= 3 && count > 0) {
            _this4.zooAudioManager.playGameSound('time3-2');
          }
        };
        this.scheduleTime1Callback = function () {
          _this4.schedule(_this4.scheduleTime2Callback, 1, count - 1);
        };
        this.scheduleOnce(this.scheduleTime1Callback, time_S_1);
      }
    } else {
      var _count = 10;
      this.scheduleTimeCallback = function () {
        _count--;
        if (_count <= 3 && _count > 0) {
          _this4.zooAudioManager.playGameSound('time3-2');
        }
      };
      this.schedule(this.scheduleTimeCallback, 1, 9);
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
    this.vipSprite.spriteFrame = this.vipSpriteAtlas.getSpriteFrame("" + vipLevel);
    this.selfPlayerNode.getChildByName('userName').getComponent(cc.Label).string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 8);
    this.updateSelfCoin();
    var tx = cc.find('txk/mask/tx', this.selfPlayerNode);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 80, tx.getComponent(cc.Sprite));
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
   * @param {Array} betPools 稀疏数组, 数组下标为动物类型
   * @param {boolean} isSelfBet 是否是自己下注
   */
  dealTableBetPoolData: function dealTableBetPoolData(betPools, isSelfBet) {
    if (isSelfBet === void 0) {
      isSelfBet = false;
    }
    for (var i = 0; i < betPools.length; i++) {
      var element = betPools[i];
      if (Reflect.has(this.betPoolsLabel, i) == true) {
        if (isSelfBet) {
          this.selfBetPoolsLabel[i].string = Number(element) / 100;
        } else {
          this.betPoolsLabel[i].string = Number(element) / 100;
        }
      }
    }
    if (isSelfBet == false) {
      this.setTotalBetNum(betPools);
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
      this.zooAudioManager.playGameSound('mytouCoin');
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
        var playerCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(pos);
        playerCtrl.setUserCoinLabel(after);
      }
    } else {
      this.zooAudioManager.playGameSound('otherCoin');
      var playerNode = this.zooSeatManager.getPlayerBySeatId(pos);
      var seatNode = this.zooSeatManager.getSeatNodeBySeatId(pos);
      if (playerNode) {
        var _playerCtrl = playerNode.getComponent("zooPlayerCtrl");
        _playerCtrl.setUserCoinLabel(after);
      }
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
    var btnAreaNode = this.btnBetButtons[ani].node.parent;
    var selfBetLab = btnAreaNode.getChildByName('labSelf');
    if (selfBetLab) {
      cc.tween(selfBetLab).to(0.1, {
        scale: 1.2
      }).to(0.1, {
        scale: 1
      }).start();
    }
  },
  /**
   * 
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
   */
  dealBetInfo: function dealBetInfo(ani, num, betNode) {
    var pos = betNode.getPosition();
    var betArea = this.btnBetButtons[ani].node;
    var count = 3; // 每次下注个数
    for (var i = 0; i < count; i++) {
      this.moveCoinToBetArea(pos, betArea, betNode);
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
      var nodeCtrl = node.getComponent('zooPlayerList');
      if (nodeCtrl) {
        nodeCtrl.setPlayerData(notify);
      }
    } else {
      var nodePlayerList = cc.instantiate(this.prefabPlayerList);
      var _nodeCtrl = nodePlayerList.getComponent('zooPlayerList');
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
    var otherTake = notify.otherTake; // 非VIP输赢
    var self = notify.self; // 自己
    var vips = notify.vips; // VIP 玩家输赢
    var ani = notify.ani; // 中奖位置
    this.dealGameEndCoin(notify);
  },
  /**
   * 播放结束动画
   * @param {Number} ani zooAnimal
   */
  playEndAnimation: function playEndAnimation(ani, notify) {
    var _this6 = this;
    var spine = this.endAnimationNode.getChildByName('spine').getComponent(sp.Skeleton);
    this.endAnimationNode.active = true;
    var spSkData = null;
    var animationName = null;
    if (ani == zooAnimal.Shark) {
      spSkData = this.spineSkeletonData[1];
      animationName = 'animation';
    } else if (ani == zooAnimal.AllKill) {
      spSkData = this.spineSkeletonData[2];
      animationName = 'animation';
    } else if (ani == zooAnimal.AllWin) {
      spSkData = this.spineSkeletonData[3];
      animationName = 'animation';
    } else if (ani == zooAnimal.GoldShark) {
      spSkData = this.spineSkeletonData[4];
      animationName = 'animation';
    } else {
      spSkData = this.spineSkeletonData[0];
      animationName = zooAnimal[ani];
    }
    spine.skeletonData = spSkData;
    spine.setAnimation(0, animationName, false);
    spine.setCompleteListener(function () {
      LoggerUtil.getInstance().warn('动画播放一次循环结束后的事件监听');
      _this6.endAnimationNode.active = false;
      _this6.scheduleUpdateEndCoinCallback = function () {
        if (!notify) {
          return;
        }
        var selfInfo = notify.self;
        _this6.selfSettlement(selfInfo);
        _this6.updateGameEndPlayersCoin(notify);
      };
      _this6.scheduleOnce(_this6.scheduleUpdateEndCoinCallback, 0.5);
    });
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
    if (cc.isValid(this)) {
      var minLimit = this.zooCurBetCtrl.betNumList[0] || 0;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  /**
   * 处理游戏结束金币动画
   * @param {OpenInfo} notify 
   */
  dealGameEndCoin: function dealGameEndCoin(notify) {
    var _this7 = this;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var ani, arr, node, length, arr1, arr2, _length, _arr, _arr2;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            ani = notify.ani;
            arr = _this7.creatCoin();
            if (!(ani == zooAnimal.AllWin)) {
              _context.next = 10;
              break;
            }
            LoggerUtil.getInstance().time('全赢收金币');
            _context.next = 6;
            return _this7.collectCoin(arr, false);
          case 6:
            LoggerUtil.getInstance().timeEnd('全赢收金币');
            _this7.sendCoinToWiner(arr, notify);
            _context.next = 41;
            break;
          case 10:
            if (!(ani == zooAnimal.AllKill)) {
              _context.next = 17;
              break;
            }
            LoggerUtil.getInstance().time('全输收金币');
            _context.next = 14;
            return _this7.collectCoin(arr, true);
          case 14:
            LoggerUtil.getInstance().timeEnd('全输收金币');
            _context.next = 41;
            break;
          case 17:
            if (!(ani == zooAnimal.Shark || ani == zooAnimal.GoldShark)) {
              _context.next = 25;
              break;
            }
            _context.next = 20;
            return _this7.collectCoin(arr, false);
          case 20:
            node = _this7.btnBetButtons[0].node;
            Promise.all([_this7.sendOutCoin(arr, node)]).then(function () {
              LoggerUtil.getInstance().log('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
            })["catch"](function (err) {
              LoggerUtil.getInstance().error(err);
            });
            _this7.sendCoinToWiner(arr, notify);
            _context.next = 41;
            break;
          case 25:
            if (!(ani == zooAnimal.Lion || ani == zooAnimal.Panda || ani == zooAnimal.Rabbit || ani == zooAnimal.Monkey)) {
              _context.next = 34;
              break;
            }
            _context.next = 28;
            return _this7.collectCoin(arr, false);
          case 28:
            length = arr.length;
            arr1 = arr.slice(0, Math.floor(length / 2));
            arr2 = arr.slice(Math.floor(length / 2), length);
            Promise.all([_this7.sendOutCoin(arr1, _this7.btnBetButtons[ani].node), _this7.sendOutCoin(arr2, _this7.btnBetBeast.node)]).then(function () {
              LoggerUtil.getInstance().warn('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
              _this7.sendCoinToWiner(arr, notify);
            })["catch"](function (err) {
              LoggerUtil.getInstance().error(err);
            });
            _context.next = 41;
            break;
          case 34:
            if (!(ani == zooAnimal.Swallow || ani == zooAnimal.Pigeon || ani == zooAnimal.Peacock || ani == zooAnimal.Eagle)) {
              _context.next = 41;
              break;
            }
            _context.next = 37;
            return _this7.collectCoin(arr, false);
          case 37:
            _length = arr.length;
            _arr = arr.slice(0, Math.floor(_length / 2));
            _arr2 = arr.slice(Math.floor(_length / 2), _length);
            Promise.all([_this7.sendOutCoin(_arr, _this7.btnBetButtons[ani].node), _this7.sendOutCoin(_arr2, _this7.btnBetBird.node)]).then(function () {
              LoggerUtil.getInstance().log('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
              _this7.sendCoinToWiner(arr, notify);
            })["catch"](function (err) {
              LoggerUtil.getInstance().error(err);
            });
          case 41:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  /**
   * 发金币到赢家
   */
  sendCoinToWiner: function sendCoinToWiner(arr, notify) {
    var _this8 = this;
    LoggerUtil.getInstance().warn('发金币到赢家>>>>>');
    this.zooAudioManager.playGameSound("jbrecover", false);
    var func = function func(coin, toNode, delayTime, isLastNode) {
      if (isLastNode === void 0) {
        isLastNode = false;
      }
      var localToPos = toNode.getPosition();
      var worldPos = toNode.parent.convertToWorldSpaceAR(localToPos);
      var toPos = _this8.coinParentNode.convertToNodeSpaceAR(worldPos);
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
    };
    var self = notify.self;
    var vips = notify.vips;
    if (self.take > 0) {
      var arr1 = arr.splice(-5, 5);
      for (var i = 0; i < arr1.length; i++) {
        var coinNode = arr1[i];
        func(coinNode, this.selfPlayerNode, 0.45);
      }
    }
    // VIP 座位有人赢 
    if (vips.length > 0) {
      for (var _i3 = 0; _i3 < vips.length; _i3++) {
        var Player = vips[_i3];
        var playerSeatNode = this.zooSeatManager.getSeatNodeBySeatId(Player.pos);
        if (Player.take > 0) {
          var _arr3 = arr.splice(-5, 5);
          for (var j = 0; j < _arr3.length; j++) {
            var _coinNode = _arr3[j];
            func(_coinNode, playerSeatNode, 0.55);
          }
        }
      }
    }
    for (var _i4 = 0; _i4 < arr.length; _i4++) {
      var _coinNode2 = arr[_i4];
      func(_coinNode2, this.btnAllWj.node, 0.55, false);
      if (_i4 == arr.length - 1) {
        func(_coinNode2, this.btnAllWj.node, 0.55, true);
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
      winLabel.string = "+" + Math.round(selfWin / 100);
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
        var vipPlayerCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(Player.pos);
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
   * 收金币
   * @param {boolean} remove 是否回收至对象池
   */
  collectCoin: function collectCoin(arr, remove) {
    var _this9 = this;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var _loop2 = function _loop2() {
                var coinNode = arr[i];
                cc.tween(coinNode).to(1, {
                  position: cc.v2(0, 0)
                }, {
                  easing: 'quadInOut'
                }).delay(0.5).call(function () {
                  if (remove) {
                    _this9.removeJbNode(coinNode);
                  }
                  resolve(true);
                }).start();
              };
              for (var i = 0; i < arr.length; i++) {
                _loop2();
              }
            }));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  /**
   * 发金币
   * @param {Array} arr 
   */
  sendOutCoin: function sendOutCoin(arr, winArea) {
    var _this10 = this;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              for (var _i5 = 0; _i5 < arr.length; _i5++) {
                var areaWidth = winArea.width - 40;
                var areaHeight = winArea.height - 60;
                var areaPos = winArea.getPosition();
                var worldAreaPos = winArea.parent.convertToWorldSpaceAR(areaPos);
                var nodeAreaPos = winArea.convertToNodeSpaceAR(worldAreaPos);
                var pos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
                var worldToPos = winArea.parent.convertToWorldSpaceAR(pos);
                var nodeToPos = _this10.coinParentNode.convertToNodeSpaceAR(worldToPos);
                var coinNode = arr[_i5];
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
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  //******************************************************************************* */
  /**
   * 生成各个区域的金币，并返回存储金币节点数组
   * @returns [cc.Node]
   */
  creatCoin: function creatCoin() {
    var _this11 = this;
    for (var _i6 = 0; _i6 < this.coinParentNode.children.length; _i6++) {
      var coin = this.coinParentNode.children[_i6];
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
      for (var _i7 = 0; _i7 < 10; _i7++) {
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
   */
  moveCoinToBetArea: function moveCoinToBetArea(fromPos, betArea, fromNode) {
    var _this12 = this;
    var areaWidth = betArea.width - 40;
    var areaHeight = betArea.height - 60;
    var areaPos = betArea.getPosition();
    var worldAreaPos = betArea.parent.convertToWorldSpaceAR(areaPos);
    var nodeAreaPos = betArea.convertToNodeSpaceAR(worldAreaPos);
    var toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
    var worldFromPos = fromNode.parent.convertToWorldSpaceAR(fromPos);
    var worldToPos = betArea.parent.convertToWorldSpaceAR(toPos);
    var nodeFromPos = this.coinParentNode.convertToNodeSpaceAR(worldFromPos);
    var nodeToPos = this.coinParentNode.convertToNodeSpaceAR(worldToPos);
    var feijbNode = this.createJbNode();
    feijbNode.setPosition(nodeFromPos);
    this.coinParentNode.addChild(feijbNode);
    cc.tween(feijbNode).delay(Number((Math.random() / 3).toFixed(2))).to(0.5, {
      position: nodeToPos
    }).to(0.2, {
      opacity: 0
    }).call(function () {
      _this12.removeJbNode(feijbNode);
    }).start();
  },
  initJbPool: function initJbPool() {
    this.jbPool = new cc.NodePool();
    var initCount = 150;
    for (var _i8 = 0; _i8 < initCount; _i8++) {
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
   * @return {zooSeatCtrl}
   */
  getPlayerInfoByUserId: function getPlayerInfoByUserId(seatId) {
    var playerCtrl = null;
    playerCtrl = this.zooSeatManager.getSeatNodeCtrlBySeatId(seatId);
    return playerCtrl;
  }
});

cc._RF.pop();