
const { ccclass, property } = cc._decorator;

@ccclass
export class GlobalEvents extends cc.Component {
    public event: cc.EventTarget = new cc.EventTarget();
    private static instance: GlobalEvents = null;

    private constructor() {
        super();
    }

    public static getInstance(): GlobalEvents {
        if (!this.instance) {
            this.instance = new GlobalEvents();
        }
        return this.instance;
    }

    start() {

    }

    update(deltaTime: number) {

    }

    // Emit a global event
    public emit(eName: string, ePara?: any): void {
        this.event.emit(eName, ePara);
    }

    public once(evt: string, callback: (event: any) => void, target?: Object): void {
        //tcLog.log("GlobalEvents ==> on ",evt,callback,target);
        this.event.once(evt, callback, target);
    }
    // Listen to a global event
    public on(evt: string, callback: (event: any) => void, target?: Object): void {
        //tcLog.log("GlobalEvents ==> on ",evt,callback,target);
        this.event.on(evt, callback, target);
    }

    // Stop listening to a global event
    public off(evt: string, callback?: (event: any) => void, target?: Object): void {
        //tcLog.log("GlobalEvents ==> off ",evt,callback,target);
        this.event.off(evt, callback, target);
    }

    public luck(autoUnluck: boolean = true, timeout: number = 0) {
        this.emit('luck', { autoUnluck: autoUnluck, timeout: timeout });
    }


    public unluck(force: boolean = true) {
        this.emit('unluck', { force: force });
    }
}


