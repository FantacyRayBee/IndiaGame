// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import BaseDialog from "./BaseDialog";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";
import Constants from "../Constants";
import { i18nManage } from "../i18n/i18nManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingDialog extends BaseDialog {

    mainNode: cc.Node = null
    btnMusic: cc.Node = null
    btnSound: cc.Node = null
    btnValibate: cc.Node = null
    btnClose: cc.Node = null
    btnHome: cc.Node = null
    btnReplay: cc.Node = null;
    btnContinue: cc.Node = null;
    btnPrivacy: cc.Node = null;
    btnQuit: cc.Node = null;
    btnContinue2: cc.Node = null;
    homeNode: cc.Node = null;

    gameNode: cc.Node = null;
    settingNode: cc.Node = null;
    exitNode: cc.Node = null;

    titleLabel:cc.Label=null;

    currentStarLabel:cc.Label=null;

    private gameScence;

    //游戏过程中总共有2步
    private step=1;

    //是否点击了restart
    private isRestart=false;

    onLoad() {
        this.mainNode = cc.find('style/mainNode', this.node)
        this.homeNode = cc.find('homeNode', this.mainNode)
        this.gameNode = cc.find('gameNode', this.mainNode)
        this.settingNode = cc.find('settingNode', this.mainNode)
        this.exitNode = cc.find('exitNode', this.mainNode)
        this.btnMusic = cc.find('settingNode/btn_music', this.mainNode)
        this.btnSound = cc.find('settingNode/btn_sound', this.mainNode)
        this.btnValibate = cc.find('settingNode/btn_valibate', this.mainNode)
        this.btnPrivacy = cc.find('btn_privacy', this.homeNode)
        this.btnHome = cc.find('btn_home', this.gameNode)
        this.btnContinue = cc.find('btn_continue', this.gameNode)
        this.btnReplay = cc.find('btn_replay', this.gameNode)
        this.btnClose = cc.find('titleNode/btn_close', this.mainNode)

        this.btnQuit = cc.find('btn_quit', this.exitNode)
        this.btnContinue2 = cc.find('btn_continue', this.exitNode)

        this.titleLabel = cc.find('titleNode/title', this.mainNode).getComponent(cc.Label);
        this.currentStarLabel = cc.find('itemNode2/tip', this.exitNode).getComponent(cc.Label);

        this.btnMusic.on('click', this.onMusicClick, this)
        this.btnSound.on('click', this.onSoundClick, this)
        this.btnValibate.on('click', this.onValibateClick, this)
        this.btnHome.on('click', this.onHomeClick, this)
        this.btnReplay.on('click', this.onRestartClick, this)
        this.btnContinue.on('click', this.onCloseClick, this)
        this.btnPrivacy.on('click', this.onPrivacyClick, this)
        this.btnClose.on('click', this.onCloseClick, this)
        this.btnQuit.on('click', this.onQuitClick, this)
        this.btnContinue2.on('click', this.onCloseClick, this)
    }

    onShown(gameScence:string): void {
        this.step=1;
        this.isRestart=false;
        this.titleLabel.string=i18nManage._getLabel('title_setting',[]);
        this.gameScence=gameScence;
        if(this.gameScence!=null&&this.gameScence==Constants.GAME_SCENCE.MAIN){
            this.homeNode.active=false;
            this.gameNode.active=true;
            this.settingNode.active=true;
            this.exitNode.active=false;
        }else{
            this.homeNode.active=true;
            this.gameNode.active=false;
            this.settingNode.active=true;
            this.exitNode.active=false;
        }
        this.currentStarLabel.string=DataManager.instance.levelData.currentStarScore+"";
    }

    onDestroy() {
        this.btnMusic.off('click', this.onMusicClick, this)
        this.btnSound.off('click', this.onSoundClick, this)
        this.btnValibate.off('click', this.onValibateClick, this)
        this.btnHome.off('click', this.onHomeClick, this)
        this.btnReplay.off('click', this.onRestartClick, this)
        this.btnContinue.off('click', this.onCloseClick, this)
        this.btnClose.off('click', this.onCloseClick, this)
        this.btnPrivacy.off('click', this.onPrivacyClick, this)
        this.btnQuit.off('click', this.onQuitClick, this)
    }

    onEnable() {
        this.zoomIn(this.mainNode)
        this.rendorMusic()
        this.rendorSound();
        this.rendorValibate();
    }

    

    onDisable() { }

    onPrivacyClick() { 
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        cc.sys.openURL('https://sites.google.com/view/jewelloftprivacypolicy/');
    }

    onCloseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if(this.gameScence!=null&&this.gameScence==Constants.GAME_SCENCE.MAIN){
            if (!StaticInstance.uiManager.isActive(ENUM_UI_TYPE.ICE)) {
                StaticInstance.uiManager.setMainTimer(true)
                StaticInstance.uiManager.setMainTimerSound(true)
            }
        }
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING, false);
    }

    onQuitClick() {

        if(this.isRestart){
            this.onRestartClick();
        }else{
            this.onHomeClick();
        }

    }
    
    async onRestartClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        this.isRestart=true;
        if(this.step==1){
            this.step=2;
            this.titleLabel.string=i18nManage._getLabel('txt_exit_level',[]);
            this.homeNode.active=false;
            this.gameNode.active=false;
            this.settingNode.active=false;
            this.exitNode.active=true;
            return;
        }
        
        await StaticInstance.fadeManager.fadeIn()
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING, false)
        StaticInstance.gameManager.onGameStart();
    }

    onHomeClick() {
        if(this.step==1){
            this.step=2;
            this.titleLabel.string=i18nManage._getLabel('txt_exit_level',[]);
            this.homeNode.active=false;
            this.gameNode.active=false;
            this.settingNode.active=false;
            this.exitNode.active=true;
            return;
        }
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ICE, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU)
    }

    onValibateClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.settingData.isVibrateEnabled = !DataManager.instance.settingData.isVibrateEnabled
        DataManager.instance.settingData.saveData();
        this.rendorValibate();
    }

    onSoundClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.settingData.isPlaySfx = !DataManager.instance.settingData.isPlaySfx
        DataManager.instance.settingData.saveData();
        this.rendorSound()
    }

    onMusicClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.settingData.isPlayBgm = !DataManager.instance.settingData.isPlayBgm
        DataManager.instance.settingData.saveData();
        if (DataManager.instance.settingData.isPlayBgm) {
            AudiosManager.instance.playMusic()
        } else {
            AudiosManager.instance.stopMusic()
        }
        this.rendorMusic()
    }

    rendorMusic() {
        this.btnMusic.getChildByName('on').active = DataManager.instance.settingData.isPlayBgm
        this.btnMusic.getChildByName('off').active = !DataManager.instance.settingData.isPlayBgm
    }

    rendorSound() {
        this.btnSound.getChildByName('on').active = DataManager.instance.settingData.isPlaySfx
        this.btnSound.getChildByName('off').active = !DataManager.instance.settingData.isPlaySfx
    }
    rendorValibate() {
        this.btnValibate.getChildByName('on').active = DataManager.instance.settingData.isVibrateEnabled
        this.btnValibate.getChildByName('off').active = !DataManager.instance.settingData.isVibrateEnabled
    }
}
