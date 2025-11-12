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
            { type: "PG", gameID: "1879752_Fortune_Snake-pg", isVertical: true },
            { type: "PG", gameID: "130_Lucky_Piggy", isVertical: true },
            { type: "PG", gameID: "1903012_Grimms_Bounty_Hansel_Gretel", isVertical: true },
            { type: "PG", gameID: "98_Fortune_Ox", isVertical: true },
            { type: "PG", gameID: "1543462_Fortune_Rabbit", isVertical: true },
            { type: "PG", gameID: "68_Fortune_Mouse", isVertical: true },
            { type: "PG", gameID: "54_Captain_s_Bounty", isVertical: true },
            { type: "PG", gameID: "1695365_Fortune_Dragon", isVertical: true },
            { type: "PG", gameID: "1702123_Geisha_s_Revenge", isVertical: true },
            { type: "PG", gameID: "1747549_Wings_of_lguazu", isVertical: true },
            { type: "PG", gameID: "1755623_Museum_Mystery", isVertical: true },
            { type: "PG", gameID: "1760238-Yakuza_Honor", isVertical: true },
            { type: "PG", gameID: "1778752_Futebol_Fever", isVertical: true },
            { type: "PG", gameID: "1804577_Graffiti_Rush", isVertical: true },
            { type: "PG", gameID: "1815268_Oishi_Delights", isVertical: true },
            { type: "PG", gameID: "1865521_Dead_Man_s_Riches", isVertical: true },
            { type: "PG", gameID: "126_Fortune_Tiger", isVertical: true },
            { type: "PG", gameID: "121_Destiny_of_Sun_&_Moon", isVertical: true },
            { type: "PG", gameID: "1473388_Cruise_Royale", isVertical: true },
            { type: "PG", gameID: "1799745_Mr.Treasure_s_Fortune ", isVertical: true },
            { type: "PG", gameID: "1_Honey_Trap_of_Diao_Chan", isVertical: true },

            // JL类型游戏
            { type: "JL", gameID: "10193_Devil_Fire", isVertical: true },
            { type: "JL", gameID: "10045_Golden_Bank", isVertical: true },
            { type: "JL", gameID: "10016-Jungle_King", isVertical: true },
            { type: "JL", gameID: "10051-Money_Coming", isVertical: true },
            { type: "JL", gameID: "10049_Super_Ace", isVertical: true },
            { type: "JL", gameID: "10183_Golden_Joker", isVertical: true },
            { type: "JL", gameID: "10047_Charge_Buffalo", isVertical: true },
            { type: "JL", gameID: "10027_SevenSevenSeven", isVertical: true },
            { type: "JL", gameID: "10040_Crazy_FaFaFa", isVertical: true },
            { type: "JL", gameID: "10036_Bao_boon_chin", isVertical: true },
            { type: "JL", gameID: "10002_Chin_Shi_Huang", isVertical: true },
            { type: "JL", gameID: "10004_God_Of_Martial", isVertical: true },
            { type: "JL", gameID: "10030_Bubble_Beauty", isVertical: true },
            { type: "JL", gameID: "10077_Boxing_King", isVertical: true },
            { type: "JL", gameID: "10040_Crazy_FaFaFa", isVertical: true },
            { type: "JL", gameID: "10085_Pharaoh_Treasure", isVertical: true },
            { type: "JL", gameID: "10100_Super_Rich_JILI", isVertical: true },
            { type: "JL", gameID: "10103_Golden_Empire", isVertical: true },
            { type: "JL", gameID: "10108_Magic_Lamp", isVertical: true },
            { type: "JL", gameID: "10115_Agent_Ace", isVertical: true },
            { type: "JL", gameID: "10126_Bone_Fortune", isVertical: true },
            { type: "JL", gameID: "10176_Master_Tiger", isVertical: true },

            // PP类型游戏
            { type: "PP", gameID: "20014_Joker_s_Jewels", isVertical: true },
            { type: "PP", gameID: "20001_Gates_of_Olympus", isVertical: true },
            { type: "PP", gameID: "20111_Buffalo_King_Megaways", isVertical: true },
            { type: "PP", gameID: "20002_Starlight_Princess_Pachi", isVertical: true },
            { type: "PP", gameID: "20005_Sweet_Bonanza_100", isVertical: true },
            { type: "PP", gameID: "20006_Revenge_of_Loki_Megaways", isVertical: true },
            { type: "PP", gameID: "20007_Wukong_Rush", isVertical: true },
            { type: "PP", gameID: "20008_Sugar_Rush", isVertical: true },
            { type: "PP", gameID: "20010_Power_of_Ninja", isVertical: true },
            { type: "PP", gameID: "20015_Starlight_Princess", isVertical: true },
            { type: "PP", gameID: "20018_Angel_vs_Sinner-png", isVertical: true },
            { type: "PP", gameID: "20019_Fire_Portals", isVertical: true },
            { type: "PP", gameID: "20020_Big_Bass_Splash", isVertical: true },
            { type: "PP", gameID: "20021_Mystery_Mice", isVertical: true },
            { type: "PP", gameID: "20023_The_Dog_House_Png", isVertical: true },
            { type: "PP", gameID: "20026-Spirit_of_Adventure", isVertical: true },
            { type: "PP", gameID: "20035_Big_Bass_Halloween_2", isVertical: true },
            { type: "PP", gameID: "20039_Big_Bass_Halloween", isVertical: true },
            { type: "PP", gameID: "20040_Mahjong_Wins_3_-_Black_Scatter", isVertical: true },
            { type: "PP", gameID: "20041_Vampy_Party", isVertical: true },
            { type: "PP", gameID: "20042_Wisdom_Of_Athena_1000", isVertical: true },
            { type: "PP", gameID: "20051_8_Golden_Dragon_Challenge", isVertical: true },
            { type: "PP", gameID: "20056_Rainbow_Reels", isVertical: true },
            { type: "PP", gameID: "20065_Wisdom_of_Athena", isVertical: true },
            { type: "PP", gameID: "20098_Santa_s_Wonderland", isVertical: true },
            { type: "PP", gameID: "20114_Ratinho_Sortudo", isVertical: true },
            { type: "PP", gameID: "20137_TouroSortudo", isVertical: true },
            { type: "PP", gameID: "20156_Wolf_Gold_4_Pack", isVertical: true },
            { type: "PP", gameID: "20173_Starlight_Wins", isVertical: true },
            { type: "PP", gameID: "20179_Lucky_Dog", isVertical: true },
            { type: "PP", gameID: "20182_Lucky_Mouse", isVertical: true },


            // quente
            { type: "quente", gameID: "20014_Joker_s_Jewels", isVertical: true },
            { type: "quente", gameID: "20001_Gates_of_Olympus", isVertical: true },
            { type: "quente", gameID: "20111_Buffalo_King_Megaways", isVertical: true },
            { type: "quente", gameID: "20002_Starlight_Princess_Pachi", isVertical: true },
            { type: "quente", gameID: "1879752_Fortune_Snake-pg", isVertical: true },
            { type: "quente", gameID: "130_Lucky_Piggy", isVertical: true },
            { type: "quente", gameID: "1903012_Grimms_Bounty_Hansel_Gretel", isVertical: true },
            { type: "quente", gameID: "98_Fortune_Ox", isVertical: true },
            { type: "quente", gameID: "10193_Devil_Fire", isVertical: true },
            { type: "quente", gameID: "10045_Golden_Bank", isVertical: true },
            { type: "quente", gameID: "10016-Jungle_King", isVertical: true },
            { type: "quente", gameID: "10051-Money_Coming", isVertical: true },
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