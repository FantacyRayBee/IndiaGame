

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseDialog extends cc.Component {

    show(...params) {
        this.node.active = true;
        this.onShown(...params);
    }

    

    hide() {
        this.node.active = false;
        this.onHide();
    }

    onShown(...params){

    }

    onHide(){

    }

    zoomIn(node: cc.Node, scale: number = 1.5, speed: number = 0.3) {
        node.setScale(scale)
        const act = cc.scaleTo(speed, 1)
        cc.tween(node).then(act).start()
    }

    zoomOut(node: cc.Node, scale: number = 0.5, speed: number = 0.3) {
        node.setScale(scale)
        const act = cc.scaleTo(speed, 1)
        cc.tween(node).then(act).start()
    }
}
