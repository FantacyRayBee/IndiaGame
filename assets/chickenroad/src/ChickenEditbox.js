cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: { default: 100, type: cc.Integer },
        minValue: { default: 1, type: cc.Integer },
    },

    onLoad() {
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onEditingDidEnded(editBox) {
        let text = editBox.string.trim();

        if (text === '') {
            editBox.string = this.minValue.toString();
            return;
        }
        // 只保留数字
        let filtered = text.replace(/[^\d]/g, '');

        let num = parseInt(filtered, 10);
        if (isNaN(num)) {
            editBox.string = this.minValue.toString();
            return;
        }

        // 限制范围
        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue);

        // 格式化结果（整数）
        editBox.string = num.toString();
    },
});
