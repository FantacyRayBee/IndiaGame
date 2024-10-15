/*
 * @Author: 李康
 * @Date: 2021-12-03 17:01:29
 * @LastEditTime: 2021-12-27 11:43:16
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiBattleCardCtrl.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        lab_batteleName: cc.Label,
        lab_refuseTime: cc.Label,
        lab_user1Name: cc.Label,
        lab_user2Name: cc.Label,
        sprite_user1TX: cc.Sprite,
        sprite_user2TX: cc.Sprite,
        btn_refuse: cc.Button,
        btn_agree: cc.Button,
        nodes: [cc.Node]
    },

    onLoad: function() {
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.btn_refuse.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.btn_agree.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.setTitleBG();
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "gameservice.answercompare") {
            self.node.destroy();
        };
    },

    onDestroy: function() {
        this.clearTeenPatiiBattleCardActTimer();
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },

    btnClickCall: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        if (btnName == "btn_refuse") {
            this.sendBattleCardAnswer(false);
        }
        else if (btnName == "btn_agree") {
            this.sendBattleCardAnswer(true);
        };
    },

    sendBattleCardAnswer: function(agree) {
        let proroID = "gameservice.answercompare";
        let message = "AnswerCompareReq";
        GameServerManager.send(proroID, message, {agree: agree});
    },

    setTeenPattiBattleCardRefuseTime: function(time) {
        if (time > 0) {  
            this.clearTeenPatiiBattleCardActTimer();  
            time --;
            this.lab_refuseTime.string = time;
            let self = this;
            let actTimerCall = function() {
                if (self && self.lab_refuseTime) {
                    if (time < 0 && self) {
                        self.sendBattleCardAnswer(false);
                        self.clearTeenPatiiBattleCardActTimer();
                        return;
                    };
                    self.lab_refuseTime.string = time;
                    time --;
                };
            };
            this.actTimer = setInterval(actTimerCall, 1000);
        };
    },

    clearTeenPatiiBattleCardActTimer: function() {
        if (this.actTimer) {
            clearInterval(this.actTimer);
            this.actTimer = null;
        };
    },

    setTeenPattiBattleCardLaunchPlayerName: function(name) {
        this.lab_user1Name.string = name;
    },

    setTeenPattiBattleCardTargetPlayerName: function(name) {
        this.lab_user2Name.string = name;
    },

    setTeenPattiBattleCardLaunchPlayerTX: function(imgUrl) {
        let self = this;
        cc.assetManager.loadRemote(imgUrl, {ext: '.png'}, function (err, texture) {
            if (!err && cc.isValid(self) && cc.isValid(self.sprite_user1TX)) {
                let spriteFrame = new cc.SpriteFrame(texture);
                self.sprite_user1TX.spriteFrame = spriteFrame;
                self.sprite_user1TX.node.setScale(120 / self.sprite_user1TX.node.width);
            };
        });
    },

    setTeenPattiBattleCardTargetPlayerTX: function(imgUrl) {
        let self = this;
        cc.assetManager.loadRemote(imgUrl, {ext: '.png'}, function (err, texture) {
            if (!err && cc.isValid(self) && cc.isValid(self.sprite_user2TX)) {
                let spriteFrame = new cc.SpriteFrame(texture);
                self.sprite_user2TX.spriteFrame = spriteFrame;
                self.sprite_user2TX.node.setScale(120 / self.sprite_user2TX.node.width);
            };
        });
    },

    setTeenPattiBattleCardPKName: function(name) {
        this.lab_batteleName.string = name;
    },

    setTitleBG () {
        if(this.nodes) {
            for (let i = 0; i < 4; i++) {
                this.nodes[i].active = language==i+1; 
            }
            this.nodes[4].getComponent(cc.Label).string = language == 2 ? "अस्वीकार" : "Refuse";
            this.nodes[5].getComponent(cc.Label).string = playerCenterLanguage.lab_ok[language];
        }
    },
});
