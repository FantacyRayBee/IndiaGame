
cc.Class({
    extends: cc.Component,

    properties: {
        nodeList: {
            default: null,
            type: cc.Node,
            tooltip: "历史记录父节点"
        },
        prefabItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "节点模板"
        },
    },

    ctor() {
        this.recordDataList = [];       // 历史记录数据
        this.recordNodeList = [];       // 历史记录节点
        this.gameMaxRecordCount = 14;   // 游戏界面最大记录条数
        this.historyShowRecordCount = 20;   // 历史记录界面显示最大记录条数(存储数据条数)
    },

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    /**
     * 初始化节点 / 多条记录刷新节点 
     */
    initItem(data) {
        this.initRecordDataList(data);
        this.nodeList.removeAllChildren();
        let dataArr = this.getRecordDataByLength(this.gameMaxRecordCount);
        this.recordNodeList.length = 0;
        let length = dataArr.length;
        for (let i = 0; i < length; i++) {
            let spriteType = dataArr[i];
            if (spriteType == 0 || spriteType > 8) {
                LoggerUtil.getInstance().error("服务器消息Team类型错误", spriteType);
                continue;
            }
            let itemNode = cc.instantiate(this.prefabItem);
            let spNode = itemNode.getChildByName('sp');
            let spFrame = GlobalCfg.ACT_SCENE_CTRL.teamSpriteFrames[spriteType - 1];
            spNode.getComponent(cc.Sprite).spriteFrame = spFrame;
            let size = spFrame.getOriginalSize();
            spNode.width = size.width * 0.14;
            spNode.height = size.height * 0.14;
            if (i == length - 1) {
                itemNode.getChildByName('new').active = true;
            } else {
                itemNode.getChildByName('new').active = false;
            }
            this.nodeList.addChild(itemNode);
            this.recordNodeList.push(itemNode);
        }
    },

    /**
     * 初始化历史记录数据
     * @param {Array} data 
     */
    initRecordDataList(data) {
        if (data.length > this.historyShowRecordCount) {
            this.recordDataList = data.slice(data.length - this.historyShowRecordCount, data.length);
        } else {
            this.recordDataList = data;
        }
    },

    /**
     * 获取指定长度的历史记录数据
     * @param {Number} length 
     */
    getRecordDataByLength(length) {
        if (this.recordDataList.length >= length) {
            return this.recordDataList.slice(this.recordDataList.length - length, this.recordDataList.length);
        } else {
            return this.recordDataList;
        }
    },

    /**
     * 单条记录更新节点展示
     * @param {*} newRecord 最新记录
     */
    updateRecord(newRecord) {
        if (newRecord == 0 || newRecord > 8) {
            LoggerUtil.getInstance().error("服务器消息Team类型错误", newRecord);
            return;
        }

        if (this.recordNodeList.length >= this.gameMaxRecordCount) {
            let firstNode = this.recordNodeList.shift();
            if (firstNode && firstNode.isValid) {
                firstNode.destroy();
            }
        }
        let lastNode = this.recordNodeList[this.recordNodeList.length - 1];
        if (lastNode) {
            lastNode.getChildByName('new').active = false;
        }
        if (this.recordDataList.length >= this.historyShowRecordCount) {
            this.recordDataList.shift();
        }
        this.recordDataList.push(newRecord);
        let itemNode = cc.instantiate(this.prefabItem);
        let spNode = itemNode.getChildByName('sp');
        let spFrame = GlobalCfg.ACT_SCENE_CTRL.teamSpriteFrames[newRecord - 1];
        spNode.getComponent(cc.Sprite).spriteFrame = spFrame;
        let size = spFrame.getOriginalSize();
        spNode.width = size.width * 0.14;
        spNode.height = size.height * 0.14;
        itemNode.getChildByName('new').active = true;
        this.nodeList.addChild(itemNode);
        this.recordNodeList.push(itemNode);
        LoggerUtil.getInstance().log(`更新记录，当前记录为：${this.recordDataList}`);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: "GAME_CRICKET_RECORD_UPDATE",
            msgData: { recordData: this.recordDataList }
        });
    },

    /**
     * 返回最新的记录坐标
     * @returns {cc.v2 | null}
     */
    getEndNodePos() {
        if (this.recordNodeList.length == 0) {
            return cc.v2(40, 0);
        } else {
            let pos = this.recordNodeList[this.recordNodeList.length - 1].getPosition()
            if(this.recordNodeList.length < this.gameMaxRecordCount){
                pos.x = pos.x + 80;
            }
            return pos;
        }
    },

    getHistoryData() {
        return this.recordDataList;
    },
});
