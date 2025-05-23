

const { ccclass, property } = cc._decorator;

@ccclass
export class BlockComp extends cc.Component {
    closeWhenClick: boolean = true;

    protected onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.doBlock, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.doBlock, this);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.doBlock, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.doBlock, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.doBlock, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.doBlock, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.doBlock, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.doBlock, this);
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.doBlock, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.doBlock, this);

        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.doBlock, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.doBlock, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.doBlock, this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.doBlock, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.doBlock, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.doBlock, this);
    }

    private onTouchStart(evt: any) {
        evt.propagationStopped = true;
        if (this.closeWhenClick) {
            this.node.destroy();
        }
    }

    private doBlock(evt: any) {
        evt.propagationStopped = true;
    }
}


