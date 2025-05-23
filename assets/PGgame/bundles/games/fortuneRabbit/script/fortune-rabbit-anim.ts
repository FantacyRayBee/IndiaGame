import { cmd } from "../../../../script/config/cmd";
import { config, gameHelper } from "../../../../script/config/config";
import { uAudio } from "../../../../script/framework/audio/audio";
import { tcLog } from "../../../../script/framework/log/log";
import { tcRes } from "../../../../script/framework/res/res";
import { currency } from "../../../../script/pkg/currency";
import { BaseView } from "../../common/PGGameRes/history/BaseView";
import CocosUtil from "../../common/PGGameRes/history/CocosUtil";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { FortuneRabbitLogic } from "./fortune-rabbit-logic";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
const { ccclass, property } = cc._decorator;

const winLevelSprites = [
    { bg: "grande_ganho_bg", tip: "grande_ganho", music: FortuneRabbitDefine.soundNames.bg_bigwin },
    { bg: "mega_ganho_bg", tip: "mega_ganho", music: FortuneRabbitDefine.soundNames.bg_bigwin },
    { bg: "super_mega_ganho_bg", tip: "super_mega_ganho", music: FortuneRabbitDefine.soundNames.bg_bigwin },
];

@ccclass
export class FortuneRabbitAnim extends BaseView {
    private labelWinCount: cc.Label | undefined;
    private rabbitSkeletion: sp.Skeleton | undefined;
    private mask: cc.Node | undefined;
    private body: cc.Node | undefined;
    private numCount: number = 0;
    private betAmount: number = 0;
    private winTotal: number = 0;
    private curWinLevel: number = -1;

    private winLevel: number = 0;
    private maxLevel: number = 0;
    //倍数
    private canJumpToLastStage: boolean = false; //是否可以点击直接跳转到最终奖励
    private isAniOver: boolean = false;
    private bDelayStage: boolean = false; //当前是否处于点击后延迟结束状态

    private winLevels: number[] = FortuneRabbitTable.tabelInfo.winLevel;
    private winAddCost: number[] = [7, 8, 13];
    private curStep: number = 0; //当前阶段步长
    private minStep: number = 0; //最新步长

    onLoad() {
        this.body = cc.find("body", this.node);
        this.labelWinCount = cc.find("body/labelWin", this.node).getComponent(cc.Label);
        this.rabbitSkeletion = cc.find("body/skeletion", this.node).getComponent(sp.Skeleton);


        CocosUtil.traverseNodes(this.node, this.m_ui);
        this.m_ui.big_win.opacity = 0
        this.m_ui.mega_win.opacity = 0
        this.m_ui.super_mega_win.opacity = 0

        this.mask = cc.find("mask", this.node);
        this.mask.on("click", () => {
            if (!this.canJumpToLastStage) {
                return;
            }
            if (this.isAniOver) {
                this.scheduleOnce(() => {
                    this.exist();
                }, 0.5);
                return;
            }
            if (this.bDelayStage) {
                return;
            }
            if (this.numCount < this.winTotal) {
                this.bDelayStage = true;
                this.scheduleOnce(() => {
                    this.numCount = this.winTotal;
                    this.labelWinCount!.string = currency.format(this.numCount);
                    this.aniOver();
                    let maxWinLevel = 0;
                    for (let i = 0; i < this.winLevels.length; ++i) {
                        if (this.winLevel >= this.winLevels[i]) {
                            maxWinLevel = i;
                        }
                    }
                    if (this.curWinLevel < maxWinLevel) {
                        this.changeWinLevel(maxWinLevel);
                    }
                }, 0.5);
            }
        });
    }

    private exist() {
        if (!this.node) {
            return;
        }
        gameHelper.stopAllEffects();
        this.unscheduleAllCallbacks();
        cc.tween(this.body)
            .to(0.3, { opacity: 0 })
            .call(() => {
                cc.systemEvent.emit(FortuneRabbitLogic.EventBigWinOver);
                this.node && this.node.destroy();
            })
            .start();
    }

