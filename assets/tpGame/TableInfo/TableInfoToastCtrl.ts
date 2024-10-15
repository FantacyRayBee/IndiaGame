import { ITableInfo } from "./TableInfoCtrl";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/TableInfoToastCtrl')
export default class TableInfoToastCtrl extends cc.Component {

    @property(cc.Label)
    private lab_bootAmount: cc.Label = null;

    @property(cc.Label)
    private lab_chaalLimit: cc.Label = null;

    @property(cc.Label)
    private lab_maxBlinds: cc.Label = null;

    @property(cc.Label)
    private lab_potLimit: cc.Label = null;

    @property(cc.Button)
    private btn_ok: cc.Button = null;


    protected onLoad(): void {
        //@ts-ignore
        this.btn_ok.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }


    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.setTableInfoToastActive(false);
    }

    /**
     * 设置桌信息
     * @param data 
     */
    setTableInfoToastData(data: ITableInfo) {
        this.lab_bootAmount.string = `${data.bootAmount}`;
        this.lab_chaalLimit.string = `${data.chaalLimit}`;
        this.lab_maxBlinds.string = `${data.maxBlinds}`;
        this.lab_potLimit.string = `${data.potLimit}`;
    }

    /**
     * 设置桌信息弹框是否显示
     * @param active 是否显示
     */
    setTableInfoToastActive(active: boolean) {
        this.node.active = active;
    }
}
