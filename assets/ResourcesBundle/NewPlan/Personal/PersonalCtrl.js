cc.Class({
    extends: cc.Component,

    properties: {
        sprite_vipLevelIcon: cc.Sprite,
        atlas_levelIcon: cc.SpriteAtlas,
        // 新增：用于控制是否允许交互的标志位
        _isAnimationFinished: false, 
        // 缓存 mask 节点引用，方便动态开关触摸
        _maskNode: null,
        _maskTouchHandler: null,
    },

    getNode: function() {
        let mask = this.node.getChildByName("mask");
        this._maskNode = mask; // 缓存引用

        let node = this.node.getChildByName("node");
        node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);

        let node_user = node.getChildByName("bg").getChildByName("node_user");
        this.lab_deposited = node_user.getChildByName("bg_cash").getChildByName("lab_deposited").getComponent(cc.Label);
        this.lab_winnings = node_user.getChildByName("bg_cash").getChildByName("lab_winnings").getComponent(cc.Label);
        this.lab_totalCash = node_user.getChildByName("bg_cash").getChildByName("lab_totalCash").getComponent(cc.Label);
        this.node_totalCash = node_user.getChildByName("bg_cash").getChildByName("node_totalCash").getComponent(cc.Label); // 注意：这里原代码获取的是 Label 组件但变量名叫 node_，保持原样

        this.lab_bonus = node_user.getChildByName("bg_bonus").getChildByName("lab_bonus").getComponent(cc.Label);

        this.lab_mobile = node_user.getChildByName("bg_info").getChildByName("lab_Mobile").getComponent(cc.Label);
        this.lab_name = node_user.getChildByName("bg_info").getChildByName("lab_name").getComponent(cc.Label);
        this.lab_email = node_user.getChildByName("bg_info").getChildByName("lab_email").getComponent(cc.Label);

        this.lab_user_name = node_user.getChildByName("bg_name").getChildByName("lab_user_name").getComponent(cc.Label);
        this.lab_ID = node_user.getChildByName("bg_id").getChildByName("lab_ID").getComponent(cc.Label);
        this.headSp = node_user.getChildByName("node_txt").getChildByName("tx").getComponent(cc.Sprite);

        this.bg = node.getChildByName("bg");

        this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 140, this.headSp);
        this.lab_ID.string = GlobalCfg.USER_DATAS.userId;
        this.lab_user_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 12);

        // 【修改点 1】：初始化时先不绑定点击事件，或者绑定但受控于标志位
        // 这里我们采用绑定但受控的方式，并在 statiAct 中控制逻辑
        if (this._maskTouchHandler) {
            mask.off(cc.Node.EventType.TOUCH_START, this._maskTouchHandler, this);
        }
        
        this._maskTouchHandler = () => {
            // 【关键拦截】：如果动画没结束，直接返回，不播放声音也不关闭
            if (!this._isAnimationFinished) {
                return;
            }
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.outAct(() => {
                this.node.destroy();
            });
        };

        mask.on(cc.Node.EventType.TOUCH_START, this._maskTouchHandler, this);
    },

    onLoad: function () {
        // 初始化状态锁：动画未完成，禁止交互
        this._isAnimationFinished = false; 
        
        this.statiAct(); // 先播放入场动画
        this.getNode();  // 初始化节点
        this.initDataLobby();
        this.showPlayerInFo();
        this.showVipLevelIcon();

        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].node.on("click", this.btnClick, this);
        };

        this.sprite_vipLevelIcon.node.on("click", this.btnClick, this);

        // 奖券兑换活动
        let NodebtnToBonus = cc.find('node/bg/node_user/bg_bonus/btnToBonus', this.node);
        if (NodebtnToBonus) {
             NodebtnToBonus.active = GlobalCfg.USER_DATAS.openModules.includes(12);
        }
        
        // 充值
        let NodebtnToShop = cc.find('node/bg/node_user/bg_cash/btnToShop', this.node);
        if (NodebtnToShop) {
            NodebtnToShop.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        }

        // 提现
        let NodebtnToWithdraw = cc.find('node/bg/node_user/bg_cash/btnToWithdraw', this.node);
        if (NodebtnToWithdraw) {
            NodebtnToWithdraw.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        }

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    initDataLobby: function () {
        if (!cc.isValid(this.node)) { return }
        this.lab_deposited.string = GlobalCfg.USER_DATAS.deposit ? "$" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100)) : "$" + 0;
        if (GlobalCfg.USER_DATAS.recharged > 0) {
            this.lab_winnings.string = GlobalCfg.USER_DATAS.winnings ? "$" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.winnings, 100)) : "$0";
        }
        else {
            this.lab_deposited.string = "$0";
            this.lab_winnings.string = GlobalCfg.USER_DATAS.deposit ? "$" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100)) : "$0";
        };
        this.lab_totalCash.string = GlobalCfg.USER_DATAS.userDiamond ? "$" + CommonFun.getInstance().numberToShow(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100)) : "$0";
        this.lab_bonus.string = GlobalCfg.USER_DATAS.bonus ? "$" + GlobalCfg.USER_DATAS.bonus / 100 : "$" + 0;
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO) {
            self.lab_user_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 12);
            self.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 110, self.headSp);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.BINDPHONE_SUCCESS) {
            let data = notify.data;
            self.lab_name.string = CommonFun.getInstance().getStrByLength(data.realname, 10);
            self.lab_mobile.string = data.phone.slice(2, data.phone.length);
            self.lab_email.string = CommonFun.getInstance().getStrByLength(data.mail, 15);
            self.lab_bonus.string = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.bonus, 100);
        }
        else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
            self.showVipLevelIcon();
        };
    },

    btnClick: function (button) {
        // 【关键拦截 2】：所有按钮点击前检查动画状态
        // 防止在动画过程中点击内部按钮导致逻辑错误
        if (!this._isAnimationFinished) {
            return; 
        }

        var btnName = button.node.name;
        LoggerUtil.getInstance().log(">>>>>btnName>>>>>>>>", btnName);

        if (btnName === "btn_exit") {
            GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.LOGIN);
            return;
        }

        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_change") {
            CommonFun.getInstance().showChangeName();
        }
        else if (btnName === "btn_bind") {
            CommonFun.getInstance().showBindPhone('Personal');
        } else if (btnName == "tx") {
            CommonFun.getInstance().showChangeHead();
        } else if (btnName == "btn_add") {
            // 假设 node_checkClick 存在
            let checkNode = this.node.getChildByName("node_checkClick");
            if(checkNode) checkNode.active = true;
        } else if (btnName == "btn_photograph") {
            APPManager.SelectImg(JSON.stringify({ needClip: true, size: 120.0, imageType: 'PAI_ZHAO' }));
            this.node.destroy();
        } else if (btnName == "btn_photo") {
            APPManager.SelectImg(JSON.stringify({ needClip: true, size: 120.0, imageType: 'ZHAO_PIAN' }));
            this.node.destroy();
        } else if (btnName == "btn_cancel") {
            let checkNode = this.node.getChildByName("node_checkClick");
            if(checkNode) checkNode.active = false;
        } else if (btnName == "btnToShop") {
            this.outAct(() => {
                CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.PersonalToShop);
                this.node.destroy();
            });
        }
        else if (btnName == "btnToWithdraw") {
            this.outAct(() => {
                this.showWithDraw();
                this.node.destroy();
            });
        }
        else if (btnName == "btnToBonus") {
            this.outAct(() => {
                CommonFun.getInstance().showBonusTransfer();
                this.node.destroy();
            });
        }
        else if (btnName == "vipLevelIcon") {
            if (CommonFun.getInstance().isOpenVipModule()) {
                this.outAct(() => {
                    CommonFun.getInstance().showMyVip();
                    this.node.destroy();
                });
            }
        }
    },

    showPlayerInFo: function () {
        let name = GlobalCfg.USER_DATAS.realname ? GlobalCfg.USER_DATAS.realname : "null";
        let mobile = GlobalCfg.USER_DATAS.phone ? GlobalCfg.USER_DATAS.phone : "null";
        let email = GlobalCfg.USER_DATAS.mail ? GlobalCfg.USER_DATAS.mail : "null";
        this.lab_mobile.string = mobile == "null" ? mobile : mobile.slice(2, mobile.length);
        this.lab_name.string = CommonFun.getInstance().getStrByLength(name, 10);
        this.lab_email.string = CommonFun.getInstance().getStrByLength(email, 15);
    },

    // 【核心修改点 3】：出场动画逻辑优化
    statiAct: function () {
        let node = this.node.getChildByName('node');
        // 确保初始位置在屏幕外（如果需要），或者直接开始动画
        // 这里假设你的 tween 是从当前位置到 (0,0)，或者你之前设置了位置
        
        cc.tween(node)
            .to(0.3, { position: cc.v2(0, 0) }, { easing: 'smooth' })
            .call(() => {
                // 动画完成回调
                this._isAnimationFinished = true; // 解锁交互
                
                // 可选：如果需要在动画结束后做一些 UI 更新，放在这里
                if (this.lab_mobile.string == "null" && this.lab_name.string == "null" && this.lab_email.string == "null") {
                    // this.lab_blind.string = teenPattiLanguage.lobby[2][language];
                } else {
                    // this.lab_blind.string = otherLanguage.modify[language];
                };
            })
            .start();
    },

    // 退出动画
    outAct: function (callback) {
        // 退出时也可以加个锁防止重复点击，不过通常 destroy 后就没问题了
        let w = cc.view.getVisibleSize().width;
        let node = this.node.getChildByName('node');
        cc.tween(node)
            .to(0.3, { position: cc.v2(-w, 0) }, { easing: 'smooth' })
            .call(() => {
                if (callback) callback();
            })
            .start();
    },

    showWithDraw: function () {
        CommonFun.getInstance().showWithDrawPreData();
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        
        // 清理触摸监听，防止内存泄漏
        if (this._maskNode && this._maskTouchHandler) {
            this._maskNode.off(cc.Node.EventType.TOUCH_START, this._maskTouchHandler, this);
        }

        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CHANGEHEAD);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CHANGEHEADITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PERSONAL);
    },

    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    showVipLevelIcon: function () {
        if (CommonFun.getInstance().isOpenVipModule() && GlobalCfg.USER_DATAS.userVip.level > 0 && GlobalCfg.USER_DATAS.userVip.level <= 10) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_levelIcon.getSpriteFrame(GlobalCfg.USER_DATAS.userVip.level);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(GlobalCfg.USER_DATAS.userVip.level);
        if (isCanShowVIPFont) {
            this.lab_name.node.color = new cc.Color(250, 225, 76);
        }
        else {
            this.lab_name.node.color = new cc.Color(255, 255, 255);
        };
    },
});