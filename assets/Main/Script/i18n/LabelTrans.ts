import { componentTypeEnum, I18NLanguagesEnum, I18NUtil, I18NLabelTransIdEnum } from './i18nUtil';


const {ccclass, property, menu} = cc._decorator;


@ccclass
@menu('多语言翻译/LabelTrans')
export default class LabelTrans extends cc.Component {

    @property({
        type: cc.Enum(I18NLabelTransIdEnum),
    })
    labelTransId: I18NLabelTransIdEnum = I18NLabelTransIdEnum.default;

    @property({
        type: cc.Enum(componentTypeEnum),
    })
    textType: componentTypeEnum = componentTypeEnum.Label;

    customMsgEventHandle = null;
    
    onLoad(): void {
        this.customMsgEventHandle = window["ClientNotify"].register(window["GlobalCfg"].MSG_TYPE.clientMsg, this.onEventMsg, this);

        let languagesType = I18NUtil.getInstance().getLanguageType();
        this.translate(languagesType);
    };

    onDestroy(): void {
        window["ClientNotify"].removeByHandle(window["GlobalCfg"].MSG_TYPE.clientMsg, this.customMsgEventHandle);
    };

    onEventMsg(webData: any, target: any): void {
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == window["GlobalCfg"].CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            this.dealChangeLanguageEvent(notify);
        }
    }; 

    dealChangeLanguageEvent(notify) {
        let languagesType = notify.languagesType;
        this.translate(languagesType);
    };

    translate(languagesType: I18NLanguagesEnum) {
        let str = I18NUtil.getInstance().getLanguageStr(languagesType, this.labelTransId);  
        if (!str) {
            return;
        };
        switch (this.textType) {
            case componentTypeEnum.Label:
                if (this.node.getComponent(cc.Label)) {
                    this.node.getComponent(cc.Label).string = str;       
                }
                else {
                    console.error("error Label: ", I18NLabelTransIdEnum[this.labelTransId], "error LanguageType:", I18NLanguagesEnum[languagesType]);
                };
                break;
            case componentTypeEnum.RichText:
                if (this.node.getComponent(cc.RichText)) {
                    this.node.getComponent(cc.RichText).string = str;            
                }
                else {
                    console.error("error RichText: ", I18NLabelTransIdEnum[this.labelTransId], "error LanguageType:", I18NLanguagesEnum[languagesType]);
                };
                break;
            default:
                break;
        }
    };
};
