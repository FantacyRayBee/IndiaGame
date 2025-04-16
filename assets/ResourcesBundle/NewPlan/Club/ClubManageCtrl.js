cc.Class({
    extends: cc.Component,

    properties: {
        //root_manage
        btn_manageClose_manage: cc.Button,
        btn_search_manage: cc.Button,
        btn_last_manage: cc.Button,
        btn_next_manage: cc.Button,
        node_manage_content: cc.Node,
        node_manage_item: cc.Node,
        editBox_manage:cc.EditBox,
        lb_yeshu_manage: cc.Label,
    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        //root_manage
        this.btn_manageClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_search_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_last_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_next_manage.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
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
        if (btnName === "btn_manageClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnCloseEvent();
            return;
        } 
        if (btnName === "btn_search_manage") {
        } 
        if (btnName === "btn_last_manage") {
        } 
        if (btnName === "btn_next_manage") {
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function () {
        this.node.destroy();
    },
});