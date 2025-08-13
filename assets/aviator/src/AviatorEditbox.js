cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: { default: 100, type: cc.Float },
        minValue: { default: 1.10, type: cc.Float },
    },

    onLoad() {
        this._valueBeforeFocus = '';
        this._clearingPhase = false;       // 聚焦后原生端多帧清空阶段
        this._enforceClearTicks = 0;       // 已执行的清空帧数
        this._didAnyInput = false;         // 是否在本次编辑期间有过输入
        this._pendingRestore = null;       // 延迟回填原值的任务句柄

        this.editBox.node.on('editing-did-began', this.onEditingDidBegan, this);
        this.editBox.node.on('text-changed', this.onTextChangedNumber, this);
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onEditingDidBegan(editBox) {
        if (this._pendingRestore) {
            this.unschedule(this._pendingRestore);
            this._pendingRestore = null;
        }

        this._valueBeforeFocus = editBox.string || '';
        this._didAnyInput = false;
        this._clearingPhase = true;
        this._enforceClearTicks = 0;

        if (cc.sys.isBrowser) {
            if (editBox.string !== '') editBox.string = '';
            this.setCursorToLeft(editBox);
            this._clearingPhase = false;
            return;
        }

        if (cc.sys.isNative) {
            this.schedule(this._enforceClearOnce, 0, 6, 0); // 原生端多帧稳清空（最多约100ms）
        }
    },

    _enforceClearOnce() {
        this._enforceClearTicks++;
        if (!this._clearingPhase) { this.unschedule(this._enforceClearOnce); return; }

        const eb = this.editBox;
        if (!this._didAnyInput) {
            if (eb.string !== '') eb.string = '';
        } else {
            this._clearingPhase = false;
            this.unschedule(this._enforceClearOnce);
        }

        if (this._enforceClearTicks >= 6) {
            this._clearingPhase = false;
            this.unschedule(this._enforceClearOnce);
        }
    },

    onTextChangedNumber(editBox) {
        if (this._clearingPhase) return;

        let text = editBox.string;
        if (text === '') return;

        this._didAnyInput = true;

        let filtered = text.replace(/[^\d.]/g, '');
        const dotIndex = filtered.indexOf('.');
        if (dotIndex !== -1) {
            filtered = filtered.substring(0, dotIndex + 1) + filtered.substring(dotIndex + 1).replace(/\./g, '');
        }

        const m = filtered.match(/^(\d+)(\.\d{0,2})?/);
        if (m) filtered = m[0];

        const n = parseFloat(filtered);
        if (!isNaN(n) && n > this.maxValue) {
            filtered = this.maxValue.toFixed(2);
        }

        if (text !== filtered) editBox.string = filtered;
    },

    onEditingDidEnded(editBox) {
        this._clearingPhase = false;
        this.unschedule(this._enforceClearOnce);

        const doRestore = () => {
            editBox.string = (typeof this._valueBeforeFocus === 'string' && this._valueBeforeFocus !== '')
                ? this._valueBeforeFocus
                : this.minValue.toFixed(2);
        };

        let val = editBox.string;

        if (val === '') {
            // 可能存在“刚开始编辑即触发 did-ended”的机型：延迟回填，若短时间内再次 began，会被取消
            this._pendingRestore = this.scheduleOnce(() => {
                doRestore();
                this._pendingRestore = null;
            }, 0.12);
            return;
        }

        if (val.startsWith('.')) val = '0' + val;
        if (val.endsWith('.')) val += '00';

        let num = parseFloat(val);
        if (isNaN(num)) {
            doRestore();
            return;
        }

        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue);
        editBox.string = num.toFixed(2);
    },

    setCursorToLeft(editBox) {
        setTimeout(() => {
            if (cc.sys.isBrowser && editBox._impl && editBox._impl._edTxt) {
                try { editBox._impl._edTxt.setSelectionRange(0, 0); } catch (e) {}
            }
        }, 0);
    },
});
