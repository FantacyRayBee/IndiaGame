cc.Class({
    extends: cc.Component,

    properties: {
        node_choice:cc.Node,
        heaSprite : cc.Sprite,
        btn_head : cc.Button,
        atlas_head : cc.SpriteAtlas,
    },

    setUserHead:function(date, ctrl){
        this.changeHeadCtrl = ctrl;
        this.url = date.avatar;
        this.id =  date.id ;
        this.heaSprite.spriteFrame = this.atlas_head.getSpriteFrame(this.id);
        this.loadHeadSp(this.url,110,this.heaSprite);
        this.btn_head.node.on('click',this.btnClick,this);

        if (GlobalCfg.USER_DATAS.userHeadimgurl && this.url && GlobalCfg.USER_DATAS.userHeadimgurl == this.url){
            this.node_choice.active = true;
        };
    },

    btnClick: function(button) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.userinfoUpdateReq();
    },

    userinfoUpdateReq: function() {
        let parm = {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            imageurl: this.url
        };
        if (Object.keys(parm).length > 2) {
            let url = GlobalCfg.HTTP_USER_LOGIN + '/v1/userinfoupdate';
            CommonFun.getInstance().httpPost(url, parm, (jsonObj) => {
                if (jsonObj.result == 0) {
                    GlobalCfg.USER_DATAS.userHeadimgurl = parm.imageurl;
                    ClientNotify.send(
                        GlobalCfg.MSG_TYPE.clientMsg, 
                        {msgCode: GlobalCfg.CLIENT_MSG_ID.UPDATE_USER_INFO, msgData: {userHeadimgurl: parm.imageurl, nickname: GlobalCfg.USER_DATAS.userName}}
                    );
                    if (CommonFun.getInstance().isValidForScr(this) && CommonFun.getInstance().isValidForScr(this.changeHeadCtrl)){
                        this.changeHeadCtrl.node.destroy();
                    };
                    CommonFun.getInstance().showTips("Avatar modified successfully");
                } 
                else {
                    CommonFun.getInstance().showTips(jsonObj.msg);
                }
            });
        } 

    },

    loadHeadSp: function(headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl,{ext: '.png'}, (err, texture) => {
                if(!err && cc.isValid(this) && cc.isValid(heaSprite)){
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth/heaSprite.node.width);
                }
            });
        }
    },
});
