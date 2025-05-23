import { tcI18n } from "../../../../script/framework/i18n/i18n";
import { ApiTipError } from "./api-tips-error";
import GameNetEvent from "../../../../ApiTemplate/script/net/GameNetEvent";
import GameNet from "../../../../ApiTemplate/script/net/GameNet";
import { config } from "../../../../script/config/config";
import { event } from "../../../../script/event/event";
import { ApiTips } from "./api-tips";
import { ApiTipCont } from "./Api-tip-cont";
import { GlobalEvents } from "../../../../ApiTemplate/script/tools/GlobalEvents";

export class ApiTipManage {
    private static instance: ApiTipManage = null;
    public static getInstance(): ApiTipManage {
        if (!this.instance) {
            this.instance = new ApiTipManage();
        }
        return this.instance;
    }

    isTest: boolean = true
    // isTest: boolean = false

    constructor() {

        // GameNet.getInstance().on(GameNetEvent.ShowDisconnectTip, this.onGetEncodeConfirm, this);
        GameNet.getInstance().on(GameNetEvent.GetGatewayConfirm, this.onGetGatewayConfirm, this);
        cc.systemEvent.on(event.getServerConfirm, this.onGetServerConfirm, this);
        cc.systemEvent.on(event.banlanceNoEnough, this.banlanceNoEnough, this);

        cc.systemEvent.on(event.sendLeaveGameReq, this.reqLeaveRoom, this);

        GameNet.getInstance().on(GameNetEvent.tryconnect, this.onTryConnectConfirm, this);

        GameNet.getInstance().on(GameNetEvent.tryFail, this.onCantNotConnect, this);

    }

    //加载资源完成
    private loadGameResOver() {
        ApiTips.Idestroy();
    }


    private cantNotConnectShowing: boolean = false;
    /**     * @method 尝试连接失败   */
    public onCantNotConnect() {
        if (this.cantNotConnectShowing) {
            return;
        }
        this.cantNotConnectShowing = true;
        ApiTipError.show({
            title: tcI18n.i18nLabel("api_alert_tip"),
            content: tcI18n.i18nLabel("api_alert_net_reconnect"),
            error: tcI18n.i18nLabel("api_alert_erro_code", ["N1000NSFJWM31"]),
            confirmText: tcI18n.i18nLabel("api_alert_confirmText"),
            closeText: tcI18n.i18nLabel("api_alert_closeText"),
            unique: true,
            iparent: config.uiNode.tips,
            onConfirm: () => {
                window.location.reload();
            },
            onClose: () => {
                if (GameNet.getInstance().homeURL != undefined && GameNet.getInstance().homeURL != "") {
                    window.location.href = GameNet.getInstance().homeURL
                } else {
                    window.location.reload();
                }
            },
        });
    }

    public trySetTime = 0
    /**     * @method 尝试连接     */
    public onTryConnectConfirm() {
        var self = GameNet.getInstance();
        self.reconnectAttempts++;
        self.log("tye reconnect", self.reconnectAttempts);

        let str = "" + self.reconnectAttempts
        ApiTipCont.show({
            content: tcI18n.i18nLabel("api_alert_disconnect", [str])
        });

        ApiTipManage.getInstance().trySetTime = window.setTimeout(() => {
            console.log(" tips clear ");

            config.uiNode.tips.children.forEach((node) => {
                if (node && node.name == "ApiTipContController") {
                    GlobalEvents.getInstance().unluck();
                    node.destroy();
                }
            });
        }, 2000);
    }

    private getEncodeConfirmShowing: boolean = false;
    /**
     * @method 返回参数错误
     */
    public onGetGatewayConfirm(str: string = "S3202CNRUVY09") {
        if (this.getEncodeConfirmShowing) {
            return;
        }
        this.getEncodeConfirmShowing = true;
        ApiTipError.show({
            title: tcI18n.i18nLabel("api_alert_tip"),
            content: tcI18n.i18nLabel("api_alert_content"),
            error: tcI18n.i18nLabel("api_alert_erro_code", [str]),
            confirmText: tcI18n.i18nLabel("api_alert_confirmText"),
            closeText: tcI18n.i18nLabel("api_alert_closeText"),
            unique: true,
            iparent: config.uiNode.loading,
            onConfirm: () => {
                window.location.reload();
            },
            onClose: () => {
                if (GameNet.getInstance().homeURL != undefined && GameNet.getInstance().homeURL != "") {
                    window.location.href = GameNet.getInstance().homeURL
                } else {
                    window.location.reload();
                }
            },
        });
    }

    private getServerConfirmShowing: boolean = false;
    /**
     * @method 请求服务器失败
     */
    public async onGetServerConfirm(bool: boolean) {
        if (this.getServerConfirmShowing) true;
        this.getServerConfirmShowing = true;
        ApiTips.show({
            content: tcI18n.i18nLabel("get_failed"),
            single: bool,
            onConfirm: () => {
                this.getServerConfirmShowing = false;
                ApiTips.Idestroy();
                cc.systemEvent.emit(event.getencode);
            },
        });
    }


    private reqLeaveRoom() {
        ApiTips.show({
            title: tcI18n.i18nLabel("alert_net_leave_room_title"),
            content: tcI18n.i18nLabel("alert_net_leave_room_content"),
            confirmText: tcI18n.i18nLabel("api_alert_closeText"),
            cancelText: tcI18n.i18nLabel("api_leaveroom_confirmText"),
            onConfirm: () => {
                if (GameNet.getInstance().homeURL != undefined && GameNet.getInstance().homeURL != "") {
                    window.location.href = GameNet.getInstance().homeURL
                } else {
                    window.location.reload();
                }
            },
            onCancel: () => {
                ApiTips.Idestroy();
            },
        });
    }

    private async banlanceNoEnough(closeCallback?: Function) {
        ApiTipError.show({
            title: tcI18n.i18nLabel("alert_banlance_no_title"),
            content: tcI18n.i18nLabel("alert_banlance_no_content"),
            error: tcI18n.i18nLabel("alert_banlance_no_error"),
            singleBtnText: tcI18n.i18nLabel("alert_banlance_no_closeText"),
            onSingle: () => {
                ApiTipError.Idestroy();
                closeCallback && closeCallback();
            },
        });
    }



}
