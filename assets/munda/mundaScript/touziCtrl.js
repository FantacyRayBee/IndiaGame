// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor(){
        this.touziDice = null
    },
    
    setTouziDice: function (num) {
        LoggerUtil.getInstance().log("设置骰子值", num);
        this.touziDice = num
    },
    getTouziDice: function () {
        return this.touziDice
    },
    start() {

    },

    // update (dt) {},
});
