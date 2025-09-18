cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: { default: 100, type: cc.Float },
        minValue: { default: 1.10, type: cc.Float },
    },

    onLoad() {
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onEditingDidEnded(editBox) {
        let text = editBox.string.trim();

        if (text === '') {
            editBox.string = this.minValue.toFixed(2);
            return;
        }

        // 去掉非法字符（只保留数字和一个小数点）
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

        // 如果以 "." 开头，加前缀 0
        if (filtered.startsWith('.')) filtered = '0' + filtered;

        // 如果以 "." 结尾，加上两位小数
        if (filtered.endsWith('.')) filtered += '00';

        let num = parseFloat(filtered);
        if (isNaN(num)) {
            editBox.string = this.minValue.toFixed(2);
            return;
        }

        // 限制范围
        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue);

        // 格式化结果
        editBox.string = num.toFixed(2);
    },
});
