// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { config } from "../../../../script/config/config";
import { AudioClipName, uAudio } from "../../../../script/framework/audio/audio";
import { tcI18n } from "../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../script/framework/log/log";
import { tcRes } from "../../../../script/framework/res/res";
import { creatorUtils } from "../../../../script/pkg/creator";
import { apiConfig } from "./api-config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ApiTipErrorView extends cc.Component {
    private ndBody: cc.Node | undefined;

    private lblTitle: cc.Label | undefined;
    private lblContent: cc.Label | undefined;
    private lblCode: cc.Label | undefined;

    private btnConfirm: cc.Button | undefined;
    private lblConfirm: cc.Label | undefined;

    private singleCfm: cc.Button | undefined;
    private lblsingleCfm: cc.Label | undefined;

    private btnClose: cc.Button | undefined;
    private lblClose: cc.Label | undefined;

    private btnConfirmCallback: Function | undefined;
    private btnCancelCallback: Function | undefined;
    private btnSingleCallback: Function | undefined;

    protected onLoad(): void {
        this.ndBody = cc.find("body");

        this.lblTitle = cc.find("body/layout/lab_title", this.node).getComponent(cc.Label);
        this.lblContent = cc.find("body/layout/lab_content", this.node).getComponent(cc.Label);
        this.lblCode = cc.find("body/layout/lab_code", this.node).getComponent(cc.Label);

        this.btnConfirm = cc.find("body/layout/buttons/confirm", this.node).getComponent(cc.Button);
        this.lblConfirm = cc.find("body/layout/buttons/confirm/New Label", this.node).getComponent(cc.Label);

        this.btnClose = cc.find("body/layout/buttons/close", this.node).getComponent(cc.Button);
        this.lblClose = cc.find("body/layout/buttons/close/New Label", this.node).getComponent(cc.Label);

        this.singleCfm = cc.find("body/layout/buttons/singleCfm", this.node).getComponent(cc.Button);
        this.lblsingleCfm = cc.find("body/layout/buttons/singleCfm/New Label", this.node).getComponent(cc.Label);

        creatorUtils.moveIn(this.ndBody, () => { });
    }

    protected start(): void {
        this.btnConfirm?.node.on("click", this.onClickBtnConfirm, this);
        this.btnClose?.node.on("click", this.onClickBtnClose, this);
        this.singleCfm?.node.on("click", this.onClickBtnSingle, this);
    }

    private onClickBtnConfirm() {
        this.btnConfirmCallback && this.btnConfirmCallback();
        this.close();
    }

    private onClickBtnClose() {
        this.btnCancelCallback && this.btnCancelCallback();
        this.close();
    }

    private onClickBtnSingle() {
        this.btnSingleCallback && this.btnSingleCallback();
        this.close();
    }

    private close() {
        this.node.destroy();
        uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
    }

    public setSingleMode() {
        this.btnConfirm!.node.active = true;
        this.btnConfirm!.node.x = 0;
    }

    public setTitleText(content: string) {
        this.lblTitle!.string = content;
    }

    public setContent(content: string) {
        this.lblContent!.string = content;
    }

    public setCodeText(content: string) {
        this.lblCode!.string = content;
    }

    public setConfirmText(text: string) {
        if (!this.lblConfirm) {
            return;
        }
        this.btnConfirm!.node.active = true;
        this.lblConfirm.string = text;
    }

    public setCloseText(text: string) {
        if (!this.lblClose) {
            return;
        }
        this.btnClose.node.active = true;
        this.lblClose.string = text;
    }

    public setSingleText(text: string) {
        this.singleCfm.node.active = true;
        this.lblsingleCfm.string = text;
    }
    public bindConfirmEvent(callback: Function) {
        this.btnConfirmCallback = callback;
    }

    public bindCloseEvent(callback: Function) {
        this.btnCancelCallback = callback;
    }

    public bindSingleBtnEvent(callback: Function) {
        this.btnSingleCallback = callback;
    }

    public setIsSingle(bool: boolean) {
        this.singleCfm!.node.active = bool;
        this.btnConfirm!.node.active = !bool;
        this.btnClose!.node.active = !bool;
    }
}
export namespace ApiTipError {
    let nodeCache: cc.Prefab;
    const nodeName = "ApiTipsController";
    export function Idestroy() {
        config.uiNode.tips.children.forEach((node) => {
            node.destroy();
        });
    }

    export function show(opt: {
        error: string;
        title?: string;
        content: string;
        onConfirm?: Function;
        confirmText?: string;
        singleBtnText?: string;
        unique?: boolean;
        closeText?: string;
        onClose?: Function;
        onSingle?: Function;
        iparent?: cc.Node;
    }) {
        if (!opt.iparent) {
            opt.iparent = config.uiNode.tips
        }

        if (opt.unique) {
            let has = false;
            opt.iparent.children.forEach((node) => {
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
                    const prefab = await tcRes.load<cc.Prefab>("tip-v2", cc.Prefab, "prefab/tips_code");
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
            if (!opt.iparent) {
                opt.iparent = config.uiNode.tips
            }
            node.setParent(opt.iparent);
            node.setPosition(0, 0);
            const view = node.addComponent(ApiTipErrorView);

            if (opt.error) {
                view.setCodeText(opt.error);
            }
            if (opt.content) {
                view.setContent(opt.content);
            }

            if (opt.title) {
                view.setTitleText(opt.title);
            } else {
                view.setTitleText(tcI18n.i18nLabel("tips_tips"));
            }

            if (opt.confirmText) {
                view.setConfirmText(opt.confirmText);
            }
            if (opt.onConfirm) {
                view.bindConfirmEvent(opt.onConfirm);
            }

            if (opt.closeText) {
                view.setCloseText(opt.closeText);
            }
            if (opt.onClose) {
                view.bindCloseEvent(opt.onClose);
            }
            if (opt.singleBtnText) {
                view.setSingleText(opt.singleBtnText);
            }

            if (opt.onSingle) {
                view.bindSingleBtnEvent(opt.onSingle);
            }
            //    view.setIsSingle(!opt.confirmText);

            creatorUtils.moveIn(view.node.getChildByName("body"));
        };
        callback();
    }
}
