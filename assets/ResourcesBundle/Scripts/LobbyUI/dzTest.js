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
            {Name: "飞机", ID: "纸飞机", score: 770 }, 
            {Name: "赖发财", ID: "又菜又凶", score: 750 }, 
            {Name: "蔡徐坤", ID: "蔡徐坤", score: 700 }, 
            {Name: "鱼", ID: "常客玩家", score: 670 }, 
            {Name: "张哲", ID: "性感荷官", score: 600 }, 
            {Name: "走马", ID: "充电宝", score: 210 }, 
            {Name: "东拉", ID: "线上的神", score: 180 }, 
            {Name: "翠花", ID: "泡芙老板", score: 140 }, 
            {Name: "胖哥", ID: "俊俊子", score: 140 }, 
            {Name: "张哥", ID: "zzy", score: 130 }, 
            {Name: "小骨", ID: "专业荷官", score: 100 }, 
            {Name: "小姜", ID: "上等马", score: -80 }, 
            {Name: "赵老师", ID: "王重阳", score: -800 }, 
            {Name: "曹俊", ID: "花店老板", score: -950 }, 
            {Name: "嘉豪", ID: "谭轩", score: -2540 }, 
            // { ID: '皮卡丘', Name: '柠檬轩', score: 0 },
            // { ID: '齐天大圣', Name: '猴子', score: 0 },
            // { ID: '独家彤话', Name: '彤彤', score: 0 },
            // { ID: '边牧', Name: '边牧', score: 0 },
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
        LoggerUtil.getInstance().log("S3赛季排行榜：\n", printString);
        LoggerUtil.getInstance().log("S3赛季排行榜2：\n", printString2);
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
