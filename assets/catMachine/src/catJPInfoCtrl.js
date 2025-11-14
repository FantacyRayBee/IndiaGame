cc.Class({
    extends: cc.Component,

    properties: {
        lab_jp: cc.Label,
        content: cc.Node,
        item: cc.Node,

        btn_close: cc.Button,
        jpType: [cc.SpriteFrame]
    },

    ctor: function () {
    },
    onLoad() {
        this.btn_close.node.on('click', this.onCloseClick, this);
    },

    start() {
    },

    setData: function (data) {
        let totalWin = 0;
        for (let i = 0; i < data.infos.length; i++) {
            let item = cc.instantiate(this.item);
            let itemObj = this.createJpItem(item);
            this.content.addChild(itemObj.obj);
            itemObj.setData(data.infos[i]);
            totalWin += this.getReward(data.infos[i].types, data.infos[i].TotalBet / 100) ;
        }
        this.lab_jp.string = totalWin;
    },

    onCloseClick() {
        this.node.destroy();
    },

    createJpItem: function (node) {
        let obj = {}
        obj.obj = node;
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head").getComponent(cc.Sprite);
        obj.date = node.getChildByName("date").getComponent(cc.Label);
        obj.reward = node.getChildByName("reward").getComponent(cc.Label);
        obj.bet = node.getChildByName("bet").getComponent(cc.Label);
        obj.name = node.getChildByName("name").getComponent(cc.Label);
        obj.type1 = node.getChildByName("type0")
        obj.type2 = node.getChildByName("type1")
        obj.type3 = node.getChildByName("type2")
        obj.self = this;
        obj.data = {}

        obj.setData = function (data) {
            obj.data = data;
            obj.obj.active = true;
            obj.self.loadHeadSp(data.HeadUrl, 60, obj.imgHead);
            obj.date.string = obj.self.formatTimestampToDate(data.time * 1000);
            obj.bet.string = CommonFun.getInstance().numberToShow(data.TotalBet / 100);
            obj.name.string = CommonFun.getInstance().getStrByLength(data.nickname, 8);

            obj.reward.string = obj.self.getReward(data.types, data.TotalBet / 100);
            obj.type1.active = data.types == 1;
            obj.type2.active = data.types == 2;
            obj.type3.active = data.types == 3;
        }
        return obj;
    },

    getReward: function (type, bet) {
        let ret = 0;
        const m = GlobalCfg.ACT_SCENE_CTRL.jpMub || [2000, 5000, 10000];  // 兜底
        const minor = bet * m[0] / 100;
        const major = bet * m[1] / 100;
        const grand = bet * m[2] / 100;

        if (type == 1) {
            ret = minor;
        }
        else if (type == 2) {
            ret = major;
        }
        else if (type == 3) {
            ret = grand;
        }
        return ret
    },

    //添加加载头像
    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    formatTimestampToDate(ts) {
        const date = new Date(ts); // 秒级时间戳
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        const day = this.padZero(date.getDate());
        const month = this.padZero(date.getMonth() + 1);
        return `${day}-${month} ${hours}:${minutes}`;
    },
    padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }
});