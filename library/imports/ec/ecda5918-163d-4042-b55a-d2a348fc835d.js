"use strict";
cc._RF.push(module, 'ecda5kYFj1AQrVa0qNI/INd', 'RuleCtrl');
// ResourcesBundle/NewPlan/Rule/RuleCtrl.js

"use strict";

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: {
      "default": null,
      type: cc.Button
    },
    rule_parentNode: cc.Node,
    node_checkBox: {
      "default": [],
      type: cc.Toggle
    },
    toggle_tp: cc.Toggle,
    toggle_rummy: cc.Toggle,
    toggle_andeer: cc.Toggle,
    toggle_updown: cc.Toggle,
    toggle_lhd: cc.Toggle,
    toggle_munda: cc.Toggle,
    toggle_horseRace: cc.Toggle,
    toggle_fruitMachine: cc.Toggle,
    toggle_mayaMachine: cc.Toggle,
    toggle_baccarat3Patti: cc.Toggle,
    toggle_rocket: cc.Toggle,
    toggle_zoo: cc.Toggle,
    toggle_cricket: cc.Toggle,
    toggle_zeus: cc.Toggle
  },
  ctor: function ctor() {
    this.gameNameToIndex = {
      "rummy": 'minirummy',
      "tpGame": 'miniteenpatti',
      "Andeer": 'miniandar',
      "7up7downGame": 'miniseven',
      "lhd": 'minilonghu',
      "munda": 'minijhandimunda',
      "horseRace": 'minisaima',
      "fruitMachine": 'minishuiguo',
      "mayaMachine": 'minimaya',
      "baccarat3Patti": 'miniteenpattibaccarat',
      "rocket": 'minirocket',
      "zoo": 'minizoo',
      "cricket": 'minicricket',
      "zeusGame": 'minizeus'
    };
    this.isRunedOnLoadFunc = false;
    this.needRunFunc = null;
    this.needRunFuncParam = null;
    this.curPrefabPath = null;
  },
  onLoad: function onLoad() {
    var _this = this;

    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();

      _this.node.destroy();
    }, this); // 此处键值与大厅游戏配置顺序保持一致

    this.gameRulesRelativePath = {
      "minizeus": 'ResourcesBundle/NewPlan/Rule/gameRules/Zeus',
      "miniteenpatti": 'ResourcesBundle/NewPlan/Rule/gameRules/Tp',
      "minirummy": 'ResourcesBundle/NewPlan/Rule/gameRules/Rummy',
      "minilonghu": 'ResourcesBundle/NewPlan/Rule/gameRules/Lhd',
      "minijhandimunda": 'ResourcesBundle/NewPlan/Rule/gameRules/Munda',
      "miniandar": 'ResourcesBundle/NewPlan/Rule/gameRules/Ander',
      "minishuiguo": 'ResourcesBundle/NewPlan/Rule/gameRules/FruitMachine',
      "minimaya": 'ResourcesBundle/NewPlan/Rule/gameRules/MayaMachine',
      "miniteenpattibaccarat": 'ResourcesBundle/NewPlan/Rule/gameRules/Baccarat3Patti',
      "minirocket": 'ResourcesBundle/NewPlan/Rule/gameRules/Rocket',
      "minicricket": 'ResourcesBundle/NewPlan/Rule/gameRules/Cricket',
      "minizoo": 'ResourcesBundle/NewPlan/Rule/gameRules/Zoo',
      "miniseven": 'ResourcesBundle/NewPlan/Rule/gameRules/Updown',
      "minibenzbmw": null,
      "minisaima": 'ResourcesBundle/NewPlan/Rule/gameRules/HorseRace',
      "miniluckyloto": null
    };
  },
  start: function start() {
    this.isRunedOnLoadFunc = true;
    this.needRunFunc && this.needRunFunc(this.needRunFuncParam);
    this.needRunFunc = null;
  },
  setToggleOrder: function setToggleOrder() {
    var _this2 = this;

    // 默认游戏按钮顺序
    var defaultGameSiblingIndexObj = {
      "minirocket": 1,
      "minijhandimunda": 2,
      "miniteenpatti": 3,
      "miniteenpattibaccarat": 4,
      "miniandar": 5,
      "minilonghu": 6,
      "minishuiguo": 7,
      "minimaya": 8,
      "minisaima": 9,
      "minibenzbmw": 10,
      "minirummy": 11,
      "miniseven": 12,
      "minizoo": 13,
      "minicricket": 14,
      "miniluckyloto": 15,
      "minizeus": 16
    };
    var getAppConfigValue = CommonFun.getInstance().getAppConfigValueByKey("GAME_LOBBY_BTN_SIBLING_INDEX_DATA", defaultGameSiblingIndexObj);

    if (getAppConfigValue != defaultGameSiblingIndexObj) {
      defaultGameSiblingIndexObj = _extends({}, getAppConfigValue);
    }

    var arr = Object.entries(defaultGameSiblingIndexObj);
    arr.sort(function (a, b) {
      return a[1] - b[1];
    });
    var togglesObj = {
      "minirocket": this.toggle_rocket,
      "minijhandimunda": this.toggle_munda,
      "miniteenpatti": this.toggle_tp,
      "miniteenpattibaccarat": this.toggle_baccarat3Patti,
      "miniandar": this.toggle_andeer,
      "minilonghu": this.toggle_lhd,
      "minishuiguo": this.toggle_fruitMachine,
      "minimaya": this.toggle_mayaMachine,
      "minisaima": this.toggle_horseRace,
      "minirummy": this.toggle_rummy,
      "miniseven": this.toggle_updown,
      "minizoo": this.toggle_zoo,
      "minicricket": this.toggle_cricket,
      "minizeus": this.toggle_zeus
    };
    this.toggleMap = new Map();

    for (var i = 0; i < arr.length; i++) {
      var arr_1 = arr[i];
      var key = arr_1[0];

      if (Object.prototype.hasOwnProperty.call(togglesObj, key) == true) {
        this.toggleMap.set(key, togglesObj[key]);
      }
    }

    var func = function func(indexArr, object) {
      for (var _i = 0; _i < indexArr.length; _i++) {
        var _key = indexArr[_i][0];
        var index = indexArr[_i][1];
        object[_key] && object[_key].node.setSiblingIndex(index);
      }

      ;
    };

    func(arr, togglesObj);
    this.toggleMap.forEach(function (value, key) {
      if (value) {
        value.node.on('toggle', function (event) {
          _this2.toggleClick(event, key);
        }, _this2);
      }
    });
  },
  toggleClick: function toggleClick(toggle, mapKey) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var path = this.gameRulesRelativePath[mapKey];

    this._initGameRuleByName(path);
  },
  _initGameRuleByName: function _initGameRuleByName(path) {
    var _this3 = this;

    if (!path) {
      return;
    }

    if (this.curPrefabPath) {
      CommonFun.getInstance().releasePrefab(this.curPrefabPath);
    }

    var prefabPromise = CommonFun.getInstance().loadPrefabByPromise(path);
    prefabPromise.then(function (prefab) {
      _this3.rule_parentNode.destroyAllChildren();

      if (prefab) {
        _this3.curPrefabPath = path;
        var rule = cc.instantiate(prefab);

        _this3.rule_parentNode.addChild(rule);
      }
    });
  },

  /**
   * 显示小游戏规则
   * 1, 可以传任意个数的游戏名作为参数，则会显示对应的toggle
   * 2，当首参为"allGame"时，则显示所有的toggle
   */
  SmallGameRule: function SmallGameRule() {
    this.setToggleOrder();
    var tempArr = [];

    if (arguments[0] == "allGame") {
      if (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103)) {
        tempArr.push('minirummy');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
        tempArr.push('miniteenpatti');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105)) {
        tempArr.push('miniandar');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(106)) {
        tempArr.push('miniseven');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(109)) {
        tempArr.push('minilonghu');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(111)) {
        tempArr.push('minijhandimunda');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(112)) {
        tempArr.push('minisaima');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(113)) {
        tempArr.push('minishuiguo');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(108)) {
        tempArr.push('miniteenpattibaccarat');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(115) == true) {
        tempArr.push('minirocket');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(116) == true) {
        tempArr.push('minicricket');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(117) == true) {
        tempArr.push('minizoo');
      }

      ;

      if (GlobalCfg.USER_DATAS.openModules.includes(118) == true) {
        tempArr.push('minizeus');
      }

      ;
    } else {
      for (var i = 0, len = arguments.length; i < len; i++) {
        var param = arguments[i];
        var gamekey = this.gameNameToIndex[param];

        if (gamekey) {
          tempArr.push(gamekey);
        }
      }

      ;
    }

    ;
    var tempMap = new Map();
    this.toggleMap.forEach(function (value, key) {
      if (tempArr.indexOf(key) != -1) {
        tempMap.set(key, true);
      }

      ;
    });

    if (this.isRunedOnLoadFunc == false) {
      this.needRunFunc = this.setSmallGameRuleShow;
      this.needRunFuncParam = tempMap;
      return;
    }

    ;
    this.setSmallGameRuleShow(tempMap);
  },
  setSmallGameRuleShow: function setSmallGameRuleShow(tempMap) {
    if (tempMap === void 0) {
      tempMap = new Map();
    }

    if (tempMap.size == 0) {
      return;
    }

    ;
    var mapIterator = tempMap.keys();
    var firstKey = mapIterator.next().value;
    this.toggleMap.forEach(function (value, key) {
      if (tempMap.has(key)) {
        value.node.active = true;

        if (key == firstKey) {
          value.isChecked = true;
        }
      } else {
        value.node.active = false;
      }

      ;
    });

    this._initGameRuleByName(this.gameRulesRelativePath[firstKey]);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.RULE);
  }
});

cc._RF.pop();