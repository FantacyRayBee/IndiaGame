import { env } from "../app/env";
import { config, gameHelper, gameLoadingBtnOkPositon } from "../config/config";
import { AudioClipName, uAudio } from "../framework/audio/audio";
import { tcI18n } from "../framework/i18n/i18n";
import { tcLog } from "../framework/log/log";
import { tcRes } from "../framework/res/res";
import { GameLoadingHelper, gameLoadingBaseView, loadTypeConfig } from "./gameLoadingHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export class GameLoading extends cc.Component implements gameLoadingBaseView {
    typeConfig: loadTypeConfig | undefined;

    spBackground: cc.Sprite | undefined;
    // rotateWaitingIcon: cc.Sprite | undefined;
    loadProgressBar: cc.ProgressBar | undefined;
    spriteLoadProgressBar: cc.Sprite | undefined;
    spriteLoadProgressBg: cc.Sprite | undefined;
    btnEnter: cc.Node | undefined; //进入游戏确定按钮
    spriteBtnEnter: cc.Sprite | undefined;

    curBundleName: string = "";
    loadResRatio: number = 0;
    curLoadProgress: number = 0;
    labelLoadProgress: cc.Label | undefined; //加载进度

    protected onLoad(): void {
        this.spBackground = cc.find("content/background", this.node)?.getComponent(cc.Sprite);
        this.loadProgressBar = cc.find("content/progressBar", this.node).getComponent(cc.ProgressBar);
        this.spriteLoadProgressBar = cc.find("content/progressBar/Bar", this.node)?.getComponent(cc.Sprite);
        this.spriteLoadProgressBg = cc.find("content/progressBar", this.node)?.getComponent(cc.Sprite);
        this.btnEnter = cc.find("content/btnEnter", this.node);
        this.spriteBtnEnter = cc.find("content/btnEnter/Background", this.node).getComponent(cc.Sprite);

        this.labelLoadProgress = cc.find("content/labelLoadingProgress", this.node).getComponent(cc.Label);
        cc.systemEvent.emit("close-loading-dialog", this.node);

        this.bindEvent();
    }

    protected onDestroy(): void {
        cc.systemEvent.off("switch-orientitaion", this.onViewResize.bind(this));
    }

    public bindEvent() {
        cc.systemEvent.on("switch-orientitaion", this.onViewResize.bind(this));

        this.btnEnter?.on("click", () => {
            uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
            GameLoadingHelper.closeLoading();
        });
    }

    async updateView(bundleName?: string, param?: any) {
        tcLog.info(`bundleName: ${bundleName}`);
        if (!bundleName) {
            cc.systemEvent.emit("close-loading-dialog");
            return;
        }

        if (!this.spBackground) {
            cc.systemEvent.emit("close-loading-dialog");
            return;
        }

        this.node.getComponentsInChildren(cc.Widget).forEach((ele) => {
            ele?.updateAlignment();
        });
        this.typeConfig = param;
        this.curBundleName = bundleName;

        let bPortrait = gameHelper.bPortrait();
        this.updateLoadingProgressNodesPostion(bPortrait ? 2 : 1);

        this.curLoadProgress = 0;
        this.loadProgressBar!.progress = 0;
        this.labelLoadProgress!.node.active = true;
        this.loadProgressBar!.node.active = true;
        this.updateLoadProgress(this.curLoadProgress);
        env.application.curLocaton = 2; //标记游戏中
        this.updateBg();
    }

    private async updateBg() {
        if (!this.node) {
            return;
        }
        try {
            let bgName = gameHelper.bPortrait() ? "bg_portrait" : "bg";
            tcRes.load(this.curBundleName, cc.SpriteFrame, `artwork/loadingBg/${bgName}`).then(
                (spriteFrameBg) => {
                    this.spBackground && (this.spBackground.spriteFrame = spriteFrameBg);
                    tcLog.info(`gameLoading upateBg  load ${bgName} suc`);
                },
                () => {
                    tcLog.info(`gameLoading upateBg  load ${bgName} fail ,reLoad bg`);
                    tcRes.load(this.curBundleName, cc.SpriteFrame, `artwork/loadingBg/bg`).then((spriteFrameBg) => {
                        this.spBackground && (this.spBackground.spriteFrame = spriteFrameBg);
                        tcLog.info(`gameLoading upateBg  ,reLoad bg suc`);
                    });
                }
            );
        } catch (err: any) {
            tcLog.error(`load game loading: ${err.message}`);
        } finally {
            cc.systemEvent.emit("close-loading-dialog");
        }
    }

    public updateLoadProgress(value: number) {
        if (!this.node) {
            return;
        }
        if (value <= this.curLoadProgress) {
            value = this.curLoadProgress;
        }
        this.curLoadProgress = value;
        if (!this.loadProgressBar!.node.active) {
            return;
        }
        this.labelLoadProgress!.string = `${tcI18n.i18nLabel("v2_pgGame_loading_note")}  [${(this.curLoadProgress * 100).toFixed(0)}%]`;
        this.loadProgressBar!.progress = value;
        if (this.curLoadProgress >= 1) {
            this.labelLoadProgress!.string = tcI18n.i18nLabel("v2_pgGame_loading_over");
            this.scheduleOnce(async () => {
                //如果配置了显示确定按钮，则需要手动点击按钮否则自动关闭
                if (this.typeConfig && this.typeConfig.showBtnOk) {
                    try {
                        let sprite = await tcRes.load(this.curBundleName, cc.SpriteFrame, "artwork/loadingBg/btnOkBg");
                        this.spriteBtnEnter!.spriteFrame = sprite;
                    } catch (err: any) {
                        tcLog.error("gameLoading updateLoadProgress", err.message);
                    }
                    this.updateBtnOkPosition();
                    this.btnEnter!.active = true;
                } else {
                    GameLoadingHelper.closeLoading();
                }
                this.loadProgressBar!.node.active = false;
                this.labelLoadProgress!.node.active = false;
            }, 0.5);
        }
    }

    private onViewResize(direction: number) {
        this.updateLoadingProgressNodesPostion(direction);
        this.updateBg();
    }

    private updateLoadingProgressNodesPostion(direction: number) {
        if (!this.node || !this.node?.isValid) {
            return;
        }
        if (direction == 1) {
            this.btnEnter?.setPosition(cc.v3(0, -300, 0));
            this.loadProgressBar?.node.setPosition(cc.v3(0, -310, 0));
            this.labelLoadProgress?.node.setPosition(cc.v3(0, -340, 0));
        } else {
            this.btnEnter?.setPosition(cc.v3(0, -575, 0));
            this.loadProgressBar?.node.setPosition(cc.v3(0, -570, 0));
            this.labelLoadProgress?.node.setPosition(cc.v3(0, -600, 0));
        }
    }

    //部分游戏确定按钮需要放置在特殊位置
    private updateBtnOkPosition() {
        let posData = gameLoadingBtnOkPositon[env.curGameData.data.nativeId as keyof typeof gameLoadingBtnOkPositon];
        if (posData) {
            let bPortrait = gameHelper.bPortrait();

            if (bPortrait) {
                this.btnEnter?.setPosition(cc.v2(posData[0][0], posData[0][1]));
                this.loadProgressBar?.node.setPosition(cc.v2(0, this.btnEnter!.y + 43));
                this.labelLoadProgress?.node.setPosition(cc.v2(0, this.btnEnter!.y));
            } else {
                this.btnEnter?.setPosition(cc.v2(posData[1][0], posData[1][1]));
            }
        }
    }
}
