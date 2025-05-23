import { env } from "../app/env";
import { event } from "../../script/event/event";
import { AudioClipName, uAudio } from "../framework/audio/audio";
import { tcI18n } from "../framework/i18n/i18n";
import { tcLog } from "../framework/log/log";
import { tcRes } from "../framework/res/res";
import { creatorUtils } from "../pkg/creator";
import { GameLoadingHelper, gameLoadingBaseView } from "./gameLoadingHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export class PgGameLoading extends cc.Component implements gameLoadingBaseView {
    private ndBar: cc.Node;
    private spProgress: cc.Node;
    private spLight: cc.Node;

    spBackground: cc.Sprite | undefined;
    pbGameLoading: cc.ProgressBar | undefined;
    loadResRatio: number = 0;

    // private fangweiAni1: sp.Skeleton | undefined; //防伪标识
    // private fangweiAni2: sp.Skeleton | undefined; //防伪标识
    private labelLoadProgress: cc.Label | undefined; //加载进度
    private btnEnter: cc.Node | undefined; //进入游戏确定按钮
    private loadProgressBar: cc.ProgressBar | undefined;
    private gameDescSprite: cc.Sprite | undefined;
    private spriteBtnEnter: cc.Sprite | undefined;

    ndTips: cc.Node | undefined;

    private curBundleName: string = "";
    private curLoadProgress: number = 0;

    protected onLoad(): void {
        this.ndBar = cc.find("content/progressBar/mask/bar", this.node);
        this.spProgress = cc.find("content/progressBar/mask", this.node);
        this.spLight = cc.find("content/progressBar/light", this.node);

        this.spBackground = cc.find("content/background", this.node)?.getComponent(cc.Sprite);
        // this.fangweiAni1 = cc.find("content/gameDesc/fangwei", this.node).getComponent(sp.Skeleton);
        // this.fangweiAni2 = cc.find("content/gameDesc/fangwei/guang", this.node).getComponent(sp.Skeleton);
        this.labelLoadProgress = cc.find("content/labelLoadingProgress", this.node).getComponent(cc.Label);

        this.btnEnter = cc.find("content/btnEnter", this.node);

        this.loadProgressBar = cc.find("content/progressBar", this.node).getComponent(cc.ProgressBar);
        this.gameDescSprite = cc.find("content/gameDesc", this.node)?.getComponent(cc.Sprite);
        this.spriteBtnEnter = cc.find("content/btnEnter/Background", this.node).getComponent(cc.Sprite);

        this.ndTips = cc.find("content/tip", this.node);
        this.bindClickBtnEnterEvent();


        let strs = tcI18n.i18nLabel("loading_scroll_message");
        const maxLength = strs.length;
        let tipsIndex = Math.floor(Math.random() * maxLength);
        this.ndTips.opacity = 255
        this.ndTips.getComponent(cc.Label).string = strs[tipsIndex];

        cc.systemEvent.on(event.resetLoadView, this.setView, this);

        // setTimeout(() => {
        //     uAudio.getInstance().playEffect(AudioClipName.CLICKBTN); //TEST
        //     GameLoadingHelper.closeLoading(); //TEST
        // }, 100);
    }

    public bindClickBtnEnterEvent() {
        this.btnEnter?.on("click", () => {
            uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
            GameLoadingHelper.closeLoading();

            if (window.removeSvgLogo) {
                window.removeSvgLogo();
            }
        });
    }

    /**
     *data:{
        showPlateIconAni:boolean    //是否显示平台标识动画
        showLoadProgress:boolean    //是否加载资源进度
        showBtnEnter:boolean        //是否显示进入游戏按钮
     } 
     */
    async updateView(bundleName?: string) {
        tcLog.info(`bundleName: ${bundleName}`);
        if (!bundleName) {
            cc.systemEvent.emit("close-loading-dialog");
            return;
        }

        if (!this.spBackground) {
            cc.systemEvent.emit("close-loading-dialog");
            return;
        }
        this.curBundleName = bundleName;
        try {
            this.node.getComponentsInChildren(cc.Widget).forEach((ele) => {
                ele?.updateAlignment();
            });
            //加载pgGame专用加载界面资源bundle
            await tcRes.loadBundle("PGGameRes");
            this.curLoadProgress = 0;
            this.loadProgressBar!.progress = 0;
            this.showLoadingProgress();

            let loadBgSuc = false;
            env.application.curLocaton = 2; //标记游戏中
            cc.systemEvent.emit("close-loading-dialog");

            //背景
            loadBgSuc = true;

            // this.cycleTip();
        } catch (err: any) {
            tcLog.error(`load game loading: ${err.message}`);
        }
    }

    // private restView() {
    //     cc.tween(this.ndBar).stop();
    //     this.stopCycleTips();
    //     this.setView()
    // }

    private setView() {
        this.ndBar.setPosition(252.404, 0);
        cc.tween(this.ndBar)
            .to(5, { position: cc.v3(708.284, 0) })
            .call(() => {
                this.ndBar.setPosition(252.404, 0);
            })
            .call(() => { })
            .union()
            .repeatForever()
            .start();

        this.cycleTip();
        this.updateProgress(0.5);
        this.updateProgressLabel(tcI18n.i18nLabel("loading_now_login"));
    }

    private updateProgress(value: number) {
        if (this.spProgress.width > value * 470) {
            return;
        }

        this.spProgress.width = value * 470;
        this.spLight.setPosition(-249 + 470 * value, 0);
    }

    private async showLoadingProgress() {
        this.gameDescSprite!.node.active = true;

        this.labelLoadProgress!.node.active = true;
        this.loadProgressBar!.node.active = true;
        this.updateLoadProgress(this.curLoadProgress);
    }

    public updateLoadProgress(value: number) {
        if (!this.node) {
            return;
        }
        if (value <= this.curLoadProgress) {
            value = this.curLoadProgress;
        }
        this.updateProgress(this.curLoadProgress);
        this.curLoadProgress = value;
        if (!this.loadProgressBar!.node.active) {
            return;
        }
        let str = "";
        if (value < 0.1) {
            str = tcI18n.i18nLabel("loading_now_login");
        } else if (value < 0.2) {
            str = tcI18n.i18nLabel("loading_load_tips");
        } else if (value < 0.3) {
            str = tcI18n.i18nLabel("loading_progress_tips", ["0"]);
        } else if (value < 1) {
            str = tcI18n.i18nLabel("loading_progress_tips", [`${Math.floor(value * 100).toFixed(0)}`]);
        }
        this.updateProgressLabel(str);
        this.loadProgressBar!.progress = value;
        if (this.curLoadProgress >= 1) {
            this.labelLoadProgress!.string = tcI18n.i18nLabel("loading_completed");

            this.scheduleOnce(async () => {
                try {
                    let sprite = await tcRes.load(this.curBundleName, cc.SpriteFrame, "artwork/loadingBg/btnOkBg");
                    this.spriteBtnEnter!.spriteFrame = sprite;
                } catch (err: any) {
                    tcLog.error("gameLoading updateLoadProgress", err.message);
                }
                this.stopCycleTips();
                this.btnEnter!.active = true;
                this.loadProgressBar!.node.active = false;
                this.labelLoadProgress!.node.active = false;
            }, 0.5);
        }
    }

    private updateProgressLabel(lable: string) {
        this.labelLoadProgress!.string = lable;
    }

    private cycleTip() {
        let strs = tcI18n.i18nLabel("loading_scroll_message");
        const maxLength = strs.length;
        let tipsIndex = Math.floor(Math.random() * maxLength);
        cc.tween(this.ndTips).stop();
        cc.tween(this.ndTips)
            .to(0.6, { position: cc.v3(0, -423), opacity: 0 })
            .delay(0.1)
            .call(() => {
                this.ndTips.opacity = 0
                this.ndTips.setPosition(0, -553);
                this.ndTips.getComponent(cc.Label).string = strs[tipsIndex];
                tipsIndex++;
                if (tipsIndex >= maxLength) {
                    tipsIndex = 0;
                }
            })
            .to(0.6, { position: cc.v3(0, -484), opacity: 255 })
            .delay(3)
            .union()
            .repeatForever()
            .start();
    }
    private stopCycleTips() {
        cc.tween(this.ndTips).stop();
        creatorUtils.setActive(this.ndTips, false);
    }
}
