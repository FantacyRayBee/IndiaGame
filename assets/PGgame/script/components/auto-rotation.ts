// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export class AutoRotation extends cc.Component {
    protected onLoad(): void {}

    protected start(): void {
        cc.tween(this.node)
            .to(2, { angle: -360 })
            .call(() => {
                this.node.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
    }
}
