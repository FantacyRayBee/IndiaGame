// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcRes } from "../res/res";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIBase extends cc.Component {
    private assetsMap: Map<string, cc.Asset> = new Map();

    private load(url: string) {
        const asset = this.assetsMap.get(url);
        if (asset) {
            asset.addRef();
            return;
        }

        tcRes
            .loadRemote(url)
            .then((asset) => {
                if (this.assetsMap.has(url)) {
                    this.assetsMap.get(url)?.decRef();
                    this.assetsMap.delete(url);
                }

                asset.addRef();
                this.assetsMap.set(url, asset);
            })
            .catch((err) => {});
    }

    private release() {
        this.assetsMap.forEach((value) => {
            value.decRef();
        });
    }
}
