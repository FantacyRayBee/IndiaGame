// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// import { tcLog } from "../framework/log/log";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeFileHandler extends cc.Component {
    public handleSelectFile(path: string) {
        // tcLog.debug(`url path: ${path}`);
        // tcLog.log("string length: ", jsb.fileUtils.getStringFromFile(path).length);
        // tcLog.log("data length: ", jsb.fileUtils.getDataFromFile(path).byteLength);
    }
}

export namespace nativeFileHandler {
    // 参考链接：https://mariusschulz.com/blog/programmatically-opening-a-file-dialog-with-javascript
    export function showOpenFilePicker() {
        const fileEle = document.getElementById("file-picker");
        if (!fileEle) {
            return;
        }

        globalThis.setTimeout(() => {
            fileEle.click();
        }, 500);
    }
}
