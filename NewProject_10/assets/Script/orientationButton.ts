const {ccclass, property} = cc._decorator;
import LiveKit from "./livekit";

@ccclass
export default class OrientationButton extends cc.Component {
    @property(cc.Button)
    button: cc.Button = null;

    start() {
        const targetButton = this.button || this.getComponent(cc.Button);
        if (!targetButton) {
            return;
        }
        targetButton.node.on("click", this.onClick, this);
    }

    private onClick() {
        cc.log("[OrientationButton] toggle screen orientation");
        LiveKit.toggleScreenOrientation();
    }
}
