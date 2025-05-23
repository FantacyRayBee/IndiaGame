

import { config } from "../../../../script/config/config";
import { tcLog } from "../../../../script/framework/log/log";
import { tcRes } from "../../../../script/framework/res/res";
import { creatorUtils } from "../../../../script/pkg/creator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ApiTipContView extends cc.Component {
    private ndBody: cc.Node | undefined;
    private lblContent: cc.Label | undefined;

    protected onLoad(): void {
        this.ndBody = cc.find("body");

        this.lblContent = cc.find("body/layout/lab_content", this.node).getComponent(cc.Label);
        creatorUtils.moveIn(this.ndBody, () => { });
    }

    protected start(): void {
    }
    public setContent(content: string) {
        this.lblContent!.string = content;
    }

    public close() {
        this.node.destroy();
    }
}


export namespace ApiTipCont {
    let nodeCache: cc.Prefab;
    const nodeName = "ApiTipContController";
    export function Idestroy() {
        config.uiNode.tips.children.forEach((node) => {
            node.destroy();
        });
    }

    export function show(opt: {
        content: string;
    }) {

        const callback = async () => {
            if (!nodeCache) {
                try {
                    const prefab = await tcRes.load<cc.Prefab>("tip-v2", cc.Prefab, "prefab/tips_bottom");
                    nodeCache = prefab;
                } catch (err: any) {
                    tcLog.error(`load tips err: ${err.message}`);
                    return;
                }
            }
            const node = cc.instantiate(nodeCache);
            node.name = nodeName;
            node.setParent(config.uiNode.tips);
            node.setPosition(0, 0);
            const view = node.addComponent(ApiTipContView);
            if (opt.content) {
                view.setContent(opt.content);
            }
            creatorUtils.moveOpacityIn(view.node.getChildByName("body"));
            setTimeout(() => {
                creatorUtils.moveOut(this.ndBody, () => {
                    tcLog.error(`close`);
                    view.close()

                });
            }, 1000);
        };
        callback();
    }
}
