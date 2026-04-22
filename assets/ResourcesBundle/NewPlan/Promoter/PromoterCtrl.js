cc.Class({
    extends: cc.Component,

    properties: {},

    ctor: function () {
        this.promoterData = null;
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        this.node_bg_lab_for = this.viewList["bg/lab_for"];
        this.node_bg_lab_youCan = this.viewList["bg/lab_youCan"];
        this.node_bg_lab_share = this.viewList["bg/lab_share"];
        this.node_bg_lab_youRe = this.viewList["bg/lab_youRe"];
        this.node_bg_lab_ifYou = this.viewList["bg/lab_ifYou"];
        this.node_bg_lab_ifYouHave = this.viewList["bg/lab_ifYouHave"];

        this.node_btn_mainClose = this.viewList["btn_mainClose"];
        this.node_btn_fx = this.viewList["btn_fx"];
        this.node_btn_fz = this.viewList["btn_fz"];
        this.node_btn_sf = this.viewList["btn_sf"];
        this.node_btn_team = this.viewList["btn_team"];
        this.node_btn_history = this.viewList["btn_history"];
        this.node_btn_bonusTable = this.viewList["btn_bonusTable"];

        this.node_btn_get = this.viewList["btn_get"];

        this.node_btn_fx_lab = this.viewList["btn_fx/Background/lab"];
        this.node_btn_fz_lab = this.viewList["btn_fz/Background/lab"];
        this.node_btn_sf_lab = this.viewList["btn_sf/Background/lab"];
        this.node_btn_team_lab = this.viewList["btn_team/Background/lab"];
        this.node_btn_history_lab = this.viewList["btn_history/Background/lab"];
        this.node_btn_bonusTable_lab = this.viewList["btn_bonusTable/Background/lab"];
        this.node_btn_get_lab = this.viewList["btn_get/Background/lab"];
        this.node_btn_get_red_point = this.viewList["btn_get/Background/dian"];

        this.node_btn_teamTips = this.viewList["team/btn_teamTips"];
        this.node_lab_team = this.viewList["team/lab_team"];
        this.node_lab_teamTips = this.viewList["team/lab_teamTips"];

        this.node_btn_outPutTips = this.viewList["out/btn_outPutTips"];
        this.node_lab_outIncome = this.viewList["out/lab_outIncome"];
        this.node_lab_outIncomeTips = this.viewList["out/lab_outTips"];

        this.node_btn_invitedTips = this.viewList["invited/btn_invitedTips"];
        this.node_lab_invitedIncome = this.viewList["invited/lab_invitedIncome"];
        this.node_lab_invitedIncomeTips = this.viewList["invited/lab_invitedTips"];

        this.node_btn_totalTips = this.viewList["total/btn_totalTips"];
        this.node_lab_totalBonus = this.viewList["total/lab_totalBonus"];
        this.node_lab_totalBonusTips = this.viewList["total/lab_totalTips"];

        this.node_teamTipsView = this.viewList["teamTipsView"];
        this.node_opuPutTipsView = this.viewList["opuPutTipsView"];
        this.node_inviteTipsView = this.viewList["inviteTipsView"];
        this.node_bonusTipsView = this.viewList["bonusTipsView"];
        this.node_teamTipsView_lab_tips = this.viewList["teamTipsView/lab1"];
        this.node_opuPutTipsView_lab_tips = this.viewList["opuPutTipsView/lab1"];
        this.node_inviteTipsView_lab_tips = this.viewList["inviteTipsView/lab1"];
        this.node_bonusTipsView_lab_tips = this.viewList["bonusTipsView/lab1"];

        this.node_btn_mainClose.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_fx.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_fz.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_sf.on('click', CommonFun.getInstance().debounce(this.btnClick, 3), this);
        this.node_btn_team.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_history.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_bonusTable.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.node_btn_teamTips.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_btn_outPutTips.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_btn_invitedTips.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_btn_totalTips.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_btn_get.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.node_teamTipsView.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_opuPutTipsView.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_inviteTipsView.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);
        this.node_bonusTipsView.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.2), this);

        if(GlobalCfg.USER_DATAS.recharged == 0){
            // 未充值玩家
            this.showBtnWhatsApp(false);
        }else{
            this.showBtnWhatsApp(true);
        }

        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/info";
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (msg.result == 0) {
                if (CommonFun.getInstance().isValidForScr(this) && msg.data) {
                    this.setPromoterInfo(msg.data);
                };
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
        this.setTuiGuangYuanMainViewLanguage();
    },

    showBtnWhatsApp(bool){
        if(bool && (Object.values(GlobalCfg.USER_DATAS.customerService).length > 0 && Object.values(GlobalCfg.USER_DATAS.customerService).join("").length > 0)){
            this.node_btn_fx.setPosition(-350, -124);
            this.node_btn_fz.setPosition(-80, -124);
            this.node_btn_sf.setPosition(190, -124);
            this.node_btn_sf.active = true;
        }else{
            this.node_btn_sf.active = false;
            this.node_btn_fx.setPosition(-250, -124);
            this.node_btn_fz.setPosition(125, -124);
        }
    },

    setTuiGuangYuanMainViewLanguage: function () {
        // 1是英文 2是印地语 3乌尔都 4孟加拉语  默认英语 
        let teamTipsStr = "";
        let outIncomeTipsStr = "";
        let invitedIncomeTipsStr = "";
        let totalBonusTipsStr = "";

        let teamTipsViewTipsStr = "";
        let opuPutTipsViewTipsStr = "";
        let inviteTipsViewTipsStr = "";
        let bonusTipsViewTipsStr = "";

        let btnFXStr = "";
        let btnFZStr = "";
        let btnSFStr = "";
        let btnTeamStr = "";
        let btnHistoryStr = "";
        let btnBonusTableStr = "";
        let btnGetStr = "";

        let bgLabForStr = "";
        let bgLabYouCanStr = "";
        let bgLabShareStr = "";
        let bgLabYouReStr = "";
        let bgLabIfYouStr = "";
        let bgLabIfYouHaveStr = "";

        let leftSpriteFrame = null;
        let rightSpriteFrame = null;

        teamTipsStr = "Team";
        outIncomeTipsStr = "Output Income";
        invitedIncomeTipsStr = "Invited Income";
        totalBonusTipsStr = "Total Bonus";

        teamTipsViewTipsStr = "The friends you invite, as well as the friends they invite, Can loop indefinitely. All belong to your team.";
        opuPutTipsViewTipsStr = "Anyone in your team, as long as they win money, you will get a certain reward. The more people you invite, the more rewards you get.";
        inviteTipsViewTipsStr = "For anyone you invite, if they recharge  ₹100 for the firs time, you will receive a reward of ₹30. If they recharge ₹1000 for the first time, you will receive a reward of ₹300";
        bonusTipsViewTipsStr = "The system will calculate the bonus basedon the output value at am00 : 00, So your bonus for the day will be received the next day.";

        btnFXStr = "Share More";
        btnFZStr = "Copy Link";
        btnSFStr = "Service";
        btnTeamStr = "Team";
        btnHistoryStr = "History";
        btnBonusTableStr = "Bonus Table";
        btnGetStr = "GET \nBONUS";

        bgLabForStr = "For every ₹100 win , the system will reward ₹5";
        bgLabYouCanStr = "You can see the details at \"Bonus Table\"";
        bgLabShareStr = "Share with friend";
        bgLabYouReStr = "You're going to be a ";
        bgLabIfYouStr = "If your team has 1000 people a day, they each win <₹100. You can get a bonus of <₹5000 every day.";
        bgLabIfYouHaveStr = "If you have 10000 or 100000 people?";
        

        this.node_lab_teamTips.getComponent(cc.Label).string = teamTipsStr;
        this.node_lab_outIncomeTips.getComponent(cc.Label).string = outIncomeTipsStr;
        this.node_lab_invitedIncomeTips.getComponent(cc.Label).string = invitedIncomeTipsStr;
        this.node_lab_totalBonusTips.getComponent(cc.Label).string = totalBonusTipsStr;

        this.node_teamTipsView_lab_tips.getComponent(cc.Label).string = teamTipsViewTipsStr;
        this.node_opuPutTipsView_lab_tips.getComponent(cc.Label).string = opuPutTipsViewTipsStr;
        this.node_inviteTipsView_lab_tips.getComponent(cc.Label).string = inviteTipsViewTipsStr;
        this.node_bonusTipsView_lab_tips.getComponent(cc.Label).string = bonusTipsViewTipsStr;

        this.node_btn_fx_lab.getComponent(cc.Label).string = btnFXStr;
        this.node_btn_fz_lab.getComponent(cc.Label).string = btnFZStr;
        this.node_btn_sf_lab.getComponent(cc.Label).string = btnSFStr;
        this.node_btn_team_lab.getComponent(cc.Label).string = btnTeamStr;
        this.node_btn_history_lab.getComponent(cc.Label).string = btnHistoryStr;
        this.node_btn_bonusTable_lab.getComponent(cc.Label).string = btnBonusTableStr;
        this.node_btn_get_lab.getComponent(cc.Label).string = btnGetStr;

        this.node_bg_lab_for.getComponent(cc.Label).string = bgLabForStr;
        this.node_bg_lab_youCan.getComponent(cc.Label).string = bgLabYouCanStr;
        this.node_bg_lab_share.getComponent(cc.Label).string = bgLabShareStr;
        this.node_bg_lab_youRe.getComponent(cc.Label).string = bgLabYouReStr;
        this.node_bg_lab_ifYou.getComponent(cc.Label).string = bgLabIfYouStr;
        this.node_bg_lab_ifYouHave.getComponent(cc.Label).string = bgLabIfYouHaveStr;
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTER);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERLEFTVIEW);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "ConcactsArrStr") {
            
        }
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_mainClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.dealBtnMainCloseEvent();
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_fx") {
            this.dealBtnFXEvent();
        } else if (btnName === "btn_fz") {
            this.dealBtnFZEvent();
        } else if (btnName === "btn_sf") {
            this.dealBtnSFEvent();
        } else if (btnName === "btn_team") {
            if (this.promoterData && this.promoterData.team_id.length > 0) {
                this.dealBtnTeamEvent();
            }
            else {
                CommonFun.getInstance().showTips("No team information currently available!");
            };
        } else if (btnName === "btn_history") {
            this.dealBtnHistoryEvent();
        } else if (btnName === "btn_bonusTable") {
            this.dealBtnBonusTableEvent();
        } else if (btnName === "btn_teamTips") {
            this.dealBtnTeamTipsEvent();
        } else if (btnName === "btn_outPutTips") {
            this.dealBtnOutPutTipsEvent();
        } else if (btnName === "btn_invitedTips") {
            this.dealBtnInvitedTipsEvent();
        } else if (btnName === "btn_totalTips") {
            this.dealBtnTotalTipsEvent();
        } else if (btnName === "btn_get") {
            this.dealBtnGetEvent();
        } else if (btnName === "teamTipsView") {
            this.dealBtnTeamTipsViewEvent();
        } else if (btnName === "opuPutTipsView") {
            this.dealBtnOutPutTipsViewEvent();
        } else if (btnName === "inviteTipsView") {
            this.dealBtnInviteTipsViewEvent();
        } else if (btnName === "bonusTipsView") {
            this.dealBtnBonusTipsViewEvent();
        };
    },

    setPromoterInfo: function (data) {
        if (!data) {
            return;
        };
        this.promoterData = data;
        this.node_lab_team.getComponent(cc.Label).string = data["team_member_num"];
        this.node_lab_outIncome.getComponent(cc.Label).string = data["total_income"] / 100;
        this.node_lab_invitedIncome.getComponent(cc.Label).string = data["total_bonus"] / 100;
        this.node_lab_totalBonus.getComponent(cc.Label).string = (data["total_income"] + data["total_bonus"]) / 100;
    },

    dealBtnMainCloseEvent: function () {
        this.node.destroy();
    },

    dealBtnFXEvent: function () {
        let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
        APPManager.Share(shareUrl);
    },

    dealBtnFZEvent: function () {
        if (cc.sys.isNative) {
            let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.copyToPasteBoard(shareUrl);
            CommonFun.getInstance().showTips("Copy successful!");
        };
    },

    dealBtnSFEvent: function () {
        // // 跳转至WhatsApp
        // let channel_info = {...GlobalCfg.USER_DATAS.customerService};
        // let whatsAppInfos = channel_info.whatsApp.split(',');
        // let mobileNum = whatsAppInfos[0].match(/\d+/g);
        // // LoggerUtil.getInstance().log('whatsAppInfos', whatsAppInfos);
        // // LoggerUtil.getInstance().log('mobileNum', mobileNum);
        // APPManager.skipToOtherApp("com.whatsapp", "https://api.whatsapp.com/send?phone=" + mobileNum);
        CommonFun.getInstance().showCustomerService();
        this.node.destroy();
    },

    dealBtnTeamEvent: function () {
        this.showLeftView("teamView");
    },

    dealBtnHistoryEvent: function () {
        this.showLeftView("historyView");
    },

    dealBtnBonusTableEvent: function () {
        this.showLeftView("bonusView");
    },

    dealBtnTeamTipsEvent: function () {
        this.node_teamTipsView.active = true;
    },

    dealBtnOutPutTipsEvent: function () {
        this.node_opuPutTipsView.active = true;
    },

    dealBtnInvitedTipsEvent: function () {
        this.node_inviteTipsView.active = true;
    },

    dealBtnTotalTipsEvent: function () {
        this.node_bonusTipsView.active = true;
    },

    dealBtnGetEvent: function () {
        let self = this;
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/income/receive";
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (msg.result == 0) {
                if (msg.data && CommonFun.getInstance().isValidForScr(self)) {
                    self.setGetBonusResult(msg.data);
                };
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    setGetBonusResult: function (data) {
        if (!data) {
            return;
        };

        let income = data.income;
        let totalIncome = data.total_income;
        let totalBonus = data.total_bonus;
        let diamond = data.diamond;
        this.node_lab_outIncome.getComponent(cc.Label).string = totalIncome / 100;
        this.node_lab_invitedIncome.getComponent(cc.Label).string = totalBonus / 100;
        this.node_lab_totalBonus.getComponent(cc.Label).string = (totalIncome + totalBonus) / 100;
        if (income > 0) {
            GlobalCfg.USER_DATAS.userDiamond = diamond;
            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: income / 100 }]);
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.GET_TGY_REWARD,
                msgData: {price: 0}
            });
        } 
        else {
            CommonFun.getInstance().showTips("No rewards currently, Pick it up tomorrow");
        }

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.HIDE_TGY_REDPOINT, msgData: {}});
    },

    dealBtnTeamTipsViewEvent: function () {
        this.node_teamTipsView.active = false;
    },

    dealBtnOutPutTipsViewEvent: function () {
        this.node_opuPutTipsView.active = false;
    },

    dealBtnInviteTipsViewEvent: function () {
        this.node_inviteTipsView.active = false;
    },

    dealBtnBonusTipsViewEvent: function () {
        this.node_bonusTipsView.active = false;
    },

    showLeftView: function (typeStr) {
        CommonFun.getInstance().showPromoterLeftView(typeStr);
    },
});