"use strict";
cc._RF.push(module, '58d1a1Ye9JJl4xGuFpvlgM+', 'fruitItemCtrl');
// fruitMachine/src/fruitItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skeleton_fruit: sp.Skeleton,
    skeleton_kuang: sp.Skeleton,
    spriteAtlas_icon: cc.SpriteAtlas,
    icon_node: cc.Node
  },
  ctor: function ctor() {
    this.loadBundleName = "fruitMachine";
    this.skeletonUrl = "spine/";
    this.skeletonNameArr = ['pingguo', 'qingmang', 'juzi', 'putao', 'xigua', 'yingtao', 'lingdang', '777', 'bar', 'wild', 'sanyecao'];
    this.skeletonNameArr2 = ['maya_icon_1', //正常元素
    'maya_icon_2' //wild，scarrent元素
    ];
  },
  setFruitSkeletonJing: function setFruitSkeletonJing(type) {
    var _this = this;

    var skeletonName = "";

    if (type < 10) {
      skeletonName = this.skeletonNameArr2[0];
    } else {
      skeletonName = this.skeletonNameArr2[1];
      type = type + 1; //因为spine动画给过来的时候已经给wild元素设置成11了，所以这里要加1
    }

    if (!skeletonName || skeletonName == "") {
      return;
    }

    ;
    this.icon_node.active = false;
    this.skeleton_fruit.node.active = true;
    var spriteName = "icon_" + type * 10;
    this.loadFruitSkeletonData(skeletonName, function (skeletonData, self) {
      if (self && _this.skeleton_fruit) {
        _this.skeleton_fruit.skeletonData = skeletonData;

        _this.skeleton_fruit.setAnimation(0, spriteName, false);
      }

      ;
    }, this);
    var spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);

    if (!spriteFrame) {
      return;
    }

    ;
    this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    this.skeleton_fruit.node.active = false;
    this.icon_node.active = true;
  },
  setFruitSkeletonDong: function setFruitSkeletonDong() {
    if (this.skeleton_fruit) {
      this.icon_node.active = false;
      this.skeleton_fruit.node.active = true; // this.skeleton_fruit.addAnimation(0, 'dong', false);
    }

    ;
  },
  setKuangSkeletonDong: function setKuangSkeletonDong() {
    if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
      this.skeleton_kuang.node.active = true;
      this.skeleton_fruit.node.active = true;
      this.skeleton_kuang.setAnimation(0, 'animation', true);
    }

    ;
  },
  setCloseSkeletonDong: function setCloseSkeletonDong(time) {
    var _this2 = this;

    if (time === void 0) {
      time = 2;
    }

    this.scheduleOnce(function () {
      _this2.skeleton_fruit.node.active = false;
      _this2.icon_node.active = true;

      if (_this2 && _this2.skeleton_kuang) {
        _this2.skeleton_kuang.node.active = false;
      }

      ;
    }, time);
  },
  loadGameAssets: function loadGameAssets(gameBundleName, func, target) {
    if (gameBundleName) {
      CommonFun.getInstance().loadBundle(gameBundleName, function (bundle) {
        func && func(bundle, target);
      }, function (err) {
        LoggerUtil.getInstance().error(err);
      });
    }
  },
  loadFruitSkeletonData: function loadFruitSkeletonData(skeletonName, func, target) {
    if (func === void 0) {
      func = null;
    }

    if (target === void 0) {
      target = null;
    }

    if (!skeletonName || skeletonName.length == 0) {
      return;
    }

    ;
    var self = this;
    this.loadGameAssets(self.loadBundleName, function (bundle, target) {
      bundle.load(self.skeletonUrl + skeletonName, sp.SkeletonData, function (err, skeletonData) {
        if (!err) {
          func && func(skeletonData, target);
        }
      });
    }, target);
  }
});

cc._RF.pop();