const {ccclass, property} = cc._decorator;

@ccclass
export default class DiversionFreeTPCtrl extends cc.Component {

    @property(cc.Button)
    private btn_close: cc.Button = null;

    @property(cc.Button)
    private btn_addCash: cc.Button = null;

    @property(cc.Button)
    private btn_playNow: cc.Button = null;

    private _clickBtnPlayNowCallback: Function = null;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
        //@ts-ignore
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
        //@ts-ignore
        this.btn_playNow.node.on("click", CommonFun.getInstance().debounce(this._btnClickCall, 3), this);
    }

    protected onDestroy(): void {
        //@ts-ignore
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.DIVERSIONFREETP);
        //@ts-ignore
        GlobalCfg.IS_EXIST_DIVERSIONFREETP_VIEW = false;
    }

    private _btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this._dealBtnCloseEvent();
                break;
            case this.btn_addCash.node.name:
                this._dealBtnAddCashEvent();
                break;
            case this.btn_playNow.node.name:
                this._dealBtnPlayNowEvent();
                break;
            default:
                break;
        }
    }

    private _dealBtnCloseEvent() {
        this.node.destroy();
    }

    private _dealBtnAddCashEvent() {
        //@ts-ignore
        let commodity = GlobalCfg.USER_DATAS.first_pay_product.sort((a, b) => {
            return a.amount - b.amount;
        });
        //@ts-ignore
        CommonFun.getInstance().rechargeByCommodityId(commodity[0]?.id, GlobalCfg.SHOP_RECHARGE_FROM.DiversionFreeTP, () => {});
        this.node.destroy();
    }

    private _dealBtnPlayNowEvent() {
        if (this._clickBtnPlayNowCallback) {
            this._clickBtnPlayNowCallback();
        };
        this.tryEnterMinScoreTP();
    }

    setDiversionFreeTPBtnPlayNowCallback(callback: Function) {
        this._clickBtnPlayNowCallback = callback;
    }

    tryEnterMinScoreTP() {
        //@ts-ignore
        if (CommonFun.getInstance().isNeedUpdata("tpGame") == false) {
            //@ts-ignore
            if (GlobalCfg.USER_DATAS.openModules.includes(100)) {
                //@ts-ignore
                let teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
                teenPattiRoomInfo = teenPattiRoomInfo.sort((a, b) => {
                    return a.entrycondition - b.entrycondition;
                });
                teenPattiRoomInfo = teenPattiRoomInfo.filter((item) => {
                    return item.trial == false && item.isblind == false;
                });
                let itemData = null;
                for (let i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                    //@ts-ignore
                    if (teenPattiRoomInfo[i].entrycondition <= GlobalCfg.USER_DATAS.userDiamond && GlobalCfg.USER_DATAS.userDiamond <= teenPattiRoomInfo[i].entryconditionmax) {
                        itemData = teenPattiRoomInfo[i];
                        break;
                    };
                };
                if (!itemData) {
                    //@ts-ignore
                    window.isNeedShowRoomList = "tpGame";
                    //@ts-ignore
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
                    this.node.destroy();
                    return;
                };

                //@ts-ignore
                GameServerManager.clientCloseServer();
                //@ts-ignore
                CommonFun.getInstance().showProgress();
                this.scheduleOnce(() => {
                    this.node.destroy();
                    //@ts-ignore
                    GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
                    //@ts-ignore
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
                }, 2);
            }
            else {
                //@ts-ignore
                CommonFun.getInstance().showTips(`TeenPatti is not open yet!`); 
            };
        }
        else {
            //@ts-ignore
            GameDownloader.getInstance().priorLoadGame("tpGame");
            //@ts-ignore
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.TEENPATTI, SceneManager.getInstance().sceneType.LOBBY);
            this.node.destroy();
        };
    }
}
