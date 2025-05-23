import * as proto from "./protocol/slot_fortune_rabbit";
import { uAudio } from "../../../../script/framework/audio/audio";
import { CellItemData, FortuneRabbitLogic } from "./fortune-rabbit-logic";
import { FortuneRabbitAwardLayer } from "./fortune-rabbit-award-layer";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
import { FortuneRabbitCellItem } from "./fortune-rabbit-cell-item";
import { FortuneRabbitRes } from "./fortune-rabbit-res";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { FortuneRabbitWinNode } from "./fortune-rabbit-win-node";
import { throttle } from "../../../../script/descriptor/descriptor";
import { EBtnSpineStatus } from "../../common/PGGameRes/script/PgGameControlPanelLogic";
import { event } from "../../../../script/event/event";
import { tcLog } from "../../../../script/framework/log/log";
import CocosUtil from "../../common/PGGameRes/history/CocosUtil";
import { BaseView } from "../../common/PGGameRes/history/BaseView";
const { ccclass, property } = cc._decorator;
/** spin 按钮长按时间 */
const LONG_TOUCH_TIME: number = 0.5;

@ccclass
export class FortuneRabbitView extends BaseView {
    private gameLogic: FortuneRabbitLogic | undefined;
    public awardLayer: FortuneRabbitAwardLayer | null = null;

    private btnTable: cc.Node | undefined;
    private nodeGame: cc.Node | undefined;
    private nodeTable: cc.Node | undefined;
    private nodeAnimLayer: cc.Node | undefined;
    private nodeBgNoraml: cc.Node | undefined;

    /**中奖分数、广告及金牛动画 */
    private nodeMiddleView: FortuneRabbitWinNode | undefined;
    private baiyunLeft: cc.Node | undefined;
    private baiyunRight: cc.Node | undefined;
    private bomyunLeft: cc.Node | undefined;
    private bomyunRight: cc.Node | undefined;


    private rabbitSkeletion: sp.Skeleton | undefined;

    //开始滚动时各列特效
    private leftStartRollEffect: cc.Node | undefined;
    private leftStartRollEffect_featrue: cc.Node | undefined;
    private rightStartRollEffect: cc.Node | undefined;
    private rightStartRollEffect_featrue: cc.Node | undefined;
    private middleStartRollEffect: cc.Node | undefined;
    private middleStartRollEffect_feature: cc.Node | undefined;
    private leftLineNumFrameLight: cc.Node | undefined;
    private rightLineNumFrameLight: cc.Node | undefined;
    private leftRightNode: cc.Node | undefined;
    private middleNode: cc.Node | undefined;

    //记录当前福牛模式滚轴转动总次数和当前已转到次数
    private nodeLastFeatureRollTip: cc.Node | undefined;
    private nodeFeatrueRoolCountTip: cc.Node | undefined;
    private labelCurFeatureRoolCount: cc.Label | undefined;

    private featureCellBg: cc.Node | undefined;
    private nodeWildCollect: cc.Node | undefined;
    private spFeatureEnter: sp.Skeleton | undefined;
    private spFeatureEnterBgEffect: sp.Skeleton | undefined;

    private featureModeBottomShakeLight: cc.Node | undefined;
    private featureOtherGongxiEffect: cc.Node | undefined;
    private featureOtherGongxiEffect2: cc.Node | undefined;
    private featureTopNote: cc.Node | undefined;

    private effectClickTable: sp.Skeleton | undefined;
    private itemGrounps: FortuneRabbitCellItem[] = [];
    private startRollTimeouts: number[] = [];

