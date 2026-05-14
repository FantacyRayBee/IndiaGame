const { ccclass, property } = cc._decorator;
import LiveKit from "./livekit";

@ccclass
export default class ButtonHandler extends cc.Component {
    // 统一在 Cocos 脚本里配置直播间链接，H5/Android 共用。
    // 你后续只改这里即可。
    private static readonly LIVE_ROOM_URL =
        "http://192.168.110.28:5173/room?roomId=10001&userId=user_1&nickname=观众1&role=audience&debugMedia=1";

    @property(cc.Button)
    button: cc.Button = null;

    @property
    text: string = "hello";

    start() {
        if (this.button) {
            this.button.node.on("click", this.click, this);
        }
    }

    click() {
        cc.log("xiaowei");
        this.openLivePanel();
    }

    private openLivePanel() {
        const roomUrl = ButtonHandler.LIVE_ROOM_URL;
        LiveKit.init({ defaultAudienceUrl: roomUrl, debug: true });
        LiveKit.enterAudience(roomUrl);
    }

    onDestroy() {
        if (this.button) {
            this.button.node.off("click", this.click, this);
        }
    }
}
