

cc.Class({
    extends: cc.Component,

    properties: {
        toggle_node: cc.Toggle,

        btn_add: cc.Button,
        btn_att: cc.Button,
        edit_set: cc.EditBox,
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
    },

    toggleClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.btn_add.interactable = toggle.isChecked;
        this.btn_att.interactable = toggle.isChecked;
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

    dealBetChangeEvent: function (type) {
        if (type == 1) {
            this.curBet += 10;
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;
        } else if (type == 2) {
            this.curBet -= 10;
            if (this.curBet < 0)
                this.curBet = 0;
        }
        this.edit_set.string = this.curBet + ".00";
    },

    reset() {
        this.edit_set.string = "0.00";
        this.toggle_node.isChecked = false;
        this.curBet = 0;
    },

    isError() {
        let bet = parseFloat(this.edit_set.string);
        this.curBet = bet;
        if (this.toggle_node.isChecked && this.curBet == 0) {
            return true;
        }
        return false;
    },

    getInfo() {
        if (this.toggle_node.isChecked) {
            let bet = parseFloat(this.edit_set.string);
            this.curBet = bet;
            return this.curBet;
        }
        else {
            return null;
        }
    },
});
