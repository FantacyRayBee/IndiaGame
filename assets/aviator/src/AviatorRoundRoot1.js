cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        item: cc.Node,
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
        this.timerBar = this.node_top.getChildByName("BetProgressBar").getComponent(cc.ProgressBar);
        //bottom
        this.node_bottom = this.node.getChildByName("bottom");
        this.userIds = []; // 存储出现过的不同 userId，按顺序
        this.playerMap = {}; // userId → itemNode 映射
    },

    start() {

    },

    init(){
        this.lab_totalwin.string = 0;
        this.lab_allbet.string = "0/0";
        for (let i = 1; i <= 3; i++) {
            this.users[i].active = false;
        }
    },

    /**
     * 刷新或添加玩家下注项
     * @param {{ userId: string, head: string, bet: number }} notify 
     */
    refreshPlayerBet(notify) {
        if (!notify || !notify.userId) return;
    
        let uid = notify.userId;
        let bet = notify.bet;
        let head = notify.head;
        // ✅ 判断是否为新用户
        if (!this.playerMap[uid]) {
            // 创建 item
            let itemNode = cc.instantiate(this.item);
            itemNode.getChildByName("id").getComponent(cc.Label).string = uid;
            itemNode.getChildByName("bet").getComponent(cc.Label).string = bet.toString();
            this.loadHead(itemNode.getChildByName("tx").getChildByName("img_head"), head);
            this.content.addChild(itemNode);
            this.playerMap[uid] = itemNode;
    
            // ✅ 如果是新的 userId 且前3名内，设置头像
            if (!this.userIds.includes(uid)) {
                this.userIds.push(uid);
                if (this.userIds.length <= 3) {
                    const index = this.userIds.length; // 1~3
                    this.users[index].active = true;
                    this.loadHead(this.users[index].getChildByName("tx").getChildByName("img_head"), head);
                }
            }
        } else {
            // 已存在：更新 bet
            let itemNode = this.playerMap[uid];
            itemNode.getChildByName("bet").getComponent(cc.Label).string = bet.toString();
        }
    },

    loadHead(spriteNode, url) {
        cc.loader.load({ url, type: 'png' }, (err, tex) => {
            if (!err && cc.isValid(this) && cc.isValid(spriteNode)) {
                spriteNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            }
        });
    }
});
