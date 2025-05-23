import { UIhistory } from "./UIhistory";

const { ccclass, property } = cc._decorator;

// 把节点更新成主题颜色

@ccclass
export class SharedThemeColor extends cc.Component {
    @property({ type: cc.Node })
    rendererList: cc.Node[] = []

    protected onLoad(): void {
        // tcLog.log("修改主题颜色", SharedConfig.THEME_COLOR);

        this.rendererList.forEach((render: cc.Node) => {
            // render.color = SharedConfig.THEME_COLOR.clone();
            render.color = UIhistory.themeColor
        })
    }

    protected start(): void {
        this.destroy();
    }
}


