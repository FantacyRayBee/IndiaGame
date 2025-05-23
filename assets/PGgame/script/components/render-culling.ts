// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.ScrollView)
export class RenderCulling extends cc.Component {
    private scrollView: cc.ScrollView | undefined;

    protected onLoad(): void {
        this.scrollView = this.node.getComponent(cc.ScrollView);
    }

    protected start(): void {
        this.scrollView?.node.on("scrolling", this.onScrolling, this);
    }

    private onScrolling(sc: cc.ScrollView) {
        const box = sc.node.getBoundingBoxToWorld();
        const children = this.scrollView?.content.children ?? [];
        if (children.length === 0) {
            return;
        }

        children.forEach((v) => {
            v.opacity = this.checkVisible(v, box) ? 255 : 0;
        });
    }

    private checkVisible(item: cc.Node, box: cc.Rect): boolean {
        return item.getBoundingBoxToWorld().intersects(box);
    }
}
