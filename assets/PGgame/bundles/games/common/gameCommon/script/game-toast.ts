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
export class GameToastView extends cc.Component {
    private lbContent: cc.Label | undefined;
    private layoutBg: cc.Layout | undefined;

    protected onLoad(): void {
        this.lbContent = cc.find("frame_c_r_00/New Label", this.node).getComponent(cc.Label);
        this.layoutBg = cc.find("frame_c_r_00", this.node).getComponent(cc.Layout);
    }

    public setText(text: string) {
        if (!this.lbContent) {
            return;
        }

        this.lbContent.string = text;
        this.scheduleOnce(() => {
            this.layoutBg!.updateLayout();
            let size = this.layoutBg!.node.getContentSize();
            if (size.width >= 710) {
                //限制长度为710，文本改为可换行
                this.layoutBg!.node.setContentSize(cc.size(710, size.height));
                this.lbContent!.node.setContentSize(cc.size(710 - 2 * this.layoutBg!.paddingLeft, 50));
                this.lbContent!.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            }
        }, 0);
    }

    public play(time: number) {
        cc.tween(this.node)
            .set({ scale: 0.8 })
            .to(0.1, { scale: 1.2 })
            .to(0.1, { scale: 1 })
            .delay(2)
            .to(0.3, { opacity: 0 })
            .call(() => {
                this.node!.active = false;
            })
            .start();
    }
}

export namespace gameToast {
    let item: cc.Node | undefined;
    export enum Duration {
        LENGTH_SHORT,
        LENGTH_LONG,
    }

    let nodeCache: cc.Prefab;
    const nodeName = "GameToastController";

    export async function show(text: string, duration?: Duration) {
        if (!nodeCache) {
            try {
                nodeCache = await tcRes.load<cc.Prefab>("gameCommon", cc.Prefab, "prefab/toast");
            } catch (err) {
                tcLog.error("load toast prefab", err);
            }
        }

        if (!nodeCache) {
            return;
        }
        if (item) {
            cc.Tween.stopAllByTarget(item);
            item.destroy();
        }
        item = cc.instantiate(nodeCache);
        item.name = nodeName;
        item.setParent(config.uiNode.tips);

        const size = cc.view.getVisibleSize();
        item.setPosition(0, -313);

        const view = item.addComponent(GameToastView);
        view.setText(text);

        const d = duration ?? Duration.LENGTH_SHORT;
        view.play(d === Duration.LENGTH_SHORT ? 1 : 3);
    }
}
