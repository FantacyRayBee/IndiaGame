

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
    },

    start() {
    },

    getSpeedRate: function (x) {
        // LoggerUtil.getInstance().log("🎯 getSpeedRate x: ", x);
        let y = 1;
        if (x >= 0 && x <= 3.5) {
            y = 1 + 6 * x * x / 245;
        } else if (x > 3.5 && x <= 8) {
            y = 1174 / 1035 + 14 * x * x / 1035;
        } else if (x > 8 && x <= 21) {
            y = 498 / 377 + 4 * x * x / 377;
        } else if (x > 21 && x <= 31) {
            y = -849 / 520 + 9 * x * x / 520;
        } else if (x > 31 && x <= 39) {
            y = -1203 / 112 + 3 * x * x / 112;
        } else if (x > 39 && x <= 47) {
            y = -12495 / 344 + 15 * x * x / 344;
        } else if (x > 47 && x <= 55) {
            y = -6965 / 68 + 5 * x * x / 68;
        } else if (x > 55 && x <= 63) {
            y = -8045 / 59 + 5 * x * x / 59;
        } else if (x > 63 && x <= 71) {
            y = -32735 / 134 + 15 * x * x / 134;
        } else if (x > 71 && x <= 81) {
            y = -21049 / 76 + 9 * x * x / 76;
        } else if (x > 81 && x <= 111) {
            y = -38675 / 32 + 25 * x * x / 96;
        } else if (x > 111 && x <= 200) {
            y = -536050000 / 27679 + 48000 * x * x / 27679;
        } else {
            // 超出范围，返回默认值
            y = 1;
        }
        // LoggerUtil.getInstance().log("🎯 getSpeedRate y: ", y);
        return y;
    },
});