cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() { },

    start() {

    },

    init: function (firstCtrl) {

        this.firstCtrl = firstCtrl;

        this.btn_bg = this.node.getChildByName('bg').getComponent(cc.Button);
        this.btn_bg.node.on('click', this.btnClick, this);
        this.lab_bank = this.node.getChildByName("lab_bank").getComponent(cc.Label);
        this.lab_bank.string = "HDFC Bank";
        this.lab_amount = this.node.getChildByName("lab_amount").getComponent(cc.Label);
        
        this.lab_amount.string = "$" + this.firstCtrl.quota;

        this.btn_proceed = this.node.getChildByName("btn_proceed").getComponent(cc.Button);
        this.btn_proceed.node.on('click', this.btnClick, this);
        this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_changeBank = this.node.getChildByName("btn_changeBank").getComponent(cc.Button);
        this.btn_changeBank.node.on('click', this.btnClick, this);
        this.bankScrollView = this.node.getChildByName("bankScrollView");   // 展示银行列表
        this.content = this.bankScrollView.getChildByName("view").getChildByName("content");
        this.item = this.content.getChildByName("item");
        this.bankScrollView.active = false;
    },

    btnClick: function (Button) {
        let btnName = Button.node.name;
        if (btnName == "bg") {
            this.bankScrollView.active = false;
        } else if (btnName == "btn_changeBank") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showBankList();
        } else if (btnName == "btn_proceed" || btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            let self = this;
            ResourcesBundle.load('NewPlan/Pdd/prefab/turnTable', function (err, prefab) {
                if (err) {
                    console.error("预制体生成错误！");
                    return
                } else {
                    let turnTable = cc.instantiate(prefab);
                    let curScene = cc.director.getScene();
                    let canvas = curScene.getChildByName("Canvas");
                    turnTable.setPosition(cc.v2(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)));
                    curScene.addChild(turnTable);
                    turnTable.getComponent("turnTableCtrl").init();
                    turnTable.getComponent("turnTableCtrl").setData(self.firstCtrl.data);
                    self.node.parent.destroy();
                }
            });
        }
    },

    // 显示银行列表
    showBankList: function (data) {

        let bankList = ["AKHAND ANAND CO-OP BANK", "AU Small Finance Bank", "Aditya Birla payment bank", "Airtel Payment Bank", "Allahabad Bank", "Andhra Bank", "Andhra Pragathi Grameena Bank", "Axis Bank",
            "Bandhan Bank", "Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Bhavana Bank",
            "CSB Bank", "Canara Bank", "Central Bank of India", "City Union Bank", "Corporation Bank", "DBS Bank", "DCB Bank", "Dena Bank", "Deutsche Bank", "Dhanlaxmi Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "IDBI Bank", "IDFC Bank", "Indian Bank",
            "Indian Overseas Bank", "IndusInd Bank", "Jammu & Kashmir Bank", "Karnataka Bank", "Karur Vysya Bank", "Kotak Bank", "Laxmi Vilas Bank", "Oriental Bank of Commerce", "Punjab National Bank", "Punjab & Sind Bank",
            "RUPEEO Online Bank", "Saraswat Bank", "Shamrao Vitthal Co-operative Bank", "South Indian Bank", "State Bank of Bikaner & Jaipur", "State Bank of Hyderabad", "State Bank of India", "State Bank of Mysore", "State Bank of Patiala", "State Bank of Travancore",
            "Syndicate Bank", "Tamilnadu Mercantile Bank", "Union Bank of India", "United Bank of India", "Bank of Maharashtra", "Bank of Baroda", "Bank of Maharashtra", "Bank of Rajasthan", "Canara Bank", "Catholic Syrian Bank",
            "Suco Bank", "Syndicate Bank", "TJSB Sahakari Bank Ltd", "Tamilnad Mercantile Bank", "Telangana Grameena Bank", "The Akola Urban Co-operative Bank LTD", "The Kalupur Commercial Co-operative Bank", "The Nasik Merchants Co-operative Bank", "UCO Bank",
            "Ujjivan Small Finance Bank", "United Commercial Bank", "Utkarsh Small Finance Bank", "Uttar Bihar Gramin Bank", "Vijaya Bank", "Vijaya Bank", "Yes Bank", "Zagros Bank"];
        let item = this.item;
        this.content.removeAllChildren();
        for (let i = 0; i < bankList.length; i++) {
            const element = bankList[i];
            let itemNode = cc.instantiate(item);
            itemNode.getChildByName("lab_bank").getComponent(cc.Label).string = element;
            this.content.addChild(itemNode);
            let btn_itemNode = itemNode.getComponent(cc.Button);
            btn_itemNode.node.on('click', this.itemButtonClick, this);
        }
        this.bankScrollView.active = true;
    },

    itemButtonClick: function (Button) {
        let itemNode = Button.node;
        let bankName = itemNode.getChildByName("lab_bank").getComponent(cc.Label).string;
        let obj = { bankName: bankName, bankCard: "", IFSCode: "", bankHolder: "", bankCardPhone: "",bankEmail: "" };
        cc.sys.localStorage.setItem("bankCradInfo", JSON.stringify(obj));
        this.lab_bank.string = bankName;
        this.bankScrollView.active = false;
    },

    // update (dt) {},
});
