
cc.Class({
    extends: cc.Component,

    properties: {
        roulettes: {
            default: [],
            type: [cc.Node],
            visible: true,
            tooltip: "从金色鲨鱼顺时针开始"
        },
    },

    ctor() {
        this.endStageItemNums = 6;              // 结束阶段随机范围 5-8个
        this.endNodeItem = null;                // 最后停止的节点
        this.slowInterval = 0.2;                // 轮盘慢速转动间隔
        this.slowShowLightInterval = 0.5;       // 轮盘慢速展示光效间隔
        this.fastInterval = 0.03;               // 轮盘慢速转动间隔
        this.fastShowLightInterval = 0.3;       // 轮盘慢速展示光效间隔
        this.endInterval = 0.5;                 // 结束阶段最慢时间
        this.endWaitTime = 1.5;                 // 最终节点展示时间
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.offAllLight();
    },

    start() {

    },

    unscheduleAll() {
        this.unschedule(this.scheduleFastCallback);
        this.unschedule(this.scheduleSlowCallback);
        this.unschedule(this.scheduleOnceCallback);
        this.unschedule(this.scheduleRollingEndCallback);
    },

    /**
     * 关闭所有节点的光效
     */
    offAllLight() {
        for (let i = 0; i < this.roulettes.length; i++) {
            const _node = this.roulettes[i];
            _node.getChildByName('fg_04').active = false;
        }
    },

    /**
     * 关闭最后停止的节点的光效
     */
    offEndNodeLight() {
        if (this.endNodeItem != null) {
            this.endNodeItem.getChildByName('fg_04').active = false;
            this.endNodeItem = null;
        }
    },

    /**
     * 停止旋转
     */
    stopRotate(){
        this.unscheduleAll();
        this.offAllLight();
    },

    /**
     * 从GoldenShark开始顺时针旋转
     * @param {zooAnimal} aniType
     * @param {number | null} remainder 剩余时间 ms
     */
    startRotate(aniType, remainder) {
        this.fastRollIndex = 0;
        LoggerUtil.getInstance().time("GAME_ZOO_ROULETTEE_END");
        this.offEndNodeLight();
        this.endStageItemNums = Math.floor(Math.random() * 4) + 5;   // 结束慢速阶段个数

        let itemArr = this.getCurNodeList(aniType, remainder);
        let length = itemArr.length;
        LoggerUtil.getInstance().log(`转盘个数：length:${length},结束慢速阶段个数:${this.endStageItemNums}`);

        // 转盘开始慢速阶段 →  转盘正常快速阶段 →  转盘结束慢速阶段

        /**
         * 转盘开始慢速阶段
         */
        let count = 0;
        this.scheduleSlowCallback = () => {
            let itemNode = itemArr[count];
            count++;
            if (count <= 6) {
                this.itemRoulettes(itemNode, "slow");
                if (count == 6) {
                    fastFunc();
                }
            }
        };

        /**
         * 转盘正常快速阶段
         */
        this.scheduleFastCallback = () => {
            let itemNode = itemArr[count];
            count++;
            this.itemRoulettes(itemNode, "fast");
            if (count == length - this.endStageItemNums) {
                LoggerUtil.getInstance().log("结束慢速阶段:", count);
                this.endRoulettes(count, itemArr);
            }
        };
        // 时间：0.03 * length = （84 + 2）2.58秒，最长 113*0.04 3.39秒
        let fastFunc = () => {
            this.schedule(this.scheduleFastCallback, this.fastInterval, length - 6 - 1 - this.endStageItemNums);
        };
        // 时间：0.2 * 6 = 1.2秒
        let slowFunc = () => {
            this.schedule(this.scheduleSlowCallback, this.slowInterval, 6 - 1);
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
                let arr = this.getEndNodeItemList(aniType);
                this.endNodeItem = arr[arr.length - 1];
                this.itemRoulettes(this.endNodeItem, "slow", true);
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: "GAME_ZOO_ROULETTEE_END",
                    msgData: { endNode: this.endNodeItem }
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
    async endRoulettes(index, itemArr) {
        let interval = ((this.endInterval - this.fastInterval) / this.endStageItemNums).toFixed(3);
        let time = this.fastInterval + Number(interval);
        let count = 0;
        while (index < itemArr.length) {
            time = this.fastInterval + Number(interval) * count;
            let temp = await this.endStage(index, itemArr, time).catch((err) => {
                LoggerUtil.getInstance().error(err);
                this.unschdeule(this.scheduleOnceCallback);
                return;
            });
            count++;
            index++;
            if (index == itemArr.length) {
                this.scheduleRollingEndCallback = () => {
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: "GAME_ZOO_ROULETTEE_END",
                        msgData: { endNode: itemArr[itemArr.length - 1] }
                    });
                };
                this.scheduleOnce(this.scheduleRollingEndCallback, this.endWaitTime);

            }
        }
    },

    async endStage(index, itemArr, delayTime) {
        return new Promise((resolve, reject) => {
            this.scheduleOnceCallback = () => {
                let itemNode = itemArr[index];
                if (index !== itemArr.length - 1) {
                    this.itemRoulettes(itemNode, "slow");
                } else {
                    this.endNodeItem = itemNode;
                    this.itemRoulettes(itemNode, "slow", true);
                }
                resolve(true);
            };
            this.scheduleOnce(this.scheduleOnceCallback, delayTime);
        });
    },

    /**
     * 返回转动的节点数组
     * @param {zooAnimal} type 
     * @param {*} remainder 当前状态剩余时间 ms
     * @returns 
     */
    getCurNodeList(type, remainder) {
        let arr = [];
        if (remainder) {
            let moreTime = remainder - 6000;            // 剩余时间 - （结束慢速阶段时间 + 回收金币时间）
            if (moreTime > 0) {
                let amount = Math.floor(moreTime / (this.fastInterval * 1000));
                let quotient = Math.floor(amount / this.roulettes.length);         // 商数
                let remainderNumber = amount % this.roulettes.length;           // 余数
                LoggerUtil.getInstance().warn("amount总个数", amount, "商数:", quotient, "余数:", remainderNumber);
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
        let addArr = this.getEndNodeItemList(type);
        return arr.concat(addArr);
    },

    /**
     * 获取结束添加的部分节点数组
     * @param {zooAnimal} type 
     * @returns 
     */
    getEndNodeItemList(type) {
        let arr = [];
        let endIndex = 0;
        switch (type) {
            case 0:         // 鲨鱼 14
                endIndex = 14;
                break;
            case 1:         // 猴子 25-27
                endIndex = Math.floor(Math.random() * 3 + 25);
                break;
            case 2:         // 兔子 22-24
                endIndex = Math.floor(Math.random() * 3 + 22);
                break;
            case 3:         // 狮子 15-17
                endIndex = Math.floor(Math.random() * 3 + 15);
                break;
            case 4:         // 熊猫 18-20
                endIndex = Math.floor(Math.random() * 3 + 18);
                break;
            case 5:         // 燕子 1-3
                endIndex = Math.floor(Math.random() * 3 + 1);
                break;
            case 6:         // 鸽子 4-6
                endIndex = Math.floor(Math.random() * 3 + 4);
                break;
            case 7:         // 孔雀 11-13
                endIndex = Math.floor(Math.random() * 3 + 11);
                break;
            case 8:         // 老鹰 8-10
                endIndex = Math.floor(Math.random() * 3 + 8);
                break;

            case 11:         // 金鲨鱼 
                endIndex = 27;
                break;
            case 12:         // 炸弹 7 
                endIndex = 7;
                break
            case 13:         // 宝箱 21
                endIndex = 21;
                break;
            default:
                break;
        }
        LoggerUtil.getInstance().log(`type:${type},endIndex:${endIndex}`);
        arr = this.roulettes.slice(0, endIndex + 1);  // 第一个为金鲨鱼，此处额外 +1
        if (type == 11) {
            // 金鲨鱼 
            arr.push(this.roulettes[0]);
        }
        return arr;
    },

    /**
     * 转到该节点动画
     * @param {cc.Node} itemNode 
     * @param {String} speedType 速度类型 slow or fast
     * @param {Boolean} isEnd 是否为最后一个节点
     */
    itemRoulettes(itemNode, speedType, isEnd = false) {
        let time = 0;
        if (speedType == "slow") {
            time = this.slowShowLightInterval;
            if (isEnd == true) {
                GlobalCfg.ACT_SCENE_CTRL.zooAudioManager.playGameSound('lastRoll');
            } else {
                GlobalCfg.ACT_SCENE_CTRL.zooAudioManager.playGameSound('roll');
            }
        } else {
            this.fastRollIndex++;
            if (this.fastRollIndex % 3 == 0 && isEnd == false) {
                GlobalCfg.ACT_SCENE_CTRL.zooAudioManager.playGameSound('roll');
            }
            time = this.fastShowLightInterval;
        }
        if (itemNode) {
            itemNode.getChildByName('fg_04').active = true;
            cc.tween(itemNode)
                .to(time / 2, { scale: 1.2 })
                .to(time / 2, { scale: 1 })
                .call(() => {
                    if (!isEnd) {
                        itemNode.getChildByName('fg_04').active = false;
                    } else {
                        // LoggerUtil.getInstance().timeEnd("startRotate");
                    }
                })
                .start();
        }
    },

    // update (dt) {},
});
