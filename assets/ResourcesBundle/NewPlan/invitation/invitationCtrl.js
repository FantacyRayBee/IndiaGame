
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Button,
        //whell
        node_wheel: cc.Node,
        btn_draw: cc.Button,
        btn_draw2: cc.Button,
        lab_spin: cc.Label,

        //left
        node_left: cc.Node,
        content: cc.Node,
        item_left: cc.Node,
        btn_collect: cc.Button,
        lab_recharged: cc.Label,
        //right
        node_right: cc.Node,

        btn_telegram: cc.Button,
        btn_share: cc.Button,
        btn_share2: cc.Button,
        item_rights: [cc.Node],

        sp_coin1: cc.SpriteFrame,
        sp_coin2: cc.SpriteFrame,
    },

    onLoad() {
        this.obj_wheels = [];
        for (let i = 0; i < 8; i++) {
            this.obj_wheels[i] = this.node_wheel.getChildByName(`wheel${i + 1}`);
        }

        this.btnClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_draw.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btn_draw2.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btn_collect.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_telegram.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_share2.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    ctor: function () {
        // 各个奖励角度
        this.awardAngle = [0, -45, -90, -135, -180, -225, -270, -315];
    },

    start() {
        this.refreshPanel()
    },

    refreshPanel() {
        this.setWheel();
        this.setLeft();
        this.setRight();
    },

    btnClick(button) {
        let btnName = button.node.name;
        if (btnName == "btnClose") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_draw" || btnName == "btn_draw2") {
            this.dealDraw();
        }
        if (btnName == "btn_collect") {
            this.dealCollect();
        }
        else if (btnName == "btn_telegram") {
            this.dealShare(1);
        }
        else if (btnName == "btn_share") {
            this.dealShare(2);
        }
        else if (btnName == "btn_share2") {
            this.dealShare(3);
        }
    },

    setWheel() {

        for (let i = 0; i < this.obj_wheels.length; i++) {
            this.setWheelItemData(this.obj_wheels[i], GlobalCfg.USER_DATAS.invitationData.invitation_to_the_draw[i]);
        }

        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (languagesType == I18NLanguagesEnum.Bengali) {
            this.lab_spin.string = "স্পিন: " + GlobalCfg.USER_DATAS.invitationData.spin_count;
        }
        else {
            this.lab_spin.string = "spin: " + GlobalCfg.USER_DATAS.invitationData.spin_count;
        }
    },

    setWheelItemData(obj, data) {
        let lab_jb = obj.getChildByName("lab").getComponent(cc.Label);
        let img_jb = obj.getChildByName("jb").getComponent(cc.Sprite);
        let button_bg = obj.getChildByName("bg").getComponent(cc.Button);
        let button_jb = obj.getChildByName("jb").getComponent(cc.Button);
        let node_yes = obj.getChildByName("yes");
        lab_jb.string = CommonFun.getInstance().formatCurrencyAmount(data.item.amount / 100);
        img_jb.spriteFrame = data.item.id == 12 ? this.sp_coin2 : this.sp_coin1;

        button_bg.interactable = !data.is_reward;
        button_jb.interactable = !data.is_reward;
        node_yes.active = data.is_reward;
    },

    setLeft() {
        this.content.removeAllChildren();
        let extra_rewards = GlobalCfg.USER_DATAS.invitationData.extra_rewards;
        let recharge_count = GlobalCfg.USER_DATAS.invitationData.recharge_count;
        let startIndex = this.getStartIndexByRecharges(recharge_count);
        LoggerUtil.getInstance().log("startIndex: ",startIndex);
        let canCollect = false;
        for (let i = 0; i < extra_rewards.length; i++) {
            // 有可领取的奖励
            if (recharge_count > 0 && extra_rewards[i].friends <= recharge_count && extra_rewards[i].is_collect == false) {
                canCollect = true;
                break;
            }
        }
        LoggerUtil.getInstance().log("canCollect: ",canCollect);
        this.btn_collect.interactable = canCollect;
        this.btn_collect.enableAutoGrayEffect = !canCollect;
        this.lab_recharged.string = recharge_count;

        for (let i = 0; i < 6; i++) {
            let index = startIndex + i;
            if (index >= extra_rewards.length) {
                break;
            }
            let itemNode = cc.instantiate(this.item_left);
            this.content.addChild(itemNode);
            this.setLeftItem(itemNode, extra_rewards[index]);
        }
    },

    setRight() {
        let get_draw_chances_task = GlobalCfg.USER_DATAS.invitationData.get_draw_chances_task
        let startIndex = this.getStartIndexByTaskComplete(get_draw_chances_task);
        for (let i = 0; i < 3; i++) {
            this.setRightItem(this.item_rights[i], get_draw_chances_task[startIndex + i]);
        }
    },

    // 获取任务开始索引
    getStartIndexByTaskComplete(task) {
        let startIndex = -1;
        for (let i = 0; i < task.length; i++) {
            if (task[i].schedule == task[i].task) {
                //已完成
            }
            else {
                startIndex = i;
                break;
            }
        }
        if (startIndex == -1 || task.length - startIndex <= 3) {
            startIndex = task.length - 3;
        }
        return startIndex;
    },

    getStartIndexByRecharges(recharge_count) {
        let startIndex = 0;
        let extra_rewards = GlobalCfg.USER_DATAS.invitationData.extra_rewards;
        for (let i = 0; i < extra_rewards.length - 1; i++) {
            if (extra_rewards[i].friends <= recharge_count && extra_rewards[i + 1].friends > recharge_count) {
                if (extra_rewards[i].is_collect == false) {
                    startIndex = i;
                }
                else {
                    startIndex = i + 1;
                }
                break;
            }
        }
        return startIndex;
    },

    setLeftItem(obj, data) {
        let lab_friends = obj.getChildByName("friend").getComponent(cc.Label);
        let lab_winnings = obj.getChildByName("winnings").getComponent(cc.Label);
        let node_lock = obj.getChildByName("lock")
        let node_unlock = obj.getChildByName("unlock");
        obj.active = true;

        lab_friends.string = data.friends;
        lab_winnings.string = CommonFun.getInstance().formatCurrencyAmount(data.rewards / 100);
        node_lock.active = data.friends > GlobalCfg.USER_DATAS.invitationData.recharge_count;
        node_unlock.active = !node_lock.active;
    },

    setRightItem(obj, data) {
        let lab_desc = obj.getChildByName("name").getComponent(cc.Label);
        let lab_num = obj.getChildByName("desc").getComponent(cc.Label);
        let lab_spin = obj.getChildByName("num").getComponent(cc.Label);

        lab_num.string = `${data.schedule}/${data.task}`;
        lab_spin.string = data.spin;

        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (languagesType == I18NLanguagesEnum.English) {
            lab_desc.string = `Invite ${data.task} friends to recharge`;
        }
        else if (languagesType == I18NLanguagesEnum.Hindi) {
            lab_desc.string = `अपने ${data.task} दोस्तों को रिचार्ज करने के लिए आमंत्रित करें`;
        }
        else if (languagesType == I18NLanguagesEnum.Urdu) {
            lab_desc.string = `اپنے ${data.task} دوستوں کو ریچارج کرنے کے لئے مدعو کریں`;
        }
        else if (languagesType == I18NLanguagesEnum.Bengali) {
            lab_desc.string = `আপনার ${data.task} বন্ধুদের রিচার্জ করতে আমন্ত্রণ জানান`;
        }
    },

    dealDraw() {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if(GlobalCfg.USER_DATAS.invitationData.spin_count <= 0){
            CommonFun.getInstance().showTips("Copy successful,share it with your friends!");
            let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.copyToPasteBoard(shareUrl);
            return;
        }
        this.btn_draw.interactable = false;
        let url =  GlobalCfg.HTTP_SERVER + "/v1/promoter/shareactivityspin";
        CommonFun.getInstance().httpPost(url,{}, (jsonObj) => {  
            if (jsonObj.result == 0) { 
                if (CommonFun.getInstance().isValidForScr(this)) {
                    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("turnPlate", false);
                    this.trunPlateRotation(jsonObj.data);
                }
            }
            else {
                CommonFun.getInstance().showTips(jsonObj.msg);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealCollect() {
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/shareactivitycollectall";
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0) {
                let rewards = msg.data.reward;
                GlobalCfg.USER_DATAS.userDiamond += rewards;
                CommonFun.getInstance().showRewardsTips([{
                    id: 10,
                    amount: rewards / 100
                }]);
                this.refreshData();
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealShare(type) {
        if (type == 1) { //复制链接跳转飞机
            let inviteCode = `?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;        
            let shareStrtmp = "Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！";
            let shareUrls = GlobalCfg.APP_SHARE_URL + inviteCode;
            let str = "https://t.me/share/url?text=" +  encodeURIComponent(shareStrtmp)+ "&url="+ encodeURIComponent(shareUrls);
            cc.sys.openURL(str);
        }
        else if (type == 2) { //复制链接
            let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.copyToPasteBoard(shareUrl);
            CommonFun.getInstance().showTips("Copy successful!");
        }
        else if (type == 3) { //复制链接跳转原生
            let shareUrl = `Your cash will expire in three hours, download theNo.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.Share(shareUrl);
        }
    },


    trunPlateRotation: function (data) {
        let awardno = data.id;
        let remaincount = data.remaincount || 0;

        this.compensation = this.node_wheel.angle % 360 + 360;
        //旋转时间
        let rotationTime = 3.59;
        //旋转圈数
        let rotationcircle = 2;
        //奖励圈数
        let RotationAngle = this.node_wheel.angle - rotationcircle * 360 - this.awardAngle[awardno - 1] - this.compensation;
        cc.tween(this.node_wheel)
            .to(rotationTime, { angle: RotationAngle }, { easing: 'sineInOut' })
            .call(() => {
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
                if (data.itemId != 12) {
                    GlobalCfg.USER_DATAS.userDiamond += data.itemNun;
                    GlobalCfg.USER_DATAS.winnings += data.itemNun;
                }
                else{
                    GlobalCfg.USER_DATAS.bonus += data.itemNun;
                }
                CommonFun.getInstance().showRewardsTips([{
                    id: data.itemId == 12 ? data.itemId : 10,
                    amount: data.itemNun/100
                }]);
                this.refreshData();
                // if (remaincount <= 0) {
                //     this.btn_draw.interactable = false;
                //     this.btn_draw.enableAutoGrayEffect = true;
                // }
                // else {
                //     this.btn_draw.interactable = true;
                //     this.btn_draw.enableAutoGrayEffect = false;
                // };

                let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
                if (languagesType == I18NLanguagesEnum.Bengali) {
                    this.lab_spin.string = "স্পিন: " + remaincount;
                }
                else {
                    this.lab_spin.string = "spin: " + remaincount;
                }
            })
            .start();
    },

    refreshData() {
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/promoter/shareactivity";
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0) {
                GlobalCfg.USER_DATAS.invitationData = msg.data;
                this.refreshPanel();
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    onDestroy() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.INVITATION);
    },

});