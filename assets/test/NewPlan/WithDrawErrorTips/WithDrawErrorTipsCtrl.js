cc.Class({
    extends: cc.Component,

    properties: {
        labMsg: cc.Label,
        btnOk: cc.Button,
    },

    ctor() {
        this.orderId = '';
    },

    onLoad() {
        this.btnOk.node.on('click', () => {
            this.node.destroy();
        }, this);

    },

    start() {

    },

    /**
     * 
     * @param {String} orderId 订单ID
     * @param {Int} orderAmount 金额
     * @param {Int} time 时间戳
     * @param {String} msg 错误消息
     */
    setErrData(orderId, orderAmount, time, msg) {
        if (orderId == this.orderId) {
            LoggerUtil.getInstance().warn(`订单${orderId}重复推送！`)
        } else {
            this.orderId = orderId;
            this.labMsg.string = "\n"+"Order Amount: " + Number(orderAmount / 100) + "\n\n" + "Withdrawal Time: " + time + "\n\n" + "Error Message: " + msg +
             "\n\n" + "Your withdrawal order has failed." + "\n" + "Please check if your withdrawal information is correct.";
        }
    },



    // update (dt) {},
});
