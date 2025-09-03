

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import HeaderDialog from "./HeaderDialog";
import DataManager from "../manager/DataManager";
import { i18nManage } from "../i18n/i18nManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartDialog extends HeaderDialog {

    main: cc.Node = null
    btnStart: cc.Node = null
    btnReward: cc.Node = null
    powerCollect: cc.Node = null
    btnClose: cc.Node = null;

    titleLabel:cc.Label=null;

    noteNode: cc.Node = null;


    onLoad() {
        console.log("onLoad");
        super.onLoad()
        this.main = cc.find('style/main', this.node);
        this.noteNode = cc.find('style/main/noteNode', this.node);
        this.titleLabel = cc.find('style/main/titleNode/title', this.node).getComponent(cc.Label);
        this.btnStart = cc.find('buttons/btn_start', this.main)
        this.btnStart.on('click', this.onCloseClick, this)
        this.btnReward = cc.find('buttons/btn_reward', this.main)
        this.btnReward.on('click', this.onRewardClick, this)
        this.powerCollect = cc.find('num', this.main)
        this.btnClose = cc.find('btn_close', this.main);
        this.btnClose.on('click', this.onCloseClick, this);
        console.log("onLoadw");
    }

    onShown(): void {
       
        this.titleLabel.string=i18nManage._getLabel('txt_showlevel',[DataManager.instance.levelData.level+""]);
        console.log("onShown");
    }

    onDestroy() {
        this.btnStart.off('click', this.onCloseClick, this)
        this.btnReward.off('click', this.onRewardClick, this)
        this.btnClose.off('click', this.onCloseClick, this)
    }

    onEnable() {
        this.rendorHeart()
        this.rendorStar()
        this.rendorHeartTimer();
        this.zoomIn(this.main)
        SdkManager.instance.toggleBannerAd(false)
        console.log("onEnable");
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    async onStartClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if (DataManager.instance.hearts <= 0) {
           // ToastManager.instance.show('红心已用完, 请先补充红心', { gravity: 'TOP', bg_color: cc.color(226, 69, 109, 255) })
            return
        }
        await StaticInstance.fadeManager.fadeIn()
        DataManager.instance.hearts -= 1
        DataManager.instance.save()
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.START, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN)
        StaticInstance.gameManager.onGameStart()
    }


    onCloseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.START, false)
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
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false);
        }, (msg: string) => {
           // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }
}
