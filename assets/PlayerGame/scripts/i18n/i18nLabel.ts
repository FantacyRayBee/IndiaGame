import { i18nManage } from "./i18nManage";
const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, menu } = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(cc.Label)
@disallowMultiple
@menu("多语言/i18nLabel")
export class i18nLabel extends cc.Component {

    @property({ visible: false })
    private i18n_string: string = "";

    @property({ visible: false })
    private i18n_params: string[] = [];

    start() {
        i18nManage._addOrDelLabel(this, true);
        this._resetValue();
    }

    @property({ type: cc.String })
    get string() {
        return this.i18n_string;
    }

    set string(value: string) {
        this.i18n_string = value;

        this.setEndValue()
    }

    @property({ type: [cc.String] })
    get params() {
        return this.i18n_params;
    }

    set params(value: string[]) {
        this.i18n_params = value;

        this.setEndValue()
    }

    init(string: string, params: string[]) {
        this.i18n_string = string;
        this.i18n_params = params;

        this.setEndValue()
    }

    private setEndValue() {
        let label = this.getComponent(cc.Label);
        if (cc.isValid(label)) {
           // console.log('this.i18n_string:',this.i18n_string);
           // console.log('_getLabel:',i18nManage._getLabel(this.i18n_string, this.i18n_params));
            label.string = i18nManage._getLabel(this.i18n_string, this.i18n_params);
        }
    }

    _resetValue() {
        this.string = this.i18n_string;
    }

    onDestroy() {
        i18nManage._addOrDelLabel(this, false);
    }
}
