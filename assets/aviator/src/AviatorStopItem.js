

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
        this.curBet = 10;
        this.maxBet = 1000000; //最大下注
        this.edit_Mult.enabled = false;
        this.btn_add.interactable = false;
        this.btn_att.interactable = false;
    },

    toggleClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.edit_Mult.enabled = toggle.isChecked;
        this.btn_add.interactable = toggle.isChecked;
        this.btn_att.interactable = toggle.isChecked;
    },

    btnClick() {
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
        this.curBet = 10;
    },

    getInfo() {
        if (this.toggle_node.isChecked) {
            return this.curBet;
        }
        else {
            return null;
        }
    },
});
