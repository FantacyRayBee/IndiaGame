export const btnState = cc.Enum({
    Grey : 1,
    AddCash: 2,
    EnterGame: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        labAll: [cc.Label],
        btn_inGame: cc.Button,
        btn_inGameSke: cc.Button,
        node_pot: cc.Node,
        spriteGreen:cc.SpriteFrame,
        spriteYellow:cc.SpriteFrame,
    },

    ctor: function() {
        this.roomItemType = null;
        this.roomItemData = null;
        this.btnEnterGameState = btnState.EnterGame;
        this.teenPattiLabelPos = [cc.v2(-425, 0), cc.v2(-255, 0), cc.v2(-60, 0), cc.v2(170, 0)];
        this.rummyLabelPos = [cc.v2(-395, 0), cc.v2(-204, 0), cc.v2(-14, 0), cc.v2(199, 0)];
        this.andarLabelPos = [cc.v2(-395, 0), cc.v2(-204, 0), cc.v2(-14, 0), cc.v2(199, 0)];
        this.btnEnterState = null;
    },

    onLoad: function() {
        this.btn_inGame.node.on('click', CommonFun.getInstance().debounce(this.inGame, 1), this);
        this.btn_inGameSke.node.on('click', CommonFun.getInstance().debounce(this.inGame, 1), this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            self.dealChangeLanguageEvent(notify);
        } 
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    inGame: function() {
        GlobalCfg.G_COMPONENTS.Audio.playButton();

        if (!this.roomItemType || !this.roomItemData) {
            return;
        };
        let gameName = "miniteenpatti"
        if (this.roomItemType == "rummy") {
            gameName = "minirummy";
        }
        else if (this.roomItemType == "andar") {
            gameName = "miniandar";
        }

        //体验场不添加判断
        if (this.roomToggleType != "practice" && GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred[gameName] == true){   //未曾充值
            CommonFun.getInstance().showMsgBox(commonTipsLanguage.premiumPlayersOnly[language], "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false, null, null, null, null, 0.85);
            return;
        };

        if(this.btnEnterGameState == btnState.AddCash){
            CommonFun.getInstance().showNewShop();
        }else{
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.ENTER_GAME_FROM_SELECT_ROOM, 
                msgData: {
                    itemType: this.roomItemType,
                    itemData: this.roomItemData
                }
            });
        }
    },

    checkGameEnterData(data){
        if(data.trial == true) {
            this.btn_inGame.interactable = true;
            return;
        }
        if (GlobalCfg.USER_DATAS.userDiamond < data.entrycondition) {
            this.btnEnterState = btnState.AddCash;
        }
        else if (GlobalCfg.USER_DATAS.userDiamond >= data.entrycondition && GlobalCfg.USER_DATAS.userDiamond <= data.entryconditionmax) {
            this.btnEnterState = btnState.EnterGame;
        } 
        else {
            this.btnEnterState = btnState.Grey;
        };
        this.setBtnEnterState(this.btnEnterState);
    },

    /**
     * 
     * @param {btnState} state 
     */
    setBtnEnterState(state){
        this.btnEnterGameState = state || btnState.EnterGame;
        this.btn_inGame.target.getComponent(cc.Sprite).spriteFrame = this.spriteGreen;

        let languagesType = I18NUtil.getInstance().getLanguageType();
        this.btn_inGame.target.getChildByName("lab_playNow").getComponent(cc.Label).string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Select_Play Now']);
        this.btn_inGameSke.node.getChildByName("lab_playNow").getComponent(cc.Label).string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Select_Play Now']);
        switch (state) {
            case btnState.Grey:
                this.btn_inGame.interactable = false;
                this.btn_inGameSke.node.active = false;
                break;
            case btnState.AddCash:
                this.btn_inGame.interactable = true;
                this.btn_inGame.node.active = true;
                this.btn_inGameSke.node.active = false;
                this.btn_inGame.target.getChildByName("lab_playNow").getComponent(cc.Label).string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Select_Add Cash']);
                this.btn_inGame.target.getComponent(cc.Sprite).spriteFrame = this.spriteYellow;
                break;
            case btnState.EnterGame:
                this.btn_inGame.interactable = true;
                this.btn_inGame.node.active = false;
                this.btn_inGameSke.node.active = true;
            break;
        
            default:
               break;
        }
    },

    setGameData(data, itemTypeData, cb){
        if (!data) {
            this.node.active = false;
            return;
        };
        this.roomItemType = itemTypeData.gameType;
        this.roomToggleType = itemTypeData.toggle;
        this.roomItemData = data;

        LoggerUtil.getInstance().log("🎯 setGameData data :", data );

        this.labAll[0].string = data.cellscore / 100;          // 底注 
        this.labAll[1].string = data.entrycondition / 100;     // 入场限制
        this.labAll[2].string = data.maxjetton / 100;          // 最大单注
        this.labAll[3].string = data.maxtablescore / 100;      // 桌面最大分数
        this.labAll[4].string = data.onlinenum;

        this.labAll[3].node.active = true;
        let positions = [];
        switch (this.roomItemType) {
            case 'rummy':
                positions = [...this.rummyLabelPos];
                this.labAll[2].string = data.num;                    // 2是2人场  6是6人场
                this.labAll[3].string = data.onlinenum;              // 在线人数
                this.labAll[4].node.active = false;
                break;
            case 'andar':
                positions = [...this.andarLabelPos];
                this.labAll[1].string = data.maxscore / 100;
                this.labAll[2].string = data.entrycondition / 100;
                this.labAll[3].string = data.onlinenum;
                this.labAll[4].node.active = false;
                break;
            case 'teenpatti':
                positions = [...this.teenPattiLabelPos];
                this.labAll[3].node.active = false;
                this.node_pot.active = (data.trial && data.isblind);
                break;
            default:
                break;
        }
        for (let i = 0, len = positions.length; i < len; i++) {
            this.labAll[i].node.setPosition(positions[i]);
        };
        
        this.checkGameEnterData(data);
        cb && cb(this.btnEnterGameState);
    },


    dealChangeLanguageEvent: function(notify) {
        let languagesType = notify.languagesType;
        this.setBtnEnterState(this.btnEnterState);
    },
});
