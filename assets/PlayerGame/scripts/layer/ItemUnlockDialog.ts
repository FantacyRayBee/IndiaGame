
import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from '../StaticInstance';
import AudiosManager from "../manager/AudiosManager";
import SdkManager from "../manager/SdkManager";
import BaseDialog from "./BaseDialog";
import { ItemDesc } from "../datacenter/ItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemUnlockDialog extends BaseDialog {
    panel: cc.Node = null
    btnReward: cc.Node = null
    itemDesc: cc.Label = null

    private m_index:number = 0;
    private m_callback = null;
    onLoad() {
        this.panel = cc.find('style/panel', this.node);
        this.btnReward = cc.find('btn_reward', this.panel)
        this.btnReward.on('click', this.onRewardClick, this)
        this.itemDesc = cc.find('itemDesc', this.panel).getComponent(cc.Label)
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
        const light = this.panel.getChildByName("light");
        const act = cc.repeatForever(cc.rotateBy(3, 360))
        cc.tween(light).then(act).start();
    }

    onDestroy() {
        this.btnReward.off('click', this.onRewardClick, this)
    }

    onEnable() {
        SdkManager.instance.toggleBannerAd(true)
    }

    onDisable() {
        SdkManager.instance.toggleBannerAd(false)
    }

    onRewardClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ITEMUNLOCK, false);
        const node = this.panel.getChildByName("itemIcon" + this.m_index);
        this.m_callback && this.m_callback({
            index: this.m_index, 
            pos: node.position,
            item: cc.instantiate(node),
        });
    }
}
