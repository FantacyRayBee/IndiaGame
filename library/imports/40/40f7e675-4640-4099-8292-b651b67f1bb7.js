"use strict";
cc._RF.push(module, '40f7eZ1RkBAmYKStlG2fxu3', 'VipRulesBenefitsCtrl');
// ResourcesBundle/NewPlan/MyVip/VipRulesBenefitsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_content: cc.Node,
    prefab_item: cc.Prefab
  },
  ctor: function ctor() {
    this.vipRulesBenefitsDataArr = [{
      iconIndex: 1,
      name: "Daily \nWithdrawal Count",
      description: "The maximum number of withdrawals a usercan make in a day."
    }, {
      iconIndex: 2,
      name: "Withdrawal Limit",
      description: "The maximum withdrawal amount a user can withdraw."
    }, {
      iconIndex: 3,
      name: "Monthly Allowance",
      description: "Monthly allowance of each level is available for the VIP users. Collect it on the VIP page."
    }, {
      iconIndex: 4,
      name: "Weekly Allowance",
      description: "Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page."
    }, {
      iconIndex: 5,
      name: "Daily Allowance",
      description: "Daily Allowance of each level is available for the VIP users. Collect it on the VIP page"
    }, {
      iconIndex: 6,
      name: "VIP Seats",
      description: "VIP players can occupy prominent positions in gambling games."
    }, {
      iconIndex: 7,
      name: "VIP \nCustomer Service",
      description: "VIP customer service with faster response speed and higher service quality will only offer to VIP users."
    }, {
      iconIndex: 8,
      name: "VIP Name Color",
      description: "Unique color of the VIP users name."
    }, {
      iconIndex: 10,
      name: "Level Up Gift",
      description: "Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level."
    }, {
      iconIndex: 11,
      name: "Lucky Draw",
      description: "Each VIP level increase corresponds to an increase in the number of lucky draws."
    }];
  },
  start: function start() {
    var _this = this;

    var languagesType = I18NUtil.getInstance().getLanguageType();
    var index = 0;
    var len = this.vipRulesBenefitsDataArr.length;

    var addItemFun = function addItemFun() {
      if (index >= len) {
        _this.unschedule(addItemFun);

        return;
      }

      ;
      var itemData = _this.vipRulesBenefitsDataArr[index];
      var nameStr = "";
      var descriptionStr = "";

      if (itemData.iconIndex == 1) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_The maximum number of withdrawals a usercan make in a day.']);
      } else if (itemData.iconIndex == 2) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Withdrawal Limit']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_The maximum withdrawal amount a user can withdraw.']);
      } else if (itemData.iconIndex == 3) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Monthly Allowance']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.']);
      } else if (itemData.iconIndex == 4) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Weekly Allowance']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.']);
      } else if (itemData.iconIndex == 5) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Daily Allowance']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.']);
      } else if (itemData.iconIndex == 6) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Seats']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP players can occupy prominent positions in gambling games.']);
      } else if (itemData.iconIndex == 7) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Customer Service']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.']);
      } else if (itemData.iconIndex == 8) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_VIP Name Color']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Unique color of the VIP users name.']);
      } else if (itemData.iconIndex == 10) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Level Up Gift']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.']);
      } else if (itemData.iconIndex == 11) {
        nameStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Lucky Draw']);
        descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.']);
      }

      ;
      itemData.name = nameStr;
      itemData.description = descriptionStr;
      var itemNode = cc.instantiate(_this.prefab_item);
      var scr = itemNode.getComponent("VipRulesBenefitsItemCtrl");
      scr.setVipRulesBenefitsItemData(itemData);

      _this.node_content.addChild(itemNode);

      index += 1;
    };

    this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
  }
});

cc._RF.pop();