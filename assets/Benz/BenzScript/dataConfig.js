// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        autoAltas: cc.SpriteAtlas,
        logoSpriteArr:[cc.SpriteFrame]
    },

    ctor() {
        this.showNodePos = [cc.v2(0, 247), cc.v2(80, 247), cc.v2(160, 247), cc.v2(240, 247),           //上边
        cc.v2(240, 163), cc.v2(240, 83), cc.v2(240, 3), cc.v2(240, -77), cc.v2(240, -157), cc.v2(240, -237),        //右边
        cc.v2(160, -237), cc.v2(80, -237), cc.v2(0, -237), cc.v2(-80, -237), cc.v2(-160, -237), cc.v2(-240, -237),      //下边
        cc.v2(-240, -157), cc.v2(-240, -77), cc.v2(-240, 3), cc.v2(-240, 83), cc.v2(-240, 163),cc.v2(-240, 247),    //左边
        cc.v2(-160, 247), cc.v2(-80, 247)
        ];
        this.logoTypeArr = [8, 2, 3, 6,
            1, 4, 7, 2, 3, 5,
            1, 4, 8, 2, 3, 6,
            1, 4, 7, 2, 3, 5,
            1, 4];
    },

    onLoad() {

    },

    start() {

    },

    initLogo: function (logoPab, parentNode) {
        this.logoArr = [];
        for (let i = 0; i < this.showNodePos.length; i++) {
            const pos = this.showNodePos[i];
            let logo = cc.instantiate(logoPab);
            let spriteLogo = logo.getChildByName("logo").getComponent(cc.Sprite);
            // let key = this.getLogoString(this.logoTypeArr[i]);
            // spriteLogo.spriteFrame = this.autoAltas.getSpriteFrame(key);
            spriteLogo.spriteFrame = this.logoSpriteArr[this.logoTypeArr[i] - 1];
            // LoggerUtil.getInstance().log("精灵帧：",key,spriteLogo);
            let obj = { node: logo, logoType: this.logoTypeArr[i], index:i}
            this.logoArr.push(obj);
            logo.setPosition(pos);
            logo.setParent(parentNode);
        }
    },

    setLogoOpacity:function(index,opacity,blink = false){
        this.logoArr[index].node.getComponent("selectedCtrl").setSelfOpacity(opacity,blink);
    },

    changeLogo:function (index,bActive) {
        this.logoArr[index].node.getChildByName("spr_selected").active = bActive;
    },

    getType:function (index) {
        return this.logoArr[index].logoType;
    },

    getIndexOf(type){
        let arr = []
        for (let index = 0; index < this.logoTypeArr.length; index++) {
            if(this.logoTypeArr[index] == type){
                arr.push(index)
            }
        }
        return arr[Math.ceil(Math.random()*arr.length)-1]
    },

    getLogoString(type) {
        let _str;
        switch (type) {
            case 1:
                _str = "logo_small_08"
                break;
            case 2:
                _str = "logo_small_07"
                break;
            case 3:
                _str = "logo_small_06"
                break;
            case 4:
                _str = "logo_small_05"
                break;
            case 5:
                _str = "logo_small_04"
                break;
            case 6:
                _str = "logo_small_03"
                break;
            case 7:
                _str = "logo_small_02"
                break;
            case 8:
                _str = "logo_small_01"
                break;
            default:
                break;
        }

        return _str
    },
    // update (dt) {},
});
