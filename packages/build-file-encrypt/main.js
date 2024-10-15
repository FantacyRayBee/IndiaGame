'use strict';

let CfgUtil = require('./core/CfgUtil');
let xxtea = require('./core/xxtea');
let Fs = require("fire-fs");
let Path = require('fire-path');
let child_process = require("child_process"); 

let spinePngSize = 0;

function onBuildStart(options, callback) {
    initPlugin();

    callback();
}

function onBeforeBuildFinish(options, callback) {
    let dest = options.dest.replace(/\\/g, '/');
    let folder = dest.substring(dest.lastIndexOf('/')) + '/';

    if (self.info.flagEncrypt) {
        if (options.platform == 'android' || options.platform == 'ios' || options.platform == 'win32') {

            let logStr = "正在加密资源:";
            if (self.info.flagImageEncrypt)
                logStr += '  图像';
            if (self.info.flagTextEncrypt)
                logStr += '  文本';
            if (self.info.flagAudioEncrypt)
                logStr += '  音频';
            Editor.log(logStr);

            let resPath = options.buildPath + folder + 'res';
            Fs.stat(resPath, (err, data) => {
                if (err) {
                    // Editor.log(err);
                } else {
                    encryptionDirFileByPath(resPath);
                    Editor.log("资源加密完成");
                    callback();
                }
            })

            let assetsPath = options.buildPath + folder + 'assets';
            Fs.stat(assetsPath, (err, data) => {
                if (err) {
                    // Editor.log(err);
                } else {
                    encryptionDirFileByPath(assetsPath);
                    Editor.log("资源加密完成");
                    callback();
                }
            })

        } else {
            Editor.log("选择的平台不支持资源加密");
            callback();
        }

    } else {
        Editor.log("不执行资源加密");
        callback();
    }
}

function encryptionDirFileByPath(filePath) {
    Fs.readdirSync(filePath).forEach((node, index) => {
        let newPath = filePath + '/' + node;
        let info = Fs.statSync(newPath);
        if (info.isDirectory()) {
            encryptionDirFileByPath(newPath);
        } 
        else {
            let extName = Path.extname(node);
            switch (extName) {
                case '.png':
                    if (self.info.flagImageEncrypt) {
                        encryptionSchemeImage(newPath, true);
                    }
                    break;
                case '.jpg':
                    if (self.info.flagImageEncrypt) {
                        encryptionSchemeImage(newPath, false);
                    }
                    break;
                case '.json':
                    if (self.info.flagTextEncrypt) {
                        encryptionSchemeJson(newPath);
                    }
                    break;
                case '.mp3':
                case '.wav':
                case '.ogg':
                    if (self.info.flagAudioEncrypt) {
                        encryptionSchemeAudio(newPath);
                    }
                    break;
            }
        }
    });
}

function encryptionSchemeImage(filePath, isPng) {
    try {
        // if (isPng) {
        //     let filePathArr = filePath.split('/');
        //     let uuidStr = filePathArr[filePathArr.length - 1].split('.')[0];
        //     let assetsUrl = Editor.assetdb.uuidToUrl(uuidStr);

        //     Editor.log("filePath: ", filePath);
          
        //     if (assetsUrl) {
        //         Editor.log("assetsUrl: ", assetsUrl);

        //         let atlasUrl = assetsUrl.replace('.png', ".atlas");
        //         let jsonUrl = assetsUrl.replace('.png', ".json");
    
        //         if (Editor.assetdb.exists(atlasUrl) && Editor.assetdb.exists(jsonUrl)) {
        //             Editor.log("assetsUrl with spine");
        //             let fileData = Fs.readFileSync(filePath);
        //             let writeData = encryption(fileData);
        //             Fs.writeFileSync(filePath, writeData);
        //             spinePngSize += fileData.length;
        //         }
        //         else {
        //             Editor.log("assetsUrl with no spine");
        //             let pngquant_path = Editor.url('packages://build-file-encrypt/tool/windows/pngquant.exe');
        //             // let cmd = pngquant_path + " --transbug --force 0 --ext .png";
        //             let cmd = pngquant_path + " --transbug --force --quality=65-80 --ext .png";
        //             let exe_cmd = cmd + ' ' + filePath;
        //             child_process.exec(exe_cmd, { timeout: 3654321 }, function (error, stdout, stderr) {
        //                 // if (stderr) {
        //                 //     Editor.error("pngquant error : " + stderr);
        //                 // };
                        
        //                 let fileData = Fs.readFileSync(filePath);
        //                 let writeData = encryption(fileData);
        //                 Fs.writeFileSync(filePath, writeData);
        //             });
        //         };
    
        //     }
        //     else {
        //         Editor.log("engin with assetsUrl: ", assetsUrl);
        //         let fileData = Fs.readFileSync(filePath);
        //         let writeData = encryption(fileData);
        //         Fs.writeFileSync(filePath, writeData);
        //     };
        // }
        // else {
        //     let fileData = Fs.readFileSync(filePath);
        //     let writeData = encryption(fileData);
        //     Fs.writeFileSync(filePath, writeData);
        // }

        let fileData = Fs.readFileSync(filePath);
        let writeData = encryption(fileData);
        Fs.writeFileSync(filePath, writeData);
    } catch (e) {
        Editor.error(e);
    }
}

