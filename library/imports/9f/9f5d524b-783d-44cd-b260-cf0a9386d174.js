"use strict";
cc._RF.push(module, '9f5d5JLeD1EzbJgzwqThtF0', 'cricketRouletteManager');
// cricketGame/scripts/cricketRouletteManager.js

"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    roulettes: {
      "default": [],
      type: [cc.Node],
      visible: true,
      tooltip: "从顶部中间旋涡开始"
    }
  },
  ctor: function ctor() {
    this.endStageItemNums = 6; // 结束阶段随机范围 5-8个

    this.endNodeItem = null; // 最后停止的节点

    this.slowInterval = 0.2; // 轮盘慢速转动间隔

    this.slowShowLightInterval = 0.5; // 轮盘慢速展示光效间隔

    this.fastInterval = 0.03; // 轮盘快速转动间隔

    this.fastShowLightInterval = 0.3; // 轮盘快速展示光效间隔

    this.endInterval = 0.5; // 结束阶段最慢时间

    this.endWaitTime = 1.5; // 最终节点展示时间
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.offAllLight();
  },
  start: function start() {},
  unscheduleAll: function unscheduleAll() {
    this.unschedule(this.scheduleFastCallback);
    this.unschedule(this.scheduleSlowCallback);
    this.unschedule(this.scheduleOnceCallback);
    this.unschedule(this.scheduleRollingEndCallback);
  },

  /**
   * 关闭所有节点的光效
   */
  offAllLight: function offAllLight() {
    for (var i = 0; i < this.roulettes.length; i++) {
      var _node = this.roulettes[i];
      _node.getChildByName('fg_04').active = false;
    }
  },

  /**
   * 关闭最后停止的节点的光效
   */
  offEndNodeLight: function offEndNodeLight() {
    if (this.endNodeItem != null) {
      this.endNodeItem.getChildByName('fg_04').active = false;
      this.endNodeItem = null;
    }
  },

  /**
   * 停止旋转
   */
  stopRotate: function stopRotate() {
    this.unscheduleAll();
    this.offAllLight();
  },

  /**
   * 从上方中间开始顺时针旋转
   * @param {Animal} aniType
   * @param {number | null} remainder 剩余时间 ms
   */
  startRotate: function startRotate(aniType, remainder) {
    var _this = this;

    if (aniType == 0 || aniType > 8) {
      LoggerUtil.getInstance().error("服务器结算结果错误：", aniType);
      return;
    }

    this.fastRollIndex = 0;
    LoggerUtil.getInstance().time("GAME_CRICKET_ROULETTEE_END");
    this.offEndNodeLight();
    this.endStageItemNums = Math.floor(Math.random() * 4) + 5; // 结束慢速阶段个数

    var itemArr = this.getCurNodeList(aniType, remainder);
    var length = itemArr.length; // LoggerUtil.getInstance().log(`转盘个数：length:${length},结束慢速阶段个数:${this.endStageItemNums}`);
    // 转盘开始慢速阶段 →  转盘正常快速阶段 →  转盘结束慢速阶段

    /**
     * 转盘开始慢速阶段
     */

    var count = 0;

    this.scheduleSlowCallback = function () {
      var itemNode = itemArr[count];
      count++;

      if (count <= 6) {
        _this.itemRoulettes(itemNode, "slow");

        if (count == 6) {
          fastFunc();
        }
      }
    };
    /**
     * 转盘正常快速阶段
     */


    this.scheduleFastCallback = function () {
      var itemNode = itemArr[count];
      count++;

      _this.itemRoulettes(itemNode, "fast");

      if (count == length - _this.endStageItemNums) {
        LoggerUtil.getInstance().log("结束慢速阶段:", count);

        _this.endRoulettes(count, itemArr);
      }
    }; // 时间：0.03 * length = （84 + 2）2.58秒，最长 113*0.04 3.39秒


    var fastFunc = function fastFunc() {
      _this.schedule(_this.scheduleFastCallback, _this.fastInterval, length - 6 - 1 - _this.endStageItemNums);
    }; // 时间：0.2 * 6 = 1.2秒


    var slowFunc = function slowFunc() {
      _this.schedule(_this.scheduleSlowCallback, _this.slowInterval, 6 - 1);
    };

    if (length > this.endStageItemNums) {
      if (remainder) {
        count = 6;
        fastFunc();
      } else {
        slowFunc();
      }
    } else {
      if (length <= 0) {
        var arr = this.getEndNodeItemList(aniType);
        this.endNodeItem = arr[arr.length - 1];
        this.itemRoulettes(this.endNodeItem, "slow", true);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: "GAME_CRICKET_ROULETTEE_END",
          msgData: {
            endNode: this.endNodeItem
          }
        });
        return;
      } else {
        this.endRoulettes(0, itemArr);
      }
    }
  },

  /**
   * 最后慢速阶段
   * @param {Number} index 
   * @param {Array<cc.Node>} itemArr 轮盘节点数组
   */
  endRoulettes: function endRoulettes(index, itemArr) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var interval, time, count, temp;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              interval = ((_this2.endInterval - _this2.fastInterval) / _this2.endStageItemNums).toFixed(3);
              time = _this2.fastInterval + Number(interval);
              count = 0;

            case 3:
              if (!(index < itemArr.length)) {
                _context.next = 13;
                break;
              }

              time = _this2.fastInterval + Number(interval) * count;
              _context.next = 7;
              return _this2.endStage(index, itemArr, time)["catch"](function (err) {
                LoggerUtil.getInstance().error(err);

                _this2.unschdeule(_this2.scheduleOnceCallback);

                return;
              });

            case 7:
              temp = _context.sent;
              count++;
              index++;

              if (index == itemArr.length) {
                _this2.scheduleRollingEndCallback = function () {
                  ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: "GAME_CRICKET_ROULETTEE_END",
                    msgData: {
                      endNode: itemArr[itemArr.length - 1]
                    }
                  });
                };

                _this2.scheduleOnce(_this2.scheduleRollingEndCallback, _this2.endWaitTime);
              }

              _context.next = 3;
              break;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  endStage: function endStage(index, itemArr, delayTime) {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                _this3.scheduleOnceCallback = function () {
                  var itemNode = itemArr[index];

                  if (index < itemArr.length - 2) {
                    _this3.itemRoulettes(itemNode, "slow");
                  } else {
                    if (index == itemArr.length - 2) {
                      _this3.itemRoulettes(itemNode, "secondToLast", false);
                    } else if (index == itemArr.length - 1) {
                      _this3.endNodeItem = itemNode;

                      _this3.itemRoulettes(itemNode, "end", true);
                    }
                  }

                  resolve(true);
                };

                _this3.scheduleOnce(_this3.scheduleOnceCallback, delayTime);
              }));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },

  /**
   * 返回转动的节点数组
   * @param {Animal} type 
   * @param {*} remainder 当前状态剩余时间 ms
   * @returns 
   */
  getCurNodeList: function getCurNodeList(type, remainder) {
    var arr = [];

    if (remainder) {
      var moreTime = remainder - 6000; // 剩余时间 - （结束慢速阶段时间 + 回收金币时间）

      if (moreTime > 0) {
        var amount = Math.floor(moreTime / (this.fastInterval * 1000));
        var quotient = Math.floor(amount / this.roulettes.length); // 商数

        var remainderNumber = amount % this.roulettes.length; // 余数
        // LoggerUtil.getInstance().warn("amount总个数", amount, "商数:", quotient, "余数:", remainderNumber);

        switch (quotient) {
          case 0:
            arr = [];
            break;

          case 1:
            arr = [];
            arr.concat(this.roulettes.slice(-remainderNumber));
            break;

          case 2:
            arr = this.roulettes;
            arr.concat(this.roulettes.slice(-remainderNumber));
            break;

          default:
            arr = this.roulettes.concat(this.roulettes);
            break;
        }
      } else {
        return arr;
      }
    } else {
      arr = this.roulettes.concat(this.roulettes).concat(this.roulettes);
    }

    var addArr = this.getEndNodeItemList(type);
    return arr.concat(addArr);
  },

  /**
   * 获取结束添加的部分节点数组
   * @param {Animal} type 1~8
   * @returns 
   */
  getEndNodeItemList: function getEndNodeItemList(type) {
    var arr = [];
    var endIndex = 0;
    var endIndexList = [];

    switch (type) {
      case 1:
        endIndexList = [0];
        break;

      case 2:
        endIndexList = [12];
        break;

      case 3:
        endIndexList = [8, 20];
        break;

      case 4:
        endIndexList = [4, 16];
        break;

      case 5:
        endIndexList = [6, 18];
        break;

      case 6:
        endIndexList = [3, 9, 15, 21];
        break;

      case 7:
        endIndexList = [2, 7, 10, 14, 19, 22];
        break;

      case 8:
        endIndexList = [1, 5, 11, 13, 17, 23];
        break;

      default:
        break;
    }

    endIndex = endIndexList[Math.floor(Math.random() * endIndexList.length)];
    LoggerUtil.getInstance().log("type:" + type + ",endIndex:" + endIndex);
    arr = this.roulettes.slice(0, endIndex + 1); // 第一个为金鲨鱼，此处额外 +1

    return arr;
  },

  /**
   * 转到该节点动画
   * @param {cc.Node} itemNode 
   * @param {String} speedType 速度类型 slow or fast
   * @param {Boolean} isEnd 是否为最后一个节点
   */
  itemRoulettes: function itemRoulettes(itemNode, speedType, isEnd) {
    if (isEnd === void 0) {
      isEnd = false;
    }

    var timeObj = {
      "slow": 0.5,
      "fast": 0.2,
      "secondToLast": 0.7,
      "end": 1
    };
    var time = 0;
    time = timeObj[speedType] ? timeObj[speedType] : 0.3;

    switch (speedType) {
      case 'slow':
        if (this.fastRollIndex % 3 == 0) {
          this.fastRollIndex++;
        } else {
          GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('roll');
        }

        break;

      case 'fast':
        this.fastRollIndex++;

        if (this.fastRollIndex % 3 == 0) {
          GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('roll');
        }

        break;

      case 'secondToLast':
        GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('roll');
        break;

      case 'end':
        GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('lastRoll');
        break;

      default:
        break;
    } // if (speedType == "slow") {
    //     time = this.slowShowLightInterval;
    //     if (isEnd == true) {
    //         GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('lastRoll');
    //     } else {
    //         GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('roll');
    //     }
    // } else {
    //     this.fastRollIndex++;
    //     if (this.fastRollIndex % 3 == 0 && isEnd == false) {
    //         GlobalCfg.ACT_SCENE_CTRL.audioManager.playGameSound('roll');
    //     }
    //     time = this.fastShowLightInterval;
    // }


    if (itemNode) {
      itemNode.getChildByName('fg_04').active = true;

      if (speedType == 'end') {
        cc.tween(itemNode).to(time / 2, {
          scale: 1.2
        }).to(time / 2, {
          scale: 1
        }).call(function () {
          if (!isEnd) {
            itemNode.getChildByName('fg_04').active = false;
          } else {// LoggerUtil.getInstance().timeEnd("startRotate");
          }
        }).start();
      } else {
        cc.tween(itemNode).to(time / 2, {
          scale: 1.2
        }).to(time / 2, {
          scale: 1
        }).call(function () {
          if (!isEnd) {
            itemNode.getChildByName('fg_04').active = false;
          } else {// LoggerUtil.getInstance().timeEnd("startRotate");
          }
        }).start();
      }
    }
  } // update (dt) {},

});

cc._RF.pop();