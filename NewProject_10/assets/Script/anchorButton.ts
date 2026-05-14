const { ccclass, property } = cc._decorator;
import LiveKit from "./livekit";

@ccclass
export default class AnchorButton extends cc.Component {
    @property(cc.Button)
    button: cc.Button = null;

    start() {
        if (this.button) {
            this.button.node.on("click", this.click, this);
        }
    }

    click() {
        cc.log("[AnchorButton] start anchor");
        LiveKit.init({ debug: true });
        LiveKit.startAnchor();
    }

    onDestroy() {
        if (this.button) {
            this.button.node.off("click", this.click, this);
        }
    }
}
