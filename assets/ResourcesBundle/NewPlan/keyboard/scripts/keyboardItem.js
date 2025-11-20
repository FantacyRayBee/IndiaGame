// KeyboardBuilder.js —— 单个按键脚本（挂在按键节点上）
let EnumBtnType = cc.Enum({
    NORMAL: 0,   // 普通（用于数字/符号字符等通用键）
    LETTER: 1,   // 字母（可切换大小写）
    REMOVE: 2,   // 删除
    CONFIRM: 3,  // 确认/GO
    SYMBOL: 4,   // 符号面板切换键（自身不写label也可以）
    VISIBLE: 5,  // 显示/眼睛（自身不写label）
    CASE: 6,     // 大小写（自身不写label）
    ABC: 7,     // 字母面板切换键（自身不写label）
});

cc.Class({
    extends: cc.Component,

    properties: {
        btnLabel: { default: null, type: cc.Label, tooltip: '按钮文本' },
        buttonBg: cc.Sprite,

        node_detail: cc.Node,       // 按下时显示的放大气泡
        btnLabel_detail: cc.Label,  // 气泡里的文本
    },

    onLoad () {
        // —— 内部状态 —— //
        this._isUpper = false;                 // 当前是否大写（仅对 LETTER 生效）
        this._rawText = this._readLabel();     // 原始基准文本（LETTER 用它做大小写转换）

        // 兜底获取 detail 的 Label
        if (!this.btnLabel_detail && this.node_detail) {
            const lbl = this.node_detail.getComponentInChildren(cc.Label);
            if (lbl) this.btnLabel_detail = lbl;
        }
        if (this.node_detail) this.node_detail.active = false;

        // 触摸事件：按下/松开/取消
        this.node.on(cc.Node.EventType.TOUCH_START, this._onPress, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onRelease, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onCancel, this);
    },

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onPress, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onRelease, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onCancel, this);
    },
    setBtnType (enumBtnType, text = '') {
        this.btnType = enumBtnType;
        this._rawText = String(text || '');
        this._applyDisplay(false);
    },

    // —— 大小写切换 API（可被外层统一调用） —— //
    // 切换小写（仅 LETTER）
    toLowerCase () {
        if (this.btnType !== EnumBtnType.LETTER) return;
        this._isUpper = false;
        this._applyDisplay(true);
    },

    // 切换大写（仅 LETTER）
    toCapitalized () {
        if (this.btnType !== EnumBtnType.LETTER) return;
        this._isUpper = true;
        this._applyDisplay(true);
    },

    // 统一设置大小写
    setCase (isUpper) {
        if (isUpper) this.toCapitalized();
        else this.toLowerCase();
    },

    // —— 内部逻辑 —— //
    _readLabel () {
        return this.btnLabel ? (this.btnLabel.string || '') : '';
    },

    // 本次要显示/输出的最终文本
    _currentText () {
        const base = this._rawText || this._readLabel() || '';
        if (this.btnType !== EnumBtnType.LETTER) return base; // 仅 LETTER 受大小写影响
        return this._isUpper ? base.toLocaleUpperCase('en-US') : base.toLocaleLowerCase('en-US');
    },

    // 把当前文本应用到显示（以及气泡文本）
    _applyDisplay (syncDetail) {
        const txt = this._currentText();
        if (this.btnLabel) this.btnLabel.string = txt;
        if (syncDetail && this.node_detail && this.btnLabel_detail) {
            this.btnLabel_detail.string = txt;
        }
    },

    _shouldShowDetail () {
        // 需求：按下时 NORMAL / LETTER / SYMBOL 显示气泡
        return (
            this.btnType === EnumBtnType.NORMAL ||
            this.btnType === EnumBtnType.LETTER
        );
    },

    _onPress () {
        cc.log('[DEBUG] btnType=', this.btnType, 'rawText=', this._rawText);
        if (this._shouldShowDetail() && this.node_detail) {
            // 按下时同步一次（避免上层刚切换大小写后气泡文字不同步）
            this._applyDisplay(true);
            this.node_detail.active = true;
        }
    },

    _onRelease () {
        if (this.node_detail) this.node_detail.active = false;

        // 松开时输出内容/派发事件（输出的是当前显示文本）
        switch (this.btnType) {
            case EnumBtnType.NORMAL:
            case EnumBtnType.LETTER:{
                const ch = this._currentText();
                cc.systemEvent.emit('SOFTKB_INPUT', { detail: { type: 'CHAR', ch } });
                break;
            }
            case EnumBtnType.REMOVE:
                cc.systemEvent.emit('SOFTKB_INPUT', { detail: { type: 'BACK' } });
                break;
            case EnumBtnType.CONFIRM:
                cc.systemEvent.emit('SOFTKB_DONE', {});
                // 你已有的 ClientNotify 保留
                if (typeof ClientNotify !== 'undefined' && window.GlobalCfg) {
                    try { ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "KB_SOFTKB_DONE", msgData: {} }); } catch(e){}
                }
                break;
            case EnumBtnType.CASE:
                // 这里只是 CASE 键本身，如果你需要在这里直接切全局大小写，可以发自定义事件
                if (typeof ClientNotify !== 'undefined' && window.GlobalCfg) {
                    try { ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "KB_SOFTKB_CASE", msgData: {} }); } catch(e){}
                }
                break;
            case EnumBtnType.VISIBLE:
                cc.systemEvent.emit('SOFTKB_INPUT', { detail: { type: 'VISIBLE_TOGGLE' } });
                break;
            case EnumBtnType.ABC:
                if (typeof ClientNotify !== 'undefined' && window.GlobalCfg) {
                    try { ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "KB_SOFTKB_SYMBOL", msgData: {isSymbol: false} }); } catch(e){}
                }
                break;
            case EnumBtnType.SYMBOL: 
                if (typeof ClientNotify !== 'undefined' && window.GlobalCfg) {
                    try { ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "KB_SOFTKB_SYMBOL", msgData: {isSymbol: true} }); } catch(e){}
                }
                break;
        }
    },

    _onCancel () {
        if (this.node_detail) this.node_detail.active = false;
    },
});
