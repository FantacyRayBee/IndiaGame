

import { StaticInstance } from "../StaticInstance";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FadeManager extends cc.Component {
    onLoad() {
        this.node.active = false
        StaticInstance.setFadeManager(this)
    }

    fadeIn(seconds: number = 0.2) {
        return new Promise(resolve => {
            this.node.active = true
            this.node.opacity = 0
            cc.tween(this.node).to(seconds, { opacity: 255 }).call(() => {
                resolve(null)
            }).start()
        })
    }

    fadeOut(seconds: number = 0.2) {
        return new Promise(resolve => {
            this.node.active = true
            this.node.opacity = 255
            cc.tween(this.node).to(seconds, { opacity: 0 }).call(() => {
                this.node.active = false
                resolve(null)
            }).start()
        })
    }
}
