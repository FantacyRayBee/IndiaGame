"use strict";
cc._RF.push(module, '23ccccc+gNH6LafXiESWAQ1', 'firstCtrl');
// ResourcesBundle/NewPlan/Pdd/Scripts/firstCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {},
  onLoad: function onLoad() {
    this.initNode();
  },
  start: function start() {},
  initNode: function initNode() {},
  initNode_1: function initNode_1() {
    var _this = this;

    this.node_1 = this.node.getChildByName("node_1");
    this.choudai = this.node_1.getChildByName("choudai");
    this.lab_name_1 = this.choudai.getChildByName("lab_name").getComponent(cc.Label);
    this.btn_openNode = this.node_1.getChildByName("btn_open").getComponent(cc.Button);
    this.btn_openNode.node.on('click', this.btnClick, this);
    this.node_ske = this.node.getChildByName("node_1_ske").getComponent(sp.Skeleton);
    this.node_ske.setAnimation(0, "chuxian", false);
    this.node_ske.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;

      if (name == "chuxian") {
        _this.node_ske.setAnimation(0, "chixu", true);
      } else if (name == "kai") {
        _this.node_ske.setAnimation(0, "kai_chixu", true);
      } else if (name == "bianchang") {
        _this.node_ske.setAnimation(0, "bianchang_chixu", true);
      }
    });
  },
  initNode_2: function initNode_2() {
    this.node_2 = this.node.getChildByName("node_2");
    this.zhiNode_2 = this.node_2.getChildByName("zhi");
    this.txNode = this.zhiNode_2.getChildByName("tx_node").getChildByName("tx");
    this.lab_name_2 = this.zhiNode_2.getChildByName("lab_name").getComponent(cc.Label);
    this.lab_gold_2 = this.zhiNode_2.getChildByName("lab_gold").getComponent(cc.Label);
    this.lab_gold_2.string = "150.00";
    this.bg_ts_1 = this.node_2.getChildByName("bg_ts_1");
    this.bg_ts_1.position = cc.v2(0, -295); //设置位置,之后上移至(0，-255)

    this.bg_ts_1.active = false;
    this.bg_ts_2 = this.node_2.getChildByName("bg_ts_2");
    this.bg_ts_1.active = false;
    this.qipaoPlus = this.node_2.getChildByName("qipao");
    this.qipaoPlus.position = cc.v2(280, -280); // 设置位置，之后移动至(8,50)，缩小至0.7

    this.qipaoPlus.scale = 1;
    this.qipaoPlus.active = false;
  },
  initNode_3: function initNode_3() {
    this.node_3 = this.node.getChildByName("node_3");
    this.zhiNode_3 = this.node_3.getChildByName("zhi");
    this.zhiNode_3.height = 436; // 后续拉伸至 536

    this.content = this.zhiNode_3.getChildByName("scrollView").getChildByName("view").getChildByName("content"); // this.content.removeAllChildren();

    this.lab_gold_3 = this.zhiNode_3.getChildByName("lab_gold").getComponent(cc.Label);
    this.lab_gold_3.string = "0.00";
    this.btn_proceed = this.node_3.getChildByName("btn_proceed").getComponent(cc.Button);
    this.btn_proceed.node.on('click', this.btnClick, this);
    this.btn_proceed.node.active = false;
    this.bg_zj = this.node_3.getChildByName("bg_zj"); // 向上移动至（0，220）

    this.bg_zj.active = false;
    this.node_ske_star = this.node_3.getChildByName("node_ske_star").getComponent(sp.Skeleton);
    this.node_ske_hengfu = this.node_3.getChildByName("node_ske_hengfu").getComponent(sp.Skeleton);
    this.node_ske_hengfu.node.active = false;
  },
  initCongratulation: function initCongratulation() {
    this.bg_congratulation = this.node.getChildByName("bg_congratulation");
    this.lab_gold_c = this.bg_congratulation.getChildByName("lab_gold").getComponent(cc.Label);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    console.log("btnClick", button.node.name);
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (btnName == "btn_open") {
      this.openRedPack();
    } else if (btnName == "btn_proceed") {
      var self = this;
      ResourcesBundle.load('NewPlan/Pdd/prefab/setBankInFirst', function (err, prefab) {
        if (err) {
          console.error("预制体生成错误！");
          return;
        } else {
          var nodeSetBank = cc.instantiate(prefab);
          self.node.addChild(nodeSetBank);
          nodeSetBank.getComponent("setBankInFirstCtrl").init(self);
        }
      });
    }
  },
  // init 传入数据初始化
  setData: function setData(data) {
    data = {
      quota: 59900,
      used_count: 0,
      remain_count: 3,
      unclaimed: 59900,
      double_card: 0,
      address: ""
    };
    console.log("PDD", data);
    this.data = data;
    this.initNode_1();
    this.initNode_2();
    this.node_1.active = true;
    this.node_2.active = false;
    this.lab_name_1.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 6);
    this.lab_name_2.string = GlobalCfg.USER_DATAS.userName;
    this.flyPlusCount = 0; // 飞加号气泡

    this.quota = this.data.quota / 100;
    this.unclaimed = (data.unclaimed / 100).toFixed(2); // this.lab_glod_2.string = "₹ " + (this.data.quota / 100) + ".00";

    this.playPddSound("show", false);
  },
  openRedPack: function openRedPack() {
    var _this2 = this;

    this.node_ske.setAnimation(0, "kai", false);
    this.playPddSound("firstShowRedPacket", false);
    this.node_1.active = false;
    setTimeout(function () {
      _this2.skeKaiCallback();
    }, 200);
  },
  skeKaiCallback: function skeKaiCallback() {
    this.node_2.active = true;
    this.showFirstTip();
  },
  showFirstTip: function showFirstTip() {
    var _this3 = this;

    this.bg_ts_1.active = true;
    setTimeout(function () {
      _this3.movePlusToAdd();
    }, 500);
  },
  showSecondTip: function showSecondTip() {
    var _this4 = this;

    this.bg_ts_2.active = true;
    setTimeout(function () {
      _this4.movePlusToAdd();
    }, 500);
  },
  movePlusToAdd: function movePlusToAdd() {
    this.qipaoPlus.position = cc.v2(280, -280);
    this.qipaoPlus.scale = 1;
    this.qipaoPlus.opacity = 255;
    this.qipaoPlus.active = true;
    this.finishMovePlus = cc.callFunc(function (target, value) {
      // 在这里根据给定不同的初始待领取值，来分配
      var gold = value;
      var stageGold = gold;

      if (this.flyPlusCount == 0) {
        var stageGoldObj = {
          "399": 300,
          "499": 400,
          "599": 500,
          "799": 600
        };

        for (var key in stageGoldObj) {
          if (Object.hasOwnProperty.call(stageGoldObj, key)) {
            var element = stageGoldObj[key];

            if (gold == key) {
              stageGold = element;
            }
          }
        }
      }

      this.flyPlusCount++;
      var startGold = Number(this.lab_gold_2.string);
      this.danceLabel(stageGold, startGold);
    }, this, this.quota - 1);
    this.playPddSound("plus", false);
    var bezierTo_1 = cc.bezierTo(1, [cc.v2(280, -250), cc.v2(38, 50), cc.v2(8, 50)]);
    var spawn = cc.sequence(cc.spawn(bezierTo_1.easing(cc.easeSineInOut()), cc.scaleTo(1, 0.7, 0.7)), cc.fadeOut(0.5), this.finishMovePlus);
    this.qipaoPlus.runAction(spawn);
  },
  danceLabel: function danceLabel(toNum, fromNum) {
    this.toNum = toNum; // 跳动到达的金额

    this.startGold = fromNum; // 跳动起始的金额

    var sc = cc.director.getScheduler(); // console.log("当前游戏帧率：",cc.director.getAnimationInterval());
    // console.log("当前游戏帧率2：",cc.game.getFrameRate());

    sc.enableForTarget(this);
    this.playPddSound("addNum", false);
    sc.schedule(this.updateLabel, this, 0, cc.macro.REPEAT_FOREVER, 0, false);
  },
  updateLabel: function updateLabel(dt) {
    var end = Number(this.toNum);
    var start = Number(this.startGold);
    var curFrameRate = cc.game.getFrameRate();
    var cha = Math.ceil((end - start) / curFrameRate * 100) / 100;
    var num = Number(this.lab_gold_2.string);

    if (num + cha >= end) {
      this.lab_gold_2.string = "" + end.toFixed(2); // console.log('/\/\/\/\/', end, this.lab_gold_2.string);

      this.stopDanceLabel();
    } else {
      num += cha;
      this.lab_gold_2.string = "" + num.toFixed(2);
    }
  },
  stopDanceLabel: function stopDanceLabel() {
    var _this5 = this;

    var sc = cc.director.getScheduler();
    sc.unschedule(this.updateLabel, this);
    console.log("this.flyPlusCount:::::::", this.flyPlusCount);

    switch (this.flyPlusCount) {
      case 1:
        this.showSecondTip();
        cc.tween(this.bg_ts_1).to(0.5, {
          position: cc.v2(0, -255)
        }).start();
        break;

      case 2:
        // show Node_3
        setTimeout(function () {
          _this5.showNode_3();
        }, 500);
        break;

      default:
        break;
    }
  },
  showNode_3: function showNode_3() {
    var _this6 = this;

    this.initNode_3();
    this.lab_gold_3.string = this.lab_gold_2.string;
    this.node_2.active = false;
    this.node_ske.setAnimation(0, "bianchang", false);
    setTimeout(function () {
      _this6.showBianchangCallback();
    }, 300);
  },
  showBianchangCallback: function showBianchangCallback() {
    var _this7 = this;

    this.node_3.active = true;
    this.playPddSound("star", false);
    var spr_tx = this.bg_zj.getChildByName('tx_mask').getChildByName('tx').getComponent(cc.Sprite);
    var lab_name = this.bg_zj.getChildByName('lab_name').getComponent(cc.Label);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 36, spr_tx);
    lab_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 6);
    var lab_gold = this.bg_zj.getChildByName('lab_gold').getComponent(cc.Label); // 待领取的金额

    lab_gold.string = "₹ " + Number(this.unclaimed).toFixed(2);
    this.bg_zj.active = true;
    this.bg_zj.setPosition(cc.v2(0, 0));
    var self = this;
    cc.tween(this.bg_zj).to(0.5, {
      position: cc.v2(0, 205)
    }).to(0.5, {
      scale: 0.6,
      opacity: 0
    }).call(function () {
      _this7.bg_zj.active = false;
      ResourcesBundle.load('NewPlan/Pdd/prefab/exhibitionItem', function (err, prefab) {
        if (err) {
          console.error("pdd First item 预制体生成错误！");
          return;
        } else {
          self.addPddItem(prefab);
        }
      });
    }).start();
  },
  addPddItem: function addPddItem(prefab) {
    var pab_pddItem = cc.instantiate(prefab);
    pab_pddItem.getChildByName("icon_lucky").active = true;
    var spr_tx = pab_pddItem.getChildByName('tx_small').getComponent(cc.Sprite);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 36, spr_tx);
    var lab_name = pab_pddItem.getChildByName('lab_name').getComponent(cc.Label);
    lab_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 6);
    this.content.addChild(pab_pddItem, 1, "selfItem");

    for (var i = 0; i < this.content.childrenCount - 1; i++) {
      var element = this.content.children[i];
      element.zIndex = i + 1;
    }

    this.content.getChildByName("selfItem").zIndex = 0;
    console.log("this.content.childrenCount:::", this.content);
    this.btn_proceed.node.active = true;
    this.node_ske_star.node.active = true;
    this.node_ske_star.setAnimation(0, "chixu", false);
    this.node_ske_star.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;

      if (name == "chixu") {}
    });
    this.node_ske_hengfu.node.active = true;
    this.node_ske_hengfu.setAnimation(0, "animation", false);
    var lan_unclaimed = cc.find("ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:hengfu/lan_unclaimed", this.node_ske_hengfu.node);
    lan_unclaimed.getComponent(cc.Label).string = this.unclaimed;
    var lab_quota = cc.find("ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:hengfu/lab_quota", this.node_ske_hengfu.node);
    lab_quota.getComponent(cc.Label).string = "₹ " + Number(this.quota);
    lab_quota.parent.active = true;
    this.node_ske_hengfu.setCompleteListener(function (trackEntry, loopCount) {
      lab_quota.parent.active = false;
    });
  },
  update: function update(dt) {},
  playPddSound: function playPddSound(soundName, isLoop) {
    if (isLoop === void 0) {
      isLoop = false;
    }

    soundName = "pddSound/" + soundName;
    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources(soundName, isLoop);
  }
});

cc._RF.pop();