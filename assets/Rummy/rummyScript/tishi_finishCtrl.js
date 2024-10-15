cc.Class({
    extends: cc.Component,

    properties: {
        lab_tishi: cc.Label,
        btn_declare: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btn_declare.node.on("click", this.btnClick, this)
    },

    btnClick: function (button) {
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "agreeDeclare", msgData: {} });
    },

    setDeClareContent: function (content) {
        this.lab_tishi.string = content;
    },

    start() {

    },

    // update (dt) {},
});
