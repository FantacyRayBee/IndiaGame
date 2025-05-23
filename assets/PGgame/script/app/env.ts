// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

/**
 * 系统环境
 */
export namespace env {
    /**
     * 系统类型
     */
    export enum OSType {
        Android = 1,
        iOS = 2,
        Windows = 3,
        Unknown = 99,
    }

    /**
     * 支持的语言
     * @link https://hoohoo.top/blog/national-language-code-table-zh-tw-zh-cn-en-us-json-format/
     */
    export type SupportLanguage = "en-US" | "pt-BR";

    /**
     * 平台类型
     */
    export enum PlatformType {
        Native = 1,
        H5 = 2,
        WebView = 3,
        Unknown = 99,
    }

    /**
     * 设备信息
     */
    export const device = {
        /**
         * 设备号
         */
        deviceId: "",
        /**
         * 设备高度
         */
        height: 0,
        /**
         * 设备宽度
         */
        width: 0,
        /**
         * os 类型
         */
        os: 0,
        /**
         * 系统名称
         * @returns 系统名称
         */
        osName: function (): string {
            switch (this.os) {
                case OSType.Android:
                    return "Android";
                case OSType.iOS:
                    return "iOS";
                case OSType.Windows:
                    return "Windows";
                default:
                    return "Unknown";
            }
        },
        /**
         * 平台
         */
        platform: 0,
        /**
         * 平台名称
         * @returns 平台名称
         */
        platformName: function (): string {
            switch (this.platform) {
                case PlatformType.Native:
                    return "Native";
                case PlatformType.H5:
                    return "H5";
                case PlatformType.WebView:
                    return "WebView";
                default:
                    return "Unknown";
            }
        },

        /**
         * Google 广告Id
         */
        googleAdsId: "",
        /**
         * appsFlyer id
         */
        appsFlyerId: "",
        /**
         * 系统语言
         */
        language: "",
    };

    /**
     * 应用信息
     */
    export const application = {
        /**
         * 当前的位置
         */
        curLocaton: 0, //0是登录界面 1 大厅；大于2的是游戏

        /**
         * 设计分辨率宽度
         */
        designWidth: 0,
        /**
         * 设计分辨率高度
         */
        designHeight: 0,
        /**
         * 包名
         */
        bundleId: "",
        /**
         * APP版本号
         */
        version: "",
        /**
         * 资源版本号
         */
        resVersion: "",
        /**
         * 编译版本
         */
        buildVersion: "",
        /**
         * 音乐音量
         */
        musicVolume: 1,
        /**
         * 音效音量
         */
        soundVolume: 1,
        /**
         * APP语言
         */
        language: "",
        /**
         * 广告ID
         */
        adId: "",
        /**
         * facebook 广告id
         */
        facebookPixelId: "",
        /**
         * 显示每日领取界面
         */
        showDailyView: false,
        /**
         * app 现在地址（h5专用）
         */
        downloadUrl: "",
        /**
         * 是否需要短信验证（注册页面使用）
         */
        needSmsCode: 1,
        /**
         * 平台Logo地址
         */
        logoUrl: "",
        /**
         * 服务器返回错误
         */
        ServerError: false,
    };

    /**
     * 用户信息
     */
    export const user = {
        /**
         * 用户 Id
         */
        userId: 0,
        /**
         * 认证 token
         */
        authorization: "",
        /**
         * 余额
         */
        balance: 0,
        /**
         * 昵称
         */
        nickname: "",
        /**
         * 性别
         */
        gender: "",
        /**
         * 头像
         */
        avatarId: "",
        /**
         * 区号
         */
        areaCode: "",
        /**
         * 手机号
         */
        telNumber: "",
        /**
         * vip 等级
         */
        vip: 0,

        /**
         * sms短信时间戳
         */
        smsTimeStamp: 0,

        /**
         * 是否显示充值提现按钮
         */
        isShowCZTX: false,

        /**
         * 是否是风险用户
         */
        isRisk: false,
        /**
         * 手机号验证状态 1 无号码，2 有号码未验证，3 有号码已验证
         */
        telNumberStatus: 0,
        /**
         * 用户 CPF
         * 用户的 CPF
         */
        cpf: "",
    };

    /**
     * 玩家头像信息
     */
    export const avatarMap: Map<string, cc.SpriteFrame> = new Map();

    /**Ad Sprite */
    // export const AdMap: Map<string, cc.SpriteFrame> = new Map();

    export interface CustomServiceInfo {
        type: string;
        nickname: string;
        link: string;
    }

    /**
     * service
     */
    export const service: Map<string, CustomServiceInfo> = new Map();

    interface NativeGame {
        gameId: number;
        bundleName: string;
        localVersion: string;
        remoteVersion: string;
        needUpdate: boolean;
        downloadUrl: string;
    }

    export const nativeGameConfig: { [key: number]: NativeGame } = {};

    export const curGameData: { data: any; balance: number; betIndex: number, betSizeIndex: number } = { data: 0, balance: 0, betIndex: 0, betSizeIndex: 0 };

    export function isAuthorizated() {
        return user.authorization.length > 0;
    }

    export function clearUserInfo() {
        user.areaCode = "";
        user.authorization = "";
        user.avatarId = "";
        user.balance = 0;
        user.cpf = "";
        user.gender = "";
        user.isRisk = false;
        user.isShowCZTX = false;
        user.nickname = "";
        user.smsTimeStamp = 0;
        user.telNumber = "";
        user.telNumberStatus = 0;
        user.areaCode = "";
    }
}
