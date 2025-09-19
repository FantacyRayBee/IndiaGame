let EnumGiftType = cc.Enum({
    Gift1: "Gift1",
    Gift2: "Gift2",
});

cc.Class({
    extends: cc.Component,

    properties: {
        node_content: cc.Node,
        toggle_all: cc.Toggle,
        toggle_gift1: cc.Toggle,
        toggle_gift2: cc.Toggle,
    },


    ctor: function() {
        this.gift1DataArr = [
            {
                price: 0,
                name: "hd_jidan01"
            },
            {
                price: 0,
                name: "hd_mtb01"
            },
            {
                price: 1,
                name: "hd_dapao01"
            },
            {
                price: 0,
                name: "hd_cangyingpai01"
            },
            {
                price: 0,
                name: "hd_shuaibiti01"
            },
            {
                price: 0,
                name: "hd_xianbing01"
            },
            {
                price: 0,
                name: "hd_bingtong01"
            },
            {
                price: 2,
                name: "hd_huojian01"
            }
        ];
        this.gift2DataArr = [
            {
                price: 0,
                name: "hd_woshou01"
            },
            {
                price: 0,
                name: "hd_ganbei01"
            },
            {
                price: 1,
                name: "hd_meigui01"
            },
            {
                price: 0,
                name: "hd_daocha01"
            },
            {
                price: 0,
                name: "puke01_xipai02"
            },
            {
                price: 0,
                name: "qf_xishou01"
            }
        ];
        this.targetSeat = -1;
    },


    onLoad: function() {
        this.node.on("click", CommonFun.getInstance().debounce(() => {
            this.node.destroy();
        }, 1), this);
        this.toggle_gift1.node.on('toggle', this.toggleCallBack, this);
        this.toggle_gift2.node.on('toggle', this.toggleCallBack, this);
 
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },


    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_GIF_CLICK_ITEM) {
            this.dealGameGifClickItemEvent(notify);
        } 
    },


    start: function() {
        this.addGifItemsByToggleType();
    },


    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONITEM)
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTION);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },


    toggleCallBack: function(toggle) {
        let toggleName = toggle.node.name;
        this.addGifItemsByToggleType();
    },


    addGifItemsByToggleType: function() {
        CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.GAMEGIFINTERACTIONITEM)
        .then((itemPrefab) => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                let giftDataArr = this.toggle_gift1.isChecked ? this.gift1DataArr : this.gift2DataArr;
                this.addGiftItems(giftDataArr, itemPrefab);        
            }
            else {
                itemPrefab.addRef();
                itemPrefab.decRef();
                itemPrefab = null;
            };   
        })
        .catch((err) => {});
    },


    addGiftItems: function(giftDataArr, itemPrefab) {
        this.unscheduleAllCallbacks();
        for (let i = 0, len = this.node_content.children.length; i < len; i++) {
            let node = this.node_content.children[i];
            node.destroy();
        };
        if (Array.isArray(giftDataArr) == false || giftDataArr.length == 0) {
            return;
        };

        let len = giftDataArr.length;
        let index = 0;
        let addItem = () => {
            let itemData = giftDataArr[index];
            let itemNode = cc.instantiate(itemPrefab);
            itemNode.active = false;
            let itemCtrl = itemNode.getComponent('GameGifInteractionItemCtrl');
            itemCtrl.setGameGiftItemData(itemData);
            this.node_content.addChild(itemNode);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 1/cc.game.getFrameRate(), len - 1, 0);
    },


    dealGameGifClickItemEvent: function(notify) {
        if (!notify) {
            return;
        };
        
        let itemData = notify.itemData;
        let name = itemData.name;
        let price = itemData.price;

        this.targetSeat = this.toggle_all.isChecked ? -1 : this.targetSeat;
        price = this.targetSeat == -1 ? price * 200 : price * 100

        if (GlobalCfg.USER_DATAS.userDiamond >= price) {
            GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
                msgType: 2,
                name: name,
                target: this.targetSeat,
            });
        }
        else {
            CommonFun.getInstance().showTips("Insufficient cash to send");
        };
        
        this.node.destroy();
    },

    setTargetSeat: function(seat) {
        this.targetSeat = seat;
    },
});
