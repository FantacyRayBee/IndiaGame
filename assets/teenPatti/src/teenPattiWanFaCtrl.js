/*
 * @Author: 李康
 * @Date: 2021-12-01 15:46:29
 * @LastEditTime: 2021-12-01 16:49:39
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiWanFaCtrl.js
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        this.lab_1 = this.viewList["bg_xx1/lab_1"].getComponent(cc.Label);
        this.lab_bootAmount = this.viewList["bg_xx1/lab_bootAmount"].getComponent(cc.Label);
        this.lab_2 = this.viewList["bg_xx2/lab_2"].getComponent(cc.Label);
        this.lab_chaalLimit = this.viewList["bg_xx2/lab_chaalLimit"].getComponent(cc.Label);
        this.lab_3 = this.viewList["bg_xx3/lab_3"].getComponent(cc.Label);
        this.lab_maxBlinds = this.viewList["bg_xx3/lab_maxBlinds"].getComponent(cc.Label);
        this.lab_4 = this.viewList["bg_xx4/lab_4"].getComponent(cc.Label);
        this.lab_potLimit = this.viewList["bg_xx4/lab_potLimit"].getComponent(cc.Label);

        this.lab_ok = this.viewList["btn_ok/Background/lab_ok"].getComponent(cc.Label);
        
        this.viewList["english_title"].active = false;
        this.viewList["hindi_title"].active = false;
        let titleArr =  [null,this.viewList["english_title"],this.viewList["hindi_title"],this.viewList["Urdu_title"],this.viewList["Bengali_title"]]
        titleArr[language].active = true,


        this.node_btn_ok = this.viewList["btn_ok"];
        this.node_btn_close = this.viewList["btn_close"];
        this.node_btn_ok.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
        this.node_btn_close.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
    },

    setTeenPattiWaFanView: function(data) {
        if (!data) {
            return;
        };

        let language = cc.sys.localStorage.getItem("language");
        language = language == null ? 1 : language;
        this.lab_1.string = teenPattiLanguage.lab_bootAmountTips[language],
        this.lab_2.string = teenPattiLanguage.lab_chaalLimitTips[language],
        this.lab_3.string = teenPattiLanguage.lab_maxBlindsTips[language],
        this.lab_4.string = teenPattiLanguage.lab_potLimitTips[language],
        this.lab_ok.string = playerCenterLanguage.lab_Okay[language],

        this.lab_bootAmount.string = data.cellScore / 100;
        this.lab_chaalLimit.string = data.maxJetton / 100;
        this.lab_maxBlinds.string = (data.blind ? teenPattiLanguage.lab_maxBlinds[language]:4);
        this.lab_potLimit.string = data.maxTableJetton / 100;
    },

    btnClickCall: function(btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_ok") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy();
        }
        else if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }
    },
});
