cc.Class({
    extends: require('UINode'),

    properties: {
        edit_name: cc.EditBox,
        edit_score: cc.EditBox,
        btn_save: cc.Button,
        btn_print: cc.Button,
        btn_init: cc.Button,
    },
    ctor() {
        this.initUsers = [
            {Name: "鱼", ID: "GARRETT", score: 220 }, 
            {Name: "边牧", ID: "边牧", score: -470 }, 
            {Name: "蔡徐坤", ID: "蔡徐坤", score: 510 }, 
            {Name: "东拉", ID: "线上的神", score: -460 }, 
            // {Name: "张哲", ID: "蹲子", score: 600 }, 
            {Name: "翠花", ID: "泡芙老板", score: 750 }, 
            {Name: "张哥", ID: "zzy", score: 30 }, 
            {Name: "走马", ID: "充电宝", score: -950 }, 
            // {Name: "胖哥", ID: "俊俊子", score: 140 }, 
            {Name: "小骨", ID: "专业he官", score: 470 }, 
            // {Name: "TT", ID: "TT", score: 20 }, 
            {Name: "飞机", ID: "纸飞机", score: 5500 }, 
            {Name: "赵老师", ID: "王重阳", score: -390 }, 
            {Name: "赖发财", ID: "又菜又凶", score: -2740 }, 
            {Name: "小姜", ID: "上等马", score: 210 }, 
            {Name: "曹俊", ID: "花店老板", score: -80 }, 
            {Name: "嘉豪", ID: "谭轩", score: -2780 }, 
            {Name: "吴洋", ID: "吴洋", score: 1940 }, 
            {Name: "翟子文", ID: "翟子文", score: -1300 }, 
            {Name: "艾黎", ID: "艾黎", score: -1060 }, 
            {Name: "李伟", ID: "李嘉诚", score: -1890 }, 
            {Name: "挖机", ID: "挖机", score: 1350 }, 
            {Name: "贝总", ID: "贝总", score: 370 }, 
            {Name: "老汉憨憨", ID: "走马2", score: 190 }, 
            {Name: "雪球王", ID: "lucky", score: 360 }, 
            // { ID: '皮卡丘', Name: '柠檬轩', score: 0 },
            // { ID: '齐天大圣', Name: '猴子', score: 0 },
            // { ID: '独家彤话', Name: '彤彤', score: 0 },
        ];
    },

    onLoad() {
        this.btn_save.node.on('click', this.btnClick, this);
        this.btn_print.node.on('click', this.btnClick, this);
        this.btn_init.node.on('click', this.btnClick, this);
    },

    start() {
        this.users = this.initUsers;
    },

    btnClick: function (button) {
        var btnName = button.node.name;
        if (btnName === 'btn_save') {
            this.onSave();
        } else if (btnName === 'btn_print') {
            this.onPrint();
        } else if (btnName === 'btn_init') {
            this.users = this.initUsers;
        }
    },

    onSave: function () {
        // 保存数据到本地存储
        if (this.edit_name.string == '' || this.edit_score.string == '') {
            return;
        }
        let isFind = false;
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].Name == this.edit_name.string || this.users[i].ID == this.edit_name.string) {
                let num = parseInt(this.users[i].score, 10);
                num += parseInt(this.edit_score.string)
                this.users[i].score = num;
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            this.users.push({
                Name: this.edit_name.string,
                score: this.edit_score.string
            });
        }
        cc.sys.localStorage.setItem('ChildTable', JSON.stringify(this.users));
        this.edit_name.string = '';
        this.edit_score.string = '';
    },

    onPrint: function () {
        this.onSort();
        // 打印数据
        let printString = '';
        let printString2 = '';
        for (var i = 0; i < this.users.length; i++) {
            // let strings = `ID: ${this.users[i].ID}, Name: ${this.users[i].Name}, score: ${this.users[i].score}`
            let strings = `${this.users[i].Name},ID: ${this.users[i].ID}, ${this.users[i].score}`
            printString = printString + " " + (i + 1) + ". " + strings + "\n";
            let strings2 = `{Name: "${this.users[i].Name}", ID: "${this.users[i].ID}", score: ${this.users[i].score} }, \n`
            printString2 += strings2
        }
        LoggerUtil.getInstance().log("S4赛季排行榜：\n", printString);
        LoggerUtil.getInstance().log("S4赛季排行榜2：\n", printString2);
    },

    onSort: function () {
        // 按分数排序
        this.users.sort(function (a, b) {
            return b.score - a.score;
        });
    },

    onDestroy: function () {
    },
});
