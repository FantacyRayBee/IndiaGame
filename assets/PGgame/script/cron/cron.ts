// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export class Cron {
    private timerId: number;
    private readonly times: number[] = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    private timerIndex = 0;
    private callback: Function;

    public constructor(callback: Function) {
        this.timerId = 0;
        this.callback = callback;
    }

    public start() {
        this.timerId = window.setTimeout(() => {
            this.callback();
            this.start();
        }, this.times[this.timerIndex] * 1000);

        this.timerIndex++;
        if (this.timerIndex >= this.times.length) {
            this.stop();
        }
    }

    public stop() {
        clearTimeout(this.timerId);

        this.timerIndex = 0;
    }

    public reset() {
        clearTimeout(this.timerId);

        this.timerIndex = 0;
        this.start();
    }

    public updateTimes(newTimes: number[]) {
        clearTimeout(this.timerId);

        this.times.length = 0;
        this.times.push(...newTimes);

        this.timerIndex = 0;
        this.start();
    }
}
