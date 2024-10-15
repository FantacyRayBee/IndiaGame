const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/ChipCtrl')
export default class ChipCtrl extends cc.Component {

    @property(cc.Sprite)
    private sprite_icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private spriteFrame_blue: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spriteFrame_green: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spriteFrame_orange: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spriteFrame_yellow: cc.SpriteFrame = null;
    
    @property(cc.Font)
    private font_blue: cc.Font = null;

    @property(cc.Font)
    private font_green: cc.Font = null;

    @property(cc.Font)
    private font_orange: cc.Font = null;

    @property(cc.Font)
    private font_yellow: cc.Font = null;

    @property(cc.Label)
    private lab_amount: cc.Label = null;

    private _chipAmountArr =[  
        ["0.1", "0.2", "0.3", "0.4", "0.6", "1.2", "1", "2", "4", "3", "6", "12", "10", "20", "50", "100"],
        ["0.8", "1.6", "2.4", "4.8", "8", "16", "24", "48", "80", "160"],
        ["6.4", "9.6", "12.8", "19.2", "38.4", "64", "128", "192", "384", "320", "640", "2560", "1280", "1600"],
        ["400", "800", "3200", "6400", "3.2", "32", "9.6", "96", "40", "200"]
    ];

    /**
     * 设置下注额度
     * @param amount 下注额度
     */
    setChipAmount(amount: number) {
        let chipAmount = amount/100;
        let index = 0;
        for (let i = 0, len = this._chipAmountArr.length; i < len; i++) {
            let chipAmountArr = this._chipAmountArr[i];
            if (chipAmountArr.indexOf(`${chipAmount}`) != -1) {
                index = i;
                break;
            };
        };

        let len = `${chipAmount}`.length;
        if (len == 1 || len == 2) {
            this.lab_amount.fontSize = 26;
            this.lab_amount.lineHeight = 26;
            this.lab_amount.spacingX = -2;
        }
        else if (len == 3) {
            this.lab_amount.fontSize = 19;
            this.lab_amount.lineHeight = 19;
            this.lab_amount.spacingX = -2;
        }
        else if (len == 4) {
            this.lab_amount.fontSize = 17;
            this.lab_amount.lineHeight = 17;
            this.lab_amount.spacingX = -2;
        }
        else if (len > 4) {
            this.lab_amount.fontSize = 15;
            this.lab_amount.lineHeight = 15;
            this.lab_amount.spacingX = -2;
        };

        this.lab_amount.string = `${chipAmount}`;
        switch (index) {
            case 0:
                this.lab_amount.font = this.font_blue;
                this.sprite_icon.spriteFrame = this.spriteFrame_blue;
                break;
            case 1:
                this.lab_amount.font = this.font_green;
                this.sprite_icon.spriteFrame = this.spriteFrame_green;
                break;
            case 2:
                this.lab_amount.font = this.font_orange;
                this.sprite_icon.spriteFrame = this.spriteFrame_orange;
                break;
            case 3:
                this.lab_amount.font = this.font_yellow;
                this.sprite_icon.spriteFrame = this.spriteFrame_yellow;
                break;
            default:
                break;
        };
    }
}
