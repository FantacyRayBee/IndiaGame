cc.Class({
    extends: cc.Component,

    properties: {
        prefabHistoryItem: {
            type: cc.Prefab,
            default: null,
            tooltip: "上方条形历史记录"
        },
        prefabTableItem: {
            type: cc.Prefab,
            default: null,
            tooltip: "下方表格记录"
        },
        historyParent: cc.Node,
        sprites: {
            type: cc.SpriteFrame,
            default: [],
        },
        tableParent: cc.Node,
        graphic: {
            type: cc.Graphics,
            default: null,
            tooltip: "绘制线段"
        },
        btnClose: {
            type: cc.Button,
            default: null,
            tooltip: "关闭按钮"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.historyData = [];
        this.tableListX = [-429, -381, -333, -286, -238, -191, -143, -95, -48, 0, 47, 95, 143, 190, 238, 286, 334, 382, 429, 477];
        this.tableListY = [150, 108, 64, 21, -22, -65, -108, -151];
    },

    onLoad() {
        this.btnClose.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onCustomEventMsg, this);
    },

    start() {

    },

    onDestroy() {

        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    onCustomEventMsg(data, target) {
        let self = target;
        var msgId = data.msgCode;
        var notify = data.msgData;
        if (msgId == "GAME_CRICKET_RECORD_UPDATE") {
            self.initHistory(notify.recordData);
        }
    },

    initHistory(data) {
        // data = [1, 1, 2, 3, 4, 5, 6, 7, 8, 2, 1, 3, 5, 1, 1, 1, 7, 2, 5, 6];
        this.initItem(data);
        this.initTable(data);
    },

    initItem(data) {
        this.historyParent.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            const element = data[i] - 1;
            if (element < 0 || element >= 8) {
                LoggerUtil.getInstance().error("历史记录数据错误，", element);
                continue;
            }
            let item = cc.instantiate(this.prefabHistoryItem);
            let size = this.sprites[element].getOriginalSize();
            item.getChildByName('sp').getComponent(cc.Sprite).spriteFrame = this.sprites[element];
            item.getChildByName('sp').width = size.width * 0.09;
            item.getChildByName('sp').height = size.height * 0.09;
            if (i == data.length - 1) {
                item.getChildByName('new').active = true;
            } else {
                item.getChildByName('new').active = false;
            }
            this.historyParent.addChild(item);
        }
    },

    initTable(data) {
        this.tableParent.removeAllChildren();
        this.graphic.clear();
        let index = 0;
        for (let i = 0; i < data.length; i++) {
            const element = data[i] - 1;
            if (element < 0 || element >= 8) {
                LoggerUtil.getInstance().error("历史记录数据错误，", element);
                continue;
            }

            let item = cc.instantiate(this.prefabTableItem);
            item.x = this.tableListX[index];
            item.y = this.tableListY[element];
            item.getComponent(cc.Sprite).spriteFrame = this.sprites[element];
            this.tableParent.addChild(item);
            if (index == 0) {
                this.graphic.moveTo(this.tableListX[index], this.tableListY[element]);
            } else {
                this.graphic.lineTo(this.tableListX[index], this.tableListY[element]);
            }
            index++;
        }
        this.graphic.stroke();
    },

    // update (dt) {},
});
