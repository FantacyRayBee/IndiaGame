
import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import DataManager from "../manager/DataManager";
import BaseDialog from "./BaseDialog";
import { ItemDesc } from "../datacenter/ItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemDialog extends BaseDialog {
    panel: cc.Node = null
    btnReward: cc.Node = null
    itemDesc: cc.Label = null
    btnClose: cc.Node = null;

    private m_index:number = 0;
    private m_callback = null;
    onLoad() {
        this.panel = cc.find('style/panel', this.node);
        this.btnReward = cc.find('btn_reward', this.panel)
        this.btnReward.on('click', this.onRewardClick, this)
        this.itemDesc = cc.find('itemDesc', this.panel).getComponent(cc.Label)
        this.btnClose = cc.find('btn_close', this.panel);
        this.btnClose.on('click', this.onCloseClick, this);
    }

    onShown(...params): void {
        console.log("fffffffff:", params[0]);
        this.m_index = params[0].index;
        this.m_callback = params[0].callback;
        this.itemDesc.string = ItemDesc[this.m_index];

        for (let i = 0; i < 4; i++) {
            const node = this.panel.getChildByName("itemIcon" + i);
            node.active = false;
            if (i === this.m_index) {
                node.active = true;
            }
        }
    }

    onDestroy() {
        this.btnReward.off('click', this.onRewardClick, this)
        this.btnClose.off('click', this.onCloseClick, this)
    }

    onEnable() {
        SdkManager.instance.toggleBannerAd(true)
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    onCloseClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ITEM, false)
        this.m_callback && this.m_callback();
    }

    onRewardClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(async (msg: string) => {
            DataManager.instance.itemData.addItemData(this.m_index);
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ITEM, false)
            this.m_callback && this.m_callback();
            StaticInstance.uiManager.setMainTimer(true);
            StaticInstance.uiManager.setMainTimerSound(true);
        }, (msg: string) => {
           // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }
}
