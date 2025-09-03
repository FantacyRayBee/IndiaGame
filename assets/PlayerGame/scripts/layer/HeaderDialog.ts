// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { formatSeconds } from "../Utils";
import AudiosManager from "../manager/AudiosManager";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";
import BaseDialog from "./BaseDialog";
import { StaticInstance } from "../StaticInstance";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeaderDialog extends BaseDialog {

    barHeart: cc.Node = null
    barStar: cc.Node = null
    timerHeart: cc.Node = null;

    onLoad() {
        this.barHeart = cc.find('bar/heart', this.node)
        this.barStar = cc.find('bar/star', this.node)
        this.timerHeart = cc.find('timer', this.barHeart)
    }

    rendorHeart() {
        if (!this.barHeart) return
        const num = this.barHeart.getChildByName('nums')
        const btn = this.barHeart.getChildByName('btn_add')
        if (num) num.getComponent(cc.Label).string = `${DataManager.instance.hearts}`;
        if(btn&&DataManager.instance.hearts>0){
            btn.active=false;
        }else{
            btn.active=true;
        }
        if (btn && !btn.hasEventListener('click')) {
            btn.on('click', () => {
                this.onHeartDialogClick()
            })
        }
    }

    rendorStar() {
        if (!this.barStar) return
        const num = this.barStar.getChildByName('nums')
        if (num) {
            num.getComponent(cc.Label).string = `${DataManager.instance.collectStarCount}`;
        }
    }

    onHeartDialogClick() {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.ADDHEART);
    }

    getRewardByVideo(type: string = 'hearts') {
        AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd((msg: string) => {
            if (!SdkManager.instance.getPlatform()) {
               // ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255) })
            }
            if (type == 'hearts') {
                AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
                DataManager.instance.hearts += DataManager.instance.heartCollectByVideo
                DataManager.instance.save();
            } else {
                AudiosManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
                DataManager.instance.collectStarCount += DataManager.instance.powerCollectByVideo
                DataManager.instance.save()
                this.rendorStar()
            }
        }, (msg: string) => {
            //ToastManager.instance.show(msg, { gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255) })
        })
    }

    rendorHeartTimer() {
        if(this.barHeart){
            this.barHeart.getChildByName('nums').x=0;
        }
        
        if (!this.timerHeart) return;
        this.unscheduleAllCallbacks()
        let isSchedule: boolean = true
        if (DataManager.instance.hearts >= 5) {
            isSchedule = false;
            this.timerHeart.active=false;
        }
        if (DataManager.instance.lastHeartRefreshTime > 0) {
            isSchedule = true;
        }
        if (isSchedule) {
            let time = DataManager.instance.heartRefreshTime- DataManager.instance.lastHeartRefreshTime
            this.timerHeart.getComponent(cc.Label).string = formatSeconds(time, 'i:s');
            if(this.barHeart){
                this.barHeart.getChildByName('nums').x=-30;
            }           
            const callback = () => {
                time -= 1
                if (time <= 0) {
                    DataManager.instance.hearts += 1
                    this.rendorHeart()
                    if (DataManager.instance.hearts >= 5) {
                        this.unschedule(callback)
                        this.timerHeart.getComponent(cc.Label).string = ''
                        DataManager.instance.lastHeartRefreshTime = 0
                    } else {
                        time = DataManager.instance.heartRefreshTime
                        DataManager.instance.lastHeartRefreshTime = 0
                        this.timerHeart.getComponent(cc.Label).string = formatSeconds(time, 'i:s')
                    }
                } else {
                    this.timerHeart.getComponent(cc.Label).string = formatSeconds(time, 'i:s')
                    DataManager.instance.lastHeartRefreshTime = DataManager.instance.heartRefreshTime - time
                }
                DataManager.instance.lastHeartUpdateTime = new Date().getTime()
                DataManager.instance.save()
            }
            this.schedule(callback, 1)
        }
    }
}
