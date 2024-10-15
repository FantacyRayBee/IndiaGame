

cc.Class({
    extends: require('UINode'),

    properties: {
        labs : [cc.Label],
        sprite_bg : cc.Sprite,
       
    },

    
    setwinnerIndex:function(date){
        let imgUrl = date.bigWinner.imgUrl
        this.labs[0].string = CommonFun.getInstance().getStrByLength(date.bigWinner.nickname, 15);
        this.labs[1].string = this.getLocalTime(date.time)
        this.labs[2].string = FloatCalculation.accDiv(date.bet,100);
        this.labs[3].string = FloatCalculation.accDiv(date.win,100);
        this.loadHeadSp(imgUrl, 64, this.sprite_bg);
    },

    getLocalTime(nS) { 
        // let time = new Date(nS*1000);
        // time = time.toLocaleString(); 
        // return time.replace('/','-');

        let time = new Date(nS*1000)
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let date = time.getDate()
        let hours = time.getHours()
        let minute = time.getMinutes()
        let second = time.getSeconds()

        if (month < 10) { month = '0' + month }
        if (date < 10) { date = '0' + date }
        if (hours < 10) { hours = '0' + hours }
        if (minute < 10) { minute = '0' + minute }
        if (second < 10) { second = '0' + second }
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
    },



    onLoad () {},

    start () {

    },

    // update (dt) {},
});
