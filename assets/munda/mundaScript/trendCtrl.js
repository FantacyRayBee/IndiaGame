// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        grey: cc.SpriteFrame,
        red: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
        this.btn_close.node.on("click", this.btnClick, this);
    },

    start() {

    },

    btnClick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
    },

    initTrendNode(){
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 14; j++) {
                let node = this.node.getChildByName("bg_zs").getChildByName(`node_${i}`).getChildByName(`child_${j}`);
                node.active = false;
            }
        }
    },

    setTrendData(data) {
        this.initTrendNode();
        for (let i = 0; i < data.length; i++) {
            let arr = data[i];
            for (let j = 0; j < arr.length; j++) {
                let dice = arr[j];
                let node = this.node.getChildByName("bg_zs").getChildByName(`node_${i}`).getChildByName(`child_${j}`);
                if (dice < 2) {
                    node.getComponent(cc.Sprite).spriteFrame = this.grey;
                    node.getChildByName("lab").getComponent(cc.Label).string = "";
                } else {
                    node.getComponent(cc.Sprite).spriteFrame = this.red;
                    node.getChildByName("lab").getComponent(cc.Label).string = dice;
                }
                node.active = true;
            }
        }
    },

    // update (dt) {},
});
