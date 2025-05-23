import { tcI18n } from "../framework/i18n/i18n";


const { ccclass, property } = cc._decorator;

@ccclass
export default class topNone extends cc.Component {


    private labelGameName: cc.Label | undefined;
    private labelTime: cc.Label | undefined;
    protected onLoad(): void {
        this.labelGameName = cc.find("gameName", this.node).getComponent(cc.Label);
        this.labelTime = cc.find("time", this.node).getComponent(cc.Label);
        this.labelGameName.node.active = false
        this.labelTime.node.active = false

        cc.systemEvent.on("showTop", this.init, this);
    }

    public init(): void {
        // protected onEnable(): void {
        // let self = PgGameTopNode.getInstance()


        this.labelGameName.node.active = true
        this.labelTime.node.active = true
        // this.node.setPosition(0, 720 + AdapterV2.getInstance().winSizeHeight - 15);
        // if (AdapterV2.getInstance().rootCanvasHeight > 1442) {
        //     this.node.setPosition(0, 876);
        // } else {
        //     this.node.setPosition(0, 720);
        // }

        // let data = env.curGameData.data;
        // if (!data) {
        //     return;
        // }
        let gameName = tcI18n.i18nLabel(`h5_name`);
        // let gameName = "Fortune Rabbit"
        let firstChar = gameName.substring(0, 1);
        gameName = firstChar.toUpperCase() + gameName.substring(1);
        this.labelGameName!.string = gameName;

        this.schedule(() => {
            let curTime = this.toLocalTimeString(Date.now());
            this.labelTime!.string = curTime;
        }, 1, cc.macro.REPEAT_FOREVER, 0.01);

        this.node.getComponentsInChildren(cc.Widget).forEach((element) => {
            element.updateAlignment();
        });
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks();
    }

    toLocalTimeString(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${hours.toString().padStart(2, "0")}: ${minutes.toString().padStart(2, "0")}: ${seconds.toString().padStart(2, "0")}`;
    }
}
