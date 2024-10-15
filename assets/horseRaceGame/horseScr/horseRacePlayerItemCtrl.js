

cc.Class({
    extends: cc.Component,

    properties: {
        lab_name : cc.Label,
        lab_coin : cc.Label,
        sprite_head : cc.Sprite,

       
    },

    setPlayDate:function(date){
        this.lab_name.string =  CommonFun.getInstance().getStrByLength( date.nickname, 12);
        this.lab_coin.string = CommonFun.getInstance().numberToShow(date.diamond/100);
        GlobalCfg.ACT_SCENE_CTRL.loadHeadSp(date.imgurl, 80, this.sprite_head);
    },

    

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
