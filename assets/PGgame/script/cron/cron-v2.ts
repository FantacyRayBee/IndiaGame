// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export class CronV2 {
    private timerId: number = 0;
    private handler: Function;
    private timeout: number;

    public constructor(milliSeconds: number, callback: Function) {
        this.timeout = milliSeconds;
        this.handler = callback;
    }

    public start() {
        this.stop();

        this.handler();
        this.timerId = window.setInterval(() => {
            this.handler();
        }, this.timeout);
    }

    public stop() {
        if (this.timerId === 0) {
            return;
        }

        window.clearInterval(this.timerId);
        this.timerId = 0;
    }
}
