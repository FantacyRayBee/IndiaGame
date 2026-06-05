cc.Class({
    extends: cc.Component,

    properties: {
        node_statusNoFree: cc.Node,
        node_statusFree: cc.Node,
        node_records: cc.Node,
    
        btn_buyFree: cc.Button,
        lab_freePrice: cc.Label,
        lab_multiPrice: cc.Label,
        tog_doubleMulti: cc.Toggle,

        node_notPurchased: cc.Node,
        node_purchased: cc.Node,

        lab_freeAllMulti: cc.Label,
        lab_freeAllMultiX: cc.Label,
        lab_freeCount: cc.Label,

        node_itemsParent: cc.Node,
        node_item: cc.Node,
    },

    ctor: function() {
        this.addRecordItemInterval = 0.2;

        this.freeCount = 0;

        this.itemNodeStartPos = cc.v2(0, 105);

        this.itemNodePosArr = [
            cc.v2(0, -70), cc.v2(0, -35), cc.v2(0, 0), cc.v2(0, 35), cc.v2(0, 70)
        ];

        this.recordItemNodesArr = [];
        this.toBeRecordItemDataArr = [];

        this.bet = 0;
    },

    checkShiPei: function() {
        let w = cc.view.getVisibleSize().width;
        let x = -(w/2 - 470)/2 - 470;
        this.node.x = x;
    },

    onLoad: function() {
        this.checkShiPei();
        this.initRecordItemNodePool();
        this.startRecordItemsListen();
        this.tog_doubleMulti.node.on("toggle", () => {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClick125TimesEffect();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_DOUBLE_TOGGLE, 
                msgData: {
                    isDoubleMulti: this.tog_doubleMulti.isChecked,
                },
            });
        }, this);
        this.btn_buyFree.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    initRecordItemNodePool: function() {
        this.recordItemNodePool = new cc.NodePool();
        for (let i = 0; i < 8; i++) {
            let recordItemNode = cc.instantiate(this.node_item);
            this.recordItemNodePool.put(recordItemNode); 
        };
    },

    getRecordItemNode: function() {
        let recordItemNode = null;
        if (this.recordItemNodePool.size() > 0) { 
            recordItemNode = this.recordItemNodePool.get();
        } 
        else {
            recordItemNode = cc.instantiate(this.node_item);
        };
        return recordItemNode;
    },

    putRecordItemNodePool: function(recordItemNode) {
        if (recordItemNode) {
            this.recordItemNodePool.put(recordItemNode); 
        };
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SELECTED_BET_FRESH) {
            self.dealSelectedBetEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
            self.dealOnceEraseFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SINGLE_SPIN_FINISHED) {
            self.dealSingleSpinFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
            self.dealAllSpinFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING) {
            self.dealSpinStartingEvent(notify);
        }
    },

    dealSpinStartingEvent: function(notify) {
        if (!notify) {
            return;
        };
        if (this.freeCount > 0) {
            let addFree = notify.addFree;
            this.addFreeCount(addFree);
        };
    },

    dealAllSpinFinishedEvent: function(notify) {
        if (!notify) {
            return;
        };

        this.setFreeCount(0);
    },

    dealSelectedBetEvent: function(notify) {
        if (!notify) {
            return;
        };

        this.bet = notify.bet;
    
        this.setMutilPrice(this.bet * 1.25 / 100)
        this.setFreePrice(this.bet * 100 / 100);
    },

    dealSingleSpinFinishedEvent: function(notify) {
        if (!notify) {
            return;
        };

        let spin = notify.spin;
        let bet = spin.bet;
        let remainFree = spin.remainFree;

        this.removeAllRecordItems();

        this.setFreeCount(remainFree);
    },

    dealOnceEraseFinishedEvent: function(notify) {
        if (!notify) {
            return;
        };

        let erase = notify.erase;
        let bet = erase.bet;
        let addFree = erase.addFree;
        let currentXMul = erase.currentXMul;

        if (erase.elf == 12) {
            this.setMutil(currentXMul);
        };
     
        this.addFreeCount(addFree);

        if (erase.elf != 0 && erase.elf != 2 && erase.elf != 12) {
            let tempObj = {
                erase: erase,
                bet: bet,
            };
            this.toBeRecordItemDataArr = this.toBeRecordItemDataArr.concat([tempObj]);
        };
    },

    startRecordItemsListen: function() {
        let addRecordItemNodeFun = () => {
            if (this.toBeRecordItemDataArr.length > 0) {
                let recordItemData = this.toBeRecordItemDataArr.shift();
                this.addRecordItemNode(recordItemData);
            };
        };
        this.schedule(addRecordItemNodeFun, 0.5);
    },

    addRecordItemNode: function(recordItemData) {
        let len = this.recordItemNodesArr.length;
        if (len == 5) {
            for (let i = 0; i < len; i++) {
                let itemNode = this.recordItemNodesArr[i];
                cc.tween(itemNode)
                .to(this.addRecordItemInterval, {position: cc.v2(0, this.itemNodePosArr[i].y - 35)})
                .call(() => {
                    if (i == 0) {
                        let firstNode = this.recordItemNodesArr.shift();
                        this.putRecordItemNodePool(firstNode);
                        this.createRecordItemNode(recordItemData);
                    };
                })
                .start()
            };
        }
        else {
            this.createRecordItemNode(recordItemData);
        };
    },

    removeAllRecordItems: function() {
        this.toBeRecordItemDataArr = [];
        let len = this.recordItemNodesArr.length;
        for (let i = 0; i < len; i++) {
            let itemNode = this.recordItemNodesArr[i];
            this.putRecordItemNodePool(itemNode);
        };
        this.recordItemNodesArr = [];
    },

    createRecordItemNode: function(recordItemData) {
        let i = this.recordItemNodesArr.length;
        let itemNode = this.getRecordItemNode();
        itemNode.setPosition(this.itemNodeStartPos);
        this.node_itemsParent.addChild(itemNode);
        this.recordItemNodesArr.push(itemNode);
        let recordItemCtrl = itemNode.getComponent("zeusRecordItemCtrl");
        recordItemCtrl.setRecordItemData(recordItemData);
        cc.tween(itemNode)
        .to(this.addRecordItemInterval, { position: this.itemNodePosArr[i]}, cc.easeBounceOut())
        .start()
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_buyFree.node.name:
                this.dealBtnBuyFreeEvent();
                break;
            default:
                break;
        }
    },

    dealBtnBuyFreeEvent: function() {
        this.setBtnBuyFreeInteractableStatus(false);
        this.setTogDoubleMultiInteractableStatus(false);
        
        this.playBtnFreeAnim(false);
        this.setBuyFreeState(false);

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SHOW_BUY_FREE_TIPS, 
            msgData: {
                bet: this.bet
            },
        });
    },

    playBtnFreeAnim: function(isShow) {
        cc.tween(this.btn_buyFree.node)
        .to(0.2, {scale: isShow ? 1 : 0, opacity: isShow ? 255 : 0})
        .start();
    },


    setBuyFreeState: function(isBuy) {
        this.node_purchased.active = isBuy;
        this.node_notPurchased.active = !isBuy;
        this.node_notPurchased.opacity = !isBuy ? 255 : 190;
    },


    setFreeStatus: function(isFree) {
        this.node_statusFree.active = isFree;
        this.node_statusNoFree.active = !isFree;
    },

    setFreePrice: function(freePriceStr) {
        this.lab_freePrice.string = `${CommonFun.getInstance().getCurrencySymbol()}${freePriceStr}`.replace(/\./g, '_');
        
    },

    setMutilPrice: function(score) {
        this.lab_multiPrice.string = `${CommonFun.getInstance().getCurrencySymbol()}${score}`.replace(/\./g, '_');
    },

    setMutil: function(mutil) {
        if (typeof mutil != "number") {
            LoggerUtil.getInstance().warn("setMutil: mutil is not a number");
            this.lab_freeAllMulti.string = '';
            this.lab_freeAllMultiX.string = '';
            return;
        };
        if (mutil <= 0) {
            this.lab_freeAllMulti.string = '';
            this.lab_freeAllMultiX.string = '';
        }
        else {
            this.lab_freeAllMulti.string = `${mutil}`;
            this.lab_freeAllMultiX.string = 'X';
        };
    },

    getTogDoubleMultiCheckedStatus: function() {
        return this.tog_doubleMulti.isChecked;
    },

    setTogDoubleMultiCheckedStatus: function(bool) {
        this.tog_doubleMulti.isChecked = bool;
    },

    addFreeCount: function(addCount) {
        this.freeCount += addCount;
        this.setFreeCount(this.freeCount);
    },

    setFreeCount: function(freeCount) {
        this.freeCount = freeCount;
        this.setFreeCountLab(this.freeCount);
    },

    setFreeCountLab: function(freeCount) {
        if (freeCount < 0) {
            freeCount = 0;
        };
        this.lab_freeCount.string = `${freeCount}`;
    },

    setBtnBuyFreeInteractableStatus: function(bool) {
        this.btn_buyFree.interactable = bool;
        this.btn_buyFree.node.opacity = bool ? 255 : 190;
        this.node_notPurchased.opacity = bool ? 255 : 190;
    },

    setTogDoubleMultiInteractableStatus: function(bool) {
        this.tog_doubleMulti.interactable = bool;
        this.tog_doubleMulti.node.opacity = bool ? 255 : 190;
    },

    getFreeAllMultLabNode: function() {
        return this.lab_freeAllMulti.node;
    },

    getFreeAllMult: function() {
        return Number(this.lab_freeAllMulti.string);
    },
});
