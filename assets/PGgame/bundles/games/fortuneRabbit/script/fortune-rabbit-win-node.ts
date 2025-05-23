import { env } from "../../../../script/app/env";
import { uAudio } from "../../../../script/framework/audio/audio";
import I18nSprite from "../../../../script/framework/i18n/i18n-sprite";
import { currency } from "../../../../script/pkg/currency";
import { FortuneRabbitDefine } from "./fortune-rabbit-define";
import { FortuneRabbitTable } from "./fortune-rabbit-table";
import { FortuneRabbitView } from "./fortune-rabbit-view";

const { ccclass, property } = cc._decorator;

@ccclass
export class FortuneRabbitWinNode extends cc.Component {
    private view: FortuneRabbitView | undefined;

    private labelWinCount: cc.Label | undefined;
    private i18WinNodeTip: I18nSprite | undefined;
    private winNode: cc.Node | undefined;
    private winNote: cc.Node | undefined;
    private winNodeBgNormal: cc.Node | undefined;
    private winNodeBgMiddle: cc.Node | undefined;
    private winNodeBgHigh: cc.Node | undefined;
    private spriteAd: cc.Sprite | undefined;
    private nodeWinBgEnd: cc.Node | undefined;

    private nodeStarEffect: cc.Animation | undefined; //得分时的星星动画
    private nodeCongratulationAni: cc.Animation | undefined; //得分倍数大于等于3时抛星星的动画
    private nodeCoinsAni: cc.Animation | undefined; //得分倍数大于等于3时抛金币的动画

    private nodeGuangDotTop: cc.Node | undefined; //上下边框移动的光点;
    private nodeGuangDotBottom: cc.Node | undefined; //上下边框移动的光点;

    private nodeGuangRotater: cc.Node | undefined; //旋转的发散光
    private nodeShaoGuangAni; //向左右移动的光块

    private adIndex: number = 0;
    //多语言文件夹中的广告名称
    private adImgNames: string[] = ["ad1", "ad2", "ad3"];
    private i18SpriteAd: I18nSprite | undefined;
    private bAdMode: boolean = true; //当前是否处于广告模式
    private curWinScore: number = 0;

    protected onLoad(): void {
        this.labelWinCount = cc.find("nodeWin/winNote/labelWinCount", this.node).getComponent(cc.Label);
        this.i18WinNodeTip = cc.find("nodeWin/winNote/winTip", this.node).getComponent(I18nSprite);
        this.winNode = cc.find("nodeWin", this.node);
        this.winNote = cc.find("nodeWin/winNote", this.node);
        this.winNodeBgNormal = cc.find("winBg/winBg_normal", this.node);
        this.winNodeBgMiddle = cc.find("winBg/winBg_middle", this.node);
        this.winNodeBgHigh = cc.find("winBg/winBg_high", this.node);
        this.spriteAd = cc.find("nodeWin/ads", this.node).getComponent(cc.Sprite);
        this.nodeGuangDotTop = cc.find("winBg/guangFrameTop", this.node);
        this.nodeGuangDotBottom = cc.find("winBg/guangFrameBottom", this.node);
        this.nodeWinBgEnd = cc.find("winBgEnd", this.node);
        this.nodeStarEffect = cc.find("winBg/starEffectAni", this.node).getComponent(cc.Animation);
        this.nodeCoinsAni = cc.find("aniCoin", this.node).getComponent(cc.Animation);
        this.nodeGuangRotater = cc.find("winBg/effect/guangRotate", this.node);
        this.nodeShaoGuangAni = cc.find("winBg/shaoguangAni", this.node).getComponent(cc.Animation);
        this.nodeCongratulationAni = cc.find("aniCongratulation", this.node).getComponent(cc.Animation);
        this.i18SpriteAd = this.spriteAd.node.getComponent(I18nSprite);
    }

    public init(view: FortuneRabbitView) {
        this.view = view;
    }

