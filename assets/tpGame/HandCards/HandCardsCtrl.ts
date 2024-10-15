import { EnumCardSuit, EnumCatchChip } from "../DataDef";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/HandCardsCtrl')
export default class HandCardsCtrl extends cc.Component {

    @property(cc.Sprite)
    private sprite_card0: cc.Sprite = null;

    @property(cc.Sprite)
    private sprite_card1: cc.Sprite = null;

    @property(cc.Sprite)
    private sprite_card2: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    private atlas_card: cc.SpriteAtlas = null;

    @property(cc.Node)
    private node_staticCardSuit: cc.Node = null;

    @property(cc.Label)
    private lab_staticCardSuitTip: cc.Label = null;

    @property(cc.Node)
    private node_dynamicCardSuit: cc.Node = null;

    @property(sp.Skeleton)
    private sp_dynamicCardSuit: sp.Skeleton = null;

    @property(sp.Skeleton)
    private sp_catchChipType: sp.Skeleton = null;

    @property(cc.ProgressBar)
    private pb_cardPower: cc.ProgressBar = null; 

    @property(cc.Node)
    private node_cardSeen: cc.Node = null;

    @property(cc.Button)
    private btn_see: cc.Button = null;

    @property(cc.Node)
    private node_winScore: cc.Node = null;

    @property(cc.Label)
    private lab_winScore: cc.Label = null;

    private _handCardsValueArr: number[] = [];

    private _cardSeenValue: boolean = false;

    private _handCardsSuitValue: EnumCardSuit = EnumCardSuit.NONE;

    private _winScoreTweenY = 0;

    protected onLoad(): void {
        //@ts-ignore
        this.btn_see.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    }


    btnClickCall(btn: cc.Button) {
        let btnName = btn.node.name;
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        //@ts-ignore
        GameServerManager.send("gameservice.look", "LookReq", {});
    }

    initHandCards() {
        this.unscheduleAllCallbacks();
        this.setHandCardsValueArr([]);
        this.setHandCardsBackPerformance();
        this.setHandCardsSeenValue(false);
        this.setHandCardsSuitValue(EnumCardSuit.NONE);
        this.setHandCardsStaticSuitPerformance();
        this.setHandCardsDynamicSuitPerformance();
        this.setHandCardsCatchChipPerformance(EnumCatchChip.NONE);
        this.setHandCardsSeenPerformanceActive(false);
        this.setHandCardsGrayPerfomanceActive(false);
        this.setHandCardsPowerPerformance(0);
        this.setHandCardsBtnSeeActive(false);
        this.setHandCardsStyle(false);
        this.setHandCardsWinScorePerformance(0);
    }

    /**
     * 设置手牌牌值数组
     * @param valueArr 牌值数组
     */
    setHandCardsValueArr(valueArr: number[]) {
        if (valueArr.length != 3) {
            return;
        };
        valueArr = this._cardValueArrSort(valueArr);
        this._handCardsValueArr = valueArr;
    }

    /**
     * 获取手牌牌值数组
     * @returns 返回手牌牌值数组
     */
    getHandCardsValueArr() {
        return this._handCardsValueArr;
    }

    /**
     * 设置手牌牌型值
     * @param suitValue 牌型值
     */
    setHandCardsSuitValue(suitValue: EnumCardSuit) {
        this._handCardsSuitValue = suitValue;
    }

    /**
     * 获取手牌牌型值
     * @returns 返回手牌牌型值
     */
    getHandCardsSuitValue() {
        return this._handCardsSuitValue;
    }

    /**
     * 设置手牌牌型表现（黑框+文字形式）
     * @param suit 牌型
     */
    setHandCardsStaticSuitPerformance() {
        let suitValue = this.getHandCardsSuitValue();
        switch (suitValue) {
            case EnumCardSuit.NONE:
                this.node_staticCardSuit.active = false;
                this.lab_staticCardSuitTip.string = "";
                break;
            case EnumCardSuit.POINT:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "High Card";
                break;
            case EnumCardSuit.TWO:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Pair";
                break;
            case EnumCardSuit.FLUSH:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Color";
                break;
            case EnumCardSuit.STRAIGHT:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Sequence";
                break;
            case EnumCardSuit.STRAIGHT_FLUSH:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Pure Seq";
                break;
            case EnumCardSuit.THREE:
                this.node_staticCardSuit.active = true;
                this.lab_staticCardSuitTip.string = "Set";
                break;
            default:
                this.node_staticCardSuit.active = false;
                this.lab_staticCardSuitTip.string = "";
                break;
        }
    }

