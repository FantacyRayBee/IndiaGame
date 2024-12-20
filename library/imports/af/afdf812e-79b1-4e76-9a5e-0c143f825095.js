"use strict";
cc._RF.push(module, 'afdf8EuebFOdppeDBQ/glCV', 'roomInfoCtrl');
// Rummy/rummyScript/roomInfoCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    value: cc.Label,
    valuePlayerNums: cc.Label,
    maxWins: cc.Label,
    lab_note: cc.Label
  },
  onLoad: function onLoad() {
    this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
    this.btn_close.node.on("click", this.btnClick, this);
    this.btn_sure = this.node.getChildByName("btn_sure").getComponent(cc.Button);
    this.btn_sure.node.on("click", this.btnClick, this);
    this.showSpriteTranslate(this.node);
    this.AllLabelNode(this.node);
  },
  setValue: function setValue() {
    var data = JSON.parse(cc.sys.localStorage.getItem('rummyRoomData'));
    this.value.string = data.cellscore / 100;
    this.valuePlayerNums.string = data.num;
    this.maxWins.string = data.num == 2 ? data.cellscore / 100 * 80 : data.cellscore / 100 * 400;
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    if (btnName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
    } else {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
    }
    this.node.destroy();
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
  //显示文字翻译 rummyLanguage
  AllLabelNode: function AllLabelNode(scene) {
    if (rummyLanguage) {
      var sprites = scene.getComponentsInChildren(cc.Label);
      for (var i = 0; i < sprites.length; i++) {
        var name = sprites[i].node.name;
        for (var key in rummyLanguage) {
          if (Object.hasOwnProperty.call(rummyLanguage, key)) {
            var arr = rummyLanguage[key];
            if (name == arr[0]) {
              sprites[i].string = arr[language];
            }
          }
        }
      }
    }
  },
  start: function start() {}
});

cc._RF.pop();