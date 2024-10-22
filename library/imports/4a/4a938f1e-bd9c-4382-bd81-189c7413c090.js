"use strict";
cc._RF.push(module, '4a9388evZxDgr2BGJx0E8CQ', 'RewardsTipsCtrl');
// ResourcesBundle/NewPlan/RewardsTips/RewardsTipsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    sprite_gold_coin: {
      "default": null,
      type: cc.SpriteFrame
    },
    sprite_lubi_coin: {
      "default": null,
      type: cc.SpriteFrame
    },
    sprite_silver_coin: {
      "default": null,
      type: cc.SpriteFrame
    },
    btn_okay: {
      "default": null,
      type: cc.Button
    },
    layout: {
      "default": null,
      type: cc.Layout
    },
    node_coin: {
      "default": null,
      type: cc.Node
    }
  },
  ctor: function ctor() {
    this.gold_pos = cc.v2(8, 0);
    this.gold_size = cc.size(64, 54);
    this.silver_pos = cc.v2(4, 0);
    this.silver_size = cc.size(60, 60);
  },
  onLoad: function onLoad() {
    var _this = this;

    this.btn_okay.node.on("click", CommonFun.getInstance().debounce(function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this.btn_okay.interactable = false;
      _this.btn_okay.enableAutoGrayEffect = true;

      _this.node.destroy();
    }, 1), this);
  },
  deduplicationArr: function deduplicationArr(arr) {
    var array = arr || [];

    if (array.length == 0 || array.length <= 2) {
      return array;
    }

    var result = [];
    var map = new Map();

    for (var index = 0; index < array.length; index++) {
      var item = array[index];

      if (map.has(item.id)) {
        map.get(item.id).amount += item.amount;
      } else {
        map.set(item.id, item);
      }
    }

    if (map.has(11)) {
      map.get(10).amount += map.get(11).amount;
      map["delete"](11);
    }

    result = Array.from(map.values());
    return result;
  },

  /**
   * coin {
          id,        // 10 deposit, 11 winnings 12 bonus
          amount
      }
   * 
   * @param {Array{coin}} params 
   */
  setRewards: function setRewards(params) {
    var array = this.deduplicationArr(params);

    for (var i = 0; i < array.length; i++) {
      var coin = array[i];

      if (i < 1) {
        this.setRewardsCoin(coin, this.node_coin);
      } else {
        var node_coin = cc.instantiate(this.node_coin);
        this.layout.node.addChild(node_coin);
        this.setRewardsCoin(coin, node_coin);
      }
    }
  },
  setRewardsCoin: function setRewardsCoin(coin, node) {
    var id = coin.id;
    var amount = coin.amount;
    var lab_coin = node.getChildByName("lab_coin").getComponent(cc.Label);
    var sprite = node.getChildByName("coin").getComponent(cc.Sprite);

    switch (id) {
      case 10:
        sprite.spriteFrame = this.sprite_gold_coin;
        sprite.node.setPosition(this.gold_pos);
        sprite.node.setContentSize(this.gold_size);
        break;

      case 11:
        sprite.spriteFrame = this.sprite_gold_coin;
        sprite.node.setPosition(this.gold_pos);
        sprite.node.setContentSize(this.gold_size);
        break;

      case 12:
        sprite.spriteFrame = this.sprite_silver_coin;
        sprite.node.setPosition(this.silver_pos);
        sprite.node.setContentSize(this.silver_size);
        break;

      case 13:
        sprite.spriteFrame = this.sprite_lubi_coin;
        sprite.node.setPosition(this.gold_pos);
        sprite.node.setContentSize(this.gold_pos);
        break;

      default:
        break;
    }

    lab_coin.string = "" + amount;
  }
});

cc._RF.pop();