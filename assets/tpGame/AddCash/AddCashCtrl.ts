import { EnumAddCashType, IRoomConfig } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/AddCashCtrl')
export default class AddCashCtrl extends cc.Component {

    @property(cc.SpriteFrame)
    spriteFrame_cash: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteFrame_practice: cc.SpriteFrame = null;

    @property(cc.Sprite)
    sprite_bg: cc.Sprite = null;


    private _currentType: EnumAddCashType = EnumAddCashType.NONE;

    private _curRoomConfig: IRoomConfig = null;

    protected onLoad(): void {
        //@ts-ignore
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }

    private btnClickCall(btn: cc.Button) {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();

        if (this._currentType == EnumAddCashType.PRACTICE) {
            //@ts-ignore
            CommonFun.getInstance().showSmallAddExperience();
        }
        else if (this._currentType == EnumAddCashType.CASH) {
            //@ts-ignore
            CommonFun.getInstance().showSmallAddCash("tpGame",  this._curRoomConfig ? this._curRoomConfig.cellScore : 0);
        };
    }


    setAddCashStyle(type: EnumAddCashType, roomConfig: IRoomConfig) {
        if (type == EnumAddCashType.CASH) {
            this.sprite_bg.spriteFrame = this.spriteFrame_cash;
            this.node.active = true;
        } 
        else if (type == EnumAddCashType.PRACTICE) {
            this.sprite_bg.spriteFrame = this.spriteFrame_practice;
            this.node.active = true;
        }
        else {
            this.node.active = false;
        };
        this._curRoomConfig = roomConfig;
        this._currentType = type;
    }
}
