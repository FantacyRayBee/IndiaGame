cc.Class({
    extends: cc.Component,

    properties: {
        tog_1: cc.Toggle,
        tog_2: cc.Toggle,
        tog_3: cc.Toggle,
        tog_4: cc.Toggle,

        node_panel1: cc.Node,
        node_panel2: cc.Node,
        node_panel3: cc.Node,
        node_panel4: cc.Node,

        btn_close: cc.Button,
    },

    ctor: function() {

    },

    onLoad() {
        this.tog_1.node.on('toggle', this.toggleClick, this);
        this.tog_2.node.on('toggle', this.toggleClick, this);
        this.tog_3.node.on('toggle', this.toggleClick, this);
        this.tog_4.node.on('toggle', this.toggleClick, this);

        this.btn_close.node.on('click', this.onCloseClick, this);
    },


    start() {
        this.NowToggleName = "tog_1";
        this.setViewByToggleName(this.NowToggleName);
    },

    onCloseClick() {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
    },

    onDestroy: function() {
    },

    // ====== 难度切换 ======
    toggleClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.setViewByToggleName(toggle.node.name);
    },

    setViewByToggleName(toggleName) {
        if (toggleName === this.NowToggleName) return;

        this.node_panel1.active = false;
        this.node_panel2.active = false;
        this.node_panel3.active = false;
        this.node_panel4.active = false;
        if (toggleName === 'tog_1') this.node_panel1.active = true;
        else if (toggleName === 'tog_2') this.node_panel2.active = true;
        else if (toggleName === 'tog_3') this.node_panel3.active = true;
        else if (toggleName === 'tog_4') this.node_panel4.active = true;
        this.NowToggleName = toggleName;
    },
});
