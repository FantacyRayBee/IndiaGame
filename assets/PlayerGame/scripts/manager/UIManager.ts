

import { ENUM_UI_TYPE } from './../Enum';
import { StaticInstance } from './../StaticInstance';
import BaseDialog from '../layer/BaseDialog';
import PoolManager from './PoolManager';
import MainLayer from '../layer/MainLayer';

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    private uiMap = new Map<ENUM_UI_TYPE, BaseDialog>()

    protected onLoad(): void {
        StaticInstance.setUIManager(this)
    }

    init() {
        for (let type in ENUM_UI_TYPE) {
            const node: cc.Node = PoolManager.instance.getNode(ENUM_UI_TYPE[type], this.node)
            if (node && !this.uiMap.has(ENUM_UI_TYPE[type])) {
                node.active = false
                node.addComponent(ENUM_UI_TYPE[type])
                this.uiMap.set(ENUM_UI_TYPE[type], node.getComponent(ENUM_UI_TYPE[type]))
            }
        }
    }

    //切换页面
    toggle(key: ENUM_UI_TYPE, status: boolean = true,param?,callback?: () => void) {
        if (this.uiMap.has(key)) {
            const layer = this.uiMap.get(key)
            status ? layer.show(param) : layer.hide()
            callback && callback()
        }
    }

    isActive(key: ENUM_UI_TYPE) {
        if (this.uiMap.has(key)) {
            return this.uiMap.get(key).node.active
        }
        return false
    }

    getActiveTypes() {
        const types: ENUM_UI_TYPE[] = []
        this.uiMap.forEach((layer: BaseDialog, type: ENUM_UI_TYPE) => {
            if (this.isActive(type)) types.push(type)
        })
        return types
    }

    setMainLevel() {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        layer?.rendorLevel()
    }

    setMainTimer(status: boolean = true) {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        if (status) {
            layer?.onTimerStart()
        } else {
            layer?.onTimerStop()
        }
    }

    setMainPauseTimer(time:number) {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer;
        layer?.onTimerPause(time);
    }

    setMainTimerSound(status: boolean = true) {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        if (status) {
            layer?.onTimerSoundStart()
        } else {
            layer?.onTimerSoundStop()
        }
    }

    setMainProgress(isInit: boolean = false) {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        layer?.onProgressStart(isInit)
    }

    setMainPowerCollect(isInit: boolean = false) {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        layer?.rendorStarCollect()
    }

    getMainLayer() {
        const layer: MainLayer = this.uiMap.get(ENUM_UI_TYPE.MAIN) as MainLayer
        return layer;
    }

}
