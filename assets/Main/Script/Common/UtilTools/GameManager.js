let GameManager = cc.Class({
    ctor: function () {
        this.gameConfig = [
            // PG类型游戏
            { type: "PG", gameID: "8", isVertical: true },
            { type: "PG", gameID: "9", isVertical: true },
            { type: "PG", gameID: "10", isVertical: true },
            { type: "PG", gameID: "11", isVertical: true },
            { type: "PG", gameID: "12", isVertical: true },
            { type: "PG", gameID: "13", isVertical: true },
            { type: "PG", gameID: "14", isVertical: true },
            { type: "PG", gameID: "47", isVertical: true },
            { type: "PG", gameID: "21", isVertical: true },
            { type: "PG", gameID: "22", isVertical: true },
            { type: "PG", gameID: "23", isVertical: true },
            { type: "PG", gameID: "24", isVertical: true },
            { type: "PG", gameID: "25", isVertical: true },
            { type: "PG", gameID: "32", isVertical: true },
            { type: "PG", gameID: "33", isVertical: true },
            { type: "PG", gameID: "34", isVertical: true },
            { type: "PG", gameID: "35", isVertical: true },
            { type: "PG", gameID: "36", isVertical: true },
            { type: "PG", gameID: "37", isVertical: true },
            { type: "PG", gameID: "38", isVertical: true },
            { type: "PG", gameID: "39", isVertical: true },
            { type: "PG", gameID: "40", isVertical: true },
            { type: "PG", gameID: "41", isVertical: true },
            { type: "PG", gameID: "42", isVertical: true },
            { type: "PG", gameID: "43", isVertical: true },
            { type: "PG", gameID: "44", isVertical: true },
            { type: "PG", gameID: "45", isVertical: true },
            { type: "PG", gameID: "46", isVertical: true },
            { type: "PG", gameID: "48", isVertical: true },

            // JL类型游戏
            { type: "JILI", gameID: "1154", isVertical: true },
            { type: "JILI", gameID: "1076", isVertical: true },
            { type: "JILI", gameID: "1092", isVertical: true },
            { type: "JILI", gameID: "1090", isVertical: true },
            { type: "JILI", gameID: "1095", isVertical: true },
            { type: "JILI", gameID: "1096", isVertical: true },
            { type: "JILI", gameID: "1097", isVertical: true },
            { type: "JILI", gameID: "1098", isVertical: true },
            { type: "JILI", gameID: "1099", isVertical: true },
            { type: "JILI", gameID: "1100", isVertical: true },
            { type: "JILI", gameID: "1101", isVertical: true },
            { type: "JILI", gameID: "1102", isVertical: true },
            { type: "JILI", gameID: "1103", isVertical: true },
            { type: "JILI", gameID: "1104", isVertical: true },
            { type: "JILI", gameID: "1105", isVertical: true },
            { type: "JILI", gameID: "1106", isVertical: true },
            { type: "JILI", gameID: "1107", isVertical: true },
            { type: "JILI", gameID: "1108", isVertical: true },
            { type: "JILI", gameID: "1109", isVertical: true },
            { type: "JILI", gameID: "1110", isVertical: true },
            { type: "JILI", gameID: "1111", isVertical: true },
            { type: "JILI", gameID: "1112", isVertical: true },
            { type: "JILI", gameID: "1113", isVertical: false },

            // PP类型游戏
            { type: "PP", gameID: "361", isVertical: false },
            { type: "PP", gameID: "362", isVertical: false },
            { type: "PP", gameID: "363", isVertical: false },
            { type: "PP", gameID: "365", isVertical: false },
            { type: "PP", gameID: "366", isVertical: false },
            { type: "PP", gameID: "368", isVertical: false },
            { type: "PP", gameID: "369", isVertical: false },
            { type: "PP", gameID: "370", isVertical: false },
            { type: "PP", gameID: "371", isVertical: false },
            { type: "PP", gameID: "377", isVertical: false },
            { type: "PP", gameID: "379", isVertical: false },
            { type: "PP", gameID: "414", isVertical: false },
            { type: "PP", gameID: "415", isVertical: false },
            { type: "PP", gameID: "417", isVertical: false },
            { type: "PP", gameID: "433", isVertical: false },
            { type: "PP", gameID: "381", isVertical: false },
            { type: "PP", gameID: "471", isVertical: false },
            { type: "PP", gameID: "472", isVertical: false },
            { type: "PP", gameID: "474", isVertical: false },
            { type: "PP", gameID: "481", isVertical: false },
            { type: "PP", gameID: "519", isVertical: false },
            { type: "PP", gameID: "385", isVertical: false },
            { type: "PP", gameID: "861", isVertical: true },
            { type: "PP", gameID: "862", isVertical: true },
            { type: "PP", gameID: "899", isVertical: true },
            { type: "PP", gameID: "900", isVertical: true },
            { type: "PP", gameID: "901", isVertical: true },
            { type: "PP", gameID: "999", isVertical: true },

            // quente
            { type: "quente", gameID: "39", isVertical: true },
            { type: "quente", gameID: "1154", isVertical: true },
            { type: "quente", gameID: "57", isVertical: true },
            { type: "quente", gameID: "10", isVertical: true },
            { type: "quente", gameID: "13", isVertical: true },
            { type: "quente", gameID: "14", isVertical: true },
            { type: "quente", gameID: "8", isVertical: true },
            { type: "quente", gameID: "1076", isVertical: true },
            { type: "quente", gameID: "1077", isVertical: true },
            { type: "quente", gameID: "1143", isVertical: true },
            { type: "quente", gameID: "1144", isVertical: true },
        ];

        this.mainGameConfig = [
            { tog: "tog1", type: "all", games: GlobalCfg.USER_DATAS.games || [] },
            { tog: "tog2", type: "casino", games: ["minilonghu", "minijhandimunda", "miniandar", "minicricket", "miniteenpattibaccarat", "minizoo", "miniseven", "minisaima", "minimultiteenpatti",] },
            { tog: "tog3", type: "skills", games: ["miniteenpatti", "minirummy"] },
            { tog: "tog4", type: "Slots", games: ["minizeus", "minicat", "slots", "minishuiguo", "minibull", "miniindia", "minivampire", "minimaya", "minibenzbmw", "miniclown"] },
            { tog: "tog5", type: "casual", games: ["miniaviator", "minichickenroad", "minirocket"] },
            { tog: "tog6", type: "like", games: GlobalCfg.USER_DATAS.game_like || [] },
        ];
    },



    getGameConfig: function () {
        let tmpCfg = {};
        for (let item of this.gameConfig) {
            const type = item.type;
            if (!tmpCfg[type]) {
                tmpCfg[type] = []; // 如果是新的 type，初始化一个空数组
            }
            tmpCfg[type].push(item); // 把当前项加入对应 type 的数组
        }
        // // 2. 创建 'quente' 类型，包含每个原始类型的前4个游戏
        // tmpCfg['quente'] = [];
        // // 遍历所有原始类型（PG、JL、PP）
        // for (const type in tmpCfg) {
        //     // 跳过刚添加的 'quente' 类型本身
        //     if (type === 'quente') continue;
        //     // 取当前类型的前4个游戏（如果不足4个则全部取）
        //     const hotGames = tmpCfg[type].slice(0, 4);
        //     // 添加到 'quente' 数组
        //     tmpCfg['quente'].push(...hotGames);
        // }
        return tmpCfg;
    },

    getLobbyGameConfig: function (toggleName) {
        let games = {};
        for (let item of this.mainGameConfig) {
            const type = item.tog;
            if (type == toggleName) {
                games = item.games;
                break;
            }
        }
        return games;
    },

    statics: {
        _instance: null
    },

});

GameManager.getInstance = () => {
    if (!GameManager._instance) {
        GameManager._instance = new GameManager();
    };
    return GameManager._instance;
};

module.exports = GameManager;
window.GameManager = GameManager;