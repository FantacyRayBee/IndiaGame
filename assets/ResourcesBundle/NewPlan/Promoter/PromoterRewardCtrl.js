cc.Class({
    extends: cc.Component,

    properties: {
        tog_total: cc.Toggle,
        tog_yesterday: cc.Toggle,

        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_fb: cc.Button,
        btn_share: cc.Button,
        btn_claim: cc.Button,
        btn_last: cc.Button,
        btn_next: cc.Button,

        total_num:cc.Label,
        tax_num:cc.Label,
        bet_num:cc.Label,
        invited_num:cc.Label,
        welcome_num:cc.Label,
        claim_num:cc.Label,
        yeshu_num:cc.Label,

        item:cc.Node,
    },

    ctor: function () {
        this.promoterData = null;
    },

    onLoad: function () {
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_fb.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_claim.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.tog_total.node.on('toggle', this.toggleClick, this);
        this.tog_yesterday.node.on('toggle', this.toggleClick, this);

    },
    
    start: function() {
        this.NowToggleName = "tog_total"
        this.setViewByToggleName(this.NowToggleName)
    },


    onDestroy: function () {
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_claim") {
        } 
        if (btnName === "btn_last") {
        } 
        if (btnName === "btn_next") {
        } 
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
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    setViewByToggleName(toggleName) {
    },

});