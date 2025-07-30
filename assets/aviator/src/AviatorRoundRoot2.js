cc.Class({
    extends: cc.Component,

    properties: {
        lab_Result: cc.Label,
        content: cc.Node,
        item: cc.Node,

        normalColor: cc.Color,
        markColor: cc.Color,

        defaultAvatar: cc.SpriteFrame,
    },

    onLoad() {
        this.itemPool = [];
        this._headCache = {};
    },

    start() {

    },

    init() {
        this.content.children.forEach(child => {
            child.active = false;
            // 回收到对象池
            if (!this.itemPool.includes(child)) {
                this.itemPool.push(child);
            }
        });
    },

    setLastGameRecord(data) {
        this.init();
        this.lab_Result.string = (data.rounds/1000).toFixed(2) + "x";
        if (data.list && data.list.length > 0) {
            const maxCount = Math.min(data.list.length, 50);
            for (let i = 0; i < maxCount; i++) {
                let itemObj = this.getItemNode();
                if (!itemObj.node.parent) {
                    this.content.addChild(itemObj.node);
                }
                itemObj.node.active = true;
                itemObj.imgHead.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
                itemObj.setData(data.list[i]);
            }
        }
    },

    getItemNode() {
        for (let i = 0; i < this.itemPool.length; i++) {
            const itemObj = this.itemPool[i];
            if (!itemObj.node.activeInHierarchy) {
                return itemObj;
            }
        }
        let item = cc.instantiate(this.item);
        let itemObj = this.createPlayerBetItem(item);
        this.itemPool.push(itemObj);
        return itemObj;
    },

    createPlayerBetItem(node) {
        let obj = {};
        obj.node = node;
        obj.bg = node.getChildByName("bg");
        obj.labelId = node.getChildByName("id").getComponent(cc.Label);
        obj.labelBet = node.getChildByName("bet").getComponent(cc.Label);
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head");
        obj.cashout = node.getChildByName("cashout")?.getComponent(cc.Label);
        obj.record_rect = node.getChildByName("record_rect");
    
        obj.setData = (data) => {
            obj.bg.color = this.normalColor;
            obj.userId = data.userId;
            obj.labelId.string = this.maskUserId(data.userId);
    
            // 加载头像
            if (data.head) {
                this.loadHead(obj.imgHead, data.head);
            } else {
                obj.imgHead.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
            }
    
            // 设置下注金额
            obj.labelBet.string = (data.bet / 100).toFixed(2) + " ";
    
            if (data.mub && data.mub > 0) {
                obj.cashout.string = ((data.bet / 100) * (data.mub / 1000)).toFixed(2) + " ";
                obj.bg.color = this.markColor;
                obj.record_rect.active = true;
                let RocketRecordRectCtrl = obj.record_rect.getComponent("AviatorRecordRectCtrl");
                if (RocketRecordRectCtrl) {
                    RocketRecordRectCtrl.init({ mul: data.mub });
                }
            } else {
                obj.cashout.string = '';
                obj.bg.color = this.normalColor;
                obj.record_rect.active = false;
            }
        }
        return obj;
    },
    
    maskUserId(userId) {
        if (!userId || userId.length < 5) return userId;
        const prefix = userId.slice(0, 2);
        const suffix = userId.slice(-3);
        return `${prefix}***${suffix}`;
    },

    loadHead(spriteNode, url) {
        if (this._headCache[url]) {
            spriteNode.getComponent(cc.Sprite).spriteFrame = this._headCache[url];
            return;
        }
        spriteNode._headUrl = url;
        cc.loader.load({ url, type: 'png' }, (err, tex) => {
            if (err || !cc.isValid(this) || !cc.isValid(spriteNode)) return;
            if (spriteNode._headUrl !== url) return;
    
            let frame = new cc.SpriteFrame(tex);
            this._headCache[url] = frame;
            spriteNode.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },

});
