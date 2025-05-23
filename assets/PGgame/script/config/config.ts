// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { env } from "../app/env";
import { uAudio } from "../framework/audio/audio";
import { tcLog } from "../framework/log/log";
import { tcStorage } from "../framework/storage/storage";
import { cmd } from "./cmd";

/**
 * UI 节点
 */
interface UINode {
    bg: cc.Node;
    scene: cc.Node;
    fixed: cc.Node;
    dialog: cc.Node;
    tips: cc.Node;
    loading: cc.Node;
    uihistory: cc.Node;
}

export enum LogLevel {
    Silent = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4,
}

/**
 * 配置信息
 */
export const config = {
    /**
     * API 接口
     */
    apiUrl: "", // http://192.168.1.110:29104
    /**
     * 日志等级
     * [1]error, [2]warn, [3]info, [4]debug
     */
    logLevel: LogLevel.Debug,
    /**
     * 网关地址
     */
    gateways: [] as Array<string>,
    /**
     * ui 节点
     */
    uiNode: {} as UINode,
    /**
     * 短信间隔
     */
    smsRequestInterval: 2 * 60 * 1000,

    devTest: true,
    // devTest: false,
};

export const gameConfig = {
    //获取游戏列表id对应游戏的bundlesName
    GAMEID_2_BUNDLE_NAMES: {
        [cmd.SERVER_TYPE_CRASH_FULL]: "crash",
        [cmd.SERVER_TYPE_SLOTHALLOWEEN]: "halloween",
        [cmd.SERVER_TYPE_MISSCHERRYFRUITS]: "missCherryFruits",
        [cmd.SERVER_TYPE_SLOTLUCKYDAMA]: "luckyDama",
        [cmd.SERVER_TYPE_WILD_CASH]: "wildcash",
        [cmd.SERVER_TYPE_SLOTSOCCERMANIA]: "soccerMania",
        [cmd.SERVER_TYPE_MECHANICAL_ORANGE]: "mechanicalOrange",
        [cmd.SERVER_TYPE_GIFT_RUSH]: "giftRush",
        [cmd.SERVER_TYPE_FORTUNE_TIGER]: "fortuneTiger",
        [cmd.SERVER_TYPE_FORTUNE_OX]: "fortuneOx",
        [cmd.SERVER_TYPE_ROCKET_DICE]: "rocketDice",
        [cmd.SERVER_TYPE_FORTUNE_RABBIT]: "fortuneRabbit",
    },

    GAMEID_2_GAME_NAME: {

    },
    //获取gameID对应的游戏type
    // GAMEID_2_CMDTYPE: {
    //     67: cmd.SERVER_TYPE_CRASH_FULL,
    //     68: cmd.SERVER_TYPE_SLOTHALLOWEEN,
    //     72: cmd.SERVER_TYPE_MISSCHERRYFRUITS,
    //     73: cmd.SERVER_TYPE_SLOTLUCKYDAMA,
    //     70: cmd.SERVER_TYPE_WILD_CASH,
    //     74: cmd.SERVER_TYPE_SLOTSOCCERMANIA,
    //     75: cmd.SERVER_TYPE_MECHANICAL_ORANGE,
    // },
    //不填：0 auto； orientation == 1 横屏；orientation == 2 竖屏,
    GAMEID_GAME_ORIENTATION: {
        [cmd.SERVER_TYPE_FORTUNE_TIGER]: 2,
        [cmd.SERVER_TYPE_FORTUNE_OX]: 2,
        [cmd.SERVER_TYPE_FORTUNE_RABBIT]: 2,
    },
    //不填：0 不加载公用bundle；1 SlotGameRes； 2 PGGameRes；
    GAMEID_GAME_BUNDLE: {
        [cmd.SERVER_TYPE_CRASH_FULL]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_SLOTHALLOWEEN]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_MISSCHERRYFRUITS]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_SLOTLUCKYDAMA]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_WILD_CASH]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_SLOTSOCCERMANIA]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_MECHANICAL_ORANGE]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_GIFT_RUSH]: ["SlotGameRes", "common-v2"],
        [cmd.SERVER_TYPE_FORTUNE_TIGER]: ["PGGameRes"],
        [cmd.SERVER_TYPE_FORTUNE_OX]: ["PGGameRes"],
        [cmd.SERVER_TYPE_FORTUNE_RABBIT]: ["gameCommon", "PGGameRes"],
        [cmd.SERVER_TYPE_ROCKET_DICE]: ["SlotGameRes", "common-v2"],
    },
    // case 1: await tcRes.loadBundle("SlotGameRes");break;
    // case 2: await tcRes.loadBundle("PGGameRes"); break;
};

//部分游戏加载界面”确定“按钮坐标配置
export const gameLoadingBtnOkPositon = {
    [cmd.SERVER_TYPE_MECHANICAL_ORANGE]: [
        [7, -193],
        [7, -193],
    ],
    [cmd.SERVER_TYPE_SLOTLUCKYDAMA]: [
        [0, -570],
        [0, -300],
    ],
    [cmd.SERVER_TYPE_FORTUNE_TIGER]: [
        [0, -570],
        [0, -570],
    ],
    [cmd.SERVER_TYPE_FORTUNE_OX]: [
        [0, -570],
        [0, -570],
    ],
    [cmd.SERVER_TYPE_FORTUNE_RABBIT]: [
        [0, -570],
        [0, -570],
    ],
};

export namespace gameHelper {
    export function getBundleName(gameId: number) {
        const bundleName = gameConfig.GAMEID_2_BUNDLE_NAMES[gameId as keyof typeof gameConfig.GAMEID_2_BUNDLE_NAMES];
        if (env.device.platform === env.PlatformType.Native) {
            return `${jsb.fileUtils.getWritablePath()}remote-assets/assets/${bundleName}`;
        }
        return bundleName;
    }

    export function bPGGame(gameId: number) {
        return gameId == cmd.SERVER_TYPE_FORTUNE_OX || gameId == cmd.SERVER_TYPE_FORTUNE_TIGER || gameId == cmd.SERVER_TYPE_FORTUNE_RABBIT || gameId == cmd.SERVER_TYPE_FORTUNE_MOUSE;
    }

    export function stopAllEffects(bgMusic?: string) {
        uAudio.getInstance().stopAllEffect();
    }
    //设置音效状态
    export function changeSoundStatus(bgMusic?: string) {
        let soundSwitch = tcStorage.readAny(tcStorage.Keys.SoundSwitch) ?? "on";
        let bSoundOpen = soundSwitch === "off";
        const volume = bSoundOpen ? 1 : 0;
        tcStorage.save(tcStorage.Keys.SoundSwitch, bSoundOpen ? "on" : "off");
        uAudio.getInstance().setMusicVolume(volume);
        localStorage.setItem(tcStorage.Keys.musicVolume, `${volume}`);
        uAudio.getInstance().setEffectVolume(volume);
        localStorage.setItem(tcStorage.Keys.effectVolume, `${volume}`);
        return bSoundOpen;
    }

    /**
     *当前是否是竖版
     * @returns
     */
    export function bPortrait() {
        let viewSize = cc.view.getFrameSize();
        tcLog.info("-------gameHelper.bPortrait:viewResize", viewSize);
        return viewSize.width < viewSize.height;
    }
}
