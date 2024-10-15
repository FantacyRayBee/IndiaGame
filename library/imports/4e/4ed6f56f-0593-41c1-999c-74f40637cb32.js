"use strict";
cc._RF.push(module, '4ed6fVvBZNBwZmcdPQGN8sy', 'VipRulesBenefitsItemCtrl');
// ResourcesBundle/NewPlan/MyVip/VipRulesBenefitsItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    sprite_icon: cc.Sprite,
    lab_name: cc.Label,
    lab_description: cc.Label,
    atlas_icon: cc.SpriteAtlas
  },
  setVipRulesBenefitsItemData: function setVipRulesBenefitsItemData(data) {
    this.lab_name.string = data.name;
    this.lab_description.string = data.description;
    this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame(data.iconIndex);
  }
});

cc._RF.pop();