import { Message } from "./msg";

export namespace tcPacker {
    const headerLength = 8;
    const magicNumber = 4680;

    export function pack(msg: Message): ArrayBuffer {
        const length = headerLength + (msg.body?.length ?? 0);
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);

        view.setUint16(0, magicNumber, true);
        view.setUint16(2, length, true);
        view.setUint16(4, msg.type, true);
        view.setUint16(6, msg.cmdId, true);
        msg.body?.forEach((value, index) => view.setUint8(headerLength + index, value));

        return buffer;
    }

    export function unpacks(data: ArrayBuffer) {
        let offset = 0;
        let msgs: Array<Message> = [];
        const view = new DataView(data);
        while (true) {
            if (data.byteLength - offset < headerLength) {
                break;
            }

            const magicId = view.getUint16(offset + 0, true);
            if (magicId !== magicNumber) {
                break;
            }

            const length = view.getUint16(offset + 2, true);
            const type = view.getUint16(offset + 4, true);
            const cmdId = view.getUint16(offset + 6, true);
            if (length > headerLength) {
                msgs.push(new Message(type, cmdId, new Uint8Array(data.slice(offset + headerLength, offset + length))));
            } else {
                msgs.push(new Message(type, cmdId));
            }

            offset += length;
            if (offset > data.byteLength) {
                break;
            }
        }

        return {
            msgs,
            offset,
        };
    }
}
