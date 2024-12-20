"use strict";
cc._RF.push(module, '24a79ZJFAhD+6qwR/NJBwPu', 'zeusCentreAreaCtrl');
// zeusGame/src/zeusCentreAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_reel0: cc.Node,
    node_reel1: cc.Node,
    node_reel2: cc.Node,
    node_reel3: cc.Node,
    node_reel4: cc.Node,
    node_reel5: cc.Node,
    node_cell: cc.Node,
    node_roundScore: cc.Node,
    node_multi: cc.Node,
    node_multiLightNing: cc.Node,
    node_words: cc.Node,
    lab_flyScore: cc.Label,
    skeleton_multiLightNing: sp.Skeleton
  },
  ctor: function ctor() {
    this.firstEliminationInterval = 0.5;
    this.eliminationShowInterval = 2;
    this.fallingShowInterval = 0.5;
    this.allSpinArr = [];
    this.cellBottomLimitY = -450;
    this.cellInitialStartY = 50;
    this.oneStepDistance = 100;
  },
  onLoad: function onLoad() {
    this.initCellNodePool();
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  initCellNodePool: function initCellNodePool() {
    this.cellNodePool = new cc.NodePool();
    for (var i = 0; i < 35; i++) {
      var cellNode = cc.instantiate(this.node_cell);
      this.cellNodePool.put(cellNode);
    }
    ;
  },
  getCellNode: function getCellNode() {
    var cellNode = null;
    if (this.cellNodePool.size() > 0) {
      cellNode = this.cellNodePool.get();
    } else {
      cellNode = cc.instantiate(this.node_cell);
    }
    ;
    return cellNode;
  },
  putCellNodePool: function putCellNodePool(cellNode) {
    if (cellNode) {
      var ctrl = cellNode.getComponent('zeusCellCtrl');
      ctrl.reSetting();
      this.cellNodePool.put(cellNode);
    }
    ;
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
  },
  removeAllCellNodes: function removeAllCellNodes() {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var promiseArr = [];
      var _loop = function _loop(i) {
        var reelNode = _this["node_reel" + i];
        var promise = new Promise(function (resolve1, reject1) {
          cc.tween(reelNode).delay(0.1 * i).to(0.2, {
            position: cc.v2(reelNode.x, -250)
          }).call(function () {
            var cellNodeArr = [];
            reelNode.children.forEach(function (cellNode) {
              cellNodeArr.push(cellNode);
            });
            cellNodeArr.forEach(function (cellNode) {
              _this.putCellNodePool(cellNode);
            });
            reelNode.setPosition(cc.v2(reelNode.x, 250));
            resolve1();
          }).start();
        });
        promiseArr.push(promise);
      };
      for (var i = 0; i < 6; i++) {
        _loop(i);
      }
      ;
      Promise.all(promiseArr).then(function () {
        resolve();
      });
    });
  },
  removeSpinData: function removeSpinData() {
    this.allSpinArr = [];
    this.normalAfter = 0;
    this.finalAfter = 0;
    this.isHaveFreeSpin = false;
  },
  initShowCellNodes: function initShowCellNodes(scroll) {
    for (var i = 0, len = scroll.length; i < len; i++) {
      var axis = scroll[i];
      var cellArr = axis.cell;
      for (var k = 0, len2 = cellArr.length; k < len2; k++) {
        var cellData = cellArr[k];
        var cellNode = this.getCellNode();
        cellNode.setPosition(cc.v2(0, -450 + k * 100));
        this["node_reel" + i].addChild(cellNode);
        var cellCtrl = cellNode.getComponent("zeusCellCtrl");
        cellCtrl.setItemData(cellData);
      }
      ;
    }
    ;
  },
  dealSpinResultProcess: function dealSpinResultProcess(notify) {
    var spin = notify.spin;
    var freeSpin = notify.freeSpin;
    var normalAfter = notify.normalAfter;
    var finalAfter = notify.finalAfter;
    var bet = notify.bet;
    this.isHaveFreeSpin = false;
    this.normalAfter = normalAfter;
    this.finalAfter = finalAfter;
    var normalAllWinMul = 0; // 常规SPIN赢的总倍数
    if (spin) {
      spin.bet = bet;
      spin.isNormal = true;
      var curSpinWinMul = 0;
      if (spin.erase && spin.erase.length > 0) {
        for (var i = 0, len = spin.erase.length; i < len; i++) {
          var tempErase = spin.erase[i];
          tempErase.isNormal = true;
          tempErase.bet = bet;
          tempErase.isLastOne = i == len - 1;
          var spinWinMul = tempErase.spinWinMul;
          if (spinWinMul > curSpinWinMul) {
            curSpinWinMul = spinWinMul;
          }
          ;
          tempErase.progressAllMul = curSpinWinMul; // 截至到当前，累计赢的总倍数(ERASE)
        }

        ;
      }
      ;
      spin.progressAllMul = curSpinWinMul; // 截至到当前，累计赢的总倍数(SPIN)
      spin.spinWinMul = curSpinWinMul; // 当前SPIN赢的总倍数   

      normalAllWinMul = curSpinWinMul;
      this.allSpinArr.push(spin);
    }
    ;
    if (freeSpin && freeSpin.length > 0) {
      var grandTotalWinMul = normalAllWinMul;
      for (var _i = 0, _len = freeSpin.length; _i < _len; _i++) {
        var _spin = freeSpin[_i];
        _spin.bet = bet;
        _spin.isNormal = false;
        var _curSpinWinMul = 0;
        if (_spin.erase && _spin.erase.length > 0) {
          for (var _i2 = 0, len1 = _spin.erase.length; _i2 < len1; _i2++) {
            var _tempErase = _spin.erase[_i2];
            _tempErase.isNormal = false;
            _tempErase.bet = bet;
            _tempErase.isLastOne = _i2 == len1 - 1;
            var _spinWinMul = _tempErase.spinWinMul;
            if (_spinWinMul > _curSpinWinMul) {
              _curSpinWinMul = _spinWinMul;
            }
            ;
            _tempErase.progressAllMul = _curSpinWinMul + grandTotalWinMul; // 截至到当前，累计赢的总倍数(ERASE)
          }
          ;
        }
        ;
        _spin.progressAllMul = _curSpinWinMul + grandTotalWinMul; // 截至到当前，累计赢的总倍数(SPIN)
        _spin.spinWinMul = _curSpinWinMul; // 当前SPIN赢的总倍数

        grandTotalWinMul += _curSpinWinMul;
      }
      ;
      this.allSpinArr = this.allSpinArr.concat(freeSpin);
      this.isHaveFreeSpin = true;
    }
    ;
    this.dealSingleSpinProcess();
  },
  dealSingleSpinProcess: function dealSingleSpinProcess() {
    var _this2 = this;
    if (this.allSpinArr.length == 0) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED,
        msgData: {
          normalAfter: this.normalAfter,
          finalAfter: this.finalAfter,
          isHaveFreeSpin: this.isHaveFreeSpin
        }
      });
      return;
    }
    ;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING,
      msgData: {
        addFree: -1
      }
    });
    this.removeAllCellNodes().then(function () {
      var spin = _this2.allSpinArr.shift();
      spin = _this2.addLogicReelArrToSpin(spin);
      var addInitialCellPromise = _this2.addInitialCellNodes(spin);
      addInitialCellPromise.then(function () {
        _this2.dealOnceEraseProcess(spin);
      });
    });
  },
  addInitialCellNodes: function addInitialCellNodes(spin) {
    var _this3 = this;
    return new Promise(function (resolve, reject) {
      var scatterNotFreeNum = 0;
      var allPromiseArr = [];
      var logicReelArr = spin.logicReelArr;
      var isPlayRole = false;
      var _loop2 = function _loop2(i) {
        var logicCellArr = logicReelArr[i];
        var _loop3 = function _loop3(k) {
          var logicCell = logicCellArr[k];
          var cellData = logicCell.cellData;
          if (k < 5) {
            var cellNode = _this3.getCellNode();
            cellNode.setPosition(cc.v2(0, _this3.cellInitialStartY + k * _this3.oneStepDistance));
            _this3["node_reel" + i].addChild(cellNode);
            var cellCtrl = cellNode.getComponent("zeusCellCtrl");
            cellCtrl.setItemData(cellData);
            logicCell.cellNode = cellNode;
            if (cellData.elf == 1) {
              scatterNotFreeNum += 1;
            }
            ;
            var time = 0.08 * 5;
            var delayTime = 0.1 * i;
            var endPosition = cc.v2(0, _this3.cellBottomLimitY + k * _this3.oneStepDistance);
            var tempPromise = new Promise(function (resolve1, reject1) {
              if (cellData.elf == 12) {
                if (isPlayRole == false) {
                  isPlayRole = true;
                  GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playRoleLightNingEffect();
                  GlobalCfg.ACT_SCENE_CTRL.rightAreaCtrl.playRoleDongZuoAnim();
                }
                ;
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playMultEleShowEffect();
                _this3.scheduleOnce(function () {
                  _this3.playMultiLightNingAnim(cellNode, endPosition, cellData);
                }, 0.15 * (i + 1) + 0.03 * (k + 1));
              }
              ;
              var cellFalling = _this3.cellFallingPromise(cellNode, time, delayTime, endPosition, true);
              cellFalling.then(function () {
                resolve1();
              });
            });
            allPromiseArr.push(tempPromise);
          } else {
            return "break";
          }
        };
        for (var k = 0, len2 = logicCellArr.length; k < len2; k++) {
          var _ret = _loop3(k);
          if (_ret === "break") break;
        }
        ;
      };
      for (var i = 0, len = logicReelArr.length; i < len; i++) {
        _loop2(i);
      }
      ;
      new Promise(function (resolve1, reject) {
        for (var _i3 = 0; _i3 < scatterNotFreeNum; _i3++) {
          _this3.scheduleOnce(function () {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterEleAppearEffect();
          }, 0.15 * (_i3 + 1));
        }
        ;
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playReachBottomEffect();
        Promise.all(allPromiseArr).then(function () {
          resolve1();
        });
      }).then(function () {
        resolve();
      });
    });
  },
  playMultiLightNingAnim: function playMultiLightNingAnim(cellNode, endPosition, cellData) {
    var worldPos1 = cellNode.parent.convertToWorldSpaceAR(endPosition);
    var localPos1 = this.node_multiLightNing.convertToNodeSpaceAR(worldPos1);
    var lightNingNode = cc.instantiate(this.skeleton_multiLightNing.node);
    var skeleton = lightNingNode.getComponent(sp.Skeleton);
    var x = cellData.x;
    var animationName = "";
    if (x <= 8) {
      animationName = 'green';
    } else if (x <= 20) {
      animationName = 'blue';
    } else if (x <= 100) {
      animationName = 'red';
    } else {
      animationName = 'purple';
    }
    ;
    lightNingNode.active = true;
    lightNingNode.setPosition(cc.v2(localPos1.x, localPos1.y + 120));
    this.node_multiLightNing.addChild(lightNingNode);
    skeleton.defaultSkin = 'default';
    skeleton.setAnimation(0, animationName, false);
    skeleton.setCompleteListener(function (trackEntry, loopCount) {
      lightNingNode.destroy();
    });
  },
  cellFallingPromise: function cellFallingPromise(cellNode, time, delayTime, endPosition, isInit) {
    if (isInit === void 0) {
      isInit = false;
    }
    return new Promise(function (resolve, reject) {
      cc.tween(cellNode).delay(delayTime).to(time, {
        position: endPosition
      }, {
        easing: isInit ? 'backOut' : function (time1) {
          if (time1 <= 0.6) {
            return time1 * time1 + 16 / 15 * time1;
          } else if (time1 <= 0.8) {
            return time1 * time1 - 1.8 * time1 + 1.72;
          } else {
            return time1 * time1 - 1.4 * time1 + 1.4;
          }
        }
      }).call(function () {
        resolve();
      }).start();
    });
  },
  dealOnceEraseProcess: function dealOnceEraseProcess(spin) {
    var _this4 = this;
    if (spin.erase.length == 0) {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.setBoomIndexDefault();
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.setFreeXuLiIndexDefault();
      if (this.allSpinArr.length > 0 && spin.isNormal == true) {
        // 常规SPIN执行完成，开始免费SPIN，先展示15次免费SPIN的提示框
        CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
          bundle.load("prefabs/zeusChangeStateTips", cc.Prefab, function (err, prefab) {
            if (!err) {
              var scene = cc.director.getScene();
              var zeusChangeStateTipsNode = cc.instantiate(prefab);
              var zeusChangeStateTipsCtrl = zeusChangeStateTipsNode.getComponent("zeusChangeStateTipsCtrl");
              scene.addChild(zeusChangeStateTipsNode);
              zeusChangeStateTipsCtrl.setChangeStateData(true, 15).then(function () {
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                  msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_ENTER_FREE_STATUS,
                  msgData: {}
                });
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                  msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED,
                  msgData: {
                    spin: spin
                  }
                });
                _this4.dealSingleSpinProcess();
              });
            }
            ;
          });
        }, function (err) {
          LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-Bundle\u5F02\u5E38: " + JSON.stringify(err));
        });
      } else if (this.allSpinArr.length == 0 && spin.isNormal == false) {
        CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
          bundle.load("prefabs/zeusChangeStateTips", cc.Prefab, function (err, prefab) {
            if (!err) {
              var scene = cc.director.getScene();
              var zeusChangeStateTipsNode = cc.instantiate(prefab);
              var zeusChangeStateTipsCtrl = zeusChangeStateTipsNode.getComponent("zeusChangeStateTipsCtrl");
              scene.addChild(zeusChangeStateTipsNode);
              var allWin = spin.progressAllMul * spin.bet / 2000;
              zeusChangeStateTipsCtrl.setChangeStateData(false, allWin).then(function () {
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                  msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED,
                  msgData: {
                    spin: spin
                  }
                });
                _this4.dealSingleSpinProcess();
              });
            }
            ;
          });
        }, function (err) {
          LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-Bundle\u5F02\u5E38: " + JSON.stringify(err));
        });
      } else {
        // 判断是否展示当前SPIN中奖的结果
        var curSpinAllWin = spin.bet * spin.spinWinMul / 2000;
        var bigWinLevel = this.getBigWinLevel(spin.isNormal, spin.bet / 100, curSpinAllWin * 100 / spin.bet);
        if (bigWinLevel > 0) {
          CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
            bundle.load("prefabs/zeusRewardTips", cc.Prefab, function (err, prefab) {
              if (!err) {
                var scene = cc.director.getScene();
                var zeusRewardTipsNode = cc.instantiate(prefab);
                var zeusRewardTipsCtrl = zeusRewardTipsNode.getComponent("zeusRewardTipsCtrl");
                scene.addChild(zeusRewardTipsNode);
                zeusRewardTipsCtrl.showRewardTips(curSpinAllWin, bigWinLevel, spin.isNormal).then(function () {
                  ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED,
                    msgData: {
                      spin: spin
                    }
                  });
                  _this4.dealSingleSpinProcess();
                });
              }
              ;
            });
          }, function (err) {
            LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-Bundle\u5F02\u5E38: " + JSON.stringify(err));
          });
        } else {
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED,
            msgData: {
              spin: spin
            }
          });
          this.dealSingleSpinProcess();
        }
        ;
      }
      return;
    }
    ;
    var firstErase = spin.erase.shift();
    firstErase.isNormal = spin.isNormal;
    if (firstErase.roll) {
      var fallingPromise = this.playFollAnim(spin.logicReelArr, firstErase);
      fallingPromise.then(function () {
        _this4.scheduleOnce(function () {
          _this4.dealOnceEraseProcess(spin);
        }, spin.erase.length == 0 ? 0.5 : 0);
      });
    } else if (firstErase.elf == 12) {
      var eliminationPromise = this.playNotRollAnim(spin.logicReelArr, firstErase);
      eliminationPromise.then(function () {
        _this4.scheduleOnce(function () {
          _this4.dealOnceEraseProcess(spin);
        }, spin.erase.length == 0 ? 0.5 : 0);
      });
    } else {
      var oneTimeEraseArr = [];
      var _eliminationPromise = this.playNotRollAnim(spin.logicReelArr, firstErase);
      oneTimeEraseArr.push(_eliminationPromise);
      for (var i = 0, len = spin.erase.length; i < len; i++) {
        var eraseTemp = spin.erase[i];
        eraseTemp.isNormal = spin.isNormal;
        if (eraseTemp.roll == false) {
          _eliminationPromise = this.playNotRollAnim(spin.logicReelArr, eraseTemp);
          oneTimeEraseArr.push(_eliminationPromise);
        } else {
          break;
        }
        ;
      }
      ;
      spin.erase.splice(0, oneTimeEraseArr.length - 1);
      Promise.all(oneTimeEraseArr).then(function () {
        _this4.dealOnceEraseProcess(spin);
      });
    }
    ;
  },
  getBigWinLevel: function getBigWinLevel(isNormal, bet, betMul) {
    var level = 0;
    if (isNormal == true) {
      if (bet <= 10) {
        if (5 <= betMul && betMul < 10) {
          level = 1;
        } else if (10 <= betMul && betMul < 50) {
          level = 2;
        } else if (50 <= betMul && betMul < 150) {
          level = 3;
        } else if (150 <= betMul && betMul < 500) {
          level = 4;
        } else if (500 <= betMul) {
          level = 5;
        }
      } else if (10 < bet && bet <= 100) {
        if (4 <= betMul && betMul < 8) {
          level = 1;
        } else if (8 <= betMul && betMul < 40) {
          level = 2;
        } else if (40 <= betMul && betMul < 120) {
          level = 3;
        } else if (120 <= betMul && betMul < 400) {
          level = 4;
        } else if (400 <= betMul) {
          level = 5;
        }
      } else if (100 < bet && bet <= 300) {
        if (3 <= betMul && betMul < 6) {
          level = 1;
        } else if (6 <= betMul && betMul < 30) {
          level = 2;
        } else if (30 <= betMul && betMul < 80) {
          level = 3;
        } else if (80 <= betMul && betMul < 300) {
          level = 4;
        } else if (300 <= betMul) {
          level = 5;
        }
      } else if (300 < bet) {
        if (3 <= betMul && betMul < 5) {
          level = 1;
        } else if (5 <= betMul && betMul < 20) {
          level = 2;
        } else if (20 <= betMul && betMul < 60) {
          level = 3;
        } else if (60 <= betMul && betMul < 200) {
          level = 4;
        } else if (200 <= betMul) {
          level = 5;
        }
      }
    } else {
      if (10 <= betMul && betMul < 20) {
        level = 1;
      } else if (20 <= betMul && betMul < 60) {
        level = 2;
      } else if (60 <= betMul && betMul < 200) {
        level = 3;
      } else if (200 <= betMul && betMul < 500) {
        level = 4;
      } else if (500 <= betMul) {
        level = 5;
      }
    }
    return level;
  },
  playNotRollAnim: function playNotRollAnim(logicReelArr, erase) {
    var _this5 = this;
    return new Promise(function (resolve, reject) {
      var eraseRead = erase.read; // 此对象只读不消
      if (eraseRead) {
        _this5.playMultiAnim(logicReelArr, erase).then(function () {
          resolve();
        });
      } else {
        _this5.playDestroyAnim(logicReelArr, erase).then(function () {
          resolve();
        });
      }
      ;
    });
  },
  playMultiAnim: function playMultiAnim(logicReelArr, erase) {
    var _this6 = this;
    return new Promise(function (resolve, reject) {
      var eraseElf = erase.elf; // 消除元素                     
      var eraseNum = erase.num; // 元素个数
      var eraseMul = erase.mul; // 倍数
      var eraseAddFree = erase.addFree; // 增加免费次数
      var eraseCurrentXMul = erase.currentXMul; // 总X倍数(此Action后的X倍数)
      var eraseSpinWinMul = erase.spinWinMul; // 当轮SPIN总赢倍数

      var multiCellCtrl = null;
      for (var k = 0, len1 = logicReelArr.length; k < len1; k++) {
        var logicCellArr = logicReelArr[k];
        if (multiCellCtrl) {
          break;
        }
        ;
        for (var j = 0; j < 5; j++) {
          var logicCell = logicCellArr[j];
          var cellData = logicCell.cellData;
          var cellElf = cellData.elf;
          var cellX = cellData.x; // 附加属性:X倍数
          var cellNode = logicCell.cellNode;
          var cellStatus = logicCell.cellStatus;
          if (cellElf == eraseElf && cellStatus == 0 && cellX == eraseMul) {
            logicCell.cellStatus = 1;
            if (cellNode) {
              multiCellCtrl = cellNode.getComponent("zeusCellCtrl");
            }
            ;
            break;
          }
          ;
        }
        ;
      }
      ;
      if (!multiCellCtrl) {
        _this6.sendOnceEraseFinishedNotify(erase);
        resolve();
        return;
      }
      ;
      new Promise(function (resolve1, reject1) {
        var freeAllMult = GlobalCfg.ACT_SCENE_CTRL.leftAreaCtrl.getFreeAllMult();
        var curSpinHaveXMul = GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.getCurSpinHaveXMul();
        if (freeAllMult > 0 && curSpinHaveXMul == false && erase.isNormal == false) {
          _this6.playFreeAllMultFlyAnim(function () {
            resolve1();
          });
        } else {
          resolve1();
        }
        ;
      }).then(function () {
        var multiPromiseArr = [];
        multiPromiseArr.push(multiCellCtrl.playMulAnims());
        var labMultiNode = multiCellCtrl.getLabMultiNode();
        return _this6.playMultiFlyAnim(labMultiNode, 0.5, erase);
      }).then(function () {
        resolve();
      });
    });
  },
  playFreeAllMultFlyAnim: function playFreeAllMultFlyAnim(callFun) {
    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playAllMultWordFlyEffect();
    var multLabNode = GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.getMultLabNode();
    var freeAllMultLabNode = GlobalCfg.ACT_SCENE_CTRL.leftAreaCtrl.getFreeAllMultLabNode();
    var worldPos1 = freeAllMultLabNode.parent.convertToWorldSpaceAR(new cc.Vec2(freeAllMultLabNode.x, freeAllMultLabNode.y));
    var worldPos2 = multLabNode.parent.convertToWorldSpaceAR(new cc.Vec2(multLabNode.x, multLabNode.y));
    var localPos1 = this.node.convertToNodeSpaceAR(worldPos1);
    var localPos2 = this.node.convertToNodeSpaceAR(worldPos2);
    var freeAllMultLabNodeCopy = cc.instantiate(freeAllMultLabNode);
    freeAllMultLabNodeCopy.setPosition(localPos1);
    this.node.addChild(freeAllMultLabNodeCopy);
    cc.tween(freeAllMultLabNodeCopy).parallel(cc.tween().to(0.45, {
      scale: 2
    }), cc.tween().to(0.45, {
      position: cc.v2((localPos1.x + localPos2.x) / 2, (localPos1.y + localPos2.y + 25) / 2)
    })).parallel(cc.tween().to(0.45, {
      scale: 0.75
    }), cc.tween().to(0.45, {
      position: cc.v2(localPos2.x, localPos2.y + 25)
    })).call(function () {
      var currentXMul = freeAllMultLabNodeCopy.getComponent(cc.Label).string;
      GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.showFinishedAllMultFlyState(currentXMul);
      freeAllMultLabNodeCopy.destroy();
      callFun && callFun();
    }).start();
  },
  playMultiFlyAnim: function playMultiFlyAnim(labMultiNode, delayTime, erase) {
    var _this7 = this;
    return new Promise(function (resolve, reject) {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFlyMultScoreEffect();
      var copylabMultiNode = cc.instantiate(labMultiNode);
      copylabMultiNode.removeFromParent(false);
      var worldPosition = labMultiNode.parent.convertToWorldSpaceAR(cc.Vec2.ZERO);
      copylabMultiNode.setParent(_this7.node);
      var newPos = _this7.node.convertToNodeSpaceAR(worldPosition);
      copylabMultiNode.setPosition(newPos);
      labMultiNode.getComponent(cc.Label).string = "";
      var endPosition = copylabMultiNode.parent.convertToNodeSpaceAR(_this7.node_multi.parent.convertToWorldSpaceAR(_this7.node_multi.position));
      var distanceSquared = Math.pow(endPosition.x - newPos.x, 2) + Math.pow(endPosition.y - newPos.y, 2);
      var distance = Math.sqrt(distanceSquared);
      var time = distance / 600;
      cc.tween(copylabMultiNode).delay(delayTime).parallel(cc.tween().to(time / 2, {
        scale: 1.5
      }), cc.tween().to(time / 2, {
        position: cc.v2((newPos.x + endPosition.x) / 2, (newPos.y + endPosition.y) / 2)
      })).parallel(cc.tween().to(time / 2, {
        scale: 0.75
      }), cc.tween().to(time / 2, {
        position: endPosition
      })).call(function () {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playHeadMultAddEffect();
        copylabMultiNode.destroy();
        _this7.sendOnceEraseFinishedNotify(erase);
        if (erase.isLastOne) {
          _this7.scheduleOnce(function () {
            resolve();
          }, 1);
        } else {
          resolve();
        }
        ;
      }).start();
    });
  },
  playDestroyAnim: function playDestroyAnim(logicReelArr, erase) {
    var _this8 = this;
    return new Promise(function (resolve, reject) {
      var eraseElf = erase.elf; // 消除元素  
      var eraseNum = erase.num; // 元素个数
      var eraseMul = erase.mul; // 倍数
      var eraseAddFree = erase.addFree; // 增加免费次数
      var eraseCurrentXMul = erase.currentXMul; // 总X倍数(此Action后的X倍数)
      var eraseSpinWinMul = erase.spinWinMul; // 当轮SPIN总赢倍数
      var bet = erase.bet;
      var optNum = 0;
      var cellCtrlArr = [];
      var nearCenterObj = {
        distance: 100000000000000,
        pos: cc.v2(0, 0)
      };
      for (var k = 0, len1 = logicReelArr.length; k < len1; k++) {
        var logicCellArr = logicReelArr[k];
        for (var j = 0; j < 5; j++) {
          var logicCell = logicCellArr[j];
          var cellData = logicCell.cellData;
          var cellElf = cellData.elf;
          var cellNode = logicCell.cellNode;
          var cellStatus = logicCell.cellStatus;
          if (cellElf == eraseElf && cellStatus == 0) {
            optNum += 1;
            logicCell.cellStatus = 2;
            logicCell.cellNode = null;
            var cellCtrl = cellNode.getComponent("zeusCellCtrl");
            cellCtrlArr.push(cellCtrl);

            /**
             * 获取飞文字的信息
             */
            var cellNodeWorldPos = cellNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var pos = _this8.node_words.convertToNodeSpaceAR(cellNodeWorldPos);
            var distance = Math.abs(pos.x / 150) + Math.abs(pos.y / 100);
            if (distance < nearCenterObj.distance) {
              nearCenterObj.distance = distance;
              nearCenterObj.pos = pos;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      if (optNum != eraseNum) {
        reject();
        return;
      }
      ;
      new Promise(function (resolve1, reject1) {
        if (eraseElf == 1) {
          GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterTriggerEffect();
        } else {
          if (erase.isNormal) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playNormalXuLiEffect();
          } else {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeXuLiEffect();
          }
        }
        ;
        var destroyPromiseArr = [];
        for (var i = 0, len = cellCtrlArr.length; i < len; i++) {
          var _cellCtrl = cellCtrlArr[i];
          var destroyPromise = _cellCtrl.playAccumulatePowerAnims();
          destroyPromiseArr.push(destroyPromise);
        }
        ;
        destroyPromiseArr.push(_this8.flyWordScoreAnim(_this8.lab_flyScore.node, bet * eraseMul / 2000, nearCenterObj.pos, erase));
        _this8.sendOnceEraseFinishedNotify(erase);
        Promise.all(destroyPromiseArr).then(function () {
          _this8.scheduleOnce(function () {
            resolve1();
          }, eraseElf == 1 ? 0.3 : 0);
        });
      }).then(function () {
        return new Promise(function (resolve1, reject1) {
          if (eraseElf == 1) {
            resolve1();
          } else {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBoomEffect();
            var boomPromiseArr = [];
            for (var i = 0, len = cellCtrlArr.length; i < len; i++) {
              var _cellCtrl2 = cellCtrlArr[i];
              var boomPromise = _cellCtrl2.playBoomAnim();
              boomPromiseArr.push(boomPromise);
            }
            ;
            Promise.all(boomPromiseArr).then(function () {
              for (var _i4 = 0, _len2 = cellCtrlArr.length; _i4 < _len2; _i4++) {
                var _cellCtrl3 = cellCtrlArr[_i4];
                _this8.putCellNodePool(_cellCtrl3.node);
              }
              ;
              resolve1();
            });
          }
          ;
        });
      }).then(function () {
        resolve();
      });
    });
  },
  flyWordScoreAnim: function flyWordScoreAnim(labNode, score, startPos, erase) {
    var _this9 = this;
    return new Promise(function (resolve, reject) {
      if (score == 0) {
        resolve();
        return;
      }
      ;
      var copylabNode = cc.instantiate(labNode);
      copylabNode.removeFromParent(false);
      copylabNode.setParent(_this9.node_words);
      copylabNode.setPosition(startPos);
      copylabNode.getComponent(cc.Label).string = "+" + score;
      copylabNode.active = true;
      cc.tween(copylabNode).delay(0.2).parallel(cc.tween().to(0.5, {
        scale: 1.2
      }), cc.tween().to(0.5, {
        position: cc.v2(startPos.x, startPos.y + 140)
      })).delay(0.1).call(function () {
        copylabNode.destroy();
        resolve();
      }).start();
    });
  },
  sendOnceEraseFinishedNotify: function sendOnceEraseFinishedNotify(erase) {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED,
      msgData: {
        erase: erase
      }
    });
  },
  playFollAnim: function playFollAnim(logicReelArr, erase) {
    var _this10 = this;
    return new Promise(function (resolve, reject) {
      for (var k = 0, len1 = logicReelArr.length; k < len1; k++) {
        var logicCellArr = logicReelArr[k];
        logicReelArr[k] = logicCellArr.filter(function (logicCell) {
          return logicCell.cellStatus != 2;
        });
      }
      ;
      var scatterNotFreeNum = 0;
      var allPromiseArr = [];
      var isPlayRole = false;
      for (var i = 0, len = logicReelArr.length; i < len; i++) {
        var _logicCellArr = logicReelArr[i];
        var _loop4 = function _loop4() {
          var logicCell = _logicCellArr[_k];
          var cellNode = logicCell.cellNode;
          var cellData = logicCell.cellData;
          if (_k < 5) {
            if (!cellNode) {
              cellNode = _this10.getCellNode();
              cellNode.setPosition(cc.v2(0, _this10.cellInitialStartY + _k * _this10.oneStepDistance));
              logicCell.cellNode = cellNode;
              _this10["node_reel" + i].addChild(cellNode);
              var cellCtrl = cellNode.getComponent("zeusCellCtrl");
              cellCtrl.setItemData(cellData);
              if (cellData.elf == 1) {
                scatterNotFreeNum += 1;
              }
              ;
              if (cellData.elf == 12) {
                if (isPlayRole == false) {
                  isPlayRole = true;
                  GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playRoleLightNingEffect();
                  GlobalCfg.ACT_SCENE_CTRL.rightAreaCtrl.playRoleDongZuoAnim();
                }
                ;
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playMultEleShowEffect();
                _this10.scheduleOnce(function () {
                  _this10.playMultiLightNingAnim(cellNode, endPosition, cellData);
                }, 0.15 * (i + 1) + 0.03 * (_k + 1));
              }
              ;
            }
            ;
            var cellNodePosStartY = cellNode.getPosition().y;
            var cellNodePosEndY = _this10.cellBottomLimitY + _k * _this10.oneStepDistance;
            var steps = Math.abs((cellNodePosEndY - cellNodePosStartY) / _this10.oneStepDistance);
            var time = 0.1 * steps;
            var delayTime = 0.03 * _k;
            var endPosition = cc.v2(0, cellNodePosEndY);
            var cellFalling = _this10.cellFallingPromise(cellNode, time, delayTime, endPosition);
            allPromiseArr.push(cellFalling);
          } else {
            return "break";
          }
          ;
        };
        for (var _k = 0, len2 = _logicCellArr.length; _k < len2; _k++) {
          var _ret2 = _loop4();
          if (_ret2 === "break") break;
        }
        ;
      }
      ;
      new Promise(function (resolve1, reject) {
        for (var _i5 = 0; _i5 < scatterNotFreeNum; _i5++) {
          _this10.scheduleOnce(function () {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterEleAppearEffect();
          }, 0.15 * (_i5 + 1));
        }
        ;
        Promise.all(allPromiseArr).then(function () {
          resolve1();
        });
      }).then(function () {
        resolve();
      });
    });
  },
  addLogicReelArrToSpin: function addLogicReelArrToSpin(spin) {
    var startScroll = spin.startScroll;
    var logicReelArr = [];
    for (var i = 0, len = startScroll.length; i < len; i++) {
      var cellDataArr = startScroll[i].cell;
      var logicCellArr = [];
      for (var k = 0, len2 = cellDataArr.length; k < len2; k++) {
        var cellData = cellDataArr[k];
        var logicCell = {
          cellNode: null,
          cellData: cellData,
          cellStatus: 0 // 0: 初始值， 1: 表现已播放完，但不删除，2: 表现已播放完，但删除
        };

        logicCellArr.push(logicCell);
      }
      ;
      logicReelArr.push(logicCellArr);
    }
    ;
    spin.logicReelArr = logicReelArr;
    return spin;
  }
});

cc._RF.pop();