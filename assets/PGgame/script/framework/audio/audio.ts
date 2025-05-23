import { env } from "../../app/env";

export enum AudioClipName {
    CLAIMCOINS = "claimCoins",
    CLICKBTN = "clickBtn",
    BGM = "bgm",
}

export class uAudio {
    private static instance: uAudio;
    private constructor() { }

    private state: boolean = true;
    private nextBgm: string = "";

    public static getInstance(): uAudio {
        if (!this.instance) {
            this.instance = new uAudio();
        }

        return this.instance;
    }

    private audioCache: Map<string, cc.AudioClip> = new Map();
    private audioIds: Map<string, Array<number>> = new Map();

    /**
     * 增加音乐/音效缓存
     * @param name 音乐/音效名称
     * @param clip 音乐/音效
     */
    public addClip(name: string, clip: cc.AudioClip) {
        this.audioCache.set(name, clip);
    }

    /**
     * 移除音乐/音效
     * @param name 音乐/音效名称
     */
    public removeClip(name: string) {
        this.audioCache.delete(name);
    }

    /**
     * 清空缓存
     */
    public clear() {
        this.audioCache.clear();
    }

    /**
     * 播放音乐
     * @param name 音乐名称
     * @param clip 音乐
     * @returns
     */
    public playMusic(name: string, clip?: cc.AudioClip): void {
        if (!this.state) {
            this.nextBgm = name;
            return;
        }

        let audioClip = this.audioCache.get(name);
        if (!audioClip) {
            if (!clip) {
                return;
            }

            audioClip = clip;
            this.audioCache.set(name, audioClip);
        }

        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(audioClip, true);
    }

    public stopMusic() {
        cc.audioEngine.stopMusic();
    }

    /**
     * 播放音效
     * @param name 音效名称
     * @param clip 音效
     * @returns
     */
    public playEffect(name: string, clip?: cc.AudioClip, loop: boolean = false): void {
        if (!this.state) {
            return;
        }
        // tcLog.log("playEffect:", name);

        let audioClip = this.audioCache.get(name);
        if (!audioClip) {
            if (!clip) {
                return;
            }

            audioClip = clip;
            this.audioCache.set(name, audioClip);
        }

        const audioId = cc.audioEngine.playEffect(audioClip, loop);

        const m = this.audioIds.get(name);
        if (!m) {
            this.audioIds.set(name, [audioId]);
        } else {
            m.push(audioId);
            this.audioIds.set(name, m);
        }
        //循环播放则需要手动停止
        if (loop) {
            return;
        }
        //播放完后将此音效的id删除
        const delayTime = audioClip.duration;
        setTimeout(() => {
            this.stopEffect(name, audioId);
        }, delayTime * 1000);
    }

    /**
     * 停止播放音效
     * @param name 音效名称
     * @param clip 音效
     * @returns
     */
    public stopEffect(name: string, audioId?: number): void {
        const m = this.audioIds.get(name);
        m?.forEach((value, index) => {
            if (!audioId) {
                cc.audioEngine.stopEffect(value);
            } else {
                if (value === audioId) {
                    m.splice(index, 1);
                    cc.audioEngine.stopEffect(value);
                }
            }
        });
        this.audioIds.delete(name);
    }

    public stopAllEffect() {
        cc.audioEngine.stopAllEffects();

        this.audioIds.clear();
    }

    /**
     * 设置音乐音量
     * @param volume 音量
     */
    public setMusicVolume(volume?: number) {
        cc.audioEngine.setMusicVolume(volume ?? 1);
    }

    public getMusicVolume() {
        return cc.audioEngine.getMusicVolume();
    }

    /**
     * 设置音效音量
     * @param volume 音量
     */
    public setEffectVolume(volume?: number) {
        env.application.soundVolume = volume ?? 1;
        cc.audioEngine.setEffectsVolume(volume ?? 1);
    }

    public pauseAll() {
        this.state = false;
        this.nextBgm = "";
        cc.audioEngine.pauseAll();
    }

    public resumeAll() {
        this.state = true;
        cc.audioEngine.resumeAll();

        if (this.nextBgm === "") {
            return;
        }

        this.playMusic(this.nextBgm);
    }
}
