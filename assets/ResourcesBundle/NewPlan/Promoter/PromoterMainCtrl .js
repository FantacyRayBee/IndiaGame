cc.Class({
    extends: cc.Component,

    properties: {
        txt_num: cc.Label,
        toggle_rank: cc.Toggle,
        toggle_rule: cc.Toggle,
        toggle_reward: cc.Toggle,
        toggle_referral: cc.Toggle,
        btn_fb: cc.Button,
        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_share: cc.Button,
    },

    ctor: function () {
        this.promoterData = null;
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        this.node_root_rank = this.viewList["bg/root_rank"];
        this.node_root_rule = this.viewList["bg/root_rule"];
        this.node_root_rewards = this.viewList["bg/root_rewards"];
        this.node_root_referral = this.viewList["bg/root_referral"];
        this.node_btn_mainClose = this.viewList["bg/up/btn_mainClose"];
        this.node_btn_withdraw = this.viewList["bg/up/money/btn_withdraw"];

        this.node_btn_mainClose.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_fb.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_rank.node.on('toggle', this.toggleClick, this);
        this.toggle_rule.node.on('toggle', this.toggleClick, this);
        this.toggle_reward.node.on('toggle', this.toggleClick, this);
        this.toggle_referral.node.on('toggle', this.toggleClick, this);

        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/info";
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (msg.result == 0) {
                if (CommonFun.getInstance().isValidForScr(this) && msg.data) {
                    // this.setPromoterInfo(msg.data);
                };
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
    
    start: function() {
        this.NowToggleName = "toggle_rank"
        this.setViewByToggleName(this.NowToggleName)
    },


    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "ConcactsArrStr") {
            
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
        if (btnName == 'btn_telegram') {
            // Skip TO Telegram
            let str = this.channel_info.telegram;
            let arr = str.split('/');
            let pageid = arr[arr.length - 1];
            APPManager.skipToOtherApp('org.telegram.messenger', pageid);
        } 
        if (btnName == 'btn_whatsapp') {
            // Skip to WhatsApp
            let channel_info = {...GlobalCfg.USER_DATAS.customerService};
            let whatsAppInfos = channel_info.whatsApp.split(',');
            let mobileNum = whatsAppInfos[0].match(/\d+/g);
            APPManager.skipToOtherApp("com.whatsapp", "https://api.whatsapp.com/send?phone=" + mobileNum);
        }
        if (btnName == 'btn_fb') {
            let whatsAppInfos = this.channel_info.whatsApp.split(',');
            let channelLink = whatsAppInfos[1];
            APPManager.skipToOtherApp("com.facebook", channelLink);
        }
        if (btnName == 'btn_share') {
            let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.Share(shareUrl);
        }
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
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