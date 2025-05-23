
const { ccclass, property } = cc._decorator;

@ccclass
export class Tools extends cc.Component {
    start() {

    }

    update(deltaTime: number) {

    }


    public static Format(date: Date, fmt: string): string {
        const o: { [key: string]: any } = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
        }

        for (const k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (String(RegExp.$1).length === 1) ? (o[k]) : (("00" + o[k]).slice(String(o[k]).length)));
            }
        }

        return fmt;
    }
}


