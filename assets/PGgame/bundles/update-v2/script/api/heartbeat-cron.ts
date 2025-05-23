// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { cmd } from "../../../../script/config/cmd";
import { tcLog } from "../../../../script/framework/log/log";
import { Message } from "../../../../script/framework/net/msg";
import { Handler, uNet } from "../../../../script/framework/net/socket";

export class HeartbeatCron implements Handler {
    private static instance: HeartbeatCron | undefined = undefined;

    private constructor() {
        uNet.getInstance().bind(cmd.SERVER_TYPE_GATEWAY, this);
    }

    public static getInstance(): HeartbeatCron {
        if (!this.instance) {
            this.instance = new HeartbeatCron();
        }

        return this.instance;
    }

    private count: number = 0;
    private timeoutId: number = 0;

    public start() {
        clearInterval(this.timeoutId);
        this.count = 0;

        this.timeoutId = window.setInterval(() => {
            this.count++;
            if (this.count >= 3) {
                tcLog.error(`network is error`);
                this.stop();
                return;
            }

            // const payload = proto.gateway.ping_tos.create({
            //     time: (Date.now() / 1000) | 0,
            // });
            // const body = proto.gateway.ping_tos.encode(payload).finish();
            // const message: Message = new Message(cmd.SERVER_TYPE_GATEWAY, proto.gateway.CMD.PING_TOS, body);

            // uNet.getInstance().send(message);
        }, 5000);
    }

    public stop() {
        clearInterval(this.timeoutId);
    }

    handler(msg: Message): void {
        if (msg.type !== cmd.SERVER_TYPE_GATEWAY) {
            return;
        }

        // if (msg.cmdId !== proto.gateway.CMD.PONG_TOC) {
        //     return;
        // }

        this.count = 0;
    }
}
