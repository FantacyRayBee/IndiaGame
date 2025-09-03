import SpriteFrameCache from "../SpriteFrameCache";

export default class CommonTool
{
    static loadJson(path)
    {
        return new Promise((resolve,reject)=>{
            cc.loader.loadRes(path ,cc.JsonAsset,(errorcode,data)=>{
                if(errorcode){reject();return}
                resolve(data.json)
            })
        })
    }

    static sleep(timeout)
    {
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve()
            }, timeout * 1000)
        })
        
    }

    static setDisplay(sp,url)
    {
        SpriteFrameCache.instance.getSpriteFrame(url).then(
            sf=>{
            sp.spriteFrame = sf
        })
    }


   
   //获取一个标准时间是一年内的第几周
   static theWeekOfYear(curDate) {  
        /* 
        date1是当前日期 
        date2是当年第一天 
        d是当前日期是今年第多少天 
        用d + 当前年的第一天的周差距的和在除以7就是本年第几周 
        */  
        var a = curDate.getFullYear();  
        var b = curDate.getMonth() + 1;  
        var c = curDate.getDate();  
    
        var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),  
            d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);  
        return Math.ceil(  
            (d + ((date2.getDay() + 1) - 1)) / 7  
        );  
    };



    static setGlobalInstance(obj,name?){
        if(name) {
            window[name] = obj;
        }else{
            if (obj.__classname__){
                window[obj.__classname__] = obj;
            } else {
                console.warn("g.setGlobalInstance:register failed");
            }
        }
    };

    static getGlobal(s){
        if(s==null|| s==undefined)
            return window;
        else
            return window[s];
    };

static getRandomByInt (min, max) {
    if(max == null) {max = min; min = 0;}
    var val = Math.random() * (max - min);
    return Math.floor(val) + min;
};

static getRandomByArray(arr){
    if(arr)
        return arr[this.getRandomByInt(0,arr.length)]
};



static getRandomByFloat (min,max){
    return Math.random() * (max - min) + min;
};

    //根据概率取是否命中 rate:命中概率
public static getRatioHit(rate:number){
    let tmp = CommonTool.getRandomByInt(0, 100);
   // console.log("tmp",tmp);
    if (tmp<=rate){
        return true;
    }else{
        return false;
    }
}

static foreachNode(node,callback,target){
    if (node == null || node == undefined) return;
    for (var i = 0 ;i <node.childrenCount;i++)
    {
        var child = node.children[i];
        callback.call(target,child);
        if (child.childrenCount > 0 )
        {
            this.foreachNode(child,callback,target)
        } 
    }
};


static execScript(exp){
    var parts = exp.split(".")
    if (parts.length >= 2){
        var left = parts[0];
        //ignore (exp)
        //todo: load params from global object
        var right = parts[1].replace(/\(.*\)/,"")
        var gobj = window[left]
        if(gobj )
        {
            var func = gobj[right];
            if (func)
            {
                func.call(gobj);
            }
        }
    }
};


static shuffleAndCopyTriple<T>(inputArray: T[]): T[] {
    // 复制每个值三次
    const tripledArray = inputArray.reduce((acc, val) => acc.concat([val, val, val]), [] as T[]);

    // 随机打乱数组
    for (let i = tripledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tripledArray[i], tripledArray[j]] = [tripledArray[j], tripledArray[i]];
    }

    return tripledArray;
}


static isNextDay(time){
    return this.isGreaterDate(new Date(),new Date(time))
}

//判断now和before相比是否过了一天
static isGreaterDate(now,before)
{
    var diff = now.getTime() - before.getTime() 
    if(diff > 86400000) // 24*60*60*1000
    {
        return true;
    }else{
        if (diff > 0 )
            return now.getDate() != before.getDate()
        else 
            return false; 
    }
};


//判断两个日期的大小
static compareDate(date1:string,date2:string){
    let d1 = Date.parse(date1);
    let d2 = Date.parse(date2);
    if(d2>d1){
        return true;
    }else{
        return false;
    }
};

    /**
     *  比较2个时间的大小，返回相差多少天和小时分钟秒
     * @param d1 
     * @param d2 
     * @returns 
     */
     static compareDate2(d1,d2){
        var date1 = new Date(d1);
        if(d2){
            var date2 = new Date(d2);
        }else{
            var date2 = new Date();
        }
        let ms:number = Math.abs(date2.getTime() - date1.getTime());
        let hm=1000;
        let mi=hm*60;
        let hh=mi*60;
        let dd=hh*24;
        let day=Math.floor(ms/dd);
        let hour= Math.floor((ms-day*dd)/hh);
        let minute = (ms - day * dd - hour * hh) / mi;  
        let second = (ms - day * dd - hour * hh - minute * mi) / hm;  
        return [day,hour,minute,second];
    }


