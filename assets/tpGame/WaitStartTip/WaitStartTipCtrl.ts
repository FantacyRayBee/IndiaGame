const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/WaitStartTipCtrl')
export default class WaitStartTipCtrl extends cc.Component {

    @property(cc.Label)
    private lab_content: cc.Label = null;

    private _pointArr = [".", "..", "..."];

    private _pointTimer: number = null;

    private _defaultContent: string = "Waiting for other players join the game";

    protected onDestroy(): void {
        this._clearPointTimer();
    }

    /**
     * 设置等待开始提示框是否显示
     * @param active 是否显示
     */
    setWaitStartTipActive(active: boolean) {
        this._clearPointTimer();
        if (active) {
            let pointIndex = 0;
            this.lab_content.string = `${this._defaultContent} ${this._pointArr[pointIndex]}`;
            this.node.active = true;

            let actFun = () => {
                pointIndex += 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_content, true)) == false) {
                    clearInterval(loaclPointTimer);
                    loaclPointTimer = null;
                    return;
                }; 
                this.lab_content.string = `${this._defaultContent} ${this._pointArr[pointIndex%3]}`;
            };
            let loaclPointTimer = setInterval(actFun, 1000);
            this._pointTimer = loaclPointTimer;
        } 
        else {
            this.node.active = false;
        };
    }

    private _clearPointTimer() {
        if (this._pointTimer !== null) {
            clearInterval(this._pointTimer);
            this._pointTimer = null;
        };
    }
}
