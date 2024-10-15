import { ITimer } from "./DataDef";

/**
 * 定时器工具类
 */
export class ScheduleUtil {
    
    private static _instance: ScheduleUtil = null;

    private _timerArr: ITimer[] = [];

    /**
     * 获取ScheduleUtil单例
     * @returns ScheduleUtil单例
     */
    public static getInstance(): ScheduleUtil {
        if (!ScheduleUtil._instance) {
            ScheduleUtil._instance = new ScheduleUtil();
            ScheduleUtil._instance._init();
        };
        return ScheduleUtil._instance;
    };

    private _init() {
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this._update, this);
    };

    private _update(dt: number) {
        this._timerArr = this._timerArr.filter(timer => {
            timer.tick += dt * 1000;

            if (timer.delay > 0 && timer.tick >= timer.delay) {
                timer.delay = 0;
                timer.tick = 0;
                return true;
            };
    
            if (timer.delay <= 0 && timer.tick >= timer.interval) {
                timer.tick -= timer.interval;
                timer.repeat -= 1;
                if (timer.repeat < -10) {
                    timer.repeat = -1;
                };
                if (typeof timer.func === 'function') {
                    try {
                        timer.func.call(timer.target);
                    } 
                    catch (error) {
                        console.error("Error executing timer function:", error);
                    };
                };
                return timer.repeat == 0 ? false : true;
            };
    
            return true;
        });
    };


    /**
     * 添加一个定时任务。
     * @param delay 延迟执行时间（毫秒）。
     * @param interval 重复执行间隔（毫秒）。
     * @param repeat 执行次数。1起步。若为-1，则无限重复执行。
     * @param func 执行的函数。
     * @param target 函数的调用上下文。
     */
    public add(delay: number, interval: number, repeat: number, func: Function, target: object) {
        if (repeat == 0) {
            return;
        };

        this.remove(func, target);

        let timer: ITimer = {
            tick: 0,
            delay: delay,
            interval: interval,
            repeat: repeat,
            func: func,
            target: target,
        };
        this._timerArr.push(timer);
    };


    public remove(func: Function, target: any) {
        this._timerArr = this._timerArr.filter(timer => timer.func !== func || timer.target !== target);
    };
};

