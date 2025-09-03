export default class SpriteFrameCache
{
    static _instance:SpriteFrameCache;

    static get instance()
    {
        if(this._instance == null)
        {
            this._instance = new SpriteFrameCache();
        }
        return this._instance;
    }

    private frames = new Map<string, cc.SpriteFrame>(); 
   // private frames:{[index:string]:cc.SpriteFrame} = {};
    async getSpriteFrame(url:string):Promise<cc.SpriteFrame>
    {
        let frame = this.frames.get(url);
        
        if(frame == null||frame.name==null||frame.name=='')
        {
            return new Promise<cc.SpriteFrame>((resolve,reject)=>{
                //console.log("[SpriteFrameCache] request image:" + url)
                if(!url ||url == "") {
                    reject("empty-url")
                    return;
                }
                if ( url.indexOf("http") == -1)
                {
                    cc.loader.loadRes(url,cc.SpriteFrame,(error,frame)=>{
                        if(error){reject();return}
                        if(frame)
                        {
                            this.addSpriteFrame(url ,frame)
                            resolve(frame)
                        }else{
                            reject()
                        }
                    })
                }else{
                    cc.loader.load({url: url, type: 'png'}, (error, texture) =>{
                        if(error){reject();return}
                        if(texture)
                        {
                            frame = new cc.SpriteFrame(texture);
                            this.addSpriteFrame(url ,frame)
                            resolve(frame)
                        }else{
                            reject()
                        }
                    });
                }
            })
        }
        return new Promise<cc.SpriteFrame>((resolve,reject)=>resolve(frame));
        
    }

    addSpriteFrame(url: string, frame: any): any {

        this.frames.set(url,frame);
        return frame;
    }


    clear() {
        if(this.frames!=null){
            this.frames.forEach(function (value, key) {
                let frame =  this.frames.get(key);
                cc.loader.release(frame);

            })
            this.frames.clear();
        }
    }

    remove(k)
    {
        let frame = this.frames.get(k)
        cc.loader.release(frame);
        this.frames.delete(k)
    }

}