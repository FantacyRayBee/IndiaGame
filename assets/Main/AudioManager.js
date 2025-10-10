
cc.Class({
    extends: require('AudioBase'),

    ctor() {
        this.soundAudioClips = {};
    },

    preloadAudioClip() {
        let soundArry = ["MainSound/lobby", "MainSound/button", "MainSound/back"];
        for (let index = 0; index < soundArry.length; index++) {
            const element = soundArry[index];
            ResourcesBundle.load(element, cc.AudioClip, (err, audioClip)=> {
                if (!err && this) {
                    this.soundAudioClips[audioClip._name] = audioClip;
                }
            });
        }
    },

    playSoundByNameInResources(soundName, loop){
        loop = loop || false;
        let clip = this.soundAudioClips[soundName];
        if (clip) {
            this.playSound(clip, loop);
        } else {
            ResourcesBundle.load("MainSound/" + soundName, cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    this.soundAudioClips[audioClip._name] = audioClip;
                    this.playSound(audioClip, loop);
                }
            });
        }
    },

    playLobby() {
        let clip = this.soundAudioClips['lobby'];
        if (clip) {
            this.playMusic(clip, true);
        } else {
            ResourcesBundle.load("MainSound/lobby", cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    this.soundAudioClips[audioClip._name] = audioClip;
                    this.playMusic(audioClip, true);
                }
            });
        }
    },

    playButton() {
        let clip = this.soundAudioClips['button'];
        if (clip) {
            this.playSound(clip, false);
        } else {
            ResourcesBundle.load("MainSound/button", cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    this.soundAudioClips[audioClip._name] = audioClip;
                    this.playSound(audioClip, false);
                }
            });
        }
    },

    playBack() {
        let clip = this.soundAudioClips['back'];
        if (clip) {
            this.playSound(clip, false);
        } else {
            ResourcesBundle.load("MainSound/back", cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    this.soundAudioClips[audioClip._name] = audioClip;
                    this.playSound(audioClip, false);
                }
            });
        }
    },
});
