cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        maxValue: {
            default: 100,
            type: cc.Float,
        },
        minValue: {
            default: 1.10,
            type: cc.Float,
        },
    },

    onLoad() {
        this.editBox.node.on('text-changed', this.onTextChangedNumber, this);
        this.editBox.node.on('editing-did-ended', this.onEditingDidEnded, this);
    },

    onTextChangedNumber(editBox) {
        let text = editBox.string;

        // 移除非法字符（仅保留数字、小数点、负号）
        let filtered = text.replace(/[^\d\.\-]/g, '');

        // 保留一个小数点
        const dotIndex = filtered.indexOf('.');
        if (dotIndex !== -1) {
            filtered = filtered.substring(0, dotIndex + 1) + filtered.substring(dotIndex + 1).replace(/\./g, '');
        }

        // 负号只能出现在最前面（实际上我们不允许负数，所以直接移除）
        filtered = filtered.replace(/\-/g, '');

        // 允许两位小数
        const floatMatch = filtered.match(/^(\d+)(\.\d{0,2})?/);
        if (floatMatch) {
            filtered = floatMatch[0];
        }

        // 限制最大值
        const numValue = parseFloat(filtered);
        if (!isNaN(numValue) && numValue > this.maxValue) {
            filtered = this.maxValue.toFixed(2);
        }

        if (text !== filtered) {
            editBox.string = filtered;
        }
    },
    onEditingDidEnded(editBox) {
        let val = editBox.string;
    
        // 补0格式：例如 ".5" → "0.5"，"1." → "1.00"
        if (val.startsWith('.')) {
            val = '0' + val;
        }
    
        if (val.endsWith('.')) {
            val += '00';
        }
    
        let num = parseFloat(val);
        if (isNaN(num)) {
            editBox.string = '';
            return;
        }
    
        // 限制范围 [minValue, maxValue]
        num = Math.min(num, this.maxValue);
        num = Math.max(num, this.minValue); // 👈 加这一句：最小值限制
    
        // 四舍五入保留两位
        editBox.string = num.toFixed(2);
    }
    
});
