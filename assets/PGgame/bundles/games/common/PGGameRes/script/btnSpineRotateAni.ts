// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class btnSpineRotateAni extends cc.Component {
    public startRotate(lapTime: number = 6) {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).by(lapTime, { angle: -360 }).union().repeatForever().start();
    }

    protected onDisable(): void {
        cc.Tween.stopAllByTarget(this.node);
    }

    public stopRotate() {
        cc.Tween.stopAllByTarget(this.node);
    }
}
