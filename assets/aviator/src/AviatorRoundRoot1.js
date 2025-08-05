cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        item: cc.Node,

        normalSp: cc.SpriteFrame,
        markSp: cc.SpriteFrame,

        defaultAvatar: cc.SpriteFrame,

        atlas_head: cc.SpriteAtlas,
    },

    onLoad() {
        //top
        this.node_top = this.node.getChildByName("top");
        this.lab_totalwin = this.node_top.getChildByName("lab_totalwin").getComponent(cc.Label);
        this.lab_allbet = this.node_top.getChildByName("lab_allbet").getComponent(cc.Label);
        this.users = {};
        for (let i = 1; i <= 3; i++) {
            this.users[i] = this.node_top.getChildByName("user" + i);
        }
        this.timerBar = this.node_top.getChildByName("BetProgressBar").getComponent(cc.ProgressBar);0
        this.timerBar.progress = 0; // 初始化进度条
        //bottom
        this.node_bottom = this.node.getChildByName("bottom");
        this.userIds = []; // 存储出现过的不同 userId，按顺序
        this.playerMap = {}; // userId → itemNode 映射
        this.itemPool = []; // ✅ 可复用的 item 对象池
        this._headCache = {}; // userId → spriteFrame
        this.playerCount = 0; // 当前玩家数量
        this.remindCount = 0; // 剩余没领奖的玩家数量
        this.totalWin = 0; // 总赢钱
    },

    start() {
    },

    init(){
        this.lab_totalwin.string = 0;
        this.lab_allbet.string = "0/0";
        this.playerCount = 0;
        this.remindCount = 0;
        this.totalWin = 0;
        this.timerBar.progress = 0; 
        for (let i = 1; i <= 3; i++) {
            this.users[i].active = false;
        }
        // 将所有 item 节点设为 inactive（不销毁）
        this.content.children.forEach(child => {
            child.active = false;
            // 回收到对象池
            if (!this.itemPool.includes(child)) {
                this.itemPool.push(child);
            }
        });
        this.playerMap = {};
        this.userIds = [];
    },

    //有玩家领取奖励 刷新界面
    setPlayerResult(notify) {
        this.applyResultByUserId(notify.pid, notify.pos, notify.amount, notify.mul);
    },

    /**
     * 刷新或添加玩家下注项
     * @param {{ userId: string, head: string, bet: number }} notify 
     */
    refreshPlayerBet(notify) {
        if (!notify || !notify.userId || typeof notify.pos !== 'number') return;
    
        let uid = notify.userId;
        let bet = notify.bet;
        let head = notify.head;
        let pos = notify.pos;
    
        const key = `${uid}@${pos}`;
        if (!this.playerMap[key]) {
            let itemNode = this.getItemNode();
            if (!itemNode.parent) {
                this.content.addChild(itemNode);
            }
    
            let itemObj = this.createPlayerBetItem(itemNode);
            itemObj.node.active = true;
    
            // 默认头像（防止异步加载闪现）
            itemObj.imgHead.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
    
            itemObj.initItem(uid, bet, head);
            this.playerMap[key] = itemObj;
    
            // 👇 仍然保留 this.users 用于显示前 3 个“唯一 userId”的头像
            if (!this.userIds.includes(uid)) {
                this.userIds.push(uid);
                if (this.userIds.length <= 3) {
                    const index = this.userIds.length;
                    this.users[index].active = true;
                    const imgNode = this.users[index].getChildByName("tx").getChildByName("img_head");
                    GlobalCfg.ACT_SCENE_CTRL.loadHead(imgNode, head);
                }
            }
            this.playerCount++;
            this.remindCount++;
        } else {
            this.playerMap[key].updateBet(bet);
        }
        this.lab_allbet.string = `${this.remindCount}/${this.playerCount}`
    },

    getItemNode() {
        for (let i = 0; i < this.itemPool.length; i++) {
            if (!this.itemPool[i].activeInHierarchy) {
                return this.itemPool[i];
            }
        }
        let item = cc.instantiate(this.item);
        this.itemPool.push(item);
        return item;
    },
    
    createPlayerBetItem(node) {
        let obj = {};
        obj.node = node;
        obj.bg = node.getChildByName("bg").getComponent(cc.Sprite);
        obj.labelId = node.getChildByName("id").getComponent(cc.Label);
        obj.labelBet = node.getChildByName("bet").getComponent(cc.Label);
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head");
        obj.cashout = node.getChildByName("cashout")?.getComponent(cc.Label);
        obj.record_rect = node.getChildByName("record_rect");
    
        obj.initItem = (userId, bet, headUrl) => {
            obj.bg.spriteFrame = this.normalSp;
            obj.userId = userId;
            obj.labelId.string = this.maskUserId(userId);
            obj.labelBet.string = bet / 100 + " ";
            obj.record_rect.active = false;
            obj.cashout.string = '';
            GlobalCfg.ACT_SCENE_CTRL.loadHead(obj.imgHead, headUrl);
        }
    
        obj.updateBet = (bet) => {
            obj.labelBet.string = bet / 100 + " ";   
        }
    
        obj.setResult = (amount, data) => {
            if (!obj.cashout || !obj.record_rect) return;
    
            obj.cashout.string = amount/100;
            obj.record_rect.active = true;
            let RocketRecordRectCtrl = obj.record_rect.getComponent("AviatorRecordRectCtrl");
            if (RocketRecordRectCtrl) {
                RocketRecordRectCtrl.init(data);
            }
            obj.bg.spriteFrame = this.markSp;
        };
        return obj;
    },

    maskUserId(userId) {
        if (!userId || userId.length < 5) return userId;
        const prefix = userId.slice(0, 2);
        const suffix = userId.slice(-3);
        return `${prefix}***${suffix}`;
    },

    applyResultByUserId(userId, pos, amount, mult) {
        const key = `${userId}@${pos}`;
        const itemObj = this.playerMap[key];
        if (itemObj && itemObj.setResult) {
            itemObj.setResult(amount, { mul: mult });
        }
        this.remindCount--;
        if (this.remindCount < 0) {
            this.remindCount = 0;
        }
        this.lab_allbet.string = `${this.remindCount}/${this.playerCount}`
        this.totalWin += amount;
        this.lab_totalwin.string = this.totalWin/100 + " ";
        this.timerBar.progress = (this.playerCount - this.remindCount) / this.playerCount;
    }
});
