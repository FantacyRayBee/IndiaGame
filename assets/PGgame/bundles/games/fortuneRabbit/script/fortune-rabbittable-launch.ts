
import { FortuneRabbitLogic } from "./fortune-rabbit-logic";
import { FortuneRabbitRes } from "./fortune-rabbit-res";
const { ccclass, property } = cc._decorator;

@ccclass
export class FortuneRabbitTableLaunch extends cc.Component {
    start() {
        this.loadAssetsAsync();
    }

    private async loadAssetsAsync() {
        await FortuneRabbitRes.loadResAsync();
        if (!this.node) {
            return;
        }
        new FortuneRabbitLogic(this.node);
    }
}
