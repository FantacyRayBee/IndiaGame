cc.Class({
    extends: cc.Component,

    properties: {
        //0为系统邮件 1为反馈奖励邮件
        btnList: [cc.Button],
        content: cc.Label,
        title: cc.Label,
    },

    ctor: function() {
        this.emailData = null;
    },

    onLoad: function() {
        for (let i = 0; i < this.btnList.length; i++) {
            let btn = this.btnList[i];
            btn.node.on('click', this.btnClick, this);
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FEEDBACKEMAIL);
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == 'btn_ok') {
            this.node.destroy();
        } 
        else if (btnName == 'btn_get') {
            CommonFun.getInstance().showProgress();
            let url = GlobalCfg.HTTP_SERVER + "/v1/mailbox/takeattaches";
            let paramData = { mail_id: this.emailData.id };
            CommonFun.getInstance().httpPost(url, paramData, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg.result == 0 && msg.data && msg.data.awards) {
                    if (CommonFun.getInstance().isValidForScr(this)) {
                        this.emailData.award_state = true;
                        this.btnList[1].node.active = false;
                        this.btnList[0].node.active = true;
                    };

                    let addDepositNum = 0;
                    let addWinningsNum = 0;
                    let addBonusNum = 0;
                    for (let i = 0; i < msg.data.awards.length; i++) {
                        let award = msg.data.awards[i];
                        if (award.kind == 3 || award.kind == 10) {
                            addDepositNum += award.num;
                        }
                        else if (award.kind == 11) {
                            addWinningsNum += award.num;
                        }
                        else if (award.kind == 12) {
                            addBonusNum += award.num;
                        };
                    };

                    let arr = [];
                    if (addDepositNum > 0) {
                        GlobalCfg.USER_DATAS.deposit += addDepositNum;
                        GlobalCfg.USER_DATAS.userDiamond += addDepositNum;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                        arr.push({ id: 10, amount: addDepositNum / 100 });
                    };
                    if (addWinningsNum > 0) {
                        GlobalCfg.USER_DATAS.winnings += addWinningsNum;
                        GlobalCfg.USER_DATAS.userDiamond += addWinningsNum;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                        arr.push({ id: 11, amount: addWinningsNum / 100 });
                    };
                    if (addBonusNum > 0) {
                        GlobalCfg.USER_DATAS.bonus += addBonusNum;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD, msgData: {}});
                        arr.push({ id: 12, amount: addBonusNum / 100 });
                    };

                    if (arr.length > 0) {
                        CommonFun.getInstance().showRewardsTips(arr);
                    };
                } 
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        } 
        else if (btnName == 'btn_get_ok') {
            this.node.destroy();
        };
    },

    /**
     * 设置邮件的内容
     * @param {Object} data 
     */
    setState: function (data) {
        this.emailData = data;
        // type: 1 为系统邮件 2 为反馈邮件
        if (data.type == 1) {
            if (data.title != "") {
                this.title.string = data.title;
            }
            else {
                this.title.string = "System Mail";
            };
            if (data.attaches && data.attaches.length > 0 && data.award_state == false) {
                this.btnList[1].node.active = true;
            } 
            else {
                this.btnList[0].node.active = true;
            };
            this.content.string = data.content;
        } 
        else if (data.type == 2) {
            if (data.title != ""){
                this.title.string = data.title;
            }
            else{
                this.title.string = "Feedback Mail";
            };
            if (data.attaches && data.attaches.length > 0 && data.award_state == false) {
                this.btnList[1].node.active = true;
            } 
            else {
                this.btnList[0].node.active = true;
            };
            this.content.string = data.content;
        } 
        else {
            this.btnList[0].node.active = true;
            this.content.string = "Sorry, please refresh";
        };

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.OPEN_EMAIL, msgData: {mail_id: this.emailData.id }});
    },
});
