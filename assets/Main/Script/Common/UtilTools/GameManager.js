let GameManager = cc.Class({
    ctor: function() {
    //     this.gameConfig = [
    //         // PG类型游戏
    //         // { type: "PG", gameID: "incan-wonders", isVertical: true },
    //         // { type: "PG", gameID: "mr-treas-fort", isVertical: true },
    //         { type: "PG", gameID: "cash-mania", isVertical: true },
    //         // { type: "PG", gameID: "fortune-tiger", isVertical: true },
    //         // { type: "PG", gameID: "fortune-rabbit", isVertical: true },
    //         { type: "PG", gameID: "wings-iguazu", isVertical: true },
    //         { type: "PG", gameID: "fortune-ox", isVertical: true },
    //         { type: "PG", gameID: "fortune-mouse", isVertical: true },
    //         { type: "PG", gameID: "fortune-dragon", isVertical: true },
    //         { type: "PG", gameID: "pinata-wins", isVertical: true },
    //         // { type: "PG", gameID: "futebol-fever", isVertical: true },
    //         { type: "PG", gameID: "dragon-hatch", isVertical: true },
    //         { type: "PG", gameID: "dragon-hatch2", isVertical: true },
    //         { type: "PG", gameID: "speed-winner", isVertical: true },

    //         // JL类型游戏
    //         { type: "JL", gameID: "jili_FaFaFa", isVertical: true },
    //         { type: "JL", gameID: "jili_FortuneGems", isVertical: true },
    //         { type: "JL", gameID: "jili_FortuneGems2", isVertical: true },
    //         { type: "JL", gameID: "jili_FortuneGems3", isVertical: true },
    //         { type: "JL", gameID: "jili_PartyStar", isVertical: true },
    //         { type: "JL", gameID: "jili_super-rich", isVertical: true },
    //         { type: "JL", gameID: "jili_chargebuffalo", isVertical: true },
    //         { type: "JL", gameID: "jili_3potdragons", isVertical: true },
    //         { type: "JL", gameID: "jili_3devilfire2", isVertical: true },
    //         { type: "JL", gameID: "jili_chargebuffalo-ascent", isVertical: true },
    //         { type: "JL", gameID: "jili_3cointreasures", isVertical: true },
    //         { type: "JL", gameID: "jili_fortunepig", isVertical: true },
    //         { type: "JL", gameID: "jili_MasterTiger", isVertical: true },
    //         { type: "JL", gameID: "jili_goldenjoker", isVertical: true },
    //         { type: "JL", gameID: "jili_legacyofegypt", isVertical: true },
    //         { type: "JL", gameID: "jili_3luckypiggy", isVertical: true },

    //         // PP类型游戏
    //         { type: "PP", gameID: "pp_TigreSortudo", isVertical: true },
    //         { type: "PP", gameID: "pp_TouroSortudo", isVertical: true },
    //         { type: "PP", gameID: "pp_RatinhoSortudo", isVertical: true },
    //         { type: "PP", gameID: "pp_MiningRush", isVertical: true },
    //         { type: "PP", gameID: "pp_SantasXmasRush", isVertical: true },
    //         { type: "PP", gameID: "pp_GatesofOlympus1000", isVertical: true },
    //         { type: "PP", gameID: "pp_Moleionaire", isVertical: true },
    //         { type: "PP", gameID: "pp_CandyCorner", isVertical: true },
    //         { type: "PP", gameID: "pp_FangtasticFreespins", isVertical: true },
    //         { type: "PP", gameID: "pp_WisdomofAthena", isVertical: true },
    //         { type: "PP", gameID: "pp_MysteryMice", isVertical: true }
    //     ];
    // },

    this.gameConfig = [
            // PG类型游戏
            { type: "PG", gameID: "942", isVertical: true },
            { type: "PG", gameID: "943", isVertical: true },
            { type: "PG", gameID: "944", isVertical: true },
            { type: "PG", gameID: "945", isVertical: true },
            { type: "PG", gameID: "998", isVertical: true },
            { type: "PG", gameID: "8", isVertical: true },
            { type: "PG", gameID: "9", isVertical: true },
            { type: "PG", gameID: "10", isVertical: true },
            { type: "PG", gameID: "11", isVertical: true },
            { type: "PG", gameID: "12", isVertical: true },
            { type: "PG", gameID: "13", isVertical: true },
            { type: "PG", gameID: "14", isVertical: true },
            { type: "PG", gameID: "15", isVertical: true },
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
            { type: "PG", gameID: "352", isVertical: true },

            // JL类型游戏
            { type: "JILI", gameID: "1154", isVertical: true },
            { type: "JILI", gameID: "1076", isVertical: true },
            { type: "JILI", gameID: "1092", isVertical: true },
            { type: "JILI", gameID: "1093", isVertical: true },
            { type: "JILI", gameID: "1094", isVertical: true },
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
            { type: "JILI", gameID: "1113", isVertical: true },

            // PP类型游戏
            { type: "PP", gameID: "361", isVertical: true },
            { type: "PP", gameID: "362", isVertical: true },
            { type: "PP", gameID: "363", isVertical: true },
            { type: "PP", gameID: "365", isVertical: true },
            { type: "PP", gameID: "366", isVertical: true },
            { type: "PP", gameID: "368", isVertical: true },
            { type: "PP", gameID: "369", isVertical: true },
            { type: "PP", gameID: "370", isVertical: true },
            { type: "PP", gameID: "371", isVertical: true },
            { type: "PP", gameID: "410", isVertical: true },
            { type: "PP", gameID: "411", isVertical: true },
            { type: "PP", gameID: "412", isVertical: true },
            { type: "PP", gameID: "413", isVertical: true },
            { type: "PP", gameID: "414", isVertical: true },
            { type: "PP", gameID: "415", isVertical: true },
            { type: "PP", gameID: "417", isVertical: true },
            { type: "PP", gameID: "433", isVertical: true },
            { type: "PP", gameID: "446", isVertical: true },
            { type: "PP", gameID: "471", isVertical: true },
            { type: "PP", gameID: "472", isVertical: true },
            { type: "PP", gameID: "474", isVertical: true },
            { type: "PP", gameID: "477", isVertical: true },
            { type: "PP", gameID: "481", isVertical: true },
            { type: "PP", gameID: "510", isVertical: true },
            { type: "PP", gameID: "519", isVertical: true },
            { type: "PP", gameID: "846", isVertical: true },
            { type: "PP", gameID: "847", isVertical: true },
            { type: "PP", gameID: "861", isVertical: true },
            { type: "PP", gameID: "862", isVertical: true },
            { type: "PP", gameID: "899", isVertical: true },
            { type: "PP", gameID: "900", isVertical: true },
            { type: "PP", gameID: "901", isVertical: true },
            { type: "PP", gameID: "999", isVertical: true },

            // quente
            { type: "quente", gameID: "943", isVertical: true },
            { type: "quente", gameID: "944", isVertical: true },
            { type: "quente", gameID: "945", isVertical: true },
            { type: "quente", gameID: "998", isVertical: true },
            { type: "quente", gameID: "900", isVertical: true },
            { type: "quente", gameID: "1154", isVertical: true },
            { type: "quente", gameID: "861", isVertical: true },
            { type: "quente", gameID: "10", isVertical: true },
            { type: "quente", gameID: "13", isVertical: true },
            { type: "quente", gameID: "14", isVertical: true },
            { type: "quente", gameID: "8", isVertical: true },
            { type: "quente", gameID: "1076", isVertical: true },
            { type: "quente", gameID: "1077", isVertical: true },
            { type: "quente", gameID: "1143", isVertical: true },
            { type: "quente", gameID: "1144", isVertical: true },
        ];
    },

    getGameConfig: function() {
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