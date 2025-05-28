export namespace currency {
    interface Locale {
        language: string;
        symbol: string;
    }
    const supportCodes: Map<string, Locale> = new Map([
        ["BRL", { language: "pt-BR", symbol: "R$" }],
        ["USD", { language: "en-US", symbol: "$" }],
        ["AUD", { language: "en-US", symbol: "A$" }],
    ]);

    let nowCode = supportCodes.get("USD");

    export function setSymbol(s: string) {
        const data = supportCodes.get(s.toUpperCase());
        if (!data) {
            return "$";
        }

        nowCode = data;
    }
    export function getSymbol() {
        return nowCode?.symbol
    }

    /**
     * 格式化余额
     * @param value 余额
     * @param toFixed 强制保留2位小数
     * @returns 格式后的字符串 `12,345.67`
     */
    export function format(val: number, beautiful: boolean = true, withSymbol: boolean = false, len: number = 2): string {
        let value = val / 100

        const needDigits = value % 100 !== 0;
        const realValue = value / 100;
        const s = new Intl.NumberFormat(nowCode?.language, {
            style: "decimal",
            minimumFractionDigits: beautiful ? 2 : needDigits ? 2 : 0,
            maximumFractionDigits: beautiful ? 2 : needDigits ? 2 : 0,
        }).format(realValue);

        return withSymbol ? `${nowCode?.symbol}${s}` : s;

        // let fuhao = value < 0;
        // value = Math.abs(value);
        // let n = value.toString();
        // let point_pos = n.indexOf(".");
        // let intPart = n.substring(0, point_pos);
        // let floatPart = n.substring(point_pos + 1);
        // if (point_pos < 0) {
        //     intPart = n;
        //     floatPart = "";
        // }

        // if (intPart.length > 3) {
        //     let tmp = "";
        //     let cnt = 0;
        //     for (let i = intPart.length - 1; i >= 0; i--) {
        //         tmp = intPart[i] + tmp;
        //         cnt++;
        //         if (cnt % 3 == 0 && i != 0) {
        //             tmp = "," + tmp;
        //         }
        //     }
        //     intPart = tmp;
        // }

        // let valStr = ""
        // if (len == 2) {
        //     if (floatPart.length == 0) {
        //         floatPart = "00";
        //     } else if (floatPart.length == 1) {
        //         floatPart = floatPart + "0";
        //     } else {
        //         floatPart = floatPart.substring(0, 2);
        //     }
        //     valStr = "." + floatPart;

        // } else {
        //     if (floatPart.length == 0) {
        //         valStr = floatPart;
        //     } else if (floatPart.length == 1) {
        //         valStr = "." + floatPart + "0";
        //     } else {
        //         valStr = "." + floatPart.substring(0, 2);
        //     }
        // }
        // // tcLog.log("valStr:", valStr, "   ", intPart + valStr);
        // if (fuhao) {
        //     return "-" + (withSymbol ? nowCode.symbol : "") + intPart + valStr;
        // } else {
        //     return (withSymbol ? nowCode.symbol : "") + intPart + valStr;
        // }
    }


    /**
     * 格式化余额，返回带货币符号
     * @param value 余额
     * @param beautiful 是否强制保留小数
     * @returns
     */
    export function formatWithSymbol(value: number, beautiful: boolean = true, len?: number) {
        return format(value, beautiful, true, len);
    }

    /**
     * 格式化余额，返回不带货币符号
     * @param value 余额
     * @param beautiful 是否强制保留小数
     * @returns
     */
    export function formatNoSymbol(value: number, beautiful: boolean = true, len?: number) {
        return format(value, beautiful, false, len);
    }

    /**除法函数，用来得到精确的除法结果
     *说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
     *调用：accDiv(arg1,arg2)
     *返回值：arg1除以arg2的精确结果
     */
    export function accDiv(arg1: number, arg2: number) {
        let t1 = 0;
        let t2 = 0;
        let r1;
        let r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) { }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) { }
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    /**
     *乘法函数，用来得到精确的乘法结果
     *说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
     *调用：accMul(arg1,arg2)
     *返回值：arg1乘以arg2的精确结果
     */
    export function accMul(arg1: number, arg2: number) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) { }
        try {
            m += s2.split(".")[1].length;
        } catch (e) { }
        return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
    }
}
