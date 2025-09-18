let EnumBtnType = cc.Enum({
    Music: 1,
    Effect: 2,
    Aniamtion: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        tog_sound: cc.Toggle,
        tog_music: cc.Toggle,
        tog_animation: cc.Toggle,

        sprite_tx: cc.Sprite,
        userName: cc.Label,

        btn_provably: cc.Button,
        btn_rule: cc.Button,
        btn_mybet: cc.Button,
        btn_how: cc.Button,
        btn_limit: cc.Button,
        btn_changeHead: cc.Button,
        btn_Free: cc.Button,

        pabfabProvably: cc.Prefab,
        prefabRule: cc.Prefab,
        prefabLimit: cc.Prefab,
        prefabChangeHead: cc.Prefab,
        prefabHowToPlay: cc.Prefab,
        prefabFree: cc.Prefab,

        atlas_head: cc.SpriteAtlas,
    },

    onLoad() {
        this.tog_sound.node.on('toggle', this.onToggleSound, this);
        this.tog_music.node.on('toggle', this.onToggleMusic, this);
        this.tog_animation.node.on('toggle', this.onToggleAnimation, this);

        this.btn_provably.node.on('click', this.onBtnProvably, this);
        this.btn_rule.node.on('click', this.onBtnRule, this);
        this.btn_mybet.node.on('click', this.onBtnMybet, this);
        this.btn_limit.node.on('click', this.onBtnlimit, this);
        this.btn_changeHead.node.on('click', this.onBtnChangeHead, this);
        this.btn_how.node.on('click', this.onBtnHowToPlay, this);
        this.btn_Free.node.on('click', this.onBtnFree, this);


        this.setMusicEffectBtns(EnumBtnType.Music);
        this.setMusicEffectBtns(EnumBtnType.Effect);
        this.setMusicEffectBtns(EnumBtnType.Aniamtion);
    },

    start() {
        this.loadHeadSp();
        this.userName.string = GlobalCfg.USER_DATAS.userId;
    },

    loadHeadSp: function () {
        this.sprite_tx.spriteFrame = this.atlas_head.getSpriteFrame('head_' + GlobalCfg.ACT_SCENE_CTRL.headId);
    },

    onToggleSound(toggle) {
        if (toggle.isChecked) {
            GlobalCfg.G_COMPONENTS.Audio.openSound();
        } else {
            GlobalCfg.G_COMPONENTS.Audio.closeSound();
        }
    },

    onToggleMusic(toggle) {
        if (toggle.isChecked) {
            GlobalCfg.G_COMPONENTS.Audio.openMusic();
        } else {
            GlobalCfg.G_COMPONENTS.Audio.closeMusic();
        }
    },
    onToggleAnimation(toggle) {
        GlobalCfg.ACT_SCENE_CTRL.setAviatorAnimation(toggle.isChecked);
    },

    onBtnProvably() {
        let node = cc.instantiate(this.pabfabProvably);
        node.setPosition(cc.v2(0, -440));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },
    onBtnRule() {
        let node = cc.instantiate(this.prefabRule);
        node.setPosition(cc.v2(0, -782));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },
    onBtnMybet() {
        GameServerManager.send("gameservice.getplayerrecord", "GetPlayerRecordReq", {});
        this.node.destroy();
    },
    onBtnlimit() {
        let node = cc.instantiate(this.prefabLimit);
        node.setPosition(cc.v2(0, -80));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },
    onBtnChangeHead() {
        let node = cc.instantiate(this.prefabChangeHead);
        node.setPosition(cc.v2(0, -200));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },

    onBtnHowToPlay() {
        let node = cc.instantiate(this.prefabHowToPlay);
        node.setPosition(cc.v2(0, -290));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },

    onBtnFree() {
        let node = cc.instantiate(this.prefabFree);
        node.setPosition(cc.v2(0, -142));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = true;

        this.node.destroy();
    },

    setMusicEffectBtns: function (type) {
        if (type == EnumBtnType.Music) {
            let state = GlobalCfg.G_COMPONENTS.Audio.checkState('toggle_yinyun');
            this.tog_music.isChecked = state;
        }
        else if (type == EnumBtnType.Effect) {
            let state = GlobalCfg.G_COMPONENTS.Audio.checkState('toggle_yinxiao');
            this.tog_sound.isChecked = state;
        }
        else if (type == EnumBtnType.Aniamtion) {
            this.tog_animation.isChecked = GlobalCfg.ACT_SCENE_CTRL.isHideAviatorAnim;
        }
    },
});