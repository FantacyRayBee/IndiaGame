import md5 from "../../Main/md5";

cc.Class({
    extends: cc.Component,

    properties: {
        btn_copy1: cc.Button,
        btn_copy2: cc.Button,
        btn_close: cc.Button,

        lab_seed1: cc.Label,
        lab_seed2: cc.Label,
    },

    onLoad() {
        this.btn_copy1.node.on('click', this.btnClick, this);
        this.btn_copy2.node.on('click', this.btnClick, this);
        this.btn_close.node.on('click', this.btnClick, this);
    },

    start() {
        let md5Hash = md5(GlobalCfg.USER_DATAS.userId);
        this.lab_seed1.string = this.truncateUtf8Bytes(md5Hash, 15);
    },

    btnClick(event) {
        let name = event.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btn_copy1.node.name) {
            this.dealCopy(2);
        }
        else if (name == this.btn_copy2.node.name) {
            this.dealCopy(2);
        }
        else if (name == this.btn_close.node.name) {
            this.node.destroy();
            GlobalCfg.ACT_SCENE_CTRL.popupLayer.destroyAllChildren();
            GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = false;
            GlobalCfg.ACT_SCENE_CTRL.touchbg.active = false;
        }
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
