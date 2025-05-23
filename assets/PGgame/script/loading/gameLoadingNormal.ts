import { env } from "../app/env";
import { gameHelper } from "../config/config";
import { tcLog } from "../framework/log/log";
import { tcRes } from "../framework/res/res";
import { GameLoadingHelper, gameLoadingBaseView, loadTypeConfig } from "./gameLoadingHelper";
const { ccclass, property } = cc._decorator;

@ccclass
export class GameLoadingNormal extends cc.Component implements gameLoadingBaseView {
    spBackground: cc.Sprite | undefined;
    rotateWaitingIcon: cc.Node | undefined;

    curLoadProgress: number = 0;

    protected onLoad(): void {
        this.spBackground = cc.find("content/background", this.node)?.getComponent(cc.Sprite);
        this.rotateWaitingIcon = cc.find("content/loading", this.node);
        cc.systemEvent.emit("close-loading-dialog");
        this.loadingAnim();
    }

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
        this.node.getComponentsInChildren(cc.Widget).forEach((ele) => {
            ele?.updateAlignment();
        });
        try {
            env.application.curLocaton = 2; //标记游戏中
            let bPortrait = gameHelper.bPortrait();
            let bgName = bPortrait ? "bg_portrait" : "bg";
            const spriteFrameBg = await tcRes.load(bundleName, cc.SpriteFrame, `artwork/loadingBg/${bgName}`);
            this.spBackground && (this.spBackground.spriteFrame = spriteFrameBg);
            cc.systemEvent.emit("close-loading-dialog");
        } catch (err: any) {
            tcLog.error(`load game loading: ${err.message}`);
        }
    }

    private loadingAnim() {
        this.rotateWaitingIcon!.active = true;
        this.rotateWaitingIcon!.scale = 0.8;
        cc.tween(this.rotateWaitingIcon)
            .to(1.6, { angle: -360 })
            .call(() => {
                if (!this.rotateWaitingIcon) {
                    return;
                }
                this.rotateWaitingIcon.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
    }

    public updateLoadProgress(curLoadProgress: number) {
        if (!this.node) {
            return;
        }
        //该类型加载界面不需要展示进度条，直接关闭加载界面
        if (curLoadProgress >= 1) {
            GameLoadingHelper.closeLoading();
        }
    }
}