    onLoad() {
        CocosUtil.traverseNodes(this.node, this.m_ui);
        this.nodeGame = cc.find("nodeGame", this.node);
        this.nodeTable = cc.find("nodeGame/nodeTable", this.node);

        this.nodeAnimLayer = cc.find("nodeGame/anim_layer", this.node);
        this.nodeMiddleView = cc.find("nodeGame/nodeMiddle", this.node)?.addComponent(FortuneRabbitWinNode);

        //兔子节点
        this.baiyunLeft = cc.find("nodeGame/baiyun/baiyunLeft", this.node);
        this.baiyunRight = cc.find("nodeGame/baiyun/baiyunRight", this.node);
        this.bomyunLeft = cc.find("nodeGame/baiyun/bomyunLeft", this.node);
        this.bomyunRight = cc.find("nodeGame/baiyun/bomyunRight", this.node);
        this.rabbitSkeletion = cc.find("nodeGame/rabbitSkeletion/spineRabbit", this.node).getComponent(sp.Skeleton);
        this.featureCellBg = cc.find("nodeGame/cellBgFeature", this.node);

        this.nodeWildCollect = cc.find("nodeGame/rabbitSkeletion/ballCollect", this.node);

        this.leftStartRollEffect = cc.find("nodeGame/rollCellEffects/leftCellStartRollEffect", this.node);
        this.leftStartRollEffect_featrue = cc.find("nodeGame/rollCellEffects/leftCellStartRollEffect_feature", this.node);
        this.rightStartRollEffect = cc.find("nodeGame/rollCellEffects/rightCellStartRollEffect", this.node);
        this.rightStartRollEffect_featrue = cc.find("nodeGame/rollCellEffects/rightCellStartRollEffect_feature", this.node);
        this.middleStartRollEffect = cc.find("nodeGame/rollCellEffects/middleCellStartRollEffect", this.node);
        this.middleStartRollEffect_feature = cc.find("nodeGame/rollCellEffects/middleCellStartRollEffect_feature", this.node);
        this.leftLineNumFrameLight = cc.find("nodeGame/rollCellEffects/leftNumFrameLight", this.node);
        this.rightLineNumFrameLight = cc.find("nodeGame/rollCellEffects/rightNumFrameLight", this.node);

        this.nodeLastFeatureRollTip = cc.find("bottom/spriteLastFeatureCount", this.node);
        this.nodeFeatrueRoolCountTip = cc.find("bottom/spriteLeftRoateCountTip", this.node);
        this.labelCurFeatureRoolCount = cc.find("bottom/spriteLeftRoateCountTip/leftCount", this.node).getComponent(cc.Label);

        this.featureModeBottomShakeLight = cc.find("nodeGame/bg_infoglow_a_add", this.node);
        this.featureModeBottomShakeLight.active = false;
        this.spFeatureEnter = cc.find("fortuneRabbitSp", this.node).getComponent(sp.Skeleton);
        this.spFeatureEnterBgEffect = cc.find("nodeGame/fortuneModeSheGuangBgEffect/fortuneModeSheGuangBgEffect", this.node).getComponent(sp.Skeleton);

        this.featureOtherGongxiEffect = cc.find("nodeGame/fortuneModeSheGuangBgEffect/featureOtherGongxiEffect", this.node);
        this.featureOtherGongxiEffect2 = cc.find("nodeGame/fortuneModeSheGuangBgEffect/featureOtherGongxiEffect2", this.node);
        this.featureTopNote = cc.find("nodeGame/featureTopNote", this.node);
        this.btnTable = cc.find("nodeGame/tableBtn", this.node);
        //动画层脚本
        this.awardLayer = this.nodeAnimLayer?.addComponent(FortuneRabbitAwardLayer)!;
        this.nodeTable = cc.find("nodeGame/nodeTable", this.node);

        this.leftRightNode = cc.find("leftRightNode", this.node);
        this.middleNode = cc.find("middleNode", this.node);
        this.leftRightNode.active = false
        this.middleNode.active = false

        this.m_ui.feature_spin.active = false
    }
    // onDestroy() {
    //     GameNet.getInstance().off_all_ui('login'); //注销所有事件
    // }

    public init(logic: FortuneRabbitLogic) {
        this.gameLogic = logic;
        this.nodeMiddleView.init(this);
        this.nodeMiddleView?.showAd();

        this.effectClickTable = cc.find("nodeGame/click", this.node).getComponent(sp.Skeleton);
        this.effectClickTable!.setCompleteListener(() => {
            this.effectClickTable!.node.active = false;
        });
    }

    public getControlPanelNode() {
        return cc.find("bottom/gameControlPanel", this.node);
    }

    public bindClickTableEvent(callback: Function) {
        this.btnTable.on(
            cc.Node.EventType.TOUCH_END,
            (event) => {
                callback(event);
            },
            this
        );
    }

    /**
     * @method 获取击中点位置信息
     * @param info
     * @returns
     */
    public getPoint(info: proto.slot_fortune_rabbit.IHit) {
        const points = info.pos!;
        const newPoints: { x: number; y: number }[] = [];
        const func = () => {
            //取击中点坐标
            for (let index = 0; index < points?.length; index++) {
                if (points[index] >= 0) {
                    let point = { x: 0, y: 0 };
                    point.x = index;
                    point.y = points[index];
                    newPoints.push(point);
                }
            }
        };

        func();

        return newPoints;
    }

