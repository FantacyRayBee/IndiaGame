import { EnumBetBtnStr, EnumShowBtnStr, IPaymentProduct } from "../DataDef";
import TpGameCtrl from "../TpGameCtrl";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/ActBtnsCtrl')
export class ActBtnsCtrl extends cc.Component {

    @property(cc.Button)
    btn_pack: cc.Button = null;

    @property(cc.Button)
    btn_add: cc.Button = null;

    @property(cc.Button)
    btn_reduce: cc.Button = null;

    @property(cc.Button)
    btn_bet: cc.Button = null;

    @property(cc.Button)
    btn_show: cc.Button = null;

    @property(cc.Label)
    lab_btnBet: cc.Label = null;

    @property(cc.Label)
    lab_btnShow: cc.Label = null;

    @property(cc.Label)
    lab_selectChipAmount: cc.Label = null;

    @property(cc.Node)
    private node_recharge: cc.Node = null;

    @property(cc.Button)
    private btn_recharge: cc.Button = null;

    @property(cc.Label)
    private lab_rechargeTip: cc.Label = null;

    @property(sp.Skeleton)
    private sp_betScan: sp.Skeleton = null;

    private _isAddChipAmount = false;

    private _chipAmount = 0;

    private _nodeActive = false;

    private _rechargeTimer: number = null;

    private _rechargeActTime: number = 0;

    private _rechargeProduct: IPaymentProduct = null;

    private _tpGameCtrl: TpGameCtrl = null;

    private _winRate: number = null;

    private _betScaneTimer: number = null;


