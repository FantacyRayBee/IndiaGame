const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/OwnRechargeTipCtrl')
export default class OwnRechargeTipCtrl extends cc.Component {

    @property(cc.Label)
    private lab_time: cc.Label = null;

    @property(cc.Sprite)
    private sprite_time: cc.Sprite = null;

    private _ownRechargeTipTimer: number = null;


    protected onDestroy(): void {
        this._clearOwnRechargeTipTimer();
    }

    /**
     * 设置充值倒计时
     * @param time 
     */
    setOwnRechargeTipTime(time: number) {
        //@ts-ignore
        LoggerUtil.getInstance().error(`setOwnRechargeTipTime time = ${time}`);
        this._clearOwnRechargeTipTimer();
        if (time <= 0) {
            this.lab_time.string = "";
            this.sprite_time.fillRange = 0;
            this.node.active = false; 
        }
        else {
            this.node.active = true; 
            this.lab_time.string = `${time}`;
            this.sprite_time.fillRange = time / 300;
            let actFun = () => {
                time -= 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_time, true) && cc.isValid(this.sprite_time, true)) == false) {
                    clearInterval(localOwnRechargeTipTimer);
                    localOwnRechargeTipTimer = null;
                    return;
                }; 
                if (time <= 0) {
                    this._clearOwnRechargeTipTimer();
                    this.lab_time.string = "";
                    this.sprite_time.fillRange = 0;
                    this.node.active = false; 
                    return;
                };
                this.lab_time.string = `${time}`;
                this.sprite_time.fillRange = time / 300;
            };
            let localOwnRechargeTipTimer = setInterval(actFun, 1000);
            this._ownRechargeTipTimer = localOwnRechargeTipTimer;
        };
    }

    private _clearOwnRechargeTipTimer() {
        if (this._ownRechargeTipTimer !== null) {
            clearInterval(this._ownRechargeTipTimer);
            this._ownRechargeTipTimer = null;
        }
    }
}
