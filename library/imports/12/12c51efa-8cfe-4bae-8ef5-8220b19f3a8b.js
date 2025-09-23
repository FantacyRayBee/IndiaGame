"use strict";
cc._RF.push(module, '12c5176jP5Lro71giCxnzqL', 'pddRedPackCtrl');
// notBundle/Pdd/Scripts/pddRedPackCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    btn_closeAll: cc.Button
  },
  ctor: function ctor() {
    this.isStopTimer = false;
    this.ifStopBtnLabTimer = false;
  },
  onLoad: function onLoad() {
    this.btn_closeAll.node.on('click', this.btnClick, this);
    this.turnTableCtrl = this.node.parent.getComponent("turnTableCtrl");
    this.mask = this.node.getChildByName("mask");
  },
  start: function start() {},
  // update (dt) {},

  // 红包
  initNodeRedPack: function initNodeRedPack(data) {
    var _this = this;
    this.nodeRedPack = this.node.getChildByName('nodeRedPack');
    this.lab_num_nodeRedPack = this.nodeRedPack.getChildByName('lab_num').getComponent(cc.Label);
    this.lan_numOn = this.nodeRedPack.getChildByName('lab_numOn').getComponent(cc.Label);
    this.lab_num_nodeRedPack.string = (data.award.number / 100).toFixed(2);
    this.lan_numOn.string = data.award.number / 100;
    this.btn_hongbao = this.nodeRedPack.getChildByName('hongbao').getComponent(cc.Button);
    this.btn_hongbao.node.on('click', this.btnClick, this);
    if (data["double"] == true) {
      //双倍模式
      this.ske_huojian = this.node.getChildByName('node_ske_huojian').getComponent(sp.Skeleton);
      this.playPddSound("huojian", false);
      this.ske_huojian.node.active = true;
      this.ske_huojian.setAnimation(0, 'animation', false);
      this.ske_huojian.setCompleteListener(function (trackEntry) {
        _this.ske_huojian.node.active = false;
        _this.initLucky(data);
      });
    } else {
      this.nodeRedPack.active = true;
    }
  },
  // 双倍卡
  initNodeDoubleCard: function initNodeDoubleCard(data) {
    var _this2 = this;
    this.nodeDoubleCard = this.node.getChildByName('nodeDoubleCard');
    this.nodeDoubleCard.active = true;
    if (data.give_count == 3) {
      // 赠送次数
      setTimeout(function () {
        _this2.nodeDoubleCard.active = false;
        _this2.initNodeZhuanpan(data);
        // this.closeNodeAfterTime(8);
      }, 1000);
    } else {
      this.closeNodeAfterTime(8);
      this.btn_closeAll.node.active = true;
    }
  },
  // 额外 3 次转盘机会
  initNodeZhuanpan: function initNodeZhuanpan(data) {
    this.nodeZhuanpan = this.node.getChildByName('nodeZhuanpan');
    this.btn_getCishu = this.nodeZhuanpan.getChildByName('btn_getCishu').getComponent(cc.Button);
    this.lab_time_cishu = this.btn_getCishu.target.getChildByName('Label').getComponent(cc.Label); // 倒计时
    this.lab_time_cishu.string = "8S";
    this.closeAfertTime(this.node, 8, this.lab_time_cishu);
    this.turnTableCtrl.endShowCallback();
    this.nodeZhuanpan.active = true;
    this.btn_getCishu.node.on('click', this.btnClick, this);
  },
  // 翻倍，
  initLucky: function initLucky(data) {
    this.nodeLucky = this.node.getChildByName('nodeLucky');
    this.btn_exchange = this.nodeLucky.getChildByName('btn_exchange').getComponent(cc.Button);
    this.lab_time_exchange = this.btn_exchange.target.getChildByName('Label').getComponent(cc.Label); // 倒计时
    this.lab_time_exchange.string = "8S";
    this.closeAfertTime(this.node, 8, this.lab_time_exchange);
    this.btn_exchange.node.on('click', this.btnClick, this);
    this.nodeLucky.active = true;
  },
  // 幸运卡
  initNodeLuckyCard: function initNodeLuckyCard() {
    this.nodeLuckyCard = this.node.getChildByName('nodeLuckyCard');
    this.nodeLuckyCard.active = true;
    this.closeNodeAfterTime(8);
    this.btn_closeAll.node.active = true;
  },
  // 金币
  initNodeGetTenCoin: function initNodeGetTenCoin(data) {
    this.nodeGetTenCoin = this.node.getChildByName('nodeGetTenCoin');
    this.lab_numCoin = this.nodeGetTenCoin.getChildByName('lab_numCoin').getComponent(cc.Label);
    this.lab_curCoin = this.nodeGetTenCoin.getChildByName('lab_curCoin').getComponent(cc.Label);
    this.lab_curCoin.string = this.getFloatNum(data.gold_coin_after / 100); //当前金币总额
    this.lab_numCoin.string = this.getFloatNum(data.award.number / 100); //获得金币数量

    if (data.convert_coin == true) {
      this.initNodeCongra(data);
    } else {
      this.closeNodeAfterTime(8);
      this.btn_closeAll.node.active = true;
      this.nodeGetTenCoin.active = true;
    }
    this.turnTableCtrl.endShowCallback();
  },
  // 提现
  initNodeCongra: function initNodeCongra(data) {
    this.nodeCongra = this.node.getChildByName('nodeCongra');
    this.tx_node = this.nodeCongra.getChildByName('tx_node');
    this.tx_sprite = this.tx_node.getChildByName('tx').getComponent(cc.Sprite);
    this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 140, this.tx_sprite);
    this.lab_name = this.nodeCongra.getChildByName('bg_nc').getChildByName('lab_name').getComponent(cc.Label);
    this.lab_name.string = GlobalCfg.USER_DATAS.userName;
    this.lab_getGoldNum = this.nodeCongra.getChildByName('lab_getGoldNum').getComponent(cc.Label);
    this.lab_getGoldNum.string = data.unclaimed_after / 100;
    this.btn_close = this.nodeCongra.getChildByName('btn_close').getComponent(cc.Button);
    this.btn_close.node.on('click', this.btnClick, this);
    this.btn_withdraw = this.nodeCongra.getChildByName('btn_withdraw').getComponent(cc.Button);
    this.btn_withdraw.node.on('click', this.btnClick, this);
    this.nodeCongra.active = true;
  },
  btnClick: function btnClick(button) {
    var _this3 = this;
    var btnName = button.node.name;
    if (btnName == 'btn_getCishu') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.closeAfertTime(this.node, 0, this.lab_time_cishu);
    } else if (btnName == 'btn_exchange') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.turnTableCtrl.endShowCallback();
      this.closeAfertTime(this.node, 0, this.lab_time_exchange);
    } else if (btnName == 'hongbao') {
      // 红包,点击撒货币
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.mask.active = false;
      var light_ske = this.nodeRedPack.getChildByName('light_ske');
      var caidai_ske = this.nodeRedPack.getChildByName('caidai_ske');
      caidai_ske.active = false;
      light_ske.active = false;
      cc.tween(this.node).to(0.5, {
        scale: 0.5,
        position: cc.v2(-420, 180),
        opacity: 0
      }, {
        easing: 'sineInOut'
      }).call(function () {
        _this3.turnTableCtrl.endShowCallback();
        _this3.node.destroy();
      }).start();
    } else if (btnName == 'btn_close') {
      // 关闭
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    } else if (btnName == 'btn_withdraw') {
      // 提现
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.turnTableCtrl.changeBankInfo();
    } else if (btnName == 'btn_closeAll') {
      // 关闭所有
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.closeNodeAfterTime(0);
    }
  },
  closeNodeAfterTime: function closeNodeAfterTime(time) {
    var _this4 = this;
    if (time == 0) {
      this.isStopTimer = true;
      this.node.destroy();
    } else {
      setTimeout(function () {
        console.log("执行了 closeNodeAfterTime ,此时的time", time);
        time--;
        if (time >= 0 && !_this4.isStopTimer) {
          _this4.closeNodeAfterTime(time);
        }
      }, 1000);
    }
  },
  // 指定时间之后关闭指定节点
  closeAfertTime: function closeAfertTime(node, time, label) {
    var _this5 = this;
    var timeString = time;
    label.string = timeString + "S";
    if (time == 0) {
      this.ifStopBtnLabTimer = true;
      this.turnTableCtrl.endShowCallback();
      node.destroy();
    } else {
      setTimeout(function () {
        console.log("timeString", timeString);
        time--;
        if (time >= 0 && !_this5.ifStopBtnLabTimer) {
          _this5.closeAfertTime(node, time, label);
        }
      }, 1000);
    }
  },
  /**
   * 小数点后保留非0位数
   * @param {Number} num 小数
   * @returns {String}
   */
  getFloatNum: function getFloatNum(num) {
    var numString = num.toString();
    if (numString.charAt(numString.length - 1) == '0') {
      numString = numString.substring(0, numString.length - 1);
      return this.getFloatNum(numString);
    } else {
      return numString;
    }
  },
  playPddSound: function playPddSound(soundName, isLoop) {
    if (isLoop === void 0) {
      isLoop = false;
    }
    ResourcesBundle.load("sound/pddSound/" + soundName, cc.AudioClip, function (err, audioClip) {
      if (!err) {
        cc.audioEngine.playMusic(audioClip, isLoop);
      }
    });
  }
});

cc._RF.pop();