    private updateBonus() {
        this.view!.setBonus(env.curGameData.balance, true);
    }
    //显示广告
    public async showAd(adName?: string, autoChangeAd: boolean = true) {
        if (!this.spriteAd) {
            return;
        }
        // this.unscheduleAllCallbacks();
        clearTimeout(this.gunTime)
        this.spriteAd!.node.active = true;
        this.winNote!.active = false;
        this.nodeWinBgEnd!.active = true;
        this.winNodeBgMiddle.active = false;
        this.winNodeBgHigh.active = false;
        this.winNodeBgNormal.active = true;
        this.winNodeBgNormal.opacity = 255;
        this.nodeStarEffect.node.active = false;
        this.nodeCongratulationAni.node.active = false;
        this.nodeGuangRotater.parent.active = false;
        this.nodeShaoGuangAni.node.active = false;
        this.nodeGuangDotBottom.active = false;
        this.nodeGuangDotTop.active = false;

        this.setBgStatus(true);
        cc.Tween.stopAllByTarget(this.spriteAd?.node);
        await this.changeAd(adName);
        let spriteNodeWidth = this.spriteAd!.node.getContentSize();
        let viewSize = this.winNode!.getContentSize().width;
        if (spriteNodeWidth.width > viewSize) {
            this.spriteAd?.node.setPosition(new cc.Vec3((spriteNodeWidth.width - viewSize) / 2 + 40, 3, 0));
            //广告过长，需要滚动
            clearTimeout(this.gunTime)
            this.gunTime = setTimeout(() => {
                cc.tween(this.spriteAd?.node)
                    .by(spriteNodeWidth.width / 79, { position: cc.v3(-spriteNodeWidth.width, 3, 0) })
                    .call(() => {
                        this.showAd(adName);
                    })
                    .start();
            }, 3000);
        } else {
            this.spriteAd?.node.setPosition(cc.Vec3.ZERO);
            if (autoChangeAd) {
                clearTimeout(this.gunTime)
                this.gunTime = setTimeout(() => {
                    this.showAd(adName);
                }, 5000);
            }
        }
    }
    private gunTime: any

    private async changeAd(adName?: string) {
        let name = adName || this.adImgNames[this.adIndex % this.adImgNames.length];
        this.adIndex += adName ? 0 : 1;
        this.i18SpriteAd!.spriteName = `${name}`;
        // console.log(`changeAd:${name}`);
        await this.i18SpriteAd!.refresh();
    }

