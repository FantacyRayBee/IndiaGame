import { env } from "../app/env";
import { config } from "../config/config";
import { tcI18n } from "../framework/i18n/i18n";

export namespace time {
    export function sleep(millisecond: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, millisecond);
        });
    }

    export async function delayCall(millisecond: number, callback: Function) {
        await sleep(millisecond);

        callback();
    }

    /**
     * 格式化秒数
     * @param seconds 秒
     * @returns
     */
    export function format(seconds: number): string {
        return new Date(seconds * 1000).toISOString().substring(11, 8 + 11);
    }

    /**
     * 转换为本地时间
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateString(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${month.toString().padStart(2, "0")}/${days.toString().padStart(2, "0")}/${years}`;
    }

    /**
     * 转换为本地日期 DD/MM/YYYY
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateStringII(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${days.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${years}`;
    }

    /**
     * 转换为本地时间
     * @param timestamp 时间戳 hh:mm:ss
     * @returns
     */
    export function toLocalTimeString(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    /**
     * 转换为本地完整时间 MM/DD/YYYY hh:mm:ss
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateTimeString(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${month.toString().padStart(2, "0")}/${days.toString().padStart(2, "0")}/${years} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    /**
     * 转换为本地完整时间II YYYY-MM-DD hh:mm:ss
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateTimeStringII(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${years}-${month.toString().padStart(2, "0")}-${days.toString().padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    /**
     * 转换为本地完整时间 DD/MM/YYYY hh:mm:ss
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateTimeStringIII(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${days.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${years} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    /**
     * 转换为本地完整时间 DD/MM/YYYY
     * @param timestamp 时间戳
     * @returns
     */
    export function toLocalDateTimeStringDMY(timestamp: number): string {
        const date = new Date(timestamp);
        const years = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${days.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${years}`;
    }

    /**
     * 将秒转换为天、时分秒格式
     */
    export function formatSecondTimeString(secondsNum: number) {
        if (secondsNum <= 0) {
            return "00:00:00";
        }
        let str = "";
        if (secondsNum > 3600 * 24) {
            str = `${Math.floor(secondsNum / 3600 / 24)} ${tcI18n.i18nLabel("Days_later")}`;
        } else {
            let hours = Math.floor(secondsNum / 3600);
            let minutes = Math.floor((secondsNum % 3600) / 60);
            let seconds = Math.floor(secondsNum % 60);
            str = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }

        return str;
    }

    /**
     * 将秒数转换为"时分秒月日年"
     * @param seconds
     */
    export function formatTimeStr2MMHHMMDDMMYY(seconds: number) {
        let timeStr = time.toLocalDateTimeString(seconds);
        let timeStrs = timeStr.split(" ");
        timeStr = `${timeStrs[1]}  ${timeStrs[0]}`;
        return timeStr;
    }

    /**间隔多少秒后才可以点击发短信按钮 */
    export function getReMainSeconds(): number {
        const latestTime = env.user.smsTimeStamp;
        const endTime = latestTime + config.smsRequestInterval;
        const currTime = new Date().getTime();
        let remainTime = endTime - currTime;
        if (remainTime < 0) {
            remainTime = 0;
        }
        return Math.ceil(remainTime / 1000);
    }
}
