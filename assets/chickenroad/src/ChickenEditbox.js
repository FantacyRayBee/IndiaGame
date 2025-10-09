cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: { default: 100, type: cc.Float },
        minValue: { default: 1, type: cc.Float },
        // ✅ 新增布尔属性：是否仅允许整数
        onlyInteger: { default: true, tooltip: "是否只能输入整数（true=整数，false=可带1位小数）" },
    },

    onLoad() {
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onEditingDidEnded(editBox) {
        let text = editBox.string.trim();

        // 空输入 → 设为最小值
        if (text === '') {
            editBox.string = this.minValue.toString();
            return;
        }

        // ✅ 只保留数字与小数点
        let filtered = text.replace(/[^\d.]/g, '');

        // ✅ 只保留第一个小数点
        const firstDot = filtered.indexOf('.');
        if (firstDot !== -1) {
            filtered =
                filtered.slice(0, firstDot + 1) +
                filtered.slice(firstDot + 1).replace(/\./g, '');
        }

        let num = parseFloat(filtered);
        if (isNaN(num)) {
            editBox.string = this.minValue.toString();
            return;
        }

        // ✅ 限制范围
        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue);

        // ✅ 根据 onlyInteger 判断输出格式
        if (this.onlyInteger) {
            // 只保留整数部分
            num = Math.floor(num);
            editBox.string = num.toString();
        } else {
            // 可带 1 位小数
            if (Number.isInteger(num)) {
                editBox.string = num.toString();
            } else {
                editBox.string = parseFloat(num.toFixed(1)).toString();
            }
        }
    },
});
