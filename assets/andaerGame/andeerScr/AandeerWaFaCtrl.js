

cc.Class({
    extends: cc.Component,

    properties: {
        btn_close : cc.Button,
        btn_ok : cc.Button,
        labs : [cc.Label],
    },

    onLoad () {
        this.btn_close.node.on('click',function(){
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, this);

        this.btn_ok.node.on('click',function(){
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy();
        }, this);
    },

    setLabel: function(data) {
        this.labs[0].string = andeerLanguage.lab_wanfa01[language] 
        this.labs[1].string = andeerLanguage.lab_wanfa02[language] 
        this.labs[2].string = andeerLanguage.lab_wanfa03[language] 
        this.labs[4].string = andeerLanguage.lab_ok[language]  
        this.labs[5].string = data.cellscore/100;
        this.labs[6].string = data.maxscore/100;
        this.labs[7].string =  data.entrycondition/100;
        this.labs[8].string =  otherLanguage.andeerWaFa[language]
        this.hindi_itle = this.node.getChildByName("hindi_itle");
        this.english_title = this.node.getChildByName("english_title");
    },

    //显示图片翻译
    showSpriteTranslate: function(scene) {
        let languageStr = ["","English","Hindi","Urdu","Bengali"]
        this.spriteAll = scene.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < this.spriteAll.length; i++) {
            let sprite = this.spriteAll[i];
            let name = sprite.node.name;
            let str = name.split("@");  
            if((str[0] == "English" || str[0] == "Hindi"|| str[0] == "Urdu" || str[0] == "Bengali") && sprite.node) {
                sprite.node.active = str[0] == languageStr[language];
            } 
        }
    },
    
    //显示文字翻译
    AllLabelNode: function(scene) {
        if(andeerLanguage) {
            let sprites = scene.getComponentsInChildren(cc.Label);
            for (let i = 0; i < sprites.length; i++) {
                let name = sprites[i].node.name;
                for (const key in andeerLanguage) {
                    if (Object.hasOwnProperty.call(andeerLanguage, key)) {
                        let arr = andeerLanguage[key];
                        if(name == arr[0]) {
                            sprites[i].string = arr[language];
                        } 
                    }
                }
            }
        }
    },

    start: function() {
        this.showSpriteTranslate(this.node);
        this.AllLabelNode(this.node);
    },
});
