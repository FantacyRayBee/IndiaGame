import { env } from "../../../../script/app/env";
import { cmd } from "../../../../script/config/cmd";
import { Message } from "../../../../script/framework/net/msg";
import { Handler, uNet } from "../../../../script/framework/net/socket";
import { api_act } from "./api_act";
import { apiConfig, gameData } from "./api-config";
import { ApiGameLogic } from "./api-game-logic";
import { tcI18n } from "../../../../script/framework/i18n/i18n";
import { config, gameConfig } from "../../../../script/config/config";
import logger from "../../../../ApiTemplate/script/net/logger";
import { currency } from "../../../../script/pkg/currency";
import { betSetting } from "./bet-setting";
import { ApiTipManage } from "./api-tip-manage";
import { Game_Const } from "../../../../ApiTemplate/script/config/GameConst";

export class apiLogic implements Handler {
    private gamelogic: ApiGameLogic = new ApiGameLogic();
    private apiTipManage: ApiTipManage = new ApiTipManage();

    constructor() {
        // 关闭 h5 的 splash 界面
        cc.director.emit("hide-splash-image");
        cc.debug.setDisplayStats(false);


        logger.enableLogger(cc.sys.os == cc.sys.OS_WINDOWS)

        apiConfig.env.gameId = cmd.SERVER_TYPE_FORTUNE_RABBIT;

        const href = api_act.gethref();
        const match = new api_act.match(href);
        let language = match.get("lang")!;

        apiConfig.env.language = language ? language : "en"
        apiConfig.env.userId = 123456
        apiConfig.env.token = "testtesttesttesttest"
        apiConfig.env.gameId = cmd.SERVER_TYPE_FORTUNE_RABBIT;


        let server = match.get("server")
        let serverCfg = server ? server : "test"
        Game_Const.Game_Host = Game_Const.server_list[serverCfg].Game_Host
        Game_Const.server_ips = Game_Const.server_list[serverCfg].server_ips


        let Symbol = match.get("currency")!;

        let moneySymbol = "USD"
        switch (Symbol) {
            case "USD":
                moneySymbol = "USD"
                break;
            case "AUD":
                moneySymbol = "AUD"
                break;
            case "BRL":
            default: break;
        }

        currency.setSymbol(moneySymbol);

        let setting = betSetting.gameChip[moneySymbol];
        if (!setting) {
            setting = betSetting.gameChip.Default;
        }
        gameData.betTotalsForQuickBtn.length = 0;
        gameData.betTotalsForQuickBtn.push(...setting.quickAmount);

        gameData.betSizes = setting.betSize;
        gameData.betLines = setting.lines;
        gameData.betLevels = setting.betLevels;

        logger.purple("language:", apiConfig.env.language,
            "  moneySymbol:", moneySymbol);


        this.loginSuccess();

    }

    /**
     * @method 进入游戏
     */
    private async loginSuccess() {
        env.device.platform = env.PlatformType.H5;

        const ori = gameConfig.GAMEID_GAME_ORIENTATION[apiConfig.env.gameId as keyof typeof gameConfig.GAMEID_GAME_ORIENTATION];
        let orientation = ori ? ori : 0;

        env.curGameData.data = {
            tags: [2],
            orientation: orientation,
            nativeId: apiConfig.env.gameId,
        };
        env.application.curLocaton = 1;

        await tcI18n.switchLanguage(apiConfig.env.language as tcI18n.Language);
        this.gamelogic!.loadNativeGame({ nativeId: apiConfig.env.gameId, orientation, gameId: apiConfig.env.gameId }, true);
    }


    handler(msg: Message): void {
    }
}
