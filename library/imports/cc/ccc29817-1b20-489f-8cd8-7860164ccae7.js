"use strict";
cc._RF.push(module, 'ccc29gXGyBIn4zYeGAWTMrn', 'sscWaFaCtrl');
// sscGame/sscScr/sscWaFaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_ok: cc.Button,
    labs: [cc.Label]
  },
  onLoad: function onLoad() {
    var _this = this;

    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();

      _this.node.destroy();
    }, this);
    this.btn_ok.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();

      _this.node.destroy();
    }, this);
    this.labs[0].string = lobbyRuleLanguage.lab_sscWaFa_01[language];
    this.labs[1].string = lobbyRuleLanguage.lab_sscWaFa_02[language];
    this.labs[2].string = lobbyRuleLanguage.lab_sscWaFa_03[language];
    this.labs[3].string = lobbyRuleLanguage.lab_sscWaFa_04[language];
    this.labs[4].string = lobbyRuleLanguage.lab_sscWaFa_05[language];
    this.labs[5].string = lobbyRuleLanguage.lab_sscWaFa_06[language];
    this.labs[6].string = lobbyRuleLanguage.lab_sscWaFa_07[language];
    this.labs[7].string = lobbyRuleLanguage.lab_sscWaFa_08[language];
    this.labs[8].string = lobbyRuleLanguage.lab_sscWaFa_09[language];
    this.labs[9].string = lobbyRuleLanguage.lab_sscWaFa_10[language];
    this.labs[10].string = lobbyRuleLanguage.lab_sscWaFa_11[language];
    this.labs[11].string = lobbyRuleLanguage.lab_sscWaFa_12[language];
    this.labs[12].string = playerCenterLanguage.lab_Okay[language];
    this.showSpriteTranslate(this.node);
  },
  showSpriteTranslate: function showSpriteTranslate(scene) {
    var languageStr = ["", "English", "Hindi", "Urdu", "Bengali"];
    this.spriteAll = scene.getComponentsInChildren(cc.Sprite);

    for (var i = 0; i < this.spriteAll.length; i++) {
      var sprite = this.spriteAll[i];
      var name = sprite.node.name;
      var str = name.split("@");

      if ((str[0] == "English" || str[0] == "Hindi" || str[0] == "Urdu" || str[0] == "Bengali") && sprite.node) {
        sprite.node.active = str[0] == languageStr[language];
      }
    }
  }
});

cc._RF.pop();