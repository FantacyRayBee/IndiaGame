cc.Class({
    extends: cc.Component,

    properties: {
        curBetNum: {
            get: function () {
                return this._curBetNum;
            },
            set: function (value) {
                this._curBetNum = value;
                LoggerUtil.getInstance().log("当前单注值：" + this._curBetNum);
            },
            type: cc.Integer,
            tooltip: "当前下注数"
        },
        btns: {
            default: [],
            type: [cc.Button],
        },
        selectLight: cc.Node,
    },

    ctor() {
        this._curBetNum = 10;
        this.betNumList = [1000, 2000, 5000, 10000, 20000];
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
    },

    onLoad() {
        this.choiceBetButton(this.btns[0], this.selectLight);
        for (let i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];
            btn.node.on("click", (button) => {
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.curBetNum = this.betNumList[i];
                this.choiceBetButton(button, this.selectLight);
            }, this);
        }
    },

    start() {

    },

    initBetNum(arr) {
        if (arr && Array.isArray(arr)) {
            this.betNumList.length = 0;
            this.betNumList = arr.slice(0, 5);
            for (let i = 0; i < this.btns.length; i++) {
                let btn = this.btns[i];
                btn.node.getChildByName('lab').getComponent(cc.Label).string = Math.round(this.betNumList[i] / 100);
            }
            this.curBetNum = this.betNumList[0];
        }
    },

    
    choiceBetButton: function (button, selectLight){
        let scale = 1.1;
        let btnName = button.node.name;
        selectLight.setScale(scale);
        for (let i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];
            if(btn.node.name == btnName){
                btn.node.setScale(scale);
            }else{
                btn.node.setScale(1);
            }
            let widget = btn.node.getComponent(cc.Widget);
            if(widget){
                widget.updateAlignment();
            }
        }
        let pos = button.node.getPosition();
        selectLight.setPosition(pos.x, pos.y + 3.5);
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let len = this.btns.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = this.btns[i].node.getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        }
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },

    update (dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
    },

    onDestroy() {
        this.unschedule(this.scheduleBetSpineTimeCallback);
    },
});
