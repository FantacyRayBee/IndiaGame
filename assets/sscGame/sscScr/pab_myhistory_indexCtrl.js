

cc.Class({
    extends: cc.Component,

    properties: {
        labs : [cc.Label]
      
    },

  

    // onLoad () {},

    showDate :function (date) {   
        let sideArr = ["SET","PURE","SEQ","COLOR","PAIR","HIGH"];
        this.labs[0].string = date.pools[0].all ? FloatCalculation.accDiv(date.pools[0].all,100): "X";
        this.labs[1].string = date.pools[1].all ? FloatCalculation.accDiv(date.pools[1].all,100) : "X";
        this.labs[2].string = date.pools[2].all ? FloatCalculation.accDiv(date.pools[2].all,100) : "X";
        this.labs[3].string = date.pools[3].all ? FloatCalculation.accDiv(date.pools[3].all,100) : "X";
        this.labs[4].string = date.pools[4].all ? FloatCalculation.accDiv(date.pools[4].all,100) : "X";
        this.labs[5].string = date.pools[5].all ? FloatCalculation.accDiv(date.pools[5].all,100): "X";
        this.labs[6].string = date.pools[0].self ? FloatCalculation.accDiv(date.pools[0].self,100) : "X";
        this.labs[7].string = date.pools[1].self ? FloatCalculation.accDiv(date.pools[1].self,100) : "X";
        this.labs[8].string = date.pools[2].self ? FloatCalculation.accDiv(date.pools[2].self,100) : "X";
        this.labs[9].string = date.pools[3].self ? FloatCalculation.accDiv(date.pools[3].self,100) : "X";
        this.labs[10].string = date.pools[4].self ? FloatCalculation.accDiv(date.pools[4].self,100) : "X";
        this.labs[11].string = date.pools[5].self ? FloatCalculation.accDiv(date.pools[5].self,100): "X";
        this.labs[12].string = this.getLocalTime(date.time);
        this.labs[13].string = sideArr[date.side];
        this.labs[14].string = FloatCalculation.accDiv(date.calc,100);
        
    },

    getLocalTime(nS) {  
        // let time = new Date(nS*1000);
        // time = time.toLocaleString(); 
        // return time.replace('/','-')
       
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
