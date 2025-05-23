// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLoadingDataView extends cc.Component {
    private icon: cc.Node | undefined;

    protected onLoad(): void {
        this.icon = cc.find("loading", this.node);
    }

    protected onEnable(): void {
        cc.Tween.stopAllByTarget(this.icon);
        cc.tween(this.icon)
            .to(2, { angle: -360 })
            .call(() => {
                if (!this.icon) {
                    return;
                }
                this.icon.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
    }

    protected onDisable(): void {
        this.icon && cc.Tween.stopAllByTarget(this.icon);
    }
}

export class GameLoadingDataDialog {
    private view: GameLoadingDataView | undefined;
    private loadingNode: cc.Node | undefined;

    constructor(loadingNode?: cc.Node) {
        this.loadingNode = loadingNode;
        this.view = this.loadingNode?.addComponent(GameLoadingDataView);
    }
    /**
     * 打开Loading界面
     * @returns
     */
    show() {
        if (!this.view) {
            return;
        }
        this.view.node.active = true;
    }

    close() {
        this.view && (this.view.node.active = false);
    }

    // export function bShow() {
    //     let bShow: boolean = false;
    //     config.uiNode.loading.children.forEach((value) => {
    //         if (value.isValid && value.name == "loading-view") {
    //             bShow = true;
    //             return;
    //         }
    //     });
    //     return bShow;
    // }
}
