cc.Class({
    extends: cc.Component,

    properties: {
        txt_num: cc.Label,
        toggle_thisweek: cc.Toggle,
        toggle_nextweek: cc.Toggle,

        btn_whatsapp: cc.Button,
        btn_telegram: cc.Button,
        btn_help: cc.Button,
    },

    ctor: function () {
        this.promoterData = null;
    },

    onLoad: function () {
        this.btn_whatsapp.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_help.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_thisweek.node.on('toggle', this.toggleClick, this);
        this.toggle_nextweek.node.on('toggle', this.toggleClick, this);

    },
    
    start: function() {
        this.NowToggleName = "toggle_thisweek"
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
        if (btnName === "btn_help") {
            let prefabs = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.PROMOTERRULE);
            prefabs.then((prefab) => {
                let promoterNode = cc.instantiate(prefab);
                CommonFun.getInstance().addToPointParent(promoterNode, GlobalCfg.PREFAB_PARENT.PROMOTERRULE);  
            });
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