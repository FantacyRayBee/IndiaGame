// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export class UpdateViewV2 extends cc.Component {
    private loadingIcon: cc.Node[] = [];

    protected onLoad(): void {
        const children = cc.find("progress", this.node).children;
        for (let i = 0; i < children.length; i++) {
            const child = cc.find(`progress/${i + 1}`, this.node);
            this.loadingIcon.push(child);
        }
    }

    protected start(): void {
        this.autoPlay();
    }

    private autoPlay() {
        this.loadingAni();
    }

    private loadingAni() {
        const length = this.loadingIcon.length;
        const maxTime = 2;
        const step = maxTime / length; // 3s 走完一圈
        for (let i = 0; i < length; i++) {
            const target = this.loadingIcon[i];
            cc.tween(target)
                .delay(step * i)
                .to(step + 0.2, { opacity: 25 })
                .delay((step * 3) / 2)
                .to(step * 2, { opacity: 255 })
                .delay(maxTime - step * i)
                .union()
                .repeatForever()
                .start();
        }
    }

    public setLabel(value: string) {}

    public updateProgress(value: number) {}

    public close() {
        this.node.destroy();
    }
}
