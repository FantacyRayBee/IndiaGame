"use strict";
cc._RF.push(module, '58d1a1Ye9JJl4xGuFpvlgM+', 'fruitItemCtrl');
// fruitMachine/src/fruitItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skeleton_fruit: sp.Skeleton,
    skeleton_kuang: sp.Skeleton
  },
  ctor: function ctor() {
    this.loadBundleName = "fruitMachine";
    this.skeletonUrl = "skeleton/";
    this.skeletonNameArr = ['pingguo', 'qingmang', 'juzi', 'putao', 'xigua', 'yingtao', 'lingdang', '777', 'bar', 'wild', 'sanyecao'];
  },
  setFruitSkeletonJing: function setFruitSkeletonJing(type) {
    var skeletonName = this.skeletonNameArr[type - 1];
    if (!skeletonName) {
      return;
    }
    ;
    this.loadFruitSkeletonData(skeletonName, function (skeletonData, self) {
      if (self && self.skeleton_fruit) {
        self.skeleton_fruit.skeletonData = skeletonData;
        self.skeleton_fruit.setAnimation(0, 'jing', false);
      }
      ;
    }, this);
  },
  setFruitSkeletonDong: function setFruitSkeletonDong() {
    if (this.skeleton_fruit) {
      this.skeleton_fruit.addAnimation(0, 'dong', false);
    }
    ;
  },
  setKuangSkeletonDong: function setKuangSkeletonDong() {
    if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
      this.skeleton_kuang.node.active = true;
      this.skeleton_kuang.setAnimation(0, 'animation', true);
    }
    ;
  },
  setCloseSkeletonDong: function setCloseSkeletonDong(time) {
    var _this = this;
    if (time === void 0) {
      time = 2;
    }
    this.scheduleOnce(function () {
      if (_this && _this.skeleton_fruit) {
        _this.skeleton_fruit.setAnimation(0, 'jing', false);
      }
      ;
      if (_this && _this.skeleton_kuang) {
        _this.skeleton_kuang.node.active = false;
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