import TpGameCtrl from "../TpGameCtrl";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/TableInfoCtrl')
export class TableInfoCtrl extends cc.Component {

    @property(cc.Label)
    private lab_bootAmount: cc.Label = null;

    @property(cc.Label)
    private lab_chaalLimit: cc.Label = null;

    @property(cc.Label)
    private lab_maxBlinds: cc.Label = null;

    @property(cc.Label)
    private lab_potLimit: cc.Label = null;

    @property(cc.Button)
    private btn_changeTable: cc.Button = null;

    private _tpGameCtrl: TpGameCtrl = null;

    private _changeTableTimer: number = null;


    protected onLoad(): void {
        //@ts-ignore
        this.btn_changeTable.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 2), this);
    }

    protected onDestroy(): void {
        this._clearChangeTableTimer();
    }


    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_changeTable.node.name:
                this._dealBtnChangeTableEvent();
                break;
            default:
                break;
        }
    }

    private _dealBtnChangeTableEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.changeroom", "ChangeRoomAck", {});
       
        this._setBtnChangeAnim(false);
    }

    initTpGameCtrl(tpGameCtrl: TpGameCtrl) {
        this._tpGameCtrl = tpGameCtrl;
    }

    /**
     * 设置牌桌信息
     * @param data 牌桌信息
     */
    setTableInfoData(data: ITableInfo) {
        this.lab_bootAmount.string = `${data.bootAmount}`;
        this.lab_chaalLimit.string = `${data.chaalLimit}`;
        this.lab_maxBlinds.string = `${data.maxBlinds}`;
        this.lab_potLimit.string = `${data.potLimit}`;
    }


    /**
     * 设置牌桌信息的节点是否显示
     * @param active 是否显示
     */
    setTableInfoNodeActive(active: boolean) {
        this.node.active = active;
    }

    private _setBtnChangeAnim(isClear) {
        let fillRange = 0;
        let sprite_btn_changeTable = this.btn_changeTable.node.getChildByName("Background").getComponent(cc.Sprite);
        if (isClear) {
            this._clearChangeTableTimer();
            sprite_btn_changeTable.fillRange = 0;
            this.btn_changeTable.interactable = true;
        }
        else {
            this._clearChangeTableTimer();
            this.btn_changeTable.interactable = false;
            let actFun = () => {
                fillRange += -0.05;
                if ((cc.isValid(this, true) && cc.isValid(sprite_btn_changeTable, true)) == false) {
                    clearInterval(localChangeTableTimer);
                    localChangeTableTimer = null;
                    return;
                }; 
                if (fillRange <= -1) {
                    this._clearChangeTableTimer();
                    sprite_btn_changeTable.fillRange = 0;
                    this.btn_changeTable.interactable = true;
                    return;
                };
                sprite_btn_changeTable.fillRange = fillRange;
            };
            let localChangeTableTimer = setInterval(actFun, 100);
            this._changeTableTimer = localChangeTableTimer;
        };
    }

    private _clearChangeTableTimer() {
        if (this._changeTableTimer !== null) {
            clearInterval(this._changeTableTimer);
            this._changeTableTimer = null;
        }
    }
};

/**
 * 牌桌信息数据接口
 */
export interface ITableInfo {
    bootAmount: number;
    chaalLimit: number;
    maxBlinds: string;
    potLimit: number;
};