    protected onLoad(): void {
        //@ts-ignore
        this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_add.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_reduce.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0), this);
        //@ts-ignore
        this.btn_bet.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_show.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_recharge.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }

    protected onDestroy(): void {
        this._clearRechargeActTimer();
        this._clearBetScaneTimer();
    }

    initActBtns(tpGameCtrl: TpGameCtrl) {
        this._tpGameCtrl = tpGameCtrl;

        this.setActBtnsBetBtnString(EnumBetBtnStr.BLIND);
        this.setActBtnsShowBtnString(EnumShowBtnStr.SIDESHOW);
    }


    btnClickCall(btn: cc.Button) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_pack.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnPackEvent();
                break;
            case this.btn_add.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnAddEvent();
                break;
            case this.btn_reduce.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnReduceEvent();
                break;
            case this.btn_bet.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnBetEvent();
                break;
            case this.btn_show.node.name:
                this._tpGameCtrl.tpGameAudioCtrl.playClickBtnShowEffect();
                this.dealBtnShowEvent();
                break;
            case this.btn_recharge.node.name:
                //@ts-ignore
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnRechargeEvent();
                break;
            default:
                break;
        }
    }

    dealBtnPackEvent() {
        if (this._winRate === null) {
            //@ts-ignore
            GameServerManager.send("gameservice.drop", "DropReq", {});
        }
        else {
            this._tpGameCtrl.hintCtrl.setHitWinRate(this._winRate);
            this._tpGameCtrl.hintCtrl.setHintActive(true);
        };
    }

    dealBtnAddEvent() {
        this._isAddChipAmount = true;
        this._chipAmount = this._chipAmount * 2;
        this.lab_selectChipAmount.string = `${this._chipAmount/100}`;

        this._setAddBtnInteractable(false);
        this._setReduceBtnInteractable(true);
    }

    dealBtnReduceEvent() {
        this._isAddChipAmount = false;

        this._chipAmount = this._chipAmount / 2;
        this.lab_selectChipAmount.string = `${this._chipAmount/100}`;

        this._setAddBtnInteractable(true);
        this._setReduceBtnInteractable(false);
    }

    dealBtnBetEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.chip", "ChipReq", {add: this._isAddChipAmount});
    }

    dealBtnShowEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.launchcompare", "LaunchCompareReq", {});
    }

    dealBtnRechargeEvent() {
        this._tpGameCtrl.rechargeToastCtrl.setRechargeToastActive(true);
        this._tpGameCtrl.rechargeToastCtrl.setRechargeToastData(this._rechargeProduct, this._rechargeActTime);
    }

    /**
     * 设置ActBtns的节点是否显示
     * @param active 是否显示
     */
    setActBtnsNodeActive(active: boolean) {
        this._nodeActive = active;
        this.node.active = active;
    }

    /**
     * 获取ActBtns的节点是否显示
     * @returns 节点是否显示
     */
    getActBtnsNodeActive() {
        return this._nodeActive;
    }

    /**
     * 根据动作码数组设置对应的按钮是否可点击
     * @param canActValueArr 可进行的动作码数组
     */
    setActBtnsInteractableByActValueArr(canActValueArr: number[]) {
        //@ts-ignore
        this._setBetBtnInteractable(canActValueArr.indexOf(2) != -1);
        this._setAddBtnInteractable(canActValueArr.indexOf(4) != -1);
        this._setShowBtnInteractable(canActValueArr.indexOf(8) != -1);
        this._setPackBtnInteractable(canActValueArr.indexOf(16) != -1);
        this._setReduceBtnInteractable(false);
        this._isAddChipAmount = false;
    }

    /**
     * 设置下注按钮文字显示
     * @param str 
     */
    setActBtnsBetBtnString(str: EnumBetBtnStr) {
        this.lab_btnBet.string = str;
    }

    /**
     * 设置比牌按钮文字显示
     * @param str 
     */
    setActBtnsShowBtnString(str: EnumShowBtnStr) {
        this.lab_btnShow.string = str;
    }

    /**
     * 设置当前欲投筹码的额度
     * @param amount 
     */
    setActBtnsChipAmount(amount: number) {
        this._chipAmount = amount;
        this.lab_selectChipAmount.string = `${this._chipAmount/100}`;
    }

    /**
     * 正好是自己玩家操作时，期间看牌了，筹码要翻倍。
     */
    updateActBtnsChipAmountBySeen() {
        this._chipAmount = this._chipAmount * 2;
        this.lab_selectChipAmount.string = `${this._chipAmount/100}`;
    }

    private _setPackBtnInteractable(interactable: boolean) {
        this.btn_pack.interactable = interactable;
        this.btn_pack.enableAutoGrayEffect = !interactable;
    }

    private _setAddBtnInteractable(interactable: boolean) {
        this.btn_add.interactable = interactable;
        this.btn_add.enableAutoGrayEffect = !interactable;
    }

    private _setReduceBtnInteractable(interactable: boolean) {
        this.btn_reduce.interactable = interactable;
        this.btn_reduce.enableAutoGrayEffect = !interactable;
    }

    private _setBetBtnInteractable(interactable: boolean) {
        this.btn_bet.interactable = interactable;
        this.btn_bet.enableAutoGrayEffect = !interactable;

        this._clearBetScaneTimer();
        if (interactable) {
            let actFun = () => {
                if ((cc.isValid(this, true) && cc.isValid(this.sp_betScan, true)) == false) {
                    clearInterval(localBetScaneTimer);
                    localBetScaneTimer = null;
                    return;
                }; 
                this.sp_betScan.node.active = true;
                this.sp_betScan.clearTrack(0);
                this.sp_betScan.setAnimation(0, "animation", true);
            };
            let localBetScaneTimer = setTimeout(actFun, 5000);
            this._betScaneTimer = localBetScaneTimer;
        }
        else {
            this.sp_betScan.clearTrack(0);
            this.sp_betScan.node.active = false;
        };
    }

    private _clearBetScaneTimer() {
        if (this._betScaneTimer !== null) {
            clearTimeout(this._betScaneTimer);
            this._betScaneTimer = null;
        };
    }

    private _setShowBtnInteractable(interactable: boolean) {
        this.btn_show.interactable = interactable;
        this.btn_show.enableAutoGrayEffect = !interactable;
    }


     /**
     * 设置充值相关数据，显示其内容并启动倒计时。
     * @param data 充电产品信息，类型为IPaymentProduct。
     * @param time 剩余的充电时间，单位为秒。
     * @param winRate 充值后获得的胜率。
     * 该函数不返回任何内容。
     */
    setActBtnsRechargeData(data: IPaymentProduct, time: number, winRate: number) {
        if (data == null) {
            this._clearRechargeActTimer();
            this.node_recharge.active = false;
            this._rechargeProduct = null;
            this._rechargeActTime = 0;
            this._winRate = null;
        }
        else {
            this._clearRechargeActTimer();
            this.lab_rechargeTip.string = `You have ${time}s to recharge`;
            this.node_recharge.active = true;
            this._rechargeProduct = data;
            this._rechargeActTime = time;
            this._winRate = winRate;

            let actTime = 0.5;
            this.btn_recharge.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1,1), cc.scaleTo(actTime, 1.1, 0.9), cc.scaleTo(actTime, 1, 1))));

            let actFun = () => {
                time -= 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_rechargeTip, true)) == false) {
                    clearInterval(loaclRechargeActTimer);
                    loaclRechargeActTimer = null;
                    return;
                }; 
                if (time <= 0) {
                    this._clearRechargeActTimer();
                    this.lab_rechargeTip.string = "";
                    this.node_recharge.active = false;
                    this._rechargeProduct = null;
                    this._rechargeActTime = 0;
                    this._winRate = null;
                    return;
                };
                this.lab_rechargeTip.string = `You have ${time}s to recharge`;
                this._rechargeActTime = time;
            };
            let loaclRechargeActTimer = setInterval(actFun, 1000);
            this._rechargeTimer = loaclRechargeActTimer;
        }
    }

    private _clearRechargeActTimer() {
        if (this._rechargeTimer !== null) {
            clearInterval(this._rechargeTimer);
            this._rechargeTimer = null;
        };
    }
}
