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
            { ID: '谭轩', Name: '李嘉豪', score: -2380 },
            { ID: '常客玩家', Name: '鱼', score: 680 },
            { ID: '王重阳', Name: '赵老师', score: -1060 },
            { ID: '线上的神', Name: '东拉', score: 0 },
            // { ID: '皮卡丘', Name: '柠檬轩', score: 0 },
            { ID: 'zzy', Name: '张哥', score: 600 },
            { ID: '又菜又凶', Name: '赖发财', score: 1240 },
            { ID: '性感荷官', Name: '张哲', score: 400 },
            { ID: '泡芙老板', Name: '翠花', score: 150 },
            { ID: '上等马', Name: '小姜', score: 400 },
            // { ID: '专业荷官', Name: '小骨', score: 0 },
            // { ID: '齐天大圣', Name: '猴子', score: 0 },
            // { ID: '独家彤话', Name: '彤彤', score: 0 },
            { ID: '花店老板', Name: '曹准', score: -150 },
            // { ID: '充电宝', Name: '走马', score: 0 },
            { ID: '俊俊子', Name: '胖哥', score: 140 },
            { ID: '纸飞机', Name: '飞机', score: 0 },
            { ID: '蔡徐坤', Name: '蔡徐坤', score: 0 },
            // { ID: '边牧', Name: '边牧', score: 0 },
        ];
    },

    onLoad() {
        this.btn_save.node.on('click', this.btnClick, this);
        this.btn_print.node.on('click', this.btnClick, this);
        this.btn_init.node.on('click', this.btnClick, this);
    },

    start() {
        //先取缓存里的数组
        var arr = cc.sys.localStorage.getItem('ChildTable');
        if (!arr) {
            this.users = this.initUsers;
            cc.sys.localStorage.setItem('ChildTable', JSON.stringify(this.users))
        } else {
            this.users = this.addNewUser(JSON.parse(arr));
        }
    },

    //判断是否有新成员
    addNewUser(arr) {
        for (var i = 0; i < this.initUsers.length; i++) {
            let isNew = false;
            for (var j = 0; j < arr.length; j++) {
                if (this.initUsers[i].ID == arr[j].ID) {
                    isNew = true;
                    break;
                }
            }
            if (!isNew) {
                arr.push(this.initUsers[i]);
            }
        }
        return arr;
    },


    btnClick: function (button) {
        var btnName = button.node.name;
        if (btnName === 'btn_save') {
            this.onSave();
        } else if (btnName === 'btn_print') {
            this.onPrint();
        } else if (btnName === 'btn_init') {
            this.users = this.initUsers;
            cc.sys.localStorage.setItem('ChildTable', JSON.stringify(this.users))
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
        for (var i = 0; i < this.users.length; i++) {
            // let strings = `ID: ${this.users[i].ID}, Name: ${this.users[i].Name}, score: ${this.users[i].score}`
            let strings = `${this.users[i].Name},ID: ${this.users[i].ID}, ${this.users[i].score}`
            printString = printString + " " + (i + 1) + ". " + strings + "\n";
        }
        LoggerUtil.getInstance().log("S3赛季排行榜：\n", printString);
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
