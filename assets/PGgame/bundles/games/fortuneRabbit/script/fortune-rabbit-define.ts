export namespace FortuneRabbitDefine {
    export const soundNames = {
        winlines: "winlines",
        win2: "win2",
        win1: "win1",
        wild_show: "wild_show",
        wallet_counting_above: "wallet_counting_above",
        spin: "spin",
        slider_effect: "slider_effect",
        runscore: "runscore",
        reel_stop1: "reel_stop1",
        reel_stop: "reel_stop",
        reel_bon: "reel_bon",
        reel: "reel",
        rabbit_wish: "rabbit_wish",
        rabbit_win5: "rabbit_win5",
        rabbit_win4: "rabbit_win4",
        rabbit_win3: "rabbit_win3",
        rabbit_win2: "rabbit_win2",
        rabbit_win1: "rabbit_win1",
        rabbit_runscore: "rabbit_runscore",
        rabbit_bon: "rabbit_bon",
        click_element: "click_element",
        click: "click",
        bonus_showfly: "bonus_showfly",
        bonus_drop10: "bonus_drop10",
        bonus_drop9: "bonus_drop9",
        bonus_drop8: "bonus_drop8",
        bonus_drop7: "bonus_drop7",
        bonus_drop6: "bonus_drop6",
        bonus_drop5: "bonus_drop5",
        bonus_drop4: "bonus_drop4",
        bonus_drop3: "bonus_drop3",
        bonus_drop2: "bonus_drop2",
        bonus_drop1: "bonus_drop1",
        bon_win: "bon_win",
        bon_music: "bon_music",
        bg_music: "bg_music",
        bg_bigwin_end: "bg_bigwin_end",
        bg_bigwin_cheer: "bg_bigwin_cheer",
        bg_bigwin: "bg_bigwin",
        bonus_freeend: "bonus_freeend",
        bonus5_jackpot: "5bonus_jackpot",
        bon_xiu: "bon_xiu"

    };

    export const animUrl = {
        "51": "artwork/spine/wild/rolemin",
        "71": "artwork/spine/free/free",
        "81": "artwork/spine/bat/bat",
        "82": "artwork/spine/777/777",
        "83": "artwork/spine/pp/pumpkin",
    };

    export const winEffect10 = [3, 5]; //bigwin为10
    export const winEffect20 = [5, 10]; //bigwin为20

    export const itemScore = { 51: 200, 82: 100, 81: 50, 4: 10, 3: 5, 2: 3, 1: 2 };
    //中奖线配置
    export const PayLines: Map<string, number[]> = new Map<string, number[]>();

    export enum ANIM {
        FREE,
        PUMPKIN,
        WIN,
        ROLE,
        BIGWIN,
        SUPERWIN,
    }

    /* 滚轴数据 */
    export const cellsMatrix = {
        normal: new Array<Array<number>>(),
        free: new Array<Array<number>>(),
    };

    /** 首屏矩阵 */
    export const firstScreen = [
        [
            { itemId: 82, value: 0 },
            { itemId: 82, value: 0 },
            { itemId: 51, value: 0 },
            { itemId: 1, value: 0 },
        ],
        [
            { itemId: 9, value: 50000 },
            { itemId: 9, value: 2000 },
            { itemId: 9, value: 500 },
            { itemId: 9, value: 50 },
        ],
        [
            { itemId: 82, value: 0 },
            { itemId: 82, value: 0 },
            { itemId: 51, value: 0 },
            { itemId: 1, value: 0 },
        ],
    ];

    export const events = {
        FortuneRabbitCellEndRoll: "FortuneRabbitCellEndRoll",
        cellStartRoll: "cellStartRoll",
        endRoll: "endRoll",
        showItemTip: "showItemTip",
        hideItem: "hideItem",
        wildShow: "wildShow",
        stopRoll: "stopRoll",
        updateWinCount: "updateWinCount",
        updateBet: "updateBet",
    };
}
