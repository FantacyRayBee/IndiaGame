
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Button,
        btnShare: cc.Button,
    },

    start() {
        this.btnClose.node.on('click',()=>{
            this.node.destroy();
        });
        this.btnShare.node.on('click',()=>{
            let shareUrl = `Your cash will expire in three hours, download the No.1 card game in India to receive your cash, do not let it go！\ ${GlobalCfg.APP_SHARE_URL}?inviteCode=${GlobalCfg.CHANNEL_INFO}_${GlobalCfg.USER_DATAS.inviteCode}`;
            APPManager.Share(shareUrl);
            this.node.destroy();
        });
    },
});
