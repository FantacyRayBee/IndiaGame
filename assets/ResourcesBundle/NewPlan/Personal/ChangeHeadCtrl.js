cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: {
            default: null,
            type: cc.Button,
        },
        node_content: {
            default: null,
            type: cc.Node,
        },
        prefab_item: {
            default: null,
            type: cc.Prefab,
        },
    },

    ctor: function() {
        this.headItemPrefabArr = [];
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(() => {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, 1), this);
    },

    onDestroy: function() {
        for (let i = 0; i < this.headItemPrefabArr.length; i++) {
            let itemPrefab = this.headItemPrefabArr[i];
            itemPrefab.decRef();
            itemPrefab = null;
        };
    },

    start: function() {
        CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.CHANGEHEADITEM)
        .then((prefab) => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.addHeadItems(GlobalCfg.USER_DATAS.avatarList, prefab);
            };
        });
    },

    addHeadItems: function(avatarList, itemPrefab) {
        let len = avatarList.length;
        if (len == 0) {
            return;
        };

        let index = 0;
        let addItem = () => {
            let itemData = avatarList[index];

            itemPrefab.addRef();
            this.headItemPrefabArr.push(itemPrefab);
            let item_Node = cc.instantiate(itemPrefab);

            let itemCtrl = item_Node.getComponent('ChangeHeadItemCtrl');
            itemCtrl.setUserHead(itemData, this);
            this.node_content.addChild(item_Node);

            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 1/cc.game.getFrameRate(), len - 1, 0);
    },
});
