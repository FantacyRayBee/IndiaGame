import CocosUtil from "./CocosUtil";

const { ccclass, property } = cc._decorator;


@ccclass
export class BaseView extends cc.Component {

    public m_ui: { [key: string]: cc.Node } = {}
    public l_ui: { [key: string]: cc.Label } = {}

    protected onLoad(): void {

        CocosUtil.traverseNodes(this.node, this.m_ui);
        CocosUtil.traverseLabels(this.node, this.l_ui);
    }

}