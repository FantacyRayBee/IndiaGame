// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../log/log";
import { tcRes } from "../res/res";

export interface I18nComponent {
    refresh(): void;
}

export namespace tcI18n {
    const supportLanguages = ["en", "pt"] as const;
    type languageType = typeof supportLanguages;
    /**
     * 支持的语言
     * @link https://zh.wikipedia.org/wiki/ISO_639-1
     */
    export type Language = languageType[number];
    /**
     * 默认语言
     */
    export const defaultLanguage: Language = "pt";

    export function isOfType(value: string): value is Language {
        return supportLanguages.includes(value as Language);
    }

    export const switchLanguageEvent = "switch-language";

    export let curLanguage: Language;
    const components: I18nComponent[] = [];
    let lableRes: { [key: string]: string } = {};

    /**
     * 注册多语言组件
     * @param c 多语言组件
     */
    export function register(c: I18nComponent) {
        const index = components.indexOf(c);
        if (index !== -1) {
            return;
        }

        components.push(c);
    }

    /**
     * 反注册多语言组件
     * @param c 多语言组件
     */
    export function unregister(c: I18nComponent) {
        const index = components.indexOf(c);
        if (index === -1) {
            return;
        }

        components.splice(index, 1);
    }

    /**
     * 切换多语言
     * @param lang 多语言类型
     */
    export async function switchLanguage(lang: Language) {
        if (curLanguage === lang) {
            return;
        }

        curLanguage = lang;
        await reloadLabelRes();
        components.forEach((cp) => cp.refresh());
        cc.systemEvent.emit(switchLanguageEvent, curLanguage);
    }

    async function reloadLabelRes() {
        try {
            // tcLog.log(`try reloadLabelRes: ${curLanguage}`);
            const data = await tcRes.load(curLanguage, cc.JsonAsset, `labels`);
            lableRes = data.json as {};
        } catch (err: any) {
            tcLog.log(`load i18n label res: ${err.message}`);
        }
    }

    /**
     * 获取多语言文字
     * @param key 多语言Key
     * @param params 参数
     * @returns 多语言的Value
     */
    export function i18nLabel(key: string, params?: string[]): string {
        if (!params || params.length == 0) {
            return lableRes[key] ?? "";
        }

        let value = lableRes[key];
        if (!value || value.length === 0) {
            return "";
        }

        for (let i = 0; i < params.length; i++) {
            const reg = new RegExp(`#${i}`);
            value = value.replace(reg, params[i]);
        }

        return value;
    }

    /**
     * 获取多语言图片
     * @param key 多语言 key
     * @returns 多语言的图片
     */
    export async function i18nSprite(key: string) {
        try {
            const sf = await tcRes.load(curLanguage, cc.SpriteFrame, `artwork/${key}`);
            return sf;
        } catch (err: any) {
            tcLog.error(`load i18n sprite res: ${curLanguage} artwork/${key}`);
        }
    }

    /**
     * @method 根据返回字符串选语言
     */
    // export function getLanguageType(language: string) {
    //     // 设置多语言
    //     let LanguageType = "";
    //     // if (language == "en") {
    //     //     return (LanguageType = "en-US");
    //     // } else {
    //     return (LanguageType = "pt-BR");
    //     ``;
    //     // }
    // }
}
