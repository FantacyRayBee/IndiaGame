let EnumRecord = cc.Enum({
    RECHARGE: 0,
    WITHDRAW: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_tips: cc.Button,
        toggle_recharge: cc.Toggle,
        toggle_withDraw: cc.Toggle,
        scrollView_recharge: cc.ScrollView,
        scrollView_withDraw: cc.ScrollView,
    },


    ctor: function() {
        this.rechargeRecordData = null;
        this.withDrawRecordData = null;
    },


    onLoad: function() {
        this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_tips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.toggle_recharge.node.on("toggle", this.toggleClick, this);
        this.toggle_withDraw.node.on("toggle", this.toggleClick, this);
    },


    start: function() {
        this.dealToggleRechargeEvent();
    },


    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORD);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDTIPS);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDHELP);
    },


    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnBackEvent();
                break;
            case this.btn_tips.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnTipsEvent();
                break;
            default:
                break;
        }
    },


    toggleClick: function(tog) {
        let togName = tog.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        switch (togName) {
            case this.toggle_recharge.node.name:
                this.dealToggleRechargeEvent();
                break;
            case this.toggle_withDraw.node.name:
                this.dealToggleWithDrawEvent();
                break;
            default:
                break;
        }
    },


    dealBtnBackEvent: function() {
        CommonFun.getInstance().decVerticalAcc();
        this.node.destroy();
    },


    dealBtnTipsEvent: function() {
        CommonFun.getInstance().showTransactionRecordTips();
    },


    dealToggleRechargeEvent: function() {
        this.scrollView_recharge.node.active = true;
        this.scrollView_withDraw.node.active = false;
        if (this.rechargeRecordData === null) {
            Promise.all([this.getRechargeRecordData(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM)])
            .then((arr) => {
                let rechargeList = arr[0];
                let itemPrefab = arr[1];
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.rechargeRecordData = this.sortDate(rechargeList);
                    if (Array.isArray(this.rechargeRecordData) && this.rechargeRecordData.length > 0) {
                        this.addRecordItems(this.rechargeRecordData, itemPrefab, this.scrollView_recharge.content, EnumRecord.RECHARGE); 
                    };
                };     
            })
        };
    },


    dealToggleWithDrawEvent: function() {
        this.scrollView_recharge.node.active = false;
        this.scrollView_withDraw.node.active = true;
        if (this.withDrawRecordData === null) {
            Promise.all([this.getWithDrawRecordData(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.TRANSACTIONRECORDITEM)])
            .then((arr) => {
                let withDrawList = arr[0];
                let itemPrefab = arr[1];
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.withDrawRecordData = this.sortDate(withDrawList, "TX");;
                    if (Array.isArray(this.withDrawRecordData) && this.withDrawRecordData.length > 0) {
                        this.addRecordItems(this.withDrawRecordData, itemPrefab, this.scrollView_withDraw.content, EnumRecord.WITHDRAW); 
                    };
                };     
            })
        };
    },

    getRechargeRecordData: function() {
        return new Promise((resolve, reject) => {
            if (this.rechargeRecordData) {
                resolve(this.rechargeRecordData);
                return;
            };
            CommonFun.getInstance().showProgress();
            let url = `${GlobalCfg.HTTP_SERVER}/v1/payment/payment_record/list?page=1&size=20`;
            CommonFun.getInstance().httpGet(url, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg && msg.result == 0) {
                    GlobalCfg.uncleaned = msg.data.uncleaned;
                    resolve(msg.data.list);
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },

    
    sortDate: function (dataList, str) {
        if (dataList) {
            let created_at = null;
            let date = null;
            let time = null;
            for (let i = 0; i < dataList.length; i++) {
                if (str == "TX") {
                    created_at = dataList[i].applytime;
                    date = created_at.split("T")
                    time = date[1].split("+")
                } 
                else {
                    created_at = dataList[i].created_at;
                    date = created_at.split("T")
                    time = date[1].split("+")
                };
                let newTime = date[0] + " " + time[0];
                newTime = newTime.substring(0, 19);
                newTime = newTime.replace(/-/g, '/'); //必须把日期'-'转为'/'
                var timestamp = new Date(newTime).getTime();
                dataList[i].timestamp = timestamp
            }
            return dataList.sort(this.compare("timestamp"))
        } 
        else {
            return []
        };
    },

    compare: function(property) {
        return (a, b) => {
            let value1 = a[property];
            let value2 = b[property];
            return value2 - value1;
        };
    },


    getWithDrawRecordData: function() {
        return new Promise((resolve, reject) => {
            if (this.withDrawRecordData) {
                resolve(this.withDrawRecordData);
                return;
            };

            CommonFun.getInstance().showProgress();
            let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/payment/take_profit/list`;
            let httpParam = {
                "start": "2021-03-27 00:00:00",
                "end": this.getCurDate(),
                "page": 1,
                "size": 20,
            };
            CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg.result == 0) {
                    resolve(msg.data.list);
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                    reject();
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },


    getCurDate: function() {
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();

        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return year + "-" + month + "-" + day + " 00:00:00";
    },


    addRecordItems: function(arr, itemPrefab, parentNode, recordType) {
        let children = parentNode.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            node.destroy();
        };


        let index = 0;
        let len = arr.length;
        let addItem = () => {
            let recordItemData = arr[index];

            let recordItemNode = cc.instantiate(itemPrefab);
            parentNode.addChild(recordItemNode);
            let ctrl = recordItemNode.getComponent("TransactionRecordItemCtrl");
            ctrl.setTransactionRecordItemData(recordItemData, recordType);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 2/cc.game.getFrameRate(), len - 1, 0);
    },
});