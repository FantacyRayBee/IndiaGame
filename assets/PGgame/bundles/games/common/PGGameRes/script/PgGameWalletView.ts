// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { env } from "../../../../../script/app/env";
import { AudioClipName, uAudio } from "../../../../../script/framework/audio/audio";
import { currency } from "../../../../../script/pkg/currency";

/**
 * PG  slot游戏钱包
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PgGameWalletView extends cc.Component {
    private btnClose: cc.Node | undefined;
    private labelBonus: cc.Label | undefined;
    private body: cc.Node | undefined;
    private bodyWidget: cc.Widget | undefined;
    private btnOutClose: cc.Node | undefined;

    onLoad(): void {
        this.btnClose = cc.find("body/btnClose", this.node);
        this.btnOutClose = cc.find("btnOutClose", this.node)
        this.body = cc.find("body", this.node);
        this.labelBonus = cc.find("body/wallet/label", this.node).getComponent(cc.Label);
        this.bodyWidget = this.body?.getComponent(cc.Widget);

        this.btnClose.on("click", () => {
            uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
            cc.tween(this.body)
                .to(0.3, { position: cc.v3(0, -685, 0) })
                .call(() => {
                    this.node.active = false;
                })
                .start();
        });
        this.btnOutClose.on("click", () => {
            uAudio.getInstance().playEffect(AudioClipName.CLICKBTN);
            cc.tween(this.body)
                .to(0.3, { position: cc.v3(0, -685, 0) })
                .call(() => {
                    this.node.active = false;
                })
                .start();
        });
    }

    public show() {
        this.node.active = true;
        this.labelBonus && (this.labelBonus.string = `${currency.formatWithSymbol(env.curGameData.balance)}`);
        cc.tween(this.body)
            .set({ position: cc.v3(0, -685, 0) })
            .to(0.3, { position: cc.v3(0, 0, 0) })
            .start();
    }
}
