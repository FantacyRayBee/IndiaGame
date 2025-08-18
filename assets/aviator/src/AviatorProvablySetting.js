import md5 from "../../Main/md5";

cc.Class({
    extends: cc.Component,

    properties: {
        toggle1: cc.Toggle,
        toggle2: cc.Toggle,

        btn_whatIsProvably: cc.Button,
        btn_copy1: cc.Button,
        btn_copy2: cc.Button,
        btn_change: cc.Button,
        btn_close: cc.Button,

        lab_seed1: cc.Label,
        lab_seed2: cc.Label,

        prefabRule: cc.Prefab,
    },

    onLoad() {
        this.toggle1.node.on('toggle', this.toggleClick, this);
        this.toggle2.node.on('toggle', this.toggleClick, this);


        this.btn_copy1.node.on('click', this.btnClick, this);
        this.btn_copy2.node.on('click', this.btnClick, this);
        this.btn_change.node.on('click', this.btnClick, this);
        this.btn_whatIsProvably.node.on('click', this.btnClick, this);
        this.btn_close.node.on('click', this.btnClick, this);

    },

    start() {
        let md5Hash = md5(GlobalCfg.USER_DATAS.userId);
        this.lab_seed1.string = this.truncateUtf8Bytes(md5Hash, 15);
        this.dealChange();
    },

    btnClick(event) {
        let name = event.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btn_whatIsProvably.node.name) {
            this.dealOpen();
        }
        else if (name == this.btn_copy1.node.name) {
            this.dealCopy(2);
        }
        else if (name == this.btn_copy2.node.name) {
            this.dealCopy(2);
        }
        else if (name == this.btn_change.node.name) {
            this.dealChange();
        }
        else if (name == this.btn_close.node.name) {
            this.node.destroy();
        }
    },

    dealOpen() {
        let node = cc.instantiate(this.prefabRule);
        node.setPosition(cc.v2(0, -782));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

    },

    dealCopy(type) {
        let text = '';
        if (type === 1) {
            text = this.lab_seed1.string;
        } else if (type === 2) {
            text = this.lab_seed2.string;
        }
        if (!text) {
            return;
        }
        APPManager.copyToPasteBoard(text);
        CommonFun.getInstance().showTips("Copy successful!");
    },

    dealChange() {
        let timestamp = Math.floor(Date.now() / 1000); // 秒级时间戳
        let md5Hash = md5(GlobalCfg.USER_DATAS.userId + timestamp);
        this.lab_seed2.string = this.truncateUtf8Bytes(md5Hash, 15);
    },

    truncateUtf8Bytes(str, maxBytes) {
        let bytes = 0;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x7F) {
                bytes += 1;
            } else if (code <= 0x7FF) {
                bytes += 2;
            } else if (code >= 0xD800 && code <= 0xDBFF) {
                bytes += 4;
                i++; // skip the low surrogate
            } else {
                bytes += 3;
            }
            if (bytes > maxBytes) break;
    
            result += str[i];
        }
        return result;
    },
});
