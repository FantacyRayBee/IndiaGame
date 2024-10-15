cc.Class({
    extends: cc.Component,

    properties: {
        labs:[cc.Label]
       
    },

    onLoad () {
        this.btn_close = this.node.getChildByName("btn_close");
        this.btn_ok = this.node.getChildByName("btn_ok");
        this.btn_close.on('click',()=>{
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, this);

        this.btn_ok.on('click',()=>{
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy();
        }, this);
    },

    start () {
        if(this.labs) {
            // this.labs[0].string = lobbyRuleLanguage.lab_munda_06[language].split(",")[0];
            // this.labs[1].string = lobbyRuleLanguage.lab_munda_07[language].split(",")[0];
            // this.labs[2].string = lobbyRuleLanguage.lab_munda_08[language].split(",")[0];
            // this.labs[3].string = lobbyRuleLanguage.lab_munda_09[language].split(",")[0];
            // this.labs[4].string = lobbyRuleLanguage.lab_munda_10[language].split(",")[0];
            // this.labs[5].string = lobbyRuleLanguage.lab_munda_11[language].split(",")[0];
            // this.labs[6].string = lobbyRuleLanguage.lab_munda_06[language].split(",")[1];
            // this.labs[7].string = lobbyRuleLanguage.lab_munda_07[language].split(",")[1];
            // this.labs[8].string = lobbyRuleLanguage.lab_munda_08[language].split(",")[1];
            // this.labs[9].string = lobbyRuleLanguage.lab_munda_09[language].split(",")[1];
            // this.labs[10].string = lobbyRuleLanguage.lab_munda_10[language].split(",")[1];
            // this.labs[11].string = lobbyRuleLanguage.lab_munda_11[language].split(",")[1];
            this.labs[12].string = playerCenterLanguage.lab_Okay[language];
        }
    },

    btnClick:function(button){
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.node.destroy();
    },
    
    // update (dt) {},
});