    //显示中奖金额
    public showWinNote(winNum: number, winTimes: number, playStarEffect: boolean = true, bFreeTotalWin: boolean = false, playSound: boolean = true, callBack?: Function) {
        let effectName = winTimes < FortuneRabbitTable.tabelInfo.runScoreLevels[1] ? FortuneRabbitDefine.soundNames.win1 : FortuneRabbitDefine.soundNames.win2;
        let rabbitAniName =
            winTimes > 0 && winTimes < FortuneRabbitTable.tabelInfo.runScoreLevels[0]
                ? "win"
                : winTimes >= FortuneRabbitTable.tabelInfo.runScoreLevels[0] && winTimes < FortuneRabbitTable.tabelInfo.runScoreLevels[1]
                    ? "win2"
                    : "win3";

        if (!FortuneRabbitTable.tabelInfo.bTrigger) {
            this.playRabbitSkeletion(rabbitAniName, false, () => {
                this.playRabbitIdleAni();
            });
        }
        playSound && uAudio.getInstance().playEffect(effectName);
        tcLog.info("showWinNote", winNum, winTimes, playStarEffect, bFreeTotalWin, playSound)
        this.nodeMiddleView?.showWinNote(winNum, winTimes, playStarEffect, bFreeTotalWin, playSound, callBack);
        this.nodeMiddleView?.setBgStatus(true);
    }

    public setBonus(value: number, playAni: boolean) {
        this.gameLogic!.setBonus(value, playAni);
    }

