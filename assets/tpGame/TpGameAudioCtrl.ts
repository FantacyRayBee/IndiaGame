const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('tpGame/TpGameAudioCtrl')
export default class TpGameAudioCtrl extends cc.Component {

    @property(cc.AudioClip)
    private audioClip_catchChip: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_clickBtnShow: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_compareCardLine: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_compareCardLost: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_compareCardVS: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_dropCard: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_faCard: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_playerJoin: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_recycleChip: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_rollOverCard: cc.AudioClip = null;

    @property(cc.AudioClip)
    private audioClip_win: cc.AudioClip = null;

    
    /**
     * 播放下注筹码音效
     */
    playCatchChipEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_catchChip, false);
    }

    /**
     * 播放比牌输音效
     */
    playCompareCardLostEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardLost, false);
    }

    /**
     * 播放比牌VS音效
     */
    playCompareCardVSEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardVS, false);
    }

    /**
     * 播放比牌连线音效
     */    
    playCompareCardLineEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_compareCardLine, false);
    }

    /**
     * 播放弃牌音效
     */
    playDropCardEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_dropCard, false);
    }

    /**
     * 播放发牌音效
     */
    playFaCardEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_faCard, false);
    }

    /**
     * 播放赢音效
     */
    playWinEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_win, false);
    }

    /**
     * 播放玩家加入音效
     */
    playPlayerJoinEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_playerJoin, false);
    }

    /**
     * 播放翻牌音效
     */
    playRollOverCardEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_rollOverCard, false);
    }

    /**
     * 播放回收筹码音效
     */
    playRecycleChipEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_recycleChip, false);
    }

    /**
     * 播放点击比牌按钮音效
     */
    playClickBtnShowEffect() {
        //@ts-ignore
        GlobalCfg.G_COMPONENTS.Audio.playSound(this.audioClip_clickBtnShow, false);
    }
}
