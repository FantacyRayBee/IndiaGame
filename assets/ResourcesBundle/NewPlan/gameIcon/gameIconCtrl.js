cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
        btn_click: cc.Button,
    },

    ctor: function() {
    },

    setItemData: function(itemID, isVertical, parentIndex) {
        this.gameId = itemID;
        this.isVertical = isVertical;
        this.parentIndex = parentIndex;
        let spriteName = itemID;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        this.btn_click.node.on('click', this.debounce(this.onClick, 2), this);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    onClick: function() {
        CommonFun.getInstance().showGameWebview(this.gameId, this.isVertical, this.parentIndex);
    },

    debounce: function(action, delayTime) {  
        if (!delayTime) {
            return action;
        }
        let fn = function() { 
            let btnNode = arguments[0].node;
            if (!btnNode.timeOut) {
                action.apply(this, arguments);
                btnNode.timeOut = setTimeout(function() { 
                    if (btnNode) {
                        clearTimeout(btnNode.timeOut);
                        btnNode.timeOut = null;
                    }; 
                }, delayTime * 1000);  
            }
        };
        return fn;
    }, 
});
