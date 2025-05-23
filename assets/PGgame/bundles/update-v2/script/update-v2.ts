// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { apiLogic } from "./api/api-logic";

const { ccclass, property } = cc._decorator;

@ccclass
export class UpdateV2 extends cc.Component {
    protected async start() {
        new apiLogic();
        return;
    }
}
