cc.Class({
    extends: cc.Component,

    properties: {
        //main
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
        btn_bind: cc.Button,
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
        this.btn_bind.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        // root_operate
        this.btn_addcoin.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_withdraw.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_note.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.tog_setManage.node.on('toggle', CommonFun.getInstance().debounce(this.toggleClick, 0), this);
    },
    
    start: function() {
        this.lb_club_coin.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERMAIN);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId === "OPEN_CLUB_MEMBER_OPERATE") {
            self.dealMemberOperateEvent(notify.userData);
        }
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
            this.dealBtnManageEvent();
        } 
        if (btnName === "btn_record") {
            this.root_record.active = true;
        } 
        if (btnName === "btn_server") {
        } 
        if (btnName === "btn_cancel") {
            this.root_invited.active = false;
        } 
        if (btnName === "btn_bind") {
            this.dealBtnInvitedBindEvent();
        } 
        if (btnName === "btn_addcoin") {
        } 
        if (btnName === "btn_withdraw") {
        } 
        if (btnName === "btn_note") {
        } 
        
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    toggleClick: function (btn) {
        
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    dealMemberOperateEvent: function (data) {
        this.root_operate.active = true;
        //TODO
    },

    dealBtnManageEvent: function () {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_down`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.clubMembers = msg.data.infos;
                this.root_manage.active = true;
                this.root_manage.getComponent("ClubManageCtrl").initData();
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
    
    // root_invited
    dealBtnInvitedBindEvent: function () {
        if (this.editBox_invited.string == "") {
            CommonFun.getInstance().showTips("gameID is empty");
            return;
        }
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/bind_club_req`;
        let httpParam = {
            bindUid: this.editBox_invited.string,
        };
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                CommonFun.getInstance().showTips("invite success");
                this.editBox_invited.string = ""
                this.root_invited.active = false;
            }
            if (msg.result != 0) {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
    
    // root_operate
});