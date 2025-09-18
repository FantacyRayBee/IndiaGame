cc.Class({
    extends: cc.Component,

    properties: {
        lab_nums: [cc.Label],   //0 WhatsApp 1 Email  2 facebook 

    },

    onLoad() {
        let root = this.node.getChildByName('root');
        this.btn_close = root.getChildByName('btn_close').getComponent(cc.Button);
        this.btn_go_telegram = root.getChildByName('node_telegram').getChildByName('btn_go_telegram').getComponent(cc.Button);
        this.btn_copy_email = root.getChildByName('node_email').getChildByName('btn_copy_email').getComponent(cc.Button);
        this.btn_twitter = root.getChildByName('node_twitter').getChildByName('btn_twitter').getComponent(cc.Button);
        this.btn_go_feedback = root.getChildByName('node_feedback').getChildByName('btn_go_feedback').getComponent(cc.Button);
        this.btn_service = root.getChildByName('node_service').getChildByName('btn_service').getComponent(cc.Button);
        let arr = [this.btn_close, this.btn_service, this.btn_go_telegram, this.btn_twitter, this.btn_copy_email, this.btn_go_feedback];
        for (let i = 0, len = arr.length; i < len; i++) {
            const element = arr[i];
            element.node.on('click', this.btnClick, this);
        }
    },

    start: function() {
        this.setContactData();

    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CUSTOMERSERVICE);
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        if (btnName == 'btn_close') {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == 'btn_go_telegram') {
            // Skip TO Telegram
            let str = this.channel_info.telegram;
            let arr = str.split('/');
            let pageid = arr[arr.length - 1];
            APPManager.skipToOtherApp('org.telegram.messenger', pageid);
        } else if (btnName == 'btn_twitter') {
            // Skip to Twitter
            let str = this.channel_info.facebook;
            let arr = str.split('/');
            let screenName = arr[arr.length - 1];
            APPManager.skipToOtherApp('com.twitter.android', screenName);
        } else if (btnName == 'btn_copy_email') {
            // Skip to WhatsApp
            let whatsAppInfos = this.channel_info.whatsApp.split(',');
            let mobileNum = whatsAppInfos[0].match(/\d+/g);
            let channelLink = whatsAppInfos[1];
            APPManager.skipToOtherApp("com.whatsapp", channelLink);
        } 
        else if (btnName == 'btn_service') {
            // Skip to service
            let str = GlobalCfg.USER_DATAS.web_customer_service;
            str += "?userId=" + GlobalCfg.USER_DATAS.userId;
            str += "&nickname=" + GlobalCfg.USER_DATAS.userName;
            str += "&mobile=" + GlobalCfg.USER_DATAS.phone;
            str += "&email=" + GlobalCfg.USER_DATAS.mail;

            LoggerUtil.getInstance().log('btn_service str:' , str);
            cc.sys.openURL(str);
        } 
        else if (btnName == 'btn_go_feedback') {
            CommonFun.getInstance().showFastFeedBack();
        }
    },

    /**
     * 设置多种联系方式
     */
    setContactData: function() {
        this.channel_info = {...GlobalCfg.USER_DATAS.customerService};
        LoggerUtil.getInstance().log('ContactData', this.channel_info);
        for (let i = 0, len = this.lab_nums.length; i < len; i++) {
            switch (i) {
                case 0:
                    this.lab_nums[i].string = GlobalCfg.USER_DATAS.web_customer_service;
                    break;
                case 1:
                    this.lab_nums[i].string = this.channel_info.telegram;
                    break;
                case 2:
                    this.lab_nums[i].string = this.channel_info.facebook;
                    break;
                default:
                    this.lab_nums[i].string = "null";
                    break;
            }
        }
    },

    /**
     * 分割WhatsApp联系方式
     * @param {String} str 
     * @returns Array
     */
    splitWhatsAppNum: function (str) {
        let arr = str.split('');
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            let element = arr[i];
            if (i > 1 && (element == '(' || element == '（')) {
                return arr.slice(0, i)
            }
        }
        return arr
    },

    /**
     * 将联系方式 String 转为键值对
     * @param {String} info 
     * @returns Object
     */
    splitChannel_info: function (info) {
        let arr1 = info.split(',');
        let arr = [];
        for (let i = 0; i < arr1.length; i++) {
            let item = arr1[i];
            let arr2 = item.split(':');
            arr.push(arr2);
        }
        let obj = {};
        arr.forEach((item) => {
            let key = item[0];
            obj[key] = item[1];
        })
        return obj
    },

    /**
     * web端复制内容
     * @param {String} str 复制内容
     * @param {String} subsc 复制成功提示
     * @returns 
     */
    webCopyString: function (str, subsc) {
        var input = str;
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
            CommonFun.getInstance().showTips(subsc)
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        return success;
    },
});
