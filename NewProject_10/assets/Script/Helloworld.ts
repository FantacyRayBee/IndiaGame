const {ccclass, property} = cc._decorator;
import ButtonHandler from "./button";
import AnchorButton from "./anchorButton";
import OrientationButton from "./orientationButton";
import WebHybrid from "./webHybrid";

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = '大厅';

    start () {
        const canvas = cc.find("Canvas") || this.node;
        const targetLabel = this.ensureMainLabel(canvas);
        targetLabel.string = this.text;
        this.createMainButton();
        this.createAnchorButton();
        this.createOrientationButton();
        if (cc.sys.isBrowser) {
            WebHybrid.enterLobbyMode();
        }
    }

    private ensureMainLabel(parent: cc.Node): cc.Label {
        let targetLabel = this.label;
        if (targetLabel && cc.isValid(targetLabel.node)) {
            return targetLabel;
        }

        const byChildName = cc.find("label", parent);
        if (byChildName) {
            const found = byChildName.getComponent(cc.Label);
            if (found) {
                this.label = found;
                return found;
            }
        }

        const created = new cc.Node("label");
        created.parent = parent;
        created.setPosition(0, 0);
        const createdLabel = created.addComponent(cc.Label);
        createdLabel.fontSize = 72;
        createdLabel.lineHeight = 76;
        this.label = createdLabel;
        return createdLabel;
    }

    private createMainButton() {
        const canvas = cc.find("Canvas") || this.node;
        const existed = cc.find("MainButton", canvas);
        if (existed) {
            return;
        }

        const btnNode = this.createButtonNode("MainButton", "直播1", 0, -260, new cc.Color(63, 123, 225, 255));
        const btn = btnNode.getComponent(cc.Button);
        const handler = btnNode.addComponent(ButtonHandler);
        handler.button = btn;
    }

    private createAnchorButton() {
        const canvas = cc.find("Canvas") || this.node;
        const existed = cc.find("AnchorButton", canvas);
        if (existed) {
            return;
        }

        const btnNode = this.createButtonNode("AnchorButton", "主播开播", 0, -370, new cc.Color(230, 89, 80, 255));
        const btn = btnNode.getComponent(cc.Button);
        const handler = btnNode.addComponent(AnchorButton);
        handler.button = btn;
    }

    private createOrientationButton() {
        const canvas = cc.find("Canvas") || this.node;
        const existed = cc.find("OrientationButton", canvas);
        if (existed) {
            return;
        }

        const btnNode = this.createButtonNode("OrientationButton", "横竖切换", 0, -480, new cc.Color(72, 162, 118, 255));
        const btn = btnNode.getComponent(cc.Button);
        const handler = btnNode.addComponent(OrientationButton);
        handler.button = btn;
    }

    private createButtonNode(name: string, text: string, x: number, y: number, color: cc.Color): cc.Node {
        const canvas = cc.find("Canvas") || this.node;
        const btnNode = new cc.Node(name);
        btnNode.setContentSize(260, 80);
        btnNode.x = x;
        btnNode.y = y;
        canvas.addChild(btnNode);

        const g = btnNode.addComponent(cc.Graphics);
        g.clear();
        g.fillColor = color;
        g.roundRect(-130, -40, 260, 80, 10);
        g.fill();

        const btn = btnNode.addComponent(cc.Button);
        btn.transition = cc.Button.Transition.SCALE;
        btn.zoomScale = 0.95;

        const labelNode = new cc.Node("BtnLabel");
        labelNode.parent = btnNode;
        const btnLabel = labelNode.addComponent(cc.Label);
        btnLabel.string = text;
        btnLabel.fontSize = 32;
        btnLabel.lineHeight = 36;

        return btnNode;
    }
}
