cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Button,
        btnShop: cc.Button,
        labBefore: cc.Label,
        labAfter: cc.Label,
    },

    ctor(){
        this.curData = {};
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.btnClose.node.on('click', () => {
            this.node.destroy();
        });
        this.btnShop.node.on('click', () => {
            this.clickToRecharge("pay");
        });
    },

    /**
     * 
     * @param {String} type 默认 Lobby ，百人游戏 MorePeople，TP_Rummy
     */
    initByType(type){
        GlobalCfg.USER_DATAS.discoList = GlobalCfg.USER_DATAS.discoList.sort((a,b) => a.amount - b.amount);
        let getIndexByLastRecharged = (curMax) => {
            let index = GlobalCfg.USER_DATAS.discoList.length - 1;
            for (let i = 0; i < GlobalCfg.USER_DATAS.discoList.length; i++) {
                /**
                 * amount:number
                 * gift:number
                 * id:number
                 * show:boolean
                 */
                let item = GlobalCfg.USER_DATAS.discoList[i];
                if (item.amount > curMax) {
                    index = i;
                    break;
                };
            };
            return index;
        };
        let getIndexByAllRecharged = () => {
            let index = -1;
            let all_recharged = GlobalCfg.USER_DATAS.recharged/100;
            if (all_recharged <= 5000) {
                if (GlobalCfg.USER_DATAS.discoList.length >= 1) {
                    index = 0;
                }
                else {
                    index = GlobalCfg.USER_DATAS.discoList.length - 1;
                }
            }
            else if (all_recharged >= 5001 && all_recharged <= 10000) {
                if (GlobalCfg.USER_DATAS.discoList.length >= 2) {
                    index = 1;
                }
                else {
                    index = GlobalCfg.USER_DATAS.discoList.length - 1;
                }
            }
            else if (all_recharged >= 10001 && all_recharged <= 20000) {
                if (GlobalCfg.USER_DATAS.discoList.length >= 3) {
                    index = 2;
                }
                else {
                    index = GlobalCfg.USER_DATAS.discoList.length - 1;
                }
            }
            else if (all_recharged >= 20001 && all_recharged <= 60000) {
                if (GlobalCfg.USER_DATAS.discoList.length >= 4) {
                    index = 3;
                }
                else {
                    index = GlobalCfg.USER_DATAS.discoList.length - 1;
                }
            }
            else if (all_recharged >= 60001) {
                if (GlobalCfg.USER_DATAS.discoList.length >= 5) {
                    index = 4;
                }
                else {
                    index = GlobalCfg.USER_DATAS.discoList.length - 1;
                }
            }
            return index;
        };
     
        let curIndex = getIndexByLastRecharged(GlobalCfg.USER_DATAS.lastRecharged);
        let curIndex2 = getIndexByAllRecharged();
        curIndex = curIndex2 > curIndex ? curIndex2 : curIndex;
        let defaultIndex = 0;
        if (curIndex > defaultIndex) {
            defaultIndex = curIndex;
        };
        this.curData = GlobalCfg.USER_DATAS.discoList[defaultIndex];
        if (this.curData) {
            this.setData(Number(this.curData.amount), Number(this.curData.amount) + Number(this.curData.gift));
        }
        else {
            this.setData(0, 0);
        };
    },

    setData(before, after) {
        this.labBefore.string = CommonFun.getInstance().formatCurrencyAmount(Number(before / 100));
        this.labAfter.string = CommonFun.getInstance().formatCurrencyAmount(Number(after / 100));
        this.btnShop.target.getChildByName('Label').getComponent(cc.Label).string = CommonFun.getInstance().formatCurrencyAmount(Number(before / 100));
    },

    // 点击去充值
    clickToRecharge(type) {
        let arr = SceneManager.getInstance().curSceneType.split("/");
        let curScene = arr[arr.length - 1];
        if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.SSC) {
            curScene = 'ssc'
        };
        SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.SuperDiscount + "/" + curScene + "/" + type;
        let _cb = ()=>{
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.node.destroy();
            };
        };

        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        if (rechargeNeedInfo) {
            // if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                CommonFun.getInstance().rechargeByCommodityId(this.curData.id, SHOPPING.from, _cb);
            // }
            // else {
            //     CommonFun.getInstance().showBindPhone('AddCash');
            // };
        }
        else {
            CommonFun.getInstance().rechargeByCommodityId(this.curData.id, SHOPPING.from, _cb);
        };
    },

    
    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SUPERDISCOUNT);
    },
});
