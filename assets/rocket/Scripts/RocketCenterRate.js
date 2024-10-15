

cc.Class({
    extends: cc.Component,

    properties: {
        greenLabColor: cc.Color,
        orangeLabColor: cc.Color,
        purpleLabColor: cc.Color,
        blueLabColor: cc.Color,
        greenSpriteFrame: cc.SpriteFrame,
        orangeSpriteFrame: cc.SpriteFrame,
        purpleSpriteFrame: cc.SpriteFrame,
        blueSpriteFrame: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    /**
     * 更新当前 Rate
     * @param {Number} value Rate
     */
    updateRate(value) {
        if(!value) return;
        
        value = Number(value);
        let color = this.node.getChildByName('Label').color;
        let _sp = this.node.getComponent(cc.Sprite).spriteFrame;
        if(value >= 0 && value < 3){
            color = this.greenLabColor;
            _sp = this.greenSpriteFrame;
        }else if(value >= 3 && value < 6){
            color = this.blueLabColor;
            _sp = this.blueSpriteFrame;
        }else if(value >= 6 && value < 12){
            color = this.purpleLabColor;
            _sp = this.purpleSpriteFrame;
        }else if(value >= 12 ){
            color = this.orangeLabColor;
            _sp = this.orangeSpriteFrame;
        }
        this.node.getComponent(cc.Sprite).spriteFrame = _sp;
        this.node.getChildByName('Label').color = color;
        this.node.getChildByName('Label').getComponent(cc.Label).string = value.toFixed(2) + 'x';
    },

    // update (dt) {},
});
