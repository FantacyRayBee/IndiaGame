
cc.Class({
    extends: cc.Component,

    properties: {
        atlas:cc.SpriteAtlas,
    },


    onLoad () {},

    start () {

    },

    setScore:function(score){
        this.lab = this.node.getChildByName("lab").getComponent(cc.Label);
        this.spriteBg = this.node.getComponent(cc.Sprite); 
        this.lab.string = score
        if(score < 7){
            this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("red_bg");
        }else if(score == 7){
            this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("blue_bg");
        }else if(score > 7){
            this.spriteBg.spriteFrame = this.atlas.getSpriteFrame("yel_bg");
        }
    },

    setNewState:function(state){
        this.node.getChildByName("NEW").active = state;
    },
});
