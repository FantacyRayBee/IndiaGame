// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lab_life:cc.Label,
      
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setBarLabel:function(name) {
        if(cc.isValid(this.node) && this.lab_life) {
            this.lab_life.string = name;
            this.labelName = name;
        }
      
    },

    start () {

    },

    update (dt) {
        if(cc.isValid(this.node) && this.lab_life) {
            let str = this.labelName;
            let strName = ''
            if(str == "1st Life") {  // 字体的原因字符串排序有问题
                if(language == 3) {
                    strName = otherLanguage.stLife[4]
                } else if(language == 4) {
                    strName = otherLanguage.stLife[3]
                } else{
                    strName =otherLanguage.stLife[language]
                }
            
            } else if(str == "2nd Life") {
                if(language == 3) {
                    strName = otherLanguage.ndLife[4]
                } else if(language == 4) {
                    strName = otherLanguage.ndLife[3]
                } else{
                    strName =otherLanguage.ndLife[language]
                }

            }else if (str == "Set") {
                strName = otherLanguage.set[language]

            } else if(str == "Not Correct") {
                strName = otherLanguage.NotCorrect[language]

            } else if(str == "1st Life Needed") {
                if(language == 3) {
                    strName = otherLanguage.stLifeNeeded[4]
                } else if(language == 4) {
                    strName = otherLanguage.stLifeNeeded[3]
                } else{
                    strName =otherLanguage.stLifeNeeded[language]
                }

            } else if(str == "2nd Life Needed") {
                if(language == 3) {
                    strName = otherLanguage.ndLifeNeeded[4]
                } else if(language == 4) {
                    strName = otherLanguage.ndLifeNeeded[3]
                } else{
                    strName =otherLanguage.ndLifeNeeded[language]
                }

            } else if(str == "Pure Sequence") {
                strName = otherLanguage.PureSequence[language]

            } else if (str == "Sequence") {
                strName = otherLanguage.Sequence[language]

            } 

            this.lab_life.string = strName

        }
    },
});
