// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { I18nComponent, tcI18n } from "./i18n";

const { ccclass, property } = cc._decorator;

@ccclass
export class I18nRichText extends cc.Component implements I18nComponent {
    private label!: cc.RichText;

    @property
    private i18nKey: string = "";
    @property
    private i18nParams: string[] = [];

    protected onLoad(): void {
        this.label = this.getComponent(cc.RichText);

        tcI18n.register(this);

        this.refresh();
    }

    protected onDestroy(): void {
        tcI18n.unregister(this);
    }

    updateParams(params: string[]): void {
        this.i18nParams = params;
        this.refresh();
    }

    refresh(): void {
        if (this.i18nKey.length === 0) {
            return;
        }

        const str = tcI18n.i18nLabel(this.i18nKey, this.i18nParams);
        this.label.string = str;
    }
}
