const developEnv = {
    // getAwayUrl: window.location.origin,
    getAwayUrl_dev: "http://192.168.0.234:20082", //测试服
    apiUrl: "", //测试服
    token: "",
    gameId: 0, //51014
    ws: "",
    userId: 0,
    cashierUrl: "",
    language: "pt",
    lobbyUrl: "",
    /** 控投注额 */
    welfareAmount: "",
    /** 是否控  0是默认（相当于正常）、1是控赢、2是控输 */
    welfareType: 0,
};

export namespace apiConfig {
    /**
     * 环境
     */
    export const env = developEnv;
}

export const gameData = {
    betSizes: [0],
    betLevels: [0],
    betLines: 0,
    betTotalsForQuickBtn: [0],
};
