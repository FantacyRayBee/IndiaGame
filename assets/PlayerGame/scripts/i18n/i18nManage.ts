import * as i18nLabel from "./i18nLabel";
import  Constants  from "../Constants";
export class i18nManage {
    private static language = null;     // 当前语言
    private static labelArr: i18nLabel.i18nLabel[] = [];        // i18nLabel 列表
    private static labelData: { [key: string]: string } = {};   // 文字配置
    //private static defaultLabelData: { [key: string]: string } = {};   // 文字配置

    private static checkInit() {
        if (!this.language) {
            this.setLanguage("en");
        }
    }

    /**
     * 设置语言
     */
    public static setLanguage(language: string) {
        if (this.language === language) {
            return;
        }
        if (language==null||language.length!=2) {
            language='en';
        }
        for (let index = 0; index < Constants.SupportLangugae.length; index++) {
            let str = Constants.SupportLangugae[index];
            if(str==language){
                this.language = language;
                this.reloadLabel();
                break;
            }
            
        }
        
    }

    /**
     * 添加或移除 i18nLabel
     */
    public static _addOrDelLabel(label: i18nLabel.i18nLabel, isAdd: boolean) {
        if (isAdd) {
            this.labelArr.push(label);
        } else {
            let index = this.labelArr.indexOf(label);
            if (index !== -1) {
                this.labelArr.splice(index, 1);
            }
        }
    }

    public static _getLabel(opt: string, params?: string[]): string {
        this.checkInit();
        if (params==null||params.length === 0) {
           // console.log('_getLabel222:',this.labelData[opt]);
            return this.labelData[opt] || opt;
        }
        let str = this.labelData[opt] || opt;
        for (let i = 0; i < params.length; i++) {
            let reg = new RegExp("#" + i, "g")
            str = str.replace(reg, params[i]);
        }
        return str;
    }


    public static reloadLabel() {
       
        let url = "language/label/i18n_" + this.language;
        cc.resources.load(url, (err, data: cc.JsonAsset) => {
            if (err) {
               
                console.error(err);
                this.labelData = {};
            } else {
                this.labelData = data.json;
            }
            for (let one of this.labelArr) {
                one._resetValue();
            }
        });
    }

}