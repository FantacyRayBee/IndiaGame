cc.Class({
    extends: cc.Component,

    properties: {
        value:cc.Label,
        valuePlayerNums:cc.Label,
        maxWins:cc.Label,
        lab_note:cc.Label,
    },

    

    onLoad () {
        this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
        this.btn_close.node.on("click",this.btnClick, this);
        this.btn_sure = this.node.getChildByName("btn_sure").getComponent(cc.Button);
        this.btn_sure.node.on("click",this.btnClick, this);
        this.showSpriteTranslate(this.node);
        this.AllLabelNode(this.node);
        
    },

    setValue(){
        let data = JSON.parse(cc.sys.localStorage.getItem('rummyRoomData'));
        this.value.string = data.cellscore/100;
        this.valuePlayerNums.string = data.num;
        this.maxWins.string = data.num == 2? data.cellscore / 100 * 80 : data.cellscore / 100 * 400;
    },

    btnClick:function(button){
        let btnName = button.node.name;
        if(btnName == "btn_close"){
            GlobalCfg.G_COMPONENTS.Audio.playBack();
        }else{
            GlobalCfg.G_COMPONENTS.Audio.playButton();
        }
        this.node.destroy();
    },

     //显示图片翻译
     showSpriteTranslate: function (scene) {
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

     //显示文字翻译 rummyLanguage
     AllLabelNode:function(scene) {
        if(rummyLanguage) {
            let sprites = scene.getComponentsInChildren(cc.Label);
            for (let i = 0; i < sprites.length; i++) {
                let name = sprites[i].node.name;
                for (const key in rummyLanguage) {
                    if (Object.hasOwnProperty.call(rummyLanguage, key)) {
                        let arr = rummyLanguage[key];
                        if(name == arr[0]) {
                            sprites[i].string = arr[language];
                        } 
                    }
                }
            }
        }
    },


    start () {

    },

});
