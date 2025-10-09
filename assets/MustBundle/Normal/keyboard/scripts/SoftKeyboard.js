// KeyboardBuilder.js —— 挂到 KeyboardRoot 容器节点
let EnumBtnType = cc.Enum({
    NORMAL: 0,   // 普通（用于数字/符号字符等通用键）
    LETTER: 1,   // 字母（可切换大小写）
    REMOVE: 2,   // 删除
    CONFIRM: 3,  // 确认/GO
    SYMBOL: 4,   // 符号面板切换键（自身不写label）
    VISIBLE: 5,  // 显示/眼睛（自身不写label）
    CASE: 6,     // 大小写（自身不写label）
    ABC: 7,     // 字母面板切换键（自身不写label）
});

cc.Class({
    extends: cc.Component,

    properties: {
        keyPrefab: cc.Prefab,    // 按键预制体（挂了 keyboardItem.js，含 btnType/btnLabel）

        // 容器与面板
        root: cc.Node,           // 键盘整体根节点（做进出场动画）
        node_letter: cc.Node,    // 字母面板
        node_symbol: cc.Node,    // 符号面板

        // 可选：点击空白关闭支持
        touchbg: cc.Node,        // 半透明遮罩（可选）

        previewBar: cc.Node,     // 预览条节点（放到键盘顶部一条横条）
        previewLabel: cc.Label,  // 预览文字

        // 背景底图
        normal_bg: cc.SpriteFrame,  // 普通键底图（数字/字母/通用字符）
        remove_bg: cc.SpriteFrame,  // 删除键
        confirm_bg: cc.SpriteFrame, // 确认键
        visible_bg: cc.SpriteFrame, // 眼睛键
        case_bg: cc.SpriteFrame,    // 大小写键
        symbol_bg: cc.SpriteFrame,  // “#+=”切换键
        abc_bg: cc.SpriteFrame,  // 字母面板切换键
    },

    onLoad() {
        if (GlobalCfg.CURSCENE_DIRECTION == 'vertical') {
            this.root.scale = 0.65;
        }
        const size = cc.view.getFrameSize();
        let targetY = -(size.height / 2 - this.root.height) + 10;
        cc.tween(this.root).to(0.3, { y: targetY }, { easing: 'quadOut' }).start();
        // 进场动画：从下边界外进入

        // 点击遮罩关闭（可选）
        if (this.touchbg) {
            this.touchbg.off(cc.Node.EventType.TOUCH_START);
            this.touchbg.on(cc.Node.EventType.TOUCH_START, () => {
                this.closeAnim();
            }, this);
        }
        this.isLowercase = true; // 默认小写
        // 先只显示字母面板
        if (this.node_letter) this.node_letter.active = true;
        if (this.node_symbol) this.node_symbol.active = false;

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        // ==== 新增：预览条初始化 ====
        if (this.previewBar) this.previewBar.active = true;
        if (this.previewLabel) this.previewLabel.string = "";

        // ==== 新增：监听输入事件 ====
        cc.systemEvent.on("SOFTKB_INPUT", this._onKbInput, this);
        cc.systemEvent.on("SOFTKB_DONE", this._onKbDone, this);
        cc.systemEvent.on("SOFTKB_HIDE", this._onKbHide, this);

        // ==== 新增：接收当前目标 EditBox ====
        cc.systemEvent.on("SOFTKB_TARGET", this._onKbTarget, this);
        this._maxLen = 0;  // 当前 editBox 最大字符数（0 表示无限制）

        this._buildKeyboard();
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        LoggerUtil.getInstance().log(`webData ===> `, webData);
        if (msgId === "KB_SOFTKB_DONE") {
            //输出完毕 点击确认
            self.closeAnim();
        }
        else if (msgId == 'KB_SOFTKB_CASE') {
            this.isLowercase = !this.isLowercase;
            self.changeCase();
        }
        else if (msgId == 'KB_SOFTKB_SYMBOL') {
            let isSymbol = notify.isSymbol; //true 显示符号 false 显示字母
            this.node_letter.active = !isSymbol;
            this.node_symbol.active = isSymbol;
        }
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        
        cc.systemEvent.off("SOFTKB_INPUT", this._onKbInput, this);
        cc.systemEvent.off("SOFTKB_DONE", this._onKbDone, this);
        cc.systemEvent.off("SOFTKB_HIDE", this._onKbHide, this);
    },

    // ==== 接收目标 editBox，取 maxLength ====
    _onKbTarget(evt) {
        const data = evt.detail || evt;
        if (data && data.editBox) {
            this._maxLen = data.editBox.maxLength || 0;
            let initText = data.text || data.editBox.string || "";
            if (this.previewLabel) this.previewLabel.string = initText;
            cc.log("[KeyboardBuilder] 收到目标 editBox, maxLength =", this._maxLen, "初始文字=", initText);
        }
    },
    // ==== 更新预览条 ====
    _onKbInput(evt) {
        const data = evt.detail;
        let txt = this.previewLabel ? this.previewLabel.string : "";

        switch (data.type) {
            case "CHAR":
                if (this._maxLen > 0 && txt.length >= this._maxLen) return;
                txt += data.ch || "";
                break;
            case "SPACE":
                if (this._maxLen > 0 && txt.length >= this._maxLen) return;
                txt += " ";
                break;
            case "BACK":
                txt = txt.substring(0, txt.length - 1);
                break;
        }

        if (this.previewLabel) this.previewLabel.string = txt;
    },

    _onKbDone() {
        if (this.previewLabel) this.previewLabel.string = "";
        this.closeAnim();
    },

    _onKbHide() {
        if (this.previewLabel) this.previewLabel.string = "";
        this.closeAnim();
    },

    // 退出动画：下移到边界外并隐藏
    closeAnim() {
        const winSize = cc.view.getVisibleSize();
        cc.tween(this.root)
            .to(0.3, { y: -winSize.height }, { easing: 'quadIn' })
            .call(() => { this.node.destroy(); })
            .start();
    },
    changeCase() {
        for (let i = 0; i < this.letterPfbList.length; i++) {
            if (this.isLowercase)
                this.letterPfbList[i].toLowerCase();
            else
                this.letterPfbList[i].toCapitalized();
        }
    },

    _buildKeyboard() {
        // 字母布局（4行）
        const LetterCfg = [
            // Row1：1~0 + 删除
            [
                { text: '1', type: EnumBtnType.NORMAL },
                { text: '2', type: EnumBtnType.NORMAL },
                { text: '3', type: EnumBtnType.NORMAL },
                { text: '4', type: EnumBtnType.NORMAL },
                { text: '5', type: EnumBtnType.NORMAL },
                { text: '6', type: EnumBtnType.NORMAL },
                { text: '7', type: EnumBtnType.NORMAL },
                { text: '8', type: EnumBtnType.NORMAL },
                { text: '9', type: EnumBtnType.NORMAL },
                { text: '0', type: EnumBtnType.NORMAL },
                { text: '', type: EnumBtnType.REMOVE },
            ],
            // Row2：qwertyuiop
            [
                { text: 'q', type: EnumBtnType.LETTER },
                { text: 'w', type: EnumBtnType.LETTER },
                { text: 'e', type: EnumBtnType.LETTER },
                { text: 'r', type: EnumBtnType.LETTER },
                { text: 't', type: EnumBtnType.LETTER },
                { text: 'y', type: EnumBtnType.LETTER },
                { text: 'u', type: EnumBtnType.LETTER },
                { text: 'i', type: EnumBtnType.LETTER },
                { text: 'o', type: EnumBtnType.LETTER },
                { text: 'p', type: EnumBtnType.LETTER },
            ],
            // Row3：asdfghjkl + 眼睛
            [
                { text: 'a', type: EnumBtnType.LETTER },
                { text: 's', type: EnumBtnType.LETTER },
                { text: 'd', type: EnumBtnType.LETTER },
                { text: 'f', type: EnumBtnType.LETTER },
                { text: 'g', type: EnumBtnType.LETTER },
                { text: 'h', type: EnumBtnType.LETTER },
                { text: 'j', type: EnumBtnType.LETTER },
                { text: 'k', type: EnumBtnType.LETTER },
                { text: 'l', type: EnumBtnType.LETTER },
                { text: '', type: EnumBtnType.VISIBLE },
            ],
            // Row4：#+=  z x c v b n m  ⇧  GO
            [
                { text: '#+=', type: EnumBtnType.SYMBOL },
                { text: 'z', type: EnumBtnType.LETTER },
                { text: 'x', type: EnumBtnType.LETTER },
                { text: 'c', type: EnumBtnType.LETTER },
                { text: 'v', type: EnumBtnType.LETTER },
                { text: 'b', type: EnumBtnType.LETTER },
                { text: 'n', type: EnumBtnType.LETTER },
                { text: 'm', type: EnumBtnType.LETTER },
                { text: '', type: EnumBtnType.CASE },
                { text: '', type: EnumBtnType.CONFIRM },
            ],
        ];

        // 符号布局（4行，可按需改）
        const SymbolCfg = [
            // Row1：- / : ; ( ) $ & @ ”   ⌫
            [
                { text: '-',  type: EnumBtnType.NORMAL },
                { text: '/',  type: EnumBtnType.NORMAL },
                { text: ':',  type: EnumBtnType.NORMAL },
                { text: ';',  type: EnumBtnType.NORMAL },
                { text: '(',  type: EnumBtnType.NORMAL },
                { text: ')',  type: EnumBtnType.NORMAL },
                { text: '$',  type: EnumBtnType.NORMAL },
                { text: '&',  type: EnumBtnType.NORMAL },
                { text: '@',  type: EnumBtnType.NORMAL },
                { text: '”',  type: EnumBtnType.NORMAL }, // 右双引号（若需直引号可改为 '"'）
                { text: '',   type: EnumBtnType.REMOVE },
            ],

            // Row2：[ ] { } # % ^ * + =
            [
                { text: '[',  type: EnumBtnType.NORMAL },
                { text: ']',  type: EnumBtnType.NORMAL },
                { text: '{',  type: EnumBtnType.NORMAL },
                { text: '}',  type: EnumBtnType.NORMAL },
                { text: '#',  type: EnumBtnType.NORMAL },
                { text: '%',  type: EnumBtnType.NORMAL },
                { text: '^',  type: EnumBtnType.NORMAL },
                { text: '*',  type: EnumBtnType.NORMAL },
                { text: '+',  type: EnumBtnType.NORMAL },
                { text: '=',  type: EnumBtnType.NORMAL },
            ],

            // Row3：_ \ | ~ < > € £ ¥ ·
            [
                { text: '_',  type: EnumBtnType.NORMAL },
                { text: '\\', type: EnumBtnType.NORMAL }, // 反斜杠要转义
                { text: '|',  type: EnumBtnType.NORMAL },
                { text: '~',  type: EnumBtnType.NORMAL },
                { text: '<',  type: EnumBtnType.NORMAL },
                { text: '>',  type: EnumBtnType.NORMAL },
                { text: '€',  type: EnumBtnType.NORMAL },
                { text: '£',  type: EnumBtnType.NORMAL },
                { text: '¥',  type: EnumBtnType.NORMAL },
                { text: '·',  type: EnumBtnType.NORMAL }, // 中点
            ],

            // Row4：ABC  ·  ,  ?  !  `   GO
            [
                { text: '',   type: EnumBtnType.ABC },  // ABC（用底图，隐藏label）
                { text: '.',  type: EnumBtnType.NORMAL },
                { text: ',',  type: EnumBtnType.NORMAL },
                { text: '?',  type: EnumBtnType.NORMAL },
                { text: '!',  type: EnumBtnType.NORMAL },
                { text: '`',  type: EnumBtnType.NORMAL },
                { text: '',   type: EnumBtnType.CONFIRM }, // GO（用底图，隐藏label）
            ],
        ];

        // —— 生成字母面板 —— //
        if (this.node_letter) {
            this._clearRows(this.node_letter);
            this.letterPfbList = this._buildToPanel(this.node_letter, LetterCfg);
        }

        // —— 生成符号面板 —— //
        if (this.node_symbol) {
            this._clearRows(this.node_symbol);
            this.symbolPfbList = this._buildToPanel(this.node_symbol, SymbolCfg);
            LoggerUtil.getInstance().log(`symbolPfbList ===> `, this.symbolPfbList);
        }
    },

    // 清空 Row1~Row4
    _clearRows(panelNode) {
        for (let i = 1; i <= 4; i++) {
            const row = panelNode.getChildByName('Row' + i);
            if (row) row.removeAllChildren();
        }
    },

    // 把 cfg 的每一行挂到 panelNode 的 Row1~Row4（交给 Layout 排版）
    _buildToPanel(panelNode, cfg) {
        let tmp = [];
        for (let r = 0; r < cfg.length; r++) {
            const row = panelNode.getChildByName('row' + (r + 1));
            if (!row) {
                cc.warn('[KeyboardBuilder] 缺少子节点：', panelNode.name, 'row' + (r + 1));
                continue;
            }
            const layout = row.getComponent(cc.Layout);

            for (let c = 0; c < cfg[r].length; c++) {
                const meta = cfg[r][c];
                const keyNode = cc.instantiate(this.keyPrefab);
                keyNode.parent = row;
                const key = keyNode.getComponent('keyboardItem'); // 你的键脚本名
                if (!key) {
                    cc.warn('[KeyboardBuilder] keyPrefab 未挂 keyboardItem.js');
                } else {
                    tmp.push(key); // 保存起来，等所有键都创建完，再统一设置样式
                    key.setBtnType(meta.type, meta.text);
                    this._applyKeyStyle(key, meta);
                }
            }
            if (layout && layout.updateLayout) layout.updateLayout();
        }
        return tmp;
    },

    // 只有 LETTER / NORMAL 赋 label，其它类型隐藏 label，仅换底图
    _applyKeyStyle(keyComp, meta) {
        const bgSprite = keyComp.buttonBg;
        const setBg = (sf) => {
            if (bgSprite && sf) bgSprite.spriteFrame = sf;
            keyComp.node.width = keyComp.buttonBg.node.width;
        };

        if (keyComp.btnLabel) {
            keyComp.btnLabel.node.active = true;
            keyComp.btnLabel.string = '';
        }

        switch (meta.type) {
            case EnumBtnType.LETTER:
            case EnumBtnType.NORMAL:
                if (keyComp.btnLabel) keyComp.btnLabel.string = meta.text || '';
                if (keyComp.btnLabel_detail) keyComp.btnLabel_detail.string = meta.text || '';
                setBg(this.normal_bg);
                break;

            case EnumBtnType.SYMBOL:
                setBg(this.symbol_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;

            case EnumBtnType.REMOVE:
                setBg(this.remove_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;

            case EnumBtnType.CONFIRM:
                setBg(this.confirm_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;

            case EnumBtnType.VISIBLE:
                setBg(this.visible_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;

            case EnumBtnType.CASE:
                setBg(this.case_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;

            case EnumBtnType.ABC:
                setBg(this.abc_bg);
                if (keyComp.btnLabel) keyComp.btnLabel.node.active = false;
                break;
        }
    },
});
