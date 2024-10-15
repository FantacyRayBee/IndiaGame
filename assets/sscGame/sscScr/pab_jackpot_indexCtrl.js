

cc.Class({
    extends: cc.Component,

    properties: {
        lsbs : [cc.Label],
        node_crad : [cc.Node]
      
    },

    onLoad () {
    },

    showDate:function(date){
        this.lsbs[0].string = this.getLocalTime(date.time)
        this.lsbs[1].string = date.winner;
        this.lsbs[2].string = FloatCalculation.accDiv(date.win,100);
        let cards = date.cards
        for (let i = 0; i < cards.length; i++) {
            let sscCradCtrl = this.node_crad[i].getComponent("sscCradCtrl");
            sscCradCtrl.setCardInfo(cards[i])
        }
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

    




    start () {

    },

    // update (dt) {},
});
