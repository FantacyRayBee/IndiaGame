
cc.Class({
    extends: cc.Component,

    properties: {
        btnWithDraw: cc.Button,
        labNum: cc.Label,
        labNum2: cc.Label,
        btn_close: cc.Button,
    },

    onLoad() {
        let defaultWithDrawNum = 100;
        let curDiamond = GlobalCfg.USER_DATAS.userDiamond;
        if (curDiamond > 10000) {
            defaultWithDrawNum = Math.floor(curDiamond / 10000) * 100;
        };
        this.setConfig(defaultWithDrawNum);

        this.btn_close.node.on("click", CommonFun.getInstance().debounce(() => {
            this.node.destroy();
        }, 1), this);
        
        this.btn_close.node.active = CommonFun.getInstance().isShowWithdrawToastCloseBtn();
    },

    start() {
        this.btnWithDraw.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showWithDraw();
        }, this);
    },

    
    setConfig(num) {
        this.labNum.string = "" + num;
        this.labNum2.string = "$" + num;
    },

    showWithDraw() {
        if (SceneManager.getInstance().curSceneType == SceneManager.getInstance().sceneType.LOBBY) {
            CommonFun.getInstance().showWithDrawPreData();
        }
        else {
            window["isNeedShowWithDrawPreData"] = true;
            SceneManager.getInstance().changeScene(SceneManager.getInstance().curSceneType, SceneManager.getInstance().sceneType.LOBBY);
        };
        this.node.destroy();
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.POPUPWITHDRAW);
    },
});
