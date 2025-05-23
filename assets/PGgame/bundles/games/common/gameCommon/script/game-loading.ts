// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { config } from "../../../../../script/config/config";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { creatorUtils } from "../../../../../script/pkg/creator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLoadingView extends cc.Component {
    private icon: cc.Node | undefined;
    private labTips: cc.Label | undefined;
    private callback: Function | undefined;

    protected onLoad(): void {
        this.icon = cc.find("loading", this.node);
        this.labTips = cc.find("label", this.node)?.getComponent(cc.Label);
        this.init();
    }

    protected onEnable(): void {
        cc.systemEvent.on("close-loading-dialog", this.close, this);
    }

    protected onDisable(): void {
        cc.systemEvent.off("close-loading-dialog", this.close, this);
    }

    private init(): void {
        cc.tween(this.icon)
            .to(2, { angle: -360 })
            .call(() => {
                if (!this.icon) {
                    return;
                }
                this.icon.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
        this.scheduleOnce(this.close, 10);
    }

    public close() {
        this.node.destroy();
    }

    public setDuration(duration: number) {
        this.unschedule(this.close);

        this.scheduleOnce(() => {
            this.close();
            if (this.callback) {
                this.callback();
            }
        }, duration);
    }

    public setCallback(callback: Function) {
        this.callback = callback;
    }

    public setTipsContent(tips: string) {
        if (!this.labTips) {
            return;
        }

        this.labTips.string = tips;
        creatorUtils.setActive(this.labTips, true);
    }
}

export namespace gameLoadingDialog {
    let cacheNode: cc.Prefab | undefined;
    let node: cc.Node | undefined;
    let closed: boolean = true;
    /**
     * 打开Loading界面
     * @param duration 持续时间（秒）
     * @returns
     */
    export async function show(opt?: { duration?: number; callback?: Function; labTips?: string }) {
        closed = false;
        if (!cacheNode) {
            try {
                const prefab = await tcRes.load("gameCommon", cc.Prefab, "prefab/dataLoading");
                cacheNode = prefab;
            } catch (err: any) {
                tcLog.error(`load loading err: ${err.message}`);
            }

            if (!cacheNode) {
                return;
            }
        }

        if (node || closed) {
            return;
        }

        node = cc.instantiate(cacheNode);
        node.name = "game-loading-view";
        node.setParent(config.uiNode.loading);
        node.setPosition(0, 0);

        const view = node.addComponent(GameLoadingView);
        if (opt?.callback) {
            view.setCallback(opt.callback);
        }
        if (opt?.duration) {
            view.setDuration(opt.duration);
        }
        if (opt?.labTips) {
            view.setTipsContent(opt.labTips);
        }
    }

    export function close() {
        closed = true;
        config.uiNode.loading.children.forEach((value) => {
            if (!value.isValid) {
                return;
            }

            if (value.name !== "game-loading-view") {
                return;
            }

            value.destroy();
        });
        node = undefined;
    }

    // export function bShow() {
    //     let bShow: boolean = false;
    //     config.uiNode.loading.children.forEach((value) => {
    //         if (value.isValid && value.name == "loading-view") {
    //             bShow = true;
    //             return;
    //         }
    //     });
    //     return bShow;
    // }
}
