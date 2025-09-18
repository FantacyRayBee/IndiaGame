cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad() {
        this.mapConfig = {
            easy: [
                1.03, 1.07, 1.12, 1.17, 1.23, 1.29, 1.36, 1.44, 1.53, 1.63, 1.75, 1.88, 
                2.04, 2.22, 2.45, 2.72, 3.06, 3.5, 4.08, 4.9, 6.13, 6.61, 9.81, 19.81
            ],
            medium: [
                1.12, 1.28, 1.47, 1.7, 1.98, 2.33, 2.76, 3.32, 4.03, 4.96, 6.2, 6.91, 
                8.9, 11.74, 15.99, 22.61, 33.58, 53.2, 92.17, 182.51, 457.71, 1788.8
            ],
            hard: [
                1.23, 1.55, 1.98, 2.56, 3.36, 4.49, 5.49, 7.53, 10.56, 15.21, 22.59, 34.79, 
                55.97, 94.99, 172.42, 341.4, 760.46, 2007.63, 6956.47, 41321.43
            ],
            hardcore: [
                1.63, 2.8, 4.95, 9.08, 15.21, 30.12, 62.96, 140.24, 337.19, 890.19, 
                2643.89, 9161.08, 39301.05, 23448.29, 2542251.93
            ]
        };

        // 在线人数配置（按印度时间）
        this.onlineConfig = [
            { start: 2,  end: 6,  min: 2000, max: 4000 },
            { start: 6,  end: 10, min: 3000, max: 5000 },
            { start: 10, end: 14, min: 5000, max: 8000 },
            { start: 14, end: 20, min: 8000, max: 12000 },
            { start: 20, end: 24, min: 8000, max: 12000 },
            { start: 0,  end: 2,  min: 8000, max: 12000 }
        ];
    },
    getMapConfig(difficulty) {
        switch (difficulty) {
            case 0:
                return this.mapConfig["easy"];
            case 1:
                return this.mapConfig["medium"];
            case 2:
                return this.mapConfig["hard"];
            case 3:
                return this.mapConfig["hardcore"];
            default:
                cc.warn("未知的难度编号: " + difficulty);
                return null;
        }
    },


    // 获取当前时间的印度时区小时
    getIndiaHour() {
        let nowUtc = new Date();
        // 印度时区 +5:30，换算毫秒
        let indiaTime = new Date(nowUtc.getTime() + (5.5 * 60 * 60 * 1000));
        return indiaTime.getUTCHours();
    },

    // 获取当前在线人数（随机区间值）
    getOnlineCount() {
        let hour = this.getIndiaHour();
        for (let i = 0; i < this.onlineConfig.length; i++) {
            let cfg = this.onlineConfig[i];
            if (hour >= cfg.start && hour < cfg.end) {
                return this.randInt(cfg.min, cfg.max);
            }
        }
        // 没匹配到（理论不会走到这），默认给一个
        return this.randInt(2000, 4000);
    },

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
