// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { tcLog } from "../framework/log/log";

/**
 * 用于操作函数防抖，防抖就是将多次高频操作优化为只在最后一次执行
 * 某个函数在某段时间内，无论触发了多少次回调，都只执行最后一次
 * @param wait 延时ms后再执行
 * @param immediate 是否立即执行
 * @constructor
 */
export const debounce = (wait: number, immediate: boolean = true) => {
    return function (target: any, key: string, descriptor: any) {
        let timer: any;
        const fn = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            // 立即执行的功能（timer为空表示首次触发）
            if (immediate) {
                if (!timer) {
                    fn.apply(this, args);
                    timer = setTimeout(function () {
                        timer = undefined;
                    }, wait);
                } else {
                    // 有新的触发，则把定时器清空
                    timer && clearTimeout(timer);
                    // 重新计时
                    timer = setTimeout(() => {
                        fn.apply(this, args);
                    }, wait);
                }
            } else {
                // 有新的触发，则把定时器清空
                timer && clearTimeout(timer);
                // 重新计时
                timer = setTimeout(() => {
                    fn.apply(this, args);
                }, wait);
            }
        };
        return descriptor;
    };
};

/**
 * 用于操作函数节流，节流就间隔时间段 时间内执行一次，
 * 也就是降低频率，将高频操作优化成低频操作。
 * @param wait 间隔ms 期间内再次触发无效
 * @constructor
 */
export const throttle = (wait: number) => {
    return function (target: any, key: string, descriptor: any) {
        let timer: any;
        let fn = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            tcLog.log("Throttle timer", timer);
            if (!timer) {
                fn.apply(this, args);
                timer = setTimeout(() => {
                    timer = undefined;
                }, wait);
            }
        };
    };
};