    private showWinNoteNum
    //显示中奖分数
    public async showWinNote(winNum: number, winTimes: number, playStarEffect: boolean = true, bFreeTotalWin: boolean = false, playSound: boolean = true, callBack?: Function) {
        this.curWinScore = winNum;
        this.bAdMode = false;
        this.spriteAd!.node.active = false;
        console.log("showWinNote unscheduleAllCallback ");
        // this.unscheduleAllCallbacks();
        clearTimeout(this.gunTime)
        clearInterval(this.showWinNoteNum)
        cc.Tween.stopAllByTarget(this.spriteAd!.node);
        cc.Tween.stopAllByTarget(this.winNote);
        this.nodeWinBgEnd!.active = false;
        this.winNote.active = true;
        this.playBaseEffect(winTimes);
        //非feature模式时特定倍数时需要数字滚动
        if (winTimes >= FortuneRabbitTable.tabelInfo.runScoreLevels[0] && winTimes < FortuneRabbitTable.tabelInfo.runScoreLevels[1]) {
            playSound && uAudio.getInstance().stopEffect(FortuneRabbitDefine.soundNames.rabbit_runscore);
            playSound && uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.runscore, null, true);
            FortuneRabbitTable.tabelInfo.bWinScoreRuning = true;
            this.i18WinNodeTip!.node.active = false;
            let curScore = 0;
            let addStep = winNum / 17;
            // this.schedule(() => {
            this.showWinNoteNum = setInterval(() => {
                if (curScore < winNum) {
                    curScore += addStep;
                    curScore = curScore > winNum ? winNum : curScore;
                    this.labelWinCount!.string = currency.format(curScore);
                } else {
                    // this.unscheduleAllCallbacks();
                    console.log("else unscheduleAllCallbacks ");
                    clearInterval(this.showWinNoteNum)

                    this.i18WinNodeTip!.node.active = true;
                    let tipName = bFreeTotalWin ? "total_win" : "win";
                    this.i18WinNodeTip.spriteName = tipName;
                    this.i18WinNodeTip.refresh();
                    FortuneRabbitTable.tabelInfo.bWinScoreRuning = false;
                    this.updateBonus();
                    uAudio.getInstance().stopEffect(FortuneRabbitDefine.soundNames.runscore);
                    playSound && uAudio.getInstance().playEffect(FortuneRabbitDefine.soundNames.win2);
                    this.playAddedEffect(winTimes);
                    setTimeout(() => {
                        callBack && callBack();
                    }, 500);
                }
            }, 100)
            // }, 0.06, cc.macro.REPEAT_FOREVER);

        } else {
            let tipName = bFreeTotalWin ? "total_win" : "win";
            this.i18WinNodeTip.spriteName = tipName;
            this.i18WinNodeTip.refresh();
            if (this.winNote) {
                cc.tween(this.winNote).set({ scale: 1.1 }).to(0.2, { scale: 1 }, { easing: cc.easing.backInOut }).start();
            }
            playStarEffect && this.playAddedEffect(winTimes);
            this.labelWinCount!.string = currency.format(winNum);
            callBack && callBack();
        }
    }

    //显示对应底图及旋转发散光效
    private playBaseEffect(winTimes: number) {
        let bBigWin = winTimes >= FortuneRabbitTable.tabelInfo.winLevel[0];
        console.log("playBaseEffect:", bBigWin, " winTimes:", winTimes, "  winLevel:", FortuneRabbitTable.tabelInfo.winLevel[0]);

        let node: cc.Node = (bBigWin ? this.winNodeBgHigh : this.winNodeBgMiddle);
        if (!node.active) {
            node.opacity = 0;
            node.active = true;
            cc.tween(node).to(0.3, { opacity: 255 }).start();
            cc.tween(this.winNodeBgNormal).to(0.2, { opacity: 0 }).start();
        }
        //旋转的发散光
        this.nodeGuangRotater.parent.active = true;
        cc.tween(this.nodeGuangRotater).by(20, { angle: -360 }).union().repeatForever().start();
    }

    //显示抛金币星星特效，移动光点动画等
    private playAddedEffect(winTimes: number) {
        //分数底星星特效
        this.nodeStarEffect!.node.active = true;
        this.nodeStarEffect.play();
        let bBigWin = winTimes >= FortuneRabbitTable.tabelInfo.winLevel[0];
        if (bBigWin) {
            this.nodeCoinsAni.node.active = true;
            this.nodeCoinsAni.play();
            this.nodeCongratulationAni.node.active = true;
            this.nodeCongratulationAni.play();
            this.nodeCoinsAni!.on(cc.Animation.EventType.FINISHED, () => {
                //结束执行的方法
                this.nodeCoinsAni!.node.active = false;
                this.nodeCongratulationAni.node.active = false;
            });
        }
        if (winTimes >= FortuneRabbitTable.tabelInfo.runScoreLevels[0]) {
            this.view!.modeBottomShakeLight();
            this.nodeCoinsAni.node.active = true;
            this.nodeCoinsAni.play();
            //向左右移动的光块
            this.playShaoGuangAni();
            //上下边框移动的光点
            let moveTween1 = cc.tween().to(0.8, { position: cc.v3(272, 88.5) }, { easing: cc.easing.quadIn });
            let moveTween2 = cc.tween().to(0.8, { position: cc.v3(-272, 5.26) }, { easing: cc.easing.quadIn });
            cc.tween(this.nodeGuangDotTop)
                .set({ position: cc.v3(-272, 88.5), opacity: 0, active: true })
                .parallel(cc.tween().to(0.1, { opacity: 255 }), moveTween1)
                .then(cc.tween().to(0.1, { opacity: 0 }))
                .start();
            cc.tween(this.nodeGuangDotBottom)
                .set({ position: cc.v3(272, 5.26), opacity: 0, active: true })
                .parallel(cc.tween().to(0.1, { opacity: 255 }), moveTween2)
                .then(cc.tween().to(0.1, { opacity: 0 }))
                .start();
        }
    }

    public playFeatureModeAddScore(winCount: number) {
        this.playShaoGuangAni();
        this.addScore(winCount);
    }

    private addScore(winCount: number) {
        this.curWinScore += winCount;
        this.showWinNote(this.curWinScore, 0, false);
    }
    public playShaoGuangAni() {
        this.nodeShaoGuangAni.node.active = true;
        this.nodeShaoGuangAni.play();
        this.nodeCoinsAni!.on(cc.Animation.EventType.FINISHED, () => {
            this.nodeShaoGuangAni!.node.active = false;
        });
    }

    public setBgStatus(show: boolean) {
        // this.spriteBg!.node.active = show;
    }

    public reset() {
        if (this.bAdMode) {
            return;
        }
        this.curWinScore = 0;
        this.showAd();
    }
}
