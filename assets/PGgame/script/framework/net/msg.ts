export class Message {
    public readonly type: number;
    public readonly cmdId: number;
    public readonly body?: Uint8Array;

    public constructor(type: number, cmdId: number, body?: Uint8Array) {
        this.type = type;
        this.cmdId = cmdId;
        this.body = body;
    }
}
