"use strict";
cc._RF.push(module, '9ed3cUCJspHJJyUOOO4vMgB', 'propSkeCtrl');
// ResourcesBundle/NewPlan/GameGifInteraction/propSkeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // onLoad () {},
  // 这里我把骨骼动画的声音的名字跟他的音效的名字都是一样的
  shortmessagenotify: function shortmessagenotify(notify, seatid, node) {
    this.nodeProp = node;
    var skeName = notify.name;
    var targetID = Number(seatid);
    var launchID = Number(notify.sender);
    var self = this;
    var movePos;
    var url = 'skeleton/propSke/' + skeName;
    var startPlayScript = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(launchID);
    var endPlayScript = GlobalCfg.ACT_SCENE_CTRL.getPlayerInfoByUserId(targetID);

    if (CommonFun.getInstance().isValidForScr(startPlayScript) && CommonFun.getInstance().isValidForScr(endPlayScript)) {
      var startPos = startPlayScript.nodePos || startPlayScript.node.getPosition();
      var endPos = endPlayScript.nodePos || endPlayScript.node.getPosition();
      self.node.setPosition(startPos.x, startPos.y);
      self.setSpinePos(skeName, endPlayScript);
      ResourcesBundle.load(url, sp.SkeletonData, function (err, spine) {
        if (err) {
          LoggerUtil.getInstance().log(err.message || err);
          return;
        }

        self.ske = self.node.getComponent(sp.Skeleton);
        self.ske.skeletonData = spine;
        self.ske.premultipliedAlpha = false;

        if (skeName != "hd_huojian01" && skeName != "hd_dapao01") {
          self.ske.setAnimation(0, 'fly', true);
        }
      });
      self.loaderAudioClip(skeName);

      if (skeName == "hd_dapao01") {
        movePos = startPos;
      } else {
        movePos = endPos;
      }

      cc.tween(self.node).to(0.3, {
        position: cc.v2(movePos.x, movePos.y)
      }).call(function () {
        self.ske.setAnimation(0, 'animation', false);

        if (skeName == "hd_dapao01") {
          self.playDaPaoAim(endPos);
        }

        self.ske.setCompleteListener(function (trackEntry, loopCount) {
          var name = trackEntry.animation.name;

          if (name == "animation") {
            self.node.destroy();
          }
        });
      }).start();
    }
  },
  setSpinePos: function setSpinePos(skeName, Ctrl) {
    var curSeat = Ctrl.curSeat;
    var sceneName = cc.director.getScene().name;

    if (sceneName == "7up7down") {
      if (skeName == "hd_huojian01" || skeName == "hd_daocha01") {
        if (curSeat == 1 || curSeat == 2 || curSeat == 5) {
          this.node.scaleX = 1;
        } else if (curSeat == 3 || curSeat == 4 || curSeat == 6) {
          this.node.scaleX = -1;
        }
      } else if (skeName == "hd_shuaibiti01" || skeName == "hd_bingtong01") {
        if (curSeat == 1 || curSeat == 2 || curSeat == 5) {
          this.node.scaleX = -1;
        } else if (curSeat == 3 || curSeat == 4 || curSeat == 6) {
          this.node.scaleX = 1;
        }
      }
    } else if (sceneName == "mundaLobby") {
      if (skeName == "hd_huojian01" || skeName == "hd_daocha01") {
        if (curSeat == 1 || curSeat == 2 || curSeat == 3) {
          this.node.scaleX = -1;
        } else if (curSeat == 4 || curSeat == 5 || curSeat == 6) {
          this.node.scaleX = 1;
        }
      } else if (skeName == "hd_shuaibiti01" || skeName == "hd_bingtong01") {
        if (curSeat == 1 || curSeat == 2 || curSeat == 3) {
          this.node.scaleX = 1;
        } else if (curSeat == 4 || curSeat == 5 || curSeat == 6) {
          this.node.scaleX = -1;
        }
      }
    } else {
      if (skeName == "hd_huojian01" || skeName == "hd_daocha01") {
        if (curSeat == 0 || curSeat == 1 || curSeat == 2) {
          this.node.scaleX = -1;
        } else if (curSeat == 3 || curSeat == 4 || curSeat == 5) {
          this.node.scaleX = 1;
        }
      } else if (skeName == "hd_shuaibiti01" || skeName == "hd_bingtong01") {
        if (curSeat == 0 || curSeat == 1 || curSeat == 2) {
          this.node.scaleX = 1;
        } else if (curSeat == 3 || curSeat == 4 || curSeat == 5) {
          this.node.scaleX = -1;
        }
      }
    }

    if (skeName == "hd_dapao01") {
      this.node.scale = 0.6;
    } else if (skeName == "puke01_xipai02") {
      this.node.scale = 0.5;
    }
  },
  loaderAudioClip: function loaderAudioClip(skeName) {
    var url = "sound/sounProp/" + skeName;
    var time = 0;

    if (skeName == "hd_mtb01") {
      time = 0.5;
    } else if (skeName == "hd_shuaibiti01") {
      time = 1.5;
    } else if (skeName == "hd_huojian01") {
      time = 1;
    }

    this.scheduleOnce(function () {
      ResourcesBundle.load(url, cc.AudioClip, function (err, audioClip) {
        if (!err) {
          GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }
      });
    }, time);
  },
  playDaPaoAim: function playDaPaoAim(endPos) {
    var self = this;
    var url = 'skeleton/propSke/hd_dapao01_end';
    this.scheduleOnce(function () {
      ResourcesBundle.load(url, sp.SkeletonData, function (err, spine) {
        if (err) {
          LoggerUtil.getInstance().log(err.message || err);
          return;
        }

        self.nodeDP = new cc.Node();
        self.nodeDP.scale = 1;
        self.nodeDP.setPosition(endPos.x, endPos.y);
        self.nodeProp.addChild(self.nodeDP);
        self.ske = self.nodeDP.addComponent(sp.Skeleton);
        self.ske.skeletonData = spine;
        self.ske.premultipliedAlpha = false;
        self.ske.setAnimation(0, 'animation', false);
      });
    }, 2);
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();