import { cmd } from "../../../../script/config/cmd";
import { gameHelper } from "../../../../script/config/config";
import { event } from "../../../../script/event/event";
import { uAudio } from "../../../../script/framework/audio/audio";
import { tcRes } from "../../../../script/framework/res/res";
import { currency } from "../../../../script/pkg/currency";
import { EBtnSpineStatus } from "../../common/PGGameRes/script/PgGameControlPanelLogic";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { CellItemData } from "./fortune-rabbit-logic";
import { FortuneRabbitRes } from "./fortune-rabbit-res";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
import { FortuneRabbitView } from "./fortune-rabbit-view";
const { ccclass, property } = cc._decorator;
/** 移动速度 暂时配置在这里 后面有需要做fast模式再写到tabelinfo 里 */
let CELL_HRIGHT = 752;

/** 图案间隔 */
const ITEM_SPACING_Y = 0;
/** 边界坐标 */
const ITEM_SIZE = { width: 213, height: 188 };

@ccclass
export class FortuneRabbitCellItem extends cc.Component {
    private items: Array<cc.Node> = [];
    public grounpId: number = 0;
    public itemIndex: number = 0;
    /** 如果已经停止 点击stop时 就不再操作此组 */
    private stopNow: boolean = false;
    private view: FortuneRabbitView | null = null;
    private addCricle: number = 0;
    /** 最初y坐标 */
    private beginPosY = 0;
    private borderPoint = cc.Vec3.ZERO;

    private bQuickMode: boolean = false; // 当前列是否有预判数据
    private bTrriger: boolean = false;
    private oneRoolCostTime;  //滚动一圈的时长

    onLoad() {
        this.node?.children.forEach((node, index) => {
            this.items[index] = node;

            node.off("click");
            node.on(
                "click",
                () => {
                    this.onClickItem(index);
                },
                this
            );
        });
        cc.systemEvent.on(FortuneRabbitDefine.events.stopRoll, this.onItem0Stopped, this);
    }

    public setData(data: any) {
        this.bQuickMode = data.bQuickMode;
        this.oneRoolCostTime = 0.4;
        this.bTrriger = data.bTrigger;
        this.oneRoolCostTime = this.bQuickMode ? 0.2 : 0.5;
        this.setItemsOpacity(true);
    }

    public setView(view: FortuneRabbitView) {
        this.view = view;
    }
    /**
     * @method 初始化首屏图案
     * @param cellId 格子id
     * @param itemIndex 每个格子两组循环 标记id
     */
    public init(cellId: number, itemIndex: number) {
        this.grounpId = cellId;
        this.itemIndex = itemIndex;
        this.resetPosition();
        return this;
    }

    private resetPosition() {
        this.beginPosY = this.grounpId == 1 ? 0 : -ITEM_SIZE.height;
        this.borderPoint = cc.v3(0, this.beginPosY - CELL_HRIGHT);
        const y = this.itemIndex == 0 ? this.beginPosY : CELL_HRIGHT + this.beginPosY + ITEM_SPACING_Y;
        this.node.setPosition(0, y);
    }

    public getCellId(): number {
        return this.grounpId;
    }
    public getItemId(): number {
        return this.itemIndex;
    }

    public setItemsActive(): void {
        if (this.itemIndex == 1) {
            return;
        }
        this.setItemsOpacity(true);
    }

    /**@method 重置数据 */
    private resetData() {
        this.addCricle = 0;
        this.bQuickMode = false;
        this.setBallValueNodeOpacity(255);
    }

    public getItem0Cricle(): number {
        let baseCircle = this.bQuickMode ? 1 : FortuneRabbitTable.tabelInfo.circle;
        return baseCircle + this.addCricle - 1;
    }
    public getItem1Cricle(): number {
        let baseCircle = this.bQuickMode ? 1 : FortuneRabbitTable.tabelInfo.circle;
        return baseCircle + this.addCricle;
    }

