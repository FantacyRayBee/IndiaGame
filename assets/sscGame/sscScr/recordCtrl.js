
cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        pab_winTepy: cc.Prefab,
        node_content: cc.Node,
        node_redDot: cc.Node,
        labs: [cc.Label],
        lab_name: [cc.Label],
    },


    onLoad() {
        this.btn_close.node.on('click', function () {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, this)
    },

    setRecordDate: function (notify) {
        let index = 0;
        let posX = 0;
        let recordLen = 0;
        let list = notify.list;
        let unJackpotCount = notify.unJackpotCount
        this.setLab(list, unJackpotCount);
        let len = list.length <= 55 ? list.length : list.length - 55;
        this.node_content.destroyAllChildren()
        this.node_redDot.destroyAllChildren()
        for (let i = len; i < list.length; i++) {
            let pab_winTepy = cc.instantiate(this.pab_winTepy);
            this.node_content.addChild(pab_winTepy);
            let Ctrl = pab_winTepy.getComponent('winTepyCtrl');
            Ctrl.showNode("record", list[i]);
            if (i == list.length - 1) {
                pab_winTepy.getChildByName("bq_new").active = true;
            }
        }

        if (list.length > 27) {   //设置红点坐标
            posX = -390;
            recordLen = list.length > 27 ? list.length - 27 : 0;
        } else {
            recordLen = 0;
            posX = 520;
        }
        for (let i = recordLen; i < list.length; i++) {
            let pab_winTepy = cc.instantiate(this.pab_winTepy);
            this.node_redDot.addChild(pab_winTepy);
            let Ctrl = pab_winTepy.getComponent('winTepyCtrl');
            Ctrl.showNode("redDot", list[i])
            pab_winTepy.x = posX + index * 35
            index++
        }
    },


    setLab: function (list, unJackpotCount) {
        let SET = 0;
        let PURESEQ = 0;
        let SEQ = 0;
        let COLOR = 0;
        let PAIR = 0;
        let HIGHCARD = 0;

        for (let i = 0; i < list.length; i++) {
            let date = list[i];
            if (date == 0) {
                SET++
            } else if (date == 1) {
                PURESEQ++
            } else if (date == 2) {
                SEQ++
            } else if (date == 3) {
                COLOR++
            } else if (date == 4) {
                PAIR++
            } else if (date == 5) {
                HIGHCARD++
            }
        }

        this.labs[0].string = list.length;
        this.labs[1].string = SET;
        this.labs[2].string = PURESEQ;
        this.labs[3].string = SEQ;
        this.labs[4].string = COLOR;
        this.labs[5].string = PAIR;
        this.labs[6].string = HIGHCARD;

        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (languagesType == I18NLanguagesEnum.Bengali) {
            this.labs[7].string = "জ্যাকপট  " + unJackpotCount + "  ড্র বাকি";
        }
        else {
            this.labs[7].string = "JACKPOT  " + unJackpotCount + "  DRAWS LEFT";
        }
        this.lab_name[0].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_all']) + " :"
        this.lab_name[1].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_set']) + " :"
        this.lab_name[2].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_pure seq']) + " :"
        this.lab_name[3].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_seq']) + " :"
        this.lab_name[4].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_color']) + " :"
        this.lab_name[5].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_pair']) + " :"
        this.lab_name[6].string = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['sscGame_high card']) + " :"
    },
});
