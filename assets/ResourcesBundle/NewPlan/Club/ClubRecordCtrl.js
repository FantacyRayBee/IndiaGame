cc.Class({
    extends: cc.Component,

    properties: {
        //root_record
        btn_manageClose_record: cc.Button,
        btn_search_record: cc.Button,
        btn_last_record: cc.Button,
        btn_next_record: cc.Button,
        node_record_content: cc.Node,
        node_record_item: cc.Node,
        editBox_record:cc.EditBox,
        lb_yeshu_record: cc.Label,
    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_recordClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_search_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },
    
    start: function() {
        
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_recordClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnCloseEvent();
            return;
        } 
        if (btnName === "btn_search_record") {
        } 
        if (btnName === "btn_last_record") {
        } 
        if (btnName === "btn_next_record") {
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function () {
        this.node.destroy();
    },

    // root_manage
    // root_record
    // root_invited
    // root_operate
});