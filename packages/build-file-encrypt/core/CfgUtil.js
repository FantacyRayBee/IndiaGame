let FS = require('fire-fs');

let self = module.exports = {
    cfgData: {
        isEncrypt: false,
        isImageEncrypt: true,
        isTextEncrypt: true,
        isAudioEncrypt: true,
        password: '',
    },

    randomPassword(size) {
        let seed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ];//数组
        seedlength = seed.length;//数组长度
        let createPassword = '';
        for (i = 0; i < size; i++) {
            j = Math.floor(Math.random() * seedlength);
            createPassword += seed[j];
        }
        return createPassword;
    },

    setConfig(isEncrypt, isImageEncrypt, isTextEncrypt, isAudioEncrypt, password) {
        this.cfgData.isEncrypt = isEncrypt;
        this.cfgData.isImageEncrypt = isImageEncrypt;
        this.cfgData.isTextEncrypt = isTextEncrypt;
        this.cfgData.isAudioEncrypt = isAudioEncrypt;
        this.cfgData.password = password;
        this.saveConfig();
    },

    saveConfig() {
        let configFilePath = self._getAppCfgPath();
        FS.writeFile(configFilePath, JSON.stringify(this.cfgData), function (error) {
            if (!error) {
                Editor.log("保存配置成功!");
            }
        }.bind(this));
    },
    cleanConfig() {
        FS.unlink(this._getAppCfgPath());
    },
    _getAppCfgPath() {
        return Editor.url('packages://build-file-encrypt/save/cfg.json');
    },
    initCfg(cb) {
        self.cfgData.password = this.randomPassword(8);

        let configFilePath = this._getAppCfgPath();
        if (FS.existsSync(configFilePath)) {
            Editor.log("cfg path: " + configFilePath);
            let data = FS.readFileSync(configFilePath, 'utf-8');
            let saveData = JSON.parse(data.toString());
            for (let value in saveData) {
                self.cfgData[value] = saveData[value];
            }
            if (cb) {
                cb(self.cfgData);
            }

        } else {
            if (cb) {
                cb(self.cfgData);
            }
        }
    }
};