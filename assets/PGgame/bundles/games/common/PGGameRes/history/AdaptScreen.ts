
import { tcLog } from '../../../../../script/framework/log/log';
import { AdapterV2 } from '../../../../../script/pkg/adapter-v2';
const { ccclass, property } = cc._decorator;

@ccclass
export class AdaptScreen extends cc.Component {

    @property(cc.Boolean)
    maxWidth: boolean = true;
    @property(cc.Boolean)
    maxHeight: boolean = true;


    onLoad() {
        tcLog.log("changeSize:", AdapterV2.getInstance().rootCanvasWidth,
            AdapterV2.getInstance().rootCanvasHeight);

        let t: cc.Size = new cc.Size(0, 0)
        t.width = AdapterV2.getInstance().rootCanvasWidth
        t.height = AdapterV2.getInstance().rootCanvasHeight


        if (this.maxHeight) {
            if (t.height > 1875) {
                let sss = (t.height - 1875) * 0.5
                this.node.setPosition(0, sss < 38 ? sss : 38);
                t.height = 1875;
            } else {
                this.node.setPosition(0, 0);
            }
        }
        if (this.maxWidth) {
            if (t.width > 810) {
                t.width = 810;
            }
        }

        this.node.setContentSize(t.width, t.height);
    }

}


