// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

/**
 * 日志模块
 * 0 silence
 * 1 error
 * 2 warn
 * 3 info
 * 4 debug
 */
export namespace tcLog {
    let level: number = 4

    function timeFormat() {
        const date = new Date();

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const millsecond = date.getMilliseconds();

        const padding = (value: number, maxLength?: number) => `${value}`.padStart(maxLength ?? 2, "0");
        return `${padding(year)}/${padding(month)}/${padding(day)} ${padding(hour)}:${padding(minute)}:${padding(second)}.${padding(millsecond, 3)}`;
    }

    export function setLevel(lvl: number) {
        level = lvl;
    }

    export function debug(...args: any[]): void {
        if (level < 4) {
            return;
        }
        console.log(timeFormat(), ...args);
        // const log = cc.log || console.debug;
        // log.call(log, timeFormat(), cc.js.formatStr("%s", args));
    }

    export function info(...args: any[]): void {
        if (level < 3) {
            return;
        }
        console.log(timeFormat(), ...args);
        // const log = cc.log || console.info;
        // log.call(log, timeFormat(), cc.js.formatStr("%s", args));
    }

    export function log(...args: any[]): void {
        if (level < 3) {
            return;
        }
        console.log(timeFormat(), ...args);
    }

    export function warn(...args: any[]): void {
        if (level < 2) {
            return;
        }

        console.warn(timeFormat(), ...args);
        // const log = cc.warn || console.warn;
        // log.call(log, timeFormat(), cc.js.formatStr("%s", args));
    }

    export function error(...args: any[]): void {
        if (level < 1) {
            return;
        }

        console.error(timeFormat(), ...args);
        // const log = cc.error || console.error;
        // log.call(log, timeFormat(), cc.js.formatStr("%s", args));
    }
}
