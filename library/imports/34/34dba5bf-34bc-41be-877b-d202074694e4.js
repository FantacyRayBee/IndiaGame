"use strict";
cc._RF.push(module, '34dbaW/NLxBvod70gIHRpTk', 'ChangeHeadCtrl');
// ResourcesBundle/NewPlan/Personal/ChangeHeadCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: {
      "default": null,
      type: cc.Button
    },
    node_content: {
      "default": null,
      type: cc.Node
    },
    prefab_item: {
      "default": null,
      type: cc.Prefab
    }
  },
  ctor: function ctor() {
    this.headItemPrefabArr = [];
  },
  onLoad: function onLoad() {
    var _this = this;
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      _this.node.destroy();
    }, 1), this);
  },
  onDestroy: function onDestroy() {
    for (var i = 0; i < this.headItemPrefabArr.length; i++) {
      var itemPrefab = this.headItemPrefabArr[i];
      itemPrefab.decRef();
      itemPrefab = null;
    }
    ;
  },
  start: function start() {
    var _this2 = this;
    CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGEHEADITEM).then(function (prefab) {
      if (CommonFun.getInstance().isValidForScr(_this2)) {
        _this2.addHeadItems(GlobalCfg.USER_DATAS.avatarList, prefab);
      }
      ;
    });
  },
  addHeadItems: function addHeadItems(avatarList, itemPrefab) {
    var _this3 = this;
    var len = avatarList.length;
    if (len == 0) {
      return;
    }
    ;
    var index = 0;
    var addItem = function addItem() {
      var itemData = avatarList[index];
      itemPrefab.addRef();
      _this3.headItemPrefabArr.push(itemPrefab);
      var item_Node = cc.instantiate(itemPrefab);
      var itemCtrl = item_Node.getComponent('ChangeHeadItemCtrl');
      itemCtrl.setUserHead(itemData, _this3);
      _this3.node_content.addChild(item_Node);
      index += 1;
      if (index == len) {
        _this3.unschedule(addItem);
        return;
      }
      ;
    };
    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  }
});

cc._RF.pop();