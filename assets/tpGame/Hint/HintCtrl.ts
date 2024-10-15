const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/HintCtrl')
export default class HintCtrl extends cc.Component {

    @property(cc.Label)
    private lab_content: cc.Label = null;

    @property(cc.Button)
    private btn_pack: cc.Button = null;

    @property(cc.Button)
    private btn_continue: cc.Button = null;


    protected onLoad(): void {
        //@ts-ignore
        this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_continue.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }


    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_pack.node.name:
                this.dealBtnPackEvent();
                break;
            case this.btn_continue.node.name:
                this.setHintActive(false);
                break;
            default:
                break;
        }
    }

    dealBtnPackEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.drop", "DropReq", {});
        this.setHintActive(false);
    }

    /**
     * 设置Hint界面是否显示
     * @param active 是否显示
     */
    setHintActive(active: boolean) {
        this.node.active = active;
    }

    /**
     * 设置Hint界面胜率
     * @param winRate 胜率
     */
    setHitWinRate(winRate: number) {
        this.lab_content.string = `Your probability of winning this round is ${(winRate/100).toFixed(2)}%\nAre yor sure to pack?`;
    }
}
