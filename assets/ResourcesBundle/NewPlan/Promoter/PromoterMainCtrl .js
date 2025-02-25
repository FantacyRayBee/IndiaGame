cc.Class({
    extends: cc.Component,

    properties: {
        txt_num: cc.Label,
        toggle_rank: cc.Toggle,
        toggle_rule: cc.Toggle,
        toggle_reward: cc.Toggle,
        toggle_referral: cc.Toggle,
        btn_withdraw: cc.Button,

    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        this.node_root_rank = this.viewList["root_rank"];
        this.node_root_rule = this.viewList["root_rule"];
        this.node_root_rewards = this.viewList["root_rewards"];
        this.node_root_referral = this.viewList["root_referral"];
        this.node_btn_mainClose = this.viewList["up/btn_mainClose"];

        this.node_btn_mainClose.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_withdraw.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_rank.node.on('toggle', this.toggleClick, this);
        this.toggle_rule.node.on('toggle', this.toggleClick, this);
        this.toggle_reward.node.on('toggle', this.toggleClick, this);
        this.toggle_referral.node.on('toggle', this.toggleClick, this);

        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/income/recordV1";
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            LoggerUtil.getInstance().log("caojun msg === " , msg);
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.promoterRewardsData = msg.data
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);

        let httpUrl2 = GlobalCfg.HTTP_SERVER + "/v1/promoter/makemoneyreferrals";
        CommonFun.getInstance().httpGet(httpUrl2, (msg) => {
            LoggerUtil.getInstance().log("caojun msg === " , msg);
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.promoterReferralData = msg.data
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
    
    start: function() {
        this.NowToggleName = "toggle_rank"
        this.setViewByToggleName(this.NowToggleName)
        this.txt_num.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            this.txt_num.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GET_TGY_REWARD 
            || msgId == GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD) {
                this.txt_num.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        } 
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_mainClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnMainCloseEvent();
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    dealBtnWithDrawEvent: function() {
        CommonFun.getInstance().showWithDrawPreData();
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return
        if (this.node_root_rank) {
            this.node_root_rank.active = toggleName == "toggle_rank";
        };
        if (this.node_root_rule) {
            this.node_root_rule.active = toggleName == "toggle_rule";
        };
        if (this.node_root_rewards) {
            this.node_root_rewards.active = toggleName == "toggle_reward";
        };
        if (this.node_root_referral) {
            this.node_root_referral.active = toggleName == "toggle_referral";
        };
        this.NowToggleName = toggleName
    },
});