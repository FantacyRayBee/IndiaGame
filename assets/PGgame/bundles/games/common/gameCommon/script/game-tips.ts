// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { config } from "../../../../../script/config/config";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
import { creatorUtils } from "../../../../../script/pkg/creator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTipsView extends cc.Component {
    private ndBody: cc.Node | undefined;
    private btnClose: cc.Button | undefined;
    private btnConfirm: cc.Button | undefined;
    private lblConfirm: cc.Label | undefined;
    private btnCancel: cc.Button | undefined;
    private lblCancel: cc.Label | undefined;
    private lblContent: cc.Label | undefined;
    protected onLoad(): void {
        this.ndBody = cc.find("body");
        this.btnClose = cc.find("body/close", this.node).getComponent(cc.Button);
        this.btnConfirm = cc.find("body/confirm", this.node).getComponent(cc.Button);
        this.lblConfirm = cc.find("body/confirm/New Label", this.node).getComponent(cc.Label);
        this.btnCancel = cc.find("body/cancel", this.node).getComponent(cc.Button);
        this.lblCancel = cc.find("body/cancel/New Label", this.node).getComponent(cc.Label);
        this.lblContent = cc.find("body/content/New Label", this.node).getComponent(cc.Label);

        creatorUtils.moveIn(this.ndBody, () => {});
    }

    protected start(): void {
        this.btnConfirm?.node.on("click", this.close, this);
        this.btnCancel?.node.on("click", this.close, this);
        this.btnClose?.node.on("click", this.close, this);
    }

    private close() {
        this.node.destroy();
        uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
    }

    public setSingleMode() {
        this.btnCancel!.node.active = false;
        this.btnConfirm!.node.active = true;
        this.btnConfirm!.node.x = 0;
    }

    public setContent(content: string) {
        this.lblContent!.string = content;
    }
    public setConfirmText(text: string) {
        if (!this.lblConfirm) {
            return;
        }

        this.lblConfirm.string = text;
    }

    public setBtnCloseStatus(bShow: boolean) {
        if (!this.btnClose) {
            return;
        }

        this.btnClose.node.active = bShow;
    }

    public setCancelText(text: string) {
        if (!this.lblCancel) {
            return;
        }

        this.lblCancel.string = text;
    }

    public bindConfirmEvent(callback: Function) {
        this.btnConfirm?.node.on("click", callback, this);
    }

    public bindCancelEvent(callback: Function) {
        this.btnCancel?.node.on("click", callback, this);
    }

    public bindCloseEvent(callback: Function) {
        this.btnClose?.node.on("click", callback, this);
    }
}
export namespace GameTips {
    let nodeCache: cc.Prefab;
    const nodeName = "gameTipsController";
    export function show(opt: {
        content: string;
        onConfirm: Function;
        confirmText?: string;
        onCancel?: Function;
        cancelText?: string;
        single?: boolean;
        unique?: boolean;
        onClose?: Function;
        showBtnClose?: boolean;
    }) {
        if (opt.unique) {
            let has = false;
            config.uiNode.tips.children.forEach((node) => {
                if (node.name === nodeName) {
                    node.destroy();
                } else if (node.name === `${nodeName}-unique`) {
                    has = true;
                }
            });

            if (has) {
                return;
            }
        }

        const callback = async () => {
            if (!nodeCache) {
                try {
                    const prefab = await tcRes.load<cc.Prefab>("gameCommon", cc.Prefab, "prefab/tips");
                    nodeCache = prefab;
                } catch (err: any) {
                    tcLog.error(`load tips err: ${err.message}`);
                    return;
                }
            }
            const node = cc.instantiate(nodeCache);
            node.name = nodeName;
            if (opt.unique) {
                node.name = `${nodeName}-unique`;
            } else {
                node.name = nodeName;
            }
            node.setParent(config.uiNode.tips);
            node.setPosition(0, 0);
            const view = node.addComponent(GameTipsView);
            view.setContent(opt.content);
            if (opt.confirmText) {
                view.setConfirmText(opt.confirmText);
            }
            if (opt.cancelText) {
                view.setCancelText(opt.cancelText);
            }

            view.bindConfirmEvent(opt.onConfirm);
            if (opt.single) {
                view.setSingleMode();
            } else {
                if (opt.onCancel) {
                    view.bindCancelEvent(opt.onCancel);
                }
            }

            if (opt.onClose) {
                view.bindCloseEvent(opt.onClose);
            }
            view.setBtnCloseStatus(!!opt.showBtnClose);
            creatorUtils.moveIn(view.node.getChildByName("body"));
        };
        callback();
    }
}
