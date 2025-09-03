import Constants from "../Constants";
import SystemData, { dc, field } from "../framework/SystemData";


@dc("SettingData")
export default class SettingData extends SystemData{

    init(){
        
    }


    @field()
    //是否播放音效
    isPlaySfx:boolean = true;
    //是否播放背景音乐
    @field()
    isPlayBgm:boolean = true;
    //是否开启振动提示
    @field()
    isVibrateEnabled:boolean  = true;

    //选择的语言，默认英语;
    @field()
    currLanguage:string ='en';
    //语言是否已锁定
    @field()
    lockLanguage:boolean =false;

    //debug相关
    @field() //是否开启debug
    isDebug:boolean=false;
    @field() //是否开启uidebug
    uiDebug:boolean=false;  
    
    @field() //当前版本号
    version:string="V1.1.9";      

    @field() //gpdr是否已确认
    gdprFlag:boolean=false; 

    constructor()
    {
        super();
        // onexit game =>save
    }

}

export var settingData:SettingData = SystemData.register(SettingData)