import { IPlotOffset } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/LuckyPlayerCtrl')
export default class LuckyPlayerCtrl extends cc.Component {

    @property(cc.Button)
    private btn_get: cc.Button = null;

    private _plotOffset: IPlotOffset = null;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_get.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 1), this);
    }

    private _btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this._dealBtnGetEvent();
    }

    private _dealBtnGetEvent() {
        if (this._plotOffset) {
            //@ts-ignore
            CommonFun.getInstance().scatterGoldCoinsAim();
            //@ts-ignore
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.TPGAME_CLICK_LUCKYPLAYER_GET, msgData: {plotOffset: this._plotOffset}});
            this.scheduleOnce(() => {
                this.setLuckyPlayerActive(false);
            }, 1);
        }
        else {
            this.setLuckyPlayerActive(false);
        };
    }

    /**
     * 设置幸运玩家首充剧情补偿数据
     * @param plotOffset 首充剧情补偿
     */
    setLuckyPlayerPlotOffset(plotOffset: IPlotOffset) {
        this._plotOffset = plotOffset;
    }

    /**
     * 设置幸运玩家界面是否显示
     * @param active 是否显示
     */
    setLuckyPlayerActive(active: boolean) {
        this.unscheduleAllCallbacks();
        this.node.active = active;
    }

    getLuckyPlayerActive() {
        return this.node.active;
    }
}
