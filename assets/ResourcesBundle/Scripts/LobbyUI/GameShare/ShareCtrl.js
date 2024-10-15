cc.Class({
    extends: cc.Component,

    properties: {
        BtnClose: {
            default: null,
            type: cc.Button
        },
        BtnFuZhi: {
            default: null,
            type: cc.Button
        },
        LabWXH: {
            default: null,
            type: cc.Label
        },
    },

    onLoad: function () {
        this.BtnClose.node.on('click', this.btnClick, this);
        this.BtnFuZhi.node.on('click', this.btnClick, this);

        let url = "https://redpacket.aivined.com/#"
        if(cc.sys.isBrowser){
            url = GlobalCfg.DOWN_H5_URL;
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID){
            url = GlobalCfg.DOWN_APK_URL;
        }
        else if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
            url = GlobalCfg.DOWN_IPA_URL;
        }
        this.LabWXH.string = url
        this.weixinhao = url

    },

    btnClick: function (sender) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = sender.node.name;
        if (btnName == "btn_close") {
            this.node.destroy();
        }else if (btnName == "btn_fuzhi") {
            if(cc.sys.isBrowser){
                this.webCopyString(this.weixinhao)
            }else{
                APPManager.copyToPasteBoard(this.weixinhao);
                CommonFun.getInstance().showTips("Copy successfully!")
            }
        }
    },

 
    webCopyString: function(str){
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
            CommonFun.getInstance().showTips("Copy successfully!")
        } catch (err) {}

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return success;
    },
});
