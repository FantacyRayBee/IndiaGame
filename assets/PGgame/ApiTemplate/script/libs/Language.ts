import { tcLog } from '../../../script/framework/log/log';
import { Game_Const } from '../config/GameConst';
import GameNet from '../net/GameNet';
import { GlobalEvents } from '../tools/GlobalEvents';
import { GlobalGame } from '../tools/GlobalGame';
const { ccclass, property } = cc._decorator;

@ccclass
export class Language extends cc.Component {
    private static instance: Language = null;
    private language: any = null;
    private lang: string = 'en';
    private constructor() {
        super();
    }

    public static getInstance(): Language {
        if (!this.instance) {
            this.instance = new Language();
            this.instance.init();
        }
        return this.instance;
    }

    LoadLocal() {
        let self = Language.getInstance();
        cc.resources.load('/json/en', (err: any, res: cc.JsonAsset) => {
            if (err) {
                console.error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            self.language = jsonData;
            tcLog.log("LoadLocal language ==>>", JSON.stringify(jsonData));
        });
    }

    init() {
        let self = Language.getInstance();
        let querys = GameNet.getInstance().getAllQueryVariables();
        self.lang = querys["language"] || Game_Const.language;
        if (self.lang) {
            let baseURL = GlobalGame.getInstance().getBaseURL();
            let url = `${baseURL}resources/language/${self.lang}.json`;
            tcLog.log("LoadLocal language url ==>>", url);
            // 使用 Fetch API 获取网络上的 JSON 文件
            fetch(url)
                .then(response => {
                    // 检查响应是否成功
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // 将响应转换为 JSON 格式
                    return response.json();
                })
                .then(jsonData => {
                    // 在这里处理 JSON 数据
                    // tcLog.log("init language ==>>", JSON.stringify(jsonData));
                    self.language = jsonData;
                    GlobalEvents.getInstance().emit("LanguageChange");
                })
                .catch(error => {
                    // 处理错误
                    console.error('There was a problem with the fetch operation:', error);
                    self.LoadLocal();
                });
        } else {
            self.LoadLocal();
        }
    }
    public GetText(str: string): string {
        if (!this.language || this.language[str] == null) {
            return str;
        }
        return this.language[str];
    }
    public LoadLanguage(): string {
        return

    }

    public static GT(str: string): string {
        return Language.getInstance().GetText(str);
    }
}


