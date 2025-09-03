//调用android代码公共类
export default class NativeUtils{

    //调用评价接口
    static gotoRate(){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return;
        }
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/NetworkManager", "gotoPlayStore", "()V");
    }

    //判断网络是否可用
    static isNet(){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return true;
        }
       var res=jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/NetworkManager", "isNet", "()Z");
       console.log("判断网络是否可用:",res);
       return res;
   }

       //事件打点
    static dotAdjustEvent(codeId,param?){     
        if(param==null){
            param="y";
        }
        if(cc.sys.os==cc.sys.OS_ANDROID){         
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/AdjustManager", "putEvent", "(Ljava/lang/String;Ljava/lang/String;)V", codeId, param);
        }
    }
    

     //获取当前语言
    static getCurrentLanguage(){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return 'en';
        }
       // console.log("获取当前语言")
       return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/UtilManager", "getCurrentLanguage", "()Ljava/lang/String;");
       
    }

    //获取versionname
    static getVersionName(){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return 'V1.1.8';
        }
       // console.log("获取当前语言")
       return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/UtilManager", "getVersionName", "()Ljava/lang/String;");
       
    }

    //获取国家code
    static getCountryCode():string{
        if(cc.sys.platform!=cc.sys.ANDROID){
            return 'US';
        }
       // console.log("获取当前语言")
       return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/UtilManager", "getCountryCode", "()Ljava/lang/String;");
       
    }

        //调用振动接口 单位毫秒
    static playVibrate(time){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return;
        }
        if(time==null){
            time=1;
        }
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/UtilManager", "playVibrate", "(I)V",time);
    }

    //设置欧盟弹窗协议
    static setHasUserConsent(){
        if(cc.sys.platform!=cc.sys.ANDROID){
            return;
        }
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/util/UtilManager", "setHasUserConsent", "()V");
    }

}    
window["NativeUtils"] = NativeUtils;