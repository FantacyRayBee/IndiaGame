let GameManager = cc.Class({
    ctor: function() {
        this.gameConfig = [
            // PG类型游戏
            { type: "PG", gameID: "incan-wonders", isVertical: true },
            { type: "PG", gameID: "mr-treas-fort", isVertical: true },
            { type: "PG", gameID: "cash-mania", isVertical: true },
            { type: "PG", gameID: "fortune-tiger", isVertical: true },
            { type: "PG", gameID: "fortune-rabbit", isVertical: true },
            { type: "PG", gameID: "wings-iguazu", isVertical: true },
            { type: "PG", gameID: "fortune-ox", isVertical: true },
            { type: "PG", gameID: "fortune-mouse", isVertical: true },
            { type: "PG", gameID: "fortune-dragon", isVertical: true },
            { type: "PG", gameID: "pinata-wins", isVertical: true },
            { type: "PG", gameID: "futebol-fever", isVertical: true },
            { type: "PG", gameID: "dragon-hatch", isVertical: true },
            { type: "PG", gameID: "dragon-hatch2", isVertical: true },
            { type: "PG", gameID: "speed-winner", isVertical: true },

            // JL类型游戏
            { type: "JL", gameID: "jili_FaFaFa", isVertical: true },
            { type: "JL", gameID: "jili_FortuneGems", isVertical: true },
            { type: "JL", gameID: "jili_FortuneGems2", isVertical: true },
            { type: "JL", gameID: "jili_FortuneGems3", isVertical: true },
            { type: "JL", gameID: "jili_PartyStar", isVertical: true },
            { type: "JL", gameID: "jili_super-rich", isVertical: true },
            { type: "JL", gameID: "jili_chargebuffalo", isVertical: true },
            { type: "JL", gameID: "jili_3potdragons", isVertical: true },
            { type: "JL", gameID: "jili_3devilfire2", isVertical: true },
            { type: "JL", gameID: "jili_chargebuffalo-ascent", isVertical: true },
            { type: "JL", gameID: "jili_3cointreasures", isVertical: true },
            { type: "JL", gameID: "jili_fortunepig", isVertical: true },
            { type: "JL", gameID: "jili_MasterTiger", isVertical: true },
            { type: "JL", gameID: "jili_goldenjoker", isVertical: true },
            { type: "JL", gameID: "jili_legacyofegypt", isVertical: true },
            { type: "JL", gameID: "jili_3luckypiggy", isVertical: true },

            // PP类型游戏
            { type: "PP", gameID: "pp_TigreSortudo", isVertical: true },
            { type: "PP", gameID: "pp_TouroSortudo", isVertical: true },
            { type: "PP", gameID: "pp_RatinhoSortudo", isVertical: true },
            { type: "PP", gameID: "pp_MiningRush", isVertical: true },
            { type: "PP", gameID: "pp_SantasXmasRush", isVertical: true },
            { type: "PP", gameID: "pp_GatesofOlympus1000", isVertical: true },
            { type: "PP", gameID: "pp_Moleionaire", isVertical: true },
            { type: "PP", gameID: "pp_CandyCorner", isVertical: true },
            { type: "PP", gameID: "pp_FangtasticFreespins", isVertical: true },
            { type: "PP", gameID: "pp_WisdomofAthena", isVertical: true },
            { type: "PP", gameID: "pp_MysteryMice", isVertical: true }
        ];
    },

    statics: {
        _instance: null
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
        return tmpCfg;
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