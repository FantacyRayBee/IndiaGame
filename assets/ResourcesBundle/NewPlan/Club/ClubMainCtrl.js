cc.Class({
    extends: cc.Component,

    properties: {
        //main
        lb_my_code: cc.Label,
        lb_club_coin: cc.Label,
        btn_invited: cc.Button,
        btn_manager: cc.Button,
        btn_record: cc.Button,
        btn_server: cc.Button,
        btn_mainClose: cc.Button,
        root_manage: cc.Node,
        root_record: cc.Node,
        root_invited: cc.Node,
        root_operate: cc.Node,
        // root_invited
        btn_invitedClose: cc.Button,
        btn_invited: cc.Button,
        editBox_invited:cc.EditBox,
        // root_operate
        editBox_addcoin:cc.EditBox,
        editBox_withdraw:cc.EditBox,
        editBox_note:cc.EditBox,
        btn_addcoin: cc.Button,
        btn_withdraw: cc.Button,
        btn_note: cc.Button,
        tog_setManage: cc.Toggle,
        lb_nick_operate: cc.Label,
        lb_id_operate: cc.Label,
        lb_coin_operate: cc.Label,
    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        //main
        this.btn_mainClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_invited.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_manager.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_record.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_server.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        // root_invited
        this.btn_invitedClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_invited.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        // root_operate
        this.btn_addcoin.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_withdraw.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_note.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.tog_setManage.node.on('toggle', this.toggleClick, this);
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
        if (btnName === "btn_mainClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnMainCloseEvent();
            return;
        } 
        if (btnName === "btn_invited") {
            this.root_invited.active = true;
        } 
        if (btnName === "btn_manager") {
            this.root_manage.active = true;
        } 
        if (btnName === "btn_record") {
            this.root_record.active = true;
        } 
        if (btnName === "btn_server") {
        } 
        if (btnName === "btn_invitedClose") {
            this.root_invited.active = false;
        } 
        if (btnName === "btn_invited") {
        } 
        if (btnName === "btn_addcoin") {
        } 
        if (btnName === "btn_withdraw") {
        } 
        if (btnName === "btn_note") {
        } 
        
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },
    // root_invited
    // root_operate
});