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
    },

    start() {
        this.NowToggleName1 = "tog_x"
        this.NowToggleName2 = "tog_day"
        this.setViewByToggleName1(this.NowToggleName1)
        this.setViewByToggleName2(this.NowToggleName2)
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
        if (this.win_root) {
            this.win_root.active = toggleName == "tog_x" || toggleName == "tog_win";
        };
        if (this.rounds_root) {
            this.rounds_root.active = toggleName == "tog_round";
        };
        this.NowToggleName1 = toggleName
    },

    setViewByToggleName2(toggleName) {
        if(toggleName == this.NowToggleName2)
            return
        if (toggleName == "tog_day") {
        }
        if (toggleName == "tog_month") {
        }
        if (toggleName == "tog_year") {
        }
        this.NowToggleName2 = toggleName
    },

    onProvableClick(userId) {
        GameServerManager.send("gameservice.seed", "SeedReq", {
            userid: userId,
        });
    },
});