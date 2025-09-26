cc.Class({
    extends: cc.Component,

    properties: {},

    // 生命周期函数 - onLoad() 会在场景加载时执行一次
    onLoad() {
        // 监听屏幕方向变化
        this.registerOrientationChangeListener();
    },

    // 注册方向变化监听
    registerOrientationChangeListener() {
        window.addEventListener('orientationchange', () => {
            this.adjustInputFieldForOrientation();
        });
    },

    // 根据当前屏幕方向调整输入框样式
    adjustInputFieldForOrientation() {
        const inputField = document.querySelector('input');
        if (inputField) {
            // 只有在横屏时，才强制聚焦输入框并调整样式
            if (window.orientation === 90 || window.orientation === -90) {
                inputField.style.height = '80px';  // 增加输入框高度
                inputField.style.fontSize = '24px'; // 增大字体大小
                inputField.style.width = '70vw';  // 调整输入框宽度

                // 聚焦输入框，尽量触发横版软键盘
                inputField.focus();
            } else {
                // 竖屏时，恢复输入框的默认样式
                inputField.style.height = '40px';
                inputField.style.fontSize = '16px';
                inputField.style.width = '90vw';
            }
        }
    },

    // 清理监听器
    onDestroy() {
        // 在销毁时清除事件监听
        window.removeEventListener('orientationchange', this.adjustInputFieldForOrientation);
    },
});
