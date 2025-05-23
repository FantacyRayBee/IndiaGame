// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { env } from "../app/env";
import { event } from "../event/event";

export namespace cronBalance {
    let timeoutId: number;
    const fibTimes = [1, 5]; // https://zh.wikipedia.org/zh-tw/斐波那契数
    let fibIndex = 0;

    export function start() {
        clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            // todo get balance
            if (env.application.curLocaton == 1) {
                cc.systemEvent.emit(event.refreshBalance);
            }
            start();
        }, fibTimes[fibIndex] * 1000);

        fibIndex++;
        if (fibIndex >= fibTimes.length) {
            // fibIndex = fibTimes.length - 1;
            cronBalance.stop();
        }

        // cc.systemEvent.emit(event.refreshBalance);
    }

    export function stop() {
        fibIndex = 0;
        clearTimeout(timeoutId);
    }

    export function reset() {
        fibIndex = 0;
        start();
    }
}
