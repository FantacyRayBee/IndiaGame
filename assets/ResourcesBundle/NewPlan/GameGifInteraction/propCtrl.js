cc.Class({
    extends: cc.Component,

    properties: {
        node_daoJu: cc.Node,
        node_liWu: cc.Node,
        node_all: cc.Node,
        node_sendAll: cc.Button,
        btn_mask: cc.Button,
        toggs: [cc.Toggle],
        pab_propSke: cc.Prefab,
        sf_jb: cc.SpriteFrame,
    },

    ctor: function () { // 0番茄 12 宝箱
        this.is_can_click = true;
        this.skeName = "hd_jidan01",
        this.propArr = ["番茄", "hd_jidan01", "hd_mtb01", "hd_dapao01", "hd_cangyingpai01", "hd_shuaibiti01",
            "hd_xianbing01", "hd_bingtong01", "hd_huojian01", "hd_woshou01", "hd_ganbei01",
            "hd_meigui01", "宝箱", "hd_daocha01", "puke01_xipai02", "qf_xishou01"
        ];
        this.liWuArr = ["0", "Free", "Free", "1", "Free", "Free", "Free", "Free", "2"]
        this.daoJuArr = ["Free", "Free", "Free", "0", "Free", "Free", "Free"]

    },


    onLoad() {
        for (let i = 0; i < this.toggs.length; i++) {
            let tog = this.toggs[i];
            tog.node.on('click', this.toggleClick, this);
        }

        this.btn_mask.node.on('click', this.btnClick, this);
        this.node_sendAll.node.on('click', this.btnClick, this);
        let node_daoJuArr = this.node_daoJu.children;
        let node_liWuArr = this.node_liWu.children;

        for (let i = 0; i < node_daoJuArr.length; i++) {
            let node = node_daoJuArr[i].children;
            for (let j = 0; j < node.length; j++) {
                let str = node[j].name.split("_");
                if (str && str[0] == "btn") {
                    let btn = node[j].getComponent(cc.Button);
                    btn.node.on('click', this.btnClick, this);
                }
            }
        }

        for (let i = 0; i < node_liWuArr.length; i++) {
            let node = node_liWuArr[i].children;
            for (let j = 0; j < node.length; j++) {
                let str = node[j].name.split("_");
                if (str && str[0] == "btn") {
                    let btn = node[j].getComponent(cc.Button);
                    btn.node.on('click', this.btnClick, this);
                }
            }
        }
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.eventHide()
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.shortmessagenotify") {
            let msgType = notify.msgType; // 消息类型 0短语 1表情 2礼物
            let name = notify.name; // 表情名/短语内容
            let sender = notify.sender; // 发送者seat
            let target = notify.target; // 接收者seat (-1表示群发)
            let price = notify.price; // 价格
            let senderAfter = notify.senderAfter; // 发送者扣价后货币

            if (msgType == 2) {
                var ctrlName = self.getgameName(senderAfter, sender, price);
                if (target == -1) {
                    let players = GlobalCfg.ACT_SCENE_CTRL.userArryNode || GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr;

                    for (let i = 0; i < players.length; i++) {
                        if (players[i]) {
                            let gameCtrl = players[i].getComponent(ctrlName) || players[i].getComponent("rummyOtherUserCtrl");
                            if (gameCtrl.node_wanJia && !gameCtrl.node_wanJia.active) {
                                continue
                            }
                            if (gameCtrl.vipSiteState) {
                                continue
                            }

                            let seatid = (gameCtrl.seatid || gameCtrl.seatid == 0) ? gameCtrl.seatid : gameCtrl.seatId;
                            let pab_propSke = cc.instantiate(self.pab_propSke);
                            self.node.addChild(pab_propSke)
                            let ctrl = pab_propSke.getComponent('propSkeCtrl');
                            ctrl.shortmessagenotify(notify, seatid, self.node)
                        }
                    }

                } else {
                    let pab_propSke = cc.instantiate(self.pab_propSke);
                    self.node.addChild(pab_propSke)
                    let ctrl = pab_propSke.getComponent('propSkeCtrl');
                    ctrl.shortmessagenotify(notify, target, self.node);
                }
            }

        } else if (msgId === "gameservice.changeroom") {
            let children = self.node.children;
            self.unscheduleAllCallbacks()
            for (var i = 0; i < children.length; ++i) {
                if (children[i].name != 'node_all') {
                    children[i].destroy()
                }
            }
        }
    },


    btnClick: function (button) {
        let newCoin = 0;
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_mask") {
            this.node_all.active = false;
        } else {
            this.node_all.active = false;

            if (!this.is_can_click) {
                CommonFun.getInstance().showTips("Skill cooling...");
                return
            }
            this.is_can_click = false;
            this.btnTime = setTimeout(() => {
                this.is_can_click = true;
            }, 4000);

            let str = btnName.split("_");
            let name = Number(str[1])
            this.skeName = this.propArr[name] + ""

            let coin = button.node.parent.getChildByName("lab_jb").getComponent(cc.Label).string;
            let LanguageStr = otherLanguage.prop[language];
            if (coin != LanguageStr) {
                // 获取玩家发送表情的钱
                newCoin = this.isAllSend == "YES" ? Number(coin) * 200 : Number(coin) * 100
            }

            // 玩家发送的钱不足时 提示玩家
            if (coin == LanguageStr || (GlobalCfg.USER_DATAS.userDiamond >= newCoin)) {
                GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
                    msgType: 2,
                    name: this.propArr[name] + "",
                    target: this.isAllSend == "YES" ? -1 : this.targetID,
                });
            } else {
                CommonFun.getInstance().showTips("Insufficient cash to send");
            }
        }
    },

    toggleClick: function (toggle) {
        let togName = toggle.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (togName == "toggle_daoJu") {
            this.node_daoJu.active = false;
            this.node_liWu.active = true;
        } else if (togName == "toggle_liWu") {
            this.node_daoJu.active = true;
            this.node_liWu.active = false;
        } else if (togName == "Toggle_all") {
            this.isAllSend = toggle.isChecked ? "NO" : "YES"
        }
    },

    /**
     * 
     * @param {*} targetID 目标
     * @param {*} launchID 使用者
     * @param {*} curSeat 
     * @param {String} gameName 游戏名称
     * @param {Boolean} isPractice 是否收费
     */
    setPlayData: function (targetID, launchID, curSeat, gameName, isPractice) {
        this.gameName = gameName;
        this.launchID = launchID;
        this.targetID = targetID;
        this.curSeat = curSeat;
        this.isAllSend = "NO"
        this.toggs[2].isChecked = false
        this.node_sendAll.node.active = true;
        if (!isPractice) { // 是否是体验场  false是体验场
            let liWu = this.node_liWu.children;
            let daoJu = this.node_daoJu.children;
            this.liWuArr[1] = otherLanguage.prop[language];
            this.daoJuArr[0] = otherLanguage.prop[language];

            for (let i = 1; i < liWu.length; i++) {
                liWu[i].getChildByName("lab_jb").getComponent(cc.Label).string = this.liWuArr[i];
                let node = liWu[i].getChildByName("img_cm");
                node.getComponent(cc.Sprite).spriteFrame = this.sf_jb;

            }
            for (let i = 0; i < daoJu.length; i++) {
                daoJu[i].getChildByName("lab_jb").getComponent(cc.Label).string = this.daoJuArr[i];
                let node = daoJu[i].getChildByName("img_cm");
                node.getComponent(cc.Sprite).spriteFrame = this.sf_jb;
            }
        }
    },

    /**
     * 更新发送者金币
     * @param {玩家发送表情后的金币} senderAfter 
     * @param {表情发送者} sender 
     * @returns {String}
     */
    getgameName: function (senderAfter, sender) {
        let sceneName = cc.director.getScene().name;

        if (sceneName == "rummy") {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setCoin && ctrl.setCoin(senderAfter);
            };
            return "rummyUserInfoCtrl"
        }
        else if (sceneName == "tpGame") {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setTeenPattiPlayerCoin && ctrl.setTeenPattiPlayerCoin(senderAfter);
            };
            return "teenPattiPlayerCtrl"
        }
        else if (sceneName == "Andeer") {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setCoin && ctrl.setCoin(senderAfter);
            };
            return "andeerPalyerCtrl"
        }
        else if (sceneName == "7up7down") {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
            if (GlobalCfg.ACT_SCENE_CTRL && GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl && GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.setCoin) {
                GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl.setCoin(senderAfter);
            };
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setCoin && ctrl.setCoin(senderAfter);
            };
            return "7upVIPUserCtrl"
        }
        else if (sceneName == "LHD") {
            return "lhdPlayerCtrl"
        }
        else if (sceneName == "horseRace") {
            return "horseRacePlayerCtrl"
        }
        else if (sceneName == "mundaLobby") {
            return "playerCtrl"
        }
        else if (sceneName == "baccarat3Patti") {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setVipCion && ctrl.setVipCion(senderAfter);
                GlobalCfg.ACT_SCENE_CTRL.noVIPPlayerCtrl.setMyCoin(senderAfter);
            };
            return "VIPCtrl"
        }
        else if (sceneName == 'zoo') {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.zooSeatManager.getPlayerCtrlBySeatId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setUserCoinLabel && ctrl.setUserCoinLabel(senderAfter);
            }
            return 'zooPlayerCtrl'
        }
        else if (sceneName == 'cricket') {
            let ctrl = GlobalCfg.ACT_SCENE_CTRL.seatManager.getPlayerCtrlBySeatId(sender);
            if (CommonFun.getInstance().isValidForScr(ctrl)) {
                ctrl.setUserCoinLabel && ctrl.setUserCoinLabel(senderAfter);
            }
            return 'cricketPlayerCtrl'
        }
    },


    eventHide: function () {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            var children = this.node.children;
            for (var i = 0; i < children.length; ++i) {
                let name = children[i].name
                if (name == "propSke") {
                    children[i].destroy();
                }
            }
        }, this);
    },

    start() {

    },

    // update (dt) {},
});