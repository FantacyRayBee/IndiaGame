// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";
import HeaderDialog from "./HeaderDialog";
import DataManager from "../manager/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinDialog extends HeaderDialog {

    panel: cc.Node = null
    btnNext: cc.Node = null
    btnDouble: cc.Node = null
    powerCollect: cc.Node = null

    onLoad() {
        super.onLoad()
        this.panel = cc.find('style/panel', this.node)
        this.btnNext = cc.find('buttons/btn_next', this.panel)
        this.btnDouble = cc.find('buttons/btn_double', this.panel)
        this.btnNext.on('click', this.onNextClick, this)
        this.btnDouble.on('click', this.onDoubleClick, this)
        this.powerCollect = cc.find('num', this.panel)
    }

    onDestroy() {
        this.btnNext.off('click', this.onNextClick, this)
        this.btnDouble.off('click', this.onDoubleClick, this)
    }

    onEnable() {
        this.rendorHeart()
        this.rendorStar()
        this.rendorHeartTimer()
        this.rendorPowerCollect()
        this.zoomIn(this.panel)
        SdkManager.instance.toggleBannerAd(true)
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    rendorPowerCollect() {
        this.powerCollect.getComponent(cc.Label).string = `x ${DataManager.instance.levelData.currentStarScore}`
    }

    async onNextClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.collectStarCount += DataManager.instance.levelData.currentStarScore
        DataManager.instance.save();
        await StaticInstance.fadeManager.fadeIn()
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN,false);
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN,true);
        StaticInstance.gameManager.onGameStart();
    }

    onDoubleClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(async (msg: string) => {
            if (!SdkManager.instance.getPlatform()) {
               // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255) })
            }
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.MONEY)
            DataManager.instance.collectStarCount += DataManager.instance.levelData.currentStarScore * 2
            DataManager.instance.save()
            await StaticInstance.fadeManager.fadeIn()
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN, false);
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN,true);
            StaticInstance.gameManager.onGameStart()
        }, (msg: string) => {
           // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }
}
