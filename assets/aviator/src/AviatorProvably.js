cc.Class({
    extends: cc.Component,

    properties: {
        lab_service: cc.Label,
        lab_hash: cc.Label,
        lab_hax: cc.Label,
        lab_decimal: cc.Label,
        lab_result: cc.Label,

        sp_N1: cc.Node,
        sp_N2: cc.Node,
        sp_N3: cc.Node,

        lab_id_N1: cc.Label,
        lab_id_N2: cc.Label,
        lab_id_N3: cc.Label,

        lab_seed_N1: cc.Label,
        lab_seed_N2: cc.Label,
        lab_seed_N3: cc.Label,

        lab_timer: cc.Label,
        record_rect: cc.Node,

        btn_provably: cc.Button,
        btn_close: cc.Button,

        prefabRule: cc.Prefab,
    },

    onLoad() {
        this.btn_provably.node.on('click', this.btnClick, this);
        this.btn_close.node.on('click', this.btnCloseClick, this);
    },

    start() {},

    init(data) {
        LoggerUtil.getInstance().log("init1111 data", data);
        
        this.lab_service.string = data.serverSeed;
        this.lab_hash.string = this.truncateUtf8Bytes(data.sha256, 60);
        this.lab_hax.string = this.truncateUtf8Bytes(data.Hex, 10);
        this.lab_decimal.string = this.truncateUtf8Bytes(data.decimal, 10);
        this.lab_result.string = data.resultScore;

        this.lab_id_N1.string = data.n1Nickname;
        this.lab_id_N2.string = data.n2Nickname;
        this.lab_id_N3.string = data.n3Nickname;
        this.lab_seed_N1.string = data.n1Seed;
        this.lab_seed_N2.string = data.n2Seed;
        this.lab_seed_N3.string = data.n3Seed;

        this.lab_timer.string = this.formatTimestampToDateTime(GlobalCfg.ACT_SCENE_CTRL.provablyData.date)

        let RocketRecordRectCtrl = this.record_rect.getComponent("AviatorRecordRectCtrl");
        if (RocketRecordRectCtrl) {
            RocketRecordRectCtrl.init({mul: GlobalCfg.ACT_SCENE_CTRL.provablyData.bet});
        }
        GlobalCfg.ACT_SCENE_CTRL.loadHead(this.sp_N1, data.n1Head)
        GlobalCfg.ACT_SCENE_CTRL.loadHead(this.sp_N2, data.n2Head)
        GlobalCfg.ACT_SCENE_CTRL.loadHead(this.sp_N3, data.n3Head)
    },

    btnClick() {
        let node = cc.instantiate(this.prefabRule);
        node.setPosition(cc.v2(0, -782));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;
    },

    btnCloseClick() {
        this.node.destroy();
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

    formatTimestampToDateTime(ts) {
        const date = new Date(ts * 1000); // 秒级时间戳 → 毫秒
    
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
    
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        const seconds = this.padZero(date.getSeconds());
    
        return `${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }
});
