

cc.Class({
    extends: cc.Component,

    properties: {
        // lab_name : cc.Label
    },



    onLoad () {
        this.AllLabelNode()
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandle);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN) {
            if( notify == 1 || notify == 2) {
                self.AllLabelNode()
            } 
        }
    },

    showLabel:function(lab){
        let name  =  lab.node.name;
        for (const key in updownLanguage) {
            if (Object.hasOwnProperty.call(updownLanguage, key)) {
                let arr = updownLanguage[key];
                if(name == arr[0]) {
                    lab.string = arr[language]
                } 
            }
        }
    },

    AllLabelNode:function() {
        var sprites = this.node.getComponentsInChildren(cc.Label);
        for (let i = 0; i < sprites.length; i++) {
            let lab = sprites[i]
            this.showLabel(lab)
            LoggerUtil.getInstance().log("当前的的节点名字",this.node.name,"LABEL的名字",lab.node.name)
        }
    },

  
   

   



 
});