    /**
     * 设置手牌牌型表现（spine动效形式）
     */
    setHandCardsDynamicSuitPerformance() {
        let suitValue = this.getHandCardsSuitValue();
        let skinName = "";
        switch (suitValue) {
            case EnumCardSuit.NONE:
                skinName = "";
                break;
            case EnumCardSuit.POINT:
                skinName = "highcard";
                break;
            case EnumCardSuit.TWO:
                skinName = "pair";
                break;
            case EnumCardSuit.FLUSH:
                skinName = "color";
                break;
            case EnumCardSuit.STRAIGHT:
                skinName = "sequence";
                break;
            case EnumCardSuit.STRAIGHT_FLUSH:
                skinName = "pureseq";
                break;
            case EnumCardSuit.THREE:
                skinName = "set";
                break;
            default:
                skinName = "";
                break;
        };

        this.sp_dynamicCardSuit.clearTrack(0);
        if (skinName.length == 0) {
            this.node_dynamicCardSuit.active = false;
            return;
        };
        this.node_dynamicCardSuit.active = true;
        this.sp_dynamicCardSuit.setSkin(skinName);
        this.sp_dynamicCardSuit.setAnimation(0, "chuxian", false);
    }

    /**
     * 设置手牌下注的操作类型表现
     * @param catchChipType 下注的操作类型
     */
    setHandCardsCatchChipPerformance(catchChipType: EnumCatchChip) {
        let skinName = "";
        switch (catchChipType) {
            case EnumCatchChip.NONE:
                skinName = "";
                break;
            case EnumCatchChip.BLIND:
                skinName = "blind";
                break;
            case EnumCatchChip.BLINDx2:
                skinName = "blindx2";
                break;
            case EnumCatchChip.CHAAL:
                skinName = "chaal";
                break;
            case EnumCatchChip.CHAALx2:
                skinName = "chaalx2";
                break;
            default:
                skinName = "";
                break;
        };

        this.sp_catchChipType.clearTracks();
        if (skinName.length == 0) {
            this.sp_catchChipType.node.active = false;
            return;
        };
        this.sp_catchChipType.node.active = true;
        this.sp_catchChipType.setSkin(skinName);
        this.sp_catchChipType.setAnimation(0, "chuxian", false);
    }

    /**
     * 设置手牌是否已看牌
     * @param seenValue 是否已看牌
     */
    setHandCardsSeenValue(seenValue: boolean) {
        this._cardSeenValue = seenValue;
    }

    /**
     * 获取手牌是否已看牌
     * @returns 是否已看牌
     */
    getHandCardsSeenValue() {
        return this._cardSeenValue;
    }

    /**
     * 设置是否显示“SEEN”文字的表现
     * @param active 
     */
    setHandCardsSeenPerformanceActive(active: boolean) {
        this.node_cardSeen.active = active;
    }

    /**
     * 设置手牌是否显示灰色表现
     * @param active 
     */
    setHandCardsGrayPerfomanceActive(active: boolean) {
        if (active) {
            this.sprite_card0.node.color = new cc.Color(139, 139, 122, 255);
            this.sprite_card1.node.color = new cc.Color(139, 139, 122, 255);
            this.sprite_card2.node.color = new cc.Color(139, 139, 122, 255);
        }
        else {
            this.sprite_card0.node.color = new cc.Color(255, 255, 255, 255);
            this.sprite_card1.node.color = new cc.Color(255, 255, 255, 255);
            this.sprite_card2.node.color = new cc.Color(255, 255, 255, 255);
        };
    }

    /**
     * 设置手牌进行翻牌表现
     */
    setHandCardsFlopPerformance() {
        let cardVauleArr = this.getHandCardsValueArr();
        for (let i = 0; i < 3; i++) {
            let cardValue = cardVauleArr[i];
            let spriteCard = this[`sprite_card${i}`];
            
            cc.tween(spriteCard.node)
            .to(0.1, {scaleX: 0})
            .call(() => {  
                spriteCard.spriteFrame = this.atlas_card.getSpriteFrame(`${cardValue}`);
            })
            .to(0.1, {scaleX: 1})
            .start()
        };
    }

    /**
     * 设置手牌正面显示表现 
     */
    setHandCardsFrontPerformance() {
        let cardVauleArr = this.getHandCardsValueArr();
        for (let i = 0; i < 3; i++) {
            let cardValue = cardVauleArr[i];
            let spriteCard: cc.Sprite = this[`sprite_card${i}`];
            spriteCard.spriteFrame = this.atlas_card.getSpriteFrame(`${cardValue}`);
        };
    }

