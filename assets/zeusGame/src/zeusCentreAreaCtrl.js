cc.Class({
    extends: cc.Component,

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
        skeleton_multiLightNing: sp.Skeleton,
    },

    ctor: function() {
        this.firstEliminationInterval = 0.5;
        this.eliminationShowInterval = 2;
        this.fallingShowInterval = 0.5;

        this.allSpinArr = [];

        this.cellBottomLimitY = -450;
        this.cellInitialStartY = 50;
        this.oneStepDistance = 100;
    },

    onLoad: function() {
        this.initCellNodePool();
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    initCellNodePool: function() {
        this.cellNodePool = new cc.NodePool();
        for (let i = 0; i < 35; i++) {
            let cellNode = cc.instantiate(this.node_cell);
            this.cellNodePool.put(cellNode); 
        };
    },

    getCellNode: function() {
        let cellNode = null;
        if (this.cellNodePool.size() > 0) { 
            cellNode = this.cellNodePool.get();
        } 
        else {
            cellNode = cc.instantiate(this.node_cell);
        };
        return cellNode;
    },

    putCellNodePool: function(cellNode) {
        if (cellNode) {
            let ctrl = cellNode.getComponent('zeusCellCtrl');
            ctrl.reSetting();
            this.cellNodePool.put(cellNode);
        };
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
    },

    removeAllCellNodes: function() {
        return new Promise((resolve, reject) => {
            let promiseArr = [];
            for (let i = 0; i < 6; i++) {
                let reelNode = this[`node_reel${i}`];
                let promise = new Promise((resolve1, reject1) => {
                    cc.tween(reelNode)
                    .delay(0.1 * i)
                    .to(0.2, {position: cc.v2(reelNode.x, -250)})
                    .call(() => {
                        let cellNodeArr = [];
                        reelNode.children.forEach(cellNode => {
                            cellNodeArr.push(cellNode);
                        });
                        cellNodeArr.forEach(cellNode => {
                            this.putCellNodePool(cellNode);
                        });

                        reelNode.setPosition(cc.v2(reelNode.x, 250));
                        resolve1();
                    })
                    .start()
                });
                promiseArr.push(promise);
            };

            Promise.all(promiseArr).then(() => {
                resolve();
            });
        });
    },

    removeSpinData: function() {
        this.allSpinArr = [];
        this.normalAfter = 0;
        this.finalAfter = 0;
        this.isHaveFreeSpin = false;
    },

    initShowCellNodes: function(scroll) {
        for (let i = 0, len = scroll.length; i < len; i++) {
            let axis = scroll[i];
            let cellArr = axis.cell;
            for (let k = 0, len2 = cellArr.length; k < len2; k++) {
                let cellData = cellArr[k];
                let cellNode = this.getCellNode();
                cellNode.setPosition(cc.v2(0, -450 + k * 100));
                this[`node_reel${i}`].addChild(cellNode);
                let cellCtrl = cellNode.getComponent("zeusCellCtrl");
                cellCtrl.setItemData(cellData);
            };
        };
    },

    dealSpinResultProcess: function(notify) {
        let spin = notify.spin;
        let freeSpin = notify.freeSpin;
        let normalAfter = notify.normalAfter;
        let finalAfter = notify.finalAfter;
        let bet = notify.bet;
        this.isHaveFreeSpin = false;

        this.normalAfter = normalAfter;
        this.finalAfter = finalAfter;


        let normalAllWinMul = 0;            // 常规SPIN赢的总倍数
        if (spin) {
            spin.bet = bet;
            spin.isNormal = true;
  
            let curSpinWinMul = 0;
            if (spin.erase && spin.erase.length > 0) {
                for (let i = 0, len = spin.erase.length; i < len; i++) {
                    let tempErase = spin.erase[i];
                    tempErase.isNormal = true;
                    tempErase.bet = bet;
                    tempErase.isLastOne = i == len - 1;

                    let spinWinMul = tempErase.spinWinMul;

                    if (spinWinMul > curSpinWinMul) {
                        curSpinWinMul = spinWinMul;
                    };

                    tempErase.progressAllMul = curSpinWinMul;        // 截至到当前，累计赢的总倍数(ERASE)
                    
                };
            };     
            spin.progressAllMul = curSpinWinMul;                     // 截至到当前，累计赢的总倍数(SPIN)
            spin.spinWinMul = curSpinWinMul;                         // 当前SPIN赢的总倍数   

            normalAllWinMul = curSpinWinMul;

            this.allSpinArr.push(spin);
        };
        if (freeSpin && freeSpin.length > 0) {
            let grandTotalWinMul = normalAllWinMul;
            for (let i = 0, len = freeSpin.length; i < len; i++) {
                let spin = freeSpin[i];
                spin.bet = bet;
                spin.isNormal = false;

                let curSpinWinMul = 0;
                if (spin.erase && spin.erase.length > 0) {
                    for (let i = 0, len1 = spin.erase.length; i < len1; i++) {
                        let tempErase = spin.erase[i];
                        tempErase.isNormal = false;
                        tempErase.bet = bet;
                        tempErase.isLastOne = i == len1 - 1;

                        let spinWinMul = tempErase.spinWinMul;

                        if (spinWinMul > curSpinWinMul) {
                            curSpinWinMul = spinWinMul;
                        };

                        tempErase.progressAllMul = curSpinWinMul + grandTotalWinMul;        // 截至到当前，累计赢的总倍数(ERASE)
                    };
                };
                spin.progressAllMul = curSpinWinMul + grandTotalWinMul;                     // 截至到当前，累计赢的总倍数(SPIN)
                spin.spinWinMul = curSpinWinMul;                                            // 当前SPIN赢的总倍数

                grandTotalWinMul += curSpinWinMul;
            };
            this.allSpinArr = this.allSpinArr.concat(freeSpin);
            this.isHaveFreeSpin = true;
        };

        this.dealSingleSpinProcess();
    },


    dealSingleSpinProcess: function() {
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
        };

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING, 
            msgData: {
                addFree: -1,
            }
        });


        this.removeAllCellNodes()
        .then(() => {
            let spin = this.allSpinArr.shift();
            spin = this.addLogicReelArrToSpin(spin);

            let addInitialCellPromise = this.addInitialCellNodes(spin);
            addInitialCellPromise.then(() => {
                this.dealOnceEraseProcess(spin);
            });
        });
    },

    addInitialCellNodes: function(spin) {
        return new Promise((resolve, reject) => {
            let scatterNotFreeNum = 0;
            let allPromiseArr = [];
            let logicReelArr = spin.logicReelArr;
            let isPlayRole = false;
            for (let i = 0, len = logicReelArr.length; i < len; i++) {
                let logicCellArr = logicReelArr[i];
                for (let k = 0, len2 = logicCellArr.length; k < len2; k++) {
                    let logicCell = logicCellArr[k];
                    let cellData = logicCell.cellData;
                    if (k < 5) {
                        let cellNode = this.getCellNode();
                        cellNode.setPosition(cc.v2(0, this.cellInitialStartY + k * this.oneStepDistance));
                        this[`node_reel${i}`].addChild(cellNode);
                        let cellCtrl = cellNode.getComponent("zeusCellCtrl");
                        cellCtrl.setItemData(cellData);
                        logicCell.cellNode = cellNode;

                        if (cellData.elf == 1) {
                            scatterNotFreeNum += 1;
                        };

                        let time = 0.08 * 5;
                        let delayTime = 0.1 * i;
                        let endPosition = cc.v2(0, this.cellBottomLimitY + k * this.oneStepDistance);
                        let tempPromise = new Promise((resolve1, reject1) => {
                            if (cellData.elf == 12) {
                                if (isPlayRole == false) {
                                    isPlayRole = true;
                                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playRoleLightNingEffect();
                                    GlobalCfg.ACT_SCENE_CTRL.rightAreaCtrl.playRoleDongZuoAnim();
                                };
                                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playMultEleShowEffect();
                                this.scheduleOnce(() => {
                                    this.playMultiLightNingAnim(cellNode, endPosition, cellData);
                                }, 0.15 * (i + 1) + 0.03 * (k + 1));
                            };
                            let cellFalling = this.cellFallingPromise(cellNode, time, delayTime, endPosition, true);
                            cellFalling.then(() => {
                                resolve1();
                            });
                        });
                        allPromiseArr.push(tempPromise);
                    }
                    else {
                        break;
                    }
                };
            };

            new Promise((resolve1, reject) => {
                for (let i = 0; i < scatterNotFreeNum; i++) {
                    this.scheduleOnce(() => {
                        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterEleAppearEffect();
                    }, 0.15 * (i + 1));
                };

                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playReachBottomEffect();
                Promise.all(allPromiseArr)
                .then(() => {
                    resolve1();
                });
            })
            .then(() => {
                resolve();
            });
        });
    },

    playMultiLightNingAnim: function(cellNode, endPosition, cellData) {
        let worldPos1 = cellNode.parent.convertToWorldSpaceAR(endPosition);
        let localPos1 = this.node_multiLightNing.convertToNodeSpaceAR(worldPos1);
        let lightNingNode = cc.instantiate(this.skeleton_multiLightNing.node);
        let skeleton = lightNingNode.getComponent(sp.Skeleton);

        let x = cellData.x;
        let animationName = "";
        if (x <= 8) {
            animationName = 'green';
        }
        else if (x <= 20) {
            animationName = 'blue';
        }
        else if (x <= 100) {
            animationName = 'red';
        }
        else {
            animationName = 'purple';
        };
        lightNingNode.active = true;
        lightNingNode.setPosition(cc.v2(localPos1.x, localPos1.y + 120));
        this.node_multiLightNing.addChild(lightNingNode);
        skeleton.defaultSkin = 'default';
        skeleton.setAnimation(0, animationName, false);
        skeleton.setCompleteListener((trackEntry, loopCount) => {
            lightNingNode.destroy();
        });
    },

    cellFallingPromise: function(cellNode, time, delayTime, endPosition, isInit = false) {
        return new Promise((resolve, reject) => {
            cc.tween(cellNode)
            .delay(delayTime)
            .to(time, {position: endPosition},  {easing: isInit ? 'backOut' : (time1) => {
                if (time1 <= 0.6) {
                    return time1 * time1 + (16/15) * time1;
                }
                else if (time1 <= 0.8) {
                    return time1 * time1 - 1.8 * time1 + 1.72;
                }
                else {
                    return time1 * time1 - 1.4 * time1 + 1.4;
                }
            }})
            .call(() => {
                resolve();
            })
            .start()
        });
    },
 
    dealOnceEraseProcess: function(spin) {
        if (spin.erase.length == 0) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.setBoomIndexDefault();
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.setFreeXuLiIndexDefault();
            if (this.allSpinArr.length > 0 && spin.isNormal == true) {   // 常规SPIN执行完成，开始免费SPIN，先展示15次免费SPIN的提示框
                CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
                    bundle.load("prefabs/zeusChangeStateTips", cc.Prefab, (err, prefab) => {
                        if (!err) {
                            let scene = cc.director.getScene();
                            let zeusChangeStateTipsNode = cc.instantiate(prefab);
                            let zeusChangeStateTipsCtrl = zeusChangeStateTipsNode.getComponent("zeusChangeStateTipsCtrl");
                            scene.addChild(zeusChangeStateTipsNode);
                            zeusChangeStateTipsCtrl.setChangeStateData(true, 15)
                            .then(() => {
                                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                    msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_ENTER_FREE_STATUS, 
                                    msgData: {}
                                });
        
                                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                    msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED, 
                                    msgData: {
                                        spin: spin,
                                    }
                                });
        
                                this.dealSingleSpinProcess();
                            });
                        };
                    });
                }, (err) => {
                    LoggerUtil.getInstance().error(`加载zeusGame-Bundle异常: ${JSON.stringify(err)}`);
                });
            }
            else if (this.allSpinArr.length == 0 && spin.isNormal == false) {
                CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
                    bundle.load("prefabs/zeusChangeStateTips", cc.Prefab, (err, prefab) => {
                        if (!err) {
                            let scene = cc.director.getScene();
                            let zeusChangeStateTipsNode = cc.instantiate(prefab);
                            let zeusChangeStateTipsCtrl = zeusChangeStateTipsNode.getComponent("zeusChangeStateTipsCtrl");
                            scene.addChild(zeusChangeStateTipsNode);
                            let allWin = spin.progressAllMul * spin.bet / 2000;
                            zeusChangeStateTipsCtrl.setChangeStateData(false, allWin)
                            .then(() => {
                                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                    msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED, 
                                    msgData: {
                                        spin: spin,
                                    }
                                });
        
                                this.dealSingleSpinProcess();
                            });
                        };
                    });
                }, (err) => {
                    LoggerUtil.getInstance().error(`加载zeusGame-Bundle异常: ${JSON.stringify(err)}`);
                });
            }
            else {                          // 判断是否展示当前SPIN中奖的结果
                let curSpinAllWin = (spin.bet * spin.spinWinMul) / 2000;
                let bigWinLevel = this.getBigWinLevel(spin.isNormal, spin.bet/100, curSpinAllWin * 100 / spin.bet);
                if (bigWinLevel > 0) {
                    CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
                        bundle.load("prefabs/zeusRewardTips", cc.Prefab, (err, prefab) => {
                            if (!err) {
                                let scene = cc.director.getScene();
                                let zeusRewardTipsNode = cc.instantiate(prefab);
                                let zeusRewardTipsCtrl = zeusRewardTipsNode.getComponent("zeusRewardTipsCtrl");
                                scene.addChild(zeusRewardTipsNode);
                                zeusRewardTipsCtrl.showRewardTips(curSpinAllWin, bigWinLevel, spin.isNormal)
                                .then(() => {
                                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                                        msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED, 
                                        msgData: {
                                            spin: spin,
                                        }
                                    });
                                    
                                    this.dealSingleSpinProcess(); 
                                });
                            };
                        });
                    }, (err) => {
                        LoggerUtil.getInstance().error(`加载zeusGame-Bundle异常: ${JSON.stringify(err)}`);
                    });
                }
                else {
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED, 
                        msgData: {
                            spin: spin,
                        }
                    });
                    
                    this.dealSingleSpinProcess(); 
                };
            }
            return;
        };

        let firstErase = spin.erase.shift();
        firstErase.isNormal = spin.isNormal;
        if (firstErase.roll) {
            let fallingPromise = this.playFollAnim(spin.logicReelArr, firstErase);
            fallingPromise.then(() => {
                this.scheduleOnce(() => {
                    this.dealOnceEraseProcess(spin);
                }, spin.erase.length == 0 ? 0.5 : 0);
            });
        }
        else if (firstErase.elf == 12) {
            let eliminationPromise = this.playNotRollAnim(spin.logicReelArr, firstErase);
            eliminationPromise.then(() => {
                this.scheduleOnce(() => {
                    this.dealOnceEraseProcess(spin);
                }, spin.erase.length == 0 ? 0.5 : 0);
            });
        }
        else {
            let oneTimeEraseArr = [];
            let eliminationPromise = this.playNotRollAnim(spin.logicReelArr, firstErase);
            oneTimeEraseArr.push(eliminationPromise);
    
            for (let i = 0, len = spin.erase.length; i < len; i++) {
                let eraseTemp = spin.erase[i];
                eraseTemp.isNormal = spin.isNormal;
                if (eraseTemp.roll == false) {
                    eliminationPromise = this.playNotRollAnim(spin.logicReelArr, eraseTemp);
                    oneTimeEraseArr.push(eliminationPromise);
                }
                else {
                    break;
                };
            };  
            spin.erase.splice(0, oneTimeEraseArr.length - 1);
    
            Promise.all(oneTimeEraseArr)
            .then(() => {
                this.dealOnceEraseProcess(spin);
            });
        };
    },

    getBigWinLevel: function(isNormal, bet, betMul) {
        let level = 0;
        if (isNormal == true) {
            if (bet <= 10) {
                if (5 <= betMul && betMul < 10) {
                    level = 1;
                }
                else if (10 <= betMul && betMul < 50) {
                    level = 2;
                }
                else if (50 <= betMul && betMul < 150) {
                    level = 3;
                }
                else if (150 <= betMul && betMul < 500) {
                    level = 4;
                }
                else if (500 <= betMul) {
                    level = 5;
                }
            }
            else if (10 < bet && bet <= 100) {
                if (4 <= betMul && betMul < 8) {
                    level = 1;
                }
                else if (8 <= betMul && betMul < 40) {
                    level = 2;
                }
                else if (40 <= betMul && betMul < 120) {
                    level = 3;
                }
                else if (120 <= betMul && betMul < 400) {
                    level = 4;
                }
                else if (400 <= betMul) {
                    level = 5;
                }
            }
            else if (100 < bet && bet <= 300) {
                if (3 <= betMul && betMul < 6) {
                    level = 1;
                }
                else if (6 <= betMul && betMul < 30) {
                    level = 2;
                }
                else if (30 <= betMul && betMul < 80) {
                    level = 3;
                }
                else if (80 <= betMul && betMul < 300) {
                    level = 4;
                }
                else if (300 <= betMul) {
                    level = 5;
                }
            }
            else if (300 < bet) {
                if (3 <= betMul && betMul < 5) {
                    level = 1;
                }
                else if (5 <= betMul && betMul < 20) {
                    level = 2;
                }
                else if (20 <= betMul && betMul < 60) {
                    level = 3;
                }
                else if (60 <= betMul && betMul < 200) {
                    level = 4;
                }
                else if (200 <= betMul) {
                    level = 5;
                }
            }
        }
        else {
            if (10 <= betMul && betMul < 20) {
                level = 1;
            }
            else if (20 <= betMul && betMul < 60) {
                level = 2;
            }
            else if (60 <= betMul && betMul < 200) {
                level = 3;
            }
            else if (200 <= betMul && betMul < 500) {
                level = 4;
            }
            else if (500 <= betMul) {
                level = 5;
            }
        }

        return level;
    },

    playNotRollAnim: function(logicReelArr, erase) {
        return new Promise((resolve, reject) => {
            let eraseRead = erase.read;                      // 此对象只读不消
            if (eraseRead) {
                this.playMultiAnim(logicReelArr, erase)
                .then(() => {
                    resolve(); 
                });
            }   
            else {
                this.playDestroyAnim(logicReelArr, erase)
                .then(() => {
                    resolve(); 
                });
            };
        })
    },

    playMultiAnim: function(logicReelArr, erase) {
        return new Promise((resolve, reject) => {
            let eraseElf = erase.elf;                        // 消除元素                     
            let eraseNum = erase.num;                        // 元素个数
            let eraseMul = erase.mul;                        // 倍数
            let eraseAddFree = erase.addFree;                // 增加免费次数
            let eraseCurrentXMul = erase.currentXMul;        // 总X倍数(此Action后的X倍数)
            let eraseSpinWinMul = erase.spinWinMul;          // 当轮SPIN总赢倍数
    
            let multiCellCtrl = null;
            for (let k = 0, len1 = logicReelArr.length; k < len1; k++) {
                let logicCellArr = logicReelArr[k];
                if (multiCellCtrl) {
                    break;
                };
                for (let j = 0; j < 5; j++) {
                    let logicCell = logicCellArr[j];
                    let cellData = logicCell.cellData;
                    let cellElf = cellData.elf;
                    let cellX = cellData.x;                 // 附加属性:X倍数
                    let cellNode = logicCell.cellNode;
                    let cellStatus = logicCell.cellStatus;
                    if (cellElf == eraseElf && cellStatus == 0 && cellX == eraseMul) {
                        logicCell.cellStatus = 1;
                        if (cellNode) {
                            multiCellCtrl = cellNode.getComponent("zeusCellCtrl");
                        };
                        break;
                    };
                };
            };

            if (!multiCellCtrl) {
                this.sendOnceEraseFinishedNotify(erase);
                resolve();
                return;
            };

            new Promise((resolve1, reject1) => {
                let freeAllMult = GlobalCfg.ACT_SCENE_CTRL.leftAreaCtrl.getFreeAllMult();
                let curSpinHaveXMul = GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.getCurSpinHaveXMul();
                if (freeAllMult > 0 && curSpinHaveXMul == false && erase.isNormal == false) {
                    this.playFreeAllMultFlyAnim(() => {
                        resolve1();
                    });
                }
                else {
                    resolve1();
                };
            })
            .then(() => {
                let multiPromiseArr = [];
                multiPromiseArr.push(multiCellCtrl.playMulAnims());
                let labMultiNode = multiCellCtrl.getLabMultiNode();
                return this.playMultiFlyAnim(labMultiNode, 0.5, erase);
            })
            .then(() => {
                resolve();
            });
        });
    },

    playFreeAllMultFlyAnim: function(callFun) {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playAllMultWordFlyEffect();

        let multLabNode = GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.getMultLabNode();
        let freeAllMultLabNode = GlobalCfg.ACT_SCENE_CTRL.leftAreaCtrl.getFreeAllMultLabNode();
        let worldPos1 = freeAllMultLabNode.parent.convertToWorldSpaceAR(new cc.Vec2(freeAllMultLabNode.x, freeAllMultLabNode.y));
        let worldPos2 = multLabNode.parent.convertToWorldSpaceAR(new cc.Vec2(multLabNode.x, multLabNode.y));
        let localPos1 = this.node.convertToNodeSpaceAR(worldPos1);
        let localPos2 = this.node.convertToNodeSpaceAR(worldPos2);

        let freeAllMultLabNodeCopy = cc.instantiate(freeAllMultLabNode);
        freeAllMultLabNodeCopy.setPosition(localPos1);
        this.node.addChild(freeAllMultLabNodeCopy);

        cc.tween(freeAllMultLabNodeCopy)
        .parallel(
            cc.tween().to(0.45, {scale: 2}),
            cc.tween().to(0.45, {position: cc.v2((localPos1.x + localPos2.x)/2, (localPos1.y + localPos2.y + 25)/2)})
        )
        .parallel(
            cc.tween().to(0.45, {scale: 0.75}),
            cc.tween().to(0.45, {position: cc.v2(localPos2.x, localPos2.y + 25)})
        )
        .call(() => {
            let currentXMul = freeAllMultLabNodeCopy.getComponent(cc.Label).string;
            GlobalCfg.ACT_SCENE_CTRL.headAreaCtrl.showFinishedAllMultFlyState(currentXMul);
            freeAllMultLabNodeCopy.destroy();
            callFun && callFun();
        })
        .start();
    },


    playMultiFlyAnim: function(labMultiNode, delayTime, erase) {
        return new Promise((resolve, reject) => {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFlyMultScoreEffect();
            let copylabMultiNode = cc.instantiate(labMultiNode);
            copylabMultiNode.removeFromParent(false);
            let worldPosition = labMultiNode.parent.convertToWorldSpaceAR(cc.Vec2.ZERO);
            copylabMultiNode.setParent(this.node);
            let newPos = this.node.convertToNodeSpaceAR(worldPosition);
            copylabMultiNode.setPosition(newPos);
            labMultiNode.getComponent(cc.Label).string = "";
            let endPosition = copylabMultiNode.parent.convertToNodeSpaceAR(this.node_multi.parent.convertToWorldSpaceAR(this.node_multi.position));
            let distanceSquared = Math.pow(endPosition.x - newPos.x, 2) + Math.pow(endPosition.y - newPos.y, 2);
            let distance = Math.sqrt(distanceSquared);
            let time = distance / 600;

            cc.tween(copylabMultiNode)
            .delay(delayTime)
            .parallel(
                cc.tween().to(time/2, {scale: 1.5}),
                cc.tween().to(time/2, {position: cc.v2((newPos.x + endPosition.x)/2, (newPos.y + endPosition.y)/2)})
            )
            .parallel(
                cc.tween().to(time/2, {scale: 0.75}),
                cc.tween().to(time/2, {position: endPosition})
            )
            .call(() => {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playHeadMultAddEffect();
                copylabMultiNode.destroy();
                this.sendOnceEraseFinishedNotify(erase);
                if (erase.isLastOne) {
                    this.scheduleOnce(() => {
                        resolve();
                    }, 1);
                }
                else {
                    resolve();
                };
            })
            .start();
        });
    },


    playDestroyAnim: function(logicReelArr, erase) {
        return new Promise((resolve, reject) => {

            let eraseElf = erase.elf;                        // 消除元素  
            let eraseNum = erase.num;                        // 元素个数
            let eraseMul = erase.mul;                        // 倍数
            let eraseAddFree = erase.addFree;                // 增加免费次数
            let eraseCurrentXMul = erase.currentXMul;        // 总X倍数(此Action后的X倍数)
            let eraseSpinWinMul = erase.spinWinMul;          // 当轮SPIN总赢倍数
            let bet = erase.bet;

            let optNum = 0;
            let cellCtrlArr = [];
            let nearCenterObj = {
                distance: 100000000000000,
                pos: cc.v2(0, 0)
            };
            for (let k = 0, len1 = logicReelArr.length; k < len1; k++) {
                let logicCellArr = logicReelArr[k];
                for (let j = 0; j < 5; j++) {
                    let logicCell = logicCellArr[j];
                    let cellData = logicCell.cellData;
                    let cellElf = cellData.elf;
                    let cellNode = logicCell.cellNode;
                    let cellStatus = logicCell.cellStatus;
                    if (cellElf == eraseElf && cellStatus == 0) {
                        optNum += 1;
                        logicCell.cellStatus = 2;
                        logicCell.cellNode = null;
                        let cellCtrl = cellNode.getComponent("zeusCellCtrl");
                        cellCtrlArr.push(cellCtrl);
                        
                        /**
                         * 获取飞文字的信息
                         */
                        let cellNodeWorldPos = cellNode.convertToWorldSpaceAR(cc.v2(0, 0));
                        let pos = this.node_words.convertToNodeSpaceAR(cellNodeWorldPos);
                        let distance = Math.abs(pos.x/150) + Math.abs(pos.y/100);
                        if (distance < nearCenterObj.distance) {
                            nearCenterObj.distance = distance;
                            nearCenterObj.pos = pos;
                        };
                    };
                };
            };


            if (optNum != eraseNum) {
                reject();
                return;
            };


            new Promise((resolve1, reject1) => {
                if (eraseElf == 1) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterTriggerEffect();   
                }
                else {
                    if (erase.isNormal) {
                        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playNormalXuLiEffect();
                    }
                    else {
                        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeXuLiEffect();
                    }
                };
                let destroyPromiseArr = [];
                for (let i = 0, len = cellCtrlArr.length; i < len; i++) {
                    let cellCtrl = cellCtrlArr[i];
                    let destroyPromise = cellCtrl.playAccumulatePowerAnims();
                    destroyPromiseArr.push(destroyPromise);
                };
                destroyPromiseArr.push(this.flyWordScoreAnim(this.lab_flyScore.node, bet * eraseMul/2000, nearCenterObj.pos, erase));

                this.sendOnceEraseFinishedNotify(erase);

                Promise.all(destroyPromiseArr)
                .then(() => {
                    this.scheduleOnce(() => {
                        resolve1();
                    }, eraseElf == 1 ? 0.3 : 0);
                });
            })
            .then(() => {
                return new Promise((resolve1, reject1) => {
                    if (eraseElf == 1) {
                        resolve1();
                    }
                    else {
                        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBoomEffect();
                        let boomPromiseArr = [];
                        for (let i = 0, len = cellCtrlArr.length; i < len; i++) {
                            let cellCtrl = cellCtrlArr[i];
                            let boomPromise = cellCtrl.playBoomAnim();
                            boomPromiseArr.push(boomPromise);
                        };
    
                        Promise.all(boomPromiseArr)
                        .then(() => {
                            for (let i = 0, len = cellCtrlArr.length; i < len; i++) {
                                let cellCtrl = cellCtrlArr[i];
                                this.putCellNodePool(cellCtrl.node);
                            };
                            resolve1();
                        })
                    };   
                });
            })
            .then(() => {
                resolve();
            });
        });
    },

    flyWordScoreAnim: function(labNode, score, startPos, erase) {
        return new Promise((resolve, reject) => {
            if (score == 0) {
                resolve();
                return;
            };
            let copylabNode = cc.instantiate(labNode);
            copylabNode.removeFromParent(false);
            copylabNode.setParent(this.node_words);
            copylabNode.setPosition(startPos);
            copylabNode.getComponent(cc.Label).string = `+${score}`;
            copylabNode.active = true;
            cc.tween(copylabNode)
            .delay(0.2)
            .parallel(
                cc.tween().to(0.5, { scale: 1.2 }),
                cc.tween().to(0.5, { position: cc.v2(startPos.x, startPos.y + 140) })
            )
            .delay(0.1)
            .call(() => {
                copylabNode.destroy();
                resolve();
            })
            .start();
        });
    },

    sendOnceEraseFinishedNotify: function(erase) {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED, 
            msgData: {
                erase: erase,
            }
        });
    },

    playFollAnim: function(logicReelArr, erase) {
        return new Promise((resolve, reject) => {

            for (let k = 0, len1 = logicReelArr.length; k < len1; k++) {
                let logicCellArr = logicReelArr[k];
                logicReelArr[k] = logicCellArr.filter((logicCell) => {
                    return logicCell.cellStatus != 2;
                });
            };
            
            let scatterNotFreeNum = 0;
            let allPromiseArr = [];
            let isPlayRole = false;
            for (let i = 0, len = logicReelArr.length; i < len; i++) {
                let logicCellArr = logicReelArr[i];
                for (let k = 0, len2 = logicCellArr.length; k < len2; k++) {
                    let logicCell = logicCellArr[k];
                    let cellNode = logicCell.cellNode;
                    let cellData = logicCell.cellData;
                    if (k < 5) {
                        if (!cellNode) {
                            cellNode = this.getCellNode();
                            cellNode.setPosition(cc.v2(0, this.cellInitialStartY + k * this.oneStepDistance));
                            logicCell.cellNode = cellNode;
                            this[`node_reel${i}`].addChild(cellNode);
                            let cellCtrl = cellNode.getComponent("zeusCellCtrl");
                            cellCtrl.setItemData(cellData);

                            if (cellData.elf == 1) {
                                scatterNotFreeNum += 1; 
                            };

                            if (cellData.elf == 12) {
                                if (isPlayRole == false) {
                                    isPlayRole = true;
                                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playRoleLightNingEffect();
                                    GlobalCfg.ACT_SCENE_CTRL.rightAreaCtrl.playRoleDongZuoAnim();
                                };
                                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playMultEleShowEffect();
                                this.scheduleOnce(() => {
                                    this.playMultiLightNingAnim(cellNode, endPosition, cellData);
                                }, 0.15 * (i + 1) + 0.03 * (k + 1));
                            };
                        };

                        let cellNodePosStartY = cellNode.getPosition().y;
                        let cellNodePosEndY = this.cellBottomLimitY + k * this.oneStepDistance;
                        let steps = Math.abs((cellNodePosEndY - cellNodePosStartY)/this.oneStepDistance);

                        let time = 0.1 * steps;
                        let delayTime = 0.03 * k;
                        let endPosition = cc.v2(0, cellNodePosEndY);
                        let cellFalling = this.cellFallingPromise(cellNode, time, delayTime, endPosition);
                        allPromiseArr.push(cellFalling);
                    }
                    else {
                        break;
                    };
                };
            };

            new Promise((resolve1, reject) => {
                for (let i = 0; i < scatterNotFreeNum; i++) {
                    this.scheduleOnce(() => {
                        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScatterEleAppearEffect();
                    }, 0.15 * (i + 1));
                };
                Promise.all(allPromiseArr)
                .then(() => {

                    resolve1();
                });
            })
            .then(() => {
                resolve();
            });
        });
    },

    addLogicReelArrToSpin: function(spin) {
        let startScroll = spin.startScroll;
        let logicReelArr = [];
        for (let i = 0, len = startScroll.length; i < len; i++) {
            let cellDataArr = startScroll[i].cell;
            let logicCellArr = [];
            for (let k = 0, len2 = cellDataArr.length; k < len2; k++) {
                let cellData = cellDataArr[k];
                let logicCell = {
                    cellNode: null,
                    cellData: cellData, 
                    cellStatus: 0,  // 0: 初始值， 1: 表现已播放完，但不删除，2: 表现已播放完，但删除
                };
                logicCellArr.push(logicCell);
            };
            logicReelArr.push(logicCellArr);
        };
        spin.logicReelArr = logicReelArr;
        return spin;
    },
});
