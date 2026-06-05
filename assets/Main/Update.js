cc.Class({
    extends: cc.Component,

    properties: {
        btn_test1:cc.Button,
        btn_testLogin:cc.Button,
        editBox_invited_test:cc.EditBox,
        editBox_chanel_test:cc.EditBox,
    },

    ctor: function () {   
        this.reqComparisonMainMD5InfoAcount = 0;        // 请求远程assets下的manifest文件的次数（请求次数超过3次，判定为异常）
        this.needUpdateFileArr = [];                    // 存放需要更新的文件的容器
        this.simulationCheckFileAcount = 0;             // 模拟远程和本地文件比较差异的次数
        this.totalNumberOfRemoteMainFiles = 0;          // 远程assets下的manifest文件中记录的文件总数
        this.totalNumberOfFilesDownloaded = 0;          // 已更新完成的文件数量
        this.curNumberOfJoinedDownloader = 0;           // 当前添加到下载器的需下载文件数量
        this.updateStatusPoints = 0;                    // 更新状态圆点的个数  
        this.downloaderArr = [];                        // 热更新下载器容器（实现多管道下载）
        this.testButtonIsActive = false;                // 测试按钮是否激活
        this.testIndexNum = 0;                          // 测试按钮点击次数
        this.sendVerifyCodeReqAcount = 0;

        this.verifyTimer = null;

        this.or_sprite_pos = cc.v2(326, -160);
        this.btn_facebookLogin_pos = cc.v2(209, -274);
        this.btn_guestLogin_pos = cc.v2(326, -225);

        this.or_sprite_pos1 = cc.v2(326, -76);
        this.btn_facebookLogin_pos1 = cc.v2(209, -144);
        this.btn_guestLogin_pos1 = cc.v2(326, -144);

        this.protoFiles = [
            "proto/baseproto",
            "proto/lobbyservice",
            "proto/gamebase",
            "proto/benz/gameservice",
            "proto/fruitMachine/gameservice",
            "proto/mayaMachine/gameservice",
            "proto/catMachine/gameservice",
            "proto/jokerMachine/gameservice",
            "proto/indiaMachine/gameservice",
            "proto/vampireMachine/gameservice",
            "proto/bullMachine/gameservice",
            "proto/updown/gameservice",
            "proto/andeer/gameservice",
            "proto/baccarat3Patti/gameservice",
            "proto/horseRace/gameservice",
            "proto/lhd/gameservice",
            "proto/munda/gameservice",
            "proto/multiTeenPatti/gameservice",
            "proto/ssc/gameservice",
            "proto/tpGame/gameservice",
            "proto/rummy/gameservice",
            "proto/rocket/gameservice",
            "proto/aviator/gameservice",
            "proto/chickenroad/gameservice",
            "proto/zoo/gameservice",
            "proto/cricket/gameservice",
            "proto/zeus/gameservice",
        ];

        this.baseBundlesCheckUpdateArr = [
            'ResourcesBundle',
            'tpGame',
        ];
        this.baseBundlesNeedUpdateArr = [];
        this.baseBundlesUpdateCompleteArr = []; 

        this.updateStartTime = 0;
        this.btnWenZiClickTimes = 0;

        this.loadDiffFilesStartTime = 0;
        this.loadBundlesStartTime = 0;
        this.isHaveUpdateForResources = false;
    },

    onLoad: function () {

        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_UPDATE_VIEW);

        CommonFun.getInstance().initVerticalAcc();

        CommonFun.getInstance().hidProgress();

        CommonFun.getInstance().removeCarouselStrip();
        CommonFun.getInstance().removeSidebar();
   
        // Update节点部分
        this.progressBar = this.node.getChildByName("updateLayer").getComponent(cc.ProgressBar);
        this.lab_updateContentTips = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_up").getComponent(cc.Label);
        this.lab_updatePoint = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_point").getComponent(cc.Label);
        this.lab_updateProgress = this.progressBar.node.getChildByName("NodeUpdateTips").getChildByName("lab_%").getComponent(cc.Label);
        
        // login节点部分
        this.node_loginLayer = this.node.getChildByName("loginLayer");

        // 手机号登录相关节点
        this.node_login_mobile = this.node_loginLayer.getChildByName("login_mobile_root");
        this.editBox_mobile = this.node_login_mobile.getChildByName("editBox_mobile").getComponent(cc.EditBox);
        this.editBox_verity = this.node_login_mobile.getChildByName("editBox_verity").getComponent(cc.EditBox);
        this.node_btn_mobileDelete = this.node_login_mobile.getChildByName("btn_mobileDelete");
        this.node_btn_verifyDelete = this.node_login_mobile.getChildByName("btn_verifyDelete");
        this.node_btn_reqVerify = this.node_login_mobile.getChildByName("btn_reqVerify");
        this.btn_reqVerify = this.node_btn_reqVerify.getComponent(cc.Button);
        this.node_btn_mobileLogin = this.node_login_mobile.getChildByName("btn_mobileLogin");
        this.node_lab_mobileTips = this.node_login_mobile.getChildByName("lab_mobileTips");
        this.node_lab_verifyTips = this.node_login_mobile.getChildByName("lab_verifyTips");
        this.lab_otpTips = this.node_btn_reqVerify.getChildByName("Background").getChildByName("lab_otpTips").getComponent(cc.Label);
        // 账号密码登录相关节点
        this.node_login_account = this.node_loginLayer.getChildByName("login_account_root");
        this.editBox_account = this.getChildComponentByName(this.node_login_account, "editBox_account", cc.EditBox);
        this.editBox_password = this.getChildComponentByName(this.node_login_account, "editBox_password", cc.EditBox);
        this.node_btn_accountLogin = this.getChildNodeByName(this.node_login_account, "btn_accountLogin");
        this.node_btn_accountDelete = this.getChildNodeByName(this.node_login_account, "btn_accountDelete");
        this.node_btn_passwordDelete = this.getChildNodeByName(this.node_login_account, "btn_passwordDelete");
        this.node_lab_accountTips = this.getChildNodeByName(this.node_login_account, "lab_accountTips");
        this.node_lab_passwordTips = this.getChildNodeByName(this.node_login_account, "lab_passwordTips");
        this.node_btn_goRegister = this.getChildNodeByName(this.node_login_account, "btn_goRegister");
        
        // 注册账号相关节点
        this.node_login_register = this.node_loginLayer.getChildByName("login_regirster_root");
        this.editBox_register_account = this.getChildComponentByName(this.node_login_register, "editBox_register_account", cc.EditBox);
        this.editBox_register_password1 = this.getChildComponentByName(this.node_login_register, "editBox_register_password1", cc.EditBox);
        this.editBox_register_password2 = this.getChildComponentByName(this.node_login_register, "editBox_register_password2", cc.EditBox);
        this.node_btn_register = this.getChildNodeByName(this.node_login_register, "btn_register");
        this.node_btn_registerBack = this.getChildNodeByName(this.node_login_register, "btn_back");
        this.node_lab_password2Tips = this.getChildNodeByName(this.node_login_register, "lab_password2Tips") || this.getChildNodeByName(this.node_login_register, "lab_passwordTips");
        this.lab_registerTips = this.node_lab_password2Tips ? this.node_lab_password2Tips.getComponent(cc.Label) : null;

        this.node_btn_quickLogin = this.node_loginLayer.getChildByName("btn_quickLogin");
        this.node_btn_facebookLogin = this.node_loginLayer.getChildByName("btn_facebookLogin");
        this.node_btn_guestLogin = this.node_loginLayer.getChildByName("btn_guestLogin");
        this.node_or_sprite = this.node_loginLayer.getChildByName("or_sprite");
        this.node_btn_wenZi = this.node_loginLayer.getChildByName("btn_wenZi");
        let languagesType = I18NUtil.getInstance().getLanguageType();
        let checkedName = "";
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                checkedName = "toggle_English";
                break;
            case I18NLanguagesEnum.Hindi:
                checkedName = "toggle_Hindi";
                break;
            case I18NLanguagesEnum.Urdu:
                checkedName = "toggle_Urdu";
                break;
            case I18NLanguagesEnum.Bengali:
                checkedName = "toggle_Bengali";
                break;
            default:
                checkedName = "toggle_English";
                break;
        };
        this.toggleContainer_language = this.node_loginLayer.getChildByName("toggleContainer_language").getComponent(cc.ToggleContainer);
        let toggleItems = this.toggleContainer_language.toggleItems;
        for (let i = 0, len = toggleItems.length; i < len; i++) {
            let toggle = toggleItems[i];
            if (toggle.node.name == checkedName) {
                toggle.isChecked = true;
            };
            toggle.node.on('toggle', this.toggleLanguageCallback, this);
        };

        this.progressBar.node.active = false;
        this.lab_updateContentTips.node.active = false;
        this.lab_updatePoint.node.active = false;
        this.lab_updateProgress.node.active = false;
        this.node_loginLayer.active = false;

        this.editBox_mobile.node.on('editing-did-began', this.editBoxCallback, this);
        this.editBox_verity.node.on('editing-did-began', this.editBoxCallback, this);
        if (this.editBox_account) {
            this.editBox_account.node.on('editing-did-began', this.editBoxCallback, this);
        };
        if (this.editBox_password) {
            this.editBox_password.node.on('editing-did-began', this.editBoxCallback, this);
        };
        if (this.editBox_register_account) {
            this.editBox_register_account.node.on('editing-did-began', this.editBoxCallback, this);
        };
        if (this.editBox_register_password1) {
            this.editBox_register_password1.node.on('editing-did-began', this.editBoxCallback, this);
        };
        if (this.editBox_register_password2) {
            this.editBox_register_password2.node.on('editing-did-began', this.editBoxCallback, this);
        };

        this.editBox_invited_test.node.on('editing-did-began', this.editBoxCallback, this);
        this.editBox_chanel_test.node.on('editing-did-began', this.editBoxCallback, this);
  
        this.node_btn_reqVerify.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1),  this);
        this.node_btn_mobileDelete.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1),  this);
        this.node_btn_verifyDelete.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        this.node_btn_mobileLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        if (this.node_btn_accountDelete) {
            this.node_btn_accountDelete.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        if (this.node_btn_passwordDelete) {
            this.node_btn_passwordDelete.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        if (this.node_btn_accountLogin) {
            this.node_btn_accountLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        if (this.node_btn_goRegister) {
            this.node_btn_goRegister.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        if (this.node_btn_register) {
            this.node_btn_register.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        if (this.node_btn_registerBack) {
            this.node_btn_registerBack.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        };
        this.node_btn_quickLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        this.node_btn_facebookLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        this.node_btn_guestLogin.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 1), this);
        this.node_btn_wenZi.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);
        this.btn_test1.node.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);
        this.btn_testLogin.node.on('click', CommonFun.getInstance().debounce(this.clickCallBack, 0), this);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.FAILURE_TO_OBTAIN_USER_INFO) {
            CommonFun.getInstance().hidProgress();
            CommonFun.getInstance().showTips(notify.msgTips);
            self.progressBar.node.active = false;
            self.node_loginLayer.active = true;
            self.sendVerifyCodeReqAcount = 0;
            self.btn_reqVerify.interactable = true;
            self.btn_reqVerify.enableAutoGrayEffect = false;
            self.lab_updatePoint.node.active = false;
            self.lab_updateProgress.node.active = false;
            clearInterval(self.verifyTimer);
            self.verifyTimer = null;
            self.resetOtpTipsLabel();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS) {
            self.setZipFileLoadProgress(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE) {
            self.setZipFileLoadComplete(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_ERROR) {
            let subpackgeName = notify.subpackgeName;
            CommonFun.getInstance().behaviorReporting(`${GlobalCfg.BEHAVIOR_TYPE.UPDATE_ERROR}-${subpackgeName}`);
        } 
    },

    setZipFileLoadProgress: function(notify) {
        if (!notify) {
            return;
        };

        LoggerUtil.getInstance().log(`正在下载的BUNDLE是: ${notify.subpackgeName}`);

        let baseBundle = notify.subpackgeName;
        let progress = Number(notify.progress);
        
        let allProgress = 0;
        let len = this.baseBundlesNeedUpdateArr.length
        for (let i = 0; i < len; i++) {
            let tempObj = this.baseBundlesNeedUpdateArr[i];
            if (tempObj.baseBundle == baseBundle) {
                tempObj.progress = progress;
            };
            allProgress += tempObj.progress;
        };

        let tempProgress = allProgress/(len * 100);

        this.setLabUpdateProgressStr(`${(80 + tempProgress * 20).toFixed(2)}%`);
        this.setUpdateProgressBarProgress(Number(((80 + tempProgress * 20)/100).toFixed(2)));
        this.setLabUpdateContentTipsStr("Downloading files");
    },

    setZipFileLoadComplete: function(notify) {
        if (!notify) {
            return;
        };

        let baseBundle = notify.subpackgeName;
        
        if (!this.baseBundlesUpdateCompleteArr.includes(baseBundle)) {
            this.baseBundlesUpdateCompleteArr.push(baseBundle);
        };

        if (this.baseBundlesUpdateCompleteArr.length == this.baseBundlesNeedUpdateArr.length) {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_WITH_LOADED_END, endTime - this.loadBundlesStartTime);
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_END, endTime - this.updateStartTime);

            this.unscheduleAllCallbacks();
            this.setLabUpdateProgressStr("100%");
            this.setUpdateProgressBarProgress(1);
          
            this.scheduleOnce(() => {
                let searchPaths = jsb.fileUtils.getSearchPaths();
                let storagePath1 = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
                Array.prototype.unshift.apply(searchPaths, [storagePath1]);
                searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
                cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                GlobalCfg.G_COMPONENTS.Audio.stopAll();
                cc.game.restart();
            }, 1);
        };
    },

    getChildNodeByName: function(parentNode, childName) {
        if (!parentNode) {
            return null;
        };
        return parentNode.getChildByName(childName);
    },

    getChildComponentByName: function(parentNode, childName, componentType) {
        let childNode = this.getChildNodeByName(parentNode, childName);
        if (!childNode) {
            return null;
        };
        return childNode.getComponent(componentType);
    },

    editBoxCallback: function(editBox) {
        let editBoxName = editBox.node.name;
        if (editBoxName === "editBox_mobile") {
            this.node_lab_mobileTips.active = false;
        }
        else if (editBoxName === "editBox_verity") {
            this.node_lab_verifyTips.active = false;
        }
        else if (editBoxName === "editBox_password") {
            if (this.node_lab_passwordTips) {
                this.node_lab_passwordTips.active = false;
            };
        }
        else if (editBoxName === "editBox_register_account" || editBoxName === "editBox_register_password1" || editBoxName === "editBox_register_password2") {
            this.hideRegisterTips();
        };
    },

    clickCallBack: function(btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_mobileDelete") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.editBox_mobile.string = "";
            this.node_lab_mobileTips.active = false;
            this.sendVerifyCodeReqAcount = 0;
            this.btn_reqVerify.interactable = true;
            this.btn_reqVerify.enableAutoGrayEffect = false;
            clearInterval(this.verifyTimer);
            this.verifyTimer = null;
            this.resetOtpTipsLabel();
            this.showCommonLoginView();
        }
        else if (btnName == "btn_verifyDelete") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.editBox_verity.string = "";
            this.node_lab_verifyTips.active = false;
        }
        else if (btnName == "btn_mobileLogin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealMobileLoginEvent();
        }
        else if (btnName == "btn_accountDelete") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.editBox_account) {
                this.editBox_account.string = "";
            };
            if (this.node_lab_accountTips) {
                this.node_lab_accountTips.active = false;
            };
        }
        else if (btnName == "btn_passwordDelete") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.editBox_password) {
                this.editBox_password.string = "";
            };
            if (this.node_lab_passwordTips) {
                this.node_lab_passwordTips.active = false;
            };
        }
        else if (btnName == "btn_accountLogin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealAccountLoginEvent();
        }
        else if (btnName == "btn_goRegister") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showRegisterView();
        }
        else if (btnName == "btn_register") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealRegisterEvent();
        }
        else if (btnName == "btn_back") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.showAccountLoginView();
            return;
        }
        else if (btnName == "btn_quickLogin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.dealQuickLoginEvent();
        }
        else if (btnName === "btn_facebookLogin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showProgress();
            this.dealFacebookLoginEvent();
        }
        else if (btnName === "btn_reqVerify") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let accountOrPhoneStr = this.editBox_mobile.string;
            if (accountOrPhoneStr.length == 0) {
                this.node_lab_mobileTips.active = true;
                return;
            };
            if (!this.isPhoneAvailable('91' + accountOrPhoneStr)) {
                this.node_lab_mobileTips.active = true;
                return;
            };
            CommonFun.getInstance().showProgress(this.getUpdateLocalizedText("Sending SMS request ..."));
            this.dealReqVerifyEvent(accountOrPhoneStr);
        }
        else if (btnName === "btn_guestLogin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showProgress();
            this.dealGuestLoginEvent();
        }
        else if (btnName === "btn_wenZi") {
            this.dealBtnWenZiEvent();
        }
        else if (btnName === "btn_test1") {
            this.testIndexNum++;
            if (this.testIndexNum > 2) {
                let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
                if (packageChannel && packageChannel.indexOf("_") != -1) {
                    let packageChannelArr = packageChannel.split("_"); 
                    let server = packageChannelArr[0];
                    if (server == "0") { //只有测试服才能打开测试按钮
                        this.testButtonIsActive = true;
                        this.editBox_invited_test.node.active = true
                        this.editBox_chanel_test.node.active = true
                    }
                }
            }
        }
        else if (btnName === "btn_testLogin") {
            let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
            if (packageChannel && packageChannel.indexOf("_") != -1) {
                let packageChannelArr = packageChannel.split("_"); 
                let server = packageChannelArr[0];
                if (server == "0") { //只有测试服才能打开测试按钮
                    if (this.editBox_mobile.string == "") {
                        return;
                    }
                    GlobalCfg.G_COMPONENTS.Audio.playButton();
                    CommonFun.getInstance().showProgress();
                    this.dealTestLoginEvent();
                }
            }
        }
    },

    toggleLanguageCallback: function(toggle) {
        let toggleName = toggle.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let languageType = I18NLanguagesEnum.English;
        switch (toggleName) {
            case "toggle_English":
                languageType = I18NLanguagesEnum.English;
                break;
            case "toggle_Hindi":
                languageType = I18NLanguagesEnum.Hindi;
                break;
            case "toggle_Urdu":
                languageType = I18NLanguagesEnum.Urdu;
                break;
            case "toggle_Bengali":
                languageType = I18NLanguagesEnum.Bengali;
                break;
            default:
                languageType = I18NLanguagesEnum.English;
                break;
        };
        I18NUtil.getInstance().setLanguageType(languageType);
    },

    dealBtnWenZiEvent: function() {
        if (!cc.sys.isNative) {
            return;
        };

        this.btnWenZiClickTimes += 1;
        if (this.btnWenZiClickTimes >= 3) {
            this.btnWenZiClickTimes = 0;
            let loggerStatus = LoggerUtil.getInstance().getLoggerStatus();
            console.log(`LoggerUtil Status Set as ${!loggerStatus}`);
            LoggerUtil.getInstance().setLoggerStatus(!loggerStatus);
            cc.sys.localStorage.setItem("LOGGERUTIL_STATUS", loggerStatus ? 0 : 1);
        };
    },

    dealReqVerifyEvent: function(accountOrPhoneStr) {
        if (this.sendVerifyCodeReqAcount == 3) {
            this.sendVerifyCodeReqAcount = 0;
            this.btn_reqVerify.interactable = true;
            this.btn_reqVerify.enableAutoGrayEffect = false;
            clearInterval(this.verifyTimer);
            this.verifyTimer = null;
            this.resetOtpTipsLabel();
            CommonFun.getInstance().showTips(this.getUpdateLocalizedText("Server SMS interface exception"));
            return;
        };
        this.sendVerifyCodeReqAcount += 1;

        if (this.sendVerifyCodeReqAcount == 1) {
            this.btn_reqVerify.interactable = false;
            this.btn_reqVerify.enableAutoGrayEffect = true;
            if (this.verifyTimer) {
                clearInterval(this.verifyTimer);
                this.verifyTimer = null;
            };
            let waitTime = 180;
            this.lab_otpTips.string = `${waitTime}S`;
            this.verifyTimer = setInterval(() => {
                waitTime -= 1;
                if (waitTime == 0) {
                    if (this && this.verifyTimer) {
                        clearInterval(this.verifyTimer);
                        this.verifyTimer = null;
                    };
                    if (this && this.btn_reqVerify) {
                        this.btn_reqVerify.interactable = true;
                        this.btn_reqVerify.enableAutoGrayEffect = false;
                    }
                    if (this && this.lab_otpTips) {
                        this.resetOtpTipsLabel();
                    }
                    return;
                }
                if (this && this.lab_otpTips) {
                    this.lab_otpTips.string = `${waitTime}S`;
                }
            }, 1000);
        };

        let packageChannel = cc.sys.localStorage.getItem("PackageChannel");
        let channel = 0;
        if (packageChannel && packageChannel.indexOf("_") != -1) {
            let packageChannelArr = packageChannel.split("_"); 
            channel = packageChannelArr[1];
        }
        let device = CommonFun.getInstance().getDeviceId();
        let reqVerifyCodeParamObj = {phone: "", device: device, channel: channel};
        reqVerifyCodeParamObj.phone = '91' + accountOrPhoneStr;

        let url = `${GlobalCfg.HTTP_USER_LOGIN}/v1/sendverificationcode`;
        CommonFun.getInstance().httpPost(url, reqVerifyCodeParamObj, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg.result != 0) {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, 
        () => {
            this.dealReqVerifyEvent(accountOrPhoneStr);
        });
    },

    dealMobileLoginEvent: function() {
        let phoneStr = this.editBox_mobile.string;
        if (phoneStr.length == 0) {
            this.node_lab_mobileTips.active = true;
            return;
        };

        let passwordOrVerCodeStr = this.editBox_verity.string;
        if (passwordOrVerCodeStr.length == 0) {
            this.node_lab_verifyTips.active = true;
            return;
        };

        if (this.isPhoneAvailable('91' + phoneStr)) {
            CommonFun.getInstance().showProgress();
            let obj = {
                loginType: "PHONE",
                phone: '91' + phoneStr,
                code: passwordOrVerCodeStr,
                token: "",
            };
            let promise = SceneManager.getInstance().reqTokenInfo(obj);
            promise.then(() => {
                return SceneManager.getInstance().reqBearerToken();
            }).then(() => {
                return SceneManager.getInstance().reqUserDataInfo();
            }).then(() => {
                CommonFun.getInstance().showProgress();
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
            }).catch(error => {

                LoggerUtil.getInstance().log(error);
            });
        }
        else {
            this.node_lab_mobileTips.active = true;
        };
    },

    dealAccountLoginEvent: function() {
        let accountStr = this.editBox_account ? this.editBox_account.string.trim() : "";
        if (accountStr.length == 0) {
            if (this.node_lab_accountTips) {
                this.node_lab_accountTips.active = true;
            };
            return;
        };

        let passwordStr = this.editBox_password ? this.editBox_password.string : "";
        if (passwordStr.length == 0) {
            if (this.node_lab_passwordTips) {
                this.node_lab_passwordTips.active = true;
            };
            return;
        };

        this.doAccountPasswordLogin(accountStr, passwordStr, false);

        // TODO: 接入账号密码登录请求，并在成功后继续 bearer token / user data / 切场景流程。
    },

    showRegisterTips: function(tipsStr) {
        if (!this.node_lab_password2Tips) {
            return;
        };
        this.node_lab_password2Tips.active = true;
        if (this.lab_registerTips) {
            this.lab_registerTips.string = this.getRegisterLocalizedText(tipsStr);
        };
    },

    getRegisterLocalizedText: function(tipsStr = "") {
        if (!this.isBengaliLanguage()) {
            return tipsStr;
        };

        let bengaliTextMap = {
            "Please complete all fields": "সব ঘর পূরণ করুন",
            "The two passwords do not match": "দুইটি পাসওয়ার্ড মেলেনি",
        };
        return bengaliTextMap[tipsStr] || tipsStr;
    },

    hideRegisterTips: function() {
        if (this.node_lab_password2Tips) {
            this.node_lab_password2Tips.active = false;
        };
    },

    showAccountLoginView: function() {
        if (this.node_login_account) {
            this.node_login_account.active = true;
        };
        if (this.node_login_register) {
            this.node_login_register.active = false;
        };
        if (this.node_btn_guestLogin) {
            this.node_btn_guestLogin.active = true;
        };
        this.hideRegisterTips();
    },

    showRegisterView: function() {
        if (this.node_login_account) {
            this.node_login_account.active = false;
        };
        if (this.node_login_register) {
            this.node_login_register.active = true;
        };
        if (this.node_btn_guestLogin) {
            this.node_btn_guestLogin.active = false;
        };
        if (this.editBox_register_account) {
            this.editBox_register_account.string = "";
        };
        if (this.editBox_register_password1) {
            this.editBox_register_password1.string = "";
        };
        if (this.editBox_register_password2) {
            this.editBox_register_password2.string = "";
        };
        this.hideRegisterTips();
    },

    doAccountPasswordLogin: function(accountStr, passwordStr, isRegister) {
        let obj = {
            loginType: "ACCOUNT",
            account: accountStr,
            password: passwordStr,
            isRegister: isRegister,
        };
        let promise = SceneManager.getInstance().reqTokenInfo(obj);
        promise.then(() => {
            return SceneManager.getInstance().reqBearerToken();
        }).then(() => {
            return SceneManager.getInstance().reqUserDataInfo();
        }).then(() => {
            CommonFun.getInstance().showProgress();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
        }).catch(error => {
            LoggerUtil.getInstance().log(error);
        });
    },

    dealRegisterEvent: function() {
        this.hideRegisterTips();

        let accountStr = this.editBox_register_account ? this.editBox_register_account.string.trim() : "";
        let password1Str = this.editBox_register_password1 ? this.editBox_register_password1.string : "";
        let password2Str = this.editBox_register_password2 ? this.editBox_register_password2.string : "";

        if (!accountStr || !password1Str || !password2Str) {
            this.showRegisterTips("Please complete all fields");
            return;
        };

        if (password1Str !== password2Str) {
            this.showRegisterTips("The two passwords do not match");
            return;
        };

        if (this.editBox_account) {
            this.editBox_account.string = accountStr;
        };
        if (this.editBox_password) {
            this.editBox_password.string = password1Str;
        };
        this.doAccountPasswordLogin(accountStr, password1Str, true);
    },

    dealQuickLoginEvent: function() {
        GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
        let accountOrPhoneStr = this.editBox_mobile.string;
        if (accountOrPhoneStr.length == 0) {
            this.node_lab_mobileTips.active = true;
            return;
        };
        if (this.isPhoneAvailable('91' + accountOrPhoneStr)) {
            CommonFun.getInstance().showProgress();
            let phoneToken = cc.sys.localStorage.getItem("phone_token");
            let obj = {
                loginType: "PHONE",
                phone: '91' + accountOrPhoneStr,
                code: "",
                token: phoneToken,
            };
            let promise = SceneManager.getInstance().reqTokenInfo(obj);
            promise.then(() => {
                return SceneManager.getInstance().reqBearerToken();
            }).then(() => {
                return SceneManager.getInstance().reqUserDataInfo();
            }).then(() => {
                CommonFun.getInstance().showProgress();
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
            }).catch(error => {
                this.showCommonLoginView();
                LoggerUtil.getInstance().log(error);
            });
        }
        else {
            this.node_lab_mobileTips.active = true;
        };
    },

    dealFacebookLoginEvent: function() {
        GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
        WXManager.login();
    },

    dealTestLoginEvent: function() {
        let obj = {
            loginType: "USERID",
            userid: this.editBox_mobile.string,
        };
        GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
        let promise = SceneManager.getInstance().reqTokenInfo(obj);
        promise.then(() => {
            return SceneManager.getInstance().reqBearerToken();
        }).then(() => {
            return SceneManager.getInstance().reqUserDataInfo();
        }).then(() => {
            CommonFun.getInstance().showProgress();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
        }).catch(error => {
            LoggerUtil.getInstance().log(error);
        });
    },

    dealGuestLoginEvent: function() {
        if (this.testButtonIsActive) {
            GlobalCfg.OPENINSTALL_INVITE_CODE = this.editBox_invited_test.string;
            GlobalCfg.CHANNEL_INFO = this.editBox_chanel_test.string;
        }
        GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;
        let obj = {
            loginType: "GUEST"
        };
        let promise = SceneManager.getInstance().reqTokenInfo(obj);
        promise.then(() => {
            return SceneManager.getInstance().reqBearerToken();
        }).then(() => {
            return SceneManager.getInstance().reqUserDataInfo();
        }).then(() => {
            CommonFun.getInstance().showProgress();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
        }).catch(error => {
            LoggerUtil.getInstance().log(error);
        });
    },

    isPhoneAvailable: function(phone) {
        let myreg = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/;
        return myreg.test(phone);
    },

    isCustomAccount: function(account) {
        let str = account.substring(0, 5);
        if (str == "00000") {
            return true;
        };
        return false;
    },
 
    start: function() {
        if (GlobalCfg.SERVERRELOAD == true) {
            CommonFun.getInstance().loadBundle('ResourcesBundle', (bundle) => {
                window.ResourcesBundle = bundle;
                CommonFun.getInstance().showMsgBox(GlobalCfg.SERVERRELOAD_Descr, "YES", ()=>{
                    cc.game.end();
                }, false);
            }, (err) => {
                LoggerUtil.getInstance().error(`加载ResourcesBundle-Bundle异常: ${JSON.stringify(err)}`);
                cc.game.end();
            });
            return
        };

        if (cc.sys.isNative) {
            this.updateStartTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_START);
            this.runUpdateProcess();
        }
        else {
            this.changeSceneToLobby();
        };
    },

    onDestroy: function() {
        this.downloaderArr = null; 
        clearInterval(this.verifyTimer);
        this.verifyTimer = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    runUpdateProcess: function() {
        this.node_loginLayer.active = false;
        this.progressBar.node.active = true;
        this.lab_updatePoint.node.active = true;
        this.lab_updateProgress.node.active = true;
        this.lab_updateContentTips.node.active = true;

        this.setLabUpdatePointAnim(true);
        this.setLabUpdateProgressStr("0%");
        this.setUpdateProgressBarProgress(0);
        this.setLabUpdateContentTipsStr("Getting Version Information");
        
        this.comparisonVersionInfo();
    },

    comparisonVersionInfo: function() {
        let localVersion = Number(cc.sys.localStorage.getItem("localVersion"));
        LoggerUtil.getInstance().log(`Remote resource file version：${GlobalCfg.ASSETS_VERSION}, Local resource file version：${localVersion}`);
        if (localVersion != GlobalCfg.ASSETS_VERSION && GlobalCfg.is_need_update) {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_RESOURCES_UPDATE);
            LoggerUtil.getInstance().log(`The remote version that needs to be updated is：${GlobalCfg.ASSETS_VERSION}`);
            this.reqMainManifestInfo();
        }
        else {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
            LoggerUtil.getInstance().log("Remote versions that are consistent and do not require updates at this time!");
            this.baseBundlesHotUpdate();
        };
    },

    reqMainManifestInfo: function() {
        if (this.reqComparisonMainMD5InfoAcount == 5) {
            LoggerUtil.getInstance().error("Exception in requesting manifest file under remote resource file assets!");
            this.setLabUpdateContentTipsStr("Getting Assets Manifest File Error");
            return;
        };

        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_START);
        this.reqComparisonMainMD5InfoAcount += 1;
        let mainMD5Url = `${GlobalCfg.ASSETS_UPDATE_URL}/assets/project.manifest?version=${GlobalCfg.ASSETS_VERSION}`;
        CommonFun.getInstance().httpGet(mainMD5Url, (json) => {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_SUCCESS, endTime - startTime);
            LoggerUtil.getInstance().log("httpGet has requested data from manifest!");
            this.comparisonFilesByMainManifestInfo(json);
        }, 
        () => {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_REQ_MANIFEST_INFO_FAIL, endTime - startTime);
            this.reqMainManifestInfo(); 
        });
    },

    comparisonFilesByMainManifestInfo: function(json) {
        let startTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_COMPARE_FILES_START);

        this.setLabUpdateProgressStr("0%");
        this.setUpdateProgressBarProgress(0);
        this.setLabUpdateContentTipsStr("Compare Version Files");

        this.needUpdateFileArr = [];
        this.simulationCheckFileAcount = 0;
        this.totalNumberOfRemoteMainFiles = json.length;
        this.storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
        for (let i = 1; i <= this.totalNumberOfRemoteMainFiles; i++) {
            let item = json[i + ""];
            if (!item) {
                continue;
            };
            let itemArr = item.filename.split("/");
            let serverMd5 = item.md5;
            let fileDir = "";
            for (let k = 0, itemArrLen = itemArr.length; k < itemArrLen - 1; k++) {
                fileDir = fileDir + itemArr[k] + "/";
            };
            let sourceName = jsb.fileUtils.fullPathForFilename(item.filename);
            let localMd5 = jsb.extensFunction.getMd5File(sourceName);
            if (localMd5 !== serverMd5) {
                LoggerUtil.getInstance().log(`The file that need to be updated is：${item.filename}`);
                let isExist = jsb.fileUtils.isDirectoryExist(this.storagePath + fileDir);
                if (!isExist) {
                    jsb.fileUtils.createDirectory(this.storagePath + fileDir);
                };
                this.needUpdateFileArr.push(item);
            };
            this.simulationCheckFileAcount += 1;

            // 模拟校验文件数据的进度过程
            if (this.simulationCheckFileAcount >= this.totalNumberOfRemoteMainFiles) {
                let endTime = cc.sys.now();
                CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_COMPARE_FILES_END, endTime - startTime);

                this.setLabUpdateProgressStr("100%");
                this.setUpdateProgressBarProgress(1);
                this.prepareDownDifferenceFiles();
            };
        };
    },

    setUpdateProgressBarProgress: function(progress = 0) {
        this.progressBar.progress = progress;
    },

    setLabUpdateContentTipsStr: function(str = "") {
        this.lab_updateContentTips.string = this.getUpdateLocalizedText(str);
    },

    setLabUpdateProgressStr: function(str) {
        this.lab_updateProgress.string = str;
    },

    isBengaliLanguage: function() {
        return I18NUtil.getInstance().getLanguageType() == I18NLanguagesEnum.Bengali;
    },

    getUpdateLocalizedText: function(str = "") {
        if (!this.isBengaliLanguage()) {
            return str;
        };

        let bengaliTextMap = {
            "OTP": "ওটিপি",
            "Downloading files": "ফাইল ডাউনলোড করা হচ্ছে",
            "Getting Version Information": "ভার্সনের তথ্য আনা হচ্ছে",
            "Getting Assets Manifest File Error": "অ্যাসেট ম্যানিফেস্ট ফাইল আনতে ত্রুটি",
            "Compare Version Files": "ভার্সন ফাইল তুলনা করা হচ্ছে",
            "Update Version Files": "ভার্সন ফাইল আপডেট করা হচ্ছে",
            "Please Enjoy The Game": "দয়া করে গেমটি উপভোগ করুন",
            "Sending SMS request ...": "এসএমএস অনুরোধ পাঠানো হচ্ছে...",
            "Memory login ...": "সংরক্ষিত লগইন করা হচ্ছে...",
            "Server SMS interface exception": "সার্ভারের এসএমএস ইন্টারফেসে ত্রুটি",
        };
        return bengaliTextMap[str] || str;
    },

    resetOtpTipsLabel: function() {
        if (this.lab_otpTips) {
            this.lab_otpTips.string = this.getUpdateLocalizedText("OTP");
        };
    },

    setLabUpdatePointAnim: function(isAct = false) {
        if (isAct == false) {
            this.unschedule(this.setDianTipsAnima);
            this.updateStatusPoints = 0;
            this.lab_updatePoint.string = "";
        }
        else {
            this.updateStatusPoints = 0;
            this.schedule(this.setDianTipsAnima, 0.5);
        }; 
    },

    setDianTipsAnima: function() {
        if (this.updateStatusPoints == 5) {
            this.updateStatusPoints = 0;
        };
        let updateStatusPoints = ["", ".", "..", "...", "...."][this.updateStatusPoints];
        this.lab_updatePoint.string = updateStatusPoints;
        this.updateStatusPoints += 1;
    },

    prepareDownDifferenceFiles: function() {
        this.loadDiffFilesStartTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_START);

        let needUpdateFileArrLen = this.needUpdateFileArr.length;

        LoggerUtil.getInstance().log(`Starting to download differentiated files, the number of files that need to be downloaded is ${needUpdateFileArrLen}`);

        if (needUpdateFileArrLen == 0) {
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_WITH_NO_LOADED_END);
            this.setLabUpdatePointAnim(false);
            this.setLabUpdateProgressStr("80%");
            this.setUpdateProgressBarProgress(0.8);
            cc.sys.localStorage.setItem("localVersion", GlobalCfg.ASSETS_VERSION);

            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
            this.baseBundlesHotUpdate();
        }
        else {
            this.setLabUpdateProgressStr("0%");
            this.setUpdateProgressBarProgress(0);
            this.setLabUpdateContentTipsStr("Update Version Files");

            for (let i = 0; i < 30; i++) {
                let downloader = new jsb.Downloader();
                downloader.storagePath = '';
                downloader.setOnFileTaskSuccess(this.setOnFileTaskSuccess.bind(this));
                downloader.setOnTaskError(this.setOnTaskError.bind(this));
                this.downloaderArr.push(downloader);
            };

            this.downDifferenceFiles();
        };
    },

    downDifferenceFiles: function() {
        for (let i = 0, len = this.downloaderArr.length; i < len; i++) {
            let downloader = this.downloaderArr[i];
            if (downloader.storagePath.length == 0) {
                let fileInfo = this.needUpdateFileArr[this.curNumberOfJoinedDownloader];
                if (fileInfo) {
                    LoggerUtil.getInstance().log("The file being updated is " + fileInfo.filename);
                    let md5 = fileInfo.md5;
                    let url = `${GlobalCfg.ASSETS_UPDATE_URL}/${fileInfo.filename}?md5=${md5}`;
                    downloader.storagePath = this.storagePath + fileInfo.filename;
                    downloader.createDownloadFileTask(url, this.storagePath + fileInfo.filename);
                    this.curNumberOfJoinedDownloader += 1;
                };
            };
        };
    },

    getDownLoaderByStoragePath: function (storagePath) {
        for (let i = 0, len = this.downloaderArr.length; i < len; i++) {
            let downloader = this.downloaderArr[i];
            if (downloader.storagePath == storagePath) {
                return downloader;
            };
        };
    },

    setOnFileTaskSuccess: function(task) {
        this.totalNumberOfFilesDownloaded += 1;
        let needUpdateFileArrLen = this.needUpdateFileArr.length;

        LoggerUtil.getInstance().log(`The number of successful file updates is: ${this.totalNumberOfFilesDownloaded}, The total number of updates needed is: ${needUpdateFileArrLen}`);

        let downloader = this.getDownLoaderByStoragePath(task.storagePath);
        if (downloader) {
            downloader.storagePath = '';
        };

        if (this.totalNumberOfFilesDownloaded >= needUpdateFileArrLen) {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_DIFF_FILES_WITH_LOADED_END, endTime - this.loadDiffFilesStartTime);

            this.setLabUpdatePointAnim(false);
            this.setLabUpdateProgressStr("80%");
            this.setUpdateProgressBarProgress(0.8);
            cc.sys.localStorage.setItem("localVersion", GlobalCfg.ASSETS_VERSION);

            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_PERFORM_BUNDLES_UPDATE);
            this.isHaveUpdateForResources = true;
            this.baseBundlesHotUpdate();
        }
        else {
            let percent = this.totalNumberOfFilesDownloaded/needUpdateFileArrLen;
            this.setLabUpdateProgressStr((Math.floor(percent * 100) * 0.8).toFixed(2) + "%");
            this.setUpdateProgressBarProgress(Number((percent * 0.8).toFixed(2)));
            this.downDifferenceFiles();
        };
    },

    setOnTaskError: function (task, errorCode, errorCodeInternal, errorStr) {
        LoggerUtil.getInstance().log(`An error occurred while updating the file, and the error code is ${errorCode}, The reason for the error is ${errorStr}`);
        let downloader = this.getDownLoaderByStoragePath(task.storagePath);
        if (downloader) {
            downloader.createDownloadFileTask(task.requestURL, task.storagePath);
        };
    },

    changeSceneToLobby: function() {
        LoggerUtil.getInstance().log("Update completed, now enter Login-view");
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_LOGIN_VIEW);

        this.node_lab_mobileTips.active = false;
        this.node_lab_verifyTips.active = false;
        this.progressBar.node.active = false;

        GlobalCfg.IS_FROM_LOGIN_TO_LOBBY = true;

        this.loadBundleAndRunScene();
    },

    loadBundleAndRunScene: function() {
        Promise.all([ProtobufManager.proloadProtoFiles(this.protoFiles), CommonFun.getInstance().proloadProgress(), CommonFun.getInstance().proloadSelectRoom()])
        .then((arr) => {
            CommonFun.getInstance().loadBundle('ResourcesBundle', (bundle) => {
                window.ResourcesBundle = bundle;
                this.preloadStartupLanguageBundles(() => {
                this.preloadCurrentLanguageBundle(() => {
                this.ensureCurrentLanguageEnvironment();
                GlobalCfg.USER_DATAS.token = cc.sys.localStorage.getItem("login_token");
                GlobalCfg.USER_DATAS.userId = cc.sys.localStorage.getItem("login_userid");
                if (!GlobalCfg.USER_DATAS.token) {
                    this.node_loginLayer.active = true;
                    let phoneToken = cc.sys.localStorage.getItem("phone_token");
                    if (phoneToken) {
                        this.showMemoryPhoneView();
                    }
                    else {
                        this.showCommonLoginView();
                    };
                }
                else {
                    CommonFun.getInstance().showProgress(this.getUpdateLocalizedText('Memory login ...'));
                    this.node_loginLayer.active = false;
                    let promise = SceneManager.getInstance().reqBearerToken();
                    promise.then(() => {
                        return SceneManager.getInstance().reqUserDataInfo();
                    }).then(() => {
                        CommonFun.getInstance().showProgress();
                        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.UPDATE, SceneManager.getInstance().sceneType.LOBBY);
                    }).catch(error => {
                        LoggerUtil.getInstance().log(error);
                        this.node_loginLayer.active = true;
                        this.showCommonLoginView("");
                    });
                };
                if (GlobalCfg.IS_CLUB_MODE == 1) { //代理模式不显示游客登录
                    this.node_btn_guestLogin.active = false;
                    this.node_or_sprite.active = false;
                    }
                });
                });
            }, (err) => {
                LoggerUtil.getInstance().error(`加载ResourcesBundle-Bundle异常: ${JSON.stringify(err)}`);
            });
        })
        .catch((err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    preloadCurrentLanguageBundle: function(callback) {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        let bundleName = `Language${languagesType}`;
        CommonFun.getInstance().loadBundle(bundleName, () => {
            callback && callback();
        }, (err) => {
            LoggerUtil.getInstance().error(`${bundleName}-Bundle error: ${JSON.stringify(err)}`);
            callback && callback();
        });
    },

    ensureCurrentLanguageEnvironment: function() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        I18NUtil.getInstance().setLanguageType(languagesType, true);
    },

    preloadStartupLanguageBundles: function(callback) {
        let bundleNames = ['LanguageEnglish', 'LanguageBengali'];
        let remaining = bundleNames.length;
        if (remaining === 0) {
            callback && callback();
            return;
        };

        let finishOne = () => {
            remaining -= 1;
            if (remaining <= 0) {
                callback && callback();
            };
        };

        bundleNames.forEach((bundleName) => {
            CommonFun.getInstance().loadBundle(bundleName, () => {
                finishOne();
            }, (err) => {
                LoggerUtil.getInstance().error(`${bundleName}-Bundle error: ${JSON.stringify(err)}`);
                finishOne();
            });
        });
    },

    showMemoryPhoneView: function() {
        if (this.node_login_account) {
            this.node_login_account.active = false;
        };
        if (this.node_login_register) {
            this.node_login_register.active = false;
        };
        if (this.editBox_verity) {
            this.editBox_verity.node.active = false;
        };
        if (this.node_btn_verifyDelete) {
            this.node_btn_verifyDelete.active = false;
        };
        if (this.node_btn_reqVerify) {
            this.node_btn_reqVerify.active = false;
        };
        if (this.node_btn_mobileLogin) {
            this.node_btn_mobileLogin.active = false;
        };
        if (this.node_btn_quickLogin) {
            this.node_btn_quickLogin.active = true;
        };
       
        if (this.editBox_mobile) {
            this.editBox_mobile.string = cc.sys.localStorage.getItem("login_phone").slice(2);
        };
        if (this.node_or_sprite) {
            this.node_or_sprite.setPosition(this.or_sprite_pos1);
        };
        if (this.node_btn_facebookLogin) {
            this.node_btn_facebookLogin.setPosition(this.btn_facebookLogin_pos1);
        };
        if (this.node_btn_guestLogin) {
            this.node_btn_guestLogin.setPosition(this.btn_guestLogin_pos1);
        };

        if (GlobalCfg.CHANNEL_INFO == "2023" || GlobalCfg.UNUSE_FACEBOOK > 0) {
            if (this.node_btn_facebookLogin) {
                this.node_btn_facebookLogin.active = false;
            };
            if (this.node_btn_guestLogin) {
                this.node_btn_guestLogin.setPosition(326, this.btn_guestLogin_pos1.y);
                this.node_btn_guestLogin.setContentSize(512, 79);
            };
        };
    },

    showCommonLoginView: function() {
        this.showRegisterView();
        if (this.editBox_verity) {
            this.editBox_verity.node.active = true;
        };
        if (this.node_btn_verifyDelete) {
            this.node_btn_verifyDelete.active = true;
        };
        if (this.node_btn_reqVerify) {
            this.node_btn_reqVerify.active = true;
        };
        if (this.node_btn_mobileLogin) {
            this.node_btn_mobileLogin.active = true;
        };
        if (this.node_btn_quickLogin) {
            this.node_btn_quickLogin.active = false;
        };

        if (this.editBox_mobile) {
            this.editBox_mobile.string = "";
        };
        if (this.editBox_verity) {
            this.editBox_verity.string = "";
        };
        if (this.editBox_account) {
            this.editBox_account.string = "";
        };
        if (this.editBox_password) {
            this.editBox_password.string = "";
        };
        if (this.editBox_register_account) {
            this.editBox_register_account.string = "";
        };
        if (this.editBox_register_password1) {
            this.editBox_register_password1.string = "";
        };
        if (this.editBox_register_password2) {
            this.editBox_register_password2.string = "";
        };
        if (this.node_lab_mobileTips) {
            this.node_lab_mobileTips.active = false;
        };
        if (this.node_lab_verifyTips) {
            this.node_lab_verifyTips.active = false;
        };
        if (this.node_lab_passwordTips) {
            this.node_lab_passwordTips.active = false;
        };
        this.hideRegisterTips();
        if (this.node_or_sprite) {
            this.node_or_sprite.setPosition(this.or_sprite_pos);
        };
        if (this.node_btn_facebookLogin) {
            this.node_btn_facebookLogin.setPosition(this.btn_facebookLogin_pos);
        };
        if (this.node_btn_guestLogin) {
            this.node_btn_guestLogin.setPosition(this.btn_guestLogin_pos);
        };

        if (GlobalCfg.CHANNEL_INFO == "2023" || GlobalCfg.UNUSE_FACEBOOK > 0) {
            if (this.node_btn_facebookLogin) {
                this.node_btn_facebookLogin.active = false;
            };
            if (this.node_btn_guestLogin) {
                this.node_btn_guestLogin.setPosition(326, this.btn_guestLogin_pos.y);
                this.node_btn_guestLogin.setContentSize(512, 79);
            };
        };
    },

    baseBundlesHotUpdate: function() {
        this.loadBundlesStartTime = cc.sys.now();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_START);
        LoggerUtil.getInstance().log(`Start downloading baseBundles zip files!`);
        if (GlobalCfg.is_need_update) {
            this.baseBundlesCheckUpdateArr.forEach(baseBundle => {
                if (CommonFun.getInstance().isNeedUpdata(baseBundle)) {
                    let tempObj = {
                        baseBundle: baseBundle,
                        progress: 0
                    };
                    this.baseBundlesNeedUpdateArr.push(tempObj);
                }; 
            });
        }

        if (this.baseBundlesNeedUpdateArr.length == 0) {
            let endTime = cc.sys.now();
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_LOAD_BUNDLES_WITH_NO_LOADED_END);
            CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.UPDATE_END, endTime - this.updateStartTime);

            this.setLabUpdateProgressStr("100%");
            this.setUpdateProgressBarProgress(1);
            this.setLabUpdateContentTipsStr("Please Enjoy The Game");
            this.scheduleOnce(() => {
                if (this.isHaveUpdateForResources) {
                    GlobalCfg.G_COMPONENTS.Audio.stopAll();
                    let searchPaths = jsb.fileUtils.getSearchPaths();
                    let storagePath1 = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
                    Array.prototype.unshift.apply(searchPaths, [storagePath1]);
                    searchPaths = CommonFun.getInstance().arrayDeduplication(searchPaths);
                    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                    jsb.fileUtils.setSearchPaths(searchPaths);
                    cc.game.restart();
                }
                else {
                    this.changeSceneToLobby();
                };
            }, 1);
        }
        else {
            this.baseBundlesNeedUpdateArr.forEach(tempObj => {
                GameDownloader.getInstance().priorLoadGame(tempObj.baseBundle);
            });
        };
    },
});
