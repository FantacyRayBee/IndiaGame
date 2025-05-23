// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class btnSpineRotateNormalAni extends cc.Component {
    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.5, { angle: -360 })
            .call(() => {
                if (!this.node) {
                    return;
                }
                this.node.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
    }
}
