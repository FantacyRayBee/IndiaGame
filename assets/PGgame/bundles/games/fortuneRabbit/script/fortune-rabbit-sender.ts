import logger from "../../../../ApiTemplate/script/net/logger";
import { SelectGameMrg } from "../../../../ApiTemplate/script/tools/SelectGameMrg";
import { cmd } from "../../../../script/config/cmd";
import { Message } from "../../../../script/framework/net/msg";
import { uNet } from "../../../../script/framework/net/socket";
import { betSetting } from "../../../update-v2/script/api/bet-setting";

export namespace FortuneRabbitSender {
    function send(commandId: number, buf?: Uint8Array): void {
        const pkg = new Message(cmd.SERVER_TYPE_FORTUNE_RABBIT, commandId, buf);
        uNet.getInstance().send(pkg);
    }

    export function reqRoomInfo() {
        // send(proto.slot_fortune_rabbit.FortuneRabbitCmd.CMD_GAME_GET_TABLE_STATUS_REQ);
        // tcLog.info(`send request room info`);
    }

    // spin(betIndex: number, mutipleIndex: number, cb?: (rtn: any) => void) {
    export function reqSpin(bet: number, mode: boolean = false, betSize: number, betMultiple: number) {
        // const payload: proto.slot_fortune_rabbit.IGameSpinReq = { amount: bet, mode: mode, betSize: betSize, betMultiple: betMultiple };
        // const req = proto.slot_fortune_rabbit.GameSpinReq.create(payload);
        // const encReq = proto.slot_fortune_rabbit.GameSpinReq.encode(req).finish();
        // send(proto.slot_fortune_rabbit.FortuneRabbitCmd.CMD_GAME_SPIN_REQ, encReq);
        // tcLog.info(`send request spin:${bet}`);
        // betSize: [300, 1000, 3000, 9000],

        let setting = betSetting.gameChip["USD"];
        let betSizeIndex = setting.betSize.indexOf(betSize)
        let betMultipleIndex = setting.betLevels.indexOf(betMultiple)

        SelectGameMrg.getInstance().spin(betSizeIndex, betMultipleIndex, (rtn) => {
            logger.log("spin", rtn);
            // cc.systemEvent.emit(FortuneRabbitLogic.EventSpin, rtn);
        })
    }
}