    /**
     * @method 大奖
     * @param animId
     */
    public async show(betAmount: number, winCoin: number, betSize: number) {
        tcLog.info(`---showMaxWin,betAmount:${betAmount}  winCoin:${winCoin}`);
        this.minStep = betSize / 3;
        this.canJumpToLastStage = false;
        this.scheduleOnce(() => {
            this.canJumpToLastStage = true;
        }, 1);
        this.numCount = 0;
        this.betAmount = betAmount;
        this.winTotal = winCoin;
        FortuneRabbitTable.tabelInfo.musicName = FortuneRabbitDefine.soundNames.bg_bigwin;
        uAudio.getInstance().playMusic(FortuneRabbitDefine.soundNames.bg_bigwin);
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bg_bigwin_cheer);
        this.rabbitSkeletion!.node.active = true;
        this.winLevel = Math.floor(this.winTotal / this.betAmount);
        for (let i = 0; i < this.winLevels.length; ++i) {
            if (this.winLevel >= this.winLevels[i]) {
                this.maxLevel = i;
            }
        }
        this.curWinLevel = 0;
        this.changeWinLevel(this.curWinLevel);
        this.schedule(
            () => {
                if (this.numCount < this.winTotal) {
                    this.numCount += this.curStep;
                    if (this.numCount > this.winTotal) {
                        this.numCount = this.winTotal;
                    }
                    this.labelWinCount!.string = currency.format(this.numCount);
                    if (this.curWinLevel == 1 && this.numCount >= this.betAmount * this.winLevels[2]) {
                        this.curWinLevel = 2;
                        this.changeWinLevel(this.curWinLevel);
                    } else if (this.curWinLevel == 0 && this.numCount >= this.betAmount * this.winLevels[1]) {
                        this.curWinLevel = 1;
                        this.changeWinLevel(this.curWinLevel);
                    } else if (this.curWinLevel == -1) {
                        this.curWinLevel = 0;
                        this.changeWinLevel(this.curWinLevel);
                    }
                } else {
                    this.aniOver();
                }
            },
            0.06,
            cc.macro.REPEAT_FOREVER
        );
    }

    private updateStep(winLevel: number) {
        let step = 0; // Number((((winLevels[this.curWinLevel] - (this.curWinLevel > 0 ? winLevels[this.curWinLevel - 1] : 0)) * this.betAmount) / this.winAddCost[this.curWinLevel] - 1) * 0.06);

        if (winLevel == 0) {
            let cost = Math.floor(this.winAddCost[0] - 1) / 0.06 + 1;
            step = Math.floor(((this.winLevels[1] * this.betAmount) / (cost - 1)) * 100) / 100;
        } else if (winLevel == 1) {
            let cost = Math.floor(this.winAddCost[1] - 1) / 0.06 + 1;
            step = Math.floor((((this.winLevels[2] - this.winLevels[1]) * this.betAmount) / (cost - 1)) * 100) / 100;
        } else {
            let cost = Math.floor(this.winAddCost[2] - 1) / 0.06 + 1;
            step = Math.floor(((this.winTotal - this.winLevels[2] * this.betAmount) / (cost - 1)) * 100) / 100;
        }

        if (this.maxLevel == winLevel) {
            this.curStep = Math.max(step, this.minStep);
        } else {
            this.curStep = step;
        }
    }

    private aniOver() {
        this.unscheduleAllCallbacks();
        this.isAniOver = true;
        this.bDelayStage = false;
        this.rabbitSkeletion?.setAnimation(0, "rs_idle2", true);
        this.rabbitSkeletion?.setCompleteListener(() => { });
        uAudio.getInstance().stopMusic();
        uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.bg_bigwin_end);
        cc.tween(this.labelWinCount?.node).delay(0.5).to(0.2, { scale: 1.2 }).to(0.15, { scale: 1 }).start();
        this.scheduleOnce(() => {
            this.exist();
        }, 5);
    }

    //播放不同等级的spine动画
    private async changeWinLevel(winLevel: number) {
        this.updateStep(winLevel);
        this.rabbitSkeletion?.setAnimation(0, `j${winLevel + 1}_start`, false);

        if (winLevel == 0) {
            this.m_ui.big_win.opacity = 255
            this.m_ui.mega_win.opacity = 0
            this.m_ui.super_mega_win.opacity = 0

            cc.tween(this.m_ui.big_win).to(0.5, { opacity: 255 }).start();

        } else if (winLevel == 1) {
            this.m_ui.big_win.opacity = 0
            this.m_ui.mega_win.opacity = 255
            this.m_ui.super_mega_win.opacity = 0



        } else if (winLevel == 2) {
            this.m_ui.big_win.opacity = 0
            this.m_ui.mega_win.opacity = 0
            this.m_ui.super_mega_win.opacity = 255
        }

        this.rabbitSkeletion?.setCompleteListener(() => {
            this.rabbitSkeletion?.setAnimation(0, `j${winLevel + 1}_circulate`, true);
        });
    }
}

export namespace FortuneRabbitAnimAlert {
    let nodeCache: cc.Prefab | undefined;
    export function clear() {
        nodeCache = undefined;
    }
    export function show() {
        const nodeName = "FortuneRabbitAnimAlert";
        const callback = async () => {
            if (!nodeCache) {
                const prefab = await tcRes.load<cc.Prefab>(gameHelper.getBundleName(cmd.SERVER_TYPE_FORTUNE_RABBIT), cc.Prefab, "prefab/fortune-rabbit-bigWin");
                if (!prefab) {
                    return;
                }

                nodeCache = prefab;
            }
            const node = cc.instantiate(nodeCache);
            node.name = nodeName;
            node.setParent(config.uiNode.dialog);
            node.setPosition(cc.Vec3.ZERO);
            const halloweenAnim = node.addComponent(FortuneRabbitAnim);
            return halloweenAnim;
        };

        return callback();
    }
}
