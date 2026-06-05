

cc.Class({
    extends: cc.Component,

    properties: {
        node_jackpot :cc.Node,
        node_myHistory:cc.Node,
        node_bigWinner:cc.Node,
        node_jackpotContent:cc.Node,
        node_myHistoryContent:cc.Node,
        node_bigWinnerContent:cc.Node,
        toggle_jackpot : cc.Toggle,
        toggle_myHistory : cc.Toggle,
        toggle_bigWinner : cc.Toggle,
        pab_jackpot_index : cc.Prefab,
        pab_myhistory_index : cc.Prefab,
        pab_bigWinner_index : cc.Prefab,
        btn_close : cc.Button, 
    },

    ctor: function() {
        this.customMsgEventHandle = null;
    },

    onLoad () {
        this.toggle_jackpot.node.on('click',this.btnClick,this);
        this.toggle_myHistory.node.on('click',this.btnClick,this);
        this.toggle_bigWinner.node.on('click',this.btnClick,this);
        this.btn_close.node.on('click',this.btnClick,this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.refreshToggleLanguage();
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            self.refreshToggleLanguage();
        }
    },

    refreshToggleLanguage: function() {
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage") || I18NLanguagesEnum.Bengali;
        this.setToggleLanguageNodes(this.toggle_jackpot.node, languagesType, "btn_jackpot");
        this.setToggleLanguageNodes(this.toggle_myHistory.node, languagesType, "MyHistory");
        this.setToggleLanguageNodes(this.toggle_bigWinner.node, languagesType, "BigWinner");
    },

    setToggleLanguageNodes: function(toggleNode, languagesType, suffixName) {
        if (!toggleNode) {
            return;
        }

        let languageNames = ["English", "Hindi", "Urdu", "Bengali"];
        let targetLanguageName = this.getLanguageNodePrefix(languagesType);
        let parentNames = ["Background", "checkmark"];
        for (let i = 0; i < parentNames.length; i++) {
            let parentNode = toggleNode.getChildByName(parentNames[i]);
            if (!parentNode) {
                continue;
            }

            for (let j = 0; j < languageNames.length; j++) {
                let childName = `${languageNames[j]}@${suffixName}`;
                let childNode = parentNode.getChildByName(childName);
                if (childNode) {
                    childNode.active = languageNames[j] == targetLanguageName;
                }
            }
        }
    },

    getLanguageNodePrefix: function(languagesType) {
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                return "English";
            case I18NLanguagesEnum.Hindi:
                return "Hindi";
            case I18NLanguagesEnum.Urdu:
                return "Urdu";
            case I18NLanguagesEnum.Bengali:
            default:
                return "Bengali";
        }
    },

    btnClick:function(button){
        let btnName = button.node.name;
        if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if(btnName == "toggle1") {
            this.node_jackpot.active = true;
            this.node_myHistory.active = false;
            this.node_bigWinner.active = false;
            GameServerManager.send("gameservice.queryjackpotrecord","QueryJackpotRecordReq",{});

        } else if (btnName == "toggle2") {
            this.node_jackpot.active = false;
            this.node_myHistory.active = true;
            this.node_bigWinner.active = false;
            GameServerManager.send("gameservice.querymyrecord","QueryMyRecordReq",{});

        } else if ( btnName == "toggle3") {
            this.node_jackpot.active = false;
            this.node_myHistory.active = false;
            this.node_bigWinner.active = true;
            GameServerManager.send("gameservice.querybigwinnerrecord","QueryBigWinnerRecordReq",{});

        }
    },

    // 显示那个历史记录的那个界面
    showUI:function(str) {
        if( str == "jackpot" || str == "btn_jackpot") {
            this.node_jackpot.active = true;
            this.node_myHistory.active = false;
            this.node_bigWinner.active = false;
        } else if ( str == "bigWinner") {
            this.node_jackpot.active = false;
            this.node_myHistory.active = false;
            this.node_bigWinner.active = true;
            this.toggle_bigWinner.isChecked = true;
        }
    },

    showDate:function(str,list){
        if(str == "jackpot"){
            this.node_jackpotContent.destroyAllChildren();
            let newList = list.sort(this.compare("time"))
            let index = 0;
            if( newList.length > 0 ) {
                this.schedule(function() {
                    let date = newList[index];
                    let pab_jackpot_index = cc.instantiate(this.pab_jackpot_index);
                    this.node_jackpotContent.addChild(pab_jackpot_index);
                    let ctrl = pab_jackpot_index.getComponent('pab_jackpot_indexCtrl');
                    ctrl.showDate(date)
                    index++
                }, 0.1, newList.length-1, 0);
            }
            
        } else if (str == "bigWinner") {
            this.node_bigWinnerContent.destroyAllChildren();
            let newList = list.sort(this.compare("time"))
            let index = 0;
            if( newList.length > 0 ) {
                this.schedule(function() {
                    let date = newList[index];
                    let pab_bigWinner_index = cc.instantiate(this.pab_bigWinner_index);
                    this.node_bigWinnerContent.addChild(pab_bigWinner_index);
                    let ctrl = pab_bigWinner_index.getComponent('bigWinner_indexCtrl');
                    ctrl.setwinnerIndex(date)
                    index++
                }, 0.1, newList.length-1, 0);
            }
           
        } else if (str == "myhistory") {
            this.node_myHistoryContent.destroyAllChildren();
            let newList = list.sort(this.compare("time"))
            let index = 0;
            if( newList.length > 0 ) {
                this.schedule(function() {
                    let date = newList[index];
                    let pab_myhistory_index = cc.instantiate(this.pab_myhistory_index);
                    this.node_myHistoryContent.addChild(pab_myhistory_index);
                    let ctrl = pab_myhistory_index.getComponent('pab_myhistory_indexCtrl');
                    ctrl.showDate(date)
                    index++
                }, 0.1, newList.length-1, 0);
            }
        }
    },

    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    },
 
    start () {
    },

    onDestroy: function() {
        if (this.customMsgEventHandle) {
            ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
            this.customMsgEventHandle = null;
        }
    },

    // update (dt) {},
});
