"use strict";
cc._RF.push(module, '7fa15MgBsZGRp3UdHfxNJXR', 'GameGifInteractionSkeCtrl');
// ResourcesBundle/NewPlan/GameGifInteraction/GameGifInteractionSkeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skleton1: sp.Skeleton,
    skleton2: sp.Skeleton
  },
  ctor: function ctor() {
    this.isNeedDestroy = true;
    this.skeletonData1 = null;
    this.skeletonData2 = null;
  },
  onDestroy: function onDestroy() {
    if (this.skeletonData1) {
      this.skeletonData1.decRef();
      this.skeletonData1 = null;
    }

    ;

    if (this.skeletonData2) {
      this.skeletonData2.decRef();
      this.skeletonData2 = null;
    }

    ;
  },
  playGameGifSkeleton: function playGameGifSkeleton(skeletonName, senderNode, targetNode, parentNode) {
    var _this = this;

    if (cc.isValid(senderNode) && cc.isValid(targetNode)) {
      var checkIsValid = function checkIsValid() {
        if (cc.isValid(targetNode, true) == false) {
          _this.unschedule(checkIsValid);

          _this.node.destroy();

          return;
        }

        ;
      };

      this.schedule(checkIsValid, 0.05);
      var senderNodeWorldPos = senderNode.parent.convertToWorldSpaceAR(new cc.Vec2(senderNode.x, senderNode.y));
      var targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
      var senderNodePos = parentNode.convertToNodeSpaceAR(senderNodeWorldPos);
      var targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);
      this.skleton1.node.setPosition(senderNodePos); // 设置动画朝向

      if (targetNodePos.x < senderNodePos.x) {
        this.skleton1.node.scaleX = 1;
      } else {
        this.skleton1.node.scaleX = -1;
      }

      ;

      if (skeletonName == "hd_shuaibiti01" || skeletonName == "hd_bingtong01") {
        this.skleton1.node.scaleX = -this.skleton1.node.scaleX;
      }

      ;
      LoggerUtil.getInstance().log("playGameGifSkeleton ===================>", targetNodePos.x < senderNodePos.x);
      var skeletonDataPromise = this.getSkeletonData(skeletonName);
      skeletonDataPromise.then(function (skeletonData) {
        if (CommonFun.getInstance().isValidForScr(_this)) {
          _this.skeletonData1 = skeletonData;
          _this.skleton1.node.active = false;
          _this.skleton1.skeletonData = skeletonData;
          _this.skleton1.premultipliedAlpha = false;

          _this.skleton1.setCompleteListener(function (trackEntry, loopCount) {
            var name = trackEntry.animation.name;

            if (name == "animation" && _this.isNeedDestroy == true) {
              _this.node.destroy();
            }

            ;
          });
          /**
           * 设置成fly的状态
           */


          if (skeletonName != "hd_huojian01" && skeletonName != "hd_dapao01") {
            _this.skleton1.node.active = true;

            _this.skleton1.setAnimation(0, 'fly', false);
          }

          ;
          var moveEndPos = null;

          if (skeletonName == "hd_dapao01") {
            moveEndPos = senderNodePos;
          } else {
            moveEndPos = targetNodePos;
          }

          ;

          _this.playAudioClip(skeletonName);

          cc.tween(_this.skleton1.node).to(0.3, {
            position: moveEndPos
          }).call(function () {
            if (skeletonName == "hd_dapao01") {
              _this.isNeedDestroy = false;

              _this.playCannonballAnim(targetNodePos);
            }

            ;
            _this.skleton1.node.active = true;

            _this.skleton1.setAnimation(0, 'animation', false);
          }).start();
        } else {
          skeletonData.decRef();
        }

        ;
      });
    } else {
      this.node.destroy();
    }

    ;
  },
  getSkeletonData: function getSkeletonData(skeletonName) {
    var url = "NewPlan/GameGifInteraction/res/skeleton/" + skeletonName;
    return new Promise(function (resolve, reject) {
      ResourcesBundle.load(url, sp.SkeletonData, function (err, skeletonData) {
        if (err) {
          LoggerUtil.getInstance().log(err);
          reject();
        } else {
          resolve(skeletonData);
        }

        ;
      });
    });
  },
  playCannonballAnim: function playCannonballAnim(moveEndPos) {
    var _this2 = this;

    this.scheduleOnce(function () {
      var skeletonDataPromise = _this2.getSkeletonData("hd_dapao01_end");

      skeletonDataPromise.then(function (skeletonData) {
        if (CommonFun.getInstance().isValidForScr(_this2)) {
          _this2.skleton2.node.setPosition(moveEndPos);

          _this2.skeletonData2 = skeletonData;
          _this2.skleton2.skeletonData = skeletonData;
          _this2.skleton2.premultipliedAlpha = false;

          _this2.skleton2.setAnimation(0, 'animation', false);

          _this2.skleton2.setCompleteListener(function (trackEntry, loopCount) {
            var name = trackEntry.animation.name;

            if (name == "animation") {
              _this2.node.destroy();
            }

            ;
          });
        } else {
          skeletonData.decRef();
        }

        ;
      });
    }, 2);
  },
  playAudioClip: function playAudioClip(skeletonName) {
    var url = "NewPlan/GameGifInteraction/res/sound/" + skeletonName;
    var time = 0;

    if (skeletonName == "hd_mtb01") {
      time = 0.5;
    } else if (skeletonName == "hd_shuaibiti01") {
      time = 1.5;
    } else if (skeletonName == "hd_huojian01") {
      time = 1;
    }

    ;
    this.scheduleOnce(function () {
      ResourcesBundle.load(url, cc.AudioClip, function (err, audioClip) {
        if (!err) {
          GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }
      });
    }, time);
  }
});

cc._RF.pop();