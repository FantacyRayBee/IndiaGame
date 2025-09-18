cc.Class({
    extends: cc.Component,

    properties: {
        // main
        // chickenObj: cc.Node,
        // node_content: cc.Node,
        // node_item: cc.Node,
        // node_map_start: cc.Node,
        // node_map_end: cc.Node,

        btnclose: cc.Button,
        btn_att_Time: cc.Button,
        btn_add_Time: cc.Button,

        btn_att_level: cc.Button,
        btn_add_level: cc.Button,

        btn_save: cc.Button,
        lab_save: cc.Label,

        edit_autoLevel: cc.EditBox,
        edit_autoTime: cc.EditBox,

        btn_bet_quicks: [cc.Button],
    },

    onLoad() {
        this.btnclose.node.on('click', this.onBtnClose, this);
        this.btn_att_Time.node.on('click', this.onAutoTimeClick, this);
        this.btn_add_Time.node.on('click', this.onAutoTimeClick, this);

        this.btn_att_level.node.on('click', this.onAutoLevelClick, this);
        this.btn_add_level.node.on('click', this.onAutoLevelClick, this);

        this.btn_save.node.on('click', this.onBtnSave, this);

        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].node.on('click', this.btnQuickClick, this);
        }
        this.quickBetStr = [25,50,75,100]
    },

    start() {
        // this.contentStartPosX = this.node_content.position.x;

    },

    init(mapConfig) {
        this.mapConfig = mapConfig;
        this.edit_autoTime.string = "25";  //自动次数
        //加载地图数据
        this.edit_autoLevel.node.getComponent("ChickenEditbox").maxValue = this.mapConfig.length; //最大值
        this.edit_autoLevel.string = this.mapConfig.length.toString();
        this.edit_autoLevel.placeholder = this.mapConfig.length.toString();
    },

    btnQuickClick(event) {
        let btnName = event.node.name;
        if (btnName === "btn_bet_quick1") {
            this.dealQuickBetEvent(0);
        }
        else if (btnName === "btn_bet_quick2") {
            this.dealQuickBetEvent(1);
        }
        else if (btnName === "btn_bet_quick3") {
            this.dealQuickBetEvent(2);
        }
        else if (btnName === "btn_bet_quick4") {
            this.dealQuickBetEvent(3);
        }
    },
    
    onAutoTimeClick(event) {
        let name = event.node.name;
        if (name == this.btn_att_Time.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.setAutoTime(1);
        }
        else if (name == this.btn_add_Time.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.setAutoTime(2);
        }
    },

    onAutoLevelClick(event) {
        let name = event.node.name;
        if (name == this.btn_att_level.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.chickenMove(1);
        }
        else if (name == this.btn_add_level.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.chickenMove(2);
        }
    },

    setAutoTime(type) {
        let time = parseInt(this.edit_autoTime.string);
        if (type == 1) {
            time -= 1;
            if (time < 1) {
                time = 1;
            }
        }
        else if (type == 2){
            time += 1;
            if (time > 100) {
                time = 100;
            }
        }
        this.edit_autoTime.string = time.toString();
    },
    chickenMove(type) {
        let level = parseInt(this.edit_autoLevel.string);
        if (type == 2) {
            level++;
            if (level >= this.mapConfig.length) {
                // this.chickenMoveToRight(this.curStandMapIndex, true);
                // return;
                level = this.mapConfig.length;
            }
            // this.chickenMoveToRight(this.curStandMapIndex);
        }
        if (type == 1) {
            level--;
            if (level < 1) {
                level = 1;
                // return;
            }
            // this.chickenMoveToLeft(this.curStandMapIndex);
        }
        this.edit_autoLevel.string = level.toString();
    },

    onBtnSave(){
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        GlobalCfg.ACT_SCENE_CTRL.startAutoGame({level: this.autoLevel, time: this.autoTime});
        this.onBtnClose();
    },
    
    dealQuickBetEvent(type) {
        this.edit_autoTime.string = this.quickBetStr[type];
    },

    setMap() {
        // 保留第一个
        let children = this.node_content.children;
        for (let i = children.length - 1; i > 0; i--) {
            children[i].destroy();
        }
        let mapConfig = this.mapConfig;
        this.mapMaxCount = mapConfig.length;
        this.mapListArr = [];  // 记得清空，否则可能残留上一次的

        for (let i = 0, len = this.mapMaxCount; i < len; i++) {
            let mapItem = cc.instantiate(this.node_item);
            let script = mapItem.getComponent('ChickenMapItem2');
            mapItem.active = true;
            mapItem.position = cc.Vec2(mapItem.position.x, 0)
            let index = i % 4; // 0-3
            script.setPanel(index, i == len - 1);
            script.setData(mapConfig[i]);
            this.mapListArr.push(mapItem);
            this.node_content.addChild(mapItem);
        }
        let endItem = cc.instantiate(this.node_map_end);
        this.node_content.addChild(endItem);
        endItem.active = true;
    },


    chickenMoveToRight(index, isEnd) {
        let node = this.chickenObj;
        let newParent = this.mapListArr[index];
        let endPos = cc.v2(0, 0);
        let duration = 0.3;
        //如果移动到第三格 则屏幕往左移76个像素
        if (index >= 2 && index < this.mapMaxCount - 5) {
            let endPos2 = cc.v2(this.node_content.x - 76, 0);
            cc.tween(this.node_content)
            .to(duration, { position: endPos2 }, {
                easing: 'quadOut'})
            .start();
        }
        // 1. 保存切换前的世界坐标
        let worldPos = node.parent.convertToWorldSpaceAR(node.position);
        // 2. 设置新的父节点
        node.setParent(newParent, false);
        // 3. 转换回新父节点的局部坐标（保持位置不变）
        let startPos = newParent.convertToNodeSpaceAR(worldPos);
        node.setPosition(startPos);
        // 4. tween 实现平移
        cc.tween(node)
            .to(duration, { position: endPos }, {
                progress: function (start, end, current, ratio) {
                    // X 插值
                    let x = startPos.x + (endPos.x - startPos.x) * ratio;
                    // Y 插值（线性）
                    let y = startPos.y + (endPos.y - startPos.y) * ratio;
                    return cc.v2(x, y);
                }
            })
            .call(() => {
                if (isEnd) {
                    this.mapListArr[index].getComponent('ChickenMapItem2').rotate(4);
                }else{
                    this.mapListArr[index].getComponent('ChickenMapItem2').rotate(1);
                }
                if (index > 0) {
                    this.mapListArr[index - 1].getComponent('ChickenMapItem2').rotate(5);
                }
            })
            .start()
    },


    chickenMoveToLeft(index, isEnd) {
        let node = this.chickenObj;
        let newParent = this.mapListArr[index];
        let endPos = cc.v2(this.chickenObj.position.x + 76, -151);
        let duration = 0.3;
        //如果移动到第三格 则屏幕往右移76个像素
        if (index <= this.mapMaxCount - 5) {
            let endPos2 = cc.v2(this.node_content.x + 76, 0);
            cc.tween(this.node_content)
            .to(duration, { position: endPos2 }, {
                easing: 'quadOut'})
            .start();
        }
        cc.tween(node)
            .to(duration, { position: endPos })
            .call(() => {
                node.setPosition(newParent);

                if (isEnd) {
                    this.mapListArr[index].getComponent('ChickenMapItem2').rotate(4);
                }else{
                    this.mapListArr[index].getComponent('ChickenMapItem2').rotate(1);
                }
                if (index < this.mapMaxCount) {
                    this.mapListArr[index + 1].getComponent('ChickenMapItem2').rotate(5);
                }
            })
            .start()
    },

    onBtnClose() {
        this.node.destroy();
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.destroyAllChildren();
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = false;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = false;
    },

    update(dt) {
        this.autoTime = parseInt(this.edit_autoTime.string);
        this.autoLevel = parseInt(this.edit_autoLevel.string);
        for (let i = 0; i < 4; i++) {
            if (this.quickBetStr[i] == this.autoTime) {
                this.btn_bet_quicks[i].node.getChildByName('mark').active = true;
            }
            else {
                this.btn_bet_quicks[i].node.getChildByName('mark').active = false;
            }
        }
        this.lab_save.string = "START (" + this.autoTime + ")";
    }

});
