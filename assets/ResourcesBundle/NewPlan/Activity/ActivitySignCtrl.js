cc.Class({
    extends: cc.Component,

    properties: {
        btn_sign: cc.Button,
        lab_day7: cc.Label,
        lab_day7Reward: cc.Label,
        node_day7Signed: cc.Node,
        node_day7Unsigned: cc.Node,
    },

    ctor: function() {
        this.itemPosArr = [
            cc.v2(-165, 84), cc.v2(-40, 84), cc.v2(85, 84), 
            cc.v2(-165, -77), cc.v2(-40, -77), cc.v2(85, -77), cc.v2(85, -77),
        ];

        this.signItemCtrlMap = new Map();
    },

    onLoad: function() {
        this.btn_sign.node.on('click', CommonFun.getInstance().debounce(this.onSignClick, 1), this);
        this.btn_sign.node.active = false;
        this.node_day7Signed.active = false;
        this.node_day7Unsigned.active = false;
    },

    start: function() {
        Promise.all([this.getSignList(), this.getSignItemPrefab()])
        .then((arr) => {
            this.setSignListItem(arr);
        })
        .catch((err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    onSignClick: function() {
        let timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
        if (GlobalCfg.USER_DATAS.userVip.level == false || GlobalCfg.USER_DATAS.userVip.level == 0 || (GlobalCfg.USER_DATAS.userVip.level > 0 && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time))
            {
            GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/sign";
            CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
                if (msg.result == 0 && msg.data) {
                    let data = msg.data;
                    if (data && CommonFun.getInstance().isValidForScr(this)) {
                        CommonFun.getInstance().showRewardsTips([{ id: 10, amount: data.gift / 100 }]);
    
                        if (GlobalCfg.USER_DATAS.signInfo) {
                            GlobalCfg.USER_DATAS.signInfo.today = data.today;
                            GlobalCfg.USER_DATAS.signInfo.done = true;
                        };
    
                        if (this.signItemCtrlMap.has(data.today)) {
                            let signItemCtrl = this.signItemCtrlMap.get(data.today);
                            signItemCtrl.setSignItemSigned();
                        };
    
                        if (data.today == 7) {
                            this.node_day7Signed.active = true;
                            this.node_day7Unsigned.active = false;
                        };
    
                        this.btn_sign.interactable = false;
                        this.btn_sign.enableAutoGrayEffect = true;
                    };
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        }
        else{
            CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', ()=>{
                CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
            }, false);
        }
    },

    getSignList: function() {
        return new Promise((resolve, reject) => {
            if (GlobalCfg.USER_DATAS.signInfo != null) {
                resolve(GlobalCfg.USER_DATAS.signInfo);
                return;
            };
    
            let url =  GlobalCfg.HTTP_SERVER + "/v1/signlist"; 
            CommonFun.getInstance().httpGet(url, (strInfo) => {  
                if (strInfo.result == 0) { 
                    GlobalCfg.USER_DATAS.signInfo = strInfo.data;
                    resolve(GlobalCfg.USER_DATAS.signInfo);
                }
                else {
                    CommonFun.getInstance().showTips(strInfo.msg);
                    reject(strInfo.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });  
    },

    getSignItemPrefab: function() {
        return new Promise((resolve, reject) => {
            let prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYSIGNITEM;
            let arr = prefabPath.split("/");
            let bundleName = arr[0];
            let path = prefabPath.substring(bundleName.length + 1);
            CommonFun.getInstance().loadBundle(bundleName, (bundle) => {
                bundle.load(path, cc.Prefab, (error, prefab) => {
                    if (!error) {
                        resolve(prefab);
                    }
                    else {
                        reject(error);
                    };
                });
            }, (err) => {
                reject(err);
            });
        });
    },

    setSignListItem: function(arr) {
        if (!Array.isArray(arr)) {
            return;
        };

        let signData = arr[0];
        let itemPrefab = arr[1];

        if (!itemPrefab) {
            return;
        };

        if (!signData) {
            LoggerUtil.getInstance().log(`No check-in data available`);
            return;
        };

        if (!signData.gifts || !Array.isArray(signData.gifts)) {
            LoggerUtil.getInstance().log(`The check-in list data is empty or not in array format`);
            return;
        };

        if (signData.gifts.length != 7) {
            LoggerUtil.getInstance().log(`Check in list data length error`);
            return;
        };

        let len = signData.gifts.length;
        let index = 0;
        let addSignItem = () => {
            let gift = signData.gifts[index];
            if (index <= 5) {
                let signItemPos = this.itemPosArr[index];
                let signItemNode = cc.instantiate(itemPrefab);
                let activitySignItemCtrl = signItemNode.getComponent("ActivitySignItemCtrl");
                if (activitySignItemCtrl) {
                    activitySignItemCtrl.setSignItemData(gift, signData.today, signData.done, index + 1);
                    this.signItemCtrlMap.set(index + 1, activitySignItemCtrl);
                };
                signItemNode.name = `signItemDay${index + 1}`;
                signItemNode.setPosition(signItemPos);
                this.node.addChild(signItemNode);
            }
            else if (index == 6) {
                this.lab_day7.string = "Day7";
                this.lab_day7Reward.string = `₹${gift/100}`;
                if (signData.today > 7) {
                    this.node_day7Signed.active = true;
                    this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == true) {
                    this.node_day7Signed.active = true;
                    this.node_day7Unsigned.active = false;
                }
                else if (signData.today == 7 && signData.done == false) {
                    this.node_day7Signed.active = false;
                    this.node_day7Unsigned.active = true;
                }
                else {
                    this.node_day7Signed.active = false;
                    this.node_day7Unsigned.active = false;
                };
            };
            index += 1;
            if (index == len) {
                this.btn_sign.node.active = true;
                if (signData.done == true) {
                    this.btn_sign.interactable = false;
                    this.btn_sign.enableAutoGrayEffect = true;
                };
                this.unschedule(addSignItem);
                return;
            };
        };
        this.schedule(addSignItem, 2/cc.game.getFrameRate(), len - 1, 0);
    },
});
