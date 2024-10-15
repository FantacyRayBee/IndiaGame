import { ICompareCardToastInfo } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/CompareCardToastCtrl')
export default class CompareCardToastCtrl extends cc.Component {

    @property(cc.Label)
    private lab_pkName: cc.Label = null;

    @property(cc.Label)
    private lab_user01Name: cc.Label = null;

    @property(cc.Label)
    private lab_user02Name: cc.Label = null;

    @property(cc.Label)
    private lab_refuseTime: cc.Label = null;

    @property(cc.Sprite)
    private sprite_user01Tx: cc.Sprite = null;

    @property(cc.Sprite)
    private sprite_user02Tx: cc.Sprite = null;

    @property(cc.Button)
    private btn_refuse: cc.Button = null;

    @property(cc.Button)
    private btn_agree: cc.Button = null;

    private _waitAnswerTimer: number = null;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_refuse.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        //@ts-ignore
        this.btn_agree.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }

    protected onDestroy(): void {
        this.clearCompareCardToastTimer(); 
    }


    btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_refuse.node.name:
                this.dealBtnRefuseEvent();
                break;
            case this.btn_agree.node.name:
                this.dealBtnAgreeEvent();
                break;
        }
    }

    dealBtnRefuseEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", {agree: false});
    }

    dealBtnAgreeEvent() {
        //@ts-ignore
        GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", {agree: true});
    }

    /**
     * 设置比较卡牌的时间。
     * @param time 需要设置的时间，单位为秒。
     * 该函数首先检查时间是否大于0。如果是，它将清除现有的计时器，
     * 更新显示的时间，并启动一个新的计时器来递减时间。
     * 当时间减少到0或以下时，函数会发送一个拒绝比较的答案请求给游戏服务器。
     * 如果传入的时间不大于0，函数会直接清除计时器，更新显示，并发送拒绝比较的答案请求。
     */
    setCompareCardToastTime(time: number) {
        if (time > 0) {
            this.clearCompareCardToastTimer();
            this.lab_refuseTime.string = `Refuse ${time}s`;
            let actTimerCall = () => {
                time -= 1;
                if ((cc.isValid(this, true) && cc.isValid(this.lab_refuseTime, true)) == false) {
                    clearInterval(loaclWaitAnswerTimer);
                    loaclWaitAnswerTimer = null;
                    //@ts-ignore
                    GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", {agree: false});
                    return;
                };

                if (time <= 0) {
                    this.clearCompareCardToastTimer();
                    this.lab_refuseTime.string = "Refuse";
                    loaclWaitAnswerTimer = null;
                    //@ts-ignore
                    GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", {agree: false});
                    return;
                };

                this.lab_refuseTime.string = `Refuse ${time}s`;
            };
            let loaclWaitAnswerTimer = setInterval(actTimerCall, 1000);
            this._waitAnswerTimer = loaclWaitAnswerTimer;
        }
        else {
            this.clearCompareCardToastTimer();  
            this.lab_refuseTime.string = "Refuse";
            //@ts-ignore
            GameServerManager.send("gameservice.answercompare", "AnswerCompareReq", {agree: false});
        };
    }

    /**
     * 清除比较卡牌的计时器。
     * 该函数检查是否存在等待答案的计时器，如果存在，则清除该计时器并将内部计时器引用设置为null。
     */
    clearCompareCardToastTimer() {
        if (this._waitAnswerTimer !== null) {
            clearInterval(this._waitAnswerTimer);
            this._waitAnswerTimer = null;
        };
    }

    /**
     * 设置比较卡牌玩家信息
     * @param info 包含发动比牌信息和被比牌信息的对象，每个信息包含玩家名称和头像URL
     */
    setCompareCardToastPlayersInfo(info: ICompareCardToastInfo) {
        let launchInfo = info.launchInfo;
        let targetInfo = info.targetInfo;

        this.lab_pkName.string = launchInfo.name;
        
        this.lab_user01Name.string = launchInfo.name;
        cc.assetManager.loadRemote(launchInfo.headUrl, {ext: '.png'}, (err, texture: cc.Texture2D) => {
            if (!err && cc.isValid(this, true) && cc.isValid(this.sprite_user01Tx, true)) {
                let spriteFrame = new cc.SpriteFrame(texture);
                this.sprite_user01Tx.spriteFrame = spriteFrame;
                this.sprite_user01Tx.node.setContentSize(cc.size(120, 120));
            };
        });

        this.lab_user02Name.string = targetInfo.name;
        cc.assetManager.loadRemote(targetInfo.headUrl, {ext: '.png'}, (err, texture: cc.Texture2D) => {
            if (!err && cc.isValid(this, true) && cc.isValid(this.sprite_user02Tx, true)) {
                let spriteFrame = new cc.SpriteFrame(texture);
                this.sprite_user02Tx.spriteFrame = spriteFrame;
                this.sprite_user02Tx.node.setContentSize(cc.size(120, 120));
            };
        });
    }
}
