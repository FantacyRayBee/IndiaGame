cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        item: cc.Node,
        btnclose: cc.Button,

    },

    onLoad() {
        this.btnclose.node.on('click', this.onBtnClose, this);
    },

    start() {
    },

    onBtnClose() {
        this.node.destroy();
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.destroyAllChildren();
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = false;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = false;
    },

    setData(data) {
        if (data.list && data.list.length > 0) {
            const maxCount = Math.min(data.list.length, 50);
            for (let i = 0; i < maxCount; i++) {
                let item = cc.instantiate(this.item);
                let itemObj = this.createPlayerBetItem(item);
                this.content.addChild(itemObj.node);
                itemObj.node.active = true;
                itemObj.setData(data.list[i]);
            }
        }
    },

    onProvableClick() {
        GameServerManager.send("gameservice.seed", "SeedReq", {
            userId: GlobalCfg.USER_DATAS.userId,
        });
    },

    createPlayerBetItem(node) {
        let obj = {};
        obj.node = node;
        obj.bg = node.getChildByName("bg");
        obj.labelBet = node.getChildByName("bet").getComponent(cc.Label);
        obj.labelDate = node.getChildByName("date").getComponent(cc.Label);
        obj.cashout = node.getChildByName("cashout")?.getComponent(cc.Label);
        obj.record_rect = node.getChildByName("record_rect");
        // obj.btn_provably = node.getChildByName("btn_provably").getComponent(cc.Button);

        // obj.btnClick = () => {
        //     //点击打开安全界面
        //     GlobalCfg.ACT_SCENE_CTRL.provablyData.bet = obj.roundsMax;
        //     GlobalCfg.ACT_SCENE_CTRL.provablyData.date = obj.date;
        //     this.onProvableClick();
        // }
        // obj.btn_provably.node.on('click', obj.btnClick, this);
        obj.setData = (data) => {
            obj.roundsMax = data.gameMub
            obj.date = data.timer
            // 设置下注金额
            obj.labelBet.string = (data.bet / 100).toFixed(2) + " ";
            obj.labelDate.string = this.formatTimestampToDate(data.timer);
            if (data.mub && data.mub > 0) {
                obj.cashout.string = ((data.bet / 100) * (data.mub / 100)).toFixed(2) + " ";
            } else {
                obj.cashout.string = '';
            }
            obj.record_rect.getChildByName("Label").getComponent(cc.Label).string = (data.mub / 100).toFixed(2);

        }
        return obj;
    },

    formatTimestampToDate(ts) {
        const date = new Date(ts * 1000); // 秒级时间戳
    
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
    
        const day = this.padZero(date.getDate());
        const month = this.padZero(date.getMonth() + 1);
    
        return `${month}-${day} ${hours}:${minutes}`;
    },

    padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }
});
