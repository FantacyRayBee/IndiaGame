import { I18NLanguagesEnum, I18NUtil, I18NSpriteTransIdEnum } from './i18nUtil';

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('多语言翻译/SpriteTrans')
export default class SpriteTrans extends cc.Component {

    @property({
        type: cc.Enum(I18NSpriteTransIdEnum),
    })
    spriteTransId: I18NSpriteTransIdEnum = I18NSpriteTransIdEnum.default;

    isChangeById: boolean = true;       // 是否根据 spriteTransId 填写 sprite 默认值

    private _customMsgEventHandle = null;

    private _loadSpriteFrameMap: Map<I18NLanguagesEnum, cc.SpriteFrame> = new Map();
    
    onLoad(): void {
        this._customMsgEventHandle = window["ClientNotify"].register(window["GlobalCfg"].MSG_TYPE.clientMsg, this.onEventMsg, this);

        let languagesType = I18NUtil.getInstance().getLanguageType();
        this.translate(languagesType);
    };

    onDestroy(): void {
        let spriteFrame = null;
        if (this._loadSpriteFrameMap.has(I18NLanguagesEnum.English)) {
            spriteFrame = this._loadSpriteFrameMap.get(I18NLanguagesEnum.English);
            this._loadSpriteFrameMap.delete(I18NLanguagesEnum.English);
            spriteFrame.decRef();
            spriteFrame = null;
        };
        if (this._loadSpriteFrameMap.has(I18NLanguagesEnum.Bengali)) {
            spriteFrame = this._loadSpriteFrameMap.get(I18NLanguagesEnum.Bengali);
            this._loadSpriteFrameMap.delete(I18NLanguagesEnum.Bengali);
            spriteFrame.decRef();
            spriteFrame = null;
        };
        if (this._loadSpriteFrameMap.has(I18NLanguagesEnum.Hindi)) {
            spriteFrame = this._loadSpriteFrameMap.get(I18NLanguagesEnum.Hindi);
            this._loadSpriteFrameMap.delete(I18NLanguagesEnum.Hindi);
            spriteFrame.decRef();
            spriteFrame = null;
        };
        if (this._loadSpriteFrameMap.has(I18NLanguagesEnum.Urdu)) {
            spriteFrame = this._loadSpriteFrameMap.get(I18NLanguagesEnum.Urdu);
            this._loadSpriteFrameMap.delete(I18NLanguagesEnum.Urdu);
            spriteFrame.decRef();
            spriteFrame = null;
        };
        window["ClientNotify"].removeByHandle(window["GlobalCfg"].MSG_TYPE.clientMsg, this._customMsgEventHandle);
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
        if (this.node.getComponent(cc.Sprite)) {
            I18NUtil.getInstance().loadSpriteFrame(languagesType, this.spriteTransId, (spriteFrame) => {
                if (window["CommonFun"].getInstance().isValidForScr(this)) {
                    if (this._loadSpriteFrameMap.has(languagesType) == false) {
                        spriteFrame.addRef();
                        this._loadSpriteFrameMap.set(languagesType, spriteFrame);
                    };
                    this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                else {
                    spriteFrame.addRef();
                    spriteFrame.decRef();
                    spriteFrame = null;
                };
            });  
        }
        else {
            console.error("error Sprite: ", I18NSpriteTransIdEnum[this.spriteTransId], "error LanguageType:", I18NLanguagesEnum[languagesType]);
        };
    };
}
