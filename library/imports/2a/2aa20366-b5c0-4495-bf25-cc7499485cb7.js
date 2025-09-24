"use strict";
cc._RF.push(module, '2aa20NmtcBElb8lzHSZSFy3', 'AandeerWaFaCtrl');
// andaerGame/andeerScr/AandeerWaFaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_ok: cc.Button,
    labs: [cc.Label]
  },
  onLoad: function onLoad() {
    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    }, this);
    this.btn_ok.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.node.destroy();
    }, this);
  },
  setLabel: function setLabel(data) {
    this.labs[0].string = andeerLanguage.lab_wanfa01[language];
    this.labs[1].string = andeerLanguage.lab_wanfa02[language];
    this.labs[2].string = andeerLanguage.lab_wanfa03[language];
    this.labs[4].string = andeerLanguage.lab_ok[language];
    this.labs[5].string = data.cellscore / 100;
    this.labs[6].string = data.maxscore / 100;
    this.labs[7].string = data.entrycondition / 100;
    this.labs[8].string = otherLanguage.andeerWaFa[language];
    this.hindi_itle = this.node.getChildByName("hindi_itle");
    this.english_title = this.node.getChildByName("english_title");
  },
  //显示图片翻译
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
  },
  //显示文字翻译
  AllLabelNode: function AllLabelNode(scene) {
    if (andeerLanguage) {
      var sprites = scene.getComponentsInChildren(cc.Label);

      for (var i = 0; i < sprites.length; i++) {
        var name = sprites[i].node.name;

        for (var key in andeerLanguage) {
          if (Object.hasOwnProperty.call(andeerLanguage, key)) {
            var arr = andeerLanguage[key];

            if (name == arr[0]) {
              sprites[i].string = arr[language];
            }
          }
        }
      }
    }
  },
  start: function start() {
    this.showSpriteTranslate(this.node);
    this.AllLabelNode(this.node);
  }
});

cc._RF.pop();