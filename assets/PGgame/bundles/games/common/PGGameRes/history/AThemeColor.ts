import { UIhistory } from "./UIhistory";

const { ccclass, property } = cc._decorator;

@ccclass
export class AThemeColor extends cc.Component {


    onLoad() {

        this.node.color = UIhistory.themeColor
    }

}


