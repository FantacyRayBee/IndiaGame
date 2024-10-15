cc.Class({
    extends: cc.Component,

    properties: {
        lab_freePrice: cc.Label,
        btn_no: cc.Button,
        btn_yes: cc.Button,
    },


    onLoad: function() {
        this.btn_no.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_yes.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_no.node.name:
                this.dealBtnNoAndYesEvent(false);
                break;
            case this.btn_yes.node.name:
                this.dealBtnNoAndYesEvent(true);
                break;
            default:
                break;
        }
    },

    setBuyFreeTipsData: function(bet) {
        this.bet = bet;
        this.lab_freePrice.string = `$${this.bet * 100 / 100}`;
    },

    dealBtnNoAndYesEvent: function(isAgree) {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_BUY_FREE_REQ, 
            msgData: {
                bet: this.bet,
                isAgree: isAgree
            },
        });
        this.node.destroy();
    },
});
