cc.Class({
    extends: cc.Component,

    properties: {
        rounds_content: cc.Node,
        rounds_item: cc.Node,

        win_content: cc.Node,
        win_item: cc.Node,

        tog_x: cc.Toggle,
        tog_win: cc.Toggle,
        tog_round: cc.Toggle,
        tog_day: cc.Toggle,
        tog_month: cc.Toggle,
        tog_year: cc.Toggle,

        defaultAvatar: cc.SpriteFrame,

        blueLabColor: cc.Color,
        purpleLabColor: cc.Color,
        redLabColor: cc.Color,
    },

    onLoad() {
        this.rounds_root = this.node.getChildByName("rounds_root");
        this.win_root = this.node.getChildByName("win_root");

        this.tog_x.node.on('toggle', this.toggleTopClick, this);
        this.tog_win.node.on('toggle', this.toggleTopClick, this);
        this.tog_round.node.on('toggle', this.toggleTopClick, this);

        this.tog_day.node.on('toggle', this.toggleBottomClick, this);
        this.tog_month.node.on('toggle', this.toggleBottomClick, this);
        this.tog_year.node.on('toggle', this.toggleBottomClick, this);

        this.itemPool_win = [];
        this.itemPool_round = [];
        this._headCache = {};
    },

    start() {
        this.NowToggleName1 = "tog_x"
        this.NowToggleName2 = "tog_day"
        this.setViewByToggleName1(this.NowToggleName1)
        this.setViewByToggleName2(this.NowToggleName2)
        this.typesIndex = 1;// 排行榜类型 1:赢钱榜, 2:倍数榜, 3:最大倍数榜
        this.timerIndex = 1;// 时间类型 1:今天, 2:本月, 3:本年
        this.setWinData(GlobalCfg.ACT_SCENE_CTRL.roundTopRankInfo)
    },

    init() {
        this.rounds_content.children.forEach(child => {
            child.active = false;
            // 回收到对象池
            if (!this.itemPool_round.includes(child)) {
                this.itemPool_round.push(child);
            }
        });

        this.win_content.children.forEach(child => {
            child.active = false;
            if (!this.itemPool_win.includes(child)) {
                this.itemPool_win.push(child);
            }
        });
    },

    toggleTopClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName1(toggleName);
    },

    toggleBottomClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName2(toggleName);
    },

    setViewByToggleName1(toggleName) {
        if(toggleName == this.NowToggleName1)
            return
        this.win_root.active = false;
        this.rounds_root.active = false;

        if (toggleName == "tog_x") {
            this.typesIndex = 1;
            this.win_root.active = true;
        }
        if (toggleName == "tog_win") {
            this.typesIndex = 2;
            this.win_root.active = true;
        }
        if (toggleName == "tog_round") {
            this.typesIndex = 3;
            this.rounds_root.active = true;
        }
        this.requsetData();
        this.NowToggleName1 = toggleName
    },

    setViewByToggleName2(toggleName) {
        if(toggleName == this.NowToggleName2)
            return
        if (toggleName == "tog_day") {
            this.timerIndex = 1;
        }
        if (toggleName == "tog_month") {
            this.timerIndex = 2;
        }
        if (toggleName == "tog_year") {
            this.timerIndex = 3;
        }
        this.NowToggleName2 = toggleName
        this.requsetData();
    },

    onProvableClick(userId) {
        GameServerManager.send("gameservice.seed", "SeedReq", {
            userid: userId,
        });
    },

    requsetData() {
        GameServerManager.send("gameservice.getrankingdata", "GetRankingDataReq", {
            types: this.typesIndex,
            timer: this.timerIndex,
        });
    },

    setWinData(data) {
        LoggerUtil.getInstance().log("caojun setWinData data = ", data);
        this.init();
        if (data.list && data.list.length > 0) {
            if (this.typesIndex < 3) {
                for (let i = 0; i < data.list.length; i++) {
                    let itemObj = this.getItemNode_win();
                    if (!itemObj.node.parent) {
                        this.win_content.addChild(itemObj.node);
                    }
                    itemObj.node.active = true;
                    itemObj.imgHead.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
                    itemObj.setData(data.list[i]);
                }
            } else {
                for (let i = 0; i < data.list.length; i++) {
                    let itemObj = this.getItemNode_rounds();
                    if (!itemObj.node.parent) {
                        this.rounds_content.addChild(itemObj.node);
                    }
                    itemObj.node.active = true;
                    itemObj.setData(data.list[i]);
                }
            }
        }
    },

    createWinItem(node) {
        let obj = {};
        obj.node = node;
        obj.bg = node.getChildByName("bg");
        obj.labelId = node.getChildByName("id").getComponent(cc.Label);
        obj.imgHead = node.getChildByName("tx").getChildByName("img_head");
        obj.date = node.getChildByName("date").getComponent(cc.Label);
        obj.btn_provably = node.getChildByName("btn_provably").getComponent(cc.Button);
        obj.info = node.getChildByName("info");
        
        obj.lab_bet = obj.info.getChildByName("bet").getChildByName("lab_bet").getComponent(cc.Label);
        obj.lab_win = obj.info.getChildByName("win").getChildByName("lab_win").getComponent(cc.Label);
        obj.lab_result = obj.info.getChildByName("result").getChildByName("lab_result").getComponent(cc.Label);
        obj.lab_round = obj.info.getChildByName("roundmax").getChildByName("lab_round").getComponent(cc.Label);

        obj.btnClick = () => {
            //点击打开安全界面
            GlobalCfg.ACT_SCENE_CTRL.provablyData.bet = obj.roundsMax;
            GlobalCfg.ACT_SCENE_CTRL.provablyData.date = obj.Date;
            this.onProvableClick(obj.userId);
        }
        obj.btn_provably.node.on('click', obj.btnClick, this);

        obj.setData = (data) => {
            LoggerUtil.getInstance().log("AviatorRoundRoot3 setData", data);
            obj.userId = data.userId;
            obj.roundsMax = data.rounds;
            obj.Date = data.timer;
            obj.labelId.string = this.maskUserId(data.userId);
            obj.lab_bet.string = (data.bet / 100) + " ";
            obj.lab_win.string = ((data.mub / 1000) * (data.bet / 100)).toFixed(2) + " ";
            obj.lab_result.string = (data.mub / 1000) + "x";
            obj.lab_round.string = (data.rounds/ 1000) + "x";
            obj.date.string = this.formatTimestampToDate(data.timer);
            GlobalCfg.ACT_SCENE_CTRL.loadHead(obj.imgHead, data.head);

            obj.lab_result.node.color = this.setColor(data.mub);
            obj.lab_round.node.color = this.setColor(data.rounds);
        }
        return obj;
    },

    setColor(_value) {
        let value = Number((_value / 1000).toFixed(2));
        let color = null;
        if (value >= 0 && value < 2) {
            color = this.blueLabColor;
        } else if (value >= 2 && value < 10) {
            color = this.purpleLabColor;
        } else if (value >= 10) {
            color = this.redLabColor;
        }
        return color;
    },

    createRoundItem(node) {
        let obj = {};
        obj.node = node;
        obj.date = node.getChildByName("date").getComponent(cc.Label);
        obj.btn_provably = node.getChildByName("btn_provably").getComponent(cc.Button);
        obj.record_rect = node.getChildByName("record_rect");

        obj.btnClick = () => {
            //点击打开安全界面
            GlobalCfg.ACT_SCENE_CTRL.provablyData.bet = obj.roundsMax;
            GlobalCfg.ACT_SCENE_CTRL.provablyData.date = obj.Date;
            this.onProvableClick(obj.userId);
        }
        obj.btn_provably.node.on('click', obj.btnClick, this);

        obj.setData = (data) => {
            LoggerUtil.getInstance().log("AviatorRoundRoot4 setData", data);
            obj.userId = data.user_id;
            obj.roundsMax = data.mub;
            obj.Date = data.timer;
            obj.date.string = this.formatTimestampToDate(data.timer);
            let RocketRecordRectCtrl = obj.record_rect.getComponent("AviatorRecordRectCtrl");
            if (RocketRecordRectCtrl) {
                RocketRecordRectCtrl.init({mul:data.mub});
            }
        }
        return obj;
    },

    getItemNode_rounds() {
        for (let i = 0; i < this.itemPool_round.length; i++) {
            const itemObj = this.itemPool_round[i];
            if (!itemObj.node.activeInHierarchy) {
                return itemObj;
            }
        }
        let item = cc.instantiate(this.rounds_item);
        let itemObj = this.createRoundItem(item);
        this.itemPool_round.push(itemObj);
        return itemObj;
    },

    getItemNode_win() {
        for (let i = 0; i < this.itemPool_win.length; i++) {
            const itemObj = this.itemPool_win[i];
            if (!itemObj.node.activeInHierarchy) {
                return itemObj;
            }
        }
        let item = cc.instantiate(this.win_item);
        let itemObj = this.createWinItem(item);
        this.itemPool_win.push(itemObj);
        return itemObj;
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

    formatTimestampToDate(ts) {
        // 确保是秒级时间戳（10位）
        const date = new Date(ts * 1000);
        const day = this.padZero(date.getDate());
        const month = this.padZero(date.getMonth() + 1); // 月份从 0 开始
        const year = date.getFullYear().toString().slice(-2); // 取后两位
        return `${year}-${month}-${day}`;
    },
    
    padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }

});