cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: {
            default: null,
            type: cc.Button
        },
        btn_save: {
            default: null,
            type: cc.Button
        },

        editBox_account: cc.EditBox,
        editBox_password: cc.EditBox,
        editBox_confirm: cc.EditBox,
    },

    onLoad: function () {
        this.node_lab_accountTips = this.editBox_account.node.getChildByName("lab_accountTips");
        this.node_lab_passwordTips = this.editBox_password.node.getChildByName("lab_passwordTips");
        this.node_lab_confirmTips = this.editBox_confirm.node.getChildByName("lab_confirmTips");

        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_save.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CONTACTUS);
    },

    btnClick: function(sender) {
        let btnName = sender.node.name;
        if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy()
        }
        else if (btnName == "btn_save") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealSave();
        };
    },

    dealSave() {
        let accountStr = this.editBox_account.string;
        if (accountStr.length < 6) {
            this.node_lab_accountTips.active = true;
            this.node_lab_accountTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
            return;
        };
        let passwordStr = this.editBox_password.string;
        if (passwordStr.length < 6) {
            this.node_lab_passwordTips.active = true;
            this.node_lab_passwordTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
            return;
        };
        let confirmStr = this.editBox_confirm.string;
        if (confirmStr.length < 6) {
            this.node_lab_confirmTips.active = true;
            this.node_lab_confirmTips.getComponent(cc.Label).string = "length cannot be less than 6 characters";
            return;
        };

        if (passwordStr != confirmStr) {
            this.node_lab_confirmTips.active = true;
            this.node_lab_confirmTips.getComponent(cc.Label).string = "The two passwords are inconsistent";
            return;
        }

        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/bindAccount";
        let httpParam = {
            account: accountStr,
            password: passwordStr,
        };
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result == 0) {
                CommonFun.getInstance().showTips("bind success");
                GlobalCfg.USER_DATAS.isBindAccount = true;
                GlobalCfg.USER_DATAS.bonus += msg.data.give;
                CommonFun.getInstance().showRewardsTips([{ id: 12, amount: msg.data.give / 100 }]);
                this.node.destroy()
            }
            if (msg.result != 0) {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
});