static shuffle(self,a?) {
    if (void 0 === a || 0 >= a || a > self.length) a = self.length;
    for (a -= 1; 0 <= a; a--) {
        var b = 0 | (Math.random()*0x00ffffff) % (a + 1)
        let c = self[a];
        self[a] = self[b];
        self[b] = c
    }
};

    


    static generate_action(params){
        let scale_action = cc.scaleTo(params.time, params.scale_x, params.scale_y)
        return scale_action
    }

    //弹性效果 果冻效果 
    static  jellyJump(node)
    {
        let  spawn_action1 = this.generate_action({time : 0.06, scale_x : 0.7, scale_y : 0.7, scale_z: 1})
        // let  spawn_action2 = this.generate_action({time : 0.12, scale_x : 1.3, scale_y  :1.3, scale_z :1})
        let  spawn_action3 = this.generate_action({time : 0.07, scale_x : 1, scale_y  :1.4, scale_z :1})
        // let  spawn_action4 = this.generate_action({time : 0.07, scale_x : 1.3, scale_y  :1.3, scale_z: 1})
        // let  spawn_action5 = this.generate_action({time : 0.07, scale_x : 1.2, scale_y : 1.2, scale_z : 1})
        let spawn_action5 = cc.scaleTo(0.8, 1.3).easing(cc.easeElasticOut(0.3));
        let  seq_actions = cc.sequence(spawn_action1,
            //  spawn_action2,
                spawn_action3,
                // spawn_action4,
                spawn_action5)
        node.runAction(seq_actions);
    }

    static jellyJump2(node,from,scale)
    {
        node.scale = from;
        let act = cc.scaleTo(0.8, scale,scale).easing(cc.easeElasticOut(0.3));
        node.runAction(act)
    }

    static moveBezier(prefab,from,to,callback = null,dur = 1,delay = 0){
        let sprite = cc.instantiate(prefab)
        sprite.opacity = 255;
        sprite.setPosition(from)

        let bezier = []
        let x = from.x, y = from.y
        let ex = to.x, ey = to.y;
        bezier[0] = cc.v2(x, y)
        bezier[1] = cc.v2(x + Math.abs(ex - x+ 100) * 0.5, y + Math.abs(ey - y+100) * 0.5)
        bezier[2] = cc.v2(ex, ey)

        sprite.runAction(cc.sequence(cc.delayTime(delay),cc.bezierTo(dur, bezier) , cc.fadeOut(0.3),cc.callFunc(callback)))
        return sprite;
    }
    
    //适配屏幕
    static   fitScreen(node){
        if(node==null){
            return;
        }
        //适配分辨率
        let winSizePixels=cc.winSize;
        let canvas = node.getComponent(cc.Canvas);
        if(winSizePixels.width>winSizePixels.height){           
            canvas.fitHeight = true;
            canvas.fitWidth = false;
        }else{
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        }
    }

    //是否全面屏手机
    static  isFullScreen(){
            //适配分辨率
            let winSizePixels=cc.winSize;
            let num=winSizePixels.height/winSizePixels.width;
            console.log('isFullScreen',num);
            if(num>1.96){
                return true;
            }else{
                return false;
            }
    }

    //显示分数
    public static async  showScore(scoreLabel:cc.Label,addScore:number,intervalTime?:number){ 
            if(scoreLabel==null||addScore<=0){
                return;
            }
            if(intervalTime==null||intervalTime==0){
                intervalTime=0.1;
            }
            if(addScore>3){
                intervalTime=(intervalTime*4)/addScore;
            }  
            let startScore= parseInt(scoreLabel.string);     
            let endScore= startScore+addScore;   
            for (let index = startScore; index <=endScore; index++) {
                scoreLabel.string = index.toString(); 
                await this.sleep(intervalTime);
            }
            
            scoreLabel.string=(startScore+addScore)+'';      
            
    }

    //使用魔法道具时调用，目标是对已经改变了id的goods进行重新整理，确保都是33成对
    //入参 changeId，这次魔法道具改变的目标id，arr：原来的商品id数组
    public static processArrayWithId(arr: number[], changeId: number): string[] {

        const result=[];
    
        const length = arr.length;
    
        if (length % 3 === 1) {
            arr.splice(length - 1, 0, changeId);
        } else if (length % 3 === 2) {
            arr.splice(length - 1, 0, changeId);
            arr.splice(length - 2, 0, changeId);
        }
    
        for (let i = 0; i < arr.length; i += 3) {
            const key = arr[i + 2];
            const value1 = arr[i];
            const value2 = arr[i + 1];
            result.push(key+"_"+value1);
            result.push(key+"_"+value2);
        }
    
        return result;
    }
    

}