    /**
     * @method
     * @returns
     */
    public startRoll(): void {
        this.unscheduleAllCallbacks();
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.reel, null, true);
        if (this.itemIndex == 1) {
            this.scheduleOnce(() => {
                cc.tween(this.node)
                    .to(this.getOneRollCostTime(), { position: this.borderPoint })
                    .call(() => {
                        this.onItem1RollEndCurCircle.call(this);
                    })
                    .union()
                    .repeat(99999999)
                    .call(() => {
                        this.stopNow = false;
                        this.resetData();
                    })
                    .start();
            }, 0.2);
            return;
        }

        /**
         * 第一组
         * 初始化时 在中间，需要拼接两个 半完整动作
         * repeat 次数 每格多一次
         */
        const func = () => {
            cc.tween(this.node)
                .to(this.getOneRollCostTime(), { position: this.borderPoint })
                .call(this.setRandomItems.bind(this))
                .call(() => {
                    this.onItem0RollEndCurCircle.call(this);
                })
                .union()
                .repeat(99999999)
                .call(this.setItemSPrite.bind(this))
                .to(this.getOneRollCostTime() / 2, { position: cc.v3(0, this.beginPosY - 20) }) //后半圈
                .call(() => {
                    this.stopNow = false;
                })
                .to(this.getOneRollCostTime() * 0.3, { position: cc.v3(0, this.beginPosY) }) //回弹
                .call(() => {
                    this.onRollEnd();
                })

                .start();
        };
        //前半圈
        cc.tween(this.node)
            .by(0.1, { position: cc.v3(0, 10) })
            .by(0.1, { position: cc.v3(0, -10) })
            .to(this.getOneRollCostTime() / 2, { position: this.borderPoint })
            .call(this.setRandomItems.bind(this))
            .call(() => {
                cc.systemEvent.emit(FortuneRabbitDefine.events.cellStartRoll);
                func();
                this.onItem0RollEndCurCircle.call(this);
            })
            .start();
    }

    private onItem0RollEndCurCircle() {
        if (this.stopNow) {
            //第一个item停止了，第二个item也可以停止
            this.itemIndex == 0 && cc.systemEvent.emit(FortuneRabbitDefine.events.stopRoll, this.grounpId);
            this.setItemSPrite();
            cc.Tween.stopAllByTarget(this.node);
            cc.tween(this.node)
                .to(this.getOneRollCostTime() / 2, { position: cc.v3(0, this.beginPosY) })
                .call(() => {
                    this.onRollEnd();
                })
                .start(); //后半圈
        }
    }

    private onItem1RollEndCurCircle() {
        this.setRandomItems();
        if (this.stopNow) {
            cc.Tween.stopAllByTarget(this.node);
            this.stopNow = false;
        }
    }

    getOneRollCostTime() {
        return this.oneRoolCostTime;
    }
    /**
     * @method 停止滚动
     * 外部用来停止滚轴转动的，只对item0生效，item1的停止由item0通过事件通知
     */
    public stopRoll(): void {
        if (this.itemIndex == 1) {
            return;
        }
        this.resetData();
        this.scheduleOnce(() => {
            this.stopNow = true;
        }, this.grounpId * 0.1);
    }

    //快停（点击快速停止按钮）
    //停止所有转轴转动并隐藏，将最终结果直接展示
    //必须等所有滚轴都滚动后才能立即停止
    public stopQuickly() {
        cc.Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        this.stopNow = true;
        this.setItemSPrite();
        this.resetPosition();
        this.onRollEnd();
    }

    //item0通知item1该停止了
    private onItem0Stopped(grounpId: number) {
        if (this.itemIndex == 0 || this.grounpId != grounpId) {
            return;
        }
        this.resetData();
        this.stopNow = true;
    }

    //开始feature模式的滚轴
    public startFeatureRoll() {
        this.bTrriger = true;
    }

    private setSizeMode(mode: number): void {
        this.items.forEach((item) => {
            const sprite = item.getChildByName("sprite")?.getComponent(cc.Sprite);
            if (sprite) {
                sprite.sizeMode = mode;
            }
        });
    }

    /**
     * @method 设置透明度(除freegame外的元素)
     * @param reset
     */
    public setItemsOpacity(reset?: boolean, itemIndex?: number): void {
        if (this.itemIndex == 1) {
            return;
        }

        this.items.forEach((item, index) => {
            const opacity = item.getChildByName("sprite");
            if (!opacity) {
                return;
            }
            if (itemIndex == undefined || index == itemIndex) {
                opacity.opacity = reset ? 255 : 0;
            }
        });
    }

    public setBallValueNodeOpacity(opacity: number = 255) {
        this.items.forEach((item, index) => {
            let valueLabel = this.items[index].getChildByName("value");
            valueLabel.opacity = opacity;
        });
    }

    /** 静止画面 */
    public setItemSPrite(): void {
        const listIndex = FortuneRabbitTable.tabelInfo.screen[this.grounpId];
        this.setSizeMode(cc.Sprite.SizeMode.TRIMMED);
        // tcLog.log(`setItemSPrite: ${JSON.stringify(FortuneRabbitTable.tabelInfo.screen)}  grounpId: ${this.grounpId} `);

        listIndex.forEach((itemData, index) => {
            let spriteNode = this.items[index].getChildByName("sprite");
            let wildNode = this.items[index].getChildByName("wild");
            let valueLabel = this.items[index].getChildByName("value").getComponent(cc.Label);

            valueLabel.node.active = false;


            wildNode.active = itemData.itemId != 0;
            spriteNode.active = itemData.itemId == 0;

            if (itemData.itemId == 51) {
                wildNode.scale = 0.65
            } else {
                wildNode.scale = 1
            }


            if (itemData.itemId == 0) {
                //feature模式的空
                this.setItemSprite(this.items[index], 0);
            } else {
                let skeletion = wildNode.getComponent(sp.Skeleton);
                skeletion.skeletonData = FortuneRabbitRes.getItemSkeletionData(itemData.itemId);
                if (itemData.itemId == 51) {
                    skeletion.setAnimation(0, "idle", true);

                } else if (itemData.itemId == 9) {
                    skeletion.setAnimation(0, "1", false);
                    itemData.value && ((valueLabel.node.active = true), this.setBallItemValue(valueLabel, itemData.value));

                } else {
                    skeletion.setAnimation(0, "spawn", false);
                }
                //调整动画坐标
                let position = cc.Vec3.ZERO;
                switch (itemData.itemId) {
                    case 81:
                        position = cc.v3(0, 19.5);
                        break;
                    case 3:
                        position = cc.v3(-18, -8);
                        break;
                    case 2:
                        position = cc.v3(-5, 0);
                        break;
                }
                wildNode.setPosition(position);
            }
        });
    }

    private changeType(itemNode: cc.Node, showSprite: boolean) {
        itemNode.getChildByName("wild").active = !showSprite;
        itemNode.getChildByName("sprite").active = showSprite;
        itemNode.getChildByName("value").active = !showSprite;
    }

    public getItemNode(itemIndex: number) {
        return this.items[itemIndex];
    }

    public setRandomItems(): void {
        const y = CELL_HRIGHT + this.beginPosY + ITEM_SPACING_Y;
        this.node.setPosition(0, y);
        /**
         * 随机图案（有必要的话再从指定数据中取
         */

        const listIndex = FortuneRabbitTable.getPatternByCellId(this.bTrriger);
        // tcLog.log(`setRandomItems: ${JSON.stringify(listIndex)}  grounpId: ${this.grounpId} `);

        this.setSizeMode(cc.Sprite.SizeMode.RAW);
        listIndex.forEach((itemId, index) => {
            let wildNode = this.items[index].getChildByName("wild");
            let spriteNode = this.items[index].getChildByName("sprite");
            let valueLabel = this.items[index].getChildByName("value");
            wildNode.active = false;
            valueLabel.active = itemId == 9;
            let randTimes = Math.floor(Math.random() * 49000) + 1000;
            randTimes = Math.floor(randTimes / 1000) * 1000;
            itemId == 9 && this.setBallItemValue(valueLabel.getComponent(cc.Label), randTimes);

            this.setItemSprite(this.items[index], itemId == 9 ? 9 : itemId * 10);
        });
    }

    private setItemSprite(itemNode: cc.Node, itemId: number) {
        const spriteFrame = FortuneRabbitRes.getItemIconById(itemId); //*10取模糊图案
        if (!spriteFrame) {
            console.warn(`spriteframe not found:${itemId}`);
            return;
        }
        const node = itemNode.getChildByName("sprite");
        if (!node) {
            return;
        }
        node.active = true;
        node.getComponent(cc.Sprite)!.spriteFrame = spriteFrame;
    }

    //设置卡片上的中奖额度
    private async setBallItemValue(label: cc.Label, value: number) {
        let fontName = "font1";
        // tcLog.log("curBet:", FortuneRabbitTable.tabelInfo.curBet);
        let times = currency.accDiv(value * 10, FortuneRabbitTable.tabelInfo.curBet);
        if (times >= 10 && times < 50) {
            fontName = "font3";
        } else if (times >= 50) {
            fontName = "font4";
        }
        let fontAsset = await tcRes.load(gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT), cc.Font, `artwork/font/${fontName}`);
        label.font = fontAsset;

        let len: number = 2
        if (value.toString().length >= 2) {
            len = 0
        }
        let valueStr = currency.formatNoSymbol(value * 10, true, len);
        label.string = `${valueStr}`;
    }

    onClickItem(itemIndex: number) {
        cc.systemEvent.emit(FortuneRabbitDefine.events.showItemTip, { cellId: this.grounpId, itemIndex: itemIndex });
    }

    hideItem(point: { x: number; y: number }) {
        if (this.itemIndex == 1 || this.grounpId != point.x) {
            return;
        }
        this.setItemsOpacity(false, point.y);
    }

    onRollEnd() {
        this.bTrriger = false;
        this.stopNow = false;

        if (this.itemIndex == 1) {
            return;
        }
        FortuneRabbitTable.tabelInfo.rollendCount++;
        this.resetData();
        uAudio.getInstance().stopEffect(FortuneRabbitDefine.soundNames.reel);
        uAudio.getInstance().playEffect(this.bQuickMode ? FortuneRabbitDefine.soundNames.reel_stop1 : FortuneRabbitDefine.soundNames.reel_stop);
        let ballIndexs: number[] = [];
        FortuneRabbitTable.tabelInfo.screen[this.grounpId].forEach((itemData, index) => {
            if (itemData.itemId == 9) {
                //非feature模式才需要播放收集动画
                !FortuneRabbitTable.tabelInfo.bTrigger && this.playWildCollect(index);
            } else {
                this.playRollEndAni(itemData.itemId, index);
            }
        });
        cc.systemEvent.emit(FortuneRabbitDefine.events.FortuneRabbitCellEndRoll, this.grounpId);
    }

    playRollEndAni(itemId: number, index: number) {
        let wildItemNode = this.items[index];
        let skeletion = wildItemNode.getChildByName("wild").getComponent(sp.Skeleton);
        skeletion.timeScale = 1;
        if (itemId == 51) {
            skeletion.node.scale = 0.65
        } else {
            skeletion.node.scale = 1;
        }
        if (itemId == 51) {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.wild_show);
            skeletion.setAnimation(0, "idle", true);
        } else if (itemId == 9) {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.win1);
            skeletion.setAnimation(0, "2", false);
        } else {
            skeletion.setAnimation(0, "spawn", false);
        }
    }

    private playWildCollect(ballCardIndex: number) {
        if (FortuneRabbitTable.tabelInfo.bBallWin) {
            return;
        }
        //播放wild出现动画及扫光特效
        let wildItemNode = this.items[ballCardIndex];
        cc.systemEvent.emit(FortuneRabbitDefine.events.wildShow, wildItemNode);
    }
}
