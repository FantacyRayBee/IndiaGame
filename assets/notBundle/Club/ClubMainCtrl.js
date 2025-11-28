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
        btn_OperateClose: cc.Button,
        root_manage: cc.Node,
        root_record: cc.Node,
        root_invited: cc.Node,
        root_operate: cc.Node,
        root_show: cc.Node,
        lb_desc: cc.RichText,
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
        sp_head_operate: cc.Sprite,
        // root_show
        btn_showClose: cc.Button,
        btn_share: cc.Button,
    },

    ctor: function () {
        this.shareStr = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！ https://www.tmaxter.in/?inviteCode=5010_0047537101"
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        //main
        this.btn_mainClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_OperateClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
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
        this.tog_setManage.node.on('toggle', CommonFun.getInstance().debounce(this.toggleClick, 1), this);
        // root_show
        this.btn_showClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },
    
    start: function() {
        this.lb_club_coin.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.clubInfo.safe / 100);
        let url = GlobalCfg.USER_DATAS.customerService.landingPage == '' ? 'https://02.haathee.net' : GlobalCfg.USER_DATAS.customerService.landingPage;
        let descString = `<color=#cccccc><size=23><b>
1.Invite your friends to download the game: <color=#fbbd4d>${url}</color>, Ask your friend to tell you his game ID.
2.Click the Invite function in the Club and enter his game ID, so that he will join your Club.
3.Your friend transfers money to you, you recharge his coins, and when he needs to withdraw money,you deduct his wallet coins and then transfer the money to your friend. All the income he generates belongs to you.
4.You can also give your subordinate the authority to control his subordinates in Management, so that he will become your subordinate agent
5.If you don’t have enough available coins, please contact customer service to purchase coins.
            </b></size></color>`
        this.lb_desc.string = descString;
        
        this.root_show.active = (GlobalCfg.IS_CLUB_MODE == 0);
        CommonFun.getInstance().setEditBoxEvent(this.editBox_invited, this.root_invited);
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
        if (msgId === "REFRESH_CLUB") {
        }
    },



    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_mainClose" || btnName == "btn_showClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnMainCloseEvent();
            return;
        } 
        if (btnName === "btn_invited") {
            this.root_invited.active = true;
        } 
        if (btnName === "btn_manager") {
            this.dealBtnManageEvent();
        } 
        if (btnName === "btn_OperateClose") {
            this.root_operate.active = false;
        } 
        if (btnName === "btn_record") {
            this.dealBtnRecordEvent();
        } 
        if (btnName === "btn_server") {
            this.dealBtnServiceEvent();
        } 
        if (btnName === "btn_cancel") {
            this.root_invited.active = false;
        } 
        if (btnName === "btn_bind") {
            this.dealBtnInvitedBindEvent();
        } 
        if (btnName === "btn_addcoin") {
            this.dealMemberCoinEvent(1);
        } 
        if (btnName === "btn_withdraw") {
            this.dealMemberCoinEvent(2);
        } 
        if (btnName === "btn_note") {
            this.dealMemberNoteEvent();
        } 
        if (btnName === "btn_share") {
            this.dealShareEvent();
        } 
        
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    toggleClick: function (tog) {
        if (tog.isChecked) {
            this.setMemberInfo(1, "1"); //设置成管理员
          } else {
            this.setMemberInfo(1, "0"); //设置成普通成员
          }
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    dealBtnServiceEvent: function() {
        CommonFun.getInstance().showCustomerService();
    },

    setMemberInfo: function (type, desc) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/set_club_user_info`;
        let httpParam = {
            to: this.curMemberOperateData.userId,
            types: type,
            value: desc,
        };
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                CommonFun.getInstance().showTips("set success");
                this.refreshMemberListByInfo(type, desc);
            }
            if (msg.result != 0) {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    //刷新成员列表
    refreshMemberListByAmount: function (amount) {
        this.lb_coin_operate.string = "Wallet cash:" + CommonFun.getInstance().numberToShow(amount / 100);
        for (let i = 0; i < GlobalCfg.USER_DATAS.clubMembers.length; i++) {
            let member = GlobalCfg.USER_DATAS.clubMembers[i];
            if (member.userId == this.curMemberOperateData.userId) {
                member.safe = amount;
                break;
            }
        }
        this.root_manage.getComponent('ClubManageCtrl').setData();
    },

    //刷新成员列表
    refreshMemberListByInfo: function (type, desc) {
        if (type == 1) {//设置该玩家的身份
            for (let i = 0; i < GlobalCfg.USER_DATAS.clubMembers.length; i++) {
                let member = GlobalCfg.USER_DATAS.clubMembers[i];
                if (member.userId == this.curMemberOperateData.userId) {
                    if (desc == "0") {
                        member.position = 1;
                    }
                    if (desc == "1") {
                        member.position = 2;
                    }
                    break;
                }
            }
        }
        if (type == 2) {//设置该玩家的备注
            for (let i = 0; i < GlobalCfg.USER_DATAS.clubMembers.length; i++) {
                let member = GlobalCfg.USER_DATAS.clubMembers[i];
                if (member.userId == this.curMemberOperateData.userId) {
                    member.notes = desc;
                    break;
                }
            }
        }
        this.root_manage.getComponent('ClubManageCtrl').setData();
    },

    //添加加载头像
    loadHeadSp: function (headUrl,realWidth,heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl,{ext: '.png'}, (err, texture) => {
                if(!err && cc.isValid(this) && cc.isValid(heaSprite)){
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth/heaSprite.node.width);
                }
            });
        }
    },

    //打开管理成员界面
    dealBtnManageEvent: function () {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_down`;
        CommonFun.getInstance().httpPost(httpUrl, {page:0}, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                this.root_manage.active = true;
                GlobalCfg.USER_DATAS.clubMembers = msg.data.infos;
                GlobalCfg.USER_DATAS.clubMemberCount = msg.data.count;
                this.root_manage.getComponent("ClubManageCtrl").initData();
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    //打开record界面
    dealBtnRecordEvent: function () {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/get_transfer_record`;
        let httpData = {
            page: 0,
            find_uid: "0",
        }
        CommonFun.getInstance().httpPost(httpUrl, httpData, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                this.root_record.active = true;
                GlobalCfg.USER_DATAS.clubRecords = msg.data.infos;
                GlobalCfg.USER_DATAS.clubRecordCount = msg.data.count;
                this.root_record.getComponent("ClubRecordCtrl").initData();
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
    dealMemberOperateEvent: function (data) {
        LoggerUtil.getInstance().log("caojun dealMemberOperateEvent =", data);
        this.curMemberOperateData = data;
        this.root_operate.active = true;
        this.loadHeadSp(data.head, 200, this.sp_head_operate);
        this.lb_id_operate.string = CommonFun.getInstance().getStrByLength("ID:" + data.userId, 12);
        this.lb_coin_operate.string = "Wallet cash:" + CommonFun.getInstance().numberToShow(data.safe / 100);
        this.lb_nick_operate.string = data.nickname;
        this.editBox_addcoin.string = "";
        this.editBox_withdraw.string = "";
        this.editBox_note.string = "";
        if (data.notes != "") {
            this.editBox_note.string = data.notes;
        }
        this.tog_setManage.isChecked = data.position == 2; //是否是管理员
    },

    dealMemberCoinEvent: function (type) {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/club/club_transfer`;
        let amounts = 0;
        if (type == 1) { //上分
            if (this.editBox_addcoin.string == '') { 
                CommonFun.getInstance().showTips("Operation Failed");
                return;
            }
            amounts = parseInt(this.editBox_addcoin.string) * 100
            if (amounts < 100 * 100) {  //最小上分金额100起
                CommonFun.getInstance().showTips("Operation Failed");
                return;
            }
            LoggerUtil.getInstance().log(`caojun amounts = ${amounts}, safe = ${GlobalCfg.USER_DATAS.clubInfo.safe * 100}`);
            if (amounts > (GlobalCfg.USER_DATAS.clubInfo.safe) || amounts < 100*100) {
                CommonFun.getInstance().showTips("Insufficient available coins");
                return;
            }
        }
        if (type == 2) { //下分
            if (this.editBox_withdraw.string == '') { 
                CommonFun.getInstance().showTips("Operation Failed");
                return;
            }
            amounts = parseInt(this.editBox_withdraw.string) * 100
            if (amounts < 100 * 100) {  //最小下分金额100起
                CommonFun.getInstance().showTips("Operation Failed");
                return;
            }
            LoggerUtil.getInstance().log(`caojun amounts = ${amounts}, safe = ${this.curMemberOperateData.safe}`);
            if (amounts > (this.curMemberOperateData.safe)) { //如果下分金额大于当前用户余额
                CommonFun.getInstance().showTips("Insufficient available coins");
                return;
            }
            amounts = -amounts;
        }
        let httpdata = {
            to: this.curMemberOperateData.userId,
            amount: amounts,
        }
        CommonFun.getInstance().httpPost(httpUrl, httpdata, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                let data = msg.data;
                CommonFun.getInstance().showTips("Operation success");
                this.editBox_addcoin.string = "";
                this.editBox_withdraw.string = "";
                this.refreshMemberListByAmount(data.to_amount);
                this.lb_club_coin.string = CommonFun.getInstance().numberToShow(data.amount / 100);
            } else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    //跳转
    dealShareEvent: function () {
        cc.sys.openURL(GlobalCfg.USER_DATAS.service_help_url);
    },

    dealMemberNoteEvent: function () {
        this.setMemberInfo(2, this.editBox_note.string);
    },
});