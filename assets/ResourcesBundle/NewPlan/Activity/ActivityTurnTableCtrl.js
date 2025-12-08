cc.Class({
    extends: cc.Component,

    properties: {
        lab_remainingTimes: cc.Label,
        btn_go: cc.Button,
        node_wheel: cc.Node,
    },

    ctor: function() {
        // 各个奖励角度
        this.awardAngle = [
            338.5, 293.5, 249.5, 204.5, 
            156.5, 112.5, 69.5, 22.5
        ];
    },

    onLoad: function() {
        this.btn_go.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_go.interactable = false;
        this.lab_remainingTimes.string = `0`;
    },

    start: function() {
        let remainCountPromise = this.getTurnTableRemainCount();
        remainCountPromise.then((remainCount) => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.lab_remainingTimes.string = remainCount;
                if (remainCount > 0) {
                    this.btn_go.interactable = true;
                    this.btn_go.enableAutoGrayEffect = false;
                } 
                else {
                    this.btn_go.interactable = false;
                    this.btn_go.enableAutoGrayEffect = true;
                };
            };
        })
        .catch((error) => {
            LoggerUtil.getInstance().log(error);
        })
    },

    btnClick: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (GlobalCfg.USER_DATAS.isNotCharge == true) {
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return
        }
        let timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
        if (GlobalCfg.USER_DATAS.userVip.level == false || GlobalCfg.USER_DATAS.userVip.level == 0 || (GlobalCfg.USER_DATAS.userVip.level > 0 && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time))
        {
            this.btn_go.interactable = false;
            let url =  GlobalCfg.HTTP_SERVER + "/v1/turntabledraw";
            CommonFun.getInstance().httpGet(url, (jsonObj) => {  
                if (jsonObj.result == 0) { 
                    GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.remaincount;
                    if (CommonFun.getInstance().isValidForScr(this)) {
                        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("turnPlate", false);
                        this.trunPlateRotation(jsonObj.data);
                    };
                }
                else {
                    CommonFun.getInstance().showTips(jsonObj.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        }
        else{
            CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', ()=>{
                CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
            }, false);
        }
    },

    trunPlateRotation: function(data) {
        let awardno = data.awardno;
        let remaincount = data.remaincount;

        this.compensation = this.node_wheel.angle % 360 + 360;
        //旋转时间
        let rotationTime = 3.59;
        //旋转圈数
        let rotationcircle = 2; 
        //奖励圈数
        let RotationAngle = this.node_wheel.angle - rotationcircle * 360 - this.awardAngle[awardno - 1] - this.compensation;
        cc.tween(this.node_wheel)
        .to(rotationTime, {angle: RotationAngle}, { easing: 'sineInOut'})
        .call(() => {
            if (awardno != 2) {
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
                let rewaird = {
                    1: 2,
                    3: 3,
                    4: 20,
                    5: 1,
                    6: 4,
                    7: 5,
                    8: 10
                };
                CommonFun.getInstance().showRewardsTips([{
                    id: 10,
                    amount: rewaird[awardno]
                }]);
            };

            if (remaincount <= 0) {
                this.btn_go.interactable = false;
                this.btn_go.enableAutoGrayEffect = true;
            }
            else {
                this.btn_go.interactable = true;
                this.btn_go.enableAutoGrayEffect = false;
            };

            this.lab_remainingTimes.string = remaincount;
        })
        .start();
    },

    getTurnTableRemainCount: function() {
        return new Promise((resolve, reject) => {
            if (Reflect.has(GlobalCfg.USER_DATAS, 'turntableRemainCount')) {
                resolve(GlobalCfg.USER_DATAS.turntableRemainCount);
                return;
            };

            let url =  GlobalCfg.HTTP_SERVER + "/v1/turntableremaincount";  
            CommonFun.getInstance().httpGet(url, (jsonObj) => {  
                if (jsonObj.result == 0) { 
                    GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.remaincount;
                    resolve(GlobalCfg.USER_DATAS.turntableRemainCount);
                }
                else {
                    CommonFun.getInstance().showTips(jsonObj.msg);
                    reject(jsonObj.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },
});
