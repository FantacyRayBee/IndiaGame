cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: {
            default: null,
            type: cc.Button,
        },

        rule_parentNode: cc.Node,
        node_checkBox: {
            default: [],
            type: cc.Toggle,
        },
        toggle_tp: cc.Toggle,
        toggle_rummy: cc.Toggle,
        toggle_andeer: cc.Toggle,
        toggle_updown: cc.Toggle,
        toggle_lhd: cc.Toggle,
        toggle_munda: cc.Toggle,
        toggle_horseRace: cc.Toggle,
        toggle_fruitMachine: cc.Toggle,
        toggle_baccarat3Patti: cc.Toggle,
        toggle_rocket: cc.Toggle,
        toggle_zoo: cc.Toggle,
        toggle_cricket: cc.Toggle,
        toggle_zeus: cc.Toggle,
    },

    ctor: function () {
        this.gameNameToIndex = {
            "rummy": 'minirummy',
            "tpGame": 'miniteenpatti',
            "Andeer": 'miniandar',
            "7up7downGame": 'miniseven',
            "lhd": 'minilonghu',
            "munda": 'minijhandimunda',
            "horseRace": 'minisaima',
            "fruitMachine": 'minishuiguo',
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

    onLoad() {
        this.btn_close.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playBack()
            this.node.destroy();
        }, this);

        // 此处键值与大厅游戏配置顺序保持一致
        this.gameRulesRelativePath = {
            "minizeus": 'ResourcesBundle/NewPlan/Rule/gameRules/Zeus',
            "miniteenpatti": 'ResourcesBundle/NewPlan/Rule/gameRules/Tp',
            "minirummy": 'ResourcesBundle/NewPlan/Rule/gameRules/Rummy',
            "minilonghu": 'ResourcesBundle/NewPlan/Rule/gameRules/Lhd',
            "minijhandimunda": 'ResourcesBundle/NewPlan/Rule/gameRules/Munda',
            "miniandar": 'ResourcesBundle/NewPlan/Rule/gameRules/Ander',
            "minishuiguo": 'ResourcesBundle/NewPlan/Rule/gameRules/FruitMachine',
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

    start: function () {
        this.isRunedOnLoadFunc = true;
        this.needRunFunc && this.needRunFunc(this.needRunFuncParam);
        this.needRunFunc = null;
    },

    setToggleOrder: function () {
        // 默认游戏按钮顺序
        let defaultGameSiblingIndexObj = {
            "minirocket": 1,
            "minijhandimunda": 2,
            "miniteenpatti": 3,
            "miniteenpattibaccarat": 4,
            "miniandar": 5,
            "minilonghu": 6,
            "minishuiguo": 7,
            "minisaima": 8,
            "minibenzbmw": 9,
            "minirummy": 10,
            "miniseven": 11,
            "minizoo": 12,
            "minicricket": 13,
            "miniluckyloto": 14,
            "minizeus": 15
        };
        let getAppConfigValue = CommonFun.getInstance().getAppConfigValueByKey("GAME_LOBBY_BTN_SIBLING_INDEX_DATA", defaultGameSiblingIndexObj);
        if (getAppConfigValue != defaultGameSiblingIndexObj) {
            defaultGameSiblingIndexObj = { ...getAppConfigValue };
        }
        let arr = Object.entries(defaultGameSiblingIndexObj);
        arr.sort((a, b) => a[1] - b[1]);
        let togglesObj = {
            "minirocket": this.toggle_rocket,
            "minijhandimunda": this.toggle_munda,
            "miniteenpatti": this.toggle_tp,
            "miniteenpattibaccarat": this.toggle_baccarat3Patti,
            "miniandar": this.toggle_andeer,
            "minilonghu": this.toggle_lhd,
            "minishuiguo": this.toggle_fruitMachine,
            "minisaima": this.toggle_horseRace,
            "minirummy": this.toggle_rummy,
            "miniseven": this.toggle_updown,
            "minizoo": this.toggle_zoo,
            "minicricket": this.toggle_cricket,
            "minizeus": this.toggle_zeus,
        };
        this.toggleMap = new Map();
        for (let i = 0; i < arr.length; i++) {
            const arr_1 = arr[i];
            let key = arr_1[0];
            if (Object.prototype.hasOwnProperty.call(togglesObj, key) == true) {
                this.toggleMap.set(key, togglesObj[key]);
            }
        }
        let func = (indexArr, object) => {
            for (let i = 0; i < indexArr.length; i++) {
                const key = indexArr[i][0];
                const index = indexArr[i][1];
                object[key] && object[key].node.setSiblingIndex(index);
            };
        };
        func(arr, togglesObj);
        this.toggleMap.forEach((value, key) => {
            if (value) {
                value.node.on('toggle', (event) => {
                    this.toggleClick(event, key);
                }, this);
            }
        })
    },

    toggleClick: function (toggle, mapKey) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let path = this.gameRulesRelativePath[mapKey];
        this._initGameRuleByName(path);
    },

    _initGameRuleByName: function (path) {
        if (!path) {
            return;
        }
        if(this.curPrefabPath){
            CommonFun.getInstance().releasePrefab(this.curPrefabPath);
        }
        
        let prefabPromise = CommonFun.getInstance().loadPrefabByPromise(path);
        prefabPromise.then((prefab) => {
            this.rule_parentNode.destroyAllChildren();
            if (prefab) {
                this.curPrefabPath = path;
                let rule = cc.instantiate(prefab)
                this.rule_parentNode.addChild(rule);
            }
        });
        
    },

    /**
     * 显示小游戏规则
     * 1, 可以传任意个数的游戏名作为参数，则会显示对应的toggle
     * 2，当首参为"allGame"时，则显示所有的toggle
     */
    SmallGameRule: function () {
        this.setToggleOrder();
        let tempArr = [];
        if (arguments[0] == "allGame") {
            if (GlobalCfg.USER_DATAS.openModules.includes(102) || GlobalCfg.USER_DATAS.openModules.includes(103)) {
                tempArr.push('minirummy');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(100) || GlobalCfg.USER_DATAS.openModules.includes(101)) {
                tempArr.push('miniteenpatti');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(104) || GlobalCfg.USER_DATAS.openModules.includes(105)) {
                tempArr.push('miniandar');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(106)) {
                tempArr.push('miniseven');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(109)) {
                tempArr.push('minilonghu');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(111)) {
                tempArr.push('minijhandimunda');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(112)) {
                tempArr.push('minisaima');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(113)) {
                tempArr.push('minishuiguo');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(108)) {
                tempArr.push('miniteenpattibaccarat');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(115) == true) {
                tempArr.push('minirocket');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(116) == true) {
                tempArr.push('minicricket');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(117) == true) {
                tempArr.push('minizoo');
            };
            if (GlobalCfg.USER_DATAS.openModules.includes(118) == true) {
                tempArr.push('minizeus');
            };
        }
        else {
            for (let i = 0, len = arguments.length; i < len; i++) {
                let param = arguments[i];
                let gamekey = this.gameNameToIndex[param];
                if (gamekey) {
                    tempArr.push(gamekey);
                }
            };
        };

        let tempMap = new Map();
        this.toggleMap.forEach((value, key) => {
            if (tempArr.indexOf(key) != -1) {
                tempMap.set(key, true);
            };
        });

        if (this.isRunedOnLoadFunc == false) {
            this.needRunFunc = this.setSmallGameRuleShow;
            this.needRunFuncParam = tempMap;
            return;
        };

        this.setSmallGameRuleShow(tempMap);
    },

    setSmallGameRuleShow: function (tempMap = new Map()) {
        if (tempMap.size == 0) {
            return;
        };

        const mapIterator = tempMap.keys();
        const firstKey = mapIterator.next().value;
        this.toggleMap.forEach((value, key) => {
            if (tempMap.has(key)) {
                value.node.active = true;
                if(key == firstKey){
                    value.isChecked = true;
                }
            } else {
                value.node.active = false;
            };
        });
        this._initGameRuleByName(this.gameRulesRelativePath[firstKey])
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.RULE);
    },

});