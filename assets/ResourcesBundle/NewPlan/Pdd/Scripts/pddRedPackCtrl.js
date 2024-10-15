cc.Class({
    extends: require('UINode'),

    properties: {
        btn_closeAll: cc.Button,
    },

    ctor() {
        this.isStopTimer = false;
        this.ifStopBtnLabTimer = false;
    },

    onLoad() {
        this.btn_closeAll.node.on('click', this.btnClick, this);
        this.turnTableCtrl = this.node.parent.getComponent("turnTableCtrl");
        this.mask = this.node.getChildByName("mask");
    },

    start() {

    },

    // update (dt) {},

    // 红包
    initNodeRedPack: function (data) {
        this.nodeRedPack = this.node.getChildByName('nodeRedPack');
        this.lab_num_nodeRedPack = this.nodeRedPack.getChildByName('lab_num').getComponent(cc.Label);
        this.lan_numOn = this.nodeRedPack.getChildByName('lab_numOn').getComponent(cc.Label);
        this.lab_num_nodeRedPack.string = (data.award.number / 100).toFixed(2);
        this.lan_numOn.string = data.award.number / 100;

        this.btn_hongbao = this.nodeRedPack.getChildByName('hongbao').getComponent(cc.Button);
        this.btn_hongbao.node.on('click', this.btnClick, this);

        if (data.double == true) {    //双倍模式
            this.ske_huojian = this.node.getChildByName('node_ske_huojian').getComponent(sp.Skeleton);
            this.playPddSound("huojian", false);
            this.ske_huojian.node.active = true;
            this.ske_huojian.setAnimation(0, 'animation', false);
            this.ske_huojian.setCompleteListener(trackEntry => {
                this.ske_huojian.node.active = false;
                this.initLucky(data);
            });
        } else {
            this.nodeRedPack.active = true;
        }
    },

    // 双倍卡
    initNodeDoubleCard: function (data) {
        this.nodeDoubleCard = this.node.getChildByName('nodeDoubleCard');
        this.nodeDoubleCard.active = true;
        if (data.give_count == 3) {       // 赠送次数
            setTimeout(() => {
                this.nodeDoubleCard.active = false;
                this.initNodeZhuanpan(data);
                // this.closeNodeAfterTime(8);
            }, 1000);
        } else {
            this.closeNodeAfterTime(8);
            this.btn_closeAll.node.active = true;
        }
        

    },

    // 额外 3 次转盘机会
    initNodeZhuanpan: function (data) {
        this.nodeZhuanpan = this.node.getChildByName('nodeZhuanpan');
        this.btn_getCishu = this.nodeZhuanpan.getChildByName('btn_getCishu').getComponent(cc.Button);
        this.lab_time_cishu = this.btn_getCishu.target.getChildByName('Label').getComponent(cc.Label);  // 倒计时
        this.lab_time_cishu.string = "8S";
        this.closeAfertTime(this.node, 8, this.lab_time_cishu);
        this.turnTableCtrl.endShowCallback();
        this.nodeZhuanpan.active = true;
        this.btn_getCishu.node.on('click', this.btnClick, this);
    },

    // 翻倍，
    initLucky: function (data) {
        this.nodeLucky = this.node.getChildByName('nodeLucky');
        this.btn_exchange = this.nodeLucky.getChildByName('btn_exchange').getComponent(cc.Button);
        this.lab_time_exchange = this.btn_exchange.target.getChildByName('Label').getComponent(cc.Label);  // 倒计时
        this.lab_time_exchange.string = "8S";
        this.closeAfertTime(this.node, 8, this.lab_time_exchange);
        this.btn_exchange.node.on('click', this.btnClick, this);
        this.nodeLucky.active = true;
    },

    // 幸运卡
    initNodeLuckyCard: function () {
        this.nodeLuckyCard = this.node.getChildByName('nodeLuckyCard');
        this.nodeLuckyCard.active = true;
        this.closeNodeAfterTime(8);
        this.btn_closeAll.node.active = true;
    },

    // 金币
    initNodeGetTenCoin: function (data) {
        this.nodeGetTenCoin = this.node.getChildByName('nodeGetTenCoin');
        this.lab_numCoin = this.nodeGetTenCoin.getChildByName('lab_numCoin').getComponent(cc.Label);
        this.lab_curCoin = this.nodeGetTenCoin.getChildByName('lab_curCoin').getComponent(cc.Label);
        this.lab_curCoin.string = this.getFloatNum(data.gold_coin_after / 100);      //当前金币总额
        this.lab_numCoin.string = this.getFloatNum(data.award.number / 100);         //获得金币数量

        if (data.convert_coin == true) {
            this.initNodeCongra(data);
        } else {
            this.closeNodeAfterTime(8);
            this.btn_closeAll.node.active = true;
            this.nodeGetTenCoin.active = true;
        }

        this.turnTableCtrl.endShowCallback();

    },

    // 提现
    initNodeCongra: function (data) {
        this.nodeCongra = this.node.getChildByName('nodeCongra');
        this.tx_node = this.nodeCongra.getChildByName('tx_node');
        this.tx_sprite = this.tx_node.getChildByName('tx').getComponent(cc.Sprite);
        this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 140, this.tx_sprite);
        this.lab_name = this.nodeCongra.getChildByName('bg_nc').getChildByName('lab_name').getComponent(cc.Label);
        this.lab_name.string = GlobalCfg.USER_DATAS.userName;
        this.lab_getGoldNum = this.nodeCongra.getChildByName('lab_getGoldNum').getComponent(cc.Label);
        this.lab_getGoldNum.string = data.unclaimed_after / 100;
        this.btn_close = this.nodeCongra.getChildByName('btn_close').getComponent(cc.Button);
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_withdraw = this.nodeCongra.getChildByName('btn_withdraw').getComponent(cc.Button);
        this.btn_withdraw.node.on('click', this.btnClick, this);
        this.nodeCongra.active = true;
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        if (btnName == 'btn_getCishu') {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.closeAfertTime(this.node, 0, this.lab_time_cishu);
        } else if (btnName == 'btn_exchange') {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.turnTableCtrl.endShowCallback();
            this.closeAfertTime(this.node, 0, this.lab_time_exchange);
        } else if (btnName == 'hongbao') {     // 红包,点击撒货币
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.mask.active = false;
            let light_ske = this.nodeRedPack.getChildByName('light_ske');
            let caidai_ske = this.nodeRedPack.getChildByName('caidai_ske');
            caidai_ske.active = false;
            light_ske.active = false;
            cc.tween(this.node)
                .to(0.5, { scale: 0.5, position: cc.v2(-420, 180), opacity: 0 }, { easing: 'sineInOut' })
                .call(() => {
                    this.turnTableCtrl.endShowCallback();
                    this.node.destroy();
                })
                .start();
        } else if (btnName == 'btn_close') {    // 关闭
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        } else if (btnName == 'btn_withdraw') {   // 提现
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.turnTableCtrl.changeBankInfo();
        } else if (btnName == 'btn_closeAll') {   // 关闭所有
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.closeNodeAfterTime(0);
        }
    },

    closeNodeAfterTime: function (time) {
        if (time == 0) {
            this.isStopTimer = true;
            this.node.destroy();
        } else {
            setTimeout(() => {
                console.log("执行了 closeNodeAfterTime ,此时的time", time);
                time--;
                if (time >= 0 && !this.isStopTimer) {
                    this.closeNodeAfterTime(time);
                }
            }, 1000);
        }
    },

    // 指定时间之后关闭指定节点
    closeAfertTime: function (node, time, label) {
        let timeString = time;
        label.string = timeString + "S";
        if (time == 0) {
            this.ifStopBtnLabTimer = true;
            this.turnTableCtrl.endShowCallback();
            node.destroy();
        } else {
            setTimeout(() => {
                console.log("timeString", timeString);
                time--;
                if (time >= 0 && !this.ifStopBtnLabTimer) {
                    this.closeAfertTime(node, time, label);
                }
            }, 1000);
        }

    },

    /**
     * 小数点后保留非0位数
     * @param {Number} num 小数
     * @returns {String}
     */
    getFloatNum: function (num) {
        let numString = num.toString();
        if (numString.charAt(numString.length - 1) == '0') {
            numString = numString.substring(0, numString.length - 1);
            return this.getFloatNum(numString);
        } else {
            return numString;
        }
    },

    playPddSound: function (soundName, isLoop = false) {
        ResourcesBundle.load("sound/pddSound/" + soundName, cc.AudioClip, function (err, audioClip) {
            if (!err) {
                cc.audioEngine.playMusic(audioClip, isLoop);
            }
        });
    },
});
