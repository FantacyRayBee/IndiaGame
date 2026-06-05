cc.Class({
    extends: require('UINode'),

    properties: {

    },

    init: function () {
        this.isSpinning = false;        // 是否正在转动

        this.node_yhk = this.node.getChildByName("bg_yhk");
        this.lab_bank = this.node_yhk.getChildByName("lab_bank").getComponent(cc.Label);
        this.lab_time = this.node_yhk.getChildByName("lab_time").getComponent(cc.Label);
        this.lab_gold = this.node_yhk.getChildByName("lab_gold").getComponent(cc.Label);

        this.lab_gold.string = "0.00";

        this.lab_cha = this.node_yhk.getChildByName("lab_cha").getComponent(cc.Label);
    this.lab_cha.string = CommonFun.getInstance().formatCurrencyAmount("0.00");
        this.lab_count = this.node_yhk.getChildByName("lab_count").getComponent(cc.Label);
        this.lab_bankCardId = this.node_yhk.getChildByName("lab_bankCardId").getComponent(cc.Label);
        this.btn_changeBankInfo = this.node_yhk.getChildByName("btn_changeBankInfo").getComponent(cc.Button);
        this.btn_changeBankInfo.node.on('click', this.btnClick, this);
        this.btn_back = this.node.getChildByName("btn_back").getComponent(cc.Button);
        this.btn_back.node.on('click', this.btnClick, this);
        this.showLuckNode = this.node.getChildByName("showLuckNode").getComponent(cc.ScrollView);

        this.lab_withdrawCount = this.node.getChildByName("lab_withdrawCount").getComponent(cc.Label);
        this.lab_withdrawCount.string = "0";
        this.btn_withDraw = this.node.getChildByName("btn_withDraw").getComponent(cc.Button);
        this.btn_withDraw.node.on('click', this.btnClick, this);

        this.node_zhuanpan = this.node.getChildByName("zhuanpan");
        this.tableLight_ske = this.node_zhuanpan.getChildByName('tableLight_ske').getComponent(sp.Skeleton);
        this.tableLight_ske.node.active = false;
        this.btn_spin = this.node_zhuanpan.getChildByName("btn_spin").getComponent(cc.Button);
        this.lab_spinNum = this.btn_spin.node.getChildByName("Background").getChildByName("lab_count").getComponent(cc.Label);
        this.btn_spin.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.node_zp = this.node_zhuanpan.getChildByName("bg_zp");

        this.greyMask = this.node.getChildByName('grey');
        this.btnFinger = this.node.getChildByName('finger').getComponent(cc.Button);
        this.fingerNode = this.btnFinger.target;
        this.btnFinger.node.on('click',CommonFun.getInstance().debounce(this.btnClick, 2), this);
        CommonFun.getInstance().httpGet(GlobalCfg.HTTP_SERVER + "/v1/pdd/winninglist", (strInfo) => {
            if (strInfo.result == 0) {
                let data = strInfo.data;
                this.showLuckNodeFunc(data.list);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);

        // 旋转角度 金币、金币、幸运卡、双倍卡、现金、现金
        this.awardAngle = [150, 330, -90, 90, 30, 210];
        this.showDataCount = 0;
    },

    /**
     * 显示抽奖界面
     * @param {*} data 接口 /v1/pdd/info
     */
    setData(data) {
        console.log("setData的data", data);
        if(data.used_count == 0){
            this.intervalID = setInterval( ()=> {
                this.fingerAction();
            }, 1500);
        }else{
            this.greyMask.active = false;
            this.btnFinger.node.active = false;
        }
        let bankCardinfo = JSON.parse(cc.sys.localStorage.getItem("bankCradInfo"));
        if (bankCardinfo) {
            this.lab_bank.string = bankCardinfo.bankName;
        } else {
            this.lab_bank.string = "HDFC BANK";
        }
        this.unclaimed = data.unclaimed / 100;
        this.lab_gold.string = "" + this.unclaimed.toFixed(2);
        this.quota = Math.round(data.quota / 100);

        this.lab_count.string = this.quota;
        this.lab_cha.string = CommonFun.getInstance().formatCurrencyAmount(Number(this.quota - this.unclaimed).toFixed(2));
        this.lab_spinNum.string = data.remain_count;
        if (data.quota == data.unclaimed) {
            this.lab_time.string = "00: 00: 00";
        } else {
            this.Countdown(data.create_time, 3);
        }

        this.lab_withdrawCount.string = this.quota;

    },

    onLoad() {
    },

    start() {

    },

    fingerAction:function(){
        console.log("////////");
        cc.tween(this.fingerNode)
            .tag(21)
            .to(0.25, { scale: 1.2 })
            .to(0.5, { scale: 0.9 })
            .start()
    },

    btnClick: function (Button) {
        let btnName = Button.node.name;
        // if (this.isSpinning == true) { return }
        if (btnName == "btn_back") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        } else if (btnName == "btn_withDraw") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.quota == this.unclaimed) {
                // this.withDraw();
                this.changeBankInfo();
            } else {
                this.showTips();
            }
        } else if (btnName == "btn_spin") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.isSpinning = true;
            this.spinCallBack();
            // this.trunPlateRotation();
        } else if (btnName == "btn_changeBankInfo") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.changeBankInfo();
        } else if(btnName == "finger"){
            this.greyMask.active = false;
            this.btnFinger.node.active = false;
            clearInterval(this.intervalID);
            // 停止手指动作
            cc.Tween.stopAllByTag(21);
            this.isSpinning = true;
            this.spinCallBack();
        }
    },

    shareToInvite() {
        ResourcesBundle.load('NewPlan/Pdd/prefab/pddShare', (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            let node = cc.instantiate(prefab);
            this.node.addChild(node);
            node.getComponent("pddShareCtrl").init();
        })
    },

    spinCallBack: function () {
        this.tableLight_ske.setAnimation(0, "animation_1", false);
        this.tableLight_ske.node.active = true;
        let self = this;
        let url = GlobalCfg.HTTP_SERVER + "/v1/pdd/luckydraw";
        CommonFun.getInstance().httpGet(url, function (strInfo) {
            console.log("pdd消息:", strInfo);
            if(strInfo.result == 5036){
                self.shareToInvite();
                self.isSpinning = false;
                return
            }
            if (strInfo.result == 0) {
                
                /**
                 * data:
                    award:                  // 奖品
                        number: 10          // 数量
                        type: 3             // 类型
                    convert_coin: false     // 是否兑换金币
                    double: false           // 是否双倍模式
                    give_count: 0           // 赠送次数
                    gold_coin_after: 0      // 金币
                    remain_count: 2         //剩余次数
                    unclaimed_after: 39810  // 待领取
                 */
                self.playPddSound("turnTable", false);
                let data = strInfo.data;
                self.unclaimed = data.unclaimed_after / 100;
                self.lab_spinNum.string = (data.remain_count < self.lab_spinNum.string) ? data.remain_count : self.lab_spinNum.string;
                if (data.award) {
                    switch (data.award.type) {
                        case 0:     // 幸运卡
                            self.trunPlateRotation(2);
                            break;
                        case 1:     // 双倍卡
                            self.trunPlateRotation(3);
                            break;
                        case 2:     // 金币
                            let awardno = Math.round(Math.random());
                            self.trunPlateRotation(awardno);
                            break;
                        case 3:     // 货币
                            let awardno1 = Math.round(Math.random()) + 4;
                            self.trunPlateRotation(awardno1);
                            break;
                        default:
                            break;
                    }
                } else {
                    console.error("Data.award is null");
                }
                self.setSpinData(data);
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    setSpinData: function (data) {
        this._luckydrawData = data;
    },

    // awardno 0:金币 1:金币 2:幸运卡 3:双倍卡 4:货币 5:货币
    trunPlateRotation: function (awardno) {
        this.compensation = this.node_zp.angle % 360 + 360;
        //旋转时间
        let rotationTime = 1.8;
        //旋转圈数
        let rotationcircle = 3;
        //奖励圈数
        let RotationAngle = this.node_zp.angle - rotationcircle * 360 - this.awardAngle[awardno] - this.compensation;
        cc.tween(this.node_zp)
            .to(rotationTime, { angle: RotationAngle }, { easing: 'sineInOut' })
            .call(() => {
                this.showPropByType();
            })
            .start();
    },


    showPropByType: function () {
        let type = this._luckydrawData.award.type;
        let self = this;
        ResourcesBundle.load('NewPlan/Pdd/prefab/pddRedPack', function (err, prefab) {
            if (err) {
                console.error("setBank 预制体生成错误！");
                return
            } else {
                let pddRedPack = cc.instantiate(prefab);
                let pddRedPackCtrl = pddRedPack.getComponent("pddRedPackCtrl");
                self.node.addChild(pddRedPack);
                self.tableLight_ske.node.active = false;
                self.isSpinning = false;
                self.playPddSound("showRedPacket", false);
                switch (type) {
                    case 0:     // 幸运卡
                        pddRedPackCtrl.initNodeLuckyCard(self._luckydrawData);
                        break;
                    case 1:     // 双倍卡
                        pddRedPackCtrl.initNodeDoubleCard(self._luckydrawData);
                        break;
                    case 2:     // 金币
                        pddRedPackCtrl.initNodeGetTenCoin(self._luckydrawData);
                        break;
                    case 3:     // 货币
                        pddRedPackCtrl.initNodeRedPack(self._luckydrawData);
                        break;
                    default:
                        break;
                }
            }
        });

    },

    endShowCallback: function () {
        this.lab_gold.string = "" + (this._luckydrawData.unclaimed_after / 100).toFixed(2);
        this.lab_cha.string = CommonFun.getInstance().formatCurrencyAmount(Number(this.quota - this.lab_gold.string).toFixed(2));
        this.lab_spinNum.string = this._luckydrawData.remain_count;
    },

    /**
     * 倒计时 
     * @param {Number} startTime 单位 秒
     * @param {Number} endDay 单位  天
     */
    Countdown: function (startTime, endDay) {
        let count = 0;
        // 轮询计算时间
        this.loop = function () {
            count++;
            let that = this;
            clearTimeout(this.changeTime);
            this.changeTime = null;
            this.changeTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init();
                }
            }, 1000);

        };
        // 格式化时分秒
        this.formatDuring = function (mss) {
            let hours = Math.floor(mss / (60 * 60));
            let minutes = Math.floor((mss % (60 * 60)) / 60);
            let seconds = Math.floor(mss % 60);
            return hours + ": " + (minutes < 10 ? '0' + minutes : minutes) + ": " + (seconds < 10 ? '0' + seconds : seconds);
        };
        // 初始化倒计时
        this.init = function () {
            if (count == 5) {
                count = 0;
                CommonFun.getInstance().httpGet(GlobalCfg.HTTP_SERVER + "/v1/pdd/winninglist", (strInfo) => {
                    if (strInfo.result == 0) {
                        let data = strInfo.data;
                        this.showLuckNodeFunc(data.list);
                    }
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            }
            if (cc.isValid(this.node)) {
                let endTime = startTime + (endDay * 24 * 60 * 60); // 结束时间 
                let timeLeft = endTime - new Date().getTime() / 1000; // 剩余时间
                this.lab_time.string = this.formatDuring(timeLeft);
                if (timeLeft <= 0) {
                    this.lab_time.string = "00: 00: 00";
                    return
                }
                this.loop();
            }
        };
        this.init();
    },

    getDateToDay: function (data) {
        let date = new Date(data)
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return y + '-' + this.add0(m) + '-' + this.add0(d)
    },

    /**
     * 返回时间
     * @param {Object} data 
     * @returns String 10:02
     */
    getDateToMinute: function (data) {
        let date = new Date(data)
        var h = date.getHours();
        var mm = date.getMinutes();
        return this.add0(h) + ':' + this.add0(mm)
    },

    add0: function (m) {
        return m < 10 ? '0' + m : m
    },



    changeBankInfo: function () {
        let self = this;
        ResourcesBundle.load('NewPlan/Pdd/prefab/setBank', function (err, prefab) {
            if (err) {
                console.error("setBank 预制体生成错误！");
                return
            } else {
                let bankInfoPab = cc.instantiate(prefab);
                let setBankCtrl = bankInfoPab.getComponent("setBankCtrl");
                self.node.addChild(bankInfoPab);
                setBankCtrl.init();
            }
        });
    },

    withDraw: function () {
        let url = GlobalCfg.HTTP_SERVER + "/v1/payment/transferoption/list"
        let self = this;
        CommonFun.getInstance().httpGet(url, function (strInfo) {
            cc.log("提现列表", strInfo)
            if (strInfo.result == 0) {
                if (strInfo.data.code == 9999) { // 没有充值
                    let curScene = cc.director.getScene();
                    let MsgBoxNode = curScene.getChildByName("MsgBox");
                    if (MsgBoxNode && MsgBoxNode.active == true) {
                        return
                    }
                    if(GlobalCfg.USER_DATAS.mail.length <= 0 || GlobalCfg.USER_DATAS.phone.length <= 0) {
                        let str = "This feature is available only for premium players Add cash ";
                        str += "now to become a premium player.";
                        let newStr = CommonFun.getInstance().showLabelLanguage(str);
                        CommonFun.getInstance().showMsgBox(newStr, "YES", () => {
                            CommonFun.getInstance().showNewShop();
                        }, false);
        
                    }else {
                        self.showWithDraw();
                    }
                } else {
                    self.showWithDraw();
                }
                self.node.destroy();
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
        // this.node.destroy();
    },

    showWithDraw(){
        CommonFun.getInstance().showProgress();
        let path = 'NewPlan/Pdd/prefab/WithDraw_PreData';
        let data = GlobalCfg.USER_DATAS.transferAddress;
        ResourcesBundle.load(path, (err, prefab) => {
            if(err){
                console.error("预填写WithDraw预制体生成错误！！");
                return
            }else{
                let pab_WithDraw_PreData = cc.instantiate(prefab);
                let ctrl = pab_WithDraw_PreData.getComponent('WithDraw_PreDataCtrl');
                this.node.parent.addChild(pab_WithDraw_PreData);
                ctrl.setData(data);
            }
        });
    },

    showTips: function () {
        ResourcesBundle.load('NewPlan/Pdd/prefab/pddTip', (err, prefab) => {
            if (err) {
                console.error("setBank 预制体生成错误！");
                return
            } else {
                let pddTip = cc.instantiate(prefab);

                this.node.addChild(pddTip);
                setTimeout(() => {
                    pddTip.destroy();
                }, 500);
            }
        })
    },

    showLuckNodeFunc: function (data) {
        if (data && cc.isValid(this) && cc.isValid(this.showLuckNode) && cc.isValid(this.showLuckNode.content)) {
            for (let i = 0; i < this.showLuckNode.content.childrenCount - 1; i++) {
                let item = this.showLuckNode.content.children[i];
                let tx = item.getChildByName("tx_k").getChildByName('tx').getComponent(cc.Sprite);
                let lab_name = item.getChildByName("lab_name").getComponent(cc.Label);
                let lab_count = item.getChildByName("lab_count").getComponent(cc.Label);
                this.loadHeadSp(data[i].icon, 36, tx);
                lab_name.string = CommonFun.getInstance().getStrByLength(data[i].name, 6);
                lab_count.string = data[i].quota / 100;
            }
            this.showDataCount++;
            this.showHaveWithDraw(data[data.length - 1], (this.showDataCount % 2 == 0) ? false : true);
        }
    },

    showHaveWithDraw: function (data, isShowData) {
        let havaWithDraw = this.node.getChildByName('haveWithDraw');
        let bg_tx_01 = this.node.getChildByName('bg_tx_01');
        if (isShowData == true) {
            bg_tx_01.active = false;
            let tx = havaWithDraw.getChildByName('nodeMask').getChildByName('tx_tx').getComponent(cc.Sprite);
            this.loadHeadSp(data.icon, 44, tx);
            let lab_name = havaWithDraw.getChildByName('lab_name').getComponent(cc.Label);
            lab_name.string = CommonFun.getInstance().getStrByLength(data.name, 6);
            let lab_quota = havaWithDraw.getChildByName('lab_quota').getComponent(cc.Label);
            lab_quota.string = (data.quota / 100).toFixed(2);
            havaWithDraw.active = true;
        } else {
            havaWithDraw.active = false;
            bg_tx_01.active = true;
        }
        this.changeBottomLab(isShowData);
    },

    changeBottomLab: function (bool) {
        let lab = cc.find('zhuanpan/bg_zp_up/lab', this.node).getComponent(cc.Label);
        if (bool) {
            lab.string = 'Estimata 1-2 more to withdraw!';
        } else {
            lab.string = "It's about to withdraw!";
        }
    },

    playPddSound: function (soundName, isLoop = false) {
        soundName = "pddSound/" + soundName;
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources(soundName, isLoop);
    },

    showFinger: function () {

    },

    // update (dt) {},
});