    //显示所有中奖线信息
    public showAllLineInfo(allPoints: { x: number; y: number }[], allLindIds: number[]) {
        //重置所有中奖信息
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.winlines);
        this.resetAllAwardInfo();
        this.awardLayer?.setData(allPoints, allLindIds, 1);
    }

    /**
     * @method 显示单线中奖信息
     * @param lineId
     */
    public showOneLineInfo(info: proto.slot_fortune_rabbit.IHit): void {
        //重置所有中奖信息
        this.resetAllAwardInfo();
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.winlines);
        const allPoints = this.getPoint(info);
        if (!allPoints.length || info.lineId < 0) {
            return;
        }
        let score = info.win || 0;
        let oneLineScore = score;
        this.awardLayer?.setData(allPoints, [info.lineId || 0], 2, oneLineScore);
    }

    /**
     * @method 重置所有中奖信息
     * @param lineId
     */
    public resetAllAwardInfo(): void {
        this.itemGrounps.forEach((ele) => {
            ele?.setItemsActive();
        });
        this.awardLayer?.hideAward();
    }

    public pintUnique(arr: { x: number; y: number }[]) {
        const newArr: { x: number; y: number }[] = [];
        arr.forEach((item: { x: number; y: number }) => {
            let exist = false;
            newArr.forEach((newItem) => {
                if (item.x == newItem.x && item.y == newItem.y) {
                    exist = true;
                }
            });
            if (!exist) {
                newArr.push(item);
            }
        });
        return newArr;
    }

    public initTableView(): void {
        this.playRabbitIdleAni();
        this.featureCellBg.active = FortuneRabbitTable.tabelInfo.bTrigger;
    }

    //500s内没有摇奖则随机播放2、3休闲动画
    private playRabbitIdleAni() {
        // this.unschedule(this.playOtherRabbitIdleAni);


        if (FortuneRabbitTable.tabelInfo.wildCount >= 40) {
            this.playRabbitSkeletion("idle2", true);
        } else if (FortuneRabbitTable.tabelInfo.wildCount >= 20 && FortuneRabbitTable.tabelInfo.wildCount < 40) {
            this.playRabbitSkeletion("idle1", true);

        } else {
            this.playRabbitSkeletion("idle4", true);
        }

        // this.scheduleOnce(() => {
        //     this.playOtherRabbitIdleAni();
        // }, 60);
    }

    private playOtherRabbitIdleAni() {
        let aniName = `idle${Math.floor(Math.random() * 2 + 2)}`;
        // tcLog.log("rabbitIdleAni:", aniName);
        this.playRabbitSkeletion(aniName, false, () => {
            this.playRabbitIdleAni();
        });
    }

    /**
     * @method 初始化首屏
     */
    public initCellsItem(): void {
        // tcLog.info(`init cells`);
        this.nodeTable?.children.forEach((cell, cellId) => {
            for (let grounpIndex = 0; grounpIndex < 2; grounpIndex++) {
                const item = cc.instantiate(FortuneRabbitRes.getCellItem());
                item.setParent(cell);
                const tsItem = item.addComponent(FortuneRabbitCellItem);
                tsItem?.init(cellId, grounpIndex).setItemSPrite();
                this.itemGrounps[cellId * 2 + grounpIndex] = tsItem;
            }
        });
    }

    public startRoll(callback?: Function) {
        this.unscheduleAllCallbacks();
        this.playRabbitIdleAni();
        FortuneRabbitTable.tabelInfo.isAnimEnd = false;
        cc.Tween.stopAllByTarget(this.featureModeBottomShakeLight);
        this.featureModeBottomShakeLight.active = false;
        let addTime = this.getCellStartRollDelayTime();

        //feature模式，各列的边框启动特效需要多闪烁一次
        let repeatCount = FortuneRabbitTable.tabelInfo.bTrigger ? 2 : 1;
        this.playCellFrameEffect(this.middleStartRollEffect, 0, repeatCount, 0.5, 0.5);
        this.playCellFrameEffect(this.leftStartRollEffect, addTime, repeatCount, 0.5, 0.5);
        this.playCellFrameEffect(this.rightStartRollEffect, addTime * 2, repeatCount, 0.5, 0.5);
        this.playCellFrameEffect(this.leftLineNumFrameLight, 0.3, 1, 0.5, 0.5);
        this.playCellFrameEffect(this.rightLineNumFrameLight, 0.3, 1, 0.5, 0.5);
        this.startCellRolling(false, callback);
    }

    /**@method 开始滚动 */
    public OnReceiveSpinResult(): void {
        this.unscheduleAllCallbacks();
        if (FortuneRabbitTable.tabelInfo.bTrigger) {
            this.tryStartFortunRabbitMode();
            this.stopRoll(7);
        } else {
            this.startNormalMode();
        }
    }

    public stopRoll(delayTime: number = 0) {
        this.scheduleOnce(this.startStopRoll, delayTime);
    }

    private async startStopRoll() {
        if (this.gameLogic.bQuickMode() && !FortuneRabbitTable.tabelInfo.bTrigger) {
            // this.itemGrounps.forEach((ele) => {
            //     ele.stopRoll();
            // });

            for (let index = 0; index < this.itemGrounps.length; index++) {
                const element = this.itemGrounps[index];
                let time = 0
                if (element.grounpId == 1) {
                    time = 0.1
                } else if (element.grounpId == 2) {
                    time = 0.2
                }
                setTimeout(() => {
                    element.stopRoll();
                }, time * 1000);
            }


        } else {
            for (let index = 0; index < this.itemGrounps.length; index++) {
                const element = this.itemGrounps[index];
                let time = 0
                if (element.grounpId == 1) {
                    time = 0.5
                } else if (element.grounpId == 2) {
                    time = 1
                }
                setTimeout(() => {
                    element.stopRoll();
                }, time * 1000);
            }
        }
    }

    public stopQuickly(event: any, showClickEffect: boolean = false) {
        if (showClickEffect && event) {
            this.effectClickTable.node.active = true;
            this.effectClickTable.setAnimation(0, "animation", false);
            let pos = event.getLocation();
            let locaPos = this.nodeGame.convertToNodeSpaceAR(pos);
            this.effectClickTable.node.setPosition(locaPos);
        }
        //每列滚轴滚动是有延迟的，这里需要把还没有启动的滚轴动画停止
        this.startRollTimeouts.forEach((ele) => {
            window.clearTimeout(ele);
        });
        //取消延迟停止滚轴的定时器
        this.unschedule(this.startStopRoll);
        this.itemGrounps.forEach((ele) => {
            ele.stopQuickly();
        });
    }

    public setBtnTableActive(bActive: boolean) {
        this.btnTable.active = bActive;
    }

    //开启普通模式滚动
    private startNormalMode() {
        //非快速模式未中奖时，随机出现尝试进入feature模式动画
        let bTryFeature: boolean = false;
        if (!this.gameLogic?.bQuickMode() && this.gameLogic.getWinnerInfo().length == 0 && FortuneRabbitTable.tabelInfo.bWish) {
            //禁用spine按钮
            cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_RUN);
            this.tryStartFortunRabbitMode();
            bTryFeature = true;
        }

        let haveRun = new Date().getTime() - FortuneRabbitTable.tabelInfo.startRollTime
        let wait = 0
        if (haveRun > 1000) {
            wait = 0
        } else {
            wait = 1000 - haveRun
        }


        !bTryFeature && this.setBtnTableActive(true);
        this.stopRoll(bTryFeature ? 2.5 : this.gameLogic.bQuickMode() ? 0 : 0.5);
    }

    //开启免费模式（固定旋转8次，所有数据都在摇奖回包中一次性获取到，本地构建每次的摇奖展示数据
    //如果是进入游戏延续上一局featrue模式，则直接将各节点设置为feature模式（showScaleAni）
    public tryStartFortunRabbitMode(showScaleAni: boolean = true) {
        //播放feature模式启动动画
        if (showScaleAni) {
            this.playRabbitSkeletion("tease_start", false, () => {
                this.playRabbitSkeletion("tease_idle", false);
            });
        }
        cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.UNACTIVE_RUN, !this.gameLogic.bQuickMode());

        //开始缩小台面x
        //播放过度动画
        if (showScaleAni) {
            this.spFeatureEnter.node.active = true;
            this.m_ui.feature_spin.active = false
            this.spFeatureEnter.setAnimation(0, "logo", true);
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.reel_bon);
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.rabbit_wish);
            cc.tween(this.node)
                .to(2.5, { scale: 0.91 })
                .call(() => {
                    //缩放结束，如果是feature模式则开始相应流程，否则恢复台面状态
                    if (FortuneRabbitTable.tabelInfo.bTrigger) {
                        this.startFortuneMode();
                    } else {
                        this.playRabbitSkeletion("tease_exit", false, () => {
                            this.playRabbitIdleAni();
                        });
                        this.hideFortuneRabbitNode(1);
                    }
                })
                .delay(0.5)
                .call(() => {
                    console.log("setBtnSpineStatus:  tryStartFortunRabbitMode over");
                    // cc.systemEvent.emit(event.BTNSPIN_STATUS_CHANGE, EBtnSpineStatus.ACTIVE_NORMAL);
                })
                .start();
            //显示四个交流的云朵
            cc.tween(this.baiyunLeft)
                .set({ position: cc.v3(-530, 232) })
                .to(2.5, { position: cc.v3(-431, 232, 0) })
                .start();

            cc.tween(this.baiyunRight)
                .set({ position: cc.v3(530, 232) })
                .to(2.5, { position: cc.v3(421, 232, 0) })
                .start();

            cc.tween(this.bomyunLeft)
                .set({ position: cc.v3(-539, -740) })
                .to(2.5, { position: cc.v3(-415, -740, 0) })
                .start();

            cc.tween(this.bomyunRight)
                .set({ position: cc.v3(539, -740) })
                .to(2.5, { position: cc.v3(418, -740, 0) })
                .start();



            //显示feature模式的滚轴背景
            this.scheduleOnce(() => {
                cc.tween(this.featureCellBg).set({ active: true, opacity: 0 }).to(0.5, { opacity: 255 }).start();
                this.playCellFrameEffect(this.leftStartRollEffect_featrue, 0, 5);
                this.playCellFrameEffect(this.rightStartRollEffect_featrue, 0, 5);
                this.playCellFrameEffect(this.middleStartRollEffect_feature, 0, 5);
            }, 2);
        } else {
            this.node.scale = 0.91;
            this.nodeFeatrueRoolCountTip.setPosition(cc.v3(-61, -178, 0));
            this.baiyunLeft.setPosition(cc.v3(-530, 232, 0));
            this.baiyunRight.setPosition(cc.v3(530, 232, 0));
            this.bomyunLeft.setPosition(cc.v3(-539, -740, 0));
            this.bomyunRight.setPosition(cc.v3(539, -740, 0));
        }
    }
    //跑分框背后光
    public modeBottomShakeLight() {
        if (FortuneRabbitTable.tabelInfo.bTrigger) {
            cc.tween(this.featureModeBottomShakeLight).set({ active: true, opacity: 0 }).to(0.1, { opacity: 190 })
                .union().repeat(4).start();
        } else {
            cc.tween(this.featureModeBottomShakeLight).set({ active: true, opacity: 0 }).to(0.1, { opacity: 190 })
                .union().repeat(4).start();
        }
    }

    public freeMovie() {
        //开始播放摇奖8次的提示弹框
        this.scheduleOnce(() => {
            this.spFeatureEnter.node.active = true;

            cc.tween(this.m_ui.feature_spin)
                .set({ active: true, opacity: 0 })
                .delay(0.2).to(0.2, { opacity: 255 }).start();


            this.spFeatureEnter.setAnimation(0, "tanchu", false);
            this.spFeatureEnter.setCompleteListener(() => {
                this.spFeatureEnter.node.active = false;
                this.spFeatureEnter.setCompleteListener(() => { });
            });
            this.spFeatureEnterBgEffect.node.active = true;
            this.spFeatureEnterBgEffect.setAnimation(0, "sheguang", true);
        }, 0.9);

        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 2.5);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 3);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 3.5);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 3.8);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 4.2);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 4.3);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 4.5);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 4.8);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bon_xiu);
        }, 5);

        this.scheduleOnce(() => {
            this.addScoreFun()
        }, 6);

    }

    public addScoreFun() {
        // let tmp = []
        // for (let cellIndex = 0; cellIndex < 10; cellIndex++) {
        //     const flyNode = cc.instantiate(FortuneRabbitRes.getScoreItem());
        //     flyNode.setParent(this.spFeatureEnter.node);
        //     flyNode.setPosition(cc.v2(0, 318));
        //     flyNode.active = true;

        //     if (cellIndex == 0) {
        //         cc.tween(flyNode)
        //             .delay(cellIndex * 0.3)
        //             .bezierTo(0.3, cc.v2(0, 318), cc.v2(-221, -243), cc.v2(-221, -243))
        //             .call(() => {
        //                 flyNode.destroy();
        //             })
        //             .start();
        //     }
        // }
    }

    //进入feature模式
    public startFortuneMode() {
        uAudio.getInstance().stopMusic();
        this.gameLogic.changeMusic(FortuneRabbitDefine.soundNames.bon_music);
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.rabbit_bon);
        this.nodeMiddleView.showAd("feature", false);
        this.scheduleOnce(() => {
            uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bg_bigwin_cheer);
        }, 0.5);


        cc.tween(this.featureOtherGongxiEffect).set({ active: true, opacity: 0 }).to(0.3, { opacity: 255 }).to(0.3, { opacity: 0 }).union().repeatForever().start();
        cc.tween(this.featureOtherGongxiEffect2).set({ active: true, opacity: 0 }).to(0.3, { opacity: 255 }).to(0.3, { opacity: 0 }).union().repeatForever().start();
        cc.tween(this.featureModeBottomShakeLight).set({ active: true, opacity: 0 }).to(0.5, { opacity: 255 }).to(0.5, { opacity: 0 }).union().repeatForever().start();

        this.freeMovie()



        this.playRabbitSkeletion("freespin", false, () => {
            this.rabbitSkeletion.node.active = false;
        });
        this.scheduleOnce(() => {
            this.gameLogic.setControlBtnsStatus(false);
        }, 0.5);

        //大概第5秒时开始第一轮feature摇奖
        this.scheduleOnce(() => {
            this.itemGrounps.forEach((ele) => {
                ele.startFeatureRoll();
            });
            this.labelCurFeatureRoolCount.string = FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger + 1 + "";
            this.scheduleOnce(() => {
                this.labelCurFeatureRoolCount.string = FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger + "";
            }, 3);
            cc.tween(this.featureTopNote).set({ active: true, opacity: 0 }).to(0.3, { opacity: 255 }).start();
            //显示当前feature剩余次数提示
            cc.tween(this.nodeFeatrueRoolCountTip)
                .delay(0.3)
                .set({ active: true, opacity: 0, position: cc.v3(-61, -138) })
                .to(0.2, { opacity: 255, position: cc.v3(-61, -178) })
                .start();
        }, 1.5);
    }

    //开始feature模式滚轴滚动
    public startFortuneRoll(callback?: Function) {
        // this.tryStartFortunRabbitMode();
        this.resetAllAwardInfo();
        this.nodeLastFeatureRollTip.active = FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger == 0;
        this.nodeFeatrueRoolCountTip.active = FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger != 0;
        this.labelCurFeatureRoolCount.string = FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger + "";

        tcLog.log("rollLeftCountForTrigger:", FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger);
        if (FortuneRabbitTable.tabelInfo.bTrigger && (this.nodeLastFeatureRollTip.active || this.nodeFeatrueRoolCountTip.active)) {
            this.getControlPanelNode().getChildByName("btnSpine").y = 2000
            this.getControlPanelNode().getChildByName("btnAutostop").y = 2000
        } else {
            this.getControlPanelNode().getChildByName("btnSpine").y = 158.8
            this.getControlPanelNode().getChildByName("btnAutostop").y = 151.327
        }


        let addTime = this.getCellStartRollDelayTime();
        this.playCellFrameEffect(this.leftStartRollEffect_featrue, 0, 1);
        this.playCellFrameEffect(this.rightStartRollEffect_featrue, addTime, 1);
        this.playCellFrameEffect(this.middleStartRollEffect_feature, 2 * addTime, 1);
        this.playCellFrameEffect(this.leftLineNumFrameLight, 0.3, 1, 0.5, 0.5);
        this.playCellFrameEffect(this.rightLineNumFrameLight, 0.3, 1, 0.5, 0.5);
        this.startCellRolling(true, callback);
    }

    public getControlPanelNodeCheck() {
        if (FortuneRabbitTable.tabelInfo.bTrigger && FortuneRabbitTable.tabelInfo.rollLeftCountForTrigger == 0) {
            this.getControlPanelNode().getChildByName("btnSpine").y = 158.8
            this.getControlPanelNode().getChildByName("btnAutostop").y = 151.327
        }
    }


    //根据后台给的ball的总数量，构建全盘的数据
    public createFeatureModeCellItems(curFeatureData: number[]) {
        let data = [
            [
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
            ],
            [
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
            ],
            [
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
                { itemId: 0, value: 0 },
            ],
        ];
        for (let curIndex = 0; curIndex < curFeatureData.length; ++curIndex) {
            let itemId = 9;
            let cellIndex;
            let itemIndex;
            while (itemId == 9) {
                cellIndex = Math.floor(Math.random() * 3);
                let itemCount = cellIndex == 1 ? 4 : 3;
                itemIndex = Math.floor(Math.random() * itemCount);
                itemId = data[cellIndex][itemIndex].itemId;
            }
            data[cellIndex][itemIndex] = { itemId: 9, value: curFeatureData[curIndex] };
        }
        return data;
    }

    //滚轴开始滚动
    private startCellRolling(bTrigger: boolean = false, callback?: Function) {
        FortuneRabbitTable.tabelInfo.isRollEnd = false
        let delayTime = 0;
        let addTime = this.getCellStartRollDelayTime();
        this.itemGrounps.forEach((tsItem, index) => {
            let cellIndex = Math.floor(index / 2);
            delayTime = cellIndex * addTime;
            tsItem.setData({ bQuickMode: this.gameLogic?.bQuickMode() && !FortuneRabbitTable.tabelInfo.bTrigger, bTrigger: bTrigger });
            tsItem?.setView(this);
            this.startRollTimeouts.push(
                window.setTimeout(() => {
                    tsItem?.startRoll();
                    if (cellIndex == 2 && tsItem.itemIndex == 0) {
                        callback && callback();
                    }
                }, delayTime * 1000)
            );
        });
        bTrigger && this.stopRoll(delayTime + 2);
    }
    private getCellStartRollDelayTime() {
        return this.gameLogic?.bQuickMode() ? 0 : 0.06;
    }

    public reset() {
        this.nodeMiddleView!.reset();
        this.resetAllAwardInfo();
        this.awardLayer!.hideItemTip();
        cc.Tween.stopAllByTarget(this.featureOtherGongxiEffect2);
        this.featureOtherGongxiEffect2.active = false;
    }

    showCongratilationLabelEffect() {
        cc.tween(this.featureOtherGongxiEffect2).set({ active: true, opacity: 0 }).to(0.3, { opacity: 255 }).to(0.3, { opacity: 0 }).union().repeatForever().start();
    }

    //隐藏福牛模式节点
    public async hideFortuneRabbitNode(type: number) {
        if (type == 1) {
            //假的feature模式，则滚轴背景恢复，播放兔子的idle动画
            cc.tween(this.node).to(0.5, { scale: 1 }).start();
            cc.tween(this.featureCellBg).to(0.3, { opacity: 0 }).start();
            this.spFeatureEnter.node.active = false;
            cc.tween(this.baiyunLeft)
                .to(0.5, { position: cc.v3(-530, 232) })
                .start();

            cc.tween(this.baiyunRight)
                .to(0.5, { position: cc.v3(530, 232) })
                .start();

            cc.tween(this.bomyunLeft)
                .to(0.5, { position: cc.v3(-539, -740) })
                .start();

            cc.tween(this.bomyunRight)
                .to(0.5, { position: cc.v3(539, -740) })
                .start();

        } else if (type == 2) {
            this.rabbitSkeletion.node.active = true;
            this.playRabbitSkeletion("freespin", false);
            this.rabbitSkeletion.node.opacity = 0

            //feature模式结束时的退出，除了背景其他的都要恢复到普通模式
            this.featureTopNote.active = false;
            this.spFeatureEnterBgEffect.node.active = false;
            cc.Tween.stopAllByTarget(this.featureOtherGongxiEffect);
            cc.Tween.stopAllByTarget(this.featureOtherGongxiEffect2);
            this.featureOtherGongxiEffect.active = false;
            this.featureOtherGongxiEffect2.active = false;
            cc.Tween.stopAllByTarget(this.featureModeBottomShakeLight);
            this.featureModeBottomShakeLight.active = false;
            cc.tween(this.node).to(0.5, { scale: 1 }).start();
            cc.tween(this.baiyunLeft)
                .to(0.5, { position: cc.v3(-530, 232) })
                .start();

            cc.tween(this.baiyunRight)
                .to(0.5, { position: cc.v3(530, 232) })
                .start();

            cc.tween(this.bomyunLeft)
                .to(0.5, { position: cc.v3(-539, -740) })
                .start();

            cc.tween(this.bomyunRight)
                .to(0.5, { position: cc.v3(539, -740) })
                .start();

            await CocosUtil.wait(0.5)
            this.rabbitSkeletion.node.opacity = 255
            this.playRabbitSkeletion("respawn", false, () => {
                this.playRabbitIdleAni();
            });
            this.gameLogic.setControlBtnsStatus(true);
            cc.tween(this.nodeLastFeatureRollTip)
                .to(0.3, { opacity: 0 })
                .call(() => {
                    this.nodeLastFeatureRollTip.active = false;
                    this.nodeFeatrueRoolCountTip.active = false;
                    this.nodeLastFeatureRollTip.opacity = 255;
                })
                .start();
        } else {
            //上一局feature模式，重新开始摇奖时的退出
            cc.tween(this.featureCellBg).to(0.3, { opacity: 0 }).start();
        }
    }

    /**
     * @method 设置非freegame元素透明度
     * @param reset 是否重置透明度
     */
    public setItemsOpacity(reset: boolean): void {
        this.itemGrounps.forEach((ele) => {
            ele.setItemsOpacity(reset);
        });
    }

    lateUpdate(deltaTime: number) { }

    //切换兔子动画
    public playRabbitSkeletion(animationName: string, bloop: boolean = false, overCallback?: Function) {
        if (!this.rabbitSkeletion) {
            return;
        }
        !this.rabbitSkeletion.node.active && (this.rabbitSkeletion.node.active = true);
        this.rabbitSkeletion.node.active = true;
        this.rabbitSkeletion.setAnimation(0, animationName, bloop);
        if (overCallback) {
            this.rabbitSkeletion.setCompleteListener(() => {
                overCallback();
            });
        } else {
            this.rabbitSkeletion.setCompleteListener(() => { });
        }
    }

    //滚轴边框闪烁特效
    private playCellFrameEffect(effectNode: cc.Node, delayTime: number, repeatCount: number, fadeInCost: number = 0.3, fadeOutCost: number = 0.2) {
        if (!effectNode) {
            return;
        }
        cc.Tween.stopAllByTarget(effectNode);
        cc.tween(effectNode)
            .delay(delayTime)
            .set({ active: true, opacity: 0 })
            .to(fadeInCost, { opacity: 255 })
            .to(fadeOutCost, { opacity: 0 })
            .repeat(repeatCount)
            .call(() => {
                effectNode.active = false;
            })
            .start();
    }

    //播放ball出现的特效
    public playWildShowEffect(wildNode: cc.Node) {
        let collectNode = cc.instantiate(this.nodeWildCollect);
        if (!collectNode) {
            return;
        }
        collectNode?.setParent(this.nodeAnimLayer);
        collectNode!.active = true;
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bonus_showfly);
        let worldPos = wildNode.convertToWorldSpaceAR(cc.Vec3.ZERO);
        let localPos = this.nodeAnimLayer.convertToNodeSpaceAR(worldPos);
        collectNode!.setPosition(localPos);


        let ani = collectNode.getComponent(cc.Animation);
        ani.play();
        ani.on(cc.Animation.EventType.FINISHED, () => {
            cc.tween(collectNode)
                .to(0.15, { position: cc.v3(-181.5, 460.5, 0) })
                .call(() => {
                    collectNode?.destroy();
                    FortuneRabbitTable.tabelInfo.wildCount++
                    this.playWildCollectMusic();
                })
                .start();
        });
    }

    @throttle(300)
    private playWildCollectMusic() {
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.wild_show);
        this.playRabbitSkeletion("wild_collect", false, () => {
            this.playRabbitIdleAni();
        });
    }

    //开发播放卡片中线后分数分入分数槽的动画
    public playCollectBallScore() {
        let effectIndex = 0;
        FortuneRabbitTable.tabelInfo.screen.forEach((cellDatas, cellIndex) => {
            cellDatas.forEach(async (itemData, itemIndex) => {
                if (itemData.itemId == 9) {
                    effectIndex++
                }
            });
        });

        if (effectIndex >= 5) {
            this.awardLayer.playCollectBallScore(this.nodeMiddleView.node, async (addScore) => {
                //播放feature模式分数增加特效
                this.nodeMiddleView.playFeatureModeAddScore(addScore);
            });

            this.itemGrounps.forEach((ele) => {
                ele.setBallValueNodeOpacity(128);
            });
        }
    }


    public showItemTip(data: any) {
        let cellId = data.cellId;
        let itemIndex = data.itemIndex;
        this.awardLayer?.showItemTip(cellId, itemIndex);
    }

    public hideItem(point: { x: number; y: number }) {
        this.itemGrounps.forEach((ele) => {
            ele.hideItem(point);
        });
    }

    public send(): void {
        // let content = this.testEditor!.string;
        // const payload = {
        //     pos: content,
        // };
        // const req = proto.slot_fortune_ox.GameForTest.create(payload);
        // const encReq = proto.slot_gift_rush.GameForTest.encode(req).finish();
        // const pkg = new Message(cmd.SERVER_TYPE_GIFT_RUSH, proto.slot_gift_rush.GiftRushSlotCmd.CMD_GAME_FOR_TEST, encReq);
        // uNet.getInstance().send(pkg);
        // tcLog.info(`send request spin:${content}`);
    }
}
