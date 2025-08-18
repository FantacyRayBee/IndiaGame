cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: { default: 100, type: cc.Float },
        minValue: { default: 1.10, type: cc.Float },
    },

    onLoad() {
        this.editBox.node.on('text-changed', this.onTextChangedNumber, this);
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onTextChangedNumber(editBox) {
        let text = editBox.string;
        if (text === '') return;

        let filtered = text.replace(/[^\d.]/g, '');
        const dotIndex = filtered.indexOf('.');
        if (dotIndex !== -1) {
            filtered =
                filtered.substring(0, dotIndex + 1) +
                filtered.substring(dotIndex + 1).replace(/\./g, '');
        }

        // 保留小数点后两位
        const m = filtered.match(/^(\d+)(\.\d{0,2})?/);
        if (m) filtered = m[0];

        // 限制最大值
        const n = parseFloat(filtered);
        if (!isNaN(n) && n > this.maxValue) {
            filtered = this.maxValue.toFixed(2);
        }

        if (text !== filtered) editBox.string = filtered;
    },

    onEditingDidEnded(editBox) {
        let val = editBox.string;

        if (val === '') {
            editBox.string = this.minValue.toFixed(2);
            return;
        }

        if (val.startsWith('.')) val = '0' + val;
        if (val.endsWith('.')) val += '00';

        let num = parseFloat(val);
        if (isNaN(num)) {
            editBox.string = this.minValue.toFixed(2);
            return;
        }

        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue);
        editBox.string = num.toFixed(2);
    },
});
