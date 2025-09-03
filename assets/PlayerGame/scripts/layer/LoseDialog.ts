

import { ENUM_AUDIO_CLIP, ENUM_GAME_LOSE_TYPE, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import HeaderDialog from "./HeaderDialog";
import DataManager from "../manager/DataManager";
import { i18nManage } from "../i18n/i18nManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoseDialog extends HeaderDialog {

    main: cc.Node = null
    btnExit: cc.Node = null
    btnReward: cc.Node = null
    powerCollect: cc.Node = null
    btnClose: cc.Node = null;

    titleLabel:cc.Label=null;

    noteNode: cc.Node = null;
    timeLoseNode: cc.Node = null;
    removeLoseNode: cc.Node = null;

    //失败类型
    private loseType=ENUM_GAME_LOSE_TYPE.TIME;

    starCountLabel:cc.Label=null;

    //总共有2步
    private step=1;

    onLoad() {
        super.onLoad()
        this.main = cc.find('style/main', this.node);
        this.noteNode = cc.find('style/main/noteNode', this.node);
        this.starCountLabel = cc.find('itemNode2/tip', this.noteNode).getComponent(cc.Label);
        this.removeLoseNode = cc.find('style/main/removeLoseNode', this.node);
        this.timeLoseNode = cc.find('style/main/timeLoseNode', this.node);
        this.titleLabel = cc.find('style/main/titleNode/title', this.node).getComponent(cc.Label);
        this.btnExit = cc.find('buttons/btn_exit', this.main)
        this.btnExit.on('click', this.onCloseClick, this)
        this.btnReward = cc.find('buttons/btn_reward', this.main)
        this.btnReward.on('click', this.onRewardClick, this)
        this.powerCollect = cc.find('num', this.main)
        this.btnClose = cc.find('btn_close', this.main);
        this.btnClose.on('click', this.onCloseClick, this);
    }

    onShown(loseType:ENUM_GAME_LOSE_TYPE): void {
        this.noteNode.active=false;
        this.step=1;
        this.loseType=loseType;
         if(loseType==ENUM_GAME_LOSE_TYPE.TIME){
             this.titleLabel.string=i18nManage._getLabel('txt_timeup',[]);
             this.timeLoseNode.active=true;
             this.removeLoseNode.active=false;
         }else{
            this.titleLabel.string=i18nManage._getLabel('txt_fail',[]);
            this.timeLoseNode.active=false;
             this.removeLoseNode.active=true;
         }
         this.starCountLabel.string=DataManager.instance.levelData.currentStarScore+"";
         this.step=1;
    }

    onDestroy() {
        this.btnExit.off('click', this.onCloseClick, this)
        this.btnReward.off('click', this.onRewardClick, this)
        this.btnClose.off('click', this.onCloseClick, this)
    }

    onEnable() {
        this.rendorHeart()
        this.rendorStar()
        this.rendorHeartTimer();
        this.zoomIn(this.main)
        SdkManager.instance.toggleBannerAd(true)
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    async onRestartClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        await StaticInstance.fadeManager.fadeIn()
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false)
        StaticInstance.gameManager.onGameStart()
    }

    onCloseClick() {
        if(this.step==1){
            this.noteNode.active=true;
            this.timeLoseNode.active=false;
            this.removeLoseNode.active=false;
            this.step=2;
            return;
        }
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.status = ENUM_GAME_STATUS.LOSE;
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU);
    }

    onRewardClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(async (msg: string) => {
            DataManager.instance.status = ENUM_GAME_STATUS.RUNING;
            DataManager.instance.levelData.isRevivew=true;
            DataManager.instance.levelData.revivewCount++;
            DataManager.instance.levelData.saveCurrData();
            StaticInstance.uiManager.setMainTimer(true)
            StaticInstance.uiManager.setMainTimerSound(true)
            if(this.loseType==ENUM_GAME_LOSE_TYPE.TIME){
                DataManager.instance.levelData.timer=DataManager.instance.levelData.timer+60;             
            }else{
                StaticInstance.gameManager.onSkillShuffle();
            }
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false);
        }, (msg: string) => {
           // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }
}
