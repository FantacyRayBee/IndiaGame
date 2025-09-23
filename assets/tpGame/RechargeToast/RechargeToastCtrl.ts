import { IPaymentProduct } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/RechargeToastCtrl')
export default class RechargeToastCtrl extends cc.Component {

    @property(cc.Label)
    private lab_cash: cc.Label = null;

    @property(cc.Label)
    private lab_extraCash: cc.Label = null;

    @property(cc.Label)
    private lab_bonus: cc.Label = null;

    @property(cc.Label)
    private lab_total: cc.Label = null;

    @property(cc.Label)
    private lab_amount: cc.Label = null;

    @property(cc.Label)
    private lab_timeTip: cc.Label = null;

    @property(cc.Button)
    private btn_close: cc.Button = null;

    @property(cc.Button)
    private btn_addCash: cc.Button = null;


    private _rechargeProduct: IPaymentProduct = null;

    private _rechargeTimer: number = null;

    onLoad() {
        //@ts-ignore
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_addCash.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }

    protected onDestroy(): void {
        this._clearRechargeTimer();
    }

    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this._clearRechargeTimer();
                this.setRechargeToastActive(false);
                break;
            case this.btn_addCash.node.name:
                this.dealBtnAddCashEvent();
                break;
            default:
                break;
        }
    }

    dealBtnAddCashEvent() {
        if (!this._rechargeProduct) {
            return;
        };
        //@ts-ignore
        CommonFun.getInstance().rechargeByCommodityId(this._rechargeProduct.id, `TP局内${this._rechargeProduct.plot ? "-剧情" : ""}`, () => {
            this._clearRechargeTimer();
            this.setRechargeToastActive(false);
        });
    }


    setRechargeToastData(data: IPaymentProduct, time: number) {
        this._rechargeProduct = data;

        let id = data.id;
        let amount = data.amount;
        let add = data.add;
        let bonus = data.bonus;    

        this.lab_cash.string = `$${amount/100}`;
        this.lab_extraCash.string = `$${add/100}`;
        this.lab_bonus.string = `$${bonus/100}`;
        this.lab_total.string = `$${(amount + add + bonus)/100}`;
        this.lab_amount.string = `$${amount/100}`;

        this._setRechargeToastTime(time);
    }

    private _setRechargeToastTime(time: number) {
        if (time <= 0) {
            this._clearRechargeTimer();
            this.setRechargeToastActive(false);
        }
        else {
            this._clearRechargeTimer();
            this.lab_timeTip.string = `You have ${time}s to recharge`;
            let actTimerCall = () => {
                time -= 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_timeTip, true)) == false) {
                    clearInterval(localRechargeTimer);
                    localRechargeTimer = null;
                    return;
                }; 
                if (time <= 0) {
                    this._clearRechargeTimer();
                    this.setRechargeToastActive(false);
                    return;
                };
                this.lab_timeTip.string = `You have ${time}s to recharge`;
            };
            let localRechargeTimer = setInterval(actTimerCall, 1000);
            this._rechargeTimer = localRechargeTimer;
        };
    }

    private _clearRechargeTimer() {
        if (this._rechargeTimer !== null) {
            clearInterval(this._rechargeTimer);
            this._rechargeTimer = null;
        };
    }

    /**
     * 设置是否显示充值弹框界面
     * @param active 是否显示
     */
    setRechargeToastActive(active: boolean) {
        this.node.active = active;
    }
}
