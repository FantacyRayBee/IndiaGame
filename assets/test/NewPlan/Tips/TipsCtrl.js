cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        bgNode: {
            default: null,
            type: cc.Node
        },
    },

    ctor: function() {
        this._rotation = 0;
    },

    onLoad: function() {
        let size = this.label.node.getContentSize();
        this.bgNode.setContentSize(cc.size(700, (size.height/50) * 100));
    },

    onDestroy: function() {
        clearTimeout(this.showContentTimeId);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TIPS);
    },

    setContent (str) {
        this.label.string = str;
        clearTimeout(this.showContentTimeId);
        this.showContentTimeId = setTimeout(this.showConten.bind(this), 1500);
    },

    showConten: function() {
        clearTimeout(this.showContentTimeId);
        this.node.destroy();
    },

    sliceStr:function(str){
        let bgNodeHeight = 50; 
        let newStr ='' 
        let strArr = str.split("\n");
        if (strArr && strArr.length > 0) {
            for (let i = 0; i < strArr.length; i++) {
                newStr += strArr[i];
                newStr += "\n"  
                bgNodeHeight += 40;
            };
        };

        this.scheduleOnce(()=>{
            if (str && this && this.label && this.bgNode) {
                this.label.node.active = true;
                this.bgNode.active = true;
                this.label.string = str;
                this.bgNode.height = bgNodeHeight;
            }
        }, 0)
    },
});
