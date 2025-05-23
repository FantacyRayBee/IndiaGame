// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { env } from "../../../../../script/app/env";
import { config, gameHelper } from "../../../../../script/config/config";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { tcI18n } from "../../../../../script/framework/i18n/i18n";
import { tcLog } from "../../../../../script/framework/log/log";
import { tcRes } from "../../../../../script/framework/res/res";
// import { bwsdk } from "../../../../../script/sdk/sdk";
import { gameLoadingDialog } from "./game-loading";
import { gameToast } from "./game-toast";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameHashCheckPopup extends cc.Component {
    private labelTitleUID: cc.Label | undefined;
    private labelUID: cc.Label | undefined;
    private labelHash: cc.Label | undefined;
    private labelKey: cc.Label | undefined;
    private labelResult: cc.Label | undefined;
    private nodeLastName: cc.Node | undefined;

    private btnCopyHashValue: cc.Node | undefined;
    private btnCopyKey: cc.Node | undefined;
    private btnCopyResult: cc.Node | undefined;
    private btnOk: cc.Node | undefined;
    private nodeCheckResultTip: cc.Node | undefined;

    private btnClose: cc.Node | undefined;

    protected onLoad(): void {
        this.labelTitleUID = cc.find("body/labelUID", this.node).getComponent(cc.Label);
        this.labelUID = cc.find("body/nodes/uidValue/label", this.node).getComponent(cc.Label);
        this.labelHash = cc.find("body/nodes/hashValue/label", this.node).getComponent(cc.Label);
        this.labelResult = cc.find("body/nodes/result/label", this.node).getComponent(cc.Label);

        this.labelKey = cc.find("body/nodes/hashKey/label", this.node).getComponent(cc.Label);

        this.btnCopyHashValue = cc.find("body/nodes/btnHashValueCopy", this.node);
        this.nodeLastName = cc.find("body/nodes/nodeLastGame", this.node);
        this.btnCopyKey = cc.find("body/nodes/btnCopyKey", this.node);
        this.btnOk = cc.find("body/nodes/nodeBottom/btnConfirm", this.node);
        this.btnCopyResult = cc.find("body/nodes/btnCopyResult", this.node);
        this.nodeCheckResultTip = cc.find("body/nodes/nodeBottom/labelResult", this.node);
        this.btnClose = cc.find("body/btnClose", this.node);
        this.bindEvent();
    }

    public show(hashValue: string, key: string) {
        this.labelTitleUID!.string = `UID:${env.user.userId}`;
        this.labelUID!.string = `${env.user.userId}`;

        this.labelHash!.string = hashValue;

        this.labelKey!.string = key;
        this.onViewResize();
    }

    public updateResult(result: string) {
        this.labelResult!.string = result || "";
        this.nodeCheckResultTip!.active = true;
    }

    public onDestroy(): void {
        cc.systemEvent.off("switch-orientitaion", this.onViewResize, this);
    }

    bindEvent() {
        cc.systemEvent.on("switch-orientitaion", this.onViewResize, this);

        this.btnCopyHashValue?.on("click", () => {
            gameHashCheckAlert.playClickBtnSound();
            // bwsdk.copy(this.labelHash?.string || "");
            gameToast.show(tcI18n.i18nLabel("copy_success"));
        });

        this.btnCopyKey?.on("click", () => {
            gameHashCheckAlert.playClickBtnSound();
            // bwsdk.copy(this.labelKey?.string || "");
            gameToast.show(tcI18n.i18nLabel("copy_success"));
        });

        this.btnCopyResult?.on("click", () => {
            gameHashCheckAlert.playClickBtnSound();
            // bwsdk.copy(this.labelResult?.string || "");
            gameToast.show(tcI18n.i18nLabel("copy_success"));
        });

        this.btnClose?.on("click", () => {
            gameHashCheckAlert.playClickBtnSound();
            gameHashCheckAlert.close();
        });
    }

    bindClickBtnOkEvent(callback: Function) {
        this.btnOk?.on("click", callback, this);
    }

    private onViewResize() {
        let bPortrait = gameHelper.bPortrait();
        this.labelTitleUID!.node.active = bPortrait;
        if (bPortrait) {
            this.btnOk?.parent.parent.setPosition(cc.Vec2.ZERO);
            this.nodeLastName?.setPosition(cc.v2(0, 163.678));
        } else {
            this.btnOk?.parent.parent.setPosition(cc.v2(0, 182));
            this.nodeLastName?.setPosition(cc.v2(0, 120));
        }
    }
}

export namespace gameHashCheckAlert {
    let nodeCache: cc.Prefab | undefined;
    let view: GameHashCheckPopup | undefined;
    let btnOkCallback: Function | undefined;
    let clickBtnSoundName: string;
    export function clear() {
        nodeCache = undefined;
    }
    export function show(hashValue: string, key: string, clickBtnSound: string, callback?: Function | undefined) {
        const nodeName = "hashCheckPopup";
        const showPopup = async () => {
            if (!nodeCache) {
                try {
                    gameLoadingDialog.show({ duration: 20 });
                    const prefab = await tcRes.load<cc.Prefab>("gameCommon", cc.Prefab, "prefab/hashCheckPopup");
                    gameLoadingDialog.close();
                    if (!prefab) {
                        return;
                    }

                    nodeCache = prefab;
                } catch (err: any) {
                    tcLog.error(`gameHashCheckAlert.show ,${err}`);
                    return;
                }
            }

            const node = cc.instantiate(nodeCache);
            if (!node) {
                return;
            }
            node.name = nodeName;
            node.setParent(config.uiNode.dialog);
            node.setPosition(cc.Vec3.ZERO);
            view = node.addComponent(GameHashCheckPopup);
            view.show(hashValue, key);
            view.bindClickBtnOkEvent(() => {
                playClickBtnSound();
                btnOkCallback && btnOkCallback();
            });
        };
        btnOkCallback = callback;

        if (hashValue === "" || key === "") {
            gameToast.show(tcI18n.i18nLabel("v2_game_rocketDice_hash_note"));
            return;
        }
        clickBtnSoundName = clickBtnSound || AudioClipName.CLICKBTN;
        showPopup();
    }

    export function updateResult(result: string) {
        view?.updateResult(result);
    }

    export function close() {
        view?.node.destroy();
        view = undefined;
    }

    export function playClickBtnSound() {
        uAudio.getInstance().playEffect(clickBtnSoundName);
    }
}
