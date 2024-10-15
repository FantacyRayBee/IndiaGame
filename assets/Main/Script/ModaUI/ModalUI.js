cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.mask.scaleX = 3;
        this.mask.scaleY = 3;
        this.addMask();
    },

    start(){
    },

    addMask:function(){
        var self = this;
            if (!self.mask) {
                return;
            }
        var maskName = self.mask.getComponent(cc.Sprite);
        if (!maskName || maskName.spriteFrame) {
                return
        } else if (maskName) {
            ResourcesBundle.load("bg/mask", cc.SpriteFrame, function(err, spFrame) {
                if (err) {
                    LoggerUtil.getInstance().log(err.message || err);
                    return;
                }
                if (self.node == null) {
                    return;
                }
                maskName.spriteFrame = spFrame;
            });
        }
    },

  

    onEnable: function () {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
        this.mask.on(cc.Node.EventType.MOUSE_WHEEL, function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function () {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
        this.mask.off(cc.Node.EventType.MOUSE_WHEEL, function (event) {
            event.stopPropagation();
        });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
