"use strict";
cc._RF.push(module, 'f57f5X7kktB054RBvyeGGnz', 'UINode');
// Main/UINode.js

"use strict";

cc.Class({
  "extends": cc.Component,
  ctor: function ctor() {
    this.assetCount = 2;
    this.assetBundle = null;
  },
  //定义添加按钮点击事件
  addClickTouch: function addClickTouch(btnNames, parent, context) {
    var dataType = Object.prototype.toString.call(btnNames);
    var btn = null;
    if (dataType == "[object Null]") {
      btn = context.node;
      btn.on('click', context.btnClick, context);
      return btn;
    } else if (dataType === "[object Array]") {
      for (var index = 0; index < btnNames.length; index++) {
        var element = btnNames[index];
        if (parent.node) {
          parent.node.getChildByName(element).on('click', parent.btnClick, parent);
        } else {
          parent.getChildByName(element).on('click', context.btnClick, context);
        }
      }
    } else if (dataType === "[object String]") {
      if (parent.node) {
        btn = parent.node.getChildByName(btnNames);
        btn.on('click', parent.btnClick, parent);
      } else {
        btn = parent.getChildByName(btnNames);
        btn.on('click', context.btnClick, context);
      }
      return btn;
    }
  },
  //UI入场动画表现
  showViewAction: function showViewAction(isAct) {
    if (isAct === null || isAct === undefined) {
      isAct = true;
    }
    var rootNode = this.node.getChildByName('root');
    if (isAct) {
      rootNode.scale = 0;
      cc.tween(rootNode).to(0.12, {
        scale: 1.15
      }).to(0.03, {
        scale: 1
      }).start();
    } else {}
  },
  //UI出场动画表现
  closeViewAction: function closeViewAction(isAct) {
    var _this = this;
    if (isAct === null || isAct === undefined) {
      isAct = true;
    }
    var rootNode = this.node.getChildByName('root');
    if (isAct) {
      cc.tween(rootNode).to(0.12, {
        scale: 0
      }).call(function () {
        _this.node.destroy();
      }).start();
    } else {
      this.node.destroy();
    }
  },
  //添加加载头像
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this2 = this;
    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this2) && cc.isValid(heaSprite)) {
          heaSprite.spriteFrame = new cc.SpriteFrame(texture);
          heaSprite.node.setScale(realWidth / heaSprite.node.width);
        }
      });
    }
  },
  //退出房间请求
  exitGameReq: function exitGameReq() {
    GameServerManager.send("gameservice.exitgamereq", "ExitGameReq", {});
  },
  //从游戏中出到大厅
  exitGameResp: function exitGameResp() {
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
  }
});

cc._RF.pop();