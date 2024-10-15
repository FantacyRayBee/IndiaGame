let LoggerUtil = cc.Class({
    
    statics: {
        _instance : null
    },

    ctor: function() {
        this.isOpenStatus = false;
    },

    log: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.log.apply(console, args);
    },

    warn: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.warn.apply(console, args);
    },

    error: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.error.apply(console, args);
    },

    time: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.time.apply(console, args);
    },

    timeEnd: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.timeEnd.apply(console, args);
    },

    assert: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.assert.apply(console, args);
    },

    info: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.info.apply(console, args);
    },


    clear: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.clear.apply(console, args);
    },

    count: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.count.apply(console, args);
    },

    group: function(...args) {
        if (!this.isOpenStatus) {
            return;
        };

        console.group.apply(console, args);
    },


    setLoggerStatus: function(status) {
        this.isOpenStatus = status;
    },

    getLoggerStatus: function() {
        return this.isOpenStatus;
    },
});

LoggerUtil.getInstance = function() {
    if (!LoggerUtil._instance){
        LoggerUtil._instance = new LoggerUtil();
    };
    return LoggerUtil._instance;
};

window.LoggerUtil = LoggerUtil;