function encryptionSchemeJson(filePath) {
    try {
        let fileData = Fs.readFileSync(filePath);
        let dataStr = fileData.toString();

        if (dataStr.indexOf('cc.TextAsset') != -1 || dataStr.indexOf('cc.JsonAsset') != -1) {
            let writeData = encryption(fileData);

            Fs.writeFileSync(filePath, writeData);
        }

    } catch (e) {
        Editor.error(e);
    }
}

function encryptionSchemeAudio(filePath) {
    try {

        //当文件数据大小大于等于skipLength时，跳过加密，skipLength单位是字节
        const skipLength = 128000;
        let states = Fs.statSync(filePath);
        if (states.size >= skipLength) {
            return;
        }

        let fileData = Fs.readFileSync(filePath);
        let writeData = encryption(fileData);
        Fs.writeFileSync(filePath, writeData);

    } catch (e) {
        Editor.error(e);
    }
}

function encryption(fileData) {
    let encrypt_data = xxtea.encrypt(fileData, self.info.password);
    let encryptHead = toUint8Array(toUint32Array(xxtea.toBytes('encrypt_zy_'), true), false);
    let encryptHeadLength = 'encrypt_zy_'.length;
    let writeData = new Uint8Array(encryptHeadLength + encrypt_data.length);
    for (let i = 0; i < writeData.length; i++) {
        if (i < encryptHeadLength) {
            writeData[i] = encryptHead[i];
        } else {
            writeData[i] = encrypt_data[i - encryptHeadLength];
        }
    }
    return writeData;
}

function toUint8Array(v, includeLength) {
    let length = v.length;
    let n = length << 2;
    if (includeLength) {
        let m = v[length - 1];
        n -= 4;
        if ((m < n - 3) || (m > n)) {
            return null;
        }
        n = m;
    }
    let bytes = new Uint8Array(n);
    for (let i = 0; i < n; ++i) {
        bytes[i] = v[i >> 2] >> ((i & 3) << 3);
    }
    return bytes;
}

function toUint32Array(bytes, includeLength) {
    let length = bytes.length;
    let n = length >> 2;
    if ((length & 3) !== 0) {
        ++n;
    }
    let v;
    if (includeLength) {
        v = new Uint32Array(n + 1);
        v[n] = length;
    }
    else {
        v = new Uint32Array(n);
    }
    for (let i = 0; i < length; ++i) {
        v[i >> 2] |= bytes[i] << ((i & 3) << 3);
    }
    return v;
}

function initPlugin() {
    CfgUtil.initCfg(function (data) {
        if (data) {
            self.info.flagEncrypt = data.isEncrypt;
            self.info.flagImageEncrypt = data.isImageEncrypt;
            self.info.flagTextEncrypt = data.isTextEncrypt;
            self.info.flagAudioEncrypt = data.isAudioEncrypt;
            self.info.password = data.password;
            Editor.log(self.info);
        }
    }.bind(self));
}

let self = module.exports = {
    load() {
        Editor.Builder.on('build-start', onBuildStart);
        Editor.Builder.on('build-finished', onBeforeBuildFinish);
    },

    unload() {
        Editor.Builder.removeListener('build-start', onBuildStart);
        Editor.Builder.removeListener('build-finished', onBeforeBuildFinish);
    },

    info: {
        flagEncrypt: false,
        flagImageEncrypt: false,
        flagTextEncrypt: false,
        flagAudioEncrypt: false,
        password: "",
    },

    // register your ipc messages here
    messages: {
        'open'() {
            // open entry panel registered in package.json
            Editor.Panel.open('build-file-encrypt');
        },
        'popup-create-menu'(event, x, y, data) {
            let electron = require('electron');
            let BrowserWindow = electron.BrowserWindow;
            Editor.log("popup-create-menu");
            let template = [
                {
                    label: '清空日志', click() {
                        Editor.Ipc.sendToPanel('build-file-encrypt', 'build-file-encrypt:cleanLog', data);
                    }
                },
                // {type: 'separator'},
            ];
            let editorMenu = new Editor.Menu(template, event.sender);

            x = Math.floor(x);
            y = Math.floor(y);
            editorMenu.nativeMenu.popup(BrowserWindow.fromWebContents(event.sender), x, y);
            editorMenu.dispose();
        },
        'builder:query-build-options'(event) {
            Editor.Ipc.sendToPanel('build-file-encrypt', 'build-file-encrypt:queryBuildOptions', event);
        },
    }
};