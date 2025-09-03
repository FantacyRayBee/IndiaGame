

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import DataManager from "../manager/DataManager";
import HeaderDialog from "./HeaderDialog";
import { i18nManage } from "../i18n/i18nManage";
import Constants from "../Constants";
import PoolManager from "../manager/PoolManager";
import { toXY } from "../Utils";
import { AddHeartDialogModel } from "./AddHeartDialog";
import EffectFlyManager from "../framework/EffectFlyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuLayer extends HeaderDialog {

    btnStart: cc.Node = null
    btnRank: cc.Node = null
    btnSetting: cc.Node = null

    levelLabel: cc.Label = null

    onLoad() {
        super.onLoad()
        this.btnStart = cc.find('btn_start', this.node)
        this.btnRank = cc.find('rightNode/btn_rank', this.node)
        this.btnSetting = cc.find('leftNode/btn_setting', this.node)
        this.btnStart.on('click', this.onStartClick, this);
        this.levelLabel=cc.find('label', this.btnStart).getComponent(cc.Label);
        this.btnRank.on('click', this.onRankClick, this)
        this.btnSetting.on('click', this.onSettingClick, this);
    }

    onShown(): void {
        this.levelLabel.string=i18nManage._getLabel('txt_showlevel',[DataManager.instance.levelData.level+""]);

    }
    

    onDestroy() {
        this.btnStart.off('click', this.onStartClick, this)
        this.btnRank.off('click', this.onRankClick, this)
        this.btnSetting.off('click', this.onSettingClick, this)
    }

    onEnable() {
        this.rendorHeart()
        this.rendorStar()
        this.rendorHeartTimer()
    }

    onDisable() { }

    async onStartClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if (DataManager.instance.hearts <= 0) {
           // ToastManager.instance.show('红心已用完, 请先补充红心', { gravity: 'TOP', bg_color: cc.color(226, 69, 109, 255) })
            //return
        }
        //if(DataManager.instance.levelData.level>1){
          //  await StaticInstance.fadeManager.fadeIn()
           // StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
       //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.START)
      //  }else{
            await StaticInstance.fadeManager.fadeIn()
            DataManager.instance.hearts -= 1
            DataManager.instance.save()
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MAIN,true);
            StaticInstance.gameManager.onGameStart();
      //  }
        
    }

    onHeartDialogClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ADDHEART,true,new AddHeartDialogModel(
            (num)=>this.onAddHeartCallBack(num)
        ));
    }

    

    onAddHeartCallBack(num:number){
        console.log("onAddHeartCallBack",num);
        const heart = PoolManager.instance.getNode('Heart',  this.node, cc.v3(0, 0))
        heart.scale=1.5;
        EffectFlyManager.Instance.jumpOutAndFly(this.node,heart,this.barHeart.getChildByName('nums'),()=>{
            heart.removeFromParent()
            this.rendorHeart();
        }); 
    }

    onRankClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
       // StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        //@ts-ignore
        CommonFun.getInstance()._showShop();
    }

    onSettingClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
       // StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING,true,Constants.GAME_SCENCE.HOME)
    }

}
