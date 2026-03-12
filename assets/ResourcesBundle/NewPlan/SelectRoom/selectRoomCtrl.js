export const btnState = cc.Enum({
    Grey : 1,
    AddCash: 2,
    EnterGame: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_cash: cc.Toggle,
        toggle_practice: cc.Toggle,
        toggle_teenpatti: cc.Toggle,
        toggle_rummy: cc.Toggle,
        toggle_andar: cc.Toggle,
        toggle_patti3: cc.Toggle,
        toggle_potBlind: cc.Toggle,
        toggle_low: cc.Toggle,
        toggle_mid: cc.Toggle,
        toggle_high: cc.Toggle,
        toggle_player2: cc.Toggle,
        toggle_player6: cc.Toggle,

        node_containerCash: cc.Node,
        node_containerBlind: cc.Node,
        node_containerPlayer: cc.Node,
        node_containerLevel: cc.Node,
        node_containerGame: cc.Node,

        btn_setting: cc.Button,
        btn_add: cc.Button,
        btn_close: cc.Button,

        lab_userDiamond: cc.Label,

        node_gameRoomContent: cc.Node,

        node_titleTeenpatti: cc.Node,
        node_titleRummy: cc.Node,
        node_titleAndar: cc.Node,

        node_headerTeenpatti: cc.Node,
        node_headerRummy: cc.Node,
        node_headerAndar: cc.Node,

        prefab_RoomItem: cc.Prefab,
    },

    ctor: function () {
        this.gameRoomInfo = {
            teenpatti: {
                cash: {
                    patti3: {
                        mid: [],
                        low: [],
                        high: []
                    },
                    potBlind: {
                        mid: [],
                        low: [],
                        high: []
                    }
                },
                practice: [],
            },

            andar: {
                cash: [],
                practice: [],
            },

            rummy: {
                cash: {
                    player2: [],
                    player6: []
                },
                practice: [],
            }
        };

        this.updateInterval = 0;
    },


  
    onLoad: function() {
        this.initGameRoomInfo();
        this.setBtnToggleClick();
        this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        this.clientMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg,this);

    },


    onEnable: function() {
        this.setOpenModules();
        this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    },

    update: function(dt) {
        this.updateInterval += dt;
        if (this.updateInterval >= 1) {
            this.updateInterval = 0;
            this.lab_userDiamond.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        };
    },


    initGameRoomInfo: function() {
        let teenPattiRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.teenpatti;
        teenPattiRoomInfo = teenPattiRoomInfo.sort((a, b) => {
            return a.entrycondition - b.entrycondition;
        });
        for (let i = 0, len = teenPattiRoomInfo.length; i < len; i++) {
            let roomItem = teenPattiRoomInfo[i];
            let isBlind = roomItem.isblind;
            let isTrial = roomItem.trial;
            let level = roomItem.level;
            if (isTrial) {
                this.gameRoomInfo.teenpatti.practice.push(roomItem);
            }
            else {
                if (isBlind)  {
                    if (level == 1) {
                        this.gameRoomInfo.teenpatti.cash.potBlind.low.push(roomItem);
                    }
                    else if (level == 2) {
                        this.gameRoomInfo.teenpatti.cash.potBlind.mid.push(roomItem);
                    }
                    else if (level == 3) {
                        this.gameRoomInfo.teenpatti.cash.potBlind.high.push(roomItem);
                    };
                }
                else {
                    if (level == 1) {
                        this.gameRoomInfo.teenpatti.cash.patti3.low.push(roomItem);
                    }
                    else if (level == 2) {
                        this.gameRoomInfo.teenpatti.cash.patti3.mid.push(roomItem);
                    }
                    else if (level == 3) {
                        this.gameRoomInfo.teenpatti.cash.patti3.high.push(roomItem);
                    };
                };
            };
        };

        let rummyRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.rummy;
        let rummy2Count = 0, rummy6Count = 0;
        rummyRoomInfo = rummyRoomInfo.sort((a, b) => {
            return a.entrycondition - b.entrycondition;
        });
        for (let i = 0, len = rummyRoomInfo.length; i < len; i++) {
            let roomItem = rummyRoomInfo[i];
            let isTrial = roomItem.trial;
            let playerNum = roomItem.num;
            if (isTrial) {
                this.gameRoomInfo.rummy.practice.push(roomItem);
            }
            else {
                if (playerNum == 2) {
                    rummy2Count++;
                    this.gameRoomInfo.rummy.cash.player2.push(roomItem);
                }
                else if (playerNum == 6) {
                    rummy6Count++;
                    this.gameRoomInfo.rummy.cash.player6.push(roomItem);
                };
            };
        };
        if(rummy2Count == 0 || rummy6Count == 0){
            this.toggle_player2.node.active = false;
            this.toggle_player6.node.active = false;
        }

        let andarRoomInfo = GlobalCfg.USER_DATAS.gameRoomList.andarbahar;
        andarRoomInfo = andarRoomInfo.sort((a, b) => {
            return a.entrycondition - b.entrycondition;
        });
        for (let i = 0, len = andarRoomInfo.length; i < len; i++) {
            let roomItem = andarRoomInfo[i];
            let isTrial = roomItem.trial;
            if (isTrial) {
                this.gameRoomInfo.andar.practice.push(roomItem);
            }
            else {
                this.gameRoomInfo.andar.cash.push(roomItem);
            };
        };
    },

    setOpenModules: function() {
        this.btn_setting.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.btn_add.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);

        if (CommonFun.getInstance().isNeedUpdata("Rummy") == false && (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103))) {
            this.toggle_rummy.node.active = true;
        }
        else {
            this.toggle_rummy.node.active = false; 
        };

        if (CommonFun.getInstance().isNeedUpdata("tpGame") == false && GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
            this.toggle_teenpatti.node.active = true;
        }
        else {
            this.toggle_teenpatti.node.active = false; 
        };

        if (CommonFun.getInstance().isNeedUpdata("andaerGame") == false && (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105))) {
            this.toggle_andar.node.active = true;
        }
        else {
            this.toggle_andar.node.active = false; 
        };
    },

    setBtnToggleClick: function() {
        this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_setting.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.toggle_cash.node.on("toggle", this.toggleClick, this);
        this.toggle_practice.node.on("toggle", this.toggleClick, this);
        this.toggle_teenpatti.node.on("toggle", this.toggleClick, this);
        this.toggle_rummy.node.on("toggle", this.toggleClick, this);
        this.toggle_andar.node.on("toggle", this.toggleClick, this);
        this.toggle_patti3.node.on("toggle", this.toggleClick, this);
        this.toggle_potBlind.node.on("toggle", this.toggleClick, this);
        this.toggle_low.node.on("toggle", this.toggleClick, this);
        this.toggle_mid.node.on("toggle", this.toggleClick, this);
        this.toggle_high.node.on("toggle", this.toggleClick, this);
        this.toggle_player2.node.on("toggle", this.toggleClick, this);
        this.toggle_player6.node.on("toggle", this.toggleClick, this);
    },


    showPointGameRoom: function() {
        LoggerUtil.getInstance().log("isNeedShowRoomList : " , window.isNeedShowRoomList);
        if (window.isNeedShowRoomList == "andar") {
            this.toggle_andar.isChecked = true;
        }
        else if (window.isNeedShowRoomList == "tpGame") {
            this.toggle_teenpatti.isChecked = true;
        }
        else if (window.isNeedShowRoomList == "rummy") {
            this.toggle_rummy.isChecked = true;
        };

        this.freshGameRoom();
    },


    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.clientMsgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg,this.msgHandle);
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.ENTER_GAME_FROM_SELECT_ROOM) {
            self.dealSelectRoomItemEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.EXIT_GAME) {
            window.isNeedShowRoomList = null;
            if (CommonFun.getInstance().isValidForScr(self)) {
                self.node.destroy();
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO || msgId == GlobalCfg.CLIENT_MSG_ID.GET_RELIEF_REWARD){
            self.freshGameRoom();
        }
    },

    dealSelectRoomItemEvent: function(notify) {
        let itemType = notify.itemType;
        let itemData = notify.itemData;
        if (itemType == "rummy") {
            this.dealRummyRoomItemEvent(itemData);
        }
        else if (itemType == "andar") {
            this.dealAndarRoomItemEvent(itemData);
        }
        else if (itemType == "teenpatti") {
            this.dealTeenpattiRoomItemEvent(itemData);
        }
    },

    dealRummyRoomItemEvent: function(itemData) {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_RUMMY_PLAYNOW_BUTTON);
        this.checkUpdate("rummy", ()=>{
            GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID = itemData.id;
            GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum = itemData.num;
            cc.sys.localStorage.setItem("rummyRoomData", JSON.stringify(itemData));
            CommonFun.getInstance().showProgress();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.RUMMY);
            CommonFun.getInstance().hideSelectRoom();
        });
    },

    dealAndarRoomItemEvent: function(itemData) {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_ANDAR_PLAYNOW_BUTTON);
        this.checkUpdate("andaerGame", ()=>{
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.ANDAER);
            GlobalCfg.SMALL_GAME_DATAS.andeerData.roomID = itemData.id;
            cc.sys.localStorage.setItem("AndeerData", JSON.stringify(itemData));
            CommonFun.getInstance().showProgress();
            CommonFun.getInstance().hideSelectRoom();
        });
    },

    dealTeenpattiRoomItemEvent: function(itemData) {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.CLICK_TP_PLAYNOW_BUTTON);
        this.checkUpdate("tpGame", ()=>{
            GlobalCfg.SMALL_GAME_DATAS.teenPattiData.roomId = itemData.id;
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.TEENPATTI);
            CommonFun.getInstance().showProgress();
            CommonFun.getInstance().hideSelectRoom();
        });
    },

    checkUpdate: function (subpackgeName, callFun) {
        // ✅ 在编辑器点 Play 的预览环境（浏览器/模拟器）直接走回调，跳过下载
        const isEditorPreview =
            (typeof CC_PREVIEW !== 'undefined' && CC_PREVIEW) ||
            (typeof Editor !== 'undefined'); // 少数内嵌预览场景的兜底

        if (isEditorPreview) {
            callFun && callFun();
            return;
        }
        if (CommonFun.getInstance().isNeedUpdata(subpackgeName)) {
            if (!GlobalCfg.isH5) {
                CommonFun.getInstance().showTips("Download the game now!");
                GameDownloader.getInstance().priorLoadGame(subpackgeName);
            } else {
                CommonFun.getInstance().gameLoadBundleByH5(subpackgeName);
                CommonFun.getInstance().showGameLoading(false, callFun);
            }
        } else {
            callFun && callFun();
        }
    },

    isAvailableToUpRoom: function(gameType) {
        let todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();  
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${gameType}_UpRoom_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (showTag != `${todayZeroTimeStamp}`) {
                    return true;
                }
                else {
                    return false;
                };
            } 
            catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
                return false;
            };
        }
        else {
            return true;
        };
    },

    updateToUpRoomLocalStorage: function(gameType) {
        let todayZeroTimeStamp = new Date(new Date().toLocaleDateString()).getTime();  
        let toastLocalStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_${gameType}_UpRoom_LocalStorage`);
        if (toastLocalStorage) {
            try {
                let toastLocalData = JSON.parse(toastLocalStorage);
                let showTag = toastLocalData.showTag;
                if (showTag != `${todayZeroTimeStamp}`) {
                    toastLocalData.showTag = `${todayZeroTimeStamp}`;
                    cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${gameType}_UpRoom_LocalStorage`, JSON.stringify(toastLocalData));
                };
            } 
            catch (error) {
                LoggerUtil.getInstance().error(`${toastType}本地缓存的数据异常：`, cc.sys.isNative ? JSON.stringify(error) : error);
            };
        }
        else {
            let toastLocalData = {
                showTag: `${todayZeroTimeStamp}`
            };
            cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_${gameType}_UpRoom_LocalStorage`, JSON.stringify(toastLocalData));
        };
    },

    btnClick: function(btn) { 
        let btnName = btn.node.name;
        if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            window.isNeedShowRoomList = null;
            CommonFun.getInstance().hideSelectRoom();
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_add") {
            CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.SelectRoom); 
        } 
        else if (btnName == "btn_setting") {
            CommonFun.getInstance().showSetting();
        }; 
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.freshGameRoom();
    },

    getSmallGameType: function() {
        if (this.toggle_teenpatti.isChecked) {
            return "teenpatti";
        }
        else if (this.toggle_rummy.isChecked) {
            return "rummy";
        }
        else if (this.toggle_andar.isChecked) {
            return "andar";
        }
        else {
            return "none"
        };
    },

    getCurrencyType: function() {
        if (this.toggle_cash.isChecked) {
            return "cash";
        }
        else if (this.toggle_practice.isChecked) {
            return "practice";
        }
        else {
            return "none";
        };
    },

    getBlindType: function() {
        if (this.toggle_patti3.isChecked) {
            return "patti3";
        }
        else if (this.toggle_potBlind.isChecked) {
            return "potBlind";
        }
        else {
            return "none";
        };
    },


    freshGameRoom: function() {
        this.roomItemBtnState = [];
        let smallGameType = this.getSmallGameType();
        if (smallGameType == "none") {
            CommonFun.getInstance().showTips("There is currently no game room list data available!");
            return;
        };

        let currencyType = this.getCurrencyType();  
        if (currencyType == "none") {
            CommonFun.getInstance().showTips("There is currently no game room list data available!");
            return;
        };

        this.node_titleTeenpatti.active = false;
        this.node_titleRummy.active = false;
        this.node_titleAndar.active = false;
        this.node_headerTeenpatti.active = false;
        this.node_headerRummy.active = false;
        this.node_headerAndar.active = false;

        this.node_containerBlind.active = false;
        this.node_containerLevel.active = false;
        this.node_containerPlayer.active = false;

        let smallGameRoomInfo = [];
        let checkToggleCashAndChips = ()=>{
            if(this.toggle_cash.node.active == true && this.toggle_practice.node.active == false){
                this.toggle_cash.isChecked = true;
                this.toggle_practice.isChecked = false;
                currencyType = "cash";
            }
            if(this.toggle_cash.node.active == false && this.toggle_practice.node.active == true){
                this.toggle_cash.isChecked = false;
                this.toggle_practice.isChecked = true;
                currencyType = "practice";
            }
        }
        if (smallGameType == "teenpatti") {
            this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(100);
            this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(101);
            this.node_titleTeenpatti.active = true;
            this.node_headerTeenpatti.active = true;
            checkToggleCashAndChips();
            smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
            if (currencyType == "cash") {
                this.node_containerBlind.active = true;
                this.node_containerLevel.active = true;

                let blindType = this.getBlindType();
                if (blindType == "none") {
                    CommonFun.getInstance().showTips("There is currently no game room list data available!");
                    return;
                };
    
                let gameRoomInfo = smallGameRoomInfo[blindType];
                let lowArr = gameRoomInfo["low"];
                let midArr = gameRoomInfo["mid"];
                let highArr = gameRoomInfo["high"];
    
                let curRoomInfo = [];
                if (this.toggle_low.isChecked) {
                    curRoomInfo = curRoomInfo.concat(lowArr);
                };
                if (this.toggle_mid.isChecked) {
                    curRoomInfo = curRoomInfo.concat(midArr);
                };
                if (this.toggle_high.isChecked) {
                    curRoomInfo = curRoomInfo.concat(highArr);
                };
    
                if (this.toggle_low.isChecked == false && this.toggle_mid.isChecked == false && this.toggle_high.isChecked == false) {
                    curRoomInfo = [].concat(lowArr).concat(midArr).concat(highArr);
                };
                
                this.addGameRoomItem(curRoomInfo, smallGameType);
            }
            else if (currencyType == "practice") {
                let curRoomInfo = [].concat(smallGameRoomInfo);
                this.addGameRoomItem(curRoomInfo, smallGameType);
            };
        }
        else if (smallGameType == "rummy") {
            this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(102);
            this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(103);
            this.node_titleRummy.active = true;
            this.node_headerRummy.active = true;
            checkToggleCashAndChips();
            smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
            if (currencyType == "cash") {
                this.node_containerPlayer.active = true;

                let player2Arr = smallGameRoomInfo["player2"];
                let player6Arr = smallGameRoomInfo["player6"];

                let curRoomInfo = [];
                if (this.toggle_player2.isChecked) {
                    curRoomInfo = curRoomInfo.concat(player2Arr);
                };
                if (this.toggle_player6.isChecked) {
                    curRoomInfo = curRoomInfo.concat(player6Arr);
                };

                if (this.toggle_player2.isChecked == false && this.toggle_player6.isChecked == false) {
                    curRoomInfo = [].concat(player2Arr).concat(player6Arr);
                };

                this.addGameRoomItem(curRoomInfo, smallGameType);
            }
            else if (currencyType == "practice") {   
                let curRoomInfo = [].concat(smallGameRoomInfo);
                this.addGameRoomItem(curRoomInfo, smallGameType);
            };
        }
        else if (smallGameType == "andar") {
            this.toggle_cash.node.active = GlobalCfg.USER_DATAS.openModules.includes(104);
            this.toggle_practice.node.active = GlobalCfg.USER_DATAS.openModules.includes(105);
            this.node_titleAndar.active = true;
            this.node_headerAndar.active = true;
            checkToggleCashAndChips();
            smallGameRoomInfo = this.gameRoomInfo[smallGameType][currencyType];
            let curRoomInfo = [].concat(smallGameRoomInfo);
            this.addGameRoomItem(curRoomInfo, smallGameType);
        };
    },

    addGameRoomItem: function(roomList, smallGameType) {
        if (!Array.isArray(roomList)) {
            return;
        };

        let children = this.node_gameRoomContent.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            node.destroy();
        };

        if (roomList.length == 0) {
            CommonFun.getInstance().showTips("There is currently no game room list data available!");
            return;
        };

        this.unscheduleAllCallbacks();

        let index = 0;
        let len = roomList.length;
        let addItemFun = () => {
            if (index >= len) {
                this.unschedule(addItemFun);
                this.scrollToHideGrey([...this.roomItemBtnState]);
                return; 
            };
            let roomItemData = roomList[index];
            let roomItemNode = cc.instantiate(this.prefab_RoomItem);
            let roomItemCtrl = roomItemNode.getComponent("selectRoomItemCtrl");
            roomItemCtrl.setGameData(roomItemData, smallGameType, (btnState)=>{
                let len = this.roomItemBtnState.length;
                this.roomItemBtnState[len] = btnState;
            });
            this.node_gameRoomContent.addChild(roomItemNode);
            index += 1;
        }; 
        this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
    },

    /**
     * 
     * @param {Array<btnState>} arr 
     */
    scrollToHideGrey(arr){
        let greyCount = 0;
        let roomItemHeight = this.node_gameRoomContent.children[0].height;
        let layout = this.node_gameRoomContent.getComponent(cc.Layout);
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element == btnState.Grey) {
                greyCount += 1;
            }
        }
        if(greyCount == 0){
            return;
        }
        let offset = greyCount * roomItemHeight + layout.spacingY * (greyCount - 1);
        let scrollNode = this.node_gameRoomContent.parent.parent;
        let scrollView = scrollNode.getComponent(cc.ScrollView);
        let max = scrollView.getMaxScrollOffset();
        if(offset > max.y){
            scrollView.scrollToBottom(0.1);
        }else{
            scrollView.scrollToOffset(cc.v2(0, offset), 0.1);
        }
    },
});
