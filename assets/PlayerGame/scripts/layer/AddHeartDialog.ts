
import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import DataManager from "../manager/DataManager";
import BaseDialog from "./BaseDialog";
import { ItemDesc } from "../datacenter/ItemData";
import HeaderDialog from "./HeaderDialog";

const { ccclass, property } = cc._decorator;


export class AddHeartDialogModel {
    constructor(
        public onCallBack: Function
    ) { }
}

@ccclass
export default class AddHeartDialog extends HeaderDialog {
    panel: cc.Node = null
    btnReward: cc.Node = null
    btnClose: cc.Node = null;
    heartNumLabel:cc.Label=null;

    private m_callback = null;

    addNums:number=1;

    onLoad() {
        super.onLoad();
        this.panel = cc.find('style/panel', this.node);
        this.btnReward = cc.find('btn_reward', this.panel)
        this.btnReward.on('click', this.onRewardClick, this)
        this.heartNumLabel = cc.find('iconNode/nums', this.panel).getComponent(cc.Label);
        this.btnClose = cc.find('btn_close', this.panel);
        this.btnClose.on('click', this.onCloseClick, this);
        this.timerHeart = cc.find('iconNode/timeLabel', this.panel);
        
    }

    onShown(params:AddHeartDialogModel): void {
        this.heartNumLabel.string = `${DataManager.instance.hearts}`;
        if(params){
            this.m_callback=params.onCallBack;
        }
    }

    onDestroy() {
        this.btnReward.off('click', this.onRewardClick, this)
        this.btnClose.off('click', this.onCloseClick, this)
    }

    onEnable() {
        SdkManager.instance.toggleBannerAd(true);
        this.rendorHeartTimer();
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    onCloseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ADDHEART, false)
        this.m_callback && this.m_callback(0);
    }

    onRewardClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(async (msg: string) => {
            AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
            DataManager.instance.hearts += DataManager.instance.heartCollectByVideo
            DataManager.instance.save();
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ADDHEART, false);
            if(this.m_callback){
                console.log("onRewardClick");
                this.m_callback(1);
            }
        }, (msg: string) => {
           // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }
}
