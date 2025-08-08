cc.Class({
    extends: cc.Component,

    properties: {
        prefabPoint: cc.Prefab,
        content: cc.Node,
    },

    start() {},

    /**
     * 初始化走势图
     * @param {Array} data 
     */
    init(data) {
        this.content.removeAllChildren();

        if (!Array.isArray(data)) {
            cc.error("init 参数必须是数组");
            return;
        }

        // ✅ 倒序处理，最多取76条
        let reversed = data.slice().reverse();
        let limited = reversed.slice(0, 76);

        this.initPoint(limited);
    },

    /**
     * 绘制每个点
     * @param {Array} data 
     */
    initPoint(data) {
        this.content.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            let trendNode = cc.instantiate(this.prefabPoint);
            this.content.addChild(trendNode);

            let RocketRecordRectCtrl = trendNode.getComponent("AviatorRecordRectCtrl");
            if (RocketRecordRectCtrl) {
                RocketRecordRectCtrl.init(data[i]);
            }
        }
    },
});
