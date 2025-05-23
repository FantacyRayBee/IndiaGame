// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { I18nComponent, tcI18n } from "./i18n";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nSprite extends cc.Component implements I18nComponent {
    private sprite!: cc.Sprite;

    @property
    private i18nKey: string = "";

    public set spriteName(value: string) {
        this.i18nKey = value;
    }

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);

        tcI18n.register(this);

        this.refresh();
    }

    onDestroy() {
        tcI18n.unregister(this);
    }

    async refresh() {
        if (!this.sprite) {
            return;
        }

        const spriteFrame = await tcI18n.i18nSprite(this.i18nKey);
        if (!spriteFrame || !this.sprite) {
            return;
        }

        this.sprite.spriteFrame = spriteFrame;
    }
}
