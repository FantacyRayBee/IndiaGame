cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.lab_num = this.node.getChildByName("lab_num").getComponent(cc.Label);
        this.users = {};
        for (let i = 1; i <= 3; i++) {
            this.users[i] = this.node.getChildByName("user" + i);
        }
        this.userIds = []; // 存储出现过的不同 userId，按顺序
        this.playerMap = {}; // userId → itemNode 映射
        this.playerCount = 0; // 当前玩家数量
    },

    start() {
    },

    init(){
        this.lab_num.string = "0";
        this.playerCount = 0;
        for (let i = 1; i <= 3; i++) {
            this.users[i].active = false;
        }
        this.playerMap = {};
        this.userIds = [];
    },

    //有玩家领取奖励 刷新界面
    setPlayerResult(notify) {
        this.applyResultByUserId(notify.pid, notify.pos);
    },

    /**
     * 刷新或添加玩家下注项
     * @param {{ userId: string, head: string, bet: number }} notify 
     */
    refreshPlayerBet(notify) {
        if (!notify || !notify.userId || typeof notify.pos !== 'number') return;
    
        let uid = notify.userId;
        let head = notify.head;
        let pos = notify.pos;
    
        const key = `${uid}@${pos}`;
        if (!this.playerMap[key]) {
            this.playerMap[key] = true;
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
        }
        this.lab_num.string = `${this.playerCount}`
    },

    applyResultByUserId(userId, pos) {
        const key = `${userId}@${pos}`;
        if (this.playerMap[key] == true) {
            this.playerMap[key] = false;
            this.playerCount--;
            if (this.playerCount < 0) {
                this.playerCount = 0;
            }
            this.lab_num.string = `${this.playerCount}`
        }
    }
});
