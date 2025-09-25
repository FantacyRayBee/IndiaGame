let EnumBtnType = cc.Enum({
    Music: 1,
    Effect: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        btn_music: cc.Button,
        btn_effect: cc.Button,
        btn_close: cc.Button,
        toggle_English: cc.Toggle,
        toggle_Hindi: cc.Toggle,
        toggle_Urdu: cc.Toggle,
        toggle_Bengali: cc.Toggle,
    },


    onLoad: function() {
        this.toggle_English.node.on('click', this.toggleClick, this);
        this.toggle_Hindi.node.on('click', this.toggleClick, this);
        this.toggle_Urdu.node.on('click', this.toggleClick, this);
        this.toggle_Bengali.node.on('click', this.toggleClick, this);

        this.btn_music.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_effect.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.setMusicEffectBtns(EnumBtnType.Music);
        this.setMusicEffectBtns(EnumBtnType.Effect);

        let languagesType = I18NUtil.getInstance().getLanguageType();
        this.setToggleLanguage(languagesType);
    },

    toggleClick: function (toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let name = toggle.node.name;
        let languageType = null;
        switch (name) {
            case "toggle_English":
                languageType = I18NLanguagesEnum.English;
                break;
            case "toggle_Hindi":
                languageType = I18NLanguagesEnum.Hindi;
                break;
            case "toggle_Urdu":
                languageType = I18NLanguagesEnum.Urdu;
                break;
            case "toggle_Bengali":
                languageType = I18NLanguagesEnum.Bengali;
                break;
            default:
                languageType = I18NLanguagesEnum.English;
                break;
        };

        I18NUtil.getInstance().setLanguageType(languageType);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_music.node.name:
                this.dealMusicEffectBtnEvent(EnumBtnType.Music);
                break;
            case this.btn_effect.node.name:
                this.dealMusicEffectBtnEvent(EnumBtnType.Effect);
                break;
            case this.btn_close.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.node.destroy();
                return;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },


    dealMusicEffectBtnEvent: function(type) {
        let state = null;
        if (type == EnumBtnType.Music) {
            if (true === GlobalCfg.G_COMPONENTS.Audio.checkState("toggle_yinyun")) {
                GlobalCfg.G_COMPONENTS.Audio.closeMusic();
            }else{
                GlobalCfg.G_COMPONENTS.Audio.openMusic();
            }
        }
        else if (type == EnumBtnType.Effect) {
            if (true === GlobalCfg.G_COMPONENTS.Audio.checkState("toggle_yinxiao")) {
                GlobalCfg.G_COMPONENTS.Audio.closeSound();
            }else{
                GlobalCfg.G_COMPONENTS.Audio.openSound();
            }
        };

        this.setMusicEffectBtns(type);
    },
    
    setToggleLanguage: function(languagesType) {
        this.toggle_English.isChecked = languagesType == I18NLanguagesEnum.English;
        this.toggle_Hindi.isChecked = languagesType == I18NLanguagesEnum.Hindi;
        this.toggle_Urdu.isChecked = languagesType == I18NLanguagesEnum.Urdu;
        this.toggle_Bengali.isChecked = languagesType == I18NLanguagesEnum.Bengali;
    },

    setMusicEffectBtns: function (type) {
        if (type == EnumBtnType.Music) {
            let state = GlobalCfg.G_COMPONENTS.Audio.checkState('toggle_yinyun');
            this.btn_music.node.getChildByName("Background").getChildByName("btn_guan").active = !state;
            this.btn_music.node.getChildByName("Background").getChildByName("btn_kai").active = state;
        }
        else if (type == EnumBtnType.Effect) {
            let state = GlobalCfg.G_COMPONENTS.Audio.checkState('toggle_yinxiao');
            this.btn_effect.node.getChildByName("Background").getChildByName("btn_guan").active = !state;
            this.btn_effect.node.getChildByName("Background").getChildByName("btn_kai").active = state;
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMESETTING);
    },
});
