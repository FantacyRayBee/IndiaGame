let EnumBtnType = cc.Enum({
    Music: 1,
    Effect: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        btn_musicAdd: cc.Button,
        btn_musicAtt: cc.Button,
        btn_effectAdd: cc.Button,
        btn_effectAtt: cc.Button,
        btn_close: cc.Button,

        img_progress_music: cc.Sprite,
        img_progress_effect: cc.Sprite,
    },


    onLoad: function() {
        this.btn_musicAdd.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_musicAtt.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_effectAdd.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_effectAtt.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);

        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.soundArr = [0, 0.33, 0.66, 1];
        this.effectSoundIndex = 0;
        this.musicSoundIndex = 0;
        this.initSound();
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_musicAdd.node.name:
                this.musicSoundIndex++;
                this.dealMusicEffectBtnEvent(EnumBtnType.Music);
                break;
            case this.btn_musicAtt.node.name:
                this.musicSoundIndex--;
                this.dealMusicEffectBtnEvent(EnumBtnType.Music);
                break;
            case this.btn_effectAdd.node.name:
                this.effectSoundIndex++;
                this.dealMusicEffectBtnEvent(EnumBtnType.Effect);
                break;
            case this.btn_effectAtt.node.name:
                this.effectSoundIndex--;
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

    initSound: function() {
        let musicVolume = GlobalCfg.G_COMPONENTS.Audio.getMusicVolume()
        this.musicSoundIndex = this.getIndexByValue(musicVolume)
        this.img_progress_music.fillRange = musicVolume;

        let effectVolume = GlobalCfg.G_COMPONENTS.Audio.getSoundVolume()
        this.effectSoundIndex = this.getIndexByValue(effectVolume)
        this.img_progress_effect.fillRange = effectVolume;
    },

    getIndexByValue: function(value) {
        if (value >= 0 && value < 0.33) {
            return 0;
        } else if (value >= 0.33 && value < 0.66) {
            return 1;
        }else if (value >= 0.66 && value < 1) {
            return 2;
        } else if (value > 0.66) {
            return 3;
        }
    },

    dealMusicEffectBtnEvent: function(type) {
        if (type == EnumBtnType.Music) {
            if (this.musicSoundIndex >= 3) {
                this.musicSoundIndex = 3;
            }
            if (this.musicSoundIndex <= 0) {
                this.musicSoundIndex = 0;
            }
            LoggerUtil.getInstance().log(`dealMusicEffectBtnEvent this.musicSoundIndex : ${this.musicSoundIndex}`);

            let musicSound = this.soundArr[this.musicSoundIndex];
            GlobalCfg.G_COMPONENTS.Audio.setMusicVolume(musicSound);
            this.img_progress_music.fillRange = musicSound;
        }
        else if (type == EnumBtnType.Effect) {
            if (this.effectSoundIndex >= 3) {
                this.effectSoundIndex = 3;
            }
            if (this.effectSoundIndex <= 0) {
                this.effectSoundIndex = 0;
            }
            LoggerUtil.getInstance().log(`dealMusicEffectBtnEvent this.effectSoundIndex : ${this.effectSoundIndex}`);

            let effectSound = this.soundArr[this.effectSoundIndex];
            GlobalCfg.G_COMPONENTS.Audio.setSoundVolume(effectSound);
            this.img_progress_effect.fillRange = effectSound;
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMESETTINGNEW);
    },
});
