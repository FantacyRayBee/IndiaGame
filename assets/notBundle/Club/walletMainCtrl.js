cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_help1: cc.Button,
        btn_help2: cc.Button,
        btn_takeout: cc.Button,
        btn_takein: cc.Button,
        content: cc.Node,
        lb_game:cc.Label,
        lb_wallet:cc.Label,
    },

    ctor: function () {
        this.string1 = `1. Game cash can be used to play games.\n2. If you don’t have enough coins, you need to withdraw coins from wallet cash.\n3. The coins in Game cash cannot be manipulated by your superiors.`
        this.string2 = `1. Wallet cash can be topped up and withdrawn by contacting your superior\n2. If you need to withdraw cash, pleasetake in your coins to Wallet cash in advance\n3. If you need to play games, please take out your coins to Game cash in advance`
        this.coins = [100,300,500,1000,2000,3000,5000,10000,20000,50000];
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.toggleList = [];
        // 遍历所有子节点
        for (let child of this.content.children) {
            let toggle = child.getComponent(cc.Toggle);
            this.toggleList.push(toggle);
            toggle.node.on('toggle', this.toggleClick, this);
        }
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_takeout.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_takein.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_help1.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_help2.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    start: function () {
        this.toggleList[0].isChecked = true;
        this.curAmount = this.coins[0]; // 默认选中第一个
        this.refreshView();
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnCloseEvent();
            return;
        } 
        if (btnName === "btn_help1") {
            CommonFun.getInstance().showMsgBox(this.string1, "YES", () => {}, false, null, null, null, cc.Label.HorizontalAlign.LEFT);
        } 
        if (btnName === "btn_help2") {
            CommonFun.getInstance().showMsgBox(this.string2, "YES", () => {}, false, null, null, null, cc.Label.HorizontalAlign.LEFT);
        } 
        if (btnName === "btn_out") {
            this.dealTakeEvent(2);
        } 
        if (btnName === "btn_in") {
            this.dealTakeEvent(1);
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    refreshView: function () {
        this.btn_takeout.interactable = this.curAmount <= (GlobalCfg.USER_DATAS.clubInfo.safe / 100);
        this.btn_takein.interactable = this.curAmount <= (GlobalCfg.USER_DATAS.userDiamond / 100);
        this.lb_wallet.string = CommonFun.getInstance().formatCurrencyAmount(CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.clubInfo.safe / 100));
        this.lb_game.string = CommonFun.getInstance().formatCurrencyAmount(CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100));
    },

    toggleClick: function (tog) {
        if (tog.isChecked) {
            let index = parseInt(tog.node.name);
            this.curAmount = this.coins[index];
        }
        this.refreshView();
    },

    dealTakeEvent: function (type) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/save_safe`;
        let httpdata = {
            amount: (type == 1 ? this.curAmount : -this.curAmount) * 100, // 1:取出 2:存入
        }
        CommonFun.getInstance().httpPost(httpUrl, httpdata, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                let amount = msg.data.amount;
                GlobalCfg.USER_DATAS.clubInfo.safe = amount;
                GlobalCfg.USER_DATAS.userDiamond -= httpdata.amount;
                this.refreshView();
                if (type == 1) {
                    CommonFun.getInstance().showTips("Take In success");
                } else {
                    CommonFun.getInstance().showTips("Take Out success");
                }
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_FIRST_GIFT_REWARD, msgData: {}});
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealBtnCloseEvent: function () {
        this.node.destroy();
    },
});