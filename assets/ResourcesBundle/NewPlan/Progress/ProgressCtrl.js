cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: {
            default: null,
            type: cc.Label
        },
    },

    setContent:function (str = "") {
        this.lab_content.string = str;
    },
});