import { EnumMsgToastStyle } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/MsgToastCtrl')
export default class MsgToastCtrl extends cc.Component {

    @property(cc.Label)
    private lab_content: cc.Label = null;

    @property(cc.Button)
    private btn_yes: cc.Button = null;

    @property(cc.Button)
    private btn_no: cc.Button = null;

    private _noBtnCall: Function = null;

    private _yesBtnCall: Function = null;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_yes.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_no.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
    }

    private btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_yes.node.name:
                this.dealBtnYesEvent();
                break;
            case this.btn_no.node.name:
                this.dealBtnNoEvent();
                break;
            default:
                break;
        }
    }

    private dealBtnYesEvent() {
        if (this._yesBtnCall) {
            this._yesBtnCall();
        };
        this.setMsgToastActive(false);
    }

    private dealBtnNoEvent() {
        if (this._noBtnCall) {
            this._noBtnCall();
        };
        this.setMsgToastActive(false);
    }

    /**
     * 设置提示框的回调
     * @param yesCall 点击确定按钮的回调
     * @param noCall 点击取消按钮的回调
     */
    setMsgToastYesCall(yesCall: Function) {
        this._yesBtnCall = yesCall;
    }

    setMsgToastNoCall(noCall: Function) {
        this._noBtnCall = noCall;
    }

    setMsgToastStyle(style: EnumMsgToastStyle) {
        switch (style) {
            case EnumMsgToastStyle.NO:
                this.btn_yes.node.active = false;
                this.btn_no.node.active = true;
                this.btn_no.node.setPosition(cc.v3(0, -150));
                break;
            case EnumMsgToastStyle.YES_NO:
                this.btn_yes.node.active = true;
                this.btn_no.node.active = true;
                this.btn_yes.node.setPosition(cc.v3(157, -150));
                this.btn_no.node.setPosition(cc.v3(-157, -150));
                break;
            case EnumMsgToastStyle.YES:
                this.btn_yes.node.active = true;
                this.btn_no.node.active = false;
                this.btn_yes.node.setPosition(cc.v3(0, -150));
                break;
            default:
                break;
        }
    }

    /**
     * 设置提示框的内容
     * @param content 提示框的内容
     */
    setMsgToastContent(content: string) {
        this.lab_content.string = content;
    }

    /**
     * 设置提示框的显示
     * @param active 是否显示
     */
    setMsgToastActive(active: boolean) {
        this.node.active = active;
    }
}
