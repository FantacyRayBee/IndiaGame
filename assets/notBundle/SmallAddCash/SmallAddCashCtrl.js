cc.Class({
    extends: cc.Component,

    properties: {
        btns: [cc.Button],
        lab_cion: cc.Label,
        lab_addCash: cc.Label,
        lab_OtherAmiount: cc.Label,
    },

    ctor: function () {
        this.selectCoin = 0;
    },

    onLoad() {
        for (let i = 0, len = this.btns.length; i < len; i++) {
            this.btns[i].node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this)
        };
        this.lab_addCash.string = "Add Cash";
        this.lab_OtherAmiount.string = "Other Amount>>";
    },


    btnClick: function(button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_addCash" && this.selectCoin != 0) {
            CommonFun.getInstance().showNewShop();
        }
        else if (btnName == 'btn_otherAmount') {
            CommonFun.getInstance().showNewShop(true);
        }
        this.node.destroy();
    },

    setAddCashCion: function(gameName, cellScore) {
        let typeUpperCase = gameName ? gameName.toUpperCase() : "";
        LoggerUtil.getInstance().log(`setAddCashCion- gameName: ${gameName}, cellScore: ${cellScore}`);
        let commodity = CommonFun.getInstance().dealShopList(GlobalCfg.USER_DATAS.userDiamond, GlobalCfg.USER_DATAS.store)
        let coin = commodity[0] ? commodity[0].amount : 0;
        let func = function (curMax) {
            let index = commodity.length - 1;
            for (let i = 0; i < commodity.length; i++) {
                const item = commodity[i];
                if(item.amount > curMax) {
                    index = i;
                    break
                }
            }
            return index
        }
        let last_recharged = GlobalCfg.USER_DATAS.lastRecharged;
        let curIndex = func(last_recharged);
        coin = commodity[curIndex].amount;
        if (typeUpperCase == "TEENPATTI") {
            let teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti.sort((a, b) => {
                return a.entrycondition - b.entrycondition;
            });
            for (let i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
                if (teenPattiRoomInfo[i].cellscore == cellScore) {
                    let entrycondition = teenPattiRoomInfo[i].entrycondition;
                    for (let k = 0, len1 = commodity.length; k < len1; k++) {
                        if (commodity[k].amount >= entrycondition) {
                            coin = commodity[k].amount;
                            break;
                        };
                    };
                };
            };
        } 
        else if (typeUpperCase == "RUMMY") {
            let rummyRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.rummy.sort((a, b) => {
                return a.entrycondition - b.entrycondition;
            });
            for (let i = 0, len = rummyRoomInfo.length; i < len; i++) {
                if (rummyRoomInfo[i].cellscore == cellScore) {
                    let entrycondition = rummyRoomInfo[i].entrycondition;
                    for (let k = 0, len1 = commodity.length; k < len1; k++) {
                        if (commodity[k].amount >= entrycondition) {
                            coin = commodity[k].amount;
                            break;
                        };
                    };
                };
            };
        }; 
        coin = Math.floor(coin / 100);
        this.selectCoin = coin;

        this.lab_cion.string = `$${coin}`;
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SMALLADDCASH);
    },
});