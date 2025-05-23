/**
 * pageView中嵌套scrollView时，需要加上该脚本才能同时响应
 */
const { ccclass, property } = cc._decorator;

interface EventTouch extends cc.Event.EventTouch {
    simulate?: boolean;
    sham?: boolean;
}

@ccclass
export default class ViewGroupNesting extends cc.Component {
    private events: EventTouch[] = [];

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchHandle, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchHandle, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchHandle, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchHandle, this, true);
    }

    private onTouchHandle(event: EventTouch) {
        if (event.sham || event.simulate || event.target === this.node) return;

        const cancelEvent: EventTouch = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
        cancelEvent.type = event.type;
        cancelEvent.touch = event.touch;
        cancelEvent.sham = true;
        // 问：这里为啥不直接dispatchEvent
        // 答：必须让ScrollView把真的event先消耗掉，我们再发射假的才可以，
        // 可以去CCNode.js下找一个_doDispatchEvent函数，里面用到了_cachedArray这么个全局变量，
        // 先发射假的话，真的那个数据就被清空了
        this.events.push(cancelEvent);
    }

    update() {
        if (this.events.length === 0) return;
        for (let index = 0; index < this.events.length; index++) {
            this.node.dispatchEvent(this.events[index]);
        }
        this.events.length = 0;
    }
}
