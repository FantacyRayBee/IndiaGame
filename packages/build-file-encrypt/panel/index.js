// panel/index.js, this filename needs to match the one registered in package.json

let FS = require("fire-fs");
let CfgUtil = Editor.require("packages://build-file-encrypt/core/CfgUtil");

Editor.Panel.extend({
    style: FS.readFileSync(Editor.url('packages://build-file-encrypt/panel/index.css', 'utf8')) + "",
    template: FS.readFileSync(Editor.url('packages://build-file-encrypt/panel/index.html', 'utf8')) + "",

    // element and variable binding
    $: {
        logTextArea: '#logTextArea',
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        let logCtrl = this.$logTextArea;
        let logListScrollToBottom = function () {
            setTimeout(function () {
                logCtrl.scrollTop = logCtrl.scrollHeight;
            }, 10);
        };

        window.plugin = new window.Vue({
            el: this.shadowRoot,
            created() {
                Editor.log("created");
                this.initPlugin();
            },
            data: {
                logView: [],
                isEncrypt: false,
                isImageEncrypt: false,
                isTextEncrypt: false,
                isAudioEncrypt: false,
                password: "",
            },
            methods: {
                _addLog(str) {
                    let time = new Date();
                    this.logView += "[" + time.toLocaleString() + "]: " + str + "\n";
                    logListScrollToBottom();
                },
                _addLogNoTime(data) {
                    this.logView += data;
                    logListScrollToBottom();
                },

                initPlugin() {
                    CfgUtil.initCfg(function (data) {
                        if (data) {
                            this.isEncrypt = data.isEncrypt;
                            this.isImageEncrypt = data.isImageEncrypt;
                            this.isTextEncrypt = data.isTextEncrypt;
                            this.isAudioEncrypt = data.isAudioEncrypt;
                            this.password = data.password;
                        }
                    }.bind(this));
                },

                clearsTheSpecifiedString(str, deleteStr1, deleteStr2) {
                    let startNumb = str.indexOf(deleteStr1);
                    if (startNumb != -1) {
                        let endNumb = str.indexOf(deleteStr2);
                        let deleteStr = str.substring(startNumb, endNumb + deleteStr2.length);
                        return str.replace(deleteStr, '');

                    } else {
                        return str;
                    }
                },

                onLogViewMenu(event) {
                    Editor.Ipc.sendToMain('build-file-encrypt:popup-create-menu', event.x, event.y, null);
                },

                queryBuildOptions(a) {
                },

                saveAllData() {
                    CfgUtil.setConfig(this.isEncrypt, this.isImageEncrypt, this.isTextEncrypt, this.isAudioEncrypt, this.password);
                },

                onIsEncrypt() {
                    this.isEncrypt = !this.isEncrypt;
                    this.saveAllData();
                    this._addLog('是否开启加密功能: ' + this.isEncrypt);
                },

                onIsImageEncrypt() {
                    this.isImageEncrypt = !this.isImageEncrypt;
                    this.saveAllData();
                    this._addLog('加密图片: ' + this.isImageEncrypt);
                },

                onIsTextEncrypt() {
                    this.isTextEncrypt = !this.isTextEncrypt;
                    this.saveAllData();
                    this._addLog('加密文本: ' + this.isTextEncrypt);
                },

                onIsAudioEncrypt() {
                    this.isAudioEncrypt = !this.isAudioEncrypt;
                    this.saveAllData();
                    this._addLog('加密音频: ' + this.isAudioEncrypt);
                },

                onPassword() {
                    this.saveAllData();
                },

                onModified() {
                    if (!this.isEncrypt) {
                        this._addLog("请先打开加密功能");
                        return;
                    }
                    if (!this.password) {
                        this._addLog("请输入加密码");
                        return;
                    }
                    if (this.password.length < 6) {
                        this._addLog("要求加密码长度至少在6位以上");
                        return;
                    }
                    this._addLog("开始修改引擎层文件加入解密代码!");

                    let hFilePath = Editor.Project.path + '/build/jsb-default/frameworks/cocos2d-x/cocos/platform/CCFileUtils.h';
                    if (!FS.existsSync(hFilePath)) {
                        window.plugin._addLog("没有发现文件: " + hFilePath);
                        return;
                    }

                    let filedata = FS.readFileSync(hFilePath, 'utf-8');

                    filedata = this.clearsTheSpecifiedString(filedata, '/*encrypt1_0*/', '/*encrypt1_1*/');
                    filedata = filedata.replace('virtual Data getDataFromFile(const std::string& filename);\n',
                        'virtual Data getDataFromFile(const std::string& filename);\n' +
                        '    /*encrypt1_0*/\n' +
                        '    bool isEncryptedFile(const unsigned char * data, ssize_t dataLen);\n' +
                        '    void encryptedFile(Data & d);\n' +
                        '    bool isEncryptedString(std:: string & s);\n' +
                        '    void encryptedString(std:: string & s);\n' +
                        '    /*encrypt1_1*/');
                    this._addLog("/*encrypt1*/ 添加完成");

                    FS.writeFileSync(hFilePath, filedata);

                    let cppFilePath = Editor.Project.path + '/build/jsb-default/frameworks/cocos2d-x/cocos/platform/CCFileUtils.cpp';
                    if (!FS.existsSync(cppFilePath)) {
                        window.plugin._addLog("没有发现文件: " + cppFilePath);
                        return;
                    }
                    let data = FS.readFileSync(cppFilePath, 'utf-8');

                    data = this.clearsTheSpecifiedString(data, '/*encrypt2_0*/', '/*encrypt2_1*/');
                    data = data.replace('#include <regex>\n',
                        '#include <regex>\n' +
                        '/*encrypt2_0*/\n' +
                        '#include <external/sources/xxtea/xxtea.h>\n' +
                        '/*encrypt2_1*/');
                    this._addLog("/*encrypt2*/ 添加完成");

                    data = this.clearsTheSpecifiedString(data, '/*encrypt3_0*/', '/*encrypt3_1*/');
                    data = data.replace('getContents(filename, &s);\n',
                        'getContents(filename, &s);\n' +
                        '    /*encrypt3_0*/\n' +
                        '    try\n' +
                        '    {\n' +
                        '        if(isEncryptedString(s))\n' +
                        '        {\n' +
                        '            encryptedString(s);\n' +
                        '        }\n' +
                        '    }\n' +
                        '    catch(...)\n' +
                        '    {\n' +
                        '    }\n' +
                        '    /*encrypt3_1*/');
                    this._addLog("/*encrypt3*/ 添加完成");

                    data = this.clearsTheSpecifiedString(data, '/*encrypt4_0*/', '/*encrypt4_1*/\n');
                    data = data.replace('Data FileUtils::getDataFromFile(const std::string& filename)',
                        '/*encrypt4_0*/\n' +
                        'bool FileUtils::isEncryptedFile(const unsigned char *data, ssize_t dataLen)\n' +
                        '{\n' +
                        '    const char *ENCRYPT_SIGNATURE = "encrypt_zy_";\n' +
                        '    xxtea_long signLen = strlen(ENCRYPT_SIGNATURE);\n' +
                        '    \n' +
                        '    if (dataLen <= signLen)\n' +
                        '    {\n' +
                        '        return false;\n' +
                        '    }\n' +
                        '    \n' +
                        '    return memcmp(ENCRYPT_SIGNATURE, data, signLen) == 0;\n' +
                        '}\n' +
                        '\n' +
                        'void FileUtils::encryptedFile(Data &d)\n' +
                        '{\n' +
                        '    const char *sign = "encrypt_zy_";\n' +
                        '    xxtea_long signLen = strlen(sign);\n' +
                        '    xxtea_long ret_len;\n' +
                        '    unsigned char key[100] = "'+this.password+'";\n' +
                        '    xxtea_long keyLen = strlen("'+this.password+'");\n' +
                        '    unsigned char *ret_data = xxtea_decrypt(const_cast<unsigned char*>(d.getBytes()) + signLen,\n' +
                        '                                            (xxtea_long)d.getSize() - signLen, key, keyLen,\n' +
                        '                                            &ret_len);\n' +
                        ' \n' +
                        '    d.copy(ret_data, ret_len);\n' +
                        '}\n' +
                        ' \n' +
                        'bool FileUtils::isEncryptedString(std::string &s)\n' +
                        '{\n' +
                        '    const char *ENCRYPT_SIGNATURE = "encrypt_zy_";\n' +
                        '    xxtea_long signLen = strlen(ENCRYPT_SIGNATURE);\n' +
                        '\n' +
                        '    if (s.length() <= signLen)\n' +
                        '    {\n' +
                        '        return false;\n' +
                        '    }\n' +
                        '\n' +
                        '    return memcmp(ENCRYPT_SIGNATURE, s.c_str(), signLen) == 0;\n' +
                        '}\n' +
                        '\n' +
                        'void FileUtils::encryptedString(std::string &s)\n' +
                        '{\n' +
                        '    const char *sign = "encrypt_zy_";\n' +
                        '    xxtea_long signLen = strlen(sign);\n' +
                        '    xxtea_long ret_len;\n' +
                        '    unsigned char key[100] = "'+this.password+'";\n' +
                        '    xxtea_long keyLen = strlen("'+this.password+'");\n' +
                        '    unsigned char *ret_data = xxtea_decrypt(const_cast<unsigned char*>((unsigned char*)s.c_str()) + signLen,\n' +
                        '                                            (xxtea_long)s.length() - signLen, key, keyLen,\n' +
                        '                                            &ret_len);\n' +
                        '    s.assign((char *)ret_data, ret_len);\n' +
                        '}\n' +
                        '/*encrypt4_1*/\n' +
                        'Data FileUtils::getDataFromFile(const std::string& filename)');
                    this._addLog("/*encrypt4*/ 添加完成");

                    data = this.clearsTheSpecifiedString(data, '/*encrypt5_0*/', '/*encrypt5_1*/');
                    data = data.replace('getContents(filename, &d);\n',
                        'getContents(filename, &d);\n' +
                        '    /*encrypt5_0*/\n' +
                        '    try\n' +
                        '    {\n' +
                        '        if(!d.isNull() && isEncryptedFile(d.getBytes(), d.getSize()))\n' +
                        '        {\n' +
                        '            encryptedFile(d);\n' +
                        '        }\n' +
                        '    }\n' +
                        '    catch(...)\n' +
                        '    {\n' +
                        '    }\n' +
                        '    /*encrypt5_1*/');
                    this._addLog("/*encrypt5*/ 添加完成");

                    FS.writeFileSync(cppFilePath, data);

                    this._addLog("解密代码添加完成");
                },
            }
        });
    },

    // register your ipc messages here
    messages: {
        'build-file-encrypt:cleanLog'(event) {
            window.plugin.logView = [];
        },
        'build-file-encrypt:queryBuildOptions'(event) {
            window.plugin.queryBuildOptions(a);
        },
    }
});