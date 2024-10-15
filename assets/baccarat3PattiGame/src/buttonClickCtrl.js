
cc.Class({
    extends: cc.Component,

    
    /**
     * 监听按钮
     */
    monitorButton:function() {
        let self = GlobalCfg.ACT_SCENE_CTRL;
        self.btnClick = this.btnClick;
        self.btn_shop = self.node.getChildByName("btn_shop");
        self.btn_jiLu = self.node.getChildByName("btn_jiLu");
        self.btn_jiLu_01 = self.node.getChildByName("btn_jiLu_01");
        self.btn_chat = self.node.getChildByName("btn_chat");
        self.btn_playerNum = self.node.getChildByName("btn_playerNum");
        self.node_betCoinBtn = self.node.getChildByName("node_betCoinBtn");
        self.node_playerBet = self.node.getChildByName("node_playerBet");
        self.btn_openMenu = self.node.getChildByName("btn_openMenu");
        self.btn_tableInfo = self.node.getChildByName("btn_tableInfo");

        let btnArr = [self.btn_shop, self.btn_jiLu, self.btn_jiLu_01, self.btn_chat, self.btn_playerNum, self.btn_tableInfo, self.btn_openMenu];
        let betCoinBtns = self.node_betCoinBtn.getComponentsInChildren(cc.Button);
        let node_playerBetChildren = self.node_playerBet.children;
        let btn_VipChildren = self.node_vip.children;

        for (let i = 0; i < btnArr.length; i++) {
            let btn = btnArr[i].getComponent(cc.Button);
            btn.node.on("click", this.btnClick, self);
        }

        for (let i = 0; i < betCoinBtns.length; i++) {
            let btn = betCoinBtns[i];
            btn.node.on("click", this.btnClick, self);
        }

        for (let i = 0; i < node_playerBetChildren.length; i++) {
            let btn = node_playerBetChildren[i].getComponent(cc.Button);
            btn.node.on("click", this.btnClick, self);
        }

        for (let i = 0; i < btn_VipChildren.length; i++) {
            let btn = btn_VipChildren[i].getComponent(cc.Button);
            btn.node.on("click", this.btnClick, self);  
        }

    },

    initBetBtn(self){
        self.betCoinList = [10, 50, 100, 1000, 2000];
        if (GlobalCfg.USER_DATAS.gamePattern == 1) {
            self.betCoinList = [1, 10, 50, 100, 1000];
        }
        self.myBetCoin = self.betCoinList[0];
        let btn_10 = self.node.getChildByName("node_betCoinBtn").getChildByName('btn_10').getComponent(cc.Button);
        self.choiceBetButton(btn_10, self.selectLight);
        self.node_betCoinBtn = self.node.getChildByName("node_betCoinBtn");
        self.node_betCoinBtn.getChildByName('btn_10').getChildByName('lab').getComponent(cc.Label).string = self.betCoinList[0];
        self.node_betCoinBtn.getChildByName('btn_50').getChildByName('lab').getComponent(cc.Label).string = self.betCoinList[1];
        self.node_betCoinBtn.getChildByName('btn_100').getChildByName('lab').getComponent(cc.Label).string = self.betCoinList[2];
        self.node_betCoinBtn.getChildByName('btn_1000').getChildByName('lab').getComponent(cc.Label).string = self.betCoinList[3];
        self.node_betCoinBtn.getChildByName('btn_2000').getChildByName('lab').getComponent(cc.Label).string = self.betCoinList[4];
        
    },

    btnClick:function(button){
        let self = GlobalCfg.ACT_SCENE_CTRL;
        let btnName = button.node.name;
        if(btnName == "btn_10") {
            self.myBetCoin = button.node.getChildByName('lab').getComponent(cc.Label).string;
            self.choiceBetButton(button, self.selectLight);

        } else if (btnName == "btn_50") {
            self.myBetCoin = button.node.getChildByName('lab').getComponent(cc.Label).string;
            self.choiceBetButton(button, self.selectLight);

        } else if (btnName == "btn_100") {
            self.myBetCoin = button.node.getChildByName('lab').getComponent(cc.Label).string;
            self.choiceBetButton(button, self.selectLight);

        } else if (btnName == "btn_1000") {
            self.myBetCoin = button.node.getChildByName('lab').getComponent(cc.Label).string;
            self.choiceBetButton(button, self.selectLight);
            self.cradCtrl.setCradValue();

        } else if (btnName == "btn_2000") {
            self.myBetCoin = button.node.getChildByName('lab').getComponent(cc.Label).string;
            self.choiceBetButton(button, self.selectLight);

        } else if (btnName == "btn_blue") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,6);
            return

        } else if(btnName == "btn_red") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,7);
            return

        } else if(btnName == "btn_set") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,0)
            return

        } else if(btnName == "btn_PureSEQ") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,1)
            return

        } else if(btnName == "btn_SEQ") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,2)
            return

        } else if (btnName == "btn_color") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,3)
            return

        } else if(btnName == "btn_Palr") {
            self.gameServiceSendCtrl.CallReq(self.myBetCoin,4)
            return

        } else if(btnName == "btn_jiLu" || btnName == "btn_jiLu_01") {
            let pab_winningHistory = cc.instantiate(self.pab_winningHistory)
            self.node.addChild(pab_winningHistory);

        } else if(btnName == "btn_shop") {
            CommonFun.getInstance().showSmallAddCash();

        } else if(btnName == "btn_Vip_0") {
            self.gameServiceSendCtrl.JoinVipPosReq(1);
            
        } else if (btnName == "btn_Vip_1") {
            self.gameServiceSendCtrl.JoinVipPosReq(2);

        } else if (btnName == "btn_Vip_2") {
            self.gameServiceSendCtrl.JoinVipPosReq(3);

        } else if (btnName == "btn_Vip_3") {
            self.gameServiceSendCtrl.JoinVipPosReq(4);

        } else if (btnName == "btn_Vip_4") {
            self.gameServiceSendCtrl.JoinVipPosReq(5);

        } else if (btnName == "btn_Vip_5") {
            self.gameServiceSendCtrl.JoinVipPosReq(6);

        } else if (btnName == "btn_Vip_6") {
            self.gameServiceSendCtrl.JoinVipPosReq(7);

        } else if (btnName == "btn_repeat") {
            if(self.stopBetState==0) {
                for (let i = 0; i <  self.myRepeatArr.length; i++) {
                    let betCoin = self.myRepeatArr[i];
                    if(betCoin) {
                        self.gameServiceSendCtrl.CallReq(betCoin,i);
                    }
                }
                self.newMyRepeatArr = [];
            }

        } else if (btnName == "btn_playerNum") {
            self.gameServiceSendCtrl.PlayerListReq(1,12);

        } else if (btnName == "btn_chat") {
            let myVipPos = self.getPlayerInfoByUserId(self.myVipPos);
            if(myVipPos) {
                let pab_chat = cc.instantiate(self.pab_chat);
                self.node.addChild(pab_chat);
            } else {
                CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
            }
        
        } else if (btnName == "btn_tableInfo") {
            let pab_wanFa = cc.instantiate(self.pab_wanFa);
            self.node.addChild(pab_wanFa);
        } else if (btnName == "btn_openMenu") {
            CommonFun.getInstance().showGameMenu(false);
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

});
