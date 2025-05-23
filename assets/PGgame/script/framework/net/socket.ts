// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../log/log";
import { Message } from "./msg";
import { tcPacker } from "./packer";

export interface Handler {
    handler(msg: Message): void;
}

export class uNet {
    private static instance: uNet;
    private constructor() { }

    public static getInstance(): uNet {
        if (!this.instance) {
            this.instance = new uNet();
        }

        return this.instance;
    }

    private autoReconnect = true;
    private reconnectTimer = 0;
    private reconnectCount = 0;
    private dsn: string = "";
    private ws: WebSocket | undefined;
    private arrayBuffer: ArrayBuffer | undefined;

    private handlers: Map<number, Handler[]> = new Map();

    public openEvent: Function | undefined;
    public closeEvent: Function | undefined;
    public reconnectEvent: Function | undefined;
    public reconnnectSucEvent: Function | undefined;
    public tryReconnect: Function | undefined;

    public bNetConnected() {
        return !!this.ws;
    }

    public connect(dsn: string) {
        if (this.ws) {
            return;
        }
        return;

        tcLog.debug(`will connect ${dsn}`);

        this.dsn = dsn;
        if (dsn.startsWith("wss://") && cc.sys.isNative && cc.sys.platform === cc.sys.ANDROID) {
            // @ts-ignore
            this.ws = new WebSocket(dsn, "", cc.url.raw(`resources/ca/cacert.pem`));
        } else {
            this.ws = new WebSocket(dsn);
        }
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = () => {
            // this.openEvent.forEach((e) => e());
            this.openEvent?.();
            if (this.reconnectTimer > 0) {
                this.reconnectTimer = 0;
                clearTimeout(this.reconnectTimer);
                this.reconnnectSucEvent?.();
                //toastController.show(tcI18n.i18nLabel("reconnect_suc"));
            }
            this.reconnectCount = 0;
            this.autoReconnect = true;
        };
        this.ws.onmessage = (ev) => {
            const data = ev.data as ArrayBuffer;
            if (data.byteLength < 0) {
                return;
            }

            if (!this.arrayBuffer) {
                this.arrayBuffer = data;
            } else {
                const newBuffer = new Uint8Array(data.byteLength + this.arrayBuffer.byteLength);
                newBuffer.set(new Uint8Array(this.arrayBuffer), 0);
                newBuffer.set(new Uint8Array(data), this.arrayBuffer.byteLength);

                this.arrayBuffer = newBuffer;
            }

            const res = tcPacker.unpacks(this.arrayBuffer);

            if (res.offset === this.arrayBuffer.byteLength) {
                this.arrayBuffer = undefined;
            } else {
                this.arrayBuffer = this.arrayBuffer.slice(res.offset);
            }

            res.msgs.forEach((v) => {
                tcLog.debug(`<----- handle msg, type: ${v.type}, cmd: ${v.cmdId}, body length: ${v.body?.length}`);
                const hs = this.handlers.get(v.type);
                if (!hs) {
                    return;
                }

                hs.forEach((h) => h.handler(v));
            });
        };
        this.ws.onclose = (e) => {
            tcLog.error(`websocket is closed: ${JSON.stringify(e)}`);
            this.ws?.close();
            this.ws = undefined;

            if (this.autoReconnect) {
                tcLog.error(`if : ${this.autoReconnect}`);
                this.tryReconnect?.();

                this.reconnectTimer = window.setTimeout(() => {
                    tcLog.error(`setTimeout : ${this.reconnectTimer}`);
                    if (this.reconnectCount >= 5) {
                        tcLog.error(`>= 5 : ${this.reconnectCount}`);
                        clearTimeout(this.reconnectTimer);
                        this.closeEvent?.();
                        return;
                    }
                    tcLog.error(`socket reconnect curCount:${this.reconnectCount}`);
                    this.reconnectEvent?.();
                    this.reconnectCount++;
                    this.reconnect();
                }, 3000);
            }
        };
        this.ws.onerror = () => {
            tcLog.error(`websocket error`);
        };
    }

    public reconnect() {
        tcLog.debug(`reconnect`);

        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }

        this.connect(this.dsn);
    }

    public send(message: Message) {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            return;
        }
        tcLog.debug(`----->send msg, type: ${message.type}, cmd id: ${message.cmdId}, body length: ${message.body?.length}`);

        this.ws.send(tcPacker.pack(message));
    }

    public close() {
        this.autoReconnect = false;
        clearTimeout(this.reconnectTimer);

        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }
    }

    public bind(type: number, handler: Handler) {
        const hs = this.handlers.get(type);
        if (!hs) {
            this.handlers.set(type, [handler]);
            return;
        }

        if (hs.indexOf(handler) !== -1) {
            return;
        }

        hs.push(handler);
    }

    public unbind(type: number, handler: Handler) {
        const hs = this.handlers.get(type);
        if (!hs) {
            return;
        }

        const index = hs.indexOf(handler);
        if (index === -1) {
            return;
        }

        hs.splice(index, 1);
    }
}
