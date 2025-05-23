import { cmd } from "../../../../script/config/cmd";
import { gameHelper } from "../../../../script/config/config";
import { uAudio } from "../../../../script/framework/audio/audio";
import { tcLog } from "../../../../script/framework/log/log";
import { tcRes } from "../../../../script/framework/res/res";
import { currency } from "../../../../script/pkg/currency";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { CellItemData } from "./fortune-rabbit-logic";
import { FortuneRabbitRes } from "./fortune-rabbit-res";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
const { ccclass, property } = cc._decorator;

@ccclass
export class FortuneRabbitAwardLayer extends cc.Component {
    private body: cc.Node | null = null;
    private cellMasksNode: cc.Node | null = null;
    private labelOnlineWin: cc.Label | undefined;
    private linesNode: cc.Node | undefined;
    private lines: cc.Node[] = []; //单线中奖时的线条
    private cellItems: Array<cc.Node> = [];
    private coinBoxs: cc.Node[] = [];

    //itemTip
    private itemTip: cc.Node | undefined;
    private cellTipMasks: cc.Node | undefined;
    private itemSkeletion: sp.Skeleton | undefined;
    public aniIsPlayed: boolean = false

    itemTipPosX = [-150 - 205, 72 - 205, 150 - 205];
    itemTipPosMiddle = [285 - 37.393, 97 - 37.393, -91 - 37.393, -278 - 37.393];
    itemTipPosOther = [189 - 37.393, 1 - 37.393, -187 - 37.393];
    onLoad() {
        this.body = cc.find("body", this.node);
        this.cellMasksNode = cc.find("cellMasks", this.node);
        this.linesNode = cc.find(`lines`, this.node);
        this.labelOnlineWin = cc.find("labelWin/labelWin", this.node).getComponent(cc.Label);
        this.itemTip = cc.find("itemTip", this.node);
        this.cellTipMasks = cc.find("cellTipMasks", this.node);


        this.itemSkeletion = cc.find("itemTip/itemSkeletion", this.node).getComponent(sp.Skeleton);
        for (let i = 0; i < 10; ++i) {
            this.lines.push(cc.find(`lines/${i + 1}`, this.node));
        }
        this.body?.children.forEach((node, index) => {
            this.cellItems[index] = node;
        });

        this.itemTip.on("click", () => {
            //如果当前在现实中奖信息，则不隐藏遮罩
            if (!FortuneRabbitTable.tabelInfo.bWin) {
                this.setMaskActive(false);
            }
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.click);
            this.itemTip!.active = false;
            this.cellTipMasks!.active = false;
        }, this);
    }

    public reset(hideWild: boolean = false) {
        this.setMaskActive(false);
        this.hideAward();
        this.aniIsPlayed = false
    }

    public hideAward() {
        this.unscheduleAllCallbacks();
        this.hideCells();
        this.setMaskActive(false);
        this.labelOnlineWin!.node.parent.active = false;
        cc.Tween.stopAllByTarget(this.linesNode);
        this.lines.forEach((ele) => {
            ele.active = false;
        });
    }

    /**
     *  隐藏遮罩
     * @param active
     * @param count     -1：全部执行，否则从0-count-1执行
     */
    public setMaskActive(active: boolean) {
        this.cellMasksNode!.active = active;
    }

    //隐藏所有方块
    public hideCells() {
        this.cellItems.forEach((cell) => {
            cell.children.forEach((item) => {
                item.children.forEach((child) => {
                    child.active = false;
                    if (child.name == "itemEffect") {
                        cc.Tween.stopAllByTarget(child);
                        child.children.forEach((child) => {
                            child.active = false;
                        });
                    } else if (child.name == "spine") {
                        const valueNode = child.getComponentInChildren(cc.Label);
                        valueNode && (valueNode.node.active = false);
                    }
                });
            });
        });
    }

    public setData(allPoints: { x: number; y: number }[], lineIds?: number[], type: number = 1, winCount: number = 0) {
        this.hideAward();
        if (allPoints.length > 0) {
            //打开中奖动画遮罩
            this.setMaskActive(true);
        }
        // tcLog.info(`FortuneRabbitWardlayer  setData type:${type},winCount:${winCount}`);
        this.showLine(lineIds || []);

        if (type == 2) {
            //只有单线需要显示得分
            this.labelOnlineWin!.node.parent.setParent(this.cellItems[allPoints[1].x]?.children[allPoints[1].y]);
            this.labelOnlineWin!.node.parent.setPosition(cc.v3(0, -50, 0));
            this.labelOnlineWin!.node.parent.active = true;
            this.labelOnlineWin!.string = currency.format(winCount);
        }
        allPoints.forEach((point, index) => {
            const listIndex = FortuneRabbitTable.tabelInfo.screen[point.x];
            const itemData = listIndex[point.y];
            this.showFlight(point, itemData.itemId);
            this.showItemSkeletion(point);
        });
        setTimeout(() => {
            this.aniIsPlayed = true
        }, 1000);
    }

    //显示中奖线
    showLine(lineIds: number[]) {
        if (!this.lines || this.lines.length == 0) {
            return;
        }
        cc.tween(this.linesNode)
            .set({
                opacity: 0,
            })
            .call(() => {
                lineIds.forEach((lineId) => {
                    this.lines[lineId - 1].active = true;
                });
            })
            .to(0.7, { opacity: 255 })
            .to(0.5, { opacity: 200 })
            .start();
    }

    /**
     * @method 每线中奖数量显示（始终第三格
     * @param amount
     * @param freeSpin
     * @param allPoints
     */
    public setWinAmount(amount: number, freeSpin: number, allPoints: { x: number; y: number }[]): void {
        const point = allPoints[2];
        const coinbox = this.coinBoxs[point.y];
        tcLog.info(`setWinAmount  coinbox：${coinbox}   amount:${amount}`);
        if (coinbox) {
            coinbox.active = true;
            const label = cc.find("ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:line-win/label", coinbox)?.getComponent(cc.Label);
            label.string = currency.format(amount);
            let skeleton = coinbox.getComponent(sp.Skeleton);
            skeleton.setAnimation(0, "animation", false);
        }
    }

    /**
     *显示物品动画背景特效
     * @param data
     * @returns
     */
    public showFlight(data: { x: number; y: number }, itemid: number): void {
        const itemEffectNode = this.cellItems[data.x]?.children[data.y]?.getChildByName("itemEffect");
        if (!itemEffectNode) {
            return;
        }
        this.scheduleOnce(() => {
            itemEffectNode.active = true;
            itemEffectNode.children.forEach((ele) => (ele.active = true));
            let circleAni = itemEffectNode.getChildByName("backGroundCircleAni").getComponent(cc.Animation);
            circleAni.on(cc.Animation.EventType.FINISHED, () => {
                //结束执行的方法
                circleAni.node.active = false;
            });
            circleAni.play();

            let starEffect = itemEffectNode.getChildByName("starEffect").getComponent(cc.Animation);

            starEffect.on(cc.Animation.EventType.FINISHED, () => {
                //结束执行的方法
                starEffect.node.active = false;
            });
            starEffect.play();
            let itemFrameAni = itemEffectNode.getChildByName("backFrameAni");
            cc.tween(itemFrameAni).set({ active: true, scale: 0, opacity: 255 }).to(1, { scale: 0.7, opacity: 80 }).union().repeatForever().start();

            let itemShadowSprite = itemEffectNode.getChildByName("itemShadow").getComponent(cc.Sprite);
            let shadowSpriteAdded = itemEffectNode.getChildByName("itemShadow2");
            itemShadowSprite.node.scale = 0.8;
            shadowSpriteAdded.active = false;
            let shadowSpriteName = "";
            switch (itemid) {
                case 1:
                    shadowSpriteName = "ps_vfx_a_carrot_add";
                    break;
                case 2:
                    shadowSpriteName = "ps_vfx_a_firecracker_add";
                    break;
                case 3:
                    shadowSpriteName = "ps_vfx_a_coin_add";
                    break;
                case 4:
                    shadowSpriteName = "ps_vfx_a_angpao_add";
                    break;
                case 9:
                    shadowSpriteName = "ps_vfx_a_cash_add";
                    itemShadowSprite.node.scale = 1;
                    shadowSpriteAdded.active = true;
                    break;
                case 51:
                    shadowSpriteName = "ps_vfx_a_wild_add";
                    break;
                case 81:
                    shadowSpriteName = "ps_vfx_a_pouch_add";
                    break;
                case 82:
                    shadowSpriteName = "ps_vfx_a_ingot_add";
                    break;
            }
            tcRes.load(gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT), cc.SpriteAtlas, "artwork/atlas/46ffed50-f8e9-4b2d-9fc1-c512adc64a66.68606").then((sprites) => {
                itemShadowSprite.spriteFrame = sprites.getSpriteFrame(shadowSpriteName);
            });
        }, data.x * 0.08);
    }

    public showItemSkeletion(data: { x: number; y: number }): void {
        const listIndex = FortuneRabbitTable.tabelInfo.screen[data.x];
        const items = this.cellItems[data.x];
        const itemData = listIndex[data.y];
        let itemid = itemData.itemId;

        if (!itemid) {
            return;
        }
        const spine = items?.children[data.y]?.getChildByName("spine")?.getComponent(sp.Skeleton);
        if (!spine) {
            return;
        }
        spine.setCompleteListener((entry: any) => {
            if (entry && entry.animation.name == "win") {
                spine.setAnimation(0, "spawn", true);
            }
            else if (entry && entry.animation.name == "spawn" && itemData.itemId == 51) {
                spine.setAnimation(0, "win", true);
            }
        });
        let position = cc.Vec3.ZERO;
        switch (itemid) {
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
        spine.node.setPosition(position);
        this.scheduleOnce(() => {
            let skeletionData = FortuneRabbitRes.getItemSkeletionData(itemid);
            //相同的动画时就不重置，避免显示不同单线时，同一个动画会出现跳跃一下的情况
            if (!spine.skeletonData || spine.skeletonData.name != skeletionData?.name) {
                spine.skeletonData = skeletionData!;
            }
            spine.node.active = true;

            spine.timeScale = 1;

            if (itemid == 51) {
                spine.node.scale = 0.65
            } else {
                spine.node.scale = 1;
            }

            if (itemid == 51) {
                spine.setAnimation(0, "spawn", false);
            } else if (itemid == 9) {
                if (!this.aniIsPlayed) {
                    spine.timeScale = 0.5;
                    spine.setAnimation(0, "2", false); //播一次，一直白色
                }

                let valueLabel = spine.node.getComponentInChildren(cc.Label);
                valueLabel && itemData.value && ((valueLabel.node.active = true), this.setBallItemValue(valueLabel, itemData.value));
            } else {
                spine.setAnimation(0, "win", true);
            }
        }, data.x * 0.08);
    }

    /**
     * @method
     */
    public shake(data: { x: number; y: number }): void {
        const node = this.cellItems[data.x].children[data.y]?.getChildByName("sprite");
        //容错 有时候数据不对
        if (!node) {
            return;
        }
        node.stopAllActions();
        cc.tween(node)
            .to(0.69, { scale: 1.08 })
            .to(0.69, { scale: 0.98 })
            .to(0.69, { scale: 1.08 })
            .to(0.69, { scale: 1 })
            .union()
            .repeat(2)
            .start();
    }

    public showItemTip(cellId: number, itemIndex: number) {
        if (FortuneRabbitTable.tabelInfo.bRolling) {
            return;
        }
        if (!this.cellItems[cellId].children[itemIndex]) {
            return;
        }

        let itemData = FortuneRabbitTable.tabelInfo.screen[cellId][itemIndex];
        if (itemData.itemId == 0) {
            return;
        }
        this.setMaskActive(true);
        this.itemTip!.active = true;
        this.cellTipMasks!.active = true;
        this.itemTip.setContentSize(cc.size(itemData.itemId == 9 ? 486 : 410, 215));
        let itemScore = FortuneRabbitDefine.itemScore
        // tcLog.log("itemScore:", itemScore);

        let ballTip = this.itemTip?.getChildByName("labelBall");
        ballTip.active = itemData.itemId == 9;
        ballTip!.setPosition(cellId == 0 || cellId == 1 ? 341 : 140, 0, 0);
        if (itemData.itemId == 9) {
            this.itemTip.width = 494
        } else {
            this.itemTip.width = 400
        }

        let scoreNode = this.itemTip?.getChildByName("node");
        scoreNode.active = itemData.itemId != 9;
        let labelScore = scoreNode?.getChildByName("score").getComponent(cc.Label);
        let key = itemData.itemId as keyof typeof itemScore;

        if (itemScore[key]) labelScore.string = "" + itemScore[key];


        let skeletionData = FortuneRabbitRes.getItemSkeletionData(itemData.itemId);
        if (!this.itemSkeletion!.skeletonData || this.itemSkeletion!.skeletonData.name != skeletionData?.name) {
            this.itemSkeletion!.skeletonData = skeletionData!;
        }

        scoreNode!.setPosition(cellId == 0 || cellId == 1 ? 278 : 60, 0, 0);
        this.itemTip.setParent(this.node.parent);
        let posX = cellId == 2 ? (itemData.itemId == 9 ? -121 : -50) : this.itemTipPosX[cellId];
        this.itemTip?.setPosition(posX, cellId == 0 || cellId == 2 ? this.itemTipPosOther[itemIndex] : this.itemTipPosMiddle[itemIndex]);
        // -45 -36.393

        if (itemData.itemId == 51) {
            this.itemSkeletion.node.scale = 0.65
            this.itemTip.height = 294
        } else {
            this.itemSkeletion.node.scale = 1;
            this.itemTip.height = 229
        }

        //图标sp动画
        if (itemData.itemId == 9) {
            if (FortuneRabbitTable.tabelInfo.bBallWin) {
                this.itemSkeletion!.setAnimation(0, "2", false);
            } else {
                this.itemSkeletion!.setAnimation(0, "1", true);
            }

        } else if (itemData.itemId == 51) {
            this.itemSkeletion!.setAnimation(0, "spawn", false);
        } else {
            this.itemSkeletion!.setAnimation(0, "spawn", false);
        }
        tcLog.log("tip itemId:", itemData.itemId);


        let worldPos = this.cellItems[cellId].children[itemIndex].convertToWorldSpaceAR(cc.Vec3.ZERO);
        let localPos = this.itemTip.convertToNodeSpaceAR(worldPos);
        let offsetPos = cc.Vec3.ZERO;
        switch (itemData.itemId) {
            case 81:
                offsetPos.y = 19.5;
                break;
            case 3:
                offsetPos = cc.v3(-18, -8);
                break;
            case 2:
                offsetPos.x = -5;
                break;
        }
        this.itemSkeletion.node.setPosition(localPos.add(offsetPos));
        //ball分数
        let ballValue = this.itemSkeletion.node?.getComponentInChildren(cc.Label);
        ballValue.node.active = itemData.itemId == 9;
        this.setBallItemValue(ballValue, itemData.value);
    }


    public hideItemTip() {
        this.setMaskActive(false);
        this.itemTip!.active = false;
        this.cellTipMasks!.active = false;
    }

    //设置卡片上的中奖额度
    private async setBallItemValue(label: cc.Label, value: number) {
        let fontName = "font1";
        // let times = value / FortuneRabbitTable.tabelInfo.curBet;
        // if (times >= 10 && times < 50) {
        //     fontName = "font3";
        // } else if (times >= 50) {
        //     fontName = "font4";
        // }
        let times = currency.accDiv(value * 10, FortuneRabbitTable.tabelInfo.curBet);
        if (times >= 10 && times < 50) {
            fontName = "font3";
        } else if (times >= 50) {
            fontName = "font4";
        }
        let fontAsset = await tcRes.load(gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT), cc.Font, `artwork/font/${fontName}`);
        label.font = fontAsset;
        label.node.opacity = 255;
        let len: number = 2
        if (value.toString().length >= 2) {
            len = 0
        }
        let valueStr = currency.formatNoSymbol(value * 10, true, len);
        label.string = `${valueStr}`;
    }


    public playCollectBallScore(parent: cc.Node, callback?: Function) {
        let effectIndex = 0;
        let countIndex = 0;
        FortuneRabbitTable.tabelInfo.screen.forEach((cellDatas, cellIndex) => {
            cellDatas.forEach(async (itemData, itemIndex) => {
                if (itemData.itemId == 9) {
                    let itemNode = this.cellItems[cellIndex].children[itemIndex];
                    if (!itemNode) {
                        return;
                    }
                    countIndex++
                    let valueLabel = cc.find("spine/itemAddedValue", itemNode);
                    let flyNode = cc.instantiate(valueLabel);
                    valueLabel.opacity = 128;
                    let worldPos = valueLabel.convertToWorldSpaceAR(cc.Vec3.ZERO);
                    let localPos = parent.convertToNodeSpaceAR(worldPos);
                    flyNode.setParent(parent);
                    flyNode.setPosition(localPos);
                    flyNode.active = true;
                    let pathPoinX = cellIndex == 0 ? localPos.x + 100 : cellIndex == 2 ? localPos.x - 100 : localPos.x;
                    cc.tween(flyNode)
                        // .delay(cellIndex * 0.3 + itemIndex * 0.4)
                        .delay(countIndex * 0.3)
                        .bezierTo(0.3, cc.v2(pathPoinX, localPos.y), cc.v2(pathPoinX, localPos.y - 100), cc.v2(0, -118))
                        .call(() => {
                            effectIndex++;
                            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames[`bonus_drop${effectIndex}`]);
                            flyNode.destroy();
                            callback && callback(itemData.value * 10);
                        })
                        .start();
                }
            });
        });
    }
}
