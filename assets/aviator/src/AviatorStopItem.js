

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_node: cc.Toggle,

        btn_add: cc.Button,
        btn_att: cc.Button,
        edit_set: cc.EditBox,

        node_infos: cc.Node,
    },

    
    onLoad() {
        this.btn_add.node.on('click', this.btnClick, this);
        this.btn_att.node.on('click', this.btnClick, this);
        this.toggle_node.node.on('toggle', this.toggleClick, this);
    },

    start() {
        this.curBet = 0;
        this.maxBet = 1000000; //最大下注
        this.btn_add.interactable = false;
        this.btn_att.interactable = false;
        this.edit_set.enabled = false;
        this.setClickStatus();
    },

    toggleClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.btn_add.interactable = toggle.isChecked;
        this.btn_att.interactable = toggle.isChecked;
        this.edit_set.enabled = toggle.isChecked;
        this.setClickStatus();
    },

    btnClick(btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_add") {
            this.dealBetChangeEvent(1);
        } 
        else if (btnName === "btn_att") {
            this.dealBetChangeEvent(2);
        }
    },

    setClickStatus() {
        this.node_infos.opacity = this.toggle_node.isChecked ? 255 : 160;
    },

    dealBetChangeEvent: function (type) {
        if (type == 1) {
            this.curBet += 100;
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;
        } else if (type == 2) {
            this.curBet -= 100;
            if (this.curBet < 0)
                this.curBet = 0;
        }
        this.edit_set.string = (this.curBet / 100).toFixed(2);
    },

    reset() {
        this.curBet = 0;
        this.edit_set.string = (this.curBet / 100).toFixed(2);
        this.toggle_node.isChecked = false;
        this.setClickStatus();
    },

    isError() {
        let bet = parseFloat(this.edit_set.string);
        this.curBet = bet * 100;
        if (this.toggle_node.isChecked && this.curBet == 0) {
            return true;
        }
        return false;
    },

    getInfo() {
        if (this.toggle_node.isChecked) {
            let bet = parseFloat(this.edit_set.string);
            this.curBet = bet * 100;
            return this.curBet;
        }
        else {
            return 0;
        }
    },
});
