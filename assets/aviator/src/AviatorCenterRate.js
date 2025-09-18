

cc.Class({
    extends: cc.Component,

    properties: {
        normalLabColor: cc.Color,
        endLabColor: cc.Color,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    /**
     * 更新当前 Rate
     * @param {Number} value Rate
     */
    updateRate(value, isEnd) {
        if(!value) return;
        
        value = Number(value);
        let color = this.node.getChildByName('Label').color;
        let txt = this.node.getChildByName('txt');
        if(isEnd){
            color = this.endLabColor;
            txt.active = true;
        }
        else{
            color = this.normalLabColor;
            txt.active = false;
        }
        this.node.getChildByName('Label').color = color;
        this.node.getChildByName('Label').getComponent(cc.Label).string = value.toFixed(2) + 'x';
    },

    // update (dt) {},
});
