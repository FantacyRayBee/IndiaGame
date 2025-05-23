import { MoneyUtil } from "./MoneyUtils";


export const SCORE_MULTIPLE = 10000; // 金币放大几倍


export class SharedConfig {
    static THEME_COLOR: cc.Color

    static ScoreFormat(score: number) {
        return MoneyUtil.Format(score / SCORE_MULTIPLE)
    }

    // 设置主题颜色
    static SetThemeColor(color: cc.Color) {
        SharedConfig.THEME_COLOR = color;
        Object.freeze(SharedConfig.THEME_COLOR)
    }
}

window["SharedConfig"] = SharedConfig;