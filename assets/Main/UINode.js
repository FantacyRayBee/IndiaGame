cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.assetCount = 2;
        this.assetBundle = null;
    },
      //定义添加按钮点击事件
    addClickTouch: function (btnNames,parent,context) {
        var dataType = Object.prototype.toString.call(btnNames);
        var btn = null;
        if (dataType == "[object Null]") {
            btn = context.node;
            btn.on('click', context.btnClick, context);
            return btn;
        } 
        else if (dataType === "[object Array]") {
            for (let index = 0; index < btnNames.length; index++) {
                const element = btnNames[index];
                if (parent.node) {
                    parent.node.getChildByName(element).on('click', parent.btnClick, parent);
                } 
                else {
                    parent.getChildByName(element).on('click', context.btnClick, context);
                }
            }
        }
        else if (dataType === "[object String]") {
            if (parent.node) {
                btn = parent.node.getChildByName(btnNames);
                btn.on('click', parent.btnClick, parent);
            } 
            else {
                btn = parent.getChildByName(btnNames);
                btn.on('click', context.btnClick, context);
            }
            return btn;
        }
    },
    
    //UI入场动画表现
    showViewAction: function (isAct) {
        if (isAct === null || isAct === undefined) {
            isAct = true;
        }
        var rootNode = this.node.getChildByName('root');
        if (isAct) {
            rootNode.scale = 0;
            cc.tween(rootNode)
                .to(0.12, { scale: 1.15 })
                .to(0.03, { scale: 1 })
                .start()
        } else {
            
        }
    },
    //UI出场动画表现
    closeViewAction: function (isAct) {
        if (isAct === null || isAct === undefined) {
            isAct = true;
        }
        var rootNode = this.node.getChildByName('root');
        if (isAct) {
            cc.tween(rootNode)
                .to(0.12, { scale: 0 })
                .call(() => { this.node.destroy(); })
                .start()
        } else {
            this.node.destroy();
        }
    },
    //添加加载头像
    loadHeadSp: function (headUrl,realWidth,heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl,{ext: '.png'}, (err, texture) => {
                if(!err && cc.isValid(this) && cc.isValid(heaSprite)){
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth/heaSprite.node.width);
                }
            });
        }
    },
     //退出房间请求
    exitGameReq: function () {
        GameServerManager.send("gameservice.exitgamereq", "ExitGameReq", {});
    },

    //从游戏中出到大厅
    exitGameResp: function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
    },
});