    /**
     * 设置手牌背面显示表现
     */
    setHandCardsBackPerformance() {
        for (let i = 0; i < 3; i++) {
            let spriteCard: cc.Sprite = this[`sprite_card${i}`];
            spriteCard.node.stopAllActions();
            spriteCard.node.scaleX = 1;
            spriteCard.spriteFrame = this.atlas_card.getSpriteFrame(`52`);
        };
    }


    /**
     * 设置手牌样式
     * @param isOwn 是否是自己玩家的手牌
     */
    setHandCardsStyle(isOwn: boolean) {
        if (isOwn) {
            for (let i = 0; i < 3; i++) {
                let spriteCard: cc.Sprite = this[`sprite_card${i}`];
                spriteCard.node.setContentSize(cc.size(128.7, 166.1));
                spriteCard.node.setPosition(cc.v3(50 * (i - 1), 0));
            }; 
            this.node_dynamicCardSuit.setPosition(cc.v3(0, -38));
            this.sp_catchChipType.node.setPosition(cc.v3(0, 110));
            this._winScoreTweenY = 110;
        }
        else {
            for (let i = 0; i < 3; i++) {
                let spriteCard: cc.Sprite = this[`sprite_card${i}`];
                spriteCard.node.setContentSize(cc.size(109.4, 141.2));
                spriteCard.node.setPosition(cc.v3(40 * (i - 1), 0));
            }; 
            this.node_dynamicCardSuit.setPosition(cc.v3(0, -38));
            this.sp_catchChipType.node.setPosition(cc.v3(0, 100));
            this._winScoreTweenY = 100;
        };
    }

    private _cardValueArrSort(cardVauleArr) {
        /**
         * 如果第一个参数应该位于第二个之前则返回一个负数;
         * 如果两个参数相等则返回0;
         * 如果第一个参数应该位于第二个参数之后则返回一个正数。
         **/ 
        cardVauleArr = cardVauleArr.sort((a, b) => {
            if (a%13 == 0 && b%13 == 0) {
                return a - b;
            }
            else if (a%13 == 0 && b%13 > 0) {
                return 1;
            }
            else if (a%13 > 0 && b%13 == 0) {
                return -1;
            }
            else {
                return a%13 - b%13;
            };
        });
        
        if (cardVauleArr[0]%13 == 1 && cardVauleArr[1]%13 == 2 && cardVauleArr[2]%13 == 0) {
            let temp0 = cardVauleArr[0];
            let temp1 = cardVauleArr[1];
            let temp2 = cardVauleArr[2];
            cardVauleArr[0] = temp2;
            cardVauleArr[1] = temp0;
            cardVauleArr[2] = temp1;
        };

        return cardVauleArr;
    }

    /**
     * 设置牌力显示表现，若power<=0，则不显示。
     * @param power 牌力值
     */
    setHandCardsPowerPerformance(power: number) {
        if (power <= 0) {
            this.pb_cardPower.node.active = false;
            this.pb_cardPower.progress = 0;
        }
        else {
            this.pb_cardPower.node.active = true;

            let progress = 0.0;
            let repeat = Math.ceil(power/10) - 1;
            let step = power/100/(repeat + 1);

            this.pb_cardPower.progress = progress;
            this.pb_cardPower.schedule(() => {
                progress += step;
                this.pb_cardPower.progress = progress;
            }, 0.02, repeat, 0);
        };
    }

    /**
     * 设置看牌按钮是否显示
     * @param active 
     */
    setHandCardsBtnSeeActive(active: boolean) {
        this.btn_see.node.active = active;
    }


    /**
     * 设置玩家赢分飘分表现
     * @param score 
     */
    setHandCardsWinScorePerformance(score: number) {
        this.lab_winScore.node.stopAllActions();
        if (score <= 0) {
            this.node_winScore.setPosition(cc.v3(0, -40));
            this.node_winScore.active = false;
        }
        else {
            this.node_winScore.active = true;
            this.node_winScore.setPosition(cc.v3(0, -40));
            this.lab_winScore.string = `j${score / 100}`;
            cc.tween(this.node_winScore)
            .to(0.5, {position: cc.v3(0, this._winScoreTweenY)})
            .delay(1)
            .call(() => {
                this.setHandCardsWinScorePerformance(0);
            })
            .start()
        };
    }
}
