cc.Class({
    extends: cc.Component,

    properties: {
        toggle_word: cc.Toggle,
        toggle_face: cc.Toggle,
        scrollView_word: cc.ScrollView,
        scrollView_face: cc.ScrollView,
    },

    ctor: function() {
        this.isLoadedWord = false;
        this.isLoadedFace = false;

        this.wordArr = [
            "Blind khelo",
            "I won",
            "Hi all",
            "Good luck",
            "It is your day",
            "Thanks",
            "Try next time",
            "Nice game",
            "Well played",
            "Kem cho",
            "Sara",
        ];

        this.faceLimitNum = 24;

        this.targetSeat = -1;
    },

    onLoad: function() {
        this.node.on("click", CommonFun.getInstance().debounce(() => {
            this.node.destroy();
        }, 1), this);
        this.toggle_word.node.on('toggle', this.toggleCallBack, this);
        this.toggle_face.node.on('toggle', this.toggleCallBack, this);
        this.showContentByToggleType(this.toggle_word.node.name);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONWORDITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONFACEITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTION);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },


    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode; 
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_WORD_CLICK_ITEM) {
            this.dealGameWordClickItemEvent(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_FACE_CLICK_ITEM) {
            this.dealGameFaceClickItemEvent(notify);
        }; 
    },

    toggleCallBack(toggle) {
        let toggleName = toggle.node.name;
        this.showContentByToggleType(toggleName);
    },

    showContentByToggleType(toggleName) {
        if (toggleName == this.toggle_word.node.name) {
            this.scrollView_word.node.active = true;
            this.scrollView_face.node.active = false;
            if (this.isLoadedWord == false) {
                this.loadWordItems();
            };
            this.isLoadedWord = true;
        }
        else if (toggleName == this.toggle_face.node.name) {
            this.scrollView_word.node.active = false;
            this.scrollView_face.node.active = true;
            if (this.isLoadedFace == false) {
                this.loadFaceItems();
            };
            this.isLoadedFace = true;
        };
    },

    loadWordItems() {
        CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONWORDITEM)
        .then((itemPrefab) => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.addWordItems(itemPrefab);
            }
            else {
                itemPrefab.addRef();
                itemPrefab.decRef();
                itemPrefab = null;
            };   
        })
        .catch((err) => {});
    },

    addWordItems(itemPrefab) {
        let len = this.wordArr.length;
        let index = 0;
        let addItem = () => {
            let word = this.wordArr[index];
            let itemNode = cc.instantiate(itemPrefab);
            let itemCtrl = itemNode.getComponent('GameWordInteractionWordItemCtrl');
            itemCtrl.setWordItemContent(word);
            this.scrollView_word.content.addChild(itemNode);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 1/cc.game.getFrameRate(), len - 1, 0);
    },

    loadFaceItems() {
        CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEWORDINTERACTIONFACEITEM)
        .then((itemPrefab) => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.addFaceItems(itemPrefab);
            }
            else {
                itemPrefab.addRef();
                itemPrefab.decRef();
                itemPrefab = null;
            };   
        })
        .catch((err) => {});
    },

    addFaceItems(itemPrefab) {
        let len = this.faceLimitNum;
        let index = 0;
        let addItem = () => {
            let faceName = index + 1;
            let itemNode = cc.instantiate(itemPrefab);
            let itemCtrl = itemNode.getComponent('GameWordInteractionFaceItemCtrl');
            itemCtrl.setFaceItemFaceName(faceName);
            this.scrollView_face.content.addChild(itemNode);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 1/cc.game.getFrameRate(), len - 1, 0);
    },

    setTargetSeat(targetSeat) {
        this.targetSeat = targetSeat;
    },

    dealGameWordClickItemEvent(notify) {
        if (!notify) {
            return;
        };
        
        let itemData = notify.itemData;
        let name = itemData.name;

        // 0短语 1表情 2礼物
        GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
            msgType: 0,
            name: `${name}`,
            target: this.targetSeat,
        });
        
        this.node.destroy();
    },

    dealGameFaceClickItemEvent(notify) {
        if (!notify) {
            return;
        };
        
        let itemData = notify.itemData;
        let name = itemData.name;

        // 0短语 1表情 2礼物
        GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
            msgType: 1,
            name: `${name}`,
            target: this.targetSeat,
        });
        
        this.node.destroy();
    },
});
