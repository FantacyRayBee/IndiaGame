// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { config } from "../../../../../script/config/config";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundTipsView extends cc.Component {
    private ndBody: cc.Node | undefined;
    private hint_open: cc.Node | undefined;
    private hint_close: cc.Node | undefined;
    private layoutBg: cc.Layout | undefined;

    private labMsg: cc.Label | undefined;

    protected onLoad(): void {
        this.ndBody = cc.find("body", this.node);
        this.layoutBg = this.ndBody.getComponent(cc.Layout);
        this.hint_open = cc.find("hint_open", this.ndBody);
        this.hint_close = cc.find("hint_close", this.ndBody);
        this.labMsg = cc.find("labMsg", this.ndBody).getComponent(cc.Label);
    }

    protected start(): void {}
    public setTitleText(fool: boolean) {
        this.hint_close = cc.find("hint_close", this.ndBody);
        if (fool) {
            this.hint_open!.active = true;
            this.hint_close!.active = false;
            this.labMsg!.string = tcI18n.i18nLabel("setting_round_tip_on");
        } else {
            this.hint_open!.active = false;
            this.hint_close!.active = true;
            this.labMsg!.string = tcI18n.i18nLabel("setting_round_tip_off");
        }
        this.scheduleOnce(() => {
            this.layoutBg!.updateLayout();
            let size = this.layoutBg!.node.getContentSize();
            if (size.width >= 710) {
                //限制长度为710，文本改为可换行
                this.layoutBg!.node.setContentSize(cc.size(710, size.height));
                this.labMsg!.node.setContentSize(cc.size(710 - 2 * this.layoutBg!.paddingLeft, 50));
                this.labMsg!.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            }
        }, 0);
    }
}
export namespace RoundTips {
    let nodeCache: cc.Prefab;
    let newNode: cc.Node;

    const nodeName = "RoundTipsController";

    export function show(open: boolean) {
        const callback = async () => {
            if (!nodeCache) {
                try {
                    const prefab = await tcRes.load<cc.Prefab>("PGGameRes", cc.Prefab, "prefab/roundTip");
                    nodeCache = prefab;
                } catch (err: any) {
                    tcLog.error(`load RoundTips err: ${err.message}`);
                    return;
                }
            }
            if (newNode) {
                cc.Tween.stopAllByTarget(newNode);
                newNode.destroy();
            }
            newNode = cc.instantiate(nodeCache);
            newNode.name = nodeName;

            newNode.setParent(config.uiNode.dialog);

            newNode.setPosition(-67, -313);
            const view = newNode.addComponent(RoundTipsView);
            view.setTitleText(open);
            moveInOut(newNode);
        };
        callback();
    }

    export function moveInOut(node?: cc.Node) {
        cc.tween(node)
            .set({ scale: 0.8 })
            .to(0.1, { scale: 1.2 })
            .to(0.1, { scale: 1 })
            .delay(2)
            .to(0.3, { opacity: 0 })
            .call(() => {
                node!.active = false;
            })
            .start();
    }
}
