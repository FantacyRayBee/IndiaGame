cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: cc.Label,
        btn_pack: cc.Button,
        btn_continue: cc.Button,
    },

    
    onLoad: function() {
        this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.btn_continue.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    },


    btnClickCall: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_pack.node.name:
                this.dealBtnPackEvent();
                break;
            case this.btn_continue.node.name:
                this.node.destroy();
                break;
            default:
                break;
        }
    },

    dealBtnPackEvent: function() {
        let proroID = "gameservice.drop";
        let message = "DropReq";
        GameServerManager.send(proroID, message, {});
        this.node.destroy();
    },


    setTeenPattiWinRate: function(winRate) {
        this.lab_content.string = `Your probability of winning this round is ${(winRate/100).toFixed(2)}%\nAre yor sure to pack?`;
    }
});
