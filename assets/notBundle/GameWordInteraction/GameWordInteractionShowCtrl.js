cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: cc.Label,
        sprite_face: cc.Sprite,
        node_word: cc.Node,
        node_face: cc.Node,
    },

    ctor: function() {
        this.face_spriteFrame = null;
    },

    onDestroy: function() {
        if (this.face_spriteFrame) {
            this.face_spriteFrame.decRef();
            this.face_spriteFrame = null;
        };
    },

    setGameWordInteraction: function(type, name, targetNode, offset, parentNode) {
        if (type == 0) {
            this.dealWordShow(name, targetNode, offset, parentNode);
        }
        else if (type == 1) {
            this.dealFaceShow(name, targetNode, offset, parentNode);
        };

        let checkIsValid = () => {
            if (cc.isValid(targetNode, true) == false) {
                this.unschedule(checkIsValid);
                this.node.destroy();
                return;
            };
        };
        this.schedule(checkIsValid, 0.05);
    },

    dealWordShow(name, targetNode, offset, parentNode) {
        this.node_face.active = false;
        this.node_word.active = true;
        this.lab_content.string = name;

        let targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
        let targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);
        this.node_word.setPosition(targetNodePos.x + offset.x, targetNodePos.y + offset.y);

        let labWidth = this.lab_content.node.width;
        this.lab_content.node.setPosition(cc.v2(155, 7));
        cc.tween(this.lab_content.node)
        .to(3, {position: cc.v2(-155 - labWidth, 7)})
        .call(() => {
            this.node.destroy();
        })
        .start()
    },

    dealFaceShow(name, targetNode, offset, parentNode) {
        this.node_face.active = true;
        this.node_word.active = false;

        let targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
        let targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);

        this.node_face.setPosition(targetNodePos.x + offset.x, targetNodePos.y + offset.y);
        ResourcesBundle.load(`NewPlan/GameWordInteraction/face/${name}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    spriteFrame.addRef();
                    this.face_spriteFrame = spriteFrame;
                    this.sprite_face.spriteFrame = spriteFrame;
                }
                else {
                    spriteFrame.addRef();
                    spriteFrame.decRef();
                    spriteFrame = null;
                };
            }
            else {
                LoggerUtil.getInstance().error(err);
            };
        });
        cc.tween(this.node_face)
        .repeat(4, cc.tween().by(0.5, {position: cc.v2(0, -5)}).by(0.5, {position: cc.v2(0,5)}))
        .call(() => {
            this.node.destroy();
        })
        .start()
    },
});
