cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_fsyzm: cc.Button,
        btn_bd: cc.Button,
        btn_cancel: cc.Button,
        editBox_name: cc.EditBox,
        editBox_phoneNumber: cc.EditBox,
        editBox_verificationCode: cc.EditBox,
        editBox_mail: cc.EditBox,
        NodeTips: cc.Node,
        NodeSend: cc.Node,
        NodeSended: cc.Node,
        lab_time: cc.Label,
        zhuNode: cc.Node,
        shoujiNode: cc.Node,
        yzmNode: cc.Node,
        yxNode: cc.Node,
        otpNode: cc.Node,
        lab_tip1: cc.Node,
        lab_tip2: cc.Label,

        number91: cc.Label,
    },

    ctor() {
        this.clickOkToView = 'Lobby';             // Lobby (大厅) Personal (个人中心) AddCash (充值填写) 

    },

    setNodeStateStr(str){
        this.clickOkToView = str;
    },

    onLoad: function() {
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.bntclick, 2), this);
        this.btn_fsyzm.node.on('click', CommonFun.getInstance().debounce(this.bntclick, 3), this);
        this.btn_bd.node.on('click', CommonFun.getInstance().debounce(this.bntclick, 2), this);
        this.btn_cancel.node.on('click', this.bntclick, this);
        this.editBox_name.node.on('editing-did-began', this.editBeganCallback, this);
        this.editBox_name.node.on('editing-did-ended', this.editEndedCallback, this);
        this.editBox_phoneNumber.node.on('editing-did-began', this.editBeganCallback, this);
        this.editBox_phoneNumber.node.on('editing-did-ended', this.editEndedCallback, this);
        this.editBox_verificationCode.node.on('editing-did-began', this.editBeganCallback, this);
        this.editBox_verificationCode.node.on('editing-did-ended', this.editEndedCallback, this);
        this.editBox_mail.node.on('editing-did-began', this.editBeganCallback, this);
        this.editBox_mail.node.on('editing-did-ended', this.editEndedCallback, this);

        this.shoujiNode.active = true;
        // this.yzmNode.active = true;
        this.yxNode.active = true;
        this.otpNode.active = true;
        

        this.NodeTips.active = false;
        this.lab_tip1.active = false;
        this.lab_tip2.node.active = false;
        this.NodeSended.active = false;
        this.phoneNumber = ''
        if (CommonFun.getInstance().checkVerticalAcc()) {
            this.zhuNode.scale = 0.7
        };
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (languagesType == I18NLanguagesEnum.Bengali) {
            this.number91.string = "+880";
        }
        else {
            this.number91.string = "+91";
        }
        this.showRealName();
    },

    onDestroy: function () {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.HIDE_MOBILE_VIEW);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.BINDPHONE);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "lobbyservice.sendverifycode") {
            self.resendCountDown();
        } 
        else if (msgId === "lobbyservice.bindphonenumber") {
            GlobalCfg.USER_DATAS.phone = self.earlyBinding ? self.earlyBinding : "";
            GlobalCfg.USER_DATAS.mail = self.earlyMail ? self.earlyMail : "";
            CommonFun.getInstance().showTips("Congratulations on binding your phone number and email!");
            self.node.destroy();
        } 
        else if (msgId === GlobalCfg.CLIENT_MSG_ID.RECEIVE_BINDING_PHONE_SMS) {
            self.editBox_verificationCode.string = notify.sms;
        }
    },

    editBeganCallback: function(editbox) {
        let editboxName = editbox.node.name;
        if (editboxName == "EditBox_Phone") {
            this.lab_tips_mobile1.active = false
        } else if (editboxName == "EditBox_Verficode") {
            this.lab_tips_mobile2.active = false
        } else if (editboxName == "EditBox_mail") {
            this.lab_tips_mobile4.active = false
        } else if (editboxName == "EditBox_name") {
            this.lab_tips_mobile3.active = false
        }
    },

    editEndedCallback: function(editbox) {
        if (editbox.node.name == "EditBox_Phone") {
            let phone = this.isPoneAvailable("91" + this.editBox_phoneNumber.string);
            if( this.phoneNumber != this.editBox_phoneNumber.string && phone) {
                this.phoneNumber = this.editBox_phoneNumber.string;
                this.NodeSend.active = true;
                this.NodeSended.active = false;
                this.btn_fsyzm.interactable = true;
                this.lab_time.unschedule(this.callback);
            };
        }
    },

    bntclick: function (button) {
        let btnName = button.node.name;
        if (btnName === "btn_close" || btnName === "btn_cancel") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            SHOPPING.cashID = -1;
            this.node.destroy();
        } 
        else {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (btnName === "btn_fsyzm") {
                this.sendVerifycodeReq();
            } 
            else if (btnName === "btn_bd") {
                let _name = this.editBox_name.string;
                let phoneNum = this.editBox_phoneNumber.string;
                if (!this.isPoneAvailable("91" + phoneNum)) {
                    this.lab_tip1.active = true;
                    return;
                } 
                // let _code = this.editBox_verificationCode.string;
                let mail = this.editBox_mail.string;
                this.earlyBinding = phoneNum;
                this.earlyMail = mail;
                let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/bind_phoneV1";
                let httpParam = {
                    phone: '91'+ phoneNum,
                    // code : _code ? _code : '',
                    mail : mail ? mail : '',
                    realname : _name ? _name : '',
                }
                let isExistence = this.chack_name(_name);
                let isChina = this.funcChina(_name);
                if (GlobalCfg.USER_DATAS.phone.length <= 0) {
                    if (phoneNum.length == 0 || mail.length == 0 || !this.isEmail(mail) || isExistence || isChina) {
                        this.testBindPhoneSuccess(_name, '91'+ phoneNum, mail);
                        return;
                    }; 
                } 
                else {
                    if (_name.length == 0 || mail.length == 0 || !this.isEmail(mail) || isExistence || isChina ) {
                        this.testBindPhoneSuccess(_name, '91'+ phoneNum, mail);
                        return;
                    }; 
                };
                CommonFun.getInstance().showProgress();
                CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
                    CommonFun.getInstance().hidProgress();
                    if (msg.result == 0) { 
                        let give = msg.data.give ? msg.data.give : 0;
                        GlobalCfg.USER_DATAS.bonus = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.bonus , give);
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.BINDPHONE_SUCCESS, msgData: {data: httpParam}});

                        GlobalCfg.USER_DATAS.phone = httpParam.phone;
                        GlobalCfg.USER_DATAS.mail = httpParam.mail;
                        GlobalCfg.USER_DATAS.realname = httpParam.realname;
                    
                        if (CommonFun.getInstance().isValidForScr(this)) { 
                            switch (this.clickOkToView) {
                                case "Lobby":
                                    CommonFun.getInstance().showRewardsTips([{ id: 10, amount: give / 100 }]);
                                    break;
                                case "Personal":
                                    CommonFun.getInstance().showRewardsTips([{ id: 10, amount: give / 100 }]);
                                    break;
                                case "AddCash":
                                    CommonFun.getInstance().showTips("Bind succeeded");
                                    if(SHOPPING.cashID != -1){
                                        CommonFun.getInstance().rechargeByCommodityId(SHOPPING.cashID, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, () => {
                                            SHOPPING.cashID = -1;
                                        });
                                    }else{
                                        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.BindPhone);
                                    }
                                    break;
                                default:
                                    break;
                            }; 
                            this.node.destroy();
                        };
                    } 
                    else {
                        CommonFun.getInstance().showTips(msg.msg);
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            }
        } 
    },

    sendVerifycodeReq: function () {
        let phoneNum = this.editBox_phoneNumber.string;
        if (!this.isPoneAvailable("91" + phoneNum)) {
            this.lab_tip1.active = true;
        } 
        else {
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/send_verify_code"
            let self = this;
            let httpParam = {
                phone: '',
            };
            httpParam.phone = '91'+ phoneNum;
            CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
                if (msg.result == 0 && CommonFun.getInstance().isValidForScr(this)) {
                    this.resendCountDown();
                }
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        }
    },

    //检验是否是合理的手机号码
    isPoneAvailable: function (pone) {
        var myreg = /^91[6-9]\d{9}$/;
        return myreg.test(pone);
    },

    //检验是否是合理的邮箱
    isEmail (email){
        let validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
        if(validateEmail(email)){
            return true
        }else{
            return false
        }
    },

    resendCountDown: function() {
        let self = this;
        let countDownTime = 180;
        this.NodeSend.active = false;
        this.NodeSended.active = true;
        this.btn_fsyzm.interactable = false;
        this.lab_time.string = countDownTime + "s";
        this.callback = function() {
            if (countDownTime <= 0) {
                self.lab_time.unschedule(self.callback);
                self.NodeSend.active = true;
                self.btn_fsyzm.interactable = true;
                self.NodeSended.active = false;
                return;
            }
            self.lab_time.string = countDownTime + "s";
            countDownTime--;
        }
        this.lab_time.schedule(self.callback, 1);
    },

    //检测绑定手机信息是否正确成功
    testBindPhoneSuccess: function(name, phoneNum, mail){
        let str =  this.lab_tips_mobile4.getComponent(cc.Label);
        let str_phone =  this.lab_tips_mobile1.getComponent(cc.Label)
        let str_name =  this.lab_tips_mobile3.getComponent(cc.Label)
        this.lab_tips_mobile1.active = phoneNum.length == 0 ? true : false;
        // this.lab_tips_mobile2.active = code.length == 0 ? true : false;

        this.lab_tips_mobile3.active = name.length == 0 ? true : false;
    
       
        if(mail.length > 0){
            let isEmail = this.isEmail(mail);
            if(isEmail){
                str.string = ""
            }else{
                this.lab_tips_mobile4.active = true
            }
        }else{
            this.lab_tips_mobile4.active = true
        };

        if (name.length > 0) {
            let isExistence = this.chack_name(name);
            let isChina = this.funcChina(name)
            if(isExistence || isChina){
                this.lab_tips_mobile3.active = true;
            } 
        };
    },


    // 
    showRealName :function () {
        this.ty_bg_sml_2 = this.node.getChildByName("ty_bg_sml_2");
        this.sz_input_name =   this.ty_bg_sml_2.getChildByName("sz_input_name");
        this.sz_input_sj =   this.ty_bg_sml_2.getChildByName("sz_input_sj");
        this.sz_input_yzm =   this.ty_bg_sml_2.getChildByName("sz_input_yzm");
        this.sz_input_mail =   this.ty_bg_sml_2.getChildByName("sz_input_mail");
        this.lab_tips_mobile1 =  this.sz_input_sj.getChildByName("lab_tips_mobile1");
        this.lab_tips_mobile2 =  this.sz_input_yzm.getChildByName("lab_tips_mobile2");
        this.lab_tips_mobile3 =  this.sz_input_name.getChildByName("lab_tips_mobile3");
        this.lab_tips_mobile4 =  this.sz_input_mail.getChildByName("lab_tips_mobile4");

        this.lab_tips_mobile1.active = false;
        this.lab_tips_mobile2.active = false;
        this.lab_tips_mobile3.active = false;
        this.lab_tips_mobile4.active = false;

        this.sz_input_name.active = true;
        if (GlobalCfg.USER_DATAS.phone.length > 0) {
            this.sz_input_yzm.active = false;
            this.sz_input_sj.setPosition(0,20);
            this.sz_input_mail.setPosition(0,-95);
        }

        if (GlobalCfg.USER_DATAS.realname.length > 0) {
            this.editBox_name.string = GlobalCfg.USER_DATAS.realname
        }
        else if (GlobalCfg.USER_DATAS.transferAddress.name.length > 0) {
            this.editBox_name.string = GlobalCfg.USER_DATAS.transferAddress.name;
        }; 

        if (GlobalCfg.USER_DATAS.phone.length > 0) {
            this.editBox_phoneNumber.string = GlobalCfg.USER_DATAS.phone.slice(2, GlobalCfg.USER_DATAS.phone.length);
            let btn_mask = this.sz_input_sj.getChildByName("btn_mask")
            btn_mask.active = true;
        }
        else if (GlobalCfg.USER_DATAS.transferAddress.mobile.length > 0) {
            this.editBox_phoneNumber.string = GlobalCfg.USER_DATAS.transferAddress.mobile.slice(2, GlobalCfg.USER_DATAS.transferAddress.mobile.length);
        };

        if (GlobalCfg.USER_DATAS.mail.length > 0) {
            this.editBox_mail.string = GlobalCfg.USER_DATAS.mail;
        }
        else if (GlobalCfg.USER_DATAS.transferAddress.email.length > 0) {
            this.editBox_mail.string = GlobalCfg.USER_DATAS.transferAddress.email;
        };
    },

    
    //检测是否有特殊符号
    chack_name:function(str){
        let isChina = this.funcChina(str)
        if(isChina){
            return false;
        }
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        if (pattern.test(str)){
            return true;
        }
        return false;
    },

    //检测是否有中文字
    funcChina: function(str){
        var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        if (!patrn.exec(str)) {
            return false;
        }
        else {
            return true;
        }
    },

});
